const { Pool } = require('pg');

let pool;
function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Add a free Postgres connection string (e.g. from neon.tech) as an environment variable.');
    }
    const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

let initialized = false;
async function ensureTable() {
  if (initialized) return;
  const p = getPool();
  await p.query(`
  CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  answers INTEGER[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  `);
  await p.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS answers INTEGER[];`);
  initialized = true;
}

async function query(text, params) {
  await ensureTable();
  const p = getPool();
  return p.query(text, params);
}

module.exports = { query };
