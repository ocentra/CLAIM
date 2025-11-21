# GameMode Editor Usage Pattern

**Purpose:** How Unity's GameModeEditor works with GameMode assets. Shows editor-time operations, rule template loading, and initialization triggering.

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Editor/GameModeEditor.cs`

---

## Unity Editor Pattern

### Custom Editor

```csharp
[CustomEditor(typeof(GameMode), true)]
public class GameModeEditor : OdinEditor
{
    [OdinSerialize] public GameMode GameMode { get; set; }

    protected override void OnEnable()
    {
        base.OnEnable();
        GameMode = (GameMode)target;
        LoadRuleTemplates();  // Load available rule templates
        SyncSelectedRules();  // Sync with child assets
        ApplySorting();       // Apply sorting to rule list
    }
}
```

**Key Operations:**
- Loads available BaseBonusRule templates from folder
- Syncs selected rules with child assets
- Provides UI for selecting/deselecting rules
- Triggers `TryInitialize()` when rules change

---

## Rule Template Loading

### LoadRuleTemplates() Method

```csharp
private void LoadRuleTemplates(bool loadFresh = false)
{
    // Scan folder for BaseBonusRule assets
    string[] assetGuids = AssetDatabase.FindAssets("t:BaseBonusRule", new[] {GameMode.RulesTemplatePath});
    
    foreach (string guid in assetGuids)
    {
        BaseBonusRule rule = AssetDatabase.LoadAssetAtPath<BaseBonusRule>(assetPath);
        if (rule != null && GameMode.NumberOfCards >= rule.MinNumberOfCard)
        {
            // Add to template dictionary
            loadedTemplates[rule] = new CustomRuleState(rule);
        }
    }
    
    GameMode.BaseBonusRulesTemplate = loadedTemplates;
}
```

**Key Points:**
- Scans `RulesTemplatePath` folder for BaseBonusRule assets
- Filters by `NumberOfCards` (rule must match game's card count)
- Creates `CustomRuleState` for each template
- Stores in `BaseBonusRulesTemplate` dictionary

---

## Rule Selection UI

### Select/Deselect Rules

```csharp
private void SelectAllRules()
{
    foreach (KeyValuePair<BaseBonusRule, CustomRuleState> ruleStatePair in GameMode.BaseBonusRulesTemplate)
    {
        ruleStatePair.Value.IsSelected = true;
    }
    TryInitialize();  // Trigger initialization when rules change
}

private void DeselectAllRules()
{
    foreach (KeyValuePair<BaseBonusRule, CustomRuleState> ruleStatePair in GameMode.BaseBonusRulesTemplate)
    {
        ruleStatePair.Value.IsSelected = false;
    }
    TryInitialize();  // Trigger initialization
}
```

**Pattern:**
- Rules can be selected/deselected via editor UI
- Changes to selection trigger `TryInitialize()`
- `TryInitialize()` syncs child assets with selected rules

---

## TryInitialize() Trigger

Editor calls `GameMode.TryInitialize()` when:
- Rules are selected/deselected
- Rule priority/bonus values change
- "TryInitialize" button is clicked

**Purpose:** Sync child assets with template selections

---

## Web Implementation Mapping

### Phase 5 Task: Game Editor Integration

When implementing Phase 5 (Asset File System), the web Game Editor should:

1. **Load Rule Templates**
   - Scan folder for available BaseBonusRule definitions
   - Display in UI similar to Unity editor
   - Filter by `numberOfCards` requirement

2. **Rule Selection UI**
   - Allow selecting/deselecting rules
   - Allow editing priority/bonus values
   - Trigger save when changes are made

3. **Save Changes**
   - When rules change, update `.asset` file
   - Regenerate child rule data in asset
   - Save via Vite middleware

**Note:** Web editor doesn't need to match Unity editor exactly, but should support:
- Viewing available rules
- Selecting rules for game mode
- Editing rule properties (priority, bonus value)
- Saving changes to `.asset` file

---

## Related Docs

- [game-editor-system.md](../game-editor-system.md) - Web editor implementation
- [gamemode-initialization-pattern.md](./gamemode-initialization-pattern.md) - How TryInitialize works
- [Phase 05 - Asset File System](../Phases/phase-05-asset-file-system.md) - Save API extension

