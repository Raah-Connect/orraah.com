-- Webhook ingestion templates for SQLite (Paddle -> orders.db)
-- These statements are intentionally SQL-first and idempotency-focused.

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;
PRAGMA busy_timeout=5000;

-- Recommended uniqueness for strong idempotency.
CREATE UNIQUE INDEX IF NOT EXISTS ux_processed_webhooks_notification_id
ON processed_webhooks(notification_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_orders_transaction_id
ON orders(transaction_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_order_items_order_line_item
ON order_items(order_id, line_item_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_order_tasks_item_task
ON order_tasks(order_item_id, task_type);

-- Optional mapping seed for current behavior.
-- planet-identity => executable identity_issue
-- remote-access-custom-subdomain => waitlist-only remote_access_provision
-- founders-combo => both split outcomes
INSERT OR IGNORE INTO product_fulfillment_map (product_id, task_type)
VALUES ('planet-identity', 'identity_issue');

INSERT OR IGNORE INTO product_fulfillment_map (product_id, task_type)
VALUES ('remote-access-custom-subdomain', 'remote_access_provision');

INSERT OR IGNORE INTO product_fulfillment_map (product_id, task_type)
VALUES ('founders-combo', 'identity_issue');

INSERT OR IGNORE INTO product_fulfillment_map (product_id, task_type)
VALUES ('founders-combo', 'remote_access_provision');

-- 1) Dedupe insert (fast duplicate replay detection)
INSERT OR IGNORE INTO processed_webhooks (
  notification_id,
  event_type,
  transaction_id,
  processing_status,
  raw_payload_json,
  received_at,
  updated_at
) VALUES (
  :notification_id,
  :event_type,
  :transaction_id,
  'processing',
  :raw_payload_json,
  datetime('now'),
  datetime('now')
);

-- 2) Orders upsert by transaction_id
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
) VALUES (
  :transaction_id,
  'paddle',
  :notification_id,
  :event_type,
  :occurred_at,
  :payment_status,
  :order_status,
  :customer_id,
  :customer_email,
  :currency_code,
  :amount_subtotal,
  :amount_tax,
  :amount_total,
  :raw_payload_json,
  datetime('now'),
  datetime('now')
)
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

-- 3) Order items upsert by (order_id, line_item_id)
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
) VALUES (
  :order_id,
  :line_item_id,
  :product_id,
  :product_name,
  :quantity,
  :unit_amount,
  :currency_code,
  :raw_item_json,
  datetime('now'),
  datetime('now')
)
ON CONFLICT(order_id, line_item_id) DO UPDATE SET
  product_id = excluded.product_id,
  product_name = excluded.product_name,
  quantity = excluded.quantity,
  unit_amount = COALESCE(excluded.unit_amount, order_items.unit_amount),
  currency_code = COALESCE(excluded.currency_code, order_items.currency_code),
  raw_item_json = excluded.raw_item_json,
  updated_at = datetime('now');

-- 4) Task creation from mapping without duplicates
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
WHERE oi.order_id = :order_id
  AND NOT EXISTS (
    SELECT 1
    FROM order_tasks ot
    WHERE ot.order_item_id = oi.id
      AND ot.task_type = pfm.task_type
  );

-- Mark processed
UPDATE processed_webhooks
SET processing_status = :processing_status,
    processing_error = :processing_error,
    updated_at = datetime('now')
WHERE notification_id = :notification_id;

-- Worker fetch: executable identity tasks only.
SELECT
  ot.id,
  ot.order_id,
  ot.order_item_id,
  ot.product_id,
  ot.task_type,
  ot.payload_json,
  ot.created_at
FROM order_tasks ot
WHERE ot.task_type = 'identity_issue'
  AND ot.is_executable = 1
  AND ot.task_status = 'queued'
ORDER BY ot.created_at ASC
LIMIT :limit;