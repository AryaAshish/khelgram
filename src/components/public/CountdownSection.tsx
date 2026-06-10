import { EventCountdown } from '@/components/public/EventCountdown'

export type CountdownSectionProps = {
  title: string
  targetDate: string | null
  toBeAnnouncedText: string
}

export function CountdownSection({ title, targetDate, toBeAnnouncedText }: CountdownSectionProps) {
  return (
    <section
      className="countdown-section"
      aria-label="Event countdown"
      style={{ padding: '2rem 0' }}
    >
      <div className="container-custom">
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{title}</h2>
        {targetDate ? (
          <EventCountdown targetDate={targetDate} />
        ) : (
          <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{toBeAnnouncedText}</p>
        )}
      </div>
    </section>
  )
}
