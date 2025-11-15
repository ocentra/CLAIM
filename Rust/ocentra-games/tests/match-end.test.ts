import { expect } from "chai";
import {
  program,
  authority,
  generateUniqueMatchId,
  getTestGame,
  getTestSeed,
  getTestMatchHash,
  getTestHotUrl,
  getMatchPDA,
  getRegistryPDA,
  setupGameRegistry,
  initializeTestAccounts,
  conditionalDescribe,
  TEST_FLAGS,
  type AnchorError,
} from "./helpers";
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

conditionalDescribe("Match End", function() {
  before(async function() {
    await initializeTestAccounts();
    await setupGameRegistry();
  });

  describe("End Match", () => {
    it("Can end match", async () => {
      const matchId = generateUniqueMatchId("end-test");
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

      // Join 2 players and start match (required: endMatch needs phase 1 or 2)
      const { player1, player2, getTestUserId } = await import("./helpers");
      await program.methods
        .joinMatch(matchId, getTestUserId(0))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(matchId, getTestUserId(1))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      // Start match (transitions to phase 1 - PLAYING)
      await program.methods
        .startMatch(matchId)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      const matchHash = getTestMatchHash();
      const hotUrl = getTestHotUrl();

      // Now can end match (phase 1 -> phase 2)
      await program.methods
        .endMatch(matchId, Array.from(matchHash), hotUrl)
        .accounts({
          matchAccount: matchPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      const matchAccount = await program.account.match.fetch(matchPDA);
      expect(matchAccount.phase).to.equal(2); // Ended
      expect(matchAccount.endedAt.toNumber()).to.not.equal(0);
    });

    it("Fails to end match when already ended", async () => {
      const matchId = generateUniqueMatchId("end-twice");
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

      // Join 2 players and start match
      const { player1, player2, getTestUserId } = await import("./helpers");
      await program.methods
        .joinMatch(matchId, getTestUserId(0))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(matchId, getTestUserId(1))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      await program.methods
        .startMatch(matchId)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      const matchHash = getTestMatchHash();
      const hotUrl = getTestHotUrl();

      // End match once (phase 1 -> phase 2)
      await program.methods
        .endMatch(matchId, Array.from(matchHash), hotUrl)
        .accounts({
          matchAccount: matchPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      // Try to end again
      try {
        await program.methods
          .endMatch(matchId, Array.from(matchHash), hotUrl)
          .accounts({
            matchAccount: matchPDA,
            authority: authority.publicKey,
          } as never)
          .rpc();
        
        expect.fail("Should have thrown MatchAlreadyEnded error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("MatchAlreadyEnded");
      }
    });
  });

  describe("Anchor Match Record", () => {
    it("Can anchor match record", async () => {
      const matchId = generateUniqueMatchId("anchor-test");
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

      // Join 2 players and start match
      const { player1, player2, getTestUserId } = await import("./helpers");
      await program.methods
        .joinMatch(matchId, getTestUserId(0))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(matchId, getTestUserId(1))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      await program.methods
        .startMatch(matchId)
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      // End match first (required: anchorMatchRecord needs phase 2)
      const matchHash = getTestMatchHash();
      const hotUrl = getTestHotUrl();

      await program.methods
        .endMatch(matchId, Array.from(matchHash), hotUrl)
        .accounts({
          matchAccount: matchPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      // Now can anchor match record (phase 2)
      await program.methods
        .anchorMatchRecord(matchId, Array.from(matchHash), hotUrl)
        .accounts({
          matchAccount: matchPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      const matchAccount = await program.account.match.fetch(matchPDA);
      // anchor_match_record sets match_hash field (camelCase: matchHash)
      // Check that hash is not all zeros
      const hashArray = Array.from(matchAccount.matchHash);
      const hasNonZero = hashArray.some(b => b !== 0);
      void expect(hasNonZero).to.be.true;
    });
  });
});

