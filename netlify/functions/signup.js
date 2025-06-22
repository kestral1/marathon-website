import { Resend } from 'resend';

// -- init --------------------------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);
const redirect = (path) =>
  new Response(null, { status: 302, headers: { Location: path } });

// -- handler -----------------------------------------------------------------
export default async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Parse form (application/x-www-form-urlencoded)
  const formData = await request.formData();
  const email     = formData.get('email');
  const fullName  = formData.get('fullName');
  const distance  = formData.get('distance');

  try {
    await resend.emails.send({
      from: 'Centennial Park Marathon <tickets@resend.dev>', // any verified sender
      to:   email,
      subject: 'Your Centennial Park Marathon “ticket”',
      html: `
        <h2>You're registered!</h2>
        <p>Hi ${fullName},</p>
        <p>See you on <b>19 July 2025</b> for the <b>${distance}</b>.</p>
      `,
    });
    console.log(`✉️  Confirmation sent to ${email}`);
  } catch (err) {
    console.error('Email failed:', err);
    /* fall through to redirect anyway so the visitor isn't stuck */
  }

  return redirect('/success.html');
};
