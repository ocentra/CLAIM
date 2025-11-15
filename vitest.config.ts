import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import { config } from 'dotenv'

export default defineConfig(({ mode = 'test' }) => {
  // Load environment variables from .env file
  // Use 'test' mode to load .env.test, but also check .env
  const env = loadEnv(mode, process.cwd(), '')
  // Also load from .env directly (dotenv in setup.ts handles this, but ensure it's available here too)
  const envFile = config({ path: resolve(process.cwd(), '.env') })
  const finalEnv = { ...env, ...envFile.parsed }
  
  return {
    define: {
      // Map environment variables to import.meta.env for Vite-style env vars
      'import.meta.env.VITE_R2_WORKER_URL': JSON.stringify(finalEnv.VITE_R2_WORKER_URL || process.env.VITE_R2_WORKER_URL || ''),
      'import.meta.env.VITE_R2_BUCKET_NAME': JSON.stringify(finalEnv.VITE_R2_BUCKET_NAME || process.env.VITE_R2_BUCKET_NAME || 'claim-matches-test'),
      'import.meta.env.VITE_STORAGE_FALLBACK_FIREBASE': JSON.stringify(finalEnv.VITE_STORAGE_FALLBACK_FIREBASE || process.env.VITE_STORAGE_FALLBACK_FIREBASE || 'false'),
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/utils/__tests__/setup.ts'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/e2e/**', // Exclude Playwright E2E tests
        '**/*.e2e.spec.ts',
        // Exclude R2Service.e2e.test.ts from regular test runs (requires Worker to be running)
        // Run it explicitly with: npm run test:storage:e2e
        // Only exclude if NOT explicitly running this specific file
        ...(process.argv.some(arg => arg.includes('R2Service.e2e.test.ts')) ? [] : ['**/R2Service.e2e.test.ts']),
        // Conditionally exclude integration/load tests if SKIP_SOLANA_TESTS is set
        ...(process.env.SKIP_SOLANA_TESTS === 'true' ? [
          '**/integration/**',
          '**/load/**',
        ] : []),
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'dist/',
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/__tests__/',
          '**/e2e/**',
          'scripts/',
          'Rust/',
        ],
      },
    },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@lib': resolve(__dirname, './src/lib'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@services': resolve(__dirname, './src/services'),
      '@providers': resolve(__dirname, './src/providers'),
      '@constants': resolve(__dirname, './src/constants'),
      '@types': resolve(__dirname, './src/types'),
      '@ui': resolve(__dirname, './src/ui'),
      '@config': resolve(__dirname, './src/config'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },
  }
})