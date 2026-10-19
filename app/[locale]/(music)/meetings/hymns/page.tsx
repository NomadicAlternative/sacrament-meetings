import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import { getMeetings } from '@/lib/meetings-db';
import { formatMeetingDate } from '@/lib/format';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

export default async function HymnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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

  const meetings = await getMeetings('', 1);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">{dict['hymns.selectSunday']}</p>
      <ul className="grid gap-2">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <Link
              href={`/${loc}/meetings/hymns/${meeting.id}`}
              className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              {formatMeetingDate(meeting.date, loc)}
              <span className="text-xs text-muted">{dict['hymns.editHymns']}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
