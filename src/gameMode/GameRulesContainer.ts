// GameRulesContainer.ts
// Container for LLM and Player versions of game rules/descriptions
// Adapted from Unity's GameRulesContainer.cs

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';

/**
 * GameRulesContainer - Serializable container for game rules
 * Contains both LLM-friendly and Player-friendly versions
 * Data-driven: All data stored as Serializable properties for asset system
 */
export class GameRulesContainer {
  /**
   * LLM version - Detailed, structured rules for AI understanding
   */
  @serializable({ label: 'LLM Rules' })
  LLM!: string;

  /**
   * Player version - Human-readable, concise rules for players
   */
  @serializable({ label: 'Player Rules' })
  Player!: string;

  /**
   * Constructor for backward compatibility
   * During Phase 1-3 transition, allows both constructor-based and property-based initialization
   * Once Phase 3 is complete, constructor can be removed (fully data-driven)
   */
  constructor(llm?: string, player?: string) {
    this.LLM = llm ?? '';
    this.Player = player ?? '';
  }
}

