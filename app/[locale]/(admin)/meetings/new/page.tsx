import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

// The form itself is a Client Component (MeetingForm) so it can use
// useActionState for validation errors and the pending state. This page stays
// a Server Component and just wires the action in (bound to the locale).
export default async function NewMeetingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  // Only leaders may create meetings; the music director is sent to hymns.
  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved') {
    redirect(`/${loc}/login`);
  }
  if (!isLeader(user.role)) {
    redirect(`/${loc}/meetings/hymns`);
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight">
        {dict['create.title']}
      </h2>
      <MeetingForm action={createMeeting.bind(null, loc)} />
      <Link
        href={`/${loc}/meetings`}
        className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        {dict['error.backToMeetings']}
      </Link>
    </div>
  );
}
