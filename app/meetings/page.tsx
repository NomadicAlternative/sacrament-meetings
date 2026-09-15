import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';

// cache: 'no-store' => esta pagina se renderiza en cada peticion, no una sola
// vez durante el build. Sin esto, Next intentaria prerenderizarla y el fetch
// al propio servidor fallaria porque no hay servidor durante el build.
export default async function MeetingsPage() {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to load meetings: ${response.status}`);
  }

  // El contrato del tipo es el mismo que usa el route handler (lib/types.ts),
  // por eso la asercion es segura.
  const meetings = (await response.json()) as SacramentMeeting[];

  // El mas reciente primero.
  const sorted = [...meetings].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted">
        No meetings have been scheduled yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {sorted.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </ul>
  );
}
