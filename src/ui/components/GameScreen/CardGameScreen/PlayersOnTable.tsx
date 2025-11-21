import React, { useCallback, useEffect, useRef, useSyncExternalStore, useState } from 'react';
import PlayerUI from './PlayerUI';
import './PlayersOnTable.css';
import { tableLayoutStore } from '@ui/layout';
import type { SeatLayout } from '@ui/layout';
import { useGameMode } from '@ui/gameMode';

// Dev-only: Table Layout Editor (dynamically imported, tree-shaken in production builds)
// Type for the editor component
type TableLayoutEditorComponent = React.ComponentType<{
  containerRef: React.RefObject<HTMLDivElement | null>;
}>;

const PlayersOnTable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layoutState = useSyncExternalStore(
    tableLayoutStore.subscribe,
    tableLayoutStore.getState,
    tableLayoutStore.getState
  );

  const { gameMode, isReady } = useGameMode();

  const seats = layoutState.seats ?? [];
  const selectedSeatId = layoutState.selectedSeatId ?? null;

  // Dev-only: Lazy load editor component only in dev mode
  const [EditorComponent, setEditorComponent] = useState<TableLayoutEditorComponent | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV && !EditorComponent) {
      import('./CardGameEditor/TableLayoutEditor')
        .then((module) => setEditorComponent(() => module.default))
        .catch(() => {
          // Silently fail if editor can't be loaded
          console.warn('[PlayersOnTable] Failed to load table layout editor');
        });
    }
  }, [EditorComponent]);

  const handleSeatSelect = useCallback((seatId: number | null) => {
    tableLayoutStore.setSelectedSeat(seatId);
    if (seatId && import.meta.env.DEV) {
      tableLayoutStore.setEditorVisible(true);
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className="players-on-table" ref={containerRef}>
      {seats
        .filter((seat) => seat.id !== 0)
        .filter((seat) => seat.id < gameMode.maxPlayers)
        .map((seat, index) => (
          <PlayerSeatContainer
            key={seat.id ?? `seat-${index}`}
            seat={seat}
            selected={seat.id === selectedSeatId}
            onSelect={handleSeatSelect}
          />
        ))}

      {/* Dev-only: Table Layout Editor (excluded from production builds) */}
      {import.meta.env.DEV && EditorComponent && (
        <EditorComponent containerRef={containerRef} />
      )}
    </div>
  );
};

interface PlayerSeatContainerProps {
  seat: SeatLayout;
  onSelect: (seatId: number) => void;
  selected: boolean;
}

const PlayerSeatContainer: React.FC<PlayerSeatContainerProps> = ({ seat, onSelect, selected }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.style.setProperty('--seat-left', `${(seat.position?.x ?? 0.5) * 100}%`);
    node.style.setProperty('--seat-top', `${(seat.position?.y ?? 0.5) * 100}%`);
    node.style.setProperty('--seat-rotation', `${seat.rotation ?? 0}deg`);
    node.style.setProperty('--seat-scale', `${seat.scale ?? 1}`);
  }, [seat.position?.x, seat.position?.y, seat.rotation, seat.scale]);

  const handleClick = useCallback(() => {
    onSelect(seat.id);
  }, [onSelect, seat.id]);

  const className = selected ? 'player-seat player-seat--selected' : 'player-seat';
  return (
    <div
      ref={ref}
      className={className}
      data-seat-id={seat.id}
      aria-hidden="true"
      onClick={handleClick}
    >
      <PlayerUI {...(seat.playerOverrides ?? {})} />
    </div>
  );
};

export default PlayersOnTable;

