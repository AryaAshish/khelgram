import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import {
  aboutContent,
  contactContent,
  countdownTarget,
  footerContent,
  heroContent,
} from '@/fixtures/homePageFixtures'
import { parseAboutValues } from '@/lib/contentSections'
import * as settingsService from '@/services/settings.service'
import type { SiteSetting } from '@/types/app.types'

export const siteSettingsKeys = {
  all: ['site-settings'] as const,
  allValues: () => [...siteSettingsKeys.all, 'all-values'] as const,
  section: (section: string) => [...siteSettingsKeys.all, 'section', section] as const,
  key: (key: string) => [...siteSettingsKeys.all, 'key', key] as const,
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
  countdown_title: 'Countdown to Festival Day',
  countdown_tba_text: 'To Be Announced',
  about_title: 'About Khelgram Foundation',
  about_mission: aboutContent.mission,
  about_vision: aboutContent.vision,
  about_values: aboutContent.values.join('\n'),
  events_title: 'Festival Events',
  gallery_title: 'Gallery',
  register_title: 'Register Your Child',
  register_pre_message: "Pre-registration open — we'll confirm dates by email",
  register_submit_label: 'Submit Registration',
  contact_title: 'Contact',
  contact_address: contactContent.address,
  contact_phone: contactContent.phone,
  contact_email: contactContent.email,
  footer_description: footerContent.description,
  footer_copyright: footerContent.copyright,
  admin_email: contactContent.email,
}

function mergeSettingsList(
  current: SiteSetting[] | undefined,
  updates: Array<{ key: string; value: string; section: string }>,
): SiteSetting[] {
  const map = new Map((current ?? []).map((setting) => [setting.key, setting]))

  for (const update of updates) {
    map.set(update.key, update)
  }

  return Array.from(map.values())
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

export function useAllSettings() {
  const query = useQuery({
    queryKey: siteSettingsKeys.allValues(),
    queryFn: settingsService.getAllSettings,
  })

  const settingsMap = useMemo(() => {
    const dbSettingsMap = (query.data ?? []).reduce<Record<string, string>>((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return {
      ...fallbackAllSettings,
      ...dbSettingsMap,
    }
  }, [query.data])

  const aboutContent = useMemo(
    () => ({
      mission: settingsMap.about_mission,
      vision: settingsMap.about_vision,
      values: parseAboutValues(settingsMap.about_values),
    }),
    [settingsMap.about_mission, settingsMap.about_vision, settingsMap.about_values],
  )

  return {
    ...query,
    settingsMap,
    aboutContent,
    countdownTarget: settingsMap.event_date ?? countdownTarget,
  }
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, value, section }: { key: string; value: string; section: string }) =>
      settingsService.upsertSetting(key, value, section),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: siteSettingsKeys.all })
      const previous = queryClient.getQueryData<SiteSetting[]>(siteSettingsKeys.allValues())
      queryClient.setQueryData(
        siteSettingsKeys.allValues(),
        mergeSettingsList(previous, [variables]),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(siteSettingsKeys.allValues(), context.previous)
      }
      toast.error('Unable to save setting.')
    },
    onSuccess: (data) => {
      queryClient.setQueryData(siteSettingsKeys.key(data.key), data)
      void queryClient.invalidateQueries({ queryKey: siteSettingsKeys.all })
    },
  })
}

export function useUpdateSectionSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: Array<{ key: string; value: string; section: string }>) =>
      settingsService.updateSectionSettings(settings),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: siteSettingsKeys.all })
      const previous = queryClient.getQueryData<SiteSetting[]>(siteSettingsKeys.allValues())
      queryClient.setQueryData(siteSettingsKeys.allValues(), mergeSettingsList(previous, variables))
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(siteSettingsKeys.allValues(), context.previous)
      }
      toast.error('Unable to save section content.')
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: siteSettingsKeys.all })
    },
  })
}
