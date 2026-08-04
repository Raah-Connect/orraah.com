import Link from "next/link";

export default function WelcomePage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <p style={styles.kicker}>Subscription active</p>
        <h1 style={styles.title}>Welcome to Orraah</h1>
        <p style={styles.text}>
          Your checkout is complete. You can now continue to your dashboard and start using your plan.
        </p>
        <Link href="/" style={styles.link}>
          Go to home
        </Link>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "#f8fbff",
    color: "#0a0f1e",
    fontFamily: "DM Sans, Segoe UI, Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "620px",
    border: "1px solid #dde3ed",
    borderRadius: "16px",
    background: "#ffffff",
    padding: "32px",
  },
  kicker: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#1a6fe8",
  },
  title: {
    margin: 0,
    marginBottom: "12px",
    fontSize: "34px",
    lineHeight: 1.2,
    fontFamily: "Syne, Segoe UI, Helvetica, Arial, sans-serif",
  },
  text: {
    margin: 0,
    marginBottom: "20px",
    lineHeight: 1.6,
    color: "#4a5568",
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #1a6fe8",
    background: "#1a6fe8",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
  },
};
