import { useState, useEffect, useCallback } from 'react';
import { AboutUsCard } from './AboutUsCard';
import './AboutUsSection.css';

interface FeatureCard {
  title: string;
  description: string;
  icon?: string;
}

const FEATURES: FeatureCard[] = [
  {
    title: 'AI Benchmarking',
    description: 'Reproducible AI benchmarks with verifiable model performance tracking. Compare AI models head-to-head with complete transparency and trust.',
    icon: '🎯',
  },
  {
    title: '1 vs 1 AI Training',
    description: 'Master your skills through focused training sessions against intelligent AI opponents. Learn strategies, refine tactics, and become an expert.',
    icon: '🎓',
  },
  {
    title: 'Track Your Progress',
    description: 'Watch your skills evolve with comprehensive analytics. Detailed statistics, performance trends, and personalized insights guide your journey.',
    icon: '📈',
  },
  {
    title: 'Global Leaderboards',
    description: 'Compete with players worldwide. On-chain leaderboard snapshots ensure fair rankings you can trust and verify.',
    icon: '🏆',
  },
  {
    title: 'Everything On-Chain',
    description: 'Complete transparency through Solana blockchain. Every match, score, and achievement is permanently recorded and verifiable.',
    icon: '⛓️',
  },
  {
    title: 'Play Your Way',
    description: 'Choose your experience - play completely free or enter money matches. Same great games, your choice of stakes.',
    icon: '💎',
  },
  {
    title: 'Solana Powered',
    description: 'Built on Solana for speed and efficiency. Verifiable match records with Merkle batching keep costs low and trust high.',
    icon: '🔗',
  },
  {
    title: 'True Multiplayer',
    description: 'Robust multiplayer framework supporting turn-based games. Seamless matchmaking, lifecycle management, and dynamic player capacity.',
    icon: '👥',
  },
  {
    title: 'Wallet Freedom',
    description: 'Connect with Solana or Ethereum wallets. Optional self-custody gives you full control, or use our custodial solution.',
    icon: '💼',
  },
  {
    title: 'Intelligent AI',
    description: 'Face off against AI opponents powered by advanced machine learning. Each AI has unique strategies and personalities.',
    icon: '🤖',
  },
  {
    title: 'Rewarding Economy',
    description: 'Earn Game Payment (GP) and AI Credit (AC) tokens. Daily rewards, subscriptions, and achievements fuel your progression.',
    icon: '💰',
  },
  {
    title: 'Provably Fair',
    description: 'Every match is verifiable. On-chain anchors combined with off-chain storage provide complete transparency and trust.',
    icon: '🔒',
  },
  {
    title: 'Fair Play Guaranteed',
    description: 'On-chain dispute resolution ensures integrity. Automated systems and transparent processes protect every player.',
    icon: '⚖️',
  },
  {
    title: 'Play Anywhere',
    description: 'Seamless experience across Web, iOS, and Android. Your progress syncs everywhere, play on any device.',
    icon: '📱',
  },
];

export function AboutUsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const slides = FEATURES;

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

  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      if (slides.length > 1) {
        const nextSlide = (currentSlide + 1) % slides.length;
        goToSlide(nextSlide, 'right');
      }
    }, 4000); // Change feature every 4 seconds

    return () => clearInterval(interval);
  }, [currentSlide, slides.length, goToSlide]);

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
    <div className="about-us-carousel featured-carousel">
      {/* Navigation Buttons - hidden but kept for layout */}
      {slides.length > 1 && (
        <>
          <button
            className="carousel-nav-button carousel-nav-prev carousel-nav-button-hidden"
            onClick={handlePrev}
            aria-label="Previous feature"
            aria-hidden="true"
            tabIndex={-1}
          >
            ◀
          </button>
          <button
            className="carousel-nav-button carousel-nav-next carousel-nav-button-hidden"
            onClick={handleNext}
            aria-label="Next feature"
            aria-hidden="true"
            tabIndex={-1}
          >
            ▶
          </button>
        </>
      )}

      <div className="carousel-container">
        {/* Feature Display */}
        <div className="featured-game-display-wrapper">
          {slides.map((feature, slideIndex) => {
            const isActive = slideIndex === currentSlide;
            const wasActive = slideIndex === prevSlide;
            const isEntering = isTransitioning && isActive;
            const isExiting = isTransitioning && wasActive && !isActive;

            return (
              <div
                key={slideIndex}
                className={`featured-game-display ${isActive ? 'active' : ''} ${isExiting ? `exiting-${direction}` : ''} ${isEntering ? `entering-${direction}` : ''}`}
              >
                {/* Right Section - Feature Details */}
                <div className="featured-game-right">
                  <div className="featured-game-details">
                    <AboutUsCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Indicators */}
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
        </div>
      </div>
    </div>
  );
}
