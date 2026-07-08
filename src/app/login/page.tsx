import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

function LoginContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-gutter md:px-gutter-lg bg-background-base">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(124,92,252,0.08), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-text-primary tracking-display">
            Codebuff
          </h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Welcome back
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
