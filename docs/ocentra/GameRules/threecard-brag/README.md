# Three Card Brag Rules

**Purpose:** Complete, atomic documentation for implementing Three Card Brag using Unity's GameMode/Rules system. This document contains all information needed to implement Three Card Brag rules without referencing Unity code during implementation.

**Status:** Specification Complete - Ready for Phase 7 Implementation

**Reference:** Unity implementation in `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs` (for reference only, not needed during implementation)

---

## 📋 Table of Contents

1. [Game Rules Overview](#game-rules-overview)
2. [Game Setup](#game-setup)
3. [Hand Rankings](#hand-rankings)
4. [Game Flow](#game-flow)
5. [Betting System](#betting-system)
6. [Trump Card System](#trump-card-system)
7. [Unity GameMode Implementation](#unity-gamemode-implementation)
8. [Rules Asset Implementation](#rules-asset-implementation)
9. [BaseBonusRule Classes Needed](#basebonusrule-classes-needed)

---

## 🎮 Game Rules Overview

**Game Name:** Three Card Brag

**Players:** 2-13 players (52 cards ÷ (3 card + 1 minimum draw))

**Deck:** Standard 52-card deck

**Objective:** Make the best three-card hand while betting and bluffing to victory.

**Key Mechanics:**
- Players dealt 3 cards
- Betting rounds with blind/seen betting
- Draw new cards or swap cards from floor
- Trump card system (can replace any card)
- Traditional poker hand rankings adapted for 3 cards

---

## 🎲 Game Setup

### Initial Setup

1. **Dealing:**
   - Each player receives **3 cards** face down
   - Remaining cards form draw pile

2. **Player Coins:**
   - Each player starts with **10,000 coins**
   - Base bet: **5 coins**

3. **Trump Card:**
   - One card designated as Trump Card (can replace any card)
   - Trump card revealed at start of round

### Card Values

- **Ace (A):** 14 (highest)
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

## 🃏 Hand Rankings

**From Highest to Lowest:**

1. **Three of a Kind (Prial):** Three cards of the same rank
   - Example: J♠, J♦, J♣
   - Highest: Three 3s (3-3-3), then A-A-A, K-K-K, etc.

2. **Royal Flush:** Three consecutive cards of the same suit, starting from Ace
   - Example: A♠, K♠, Q♠
   - Only one possible: A-K-Q of same suit

3. **Straight Flush:** Three consecutive cards of the same suit
   - Example: 9♠, 10♠, J♠
   - Examples: A-2-3, K-Q-J, Q-J-10, etc.

4. **Straight (Run):** Three consecutive cards of different suits
   - Example: 4♠, 5♣, 6♦
   - Not all same suit, but consecutive ranks

5. **Flush:** Three cards of the same suit, not in sequence
   - Example: 2♠, 5♠, 9♠
   - Same suit but not consecutive

6. **Pair:** Two cards of the same rank
   - Example: Q♠, Q♦, 7♣
   - Pair of Queens, with one other card

7. **High Card:** No matching cards or sequence
   - Example: A♠, 7♦, 4♣ (Ace high)
   - Highest single card determines hand value

### Hand Comparison Rules

- **Higher hand rank beats lower hand rank**
- **Same rank:** Compare by highest card in hand
- **Same highest card:** Compare by second highest, then third
- **Still tied:** Suit priority determines winner (Spades > Hearts > Diamonds > Clubs)

---

## 🔄 Game Flow

### Round Structure

**Phase 1: Initial Betting (Blind or See)**

1. **Blind Betting Option:**
   - Players can bet **blind** (without seeing hand)
   - Blind bet = **BaseBet × BaseBlindMultiplier** (default: 5 × 1 = 5 coins)
   - Doubles the current bet for other players

2. **See Hand Option:**
   - Players can choose to **see their hand** before betting
   - Once seen, must bet **double the current bet**
   - Cannot go back to blind betting

3. **Betting Actions:**
   - **Fold:** Give up hand and forfeit any bets
   - **Call:** Match current bet
   - **Raise:** Increase the bet (must have enough coins)
   - **Check:** Pass when no bet to call

**Phase 2: Card Actions**

1. **Draw from Deck:**
   - If no floor card, player can draw new card from deck
   - Reveals one card face-up on floor

2. **Pick from Floor:**
   - If floor card exists, player can pick it up
   - Player must swap one card from hand with floor card
   - Discard swapped card

3. **Swap Card:**
   - After drawing or picking from floor, player swaps card
   - Can only swap one card per turn

**Phase 3: Final Betting**

After card actions:
- Player must decide: **Bet, Fold, Call, or Raise**
- Betting continues until all players fold or showdown

**Phase 4: Showdown**

- Players reveal hands
- Highest hand wins pot
- Game ends when player runs out of coins or after set rounds (default: 10 rounds)
- Trailing player can continue if they have more coins

---

## 💰 Betting System

### Betting Mechanics

**Initial Bet:**
- Base bet: **5 coins**

**Blind Betting:**
- Player bets blind: **5 coins** (BaseBet × BaseBlindMultiplier = 5 × 1)
- Doubles the bet for other players: **10 coins**

**Seen Hand Betting:**
- Player sees hand: Must bet **double current bet**
- If blind bet is 10 coins, seen player bets **20 coins**

### Betting Actions

1. **Fold:**
   - Give up hand
   - Forfeit any bets already placed
   - Cannot win pot

2. **Call:**
   - Match current bet
   - Stay in hand

3. **Raise:**
   - Increase the bet
   - Other players must match new bet to stay in

4. **Check:**
   - Pass when no bet to call
   - Only valid when no one has bet yet

### Pot Distribution

- **Winner takes entire pot**
- If multiple players tie: Pot split evenly
- If all players fold except one: That player wins without showing

---

## 🃏 Trump Card System

### Trump Card Mechanics

**Trump Card:**
- One card designated as Trump at start of round
- Trump card can **replace any card** to complete sequences or sets

**Example:**
- Trump: 6♥
- Hand: 2♠, 3♠, 6♥
- Trump 6♥ converts to 4♠ to make Straight Flush: 2♠, 3♠, 4♠

### Trump Card Positions

**Trump in Middle:**
- Trump card is "in the middle" if surrounded by cards that form continuous sequence
- Example: 5♠, 6♥ (Trump), 7♠
- Trump 6♥ is in the middle of sequence 5-6-7

**Adjacent to Trump:**
- Cards adjacent to Trump card provide special point bonus
- Even if they don't form valid hand
- Example: 2♠, 3♠, 7♥ (7♥ is adjacent to Trump 6♥)
- Receives bonus points even though no valid sequence

### Trump Bonus Values

- **Three of a Kind with Trump:** Base bonus + Trump bonus
- **Trump in Middle:** Additional bonus points
- **Adjacent to Trump:** Bonus points even without valid hand

---

## 🏗️ Unity GameMode Implementation

### ThreeCardGameMode Properties

```typescript
class ThreeCardGameMode extends GameMode {
  // Core Game Configuration
  gameName: "Three Card Brag"
  maxPlayers: 13 // 52 / (3 card + 1 minimum draw)
  numberOfCards: 3
  maxRounds: 10
  turnDuration: 60 // seconds
  
  // Betting Configuration
  initialPlayerCoins: 10000
  baseBet: 5
  baseBlindMultiplier: 1
  
  // Card System
  useTrump: true
  useMagicCards: true
  
  // Deck Configuration
  drawFromDeckAllowed: true
}
```

### GameRulesContainer (LLM and Player Versions)

**LLM Version (Detailed for AI):**
```
Three Card Brag: 3 cards dealt each round. Bet blind or see hand. Blind bet doubles, seen hand bet doubles current bet. Choose to fold, call, raise. Draw new card to floor. Pick and swap card, then bet, fold, call, or raise. Highest hand wins (A high). Tie: highest card wins. Game ends when player runs out of coins or after set rounds. Trailing player can continue if more coins. Start with 10000 coins.

Special Rules:
- Three of a Kind: Three cards of same rank (J♠, J♦, J♣)
- Royal Flush: A-K-Q of same suit (A♠, K♠, Q♠)
- Straight Flush: Three consecutive cards of same suit (9♠, 10♠, J♠)
- Straight: Three consecutive cards of different suits (4♠, 5♣, 6♦)
- Flush: Three cards of same suit, not in sequence (2♠, 5♠, 9♠)
- Pair: Two cards of same rank (Q♠, Q♦, 7♣)
- High Card: Highest single card (A♠, 7♦, 4♣ - A high)

Trump: Trump card can replace any card. Example: Trump 6♥, Hand 2♠, 3♠, 6♥ → Trump becomes 4♠ for straight flush 2♠, 3♠, 4♠.

Trump in Middle: 5♠, 6♥ (Trump), 7♠ - Trump is in middle of sequence.

Adjacent to Trump: 2♠, 3♠, 7♥ (7♥ next to Trump 6♥ gets points, but no valid sequence).
```

**Player Version (Concise for Players):**
```
Three Card Brag Rules:
- Each player gets 3 cards
- Bet blind (without seeing) or see hand first
- Blind bet doubles, seen hand bet doubles current bet
- Fold, call, or raise during betting
- Draw new card to floor or pick and swap floor card
- Highest hand wins: Three of a Kind > Royal Flush > Straight Flush > Straight > Flush > Pair > High Card
- Trump card can replace any card to complete hands
- Ace is highest, 2 is lowest
```

### Move Validity Conditions

```typescript
moveValidityConditions: {
  FOLD: "Always valid"
  CALL: "Valid when there's a bet to call"
  RAISE: "Valid when you have enough coins to raise"
  CHECK: "Valid when there's no bet to call"
  BET_BLIND: "Valid only if you haven't seen your hand"
  SEE_HAND: "Valid only if you haven't seen your hand"
  DRAW_FROM_DECK: "Valid when there's no floor card"
  PICK_FROM_FLOOR: "Valid when there's a floor card"
  SWAP_CARD: "Valid after drawing or picking from floor"
  SHOW_HAND: "Valid at any time, ends the round"
}
```

### Strategy Tips

```typescript
strategyTips: [
  "Pay attention to your opponents' betting patterns",
  "Use blind betting strategically to bluff or build the pot",
  "Consider the odds of improving your hand when deciding to draw or swap cards",
  "Don't be afraid to fold if you have a weak hand and bets are high",
  "Manage your coins wisely to stay in game for multiple rounds",
  "Trump cards can turn weak hands into strong hands - use strategically",
  "Bluffing can be effective, but risky - read your opponents"
]
```

### Bluff Setting Conditions

```typescript
bluffSettingConditions: {
  EASY: "Rarely bluff"
  MEDIUM: "Occasionally bluff when pot odds are favorable"
  HARD: "Frequently bluff and try to read opponent's patterns"
}
```

### Example Hand Odds

```typescript
exampleHandOdds: {
  STRONG_HAND: "Three of a Kind, Royal Flush, Straight Flush"
  MEDIUM_HAND: "Pair or Flush"
  WEAK_HAND: "High Card or No Bonus"
}
```

---

## 📦 Rules Asset Implementation

### ThreeCardBragRulesAsset Structure

```typescript
@Serializable()
class ThreeCardBragRulesAsset extends RulesAsset {
  metadata: {
    gameId: "threecard-brag"
    schemaVersion: 1
    displayName: "Three Card Brag Rules"
  }
  
  // Game Rules (LLM and Player versions)
  rules: GameRulesContainer
  
  // Hand Rankings (from highest to lowest)
  handRankings: [
    "THREE_OF_A_KIND",      // Priority: 91
    "ROYAL_FLUSH",          // Priority: 95
    "STRAIGHT_FLUSH",       // Priority: 93
    "STRAIGHT",             // Priority: 89
    "FLUSH",                // Priority: 87
    "PAIR",                 // Priority: 87
    "HIGH_CARD"             // Priority: 85
  ]
  
  // Betting System
  betting: {
    initialPlayerCoins: 10000
    baseBet: 5
    baseBlindMultiplier: 1
    blindBetFormula: "baseBet × baseBlindMultiplier"
    seenHandBetFormula: "currentBet × 2"
  }
  
  // Trump System
  trumpSystem: {
    enabled: true
    trumpInMiddleBonus: number
    adjacentToTrumpBonus: number
    threeOfKindWithTrumpBonus: number
  }
  
  // Move Validity
  moveValidity: MoveValidityConditions
  
  // Strategy Tips
  strategyTips: string[]
  
  // Bluff Settings
  bluffSettings: BluffSettingConditions
}
```

---

## 🎯 BaseBonusRule Classes Needed

### Required Rule Classes

**Each rule extends `BaseBonusRule` and implements:**

1. **ThreeOfAKind** (Priority: 91, Bonus: 125)
   - `MinNumberOfCard`: 3
   - `Evaluate()`: Checks if hand has three cards of same rank
   - `CalculateBonus()`: `BonusValue × rankValue × 3`
   - With Trump: `BonusValue × (pairRank + trumpRank)`
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/ThreeOfAKind.cs`

2. **RoyalFlush** (Priority: 95, Bonus: varies)
   - `MinNumberOfCard`: 3
   - `Evaluate()`: Checks if hand is A-K-Q of same suit
   - `CalculateBonus()`: High bonus for Royal Flush
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/RoyalFlush.cs`

3. **StraightFlush** (Priority: 93, Bonus: varies)
   - `MinNumberOfCard`: 3
   - `Evaluate()`: Checks if hand is three consecutive cards of same suit
   - `CalculateBonus()`: Sequence-based bonus
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/StraightFlush.cs`

4. **Straight** (Priority: 89, Bonus: varies)
   - `MinNumberOfCard`: 3
   - `Evaluate()`: Checks if hand is three consecutive cards (different suits)
   - `CalculateBonus()`: Sequence-based bonus
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/SameColorsSequence.cs`

5. **Flush** (Priority: 87, Bonus: varies)
   - `MinNumberOfCard`: 3
   - `Evaluate()`: Checks if hand has three cards of same suit (not consecutive)
   - `CalculateBonus()`: Suit-based bonus
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/Flush.cs`

6. **PairRule** (Priority: 87, Bonus: 100)
   - `MinNumberOfCard`: 3
   - `Evaluate()`: Checks if hand has pair (two cards of same rank)
   - `CalculateBonus()`: `BonusValue × rankValue × 2`
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/PairRule.cs`

7. **HighCard** (Priority: 85, Bonus: varies)
   - `MinNumberOfCard`: 3
   - `Evaluate()`: Always true (fallback)
   - `CalculateBonus()`: Based on highest card value
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/HighCard.cs`

### Rule Implementation Pattern

**Each rule implements:**

```typescript
class ThreeOfAKind extends BaseBonusRule {
  minNumberOfCard: 3
  bonusValue: 125
  priority: 91
  ruleName: "ThreeOfAKind"
  
  evaluate(hand: Hand, out bonusDetail: BonusDetail): boolean {
    // Check if hand has three of a kind
    // Consider trump card if enabled
    // Calculate bonus
    // Return BonusDetail
  }
  
  calculateBonus(hand: Hand, trumpCard: Card): BonusDetail {
    // Calculate base bonus
    // Add trump bonus if applicable
    // Return BonusDetail with descriptions
  }
  
  createExampleHand(handSize: number, trumpCard?: string): string[] {
    // Generate example hand that matches this rule
  }
}
```

**Reference Unity Files:**
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/ThreeOfAKind.cs`
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/PairRule.cs`
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/Flush.cs`
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/StraightFlush.cs`
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/RoyalFlush.cs`
- `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/HighCard.cs`

---

## 📝 Implementation Checklist

### Step 1: Create ThreeCardBragRulesAsset

- [ ] Create `ThreeCardBragRulesAsset.ts` extending `RulesAsset`
- [ ] Mark as `@Serializable()`
- [ ] Add `metadata` property
- [ ] Add `rules` property (GameRulesContainer with LLM and Player versions)
- [ ] Add `handRankings` property
- [ ] Add `betting` property
- [ ] Add `trumpSystem` property
- [ ] Add `moveValidity` property
- [ ] Add `strategyTips` property
- [ ] Add `bluffSettings` property

### Step 2: Create BaseBonusRule Classes

- [ ] Create `ThreeOfAKind.ts` extending `BaseBonusRule`
- [ ] Create `RoyalFlush.ts` extending `BaseBonusRule`
- [ ] Create `StraightFlush.ts` extending `BaseBonusRule`
- [ ] Create `Straight.ts` extending `BaseBonusRule`
- [ ] Create `Flush.ts` extending `BaseBonusRule`
- [ ] Create `PairRule.ts` extending `BaseBonusRule`
- [ ] Create `HighCard.ts` extending `BaseBonusRule`
- [ ] Implement `evaluate()`, `calculateBonus()`, `createExampleHand()` for each

### Step 3: Create Asset File

- [ ] Create `public/GameMode/threeCardBragRules.asset` (JSON)
- [ ] Populate with Three Card Brag rules from this document
- [ ] Link from `threeCardBrag.asset` (GameMode references Rules)

### Step 4: Update ThreeCardGameMode

- [ ] Update `ThreeCardGameMode` to reference `ThreeCardBragRulesAsset`
- [ ] Update `getGameRules()` to load from asset
- [ ] Update `getBonusRules()` to return list of BaseBonusRule instances
- [ ] Update hand evaluation to use BaseBonusRule classes

---

## 🔗 Related Documentation

### Main Hub
- [../../README.md](../../README.md) - Main ocentra documentation hub

### Rules System
- [../README.md](../README.md) - Rules system overview

### Implementation Phases
- [../../Phases/phase-07-rules-asset-system.md](../../Phases/phase-07-rules-asset-system.md) - Rules Asset System (this phase)

### GameMode
- [../../Gamemode/gamemode-initialization-pattern.md](../../Gamemode/gamemode-initialization-pattern.md) - How GameMode initializes

### References (For AI/Developer Reference Only)
- Unity `ThreeCardGameMode.cs` - Unity Three Card Brag implementation (for reference only)
- Unity `BaseBonusRule.cs` - Base rule class (for reference only)
- Unity `ThreeOfAKind.cs`, `PairRule.cs`, `Flush.cs`, etc. - Concrete rule implementations (for reference only)

---

**Last Updated:** 2025-01-20  
**Status:** Specification Complete - Ready for Phase 7 Implementation

