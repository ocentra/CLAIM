import React from 'react';
import './GameFooter.css';

export const GameFooter: React.FC = () => {
  return (
    <footer className="game-footer">
      <div className="footer-content">
        <span className="footer-text">
          Made with <span className="heart">❤️</span> by{' '}
          <a 
            href="https://ocentra.ca" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            ocentra.ca
          </a>
        </span>
      </div>
    </footer>
  );
};

