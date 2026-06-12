import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addProgram,
  deleteProgram,
  getAllPrograms,
  getPublishedPrograms,
  reorderPrograms,
  updateProgram,
} from './programs.service'

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

describe('programs.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })
  })

  it('returns mapped published programs', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'program-1',
          title: 'Grassroots Discovery',
          description: 'Scouting talent',
          pillar: 'grassroots_discovery',
          icon: 'search',
          published: true,
          sort_order: 1,
          cta_label: 'Learn more',
          cta_url: '/khel2026',
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getPublishedPrograms()).resolves.toEqual([
      {
        id: 'program-1',
        title: 'Grassroots Discovery',
        description: 'Scouting talent',
        pillar: 'grassroots_discovery',
        icon: 'search',
        published: true,
        sortOrder: 1,
        ctaLabel: 'Learn more',
        ctaUrl: '/khel2026',
      },
    ])
    expect(builder.eq).toHaveBeenCalledWith('published', true)
  })

  it('returns mapped admin programs', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'program-2',
          title: 'Draft Program',
          description: '',
          pillar: 'training',
          icon: null,
          published: false,
          sort_order: 2,
          cta_label: null,
          cta_url: null,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllPrograms()).resolves.toEqual([
      {
        id: 'program-2',
        title: 'Draft Program',
        description: '',
        pillar: 'training',
        icon: undefined,
        published: false,
        sortOrder: 2,
        ctaLabel: undefined,
        ctaUrl: undefined,
      },
    ])
  })

  it('returns empty array for null data', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getPublishedPrograms()).resolves.toEqual([])
    await expect(getAllPrograms()).resolves.toEqual([])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'programs query failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllPrograms()).rejects.toBeInstanceOf(SettingsError)
    await expect(getPublishedPrograms()).rejects.toBeInstanceOf(SettingsError)
  })

  it('adds a program with generated id and sort order', async () => {
    mockGetNextSortOrder.mockResolvedValue(3)
    const builder = createQueryBuilder({
      data: {
        id: 'test-id',
        title: 'New Program',
        description: 'Description',
        pillar: 'health',
        icon: 'heart',
        published: true,
        sort_order: 3,
        cta_label: null,
        cta_url: null,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      addProgram({
        title: 'New Program',
        description: 'Description',
        pillar: 'health',
        icon: 'heart',
        published: true,
      }),
    ).resolves.toEqual({
      id: 'test-id',
      title: 'New Program',
      description: 'Description',
      pillar: 'health',
      icon: 'heart',
      published: true,
      sortOrder: 3,
      ctaLabel: undefined,
      ctaUrl: undefined,
    })

    expect(mockGetNextSortOrder).toHaveBeenCalledWith('programs')
  })

  it('adds a program with optional CTA fields', async () => {
    mockGetNextSortOrder.mockResolvedValue(1)
    const builder = createQueryBuilder({
      data: {
        id: 'test-id',
        title: 'Program with CTA',
        description: 'Description',
        pillar: 'scholarships',
        icon: 'graduation-cap',
        published: true,
        sort_order: 1,
        cta_label: 'Apply',
        cta_url: '/register',
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      addProgram({
        title: 'Program with CTA',
        description: 'Description',
        pillar: 'scholarships',
        icon: 'graduation-cap',
        published: true,
        ctaLabel: 'Apply',
        ctaUrl: '/register',
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        ctaLabel: 'Apply',
        ctaUrl: '/register',
      }),
    )
  })

  it('throws SettingsError when insert fails', async () => {
    mockGetNextSortOrder.mockResolvedValue(0)
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'insert failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(addProgram({ title: 'Fail', pillar: 'training' })).rejects.toBeInstanceOf(
      SettingsError,
    )
  })

  it('updates a program', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'program-1',
        title: 'Updated Program',
        description: 'Description',
        pillar: 'training',
        icon: null,
        published: true,
        sort_order: 1,
        cta_label: null,
        cta_url: null,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(updateProgram('program-1', { published: true })).resolves.toEqual(
      expect.objectContaining({
        id: 'program-1',
        published: true,
      }),
    )
    expect(builder.update).toHaveBeenCalledWith({ published: true })
  })

  it('updates optional program fields and clears empty strings', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'program-1',
        title: 'Updated Program',
        description: 'Updated description',
        pillar: 'health',
        icon: null,
        published: false,
        sort_order: 1,
        cta_label: null,
        cta_url: null,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await updateProgram('program-1', {
      title: 'Updated Program',
      description: 'Updated description',
      pillar: 'health',
      icon: '',
      ctaLabel: '',
      ctaUrl: '',
      published: false,
    })

    expect(builder.update).toHaveBeenCalledWith({
      title: 'Updated Program',
      description: 'Updated description',
      pillar: 'health',
      icon: null,
      cta_label: null,
      cta_url: null,
      published: false,
    })
  })

  it('throws SettingsError when update fails', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'update failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(updateProgram('program-1', { published: false })).rejects.toBeInstanceOf(
      SettingsError,
    )
  })

  it('delegates delete to credibility helper', async () => {
    mockDeleteRow.mockResolvedValue(undefined)

    await deleteProgram('program-1')

    expect(mockDeleteRow).toHaveBeenCalledWith('programs', 'program-1')
  })

  it('delegates reorder to credibility helper', async () => {
    mockReorderRows.mockResolvedValue(undefined)

    await reorderPrograms(['program-2', 'program-1'])

    expect(mockReorderRows).toHaveBeenCalledWith('programs', ['program-2', 'program-1'])
  })
})
