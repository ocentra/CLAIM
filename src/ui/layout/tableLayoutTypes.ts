import type { PlayerUIConfig, SerializablePlayerUIKey } from '../components/GameScreen/PlayerUI';

type PlayerUIOverrideMap = Partial<Record<SerializablePlayerUIKey, number>>;

export interface SeatPosition {
  /**
   * Normalized position relative to the table container.
   * 0 represents the far left/top, 1 represents the far right/bottom.
   */
  x: number;
  y: number;
}

export interface SeatLayout {
  /**
   * Stable identifier for the seat (e.g. "bottom", "topRight").
   */
  id: number;
  /**
   * Optional human readable label surfaced in the editor UI.
   */
  label?: string;
  /**
   * Normalized position of the seat in the table container space.
   */
  position: SeatPosition;
  /**
   * Rotation in degrees applied to the rendered PlayerUI container.
   * 0deg faces "up" (towards positive Y axis / table centre),
   * positive values rotate clockwise.
   */
  rotation: number;
  /**
   * Optional per-seat scale multiplier – useful for tightly packed layouts.
   */
  scale?: number;
  /**
   * Optional overrides applied directly to the PlayerUI component.
   */
  playerOverrides?: PlayerUIOverrideMap;
}

export interface TableShapeSettings {
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
  curvature?: number;
  rimThickness?: number;
  rimColor?: string;
  rimGlowColor?: string;
  rimGlowIntensity?: number;
  rimGlowSpread?: number;
  rimGlowThickness?: number;
  rimGlowBlendMode?: string;
  innerRimThickness?: number;
  innerRimColor?: string;
  innerRimTexture?: string;
  innerRimTextureBlendMode?: string;
  innerRimTextureOpacity?: number;
  feltInner?: string;
  feltOuter?: string;
  feltInset?: number;
  emblemSize?: number;
  emblemInnerColor?: string;
  emblemOuterColor?: string;
  emblemBlendMode?: string;
}

export interface LayoutPreset {
  table: TableShapeSettings;
  seats: SeatLayout[];
}

export interface GameAssetMetadata {
  gameId: string;
  schemaVersion: number;
  displayName?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameAssetLayout {
  defaultPlayerCount: number;
  presets: Record<string, LayoutPreset>;
  playerUiDefaults?: Partial<PlayerUIConfig>;
  views?: Record<string, LayoutPreset>;
}

export interface GameAssetGameplay {
  prompts?: unknown[];
  rules?: unknown;
  [key: string]: unknown;
}

export interface GameAsset {
  metadata: GameAssetMetadata;
  layout: GameAssetLayout;
  gameplay?: GameAssetGameplay;
  extensions?: Record<string, unknown>;
}

export interface TableLayoutState {
  playerCount: number;
  table: TableShapeSettings;
  seats: SeatLayout[];
  selectedSeatId: number | null;
  isEditorVisible: boolean;
  gameId: string | null;
  asset: GameAsset | null;
}

