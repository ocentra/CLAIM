import React, { useState } from 'react';
import { CardAssetFactory, Suit, CardAsset } from '@/gameMode';
import './CreateCardDialog.css';

interface CreateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (cardId: string, card: CardAsset) => void;
  targetFolder: string;
}

/**
 * CreateCardDialog - Dialog for creating a new card asset
 */
export const CreateCardDialog: React.FC<CreateCardDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
  targetFolder,
}) => {
  const [rank, setRank] = useState<string>('2');
  const [suit, setSuit] = useState<Suit>(Suit.SPADES);
  const [isCreating, setIsCreating] = useState(false);

  // Handle Escape key at document level
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ranks = [
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: 'jack', label: 'Jack' },
    { value: 'queen', label: 'Queen' },
    { value: 'king', label: 'King' },
    { value: 'ace', label: 'Ace' },
  ];

  const suits = [
    { value: Suit.SPADES, label: '♠ Spades', symbol: '♠' },
    { value: Suit.HEARTS, label: '♥ Hearts', symbol: '♥' },
    { value: Suit.DIAMONDS, label: '♦ Diamonds', symbol: '♦' },
    { value: Suit.CLUBS, label: '♣ Clubs', symbol: '♣' },
  ];

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const factory = CardAssetFactory.getInstance();
      const rankValue = isNaN(Number(rank)) ? rank : Number(rank);
      const card = factory.createCard(
        rankValue as number | 'ace' | 'jack' | 'queen' | 'king',
        suit
      );

      // Generate asset ID
      const rankStr = typeof rankValue === 'number' ? rankValue.toString() : rankValue;
      const suitSymbol = suits.find(s => s.value === suit)?.symbol || '♠';
      const cardId = `${rankStr}_${suitSymbol}`;

      // Save card asset
      await saveCardAsset(card, cardId);

      onCreate(cardId, card);
      onClose();
      
      // Reset form
      setRank('2');
      setSuit(Suit.SPADES);
    } catch (error) {
      console.error('[CreateCardDialog] Failed to create card:', error);
      alert('Failed to create card asset. Check console for details.');
    } finally {
      setIsCreating(false);
    }
  };

  const saveCardAsset = async (card: CardAsset, cardId: string) => {
    try {
      const { serialize } = await import('@/lib/serialization/Serializable');
      const serialized = serialize(card);

      const assetData = {
        __schemaVersion: 1,
        __assetType: 'Card',
        __assetId: cardId,
        metadata: {
          assetId: cardId,
          assetType: 'Card',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...serialized,
      };

      // Save via API endpoint
      const response = await fetch('/__dev/api/save-card-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          asset: assetData,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to save card asset: ${error.message || response.statusText}`);
      }

      console.log(`[CreateCardDialog] Created card asset: ${cardId}.asset in ${targetFolder}`);
    } catch (error) {
      console.error('[CreateCardDialog] Failed to save card asset:', error);
      throw error;
    }
  };

  return (
    <div 
      className="create-card-dialog-overlay" 
      onClick={onClose}
      role="presentation"
      aria-label="Dialog backdrop - click to close"
    >
      {/* Dialog content - stopPropagation prevents clicks inside dialog from closing it */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div 
        className="create-card-dialog" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-card-dialog-title"
      >
        <div className="create-card-dialog__header">
          <h3 id="create-card-dialog-title">Create Card Asset</h3>
          <button
            className="create-card-dialog__close"
            onClick={onClose}
            disabled={isCreating}
          >
            ×
          </button>
        </div>
        <div className="create-card-dialog__content">
          <div className="create-card-dialog__field">
            <label htmlFor="card-rank-select" className="create-card-dialog__label">Rank</label>
            <select
              id="card-rank-select"
              className="create-card-dialog__select"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              disabled={isCreating}
            >
              {ranks.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="create-card-dialog__field">
            <div className="create-card-dialog__label">Suit</div>
            <div className="create-card-dialog__suit-grid" role="radiogroup" aria-label="Select suit">
              {suits.map((s) => {
                const isRed = s.value === Suit.HEARTS || s.value === Suit.DIAMONDS;
                return (
                  <button
                    key={s.value}
                    className={`create-card-dialog__suit-button ${
                      suit === s.value ? 'create-card-dialog__suit-button--selected' : ''
                    } ${isRed ? 'create-card-dialog__suit-button--red' : 'create-card-dialog__suit-button--black'}`}
                    onClick={() => setSuit(s.value)}
                    disabled={isCreating}
                  >
                    <span className="create-card-dialog__suit-symbol">{s.symbol}</span>
                    <span className="create-card-dialog__suit-name">{s.label.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="create-card-dialog__preview">
            <div className="create-card-dialog__preview-label">Preview</div>
            <div className="create-card-dialog__preview-card">
              <div className="create-card-dialog__preview-rank">
                {rank.toUpperCase()}
              </div>
              <div
                className={`create-card-dialog__preview-suit ${
                  suit === Suit.HEARTS || suit === Suit.DIAMONDS 
                    ? 'create-card-dialog__preview-suit--red' 
                    : 'create-card-dialog__preview-suit--black'
                }`}
              >
                {suits.find(s => s.value === suit)?.symbol}
              </div>
              <div className="create-card-dialog__preview-id">
                ID: {rank}_{suits.find(s => s.value === suit)?.symbol}
              </div>
            </div>
          </div>
        </div>
        <div className="create-card-dialog__footer">
          <button
            className="create-card-dialog__button create-card-dialog__button--cancel"
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            className="create-card-dialog__button create-card-dialog__button--create"
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

