import React, { useEffect, useRef, useState } from 'react';
import { GameHeader } from '@/ui/components/Header/GameHeader';
import { GameFooter } from '@/ui/components/Footer/GameFooter';
import { useAuth } from '@providers';
import { useSolanaBridge } from '@services/solana/useSolanaBridge';
// Import reusable card game components (clean imports via index.ts)
import {
  GameBackground,
  GameHUD,
  CardInHand,
  CenterTableSvg,
  PlayersOnTable,
} from '@/ui/components/GameScreen';
import '@/ui/components/GameScreen/CardGameScreen/GameScreen.css';
import { GameModeProvider, getGameModeConfig } from '@ui/gameMode';

const DEFAULT_GAME_MODE = getGameModeConfig('claim');

/**
 * Claim Game Screen Page
 * 
 * This is the Claim game's specific implementation of the game screen.
 * It uses reusable components from ui/components/GameScreen/CardGameScreen/
 * but can customize or extend them as needed for Claim-specific features.
 */
export const ClaimGameScreenPage: React.FC = () => {
  const { user, logout } = useAuth();
  const hudCenterRef = useRef<HTMLDivElement | null>(null);
  const [hudAnchor, setHudAnchor] = useState<{ x: number; y: number; radius: number } | null>(null);
  
  // Initialize Solana bridge for multiplayer
  useSolanaBridge();

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

  return (
    <GameModeProvider config={DEFAULT_GAME_MODE}>
    <div className="game-screen">
      <GameBackground />

      <div className="game-screen__layer">
        <GameHeader user={user} onLogout={logout} />

        <main className="game-screen__content">
          <CenterTableSvg />
            <PlayersOnTable />
          <CardInHand
            position="fixed"
            anchorPoint={hudAnchor ?? undefined}
            zIndex={120}
          />

          <GameHUD ref={hudCenterRef} />
        </main>

        <GameFooter />
      </div>
    </div>
    </GameModeProvider>
  );
};

export default ClaimGameScreenPage;

