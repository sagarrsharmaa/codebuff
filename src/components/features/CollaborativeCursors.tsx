'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const cursors = [
  { id: 1, color: '#7C5CFC', name: 'Alice' },
  { id: 2, color: '#3BC9DB', name: 'Bob' },
  { id: 3, color: '#9AE6B4', name: 'Carol' },
  { id: 4, color: '#FF6B6B', name: 'Dave' },
];

export function CollaborativeCursors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const ctx = gsap.context(() => {
      cursors.forEach((cursor) => {
        const el = cursorRefs.current.get(cursor.id);
        if (!el) return;

        // Random starting position
        gsap.set(el, {
          x: gsap.utils.random(10, w - 10),
          y: gsap.utils.random(10, h - 10),
        });

        // Continuous idle movement with slight randomness
        gsap.to(el, {
          x: `+=${gsap.utils.random(-30, 30)}`,
          y: `+=${gsap.utils.random(-30, 30)}`,
          duration: gsap.utils.random(2, 4),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        // Occasional larger jumps (simulating edits)
        gsap.delayedCall(gsap.utils.random(3, 6), function jump() {
          if (!el) return;
          gsap.to(el, {
            x: gsap.utils.random(10, w - 10),
            y: gsap.utils.random(10, h - 10),
            duration: gsap.utils.random(0.8, 1.5),
            ease: 'power2.inOut',
            onComplete: () => {
              // Animate a tiny flash/highlight effect on "edit"
              const flash = document.createElement('div');
              flash.className =
                'absolute -inset-2 rounded-full pointer-events-none';
              flash.style.background = `${cursor.color}30`;
              el.appendChild(flash);
              gsap.to(flash, {
                opacity: 0,
                scale: 2,
                duration: 0.6,
                onComplete: () => flash.remove(),
              });
            },
          });
          gsap.delayedCall(gsap.utils.random(4, 10), jump);
        });

        // Pulsing glow
        gsap.to(el, {
          boxShadow: `0 0 12px ${cursor.color}60`,
          duration: gsap.utils.random(1.5, 3),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className="relative rounded-xl glass p-6 md:p-8 w-full max-w-md mx-auto h-64 flex items-center justify-center"
      >
        <p className="font-body text-sm text-text-muted">
          Real-time collaboration with AI teammates
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl glass p-6 md:p-8 w-full max-w-md mx-auto"
      style={{ height: 280, overflow: 'hidden' }}
    >
      {/* File background */}
      <div className="absolute inset-0 p-6 pointer-events-none">
        <div className="space-y-2 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded bg-text-muted"
              style={{ width: `${40 + Math.random() * 50}%` }}
            />
          ))}
        </div>
      </div>

      {/* Cursor labels */}
      <div className="absolute top-4 left-4 z-10">
        <p className="font-body text-xs text-text-primary">Live Collaboration</p>
        <p className="font-body text-[10px] text-text-muted">
          {cursors.length} teammates viewing
        </p>
      </div>

      {/* Cursor dots with name labels */}
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          ref={(el) => {
            if (el) cursorRefs.current.set(cursor.id, el);
          }}
          className="absolute flex items-center gap-1.5 pointer-events-none z-20"
          style={{ willChange: 'transform' }}
        >
          <div
            className="w-3 h-3 rounded-full border-2 border-background-base"
            style={{ backgroundColor: cursor.color }}
          />
          <span
            className="font-body text-[10px] px-1.5 py-0.5 rounded-full text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </span>
        </div>
      ))}

      {/* Cursor count badge */}
      <div className="absolute bottom-4 right-4 z-10 glass rounded-full px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {cursors.map((c) => (
              <div
                key={c.id}
                className="w-4 h-4 rounded-full border border-background-base"
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>
          <span className="font-body text-[10px] text-text-muted">4 online</span>
        </div>
      </div>
    </div>
  );
}
