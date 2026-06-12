import type { ProgramPillar } from '@/types/app.types'

export const programPillarOptions: Array<{ value: ProgramPillar; label: string }> = [
  { value: 'grassroots_discovery', label: 'Grassroots Discovery' },
  { value: 'training', label: 'Training' },
  { value: 'traditional_sports', label: 'Traditional Sports' },
  { value: 'health', label: 'Health' },
  { value: 'scholarships', label: 'Scholarships' },
  { value: 'girls_inclusion', label: 'Girls & Inclusion' },
]

export function programPillarLabel(pillar: ProgramPillar): string {
  return programPillarOptions.find((option) => option.value === pillar)?.label ?? pillar
}
