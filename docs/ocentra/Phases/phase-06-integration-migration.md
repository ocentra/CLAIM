# Phase 06 – Integration & Migration

## Objective

Update all consumers of GameMode to use the new asset system, migrate existing data, and verify everything works end-to-end. This is the final integration phase.

## Current Baseline

- Asset system is built (Phases 1-5)
- Asset files exist and load correctly
- But consumers (AIManager, UI components, etc.) may still access GameMode in old ways
- GameModeFactory may still have old patterns
- Layout data may still be separate from game data

## Deliverables

1. **AIManager Updated** - Load GameMode from assets instead of instantiating classes
2. **UI Components Updated** - Ensure all UI works with asset-loaded GameMode
3. **GameModeFactory Updated** - Remove old class registry, use asset-only pattern
4. **Data Migration** - Ensure all existing data works with new system
5. **End-to-End Testing** - Verify entire system works

## Implementation Checklist

**Phase Status:** ⬜ Not Started

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: AIManager loads GameMode from assets
- [ ] Deliverable 2: All UI components work with asset-loaded GameMode
- [ ] Deliverable 3: GameModeFactory uses asset-only pattern
- [ ] Deliverable 4: All existing data migrated/verified
- [ ] Deliverable 5: End-to-end system tested

### Implementation Steps
- [ ] **Step 1:** Update AIManager to use asset system
  - File: `src/ai/AIManager.ts`
  - Change from: `new ClaimGameMode()` or `GameModeFactory.getGameMode('claim')`
  - Change to: `await GameModeAssetManager.getInstance().getGameMode('claim')`
  - Ensure it handles async loading
  - Reference: Current AIManager implementation

- [ ] **Step 2:** Update GameModeFactory
  - File: `src/gameMode/GameModeFactory.ts`
  - Remove class registry pattern if still exists
  - Use asset manager exclusively
  - Fallback: Only if asset not found and class exists, instantiate (for new games during development)
  - Remove hardcoded class mapping

- [ ] **Step 3:** Update UI components that use GameMode
  - Files: Any UI components that access GameMode
  - Check: `src/ui/gameMode/gameModes.ts`
  - Check: Any components that use `getGameModeConfig()` or similar
  - Ensure they work with asset-loaded GameMode
  - Verify property access works (instead of method calls)

- [ ] **Step 4:** Update GameEditor to load from assets
  - File: `src/ui/pages/dev/GameEditorPage.tsx`
  - Change game selection to load from manifest
  - Load `.asset` file when editing
  - Save both layout AND game data to `.asset` file
  - Remove hardcoded game list

- [ ] **Step 5:** Merge layout data (if desired)
  - Decide: Keep `GameModeConfig/claim.json` separate OR merge into `GameMode/claim.asset`
  - If merging: Update asset schema, migrate layout data, update loaders
  - If separate: Ensure `layoutAssetPath` references work correctly
  - Recommendation: Keep separate for now, can merge later

- [ ] **Step 6:** Update AIHelper (if exists)
  - File: `src/ai/AIHelper.ts` (if it exists)
  - Ensure it uses GameMode properties (not methods)
  - Verify system prompt generation works with asset data
  - Reference: [ai-prompts.md](../ai-prompts.md)

- [ ] **Step 7:** Test end-to-end flow
  - Test: App startup → Asset manager scans → Assets load
  - Test: AIManager uses asset-loaded GameMode → AI prompts work
  - Test: UI components use asset-loaded GameMode → Game displays correctly
  - Test: GameEditor loads/saves assets → Changes persist
  - Test: All game functionality works as before

- [ ] **Step 8:** Performance testing
  - Verify asset loading is fast (caching works)
  - Verify no regressions in app startup time
  - Verify memory usage is acceptable

- [ ] **Step 9:** **After ANY code change in this phase:** Run full test suite: `npm run type-check && npm run lint && npm test`. This ensures TypeScript code stays in sync and passes all checks.

### Testing Checklist
- [ ] Integration test: AIManager uses asset-loaded GameMode
- [ ] Integration test: UI components work with asset-loaded GameMode
- [ ] Integration test: GameEditor loads/saves assets correctly
- [ ] End-to-end test: Full game flow works (start → play → end)
- [ ] Performance test: Asset loading is fast
- [ ] Regression test: All existing functionality still works

### Exit Criteria Checklist
- [ ] AIManager uses asset system
- [ ] All UI components work with asset-loaded GameMode
- [ ] GameModeFactory uses asset-only pattern
- [ ] All existing data migrated/verified
- [ ] End-to-end system tested and working
- [ ] All tests passing
- [ ] Type check passing: `npm run type-check`
- [ ] Performance acceptable
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- `src/ai/AIManager.ts` - Update to use asset manager
- `src/gameMode/GameModeFactory.ts` - Update to asset-only pattern
- `src/ui/gameMode/gameModes.ts` - Verify works with assets
- `src/ui/pages/dev/GameEditorPage.tsx` - Update to load from assets
- `src/ai/AIHelper.ts` - Update if exists (ensure uses properties)

## Testing & Validation

- Integration tests ensuring all consumers work with asset system
- End-to-end tests verifying full game flow works
- Performance tests ensuring no regressions
- Regression tests ensuring existing functionality still works

## Risks & Mitigations

- **Breaking changes:** Ensure all consumers are updated, test thoroughly
- **Performance:** Asset loading should be cached, verify no slowdowns
- **Data migration:** Ensure existing data works correctly with new system

## Exit Criteria

- All consumers use asset system
- End-to-end system works correctly
- Performance acceptable
- Ready for production use

## Related Docs

### Implementation Guides
- [gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - **Read for Step 1 & 6** - Shows how AIHelper uses GameMode properties, which to access
- [gamemode-ui-usage.md](../Gamemode/gamemode-ui-usage.md) - **Read for Step 3** - Shows which properties UI components need
- [gamemode-network-usage.md](../Gamemode/gamemode-network-usage.md) - **Read if using GameMode for game config** - Shows which properties provide defaults (TurnDuration, MaxRounds)
- [gamemode-editor-usage.md](../Gamemode/gamemode-editor-usage.md) - **Read for Step 4** - Shows Unity editor pattern for reference

### Planning Docs
- [GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Overall plan (Phase 6 section)
- [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Unity patterns
- [ai-prompts.md](../ai-prompts.md) - AI integration
- [game-editor-system.md](../game-editor-system.md) - Editor integration
- [Phase 05](../Phases/phase-05-asset-file-system.md) - Asset file system (must complete first)

