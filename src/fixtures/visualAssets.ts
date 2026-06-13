export type VisualAssetTag = 'rural' | 'training' | 'girls' | 'event' | 'community' | 'inspiration'

export type VisualAsset = {
  url: string
  alt: string
  tag: VisualAssetTag
  /** ChatGPT / AI image prompt — replace `/images/grassroots/*.svg` with your generated WebP/JPEG. */
  aiPrompt?: string
}

export type ChampionAthlete = {
  name: string
  sport: string
  url: string
  alt: string
  credit: string
}

/** Publicly licensed athlete photos (Wikimedia Commons / Government of India open data). */
export const championAthletes: ChampionAthlete[] = [
  {
    name: 'P. V. Sindhu',
    sport: 'Badminton · Olympic & Commonwealth medallist',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/P_V_SINDHU_with_Olympics_silver.jpg',
    alt: 'P. V. Sindhu holding her Olympic silver medal',
    credit: 'Prashant123japla / Wikimedia Commons (CC BY-SA 4.0)',
  },
  {
    name: 'Neeraj Chopra',
    sport: 'Javelin · Olympic & Commonwealth gold medallist',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Neeraj_Chopra_Of_India%28Javelin%29.jpg',
    alt: 'Neeraj Chopra competing for India in javelin',
    credit: 'Athletics Federation of India / Wikimedia Commons (CC BY-SA 4.0)',
  },
  {
    name: 'Mary Kom',
    sport: 'Boxing · Olympic & Commonwealth medallist',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Padma_Vibhushan_Mary_Kom.jpg',
    alt: 'Mary Kom, Indian boxing champion',
    credit: 'Press Information Bureau, Government of India (GODL India)',
  },
]

/** Prompts for AI-generated grassroots imagery. Save outputs to `public/images/grassroots/` (same basename, .webp or .jpg). */
export const grassrootsImagePrompts = {
  orgHero:
    'Photorealistic wide shot of Indian children aged 8–12 in simple village clothes, laughing and playing kho-kho on dusty ground outside a rural school in North India. Warm golden afternoon light, modest village backdrop with trees and brick buildings. Documentary NGO photography style, hopeful and authentic. No text, no logos, no watermark.',
  aboutCommunity:
    'Photorealistic scene of an Indian volunteer coach in a plain t-shirt guiding a small group of rural children during outdoor sports practice on a village field. Children in school uniforms or simple clothes, football cones and homemade equipment visible. Empathetic documentary tone, soft natural light. No text, no logos.',
  girlsSports:
    'Photorealistic portrait-style scene of Indian girls aged 10–14 in sports bibs, running a friendly race on a village school ground during a grassroots sports day. Confident smiles, dusty track, modest rural India setting. Warm, empowering mood. No text, no logos.',
  festivalAction:
    'Photorealistic energetic scene of Indian children aged 6–14 at a village sports festival: sack race, cheering parents in background, colourful bunting on bamboo poles, medals on simple table. Joyful community celebration in rural India. No text, no logos.',
  galleryGirlsRace:
    'Photorealistic Indian schoolgirls sprinting during a rural sports day race, side angle, motion and dust, cheering classmates blurred in background. North Indian village school ground. No text.',
  galleryChildrenCelebrate:
    'Photorealistic group of Indian children hugging and celebrating after winning a village relay race, genuine joy, simple clothes, late afternoon sun. Rural India sports day. No text.',
  galleryRelayPractice:
    'Photorealistic Indian children practicing baton handoff for a relay on a dusty village field, coach clapping nearby. Documentary sports NGO style. No text.',
  galleryWarmup:
    'Photorealistic Indian children in mixed group doing warm-up stretches before village games, barefoot on grass, rural school backdrop. No text.',
  galleryVillageGames:
    'Photorealistic wide shot of Indian children playing traditional village games (gilli-danda or kho-kho) with peers watching, earthy tones, authentic rural setting. No text.',
  galleryFamiliesCheer:
    'Photorealistic Indian mothers and fathers cheering from the side of a village sports field, children competing in background, emotional proud expressions. Rural India. No text.',
  galleryTeamActivities:
    'Photorealistic Indian children in coloured teams doing a fun group game at a sports festival, laughter and teamwork, rural outdoor setting. No text.',
} as const

export const visualAssets = {
  orgHero: {
    url: '/images/grassroots/gHome.png',
    alt: 'Indian children playing kho-kho during a village sports day',
    tag: 'rural',
    aiPrompt: grassrootsImagePrompts.orgHero,
  },
  aboutCommunity: {
    url: '/images/grassroots/gAbout.png',
    alt: 'Indian coach guiding children during football training on a village field',
    tag: 'training',
    aiPrompt: grassrootsImagePrompts.aboutCommunity,
  },
  girlsSports: {
    url: '/images/grassroots/gGirls.png',
    alt: 'Indian girls running together during a grassroots sports day race',
    tag: 'girls',
    aiPrompt: grassrootsImagePrompts.girlsSports,
  },
  festivalAction: {
    url: '/images/grassroots/gKhel.png',
    alt: 'Indian children in a sack race at a village sports festival with families cheering',
    tag: 'event',
    aiPrompt: grassrootsImagePrompts.festivalAction,
  },
} satisfies Record<string, VisualAsset>

export const orgHeroEyebrow = '120+ villages reached'
