import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { formatShortDate } from '@/lib/format';
import { deleteMeeting } from '@/lib/actions';
import { getDictionary, type Dictionary, type Locale } from '@/lib/i18n';

interface MeetingCardProps {
  meeting: SacramentMeeting;
  locale: Locale;
  // Position in the list, used to stagger the entrance animation. Optional so
  // the card can still render standalone (e.g. without a list index).
  index?: number;
}

// Devuelve un <li> a proposito: esta pensado para vivir dentro de un <ul>,
// y asi el listado no tiene que envolver nada a mano.
export default function MeetingCard({
  meeting,
  locale,
  index,
}: MeetingCardProps) {
  const dict = getDictionary(locale);
  const speakerCount = meeting.speakers.filter(
    (item) => item.type === 'speaker',
  ).length;
  const typeLabel = dict[`type.${meeting.meetingType}` as keyof Dictionary];

  return (
    <li
      className="flex flex-col animate-fade-in-up"
      style={
        index !== undefined
          ? { animationDelay: `${Math.min(index, 4) * 40}ms` }
          : undefined
      }
    >
      <Link
        href={`/${locale}/meetings/${meeting.id}`}
        className="flex flex-1 flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight">
            {formatShortDate(meeting.date, locale)}
          </h2>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
            {typeLabel}
          </span>
        </div>

        <dl className="flex flex-col gap-1 text-sm text-muted">
          <div className="flex gap-2">
            <dt className="font-medium">{dict['card.presiding']}:</dt>
            <dd>{meeting.presiding}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">{dict['card.conducting']}:</dt>
            <dd>{meeting.conducting}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">{dict['card.speakers']}:</dt>
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
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          className="rounded-md border border-border px-3 py-1 text-sm font-medium text-muted transition-colors duration-150 hover:border-red-600 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {dict['card.delete']}
        </button>
      </form>
    </li>
  );
}
