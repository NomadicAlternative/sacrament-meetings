// Creates the `users` table (roles + membership status) and adds the
// `intermediate_hymn` column to `meetings`. Idempotent: safe to run more than
// once. Seeds the bootstrap president (dagc40@gmail.com) as an approved admin.
//
// Run it with:  node --env-file=.env.local scripts/migrate-users.mjs

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Roles: president (Presidente de Rama, admin), the two counselors, the
// secretary (all full access) and the music director (hymns only).
// Status: pending = requested access, approved = active, rejected = denied.
await sql`
  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL        PRIMARY KEY,
    email         TEXT          NOT NULL UNIQUE,
    name          TEXT,
    role          TEXT          NOT NULL
                                CHECK (role IN
                                  ('president','first_counselor','second_counselor',
                                   'secretary','music_director')),
    status        TEXT          NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','approved','rejected')),
    password_hash TEXT,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    approved_at   TIMESTAMPTZ,
    approved_by   INTEGER       REFERENCES users(id)
  )
`;

// password_hash is only present for credentials (email/password) sign-in;
// OAuth users have no local password. Column is added idempotently in case the
// table already existed from an earlier run.
await sql`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash TEXT
`;

// The intermediate hymn sits between the sacrament and closing hymns. It is
// NULL for the first Sunday of the month, so the column is nullable.
await sql`
  ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS intermediate_hymn JSONB
`;

// Bootstrap: the branch president is pre-approved so there is always an admin
// who can approve the other requests. ON CONFLICT keeps the idempotency when
// the row already exists (it also upgrades a previously pending row). The
// bcrypt hash is for the demo password '1111'.
await sql`
  INSERT INTO users (email, name, role, status, password_hash)
  VALUES ('dagc40@gmail.com', 'Presidente de Rama', 'president', 'approved',
          '$2b$10$9HB7ZGjw17aR/T9axaJ5/.gbzfJ9fnbRmG/voLNJ97HVRt7FLH/Ii')
  ON CONFLICT (email) DO UPDATE
    SET role = 'president', status = 'approved', password_hash = EXCLUDED.password_hash
`;

const users = await sql`SELECT email, role, status FROM users ORDER BY id`;
console.log('users:', users);

const cols = await sql`
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'meetings' ORDER BY ordinal_position
`;
console.log('meetings columns:', cols.map((c) => c.column_name).join(', '));

process.exit(0);
