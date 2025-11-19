import './LoadingScreen.css';

interface AppLoadingScreenProps {
  isBackgroundReady: boolean;
}

/**
 * Initial app loading screen - shows while 3D background loads
 * This appears before login/welcome page, not during game loading
 */
export function AppLoadingScreen({ isBackgroundReady }: AppLoadingScreenProps) {
  return (
    <div 
      className={`game-loading-screen ${isBackgroundReady ? 'fade-out' : ''}`}
    >
      <div className="loading-spinner"></div>
      <div className="loading-title">CLAIM</div>
    </div>
  );
}

