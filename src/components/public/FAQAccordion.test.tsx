import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FAQAccordion } from './FAQAccordion'

describe('FAQAccordion', () => {
  const items = [
    {
      id: 'faq-1',
      question: 'What should my child bring?',
      answer: 'Comfortable clothes and a water bottle.',
      sortOrder: 0,
    },
    {
      id: 'faq-2',
      question: 'Is parking available?',
      answer: 'Street parking is available nearby.',
      sortOrder: 1,
    },
  ]

  it('renders FAQ questions collapsed by default', () => {
    render(<FAQAccordion title="FAQ" items={items} />)

    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'What should my child bring?' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(screen.queryByText('Comfortable clothes and a water bottle.')).not.toBeInTheDocument()
  })

  it('expands and collapses answers on click', async () => {
    const user = userEvent.setup()
    render(<FAQAccordion title="FAQ" items={items} />)

    const firstQuestion = screen.getByRole('button', { name: 'What should my child bring?' })

    await user.click(firstQuestion)
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Comfortable clothes and a water bottle.')).toBeInTheDocument()

    await user.click(firstQuestion)
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Comfortable clothes and a water bottle.')).not.toBeInTheDocument()
  })

  it('allows only one open item at a time', async () => {
    const user = userEvent.setup()
    render(<FAQAccordion title="FAQ" items={items} />)

    await user.click(screen.getByRole('button', { name: 'What should my child bring?' }))
    await user.click(screen.getByRole('button', { name: 'Is parking available?' }))

    expect(screen.queryByText('Comfortable clothes and a water bottle.')).not.toBeInTheDocument()
    expect(screen.getByText('Street parking is available nearby.')).toBeInTheDocument()
  })
})
