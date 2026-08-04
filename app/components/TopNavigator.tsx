"use client";

import Link from "next/link";

type TopNavigatorProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export default function TopNavigator({
  ctaHref = "/download",
  ctaLabel = "Try it free",
}: TopNavigatorProps) {
  return (
    <>
      <nav className="top-nav" aria-label="Main navigation">
        <Link href="/" className="top-nav-brand">
          <img src="/orraah-logo.png" alt="Orraah" className="top-nav-logo-img" />
          <span className="top-nav-logo-text">Orraah</span>
        </Link>

        <div className="top-nav-right">
          <Link href="/store" className="top-nav-link">Store</Link>
          <Link href="/faq" className="top-nav-link">FAQ</Link>
          <Link href="/contact" className="top-nav-link">Contact</Link>
          <Link href="/download" className="top-nav-link">Download</Link>
          <Link href={ctaHref} className="top-nav-cta">{ctaLabel}</Link>
        </div>
      </nav>

      <style jsx>{`
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 0;
          border-bottom: 1px solid var(--border, #dde3ed);
          gap: 12px;
        }

        .top-nav-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: opacity 0.2s;
          min-width: 0;
        }

        .top-nav-brand:hover {
          opacity: 0.82;
        }

        .top-nav-logo-img {
          height: 60px;
          width: auto;
          flex-shrink: 0;
        }

        .top-nav-logo-text {
          color: var(--text, #0a0f1e);
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.5px;
          font-family: "Syne", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
          white-space: nowrap;
        }

        .top-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: nowrap;
        }

        .top-nav-link {
          text-decoration: none;
          color: var(--text, #0a0f1e);
          font-family: "DM Sans", sans-serif;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .top-nav-link:hover {
          color: var(--gold-dim, #1452b3);
        }

        .top-nav-right .top-nav-cta {
          background-color: var(--gold, #1a6fe8);
          color: #ffffff;
          border: 1px solid var(--gold, #1a6fe8);
          padding: 10px 22px;
          border-radius: 10px;
          font-family: "Syne", sans-serif;
          font-weight: 700;
          font-size: 0.88rem;
          transition: all 0.2s;
          white-space: nowrap;
          letter-spacing: 0.01em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .top-nav-right .top-nav-cta:hover {
          background-color: var(--gold-dim, #1452b3);
          border-color: var(--gold-dim, #1452b3);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(26, 111, 232, 0.2);
        }

        @media (max-width: 640px) {
          .top-nav {
            gap: 10px;
          }

          .top-nav-right {
            max-width: min(56vw, 240px);
            gap: 10px;
            justify-content: flex-end;
            flex-wrap: wrap;
          }

          .top-nav-link {
            font-size: 0.82rem;
          }

          .top-nav-right .top-nav-cta {
            padding: 8px 14px;
          }
        }

        @media (max-width: 480px) {
          .top-nav-logo-img {
            height: 40px;
          }

          .top-nav-logo-text {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </>
  );
}