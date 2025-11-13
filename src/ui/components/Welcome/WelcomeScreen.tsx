import type { UserProfile } from '@services';
import { EventBus } from '@/lib/eventing/EventBus'
import { ShowScreenEvent } from '@/lib/eventing/events/lobby'
import { GameHeader } from '@ui/components/Header/GameHeader';
import { GameFooter } from '@ui/components/Footer/GameFooter';
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

  const handleSettingsClick = () => {
    EventBus.instance.publish(new ShowScreenEvent('settings'))
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
      
      {/* Settings button */}
      <button 
        className="settings-button"
        onClick={handleSettingsClick}
        title="AI Settings"
      >
        ⚙️ Settings
      </button>
      
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
