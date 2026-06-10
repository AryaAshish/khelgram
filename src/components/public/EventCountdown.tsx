import React from 'react'
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
      <div
        className="event-countdown"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '0.75rem',
        }}
      >
        {units.map((unit) => (
          <div
            key={unit.label}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              {String(unit.value).padStart(2, '0')}
            </p>
            <p style={{ margin: 0, color: '#6b7280' }}>{unit.label}</p>
          </div>
        ))}
      </div>
    )
  }
}
