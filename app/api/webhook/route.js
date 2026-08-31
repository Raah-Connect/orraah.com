import crypto from "node:crypto";
import { Resend } from "resend";
import { PRODUCT_CATALOG } from "@/lib/products";

const FOUNDER_SLOT_LIMIT = 500;

const FOUNDER_PRODUCTS = [
  {
    id: "founders-combo",
    name: "Founder Combo Kit",
    deliveryWindow: "Estimated delivery: Q1 2027",
    priceId: PRODUCT_CATALOG["founders-combo"].paddlePriceId,
  },
  {
    id: "p2p-commerce-app-store",
    name: "Peer-to-Peer Commerce & App Store",
    deliveryWindow: "Estimated delivery: Q1 2027",
    priceId: PRODUCT_CATALOG["p2p-commerce-app-store"].paddlePriceId,
  },
  {
    id: "remote-access-custom-subdomain",
    name: "Remote Access + Custom Subdomain",
    deliveryWindow: "Estimated delivery: Q4 2026",
    priceId: PRODUCT_CATALOG["remote-access-custom-subdomain"].paddlePriceId,
  },
];

const FOUNDER_PRICE_ID_TO_PRODUCT = new Map(
  FOUNDER_PRODUCTS.filter((product) => Boolean(product.priceId)).map((product) => [product.priceId, product])
);

function parsePaddleSignature(signatureHeader) {
  if (!signatureHeader) return null;
  const parts = signatureHeader.split(";").map((part) => part.trim());
  const parsed = {};

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (!key || !value) continue;
    parsed[key] = value;
  }

  if (!parsed.ts || !parsed.h1) return null;
  return { ts: parsed.ts, h1: parsed.h1 };
}

function verifyPaddleSignature(rawBody, signatureHeader, secret) {
  if (!secret) return false;
  const signature = parsePaddleSignature(signatureHeader);
  if (!signature) return false;

  const payload = `${signature.ts}:${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(payload, "utf8").digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature.h1, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function extractLineItems(eventData) {
  if (Array.isArray(eventData?.items)) return eventData.items;
  if (Array.isArray(eventData?.details?.line_items)) return eventData.details.line_items;
  if (Array.isArray(eventData?.details?.items)) return eventData.details.items;
  return [];
}

async function fetchCustomerEmail(customerId) {
  if (!customerId || !process.env.PADDLE_API_KEY) return null;

  const response = await fetch(`https://api.paddle.com/customers/${customerId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload?.data?.email ?? null;
}

function extractPriceId(item) {
  return item?.price?.id ?? item?.price_id ?? item?.priceId ?? null;
}

function extractQuantity(item) {
  const quantity = Number(item?.quantity ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function getMoneyAmount(value) {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "object") {
    const amount = value?.amount ?? value?.value;
    if (amount == null) return null;
    const parsed = Number(amount);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function buildFounderOrderPayload(event, eventData, founderPurchases, customerEmail) {
  const totals = eventData?.details?.totals ?? eventData?.totals ?? {};

  return {
    source: "paddle",
    eventId: event?.event_id ?? event?.notification_id ?? null,
    eventType: event?.event_type ?? null,
    occurredAt: event?.occurred_at ?? new Date().toISOString(),
    transactionId: eventData?.id ?? null,
    transactionStatus: eventData?.status ?? null,
    customerId: eventData?.customer_id ?? eventData?.customer?.id ?? null,
    customerEmail,
    currencyCode: eventData?.currency_code ?? totals?.currency_code ?? null,
    amountSubtotal: getMoneyAmount(totals?.subtotal),
    amountTax: getMoneyAmount(totals?.tax),
    amountTotal: getMoneyAmount(totals?.total),
    purchases: founderPurchases.map(({ product, quantity }) => ({
      productId: product.id,
      productName: product.name,
      paddlePriceId: product.priceId,
      quantity,
      deliveryWindow: product.deliveryWindow,
    })),
  };
}

async function persistFounderOrderToDroplet(payload) {
  const endpoint = process.env.ORDER_DB_URL ?? process.env.FOUNDER_ORDER_DB_URL;
  if (!endpoint) {
    return { configured: false, persisted: false };
  }

  const headers = {
    "Content-Type": "application/json",
  };

  const authToken = process.env.ORDER_DB_TOKEN ?? process.env.FOUNDER_ORDER_DB_TOKEN;
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Founder order persistence failed (${response.status}): ${errorText.slice(0, 300)}`);
  }

  return { configured: true, persisted: true };
}

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "Email service not configured" }, { status: 500 });
  }

  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get("paddle-signature");

  if (!verifyPaddleSignature(rawBody, signatureHeader, webhookSecret)) {
    return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType = event?.event_type;
  if (eventType !== "transaction.completed" && eventType !== "transaction.paid") {
    return Response.json({ received: true, ignored: true });
  }

  const eventData = event?.data ?? {};
  const status = String(eventData?.status ?? "").toLowerCase();
  if (status && status !== "completed" && status !== "paid") {
    return Response.json({ received: true, ignored: true, reason: "transaction_not_complete" });
  }

  const lineItems = extractLineItems(eventData);
  const founderPurchases = [];

  for (const item of lineItems) {
    const priceId = extractPriceId(item);
    const founderProduct = FOUNDER_PRICE_ID_TO_PRODUCT.get(priceId);
    if (!founderProduct) continue;
    founderPurchases.push({
      product: founderProduct,
      quantity: extractQuantity(item),
    });
  }

  if (founderPurchases.length === 0) {
    return Response.json({ received: true, ignored: true, reason: "no_founder_products" });
  }

  const customerEmail =
    eventData?.customer?.email ??
    eventData?.customer_email ??
    eventData?.custom_data?.email ??
    (await fetchCustomerEmail(eventData?.customer_id));

  if (!customerEmail) {
    return Response.json({ error: "Customer email not found" }, { status: 422 });
  }

  const founderOrderPayload = buildFounderOrderPayload(event, eventData, founderPurchases, customerEmail);

  try {
    await persistFounderOrderToDroplet(founderOrderPayload);
  } catch (error) {
    console.error("Founder order persistence error:", error);
    // Return non-2xx so Paddle retries this webhook and we do not lose order data.
    return Response.json({ error: "Unable to persist founder order" }, { status: 502 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const productListHtml = founderPurchases
    .map(({ product, quantity }) => {
      const quantityText = quantity > 1 ? ` (x${quantity})` : "";
      return `<li><strong>${product.name}</strong>${quantityText}<br/><span style="color:#4a5568;">${product.deliveryWindow}</span></li>`;
    })
    .join("");

  await resend.emails.send({
    from: "Orraah <updates@orraah.com>",
    to: [customerEmail],
    subject: "Orraah founder pricing secured",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your founder pricing is confirmed.</h2>
        <p>Thanks for supporting Orraah early. We have received your payment and reserved your founder spot.</p>
        <p>Purchased founder pre-orders:</p>
        <ul>
          ${productListHtml}
        </ul>
        <p>We will email onboarding details as each product reaches launch readiness.</p>
        <p style="color: #666; font-size: 14px;">Founder pricing applies to the first ${FOUNDER_SLOT_LIMIT} customers per product.</p>
        <p style="color: #666; font-size: 14px;">- The Orraah Team</p>
      </div>
    `,
  });

  return Response.json({
    received: true,
    emailed: true,
    persisted: Boolean(process.env.ORDER_DB_URL ?? process.env.FOUNDER_ORDER_DB_URL),
  });
}
