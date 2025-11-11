import type { GameModeConfig } from './gameModeTypes'

export const GAME_MODES: Record<string, GameModeConfig> = {
  claim: {
    id: 'claim',
    name: 'Claim',
    minPlayers: 2,
    maxPlayers: 4,
  },
}

export function getGameModeConfig(id: string): GameModeConfig {
  const config = GAME_MODES[id]
  if (!config) {
    throw new Error(`Unknown game mode: ${id}`)
  }
  return config
}

