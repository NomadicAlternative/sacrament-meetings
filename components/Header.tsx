import Link from 'next/link';
import { auth } from '@/auth';
import NavLinks from '@/components/NavLinks';
import { SignOutButton } from '@/components/sign-out-button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getLocaleTag } from '@/lib/format';
import type { Dictionary, Locale } from '@/lib/i18n';

// Encabezado global: nombre de la rama, fecha actual y estado de sesion.
// Fondo azul con degradado, texto blanco y sombra para separarlo del contenido.
//
// Es un Server Component a proposito: lee la sesion con auth() y calcula la
// fecha en el servidor. Si esta fecha se calculara en un Client Component, el
// HTML del servidor y el del navegador podrian no coincidir (desajuste de
// hidratacion: el server puede estar en otra zona horaria).
export default async function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const session = await auth();
  const user = session?.user;
  const today = new Date().toLocaleDateString(getLocaleTag(locale), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-gradient-to-br from-[#1f4b88] to-[#163a66] text-white shadow-md">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-semibold tracking-tight">
            {dict['brand.name']}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm text-white/70">{today}</p>
            <LanguageSwitcher />
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
                className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
              >
                {dict['header.signIn']}
              </Link>
            )}
          </div>
        </div>
        <NavLinks isLoggedIn={!!user} />
      </div>
    </header>
  );
}
