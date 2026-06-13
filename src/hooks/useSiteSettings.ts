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
  org_hero_title: 'Building sporting futures in rural India',
  org_hero_subtitle:
    'Khelgram Foundation discovers and nurtures grassroots talent in villages and underserved communities through sports programs, training, and inclusive events.',
  org_hero_primary_cta: 'Our impact',
  org_hero_secondary_cta: 'Khel 2026',
  org_hero_image: '',
  org_about_title: 'About Khelgram Foundation',
  org_about_mission:
    'To discover, train, and champion sporting talent in rural India — building confidence, health, and opportunity village by village.',
  org_about_vision:
    'A nation where every child in every village can play, compete, and grow through sport with dignity and support.',
  org_about_values: 'Grassroots First\nInclusive Play\nCommunity Partnership\nLong-term Nurturing',
  org_about_image: '',
  org_impact_title: 'Impact',
  org_impact_subtitle: 'Long-term grassroots sports outcomes across rural communities.',
  org_get_involved_title: 'Get Involved',
  org_get_involved_parents_title: 'Parents',
  org_get_involved_parents_description:
    'Register your child for Khel 2026 and grassroots sports programs.',
  org_get_involved_parents_cta_label: 'Register your child',
  org_get_involved_parents_cta_url: '/register',
  org_get_involved_schools_title: 'Schools',
  org_get_involved_schools_description:
    'Partner with us to bring sports programs to your students.',
  org_get_involved_schools_cta_label: 'Contact us',
  org_get_involved_schools_cta_url: '#contact',
  org_get_involved_partners_title: 'Partners',
  org_get_involved_partners_description:
    'Support equipment, coaching, and village outreach with your organization.',
  org_get_involved_partners_cta_label: 'Partner with us',
  org_get_involved_partners_cta_url: '/get-involved#partner-inquiry',
  org_get_involved_volunteers_title: 'Volunteers',
  org_get_involved_volunteers_description:
    'Help at events, training camps, and community sports days.',
  org_get_involved_volunteers_cta_label: 'Sign up to volunteer',
  org_get_involved_volunteers_cta_url: '/get-involved#volunteer-signup',
  support_visible: 'true',
  support_title: 'Support Our Mission',
  support_description:
    'Your contribution helps us run grassroots sports programs, training camps, and inclusive events across rural communities.',
  donate_url: 'https://khelgram.org/donate',
  donate_qr_image: '',
  support_funds_usage:
    'Equipment and coaching\nVillage outreach camps\nScholarships for talented athletes',
  reach_visible: 'true',
  reach_title: 'Where We Work',
  org_regions:
    '[{"name":"Uttar Pradesh","states":["UP"],"description":"Grassroots discovery camps across eastern UP districts."},{"name":"Bihar","states":["BR"],"description":"School partnerships and girls inclusion programs."},{"name":"Rajasthan","states":["RJ"],"description":"Traditional sports revival and village tournaments."}]',
  programs_title: 'Our Programs',
  programs_visible: 'true',
  get_involved_visible: 'true',
  khel2026_hero_title: heroContent.title,
  khel2026_hero_subtitle: heroContent.subtitle,
  khel2026_hero_primary_cta: heroContent.primaryCta,
  khel2026_hero_secondary_cta: heroContent.secondaryCta,
  khel2026_hero_event_date_label: heroContent.eventDateLabel,
  khel2026_hero_event_date: heroContent.eventDate,
  khel2026_hero_image: '',
  khel2026_countdown_title: 'Countdown to Festival Day',
  khel2026_countdown_tba_text: 'To Be Announced',
  khel2026_events_title: 'Festival Events',
  khel2026_gallery_title: 'Gallery',
  khel2026_register_title: 'Register Your Child',
  khel2026_register_pre_message: "Pre-registration open — we'll confirm dates by email",
  khel2026_register_submit_label: 'Submit Registration',
  khel2026_faq_title: 'FAQ',
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
  impact_title: 'Impact',
  team_title: 'Our Team',
  contributors_title: 'Contributors',
  sponsors_title: 'Sponsors',
  testimonials_title: 'Testimonials',
  faq_title: 'FAQ',
  org_hero_visible: 'true',
  hero_visible: 'false',
  countdown_visible: 'false',
  about_visible: 'true',
  impact_visible: 'true',
  events_visible: 'false',
  team_visible: 'true',
  contributors_visible: 'true',
  sponsors_visible: 'true',
  gallery_visible: 'true',
  testimonials_visible: 'true',
  register_visible: 'false',
  faq_visible: 'true',
  contact_visible: 'true',
  footer_visible: 'true',
  khel2026_hero_visible: 'true',
  khel2026_countdown_visible: 'true',
  khel2026_events_visible: 'true',
  khel2026_gallery_visible: 'true',
  khel2026_register_cta_visible: 'true',
  khel2026_faq_visible: 'true',
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
      mission: settingsMap.org_about_mission,
      vision: settingsMap.org_about_vision,
      values: parseAboutValues(settingsMap.org_about_values),
    }),
    [settingsMap.org_about_mission, settingsMap.org_about_vision, settingsMap.org_about_values],
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
