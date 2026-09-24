import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

// The connection string comes from the environment. It is never hardcoded, and
// .env.local is gitignored, because it contains the database password.
const sql = neon(process.env.DATABASE_URL!);

export const ITEMS_PER_PAGE = 5;

// Every SELECT maps the snake_case columns to the camelCase names the app
// expects, so the TypeScript type stays the contract and the database stays a
// detail of this file.
//
// The announcements line deserves a comment: it returns NULL when the array is
// empty. The type says `announcements?: string[]` — "may not exist" — which is
// different from "exists and is empty". Without this, the detail page would
// render an empty Announcements section on every meeting that has none.

export async function getMeetings(
  query: string = '',
  currentPage: number = 1,
): Promise<SacramentMeeting[]> {
  const searchTerm = `%${query}%`;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding,
      conducting,
      CASE WHEN cardinality(announcements) = 0 THEN NULL ELSE announcements END AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE
      presiding       ILIKE ${searchTerm}
      OR conducting   ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;

  return rows as unknown as SacramentMeeting[];
}

// Total page count. Without this the pagination controls cannot know whether a
// "Next" link should exist, so it is half of the feature, not a detail.
export async function getMeetingsTotalPages(query: string = ''): Promise<number> {
  const searchTerm = `%${query}%`;

  const rows = await sql`
    SELECT COUNT(*)::int AS count
    FROM meetings
    WHERE
      presiding       ILIKE ${searchTerm}
      OR conducting   ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
  `;

  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding,
      conducting,
      CASE WHEN cardinality(announcements) = 0 THEN NULL ELSE announcements END AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
  `;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Looks a meeting up by its date.
//
// Why this exists: the Week 03 getMeetings signature replaced the old
// `date?: string | null` parameter with search and pagination, which removed
// the only way to ask for "the meeting on this specific Sunday". The
// /meetings/current route needs exactly that, so it lives here as its own
// function. The API route uses it too, to keep /api/meetings?date= working.
export async function getMeetingByDate(isoDate: string): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding,
      conducting,
      CASE WHEN cardinality(announcements) = 0 THEN NULL ELSE announcements END AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE date = ${isoDate}
  `;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Mutation helpers. The SELECT in RETURNING maps snake_case -> camelCase
// exactly like the reads above, so addMeeting and updateMeeting return the
// same shape the rest of the app consumes. JSONB fields are written as JSON
// strings cast to ::jsonb, matching scripts/seed.mjs.

export async function addMeeting(
  data: Omit<SacramentMeeting, 'id'>,
): Promise<SacramentMeeting> {
  const rows = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${data.date}, ${data.meetingType}, ${data.presiding}, ${data.conducting},
      ${data.announcements ?? []},
      ${JSON.stringify(data.openingHymn)}::jsonb, ${data.openingPrayer},
      ${JSON.stringify(data.wardBusiness)}::jsonb, ${data.stakeBusiness},
      ${JSON.stringify(data.sacramentHymn)}::jsonb,
      ${JSON.stringify(data.speakers)}::jsonb,
      ${JSON.stringify(data.closingHymn)}::jsonb, ${data.closingPrayer}
    )
    RETURNING
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding,
      conducting,
      CASE WHEN cardinality(announcements) = 0 THEN NULL ELSE announcements END AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
  `;

  return rows[0] as unknown as SacramentMeeting;
}

// COALESCE keeps the existing column value when a field is absent from
// `updates`. Passing NULL for a JSONB/text column inside `${}` is safe: the
// ::jsonb cast turns it into NULL::jsonb, so COALESCE falls back to the old
// value instead of overwriting it.
export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    UPDATE meetings
    SET
      date             = COALESCE(${updates.date ?? null}, date),
      meeting_type     = COALESCE(${updates.meetingType ?? null}, meeting_type),
      presiding        = COALESCE(${updates.presiding ?? null}, presiding),
      conducting       = COALESCE(${updates.conducting ?? null}, conducting),
      announcements    = COALESCE(${updates.announcements ?? null}, announcements),
      opening_hymn     = COALESCE(${updates.openingHymn ? JSON.stringify(updates.openingHymn) : null}::jsonb, opening_hymn),
      opening_prayer   = COALESCE(${updates.openingPrayer ?? null}, opening_prayer),
      ward_business    = COALESCE(${updates.wardBusiness ? JSON.stringify(updates.wardBusiness) : null}::jsonb, ward_business),
      stake_business   = COALESCE(${updates.stakeBusiness ?? null}, stake_business),
      sacrament_hymn   = COALESCE(${updates.sacramentHymn ? JSON.stringify(updates.sacramentHymn) : null}::jsonb, sacrament_hymn),
      speakers         = COALESCE(${updates.speakers ? JSON.stringify(updates.speakers) : null}::jsonb, speakers),
      closing_hymn     = COALESCE(${updates.closingHymn ? JSON.stringify(updates.closingHymn) : null}::jsonb, closing_hymn),
      closing_prayer   = COALESCE(${updates.closingPrayer ?? null}, closing_prayer)
    WHERE id = ${id}
    RETURNING
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding,
      conducting,
      CASE WHEN cardinality(announcements) = 0 THEN NULL ELSE announcements END AS announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
  `;

  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const rows = await sql`
    DELETE FROM meetings WHERE id = ${id} RETURNING id
  `;

  return rows.length > 0;
}
