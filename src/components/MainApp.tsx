import React, { useState, useRef } from 'react';
import { useGameStore } from '@store';
import { useAssetManager } from '@utils/useAssetManager';
import { useAuth } from '@providers';
import { DynamicBackground3D, AssetLoadingScreen, AppLoadingScreen, ErrorScreen, AuthScreen, GameScreen, type RotationControlAPI } from '@ui';
import { useAuthHandlers, useMainAppLogger, useLoadingState } from '@hooks';

const workOngameScene = false; // toggle while iterating on the dedicated game scene workbench

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
  const { isInitialized, isLoading, error: assetError } = useAssetManager({ autoInitialize: true });
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);
  const rotationRef = useRef<RotationControlAPI | null>(null);
  
  const { shouldShowLoading, showLoginDialog } = useLoadingState({
    isBackgroundReady,
    isAuthenticated,
  });

  logger.logRender({ 
    isAuthenticated, 
    user: user ? { uid: user.uid, displayName: user.displayName } : null,
    isInitialized, 
    isLoading, 
    isBackgroundReady, 
    shouldShowLoading,
    showLoginDialog
  });
  
  // Early returns for error and loading states
  if (error) {
    logger.logError('[render] ❌ Game store error:', error);
    return <ErrorScreen title="Error" message={error} />;
  }
  
  if (isLoading || !isInitialized) {
    return <AssetLoadingScreen message="Loading..." />;
  }
  
  if (assetError) {
    logger.logError('[render] ❌ Asset loading error:', assetError);
    return (
      <ErrorScreen 
        title="Asset Loading Error" 
        message={assetError} 
        onRetry={() => window.location.reload()}
        retryLabel="Retry"
      />
    );
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
    return <GameScreen />;
  }

  return <AuthenticatedApp />;
};

export default MainApp;