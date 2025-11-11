export interface GameModeConfig {
  /**
   * Unique identifier matches presets (e.g. 'claim', 'poker').
   */
  id: string;
  /**
   * Display name for UI.
   */
  name: string;
  /**
   * Minimum supported player count for the mode.
   */
  minPlayers: number;
  /**
   * Maximum supported player count for the mode.
   */
  maxPlayers: number;
  /**
   * Identifier of the UI preset file under public/gameUiPresets.
   * Defaults to the mode id when omitted.
   */
  uiPresetId?: string;
  /**
   * Optional identifier if we ever maintain multiple table layout sets.
   * Currently unused; layout defaults to the shared tableLayouts.json.
   */
  layoutId?: string;
}

