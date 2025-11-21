# Audit Logging Specification

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2025-01-20

---

## Overview

This document defines the audit logging strategy for money-match operations. Audit logs provide an immutable, append-only record of all financial transactions, governance actions, and compliance events for regulatory compliance and security monitoring.

---

## Design Principles

1. **Immutability:** Audit logs are append-only - once written, they cannot be modified or deleted
2. **Hash Chaining:** Each log entry includes a hash of the previous entry to detect tampering
3. **Correlation IDs:** All related events share a correlation ID for traceability
4. **Dual Storage:** Logs stored in both Firebase (primary) and Cloudflare (backup)
5. **Retention:** Logs retained per jurisdiction requirements (minimum 5 years)

---

## Firebase/Firestore Audit Logs

### Collection Structure

**Collection:** `auditLogs/{docId}`

**Document Schema:**
```typescript
interface AuditLogEntry {
  // Metadata
  docId: string;                    // Auto-generated document ID
  timestamp: number;                 // Unix timestamp (milliseconds)
  correlationId: string;             // UUID for correlating related events
  previousHash: string;              // SHA-256 hash of previous log entry
  
  // Event Information
  eventType: AuditEventType;         // Type of event (see Event Types)
  userId?: string;                   // Firebase UID (if user-related)
  matchId?: string;                   // Match ID (if match-related)
  transactionSignature?: string;     // Solana transaction signature
  
  // Action Details
  action: string;                    // Human-readable action description
  details: Record<string, any>;     // Event-specific details
  
  // Compliance Fields
  kycTier?: string;                  // User's KYC tier at time of event
  custodyType?: 'wallet' | 'platform'; // Payment method used
  amountLamports?: number;           // Amount in lamports (if financial)
  
  // Source Information
  source: 'on-chain' | 'off-chain' | 'worker' | 'firebase'; // Where event originated
  ipAddress?: string;                // Client IP (if available)
  userAgent?: string;                 // Client user agent (if available)
}
```

### Event Types

```typescript
enum AuditEventType {
  // Financial Events
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  ESCROW_CREATED = 'escrow_created',
  ESCROW_FUNDED = 'escrow_funded',
  ESCROW_DISTRIBUTED = 'escrow_distributed',
  ESCROW_REFUNDED = 'escrow_refunded',
  PLATFORM_FEE_COLLECTED = 'platform_fee_collected',
  
  // Match Events
  MATCH_CREATED = 'match_created',
  MATCH_JOINED = 'match_joined',
  MATCH_STARTED = 'match_started',
  MATCH_ENDED = 'match_ended',
  MATCH_CANCELLED = 'match_cancelled',
  
  // Governance Events
  PROGRAM_PAUSED = 'program_paused',
  PROGRAM_UNPAUSED = 'program_unpaused',
  CONFIG_UPDATED = 'config_updated',
  TREASURY_MULTISIG_ROTATED = 'treasury_multisig_rotated',
  
  // Compliance Events
  KYC_VERIFIED = 'kyc_verified',
  KYC_EXPIRED = 'kyc_expired',
  ACCOUNT_FROZEN = 'account_frozen',
  ACCOUNT_UNFROZEN = 'account_unfrozen',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  
  // Dispute Events
  DISPUTE_FLAGGED = 'dispute_flagged',
  DISPUTE_RESOLVED = 'dispute_resolved',
  DISPUTE_INVALID = 'dispute_invalid',
}
```

### Hash Chaining Implementation

Each audit log entry includes a hash of the previous entry:

```typescript
// Pseudo-code for hash chaining
function createAuditLogEntry(
  eventType: AuditEventType,
  details: Record<string, any>,
  previousEntry?: AuditLogEntry
): AuditLogEntry {
  const entry: AuditLogEntry = {
    timestamp: Date.now(),
    correlationId: generateUUID(),
    eventType,
    details,
    // ... other fields
  };
  
  // Calculate hash of previous entry
  if (previousEntry) {
    entry.previousHash = sha256(JSON.stringify(previousEntry));
  } else {
    entry.previousHash = '0'; // First entry
  }
  
  return entry;
}
```

**Tamper Detection:**
- If any log entry is modified, its hash will change
- Subsequent entries will have incorrect `previousHash` values
- Verification script can detect tampering by checking hash chain

### Cloud Functions Implementation

**Function:** `functions/src/audit-logger.ts` (to be implemented in Phase 06)

```typescript
// Pseudo-code structure
export async function writeAuditLog(
  eventType: AuditEventType,
  details: Record<string, any>,
  metadata?: {
    userId?: string;
    matchId?: string;
    transactionSignature?: string;
  }
): Promise<void> {
  // Get previous log entry for hash chaining
  const previousEntry = await getLastAuditLogEntry();
  
  // Create new log entry
  const entry = createAuditLogEntry(eventType, details, previousEntry);
  
  // Write to Firestore (append-only)
  await admin.firestore()
    .collection('auditLogs')
    .add(entry);
  
  // Also emit to Cloudflare Worker for backup
  await emitToCloudflare(entry);
}
```

