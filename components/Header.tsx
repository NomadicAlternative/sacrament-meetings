import NavLinks from '@/components/NavLinks';

// Encabezado global: nombre del barrio y fecha actual.
//
// Es un Server Component a proposito. Si esta fecha se calculara en un Client
// Component, el HTML del servidor y el del navegador podrian no coincidir
// (desajuste de hidratacion: el server puede estar en otra zona horaria).
export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-6 py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-lg font-semibold tracking-tight">Maplewood Ward</p>
          <p className="text-sm text-muted">{today}</p>
        </div>
        <NavLinks />
      </div>
    </header>
  );
}
