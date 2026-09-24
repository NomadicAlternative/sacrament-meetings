'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// usePathname es un hook de Client Component: por eso este archivo empieza
// con 'use client'. El resto de la app sigue siendo Server Components.

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings' },
  { href: '/meetings/current', label: 'Current Sunday' },
  { href: '/meetings/new', label: 'Create meeting' }
] as const;

// Un enlace esta activo si la ruta actual es exactamente la suya. Para
// "Meetings" tambien cuenta el detalle (/meetings/3), pero NO /meetings/current,
// que tiene su propio enlace.
function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/meetings') {
    return pathname === '/meetings' || /^\/meetings\/\d+$/.test(pathname);
  }
  return pathname === href;
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="-mx-1 px-1">
      <ul className="flex items-center gap-1 overflow-x-auto">
        {LINKS.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
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
