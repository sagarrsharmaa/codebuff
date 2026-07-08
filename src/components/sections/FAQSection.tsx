'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionWrapper } from '@/components/primitives/SectionWrapper';

const faqs = [
  {
    q: 'How does Codebuff understand my codebase?',
    a: 'Codebuff indexes your repository on first connection, analyzing your project structure, dependencies, coding conventions, and architectural patterns. It builds a contextual model that updates as your codebase evolves — no manual configuration needed.',
  },
  {
    q: 'Can I use Codebuff with my existing CI/CD pipeline?',
    a: 'Absolutely. Codebuff integrates with GitHub Actions, GitLab CI, CircleCI, and any custom pipeline via our CLI. You can trigger code generation, review, and deployment directly from your workflow files.',
  },
  {
    q: 'Is my code safe and private?',
    a: 'Yes. Codebuff is SOC 2 compliant and encrypts all data in transit and at rest. For Enterprise customers, we offer self-hosted deployment options and on-premise storage. Your code never leaves your infrastructure unless you choose to use our cloud features.',
  },
  {
    q: 'What languages and frameworks are supported?',
    a: 'Codebuff supports TypeScript, JavaScript, Python, Go, Rust, Ruby, Java, Kotlin, Swift, and more. Framework support includes Next.js, React, Vue, Svelte, Django, Rails, Spring Boot, and most modern frameworks. New languages are added regularly based on demand.',
  },
  {
    q: 'Can I customize the generated code style?',
    a: 'Codebuff adapts to your existing code conventions automatically on first scan. You can also provide a .codebuff config file in your repo to enforce specific formatting rules, naming conventions, and architectural patterns across all generated code.',
  },
  {
    q: 'What happens when I hit my plan limit?',
    a: 'Your existing code and projects remain accessible. You can upgrade your plan at any time to increase your AI action quota. We send usage alerts at 75% and 90% of your limit so there are no surprises.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionWrapper id="faq" fullHeight={false} className="py-24 md:py-32">
      <div className="text-center mb-12">
        <p className="font-body text-xs text-text-muted uppercase tracking-[0.2em] mb-4">
          FAQ
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-bold text-text-primary">
          Frequently asked questions
        </h2>
      </div>

      <div className="max-w-2xl mx-auto divide-y divide-border-subtle">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <div key={i} className="py-4 md:py-5">
              <button
                onClick={() => toggle(i)}
                className="flex items-center justify-between w-full text-left gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-body text-base md:text-lg text-text-primary font-medium">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                </motion.div>
              </button>

              <div className="overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? (contentRefs.current[i]?.scrollHeight ?? 'auto') : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div
                    ref={(el) => { contentRefs.current[i] = el; }}
                    className="pt-3 pb-1"
                  >
                    <p className="font-body text-sm md:text-base text-text-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
