import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/auth';
import { isLeader } from '@/lib/auth-guards';
import { InstallBadges } from '@/components/install-badges';
import { getDictionary, isLocale, type Locale } from '@/lib/i18n';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'es';
  const dict = getDictionary(loc);

  // Public visitors see "Reuniones Dominicales"; an approved editor sees the
  // planner title instead.
  const session = await auth();
  const isEditor = session?.user?.status === 'approved';
  const homeTitle = isEditor ? dict['home.titleEditor'] : dict['home.title'];
  const isLeaderRole = isEditor && isLeader(session?.user?.role);
  const isMusicDirector = session?.user?.role === 'music_director';

  const primaryButton =
    'inline-flex h-11 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-md transition duration-150 ease-out hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
  const secondaryButton =
    'inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-medium transition duration-150 ease-out hover:border-accent hover:text-accent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  return (
    <div className="mx-auto w-full max-w-4xl">
      <section className="grid w-full items-center gap-10 bg-gradient-to-br from-accent/10 to-background px-6 py-12 sm:grid-cols-[1fr_auto] sm:gap-14 sm:py-16">
        <div className="flex flex-col gap-5 text-center sm:text-left">
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {homeTitle}
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-muted">
            {dict['home.subtitle']}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={`/${loc}/meetings`} className={primaryButton}>
              {dict['home.viewMeetings']}
            </Link>
            <Link href={`/${loc}/meetings/current`} className={secondaryButton}>
              {dict['home.thisSunday']}
            </Link>
            {isLeaderRole ? (
              <Link href={`/${loc}/meetings/new`} className={secondaryButton}>
                {dict['home.createMeeting']}
              </Link>
            ) : isMusicDirector ? (
              <Link href={`/${loc}/meetings/hymns`} className={secondaryButton}>
                {dict['hymns.editHymns']}
              </Link>
            ) : null}
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
          className="mx-auto h-auto w-40 rounded-2xl shadow-lg ring-1 ring-black/5 sm:w-52"
        />
      </section>

      <section className="flex flex-col items-center gap-5 border-t border-border px-6 py-12 sm:py-16">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {dict['install.title']}
        </h2>
        <InstallBadges />
      </section>
    </div>
  );
}
