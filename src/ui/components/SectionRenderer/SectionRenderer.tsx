// SectionRenderer.tsx
// Component for rendering different types of page sections

import React from 'react';
import type { PageSection } from '@/lib/assets/PageContentAsset';
import { AssetImage } from '../AssetImage/AssetImage';
import './SectionRenderer.css';

export interface SectionRendererProps {
  section: PageSection;
}

/**
 * SectionRenderer component - Renders different section types from PageContentAsset
 * Handles rules, screenshots, text, and custom sections
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const { type, title, content, imageRefs, ...customProps } = section;

  // Render section title if provided
  const renderTitle = () => {
    if (!title) return null;
    return <h2 className="section-renderer__title">{title}</h2>;
  };

  // Render images if provided
  const renderImages = () => {
    if (!imageRefs || imageRefs.length === 0) return null;
    
    return (
      <div className="section-renderer__images">
        {imageRefs.map((imageRef, index) => (
          <AssetImage
            key={index}
            assetRef={typeof imageRef === 'string' ? imageRef : imageRef.path || null}
            className="section-renderer__image"
          />
        ))}
      </div>
    );
  };

  // Render content based on section type
  switch (type) {
    case 'rules':
      return (
        <div className={`section-renderer section-renderer--rules`} {...customProps}>
          {renderTitle()}
          {renderImages()}
          {content && (
            <div className="section-renderer__content" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      );

    case 'screenshots':
      return (
        <div className={`section-renderer section-renderer--screenshots`} {...customProps}>
          {renderTitle()}
          {renderImages()}
          {content && (
            <div className="section-renderer__content" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      );

    case 'strategy':
      return (
        <div className={`section-renderer section-renderer--strategy`} {...customProps}>
          {renderTitle()}
          {renderImages()}
          {content && (
            <div className="section-renderer__content" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      );

    case 'scoring':
      return (
        <div className={`section-renderer section-renderer--scoring`} {...customProps}>
          {renderTitle()}
          {renderImages()}
          {content && (
            <div className="section-renderer__content" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      );

    case 'about':
      return (
        <div className={`section-renderer section-renderer--about`} {...customProps}>
          {renderTitle()}
          {renderImages()}
          {content && (
            <div className="section-renderer__content" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      );

    case 'text':
    default:
      return (
        <div className={`section-renderer section-renderer--text`} {...customProps}>
          {renderTitle()}
          {renderImages()}
          {content && (
            <div className="section-renderer__content" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      );
  }
};

export default SectionRenderer;

