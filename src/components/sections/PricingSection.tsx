'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { SectionWrapper } from '@/components/primitives/SectionWrapper';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { checkoutAction } from '@/lib/stripe-actions';

interface Tier {
  name: string;
  desc: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: { name: string; included: boolean }[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    desc: 'For individual developers and small projects.',
    monthlyPrice: 29,
    yearlyPrice: 23,
    features: [
      { name: 'Up to 3 repos', included: true },
      { name: '500 AI actions/month', included: true },
      { name: 'Basic code generation', included: true },
      { name: 'CLI + VS Code extension', included: true },
      { name: 'Email support', included: true },
      { name: 'Team collaboration', included: false },
      { name: 'Custom integrations', included: false },
      { name: 'SSO / SAML', included: false },
    ],
    cta: 'Choose Starter',
  },
  {
    name: 'Pro',
    desc: 'For professional teams shipping at scale.',
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      { name: 'Unlimited repos', included: true },
      { name: 'Unlimited AI actions', included: true },
      { name: 'Advanced code generation', included: true },
      { name: 'CLI + VS Code + JetBrains', included: true },
      { name: 'Priority support', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'SSO / SAML', included: false },
    ],
    cta: 'Choose Pro',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    desc: 'For organizations with advanced needs.',
    monthlyPrice: 299,
    yearlyPrice: 249,
    features: [
      { name: 'Unlimited repos', included: true },
      { name: 'Unlimited AI actions', included: true },
      { name: 'Advanced code generation', included: true },
      { name: 'All IDE extensions', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'SSO / SAML', included: true },
    ],
    cta: 'Contact sales',
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    if (plan === 'enterprise') {
      window.location.href = 'mailto:sales@codebuff.com';
      return;
    }

    setLoadingPlan(plan);

    try {
      const formData = new FormData();
      formData.set('plan', plan);
      formData.set('billing', yearly ? 'yearly' : 'monthly');
      await checkoutAction(formData);
    } catch {
      setLoadingPlan(null);
    }
  }

  return (
    <SectionWrapper id="pricing" fullHeight={false} className="py-24 md:py-32">
      <div className="text-center mb-12">
        <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
          Pricing
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 font-body text-base md:text-lg text-text-secondary max-w-xl mx-auto">
          Start free, upgrade when you scale. No hidden fees.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span
          className={`font-body text-sm transition-colors ${
            !yearly ? 'text-text-primary' : 'text-text-muted'
          }`}
        >
          Monthly
        </span>
        <button
          onClick={() => setYearly((p) => !p)}
          className="relative w-14 h-7 rounded-full bg-background-card border border-border-subtle cursor-pointer"
          aria-label={`Switch to ${yearly ? 'monthly' : 'yearly'} billing`}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-accent-purple flex items-center justify-center"
            animate={{ x: yearly ? 28 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <span className="text-[10px] text-text-inverse font-bold">$</span>
          </motion.div>
        </button>
        <span
          className={`font-body text-sm transition-colors ${
            yearly ? 'text-text-primary' : 'text-text-muted'
          }`}
        >
          Yearly
        </span>

        <AnimatePresence>
          {yearly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="font-body text-[11px] text-accent-mint bg-accent-mint/10 border border-accent-mint/30 rounded-full px-3 py-1"
            >
              Save ~20%
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => {
          const price = yearly ? tier.yearlyPrice : tier.monthlyPrice;
          const planKey = tier.name.toLowerCase();
          const isEnterprise = planKey === 'enterprise';

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className={`relative rounded-xl p-6 md:p-8 flex flex-col ${
                tier.highlighted
                  ? 'bg-accent-purple/5 border border-accent-purple/30 shadow-glow scale-[1.02] md:scale-[1.03] z-10'
                  : 'glass border border-border-subtle'
              }`}
            >
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(124,92,252,0.25), 0 0 24px rgba(124,92,252,0.08)',
                }}
              />

              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="font-body text-[11px] text-text-inverse bg-accent-purple rounded-full px-4 py-1 font-medium whitespace-nowrap">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="relative z-10 flex flex-col flex-1">
                <h3 className="font-display text-xl font-bold text-text-primary">
                  {tier.name}
                </h3>
                <p className="font-body text-sm text-text-secondary mt-1 mb-5">
                  {tier.desc}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-body text-3xl text-text-muted">$</span>
                  <motion.span
                    key={price}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-5xl font-bold text-text-primary"
                  >
                    {price}
                  </motion.span>
                  <span className="font-body text-sm text-text-muted">
                    {isEnterprise ? '' : '/mo'}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat.name} className="flex items-center gap-3">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-accent-mint shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-text-muted/40 shrink-0" />
                      )}
                      <span
                        className={`font-body text-sm ${
                          feat.included ? 'text-text-secondary' : 'text-text-muted/50'
                        }`}
                      >
                        {feat.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <MagneticButton
                  variant={tier.highlighted ? 'primary' : 'ghost'}
                  size="lg"
                  className="w-full justify-center"
                  onClick={() => handleCheckout(planKey)}
                  disabled={loadingPlan === planKey}
                >
                  {loadingPlan === planKey ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    tier.cta
                  )}
                </MagneticButton>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
