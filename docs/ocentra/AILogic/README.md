# AI Logic Documentation Hub

**Purpose:** Atomic documentation chunks for understanding and implementing the AI system. Each doc focuses on one aspect of how AI works in Unity and how to replicate it in web.

**Strategy:** DRY - Each doc is focused and self-contained. Navigate based on what you're implementing.

**Important:** Unity uses its own AI/LLM provider system. Our web uses a different AI system (see `src/ai/`), but the **prompting pattern** (constructing prompts from GameMode and Rules) stays the same regardless of game type (card game or not).

---

## 📚 Quick Navigation

### Understanding AI Concepts
- **[ai-prompt-construction.md](./ai-prompt-construction.md)** - How AI prompts are built (Unity vs Web)
- **[ai-event-driven-pattern.md](./ai-event-driven-pattern.md)** - Event-driven data sourcing for prompts

### Implementation Patterns (Unity → Web)

#### Prompt Construction
- **[ai-prompt-construction.md](./ai-prompt-construction.md)**
  - How system prompts are built from GameMode properties
  - How user prompts query live game state
  - Unity pattern vs Web pattern
  - **Read when:** Implementing Phase 8 (AI Integration) or updating AIHelper

#### Event-Driven Data Sourcing
- **[ai-event-driven-pattern.md](./ai-event-driven-pattern.md)**
  - How AIHelper requests game state via events
  - RequestPlayerHandDetailEvent, RequestScoreManagerDetailsEvent, etc.
  - Deferred promise pattern for async responses
  - **Read when:** Implementing Phase 8 (AI Integration) or understanding cross-domain communication

#### Provider Abstraction
- **[ai-provider-abstraction.md](./ai-provider-abstraction.md)**
  - How Unity abstracts LLM providers (Azure OpenAI, OpenAI, Claude, local)
  - How web abstracts providers (different system)
  - Provider selection and initialization
  - **Read when:** Implementing Phase 8 (AI Integration) or adding new AI providers

---

## 🎯 When Working on Specific Phases

### Phase 7: Rules Asset System
→ No AI-specific docs needed yet (focuses on Rules assets)

### Phase 8: AI Integration
**Must Read:**
- [ai-prompt-construction.md](./ai-prompt-construction.md) - **Steps 1-2** (how to build prompts)
- [ai-event-driven-pattern.md](./ai-event-driven-pattern.md) - **Steps 3-4** (how to query game state)
- [ai-provider-abstraction.md](./ai-provider-abstraction.md) - **Step 5** (provider setup)
- [../Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - Which GameMode properties AIHelper needs

---

## 🏗️ Key Concepts

### Prompting Pattern is Universal

**Important:** The pattern of constructing prompts from GameMode and Rules is the same regardless of:
- Game type (card game vs non-card game)
- AI system (Unity vs Web)
- LLM provider (Azure OpenAI, OpenAI, Claude, local, etc.)

What stays the same:
- **System prompt** = Built from GameMode properties (rules, rankings, bonuses, strategy tips)
- **User prompt** = Built from live game state (hand, deck, players, scores)
- **Event-driven** = Game state queried via events (decoupled from domains)

What differs:
- **Unity AI system** = Uses Unity's AIModelManager, BaseLLMService, UnityWebRequest
- **Web AI system** = Uses different provider abstraction (see `src/ai/`)
- **Provider details** = Different API formats, auth, response parsing

### Cross-Domain Communication

**Important:** AI is a separate domain. It communicates with other domains (Engine, UI, Solana) via events:

```
AI Domain ←→ EventBus ←→ Engine Domain (business logic)
AI Domain ←→ EventBus ←→ UI Domain (presentation)
AI Domain ←→ EventBus ←→ Solana Domain (blockchain)
```

See: [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) for architecture details.

---

## 📖 Documentation Structure

```
docs/ocentra/AILogic/
├── README.md                          # ← You are here (hub)
├── ai-prompt-construction.md          # How prompts are built
├── ai-event-driven-pattern.md         # Event-driven data sourcing
└── ai-provider-abstraction.md         # Provider abstraction
```

---

## 🔗 Related Documentation

### Main Hub
- [../README.md](../README.md) - Main ocentra documentation hub

### GameMode Integration
- [../Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - How GameMode properties are used for prompts

### Rules Integration
- [../Rules/README.md](../Rules/README.md) - Rules system (AI refers to Rules for game logic)

### Architecture
- [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture (cross-domain communication)

### Phases
- [../Phases/phase-07-rules-asset-system.md](../Phases/phase-07-rules-asset-system.md) - Rules asset system (prerequisite)
- [../Phases/phase-08-ai-integration.md](../Phases/phase-08-ai-integration.md) - AI Integration (uses GameMode + Rules)

---

**Last Updated:** 2025-01-20  
**Structure Pattern:** Atomic docs (one topic per file) with hub navigation

