import { Card } from '@/components/ui/card'
import type { Game } from '@/types/app.types'

export type EventsSectionProps = {
  games: Game[]
}

export function EventsSection({ games }: EventsSectionProps) {
  return (
    <section className="events-section" id="events" style={{ padding: '4rem 0' }}>
      <div className="container-custom">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Festival Events</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {games.map((game) => (
            <Card key={game.id} style={{ padding: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>{game.name}</h3>
              <p>{game.description}</p>
              <p style={{ marginBottom: 0, color: '#4b5563' }}>
                {game.ageGroup} • {game.startTime}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
