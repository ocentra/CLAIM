# GameMode Discovery Pattern

**Purpose:** How GameModeManager discovers and loads GameMode assets in Unity. This pattern must be replicated for web asset discovery.

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameModeManager.cs`

---

## Unity Discovery Pattern

### OnEnable() - Asset Scanning

```csharp
public class GameModeManager : ScriptableSingletonBase<GameModeManager>
{
    public List<GameMode> AllGameModes = new List<GameMode>();
    private ScriptableObject[] allScriptableObjects;

    protected override void OnEnable()
    {
        // Scan Resources folder for all ScriptableObjects
        allScriptableObjects = Resources.LoadAll<ScriptableObject>("");
        
        // Filter for GameMode instances
        foreach (ScriptableObject obj in allScriptableObjects)
        {
            if (obj is GameMode gameMode)
            {
                if (!AllGameModes.Contains(gameMode))
                {
                    AllGameModes.Add(gameMode);
                }
            }
        }
    }
}
```

**Key Points:**
- Scans `Resources/` folder at startup
- Uses `Resources.LoadAll<ScriptableObject>("")` to find all assets
- Filters by type: `obj is GameMode`
- Caches in `AllGameModes` list

---

## Lookup Method

### TryGetGameMode()

```csharp
public bool TryGetGameMode(int id, out GameMode gameMode)
{
    foreach (GameMode mode in AllGameModes)
    {
        if (id == mode.GameModeType.GenreId)
        {
            gameMode = mode;
            return true;
        }
    }
    gameMode = null;
    return false;
}
```

**Pattern:**
- Looks up by `GameModeType.GenreId`
- Returns found GameMode or null
- Uses `out` parameter pattern

---

## Web Implementation Mapping

### Phase 4 Task: Asset Discovery System

When implementing Phase 4 (Asset Manager & Loading), create:

1. **GameModeAssetManager**
   - File: `src/gameMode/GameModeAssetManager.ts`
   - Scans `public/GameMode/` folder via manifest
   - Caches loaded assets

2. **Manifest System**
   - File: `public/GameMode/manifest.json`
   - Lists all available `.asset` files
   - Format: `{ "claim": "claim.asset", "poker": "poker.asset" }`

3. **Discovery Method**
   ```typescript
   async scanAssets(): Promise<void> {
       const manifest = await fetch('/GameMode/manifest.json').then(r => r.json());
       
       for (const [gameId, assetPath] of Object.entries(manifest)) {
           const asset = await this.loadAsset(assetPath);
           this.cache.set(gameId, asset);
       }
   }
   ```

4. **Lookup Method**
   ```typescript
   async getGameMode(id: string): Promise<GameMode | null> {
       if (this.cache.has(id)) {
           return this.cache.get(id)!;
       }
       // Load from manifest if not cached
       // ...
   }
   ```

---

## Manifest Generation

### Unity: Resources.LoadAll()
- Scans folder at runtime
- Discovers all assets automatically
- No manifest file needed

### Web: HTTP + Manifest
- Cannot scan folder from browser
- Need manifest file listing assets
- Can be auto-generated at build time (Vite plugin)
- Or manually created for now

---

## Related Docs

- [game-modes.md](./game-modes.md) - Overall GameMode architecture
- [Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Asset loading deep dive
- [Phase 04 - Asset Manager & Loading](../Phases/phase-04-asset-manager-loading.md) - Implementation phase

