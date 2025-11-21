# Phase 8: AI Integration

**Status:** ⏳ Not Started  
**Prerequisites:** Rules Asset System (Phase 7) must be complete  
**Dependencies:** [Phase 07 - Rules Asset System](./phase-07-rules-asset-system.md)

---

## Objective

Integrate AI system with GameMode and Rules assets. Update AIHelper to use asset-based prompts. Ensure event-driven communication between AI and Engine domains. Verify AI prompts are built correctly from GameMode and Rules assets.

---

## Current State vs Target State

### Current State (Before Phase 8)

**AI System (Partially Implemented):**
- `src/ai/AIHelper.ts` - Exists, but may not use asset-based GameMode/Rules
- `src/ai/AIManager.ts` - Exists, manages AI engines
- Prompt construction pattern exists (see `AIHelper.GetSystemMessage()`)

**Issues:**
- AI may not be fully integrated with GameMode assets
- AI may not be fully integrated with Rules assets
- Event-driven communication may need verification

### Target State (After Phase 8)

**AI System (Fully Integrated):**
- `AIHelper` uses GameMode assets for prompts
- `AIHelper` uses Rules assets for prompts
- Event-driven communication verified between AI and Engine
- AI prompts correctly built from GameMode and Rules assets

---

## Deliverables

1. ✅ `AIHelper` updated to use asset-based GameMode
2. ✅ `AIHelper` updated to use asset-based Rules (via GameMode)
3. ✅ Event-driven communication verified (AI ↔ Engine)
4. ✅ AI prompts correctly built from GameMode and Rules
5. ✅ AI system works with Claim game mode
6. ✅ AI system ready for other game modes

---

## Implementation Steps

### Step 1: Update AIHelper to Use Asset-Based GameMode

**Task:** Ensure `AIHelper` uses GameMode assets (not hardcoded).

**Files:**
- `src/ai/AIHelper.ts`
- `src/gameMode/GameModeFactory.ts`

**Current State:**
- `AIHelper.GetSystemMessage(gameMode: GameMode)` - Already takes GameMode parameter
- `AIHelper.GetUserPrompt(playerId: string)` - Queries game state via events

**Steps:**
1. Verify `AIHelper` receives GameMode from `GameModeFactory`
2. Verify `AIHelper` accesses GameMode properties (not methods)
3. Verify GameMode properties are Serializable (from asset)

**Checklist:**
- [ ] Verify `AIHelper` uses `GameModeFactory.getGameMode('claim')`
- [ ] Verify `AIHelper.GetSystemMessage()` accesses GameMode properties
- [ ] Verify GameMode properties are loaded from assets
- [ ] Test AI prompts built from asset-based GameMode

