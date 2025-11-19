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

// Game screen core components
export { default as GameScreen } from './GameScreen/GameScreen'
export { default as GameHUD } from './GameScreen/GameHUD'
export { default as GameBackground } from './GameScreen/GameBackground'
export { default as PlayersOnTable } from './GameScreen/PlayersOnTable'
export { default as PlayerUI } from './GameScreen/PlayerUI'
export { default as TableLayoutEditor } from './GameScreen/TableLayoutEditor'
export { default as CardInHand } from './GameScreen/CardInHand'
export * from './GameScreen/CardInHand.types'
export * from './GameScreen/CardInHand.constants'

// Header
export { GameHeader } from './Header/GameHeader'
export { ProfilePictureModal } from './Header/ProfilePictureModal'

// Loading states
export { AssetLoadingScreen } from './Loading/AssetLoadingScreen'
export { AppLoadingScreen } from './Loading/GameLoadingScreen'

// Welcome folder deleted - use Home/Claim instead

// Home (main welcome/store page)
export { Home } from './Home/Home'
// GameCard moved to Common - use GameCard from Common instead
export type { GameInfo } from './Home/Home'

// Games Pages (all game-specific pages)
export {
  ClaimPage,
  ClaimGameModeSelector,
  ClaimGameInfoTabs,
  ThreeCardBragPage,
  ThreeCardBragGameModeSelector,
  ThreeCardBragGameInfoTabs,
} from './GamesPage'

// Common/Shared components
export { FeaturedGameCarousel } from './Common/FeaturedGameCarousel'
export { ComingSoonCarousel } from './Common/ComingSoonCarousel'
export { GameCard } from './Common/GameCard'
export { GameBadgesOverlay } from './Common/GameBadgesOverlay'
export type { GameBadgesOverlayProps } from './Common/GameBadgesOverlay'

// Game Store (deleted - use Home instead)

