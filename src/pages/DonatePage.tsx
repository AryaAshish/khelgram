import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DonateInterestForm } from '@/components/public/DonateInterestForm'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { footerContent } from '@/fixtures/homePageFixtures'
import { getSupportContent } from '@/lib/supportContent'
import { isSectionVisible } from '@/lib/orgHomeSections'

export function DonatePage() {
  const { settingsMap } = useAllSettings()
  const supportContent = getSupportContent(settingsMap)
  const siteName = settingsMap.site_name ?? 'Khelgram Foundation'

  useEffect(() => {
    document.title = `Donate | ${siteName}`
  }, [siteName])

  return (
    <div className="donate-page">
      <SiteHeader siteName={siteName} />
      <main style={{ minHeight: '60vh' }}>
        <SectionShell variant="default">
          <div className="container-custom">
            <SectionHeading
              eyebrow="Support grassroots sports"
              title={supportContent.title}
              subtitle={supportContent.description}
            />
            <p style={{ margin: '0 0 1rem', color: 'var(--color-text-muted)' }}>
              We do not collect payments on this page. Share your contact details and our team will
              call or email you to complete your contribution.
            </p>
            <Link to="/" style={{ color: '#6b7280', fontWeight: 600 }}>
              ← Back to homepage
            </Link>
          </div>
        </SectionShell>
        <DonateInterestForm />
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
