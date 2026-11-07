import { ingestPaddleWebhook } from "@/lib/webhooks/sqliteWebhookIngestion";

export const runtime = "nodejs";

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

    // Forward only paid/completed transactions that were accepted for processing.
    if (result.kind === "processed") {
      await forwardToOrderDb(rawBody);
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
