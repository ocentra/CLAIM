/**
 * Test: Players can join match
 * Category: LIFECYCLE
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

class PlayersJoinMatchTest extends BaseTest {
  constructor() {
    super({
      id: 'players-join-match',
      name: 'Players can join match',
      description: 'Verifies that players can join a match',
      tags: {
        category: TestCategory.LIFECYCLE,
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
      player2,
      generateUniqueMatchId,
      getTestGame,
      getTestSeed,
      getTestUserId,
      getMatchPDA,
      getRegistryPDA,
    } = await import('@/helpers');

    const testMatchId = generateUniqueMatchId("join-test");
    const [matchPDA] = await getMatchPDA(testMatchId);
    const [registryPDA] = await getRegistryPDA();
    const claimGame = getTestGame(0);
    if (!claimGame) throw new Error("CLAIM game not found in test data");
    const seed = getTestSeed();

    // Create match
    await program.methods
      .createMatch(testMatchId, claimGame.game_id, new anchor.BN(seed))
      .accounts({
        matchAccount: matchPDA,
        registry: registryPDA,
        authority: (await import('@/helpers')).authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();

    // Join players
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

    const matchAccount = await program.account.match.fetch(matchPDA);
    this.assertEqual(matchAccount.playerCount, 2);
  }
}

const testInstance = new PlayersJoinMatchTest();
registerMochaTest(testInstance);

