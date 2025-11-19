import solanaImage from '@assets/solana.png';
import './GameBadgesOverlay.css';

export interface GameBadgesOverlayProps {
  availableNow?: boolean;
  freeToPlay?: boolean;
  solanaVerified?: boolean;
  aiBenchmark?: boolean;
  leaderboard?: boolean;
  className?: string;
}

export function GameBadgesOverlay({
  availableNow = false,
  freeToPlay = false,
  solanaVerified = true,
  aiBenchmark = true,
  leaderboard = true,
  className = '',
}: GameBadgesOverlayProps) {
  return (
    <div className={`game-badges-overlay ${className}`}>
      <div className="badges-container">
        {availableNow && (
          <span className="badge badge-primary">AVAILABLE NOW</span>
        )}
        {freeToPlay && (
          <span className="badge badge-secondary">FREE TO PLAY</span>
        )}
        {solanaVerified && (
          <span className="badge badge-blockchain">
            <img src={solanaImage} alt="Solana" className="badge-solana-logo" />
            <span>SOLANA VERIFIED</span>
          </span>
        )}
        {aiBenchmark && (
          <span className="badge badge-ai">AI Benchmark</span>
        )}
        {leaderboard && (
          <span className="badge badge-leaderboard">Leaderboard</span>
        )}
      </div>
    </div>
  );
}

