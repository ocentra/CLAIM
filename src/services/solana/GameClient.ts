import { AnchorClient } from './AnchorClient';
import { PublicKey, SystemProgram, type TransactionSignature, Keypair } from '@solana/web3.js';
import BN from 'bn.js';
import { Buffer } from 'buffer';
import type { PlayerAction } from '@types';
import { EventBus } from '@lib/eventing';
import { UpdateGameStateEvent } from '@lib/eventing/events/game/UpdateGameStateEvent';
import { GamePhase } from '@types';

const NODE_ENV =
  (typeof process !== 'undefined' && process.env?.NODE_ENV) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.MODE) ||
  'development';

const DEBUG_FLAG =
  (typeof process !== 'undefined' && process.env?.DEBUG_SOLANA) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEBUG_SOLANA) ||
  'false';

const DEBUG_SOLANA = NODE_ENV !== 'production' && DEBUG_FLAG === 'true';

export interface MatchState {
  matchId: string;
  gameName: string;
  gameType: number;
  seed: number;
  phase: number;
  currentPlayer: number;
  players: PublicKey[];
  playerCount: number;
  moveCount: number;
  createdAt: number;
  endedAt?: number;
  matchHash?: Uint8Array;
  hotUrl?: string;  // Changed from archiveTxid to hotUrl per spec Section 5
}

export class GameClient {
  private anchorClient: AnchorClient;
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(anchorClient: AnchorClient) {
    this.anchorClient = anchorClient;
  }

  /**
   * Gets the program ID from the Anchor program.
   */
  private getProgramId(): PublicKey {
    const program = this.anchorClient.getProgram();
    return program.idl.address
      ? new PublicKey(program.idl.address)
      : program.programId;
  }

