'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { DashboardMockup } from '@/components/hero/DashboardMockup';
import { ScrollIndicator } from '@/components/hero/ScrollIndicator';
import { MeshGradient } from '@/components/effects/MeshGradient';
import { NoiseOverlay } from '@/components/effects/NoiseOverlay';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Easing } from 'framer-motion';

const easeOutExpo: Easing = [0.16, 1, 0.3, 1];

const headlineWords = [
  'Ship',
  'production-grade',
  'code',
  'with',
  'AI',
  'that',
  'ships.',
];

// Outer container: staggers its direct children (h1 headline, subheadline, CTAs, dashboard)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

// Headline wrapper: staggers the individual word spans
const headlineContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOutExpo,
    },
  },
};

// Subheadline: appears 150ms AFTER the headline finishes
// Headline has 7 words * 0.04 stagger = 0.28s, delayChildren 0.3 → finishes at 0.58s
// Subheadline (child 2) stagger starts at 0.3 + 0.12 = 0.42s
// To fire at 0.58 + 0.15 = 0.73s, we need delay = 0.73 - 0.42 = 0.31
const subheadlineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.31,
      duration: 0.6,
      ease: easeOutExpo,
    },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

const dashboardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.35,
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
};

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  // Static fallback for prefers-reduced-motion
  if (prefersReducedMotion) {
    return (
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <MeshGradient />
        <NoiseOverlay />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(10, 10, 15, 0.6) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center text-center px-gutter md:px-gutter-lg w-full">
          <h1 className="max-w-5xl mx-auto">
            <span className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-display font-bold text-text-primary leading-[0.95]">
              Ship production-grade code with AI that ships.
            </span>
          </h1>
          <p className="mt-6 md:mt-8 font-body text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
            Codebuff integrates directly into your CLI and IDE. Describe
            features, fix bugs, and refactor at scale — all from natural
            language.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4">
            <MagneticButton variant="primary" size="lg" as="a" href="/signup">
              Start building free
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton variant="ghost" size="lg">
              <Play className="w-4 h-4" />
              Watch demo
            </MagneticButton>
          </div>
          <DashboardMockup />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <MeshGradient />
      <NoiseOverlay />

      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(10, 10, 15, 0.6) 100%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-gutter md:px-gutter-lg w-full"
      >
        {/* Headline → motion.h1 so staggerChildren propagates to word spans */}
        <motion.h1
          variants={headlineContainerVariants}
          className="max-w-5xl mx-auto"
        >
          <span className="inline-flex flex-wrap justify-center gap-x-[0.15em]">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-display font-bold text-text-primary leading-[0.95] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={subheadlineVariants}
          className="mt-6 md:mt-8 font-body text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed"
        >
          Codebuff integrates directly into your CLI and IDE. Describe features,
          fix bugs, and refactor at scale — all from natural language.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={ctaVariants}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticButton variant="primary" size="lg" as="a" href="/signup">
            Start building free
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton variant="ghost" size="lg">
            <Play className="w-4 h-4" />
            Watch demo
          </MagneticButton>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div variants={dashboardVariants} className="w-full">
          <DashboardMockup />
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
