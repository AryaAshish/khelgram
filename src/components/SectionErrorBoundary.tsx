import { Component, type ReactNode } from 'react'

type SectionErrorBoundaryProps = {
  title: string
  children: ReactNode
}

type SectionErrorBoundaryState = {
  hasError: boolean
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.props.title.trim().length === 0) {
      return this.props.children
    }

    if (this.state.hasError) {
      return (
        <section aria-label={`${this.props.title} error`} style={{ padding: '4rem 0' }}>
          <div className="container-custom">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{this.props.title}</h2>
            <p style={{ margin: 0, color: '#6b7280' }}>
              We could not load this section right now. Please refresh the page.
            </p>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
