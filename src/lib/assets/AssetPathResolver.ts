// AssetPathResolver.ts
// Central asset path resolution system (Unity Resources pattern)
// Eliminates relative path hell by using asset IDs and conventions

/**
 * Asset Type definitions
 */
export const AssetType = {
  Card: 'Card',
  GameMode: 'GameMode',
  GameRules: 'GameRulesAsset',
  GameDescription: 'GameDescriptionAsset',
  StrategyTips: 'StrategyTipsAsset',
  CardRanking: 'CardRankingAsset',
  BonusRule: 'BonusRule',
  GameModeConfig: 'GameModeConfig',
  PageContent: 'PageContentAsset',
  Image: 'ImageAsset',
  Layout: 'LayoutAsset',
  UIComponent: 'UIComponentAsset',
} as const;

export type AssetType = typeof AssetType[keyof typeof AssetType];

/**
 * Asset Category definitions
 */
export const AssetCategory = {
  CardGames: 'CardGames',
  CommonRules: 'CommonCardRules',
} as const;

export type AssetCategory = typeof AssetCategory[keyof typeof AssetCategory];

/**
 * AssetPathResolver - Central registry for asset path resolution
 * Eliminates relative paths by using asset IDs and naming conventions
 */
export class AssetPathResolver {
  private static instance: AssetPathResolver | null = null;

  /**
   * Base path for all assets (Unity Resources pattern)
   */
  private readonly BASE_PATH = '/Resources';

  /**
   * Private constructor for singleton
   */
  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AssetPathResolver {
    if (!AssetPathResolver.instance) {
      AssetPathResolver.instance = new AssetPathResolver();
    }
    return AssetPathResolver.instance;
  }

  /**
   * Resolve asset path by ID and type
   * Uses conventions to determine full path
   * 
   * @param assetId - Asset identifier (e.g., "claim", "2_♠", "claim-rules")
   * @param assetType - Type of asset
   * @param category - Optional category (for GameModes)
   * @param gameId - Optional game ID (for nested assets)
   * @returns Full asset path
   */
  resolvePath(
    assetId: string,
    assetType: AssetType,
    category?: AssetCategory,
    gameId?: string
  ): string {
    switch (assetType) {
      case AssetType.Card: {
        return `${this.BASE_PATH}/Cards/${assetId}.asset`;
      }

      case AssetType.GameMode: {
        const gameCategory = category || AssetCategory.CardGames;
        return `${this.BASE_PATH}/GameMode/${gameCategory}/${gameId || assetId}/${assetId}.asset`;
      }

      case AssetType.GameRules:
      case AssetType.GameDescription:
      case AssetType.StrategyTips: {
        // These are nested under a specific game
        if (!gameId) {
          throw new Error(`Game ID required for ${assetType} asset: ${assetId}`);
        }
        const gameCategory2 = category || AssetCategory.CardGames;
        // Convert asset ID to camelCase filename (claim-rules -> claimRules)
        const fileName = assetId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return `${this.BASE_PATH}/GameMode/${gameCategory2}/${gameId}/${fileName}.asset`;
      }

      case AssetType.CardRanking: {
        // Card rankings can be in Cards folder or game-specific
        if (gameId) {
          const gameCategory3 = category || AssetCategory.CardGames;
          const fileName2 = assetId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          return `${this.BASE_PATH}/GameMode/${gameCategory3}/${gameId}/${fileName2}.asset`;
        }
        return `${this.BASE_PATH}/Cards/${assetId}.asset`;
      }

      case AssetType.BonusRule: {
        const gameCategory4 = category || AssetCategory.CommonRules;
        return `${this.BASE_PATH}/GameMode/${gameCategory4}/${assetId}.asset`;
      }

      case AssetType.GameModeConfig: {
        return `${this.BASE_PATH}/GameModeConfig/${assetId}.json`;
      }

      case AssetType.PageContent: {
        // PageContent assets can be in Pages/Games/{gameId}/info.asset or Pages/{pageId}.asset
        if (gameId) {
          return `${this.BASE_PATH}/Pages/Games/${gameId}/${assetId}.asset`;
        }
        return `${this.BASE_PATH}/Pages/${assetId}.asset`;
      }

      case AssetType.Image: {
        return `${this.BASE_PATH}/UI/Images/${assetId}.asset`;
      }

      case AssetType.Layout: {
        return `${this.BASE_PATH}/Layouts/${assetId}.asset`;
      }

      case AssetType.UIComponent: {
        return `${this.BASE_PATH}/UI/${assetId}.asset`;
      }

      default:
        throw new Error(`Unknown asset type: ${assetType}`);
    }
  }

  /**
   * Resolve image path for a card asset
   * Converts card asset ID to image filename convention
   * 
   * @param cardAssetId - Card asset ID (e.g., "2_♠", "ace_♠")
   * @returns Full image path
   */
  resolveCardImagePath(cardAssetId: string): string {
    // Convert card asset ID to image filename
    // Examples:
    // "2_♠" -> "/Resources/Cards/Images/2_of_spades.png"
    // "ace_♠" -> "/Resources/Cards/Images/ace_of_spades.png"
    // "jack_♣" -> "/Resources/Cards/Images/jack_of_clubs.png"
    
    const parts = cardAssetId.split('_');
    if (parts.length !== 2) {
      throw new Error(`Invalid card asset ID format: ${cardAssetId}. Expected format: "rank_suitSymbol" (e.g., "2_♠")`);
    }
    
    const [rank, suitSymbol] = parts;
    
    const suitMap: Record<string, string> = {
      '♠': 'spades',
      '♣': 'clubs',
      '♥': 'hearts',
      '♦': 'diamonds',
    };

    const rankMap: Record<string, string> = {
      'ace': 'ace',
      'jack': 'jack',
      'queen': 'queen',
      'king': 'king',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '7',
      '8': '8',
      '9': '9',
      '10': '10',
    };

    const suitName = suitMap[suitSymbol];
    if (!suitName) {
      throw new Error(`Unknown suit symbol: ${suitSymbol} in card asset ID: ${cardAssetId}`);
    }

    const rankName = rankMap[rank.toLowerCase()] || rank.toLowerCase();
    const imageFileName = `${rankName}_of_${suitName}.png`;
    
    return `${this.BASE_PATH}/Cards/Images/${imageFileName}`;
  }

  /**
   * Extract asset ID from full path
   * Useful for reverse lookup
   * 
   * @param path - Full asset path
   * @returns Asset ID
   */
  extractAssetId(path: string): string | null {
    // Extract asset ID from path
    // Examples:
    // "/Resources/Cards/2_♠.asset" -> "2_♠"
    // "/Resources/GameMode/CardGames/Claim/claim.asset" -> "claim"
    
    const match = path.match(/([^/]+)\.asset$/);
    return match ? match[1] : null;
  }

  /**
   * Get manifest path for a category
   * 
   * @param category - Asset category
   * @returns Manifest path
   */
  getManifestPath(category: AssetCategory = AssetCategory.CardGames): string {
    return `${this.BASE_PATH}/GameMode/${category}/manifest.json`;
  }
}

