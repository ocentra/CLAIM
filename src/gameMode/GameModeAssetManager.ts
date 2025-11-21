// GameModeAssetManager.ts
// Asset manager for loading and caching GameMode assets
// Mirrors Unity's GameModeManager pattern
// Scans, loads, and caches `.asset` files from `public/GameMode/`

import { deserialize } from '@/lib/serialization/Serializable';
import { GameMode } from './GameMode';
import { ClaimGameMode } from './ClaimGameMode';
import { GameRulesAsset } from './assets/GameRulesAsset';
import { GameDescriptionAsset } from './assets/GameDescriptionAsset';
import { StrategyTipsAsset } from './assets/StrategyTipsAsset';
import { CardRankingAsset } from './assets/CardRankingAsset';
import { AssetPathResolver, AssetType, AssetCategory } from '@/lib/assets/AssetPathResolver';

/**
 * GameModeAssetManager - Singleton manager for GameMode assets
 * Scans manifest, loads assets, deserializes them, and caches instances
 * Mirrors Unity's GameModeManager pattern
 */
export class GameModeAssetManager {
  private static instance: GameModeAssetManager | null = null;

  /**
   * Cache of loaded GameMode instances
   * Key: Game mode ID (e.g., "claim", "poker")
   * Value: Loaded GameMode instance
   */
  private cache: Map<string, GameMode> = new Map();

  /**
   * Cache of loaded nested assets
   */
  private assetCache: Map<string, unknown> = new Map();

  /**
   * Asset manifest mapping game IDs to asset file paths
   * Format: { "claim": "claim.asset", "poker": "poker.asset", ... }
   */
  private manifest: Record<string, string> | null = null;

  /**
   * Whether assets have been scanned/initialized
   */
  private isInitialized: boolean = false;

