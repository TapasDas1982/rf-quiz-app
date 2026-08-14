import { query } from "../../../lib/db";
import { answerKey } from "../../../lib/answerKey";
import { questions } from "../../../lib/questions";

export const dynamic = "force-dynamic";

export default async function ParticipantDetailPage({ params }) {
  const { id } = params;
  let participant = null;
  let error = null;

  try {
    const result = await query(
      `SELECT name, email, phone, score, total, time_taken_seconds, answers, question_ids, created_at
       FROM participants WHERE id = $1`,
      [id]
    );
    participant = result.rows[0] || null;
  } catch (err) {
    console.error("Failed to load participant:", err);
    error = "Could not load this submission.";
  }

  if (!error && !participant) {
    error = "Submission not found.";
  }

  const qById = new Map(questions.map((q) => [q.id, q]));
  const ids = participant?.question_ids || [];
  const rows = participant?.answers
    ? ids.map((qid, i) => ({
        question: qById.get(qid),
        given: participant.answers[i],
        correctIdx: qById.get(qid) ? answerKey[qid] : null,
      }))
    : [];

  return (
    <main className="page">
      <div className="card" style={{ maxWidth: 800 }}>
        <p>
          <a href="/admin">&larr; Back to all submissions</a>
        </p>
        {error && <div className="error">{error}</div>}
        {participant && (
          <>
            <h1>{participant.name}</h1>
            <p className="subtitle">
              {participant.email} &middot; {participant.phone} &middot; {participant.score}/
              {participant.total} correct &middot; {new Date(participant.created_at).toLocaleString()}
            </p>
            {!participant.answers && (
              <p className="error">
                No per-question data was saved for this submission (it was recorded before this
                feature was added).
              </p>
            )}
            {participant.answers && rows.length === 0 && (
              <p className="error">
                This submission predates the randomized quiz and cannot be broken down per question.
              </p>
            )}
            {rows.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Their Answer</th>
                    <th>Correct Answer</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const q = r.question;
                    const isCorrect = r.given === r.correctIdx;
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{q.q}</td>
                        <td>{r.given == null || r.given === -1 ? "—" : q.options[r.given]}</td>
                        <td>{q.options[r.correctIdx]}</td>
                        <td style={{ color: isCorrect ? "#1f5b3a" : "#b3261e", fontWeight: 600 }}>
                          {isCorrect ? "Correct" : "Wrong"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </main>
  );
}
