import { EventCountdown } from '@/components/public/EventCountdown'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'

export type CountdownSectionProps = {
  title: string
  targetDate: string | null
  toBeAnnouncedText: string
}

export function CountdownSection({ title, targetDate, toBeAnnouncedText }: CountdownSectionProps) {
  return (
    <SectionShell
      className="countdown-section"
      aria-label="Event countdown"
      variant="default"
      id="countdown"
    >
      <div className="container-custom">
        <SectionHeading title={title} />
        {targetDate ? (
          <EventCountdown targetDate={targetDate} />
        ) : (
          <p className="countdown-tba">{toBeAnnouncedText}</p>
        )}
      </div>
    </SectionShell>
  )
}
