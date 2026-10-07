import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/api';
import { getMeetingById } from '@/lib/meetings-db';
import { formatMeetingDate, MEETING_TYPE_LABELS } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

// Genera el <title> y la meta description a partir del meeting real, para que
// cada programa tenga metadatos utiles en buscadores y al compartir.
export async function generateMetadata({
  params
}: PageProps<'/meetings/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) {
    return { title: 'Meeting Not Found' };
  }

  const meeting = await getMeetingById(numericId);
  if (!meeting) {
    return { title: 'Meeting Not Found' };
  }

  const label = MEETING_TYPE_LABELS[meeting.meetingType];
  const date = formatMeetingDate(meeting.date);

  return {
    title: `${label} Meeting — ${meeting.date}`,
    description: `${label} sacrament meeting on ${date}, presided by ${meeting.presiding}.`,
  };
}

// En Next.js 16 los params de una ruta dinamica son una Promise:
// hay que hacer await (o usar React.use) antes de leerlos.
export default async function MeetingPage({
  params
}: PageProps<'/meetings/[id]'>) {
  const { id } = await params;
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings/${id}`, {
    cache: 'no-store'
  });

  // El route handler responde 400 si el id no es numerico y 404 si no existe.
  // En ambos casos, para el usuario esto es una pagina que no existe.
  if (!response.ok) {
    notFound();
  }

  const meeting = (await response.json()) as SacramentMeeting;

  return <MeetingDetail meeting={meeting} />;
}
