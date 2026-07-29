import { query } from "../../../lib/db";
import { answerKey } from "../../../lib/answerKey";
import { questions } from "../../../lib/questions";
import { sendResultEmails } from "../../../lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, answers, timeTakenSeconds } = body || {};

  if (typeof name !== "string" || !name.trim()) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof phone !== "string" || !phone.trim()) {
    return Response.json({ error: "Phone is required." }, { status: 400 });
  }
  if (!Array.isArray(answers) || answers.length !== questions.length) {
    return Response.json({ error: "Answers are incomplete." }, { status: 400 });
  }

  const timeTaken = Number.isFinite(timeTakenSeconds) ? Math.max(1, Math.round(timeTakenSeconds)) : 0;

  let score = 0;
  for (let i = 0; i < answerKey.length; i++) {
    if (answers[i] === answerKey[i]) score += 1;
  }
  const total = answerKey.length;

  try {
    await query(
      `INSERT INTO participants (name, email, phone, score, total, time_taken_seconds) VALUES ($1, $2, $3, $4, $5, $6)`,
      [name.trim(), email.trim(), phone.trim(), score, total, timeTaken]
    );
  } catch (err) {
    console.error("Failed to save participant:", err);
    return Response.json({ error: "Could not save your result. Please try again." }, { status: 500 });
  }

  let emailSent = false;
  try {
    await sendResultEmails({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      score,
      total,
      timeTakenSeconds: timeTaken,
    });
    emailSent = true;
  } catch (err) {
    console.error("Failed to send result email:", err);
  }

  return Response.json({ score, total, timeTakenSeconds: timeTaken, emailSent });
}
