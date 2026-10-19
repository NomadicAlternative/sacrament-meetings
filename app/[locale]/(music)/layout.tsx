import { getDictionary, isLocale } from '@/lib/i18n';

// Music section: kept in its own route group so the music director (hymns
// only) does not inherit the "Área de líderes" heading from the admin layout.
export default async function MusicLayout({
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
          {dict['hymns.title']}
        </h1>
        <p className="text-sm text-muted">{dict['hymns.subtitle']}</p>
      </div>
      {children}
    </section>
  );
}
