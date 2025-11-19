import { useRef, useEffect, useCallback, useState } from 'react';

// Navigation spacing constants
const DEFAULT_NAV_ITEM_GAP = 6; // Default gap between navigation items
const DEFAULT_NAV_ITEM_MARGIN = 4; // Default margin between navigation items
const DEFAULT_NAV_ITEM_PADDING = '4px 8px'; // Default padding inside navigation items

interface ArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

export interface NavigationItem {
  name: string;
  href?: string;
  onClick?: () => void;
  type?: 'link' | 'input' | 'select' | 'checkbox' | 'button' | 'custom';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: string[];
  label?: string;
  minWidth?: string;
  customComponent?: React.ReactNode;
}

export interface NavigationBarProps {
  items: NavigationItem[];
  height: number;
  showArrows?: boolean;
  variant?: 'default' | 'form';
  itemGap?: number;
  itemMargin?: number;
  itemPadding?: string;
  style?: React.CSSProperties;
  hideBackground?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: 'white',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      }}
    >
      {direction === 'left' ? '←' : '→'}
    </button>
  );
};

export function NavigationBar({ 
  items, 
  height, 
  showArrows = true,
  variant = 'default',
  itemGap = DEFAULT_NAV_ITEM_GAP,
  itemMargin = DEFAULT_NAV_ITEM_MARGIN,
  itemPadding = DEFAULT_NAV_ITEM_PADDING,
  style,
  hideBackground = false
}: NavigationBarProps) {
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [showNavigationArrows, setShowNavigationArrows] = useState(false);

  const updateScrollState = useCallback(() => {
    if (navContainerRef.current) {
      const { scrollWidth, clientWidth } = navContainerRef.current;
      setShowNavigationArrows(scrollWidth > clientWidth);
    }
  }, []);

  const scrollNav = (direction: 'left' | 'right') => {
    if (navContainerRef.current) {
      const container = navContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;

      const buttonWidth = variant === 'form' ? 300 : 110;

      if (direction === 'right') {
        if (currentScroll >= maxScroll - buttonWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += buttonWidth;
        }
      } else {
        if (currentScroll <= buttonWidth) {
          container.scrollLeft = maxScroll;
        } else {
          container.scrollLeft -= buttonWidth;
        }
      }
    }
  };

  const handleWheel = (event: WheelEvent) => {
    if (navContainerRef.current) {
      event.preventDefault();
      navContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);

    const navContainer = navContainerRef.current;
    if (navContainer) {
      navContainer.addEventListener('wheel', handleWheel);
    }

    return () => {
      window.removeEventListener('resize', updateScrollState);
      if (navContainer) {
        navContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [updateScrollState]);

  const renderItem = (item: NavigationItem) => {
    // Handle custom component type
    if (item.type === 'custom' && item.customComponent) {
      return (
        <div key={item.name} style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0,
          margin: `0 ${itemMargin}px`
        }}>
          {item.customComponent}
        </div>
      );
    }

    if (variant === 'form') {
      return (
        <div key={item.name} style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0,
          gap: '8px'
        }}>
          {item.label && (
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              {item.label}
            </span>
          )}
          {item.type === 'select' ? (
            <select
              title={item.label || item.name}
              value={item.value}
              onChange={(e) => item.onChange?.(e.target.value)}
              style={{
                padding: '6px 6px',
                margin: `0 ${itemMargin}px`,
                width: item.minWidth || '150px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <option value="">Select {item.label?.toLowerCase()}...</option>
              {item.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : item.type === 'checkbox' ? (
            <input
              type="checkbox"
              title={item.label || item.name}
              checked={item.value === 'true'}
              onChange={(e) => item.onChange?.(e.target.checked.toString())}
              style={{
                margin: `0 ${itemMargin}px`,
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            />
          ) : item.type === 'button' ? (
            <button
              onClick={item.onClick}
              style={{
                padding: itemPadding,
                margin: `0 ${itemMargin}px`,
                width: item.minWidth || 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {item.label || item.name}
            </button>
          ) : (
            <input
              type="text"
              value={item.value}
              onChange={(e) => item.onChange?.(e.target.value)}
              placeholder={item.placeholder}
              style={{
                padding: itemPadding,
                margin: `${itemMargin}px`,
                width: item.minWidth || '80px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              className="nav-input"
              data-name={item.name}
            />
          )}
        </div>
      );
    }

    // For default variant
    const commonButtonStyles = {
      padding: itemPadding,
      margin: `0 ${itemMargin}px`,
      minWidth: 'fit-content',
      textAlign: 'center' as const,
      textDecoration: 'none',
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      paddingLeft: '16px',
      paddingRight: '16px'
    };

    if (item.onClick) {
      return (
        <button
          key={item.name}
          onClick={item.onClick}
          style={commonButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          {item.name}
        </button>
      );
    }

    return (
      <a
        key={item.name}
        href={item.href || '#'}
        style={commonButtonStyles}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        {item.name}
      </a>
    );
  };

  return (
    <div style={{
      height: `${height}px`,
      position: 'relative',
      margin: '0.5rem 0 0 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      width: '100vw',
      maxWidth: '100vw',
      padding: '0',
      boxSizing: 'border-box',
      ...(style || {})
    }}>
        {/* Nav Background */}
        {!hideBackground && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: variant === 'form' ? '42px' : `${height + 10}px`,
            right: variant === 'form' ? '42px' : `${height + 10}px`,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: variant === 'form' ? '5px' : '0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }} />
        )}

      {/* Left Arrow */}
      {showArrows && showNavigationArrows && (
        <div style={{ 
          height: variant === 'form' ? '32px' : `${height}px`,
          width: variant === 'form' ? '32px' : `${height}px`,
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2
        }}>
          <ArrowButton direction="left" onClick={() => scrollNav('left')} />
        </div>
      )}

      {/* Scrollable Content */}
      <div
        ref={navContainerRef}
        style={{
          height: '100%',
          width: variant === 'form' ? 'calc(100% - 84px)' : `calc(100% - ${(height + 10) * 2}px)`,
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          justifyContent: showNavigationArrows ? 'flex-start' : 'center',
          position: 'relative',
          zIndex: 1,
          scrollBehavior: 'smooth',
          padding: variant === 'form' ? '0 10px' : '0',
        }}
      >
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          height: '100%',
          gap: `${itemGap}px`,
          padding: '0 5px',
          flexWrap: 'nowrap',
          width: 'max-content',
        }}>
          {items.map((item) => renderItem(item))}
        </div>
      </div>

      {/* Right Arrow */}
      {showArrows && showNavigationArrows && (
        <div style={{ 
          height: variant === 'form' ? '32px' : `${height}px`,
          width: variant === 'form' ? '32px' : `${height}px`,
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2
        }}>
          <ArrowButton direction="right" onClick={() => scrollNav('right')} />
        </div>
      )}
    </div>
  );
}

