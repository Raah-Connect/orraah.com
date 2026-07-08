export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: #ffffff;
          --surface: #f4f7fb;
          --border: #dde3ed;
          --gold: #1a6fe8;
          --text: #0a0f1e;
          --text-dim: #4a5568;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
        }

        .legal-nav {
          max-width: 800px;
          margin: 0 auto;
          padding: 28px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .legal-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          color: #0a0f1e;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .legal-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .legal-nav-right a {
          text-decoration: none;
          color: #0a0f1e;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
        }

        .legal-nav-right a:hover { color: var(--gold); }

        .legal-wrap {
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        .legal-wrap h1 {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          color: var(--text);
        }

        .legal-wrap h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          margin: 36px 0 12px;
          color: var(--text);
        }

        .legal-wrap p {
          color: var(--text-dim);
          line-height: 1.8;
          margin-bottom: 16px;
          font-size: 0.95rem;
        }

        .legal-wrap ul {
          color: var(--text-dim);
          line-height: 1.8;
          font-size: 0.95rem;
          padding-left: 20px;
          margin-bottom: 16px;
        }

        .legal-wrap li { margin-bottom: 6px; }

        .legal-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-bottom: 40px;
          letter-spacing: 0.05em;
        }
      `}</style>

      <nav className="legal-nav">
        <a href="/" className="legal-logo">
          <img src="/orraah-logo.png" alt="Orraah" style={{ height: "48px", width: "auto" }} />
          Orraah
        </a>
        <div className="legal-nav-right">
          <a href="/store">Store</a>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/download">Download</a>
        </div>
      </nav>

      <div className="legal-wrap">
        <h1>{title}</h1>
        {children}
      </div>
    </>
  );
}
