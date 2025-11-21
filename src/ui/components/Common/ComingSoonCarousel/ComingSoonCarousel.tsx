import { useState, useEffect, useRef } from 'react';
import type { GameInfo } from '@/ui/pages/Home/games';
import claimImage0 from '@assets/Claim/Claim0.png';
import threeCardImage0 from '@assets/ThreeCardBrag/Threecards0.png';
import bridgeImage from '@assets/Bridge/Bridge.png';
import pokerImage0 from '@assets/Poker/poker0.png';
import rummyImage0 from '@assets/Rummy/Rummy0.png';
import crosswordImage from '@assets/Crossword/riddletocross.png';
import wordSearchImage from '@assets/Wordsearch/wordsearch.png';
import scrabbleImage from '@assets/Scrabble/Scrabble.png';
import './ComingSoonCarousel.css';

type TabType = 'coming-soon' | 'available-now';

interface ComingSoonCarouselProps {
  games: GameInfo[];
  onGameClick: (gameId: number, gameName: string) => void;
}

// Get game image
const getGameImage = (gameName: string): string => {
  if (gameName === 'CLAIM') {
    return claimImage0;
  }
  if (gameName === 'ThreeCard Brag' || gameName === 'Three Card Brag') {
    return threeCardImage0;
  }
  if (gameName === 'Bridge') {
    return bridgeImage;
  }
  if (gameName === 'Poker') {
    return pokerImage0;
  }
  if (gameName === 'Rummy') {
    return rummyImage0;
  }
  if (gameName === 'Riddle 2 Crossword') {
    return crosswordImage;
  }
  if (gameName === 'Word Search') {
    return wordSearchImage;
  }
  if (gameName === 'Scrabble') {
    return scrabbleImage;
  }
  // Default placeholder - could add more game images later
  return '';
};

