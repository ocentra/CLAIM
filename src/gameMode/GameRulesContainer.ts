// GameRulesContainer.ts
// Container for LLM and Player versions of game rules/descriptions
// Adapted from Unity's GameRulesContainer.cs

/**
 * GameRulesContainer - Simple container for game rules
 * Contains both LLM-friendly and Player-friendly versions
 */
export class GameRulesContainer {
  /**
   * LLM version - Detailed, structured rules for AI understanding
   */
  LLM: string;

  /**
   * Player version - Human-readable, concise rules for players
   */
  Player: string;

  constructor(llm: string, player: string) {
    this.LLM = llm;
    this.Player = player;
  }
}

