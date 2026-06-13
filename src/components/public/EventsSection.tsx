import { EventCard } from '@/components/public/EventCard'
import { SectionShell } from '@/components/public/primitives/SectionShell'
import { SectionHeading } from '@/components/public/primitives/SectionHeading'
import type { Game } from '@/types/app.types'

export type EventsSectionProps = {
  title: string
  games: Game[]
}

export function EventsSection({ title, games }: EventsSectionProps) {
  return (
    <SectionShell id="events" variant="festival" className="events-section">
      <div className="container-custom">
        <SectionHeading title={title} />
        <div className="events-grid">
          {games.map((game) => (
            <EventCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
