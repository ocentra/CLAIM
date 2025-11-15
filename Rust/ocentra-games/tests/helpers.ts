import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OcentraGames } from "../target/types/ocentra_games";
import { Keypair, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  loadMatchRecord,
  loadGameRegistry,
  loadAllUsers,
  getMatchHash,
  parseSeed,
  type GameDefinition,
} from "./test-data-loader";
// Import report generator to enable automatic report generation
import "./report-generator";
// Import Mocha hooks to automatically capture test results
import "./mocha-hooks";

// Helper type for Anchor errors
export type AnchorError = {
  error?: {
    errorCode?: {
      code?: string;
    };
  };
  message?: string;
};

// Configure the client
// NOTE: "websocket error" at test start is HARMLESS and can be ignored.
// Anchor tries to connect to validator's websocket for real-time updates,
// but the HTTP RPC connection works fine for all tests. This is a known Anchor quirk.
export const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Explicitly type the program to help TypeScript inference
export const program: Program<OcentraGames> = anchor.workspace.OcentraGames as Program<OcentraGames>;

// Detect cluster type for conditional test execution
export const isLocalnet = (): boolean => {
  const cluster = provider.connection.rpcEndpoint;
  return cluster.includes('localhost') || cluster.includes('127.0.0.1') || cluster.includes('localnet');
};

export const isDevnet = (): boolean => {
  const cluster = provider.connection.rpcEndpoint;
  return cluster.includes('devnet') || cluster.includes('api.devnet.solana.com');
};

export const isMainnet = (): boolean => {
  const cluster = provider.connection.rpcEndpoint;
  return cluster.includes('mainnet') || cluster.includes('api.mainnet-beta.solana.com');
};

// Test execution flags - can be controlled via environment variables
export const TEST_FLAGS = {
  // SIMPLE MODE: Only run basic tests (skip complex setup)
  // Set SIMPLE_TESTS=true to run only simple.test.ts
  SIMPLE_MODE: process.env.SIMPLE_TESTS === 'true',
  
  // Skip expensive tests on devnet (can be overridden with env var)
  SKIP_EXPENSIVE_ON_DEVNET: process.env.SKIP_EXPENSIVE_TESTS !== 'false',
  
  // Run stress tests (default: only on localnet)
  RUN_STRESS_TESTS: process.env.RUN_STRESS_TESTS === 'true' || isLocalnet(),
  
  // Run comprehensive error tests (default: only on localnet)
  RUN_COMPREHENSIVE_ERROR_TESTS: process.env.RUN_ERROR_TESTS === 'true' || isLocalnet(),
  
  // Force all tests (override all flags)
  FORCE_ALL_TESTS: process.env.FORCE_ALL_TESTS === 'true',
};

// Helper to check if test should run
export const shouldRunTest = (testType: 'stress' | 'error' | 'expensive' = 'expensive'): boolean => {
  if (TEST_FLAGS.FORCE_ALL_TESTS) return true;
  
  if (isLocalnet()) return true; // Always run on localnet
  
  if (isDevnet()) {
    switch (testType) {
      case 'stress':
        return TEST_FLAGS.RUN_STRESS_TESTS;
      case 'error':
        return TEST_FLAGS.RUN_COMPREHENSIVE_ERROR_TESTS;
      case 'expensive':
        return !TEST_FLAGS.SKIP_EXPENSIVE_ON_DEVNET;
      default:
        return false;
    }
  }
  
  // Mainnet: skip all expensive tests
  return false;
};

// Helper to conditionally skip test suites in simple mode
// When SIMPLE_MODE is false (default), all tests run normally
// Usage: Use this instead of describe() to allow skipping complex tests in simple mode
// By default (anchor test), all tests run. Use SIMPLE_TESTS=true to skip complex tests.
export const conditionalDescribe = (
  name: string,
  fn: (this: Mocha.Suite) => void
): void => {
  // Only skip if explicitly in simple mode AND not forcing all tests
  // Default behavior: SIMPLE_MODE is false, so all tests run
  if (TEST_FLAGS.SIMPLE_MODE && !TEST_FLAGS.FORCE_ALL_TESTS) {
    describe.skip(name, fn);
  } else {
    // Normal execution - all tests run
    describe(name, fn);
  }
};

