import { neon } from '@neondatabase/serverless';
import type { Hymn } from './types';

const sql = neon(process.env.DATABASE_URL!);

// Hymns for one Sunday. The intermediate hymn is omitted on the first Sunday
// of the month, so it may be absent.
export interface SundayHymns {
  date: string; // 'YYYY-MM-DD'
  openingHymn: Hymn;
  sacramentHymn: Hymn;
  intermediateHymn?: Hymn;
  closingHymn: Hymn;
}

function mapRow(row: Record<string, unknown>): SundayHymns {
  return {
    date: row.date as string,
    openingHymn: row.openingHymn as Hymn,
    sacramentHymn: row.sacramentHymn as Hymn,
    intermediateHymn: (row.intermediateHymn as Hymn | null) ?? undefined,
    closingHymn: row.closingHymn as Hymn,
  };
}

// All saved hymns, oldest first. Used to know which Sundays already have hymns.
export async function listHymns(): Promise<SundayHymns[]> {
  const rows = await sql`
    SELECT
      to_char(date, 'YYYY-MM-DD') AS "date",
      opening_hymn                AS "openingHymn",
      sacrament_hymn              AS "sacramentHymn",
      intermediate_hymn           AS "intermediateHymn",
      closing_hymn                AS "closingHymn"
    FROM sunday_hymns
    ORDER BY date ASC
  `;

  return rows.map(mapRow);
}

export async function getHymnsByDate(
  isoDate: string,
): Promise<SundayHymns | null> {
  const rows = await sql`
    SELECT
      to_char(date, 'YYYY-MM-DD') AS "date",
      opening_hymn                AS "openingHymn",
      sacrament_hymn              AS "sacramentHymn",
      intermediate_hymn           AS "intermediateHymn",
      closing_hymn                AS "closingHymn"
    FROM sunday_hymns
    WHERE date = ${isoDate}
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}

export async function upsertHymns(
  isoDate: string,
  hymns: {
    openingHymn: Hymn;
    sacramentHymn: Hymn;
    intermediateHymn?: Hymn;
    closingHymn: Hymn;
  },
  userId: number,
): Promise<void> {
  await sql`
    INSERT INTO sunday_hymns (
      date, opening_hymn, sacrament_hymn, intermediate_hymn, closing_hymn, updated_by
    ) VALUES (
      ${isoDate},
      ${JSON.stringify(hymns.openingHymn)}::jsonb,
      ${JSON.stringify(hymns.sacramentHymn)}::jsonb,
      ${hymns.intermediateHymn ? JSON.stringify(hymns.intermediateHymn) : null}::jsonb,
      ${JSON.stringify(hymns.closingHymn)}::jsonb,
      ${userId}
    )
    ON CONFLICT (date) DO UPDATE
      SET opening_hymn      = EXCLUDED.opening_hymn,
          sacrament_hymn    = EXCLUDED.sacrament_hymn,
          intermediate_hymn = EXCLUDED.intermediate_hymn,
          closing_hymn      = EXCLUDED.closing_hymn,
          updated_by        = EXCLUDED.updated_by,
          updated_at        = now()
  `;
}
