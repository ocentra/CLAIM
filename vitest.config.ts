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
  
  // Check if R2 Worker is configured
  const r2WorkerUrl = finalEnv.VITE_R2_WORKER_URL || process.env.VITE_R2_WORKER_URL || ''
  const hasR2Config = Boolean(r2WorkerUrl)
  
  // Check if load tests should be skipped (default: false - run them if Solana is available)
  const skipLoadTests = finalEnv.SKIP_LOAD_TESTS === 'true' || process.env.SKIP_LOAD_TESTS === 'true'
  
  // Check if Solana tests should be skipped (default: false - run them if Solana is available)
  const skipSolanaTests = finalEnv.SKIP_SOLANA_TESTS === 'true' || process.env.SKIP_SOLANA_TESTS === 'true'
  
  // Build exclude list conditionally
  const excludePatterns = [
    '**/node_modules/**',
    '**/dist/**',
    '**/network/__tests__/e2e/**', // Exclude Playwright E2E tests (WebRTC/P2P browser tests)
    '**/*.e2e.spec.ts', // Exclude Playwright spec files
    'Rust/**', // Exclude Rust TypeScript tests (run via anchor test in build-rust job)
  ]
  
  // Conditionally exclude load tests only if explicitly skipped
  if (skipLoadTests) {
    excludePatterns.push('**/__tests__/load/**') // Exclude load tests directory
  }
  // Otherwise, load tests will run (they check SKIP_LOAD_TESTS internally too)
  
  // Conditionally exclude Solana integration tests only if explicitly skipped
  if (skipSolanaTests) {
    excludePatterns.push('**/services/__tests__/integration/**') // Exclude Solana integration tests
    excludePatterns.push('**/services/__tests__/e2e/**') // Also exclude Solana e2e tests
  }
  // Otherwise, Solana integration tests AND Solana e2e tests will run (they check SKIP_SOLANA_TESTS internally too)
  
  // Conditionally exclude integration/e2e tests based on R2 configuration
  if (hasR2Config) {
    // R2 is configured - allow R2 tests
    // Note: Solana e2e tests in **/services/__tests__/e2e/** are regular Vitest tests (not Playwright)
    // They will run unless skipSolanaTests is true (handled above)
    // Only exclude R2Service.e2e.test.ts if NOT explicitly running it
    if (!process.argv.some(arg => arg.includes('R2Service.e2e.test.ts'))) {
      excludePatterns.push('**/R2Service.e2e.test.ts')
    }
    // R2Service.integration.test.ts and R2Service.hello.test.ts will now run!
    // Solana e2e tests in **/services/__tests__/e2e/** will also run unless skipSolanaTests is true
  } else {
    // R2 is NOT configured - exclude R2 tests, but allow Solana integration tests if Solana is available
    excludePatterns.push(
      '**/R2Service.hello.test.ts', // Explicitly exclude R2 hello test
      '**/R2Service.integration.test.ts', // Explicitly exclude R2 integration test
      '**/R2Service.e2e.test.ts', // Explicitly exclude R2 e2e test
    )
    // Note: Solana integration tests in **/services/__tests__/integration/** will run
    // unless skipSolanaTests is true (handled above)
    // Note: Solana e2e tests in **/services/__tests__/e2e/** will run unless skipSolanaTests is true
  }
  
  return {
    define: {
      // Map environment variables to import.meta.env for Vite-style env vars
      'import.meta.env.VITE_R2_WORKER_URL': JSON.stringify(r2WorkerUrl),
      'import.meta.env.VITE_R2_BUCKET_NAME': JSON.stringify(finalEnv.VITE_R2_BUCKET_NAME || process.env.VITE_R2_BUCKET_NAME || 'claim-matches-test'),
      'import.meta.env.VITE_STORAGE_FALLBACK_FIREBASE': JSON.stringify(finalEnv.VITE_STORAGE_FALLBACK_FIREBASE || process.env.VITE_STORAGE_FALLBACK_FIREBASE || 'false'),
    },
    test: {
      environment: 'jsdom',
      globals: true, // Use global describe/it/expect - do NOT import from 'vitest' in test files
      setupFiles: ['./src/utils/__tests__/setup.ts'],
      exclude: excludePatterns,
      reporter: ['verbose', 'json'], // verbose shows file/test names, json for parsing
      outputFile: {
        json: './test-results/test-results.json',
      },
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
      '@test-data': resolve(__dirname, './test-data/loaders'),
    },
  },
  }
})