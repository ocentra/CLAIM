// GameMode.ts
// Base class for game modes, providing game rules and AI context
// Adapted from Unity's GameMode.cs
// Data-driven: All game data stored as Serializable properties for asset system

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';
import { GameRulesContainer } from './GameRulesContainer';
import { CardRanking } from './CardRanking';
import type { PlayerAction } from '@/types';
import type { ISaveGameModeAsset } from './interfaces/ISaveGameModeAsset';

/**
 * GameMode - Serializable base class for game rules and AI context
 * Data-driven: All data stored as Serializable properties, loaded from `.asset` files
 * Abstract class that derived classes (ClaimGameMode, etc.) extend
 * Implements ISaveGameModeAsset interface for asset saving
 */
export abstract class GameMode extends ScriptableObject implements ISaveGameModeAsset {
  /**
   * Schema version for asset serialization
   * Increment on breaking changes, use migrate() for version handling
   */
  static schemaVersion = 2;

  // ========================================
  // Asset References (Nested Assets)
  // ========================================

  /**
   * Reference to GameRulesAsset (GUID)
   */
  @serializable({ label: 'Game Rules Asset ID' })
  gameRulesAssetId?: string;

  /**
   * Reference to GameDescriptionAsset (GUID)
   */
  @serializable({ label: 'Game Description Asset ID' })
  gameDescriptionAssetId?: string;

  /**
   * Reference to StrategyTipsAsset (GUID)
   */
  @serializable({ label: 'Strategy Tips Asset ID' })
  strategyTipsAssetId?: string;

  /**
   * Reference to CardRankingAsset (GUID)
   */
  @serializable({ label: 'Card Ranking Asset ID' })
  cardRankingAssetId?: string;

  // ========================================
  // Runtime Properties (Populated from Assets or Defaults)
  // ========================================

  /**
   * Game rules container (LLM and Player versions)
   * Populated from GameRulesAsset if available, otherwise uses embedded default
   */
  @serializable({ label: 'Game Rules' })
  gameRules!: GameRulesContainer;

  /**
   * Game description container (LLM and Player versions)
   * Populated from GameDescriptionAsset if available, otherwise uses embedded default
   */
  @serializable({ label: 'Game Description' })
  gameDescription!: GameRulesContainer;

  /**
   * Strategy tips container (LLM and Player versions)
   * Populated from StrategyTipsAsset if available, otherwise uses embedded default
   */
  @serializable({ label: 'Strategy Tips' })
  strategyTips!: GameRulesContainer;

  /**
   * Card rankings array
   * Populated from CardRankingAsset if available, otherwise uses embedded default
   */
  @serializable({ label: 'Card Rankings', elementType: CardRanking })
  cardRankings!: CardRanking[];

  // ========================================
  // Move Validity & Rules (Serializable)
  // ========================================

  /**
   * Move validity conditions dictionary
   * Maps move types to validity descriptions
   * Example: { "pick_up": "Only valid when floor card is available", ... }
   */
  @serializable({ label: 'Move Validity Conditions' })
  moveValidityConditions!: Record<string, string>;

  /**
   * Bluff settings dictionary
   * Maps difficulty levels or scenarios to bluffing strategies
   * Example: { "easy": "Bluff frequency 10%", "hard": "Bluff frequency 30%", ... }
   */
  @serializable({ label: 'Bluff Settings' })
  bluffSettings!: Record<string, string>;

  /**
   * Example hands array
   * Example hands for AI learning and player reference
   * Example: ["Strong hand: Ace of Spades, King of Hearts, ...", ...]
   */
  @serializable({ label: 'Example Hands' })
  exampleHands!: string[];

  /**
   * Bonus rules string
   * Special scoring conditions and bonus point rules
   */
  @serializable({ label: 'Bonus Rules' })
  bonusRules!: string;

  // ========================================
  // AI Strategy Parameters (Serializable)
  // ========================================

  /**
   * AI strategy parameters
   * Aggressiveness, risk tolerance, bluff frequency
   */
  @serializable({ label: 'AI Strategy Parameters' })
  aiStrategyParameters!: {
    aggressiveness: number;
    riskTolerance: number;
    bluffFrequency: number;
  };

  // ========================================
  // Game Configuration (Serializable)
  // ========================================

  /**
   * Maximum number of players for this game mode
   */
  @serializable({ label: 'Max Players' })
  maxPlayers!: number;

  /**
   * Number of cards each player receives
   */
  @serializable({ label: 'Number of Cards' })
  numberOfCards!: number;

  /**
   * Maximum number of rounds (undefined = no limit)
   */
  @serializable({ label: 'Max Rounds' })
  maxRounds?: number;

  /**
   * Turn duration in seconds
   */
  @serializable({ label: 'Turn Duration (seconds)' })
  turnDuration!: number;

  /**
   * Initial coins/points each player starts with
   */
  @serializable({ label: 'Initial Player Coins' })
  initialPlayerCoins!: number;

  /**
   * Base bet amount
   */
  @serializable({ label: 'Base Bet' })
  baseBet!: number;

  /**
   * Layout asset path (reference to layout JSON)
   * Example: "/GameModeConfig/claim.json"
   */
  @serializable({ label: 'Layout Asset Path' })
  layoutAssetPath?: string;

  // ========================================
  // Initialization Pattern (Unity-style)
  // ========================================

