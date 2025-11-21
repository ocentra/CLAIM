# UI Structure & Flow Map

**Purpose:** Map the entire application flow from first load to current state, identify organization issues, and plan fixes.

**Date:** 2025-01-XX

---

## 📍 CURRENT FILE STRUCTURE (THE MESS)

```
src/
├── App.tsx                          ← Root entry (BrowserRouter wrapper)
│   └── Routes:
│       ├── /api/logs/query         → LogsQueryPage
│       ├── /api/logs/stats         → LogsQueryPage
│       └── /*                      → MainApp
│
├── components/
│   └── MainApp.tsx                  ← Main app router
│       ├── AuthenticatedApp        ← Shows AuthScreen
│       └── GameScreen (if workOngameScene=true)
│
├── pages/                           ⚠️ INCONSISTENT LOCATION #1
│   └── LogsQueryPage.tsx           ← Dev tool (not a real page)
│
├── ui/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthScreen.tsx      ← ACTS AS ROUTER! (not just auth)
│   │   │       ├── LoginDialog     (if !authenticated)
│   │   │       └── Routes to:
│   │   │           ├── Home        (default)
│   │   │           ├── ClaimPage
│   │   │           ├── ThreeCardBragPage
│   │   │           ├── SettingsPage
│   │   │           └── Poker (uses ClaimPage)
│   │   │
│   │   ├── Home/                   ⚠️ INCONSISTENT LOCATION #2
│   │   │   └── Home.tsx            ← Home page (but in components!)
│   │   │
│   │   ├── GamesPage/              ⚠️ INCONSISTENT LOCATION #3
│   │   │   ├── Claim/
│   │   │   │   ├── ClaimPage.tsx   ← Game selection page
│   │   │   │   ├── GameModeSelector.tsx
│   │   │   │   └── GameInfoTabs.tsx
│   │   │   └── ThreeCardBrag/
│   │   │       ├── ThreeCardBragPage.tsx
│   │   │       ├── GameModeSelector.tsx
│   │   │       └── GameInfoTabs.tsx
│   │   │
│   │   └── GameScreen/             ← Actual game playing screen
│   │       └── GameScreen.tsx      ⚠️ NOT CONNECTED TO MATCH FLOW!
│   │
│   └── pages/                      ⚠️ INCONSISTENT LOCATION #4
│       └── Settings/
│           └── SettingsPage.tsx
```

---

## 🔄 APPLICATION FLOW (FROM FIRST LOAD)

### 1. **Initial Load**
```
App.tsx (BrowserRouter)
  ↓
MainApp.tsx
  ↓
AuthenticatedApp
  ↓
AuthScreen (checks isAuthenticated)
```

### 2. **Not Authenticated**
```
AuthScreen
  ↓
LoginDialog
  ├── Email/Password
  ├── Facebook/Google
  ├── Guest
  └── Wallet (Phantom/MetaMask/Coinbase)
```

### 3. **Authenticated - Routing Logic**
```
AuthScreen (acts as router via currentScreen state)
  │
  ├── currentScreen = 'home' → Home.tsx
  │   ├── FeaturedGameCarousel
  │   ├── ComingSoonCarousel
  │   └── AboutUsSection
  │
  ├── currentScreen = 'claim' → ClaimPage.tsx
  │   ├── GameHeader
  │   ├── GameModeSelector
  │   │   ├── Single Player button → handlePlaySinglePlayer()
  │   │   │   └── console.log('Starting...') ⚠️ TODO!
  │   │   └── Multiplayer button → handlePlayMultiplayer()
  │   │       └── console.log('Starting...') ⚠️ TODO!
  │   └── GameInfoTabs
  │
  ├── currentScreen = 'threecardbrag' → ThreeCardBragPage.tsx
  │   └── (same structure as ClaimPage)
  │
  ├── currentScreen = 'poker' → ClaimPage.tsx (with gameName="Poker")
  │
  └── currentScreen = 'settings' → SettingsPage.tsx
```

### 4. **Navigation Mechanism**
- **EventBus** (`ShowScreenEvent`) - publishes screen changes
- **URL manipulation** (`window.history.pushState`) - updates URL
- **AuthScreen** listens to events and updates `currentScreen` state
- **Browser back/forward** handled via `popstate` event

---

## ❌ WHAT'S MISSING / BROKEN

### 1. **No Match Creation Flow**
- `handlePlaySinglePlayer()` → `console.log()` only
- `handlePlayMultiplayer()` → `console.log()` only
- **Missing:** Form to configure match
- **Missing:** Call to `GameClient.createMatch()`
- **Missing:** Match lobby/waiting room
- **Missing:** Connection to `GameScreen`

