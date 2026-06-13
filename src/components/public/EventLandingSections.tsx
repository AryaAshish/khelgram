import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { CountdownSection } from '@/components/public/CountdownSection'
import { EventsSection } from '@/components/public/EventsSection'
import { FAQAccordion } from '@/components/public/FAQAccordion'
import { GallerySection } from '@/components/public/GallerySection'
import { HeroSection } from '@/components/public/HeroSection'
import { PreRegBanner } from '@/components/public/PreRegBanner'
import { RegistrationFormWithI18n } from '@/components/public/RegistrationForm'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { useFaq } from '@/hooks/useFaq'
import { useGames } from '@/hooks/useGames'
import { useGallery } from '@/hooks/useGallery'
import { useCreateRegistration, useRegistrationCount } from '@/hooks/useRegistration'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { heroContent } from '@/fixtures/homePageFixtures'
import { isSectionVisible, khel2026Sections, sectionTitle } from '@/lib/khel2026Sections'
import { resolveHeroVisual } from '@/lib/heroVisuals'
import { getRegistrationShareUrl } from '@/lib/shareUrl'
import type { RegistrationInput } from '@/types/app.types'

export function EventLandingSections() {
  const { games, isLoading: gamesLoading } = useGames()
  const { images: galleryImages, isLoading: galleryLoading } = useGallery()
  const { items: faqItems, isLoading: faqLoading } = useFaq()
  const { settingsMap, countdownTarget } = useAllSettings()
  const { data: registrationCount } = useRegistrationCount()

  const eventStatus = settingsMap.event_status ?? 'registration_open'
  const isPreRegistration = eventStatus === 'pre_registration'
  const registrationOpen = eventStatus === 'registration_open' || eventStatus === 'pre_registration'
  const createRegistration = useCreateRegistration(eventStatus)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const shareUrl = useMemo(() => getRegistrationShareUrl(), [])
  const registerTitle = settingsMap.khel2026_register_title
  const registerPreMessage = settingsMap.khel2026_register_pre_message
  const registerSubmitLabel = settingsMap.khel2026_register_submit_label
  const eventOptions = games.map((game) => game.name)
  const eventDate = isPreRegistration
    ? (settingsMap.khel2026_countdown_tba_text ?? 'To Be Announced')
    : (settingsMap.khel2026_hero_event_date ?? settingsMap.event_date ?? heroContent.eventDate)
  const countdownDate = isPreRegistration ? null : countdownTarget
  const festivalHeroVisual = resolveHeroVisual(settingsMap, 'khel2026_hero_image')

  const show = (visibleKey: string) => isSectionVisible(settingsMap, visibleKey)

  const titles = useMemo(
    () =>
      khel2026Sections.reduce<Record<string, string>>((acc, section) => {
        if (section.titleKey && section.defaultTitle) {
          acc[section.id] = sectionTitle(settingsMap, section.titleKey, section.defaultTitle)
        }
        return acc
      }, {}),
    [settingsMap],
  )

  const scrollToId = (id: string) => {
    const element = document.getElementById(id)
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleRegistrationSubmit = (input: RegistrationInput) => {
    createRegistration.mutate(input, {
      onSuccess: () => {
        setShowSuccessBanner(true)
      },
    })
  }

  return (
    <>
      {isPreRegistration ? (
        <PreRegBanner message={settingsMap.khel2026_register_pre_message} />
      ) : null}
      {show('khel2026_hero_visible') ? (
        <SectionErrorBoundary title="Khel 2026 Hero">
          <HeroSection
            title={settingsMap.khel2026_hero_title}
            subtitle={settingsMap.khel2026_hero_subtitle}
            primaryCta={settingsMap.khel2026_hero_primary_cta}
            secondaryCta={settingsMap.khel2026_hero_secondary_cta}
            eventDateLabel={settingsMap.khel2026_hero_event_date_label}
            eventDate={eventDate}
            registrationCount={registrationCount}
            imageUrl={festivalHeroVisual.url}
            imageAlt={festivalHeroVisual.alt}
            onPrimaryClick={() => scrollToId('register-form')}
            onSecondaryClick={() => scrollToId('events')}
          />
        </SectionErrorBoundary>
      ) : null}
      {show('khel2026_countdown_visible') ? (
        <CountdownSection
          title={settingsMap.khel2026_countdown_title}
          targetDate={countdownDate}
          toBeAnnouncedText={settingsMap.khel2026_countdown_tba_text}
        />
      ) : null}
      {show('khel2026_events_visible') ? (
        <SectionErrorBoundary title={titles.events}>
          {gamesLoading ? (
            <SectionSkeleton title={titles.events} />
          ) : (
            <EventsSection title={titles.events} games={games} />
          )}
        </SectionErrorBoundary>
      ) : null}
      {show('khel2026_gallery_visible') ? (
        <SectionErrorBoundary title={titles.gallery}>
          {galleryLoading ? (
            <SectionSkeleton title={titles.gallery} />
          ) : (
            <GallerySection title={titles.gallery} images={galleryImages} />
          )}
        </SectionErrorBoundary>
      ) : null}
      {show('khel2026_register_cta_visible') ? (
        <SectionErrorBoundary title={titles.registerCta}>
          {!registrationOpen ? (
            <section
              id="register-form"
              style={{ padding: '4rem 1.5rem', textAlign: 'center' }}
              aria-labelledby="register-unavailable-heading"
            >
              <h2
                id="register-unavailable-heading"
                style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}
              >
                Registration unavailable
              </h2>
              <p style={{ color: '#6b7280' }}>
                Registration is not open on the public site right now. Please check back later.
              </p>
            </section>
          ) : gamesLoading ? (
            <SectionSkeleton title={titles.registerCta} />
          ) : (
            <RegistrationFormWithI18n
              title={registerTitle}
              eventOptions={eventOptions}
              games={games}
              preRegistrationMessage={registerPreMessage}
              submitLabel={registerSubmitLabel}
              isPreRegistration={isPreRegistration}
              isSubmitting={createRegistration.isPending}
              shareUrl={shareUrl}
              showSuccessBanner={showSuccessBanner}
              onSubmit={handleRegistrationSubmit}
            />
          )}
        </SectionErrorBoundary>
      ) : null}
      {show('khel2026_faq_visible') ? (
        <SectionErrorBoundary title={titles.faq}>
          {faqLoading ? (
            <SectionSkeleton title={titles.faq} />
          ) : (
            <FAQAccordion title={titles.faq} items={faqItems} />
          )}
        </SectionErrorBoundary>
      ) : null}
      <div className="container-custom" style={{ paddingBottom: '2rem' }}>
        <Link to="/" style={{ color: '#6b7280', fontWeight: 600 }}>
          ← Back to Khelgram Foundation homepage
        </Link>
      </div>
    </>
  )
}
