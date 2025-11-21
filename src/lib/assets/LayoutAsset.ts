// LayoutAsset.ts
// Layout asset class (extends ScriptableObject)
// Represents page layouts with sections that reference content assets

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';
import type { AssetReference } from '@/lib/serialization/ScriptableObject';

/**
 * Layout types
 */
export type LayoutType = 
  | 'single-column'
  | 'two-column'
  | 'three-column'
  | 'grid'
  | 'sidebar'
  | 'custom';

/**
 * Layout section
 */
export interface LayoutSection {
  id: string;
  type: string;
  contentRef?: AssetReference | string;
  width?: string;
  order?: number;
  [key: string]: unknown; // Allow custom fields
}

/**
 * Layout structure
 */
export interface LayoutStructure {
  type: LayoutType;
  sections: LayoutSection[];
  gap?: string;
  padding?: string;
  [key: string]: unknown; // Allow custom layout properties
}

/**
 * LayoutAsset - ScriptableObject representing page layouts
 * Sections reference content assets via AssetReference
 */
export class LayoutAsset extends ScriptableObject {
  static schemaVersion = 1;

  /**
   * Layout structure (type, sections, spacing, etc.)
   */
  @serializable({ label: 'Layout' })
  layout!: LayoutStructure;

  /**
   * Get section by ID
   */
  getSection(id: string): LayoutSection | undefined {
    return this.layout.sections.find(s => s.id === id);
  }

  /**
   * Get sections ordered by order field or default order
   */
  getOrderedSections(): LayoutSection[] {
    return [...this.layout.sections].sort((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      return orderA - orderB;
    });
  }
}

