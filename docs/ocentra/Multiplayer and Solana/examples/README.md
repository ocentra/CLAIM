# Match Record Examples

**Purpose:** Reference examples showing the canonical MatchRecord format, AI chain of thought format, and how matches are structured in the system.

**Status:** Reference Documentation - Not used in game runtime

**Location:** These examples were moved from `examples/` folder to documentation for better organization.

---

## 📋 Example Files

### `human_vs_human_match.json`

**Purpose:** Example match record showing a human vs human game.

**Shows:**
- Match record structure (match_id, version, game, players, moves, signatures)
- Human player records with metadata (display_name, avatar_url)
- Move records (pick_up, decline, declare_intent, call_showdown, showdown)
- Storage references (R2 hot_url)
- Signature records (Ed25519 signatures)

**Use Case:** Reference when implementing match recording, understanding MatchRecord format, or developing match replay features.

---

### `ai_vs_ai_match.json`

**Purpose:** Example match record showing an AI vs AI game with chain of thought reasoning.

**Shows:**
- AI player records with model metadata (model_name, model_id, model_hash, temperature, etc.)
- Chain of thought reasoning (thought, reasoning, decision, confidence, alternatives_considered)
- Model version tracking for reproducibility
- All MatchRecord structure elements

**Use Case:** Reference when implementing AI reasoning recording, understanding chain_of_thought format, or developing AI analysis features.

---

### `chain_of_thought_example.json`

**Purpose:** Detailed example of AI chain of thought reasoning for a single player.

**Shows:**
- Per-move chain of thought reasoning
- Thought process for each decision
- Confidence scores
- Alternatives considered
- Decision rationale
- Metadata (tokens used, inference time, model version)

**Use Case:** Reference when implementing AI reasoning capture, understanding how AI decisions are recorded, or developing AI transparency features.

---

## 🎯 Format Reference

### MatchRecord Structure

All match records follow the canonical MatchRecord format:

```typescript
interface MatchRecord {
  match_id: string;          // UUID v4
  version: string;           // Schema version (e.g., "1.0.0")
  game: {
    name: string;            // Game name (e.g., "CLAIM")
    ruleset: string;         // Ruleset identifier
  };
  start_time: string;        // ISO8601 UTC
  end_time: string;          // ISO8601 UTC
  seed: string;              // Random seed for reproducibility
  players: PlayerRecord[];   // Array of player records
  moves: MoveRecord[];       // Array of move records
  chain_of_thought?: {       // Optional: AI reasoning (keyed by player_id)
    [player_id: string]: ChainOfThoughtEntry[];
  };
  model_versions?: {         // Optional: AI model metadata (keyed by player_id)
    [player_id: string]: ModelMetadata;
  };
  storage?: {                // Optional: Storage references
    hot_url?: string;
  };
  signatures: SignatureRecord[]; // Array of signatures
}
```

### Chain of Thought Format

```typescript
interface ChainOfThoughtEntry {
  move_index: number;
  timestamp: string;         // ISO8601 UTC
  thought: string;           // AI's thought process
  reasoning: string;         // Decision rationale
  decision: string;          // Action taken
  confidence: number;        // Confidence score (0-1)
  alternatives_considered: string[]; // Other options evaluated
}
```

---

## 📚 Related Documentation

### Main Hub
- [../../README.md](../../README.md) - Main ocentra documentation hub

### Match Recording
- [../../Lib/match-recording.md](../../Lib/match-recording.md) - Match recording library documentation
- `src/lib/match-recording/types.ts` - TypeScript type definitions

### Multiplayer & Solana
- [../README.md](../README.md) - Multiplayer and Solana documentation hub
- [../architecture.md](../architecture.md) - System architecture
- [../state-layouts.md](../state-layouts.md) - State layouts

### Test Data
- `test-data/README.md` - Shared test data (actual test fixtures, not examples)
- `test-data/loaders.ts` - Test data loaders

---

## 🔗 Usage in Codebase

### Verification Script

These examples are used by `scripts/verify-matches.ts` for verification testing:

```typescript
// Loads example match IDs for verification
const matchIds = getExampleMatchIds();

// Verifies example matches
await verifyMatch(matchId, verifier, r2Service);
```

**Note:** These are reference examples. Actual test data used in tests is in `test-data/` folder.

---

## 📝 Notes

- **Not Runtime Code:** These examples are documentation/reference only, not used in game runtime
- **Format Reference:** Use these to understand MatchRecord format and structure
- **AI Reasoning:** The chain of thought examples show how AI reasoning is captured and stored
- **Test Data:** For actual test fixtures, see `test-data/` folder

---

**Last Updated:** 2025-01-20  
**Location:** Moved from `examples/` to `docs/ocentra/Multiplayer and Solana/examples/` for better organization

