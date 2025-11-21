# Claim Card Game Rules

**Purpose:** Complete, atomic documentation for implementing Claim card game using Unity's GameMode/Rules system. This document contains all information needed to implement Claim rules without referencing Unity code during implementation.

**Status:** Specification Complete - Ready for Phase 7 Implementation

**Reference:** Unity implementation in `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs` (for reference only, not needed during implementation)

---

## 📋 Table of Contents

1. [Game Rules Overview](#game-rules-overview)
2. [Game Setup](#game-setup)
3. [Game Flow](#game-flow)
4. [Scoring System](#scoring-system)
5. [Unity GameMode Implementation](#unity-gamemode-implementation)
6. [Rules Asset Implementation](#rules-asset-implementation)
7. [BaseBonusRule Classes Needed](#basebonusrule-classes-needed)

---

## 🎮 Game Rules Overview

**Game Name:** Claim

**Players:** 4 players

**Deck:** Standard 52-card deck (no jokers)

**Objective:** Build the highest-scoring hand in your declared suit, or face penalties if undeclared.

**Key Mechanics:**
- Initial simultaneous declaration phase (30-second countdown)
- Floor card rounds where players can pick up or decline cards
- Suit declaration locks that suit for other players
- Showdown can be called to end the round
- Hoarder's Multiplier scoring system

---

## 🎲 Game Setup

### Initial Setup

1. **Dealer Selection:** Randomly select one player to act as dealer (dealer is not a player, rotates each round)

2. **Dealing:**
   - Dealer shuffles deck
   - Each player receives **3 cards** face down
   - Remaining 40 cards form the draw pile

3. **Player Budget:** Each player starts with **1352 points**
   - Calculated as: (14+13+12+11+10+9+8+7+6+5+4+3+2) × 13 = 1352
   - Represents maximum possible penalty

### Card Values

- **Ace (A):** 14
- **King (K):** 13
- **Queen (Q):** 12
- **Jack (J):** 11
- **10-2:** Face value (10, 9, 8, 7, 6, 5, 4, 3, 2)

### Suit Priority (for tie-breaking)

1. Spades ♠
2. Hearts ♥
3. Diamonds ♦
4. Clubs ♣

---

## 🔄 Game Flow

### Phase 1: Initial Declaration (Simultaneous)

**Timing:** 30-second countdown, then "3, 2, 1" count with 1-second pauses

**Actions Available:**
1. **Declare a Suit:**
   - Choose a suit (♠, ♥, ♦, ♣)
   - Optionally place one or more face-up cards of that suit from hand
   - **Suit Lock:** Once declared, no other player can declare that suit

2. **Don't Declare:**
   - Take immediate penalty based on value of highest card
   - Penalty accumulates each round until declaration is made

**After Initial Declaration:**
- Players who declared have committed to a suit
- Players who didn't declare have taken initial penalty
- Blitz Showdown can be called immediately (if minimum 27 points)

### Phase 2: Floor Card Rounds

**Round Structure:**
1. **Dealer Reveal:** Dealer places one card face-up as the **Floor Card**
2. **Player Actions:** Starting with randomly selected first player each round:
   - **Pick Up:** Take the Floor Card (may discard one card from hand)
   - **Decline:** Pass and keep current hand
   - **Declare Intent:** Declare a suit (if not already declared)
   - **Call Showdown:** Challenge other players to reveal hands (if minimum 27 points)

3. **Floor Card Disposal:**
   - If picked up: Player discards and holds new card
   - If declined by all: Goes to bottom of draw pile

4. **Dealer Rotation:** After each round, randomly select new dealer

**Continue until:** Showdown is called or deck exhausted

### Phase 3: Showdown

**Who Can Call Showdown:**
- Any player who has declared a suit
- Must have minimum 27 points using Hoarder's Multiplier calculation
- **Blitz Showdown:** Can be called immediately after initial declaration (if minimum 27 points)

**Showdown Process:**
1. All players reveal their hands
2. Each player calculates their score (see Scoring System below)
3. Showdown caller pays winners the difference in scores
4. Players who never declared pay penalties to everyone else

**Important:** If a player has accumulated penalties, their positive score must exceed penalties to call valid Showdown.

---

## 📊 Scoring System

### For Players Who Declared a Suit

**Step 1: Calculate Positive Score (Hoarder's Multiplier)**

1. **Identify Sequences:** Find all sequences of consecutive cards in declared suit
   - Sequences can wrap around: A-K or 3-2-A
   - Each sequence calculated separately

2. **Calculate Sequence Score:** For each sequence:
   ```
   Sequence Score = (Sum of card values in sequence) × (Number of cards in sequence)
   ```

3. **Total Positive Points:** Sum of all sequence scores

**Example:**
- Hand: A♠, K♠, 2♠, 3♠, 4♠, 5♠ (declared Spades)
- Sequence 1 (A-K): (14+13) × 2 = 54
- Sequence 2 (2-3-4-5): (2+3+4+5) × 4 = 56
- Total Positive Points: 54 + 56 = 110

**Step 2: Calculate Penalty**

- Sum of values of all non-declared suit cards

**Step 3: Final Score**

```
Final Score = Positive Points - Penalty
```

**Example:**
- Hand: A♠, K♠, 2♠, 3♥, 4♦ (declared Spades)
- Positive: A-K sequence = 54
- Penalty: 3♥ (3) + 4♦ (4) = 7
- Final Score: 54 - 7 = 47

### For Players Who Did NOT Declare a Suit

**Step 1: Calculate Negative Score (Same Hoarder's Multiplier)**

1. **Identify Sequences:** Find all sequences of consecutive cards in ANY suit
   - A-K wraps around to 2
   - Each sequence calculated separately

2. **Calculate Sequence Score:** Same as declared players

3. **Total Negative Points:** `-(Sum of all sequence scores)`

**If No Sequences:**
- Sum face values of all cards as negative points
- Formula: `-(Sum of all card values)`

**Examples:**

**With Sequences:**
- Hand: A♠, K♠, 2♥, 3♥, 4♥, 5♥
- Sequence 1 (A-K): (14+13) × 2 = 54
- Sequence 2 (2-3-4-5): (2+3+4+5) × 4 = 56
- Total Negative Points: -(54 + 56) = -110

**Without Sequences:**
- Hand: J♥, 9♦, 7♠, 4♣, 3♣
- Total Negative Points: -(11 + 9 + 7 + 4 + 3) = -34

---

## 🏗️ Unity GameMode Implementation

### ClaimGameMode Properties

```typescript
class ClaimGameMode extends GameMode {
  // Core Game Configuration
  gameName: "Claim"
  maxPlayers: 4
  numberOfCards: 3
  maxRounds: undefined // No round limit
  turnDuration: 60 // seconds
  
  // Card System
  useTrump: false // Claim doesn't use trump cards
  useMagicCards: false
  
  // Deck Configuration
  drawFromDeckAllowed: true
  
  // Betting (if implemented)
  initialPlayerCoins: undefined // No coin system in Claim
  baseBet: undefined
}
```

### GameRulesContainer (LLM and Player Versions)

**LLM Version (Detailed for AI):**
```
Claim is a card game where players compete to win rounds by playing the highest card or making strategic decisions.

RULES:
1. Each player receives 3 cards at the start of the game
2. Initial Declaration Phase: All players simultaneously decide whether to declare a suit (30-second countdown)
   - Declare: Choose a suit and optionally place face-up cards of that suit
   - Don't Declare: Take immediate penalty based on highest card value
3. Floor Card Rounds:
   - Dealer reveals one Floor Card each round
   - Players take turns: Pick Up, Decline, Declare Intent (if not declared), Call Showdown
   - If Floor Card not picked up, goes to bottom of draw pile
4. Showdown:
   - Any declared player can call Showdown if they have minimum 27 points
   - Blitz Showdown: Can be called immediately after initial declaration
   - All players reveal hands and calculate scores
5. Scoring (Hoarder's Multiplier):
   - Declared Players: Find sequences in declared suit, calculate (Sum × Count) for each, sum all sequences, subtract penalties
   - Undeclared Players: Same calculation but all scores negative, or sum face values if no sequences
   - A-K wraps around to 2 for sequences
6. Payment: Showdown caller pays winners difference in scores, undeclared players pay penalties to everyone

STRATEGY CONSIDERATIONS:
- Evaluate hand strength before declaring suit
- Consider opponent actions and declared intents (suit lock)
- Bluffing can be effective but risky
- Track cards played to estimate remaining high cards
- Manage risk vs reward when declaring intent
- Undeclared players accumulate penalties each round
```

**Player Version (Concise for Players):**
```
Claim Card Game Rules:
- 4 players, 3 cards each
- Initial Declaration: Declare a suit or take penalty (30-second countdown)
- Floor Card Rounds: Pick up or decline Floor Cards, declare suit anytime, call Showdown when ready
- Showdown: Declared players need minimum 27 points, all reveal hands
- Scoring: Sequences in declared suit earn points (Sum × Count), non-suit cards are penalties
- Undeclared Players: All scores negative, accumulate penalties each round
- Ace is highest (14), 2 is lowest (2)
- Spades > Hearts > Diamonds > Clubs for tie-breaking
```

### Move Validity Conditions

```typescript
moveValidityConditions: {
  PICK_UP: "Valid when there's a Floor Card"
  DECLINE: "Always valid during Floor Card phase"
  DECLARE_INTENT: "Valid if player hasn't declared a suit yet"
  CALL_SHOWDOWN: "Valid if player has declared suit and has minimum 27 points"
  SHOW_HAND: "Valid during Showdown"
}
```

### Strategy Tips

```typescript
strategyTips: [
  "Pay attention to opponent declarations (suit lock prevents multiple players from same suit)",
  "Evaluate hand strength before declaring (penalty for undeclared players accumulates)",
  "Consider Floor Cards strategically (pick up cards of your declared suit, decline others)",
  "Track cards played to estimate remaining high cards in your suit",
  "Don't be afraid to fold/decline if Floor Card doesn't help",
  "Manage risk vs reward when calling Showdown (must have minimum 27 points)",
  "Undeclared players should declare as soon as possible to stop penalty accumulation"
]
```

---

## 📦 Rules Asset Implementation

### ClaimRulesAsset Structure

```typescript
@Serializable()
class ClaimRulesAsset extends RulesAsset {
  metadata: {
    gameId: "claim"
    schemaVersion: 1
    displayName: "Claim Rules"
  }
  
  // Game Rules (LLM and Player versions)
  rules: GameRulesContainer
  
  // Scoring System
  scoringSystem: {
    type: "hoarders_multiplier"
    sequenceCalculation: {
      formula: "(Sum of card values) × (Number of cards)"
      wraparound: ["A-K", "3-2-A"] // Ace-King wraps to 2
    }
    minimumShowdownPoints: 27
    cardValues: {
      A: 14, K: 13, Q: 12, J: 11,
      10: 10, 9: 9, 8: 8, 7: 7, 6: 6,
      5: 5, 4: 4, 3: 3, 2: 2
    }
  }
  
  // Move Validity
  moveValidity: MoveValidityConditions
  
  // Strategy Tips
  strategyTips: string[]
  
  // Game Flow
  gameFlow: {
    phases: ["initial_declaration", "floor_card_rounds", "showdown"]
    initialDeclarationTimeout: 30 // seconds
    dealerRotation: "random_per_round"
  }
}
```

---

## 🎯 BaseBonusRule Classes Needed

**Note:** Claim uses a custom Hoarder's Multiplier scoring system, not traditional poker hands. However, if implementing bonus rules for sequences, consider:

### Potential Rule Classes (Optional)

**These are optional** - Claim's primary scoring is through sequences, not traditional poker hands:

1. **SequenceRule** (BaseBonusRule)
   - Detects sequences of consecutive cards in declared suit
   - Calculates: (Sum × Count) for each sequence
   - Priority: 100 (high priority for Claim)

2. **WraparoundSequenceRule** (BaseBonusRule)
   - Detects A-K and 3-2-A wraparound sequences
   - Special handling for wraparound logic
   - Priority: 95

**However:** The main scoring logic for Claim should be implemented in `ScoreCalculator` class (not as BaseBonusRule), since it's game-specific and not a general "hand pattern" like poker hands.

**Reference:** Unity doesn't have Claim-specific BaseBonusRule classes. Claim's scoring is handled by game-specific logic in `ScoreCalculator.ts`.

---

## 📝 Implementation Checklist

### Step 1: Create ClaimRulesAsset

- [ ] Create `ClaimRulesAsset.ts` extending `RulesAsset`
- [ ] Mark as `@Serializable()`
- [ ] Add `metadata` property
- [ ] Add `rules` property (GameRulesContainer with LLM and Player versions)
- [ ] Add `scoringSystem` property with Hoarder's Multiplier configuration
- [ ] Add `moveValidity` property
- [ ] Add `strategyTips` property
- [ ] Add `gameFlow` property

### Step 2: Create ScoreCalculator Logic

- [ ] Create `ClaimScoreCalculator.ts` (extends `ScoreCalculator`)
- [ ] Implement `calculateScore()` method:
  - For declared players: Find sequences in declared suit, calculate (Sum × Count), subtract penalties
  - For undeclared players: Same but negative, or sum face values if no sequences
- [ ] Implement `findSequences()` method with A-K wraparound support
- [ ] Implement `calculatePenalty()` method for non-suit cards

### Step 3: Create Asset File

- [ ] Create `public/GameMode/claimRules.asset` (JSON)
- [ ] Populate with Claim rules from this document
- [ ] Link from `claim.asset` (GameMode references Rules)

### Step 4: Update ClaimGameMode

- [ ] Update `ClaimGameMode` to reference `ClaimRulesAsset`
- [ ] Update `getGameRules()` to load from asset
- [ ] Update `getScoringSystem()` to return Hoarder's Multiplier config

---

## 🔗 Related Documentation

### Main Hub
- [../../README.md](../../README.md) - Main ocentra documentation hub

### Rules System
- [../README.md](../README.md) - Rules system overview

### Implementation Phases
- [../../Phases/phase-07-rules-asset-system.md](../../Phases/phase-07-rules-asset-system.md) - Rules Asset System (this phase)

### Game Data
- [../../GameData/Unity-Asset-System-Analysis.md](../../GameData/Unity-Asset-System-Analysis.md) - Unity asset system analysis

### References (For AI/Developer Reference Only)
- Unity `ThreeCardGameMode.cs` - Example GameMode implementation (for reference only)
- Unity `BaseBonusRule.cs` - Base rule class (for reference only)
- `.kiro/specs/claim-card-game/core-rules.md` - Original Claim rules specification

---

**Last Updated:** 2025-01-20  
**Status:** Specification Complete - Ready for Phase 7 Implementation

