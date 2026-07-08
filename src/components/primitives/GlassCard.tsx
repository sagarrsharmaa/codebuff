'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'purple' | 'cyan' | 'mint' | null;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = null,
  ...props
}: GlassCardProps) {
  const glowStyles = glow
    ? {
        purple: 'shadow-glow',
        cyan: 'shadow-glow-cyan',
        mint: 'shadow-[0_0_20px_rgba(154,230,180,0.15)]',
      }[glow]
    : '';

  return (
    <motion.div
      className={cn(
        'glass rounded-xl',
        hover && 'glass-hover',
        glowStyles,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
