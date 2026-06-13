import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import { Button } from '@/components/ui/button'
import { visualAssets } from '@/fixtures/visualAssets'

export type HeroSectionProps = {
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  eventDateLabel: string
  eventDate: string
  registrationCount?: number
  imageUrl?: string
  imageAlt?: string
  onPrimaryClick: () => void
  onSecondaryClick: () => void
}

function FestivalConfetti() {
  return (
    <svg
      className="festival-hero-confetti"
      viewBox="0 0 120 40"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="4" fill="var(--color-saffron)" />
      <rect
        x="28"
        y="4"
        width="6"
        height="6"
        fill="var(--color-festival-bright)"
        transform="rotate(20 31 7)"
      />
      <circle cx="52" cy="14" r="3" fill="var(--color-festival)" />
      <rect
        x="72"
        y="6"
        width="5"
        height="5"
        fill="var(--color-saffron)"
        transform="rotate(-15 74 8)"
      />
      <circle cx="96" cy="10" r="4" fill="var(--color-festival-bright)" />
    </svg>
  )
}

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  eventDateLabel,
  eventDate,
  registrationCount,
  imageUrl = visualAssets.festivalAction.url,
  imageAlt = visualAssets.festivalAction.alt,
  onPrimaryClick,
  onSecondaryClick,
}: HeroSectionProps) {
  return (
    <SectionShell id="hero" variant="festival" heroOffset className="festival-hero-section">
      <FestivalConfetti />
      <div className="container-custom festival-hero-grid">
        <div className="festival-hero-copy">
          <SectionHeading eyebrow="Khel 2026 Festival" title={title} subtitle={subtitle} as="h1" />
          <p className="festival-hero-date">
            <span className="festival-hero-date__label">{eventDateLabel}</span>
            <span className="festival-hero-date__value">{eventDate}</span>
          </p>
          {registrationCount !== undefined ? (
            <p className="festival-hero-registration">
              <span className="festival-hero-registration__dot" aria-hidden="true" />
              <strong>{registrationCount}</strong> children registered so far
            </p>
          ) : null}
          <div className="festival-hero-actions">
            <Button variant="festival" onClick={onPrimaryClick}>
              {primaryCta}
            </Button>
            <Button variant="outline" onClick={onSecondaryClick}>
              {secondaryCta}
            </Button>
          </div>
        </div>
        <div className="festival-hero-media">
          <img src={imageUrl} alt={imageAlt} className="festival-hero-image" loading="eager" />
          <div className="festival-hero-media-overlay" aria-hidden="true" />
        </div>
      </div>
    </SectionShell>
  )
}
