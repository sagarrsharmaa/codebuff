'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const nodes = [
  { id: 'prompt', x: 50, y: 20, label: 'Natural\nLanguage', icon: '>' },
  { id: 'analyze', x: 50, y: 45, label: 'AI\nAnalysis', icon: '◆' },
  { id: 'generate', x: 50, y: 70, label: 'Code\nGeneration', icon: '⚡' },
  { id: 'verify', x: 50, y: 95, label: 'Auto\nVerify', icon: '✓' },
];

const connections = [
  { from: 'prompt', to: 'analyze' },
  { from: 'analyze', to: 'generate' },
  { from: 'generate', to: 'verify' },
];

// Generate path data between two nodes (vertical flow)
function getPath(from: typeof nodes[0], to: typeof nodes[0]) {
  const x1 = `${from.x}%`;
  const y1 = `${from.y + 8}%`;
  const x2 = `${to.x}%`;
  const y2 = `${to.y - 8}%`;
  return `M ${x1} ${y1} C ${x1} ${(from.y + to.y) / 2}%, ${x2} ${(from.y + to.y) / 2}%, ${x2} ${y2}`;
}

export function WorkflowDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate path drawing
      gsap.utils.toArray<SVGPathElement>('.workflow-path').forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          delay: i * 0.3,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reset',
          },
        });
      });

      // Animate nodes appearing
      gsap.utils.toArray<HTMLDivElement>('.workflow-node').forEach((node, i) => {
        gsap.set(node, { opacity: 0, scale: 0.6 });

        gsap.to(node, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: i * 0.3 + 0.3,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reset',
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl glass p-6 md:p-8 w-full max-w-sm mx-auto"
    >
      <div className="text-center mb-6">
        <p className="font-body text-sm text-text-primary">Workflow Pipeline</p>
        <p className="font-body text-xs text-text-muted">Prompt → Production</p>
      </div>

      {/* SVG connections */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {connections.map((conn, i) => {
          const from = nodes.find((n) => n.id === conn.from)!;
          const to = nodes.find((n) => n.id === conn.to)!;
          const pathData = getPath(from, to);
          return (
            <path
              key={i}
              className="workflow-path"
              d={pathData}
              fill="none"
              stroke="rgba(124, 92, 252, 0.4)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div className="relative z-10 space-y-0">
        {nodes.map((node, i) => (
          <div
            key={node.id}
            className="workflow-node flex items-center gap-4 p-3 md:p-4"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center shrink-0">
              <span className="font-display text-lg text-accent-purple">
                {node.icon}
              </span>
            </div>
            <div>
              <p className="font-body text-xs md:text-sm text-text-primary whitespace-pre-line leading-tight">
                {node.label}
              </p>
            </div>
            {/* Connection dots */}
            {i < nodes.length - 1 && (
              <div className="ml-auto flex flex-col items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pipeline stats */}
      <div className="mt-5 pt-4 border-t border-border-subtle grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="font-display text-lg font-bold text-accent-cyan">3.2s</p>
          <p className="font-body text-[10px] text-text-muted">Avg. pipeline</p>
        </div>
        <div className="text-center">
          <p className="font-display text-lg font-bold text-accent-mint">99.7%</p>
          <p className="font-body text-[10px] text-text-muted">Success rate</p>
        </div>
        <div className="text-center">
          <p className="font-display text-lg font-bold text-accent-purple">4</p>
          <p className="font-body text-[10px] text-text-muted">Steps</p>
        </div>
      </div>
    </div>
  );
}
