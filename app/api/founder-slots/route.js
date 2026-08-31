const FOUNDER_SLOT_LIMIT = 500;

const FOUNDER_PRODUCTS = [
  {
    id: "founders-combo",
    label: "Founder Combo Kit",
    deliveryWindow: "Estimated delivery: Q1 2027",
  },
  {
    id: "p2p-commerce-app-store",
    label: "Peer-to-Peer Commerce & App Store",
    deliveryWindow: "Estimated delivery: Q1 2027",
  },
  {
    id: "remote-access-custom-subdomain",
    label: "Remote Access + Custom Subdomain",
    deliveryWindow: "Estimated delivery: Q4 2026",
  },
];

function getDropletReadUrl() {
  if (process.env.ORDER_DB_READ_URL) {
    return process.env.ORDER_DB_READ_URL;
  }

  if (!process.env.ORDER_DB_URL) {
    return null;
  }

  try {
    const parsed = new URL(process.env.ORDER_DB_URL);
    if (parsed.pathname.endsWith("/founder-orders")) {
      parsed.pathname = parsed.pathname.replace(/\/founder-orders$/, "/founder-orders/slots");
    } else {
      parsed.pathname = `${parsed.pathname.replace(/\/$/, "")}/slots`;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

async function fetchFounderCountsFromDroplet() {
  const readUrl = getDropletReadUrl();
  if (!readUrl) {
    return { configured: false, products: [] };
  }

  const headers = {
    "Content-Type": "application/json",
  };

  const authToken = process.env.ORDER_DB_TOKEN ?? process.env.FOUNDER_ORDER_DB_TOKEN;
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(readUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Droplet slot API error: ${response.status} ${errorPayload.slice(0, 300)}`);
  }

  const payload = await response.json();
  const products = Array.isArray(payload?.products) ? payload.products : [];
  return {
    configured: true,
    products,
    asOf: payload?.asOf ?? new Date().toISOString(),
  };
}

export async function GET() {
  const readUrl = getDropletReadUrl();

  if (!readUrl) {
    const fallback = FOUNDER_PRODUCTS.map((product) => ({
      id: product.id,
      label: product.label,
      sold: null,
      remaining: FOUNDER_SLOT_LIMIT,
      limit: FOUNDER_SLOT_LIMIT,
      soldOut: false,
      deliveryWindow: product.deliveryWindow,
      note: "Set ORDER_DB_READ_URL (or ORDER_DB_URL) to enable droplet-backed founder slot counts.",
    }));

    return Response.json({
      configured: false,
      products: fallback,
      asOf: new Date().toISOString(),
    });
  }

  try {
    const dropletData = await fetchFounderCountsFromDroplet();
    const dropletProductsById = new Map(
      dropletData.products
        .filter((item) => item && typeof item.id === "string")
        .map((item) => [item.id, item])
    );

    const products = FOUNDER_PRODUCTS.map((product) => {
      const fromDroplet = dropletProductsById.get(product.id);
      const soldCandidate = Number(fromDroplet?.sold ?? fromDroplet?.count ?? 0);
      const sold = Number.isFinite(soldCandidate) && soldCandidate >= 0 ? soldCandidate : 0;
      const remaining = Math.max(FOUNDER_SLOT_LIMIT - sold, 0);
      return {
        id: product.id,
        label: product.label,
        sold,
        remaining: Number.isFinite(Number(fromDroplet?.remaining))
          ? Math.max(Number(fromDroplet.remaining), 0)
          : remaining,
        limit: Number.isFinite(Number(fromDroplet?.limit))
          ? Number(fromDroplet.limit)
          : FOUNDER_SLOT_LIMIT,
        soldOut: typeof fromDroplet?.soldOut === "boolean" ? fromDroplet.soldOut : remaining === 0,
        deliveryWindow: fromDroplet?.deliveryWindow ?? product.deliveryWindow,
      };
    });

    return Response.json({
      configured: true,
      products,
      asOf: dropletData.asOf ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("Founder slot count error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const lowered = message.toLowerCase();

    let clientError = "Unable to fetch founder slot counts from droplet right now.";
    if (lowered.includes("401") || lowered.includes("403") || lowered.includes("unauthorized") || lowered.includes("forbidden")) {
      clientError = "Droplet slot endpoint rejected authentication. Verify ORDER_DB_TOKEN matches the droplet API.";
    }

    return Response.json(
      {
        configured: true,
        error: clientError,
        asOf: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
