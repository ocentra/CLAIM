// ScriptableObject.ts
// Unity-like ScriptableObject base class for all asset types
// Each ScriptableObject can save itself as a .asset file
// Supports nested assets and asset references

import { serialize, deserialize, SCHEMA_VERSION_KEY } from './Serializable';
import type { ISaveGameModeAsset } from '@/gameMode/interfaces/ISaveGameModeAsset';

/**
 * Asset GUID - Unique identifier for asset references (like Unity)
 */
export type AssetGUID = string;

/**
 * Asset Reference - Reference to another asset by GUID
 */
export interface AssetReference {
  __assetRef: true;
  guid: AssetGUID;
  path?: string; // Optional path for loading
  type?: string; // Asset type (e.g., "Card", "BaseBonusRule")
}

/**
 * Nested Asset - Child asset within parent asset file
 */
export interface NestedAsset {
  __nestedAsset: true;
  guid: AssetGUID;
  type: string;
  data: Record<string, unknown>;
}

/**
 * ScriptableObject - Base class for all asset types (like Unity's SerializedScriptableObject)
 * Each ScriptableObject can save itself as a .asset file
 * Supports nested assets (child assets within parent file) and asset references
 */
export abstract class ScriptableObject implements ISaveGameModeAsset {
  /**
   * Asset GUID - Unique identifier for this asset (like Unity)
   * Auto-generated on first save if not set
   */
  private _guid: AssetGUID | null = null;

  /**
   * Asset path - Path where this asset is saved (e.g., "/GameMode/claim.asset")
   */
  private _assetPath: string | null = null;

  /**
   * Whether this asset is nested (child asset within parent file)
   */
  private _isNested: boolean = false;

  /**
   * Parent asset (if this is a nested asset)
   */
  private _parentAsset: ScriptableObject | null = null;

  /**
   * Schema version for serialization
   */
  static schemaVersion?: number;

  /**
   * Get asset GUID
   */
  get guid(): AssetGUID {
    if (!this._guid) {
      // Generate GUID if not set (like Unity)
      this._guid = this.generateGUID();
    }
    return this._guid;
  }

  /**
   * Set asset GUID
   */
  set guid(value: AssetGUID) {
    this._guid = value;
  }

  /**
   * Get asset path
   */
  get assetPath(): string | null {
    return this._assetPath;
  }

  /**
   * Set asset path
   */
  set assetPath(value: string | null) {
    this._assetPath = value;
  }

  /**
   * Check if this is a nested asset
   */
  get isNested(): boolean {
    return this._isNested;
  }

  /**
   * Set nested flag
   */
  set isNested(value: boolean) {
    this._isNested = value;
  }

  /**
   * Get parent asset (if nested)
   */
  get parentAsset(): ScriptableObject | null {
    return this._parentAsset;
  }

  /**
   * Set parent asset (if nested)
   */
  set parentAsset(value: ScriptableObject | null) {
    this._parentAsset = value;
  }

  /**
   * Generate unique GUID for asset
   * Uses crypto.randomUUID() or fallback to timestamp-based ID
   */
  private generateGUID(): AssetGUID {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback: timestamp + random
    return `asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Create asset reference to this asset
   * Used when another asset references this one
   */
  createReference(): AssetReference {
    const className = this.constructor.name;
    return {
      __assetRef: true,
      guid: this.guid,
      path: this.assetPath || undefined,
      type: className,
    };
  }

  /**
   * Save changes to asset file
   * Implements ISaveGameModeAsset interface
   * Saves this asset as .asset file (or updates nested asset in parent)
   */
  async saveChanges(): Promise<void> {
    // Only save in dev mode
    if (import.meta.env.PROD) {
      console.warn('[ScriptableObject] saveChanges() is only available in development mode.');
      return;
    }

    if (this.isNested && this.parentAsset) {
      // If nested, parent asset handles saving
      await this.parentAsset.saveChanges();
      return;
    }

    try {
      // Serialize this ScriptableObject
      const serialized = serialize(this);

      // Get asset type from class name
      const assetType = this.constructor.name;
      
      // Determine asset ID/path
      let assetId: string | undefined;
      let assetPath: string | undefined;

      // Try to get from metadata or determine from class
      const metadata = (serialized as Record<string, unknown>).metadata as Record<string, unknown> | undefined;
      assetId = metadata?.gameId as string | undefined || metadata?.assetId as string | undefined;

      // Infer from class name if not set
      if (!assetId) {
        // Examples: "ClaimGameMode" -> "claim", "ThreeOfAKind" -> "threeOfAKind"
        assetId = assetType.replace('GameMode', '').replace(/([A-Z])/g, (_match, p1, offset) => 
          offset > 0 ? '_' + p1.toLowerCase() : p1.toLowerCase()
        );
      }

      // Determine asset path based on type
      if (!assetPath) {
        if (assetType.includes('GameMode')) {
          assetPath = `/GameMode/${assetId}.asset`;
        } else if (assetType.includes('BonusRule') || assetType.includes('Rule')) {
          // Rules are nested assets, don't save separately
          console.warn(`[ScriptableObject] Rule assets should be nested in GameMode.asset: ${assetType}`);
          return;
        } else if (assetType === 'Card') {
          assetPath = `/Cards/${assetId}.asset`;
        } else if (assetType === 'Deck') {
          assetPath = `/Deck/${assetId}.asset`;
        } else {
          assetPath = `/Assets/${assetId}.asset`;
        }
      }

      // Build asset data with metadata
      const assetData = {
        [SCHEMA_VERSION_KEY]: (this.constructor as typeof ScriptableObject).schemaVersion || 1,
        __assetType: assetType,
        __assetId: assetId,
        __guid: this.guid,
        metadata: {
          guid: this.guid,
          assetId,
          assetType,
          updatedAt: new Date().toISOString(),
          ...metadata,
        },
        ...serialized,
      };

      // Save via API endpoint
      const response = await fetch('/__dev/api/save-game-mode-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gameId: assetId, 
          asset: assetData,
          assetPath,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to save asset: ${error.message || response.statusText}`);
      }

      // Update asset path after successful save
      this._assetPath = assetPath;

      console.log(`[ScriptableObject] Saved asset: ${assetPath} (GUID: ${this.guid})`);
    } catch (error) {
      console.error('[ScriptableObject] Failed to save changes:', error);
      throw error;
    }
  }

  /**
   * Load asset from file
   * Static method to load asset by path
   */
  static async load<T extends ScriptableObject>(
    constructor: new () => T,
    path: string
  ): Promise<T | null> {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        return null;
      }

      const json = await response.json() as Record<string, unknown>;
      
      // Deserialize
      const instance = deserialize(constructor, json) as T;
      
      // Restore asset metadata
      instance._guid = json.__guid as AssetGUID || instance.guid;
      instance._assetPath = path;

      return instance;
    } catch (error) {
      console.error(`[ScriptableObject] Failed to load asset from ${path}:`, error);
      return null;
    }
  }
}

