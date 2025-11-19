import { useState } from 'react';
import type { UserProfile } from '@services';
import { ProfilePictureModal } from './ProfilePictureModal';
import mLogo from '@assets/Mlogo.png';
import ocentraText from '@assets/OcentraText.png';
import gamesText from '@assets/GamesText.png';
import './GameHeader.css';

interface GameHeaderProps {
  user: UserProfile | null;
  onLogout?: () => void;
  showProfile?: boolean;
  variant?: 'welcome' | 'game'; // 'welcome' for store page, 'game' for game-specific pages
  gameName?: string; // Game name to display in center (e.g., 'CLAIM', 'Poker')
  onHomeClick?: () => void; // Callback for home button click
  tagline?: string; // Tagline to display below game title
}

export function GameHeader({ user, onLogout, showProfile = true, variant = 'game', gameName = 'CLAIM', onHomeClick, tagline }: GameHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);

  const handleLogout = () => {
    setShowProfileMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Welcome/store variant: Big circular logo centered
  if (variant === 'welcome') {
    return (
      <header className={`game-header game-header--welcome`}>
        <div className="header-container header-container--welcome">
          {/* Logo unit - Ocentra | Circle | Games */}
          <div className="header-logo-unit">
            <img src={ocentraText} alt="Ocentra" className="header-text-image header-text-left" />
            <div className="header-logo-circle-wrapper">
              <div className="header-logo-circle">
                <img src={mLogo} alt="Ocentra AI" className="header-logo-circle-image" />
              </div>
            </div>
            <img src={gamesText} alt="Games" className="header-text-image header-text-right" />
          </div>

          {/* Right side bar - spans edge to edge */}
          <div className="header-right--welcome"></div>

          {/* Profile - positioned at right edge */}
          {showProfile && user && (
            <div className="user-profile-section">
                <button
                  type="button"
                  className="user-profile-compact"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="User profile menu"
                  aria-expanded={showProfileMenu}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="profile-avatar-compact" />
                  ) : (
                    <div className="profile-avatar-placeholder-compact">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="profile-name-compact">{user.displayName || 'Player'}</span>
                  <span className="profile-arrow">▼</span>
                </button>

                {showProfileMenu && (
                  <>
                    <button
                      type="button"
                      className="profile-menu-backdrop"
                      onClick={() => setShowProfileMenu(false)}
                      aria-label="Close profile menu"
                    />
                    <div className="profile-menu-compact">
                      <div className="profile-menu-header">
                        <button
                          type="button"
                          className="profile-picture-wrapper"
                          onClick={() => {
                            setShowPictureModal(true);
                            setShowProfileMenu(false);
                          }}
                          aria-label="Change profile picture"
                        >
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="profile-menu-avatar" />
                          ) : (
                            <div className="profile-menu-avatar-placeholder">
                              {user.displayName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="edit-overlay">
                            <span>✏️</span>
                          </div>
                        </button>
                        <div className="profile-menu-info">
                          <div className="profile-menu-name">{user.displayName}</div>
                          <div className="profile-menu-email">{user.email}</div>
                        </div>
                      </div>
                      
                      <div className="profile-menu-divider"></div>
                      
                      <div className="profile-stats">
                        <div className="profile-stat">
                          <span className="stat-label">ELO</span>
                          <span className="stat-value">{user.eloRating || 1200}</span>
                        </div>
                        <div className="profile-stat">
                          <span className="stat-label">Games</span>
                          <span className="stat-value">{user.gamesPlayed || 0}</span>
                        </div>
                        <div className="profile-stat">
                          <span className="stat-label">Win Rate</span>
                          <span className="stat-value">{user.winRate?.toFixed(1) || 0}%</span>
                        </div>
                      </div>
                      
                      <div className="profile-menu-divider"></div>
                      
                      <button className="profile-logout-button" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </>
                )}
            </div>
          )}
        </div>
        
        <ProfilePictureModal 
          isOpen={showPictureModal}
          onClose={() => setShowPictureModal(false)}
        />
      </header>
    );
  }

  // Game variant: Current layout (game title in center, profile on right)
  return (
    <header className="game-header game-header--game">
      {/* Parent div - fully transparent */}
      <div className="header-container">
        {/* Left child - Home button */}
        <div className="header-left">
          {onHomeClick && (
            <button 
              className="header-home-button"
              onClick={onHomeClick}
              title="Home"
              aria-label="Home"
            >
              <span className="home-icon">🏠</span>
              <span className="home-text">Home</span>
            </button>
          )}
        </div>

        {/* Center child - just a border */}
        <div className="header-center">
          <div className="header-center-content">
            <h1 className="game-title">
              <span className="suit-black">♠</span>
              <span className="suit-red">♥</span>
              {` ${gameName} `}
              <span className="suit-red">♦</span>
              <span className="suit-black">♣</span>
            </h1>
            {tagline && (
              <p className="header-tagline">{tagline}</p>
            )}
          </div>
        </div>

        {/* Right child - half of parent, semi-transparent */}
        <div className="header-right">
          {showProfile && user && (
            <div className="user-profile-section">
              <button
                type="button"
                className="user-profile-compact"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="User profile menu"
                aria-expanded={showProfileMenu}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="profile-avatar-compact" />
                ) : (
                  <div className="profile-avatar-placeholder-compact">
                    {user.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="profile-name-compact">{user.displayName || 'Player'}</span>
                <span className="profile-arrow">▼</span>
              </button>

              {showProfileMenu && (
                <>
                  <button
                    type="button"
                    className="profile-menu-backdrop"
                    onClick={() => setShowProfileMenu(false)}
                    aria-label="Close profile menu"
                  />
                  <div className="profile-menu-compact">
                    <div className="profile-menu-header">
                      <button
                        type="button"
                        className="profile-picture-wrapper"
                        onClick={() => {
                          setShowPictureModal(true);
                          setShowProfileMenu(false);
                        }}
                        aria-label="Change profile picture"
                      >
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="profile-menu-avatar" />
                        ) : (
                          <div className="profile-menu-avatar-placeholder">
                            {user.displayName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="edit-overlay">
                          <span>✏️</span>
                        </div>
                      </button>
                      <div className="profile-menu-info">
                        <div className="profile-menu-name">{user.displayName}</div>
                        <div className="profile-menu-email">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="profile-menu-divider"></div>
                    
                    <div className="profile-stats">
                      <div className="profile-stat">
                        <span className="stat-label">ELO</span>
                        <span className="stat-value">{user.eloRating || 1200}</span>
                      </div>
                      <div className="profile-stat">
                        <span className="stat-label">Games</span>
                        <span className="stat-value">{user.gamesPlayed || 0}</span>
                      </div>
                      <div className="profile-stat">
                        <span className="stat-label">Win Rate</span>
                        <span className="stat-value">{user.winRate?.toFixed(1) || 0}%</span>
                      </div>
                    </div>
                    
                    <div className="profile-menu-divider"></div>
                    
                    <button className="profile-logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <ProfilePictureModal 
        isOpen={showPictureModal}
        onClose={() => setShowPictureModal(false)}
      />
    </header>
  );
}

