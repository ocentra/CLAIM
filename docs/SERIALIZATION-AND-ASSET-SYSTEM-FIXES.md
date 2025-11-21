# Serialization & Asset System Implementation - Session Summary

**Date**: November 21, 2024 (Updated: November 2025)
**Status**: Critical Fixes Complete ✅ | Using Vite 7 ✅ | Full Data-Driven System In Progress 🚧

---

## ⚠️ Vite 7 Configuration Note

**Current Setup:**
- Using Vite 7.2.4 (latest stable with Rolldown built-in)
- All TypeScript features working correctly (decorators, abstract classes)
- Vite config properly handles experimental decorators and class properties
- No Webpack migration needed - Vite is working well

**Key Fixes Applied:**
- Upgraded from Vite 6 to Vite 7 (Rolldown performance improvements)
- Removed deprecated `@babel/plugin-proposal-class-properties`
- Fixed `require.context` → `import.meta.glob` for Vite compatibility
- All bundler issues resolved

---



## What We Fixed Today

### 1. TypeScript Decorator Errors (77 Errors) ✅

**Problem**: All `@serializable` decorators were failing with error:
```
Unable to resolve signature of property decorator when called as an expression.
Argument of type 'CardAsset' is not assignable to parameter type '{ [key: string]: unknown; }'.
```

**Root Cause**:
- TypeScript experimental decorators require `any` type for target parameter
- Our decorator signature was too strict: `target: { [key: string | symbol]: unknown }`
- Classes without explicit index signatures couldn't use decorators
- Properties with definite assignment assertion (`property!: string`) have `undefined` initial values