  /**
   * Try to initialize the GameMode
   * Calls all initialization methods and saves changes
   * Returns true if successful
   */
  protected async TryInitialize(): Promise<boolean> {
    // Initialize all properties via initialization methods
    this.InitializeGameRules();
    this.InitializeGameDescription();
    this.InitializeStrategyTips();
    this.InitializeCardRankings();
    this.InitializeMoveValidityConditions();
    this.InitializeBluffSettings();
    this.InitializeExampleHands();
    this.InitializeBonusRules();
    this.InitializeAIStrategyParameters();
    this.InitializeGameConfiguration();

    // Save changes after initialization
    await this.saveChanges();

    return true;
  }

  /**
   * Initialize game rules (override in derived classes)
   */
  protected InitializeGameRules(): void {
    if (!this.gameRules) {
      this.gameRules = new GameRulesContainer();
    }
    // Derived classes override this to set actual values
  }

  /**
   * Initialize game description (override in derived classes)
   */
  protected InitializeGameDescription(): void {
    if (!this.gameDescription) {
      this.gameDescription = new GameRulesContainer();
    }
    // Derived classes override this to set actual values
  }

  /**
   * Initialize strategy tips (override in derived classes)
   */
  protected InitializeStrategyTips(): void {
    if (!this.strategyTips) {
      this.strategyTips = new GameRulesContainer();
    }
    // Derived classes override this to set actual values
  }

  /**
   * Initialize card rankings (override in derived classes)
   */
  protected InitializeCardRankings(): void {
    if (!this.cardRankings) {
      this.cardRankings = [];
    }
    // Derived classes override this to populate array
  }

  /**
   * Initialize move validity conditions (override in derived classes)
   */
  protected InitializeMoveValidityConditions(): void {
    if (!this.moveValidityConditions) {
      this.moveValidityConditions = {};
    }
    // Derived classes override this to populate dictionary
  }

  /**
   * Initialize bluff settings (override in derived classes)
   */
  protected InitializeBluffSettings(): void {
    if (!this.bluffSettings) {
      this.bluffSettings = {};
    }
    // Derived classes override this to populate dictionary
  }

  /**
   * Initialize example hands (override in derived classes)
   */
  protected InitializeExampleHands(): void {
    if (!this.exampleHands) {
      this.exampleHands = [];
    }
    // Derived classes override this to populate array
  }

  /**
   * Initialize bonus rules (override in derived classes)
   */
  protected InitializeBonusRules(): void {
    if (!this.bonusRules) {
      this.bonusRules = '';
    }
    // Derived classes override this to set actual value
  }

  /**
   * Initialize AI strategy parameters (override in derived classes)
   */
  protected InitializeAIStrategyParameters(): void {
    if (!this.aiStrategyParameters) {
      this.aiStrategyParameters = {
        aggressiveness: 0.5,
        riskTolerance: 0.5,
        bluffFrequency: 0.2,
      };
    }
    // Derived classes override this to set actual values
  }

  /**
   * Initialize game configuration (override in derived classes)
   */
  protected InitializeGameConfiguration(): void {
    // Set default values if not already set
    if (this.maxPlayers === undefined) this.maxPlayers = 4;
    if (this.numberOfCards === undefined) this.numberOfCards = 3;
    if (this.turnDuration === undefined) this.turnDuration = 60;
    if (this.initialPlayerCoins === undefined) this.initialPlayerCoins = 10000;
    if (this.baseBet === undefined) this.baseBet = 5;
    // Derived classes override this to set game-specific values
  }

  // ========================================
  // Validation Methods (non-Serializable)
  // ========================================

  /**
   * Check if a move is valid in the current game state
   * Abstract method - derived classes must implement validation logic
   */
  abstract isValidMove(action: PlayerAction, gameState: Record<string, unknown>): boolean;

  // ========================================
  // Save Contract (ISaveGameModeAsset)
  // ========================================

  /**
   * Save changes to the asset file
   * Implements ISaveGameModeAsset interface
   * Serializes this GameMode and saves to `.asset` file via save API
   */
  async saveChanges(): Promise<void> {
    // Only save in dev mode
    if (import.meta.env.PROD) {
      console.warn('[GameMode] saveChanges() is only available in development mode.');
      return;
    }

    try {
      // Serialize this GameMode instance
      const { serialize } = await import('@/lib/serialization/Serializable');
      const serialized = serialize(this);

      // Extract game ID from metadata or determine from class type
      // For now, we need to determine gameId - this could be stored as a property
      // TODO: Add gameId property to GameMode or determine from instance type
      let gameId: string | undefined;
      
      // Try to get gameId from metadata if it exists in serialized data
      // Or we can infer from class name
      const className = this.constructor.name;
      if (className === 'ClaimGameMode') {
        gameId = 'claim';
      } else {
        // Try to infer from class name (e.g., "PokerGameMode" -> "poker")
        gameId = className.replace('GameMode', '').toLowerCase();
      }

      if (!gameId) {
        throw new Error('Could not determine gameId for saving asset');
      }

      // Add metadata and asset type info
      const assetData = {
        __schemaVersion: (this.constructor as { schemaVersion?: number }).schemaVersion || 1,
        __assetType: 'GameMode',
        __assetId: gameId,
        metadata: {
          gameId,
          gameName: className.replace('GameMode', ''),
          displayName: className.replace('GameMode', ''),
          schemaVersion: (this.constructor as { schemaVersion?: number }).schemaVersion || 1,
          updatedAt: new Date().toISOString(),
        },
        ...serialized,
      };

      // Save via API endpoint
      const response = await fetch('/__dev/api/save-game-mode-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, asset: assetData }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to save asset: ${error.message || response.statusText}`);
      }

      console.log(`[GameMode] Saved asset: ${gameId}.asset`);
    } catch (error) {
      console.error('[GameMode] Failed to save changes:', error);
      throw error;
    }
  }
}