### 2. **GameScreen Not Connected**
- `GameScreen.tsx` exists but is isolated
- Only accessible via `workOngameScene` flag in `MainApp.tsx`
- No way to navigate from `ClaimPage` → `GameScreen`
- No match ID passed to `GameScreen`

### 3. **Inconsistent File Organization**
- **Pages scattered:**
  - `src/pages/LogsQueryPage.tsx` (root level)
  - `src/ui/pages/Settings/` (ui/pages)
  - `src/ui/components/Home/` (should be in pages)
  - `src/ui/components/GamesPage/` (should be in pages)

- **Naming confusion:**
  - `GamesPage/` folder contains pages, not components
  - `Home/` is a page, not a component

### 4. **Routing System Issues**
- **Dual routing systems:**
  - React Router (only for `/api/logs/*`)
  - EventBus + AuthScreen (for everything else)
  
- **No proper route definitions:**
  - Routes hardcoded in `AuthScreen.tsx`
  - Screen names as strings (`'claim'`, `'home'`, etc.)
  - No type safety for routes

---

## 🎯 PROPOSED CLEAN STRUCTURE

```
src/
├── App.tsx                          ← Root (BrowserRouter)
│
├── ui/
│   ├── pages/                       ← ALL PAGES HERE (unified)
│   │   ├── Home/
│   │   │   └── HomePage.tsx
│   │   ├── Settings/
│   │   │   └── SettingsPage.tsx
│   │   ├── games/                   ← Game pages
│   │   │   ├── Claim/
│   │   │   │   ├── ClaimGamePage.tsx      ← Game selection/config page
│   │   │   │   └── play/
│   │   │   │       └── GameScreenPage.tsx ← Claim's game screen (uses reusable components)
│   │   │   └── ThreeCardBrag/
│   │   │       ├── ThreeCardBragGamePage.tsx
│   │   │       └── play/
│   │   │           └── GameScreenPage.tsx ← ThreeCardBrag's game screen
│   │   └── match/                   ← Match flow pages (NEW)
│   │       ├── CreateMatchPage.tsx  ← Free match creation
│   │       ├── JoinMatchPage.tsx    ← Browse/join matches
│   │       └── MatchLobbyPage.tsx   ← Waiting room
│   │
│   ├── components/                  ← REUSABLE COMPONENTS ONLY
│   │   ├── games/                   ← Game-specific UI components
│   │   │   ├── Claim/
│   │   │   │   ├── GameModeSelector.tsx  ← Used by ClaimGamePage
│   │   │   │   └── GameInfoTabs.tsx
│   │   │   └── ThreeCardBrag/
│   │   │       ├── GameModeSelector.tsx
│   │   │       └── GameInfoTabs.tsx
│   │   ├── GameScreen/              ← REUSABLE game playing components
│   │   │   └── CardGameScreen/      ← Card game components (reusable)
│   │   │       ├── CardGameComponents/
│   │   │       │   ├── GameBackground.tsx
│   │   │       │   ├── CardInHand.tsx
│   │   │       │   ├── CenterTableSvg.tsx
│   │   │       │   └── ...
│   │   │       ├── GameHUD.tsx
│   │   │       ├── PlayersOnTable.tsx
│   │   │       └── PlayerUI.tsx
│   │   ├── match/                   ← Match components (NEW)
│   │   │   ├── MatchCreationForm.tsx
│   │   │   ├── MatchList.tsx
│   │   │   └── MatchLobby.tsx
│   │
│   └── layout/                      ← Layout components
│       ├── GameHeader.tsx
│       └── GameFooter.tsx
│
└── pages/                            ← REMOVE (move to ui/pages)
    └── LogsQueryPage.tsx             ← Move to ui/pages/dev/
```

---

## 🔧 FIXES NEEDED

### Phase 1: Organize Structure ✅ **COMPLETE**
1. ✅ Move `Home.tsx` → `ui/pages/Home/HomePage.tsx` **DONE**
2. ✅ Move `GamesPage/Claim/ClaimPage.tsx` → `ui/pages/games/Claim/ClaimGamePage.tsx` **DONE**
3. ✅ Move `GamesPage/ThreeCardBrag/` → `ui/pages/games/ThreeCardBrag/` **DONE**
4. ✅ Move `pages/LogsQueryPage.tsx` → `ui/pages/dev/LogsQueryPage.tsx` **DONE**
5. ✅ Keep `ui/pages/Settings/` as is (already correct) **DONE**

**Status:** ✅ All files organized. Old locations deleted. New structure in place.

### Phase 2: Fix Routing ⚠️ **IN PROGRESS**
1. ⚠️ Replace EventBus routing with React Router **INCOMPLETE** - Still using EventBus
2. ⚠️ Define proper routes in `App.tsx` **INCOMPLETE** - Only has `/api/logs/*` routes
3. ⚠️ Remove routing logic from `AuthScreen.tsx` **INCOMPLETE** - Still routing via state
4. ⚠️ Make `AuthScreen` just handle auth state **INCOMPLETE** - Still acts as router

