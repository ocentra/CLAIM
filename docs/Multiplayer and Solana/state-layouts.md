# State Layout Reference

This appendix tracks the zero-copy structs introduced for paid matches so developers can size accounts correctly when allocating PDAs.

## Match (existing + new fields)
- `match_id` (36 bytes) + padding
- `version` (10 bytes)
- `game_name` (20 bytes)
- `game_type` (u8)
- `seed` (u32)
- `phase`, `current_player`, `player_count`
- `player_ids` (10 ├ù 64 bytes)
- `entry_fee_lamports` (u64) **new**
- `prize_pool_lamports` (u64) **new**
- `match_type` (u8) **new**
- `payment_method` (u8) **new**
- `tournament_id` (16 bytes optional, reserved) **new**
- Existing hashes (`match_hash`, `floor_card_hash`, `committed_hand_hashes`), nonce arrays, flags, timestamps
- `MAX_SIZE` must be recalculated and documented in code comments

## EscrowAccount (new)
| Field | Size | Notes |
| --- | --- | --- |
| `discriminator` | 8 | Anchor prefix |
| `match` pubkey | 32 | Match PDA |
| `bump` | 1 | PDA bump |
| `total_entry_lamports` | 8 | Sum of entries |
| `platform_fee_lamports` | 8 | Accrued platform fees |
| `treasury_due_lamports` | 8 | Amount owed to treasury |
| `player_stakes` | 8 ├ù MAX_PLAYERS | One u64 per player slot |
| `status_flags` | 1 | bitfield: funded, distributed, cancelled |
| `reserved` | 32 | future SPL support |
Total Γëê 8 + 32 + 1 + 8 + 8 + 8 + (8 ├ù MAX_PLAYERS) + 1 + 32.

## UserDepositAccount (new)
| Field | Size | Notes |
| --- | --- | --- |
| `discriminator` | 8 | |
| `authority` pubkey | 32 | User wallet or custody delegate |
| `bump` | 1 | |
| `total_deposited` | 8 | lifetime volume |
| `available_lamports` | 8 | spendable balance |
| `in_play_lamports` | 8 | locked in escrow |
| `withdrawn_lamports` | 8 | cumulative |
| `locked_until` | 8 | unix timestamp for holds |
| `flags` | 1 | e.g., frozen, enhanced review |
| `reserved` | 31 | maintain 8 byte alignment |
Total Γëê 112 bytes (plus discriminator).

## ConfigAccount Additions
- `treasury_multisig` (Pubkey)
- `platform_fee_bps` (u16)
- `withdrawal_fee_lamports` (u64)
- `min_entry_fee`, `max_entry_fee` (u64)
- `kyc_tier_wallet`, `kyc_tier_platform` (u8)
- `supported_payment_methods` bitmask (u8)
- `is_paused` (bool)

## Sizing Guidelines
- Keep each account under 1200 bytes to stay well below Solana 10 KB limit and reduce rent.
- When adding future fields, prefer packed bitfields or reserved arrays defined above.
- Update this file whenever structs change so operations teams know how much rent to fund during migrations.

