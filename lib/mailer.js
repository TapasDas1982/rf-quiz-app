const nodemailer = require('nodemailer');

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER / EMAIL_PASS are not set. Add a Gmail address and an App Password as environment variables.');
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendResultEmails({ name, email, phone, score, total, timeTakenSeconds }) {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const pct = Math.round((score / total) * 100);
  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;

const userHtml = `
<p>Hi ${escapeHtml(name)},</p>
<p>Thanks for completing the Reverse Factor knowledge quiz. Here's your result:</p>
<p style="font-size:20px;font-weight:bold;">${score} / ${total} (${pct}%)</p>
<p>Time taken: ${minutes}m ${seconds}s</p>
<p>Check the live leaderboard to see how you rank.</p>
`;

const adminHtml = `
<p>New quiz submission:</p>
<ul>
<li><b>Name:</b> ${escapeHtml(name)}</li>
<li><b>Email:</b> ${escapeHtml(email)}</li>
<li><b>Phone:</b> ${escapeHtml(phone)}</li>
<li><b>Score:</b> ${score} / ${total} (${pct}%)</li>
<li><b>Time taken:</b> ${minutes}m ${seconds}s</li>
</ul>
`;

await Promise.all([
  transporter.sendMail({
    from: `Reverse Factor Quiz <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your quiz result: ${score}/${total}`,
    html: userHtml,
  }),
  transporter.sendMail({
    from: `Reverse Factor Quiz <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New quiz submission - ${name} (${score}/${total})`,
    html: adminHtml,
  }),
  ]);
}

function escapeHtml(str) {
  return String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
}

module.exports = { sendResultEmails };
