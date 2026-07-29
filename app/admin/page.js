import { query } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let entries = [];
  let error = null;
  try {
    const result = await query(
      `SELECT name, email, phone, score, total, time_taken_seconds, created_at
       FROM participants ORDER BY created_at DESC`
    );
    entries = result.rows;
  } catch (err) {
    console.error("Failed to load participants:", err);
    error = "Could not load submissions. Check that DATABASE_URL is set correctly.";
  }

  return (
    <main className="page">
      <div className="card" style={{ maxWidth: 900 }}>
        <h1>Quiz Submissions</h1>
        <p className="subtitle">{entries.length} total submissions.</p>
        {error && <div className="error">{error}</div>}
        {!error && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Score</th>
                <th>Time</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i}>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.phone}</td>
                  <td>
                    {e.score}/{e.total}
                  </td>
                  <td>
                    {Math.floor(e.time_taken_seconds / 60)}m {e.time_taken_seconds % 60}s
                  </td>
                  <td>{new Date(e.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
