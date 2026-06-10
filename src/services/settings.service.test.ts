import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAllSettings,
  getSetting,
  getSettingsBySection,
  updateSectionSettings,
  updateSetting,
  upsertSetting,
} from './settings.service'
import { SettingsError } from '@/lib/errors'

const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

function createQueryBuilder(result: { data: unknown; error: { message: string } | null }) {
  const order = vi.fn().mockImplementation(() => {
    const orderedResult = Promise.resolve(result) as Promise<typeof result> & {
      order?: typeof order
    }
    orderedResult.order = order
    return orderedResult
  })

  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order,
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

  it('getAllSettings returns empty array when data is null', async () => {
    const builder = createQueryBuilder({ data: null, error: null })
    mockFrom.mockReturnValue(builder)

    await expect(getAllSettings()).resolves.toEqual([])
  })

  it('getAllSettings returns all mapped settings', async () => {
    const builder = createQueryBuilder({
      data: [{ key: 'site_name', value: 'Khelgram Foundation', section: 'header' }],
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllSettings()).resolves.toEqual([
      { key: 'site_name', value: 'Khelgram Foundation', section: 'header' },
    ])
  })

  it('getAllSettings throws SettingsError on failure', async () => {
    const builder = createQueryBuilder({
      data: null,
      error: { message: 'all settings failed' },
    })
    mockFrom.mockReturnValue(builder)

    await expect(getAllSettings()).rejects.toBeInstanceOf(SettingsError)
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

  it('upsertSetting delegates to updateSetting', async () => {
    const builder = createQueryBuilder({
      data: { key: 'hero_title', value: 'Updated Hero', section: 'hero' },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    await expect(upsertSetting('hero_title', 'Updated Hero', 'hero')).resolves.toEqual({
      key: 'hero_title',
      value: 'Updated Hero',
      section: 'hero',
    })
  })

  it('updateSectionSettings upserts each field', async () => {
    const builder = createQueryBuilder({
      data: { key: 'hero_title', value: 'Updated Hero', section: 'hero' },
      error: null,
    })
    mockFrom.mockReturnValue(builder)

    const results = await updateSectionSettings([
      { key: 'hero_title', value: 'Updated Hero', section: 'hero' },
      { key: 'hero_subtitle', value: 'Updated subtitle', section: 'hero' },
    ])

    expect(results).toHaveLength(2)
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
