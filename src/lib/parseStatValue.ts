export function parseNumericValue(
  value: string,
): { prefix: string; number: number; suffix: string } | null {
  const match = value.match(/^([^0-9]*)([0-9,]+)(.*)$/)
  if (!match) {
    return null
  }

  const [, prefix, rawNumber, suffix] = match
  const number = Number(rawNumber.replace(/,/g, ''))
  if (Number.isNaN(number)) {
    return null
  }

  return { prefix: prefix ?? '', number, suffix: suffix ?? '' }
}
