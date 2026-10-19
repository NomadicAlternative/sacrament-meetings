'use client';

import { useActionState } from 'react';
import { changePassword, type ChangePasswordState } from '@/lib/actions';
import { useLocale } from '@/components/locale-provider';

// Form shown after a forced-change login. On submit it sets the user's own new
// password and clears the must-change flag, then redirects to /meetings.
export function ChangePasswordForm() {
  const { locale, t } = useLocale();
  const [state, formAction, isPending] = useActionState<
    ChangePasswordState,
    FormData
  >(changePassword, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          {t('changePassword.password')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={4}
          required
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 focus-visible:border-accent"
        />
        {state.errors?.password ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.errors.password.join(', ')}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors duration-150 hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? t('changePassword.saving') : t('changePassword.save')}
      </button>
      {state.message ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
