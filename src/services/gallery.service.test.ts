import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import { getGalleryImages } from './gallery.service'

const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
  }
}

describe('gallery.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('returns mapped gallery images', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'gallery-1',
          url: 'https://example.com/image.jpg',
          alt: 'Kids playing',
          caption: null,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getGalleryImages()).resolves.toEqual([
      {
        id: 'gallery-1',
        url: 'https://example.com/image.jpg',
        alt: 'Kids playing',
        caption: undefined,
      },
    ])
  })

  it('returns empty array for null data', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getGalleryImages()).resolves.toEqual([])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'gallery failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getGalleryImages()).rejects.toBeInstanceOf(SettingsError)
  })
})
