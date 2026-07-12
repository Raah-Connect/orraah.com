"use client";

import Link from "next/link";

export default function Home() {


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
          --accent: #16a34a;
          --green: #16a34a;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'DM Sans', sans-serif;
            overflow-x: hidden;
            overflow-y: visible;
          }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(26,111,232,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,111,232,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .glow-orb {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26,111,232,0.07) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          pointer-events: none;
          z-index: 0;
        }

        .glow-orb-2 {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%);
          bottom: 10%;
          left: -100px;
          pointer-events: none;
          z-index: 0;
        }

        main {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* NAV */
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

        .logo span { color: var(--text); }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--text-dim);
          border: 1px solid var(--border);
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.1em;
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
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          letter-spacing: 0.01em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-get-started:hover {
          background: var(--gold-dim);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(26,111,232,0.25);
        }

        @media (max-width: 480px) {
          .nav-badge { display: none; }
        }

        /* HERO */
        .hero {
          padding: 100px 0 80px;
          max-width: 780px;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--gold);
          border: 1px solid var(--gold-dim);
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 32px;
          letter-spacing: 0.08em;
          background: rgba(26,111,232,0.06);
        }

        .hero-tag::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.5rem);
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
          color: var(--text);
        }

        h1 em {
          font-style: normal;
          color: var(--gold);
          display: block;
          margin-top: 8px;
        }


        .hero-sub {
          font-size: 1.15rem;
          color: var(--text-dim);
          line-height: 1.7;
          max-width: 600px;
          margin-bottom: 52px;
          font-weight: 300;
        }

        /* WAITLIST */
        .waitlist-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(26,111,232,0.06);
        }

        .waitlist-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .waitlist-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--gold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .waitlist-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .waitlist-desc {
          font-size: 0.9rem;
          color: var(--text-dim);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .input-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        input[type="email"],
        input[type="text"] {
          flex: 1;
          min-width: 220px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 14px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus { border-color: var(--gold); }
        input::placeholder { color: var(--text-dim); }

        .btn-gold {
          background: var(--gold);
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .btn-gold:hover {
          background: var(--gold-dim);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(26,111,232,0.2);
        }

        .success-msg {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--green);
          font-family: 'DM Mono', monospace;
          font-size: 0.9rem;
          padding: 14px 0;
        }

        /* EARLY ADOPTER */
        .early-box {
          background: linear-gradient(135deg, rgba(26,111,232,0.06) 0%, rgba(26,111,232,0.01) 100%);
          border: 1px solid #93c5fd;
          border-radius: 16px;
          padding: 40px;
          margin: 60px 0;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .early-box { grid-template-columns: 1fr; }
        }

        .early-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--gold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .early-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .early-desc {
          font-size: 0.9rem;
          color: var(--text-dim);
          line-height: 1.7;
        }

        .price-card {
          text-align: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px 36px;
          min-width: 180px;
        }

        .price-original {
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          color: var(--text-dim);
          text-decoration: line-through;
          margin-bottom: 4px;
        }

        .price-now {
          font-family: 'Syne', sans-serif;
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 4px;
        }

        .price-label {
          font-size: 0.8rem;
          color: var(--text-dim);
          margin-bottom: 16px;
        }

        .price-badge {
          background: var(--gold);
          color: #ffffff;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }

        /* PERKS */
        .perks {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .perk {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.88rem;
          color: var(--text-dim);
          line-height: 1.5;
        }

        .perk-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* HOW IT WORKS */
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .section-sub {
          color: var(--text-dim);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 48px;
          max-width: 520px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 80px;
        }

        .step {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px;
          transition: border-color 0.2s, transform 0.2s;
        }

        .step:hover {
          border-color: var(--gold-dim);
          transform: translateY(-2px);
        }

        .step-num {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--gold);
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .step-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .step-desc {
          font-size: 0.875rem;
          color: var(--text-dim);
          line-height: 1.65;
        }

        /* FOOTER */
        .social-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          border: 1px solid var(--border);
          color: var(--text);
          background: var(--surface);
          transition: all 0.2s;
        }

        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .social-btn.discord:hover { border-color: #5865f2; color: #5865f2; }
        .social-btn.github:hover { border-color: #0a0f1e; color: #0a0f1e; background: #f0f0f0; }
        .social-btn.telegram:hover { border-color: #0088cc; color: #0088cc; }

        footer {
          border-top: 1px solid var(--border);
          padding: 40px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: var(--gold);
          font-size: 1.1rem;
        }

        .footer-note {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--text-dim);
          letter-spacing: 0.05em;
        }

        .footer-links {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
        }

        .footer-links a {
          color: var(--text-dim);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--gold);
        }

        /* CLOUD VS SOVEREIGN */
        .compare-section {
          padding: 40px 0 60px;
        }

        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 720px) {
          .compare-grid { grid-template-columns: 1fr; }
        }

        .compare-box {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 28px;
          background: var(--surface);
        }

        .compare-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 16px;
        }

        .compare-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-dim);
        }

        .compare-good {
          border-color: #93c5fd;
        }

        /* NODE OPERATOR SECTION */
        .node-section {
          padding: 80px 0;
        }

        .node-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 32px;
        }

        .node-card {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 22px;
          background: var(--surface);
          font-size: 0.9rem;
          color: var(--text-dim);
        }

        .node-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 6px;
          color: var(--text);
        }

       .section-pad { padding: 80px 0 40px; }

        .screenshot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 20px 0 60px;
        }

        .screenshot-grid img {
          width: 100%;
          height: 340px;
          object-fit: contain;
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(26,111,232,0.08);
          padding: 12px;
        }

        @media (max-width: 720px) {
          .screenshot-grid { grid-template-columns: 1fr; }
        }

      `}</style>

      <div className="grid-bg" />
      <div className="glow-orb" />
      <div className="glow-orb-2" />

      <main>
        {/* NAV */}
        <nav>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/orraah-logo.png" alt="Orraah" style={{ height: "60px", width: "auto" }} />
            <span className="logo" style={{ color: "#0a0f1e", alignSelf: "center", lineHeight: "1" }}>Orraah</span>
          </div>
          <div className="nav-right">
            <a href="/store" style={{ textDecoration: "none", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>Store</a>
            <a href="/faq" style={{ textDecoration: "none", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>FAQ</a>
            <a href="/contact" style={{ textDecoration: "none", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>Contact</a>
            <a href="/download" style={{ textDecoration: "none", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>Download</a>
            <a href="/download" className="btn-get-started">Try it free</a>
          </div>
        </nav>

{/* HERO */}
        <section>
          <h1>
            <span style={{ display: "block", paddingBottom: "4px" }}>
              Your computer just got a promotion.
            </span>
            <em>Your data. Your rules.</em>
          </h1>

          <p className="hero-sub">
            Orraah adds a personal server to your computer — nothing else changes.
          </p>
          </section>

        {/* SCREENSHOTS */}
        <section className="screenshot-grid">
          <img src="/screenshot-landscape.png" alt="Orraah landscape view" />
          <img src="/screenshot-server-manager.png" alt="Orraah server manager" />
        </section>

        {/* CLOUD VS SOVEREIGN */}
        <section className="compare-section">
          <div className="section-title">Take back control of your internet</div>
          <p className="section-sub">
            The modern internet runs on corporate servers. Orraah flips that model —
            giving individuals the power to run their own infrastructure.
          </p>

          <div className="compare-grid">
            <div className="compare-box">
              <div className="compare-title">☁️ The Cloud Internet</div>
              <div className="compare-list">
                <div>Your account lives on someone else&apos;s server</div>
                <div>Platforms can ban or lock accounts</div>
                <div>Your data is mined for ads</div>
                <div>Your identity depends on corporations</div>
              </div>
            </div>

            <div className="compare-box compare-good">
              <div className="compare-title">🖥 With Orraah</div>
              <div className="compare-list">
                <div>Your server runs on your own computer</div>
                <div>No platform bans or lockouts</div>
                <div>Your data stays under your control</div>
                <div>Your identity belongs to you</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-pad">
          <div className="section-title">How it works</div>
          <p className="section-sub">
            Orraah bridges the gap between powerful decentralized technology and the people who need it most — but don&apos;t have a computer science degree.
          </p>
          <div className="steps">
            <div className="step">
              <div className="step-num">01 — DOWNLOAD</div>
              <div className="step-title">Install on your computer</div>
              <p className="step-desc">Works on Windows, macOS, and Linux — even older hardware. Download, install, done. No command line or technical knowledge needed.</p>
            </div>
            <div className="step">
              <div className="step-num">02 — ACTIVATE</div>
              <div className="step-title">Turn your PC into a server</div>
              <p className="step-desc">Orraah transforms your existing computer into a personal server in minutes. No new hardware. No cloud subscription. Just your machine, yours alone.</p>
            </div>
            <div className="step">
              <div className="step-num">03 — CONTROL</div>
              <div className="step-title">Own your data completely</div>
              <p className="step-desc">Your files, messages, and identity live on your hardware — not a company&apos;s servers. Start, stop, and manage everything from a clean, simple dashboard.</p>
            </div>
            <div className="step">
              <div className="step-num">04 — CHOOSE</div>
              <div className="step-title">Be as public as you want</div>
              <p className="step-desc">Share what you want, with who you want. Stay fully private or connect to a global peer-to-peer network. Your sovereignty, your choice, from anywhere in the world.</p>
            </div>
          </div>
        </section>

        {/* NODE OPERATOR SECTION */}
        <section className="node-section">
          <div className="section-title">Become a sovereign node operator</div>
          <p className="section-sub">
            Orraah turns your computer into a real internet node.
            Run your own apps, host your own data, and participate in the
            peer-to-peer web — without needing to be a developer.
          </p>

          <div className="node-grid">
            <div className="node-card">
              <div className="node-title">🖥 Personal Server Owner</div>
              Your computer becomes a self-hosted server that runs
              your digital life.
            </div>

            <div className="node-card">
              <div className="node-title">🔐 Self-Sovereign Identity</div>
              Your identity lives on your server, not on corporate
              platforms.
            </div>

            <div className="node-card">
              <div className="node-title">🌐 Peer-to-Peer Participant</div>
              Connect directly with others without relying on
              centralized infrastructure.
            </div>

            <div className="node-card">
              <div className="node-title">⚡ Early Network Pioneer</div>
              The first users help shape the next generation
              internet.
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="footer-logo"><span className="logo" style={{ color: "#0a0f1e" }}>Orraah</span></div>

          <div className="social-links">
            <a href="https://x.com/orraah" target="_blank" rel="noopener noreferrer" className="social-btn x" title="X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://discord.com/invite/GDarZR92K" target="_blank" rel="noopener noreferrer" className="social-btn discord" title="Discord">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://github.com/Raah-Connect/" target="_blank" rel="noopener noreferrer" className="social-btn github" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="https://t.me/orraah" target="_blank" rel="noopener noreferrer" className="social-btn telegram" title="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>

          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/support">Support</Link>
          </div>

          <div className="footer-note">
            © 2026 Raah Connect LLC — All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}
