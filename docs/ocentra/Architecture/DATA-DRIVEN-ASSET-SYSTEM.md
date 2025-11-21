# Data-Driven Asset System Architecture

## Vision: Zero Hardcoding, 100% Asset-Driven

Every piece of content, image, text, layout, and configuration comes from `.asset` files in `/Resources/`. Code is just loaders and renderers.

## Core Principles

1. **No hardcoded content** - All text, images, layouts in `.asset` files
2. **Unity-like asset system** - Assets reference other assets via GUIDs
3. **Remote-ready** - Asset paths can be local or CDN URLs
4. **CMS-like editing** - Change content without code changes
5. **Type-safe loading** - TypeScript types from asset schemas

---

## Asset Structure

```
public/Resources/
├── Cards/
│   ├── Images/           # Actual images
│   │   ├── ace_of_spades.png
│   │   └── BackCard.png
│   └── *.asset           # Card metadata + image references
│
├── GameMode/
│   └── CardGames/
│       ├── Claim/
│       │   ├── claim.asset           # GameMode config
│       │   ├── gameRules.asset
│       │   ├── gameDescription.asset
│       │   └── strategyTips.asset
│       └── ThreeCardBrag/
│           └── ...
│
├── Pages/                # NEW: Page content assets
│   ├── Welcome/
│   │   ├── hero.asset    # Hero section config
│   │   ├── features.asset
│   │   └── images.asset
│   ├── Games/
│   │   ├── Claim/
│   │   │   ├── info.asset       # Game info page content
│   │   │   ├── hero.asset
│   │   │   └── screenshots.asset
│   │   └── ThreeCardBrag/
│   │       └── ...
│   └── Home/
│       ├── carousel.asset
│       └── featured.asset
│
├── UI/                   # NEW: UI element assets
│   ├── Buttons/
│   │   ├── primary.asset
│   │   └── secondary.asset
│   ├── Images/
│   │   ├── logo.asset
│   │   ├── backgrounds.asset
│   │   └── icons.asset
│   └── Text/
│       ├── labels.asset
│       └── errors.asset
│
└── Layouts/              # NEW: Layout configs
    ├── gameScreen.asset
    ├── welcomePage.asset
    └── gamePage.asset
```

---

## Asset File Examples

### 1. Page Content Asset
**`/Resources/Pages/Games/Claim/info.asset`**
```json
{
  "__assetType": "PageContent",
  "__assetId": "claim-info-page",
  "__schemaVersion": 1,
  "metadata": {
    "gameId": "claim",
    "pageType": "GameInfo"
  },
  "hero": {
    "title": "Claim - The Classic Bluffing Card Game",
    "subtitle": "Outsmart your opponents with strategic lies",
    "backgroundImageRef": {
      "__assetRef": true,
      "guid": "claim-hero-bg-001",
      "type": "ImageAsset"
    },
    "ctaButtons": [
      {
        "label": "Play Now",
        "action": "/games/claim/play",
        "style": "primary"
      },
      {
        "label": "Learn Rules",
        "action": "#rules",
        "style": "secondary"
      }
    ]
  },
  "sections": [
    {
      "type": "rules",
      "title": "How to Play",
      "contentRef": {
        "__assetRef": true,
        "guid": "claim-rules-short",
        "type": "GameRulesAsset"
      }
    },
    {
      "type": "screenshots",
      "title": "Game Screenshots",
      "images": [
        {
          "__assetRef": true,
          "guid": "claim-screenshot-001"
        },
        {
          "__assetRef": true,
          "guid": "claim-screenshot-002"
        }
      ]
    }
  ]
}
```

### 2. Image Asset
**`/Resources/UI/Images/logo.asset`**
```json
{
  "__assetType": "ImageAsset",
  "__assetId": "logo-main",
  "__guid": "logo-main-001",
  "__schemaVersion": 1,
  "metadata": {
    "title": "Ocentra Games Logo",
    "alt": "Ocentra Games - Play to Earn Card Games"
  },
  "sources": {
    "desktop": "/Resources/UI/Images/logo-desktop.png",
    "mobile": "/Resources/UI/Images/logo-mobile.png",
    "icon": "/Resources/UI/Images/logo-icon.png"
  },
  "cdn": {
    "enabled": false,
    "baseUrl": "https://cdn.ocentra.ca/images/"
  }
}
```

### 3. UI Component Asset
**`/Resources/UI/Buttons/primary.asset`**
```json
{
  "__assetType": "UIComponentAsset",
  "__assetId": "button-primary",
  "__schemaVersion": 1,
  "component": "Button",
  "styles": {
    "backgroundColor": "#4A90E2",
    "hoverColor": "#357ABD",
    "textColor": "#FFFFFF",
    "borderRadius": "8px",
    "padding": "12px 24px"
  },
  "animations": {
    "hover": "scale-up",
    "click": "ripple"
  }
}
```

