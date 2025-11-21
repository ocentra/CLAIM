import type { UserProfile } from '@services';
import { EventBus } from '@/lib/eventing/EventBus';
import { ShowScreenEvent } from '@/lib/eventing/events/lobby';
import { GameHeader } from '@/ui/components/Header/GameHeader';
import { GameFooter } from '@/ui/components/Footer/GameFooter';
import { GameModeSelector } from './GameModeSelector';
import { GameInfoTabs } from './GameInfoTabs';
import './ThreeCardBragGamePage.css';

interface ThreeCardBragPageProps {
  user: UserProfile | null;
  onLogout: () => void;
  onLogoutClick?: () => void;
  gameName?: string; // Defaults to 'ThreeCard Brag' if not provided
}

export function ThreeCardBragPage({ user, onLogout, onLogoutClick, gameName = 'ThreeCard Brag' }: ThreeCardBragPageProps) {
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

  const handleBackToHome = () => {
    // Update URL without page reload
    if (window.history && window.history.pushState) {
      window.history.pushState({ screen: 'home' }, '', '/');
    }
    EventBus.instance.publish(new ShowScreenEvent('home'));
  };

  return (
    <div className="claim-page">
      <GameHeader 
        user={user} 
        onLogout={handleLogout} 
        showProfile={true} 
        variant="game" 
        gameName={gameName}
        onHomeClick={handleBackToHome}
        tagline="Simple Rules. Deadly Game."
      />

      {/* Main content */}
      <div className="claim-main">
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

