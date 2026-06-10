import { SiteHeader } from '@/components/public/SiteHeader'
import { useSiteSetting } from '@/hooks/useSiteSettings'

export function HomePage() {
  const { value: siteName, isLoading, isError } = useSiteSetting('site_name', 'Khelgram Foundation')

  return (
    <div className="homepage">
      <SiteHeader siteName={isLoading ? 'Loading...' : siteName} />
      <main className="container-custom" style={{ paddingTop: '6rem' }}>
        {isError ? <p>Unable to load site settings. Showing default content.</p> : null}
        <p>Khelgram Foundation — Children&apos;s Sports Festival 2026</p>
      </main>
    </div>
  )
}