  private resolver: AssetPathResolver;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.resolver = AssetPathResolver.getInstance();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): GameModeAssetManager {
    if (!GameModeAssetManager.instance) {
      GameModeAssetManager.instance = new GameModeAssetManager();
    }
    return GameModeAssetManager.instance;
  }

  /**
   * Scan assets by loading manifest
   * Fetches manifest from Resources/GameMode/CardGames/manifest.json
   * Does not load all assets immediately (lazy loading)
   */
  async scanAssets(): Promise<void> {
    try {
      const manifestPath = this.resolver.getManifestPath(AssetCategory.CardGames);
      const response = await fetch(manifestPath);
      if (!response.ok) {
        console.warn('[GameModeAssetManager] Manifest not found. Assets will need to be loaded manually or manifest created.');
        this.manifest = {};
        this.isInitialized = true;
        return;
      }

      this.manifest = await response.json();
      this.isInitialized = true;
      console.log('[GameModeAssetManager] Manifest loaded:', Object.keys(this.manifest || {}).length, 'assets');
    } catch (error) {
      console.error('[GameModeAssetManager] Failed to load manifest:', error);
      this.manifest = {};
      this.isInitialized = true;
    }
  }

  /**
   * Get GameMode instance by ID
   * Checks cache first, loads from manifest if not cached
   * Returns null if asset not found
   * 
   * @param id - Game mode ID (e.g., "claim", "poker")
   * @returns GameMode instance or null if not found
   */
  async getGameMode(id: string): Promise<GameMode | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // Ensure manifest is loaded
    if (!this.isInitialized) {
      await this.scanAssets();
    }

    // Check manifest for asset path
    if (!this.manifest || !this.manifest[id]) {
      console.warn(`[GameModeAssetManager] Asset not found in manifest: ${id}`);
      return null;
    }

    // Load asset - resolve path using AssetPathResolver
    const assetPath = this.resolver.resolvePath(id, AssetType.GameMode, AssetCategory.CardGames);
    try {
      const gameMode = await this.loadAsset(assetPath);
      if (gameMode) {
        // Load nested assets
        await this.loadNestedAssets(gameMode, id);
        
        this.cache.set(id, gameMode);
        return gameMode;
      }
    } catch (error) {
      console.error(`[GameModeAssetManager] Failed to load asset ${id} from ${assetPath}:`, error);
      return null;
    }

    return null;
  }

  /**
   * Load nested assets referenced by GameMode
   * Uses AssetPathResolver to resolve paths (no relative paths)
   */
  private async loadNestedAssets(gameMode: GameMode, gameId: string): Promise<void> {
    // Load GameRules
    if (gameMode.gameRulesAssetId) {
      const rulesPath = this.resolver.resolvePath(
        gameMode.gameRulesAssetId,
        AssetType.GameRules,
        AssetCategory.CardGames,
        gameId
      );
      const rules = await this.loadGenericAsset(GameRulesAsset, rulesPath);
      if (rules) {
        gameMode.gameRules.LLM = rules.LLM;
        gameMode.gameRules.Player = rules.Player;
      }
    }

    // Load GameDescription
    if (gameMode.gameDescriptionAssetId) {
      const descPath = this.resolver.resolvePath(
        gameMode.gameDescriptionAssetId,
        AssetType.GameDescription,
        AssetCategory.CardGames,
        gameId
      );
      const desc = await this.loadGenericAsset(GameDescriptionAsset, descPath);
      if (desc) {
        gameMode.gameDescription.LLM = desc.LLM;
        gameMode.gameDescription.Player = desc.Player;
      }
    }

    // Load StrategyTips
    if (gameMode.strategyTipsAssetId) {
      const tipsPath = this.resolver.resolvePath(
        gameMode.strategyTipsAssetId,
        AssetType.StrategyTips,
        AssetCategory.CardGames,
        gameId
      );
      const tips = await this.loadGenericAsset(StrategyTipsAsset, tipsPath);
      if (tips) {
        gameMode.strategyTips.LLM = tips.LLM;
        gameMode.strategyTips.Player = tips.Player;
      }
    }

    // Load CardRankings
    if (gameMode.cardRankingAssetId) {
      const rankingsPath = this.resolver.resolvePath(
        gameMode.cardRankingAssetId,
        AssetType.CardRanking,
        AssetCategory.CardGames,
        gameId
      );
      const rankings = await this.loadGenericAsset(CardRankingAsset, rankingsPath);
      if (rankings) {
        gameMode.cardRankings = rankings.rankings;
      }
    }
  }

  /**
   * Generic loader for any ScriptableObject asset
   */
  private async loadGenericAsset<T>(constructor: new () => T, path: string): Promise<T | null> {
    if (this.assetCache.has(path)) {
      return this.assetCache.get(path) as T;
    }

    try {
      const response = await fetch(path);
      if (!response.ok) return null;
      
      const json = await response.json();
      const asset = deserialize(constructor, json) as T;
      
      this.assetCache.set(path, asset);
      return asset;
    } catch (error) {
      console.error(`[GameModeAssetManager] Failed to load asset from ${path}:`, error);
      return null;
    }
  }

  /**
   * Load a single asset file
   * Fetches asset JSON, deserializes it into GameMode instance
   * 
   * @param path - Full asset path (e.g., "/Resources/GameMode/CardGames/Claim/claim.asset")
   * @returns GameMode instance or null if loading fails
   */
  async loadAsset(path: string): Promise<GameMode | null> {
    try {
      // Fetch asset file (path is already full path from resolver)
      const response = await fetch(path);
      if (!response.ok) {
        console.error(`[GameModeAssetManager] Failed to fetch asset: ${path} (${response.status})`);
        return null;
      }

      const json = await response.json();

      // Determine which GameMode class to deserialize to based on asset metadata
      // For now, we'll try ClaimGameMode first (can be improved with asset type detection)
      const gameModeClass = this.determineGameModeClass(json);

      if (!gameModeClass) {
        console.error(`[GameModeAssetManager] Could not determine GameMode class for asset: ${path}`);
        return null;
      }

      // Deserialize JSON into GameMode instance
      const gameMode = deserialize(gameModeClass, json as Record<string, unknown>) as GameMode;

      // Initialize the GameMode if needed (for newly loaded assets)
      // Note: Assets loaded from files should already be initialized
      // But we can call TryInitialize to ensure everything is set up

      return gameMode;
    } catch (error) {
      console.error(`[GameModeAssetManager] Failed to load asset ${path}:`, error);
      return null;
    }
  }

  /**
   * Determine which GameMode class to deserialize to based on asset JSON
   * Can check asset metadata, asset type, or game ID
   * For now, uses simple heuristics (can be improved)
   * 
   * @param json - Asset JSON data
   * @returns GameMode class constructor or null
   */
  private determineGameModeClass(json: Record<string, unknown>): (new () => GameMode) | null {
    // Check if asset has metadata with gameId
    const metadata = json.metadata as Record<string, unknown> | undefined;
    const gameId = metadata?.gameId as string | undefined;

    // Map game IDs to GameMode classes
    // For now, only ClaimGameMode is available
    // More game modes can be added later
    if (gameId === 'claim' || json.gameName === 'Claim') {
      return ClaimGameMode;
    }

    // Default: Try ClaimGameMode (will be improved when more game modes exist)
    // This is a temporary fallback
    return ClaimGameMode;
  }

  /**
   * Get all game mode IDs from manifest
   * Returns array of all game IDs that have assets
   * 
   * @returns Array of game mode IDs
   */
  getAllGameModeIds(): string[] {
    if (!this.manifest) {
      return [];
    }
    return Object.keys(this.manifest);
  }

  /**
   * Clear the cache
   * Useful for testing or hot reloading
   */
  clearCache(): void {
    this.cache.clear();
    this.assetCache.clear();
  }

  /**
   * Reload all assets from manifest
   * Clears cache and reloads all assets
   */
  async reloadAll(): Promise<void> {
    this.clearCache();
    await this.scanAssets();

    // Lazy load - assets will be loaded on demand via getGameMode()
    // Or we could preload all assets here if needed
  }

  /**
   * Check if assets have been scanned
   */
  get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get cache size
   */
  get cacheSize(): number {
    return this.cache.size + this.assetCache.size;
  }
}

