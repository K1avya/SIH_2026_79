import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { StatsBar } from '@/components/stats-bar'
import { AboutSection } from '@/components/about-section'
import { ResourcesSection } from '@/components/resources-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { CtaSection } from '@/components/cta-section'
import { SiteFooter } from '@/components/site-footer'
import { Starfield } from '@/components/starfield'

export default function HomePage() {
  return (
    <div
      className="quantum relative min-h-screen overflow-hidden"
      style={{ background: 'var(--q-bg)', color: 'var(--q-text)' }}
    >
      <Starfield className="pointer-events-none fixed inset-0 z-0" />

      <div className="relative z-10">
        <SiteHeader />
        <main>
          <HeroSection />
          <StatsBar />
          <AboutSection />
          <ResourcesSection />
          <TestimonialsSection />
          <CtaSection />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
