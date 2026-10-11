// app/api/waitlist/route.js
import { Resend } from 'resend';

const COOLDOWN_MS = 30 * 1000;
const ipSubmissionTracker = new Map();

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return 'unknown';
}

function isCoolingDown(ip) {
  const previous = ipSubmissionTracker.get(ip);
  if (!previous) return false;
  return Date.now() - previous < COOLDOWN_MS;
}

async function syncContactToAudience(email, resendApiKey) {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return;

  const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
    }),
    cache: 'no-store',
  });

  // Contact already exists in this audience.
  if (response.status === 409) {
    return;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Audience sync failed (${response.status}): ${errorText.slice(0, 300)}`);
  }
}

export async function POST(request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return Response.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  try {
    const clientIp = getClientIp(request);
    if (isCoolingDown(clientIp)) {
      return Response.json(
        { error: 'Please wait before trying again' },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return Response.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    await syncContactToAudience(normalizedEmail, resendApiKey);

    await resend.emails.send({
      from: 'Orraah <updates@orraah.com>',
      to: [normalizedEmail],
      subject: 'Thanks for joining the waitlist!',
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2>Thanks for joining the waitlist!</h2>
          <p>We'll notify you the moment Orraah launches.</p>
          <p>In the meantime, join our community:</p>
          <ul>
            <li><a href="https://discord.gg/GDarZR92K">Discord</a></li>
            <li><a href="https://github.com/Raah-Connect">GitHub</a></li>
            <li><a href="https://t.me/orraah">Telegram</a></li>
          </ul>
          <p style="color: #666; font-size: 14px;">— The Orraah Team</p>
        </div>
      `,
    });

    ipSubmissionTracker.set(clientIp, Date.now());

    return Response.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}