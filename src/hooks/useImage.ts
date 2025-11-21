// useImage.ts
// React hook for loading ImageAsset

import { useAsset, useAssetWithState, type UseAssetState } from './useAsset';
import { ImageAsset } from '@/lib/assets/ImageAsset';
import type { AssetReference } from '@/lib/serialization/ScriptableObject';

/**
 * Hook for loading image asset
 * 
 * @param assetRef - Asset path string or AssetReference object
 * @returns ImageAsset instance or null
 */
export function useImage(
  assetRef: string | AssetReference | null
): ImageAsset | null {
  return useAsset(ImageAsset, assetRef);
}

/**
 * Hook for loading image asset with loading and error states
 * Useful for tracking image loading state
 * 
 * @param assetRef - Asset path string or AssetReference object
 * @returns Asset state with loading and error information
 */
export function useImageWithState(
  assetRef: string | AssetReference | null
): UseAssetState<ImageAsset> {
  return useAssetWithState(ImageAsset, assetRef);
}

