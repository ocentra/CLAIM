# Phase 05 – Asset File System

## Objective

Create the actual `.asset` file format, generate initial asset files from existing game data, and extend the save API to support saving `.asset` files. This is where game data becomes truly data-driven.

## Current Baseline

- No `.asset` files exist yet
- Game data is hardcoded in ClaimGameMode (migrated in Phase 3)
- Layout data exists in `public/GameModeConfig/claim.json`
- Save API only handles layout saves, not full `.asset` files
- No manifest generation system

## Deliverables

1. **Asset File Format** - Define `.asset` JSON schema with all game data
2. **Initial Asset Files** - Create `claim.asset` from existing ClaimGameMode data
3. **Manifest Generation** - Auto-generate `manifest.json` from available `.asset` files
4. **Save API Extension** - Extend Vite middleware to save `.asset` files

## Implementation Checklist

**Phase Status:** ⬜ Not Started

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: `.asset` JSON schema defined and documented
- [ ] Deliverable 2: Initial `claim.asset` file created
- [ ] Deliverable 3: Manifest generation working
- [ ] Deliverable 4: Save API extended for `.asset` files

### Implementation Steps
- [ ] **Step 1:** Define `.asset` JSON schema
  - Document structure in `docs/ocentra/GameData/asset-schema.md` or similar
  - Schema should match serialized GameMode structure:
    ```json
    {
      "__schemaVersion": 1,
      "__assetType": "GameMode",
      "__assetId": "claim",
      "metadata": { ... },
      "gameConfig": { ... },
      "rules": { ... },
      "uiAssets": { ... },
      "aiConfig": { ... }
    }
    ```
  - Reference: [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Asset File Structure section

- [ ] **Step 2:** Create initial `claim.asset` file
  - File: `public/GameMode/claim.asset` (new)
  - Extract all data from ClaimGameMode (from Phase 3)
  - Include:
    - Game rules, strategy tips, card rankings
    - Game config (maxPlayers, numberOfCards, etc.)
    - Layout reference: `"layoutAssetPath": "/GameModeConfig/claim.json"`
    - AI config (strategy parameters)
  - Can be created manually or via script that serializes ClaimGameMode

- [ ] **Step 3:** Create manifest generation
  - Option A: Vite plugin to scan `public/GameMode/*.asset` and generate manifest
  - Option B: Script that runs on dev server startup
  - Option C: Manual manifest for now (simpler)
  - Manifest format: `{ "claim": "claim.asset", "poker": "poker.asset", ... }`
  - File: `public/GameMode/manifest.json`

- [ ] **Step 4:** Extend save API for `.asset` files
  - File: `vite.config.ts` (middleware)
  - Add endpoint: `POST /__dev/api/save-game-mode-asset`
  - Accept payload:
    ```json
    {
      "gameId": "claim",
      "asset": { ... full asset JSON ... }
    }
    ```
  - Save to: `public/GameMode/${gameId}.asset`
  - Regenerate manifest after save
  - Reference existing layout save endpoint pattern

- [ ] **Step 5:** Test asset file loading
  - Verify `claim.asset` loads correctly via GameModeAssetManager
  - Verify deserialization creates valid ClaimGameMode instance
  - Verify all properties are loaded correctly

- [ ] **Step 6:** Test save API
  - Test saving `.asset` file via API
  - Verify file is created correctly
  - Verify manifest is regenerated
  - Verify reloading works

- [ ] **Step 7:** Merge layout data (optional)
  - Decide: Keep layouts separate OR merge into `.asset` file
  - If merging: Include layout data in `uiAssets.layout` property
  - If separate: Keep `uiAssets.layoutAssetPath` reference
  - Recommendation: Keep separate for now (easier migration)

- [ ] **Step 8:** **After ANY code change in this phase:** Run full test suite: `npm run type-check && npm run lint && npm test`. This ensures TypeScript code stays in sync and passes all checks.

### Testing Checklist
- [ ] Unit test: `.asset` file schema is valid
- [ ] Unit test: `claim.asset` loads correctly
- [ ] Unit test: Deserialization creates valid GameMode
- [ ] Integration test: Save API creates `.asset` file
- [ ] Integration test: Manifest generation works
- [ ] Integration test: Asset manager loads from `.asset` file

### Exit Criteria Checklist
- [ ] `.asset` JSON schema defined
- [ ] Initial `claim.asset` file created
- [ ] Manifest generation working
- [ ] Save API extended for `.asset` files
- [ ] All tests passing
- [ ] Type check passing: `npm run type-check`
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- New: `public/GameMode/claim.asset` - First asset file
- New: `public/GameMode/manifest.json` - Asset manifest
- `vite.config.ts` - Extend middleware for `.asset` saves
- `src/gameMode/GameModeAssetManager.ts` - Will load from `.asset` files (from Phase 4)
- `docs/ocentra/GameData/asset-schema.md` - Schema documentation (optional)

## Testing & Validation

- Unit tests verifying `.asset` file schema and loading
- Integration tests ensuring save API creates files correctly
- Test full cycle: Save → Load → Verify data integrity

## Risks & Mitigations

- **Schema evolution:** Use `__schemaVersion` to handle future changes
- **Data migration:** Ensure existing ClaimGameMode data migrates correctly to `.asset` format

## Exit Criteria

- Asset file format defined and working
- Initial asset files created
- Save/load cycle working end-to-end
- Ready for Phase 6 (update all consumers)

## Related Docs

### Implementation Guides
- [gamemode-editor-usage.md](../Gamemode/gamemode-editor-usage.md) - **Read for Steps 4 & 7** - Shows Unity editor pattern for reference
- [gamemode-discovery-pattern.md](../Gamemode/gamemode-discovery-pattern.md) - **Read for Step 3** - Shows manifest generation pattern

### Planning Docs
- [GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Overall plan (Phase 5 section)
- [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Unity patterns (Asset File Structure section)
- [Phase 04](../Phases/phase-04-asset-manager-loading.md) - Asset manager (should complete first)

