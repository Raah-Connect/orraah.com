# Founder Backup DB + Paddle + Resend (Droplet)

This runbook sets up a backup SQLite database on your droplet and connects your Paddle webhook flow to it.

## 1) Create the backup SQLite DB on droplet

Run on the droplet:

```bash
cd ~/orraah
sqlite3 orders.db < founder_backup_schema.sql
```

You can copy the schema from [sql/founder_backup_schema.sql](sql/founder_backup_schema.sql) into the droplet first, then run it.

Quick verify:

```bash
sqlite3 ~/orraah/orders.db ".tables"
sqlite3 ~/orraah/orders.db "select count(*) from founder_orders;"
```

## 2) Add a write endpoint in your droplet API

Your Next.js webhook already posts founder order payloads to a configurable endpoint:
- URL env: ORDER_DB_URL
- Auth env: ORDER_DB_TOKEN (Bearer token)

Your Next.js founder slot API now reads counts from the droplet API (instead of calling Paddle directly):
- Read URL env: ORDER_DB_READ_URL (optional explicit)
- If ORDER_DB_READ_URL is not set, app derives it from ORDER_DB_URL
  - Example write URL: /api/founder-orders
  - Example read URL: /api/founder-orders/slots

Expected request shape (already sent by [app/api/webhook/route.js](app/api/webhook/route.js)):

```json
{
  "source": "paddle",
  "eventId": "evt_xxx",
  "eventType": "transaction.completed",
  "occurredAt": "2026-08-25T00:00:00Z",
  "transactionId": "txn_xxx",
  "transactionStatus": "completed",
  "customerId": "ctm_xxx",
  "customerEmail": "buyer@example.com",
  "currencyCode": "USD",
  "amountSubtotal": 175,
  "amountTax": 13.3,
  "amountTotal": 188.3,
  "purchases": [
    {
      "productId": "founders-combo",
      "productName": "Founder Combo Kit",
      "paddlePriceId": "pri_xxx",
      "quantity": 1,
      "deliveryWindow": "Estimated delivery: Q1 2027"
    }
  ]
}
```

Server-side insert logic on droplet endpoint:
1. Verify bearer token matches ORDER_DB_TOKEN.
2. Upsert into founder_customers by customer_email.
3. Insert into founder_orders using transaction_id UNIQUE.
4. Insert all purchases into founder_order_items.
5. Return 200 on success.
6. If duplicate transaction_id, return 200 (idempotent).

Server-side read logic on droplet slot endpoint (`GET /api/founder-orders/slots`):
1. Verify bearer token matches ORDER_DB_TOKEN.
2. Aggregate sold quantities from founder_order_items joined to founder_orders.
3. Return JSON shape:

```json
{
  "products": [
    { "id": "founders-combo", "sold": 12, "remaining": 488, "limit": 500, "soldOut": false },
    { "id": "p2p-commerce-app-store", "sold": 4, "remaining": 496, "limit": 500, "soldOut": false },
    { "id": "remote-access-custom-subdomain", "sold": 3, "remaining": 497, "limit": 500, "soldOut": false }
  ],
  "asOf": "2026-08-26T00:00:00.000Z"
}
```

## 3) Configure app env vars

Set in your Next.js host (and local test env as needed):

```dotenv
ORDER_DB_URL=https://64.23.254.52/api/founder-orders
ORDER_DB_TOKEN=replace_with_long_random_secret
ORDER_DB_READ_URL=https://64.23.254.52/api/founder-orders/slots
```

Notes:
- Use HTTPS with a real cert/domain in production.
- If you expose IP directly first, lock with firewall and token.

## 4) Keep Resend linked

Resend is already used in [app/api/webhook/route.js](app/api/webhook/route.js).

Required env var remains:

```dotenv
RESEND_API_KEY=your_resend_api_key
```

## 5) End-to-end test

1. Make one Paddle sandbox founder purchase.
2. Confirm webhook 2xx in Paddle notifications.
3. Confirm DB row exists:

```bash
sqlite3 ~/orraah/orders.db "select transaction_id, customer_email, amount_total from founder_orders order by id desc limit 5;"
sqlite3 ~/orraah/orders.db "select product_id, quantity from founder_order_items order by id desc limit 10;"
```

4. Confirm customer got email from Resend.

## 6) Optional: backup and export

```bash
sqlite3 ~/orraah/orders.db ".backup ~/orraah/orders_backup_$(date +%F).db"
sqlite3 -header -csv ~/orraah/orders.db "select * from founder_orders;" > ~/orraah/founder_orders_export.csv
```
