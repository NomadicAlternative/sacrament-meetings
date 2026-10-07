import type { Metadata } from 'next';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in for bishopric access to manage the sacrament meeting schedule.',
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
      <p className="mt-1 text-sm text-muted">
        Bishopric access for managing the sacrament meeting schedule.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
