/**
 * Tests that should ONLY run on localnet due to:
 * - High transaction volume
 * - Multiple airdrops
 * - Rate limit concerns on devnet
 * 
 * These tests are skipped automatically on devnet.
 */

import { expect } from "chai";
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  program,
  authority,
  player1,
  generateUniqueMatchId,
  getTestUserId,
  getTestGame,
  getTestSeed,
  getMatchPDA,
  getRegistryPDA,
  getMovePDA,
  getBatchMovePDA,
  createStartedMatch,
  setupGameRegistry,
  initializeTestAccounts,
  shouldRunTest,
  conditionalDescribe,
  TEST_FLAGS,
  type AnchorError,
} from "./helpers";

conditionalDescribe("Localnet-Only Tests (High Transaction Volume)", function() {
  before(async function() {
    if (!shouldRunTest('stress')) {
      console.log("⏭️  Skipping stress tests (use RUN_STRESS_TESTS=true to enable on devnet)");
      this.skip(); // Skip all tests in this suite
      return;
    }
    await initializeTestAccounts();
    await setupGameRegistry();
  });

  describe("Stress Tests - Multiple Matches", () => {
    it("Can create and manage multiple matches simultaneously", async function() {
      if (!shouldRunTest('stress')) this.skip();
      
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();
      const [registryPDA] = await getRegistryPDA();

      // Create 5 matches in parallel
      const matchIds = Array.from({ length: 5 }, (_, i) => generateUniqueMatchId(`stress-${i}`));
      const matchPDAs = await Promise.all(
        matchIds.map(id => getMatchPDA(id))
      );

      // Create all matches
      await Promise.all(
        matchIds.map((matchId, i) => 
          program.methods
            .createMatch(matchId, claimGame.game_id, new anchor.BN(seed + i))
            .accounts({
              matchAccount: matchPDAs[i][0],
              registry: registryPDA,
              authority: authority.publicKey,
              systemProgram: SystemProgram.programId,
            } as never)
            .rpc()
        )
      );

      // Verify all matches exist
      for (let i = 0; i < matchIds.length; i++) {
        const matchAccount = await program.account.match.fetch(matchPDAs[i][0]);
        const matchIdStr = Array.from(matchAccount.matchId).map(b => String.fromCharCode(b)).join('').replace(/\0/g, '').substring(0, 36);
        expect(matchIdStr).to.equal(matchIds[i]);
      }
    });

    it("Can handle rapid sequential match creation", async function() {
      if (!shouldRunTest('stress')) this.skip();
      
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();
      const [registryPDA] = await getRegistryPDA();

      // Create 10 matches sequentially (stress test)
      for (let i = 0; i < 10; i++) {
        const matchId = generateUniqueMatchId(`rapid-${i}`);
        const [matchPDA] = await getMatchPDA(matchId);
        
        await program.methods
          .createMatch(matchId, claimGame.game_id, new anchor.BN(seed + i))
          .accounts({
            matchAccount: matchPDA,
            registry: registryPDA,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .rpc();

        const matchAccount = await program.account.match.fetch(matchPDA);
        const matchIdStr = Array.from(matchAccount.matchId).map(b => String.fromCharCode(b)).join('').replace(/\0/g, '').substring(0, 36);
        expect(matchIdStr).to.equal(matchId);
      }
    });
  });

  describe("Comprehensive Error Case Testing", () => {
    // These error tests create matches just to test errors - expensive on devnet
    // Run only on localnet where we have unlimited transactions

    it("Tests all invalid match_id formats", async function() {
      if (!shouldRunTest('error')) this.skip();
      
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();
      const [registryPDA] = await getRegistryPDA();

      const invalidIds = [
        "", // empty
        "a", // too short
        "a".repeat(35), // 35 chars (need 36)
        "a".repeat(37), // 37 chars (too long)
        "not-a-uuid-format-at-all-just-text", // invalid format
      ];

      for (const invalidId of invalidIds) {
        const [matchPDA] = await getMatchPDA(invalidId);
        try {
          await program.methods
            .createMatch(invalidId, claimGame.game_id, new anchor.BN(seed))
            .accounts({
              matchAccount: matchPDA,
              registry: registryPDA,
              authority: authority.publicKey,
              systemProgram: SystemProgram.programId,
            } as never)
            .rpc();
          
          expect.fail(`Should have failed for invalid match_id: ${invalidId}`);
        } catch (err: unknown) {
          // Expected to fail
          const error = err as AnchorError;
          const isInvalidPayload = error.error?.errorCode?.code === "InvalidPayload";
          const hasConstraint = error.message?.includes("constraint");
          const isValid = isInvalidPayload || hasConstraint;
          void expect(isValid).to.be.true;
        }
      }
    });

    it("Tests all invalid action types", async function() {
      if (!shouldRunTest('error')) this.skip();
      
      const matchId = generateUniqueMatchId("invalid-actions");
      const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

      const invalidActionTypes = [5, 6, 10, 100, 255];
      const userId = getTestUserId(0);
      const nonce = new anchor.BN(Date.now());

      for (const actionType of invalidActionTypes) {
        const [movePDA] = await getMovePDA(matchId, player1.publicKey, new anchor.BN(nonce.toNumber() + actionType));
        try {
          await program.methods
            .submitMove(matchId, userId, actionType, Buffer.alloc(0), new anchor.BN(nonce.toNumber() + actionType))
            .accounts({
              matchAccount: matchPDA,
              registry: registryPDA,
              moveAccount: movePDA,
              player: player1.publicKey,
              systemProgram: SystemProgram.programId,
            } as never)
            .signers([player1])
            .rpc();
          
          expect.fail(`Should have failed for invalid action_type: ${actionType}`);
        } catch (err: unknown) {
          const error = err as AnchorError;
          expect(error.error?.errorCode?.code).to.equal("InvalidAction");
        }
      }
    });
  });

  describe("Batch Operations Stress Test", () => {
    it("Can submit multiple batch moves in sequence", async function() {
      if (!shouldRunTest('stress')) this.skip();
      
      const matchId = generateUniqueMatchId("batch-stress");
      const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

      // Submit 5 batch moves in sequence (each with 5 moves = 25 total moves)
      for (let batchNum = 0; batchNum < 5; batchNum++) {
        const userId = getTestUserId(0);
        const baseNonce = Date.now() + (batchNum * 1000);
        
        const moves = Array.from({ length: 5 }, (_, i) => ({
          actionType: 2, // declare_intent
          payload: Buffer.from([i % 4]), // different suits
          nonce: new anchor.BN(baseNonce + i),
        }));

        const movePDAs = await Promise.all(
          moves.map((_, i) => getBatchMovePDA(matchId, player1.publicKey, batchNum * 5 + i))
        );

        await program.methods
          .submitBatchMoves(matchId, userId, moves)
          .accounts({
            matchAccount: matchPDA,
            registry: registryPDA,
            moveAccount0: movePDAs[0][0],
            moveAccount1: movePDAs[1][0],
            moveAccount2: movePDAs[2][0],
            moveAccount3: movePDAs[3][0],
            moveAccount4: movePDAs[4][0],
            player: player1.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .signers([player1])
          .rpc();
      }

      const matchAccount = await program.account.match.fetch(matchPDA);
      expect(matchAccount.moveCount).to.equal(25);
    });
  });
});

