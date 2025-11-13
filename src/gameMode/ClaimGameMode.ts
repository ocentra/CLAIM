// ClaimGameMode.ts
// Claim-specific game mode implementation
// Adapted from Unity's ThreeCardGameMode.cs

import { GameMode } from './GameMode';
import { GameRulesContainer } from './GameRulesContainer';
import { CardRanking } from './CardRanking';
import { GamePhase } from '@/types';
import type { PlayerAction } from '@/types';

/**
 * ClaimGameMode - Claim card game specific implementation
 */
export class ClaimGameMode extends GameMode {
  private cardRanking: CardRanking;

  constructor() {
    super();
    this.cardRanking = new CardRanking();
  }

  getGameRules(): GameRulesContainer {
    return new GameRulesContainer(
      // LLM version - detailed rules for AI
      `Claim is a card game where players compete to win rounds by playing the highest card or making strategic decisions.

RULES:
1. Each player receives 3 cards at the start of the game
2. A floor card is revealed from the deck
3. Players take turns deciding whether to:
   - PICK UP: Take the floor card and discard one card from hand
   - DECLINE: Pass and keep current hand
   - DECLARE INTENT: Announce a suit you plan to win with
   - CALL SHOWDOWN: Challenge other players to reveal hands
   - REBUTTAL: Respond to a showdown challenge

4. Card rankings: Ace (14) > King (13) > Queen (12) > Jack (11) > 10-2
5. Suit priority: Spades > Hearts > Diamonds > Clubs (for tie-breaking)
6. Scoring: Win rounds by having the highest card in the declared suit
7. Bonus points for winning with declared intent

STRATEGY CONSIDERATIONS:
- Evaluate your hand strength before picking up floor card
- Consider opponent actions and declared intents
- Bluffing can be effective but risky
- Track cards played to estimate remaining high cards
- Manage risk vs reward when declaring intent`,

      // Player version - concise human-readable rules
      `Claim Card Game Rules:
- Each player gets 3 cards
- Take turns picking up floor card or declining
- Win rounds with highest card in declared suit
- Ace is highest, 2 is lowest
- Spades beat Hearts beat Diamonds beat Clubs`
    );
  }

  getGameDescription(): string {
    return `Claim is a strategic card game where players compete to win rounds by playing high cards and making tactical decisions about when to pick up cards, declare intents, and challenge opponents.`;
  }

  getStrategyTips(): string[] {
    return [
      'Evaluate hand strength before picking up the floor card',
      'Consider opponent actions and declared suits when making decisions',
      'Track cards played to estimate remaining high cards in each suit',
      'Use bluffing strategically but be aware of the risks',
      'Manage risk vs reward when declaring intent to win',
      'Consider suit priority when cards are tied in value',
      'Watch for patterns in opponent behavior',
      'Balance aggressive play with conservative hand management',
    ];
  }

  getCardRanking(): CardRanking {
    return this.cardRanking;
  }

  isValidMove(action: PlayerAction, gameState: Record<string, unknown>): boolean {
    // Basic validation - can be expanded based on game state
    if (!action || !action.type || !action.playerId) {
      return false;
    }

    const validActionTypes = ['pick_up', 'decline', 'declare_intent', 'call_showdown', 'rebuttal'];
    if (!validActionTypes.includes(action.type)) {
      return false;
    }

    // Additional validation based on game phase
    if (gameState?.phase === GamePhase.PLAYER_ACTION) {
      return true; // Most actions allowed during player action phase
    }

    // More specific validations can be added here
    return true;
  }

  getBonusRules(): string {
    return `BONUS SCORING:
- Win with declared intent: +2 bonus points
- Win with highest card in declared suit: +1 bonus point
- Successfully call showdown and win: +1 bonus point
- Win multiple rounds consecutively: +1 bonus per consecutive round`;
  }

  getMoveValidityConditions(): string {
    return `MOVE VALIDITY CONDITIONS:
- PICK UP: Only valid when floor card is available and player has cards in hand
- DECLINE: Always valid during player turn
- DECLARE INTENT: Valid when player has at least one card in the declared suit
- CALL SHOWDOWN: Valid when at least one player has declared intent
- REBUTTAL: Valid only in response to a showdown call`;
  }

  getBluffSettings(): string {
    return `BLUFF SETTINGS:
- Players can declare intent even without strong cards in that suit
- Bluffing frequency should be moderate (20-30% of intent declarations)
- Successful bluffs reward risk-taking
- Failed bluffs result in point loss`;
  }

  getExampleHands(): string[] {
    return [
      'Strong hand: Ace of Spades, King of Hearts, Queen of Diamonds - Good for declaring Spades or Hearts',
      'Medium hand: Jack of Clubs, 10 of Spades, 8 of Hearts - Consider picking up floor card',
      'Weak hand: 5 of Diamonds, 4 of Clubs, 3 of Spades - May need to decline or bluff',
      'Balanced hand: King of Clubs, 9 of Hearts, 7 of Diamonds - Flexible strategy options',
    ];
  }

  getAIStrategyParameters(): {
    aggressiveness: number;
    riskTolerance: number;
    bluffFrequency: number;
  } {
    return {
      aggressiveness: 0.6, // Moderate aggressiveness
      riskTolerance: 0.5, // Balanced risk tolerance
      bluffFrequency: 0.25, // 25% bluff frequency
    };
  }
}

