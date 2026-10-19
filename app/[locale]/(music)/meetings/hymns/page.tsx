import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import { listHymns } from '@/lib/hymns-db';
import { formatMeetingDate, getUpcomingSundays } from '@/lib/format';
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

  // Upcoming Sundays, regardless of whether a meeting exists yet. Saved hymns
  // are looked up by date so the list can show which Sundays already have them.
  const sundays = getUpcomingSundays(12);
  const hymns = await listHymns();
  const hymnsByDate = new Map(hymns.map((h) => [h.date, h]));

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">{dict['hymns.selectSunday']}</p>
      <ul className="grid gap-2">
        {sundays.map((date) => {
          const loaded = hymnsByDate.has(date);
          return (
            <li key={date}>
              <Link
                href={`/${loc}/meetings/hymns/${date}`}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                <span>{formatMeetingDate(date, loc)}</span>
                <span
                  className={
                    loaded ? 'text-xs font-semibold text-green-600' : 'text-xs text-muted'
                  }
                >
                  {loaded ? '✓ ' : ''}
                  {loaded ? dict['hymns.editHymns'] : dict['hymns.loadHymns']}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
