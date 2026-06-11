import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MediaError } from '@/lib/errors'
import { deleteFile, listAssets, uploadFile } from './media.service'

const mockFrom = vi.fn()
const mockStorageFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    storage: {
      from: (...args: unknown[]) => mockStorageFrom(...args),
    },
  },
}))

function createSelectBuilder(result: { data: unknown; error: { message: string } | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
}

function createStorageBucket(uploadResult: { error: { message: string } | null }) {
  return {
    upload: vi.fn().mockResolvedValue(uploadResult),
    remove: vi.fn().mockResolvedValue({ error: null }),
    getPublicUrl: vi.fn().mockReturnValue({
      data: { publicUrl: 'https://example.com/media/sample-upload.png' },
    }),
  }
}

describe('media.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockStorageFrom.mockReset()
    vi.stubGlobal('crypto', {
      randomUUID: () => 'media-asset-1',
    })
  })

  it('listAssets returns mapped media assets', async () => {
    const builder = createSelectBuilder({
      data: [
        {
          id: 'media-1',
          path: 'sample-upload.png',
          url: 'https://example.com/media/sample-upload.png',
          alt: 'sample-upload.png',
          size: 1024,
          created_at: '2026-04-01T10:00:00.000Z',
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(listAssets()).resolves.toEqual([
      {
        id: 'media-1',
        path: 'sample-upload.png',
        url: 'https://example.com/media/sample-upload.png',
        alt: 'sample-upload.png',
        size: 1024,
        createdAt: '2026-04-01T10:00:00.000Z',
      },
    ])
  })

  it('listAssets returns empty array when data is null', async () => {
    const builder = createSelectBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(listAssets()).resolves.toEqual([])
  })

  it('listAssets throws MediaError on query failure', async () => {
    const builder = createSelectBuilder({
      data: null,
      error: { message: 'list failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(listAssets()).rejects.toBeInstanceOf(MediaError)
  })

  it('uploadFile sanitizes unsafe file names', async () => {
    const storageBucket = createStorageBucket({ error: null })
    mockStorageFrom.mockReturnValue(storageBucket)

    const builder = createSelectBuilder({
      data: {
        id: 'media-asset-1',
        path: '123-my file name.png',
        url: 'https://example.com/media/my-file-name.png',
        alt: 'my-file-name.png',
        size: 2048,
        created_at: '2026-04-01T10:00:00.000Z',
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    const file = new File(['image'], 'my file name.png', { type: 'image/png' })
    await uploadFile(file)

    expect(storageBucket.upload).toHaveBeenCalledWith(
      expect.stringMatching(/my.file.name.png$/),
      file,
      expect.any(Object),
    )
  })

  it('uploadFile uploads to storage and inserts metadata', async () => {
    const storageBucket = createStorageBucket({ error: null })
    mockStorageFrom.mockReturnValue(storageBucket)

    const builder = createSelectBuilder({
      data: {
        id: 'media-asset-1',
        path: '123-sample-upload.png',
        url: 'https://example.com/media/sample-upload.png',
        alt: 'sample-upload.png',
        size: 2048,
        created_at: '2026-04-01T10:00:00.000Z',
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    const file = new File(['image'], 'sample-upload.png', { type: 'image/png' })
    const asset = await uploadFile(file)

    expect(storageBucket.upload).toHaveBeenCalled()
    expect(asset.url).toContain('sample-upload.png')
    expect(asset.id).toBe('media-asset-1')
  })

  it('uploadFile throws MediaError when storage upload fails', async () => {
    mockStorageFrom.mockReturnValue(createStorageBucket({ error: { message: 'upload failed' } }))

    const file = new File(['image'], 'sample-upload.png', { type: 'image/png' })
    await expect(uploadFile(file)).rejects.toBeInstanceOf(MediaError)
  })

  it('deleteFile removes storage object and database row', async () => {
    const storageBucket = createStorageBucket({ error: null })
    mockStorageFrom.mockReturnValue(storageBucket)

    const builder = createSelectBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(deleteFile('sample-upload.png')).resolves.toBeUndefined()
    expect(storageBucket.remove).toHaveBeenCalledWith(['sample-upload.png'])
    expect(builder.delete).toHaveBeenCalled()
  })

  it('uploadFile rolls back storage object when metadata insert fails', async () => {
    const storageBucket = createStorageBucket({ error: null })
    mockStorageFrom.mockReturnValue(storageBucket)

    const builder = createSelectBuilder({
      data: null,
      error: { message: 'insert failed' },
    })
    mockFrom.mockReturnValue(builder)

    const file = new File(['image'], 'sample-upload.png', { type: 'image/png' })
    await expect(uploadFile(file)).rejects.toBeInstanceOf(MediaError)
    expect(storageBucket.remove).toHaveBeenCalled()
  })

  it('deleteFile throws MediaError when database delete fails', async () => {
    const storageBucket = createStorageBucket({ error: null })
    mockStorageFrom.mockReturnValue(storageBucket)

    mockFrom.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'db delete failed' },
        }),
      }),
    })

    await expect(deleteFile('sample-upload.png')).rejects.toBeInstanceOf(MediaError)
  })

  it('deleteFile throws MediaError when storage delete fails', async () => {
    mockStorageFrom.mockReturnValue({
      remove: vi.fn().mockResolvedValue({ error: { message: 'delete failed' } }),
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    })

    await expect(deleteFile('sample-upload.png')).rejects.toBeInstanceOf(MediaError)
  })
})
