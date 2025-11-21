# Library Documentation Hub

**Purpose:** Atomic documentation chunks for understanding and using the libraries in `src/lib/`. Each doc focuses on what exists, how to use it, and when to reference it.

**Strategy:** DRY - Each doc is focused and self-contained. Navigate based on what you need.

---

## 📚 Quick Navigation

### Core Libraries

#### Event-Driven Communication
- **[eventbus.md](./eventbus.md)** - EventBus system for cross-domain communication
  - Publish/subscribe pattern
  - Event registration and handling
  - React integration hooks
  - **Use when:** Need to communicate between domains (UI, Engine, AI, Solana)
  - **Reference:** `src/lib/eventing/EventBus.ts`

#### React Lifecycle Management
- **[react-behaviours.md](./react-behaviours.md)** - ReactBehaviour system for component lifecycle
  - Lifecycle hooks (awake, onStart, onUpdate, onDestroy)
  - Update loops and state management
  - React hooks integration
  - **Use when:** Need lifecycle management in React components
  - **Reference:** `src/lib/react-behaviours/ReactBehaviour.ts`

#### Serialization & Persistence
- **[serialization.md](./serialization.md)** - Serializable system for data persistence
  - Decorator-based serialization
  - Schema versioning and migration
  - Deep cloning and freezing
  - **Use when:** Need to serialize/deserialize classes (GameMode assets, layouts, etc.)
  - **Reference:** `src/lib/serialization/Serializable.ts`

#### Runtime Contracts
- **[contracts.md](./contracts.md)** - Contract checking for runtime validation
  - Interface specifications
  - Runtime type checking
  - Optional in production
  - **Use when:** Need runtime validation of objects (API responses, untrusted data)
  - **Reference:** `src/lib/contracts/Interface.ts`

#### Logging System
- **[logging.md](./logging.md)** - Unified logging with IndexedDB persistence
  - Module-based logging
  - IndexedDB storage
  - Query utilities
  - **Use when:** Need structured logging with persistence
  - **Reference:** `src/lib/logging/logger.ts`

### Supporting Libraries

#### Core Utilities
- **[core-utilities.md](./core-utilities.md)** - Core utilities (GUID, timeout, services)
  - GUID generation
  - Promise timeout wrapper
  - Service container pattern
  - **Use when:** Need common utilities
  - **Reference:** `src/lib/core/`

#### Cryptography
- **[crypto.md](./crypto.md)** - Cryptographic services
  - Hash service
  - Signature service
  - Key management
  - **Use when:** Need cryptographic operations (hashing, signing)
  - **Reference:** `src/lib/crypto/`

#### ML Pipelines
- **[pipelines.md](./pipelines.md)** - ML pipeline system
  - Text generation pipeline
  - Text-to-speech pipeline
  - Whisper pipeline
  - **Use when:** Need ML model pipelines
  - **Reference:** `src/lib/pipelines/`

#### Match Recording
- **[match-recording.md](./match-recording.md)** - Match event recording system
  - Event collection
  - Canonical JSON serialization
  - Match records
  - **Use when:** Need to record and replay matches
  - **Reference:** `src/lib/match-recording/`

#### Database
- **[db.md](./db.md)** - IndexedDB utilities
  - Base IndexedDB wrapper
  - Schema management
  - Model definitions
  - **Use when:** Need client-side database operations
  - **Reference:** `src/lib/db/`

---

## 🎯 When to Use Which Library

### Cross-Domain Communication
→ **[eventbus.md](./eventbus.md)**
- UI ↔ Engine
- Engine ↔ Solana
- AI ↔ Engine
- Any cross-domain communication

### React Component Lifecycle
→ **[react-behaviours.md](./react-behaviours.md)**
- Need lifecycle hooks (awake, onStart, onUpdate, onDestroy)
- Need update loops
- Need state management tied to component lifecycle

### Data Persistence
→ **[serialization.md](./serialization.md)**
- Serializing GameMode assets
- Serializing layouts
- Saving/loading game state
- Any object serialization needs

### Runtime Validation
→ **[contracts.md](./contracts.md)**
- Validating API responses
- Validating untrusted data
- Runtime type checking

### Logging & Debugging
→ **[logging.md](./logging.md)**
- Structured logging
- Persistent log storage
- Querying logs

---

## 📖 Documentation Structure

```
docs/ocentra/Lib/
├── README.md                    # ← You are here (hub)
│
├── Core Libraries
│   ├── eventbus.md              # EventBus system
│   ├── react-behaviours.md      # ReactBehaviour system
│   ├── serialization.md         # Serializable system
│   ├── contracts.md             # Contract checking
│   └── logging.md               # Logging system
│
└── Supporting Libraries
    ├── core-utilities.md        # Core utilities
    ├── crypto.md                # Cryptographic services
    ├── pipelines.md             # ML pipelines
    ├── match-recording.md       # Match recording
    └── db.md                    # IndexedDB utilities
```

---

## 🔗 Related Documentation

### Main Hub
- [../README.md](../README.md) - Main ocentra documentation hub

### Architecture
- [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture (uses EventBus)

### GameMode Asset System
- [../GameData/GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Uses Serialization for assets
- [../Phases/phase-01-core-serializable-foundation.md](../Phases/phase-01-core-serializable-foundation.md) - Phase that uses Serialization

### AI System
- [../AILogic/ai-event-driven-pattern.md](../AILogic/ai-event-driven-pattern.md) - Uses EventBus for game state queries

---

**Last Updated:** 2025-01-20  
**Structure Pattern:** Atomic docs (one library per file) with hub navigation

