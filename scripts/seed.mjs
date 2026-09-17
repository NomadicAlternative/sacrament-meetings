// Creates the `meetings` table and seeds it with test data.
//
// Run it with:  node --env-file=.env.local scripts/seed.mjs
//
// The script is idempotent: it recreates the table from scratch every time,
// so it is safe to run more than once while developing.

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS meetings (
    id             SERIAL        PRIMARY KEY,
    date           DATE          NOT NULL UNIQUE,
    meeting_type   VARCHAR(20)   NOT NULL
                                 CHECK (meeting_type IN
                                   ('testimony','regular','stake','general','special')),
    presiding      VARCHAR(255)  NOT NULL,
    conducting     VARCHAR(255)  NOT NULL,
    announcements  TEXT[]        DEFAULT '{}',
    opening_hymn   JSONB         NOT NULL,
    opening_prayer VARCHAR(255)  NOT NULL,
    ward_business  JSONB         DEFAULT '[]',
    stake_business BOOLEAN       DEFAULT false,
    sacrament_hymn JSONB         NOT NULL,
    speakers       JSONB         DEFAULT '[]',
    closing_hymn   JSONB         NOT NULL,
    closing_prayer VARCHAR(255)  NOT NULL
  )
`;

await sql`TRUNCATE meetings RESTART IDENTITY`;

// Nine consecutive Sundays, which gives two pages at five per page.
// The record on 2026-09-13 is the most recent Sunday, so /meetings/current
// has somewhere to land.
const meetings = [
  {
    date: '2026-07-26',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: [],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Primary president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'In Remembrance of Thy Suffering' },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Youth Choir', topic: 'A Childs Prayer', type: 'musical-number' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis'
  },
  {
    date: '2026-08-02',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Sister Taylor',
    announcements: ['Fast Sunday next week', 'Ward choir practice Thursday'],
    openingHymn: { number: 142, title: 'Sweet Hour of Prayer' },
    openingPrayer: 'Brother Anderson',
    wardBusiness: [{ description: 'Released: Primary music leader' }],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [],
    closingHymn: { number: 100, title: 'Nearer, My God, to Thee' },
    closingPrayer: 'Sister Anderson'
  },
  {
    date: '2026-08-09',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: ['Ward temple night: August 15'],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Sister Harris',
    wardBusiness: [{ description: 'Sustaining of new ward clerk' }],
    stakeBusiness: false,
    sacramentHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    speakers: [
      { name: 'Brother Cooper', topic: 'The covenant of baptism', type: 'speaker' },
      { name: 'Brother Nelson', topic: 'Following the prophet', type: 'speaker' }
    ],
    closingHymn: { number: 220, title: 'Lord, I Would Follow Thee' },
    closingPrayer: 'Brother Wilson'
  },
  {
    date: '2026-08-16',
    meetingType: 'regular',
    presiding: 'Brother Jones',
    conducting: 'Brother Cooper',
    announcements: [],
    openingHymn: { number: 27, title: 'Praise to the Man' },
    openingPrayer: 'Brother Lewis',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 173, title: 'While of These Emblems We Partake' },
    speakers: [
      { name: 'Sister Clark', topic: 'The importance of scripture study', type: 'speaker' },
      { name: 'Ward Choir', topic: 'How Great Thou Art', type: 'musical-number' },
      { name: 'Sister Ramirez', topic: 'Serving in the temple', type: 'speaker' }
    ],
    closingHymn: { number: 86, title: 'How Great Thou Art' },
    closingPrayer: 'Sister Walker'
  },
  {
    date: '2026-08-23',
    meetingType: 'stake',
    presiding: 'Stake President Young',
    conducting: 'President Kimball',
    announcements: [],
    openingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    openingPrayer: 'Sister Gardner',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'President Kimball', topic: 'Stake conference message', type: 'speaker' },
      { name: 'Stake Choir', topic: 'Redeemer of Israel', type: 'musical-number' },
      { name: 'Elder Thompson', topic: 'Strengthening families', type: 'speaker' }
    ],
    closingHymn: { number: 5, title: 'High on the Mountain Top' },
    closingPrayer: 'Elder Thompson'
  },
  {
    date: '2026-08-30',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: ['Ward temple night: September 5'],
    openingHymn: { number: 26, title: 'Joseph Smiths First Prayer' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Sunday School president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'In Remembrance of Thy Suffering' },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Brother Osei', topic: 'Covenant keeping', type: 'speaker' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis'
  },
  {
    date: '2026-09-06',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Sister Taylor',
    announcements: ['Relief Society activity: September 12'],
    openingHymn: { number: 142, title: 'Sweet Hour of Prayer' },
    openingPrayer: 'Brother Anderson',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [],
    closingHymn: { number: 100, title: 'Nearer, My God, to Thee' },
    closingPrayer: 'Sister Anderson'
  },
  {
    date: '2026-09-13',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: ['Ward temple night: September 19', 'Choir practice Thursday'],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Sister Harris',
    wardBusiness: [
      { description: 'Sustaining of new ward clerk' },
      { description: 'Releasing of the activities committee' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    speakers: [
      { name: 'Brother Cooper', topic: 'The covenant of baptism', type: 'speaker' },
      { name: 'Sister Ramirez', topic: 'Serving in the temple', type: 'speaker' },
      { name: 'Ward Choir', topic: 'I Know That My Redeemer Lives', type: 'musical-number' },
      { name: 'Brother Nelson', topic: 'Following the prophet', type: 'speaker' }
    ],
    closingHymn: { number: 220, title: 'Lord, I Would Follow Thee' },
    closingPrayer: 'Brother Wilson'
  },
  {
    date: '2026-09-20',
    meetingType: 'general',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: [],
    openingHymn: { number: 249, title: 'Called to Serve' },
    openingPrayer: 'Brother Lewis',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'Sister Clark', topic: 'General conference review', type: 'speaker' },
      { name: 'Ward Choir', topic: 'Called to Serve', type: 'musical-number' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Sister Walker'
  }
];

for (const m of meetings) {
  await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${m.date}, ${m.meetingType}, ${m.presiding}, ${m.conducting},
      ${m.announcements},
      ${JSON.stringify(m.openingHymn)}::jsonb, ${m.openingPrayer},
      ${JSON.stringify(m.wardBusiness)}::jsonb, ${m.stakeBusiness},
      ${JSON.stringify(m.sacramentHymn)}::jsonb,
      ${JSON.stringify(m.speakers)}::jsonb,
      ${JSON.stringify(m.closingHymn)}::jsonb, ${m.closingPrayer}
    )
  `;
}

const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM meetings`;
console.log(`Listo: ${count} registros en la tabla meetings.`);
