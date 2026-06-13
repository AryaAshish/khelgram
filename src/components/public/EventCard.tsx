import { createElement } from 'react'
import { Card } from '@/components/ui/card'
import { getCapacityPercent, isGameFull } from '@/lib/gameRegistration.logic'
import { resolveGameEventIcon } from '@/lib/gameEventIcons'
import type { Game } from '@/types/app.types'

export type EventCardProps = {
  game: Game
}

function StatusPill({ game, full }: { game: Game; full: boolean }) {
  if (game.status === 'closed') {
    return <span className="event-card__status event-card__status--closed">Closed</span>
  }

  if (full) {
    return <span className="event-card__status event-card__status--waitlist">Waitlist</span>
  }

  return <span className="event-card__status event-card__status--open">Open</span>
}

export function EventCard({ game }: EventCardProps) {
  const capacityPercent = getCapacityPercent(game)
  const full = isGameFull(game)

  return (
    <Card elevated className="event-card">
      <div className="event-card__header">
        <div className="event-card__title-row">
          {createElement(resolveGameEventIcon(game), {
            className: 'event-card__icon',
            'aria-hidden': true,
          })}
          <h3>{game.name}</h3>
        </div>
        <StatusPill game={game} full={full} />
      </div>
      <p className="event-card__description">{game.description}</p>
      <p className="event-card__meta">
        {game.ageGroup} • {game.startTime}
      </p>
      {capacityPercent !== null ? (
        <div aria-label={`${game.name} capacity`} className="event-card__capacity">
          <div className="event-card__capacity-labels">
            <span>Capacity</span>
            <span>
              {game.registeredCount ?? 0} / {game.capacity}
            </span>
          </div>
          <div className="event-card__capacity-track">
            <div
              className={`event-card__capacity-fill ${full ? 'event-card__capacity-fill--full' : ''} event-card__capacity-fill--animate`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>
      ) : null}
    </Card>
  )
}
