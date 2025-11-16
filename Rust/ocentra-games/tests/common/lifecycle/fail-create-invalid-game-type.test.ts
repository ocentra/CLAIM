/**
 * Test: Fails to create match with invalid game_type
 * Category: LIFECYCLE
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { AnchorError } from '@/helpers';

class FailCreateInvalidGameTypeTest extends BaseTest {
  constructor() {
    super({
      id: 'fail-create-invalid-game-type',
      name: 'Fails to create match with invalid game_type',
      description: 'Verifies that creating a match with an unregistered game_type fails',
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
      generateUniqueMatchId,
      getTestSeed,
      getMatchPDA,
      getRegistryPDA,
    } = await import('@/helpers');

    const matchId = generateUniqueMatchId("invalid-game");
    const invalidGameType = 255;
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

      this.assert(false, 'Should have thrown InvalidPayload error');
    } catch (err: unknown) {
      const error = err as AnchorError;
      this.assertEqual(error.error?.errorCode?.code, "InvalidPayload");
    }
  }
}

const testInstance = new FailCreateInvalidGameTypeTest();
registerMochaTest(testInstance);

