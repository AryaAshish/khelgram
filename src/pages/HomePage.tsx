import { useTranslation } from 'react-i18next'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { AboutSection } from '@/components/public/AboutSection'
import { ContactSection } from '@/components/public/ContactSection'
import { ProgramsSection } from '@/components/public/ProgramsSection'
import { ContributorsGrid } from '@/components/public/ContributorsGrid'
import { ImpactStatsBar } from '@/components/public/ImpactStatsBar'
import { OrgHeroSection } from '@/components/public/OrgHeroSection'
import { SectionSkeleton } from '@/components/public/SectionSkeleton'
import { StickyMobileCta } from '@/components/public/StickyMobileCta'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { SponsorWall } from '@/components/public/SponsorWall'
import { TeamGrid } from '@/components/public/TeamGrid'
import { TestimonialCarousel } from '@/components/public/TestimonialCarousel'
import { useContributors } from '@/hooks/useContributors'
import { useImpactStats } from '@/hooks/useImpactStats'
import { usePrograms } from '@/hooks/usePrograms'
import { SuccessStoriesSection } from '@/components/public/SuccessStoriesSection'
import { useSuccessStories } from '@/hooks/useSuccessStories'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { useSponsors } from '@/hooks/useSponsors'
import { useTeam } from '@/hooks/useTeam'
import { useTestimonials } from '@/hooks/useTestimonials'
import { GetInvolvedSection } from '@/components/public/GetInvolvedSection'
import { contactContent, footerContent } from '@/fixtures/homePageFixtures'
import { SupportSection } from '@/components/public/SupportSection'
import { ReachSection } from '@/components/public/ReachSection'
import { getSupportContent } from '@/lib/supportContent'
import { parseOrgRegions } from '@/lib/orgRegions'
import { getInvolvedContent } from '@/lib/getInvolvedContent'
import { localizedSetting } from '@/lib/localizedSetting'
import { resolveHeroVisual } from '@/lib/heroVisuals'
import { isSectionVisible, sectionTitle } from '@/lib/orgHomeSections'

const orgHeroDefaults = {
  title: 'Building sporting futures in rural India',
  subtitle:
    'Khelgram Foundation discovers and nurtures grassroots talent in villages and underserved communities through sports programs, training, and inclusive events.',
  primaryCta: 'Our impact',
  secondaryCta: 'Khel 2026',
}

export function HomePage() {
  const { i18n } = useTranslation()
  const { impactStats, isLoading: statsLoading } = useImpactStats('org')
  const { programs, isLoading: programsLoading } = usePrograms()
  const { stories, isLoading: storiesLoading } = useSuccessStories()
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

  const aboutTitle = sectionTitle(settingsMap, 'org_about_title', 'About Khelgram Foundation')
  const programsTitle = sectionTitle(settingsMap, 'programs_title', 'Our Programs')
  const impactTitle = sectionTitle(settingsMap, 'org_impact_title', 'Impact')
  const successStoriesTitle = sectionTitle(settingsMap, 'success_stories_title', 'Success Stories')
  const impactSubtitle = settingsMap.org_impact_subtitle
  const teamTitle = sectionTitle(settingsMap, 'team_title', 'Our Team')
  const contributorsTitle = sectionTitle(settingsMap, 'contributors_title', 'Contributors')
  const sponsorsTitle = sectionTitle(settingsMap, 'sponsors_title', 'Sponsors')
  const testimonialsTitle = sectionTitle(settingsMap, 'testimonials_title', 'Testimonials')
  const contactTitle = sectionTitle(settingsMap, 'contact_title', 'Contact')
  const getInvolvedTitle = sectionTitle(settingsMap, 'org_get_involved_title', 'Get Involved')
  const getInvolved = getInvolvedContent(settingsMap)
  const supportContent = getSupportContent(settingsMap)
  const orgHeroVisual = resolveHeroVisual(settingsMap, 'org_hero_image')
  const aboutVisual = resolveHeroVisual(settingsMap, 'org_about_image')
  const reachTitle = sectionTitle(settingsMap, 'reach_title', 'Where We Work')
  const regions = parseOrgRegions(settingsMap.org_regions)

  const orgHeroTitle = localizedSetting(
    settingsMap,
    'org_hero_title',
    orgHeroDefaults.title,
    i18n.language,
  )
  const orgHeroSubtitle = localizedSetting(
    settingsMap,
    'org_hero_subtitle',
    orgHeroDefaults.subtitle,
    i18n.language,
  )
  const orgHeroPrimaryCta = settingsMap.org_hero_primary_cta
    ? localizedSetting(
        settingsMap,
        'org_hero_primary_cta',
        orgHeroDefaults.primaryCta,
        i18n.language,
      )
    : undefined
  const orgHeroSecondaryCta = settingsMap.org_hero_secondary_cta
    ? localizedSetting(
        settingsMap,
        'org_hero_secondary_cta',
        orgHeroDefaults.secondaryCta,
        i18n.language,
      )
    : undefined

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
              imageUrl={orgHeroVisual.url}
              imageAlt={orgHeroVisual.alt}
              onPrimaryClick={() => scrollToId('impact')}
            />
          </SectionErrorBoundary>
        ) : null}
        {show('about_visible') ? (
          <SectionErrorBoundary title={aboutTitle}>
            <AboutSection
              title={aboutTitle}
              content={aboutContent}
              imageUrl={aboutVisual.url}
              imageAlt={aboutVisual.alt}
            />
          </SectionErrorBoundary>
        ) : null}
        {show('programs_visible') ? (
          <SectionErrorBoundary title={programsTitle}>
            {programsLoading ? (
              <SectionSkeleton title={programsTitle} />
            ) : (
              <ProgramsSection title={programsTitle} programs={programs} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('get_involved_visible') ? (
          <SectionErrorBoundary title={getInvolvedTitle}>
            <GetInvolvedSection content={getInvolved} showExpandedLink />
          </SectionErrorBoundary>
        ) : null}
        {show('impact_visible') ? (
          <SectionErrorBoundary title={impactTitle}>
            {statsLoading ? (
              <SectionSkeleton title={impactTitle} />
            ) : (
              <ImpactStatsBar title={impactTitle} subtitle={impactSubtitle} stats={impactStats} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('success_stories_visible') ? (
          <SectionErrorBoundary title={successStoriesTitle}>
            {storiesLoading ? (
              <SectionSkeleton title={successStoriesTitle} />
            ) : (
              <SuccessStoriesSection title={successStoriesTitle} stories={stories} />
            )}
          </SectionErrorBoundary>
        ) : null}
        {show('support_visible') ? (
          <SectionErrorBoundary title={supportContent.title}>
            <SupportSection content={supportContent} />
          </SectionErrorBoundary>
        ) : null}
        {show('reach_visible') ? (
          <SectionErrorBoundary title={reachTitle}>
            <ReachSection title={reachTitle} regions={regions} />
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
      <StickyMobileCta donateHref={supportContent.donateUrl} />
      {show('footer_visible') ? (
        <SiteFooter
          description={settingsMap.footer_description ?? footerContent.description}
          copyright={settingsMap.footer_copyright ?? footerContent.copyright}
        />
      ) : null}
    </div>
  )
}
