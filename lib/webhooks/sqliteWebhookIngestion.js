import crypto from "node:crypto";
import path from "node:path";
import Database from "better-sqlite3";
import { PRODUCT_CATALOG } from "@/lib/products";

const PAID_EVENT_TYPES = new Set(["transaction.paid", "transaction.completed"]);
const PAID_TRANSACTION_STATUSES = new Set(["paid", "completed"]);

const PRICE_ID_TO_PRODUCT_ID = new Map(
  Object.values(PRODUCT_CATALOG)
    .filter((product) => Boolean(product.paddlePriceId))
    .map((product) => [product.paddlePriceId, product.id])
);

const dbCache = globalThis.__ordersDbCache ?? new Map();
globalThis.__ordersDbCache = dbCache;

function getDb(dbPath) {
  const resolvedPath = dbPath ?? path.join(process.cwd(), "orders.db");
  if (dbCache.has(resolvedPath)) {
    return dbCache.get(resolvedPath);
  }

  const db = new Database(resolvedPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  dbCache.set(resolvedPath, db);
  return db;
}

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

function verifyPaddleSignature({ rawBody, signatureHeader, webhookSecret, timestampToleranceSec }) {
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

function extractLineItems(eventData) {
  if (Array.isArray(eventData?.items)) return eventData.items;
  if (Array.isArray(eventData?.details?.line_items)) return eventData.details.line_items;
  if (Array.isArray(eventData?.details?.items)) return eventData.details.items;
  return [];
}

function asNumberOrNull(value) {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "object") {
    const nested = value?.amount ?? value?.value;
    if (nested == null) return null;
    const parsed = Number(nested);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeQuantity(rawQuantity) {
  const quantity = Number(rawQuantity ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function resolveLineItemId(item, fallbackIndex) {
  return item?.id ?? item?.line_item_id ?? item?.lineItemId ?? `idx_${fallbackIndex}`;
}

function resolvePriceId(item) {
  return item?.price?.id ?? item?.price_id ?? item?.priceId ?? null;
}

function resolveProduct(item) {
  const explicitProductId = item?.product_id ?? item?.productId ?? item?.product?.id ?? null;
  if (explicitProductId && PRODUCT_CATALOG[explicitProductId]) {
    return PRODUCT_CATALOG[explicitProductId];
  }

  const priceId = resolvePriceId(item);
  const inferredProductId = priceId ? PRICE_ID_TO_PRODUCT_ID.get(priceId) : null;
  if (inferredProductId) {
    return PRODUCT_CATALOG[inferredProductId];
  }

  return null;
}

function mapOrderStatusFromEvent({ eventType, transactionStatus }) {
  const normalizedStatus = String(transactionStatus ?? "").toLowerCase();
  if (PAID_EVENT_TYPES.has(eventType) && PAID_TRANSACTION_STATUSES.has(normalizedStatus)) {
    return "paid";
  }
  if (normalizedStatus === "refunded") return "refunded";
  if (normalizedStatus === "failed") return "failed";
  return "pending";
}

function shouldCreateTasks({ eventType, transactionStatus }) {
  return PAID_EVENT_TYPES.has(eventType) && PAID_TRANSACTION_STATUSES.has(String(transactionStatus ?? "").toLowerCase());
}

export function ingestPaddleWebhook({
  rawBody,
  signatureHeader,
  webhookSecret,
  timestampToleranceSec = 300,
  dbPath,
}) {
  if (!webhookSecret) {
    return { kind: "misconfigured" };
  }

  const hasValidSignature = verifyPaddleSignature({
    rawBody,
    signatureHeader,
    webhookSecret,
    timestampToleranceSec,
  });
  if (!hasValidSignature) {
    return { kind: "invalid_signature" };
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return { kind: "invalid_json" };
  }

  const notificationId = String(event?.notification_id ?? event?.event_id ?? "").trim();
  if (!notificationId) {
    return { kind: "ignored", reason: "missing_notification_id" };
  }

  const eventType = String(event?.event_type ?? "");
  const occurredAt = event?.occurred_at ?? new Date().toISOString();
  const eventData = event?.data ?? {};
  const transactionId = String(eventData?.id ?? "").trim();
  const transactionStatus = String(eventData?.status ?? "").toLowerCase();
  const customerEmail =
    eventData?.customer?.email ?? eventData?.customer_email ?? eventData?.custom_data?.email ?? null;
  const customerId = eventData?.customer_id ?? eventData?.customer?.id ?? null;
  const totals = eventData?.details?.totals ?? eventData?.totals ?? {};
  const currencyCode = eventData?.currency_code ?? totals?.currency_code ?? null;

  const db = getDb(dbPath);

  const dedupeInsertStmt = db.prepare(`
    INSERT OR IGNORE INTO processed_webhooks (
      notification_id,
      event_type,
      transaction_id,
      processing_status,
      raw_payload_json,
      received_at,
      updated_at
    ) VALUES (?, ?, ?, 'processing', ?, datetime('now'), datetime('now'))
  `);

  const markWebhookStmt = db.prepare(`
    UPDATE processed_webhooks
    SET processing_status = ?,
        processing_error = ?,
        updated_at = datetime('now')
    WHERE notification_id = ?
  `);

  const ordersUpsertStmt = db.prepare(`
    INSERT INTO orders (
      transaction_id,
      source,
      latest_notification_id,
      latest_event_type,
      occurred_at,
      payment_status,
      order_status,
      customer_id,
      customer_email,
      currency_code,
      amount_subtotal,
      amount_tax,
      amount_total,
      raw_payload_json,
      created_at,
      updated_at
    ) VALUES (?, 'paddle', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(transaction_id) DO UPDATE SET
      latest_notification_id = excluded.latest_notification_id,
      latest_event_type = excluded.latest_event_type,
      occurred_at = excluded.occurred_at,
      payment_status = CASE
        WHEN lower(excluded.payment_status) IN ('paid', 'completed') THEN excluded.payment_status
        ELSE orders.payment_status
      END,
      order_status = CASE
        WHEN lower(excluded.order_status) = 'paid' THEN excluded.order_status
        ELSE orders.order_status
      END,
      customer_id = COALESCE(excluded.customer_id, orders.customer_id),
      customer_email = COALESCE(excluded.customer_email, orders.customer_email),
      currency_code = COALESCE(excluded.currency_code, orders.currency_code),
      amount_subtotal = COALESCE(excluded.amount_subtotal, orders.amount_subtotal),
      amount_tax = COALESCE(excluded.amount_tax, orders.amount_tax),
      amount_total = COALESCE(excluded.amount_total, orders.amount_total),
      raw_payload_json = excluded.raw_payload_json,
      updated_at = datetime('now')
  `);

  const selectOrderIdStmt = db.prepare(`SELECT id FROM orders WHERE transaction_id = ?`);

  const orderItemUpsertStmt = db.prepare(`
    INSERT INTO order_items (
      order_id,
      line_item_id,
      product_id,
      product_name,
      quantity,
      unit_amount,
      currency_code,
      raw_item_json,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(order_id, line_item_id) DO UPDATE SET
      product_id = excluded.product_id,
      product_name = excluded.product_name,
      quantity = excluded.quantity,
      unit_amount = COALESCE(excluded.unit_amount, order_items.unit_amount),
      currency_code = COALESCE(excluded.currency_code, order_items.currency_code),
      raw_item_json = excluded.raw_item_json,
      updated_at = datetime('now')
  `);

  const createTasksFromMappingStmt = db.prepare(`
    INSERT INTO order_tasks (
      order_id,
      order_item_id,
      product_id,
      task_type,
      execution_mode,
      task_status,
      is_executable,
      payload_json,
      created_at,
      updated_at
    )
    SELECT
      oi.order_id,
      oi.id,
      oi.product_id,
      pfm.task_type,
      CASE WHEN pfm.task_type = 'identity_issue' THEN 'execute' ELSE 'waitlist' END AS execution_mode,
      CASE WHEN pfm.task_type = 'identity_issue' THEN 'queued' ELSE 'waitlisted' END AS task_status,
      CASE WHEN pfm.task_type = 'identity_issue' THEN 1 ELSE 0 END AS is_executable,
      json_object(
        'transaction_id', o.transaction_id,
        'line_item_id', oi.line_item_id,
        'product_id', oi.product_id,
        'customer_email', o.customer_email,
        'quantity', oi.quantity
      ) AS payload_json,
      datetime('now'),
      datetime('now')
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN product_fulfillment_map pfm ON pfm.product_id = oi.product_id
    WHERE oi.order_id = ?
      AND NOT EXISTS (
        SELECT 1
        FROM order_tasks ot
        WHERE ot.order_item_id = oi.id
          AND ot.task_type = pfm.task_type
      )
  `);

  const tx = db.transaction(() => {
    const dedupeResult = dedupeInsertStmt.run(notificationId, eventType, transactionId || null, rawBody);
    if (dedupeResult.changes === 0) {
      return {
        kind: "duplicate",
        notificationId,
        transactionId: transactionId || null,
      };
    }

    if (!transactionId) {
      markWebhookStmt.run("ignored", "missing_transaction_id", notificationId);
      return {
        kind: "ignored",
        reason: "missing_transaction_id",
        notificationId,
      };
    }

    const shouldProcess = shouldCreateTasks({ eventType, transactionStatus });
    const normalizedOrderStatus = mapOrderStatusFromEvent({ eventType, transactionStatus });

    ordersUpsertStmt.run(
      transactionId,
      notificationId,
      eventType || null,
      occurredAt,
      transactionStatus || null,
      normalizedOrderStatus,
      customerId,
      customerEmail,
      currencyCode,
      asNumberOrNull(totals?.subtotal),
      asNumberOrNull(totals?.tax),
      asNumberOrNull(totals?.total),
      rawBody
    );

    const orderRecord = selectOrderIdStmt.get(transactionId);
    if (!orderRecord?.id) {
      throw new Error(`Order upsert failed for transaction_id=${transactionId}`);
    }

    const lineItems = extractLineItems(eventData);
    for (let i = 0; i < lineItems.length; i += 1) {
      const item = lineItems[i];
      const product = resolveProduct(item);
      if (!product) continue;

      const lineItemId = resolveLineItemId(item, i);
      const quantity = normalizeQuantity(item?.quantity);
      const unitAmount =
        asNumberOrNull(item?.unit_totals?.subtotal) ??
        asNumberOrNull(item?.unit_price) ??
        asNumberOrNull(item?.price?.unit_price?.amount) ??
        null;

      orderItemUpsertStmt.run(
        orderRecord.id,
        String(lineItemId),
        product.id,
        product.name,
        quantity,
        unitAmount,
        currencyCode,
        JSON.stringify(item)
      );
    }

    if (shouldProcess) {
      createTasksFromMappingStmt.run(orderRecord.id);
      markWebhookStmt.run("processed", null, notificationId);
      return {
        kind: "processed",
        notificationId,
        transactionId,
      };
    }

    markWebhookStmt.run("ignored", "not_paid_or_not_completed", notificationId);
    return {
      kind: "ignored",
      reason: "not_paid_or_not_completed",
      notificationId,
      transactionId,
    };
  });

  return tx();
}

export const SQL_TEMPLATES = {
  dedupeInsert: `
INSERT OR IGNORE INTO processed_webhooks (
  notification_id,
  event_type,
  transaction_id,
  processing_status,
  raw_payload_json,
  received_at,
  updated_at
) VALUES (?, ?, ?, 'processing', ?, datetime('now'), datetime('now'));
`,
  ordersUpsert: `
INSERT INTO orders (
  transaction_id,
  source,
  latest_notification_id,
  latest_event_type,
  occurred_at,
  payment_status,
  order_status,
  customer_id,
  customer_email,
  currency_code,
  amount_subtotal,
  amount_tax,
  amount_total,
  raw_payload_json,
  created_at,
  updated_at
) VALUES (?, 'paddle', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
ON CONFLICT(transaction_id) DO UPDATE SET
  latest_notification_id = excluded.latest_notification_id,
  latest_event_type = excluded.latest_event_type,
  occurred_at = excluded.occurred_at,
  payment_status = CASE
    WHEN lower(excluded.payment_status) IN ('paid', 'completed') THEN excluded.payment_status
    ELSE orders.payment_status
  END,
  order_status = CASE
    WHEN lower(excluded.order_status) = 'paid' THEN excluded.order_status
    ELSE orders.order_status
  END,
  customer_id = COALESCE(excluded.customer_id, orders.customer_id),
  customer_email = COALESCE(excluded.customer_email, orders.customer_email),
  currency_code = COALESCE(excluded.currency_code, orders.currency_code),
  amount_subtotal = COALESCE(excluded.amount_subtotal, orders.amount_subtotal),
  amount_tax = COALESCE(excluded.amount_tax, orders.amount_tax),
  amount_total = COALESCE(excluded.amount_total, orders.amount_total),
  raw_payload_json = excluded.raw_payload_json,
  updated_at = datetime('now');
`,
  orderItemsUpsert: `
INSERT INTO order_items (
  order_id,
  line_item_id,
  product_id,
  product_name,
  quantity,
  unit_amount,
  currency_code,
  raw_item_json,
  created_at,
  updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
ON CONFLICT(order_id, line_item_id) DO UPDATE SET
  product_id = excluded.product_id,
  product_name = excluded.product_name,
  quantity = excluded.quantity,
  unit_amount = COALESCE(excluded.unit_amount, order_items.unit_amount),
  currency_code = COALESCE(excluded.currency_code, order_items.currency_code),
  raw_item_json = excluded.raw_item_json,
  updated_at = datetime('now');
`,
  tasksFromMapping: `
INSERT INTO order_tasks (
  order_id,
  order_item_id,
  product_id,
  task_type,
  execution_mode,
  task_status,
  is_executable,
  payload_json,
  created_at,
  updated_at
)
SELECT
  oi.order_id,
  oi.id,
  oi.product_id,
  pfm.task_type,
  CASE WHEN pfm.task_type = 'identity_issue' THEN 'execute' ELSE 'waitlist' END,
  CASE WHEN pfm.task_type = 'identity_issue' THEN 'queued' ELSE 'waitlisted' END,
  CASE WHEN pfm.task_type = 'identity_issue' THEN 1 ELSE 0 END,
  json_object(
    'transaction_id', o.transaction_id,
    'line_item_id', oi.line_item_id,
    'product_id', oi.product_id,
    'customer_email', o.customer_email,
    'quantity', oi.quantity
  ),
  datetime('now'),
  datetime('now')
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN product_fulfillment_map pfm ON pfm.product_id = oi.product_id
WHERE oi.order_id = ?
  AND NOT EXISTS (
    SELECT 1
    FROM order_tasks ot
    WHERE ot.order_item_id = oi.id
      AND ot.task_type = pfm.task_type
  );
`,
};