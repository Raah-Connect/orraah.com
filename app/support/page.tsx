import LegalPage from '../components/LegalPage';

export default function SupportPage() {
  return (
    <LegalPage title="Customer Support">
      <p className="legal-date">Response time: 24–48 hours</p>

      <p>We&apos;re here to help! Reach out any time and we&apos;ll get back to you as soon as possible.</p>

      <h2>Contact Us</h2>
      <p>Email: support@orraah.com</p>
      <p>Include your order ID if applicable.</p>

      <h2>Refunds &amp; Disputes</h2>
      <p>For any issues with your purchase, contact support first. We&apos;ll respond promptly.</p>

      <h2>Community</h2>
      <ul>
        <li><a href="https://discord.gg/GDarZR92K">Discord</a></li>
        <li><a href="https://github.com/Raah-Connect">GitHub</a></li>
        <li><a href="https://t.me/orraah">Telegram</a></li>
      </ul>
    </LegalPage>
  );
}