// Card component for the carousel
function GameTile({ game, onClick }: { game: GameInfo; onClick: () => void }) {
  const gameImage = getGameImage(game.name);

  return (
    <button
      className={`game-card-tile ${game.comingSoon ? 'coming-soon' : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className="card-image-container">
        {gameImage ? (
          <img src={gameImage} alt={game.name} className="card-image" />
        ) : (
          <div className="card-image-placeholder">
            {game.tags?.includes('Card Game') ? '🃏' : game.tags?.includes('Word Game') ? '📝' : '🎮'}
          </div>
        )}
        {game.comingSoon && (
          <span className="card-badge">COMING SOON</span>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{game.name}</h3>
        {game.tags && game.tags.length > 0 && (
          <div className="card-tags">
            {game.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="card-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

export function ComingSoonCarousel({ games, onGameClick }: ComingSoonCarouselProps) {
  const [activeTab, setActiveTab] = useState<TabType>('coming-soon');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter games based on active tab
  const comingSoonGames = games.filter(game => game.comingSoon);
  
  // Get names of coming soon games to exclude from available now
  const comingSoonGameNames = new Set(comingSoonGames.map(game => game.name.toLowerCase().trim()));
  
  // Filter available now games, excluding any that have the same name as coming soon games
  const availableNowGames = games.filter(game => 
    !game.comingSoon && !comingSoonGameNames.has(game.name.toLowerCase().trim())
  );

  const currentGames = activeTab === 'coming-soon' ? comingSoonGames : availableNowGames;
  
  // Check if scrolling is needed (assuming 5 tiles visible based on 20% width)
  const tilesVisible = 5;
  const needsScrolling = currentGames.length > tilesVisible;

  // Generate ping-pong sequence: [0, 1, 2, ..., n-1, n-2, ..., 1] and loop
  const generatePingPongSequence = (length: number): number[] => {
    if (length <= 1) return [0];
    const forward: number[] = [];
    for (let i = 0; i < length; i++) {
      forward.push(i);
    }
    const backward: number[] = [];
    for (let i = length - 2; i >= 1; i--) {
      backward.push(i);
    }
    return [...forward, ...backward];
  };

  const pingPongSequence = generatePingPongSequence(currentGames.length);

  // Reset index and sequence when tab changes
  useEffect(() => {
    setCurrentIndex(0);
    setSequenceIndex(0);
  }, [activeTab]);

  // Create duplicated array for infinite scroll (only if scrolling is needed)
  const getDisplayGames = () => {
    if (currentGames.length === 0) return [];
    // If no scrolling needed, just return the games once
    if (!needsScrolling) {
      return currentGames;
    }
    // Duplicate enough times for smooth infinite scroll
    const copies = Math.max(3, Math.ceil(12 / currentGames.length));
    return Array(copies).fill(currentGames).flat();
  };

  const displayGames = getDisplayGames();

  // Auto-advance carousel with ping-pong sequence - only if scrolling is needed
  useEffect(() => {
    if (!isAutoPlaying || currentGames.length === 0 || !needsScrolling) return;

    const interval = setInterval(() => {
      setSequenceIndex((prev) => {
        const next = prev + 1;
        // Loop back to start of sequence
        if (next >= pingPongSequence.length) {
          return 0;
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentGames.length, needsScrolling, pingPongSequence.length]);

  // Update currentIndex based on sequence
  useEffect(() => {
    if (pingPongSequence.length > 0) {
      setCurrentIndex(pingPongSequence[sequenceIndex]);
    }
  }, [sequenceIndex, pingPongSequence]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return currentGames.length - 1;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      if (prev >= currentGames.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsAutoPlaying(true);
  };

  if (games.length === 0) {
    return null;
  }

  // Calculate transform based on tile width percentage (only if scrolling is needed)
  const tileWidthPercent = 20; // Each tile takes 20% = 5 tiles visible
  const translateX = needsScrolling ? currentIndex * tileWidthPercent : 0;

  return (
    <div className="coming-soon-carousel">
      {/* Navigation Buttons - keep visible but disabled when no scrolling needed */}
      {currentGames.length > 0 && (
        <>
          <button
            className={`carousel-nav-button carousel-nav-prev ${!needsScrolling ? 'hidden' : ''}`}
            onClick={handlePrev}
            aria-label="Previous games"
            disabled={!needsScrolling}
          >
            ◀
          </button>
          <button
            className={`carousel-nav-button carousel-nav-next ${!needsScrolling ? 'hidden' : ''}`}
            onClick={handleNext}
            aria-label="Next games"
            disabled={!needsScrolling}
          >
            ▶
          </button>
        </>
      )}

      <div className="carousel-wrapper">
        {/* Tabs */}
        <div className="carousel-tabs">
          <button
            className={`carousel-tab ${activeTab === 'coming-soon' ? 'active' : ''}`}
            onClick={() => handleTabChange('coming-soon')}
          >
            <span className="tab-label">
              <span className="tab-first-letter">C</span>OMING{' '}
              <span className="tab-first-letter">S</span>OON
            </span>
            {comingSoonGames.length > 0 && (
              <span className="tab-count">({comingSoonGames.length})</span>
            )}
          </button>
          <button
            className={`carousel-tab ${activeTab === 'available-now' ? 'active' : ''}`}
            onClick={() => handleTabChange('available-now')}
          >
            <span className="tab-label">
              <span className="tab-first-letter">A</span>VAILABLE{' '}
              <span className="tab-first-letter">N</span>OW
            </span>
            {availableNowGames.length > 0 && (
              <span className="tab-count">({availableNowGames.length})</span>
            )}
          </button>
        </div>

        {/* Carousel Track */}
        <div className="carousel-track" ref={trackRef}>
          <div
            className="carousel-slide"
            style={{
              transform: `translateX(-${translateX}%)`,
            }}
          >
            {displayGames.map((game, index) => (
              <div key={`${game.gameId}-${index}`} className="tile-wrapper">
                <GameTile
                  game={game}
                  onClick={() => onGameClick(game.gameId, game.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
