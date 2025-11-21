# Phase 02 – GameMode Base Refactor

## Objective

Convert `GameMode` base class to be Serializable and data-driven. Replace hardcoded methods with Serializable properties that can be loaded from `.asset` files.

## Current Baseline

- `GameMode` is an abstract class with methods like `getGameRules()`, `getStrategyTips()`, etc. that return hardcoded values
- No Serializable properties yet (depends on Phase 1)
- No initialization pattern like Unity's `TryInitializeGameMode()`
- Properties are not data-driven

## Deliverables

1. **GameMode Serializable** - Make GameMode Serializable with all properties decorated
2. **Data Properties** - Convert methods to Serializable properties (gameRules, cardRankings, etc.)
3. **Initialization Pattern** - Add `TryInitialize()` method pattern (like Unity)
4. **Save Contract** - Implement `ISaveGameModeAsset` interface

## Implementation Checklist

**Phase Status:** ⬜ Not Started

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: GameMode is Serializable with all properties
- [ ] Deliverable 2: All methods converted to Serializable properties
- [ ] Deliverable 3: Initialization pattern added
- [ ] Deliverable 4: Save contract implemented

### Implementation Steps
- [ ] **Step 1:** Add Serializable decorator to GameMode class
  - File: `src/gameMode/GameMode.ts`
  - Add `@serializable()` class decorator
  - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs`

- [ ] **Step 2:** Convert abstract methods to Serializable properties
  - File: `src/gameMode/GameMode.ts`
  - Properties to add:
    - `@serializable() gameRules: GameRulesContainer`
    - `@serializable() gameDescription: GameRulesContainer`
    - `@serializable() strategyTips: GameRulesContainer`
    - `@serializable() cardRankings: CardRanking[]`
    - `@serializable() moveValidityConditions: Record<string, string>`
    - `@serializable() bluffSettings: Record<string, string>`
    - `@serializable() exampleHands: string[]`
    - `@serializable() aiStrategyParameters: Record<string, number>`
    - `@serializable() maxRounds: number`
    - `@serializable() turnDuration: number`
    - `@serializable() maxPlayers: number`
    - `@serializable() numberOfCards: number`
    - `@serializable() initialPlayerCoins: number`
    - `@serializable() baseBet: number`
    - `@serializable() layoutAssetPath?: string` (reference to layout JSON)
  - Remove old methods: `getGameRules()`, `getStrategyTips()`, etc.
  - Keep validation logic in methods that read from properties

- [ ] **Step 3:** Add initialization pattern
  - File: `src/gameMode/GameMode.ts`
  - Add `TryInitialize(): boolean` method pattern (like Unity)
  - Add `InitializeGameRules()`, `InitializeCardRankings()`, etc. methods
  - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 145-316)
  - These methods set default values and can be overridden in derived classes
  - **Unity Pattern Reference:** [gamemode-initialization-pattern.md](../Gamemode/gamemode-initialization-pattern.md) - Shows exact initialization flow

- [ ] **Step 4:** Implement ISaveGameModeAsset interface
  - File: `src/gameMode/GameMode.ts`
  - Implement `saveChanges(): Promise<void>` method
  - This will call asset manager to save (implementation in Phase 5)

- [ ] **Step 5:** Add schema versioning
  - File: `src/gameMode/GameMode.ts`
  - Add `@serializable() schemaVersion: number` property
  - Default to 1, increment on breaking changes

- [ ] **Step 6:** Test serialization/deserialization
  - Verify all properties serialize/deserialize correctly
  - Test initialization pattern works
  - Test that abstract methods are replaced by properties

- [ ] **Step 7:** **After ANY code change in this phase:** Run full test suite: `npm run type-check && npm run lint && npm test`. This ensures TypeScript code stays in sync and passes all checks.

### Testing Checklist
- [ ] Unit test: All Serializable properties serialize/deserialize correctly
- [ ] Unit test: Initialization pattern works correctly
- [ ] Unit test: Schema versioning works
- [ ] Type check: GameMode is still abstract but Serializable
- [ ] Integration test: ClaimGameMode still works (if exists)

### Exit Criteria Checklist
- [ ] GameMode is Serializable with all properties
- [ ] All methods converted to properties
- [ ] Initialization pattern added
- [ ] Save contract implemented
- [ ] All serialization tests passing
- [ ] Type check passing: `npm run type-check`
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- `src/gameMode/GameMode.ts` - Major refactor to Serializable
- `src/gameMode/ClaimGameMode.ts` - May need updates (see Phase 3)
- `src/gameMode/GameRulesContainer.ts` - Used by GameMode (from Phase 1)
- `src/gameMode/CardRanking.ts` - Used by GameMode (from Phase 1)

## Testing & Validation

- Unit tests verifying all Serializable properties serialize/deserialize correctly
- Type check ensuring GameMode is still abstract but Serializable
- Verify initialization pattern works as expected
- Test that derived classes can override initialization methods

## Risks & Mitigations

- **Breaking changes:** Ensure ClaimGameMode and other consumers still work (may need Phase 3 first)
- **Property initialization:** Ensure all properties have default values or are initialized in `TryInitialize()`

## Exit Criteria

- GameMode is fully Serializable and data-driven
- All properties converted from methods
- Initialization pattern working
- Ready for Phase 3 (ClaimGameMode refactor)

## Related Docs

### Implementation Guides
- [gamemode-initialization-pattern.md](../Gamemode/gamemode-initialization-pattern.md) - **Read this for Step 3** - Shows exact initialization flow and methods to add
- [gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - **Read for Step 2** - Shows which properties AIHelper needs (GameRules.LLM, BonusRules, etc.)
- [gamemode-ui-usage.md](../Gamemode/gamemode-ui-usage.md) - **Read for Step 2** - Shows which properties UI needs (GameRules.Player, GameDescription.Player, etc.)
- [gamemode-network-usage.md](../Gamemode/gamemode-network-usage.md) - **Read for Step 2** - Shows which properties are needed for game configuration (TurnDuration, MaxRounds defaults)

### Planning Docs
- [GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Overall plan (Phase 2 section)
- [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Unity patterns
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 17-341) - Unity reference
- [Phase 01](../Phases/phase-01-core-serializable-foundation.md) - Foundation (must complete first)

