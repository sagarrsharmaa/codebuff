'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/primitives/GlassCard';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSignedUp = searchParams.get('signedup') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GlassCard className="w-full max-w-md mx-auto p-8 md:p-10" hover={false} glow="purple">
      {justSignedUp && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 mb-6 p-3.5 rounded-lg bg-accent-mint/10 border border-accent-mint/20 text-sm"
        >
          <CheckCircle className="w-4 h-4 text-accent-mint shrink-0" />
          <span className="text-accent-mint font-medium">
            Account created! Sign in below.
          </span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm"
        >
          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block font-body text-sm font-medium text-text-secondary mb-1.5">
            Email address
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="you@company.com"
              className={cn(
                'w-full glass rounded-lg px-4 py-3 font-body text-sm text-text-primary',
                'placeholder:text-text-muted/60 outline-none transition-colors duration-200',
                fieldErrors.email
                  ? 'border-red-500/50 focus:border-red-500/70 focus:bg-red-500/5'
                  : 'focus:border-accent-purple/50 focus:bg-accent-purple/5'
              )}
              autoComplete="email"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="block font-body text-sm font-medium text-text-secondary mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Enter your password"
              className={cn(
                'w-full glass rounded-lg px-4 py-3 pr-11 font-body text-sm text-text-primary',
                'placeholder:text-text-muted/60 outline-none transition-colors duration-200',
                fieldErrors.password
                  ? 'border-red-500/50 focus:border-red-500/70 focus:bg-red-500/5'
                  : 'focus:border-accent-purple/50 focus:bg-accent-purple/5'
              )}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {fieldErrors.password && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.password}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <MagneticButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </MagneticButton>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 font-body text-xs text-text-muted bg-background-card rounded-full">
            or continue with
          </span>
        </div>
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        disabled={isLoading}
        className="w-full glass glass-hover rounded-full px-6 py-3 font-body text-sm font-medium text-text-primary flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </button>

      {/* Signup link */}
      <p className="mt-6 text-center font-body text-sm text-text-muted">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-accent-purple hover:text-accent-purple/80 transition-colors font-medium"
        >
          Create one
        </Link>
      </p>
    </GlassCard>
  );
}
