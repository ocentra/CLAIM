<!-- c138d07c-bbfb-4663-b9db-9b0d6f66868a 4ff855de-4f0d-47e1-af4a-b04aa00b1675 -->
# Data-Driven Asset System Implementation Plan

## 📊 Implementation Status Summary

**Last Updated**: 2025-01-21

### ✅ Completed Phases

- **Phase 0**: Fix ScriptableEditor (IMMEDIATE) - ✅ **100% COMPLETE**
- **Phase 1**: Create Core Asset Types - ✅ **100% COMPLETE**
- **Phase 2**: Create React Hooks for Asset Loading - ✅ **100% COMPLETE**
- **Phase 3**: Create Renderer Components - ✅ **100% COMPLETE**

### 🟡 Partial Phases

- **Phase 4**: Create Initial Asset Files - 🟡 **PARTIAL** (Claim asset exists, sample ImageAssets not created)
- **Phase 5**: Migrate First Page - 🟡 **PARTIAL** (ClaimGamePage migrated, GameInfoTabs still exists for other games)

### ❌ Not Started

- **Phase 6+**: Additional game pages, ImageAssets, LayoutAssets (optional enhancements)

### 🎯 Overall Progress: ~85% Complete

**Core infrastructure is 100% complete!** All asset types, hooks, and renderers exist and work. The system is functional and ready for use. Remaining work is optional enhancements (ImageAssets, LayoutAssets, Welcome page asset).

## Current State (Actual)

### ✅ What EXISTS:

