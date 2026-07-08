'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const blobs = [
  {
    size: 600,
    color: 'rgba(124, 92, 252, 0.12)',
    positions: [
      { x: '-15%', y: '-10%' },
      { x: '5%', y: '5%' },
      { x: '-10%', y: '15%' },
      { x: '-15%', y: '-10%' },
    ],
    duration: 20,
  },
  {
    size: 450,
    color: 'rgba(59, 201, 219, 0.06)',
    positions: [
      { x: '55%', y: '50%' },
      { x: '45%', y: '40%' },
      { x: '60%', y: '55%' },
      { x: '55%', y: '50%' },
    ],
    duration: 25,
  },
  {
    size: 500,
    color: 'rgba(154, 230, 180, 0.04)',
    positions: [
      { x: '40%', y: '75%' },
      { x: '35%', y: '65%' },
      { x: '45%', y: '70%' },
      { x: '40%', y: '75%' },
    ],
    duration: 30,
  },
  {
    size: 350,
    color: 'rgba(124, 92, 252, 0.06)',
    positions: [
      { x: '-5%', y: '60%' },
      { x: '0%', y: '55%' },
      { x: '-10%', y: '65%' },
      { x: '-5%', y: '60%' },
    ],
    duration: 22,
  },
];

export function MeshGradient() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle at center, ${blob.color}, transparent 70%)`,
            willChange: 'transform',
          }}
          initial={
            prefersReducedMotion
              ? { x: blob.positions[0].x, y: blob.positions[0].y }
              : { x: blob.positions[0].x, y: blob.positions[0].y }
          }
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: blob.positions.map((p) => p.x),
                  y: blob.positions.map((p) => p.y),
                }
          }
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  );
}
