'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { subscribeToNewsletter } from '@/lib/newsletter-actions';

export function FinalCTASection() {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [pulsing, setPulsing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Occasional subtle pulse — every 4 seconds, not constant
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('source', 'landing-page-cta');

      const result = await subscribeToNewsletter(formData);

      if (result.errors) {
        setError(result.errors.email || result.errors.form || 'Something went wrong');
      } else if (result.success) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative w-full py-32 md:py-40 px-gutter md:px-gutter-lg overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-purple/10 to-background-base" />

      {/* Ambient floating shapes */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-1/4 -left-20 w-72 h-72 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(124,92,252,0.15), transparent 70%)',
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-1/4 -right-16 w-80 h-80 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(59,201,219,0.1), transparent 70%)',
            }}
            animate={{
              x: [0, -25, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(154,230,180,0.06), transparent 70%)',
            }}
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -25, 15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-accent-mint/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-accent-mint" />
            </div>
            <h3 className="font-display text-2xl font-bold text-text-primary">
              You're on the list!
            </h3>
            <p className="font-body text-sm text-text-secondary max-w-sm">
              Check your inbox for a confirmation email. We'll keep you posted on the latest.
            </p>
          </motion.div>
        ) : (
          <>
            <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
              Get Started
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary leading-[1.1] mb-4">
              Ready to ship faster?
            </h2>
            <p className="font-body text-base md:text-lg text-text-secondary max-w-lg mx-auto mb-10 leading-relaxed">
              Join thousands of engineering teams using Codebuff. Start building
              production-grade code with AI today.
            </p>

            {/* Email input + button */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full glass rounded-full px-5 py-3 font-body text-sm text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent-purple/50 focus:bg-accent-purple/5 transition-colors duration-200 disabled:opacity-50"
                required
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                animate={pulsing ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="shrink-0 bg-accent-purple hover:brightness-110 text-text-inverse rounded-full px-6 py-3 font-body text-sm font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    Start free
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-1.5 font-body text-xs text-red-400 mt-3"
              >
                <AlertCircle className="w-3 h-3" />
                {error}
              </motion.p>
            )}

            <p className="font-body text-xs text-text-muted mt-4">
              No credit card required. Free plan includes 500 AI actions.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
