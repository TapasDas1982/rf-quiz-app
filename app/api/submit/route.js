import { query } from "../../../lib/db";
import { answerKey } from "../../../lib/answerKey";
import { questions } from "../../../lib/questions";
import { QUESTIONS_PER_QUIZ } from "../../../lib/quizSelector";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const idToQuestion = new Map(questions.map((q) => [q.id, q]));

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, questionIds, answers, timeTakenSeconds } = body || {};

  if (typeof name !== "string" || !name.trim()) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof phone !== "string" || !phone.trim()) {
    return Response.json({ error: "Phone is required." }, { status: 400 });
  }
  if (
    !Array.isArray(questionIds) ||
    questionIds.length !== QUESTIONS_PER_QUIZ ||
    questionIds.some((id) => !idToQuestion.has(id))
  ) {
    return Response.json({ error: "Invalid question set." }, { status: 400 });
  }
  if (!Array.isArray(answers) || answers.length !== questionIds.length) {
    return Response.json({ error: "Answers are incomplete." }, { status: 400 });
  }

  const timeTaken = Number.isFinite(timeTakenSeconds) ? Math.max(1, Math.round(timeTakenSeconds)) : 0;

  let score = 0;
  for (let i = 0; i < questionIds.length; i++) {
    if (answers[i] === answerKey[questionIds[i]]) score += 1;
  }
  const total = questionIds.length;

  try {
    await query(
      `INSERT INTO participants (name, email, phone, score, total, time_taken_seconds, answers, question_ids) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name.trim(), email.trim(), phone.trim(), score, total, timeTaken, answers, questionIds]
    );
  } catch (err) {
    console.error("Failed to save participant:", err);
    return Response.json({ error: "Could not save your result. Please try again." }, { status: 500 });
  }

  return Response.json({ score, total, timeTakenSeconds: timeTaken });
}
