import { Resend } from 'resend';          // npm module automatically bundled
const resend = new Resend(process.env.RESEND_API_KEY);

export default async (event) => {
  // Netlify > Forms > function payload
  const payload = JSON.parse(event.body);
  const data = payload?.payload?.data || payload;   // covers both local + prod
  const { email, fullName, distance } = data;

  const html = `
    <h2>Centennial Park Marathon – you’re registered!</h2>
    <p>Hi ${fullName},</p>
    <p>Thanks for signing up for the <strong>${distance}</strong> on
       <strong>19 July 2025</strong>.</p>
    <p>One job left: run it 🙂 – we’ll e-mail your PDF certificate afterwards.</p>
    <p style="margin-top:2em;">— The totally-unofficial organising committee</p>
  `;

  try {
    await resend.emails.send({
      from: 'Centennial Park Marathon <noreply@centennialparkmarathon.com>',
      to: email,
      subject: 'Your Centennial Park Marathon “ticket”',
      html
    });
    return { statusCode: 200 };               // let Netlify mark submission “ok”
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};
