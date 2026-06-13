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
    status: 'active',
    preRegistrationAllowed: true,
  },
  {
    id: 'tug-of-war',
    name: 'Tug of War',
    description: 'Team up with friends and pull together to win this classic strength challenge.',
    ageGroup: 'Ages 8-14',
    startTime: '11:00 AM',
    status: 'active',
    preRegistrationAllowed: true,
  },
  {
    id: 'sprint-50m',
    name: '50-Meter Sprint',
    description: 'A quick burst of speed where every second counts on the track.',
    ageGroup: 'Ages 6-14',
    startTime: '12:00 PM',
    status: 'active',
    preRegistrationAllowed: true,
  },
  {
    id: 'relay-race',
    name: 'Relay Race',
    description: 'Pass the baton, cheer your team, and race to victory together.',
    ageGroup: 'Ages 8-14',
    startTime: '1:00 PM',
    status: 'active',
    preRegistrationAllowed: true,
  },
  {
    id: 'musical-chairs',
    name: 'Musical Chairs',
    description: 'A fun and fast-paced game of rhythm, reflexes, and laughter.',
    ageGroup: 'Ages 5-12',
    startTime: '2:00 PM',
    status: 'active',
    preRegistrationAllowed: true,
  },
]

export const galleryImages: GalleryImage[] = [
  {
    id: 'gallery-1',
    url: '/images/grassroots/g1.png',
    alt: 'Indian schoolgirls sprinting barefoot during a rural sports day race',
  },
  {
    id: 'gallery-2',
    url: '/images/grassroots/g2.png',
    alt: 'Indian girls celebrating together after winning a village race',
  },
  {
    id: 'gallery-3',
    url: '/images/grassroots/g3.png',
    alt: 'Indian children practicing relay baton handoff with coach cheering on a village field',
  },
  {
    id: 'gallery-4',
    url: '/images/grassroots/g4.png',
    alt: 'Indian children warming up together before village games at a rural school',
  },
  {
    id: 'gallery-5',
    url: '/images/grassroots/g5.png',
    alt: 'Indian children playing kho-kho during a village sports day',
  },
  {
    id: 'gallery-6',
    url: '/images/grassroots/g6.png',
    alt: 'Indian families cheering children at a village sports field',
  },
  {
    id: 'gallery-7',
    url: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Sports cones and equipment on field',
  },
  {
    id: 'gallery-8',
    url: '/images/grassroots/g8.png',
    alt: 'Indian children having fun in a wheelbarrow race at a school sports festival',
  },
]

export const orgImpactStats: ImpactStat[] = [
  { id: 'org-villages', value: '120+', label: 'Villages Reached', scope: 'org' },
  { id: 'org-athletes', value: '2,500+', label: 'Athletes in Programs', scope: 'org' },
  { id: 'org-equipment', value: '800+', label: 'Equipment Kits Provided', scope: 'org' },
  { id: 'org-girls', value: '45%', label: 'Girls Participating', scope: 'org' },
]

export const eventImpactStats: ImpactStat[] = [
  { id: 'children', value: '500+', label: 'Children Participating', scope: 'event' },
  { id: 'games', value: '15+', label: 'Games & Activities', scope: 'event' },
  { id: 'volunteers', value: '80+', label: 'Community Volunteers', scope: 'event' },
  { id: 'schools', value: '20+', label: 'Schools Represented', scope: 'event' },
]

/** @deprecated Use orgImpactStats or eventImpactStats */
export const impactStats = orgImpactStats

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
