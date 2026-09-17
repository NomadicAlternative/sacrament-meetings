import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';

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
