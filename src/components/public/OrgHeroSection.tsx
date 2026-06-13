import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SectionShell } from '@/components/public/primitives/SectionShell'
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
    <SectionShell id="hero" variant="default" heroOffset>
      <div className="container-custom">
        <h1 className="heading-display">{title}</h1>
        <p
          style={{
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-subtle)',
            maxWidth: '800px',
            marginBottom: '1.5rem',
            lineHeight: 'var(--leading-relaxed)',
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
    </SectionShell>
  )
}
