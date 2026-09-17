import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

// The list page reads its state from the URL. `searchParams` is a Promise in
// Next.js 15+, exactly like `params`, so it has to be awaited.
export default async function MeetingsPage({
  searchParams,
}: PageProps<'/meetings'>) {
  const params = await searchParams;
  const query = typeof params.query === 'string' ? params.query : '';
  const currentPage = Number(params.page) || 1;

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
          No meetings match &ldquo;{query}&rdquo;. Try a different name or
          meeting type.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </ul>
      )}

      <Pagination totalPages={totalPages} />

      <p className="mt-6 text-sm text-muted">
        <Link
          href="/meetings/new"
          className="underline-offset-4 hover:underline"
        >
          Create a meeting
        </Link>{' '}
        &mdash; the leader area.
      </p>
    </div>
  );
}
