import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RevealOnScroll } from './RevealOnScroll'

type IoCallback = (
  entries: Partial<IntersectionObserverEntry>[],
  observer: MockIntersectionObserver,
) => void

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IoCallback

  constructor(callback: IoCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe = vi.fn()
  disconnect = vi.fn()

  triggerIntersecting(isIntersecting: boolean) {
    this.callback([{ isIntersecting }], this)
  }
}

describe('RevealOnScroll', () => {
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

  it('renders children with reveal class', () => {
    render(
      <RevealOnScroll>
        <p>Reveal me</p>
      </RevealOnScroll>,
    )

    expect(screen.getByText('Reveal me')).toBeInTheDocument()
    expect(screen.getByText('Reveal me').parentElement).toHaveClass('reveal-on-scroll')
  })

  it('adds visible class when element enters viewport', () => {
    render(
      <RevealOnScroll delayMs={120}>
        <p>Reveal me</p>
      </RevealOnScroll>,
    )

    const wrapper = screen.getByText('Reveal me').parentElement
    act(() => {
      MockIntersectionObserver.instances[0].triggerIntersecting(true)
    })

    expect(wrapper).toHaveClass('reveal-on-scroll--visible')
    expect(wrapper).toHaveStyle({ animationDelay: '120ms' })
  })
})
