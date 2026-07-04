export default function Success() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&family=DM+Mono:wght@400&display=swap');

        :root {
          --bg: #ffffff;
          --surface: #f4f7fb;
          --border: #dde3ed;
          --gold: #1a6fe8;
          --text: #0a0f1e;
          --text-dim: #4a5568;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
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

        .wrap {
          position: relative;
          z-index: 1;
          max-width: 560px;
          margin: 120px auto;
          padding: 0 24px;
          text-align: center;
        }

        .icon {
          font-size: 2.5rem;
          color: var(--gold);
          margin-bottom: 24px;
          display: block;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--gold);
          border: 1px solid var(--gold);
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 28px;
          letter-spacing: 0.08em;
          background: rgba(26,111,232,0.06);
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 20px;
          line-height: 1.05;
        }

        h1 em {
          font-style: normal;
          color: var(--gold);
        }

        p {
          color: var(--text-dim);
          line-height: 1.7;
          margin-bottom: 40px;
          font-size: 1rem;
        }

        .links {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        .link-btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          border: 1px solid var(--border);
          color: var(--text);
          background: var(--surface);
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }

        .link-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
          transform: translateY(-1px);
        }

        .back {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--text-dim);
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }

        .back:hover { color: var(--gold); }
      `}</style>

      <div className="grid-bg" />

      <div className="wrap">
        <span className="icon">✦</span>
        <div className="tag">PURCHASE CONFIRMED</div>
        <h1>You&apos;re <em>in.</em></h1>
        <p>
          Your early adopter spot is locked in. We&apos;ll email you the moment
          Orraah is ready to download — with lifetime access at your
          confirmed price, forever.
        </p>

        <div className="links">
          <a
            href="https://discord.gg/GDarZR92K"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            Join Discord
          </a>
          <a
            href="https://github.com/Raah-Connect"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            GitHub
          </a>
          <a
            href="https://t.me/orraah"
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            Telegram
          </a>
        </div>

        <a href="/" className="back">← Back to orraah.com</a>
      </div>
    </>
  );
}
