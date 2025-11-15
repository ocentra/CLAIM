/**
 * Mocha Hooks - Automatically capture test results for report generation
 * 
 * This file hooks into Mocha's test lifecycle to automatically record
 * test results in the report generator.
 * 
 * Uses Mocha's root hooks (afterEach) to capture all test results.
 */

import { reportGenerator, type TestReportData } from './report-generator';

// Track test start times
const testStartTimes = new Map<string, number>();

// Get suite name from test's parent chain
function getSuiteName(test: Mocha.Test): string {
  let current: Mocha.Suite | undefined = test.parent;
  const suiteNames: string[] = [];
  
  while (current) {
    if (current.title) {
      suiteNames.unshift(current.title);
    }
    current = current.parent;
  }
  
  return suiteNames.join(' > ') || 'Unknown Suite';
}

// Hook into Mocha's root hooks
// These run for all tests automatically when Mocha is available
// Use a try-catch to handle cases where Mocha isn't loaded yet

try {
  // Access Mocha's root hooks via global
  const mocha = (global as any).mocha || (global as any).Mocha;
  
  if (mocha && typeof mocha.beforeEach === 'function') {
    mocha.beforeEach(function(this: Mocha.Context) {
      const test = this.currentTest;
      if (test) {
        testStartTimes.set(test.fullTitle(), Date.now());
      }
    });
  }

  if (mocha && typeof mocha.afterEach === 'function') {
    mocha.afterEach(function(this: Mocha.Context) {
      const test = this.currentTest;
      if (!test) return;

      const testKey = test.fullTitle();
      const startTime = testStartTimes.get(testKey) || Date.now();
      const duration = Date.now() - startTime;
      testStartTimes.delete(testKey);

      // Determine status
      let status: 'passed' | 'failed' | 'skipped' = 'skipped';
      if (test.state === 'passed') {
        status = 'passed';
      } else if (test.state === 'failed') {
        status = 'failed';
      } else if (test.pending) {
        status = 'skipped';
      }

      const result: TestReportData = {
        suite: getSuiteName(test),
        test: test.title || 'Unknown Test',
        status,
        duration,
        error: test.err ? {
          message: test.err.message || String(test.err),
          stack: test.err.stack,
        } : undefined,
      };

      reportGenerator.addResult(result);
    });
  }
} catch (err) {
  // Mocha might not be available yet - that's okay, hooks will be registered when tests run
  console.warn('[mocha-hooks] Could not register hooks immediately:', err);
}

// Also try to register hooks directly if they're available on global
if (typeof (global as any).beforeEach === 'function') {
  (global as any).beforeEach(function(this: Mocha.Context) {
    const test = this.currentTest;
    if (test) {
      testStartTimes.set(test.fullTitle(), Date.now());
    }
  });
}

if (typeof (global as any).afterEach === 'function') {
  (global as any).afterEach(function(this: Mocha.Context) {
    const test = this.currentTest;
    if (!test) return;

    const testKey = test.fullTitle();
    const startTime = testStartTimes.get(testKey) || Date.now();
    const duration = Date.now() - startTime;
    testStartTimes.delete(testKey);

    // Determine status
    let status: 'passed' | 'failed' | 'skipped' = 'skipped';
    if (test.state === 'passed') {
      status = 'passed';
    } else if (test.state === 'failed') {
      status = 'failed';
    } else if (test.pending) {
      status = 'skipped';
    }

    const result: TestReportData = {
      suite: getSuiteName(test),
      test: test.title || 'Unknown Test',
      status,
      duration,
      error: test.err ? {
        message: test.err.message || String(test.err),
        stack: test.err.stack,
      } : undefined,
    };

    reportGenerator.addResult(result);
  });
}

