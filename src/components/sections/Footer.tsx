'use client';

import { motion } from 'framer-motion';
import { GitBranch, MessageCircle, Globe, Video, ArrowRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const footerLinks = {
  product: {
    label: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Changelog', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
    ],
  },
  company: {
    label: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
    ],
  },
  legal: {
    label: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
    ],
  },
};

const socialLinks = [
  { Icon: GitBranch, href: '#', label: 'GitHub' },
  { Icon: MessageCircle, href: '#', label: 'X / Twitter' },
  { Icon: Globe, href: '#', label: 'LinkedIn' },
  { Icon: Video, href: '#', label: 'YouTube' },
];

export function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer className="relative w-full bg-background-base pt-16 pb-8 px-gutter md:px-gutter-lg">
      {/* Animated gradient divider line */}
      <div className="max-w-container mx-auto mb-14">
        <motion.div
          className="h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(124,92,252,0.5), rgba(59,201,219,0.3), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <p className="font-display text-xl font-bold text-text-primary mb-3 tracking-display">
              Codebuff
            </p>
            <p className="font-body text-sm text-text-muted max-w-xs mb-6 leading-relaxed">
              Ship production-grade code with AI that understands your codebase.
            </p>

            {/* Newsletter */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 max-w-xs"
            >
              <label htmlFor="footer-email" className="sr-only">
                Subscribe to newsletter
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                className="flex-1 glass rounded-full px-4 py-2 font-body text-xs text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent-purple/50 focus:bg-accent-purple/5 transition-colors duration-200"
              />
              <button
                type="submit"
                className="shrink-0 bg-accent-purple hover:brightness-110 text-text-inverse rounded-full p-2 transition-all duration-200 cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-body text-xs text-text-muted uppercase tracking-wider mb-4">
                {section.label}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="font-body text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border-subtle">
          <p className="font-body text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Codebuff, Inc. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="w-8 h-8 rounded-full glass glass-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-colors duration-200"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
