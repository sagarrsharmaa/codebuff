import { Hero } from '@/components/sections/Hero';
import { LogoMarquee } from '@/components/logos/LogoMarquee';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <LogoMarquee />
      <FeaturesSection />
      <TimelineSection />
      <StatsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
