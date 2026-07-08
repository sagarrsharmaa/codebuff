'use client';

import { GlassCard } from '@/components/primitives/GlassCard';
import { SectionWrapper } from '@/components/primitives/SectionWrapper';
import { Star } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const testimonials = [
  {
    name: 'Sarah Chen',
    company: 'Stripe',
    role: 'Senior Engineer',
    avatar: 'SC',
    quote:
      'Codebuff cut our feature development time by 60%. It understands our codebase better than some of our new hires.',
    rating: 5,
    color: '#7C5CFC',
  },
  {
    name: 'Marcus Johnson',
    company: 'Vercel',
    role: 'Engineering Lead',
    avatar: 'MJ',
    quote:
      'We ship to production 3x faster. Codebuff handles the boilerplate so our team can focus on architecture.',
    rating: 5,
    color: '#3BC9DB',
  },
  {
    name: 'Elena Rodriguez',
    company: 'Linear',
    role: 'Staff Developer',
    avatar: 'ER',
    quote:
      'The CLI integration is seamless. I describe what I want in plain English and it generates type-safe code.',
    rating: 5,
    color: '#9AE6B4',
  },
  {
    name: 'Alex Kim',
    company: 'Notion',
    role: 'Tech Lead',
    avatar: 'AK',
    quote:
      'Code review has never been this fast. The AI catches edge cases our team would have missed.',
    rating: 4,
    color: '#9AE6B4',
  },
  {
    name: 'Priya Patel',
    company: 'Raycast',
    role: 'Full-Stack Developer',
    avatar: 'PP',
    quote:
      'From prototype to production in hours instead of weeks. Codebuff is now an essential part of our stack.',
    rating: 5,
    color: '#7C5CFC',
  },
  {
    name: 'James Wilson',
    company: 'Supabase',
    role: 'Backend Engineer',
    avatar: 'JW',
    quote:
      'The refactoring capabilities are incredible. We migrated 50k lines of code with zero regressions.',
    rating: 3,
    color: '#3BC9DB',
  },
];

function TestimonialCard({
  name,
  company,
  role,
  avatar,
  quote,
  rating,
  color,
}: (typeof testimonials)[0]) {
  return (
    <GlassCard className="p-6 shrink-0 w-80 md:w-96" hover>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-text-inverse shrink-0"
          style={{ backgroundColor: color }}
        >
          {avatar}
        </div>
        <div>
          <p className="font-body text-sm text-text-primary font-medium">{name}</p>
          <p className="font-body text-xs text-text-muted">
            {role} · {company}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating
                ? 'text-accent-purple fill-accent-purple'
                : 'text-text-muted/30'
            }`}
          />
        ))}
      </div>
      <p className="font-body text-sm text-text-secondary leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
    </GlassCard>
  );
}

export function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="testimonials" fullHeight={false} className="py-24 md:py-32 overflow-hidden">
      <div className="text-center mb-12">
        <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
          Testimonials
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary">
          Loved by engineering teams
        </h2>
        <p className="mt-4 font-body text-base md:text-lg text-text-secondary max-w-xl mx-auto">
          See what teams are saying about Codebuff.
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(10,10,15,1), transparent)',
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, rgba(10,10,15,1), transparent)',
          }}
        />

        {/* Scrolling track */}
        <div
          className={`flex gap-6 ${
            prefersReducedMotion ? '' : 'group'
          }`}
        >
          <div
            className={`flex gap-6 ${
              prefersReducedMotion
                ? 'flex-wrap justify-center'
                : 'animate-testimonial group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]'
            }`}
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
          {!prefersReducedMotion && (
            <div
              className="flex gap-6 animate-testimonial group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
              aria-hidden="true"
            >
              {testimonials.map((t) => (
                <TestimonialCard key={`dup-${t.name}`} {...t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
