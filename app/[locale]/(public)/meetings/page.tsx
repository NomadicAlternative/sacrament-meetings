import type { Metadata } from 'next';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import { getDictionary, isLocale, makeT, type Locale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'es');
  return {
    title: dict['meetings.title'],
    description: dict['meetings.subtitle'],
  };
}

// The list page reads its state from the URL. `searchParams` is a Promise in
// Next.js 15+, exactly like `params`, so it has to be awaited.
export default async function MeetingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);
  const t = makeT(dict);

  const sp = await searchParams;
  const query = typeof sp.query === 'string' ? sp.query : '';
  const currentPage = Number(sp.page) || 1;

  // Both queries run at the same time. Awaiting them in sequence would double
  // the time the page takes to render for no reason.
  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <div>
      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="text-sm text-muted">
          {t('meetings.empty', { query })}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {meetings.map((meeting, index) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              locale={loc}
              index={index}
            />
          ))}
        </ul>
      )}

      <Pagination totalPages={totalPages} />

      <p className="mt-6 text-sm text-muted">
        <Link
          href={`/${loc}/meetings/new`}
          className="underline-offset-4 hover:underline"
        >
          {dict['meetings.createLink']}
        </Link>{' '}
        &mdash; {dict['meetings.leaderArea']}.
      </p>
    </div>
  );
}
