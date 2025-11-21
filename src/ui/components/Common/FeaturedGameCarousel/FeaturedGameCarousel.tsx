import React, { useState, useEffect, useCallback } from 'react';
import type { GameInfo } from '@/ui/pages/Home/games';
import claimImage0 from '@assets/Claim/Claim0.png';
import claimImage1 from '@assets/Claim/Claim1.png';
import claimImage2 from '@assets/Claim/Claim2.png';
import claimImage3 from '@assets/Claim/Claim3.png';
import claimImage4 from '@assets/Claim/Claim4.png';
import claimImage5 from '@assets/Claim/Claim5.png';
import claimImage6 from '@assets/Claim/Claim6.png';
import claimTextImage from '@assets/Claim/ClaimText.png';
import threeCardImage0 from '@assets/ThreeCardBrag/Threecards0.png';
import threeCardImage1 from '@assets/ThreeCardBrag/Threecards1.png';
import threeCardImage2 from '@assets/ThreeCardBrag/Threecards2.png';
import threeCardImage4 from '@assets/ThreeCardBrag/Threecards4.png';
import threeCardImage5 from '@assets/ThreeCardBrag/Threecards5.png';
import threeCardImage6 from '@assets/ThreeCardBrag/Threecards6.png';
import { GameBadgesOverlay } from '../GameBadgesOverlay';
import './FeaturedGameCarousel.css';

interface FeaturedGameCarouselProps {
  games: GameInfo[];
  onLearnMore?: (gameId: number) => void; // Navigate to game detail page
}

// Array of claim images for dissolve animation in sequence
const claimImages = [claimImage0, claimImage1, claimImage2, claimImage3, claimImage4, claimImage5, claimImage6];

// Array of ThreeCardBrag images for dissolve animation in sequence
const threeCardImages = [threeCardImage0, threeCardImage1, threeCardImage2, threeCardImage4, threeCardImage5, threeCardImage6];

// Get images based on current game
const getCurrentGameImages = (gameName: string) => {
  if (gameName === 'ThreeCard Brag') {
    return threeCardImages;
  }
  return claimImages;
};

