import { describe, expect, it } from 'vitest'
import { moveListItem } from './sortableList.logic'

const items = ['a', 'b', 'c']

describe('moveListItem', () => {
  it('returns original list when moving up from first index', () => {
    expect(moveListItem(items, 0, -1)).toEqual(items)
  })

  it('returns original list when moving down from last index', () => {
    expect(moveListItem(items, 2, 1)).toEqual(items)
  })

  it('returns original list when index is out of bounds', () => {
    expect(moveListItem(items, 5, 1)).toEqual(items)
  })

  it('moves an item up', () => {
    expect(moveListItem(items, 1, -1)).toEqual(['b', 'a', 'c'])
  })

  it('moves an item down', () => {
    expect(moveListItem(items, 1, 1)).toEqual(['a', 'c', 'b'])
  })

  it('does not mutate the original array', () => {
    const original = [...items]
    moveListItem(items, 1, -1)
    expect(items).toEqual(original)
  })

  it('works with object items', () => {
    const members = [
      { id: '1', name: 'First' },
      { id: '2', name: 'Second' },
    ]

    expect(moveListItem(members, 1, -1)).toEqual([
      { id: '2', name: 'Second' },
      { id: '1', name: 'First' },
    ])
  })
})
