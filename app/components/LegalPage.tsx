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
        }

        .legal-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          color: var(--gold);
          text-decoration: none;
        }

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
        <a href="/" className="legal-logo">orraah</a>
      </nav>

      <div className="legal-wrap">
        <h1>{title}</h1>
        {children}
      </div>
    </>
  );
}
