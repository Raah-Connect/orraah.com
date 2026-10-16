import LegalPage from '../components/LegalPage';
import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

export default function TermsOfService() {
  return (
    <LegalPage title="Terms of Service">
      <p className="legal-date">Effective Date: October 15, 2026</p>

      <p>
        These Terms of Service are between you and Raah Connect LLC ("Orraah", "we", "us").
        By using Orraah, you agree to these terms. Please read them carefully.
      </p>

      <h2>1. Products and Prelaunch Disclaimer</h2>
      <p>
        Orraah is a desktop application for running and managing self-hosted Urbit ships. Our paid products
        include Planet Identity, a one-time purchase of an Urbit planet that is delivered as an Urbit identity
        transferred to the address you provide, and pre-orders and founder reservations for products that are
        still in development.
      </p>
      <p>
        Some products are pre-launch. Features and timelines may change as development progresses. Delivery
        dates for pre-orders are estimates, not guarantees. Your refund rights for pre-orders are described in
        our <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>2. Payments</h2>
      <p>
        Paid products and pre-orders are listed on our store pages at the time of checkout. Pricing and
        availability may change over time.
      </p>
      <p>
        Orders are processed by Paddle.com, our merchant of record. Paddle handles payment, tax collection and
        refunds, and Paddle's buyer terms apply to your purchase.
      </p>

      <h2>3. Refund Policy</h2>
      <p>
        Refunds are governed by our <Link href="/refund-policy">Refund Policy</Link>. Contact
        support@raahconnect.com with your order ID to request one.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to use Orraah for any unlawful purpose or in any way that could harm others.</p>

      <h2>5. Intellectual Property and Licensing</h2>
      <p>
        Certain open components of Orraah, as identified in our public repositories at
        {' '}<a href="https://github.com/Raah-Connect">github.com/Raah-Connect</a>, are licensed under the
        Prosperity Public License 3.0, which permits noncommercial use under its terms. The core Orraah
        application is proprietary and remains the property of Raah Connect LLC.
      </p>
      <p>
        When you purchase a paid product, we grant you a limited, non-exclusive, non-transferable license to
        use that product under these terms. Purchasing a product does not transfer ownership of our software or
        intellectual property to you. A purchased Planet Identity is an Urbit identity that you own and control
        once it has been transferred to you.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Orraah is provided "as is" and we are not liable for
        any indirect, incidental or consequential damages arising from use of the product. Nothing in these
        terms limits rights you have under the consumer laws where you live.
      </p>

      <h2>7. Termination and Suspension</h2>
      <p>
        We may suspend or terminate your access to Orraah or our paid products if you misuse them, violate
        these terms, or use them in a way that is unlawful or harms others. You may stop using Orraah at any
        time.
      </p>

      <h2>8. Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how we collect and use your information.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These terms are governed by the laws of the State of Arizona, without regard to its conflict of law
        rules. This does not limit any mandatory consumer protections that apply where you live.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these terms as the product evolves. Continued use means you accept the updated terms.
      </p>

      <h2>11. Contact</h2>
      <p>Raah Connect LLC</p>
      <p>Email: support@raahconnect.com</p>

      <SiteFooter />
    </LegalPage>
  );
}
