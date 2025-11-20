# Test Report

**Date:** Wednesday, November 19, 2025  
**Time:** 19:24:22  
**Timestamp:** 2025-11-19T19:24:22.5603203-05:00  

## Environment

| Property | Value |
|----------|-------|
| Cluster | localnet |
| RPC URL | \$rpcUrl\ |
| Program ID | \$programId\ |
| WSL IP | 172.26.131.224 |
| Platform | Windows |
| PowerShell Version | 5.1.26100.7262 |
| Node Version | v22.15.0 |

## Pre-Test Setup

| Check | Status |
|-------|--------|
| WSL IP Detection | Success (172.26.131.224) |
| Validator Accessibility | Accessible |
| Program Deployment | Deployed |
| GameRegistry | Initialized |

### Setup Logs

`
Detecting WSL IP address...
SUCCESS: WSL IP: 172.26.131.224
Set SOLANA_RPC_URL=http://172.26.131.224:8899

Checking if Solana validator is accessible...
SUCCESS: Validator is accessible!

Verifying deployment...
=== Deployment Verification ===

RPC URL: http://172.26.131.224:8899
Expected Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696

1. Checking RPC connectivity...
   Γ£à Connected to Solana 3.0.10

2. Checking program deployment...
   Γ£à Program deployed and executable
   Owner: BPFLoaderUpgradeab1e11111111111111111111111
   Program size: 801.89 KB

3. Checking IDL...
   Γ£à IDL loaded from E:\ocentra-games\Rust\ocentra-games\target\idl\ocentra_games.json
   IDL address: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
   Instructions: 31
   Γ£à IDL address matches program ID

4. Testing PDA derivation...
   Γ£à PDA derivation works
   Test matchId: test-match-mi6ovc13
   PDA: 6197a45Jbj6L1wC8vJaWwH7uyofd5yiCzvYGwFSt4guL
   Bump: 254

5. Testing Anchor Program creation...
   Γ£à Anchor Program created successfully
   Program ID from Anchor: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696

6. Checking GameRegistry account...
   Γ£à GameRegistry exists at 8heRqJrZRXYSQg1LBAfzg5KNZY9GhP3NYgjMAeEFoCwe
   Data size: 4680 bytes

=== Summary ===
Γ£à All checks passed! Deployment is ready.
SUCCESS: Deployment verification passed!

Checking authority keypair...
SUCCESS: Authority keypair found

Checking if GameRegistry is initialized...
GameRegistry not found, running setup script...
=== Local Validator Setup ===

RPC URL: http://172.26.131.224:8899
Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696

1. Checking connectivity...
   Γ£à Connected to Solana 3.0.10

2. Loading IDL...
   Γ£à IDL loaded (31 instructions)

3. Setting up authority...
   Γ£à Loaded existing authority: 4L99pS3yViRdVUVUfFz4mimY1iH8KMdSG1sja17eT7CE

4. Funding authority...
   Γ£à Balance: 1.96652632 SOL (sufficient)

5. Creating Anchor program...
   Γ£à Program ready: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696

6. Checking GameRegistry...
   Γ£à GameRegistry already exists at 8heRqJrZRXYSQg1LBAfzg5KNZY9GhP3NYgjMAeEFoCwe
   Data size: 4680 bytes
   Authority: 4L99pS3yViRdVUVUfFz4mimY1iH8KMdSG1sja17eT7CE
   Game count: 1

   Games registered:
   - [0] CLAIM (2-10 players)

7. Checking CLAIM game registration...
   Γ£à CLAIM game already registered

8. Final verification...
   Γ£à GameRegistry: 8heRqJrZRXYSQg1LBAfzg5KNZY9GhP3NYgjMAeEFoCwe
   Γ£à Authority: 4L99pS3yViRdVUVUfFz4mimY1iH8KMdSG1sja17eT7CE
   Γ£à Games registered: 1
      [0] CLAIM

=== Setup Complete ===
You can now run your E2E tests!

To run tests:
  npx vitest run src/services/__tests__/e2e/full-match-lifecycle.test.ts
SUCCESS: GameRegistry initialized by setup script!
SUCCESS: Authority keypair created/verified

Cleaning up old test reports...
Deleted old report: test-report.md
Deleted 1 old test report(s)
`

## Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Tests** | 166 | 100% |
| **Passed** | 139 | 83.7% |
| **Failed** | 5 | 3% |
| **Skipped** | 22 | 13.3% |
| **Duration** | 27.44s | - |

### Overall Status: FAILED

**Test Files:** 19 passed, 2 failed, 1 skipped

## Failed Tests

- [FAILED] [Full Match Lifecycle E2E > should complete full match lifecycle: create  join  start  moves  end](../src/services/__tests__/e2e/full-match-lifecycle.test.ts)
- [FAILED] [Full Match Lifecycle E2E > should handle batch moves correctly](../src/services/__tests__/e2e/full-match-lifecycle.test.ts)
- [FAILED] [Solana Integration E2E > should create a match on devnet](../src/services/__tests__/e2e/solana-integration.test.ts)
- [FAILED] [Solana Integration E2E > should submit a move and verify nonce protection](../src/services/__tests__/e2e/solana-integration.test.ts)
- [FAILED] [Solana Integration E2E > should handle transaction confirmation and state polling](../src/services/__tests__/e2e/solana-integration.test.ts)

## Test Results by File

### File A : `R2Service.integration.test.ts` [PASSED] {#file-a-r2serviceintegrationtestts}

**Path:** `src/services/storage/__tests__/R2Service.integration.test.ts`  
**Duration:** 3081ms  
**Tests:** 15 total

#### [PASS] should upload and retrieve a complete match record {#test-a-r2serviceintegrationtestts-should-upload-and-retrieve-a-complete-match-record}
**Duration:** 6ms  
**Status:** PASSED

---

#### [PASS] should handle large match records with many events {#test-a-r2serviceintegrationtestts-should-handle-large-match-records-with-many-events}
**Duration:** 1ms  
**Status:** PASSED

---

#### [PASS] should handle match records with AI chain-of-thought {#test-a-r2serviceintegrationtestts-should-handle-match-records-with-ai-chain-of-thought}
**Duration:** 1ms  
**Status:** PASSED

---

#### [PASS] should reject match records exceeding 10MB limit {#test-a-r2serviceintegrationtestts-should-reject-match-records-exceeding-10mb-limit}
**Duration:** 47ms  
**Status:** PASSED

---

#### [PASS] should handle network errors during upload with retry {#test-a-r2serviceintegrationtestts-should-handle-network-errors-during-upload-with-retry}
**Duration:** 3020ms  
**Status:** PASSED

---

#### [PASS] should not retry on 400 Bad Request (invalid data) {#test-a-r2serviceintegrationtestts-should-not-retry-on-400-bad-request-invalid-data}
**Duration:** 1ms  
**Status:** PASSED

---

#### [PASS] should return null for non-existent match records {#test-a-r2serviceintegrationtestts-should-return-null-for-non-existent-match-records}
**Status:** PASSED

---

#### [PASS] should generate signed URL for match record access {#test-a-r2serviceintegrationtestts-should-generate-signed-url-for-match-record-access}
**Duration:** 1ms  
**Status:** PASSED

---

#### [PASS] should use default expiration (1 hour) when not specified {#test-a-r2serviceintegrationtestts-should-use-default-expiration-1-hour-when-not-specified}
**Status:** PASSED

---

#### [PASS] should delete a match record successfully {#test-a-r2serviceintegrationtestts-should-delete-a-match-record-successfully}
**Status:** PASSED

---

#### [PASS] should handle deletion of non-existent match gracefully {#test-a-r2serviceintegrationtestts-should-handle-deletion-of-non-existent-match-gracefully}
**Status:** PASSED

---

#### [PASS] should preserve all match record fields during upload/retrieve {#test-a-r2serviceintegrationtestts-should-preserve-all-match-record-fields-during-uploadretrieve}
**Duration:** 1ms  
**Status:** PASSED

---

#### [PASS] should handle special characters in match data {#test-a-r2serviceintegrationtestts-should-handle-special-characters-in-match-data}
**Duration:** 1ms  
**Status:** PASSED

---

#### [PASS] should handle multiple concurrent uploads {#test-a-r2serviceintegrationtestts-should-handle-multiple-concurrent-uploads}
**Duration:** 1ms  
**Status:** PASSED

---

#### [PASS] should handle concurrent read operations {#test-a-r2serviceintegrationtestts-should-handle-concurrent-read-operations}
**Duration:** 1ms  
**Status:** PASSED

---

\n<details>
<summary><b>Raw Test Output (click to expand)</b></summary>