// Load test data ONCE at module level
export const testMatchRecord = loadMatchRecord("claim-4player-complete");
export const testGameRegistry = loadGameRegistry();
export const testUsers = loadAllUsers();

// Map test users to Keypairs (we'll generate these but use real user IDs)
export const authority = provider.wallet;
export const player1 = Keypair.generate();
export const player2 = Keypair.generate();
export const player3 = Keypair.generate();
export const player4 = Keypair.generate();
export const unauthorizedPlayer = Keypair.generate();

// Map real user IDs from test data to our test keypairs
export const userKeypairMap: Map<string, Keypair> = new Map([
  [testMatchRecord.players[0].player_id, player1],
  [testMatchRecord.players[1].player_id, player2],
  [testMatchRecord.players[2].player_id, player3],
  [testMatchRecord.players[3].player_id, player4],
]);

// Get real match ID from test data (base match ID)
export const getTestMatchId = (): string => {
  return testMatchRecord.match_id;
};

// Counter to ensure unique match IDs even with same suffix
let matchIdCounter = 0;

// Generate unique match ID for tests
// IMPORTANT: Result must be exactly 36 characters (UUID v4 format)
// IMPORTANT: First 31 bytes must be unique to avoid PDA collisions
export const generateUniqueMatchId = (suffix: string = ""): string => {
  // Increment counter for uniqueness
  matchIdCounter++;
  
  // Generate unique data: timestamp + counter + suffix + random + process time
  const timestamp = Date.now();
  const random = Math.random();
  const uniqueData = `${timestamp}-${matchIdCounter}-${suffix}-${random}-${process.hrtime.bigint()}`;
  
  // Create hash from unique data
  let hash = 0;
  for (let i = 0; i < uniqueData.length; i++) {
    const char = uniqueData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate multiple hash values to ensure uniqueness
  const h1 = Math.abs(hash).toString(16).padStart(8, '0');
  const h2 = Math.abs(hash * 31 + matchIdCounter).toString(16).padStart(8, '0');
  const h3 = Math.abs(hash * 17 + timestamp).toString(16).padStart(8, '0');
  const h4 = Math.abs(hash * 7 + Math.floor(random * 1000000)).toString(16).padStart(8, '0');
  
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars)
  // First 31 chars: xxxxxxxx-xxxx-xxxx-xxxx-xxx (positions 0-30)
  // Build UUID ensuring first 31 chars are unique by using different hash parts
  const part1 = h1; // 8 chars: positions 0-7
  const part2 = h2.slice(0, 4); // 4 chars: positions 9-12
  const part3 = h3.slice(0, 4); // 4 chars: positions 14-17
  const part4 = h4.slice(0, 4); // 4 chars: positions 19-22
  const part5a = h1.slice(4, 7); // 3 chars: positions 24-26
  const part5b = h2.slice(4, 8); // 4 chars: positions 27-30 (completes first 31)
  const part5c = h3.slice(4, 8); // 4 chars: positions 31-34
  const part5d = h4.slice(4, 5); // 1 char: position 35
  
  const result = `${part1}-${part2}-${part3}-${part4}-${part5a}${part5b}${part5c}${part5d}`;
  
  // Final validation: must be exactly 36 characters
  if (result.length !== 36) {
    throw new Error(`Generated match_id is ${result.length} characters, must be 36`);
  }
  
  // Log the generated match ID for debugging
  const first31Bytes = Buffer.from(result, 'utf-8').slice(0, 31);
  console.log(`[generateUniqueMatchId] Generated match_id: ${result}`);
  console.log(`[generateUniqueMatchId] Counter: ${matchIdCounter}, Suffix: "${suffix}"`);
  console.log(`[generateUniqueMatchId] First 31 bytes (for PDA): ${first31Bytes.toString('hex')} (${first31Bytes.length} bytes)`);
  console.log(`[generateUniqueMatchId] First 31 chars: ${result.substring(0, 31)}`);
  
  return result;
};

