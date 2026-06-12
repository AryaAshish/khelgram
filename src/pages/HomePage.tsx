import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { AboutSection } from '@/components/public/AboutSection'
import { ContactSection } from '@/components/public/ContactSection'
import { ContributorsGrid } from '@/components/public/ContributorsGrid'
import { CountdownSection } from '@/components/public/CountdownSection'
import { EventsSection } from '@/components/public/EventsSection'
import { PreRegBanner } from '@/components/public/PreRegBanner'
import { FAQAccordion } from '@/components/public/FAQAccordion'
import { GallerySection } from '@/components/public/GallerySection'
import { HeroSection } from '@/components/public/HeroSection'
import { ImpactStatsBar } from '@/components/public/ImpactStatsBar'
import { RegistrationForm } from '@/components/public/RegistrationForm'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { SponsorWall } from '@/components/public/SponsorWall'
import { TeamGrid } from '@/components/public/TeamGrid'
import { TestimonialCarousel } from '@/components/public/TestimonialCarousel'
import { useContributors } from '@/hooks/useContributors'
import { useFaq } from '@/hooks/useFaq'
import { useGames } from '@/hooks/useGames'
import { useGallery } from '@/hooks/useGallery'
import { useImpactStats } from '@/hooks/useImpactStats'
import { useCreateRegistration, useRegistrationCount } from '@/hooks/useRegistration'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { useSponsors } from '@/hooks/useSponsors'
import { useTeam } from '@/hooks/useTeam'
import { useTestimonials } from '@/hooks/useTestimonials'
import { contactContent, footerContent, heroContent } from '@/fixtures/homePageFixtures'
import { isSectionVisible, sectionTitle } from '@/lib/homepageSections'
import type { RegistrationInput } from '@/types/app.types'

export function HomePage() {
  const { games, isLoading: gamesLoading } = useGames()
  const { images: galleryImages, isLoading: galleryLoading } = useGallery()
  const { impactStats, isLoading: statsLoading } = useImpactStats()
  const { members: teamMembers, isLoading: teamLoading } = useTeam()
  const { contributors, isLoading: contributorsLoading } = useContributors()
  const { sponsors, isLoading: sponsorsLoading } = useSponsors()
  const { testimonials, isLoading: testimonialsLoading } = useTestimonials()
  const { items: faqItems, isLoading: faqLoading } = useFaq()
  const { settingsMap, aboutContent, countdownTarget } = useAllSettings()
  const { data: registrationCount } = useRegistrationCount()
  const eventStatus = settingsMap.event_status ?? 'registration_open'
  const createRegistration = useCreateRegistration(eventStatus)
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
  const show = (visibleKey: string) => isSectionVisible(settingsMap, visibleKey)

  const aboutTitle = sectionTitle(settingsMap, 'about_title', 'About Khelgram Foundation')
  const impactTitle = sectionTitle(settingsMap, 'impact_title', 'Impact')
  const eventsTitle = sectionTitle(settingsMap, 'events_title', 'Festival Events')
  const teamTitle = sectionTitle(settingsMap, 'team_title', 'Our Team')
  const contributorsTitle = sectionTitle(settingsMap, 'contributors_title', 'Contributors')
  const sponsorsTitle = sectionTitle(settingsMap, 'sponsors_title', 'Sponsors')
  const galleryTitle = sectionTitle(settingsMap, 'gallery_title', 'Gallery')
  const testimonialsTitle = sectionTitle(settingsMap, 'testimonials_title', 'Testimonials')
  const registerTitle = sectionTitle(settingsMap, 'register_title', 'Register Your Child')
  const faqTitle = sectionTitle(settingsMap, 'faq_title', 'FAQ')
  const contactTitle = sectionTitle(settingsMap, 'contact_title', 'Contact')

  return (
    <div className="homepage">
      <SiteHeader siteName={settingsMap.site_name ?? 'Khelgram Foundation'} />
      {isPreRegistration ? (
        <PreRegBanner
          message={
            settingsMap.register_pre_message ??
            "Pre-registration open — we'll confirm dates by email"
          }
        />
      ) : null}
      <main>
        {show('hero_visible') ? (
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
        ) : null}
        {show('countdown_visible') ? (
          <CountdownSection
            title={settingsMap.countdown_title ?? 'Countdown to Festival Day'}
            targetDate={countdownDate}
            toBeAnnouncedText={settingsMap.countdown_tba_text ?? 'To Be Announced'}
          />
        ) : null}
        {show('about_visible') ? (
          <SectionErrorBoundary title={aboutTitle}>
            <AboutSection title={aboutTitle} content={aboutContent} />
          </SectionErrorBoundary>
        ) : null}
        {show('impact_visible') ? (
          <SectionErrorBoundary title={impactTitle}>
            {statsLoading ? (
              <SectionSkeleton title={impactTitle} />
            ) : (
              <ImpactStatsBar title={impactTitle} stats={impactStats} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('events_visible') ? (
          <SectionErrorBoundary title={eventsTitle}>
            {gamesLoading ? (
              <SectionSkeleton title={eventsTitle} />
            ) : (
              <EventsSection title={eventsTitle} games={games} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('team_visible') ? (
          <SectionErrorBoundary title={teamTitle}>
            {teamLoading ? (
              <SectionSkeleton title={teamTitle} />
            ) : (
              <TeamGrid title={teamTitle} members={teamMembers} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('contributors_visible') ? (
          <SectionErrorBoundary title={contributorsTitle}>
            {contributorsLoading ? (
              <SectionSkeleton title={contributorsTitle} />
            ) : (
              <ContributorsGrid title={contributorsTitle} contributors={contributors} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('sponsors_visible') ? (
          <SectionErrorBoundary title={sponsorsTitle}>
            {sponsorsLoading ? (
              <SectionSkeleton title={sponsorsTitle} />
            ) : (
              <SponsorWall title={sponsorsTitle} sponsors={sponsors} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('gallery_visible') ? (
          <SectionErrorBoundary title={galleryTitle}>
            {galleryLoading ? (
              <SectionSkeleton title={galleryTitle} />
            ) : (
              <GallerySection title={galleryTitle} images={galleryImages} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('testimonials_visible') ? (
          <SectionErrorBoundary title={testimonialsTitle}>
            {testimonialsLoading ? (
              <SectionSkeleton title={testimonialsTitle} />
            ) : (
              <TestimonialCarousel title={testimonialsTitle} testimonials={testimonials} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('register_visible') ? (
          <SectionErrorBoundary title={registerTitle}>
            <RegistrationForm
              title={registerTitle}
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
        ) : null}
        {show('faq_visible') ? (
          <SectionErrorBoundary title={faqTitle}>
            {faqLoading ? (
              <SectionSkeleton title={faqTitle} />
            ) : (
              <FAQAccordion title={faqTitle} items={faqItems} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('contact_visible') ? (
          <ContactSection
            title={contactTitle}
            address={settingsMap.contact_address ?? contactContent.address}
            phone={settingsMap.contact_phone ?? contactContent.phone}
            email={settingsMap.contact_email ?? contactContent.email}
          />
        ) : null}
      </main>
      {show('footer_visible') ? (
        <SiteFooter
          description={settingsMap.footer_description ?? footerContent.description}
          copyright={settingsMap.footer_copyright ?? footerContent.copyright}
        />
      ) : null}
    </div>
  )
}
