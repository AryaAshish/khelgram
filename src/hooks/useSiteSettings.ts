import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as settingsService from '@/services/settings.service'

export const siteSettingsKeys = {
  all: ['site-settings'] as const,
  section: (section: string) => [...siteSettingsKeys.all, 'section', section] as const,
  key: (key: string) => [...siteSettingsKeys.all, 'key', key] as const,
}

export function useSettingsBySection(section: string) {
  return useQuery({
    queryKey: siteSettingsKeys.section(section),
    queryFn: () => settingsService.getSettingsBySection(section),
  })
}

export function useSiteSetting(key: string, fallback = '') {
  const query = useQuery({
    queryKey: siteSettingsKeys.key(key),
    queryFn: () => settingsService.getSetting(key),
  })

  return {
    ...query,
    value: query.data?.value ?? fallback,
  }
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, value, section }: { key: string; value: string; section: string }) =>
      settingsService.updateSetting(key, value, section),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: siteSettingsKeys.all })
      queryClient.setQueryData(siteSettingsKeys.key(data.key), data)
    },
  })
}
