'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const dataPoints = [
  { label: 'Mon', value: 45, color: '#7C5CFC' },
  { label: 'Tue', value: 62, color: '#7C5CFC' },
  { label: 'Wed', value: 78, color: '#7C5CFC' },
  { label: 'Thu', value: 55, color: '#7C5CFC' },
  { label: 'Fri', value: 88, color: '#3BC9DB' },
  { label: 'Sat', value: 42, color: '#7C5CFC' },
  { label: 'Sun', value: 36, color: '#7C5CFC' },
];

const lineData = [30, 45, 38, 62, 55, 78, 65, 88, 72, 95, 80, 92];

export function ChartDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate bars
      const bars = barsRef.current?.querySelectorAll<HTMLDivElement>('.chart-bar');
      if (bars) {
        gsap.set(bars, { scaleY: 0, transformOrigin: 'bottom center' });

        gsap.to(bars, {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reset',
          },
        });
      }

      // Draw the line chart path
      if (linePathRef.current) {
        const path = linePathRef.current;
        const length = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reset',
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl glass p-5 md:p-6 w-full max-w-md mx-auto"
    >
      {/* Chart header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-body text-sm text-text-primary">Code Output</p>
          <p className="font-body text-xs text-text-muted">Last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-purple" />
          <span className="font-body text-xs text-text-muted">+24% vs last week</span>
        </div>
      </div>

      {/* Bar chart */}
      <div ref={barsRef} className="flex items-end gap-3 h-28 mb-6">
        {dataPoints.map((point) => (
          <div key={point.label} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className="chart-bar w-full rounded-md"
              style={{
                height: `${point.value}%`,
                background: `linear-gradient(to top, ${point.color}80, ${point.color}30)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-3">
        {dataPoints.map((point) => (
          <div key={point.label} className="flex-1 text-center">
            <span className="font-body text-[10px] text-text-muted">{point.label}</span>
          </div>
        ))}
      </div>

      {/* Mini line chart */}
      <div className="mt-6 pt-5 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-xs text-text-muted">Cumulative (30d)</p>
          <span className="font-body text-xs text-accent-cyan">+8.3% trend</span>
        </div>
        <svg viewBox="0 0 120 32" className="w-full h-8" preserveAspectRatio="none">
          <path
            ref={linePathRef}
            d={lineData
              .map((val, i) => {
                const x = (i / (lineData.length - 1)) * 120;
                const y = 32 - (val / 100) * 28;
                return `${i === 0 ? 'M' : 'L'}${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#3BC9DB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gradient fill under line */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3BC9DB" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3BC9DB" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${lineData
              .map((val, i) => {
                const x = (i / (lineData.length - 1)) * 120;
                const y = 32 - (val / 100) * 28;
                return `${i === 0 ? 'M' : 'L'}${x},${y}`;
              })
              .join(' ')} L120,32 L0,32 Z`}
            fill="url(#lineGradient)"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