// Get real user IDs from test data
export const getTestUserIds = (): string[] => {
  return testMatchRecord.players.map(p => p.player_id);
};

// Get real user ID by index
export const getTestUserId = (index: number): string => {
  return testMatchRecord.players[index]?.player_id || testMatchRecord.players[0].player_id;
};

// Get real game definition from test data
export const getTestGame = (gameId: number): GameDefinition | undefined => {
  return testGameRegistry.find(g => g.game_id === gameId);
};

// Get real seed from test data
export const getTestSeed = (): number => {
  return parseSeed(testMatchRecord.seed);
};

// Get real match hash from test data
export const getTestMatchHash = (): Buffer => {
  return getMatchHash(testMatchRecord);
};

// Get real hot URL from test data
export const getTestHotUrl = (): string => {
  return testMatchRecord.storage?.hot_url || `https://r2.example.com/matches/${testMatchRecord.match_id}.json`;
};

// Helper to get match PDA
// Note: match_id is 36 bytes (UUID), but Solana seeds have 32-byte limit per seed
// Total seeds length must be <= 32 bytes, so we use "m" (1 byte) + first 31 bytes of match_id
// "m" (1 byte) + truncated match_id (31 bytes) = 32 bytes total
export const getMatchPDA = async (matchId: string): Promise<[PublicKey, number]> => {
  const matchIdBytes = Buffer.from(matchId, 'utf-8');
  const truncated = matchIdBytes.slice(0, 31); // Truncate to 31 bytes
  const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("m"), truncated],
    program.programId
  );
  console.log(`[getMatchPDA] match_id: ${matchId}`);
  console.log(`[getMatchPDA] match_id bytes: ${matchIdBytes.length}, truncated: ${truncated.length}`);
  console.log(`[getMatchPDA] PDA: ${pda.toString()}, bump: ${bump}`);
  return [pda, bump];
};

// Helper to get GameRegistry PDA
export const getRegistryPDA = async (): Promise<[PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("game_registry")],
    program.programId
  );
};

// Helper to get move PDA
// Note: Rust truncates match_id to 31 bytes in seeds to fit within 32-byte limit
export const getMovePDA = async (
  matchId: string,
  player: PublicKey,
  nonce: anchor.BN
): Promise<[PublicKey, number]> => {
  const matchIdBytes = Buffer.from(matchId, 'utf-8');
  const truncated = matchIdBytes.slice(0, 31); // Truncate to 31 bytes to match Rust
  const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("move"),
      truncated,
      player.toBuffer(),
      Buffer.from(nonce.toArray("le", 8)),
    ],
    program.programId
  );
  console.log(`[getMovePDA] match_id: ${matchId}`);
  console.log(`[getMovePDA] player: ${player.toString()}, nonce: ${nonce.toString()}`);
  console.log(`[getMovePDA] truncated match_id (31 bytes): ${truncated.toString('hex')}`);
  console.log(`[getMovePDA] PDA: ${pda.toString()}, bump: ${bump}`);
  return [pda, bump];
};

