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
      `SELECT name, email, phone, score, total, time_taken_seconds, answers, created_at
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
            {participant.answers && (
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
                  {questions.map((q, i) => {
                    const given = participant.answers[i];
                    const correctIdx = answerKey[i];
                    const isCorrect = given === correctIdx;
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{q.q}</td>
                        <td>{given == null || given === -1 ? "—" : q.options[given]}</td>
                        <td>{q.options[correctIdx]}</td>
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
