import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export type StickyMobileCtaProps = {
  programsHref?: string
  donateHref?: string
}

export function StickyMobileCta({
  programsHref = '#programs',
  donateHref = '#support',
}: StickyMobileCtaProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) {
    return null
  }

  const donateLink = donateHref.startsWith('http') ? (
    <a
      href={donateHref}
      className="sticky-mobile-cta__button sticky-mobile-cta__button--donate"
      target="_blank"
      rel="noreferrer"
    >
      Donate
    </a>
  ) : donateHref.startsWith('/') && !donateHref.includes('#') ? (
    <Link to={donateHref} className="sticky-mobile-cta__button sticky-mobile-cta__button--donate">
      Donate
    </Link>
  ) : (
    <a href={donateHref} className="sticky-mobile-cta__button sticky-mobile-cta__button--donate">
      Donate
    </a>
  )

  return (
    <div className="sticky-mobile-cta" role="navigation" aria-label="Quick actions">
      <a href={programsHref} className="sticky-mobile-cta__button">
        Our Programs
      </a>
      {donateLink}
      <Link
        to="/khel2026"
        className="sticky-mobile-cta__button sticky-mobile-cta__button--festival"
      >
        Khel 2026
      </Link>
    </div>
  )
}
