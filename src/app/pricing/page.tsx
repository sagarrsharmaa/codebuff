import { PricingSection } from '@/components/sections/PricingSection';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background-base">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,92,252,0.06), transparent 70%)',
          }}
        />
      </div>

      {/* Back link */}
      <div className="relative z-10 max-w-5xl mx-auto px-gutter md:px-gutter-lg pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <PricingSection />
    </div>
  );
}
