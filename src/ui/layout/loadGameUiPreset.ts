import {
  PLAYER_UI_SERIALIZABLE_FIELDS,
  sanitizePlayerUIOverrides,
  type SerializablePlayerUIKey,
} from '@ui/components/GameScreen/PlayerUI';
import type {
  SerializedGameAsset,
  SerializedLayoutPreset,
  SerializedSeatLayout,
} from './gameUiTypes';
import type { GameAsset, LayoutPreset, SeatLayout, TableShapeSettings } from './tableLayoutTypes';
import { getGameAsset, setGameAsset } from './tableLayoutStore';
import { logInfo, logWarn, logError } from '@lib/logging';

let loadPromise: Promise<void> | null = null;
let loadedGameId: string | null = null;

const GAME_UI_BASE_PATH = '/GameModeConfig';
const FALLBACK_DEFAULT_PLAYER_COUNT = 4;
const DEFAULT_SEAT_SCALE = 0.5;
const SHOULD_PERSIST_DEFAULT_ASSET =
  typeof import.meta !== 'undefined' &&
  import.meta.env?.DEV &&
  import.meta.env?.VITE_ENABLE_DEV_LAYOUT_SAVE !== 'false';

const toPascalCase = (value: string): string =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const buildCandidateFilenames = (gameKey: string): string[] => {
  const trimmed = gameKey.trim();
  if (!trimmed) {
    return [];
  }
  const lower = trimmed.toLowerCase();
  const pascal = toPascalCase(trimmed);
  const candidates = new Set<string>();
  candidates.add(`${trimmed}.json`);
  if (pascal && pascal.toLowerCase() !== lower) {
    candidates.add(`${pascal}.json`);
  }
  if (pascal) {
    if (!pascal.toLowerCase().endsWith('uiconfig')) {
      candidates.add(`${pascal}UIConfig.json`);
    }
    candidates.add(`${pascal}UiConfig.json`);
  }
  return Array.from(candidates);
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const cloneSeat = (seat: SeatLayout): SeatLayout => ({
  ...seat,
  position: { ...seat.position },
  playerOverrides: seat.playerOverrides ? { ...seat.playerOverrides } : undefined,
});

const generateSeatRing = (count: number): SeatLayout[] => {
  const seats: SeatLayout[] = [];
  const radiusX = 0.38;
  const radiusY = 0.34;
  const angleStep = (2 * Math.PI) / count;
  const baseAngle = Math.PI / 2;

  for (let index = 0; index < count; index += 1) {
    const angle = baseAngle + angleStep * index;
    const x = 0.5 + Math.cos(angle) * radiusX;
    const y = 0.5 + Math.sin(angle) * radiusY;
    seats.push({
      id: index,
      label: `p${index + 1}`,
      position: {
        x: Number(clamp01(x).toFixed(4)),
        y: Number(clamp01(y).toFixed(4)),
      },
      rotation: 0,
      scale: DEFAULT_SEAT_SCALE,
    });
  }

  return seats;
};

const defaultTableShape: TableShapeSettings = {
  width: 960,
  height: 560,
  offsetX: 0,
  offsetY: -78,
  curvature: 0.88,
  feltInset: -8,
};

const generateDefaultPreset = (count: number): LayoutPreset => ({
  table: { ...defaultTableShape },
  seats: generateSeatRing(count),
});

export const createDefaultGameAsset = (gameId: string): GameAsset => {
  const now = new Date().toISOString();
  const counts = Array.from({ length: 9 }, (_, index) => index + 2);
  const presets = Object.fromEntries(counts.map((count) => [String(count), generateDefaultPreset(count)]));

  return {
    metadata: {
      gameId,
      schemaVersion: 1,
      displayName: toPascalCase(gameId) || gameId,
      createdAt: now,
      updatedAt: now,
    },
    layout: {
      defaultPlayerCount: FALLBACK_DEFAULT_PLAYER_COUNT,
      presets,
      playerUiDefaults: undefined,
      views: undefined,
    },
    gameplay: {},
    extensions: {},
  };
};

const normalizeSeat = (input: SerializedSeatLayout | undefined, fallback?: SeatLayout): SeatLayout => {
  const fallbackSeat = fallback ? cloneSeat(fallback) : undefined;
  const id = Number.isFinite(input?.id) ? Number(input?.id) : fallbackSeat?.id ?? 0;
  const position = {
    x: clamp01(
      Number.isFinite(input?.position?.x) ? Number(input?.position?.x) : fallbackSeat?.position?.x ?? 0.5,
    ),
    y: clamp01(
      Number.isFinite(input?.position?.y) ? Number(input?.position?.y) : fallbackSeat?.position?.y ?? 0.5,
    ),
  };

  const seat: SeatLayout = {
    id,
    label: input?.label ?? fallbackSeat?.label ?? `p${id + 1}`,
    position: {
      x: Number(position.x.toFixed(4)),
      y: Number(position.y.toFixed(4)),
    },
    rotation: Number.isFinite(input?.rotation)
      ? Number(input?.rotation)
      : fallbackSeat?.rotation ?? 0,
    ...(Number.isFinite(input?.scale)
      ? { scale: Number(input?.scale) }
      : fallbackSeat?.scale !== undefined
        ? { scale: fallbackSeat.scale }
        : { scale: DEFAULT_SEAT_SCALE }),
  };

  const overrides: Partial<Record<SerializablePlayerUIKey, number>> = {};
  PLAYER_UI_SERIALIZABLE_FIELDS.forEach(({ key }) => {
    const normalizedKey = key as SerializablePlayerUIKey;
    const incomingValue = input && typeof input[normalizedKey] === 'number' ? Number(input[normalizedKey]) : undefined;
    const fallbackValue =
      fallbackSeat && typeof fallbackSeat.playerOverrides?.[normalizedKey] === 'number'
        ? Number(fallbackSeat.playerOverrides?.[normalizedKey])
        : undefined;
    const resolved = incomingValue ?? fallbackValue;
    if (resolved !== undefined && Number.isFinite(resolved)) {
      overrides[normalizedKey] = resolved;
    }
  });

  const sanitizedOverrides = sanitizePlayerUIOverrides(overrides);
  if (sanitizedOverrides) {
    seat.playerOverrides = sanitizedOverrides;
  }

  return seat;
};

const normalizePreset = (
  preset: SerializedLayoutPreset | undefined,
  fallback: LayoutPreset,
): LayoutPreset => {
  if (!preset) {
    return {
      table: { ...(fallback.table ?? {}) },
      seats: fallback.seats.map((seat) => cloneSeat(seat)),
    };
  }

  const fallbackSeatsById = new Map<number, SeatLayout>();
  fallback.seats.forEach((seat) => {
    fallbackSeatsById.set(seat.id, seat);
  });

  const seats: SeatLayout[] = [];
  const serializedSeats = preset.seats ?? [];

  serializedSeats.forEach((seatInput) => {
    const fallbackSeat = fallbackSeatsById.get(seatInput.id);
    const normalizedSeat = normalizeSeat(seatInput, fallbackSeat);
    seats.push(normalizedSeat);
    fallbackSeatsById.delete(normalizedSeat.id);
  });

  if (seats.length === 0) {
    seats.push(...fallback.seats.map((seat) => cloneSeat(seat)));
  } else {
    fallbackSeatsById.forEach((seat) => {
      seats.push(cloneSeat(seat));
    });
  }

  seats.sort((a, b) => a.id - b.id);

  return {
    table: {
      ...(fallback.table ?? {}),
      ...(preset.table ?? {}),
    },
    seats,
  };
};

const hydrateSerializedAsset = (serialized: SerializedGameAsset | null, gameId: string): GameAsset => {
  const fallbackAsset = createDefaultGameAsset(gameId);
  if (!serialized) {
    return fallbackAsset;
  }

  const metadata = {
    ...fallbackAsset.metadata,
    ...serialized.metadata,
    gameId: serialized.metadata?.gameId ?? fallbackAsset.metadata.gameId,
    schemaVersion: serialized.metadata?.schemaVersion ?? fallbackAsset.metadata.schemaVersion,
    updatedAt: serialized.metadata?.updatedAt ?? fallbackAsset.metadata.updatedAt ?? new Date().toISOString(),
    createdAt: serialized.metadata?.createdAt ?? fallbackAsset.metadata.createdAt ?? new Date().toISOString(),
  };

  const sourcePresets = serialized.layout?.presets ?? {};
  const presetEntries = new Set<string>([...Object.keys(fallbackAsset.layout.presets), ...Object.keys(sourcePresets)]);

  const presets = Object.fromEntries(
    Array.from(presetEntries).map((countKey) => {
      const numericCount = Number.parseInt(countKey, 10);
      const fallbackPreset =
        fallbackAsset.layout.presets[countKey] ?? generateDefaultPreset(Number.isNaN(numericCount) ? 2 : numericCount);
      const serializedPreset = sourcePresets[countKey];
      return [countKey, normalizePreset(serializedPreset, fallbackPreset)];
    }),
  );

  const playerUiDefaults = serialized.layout?.playerUiDefaults
    ? {
        ...(fallbackAsset.layout.playerUiDefaults ?? {}),
        ...serialized.layout.playerUiDefaults,
      }
    : fallbackAsset.layout.playerUiDefaults;

  const views = serialized.layout?.views
    ? Object.fromEntries(
        Object.entries(serialized.layout.views).map(([viewId, presetInput]) => {
          const fallbackView =
            fallbackAsset.layout.views?.[viewId] ??
            generateDefaultPreset(fallbackAsset.layout.defaultPlayerCount ?? FALLBACK_DEFAULT_PLAYER_COUNT);
          return [viewId, normalizePreset(presetInput, fallbackView)];
        }),
      )
    : fallbackAsset.layout.views;

  return {
    metadata,
    layout: {
      defaultPlayerCount:
        serialized.layout?.defaultPlayerCount ?? fallbackAsset.layout.defaultPlayerCount ?? FALLBACK_DEFAULT_PLAYER_COUNT,
      presets,
      playerUiDefaults,
      views,
    },
    gameplay: serialized.gameplay ?? fallbackAsset.gameplay,
    extensions: serialized.extensions ?? fallbackAsset.extensions,
  };
};

async function fetchSerializedAsset(gameId: string): Promise<SerializedGameAsset | null> {
  const candidates = buildCandidateFilenames(gameId);
  for (const candidate of candidates) {
    try {
      const response = await fetch(`${GAME_UI_BASE_PATH}/${candidate}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to load ${candidate}: ${response.statusText}`);
      }
      return (await response.json()) as SerializedGameAsset;
    } catch (error) {
      logWarn('ASSETS', '[GameAsset] Unable to fetch config', candidate, error);
    }
  }
  return null;
}

