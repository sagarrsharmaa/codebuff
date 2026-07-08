'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function FinalCTASection() {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [pulsing, setPulsing] = useState(false);

  // Occasional subtle pulse — every 4 seconds, not constant
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

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
          onSubmit={(e) => e.preventDefault()}
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full glass rounded-full px-5 py-3 font-body text-sm text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent-purple/50 focus:bg-accent-purple/5 transition-colors duration-200"
            required
          />
          <motion.a
            href="/signup"
            animate={pulsing ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="shrink-0 bg-accent-purple hover:brightness-110 text-text-inverse rounded-full px-6 py-3 font-body text-sm font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer"
          >
            Start free
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </form>

        <p className="font-body text-xs text-text-muted mt-4">
          No credit card required. Free plan includes 500 AI actions.
        </p>
      </div>
    </section>
  );
}
