import { useEffect } from 'react'
import { GetInvolvedSection } from '@/components/public/GetInvolvedSection'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { footerContent } from '@/fixtures/homePageFixtures'
import { getInvolvedContent } from '@/lib/getInvolvedContent'
import { isSectionVisible } from '@/lib/homepageSections'

export function GetInvolvedPage() {
  const { settingsMap } = useAllSettings()
  const content = getInvolvedContent(settingsMap)

  useEffect(() => {
    document.title = `${content.title} | ${settingsMap.site_name ?? 'Khelgram Foundation'}`
  }, [content.title, settingsMap.site_name])

  return (
    <div className="get-involved-page">
      <SiteHeader siteName={settingsMap.site_name ?? 'Khelgram Foundation'} />
      <main style={{ minHeight: '60vh' }}>
        <GetInvolvedSection content={content} />
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
