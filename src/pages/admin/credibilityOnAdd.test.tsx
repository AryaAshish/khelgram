import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SortableCredibilityAdminProps } from '@/components/admin/SortableCredibilityAdmin'

const capture = vi.hoisted(() => ({
  onAdd: null as ((values: Record<string, string | boolean>) => Promise<void>) | null,
}))

const teamMocks = vi.hoisted(() => ({
  add: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
  admin: vi.fn(),
}))

const contributorsMocks = vi.hoisted(() => ({
  add: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
  list: vi.fn(),
}))

const sponsorsMocks = vi.hoisted(() => ({
  add: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
  list: vi.fn(),
}))

const testimonialsMocks = vi.hoisted(() => ({
  add: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
  list: vi.fn(),
}))

const faqMocks = vi.hoisted(() => ({
  add: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
  list: vi.fn(),
}))

const impactMocks = vi.hoisted(() => ({
  add: vi.fn(),
  delete: vi.fn(),
  reorder: vi.fn(),
  list: vi.fn(),
}))

vi.mock('@/components/admin/SortableCredibilityAdmin', () => ({
  SortableCredibilityAdmin: <TItem extends { id: string }>(
    props: SortableCredibilityAdminProps<TItem>,
  ) => {
    capture.onAdd = props.onAdd as (values: Record<string, string | boolean>) => Promise<void>
    return null
  },
}))

vi.mock('@/hooks/useTeam', () => ({
  useAdminTeam: () => teamMocks.admin(),
  useAddTeamMember: () => ({ mutateAsync: teamMocks.add, isPending: false }),
  useUpdateTeamMember: () => ({ mutateAsync: teamMocks.update, isPending: false }),
  useDeleteTeamMember: () => ({ mutateAsync: teamMocks.delete, isPending: false }),
  useReorderTeamMembers: () => ({ mutateAsync: teamMocks.reorder, isPending: false }),
}))

vi.mock('@/hooks/useContributors', () => ({
  useAdminContributors: () => contributorsMocks.list(),
  useAddContributor: () => ({ mutateAsync: contributorsMocks.add, isPending: false }),
  useUpdateContributor: () => ({ mutateAsync: contributorsMocks.update, isPending: false }),
  useDeleteContributor: () => ({ mutateAsync: contributorsMocks.delete, isPending: false }),
  useReorderContributors: () => ({ mutateAsync: contributorsMocks.reorder, isPending: false }),
}))

vi.mock('@/hooks/useSponsors', () => ({
  useAdminSponsors: () => sponsorsMocks.list(),
  useAddSponsor: () => ({ mutateAsync: sponsorsMocks.add, isPending: false }),
  useUpdateSponsor: () => ({ mutateAsync: sponsorsMocks.update, isPending: false }),
  useDeleteSponsor: () => ({ mutateAsync: sponsorsMocks.delete, isPending: false }),
  useReorderSponsors: () => ({ mutateAsync: sponsorsMocks.reorder, isPending: false }),
}))

vi.mock('@/hooks/useTestimonials', () => ({
  useAdminTestimonials: () => testimonialsMocks.list(),
  useAddTestimonial: () => ({ mutateAsync: testimonialsMocks.add, isPending: false }),
  useUpdateTestimonial: () => ({ mutateAsync: testimonialsMocks.update, isPending: false }),
  useDeleteTestimonial: () => ({ mutateAsync: testimonialsMocks.delete, isPending: false }),
  useReorderTestimonials: () => ({ mutateAsync: testimonialsMocks.reorder, isPending: false }),
}))

vi.mock('@/hooks/useFaq', () => ({
  useAdminFaq: () => faqMocks.list(),
  useAddFaqItem: () => ({ mutateAsync: faqMocks.add, isPending: false }),
  useUpdateFaqItem: () => ({ mutateAsync: faqMocks.update, isPending: false }),
  useDeleteFaqItem: () => ({ mutateAsync: faqMocks.delete, isPending: false }),
  useReorderFaqItems: () => ({ mutateAsync: faqMocks.reorder, isPending: false }),
}))

vi.mock('@/hooks/useImpactStats', () => ({
  useImpactStats: () => impactMocks.list(),
}))

vi.mock('@/hooks/useAdminImpactStats', () => ({
  useAddImpactStat: () => ({ mutateAsync: impactMocks.add, isPending: false }),
  useDeleteImpactStat: () => ({ mutateAsync: impactMocks.delete, isPending: false }),
  useReorderImpactStats: () => ({ mutateAsync: impactMocks.reorder, isPending: false }),
}))

import { ContributorsPage } from './ContributorsPage'
import { FAQPage } from './FAQPage'
import { ImpactStatsPage } from './ImpactStatsPage'
import { SponsorsPage } from './SponsorsPage'
import { TeamPage } from './TeamPage'
import { TestimonialsPage } from './TestimonialsPage'

const emptyList = { isLoading: false }

describe('credibility admin onAdd defaults', () => {
  beforeEach(() => {
    teamMocks.admin.mockReturnValue({ data: [], ...emptyList })
    contributorsMocks.list.mockReturnValue({ data: [], ...emptyList })
    sponsorsMocks.list.mockReturnValue({ data: [], ...emptyList })
    testimonialsMocks.list.mockReturnValue({ data: [], ...emptyList })
    faqMocks.list.mockReturnValue({ data: [], ...emptyList })
    impactMocks.list.mockReturnValue({ impactStats: [], ...emptyList })

    teamMocks.add.mockResolvedValue({})
    contributorsMocks.add.mockResolvedValue({})
    sponsorsMocks.add.mockResolvedValue({})
    testimonialsMocks.add.mockResolvedValue({})
    faqMocks.add.mockResolvedValue({})
    impactMocks.add.mockResolvedValue({})
  })

  it('TeamPage maps missing values to defaults', async () => {
    render(<TeamPage />)
    await capture.onAdd!({})

    expect(teamMocks.add).toHaveBeenCalledWith({
      name: '',
      role: '',
      bio: '',
      photoUrl: undefined,
      published: false,
    })
  })

  it('ContributorsPage maps missing values to defaults', async () => {
    render(<ContributorsPage />)
    await capture.onAdd!({})

    expect(contributorsMocks.add).toHaveBeenCalledWith({
      name: '',
      contribution: '',
      photoUrl: undefined,
    })
  })

  it('SponsorsPage maps missing values to defaults', async () => {
    render(<SponsorsPage />)
    await capture.onAdd!({ tier: '' })

    expect(sponsorsMocks.add).toHaveBeenCalledWith({
      name: '',
      tier: 'community',
      logoUrl: undefined,
      website: undefined,
    })
  })

  it('TestimonialsPage maps missing values to defaults', async () => {
    render(<TestimonialsPage />)
    await capture.onAdd!({})

    expect(testimonialsMocks.add).toHaveBeenCalledWith({
      quote: '',
      author: '',
      relation: '',
      photoUrl: undefined,
    })
  })

  it('FAQPage maps missing values to defaults', async () => {
    render(<FAQPage />)
    await capture.onAdd!({})

    expect(faqMocks.add).toHaveBeenCalledWith({
      question: '',
      answer: '',
    })
  })

  it('ImpactStatsPage maps missing values to defaults', async () => {
    render(<ImpactStatsPage />)
    await capture.onAdd!({})

    expect(impactMocks.add).toHaveBeenCalledWith({
      value: '',
      label: '',
      statKey: undefined,
      scope: 'org',
    })
  })
})