**Status:** ⚠️ File structure done, but routing system not migrated yet.
- `AuthScreen.tsx` still uses `currentScreen` state and EventBus for navigation
- `App.tsx` only has routes for `/api/logs/*`, everything else goes to `MainApp`
- Need to add React Router routes for: `/`, `/claim`, `/threecardbrag`, `/poker`, `/settings`

### Phase 3: Build Match Flow (Free Matches First) ❌ **NOT STARTED**
1. ❌ Create `CreateMatchPage.tsx` (form for match config) **NOT CREATED**
2. ❌ Create `MatchLobbyPage.tsx` (waiting room) **NOT CREATED**
3. ❌ Connect `GameModeSelector` → `CreateMatchPage` **NOT IMPLEMENTED**
4. ❌ Connect `CreateMatchPage` → `MatchLobbyPage` **NOT IMPLEMENTED**
5. ❌ Connect `MatchLobbyPage` → `GameScreen` (when match starts) **NOT IMPLEMENTED**

**Status:** ❌ Match flow doesn't exist yet.
- `handlePlaySinglePlayer()` and `handlePlayMultiplayer()` still just `console.log()`
- No match creation/lobby pages created
- `GameScreen` exists but not connected to match flow

### Phase 4: Add Paid Match Features ❌ **NOT STARTED**
1. ❌ Add payment method selection to `CreateMatchPage` **NOT IMPLEMENTED**
2. ❌ Add deposit/withdrawal pages **NOT IMPLEMENTED**
3. ❌ Add prize pool display in `MatchLobbyPage` **NOT IMPLEMENTED**

**Status:** ❌ Depends on Phase 3 completion.

---

## 📊 CURRENT STATE SUMMARY

| Component | Location | Status | Issue |
|-----------|----------|--------|-------|
| Home | `ui/pages/Home/HomePage.tsx` | ✅ Works | ✅ Correct location |
| ClaimPage | `ui/pages/games/Claim/ClaimGamePage.tsx` | ✅ Works | ✅ Correct location, ❌ No match flow |
| ThreeCardBragPage | `ui/pages/games/ThreeCardBrag/ThreeCardBragGamePage.tsx` | ✅ Works | ✅ Correct location, ❌ No match flow |
| SettingsPage | `ui/pages/Settings/SettingsPage.tsx` | ✅ Works | ✅ Correct location |
| LogsQueryPage | `ui/pages/dev/LogsQueryPage.tsx` | ✅ Works | ✅ Correct location |
| GameScreen | `ui/components/GameScreen/CardGameScreen/GameScreen.tsx` | ✅ Exists | ❌ Not connected to match flow |
| AuthScreen | `ui/components/Auth/AuthScreen.tsx` | ✅ Works | ⚠️ Still doing routing (should be removed in Phase 2) |

---

## 🚀 NEXT STEPS

1. ✅ **COMPLETE:** Organize file structure (Phase 1)
2. ⚠️ **IN PROGRESS:** Fix routing system (Phase 2)
   - Replace EventBus routing with React Router in `App.tsx`
   - Remove routing logic from `AuthScreen.tsx`
   - Add routes: `/`, `/claim`, `/threecardbrag`, `/poker`, `/settings`
3. ❌ **TODO:** Build free match flow (Phase 3)
4. ❌ **TODO:** Add paid match features (Phase 4)

---

---

## 🏗️ ARCHITECTURE PATTERN

### Component Reusability Strategy

**Reusable Components** (`ui/components/GameScreen/CardGameScreen/`):
- ✅ Contains generic card game components (GameBackground, CardInHand, GameHUD, etc.)
- ✅ Can be imported and used by any card-based game
- ✅ Provides consistent UI/UX across games

**Game-Specific Pages** (`ui/pages/games/[Game]/play/GameScreenPage.tsx`):
- ✅ Each game has its own `play/GameScreenPage.tsx`
- ✅ Imports and composes reusable components from `CardGameScreen/`
- ✅ Can customize, extend, or override components as needed for game-specific features
- ✅ Example: `ClaimGameScreenPage` uses CardGameScreen components but with Claim-specific game mode config

**Example Flow:**
```
ClaimGamePage (selection page)
  ↓ user clicks "Play"
  → Navigate to /games/claim/play
  → ClaimGameScreenPage (imports CardGameScreen components)
  → Renders game with Claim-specific configuration
```

**Status:** Phase 1 complete ✅ | Phase 2 in progress ⚠️ | Phase 3-4 pending ❌