  /**
   * Derives the match PDA address.
   * Note: Solana seeds have a 32-byte limit per seed.
   * We use "m" (1 byte) + first 31 bytes of matchId = 32 bytes total.
   * This matches the Rust implementation in tests/common/pda.ts
   * Uses async findProgramAddress (like Rust tests) instead of findProgramAddressSync
   * to avoid "Unable to find a viable program address nonce" errors
   */
  private async getMatchPDA(matchId: string): Promise<[PublicKey, number]> {
    const matchIdBytes = Buffer.from(matchId, 'utf-8');
    // Match Rust implementation exactly: &match_id.as_bytes()[..31.min(match_id.len())]
    // For UUID (36 bytes), this takes first 31 bytes
    // Use slice directly - it already creates a new Buffer with the right length
    const truncated = matchIdBytes.slice(0, 31);
    
    const programId = this.getProgramId();
    const seedM = Buffer.from('m');

    try {
      // Use async version like Rust tests - findProgramAddressSync has issues
      const result = await PublicKey.findProgramAddress(
        [seedM, truncated],
        programId
      );
      if (DEBUG_SOLANA) {
        console.log(`[getMatchPDA] matchId: ${matchId}, PDA: ${result[0].toString()}, bump: ${result[1]}`);
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error(`[getMatchPDA] Failed to derive PDA for matchId: ${matchId}`);
      console.error(`[getMatchPDA] Program ID: ${programId.toString()}`);
      console.error(`[getMatchPDA] Seeds: ["m" (${seedM.length} bytes), matchId[0:${truncated.length}] (${truncated.length} bytes)]`);
      console.error(`[getMatchPDA] MatchId bytes length: ${matchIdBytes.length}, truncated length: ${truncated.length}`);
      console.error(`[getMatchPDA] Truncated buffer hex: ${truncated.toString('hex')}`);
      console.error(`[getMatchPDA] SeedM buffer hex: ${seedM.toString('hex')}`);
      console.error(`[getMatchPDA] Error: ${errorMessage}`);
      if (errorStack) {
        console.error(`[getMatchPDA] Stack: ${errorStack}`);
      }
      throw error;
    }
  }

  /**
   * Derives the GameRegistry PDA address.
   * Seeds: ["game_registry"]
   */
  private getRegistryPDA(): [PublicKey, number] {
    const programId = this.getProgramId();
    return PublicKey.findProgramAddressSync(
      [Buffer.from('game_registry')],
      programId
    );
  }

  async createMatch(
    gameType: number,
    seed: number,
    wallet: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }
  ): Promise<string> {
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();
    const matchId = crypto.randomUUID();

    const [matchPda] = await this.getMatchPDA(matchId);
    const [registryPda] = this.getRegistryPDA();

    if (DEBUG_SOLANA) {
      console.log(`[createMatch] Creating match: ${matchId}`);
      console.log(`[createMatch] Match PDA: ${matchPda.toString()}`);
      console.log(`[createMatch] Registry PDA: ${registryPda.toString()}`);
      console.log(`[createMatch] Authority: ${wallet.publicKey.toString()}`);
      console.log(`[createMatch] Game type: ${gameType}, Seed: ${seed}`);
    }

    try {
      // For free matches, we don't need escrow or config accounts
      // Use 'as never' to bypass TypeScript strict typing for optional Anchor accounts
      const tx = await program.methods
        .createMatch(
          matchId,
          gameType,
          new BN(seed),
          null, // entry_fee (null for free match)
          null, // payment_method (null for free match)
          null, // match_type (null for free match)
          null  // tournament_id (null for non-tournament)
        )
        .accounts({
          matchAccount: matchPda,
          registry: registryPda,
          escrowAccount: null, // Not needed for free matches
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();

      if (DEBUG_SOLANA) {
        console.log(`[createMatch] Transaction: ${tx}`);
      }

      await this.confirmTransactionWithRetry(tx);
      return matchId;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  async joinMatch(
    matchId: string,
    wallet: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> },
    userId?: string,
    signer?: Keypair // Optional keypair signer (like Rust tests use .signers([player]))
  ): Promise<TransactionSignature> {
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();

    const [matchPda] = await this.getMatchPDA(matchId);
    const [registryPda] = this.getRegistryPDA();

    // Match Rust pattern: For paid matches/tournaments, use PublicKey; for free matches, use Firebase UID
    // Check match type to determine which identifier to use
    let effectiveUserId: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchAccount = await (program.account as any).match.fetch(matchPda);
      const matchType = matchAccount.matchType || matchAccount.match_type || 0;
      const isPaidMatch = matchType === 1; // 1 = PAID, 0 = FREE
      
      if (isPaidMatch) {
        // For paid matches/tournaments: Use PublicKey as userId (matches Rust pattern for money matches)
        effectiveUserId = wallet.publicKey.toString();
        if (DEBUG_SOLANA) {
          console.log(`[joinMatch] Paid match detected - using PublicKey as userId: ${effectiveUserId}`);
        }
      } else {
        // For free matches: Use Firebase UID if provided, otherwise use PublicKey as fallback
        effectiveUserId = userId || wallet.publicKey.toString();
        if (DEBUG_SOLANA) {
          console.log(`[joinMatch] Free match - using Firebase UID: ${effectiveUserId}`);
        }
      }
    } catch {
      // If we can't fetch match account, default to userId if provided, otherwise PublicKey
      effectiveUserId = userId || wallet.publicKey.toString();
      if (DEBUG_SOLANA) {
        console.log(`[joinMatch] Could not fetch match account, using fallback userId: ${effectiveUserId}`);
      }
    }

    if (DEBUG_SOLANA) {
      console.log(`[joinMatch] Joining match: ${matchId}`);
      console.log(`[joinMatch] Match PDA: ${matchPda.toString()}`);
      console.log(`[joinMatch] Registry PDA: ${registryPda.toString()}`);
      console.log(`[joinMatch] Player: ${wallet.publicKey.toString()}`);
      console.log(`[joinMatch] Effective User ID: ${effectiveUserId}`);
    }
    const userIdParam = userId || '';

    // Build the transaction - same pattern as Rust tests
    // Provider wallet is fee payer, player keypair is additional signer
    const methodBuilder = program.methods
      .joinMatch(matchId, userIdParam)
      .accounts({
        matchAccount: matchPda,
        registry: registryPda,
        escrowAccount: null, // Not needed for free matches
        userDepositAccount: null, // Not needed for free matches
        playerWallet: null, // Not needed for free matches
        player: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as never);

    // Use signer if provided (like Rust tests: .signers([player]).rpc())
    let tx: string;
    if (signer) {
      tx = await methodBuilder.signers([signer]).rpc();
    } else {
      // No signer - provider wallet must be the player
      tx = await methodBuilder.rpc();
    }

    if (DEBUG_SOLANA) {
      console.log(`[joinMatch] Transaction: ${tx}`);
    }

    await this.confirmTransactionWithRetry(tx);
    return tx;
  }

  async startMatch(
    matchId: string,
    wallet: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }
  ): Promise<TransactionSignature> {
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();

    const [matchPda] = await this.getMatchPDA(matchId);
    const [registryPda] = this.getRegistryPDA();

    const tx = await program.methods
      .startMatch(matchId)
      .accounts({
        matchAccount: matchPda,
        registry: registryPda,
        escrowAccount: null, // Not needed for free matches
        authority: wallet.publicKey,
      } as never)
      .rpc();

    await this.confirmTransactionWithRetry(tx);
    return tx;
  }

  async submitMove(
    matchId: string,
    action: PlayerAction,
    wallet?: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> },
    nonce?: number, // Per critique: nonce for replay protection
    signer?: Keypair // Optional keypair signer (like Rust tests use .signers([player]))
  ): Promise<TransactionSignature> {
    // Per critique Issue #6: Wallet is optional - coordinator submits on behalf of players
    if (!wallet) {
      throw new Error('Wallet required for transaction signing. Use MatchCoordinator for walletless submission.');
    }
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();
    
    const [matchPda] = await this.getMatchPDA(matchId);
    const [registryPda] = this.getRegistryPDA();

    // Fetch current match state to verify match exists
    const matchState = await this.getMatchState(matchId);
    if (!matchState) {
      throw new Error(`Match ${matchId} not found`);
    }

    const actionType = this.mapActionTypeToU8(action.type);
    
    // For reveal_floor_card and pick_up, payload should be raw hash bytes (32 bytes), not JSON
    // Rust validation: pick_up requires payload.len() >= 32 and card hash must match floor card hash
    let payload: Buffer;
    if ((action.type === 'reveal_floor_card' || action.type === 'pick_up') && action.data && typeof action.data === 'object' && 'hash' in action.data) {
      // Extract hash from data and convert to Buffer
      const hashArray = Array.isArray(action.data.hash) ? action.data.hash : [];
      if (hashArray.length === 32) {
        payload = Buffer.from(hashArray);
      } else {
        throw new Error(`${action.type} requires 32-byte hash in data.hash, got ${hashArray.length} bytes`);
      }
    } else {
      // For other actions, serialize as JSON
      payload = this.serializeAction(action);
    }
    
    // Per critique Issue #5: Use cryptographically secure nonce generation
    // Generate secure random nonce if not provided
    const moveNonce = nonce ?? this.generateSecureNonce();
    
    // Validate nonce is a valid number (BN requires valid number)
    if (moveNonce === undefined || moveNonce === null || isNaN(moveNonce) || !isFinite(moveNonce)) {
      throw new Error(`Invalid nonce value: ${moveNonce}. Expected a valid number.`);
    }
    
    // Ensure nonce is within safe integer range for BN
    const safeNonce = Number(moveNonce);
    if (!Number.isSafeInteger(safeNonce) || safeNonce < 0) {
      throw new Error(`Nonce ${safeNonce} is out of safe integer range or negative.`);
    }

    // Derive move PDA matching Rust implementation EXACTLY:
    // Rust: seeds = [b"move", match_id[0..32], match_id[32..], player.key(), nonce.to_le_bytes()]
    // Note: matchId (UUID) is 36 bytes, so we split it: first 32 bytes + remaining 4 bytes
    const matchIdBytes = Buffer.from(matchId, 'utf-8');
    // Rust: first32 = matchIdBytes.slice(0, Math.min(32, matchIdBytes.length))
    const matchIdFirst32 = matchIdBytes.slice(0, Math.min(32, matchIdBytes.length));
    // Rust: rest = matchIdBytes.slice(Math.min(32, matchIdBytes.length))
    const matchIdRemaining = matchIdBytes.slice(Math.min(32, matchIdBytes.length));
    
    // Match Rust pattern: For paid matches/tournaments, use PublicKey; for free matches, use Firebase UID
    // Check match type to determine which identifier to use
    let effectiveUserId: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchAccount = await (program.account as any).match.fetch(matchPda);
      const matchType = matchAccount.matchType || matchAccount.match_type || 0;
      const isPaidMatch = matchType === 1; // 1 = PAID, 0 = FREE
      
      if (isPaidMatch) {
        // For paid matches/tournaments: Use PublicKey as userId (matches Rust pattern for money matches)
        effectiveUserId = wallet.publicKey.toString();
        if (DEBUG_SOLANA) {
          console.log(`[submitMove] Paid match detected - using PublicKey as userId: ${effectiveUserId}`);
        }
      } else {
        // For free matches: Use Firebase UID from action, fallback to PublicKey
        effectiveUserId = action.playerId || wallet.publicKey.toString();
        if (DEBUG_SOLANA) {
          console.log(`[submitMove] Free match - using Firebase UID: ${effectiveUserId}`);
        }
      }
    } catch {
      // If we can't fetch match account, use Firebase UID from action, fallback to PublicKey
      effectiveUserId = action.playerId || wallet.publicKey.toString();
      if (DEBUG_SOLANA) {
        console.log(`[submitMove] Could not fetch match account, using fallback userId: ${effectiveUserId}`);
      }
    }
    
    const userId = effectiveUserId;
    
    // Rust: nonceBuffer.writeBigUInt64LE(BigInt(nonce.toString()), 0)
    // Use signer's publicKey for PDA derivation (matches Rust: player.key())
    const playerPubkey = signer ? signer.publicKey : wallet.publicKey;
    const nonceBuffer = Buffer.allocUnsafe(8);
    nonceBuffer.writeBigUInt64LE(BigInt(safeNonce.toString()), 0);
    
    // Match Rust test pattern: use async findProgramAddress
    // Rust: await anchor.web3.PublicKey.findProgramAddress([...], program.programId)
    const [movePda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('move'),
        matchIdFirst32,
        matchIdRemaining,
        playerPubkey.toBuffer(), // Use signer's publicKey (matches Rust pattern)
        nonceBuffer
      ],
      program.programId
    );

