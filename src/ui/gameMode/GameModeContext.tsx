import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { GameModeConfig } from './gameModeTypes'
import { ensureGameAssetLoaded } from '../layout/loadGameUiPreset'

interface GameModeContextValue {
  gameMode: GameModeConfig
  isReady: boolean
}

const GameModeContext = createContext<GameModeContextValue | null>(null)

interface GameModeProviderProps {
  config: GameModeConfig
  children: React.ReactNode
}

export const GameModeProvider: React.FC<GameModeProviderProps> = ({ config, children }) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadConfigs() {
      await ensureGameAssetLoaded(config.uiPresetId ?? config.id)
      if (!cancelled) {
        setLoaded(true)
      }
    }

    loadConfigs()
    return () => {
      cancelled = true
    }
  }, [config])

  const value = useMemo(
    () => ({
      gameMode: config,
      isReady: isLoaded,
    }),
    [config, isLoaded],
  )

  return <GameModeContext.Provider value={value}>{children}</GameModeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGameMode(): GameModeContextValue {
  const ctx = useContext(GameModeContext)
  if (!ctx) {
    throw new Error('useGameMode must be used within a GameModeProvider')
  }
  return ctx
}

