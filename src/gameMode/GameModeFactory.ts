// GameModeFactory.ts
// Factory pattern for creating GameMode instances
// Updated to use AssetManager for loading from `.asset` files
// Falls back to class instantiation if asset not found (for new games)

import { GameMode } from './GameMode';
import { ClaimGameMode } from './ClaimGameMode';
import { GameModeAssetManager } from './GameModeAssetManager';

/**
 * Registry mapping game mode IDs to their GameMode class constructors
 * Used as fallback when asset not found (for new games during development)
 */
type GameModeConstructor = new () => GameMode;

const GAME_MODE_REGISTRY: Record<string, GameModeConstructor> = {
  claim: ClaimGameMode,
  // Add more game modes here as they're implemented:
  // poker: PokerGameMode,
  // threecardbrag: ThreeCardBragGameMode,
};

/**
 * GameModeFactory - Creates GameMode instances from game mode IDs
 * Uses AssetManager to load from `.asset` files (primary method)
 * Falls back to class instantiation if asset not found (for new games)
 */
export class GameModeFactory {
  private static instances: Map<string, GameMode> = new Map();
  private static assetManager: GameModeAssetManager | null = null;

  /**
   * Get AssetManager instance (lazy initialization)
   */
  private static getAssetManager(): GameModeAssetManager {
    if (!this.assetManager) {
      this.assetManager = GameModeAssetManager.getInstance();
      // Initialize manifest scanning (async, but don't wait)
      this.assetManager.scanAssets().catch((error) => {
        console.warn('[GameModeFactory] Failed to scan assets:', error);
      });
    }
    return this.assetManager;
  }

  /**
   * Get a GameMode instance for the given game mode ID
   * Tries to load from asset first, falls back to class instantiation
   * Uses singleton pattern - returns same instance for each ID
   * 
   * @param gameModeId - The game mode identifier (e.g., 'claim', 'poker')
   * @returns GameMode instance
   * @throws Error if game mode is not found in assets or registry
   */
  static async getGameMode(gameModeId: string): Promise<GameMode> {
    // Check if instance already exists (singleton per ID)
    if (this.instances.has(gameModeId)) {
      return this.instances.get(gameModeId)!;
    }

    // Try to load from asset manager first
    const assetManager = this.getAssetManager();
    const assetGameMode = await assetManager.getGameMode(gameModeId);

    if (assetGameMode) {
      // Cache and return asset-loaded instance
      this.instances.set(gameModeId, assetGameMode);
      return assetGameMode;
    }

    // Fallback: Create from class registry (for new games without assets yet)
    const GameModeClass = GAME_MODE_REGISTRY[gameModeId];
    if (!GameModeClass) {
      throw new Error(
        `GameMode '${gameModeId}' not found in assets and not registered. ` +
        `Available modes: ${Object.keys(GAME_MODE_REGISTRY).join(', ')}`
      );
    }

    console.warn(
      `[GameModeFactory] Asset not found for '${gameModeId}', creating from class. ` +
      `Consider creating an asset file in Phase 5.`
    );

    // Create and cache instance from class
    const instance = new GameModeClass();
    this.instances.set(gameModeId, instance);
    
    return instance;
  }

  /**
   * Synchronous version for backward compatibility
   * NOTE: This will throw if asset needs to be loaded (use async version instead)
   * 
   * @deprecated Use async getGameMode() instead
   * @param gameModeId - The game mode identifier
   * @returns GameMode instance (synchronous, may fail if asset needs loading)
   */
  static getGameModeSync(gameModeId: string): GameMode {
    // Check cache first
    if (this.instances.has(gameModeId)) {
      return this.instances.get(gameModeId)!;
    }

    // Fallback to class registry (synchronous)
    const GameModeClass = GAME_MODE_REGISTRY[gameModeId];
    if (!GameModeClass) {
      throw new Error(`GameMode '${gameModeId}' is not registered. Available modes: ${Object.keys(GAME_MODE_REGISTRY).join(', ')}`);
    }

    // Create and cache instance
    const instance = new GameModeClass();
    this.instances.set(gameModeId, instance);
    
    return instance;
  }

  /**
   * Register a new game mode implementation
   * Allows dynamic registration of game modes at runtime
   * 
   * @param gameModeId - The game mode identifier
   * @param GameModeClass - The GameMode class constructor
   */
  static registerGameMode(gameModeId: string, GameModeClass: GameModeConstructor): void {
    if (GAME_MODE_REGISTRY[gameModeId]) {
      console.warn(`[GameModeFactory] GameMode '${gameModeId}' is already registered. Overwriting.`);
    }
    GAME_MODE_REGISTRY[gameModeId] = GameModeClass;
    // Clear cached instance if exists
    this.instances.delete(gameModeId);
  }

  /**
   * Get all registered game mode IDs
   * Returns IDs from both asset manifest and class registry
   * 
   * @returns Array of registered game mode IDs
   */
  static getAllGameModeIds(): string[] {
    const assetManager = this.getAssetManager();
    const assetIds = assetManager.getAllGameModeIds();
    const registryIds = Object.keys(GAME_MODE_REGISTRY);
    
    // Combine and deduplicate
    const allIds = new Set([...assetIds, ...registryIds]);
    return Array.from(allIds);
  }

  /**
   * Check if a game mode is available (either in assets or registry)
   * 
   * @param gameModeId - The game mode identifier
   * @returns True if available, false otherwise
   */
  static async isAvailable(gameModeId: string): Promise<boolean> {
    // Check asset manager first
    const assetManager = this.getAssetManager();
    const assetGameMode = await assetManager.getGameMode(gameModeId);
    if (assetGameMode) {
      return true;
    }

    // Check registry
    return gameModeId in GAME_MODE_REGISTRY;
  }

  /**
   * Check if a game mode is registered in class registry (synchronous)
   * 
   * @param gameModeId - The game mode identifier
   * @returns True if registered, false otherwise
   */
  static isRegistered(gameModeId: string): boolean {
    return gameModeId in GAME_MODE_REGISTRY;
  }

  /**
   * Clear all cached instances (useful for testing or hot reloading)
   */
  static clearCache(): void {
    this.instances.clear();
    if (this.assetManager) {
      this.assetManager.clearCache();
    }
  }
}

