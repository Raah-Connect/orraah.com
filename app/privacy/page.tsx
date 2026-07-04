import LegalPage from '../components/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="legal-date">Effective Date: January 1, 2026</p>

      <p>
        Orraah (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This Privacy Policy explains how we collect, use, and protect your information.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Email address (when you join the waitlist or make a purchase)</li>
        <li>Name (optional, if provided)</li>
        <li>Payment information (processed securely by Stripe — we do not store card details)</li>
        <li>Basic usage data (e.g., page visits, interactions)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide access to Orraah</li>
        <li>Send product updates and important notifications</li>
        <li>Process payments and confirm purchases</li>
        <li>Improve the product and user experience</li>
      </ul>

      <h2>3. Payments</h2>
      <p>All payments are handled by Stripe. We do not store or have access to your full payment details.</p>

      <h2>4. Data Sharing</h2>
      <p>We do not sell your data. We only share information with trusted services (like Stripe) necessary to operate the product.</p>

      <h2>5. Data Retention</h2>
      <p>We retain your information only as long as necessary to provide our services or comply with legal obligations.</p>

      <h2>6. Your Rights</h2>
      <p>You can request access, correction, or deletion of your data at any time by contacting us.</p>

      <h2>7. Contact</h2>
      <p>Email: support@orraah.com</p>

      <h2>8. Changes</h2>
      <p>We may update this policy as the product evolves. Continued use means you accept the updated policy.</p>
    </LegalPage>
  );
}
