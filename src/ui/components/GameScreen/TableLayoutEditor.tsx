import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  PLAYER_UI_SERIALIZABLE_FIELDS,
  type SerializablePlayerUIKey,
  sanitizePlayerUIOverrides,
} from './PlayerUI';
import './TableLayoutEditor.css';
import type {
  LayoutPreset,
  SeatLayout,
  TableShapeSettings,
} from '@ui/layout';
import { getGameAsset, tableLayoutStore } from '@ui/layout';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 10;

interface TableLayoutEditorProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const TableLayoutEditor: React.FC<TableLayoutEditorProps> = ({ containerRef }) => {
  const layoutState = useSyncExternalStore(
    tableLayoutStore.subscribe,
    tableLayoutStore.getState,
    tableLayoutStore.getState,
  );

  const [showExport, setShowExport] = useState(false);
  const [exportedPreset, setExportedPreset] = useState('');

  const playerInputId = useId();
  const playerLabelId = `${playerInputId}-label`;

  const seats = useMemo(() => layoutState.seats ?? [], [layoutState.seats]);
  const playerCount = layoutState.playerCount ?? MIN_PLAYERS;
  const isEditorVisible = layoutState.isEditorVisible;
  const selectedSeatId = layoutState.selectedSeatId;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('tableEditor')) {
      tableLayoutStore.setEditorVisible(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyL') {
        event.preventDefault();
        tableLayoutStore.toggleEditorVisible();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePlayerCountChange = useCallback((nextCount: number) => {
    tableLayoutStore.setPlayerCount(nextCount);
  }, []);

  const handleCopyFromPrevious = useCallback(() => {
    if (playerCount <= MIN_PLAYERS) {
      return;
    }
    const asset = getGameAsset();
    if (!asset) {
      return;
    }
    const sourcePreset = asset.layout.presets[String(playerCount - 1)];
    if (!sourcePreset) {
      console.warn('[TableLayoutEditor] No previous preset found for', playerCount - 1);
      return;
    }
    const currentSeats = tableLayoutStore.getState().seats ?? [];
    const sourceSeats = sourcePreset.seats ?? [];
    const nextSeats = currentSeats.map((seat, index) => {
      const sourceById = sourceSeats.find((candidate) => candidate.id === seat.id);
      const sourceSeat = sourceById ?? sourceSeats[index];
      if (!sourceSeat) {
        return seat;
      }
      return {
        ...seat,
        position: sourceSeat.position ? { ...sourceSeat.position } : seat.position,
        rotation: sourceSeat.rotation ?? seat.rotation,
        scale: sourceSeat.scale ?? seat.scale,
        playerOverrides: sanitizePlayerUIOverrides(
          sourceSeat.playerOverrides
            ? { ...sourceSeat.playerOverrides }
            : seat.playerOverrides,
        ),
      };
    });

    tableLayoutStore.setLayout({
      table: sourcePreset.table,
      seats: nextSeats,
      playerCount,
    });
  }, [playerCount]);

  const handleResetPreset = useCallback(() => {
    const asset = getGameAsset();
    if (!asset) return;
    const preset = asset.layout.presets[String(playerCount)];
    if (!preset) return;
    tableLayoutStore.setLayout({
      table: preset.table,
      seats: preset.seats,
      playerCount,
    });
  }, [playerCount]);

  const handleSeatUpdate = useCallback((seatId: number, updates: Partial<SeatLayout>) => {
    const currentSeats = tableLayoutStore.getState().seats ?? [];
    const nextSeats = currentSeats.map((seat) =>
      seat.id === seatId
        ? {
            ...seat,
            ...updates,
            position: updates.position ?? seat.position,
          }
        : seat,
    );
    tableLayoutStore.setSeats(nextSeats);
  }, []);

  const handleGlobalSeatScaleChange = useCallback((nextScale: number) => {
    if (!Number.isFinite(nextScale)) {
      return;
    }
    const clamped = Math.max(0.4, Math.min(2, nextScale));
    const currentSeats = tableLayoutStore.getState().seats ?? [];
    const nextSeats = currentSeats.map((seat) => ({
      ...seat,
      scale: clamped,
    }));
    tableLayoutStore.setSeats(nextSeats);
  }, []);

  const handleSeatPositionChange = useCallback(
    (seatId: number, axis: 'x' | 'y', value: number) => {
      const normalized = Math.max(0, Math.min(1, value));
      const currentSeats = tableLayoutStore.getState().seats ?? [];
      const nextSeats = currentSeats.map((seat) => {
        if (seat.id !== seatId) {
          return seat;
        }
        return {
          ...seat,
          position: {
            x: axis === 'x' ? normalized : seat.position?.x ?? 0.5,
            y: axis === 'y' ? normalized : seat.position?.y ?? 0.5,
          },
        };
      });
      tableLayoutStore.setSeats(nextSeats);
    },
    [],
  );

  const handleSeatPlayerOverride = useCallback(
    (seatId: number, key: SerializablePlayerUIKey, value: number | '') => {
      const currentSeats = tableLayoutStore.getState().seats ?? [];
      const nextSeats = currentSeats.map((seat) => {
        if (seat.id !== seatId) {
          return seat;
        }
        const nextOverrides: Partial<Record<SerializablePlayerUIKey, number>> = {
          ...(seat.playerOverrides ?? {}),
        };
        if (value === '' || Number.isNaN(value)) {
          delete nextOverrides[key];
        } else {
          nextOverrides[key] = value;
        }
        return {
          ...seat,
          playerOverrides: sanitizePlayerUIOverrides(nextOverrides),
        };
      });
      tableLayoutStore.setSeats(nextSeats);
    },
    [],
  );

  const handleSeatPlayerOverrideReset = useCallback(
    (seatId: number, key: SerializablePlayerUIKey) => {
      handleSeatPlayerOverride(seatId, key, '');
    },
    [handleSeatPlayerOverride],
  );

  const handleSeatSelect = useCallback((seatId: number | null) => {
    tableLayoutStore.setSelectedSeat(seatId);
    if (seatId !== null) {
      tableLayoutStore.setEditorVisible(true);
    }
  }, []);

  const handleTableUpdate = useCallback((updates: Partial<TableShapeSettings>) => {
    tableLayoutStore.setTable(updates);
  }, []);

  const handleSavePreset = useCallback(async () => {
    const asset = getGameAsset();
    const gameId = asset?.metadata.gameId ?? tableLayoutStore.getState().gameId ?? layoutState.gameId;

    if (!asset || !gameId) {
      console.warn('[TableLayoutEditor] Missing game asset or gameId; aborting save');
      return;
    }

    const serializeSeat = (seat: SeatLayout): Record<string, unknown> => {
      const serialized: Record<string, unknown> = {
        id: seat.id,
        label: seat.label ?? `p${seat.id + 1}`,
        position: {
          x: Number((seat.position?.x ?? 0).toFixed(4)),
          y: Number((seat.position?.y ?? 0).toFixed(4)),
        },
        rotation: Number((seat.rotation ?? 0).toFixed(3)),
      };

      if (seat.scale !== undefined) {
        serialized.scale = Number(seat.scale.toFixed(3));
      }

      const overrides = sanitizePlayerUIOverrides(seat.playerOverrides);
      if (overrides) {
        PLAYER_UI_SERIALIZABLE_FIELDS.forEach(({ key }) => {
          const normalizedKey = key as SerializablePlayerUIKey;
          const value = overrides[normalizedKey];
          if (typeof value === 'number' && Number.isFinite(value)) {
            serialized[normalizedKey] = Number(value.toFixed(3));
          }
        });
      }

      return serialized;
    };

    const serializePreset = (preset: LayoutPreset) => {
      const table = Object.fromEntries(
        Object.entries(preset.table ?? {}).map(([key, value]) => [
          key,
          typeof value === 'number' ? Number(value.toFixed(3)) : value,
        ]),
      );
      const seats = [...preset.seats]
        .sort((a, b) => a.id - b.id)
        .map(serializeSeat);
      return { table, seats };
    };

    const sanitizedPresets = Object.fromEntries(
      Object.entries(asset.layout.presets).map(([count, preset]) => [count, serializePreset(preset)]),
    );

    const sanitizedViews = asset.layout.views
      ? Object.fromEntries(
          Object.entries(asset.layout.views).map(([viewId, preset]) => [viewId, serializePreset(preset)]),
        )
      : undefined;

    const sanitizedAsset = {
      metadata: {
        ...asset.metadata,
        gameId,
        updatedAt: new Date().toISOString(),
      },
      layout: {
        defaultPlayerCount: asset.layout.defaultPlayerCount,
        presets: sanitizedPresets,
        playerUiDefaults: asset.layout.playerUiDefaults
          ? JSON.parse(JSON.stringify(asset.layout.playerUiDefaults))
          : undefined,
        views: sanitizedViews,
      },
      gameplay: asset.gameplay ? JSON.parse(JSON.stringify(asset.gameplay)) : {},
      extensions: asset.extensions ? JSON.parse(JSON.stringify(asset.extensions)) : {},
    };

    const payload = { gameId, asset: sanitizedAsset };

    try {
      const response = await fetch('/__dev/api/save-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Save failed with status ${response.status}`);
      }
      setShowExport(false);
    } catch (error) {
      const json = JSON.stringify(sanitizedAsset, null, 2);
      setExportedPreset(json);
      setShowExport(true);
      console.error('[TableLayoutEditor] Failed to save via API; providing manual export', error);
    }
  }, [layoutState.gameId]);

  const normalizeAngle = useCallback((angle: number) => {
    if (!Number.isFinite(angle)) return 0;
    const wrapped = angle % 360;
    return wrapped < 0 ? wrapped + 360 : wrapped;
  }, []);

  const renderedSeats = useMemo(() => [...seats].sort((a, b) => a.id - b.id), [seats]);
  const selectedSeat = useMemo(
    () => renderedSeats.find((seat) => seat.id === selectedSeatId) ?? null,
    [renderedSeats, selectedSeatId],
  );
  const uniformSeatScale = useMemo(
    () => selectedSeat?.scale ?? renderedSeats[0]?.scale ?? 1,
    [renderedSeats, selectedSeat],
  );

  if (!isEditorVisible) {
    return (
      <button
        type="button"
        className="table-layout-editor-panel__toggle"
        onClick={() => tableLayoutStore.setEditorVisible(true)}
      >
        Layout Editor
      </button>
    );
  }

  return (
    <>
      <div className="table-layout-editor-panel">
        <header className="table-layout-editor-panel__header">
          <h3>Table Layout Editor</h3>
          <button
            type="button"
            className="table-layout-editor-panel__close"
            onClick={() => tableLayoutStore.setEditorVisible(false)}
          >
            ✕
          </button>
        </header>

        <div className="table-layout-editor-panel__section">
          <label className="table-layout-editor-panel__label" id={playerLabelId} htmlFor={playerInputId}>
            Players
          </label>
          <div className="table-layout-editor-panel__range-row">
            <input
              type="range"
              min={MIN_PLAYERS}
              max={MAX_PLAYERS}
              step={1}
              value={playerCount}
              aria-labelledby={playerLabelId}
              onChange={(event) => handlePlayerCountChange(Number(event.target.value))}
            />
            <span className="table-layout-editor-panel__range-value">{playerCount}</span>
          </div>
          <input
            id={playerInputId}
            aria-labelledby={playerLabelId}
            type="number"
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            value={playerCount}
            onChange={(event) => handlePlayerCountChange(Number(event.target.value))}
            className="table-layout-editor-panel__input"
          />
          <div className="table-layout-editor-panel__button-row">
            <button type="button" onClick={() => handlePlayerCountChange(playerCount - 1)}>
              −
            </button>
            <button type="button" onClick={() => handlePlayerCountChange(playerCount + 1)}>
              +
            </button>
            <button type="button" onClick={handleResetPreset}>
              Reset Preset
            </button>
            <button type="button" onClick={handleCopyFromPrevious}>
              Copy Previous
            </button>
          </div>
        </div>

        <div className="table-layout-editor-panel__section">
          <h4>Table Shape</h4>
          {(['width', 'height', 'offsetX', 'offsetY', 'curvature', 'feltInset'] as Array<keyof TableShapeSettings>).map(
            (field) => (
              <label key={field} className="table-layout-editor-panel__label">
                {field}
                <input
                  type="number"
                  step={field === 'curvature' ? 0.01 : 1}
                  value={Number(layoutState.table?.[field] ?? 0)}
                  onChange={(event) =>
                    handleTableUpdate({
                      [field]:
                        field === 'curvature'
                          ? Number.parseFloat(event.target.value)
                          : Number(event.target.value),
                    })
                  }
                />
              </label>
            ),
          )}
        </div>

        <div className="table-layout-editor-panel__section">
          <h4>Seats</h4>
          <div className="table-layout-editor-panel__range-row">
            <label
              id="seat-scale-label"
              className="table-layout-editor-panel__label table-layout-editor-panel__label--inline"
              htmlFor="seat-scale-input"
            >
              scale
              <input
                id="seat-scale-input"
                type="number"
                min={0.4}
                max={2}
                step={0.01}
                value={Number(uniformSeatScale ?? 1).toFixed(2)}
                onChange={(event) => handleGlobalSeatScaleChange(Number.parseFloat(event.target.value))}
              />
            </label>
            <input
              type="range"
              aria-labelledby="seat-scale-label"
              min={0.4}
              max={2}
              step={0.01}
              value={uniformSeatScale ?? 1}
              onChange={(event) => handleGlobalSeatScaleChange(Number.parseFloat(event.target.value))}
            />
          </div>
          <div className="table-layout-editor-panel__seat-grid">
            {renderedSeats.map((seat) => {
              const isActive = selectedSeat?.id === seat.id;
              return (
                <button
                  key={seat.id}
                  type="button"
                  className={
                    isActive
                      ? 'table-layout-editor-panel__seat-chip table-layout-editor-panel__seat-chip--active'
                      : 'table-layout-editor-panel__seat-chip'
                  }
                  onClick={() => handleSeatSelect(seat.id)}
                >
                  {seat.id}
                </button>
              );
            })}
          </div>

          {selectedSeat ? (
            <div className="table-layout-editor-panel__seat-details">
              <span className="table-layout-editor-panel__seat-label">
                Seat {selectedSeat.id}: {selectedSeat.label ?? `Seat ${selectedSeat.id}`}
              </span>
              <label className="table-layout-editor-panel__label">
                rot°
                <div className="table-layout-editor-panel__angle-control">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={normalizeAngle(Number(selectedSeat.rotation ?? 0))}
                    onChange={(event) =>
                      handleSeatUpdate(selectedSeat.id, { rotation: Number(event.target.value) })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    max={360}
                    step={1}
                    value={normalizeAngle(Number(selectedSeat.rotation ?? 0))}
                    onChange={(event) =>
                      handleSeatUpdate(selectedSeat.id, { rotation: Number(event.target.value) })
                    }
                  />
                </div>
              </label>
              <div className="table-layout-editor-panel__position-grid">
                <label className="table-layout-editor-panel__label">
                  pos X
                  <div className="table-layout-editor-panel__position-control">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.001}
                      value={selectedSeat.position?.x ?? 0.5}
                      onChange={(event) =>
                        handleSeatPositionChange(selectedSeat.id, 'x', Number(event.target.value))
                      }
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={Number(((selectedSeat.position?.x ?? 0.5) * 100).toFixed(1))}
                      onChange={(event) =>
                        handleSeatPositionChange(selectedSeat.id, 'x', Number(event.target.value) / 100)
                      }
                    />
                  </div>
                </label>
                <label className="table-layout-editor-panel__label">
                  pos Y
                  <div className="table-layout-editor-panel__position-control">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.001}
                      value={selectedSeat.position?.y ?? 0.5}
                      onChange={(event) =>
                        handleSeatPositionChange(selectedSeat.id, 'y', Number(event.target.value))
                      }
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={Number(((selectedSeat.position?.y ?? 0.5) * 100).toFixed(1))}
                      onChange={(event) =>
                        handleSeatPositionChange(selectedSeat.id, 'y', Number(event.target.value) / 100)
                      }
                    />
                  </div>
                </label>
              </div>
              <div className="table-layout-editor-panel__seat-overrides">
                {PLAYER_UI_SERIALIZABLE_FIELDS.map((field) => {
                  const opts = field.options;
                  const overrideValue = selectedSeat.playerOverrides?.[field.key as SerializablePlayerUIKey];
                  const defaultValue =
                    typeof field.defaultValue === 'number' && Number.isFinite(field.defaultValue)
                      ? Number(field.defaultValue)
                      : 0;
                  const rawValue =
                    overrideValue !== undefined && overrideValue !== null
                      ? Number(overrideValue)
                      : defaultValue;
                  const displayValue =
                    opts.inputType === 'angle'
                      ? normalizeAngle(Number(rawValue))
                      : Number(rawValue.toFixed(3));
                  return (
                    <label
                      key={field.key}
                      className="table-layout-editor-panel__label table-layout-editor-panel__label--inline"
                    >
                      {opts.label ?? field.key}
                      <div className="table-layout-editor-panel__seat-override-input">
                        <input
                          type="range"
                          min={opts.min ?? 0}
                          max={opts.max ?? 360}
                          step={opts.step ?? 1}
                          value={displayValue}
                          onChange={(event) =>
                            handleSeatPlayerOverride(
                              selectedSeat.id,
                              field.key as SerializablePlayerUIKey,
                              Number(event.target.value),
                            )
                          }
                        />
                        <input
                          type="number"
                          min={opts.min ?? 0}
                          max={opts.max ?? 360}
                          step={opts.step ?? 1}
                          value={overrideValue ?? ''}
                          placeholder={defaultValue.toString()}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            if (nextValue === '') {
                              handleSeatPlayerOverride(selectedSeat.id, field.key as SerializablePlayerUIKey, '');
                            } else {
                              const numericValue = Number(nextValue);
                              if (Number.isNaN(numericValue)) {
                                handleSeatPlayerOverride(selectedSeat.id, field.key as SerializablePlayerUIKey, '');
                              } else {
                                handleSeatPlayerOverride(
                                  selectedSeat.id,
                                  field.key as SerializablePlayerUIKey,
                                  numericValue,
                                );
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="table-layout-editor-panel__seat-override-reset"
                          onClick={() => handleSeatPlayerOverrideReset(selectedSeat.id, field.key as SerializablePlayerUIKey)}
                          title="Reset to default"
                        >
                          ↺
                        </button>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="table-layout-editor-panel__seat-hint">Select a seat to edit overrides.</p>
          )}
        </div>

        <div className="table-layout-editor-panel__section">
          <button type="button" onClick={handleSavePreset}>
            Save Preset
          </button>
        </div>

        {showExport ? (
          <div className="table-layout-editor-panel__section">
            <textarea
              aria-label="Exported preset JSON"
              spellCheck={false}
              readOnly
              value={exportedPreset}
              rows={12}
              className="table-layout-editor-panel__textarea"
              onFocus={(event) => event.currentTarget.select()}
            />
          </div>
        ) : null}
      </div>

      <SeatHandlesOverlay
        containerRef={containerRef}
        seats={seats}
        onSeatSelect={handleSeatSelect}
        onSeatUpdate={handleSeatUpdate}
      />
    </>
  );
};

interface SeatHandlesOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  seats: SeatLayout[];
  onSeatSelect: (seatId: number) => void;
  onSeatUpdate: (seatId: number, updates: Partial<SeatLayout>) => void;
}

const SeatHandlesOverlay: React.FC<SeatHandlesOverlayProps> = ({
  containerRef,
  seats,
  onSeatSelect,
  onSeatUpdate,
}) => {
  const dragState = useRef<{
    seatId: number;
    pointerId: number;
  } | null>(null);

  const getNormalizedPosition = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) {
        return { x: 0.5, y: 0.5 };
      }
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      return {
        x: Math.min(1, Math.max(0, x)),
        y: Math.min(1, Math.max(0, y)),
      };
    },
    [containerRef],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, seat: SeatLayout) => {
      event.preventDefault();
      onSeatSelect(seat.id);
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);
      dragState.current = {
        seatId: seat.id,
        pointerId: event.pointerId,
      };
      const position = getNormalizedPosition(event.clientX, event.clientY);
      onSeatUpdate(seat.id, { position });
    },
    [getNormalizedPosition, onSeatSelect, onSeatUpdate],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const active = dragState.current;
      if (!active || active.pointerId !== event.pointerId) {
        return;
      }
      const position = getNormalizedPosition(event.clientX, event.clientY);
      onSeatUpdate(active.seatId, { position });
    },
    [getNormalizedPosition, onSeatUpdate],
  );

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const active = dragState.current;
    if (!active || active.pointerId !== event.pointerId) {
      return;
    }
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragState.current = null;
  }, []);

  return (
    <div className="table-layout-editor-overlay">
      {seats.map((seat) => (
        <SeatHandle
          key={seat.id}
          seat={seat}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      ))}
    </div>
  );
};

interface SeatHandleProps {
  seat: SeatLayout;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>, seat: SeatLayout) => void;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => void;
}

const SeatHandle: React.FC<SeatHandleProps> = ({
  seat,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--seat-left', `${(seat.position?.x ?? 0.5) * 100}%`);
    node.style.setProperty('--seat-top', `${(seat.position?.y ?? 0.5) * 100}%`);
  }, [seat.position?.x, seat.position?.y]);

  return (
    <div
      ref={ref}
      className="table-layout-editor-handle"
      onPointerDown={(event) => onPointerDown(event, seat)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <span>{seat.label ?? `Seat ${seat.id}`}</span>
    </div>
  );
};

export default TableLayoutEditor;

