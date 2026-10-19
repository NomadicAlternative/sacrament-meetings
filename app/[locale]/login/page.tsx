import type { Metadata } from 'next';
import { LoginForm } from '@/components/login-form';
import { getDictionary, isLocale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'es');
  return {
    title: dict['login.title'],
    description: dict['login.subtitle'],
  };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'es');
  const raw = await searchParams;

  // The OAuth signIn callback bounces pending/rejected/unknown emails back to
  // /login with a flag, so the client can show the right state or the request
  // modal without another round trip.
  const statusParam = typeof raw.status === 'string' ? raw.status : undefined;
  const initialStatus =
    statusParam === 'pending' || statusParam === 'rejected'
      ? statusParam
      : undefined;

  const initialRequest =
    raw.request === '1'
      ? {
          email: typeof raw.email === 'string' ? raw.email : undefined,
          name: typeof raw.name === 'string' ? raw.name : undefined,
        }
      : undefined;

  // OAuth buttons are shown only when the provider is configured server-side.
  const oauth = {
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    microsoft: Boolean(
      process.env.AUTH_MICROSOFT_ENTRA_ID && process.env.AUTH_MICROSOFT_ENTRA_SECRET,
    ),
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        {dict['login.title']}
      </h1>
      <p className="mt-1 text-sm text-muted">{dict['login.subtitle']}</p>
      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <LoginForm
          oauth={oauth}
          initialStatus={initialStatus}
          initialRequest={initialRequest}
        />
      </div>
    </div>
  );
}
