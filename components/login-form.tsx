'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { useLocale } from '@/components/locale-provider';

// Client form driven by the authenticate Server Action through useActionState.
// The inputs are intentionally left as plain defaults: Auth.js reads the
// submitted FormData by the field names "email" and "password".
export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const { locale, t } = useLocale();

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* After a successful sign-in, land on the localized meetings list. */}
      <input type="hidden" name="callbackUrl" value={`/${locale}/meetings`} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          {t('login.email')}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="dagc40@gmail.com"
          required
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 focus-visible:border-accent"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          {t('login.password')}
        </label>
        <input
          id="password"
          type="password"
          name="password"
          minLength={4}
          required
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 focus-visible:border-accent"
        />
      </div>
      <button
        type="submit"
        aria-disabled={isPending}
        disabled={isPending}
        className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors duration-150 hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? t('login.signingIn') : t('login.signIn')}
      </button>
      {errorMessage && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
