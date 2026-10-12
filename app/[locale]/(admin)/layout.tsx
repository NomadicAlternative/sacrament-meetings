import { getDictionary, isLocale } from '@/lib/i18n';

// Leader-facing section. Kept separate from the member-facing routes so that
// its layout and loading states stay scoped to this section.
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'es');

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {dict['admin.title']}
        </h1>
        <p className="text-sm text-muted">{dict['admin.subtitle']}</p>
      </div>
      {children}
    </section>
  );
}
