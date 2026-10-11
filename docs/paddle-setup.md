# Paddle setup for orraah.com

This document configures Paddle end-to-end for the current store and webhook implementation.

## What is already wired in code

- Frontend overlay checkout: [app/store/checkout/[product]/page.tsx](app/store/checkout/[product]/page.tsx)
- Product to Paddle price mapping: [lib/products.ts](lib/products.ts)
- Webhook verification, founder fulfillment, and confirmation email: [app/api/webhook/route.js](app/api/webhook/route.js)
- Founder slot availability API: [app/api/founder-slots/route.js](app/api/founder-slots/route.js)

## 1) Paddle dashboard setup

1. Create products and one-time prices in Paddle for each paid SKU.
2. Copy each Paddle price ID (must start with pri_).
3. Update the corresponding paddlePriceId entries in [lib/products.ts](lib/products.ts).
4. Create a client-side token:
   - Sandbox for testing
   - Live for production
5. Create an API key:
   - Sandbox key for test mode
   - Live key for production mode
6. Configure notifications endpoint:
   - URL: https://your-domain.com/api/webhook
   - Events: transaction.completed and transaction.paid
7. Copy the notification signing secret.

## 2) Environment variables

Set these in your deployment host and in local .env.local for local testing.

Public client vars:

```dotenv
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_your_paddle_client_side_token_here
```

Server vars:

```dotenv
PADDLE_API_KEY=pdl_sdbx_api_key_here
PADDLE_WEBHOOK_SECRET=pdl_ntfset_signing_secret_here
RESEND_API_KEY=re_your_resend_api_key
```

Optional droplet persistence:

```dotenv
ORDER_DB_URL=https://your-domain-or-ip/api/founder-orders
ORDER_DB_TOKEN=replace_with_long_random_secret
ORDER_DB_READ_URL=https://your-domain-or-ip/api/founder-orders/slots
```

Notes:
- In sandbox, NEXT_PUBLIC_PADDLE_CLIENT_TOKEN must start with test_.
- Keep environment mode and keys aligned. Do not mix sandbox token with production key.
- Do not commit real keys.

## 3) Local webhook testing

Paddle must reach your webhook over the public internet.

1. Run app locally:

```bash
npm run dev
```

2. Expose localhost using your preferred tunnel.
3. In Paddle notifications, point the destination URL to:

```text
https://your-tunnel-domain/api/webhook
```

4. Trigger a sandbox purchase from:

```text
/store/checkout/founders-combo
```

## 4) Production checklist

1. Set NEXT_PUBLIC_PADDLE_ENVIRONMENT=production.
2. Replace test client token with live client token.
3. Replace sandbox API key and webhook secret with live values.
4. Confirm all live pri_ IDs in [lib/products.ts](lib/products.ts).
5. Confirm Paddle notification destination points to your production domain.

## 5) Validation checklist

1. Checkout opens from a product page and completes successfully.
2. /api/webhook returns 2xx for valid Paddle notifications.
3. Founder confirmation email is sent via Resend.
4. Founder slot counts load in store UI (if ORDER_DB_READ_URL is configured).
5. If ORDER_DB_URL is configured, verify persistence in droplet DB.

## 6) Common issues

- Error: Missing required environment variable NEXT_PUBLIC_PADDLE_ENVIRONMENT
  - Set NEXT_PUBLIC_PADDLE_ENVIRONMENT to sandbox or production.

- Error: Sandbox requires NEXT_PUBLIC_PADDLE_CLIENT_TOKEN starting with test_
  - Use a sandbox client token while in sandbox mode.

- Checkout price preview fails
  - Verify pri_ ID exists in the same Paddle account/environment as your token.

- Webhook signature invalid
  - Confirm PADDLE_WEBHOOK_SECRET exactly matches the notification destination secret.

- Founder slots not loading
  - Verify ORDER_DB_TOKEN and ORDER_DB_READ_URL, and check droplet endpoint health.