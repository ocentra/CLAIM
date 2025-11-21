import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// Default panel widths (in pixels)
const DEFAULT_LEFT_WIDTH = 250;
const DEFAULT_RIGHT_WIDTH = 350;
const MIN_PANEL_WIDTH = 150;

export const ScriptableEditorPage: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [assetPath, setAssetPath] = useState<string | null>(null);
  const [isLoadingAsset, setIsLoadingAsset] = useState(false);
  const [assetError, setAssetError] = useState<string | null>(null);
  
  // Asset cache to avoid re-fetching
  const assetCacheRef = useRef<Map<string, AssetData>>(new Map());
  
  // Panel widths state
  const [leftWidth, setLeftWidth] = useState(() => {
    const saved = localStorage.getItem('scriptable-editor-left-width');
    return saved ? parseInt(saved, 10) : DEFAULT_LEFT_WIDTH;
  });
  const [rightWidth, setRightWidth] = useState(() => {
    const saved = localStorage.getItem('scriptable-editor-right-width');
    return saved ? parseInt(saved, 10) : DEFAULT_RIGHT_WIDTH;
  });
  
  // Resize state
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load asset when selected
  useEffect(() => {
    if (selectedAsset) {
      loadAsset(selectedAsset);
    } else {
      setAssetData(null);
      setAssetPath(null);
    }
  }, [selectedAsset]);

  // Save panel widths to localStorage
  useEffect(() => {
    localStorage.setItem('scriptable-editor-left-width', leftWidth.toString());
  }, [leftWidth]);

  useEffect(() => {
    localStorage.setItem('scriptable-editor-right-width', rightWidth.toString());
  }, [rightWidth]);

  // Update CSS variables for panel widths
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--left-panel-width', `${leftWidth}px`);
      containerRef.current.style.setProperty('--right-panel-width', `${rightWidth}px`);
    }
  }, [leftWidth, rightWidth]);

  // Handle left panel resize
  const handleMouseDownLeft = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
  }, []);

  // Handle right panel resize
  const handleMouseDownRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
  }, []);

  // Global mouse move handler for resizing
  useEffect(() => {
    if (!isResizingLeft && !isResizingRight) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (isResizingLeft) {
        const newLeftWidth = e.clientX - containerRect.left;
        const clampedWidth = Math.max(MIN_PANEL_WIDTH, Math.min(newLeftWidth, containerWidth - rightWidth - MIN_PANEL_WIDTH));
        setLeftWidth(clampedWidth);
      }

      if (isResizingRight) {
        const newRightWidth = containerRect.right - e.clientX;
        const clampedWidth = Math.max(MIN_PANEL_WIDTH, Math.min(newRightWidth, containerWidth - leftWidth - MIN_PANEL_WIDTH));
        setRightWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, leftWidth, rightWidth]);

  const loadAsset = async (path: string) => {
    // Normalize path - ensure it starts with / and is valid for fetch
    let normalizedPath = path;
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = `/${normalizedPath}`;
    }
    
    // Check cache first
    const cached = assetCacheRef.current.get(normalizedPath);
    if (cached) {
      setAssetData(cached);
      setAssetPath(normalizedPath);
      setAssetError(null);
      return;
    }

    setIsLoadingAsset(true);
    setAssetError(null);
    setAssetData(null);
    setAssetPath(null);

    try {
      // Create fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(normalizedPath, {
        signal: controller.signal,
        cache: 'default', // Allow browser caching
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load asset: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the asset
      assetCacheRef.current.set(normalizedPath, data);
      
      // Limit cache size to prevent memory issues (keep last 50 assets)
      if (assetCacheRef.current.size > 50) {
        const firstKey = assetCacheRef.current.keys().next().value;
        if (firstKey) {
          assetCacheRef.current.delete(firstKey);
        }
      }

      setAssetData(data);
      setAssetPath(normalizedPath);
      setAssetError(null);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? (error.name === 'AbortError' ? 'Request timed out' : error.message)
        : 'Unknown error';
      
      console.error('[ScriptableEditor] Failed to load asset:', error);
      setAssetError(`Failed to load asset: ${errorMessage}`);
      setAssetData(null);
      setAssetPath(null);
    } finally {
      setIsLoadingAsset(false);
    }
  };

  // Clear asset from cache when it's saved (so fresh data is loaded)
  const handleAssetUpdate = (updatedData: AssetData) => {
    if (assetPath) {
      assetCacheRef.current.delete(assetPath);
      assetCacheRef.current.set(assetPath, updatedData);
    }
    setAssetData(updatedData);
  };

  const handleAssetSelect = (assetPath: string) => {
    setSelectedAsset(assetPath);
    // Clear any previous errors when selecting a new asset
    setAssetError(null);
  };

  return (
    <div className="scriptable-editor">
      <div 
        ref={containerRef}
        className="scriptable-editor__content"
      >
        {/* Left Panel: Resource Hierarchy */}
        <div className="scriptable-editor__left-panel">
          <ResourceTree
            onAssetSelect={handleAssetSelect}
            selectedAsset={selectedAsset}
          />
        </div>

        {/* Left Resize Handle */}
        <div
          className={`scriptable-editor__resize-handle scriptable-editor__resize-handle--left ${isResizingLeft ? 'scriptable-editor__resize-handle--active' : ''}`}
          onMouseDown={handleMouseDownLeft}
        />

        {/* Center Panel: Preview */}
        <div className="scriptable-editor__center-panel">
          <PreviewPanel
            assetPath={assetPath}
            assetData={assetData}
            isLoading={isLoadingAsset}
            error={assetError}
          />
        </div>

        {/* Right Resize Handle */}
        <div
          className={`scriptable-editor__resize-handle scriptable-editor__resize-handle--right ${isResizingRight ? 'scriptable-editor__resize-handle--active' : ''}`}
          onMouseDown={handleMouseDownRight}
        />

        {/* Right Panel: Inspector */}
        <div className="scriptable-editor__right-panel">
          <InspectorPanel
            assetPath={assetPath}
            assetData={assetData}
            isLoading={isLoadingAsset}
            error={assetError}
            onAssetUpdate={handleAssetUpdate}
          />
        </div>
      </div>
    </div>
  );
};

