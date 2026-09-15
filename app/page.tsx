import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="mx-auto grid w-full max-w-4xl items-center gap-10 px-6 py-12 sm:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          Sacrament Meeting Planner
        </h1>
        <p className="max-w-prose text-base text-muted">
          Help bishoprics and branch leaders plan and review meeting agendas, and
          let members view and print the programs for the current and past
          weeks.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/meetings"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View meetings
          </Link>
          <Link
            href="/meetings/current"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            This Sunday&rsquo;s program
          </Link>
        </div>
      </div>

      {/* next/image en lugar de <img>: alt descriptivo, width y height
          explicitos para que el navegador reserve el espacio y no haya
          salto de layout al cargar. */}
      <Image
        src="/meetinghouse.svg"
        alt="Illustration of a meetinghouse"
        width={320}
        height={240}
        priority
        className="mx-auto h-auto w-56 sm:w-64"
      />
    </section>
  );
}
