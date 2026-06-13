import type { LucideIcon } from 'lucide-react'
import { Award, Dumbbell, HeartPulse, Landmark, Search, Users } from 'lucide-react'
import type { ProgramPillar } from '@/types/app.types'

export type PillarVisual = {
  label: string
  icon: LucideIcon
  accent: string
  border: string
}

export const programPillarVisuals: Record<ProgramPillar, PillarVisual> = {
  grassroots_discovery: {
    label: 'Grassroots Discovery',
    icon: Search,
    accent: '#166534',
    border: '#86efac',
  },
  training: {
    label: 'Training',
    icon: Dumbbell,
    accent: '#1d4ed8',
    border: '#93c5fd',
  },
  traditional_sports: {
    label: 'Traditional Sports',
    icon: Landmark,
    accent: '#b45309',
    border: '#fcd34d',
  },
  health: {
    label: 'Health',
    icon: HeartPulse,
    accent: '#0e7490',
    border: '#67e8f9',
  },
  scholarships: {
    label: 'Scholarships',
    icon: Award,
    accent: '#7c3aed',
    border: '#c4b5fd',
  },
  girls_inclusion: {
    label: 'Girls & Inclusion',
    icon: Users,
    accent: '#be185d',
    border: '#f9a8d4',
  },
}

export function programPillarLabel(pillar: ProgramPillar): string {
  return programPillarVisuals[pillar]?.label ?? pillar
}

export const programPillarOptions = Object.entries(programPillarVisuals).map(([value, visual]) => ({
  value: value as ProgramPillar,
  label: visual.label,
}))