### 4. Welcome Page Layout Asset
**`/Resources/Layouts/welcomePage.asset`**
```json
{
  "__assetType": "LayoutAsset",
  "__assetId": "welcome-page-layout",
  "__schemaVersion": 1,
  "layout": {
    "type": "welcome",
    "sections": [
      {
        "id": "hero",
        "component": "Hero",
        "contentRef": {
          "__assetRef": true,
          "guid": "welcome-hero-content"
        }
      },
      {
        "id": "featured-games",
        "component": "FeaturedGamesCarousel",
        "contentRef": {
          "__assetRef": true,
          "guid": "featured-games-list"
        }
      },
      {
        "id": "about",
        "component": "AboutSection",
        "contentRef": {
          "__assetRef": true,
          "guid": "about-content"
        }
      }
    ]
  }
}
```

---

## Code Architecture

### AssetManager (Central System)
```typescript
class AssetManager {
  // Load any asset by GUID or path
  async load<T>(assetRef: AssetReference | string): Promise<T>

  // Load with type checking
  async loadTyped<T>(assetRef: AssetReference, expectedType: AssetType): Promise<T>

  // Preload assets for a page
  async preloadPage(pageId: string): Promise<void>

  // Cache management
  async clearCache(): Promise<void>
}
```

### Page Renderer (Generic)
```typescript
// Pages don't hardcode content - they render from assets
const GameInfoPage: React.FC<{ gameId: string }> = ({ gameId }) => {
  const pageAsset = useAsset<PageContentAsset>(`/Pages/Games/${gameId}/info.asset`);

  if (!pageAsset) return <LoadingScreen />;

  return (
    <PageLayout>
      <Hero
        title={pageAsset.hero.title}
        subtitle={pageAsset.hero.subtitle}
        backgroundImage={useAsset(pageAsset.hero.backgroundImageRef)}
        buttons={pageAsset.hero.ctaButtons}
      />
      {pageAsset.sections.map(section => (
        <SectionRenderer key={section.type} section={section} />
      ))}
    </PageLayout>
  );
};
```

### Image Component (Asset-Driven)
```typescript
const AssetImage: React.FC<{ assetRef: AssetReference | string }> = ({ assetRef }) => {
  const imageAsset = useAsset<ImageAsset>(assetRef);

  if (!imageAsset) return <Skeleton />;

  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={imageAsset.sources.mobile} />
      <img
        src={imageAsset.sources.desktop}
        alt={imageAsset.metadata.alt}
        loading="lazy"
      />
    </picture>
  );
};
```

---

## Migration Path

### Phase 1: Infrastructure ✅ (Current)
- [x] AssetPathResolver
- [x] ScriptableObject base class
- [x] Serialization system
- [x] Lazy loading

### Phase 2: Core Assets (Next)
- [ ] Create PageContentAsset type
- [ ] Create ImageAsset type
- [ ] Create UIComponentAsset type
- [ ] Create LayoutAsset type
- [ ] Build AssetManager with caching

### Phase 3: Page Migration
- [ ] Create assets for Claim game page
- [ ] Migrate ClaimGamePage.tsx to use PageContentAsset
- [ ] Create assets for Welcome page
- [ ] Migrate welcome page to use assets

### Phase 4: UI Components
- [ ] Create button style assets
- [ ] Create image assets for all UI images
- [ ] Migrate all hardcoded images to ImageAsset
- [ ] Create text/label assets

### Phase 5: Full Data-Driven
- [ ] All 10-20 games use PageContentAsset
- [ ] Editor UI for creating/editing assets (ScriptableEditor)
- [ ] CDN integration for remote assets
- [ ] Asset versioning and hot-reload

---

## Benefits

1. **Content changes without code deploys** - Update .asset files, content updates
2. **A/B testing** - Swap asset references, no code changes
3. **Localization** - Different .asset files per language
4. **Remote assets** - Move images to CDN, update paths in .asset
5. **Designer/Writer friendly** - JSON files, no code knowledge needed
6. **Type safety** - TypeScript validates asset schemas
7. **Scalability** - 10 games or 100 games, same architecture

---

## Example: Adding New Game Page (Zero Code)

1. Create `/Resources/Pages/Games/Poker/info.asset`
2. Add game content (title, description, images)
3. Reference existing ImageAssets or upload new ones
4. App automatically renders page using PageRenderer
5. No code changes, no deployment needed

**This is the goal!**
