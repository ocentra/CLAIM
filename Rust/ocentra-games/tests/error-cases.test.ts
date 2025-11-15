import { expect } from "chai";
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  program,
  authority,
  player1,
  player3,
  unauthorizedPlayer,
  generateUniqueMatchId,
  getTestUserId,
  getTestGame,
  getTestSeed,
  getTestMatchHash,
  getTestHotUrl,
  getMatchPDA,
  getRegistryPDA,
  getMovePDA,
  createStartedMatch,
  setupGameRegistry,
  initializeTestAccounts,
  shouldRunTest,
  conditionalDescribe,
  TEST_FLAGS,
  type AnchorError,
} from "./helpers";

conditionalDescribe("Error Cases", function() {
  before(async function() {
    await initializeTestAccounts();
    await setupGameRegistry();
  });

  describe("Unauthorized Access", () => {
    it("Fails to end match with unauthorized authority", async () => {
      const matchId = generateUniqueMatchId("unauth-test");
      const [matchPDA] = await getMatchPDA(matchId);
      const [registryPDA] = await getRegistryPDA();
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();

      // Create match
      await program.methods
        .createMatch(matchId, claimGame.game_id, new anchor.BN(seed))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();

      const matchHash = getTestMatchHash();
      const hotUrl = getTestHotUrl();

      try {
        await program.methods
          .endMatch(matchId, Array.from(matchHash), hotUrl)
          .accounts({
            matchAccount: matchPDA,
            authority: unauthorizedPlayer.publicKey,
          } as never)
          .signers([unauthorizedPlayer])
          .rpc();
        
        expect.fail("Should have thrown Unauthorized error");
      } catch (err: unknown) {
        // Could be Unauthorized or constraint error
        const error = err as { error?: { errorCode?: { code?: string } }; message?: string };
        const isUnauthorized = error.error?.errorCode?.code === "Unauthorized";
        const hasConstraint = error.message?.includes("constraint");
        const isValid = isUnauthorized || hasConstraint;
        void expect(isValid).to.be.true;
      }
    });
  });

  describe("Invalid Payload", () => {
    // NOTE: These tests create matches just to test errors - expensive on devnet
    // Use RUN_ERROR_TESTS=true env var to enable on devnet
    it("Fails to submit move with payload too large", async function() {
      if (!shouldRunTest('error')) {
        this.skip();
        return;
      }
      
      const matchId = generateUniqueMatchId("large-payload");
      const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

      const userId = getTestUserId(0);
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(matchId, player1.publicKey, nonce);

      // Payload > 128 bytes
      const largePayload = Buffer.alloc(129, 1);

      try {
        await program.methods
          .submitMove(matchId, userId, 2, largePayload, nonce)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          moveAccount: movePDA,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
          .signers([player1])
          .rpc();
        
        expect.fail("Should have thrown InvalidPayload error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidPayload");
      }
    });

    it("Fails to submit move with invalid action_type", async function() {
      if (!shouldRunTest('error')) {
        this.skip();
        return;
      }
      
      const matchId = generateUniqueMatchId("invalid-action");
      const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

      const userId = getTestUserId(0);
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(matchId, player1.publicKey, nonce);

      // Invalid action_type > 4
      const invalidActionType = 255;

      try {
        await program.methods
          .submitMove(matchId, userId, invalidActionType, Buffer.alloc(0), nonce)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          moveAccount: movePDA,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
          .signers([player1])
          .rpc();
        
        expect.fail("Should have thrown InvalidAction error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidAction");
      }
    });

    it("Fails to submit move with user_id too long", async function() {
      if (!shouldRunTest('error')) {
        this.skip();
        return;
      }
      
      const matchId = generateUniqueMatchId("long-userid");
      const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

      // user_id > 64 chars (invalid - test data has valid user IDs)
      const longUserId = "a".repeat(65);
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(matchId, player1.publicKey, nonce);

      try {
        await program.methods
          .submitMove(matchId, longUserId, 2, Buffer.from([0]), nonce)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          moveAccount: movePDA,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
          .signers([player1])
          .rpc();
        
        expect.fail("Should have thrown InvalidPayload error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidPayload");
      }
    });
  });

  describe("Player Not In Match", () => {
    it("Fails to submit move when player not in match", async function() {
      if (!shouldRunTest('error')) {
        this.skip();
        return;
      }
      
      const matchId = generateUniqueMatchId("not-in-match");
      const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

      // Use a user ID that doesn't exist in test data
      const userId = "user-invalid-999"; // Not in match
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(matchId, player3.publicKey, nonce);

      try {
        await program.methods
          .submitMove(matchId, userId, 2, Buffer.from([0]), nonce)
          .accounts({
            matchAccount: matchPDA,
            registry: registryPDA,
            moveAccount: movePDA,
            player: player3.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .signers([player3])
          .rpc();
        
        expect.fail("Should have thrown PlayerNotInMatch error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("PlayerNotInMatch");
      }
    });
  });

  describe("Match State Validation", () => {
    it("Fails to submit move when match ended", async function() {
      if (!shouldRunTest('error')) {
        this.skip();
        return;
      }
      
      const matchId = generateUniqueMatchId("ended-match");
      const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

      // End the match
      const matchHash = getTestMatchHash();
      const hotUrl = getTestHotUrl();
      await program.methods
        .endMatch(matchId, Array.from(matchHash), hotUrl)
        .accounts({
          matchAccount: matchPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      // Try to submit move after match ended
      const userId = getTestUserId(0);
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(matchId, player1.publicKey, nonce);

      try {
        await program.methods
          .submitMove(matchId, userId, 2, Buffer.from([0]), nonce)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          moveAccount: movePDA,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
          .signers([player1])
          .rpc();
        
        expect.fail("Should have thrown MatchAlreadyEnded error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("MatchAlreadyEnded");
      }
    });
  });
});

