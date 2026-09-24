'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Error boundaries must be Client Components. This one wraps the /meetings
// segment; when a page inside it throws at runtime, this fallback renders and
// `reset` re-runs the failed render.
export default function MeetingsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Surface the error for debugging; in production the forwarded error is
  // sanitized by Next.js so no sensitive details leak to the client.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl font-semibold tracking-tight">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-muted">
        The meetings list could not be loaded. Please try again.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Back to meetings
        </Link>
      </div>
    </div>
  );
}
