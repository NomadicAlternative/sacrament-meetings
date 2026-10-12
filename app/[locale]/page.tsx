import Image from 'next/image';
import Link from 'next/link';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  return (
    <section className="mx-auto grid w-full max-w-4xl items-center gap-10 bg-gradient-to-br from-accent/10 to-background px-6 py-12 sm:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {dict['home.title']}
        </h1>
        <p className="max-w-prose text-base text-muted">
          {dict['home.subtitle']}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/${loc}/meetings`}
            className="rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground shadow-sm transition duration-150 ease-out hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {dict['home.viewMeetings']}
          </Link>
          <Link
            href={`/${loc}/meetings/current`}
            className="rounded-md border border-border px-4 py-2 text-center text-sm font-medium transition duration-150 ease-out hover:border-accent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {dict['home.thisSunday']}
          </Link>
          <Link
            href={`/${loc}/meetings/new`}
            className="rounded-md border border-border px-4 py-2 text-center text-sm font-medium transition duration-150 ease-out hover:border-accent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {dict['home.createMeeting']}
          </Link>
        </div>
      </div>

      {/* next/image en lugar de <img>: alt descriptivo, width y height
          explicitos para que el navegador reserve el espacio y no haya
          salto de layout al cargar. */}
      <Image
        src="/emblem.webp"
        alt={dict['home.emblemAlt']}
        width={640}
        height={640}
        priority
        className="mx-auto h-auto w-48 rounded-2xl shadow-md sm:w-56"
      />
    </section>
  );
}
