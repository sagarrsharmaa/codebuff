'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { GlassCard } from '@/components/primitives/GlassCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const metrics = [
  { label: 'Lines Generated', value: '12.4M', change: '+18%', color: 'text-accent-mint' },
  { label: 'Build Success', value: '97.2%', change: '+3.5%', color: 'text-accent-cyan' },
  { label: 'Dev Hours Saved', value: '2,847', change: '+42%', color: 'text-accent-purple' },
  { label: 'Avg. Response', value: '1.2s', change: '-24%', color: 'text-accent-mint' },
];

const chartBars = [40, 65, 45, 80, 55, 90, 70, 95, 75, 85, 60, 78];

export function DashboardMockup() {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Use motion values + springs for tilt — avoids React re-renders on mouse move
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current || prefersReducedMotion) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      rotateX.set(Math.max(-5, Math.min(5, (-mouseY / rect.height) * 10)));
      rotateY.set(Math.max(-5, Math.min(5, (mouseX / rect.width) * 10)));
    },
    [prefersReducedMotion, rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : { y: [0, -6, 0] }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.5 }
          : {
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
      style={{
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className="w-full max-w-[520px] mx-auto mt-12 md:mt-16"
    >
      <GlassCard className="p-6 md:p-8" hover={false}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm bg-accent-purple" />
              </div>
              <div>
                <p className="font-body text-sm text-text-primary">Codebuff Dashboard</p>
                <p className="font-body text-xs text-text-muted">AI Development Metrics</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-purple/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent-mint/60" />
            </div>
          </div>

          {/* Metric tiles */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg bg-background-card p-3.5 space-y-1.5"
              >
                <p className="font-body text-xs text-text-muted uppercase tracking-wider">
                  {metric.label}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-xl md:text-2xl font-bold text-text-primary">
                    {metric.value}
                  </span>
                  <span className={`font-body text-xs font-medium ${metric.color}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mini chart */}
          <div className="rounded-lg bg-background-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-body text-xs text-text-muted uppercase tracking-wider">
                Weekly Activity
              </p>
              <span className="font-body text-xs text-accent-cyan">+8.3%</span>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {chartBars.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-accent-purple/60 to-accent-purple/30"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Activity indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
            <span className="font-body text-xs text-text-muted">All systems operational</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
