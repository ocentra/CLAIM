// PageContentAsset.ts
// Page content asset class (extends ScriptableObject)
// Represents page content with hero section and multiple content sections

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';
import type { AssetReference } from '@/lib/serialization/ScriptableObject';

/**
 * Hero section for page content
 */
export interface HeroSection {
  title: string;
  subtitle?: string;
  backgroundImageRef?: AssetReference | string;
  ctaButtons?: Array<{
    label: string;
    href?: string;
    onClick?: string; // JS function name
  }>;
}

/**
 * Page section types
 */
export type PageSectionType = 
  | 'text'
  | 'rules'
  | 'screenshots'
  | 'strategy'
  | 'scoring'
  | 'about'
  | 'custom';

/**
 * Base page section
 */
export interface PageSection {
  type: PageSectionType;
  title?: string;
  content?: string;
  imageRefs?: Array<AssetReference | string>;
  [key: string]: unknown; // Allow custom fields
}

/**
 * PageContentAsset - ScriptableObject representing page content
 * Contains hero section and multiple content sections
 */
export class PageContentAsset extends ScriptableObject {
  static schemaVersion = 1;

  /**
   * Hero section (title, subtitle, background image, CTA buttons)
   */
  @serializable({ label: 'Hero Section' })
  hero!: HeroSection;

  /**
   * Array of page sections (rules, screenshots, text, etc.)
   */
  @serializable({ 
    label: 'Sections',
    elementType: Object as unknown as new () => PageSection
  })
  sections: PageSection[] = [];
}

