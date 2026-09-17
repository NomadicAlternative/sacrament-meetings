'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// Reads and writes the `query` parameter in the URL.
//
// Why the URL and not useState: the URL is the state. That is what makes a
// search shareable, bookmarkable, and what makes the browser's back button
// behave. If the term lived in component state, none of those would work.
export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // 300ms after the user stops typing. Without this, every keystroke would be
  // a database query — typing "testimony" would be nine round trips instead of
  // one.
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    // A new search always starts at page 1. Without this, searching while on
    // page 3 shows an empty list, because there are no results on page 3.
    params.set('page', '1');

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // replace, not push: push would add a history entry per keystroke.
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="mb-6">
      <label htmlFor="meeting-search" className="sr-only">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        placeholder="Search by speaker, leader, or meeting type..."
        // defaultValue, not value: the URL is the source of truth, so the
        // input is seeded from it once and then left to the browser.
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(event) => handleSearch(event.target.value)}
        aria-label="Search meetings"
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
    </div>
  );
}
