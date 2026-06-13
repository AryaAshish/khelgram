import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { partnerLeadSchema, volunteerLeadSchema } from '@/lib/lead.schema'
import type { PartnerLeadInput } from '@/lib/lead.schema'
import { SettingsError } from '@/lib/errors'
import { downloadCsv } from '@/lib/exportCsv'
import * as leadsService from '@/services/leads.service'
import type { InquiryLeadFilters, InquiryLeadType } from '@/types/app.types'

export const leadKeys = {
  all: ['leads'] as const,
  admin: () => [...leadKeys.all, 'admin'] as const,
}

export function useSubmitLead(type: InquiryLeadType) {
  const schema = type === 'partner' ? partnerLeadSchema : volunteerLeadSchema

  return useMutation({
    mutationFn: async (input: Record<string, string>) => {
      const parsed = schema.safeParse(input)
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid inquiry details'
        throw new SettingsError(firstIssue)
      }

      const data = parsed.data

      return leadsService.submitLead({
        type,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        organization: type === 'partner' ? (data as PartnerLeadInput).organization : undefined,
        message: data.message,
      })
    },
    onSuccess: () => {
      toast.success('Thank you! We received your inquiry.')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useAdminLeads(filters: InquiryLeadFilters) {
  const query = useQuery({
    queryKey: [...leadKeys.admin(), filters],
    queryFn: leadsService.getLeads,
  })

  const leads = query.data ? leadsService.filterLeads(query.data, filters) : []

  return {
    ...query,
    leads,
  }
}

export function useExportLeads(filters: InquiryLeadFilters) {
  return useMutation({
    mutationFn: async () => {
      const leads = await leadsService.getLeads()
      const filtered = leadsService.filterLeads(leads, filters)

      if (filtered.length === 0) {
        throw new Error('No leads match the current filters.')
      }

      return filtered
    },
    onSuccess: (leads) => {
      const rows = leadsService.formatLeadsForCsv(leads)
      downloadCsv(rows, `khelgram-leads-${Date.now()}.csv`)
      toast.success(`Exported ${leads.length} leads.`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
