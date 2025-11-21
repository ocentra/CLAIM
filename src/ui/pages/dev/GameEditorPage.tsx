import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameHeader } from '@/ui/components/Header/GameHeader';
import { GameFooter } from '@/ui/components/Footer/GameFooter';
import { useAuth } from '@providers';
import {
  GameBackground,
  GameHUD,
  CardInHand,
  CenterTableSvg,
  PlayersOnTable,
} from '@/ui/components/GameScreen';
import '@/ui/components/GameScreen/CardGameScreen/GameScreen.css';
import { GameModeProvider, getGameModeConfig } from '@ui/gameMode';
import './GameEditorPage.css';
import { loadGameUiPreset } from '@ui/layout';
import { tableLayoutStore } from '@ui/layout';

// Dev-only: Table Layout Editor (type definition)
type TableLayoutEditorComponent = React.ComponentType<{
  containerRef: React.RefObject<HTMLDivElement | null>;
}>;

/**
 * Game Editor Page
 * 
 * Dev-only standalone page for editing table layouts.
 * Accessible at:
 * - /GameEditor (select game)
 * - /GameEditor/:gameId (edit specific game, e.g., /GameEditor/claim)
 */
export const GameEditorPage: React.FC = () => {
  const { gameId: routeGameId } = useParams<{ gameId?: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hudCenterRef = useRef<HTMLDivElement | null>(null);
  const [hudAnchor, setHudAnchor] = useState<{ x: number; y: number; radius: number } | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(
    routeGameId?.toLowerCase() || null
  );
  // Only start with loading=true if we have a gameId to load
  const [isLoading, setIsLoading] = useState(!!routeGameId);
  const [error, setError] = useState<string | null>(null);
  const [EditorComponent, setEditorComponent] = useState<TableLayoutEditorComponent | null>(null);

  // Debug: Log when component renders
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[GameEditorPage] Component mounted', { routeGameId, selectedGameId, isLoading });
    }
  }, [routeGameId, selectedGameId, isLoading]);

  // Debug: Log render states
  if (import.meta.env.DEV) {
    console.log('[GameEditorPage] Render state:', {
      routeGameId,
      selectedGameId,
      isLoading,
      error,
      showSelection: !selectedGameId && !isLoading,
    });
  }

  // Dev-only: Lazy load editor component
  useEffect(() => {
    if (import.meta.env.DEV && !EditorComponent) {
      import('@/ui/components/GameScreen/CardGameScreen/CardGameEditor/TableLayoutEditor')
        .then((module) => setEditorComponent(() => module.default))
        .catch(() => {
          console.warn('[GameEditorPage] Failed to load table layout editor');
        });
    }
  }, [EditorComponent]);

  // Redirect if not in dev mode (double-check, routes should not exist in production)
  useEffect(() => {
    if (!import.meta.env.DEV) {
      navigate('/', { replace: true });
      return;
    }
  }, [navigate]);

  // Load game asset when gameId changes
  useEffect(() => {
    if (!selectedGameId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    loadGameUiPreset(selectedGameId)
      .then((asset) => {
        if (!asset || asset.metadata.gameId !== selectedGameId) {
          setError(`Failed to load game configuration for: ${selectedGameId}`);
          setIsLoading(false);
          return;
        }

        // Apply default preset
        const defaultCount = asset.layout.defaultPlayerCount || 4;
        tableLayoutStore.applyPreset(defaultCount);
        
        // Auto-show editor
        tableLayoutStore.setEditorVisible(true);
        
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        setError(`Error loading game: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      });
  }, [selectedGameId]);

  // Update URL when game selection changes
  useEffect(() => {
    // Only update URL if selection changed
    if (selectedGameId && selectedGameId !== routeGameId?.toLowerCase()) {
      navigate(`/GameEditor/${selectedGameId}`, { replace: true });
    }
    // Don't auto-navigate when selectedGameId becomes null - let button handle it
  }, [selectedGameId, routeGameId, navigate]);

  // Measure HUD center for CardInHand positioning
  useEffect(() => {
    const measure = () => {
      const elem = hudCenterRef.current;
      if (!elem) {
        setHudAnchor(null);
        return;
      }
      const rect = elem.getBoundingClientRect();
      setHudAnchor({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        radius: rect.width / 2,
      });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Sync route param to state when route changes
  useEffect(() => {
    if (routeGameId) {
      // Route has gameId - sync to state
      const gameIdLower = routeGameId.toLowerCase();
      if (gameIdLower !== selectedGameId) {
        setSelectedGameId(gameIdLower);
      }
    } else {
      // Route has no gameId - clear state if we have one
      if (selectedGameId !== null) {
        setSelectedGameId(null);
        setIsLoading(false);
        setError(null);
      }
    }
  }, [routeGameId, selectedGameId]);

  if (!import.meta.env.DEV) {
    return <div>This page is only available in development mode.</div>;
  }

  const availableGames = ['claim', 'threecardbrag', 'poker'];

  // Game selection view
  if (!selectedGameId && !isLoading) {
    return (
      <div className="game-screen">
        <GameBackground />
        <div className="game-screen__layer">
          <GameHeader user={user} onLogout={logout} />
          <main className="game-editor-selection-main">
            <h1 className="game-editor-title">Game Layout Editor</h1>
            <p className="game-editor-subtitle">
              Select a game to edit its table layout configuration
            </p>
            <div className="game-editor-button-grid">
              {availableGames.map((gameId) => (
                <button
                  key={gameId}
                  onClick={() => setSelectedGameId(gameId)}
                  className="game-editor-button"
                >
                  {gameId}
                </button>
              ))}
            </div>
          </main>
          <GameFooter />
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="game-screen">
        <GameBackground />
        <div className="game-screen__layer">
          <GameHeader user={user} onLogout={logout} />
          <main className="game-editor-loading-main">
            <div className="game-editor-loading-text">
              <h2>Loading {selectedGameId} configuration...</h2>
            </div>
          </main>
          <GameFooter />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="game-screen">
        <GameBackground />
        <div className="game-screen__layer">
          <GameHeader user={user} onLogout={logout} />
          <main className="game-editor-error-main">
            <h2 className="game-editor-error-title">Error</h2>
            <p className="game-editor-error-message">{error}</p>
            <div className="game-editor-error-buttons">
              <button
                onClick={() => setSelectedGameId(null)}
                className="game-editor-button-secondary"
              >
                Back to Game Selection
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setSelectedGameId(selectedGameId);
                }}
                className="game-editor-button-success"
              >
                Retry
              </button>
            </div>
          </main>
          <GameFooter />
        </div>
      </div>
    );
  }

  // Editor view
  const gameMode = selectedGameId ? getGameModeConfig(selectedGameId) : getGameModeConfig('claim');

  return (
    <GameModeProvider config={gameMode}>
      <div className="game-screen">
        <GameBackground />
        <div className="game-screen__layer">
          <GameHeader
            user={user}
            onLogout={logout}
            gameName={selectedGameId ? selectedGameId.toUpperCase() : 'EDITOR'}
          />
          <main className="game-screen__content game-editor-content-wrapper">
            <CenterTableSvg />
            <PlayersOnTable />
            <CardInHand
              position="fixed"
              anchorPoint={hudAnchor ?? undefined}
              zIndex={120}
            />
            <GameHUD ref={hudCenterRef} />
          </main>

          {/* Editor Panel (dev-only) */}
          {import.meta.env.DEV && EditorComponent && (
            <EditorComponent containerRef={containerRef} />
          )}

          <div className="game-editor-back-button-container">
            <button
              onClick={() => {
                // Simply navigate - the useEffect will handle state sync when route changes
                navigate('/GameEditor', { replace: true });
              }}
              className="game-editor-back-button"
            >
              ← Back to Games
            </button>
          </div>

          <GameFooter />
        </div>
      </div>
    </GameModeProvider>
  );
};

export default GameEditorPage;

