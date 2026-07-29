import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query(
      `SELECT name, score, total, time_taken_seconds FROM participants ORDER BY score DESC, time_taken_seconds ASC LIMIT 10`
    );
    return Response.json({ entries: result.rows });
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
    return Response.json({ entries: [] }, { status: 500 });
  }
}
