import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { AboutSection } from '@/components/public/AboutSection'
import { ContactSection } from '@/components/public/ContactSection'
import { CountdownSection } from '@/components/public/CountdownSection'
import { EventsSection } from '@/components/public/EventsSection'
import { GallerySection } from '@/components/public/GallerySection'
import { HeroSection } from '@/components/public/HeroSection'
import { RegistrationForm } from '@/components/public/RegistrationForm'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { useGames } from '@/hooks/useGames'
import { useGallery } from '@/hooks/useGallery'
import { useImpactStats } from '@/hooks/useImpactStats'
import { useCreateRegistration, useRegistrationCount } from '@/hooks/useRegistration'
import { useAllSettings } from '@/hooks/useSiteSettings'
import {
  aboutContent,
  contactContent,
  countdownTarget,
  footerContent,
  heroContent,
} from '@/fixtures/homePageFixtures'
import type { RegistrationInput } from '@/types/app.types'

export function HomePage() {
  const { games, isLoading: gamesLoading } = useGames()
  const { images: galleryImages, isLoading: galleryLoading } = useGallery()
  const { impactStats, isLoading: statsLoading } = useImpactStats()
  const { settingsMap } = useAllSettings()
  const { data: registrationCount } = useRegistrationCount()
  const createRegistration = useCreateRegistration()

  const eventStatus = settingsMap.event_status ?? 'registration_open'
  const isPreRegistration = eventStatus === 'pre_registration'
  const eventDate = isPreRegistration
    ? 'To Be Announced'
    : (settingsMap.hero_event_date ?? settingsMap.event_date ?? heroContent.eventDate)
  const countdownDate = isPreRegistration ? null : (settingsMap.event_date ?? countdownTarget)

  const scrollToId = (id: string) => {
    const element = document.getElementById(id)
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleRegistrationSubmit = (input: RegistrationInput) => {
    createRegistration.mutate(input)
  }

  const eventOptions = games.map((game) => game.name)

  return (
    <div className="homepage">
      <SiteHeader siteName={settingsMap.site_name ?? 'Khelgram Foundation'} />
      <main>
        <SectionErrorBoundary title="Hero">
          <HeroSection
            title={settingsMap.hero_title ?? heroContent.title}
            subtitle={settingsMap.hero_subtitle ?? heroContent.subtitle}
            primaryCta={settingsMap.hero_primary_cta ?? heroContent.primaryCta}
            secondaryCta={settingsMap.hero_secondary_cta ?? heroContent.secondaryCta}
            eventDateLabel={settingsMap.hero_event_date_label ?? heroContent.eventDateLabel}
            eventDate={eventDate}
            registrationCount={registrationCount}
            onPrimaryClick={() => scrollToId('register')}
            onSecondaryClick={() => scrollToId('events')}
          />
        </SectionErrorBoundary>
        <CountdownSection targetDate={countdownDate} />
        <SectionErrorBoundary title="About Khelgram Foundation">
          {statsLoading ? (
            <SectionSkeleton title="About Khelgram Foundation" />
          ) : (
            <AboutSection content={aboutContent} impactStats={impactStats} />
          )}
        </SectionErrorBoundary>
        <SectionErrorBoundary title="Festival Events">
          {gamesLoading ? (
            <SectionSkeleton title="Festival Events" />
          ) : (
            <EventsSection games={games} />
          )}
        </SectionErrorBoundary>
        <SectionErrorBoundary title="Gallery">
          {galleryLoading ? (
            <SectionSkeleton title="Gallery" />
          ) : (
            <GallerySection images={galleryImages} />
          )}
        </SectionErrorBoundary>
        <SectionErrorBoundary title="Register Your Child">
          <RegistrationForm
            eventOptions={eventOptions}
            isPreRegistration={isPreRegistration}
            isSubmitting={createRegistration.isPending}
            onSubmit={handleRegistrationSubmit}
          />
        </SectionErrorBoundary>
        <ContactSection
          address={contactContent.address}
          phone={contactContent.phone}
          email={contactContent.email}
        />
      </main>
      <SiteFooter
        description={settingsMap.footer_description ?? footerContent.description}
        copyright={settingsMap.footer_copyright ?? footerContent.copyright}
      />
    </div>
  )
}