```

> claim@0.0.0 test
> vitest --run

[dotenv@17.2.3] injecting env (8) from .env -- tip:  encrypt with Dotenvx: https://dotenvx.com

 RUN  v4.0.7 E:/ocentra-games

stdout | src/services/__tests__/e2e/full-match-lifecycle.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   write to custom object with { processEnv: myObject }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/__tests__/e2e/solana-integration.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  prevent building .env in docker: https://dotenvx.com/prebuild
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/__tests__/load/merkle-batching.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  sync secrets across teammates & machines: https://dotenvx.com/ops
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/storage/__tests__/R2Service.hello.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  add secrets lifecycle management: https://dotenvx.com/ops
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/storage/__tests__/R2Service.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  audit secrets and track compliance: https://dotenvx.com/ops
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/__tests__/integration/verification-workflow.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   write to custom object with { processEnv: myObject }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/engine/__tests__/GameEngine.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   specify custom .env file path with { path: '/custom/path/.env' }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/network/__tests__/P2PManager.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   write to custom object with { processEnv: myObject }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/__tests__/integration/match-lifecycle.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   enable debug logging with { debug: true }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/engine/logic/__tests__/RuleEngine.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  prevent committing .env to code: https://dotenvx.com/precommit
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/storage/__tests__/HotStorageService.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  add observability to secrets: https://dotenvx.com/ops
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/__tests__/load/match-creation.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  sync secrets across teammates & machines: https://dotenvx.com/ops
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/lib/serialization/__tests__/Serializable.spec.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  prevent committing .env to code: https://dotenvx.com/precommit
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/utils/__tests__/assetManager.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   enable debug logging with { debug: true }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/network/__tests__/WebRTCHandler.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   suppress all logs with { quiet: true }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test

================================================================================
HELLO WORLD E2E TEST - REAL DATA UPLOAD
================================================================================
Worker URL: https://claim-storage-dev.ocentraai.workers.dev
Bucket: claim-matches-test
================================================================================


stdout | src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  prevent committing .env to code: https://dotenvx.com/precommit
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/storage/__tests__/StorageConfig.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   suppress all logs with { quiet: true }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/storage/__tests__/R2Service.integration.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   specify custom .env file path with { path: '/custom/path/.env' }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should respond to a simple GET request
 [2025-11-20T00:24:25.204Z] Testing GET request to: https://claim-storage-dev.ocentraai.workers.dev/api/matches/test-hello

stdout | src/lib/eventing/__tests__/EventBus.spec.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   override existing env vars with { override: true }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

  src/services/storage/__tests__/R2Service.test.ts > R2Service > uploadMatchRecord > should upload a match record successfully 6ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > uploadMatchRecord > should throw error if record exceeds size limit 17ms
stdout | src/engine/logic/__tests__/DeckManager.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:  add secrets lifecycle management: https://dotenvx.com/ops
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

  src/services/storage/__tests__/StorageConfig.test.ts > StorageConfig > should return config with R2 settings 2ms
  src/services/storage/__tests__/StorageConfig.test.ts > StorageConfig > should have default bucket name when env var not set 0ms
  src/services/storage/__tests__/StorageConfig.test.ts > StorageConfig > should handle fallbackToFirebase flag 0ms
  src/services/storage/__tests__/StorageConfig.test.ts > StorageConfig > should always return r2 config object 0ms
stdout | src/engine/logic/__tests__/ScoreCalculator.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   specify custom .env file path with { path: '/custom/path/.env' }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

stdout | src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts
[dotenv@17.2.3] injecting env (0) from .env -- tip:   specify custom .env file path with { path: '/custom/path/.env' }
[SETUP] Loaded .env file, VITE_R2_WORKER_URL: https://claim-storage-dev.ocentraai.workers.dev

  src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts > CanonicalSerializer > toISO8601 > should format timestamps with milliseconds precision 2ms
  src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts > CanonicalSerializer > toISO8601 > should handle seconds timestamps 0ms
  src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts > CanonicalSerializer > validateVersion > should accept valid semantic versions 1ms
  src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts > CanonicalSerializer > validateVersion > should reject invalid versions 0ms
  src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts > CanonicalSerializer > canonicalizeMatchRecord > should canonicalize a basic match record 1ms
  src/lib/match-recording/canonical/__tests__/CanonicalSerializer.test.ts > CanonicalSerializer > canonicalizeMatchRecord > should handle match records with moves 1ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > constructor > should use provided storage implementation 2ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > constructor > should create R2Service from config when no implementation provided 1ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > constructor > should work with R2Service when config is available 0ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > setStorageImpl > should swap the storage implementation 2ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > uploadMatchRecord > should delegate to storage implementation 0ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > getMatchRecord > should delegate to storage implementation 1ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > getMatchRecord > should return null when storage returns null 0ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > generateSignedUrl > should delegate to storage implementation with default expiration 1ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > generateSignedUrl > should delegate to storage implementation with custom expiration 1ms
  src/services/storage/__tests__/HotStorageService.test.ts > HotStorageService > integration with R2Service > should work with R2Service when configured 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > creates peer connections and attaches handlers 2ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > attaches local media tracks when setting a stream 2ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > creates data channels for peers 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > creates offers and sets local description 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > creates answers for incoming offers 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > adds ICE candidates 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > sends messages over open data channels 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > broadcasts messages to all peers 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > tracks connected peers based on channel events 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > invokes message callbacks when receiving data 1ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > invokes remote stream callbacks when tracks arrive 0ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > closes individual peer connections 0ms
  src/network/__tests__/WebRTCHandler.test.ts > WebRTCHandler > closes all peer connections 0ms
  src/lib/serialization/__tests__/Serializable.spec.ts > Serializable utilities > serializes nested serializable objects 4ms
  src/lib/serialization/__tests__/Serializable.spec.ts > Serializable utilities > deserializes nested serializable objects 1ms
  src/lib/serialization/__tests__/Serializable.spec.ts > Serializable utilities > supports immutability toggles 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > sets and clears the local media stream 4ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > creates an offer when initiating a connection 2ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > handles an incoming offer and returns an answer 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > handles an incoming answer 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > adds an ICE candidate 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > sends a broadcast chat message 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > sends a direct chat message to a peer 3ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > disconnects from a peer 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > disconnects from all peers 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > emits peer connection events 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > emits chat messages received over the data channel 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > emits remote media streams 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > forwards ICE candidates to listeners 1ms
  src/network/__tests__/P2PManager.test.ts > P2PManager > cleans up resources on destroy 1ms
  src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts > CanonicalJSON > stringify > should recursively sort object keys 3ms
  src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts > CanonicalJSON > stringify > should normalize numbers correctly 1ms
  src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts > CanonicalJSON > stringify > should escape only control characters in Unicode 1ms
  src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts > CanonicalJSON > stringify > should handle arrays correctly 0ms
  src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts > CanonicalJSON > stringify > should produce deterministic output 0ms
  src/lib/match-recording/canonical/__tests__/CanonicalJSON.test.ts > CanonicalJSON > stringify > should handle edge cases 0ms
stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should respond to a simple GET request
   Status: 404
   Status Text: Not Found
   Content-Type: text/plain;charset=UTF-8
     Response time: 246ms

stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should respond to a simple GET request
   Response body (first 200 chars): Match not found
   Response body length: 15 chars
     Body read time: 8ms
     Total time: 256ms
    Worker is responding!


  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > validateAction > should validate pick up action during floor reveal phase 3ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > validateAction > should reject pick up action when not player turn 1ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > validateAction > should validate declare intent with valid suit 1ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > validateAction > should reject declare intent with locked suit 0ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > validateAction > should reject declare intent without cards of that suit 0ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > validateAction > should validate showdown call from declared player 0ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > validateAction > should validate rebuttal with valid 3-card run 0ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > getNextPhase > should transition from floor reveal to player action on pick up 0ms
  src/engine/logic/__tests__/RuleEngine.test.ts > RuleEngine > getNextPhase > should transition from player action to showdown on call showdown 1ms
stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should handle OPTIONS request (CORS preflight)
 [2025-11-20T00:24:25.461Z] Testing OPTIONS request to: https://claim-storage-dev.ocentraai.workers.dev/api/matches/test-hello

  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > createStandardDeck > should create a 52-card deck 4ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > createStandardDeck > should have 13 cards of each suit 1ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > createStandardDeck > should have cards with values from 2 to 14 1ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > createStandardDeck > should have unique card IDs 0ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > shuffleDeck > should return a deck with same cards but different order 2ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > shuffleDeck > should produce deterministic results with same seed 1ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > dealInitialHands > should deal correct number of cards to each player 1ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > dealInitialHands > should deal unique cards to each player 0ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > drawCard > should draw the top card from deck 2ms
  src/engine/logic/__tests__/DeckManager.test.ts > DeckManager > drawCard > should return null when deck is empty 0ms
stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should handle OPTIONS request (CORS preflight)
   Status: 204
   Status Text: No Content
     Response time: 20ms
   All response headers:
     access-control-allow-credentials: true
     access-control-allow-headers: Content-Type, Authorization, Signature
     access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
     access-control-allow-origin: http://localhost:5173
     access-control-max-age: 86400
     alt-svc: h3=":443"; ma=86400
     cf-ray: 9a13cdec8c1736a4-YYZ
     connection: keep-alive
     date: Thu, 20 Nov 2025 00:24:26 GMT
     nel: {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
     report-to: {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.nel.cloudflare.com/report/v4?s=BrG%2B7ByT4STSckQGIam59ZmIrsjhwg%2BgkL%2FXxDMbQFsghW8%2BkeQVBF9oz7z%2B4hrFQv4D0PrmuaEF6f0BZ7rUrwyJkDwLOf6btq6nOhFfQ%2B7lwXYrkHaOITk2d3JlxhjuPRixUp4%3D"}]}
     server: cloudflare
     vary: accept-encoding
     x-content-type-options: nosniff
     x-frame-options: DENY
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
    CORS is working! (Origin: http://localhost:5173)
     Total time: 22ms


stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should return proper error for PUT without auth (if auth required)
 [2025-11-20T00:24:25.484Z] Testing PUT request without auth to: https://claim-storage-dev.ocentraai.workers.dev/api/matches/test-hello

  src/services/__tests__/integration/match-lifecycle.test.ts > Match Lifecycle Integration > should canonicalize and hash a match record correctly 5ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Full Write/Read Cycle > should upload and retrieve a complete match record 8ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Full Write/Read Cycle > should handle large match records with many events 1ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Full Write/Read Cycle > should handle match records with AI chain-of-thought 1ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Error Handling with Realistic Data > should reject match records exceeding 10MB limit 48ms
stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should return proper error for PUT without auth (if auth required)
   Status: 400
   Status Text: Bad Request
     Upload time: 52ms

stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should return proper error for PUT without auth (if auth required)
   Response body: Invalid match record: Match record must have match_id or matchId
   Response body length: 64 chars
     Body read time: 1ms
     Validation error (expected - test data {"test":"data"} is invalid)
     Total time: 53ms
    PUT endpoint is responding!


stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should ACTUALLY upload real data to R2 and you can see it in Cloudflare

[2025-11-20T00:24:25.538Z] TEST: Upload REAL Data to R2
  Match ID: hello-world-real-data-1763598265538-khlh8t
  Size: 1668 bytes (1.63 KB)
  Action: Uploading to R2 bucket...
  NOTE: After this test, check Cloudflare R2 dashboard to see the data!
  
  >>> IMPORTANT: DO NOT DELETE THIS DATA - CHECK CLOUDFLARE FIRST! <<<
  

  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should calculate score for declared player with clean sweep
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should calculate score for declared player with penalties
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should calculate penalty for undeclared player
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should detect long run bonus
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should handle multiple long runs in same hand
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should handle edge case with ace-high run
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should handle duplicate cards in long run detection
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should calculate complex scoring scenario
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should handle empty hand edge case
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculatePlayerScore > should handle undeclared player with large hand
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > calculateAllScores > should calculate scores for all players in game
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > determineWinners > should determine single winner
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > determineWinners > should handle tie scenarios
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should validate a proper 3-card run
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should reject non-consecutive cards
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should reject mixed suits
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should reject wrong number of cards
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should validate ace-high rebuttal
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should validate low-value rebuttal
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should reject ace-low wrap around
  src/engine/logic/__tests__/ScoreCalculator.test.ts > ScoreCalculator > validateRebuttal > should handle cards in wrong order
  src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should respond to a simple GET request 258ms
  src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should handle OPTIONS request (CORS preflight) 23ms
  src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should return proper error for PUT without auth (if auth required) 54ms
  src/services/__tests__/load/merkle-batching.test.ts > Merkle Batching Load Tests > should handle 1000 match hashes in a batch 176ms
stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should ACTUALLY upload real data to R2 and you can see it in Cloudflare
  [SUCCESS] Upload completed!
  Result URL: matches/hello-world-real-data-1763598265538-khlh8t.json
  Upload Time: 212ms
  R2 Key: matches/hello-world-real-data-1763598265538-khlh8t.json
  
  ========================================================================
  >>> GO TO CLOUDFLARE R2 DASHBOARD TO SEE THIS DATA! <<<
  >>> Bucket: claim-matches-test
  >>> Look for: matches/hello-world-real-data-1763598265538-khlh8t.json
  >>> Match ID: hello-world-real-data-1763598265538-khlh8t
  ========================================================================
  

  src/lib/eventing/__tests__/EventBus.spec.ts > EventBus > returns failure OperationResult when a synchronous subscriber throws 15ms
  src/lib/eventing/__tests__/EventBus.spec.ts > EventBus > processes async subscribers sequentially when awaiting 13ms
  src/lib/eventing/__tests__/EventBus.spec.ts > EventBus > drops queued events that exceed TTL 61ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > initialization > should initialize successfully 4ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > initialization > should not initialize twice 1ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > bundle loading > should load critical assets bundle
  src/utils/__tests__/assetManager.test.ts > AssetManager > bundle loading > should throw error for non-existent bundle 2ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > progress tracking > should track loading progress 1ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > texture manager integration > should provide texture manager 1ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > statistics > should provide usage statistics 1ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > memory management > should clear all assets 0ms
  src/utils/__tests__/assetManager.test.ts > AssetManager > memory management > should optimize memory usage 1ms
  src/utils/__tests__/assetManager.test.ts > IndexedDBCache > static methods > should check IndexedDB support 0ms
  src/utils/__tests__/assetManager.test.ts > IndexedDBCache > should allow creating an instance 0ms
stdout | src/services/__tests__/e2e/full-match-lifecycle.test.ts > Full Match Lifecycle E2E > should complete full match lifecycle: create  join  start  moves  end
Step 1: Creating match...

stderr | src/services/__tests__/e2e/full-match-lifecycle.test.ts > Full Match Lifecycle E2E > should complete full match lifecycle: create  join  start  moves  end
Error creating match: Error: Account `matchAccount` not provided.
    at E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:40:23
    at Array.forEach (<anonymous>)
    at validateAccounts (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:34:16)
    at ix (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\instruction.js:39:46)
    at txFn (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\transaction.js:16:20)
    at MethodsBuilder.rpc [as _rpcFn] (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\rpc.js:9:24)
    at MethodsBuilder.rpc (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\methods.js:269:21)
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at GameClient.createMatch (E:/ocentra-games/src/services/solana/GameClient.ts:78:18)
    at E:/ocentra-games/src/services/__tests__/e2e/full-match-lifecycle.test.ts:120:21
stderr | src/services/__tests__/e2e/full-match-lifecycle.test.ts > Full Match Lifecycle E2E > should handle batch moves correctly
Error creating match: Error: Account `matchAccount` not provided.
    at E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:40:23
    at Array.forEach (<anonymous>)
    at validateAccounts (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:34:16)
    at ix (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\instruction.js:39:46)
    at txFn (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\transaction.js:16:20)
    at MethodsBuilder.rpc [as _rpcFn] (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\rpc.js:9:24)
    at MethodsBuilder.rpc (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\methods.js:269:21)
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at GameClient.createMatch (E:/ocentra-games/src/services/solana/GameClient.ts:78:18)
    at E:/ocentra-games/src/services/__tests__/e2e/full-match-lifecycle.test.ts:204:21
src/services/__tests__/e2e/full-match-lifecycle.test.ts > Full Match Lifecycle E2E > should complete full match lifecycle: create  join  start  moves  end 102ms
    Account `matchAccount` not provided.
  src/services/__tests__/e2e/full-match-lifecycle.test.ts > Full Match Lifecycle E2E > should handle batch moves correctly 12ms
    Account `matchAccount` not provided.
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 21e45aa0-5f91-4c30-868f-a759fa19a9c1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d29a21ce-198b-4238-8305-7a8c98095761
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4a20b538-0a1d-4819-8087-94ae5cd738f1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 09c6df58-f75c-4a80-a4de-1efd5ea6844f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a6b21853-a85f-4d20-864a-5d3f7a1d396c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 25982508-c5c3-491f-98b2-ba9f17644e8e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1ee2a5a8-94cc-459b-b839-376b6f215007
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5da5a952-d990-4233-bcd1-f4d885099f83
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5c271b6c-3c29-45c5-9f3b-0f9ce1d9c89d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 43aa8d9a-2a4a-4a5f-86b1-415543f6ad5d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6b47c655-bee9-4205-bb12-930d5af7ce1d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1eb35faf-96c3-4cbe-8c3e-9d8580dfa760
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 46f14034-ede2-428d-89ad-e124f469bb92
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 44c0f8dc-5748-4227-82a6-b1136089c502
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3e01a6ba-b9a0-4adc-a9ab-1bc2efc369c1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: efef5447-6832-44ff-9ec5-f7d307030a0e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 218a2007-cf90-4ef9-8acb-2eb77f2bdfa0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 42ca8ae0-1d9e-48db-a867-cd1d115a0a4a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: da740136-0c09-49e9-9d56-bed873d27e07
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 30a32217-7374-4b6f-ae41-60bb74db78ba
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 89355f87-f58a-4f1e-84f9-be2c80b1d708
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 76e56671-18b4-4af3-a821-dfc66741f74f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7b134ea1-6ccf-4c3d-b89b-d0b0320a1dfe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9c345b94-1c09-427a-94db-c7df05145035
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 424970b8-cc64-4aa8-bbac-f0407b5963c3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ced6ea1b-457a-4aff-8ee4-2221824b584a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a1d89bcb-3ac1-4262-8665-46424098531d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4d20697d-26c4-4c23-a8f0-6639f7835e6b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4cf8a31f-04f2-4654-b65c-de021f88258c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 005ce4a9-6ad9-4b5d-99f7-62296a906054
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c1100b7c-871c-44b9-be75-38e13a9e95c4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 61b6db2c-0a41-49be-ab24-d14d4f21318d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6d2c5b4a-cecf-4401-a227-8e011082f706
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 87a578d4-38c2-42a9-ae18-9dc3c5c28c4b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b9aad466-a109-4a6d-8d33-92db91acf1ce
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 87f49793-8417-4caf-84fc-435936420ed1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d8b06a91-59aa-422f-9774-09c533745311
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9a59eddc-017e-4691-97b5-e29171096647
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fdeff086-52f2-408e-a9a2-e79878e4b892
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 119d6c6c-13d8-4d03-a85d-f37b3002d8dc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8798dc79-f8c2-4ad4-ba56-c7a304d35af5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5566102a-6c66-4f70-bb89-5819712d6da6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 249d7384-8ce1-4fd1-9c29-5dd8a8c30c67
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f3033ed6-c53d-4c99-8916-529cbd72ae26
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1e00f689-6ff5-46e5-8ca3-434a101cf4d9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6b5ee425-269a-4db8-a57d-658c85ef66f0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a6f72d34-cfcd-42bc-8e28-60427466ca2d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: aea27644-aed8-4f43-9e15-6f1b5d452153
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 20365a8f-a74f-4cbe-9d11-db1cbf67d6a3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eb93488a-0910-4c00-84c6-b46a0c8d6689
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5bd00d9f-a77d-47ed-a0a9-67926b224bcc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f06e31dd-c88b-44fa-8ddc-9de0a71aad3a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 98cd8d67-988d-4ca5-b65a-7ab82c924eab
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1fc143e0-3411-4e7b-b952-26d8c5952f64
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8af73094-5ed1-4447-bea9-0ab289904b71
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 31dbbdd6-bff9-4027-bcfe-3dc9299fe753
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 31e8ccd6-b4c4-4d02-aafa-4433d5c0b2f5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d271ec85-ac34-4683-922e-e0f2ae6839d1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: dd327194-33e3-4d43-a1b1-ccab2b1d867a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 80e06159-24fb-408e-b24f-fd9a422b49b5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5105b805-97dc-4487-892d-0411fadc51a5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 75a8e099-6aa7-4b81-a80d-e48ed22a2868
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 503bdaec-ccac-4f44-9206-91e1d76474b2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f82c448f-9e6d-4851-a4b5-dc07a1ba9d9e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8688c813-95b1-415c-84e1-206b7fdd5c6d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stdout | src/engine/__tests__/GameEngine.test.ts
[initModelManager]  Initializing ModelManager (early initialization)...
[initModelManager]  [Init] Setting up fetch override:
    Original fetch: function
    hasSelf: true
    hasGlobalThis: true
    hasWindow: true
    selfIsSame: true
    fetchIsSame: true

stdout | src/engine/__tests__/GameEngine.test.ts
[initModelManager]  [Init] Fetch override applied to all global contexts:
      selfFetchOverridden: true
      globalThisFetchOverridden: true
[initModelManager]  ModelManager early initialization complete

stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8f500bef-7ee6-4fe6-bb2e-fc006297670d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2fdf008c-a9d5-4d7a-a9a2-76eec22a645f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f98c179a-88b9-451e-b074-7163e9d143db
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4a5dcafd-255e-4f4a-91e6-02f728216c92
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 58653443-f11d-4230-a53e-c5d1662547f1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 01b6598f-e0fe-46fb-9b96-ae7601c14b22
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ddf63306-a567-4adb-b684-051ed048fa27
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 20e1f488-cae2-4b71-b8a7-6dc41389d32e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f08d66a3-8362-48b3-a942-682f9c435aef
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 28528d6d-e694-441f-a05d-3222d5f1e860
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6e621274-f041-4044-aa20-a48477ba9fde
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2a6810fa-ec2c-4ffa-b341-2cfcab67df30
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ba81ec7b-7e1d-485c-a48e-836ed1a96072
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 01e4478b-fb0c-44c6-9f8b-42426f11469f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 397deb81-9e97-4f48-ad76-81d34644f7b8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4924ffa8-34ca-435a-a32d-cdcbc15856bd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 566b3463-efac-492a-86c9-52f5152e29e2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7ae9e49b-0c2f-4619-8baa-e29a014f3971
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 793eab57-cc82-4894-96ad-0210dfddecf6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 33198d85-38a3-41e7-89b0-98800abb2046
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: be09ec54-43b7-4e0e-8567-d0ce87c0db07
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f80217c3-7e6f-4456-946e-fce30531a593
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eee18af7-3e4d-4492-bf00-4a9f09acf936
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 113fbd30-1061-47a2-bce9-3d9e95d22c19
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0a060eef-f857-4d0c-a97d-656d68b930ae
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
src/engine/__tests__/GameEngine.test.ts > GameEngine > initializeGame > should initialize game with shuffled deck 9ms
  src/engine/__tests__/GameEngine.test.ts > GameEngine > addPlayer > should add players to the game 1ms
  src/engine/__tests__/GameEngine.test.ts > GameEngine > addPlayer > should reject players when game is full 1ms
  src/engine/__tests__/GameEngine.test.ts > GameEngine > startGame > should deal cards and transition to floor reveal 4ms
  src/engine/__tests__/GameEngine.test.ts > GameEngine > processPlayerAction > should process valid pick up action 3ms
  src/engine/__tests__/GameEngine.test.ts > GameEngine > processPlayerAction > should reject invalid action 7ms
  src/engine/__tests__/GameEngine.test.ts > GameEngine > validateGameState > should validate initialized game state 3ms
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e4f2dc4e-77a0-4eeb-86da-6834d388d9d3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 64e875db-5ebd-4fa3-a959-76a323015a69
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 85c1cd63-0d67-43d5-954f-73369bd04b6a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b57d9cd9-9be0-42f5-8348-1cc7d3214ad8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9c11a110-467a-445f-80bf-b0b1c0e585fd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: dbdd1110-aef6-4e4c-8f6f-5a82955a3c43
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 72e9aff6-c62f-4f88-8110-f64f6026425e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a1db6d3f-720c-4fc1-a4c1-62e5538c2e0b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: aa497d48-0dd4-406f-bf63-c1b60ac4ab68
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stdout | src/services/__tests__/integration/verification-workflow.test.ts
[initModelManager]  Initializing ModelManager (early initialization)...
[initModelManager]  [Init] Setting up fetch override:
    Original fetch: function
    hasSelf: true
    hasGlobalThis: true
    hasWindow: true
    selfIsSame: true
    fetchIsSame: true

stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 27d1d549-ee10-4aef-82b3-7514744a4084
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stdout | src/services/__tests__/integration/verification-workflow.test.ts
[initModelManager]  [Init] Fetch override applied to all global contexts:
      selfFetchOverridden: true
      globalThisFetchOverridden: true
[initModelManager]  ModelManager early initialization complete

stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 397866bf-699a-4ce7-891c-0e4bced9e0e8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9c8af0de-c264-47e4-8dc6-473c11485652
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2e4403f4-cc07-43c2-8512-bdac0eb92011
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9f75a471-833d-45fe-81c4-1945e77eb6fa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 665af674-c3c7-4e4e-b4da-07d25291932a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 17fc97d7-442a-48f9-8d2c-f3aef02b3af7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5cfb9614-c9ea-4925-af9a-488608a68326
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7e360b76-8c4a-46c0-992b-14908d615515
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 14c04f50-63a7-4612-988e-3a35a6c516bb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 69ea15d3-d2a1-41a8-a1c4-85328d3d8560
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 84a4db22-cd0e-41e8-b5f7-0903cf0d5d79
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 67d4b68a-70f6-4947-b473-99705ddcaf9c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0f931d6d-332e-4d48-82c1-214c2316f1ee
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a25aad79-1b10-48cd-99ea-edac8ba61ec5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5c42ba96-97da-4b3a-9587-0f499d020dee
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 76cae218-df1a-47cc-91da-582ad9fd0024
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3c6506ad-7e74-4e0c-96ac-77d00f04b3d9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 864eedc1-a660-439a-a8c9-6d3533cc4276
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 91c40034-5726-4b6d-b464-d82d28554d92
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 65bac97d-b96e-4b82-bc9a-6fcfa6a5d486
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a7424c9d-2955-4628-ae97-a67b9d727715
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cdb5d0fe-3793-41e8-aa61-20dffa8326c0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 42547851-1158-498c-9869-cbc535dc6d14
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d6040331-01d8-424f-b8f8-e7dc6940df66
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d351f674-37c3-48f6-8877-5a219cc2374e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 404f435f-475f-4fd5-9fda-532ff48290e2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 310d66e8-68de-4b43-8630-e84ccceb1b75
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6fb3db81-7fb9-4bae-b018-0dd140d99cac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0428c449-b013-4e2f-b0a4-dfeeab0fa85c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f3abd80f-63c1-48dd-8d4e-f4c736619c69
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 61dfae44-2305-44b0-887a-677a52eb5ac6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bd7e8834-d51c-43e5-9909-bef0f42ce073
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 51ed46f6-0b98-4ad0-a25b-509514bce185
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 274800e0-a293-407d-b256-f3c113510988
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2489e2b7-58fc-4ef6-b7b8-6610e0ae4c46
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8c796081-7cc0-48b9-bb34-a0a30e14a839
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f3d11174-081b-445c-a676-22df3807a5bd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f93daace-a8ab-4f29-a05d-07e7faf732d2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0a3a0261-9841-4696-9f99-7147b102fc12
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: af474b26-8df4-4b46-b037-e31ecb509c00
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5788de8b-c6de-4683-ab44-37db24b63941
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eb09a6b7-7969-46d0-9bc6-ee970a011360
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bd13a6e2-b511-481f-9339-ce7b2c4d52ab
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d2dfbf65-25b5-458b-914b-a62430a8f71d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7f6cc08c-6ff1-4e61-acd3-7355cba6b10c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 722208d3-40a5-48dc-bb07-59d3e1c4184e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5c06433e-8eea-4821-9395-6da94d652325
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3e6101a8-643e-4a46-bf14-50bee8a26107
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3ffb7546-d735-4904-891b-b0e84fc48cd4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ec753567-cdf7-482a-b6a4-ca8827fc43e7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 024cb891-5c99-457c-b19d-151d0ace6576
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b84aca90-30f4-4aab-97d3-b7dadc454fe6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 600481b6-5093-4de8-8688-8eb5d6dbc495
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 71451fcc-6b8c-4052-85e8-a3d7425165c5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/integration/verification-workflow.test.ts > Verification Workflow Integration > should verify a complete match record
[getMatchPDA] Failed to derive PDA for matchId: 550e8400-e29b-41d4-a716-446655440000
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 48240a06-0184-4973-a90b-9204505b5c9c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f4b3949f-59d0-4c13-a4e5-e5b50b48a174
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 42d9f384-0c5b-458e-9138-79344340b0c5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4805558c-9d9a-4d04-9303-8928e6d58ee1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 85b454ae-6832-4df4-afdf-533df23a8cdc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
  src/services/__tests__/integration/verification-workflow.test.ts > Verification Workflow Integration > should verify a complete match record 137ms
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 77cf1486-4eb2-4f10-a25f-5cd50cffe590
  src/services/__tests__/integration/verification-workflow.test.ts > Verification Workflow Integration > should verify Merkle proof for batched match 8ms
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 02f9b3a4-7eb8-4cfb-88e9-faa8d66f9ade
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 14a18c55-8b65-4297-94cd-546ceb429d7f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f6a63e03-dbb6-42de-a09d-ff5f37d658a9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3c8b05dc-07a5-4a73-a579-5e0ba026be5d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 01174135-0d0d-4f3c-90b3-a61bcdfe78f1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6af0fcde-80b6-45e6-b8c9-933f89198e24
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6bbdcaba-3b42-487d-b58e-abb7060900e3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a763418b-bf2b-4654-86a0-6373f7eb65d9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8b311127-b622-4183-93cb-2530e37e6360
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f3548c63-aa30-4894-a6e0-349ed4b031bf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
src/services/__tests__/integration/match-lifecycle.test.ts > Match Lifecycle Integration > should handle batch creation and manifest generation 1719ms
  src/services/__tests__/integration/match-lifecycle.test.ts > Match Lifecycle Integration > should verify canonical JSON determinism 1ms
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c04f5576-b9ea-42fa-92fb-d666345e4e1b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 97993e0e-fee5-4b4f-8d24-d4d692c1bc5e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8d31067f-a72c-493d-8f6d-759209a7f457
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 046b133a-9ad1-4c0a-9051-8635766f913d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 27aabff7-d4ee-442a-9129-a263dd31065f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bea6ea27-0686-4ce0-a0aa-dba64c12a632
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e9a07559-2d57-4d82-9a14-d40879f3e161
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9f463b6b-bb3b-4637-8418-27efe9a2f6ce
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 329cc8b9-bdad-4499-9e88-d21aee59a6cb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f3dde7e6-50c7-4c16-b4dc-f9d1d9897929
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 99c2ce4a-5075-4441-a86d-30e6598db862
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4847ba6d-f4d7-4529-8d55-fc8c8e1951fc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 39f956aa-2d80-4b87-b719-2a6a2be30f4a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: db52802d-da72-4e5a-a4f8-9ff78f612c92
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5d225a7b-a301-474f-b539-bd4d5907f762
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 93aafe93-7a4f-41e7-babe-ece943b8ecbe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: de4d74b0-40b0-4354-bdda-a27719376e80
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5c468458-2f93-471d-a875-25e514ad8c44
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7c5a84df-5a0c-4d99-8694-7662b0875f0f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 933864fe-0213-442d-bacf-454f3ee0f214
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e693134f-bb6d-4fc5-8e6e-dc4eb73e9250
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 096f5680-ec05-4eea-b289-2dc9fae46e07
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e854f381-5262-4caa-ad58-c2e07d66de9b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1acd9697-053b-4b9a-accd-e2c8b7069185
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5e9b115a-d9fd-433e-a3c1-c2b2b247067a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4d4780e9-735f-4e97-959a-25738c610ef5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: debb3279-49de-486f-ad84-796fc4596cfe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4164bd45-4da9-4979-91fe-85a06f974bcb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cdb9b844-bd8b-484f-9f76-9a2722ea300a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9240f94a-a7ea-4ec8-95d5-8be2f87e0070
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 621fb667-0e5d-481d-a551-7fc14effabd2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 31b09c3b-2a2b-437a-a050-571da9530dbd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 146f467d-81fa-43c8-a991-e2b1f8aae11c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 09c4ac57-b256-454c-9888-ca13cc1cb421
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 972e2698-c351-420e-b121-675e16f0b2bf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 323ca952-21df-4935-bbce-b8a9b098721d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1a23b0f7-209f-459d-bf39-893cc2c4e7f3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d2b4b1e9-878c-4938-b6bf-090b35ccdd13
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4b0ce7c4-0f67-4d96-8356-9289018a05a9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8f343df2-a331-47e2-8a9c-9c63e3ca8589
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ea4c0681-f166-4f92-a280-ae4609d694f0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a3e94cb1-c34f-4c96-a9ea-3edb48e986d0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d7fa10c9-312e-41a8-b300-2cda4f6174e6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d1525e59-1455-4fd2-831b-e23deab80220
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 670328f8-982a-4b00-afc9-3608a41cad6b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d8345aa6-5b7b-4bc8-a058-08dd232f6b61
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 05b478b3-39eb-444b-9bd3-6d6adb31bd0e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 26bf91bc-4771-4a2c-9e8c-9ca816b9da2f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 69de2c32-2c21-4d28-b44a-cfef59612bc2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7a211b21-62b8-4a94-88b9-1b9cc41cdc90
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 246db520-ef57-4e98-903f-e6203b863744
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8f4dd886-8bdc-441a-910d-251cd8cd39a8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e2757ddc-7f2e-45d7-8f3e-1be97d0837c4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0c052802-da3e-4150-9721-cb61c5de77b1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5baa955c-4978-4fd9-9ef6-712eb339abb0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 82e5c2ab-635e-4f02-b67e-b59f8606ec41
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6b73a363-95e5-4430-8b66-6aa11f8a01d4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 76d919fb-499a-4d82-97e3-628abfb64636
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 46f8374f-5c82-48ec-a434-2178d5fc26e2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 58dcdcda-45e3-454a-a7ea-2cdab20ecd0e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ea2a4fb0-f3f9-4ad7-b342-6e553cf777df
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b21b5469-1c09-440b-92d6-2ff274357a9d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 273b8396-bb6b-4972-a38a-e62dd7459bf7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f2be11f5-081f-41eb-a065-d36661dbea4c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 99980766-3578-4d55-9276-b60760666b0d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 76d68ac8-01d1-47f1-8b5a-a108e595df44
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3f7280e5-f446-4e30-ba4c-9c36ac930463
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bb4e46c8-92bb-472a-80f6-75a836dc5ebd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e603ab4a-bc22-468d-bfad-f3caa4f990cc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e4463fe5-a632-44e5-a990-9a40a5ffa28f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bf556f4b-5702-43c1-9cf0-75fd0d9d9e8f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: aab11e05-29f7-4b4c-b738-893cb2e397b6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7a2c11f9-4ccc-4dfd-9d0b-d364cb6401ab
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a2003adc-be18-4639-b322-474a106fbb89
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b01c0604-dae0-447c-bb45-1941776a29b4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7a5d2ce1-c8fe-437b-a45c-f1c2dfdab7a4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 90ced563-4056-4977-a750-05ecc07fa357
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 09435e19-46fb-43d5-95e2-87a48dc6f0f4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e355cab4-f0c7-4739-8020-4cd5e2d0e671
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b363f9aa-9d96-4e39-ad63-04d0f4501708
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2e3fed36-42f9-4ed6-9026-1f7b48dcecf9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 175aa846-365b-4d4c-a011-a9cd9bf642ba
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bc7bd66e-a852-448c-a466-0b19688b93dd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bc3870a6-d304-441a-9234-e7ac5e4a5939
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f0ce53b1-6ec9-4b71-ba4f-b15d03122c31
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 337b4d89-430a-4ec9-a1bf-ea38fde5d0b1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1080e4f7-499c-4d05-bc4a-e1f6f2635c6d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 79c5c745-2b64-4bc5-9248-ffd78ce52f88
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 023d7aa8-a579-4d01-8f38-ccac8eeff7a7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f3893901-c56a-4197-a919-8f1f35b3dcf0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 559acf2c-3274-4692-ac85-f7dece4b5bec
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1a71e1f0-171a-447d-a5d5-490af293845c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a952ee05-bde4-4e08-9991-071d044bd3ce
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 67704c4b-2672-47d6-8f20-f1059868a675
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 32aca546-a84e-4bc8-aed3-37a23cd238d3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e0f90fb4-ad11-4137-9715-75bb1df8f174
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 42bdbae9-3589-468b-ad4e-885a11f35234
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c987a788-c04b-41b5-ac49-d56d1a11a57b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b7698ec5-932d-46a2-9192-12d7a2e418d1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5d6b341f-53a8-4205-9559-4c71472a2ee7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b06f9c88-9160-4d45-9031-5cdda274b423
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4c350ca0-78c6-49d4-8d11-7ea30d8e5770
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fb3a57ed-a1ee-4ac5-bde2-353ba16e616c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cbb1df92-5d11-4f55-b2b3-45bd2609a2d7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 628c442c-32c4-4281-93f7-bc0759454044
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 55ee5f59-9a90-402c-8b81-5d03bd19f868
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6ca17528-25bb-48ee-9650-66964961ce71
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 31f86b53-2fac-4f52-bfa1-a566f4e38621
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 33686b0c-e7f5-4623-b79d-47283a552756
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 60cee713-a1b1-4d71-b9b0-59a9b8b1ccca
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9c30ad51-1c69-48c8-9ba6-b5aff10d7b4f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5e782834-ffce-4d93-9fd7-46ad41870198
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0809b748-61cf-44b0-a5c1-4b1f40337ef3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 84070cd3-1ef6-4465-a89a-bd7d466c91e1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 209247bb-b105-47e4-8771-caa295f659ad
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 80197611-7f63-427e-b84c-f8b728302c98
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9c324025-d20d-49be-974e-ab293cb58881
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 12bf00f5-7242-4e15-a985-5ce84fa7de34
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a1dd3b55-08cc-4674-9388-84fa0897df8f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 02a66677-9e00-4319-8d2d-ada3c854eeb0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ba9fa5e3-aa26-4dfb-9e2b-a4bf6c03c261
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5186469d-87f5-44b7-93ce-8c26fc992b17
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cadbc251-7e2b-4c9c-868f-e5bb4105d5b2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6a8c9311-41a1-41a0-a766-b61030e27cb7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ae8bfb5d-d040-4236-9779-ed88450efa4c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0eadee83-2aba-439f-8735-beb1f038814a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1ba469e8-13e8-4213-90a0-4855a98dbbb4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 854d92e4-3601-44ff-a639-bd3347ff524c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1ceddeb2-b02b-40c7-a409-ee86b47e9e33
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cdb9780e-c13a-4b19-9125-9436c890f1ac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9591c3d9-c02e-406f-8b4c-6d3f7e62e166
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9735b126-da05-4aa5-b46d-e61f43d8aa9c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 654243ff-ada9-456d-b60d-7ad50f3c994d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 42f7cfd5-620e-4b67-bb60-63be4eec5da4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b0c9d43d-dadf-4215-ba35-56fa8c3c058f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 749a0dd6-1c1c-483a-9b8e-3e80c8bf1105
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5b429ccd-8abc-4fc4-b1c5-015554d7ca47
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: db8de703-8de0-4bd7-bb55-f45960476367
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8e22754a-095c-4913-bcd6-0d571692dd70
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: db5be4e6-97ae-4b15-80b7-90ec8973b07d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a93761d7-a470-4d02-9c1a-4209701f429e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cb44e9eb-7125-4cfe-9fc4-9f2ea1cd9021
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: dbfd2ad6-54b3-46f5-b7e8-821ab910c022
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 667b8c80-e80a-4d0b-9c62-b701e9e37ddc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6472c6ee-3efe-4b38-854c-47ea2ca4d61a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 90c4ec05-ad43-46df-b150-b1fb53d4a926
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e2efe86c-da92-4aa3-82f6-dadaff6d10c2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 124b7ee1-f5d2-4f37-a230-fbb8a473299a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 347947ad-8ca9-4682-8098-99bdbe595dce
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 60c32c3c-a8f9-4cbb-b54b-d26ad897cbf2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 338af98d-d034-4ecb-adfc-778e75900aed
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 87b1b3cf-34fb-40d6-a00c-0b735f6f6d2a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9995f4f6-13c0-459c-841a-1e23b7d64a90
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ff86fd6e-0cea-4714-9c78-8276246293f1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e93b53d1-c23c-41c6-ad76-1f8f2c49c360
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c9c72b11-0a20-4f64-8887-676af46a8746
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: caee03a1-444d-4617-9572-bc8a7704ea8b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 30e4c5cb-97fe-4c10-8e1d-7d844465ec02
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 681798ff-e921-46f7-b92b-38a518342e7a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 919f8e4f-928e-4a69-ba19-06a65defc253
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0e145ae9-d890-4f4d-aced-18794c85e72a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9f7435aa-fef5-4440-9218-e8c447e1b6b8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 25f29474-a6e9-42ec-b284-0b814d6c0c00
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c7633aa1-1bb5-4eb2-ab5a-f1f7f9e6322b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2b6c8665-5f3a-4236-922a-0be12a6f2e5a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d1aec796-22a3-4187-9ecd-eca13c5ae984
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 299b4501-ccbc-4754-89cc-eeef45e750be
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 918917a5-1d2f-47bb-b3a6-18f325fec903
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b647a728-1714-4700-abb9-f911e35869aa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f14f879c-737d-4106-8f93-b5ef8d6dc98a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 34f05234-663f-4978-9d84-a45779d2f396
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3780c879-5123-4ebe-9b80-7ff27d0415ce
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ecab5ec5-b8fd-4ec8-9064-dcda7d40389b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d3b71e3e-6270-45bd-84c8-f780ebf4c48e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 337f56af-b8f1-4275-a39f-966c51cc6f55
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c27d22fd-b824-498e-8fac-506c4342a9d8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 34bf2d71-718f-4a4e-b479-fd566e845e98
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b801e98d-663c-4c5b-8c07-9d9174bece0c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 80c10f4a-a28e-42b0-bded-202fb789baf0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3a8de17c-6e0d-442f-a8b1-7a1200fbd37f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f8aaaf43-02a1-45c6-9e41-681b5e7e288f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 17d032fa-c8b5-4855-a834-fbfc0fbe6260
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 78cc256f-2943-44c4-a97e-82343ef7155a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4a73bf41-7ac4-4973-890f-4554847b340c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a12018d4-9b0a-4ec0-9b12-b6c52d005dab
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 65923895-d7db-4fab-8b08-72039b99dd8d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 01a231e5-183e-4ba6-ab92-341951f51532
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eb7d7b05-ea99-4d0b-94b8-193dc46e3347
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 22d1a9ca-4282-43b5-a680-5b96739c8b64
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8fcd2884-7082-48bd-aee9-6bdcdb155910
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ac2cb9dd-df2f-4cb1-b548-076ac7744355
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6e2d1a4a-360c-4e29-87c1-afbfa7ee14fc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a30f9a3e-73a3-47fb-b1c7-ba5df08be53b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 59f05230-590e-47b7-b2f3-4104c509395e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f558a2d0-be98-43c1-bcf2-07c48ea67424
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e617a7ab-fd68-41b2-b059-953b2a807f1a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b09d03d4-2acf-4cf0-ac4d-9bec5009f0ae
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a2c0d77c-72ea-48be-8e52-f46819e3cd3b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6ccca9f0-2821-44b2-975e-55aeaf48d46b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 937aa667-a91b-4e25-8dc5-53f5cd5b781a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e2324e4b-ba37-4e73-9c49-c2146f8806c3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c9364746-8ac3-4556-bb30-bdcebd4645ac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 38ecd57f-8341-4559-b24b-16fdbe19da7c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d3e882bb-6a39-4460-8d4d-6e5ad5baaaf5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d896a986-08e9-475a-b7fb-9de660210106
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8d7b7912-2e16-450c-b3a6-75934467fc6e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cb16edad-530b-4c53-9759-7efec84e8512
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e14c0a6e-e442-4d2b-8683-e3ceb9f34b08
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 58533b34-b13b-450a-96e2-56aa1aea537e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f8c2dffe-91ef-463a-b1e0-7f1617f6a8d1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should ACTUALLY upload real data to R2 and you can see it in Cloudflare
  Step 2: Retrieving the data we just uploaded...

stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 79420159-f275-4d59-8855-8ed1c023150d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a787686c-1f22-4d15-ad68-1a0dbfc67972
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3e1a87d5-b32c-4405-abb0-701118e191ef
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 56f57b04-323f-42e7-b975-ac8ade171617
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c5c9d167-0250-4400-a2c7-bc2e1d535527
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c2cc4316-6052-4563-bca4-25c88faa98c1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 63d546e8-9773-4791-8e04-b18609b955e7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 97690682-0ad4-4825-8ad2-2ab15ae18db6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: da958565-7924-4a3e-87c8-4189f6e88133
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 15dfaa1b-0205-4b83-92da-3b350c42df09
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 10eb54de-ba9c-49b2-81d1-e0ae24c8ba45
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eff5393e-1883-4875-8e53-586063e5273b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8d3d1eee-0b46-4ded-aea2-81d79ecff518
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6808beb1-5903-4afd-aa58-5e1b2d724d67
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9aa57eaf-7ac9-459a-94c5-079ce30c2970
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a9d5a21a-2717-4a30-92ce-639ef18ecb71
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 273df392-a358-4914-8f3a-73f6c750caf4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e6fcf2ef-1959-49b7-af3e-8a0daa668f51
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 86eb52a6-129b-4138-9864-a85d7c4f8d2d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 80ff6bb0-256a-46a9-9a23-dd344d2d7478
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 298e66d6-3eaf-4b94-a9a7-dacaf6141323
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d2a30d5b-13e4-43c8-b959-2fae44446f1d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9a8b4952-0737-4da0-b6b3-50b7b13586f4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 54c273f2-c51b-4d5a-91f8-d80c230e6e1c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 40962ca9-e924-495d-a6b2-16ae1c7ea55f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5c8d7c11-520c-4e3c-b2e9-729e32dffd67
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bbfdf2f9-3b01-41df-b608-06532b3597e6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 01cc8bf5-aef5-497f-b37e-319e8c0922ac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5a1efed0-52d9-469b-94e2-d7897cae654c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c6d94a43-3f3d-44ec-9e73-2f671dfdb7d0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6c392995-9381-44ee-8328-ae3b6152e882
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d2fb9e54-0ce4-45c6-a656-23a7a7f3a055
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stdout | src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should ACTUALLY upload real data to R2 and you can see it in Cloudflare
  [SUCCESS] Retrieved successfully!
  Get Time: 101ms
  
  Data Verification:
    - Match ID: hello-world-real-data-1763598265538-khlh8t
    - Version: 1.0.0
    - Players: 2
    - Events: 3
    - Message: This is REAL data uploaded from E2E test - you can see it in Cloudflare R2 dashboard!
  
  Performance:
    - Upload Time: 212ms
    - Get Time: 101ms
    - Total Test Time: 2326ms
  
  ========================================================================
  >>> DATA IS NOW IN CLOUDFLARE R2 - CHECK THE DASHBOARD! <<<
  >>> Bucket: claim-matches-test
  >>> File: matches/hello-world-real-data-1763598265538-khlh8t.json
  ========================================================================
  
  NOTE: This test data will NOT be auto-deleted so you can see it in Cloudflare!
  

stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 200e84c3-e9c2-4013-8550-4763fe21589f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
src/services/storage/__tests__/R2Service.hello.test.ts > R2Service Hello World E2E Test > should ACTUALLY upload real data to R2 and you can see it in Cloudflare 2327ms
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 597c2ba4-48b9-4043-b5d5-f6f186779107
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 83696eb7-64ad-4ef3-8ab7-8cf5a8b73005
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 52974e18-ba54-41bb-90f2-791254785c37
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b164b724-f10b-4879-8feb-23a3a81d9206
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 08d1ad1c-13a3-4031-a14b-2df8763c9e1a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 52c161dd-549a-4ed2-815c-16aa501deff4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 48d9f6bd-ee64-4f1b-ae4d-24665ec8fafa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ab9d767b-5694-4c97-ac68-c8a71ed8ec6c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b0106660-3d40-4433-9f3a-bacd5800d2d4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8ce03dc8-3708-4bc9-a1a7-d8bf6fa2d55f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c7ada13f-85bf-4b19-856b-67707d6dcb5b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3cfd7fd1-44a5-4aeb-8bd2-bf5997378522
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b0f5a3cf-f6e4-4aa5-9851-e4e48244dc7e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 82cbebe7-2a1d-4a48-8a2d-f5f37198735b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d8faff57-4de3-487a-8778-c7d9ed2cf59a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4ae700c7-78a1-4353-8d2b-1285fa4b2318
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b6e98e81-8bd7-4d89-9cf7-96d4c7c4be89
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3cdc22aa-bb45-46ba-b7b2-8f53f1e04f39
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0c3715dc-18d1-40b7-9e30-06844090127d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9b4c3add-7872-48e7-b54a-f5ee1f66bf7e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8f395439-25da-457c-8773-abf073bb7705
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 787fc28d-fc99-4ca4-b158-4488f34250a6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 16e8c560-eb39-47f3-b089-772417fbce33
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 132ee49e-cabe-4f57-b68a-c1efeedab7a8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bc94793a-f01d-4804-bf63-94fe5d464ea9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ffd253dc-efd0-4494-9058-d6edc63541ee
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 593f0ae1-1ea5-4097-bb18-73c3fef27b97
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0ed76588-10f8-4aba-9872-0bb757bf240e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f085fda1-94e1-48a9-b688-f5223a47848a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 067699d2-432a-4769-bd95-cec337e177bc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 89a69fee-eea6-4c4e-bdd4-826b805f458a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 92f8f662-c47c-48e9-880b-0ee746159e4d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 01cf2db9-2517-4ec2-b7b5-3af42416913b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 707b356b-566c-45d7-9db8-8c5d649ab5b2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1fe4dd2c-056e-4cc9-b887-651163b4af30
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a6a4ae99-5cb7-44d8-aca4-30e15965e50d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 693c34dc-3795-48e2-814e-b498294d4fa9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 428d5719-c83d-40f3-bb1a-c2e25a985cb0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eafbb236-993b-41d8-a574-3f00b2c95d9d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9080458c-3c64-4a10-bd21-60ca8457e9a3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 258f9c6b-51c2-4c0e-aef3-48cc24c49b06
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b5fb2bd9-88b3-48b7-b80e-f801e750a56b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b2fab815-ff37-4ffd-a772-e2bd07fb798a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 64d036df-9764-4941-8678-93ef5a7f8e65
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2435e882-dd5e-4975-bce6-396036b0af8f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f0106bc9-eef3-41c8-a93c-831ec77f7a5f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a9feca59-4c7a-4624-b0e0-4bf979c79e49
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b1017947-81f8-473a-9055-b6d72d4304c6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1db44ca2-8c56-42d1-8d0d-e17c8eaa90e8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 67e80b65-8791-4aae-8ec7-5d2b3d84d0d1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6f7cf208-b855-4e1b-8d1b-691c6763ec7e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 053c7633-9637-44a8-8360-76a98ff20eed
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1302ac50-162e-41e6-a2c3-36f677d3633b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d1fe5c0b-7bbc-442b-8b74-627ff2a081c7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eea36f9d-a8da-4b14-aee5-970e43e5c059
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9b1cee29-9457-40f6-baaa-7d8cb177a22f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6a2945b3-76df-49a4-bf76-48f4a3a07103
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c0f9d898-8143-49a9-862e-7dfd2271a85a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0235a279-86ba-4bc1-b566-e6968d7e7c33
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 21cf46c3-3ad5-4a1e-8b21-c2a294784a67
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f0e99364-54a0-4dea-9166-09c4d1ff16f0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 09fe5dc5-056b-4d13-a796-011daedc66b9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a1ff75e3-77ad-4444-af07-30e6b683aa9b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a6be3f78-625b-49bd-8e97-025473c885fa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should create a match on devnet
Error creating match: Error: Account `matchAccount` not provided.
    at E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:40:23
    at Array.forEach (<anonymous>)
    at validateAccounts (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:34:16)
    at ix (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\instruction.js:39:46)
    at txFn (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\transaction.js:16:20)
    at MethodsBuilder.rpc [as _rpcFn] (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\rpc.js:9:24)
    at MethodsBuilder.rpc (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\methods.js:269:21)
    at GameClient.createMatch (E:/ocentra-games/src/services/solana/GameClient.ts:78:18)
    at E:/ocentra-games/src/services/__tests__/e2e/solana-integration.test.ts:112:16
    at file:///E:/ocentra-games/node_modules/@vitest/runner/dist/index.js:753:20
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d4882ba2-5622-4075-82a3-19aae52857d5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 505ccb3d-c504-47f6-b72c-bd311b93b34e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should submit a move and verify nonce protection
Error creating match: Error: Account `matchAccount` not provided.
    at E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:40:23
    at Array.forEach (<anonymous>)
    at validateAccounts (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:34:16)
    at ix (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\instruction.js:39:46)
    at txFn (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\transaction.js:16:20)
    at MethodsBuilder.rpc [as _rpcFn] (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\rpc.js:9:24)
    at MethodsBuilder.rpc (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\methods.js:269:21)
    at GameClient.createMatch (E:/ocentra-games/src/services/solana/GameClient.ts:78:18)
    at E:/ocentra-games/src/services/__tests__/e2e/solana-integration.test.ts:140:5
    at file:///E:/ocentra-games/node_modules/@vitest/runner/dist/index.js:753:20
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 872dcb23-dbef-42de-8fdd-1e8d20f156e4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should handle transaction confirmation and state polling
Error creating match: Error: Account `matchAccount` not provided.
    at E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:40:23
    at Array.forEach (<anonymous>)
    at validateAccounts (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program\common.js:34:16)
    at ix (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\instruction.js:39:46)
    at txFn (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\transaction.js:16:20)
    at MethodsBuilder.rpc [as _rpcFn] (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\rpc.js:9:24)
    at MethodsBuilder.rpc (E:\ocentra-games
ode_modules\@coral-xyz\anchor\dist\cjs\program
amespace\methods.js:269:21)
    at GameClient.createMatch (E:/ocentra-games/src/services/solana/GameClient.ts:78:18)
    at E:/ocentra-games/src/services/__tests__/e2e/solana-integration.test.ts:219:5
    at file:///E:/ocentra-games/node_modules/@vitest/runner/dist/index.js:753:20
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e667fbf2-1642-4b84-a327-cbc29d95ba9a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should create a match on devnet 11ms
    Account `matchAccount` not provided.
  src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should submit a move and verify nonce protection 3ms
    Account `matchAccount` not provided.
  src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should verify match record end-to-end 1ms
  src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should handle transaction confirmation and state polling 3ms
    Account `matchAccount` not provided.
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bdbedf45-7d08-409a-be82-ac8754abe517
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9202902d-508c-4f01-a536-209222514e7e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 754f48e8-2549-40ed-a648-983815de1898
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 043ba9b5-80c3-4ca6-89e8-2c4a65f48477
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 05f22b05-cfc2-4bf5-81d7-68d0d18553db
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7b93928d-185d-42d0-8087-c3bff3d9f777
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4a140f4d-cab9-4eaa-b1a3-b7a30545adf9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0144d555-f7f8-493f-b39b-bc0976521582
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6b1a45d8-f5e0-49b6-b112-0ea72b5ab280
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b1164da5-52af-46d2-8b54-68ab88b87e47
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 970c0c3a-abca-4bdc-8b62-887941c1ce62
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f1be8d42-4908-4e1b-bda1-68c6211f53cf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c64c9b77-b3bf-43ec-afbb-7d019654211e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 60e0188b-5c36-4363-b931-167f1caab267
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7b063612-5f4d-4645-ac7d-d910351f6b93
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bcfe286e-d1db-44c0-b4df-99c6e569967e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5fbfe000-ede7-48f3-a3bd-269b23e6cbdd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5b85f8e2-526f-4325-9efd-c33a2799ed79
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5a25c0af-af6f-4991-b643-9fc4ecb3815d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b6b64284-6ca3-4a8d-aadf-1d03551af296
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3df2ee09-ea92-4477-9cd9-9902f6aa29b7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 06150974-cc6d-408c-b0f5-6105b89acd45
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9ff3a31e-ff56-48fb-ba50-240567562f44
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d397149c-deb4-4fef-9fde-d35c5df0abef
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 016a6fca-a03f-4042-aeca-67f64016f143
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 28ecd0cd-7bdb-43d1-b358-ed0da701e2c7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8feb3c2e-ca3e-44b9-bcfb-fa204dfd5e46
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 59958b14-0e1b-49e3-a4f7-1d0cabe80132
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b591fd0b-2d9c-42b0-92a2-1a987cf91f66
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c48dd950-1434-4b15-aaa5-8388d2eef8dd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8773105e-9fd4-49c5-8600-ef9f209df3e5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7251d34f-b692-4946-91d0-8b94edf7296b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 23c76cd5-84ba-41fa-8150-7e81d1ce3204
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 499a0918-30dc-4923-9e2d-32356cc38bf2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6f5d90c2-216a-42c5-bb49-21095b381364
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 39a88fb7-e850-4368-a1dc-f5b513f0bce1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 14149626-d676-4fff-b6b4-e43eec368f14
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: efa36bcc-8414-4682-b627-beadb0f87978
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e422422c-1bf3-4be3-8563-5d31a7c8c4e1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2710fb7f-b0ee-429c-be4e-bd4cd27fe866
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 21eaaf53-3602-4231-9536-58d8620b6d66
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9130d673-c9fe-41fa-83d1-f7ca6e5d562a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c0a92727-c84f-453e-9bd8-807f95a705eb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f0b87192-5495-4ea6-8675-591d4a44f89d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e3cc3c8b-f5a1-4bc1-8231-7ed70f572b54
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6fc99602-00a2-4c02-839b-8d726bb36843
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 482eb640-264b-42ed-a0b7-4139732da780
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e4cdcd1b-b34f-4191-ac84-972491589e31
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 66004828-4473-4455-a897-cf9ad30efa71
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 02c38bb3-2f0c-46f6-aa9e-337ab92a4465
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 98c11c96-e4bf-4479-9cbe-516b28bd10c2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f63b5117-3166-42a2-876f-0facd45bd9fb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e2ca79a1-f3ce-4aa7-9347-f9a23f2d3427
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c2c282d9-beec-41e7-bd48-3c8be425f4af
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a7c33a22-93ff-437a-9165-314639f1332d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 141f0f53-0bca-4489-bda3-8e2108d2247d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b5285068-8fb9-4b86-b8ff-f1e5ef2176a9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fcb51624-f99d-4c5d-9740-6eaa91dff4ba
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a2a6806a-a7d2-47be-b2d7-1730a5c20239
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8611a9db-633a-4ade-ab73-f64bb47e450d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 923b90fa-42a0-4075-b78d-c17c153bc7b3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 039dd197-5436-4262-be5e-67be87ea18ba
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0980a5fc-81d9-4157-a434-cc1c62cd2f1a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b098bc2e-042d-4e7a-8ac4-fe6bff6ed6ae
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c17268ba-244f-49f0-8c0e-c7c2a2151378
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5d43e571-87fd-4fdf-817d-e500f8f40bac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4f801d79-c118-4b5e-9748-a56badde7ed6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9d7245d7-6c3c-4999-9b17-7d6feefe6f13
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 808b8a3f-e605-4b15-bdae-4cca3819969a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9dd324d7-cdfe-4120-b127-29e43731c764
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a657ac59-2be8-4661-85a4-414bd20b2f7f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 90c4dc11-d05e-4353-bf98-e90122a89565
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a596a601-f89e-4a81-9959-3a28011bc0c4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ae08c7ec-4d21-4101-afc1-fafa10615b82
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 762eee2f-e605-47cd-8e69-026c213aa261
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1c95f3cb-1b9f-498c-8460-4f884f2c24f1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 893b7502-7018-4bff-aa83-7bb1c56b2877
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9986e287-69e0-41aa-b40a-dcc764b0110d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f19f44c4-c676-45b5-8469-d6e7e2340239
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4b30650f-38a7-4f30-8cbc-3f1ff64916e7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ebba7bcc-58a5-4288-b8e5-ffeb7dc051e4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
src/services/storage/__tests__/R2Service.test.ts > R2Service > uploadMatchRecord > should retry on network errors 3021ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > uploadMatchRecord > should not retry on 4xx client errors 1ms
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d42ca3d3-6f51-48e7-91f1-5d204682dc03
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c539d698-7048-4048-a860-68ae9a990cb0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7865dce1-913e-46e7-aa61-91afd4ab5f26
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3947b743-0bdf-4400-afaf-e07bae634dd2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 53da241a-83e3-4e9c-adb2-3bdc4dba5501
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f8339a10-1b47-451d-9faa-0530e3e2836d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 391289b2-cf70-4b0f-bab2-0a95362ef83a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fb92757c-014a-4049-8af2-d83e4a7e7641
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 09780d3b-c3af-4fea-a727-ce71c442d3ab
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c34c5774-0c53-4847-beec-81bdbe63eb1c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 64fc4939-e962-46ae-aea1-f1e5a9a8c7a7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4863deb0-14e7-4f5b-a1e1-74555c26cf52
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 04c933f0-c9fb-40cd-a052-f17ce3ee0c80
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 35cc3e17-9f35-448c-b157-2e1bc32f604e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6321204e-d5f7-40f5-85fb-86b4ae8148b6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 419f8a2b-062d-4ce1-8f22-b099e2a53257
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d0e6b688-2aee-4c2a-b65c-71728458b079
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: af59b634-4465-4bad-8c12-67f56e182a0c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e5cce5b9-2049-4b27-8530-cc4cfd2991be
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0f2491c4-d53a-48cd-accb-a6a3c01e3597
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0781df14-02ee-4101-91a0-92a8ab677ec4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e6d6440d-0434-4e68-86a8-86a42299246e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cd21f766-edcd-4e98-ad31-484e57243daf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 07dcb298-e3e9-4faa-aa8a-6eee92ef613a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 366eda03-0ddb-4700-ae28-e4293307e1cb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 89d1d351-f592-48f1-99ea-06741f98c5b5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 841681b3-52d6-4122-8c9e-0cab534a47ea
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8e2af930-d8c8-4140-860f-2b7b340a81a7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fb16f958-a4b5-45ee-84fd-7d68990baabe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4b72066e-33da-4d92-bcef-085c53669b24
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 80891d54-62f1-41f7-9276-89fc4a91f328
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4e527938-9057-4ecc-95fb-2a378e5a6ff9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1de14da4-7cf3-412e-8b8f-b92c4313dd83
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 97de8ccf-1a39-4156-b27c-ea83bccf0631
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1a1860b6-fa29-47d7-ab75-b027f156a682
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 770ce2d7-a7bc-4e9a-a3d6-f8738db96b2a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1ddb5517-8a0b-4cc3-b9a4-7986d0ce535f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5858dbd3-47da-49dd-a6fd-0f8fdba84e06
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0bef716e-7541-4d69-9188-feef34e75604
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: afdbfed6-cdca-4258-9799-ce8e20bf7310
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7ec17374-7b7f-4952-ac68-364629a3acb1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bb37a091-8e45-4b66-b111-02272855431a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d465b707-063c-465f-a78d-24b28d44f83a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ffd12ae0-f779-416e-8de4-4247557506e1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a2375926-87a6-41dc-9777-30476d0a3eb6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 75da52f1-4eb5-44f8-a36b-65a183d8b035
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 78d5988f-f562-4808-bbca-e8f834688f4c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 60802c54-fa2b-4768-8cd8-39c002578428
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e036545f-61f3-41a3-86b7-96a2d1607d70
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8c5274f5-5090-4cba-9984-aa1d74212db1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f13f957a-9a08-4d2a-9ea9-7d28f036adb8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ef0ad56b-7f99-4359-aa75-bf8a6de2fccc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a47159bd-fd15-4b21-b2bb-14df6807a0de
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Error Handling with Realistic Data > should handle network errors during upload with retry 3015ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Error Handling with Realistic Data > should not retry on 400 Bad Request (invalid data) 1ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Error Handling with Realistic Data > should return null for non-existent match records 0ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Signed URL Generation > should generate signed URL for match record access 0ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Signed URL Generation > should use default expiration (1 hour) when not specified 1ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Delete Operations > should delete a match record successfully 0ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Delete Operations > should handle deletion of non-existent match gracefully 0ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Data Integrity > should preserve all match record fields during upload/retrieve 1ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Data Integrity > should handle special characters in match data 1ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Concurrent Operations > should handle multiple concurrent uploads 1ms
  src/services/storage/__tests__/R2Service.integration.test.ts > R2Service Integration Tests with Real Test Data > Concurrent Operations > should handle concurrent read operations 1ms
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5800c382-117f-42f0-bcf3-df28c9294960
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 876678af-31f6-4861-a308-55bc7aef96da
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5fc0c214-8533-4a6f-b625-bdd0838832f4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: efd4275e-56a6-4628-8839-3134ee345edb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ad220a37-5353-4652-af8b-93933c6c69b6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3c8bb01b-937d-4316-9d0c-0298e3276ffd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 00bf8f21-4c48-4e25-92a3-b0de607be267
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ab82debf-2924-4b8f-9079-204dc37da247
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cdd9e2a2-a112-4167-934c-d32bc527334f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 23bdacba-563e-4090-9f8a-6a8e64a51a24
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3babc240-3279-4b6e-9d4b-9d63ee816da4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 36ae0227-dc0a-4a4c-842e-48daae6eba6d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a4fde63d-9ae6-46c2-a33c-7c6a61919e68
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b5882ab9-c9d2-4ccb-9277-310ea391ab00
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 86c01f9d-016f-4f02-82e0-7abd39c88954
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 60f6076d-6bd3-4005-a87e-5aeb398f0711
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 26f0af02-d45b-49a8-aa29-d7e3815b583e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fbd12cef-af49-4cbe-b10c-e0827198595b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b21874bd-e42f-42f6-9f08-173125de99c6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cda11443-53a0-4b8f-8f2d-447705c490aa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0389cf95-4ac3-4847-a001-4c952d5c3bc7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0868163b-954a-41f5-9ced-67cefdbd1ceb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0e535ad8-b8d7-4386-acd1-68416b653180
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1b89eaf5-1831-4cb2-a527-d27dcca5e030
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b01e7ef2-40c3-4578-837c-079d61a1cd1e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3ff1224d-90e7-4bc0-9de6-ae055106b62b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bba9b29a-789d-4994-82dd-f603d967cc4b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c6d824d5-79b0-4825-9a3d-1e0219e7b4e2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 70069251-bf2d-46cf-b523-f0af2bd62c28
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 48d1d68a-5d51-4d17-aa29-fea33f1fe2a5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 845475ad-c48c-4ea1-9af8-ec3ecb4dea38
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 89631e48-61a3-4566-9431-7ea60b201f8c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0b7250a3-a681-45f5-bf7b-5ae32a99699a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cc9a0076-10ef-44f2-85b8-90dca8e67c5c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d53794c5-06d1-4c0f-a02a-12350630af78
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2a4ff3cd-bc39-42aa-9175-479e42fa5cfa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8e533324-a3f3-45c9-b219-6a6ada0813f2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a21967bb-952d-40a3-89cb-a12c4fc94e90
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cf478db7-9d2e-4a99-9896-a23b49d9d828
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7a4e59ec-29f7-44fc-bf43-170021f9cdc9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4d32b5e5-4a67-4edc-a01f-6614e3423cf1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d9c6362e-53a3-4a1f-9262-7c106bb225c3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d4debc2d-ec07-4f10-8602-e281ecb5ea15
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 72ec26c2-c683-4f27-bb53-54eaab2de060
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eb56e967-c74a-4e2c-86de-0a196df475e9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7a6b1522-68cd-45a3-b719-8e09b4edefae
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 65960d40-7367-4c5e-83dd-735896054f8f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4bba797c-acec-4b69-a39e-4dc0e4638e21
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 57a31957-22bf-480c-bad9-962e0c2756b4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a331634b-9af9-48fd-abe6-57abd59597db
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 907853a9-2eef-4b09-b22f-23d7ea9de8de
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c38885f9-87f1-4ced-b309-031e2a033aa3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 558eccd7-2aa5-4ab0-9487-490c639f6ff2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 55dff823-c065-445c-a0a0-66fe6d045bf7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 592e75fa-b259-4416-9e4b-9f3b4979aa65
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 364d0633-bb0e-4a05-b6c7-129555b91186
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9a3ef510-a407-4f5d-9886-f380473ddb82
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0282d82d-a089-4fa6-af44-c850f98a2571
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5e1ade6a-dd84-4a3a-a560-12d50e98fcbc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 99ca2018-7013-4695-99f3-034f6c2e7d5e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a99b8163-989e-4312-a973-8e5a843de31c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c96c01e7-cdd9-4af9-9c78-1e7f674a0ffe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e416e7d1-f0f3-4405-8cde-172e10352c5d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2f665522-3319-46e1-9957-a8ae80ac42bc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: db7277db-4383-4d84-888d-6ddbd5db288b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7b9ca3ea-fd33-4f8c-bcc4-d9b66978fb16
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5cb375fb-919d-47c0-851e-5698388e7eff
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e040b40b-ab48-4a8a-876e-c3d26606cc1c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0c0ac530-1f5d-47ff-bf8e-51aaae7827a1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ff972bfd-0965-4422-805b-0c7fa47f9e1c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bc3b309f-1eb7-4d27-9cb4-4d48865aaf52
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 17393983-0e6f-48c3-8213-e2abb9f6e5af
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 49a9cf78-4a8d-4540-b19b-c13b97637fd3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bc65cf16-3c8a-473b-93eb-39c2b46a4ef5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: dc2ae399-407b-4384-9e5e-31b06f5245ac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1c75fa93-da33-4318-9165-b733c667fc93
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 27d4f983-6524-4d1c-88e7-cc6394fa3242
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 938f6715-cf87-4a39-99b2-5d0e1b420c8a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fb3b4f5a-d05e-4ad7-b0c8-f4f1ca74dfe6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fb025d7f-5f74-4d49-a304-ffc54b1f501c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b75c579f-7da6-43ab-9f40-68394fce6f13
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 14cbaa82-9d03-4814-83ad-0a223f32fd05
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 47783266-94ba-4478-8006-05b69dec58ea
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fc9610c6-5552-4d2a-841b-bf48e8192d61
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9c6844c7-b26b-4270-add9-cd0e2b53490c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 62bf117d-e197-4b3f-a5dd-d329aa820ccc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5ab9071f-feaa-4196-ae48-b72e30c7f0db
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7dffdf3c-a001-4f1a-bb15-f29fed26feb7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0d960e87-2db9-45f6-be33-5cc5f884e78f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1223cf7e-fa9d-4c62-a03b-3042e6aab803
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 40e4d792-67b8-44df-8bad-c51d7b4731fe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ac9d5b46-7abf-484c-b091-35f2b94c8c69
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 65d494b3-de1b-4d36-bcd1-8f39b8c43bbd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ff1e9ba6-eecf-457a-b539-0452ef16b597
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b4b9284d-ef23-4130-9d7f-f935467af46f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 74e78598-7862-4351-8f24-294cc99ab9bf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cdc225e7-e070-497e-b3af-652e883217eb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d44611eb-b3fb-44d2-ad0b-b1a4c4b476d3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 16dd8ea1-4064-4f3e-bb99-95dfa36778c0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 986345f0-f9d1-4778-8dd5-b2dc02b25841
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f612fe48-cef9-4804-92eb-f8e5fe58df4c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5183996a-3abc-4122-9e3f-937dbe061c60
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a0f002af-0ce4-4b4b-94f1-dd12f51237ee
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8f21d860-7bd0-4860-87aa-4d95d44332ab
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1f2da3b7-93ca-46e7-9a03-1bbaec838845
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3d21bf21-4d3c-4889-9d26-4123b04acb7e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3d7c90bb-f46e-4bd6-9324-59e3ac8684a8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7135d2db-40f4-4806-8ab1-81c83a183994
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f5f18cfb-8454-4540-a4de-e45287e8883a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 193105ed-9062-4448-9175-6e958956b2c0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7920ba56-cb67-428f-8526-33e173da0775
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2f756d00-a61b-4516-9a86-8f03360a7707
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fca48017-fd8f-41e8-8df5-f881bd850674
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e6e8b0e8-b98e-42f4-9c33-985c4113317c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 777eb593-e6d5-4478-9ac7-3227d49683ad
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: aa5d593e-be0e-4215-a408-ff6a212e474c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fbf39ead-cb91-4c12-acd4-3106843ed25f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bd5edefe-612d-4664-8fe2-f59dce9d6f16
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ae879caf-4bd8-4a2c-af7c-fc815f678c4f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0cf4ac93-52ff-476f-b376-146eeba033b0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 80fe83a6-1566-4a55-9e26-64f30ab598ff
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c3bb9792-6f38-44d8-82ad-06810b367416
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ed8e1b9d-4949-4311-ba90-c70be6325eb4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0b453ea1-bde8-44c1-92d4-4d5858eed23b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fca5e90e-3a04-4127-a4f4-8a04bda85e98
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 44964758-76f9-4e7a-9553-b61324e72152
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 29b628f0-4519-49c2-b759-7a08ef5277fd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 47b655af-de60-443f-b645-53d09d68bdb0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 80fd2250-adfe-4c91-b60d-129aa0f09fba
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: db9c0c53-368f-47be-a0b3-6f3255bd0fa0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cffaeb80-27ed-4c44-bdae-9ec47dd40fb1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 78d250c7-9b62-402d-8310-bd90dd9b782e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 035da912-fbee-47ef-a216-2e8cbca2e3f9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0914d98e-827c-437b-8a60-27b3c004d32d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5ddfc63b-358a-48e6-bd61-80b8e16a2de6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ffe50ae7-ba31-4a08-accc-878615b99f0d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b8c17c73-4378-4462-8ce7-44a50d671c3d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4b63beda-3e01-40b9-8393-356715a4f54b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 90ef03ce-290c-429d-8df5-fa13b55fb6d7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f5235cfa-0ae3-4ea1-b47c-830e1e46bef2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 10ba682b-c777-4008-b372-8d0b142f6f78
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6b02b60a-a491-4fb2-99dc-bd9175400bdd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 47edf3ed-06c4-461a-9f99-2ac23eae6459
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0b0ffc04-bd91-48cd-8afa-521a1cba3606
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0935b024-0e28-4ec5-b027-611d823fe4ad
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3c9cc32a-2c5e-4510-9de0-6abb208e8915
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7522b403-66b7-4eec-9a2c-a12789cd7601
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 08501890-e9c9-4d2f-8b87-ee89acf4fb81
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 04069809-7465-4639-a403-72d1ce1aab0f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 114ba60b-23f0-4bb7-aa4f-0b79be048a88
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d3b92f95-f238-4cf6-9930-abac8a2a70f7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 50252956-2891-4d06-84c7-340589198c85
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d7bfc29e-b77c-41f7-bd43-358cf0d34552
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: da57bf54-f137-4260-bf03-988eb82bf7ac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 27ee32ce-da42-465a-baae-8bda01de58f8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2b891ad7-2012-4003-9add-b49637591f7b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3c57e7ce-83be-4f16-a0b6-ee8dc17ea0b1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4848a4d8-b749-443e-9c93-32d850f70e21
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1100e7ae-c097-4a83-b78d-5bd0e1a86766
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f594961a-3b5a-42a6-8b65-66337d8b286f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b63af34a-7c5f-4e89-850d-81b5b063f2fa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 077dd8a1-6114-4f4c-a4eb-3b8b97a130f4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e125e326-259a-480f-bb11-63f4b78b8260
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ce94f016-48a0-498d-8a9d-65672eebf886
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7dbb855a-3a2d-44fc-9671-cce3ee6e42de
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d3be6d09-fdad-4130-b945-8c7190c9eeba
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3a254d5c-6741-48ea-b175-f3b79a4b46e6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c78bbaba-c9a8-413b-8e7a-9919fc6ec748
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6d0d0796-30cc-4722-aaff-726babeca5e2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5c02417e-fc87-46fc-80eb-f0a2ede2f15e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 18ebb1b9-cd53-4ba1-81c8-6022b32a271e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d2cc92e0-2df0-4686-83aa-c521e213f9d7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a30120f7-d83a-4315-b262-66a7b9e27edb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 694eb886-8c4f-43a6-a34d-db212f95139f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3158336f-ecbb-4d0d-8b1c-e7902384b7eb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1c46b440-bfe5-436c-9e31-457602f8e38c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b7ef8348-2204-4bce-a448-1d248e0c9a3e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f16b3470-27d2-4888-b452-400617a20a48
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 69744fd7-b2e9-4c1c-a22f-1de930131807
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d2685fe3-892c-4024-8ca3-5a68d13630ff
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c09699f8-c74c-4700-af69-4f866d5a6c24
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d3ed93f6-b745-4f11-a657-c35c16429467
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b992a1c8-3207-4c89-a84e-beed19452357
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 008a44a3-9494-446e-b242-3885f49c3aa3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2387ba9b-a909-4608-9bfa-e0dd25889dbe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8bed2b4d-9631-43b2-b04c-d32e54096a6e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 943da24b-2c07-4243-855b-6a1ef70a917d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: dfd480f8-b6f3-40e3-bcfb-7cb35e1b2e33
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ce9cd8db-fdd5-456f-9f8a-2b8ad341e067
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 33b56ed1-71c9-4780-8a5c-c2d30821343f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 094da152-7eee-46de-b27a-73fbc93c3d66
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8aba025f-0e79-43d7-b152-2eeb414ac08e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e2787754-2915-453b-b23c-aa29769a5323
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: db9c6531-1082-4921-a4a9-097579e19364
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8f6be945-ee97-4614-a631-81fcf9967304
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4fe6b595-04c4-42a9-92c8-93a313747b1f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: cd4c9c89-34fb-464f-b645-3974e6bbb5e4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f5128757-79a9-4c71-9401-ee46d8b42a7e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 26ed3c70-3af2-4b21-bf91-5a12f760315e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 42670db9-d939-43ef-b77f-bf0229a569d6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3ce34c2b-3f5e-4212-8cac-910b930f49ee
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 55788256-139a-47b1-8d89-5db0c4fb3f1c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7c70cecd-2305-4b5c-a4b4-4e272ec1a8ee
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 491c55b0-19c2-4de6-9c22-67dca1e47cf0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e6587d71-fbd2-476c-a802-1a372c5dae25
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9696aeaa-5c7a-4e8f-bc0d-eb59c2a5503b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 655839ad-d361-4d35-869d-e7228525381a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 44755b19-dfd1-4522-b33f-bf647f1055c5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 10447847-e2f2-4103-98f4-a6f3abe16a5c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 65ee746f-0314-4548-b643-aae2089b1cf9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6f8d6826-a9bc-487d-9ca0-c6679f853020
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f650da78-275f-4178-95a0-8c990ad54f03
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fc9da1f1-05bb-4ff9-add4-2e004a700c92
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5710b22f-83bc-4880-bf50-877382bff9a8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3bb44292-d022-40bf-b71d-9c689b477bd8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 23a01f46-dc5c-4a30-bb46-7ea524e5c7b9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1d152897-2872-4829-b2b0-f4fedfb9d7b3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 93c9b5d5-385a-4eb4-ba2d-c1e3b7997ca0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f1c11e3e-4095-4824-a04d-91be335c7f5d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fc1026d7-9d35-466d-8263-d978a222f8d5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5286bbd7-bb75-4c2b-8628-9d1e2227a9b1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 23f88831-607c-4263-9dbc-4b405d30fc2b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c0acea0c-1a14-4910-8c2b-c8590f834256
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 95d141a6-52bc-4f5a-8e3b-7d224790ff49
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 08dc4292-4169-41c0-b173-48ffe6551a51
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5a87e265-fb1b-4953-bcd6-425f458a1dbf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4d8f27e2-b508-4dbd-899b-37eb38b2adac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bd6c6938-8702-4b99-bed1-23255cd6670f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4135b638-4d96-4838-8aa2-466a33ce9174
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ac5caeae-91ff-4bb6-9c72-db1e7c95fad7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e6f3157c-5915-4958-8d26-54f7127b8e64
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5aba8e0e-013b-42b4-8c32-8b5a91307d06
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b1ae3311-9c6b-40c9-b48c-6c760cd53f0b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ae05633f-2544-4230-b1ab-0a82ba012d17
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2e63e7bf-8901-4a45-84f3-d33f1a1852ae
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9a4c52f4-305a-4e84-8def-dd6219c96af8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 15cbdbc8-d4d6-471c-a680-91c6660533c7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d46c7bc9-c2b1-47fa-b286-4a8c746d73c5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 984d7c58-5209-4a5d-9f40-98d6bee4864b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: dd98b529-3260-4b18-9d09-6181a8728fb6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a4b10311-aa12-46f0-bb4f-60c3b6c10c5d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 784276a0-d59e-4fe8-b8eb-2195a7cdab95
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 56f0ef06-63be-4595-86d1-1ff68f069c8e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e3f96e8e-7418-42ba-8e5d-889aeb004e87
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 900bcaad-05b6-41db-b167-ba1c81d5156d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6add8e9f-9f06-4a1c-b7d2-84718267b171
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: abba5e1f-7224-4f38-a470-b2379863ee67
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 53831767-d7fb-490d-a49b-0ee99e5c433b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5e86219c-97e5-4556-9442-e49182acd00a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0b399bde-6f12-47cf-8f43-867f423785db
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 169f73b7-cd7e-4fdb-87d6-98e3cd937859
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 67d43ece-079a-46c4-bf51-52b3acc61fca
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 863be2ed-17e9-4478-bac0-addeefe033c4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 52d33887-93e1-404b-aeec-35eb5060f78d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fc6cd3ba-d6f7-4cf0-a710-a1f78e440675
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f07a5a1e-f438-4dcf-a02b-f0ac06ef9bbd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 189707c8-14c1-4090-b526-79bbba8ddd22
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 44484761-0415-4821-b36d-e517543b3d1a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9159cf79-a026-4726-8795-f8aae0e1302f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 12a5d9a4-5027-481f-a52b-bd861635776a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7f0cf975-da68-47e0-98cc-7b50d89b4f46
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: dd73aa7e-b739-40e0-8b58-dc01332a90af
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b68e2255-75e4-4487-b1f5-f757a3edd023
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f00459d5-3282-4499-a26c-8dc14a4766a1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 26076183-8c2c-4b0b-ae3d-db33b2aafcb6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4e4e2d84-d10b-4133-ac7f-6fad3df8f0d9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f8aec359-d79e-4ee2-b1a3-d34d222d9e0c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 30c1d5e1-5acb-45b6-84f2-a45d3ebcf9e1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b6d24f55-f0ba-4b39-94a9-61d6a206385f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f7bc6a22-105b-4aca-88f1-4e964fafad6c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8b3aba5c-f542-44fd-b933-bb85170cf474
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8dee93a8-0ce1-46b7-bfdf-db175ce8bd86
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b02ab914-752a-4980-95fe-01905b66e493
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b6be0628-1d18-469a-8cfd-4be891348979
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c151f135-0c82-4f3b-ae0a-483b88a6fed4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 17f9b705-83ea-4fdd-bf10-654bed25ee9e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 511cffad-11ef-413d-8108-ab60406995d0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4205818f-61ba-403d-9e0d-dab7a839101f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4bf58272-d085-4e3b-8005-afff6542ce5c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: db7e8416-5e57-499b-bd5d-868ed07d0b79
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8c74afda-0941-4585-89b6-ef2e553a0d32
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7e425f3f-c87f-4b20-83d6-e08e87c10754
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0ba7ec5d-fc02-4c7e-991a-64bcd36d5b79
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1e57f10e-f568-4e74-991d-9ef3a28152f3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2fa366ae-85b7-4bce-87c9-3fce669d9cbf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 20e2b437-44af-46f8-8e06-f7833dd23da6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9d6aaf73-6463-4e2b-87be-a733dd47ba5a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8680eed8-bc6e-468a-b66b-7812faeca6bf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 279d1974-f7e6-420e-a622-2be5440c1753
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1a08596f-f02d-4382-9d64-2c3a30ce641f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3c5bdf40-da81-4fa5-83a4-f83d924d629b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e6e40bbc-1273-48e1-8e95-a0ed68b7411a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 59599d5a-c79b-42ed-86fb-afc5d912fd77
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1c3d8d68-bb0f-4947-8bee-02b65f3d719b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1e0b37d1-914b-4551-beaf-e31d4226295b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 98658308-3dc7-4af8-938b-2dbe01d98082
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e253a2a4-5b26-42a5-b186-2081e73bf822
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 8733ea60-6e65-4c46-b14c-a2567bbdd3ec
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9af22d53-0bb5-48d7-a90f-90fbfa5fac35
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a0803c56-926f-40ee-9a93-e688dbdf54f2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 09f02d8b-2dfd-4528-86eb-3c44bb9dfb31
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b2bfa98c-8406-4d20-9949-6cc92f864391
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fffa3b75-ab10-4666-ab14-52300be6580e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a1e89e22-2528-472f-95f2-fad0e5cdf320
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 36451632-f01d-4f6e-b674-b6c31e084aa8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 699e37e8-16c2-476a-8b5a-fd470f1ca69a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b64a4730-c9c7-4955-9580-cf8e4cbce1ae
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4c08be2b-4b84-4e97-915e-689ff30be9a4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: eaee0cd1-9ba6-4777-bc06-1ff00c77e550
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 265d2865-0f65-4986-a280-fe55febc500b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 76b60c94-4a39-4f52-b66c-f877004d0827
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0e0d5e43-d839-40c7-bb14-53d8bd3afd5c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d619acf4-220c-4450-ac62-12d6464f5852
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 41808bb4-b4e0-426d-b0ed-8460eb517f72
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 309d06e3-60e1-4cfd-9f4c-aaa8fe87e476
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: bf90d018-a081-49fe-853a-f160a2e6a379
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3c9f8278-7069-4028-aa71-adfdba59abd1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 36570bcd-8f59-4696-8ae1-4916b48f004e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 70db1a0f-aefa-43bd-9b2e-57504efc5795
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c8216132-1b12-4af7-8069-09a78aa1b577
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b34414d5-93c3-47ca-b752-f950801282cf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 46a61fb6-48f8-4a7f-b97d-ad86db945a22
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 72232372-165b-4d19-a536-b7d6c34720cd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c7700e72-8fb4-44be-903b-e1f423457fbe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 5c54a761-f52b-495e-a344-b348378370fc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ac4e3f0c-a3dc-43f9-8d3e-a752de73dc89
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d333c293-2551-4ace-9354-5a57d799957a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f48b995f-cb35-459e-b2cf-126676b787e6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b59177b5-713d-4f43-8df7-9aeb68d345c5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 37095b0f-b91f-46ec-abfc-c48f22c52513
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1b40a26d-10ec-4982-aea7-b844581bde08
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 81b0b1cb-5179-412b-b08b-9cded3f8c18d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c3ec1dd4-895d-4aab-b6c0-4bde4f6be64c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7119aaf3-c224-4c68-bcf3-641847e89f92
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 19a942f0-7cc0-4844-8c9c-70621ac10797
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: aa58493c-ea8e-4531-b501-b10295d52b72
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a2a93ea3-e519-4dae-91c7-b02b34789aab
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 3a39383a-9a3b-4c9c-9ee0-08bb4d3b270e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2f421822-e018-41ec-b641-df2e96ad302a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d7ae4c46-c110-4f84-aeee-97409ef2f26e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a8ae55f4-b739-4374-ba21-9000624beb8a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c53f96d0-fd51-4286-bf28-4a331e1f3eeb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6ef5bbfd-e379-455e-842f-9c31360df8ba
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 97795a2e-d44f-4d10-a96e-85d7f956e475
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 00750c03-aead-4a39-b641-4ad204f763b4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c062a7a4-195d-4b86-b37b-e7e03fbe779f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 73070529-c59e-44bb-aadb-4e39e74511e5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f6d46714-4526-4526-90fb-fd8b39935c5c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1ef6424a-996f-4c32-827b-2c77a398a3f2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 82112e36-f2d3-4250-870c-2a8fd2328b75
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2661bd59-8851-4c06-bdc8-2129d2a54bfd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2d232a44-2864-492e-9145-93b7bc7516d7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1533660c-9e4c-4610-9bae-569eaad63840
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e827296d-bf5c-426f-9e75-9355cbd13550
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1a7fc34a-0c93-4090-a0e4-f34cd365c227
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: e0b72d09-7667-4316-bf24-e4b59154900f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: a4092fe5-65aa-4915-9c33-a07924f681d5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d6eff709-92ba-4c48-9e14-5a9e48da2f7f
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 0fe2fe3d-702f-47ff-af6e-7bc4829312ad
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b04d74b3-025b-4080-925e-f02c941a05c8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: c73efde0-7b22-4dc4-b50d-1c79599f6639
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 4ceb7b70-2f2c-44ab-b869-9b650a3168e5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 2c8feaf2-ef98-44bf-b38e-336e71933d47
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 9493f41f-a400-40d6-ae28-7b53b544835c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 581729da-51b1-4682-82e2-d1caf1d5471c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 91297d10-7211-4d5c-9292-4762ea0acedf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 14e340d9-72c6-4f31-8616-b7fcdeec9d86
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 1b1bd5d1-a658-4413-8ce8-ac306d196ed4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 953dc33f-1396-4cde-99a9-b2a388dd6fd5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 27f5797d-ed2f-4ebe-8aff-4795bf70ff0c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 268a9a8a-d9ae-4b08-a770-ef52ebaaa8cd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: ab6cc939-fb3d-41a5-8b57-9072eeabdf0e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: de2260fe-29fd-40e3-ada6-be5f0d8c5989
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: fa028ebb-5eb4-4495-b445-6f4a875ce706
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 6727ad01-cbd4-4e2b-ac06-25e7a2150917
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 37c23679-4f69-41de-8c34-567efdd5d891
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d3f2a171-df17-4185-99ae-2af6087455bc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: df504fdd-84c9-4169-b693-4b419c438918
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: d6cc4b45-0c85-422b-8764-60614c825b05
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 7fa0f248-4485-46d9-8bce-92050c519446
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 91fed3ae-330d-4024-bb68-01f1febda0fd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 03b7679c-7415-4ba2-9b3f-895c5574fcf7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: 21d2aeaf-0895-4fc2-af30-b6fd96ed3c87
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: f9cbe7f7-d2eb-465f-af54-1504822b5ca6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
[getMatchPDA] Failed to derive PDA for matchId: b10ec206-a7ec-48f0-8a0a-1282efe7644e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stdout | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches
Created 1000 matches in 3147ms
Throughput: 317.76 matches/second
Errors encountered: 1000

stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 7bc8f736-b97c-4acb-8b64-2879114cd458
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: f11055dc-e3be-496f-a1ba-616c8b9401eb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 2b0fa00a-3812-4cbd-aacc-f4183dbea5a9
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 960431c4-8f98-4b7d-b32a-70a5314f3f6d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 3a37a34c-2714-456d-ae99-7d68894f289b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 073a4e0b-6d67-4234-9e69-06ef092006bb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 6d92b4fb-6708-4c35-9cda-206b28205805
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 56fb6e3e-ad3a-475d-996b-2aa143103eb8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: e2a7a1e6-2e89-47dd-ab85-0d65c3bebb59
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 7d499a52-79b2-4e63-b1f4-4878cd28d6fa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 36e70a3a-5f76-4080-8604-56205753fe73
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 3de99f9a-6aff-4368-b157-3c91ee1ff1bf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: a6bf329a-cec0-466c-92fc-fbd07b6f57c6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: a32b1c83-4138-431d-9837-149ea630e5f4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: e32dea9b-c6cb-4cae-a9a1-a6638ace71a8
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: d69e384b-6286-4571-8672-8cd610cbf042
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: fc5a0be3-6aea-4560-9654-b5d4f56cd899
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 48909723-4e8b-49fe-9e32-97eca085ce16
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: f935507c-ff10-46c8-8925-6b0b695855c4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 38fd0be5-61e1-4df5-80c0-f83f323fde1e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 180eebeb-52c8-4669-85a6-b7a7f608b342
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 1d3ded11-1cc9-436d-b419-eb5ea03f4a91
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: d9128b99-3e9d-4aa0-9192-5975b1107e13
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: fc5e74fe-e448-4a9b-9c05-3b8dad9adff4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 7b692b07-44ba-4e23-b389-37787c767e91
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 55ada82f-2bf8-4af2-a298-037079adaaf0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: c9a6b21f-789d-47e4-93a5-940800dd45c3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 80476eb4-c607-4bed-a6cb-926435f03e31
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: b8603fa0-4ade-49ca-ae89-8a3f43db7052
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: d682e13b-4207-4af0-9d61-ae7cd4091e2a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 65c38571-0825-4ec3-b4c7-2d1e0c315827
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: e26d09a4-ce81-4b8e-a645-6b6ddbd2d050
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: ab381930-aef6-4839-bbe7-1b50db12c424
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 80894400-7286-422e-a4a6-e68f92c8be1c
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 598915f7-c5c1-42be-8970-89c4f291152b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: f24a87d4-8cf9-4116-a36e-f199eb911cd6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 82548c67-20aa-4d6b-99dd-86440d5b00a0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 0e9c8a15-130c-4910-8bd7-c33cdebb1b60
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: cf745920-09b2-4673-8ec4-5bd5277eb6fd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 56b34821-7660-4c29-b213-873ee9c4e70e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: df474d98-d579-45b9-a215-bac3225e17d2
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: b488b8b5-0e6c-4cb0-be7a-ac1fdb433e95
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: d49e6c7f-d172-4284-b1e0-ee815b2c9a91
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 8dfa0401-e271-418e-b7fc-56b545f775fe
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 9b417deb-ea5e-470b-b682-aa717b50322b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: b120c516-95f7-4c0c-ab3b-e13ca3840bd4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 71034b14-a2c8-41d2-885f-ab34e20ccdb4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 09a87f97-f683-4041-8507-d6ec2b978648
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 5e39c6b9-93a8-4681-8c22-50885dadf4c3
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 4156328d-6d4f-4d73-9462-4d39e1727a13
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 04c4e525-0bd5-45b5-8600-8b67bea99f56
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: e4c2c718-de78-42da-b8dc-b70ecc546224
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 1cf88ac7-b139-4185-8acc-f4924ad6fbc7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 2f0a72c7-a3fe-4945-a1f4-cb163338ff6d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 6ca9cefd-320f-4b74-b249-47f5940954da
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: b15daf28-2a4b-414b-932b-4efb1f9ba961
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 77045abf-b163-4d59-9559-c082dc28594e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 977c8e50-8e61-4322-8881-8d606e66edb6
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: c72669bd-f673-4e89-ade2-1f10e97453fa
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: d65ff584-4f22-4e33-bf05-367115f31f48
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 487d5e02-89f8-4f7b-8473-8cf7c6e7dc74
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 83cf574f-4183-4dcb-b2a1-5e9f30da0699
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 3577f702-f715-49a7-b540-c85121170ed1
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 128e7aa5-6daf-48e9-a7e3-f49a3a75f66e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 6ff199ed-4dbc-487e-9334-6ff6300de115
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 4679d267-c840-49fd-8e75-746e306c81dd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 8b9086aa-6223-41e8-b8ac-b817a7b4c5c0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 29458155-8b72-4406-977b-0d30abe70072
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: ca78aade-f9c6-4217-b794-607c6f2555a7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: c9afd3a9-905e-4807-a5c2-9d49ba332ec7
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: cff9bb3a-b04d-4db7-ab3f-9c8b44574cce
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 1183a91b-8f34-4ab1-9e1a-729868b9a284
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 39131dbf-60b1-418f-9127-0a877e303c21
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 51870933-3c3c-4e67-88e7-b83f8236459e
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 8a193f67-c257-4b1d-94f4-9c367c25a7f4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 3dd84b02-3164-4ce3-a6c7-ae6e289147dd
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 06ceaf75-eeba-4448-9147-a2b5de59d7d4
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 59d52e77-c251-4d9b-8244-68fd63579d3a
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 2a324c4c-2b5b-4924-8b56-548d443cb03d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 65600555-7772-497a-964c-8d057b758560
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 2a346264-8e57-47e5-9dd7-c06317dcebea
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 2909c015-4a9e-4ea9-8e39-8430cfbd2ae5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: aeed554c-4d35-4daa-bd0e-84dd4cf4c742
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 7fe6e5f0-a3d9-4f1c-8e53-f2bbbe86f3d5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: b404c400-6868-4410-9176-ad6b57f04632
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 6a69f427-c55a-4b84-94e7-b58aec571de5
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: c504e185-6d28-4573-9e51-2e0c1982d4d0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 68477e03-e7b7-4adc-90ce-bd60e5340c1b
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: d985f25f-602d-46fc-87b6-29ffa1c2d0bf
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: a91568f4-a80e-4d16-bd74-c75b107bf071
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 2e15253d-c0a0-4eff-8d25-34f9e9d1534d
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 13c40bdc-a1ef-4df7-8dfa-945b2c5569dc
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 2c9ecc17-fd16-4749-93cc-f16e45f03981
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 85231283-4e7e-4151-bfbb-a5b7a4a44f25
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 042cf163-64be-4236-9fc9-c6dc78e1ede0
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: f789ae87-9720-4768-bd14-d9287dfe32ac
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 1244ef8d-f39c-4370-bfcf-b21c9fcba6fb
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 7cbf51ee-f344-40b9-a368-4b25125cf074
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 3faa00d3-d355-417b-bc9d-a53ee8a54381
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stderr | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
[getMatchPDA] Failed to derive PDA for matchId: 406a27bb-46cb-4e2a-b29d-be045cda7316
[getMatchPDA] Program ID: 7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696
[getMatchPDA] Seeds: ["m" (1 bytes), matchId[0:31] (31 bytes)]
stdout | src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput
Throughput: 326.80 matches/second

  src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should handle creating 1000 matches 3251ms
  src/services/__tests__/load/match-creation.test.ts > Match Creation Load Test > should measure match creation throughput 314ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > uploadMatchRecord > should throw error after max retries 3028ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > getMatchRecord > should retrieve a match record successfully 1ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > getMatchRecord > should return null for 404 responses 0ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > getMatchRecord > should retry on network errors 1015ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > getMatchRecord > should not retry on 404 or 4xx errors 1ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > generateSignedUrl > should generate a signed URL successfully 1ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > generateSignedUrl > should use custom expiration time 0ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > generateSignedUrl > should throw error on failed request 0ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > deleteMatchRecord > should delete a match record successfully 0ms
  src/services/storage/__tests__/R2Service.test.ts > R2Service > deleteMatchRecord > should throw error on failed deletion 0ms
  src/services/__tests__/load/merkle-batching.test.ts > Merkle Batching Load Tests > should benchmark batch creation cost 24258ms
  src/services/__tests__/load/merkle-batching.test.ts > Merkle Batching Load Tests > should handle concurrent move submissions 115ms
Failed Tests 5 
FAIL  src/services/__tests__/e2e/full-match-lifecycle.test.ts > Full Match Lifecycle E2E > should complete full match lifecycle: create  join  start  moves  end
Error: Account `matchAccount` not provided.
  node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:40:23
  validateAccounts node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:34:16
  ix node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/instruction.js:39:46
  txFn node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/transaction.js:16:20
  MethodsBuilder.rpc [as _rpcFn] node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/rpc.js:9:24
  MethodsBuilder.rpc node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/methods.js:269:21
  GameClient.createMatch src/services/solana/GameClient.ts:78:18
     76| 
     77|     try {
     78|       const tx = await program.methods
       |                  ^
     79|         .createMatch(matchId, gameType, new BN(seed))
     80|         .accounts({
  src/services/__tests__/e2e/full-match-lifecycle.test.ts:120:21
[1/5]
FAIL  src/services/__tests__/e2e/full-match-lifecycle.test.ts > Full Match Lifecycle E2E > should handle batch moves correctly
Error: Account `matchAccount` not provided.
  node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:40:23
  validateAccounts node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:34:16
  ix node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/instruction.js:39:46
  txFn node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/transaction.js:16:20
  MethodsBuilder.rpc [as _rpcFn] node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/rpc.js:9:24
  MethodsBuilder.rpc node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/methods.js:269:21
  GameClient.createMatch src/services/solana/GameClient.ts:78:18
     76| 
     77|     try {
     78|       const tx = await program.methods
       |                  ^
     79|         .createMatch(matchId, gameType, new BN(seed))
     80|         .accounts({
  src/services/__tests__/e2e/full-match-lifecycle.test.ts:204:21
[2/5]
FAIL  src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should create a match on devnet
Error: Account `matchAccount` not provided.
  node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:40:23
  validateAccounts node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:34:16
  ix node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/instruction.js:39:46
  txFn node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/transaction.js:16:20
  MethodsBuilder.rpc [as _rpcFn] node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/rpc.js:9:24
  MethodsBuilder.rpc node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/methods.js:269:21
  GameClient.createMatch src/services/solana/GameClient.ts:78:18
     76| 
     77|     try {
     78|       const tx = await program.methods
       |                  ^
     79|         .createMatch(matchId, gameType, new BN(seed))
     80|         .accounts({
  src/services/__tests__/e2e/solana-integration.test.ts:112:16
[3/5]
FAIL  src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should submit a move and verify nonce protection
Error: Account `matchAccount` not provided.
  node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:40:23
  validateAccounts node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:34:16
  ix node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/instruction.js:39:46
  txFn node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/transaction.js:16:20
  MethodsBuilder.rpc [as _rpcFn] node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/rpc.js:9:24
  MethodsBuilder.rpc node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/methods.js:269:21
  GameClient.createMatch src/services/solana/GameClient.ts:78:18
     76| 
     77|     try {
     78|       const tx = await program.methods
       |                  ^
     79|         .createMatch(matchId, gameType, new BN(seed))
     80|         .accounts({
  src/services/__tests__/e2e/solana-integration.test.ts:140:5
[4/5]
FAIL  src/services/__tests__/e2e/solana-integration.test.ts > Solana Integration E2E > should handle transaction confirmation and state polling
Error: Account `matchAccount` not provided.
  node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:40:23
  validateAccounts node_modules/@coral-xyz/anchor/dist/cjs/program/common.js:34:16
  ix node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/instruction.js:39:46
  txFn node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/transaction.js:16:20
  MethodsBuilder.rpc [as _rpcFn] node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/rpc.js:9:24
  MethodsBuilder.rpc node_modules/@coral-xyz/anchor/dist/cjs/program/namespace/methods.js:269:21
  GameClient.createMatch src/services/solana/GameClient.ts:78:18
     76| 
     77|     try {
     78|       const tx = await program.methods
       |                  ^
     79|         .createMatch(matchId, gameType, new BN(seed))
     80|         .accounts({
  src/services/__tests__/e2e/solana-integration.test.ts:219:5
[5/5]
Test Files  2 failed | 19 passed | 1 skipped (22)
      Tests  5 failed | 139 passed | 22 skipped (166)
   Start at  19:24:23
   Duration  26.68s (transform 8.34s, setup 1.34s, collect 13.26s, tests 45.35s, environment 29.83s, prepare 502ms)

JSON report written to E:/ocentra-games/test-results/test-results.json
```

</details>

## Notes

- Report generated automatically by \un-tests.ps1\
- Old reports are automatically cleaned up (only latest report is kept)
- Report location: \$reportPath\