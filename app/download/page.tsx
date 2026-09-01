import Link from "next/link";
import TopNavigator from "../components/TopNavigator";

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
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .dl-card-icon {
          display: block;
          height: 70px;
          width: 70px;
          object-fit: contain;
          background: #ffffff;
          border-radius: 12px;
          padding: 8px;
        }

        .dl-card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
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

        .dl-btn-small {
          padding: 10px 14px;
          font-size: 0.82rem;
          min-width: 140px;
          margin-top: 0;
        }

        .dl-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
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

        .dl-sub-link {
          margin-top: -8px;
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        .dl-sub-link a {
          color: var(--gold);
          text-decoration: none;
        }
      `}</style>

      <main className="dl-main">
        <TopNavigator />
        <h1 className="dl-title">Download Orraah</h1>
        <p className="dl-sub">
          Version 0.1.5 — Available for Windows, macOS, and Linux.
        </p>

        <div className="dl-grid">
          <div className="dl-card">
            <img src="/windowslogo.png" alt="Windows" className="dl-card-icon" />
            <div className="dl-card-title">Windows</div>
            <a
              href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/windows-x86_64/Orraah_0.1.5_x64_en-US.msi"
              className="dl-btn"
            >
              ↓ Download for Windows
            </a>
          </div>

          <div className="dl-card">
            <img src="/applelogo.jpeg" alt="macOS" className="dl-card-icon" />
            <div className="dl-card-title">macOS</div>
            <a
              href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/darwin-aarch64/Orraah_0.1.5_aarch64.dmg"
              
              className="dl-btn"
            >
              ↓ Download for macOS
            </a>
          </div>

          <div className="dl-card">
            <img src="/linuxlogo.jpeg" alt="Linux" className="dl-card-icon" />
            <div className="dl-card-title">Linux</div>
            <p className="dl-sub-link">
              AppImage (experimental): <a href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/linux-x86_64/Orraah_0.1.5_amd64.AppImage">direct download</a>
            </p>
            <div className="dl-actions">
              <a
                href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/linux-x86_64/Orraah_0.1.5_amd64.deb"
                className="dl-btn dl-btn-small"
              >
                ↓ Download .deb
              </a>
              <a
                href="https://orraah.sfo3.cdn.digitaloceanspaces.com/updates/linux-x86_64/Orraah-0.1.5-1.x86_64.rpm"
                className="dl-btn dl-btn-small"
              >
                ↓ Download .rpm
              </a>
            </div>
          </div>
        </div>

        <p className="dl-note">
          Having trouble? Visit <Link href="/support">support</Link> or reach us on <a href="https://discord.com/invite/GDarZR92K" target="_blank" rel="noopener noreferrer">Discord</a>.
        </p>
      </main>
    </>
  );
}
