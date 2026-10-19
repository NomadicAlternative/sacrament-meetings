import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import { HymnForm } from '@/components/hymn-form';
import { getHymnsByDate } from '@/lib/hymns-db';
import { formatMeetingDate } from '@/lib/format';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

export default async function EditHymnsPage({
  params,
}: {
  params: Promise<{ date: string; locale: string }>;
}) {
  const { date, locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'approved') {
    redirect(`/${loc}/login`);
  }
  if (user.role !== 'music_director' && !isLeader(user.role)) {
    redirect(`/${loc}/meetings`);
  }

  const hymns = await getHymnsByDate(date);

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <Link
        href={`/${loc}/meetings/hymns`}
        className="inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        {dict['hymns.back']}
      </Link>
      <h2 className="mt-2 text-xl font-semibold tracking-tight">
        {formatMeetingDate(date, loc)}
      </h2>
      <HymnForm date={date} hymns={hymns} />
    </div>
  );
}
