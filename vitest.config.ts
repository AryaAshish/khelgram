import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['e2e/**', 'node_modules/**'],
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: [
          'src/services/**',
          'src/hooks/**',
          'src/components/**',
          'src/pages/**',
          'src/lib/utils.ts',
          'src/lib/registrationEmail.ts',
        ],
        exclude: ['src/types/**', 'src/lib/supabase.ts', 'src/test/**'],
        thresholds: {
          lines: 95,
          branches: 93,
          functions: 95,
        },
      },
    },
  }),
)
