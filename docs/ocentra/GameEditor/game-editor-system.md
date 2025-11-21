# Game Editor System

**Purpose:** Visual editor for designing table layouts and player positions for card games.

---

## 📍 Location

### Frontend Components
- **Standalone Editor Page**: `src/ui/pages/dev/GameEditorPage.tsx`
  - Routes: `/GameEditor` and `/GameEditor/:gameId`
  - Dev-only standalone page for editing layouts
  
- **Editor UI Component**: `src/ui/components/GameScreen/CardGameScreen/CardGameEditor/TableLayoutEditor.tsx`
  - Reusable editor component
  - Can be embedded in game screens or standalone pages
  
- **Embedded in**: `src/ui/components/GameScreen/CardGameScreen/PlayersOnTable.tsx`
  - Editor can appear in-game (dev mode only)
  
- **State Management**: `src/ui/layout/tableLayoutStore.ts`

### Backend Server (Dev Only)
- **Server Script**: `scripts/GameEditor.ts`
- **Port**: Default `3300` (configurable via `DEV_API_PORT`)
- **Endpoint**: `POST /__dev/api/save-layout`

---

## 🎮 How to Access

### Method 1: Standalone Editor Page (Recommended)
- **General Editor**: `http://localhost:3000/GameEditor`
  - Shows game selection screen
  - Choose a game to edit its layout
  
- **Game-Specific Editor**: `http://localhost:3000/GameEditor/:gameId`
  - Example: `http://localhost:3000/GameEditor/claim`
  - Example: `http://localhost:3000/GameEditor/threecardbrag`
  - Directly opens editor for specified game
  - Automatically loads game configuration
  - Editor panel is visible by default

### Method 2: Keyboard Shortcut (In-Game Editor)
- **Windows/Linux**: `Ctrl + Shift + L`
- **Mac**: `Cmd + Shift + L`
- Toggles editor visibility when in game view

### Method 3: URL Parameter (In-Game Editor)
- Add `?tableEditor` to the game URL
- Example: `http://localhost:3000/games/claim/play?tableEditor`
- Editor opens automatically on page load

### Method 4: Click a Player Seat (In-Game Editor)
- Click any player seat in the game view
- Editor opens and selects that seat for editing

### Method 5: Toggle Button (In-Game Editor)
- When editor is hidden, a "Layout Editor" button appears
- Click it to open the editor panel

---

## 🛠️ What You Can Edit

### Table Settings
- **Width/Height**: Table dimensions
- **Offset X/Y**: Table position
- **Curvature**: Table edge curvature
- **Rim/Inner Rim**: Thickness, colors, textures
- **Felt**: Inner/outer colors, inset
- **Emblem**: Size, colors, blend mode

### Player Seats
- **Position (X/Y)**: Normalized coordinates (0-1)
- **Rotation**: Angle in degrees (0-360)
- **Scale**: Size multiplier (0.4 - 2.0)
- **Player UI Overrides**: 
  - `baseArcRotation`
  - `infoBoxAngle`
  - `infoBoxRotation`

### Player Count
- **Range**: 2-10 players
- **Presets**: Each player count has its own layout preset
- **Copy from Previous**: Copy layout from (n-1) players
- **Reset**: Restore default preset for current count

---

## 💾 How Saving Works

### Save Process
1. Click "Save Preset" button in editor
2. Editor serializes current layout state
3. POST request sent to `/__dev/api/save-layout`
4. Backend server (`GameEditor.ts`) receives request
5. File written to: `public/GameModeConfig/[gameId].json`

### Save Format
```json
{
  "metadata": {
    "gameId": "claim",
    "schemaVersion": 1,
    "displayName": "Claim",
    "updatedAt": "2025-01-XX..."
  },
  "layout": {
    "defaultPlayerCount": 4,
    "presets": {
      "2": { "table": {...}, "seats": [...] },
      "3": { "table": {...}, "seats": [...] },
      ...
    },
    "playerUiDefaults": {...},
    "views": {...}
  },
  "gameplay": {},
  "extensions": {}
}
```

### Fallback Behavior
If save API fails:
- Editor shows export dialog
- JSON can be copied manually
- Can be saved to `public/GameModeConfig/` manually

---

## 🔧 Editor UI Structure

