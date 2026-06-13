import { CircleDot, Flag, Medal, Timer, Trophy, Users, Zap, type LucideIcon } from 'lucide-react'
import type { GameIconName } from '@/lib/gameIcons'
import type { Game } from '@/types/app.types'

const iconByName: Record<Exclude<GameIconName, ''>, LucideIcon> = {
  trophy: Trophy,
  medal: Medal,
  flag: Flag,
  timer: Timer,
  users: Users,
  zap: Zap,
}

const slugIconHints: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /race|relay|sprint/i, icon: Timer },
  { match: /football|soccer|ball/i, icon: CircleDot },
  { match: /team|group/i, icon: Users },
  { match: /flag|march/i, icon: Flag },
]

export function resolveGameEventIcon(game: Pick<Game, 'slug' | 'icon' | 'name'>): LucideIcon {
  if (game.icon && game.icon in iconByName) {
    return iconByName[game.icon as Exclude<GameIconName, ''>]
  }

  const slug = game.slug ?? game.name
  for (const hint of slugIconHints) {
    if (hint.match.test(slug)) {
      return hint.icon
    }
  }

  return Trophy
}
