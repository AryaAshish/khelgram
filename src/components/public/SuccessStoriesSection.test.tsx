import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SuccessStoriesSection } from './SuccessStoriesSection'

describe('SuccessStoriesSection', () => {
  it('renders story cards', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        stories={[
          {
            id: 'story-1',
            title: 'Village champion',
            summary: 'Grassroots scouting',
            story: 'Full story text',
            published: true,
            sortOrder: 1,
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Success Stories' })).toBeInTheDocument()
    expect(screen.getByText(/Grassroots scouting/)).toBeInTheDocument()
    expect(screen.getByText('Full story text')).toBeInTheDocument()
    expect(document.getElementById('success-stories')).toBeInTheDocument()
  })

  it('renders optional image', () => {
    render(
      <SuccessStoriesSection
        title="Stories"
        stories={[
          {
            id: 'story-2',
            title: 'Photo story',
            summary: 'Summary',
            story: 'Body',
            imageUrl: 'https://example.com/photo.jpg',
            published: true,
            sortOrder: 1,
          },
        ]}
      />,
    )

    expect(screen.getByRole('img', { name: 'Photo story' })).toHaveAttribute(
      'src',
      'https://example.com/photo.jpg',
    )
  })

  it('renders featured story plus supporting grid', () => {
    render(
      <SuccessStoriesSection
        title="Stories"
        stories={[
          {
            id: 'story-1',
            title: 'Featured',
            summary: 'Lead quote',
            story: 'Featured body',
            published: true,
            sortOrder: 1,
          },
          {
            id: 'story-2',
            title: 'Second',
            summary: 'More',
            story: 'Another body',
            published: true,
            sortOrder: 2,
          },
        ]}
      />,
    )

    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('returns null when there are no stories', () => {
    const { container } = render(<SuccessStoriesSection title="Stories" stories={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
