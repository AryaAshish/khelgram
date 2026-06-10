export type SiteHeaderProps = {
  siteName: string
}

export function SiteHeader({ siteName }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container-custom">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-text">{siteName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
