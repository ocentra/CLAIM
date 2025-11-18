// Match lifecycle helpers - applies to all games

import * as anchor from "@coral-xyz/anchor";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { program, authority } from "./setup";
import { getMatchPDA, getRegistryPDA } from "./pda";
import { createTestContext, TestContext } from "./test-context";
import { getTestUserId, getTestGame, getTestSeed } from "./test-data";

/**
 * Create a started match (common for all games)
 * Returns [matchPDA, registryPDA]
 */
export const createStartedMatch = async (
  matchId: string,
  numPlayers: number
): Promise<[PublicKey, PublicKey]> => {
  const ctx = createTestContext(`createStartedMatch(${matchId})`);
  
  try {
    ctx.set('matchId', matchId);
    ctx.set('numPlayers', numPlayers);
    
    // Get game registry
    const [registryPDA] = await getRegistryPDA();
    ctx.set('registryPDA', registryPDA);
    
    // Get CLAIM game (game_id = 0)
    const claimGame = getTestGame(0);
    if (!claimGame) {
      throw new Error("CLAIM game not found in test data");
    }
    
    // Get match PDA
    const [matchPDA] = await getMatchPDA(matchId);
    ctx.set('matchPDA', matchPDA);
    
    // Create match
    const seed = getTestSeed();
    await program.methods
      .createMatch(
        matchId,
        claimGame.game_id,
        new anchor.BN(seed),
        null, // entry_fee (None = free match)
        null, // payment_method (None = default)
        null, // match_type (None = default FREE)
        null  // tournament_id (None = not a tournament)
      )
      .accounts({
        matchAccount: matchPDA,
        registry: registryPDA,
        escrowAccount: null, // Escrow not needed for free matches
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();
    
    ctx.log("✓ Match created");
    
    // Join players
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { player1, player2, player3, player4 } = require("./setup");
    const playerKeypairs = [player1, player2, player3, player4];
    for (let i = 0; i < numPlayers; i++) {
      const userId = getTestUserId(i);
      const player = playerKeypairs[i];
      
      ctx.set(`player${i + 1}`, player.publicKey.toString());
      ctx.set(`userId${i + 1}`, userId);
      
      await program.methods
        .joinMatch(matchId, userId)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          escrowAccount: null, // Escrow not needed for free matches
          userDepositAccount: null, // Not needed for free matches
          playerWallet: null, // Not needed for free matches
          player: player.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .signers([player])
        .rpc();
      
      ctx.log(`✓ Player ${i + 1} joined`);
    }
    
    // Start match
    await program.methods
      .startMatch(matchId)
      .accounts({
        matchAccount: matchPDA,
        registry: registryPDA,
        escrowAccount: null, // Escrow not needed for free matches
        authority: authority.publicKey,
      } as never)
      .rpc();
    
    ctx.log("✓ Match started");
    ctx.finish();
    
    return [matchPDA, registryPDA];
  } catch (err) {
    ctx.error("Failed to create started match", err);
    throw err;
  }
};

/**
 * Create match with context (for better error messages)
 */
export const createMatchWithContext = async (
  ctx: TestContext,
  matchId: string,
  gameId: number,
  seed: number
): Promise<[PublicKey, PublicKey]> => {
  const [registryPDA] = await getRegistryPDA();
  const [matchPDA] = await getMatchPDA(matchId);
  
  ctx.set('registryPDA', registryPDA);
  ctx.set('matchPDA', matchPDA);
  
  const game = getTestGame(gameId);
  if (!game) {
    throw new Error(`Game ${gameId} not found in test data`);
  }
  
  await program.methods
    .createMatch(
      matchId,
      gameId,
      new anchor.BN(seed),
      null, // entry_fee (None = free match)
      null, // payment_method (None = default)
      null, // match_type (None = default FREE)
      null  // tournament_id (None = not a tournament)
    )
    .accounts({
      matchAccount: matchPDA,
      registry: registryPDA,
      escrowAccount: null, // Escrow not needed for free matches
      authority: authority.publicKey,
      systemProgram: SystemProgram.programId,
    } as never)
    .rpc();
  
  return [matchPDA, registryPDA];
};

/**
 * Check GameRegistry status
 */
export const checkGameRegistryStatus = async (ctx?: TestContext): Promise<{
  exists: boolean;
  registryPDA: PublicKey;
}> => {
  const [registryPDA] = await getRegistryPDA();
  
  if (ctx) {
    ctx.set('registryPDA', registryPDA);
  }
  
  const accountInfo = await program.provider.connection.getAccountInfo(registryPDA);
  const exists = accountInfo !== null;
  
  if (ctx) {
    ctx.set('registryExists', exists.toString());
    ctx.log(`Registry exists: ${exists}`);
  }
  
  return { exists, registryPDA };
};

