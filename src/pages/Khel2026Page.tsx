import { useEffect } from 'react'
import { EventLandingSections } from '@/components/public/EventLandingSections'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteHeader } from '@/components/public/SiteHeader'
import { useAllSettings } from '@/hooks/useSiteSettings'
import { footerContent } from '@/fixtures/homePageFixtures'
import { isSectionVisible } from '@/lib/homepageSections'

export function Khel2026Page() {
  const { settingsMap } = useAllSettings()

  useEffect(() => {
    document.title = `Khel 2026 | ${settingsMap.site_name ?? 'Khelgram Foundation'}`
  }, [settingsMap.site_name])

  return (
    <div className="khel2026-page">
      <SiteHeader siteName={settingsMap.site_name ?? 'Khelgram Foundation'} />
      <main>
        <EventLandingSections />
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