export function FeaturedGameCarousel({ games, onLearnMore }: FeaturedGameCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Use games array directly
  const slides = games;

  const currentGame = slides[currentSlide];

  // Reset image index when game changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentSlide]);

  // Core slide transition function
  const goToSlide = useCallback((newSlide: number, dir: 'left' | 'right') => {
    if (isTransitioning || newSlide === currentSlide) return;

    setDirection(dir);
    setPrevSlide(currentSlide);
    setIsTransitioning(true);
    setCurrentSlide(newSlide);

    // After animation completes, reset transitioning state
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, currentSlide]);

  // Auto-rotate images with dissolve effect - variable speeds
  // Auto-advance to next game when image sequence completes
  useEffect(() => {
    const currentGameImages = getCurrentGameImages(currentGame.name);
    const maxIndex = currentGameImages.length - 1;

    // Determine interval duration based on current image
    let intervalDuration: number;

    if (currentGame.name === 'ThreeCard Brag') {
      // ThreeCardBrag: 6 images (0, 1, 2, 4, 5, 6)
      if (currentImageIndex === maxIndex) {
        // Last image (6): hold longer (6 seconds)
        intervalDuration = 6000;
      } else if (currentImageIndex >= 2) {
        // Images 2, 4, 5: faster transitions (2 seconds)
        intervalDuration = 2000;
      } else {
        // Images 0, 1: normal speed (3 seconds)
        intervalDuration = 3000;
      }
    } else {
      // CLAIM: 7 images (0-6)
      if (currentImageIndex === 6) {
        // Image 6: hold longer (6 seconds)
        intervalDuration = 6000;
      } else if (currentImageIndex >= 4) {
        // Images 4, 5: faster transitions (2 seconds)
        intervalDuration = 2000;
      } else {
        // Images 0, 1, 2, 3: normal speed (3 seconds)
        intervalDuration = 3000;
      }
    }

    const interval = setInterval(() => {
      const nextImageIndex = (currentImageIndex + 1) % currentGameImages.length;
      setCurrentImageIndex(nextImageIndex);

      // Auto-advance to next game when we loop back to first image
      if (nextImageIndex === 0 && slides.length > 1) {
        // Small delay to let the last image be visible before transitioning
        setTimeout(() => {
          goToSlide((currentSlide + 1) % slides.length, 'right');
        }, 500);
      }
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [currentImageIndex, currentGame.name, currentSlide, slides.length, goToSlide]);

  const handlePrev = () => {
    const newSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    goToSlide(newSlide, 'left');
  };

  const handleNext = () => {
    const newSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    goToSlide(newSlide, 'right');
  };

  const handleIndicatorClick = (index: number) => {
    const dir = index > currentSlide ? 'right' : 'left';
    goToSlide(index, dir);
  };

  return (
    <div className="featured-carousel">
      {/* Navigation Buttons - outside container */}
      {slides.length > 1 && (
        <>
          <button
            className="carousel-nav-button carousel-nav-prev"
            onClick={handlePrev}
            aria-label="Previous game"
          >
            ◀
          </button>
          <button
            className="carousel-nav-button carousel-nav-next"
            onClick={handleNext}
            aria-label="Next game"
          >
            ▶
          </button>
        </>
      )}

      <div className="carousel-container">
        {/* Section Title */}
        <h2 className="carousel-section-title">
          <span className="section-title-word"><span className="section-title-first-letter">F</span>EATURED</span>
          {' '}&{' '}
          <span className="section-title-word"><span className="section-title-first-letter">R</span>ECOMMENDED</span>
        </h2>

        {/* Featured Game Display */}
        <div className="featured-game-display-wrapper">
          {slides.map((game, slideIndex) => {
            const isActive = slideIndex === currentSlide;
            const wasActive = slideIndex === prevSlide;
            const isEntering = isTransitioning && isActive;
            const isExiting = isTransitioning && wasActive && !isActive;

            return (
              <div
                key={game.gameId}
                className={`featured-game-display ${isActive ? 'active' : ''} ${isExiting ? `exiting-${direction}` : ''} ${isEntering ? `entering-${direction}` : ''}`}
              >
                {/* Left Section - Image with badges */}
                <div className="featured-game-left">
                  <div className="featured-game-image">
                  {/* Dissolve animation images - use appropriate images based on game */}
                  {(() => {
                    const gameImages = getCurrentGameImages(game.name);
                    const maxIndex = gameImages.length - 1;
                    
                    return gameImages.map((img, displayIndex) => {
                      // Check if we're transitioning from last to first (or vice versa) for slow transition
                      const isTransitioningFromLastToFirst = currentImageIndex === 0 && displayIndex === maxIndex;
                      const isTransitioningFromLastToFirstReverse = currentImageIndex === maxIndex && displayIndex === 0;
                      const isSlowTransition = isTransitioningFromLastToFirst || isTransitioningFromLastToFirstReverse;
                      
                      return (
                        <img 
                          key={`${game.gameId}-${displayIndex}`}
                          src={img} 
                          alt={game.name}
                          className={`featured-game-banner ${displayIndex === currentImageIndex ? 'active' : ''} ${isSlowTransition ? 'slow-transition' : ''}`}
                        />
                      );
                    });
                  })()}
                  
                  {/* Game Tags overlay at top-right */}
                  <div className="featured-tags-overlay">
                    {game.tags?.map((tag, index) => {
                      // Insert "Single player" before "Multiplayer"
                      if (tag === 'Multiplayer') {
                        return (
                          <React.Fragment key={index}>
                            <span className="featured-tag-overlay">Single player</span>
                            <span className="featured-tag-overlay">{tag}</span>
                          </React.Fragment>
                        );
                      }
                      return <span key={index} className="featured-tag-overlay">{tag}</span>;
                    })}
                    <span className="featured-tag-overlay">Players Vs AI</span>
                    <span className="featured-tag-overlay">AI Vs AI</span>
                  </div>

                  {/* Badges overlay at bottom-left */}
                  <GameBadgesOverlay
                    availableNow={!game.comingSoon}
                    freeToPlay={!game.comingSoon}
                    solanaVerified={true}
                    aiBenchmark={true}
                    leaderboard={true}
                  />
                  </div>
                </div>

                {/* Right Section - Details */}
                <div className="featured-game-right">
                  <div className="featured-game-details">
                    <div className="featured-game-content">
                      <div className="featured-game-header">
                        {game.name === 'CLAIM' ? (
                          <>
                            <img 
                              src={claimTextImage} 
                              alt="CLAIM" 
                              className="featured-claim-text-image"
                            />
                            <h2 className="featured-game-subtitle">_Simple Rules. Deadly Game._</h2>
                            <h4 className="featured-game-tagline">Declare your suit. Build your hand. Or face the Reckoning of CLAIM.</h4>
                          </>
                        ) : (
                          <>
                            <h2 className="featured-game-title">{game.name}</h2>
                            <h2 className="featured-game-subtitle">_Fast-Paced Card Action_</h2>
                            <h4 className="featured-game-tagline">Experience the thrill of {game.name}.</h4>
                          </>
                        )}
                      </div>

                      <p className="featured-game-description">
                        {game.description || 'Experience this exciting multiplayer game.'}
                      </p>

                      {/* Key Features */}
                      <div className="featured-features">
                        <div className="feature-item">
                          <span className="feature-text">
                            Money Matches
                            <span className="badge badge-coming-soon">Coming Soon</span>
                          </span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-text">
                            Tournaments
                            <span className="badge badge-coming-soon">Coming Soon</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicators and Learn More Button */}
        <div className="carousel-bottom-controls">
          {slides.length > 1 && (
            <div className="carousel-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => handleIndicatorClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          {onLearnMore && (
            <button className="featured-learn-more-button" onClick={() => onLearnMore(currentGame.gameId)}>
              Learn More →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

