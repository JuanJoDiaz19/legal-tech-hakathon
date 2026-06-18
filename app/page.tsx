import { SiteNav } from '@/components/site/SiteNav';
import { Hero } from '@/components/site/Hero';
import { PracticeAreas } from '@/components/site/PracticeAreas';
import { Team } from '@/components/site/Team';
import { Clients } from '@/components/site/Clients';
import { SiteFooter } from '@/components/site/SiteFooter';

export default function Home() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <Hero />
      <PracticeAreas />
      <Team />
      <Clients />
      <SiteFooter />
    </div>
  );
}
