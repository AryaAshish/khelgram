import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export type OrgHeroSectionProps = {
  title: string
  subtitle: string
  primaryCta?: string
  secondaryCta?: string
  onPrimaryClick: () => void
}

export function OrgHeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  onPrimaryClick,
}: OrgHeroSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="org-hero-section" id="hero" style={{ padding: '9rem 0 4rem' }}>
      <div className="container-custom">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: '#374151',
            maxWidth: '800px',
            marginBottom: '1.5rem',
          }}
        >
          {subtitle}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button onClick={onPrimaryClick}>{primaryCta || t('hero.primaryCta')}</Button>
          <Link to="/khel2026">
            <Button variant="outline">{secondaryCta || t('hero.secondaryCta')}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