// Helper to get batch move PDA (uses index instead of nonce)
// Note: Rust truncates match_id to 31 bytes in seeds
export const getBatchMovePDA = async (
  matchId: string,
  player: PublicKey,
  index: number
): Promise<[PublicKey, number]> => {
  const matchIdBytes = Buffer.from(matchId, 'utf-8');
  const truncated = matchIdBytes.slice(0, 31); // Truncate to 31 bytes to match Rust
  const indexBuffer = Buffer.alloc(4);
  indexBuffer.writeUInt32LE(index, 0);
  const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("move"),
      truncated,
      player.toBuffer(),
      indexBuffer,
    ],
    program.programId
  );
  console.log(`[getBatchMovePDA] match_id: ${matchId}, index: ${index}`);
  console.log(`[getBatchMovePDA] player: ${player.toString()}`);
  console.log(`[getBatchMovePDA] truncated match_id (31 bytes): ${truncated.toString('hex')}`);
  console.log(`[getBatchMovePDA] PDA: ${pda.toString()}, bump: ${bump}`);
  return [pda, bump];
};

// Helper to airdrop SOL with retry logic
export const airdrop = async (pubkey: PublicKey, amount: number, retries = 3): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      const sig = await provider.connection.requestAirdrop(
        pubkey,
        amount * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig, 'confirmed');
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Airdrop attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Setup: Initialize GameRegistry with REAL game data from test-data
// On devnet, this may be slow due to multiple transactions
export const setupGameRegistry = async (): Promise<void> => {
  const [registryPDA] = await getRegistryPDA();
  
  // First, check if registry exists and initialize if needed
  const accountInfo = await program.provider.connection.getAccountInfo(registryPDA);
  if (accountInfo === null) {
    // Initialize registry first
    try {
      await program.methods
        .initializeRegistry()
        .accounts({
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();
      console.log("✓ GameRegistry initialized");
    } catch (err: unknown) {
      const error = err as { message?: string };
      // If already initialized, that's fine
      if (!error.message?.includes("already in use") && !error.message?.includes("0x0")) {
        throw err;
      }
      console.log("GameRegistry already initialized");
    }
  }
  
  // On devnet, only register essential games (CLAIM) to save transactions
  const gamesToRegister = isDevnet() 
    ? testGameRegistry.filter(g => g.game_id === 0) // Only CLAIM on devnet
    : testGameRegistry; // All games on localnet
  
  for (const game of gamesToRegister) {
    try {
      await program.methods
        .registerGame(
          game.game_id,
          game.name,
          game.min_players,
          game.max_players,
          game.rule_engine_url,
          game.version
        )
        .accounts({
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();
      
      console.log(`Game registered: ${game.name} (game_id=${game.game_id})`);
    } catch (err: unknown) {
      // If game already exists, that's fine - check for specific error codes
      const error = err as AnchorError;
      const errorCode = error.error?.errorCode?.code;
      
      // GameAlreadyExists is expected if game is already registered
      if (errorCode === "GameAlreadyExists" || 
          error.message?.includes("Game already exists") ||
          error.message?.includes("already in use") || 
          error.message?.includes("0x0")) {
        console.log(`Game ${game.name} already registered`);
        continue;
      }
      
      // Re-throw unexpected errors
      throw err;
    }
  }
};

// Initialize test accounts with SOL
// WARNING: On devnet, airdrops are rate-limited. Use sparingly.
export const initializeTestAccounts = async (): Promise<void> => {
  if (isDevnet()) {
    // On devnet, only airdrop if accounts have insufficient balance
    const minBalance = 0.5 * LAMPORTS_PER_SOL; // 0.5 SOL minimum
    
    const accounts = [player1, player2, player3, player4, unauthorizedPlayer];
    for (const account of accounts) {
      try {
        const balance = await provider.connection.getBalance(account.publicKey);
        if (balance < minBalance) {
          console.log(`Airdropping to ${account.publicKey.toBase58()} (balance: ${balance / LAMPORTS_PER_SOL} SOL)`);
          await airdrop(account.publicKey, 1); // Smaller amount on devnet
        }
      } catch (err) {
        console.warn(`Failed to check/airdrop for ${account.publicKey.toBase58()}:`, err);
        // Continue with other accounts
      }
    }
  } else {
    // On localnet, airdrop freely
    await airdrop(player1.publicKey, 2);
    await airdrop(player2.publicKey, 2);
    await airdrop(player3.publicKey, 2);
    await airdrop(player4.publicKey, 2);
    await airdrop(unauthorizedPlayer.publicKey, 2);
  }
};

// Create a test match using REAL data from test-data
// Uses the canonical match record from test-data/matches/claim-4player-complete.json
export const createStartedMatch = async (
  matchId?: string,
  numPlayers?: number
): Promise<[PublicKey, PublicKey]> => {
  // Use real match data if not specified
  let realMatchId = matchId || testMatchRecord.match_id;
  
  // Ensure match_id is exactly 36 characters (UUID v4 format)
  if (realMatchId.length !== 36) {
    // If not 36 chars, generate a unique one
    realMatchId = generateUniqueMatchId();
  }
  
  const realNumPlayers = numPlayers || testMatchRecord.players.length;
  
  console.log(`[createStartedMatch] Starting match creation`);
  console.log(`[createStartedMatch] match_id: ${realMatchId} (${realMatchId.length} chars)`);
  console.log(`[createStartedMatch] numPlayers: ${realNumPlayers}`);
  
  const [matchPDA] = await getMatchPDA(realMatchId);
  const [registryPDA] = await getRegistryPDA();
  
  // Get CLAIM game from test data (game_id = 0)
  const claimGame = getTestGame(0);
  if (!claimGame) {
    throw new Error("CLAIM game not found in test data");
  }

  // Use REAL seed from test data
  const seed = parseSeed(testMatchRecord.seed);
  console.log(`[createStartedMatch] game_id: ${claimGame.game_id}, seed: ${seed}`);

  // Create match with REAL data
  console.log(`[createStartedMatch] Creating match...`);
  await program.methods
    .createMatch(realMatchId, claimGame.game_id, new anchor.BN(seed))
    .accounts({
      matchAccount: matchPDA,
      registry: registryPDA,
      authority: authority.publicKey,
      systemProgram: SystemProgram.programId,
    } as never)
    .rpc();
  console.log(`[createStartedMatch] Match created successfully`);

  // Join players using REAL user IDs from test data
  const playersToJoin = testMatchRecord.players.slice(0, realNumPlayers);
  console.log(`[createStartedMatch] Joining ${playersToJoin.length} players...`);
  for (let i = 0; i < playersToJoin.length; i++) {
    const playerData = playersToJoin[i];
    const keypair = userKeypairMap.get(playerData.player_id) || [player1, player2, player3, player4][i];
    
    console.log(`[createStartedMatch] Joining player ${i}: ${playerData.player_id} (${keypair.publicKey.toString()})`);
    await program.methods
      .joinMatch(realMatchId, playerData.player_id)
      .accounts({
        matchAccount: matchPDA,
        registry: registryPDA,
        player: keypair.publicKey,
      } as never)
      .signers([keypair])
      .rpc();
  }
  console.log(`[createStartedMatch] All players joined`);

  // Start match
  console.log(`[createStartedMatch] Starting match...`);
  await program.methods
    .startMatch(realMatchId)
    .accounts({
      matchAccount: matchPDA,
      registry: registryPDA,
      authority: authority.publicKey,
    } as never)
    .rpc();
  console.log(`[createStartedMatch] Match started successfully`);

  return [matchPDA, registryPDA];
};

/**
 * Helper to submit a move instruction while bypassing Anchor's PDA verification.
 * This is needed because Anchor's IDL doesn't include slice operations in seeds,
 * so it tries to verify PDAs using the full match_id instead of truncated version.
 * 
 * This function builds the instruction manually and sends it directly.
 */
export const submitMoveManual = async (
  matchId: string,
  userId: string,
  actionType: number,
  payload: Buffer,
  nonce: anchor.BN,
  matchPDA: PublicKey,
  registryPDA: PublicKey,
  movePDA: PublicKey,
  player: Keypair
): Promise<string> => {
  console.log(`[submitMoveManual] Building instruction manually to bypass PDA verification`);
  console.log(`[submitMoveManual] match_id: ${matchId}, user_id: ${userId}, action_type: ${actionType}`);
  console.log(`[submitMoveManual] movePDA: ${movePDA.toString()}`);
  
  // Build instruction manually using .instruction() to bypass PDA derivation
  const instruction = await program.methods
    .submitMove(matchId, userId, actionType, payload, nonce)
    .instruction();
  
  // Get all accounts needed (including the manually provided PDAs)
  const accounts = [
    { pubkey: matchPDA, isSigner: false, isWritable: true },
    { pubkey: registryPDA, isSigner: false, isWritable: false },
    { pubkey: movePDA, isSigner: false, isWritable: true },
    { pubkey: player.publicKey, isSigner: true, isWritable: true },
    { pubkey: anchor.web3.SystemProgram.programId, isSigner: false, isWritable: false },
  ];
  
  // Replace accounts in instruction with our manually derived ones
  instruction.keys = accounts;
  
  // Build and send transaction
  const tx = new anchor.web3.Transaction().add(instruction);
  const provider = program.provider as anchor.AnchorProvider;
  const signature = await provider.sendAndConfirm(tx, [player]);
  
  console.log(`[submitMoveManual] Transaction sent: ${signature}`);
  return signature;
};

/**
 * Helper to submit batch moves manually (bypasses Anchor's PDA verification)
 */
export const submitBatchMovesManual = async (
  matchId: string,
  userId: string,
  moves: Array<{ actionType: number; payload: Buffer; nonce: anchor.BN }>,
  matchPDA: PublicKey,
  registryPDA: PublicKey,
  movePDAs: PublicKey[],
  player: Keypair
): Promise<string> => {
  console.log(`[submitBatchMovesManual] Building instruction manually for ${moves.length} moves`);
  console.log(`[submitBatchMovesManual] match_id: ${matchId}, user_id: ${userId}`);
  
  // Convert moves to the format expected by the program (keep as Buffer)
  const batchMoves = moves.map(m => ({
    actionType: m.actionType,
    payload: m.payload, // Keep as Buffer
    nonce: m.nonce,
  }));
  
  // Build instruction manually
  const instruction = await program.methods
    .submitBatchMoves(matchId, userId, batchMoves)
    .instruction();
  
  // Build accounts array with manually provided PDAs
  const accounts = [
    { pubkey: matchPDA, isSigner: false, isWritable: true },
    { pubkey: registryPDA, isSigner: false, isWritable: false },
    ...movePDAs.map(pda => ({ pubkey: pda, isSigner: false, isWritable: true })),
    { pubkey: player.publicKey, isSigner: true, isWritable: true },
    { pubkey: anchor.web3.SystemProgram.programId, isSigner: false, isWritable: false },
  ];
  
  // Replace accounts in instruction
  instruction.keys = accounts;
  
  // Build and send transaction
  const tx = new anchor.web3.Transaction().add(instruction);
  const provider = program.provider as anchor.AnchorProvider;
  const signature = await provider.sendAndConfirm(tx, [player]);
  
  console.log(`[submitBatchMovesManual] Transaction sent: ${signature}`);
  return signature;
};

/**
 * Test Context Helper - Provides meaningful IDs and logging for tests
 * Use this to log test context so errors are actionable
 */
export class TestContext {
  private testName: string;
  private context: Map<string, string> = new Map();

  constructor(testName: string) {
    this.testName = testName;
    this.log(`[TEST] Starting: ${testName}`);
  }

  set(key: string, value: string | PublicKey | number | boolean): void {
    const strValue = value instanceof PublicKey ? value.toString() : String(value);
    this.context.set(key, strValue);
    this.log(`[TEST] ${key}: ${strValue}`);
  }

  get(key: string): string | undefined {
    return this.context.get(key);
  }

  log(message: string): void {
    console.log(`[${this.testName}] ${message}`);
  }

  error(message: string, error?: unknown): never {
    const contextStr = Array.from(this.context.entries())
      .map(([k, v]) => `  ${k}: ${v}`)
      .join('\n');
    
    const errorMsg = error instanceof Error ? error.message : String(error);
    const fullMessage = `[${this.testName}] ${message}\nContext:\n${contextStr}\nError: ${errorMsg}`;
    
    console.error(fullMessage);
    throw new Error(fullMessage);
  }

  expect(condition: boolean, message: string): void {
    if (!condition) {
      this.error(`Assertion failed: ${message}`);
    }
  }

  finish(): void {
    this.log(`[TEST] Completed: ${this.testName}`);
  }
}

/**
 * Helper to create a test context with common setup
 */
export const createTestContext = (testName: string): TestContext => {
  return new TestContext(testName);
};

/**
 * Helper to check if GameRegistry exists and is valid
 * Consolidates logic from simple.test.ts and phase2-registry.test.ts
 */
export const checkGameRegistryStatus = async (ctx?: TestContext): Promise<{
  exists: boolean;
  isValid: boolean;
  gameCount?: number;
  registryPDA: PublicKey;
}> => {
  const [registryPDA] = await getRegistryPDA();
  const accountInfo = await program.provider.connection.getAccountInfo(registryPDA);
  
  if (accountInfo === null) {
    if (ctx) ctx.log(`GameRegistry does not exist at ${registryPDA.toString()}`);
    return { exists: false, isValid: false, registryPDA };
  }

  try {
    const registry = await program.account.gameRegistry.fetch(registryPDA);
    if (ctx) {
      ctx.set('registryPDA', registryPDA);
      ctx.set('gameCount', registry.gameCount);
      ctx.set('authority', registry.authority);
      ctx.log(`GameRegistry exists with ${registry.gameCount} game(s)`);
    }
    return { 
      exists: true, 
      isValid: true, 
      gameCount: registry.gameCount,
      registryPDA 
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    if (ctx) {
      ctx.error(
        `GameRegistry account exists but has wrong structure at ${registryPDA.toString()}`,
        error
      );
    }
    throw new Error(
      `GameRegistry account has wrong structure. Run: solana-test-validator --reset\n` +
      `Account: ${registryPDA.toString()}\nError: ${error.message || 'unknown'}`
    );
  }
};

/**
 * Helper to create a match with full context logging
 */
export const createMatchWithContext = async (
  ctx: TestContext,
  matchId: string,
  gameId: number,
  seed: number
): Promise<[PublicKey, PublicKey]> => {
  const [matchPDA] = await getMatchPDA(matchId);
  const [registryPDA] = await getRegistryPDA();
  
  ctx.set('matchId', matchId);
  ctx.set('matchPDA', matchPDA);
  ctx.set('registryPDA', registryPDA);
  ctx.set('gameId', gameId);
  ctx.set('seed', seed);

  try {
    await program.methods
      .createMatch(matchId, gameId, new anchor.BN(seed))
      .accounts({
        matchAccount: matchPDA,
        registry: registryPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();
    
    ctx.log(`Match created successfully`);
    return [matchPDA, registryPDA];
  } catch (err: unknown) {
    ctx.error(`Failed to create match`, err);
    throw err; // TypeScript needs this
  }
};

/**
 * Helper to assert Anchor errors with context
 */
export const expectAnchorError = (
  ctx: TestContext,
  error: unknown,
  expectedCode: string,
  customMessage?: string
): void => {
  const anchorError = error as AnchorError;
  const actualCode = anchorError.error?.errorCode?.code;
  
  if (actualCode !== expectedCode) {
    ctx.error(
      customMessage || `Expected error code '${expectedCode}' but got '${actualCode}'`,
      error
    );
  }
  
  ctx.log(`✓ Got expected error: ${expectedCode}`);
};

