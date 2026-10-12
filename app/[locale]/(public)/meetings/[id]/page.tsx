import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/api';
import { getMeetingById } from '@/lib/meetings-db';
import { formatMeetingDate } from '@/lib/format';
import {
  getDictionary,
  isLocale,
  type Dictionary,
  type Locale,
} from '@/lib/i18n';
import type { SacramentMeeting } from '@/lib/types';

// Genera el <title> y la meta description a partir del meeting real, para que
// cada programa tenga metadatos utiles en buscadores y al compartir.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return { title: dict['notFound.title'] };
  }

  const meeting = await getMeetingById(numericId);
  if (!meeting) {
    return { title: dict['notFound.title'] };
  }

  const typeLabel = dict[`type.${meeting.meetingType}` as keyof Dictionary];
  const date = formatMeetingDate(meeting.date, loc);

  return {
    title: `${typeLabel} — ${meeting.date}`,
    description: `${typeLabel}: ${date}. ${dict['detail.presiding']}: ${meeting.presiding}.`,
  };
}

// En Next.js 16 los params de una ruta dinamica son una Promise:
// hay que hacer await (o usar React.use) antes de leerlos.
export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';

  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings/${id}`, {
    cache: 'no-store',
  });

  // El route handler responde 400 si el id no es numerico y 404 si no existe.
  // En ambos casos, para el usuario esto es una pagina que no existe.
  if (!response.ok) {
    notFound();
  }

  const meeting = (await response.json()) as SacramentMeeting;

  return <MeetingDetail meeting={meeting} locale={loc} />;
}
