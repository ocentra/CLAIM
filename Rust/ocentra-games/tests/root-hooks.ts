/**
 * Mocha Root Hooks - Automatically capture test results
 * 
 * This file uses Mocha's root hooks API to capture all test results.
 * Root hooks run for all tests automatically.
 * 
 * Usage: This file is loaded via --require flag in Anchor.toml
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

// Register root hooks - these run for ALL tests
// Mocha will call these automatically when tests run

// @ts-ignore - Mocha root hooks
export const mochaHooks = {
  beforeEach(this: Mocha.Context) {
    const test = this.currentTest;
    if (test) {
      testStartTimes.set(test.fullTitle(), Date.now());
    }
  },

  afterEach(this: Mocha.Context) {
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
  },
};

