'use client';

import { SectionWrapper } from '@/components/primitives/SectionWrapper';
import { GlassCard } from '@/components/primitives/GlassCard';
import { TerminalDemo } from '@/components/features/TerminalDemo';
import { ChartDemo } from '@/components/features/ChartDemo';
import { WorkflowDiagram } from '@/components/features/WorkflowDiagram';
import { CollaborativeCursors } from '@/components/features/CollaborativeCursors';

const features = [
  {
    id: 'terminal',
    title: 'Natural language to production code',
    description:
      'Describe features, APIs, and components in plain English. Codebuff generates type-safe, production-ready code that matches your project conventions.',
    visual: <TerminalDemo />,
    accent: 'accent-purple' as const,
  },
  {
    id: 'chart',
    title: 'Real-time metrics & observability',
    description:
      'Monitor code quality, build times, and team velocity live. Catch regressions before they ship with AI-powered anomaly detection.',
    visual: <ChartDemo />,
    accent: 'accent-cyan' as const,
  },
  {
    id: 'workflow',
    title: 'Automated pipeline from prompt to deploy',
    description:
      'From idea to production in seconds. Codebuff analyzes, generates, verifies, and deploys — all with a single request.',
    visual: <WorkflowDiagram />,
    accent: 'accent-purple' as const,
  },
  {
    id: 'cursors',
    title: 'Collaborative AI teammates',
    description:
      'Your AI agents work alongside your team in real-time. Review diffs, resolve conflicts, and iterate together — like pairing with a senior dev.',
    visual: <CollaborativeCursors />,
    accent: 'accent-cyan' as const,
  },
];

function FeatureRow({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const isReversed = index % 2 === 1;

  return (
    <div
      className={`flex flex-col ${
        isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
      } items-center gap-10 lg:gap-16 py-16 md:py-20`}
    >
      {/* Text side */}
      <div className="flex-1 space-y-5">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                feature.accent === 'accent-purple'
                  ? '#7C5CFC'
                  : feature.accent === 'accent-cyan'
                  ? '#3BC9DB'
                  : '#9AE6B4',
            }}
          />
          <span className="font-body text-xs text-text-muted uppercase tracking-wider">
            Feature {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-display font-bold text-text-primary leading-[1.1]">
          {feature.title}
        </h2>
        <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed max-w-md">
          {feature.description}
        </p>
      </div>

      {/* Visual side */}        <div className="flex-1 w-full max-w-lg">
        <GlassCard hover={false} className="p-0 overflow-hidden">
          {feature.visual}
        </GlassCard>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <SectionWrapper
      id="features"
      fullHeight={false}
      className="py-24 md:py-32"
    >
      <div className="text-center mb-10 md:mb-16">
        <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
          Platform Capabilities
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary">
          Everything you need to ship faster
        </h2>
        <p className="mt-4 font-body text-base md:text-lg text-text-secondary max-w-xl mx-auto">
          From concept to production, Codebuff handles the heavy lifting so your
          team can focus on what matters.
        </p>
      </div>

      <div className="divide-y divide-border-subtle/50">
        {features.map((feature, index) => (
          <FeatureRow key={feature.id} feature={feature} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
