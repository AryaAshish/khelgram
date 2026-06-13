import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SortableCredibilityAdmin } from './SortableCredibilityAdmin'

type TestItem = { id: string; label: string }

describe('SortableCredibilityAdmin', () => {
  const fields = [
    { key: 'label', label: 'Label' },
    { key: 'published', label: 'Published', type: 'checkbox' as const },
  ]

  it('renders loading and empty states', () => {
    const { rerender } = render(
      <SortableCredibilityAdmin<TestItem>
        title="Test Admin"
        items={[]}
        fields={fields}
        addLabel="Add item"
        isLoading
        isPending={false}
        getItemSummary={(item) => item.label}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    rerender(
      <SortableCredibilityAdmin<TestItem>
        title="Test Admin"
        items={[]}
        fields={fields}
        addLabel="Add item"
        isLoading={false}
        isPending={false}
        getItemSummary={(item) => item.label}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    expect(screen.getByText('No entries yet.')).toBeInTheDocument()
  })

  it('adds an item and resets the form', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)

    render(
      <SortableCredibilityAdmin<TestItem>
        title="Test Admin"
        items={[]}
        fields={fields}
        addLabel="Add item"
        isLoading={false}
        isPending={false}
        getItemSummary={(item) => item.label}
        onAdd={onAdd}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText('Label'), 'New entry')
    await user.click(screen.getByLabelText('Published'))
    await user.click(screen.getByRole('button', { name: 'Add item' }))

    expect(onAdd).toHaveBeenCalledWith({ label: 'New entry', published: true })
    expect(screen.getByLabelText('Label')).toHaveValue('')
    expect(screen.getByLabelText('Published')).not.toBeChecked()
  })

  it('renders textarea and select field types', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)

    render(
      <SortableCredibilityAdmin<TestItem>
        title="Rich Admin"
        items={[]}
        fields={[
          { key: 'notes', label: 'Notes', type: 'textarea' },
          {
            key: 'tier',
            label: 'Tier',
            type: 'select',
            options: [
              { value: 'gold', label: 'Gold' },
              { value: 'silver', label: 'Silver' },
            ],
          },
        ]}
        addLabel="Save entry"
        isLoading={false}
        isPending={false}
        getItemSummary={(item) => item.label}
        onAdd={onAdd}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText('Notes'), 'Long note')
    await user.selectOptions(screen.getByLabelText('Tier'), 'silver')
    await user.click(screen.getByRole('button', { name: 'Save entry' }))

    expect(onAdd).toHaveBeenCalledWith({ notes: 'Long note', tier: 'silver' })
  })

  it('renders select without options', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn().mockResolvedValue(undefined)

    render(
      <SortableCredibilityAdmin<TestItem>
        title="Select Admin"
        items={[]}
        fields={[{ key: 'kind', label: 'Kind', type: 'select' }]}
        addLabel="Save"
        isLoading={false}
        isPending={false}
        getItemSummary={(item) => item.label}
        onAdd={onAdd}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onAdd).toHaveBeenCalledWith({ kind: '' })
  })

  it('shows saving label while pending', () => {
    render(
      <SortableCredibilityAdmin<TestItem>
        title="Test Admin"
        items={[]}
        fields={fields}
        addLabel="Add item"
        isLoading={false}
        isPending
        getItemSummary={(item) => item.label}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
  })

  it('edits an existing item when onUpdate is provided', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn().mockResolvedValue(undefined)
    const items = [{ id: 'item-1', label: 'First' }]

    render(
      <SortableCredibilityAdmin<TestItem>
        title="Test Admin"
        items={items}
        fields={fields}
        addLabel="Add item"
        isLoading={false}
        isPending={false}
        getItemSummary={(item) => item.label}
        mapItemToFormValues={(item) => ({ label: item.label, published: true })}
        onAdd={vi.fn()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByLabelText('Label'))
    await user.type(screen.getByLabelText('Label'), 'Updated entry')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(onUpdate).toHaveBeenCalledWith('item-1', { label: 'Updated entry', published: true })
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('reorders and deletes items', async () => {
    const user = userEvent.setup()
    const onReorder = vi.fn().mockResolvedValue(undefined)
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const items = [
      { id: 'item-1', label: 'First' },
      { id: 'item-2', label: 'Second' },
    ]

    render(
      <SortableCredibilityAdmin<TestItem>
        title="Test Admin"
        items={items}
        fields={fields}
        addLabel="Add item"
        isLoading={false}
        isPending={false}
        getItemSummary={(item) => item.label}
        onAdd={vi.fn()}
        onDelete={onDelete}
        onReorder={onReorder}
      />,
    )

    expect(screen.getAllByRole('button', { name: 'Up' })[0]).toBeDisabled()
    expect(screen.getAllByRole('button', { name: 'Down' })[1]).toBeDisabled()

    await user.click(screen.getAllByRole('button', { name: 'Down' })[0]!)
    expect(onReorder).toHaveBeenCalledWith(['item-2', 'item-1'])

    await user.click(screen.getAllByRole('button', { name: 'Up' })[1]!)
    expect(onReorder).toHaveBeenCalledTimes(2)

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]!)
    expect(onDelete).toHaveBeenCalledWith('item-1')
  })
})
