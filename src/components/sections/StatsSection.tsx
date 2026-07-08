'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ProgressRing } from '@/components/stats/ProgressRing';
import { SectionWrapper } from '@/components/primitives/SectionWrapper';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StatItemProps {
  displayValue: string;
  label: string;
  animateFrom?: number;
  animateTo?: number;
  suffix?: string;
  prefix?: string;
}

function StatItem({ displayValue, label, animateFrom, animateTo, suffix = '', prefix = '' }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          if (animateTo !== undefined && textRef.current) {
            const obj = { val: animateFrom ?? 0 };
            gsap.to(obj, {
              val: animateTo,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                if (textRef.current) {
                  if (animateTo > 10000) {
                    // Show abbreviated: format as comma-separated integer
                    textRef.current.textContent = Math.round(obj.val).toLocaleString();
                  } else if (Number.isInteger(animateTo)) {
                    textRef.current.textContent = Math.round(obj.val).toString();
                  } else {
                    textRef.current.textContent = obj.val.toFixed(1);
                  }
                }
              },
            });
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animateFrom, animateTo, hasAnimated, prefersReducedMotion]);

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-baseline justify-center gap-0.5">
        <span className="font-body text-2xl md:text-3xl text-accent-purple font-medium">
          {prefix}
        </span>
        <span
          ref={textRef}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-display"
        >
          {hasAnimated || prefersReducedMotion ? displayValue : '0'}
        </span>
        <span className="font-body text-lg md:text-xl text-text-muted">{suffix}</span>
      </div>
      <p className="font-body text-sm md:text-base text-text-secondary mt-2">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <SectionWrapper id="stats" fullHeight={false} className="py-24 md:py-32">
      <div className="text-center mb-16">
        <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
          By The Numbers
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary">
          Trusted by teams that ship
        </h2>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-20">
        <StatItem
          displayValue="12.4M"
          label="Lines of code generated"
          suffix="M+"
          animateTo={12.4}
        />
        <StatItem
          displayValue="97.2%"
          label="Build success rate"
          animateFrom={0}
          animateTo={97.2}
          suffix="%"
        />
        <StatItem
          displayValue="2,847"
          label="Developer hours saved"
          animateTo={2847}
        />
      </div>

      {/* Progress ring stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-2xl mx-auto">
        <ProgressRing
          value={94}
          size={110}
          strokeWidth={7}
          color="#7C5CFC"
          label="Code quality score"
          suffix="%"
        />
        <ProgressRing
          value={78}
          size={110}
          strokeWidth={7}
          color="#3BC9DB"
          label="Team velocity increase"
          suffix="%"
        />
        <ProgressRing
          value={99.7}
          size={110}
          strokeWidth={7}
          color="#9AE6B4"
          label="Uptime reliability"
          suffix="%"
        />
      </div>
    </SectionWrapper>
  );
}
