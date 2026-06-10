import { Button } from '@/components/ui/button'

export type HeroSectionProps = {
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  eventDateLabel: string
  eventDate: string
  onPrimaryClick: () => void
  onSecondaryClick: () => void
}

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  eventDateLabel,
  eventDate,
  onPrimaryClick,
  onSecondaryClick,
}: HeroSectionProps) {
  return (
    <section className="hero-section" id="hero" style={{ padding: '9rem 0 4rem' }}>
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
        <p style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
          {eventDateLabel}: {eventDate}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button onClick={onPrimaryClick}>{primaryCta}</Button>
          <Button variant="outline" onClick={onSecondaryClick}>
            {secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  )
}
