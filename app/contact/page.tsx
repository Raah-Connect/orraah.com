import LegalPage from '../components/LegalPage';

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p className="legal-date">Response time: 24-48 hours</p>
      <p className="legal-date">Refund policy response time: 3 business days.</p>

      <p>We&apos;re here to help. Reach out any time and we&apos;ll get back to you as soon as possible.</p>

      <h2>Get in Touch</h2>
      <p>Raah Connect LLC</p>
      <p>Email: support@raahconnect.com</p>
      <p>Include your order ID if applicable.</p>

      <h2>Refunds &amp; Disputes</h2>
      <p>For any issues with your purchase, contact support first. We&apos;ll respond promptly.</p>
      <p>
        Receipts are issued by Paddle. Manage your order and request support at <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a>.
      </p>

      <h2>Community</h2>
      <ul>
        <li><a href="https://discord.gg/GDarZR92K">Discord</a></li>
        <li><a href="https://github.com/Raah-Connect">GitHub</a></li>
        <li><a href="https://t.me/raah-connect">Telegram</a></li>
      </ul>
    </LegalPage>
  );
}