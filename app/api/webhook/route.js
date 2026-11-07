import { ingestPaddleWebhook } from "@/lib/webhooks/sqliteWebhookIngestion";
import crypto from "node:crypto";

export const runtime = "nodejs";

const PAID_EVENT_TYPES = new Set(["transaction.paid", "transaction.completed"]);
const PAID_TRANSACTION_STATUSES = new Set(["paid", "completed"]);

function parsePaddleSignature(signatureHeader) {
  if (!signatureHeader) return null;
  const parts = signatureHeader.split(";");
  const parsed = {};

  for (const rawPart of parts) {
    const part = rawPart.trim();
    const separator = part.indexOf("=");
    if (separator <= 0) continue;
    const key = part.slice(0, separator);
    const value = part.slice(separator + 1);
    if (!value) continue;
    parsed[key] = value;
  }

  if (!parsed.ts || !parsed.h1) return null;
  return { ts: parsed.ts, h1: parsed.h1 };
}

function verifyPaddleSignature({ rawBody, signatureHeader, webhookSecret, timestampToleranceSec = 300 }) {
  if (!webhookSecret) return false;

  const signature = parsePaddleSignature(signatureHeader);
  if (!signature) return false;

  const tsInt = Number(signature.ts);
  if (!Number.isFinite(tsInt)) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - tsInt) > timestampToleranceSec) {
    return false;
  }

  const signedPayload = `${signature.ts}:${rawBody}`;
  const expectedHex = crypto.createHmac("sha256", webhookSecret).update(signedPayload, "utf8").digest("hex");
  const expected = Buffer.from(expectedHex, "hex");
  const received = Buffer.from(signature.h1, "hex");
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

function shouldForwardEvent(event) {
  const eventType = String(event?.event_type ?? "");
  const transactionStatus = String(event?.data?.status ?? "").toLowerCase();
  return PAID_EVENT_TYPES.has(eventType) && PAID_TRANSACTION_STATUSES.has(transactionStatus);
}

async function forwardToOrderDb(rawBody) {
  const orderDbUrl = process.env.ORDER_DB_URL;
  if (!orderDbUrl) {
    return { attempted: false };
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (process.env.ORDER_DB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.ORDER_DB_TOKEN}`;
  }

  const response = await fetch(orderDbUrl, {
    method: "POST",
    headers,
    body: rawBody,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Order DB forward failed (${response.status}): ${errorBody.slice(0, 240)}`);
  }

  return { attempted: true };
}

export async function POST(request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("paddle-signature");
  try {
    const hasRemoteOrderDb = Boolean(process.env.ORDER_DB_URL);
    if (hasRemoteOrderDb) {
      const isValidSignature = verifyPaddleSignature({
        rawBody,
        signatureHeader,
        webhookSecret: process.env.PADDLE_WEBHOOK_SECRET,
        timestampToleranceSec: Number(process.env.PADDLE_WEBHOOK_MAX_SKEW_SEC ?? 300),
      });

      if (!isValidSignature) {
        return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
      }

      let event;
      try {
        event = JSON.parse(rawBody);
      } catch {
        return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
      }

      if (shouldForwardEvent(event)) {
        await forwardToOrderDb(rawBody);
        return Response.json({
          received: true,
          duplicate: false,
          ignored: false,
          reason: null,
          transactionId: event?.data?.id ?? null,
          notificationId: event?.notification_id ?? event?.event_id ?? null,
        });
      }

      return Response.json({
        received: true,
        duplicate: false,
        ignored: true,
        reason: "not_paid_or_not_completed",
        transactionId: event?.data?.id ?? null,
        notificationId: event?.notification_id ?? event?.event_id ?? null,
      });
    }

    const result = ingestPaddleWebhook({
      rawBody,
      signatureHeader,
      webhookSecret: process.env.PADDLE_WEBHOOK_SECRET,
      timestampToleranceSec: Number(process.env.PADDLE_WEBHOOK_MAX_SKEW_SEC ?? 300),
      dbPath: process.env.ORDERS_DB_PATH,
    });

    if (result.kind === "invalid_signature") {
      return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
    if (result.kind === "invalid_json") {
      return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    if (result.kind === "misconfigured") {
      return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    return Response.json({
      received: true,
      duplicate: result.kind === "duplicate",
      ignored: result.kind === "ignored",
      reason: result.reason ?? null,
      transactionId: result.transactionId ?? null,
      notificationId: result.notificationId ?? null,
    });
  } catch (error) {
    console.error("Webhook ingestion error:", error);
    // Non-2xx keeps provider retries enabled on transient database errors.
    return Response.json({ error: "Unable to ingest webhook" }, { status: 500 });
  }
}
