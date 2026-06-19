import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { TrustSection } from '@/components/landing/TrustSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar isLoggedIn={!!user} />
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
