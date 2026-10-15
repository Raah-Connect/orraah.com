"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCT_CATALOG, type ProductId } from "@/lib/products";

const PRODUCT_WELCOME_COPY: Partial<Record<ProductId, { title: string; body: string }>> = {
  "founders-combo": {
    title: "Founder access reserved",
    body: "Your Founder Combo spot is secured. We will send rollout updates for hosting, remote access, and AI as each part goes live.",
  },
  "planet-identity": {
    title: "Planet identity secured",
    body: "Your order is complete. We will follow up with identity provisioning details so you can claim your Urbit planet.",
  },
  "friends-family-hosting": {
    title: "Hosting spot secured",
    body: "Your Friends and Family Hosting spot is secured. We will send rollout updates as hosting goes live."
  },
  "remote-access-custom-subdomain": {
    title: "Remote access reserved",
    body: "Your Remote Access and Custom Subdomain spot is secured.  We will send rollout updates as remote access goes live.",
  },
  "p2p-commerce-app-store": {
    title: "Commerce access reserved",
    body: "Your Peer-to-Peer Commerce and App Store spot is secured.  We will send rollout updates as the peer-to-peer commerce and app store goes live.",
  },
  "ai-package": {
    title: "AI package confirmed",
    body: "Your AI Package checkout is spot is secured.  We will send rollout updates as the AI package goes live.",
  },
};

function isProductId(value: string): value is ProductId {
  return value in PRODUCT_CATALOG;
}

export default function WelcomePage({
}: {
}) {
  return (
    <Suspense fallback={<WelcomeCard title="Welcome to Orraah" body="Your checkout is complete. You can now continue to your dashboard and start using your plan." />}>
      <WelcomePageContent />
    </Suspense>
  );
}

function WelcomePageContent() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");
  const productId = productParam && isProductId(productParam) ? productParam : null;
  const product = productId ? PRODUCT_CATALOG[productId] : null;

  const title = productId ? (PRODUCT_WELCOME_COPY[productId]?.title ?? `${product?.name} confirmed`) : "Welcome to Orraah";
  const body = productId
    ? (PRODUCT_WELCOME_COPY[productId]?.body ?? `Your checkout for ${product?.name ?? "your product"} is complete.`)
    : "Your checkout is complete. You can now continue to your dashboard and start using your plan.";

  return <WelcomeCard title={title} body={body} />;
}

function WelcomeCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <p style={styles.kicker}>Subscription active</p>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.text}>{body}</p>
        <Link href="/" style={styles.link}>
          Go to home
        </Link>
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
    fontFamily: "DM Sans, Segoe UI, Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "620px",
    border: "1px solid #dde3ed",
    borderRadius: "16px",
    background: "#ffffff",
    padding: "32px",
  },
  kicker: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#1a6fe8",
  },
  title: {
    margin: 0,
    marginBottom: "12px",
    fontSize: "34px",
    lineHeight: 1.2,
    fontFamily: "Syne, Segoe UI, Helvetica, Arial, sans-serif",
  },
  text: {
    margin: 0,
    marginBottom: "20px",
    lineHeight: 1.6,
    color: "#4a5568",
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #1a6fe8",
    background: "#1a6fe8",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
  },
};
