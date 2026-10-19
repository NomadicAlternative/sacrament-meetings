'use client';

import { useActionState } from 'react';
import { requestAccess, type RequestAccessState } from '@/lib/actions';
import { useLocale } from '@/components/locale-provider';
import { REQUESTABLE_ROLES } from '@/lib/types';
import type { Dictionary } from '@/lib/i18n';

// Superposed modal shown to a first-time user. It explains who may register,
// asks for the role and submits a pending request to the president.
//
// `mode` controls whether a password field is shown: OAuth users already have
// an identity (Google/Microsoft) and don't need one; credentials users must
// pick a password so they can sign in later.
export function RequestAccessModal({
  mode,
  defaultEmail,
  defaultName,
  onClose,
}: {
  mode: 'oauth' | 'credentials';
  defaultEmail?: string;
  defaultName?: string;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const [state, formAction, isPending] = useActionState<
    RequestAccessState,
    FormData
  >(requestAccess, {});

  const inputClass =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 focus-visible:border-accent';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t('request.title')}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        {state.sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-6 w-6"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm text-muted">{t('request.sent')}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-150 hover:opacity-90"
            >
              {t('request.close')}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold tracking-tight">
              {t('request.title')}
            </h2>
            <p className="mt-2 text-sm text-muted">{t('request.subtitle')}</p>
            <p className="mt-1 text-sm text-muted">{t('request.explanation')}</p>

            <form action={formAction} className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ra-name" className="text-sm font-medium">
                  {t('request.name')}
                </label>
                <input
                  id="ra-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={defaultName}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ra-email" className="text-sm font-medium">
                  {t('request.email')}
                </label>
                <input
                  id="ra-email"
                  name="email"
                  type="email"
                  required
                  defaultValue={defaultEmail}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ra-role" className="text-sm font-medium">
                  {t('request.role')}
                </label>
                <select
                  id="ra-role"
                  name="role"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    {t('request.selectRole')}
                  </option>
                  {REQUESTABLE_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {t(`roles.${role}` as keyof Dictionary)}
                    </option>
                  ))}
                </select>
              </div>

              {mode === 'credentials' ? (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ra-password" className="text-sm font-medium">
                    {t('request.password')}
                  </label>
                  <input
                    id="ra-password"
                    name="password"
                    type="password"
                    minLength={4}
                    required
                    className={inputClass}
                  />
                  <p className="text-xs text-muted">{t('request.passwordHint')}</p>
                </div>
              ) : null}

              {state.errors?.role || state.errors?.email || state.errors?.name ? (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {t('request.selectRole')}
                </p>
              ) : null}

              <div className="mt-1 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-150 hover:opacity-90 disabled:opacity-60"
                >
                  {isPending ? t('request.sending') : t('request.submit')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm font-medium text-muted underline-offset-4 hover:underline"
                >
                  {t('request.close')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
