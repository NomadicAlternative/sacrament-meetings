// Makes the hymn columns of `meetings` nullable: leaders may create a meeting
// without hymns (the music director fills them in separately). Idempotent.
//
// Run it with:  node --env-file=.env.local scripts/migrate-hymns-nullable.mjs

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

await sql`ALTER TABLE meetings ALTER COLUMN opening_hymn DROP NOT NULL`;
await sql`ALTER TABLE meetings ALTER COLUMN sacrament_hymn DROP NOT NULL`;
await sql`ALTER TABLE meetings ALTER COLUMN closing_hymn DROP NOT NULL`;

console.log('meetings: opening_hymn/sacrament_hymn/closing_hymn ahora nullable');

process.exit(0);
