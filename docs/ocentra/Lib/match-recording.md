# Match Recording Library

**Purpose:** Match event recording system for collecting, serializing, and hashing match records.

**Location:** `src/lib/match-recording/`

---

## What It Provides

### 1. Match Event Collector

**Location:** `src/lib/match-recording/MatchEventCollector.ts`

```typescript
import { MatchEventCollector } from '@lib/match-recording'
import { GameClient } from '@services/solana/GameClient'

const collector = new MatchEventCollector(gameClient)

// Collect match record from Solana
const matchRecord = await collector.collectMatchRecord(matchId)
```

**Features:**
- Collects match state from Solana
- Builds player records
- Collects moves from blockchain
- Formats according to match record schema

---

### 2. Canonical Serialization

**Location:** `src/lib/match-recording/canonical/CanonicalSerializer.ts`

```typescript
import { CanonicalSerializer } from '@lib/match-recording'

// Serialize to canonical JSON (deterministic)
const canonicalBytes = CanonicalSerializer.serialize(matchRecord)

// Serialize to canonical JSON string
const canonicalJSON = CanonicalSerializer.serializeToJSON(matchRecord)
```

**Features:**
- Deterministic JSON serialization (same input → same output)
- Sorted keys, no whitespace
- Used for hashing match records

---

## Common Patterns

### Pattern 1: Collect and Hash Match

```typescript
import { MatchEventCollector } from '@lib/match-recording'
import { CanonicalSerializer } from '@lib/match-recording'
import { HashService } from '@lib/crypto'

// Collect match record
const collector = new MatchEventCollector(gameClient)
const matchRecord = await collector.collectMatchRecord(matchId)

// Serialize to canonical bytes
const canonicalBytes = CanonicalSerializer.serialize(matchRecord)

// Hash the canonical representation
const hash = await HashService.hashMatchRecord(canonicalBytes)
```

---

## API Reference

| API | Purpose |
|-----|---------|
| `MatchEventCollector` | Collect match records from Solana |
| `collectMatchRecord(matchId)` | Collect match record |
| `CanonicalSerializer.serialize(record)` | Serialize to canonical bytes |
| `CanonicalSerializer.serializeToJSON(record)` | Serialize to canonical JSON string |

---

## Types

```typescript
interface MatchRecord {
  match_id: string
  version: string
  game: { name: string; ruleset: string }
  start_time: string
  end_time?: string
  seed: string
  players: PlayerRecord[]
  moves: MoveRecord[]
  storage?: { hot_url: string }
  signatures: SignatureRecord[]
}

interface MoveRecord {
  move_index: number
  player: string
  action_type: number
  payload: number[]
  timestamp: string
}

interface PlayerRecord {
  player_id: string
  public_key: string
  start_chips: number
  end_chips?: number
}
```

---

## When to Use

✅ **Use Match Recording when:**
- Need to record matches for replay
- Need to hash match records
- Need canonical serialization

❌ **Don't use Match Recording when:**
- Simple match state storage (use direct storage)
- No match recording needed

---

## Related Docs

- [crypto.md](./crypto.md) - Cryptography (used for hashing match records)
- [db.md](./db.md) - Database (may store match records)

---

**Last Updated:** 2025-01-20  
**Location:** `src/lib/match-recording/`

