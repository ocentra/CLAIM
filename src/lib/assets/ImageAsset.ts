// ImageAsset.ts
// Image asset class (extends ScriptableObject)
// Represents responsive images with multiple sources and metadata

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';
import type { AssetReference } from '@/lib/serialization/ScriptableObject';

/**
 * Image sources for different devices/sizes
 */
export interface ImageSources {
  desktop?: AssetReference | string;
  mobile?: AssetReference | string;
  icon?: AssetReference | string;
  fallback?: AssetReference | string;
}

/**
 * Image metadata
 */
export interface ImageMetadata {
  title?: string;
  alt: string;
  caption?: string;
  attribution?: string;
}

/**
 * CDN configuration
 */
export interface CDNConfig {
  enabled: boolean;
  baseUrl?: string;
}

/**
 * ImageAsset - ScriptableObject representing responsive images
 * Supports multiple sources (desktop, mobile, icon) and CDN
 */
export class ImageAsset extends ScriptableObject {
  static schemaVersion = 1;

  /**
   * Image sources for different devices/sizes
   */
  @serializable({ label: 'Sources' })
  sources!: ImageSources;

  /**
   * Image metadata (title, alt text, caption, attribution)
   */
  @serializable({ label: 'Metadata' })
  metadata!: ImageMetadata;

  /**
   * CDN configuration
   */
  @serializable({ label: 'CDN' })
  cdn: CDNConfig = { enabled: false };

  /**
   * Get image URL for a specific source
   * Resolves AssetReference to path or returns string URL directly
   */
  getImageUrl(source: keyof ImageSources): string | null {
    const sourceValue = this.sources[source];
    if (!sourceValue) {
      return null;
    }
    
    if (typeof sourceValue === 'string') {
      return sourceValue;
    }
    
    // AssetReference
    return sourceValue.path || null;
  }
}

