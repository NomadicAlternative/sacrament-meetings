import type { Hymn as HymnType, SacramentMeeting } from '@/lib/types';
import { MEETING_TYPE_LABELS, formatMeetingDate } from '@/lib/format';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

// Sub-componente local: el par numero + titulo se repite en tres himnos.
function Hymn({ hymn }: { hymn: HymnType }) {
  return (
    <>
      #{hymn.number} &mdash; {hymn.title}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-6">
      <header className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-semibold tracking-tight">
          {formatMeetingDate(meeting.date)}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {MEETING_TYPE_LABELS[meeting.meetingType]} meeting
        </p>
      </header>

      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <Field label="Presiding">{meeting.presiding}</Field>
        <Field label="Conducting">{meeting.conducting}</Field>
        <Field label="Opening hymn">
          <Hymn hymn={meeting.openingHymn} />
        </Field>
        <Field label="Opening prayer">{meeting.openingPrayer}</Field>
        <Field label="Sacrament hymn">
          <Hymn hymn={meeting.sacramentHymn} />
        </Field>
        <Field label="Stake business">
          {meeting.stakeBusiness ? 'Yes' : 'No'}
        </Field>
        <Field label="Closing hymn">
          <Hymn hymn={meeting.closingHymn} />
        </Field>
        <Field label="Closing prayer">{meeting.closingPrayer}</Field>
      </dl>

      <section className="mt-6">
        <h3 className="text-sm font-semibold tracking-tight">Ward business</h3>
        {meeting.wardBusiness.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {meeting.wardBusiness.map((item) => (
              <li key={item.description}>{item.description}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">None</p>
        )}
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold tracking-tight">
          Speakers and musical numbers
        </h3>
        {meeting.speakers.length > 0 ? (
          <ol className="mt-2 flex flex-col gap-2 text-sm">
            {meeting.speakers.map((item, index) => (
              <li key={`${item.type}-${index}`}>
                <span className="font-medium">{item.name}</span>
                {/* 'type' permite acotar la union: solo un 'speaker' tiene tema. */}
                {item.type === 'musical-number' ? (
                  <span className="text-muted"> &mdash; musical number</span>
                ) : (
                  <span className="text-muted"> &mdash; {item.topic}</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted">No speakers assigned.</p>
        )}
      </section>

      {/* announcements es opcional: si el campo no existe, la seccion entera
          no se renderiza. Distinto de existir con lista vacia. */}
      {meeting.announcements ? (
        <section className="mt-6">
          <h3 className="text-sm font-semibold tracking-tight">Announcements</h3>
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
