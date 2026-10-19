import { signOut } from '@/auth';
import { LogOutIcon } from '@/components/icons';
import type { Dictionary, Locale } from '@/lib/i18n';

// Sign-out control rendered only when a session exists (see Header). The
// inline Server Action keeps the logout logic on the server, which is the
// cleanest App Router pattern for Auth.js v5. It redirects back to the same
// locale so the user lands on the home page in their language.
export function SignOutButton({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: `/${locale}` });
      }}
    >
      <button
        type="submit"
        aria-label={dict['header.signOut']}
        title={dict['header.signOut']}
        className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        <LogOutIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
