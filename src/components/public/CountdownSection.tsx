import { EventCountdown } from '@/components/public/EventCountdown'

export type CountdownSectionProps = {
  targetDate: string | null
}

export function CountdownSection({ targetDate }: CountdownSectionProps) {
  return (
    <section
      className="countdown-section"
      aria-label="Event countdown"
      style={{ padding: '2rem 0' }}
    >
      <div className="container-custom">
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Countdown to Festival Day</h2>
        {targetDate ? (
          <EventCountdown targetDate={targetDate} />
        ) : (
          <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>To Be Announced</p>
        )}
      </div>
    </section>
  )
}
