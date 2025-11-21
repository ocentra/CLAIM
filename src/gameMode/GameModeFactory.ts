// GameModeFactory.ts
// Factory pattern for creating GameMode instances (like Unity's ScriptableObject discovery)
// Maps game mode IDs to concrete GameMode implementations

import { GameMode } from './GameMode';
import { ClaimGameMode } from './ClaimGameMode';

/**
 * Registry mapping game mode IDs to their GameMode class constructors
 * Similar to Unity's GameModeManager scanning Resources for GameMode assets
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
 * Mirrors Unity's GameModeManager pattern for ScriptableObject discovery
 */
export class GameModeFactory {
  private static instances: Map<string, GameMode> = new Map();

  /**
   * Get a GameMode instance for the given game mode ID
   * Uses singleton pattern - returns same instance for each ID
   * 
   * @param gameModeId - The game mode identifier (e.g., 'claim', 'poker')
   * @returns GameMode instance
   * @throws Error if game mode is not registered
   */
  static getGameMode(gameModeId: string): GameMode {
    // Check if instance already exists (singleton per ID)
    if (this.instances.has(gameModeId)) {
      return this.instances.get(gameModeId)!;
    }

    // Get constructor from registry
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
   * Similar to Unity's GameModeManager.GetAll()
   * 
   * @returns Array of registered game mode IDs
   */
  static getAllGameModeIds(): string[] {
    return Object.keys(GAME_MODE_REGISTRY);
  }

  /**
   * Check if a game mode is registered
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
  }
}

