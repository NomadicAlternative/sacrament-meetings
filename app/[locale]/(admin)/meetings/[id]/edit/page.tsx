import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { getMeetingById } from '@/lib/meetings-db';
import { updateMeeting } from '@/lib/actions';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

// Server Component: loads the meeting, then hands the pre-filled form to the
// client. `updateMeeting.bind(null, id, locale)` turns the
// (id, locale, state, formData) action into the (state, formData) shape
// useActionState expects.
export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  const meeting = await getMeetingById(Number(id));

  // notFound() returns never, so past this point `meeting` is non-null.
  if (!meeting) {
    notFound();
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight">
        {dict['edit.title']}
      </h2>
      <Link
        href={`/${loc}/meetings/${meeting.id}`}
        className="mt-1 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        {dict['edit.backToMeeting']}
      </Link>
      <MeetingForm
        action={updateMeeting.bind(null, meeting.id, loc)}
        defaultValues={meeting}
      />
    </div>
  );
}
