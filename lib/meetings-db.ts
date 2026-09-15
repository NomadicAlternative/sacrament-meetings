import type { SacramentMeeting } from './types';

// Datos temporales en memoria. En la W04 este modulo se reemplaza
// por consultas reales a la base de datos, pero la firma de las
// funciones de consulta se mantiene igual.
const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-08-30',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Primary president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'In Remembrance of Thy Suffering' },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Youth Choir', topic: '', type: 'musical-number' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis',
    announcements: ['Ward temple night: September 5']
  },
  {
    id: 2,
    date: '2026-09-06',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Sister Taylor',
    openingHymn: { number: 142, title: 'Sweet Hour of Prayer' },
    openingPrayer: 'Brother Anderson',
    wardBusiness: [{ description: 'Released: Primary music leader' }],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    // Reunion de testimonio: sin oradores asignados. Un array vacio es un
    // dato valido, distinto de "el campo no existe".
    speakers: [],
    closingHymn: { number: 100, title: 'Nearer, My God, to Thee' },
    closingPrayer: 'Sister Anderson',
    announcements: ['Fast Sunday next week', 'Ward choir practice Thursday']
  },
  {
    id: 3,
    date: '2026-09-13',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
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
      { name: 'Ward Choir', topic: '', type: 'musical-number' },
      { name: 'Brother Nelson', topic: 'Following the prophet', type: 'speaker' }
    ],
    closingHymn: { number: 220, title: 'Lord, I Would Follow Thee' },
    closingPrayer: 'Brother Wilson',
    announcements: [
      'Ward temple night: September 19',
      'Relief Society activity: September 24'
    ]
  },
  {
    id: 4,
    date: '2026-09-20',
    meetingType: 'stake',
    presiding: 'Stake President Young',
    conducting: 'President Kimball',
    openingHymn: { number: 27, title: 'Praise to the Man' },
    openingPrayer: 'Sister Gardner',
    wardBusiness: [],
    stakeBusiness: true,
    // Reunion de estaca: no hay sacramento. El tipo exige sacramentHymn igual,
    // asi que queda un valor que el dominio no justifica.
    sacramentHymn: { number: 169, title: 'In Remembrance of Thy Suffering' },
    speakers: [
      { name: 'President Kimball', topic: 'Stake conference message', type: 'speaker' },
      { name: 'Sister Gardner', topic: 'Strengthening families', type: 'speaker' },
      { name: 'Stake Choir', topic: '', type: 'musical-number' }
    ],
    closingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    closingPrayer: 'Elder Thompson'
    // Sin announcements: el campo se omite por completo.
  },
  {
    id: 5,
    date: '2026-09-27',
    meetingType: 'general',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 249, title: 'Called to Serve' },
    openingPrayer: 'Brother Lewis',
    wardBusiness: [],
    stakeBusiness: false,
    // Reunion general: tampoco hay sacramento, mismo caso que la de estaca.
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'Sister Clark', topic: 'General conference review', type: 'speaker' },
      { name: 'Ward Choir', topic: '', type: 'musical-number' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Sister Walker',
    announcements: ['Bishops storehouse donation drive ends September 30']
  }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter(m => m.date === date);
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find(m => m.id === id) ?? null;
}
