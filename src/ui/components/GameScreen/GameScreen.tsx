import React, { useEffect, useRef, useState } from 'react';
import { GameHeader } from '../Header/GameHeader';
import { GameFooter } from '../Footer/GameFooter';
import { useAuth } from '../../../providers/AuthProvider';
import GameBackground from './GameBackground';
import GameHUD from './GameHUD';
import CardInHand from './CardInHand';
import './GameScreen.css';
import { CARD_IN_HAND_DEFAULTS } from './CardInHand.constants';

export const GameScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const hudCenterRef = useRef<HTMLDivElement | null>(null);
  const [hudAnchor, setHudAnchor] = useState<{ x: number; y: number; radius: number } | null>(null);

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
    <div className="game-screen">
      <GameBackground />

      <div className="game-screen__layer">
        <GameHeader user={user} onLogout={logout} />

        <main className="game-screen__content">
        <CardInHand
            anchorPoint={hudAnchor ?? undefined}
            position="fixed"
            cardCount={CARD_IN_HAND_DEFAULTS.CARD_COUNT}
            arcStart={CARD_IN_HAND_DEFAULTS.ARC_START}
            arcEnd={CARD_IN_HAND_DEFAULTS.ARC_END}
            radius={CARD_IN_HAND_DEFAULTS.RADIUS}
            zIndex={CARD_IN_HAND_DEFAULTS.Z_INDEX_BASE}
          />

          <GameHUD ref={hudCenterRef} />
        </main>

        <GameFooter />
      </div>
    </div>
  );
};

export default GameScreen;

