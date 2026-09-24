import Link from 'next/link';

// Layout anidado de la seccion /meetings. Todo lo que cuelga de esta ruta
// hereda este encabezado; el layout raiz sigue aportando Header y Footer.
//
// El <h1> vive aca, asi que las paginas de la seccion solo usan <h2> y <h3>:
// el orden de encabezados queda 1 -> 2 -> 3, sin saltos.
export default function MeetingsLayout({
  children
}: LayoutProps<'/meetings'>) {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sacrament Meetings
        </h1>
        <p className="text-sm text-muted">
          Browse past and upcoming Sundays, or open the program for the current
          week.
        </p>
        <Link
          href="/meetings/current"
          className="w-fit text-sm font-medium text-accent underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Jump to this Sunday
        </Link>
      </div>

      {children}
    </section>
  );
}
