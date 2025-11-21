import React, { useState, useEffect } from 'react';
import { GameHeader } from '@/ui/components/Header/GameHeader';
import { useAuth } from '@providers';
import './ScriptableEditorPage.css';
import { ResourceTree } from './ScriptableEditor/ResourceTree';
import { PreviewPanel } from './ScriptableEditor/PreviewPanel';
import { InspectorPanel } from './ScriptableEditor/InspectorPanel';

/**
 * ScriptableEditorPage
 * 
 * 3-panel Unity-like asset editor:
 * - Left: Resource hierarchy tree (shows only .asset files)
 * - Center: Preview panel (card preview or JSON)
 * - Right: Inspector panel (editable properties)
 */
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

export const ScriptableEditorPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [assetPath, setAssetPath] = useState<string | null>(null);

  // Load asset when selected
  useEffect(() => {
    if (selectedAsset) {
      loadAsset(selectedAsset);
    } else {
      setAssetData(null);
      setAssetPath(null);
    }
  }, [selectedAsset]);

  const loadAsset = async (path: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load asset: ${response.statusText}`);
      }
      const data = await response.json();
      setAssetData(data);
      setAssetPath(path);
    } catch (error) {
      console.error('[ScriptableEditor] Failed to load asset:', error);
      setAssetData(null);
      setAssetPath(null);
    }
  };

  const handleAssetSelect = (assetPath: string) => {
    setSelectedAsset(assetPath);
  };

  const handleAssetUpdate = (updatedData: AssetData) => {
    setAssetData(updatedData);
    // TODO: Save asset
  };

  return (
    <div className="scriptable-editor">
      <GameHeader
        user={user}
        onLogout={logout}
        gameName="ASSET EDITOR"
      />
      <div className="scriptable-editor__content">
        {/* Left Panel: Resource Hierarchy */}
        <div className="scriptable-editor__left-panel">
          <ResourceTree
            onAssetSelect={handleAssetSelect}
            selectedAsset={selectedAsset}
          />
        </div>

        {/* Center Panel: Preview */}
        <div className="scriptable-editor__center-panel">
          <PreviewPanel
            assetPath={assetPath}
            assetData={assetData}
          />
        </div>

        {/* Right Panel: Inspector */}
        <div className="scriptable-editor__right-panel">
          <InspectorPanel
            assetPath={assetPath}
            assetData={assetData}
            onAssetUpdate={handleAssetUpdate}
          />
        </div>
      </div>
    </div>
  );
};

