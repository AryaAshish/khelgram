import type { SuccessStory } from '@/types/app.types'

export const successStories: SuccessStory[] = [
  {
    id: 'story-village-champion',
    title: 'From village field to district finals',
    summary: 'A young athlete from a remote village discovered through grassroots scouting.',
    story:
      'Rahul joined our grassroots discovery camp with borrowed shoes and unmatched determination. Within a year of structured coaching, he reached district-level athletics finals and inspired three neighboring villages to restart school sports programs.',
    published: true,
    sortOrder: 1,
  },
  {
    id: 'story-girls-football',
    title: 'Girls reclaim the playground',
    summary: 'Inclusive sports days brought girls back to community play spaces.',
    story:
      'Our girls inclusion program helped a cluster of villages run weekly football sessions for adolescent girls. Parents who once hesitated now volunteer as coaches, and school attendance among participating girls has improved noticeably.',
    published: true,
    sortOrder: 2,
  },
]
