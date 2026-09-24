import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { getMeetingById } from '@/lib/meetings-db';
import { updateMeeting } from '@/lib/actions';

// Server Component: loads the meeting, then hands the pre-filled form to the
// client. `updateMeeting.bind(null, id)` turns the (id, state, formData)
// action into the (state, formData) shape useActionState expects.
export default async function EditMeetingPage({
  params
}: PageProps<'/meetings/[id]/edit'>) {
  const { id } = await params;
  const meeting = await getMeetingById(Number(id));

  // notFound() returns never, so past this point `meeting` is non-null.
  if (!meeting) {
    notFound();
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight">Edit Meeting</h2>
      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-1 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Back to meeting
      </Link>
      <MeetingForm action={updateMeeting.bind(null, meeting.id)} defaultValues={meeting} />
    </div>
  );
}
