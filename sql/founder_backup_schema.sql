-- Founder order backup schema for SQLite
-- Safe to run multiple times.

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS founder_customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_email TEXT NOT NULL UNIQUE,
  paddle_customer_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS founder_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL DEFAULT 'paddle',
  event_id TEXT,
  event_type TEXT,
  occurred_at TEXT,
  transaction_id TEXT NOT NULL UNIQUE,
  transaction_status TEXT,
  customer_id INTEGER,
  customer_email TEXT NOT NULL,
  currency_code TEXT,
  amount_subtotal REAL,
  amount_tax REAL,
  amount_total REAL,
  resend_email_id TEXT,
  resend_status TEXT,
  raw_payload_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES founder_customers(id)
);

CREATE INDEX IF NOT EXISTS idx_founder_orders_customer_email
ON founder_orders(customer_email);

CREATE INDEX IF NOT EXISTS idx_founder_orders_created_at
ON founder_orders(created_at);

CREATE TABLE IF NOT EXISTS founder_order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  founder_order_id INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  paddle_price_id TEXT,
  quantity INTEGER NOT NULL,
  delivery_window TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (founder_order_id) REFERENCES founder_orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_founder_order_items_order
ON founder_order_items(founder_order_id);

CREATE TABLE IF NOT EXISTS founder_email_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  resend_email_id TEXT,
  resend_status TEXT,
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(transaction_id, customer_email)
);

-- View: per-product founder sales for slot counting backup.
CREATE VIEW IF NOT EXISTS founder_sales_by_product AS
SELECT
  i.product_id,
  SUM(i.quantity) AS sold_quantity
FROM founder_order_items i
JOIN founder_orders o ON o.id = i.founder_order_id
WHERE lower(coalesce(o.transaction_status, '')) IN ('completed', 'paid')
GROUP BY i.product_id;
