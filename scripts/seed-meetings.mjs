// Seeds a few example meetings on the upcoming Sundays, each with speakers
// (name + topic) so the music director's view can show the "Temas del Domingo".
// Idempotent: ON CONFLICT (date) DO NOTHING keeps existing meetings.
//
// Run it with:  node --env-file=.env.local scripts/seed-meetings.mjs

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function toIso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getUpcomingSundays(count) {
  const result = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (cursor.getDay() !== 0) {
    cursor.setDate(cursor.getDate() + 1);
  }
  for (let i = 0; i < count; i++) {
    result.push(toIso(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }
  return result;
}

function isFirstSundayOfMonth(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCDay() === 0 && day >= 1 && day <= 7;
}

const sundays = getUpcomingSundays(4);

const speakerSets = [
  [
    { name: 'Hermano García', topic: 'La fe en Jesucristo', type: 'speaker' },
    { name: 'Hermana Pérez', topic: 'El arrepentimiento', type: 'speaker' },
  ],
  [
    { name: 'Hermano Torres', topic: 'El don del Espíritu Santo', type: 'speaker' },
    { name: 'Hermana Vega', topic: 'La oración', type: 'speaker' },
  ],
  [
    { name: 'Hermano Ríos', topic: 'Seguir al profeta', type: 'speaker' },
    { name: 'Coro de la Rama', topic: 'Cuán Grande Tú Eres', type: 'musical-number' },
  ],
  [
    { name: 'Hermana Castro', topic: 'El servicio', type: 'speaker' },
    { name: 'Hermano Medina', topic: 'Los convenios', type: 'speaker' },
  ],
];

for (let i = 0; i < sundays.length; i++) {
  const date = sundays[i];
  const speakers = speakerSets[i % speakerSets.length];
  const intermediate = isFirstSundayOfMonth(date)
    ? null
    : { number: 100, title: 'Nearer, My God, to Thee' };

  await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, intermediate_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${date}, 'regular', 'Presidente de Rama', 'Primer Consejero',
      ARRAY['Bienvenida a la reunión sacramental'],
      '{"number":2,"title":"The Spirit of God"}'::jsonb, 'Hermana López',
      '[]'::jsonb, false,
      '{"number":169,"title":"In Remembrance of Thy Suffering"}'::jsonb,
      ${intermediate ? JSON.stringify(intermediate) : null}::jsonb,
      ${JSON.stringify(speakers)}::jsonb,
      '{"number":31,"title":"O God, Our Help in Ages Past"}'::jsonb, 'Hermano Ruiz'
    )
    ON CONFLICT (date) DO NOTHING
  `;
}

const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM meetings`;
console.log(`Meetings seed listos. Total meetings: ${count}`);
console.log('Domingos:', sundays.join(', '));

process.exit(0);
