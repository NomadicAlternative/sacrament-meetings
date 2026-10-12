import Link from 'next/link';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

// Layout anidado de la seccion /meetings. Todo lo que cuelga de esta ruta
// hereda este encabezado; el layout raiz sigue aportando Header y Footer.
//
// El <h1> vive aca, asi que las paginas de la seccion solo usan <h2> y <h3>:
// el orden de encabezados queda 1 -> 2 -> 3, sin saltos.
export default async function MeetingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {dict['meetings.title']}
        </h1>
        <p className="text-sm text-muted">{dict['meetings.subtitle']}</p>
        <Link
          href={`/${loc}/meetings/current`}
          className="w-fit text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {dict['meetings.jumpThisSunday']}
        </Link>
      </div>

      {children}
    </section>
  );
}
