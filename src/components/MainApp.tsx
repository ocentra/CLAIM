import React, { useState, useRef, Suspense } from 'react';
import { useGameStore } from '@store';
import { useAuth } from '@providers';
import { DynamicBackground3D, AssetLoadingScreen, AppLoadingScreen, ErrorScreen, AuthScreen, type RotationControlAPI } from '@ui';
import { useAuthHandlers, useMainAppLogger, useLoadingState } from '@hooks';

const workOngameScene = false; // toggle while iterating on the dedicated game scene workbench

// Lazy-load GameScreen so it doesn't eagerly import game assets on welcome screen
// Assets will only load when user actually enters a game
// Using relative path for reliable dynamic import resolution
const GameScreen = React.lazy(() =>
  import('../ui/components/GameScreen/CardGameScreen').then(m => ({ default: m.GameScreen }))
);

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, user, login, signUp, logout, loginWithFacebook, loginWithGoogle, loginAsGuest, sendPasswordReset } = useAuth();
  // Wallet login is handled directly in LoginDialog component
  const handleWalletLogin = async (): Promise<{ success: boolean; error?: string }> => {
    // This will be handled in LoginDialog with actual wallet connection
    return { success: false, error: 'Please connect your wallet in the login dialog' };
  };
  
  const authHandlers = useAuthHandlers(login, signUp, loginWithFacebook, loginWithGoogle, loginAsGuest, handleWalletLogin);
  const logger = useMainAppLogger();
  const { error } = useGameStore();
  // REMOVED: useAssetManager({ autoInitialize: true })
  // Assets should ONLY load when user enters actual game, not on welcome/auth screen
  // This prevents loading card images and game assets when just showing login
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);
  const rotationRef = useRef<RotationControlAPI | null>(null);

  const { shouldShowLoading, showLoginDialog } = useLoadingState({
    isBackgroundReady,
    isAuthenticated,
  });

  logger.logRender({
    isAuthenticated,
    user: user ? { uid: user.uid, displayName: user.displayName } : null,
    isBackgroundReady,
    shouldShowLoading,
    showLoginDialog
  });

  // Early returns for error and loading states
  if (error) {
    logger.logError('[render] ❌ Game store error:', error);
    return <ErrorScreen title="Error" message={error} />;
  }
  
  // Main app render - always show background
  return (
    <div className="app main-app-container">
      <DynamicBackground3D 
        controlRef={rotationRef}
        onReady={() => {
          logger.logUI('[onReady] ✅ Background is ready');
          setIsBackgroundReady(true);
        }} 
      />
      
      {/* Initial app loading - shows while 3D background loads, before login/welcome page */}
      {shouldShowLoading && !isAuthenticated && <AppLoadingScreen isBackgroundReady={isBackgroundReady} />}
      
      <AuthScreen
        isAuthenticated={isAuthenticated}
        user={user}
        showLoginDialog={showLoginDialog}
        onLogin={authHandlers.login}
        onSignUp={authHandlers.signUp}
        onFacebookLogin={authHandlers.facebookLogin}
        onGoogleLogin={authHandlers.googleLogin}
        onGuestLogin={authHandlers.guestLogin}
        onWalletLogin={authHandlers.walletLogin}
        onLogout={logout}
        onSendPasswordReset={sendPasswordReset}
        onLogoutClick={() => logger.logUI('[onClick] Logout button clicked')}
        onTabSwitch={() => {
          logger.logUI('[onTabSwitch] Tab switch triggered, rotating background');
          if (rotationRef.current?.rotate) {
            rotationRef.current.rotate();
          }
        }}
      />
    </div>
  );
};

const MainApp: React.FC = () => {
  if (workOngameScene) {
    return (
      <Suspense fallback={<AssetLoadingScreen message="Loading game..." />}>
        <GameScreen />
      </Suspense>
    );
  }

  return <AuthenticatedApp />;
};

export default MainApp;