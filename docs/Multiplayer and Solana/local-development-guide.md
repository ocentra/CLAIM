# Local Development & Testing Guide

This guide explains how to set up and run the Solana program locally for development and testing. It covers both the Rust/Anchor tests (WSL) and the TypeScript game client tests (Windows).

---

## Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Start validator | `solana-test-validator --reset` | WSL |
| Deploy program | `anchor deploy` | WSL |
| Run Anchor tests | `anchor test --skip-local-validator` | WSL |
| Run game tests | `.\run-tests.ps1` | Windows |
| Verify setup | `node scripts/verify-deployment.cjs` | Windows |
| Manual registry setup | `node scripts/setup-local-validator.cjs` | Windows |

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT SETUP                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐          ┌──────────────────┐                 │
│  │      WSL         │          │     Windows      │                 │
│  │  (Solana Side)   │◄────────►│   (Game Side)    │                 │
│  ├──────────────────┤   RPC    ├──────────────────┤                 │
│  │                  │  :8899   │                  │                 │
│  │ • Validator      │          │ • TypeScript     │                 │
│  │ • Anchor Program │          │ • Game Client    │                 │
│  │ • Rust Tests     │          │ • E2E Tests      │                 │
│  │                  │          │                  │                 │
│  └──────────────────┘          └──────────────────┘                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Understanding the Components

### What Gets Deployed

When you deploy the Solana program, you're deploying **code only**:

```
anchor deploy = Upload program code to Solana
              = Like installing an empty database schema
              = NO DATA exists yet
```

### What Needs Initialization

After deployment, you need to create **data accounts**:

```
┌─────────────────────────────────────────────────────────┐
│                    ON-CHAIN DATA                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. GameRegistry (one-time, per network)                │
│     └─► Stores list of registered games                 │
│         └─► CLAIM, POKER, etc.                          │
│                                                          │
│  2. Match PDAs (per match)                              │
│     └─► Created when createMatch() is called            │
│                                                          │
│  3. Escrow PDAs (per paid match)                        │
│     └─► Created for matches with entry fees             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Why Tests Failed Before

```
Your test: "Hey, create a CLAIM match!"
   │
   ▼
Program: "What's CLAIM? Let me check GameRegistry..."
   │
   ▼
Program: "GameRegistry doesn't exist! ERROR!"
   │
   ▼
Result: "Unable to find a viable program address nonce"
```

---

## Setup Flow Diagram

### First-Time Setup (Per Network)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIRST-TIME SETUP                              │
│                  (Run once per network)                          │
└─────────────────────────────────────────────────────────────────┘

     WSL                                    Windows
     ────                                   ───────

1. Start Validator
   solana-test-validator --reset
        │
        ▼
2. Deploy Program
   anchor deploy
        │
        ▼
   Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
        │
        └────────────────────────────────►  3. Initialize Registry
                                               node scripts/setup-local-validator.cjs
                                                    │
                                                    ▼
                                            • Create GameRegistry account
                                            • Register CLAIM game
                                            • Save authority keypair
                                                    │
                                                    ▼
                                            4. Ready for Tests!
                                               .\run-tests.ps1
```

### Subsequent Test Runs

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUBSEQUENT RUNS                               │
│            (Validator still running, program deployed)           │
└─────────────────────────────────────────────────────────────────┘

     Windows
     ───────

1. Run Tests
   .\run-tests.ps1
        │
        ▼
   • Detects WSL IP
   • Checks validator
   • Checks program
   • Checks GameRegistry ──► If missing, auto-initializes!
   • Runs npm test
   • Generates report
```

---

## Detailed Setup Instructions

### Prerequisites

**WSL (Ubuntu):**
- Rust & Cargo
- Solana CLI (v1.18+)
- Anchor CLI (v0.30+)

**Windows:**
- Node.js (v18+)
- npm/pnpm

### Step 1: Start Local Validator (WSL)

```bash
cd /mnt/e/ocentra-games/Rust/ocentra-games

# Kill any existing validator
pkill -9 solana-test-validator

# Remove old ledger data
rm -rf test-ledger

# Start fresh validator
solana-test-validator --reset
```

Wait for: `Waiting for fees to stabilize...` then the validator is ready.

### Step 2: Deploy Program (WSL)

In a new WSL terminal:

```bash
cd /mnt/e/ocentra-games/Rust/ocentra-games

# Build and deploy
anchor build
anchor deploy
```

Expected output:
```
Deploying cluster: http://127.0.0.1:8899
Program Id: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
Deploy success
```

### Step 3: Initialize Registry (Windows)

In PowerShell:

```powershell
cd e:\ocentra-games

# Option A: Run tests (auto-initializes if needed)
.\run-tests.ps1

# Option B: Manual initialization
node scripts/setup-local-validator.cjs
```

### Step 4: Verify Setup (Windows)

```powershell
node scripts/verify-deployment.cjs
```

Expected output:
```
=== Deployment Verification ===

