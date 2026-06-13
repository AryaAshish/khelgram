export type SupportContent = {
  title: string
  description: string
  donateUrl: string
  donateQrImage?: string
  fundsUsage: string[]
}

const defaultSupport: SupportContent = {
  title: 'Support Our Mission',
  description:
    'Your contribution helps us run grassroots sports programs, training camps, and inclusive events across rural communities.',
  donateUrl: 'https://khelgram.org/donate',
  fundsUsage: [
    'Equipment and coaching',
    'Village outreach camps',
    'Scholarships for talented athletes',
  ],
}

export function getSupportContent(settingsMap: Record<string, string>): SupportContent {
  const fundsUsage = (settingsMap.support_funds_usage ?? defaultSupport.fundsUsage.join('\n'))
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    title: settingsMap.support_title ?? defaultSupport.title,
    description: settingsMap.support_description ?? defaultSupport.description,
    donateUrl: settingsMap.donate_url ?? defaultSupport.donateUrl,
    donateQrImage: settingsMap.donate_qr_image || undefined,
    fundsUsage: fundsUsage.length ? fundsUsage : defaultSupport.fundsUsage,
  }
}
