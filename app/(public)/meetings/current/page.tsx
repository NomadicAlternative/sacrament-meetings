import { redirect } from 'next/navigation';
import { getBaseUrl } from '@/lib/api';
import { toIsoDate } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

// Redirige al programa del domingo mas reciente.
// Si no hay reunion cargada para esa fecha, cae a /meetings.
export default async function CurrentMeetingPage() {
  const today = new Date();
  // getDay(): domingo = 0, lunes = 1, ... sabado = 6.
  // Restamos ese numero de dias para retroceder hasta el domingo.
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const isoDate = toIsoDate(sunday);
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings?date=${isoDate}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    redirect('/meetings');
  }

  const matches = (await response.json()) as SacramentMeeting[];

  if (matches.length === 0) {
    redirect('/meetings');
  }

  redirect(`/meetings/${matches[0].id}`);
}
