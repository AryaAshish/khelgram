import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { footerContent, heroContent } from '@/fixtures/homePageFixtures'
import * as settingsService from '@/services/settings.service'

export const siteSettingsKeys = {
  all: ['site-settings'] as const,
  allValues: () => [...siteSettingsKeys.all, 'all-values'] as const,
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

const fallbackAllSettings: Record<string, string> = {
  site_name: 'Khelgram Foundation',
  event_status: 'registration_open',
  event_date: '2026-04-22',
  hero_title: heroContent.title,
  hero_subtitle: heroContent.subtitle,
  hero_primary_cta: heroContent.primaryCta,
  hero_secondary_cta: heroContent.secondaryCta,
  hero_event_date_label: heroContent.eventDateLabel,
  hero_event_date: heroContent.eventDate,
  footer_description: footerContent.description,
  footer_copyright: footerContent.copyright,
}

export function useAllSettings() {
  const query = useQuery({
    queryKey: siteSettingsKeys.allValues(),
    queryFn: settingsService.getAllSettings,
  })

  const settingsMap = (query.data ?? []).reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})

  return {
    ...query,
    settingsMap: {
      ...fallbackAllSettings,
      ...settingsMap,
    },
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
