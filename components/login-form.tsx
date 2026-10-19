'use client';

import { useActionState, useState } from 'react';
import { signIn } from 'next-auth/react';
import { authenticate, type LoginState } from '@/lib/actions';
import { useLocale } from '@/components/locale-provider';
import { RequestAccessModal } from '@/components/request-access-modal';

type ModalState = {
  mode: 'oauth' | 'credentials';
  email?: string;
  name?: string;
};

// Client form driven by the authenticate Server Action through useActionState.
// The OAuth buttons call next-auth/react's signIn, which performs the redirect.
export function LoginForm({
  oauth,
  initialStatus,
  initialRequest,
}: {
  oauth: { google: boolean; microsoft: boolean };
  initialStatus?: 'pending' | 'rejected';
  initialRequest?: { email?: string; name?: string };
}) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    authenticate,
    {},
  );
  const { locale, t } = useLocale();

  // The modal opens from three sources: the visible "request access" button,
  // a credentials attempt against an unknown email, or the OAuth bounce. The
  // dismiss key keeps the auto-opened modal closed after the user closes it.
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const credentialsEmail =
    state?.status === 'not_registered' ? state.email : undefined;

  const autoModalKey = credentialsEmail
    ? `credentials:${credentialsEmail}`
    : initialRequest
      ? `oauth:${initialRequest.email ?? initialRequest.name ?? 'request'}`
      : null;

  const autoModal: ModalState | null =
    autoModalKey && autoModalKey !== dismissedKey
      ? credentialsEmail
        ? { mode: 'credentials', email: credentialsEmail }
        : { mode: 'oauth', ...initialRequest }
      : null;

  const modal: ModalState | null = requestOpen
    ? { mode: 'credentials' }
    : autoModal;

  const oauthButton =
    'flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors duration-150 hover:border-accent hover:text-accent';

  return (
    <div className="flex flex-col gap-4">
      {initialStatus === 'pending' ? (
        <p role="status" className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          {t('login.statusPending')}
        </p>
      ) : null}
      {initialStatus === 'rejected' ? (
        <p role="status" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {t('login.statusRejected')}
        </p>
      ) : null}

      {oauth.google || oauth.microsoft ? (
        <div className="flex flex-col gap-2">
          {oauth.google ? (
            <button
              type="button"
              onClick={() =>
                signIn('google', { callbackUrl: `/${locale}` })
              }
              className={oauthButton}
            >
              {t('login.google')}
            </button>
          ) : null}
          {oauth.microsoft ? (
            <button
              type="button"
              onClick={() =>
                signIn('microsoft-entra-id', {
                  callbackUrl: `/${locale}`,
                })
              }
              className={oauthButton}
            >
              {t('login.microsoft')}
            </button>
          ) : null}
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-border" />
            {t('login.or')}
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      ) : null}

      <form action={formAction} className="flex flex-col gap-4">
        {/* After a successful sign-in, land on the localized meetings list. */}
        <input type="hidden" name="callbackUrl" value={`/${locale}`} />
        <input type="hidden" name="locale" value={locale} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            {t('login.email')}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="ejemplo@mail.com"
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
        {state?.error ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.error === 'credentials'
              ? t('login.credentialsError')
              : 'Something went wrong.'}
          </p>
        ) : null}
      </form>

      <button
        type="button"
        onClick={() => setRequestOpen(true)}
        className="w-fit text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        {t('login.requestAccess')}
      </button>

      {modal ? (
        <RequestAccessModal
          mode={modal.mode}
          defaultEmail={modal.email}
          defaultName={modal.name}
          onClose={() => {
            if (requestOpen) setRequestOpen(false);
            else setDismissedKey(autoModalKey);
          }}
        />
      ) : null}
    </div>
  );
}
