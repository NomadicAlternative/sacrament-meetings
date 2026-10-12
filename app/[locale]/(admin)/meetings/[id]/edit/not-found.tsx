'use client';

import Link from 'next/link';
import { useLocale } from '@/components/locale-provider';

// Shown when /meetings/[id]/edit is opened for an id that does not exist.
// Rendered inside the (admin) layout, so it inherits the "Leader area" header.
export default function EditMeetingNotFound() {
  const { locale, t } = useLocale();

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl font-semibold tracking-tight">
        {t('notFound.title')}
      </h2>
      <p className="mt-2 text-sm text-muted">{t('notFound.subtitle')}</p>
      <Link
        href={`/${locale}/meetings`}
        className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        {t('error.backToMeetings')}
      </Link>
    </div>
  );
}
