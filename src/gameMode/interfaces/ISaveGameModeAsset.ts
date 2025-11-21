// ISaveGameModeAsset.ts
// Save contract interface for GameMode assets
// Adapted from Unity's ISaveScriptable.cs

/**
 * ISaveGameModeAsset - Contract for saving GameMode assets
 * Defines the save contract that GameMode assets must implement
 * Similar to Unity's ISaveScriptable interface
 * 
 * When a GameMode asset is modified (via editor or programmatically),
 * call `saveChanges()` to persist changes to `.asset` file
 */
export interface ISaveGameModeAsset {
  /**
   * Save changes to the asset file
   * Serializes the asset and writes it to disk
   * Should be called after modifying asset properties
   * 
   * @returns Promise that resolves when save is complete
   */
  saveChanges(): Promise<void>;
}

