import { useState } from 'react';
import type { GameInfo } from '@/ui/pages/Home/games';
import './GameCard.css';

interface GameCardProps {
  game: GameInfo;
  onPlay: () => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={`game-card ${game.comingSoon ? 'coming-soon' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Image/Placeholder */}
      <div className="game-card-image">
        <div className="game-card-image-placeholder">
          <span className="game-card-icon">
            {game.tags?.includes('Card Game') ? '🃏' : game.tags?.includes('Word Game') ? '📝' : '🎮'}
          </span>
        </div>
        {game.comingSoon && (
          <div className="coming-soon-badge">COMING SOON</div>
        )}
        {!game.comingSoon && (
          <div className="play-overlay">
            <button 
              className="play-button" 
              onClick={onPlay}
              aria-label={`Play ${game.name}`}
              type="button"
            >
              PLAY NOW
            </button>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="game-card-info">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-description">{game.description || 'Experience this exciting game.'}</p>
        <div className="game-card-tags">
          {game.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} className="game-tag">{tag}</span>
          ))}
        </div>
        <div className="game-card-meta">
          <span className="players-info">
            {game.minPlayers}-{game.maxPlayers} Players
          </span>
        </div>
      </div>
    </article>
  );
}

