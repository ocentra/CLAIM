/**
 * Test: Fails to create match with invalid match_id length
 * Category: LIFECYCLE
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { AnchorError } from '@/helpers';

class FailCreateInvalidMatchIdTest extends BaseTest {
  constructor() {
    super({
      id: 'fail-create-invalid-match-id',
      name: 'Fails to create match with invalid match_id length',
      description: 'Verifies that creating a match with invalid match_id length fails',
      tags: {
        category: TestCategory.LIFECYCLE,
        cluster: ClusterRequirement.ANY,
        requiresSetup: true,
        requiresRegistry: true,
      },
    });
  }

  async run(): Promise<void> {
    const {
      program,
      authority,
      getTestGame,
      getTestSeed,
      getMatchPDA,
      getRegistryPDA,
    } = await import('@/helpers');

    const invalidMatchId = "too-short";
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

      this.assert(false, 'Should have thrown InvalidPayload error');
    } catch (err: unknown) {
      const error = err as AnchorError;
      this.assertEqual(error.error?.errorCode?.code, "InvalidPayload");
    }
  }
}

const testInstance = new FailCreateInvalidMatchIdTest();
registerMochaTest(testInstance);

