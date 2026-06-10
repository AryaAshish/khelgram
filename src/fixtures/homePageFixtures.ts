import type { AboutContent, GalleryImage, Game, ImpactStat } from '@/types/app.types'

export const heroContent = {
  title: "Khelgram Foundation Children's Sports Festival 2026",
  subtitle:
    'A joyful celebration of young athletes, teamwork, and community spirit through fun and inclusive games.',
  primaryCta: 'Register Now',
  secondaryCta: 'Explore Events',
  eventDateLabel: 'Festival Date',
  eventDate: 'March 20, 2026',
}

export const games: Game[] = [
  {
    id: 'sack-race',
    name: 'Sack Race',
    description: 'Hop your way to the finish line with speed, balance, and a big smile.',
    ageGroup: 'Ages 6-10',
    startTime: '10:00 AM',
  },
  {
    id: 'tug-of-war',
    name: 'Tug of War',
    description: 'Team up with friends and pull together to win this classic strength challenge.',
    ageGroup: 'Ages 8-14',
    startTime: '11:00 AM',
  },
  {
    id: 'sprint-50m',
    name: '50-Meter Sprint',
    description: 'A quick burst of speed where every second counts on the track.',
    ageGroup: 'Ages 6-14',
    startTime: '12:00 PM',
  },
  {
    id: 'relay-race',
    name: 'Relay Race',
    description: 'Pass the baton, cheer your team, and race to victory together.',
    ageGroup: 'Ages 8-14',
    startTime: '1:00 PM',
  },
  {
    id: 'musical-chairs',
    name: 'Musical Chairs',
    description: 'A fun and fast-paced game of rhythm, reflexes, and laughter.',
    ageGroup: 'Ages 5-12',
    startTime: '2:00 PM',
  },
]

export const galleryImages: GalleryImage[] = [
  {
    id: 'gallery-1',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    alt: 'Children running during school sports day',
  },
  {
    id: 'gallery-2',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Kids celebrating a race win together',
  },
  {
    id: 'gallery-3',
    url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Children practicing relay handoff',
  },
  {
    id: 'gallery-4',
    url: 'https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Young athletes warming up outdoors',
  },
  {
    id: 'gallery-5',
    url: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Group of children participating in games',
  },
  {
    id: 'gallery-6',
    url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80',
    alt: 'Parents cheering from the sidelines',
  },
  {
    id: 'gallery-7',
    url: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Sports cones and equipment on field',
  },
  {
    id: 'gallery-8',
    url: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
    alt: 'Children having fun in team activities',
  },
]

export const impactStats: ImpactStat[] = [
  { id: 'children', value: '500+', label: 'Children Participating' },
  { id: 'games', value: '15+', label: 'Games & Activities' },
  { id: 'volunteers', value: '80+', label: 'Community Volunteers' },
  { id: 'schools', value: '20+', label: 'Schools Represented' },
]

export const aboutContent: AboutContent = {
  mission:
    'To create a safe, inclusive, and inspiring sports platform where every child can discover confidence, discipline, and teamwork.',
  vision:
    'To become the most trusted community-led movement that nurtures young talent through joyful sports experiences.',
  values: ['Inclusion First', 'Play with Respect', 'Team Spirit', 'Healthy Competition'],
}

export const countdownTarget = '2026-03-20T09:00:00+05:30'

export const contactContent = {
  address: 'Khelgram Community Ground, Jaipur, Rajasthan',
  phone: '+91 98765 43210',
  email: 'hello@khelgramfoundation.org',
}

export const footerContent = {
  description:
    'Khelgram Foundation empowers children through sports, confidence building, and community-driven events.',
  copyright:
    '© 2026 Khelgram Foundation. All rights reserved. Building champions, one game at a time.',
}
