import { describe, expect, it, vi } from 'vitest'
import { downloadCsv } from './exportCsv'

describe('exportCsv', () => {
  it('creates a downloadable CSV blob', () => {
    const click = vi.fn()
    const createObjectURL = vi.fn(() => 'blob:url')
    const revokeObjectURL = vi.fn()

    vi.stubGlobal('URL', {
      createObjectURL,
      revokeObjectURL,
    })

    const createElement = vi.spyOn(document, 'createElement').mockReturnValue({
      click,
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement)

    downloadCsv(
      [
        { Name: 'Asha', Message: 'Hello, world' },
        { Name: 'Ravi', Message: 'Line two' },
      ],
      'leads.csv',
    )

    expect(createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:url')

    createElement.mockRestore()
  })
})
