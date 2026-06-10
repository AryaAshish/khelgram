import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import * as registrationsService from '@/services/registrations.service'
import type { AdminRegistration, RegistrationFilters } from '@/types/app.types'

function formatExportRows(registrations: AdminRegistration[]) {
  return registrations.map((registration) => ({
    Code: registration.code,
    'Child Name': registration.childName,
    Age: registration.age,
    'Parent Name': registration.parentName,
    Email: registration.email,
    Phone: registration.phone,
    Games: registration.gameNames.join(', '),
    Status: registration.status,
    'Registered At': new Date(registration.createdAt).toLocaleString(),
  }))
}

function downloadWorkbook(rows: Record<string, string | number>[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')
  XLSX.writeFile(workbook, filename)
}

export function useExportRegistrations(filters: RegistrationFilters) {
  return useMutation({
    mutationFn: async () => {
      const registrations = await registrationsService.getRegistrations()
      const filtered = registrationsService.filterRegistrations(registrations, filters)

      if (filtered.length === 0) {
        throw new Error('No registrations match the current filters.')
      }

      return filtered
    },
    onSuccess: (registrations) => {
      const rows = formatExportRows(registrations)
      downloadWorkbook(rows, `khelgram-registrations-${Date.now()}.xlsx`)
      toast.success(`Exported ${registrations.length} registrations.`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