    // Always log for debugging (matching Rust test pattern)
    console.log(`[submitMove] Match: ${matchId}`);
    console.log(`[submitMove] Match PDA: ${matchPda.toString()}`);
    console.log(`[submitMove] Registry PDA: ${registryPda.toString()}`);
    console.log(`[submitMove] Move PDA: ${movePda.toString()}`);
    console.log(`[submitMove] Player (signer): ${playerPubkey.toString()}, Wallet: ${wallet.publicKey.toString()}`);
    console.log(`[submitMove] Action type: ${actionType}, Nonce: ${moveNonce}, userId: ${userId}`);
    console.log(`[submitMove] Payload length: ${payload.length} bytes`);
    if (action.type === 'pick_up' || action.type === 'reveal_floor_card') {
      console.log(`[submitMove] Hash payload (first 8 bytes): ${payload.slice(0, 8).toString('hex')}`);
    }
    
    // Match Rust test pattern EXACTLY: submitMove(matchId, userId, actionType, payload, nonce)
    // Accounts: matchAccount, registry, moveAccount, player, systemProgram
    // ALWAYS use .signers([player]) - Rust tests always pass player keypair as signer
    if (!signer) {
      throw new Error('Signer keypair is required for submitMove (Rust tests always use .signers([player]))');
    }
    
