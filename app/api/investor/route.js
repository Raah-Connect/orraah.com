// app/api/investor/route.js
import { Resend } from 'resend';

const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || 'you@orraah.com';

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { email, name } = await request.json();

    if (!email || !email.includes('@') || !name?.trim()) {
      return Response.json(
        { error: 'Name and valid email required' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Orraah <updates@orraah.com>',
      to: [email],
      subject: 'Orraah — Pitch Deck Request Received',
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2>Thanks, ${name.split(' ')[0]}.</h2>
          <p>We received your interest in investing in Orraah. We'll follow up shortly with our pitch deck.</p>
          <p>
            Orraah makes it easy for anyone — anywhere in the world — to run a
            personal server, own their data, and participate in the peer-to-peer internet.
            No technical knowledge required.
          </p>
          <p>In the meantime, you're welcome to explore:</p>
          <ul>
            <li><a href="https://github.com/Raah-Connect">GitHub</a></li>
            <li><a href="https://discord.gg/GDarZR92K">Discord Community</a></li>
          </ul>
          <p style="color: #666; font-size: 14px;">— The Orraah Team</p>
          <p style="color: #aaa; font-size: 12px;">© 2025 Orraah · Prosperity Public License 3.0</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: 'Orraah Site <updates@orraah.com>',
      to: [FOUNDER_EMAIL],
      subject: `📬 Investor inquiry: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2>New investor inquiry</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Name / Org</td>
              <td style="padding: 8px; border: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Email</td>
              <td style="padding: 8px; border: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <p style="color: #666; font-size: 13px; margin-top: 16px;">Submitted via orraah.com investor form.</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Investor form error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}