1. Checking RPC connectivity...
   ✅ Connected to Solana 3.0.10

2. Checking program deployment...
   ✅ Program deployed and executable

3. Checking IDL...
   ✅ IDL address matches program ID

4. Testing PDA derivation...
   ✅ PDA derivation works

5. Testing Anchor Program creation...
   ✅ Anchor Program created successfully

6. Checking GameRegistry account...
   ✅ GameRegistry exists

=== Summary ===
✅ All checks passed! Deployment is ready.
```

---

## Running Tests

### Rust/Anchor Tests (WSL)

These test the Solana program directly:

```bash
cd /mnt/e/ocentra-games/Rust/ocentra-games

# Run with existing validator
anchor test --skip-local-validator

# Or run all (starts its own validator)
anchor test
```

### TypeScript Game Tests (Windows)

These test the game client integration:

```powershell
cd e:\ocentra-games

# Run all tests with setup and report generation
.\run-tests.ps1

# Or run specific test
npx vitest run src/services/__tests__/e2e/full-match-lifecycle.test.ts
```

---

## Common Scenarios

### Scenario 1: Fresh Start

```bash
# WSL
cd /mnt/e/ocentra-games/Rust/ocentra-games
pkill -9 solana-test-validator
rm -rf test-ledger
solana-test-validator --reset

# Wait for startup, then in new terminal:
anchor deploy
```

```powershell
# Windows
.\run-tests.ps1   # Auto-initializes everything
```

### Scenario 2: Validator Reset (Lost Data)

If you reset the validator, all on-chain data is lost:

```powershell
# Windows - Re-initialize
node scripts/setup-local-validator.cjs
```

### Scenario 3: Code Changes

After modifying Rust code:

```bash
# WSL
anchor build
anchor deploy
```

The TypeScript side will automatically use the updated program.

### Scenario 4: Check What's Deployed

```powershell
# Windows
node scripts/verify-deployment.cjs
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SOLANA_RPC_URL` | RPC endpoint | Auto-detected from WSL IP |
| `SOLANA_CLUSTER` | Network (localnet/devnet/mainnet) | localnet |

---

## File Locations

### Scripts (Windows)

| File | Purpose |
|------|---------|
| `run-tests.ps1` | Main test runner with auto-setup |
| `scripts/verify-deployment.cjs` | Verify deployment status |
| `scripts/setup-local-validator.cjs` | Initialize registry & games |

### Key Files (WSL)

| File | Purpose |
|------|---------|
| `Rust/ocentra-games/target/idl/ocentra_games.json` | Program IDL |
| `Rust/ocentra-games/target/deploy/ocentra_games-keypair.json` | Program keypair |
| `Rust/ocentra-games/Anchor.toml` | Anchor configuration |

### Authority Keypair

| File | Purpose |
|------|---------|
| `.local-authority.json` | Local test authority (don't commit!) |

---

## Deploying to Devnet/Mainnet

The same process applies, just targeting a different network:

### Devnet

```bash
# WSL - Configure and deploy
solana config set --url devnet
cd /mnt/e/ocentra-games/Rust/ocentra-games
anchor deploy --provider.cluster devnet
```

```powershell
# Windows - Initialize (use devnet RPC)
$env:SOLANA_RPC_URL = "https://api.devnet.solana.com"
node scripts/setup-local-validator.cjs
```

### Mainnet

Same as devnet, but:
- Use `--provider.cluster mainnet`
- Use `https://api.mainnet-beta.solana.com`
- **Use a secure authority keypair** (not `.local-authority.json`)
- **Keep authority keypair very safe** - it controls game registration

---

## Troubleshooting

### "Unable to find a viable program address nonce"

**Cause:** GameRegistry not initialized.

**Fix:**
```powershell
node scripts/setup-local-validator.cjs
```

### "Cannot connect to RPC"

**Cause:** Validator not running or wrong IP.

**Fix:**
```bash
# WSL - Start validator
solana-test-validator --reset
```

### "Program not found"

**Cause:** Program not deployed.

**Fix:**
```bash
# WSL
anchor deploy
```

### "IDL not found"

**Cause:** Haven't built the program.

**Fix:**
```bash
# WSL
anchor build
```

### Tests Pass in WSL but Fail in Windows

**Cause:** Different program state or network issue.

**Fix:**
```powershell
# Verify connectivity
node scripts/verify-deployment.cjs

# Re-initialize if needed
node scripts/setup-local-validator.cjs
```

---

## Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE BIG PICTURE                               │
└─────────────────────────────────────────────────────────────────┘

1. DEPLOY (once per code change)
   anchor deploy = Upload program code

2. INITIALIZE (once per network)
   setup-local-validator.cjs = Create GameRegistry, register games

3. TEST (as many times as needed)
   .\run-tests.ps1 = Run tests, auto-setup if needed

That's it! The complexity is in the one-time setup.
Once initialized, just run tests.
```
