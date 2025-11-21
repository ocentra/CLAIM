// useAsset.ts
// Generic React hook for loading any ScriptableObject asset

import { useState, useEffect } from 'react';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';
import type { AssetReference } from '@/lib/serialization/ScriptableObject';

/**
 * Generic hook for loading any ScriptableObject asset
 * Handles loading state, error handling, and caching
 * 
 * @param constructor - Constructor function for the asset type
 * @param pathOrRef - Asset path string or AssetReference object
 * @returns Asset instance or null
 */
export function useAsset<T extends ScriptableObject>(
  constructor: new () => T,
  pathOrRef: string | AssetReference | null
): T | null {
  const [asset, setAsset] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pathOrRef) {
      setAsset(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Extract path from AssetReference or use string directly
    const path = typeof pathOrRef === 'string' 
      ? pathOrRef 
      : pathOrRef.path || null;

    if (!path) {
      setAsset(null);
      setLoading(false);
      setError(new Error('No path available for asset'));
      return;
    }

    setLoading(true);
    setError(null);

    // Load asset using ScriptableObject.load
    ScriptableObject.load(constructor, path)
      .then((loadedAsset) => {
        setAsset(loadedAsset);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`[useAsset] Failed to load asset from ${path}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setAsset(null);
        setLoading(false);
      });
  }, [constructor, pathOrRef]);

  return asset;
}

/**
 * Hook state including loading and error states
 */
export interface UseAssetState<T extends ScriptableObject> {
  asset: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Enhanced hook with loading and error states
 */
export function useAssetWithState<T extends ScriptableObject>(
  constructor: new () => T,
  pathOrRef: string | AssetReference | null
): UseAssetState<T> {
  const [asset, setAsset] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pathOrRef) {
      setAsset(null);
      setLoading(false);
      setError(null);
      return;
    }

    const path = typeof pathOrRef === 'string' 
      ? pathOrRef 
      : pathOrRef.path || null;

    if (!path) {
      setAsset(null);
      setLoading(false);
      setError(new Error('No path available for asset'));
      return;
    }

    setLoading(true);
    setError(null);

    ScriptableObject.load(constructor, path)
      .then((loadedAsset) => {
        setAsset(loadedAsset);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`[useAssetWithState] Failed to load asset from ${path}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setAsset(null);
        setLoading(false);
      });
  }, [constructor, pathOrRef]);

  return { asset, loading, error };
}

