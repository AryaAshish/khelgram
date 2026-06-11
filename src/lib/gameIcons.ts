export const gameIconOptions = [
  { value: '', label: 'No icon' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'medal', label: 'Medal' },
  { value: 'flag', label: 'Flag' },
  { value: 'timer', label: 'Timer' },
  { value: 'users', label: 'Users' },
  { value: 'zap', label: 'Zap' },
] as const

export type GameIconName = (typeof gameIconOptions)[number]['value']
