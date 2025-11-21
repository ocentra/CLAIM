// Game Screen - Reusable game screen components
// Currently focused on card games, but can be extended for other game types

// Card Game Screen (main implementation) - exports everything
export * from './CardGameScreen';

// Re-export individual components for convenience
export { GameScreen, GameScreenComponent } from './CardGameScreen';
export { default as GameHUD } from './CardGameScreen/GameHUD';
export { default as PlayersOnTable } from './CardGameScreen/PlayersOnTable';
export { default as PlayerUI } from './CardGameScreen/PlayerUI';

// Card Game Components (reusable UI components)
export {
  GameBackground,
  CardInHand,
  CenterTableSvg,
  CARD_IN_HAND_DEFAULTS,
} from './CardGameScreen/CardGameComponents';
export type {
  AnchorValue,
  AlignAxis,
  AnchorPoint as CardInHandAnchorPoint,
  CardInHandProps,
  EmblemStyle,
  CenterTableAnchorPoint,
  CenterTableSVGProps,
} from './CardGameScreen/CardGameComponents';

// Card Game Editor
export { TableLayoutEditor } from './CardGameScreen/CardGameEditor';

