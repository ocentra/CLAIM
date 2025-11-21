// AssetImage.tsx
// Component for rendering responsive images from ImageAsset

import React, { useState } from 'react';
import { useImage, useImageWithState } from '@/hooks/useImage';
import type { AssetReference } from '@/lib/serialization/ScriptableObject';
import './AssetImage.css';

export interface AssetImageProps {
  assetRef: string | AssetReference | null;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * AssetImage component - Renders responsive images from ImageAsset
 * Supports desktop/mobile sources with fallback
 */
export const AssetImage: React.FC<AssetImageProps> = ({
  assetRef,
  alt,
  className = '',
  fallbackSrc,
  loading = 'lazy',
}) => {
  const imageAsset = useImage(assetRef);
  const { loading: isLoading, error } = useImageWithState(assetRef);
  const [imageError, setImageError] = useState(false);

  // Handle image load error
  const handleError = () => {
    setImageError(true);
  };

  // If loading or no asset, show placeholder
  if (isLoading || !imageAsset) {
    return (
      <div className={`asset-image asset-image--loading ${className}`}>
        {fallbackSrc && <img src={fallbackSrc} alt={alt || ''} className={className} />}
      </div>
    );
  }

  // If error, show fallback or placeholder
  if (error || imageError) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt || ''} className={className} onError={handleError} />;
    }
    return (
      <div className={`asset-image asset-image--error ${className}`}>
        <span>Image not available</span>
      </div>
    );
  }

  const desktopUrl = imageAsset.getImageUrl('desktop');
  const mobileUrl = imageAsset.getImageUrl('mobile');
  const fallbackUrl = imageAsset.getImageUrl('fallback') || imageAsset.getImageUrl('icon') || fallbackSrc;
  const imageAlt = imageAsset.metadata?.alt || alt || '';

  // Render responsive picture element
  if (desktopUrl || mobileUrl) {
    return (
      <picture className={`asset-image ${className}`}>
        {mobileUrl && <source media="(max-width: 768px)" srcSet={mobileUrl} />}
        {desktopUrl && <source media="(min-width: 769px)" srcSet={desktopUrl} />}
        <img
          src={fallbackUrl || desktopUrl || mobileUrl || ''}
          alt={imageAlt}
          className={className}
          loading={loading}
          onError={handleError}
        />
      </picture>
    );
  }

  // Single image
  const imageUrl = fallbackUrl || desktopUrl || mobileUrl;
  if (!imageUrl) {
    return (
      <div className={`asset-image asset-image--error ${className}`}>
        <span>No image source available</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={imageAlt}
      className={`asset-image ${className}`}
      loading={loading}
      onError={handleError}
    />
  );
};

export default AssetImage;

