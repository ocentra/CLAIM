import React, { useState, useEffect, useRef } from 'react';
import './ResourceTree.css';
import { CreateCardDialog } from './CreateCardDialog';
import type { CardAsset } from '@/gameMode';

interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'asset';
  children?: TreeNode[];
  expanded?: boolean;
}

interface ResourceTreeProps {
  onAssetSelect: (assetPath: string) => void;
  selectedAsset: string | null;
}

/**
 * ResourceTree - Left panel hierarchy tree
 * Shows Resources folder structure, filtered to .asset files only
 */
export const ResourceTree: React.FC<ResourceTreeProps> = ({
  onAssetSelect,
  selectedAsset,
}) => {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    path: string;
    isFolder: boolean;
  } | null>(null);
  const [showCreateCardDialog, setShowCreateCardDialog] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadResourceTree();
  }, []);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu]);

  // Set context menu position via DOM to avoid inline styles
  useEffect(() => {
    if (contextMenu && contextMenuRef.current) {
      contextMenuRef.current.style.setProperty('--context-menu-x', `${contextMenu.x}px`);
      contextMenuRef.current.style.setProperty('--context-menu-y', `${contextMenu.y}px`);
    }
  }, [contextMenu]);

  const loadResourceTree = async () => {
    try {
      // Fetch tree structure from server
      const response = await fetch('/__dev/api/scan-resources');
      if (!response.ok) {
        throw new Error(`Failed to scan Resources: ${response.statusText}`);
      }

      const data = await response.json();
      const tree = data.tree || [];

      // Wrap in Resources root node
      const root: TreeNode = {
        name: 'Resources',
        path: '/Resources',
        type: 'folder',
        expanded: true,
        children: tree,
      };

      setTree([root]);
    } catch (error) {
      console.error('[ResourceTree] Failed to load tree:', error);
      // Fallback to empty tree
      setTree([{
        name: 'Resources',
        path: '/Resources',
        type: 'folder',
        expanded: true,
        children: [],
      }]);
    }
  };

  const toggleExpand = (node: TreeNode) => {
    const updateNode = (n: TreeNode): TreeNode => {
      if (n.path === node.path) {
        return { ...n, expanded: !n.expanded };
      }
      if (n.children) {
        return { ...n, children: n.children.map(updateNode) };
      }
      return n;
    };

    setTree(tree.map(updateNode));
  };

  const handleNodeClick = (node: TreeNode) => {
    if (node.type === 'folder') {
      toggleExpand(node);
    } else if (node.type === 'asset') {
      onAssetSelect(node.path);
    }
  };

  const handleContextMenu = (node: TreeNode, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      path: node.path,
      isFolder: node.type === 'folder',
    });
  };

  const handleCreateCard = () => {
    if (!contextMenu) return;
    setShowCreateCardDialog(true);
    setContextMenu(null);
  };

  const handleCardCreated = (cardId: string) => {
    console.log('[ResourceTree] Card created:', cardId);
    // Reload tree to show new card - called from CreateCardDialog's onCreate
  };

  const renderNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const isSelected = selectedAsset === node.path;
    const hasChildren = node.children && node.children.length > 0;
    const indentPx = depth * 16 + 8;

    return (
      <div key={node.path}>
        <div
          ref={(el) => {
            if (el) {
              el.style.setProperty('--node-indent', `${indentPx}px`);
            }
          }}
          className={`resource-tree__node ${isSelected ? 'resource-tree__node--selected' : ''}`}
          data-indent={depth}
          onClick={() => handleNodeClick(node)}
          onContextMenu={(e) => handleContextMenu(node, e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNodeClick(node);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`${node.type === 'folder' ? 'Folder' : 'Asset'}: ${node.name}`}
        >
          {node.type === 'folder' && (
            <span className="resource-tree__expand-icon">
              {hasChildren && (node.expanded ? '▼' : '▶')}
            </span>
          )}
          <span className="resource-tree__icon">
            {node.type === 'folder' ? '📁' : '📄'}
          </span>
          <span className="resource-tree__name">{node.name}</span>
        </div>
        {node.type === 'folder' && node.expanded && hasChildren && (
          <div className="resource-tree__children">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="resource-tree">
      <div className="resource-tree__header">
        <h3>Resources</h3>
      </div>
      <div className="resource-tree__content">
        {tree.map((node) => renderNode(node))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="resource-tree__context-menu"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="menu"
          tabIndex={-1}
          aria-label="Context menu"
        >
          <div className="resource-tree__context-menu__item">
            Create
            <span className="resource-tree__context-menu__arrow">▶</span>
            <div className="resource-tree__context-menu__submenu">
              {contextMenu.isFolder && contextMenu.path.includes('Cards') && (
                <div
                  className="resource-tree__context-menu__submenu-item"
                  onClick={handleCreateCard}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCreateCard();
                    }
                  }}
                  role="menuitem"
                  tabIndex={0}
                >
                  Card
                </div>
              )}
              {/* Add more create options here */}
            </div>
          </div>
        </div>
      )}

      {/* Create Card Dialog */}
      <CreateCardDialog
        isOpen={showCreateCardDialog}
        onClose={() => setShowCreateCardDialog(false)}
        onCreate={((cardId: string) => {
          handleCardCreated(cardId);
          // Reload tree after a short delay to ensure file is written
          setTimeout(() => {
            loadResourceTree();
          }, 500);
        }) as (cardId: string, card: CardAsset) => void}
        targetFolder={contextMenu?.path || '/Resources/Cards'}
      />
    </div>
  );
};

