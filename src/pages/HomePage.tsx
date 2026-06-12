import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { AboutSection } from '@/components/public/AboutSection'
import { ContactSection } from '@/components/public/ContactSection'
import { ContributorsGrid } from '@/components/public/ContributorsGrid'
import { ImpactStatsBar } from '@/components/public/ImpactStatsBar'
import { OrgHeroSection } from '@/components/public/OrgHeroSection'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { SponsorWall } from '@/components/public/SponsorWall'
import { TeamGrid } from '@/components/public/TeamGrid'
import { TestimonialCarousel } from '@/components/public/TestimonialCarousel'
import { useContributors } from '@/hooks/useContributors'
import { useImpactStats } from '@/hooks/useImpactStats'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { useSponsors } from '@/hooks/useSponsors'
import { useTeam } from '@/hooks/useTeam'
import { useTestimonials } from '@/hooks/useTestimonials'
import { contactContent, footerContent } from '@/fixtures/homePageFixtures'
import { isSectionVisible, sectionTitle } from '@/lib/orgHomeSections'

const orgHeroDefaults = {
  title: 'Building sporting futures in rural India',
  subtitle:
    'Khelgram Foundation discovers and nurtures grassroots talent in villages and underserved communities through sports programs, training, and inclusive events.',
  primaryCta: 'Our impact',
  secondaryCta: 'Khel 2026',
}

export function HomePage() {
  const { impactStats, isLoading: statsLoading } = useImpactStats()
  const { members: teamMembers, isLoading: teamLoading } = useTeam()
  const { contributors, isLoading: contributorsLoading } = useContributors()
  const { sponsors, isLoading: sponsorsLoading } = useSponsors()
  const { testimonials, isLoading: testimonialsLoading } = useTestimonials()
  const { settingsMap, aboutContent } = useAllSettings()

  const show = (visibleKey: string) => isSectionVisible(settingsMap, visibleKey)

  const scrollToId = (id: string) => {
    const element = document.getElementById(id)
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const aboutTitle = sectionTitle(settingsMap, 'about_title', 'About Khelgram Foundation')
  const impactTitle = sectionTitle(settingsMap, 'impact_title', 'Impact')
  const teamTitle = sectionTitle(settingsMap, 'team_title', 'Our Team')
  const contributorsTitle = sectionTitle(settingsMap, 'contributors_title', 'Contributors')
  const sponsorsTitle = sectionTitle(settingsMap, 'sponsors_title', 'Sponsors')
  const testimonialsTitle = sectionTitle(settingsMap, 'testimonials_title', 'Testimonials')
  const contactTitle = sectionTitle(settingsMap, 'contact_title', 'Contact')

  const orgHeroTitle = sectionTitle(settingsMap, 'org_hero_title', orgHeroDefaults.title)
  const orgHeroSubtitle = settingsMap.org_hero_subtitle ?? orgHeroDefaults.subtitle
  const orgHeroPrimaryCta = settingsMap.org_hero_primary_cta ?? orgHeroDefaults.primaryCta
  const orgHeroSecondaryCta = settingsMap.org_hero_secondary_cta ?? orgHeroDefaults.secondaryCta

  return (
    <div className="homepage">
      <SiteHeader siteName={settingsMap.site_name ?? 'Khelgram Foundation'} />
      <main>
        {show('org_hero_visible') ? (
          <SectionErrorBoundary title="Hero">
            <OrgHeroSection
              title={orgHeroTitle}
              subtitle={orgHeroSubtitle}
              primaryCta={orgHeroPrimaryCta}
              secondaryCta={orgHeroSecondaryCta}
              onPrimaryClick={() => scrollToId('impact')}
            />
          </SectionErrorBoundary>
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
        {show('testimonials_visible') ? (
          <SectionErrorBoundary title={testimonialsTitle}>
            {testimonialsLoading ? (
              <SectionSkeleton title={testimonialsTitle} />
            ) : (
              <TestimonialCarousel title={testimonialsTitle} testimonials={testimonials} />
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