**Reference:**
- [AILogic/ai-prompt-construction.md](../AILogic/ai-prompt-construction.md) - How prompts are built
- [AILogic/ai-event-driven-pattern.md](../AILogic/ai-event-driven-pattern.md) - Event-driven data sourcing
- [Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - Which GameMode properties AIHelper needs
- [Phase 02 - GameMode Base Refactor](./phase-02-gamemode-base-refactor.md) - GameMode properties are Serializable
- [../Lib/eventbus.md](../Lib/eventbus.md) - EventBus system (AI uses for game state queries)

---

### Step 2: Update AIHelper to Use Asset-Based Rules

**Task:** Ensure `AIHelper` uses Rules assets (via GameMode).

**Files:**
- `src/ai/AIHelper.ts`
- `src/gameMode/ClaimGameMode.ts` (references Rules asset)

**Current State:**
- `AIHelper.GetSystemMessage()` accesses `gameMode.getGameRules()`
- After Phase 7, `GameMode.getGameRules()` loads from Rules asset

**Steps:**
1. Verify `GameMode.getGameRules()` loads from Rules asset (Phase 7)
2. Verify `AIHelper` accesses Rules via `GameMode.getGameRules()`
3. Verify Rules are loaded correctly for AI prompts

**Checklist:**
- [ ] Verify `GameMode.getGameRules()` loads from Rules asset
- [ ] Verify `AIHelper` accesses Rules via `GameMode.getGameRules()`
- [ ] Verify Rules.LLM variant is used for AI prompts
- [ ] Test AI prompts include Rules from assets

**Reference:**
- [Phase 07 - Rules Asset System](./phase-07-rules-asset-system.md) - Rules asset system (prerequisite)
- [AILogic/ai-prompt-construction.md](../AILogic/ai-prompt-construction.md) - How Rules are used in prompts

---

### Step 3: Verify Event-Driven Communication

**Task:** Ensure event-driven communication works between AI and Engine domains.

**Files:**
- `src/ai/AIHelper.ts` - Publishes request events
- `src/engine/GameEngine.ts` - Handles request events
- `src/lib/eventing/EventBus.ts` - Event bus

**Current State:**
- `AIHelper.GetUserPrompt()` publishes request events:
  - `RequestPlayerHandDetailEvent`
  - `RequestScoreManagerDetailsEvent`
  - `RequestRemainingCardsCountEvent`
  - `RequestFloorCardsDetailEvent`
  - `RequestAllPlayersDataEvent`

**Steps:**
1. Verify Engine subscribes to request events
2. Verify Engine handles request events and resolves promises
3. Verify AI receives responses via deferred promises
4. Test event flow: AI → EventBus → Engine → AI

**Checklist:**
- [ ] Verify Engine subscribes to request events
- [ ] Verify Engine handles request events correctly
- [ ] Verify Engine resolves deferred promises
- [ ] Test AI receives game state via events
- [ ] Verify event-driven pattern (no direct dependencies)

**Reference:**
- [AILogic/ai-event-driven-pattern.md](../AILogic/ai-event-driven-pattern.md) - Event-driven data sourcing
- [Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture

---

### Step 4: Verify AI Prompts Are Built Correctly

**Task:** Ensure AI prompts are built correctly from GameMode and Rules assets.

**Files:**
- `src/ai/AIHelper.ts`
- `src/gameMode/ClaimGameMode.ts` (with Rules asset)
- `public/GameMode/claim.asset` (GameMode asset)
- `public/GameMode/claimRules.asset` (Rules asset)

**Test Cases:**
1. System prompt includes GameMode properties
2. System prompt includes Rules (from Rules asset)
3. User prompt includes live game state (via events)
4. Prompt format matches expected structure

**Checklist:**
- [ ] Test system prompt includes GameMode properties
- [ ] Test system prompt includes Rules from asset
- [ ] Test user prompt includes live game state
- [ ] Test prompt format matches expected structure
- [ ] Test AI generates valid decisions from prompts

**Reference:**
- [AILogic/ai-prompt-construction.md](../AILogic/ai-prompt-construction.md) - Prompt construction pattern
- [Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - Which properties are accessed

---

### Step 5: Test AI System with Claim Game Mode

**Task:** Test end-to-end AI system with Claim game mode.

**Test Scenarios:**
1. AI makes decisions in Claim game
2. AI prompts include Claim-specific rules
3. AI uses event-driven communication
4. AI decisions are valid (Engine validates them)

**Checklist:**
- [ ] Test AI makes decisions in Claim game
- [ ] Test AI prompts include Claim-specific rules
- [ ] Test AI uses event-driven communication
- [ ] Test AI decisions are valid
- [ ] Test AI system works end-to-end

**Reference:**
- [Phase 03 - ClaimGameMode Refactor](./phase-03-claimgamemode-refactor.md) - Claim game mode
- `src/engine/logic/RuleEngine.ts` - Engine validates AI decisions

---

## Testing

### Unit Tests

- [ ] Test `AIHelper.GetSystemMessage()` uses asset-based GameMode
- [ ] Test `AIHelper.GetSystemMessage()` uses asset-based Rules
- [ ] Test `AIHelper.GetUserPrompt()` queries game state via events
- [ ] Test prompt format matches expected structure

### Integration Tests

- [ ] Test AI → EventBus → Engine communication
- [ ] Test AI prompts built from GameMode and Rules assets
- [ ] Test AI generates valid decisions
- [ ] Test Engine validates AI decisions

### Manual Testing

- [ ] Run Claim game with AI players
- [ ] Verify AI makes decisions
- [ ] Verify AI prompts include correct rules
- [ ] Verify event-driven communication works

---

## Exit Criteria

✅ All deliverables completed  
✅ All unit tests passing  
✅ All integration tests passing  
✅ Manual testing successful  
✅ AI system works with GameMode and Rules assets  
✅ Event-driven communication verified  
✅ AI prompts correctly built from assets  
✅ Documentation updated (AILogic/README.md)

---

## Related Documentation

### AI Logic
- [AILogic/README.md](../AILogic/README.md) - AI Logic documentation hub
- [AILogic/ai-prompt-construction.md](../AILogic/ai-prompt-construction.md) - How prompts are built
- [AILogic/ai-event-driven-pattern.md](../AILogic/ai-event-driven-pattern.md) - Event-driven data sourcing
- [AILogic/ai-provider-abstraction.md](../AILogic/ai-provider-abstraction.md) - Provider abstraction

### GameMode Integration
- [Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - How AIHelper uses GameMode properties
- [Phase 02 - GameMode Base Refactor](./phase-02-gamemode-base-refactor.md) - GameMode properties are Serializable

### Rules Integration
- [Rules/README.md](../Rules/README.md) - Rules system overview
- [Phase 07 - Rules Asset System](./phase-07-rules-asset-system.md) - Rules asset system (prerequisite)

### Architecture
- [Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture (AI ↔ Engine)

### Phases
- [Phase 07 - Rules Asset System](./phase-07-rules-asset-system.md) - Prerequisite
- All GameMode Asset System phases (1-6) - Prerequisites

---

**Last Updated:** 2025-01-20  
**Status:** Planning Complete - Waiting for Phase 7

