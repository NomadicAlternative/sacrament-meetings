export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 z-20 mt-auto border-t border-border bg-card">
      <div className="mx-auto w-full max-w-4xl px-6 py-5 text-sm text-muted">
        <p>&copy; {year} | Developed by Nomadic Alternative</p>
      </div>
    </footer>
  );
}
