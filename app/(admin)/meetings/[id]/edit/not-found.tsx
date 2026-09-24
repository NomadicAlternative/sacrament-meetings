import Link from 'next/link';

// Shown when /meetings/[id]/edit is opened for an id that does not exist.
// Rendered inside the (admin) layout, so it inherits the "Leader area" header.
export default function EditMeetingNotFound() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl font-semibold tracking-tight">Meeting not found</h2>
      <p className="mt-2 text-sm text-muted">
        The meeting you are trying to edit does not exist. It may have been
        deleted.
      </p>
      <Link
        href="/meetings"
        className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Back to meetings
      </Link>
    </div>
  );
}
