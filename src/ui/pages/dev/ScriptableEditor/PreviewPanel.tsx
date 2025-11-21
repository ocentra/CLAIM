import React from 'react';
import './PreviewPanel.css';
import { AssetPathResolver } from '@/lib/assets/AssetPathResolver';

interface AssetData {
  __schemaVersion?: number;
  __assetType?: string;
  __assetId?: string;
  metadata?: {
    assetId?: string;
    assetType?: string;
    [key: string]: unknown;
  };
  texturePath?: string;
  [key: string]: unknown;
}

interface PreviewPanelProps {
  assetPath: string | null;
  assetData: AssetData | null;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * PreviewPanel - Center panel for preview
 * Shows card preview if asset is a Card, otherwise shows JSON preview
 */
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  assetPath,
  assetData,
  isLoading = false,
  error = null,
}) => {
  // Show error state
  if (error) {
    return (
      <div className="preview-panel preview-panel--empty">
        <div className="preview-panel__placeholder">
          <p className="preview-panel__error">Error loading asset</p>
          <p className="preview-panel__placeholder-subtitle preview-panel__error-message">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="preview-panel preview-panel--empty">
        <div className="preview-panel__placeholder">
          <div className="preview-panel__loading">
            <div className="preview-panel__spinner"></div>
          </div>
          <p className="preview-panel__placeholder-subtitle">Loading asset...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no asset selected
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
 * Shows only the visual representation of the card
 */
const CardPreview: React.FC<{ assetData: AssetData }> = ({ assetData }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Resolve image path using AssetPathResolver
  const cardId = (typeof assetData.id === 'string' ? assetData.id : '') || 
                 (typeof assetData.__assetId === 'string' ? assetData.__assetId : '') || '';
  const resolver = AssetPathResolver.getInstance();
  
  let imagePath = '';
  let defaultPath = '';
  
  // Calculate default path from card ID
  try {
    if (cardId) {
      defaultPath = resolver.resolveCardImagePath(cardId);
    }
  } catch (error) {
    // Card ID might not be valid format yet
    console.warn('[CardPreview] Could not calculate default path:', error);
  }
  
  // Get texturePath if explicitly set
  const texturePath = typeof assetData.texturePath === 'string' ? assetData.texturePath : '';
  
  // Priority: 
  // 1. Use defaultPath if texturePath is empty or matches default (auto-calculated)
  // 2. Use texturePath if it's explicitly set and different from default (user override)
  if (defaultPath && (!texturePath || texturePath === defaultPath)) {
    imagePath = defaultPath;
  } else if (texturePath) {
    imagePath = texturePath;
  } else if (defaultPath) {
    imagePath = defaultPath;
  }

  // Reset image error state when path changes
  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imagePath]);

  return (
    <div className="card-preview">
      <div className="card-preview__card">
        {imagePath && !imageError ? (
          <img
            src={imagePath}
            alt="Card"
            className={`card-preview__image ${imageLoaded ? 'card-preview__image--visible' : 'card-preview__image--hidden'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
        ) : null}
        {(!imagePath || imageError) && (
          <div className="card-preview__placeholder">
            <div className="card-preview__placeholder-icon">🃏</div>
            <div className="card-preview__placeholder-text">No Image</div>
          </div>
        )}
        {imagePath && !imageLoaded && !imageError && (
          <div className="card-preview__loading">Loading...</div>
        )}
      </div>
    </div>
  );
};

