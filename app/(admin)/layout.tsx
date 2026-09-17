// Leader-facing section. Kept separate from the member-facing routes so that
// authentication can be added here in Week 05 without touching the public
// pages, and so its layout and loading states stay scoped to this section.
//
// The props are typed by hand rather than with LayoutProps<...> because Next
// only generates a route literal for layouts that own a URL. A route group
// whose only route lives deeper — like this one, whose only page is
// /meetings/new — gets no literal, so `LayoutProps<'/(admin)'>` does not
// compile.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Leader area</h1>
        <p className="text-sm text-muted">
          Manage the sacrament meeting schedule. Sign-in is added in Week 05.
        </p>
      </div>
      {children}
    </section>
  );
}
