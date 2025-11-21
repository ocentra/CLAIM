// CardAssetFactory.ts
// Factory for creating and loading Card assets
// Handles card creation with proper paths and image resolution

import { CardAsset, Suit, SUIT_SYMBOLS } from './CardAsset';
import { AssetPathResolver, AssetType } from '@/lib/assets/AssetPathResolver';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';

/**
 * Card rank definitions
 */
const CARD_RANKS = {
  numeric: [2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
  face: ['ace', 'jack', 'queen', 'king'] as const,
} as const;

/**
 * Rank value mapping (for sorting/comparison)
 */
const RANK_VALUES: Record<string | number, number> = {
  2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
  jack: 11, queen: 12, king: 13, ace: 14,
};

/**
 * CardAssetFactory - Factory for Card assets
 * Knows how to create cards with proper asset IDs and paths
 * Knows how to load cards and resolve images
 */
export class CardAssetFactory {
  private static instance: CardAssetFactory | null = null;
  private resolver: AssetPathResolver;
  private cache: Map<string, CardAsset> = new Map();

  private constructor() {
    this.resolver = AssetPathResolver.getInstance();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): CardAssetFactory {
    if (!CardAssetFactory.instance) {
      CardAssetFactory.instance = new CardAssetFactory();
    }
    return CardAssetFactory.instance;
  }

  /**
   * Create a new card asset
   * Generates proper asset ID and sets up paths
   * 
   * @param rank - Card rank (2-10 or "ace", "jack", "queen", "king")
   * @param suit - Card suit
   * @returns New CardAsset instance (not yet saved)
   */
  createCard(rank: number | 'ace' | 'jack' | 'queen' | 'king', suit: Suit): CardAsset {
    // Generate asset ID (e.g., "2_♠", "ace_♠")
    const rankStr = typeof rank === 'number' ? rank.toString() : rank;
    const suitSymbol = SUIT_SYMBOLS[suit];
    const assetId = `${rankStr}_${suitSymbol}`;

    // Check cache first
    if (this.cache.has(assetId)) {
      return this.cache.get(assetId)!;
    }

    // Create new card asset
    const card = new CardAsset();
    card.id = assetId;
    card.rank = rank;
    card.suit = suit;
    
    // Set rank symbol with suit (e.g., "2♠", "A♠")
    if (typeof rank === 'number') {
      card.rankSymbol = `${rank}${suitSymbol}`;
    } else {
      const rankSymbol = rank.charAt(0).toUpperCase();
      card.rankSymbol = `${rankSymbol}${suitSymbol}`;
    }

    // Set legacy fields for backward compatibility with existing asset format
    // Image path is automatically resolved via imagePath getter, but we set these for serialization
    const imageFileName = card.imagePath.split('/').pop() || '';
    card.path = `Assets/Images/Cards/${imageFileName}`;
    card.texturePath = card.imagePath; // Set to resolved path for backward compatibility

    // Set asset path (will be used when saving)
    const assetPath = this.resolver.resolvePath(assetId, AssetType.Card);
    card.assetPath = assetPath;

    // Cache it
    this.cache.set(assetId, card);

    return card;
  }

  /**
   * Load a card asset by ID
   * Fetches the asset file and resolves image path
   * 
   * @param assetId - Card asset ID (e.g., "2_♠")
   * @returns Loaded CardAsset instance or null
   */
  async loadCard(assetId: string): Promise<CardAsset | null> {
    // Check cache first
    if (this.cache.has(assetId)) {
      return this.cache.get(assetId)!;
    }

    try {
      // Resolve asset path
      const assetPath = this.resolver.resolvePath(assetId, AssetType.Card);

      // Load asset using ScriptableObject.load()
      const card = await ScriptableObject.load(CardAsset, assetPath);

      if (card) {
        // Image path is automatically resolved via getter
        this.cache.set(assetId, card);
        return card;
      }

      return null;
    } catch (error) {
      console.error(`[CardAssetFactory] Failed to load card ${assetId}:`, error);
      return null;
    }
  }

  /**
   * Create a standard deck of 52 cards
   * Creates all card assets for a standard deck
   * 
   * @returns Array of CardAsset instances
   */
  createStandardDeck(): CardAsset[] {
    const deck: CardAsset[] = [];

    // Create numeric cards (2-10)
    for (const rank of CARD_RANKS.numeric) {
      for (const suit of Object.values(Suit)) {
        deck.push(this.createCard(rank, suit));
      }
    }

    // Create face cards (ace, jack, queen, king)
    for (const rank of CARD_RANKS.face) {
      for (const suit of Object.values(Suit)) {
        deck.push(this.createCard(rank, suit));
      }
    }

    return deck;
  }

  /**
   * Get rank value for sorting/comparison
   * 
   * @param rank - Card rank
   * @returns Numeric value
   */
  getRankValue(rank: number | string): number {
    return RANK_VALUES[rank] ?? 0;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get all cached cards
   */
  getCachedCards(): CardAsset[] {
    return Array.from(this.cache.values());
  }
}

