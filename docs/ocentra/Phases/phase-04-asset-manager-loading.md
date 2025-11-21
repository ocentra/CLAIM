# Phase 04 – Asset Manager & Loading

## Objective

Build the asset scanning and loading system that discovers `.asset` files, loads them, deserializes them into GameMode instances, and caches them. Mirrors Unity's `GameModeManager` pattern.

## Current Baseline

- No asset manager exists
- GameModeFactory still uses class registry pattern
- No way to scan and load `.asset` files from `public/GameMode/`
- No manifest system for asset discovery
- Assets don't exist yet (will be created in Phase 5)

## Deliverables

1. **GameModeAssetManager** - Singleton manager that scans, loads, and caches assets
2. **Asset Discovery** - Manifest-based system to discover all `.asset` files
3. **Asset Loading** - HTTP fetch + deserialize pattern for loading assets
4. **GameModeFactory Integration** - Update factory to use asset manager

## Implementation Checklist

**Phase Status:** ⬜ Not Started

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: GameModeAssetManager created with scanning/loading/caching
- [ ] Deliverable 2: Manifest system for asset discovery
- [ ] Deliverable 3: Asset loading (fetch + deserialize) working
- [ ] Deliverable 4: GameModeFactory uses asset manager

### Implementation Steps
- [ ] **Step 1:** Create GameModeAssetManager class
  - File: `src/gameMode/GameModeAssetManager.ts` (new)
  - Singleton pattern (like Unity's GameModeManager)
  - Properties:
    - `private cache: Map<string, GameMode>` - Cache loaded assets
    - `private manifest: Record<string, string> | null` - Asset manifest
  - Methods:
    - `async scanAssets(): Promise<void>` - Scans folder and loads manifest
    - `async getGameMode(id: string): Promise<GameMode | null>` - Gets cached instance
    - `async loadAsset(path: string): Promise<GameMode>` - Loads and deserializes single asset
    - `getAllGameModeIds(): string[]` - Returns all loaded game IDs
  - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameModeManager.cs`

- [ ] **Step 2:** Implement manifest loading
  - File: `src/gameMode/GameModeAssetManager.ts`
  - `scanAssets()` method:
    - Fetches `/GameMode/manifest.json`
    - Parses manifest: `{ "claim": "claim.asset", "poker": "poker.asset", ... }`
    - Stores manifest for later use
  - Note: Manifest will be auto-generated in Phase 5, for now can be manually created or empty

- [ ] **Step 3:** Implement asset loading
  - File: `src/gameMode/GameModeAssetManager.ts`
  - `loadAsset(path: string)` method:
    - Fetches `/GameMode/${path}`
    - Parses JSON
    - Deserializes using `deserialize(GameMode, json)` from `@lib/serialization`
    - Returns GameMode instance
  - Handle schema migration if needed

- [ ] **Step 4:** Implement caching
  - File: `src/gameMode/GameModeAssetManager.ts`
  - `getGameMode(id: string)` method:
    - Checks cache first
    - If not cached, loads from manifest
    - Stores in cache
    - Returns cached instance

- [ ] **Step 5:** Update GameModeFactory to use AssetManager
  - File: `src/gameMode/GameModeFactory.ts`
  - Change from class registry to asset loading:
    - `getGameMode(id)` → calls `GameModeAssetManager.getGameMode(id)`
    - Fallback to class instantiation if asset not found (for new games)
  - Remove hardcoded class mapping if possible

- [ ] **Step 6:** Initialize asset manager on app startup
  - File: `src/gameMode/index.ts` or app entry point
  - Call `GameModeAssetManager.getInstance().scanAssets()` on startup
  - Or lazy-load on first access

- [ ] **Step 7:** Test asset loading
  - Create test `.asset` file manually (or wait for Phase 5)
  - Test manifest loading
  - Test asset loading and deserialization
  - Test caching works

- [ ] **Step 8:** **After ANY code change in this phase:** Run full test suite: `npm run type-check && npm run lint && npm test`. This ensures TypeScript code stays in sync and passes all checks.

### Testing Checklist
- [ ] Unit test: Manifest loading works
- [ ] Unit test: Asset loading works (with test `.asset` file)
- [ ] Unit test: Caching works correctly
- [ ] Unit test: GameModeFactory uses asset manager
- [ ] Integration test: Asset manager discovers and loads assets

### Exit Criteria Checklist
- [ ] GameModeAssetManager created with all methods
- [ ] Manifest system working
- [ ] Asset loading (fetch + deserialize) working
- [ ] GameModeFactory uses asset manager
- [ ] All tests passing
- [ ] Type check passing: `npm run type-check`
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- New: `src/gameMode/GameModeAssetManager.ts` - Asset manager
- `src/gameMode/GameModeFactory.ts` - Update to use asset manager
- `src/gameMode/index.ts` - Export asset manager
- `public/GameMode/manifest.json` - Asset manifest (created in Phase 5)

## Testing & Validation

- Unit tests verifying manifest loading, asset loading, and caching work correctly
- Integration tests ensuring GameModeFactory works with asset manager
- Test with mock `.asset` file to verify deserialization works

## Risks & Mitigations

- **Asset files don't exist yet:** Create test `.asset` file manually or wait for Phase 5
- **Manifest generation:** Manual manifest creation for now, auto-generation in Phase 5

## Exit Criteria

- Asset manager fully implemented and tested
- GameModeFactory uses asset manager
- Ready for Phase 5 (create actual `.asset` files)

## Related Docs

### Implementation Guides
- [gamemode-discovery-pattern.md](../Gamemode/gamemode-discovery-pattern.md) - **Read this for Steps 1-3** - Shows exact Unity discovery pattern and how to replicate it

### Planning Docs
- [GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Overall plan (Phase 4 section)
- [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Unity patterns (Asset Loading Pattern section)
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameModeManager.cs` - Unity reference
- [Phase 03](../Phases/phase-03-claimgamemode-refactor.md) - ClaimGameMode refactor (should complete first)

