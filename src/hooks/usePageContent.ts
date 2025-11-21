// usePageContent.ts
// React hook for loading PageContentAsset

import { useAsset } from './useAsset';
import { PageContentAsset } from '@/lib/assets/PageContentAsset';
import { AssetPathResolver, AssetType } from '@/lib/assets/AssetPathResolver';

/**
 * Hook for loading page content asset
 * Resolves path automatically based on page ID
 * 
 * @param pageId - Page identifier (e.g., "Claim", "Welcome")
 * @param gameId - Optional game ID for game-specific pages
 * @returns PageContentAsset instance or null
 */
export function usePageContent(
  pageId: string | null,
  gameId?: string
): PageContentAsset | null {
  const resolver = AssetPathResolver.getInstance();
  
  // Resolve path based on whether it's a game page or general page
  const path = pageId && gameId
    ? resolver.resolvePath(`info`, AssetType.PageContent, undefined, gameId)
    : pageId
    ? resolver.resolvePath(pageId, AssetType.PageContent)
    : null;

  return useAsset(PageContentAsset, path);
}

