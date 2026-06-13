import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInView } from './useInView'

type IoCallback = (
  entries: Partial<IntersectionObserverEntry>[],
  observer: MockIntersectionObserver,
) => void

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IoCallback
  observe = vi.fn()
  disconnect = vi.fn()

  constructor(callback: IoCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  triggerIntersecting(isIntersecting: boolean) {
    this.callback([{ isIntersecting }], this)
  }
}

function Probe({ once = true }: { once?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>({ once })
  return (
    <div ref={ref} data-in-view={inView ? 'true' : 'false'}>
      Probe
    </div>
  )
}

describe('useInView', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []
    vi.stubGlobal(
      'IntersectionObserver',
      MockIntersectionObserver as unknown as typeof IntersectionObserver,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts out of view', () => {
    render(<Probe />)
    expect(screen.getByText('Probe')).toHaveAttribute('data-in-view', 'false')
  })

  it('marks element in view when intersecting', () => {
    render(<Probe />)
    const observer = MockIntersectionObserver.instances[0]

    act(() => {
      observer.triggerIntersecting(true)
    })

    expect(screen.getByText('Probe')).toHaveAttribute('data-in-view', 'true')
    expect(observer.disconnect).toHaveBeenCalled()
  })

  it('ignores non-intersecting entries', () => {
    render(<Probe />)
    const observer = MockIntersectionObserver.instances[0]

    act(() => {
      observer.triggerIntersecting(false)
    })

    expect(screen.getByText('Probe')).toHaveAttribute('data-in-view', 'false')
  })

  it('starts out of view when IntersectionObserver is unavailable', () => {
    vi.unstubAllGlobals()
    vi.stubGlobal('IntersectionObserver', undefined)

    render(<Probe />)
    expect(screen.getByText('Probe')).toHaveAttribute('data-in-view', 'false')
  })

  it('keeps observing when once is false', () => {
    function RepeatProbe() {
      const { ref, inView } = useInView<HTMLDivElement>({ once: false })
      return (
        <div ref={ref} data-in-view={inView ? 'true' : 'false'}>
          Repeat
        </div>
      )
    }

    render(<RepeatProbe />)
    const observer = MockIntersectionObserver.instances[0]

    act(() => {
      observer.triggerIntersecting(true)
    })

    expect(observer.disconnect).not.toHaveBeenCalled()
    expect(screen.getByText('Repeat')).toHaveAttribute('data-in-view', 'true')
  })
})
