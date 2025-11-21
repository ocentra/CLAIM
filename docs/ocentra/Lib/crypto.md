# Cryptography Library

**Purpose:** Cryptographic services for hashing and signing operations.

**Location:** `src/lib/crypto/`

---

## What It Provides

### 1. Hash Service

**Location:** `src/lib/crypto/HashService.ts`

```typescript
import { HashService } from '@lib/crypto'

// Hash bytes or string
const hash = await HashService.hash(data)
// Returns: SHA-256 hash as hex string

// Hash match record (canonical bytes)
const matchHash = await HashService.hashMatchRecord(canonicalBytes)
```

**Features:**
- SHA-256 hashing
- Supports `Uint8Array` or `string` input
- Returns hex-encoded hash string

**Use when:** Need to hash match records, verify data integrity, etc.

---

### 2. Signature Service

**Location:** `src/lib/crypto/SignatureService.ts`

```typescript
import { SignatureService } from '@lib/crypto'

// Sign data
const signature = await SignatureService.sign(data, privateKey)

// Verify signature
const isValid = await SignatureService.verify(data, signature, publicKey)
```

**Features:**
- Sign data with private key
- Verify signatures with public key
- Supports various signature algorithms

**Use when:** Need to sign match records, verify authenticity, etc.

---

### 3. Key Manager

**Location:** `src/lib/crypto/KeyManager.ts`

```typescript
import { KeyManager } from '@lib/crypto'

// Generate key pair
const keyPair = await KeyManager.generateKeyPair()

// Import/export keys
const exported = await KeyManager.exportKey(privateKey)
const imported = await KeyManager.importKey(exported)
```

**Features:**
- Generate cryptographic key pairs
- Import/export keys
- Key management utilities

**Use when:** Need to manage cryptographic keys for signing/verification.

---

## API Reference

| Service | Methods | Purpose |
|---------|---------|---------|
| `HashService` | `hash(data)` | Hash data (SHA-256) |
| | `hashMatchRecord(canonicalBytes)` | Hash match record |
| `SignatureService` | `sign(data, privateKey)` | Sign data |
| | `verify(data, signature, publicKey)` | Verify signature |
| `KeyManager` | `generateKeyPair()` | Generate key pair |
| | `exportKey(key)` | Export key |
| | `importKey(data)` | Import key |

---

## Common Patterns

### Pattern 1: Hash Match Record

```typescript
import { HashService } from '@lib/crypto'
import { CanonicalSerializer } from '@lib/match-recording'

// Serialize match to canonical JSON
const canonicalBytes = CanonicalSerializer.serialize(matchRecord)

// Hash the canonical representation
const hash = await HashService.hashMatchRecord(canonicalBytes)
```

### Pattern 2: Sign and Verify

```typescript
import { SignatureService, KeyManager } from '@lib/crypto'

// Generate key pair
const { privateKey, publicKey } = await KeyManager.generateKeyPair()

// Sign data
const signature = await SignatureService.sign(data, privateKey)

// Later: verify
const isValid = await SignatureService.verify(data, signature, publicKey)
```

---

## When to Use

✅ **Use Crypto when:**
- Need to hash match records
- Need to sign/verify data
- Need key management
- Need data integrity verification

❌ **Don't use Crypto when:**
- Simple checksums (use simpler hash)
- No security requirements
- Performance-critical (use faster algorithms)

---

## Related Docs

- [match-recording.md](./match-recording.md) - Match recording (uses HashService for hashing)
- [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture (may use crypto for signing)

---

**Last Updated:** 2025-01-20  
**Location:** `src/lib/crypto/`

