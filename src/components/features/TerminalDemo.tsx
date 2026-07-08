'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const codeLines = [
  { text: 'const app = new Codebuff();', delay: 0.3, indent: 0 },
  { text: 'app.loadProject("./src");', delay: 0.2, indent: 0 },
  { text: '', delay: 0.1, indent: 0 },
  { text: '// Describe what you want to build', delay: 0.4, indent: 0 },
  { text: 'const feature = await app.describe(', delay: 0.15, indent: 0 },
  { text: '  "Add user authentication",', delay: 0.15, indent: 2 },
  { text: '  { framework: "Next.js" }', delay: 0.15, indent: 2 },
  { text: ');', delay: 0.1, indent: 0 },
  { text: '', delay: 0.1, indent: 0 },
  { text: '// AI generates production-ready code', delay: 0.35, indent: 0 },
  { text: 'await feature.generate();', delay: 0.2, indent: 0 },
  { text: '// ✓ 14 files created, 0 errors', delay: 0.5, indent: 0, highlight: true },
];

export function TerminalDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLPreElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !linesRef.current) return;

    const ctx = gsap.context(() => {
      const lines = linesRef.current?.querySelectorAll<HTMLSpanElement>('.terminal-line');
      if (!lines) return;

      gsap.set(lines, { opacity: 0, width: '0ch' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reset',
        },
      });

      let totalDelay = 0;
      lines.forEach((line, i) => {
        const codeLine = codeLines[i];
        if (!codeLine) return;

        totalDelay += codeLine.delay;

        tl.to(line, { opacity: 1, duration: 0.01 });

        if (codeLine.text.length > 0) {
          const text = codeLine.text;
          for (let charIdx = 0; charIdx < text.length; charIdx++) {
            // eslint-disable-next-line no-loop-func
            tl.call(
              () => {
                line.textContent = text.slice(0, charIdx + 1);
              },
              [],
              totalDelay + charIdx * 0.025
            );
          }
          totalDelay += text.length * 0.025;
        }
      });

      // Blinking cursor
      tl.to('.terminal-cursor', {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className="relative rounded-xl bg-[#0D1117] border border-[#30363D] p-4 md:p-5 font-mono text-xs md:text-sm leading-6 overflow-hidden w-full max-w-md mx-auto"
      >
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#30363D]">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-2 font-body text-xs text-text-muted">terminal — codebuff</span>
        </div>
        <pre className="text-[#E6EDF3]">
          <code>
            {codeLines.map((line, i) => (
              <div key={i} className="flex">
                {line.highlight ? (
                  <span className="text-accent-mint">{line.text || '\u00A0'}</span>
                ) : line.text.startsWith('//') ? (
                  <span className="text-text-muted">{line.text || '\u00A0'}</span>
                ) : (
                  <span>{line.text || '\u00A0'}</span>
                )}
              </div>
            ))}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl bg-[#0D1117] border border-[#30363D] p-4 md:p-5 font-mono text-xs md:text-sm leading-6 overflow-hidden w-full max-w-md mx-auto"
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#30363D]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
        <span className="ml-2 font-body text-xs text-text-muted">terminal — codebuff</span>
      </div>
      <pre className="text-[#E6EDF3]" ref={linesRef}>
        <code>
          {codeLines.map((line, i) => (
            <div key={i} className="flex min-h-[1.5em]">
              <span
                className={`terminal-line inline-block ${
                  line.highlight
                    ? 'text-accent-mint'
                    : line.text.startsWith('//')
                    ? 'text-text-muted'
                    : ''
                }`}
              >
                {line.text}
              </span>
            </div>
          ))}
          <span className="terminal-cursor inline-block w-2 h-4 bg-accent-purple ml-0.5 align-middle" />
        </code>
      </pre>
    </div>
  );
}
