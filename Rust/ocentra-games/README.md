# Ocentra Games - Solana Program

This is the main Solana program crate for Ocentra Games, implementing on-chain multiplayer game logic using the Anchor framework.

## Overview

This crate contains:
- **Rust Program** (`programs/ocentra-games/`): The Solana on-chain program written in Rust
- **TypeScript Tests** (`tests/`): Comprehensive test suite written in TypeScript
- **Build System**: Anchor framework for building, deploying, and testing

## Architecture: Rust + TypeScript Integration

### How Rust and TypeScript Work Together

#### 1. **Rust Program (On-Chain)**
- Located in `programs/ocentra-games/src/`
- Contains all game logic, state management, and validation
- Compiled to BPF bytecode that runs on Solana validators
- Uses Anchor framework for account management and instruction handling

#### 2. **Anchor IDL Generation**
When you run `anchor build`:
1. Anchor compiles the Rust program to BPF bytecode (`target/deploy/ocentra_games.so`)
2. Anchor generates an **IDL (Interface Definition Language)** file (`target/idl/ocentra_games.json`)
3. The IDL describes all instructions, accounts, and types in the program

#### 3. **TypeScript Client Code**
- The TypeScript test suite uses `@coral-xyz/anchor` to interact with the Rust program
- Anchor's TypeScript client reads the IDL to generate type-safe client methods
- Tests import the program like this:
  ```typescript
  import { Program } from '@coral-xyz/anchor';
  import IDL from '../target/idl/ocentra_games.json';
  
  const program = new Program(IDL, programId, provider);
  ```

#### 4. **Type Safety Across Languages**
- Rust structs map to TypeScript types via the IDL
- Instruction parameters are validated on both sides
- Account structures are shared between Rust and TypeScript

### Build Flow

```
┌─────────────────┐
│  Rust Source    │  (programs/ocentra-games/src/*.rs)
│  (lib.rs, etc.) │
└────────┬────────┘
         │
         │ anchor build
         ▼
┌─────────────────┐
│  BPF Bytecode   │  (target/deploy/ocentra_games.so)
│  + IDL JSON     │  (target/idl/ocentra_games.json)
└────────┬────────┘
         │
         │ TypeScript imports IDL
         ▼
┌─────────────────┐
│ TypeScript      │  (tests/*.ts)
│ Test Suite      │  Uses Anchor client with IDL
└─────────────────┘
```

## Directory Structure

```
Rust/ocentra-games/
├── programs/
│   └── ocentra-games/     # Rust Solana program
│       ├── src/
│       │   ├── lib.rs     # Program entry point, instruction handlers
│       │   ├── state/     # Account state structures
│       │   ├── instructions/  # Instruction handlers organized by category
│       │   ├── games/     # Game-specific logic (CLAIM, etc.)
│       │   ├── common/    # Shared utilities
│       │   └── error.rs   # Custom error types
│       └── Cargo.toml     # Rust dependencies
│
├── tests/                 # TypeScript test suite
│   ├── core/              # Test infrastructure
│   ├── common/            # Shared test utilities
│   ├── games/             # Game-specific tests
│   └── helpers.ts         # Test helpers and fixtures
│
├── migrations/            # Anchor deployment scripts
├── Anchor.toml            # Anchor configuration
├── Cargo.toml             # Workspace configuration
└── package.json           # TypeScript dependencies
```

## Key Components

### Rust Program (`programs/ocentra-games/`)

See `programs/ocentra-games/README.md` for detailed program structure.

**Main Entry Point**: `src/lib.rs`
- Defines the `#[program]` module with all instruction handlers
- Each handler delegates to organized instruction modules

**State Management**: `src/state/`
- Account structures (MatchState, MoveState, GameRegistry, etc.)
- Serialization/deserialization using Anchor's derive macros

**Instructions**: `src/instructions/`
- Organized by category: `common/` and `games/`
- Each instruction has its own module with handler function

### TypeScript Tests (`tests/`)

See `tests/README.md` for detailed test structure.

**Test Infrastructure**: `tests/core/`
- Base test classes, registry system, type definitions
- Mocha integration and test discovery

**Test Organization**: `tests/common/` and `tests/games/`
- Common tests (lifecycle, registry, errors)
- Game-specific tests (CLAIM moves, actions)

