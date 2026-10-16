import LegalPage from '../components/LegalPage';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="legal-date">Effective Date: October 15, 2026</p>

      <p>
        Raah Connect LLC ("Orraah", "we", "us") respects your privacy. This Privacy
        Policy explains how we collect, use, share and protect your information when you use orraah.com and our
        products.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Email address, when you join the waitlist, contact us, or make a purchase.</li>
        <li>Name, if you choose to provide it.</li>
        <li>
          Order details, such as the products you purchased, your order number, and the Urbit address or wallet
          you provide for delivery of a planet, along with the planet name.
        </li>
        <li>
          Payment and billing information, such as card details, billing address and tax details. This is
          collected and processed by Paddle (see Section 4). We do not receive or store your full card details.
        </li>
        <li>Server log data, such as IP address, browser type and the pages requested.</li>
        <li>Messages you send us, such as support requests.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To process orders, deliver products, and provide support and refunds.</li>
        <li>To send product updates, launch notifications and important service messages.</li>
        <li>To improve the product and the site.</li>
        <li>To prevent fraud and misuse, and to meet legal, tax and accounting obligations.</li>
      </ul>

      <h2>2a. Legal Bases (EU/UK)</h2>
      <p>
        If you are in the EU or UK, we process your information to perform our contract with you (orders and
        delivery), for our legitimate interests (running and securing the service), to meet legal obligations,
        and, where required, with your consent (such as marketing emails). You can withdraw consent at any time.
      </p>

      <h2>3. Marketing Emails</h2>
      <p>
        Waitlist and update emails can be unsubscribed from at any time using the link in the email or by
        contacting us.
      </p>

      <h2>4. Payments and Paddle</h2>
      <p>
        Orders are processed by Paddle.com Market Ltd. and its affiliates ("Paddle"), our merchant of
        record. Paddle collects your payment and billing information, handles tax and refunds, and acts as an
        independent controller of that information under its own{' '}
        <a href="https://www.paddle.com/legal/privacy">privacy policy</a>. We receive limited order information
        from Paddle, such as your name, email, country and order details.
      </p>

      <h2>5. Blockchain Data</h2>
      <p>
        Urbit planets are identities recorded on a public blockchain. When we deliver or transfer a planet, the
        transaction and the addresses involved are publicly visible and permanent. We cannot alter or delete
        information recorded on the blockchain.
      </p>

      <h2>6. Data Sharing</h2>
      <p>
        We do not sell your personal information. We share it only with service providers needed to operate the
        product, who may process it on our behalf:
      </p>
      <ul>
        <li>Paddle, for payments, taxes and refunds.</li>
        <li>Vercel, for website hosting.</li>
        <li>[Resend / waitlist provider], for sending emails.</li>
      </ul>
      <p>We may also disclose information when required by law or to protect our rights and users.</p>

      <h2>7. Cookies and Analytics</h2>
      <p>
        We use cookies and similar technologies only as needed to run the site. We do not use analytics or
        advertising cookies. If this changes, we will update this policy and, where required by law, ask for your
        consent first.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We keep your information only as long as necessary to provide our services, resolve disputes, and meet
        legal obligations. Order and tax records are kept for the period required by tax and accounting law.
        Waitlist emails are kept until you unsubscribe or ask us to delete them.
      </p>

      <h2>9. Your Rights</h2>
      <p>
        You can request access to, correction of, or deletion of your personal information, and, depending on
        where you live, object to or restrict processing or request a portable copy. Contact us to make a
        request. We may need to keep certain records to meet legal obligations, and we cannot delete data
        recorded on a blockchain. If you are in the EU or UK, you also have the right to complain to your local
        data protection authority.
      </p>

      <h2>10. International Transfers</h2>
      <p>
        We and our service providers may process your information in the United States and other countries. Where
        required, we rely on appropriate safeguards for those transfers.
      </p>

      <h2>11. Children</h2>
      <p>
        Our products are not directed to children under 16, and we do not knowingly collect their personal
        information. If you believe a child has provided us information, contact us and we will delete it.
      </p>

      <h2>12. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect your information. No method of
        transmission or storage is completely secure.
      </p>

      <h2>13. Changes</h2>
      <p>
        We may update this policy as the product evolves. We will post the updated version with a new effective
        date. See also our <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>14. Contact</h2>
      <p>Raah Connect LLC</p>
      <p>Email: support@raahconnect.com</p>

      <SiteFooter />
    </LegalPage>
  );
}
