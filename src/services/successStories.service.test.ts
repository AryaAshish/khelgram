import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addSuccessStory,
  deleteSuccessStory,
  getAllSuccessStories,
  getPublishedSuccessStories,
  reorderSuccessStories,
  updateSuccessStory,
} from './successStories.service'

const mockFrom = vi.fn()
const mockGetNextSortOrder = vi.fn()
const mockDeleteRow = vi.fn()
const mockReorderRows = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}))

vi.mock('@/services/credibility.helpers', () => ({
  getNextSortOrder: (...args: unknown[]) => mockGetNextSortOrder(...args),
  deleteRow: (...args: unknown[]) => mockDeleteRow(...args),
  reorderRows: (...args: unknown[]) => mockReorderRows(...args),
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  const order = vi.fn().mockResolvedValue(result)
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order,
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
}

describe('successStories.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    mockGetNextSortOrder.mockResolvedValue(1)
    vi.stubGlobal('crypto', { randomUUID: () => 'story-id' })
  })

  it('returns mapped published stories', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'story-1',
          title: 'Village champion',
          summary: 'Grassroots scouting',
          story: 'Full story',
          image_url: null,
          published: true,
          sort_order: 1,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getPublishedSuccessStories()).resolves.toEqual([
      {
        id: 'story-1',
        title: 'Village champion',
        summary: 'Grassroots scouting',
        story: 'Full story',
        published: true,
        sortOrder: 1,
      },
    ])
  })

  it('adds story without optional image url', async () => {
    const insertBuilder = createQueryBuilder({
      data: {
        id: 'story-id',
        title: 'New story',
        summary: 'Summary',
        story: 'Body',
        image_url: null,
        published: false,
        sort_order: 1,
      },
      error: null,
    })
    mockFrom.mockReturnValue(insertBuilder)

    await expect(addSuccessStory({ title: 'New story' })).resolves.toMatchObject({
      title: 'New story',
      imageUrl: undefined,
    })
  })

  it('adds and updates stories', async () => {
    const insertBuilder = createQueryBuilder({
      data: {
        id: 'story-id',
        title: 'New story',
        summary: 'Summary',
        story: 'Body',
        image_url: 'https://example.com/photo.jpg',
        published: true,
        sort_order: 1,
      },
      error: null,
    })
    mockFrom.mockReturnValue(insertBuilder)

    await expect(
      addSuccessStory({
        title: 'New story',
        summary: 'Summary',
        story: 'Body',
        imageUrl: 'https://example.com/photo.jpg',
        published: true,
      }),
    ).resolves.toMatchObject({ title: 'New story', imageUrl: 'https://example.com/photo.jpg' })

    const updateBuilder = createQueryBuilder({
      data: {
        id: 'story-id',
        title: 'Updated',
        summary: 'Summary',
        story: 'Body',
        image_url: null,
        published: false,
        sort_order: 1,
      },
      error: null,
    })
    mockFrom.mockReturnValue(updateBuilder)

    await expect(
      updateSuccessStory('story-id', { title: 'Updated', published: false }),
    ).resolves.toMatchObject({ title: 'Updated', published: false })

    const clearImageBuilder = createQueryBuilder({
      data: {
        id: 'story-id',
        title: 'Updated',
        summary: 'Summary',
        story: 'Body',
        image_url: null,
        published: false,
        sort_order: 1,
      },
      error: null,
    })
    mockFrom.mockReturnValue(clearImageBuilder)
    await expect(updateSuccessStory('story-id', { imageUrl: '' })).resolves.toMatchObject({
      imageUrl: undefined,
    })
  })

  it('returns empty array for null data', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getPublishedSuccessStories()).resolves.toEqual([])
    await expect(getAllSuccessStories()).resolves.toEqual([])

    const errorBuilder = createQueryBuilder({ data: null, error: { message: 'Published failed' } })
    mockFrom.mockReturnValue(errorBuilder)
    await expect(getPublishedSuccessStories()).rejects.toThrow(SettingsError)
  })

  it('throws SettingsError on failures', async () => {
    const builder = createQueryBuilder({ data: null, error: { message: 'Read failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(getAllSuccessStories()).rejects.toThrow(SettingsError)

    const insertBuilder = createQueryBuilder({ data: null, error: { message: 'Insert failed' } })
    mockFrom.mockReturnValue(insertBuilder)
    await expect(addSuccessStory({ title: 'Story' })).rejects.toThrow(SettingsError)

    const updateBuilder = createQueryBuilder({ data: null, error: { message: 'Update failed' } })
    mockFrom.mockReturnValue(updateBuilder)
    await expect(updateSuccessStory('story-id', { title: 'Updated' })).rejects.toThrow(
      SettingsError,
    )
  })

  it('deletes and reorders stories', async () => {
    await deleteSuccessStory('story-1')
    expect(mockDeleteRow).toHaveBeenCalledWith('success_stories', 'story-1')

    await reorderSuccessStories(['story-2', 'story-1'])
    expect(mockReorderRows).toHaveBeenCalledWith('success_stories', ['story-2', 'story-1'])
  })
})
