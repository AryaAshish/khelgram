export type VisualAssetTag = 'rural' | 'training' | 'girls' | 'event' | 'community'

export type VisualAsset = {
  url: string
  alt: string
  tag: VisualAssetTag
}

export const visualAssets = {
  orgHero: {
    url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Children celebrating together after a village sports day',
    tag: 'rural',
  },
  aboutCommunity: {
    url: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Coach guiding children during outdoor training',
    tag: 'training',
  },
  girlsSports: {
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    alt: 'Girls running during a grassroots sports program',
    tag: 'girls',
  },
  festivalAction: {
    url: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
    alt: 'Children having fun in team activities at a sports festival',
    tag: 'event',
  },
} satisfies Record<string, VisualAsset>

export const orgHeroEyebrow = '120+ villages reached'
