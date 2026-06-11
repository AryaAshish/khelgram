import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import { getGalleryImages, saveGalleryImages } from './gallery.service'

const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  const order = vi.fn().mockResolvedValue(result)
  return {
    select: vi.fn().mockReturnThis(),
    order,
    delete: vi.fn().mockReturnThis(),
    in: vi.fn().mockResolvedValue({ error: null }),
    upsert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order,
      }),
    }),
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

  it('saveGalleryImages returns empty array when upsert data is null', async () => {
    const order = vi.fn().mockResolvedValue({ data: null, error: null })
    const builder = {
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ order }),
      }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(
      saveGalleryImages([
        {
          id: 'gallery-1',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          sortOrder: 0,
        },
      ]),
    ).resolves.toEqual([])
  })

  it('saveGalleryImages upserts rows and deletes removed images', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'gallery-1',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          caption: null,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      saveGalleryImages([
        {
          id: 'gallery-1',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          sortOrder: 0,
        },
      ]),
    ).resolves.toEqual([
      {
        id: 'gallery-1',
        url: 'https://example.com/media/sample-upload.png',
        alt: 'sample-upload.png',
        caption: undefined,
      },
    ])

    expect(builder.upsert).toHaveBeenCalled()
  })

  it('saveGalleryImages handles null existing rows when clearing gallery', async () => {
    const builder = {
      select: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn(),
    }
    mockFrom.mockReturnValue(builder)

    await expect(saveGalleryImages([])).resolves.toEqual([])
  })

  it('saveGalleryImages deletes removed rows and returns empty for cleared gallery', async () => {
    const builder = {
      select: vi.fn().mockResolvedValue({ data: [{ id: 'gallery-old' }], error: null }),
      delete: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn(),
    }
    mockFrom.mockReturnValue(builder)

    await expect(saveGalleryImages([])).resolves.toEqual([])
    expect(builder.delete).toHaveBeenCalled()
    expect(builder.in).toHaveBeenCalledWith('id', ['gallery-old'])
  })

  it('saveGalleryImages throws when delete fails', async () => {
    const builder = {
      select: vi.fn().mockResolvedValue({ data: [{ id: 'gallery-old' }], error: null }),
      delete: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ error: { message: 'delete failed' } }),
      upsert: vi.fn(),
    }
    mockFrom.mockReturnValue(builder)

    await expect(saveGalleryImages([])).rejects.toBeInstanceOf(SettingsError)
  })

  it('saveGalleryImages throws when upsert fails', async () => {
    const order = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'upsert failed' },
    })
    const builder = {
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ order }),
      }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(
      saveGalleryImages([
        {
          id: 'gallery-1',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          sortOrder: 0,
        },
      ]),
    ).rejects.toBeInstanceOf(SettingsError)
  })

  it('saveGalleryImages throws when existing lookup fails', async () => {
    const builder = {
      select: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'lookup failed' },
      }),
    }
    mockFrom.mockReturnValue(builder)

    await expect(
      saveGalleryImages([
        {
          id: 'gallery-1',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          sortOrder: 0,
        },
      ]),
    ).rejects.toBeInstanceOf(SettingsError)
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
