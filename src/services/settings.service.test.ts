import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getSetting, getSettingsBySection, updateSetting } from './settings.service'
import { SettingsError } from '@/lib/errors'

const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(result),
    maybeSingle: vi.fn().mockResolvedValue(result),
    upsert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  }
  return builder
}

describe('settings.service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
  })

  it('getSettingsBySection returns mapped settings', async () => {
    const builder = createQueryBuilder({
      data: [{ key: 'site_name', value: 'Khelgram Foundation', section: 'header' }],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    const settings = await getSettingsBySection('header')

    expect(mockFrom).toHaveBeenCalledWith('site_settings')
    expect(settings).toEqual([
      { key: 'site_name', value: 'Khelgram Foundation', section: 'header' },
    ])
  })

  it('getSettingsBySection returns empty array when data is null', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getSettingsBySection('header')).resolves.toEqual([])
  })

  it('getSettingsBySection throws SettingsError on failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'db error' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getSettingsBySection('header')).rejects.toBeInstanceOf(SettingsError)
  })

  it('getSetting returns null when missing', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getSetting('missing')).resolves.toBeNull()
  })

  it('getSetting returns mapped setting when found', async () => {
    const builder = createQueryBuilder({
      data: { key: 'site_name', value: 'Khelgram Foundation', section: 'header' },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getSetting('site_name')).resolves.toEqual({
      key: 'site_name',
      value: 'Khelgram Foundation',
      section: 'header',
    })
  })

  it('getSetting throws SettingsError on failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'read failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getSetting('site_name')).rejects.toBeInstanceOf(SettingsError)
  })

  it('updateSetting upserts and returns mapped setting', async () => {
    const builder = createQueryBuilder({
      data: { key: 'site_name', value: 'Updated', section: 'header' },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    const setting = await updateSetting('site_name', 'Updated', 'header')

    expect(setting).toEqual({ key: 'site_name', value: 'Updated', section: 'header' })
  })

  it('updateSetting throws SettingsError on failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'write failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(updateSetting('site_name', 'Updated', 'header')).rejects.toBeInstanceOf(
      SettingsError,
    )
  })
})
