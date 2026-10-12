'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';

interface PaginationProps {
  totalPages: number;
}

// Pagination state also lives in the URL, which is why this is a Client
// Component: it needs to read the current page and build links that preserve
// whatever search term is active.
export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { t } = useLocale();

  // Copies the existing parameters and only changes `page`, so the search term
  // survives the change. Building the URL from scratch would silently drop it.
  function createPageURL(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={t('pagination.label')}
      className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('pagination.previous')}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      <p className="text-sm text-muted" aria-live="polite">
        {t('pagination.page', { current: currentPage, total: totalPages })}
      </p>

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('pagination.next')}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
