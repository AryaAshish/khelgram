import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsError } from '@/lib/errors'
import { deleteRow, getNextSortOrder, reorderRows } from './credibility.helpers'

const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

function createSortOrderBuilder(result: { data: unknown; error: { message: string } | null }) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
  }
}

describe('credibility.helpers', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  describe('getNextSortOrder', () => {
    it('returns 0 when table is empty', async () => {
      const builder = createSortOrderBuilder({ data: [], error: null })
      mockFrom.mockReturnValue(builder)

      await expect(getNextSortOrder('team_members')).resolves.toBe(0)
      expect(mockFrom).toHaveBeenCalledWith('team_members')
    })

    it('returns highest sort order plus one', async () => {
      const builder = createSortOrderBuilder({
        data: [{ sort_order: 4 }],
        error: null,
      })
      mockFrom.mockReturnValue(builder)

      await expect(getNextSortOrder('faq_items')).resolves.toBe(5)
    })

    it('throws SettingsError on query failure', async () => {
      const builder = createSortOrderBuilder({
        data: null,
        error: { message: 'sort order failed' },
      })
      mockFrom.mockReturnValue(builder)

      await expect(getNextSortOrder('sponsors')).rejects.toBeInstanceOf(SettingsError)
    })
  })

  describe('reorderRows', () => {
    it('updates sort order for each id', async () => {
      const update = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })
      mockFrom.mockReturnValue({ update })

      await reorderRows('contributors', ['id-a', 'id-b'])

      expect(update).toHaveBeenCalledTimes(2)
      expect(update).toHaveBeenNthCalledWith(1, { sort_order: 0 })
      expect(update).toHaveBeenNthCalledWith(2, { sort_order: 1 })
    })

    it('throws SettingsError when an update fails', async () => {
      const update = vi
        .fn()
        .mockReturnValueOnce({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })
        .mockReturnValueOnce({
          eq: vi.fn().mockResolvedValue({ error: { message: 'reorder failed' } }),
        })
      mockFrom.mockReturnValue({ update })

      await expect(reorderRows('testimonials', ['id-a', 'id-b'])).rejects.toBeInstanceOf(
        SettingsError,
      )
    })
  })

  describe('deleteRow', () => {
    it('deletes a row by id', async () => {
      const eq = vi.fn().mockResolvedValue({ error: null })
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({ eq }),
      })

      await deleteRow('impact_stats', 'stat-1')

      expect(mockFrom).toHaveBeenCalledWith('impact_stats')
      expect(eq).toHaveBeenCalledWith('id', 'stat-1')
    })

    it('throws SettingsError on delete failure', async () => {
      const eq = vi.fn().mockResolvedValue({ error: { message: 'delete failed' } })
      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({ eq }),
      })

      await expect(deleteRow('faq_items', 'faq-1')).rejects.toBeInstanceOf(SettingsError)
    })
  })
})
