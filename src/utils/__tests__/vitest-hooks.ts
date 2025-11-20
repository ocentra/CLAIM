/**
 * Vitest Hooks - Automatically capture test results and console logs
 * 
 * This file hooks into Vitest's test lifecycle to automatically record
 * test results in the report generator, similar to Rust's mocha-hooks.ts
 */

import { beforeEach, afterEach } from 'vitest';
import { reportGenerator, type TestReportData } from './test-report-generator';

// Track test start times
const testStartTimes = new Map<string, number>();
// Track per-test logs
const testLogs = new Map<string, string[]>();
// Original console methods (to restore after each)
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

function attachConsoleCapture(key: string) {
  testLogs.set(key, []);
  const sink = testLogs.get(key)!;
  const toLine = (args: unknown[]): string => args.map((a) => {
    if (typeof a === 'string') return a;
    try { return JSON.stringify(a); } catch { return String(a); }
  }).join(' ');
  
  console.log = (...args: unknown[]) => {
    sink.push(toLine(args));
    originalConsole.log.apply(console, args);
  };
  console.info = (...args: unknown[]) => {
    sink.push(toLine(args));
    originalConsole.info.apply(console, args);
  };
  console.warn = (...args: unknown[]) => {
    sink.push(toLine(args));
    originalConsole.warn.apply(console, args);
  };
  console.error = (...args: unknown[]) => {
    sink.push(toLine(args));
    originalConsole.error.apply(console, args);
  };
  console.debug = (...args: unknown[]) => {
    sink.push(toLine(args));
    originalConsole.debug.apply(console, args);
  };
}

function detachConsoleCapture() {
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.debug = originalConsole.debug;
}

// Get suite name from test context
function getSuiteName(test: any): string {
  if (!test) return 'Unknown Suite';
  
  // Try to get suite from test's file path or name
  const filePath = test.file?.name || test.filepath || '';
  const suiteName = test.suite?.name || test.task?.suite?.name || '';
  
  if (suiteName) {
    return `${filePath} > ${suiteName}`;
  }
  return filePath || 'Unknown Suite';
}

// Use a WeakMap to track test keys per task (cleaner than global)
const taskKeyMap = new WeakMap<any, string>();

// Hook into Vitest's beforeEach
beforeEach((ctx) => {
    // In Vitest, we can access the task from context in beforeEach
    const task = (ctx as any).task;
    if (task) {
      const testName = task.name || task.id || 'unknown';
      const fileName = task.file?.name || 'unknown';
      const testKey = `${fileName}|${testName}`;

      taskKeyMap.set(task, testKey);
      testStartTimes.set(testKey, Date.now());
      attachConsoleCapture(testKey);
    } else {
      // Fallback: use timestamp-based key
      const fallbackKey = `test-${Date.now()}-${Math.random()}`;
      (ctx as any).__testKey = fallbackKey;
      testStartTimes.set(fallbackKey, Date.now());
      attachConsoleCapture(fallbackKey);
    }
  });

  // Hook into Vitest's afterEach
  afterEach((ctx) => {
    // Get test info from context - Vitest provides task in afterEach
    const task = ctx.task;
    if (!task) {
      // Try fallback key
      const fallbackKey = (ctx as any).__testKey;
      if (fallbackKey) {
        testStartTimes.delete(fallbackKey);
        testLogs.delete(fallbackKey);
      }
      detachConsoleCapture();
      return;
    }

    const testName = task.name || task.id || 'unknown';
    const fileName = task.file?.name || 'unknown';
    const testKey = taskKeyMap.get(task) || `${fileName}|${testName}`;

    const startTime = testStartTimes.get(testKey) || Date.now();
    const duration = Date.now() - startTime;
    testStartTimes.delete(testKey);
    const logs = testLogs.get(testKey) || [];
    testLogs.delete(testKey);
    detachConsoleCapture();

    // Determine status from Vitest task
    let status: 'passed' | 'failed' | 'skipped' = 'skipped';
    if (task.result?.state === 'pass') {
      status = 'passed';
    } else if (task.result?.state === 'fail') {
      status = 'failed';
    } else if (task.mode === 'skip' || task.skip) {
      status = 'skipped';
    }

    const result: TestReportData = {
      suite: getSuiteName(task),
      test: testName,
      file: fileName,
      status,
      duration,
      logs,
      error: task.result?.error ? {
        message: task.result.error.message || String(task.result.error),
        stack: task.result.error.stack,
      } : undefined,
    };

    reportGenerator.addResult(result);
});
