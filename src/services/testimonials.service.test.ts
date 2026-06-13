import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addTestimonial,
  deleteTestimonial,
  getTestimonials,
  reorderTestimonials,
  updateTestimonial,
} from './testimonials.service'

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

describe('testimonials.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })
  })

  it('returns mapped testimonials', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'testimonial-1',
          quote: 'Great experience',
          author: 'Anita Mehta',
          relation: 'Parent',
          photo_url: null,
          sort_order: 0,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getTestimonials()).resolves.toEqual([
      {
        id: 'testimonial-1',
        quote: 'Great experience',
        author: 'Anita Mehta',
        relation: 'Parent',
        photoUrl: undefined,
        sortOrder: 0,
      },
    ])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'testimonials failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getTestimonials()).rejects.toBeInstanceOf(SettingsError)
  })

  it('adds a testimonial', async () => {
    mockGetNextSortOrder.mockResolvedValue(0)
    const builder = createQueryBuilder({
      data: {
        id: 'test-id',
        quote: 'Wonderful festival',
        author: 'Ravi',
        relation: 'Coach',
        photo_url: null,
        sort_order: 0,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      addTestimonial({ quote: 'Wonderful festival', author: 'Ravi', relation: 'Coach' }),
    ).resolves.toEqual({
      id: 'test-id',
      quote: 'Wonderful festival',
      author: 'Ravi',
      relation: 'Coach',
      photoUrl: undefined,
      sortOrder: 0,
    })
  })

  it('throws SettingsError when add fails', async () => {
    mockGetNextSortOrder.mockResolvedValue(0)
    mockFrom.mockReturnValue(
      createQueryBuilder({ data: null, error: { message: 'insert failed' } }),
    )

    await expect(addTestimonial({ quote: 'Great', author: 'Parent' })).rejects.toBeInstanceOf(
      SettingsError,
    )
  })

  it('updates a testimonial', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'testimonial-1',
        quote: 'Updated quote',
        author: 'Updated author',
        relation: 'Coach',
        photo_url: null,
        sort_order: 0,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      updateTestimonial('testimonial-1', { quote: 'Updated quote', author: 'Updated author' }),
    ).resolves.toEqual({
      id: 'testimonial-1',
      quote: 'Updated quote',
      author: 'Updated author',
      relation: 'Coach',
      photoUrl: undefined,
      sortOrder: 0,
    })
  })

  it('throws SettingsError when update fails', async () => {
    const builder = createQueryBuilder({ data: null, error: { message: 'update failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(updateTestimonial('testimonial-1', { quote: 'Fail' })).rejects.toBeInstanceOf(
      SettingsError,
    )
  })

  it('clears photo URL when updating testimonial', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'testimonial-1',
        quote: 'Quote',
        author: 'Author',
        relation: '',
        photo_url: null,
        sort_order: 0,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await updateTestimonial('testimonial-1', { photoUrl: '', relation: 'Coach' })

    expect(builder.update).toHaveBeenCalledWith({ photo_url: null, relation: 'Coach' })
  })

  it('delegates delete to credibility helper', async () => {
    mockDeleteRow.mockResolvedValue(undefined)

    await deleteTestimonial('testimonial-1')

    expect(mockDeleteRow).toHaveBeenCalledWith('testimonials', 'testimonial-1')
  })

  it('delegates reorder to credibility helper', async () => {
    mockReorderRows.mockResolvedValue(undefined)

    await reorderTestimonials(['t-2', 't-1'])

    expect(mockReorderRows).toHaveBeenCalledWith('testimonials', ['t-2', 't-1'])
  })
})
