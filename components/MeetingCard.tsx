import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { MEETING_TYPE_LABELS, formatShortDate } from '@/lib/format';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

// Devuelve un <li> a proposito: esta pensado para vivir dentro de un <ul>,
// y asi el listado no tiene que envolver nada a mano.
export default function MeetingCard({ meeting }: MeetingCardProps) {
  const speakerCount = meeting.speakers.filter(
    (item) => item.type === 'speaker'
  ).length;

  return (
    <li>
      <Link
        href={`/meetings/${meeting.id}`}
        className="flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight">
            {formatShortDate(meeting.date)}
          </h2>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
            {MEETING_TYPE_LABELS[meeting.meetingType]}
          </span>
        </div>

        <dl className="flex flex-col gap-1 text-sm text-muted">
          <div className="flex gap-2">
            <dt className="font-medium">Presiding:</dt>
            <dd>{meeting.presiding}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">Conducting:</dt>
            <dd>{meeting.conducting}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">Speakers:</dt>
            <dd>{speakerCount}</dd>
          </div>
        </dl>
      </Link>
    </li>
  );
}
