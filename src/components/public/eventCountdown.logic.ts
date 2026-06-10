export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function calculateTimeLeft(targetDate: string): CountdownParts {
  const totalMs = new Date(targetDate).getTime() - Date.now()

  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60)
  const seconds = Math.floor((totalMs / 1000) % 60)

  return { days, hours, minutes, seconds }
}