**Fix Applied**: [`src/lib/serialization/Serializable.ts:109-146`](../src/lib/serialization/Serializable.ts#L109-L146)
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
export function serializable(options: SerializableOptions = {}): any {
  return function (
    target: any,
    propertyKey: string | symbol
  ): any {
    // Implementation...
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
```

**Result**: All 77 TypeScript errors resolved, decorators work with all class types.

---

### 2. Vite Configuration for Abstract Classes ✅

**Status**: 
- Vite 7 with Rolldown handles abstract classes correctly
- TypeScript compilation working as expected
- No special configuration needed

**Result**: Abstract classes work correctly with Vite 7.

---

### 3. Welcome Page Loading ALL Game Assets ❌ → ✅

**Problem**:
- Landing at `http://localhost:3000/` (welcome page) was loading card images, game assets
- `useAssetManager({ autoInitialize: true })` called on welcome screen
- Welcome page shouldn't know about game assets AT ALL

**Why This Happened**:
1. `MainApp.tsx` eagerly imported `GameScreen` from `@ui`
2. JavaScript eagerly evaluated all imports, including `CardInHand.tsx`
3. `CardInHand.tsx` had: `import defaultCardBack from '/Resources/Cards/Images/BackCard.png'`
4. Image loaded at module evaluation time, before React even rendered

**Fixes Applied**:

#### A. Removed Asset Manager from Welcome Screen
[`src/components/MainApp.tsx:26-28`](../src/components/MainApp.tsx#L26-L28)
```typescript
// REMOVED: useAssetManager({ autoInitialize: true })
// Assets should ONLY load when user enters actual game, not on welcome/auth screen
// This prevents loading card images and game assets when just showing login
```

#### B. Made GameScreen Lazy-Loaded
[`src/components/MainApp.tsx:11-13`](../src/components/MainApp.tsx#L11-L13)
```typescript
// Lazy-load GameScreen so it doesn't eagerly import game assets on welcome screen
// Assets will only load when user actually enters a game
const GameScreen = React.lazy(() =>
  import('@ui/components/GameScreen/CardGameScreen/GameScreen').then(m => ({ default: m.GameScreen }))
);
```

#### C. Removed Hardcoded Image Imports
[`src/ui/components/GameScreen/CardGameScreen/CardGameComponents/CardInHand.tsx:6-8`](../src/ui/components/GameScreen/CardGameScreen/CardGameComponents/CardInHand.tsx#L6-L8)
```typescript
// No more: import defaultCardBack from '/Resources/Cards/Images/BackCard.png'
// Now: const DEFAULT_CARD_BACK_PATH = '/Resources/Cards/Images/BackCard.png'
```

**Result**:
- Welcome page loads ZERO game assets ✅
- GameScreen only loads when user clicks "Play Game"
- Assets lazy-load on demand

---

### 4. Missing Card Asset Paths ✅

**Problem**:
- Code imported `@assets/Cards/BackCard.png`
- `src/assets/Cards/` folder was deleted (git status showed `D src/assets/Cards/*.png`)
- Actual images live in `public/Resources/Cards/Images/`

**Fix Applied**: Updated import paths to correct location
```typescript
// Before: import from '@assets/Cards/BackCard.png'
// After:  const path = '/Resources/Cards/Images/BackCard.png'
```

**Result**: Image paths resolve correctly to public assets.

---

## Current Architecture State

### ✅ What Works Now

1. **Serialization System**
   - `@serializable` decorator works on all classes
   - `ScriptableObject` base class for assets
   - `serialize()` / `deserialize()` with schema versioning
   - Metadata and GUID support

2. **Asset Loading**
   - `AssetPathResolver` - Unity-like path resolution
   - `AssetManager` - Load/cache system
   - Assets in `/Resources/` folder structure
   - `.asset` files contain metadata + references

3. **Lazy Loading**
   - Welcome page loads NO game assets
   - GameScreen lazy-loaded via `React.lazy()`
   - Assets load only when entering game

4. **TypeScript**
   - All type-check passes
   - All ESLint passes
   - Decorators work correctly

---

## The Vision: 100% Data-Driven System

### Current Reality (Temporary)
```typescript
// Still has some hardcoded content
<h1>Claim - The Classic Bluffing Card Game</h1>
<img src="/Resources/Cards/Images/BackCard.png" />
<p>Outsmart your opponents...</p>
```

### Target Reality (No Hardcoding)
```typescript
// Everything from .asset files
const pageAsset = useAsset<PageContentAsset>('/Resources/Pages/Games/Claim/info.asset');

return (
  <PageRenderer>
    <Hero
      title={pageAsset.hero.title}           // From asset
      image={pageAsset.hero.backgroundImage} // From asset
      buttons={pageAsset.hero.ctaButtons}    // From asset
    />
    {pageAsset.sections.map(section =>
      <SectionRenderer section={section} /> // From asset
    )}
  </PageRenderer>
);
```

---

## What We Need to Build

### Phase 1: Core Asset Types (NEXT PRIORITY) 🚧

Create these asset types and their `.asset` file schemas:

1. **PageContentAsset**
   - Purpose: Define page content (titles, descriptions, sections)
   - Location: `/Resources/Pages/`
   - Example: `/Resources/Pages/Games/Claim/info.asset`
   - Schema: See [DATA-DRIVEN-ASSET-SYSTEM.md](./ocentra/Architecture/DATA-DRIVEN-ASSET-SYSTEM.md)

2. **ImageAsset**
   - Purpose: Define image sources (desktop, mobile, alt text)
   - Location: `/Resources/UI/Images/`
   - Example: `/Resources/UI/Images/logo.asset`
   - Supports: Local paths, CDN URLs, responsive sources

3. **LayoutAsset**
   - Purpose: Define page layouts and component structure
   - Location: `/Resources/Layouts/`
   - Example: `/Resources/Layouts/welcomePage.asset`

4. **UIComponentAsset**
   - Purpose: Define UI component styles and behavior
   - Location: `/Resources/UI/`
   - Example: `/Resources/UI/Buttons/primary.asset`

### Phase 2: Asset Loading Hooks 🚧

Build React hooks for loading assets:

```typescript
// Hook for loading any asset
const asset = useAsset<T>(assetRef: string | AssetReference): T | null

// Hook for images with loading state
const image = useImage(assetRef: string | AssetReference): ImageAsset | null

// Hook for page content
const page = usePageContent(pageId: string): PageContentAsset | null

// Hook for layouts
const layout = useLayout(layoutId: string): LayoutAsset | null
```

### Phase 3: Generic Renderers 🚧

Build components that render from assets:

```typescript
// Renders any page from PageContentAsset
<PageRenderer pageAssetPath="/Resources/Pages/Games/Claim/info.asset" />

// Renders images from ImageAsset
<AssetImage assetRef={imageAssetRef} alt="..." />

// Renders sections from SectionAsset
<SectionRenderer section={sectionAsset} />

// Renders UI components from UIComponentAsset
<UIRenderer componentAsset={componentAsset} />
```

### Phase 4: Migration Path 🚧

Migrate existing pages to use assets:

1. **Claim Game Page** (`src/ui/pages/games/Claim/ClaimGamePage.tsx`)
   - Create `/Resources/Pages/Games/Claim/info.asset`
   - Replace hardcoded content with `usePageContent()`
   - Create `.asset` files for images

2. **Welcome Page** (`src/ui/pages/Home/`)
   - Create `/Resources/Pages/Welcome/welcome.asset`
   - Create carousel assets, feature assets
   - Replace all hardcoded text/images

3. **All Game Pages** (10-20 games)
   - Each game gets `/Resources/Pages/Games/{gameId}/info.asset`
   - Same `PageRenderer` component works for ALL games
   - Add new game = create new .asset file, ZERO code changes

### Phase 5: Editor & Tools 🚧

1. **ScriptableEditor Enhancement**
   - Visual editor for creating/editing `.asset` files
   - Form generation from asset schemas
   - Asset preview and validation

2. **Asset CLI Tools**
   - Generate `.asset` files from templates
   - Validate asset schemas
   - Migrate existing content to assets

3. **CDN Integration**
   - Upload assets to CDN
   - Update `.asset` paths to CDN URLs
   - Asset versioning and cache busting

---

## Directory Structure

### Current Structure
```
e:\ocentra-games/
├── public/
│   └── Resources/              # Asset storage (Unity-like)
│       ├── Cards/
│       │   ├── Images/         # Actual images
│       │   └── *.asset         # Card metadata
│       ├── GameMode/
│       │   └── CardGames/
│       │       ├── Claim/
│       │       │   └── claim.asset
│       │       └── ThreeCardBrag/
│       └── GameModeConfig/     # Legacy config files
│
├── src/
│   ├── lib/
│   │   ├── serialization/      # Serialization system ✅
│   │   │   ├── Serializable.ts
│   │   │   └── ScriptableObject.ts
│   │   └── assets/             # Asset resolution ✅
│   │       └── AssetPathResolver.ts
│   │
│   ├── gameMode/               # Game mode assets ✅
│   │   ├── GameMode.ts         # Base class (abstract)
│   │   ├── ClaimGameMode.ts
│   │   └── assets/             # Asset types
│   │       ├── CardAsset.ts
│   │       ├── GameRulesAsset.ts
│   │       └── ...
│   │
│   └── ui/
│       ├── pages/              # Page components
│       │   ├── Home/           # Welcome page
│       │   └── games/          # Game pages
│       │       ├── Claim/
│       │       └── ThreeCardBrag/
│       └── components/         # Reusable components
│
└── docs/
    ├── SERIALIZATION-AND-ASSET-SYSTEM-FIXES.md  # This file
    └── ocentra/
        └── Architecture/
            └── DATA-DRIVEN-ASSET-SYSTEM.md       # Vision doc
```

### Target Structure (Add)
```
public/Resources/
├── Pages/                      # NEW: Page content assets
│   ├── Welcome/
│   │   ├── hero.asset
│   │   └── features.asset
│   └── Games/
│       ├── Claim/
│       │   ├── info.asset      # Page content
│       │   ├── hero.asset      # Hero section
│       │   └── screenshots.asset
│       └── ThreeCardBrag/
│           └── ...
│
├── UI/                         # NEW: UI element assets
│   ├── Images/
│   │   ├── logo.asset
│   │   └── backgrounds.asset
│   ├── Buttons/
│   │   ├── primary.asset
│   │   └── secondary.asset
│   └── Text/
│       ├── labels.asset
│       └── errors.asset
│
└── Layouts/                    # NEW: Layout configs
    ├── welcomePage.asset
    ├── gamePage.asset
    └── gameScreen.asset
```

---

## Key Design Principles

### 1. No Hardcoding - Everything is Data

**Wrong** ❌:
```tsx
<h1>Claim - The Classic Bluffing Card Game</h1>
<img src="/images/claim-hero.png" alt="Claim game" />
<button onClick={handlePlay}>Play Now</button>
```

**Right** ✅:
```tsx
const page = usePageContent('claim-info');
<h1>{page.hero.title}</h1>
<AssetImage assetRef={page.hero.imageRef} />
<Button config={page.hero.ctaButton} />
```

### 2. Asset References, Not Direct Paths

**Wrong** ❌:
```json
{
  "backgroundImage": "/Resources/UI/Images/hero-bg.png"
}
```

**Right** ✅:
```json
{
  "backgroundImageRef": {
    "__assetRef": true,
    "guid": "hero-bg-001",
    "type": "ImageAsset"
  }
}
```

### 3. Generic Renderers, Not Specific Components

**Wrong** ❌:
```tsx
const ClaimGamePage = () => (
  <div>
    <ClaimHero />
    <ClaimRules />
    <ClaimScreenshots />
  </div>
);
```

**Right** ✅:
```tsx
const GamePage = ({ gameId }) => {
  const page = usePageContent(`/Pages/Games/${gameId}/info.asset`);
  return <PageRenderer page={page} />;
};
```

### 4. Code is Loaders and Renderers Only

**Code's Job**:
- Load assets
- Render assets
- Handle interactions
- Manage state

**Not Code's Job**:
- Store content
- Define layouts
- Hardcode images
- Embed text

---

## Benefits of This System

### 1. Add Games Without Code
```bash
# Add new game
cp -r Resources/Pages/Games/Claim Resources/Pages/Games/Poker
# Edit poker/info.asset (JSON file)
# Done! Game page exists
```

### 2. Content Changes Without Deployment
```bash
# Change game description
vim Resources/Pages/Games/Claim/info.asset
# Update title, description, images
# Commit to git
# GitHub Actions auto-deploys
# Site updates
```

### 3. Move to CDN Anytime
```json
// In .asset file
{
  "sources": {
    "desktop": "https://cdn.ocentra.ca/images/claim-hero-desktop.png"
  }
}
// No code changes needed
```

### 4. A/B Testing
```json
// Version A
{ "hero": { "title": "Claim - The Classic Card Game" } }

// Version B
{ "hero": { "title": "Master Bluffing in Claim" } }

// Swap asset file, measure conversion
```

### 5. Localization
```
Resources/Pages/Games/Claim/
  ├── info.en.asset    # English
  ├── info.es.asset    # Spanish
  └── info.fr.asset    # French
```

### 6. Designer/Writer Friendly
- JSON files (not code)
- Visual editor (ScriptableEditor)
- No deployment needed
- Preview before commit

---

## Testing Checklist

### ✅ Completed
- [x] All TypeScript errors resolved
- [x] All ESLint passes
- [x] Vite 7 upgraded and working
- [x] Fixed `require.context` → `import.meta.glob` for Vite
- [x] Welcome page doesn't load game assets
- [x] GameScreen lazy-loads correctly
- [x] All decorators working
- [x] Abstract classes working

### 🚧 Next Steps
- [ ] Create PageContentAsset type
- [ ] Create ImageAsset type
- [ ] Build useAsset() hook
- [ ] Build PageRenderer component
- [ ] Migrate Claim page to use assets
- [ ] Test full data-driven flow

---

## Commands Reference

```bash
# Run lint (includes type-check)
npm run lint

# Start dev server
npm run dev

# Build for production
npm run build

# Check git status
git status

# View network requests (check asset loading)
# Open DevTools → Network tab → Filter by "Resources"
```

---

## Related Documentation

- [DATA-DRIVEN-ASSET-SYSTEM.md](./ocentra/Architecture/DATA-DRIVEN-ASSET-SYSTEM.md) - Full vision and architecture
- [Serializable.ts](../src/lib/serialization/Serializable.ts) - Serialization system implementation
- [ScriptableObject.ts](../src/lib/serialization/ScriptableObject.ts) - Unity-like asset base class
- [AssetPathResolver.ts](../src/lib/assets/AssetPathResolver.ts) - Asset path resolution

---

## Key Takeaways

1. **No more hardcoding** - All content from `.asset` files
2. **Lazy loading** - Assets load only when needed
3. **Unity-like system** - ScriptableObjects, asset references, GUIDs
4. **CMS-like flexibility** - Change content without code changes
5. **Scalable** - 10 games or 100 games, same architecture

**Current State**: 
- Critical fixes complete ✅
- Vite 7 working correctly ✅
- All TypeScript features supported ✅
- Ready to build full data-driven asset system 🚧

**Next Phase**: Build full data-driven asset system 🚧
**End Goal**: Zero hardcoded content, 100% asset-driven 🎯

**Note**: Webpack migration was attempted but caused issues. Vite 7 is working well and we're staying with it.
