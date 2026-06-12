import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { CountdownSection } from '@/components/public/CountdownSection'
import { EventRegisterCta } from '@/components/public/EventRegisterCta'
import { EventsSection } from '@/components/public/EventsSection'
import { FAQAccordion } from '@/components/public/FAQAccordion'
import { GallerySection } from '@/components/public/GallerySection'
import { HeroSection } from '@/components/public/HeroSection'
import { PreRegBanner } from '@/components/public/PreRegBanner'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { useFaq } from '@/hooks/useFaq'
import { useGames } from '@/hooks/useGames'
import { useGallery } from '@/hooks/useGallery'
import { useRegistrationCount } from '@/hooks/useRegistration'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { heroContent } from '@/fixtures/homePageFixtures'
import { isSectionVisible, khel2026Sections, sectionTitle } from '@/lib/khel2026Sections'

export function EventLandingSections() {
  const navigate = useNavigate()
  const { games, isLoading: gamesLoading } = useGames()
  const { images: galleryImages, isLoading: galleryLoading } = useGallery()
  const { items: faqItems, isLoading: faqLoading } = useFaq()
  const { settingsMap, countdownTarget } = useAllSettings()
  const { data: registrationCount } = useRegistrationCount()

  const eventStatus = settingsMap.event_status ?? 'registration_open'
  const isPreRegistration = eventStatus === 'pre_registration'
  const eventDate = isPreRegistration
    ? (settingsMap.khel2026_countdown_tba_text ?? 'To Be Announced')
    : (settingsMap.khel2026_hero_event_date ?? settingsMap.event_date ?? heroContent.eventDate)
  const countdownDate = isPreRegistration ? null : countdownTarget

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
            onPrimaryClick={() => navigate('/register')}
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
        <EventRegisterCta
          title={titles.registerCta}
          description={settingsMap.khel2026_register_pre_message}
          buttonLabel={settingsMap.khel2026_register_submit_label}
        />
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
