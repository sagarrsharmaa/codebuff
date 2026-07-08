'use client';

import { Code2, Database, GitBranch, Shield, Cpu, HeadphonesIcon, Zap, Globe } from 'lucide-react';

const logos = [
  { Icon: Code2, label: 'CodeForge' },
  { Icon: Database, label: 'DataPulse' },
  { Icon: GitBranch, label: 'GitStream' },
  { Icon: Shield, label: 'SecureStack' },
  { Icon: Cpu, label: 'NeuralCore' },
  { Icon: HeadphonesIcon, label: 'HelpWave' },
  { Icon: Zap, label: 'BoltAI' },
  { Icon: Globe, label: 'GlobalMesh' },
];

export function LogoMarquee() {
  return (
    <section className="relative w-full py-20 md:py-24 overflow-hidden">
      {/* Section label */}
      <div className="text-center mb-10">
        <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em]">
          Trusted by engineering teams at
        </p>
      </div>

      {/* Marquee track with mask-image edge fade */}
      <div
        className="relative w-full group"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee gap-16 md:gap-24 items-center group-hover:[animation-play-state:paused]">
            {/* First set */}
            {logos.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 shrink-0"
              >
                <Icon className="w-5 h-5 text-text-muted" />
                <span className="font-body text-sm text-text-muted whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex animate-marquee gap-16 md:gap-24 items-center group-hover:[animation-play-state:paused]">
            {logos.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 shrink-0"
              >
                <Icon className="w-5 h-5 text-text-muted" />
                <span className="font-body text-sm text-text-muted whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
