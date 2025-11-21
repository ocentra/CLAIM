# Phase 01 – Core Serializable Foundation

## Objective

Make supporting classes Serializable so GameMode can be data-driven. Foundation for asset system where all game data lives in `.asset` files.

## Current Baseline

- `GameRulesContainer` exists as a class but is not Serializable
- `CardRanking` exists but may be a utility class, not a Serializable data structure
- No `ISaveGameModeAsset` interface exists for save contract
- GameMode still uses hardcoded methods instead of Serializable properties

## Deliverables

1. **GameRulesContainer Serializable** - Make it a Serializable class with data properties, remove constructor if needed
2. **CardRanking Serializable** - Change from utility class to Serializable data structure (array of CardRanking objects)
3. **ISaveGameModeAsset Interface** - Define interface with `saveChanges(): Promise<void>` method for save contract

## Implementation Checklist

**Phase Status:** ⬜ Not Started

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: GameRulesContainer Serializable with data properties
- [ ] Deliverable 2: CardRanking as Serializable data structure
- [ ] Deliverable 3: ISaveGameModeAsset interface created

### Implementation Steps
- [ ] **Step 1:** Make `GameRulesContainer` Serializable
  - File: `src/gameMode/GameRulesContainer.ts`
  - Add `@serializable()` decorator
  - Convert to data properties: `LLM: string`, `Player: string`
  - Remove constructor if it exists, use property initialization
  - **Reference:** [../Lib/serialization.md](../Lib/serialization.md) - How to use `@serializable()` decorator
  - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/GameRulesContainer.cs`
  
- [ ] **Step 2:** Refactor `CardRanking` to Serializable data structure
  - File: `src/gameMode/CardRanking.ts`
  - Create interface/class with `CardName: string` and `Value: number`
  - Make it Serializable with `@serializable()` decorator
  - Change from utility class to data structure (array of CardRanking objects)
  - **Reference:** [../Lib/serialization.md](../Lib/serialization.md) - How to serialize arrays with `elementType`
  - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/CardRanking.cs`

- [ ] **Step 3:** Create `ISaveGameModeAsset` interface
  - File: `src/gameMode/interfaces/ISaveGameModeAsset.ts` (new)
  - Define interface with `saveChanges(): Promise<void>` method
  - Reference: `References/Scripts/OcentraAI/LLMGames/Interfaces/ISaveScriptable.cs`
  - Simple interface for save contract

- [ ] **Step 4:** Test serialization/deserialization
  - Verify `GameRulesContainer` serializes/deserializes correctly
  - Verify `CardRanking[]` array serializes/deserializes correctly
  - Use `serialize()` and `deserialize()` from `@lib/serialization`
  - **Reference:** [../Lib/serialization.md](../Lib/serialization.md) - How to use Serializable system

- [ ] **Step 5:** **After ANY code change in this phase:** Run full test suite: `npm run type-check && npm run lint && npm test`. This ensures TypeScript code stays in sync and passes all checks.

### Testing Checklist
- [ ] Unit test: `GameRulesContainer` serializes/deserializes correctly
- [ ] Unit test: `CardRanking[]` array serializes/deserializes correctly
- [ ] Unit test: `ISaveGameModeAsset` interface is correctly defined
- [ ] Type check: All files pass TypeScript compilation

### Exit Criteria Checklist
- [ ] GameRulesContainer is Serializable with data properties
- [ ] CardRanking is a Serializable data structure
- [ ] ISaveGameModeAsset interface created
- [ ] All serialization tests passing
- [ ] Type check passing: `npm run type-check`
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- `src/gameMode/GameRulesContainer.ts` - Make Serializable
- `src/gameMode/CardRanking.ts` - Refactor to data structure
- New: `src/gameMode/interfaces/ISaveGameModeAsset.ts` - Save interface
- `src/lib/serialization/Serializable.ts` - Reference for `@serializable()` decorator

## Testing & Validation

- Unit tests verifying `GameRulesContainer` and `CardRanking[]` serialize/deserialize correctly
- Type check ensuring all changes compile without errors
- Verify serialization preserves data integrity (round-trip test)

## Risks & Mitigations

- **Serialization compatibility:** Use schema versioning from `@lib/serialization` to handle future changes
- **Type safety:** Ensure all Serializable properties are properly typed to catch errors early

## Exit Criteria

- All supporting classes are Serializable
- Serialization tests passing
- Type check passing
- Ready for Phase 2 (GameMode base refactor)

## Related Docs

- [GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Overall plan
- [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Unity patterns
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/GameRulesContainer.cs` - Unity reference
- `src/lib/serialization/Serializable.ts` - Serializable implementation

