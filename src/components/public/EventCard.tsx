import { Card } from '@/components/ui/card'
import { getCapacityPercent, isGameFull } from '@/lib/gameRegistration.logic'
import type { Game } from '@/types/app.types'

export type EventCardProps = {
  game: Game
}

export function EventCard({ game }: EventCardProps) {
  const capacityPercent = getCapacityPercent(game)
  const full = isGameFull(game)

  return (
    <Card style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <h3 style={{ marginTop: 0 }}>{game.name}</h3>
        {game.status === 'closed' ? (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#6b7280',
              background: '#f3f4f6',
              borderRadius: '999px',
              padding: '0.15rem 0.5rem',
              alignSelf: 'flex-start',
            }}
          >
            Closed
          </span>
        ) : full ? (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#b45309',
              background: '#fef3c7',
              borderRadius: '999px',
              padding: '0.15rem 0.5rem',
              alignSelf: 'flex-start',
            }}
          >
            Waitlist
          </span>
        ) : (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#047857',
              background: '#d1fae5',
              borderRadius: '999px',
              padding: '0.15rem 0.5rem',
              alignSelf: 'flex-start',
            }}
          >
            Open
          </span>
        )}
      </div>
      <p>{game.description}</p>
      <p style={{ marginBottom: capacityPercent === null ? '0' : '0.5rem', color: '#4b5563' }}>
        {game.ageGroup} • {game.startTime}
      </p>
      {capacityPercent !== null ? (
        <div aria-label={`${game.name} capacity`}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              color: '#4b5563',
              marginBottom: '0.25rem',
            }}
          >
            <span>Capacity</span>
            <span>
              {game.registeredCount ?? 0} / {game.capacity}
            </span>
          </div>
          <div
            style={{
              height: '0.5rem',
              borderRadius: '999px',
              background: '#e5e7eb',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${capacityPercent}%`,
                height: '100%',
                background: full ? '#f59e0b' : '#22c55e',
              }}
            />
          </div>
        </div>
      ) : null}
    </Card>
  )
}
