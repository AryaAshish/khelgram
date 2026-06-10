import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EventCountdown } from './EventCountdown'

describe('EventCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-19T09:00:00+05:30'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders countdown units', () => {
    render(<EventCountdown targetDate="2026-03-20T09:00:00+05:30" />)

    expect(screen.getByText('Days')).toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(screen.getByText('Minutes')).toBeInTheDocument()
    expect(screen.getByText('Seconds')).toBeInTheDocument()
  })

  it('updates countdown on interval', () => {
    render(<EventCountdown targetDate="2026-03-19T09:00:01+05:30" />)
    vi.advanceTimersByTime(1000)
    expect(screen.getAllByText('00').length).toBeGreaterThan(0)
  })

  it('updates when target date changes', () => {
    const { rerender } = render(<EventCountdown targetDate="2026-03-20T09:00:00+05:30" />)
    rerender(<EventCountdown targetDate="2026-03-21T09:00:00+05:30" />)
    expect(screen.getByText('02')).toBeInTheDocument()
  })

  it('unmounts safely when interval was never started', () => {
    const instance = new EventCountdown({ targetDate: '2026-03-20T09:00:00+05:30' })
    expect(() => instance.componentWillUnmount()).not.toThrow()
  })

  it('clears interval on unmount', () => {
    const clearSpy = vi.spyOn(window, 'clearInterval')
    const { unmount } = render(<EventCountdown targetDate="2026-03-20T09:00:00+05:30" />)
    unmount()
    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })
})
