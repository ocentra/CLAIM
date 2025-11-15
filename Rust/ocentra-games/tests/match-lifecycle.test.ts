import { expect } from "chai";
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  program,
  authority,
  player1,
  player2,
  player3,
  player4,
  generateUniqueMatchId,
  getTestSeed,
  getTestUserId,
  getTestGame,
  getMatchPDA,
  getRegistryPDA,
  setupGameRegistry,
  initializeTestAccounts,
  conditionalDescribe,
  TEST_FLAGS,
  type AnchorError,
} from "./helpers";

conditionalDescribe("Match Lifecycle", function() {
  before(async function() {
    await initializeTestAccounts();
    await setupGameRegistry();
  });

  describe("Create Match", () => {
    it("Creates a CLAIM match with proper UUID", async () => {
      const matchId = generateUniqueMatchId("create-test");
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();
      
      const [matchPDA] = await getMatchPDA(matchId);
      const [registryPDA] = await getRegistryPDA();

      await program.methods
        .createMatch(matchId, claimGame.game_id, new anchor.BN(seed))
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
      expect(matchAccount.gameType).to.equal(claimGame.game_id);
      expect(matchAccount.seed).to.equal(seed);
      expect(matchAccount.phase).to.equal(0); // Dealing phase
      expect(matchAccount.playerCount).to.equal(0);
    });

    it("Fails to create match with invalid game_type", async () => {
      const matchId = generateUniqueMatchId("invalid-game");
      const invalidGameType = 255; // Not registered
      const seed = getTestSeed();
      
      const [matchPDA] = await getMatchPDA(matchId);
      const [registryPDA] = await getRegistryPDA();

      try {
        await program.methods
          .createMatch(matchId, invalidGameType, new anchor.BN(seed))
          .accounts({
            matchAccount: matchPDA,
            registry: registryPDA,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .rpc();
        
        expect.fail("Should have thrown InvalidPayload error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidPayload");
      }
    });

    it("Fails to create match with invalid match_id length", async () => {
      const invalidMatchId = "too-short"; // Not 36 chars
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();
      const [matchPDA] = await getMatchPDA(invalidMatchId);
      const [registryPDA] = await getRegistryPDA();

      try {
        await program.methods
          .createMatch(invalidMatchId, claimGame.game_id, new anchor.BN(seed))
          .accounts({
            matchAccount: matchPDA,
            registry: registryPDA,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .rpc();
        
        expect.fail("Should have thrown InvalidPayload error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidPayload");
      }
    });
  });

  describe("Join Match", () => {
    let testMatchId: string;
    let testMatchPDA: anchor.web3.PublicKey;

    beforeEach(async () => {
      testMatchId = generateUniqueMatchId("join-test");
      const [matchPDA] = await getMatchPDA(testMatchId);
      testMatchPDA = matchPDA;
      const [registryPDA] = await getRegistryPDA();
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();

      await program.methods
        .createMatch(testMatchId, claimGame.game_id, new anchor.BN(seed))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();
    });

    it("Players can join match", async () => {
      const [registryPDA] = await getRegistryPDA();

      await program.methods
        .joinMatch(testMatchId, getTestUserId(0))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(testMatchId, getTestUserId(1))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      const matchAccount = await program.account.match.fetch(testMatchPDA);
      expect(matchAccount.playerCount).to.equal(2);
    });

    it("Fails to join match when full", async () => {
      const [registryPDA] = await getRegistryPDA();

      // Join 4 players (max for CLAIM)
      const players = [player1, player2, player3, player4];
      for (let i = 0; i < 4; i++) {
        await program.methods
          .joinMatch(testMatchId, getTestUserId(i))
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            player: players[i].publicKey,
          } as never)
          .signers([players[i]])
          .rpc();
      }

      // Try to join 5th player (use a user ID that doesn't exist in test data)
      const player5 = anchor.web3.Keypair.generate();
      try {
        await program.methods
          .joinMatch(testMatchId, "user-invalid-999")
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            player: player5.publicKey,
          } as never)
          .signers([player5])
          .rpc();
        
        expect.fail("Should have thrown MatchFull error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("MatchFull");
      }
    });

    it("Fails to join match in wrong phase", async () => {
      const [registryPDA] = await getRegistryPDA();

      // Join only 2 players (leave room for player3, but we'll start match first)
      await program.methods
        .joinMatch(testMatchId, getTestUserId(0))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(testMatchId, getTestUserId(1))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      // Start match (transitions to phase 1 - PLAYING)
      await program.methods
        .startMatch(testMatchId)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      // Verify match is in phase 1 (PLAYING)
      const matchBefore = await program.account.match.fetch(testMatchPDA);
      expect(matchBefore.phase).to.equal(1);
      expect(matchBefore.playerCount).to.equal(2); // Not full (max is 4 for CLAIM)

      // Try to join after match started (should fail with InvalidPhase, not MatchFull)
      try {
        await program.methods
          .joinMatch(testMatchId, getTestUserId(2))
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            player: player3.publicKey,
          } as never)
          .signers([player3])
          .rpc();
        
        expect.fail("Should have thrown InvalidPhase error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        // Should be InvalidPhase because match is in phase 1, not phase 0
        expect(error.error?.errorCode?.code).to.equal("InvalidPhase");
      }
    });
  });

  describe("Start Match", () => {
    let testMatchId: string;
    let testMatchPDA: anchor.web3.PublicKey;

    beforeEach(async () => {
      testMatchId = generateUniqueMatchId("start-test");
      const [matchPDA] = await getMatchPDA(testMatchId);
      testMatchPDA = matchPDA;
      const [registryPDA] = await getRegistryPDA();
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();

      await program.methods
        .createMatch(testMatchId, claimGame.game_id, new anchor.BN(seed))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();
    });

    it("Can start match with minimum players", async () => {
      const [registryPDA] = await getRegistryPDA();

      // Join 2 players (minimum for CLAIM)
      await program.methods
        .joinMatch(testMatchId, getTestUserId(0))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(testMatchId, getTestUserId(1))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      // Start match
      await program.methods
        .startMatch(testMatchId)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      const matchAccount = await program.account.match.fetch(testMatchPDA);
      expect(matchAccount.phase).to.equal(1); // Playing phase
    });

    it("Fails to start match with insufficient players", async () => {
      const [registryPDA] = await getRegistryPDA();

      // Join only 1 player (minimum is 2)
      await program.methods
        .joinMatch(testMatchId, getTestUserId(0))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      try {
        await program.methods
          .startMatch(testMatchId)
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            authority: authority.publicKey,
          } as never)
          .rpc();
        
        expect.fail("Should have thrown InsufficientPlayers error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InsufficientPlayers");
      }
    });

    it("Fails to start match when already started", async () => {
      const [registryPDA] = await getRegistryPDA();

      // Join and start
      await program.methods
        .joinMatch(testMatchId, getTestUserId(0))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(testMatchId, getTestUserId(1))
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      await program.methods
        .startMatch(testMatchId)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
        } as never)
        .rpc();

      // Try to start again
      try {
        await program.methods
          .startMatch(testMatchId)
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            authority: authority.publicKey,
          } as never)
          .rpc();
        
        expect.fail("Should have thrown InvalidPhase error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidPhase");
      }
    });
  });
});

