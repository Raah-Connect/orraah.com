"use client";

import Link from "next/link";

export default function StorePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: #ffffff;
          --surface: #f4f7fb;
          --border: #dde3ed;
          --gold: #1a6fe8;
          --gold-dim: #1452b3;
          --text: #0a0f1e;
          --text-dim: #4a5568;
          --green: #16a34a;
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

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 0;
          border-bottom: 1px solid var(--border);
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
          color: var(--gold);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-right a {
          text-decoration: none;
          color: var(--text);
          font-size: 0.95rem;
        }

        .btn-get-started {
          background: var(--gold);
          color: #ffffff;
          border: none;
          padding: 10px 22px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s;
        }

        .btn-get-started:hover {
          background: var(--gold-dim);
          transform: translateY(-1px);
        }

        .store-hero {
          padding: 80px 0 40px;
          max-width: 700px;
        }

        .store-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }

        .store-hero p {
          font-size: 1.05rem;
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
          margin-bottom: 20px;
        }

        .product-desc {
          font-size: 0.9rem;
          color: var(--text-dim);
          line-height: 1.65;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .product-desc a {
          color: var(--gold);
          text-decoration: none;
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
        <nav>
          <span className="logo">Orraah</span>
          <div className="nav-right">
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/download">Download</Link>
            <Link href="/download" className="btn-get-started">Try it free</Link>
          </div>
        </nav>

        <section className="store-hero">
          <h1>Own your identity. Own your server.</h1>
          <p>
            Start free with a comet, then upgrade whenever you&apos;re ready. Every product here gives you something you actually own — not a subscription to someone else&apos;s platform.
          </p>
        </section>

        <section className="product-grid">
          {/* FREE COMET */}
          <div className="product-card">
            <div className="product-tag">Start here</div>
            <div className="product-title">Comet</div>
            <div className="product-price">Free</div>
            <div className="product-price-note">No signup required to try</div>
            <p className="product-desc">
              Boot a free Urbit server instantly and try Orraah with zero commitment. Upgrade to a planet anytime for a identity that&apos;s truly yours.
            </p>
            <Link href="/download" className="product-btn secondary">Get started free</Link>
          </div>

          {/* PLANET */}
          <div className="product-card featured">
            <div className="product-tag">Most popular</div>
            <div className="product-title">Planet Identity</div>
            <div className="product-price">$10</div>
            <div className="product-price-note">One-time purchase</div>
            <p className="product-desc">
              Your own Urbit planet — a real identity on the network, owned by you.
            </p>
            <details className="product-detail">
              <summary>Advanced: what can a planet do?</summary>
              <p>
                Planets can spawn dedicated sub-servers (called moons) for specific tasks or apps — available via terminal today, with in-app support coming soon.
              </p>
            </details>
            <Link href="/planets" className="product-btn">Get a planet</Link>
          </div>

          {/* FOUNDER PACKAGE 1 */}
          <div className="product-card">
            <div className="product-tag">Founder package</div>
            <div className="product-title">Friends &amp; Family Hosting</div>
            <div className="product-price">$50 <span>first 500 signups</span></div>
            <div className="product-price-note">$149 after the first 500 signups</div>
            <p className="product-desc">
              Host servers for your friends and family under your own infrastructure.
            </p>
            <button className="product-btn">Claim founder pricing</button>
          </div>

          {/* FOUNDER PACKAGE 2 */}
          <div className="product-card">
            <div className="product-tag">Founder package</div>
            <div className="product-title">Remote Access + Custom Subdomain</div>
            <div className="product-price">$50 <span>/ year</span></div>
            <div className="product-price-note">First-year price for the first 500 signups</div>
            <p className="product-desc">
              Access your server remotely with your own subdomain (yourname.orraah.com).
            </p>
            <button className="product-btn">Claim founder pricing</button>
          </div>
          {/* FOUNDER PACKAGE 3 */}
            <div className="product-card">
              <div className="product-tag">Founder package</div>
              <div className="product-title">Peer-to-Peer Commerce &amp; App Store</div>
               <div className="product-price">$50 <span>first 500 signups</span></div>
              <div className="product-price-note">$149 after the first 500 signups</div>
              <p className="product-desc">
                Buy, sell, and discover apps directly with other Orraah users — no middleman, no platform cut.
              </p>
              <button className="product-btn">Claim founder pricing</button>
            </div>

            {/* FOUNDER PACKAGE 4 */}
            <div className="product-card">
              <div className="product-tag">Founder package</div>
              <div className="product-title">AI Package</div>
              <div className="product-price">$50 <span>first 500 signups</span></div>
              <div className="product-price-note">$149 after the first 500 signups</div>
              <p className="product-desc">
                Run your own AI assistant and sandbox on your virtual server — fully private, fully yours.
              </p>
              <button className="product-btn">Claim founder pricing</button>
            </div>
        </section>

        <footer>
          © 2026 Raah Connect LLC — All rights reserved.
        </footer>
      </main>
    </>
  );
}
