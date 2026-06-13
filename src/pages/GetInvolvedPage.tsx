import { useEffect } from 'react'
import { GetInvolvedSection } from '@/components/public/GetInvolvedSection'
import { GetInvolvedTabs } from '@/components/public/GetInvolvedTabs'
import { LeadInquiryForm } from '@/components/public/LeadInquiryForm'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { footerContent } from '@/fixtures/homePageFixtures'
import { getInvolvedContent } from '@/lib/getInvolvedContent'
import { isSectionVisible } from '@/lib/orgHomeSections'
import { SupportSection } from '@/components/public/SupportSection'
import { getSupportContent } from '@/lib/supportContent'

export function GetInvolvedPage() {
  const { settingsMap } = useAllSettings()
  const content = getInvolvedContent(settingsMap)
  const supportContent = getSupportContent(settingsMap)
  const partnersCard = content.cards.find((card) => card.id === 'partners')
  const volunteersCard = content.cards.find((card) => card.id === 'volunteers')

  useEffect(() => {
    document.title = `${content.title} | ${settingsMap.site_name ?? 'Khelgram Foundation'}`
  }, [content.title, settingsMap.site_name])

  return (
    <div className="get-involved-page">
      <SiteHeader siteName={settingsMap.site_name ?? 'Khelgram Foundation'} />
      <main style={{ minHeight: '60vh' }}>
        <section className="get-involved-page__intro">
          <div className="container-custom">
            <GetInvolvedTabs />
          </div>
        </section>
        <GetInvolvedSection content={content} />
        <LeadInquiryForm
          type="partner"
          title={partnersCard?.title ?? 'Partners'}
          description={
            partnersCard?.description ??
            'Tell us how your organization can support grassroots sports programs.'
          }
          showOrganization
        />
        <LeadInquiryForm
          type="volunteer"
          title={volunteersCard?.title ?? 'Volunteers'}
          description={
            volunteersCard?.description ??
            'Share your availability and interests for upcoming events and camps.'
          }
        />
        <SupportSection content={supportContent} />
      </main>
      {isSectionVisible(settingsMap, 'footer_visible') ? (
        <SiteFooter
          description={settingsMap.footer_description ?? footerContent.description}
          copyright={settingsMap.footer_copyright ?? footerContent.copyright}
        />
      ) : null}
    </div>
  )
}
