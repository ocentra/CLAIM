import { useEffect } from 'react';
import type { UserProfile } from '@services';
import { FeaturedGameCarousel } from '@/ui/components/Common/FeaturedGameCarousel';
import { ComingSoonCarousel } from '@/ui/components/Common/ComingSoonCarousel';
import { AboutUsSection } from '@/ui/components/Common/AboutUsSection';
import { GameHeader } from '@/ui/components/Header/GameHeader';
import { GameFooter } from '@/ui/components/Footer/GameFooter';
import { NavigationBar } from '@/ui/components/NavigationBar';
import { EventBus } from '@/lib/eventing/EventBus';
import { ShowScreenEvent } from '@/lib/eventing/events/lobby';
import { GAMES } from './games';
import './HomePage.css';

export type { GameInfo } from './games';

interface HomeProps {
  user: UserProfile | null;
  onLogout: () => void;
  onLogoutClick?: () => void;
}

export function Home({ user, onLogout, onLogoutClick }: HomeProps) {
  // Disable scrolling on html and body when Home component is mounted
  useEffect(() => {
    document.documentElement.classList.add('home-page-active');
    document.body.classList.add('home-page-active');
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.documentElement.classList.remove('home-page-active');
      document.body.classList.remove('home-page-active');
    };
  }, []);

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
    onLogout();
  };

  const handleSettingsClick = () => {
    EventBus.instance.publish(new ShowScreenEvent('settings'));
  };

  const handleLearnMore = (gameId: number) => {
    // Navigate to specific game detail page
    const gameScreenMap: Record<number, string> = {
      0: 'claim',           // CLAIM
      3: 'threecardbrag',   // ThreeCard Brag (featured)
      1: 'threecardbrag',   // Three Card Brag (coming soon)
      2: 'poker',           // Poker
    };
    
    const screen = gameScreenMap[gameId];
    if (screen) {
      // Update URL without page reload
      if (window.history && window.history.pushState) {
        window.history.pushState({ screen }, '', `/${screen}`);
      }
      EventBus.instance.publish(new ShowScreenEvent(screen));
    }
  };

  const handlePlayGame = (gameId: number, gameName: string) => {
    console.log(`Launching game: ${gameName} (ID: ${gameId})`);
    // Navigate to specific game page
    const gameScreenMap: Record<number, string> = {
      0: 'claim',           // CLAIM
      1: 'threecardbrag',   // Three Card Brag
      2: 'poker',           // Poker
    };
    
    const screen = gameScreenMap[gameId];
    if (screen) {
      // Update URL without page reload
      if (window.history && window.history.pushState) {
        window.history.pushState({ screen }, '', `/${screen}`);
      }
      EventBus.instance.publish(new ShowScreenEvent(screen));
    } else {
      // Show coming soon message for other games
      alert(`${gameName} is coming soon!`);
    }
  };

  // Featured games (all enabled games that are not coming soon)
  const featuredGames = GAMES.filter(game => game.enabled && !game.comingSoon);

  // All games for the tabbed carousel (both coming soon and available now)
  const allGames = GAMES.filter(game => game.enabled);

  // Navigation bar items
  const navItems = [
    { name: 'Home', onClick: () => console.log('Home clicked') },
    { name: 'Games', onClick: () => console.log('Games clicked') },
    { name: 'Tournaments', onClick: () => console.log('Tournaments clicked') },
    { name: 'Leaderboard', onClick: () => console.log('Leaderboard clicked') },
    { name: 'Profile', onClick: () => console.log('Profile clicked') },
    { name: 'Settings', onClick: handleSettingsClick },
  ];

  return (
    <div className="home-page">
      <GameHeader user={user} onLogout={handleLogout} showProfile={true} variant="welcome" />
      
      {/* Navigation Bar - positioned below header */}
      <div className="nav-bar-container">
        <NavigationBar 
          items={navItems} 
          height={40}
          showArrows={true}
          variant="default"
        />
      </div>

      {/* Scrollable Content Container - fixed between nav bar and footer */}
      <div className="scrollable-content-container">
        {/* Main content */}
        <div className="home-content">
        {/* About Us Section */}
        <section className="about-us-section">
          <AboutUsSection />
        </section>

        {/* Featured Game Carousel */}
        {featuredGames.length > 0 && (
          <section className="featured-section">
            <FeaturedGameCarousel 
              games={featuredGames}
              onLearnMore={handleLearnMore}
            />
          </section>
        )}

        {/* Coming Soon / Available Now Tabbed Carousel */}
        {allGames.length > 0 && (
          <section className="games-section">
            <ComingSoonCarousel
              games={allGames}
              onGameClick={handlePlayGame}
            />
          </section>
        )}

        {/* Spacer div to maintain consistent spacing */}
        <div className="content-spacer" />
        </div>
      </div>

      <GameFooter />
    </div>
  );
}

