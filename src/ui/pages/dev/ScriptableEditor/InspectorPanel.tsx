import React, { useState, useEffect, useRef } from 'react';
import './InspectorPanel.css';
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
  [key: string]: unknown;
}

interface InspectorPanelProps {
  assetPath: string | null;
  assetData: AssetData | null;
  isLoading?: boolean;
  error?: string | null;
  onAssetUpdate: (updatedData: AssetData) => void;
}

/**
 * InspectorPanel - Right panel for editing asset properties
 * Shows editable fields based on asset type
 */
export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  assetPath,
  assetData,
  isLoading = false,
  error = null,
  onAssetUpdate,
}) => {
  const [editedData, setEditedData] = useState<AssetData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (assetData) {
      setEditedData(JSON.parse(JSON.stringify(assetData))); // Deep clone
      setHasChanges(false);
    } else {
      setEditedData(null);
      setHasChanges(false);
    }
  }, [assetData]);

  // Show error state
  if (error) {
    return (
      <div className="inspector-panel inspector-panel--empty">
        <div className="inspector-panel__placeholder">
          <p className="inspector-panel__error">Error loading asset</p>
          <p className="inspector-panel__placeholder-subtitle inspector-panel__error-message">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="inspector-panel inspector-panel--empty">
        <div className="inspector-panel__placeholder">
          <div className="inspector-panel__loading">
            <div className="inspector-panel__spinner"></div>
          </div>
          <p className="inspector-panel__placeholder-subtitle">Loading asset...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no asset selected
  if (!assetPath || !assetData || !editedData) {
    return (
      <div className="inspector-panel inspector-panel--empty">
        <div className="inspector-panel__placeholder">
          <p>No asset selected</p>
          <p className="inspector-panel__placeholder-subtitle">
            Select an asset to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  const assetType = editedData.__assetType || editedData.metadata?.assetType || 'Unknown';
  const assetId = editedData.__assetId || editedData.metadata?.assetId || 'N/A';

  const handleFieldChange = (field: string, value: unknown) => {
    const updated = { ...editedData };
    
    // Handle nested paths (e.g., "metadata.gameId")
    const keys = field.split('.');
    let target: Record<string, unknown> = updated as Record<string, unknown>;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {};
      }
      target = target[keys[i]] as Record<string, unknown>;
    }
    
    target[keys[keys.length - 1]] = value;
    setEditedData(updated);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!assetPath || !editedData) return;

    try {
      // Save via generic asset save API
      const response = await fetch('/__dev/api/save-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetPath,
          asset: editedData,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to save asset: ${error.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('[InspectorPanel] Asset saved:', result.path);
      
      // Update local state and notify parent
      setHasChanges(false);
      onAssetUpdate(editedData);
    } catch (error) {
      console.error('[InspectorPanel] Failed to save asset:', error);
      alert(`Failed to save asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReset = () => {
    setEditedData(JSON.parse(JSON.stringify(assetData)));
    setHasChanges(false);
  };

  return (
    <div className="inspector-panel">
      <div className="inspector-panel__header">
        <h3>Inspector</h3>
        {hasChanges && (
          <div className="inspector-panel__header-actions">
            <button
              className="inspector-panel__button inspector-panel__button--save"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="inspector-panel__button inspector-panel__button--reset"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        )}
      </div>
      <div className="inspector-panel__content">
        {/* Asset Metadata */}
        <div className="inspector-panel__section">
          <div className="inspector-panel__section-header">Asset Info</div>
          <Field label="Type" value={assetType} readOnly />
          <Field label="ID" value={assetId} readOnly />
          <Field
            label="Path"
            value={assetPath}
            readOnly
          />
        </div>

        {/* Dynamic Fields based on asset type */}
        {assetType === 'Card' && (
          <CardInspector
            data={editedData}
            onFieldChange={handleFieldChange}
          />
        )}

        {/* Generic JSON Editor for unknown types */}
        {assetType !== 'Card' && (
          <div className="inspector-panel__section">
            <div className="inspector-panel__section-header">Properties</div>
            <GenericInspector
              data={editedData}
              onFieldChange={handleFieldChange}
              excludeKeys={['__schemaVersion', '__assetType', '__assetId', 'metadata']}
            />
          </div>
        )}

        {/* Raw JSON View (collapsible) */}
        <div className="inspector-panel__section">
          <details className="inspector-panel__details">
            <summary className="inspector-panel__details-summary">Raw JSON</summary>
            <pre className="inspector-panel__json">
              {JSON.stringify(editedData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

/**
 * Field - Generic input field component
 */
const Field: React.FC<{
  label: string;
  value: unknown;
  onChange?: (value: unknown) => void;
  readOnly?: boolean;
  type?: string;
  id?: string;
}> = ({ label, value, onChange, readOnly = false, type = 'text', id }) => {
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="inspector-panel__field">
      <label htmlFor={inputId} className="inspector-panel__field-label">{label}</label>
      {readOnly ? (
        <div className="inspector-panel__field-value-readonly" id={inputId}>{String(value)}</div>
      ) : (
        <input
          id={inputId}
          className="inspector-panel__field-input"
          type={type}
          value={String(value ?? '')}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
};

/**
 * CardInspector - Specialized inspector for Card assets
 */
const CardInspector: React.FC<{
  data: AssetData;
  onFieldChange: (field: string, value: unknown) => void;
}> = ({ data, onFieldChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate default image path from card ID
  const cardId = typeof data.id === 'string' ? data.id : '';
  const resolver = AssetPathResolver.getInstance();
  let defaultImagePath = '';
  try {
    if (cardId) {
      defaultImagePath = resolver.resolveCardImagePath(cardId);
    }
  } catch (error) {
    // Card ID might not be valid format yet
    console.warn('[CardInspector] Could not calculate default path:', error);
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect(file);
      }
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      // Read file as base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      
      // Determine target filename - try to use default path filename if it exists
      let fileName = file.name;
      if (defaultImagePath) {
        // Extract filename from default path (e.g., "/Resources/Cards/Images/2_of_spades.png" -> "2_of_spades.png")
        const match = defaultImagePath.match(/\/([^/]+\.(png|jpg|jpeg|gif|webp))$/i);
        if (match) {
          fileName = match[1];
        }
      }
      
      // Upload to server
      const response = await fetch('/__dev/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileData,
          targetPath: '/Resources/Cards/Images',
        }),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to upload image: ${error.message || response.statusText}`);
      }
      
      const result = await response.json();
      if (result.status === 'ok' && result.path) {
        // Update texturePath with saved path
        onFieldChange('texturePath', result.path);
        console.log('[CardInspector] Image uploaded:', result.path);
      } else {
        throw new Error('Upload failed: Invalid response');
      }
    } catch (error) {
      console.error('[CardInspector] Failed to upload image:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Fall back to object URL for preview (but won't persist)
      const objectUrl = URL.createObjectURL(file);
      onFieldChange('texturePath', objectUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="inspector-panel__section">
      <div className="inspector-panel__section-header">Card Properties</div>
      <Field
        label="ID"
        value={data.id || ''}
        onChange={(v) => onFieldChange('id', v)}
      />
      <Field
        label="Rank"
        value={data.rank || ''}
        onChange={(v) => onFieldChange('rank', isNaN(Number(v)) ? v : Number(v))}
      />
      <Field
        label="Rank Symbol"
        value={data.rankSymbol || ''}
        onChange={(v) => onFieldChange('rankSymbol', v)}
      />
      <Field
        label="Suit"
        value={data.suit || ''}
        onChange={(v) => onFieldChange('suit', v)}
      />
      
      {/* Image Path with Drag & Drop */}
      <div className="inspector-panel__field">
        <label htmlFor="texture-path-input" className="inspector-panel__field-label">
          Image Path
          {defaultImagePath && (
            <span className="inspector-panel__field-hint" title="Calculated default path based on card ID">
              (Default: {defaultImagePath.split('/').pop()})
            </span>
          )}
        </label>
        <div
          className={`inspector-panel__file-drop-zone ${isDragging ? 'inspector-panel__file-drop-zone--dragging' : ''} ${isUploading ? 'inspector-panel__file-drop-zone--uploading' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="inspector-panel__file-input-hidden"
            onChange={handleFileInputChange}
            aria-label="Select image file"
            disabled={isUploading}
          />
          <input
            id="texture-path-input"
            className="inspector-panel__field-input"
            type="text"
            value={typeof data.texturePath === 'string' ? data.texturePath : ''}
            onChange={(e) => onFieldChange('texturePath', e.target.value)}
            placeholder={defaultImagePath || "Drag image here or click browse..."}
            disabled={isUploading}
          />
          <button
            type="button"
            className="inspector-panel__browse-button"
            onClick={handleBrowseClick}
            title="Browse for image file"
            disabled={isUploading}
          >
            {isUploading ? '⏳' : '📁'} {isUploading ? 'Uploading...' : 'Browse'}
          </button>
        </div>
        {isDragging && (
          <div className="inspector-panel__drop-overlay">
            Drop image here
          </div>
        )}
        {defaultImagePath && (
          <div className="inspector-panel__field-help">
            💡 Default path calculated from card ID. Leave empty to use default, or set custom path to override.
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * GenericInspector - Recursive inspector for any object
 */
const GenericInspector: React.FC<{
  data: unknown;
  onFieldChange: (field: string, value: unknown) => void;
  excludeKeys?: string[];
  prefix?: string;
}> = ({ data, onFieldChange, excludeKeys = [], prefix = '' }) => {
  if (data === null || data === undefined) {
    return <div className="inspector-panel__field-value-readonly">null</div>;
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    return (
      <Field
        label={prefix || 'Value'}
        value={JSON.stringify(data)}
        onChange={(v) => {
          try {
            const parsed = JSON.parse(String(v));
            onFieldChange(prefix, parsed);
          } catch {
            onFieldChange(prefix, String(v));
          }
        }}
      />
    );
  }

  return (
    <>
      {Object.entries(data).map(([key, value]) => {
        if (excludeKeys.includes(key)) return null;

        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return (
            <div key={key} className="inspector-panel__nested-section">
              <div className="inspector-panel__section-header">{key}</div>
              <GenericInspector
                data={value}
                onFieldChange={onFieldChange}
                excludeKeys={excludeKeys}
                prefix={fieldPath}
              />
            </div>
          );
        }

        return (
          <Field
            key={key}
            label={key}
            value={
              typeof value === 'string' || typeof value === 'number'
                ? String(value)
                : JSON.stringify(value)
            }
            onChange={(v) => {
              if (typeof value === 'number') {
                const num = Number(v);
                onFieldChange(fieldPath, isNaN(num) ? v : num);
              } else {
                onFieldChange(fieldPath, v);
              }
            }}
          />
        );
      })}
    </>
  );
};

