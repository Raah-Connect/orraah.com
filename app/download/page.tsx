import Link from "next/link";

export default function DownloadPage() {
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

        .dl-nav {
          max-width: 900px;
          margin: 0 auto;
          padding: 28px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
          color: var(--text);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dl-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .dl-nav-right a {
          text-decoration: none;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
        }

        .dl-nav-right a:hover { color: var(--gold); }

        .dl-main {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 24px 80px;
        }

        .dl-title {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .dl-sub {
          color: var(--text-dim);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        .dl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .dl-card {
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          background: var(--surface);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dl-card-icon {
          font-size: 2rem;
        }

        .dl-card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .dl-card-meta {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-dim);
          letter-spacing: 0.05em;
        }

        .dl-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--gold);
          color: #ffffff;
          text-decoration: none;
          border-radius: 10px;
          padding: 12px 20px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s;
          margin-top: auto;
        }

        .dl-btn:hover {
          background: var(--gold-dim);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(26,111,232,0.25);
        }

        .dl-note {
          margin-top: 48px;
          font-size: 0.85rem;
          color: var(--text-dim);
          line-height: 1.7;
        }

        .dl-note a {
          color: var(--gold);
          text-decoration: none;
        }
      `}</style>

      <nav className="dl-nav">
        <Link href="/" className="logo">
          <img src="/orraah-logo.png" alt="Orraah" style={{ height: "48px", width: "auto" }} />
          Orraah
        </Link>
        <div className="dl-nav-right">
          <a href="/#store">Store</a>
          <a href="/#faq">FAQ</a>
          <a href="/#contact">Contact</a>
          <a href="/download">Download</a>
        </div>
      </nav>

      <main className="dl-main">
        <h1 className="dl-title">Download Orraah</h1>
        <p className="dl-sub">
          Version 0.1.0 — Available for Windows, macOS, and Linux.
        </p>

        <div className="dl-grid">
          <div className="dl-card">
            <div className="dl-card-icon">🪟</div>
            <div className="dl-card-title">Windows</div>
            <div className="dl-card-meta">x86_64 · MSI Installer · v0.1.0</div>
            <a
              href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/windows-x86_64/Orraah_0.1.0_x64_en-US.msi"
              className="dl-btn"
            >
              ↓ Download for Windows
            </a>
          </div>

          <div className="dl-card">
            <div className="dl-card-icon">🍎</div>
            <div className="dl-card-title">macOS</div>
            <div className="dl-card-meta">Apple Silicon (ARM) · DMG · v0.1.0</div>
            <a
              href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/darwin-aarch64/Orraah_0.1.0_aarch64.dmg"
              className="dl-btn"
            >
              ↓ Download for macOS
            </a>
          </div>

          <div className="dl-card">
            <div className="dl-card-icon">🐧</div>
            <div className="dl-card-title">Linux</div>
            <div className="dl-card-meta">amd64 · AppImage · v0.1.0</div>
            <a
              href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/linux-x86_64/Orraah_0.1.0_amd64.AppImage"
              className="dl-btn"
            >
              ↓ Download for Linux
            </a>
          </div>
        </div>

        <p className="dl-note">
          Having trouble? Visit <Link href="/support">support</Link> or reach us on <a href="https://discord.com/invite/GDarZR92K" target="_blank" rel="noopener noreferrer">Discord</a>.
        </p>
      </main>
    </>
  );
}
