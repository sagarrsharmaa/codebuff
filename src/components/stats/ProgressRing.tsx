'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  suffix?: string;
}

export function ProgressRing({
  value,
  size = 100,
  strokeWidth = 6,
  color = '#7C5CFC',
  label,
  suffix = '%',
}: ProgressRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (circleRef.current) {
        gsap.set(circleRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
        });

        gsap.to(circleRef.current, {
          strokeDashoffset: circumference * (1 - value / 100),
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (textRef.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: value,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (textRef.current) {
              textRef.current.textContent = `${Math.round(obj.val)}`;
            }
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [value, circumference, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Animated circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={
            prefersReducedMotion
              ? circumference * (1 - value / 100)
              : circumference
          }
        />
      </svg>
      <div className="flex items-baseline gap-0.5">
        <span
          ref={textRef}
          className="font-display text-2xl font-bold text-text-primary"
        >
          {prefersReducedMotion ? value : 0}
        </span>
        <span className="font-body text-sm text-text-muted">{suffix}</span>
      </div>
      {label && (
        <span className="font-body text-xs text-text-muted">{label}</span>
      )}
    </div>
  );
}
