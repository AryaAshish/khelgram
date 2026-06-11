import { SortableCredibilityAdmin } from '@/components/admin/SortableCredibilityAdmin'
import {
  useAddSponsor,
  useDeleteSponsor,
  useReorderSponsors,
  useSponsors,
} from '@/hooks/useSponsors'
import type { Sponsor, SponsorTier } from '@/types/app.types'

const fields = [
  { key: 'name', label: 'Name' },
  {
    key: 'tier',
    label: 'Tier',
    type: 'select' as const,
    options: [
      { value: 'platinum', label: 'Platinum' },
      { value: 'gold', label: 'Gold' },
      { value: 'silver', label: 'Silver' },
      { value: 'community', label: 'Community' },
    ],
  },
  { key: 'logoUrl', label: 'Logo URL' },
  { key: 'website', label: 'Website' },
]

export function SponsorsPage() {
  const { sponsors, isLoading } = useSponsors()
  const addSponsor = useAddSponsor()
  const deleteSponsor = useDeleteSponsor()
  const reorderSponsors = useReorderSponsors()
  const isPending = addSponsor.isPending || deleteSponsor.isPending || reorderSponsors.isPending

  return (
    <SortableCredibilityAdmin<Sponsor>
      title="Sponsors"
      items={sponsors}
      fields={fields}
      addLabel="Add sponsor"
      isLoading={isLoading}
      isPending={isPending}
      getItemSummary={(sponsor) => `${sponsor.name} (${sponsor.tier})`}
      onAdd={async (values) => {
        await addSponsor.mutateAsync({
          name: String(values.name ?? ''),
          tier: (String(values.tier ?? 'community') || 'community') as SponsorTier,
          logoUrl: String(values.logoUrl ?? '') || undefined,
          website: String(values.website ?? '') || undefined,
        })
      }}
      onDelete={async (id) => deleteSponsor.mutateAsync(id)}
      onReorder={async (ids) => reorderSponsors.mutateAsync(ids)}
    />
  )
}
