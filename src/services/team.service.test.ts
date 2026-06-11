import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import {
  addTeamMember,
  deleteTeamMember,
  getAllTeamMembers,
  getPublishedTeamMembers,
  reorderTeamMembers,
} from './team.service'

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
    single: vi.fn().mockResolvedValue(result),
  }
}

describe('team.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockGetNextSortOrder.mockReset()
    mockDeleteRow.mockReset()
    mockReorderRows.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })
  })

  it('returns mapped published team members', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'team-1',
          name: 'Priya Sharma',
          role: 'Director',
          bio: 'Bio',
          photo_url: 'https://example.com/photo.jpg',
          published: true,
          sort_order: 0,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getPublishedTeamMembers()).resolves.toEqual([
      {
        id: 'team-1',
        name: 'Priya Sharma',
        role: 'Director',
        bio: 'Bio',
        photoUrl: 'https://example.com/photo.jpg',
        published: true,
        sortOrder: 0,
      },
    ])
    expect(builder.eq).toHaveBeenCalledWith('published', true)
  })

  it('returns mapped admin team members', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'team-2',
          name: 'Draft Member',
          role: 'Volunteer',
          bio: '',
          photo_url: null,
          published: false,
          sort_order: 1,
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllTeamMembers()).resolves.toEqual([
      {
        id: 'team-2',
        name: 'Draft Member',
        role: 'Volunteer',
        bio: '',
        photoUrl: undefined,
        published: false,
        sortOrder: 1,
      },
    ])
  })

  it('returns empty array for null data', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getPublishedTeamMembers()).resolves.toEqual([])
  })

  it('throws SettingsError on query failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'team query failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllTeamMembers()).rejects.toBeInstanceOf(SettingsError)
    await expect(getPublishedTeamMembers()).rejects.toBeInstanceOf(SettingsError)
  })

  it('adds a team member with generated id and sort order', async () => {
    mockGetNextSortOrder.mockResolvedValue(2)
    const builder = createQueryBuilder({
      data: {
        id: 'test-id',
        name: 'New Member',
        role: 'Coach',
        bio: 'Bio text',
        photo_url: null,
        published: false,
        sort_order: 2,
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      addTeamMember({ name: 'New Member', role: 'Coach', bio: 'Bio text' }),
    ).resolves.toEqual({
      id: 'test-id',
      name: 'New Member',
      role: 'Coach',
      bio: 'Bio text',
      photoUrl: undefined,
      published: false,
      sortOrder: 2,
    })

    expect(mockGetNextSortOrder).toHaveBeenCalledWith('team_members')
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-id',
        name: 'New Member',
        role: 'Coach',
        sort_order: 2,
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

    await expect(addTeamMember({ name: 'Fail', role: 'Role' })).rejects.toBeInstanceOf(
      SettingsError,
    )
  })

  it('delegates delete to credibility helper', async () => {
    mockDeleteRow.mockResolvedValue(undefined)

    await deleteTeamMember('team-1')

    expect(mockDeleteRow).toHaveBeenCalledWith('team_members', 'team-1')
  })

  it('delegates reorder to credibility helper', async () => {
    mockReorderRows.mockResolvedValue(undefined)

    await reorderTeamMembers(['team-2', 'team-1'])

    expect(mockReorderRows).toHaveBeenCalledWith('team_members', ['team-2', 'team-1'])
  })
})
