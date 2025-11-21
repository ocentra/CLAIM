# Phase 03 – ClaimGameMode Refactor

## Objective

Convert `ClaimGameMode` from hardcoded method returns to data-driven properties. Set all game-specific values as properties that can be loaded from `.asset` files.

## Current Baseline

- `ClaimGameMode` extends `GameMode` and implements methods like `getGameRules()`, `getStrategyTips()`, etc. with hardcoded returns
- No data properties set (methods just return hardcoded strings/values)
- Not using Serializable properties from GameMode base class
- Game-specific config is hardcoded in methods

## Deliverables

1. **Data-Driven ClaimGameMode** - Remove hardcoded method returns, use properties instead
2. **Property Initialization** - Override initialization methods to populate data
3. **Claim-Specific Properties** - Add all Claim game config as properties

## Implementation Checklist

**Phase Status:** ⬜ Not Started

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: ClaimGameMode is data-driven (uses properties)
- [ ] Deliverable 2: Initialization methods populate properties
- [ ] Deliverable 3: All Claim-specific config as properties

### Implementation Steps
- [ ] **Step 1:** Remove hardcoded method implementations
  - File: `src/gameMode/ClaimGameMode.ts`
  - Remove methods: `getGameRules()`, `getStrategyTips()`, `getCardRanking()`, etc.
  - These are now property accesses: `this.gameRules`, `this.strategyTips`, `this.cardRankings`

- [ ] **Step 2:** Override initialization methods
  - File: `src/gameMode/ClaimGameMode.ts`
  - Override `InitializeGameRules()` to set:
    - `this.gameRules.Player = "..."`
    - `this.gameRules.LLM = "..."`
  - Override `InitializeCardRankings()` to populate `this.cardRankings` array
  - Override other initialization methods as needed
  - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs`

- [ ] **Step 3:** Set Claim-specific config properties
  - File: `src/gameMode/ClaimGameMode.ts`
  - Set in constructor or initialization:
    - `this.maxPlayers = 4`
    - `this.numberOfCards = 3`
    - `this.maxRounds = 10`
    - `this.turnDuration = 60`
    - `this.initialPlayerCoins = 10000`
    - `this.baseBet = 5`
    - `this.layoutAssetPath = "/GameModeConfig/claim.json"`
  - Set other Claim-specific properties as needed

- [ ] **Step 4:** Set game rules and strategy tips
  - File: `src/gameMode/ClaimGameMode.ts`
  - Populate `this.gameRules`, `this.gameDescription`, `this.strategyTips`
  - Use existing hardcoded strings from methods as starting point
  - Convert to GameRulesContainer format

- [ ] **Step 5:** Set card rankings
  - File: `src/gameMode/ClaimGameMode.ts`
  - Populate `this.cardRankings` array
  - Create CardRanking objects for standard deck (A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2)
  - Set values according to Claim game rules

- [ ] **Step 6:** Set move validity and other dictionaries
  - File: `src/gameMode/ClaimGameMode.ts`
  - Populate `this.moveValidityConditions`, `this.bluffSettings`, `this.exampleHands`
  - Convert from existing hardcoded data

- [ ] **Step 7:** Test ClaimGameMode works
  - Verify all properties are accessible
  - Verify initialization methods populate data correctly
  - Test serialization/deserialization

- [ ] **Step 8:** **After ANY code change in this phase:** Run full test suite: `npm run type-check && npm run lint && npm test`. This ensures TypeScript code stays in sync and passes all checks.

### Testing Checklist
- [ ] Unit test: ClaimGameMode properties are set correctly
- [ ] Unit test: Initialization methods populate data
- [ ] Unit test: Serialization/deserialization works
- [ ] Integration test: AIManager still works with ClaimGameMode
- [ ] Integration test: UI components still work with ClaimGameMode

### Exit Criteria Checklist
- [ ] ClaimGameMode is data-driven (uses properties)
- [ ] All initialization methods populate properties
- [ ] All Claim-specific config set as properties
- [ ] All consumers (AIManager, UI) still work
- [ ] Type check passing: `npm run type-check`
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- `src/gameMode/ClaimGameMode.ts` - Major refactor to data-driven
- `src/ai/AIManager.ts` - May need updates if it accesses methods (see Phase 6)
- `src/ui/gameMode/gameModes.ts` - May need updates if it uses ClaimGameMode directly

## Testing & Validation

- Unit tests verifying ClaimGameMode properties are set correctly
- Integration tests ensuring AIManager and UI components still work
- Serialization tests ensuring ClaimGameMode serializes/deserializes correctly

## Risks & Mitigations

- **Consumer updates needed:** AIManager and other consumers may need updates if they access methods (deferred to Phase 6)
- **Data migration:** Existing hardcoded data needs to be moved to properties correctly

## Exit Criteria

- ClaimGameMode is fully data-driven
- All properties set correctly
- All consumers still work (or identified for Phase 6)
- Ready for Phase 4 (Asset Manager)

## Related Docs

### Implementation Guides
- [gamemode-initialization-pattern.md](../Gamemode/gamemode-initialization-pattern.md) - **Read for Steps 2-4** - Shows how to override initialization methods

### Planning Docs
- [GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Overall plan (Phase 3 section)
- [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Unity patterns
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs` - Unity reference (concrete example)
- [Phase 02](../Phases/phase-02-gamemode-base-refactor.md) - GameMode base refactor (must complete first)

