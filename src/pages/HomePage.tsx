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
import { contactContent, footerContent, heroContent } from '@/fixtures/homePageFixtures'
import type { RegistrationInput } from '@/types/app.types'

export function HomePage() {
  const { games, isLoading: gamesLoading } = useGames()
  const { images: galleryImages, isLoading: galleryLoading } = useGallery()
  const { impactStats, isLoading: statsLoading } = useImpactStats()
  const { settingsMap, aboutContent, countdownTarget } = useAllSettings()
  const { data: registrationCount } = useRegistrationCount()
  const createRegistration = useCreateRegistration()

  const eventStatus = settingsMap.event_status ?? 'registration_open'
  const isPreRegistration = eventStatus === 'pre_registration'
  const eventDate = isPreRegistration
    ? (settingsMap.countdown_tba_text ?? 'To Be Announced')
    : (settingsMap.hero_event_date ?? settingsMap.event_date ?? heroContent.eventDate)
  const countdownDate = isPreRegistration ? null : countdownTarget

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
        <CountdownSection
          title={settingsMap.countdown_title ?? 'Countdown to Festival Day'}
          targetDate={countdownDate}
          toBeAnnouncedText={settingsMap.countdown_tba_text ?? 'To Be Announced'}
        />
        <SectionErrorBoundary title={settingsMap.about_title ?? 'About Khelgram Foundation'}>
          {statsLoading ? (
            <SectionSkeleton title={settingsMap.about_title ?? 'About Khelgram Foundation'} />
          ) : (
            <AboutSection
              title={settingsMap.about_title ?? 'About Khelgram Foundation'}
              content={aboutContent}
              impactStats={impactStats}
            />
          )}
        </SectionErrorBoundary>
        <SectionErrorBoundary title={settingsMap.events_title ?? 'Festival Events'}>
          {gamesLoading ? (
            <SectionSkeleton title={settingsMap.events_title ?? 'Festival Events'} />
          ) : (
            <EventsSection title={settingsMap.events_title ?? 'Festival Events'} games={games} />
          )}
        </SectionErrorBoundary>
        <SectionErrorBoundary title={settingsMap.gallery_title ?? 'Gallery'}>
          {galleryLoading ? (
            <SectionSkeleton title={settingsMap.gallery_title ?? 'Gallery'} />
          ) : (
            <GallerySection title={settingsMap.gallery_title ?? 'Gallery'} images={galleryImages} />
          )}
        </SectionErrorBoundary>
        <SectionErrorBoundary title={settingsMap.register_title ?? 'Register Your Child'}>
          <RegistrationForm
            title={settingsMap.register_title ?? 'Register Your Child'}
            eventOptions={eventOptions}
            preRegistrationMessage={
              settingsMap.register_pre_message ??
              "Pre-registration open — we'll confirm dates by email"
            }
            submitLabel={settingsMap.register_submit_label ?? 'Submit Registration'}
            isPreRegistration={isPreRegistration}
            isSubmitting={createRegistration.isPending}
            onSubmit={handleRegistrationSubmit}
          />
        </SectionErrorBoundary>
        <ContactSection
          title={settingsMap.contact_title ?? 'Contact'}
          address={settingsMap.contact_address ?? contactContent.address}
          phone={settingsMap.contact_phone ?? contactContent.phone}
          email={settingsMap.contact_email ?? contactContent.email}
        />
      </main>
      <SiteFooter
        description={settingsMap.footer_description ?? footerContent.description}
        copyright={settingsMap.footer_copyright ?? footerContent.copyright}
      />
    </div>
  )
}
