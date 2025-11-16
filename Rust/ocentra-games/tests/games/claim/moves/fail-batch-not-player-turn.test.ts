/**
 * Test: Fails to submit batch moves when not player's turn
 * Category: MOVES (CLAIM-specific)
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

class FailBatchNotPlayerTurnTest extends BaseTest {
  constructor() {
    super({
      id: 'fail-batch-not-player-turn',
      name: 'Fails to submit batch moves when not player\'s turn',
      description: 'Verifies that submitting batch moves when it\'s not the player\'s turn fails',
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
      player2,
      generateUniqueMatchId,
      getTestUserId,
      getBatchMovePDA,
      createStartedMatch,
      submitBatchMovesManual,
      AnchorError: AnchorErrorType,
    } = await import('@/helpers');

    const testMatchId = generateUniqueMatchId("batch-test");
    const [testMatchPDA, registryPDA] = await createStartedMatch(testMatchId, 2);

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

    const moveAccountPDAs: [PublicKey, PublicKey, PublicKey, PublicKey, PublicKey] = [
      movePDA0,
      movePDA0,
      movePDA0,
      movePDA0,
      movePDA0,
    ];

    try {
      await submitBatchMovesManual(
        testMatchId,
        userId,
        moves,
        testMatchPDA,
        registryPDA,
        moveAccountPDAs,
        player2
      );
      
      this.assert(false, 'Should have thrown NotPlayerTurn error');
    } catch (err: unknown) {
      if (!this.isAnchorError(err)) {
        throw new Error(`Expected AnchorError, got ${err?.constructor?.name}: ${err}`);
      }
      const errorCode = this.getErrorCode(err);
      this.assertEqual(errorCode, "NotPlayerTurn");
    }
  }
}

const testInstance = new FailBatchNotPlayerTurnTest();
registerMochaTest(testInstance);

