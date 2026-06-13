import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountUp } from './useCountUp'

type IoCallback = (
  entries: Partial<IntersectionObserverEntry>[],
  observer: MockIntersectionObserver,
) => void

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IoCallback
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(callback: IoCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  triggerIntersecting(isIntersecting: boolean) {
    this.callback([{ isIntersecting }], this)
  }
}

function Probe({ value, durationMs }: { value: string; durationMs?: number }) {
  const { ref, display } = useCountUp(value, durationMs)
  return <span ref={ref}>{display}</span>
}

describe('useCountUp', () => {
  let rafQueue: FrameRequestCallback[]
  let now: number

  beforeEach(() => {
    rafQueue = []
    now = 1000
    MockIntersectionObserver.instances = []
    vi.stubGlobal(
      'IntersectionObserver',
      MockIntersectionObserver as unknown as typeof IntersectionObserver,
    )
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafQueue.push(cb)
      return rafQueue.length
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  function flushAnimationFrames(durationMs = 1200) {
    while (rafQueue.length > 0) {
      const cb = rafQueue.shift()!
      now += durationMs
      act(() => {
        cb(now)
      })
    }
  }

  it('returns the original value for non-numeric strings', () => {
    render(<Probe value="N/A" />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })

  it('animates numeric values when intersecting', async () => {
    render(<Probe value="120+" durationMs={1200} />)
    expect(screen.getByText('120+')).toBeInTheDocument()

    const observer = MockIntersectionObserver.instances[0]
    expect(observer.observe).toHaveBeenCalled()

    act(() => {
      observer.triggerIntersecting(true)
    })
    flushAnimationFrames(1200)

    expect(screen.getByText('120+')).toBeInTheDocument()
    expect(observer.disconnect).toHaveBeenCalled()
  })

  it('does not animate when entry is not intersecting', () => {
    render(<Probe value="50" />)
    const observer = MockIntersectionObserver.instances[0]

    act(() => {
      observer.triggerIntersecting(false)
    })

    expect(rafQueue).toHaveLength(0)
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('animates only once even if intersecting fires again', () => {
    render(<Probe value="80" />)
    const observer = MockIntersectionObserver.instances[0]

    act(() => {
      observer.triggerIntersecting(true)
    })
    flushAnimationFrames(1200)
    const firstDisconnectCount = observer.disconnect.mock.calls.length

    act(() => {
      observer.triggerIntersecting(true)
    })
    flushAnimationFrames(1200)

    expect(observer.disconnect.mock.calls.length).toBe(firstDisconnectCount)
  })

  it('disconnects observer on unmount', () => {
    const { unmount } = render(<Probe value="30" />)
    const observer = MockIntersectionObserver.instances[0]

    unmount()

    expect(observer.disconnect).toHaveBeenCalled()
  })

  it('skips observer setup when IntersectionObserver is unavailable', () => {
    vi.unstubAllGlobals()
    vi.stubGlobal('IntersectionObserver', undefined)

    render(<Probe value="99" />)
    expect(screen.getByText('99')).toBeInTheDocument()
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })

  it('handles comma-separated numeric values', () => {
    render(<Probe value="2,500+" />)
    expect(screen.getByText('2,500+')).toBeInTheDocument()
  })

  it('skips animation when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(<Probe value="75" />)
    expect(screen.getByText('75')).toBeInTheDocument()
    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })
})
