import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettingsBySection, useSiteSetting, useUpdateSetting } from './useSiteSettings'
import * as settingsService from '@/services/settings.service'

vi.mock('@/services/settings.service', () => ({
  getSetting: vi.fn(),
  getSettingsBySection: vi.fn(),
  updateSetting: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSiteSetting', () => {
  beforeEach(() => {
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
    vi.mocked(settingsService.updateSetting).mockResolvedValue({
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
})
