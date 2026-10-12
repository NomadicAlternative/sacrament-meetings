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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'es');

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        {dict['login.title']}
      </h1>
      <p className="mt-1 text-sm text-muted">{dict['login.subtitle']}</p>
      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
