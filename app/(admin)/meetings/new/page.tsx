import Link from 'next/link';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

// The form itself is a Client Component (MeetingForm) so it can use
// useActionState for validation errors and the pending state. This page stays
// a Server Component and just wires the action in.
export default function NewMeetingPage() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight">Create Meeting</h2>
      <MeetingForm action={createMeeting} />
      <Link
        href="/meetings"
        className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Back to meetings
      </Link>
    </div>
  );
}
