import crypto from 'node:crypto';

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function getUnsubscribeSecret() {
  return process.env.WAITLIST_UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY || '';
}

function signEmail(email) {
  const secret = getUnsubscribeSecret();
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update(email, 'utf8').digest('hex');
}

function isValidToken(email, token) {
  if (!email || !token) return false;
  const expected = signEmail(email);
  if (!expected) return false;

  const expectedBuffer = Buffer.from(expected, 'hex');
  const tokenBuffer = Buffer.from(token, 'hex');
  if (expectedBuffer.length !== tokenBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, tokenBuffer);
}

function htmlResponse(message, status = 200) {
  return new Response(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Orraah Waitlist</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f8fbff; color: #0a0f1e; margin: 0; padding: 24px; }
            .card { max-width: 560px; margin: 48px auto; background: #fff; border: 1px solid #dde3ed; border-radius: 12px; padding: 24px; }
            h1 { margin: 0 0 12px; font-size: 22px; }
            p { margin: 0; line-height: 1.6; color: #334155; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Waitlist Preferences Updated</h1>
            <p>${message}</p>
          </div>
        </body>
      </html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  );
}

async function markUnsubscribed(email, resendApiKey, audienceId) {
  const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      unsubscribed: true,
    }),
    cache: 'no-store',
  });

  if (response.ok || response.status === 409) {
    return;
  }

  const errorText = await response.text();
  throw new Error(`Unsubscribe failed (${response.status}): ${errorText.slice(0, 300)}`);
}

async function handleUnsubscribe(email, token) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedToken = typeof token === 'string' ? token.trim() : '';

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return htmlResponse('Invalid unsubscribe request: email is missing or malformed.', 400);
  }

  if (!isValidToken(normalizedEmail, normalizedToken)) {
    return htmlResponse('Invalid or expired unsubscribe link. Please request a new waitlist email.', 400);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resendApiKey || !audienceId) {
    return htmlResponse('Unsubscribe is not configured yet. Please email support@raahconnect.com and we will remove you.', 500);
  }

  try {
    await markUnsubscribed(normalizedEmail, resendApiKey, audienceId);
    return htmlResponse(`You have been unsubscribed: ${normalizedEmail}`);
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return htmlResponse('We could not process your unsubscribe right now. Please try again later or email support@raahconnect.com.', 500);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';
  return handleUnsubscribe(email, token);
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const email = payload?.email ?? '';
  const token = payload?.token ?? '';
  return handleUnsubscribe(email, token);
}
