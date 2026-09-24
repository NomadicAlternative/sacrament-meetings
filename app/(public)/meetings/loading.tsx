// Skeleton placeholders that mirror the MeetingCard layout (rounded card with
// a title bar and a few text lines). Each one fades in on a staggered delay so
// they appear in a cascade while the real list loads.

const SKELETON_COUNT = 5;

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="py-8">
      <span className="sr-only">Loading meetings&hellip;</span>
      <ul className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <li
            key={index}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
              {/* Shimmer sweep travels across the card; keep it non-interactive
                  so it never blocks the (inert) skeleton content. */}
              <div className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

              <div className="flex items-center justify-between gap-3">
                <div className="h-4 w-1/3 rounded bg-border" />
                <div className="h-5 w-16 rounded-full bg-border" />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="h-3 w-full rounded bg-border" />
                <div className="h-3 w-5/6 rounded bg-border" />
                <div className="h-3 w-2/3 rounded bg-border" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
