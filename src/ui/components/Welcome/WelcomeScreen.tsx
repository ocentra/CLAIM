import type { UserProfile } from '../../../services/firebaseService';
import { GameHeader } from '../Header/GameHeader';
import { GameFooter } from '../Footer/GameFooter';
import { GameModeSelector } from './GameModeSelector';
import { GameInfoTabs } from './GameInfoTabs';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  user: UserProfile | null;
  onLogout: () => void;
  onLogoutClick?: () => void;
}

export function WelcomeScreen({ user, onLogout, onLogoutClick }: WelcomeScreenProps) {
  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
    onLogout();
  };

  const handlePlaySinglePlayer = (config: { aiCount: number; aiModel: string }) => {
    console.log('Starting single player game...', config);
    // TODO: Navigate to single player game
  };

  const handlePlayMultiplayer = (config: { humans: number; ai: number; aiModel: string }) => {
    console.log('Starting multiplayer game...', config);
    // TODO: Navigate to multiplayer game
  };

  return (
    <div className="welcome-screen">
      <GameHeader user={user} onLogout={handleLogout} showProfile={true} />
      
      {/* Tagline right below header */}
      <div className="tagline-section">
        <p className="welcome-subtitle">Simple Rules. Deadly Game.</p>
      </div>

      {/* Main content */}
      <div className="welcome-main">
        <GameModeSelector
          onPlaySinglePlayer={handlePlaySinglePlayer}
          onPlayMultiplayer={handlePlayMultiplayer}
        />
        
        <GameInfoTabs />
      </div>

      <GameFooter />
    </div>
  );
}
