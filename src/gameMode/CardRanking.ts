// CardRanking.ts
// Card ranking definitions for Claim game

import { Suit } from '@/types';
import type { Card } from '@/types';

/**
 * CardRanking - Defines card rankings and comparisons for Claim game
 */
export class CardRanking {
  /**
   * Get card rank value (higher = better)
   * Ace (14) is highest, 2 is lowest
   */
  static getRankValue(card: Card): number {
    return card.value;
  }

  /**
   * Compare two cards
   * @returns Positive if card1 > card2, negative if card1 < card2, 0 if equal
   */
  static compareCards(card1: Card, card2: Card): number {
    return card1.value - card2.value;
  }

  /**
   * Check if card1 beats card2
   */
  static beats(card1: Card, card2: Card): boolean {
    return this.compareCards(card1, card2) > 0;
  }

  /**
   * Get suit priority (for tie-breaking or special rules)
   * Spades > Hearts > Diamonds > Clubs
   */
  static getSuitPriority(suit: Suit): number {
    const priorities: Record<Suit, number> = {
      [Suit.SPADES]: 4,
      [Suit.HEARTS]: 3,
      [Suit.DIAMONDS]: 2,
      [Suit.CLUBS]: 1,
    };
    return priorities[suit];
  }

  /**
   * Get card display name
   */
  static getCardName(card: Card): string {
    const valueNames: Record<number, string> = {
      11: 'Jack',
      12: 'Queen',
      13: 'King',
      14: 'Ace',
    };
    const valueName = valueNames[card.value] || card.value.toString();
    return `${valueName} of ${card.suit}`;
  }
}

