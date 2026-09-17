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

// Mutation stubs. The signatures are in place so Week 04 only has to fill in
// the bodies once the forms exist.
export async function addMeeting(
  _data: Omit<SacramentMeeting, 'id'>,
): Promise<SacramentMeeting> {
  throw new Error('addMeeting: implemented in Week 04');
}

export async function updateMeeting(
  _id: number,
  _updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  throw new Error('updateMeeting: implemented in Week 04');
}

export async function deleteMeeting(_id: number): Promise<boolean> {
  throw new Error('deleteMeeting: implemented in Week 04');
}
