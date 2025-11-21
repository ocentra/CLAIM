// useLayout.ts
// React hook for loading LayoutAsset

import { useAsset } from './useAsset';
import { LayoutAsset } from '@/lib/assets/LayoutAsset';
import { AssetPathResolver, AssetType } from '@/lib/assets/AssetPathResolver';

/**
 * Hook for loading layout asset
 * Resolves path automatically based on layout ID
 * 
 * @param layoutId - Layout identifier (e.g., "default", "sidebar")
 * @returns LayoutAsset instance or null
 */
export function useLayout(layoutId: string | null): LayoutAsset | null {
  const resolver = AssetPathResolver.getInstance();
  
  const path = layoutId
    ? resolver.resolvePath(layoutId, AssetType.Layout)
    : null;

  return useAsset(LayoutAsset, path);
}

