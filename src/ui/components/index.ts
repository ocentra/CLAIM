// Auth
export { AuthScreen } from './Auth/AuthScreen'
export { default as LoginDialog } from './Auth/LoginDialog'

// Background
export { default as DynamicBackground3D } from './Background/DynamicBackground3D'
export type { RotationControlAPI } from './Background/DynamicBackground3D'

// Error handling
export { ErrorScreen } from './Error/ErrorScreen'

// Footer
export { GameFooter } from './Footer/GameFooter'

// Game screen core components (via clean index exports)
export * from './GameScreen'
// Also export individual components for backward compatibility
export { GameScreen, GameScreenComponent, GameHUD, PlayersOnTable, PlayerUI } from './GameScreen'
export { GameBackground, CardInHand, CenterTableSvg, TableLayoutEditor } from './GameScreen'
export type { PlayerUIProps, SerializablePlayerUIKey } from './GameScreen'
export { PLAYER_UI_SERIALIZABLE_KEYS, PLAYER_UI_SERIALIZABLE_FIELDS } from './GameScreen'

// Header
export { GameHeader } from './Header/GameHeader'
export { ProfilePictureModal } from './Header/ProfilePictureModal'

// Loading states
export { AssetLoadingScreen } from './Loading/AssetLoadingScreen'
export { AppLoadingScreen } from './Loading/GameLoadingScreen'

// Pages moved to ui/pages/ - import from there instead
// Home: @/ui/pages/Home
// Games: @/ui/pages/games

// Common/Shared components
export { FeaturedGameCarousel } from './Common/FeaturedGameCarousel'
export { ComingSoonCarousel } from './Common/ComingSoonCarousel'
export { GameCard } from './Common/GameCard'
export { GameBadgesOverlay } from './Common/GameBadgesOverlay'
export type { GameBadgesOverlayProps } from './Common/GameBadgesOverlay'

// Game Store (deleted - use Home instead)

