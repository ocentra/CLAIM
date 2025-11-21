// CardAsset.ts
// Card asset class (extends ScriptableObject)
// Represents a single playing card asset

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';
import { AssetPathResolver } from '@/lib/assets/AssetPathResolver';

/**
 * Suit constants
 */
export const Suit = {
  SPADES: 'spades',
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
} as const;

export type Suit = typeof Suit[keyof typeof Suit];

/**
 * Suit symbol mapping
 */
export const SUIT_SYMBOLS: Record<Suit, string> = {
  [Suit.SPADES]: '♠',
  [Suit.HEARTS]: '♥',
  [Suit.DIAMONDS]: '♦',
  [Suit.CLUBS]: '♣',
};

/**
 * CardAsset - ScriptableObject representing a playing card
 * Knows its rank, suit, and automatically resolves image path
 */
export class CardAsset extends ScriptableObject {
  static schemaVersion = 1;

  /**
   * Card identifier (e.g., "2_♠", "ace_♠")
   * Matches existing asset format
   */
  @serializable({ label: 'Card ID' })
  id!: string;

  /**
   * Legacy path field (for backward compatibility)
   * Image path is automatically resolved via imagePath getter
   */
  @serializable({ label: 'Path' })
  path?: string;

  /**
   * Card rank (2-10, or "ace", "jack", "queen", "king")
   */
  @serializable({ label: 'Rank' })
  rank!: number | string;

  /**
   * Rank symbol (e.g., "2♠", "A♠")
   */
  @serializable({ label: 'Rank Symbol' })
  rankSymbol!: string;

  /**
   * Suit name (spades, hearts, diamonds, clubs)
   */
  @serializable({ label: 'Suit' })
  suit!: string;

  /**
   * Texture path (legacy field in asset file, for backward compatibility)
   * Stored value may be incorrect - use imagePath getter for actual resolved path
   */
  @serializable({ label: 'Texture Path' })
  texturePath?: string;

  /**
   * Get image path for this card
   * Automatically resolves using AssetPathResolver (no relative paths!)
   * Always returns correct path based on asset ID, ignoring stored texturePath
   * 
   * @returns Full resolved image path (e.g., "/Resources/Cards/Images/2_of_spades.png")
   */
  get imagePath(): string {
    const resolver = AssetPathResolver.getInstance();
    return resolver.resolveCardImagePath(this.id);
  }

  /**
   * Get display name (e.g., "Ace of Spades")
   */
  get displayName(): string {
    const rankName = typeof this.rank === 'number' 
      ? this.rank.toString() 
      : this.rank.charAt(0).toUpperCase() + this.rank.slice(1);
    const suitName = this.suit.charAt(0).toUpperCase() + this.suit.slice(1);
    return `${rankName} of ${suitName}`;
  }

  /**
   * Get suit symbol (♠, ♣, ♥, ♦)
   */
  get suitSymbol(): string {
    const suit = Object.keys(SUIT_SYMBOLS).find(
      key => SUIT_SYMBOLS[key as Suit].toLowerCase() === this.suit.toLowerCase()
    ) as Suit | undefined;
    return suit ? SUIT_SYMBOLS[suit] : '';
  }
}

