# Texas Hold'em Poker Rules

**Purpose:** Complete, atomic documentation for implementing Texas Hold'em poker using Unity's GameMode/Rules system. This document contains all information needed to implement Texas Hold'em rules without referencing external sources during implementation.

**Status:** Specification Complete - Ready for Phase 7 Implementation

**Reference:** Standard Texas Hold'em poker rules (for reference only, not needed during implementation)

---

## 📋 Table of Contents

1. [Game Rules Overview](#game-rules-overview)
2. [Game Setup](#game-setup)
3. [Hand Rankings](#hand-rankings)
4. [Game Flow](#game-flow)
5. [Betting Rounds](#betting-rounds)
6. [Unity GameMode Implementation](#unity-gamemode-implementation)
7. [Rules Asset Implementation](#rules-asset-implementation)
8. [BaseBonusRule Classes Needed](#basebonusrule-classes-needed)

---

## 🎮 Game Rules Overview

**Game Name:** Texas Hold'em Poker

**Players:** 2-10 players (optimal: 6-9 players)

**Deck:** Standard 52-card deck (no jokers)

**Objective:** Make the best five-card poker hand using any combination of your two hole cards and five community cards.

**Key Mechanics:**
- Each player receives 2 private cards (hole cards)
- 5 community cards dealt face-up in stages (Flop, Turn, River)
- Betting rounds before and after each card reveal
- Best five-card hand wins the pot

---

## 🎲 Game Setup

### Initial Setup

1. **Blind System:**
   - **Small Blind:** Player to left of dealer posts small blind (typically half the minimum bet)
   - **Big Blind:** Next player posts big blind (typically minimum bet)
   - Dealer button rotates clockwise each hand

2. **Dealing:**
   - Each player receives **2 hole cards** face down
   - Remaining cards form deck for community cards

3. **Betting:**
   - Minimum bet: Typically matches big blind
   - Maximum bet: Pot size or player's remaining chips

### Card Values

- **Ace (A):** Can be high (14) or low (1) for straights
- **King (K):** 13
- **Queen (Q):** 12
- **Jack (J):** 11
- **10-2:** Face value (10, 9, 8, 7, 6, 5, 4, 3, 2)

### Suit Priority (for tie-breaking)

All suits equal (no suit priority in standard Texas Hold'em)
- For split pots: All suits are equal

---

## 🃏 Hand Rankings

**From Highest to Lowest:**

1. **Royal Flush:** A-K-Q-J-10 of the same suit
   - Example: A♠, K♠, Q♠, J♠, 10♠
   - Highest possible hand

2. **Straight Flush:** Five consecutive cards of the same suit
   - Example: 9♠, 10♠, J♠, Q♠, K♠
   - If multiple: Highest card wins

3. **Four of a Kind (Quads):** Four cards of the same rank
   - Example: Q♠, Q♥, Q♦, Q♣, 7♠
   - If multiple: Higher rank wins

4. **Full House:** Three of a kind + One pair
   - Example: J♠, J♥, J♦, 5♣, 5♠
   - If multiple: Compare three of a kind first, then pair

5. **Flush:** Five cards of the same suit, not in sequence
   - Example: A♠, 9♠, 7♠, 4♠, 2♠
   - If multiple: Highest card wins, then second highest, etc.

6. **Straight:** Five consecutive cards of different suits
   - Example: 9♠, 10♥, J♦, Q♣, K♠
   - Ace can be high (A-K-Q-J-10) or low (A-2-3-4-5)
   - If multiple: Highest card wins

7. **Three of a Kind (Trips):** Three cards of the same rank
   - Example: 7♠, 7♥, 7♦, K♠, 2♠
   - If multiple: Higher rank wins

8. **Two Pair:** Two pairs of cards
   - Example: 10♠, 10♥, 5♦, 5♣, K♠
   - If multiple: Compare higher pair first, then lower pair, then kicker

9. **One Pair:** Two cards of the same rank
   - Example: A♠, A♥, K♠, Q♦, 10♠
   - If multiple: Compare pair rank, then kickers

10. **High Card:** No matching cards or sequence
    - Example: A♠, K♦, 8♠, 5♣, 2♥ (Ace high)
    - Compare highest card, then second highest, etc.

### Hand Comparison Rules

- **Higher hand rank beats lower hand rank**
- **Same rank:** Compare by highest card in combination
- **Still tied:** Compare kickers (remaining cards)
- **Still tied:** Split pot (all suits equal)

---

## 🔄 Game Flow

### Hand Structure

**Phase 1: Pre-Flop (After Hole Cards)**

1. **Blinds Posted:**
   - Small blind posted
   - Big blind posted

2. **Betting Round:**
   - Starts with player after big blind
   - Actions: Fold, Call (match big blind), Raise
   - Continues until all players act

**Phase 2: The Flop (First 3 Community Cards)**

1. **Burn One Card:** Dealer burns (discards) top card

2. **Deal Flop:** Three community cards dealt face-up

3. **Betting Round:**
   - Starts with first player to left of dealer (if still in hand)
   - Actions: Check, Bet, Fold, Call, Raise
   - Continues until all players act

**Phase 3: The Turn (Fourth Community Card)**

1. **Burn One Card:** Dealer burns top card

2. **Deal Turn:** One community card dealt face-up (fourth card total)

3. **Betting Round:**
   - Same as Flop betting round
   - Actions: Check, Bet, Fold, Call, Raise

**Phase 4: The River (Fifth Community Card)**

1. **Burn One Card:** Dealer burns top card

2. **Deal River:** One community card dealt face-up (fifth card total)

3. **Final Betting Round:**
   - Same as previous betting rounds
   - Actions: Check, Bet, Fold, Call, Raise

**Phase 5: Showdown**

1. **Reveal Hands:**
   - All remaining players reveal their hole cards
   - Best five-card hand wins

2. **Pot Distribution:**
   - Winner takes entire pot
   - If tie: Pot split equally

3. **Dealer Button Moves:**
   - Dealer button moves clockwise
   - Next hand begins

---

## 💰 Betting Rounds

### Betting Actions

1. **Check:**
   - Pass when no bet to call
   - Only valid when no one has bet yet

2. **Bet:**
   - Place first bet in betting round
   - Minimum: Big blind amount
   - Maximum: Pot size or player's remaining chips

3. **Call:**
   - Match current bet
   - Stay in hand

4. **Raise:**
   - Increase the bet
   - Minimum raise: Must be at least double the current bet
   - Other players must match new bet to stay in

5. **Fold:**
   - Give up hand
   - Forfeit any bets already placed
   - Cannot win pot

6. **All-In:**
   - Bet all remaining chips
   - Other players can call with remaining chips
   - Side pot created if multiple all-ins

### Betting Limits

**No Limit:**
- Players can bet any amount up to their remaining chips
- Most common variant

**Pot Limit:**
- Maximum bet = Current pot size
- Less common variant

**Fixed Limit:**
- Fixed bet sizes for each round
- Less common variant

### Pot Distribution

**Main Pot:**
- Standard pot for all players who can match bets

**Side Pot:**
- Created when player goes all-in
- Only players who matched all-in bet eligible
- Separate pot for remaining bets

---

## 🏗️ Unity GameMode Implementation

### TexasHoldemGameMode Properties

```typescript
class TexasHoldemGameMode extends GameMode {
  // Core Game Configuration
  gameName: "Texas Hold'em"
  maxPlayers: 10
  numberOfCards: 2 // Hole cards per player
  maxRounds: undefined // No round limit
  turnDuration: 30 // seconds
  
  // Community Cards
  communityCards: 5 // Flop (3) + Turn (1) + River (1)
  
  // Betting Configuration
  initialPlayerCoins: 10000 // Starting chips
  smallBlind: 25
  bigBlind: 50
  bettingLimit: "no_limit" // or "pot_limit", "fixed_limit"
  
  // Card System
  useTrump: false // No trump in Texas Hold'em
  useMagicCards: false
  
  // Deck Configuration
  drawFromDeckAllowed: true
}
```

### GameRulesContainer (LLM and Player Versions)

**LLM Version (Detailed for AI):**
```
Texas Hold'em Poker: 2 hole cards dealt to each player, 5 community cards dealt in stages (Flop: 3, Turn: 1, River: 1). Players make best five-card hand using any combination of hole cards and community cards.

RULES:
1. Each player receives 2 hole cards face down
2. Pre-Flop Betting: Small blind and big blind posted, betting round starts after big blind
3. The Flop: 3 community cards dealt face-up, betting round
4. The Turn: 1 community card dealt face-up (4th total), betting round
5. The River: 1 community card dealt face-up (5th total), final betting round
6. Showdown: All remaining players reveal hands, best five-card hand wins
7. Hand Rankings: Royal Flush > Straight Flush > Four of a Kind > Full House > Flush > Straight > Three of a Kind > Two Pair > One Pair > High Card
8. Betting Actions: Check, Bet, Call, Raise, Fold, All-In
9. Betting Limits: No Limit (bet any amount up to remaining chips)

STRATEGY CONSIDERATIONS:
- Evaluate hand strength with hole cards and community cards
- Consider pot odds and implied odds when betting
- Position matters (late position advantage)
- Reading opponents' betting patterns
- Bluffing can be effective but risky
- Manage chip stack to stay in game
- Bankroll management critical
```

**Player Version (Concise for Players):**
```
Texas Hold'em Poker Rules:
- 2 hole cards per player, 5 community cards (Flop: 3, Turn: 1, River: 1)
- Make best five-card hand using any combination of hole and community cards
- Betting rounds: Pre-Flop, Flop, Turn, River
- Actions: Check, Bet, Call, Raise, Fold, All-In
- Best hand wins pot
- Hand Rankings: Royal Flush > Straight Flush > Four of a Kind > Full House > Flush > Straight > Three of a Kind > Two Pair > One Pair > High Card
```

### Move Validity Conditions

```typescript
moveValidityConditions: {
  CHECK: "Valid when there's no bet to call"
  BET: "Valid when no one has bet yet in this round"
  CALL: "Valid when there's a bet to call"
  RAISE: "Valid when you have enough chips to raise (minimum raise amount)"
  FOLD: "Always valid"
  ALL_IN: "Valid when you have chips remaining"
  SHOW_HAND: "Valid during Showdown"
}
```

### Strategy Tips

```typescript
strategyTips: [
  "Evaluate hand strength with hole cards and potential community cards",
  "Consider position (late position has advantage)",
  "Pot odds and implied odds matter when deciding to call",
  "Reading opponents' betting patterns can reveal hand strength",
  "Bluffing can be effective but must be strategic",
  "Manage chip stack to stay in game multiple hands",
  "Bankroll management is critical for long-term success",
  "Position matters - play tighter in early position",
  "Don't chase weak hands - fold when odds don't favor"
]
```

### Bluff Setting Conditions

```typescript
bluffSettingConditions: {
  EASY: "Rarely bluff, play solid hands"
  MEDIUM: "Occasionally bluff when pot odds are favorable and position is good"
  HARD: "Frequently bluff, read opponents' patterns, advanced strategy"
}
```

### Example Hand Odds

```typescript
exampleHandOdds: {
  STRONG_HAND: "Royal Flush, Straight Flush, Four of a Kind, Full House"
  MEDIUM_HAND: "Flush, Straight, Three of a Kind"
  WEAK_HAND: "Two Pair, One Pair, High Card"
}
```

---

## 📦 Rules Asset Implementation

### TexasHoldemRulesAsset Structure

```typescript
@Serializable()
class TexasHoldemRulesAsset extends RulesAsset {
  metadata: {
    gameId: "texas-holdem"
    schemaVersion: 1
    displayName: "Texas Hold'em Rules"
  }
  
  // Game Rules (LLM and Player versions)
  rules: GameRulesContainer
  
  // Hand Rankings (from highest to lowest)
  handRankings: [
    "ROYAL_FLUSH",        // Priority: 100
    "STRAIGHT_FLUSH",     // Priority: 95
    "FOUR_OF_A_KIND",     // Priority: 90
    "FULL_HOUSE",         // Priority: 85
    "FLUSH",              // Priority: 80
    "STRAIGHT",           // Priority: 75
    "THREE_OF_A_KIND",    // Priority: 70
    "TWO_PAIR",           // Priority: 65
    "ONE_PAIR",           // Priority: 60
    "HIGH_CARD"           // Priority: 55
  ]
  
  // Betting System
  betting: {
    initialPlayerCoins: 10000
    smallBlind: 25
    bigBlind: 50
    bettingLimit: "no_limit" // or "pot_limit", "fixed_limit"
    minimumRaise: "double_current_bet"
  }
  
  // Community Cards
  communityCards: {
    flop: 3
    turn: 1
    river: 1
    total: 5
    burnCard: true // Burn one card before each reveal
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

1. **RoyalFlush** (Priority: 100, Bonus: 1000)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand is A-K-Q-J-10 of same suit
   - `CalculateBonus()`: Highest bonus (Royal Flush)
   - Reference: Standard poker rule

2. **StraightFlush** (Priority: 95, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand is five consecutive cards of same suit
   - `CalculateBonus()`: High bonus based on highest card
   - Reference: Standard poker rule

3. **FourOfAKind** (Priority: 90, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand has four cards of same rank
   - `CalculateBonus()`: Bonus based on rank of four of a kind
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/FourOfAKind.cs`

4. **FullHouse** (Priority: 85, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand has three of a kind + pair
   - `CalculateBonus()`: Bonus based on three of a kind rank
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/FullHouse.cs`

5. **Flush** (Priority: 80, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand has five cards of same suit (not consecutive)
   - `CalculateBonus()`: Bonus based on highest card
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/Flush.cs`

6. **Straight** (Priority: 75, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand has five consecutive cards (different suits)
   - `CalculateBonus()`: Bonus based on highest card
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/SameColorsSequence.cs` (for sequence logic)

7. **ThreeOfAKind** (Priority: 70, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand has three cards of same rank
   - `CalculateBonus()`: Bonus based on rank of three of a kind
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/ThreeOfAKind.cs`

8. **TwoPair** (Priority: 65, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand has two pairs
   - `CalculateBonus()`: Bonus based on higher pair rank
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/MultiplePairs.cs`

9. **OnePair** (Priority: 60, Bonus: varies)
   - `MinNumberOfCard`: 5
   - `Evaluate()`: Checks if hand has one pair
   - `CalculateBonus()`: Bonus based on pair rank
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/PairRule.cs`

10. **HighCard** (Priority: 55, Bonus: varies)
    - `MinNumberOfCard`: 5
    - `Evaluate()`: Always true (fallback)
    - `CalculateBonus()`: Bonus based on highest card
    - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/HighCard.cs`

### Rule Implementation Pattern

**Each rule implements:**

```typescript
class FourOfAKind extends BaseBonusRule {
  minNumberOfCard: 5
  bonusValue: 135 // Base value
  priority: 90
  ruleName: "FourOfAKind"
  
  evaluate(hand: Hand, out bonusDetail: BonusDetail): boolean {
    // Check if hand has four of a kind
    // Calculate bonus based on rank
    // Return BonusDetail
  }
  
  calculateBonus(hand: Hand): BonusDetail {
    // Calculate base bonus based on rank
    // Return BonusDetail with descriptions
  }
  
  createExampleHand(handSize: number): string[] {
    // Generate example hand that matches this rule
    // Example: Q♠, Q♥, Q♦, Q♣, 7♠
  }
}
```

**Note:** Texas Hold'em uses 5-card hands (from 7 total cards: 2 hole + 5 community), so all rules evaluate best 5-card combination.

---

## 📝 Implementation Checklist

### Step 1: Create TexasHoldemRulesAsset

- [ ] Create `TexasHoldemRulesAsset.ts` extending `RulesAsset`
- [ ] Mark as `@Serializable()`
- [ ] Add `metadata` property
- [ ] Add `rules` property (GameRulesContainer with LLM and Player versions)
- [ ] Add `handRankings` property (all 10 rankings)
- [ ] Add `betting` property (blinds, limits)
- [ ] Add `communityCards` property (flop, turn, river)
- [ ] Add `moveValidity` property
- [ ] Add `strategyTips` property
- [ ] Add `bluffSettings` property

### Step 2: Create BaseBonusRule Classes

- [ ] Create `RoyalFlush.ts` extending `BaseBonusRule`
- [ ] Create `StraightFlush.ts` extending `BaseBonusRule`
- [ ] Create `FourOfAKind.ts` extending `BaseBonusRule`
- [ ] Create `FullHouse.ts` extending `BaseBonusRule`
- [ ] Create `Flush.ts` extending `BaseBonusRule`
- [ ] Create `Straight.ts` extending `BaseBonusRule`
- [ ] Create `ThreeOfAKind.ts` extending `BaseBonusRule`
- [ ] Create `TwoPair.ts` extending `BaseBonusRule`
- [ ] Create `OnePair.ts` extending `BaseBonusRule`
- [ ] Create `HighCard.ts` extending `BaseBonusRule`
- [ ] Implement `evaluate()`, `calculateBonus()`, `createExampleHand()` for each

### Step 3: Create Hand Evaluation System

- [ ] Create `TexasHoldemHandEvaluator.ts` (evaluates best 5-card hand from 7 cards)
- [ ] Implement `evaluateBestHand()` method (2 hole + 5 community = best 5-card)
- [ ] Implement hand comparison logic
- [ ] Handle tie-breaking (kickers)

### Step 4: Create Asset File

- [ ] Create `public/GameMode/texasHoldemRules.asset` (JSON)
- [ ] Populate with Texas Hold'em rules from this document
- [ ] Link from `texasHoldem.asset` (GameMode references Rules)

### Step 5: Update TexasHoldemGameMode

- [ ] Update `TexasHoldemGameMode` to reference `TexasHoldemRulesAsset`
- [ ] Update `getGameRules()` to load from asset
- [ ] Update `getBonusRules()` to return list of BaseBonusRule instances
- [ ] Update hand evaluation to use `TexasHoldemHandEvaluator`

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
- Unity `BaseBonusRule.cs` - Base rule class (for reference only)
- Unity `FourOfAKind.cs`, `FullHouse.cs`, `Flush.cs`, etc. - Concrete rule implementations (for reference only)
- Standard Texas Hold'em poker rules - For general poker knowledge

---

**Last Updated:** 2025-01-20  
**Status:** Specification Complete - Ready for Phase 7 Implementation

