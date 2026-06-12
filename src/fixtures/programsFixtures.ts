import type { Program } from '@/types/app.types'

export const programs: Program[] = [
  {
    id: 'program-grassroots-discovery',
    title: 'Grassroots Discovery',
    description:
      'Scouting talent in villages and underserved communities through local tournaments, school visits, and community coaches.',
    pillar: 'grassroots_discovery',
    icon: 'search',
    published: true,
    sortOrder: 1,
    ctaLabel: 'Learn more',
    ctaUrl: '/khel2026',
  },
  {
    id: 'program-training',
    title: 'Training & Coaching',
    description:
      'Structured coaching camps and mentorship that help young athletes build skills, discipline, and confidence.',
    pillar: 'training',
    icon: 'dumbbell',
    published: true,
    sortOrder: 2,
  },
  {
    id: 'program-traditional-sports',
    title: 'Traditional Sports',
    description:
      'Reviving indigenous games and rural sports traditions so cultural heritage stays alive alongside modern athletics.',
    pillar: 'traditional_sports',
    icon: 'trophy',
    published: true,
    sortOrder: 3,
  },
  {
    id: 'program-health',
    title: 'Health & Nutrition',
    description:
      'Workshops on fitness, hygiene, and balanced nutrition so children stay healthy on and off the field.',
    pillar: 'health',
    icon: 'heart',
    published: true,
    sortOrder: 4,
  },
  {
    id: 'program-scholarships',
    title: 'Scholarships',
    description:
      'Financial support for promising athletes to access equipment, travel, and advanced training opportunities.',
    pillar: 'scholarships',
    icon: 'graduation-cap',
    published: true,
    sortOrder: 5,
  },
  {
    id: 'program-girls-inclusion',
    title: 'Girls & Inclusion',
    description:
      'Safe, inclusive spaces that encourage girls and marginalized youth to participate, lead, and compete.',
    pillar: 'girls_inclusion',
    icon: 'users',
    published: true,
    sortOrder: 6,
  },
]
