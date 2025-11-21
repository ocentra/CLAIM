import { useState, useEffect } from 'react'
import type { UserProfile } from '@services';
import { EventBus } from '@/lib/eventing/EventBus'
import { ShowScreenEvent } from '@/lib/eventing/events/lobby'
import LoginDialog from './LoginDialog';
import { Home } from '@/ui/pages/Home/HomePage';
import { ClaimPage, ThreeCardBragPage } from '@/ui/pages/games';
import { SettingsPage } from '@/ui/pages/Settings/SettingsPage'

interface AuthScreenProps {
  isAuthenticated: boolean;
  user: UserProfile | null;
  showLoginDialog: boolean;
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (userData: { alias: string; avatar: string; username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  onFacebookLogin: () => Promise<{ success: boolean; error?: string }>;
  onGoogleLogin: () => Promise<{ success: boolean; error?: string }>;
  onGuestLogin: () => Promise<{ success: boolean; error?: string }>;
  onWalletLogin: () => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
  onSendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  onLogoutClick?: () => void;
  onTabSwitch?: () => void;
}

export function AuthScreen({
  isAuthenticated,
  user,
  showLoginDialog,
  onLogin,
  onSignUp,
  onFacebookLogin,
  onGoogleLogin,
  onGuestLogin,
  onWalletLogin,
  onLogout,
  onSendPasswordReset,
  onLogoutClick,
  onTabSwitch,
}: AuthScreenProps) {
  // Initialize screen from URL if available
  const getInitialScreen = (): 'home' | 'claim' | 'threecardbrag' | 'poker' | 'settings' => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path === '/claim') return 'claim';
    if (path === '/threecardbrag') return 'threecardbrag';
    if (path === '/poker') return 'poker';
    if (path === '/settings') return 'settings';
    return 'home';
  };

  const [currentScreen, setCurrentScreen] = useState<'home' | 'claim' | 'threecardbrag' | 'poker' | 'settings'>(getInitialScreen())

  useEffect(() => {
    const handleShowScreen = (event: ShowScreenEvent) => {
      const validScreens = ['settings', 'home', 'claim', 'threecardbrag', 'poker'];
      if (validScreens.includes(event.screen)) {
        setCurrentScreen(event.screen as 'home' | 'claim' | 'threecardbrag' | 'poker' | 'settings')
      }
    }

    EventBus.instance.subscribe(ShowScreenEvent, handleShowScreen)

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/claim') {
        setCurrentScreen('claim');
      } else if (path === '/threecardbrag') {
        setCurrentScreen('threecardbrag');
      } else if (path === '/poker') {
        setCurrentScreen('poker');
      } else if (path === '/settings') {
        setCurrentScreen('settings');
      } else {
        setCurrentScreen('home');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      EventBus.instance.unsubscribe(ShowScreenEvent, handleShowScreen);
      window.removeEventListener('popstate', handlePopState);
    }
  }, [])

  if (isAuthenticated) {
    if (currentScreen === 'settings') {
      return <SettingsPage />
    }
    
    if (currentScreen === 'claim') {
      return (
        <ClaimPage
          user={user}
          onLogout={onLogout}
          onLogoutClick={onLogoutClick}
        />
      );
    }
    
    if (currentScreen === 'threecardbrag') {
      return (
        <ThreeCardBragPage
          user={user}
          onLogout={onLogout}
          onLogoutClick={onLogoutClick}
        />
      );
    }
    
    if (currentScreen === 'poker') {
      return (
        <ClaimPage
          user={user}
          onLogout={onLogout}
          onLogoutClick={onLogoutClick}
          gameName="Poker"
        />
      );
    }
    
    // Default to home page
    return (
      <Home
        user={user}
        onLogout={onLogout}
        onLogoutClick={onLogoutClick}
      />
    );
  }

  if (showLoginDialog) {
    return (
      <LoginDialog
        onLogin={onLogin}
        onSignUp={onSignUp}
        onFacebookLogin={onFacebookLogin}
        onGoogleLogin={onGoogleLogin}
        onGuestLogin={onGuestLogin}
        onWalletLogin={onWalletLogin}
        onSendPasswordReset={onSendPasswordReset}
        onTabSwitch={onTabSwitch}
      />
    );
  }

  return null;
}

