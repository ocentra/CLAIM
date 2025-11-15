# Test Report Generation

## Overview

The test suite automatically generates formatted markdown reports after test runs. Reports include comprehensive information about test execution, results, and failures.

## Report Location

Reports are saved to: `test-reports/test-report-YYYY-MM-DD-HHMMSS.md`

Example: `test-reports/test-report-2024-01-15T14-30-45.md`

## Report Contents

### Header Section
- **Date**: Full date (e.g., "Monday, January 15, 2024")
- **Time**: 24-hour format (e.g., "14:30:45")
- **Timestamp**: ISO 8601 format

### Environment Section
- **Cluster**: localnet, devnet, or mainnet
- **Program ID**: Solana program ID
- **Node Version**: Node.js version
- **Platform**: Operating system
- **Architecture**: CPU architecture

### Summary Section
- **Total Tests**: Count of all tests
- **Passed**: Count and percentage of passed tests
- **Failed**: Count and percentage of failed tests
- **Skipped**: Count and percentage of skipped tests
- **Duration**: Total test execution time
- **Overall Status**: ✅ PASSED or ❌ FAILED

### Test Suites Section
For each test suite:
- Suite name with status indicator
- Table of all tests with status and duration
- Suite summary (passed/failed/skipped counts)

### Failed Tests Details Section
For each failed test:
- Test name and suite
- Error message
- Context (if available from TestContext)
- Stack trace (truncated to first 20 lines)

## Usage

### Automatic Generation

Reports are automatically generated when:
1. Tests complete normally
2. Process exits (including Ctrl+C)
3. Tests are run via `anchor test`

### Manual Generation

You can also manually generate reports by importing and using the report generator:

```typescript
import { reportGenerator } from './report-generator';

// Add test results
reportGenerator.addResult({
  suite: 'My Test Suite',
  test: 'My Test',
  status: 'passed',
  duration: 1234,
});

// Generate and save report
const filepath = reportGenerator.saveReport();
console.log(`Report saved to: ${filepath}`);
```

## Integration with TestContext

The `TestContext` helper can be extended to automatically record results:

```typescript
import { createTestContext } from './helpers';
import { reportGenerator } from './report-generator';

it('My test', async () => {
  const ctx = createTestContext('My test');
  const startTime = Date.now();
  
  try {
    // ... test code ...
    const duration = Date.now() - startTime;
    
    reportGenerator.addResult({
      suite: 'My Suite',
      test: 'My test',
      status: 'passed',
      duration,
    });
    
    ctx.finish();
  } catch (err) {
    const duration = Date.now() - startTime;
    
    reportGenerator.addResult({
      suite: 'My Suite',
      test: 'My test',
      status: 'failed',
      duration,
      error: {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        context: Object.fromEntries(ctx['context']), // Access private context
      },
    });
    
    throw err;
  }
});
```

## Report Format

Reports are formatted as Markdown with:
- Tables for structured data
- Code blocks for error messages and stack traces
- Status indicators (✅ ❌ ⏭️)
- Clear section headers
- Footer with generation timestamp

## Example Report

```markdown
# Test Report

**Date:** Monday, January 15, 2024  
**Time:** 14:30:45  
**Timestamp:** 2024-01-15T14:30:45.123Z

## Environment

| Property | Value |
|----------|-------|
| Cluster | localnet |
| Program ID | `7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696` |
| Node Version | v18.17.0 |
| Platform | win32 |
| Architecture | x64 |

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Tests** | 25 | 100% |
| ✅ **Passed** | 23 | 92.0% |
| ❌ **Failed** | 2 | 8.0% |
| ⏭️ **Skipped** | 0 | 0.0% |
| ⏱️ **Duration** | 45.23s | - |

### Overall Status: ❌ **FAILED**

## Test Suites

### ✅ Simple Tests (Phase 1)

| Test | Status | Duration |
|------|--------|----------|
| Program is loaded | ✅ passed | 0.001s |
| Can derive GameRegistry PDA | ✅ passed | 0.002s |

...
```

## Notes

- Reports are saved to `test-reports/` directory (gitignored)
- Each report has a unique timestamp-based filename
- Reports include full context for failed tests when using `TestContext`
- Stack traces are truncated to prevent extremely long reports

