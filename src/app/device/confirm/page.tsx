'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Terminal, ArrowRight, AlertCircle } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { GlassCard } from '@/components/primitives/GlassCard';
import { MagneticButton } from '@/components/primitives/MagneticButton';

export default function DeviceConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [isConfirming, setIsConfirming] = useState(false);

  // Read codes from URL
  useEffect(() => {
    const dc = searchParams.get('device_code');
    const uc = searchParams.get('user_code');
    if (dc) setDeviceCode(dc);
    if (uc) setUserCode(uc);
  }, [searchParams]);

  const handleApprove = useCallback(async () => {
    if (!deviceCode || !session?.user?.id) return;

    setIsConfirming(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/device/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_code: deviceCode,
          action: 'approve',
          userId: session.user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setConfirmed('approved');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  }, [deviceCode, session]);

  const handleDeny = useCallback(async () => {
    if (!deviceCode || !session?.user?.id) return;

    setIsConfirming(true);
    setError(null);

    try {
      await fetch('/api/auth/device/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_code: deviceCode,
          action: 'deny',
          userId: session.user.id,
        }),
      });
      setConfirmed('denied');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  }, [deviceCode, session]);

  // Not signed in — show login prompt
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background-base">
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(124,92,252,0.08), transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-accent-purple/20 flex items-center justify-center mx-auto mb-6">
            <Terminal className="w-7 h-7 text-accent-purple" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
            CLI Authorization
          </h1>
          <p className="font-body text-sm text-text-muted mb-6">
            Sign in to authorize this CLI session.
          </p>

          {userCode && (
            <div className="mb-6 p-4 rounded-lg bg-background-card border border-border-subtle">
              <p className="font-body text-xs text-text-muted mb-2">Your code</p>
              <p className="font-display text-2xl font-bold text-accent-mint tracking-widest">
                {userCode}
              </p>
            </div>
          )}

          <button
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            className="w-full glass glass-hover rounded-full px-6 py-3 font-body text-sm font-medium text-text-primary flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 font-body text-xs text-text-muted bg-background-card rounded-full">or</span>
            </div>
          </div>

          <a
            href={`/login?redirect=${encodeURIComponent(window.location.href)}`}
            className="block w-full glass glass-hover rounded-full px-6 py-3 font-body text-sm font-medium text-text-primary transition-all duration-200 text-center"
          >
            Sign in with email
          </a>
        </div>
      </div>
    );
  }

  // Loading auth state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-base">
        <Loader2 className="w-6 h-6 text-accent-purple animate-spin" />
      </div>
    );
  }

  // Show success/error UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background-base">
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
        <GlassCard className="p-8 md:p-10 text-center" hover={false} glow={confirmed === 'approved' ? 'mint' : 'purple'}>
          <AnimatePresence mode="wait">
            {confirmed === 'approved' ? (
              <motion.div
                key="approved"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-accent-mint/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-accent-mint" />
                </div>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Authorized!
                </h2>
                <p className="font-body text-sm text-text-muted">
                  CLI session approved. You can close this window and return to the terminal.
                </p>
              </motion.div>
            ) : confirmed === 'denied' ? (
              <motion.div
                key="denied"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Authorization Denied
                </h2>
                <p className="font-body text-sm text-text-muted">
                  This CLI session has been denied. You can close this window.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-accent-purple/20 flex items-center justify-center">
                  <Terminal className="w-7 h-7 text-accent-purple" />
                </div>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Authorize CLI Session
                </h2>
                <p className="font-body text-sm text-text-muted">
                  A CLI is requesting access to your Codebuff account.
                </p>

                {userCode && (
                  <div className="w-full p-4 rounded-lg bg-background-card border border-border-subtle">
                    <p className="font-body text-xs text-text-muted mb-2">Confirm this code matches:</p>
                    <p className="font-display text-2xl font-bold text-accent-mint tracking-widest">
                      {userCode}
                    </p>
                  </div>
                )}

                <p className="font-body text-xs text-text-muted">
                  Signed in as <span className="text-text-primary font-medium">{session?.user?.email}</span>
                </p>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-xs text-red-400"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </motion.p>
                )}

                <div className="flex items-center gap-3 w-full pt-2">
                  <button
                    onClick={handleDeny}
                    disabled={isConfirming}
                    className="flex-1 glass glass-hover rounded-full px-6 py-3 font-body text-sm font-medium text-text-muted hover:text-text-primary transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    Deny
                  </button>
                  <MagneticButton
                    onClick={handleApprove}
                    variant="primary"
                    size="lg"
                    disabled={isConfirming}
                    className="flex-1 justify-center"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Authorizing...
                      </>
                    ) : (
                      <>
                        Authorize
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </MagneticButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
}
