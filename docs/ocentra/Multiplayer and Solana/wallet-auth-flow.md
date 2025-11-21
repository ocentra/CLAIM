# Wallet Authentication Flow - Current Status

## 🎯 What Happens When User Clicks a Wallet

### **Current Flow (Step-by-Step):**

1. **User clicks wallet button** (Phantom/MetaMask/Coinbase)
   - `WalletSelector` → `handleWalletSelect()` is called

2. **Wallet Connection Phase:**
   - **Phantom (Solana):**
     - Opens Solana wallet modal (`setSolanaModalVisible(true)`)
     - Waits for wallet to connect (checks `wallet.connected` and `wallet.publicKey`)
     - Closes modal after connection
   
   - **MetaMask (Ethereum):**
     - Checks if MetaMask is installed (`window.ethereum`)
     - Requests account access (`eth_requestAccounts`)
     - Gets wallet address from first account
   
   - **Coinbase Wallet:**
     - ❌ **NOT IMPLEMENTED** - Shows "Coinbase Wallet integration coming soon"

3. **After Connection → Calls `onWalletSelected(wallet)`**
   - This triggers `LoginDialog.handleWalletSelected()`
   - Routes to either `handleSolanaWalletAuth()` or `handleEthereumWalletAuth()`

4. **Message Signing Phase:**
   - **Solana (Phantom):**
     - Generates SIWE-like challenge message:
       ```
       {domain} wants you to sign in with your Solana account:
       {walletPublicKey}
       
       URI: {origin}
       Version: 1
       Chain ID: solana:devnet
       Nonce: {random}
       Issued At: {timestamp}
       ```
     - Calls `wallet.signMessage(messageBytes)` → User approves in wallet popup
     - Gets signature as `Uint8Array`
   
   - **Ethereum (MetaMask):**
     - Generates SIWE (Sign-In with Ethereum) message:
       ```
       {domain} wants you to sign in with your Ethereum account:
       {walletAddress}
       
       Sign in to Ocentra AI
       
       URI: {origin}
       Version: 1
       Chain ID: {chainId}
       Nonce: {random}
       Issued At: {timestamp}
       ```
     - Calls `ethereum.request({ method: 'personal_sign', params: [message, address] })`
     - Gets signature as hex string → Converts to `Uint8Array`

5. **Authentication Phase:**
   - Calls `authLoginWithWallet(walletPublicKey, signature, messageBytes)`
   - **In Firebase Service (`loginWithWallet`):**
     - ⚠️ **Currently:** No signature verification (trusts client-side signature)
     - Checks Firestore for existing user with this wallet address
     - **If exists:** Updates Firebase UID, updates `lastLoginAt`
     - **If new:** Creates anonymous Firebase account + Firestore profile with:
       - `walletAddress`: Public wallet address
       - `displayName`: `Wallet-{first8chars}`
       - Default stats (gamesPlayed: 0, wins: 0, etc.)
     - Returns `AuthResult` with user profile

6. **Success:**
   - User is logged in
   - `setShowWalletSelector(false)` → Returns to main app
   - User profile includes `walletAddress` field

---

## ✅ What's Currently Implemented

- ✅ **Phantom (Solana)** - Full flow working
- ✅ **MetaMask (Ethereum)** - Full flow working
- ✅ **UI Components** - WalletSelector, LoginDialog integration
- ✅ **Firebase Integration** - Account creation/linking
- ✅ **Message Generation** - SIWE-like format for both chains
- ✅ **Signature Handling** - Both Solana and Ethereum formats

---

## ❌ What's Missing / TODO

### **1. Coinbase Wallet Support** (HIGH PRIORITY)
**Status:** Not implemented
**Location:** `src/ui/components/Auth/WalletSelector.tsx` line 157-159

**What needs to be done:**
```typescript
// In connectEthereumWallet():
else if (wallet.provider === 'coinbase') {
  // Coinbase Wallet uses window.ethereum (same as MetaMask)
  // But may need to check for window.coinbase or specific provider
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('Coinbase Wallet is not installed.');
  }
  
  const ethereum = (window as any).ethereum;
  
  // Check if Coinbase Wallet is the provider
  // Coinbase Wallet injects window.ethereum with isCoinbaseWallet flag
  if (!ethereum.isCoinbaseWallet && !ethereum.isCoinbaseBrowser) {
    throw new Error('Please use Coinbase Wallet browser extension or mobile app.');
  }
  
  // Request account access (same as MetaMask)
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found');
  }
}
```

**Also need to handle Coinbase in `handleEthereumWalletAuth()`:**
```typescript
// In LoginDialog.tsx handleEthereumWalletAuth():
if (walletOption.provider === 'metamask' || walletOption.provider === 'coinbase') {
  // Same flow for both MetaMask and Coinbase Wallet
  // They both use window.ethereum
}
```

### **2. Server-Side Signature Verification** (PRODUCTION REQUIREMENT)
**Status:** Currently trusting client-side signatures ⚠️
**Location:** `src/services/firebaseService.ts` line 486-488

**Current Code:**
```typescript
// Verify signature (client-side verification - in production, this should be server-side)
// For now, we'll trust the signature and create/link the account
// In production, use a Firebase Cloud Function to verify signatures server-side
```