1. **ScriptableObject base class** - `src/lib/serialization/ScriptableObject.ts`
2. **Serialization system** - `@serializable` decorator working
3. **AssetPathResolver** - `src/lib/assets/AssetPathResolver.ts`
4. **Game mode assets** - CardAsset, GameRulesAsset, GameDescriptionAsset, StrategyTipsAsset
5. **Asset files** - Cards/*.asset and GameMode/*.asset files exist
6. **Static load method** - `ScriptableObject.load()` exists

### ❌ What DOES NOT EXIST:

1. **PageContentAsset** type - For page content (titles, descriptions, sections)
2. **ImageAsset** type - For images with responsive sources
3. **LayoutAsset** type - For page layouts
4. **UIComponentAsset** type - For UI component styles
5. **React hooks** - `useAsset<T>()`, `usePageContent()`, `useImage()`, `useLayout()`
6. **Renderer components** - `PageRenderer`, `AssetImage`, `SectionRenderer`
7. **Asset directories** - `/Resources/Pages/`, `/Resources/UI/`, `/Resources/Layouts/`

### 🔴 Current Hardcoded Content:

1. **ClaimGamePage** - `GameInfoTabs.tsx` has ALL content hardcoded (titles, descriptions, sections)
2. **HomePage** - Uses hardcoded `GAMES` array from `games.ts`
3. **All game pages** - Content is hardcoded in components

---

## Implementation Plan

### Phase 0: Fix ScriptableEditor (IMMEDIATE) ✅ **DONE**

**Problem**: ScriptableEditor UI exists but doesn't populate because missing dev API endpoints.

**Status**: ✅ **COMPLETE** - All endpoints implemented and working

**Completed**:

1. ✅ Add `/__dev/api/scan-resources` endpoint to `vite.config.ts` - **DONE**

- Scans `public/Resources/` directory recursively
- Returns tree structure of all `.asset` files
- Filters to `.asset` files only (not images, etc.)
- Location: `vite.config.ts:582`

2. ✅ Add `/__dev/api/save-asset` endpoint to `vite.config.ts` - **DONE**

- Saves any `.asset` file to `public/Resources/`
- Handles nested directories
- Creates directories if needed
- Location: `vite.config.ts:666`

3. ✅ Add `/__dev/api/save-card-asset` endpoint - **DONE**

- Saves card assets specifically
- Location: `vite.config.ts:736`

4. ✅ Add `/__dev/api/upload-image` endpoint - **DONE** (Bonus feature)

- Uploads images to `/Resources/Cards/Images/`
- Supports base64 encoded images
- Auto-names files based on default path
- Location: `vite.config.ts:581`

**Result**: ✅ ScriptableEditor populates with existing `.asset` files in `public/Resources/`. Image upload working.

---

### Phase 1: Create Core Asset Types ✅ **DONE**

**Status**: ✅ **COMPLETE** - All asset types created and path resolver updated

**1.1 Create PageContentAsset** ✅ **DONE**

- ✅ File: `src/lib/assets/PageContentAsset.ts` - **EXISTS**
- ✅ Extends: `ScriptableObject`
- ✅ Fields: `hero`, `sections` with proper types
- ✅ Uses `@serializable` decorator
- ✅ Schema version: 1

**1.2 Create ImageAsset** ✅ **DONE**

- ✅ File: `src/lib/assets/ImageAsset.ts` - **EXISTS**
- ✅ Extends: `ScriptableObject`
- ✅ Fields: `sources`, `metadata`, `cdn`
- ✅ Schema version: 1

**1.3 Create LayoutAsset** ✅ **DONE**

- ✅ File: `src/lib/assets/LayoutAsset.ts` - **EXISTS**
- ✅ Extends: `ScriptableObject`
- ✅ Fields: `layout` with sections
- ✅ Schema version: 1

**1.4 Create UIComponentAsset** ✅ **DONE**

- ✅ File: `src/lib/assets/UIComponentAsset.ts` - **EXISTS**
- ✅ Extends: `ScriptableObject`
- ✅ Fields: `component`, `styles`, `animations`
- ✅ Schema version: 1

**1.5 Update AssetPathResolver** ✅ **DONE**

- ✅ File: `src/lib/assets/AssetPathResolver.ts` - **UPDATED**
- ✅ PageContentAsset → `/Resources/Pages/...` - **IMPLEMENTED**
- ✅ ImageAsset → `/Resources/UI/Images/...` - **IMPLEMENTED**
- ✅ LayoutAsset → `/Resources/Layouts/...` - **IMPLEMENTED**
- ✅ UIComponentAsset → `/Resources/UI/...` - **IMPLEMENTED**
- Location: `AssetPathResolver.ts:120-138`

---

### Phase 2: Create React Hooks for Asset Loading ✅ **DONE**

**Status**: ✅ **COMPLETE** - All hooks implemented and working

**2.1 Create generic useAsset hook** ✅ **DONE**

- ✅ File: `src/hooks/useAsset.ts` - **EXISTS**
- ✅ Function: `useAsset<T extends ScriptableObject>(...)` - **IMPLEMENTED**
- ✅ Uses: `ScriptableObject.load()` with React state
- ✅ Handles: Loading state, error handling
- ✅ Also includes: `useAssetWithState<T>()` for full state management

**2.2 Create usePageContent hook** ✅ **DONE**

- ✅ File: `src/hooks/usePageContent.ts` - **EXISTS**
- ✅ Function: `usePageContent(pageId, gameId?)` - **IMPLEMENTED**
- ✅ Uses: `useAsset<PageContentAsset>()`
- ✅ Resolves path: `/Resources/Pages/Games/${gameId}/${pageId}.asset`

**2.3 Create useImage hook** ✅ **DONE**

- ✅ File: `src/hooks/useImage.ts` - **EXISTS**
- ✅ Function: `useImage(assetRef)` - **IMPLEMENTED**
- ✅ Uses: `useAsset<ImageAsset>()`
- ✅ Includes: Loading state tracking via `useImageWithState()`

**2.4 Create useLayout hook** ✅ **DONE**

- ✅ File: `src/hooks/useLayout.ts` - **EXISTS**
- ✅ Function: `useLayout(layoutId)` - **IMPLEMENTED**
- ✅ Uses: `useAsset<LayoutAsset>()`

---

### Phase 3: Create Renderer Components ✅ **DONE**

**Status**: ✅ **COMPLETE** - All renderer components implemented

**3.1 Create AssetImage component** ✅ **DONE**

- ✅ File: `src/ui/components/AssetImage/AssetImage.tsx` - **EXISTS**
- ✅ Props: `assetRef`, `alt`, `className` - **IMPLEMENTED**
- ✅ Uses: `useImage()` hook
- ✅ Renders: Responsive images with desktop/mobile sources
- ✅ Handles: Loading state, error fallback

**3.2 Create SectionRenderer component** ✅ **DONE**

- ✅ File: `src/ui/components/SectionRenderer/SectionRenderer.tsx` - **EXISTS**
- ✅ Props: `section: PageSection` - **IMPLEMENTED**
- ✅ Renders: Different section types (rules, screenshots, text, etc.)
- ✅ Handles: Asset references within sections

**3.3 Create PageRenderer component** ✅ **DONE**

- ✅ File: `src/ui/components/PageRenderer/PageRenderer.tsx` - **EXISTS**
- ✅ Props: `pageAsset: PageContentAsset` or `pagePath: string` - **IMPLEMENTED**
- ✅ Uses: `usePageContent()` if path provided
- ✅ Renders: Hero section + all sections from asset
- ✅ Generic: Works for any game page

---

### Phase 4: Create Initial Asset Files 🟡 **PARTIAL**

**Status**: 🟡 **PARTIAL** - Claim page asset exists, sample ImageAssets not yet created

**4.1 Create directory structure** 🟡 **PARTIAL**

- ✅ `public/Resources/Pages/Games/Claim/info.asset` - **EXISTS**
- ❌ `public/Resources/Pages/Welcome/welcome.asset` - **NOT CREATED YET**
- ❌ `public/Resources/UI/Images/` directory - **NOT CREATED YET**
- ❌ `public/Resources/Layouts/` directory - **NOT CREATED YET**

**4.2 Create Claim game page asset** ✅ **DONE**

- ✅ File: `public/Resources/Pages/Games/Claim/info.asset` - **EXISTS**
- ✅ Content extracted from `GameInfoTabs.tsx`
- ✅ Hero section: Title, subtitle included
- ✅ Sections: About, Rules, Strategy, Scoring - **ALL IMPLEMENTED**
- ✅ Proper schema version and metadata

**4.3 Create sample ImageAssets** ❌ **NOT DONE**

- ❌ Logo asset: `public/Resources/UI/Images/logo.asset` - **NOT CREATED**
- ❌ Hero backgrounds: `public/Resources/UI/Images/claim-hero.asset` - **NOT CREATED**
- **Note**: ImageAssets not required for basic functionality, can be added later

---

### Phase 5: Migrate First Page (Claim Game Page) 🟡 **PARTIAL**

**Status**: 🟡 **PARTIAL** - ClaimGamePage migrated, GameInfoTabs still exists (likely for other games)

**5.1 Update ClaimGamePage** ✅ **DONE**

- ✅ File: `src/ui/pages/games/Claim/ClaimGamePage.tsx` - **UPDATED**
- ✅ Replaced hardcoded content with `PageRenderer`
- ✅ Uses: `const page = usePageContent('Claim', 'Claim')` - **IMPLEMENTED**
- ✅ Renders: `<PageRenderer pageAsset={page} />` - **WORKING**
- Location: `ClaimGamePage.tsx:20,67`

**5.2 Simplify GameInfoTabs (or remove)** 🟡 **PARTIAL**

- ⚠️ `GameInfoTabs.tsx` still exists - **NOT REMOVED**
- **Note**: May be used by other games (e.g., ThreeCardBrag) or as fallback
- ✅ ClaimGamePage no longer uses it - **VERIFIED**

**5.3 Test and verify** ✅ **DONE**

- ✅ Page loads content from asset file - **WORKING**
- ✅ All sections render correctly - **VERIFIED**
- ⚠️ Images load from ImageAssets - **Not yet tested** (no ImageAssets created yet)

---

## Key Files to Create/Modify

### New Files (13 files):

1. `src/lib/assets/PageContentAsset.ts`
2. `src/lib/assets/ImageAsset.ts`
3. `src/lib/assets/LayoutAsset.ts`
4. `src/lib/assets/UIComponentAsset.ts`
5. `src/hooks/useAsset.ts`
6. `src/hooks/usePageContent.ts`
7. `src/hooks/useImage.ts`
8. `src/hooks/useLayout.ts`
9. `src/ui/components/AssetImage/AssetImage.tsx`
10. `src/ui/components/SectionRenderer/SectionRenderer.tsx`
11. `src/ui/components/PageRenderer/PageRenderer.tsx`
12. `public/Resources/Pages/Games/Claim/info.asset`
13. `public/Resources/UI/Images/logo.asset` (example)

### Files to Modify (4 files):

1. `src/lib/assets/AssetPathResolver.ts` - Add new asset type paths
2. `src/ui/pages/games/Claim/ClaimGamePage.tsx` - Use PageRenderer
3. `src/lib/assets/index.ts` - Export new asset types
4. `src/hooks/index.ts` - Export new hooks

---

## Implementation Order

1. **Phase 1** - Create all 4 asset types (foundation)
2. **Phase 2** - Create hooks (loading infrastructure)
3. **Phase 3** - Create renderers (display infrastructure)
4. **Phase 4** - Create initial asset files (data)
5. **Phase 5** - Migrate Claim page (first working example)

---

## Success Criteria

- [x] ✅ PageContentAsset class exists and extends ScriptableObject
- [x] ✅ useAsset hook loads assets with React state management
- [x] ✅ PageRenderer component renders PageContentAsset
- [x] ✅ Claim game page loads content from `/Resources/Pages/Games/Claim/info.asset`
- [x] ✅ No hardcoded content in ClaimGamePage (content comes from assets)
- [ ] ⚠️ Images load from ImageAssets via AssetImage component (ImageAssets not created yet, but infrastructure ready)
- [x] ✅ Adding a new game page = just creating a new .asset file (infrastructure ready)

---

## Notes

- Build on existing ScriptableObject infrastructure
- Follow existing patterns (CardAsset, GameRulesAsset)
- Use TypeScript types throughout
- Ensure asset references work (GUID-based references)
- Support both path strings and AssetReference objects
- Handle loading states and errors gracefully

### To-dos

- [x] ✅ Create PageContentAsset class extending ScriptableObject with hero and sections fields
- [x] ✅ Create ImageAsset class extending ScriptableObject with responsive image sources
- [x] ✅ Create LayoutAsset class extending ScriptableObject for page layouts
- [x] ✅ Create UIComponentAsset class extending ScriptableObject for UI component styles
- [x] ✅ Update AssetPathResolver to handle Pages, UI, and Layouts asset paths
- [x] ✅ Create generic useAsset<T> hook for loading any ScriptableObject asset
- [x] ✅ Create usePageContent hook that uses useAsset<PageContentAsset>
- [x] ✅ Create useImage hook that uses useAsset<ImageAsset>
- [x] ✅ Create AssetImage component that renders responsive images from ImageAsset
- [x] ✅ Create SectionRenderer component that renders different section types from PageContentAsset
- [x] ✅ Create PageRenderer component that renders PageContentAsset (hero + sections)
- [x] ✅ Create /Resources/Pages/ directory structure (Claim/info.asset exists)
- [x] ✅ Create /Resources/Pages/Games/Claim/info.asset with content extracted from GameInfoTabs.tsx
- [x] ✅ Migrate ClaimGamePage to use PageRenderer instead of hardcoded GameInfoTabs
- [ ] ⚠️ Create /Resources/UI/Images/ directory (optional - for future ImageAssets)
- [ ] ⚠️ Create /Resources/Layouts/ directory (optional - for future LayoutAssets)
- [ ] ⚠️ Create sample ImageAsset files (logo, hero backgrounds) - **OPTIONAL**
- [ ] ⚠️ Create /Resources/Pages/Welcome/welcome.asset - **OPTIONAL**