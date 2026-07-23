
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_PLANETS_API_URL ?? "";

export default function PlanetsPage() {
  const [planets, setPlanets] = useState<string[]>([]);
  const [loading, setLoading] = useState(!!API_URL);
  const [error, setError] = useState<string | null>(
    API_URL ? null : "API URL not configured"
  );

  useEffect(() => {
    if (!API_URL) return;

    fetch(`${API_URL}/api/planets`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data: { planets: { id: number; patp: string; status: string }[] }) => {
        setPlanets(data.planets.map((row) => row.patp));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
        }

        .planets-main {
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

        .nav-right a {
          text-decoration: none;
          color: var(--text);
          font-size: 0.95rem;
          margin-left: 16px;
        }

        .planets-hero {
          padding: 60px 0 30px;
          max-width: 700px;
        }

        .planets-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .planets-hero p {
          font-size: 1rem;
          color: var(--text-dim);
          line-height: 1.6;
        }

        .planet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          padding: 20px 0 100px;
        }

        .planet-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .planet-patp {
          font-family: 'DM Mono', monospace;
          font-size: 1.05rem;
          font-weight: 500;
        }

        .planet-btn {
          background: var(--gold);
          color: #ffffff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .planet-btn:disabled {
          background: var(--border);
          color: var(--text-dim);
          cursor: not-allowed;
        }

        .status-msg {
          padding: 60px 0;
          text-align: center;
          color: var(--text-dim);
          font-family: 'DM Mono', monospace;
          font-size: 0.9rem;
        }
      `}</style>

      <main className="planets-main">
        <nav>
          <span className="logo">Orraah</span>
          <div className="nav-right">
            <Link href="/store">Store</Link>
            <Link href="/download">Download</Link>
          </div>
        </nav>

        <section className="planets-hero">
          <h1>Available planets</h1>
          <p>
            Each planet below is a unique identity on the Urbit network. Pick one to make it yours.
          </p>
        </section>

        {loading && <p className="status-msg">Loading inventory…</p>}
        {error && <p className="status-msg">Couldn&apos;t load inventory: {error}</p>}
        {!loading && !error && planets.length === 0 && (
          <p className="status-msg">No planets available right now — check back soon.</p>
        )}

        {!loading && !error && planets.length > 0 && (
          <section className="planet-grid">
            {planets.map((patp) => (
              <div className="planet-card" key={patp}>
                <Image
                  src={`${API_URL}/api/sigil/${encodeURIComponent(patp)}?size=96&fg=white&bg=%231a6fe8`}
                  alt={patp}
                  width={96}
                  height={96}
                />
                <span className="planet-patp">{patp}</span>
                <button className="planet-btn" disabled>
                  Buy — coming soon
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}