**What needs to be done:**

**A. Create Firebase Cloud Function:**
```typescript
// functions/src/verifyWalletSignature.ts
import * as functions from 'firebase-functions';
import { PublicKey } from '@solana/web3.js';
import { verifyMessage } from 'ethers'; // For Ethereum

export const verifyWalletSignature = functions.https.onCall(async (data, context) => {
  const { walletAddress, signature, message, chain } = data;
  
  if (chain === 'solana') {
    // Verify Solana signature
    const publicKey = new PublicKey(walletAddress);
    const messageBytes = new TextEncoder().encode(message);
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signature,
      publicKey.toBytes()
    );
    return { valid: isValid };
  } else if (chain === 'ethereum') {
    // Verify Ethereum signature using ethers.js
    const recoveredAddress = verifyMessage(message, signature);
    return { valid: recoveredAddress.toLowerCase() === walletAddress.toLowerCase() };
  }
  
  return { valid: false, error: 'Unsupported chain' };
});
```

**B. Update `loginWithWallet` to call Cloud Function:**
```typescript
// In firebaseService.ts
import { getFunctions, httpsCallable } from 'firebase/functions';

export const loginWithWallet = async (
  walletPublicKey: string,
  signature: Uint8Array,
  message: Uint8Array,
  chain: 'solana' | 'ethereum' // Add chain parameter
): Promise<AuthResult> => {
  // ... existing code ...
  
  try {
    // Verify signature server-side
    const functions = getFunctions();
    const verifySignature = httpsCallable(functions, 'verifyWalletSignature');
    const verificationResult = await verifySignature({
      walletAddress: walletPublicKey,
      signature: Array.from(signature), // Convert Uint8Array to array
      message: new TextDecoder().decode(message),
      chain: chain
    });
    
    if (!verificationResult.data.valid) {
      return { success: false, error: 'Invalid signature. Please try again.' };
    }
    
    // Continue with account creation/linking...
    // ... rest of existing code ...
  }
}
```

### **3. Nonce Storage & Replay Attack Prevention** (SECURITY)
**Status:** Nonce generated but not stored/verified
**Location:** `LoginDialog.tsx` lines 291, 348

**Current:** Nonce is random but not stored, so replay attacks are possible.

**What needs to be done:**
- Store nonces in Firestore with expiration (5 minutes)
- Check nonce hasn't been used before
- Delete nonce after successful authentication

```typescript
// In firebaseService.ts
const nonceRef = doc(db!, 'nonces', nonce);
const nonceDoc = await getDoc(nonceRef);

if (nonceDoc.exists()) {
  return { success: false, error: 'This signature has already been used.' };
}

// Store nonce with expiration
await setDoc(nonceRef, {
  walletAddress: walletPublicKey,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
});

// After successful auth, delete nonce
await deleteDoc(nonceRef);
```

### **4. Error Handling Improvements**
**Status:** Basic error handling exists
**What could be improved:**
- Better error messages for different failure scenarios
- Retry logic for network failures
- User-friendly messages for wallet connection issues

### **5. Testing**
**Status:** Not tested end-to-end
**What needs to be done:**
- Test Phantom connection flow
- Test MetaMask connection flow
- Test Coinbase Wallet (once implemented)
- Test signature verification
- Test account creation vs. existing account linking
- Test error scenarios (user cancels, wallet not installed, etc.)

---

## 🔐 Security Considerations

### **Current Security Posture:**
- ⚠️ **Client-side signature verification** - Vulnerable to manipulation
- ⚠️ **No nonce replay protection** - Signatures can be reused
- ✅ **No private key storage** - Compliant with GDPR/CCPA
- ✅ **Public address only** - Only stores public wallet address

### **Production Requirements:**
1. ✅ Server-side signature verification (Cloud Function)
2. ✅ Nonce storage and expiration
3. ✅ Rate limiting on authentication attempts
4. ✅ Audit logging of authentication events
5. ✅ Session management (token refresh, expiration)

---

## 📋 Implementation Priority

1. **HIGH:** Coinbase Wallet support (user-facing feature)
2. **HIGH:** Server-side signature verification (security)
3. **MEDIUM:** Nonce replay protection (security)
4. **MEDIUM:** Error handling improvements (UX)
5. **LOW:** Testing suite (quality assurance)

---

## 🎨 User Experience Flow

```
User clicks "Wallet" button
  ↓
WalletSelector shows 3 options (Phantom, MetaMask, Coinbase)
  ↓
User clicks wallet (e.g., Phantom)
  ↓
Wallet popup opens → User approves connection
  ↓
Challenge message appears → User signs message
  ↓
"Signing in..." loading state
  ↓
Success → User logged in → Redirected to main app
```

---

## 📝 Notes

- **Solana wallets** use `@solana/wallet-adapter-react` for connection
- **Ethereum wallets** use `window.ethereum` (EIP-1193 standard)
- **Both chains** use similar SIWE-like message format for consistency
- **Firebase** stores wallet address in `UserProfile.walletAddress` field
- **Future:** Wallet address can be used for deposits/transactions (separate from auth)

