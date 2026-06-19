import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { TrustSection } from '@/components/landing/TrustSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <FeaturesGrid />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