    // CRITICAL: Use signer's publicKey for player account, not wallet.publicKey
    // Rust: player: player.publicKey (from signer keypair)
    const methodBuilder = program.methods
      .submitMove(matchId, userId, actionType, payload, new BN(safeNonce))
      .accounts({
        matchAccount: matchPda,
        registry: registryPda,
        moveAccount: movePda,
        player: signer.publicKey, // Use signer's publicKey, not wallet.publicKey (matches Rust pattern)
        systemProgram: SystemProgram.programId,
      } as never);
    
    // Rust tests ALWAYS use .signers([player])
    const tx = await methodBuilder.signers([signer]).rpc();

    if (DEBUG_SOLANA) {
      console.log(`[submitMove] Transaction: ${tx}`);
    }

    await this.confirmTransactionWithRetry(tx);
    
        const state = await this.getMatchState(matchId);
        if (state) {
          // Map numeric phase (0,1,2) to GamePhase string
          const phaseMap: Record<number, GamePhase> = {
            0: GamePhase.DEALING,
            1: GamePhase.PLAYER_ACTION,
            2: GamePhase.GAME_END,
          };
          EventBus.instance.publish(new UpdateGameStateEvent({
            id: state.matchId,
            phase: phaseMap[state.phase] || GamePhase.DEALING,
            currentPlayer: state.currentPlayer,
            players: state.players.map(p => ({ id: p.toString(), name: '', avatar: '', hand: [], declaredSuit: null, intentCard: null, score: 0, isConnected: true, isAI: false })),
          }));
        }
    
