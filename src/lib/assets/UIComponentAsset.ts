// UIComponentAsset.ts
// UI component asset class (extends ScriptableObject)
// Represents UI component styles and animations

import 'reflect-metadata';
import { serializable } from '@/lib/serialization/Serializable';
import { ScriptableObject } from '@/lib/serialization/ScriptableObject';

/**
 * Component types
 */
export type ComponentType = 
  | 'Button'
  | 'Input'
  | 'Card'
  | 'Modal'
  | 'Dialog'
  | 'Tooltip'
  | 'Badge'
  | 'Custom';

/**
 * CSS styles
 */
export interface ComponentStyles {
  [property: string]: string;
}

/**
 * Animation configurations
 */
export interface AnimationConfig {
  name: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
  iterationCount?: string;
  direction?: string;
  fillMode?: string;
}

/**
 * UIComponentAsset - ScriptableObject representing UI component styles
 * Contains component type, styles, and animations
 */
export class UIComponentAsset extends ScriptableObject {
  static schemaVersion = 1;

  /**
   * Component type (Button, Input, Card, etc.)
   */
  @serializable({ label: 'Component Type' })
  component!: ComponentType;

  /**
   * CSS styles as key-value pairs
   */
  @serializable({ label: 'Styles' })
  styles: ComponentStyles = {};

  /**
   * Animation configurations
   */
  @serializable({ 
    label: 'Animations',
    elementType: Object as unknown as new () => AnimationConfig
  })
  animations: Record<string, AnimationConfig> = {};

  /**
   * Get CSS string from styles object
   */
  getCSS(): string {
    return Object.entries(this.styles)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
  }
}

