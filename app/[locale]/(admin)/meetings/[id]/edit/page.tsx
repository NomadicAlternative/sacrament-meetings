import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import MeetingForm from '@/components/MeetingForm';
import { getMeetingById } from '@/lib/meetings-db';
import { getHymnsByDate } from '@/lib/hymns-db';
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

  // Only leaders may edit meetings; the music director is sent to hymns.
  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved') {
    redirect(`/${loc}/login`);
  }
  if (!isLeader(user.role)) {
    redirect(`/${loc}/meetings/hymns`);
  }

  const meeting = await getMeetingById(Number(id));

  // notFound() returns never, so past this point `meeting` is non-null.
  if (!meeting) {
    notFound();
  }

  // Pre-fill the hymn fields from the music director's sunday_hymns entry (if
  // any), so the leader sees the hymns already selected for that Sunday.
  const sundayHymns = await getHymnsByDate(meeting.date);
  const defaultValues = sundayHymns
    ? {
        ...meeting,
        openingHymn: sundayHymns.openingHymn,
        sacramentHymn: sundayHymns.sacramentHymn,
        intermediateHymn: sundayHymns.intermediateHymn ?? meeting.intermediateHymn,
        closingHymn: sundayHymns.closingHymn,
      }
    : meeting;

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
        defaultValues={defaultValues}
      />
    </div>
  );
}