```
┌─────────────────────────────────────┐
│ Table Layout Editor        [Close X]│
├─────────────────────────────────────┤
│                                     │
│ Players: [2] [3] [4] ... [10]      │
│ [Copy from Previous] [Reset]        │
│                                     │
│ ┌─ Table Settings ────────────────┐│
│ │ Width:  [input]                 ││
│ │ Height: [input]                 ││
│ │ Curvature: [slider]             ││
│ │ ...                             ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─ Seats ─────────────────────────┐│
│ │ Scale: [slider]                 ││
│ │ [1] [2] [3] [4] ... (seat chips)││
│ │                                 ││
│ │ Selected: Seat 1                ││
│ │ Rotation: [slider] [input]      ││
│ │ Position X: [slider] [input]    ││
│ │ Position Y: [slider] [input]    ││
│ │ Scale: [slider] [input]         ││
│ │                                 ││
│ │ Player UI Overrides:            ││
│ │ baseArcRotation: [input]        ││
│ │ infoBoxAngle: [input]           ││
│ │ infoBoxRotation: [input]        ││
│ └─────────────────────────────────┘│
│                                     │
│ [Save Preset]                       │
└─────────────────────────────────────┘
```

---

## 🔄 State Management

### Store: `tableLayoutStore`
Located in: `src/ui/layout/tableLayoutStore.ts`

**State Structure:**
```typescript
{
  playerCount: number;           // 2-10
  table: TableShapeSettings;     // Table dimensions, colors, etc.
  seats: SeatLayout[];           // Array of player seats
  selectedSeatId: number | null; // Currently selected seat
  isEditorVisible: boolean;      // Editor panel visibility
  gameId: string | null;         // Current game ID (e.g., "claim")
  asset: GameAsset | null;       // Loaded game configuration
}
```

**Key Methods:**
- `setLayout()` - Replace entire layout
- `setPlayerCount()` - Change player count (loads preset)
- `setSeats()` - Update all seats
- `setSelectedSeat()` - Select a seat for editing
- `setEditorVisible()` - Show/hide editor
- `toggleEditorVisible()` - Toggle editor
- `applyPreset()` - Load preset for player count

---

## 🚀 Running the Editor Backend

### Start Dev Server with Editor Support

The `GameEditor.ts` script provides the save endpoint. It should be running alongside your Vite dev server.

**Option 1: Manual Start**
```bash
npm run dev  # Starts Vite
node scripts/GameEditor.ts  # Starts save API server
```

**Option 2: Check `scripts/dev.ts`**
The main dev script (`scripts/dev.ts`) may already integrate the editor server. Check if it starts both servers.

---

## 📂 File Structure

```
src/
├── ui/
│   ├── components/
│   │   └── GameScreen/
│   │       └── CardGameScreen/
│   │           ├── CardGameEditor/        ← Editor component
│   │           │   └── TableLayoutEditor.tsx
│   │           └── PlayersOnTable.tsx     ← Embeds editor
│   │
│   └── layout/
│       ├── tableLayoutStore.ts            ← State management
│       └── loadGameUiPreset.ts            ← Loads saved configs
│
scripts/
└── GameEditor.ts                          ← Save API server

public/
└── GameModeConfig/
    ├── claim.json                         ← Saved layouts
    ├── threecardbrag.json
    └── ...
```

---

## 🎯 Current Flow

1. **Load Game**: `loadGameUiPreset()` loads config from `public/GameModeConfig/[gameId].json`
2. **Render Game**: `GameScreen` → `PlayersOnTable` → `TableLayoutEditor`
3. **Edit**: User adjusts table/seat settings via editor UI
4. **Save**: Click "Save Preset" → POST to `/__dev/api/save-layout`
5. **Backend**: `GameEditor.ts` writes to `public/GameModeConfig/[gameId].json`
6. **Reload**: Next page load uses updated layout

---

## ⚠️ Important Notes

- **Dev Only**: Save endpoint only works in development mode
- **File Location**: Layouts saved to `public/GameModeConfig/` (must exist)
- **Game ID**: Must match game being edited (e.g., "claim", "threecardbrag")
- **Presets**: Each player count (2-10) has its own preset
- **Real-time Preview**: Changes update immediately in game view
- **State Persistence**: Editor state persists during session, resets on reload

---

## 🔍 Finding the Editor

### Standalone Editor Page
Navigate directly to:
- `http://localhost:3000/GameEditor` - Select a game
- `http://localhost:3000/GameEditor/claim` - Edit Claim game
- `http://localhost:3000/GameEditor/threecardbrag` - Edit ThreeCardBrag game

The editor appears as a side panel with:
- "Table Layout Editor" header
- Controls for table dimensions, seat positions, rotations, etc.
- "Save Preset" button at the bottom
- Game selection or "Back to Games" button in top-left

### In-Game Editor
When playing a game, the editor can appear as:
- A collapsible panel on the right side of the game screen
- Toggle via keyboard shortcut: `Ctrl+Shift+L` (or `Cmd+Shift+L` on Mac)
- Or click on any player seat to open editor for that seat

