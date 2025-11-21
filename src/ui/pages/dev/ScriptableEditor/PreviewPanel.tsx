import React from 'react';
import './PreviewPanel.css';

interface AssetData {
  __schemaVersion?: number;
  __assetType?: string;
  __assetId?: string;
  metadata?: {
    assetId?: string;
    assetType?: string;
    [key: string]: unknown;
  };
  rank?: number | string;
  rankSymbol?: string;
  suit?: string;
  texturePath?: string;
  path?: string;
  id?: string;
  [key: string]: unknown;
}

interface PreviewPanelProps {
  assetPath: string | null;
  assetData: AssetData | null;
}

/**
 * PreviewPanel - Center panel for preview
 * Shows card preview if asset is a Card, otherwise shows JSON preview
 */
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  assetPath,
  assetData,
}) => {
  if (!assetPath || !assetData) {
    return (
      <div className="preview-panel preview-panel--empty">
        <div className="preview-panel__placeholder">
          <p>No asset selected</p>
          <p className="preview-panel__placeholder-subtitle">
            Select an asset from the hierarchy to preview it
          </p>
        </div>
      </div>
    );
  }

  const assetType = assetData.__assetType || assetData.metadata?.assetType || 'Unknown';

  // Check if it's a Card asset
  if (assetType === 'Card') {
    return (
      <div className="preview-panel">
        <div className="preview-panel__header">
          <h3>Preview</h3>
        </div>
        <div className="preview-panel__content preview-panel__content--card">
          <CardPreview assetData={assetData} />
        </div>
      </div>
    );
  }

  // Default: JSON preview
  return (
    <div className="preview-panel">
      <div className="preview-panel__header">
        <h3>Preview (JSON)</h3>
      </div>
      <div className="preview-panel__content preview-panel__content--json">
        <pre className="preview-panel__json">
          {JSON.stringify(assetData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

/**
 * CardPreview - Visual card preview component
 */
const CardPreview: React.FC<{ assetData: AssetData }> = ({ assetData }) => {
  const rank = assetData.rank || assetData.rankSymbol || '?';
  const suit = assetData.suit || 'spades';
  const imagePath = assetData.texturePath || assetData.path || '';

  const suitSymbols: Record<string, string> = {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
  };

  const suitColor: Record<string, string> = {
    spades: '#000',
    hearts: '#d32f2f',
    diamonds: '#d32f2f',
    clubs: '#000',
  };

  const suitSymbol = suitSymbols[suit] || '';
  const color = suitColor[suit] || '#000';

  return (
    <div className="card-preview">
      <div className="card-preview__container">
        {/* Card Image Preview */}
        {imagePath && (
          <div className="card-preview__image-container">
            <img
              src={imagePath}
              alt={`${rank} of ${suit}`}
              className="card-preview__image"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Card Info */}
        <div className="card-preview__info">
          <div 
            className={`card-preview__rank ${
              color === '#d32f2f' ? 'card-preview__rank--red' : 'card-preview__rank--black'
            }`}
          >
            {rank}
          </div>
          <div 
            className={`card-preview__suit ${
              color === '#d32f2f' ? 'card-preview__suit--red' : 'card-preview__suit--black'
            }`}
          >
            {suitSymbol}
          </div>
          <div className="card-preview__name">
            {typeof rank === 'number' ? rank : rank.charAt(0).toUpperCase() + rank.slice(1)} of{' '}
            {suit.charAt(0).toUpperCase() + suit.slice(1)}
          </div>
          <div className="card-preview__id">
            ID: {assetData.id || assetData.__assetId || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

