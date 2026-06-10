import { AboutSection } from '@/components/public/AboutSection'
import { ContactSection } from '@/components/public/ContactSection'
import { CountdownSection } from '@/components/public/CountdownSection'
import { EventsSection } from '@/components/public/EventsSection'
import { GallerySection } from '@/components/public/GallerySection'
import { HeroSection } from '@/components/public/HeroSection'
import { RegistrationForm } from '@/components/public/RegistrationForm'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import {
  aboutContent,
  contactContent,
  countdownTarget,
  footerContent,
  galleryImages,
  games,
  heroContent,
  impactStats,
} from '@/fixtures/homePageFixtures'
import type { RegistrationInput } from '@/types/app.types'

export function HomePage() {
  const scrollToId = (id: string) => {
    const element = document.getElementById(id)
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleRegistrationSubmit = (input: RegistrationInput) => {
    void input
  }

  return (
    <div className="homepage">
      <SiteHeader siteName="Khelgram Foundation" />
      <main>
        <HeroSection
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          primaryCta={heroContent.primaryCta}
          secondaryCta={heroContent.secondaryCta}
          eventDateLabel={heroContent.eventDateLabel}
          eventDate={heroContent.eventDate}
          onPrimaryClick={() => scrollToId('register')}
          onSecondaryClick={() => scrollToId('events')}
        />
        <CountdownSection targetDate={countdownTarget} />
        <AboutSection content={aboutContent} impactStats={impactStats} />
        <EventsSection games={games} />
        <GallerySection images={galleryImages} />
        <RegistrationForm
          eventOptions={games.map((game) => game.name)}
          onSubmit={handleRegistrationSubmit}
        />
        <ContactSection
          address={contactContent.address}
          phone={contactContent.phone}
          email={contactContent.email}
        />
      </main>
      <SiteFooter description={footerContent.description} copyright={footerContent.copyright} />
    </div>
  )
}
