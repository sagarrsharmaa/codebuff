'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullHeight?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
  fullHeight = true,
  ...props
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'relative w-full flex flex-col items-center justify-center px-gutter md:px-gutter-lg',
        fullHeight && 'min-h-screen',
        className
      )}
      {...props}
    >
      <div className="w-full max-w-container mx-auto">{children}</div>
    </motion.section>
  );
}
