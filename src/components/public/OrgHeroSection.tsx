import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { Button } from '@/components/ui/button'
import { orgHeroEyebrow, visualAssets } from '@/fixtures/visualAssets'

export type OrgHeroSectionProps = {
  title: string
  subtitle: string
  primaryCta?: string
  secondaryCta?: string
  imageUrl?: string
  imageAlt?: string
  eyebrow?: string
  onPrimaryClick: () => void
}

export function OrgHeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  imageUrl = visualAssets.orgHero.url,
  imageAlt = visualAssets.orgHero.alt,
  eyebrow = orgHeroEyebrow,
  onPrimaryClick,
}: OrgHeroSectionProps) {
  const { t } = useTranslation()

  return (
    <SectionShell id="hero" variant="default" heroOffset className="org-hero-section">
      <div className="container-custom org-hero-grid">
        <div className="org-hero-copy">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} as="h1" />
          <div className="org-hero-actions">
            <Button onClick={onPrimaryClick}>{primaryCta || t('hero.primaryCta')}</Button>
            <Link to="/khel2026">
              <Button variant="outline">{secondaryCta || t('hero.secondaryCta')}</Button>
            </Link>
          </div>
        </div>
        <div className="org-hero-media">
          <img src={imageUrl} alt={imageAlt} className="org-hero-image" loading="eager" />
          <div className="org-hero-media-overlay" aria-hidden="true" />
        </div>
      </div>
    </SectionShell>
  )
}
