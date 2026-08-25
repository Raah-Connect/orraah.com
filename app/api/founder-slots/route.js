import { PRODUCT_CATALOG } from "@/lib/products";

const FOUNDER_SLOT_LIMIT = 500;

const FOUNDER_PRODUCTS = [
  {
    id: "founders-combo",
    label: "Founder Combo Kit",
    deliveryWindow: "Estimated delivery: Q1 2027",
    priceId: PRODUCT_CATALOG["founders-combo"].paddlePriceId,
  },
  {
    id: "p2p-commerce-app-store",
    label: "Peer-to-Peer Commerce & App Store",
    deliveryWindow: "Estimated delivery: Q1 2027",
    priceId: PRODUCT_CATALOG["p2p-commerce-app-store"].paddlePriceId,
  },
  {
    id: "remote-access-custom-subdomain",
    label: "Remote Access + Custom Subdomain",
    deliveryWindow: "Estimated delivery: Q4 2026",
    priceId: PRODUCT_CATALOG["remote-access-custom-subdomain"].paddlePriceId,
  },
];

function extractPriceId(item) {
  return item?.price?.id ?? item?.price_id ?? item?.priceId ?? null;
}

function extractQuantity(item) {
  const quantity = Number(item?.quantity ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function extractLineItems(transaction) {
  if (Array.isArray(transaction?.items)) return transaction.items;
  if (Array.isArray(transaction?.details?.line_items)) return transaction.details.line_items;
  if (Array.isArray(transaction?.details?.items)) return transaction.details.items;
  return [];
}

function getNextCursor(meta) {
  const next = meta?.pagination?.next ?? meta?.next ?? null;
  if (!next || typeof next !== "string") return null;

  try {
    const url = new URL(next);
    return url.searchParams.get("after");
  } catch {
    return null;
  }
}

async function fetchCompletedTransactions(apiKey) {
  const transactions = [];
  let after = null;

  for (let page = 0; page < 25; page += 1) {
    const url = new URL("https://api.paddle.com/transactions");
    url.searchParams.set("status", "completed");
    url.searchParams.set("per_page", "200");
    if (after) {
      url.searchParams.set("after", after);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Paddle API error: ${response.status}`);
    }

    const payload = await response.json();
    const batch = Array.isArray(payload?.data) ? payload.data : [];
    transactions.push(...batch);

    after = getNextCursor(payload?.meta);
    if (!after || batch.length === 0) {
      break;
    }
  }

  return transactions;
}

export async function GET() {
  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    const fallback = FOUNDER_PRODUCTS.map((product) => ({
      id: product.id,
      label: product.label,
      sold: null,
      remaining: FOUNDER_SLOT_LIMIT,
      limit: FOUNDER_SLOT_LIMIT,
      soldOut: false,
      deliveryWindow: product.deliveryWindow,
      note: "Set PADDLE_API_KEY to enable live founder slot counts.",
    }));

    return Response.json({
      configured: false,
      products: fallback,
      asOf: new Date().toISOString(),
    });
  }

  try {
    const counts = Object.fromEntries(FOUNDER_PRODUCTS.map((product) => [product.id, 0]));
    const trackedPriceToProductId = new Map(
      FOUNDER_PRODUCTS.filter((product) => Boolean(product.priceId)).map((product) => [product.priceId, product.id])
    );

    const transactions = await fetchCompletedTransactions(apiKey);

    for (const transaction of transactions) {
      const lineItems = extractLineItems(transaction);
      for (const item of lineItems) {
        const priceId = extractPriceId(item);
        const productId = trackedPriceToProductId.get(priceId);
        if (!productId) continue;
        counts[productId] += extractQuantity(item);
      }
    }

    const products = FOUNDER_PRODUCTS.map((product) => {
      const sold = counts[product.id] ?? 0;
      const remaining = Math.max(FOUNDER_SLOT_LIMIT - sold, 0);
      return {
        id: product.id,
        label: product.label,
        sold,
        remaining,
        limit: FOUNDER_SLOT_LIMIT,
        soldOut: remaining === 0,
        deliveryWindow: product.deliveryWindow,
      };
    });

    return Response.json({
      configured: true,
      products,
      asOf: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Founder slot count error:", error);
    return Response.json(
      {
        configured: true,
        error: "Unable to fetch founder slot counts right now.",
        asOf: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
