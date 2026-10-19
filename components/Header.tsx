import Link from 'next/link';
import { auth } from '@/auth';
import NavLinks from '@/components/NavLinks';
import { MobileNav } from '@/components/mobile-nav';
import { SignOutButton } from '@/components/sign-out-button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { LogInIcon } from '@/components/icons';
import { NotificationBell } from '@/components/notifications-bell';
import { isLeader } from '@/lib/auth-guards';
import { countPendingRequests } from '@/lib/users';
import type { Dictionary, Locale } from '@/lib/i18n';

// Encabezado global: nombre de la rama y estado de sesion.
// Fondo azul con degradado, texto blanco y sombra.
export default async function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const session = await auth();
  const user = session?.user;

  // Only the president sees the requests bell; its badge counts the pending
  // access requests waiting for approval.
  const isPresident = user?.role === 'president';
  const pendingCount = isPresident ? await countPendingRequests() : 0;

  return (
    <header className="bg-gradient-to-br from-[#1f4b88] to-[#163a66] text-white shadow-md">
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight sm:text-xl">
            {dict['brand.name']}
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            {isLeader(user?.role) ? <MobileNav /> : null}
            {isPresident ? (
              <NotificationBell
                locale={locale}
                count={pendingCount}
                label={dict['header.requests']}
              />
            ) : null}
            {!isPresident ? <LanguageSwitcher /> : null}
            {user ? (
              <div className="flex items-center gap-1">
                <span className="hidden text-xs text-white/70 md:inline">
                  {user.email}
                </span>
                <SignOutButton locale={locale} dict={dict} />
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                aria-label={dict['header.signIn']}
                title={dict['header.signIn']}
                className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
              >
                <LogInIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-3">
          {isLeader(user?.role) ? (
            <div className="hidden sm:block">
              <NavLinks isLeader />
            </div>
          ) : (
            <NavLinks isLeader={false} />
          )}
        </div>
      </div>
    </header>
  );
}
