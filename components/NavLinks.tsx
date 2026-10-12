'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/components/locale-provider';

// usePathname es un hook de Client Component: por eso este archivo empieza
// con 'use client'. El resto de la app sigue siendo Server Components.

type NavLink = {
  path: string;
  label: string;
  authOnly?: boolean;
};

// Un enlace esta activo si la ruta actual (sin el prefijo de idioma) es
// exactamente la suya. Para "Meetings" tambien cuenta el detalle
// (/meetings/3), pero NO /meetings/current, que tiene su propio enlace.
function isActive(localPath: string, path: string): boolean {
  if (path === '/') return localPath === '/';
  if (path === '/meetings') {
    return localPath === '/meetings' || /^\/meetings\/\d+$/.test(localPath);
  }
  return localPath === path;
}

// Recibe el estado de sesion desde el Header (Server Component). El enlace de
// creacion solo se muestra a quien inicio sesion; la ruta sigue protegida por
// el middleware aunque alguien ingrese la URL a mano.
export default function NavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { locale, t } = useLocale();
  const pathname = usePathname();

  // Quita el prefijo de idioma: /es/meetings -> /meetings.
  const localPath = pathname.replace(/^\/(es|pt)(?=\/|$)/, '') || '/';

  const links: NavLink[] = [
    { path: '/', label: t('nav.home') },
    { path: '/meetings', label: t('nav.meetings') },
    { path: '/meetings/current', label: t('nav.current') },
    { path: '/meetings/new', label: t('nav.create'), authOnly: true },
  ];

  const visibleLinks = links.filter((link) => !link.authOnly || isLoggedIn);

  return (
    <nav aria-label={t('nav.main')} className="-mx-1 px-1">
      <ul className="flex items-center gap-1 overflow-x-auto">
        {visibleLinks.map(({ path, label }) => {
          const active = isActive(localPath, path);
          return (
            <li key={path}>
              <Link
                href={`/${locale}${path === '/' ? '' : path}`}
                // aria-current le dice al lector de pantalla cual es la pagina
                // actual: el color solo no comunica nada a quien no lo ve.
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'block whitespace-nowrap rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors duration-150'
                    : 'block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground'
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
