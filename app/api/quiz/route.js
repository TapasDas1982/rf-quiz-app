import { buildQuiz } from "../../../lib/quizSelector";

export const dynamic = "force-dynamic";

export async function GET() {
  const selected = buildQuiz();
  return Response.json({
    questionIds: selected.map((q) => q.id),
    questions: selected.map(({ id, q, options }) => ({ id, q, options })),
  });
}