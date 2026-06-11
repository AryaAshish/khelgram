export function moveListItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= items.length) {
    return items
  }

  const next = [...items]
  const [moved] = next.splice(index, 1)
  if (moved === undefined) {
    return items
  }

  next.splice(targetIndex, 0, moved)
  return next
}
