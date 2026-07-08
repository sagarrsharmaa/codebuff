'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  UserPlus,
  Plug,
  Brain,
  Rocket,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your account and connect your repository in under 60 seconds.',
  },
  {
    icon: Plug,
    title: 'Connect',
    description: 'Integrate Codebuff with your existing CI/CD pipeline and tools.',
  },
  {
    icon: Brain,
    title: 'Train',
    description: 'Codebuff learns your codebase, conventions, and architecture automatically.',
  },
  {
    icon: Rocket,
    title: 'Deploy',
    description: 'Generate, review, and ship production-ready code with one command.',
  },
  {
    icon: Eye,
    title: 'Monitor',
    description: 'Track build quality, performance regressions, and team velocity in real-time.',
  },
  {
    icon: TrendingUp,
    title: 'Scale',
    description: 'Expand across teams — Codebuff adapts to any monorepo or microservice setup.',
  },
];

export function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !pathRef.current) return;

    const ctx = gsap.context(() => {
      if (!pathRef.current) return;
      const path = pathRef.current;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      // Scrub the drawing of the path
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
          toggleActions: 'play none none reverse',
        },
      });

      // Animate each step node and content as the line reaches it
      const items = sectionRef.current?.querySelectorAll<HTMLElement>('.timeline-step');
      if (items) {
        items.forEach((item, i) => {
          // The dot fill
          const dot = item.querySelector('.timeline-dot');
          if (dot) {
            gsap.set(dot, { scale: 0, opacity: 0 });
            gsap.to(dot, {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: item,
                start: 'top 75%',
                end: 'top 45%',
                scrub: 1,
                toggleActions: 'play none none reverse',
              },
            });
          }

          // The content (icon + text)
          const content = item.querySelector('.timeline-content');
          if (content) {
            gsap.set(content, { opacity: 0, x: i % 2 === 0 ? -30 : 30, y: 20 });
            gsap.to(content, {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 75%',
                end: 'top 40%',
                scrub: 1,
                toggleActions: 'play none none reverse',
              },
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <section
        ref={sectionRef}
        id="timeline"
        className="relative w-full py-24 md:py-32 px-gutter md:px-gutter-lg"
      >
        <div className="max-w-container mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
              How It Works
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary">
              From zero to shipping in minutes
            </h2>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-accent-purple/30" />
            <div className="space-y-12">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative pl-16">
                    <div className="absolute left-4 -translate-x-1/2 w-5 h-5 rounded-full bg-accent-purple border-2 border-background-base z-10" />
                    <div className="glass rounded-xl p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent-purple/15 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-accent-purple" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-body text-xs text-text-muted">
                              Step {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-display text-lg font-bold text-text-primary">
                              {step.title}
                            </h3>
                          </div>
                          <p className="font-body text-sm text-text-secondary">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative w-full py-24 md:py-32 px-gutter md:px-gutter-lg overflow-hidden"
    >
      <div className="max-w-container mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
            How It Works
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary">
            From zero to shipping in minutes
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* SVG connecting line */}
          <svg
            className="absolute left-1/2 -translate-x-px top-0 w-0.5 h-full"
            style={{ zIndex: 0 }}
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M 0.5 0 L 0.5 100%"
              fill="none"
              stroke="url(#timelineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#7C5CFC" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3BC9DB" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={step.title}
                  className={`timeline-step relative flex items-center ${
                    isLeft ? 'flex-row' : 'flex-row-reverse'
                  } mb-16 last:mb-0`}
                >
                  {/* Content */}
                  <div
                    className={`timeline-content w-[calc(50%-24px)] lg:w-[calc(50%-40px)] ${
                      isLeft ? 'text-right pr-0' : 'text-left pl-0'
                    }`}
                  >
                    <div className="glass rounded-xl p-5 inline-block text-left max-w-sm">
                      <div
                        className={`flex items-center gap-4 ${
                          isLeft ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent-purple/15 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-accent-purple" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-body text-xs text-text-muted">
                              Step {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-display text-lg font-bold text-text-primary">
                              {step.title}
                            </h3>
                          </div>
                          <p className="font-body text-sm text-text-secondary">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                    <div className="w-8 h-8 rounded-full bg-background-base border-2 border-accent-purple/40 flex items-center justify-center">
                      <div className="timeline-dot w-4 h-4 rounded-full bg-accent-purple" />
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="w-[calc(50%-32px)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
