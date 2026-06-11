import type { Contributor, FaqItem, Sponsor, TeamMember, Testimonial } from '@/types/app.types'

export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Priya Sharma',
    role: 'Program Director',
    bio: 'Leads festival operations and volunteer coordination.',
    published: true,
    sortOrder: 0,
  },
]

export const contributors: Contributor[] = [
  {
    id: 'contributor-1',
    name: 'Local Schools Network',
    contribution: 'Venue and volunteer support',
    sortOrder: 0,
  },
]

export const sponsors: Sponsor[] = [
  {
    id: 'sponsor-1',
    name: 'Greenfield Sports',
    tier: 'platinum',
    website: 'https://example.com',
    sortOrder: 0,
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: 'My daughter gained so much confidence after participating.',
    author: 'Anita Mehta',
    relation: 'Parent',
    sortOrder: 0,
  },
]

export const faqItems: FaqItem[] = [
  {
    id: 'faq-what-to-bring',
    question: 'What should my child bring to the festival?',
    answer: 'Please bring comfortable clothes, a water bottle, and running shoes.',
    sortOrder: 0,
  },
]