**Helpers**: `tests/helpers.ts` and `tests/common/`
- Provider setup, PDA derivation, test fixtures
- Game-specific helpers (CLAIM action types, etc.)

## Development Workflow

### 1. Build the Program

```bash
cd Rust/ocentra-games
anchor build
```

This:
- Compiles Rust to BPF bytecode
- Generates IDL file (`target/idl/ocentra_games.json`)
- Makes the program available for deployment/testing

### 2. Run Tests

```bash
anchor test
```

This:
- Starts a local Solana validator
- Deploys the program to localnet
- Runs all TypeScript tests in `tests/`
- Generates test reports in `test-reports/`

### 3. Deploy to Devnet

```bash
# Update Anchor.toml: cluster = "devnet"
anchor deploy
```

### 4. TypeScript Development

When adding new instructions or accounts in Rust:
1. Update Rust code in `programs/ocentra-games/src/`
2. Run `anchor build` to regenerate IDL
3. TypeScript tests automatically get new types via IDL
4. Write tests using the new instructions

## Dependencies

### Rust (`Cargo.toml`)
- `anchor-lang`: Anchor framework core
- `anchor-spl`: SPL token support
- `solana-program`: Solana runtime APIs
- `bytemuck`: Zero-copy serialization

### TypeScript (`package.json`)
- `@coral-xyz/anchor`: Anchor TypeScript client
- `@solana/web3.js`: Solana JavaScript SDK
- `mocha`, `chai`: Testing framework
- `typescript`: TypeScript compiler

## Program ID

**Program ID**: `7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696`

Defined in:
- `programs/ocentra-games/src/lib.rs`: `declare_id!()`
- `Anchor.toml`: `[programs.devnet]` and `[programs.mainnet]`

## Configuration

### Anchor.toml

```toml
[provider]
cluster = "localnet"  # localnet, devnet, or mainnet
wallet = "~/.config/solana/id.json"

[programs.devnet]
ocentra_games = "7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696"
```

### Build Configuration

**Release Profile** (`Cargo.toml`):
- `overflow-checks = true`: Prevents integer overflow
- `lto = "fat"`: Link-time optimization
- `codegen-units = 1`: Single codegen unit for better optimization

## Testing Strategy

1. **Local Development**: Use `localnet` for fast iteration
2. **Devnet Validation**: Deploy to devnet and run essential tests
3. **Mainnet**: Production deployment after thorough testing

Tests automatically adapt to cluster:
- **Localnet**: All tests run (no rate limits)
- **Devnet**: Essential tests only (respects rate limits)
- **Mainnet**: Manual testing only

## Key Features

### Game Registry System
- Register and manage multiple game types
- Version control for game rules
- Rule engine URL configuration

### Match Lifecycle
- Create matches with unique UUIDs
- Player joining with capacity limits
- Match starting with minimum player validation
- Match ending with hash anchoring

### Move System
- Individual move submission with replay protection
- Batch move submission (up to 5 moves)
- Nonce-based ordering and validation

### Economic Model
- Game Payment (GP) system
- AI Credit (AC) consumption
- Daily login rewards
- Ad rewards
- Pro subscriptions

### Dispute System
- Flag disputes with evidence
- Resolve disputes with validator consensus
- Slashing for malicious validators

## Documentation

- **Program Structure**: See `programs/ocentra-games/README.md`
- **Test System**: See `tests/README.md`
- **Test Infrastructure**: See `tests/core/README.md`

## Common Commands

```bash
# Build program
anchor build

# Run all tests
anchor test

# Deploy to devnet
anchor deploy

# Check program on-chain
solana program show 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696 --url devnet

# View IDL
cat target/idl/ocentra_games.json
```

## Troubleshooting

### IDL Not Found
If TypeScript tests can't find the IDL:
1. Run `anchor build` to generate IDL
2. Check that `target/idl/ocentra_games.json` exists
3. Verify `Anchor.toml` program ID matches `lib.rs`

### PDA Mismatch Errors
If you see `ConstraintSeeds` errors:
- Check PDA derivation matches between Rust and TypeScript
- Use `getMatchPDA()`, `getMovePDA()` helpers from `tests/common/pda.ts`
- Verify seed truncation (match IDs are truncated to 31 bytes)

### Build Errors
- Ensure Rust toolchain is up to date: `rustup update`
- Check Anchor version matches: `anchor --version` (should be 0.32.1)
- Clean and rebuild: `anchor clean && anchor build`

