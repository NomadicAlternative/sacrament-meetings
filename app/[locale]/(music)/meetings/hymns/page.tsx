import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import { listHymns } from '@/lib/hymns-db';
import { getMeetingByDate } from '@/lib/meetings-db';
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
  // are looked up by date, and the meetings by date give the speaker topics.
  const sundays = getUpcomingSundays(12);
  const [hymns, meetings] = await Promise.all([
    listHymns(),
    Promise.all(sundays.map((date) => getMeetingByDate(date))),
  ]);
  const hymnsByDate = new Map(hymns.map((h) => [h.date, h]));

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">{dict['hymns.selectSunday']}</p>
      <ul className="grid gap-3">
        {sundays.map((date, index) => {
          const loaded = hymnsByDate.has(date);
          const meeting = meetings[index];
          const topics = (meeting?.speakers ?? [])
            .filter((item) => item.type === 'speaker' && item.topic)
            .map((item) => item.topic);

          return (
            <li key={date}>
              <Link
                href={`/${loc}/meetings/hymns/${date}`}
                className="block rounded-lg border border-border border-l-4 border-l-accent-warm/60 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-warm hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold tracking-tight">
                    {formatMeetingDate(date, loc)}
                  </span>
                  <span
                    className={
                      loaded
                        ? 'text-xs font-semibold text-green-600'
                        : 'text-xs text-muted'
                    }
                  >
                    {loaded ? '✓ ' : ''}
                    {loaded ? dict['hymns.editHymns'] : dict['hymns.loadHymns']}
                  </span>
                </div>
                {topics.length > 0 ? (
                  <div className="mt-1.5 text-xs text-muted">
                    <span className="font-semibold text-accent-warm">
                      {dict['hymns.topics']}:
                    </span>{' '}
                    {topics.map((topic) => `«${topic}»`).join(' · ')}
                  </div>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
