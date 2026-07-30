"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PRODUCT_CATALOG, type ProductConfig, type ProductId } from "@/lib/products";

export default function ProductCheckoutPage() {
  const params = useParams<{ product: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = useMemo<ProductConfig | null>(() => {
    const productId = params?.product;
    if (!productId) return null;
    const entry = PRODUCT_CATALOG[productId as ProductId];
    return entry ?? null;
  }, [params?.product]);

  async function handleCheckout() {
    if (!product) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Unable to start checkout. Please try again.");
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!product) {
    return (
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.title}>Product not found</h1>
          <p style={styles.text}>The checkout page you requested does not exist.</p>
          <Link href="/store" style={styles.secondaryBtn}>Back to store</Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <p style={styles.kicker}>Secure checkout</p>
        <h1 style={styles.title}>{product.name}</h1>
        <p style={styles.price}>{product.priceLabel}</p>
        <p style={styles.text}>{product.description}</p>
        <p style={styles.note}>You will be redirected to Stripe to complete payment securely.</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button onClick={handleCheckout} style={styles.primaryBtn} disabled={loading}>
            {loading ? "Starting checkout..." : "Continue to checkout"}
          </button>
          <Link href="/store" style={styles.secondaryBtn}>Back to store</Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "#f8fbff",
    color: "#0a0f1e",
    fontFamily: "DM Sans, system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "680px",
    background: "#ffffff",
    border: "1px solid #dde3ed",
    borderRadius: "16px",
    padding: "36px",
    boxShadow: "0 12px 40px rgba(20, 82, 179, 0.08)",
  },
  kicker: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#1a6fe8",
  },
  title: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "30px",
    lineHeight: 1.2,
  },
  price: {
    margin: 0,
    marginBottom: "14px",
    fontSize: "20px",
    fontWeight: 700,
    color: "#1452b3",
  },
  text: {
    margin: 0,
    marginBottom: "10px",
    color: "#4a5568",
    lineHeight: 1.6,
  },
  note: {
    margin: 0,
    marginBottom: "24px",
    color: "#4a5568",
    fontSize: "14px",
  },
  error: {
    margin: 0,
    marginBottom: "16px",
    color: "#b91c1c",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  primaryBtn: {
    border: "none",
    borderRadius: "10px",
    background: "#1a6fe8",
    color: "#ffffff",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    border: "1px solid #1452b3",
    borderRadius: "10px",
    color: "#1452b3",
    textDecoration: "none",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 700,
  },
};
