"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TopNavigator from "../components/TopNavigator";

const DEFAULT_FOUNDER_LIMIT = 500;

const FOUNDER_PRODUCTS = {
  "founders-combo": {
    delivery: "Estimated delivery: Q1 2027",
  },
  "p2p-commerce-app-store": {
    delivery: "Estimated delivery: Q1 2027",
  },
  "remote-access-custom-subdomain": {
    delivery: "Estimated delivery: Q4 2026",
  },
};

type FounderProductId = keyof typeof FOUNDER_PRODUCTS;

type FounderSlotProduct = {
  id: FounderProductId;
  sold: number | null;
  remaining: number;
  limit: number;
  soldOut: boolean;
  deliveryWindow: string;
};

type FounderSlotResponse = {
  configured: boolean;
  products?: FounderSlotProduct[];
};

export default function StorePage() {
  const [slotData, setSlotData] = useState<Record<string, FounderSlotProduct>>({});

  useEffect(() => {
    let isActive = true;

    async function loadFounderSlots() {
      try {
        const response = await fetch("/api/founder-slots", { cache: "no-store" });
        if (!response.ok) return;

        const payload: FounderSlotResponse = await response.json();
        if (!payload.products || !isActive) return;

        const mapped = Object.fromEntries(payload.products.map((product) => [product.id, product]));
        setSlotData(mapped);
      } catch {
        // Ignore temporary slot API errors and keep static fallback copy.
      }
    }

    loadFounderSlots();
    return () => {
      isActive = false;
    };
  }, []);

  const founderNote = useMemo(
    () => (productId: FounderProductId, fallbackText: string) => {
      const slot = slotData[productId];
      if (!slot) return fallbackText;
      if (slot.soldOut) return "Founder slots sold out";
      return `${slot.remaining}/${slot.limit} founder slots remaining`;
    },
    [slotData]
  );

  const founderDelivery = useMemo(
    () => (productId: FounderProductId) => {
      return slotData[productId]?.deliveryWindow ?? FOUNDER_PRODUCTS[productId].delivery;
    },
    [slotData]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: #ffffff;
          --surface: #f4f7fb;
          --border: #dde3ed;
          --gold: #1a6fe8;
          --gold-dim: #1452b3;
          --text: #0a0f1e;
          --text-dim: #4a5568;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
        }

        .store-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .store-hero {
          padding: 80px 0 30px;
          max-width: 760px;
        }

        .store-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.9rem, 3.6vw, 2.8rem);
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .store-hero p {
          font-size: 1.02rem;
          color: var(--text-dim);
          line-height: 1.7;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          padding: 20px 0 100px;
        }

        .product-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, transform 0.2s;
        }

        .product-card:hover {
          border-color: var(--gold-dim);
          transform: translateY(-2px);
        }

        .product-card.featured {
          border: 1px solid #93c5fd;
          background: linear-gradient(135deg, rgba(26,111,232,0.05) 0%, rgba(26,111,232,0.01) 100%);
        }

        .product-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--gold);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .product-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .product-price {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--gold);
          margin-bottom: 4px;
        }

        .product-price span {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-dim);
        }

        .product-price-note {
          font-size: 0.8rem;
          color: var(--text-dim);
          margin-bottom: 8px;
        }

        .product-delivery {
          font-size: 0.8rem;
          color: var(--text-dim);
          margin-bottom: 20px;
        }

        .product-desc {
          font-size: 0.9rem;
          color: var(--text-dim);
          line-height: 1.65;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        details.product-detail {
          margin-top: -8px;
          margin-bottom: 20px;
        }

        details.product-detail summary {
          font-size: 0.85rem;
          color: var(--gold);
          cursor: pointer;
          font-family: 'DM Mono', monospace;
        }

        details.product-detail p {
          font-size: 0.85rem;
          color: var(--text-dim);
          margin-top: 10px;
          line-height: 1.6;
        }

        .product-btn {
          background: var(--gold);
          color: #ffffff;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .product-btn:hover {
          background: var(--gold-dim);
        }

        .product-btn.secondary {
          background: transparent;
          color: var(--gold);
          border: 1px solid var(--gold-dim);
        }

        .product-btn.secondary:hover {
          background: rgba(26,111,232,0.06);
        }

        footer {
          border-top: 1px solid var(--border);
          padding: 40px 0;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--text-dim);
        }
      `}</style>

      <main className="store-main">
        <TopNavigator />

        <section className="store-hero">
          <h1>Own your identity. Own your server.</h1>
          <p>
            One-time purchases. No recurring subscriptions. Pick the package that fits what you want to own.
          </p>
          <p style={{ marginTop: "12px", fontSize: "0.95rem" }}>
            Founder pre-orders are live for select products. The first 500 customers lock in founder pricing now and receive access as soon as those products launch.
          </p>
        </section>

        <section className="product-grid">
          <div className="product-card">
            <div className="product-tag">Start here</div>
            <div className="product-title">Comet</div>
            <div className="product-price">Free</div>
            <div className="product-price-note">No signup required to try</div>
            <p className="product-desc">
              Boot a free Urbit server instantly and try Orraah with zero commitment.
            </p>
            <Link href="/download" className="product-btn secondary">Get started free</Link>
          </div>

          <div className="product-card featured">
            <div className="product-tag">Best value</div>
            <div className="product-title">Founder Combo Kit</div>
            <div className="product-price">$175 <span>one-time</span></div>
            <div className="product-price-note">{founderNote("founders-combo", "Founder pre-order • first 500 slots")}</div>
            <div className="product-delivery">{founderDelivery("founders-combo")}</div>
            <p className="product-desc">
              Includes Friends &amp; Family Hosting, Remote Access, Peer-to-Peer Commerce, and AI package.
              Remote Access and Commerce are delivered when those products launch.
            </p>
            <Link href="/store/checkout/founders-combo" className="product-btn">Reserve founder pricing</Link>
          </div>

          <div className="product-card featured">
            <div className="product-tag">Most popular</div>
            <div className="product-title">Planet Identity</div>
            <div className="product-price">$10</div>
            <div className="product-price-note">One-time purchase</div>
            <p className="product-desc">
              Your own Urbit planet - a real identity on the network, owned by you.
            </p>
            <details className="product-detail">
              <summary>Advanced: what can a planet do?</summary>
              <p>
                Planets can spawn dedicated sub-servers (called moons) for specific tasks or apps - available via terminal today, with in-app support coming soon.
              </p>
            </details>
            <Link href="/store/checkout/planet-identity" className="product-btn">Get a planet</Link>
          </div>

          <div className="product-card">
            <div className="product-tag">Founder pre-order</div>
            <div className="product-title">Peer-to-Peer Commerce &amp; App Store</div>
            <div className="product-price">$50 <span>one-time</span></div>
            <div className="product-price-note">{founderNote("p2p-commerce-app-store", "First 500 founder slots")}</div>
            <div className="product-delivery">{founderDelivery("p2p-commerce-app-store")}</div>
            <p className="product-desc">
              Lock in founder pricing now. Access is granted as soon as peer-to-peer commerce goes live.
            </p>
            <Link href="/store/checkout/p2p-commerce-app-store" className="product-btn">Reserve founder pricing</Link>
          </div>

          <div className="product-card">
            <div className="product-tag">Founder pre-order</div>
            <div className="product-title">Remote Access + Custom Subdomain</div>
            <div className="product-price">$50 <span>one-time</span></div>
            <div className="product-price-note">{founderNote("remote-access-custom-subdomain", "First 500 founder slots")}</div>
            <div className="product-delivery">{founderDelivery("remote-access-custom-subdomain")}</div>
            <p className="product-desc">
              Reserve your founder price now and get remote access as soon as this feature launches.
            </p>
            <Link href="/store/checkout/remote-access-custom-subdomain" className="product-btn">Reserve founder pricing</Link>
          </div>
        </section>

        <footer>
          © 2026 Raah Connect LLC — All rights reserved.
        </footer>
      </main>
    </>
  );
}
