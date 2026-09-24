import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { MEETING_TYPE_LABELS, formatShortDate } from '@/lib/format';
import { deleteMeeting } from '@/lib/actions';

interface MeetingCardProps {
  meeting: SacramentMeeting;
  // Position in the list, used to stagger the entrance animation. Optional so
  // the card can still render standalone (e.g. without a list index).
  index?: number;
}

// Devuelve un <li> a proposito: esta pensado para vivir dentro de un <ul>,
// y asi el listado no tiene que envolver nada a mano.
export default function MeetingCard({ meeting, index }: MeetingCardProps) {
  const speakerCount = meeting.speakers.filter(
    (item) => item.type === 'speaker'
  ).length;

  return (
    <li
      className="flex flex-col animate-fade-in-up"
      style={index !== undefined ? { animationDelay: `${index * 60}ms` } : undefined}
    >
      <Link
        href={`/meetings/${meeting.id}`}
        className="flex flex-1 flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

      {/* The delete form lives outside the <Link> on purpose: nesting a <form>
          inside an anchor is invalid HTML and breaks the card's navigation.
          A Server Action can be wired to a Server Component form directly, so
          this needs no 'use client'. */}
      <form action={deleteMeeting} className="mt-2 flex justify-end">
        <input type="hidden" name="id" value={meeting.id} />
        <button
          type="submit"
          className="text-sm text-muted underline-offset-4 transition-colors hover:text-red-600 hover:underline"
        >
          Delete
        </button>
      </form>
    </li>
  );
}
