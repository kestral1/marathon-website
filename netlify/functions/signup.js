import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Classic Netlify Function signature (event, context)
 * Returns a Fetch API Response to satisfy Functions v3
 */
export default async (event) => {
  /* ── allow only POST ─────────────────────────────── */
  if (event.httpMethod !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  /* ── parse form-urlencoded body ──────────────────── */
  const params    = new URLSearchParams(event.body || '');
  const email     = params.get('email');
  const fullName  = params.get('fullName');
  const distance  = params.get('distance');

  /* ── send confirmation e-mail (fail-soft) ────────── */
  try {
    await resend.emails.send({
      from: 'Centennial Park Marathon <tickets@resend.dev>', // swap after domain verification
      to:   email,
      subject: 'Your Centennial Park Marathon “ticket”',
      html: `
        <h2>You’re registered!</h2>
        <p>Hi ${fullName},</p>
        <p>See you on <b>19 July 2025</b> for the <b>${distance}</b>.</p>
      `,
    });
    console.log(`✉️  Email sent to ${email}`);
  } catch (err) {
    console.error('Email failed:', err);
    /* visitor still gets redirected */
  }

  /* ── redirect visitor to the thank-you page ──────── */
  return new Response(null, {
    status: 302,
    headers: { Location: '/success.html' },
  });
};