---

## Cloudflare Worker Audit Logs

### Storage Strategy

**Primary:** Cloudflare R2 (object storage)  
**Backup:** Cloudflare Logpush (stream to external service)

### Log Format

**R2 Object Path:** `audit-logs/{year}/{month}/{day}/{correlationId}.json`

**Log Entry Format:**
```json
{
  "timestamp": 1704067200000,
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "previousHash": "abc123...",
  "eventType": "escrow_created",
  "transactionSignature": "5j7s8K9...",
  "matchId": "match-123",
  "details": {
    "entryFeeLamports": 1000000000,
    "playerCount": 4
  },
  "source": "on-chain"
}
```

### Structured Logging

**Cloudflare Worker Implementation:**
```typescript
// Pseudo-code structure
async function logAuditEvent(
  eventType: AuditEventType,
  details: Record<string, any>,
  transactionSignature?: string
): Promise<void> {
  const logEntry = {
    timestamp: Date.now(),
    correlationId: generateUUID(),
    eventType,
    transactionSignature,
    details,
    source: 'worker',
  };
  
  // Write to R2
  await env.AUDIT_LOGS_BUCKET.put(
    `audit-logs/${getDatePath()}/${logEntry.correlationId}.json`,
    JSON.stringify(logEntry)
  );
  
  // Also emit structured log for Logpush
  console.log(JSON.stringify({
    level: 'audit',
    ...logEntry,
  }));
}
```

### Logpush Configuration

**Destination:** External logging service (e.g., Datadog, Splunk, or custom endpoint)

**Format:** JSON lines (one log entry per line)

**Fields Included:**
- All audit log fields
- Worker request metadata (if available)
- Solana RPC response times (if applicable)

---

## Correlation IDs

### Generation

**Format:** UUID v4  
**Scope:** Per user action or transaction

**Example Flow:**
1. User creates paid match
2. Generate correlation ID: `550e8400-e29b-41d4-a716-446655440000`
3. Use same correlation ID for:
   - Match creation event
   - Escrow creation event
   - All player join events
   - Match start/end events
   - Prize distribution events

### Usage

**Querying Related Events:**
```typescript
// Get all events for a correlation ID
const events = await admin.firestore()
  .collection('auditLogs')
  .where('correlationId', '==', correlationId)
  .orderBy('timestamp', 'asc')
  .get();
```

---

## Compliance Requirements

### Data Retention

**Minimum Retention:** 5 years (per US/EU regulations)

**Retention by Event Type:**
- Financial events: 7 years
- Governance events: 10 years (permanent for multisig operations)
- Match events: 5 years
- Compliance events: 7 years

### Access Control

**Read Access:**
- Platform administrators: Full access
- Compliance officers: Read-only access
- Auditors: Read-only access (time-limited)

**Write Access:**
- Cloud Functions only (no direct Firestore writes)
- Cloudflare Worker only (no direct R2 writes)

### Privacy

**PII Handling:**
- User IDs stored (Firebase UIDs)
- IP addresses stored (anonymized after 90 days)
- Email addresses: NOT stored in audit logs
- KYC documents: NOT stored in audit logs (reference only)

---

## Implementation Phases

### Phase 01 (Current)
- ✅ Document audit logging spec
- ⏸️ Implementation blocked until Phase 06 (Backend & Firebase)

### Phase 06 (Backend & Firebase)
- Implement `functions/src/audit-logger.ts`
- Set up Firestore security rules
- Configure Cloud Functions triggers
- Implement hash chaining

### Phase 08 (Off-chain Mirror)
- Implement Cloudflare Worker audit logging
- Set up R2 bucket for audit logs
- Configure Logpush (if needed)

---

## Verification & Monitoring

### Hash Chain Verification

**Script:** `scripts/verify-audit-logs.ts` (to be implemented)

```typescript
// Pseudo-code
async function verifyAuditLogChain(): Promise<boolean> {
  const logs = await getAllAuditLogs();
  
  for (let i = 1; i < logs.length; i++) {
    const previousHash = sha256(JSON.stringify(logs[i - 1]));
    if (logs[i].previousHash !== previousHash) {
      console.error(`Hash mismatch at index ${i}`);
      return false;
    }
  }
  
  return true;
}
```

### Monitoring

**Alerts:**
- Hash chain verification failures
- Missing audit log entries (gap detection)
- Unusual event patterns (suspicious activity)

**Metrics:**
- Audit log write rate
- Storage usage (R2 bucket size)
- Verification success rate

---

## Related Documents

- `docs/compliance/kyc-custody.md` (KYC tier tracking)
- `docs/compliance/treasury.md` (Governance events)
- `docs/Multiplayer and Solana/phases/phase-06-backend-firebase.md` (Implementation phase)
- `docs/Multiplayer and Solana/phases/phase-08-offchain-mirror.md` (Cloudflare implementation)

