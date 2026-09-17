import Link from 'next/link';

// Placeholder so the route exists and is navigable. The form is implemented
// in Week 04, which is why this page has no functionality yet.
export default function NewMeetingPage() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl font-semibold tracking-tight">
        Create Meeting &mdash; Coming in Week 04
      </h2>
      <p className="mt-2 text-sm text-muted">
        This route is in place so the navigation works. The form that saves a new
        meeting is built next week.
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
