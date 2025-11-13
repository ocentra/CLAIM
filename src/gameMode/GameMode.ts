// GameMode.ts
// Base class for game modes, providing game rules and AI context
// Adapted from Unity's GameMode.cs

import { GameRulesContainer } from './GameRulesContainer';
import { CardRanking } from './CardRanking';
import type { PlayerAction } from '@/types';

/**
 * GameMode - Base class for game rules and AI context
 * Provides game rules, descriptions, strategy tips, and move validity conditions
 */
export abstract class GameMode {
  /**
   * Game rules container (LLM and Player versions)
   */
  abstract getGameRules(): GameRulesContainer;

  /**
   * Game description for AI context
   */
  abstract getGameDescription(): string;

  /**
   * Strategy tips for AI decision-making
   */
  abstract getStrategyTips(): string[];

  /**
   * Card ranking system
   */
  abstract getCardRanking(): CardRanking;

  /**
   * Check if a move is valid in the current game state
   */
  abstract isValidMove(action: PlayerAction, gameState: Record<string, unknown>): boolean;

  /**
   * Get bonus rules (special scoring conditions)
   */
  abstract getBonusRules(): string;

  /**
   * Get move validity conditions description
   */
  abstract getMoveValidityConditions(): string;

  /**
   * Get bluff settings (if applicable)
   */
  abstract getBluffSettings(): string;

  /**
   * Get example hands for AI learning
   */
  abstract getExampleHands(): string[];

  /**
   * Get AI strategy parameters
   */
  abstract getAIStrategyParameters(): {
    aggressiveness: number;
    riskTolerance: number;
    bluffFrequency: number;
  };
}

