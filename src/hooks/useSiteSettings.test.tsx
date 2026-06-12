import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import {
  useAllSettings,
  useSettingsBySection,
  useSiteSetting,
  useUpdateSectionSettings,
  useUpdateSetting,
} from './useSiteSettings'
import * as settingsService from '@/services/settings.service'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/services/settings.service', () => ({
  getAllSettings: vi.fn(),
  getSetting: vi.fn(),
  getSettingsBySection: vi.fn(),
  updateSetting: vi.fn(),
  upsertSetting: vi.fn(),
  updateSectionSettings: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSiteSetting', () => {
  beforeEach(() => {
    vi.mocked(settingsService.getAllSettings).mockReset()
    vi.mocked(settingsService.getSetting).mockReset()
  })

  it('returns setting value when loaded', async () => {
    vi.mocked(settingsService.getSetting).mockResolvedValue({
      key: 'site_name',
      value: 'Khelgram Foundation',
      section: 'header',
    })

    const { result } = renderHook(() => useSiteSetting('site_name', 'Fallback'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.value).toBe('Khelgram Foundation')
  })

  it('returns fallback while loading or when missing', async () => {
    vi.mocked(settingsService.getSetting).mockResolvedValue(null)

    const { result } = renderHook(() => useSiteSetting('site_name', 'Fallback'), {
      wrapper: createWrapper(),
    })

    expect(result.current.value).toBe('Fallback')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.value).toBe('Fallback')
  })
})

describe('useAllSettings', () => {
  it('uses event_date from settings for countdown target', async () => {
    vi.mocked(settingsService.getAllSettings).mockResolvedValue([
      { key: 'event_date', value: '2026-05-01', section: 'countdown' },
    ])

    const { result } = renderHook(() => useAllSettings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.countdownTarget).toBe('2026-05-01')
  })

  it('returns merged settings map with DB values', async () => {
    vi.mocked(settingsService.getAllSettings).mockResolvedValue([
      { key: 'site_name', value: 'Custom Name', section: 'header' },
      { key: 'hero_title', value: 'Custom Hero Title', section: 'hero' },
    ])

    const { result } = renderHook(() => useAllSettings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.settingsMap.site_name).toBe('Custom Name')
    expect(result.current.settingsMap.hero_title).toBe('Custom Hero Title')
    expect(result.current.settingsMap.footer_description).toBeTruthy()
  })

  it('builds about content from org fields', async () => {
    vi.mocked(settingsService.getAllSettings).mockResolvedValue([
      { key: 'org_about_mission', value: 'Org mission', section: 'org_about' },
      { key: 'org_about_values', value: 'One\nTwo', section: 'org_about' },
    ])

    const { result } = renderHook(() => useAllSettings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.aboutContent.mission).toBe('Org mission')
    expect(result.current.aboutContent.values).toEqual(['One', 'Two'])
  })
})

describe('useSettingsBySection', () => {
  it('returns section settings', async () => {
    vi.mocked(settingsService.getSettingsBySection).mockResolvedValue([
      { key: 'site_name', value: 'Khelgram Foundation', section: 'header' },
    ])

    const { result } = renderHook(() => useSettingsBySection('header'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})

describe('useUpdateSetting', () => {
  it('updates a setting and invalidates cache', async () => {
    vi.mocked(settingsService.upsertSetting).mockResolvedValue({
      key: 'site_name',
      value: 'Updated Name',
      section: 'header',
    })

    const { result } = renderHook(() => useUpdateSetting(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ key: 'site_name', value: 'Updated Name', section: 'header' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.value).toBe('Updated Name')
  })

  it('shows error toast without rollback when cache was empty', async () => {
    vi.mocked(settingsService.upsertSetting).mockRejectedValue(new Error('save failed'))

    const { result } = renderHook(() => useUpdateSetting(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({
        key: 'hero_title',
        value: 'Broken Hero',
        section: 'hero',
      }),
    ).rejects.toThrow('save failed')

    expect(toast.error).toHaveBeenCalledWith('Unable to save setting.')
  })

  it('rolls back optimistic cache updates on error', async () => {
    vi.mocked(settingsService.getAllSettings).mockResolvedValue([
      { key: 'hero_title', value: 'Original Hero', section: 'hero' },
    ])
    vi.mocked(settingsService.upsertSetting).mockRejectedValue(new Error('save failed'))

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result: settingsResult } = renderHook(() => useAllSettings(), { wrapper })
    await waitFor(() => expect(settingsResult.current.isSuccess).toBe(true))

    const { result: updateResult } = renderHook(() => useUpdateSetting(), { wrapper })

    await expect(
      updateResult.current.mutateAsync({
        key: 'hero_title',
        value: 'Broken Hero',
        section: 'hero',
      }),
    ).rejects.toThrow('save failed')

    await waitFor(() => expect(settingsResult.current.settingsMap.hero_title).toBe('Original Hero'))
    expect(toast.error).toHaveBeenCalled()
  })
})

describe('useUpdateSectionSettings', () => {
  it('saves all fields in a section', async () => {
    vi.mocked(settingsService.updateSectionSettings).mockResolvedValue([
      { key: 'hero_title', value: 'Updated Hero', section: 'hero' },
    ])

    const { result } = renderHook(() => useUpdateSectionSettings(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync([
      { key: 'hero_title', value: 'Updated Hero', section: 'hero' },
    ])

    expect(settingsService.updateSectionSettings).toHaveBeenCalled()
  })

  it('shows error toast without rollback when section cache was empty', async () => {
    vi.mocked(settingsService.updateSectionSettings).mockRejectedValue(new Error('section failed'))

    const { result } = renderHook(() => useUpdateSectionSettings(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync([{ key: 'hero_title', value: 'Broken Hero', section: 'hero' }]),
    ).rejects.toThrow('section failed')

    expect(toast.error).toHaveBeenCalledWith('Unable to save section content.')
  })

  it('rolls back section cache updates on error', async () => {
    vi.mocked(settingsService.getAllSettings).mockResolvedValue([
      { key: 'hero_title', value: 'Original Hero', section: 'hero' },
    ])
    vi.mocked(settingsService.updateSectionSettings).mockRejectedValue(new Error('section failed'))

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result: settingsResult } = renderHook(() => useAllSettings(), { wrapper })
    await waitFor(() => expect(settingsResult.current.isSuccess).toBe(true))

    const { result: updateResult } = renderHook(() => useUpdateSectionSettings(), { wrapper })

    await expect(
      updateResult.current.mutateAsync([
        { key: 'hero_title', value: 'Broken Hero', section: 'hero' },
      ]),
    ).rejects.toThrow('section failed')

    await waitFor(() => expect(settingsResult.current.settingsMap.hero_title).toBe('Original Hero'))
    expect(toast.error).toHaveBeenCalledWith('Unable to save section content.')
  })
})
