import Link from 'next/link';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import type { Hymn as HymnType, SacramentMeeting } from '@/lib/types';
import { formatMeetingDate } from '@/lib/format';
import { deleteMeeting } from '@/lib/actions';
import { getHymnsByDate } from '@/lib/hymns-db';
import { getDictionary, type Dictionary, type Locale } from '@/lib/i18n';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
  locale: Locale;
}

// Sub-componente local: el par numero + titulo se repite en tres himnos.
function Hymn({ hymn }: { hymn: HymnType }) {
  return (
    <>
      #{hymn.number} &mdash; {hymn.title}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

export default async function MeetingDetail({
  meeting,
  locale,
}: MeetingDetailProps) {
  const session = await auth();
  const user = session?.user;
  const canManage = user?.status === 'approved' && isLeader(user.role);
  const isMusicDirector = user?.role === 'music_director';
  const dict = getDictionary(locale);
  const typeLabel = dict[`type.${meeting.meetingType}` as keyof Dictionary];

  // Hymns the music director set for this Sunday override the meeting's own
  // hymn fields (fall back to the meeting when none are set).
  const sundayHymns = await getHymnsByDate(meeting.date);
  const openingHymn = sundayHymns?.openingHymn ?? meeting.openingHymn;
  const sacramentHymn = sundayHymns?.sacramentHymn ?? meeting.sacramentHymn;
  const intermediateHymn =
    sundayHymns?.intermediateHymn ?? meeting.intermediateHymn;
  const closingHymn = sundayHymns?.closingHymn ?? meeting.closingHymn;

  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <header className="mb-6 border-b border-border pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {formatMeetingDate(meeting.date, locale)}
            </h2>
            <p className="mt-1 text-sm text-muted">{typeLabel}</p>
          </div>
          {/* Leader actions (hidden from the music director and the public).
              The delete form is a Server Action wired directly to a Server
              Component form, so it needs no 'use client'. */}
          <div className="flex items-center gap-2">
            {canManage ? (
              <>
                <Link
                  href={`/${locale}/meetings/${meeting.id}/edit`}
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {dict['detail.edit']}
                </Link>
                <form action={deleteMeeting}>
                  <input type="hidden" name="id" value={meeting.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <button
                    type="submit"
                    className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:border-red-600 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    {dict['detail.delete']}
                  </button>
                </form>
              </>
            ) : isMusicDirector ? (
              <Link
                href={`/${locale}/meetings/hymns/${meeting.id}`}
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {dict['hymns.editHymns']}
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <Field label={dict['detail.presiding']}>{meeting.presiding}</Field>
        <Field label={dict['detail.conducting']}>{meeting.conducting}</Field>
        <Field label={dict['detail.openingHymn']}>
          <Hymn hymn={openingHymn} />
        </Field>
        <Field label={dict['detail.openingPrayer']}>
          {meeting.openingPrayer}
        </Field>
        <Field label={dict['detail.sacramentHymn']}>
          <Hymn hymn={sacramentHymn} />
        </Field>
        {intermediateHymn ? (
          <Field label={dict['detail.intermediateHymn']}>
            <Hymn hymn={intermediateHymn} />
          </Field>
        ) : null}
        <Field label={dict['detail.stakeBusiness']}>
          {meeting.stakeBusiness ? dict['detail.yes'] : dict['detail.no']}
        </Field>
        <Field label={dict['detail.closingHymn']}>
          <Hymn hymn={closingHymn} />
        </Field>
        <Field label={dict['detail.closingPrayer']}>
          {meeting.closingPrayer}
        </Field>
      </dl>

      <section className="mt-6">
        <h3 className="text-sm font-semibold tracking-tight">
          {dict['detail.wardBusiness']}
        </h3>
        {meeting.wardBusiness.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {meeting.wardBusiness.map((item) => (
              <li key={item.description}>{item.description}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">{dict['detail.none']}</p>
        )}
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold tracking-tight">
          {dict['detail.speakersTitle']}
        </h3>
        {meeting.speakers.length > 0 ? (
          <ol className="mt-2 flex flex-col gap-2 text-sm">
            {meeting.speakers.map((item, index) => (
              <li key={`${item.type}-${index}`}>
                <span className="font-medium">{item.name}</span>
                {/* 'type' permite acotar la union: solo un 'speaker' tiene tema. */}
                {item.type === 'musical-number' ? (
                  <span className="text-muted">
                    {' '}
                    &mdash; {dict['detail.musicalNumber']}
                  </span>
                ) : (
                  <span className="text-muted"> &mdash; {item.topic}</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted">{dict['detail.noSpeakers']}</p>
        )}
      </section>

      {/* announcements es opcional: si el campo no existe, la seccion entera
          no se renderiza. Distinto de existir con lista vacia. */}
      {meeting.announcements ? (
        <section className="mt-6">
          <h3 className="text-sm font-semibold tracking-tight">
            {dict['detail.announcements']}
          </h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {meeting.announcements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
