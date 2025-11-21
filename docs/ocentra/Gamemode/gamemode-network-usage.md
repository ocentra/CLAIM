# GameMode Game Configuration Usage

**Purpose:** Which GameMode properties are used for game configuration (turn duration, max rounds, etc.). These properties provide defaults for game setup, whether multiplayer or single player.

**Note:** Unity uses its own multiplayer system. Our web backend uses Solana for both multiplayer and single player matches. This doc focuses on which GameMode properties are accessed for game configuration.

---

## Unity Pattern (Reference Only)

**Note:** Unity's `NetworkGameManager` accesses GameMode properties, but Unity uses its own multiplayer system (Unity Netcode, Unity Services). Our web implementation uses Solana instead.

### Init() Method Usage (Unity Reference)

```csharp
public void Init(List<Player> playerList, List<string> computerPlayerList, float? turnDuration = null, int? maxRounds = null)
{
    if (GameMode != null)
    {
        turnDuration ??= GameMode.TurnDuration;  // Use GameMode default
        maxRounds ??= GameMode.MaxRounds;        // Use GameMode default
    }
    // ... rest of init
}
```

**Key Properties Accessed:**
- `GameMode.TurnDuration` - Default turn duration (if not provided)
- `GameMode.MaxRounds` - Default max rounds (if not provided)

**Pattern:**
- GameMode provides defaults for game configuration
- Caller can override with explicit values
- GameMode is the source of truth for game config

**Reference:** `References/Scripts/OcentraAI/LLMGames/Networking/Managers/NetworkGameManager.cs` (lines 97-105) - Unity reference only

---

## Web Implementation (Solana-Based)

**Important:** Our web backend uses Solana for both multiplayer and single player matches. GameMode properties provide configuration defaults that are used regardless of match type.

### Phase 2 Task: Ensure Properties Exist

When implementing Phase 2, ensure these properties are Serializable:

1. **turnDuration: number**
   - Default turn duration for matches
   - Used when creating matches (multiplayer or single player via Solana)
   - Must be Serializable property

2. **maxRounds: number**
   - Default max rounds for matches
   - Used when creating matches (multiplayer or single player via Solana)
   - Must be Serializable property

### Game Configuration Pattern (Web)

**Pattern:**
```typescript
// When creating a match (via Solana)
const turnDuration = providedTurnDuration ?? gameMode.turnDuration;
const maxRounds = providedMaxRounds ?? gameMode.maxRounds;

// GameMode provides defaults
// Solana match creation uses these values
```

**Usage Context:**
- Single player matches (via Solana) → Uses GameMode defaults
- Multiplayer matches (via Solana) → Uses GameMode defaults
- GameMode is the source of truth for game configuration

**Note:** Both single player and multiplayer use Solana backend. GameMode properties provide defaults for both.

---

## Related Docs

- [game-modes.md](./game-modes.md) - Overall GameMode architecture
- [Phase 02 - GameMode Base Refactor](../Phases/phase-02-gamemode-base-refactor.md) - Property conversion
- `docs/Multiplayer and Solana/README.md` - Solana multiplayer architecture (separate system)
