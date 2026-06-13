import React from 'react'
import { StatCard } from '@/components/public/primitives/StatCard'
import { calculateTimeLeft, type CountdownParts } from './eventCountdown.logic'

export type EventCountdownProps = {
  targetDate: string
}

type EventCountdownState = {
  timeLeft: CountdownParts
}

export class EventCountdown extends React.Component<EventCountdownProps, EventCountdownState> {
  private intervalId: number | null = null

  constructor(props: EventCountdownProps) {
    super(props)
    this.state = {
      timeLeft: calculateTimeLeft(props.targetDate),
    }
  }

  componentDidMount() {
    this.intervalId = window.setInterval(() => {
      this.setState({ timeLeft: calculateTimeLeft(this.props.targetDate) })
    }, 1000)
  }

  componentWillUnmount() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId)
    }
  }

  componentDidUpdate(prevProps: EventCountdownProps) {
    if (prevProps.targetDate !== this.props.targetDate) {
      this.setState({ timeLeft: calculateTimeLeft(this.props.targetDate) })
    }
  }

  render() {
    const units = [
      { label: 'Days', value: this.state.timeLeft.days },
      { label: 'Hours', value: this.state.timeLeft.hours },
      { label: 'Minutes', value: this.state.timeLeft.minutes },
      { label: 'Seconds', value: this.state.timeLeft.seconds },
    ]

    return (
      <div className="festival-countdown-grid event-countdown">
        {units.map((unit) => (
          <StatCard
            key={unit.label}
            variant="festival"
            value={String(unit.value).padStart(2, '0')}
            label={unit.label}
          />
        ))}
      </div>
    )
  }
}
