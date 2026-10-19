import Link from 'next/link';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import type {
  Hymn as HymnType,
  SacramentMeeting,
  SpeakerItem,
} from '@/lib/types';
import { formatMeetingDate } from '@/lib/format';
import { deleteMeeting } from '@/lib/actions';
import { getHymnsByDate } from '@/lib/hymns-db';
import { getDictionary, type Dictionary, type Locale } from '@/lib/i18n';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
  locale: Locale;
}

// Sub-componente local: el par numero + titulo se repite en los himnos.
function Hymn({ hymn }: { hymn: HymnType }) {
  return (
    <>
      #{hymn.number} &mdash; {hymn.title}
    </>
  );
}

// Un discursante: nombre destacado y su tema del discurso.
function Speaker({ speaker }: { speaker: SpeakerItem }) {
  return (
    <>
      <span className="font-medium">{speaker.name}</span>
      {speaker.topic ? (
        <span className="text-muted"> &mdash; {speaker.topic}</span>
      ) : null}
    </>
  );
}

// Item de la agenda: el label va en naranja y en mayusculas (resalta la
// seccion), el contenido debajo.
function AgendaItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/60 py-2.5 last:border-0">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
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

  // Discursantes (type 'speaker') y números musicales, en su orden original.
  const speakers = meeting.speakers.filter((item) => item.type === 'speaker');
  const musicalNumbers = meeting.speakers.filter(
    (item) => item.type === 'musical-number',
  );

  const speakerOrdinals = [
    dict['agenda.firstSpeaker'],
    dict['agenda.secondSpeaker'],
    dict['agenda.thirdSpeaker'],
    dict['agenda.fourthSpeaker'],
    dict['agenda.fifthSpeaker'],
    dict['agenda.sixthSpeaker'],
  ];

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
          {/* Leader actions (hidden from the music director and the public). */}
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
                href={`/${locale}/meetings/hymns/${meeting.date}`}
                className="rounded-md bg-accent-warm px-3 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-warm"
              >
                {dict['hymns.editHymns']}
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <dl className="flex flex-col">
        <AgendaItem label={dict['detail.presiding']}>
          {meeting.presiding}
        </AgendaItem>
        <AgendaItem label={dict['detail.conducting']}>
          {meeting.conducting}
        </AgendaItem>
        <AgendaItem label={dict['detail.openingHymn']}>
          <Hymn hymn={openingHymn} />
        </AgendaItem>
        <AgendaItem label={dict['detail.openingPrayer']}>
          {meeting.openingPrayer}
        </AgendaItem>

        <AgendaItem label={dict['detail.wardBusiness']}>
          {meeting.wardBusiness.length > 0 ? (
            <ul className="list-disc pl-5 text-muted">
              {meeting.wardBusiness.map((item) => (
                <li key={item.description}>{item.description}</li>
              ))}
            </ul>
          ) : (
            dict['detail.none']
          )}
        </AgendaItem>

        <AgendaItem label={dict['detail.stakeBusiness']}>
          {meeting.stakeBusiness ? dict['detail.yes'] : dict['detail.no']}
        </AgendaItem>

        <AgendaItem label={dict['detail.sacramentHymn']}>
          <Hymn hymn={sacramentHymn} />
        </AgendaItem>

        {/* Fijo en la agenda: no hay dato que completar. */}
        <AgendaItem label={dict['detail.blessing']}>
          <span className="text-muted">&mdash;</span>
        </AgendaItem>

        {speakers[0] ? (
          <AgendaItem label={speakerOrdinals[0]}>
            <Speaker speaker={speakers[0]} />
          </AgendaItem>
        ) : null}

        {intermediateHymn ? (
          <AgendaItem label={dict['detail.intermediateHymn']}>
            <Hymn hymn={intermediateHymn} />
          </AgendaItem>
        ) : null}

        {speakers.slice(1).map((speaker, index) => (
          <AgendaItem
            key={`${speaker.name}-${index}`}
            label={
              speakerOrdinals[index + 1] ??
              `${dict['agenda.speaker']} ${index + 2}`
            }
          >
            <Speaker speaker={speaker} />
          </AgendaItem>
        ))}

        {musicalNumbers.map((item, index) => (
          <AgendaItem key={`musical-${index}`} label={dict['detail.musicalNumber']}>
            <span className="font-medium">{item.name}</span>
            {item.topic ? (
              <span className="text-muted"> &mdash; {item.topic}</span>
            ) : null}
          </AgendaItem>
        ))}

        <AgendaItem label={dict['detail.closingHymn']}>
          <Hymn hymn={closingHymn} />
        </AgendaItem>
        <AgendaItem label={dict['detail.closingPrayer']}>
          {meeting.closingPrayer}
        </AgendaItem>
      </dl>

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