export async function ensureGameAssetLoaded(gameId: string): Promise<void> {
  const currentAsset = getGameAsset();
  if (currentAsset && loadedGameId === gameId) {
    return;
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      const serialized = await fetchSerializedAsset(gameId);
      const wasMissing = !serialized;
      const asset = hydrateSerializedAsset(serialized, serialized?.metadata?.gameId ?? gameId);
      setGameAsset(asset);
      loadedGameId = asset.metadata.gameId;
      if (wasMissing && SHOULD_PERSIST_DEFAULT_ASSET) {
        logInfo('ASSETS', '[GameAsset] No config found – generating defaults', asset.metadata.gameId);
        await persistGameAsset(asset);
      } else if (wasMissing) {
        logWarn('ASSETS', '[GameAsset] Generated defaults (dev auto-save disabled)', asset.metadata.gameId);
      }
      loadPromise = null;
    })();
  }

  await loadPromise;
}

async function persistGameAsset(asset: GameAsset): Promise<void> {
  try {
    const response = await fetch('/__dev/api/save-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: asset.metadata.gameId, asset }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    logInfo('ASSETS', '[GameAsset] Created default config', asset.metadata.gameId);
  } catch (error) {
    logError('ASSETS', '[GameAsset] Failed to persist asset', asset.metadata.gameId, error);
  }
}

export async function loadGameUiPreset(gameId: string): Promise<GameAsset> {
  await ensureGameAssetLoaded(gameId);
  const asset = getGameAsset();
  if (!asset) {
    throw new Error(`Failed to load game asset for ${gameId}`);
  }
  return asset;
}

