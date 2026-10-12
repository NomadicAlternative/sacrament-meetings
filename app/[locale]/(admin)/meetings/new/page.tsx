import Link from 'next/link';
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
