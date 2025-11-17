# State Layout Reference

This appendix tracks the zero-copy structs introduced for paid matches so developers can size accounts correctly when allocating PDAs.

## Match (existing + new fields)
- `match_id` (36 bytes) + padding (4 bytes)
- `version` (10 bytes)
- `game_name` (20 bytes)
- `game_type` (u8) + padding (1 byte)
- `seed` (u32)
- `phase`, `current_player`, `player_count` (3 × u8) + padding (1 byte)
- `player_ids` (10 × 64 bytes = 640 bytes)
- `move_count` (u16) + padding (6 bytes)
- `created_at`, `ended_at` (2 × i64 = 16 bytes)
- `match_hash` (32 bytes)
- `hot_url` (200 bytes)
- `authority` (Pubkey = 32 bytes)
- `declared_suits` (5 bytes)
- `flags` (u8) + padding (2 bytes)
- `floor_card_hash` (32 bytes)
- `hand_sizes` (10 bytes)
- `committed_hand_hashes` (320 bytes)
- Padding (6 bytes)
- `last_nonce` (10 × u64 = 80 bytes)
- **Phase 02 new fields:**
  - `entry_fee_lamports` (u64 = 8 bytes)
  - `prize_pool_lamports` (u64 = 8 bytes)
  - `match_type` (u8 = 1 byte)
  - `payment_method` (u8 = 1 byte)
  - Padding (6 bytes)
  - `tournament_id` (16 bytes)
- **Total:** 8 (discriminator) + 1140 (existing) + 40 (new) = **1,188 bytes**

## EscrowAccount (new)
| Field | Size | Notes |
| --- | --- | --- |
| `discriminator` | 8 | Anchor prefix |
| `match_pda` | 32 | Match PDA (Pubkey) |
| `bump` | 1 | PDA bump seed |
| `_padding1` | 7 | Padding to align u64 fields |
| `total_entry_lamports` | 8 | Sum of all entry fees |
| `platform_fee_lamports` | 8 | Accrued platform fees |
| `treasury_due_lamports` | 8 | Amount owed to treasury |
| `player_stakes` | 80 | 10 × u64 (one per player slot) |
| `status_flags` | 1 | Bitfield: funded (bit 0), distributed (bit 1), cancelled (bit 2) |
| `_padding2` | 7 | Padding to align reserved |
| `reserved` | 32 | Future SPL token support |
| **Total** | **200** | 8 + 32 + 1 + 7 + 8 + 8 + 8 + 80 + 1 + 7 + 32 |
| **PDA Seeds** | | `["escrow", match_pda.as_ref()]` |

## UserDepositAccount (new)
| Field | Size | Notes |
| --- | --- | --- |
| `discriminator` | 8 | Anchor prefix |
| `authority` | 32 | User wallet or custody delegate (Pubkey) |
| `bump` | 1 | PDA bump seed |
| `_padding1` | 7 | Padding to align u64 fields |
| `total_deposited` | 8 | Lifetime total deposited |
| `available_lamports` | 8 | Spendable balance (not locked) |
| `in_play_lamports` | 8 | Amount locked in escrow |
| `withdrawn_lamports` | 8 | Cumulative withdrawn amount |
| `locked_until` | 8 | Unix timestamp (0 = not locked) |
| `flags` | 1 | Bitfield: frozen (bit 0), enhanced_review (bit 1) |
| `_padding2` | 7 | Padding to align reserved |
| `reserved` | 32 | Future token mint metadata |
| **Total** | **128** | 8 + 32 + 1 + 7 + 8 + 8 + 8 + 8 + 8 + 1 + 7 + 32 |
| **PDA Seeds** | | `["user_deposit", authority.as_ref()]` |

## ConfigAccount Additions (Phase 02)
- `treasury_multisig` (Pubkey = 32 bytes) - Phase 01
- `platform_fee_bps` (u16 = 2 bytes) - Phase 01
- `withdrawal_fee_lamports` (u64 = 8 bytes) - Phase 01
- `min_entry_fee` (u64 = 8 bytes) - Phase 01
- `max_entry_fee` (u64 = 8 bytes) - Phase 01
- `is_paused` (bool = 1 byte) - Phase 01
- **Phase 02 new fields:**
  - `kyc_tier_wallet` (u8 = 1 byte) - Minimum KYC tier for wallet payments
  - `kyc_tier_platform` (u8 = 1 byte) - Minimum KYC tier for platform payments
  - `supported_payment_methods` (u8 = 1 byte) - Bitmask: bit 0 = WALLET, bit 1 = PLATFORM
  - `_padding_phase02` (5 bytes) - Padding to align timestamps
- **Total:** 248 bytes (was 240 bytes, added 8 bytes in Phase 02)

## Sizing Guidelines
- Keep each account under 1200 bytes to stay well below Solana 10 KB limit and reduce rent.
- When adding future fields, prefer packed bitfields or reserved arrays defined above.
- Update this file whenever structs change so operations teams know how much rent to fund during migrations.

