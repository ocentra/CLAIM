# Match Cancellation Policy - Industry Research & Implementation

## Research Summary

Based on industry analysis of major gaming platforms (League of Legends, Counter-Strike 2, Rocket League, Dead by Daylight, Players' Lounge, etc.), here are the key findings:

### Key Industry Practices:

1. **No Distinction Between Intentional vs Unintentional**
   - Most games penalize ALL disconnections to prevent exploitation
   - Dead by Daylight: "Penalty applies regardless of intent"
   - Prevents players from claiming "connection error" to avoid losses

2. **Grace Period for Reconnection**
   - 3-5 minute window to reconnect (Overwatch, Caliber, Rocket League)
   - If player reconnects within grace period → no penalty
   - If player fails to reconnect → penalty applies

3. **Escalating Penalties**
   - First offense: Warning or short ban (5 minutes)
   - Repeat offenses: Escalating bans (up to 7 days)
   - Ranking/ELO penalties (Counter-Strike 2: -1,000 points)

4. **Paid Match Forfeiture**
   - **Players' Lounge Model**: If player disconnects while **losing** → forfeit bet. If **winning** → refund bet
   - Prevents exploitation: Can't disconnect to avoid loss
   - Abandoning player forfeits entry fee

---

## Our Implementation Strategy

### Cancellation Reasons

```rust
// Cancellation reason enum (stored in EscrowAccount.status_flags bits 3-5)
pub const CANCELLED_PLATFORM_FAULT: u8 = 0;        // Platform issue (full refunds)
pub const CANCELLED_PLAYER_ABANDONMENT: u8 = 1;    // Player left/disconnected (penalty)
pub const CANCELLED_INSUFFICIENT_PLAYERS: u8 = 2;   // Not enough players joined (full refunds)
pub const CANCELLED_TIMEOUT: u8 = 3;                // Player timeout (penalty)
pub const CANCELLED_GRACE_PERIOD_EXPIRED: u8 = 4;   // Reconnection grace period expired (penalty)
```

### Policy Matrix

| Cancellation Reason | Abandoned Player | Innocent Players | Platform Fee |
|---------------------|------------------|------------------|--------------|
| **PLATFORM_FAULT** | Full refund | Full refund | No fee (platform's fault) |
| **PLAYER_ABANDONMENT** | **Forfeit entry fee** | Full refund | Cancellation fee + abandoned stake |
| **TIMEOUT** | **Forfeit entry fee** | Full refund | Cancellation fee + abandoned stake |
| **GRACE_PERIOD_EXPIRED** | **Forfeit entry fee** | Full refund | Cancellation fee + abandoned stake |
| **INSUFFICIENT_PLAYERS** | Full refund | Full refund | Small cancellation fee |

### Grace Period Logic (Off-Chain)

1. **Player disconnects** → Match coordinator starts 5-minute grace period timer
2. **Player reconnects within 5 minutes** → Match continues, no penalty
3. **Player fails to reconnect** → After 5 minutes, match cancelled with `GRACE_PERIOD_EXPIRED`
4. **On-chain**: `refund_escrow` called with `cancellation_reason = GRACE_PERIOD_EXPIRED` and `abandoned_player_index`

### Penalty Distribution

When a player abandons (PLAYER_ABANDONMENT, TIMEOUT, GRACE_PERIOD_EXPIRED):

```
Example: 4 players, 0.1 SOL entry fee each = 0.4 SOL total
Player 2 abandons → Match cancelled

Distribution:
- Player 2 (abandoner): 0 SOL (forfeits 0.1 SOL entry fee)
- Players 0, 1, 3 (innocent): 0.1 SOL each (full refund)
- Platform: 
  - Cancellation fee: 0.01 SOL (configurable, e.g., 2.5% of total)
  - Abandoned player's stake: 0.1 SOL
  - Total platform receives: 0.11 SOL
```

### Preventing Exploitation

**Scenario: Player losing, tries to disconnect to avoid loss**
- Grace period expires → Match cancelled
- Abandoned player forfeits entry fee → **Cannot avoid loss by disconnecting**
- Other players get refunds → **No harm to innocent players**

**Scenario: Player winning, disconnects accidentally**
- Grace period allows reconnection → **No penalty if reconnects**
- If grace period expires → **Still forfeits entry fee** (prevents exploitation)

---

## Implementation Changes

### 1. EscrowAccount Updates

Add fields to track cancellation reason and abandoned player:

```rust
// Use bits 3-5 in status_flags for cancellation reason (3 bits = 8 values)
// Bit 6-7: reserved

// Add new field:
pub abandoned_player_index: u8, // Which player abandoned (0-9, 255 = none)
```

### 2. refund_escrow Instruction Updates

Add parameters:
- `cancellation_reason: u8` - Why match was cancelled
- `abandoned_player_index: Option<u8>` - Which player abandoned (if applicable)

Logic:
- If `cancellation_reason == PLATFORM_FAULT` → Full refunds for all
- If `cancellation_reason == PLAYER_ABANDONMENT/TIMEOUT/GRACE_PERIOD_EXPIRED`:
  - Abandoned player: **NO refund** (forfeits entry fee)
  - Other players: Full refund
  - Platform: Gets cancellation fee + abandoned player's stake
- If `cancellation_reason == INSUFFICIENT_PLAYERS` → Full refunds + small platform fee

### 3. ConfigAccount Updates

Add cancellation fee configuration:
```rust
pub cancellation_fee_bps: u16, // Cancellation fee in basis points (e.g., 250 = 2.5%)
```

---

## Benefits

1. **Prevents Exploitation**: Players can't disconnect to avoid losses
2. **Fair to Innocent Players**: They always get full refunds
3. **Compensates Platform**: Platform gets fee for handling cancellation
4. **Industry Standard**: Aligns with major gaming platforms
5. **Grace Period**: Allows genuine reconnections without penalty

---

## Edge Cases Handled

1. **Multiple players abandon**: First abandoner forfeits, others get refunds
2. **Player abandons while winning**: Still forfeits (prevents exploitation)
3. **Platform fault**: All players get full refunds, no platform fee
4. **Insufficient players**: Full refunds, small platform fee for handling

---

## Testing Requirements

- Test: Player abandonment → forfeits entry fee
- Test: Innocent players get full refunds
- Test: Platform receives cancellation fee + abandoned stake
- Test: Platform fault → all players get full refunds
- Test: Multiple abandoners (first one forfeits)
- Test: Grace period reconnection (no penalty)

---

**Status**: Ready for implementation in Phase 03/04

