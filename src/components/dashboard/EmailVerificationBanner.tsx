'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, X, Loader2, AlertCircle } from 'lucide-react';

interface EmailVerificationBannerProps {
  emailVerified: Date | null;
  email: string;
}

export function EmailVerificationBanner({
  emailVerified,
  email,
}: EmailVerificationBannerProps) {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Check for verification success/error from query params
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setJustVerified(true);
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('verified');
      window.history.replaceState({}, '', url.toString());
    }

    const error = searchParams.get('verify_error');
    if (error) {
      setVerifyError(decodeURIComponent(error));
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('verify_error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // Don't show anything if verified, dismissed, or just showed success
  if (emailVerified || dismissed) return null;

  // Show success state briefly
  if (justVerified) {
    return (
      <div className="bg-accent-mint/10 border-b border-accent-mint/20">
        <div className="max-w-5xl mx-auto px-gutter md:px-gutter-lg py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="w-7 h-7 rounded-full bg-accent-mint/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-accent-mint" />
            </div>
            <span className="text-accent-mint font-medium">
              Email verified successfully!
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-accent-mint/60 hover:text-accent-mint transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-accent-purple/10 border-b border-accent-purple/20 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-gutter md:px-gutter-lg py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="w-7 h-7 rounded-full bg-accent-purple/20 flex items-center justify-center shrink-0">
              {resending ? (
                <Loader2 className="w-4 h-4 text-accent-purple animate-spin" />
              ) : (
                <Mail className="w-4 h-4 text-accent-purple" />
              )}
            </div>
            <span className="text-text-secondary">
              {resent ? (
                <>
                  Verification email sent to{' '}
                  <span className="text-text-primary font-medium">{email}</span>.{' '}
                  <span className="text-text-muted">Check your inbox (and spam).</span>
                </>
              ) : verifyError ? (
                <span className="text-red-400">{verifyError}</span>
              ) : (
                <>
                  Please verify your email address.{' '}
                  <span className="text-text-muted">
                    Check <span className="text-text-primary font-medium">{email}</span> for a verification link.
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {resent ? (
              <span className="flex items-center gap-1.5 text-xs text-accent-mint font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Sent
              </span>
            ) : (
              <button
                onClick={async () => {
                  setResending(true);
                  try {
                    const res = await fetch('/api/auth/resend-verification', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email }),
                    });
                    if (res.ok) {
                      setResent(true);
                      setTimeout(() => setResent(false), 5000);
                    }
                  } catch {
                    // Silently fail
                  } finally {
                    setResending(false);
                  }
                }}
                disabled={resending}
                className="text-xs text-accent-purple hover:text-accent-purple/80 font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Resend
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
