'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, MessageCircle, Globe, Video, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { subscribeToNewsletter } from '@/lib/newsletter-actions';

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

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('source', 'footer-newsletter');

      const result = await subscribeToNewsletter(formData);

      if (result.errors) {
        setError(result.errors.email || result.errors.form || 'Something went wrong');
      } else if (result.success) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-accent-mint text-xs">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Subscribed! Check your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 max-w-xs">
      <label htmlFor="footer-email" className="sr-only">
        Subscribe to newsletter
      </label>
      <input
        id="footer-email"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        className="flex-1 glass rounded-full px-4 py-2 font-body text-xs text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent-purple/50 focus:bg-accent-purple/5 transition-colors duration-200 disabled:opacity-50"
        required
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="shrink-0 bg-accent-purple hover:brightness-110 text-text-inverse rounded-full p-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
        aria-label="Subscribe"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
      {error && (
        <p className="absolute mt-10 text-xs text-red-400 max-w-48">{error}</p>
      )}
    </form>
  );
}

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
            <NewsletterForm />
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
