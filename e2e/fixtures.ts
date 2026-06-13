import { test as base, expect } from '@playwright/test'

type ConsoleMessage = {
  type: string
  text: string
}

function isBenignConsoleError(text: string): boolean {
  const ignored = [
    'favicon.ico',
    'Download the React DevTools',
    'React Router Future Flag Warning',
    'Failed to load resource: the server responded with a status of 404',
    'Failed to load resource: the server responded with a status of 400',
  ]
  return ignored.some((fragment) => text.includes(fragment))
}

export const test = base.extend({
  page: async ({ page }, use) => {
    const consoleErrors: ConsoleMessage[] = []
    const pageErrors: string[] = []

    page.on('console', (message) => {
      if (message.type() === 'error' && !isBenignConsoleError(message.text())) {
        consoleErrors.push({ type: message.type(), text: message.text() })
      }
    })

    page.on('pageerror', (error) => {
      pageErrors.push(error.message)
    })

    await use(page)

    expect(
      consoleErrors,
      `Unexpected console errors:\n${consoleErrors.map((entry) => entry.text).join('\n')}`,
    ).toEqual([])
    expect(pageErrors, `Unexpected page errors:\n${pageErrors.join('\n')}`).toEqual([])
  },
})

export { expect } from '@playwright/test'
