// CardRanking.ts
// Card ranking data structure for asset system
// Serializable data structure representing card rank configurations
// Adapted from Unity's CardRanking.cs

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';

/**
 * CardRanking - Serializable data structure for card rankings
 * Represents a single card rank configuration (e.g., "Ace" = 14, "King" = 13)
 * Used in GameMode assets as an array: CardRanking[]
 * 
 * Example:
 *   [
 *     { CardName: "Ace", Value: 14 },
 *     { CardName: "King", Value: 13 },
 *     { CardName: "Queen", Value: 12 },
 *     ...
 *   ]
 */
export class CardRanking {
  /**
   * Card name/rank (e.g., "Ace", "King", "Queen", "Jack", "10", "9", etc.)
   */
  @serializable({ label: 'Card Name' })
  CardName!: string;

  /**
   * Card value (numeric representation, higher = better)
   * Ace = 14, King = 13, Queen = 12, Jack = 11, 10-2 = face value
   */
  @serializable({ label: 'Card Value' })
  Value!: number;
}

