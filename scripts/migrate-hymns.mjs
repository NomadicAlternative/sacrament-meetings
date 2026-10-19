// Creates the `sunday_hymns` table: hymns are stored per Sunday date, so the
// music director can set them independently of the meetings table (which the
// leaders fill in later). Idempotent.
//
// Run it with:  node --env-file=.env.local scripts/migrate-hymns.mjs

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS sunday_hymns (
    id                SERIAL        PRIMARY KEY,
    date              DATE          NOT NULL UNIQUE,
    opening_hymn      JSONB         NOT NULL,
    sacrament_hymn    JSONB         NOT NULL,
    intermediate_hymn JSONB,
    closing_hymn      JSONB         NOT NULL,
    updated_by        INTEGER       REFERENCES users(id),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
  )
`;

const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM sunday_hymns`;
console.log(`sunday_hymns lista (${count} filas).`);

process.exit(0);
