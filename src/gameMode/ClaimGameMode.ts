// ClaimGameMode.ts
// Claim-specific game mode implementation
// Adapted from Unity's ThreeCardGameMode.cs
// Data-driven: All game data stored in Serializable properties, initialized via override methods

import { GameMode } from './GameMode';
import { GamePhase } from '@/types';
import type { PlayerAction } from '@/types';

/**
 * ClaimGameMode - Claim card game specific implementation
 * Data-driven: All game data initialized in initialization methods
 * Properties are Serializable and can be loaded from `.asset` files
 */
export class ClaimGameMode extends GameMode {
  constructor() {
    super();
    // Initialize properties by calling TryInitialize
    // This will populate all Claim-specific data
    this.TryInitialize().catch((error) => {
      console.error('[ClaimGameMode] Failed to initialize:', error);
    });
  }

  // ========================================
  // Initialization Methods (Override from GameMode)
  // ========================================

  /**
   * Initialize game rules with Claim-specific rules
   */
  protected override InitializeGameRules(): void {
    super.InitializeGameRules();
    this.gameRules.LLM = `Claim is a card game where players compete to win rounds by playing the highest card or making strategic decisions.

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
- Manage risk vs reward when declaring intent`;

    this.gameRules.Player = `Claim Card Game Rules:
- Each player gets 3 cards
- Take turns picking up floor card or declining
- Win rounds with highest card in declared suit
- Ace is highest, 2 is lowest
- Spades beat Hearts beat Diamonds beat Clubs`;
  }

  /**
   * Initialize game description with Claim-specific description
   */
  protected override InitializeGameDescription(): void {
    super.InitializeGameDescription();
    this.gameDescription.LLM = `Claim is a strategic card game where players compete to win rounds by playing high cards and making tactical decisions about when to pick up cards, declare intents, and challenge opponents. The game requires strategic thinking, risk assessment, and the ability to read opponents.`;

    this.gameDescription.Player = `Claim is a strategic card game where players compete to win rounds by playing high cards and making tactical decisions about when to pick up cards, declare intents, and challenge opponents.`;
  }

  /**
   * Initialize strategy tips with Claim-specific tips
   */
  protected override InitializeStrategyTips(): void {
    super.InitializeStrategyTips();
    const tips = [
      'Evaluate hand strength before picking up the floor card',
      'Consider opponent actions and declared suits when making decisions',
      'Track cards played to estimate remaining high cards in each suit',
      'Use bluffing strategically but be aware of the risks',
      'Manage risk vs reward when declaring intent to win',
      'Consider suit priority when cards are tied in value',
      'Watch for patterns in opponent behavior',
      'Balance aggressive play with conservative hand management',
    ];
    this.strategyTips.LLM = tips.join('\n');
    this.strategyTips.Player = tips.join('\n');
  }

  /**
   * Initialize card rankings with standard deck rankings for Claim
   */
  protected override InitializeCardRankings(): void {
    super.InitializeCardRankings();
    this.cardRankings = [
      { CardName: 'Ace', Value: 14 },
      { CardName: 'King', Value: 13 },
      { CardName: 'Queen', Value: 12 },
      { CardName: 'Jack', Value: 11 },
      { CardName: '10', Value: 10 },
      { CardName: '9', Value: 9 },
      { CardName: '8', Value: 8 },
      { CardName: '7', Value: 7 },
      { CardName: '6', Value: 6 },
      { CardName: '5', Value: 5 },
      { CardName: '4', Value: 4 },
      { CardName: '3', Value: 3 },
      { CardName: '2', Value: 2 },
    ];
  }

  /**
   * Initialize move validity conditions with Claim-specific conditions
   */
  protected override InitializeMoveValidityConditions(): void {
    super.InitializeMoveValidityConditions();
    this.moveValidityConditions = {
      pick_up: 'Only valid when floor card is available and player has cards in hand',
      decline: 'Always valid during player turn',
      declare_intent: 'Valid when player has at least one card in the declared suit',
      call_showdown: 'Valid when at least one player has declared intent',
      rebuttal: 'Valid only in response to a showdown call',
    };
  }

  /**
   * Initialize bluff settings with Claim-specific settings
   */
  protected override InitializeBluffSettings(): void {
    super.InitializeBluffSettings();
    this.bluffSettings = {
      default: 'Players can declare intent even without strong cards in that suit',
      frequency: 'Bluffing frequency should be moderate (20-30% of intent declarations)',
      success: 'Successful bluffs reward risk-taking',
      failure: 'Failed bluffs result in point loss',
    };
  }

  /**
   * Initialize example hands with Claim-specific examples
   */
  protected override InitializeExampleHands(): void {
    super.InitializeExampleHands();
    this.exampleHands = [
      'Strong hand: Ace of Spades, King of Hearts, Queen of Diamonds - Good for declaring Spades or Hearts',
      'Medium hand: Jack of Clubs, 10 of Spades, 8 of Hearts - Consider picking up floor card',
      'Weak hand: 5 of Diamonds, 4 of Clubs, 3 of Spades - May need to decline or bluff',
      'Balanced hand: King of Clubs, 9 of Hearts, 7 of Diamonds - Flexible strategy options',
    ];
  }

  /**
   * Initialize bonus rules with Claim-specific bonus rules
   */
  protected override InitializeBonusRules(): void {
    super.InitializeBonusRules();
    this.bonusRules = `BONUS SCORING:
- Win with declared intent: +2 bonus points
- Win with highest card in declared suit: +1 bonus point
- Successfully call showdown and win: +1 bonus point
- Win multiple rounds consecutively: +1 bonus per consecutive round`;
  }

  /**
   * Initialize AI strategy parameters with Claim-specific parameters
   */
  protected override InitializeAIStrategyParameters(): void {
    super.InitializeAIStrategyParameters();
    this.aiStrategyParameters = {
      aggressiveness: 0.6, // Moderate aggressiveness
      riskTolerance: 0.5, // Balanced risk tolerance
      bluffFrequency: 0.25, // 25% bluff frequency
    };
  }

  /**
   * Initialize game configuration with Claim-specific settings
   */
  protected override InitializeGameConfiguration(): void {
    super.InitializeGameConfiguration();
    this.maxPlayers = 4;
    this.numberOfCards = 3;
    this.maxRounds = 10;
    this.turnDuration = 60;
    this.initialPlayerCoins = 10000;
    this.baseBet = 5;
    this.layoutAssetPath = '/GameModeConfig/claim.json';
  }

  // ========================================
  // Validation Methods (Override abstract)
  // ========================================

  /**
   * Check if a move is valid in the current game state
   * Claim-specific move validation logic
   */
  override isValidMove(action: PlayerAction, gameState: Record<string, unknown>): boolean {
    // Basic validation
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
}

