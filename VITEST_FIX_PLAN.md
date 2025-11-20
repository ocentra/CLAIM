# Vitest 4.x Compatibility Fix Plan

## Problem
With `globals: true` in Vitest 4.x, importing `describe`, `it`, `expect`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll` from 'vitest' causes "No test suite found" error. These must be used as **globals** instead.

## Rules
1. **REMOVE** these imports: `describe`, `it`, `expect`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`
2. **KEEP** these imports: `vi` (NOT a global, must be imported)
3. **KEEP** type imports: `import type { ... } from 'vitest'`
4. **USE** globals directly: `describe()`, `it()`, `expect()`, etc. without importing

## Files to Fix (in order of complexity)

### Phase 1: Cleanup & Setup Files
1. ✅ Delete temporary files:
   - `src/simple.test.ts`
   - `src/global-simple.test.ts`
   - `vitest.minimal.config.ts`

2. ✅ Fix `src/utils/__tests__/vitest-hooks.ts`
   - Remove: `import { beforeEach, afterEach } from 'vitest'`
   - Use globals: `beforeEach()`, `afterEach()` directly

3. ✅ Verify `src/utils/__tests__/setup.ts`
   - Keep: `import { vi } from 'vitest'` (vi is NOT a global)
   - Already correct

### Phase 2: Simple Unit Tests (no mocks/hooks)
4. `src/services/storage/__tests__/StorageConfig.test.ts`
   - Remove: `import { describe, it, expect } from 'vitest'`
   - Use globals

5. `src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts`
   - Remove: `import { describe, it, expect } from 'vitest'`
   - Use globals

6. `src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts`
   - Remove: `import { describe, it, expect } from 'vitest'`
   - Use globals

7. `src/lib/serialization/__tests__/Serializable.spec.ts`
   - Remove: `import { afterEach, describe, expect, it } from 'vitest'`
   - Use globals: `describe()`, `it()`, `expect()`, `afterEach()`

8. `src/lib/eventing/__tests__/EventBus.spec.ts`
   - Remove: `import { describe, expect, it } from 'vitest'`
   - Use globals

### Phase 3: Tests with beforeEach/afterEach
9. `src/engine/logic/__tests__/DeckManager.test.ts`
   - Remove: `import { describe, it, expect, beforeEach } from 'vitest'`
   - Use globals: `describe()`, `it()`, `expect()`, `beforeEach()`

10. `src/engine/logic/__tests__/RuleEngine.test.ts`
    - Remove: `import { describe, it, expect, beforeEach } from 'vitest'`
    - Use globals

11. `src/engine/logic/__tests__/ScoreCalculator.test.ts`
    - Remove: `import { describe, it, expect, beforeEach } from 'vitest'`
    - Use globals

12. `src/engine/__tests__/GameEngine.test.ts`
    - Remove: `import { describe, it, expect, beforeEach } from 'vitest'`
    - Use globals

### Phase 4: Tests with vi (mocks)
13. `src/network/__tests__/WebRTCHandler.test.ts`
    - Remove: `import { describe, it, expect, beforeEach, vi } from 'vitest'`
    - Keep: `import { vi } from 'vitest'` (vi is NOT a global)
    - Use globals: `describe()`, `it()`, `expect()`, `beforeEach()`

14. `src/network/__tests__/P2PManager.test.ts`
    - Remove: `import { describe, it, expect, vi, beforeEach } from 'vitest'`
    - Keep: `import { vi } from 'vitest'`
    - Use globals

15. `src/utils/__tests__/assetManager.test.ts`
    - Remove: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'`
    - Keep: `import { vi } from 'vitest'`
    - Use globals: `describe()`, `it()`, `expect()`, `beforeEach()`, `afterEach()`

16. `src/services/storage/__tests__/HotStorageService.test.ts`
    - Remove: `import { describe, it, expect, beforeEach, vi } from 'vitest'`
    - Keep: `import { vi } from 'vitest'`
    - Use globals

