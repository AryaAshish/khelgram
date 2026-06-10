import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ForbiddenPage } from './ForbiddenPage'

describe('ForbiddenPage', () => {
  it('renders access denied message', () => {
    render(<ForbiddenPage />)
    expect(screen.getByText('403 — Access Denied')).toBeInTheDocument()
  })
})
