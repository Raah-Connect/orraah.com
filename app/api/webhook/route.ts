import Stripe from 'stripe';
import { Resend } from 'resend';

const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL ?? 'hello@orraah.com';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const resend = new Resend(process.env.RESEND_API_KEY);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature error:', error);
    return Response.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name ?? 'Early Adopter';
    const firstName = customerName.split(' ')[0];

    if (customerEmail) {
      await resend.emails.send({
        from: 'Orraah <updates@orraah.com>',
        to: [customerEmail],
        subject: "You're in — Orraah Early Adopter Confirmed ✦",
        html: `
          <div style="font-family: sans-serif; max-width: 500px;">
            <h2>Welcome, ${firstName}.</h2>
            <p>Your early adopter purchase is confirmed. You've locked in lifetime access to Orraah at $49 — forever.</p>
            <p>Here's what happens next:</p>
            <ul>
              <li>We'll email you the moment Orraah is ready to download</li>
              <li>You'll get priority onboarding and support</li>
              <li>You can help shape the product roadmap</li>
            </ul>
            <p>In the meantime, join the community:</p>
            <ul>
              <li><a href="https://discord.gg/GDarZR92K">Discord</a></li>
              <li><a href="https://github.com/Raah-Connect">GitHub</a></li>
              <li><a href="https://t.me/orraah">Telegram</a></li>
            </ul>
            <p style="color: #666; font-size: 14px;">— The Orraah Team</p>
            <p style="color: #aaa; font-size: 12px;">© 2025 Orraah · Prosperity Public License 3.0</p>
          </div>
        `,
      });
    }

    await resend.emails.send({
      from: 'Orraah Site <updates@orraah.com>',
      to: [FOUNDER_EMAIL],
      subject: `💰 New early adopter purchase: ${customerName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2>New $49 purchase!</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Name</td>
              <td style="padding: 8px; border: 1px solid #eee;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Email</td>
              <td style="padding: 8px; border: 1px solid #eee;">
                <a href="mailto:${customerEmail}">${customerEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Amount</td>
              <td style="padding: 8px; border: 1px solid #eee;">$49.00</td>
            </tr>
          </table>
          <p style="color: #666; font-size: 13px; margin-top: 16px;">Stripe session: ${session.id}</p>
        </div>
      `,
    });
  }

  return Response.json({ received: true });
}
