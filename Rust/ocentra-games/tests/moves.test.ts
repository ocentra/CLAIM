import { expect } from "chai";
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  program,
  authority,
  player1,
  player2,
  generateUniqueMatchId,
  getTestUserId,
  getTestGame,
  getTestSeed,
  getTestMatchHash,
  getMatchPDA,
  getRegistryPDA,
  getMovePDA,
  getBatchMovePDA,
  createStartedMatch,
  setupGameRegistry,
  initializeTestAccounts,
  conditionalDescribe,
  type AnchorError,
} from "./helpers";

conditionalDescribe("Moves", function() {
  before(async function() {
    await initializeTestAccounts();
    await setupGameRegistry();
  });

  describe("Submit Move", () => {
    let testMatchId: string;
    let testMatchPDA: anchor.web3.PublicKey;
    let registryPDA: anchor.web3.PublicKey;

    beforeEach(async () => {
      testMatchId = generateUniqueMatchId("moves-test");
      const [matchPDA, regPDA] = await createStartedMatch(testMatchId, 2);
      testMatchPDA = matchPDA;
      registryPDA = regPDA;
    });

    it("Player can declare intent", async () => {
      const userId = getTestUserId(0);
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(testMatchId, player1.publicKey, nonce);

      const actionType = 2; // declare_intent
      const payload = Buffer.from([0]); // spades

      await program.methods
        .submitMove(testMatchId, userId, actionType, payload, nonce)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          moveAccount: movePDA,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .signers([player1])
        .rpc();

      const moveAccount = await program.account.move.fetch(movePDA);
      expect(moveAccount.actionType).to.equal(actionType);
      expect(moveAccount.moveIndex).to.be.a('number');
    });

    it("Fails to submit move when not player's turn", async () => {
      const userId = getTestUserId(1);
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(testMatchId, player2.publicKey, nonce);

      // current_player is 0 (player1), but player2 tries to move
      const actionType = 2;
      const payload = Buffer.from([0]); // spades

      try {
        await program.methods
          .submitMove(testMatchId, userId, actionType, payload, nonce)
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            moveAccount: movePDA,
            player: player2.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .signers([player2])
          .rpc();
        
        expect.fail("Should have thrown NotPlayerTurn error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("NotPlayerTurn");
      }
    });

    it("Fails to submit move with invalid nonce (replay attack)", async () => {
      const userId = getTestUserId(0);
      const nonce = new anchor.BN(Date.now());
      const [movePDA] = await getMovePDA(testMatchId, player1.publicKey, nonce);

      const actionType = 2;
      const payload = Buffer.from([0]);

      // First move succeeds
      await program.methods
        .submitMove(testMatchId, userId, actionType, payload, nonce)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          moveAccount: movePDA,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .signers([player1])
        .rpc();

      // Try to replay with same nonce
      const [movePDA2] = await getMovePDA(testMatchId, player1.publicKey, nonce);
      try {
        await program.methods
          .submitMove(testMatchId, userId, actionType, payload, nonce)
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            moveAccount: movePDA2,
            player: player1.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .signers([player1])
          .rpc();
        
        expect.fail("Should have thrown InvalidNonce error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidNonce");
      }
    });

    it("Fails to submit move in wrong phase", async () => {
      const matchId = generateUniqueMatchId("wrong-phase");
      const [matchPDA] = await getMatchPDA(matchId);
      const [registryPDA] = await getRegistryPDA();
      const claimGame = getTestGame(0);
      if (!claimGame) throw new Error("CLAIM game not found in test data");
      const seed = getTestSeed();

      // Create match but don't start it
      await program.methods
        .createMatch(matchId, claimGame.game_id, new anchor.BN(seed))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();

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
        
        expect.fail("Should have thrown InvalidPhase error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("InvalidPhase");
      }
    });

    it("Player can call showdown", async () => {
      const userId = getTestUserId(0);
      const nonce1 = new anchor.BN(Date.now());
      const nonce2 = new anchor.BN(Date.now() + 1);

      // Declare intent first
      const [movePDA1] = await getMovePDA(testMatchId, player1.publicKey, nonce1);
      await program.methods
        .submitMove(testMatchId, userId, 2, Buffer.from([0]), nonce1)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          moveAccount: movePDA1,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .signers([player1])
        .rpc();

      // Call showdown
      const [movePDA2] = await getMovePDA(testMatchId, player1.publicKey, nonce2);
      await program.methods
        .submitMove(testMatchId, userId, 3, Buffer.alloc(0), nonce2)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          moveAccount: movePDA2,
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .signers([player1])
        .rpc();

      const matchAccount = await program.account.match.fetch(testMatchPDA);
      expect(matchAccount.phase).to.equal(2); // Ended
    });
  });

  describe("Submit Batch Moves", () => {
    let testMatchId: string;
    let testMatchPDA: anchor.web3.PublicKey;
    let registryPDA: anchor.web3.PublicKey;

    beforeEach(async () => {
      testMatchId = generateUniqueMatchId("batch-test");
      const [matchPDA, regPDA] = await createStartedMatch(testMatchId, 2);
      testMatchPDA = matchPDA;
      registryPDA = regPDA;
    });

    it("Can submit batch moves from same player in their turn", async () => {
      const userId = getTestUserId(0);
      const baseNonce = Date.now();

      const moves = [
        {
          actionType: 2, // declare_intent
          payload: Buffer.from([0]), // spades
          nonce: new anchor.BN(baseNonce),
        },
        {
          actionType: 0, // pick_up
          payload: Buffer.alloc(0),
          nonce: new anchor.BN(baseNonce + 1),
        },
      ];

      // Get move PDAs (batch uses indexed seeds)
      const [movePDA0] = await getBatchMovePDA(testMatchId, player1.publicKey, 0);
      const [movePDA1] = await getBatchMovePDA(testMatchId, player1.publicKey, 1);

      await program.methods
        .submitBatchMoves(testMatchId, userId, moves)
        .accounts({
          matchAccount: testMatchPDA,
          registry: registryPDA,
          moveAccount0: movePDA0,
          moveAccount1: movePDA1,
          moveAccount2: movePDA0, // Dummy (won't be used)
          moveAccount3: movePDA0, // Dummy
          moveAccount4: movePDA0, // Dummy
          player: player1.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .signers([player1])
        .rpc();

      const matchAccount = await program.account.match.fetch(testMatchPDA);
      expect(matchAccount.moveCount).to.equal(2);
    });

    it("Fails to submit batch moves when not player's turn", async () => {
      const userId = getTestUserId(1);
      const baseNonce = Date.now();

      const moves = [
        {
          actionType: 2,
          payload: Buffer.from([0]),
          nonce: new anchor.BN(baseNonce),
        },
      ];

      const [movePDA0] = await getBatchMovePDA(testMatchId, player2.publicKey, 0);

      try {
        await program.methods
          .submitBatchMoves(testMatchId, userId, moves)
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            moveAccount0: movePDA0,
            moveAccount1: movePDA0,
            moveAccount2: movePDA0,
            moveAccount3: movePDA0,
            moveAccount4: movePDA0,
            player: player2.publicKey,
            systemProgram: SystemProgram.programId,
          } as never)
          .signers([player2])
          .rpc();
        
        expect.fail("Should have thrown NotPlayerTurn error");
      } catch (err: unknown) {
        const error = err as AnchorError;
        expect(error.error?.errorCode?.code).to.equal("NotPlayerTurn");
      }
    });

    it("Fails to submit empty batch", async () => {
      const userId = getTestUserId(0);
      const moves: Array<{ actionType: number; payload: Buffer; nonce: anchor.BN }> = [];

      const [movePDA0] = await getBatchMovePDA(testMatchId, player1.publicKey, 0);

      try {
        await program.methods
          .submitBatchMoves(testMatchId, userId, moves)
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            moveAccount0: movePDA0,
            moveAccount1: movePDA0,
            moveAccount2: movePDA0,
            moveAccount3: movePDA0,
            moveAccount4: movePDA0,
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

    it("Fails to submit batch with more than 5 moves", async () => {
      const userId = getTestUserId(0);
      const baseNonce = Date.now();

      const moves = Array.from({ length: 6 }, (_, i) => ({
        actionType: 2,
        payload: Buffer.from([0]),
        nonce: new anchor.BN(baseNonce + i),
      }));

      const [movePDA0] = await getBatchMovePDA(testMatchId, player1.publicKey, 0);

      try {
        await program.methods
          .submitBatchMoves(testMatchId, userId, moves)
          .accounts({
            matchAccount: testMatchPDA,
            registry: registryPDA,
            moveAccount0: movePDA0,
            moveAccount1: movePDA0,
            moveAccount2: movePDA0,
            moveAccount3: movePDA0,
            moveAccount4: movePDA0,
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

  describe("Commit Hand", () => {
    let testMatchId: string;
    let testMatchPDA: anchor.web3.PublicKey;

    beforeEach(async () => {
      testMatchId = generateUniqueMatchId("commit-test");
      // Create match but DON'T start it (commitHand requires phase 0 - DEALING)
      const [matchPDA] = await getMatchPDA(testMatchId);
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

      // Join 2 players (but don't start - stay in phase 0)
      await program.methods
        .joinMatch(testMatchId, getTestUserId(0))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      await program.methods
        .joinMatch(testMatchId, getTestUserId(1))
        .accounts({
          matchAccount: matchPDA,
          registry: registryPDA,
          player: player2.publicKey,
        } as never)
        .signers([player2])
        .rpc();

      testMatchPDA = matchPDA;
    });

    it("Can commit hand hash", async () => {
      // Use real match hash from test data (deterministic)
      const handHash = getTestMatchHash();
      const handSize = 13; // Standard hand size for CLAIM

      await program.methods
        .commitHand(testMatchId, getTestUserId(0), Array.from(handHash), handSize)
        .accounts({
          matchAccount: testMatchPDA,
          player: player1.publicKey,
        } as never)
        .signers([player1])
        .rpc();

      const matchAccount = await program.account.match.fetch(testMatchPDA);
      // Verify hand was committed (check committed_hand_hashes field)
      // committed_hand_hashes is a flat array: [player0_hash(32) | player1_hash(32) | ...]
      // For player 0, check first 32 bytes are not all zeros
      const committedHashes = matchAccount.committedHandHashes;
      const player0Hash = Array.from(committedHashes.slice(0, 32));
      const hasNonZero = player0Hash.some(b => b !== 0);
      void expect(hasNonZero).to.be.true;
    });
  });
});

