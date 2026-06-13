import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import { filterLeads, formatLeadsForCsv, getLeads, submitLead } from './leads.service'

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
    insert: vi.fn().mockReturnThis(),
    order,
    single: vi.fn().mockResolvedValue(result),
  }
}

describe('leads.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    vi.stubGlobal('crypto', { randomUUID: () => 'lead-id' })
  })

  it('submits a mapped lead', async () => {
    const builder = createQueryBuilder({
      data: {
        id: 'lead-id',
        type: 'partner',
        name: 'Asha',
        email: 'asha@example.com',
        phone: '9876543210',
        organization: 'NGO',
        message: 'Interested',
        status: 'new',
        created_at: '2026-01-01T00:00:00.000Z',
      },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(
      submitLead({
        type: 'partner',
        name: 'Asha',
        email: 'asha@example.com',
        phone: '9876543210',
        organization: 'NGO',
        message: 'Interested',
      }),
    ).resolves.toEqual({
      id: 'lead-id',
      type: 'partner',
      name: 'Asha',
      email: 'asha@example.com',
      phone: '9876543210',
      organization: 'NGO',
      message: 'Interested',
      status: 'new',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  })

  it('throws SettingsError when submit fails', async () => {
    const builder = createQueryBuilder({ data: null, error: { message: 'Insert failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(
      submitLead({
        type: 'volunteer',
        name: 'Ravi',
        email: 'ravi@example.com',
        message: 'Help',
      }),
    ).rejects.toThrow(SettingsError)
  })

  it('returns mapped leads ordered by created_at', async () => {
    const builder = createQueryBuilder({
      data: [
        {
          id: 'lead-1',
          type: 'volunteer',
          name: 'Ravi',
          email: 'ravi@example.com',
          phone: null,
          organization: null,
          message: 'Help',
          status: 'new',
          created_at: '2026-01-02T00:00:00.000Z',
        },
      ],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getLeads()).resolves.toEqual([
      {
        id: 'lead-1',
        type: 'volunteer',
        name: 'Ravi',
        email: 'ravi@example.com',
        message: 'Help',
        status: 'new',
        createdAt: '2026-01-02T00:00:00.000Z',
      },
    ])
  })

  it('throws SettingsError when getLeads fails', async () => {
    const builder = createQueryBuilder({ data: null, error: { message: 'Read failed' } })
    mockFrom.mockReturnValue(builder)

    await expect(getLeads()).rejects.toThrow(SettingsError)
  })

  it('filters leads by type, status, and search', () => {
    const leads = [
      {
        id: '1',
        type: 'partner' as const,
        name: 'Asha',
        email: 'asha@example.com',
        organization: 'NGO',
        message: 'Support',
        status: 'new' as const,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: 'volunteer' as const,
        name: 'Ravi',
        email: 'ravi@example.com',
        message: 'Weekend help',
        status: 'contacted' as const,
        createdAt: '2026-01-02T00:00:00.000Z',
      },
    ]

    expect(filterLeads(leads, { type: 'partner' })).toHaveLength(1)
    expect(filterLeads(leads, { status: 'contacted' })).toHaveLength(1)
    expect(filterLeads(leads, { search: 'weekend' })).toHaveLength(1)
    expect(filterLeads(leads, { search: '9876543210' })).toHaveLength(0)
    expect(filterLeads(leads, {})).toHaveLength(2)
  })

  it('formats leads for CSV export', () => {
    const rows = formatLeadsForCsv([
      {
        id: '1',
        type: 'partner',
        name: 'Asha',
        email: 'asha@example.com',
        organization: 'NGO',
        message: 'Support',
        status: 'new',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ])

    expect(rows[0]).toMatchObject({
      Type: 'partner',
      Name: 'Asha',
      Organization: 'NGO',
    })
  })
})
