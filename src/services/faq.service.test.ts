import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addFaqItem,
  deleteFaqItem,
  getFaqItems,
  reorderFaqItems,
  updateFaqItem,
} from './faq.service'

const mockFrom = vi.fn()
const mockGetNextSortOrder = vi.fn()
const mockDeleteRow = vi.fn()
const mockReorderRows = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

vi.mock('@/services/credibility.helpers', () => ({
  getNextSortOrder: (...args: unknown[]) => mockGetNextSortOrder(...args),
  deleteRow: (...args: unknown[]) => mockDeleteRow(...args),
  reorderRows: (...args: unknown[]) => mockReorderRows(...args),
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
}

describe('faq.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })
  })

  it('returns mapped FAQ items', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'faq-1',
          question: 'What to bring?',
          answer: 'Water bottle',
          sort_order: 0,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getFaqItems()).resolves.toEqual([
      {
        id: 'faq-1',
        question: 'What to bring?',
        answer: 'Water bottle',
        sortOrder: 0,
      },
    ])
  })

  it('returns empty array when data is null', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getFaqItems()).resolves.toEqual([])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'faq failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getFaqItems()).rejects.toBeInstanceOf(SettingsError)
  })

  it('adds an FAQ item', async () => {
    mockGetNextSortOrder.mockResolvedValue(2)
    const builder = createQueryBuilder({
      data: {
        id: 'test-id',
        question: 'Parking?',
        answer: 'Street parking available',
        sort_order: 2,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      addFaqItem({ question: 'Parking?', answer: 'Street parking available' }),
    ).resolves.toEqual({
      id: 'test-id',
      question: 'Parking?',
      answer: 'Street parking available',
      sortOrder: 2,
    })
  })

  it('delegates delete to credibility helper', async () => {
    mockDeleteRow.mockResolvedValue(undefined)

    await deleteFaqItem('faq-1')

    expect(mockDeleteRow).toHaveBeenCalledWith('faq_items', 'faq-1')
  })

  it('throws SettingsError when add fails', async () => {
    mockGetNextSortOrder.mockResolvedValue(0)
    mockFrom.mockReturnValue(
      createQueryBuilder({ data: null, error: { message: 'insert failed' } }),
    )

    await expect(addFaqItem({ question: 'Q?', answer: 'A' })).rejects.toBeInstanceOf(SettingsError)
  })

  it('updates a FAQ item', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'faq-1',
        question: 'Updated?',
        answer: 'Updated answer',
        sort_order: 0,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      updateFaqItem('faq-1', { question: 'Updated?', answer: 'Updated answer' }),
    ).resolves.toEqual({
      id: 'faq-1',
      question: 'Updated?',
      answer: 'Updated answer',
      sortOrder: 0,
    })
  })

  it('throws SettingsError when update fails', async () => {
    const builder = createQueryBuilder({ data: null, error: { message: 'update failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(updateFaqItem('faq-1', { question: 'Fail' })).rejects.toBeInstanceOf(SettingsError)
  })

  it('delegates reorder to credibility helper', async () => {
    mockReorderRows.mockResolvedValue(undefined)

    await reorderFaqItems(['faq-2', 'faq-1'])

    expect(mockReorderRows).toHaveBeenCalledWith('faq_items', ['faq-2', 'faq-1'])
  })
})
