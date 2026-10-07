import { signOut } from '@/auth';

// Sign-out control rendered only when a session exists (see Header). The
// inline Server Action keeps the logout logic on the server, which is the
// cleanest App Router pattern for Auth.js v5.
export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button
        type="submit"
        className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground"
      >
        Sign Out
      </button>
    </form>
  );
}
