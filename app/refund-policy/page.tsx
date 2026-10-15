import LegalPage from '../components/LegalPage';
import SiteFooter from '../components/SiteFooter';

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy">
      <p className="legal-date">Last updated: October 15, 2026</p>

      <p>
        Raah Connect LLC ("Orraah", "we", "us") sells its products through Paddle.com,
        our merchant of record. Paddle processes all payments and refunds. This policy describes when we approve
        refunds. Paddle&apos;s buyer terms also apply to your purchase.
      </p>

      <h2>1. Planet Identity ($10, one-time purchase)</h2>
      <p>
        You may request a refund within 14 days of purchase if the planet&apos;s ownership has not changed. This
        means the planet&apos;s current owner address still matches the address tied to the master ticket we issued
        with your purchase. We verify this on-chain.
      </p>
      <p>To receive a refund:</p>
      <ul>
        <li>If you have not yet claimed the planet, confirm this in your request.</li>
        <li>
          If you have claimed it but not changed its ownership, transfer it back to the address we provide when we
          approve your request.
        </li>
      </ul>
      <p>
        A purchase is not refundable if you have changed the planet&apos;s ownership, transferred it to another
        address, or requested a refund more than 14 days after purchase.
      </p>
      <p>If we cannot deliver your planet, you will receive a full refund.</p>
      <p>
        By completing checkout, you consent to immediate delivery of the planet and acknowledge that changing its
        ownership ends your right to a refund and any right of withdrawal.
      </p>

      <h2>2. Pre-orders and Founder Reservations</h2>
      <p>
        This covers the Founder Combo Kit and Remote Access + Custom Subdomain.
      </p>
      <ul>
        <li>Pre-orders are fully refundable at any time before delivery.</li>
        <li>Once access to a product has been granted, that product is no longer refundable.</li>
        <li>
          If a product has not launched within 90 days of its estimated delivery date, you may request a full
          refund.
        </li>
        <li>
          For the Founder Combo Kit, refunds before delivery cover the whole kit. After some components have
          launched, we will refund the unlaunched portion on request.
        </li>
      </ul>

      <h2>3. Free Products</h2>
      <p>Comet and other free offerings are provided at no charge and have no refund.</p>

      <h2>4. How to Request a Refund</h2>
      <p>
        Email support@raahconnect.com from the address you used to purchase. Include your order number and, for
        Planet Identity, the planet name. We respond within 3 business days.
      </p>

      <h2>5. How Refunds Are Paid</h2>
      <p>
        Approved refunds go to your original payment method through Paddle. Timing depends on your bank or card
        issuer, typically 5-10 business days. Taxes collected on the purchase are refunded with it.
      </p>

      <h2>6. Your Statutory Rights</h2>
      <p>Nothing in this policy limits rights you have under the consumer laws where you live.</p>

      <h2>7. Contact</h2>
      <p>Raah Connect LLC</p>
      <p>Email: support@raahconnect.com</p>

      <SiteFooter />
    </LegalPage>
  );
}