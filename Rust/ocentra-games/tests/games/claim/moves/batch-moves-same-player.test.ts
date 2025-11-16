/**
 * Test: Can submit batch moves from same player in their turn
 * Category: MOVES (CLAIM-specific)
 */

import { BaseTest, TestCategory, ClusterRequirement, registerMochaTest } from '@/core';
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

class BatchMovesSamePlayerTest extends BaseTest {
  constructor() {
    super({
      id: 'batch-moves-same-player',
      name: 'Can submit batch moves from same player in their turn',
      description: 'Verifies that a player can submit multiple moves in a batch during their turn',
      tags: {
        category: TestCategory.MOVES,
        cluster: ClusterRequirement.ANY,
        game: 'claim',
        requiresSetup: true,
        requiresRegistry: true,
      },
    });
  }

  async run(): Promise<void> {
    const {
      program,
      player1,
      generateUniqueMatchId,
      getTestUserId,
      getBatchMovePDA,
      createStartedMatch,
      submitBatchMovesManual,
    } = await import('@/helpers');

    const testMatchId = generateUniqueMatchId("batch-test");
    const [testMatchPDA, registryPDA] = await createStartedMatch(testMatchId, 2);

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

    // Get move PDAs using correct indices (0-4) as Rust expects
    // Rust uses hardcoded indices 0-4 in the Anchor account constraints for move_account_0 through move_account_4
    // For 2 moves, we use indices 0 and 1; remaining 3 are dummy PDAs (not used but required by type)
    const [movePDA0] = await getBatchMovePDA(testMatchId, player1.publicKey, 0);
    const [movePDA1] = await getBatchMovePDA(testMatchId, player1.publicKey, 1);
    const [movePDA2] = await getBatchMovePDA(testMatchId, player1.publicKey, 2); // Dummy
    const [movePDA3] = await getBatchMovePDA(testMatchId, player1.publicKey, 3); // Dummy
    const [movePDA4] = await getBatchMovePDA(testMatchId, player1.publicKey, 4); // Dummy

    const moveAccountPDAs: [PublicKey, PublicKey, PublicKey, PublicKey, PublicKey] = [
      movePDA0,
      movePDA1,
      movePDA2, // Dummy (not used for this batch)
      movePDA3, // Dummy (not used for this batch)
      movePDA4, // Dummy (not used for this batch)
    ];

    await submitBatchMovesManual(
      testMatchId,
      userId,
      moves,
      testMatchPDA,
      registryPDA,
      moveAccountPDAs,
      player1
    );

    const matchAccount = await program.account.match.fetch(testMatchPDA);
    this.assertEqual(matchAccount.moveCount, 2);
  }
}

const testInstance = new BatchMovesSamePlayerTest();
registerMochaTest(testInstance);