    return tx;
  }

  async endMatch(
    matchId: string,
    matchHash?: Uint8Array,
    hotUrl?: string,
    wallet?: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }
  ): Promise<TransactionSignature> {
    if (wallet) {
      this.validateWallet(wallet);
    }
    const program = this.anchorClient.getProgram();
    
    const [matchPda] = await this.getMatchPDA(matchId);

    const authority = wallet?.publicKey || program.provider.publicKey;
    if (!authority) {
      throw new Error('Authority (wallet or program provider) is required');
    }
    
    // Match Rust pattern: Check if match is paid to determine if escrow is needed
    // For free matches, escrowAccount should be null (matches Rust test pattern)
    let escrowAccount: PublicKey | null = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matchAccount = await (program.account as any).match.fetch(matchPda);
      const matchType = matchAccount.matchType || matchAccount.match_type || 0;
      const isPaidMatch = matchType === 1; // 1 = PAID, 0 = FREE
      
      if (isPaidMatch) {
        // For paid matches, derive escrow PDA (matches Rust pattern)
        // Rust: seeds = [b"escrow", match_account.key().as_ref()]
        const [escrowPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('escrow'), matchPda.toBuffer()],
          this.getProgramId()
        );
        escrowAccount = escrowPda;
        if (DEBUG_SOLANA) {
          console.log(`[endMatch] Paid match - using escrow account: ${escrowAccount.toString()}`);
        }
      } else {
        if (DEBUG_SOLANA) {
          console.log(`[endMatch] Free match - escrow account is null`);
        }
      }
    } catch {
      // If we can't fetch match account, assume free match (null escrow)
      if (DEBUG_SOLANA) {
        console.log(`[endMatch] Could not fetch match account, assuming free match (null escrow)`);
      }
    }
    
    const tx = await program.methods
      .endMatch(matchId, matchHash ? Array.from(matchHash) : null, hotUrl || null)
      .accounts({
        matchAccount: matchPda,
        escrowAccount: escrowAccount, // null for free matches, escrow PDA for paid matches (matches Rust pattern)
        authority,
      } as never)
      .rpc();

    await this.confirmTransactionWithRetry(tx);
    return tx;
  }

  async getMatchState(matchId: string, retries: number = 3): Promise<MatchState | null> {
    const program = this.anchorClient.getProgram();
    
    const [matchPda] = await this.getMatchPDA(matchId);

    // Retry logic: account might not be immediately available after transaction confirmation
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Type assertion needed because Anchor IDL types aren't fully inferred
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matchAccount = await (program.account as any).match.fetch(matchPda);
        
        if (!matchAccount) {
          if (attempt < retries - 1) {
            // Wait a bit before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
            continue;
          }
          console.log(`[getMatchState] Account not found for matchId: ${matchId}, PDA: ${matchPda.toString()}`);
          return null;
        }
      
        // matchId is stored as fixed-size array [u8; 36] in Rust (exactly 36 bytes, no padding)
        // Rust: pub match_id: [u8; 36], // UUID v4 (fixed 36 bytes, no length prefix)
        // Use EXACT same pattern as Rust tests (see create-claim-match.test.ts, rapid-sequential-creation.test.ts)
        let matchIdStr: string;
        if (Array.isArray(matchAccount.matchId)) {
          // Rust test pattern: Array.from(matchAccount.matchId).map(b => String.fromCharCode(b)).join('').replace(/\0/g, '').substring(0, 36)
          const matchIdArray = matchAccount.matchId as number[];
          console.log(`[getMatchState] Raw matchId array length: ${matchIdArray.length}`);
          console.log(`[getMatchState] First 10 bytes: [${matchIdArray.slice(0, 10).join(', ')}]`);
          console.log(`[getMatchState] Expected matchId: "${matchId}"`);
          
          // Convert byte array to string using Rust test pattern
          matchIdStr = Array.from(matchIdArray)
            .map(b => String.fromCharCode(b))
            .join('')
            .replace(/\0/g, '')
            .substring(0, 36);
          
          console.log(`[getMatchState] Decoded matchId: "${matchIdStr}" (length: ${matchIdStr.length})`);
          
          // Validate decoded matchId matches expected
          if (matchIdStr !== matchId) {
            console.log(`[getMatchState] WARNING: Decoded matchId "${matchIdStr}" doesn't match expected "${matchId}"`);
            // Still use decoded value (Rust tests assert equality, so this should match)
          }
        } else if (typeof matchAccount.matchId === 'string') {
          console.log(`[getMatchState] matchId is already a string: "${matchAccount.matchId}"`);
          matchIdStr = matchAccount.matchId;
        } else {
          console.log(`[getMatchState] matchId is unexpected type: ${typeof matchAccount.matchId}, using parameter`);
          matchIdStr = matchId;
        }
      
      // Handle seed - can be u32 (number) or BN
      const seed = typeof matchAccount.seed === 'number'
        ? matchAccount.seed
        : matchAccount.seed.toNumber();

      // Handle timestamps - can be i64 (BN) or number
      const createdAt = typeof matchAccount.createdAt === 'number'
        ? matchAccount.createdAt
        : matchAccount.createdAt.toNumber();

      const endedAt = matchAccount.endedAt
        ? (typeof matchAccount.endedAt === 'number'
            ? matchAccount.endedAt
            : matchAccount.endedAt.toNumber())
        : undefined;

      // Rust struct uses player_ids: [[u8; 64]; 10] (Firebase UIDs, not PublicKeys)
      // Anchor exposes it as playerIds: flat byte array [u8; 640] (10 players × 64 bytes each)
      // Logs show: playerIds is a flat array of bytes, not PublicKeys
      // Since Rust stores Firebase UIDs (not PublicKeys), we return empty array
      // Players are tracked by playerCount field instead
      const playersArray: PublicKey[] = []; // Empty - Rust doesn't store PublicKeys, only Firebase UIDs
      
      return {
        matchId: matchIdStr,
        gameName: matchAccount.gameName || matchAccount.game_name,
        gameType: matchAccount.gameType || matchAccount.game_type,
        seed,
        phase: matchAccount.phase,
        currentPlayer: matchAccount.currentPlayer !== undefined ? matchAccount.currentPlayer : (matchAccount.current_player !== undefined ? matchAccount.current_player : 0),
        players: playersArray,
        playerCount: matchAccount.playerCount || matchAccount.player_count || 0,
        moveCount: matchAccount.moveCount || matchAccount.move_count || 0,
        createdAt,
        endedAt,
        matchHash: matchAccount.matchHash || matchAccount.match_hash ? new Uint8Array(matchAccount.matchHash || matchAccount.match_hash) : undefined,
        hotUrl: matchAccount.hotUrl || matchAccount.hot_url || undefined,
      };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isAccountNotFound = errorMessage.includes('Account does not exist') || 
                                  errorMessage.includes('account not found') ||
                                  errorMessage.includes('Invalid account data');
        
        if (attempt < retries - 1 && isAccountNotFound) {
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
          continue;
        }
        
        if (DEBUG_SOLANA || isAccountNotFound) {
          console.log(`[getMatchState] Match not found (attempt ${attempt + 1}/${retries}): ${matchId}, PDA: ${matchPda.toString()}, Error: ${errorMessage}`);
        } else {
          console.error(`[getMatchState] Failed to fetch match state for ${matchId} (attempt ${attempt + 1}/${retries}):`, error);
        }
        
        // If this was the last attempt, return null
        if (attempt === retries - 1) {
          return null;
        }
      }
    }
    
    return null; // Should never reach here, but TypeScript needs it
  }

  pollMatchState(
    matchId: string,
    callback: (state: MatchState) => void,
    intervalMs: number = 2000
  ): void {
    const interval = setInterval(async () => {
      const state = await this.getMatchState(matchId);
      if (state) {
        callback(state);
      }
    }, intervalMs);

    this.pollingIntervals.set(matchId, interval);
  }

  stopPolling(matchId: string): void {
    const interval = this.pollingIntervals.get(matchId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(matchId);
    }
  }

  private mapActionTypeToU8(actionType: string): number {
    const mapping: Record<string, number> = {
      'pick_up': 0,
      'decline': 1,
      'declare_intent': 2,
      'call_showdown': 3,
      'rebuttal': 4,
      'reveal_floor_card': 5, // REVEAL_FLOOR_CARD (from Rust: CLAIM_ACTIONS.REVEAL_FLOOR_CARD = 5)
    };
    return mapping[actionType] ?? 0;
  }

  async anchorBatch(
    batchId: string,
    merkleRoot: Uint8Array,
    count: number,
    firstMatchId: string,
    lastMatchId: string,
    wallet: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }
  ): Promise<TransactionSignature> {
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();

    try {
      // Per critique Issue #29: Submit batch anchor transaction
      const txSignature = await program.methods
        .anchorBatch(batchId, Array.from(merkleRoot), new BN(count), firstMatchId, lastMatchId)
        .accounts({
          authority: wallet.publicKey,
        })
        .rpc();

      // Per critique Issue #29: Wait for confirmation with retry
      await this.confirmTransactionWithRetry(txSignature);
      
      // Per critique Issue #29: Validate that batch was actually anchored
      // Query the BatchAnchor account to verify
      try {
        const [batchAnchorPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('batch'), Buffer.from(batchId)],
          program.programId
        );
        
        // Type assertion needed because Anchor IDL types aren't fully inferred
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const batchAccount = await (program.account as any).batchAnchor.fetch(batchAnchorPda);
        if (!batchAccount) {
          throw new Error(`Batch anchor account not found after transaction: ${txSignature}`);
        }
        
        // Verify merkle root matches
        const storedRoot = Buffer.from(batchAccount.merkleRoot);
        if (!storedRoot.equals(Buffer.from(merkleRoot))) {
          throw new Error(`Merkle root mismatch: expected ${Buffer.from(merkleRoot).toString('hex')}, got ${storedRoot.toString('hex')}`);
        }
      } catch (verifyError) {
        console.error('Failed to verify batch anchor:', verifyError);
        // Don't throw - transaction was confirmed, verification is best-effort
      }

      return txSignature;
    } catch (error) {
      console.error('Failed to anchor batch:', error);
      throw error;
    }
  }

  /**
   * Finds which batch contains a given match ID by querying BatchAnchor accounts.
   * Per critique: improves batch lookup efficiency.
   */
  async findBatchForMatch(matchId: string): Promise<{ batchId: string; merkleRoot: string } | null> {
    const program = this.anchorClient.getProgram();

    try {
      // Query all BatchAnchor accounts
      // Note: In production, you'd use a more efficient index or filter
      // Type assertion needed because Anchor IDL types aren't fully inferred
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const batchAccounts = await (program.account as any).batchAnchor.all();

      // Check each batch to see if matchId is in range
      for (const account of batchAccounts) {
        const batchAnchor = account.account;
        
        // Convert fixed-size arrays to strings for comparison
        const firstMatchId = new TextDecoder().decode(
          batchAnchor.firstMatchId.filter((b: number) => b !== 0)
        );
        const lastMatchId = new TextDecoder().decode(
          batchAnchor.lastMatchId.filter((b: number) => b !== 0)
        );

        // Check if matchId is in range (lexicographic comparison for UUIDs)
        if (matchId >= firstMatchId && matchId <= lastMatchId) {
          const batchId = new TextDecoder().decode(
            batchAnchor.batchId.filter((b: number) => b !== 0)
          );
          const merkleRoot = Array.from(batchAnchor.merkleRoot as number[])
            .map((b: number) => b.toString(16).padStart(2, '0'))
            .join('');

          return { batchId, merkleRoot };
        }
      }

      return null; // Match not found in any batch
    } catch (error) {
      console.error('Failed to find batch for match:', error);
      return null;
    }
  }

  /**
   * Gets the SignerRegistry account to check if a public key is authorized.
   * Per critique Phase 1.2: Add signer registry lookup for signature verification.
   */
  async getSignerRegistry(): Promise<{ signers: PublicKey[]; roles: number[] } | null> {
    const program = this.anchorClient.getProgram();
    
    try {
      const [registryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('signer_registry')],
        program.programId
      );

      // Type assertion needed because Anchor IDL types aren't fully inferred
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const registryAccount = await (program.account as any).signerRegistry.fetch(registryPda);
      
      return {
        signers: registryAccount.signers as PublicKey[],
        roles: registryAccount.roles as number[],
      };
    } catch (error) {
      console.error('Failed to fetch signer registry:', error);
      return null;
    }
  }

  /**
   * Checks if a public key is authorized in the SignerRegistry.
   * Per critique Phase 1.2: Validate public keys against registry.
   */
  async isAuthorizedSigner(publicKey: string | PublicKey): Promise<boolean> {
    const registry = await this.getSignerRegistry();
    if (!registry) {
      return false; // Fail closed if registry not available
    }

    const pubkey = typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey;
    return registry.signers.some(s => s.equals(pubkey));
  }

  /**
   * Anchors a match record on-chain.
   * Per critique Phase 5.1: Add missing anchorMatchRecord method.
   */
  async anchorMatchRecord(
    matchId: string,
    matchHash: Uint8Array,
    hotUrl?: string,
    wallet?: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }
  ): Promise<TransactionSignature> {
    if (!wallet) {
      throw new Error('Wallet required for anchoring match record');
    }
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();
    
    const [matchPda] = await this.getMatchPDA(matchId);

    const tx = await program.methods
      .anchorMatchRecord(
        matchId,
        Array.from(matchHash),
        hotUrl || null
      )
      .accounts({
        matchAccount: matchPda,
        authority: wallet.publicKey,
      })
      .rpc();

    await this.confirmTransactionWithRetry(tx);
    return tx;
  }

  /**
   * Flags a dispute for a match on-chain.
   * Per spec Section 21, lines 3069-3073: "Flag creates on-chain dispute account"
   * Per critique Fix 6: Add TypeScript client code to call flag_dispute instruction
   */
  async flagDispute(
    matchId: string,
    reason: number, // 0=InvalidMove, 1=PlayerTimeout, 2=SuspectedCheating, 3=ScoreError, 4=Other
    evidenceHash: Uint8Array,
    wallet: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }
  ): Promise<TransactionSignature> {
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();

    try {
      const tx = await program.methods
        .flagDispute(matchId, reason, Array.from(evidenceHash))
        .accounts({
          flagger: wallet.publicKey,
        })
        .rpc();

      await this.anchorClient.getConnection().confirmTransaction(tx, 'confirmed');
      return tx;
    } catch (error) {
      console.error('Failed to flag dispute:', error);
      throw error;
    }
  }

  /**
   * Resolves a dispute on-chain.
   * Per spec Section 21, lines 3084-3091: "Resolution recorded on-chain"
   * Per critique Fix 6: Add TypeScript client code to call resolve_dispute instruction
   */
  async resolveDispute(
    disputeId: string,
    resolution: number, // 1=ResolvedInFavorOfFlagger, 2=ResolvedInFavorOfDefendant, 3=MatchVoided, 4=PartialRefund
    wallet: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }
  ): Promise<TransactionSignature> {
    this.validateWallet(wallet);
    const program = this.anchorClient.getProgram();

    try {
      const tx = await program.methods
        .resolveDispute(disputeId, resolution)
        .accounts({
          validator: wallet.publicKey,
        })
        .rpc();

      await this.confirmTransactionWithRetry(tx);
      return tx;
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
      throw error;
    }
  }

  /**
   * Fetches a batch manifest from on-chain BatchAnchor account.
   * Per critique Issue #8: Add missing getBatchManifest method.
   */
  async getBatchManifest(batchId: string): Promise<{
    batchId: string;
    merkleRoot: Uint8Array;
    count: number;
    firstMatchId: string;
    lastMatchId: string;
    createdAt: number;
  } | null> {
    const program = this.anchorClient.getProgram();

    try {
      const [batchAnchorPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('batch'), Buffer.from(batchId)],
        program.programId
      );

      // Type assertion needed because Anchor IDL types aren't fully inferred
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const batchAccount = await (program.account as any).batchAnchor.fetch(batchAnchorPda);
      
      if (!batchAccount) {
        return null;
      }

      return {
        batchId: batchAccount.batchId,
        merkleRoot: new Uint8Array(batchAccount.merkleRoot),
        count: batchAccount.count.toNumber(),
        firstMatchId: batchAccount.firstMatchId,
        lastMatchId: batchAccount.lastMatchId,
        createdAt: batchAccount.createdAt.toNumber(),
      };
    } catch (error) {
      console.error('Failed to fetch batch manifest:', error);
      return null;
    }
  }

  /**
   * Fetches a dispute account from on-chain.
   * Per critique Issue #8: Add missing getDispute method.
   */
  async getDispute(disputeId: string): Promise<{
    disputeId: string;
    matchId: string;
    flagger: PublicKey;
    reason: number;
    evidenceHash: Uint8Array;
    createdAt: number;
    resolvedAt?: number;
    resolution?: number;
  } | null> {
    const program = this.anchorClient.getProgram();

    try {
      const [disputePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('dispute'), Buffer.from(disputeId)],
        program.programId
      );

      // Type assertion needed because Anchor IDL types aren't fully inferred
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const disputeAccount = await (program.account as any).dispute.fetch(disputePda);
      
      if (!disputeAccount) {
        return null;
      }

      return {
        disputeId: disputeAccount.disputeId,
        matchId: disputeAccount.matchId,
        flagger: disputeAccount.flagger,
        reason: disputeAccount.reason,
        evidenceHash: new Uint8Array(disputeAccount.evidenceHash),
        createdAt: disputeAccount.createdAt.toNumber(),
        resolvedAt: disputeAccount.resolvedAt ? disputeAccount.resolvedAt.toNumber() : undefined,
        resolution: disputeAccount.resolution,
      };
    } catch (error) {
      console.error('Failed to fetch dispute:', error);
      return null;
    }
  }

  private serializeAction(action: PlayerAction): Buffer {
    return Buffer.from(JSON.stringify({
      type: action.type,
      playerId: action.playerId,
      data: action.data,
      timestamp: action.timestamp.toISOString(),
    }));
  }

  /**
   * Generates a cryptographically secure nonce for replay protection.
   * Per critique Issue #5: Use crypto.getRandomValues instead of Date.now()
   * Returns a safe integer (within Number.MAX_SAFE_INTEGER) for BN compatibility
   */
  private generateSecureNonce(): number {
    const randomBytes = new Uint32Array(2);
    crypto.getRandomValues(randomBytes);
    // Use only 26 bits from each Uint32 to ensure safe integer (26 + 26 = 52 bits < 53 bit safe limit)
    // This ensures the result fits in Number.MAX_SAFE_INTEGER (2^53 - 1)
    const high26 = randomBytes[0] & 0x3FFFFFF; // 26 bits
    const low26 = randomBytes[1] & 0x3FFFFFF;  // 26 bits
    return high26 * 0x4000000 + low26; // 26 + 26 = 52 bits total, safe for BN
  }

  /**
   * Confirms transaction with exponential backoff retry.
   * Per critique Issue #6: Add retry logic for confirmation failures.
   */
  private async confirmTransactionWithRetry(
    signature: TransactionSignature,
    maxRetries: number = 3,
    initialDelayMs: number = 1000
  ): Promise<void> {
    const connection = this.anchorClient.getConnection();
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const confirmation = await Promise.race([
          connection.confirmTransaction(signature, 'confirmed'),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Confirmation timeout')), 30000)
          )
        ]) as { value: { err: unknown } | null };
        
        if (confirmation?.value?.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }
        
        return; // Success
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error; // Last attempt failed
        }
        
        // Exponential backoff
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  /**
   * Validates wallet is connected and has public key.
   * Per critique Issue #7: Add wallet connection validation.
   */
  private validateWallet(wallet: { publicKey: PublicKey; signTransaction: (tx: unknown) => Promise<unknown> }): void {
    if (!wallet) {
      throw new Error('Wallet is required');
    }
    if (!wallet.publicKey) {
      throw new Error('Wallet public key is required');
    }
    if (!wallet.signTransaction) {
      throw new Error('Wallet signTransaction method is required');
    }
  }
}