17. `src/services/storage/__tests__/R2Service.test.ts`
    - Remove: `import { describe, it, expect, beforeEach, vi } from 'vitest'`
    - Keep: `import { vi } from 'vitest'`
    - Use globals

18. `src/services/storage/__tests__/R2Service.integration.test.ts`
    - Remove: `import { describe, it, expect, beforeEach, vi } from 'vitest'`
    - Keep: `import { vi } from 'vitest'`
    - Use globals

### Phase 5: Tests with beforeAll/afterAll
19. `src/services/storage/__tests__/R2Service.hello.test.ts`
    - Remove: `import { describe, it, expect, beforeAll, afterAll } from 'vitest'`
    - Use globals: `describe()`, `it()`, `expect()`, `beforeAll()`, `afterAll()`

20. `src/services/storage/__tests__/R2Service.e2e.test.ts`
    - Remove: `import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'`
    - Use globals

21. `src/services/__tests__/e2e/solana-integration.test.ts`
    - Remove: `import { describe, it, expect, beforeAll, afterAll } from 'vitest'`
    - Use globals

### Phase 6: Integration & Load Tests
22. `src/services/__tests__/integration/match-lifecycle.test.ts`
    - Remove: `import { describe, it, expect, beforeEach } from 'vitest'`
    - Use globals

23. `src/services/__tests__/integration/verification-workflow.test.ts`
    - Remove: `import { describe, it, expect } from 'vitest'`
    - Use globals

24. `src/services/__tests__/load/match-creation.test.ts`
    - Remove: `import { describe, it, expect } from 'vitest'`
    - Use globals

25. `src/services/__tests__/load/merkle-batching.test.ts`
    - Remove: `import { describe, it, expect } from 'vitest'`
    - Use globals

26. `src/services/__tests__/e2e/full-match-lifecycle.test.ts`
    - Remove: `import { describe, it, expect, beforeEach } from 'vitest'`
    - Use globals

### Phase 7: Skip (for now)
- `src/services/__tests__/benchmarks/*.bench.ts` - Benchmark files may need different handling

## Process for Each File

1. **Read the file** - Understand its structure
2. **Identify imports** - Find all `import { ... } from 'vitest'` lines
3. **Separate imports**:
   - Globals to remove: `describe`, `it`, `expect`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`
   - Keep: `vi` (if present)
   - Keep: `import type { ... }` (if present)
4. **Update import line**:
   - If only globals: Remove entire import line
   - If has `vi`: Keep only `import { vi } from 'vitest'`
   - If has types: Keep type import separate
5. **Check linter** - Run linter on the file
6. **Run test** - `npx vitest run <file-path>` to verify it works
7. **Mark complete** - Update TODO list

## Example Transformations

### Example 1: Simple (no vi)
**Before:**
```typescript
import { describe, it, expect } from 'vitest'
```

**After:**
```typescript
// Using globals from vitest.config.ts (globals: true)
```

### Example 2: With vi
**Before:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
```

**After:**
```typescript
import { vi } from 'vitest' // vi is NOT a global, must be imported
```

### Example 3: With types
**Before:**
```typescript
import { describe, it, expect } from 'vitest'
import type { Mock } from 'vitest'
```

**After:**
```typescript
// Using globals from vitest.config.ts (globals: true)
import type { Mock } from 'vitest' // Type imports are fine
```

## Verification Checklist

After fixing each file:
- [ ] Linter passes (no errors)
- [ ] Test runs successfully: `npx vitest run <file-path>`
- [ ] No "No test suite found" error
- [ ] All tests in file pass

## Notes

- **DO NOT** use shortcuts or scripts - fix manually
- **DO NOT** skip linter checks
- **DO NOT** skip running tests after each fix
- Fix **ONE file at a time**
- Verify **EACH file** before moving to next

