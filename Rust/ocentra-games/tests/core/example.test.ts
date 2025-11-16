/**
 * Example Test File
 * 
 * This demonstrates the test pattern that all tests must follow.
 * Each test file should:
 * 1. Extend BaseTest
 * 2. Define metadata with category, tags, and requirements
 * 3. Implement the run() method
 * 4. Auto-register on construction
 * 
 * File naming: <test-name>.test.ts (e.g., creates-claim-match.test.ts)
 */

import { BaseTest } from './base';
import { TestCategory, ClusterRequirement } from './types';

/**
 * Example test: Creates a CLAIM match with proper UUID
 * 
 * Pattern:
 * 1. Class name should be descriptive (e.g., CreatesClaimMatchTest)
 * 2. Extend BaseTest to get common functionality
 * 3. Instantiate once at module level - auto-registers
 * 4. Implement run() method with test logic
 */
class CreatesClaimMatchTest extends BaseTest {
  constructor() {
    super({
      id: 'creates-claim-match',  // Unique ID (matches file name)
      name: 'Creates a CLAIM match with proper UUID',
      description: 'Verifies that a CLAIM match can be created with a valid UUID',
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
    // Import helpers dynamically to avoid circular dependencies
    const {
      generateUniqueMatchId,
      getTestGame,
      getTestSeed,
      getMatchPDA,
      getRegistryPDA,
    } = await import('@/helpers');
    const { program, authority } = await import('@/helpers');
    const { SystemProgram } = await import('@solana/web3.js');
    const anchor = await import('@coral-xyz/anchor');

    const matchId = generateUniqueMatchId('create-test');
    const claimGame = getTestGame(0);
    if (!claimGame) throw new Error('CLAIM game not found in test data');
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
    const matchIdStr = Array.from(matchAccount.matchId)
      .map((b) => String.fromCharCode(b))
      .join('')
      .replace(/\0/g, '')
      .substring(0, 36);
    
    this.assertEqual(matchIdStr, matchId);
    this.assertEqual(matchAccount.gameType, claimGame.game_id);
    this.assertEqual(matchAccount.seed, seed);
    this.assertEqual(matchAccount.phase, 0); // Dealing phase
    this.assertEqual(matchAccount.playerCount, 0);
  }
}

// Instantiate the test class (auto-registers with test registry)
const testInstance = new CreatesClaimMatchTest();

// Register with Mocha for discovery (creates describe/it blocks automatically)
import { registerMochaTest } from '@/core';
registerMochaTest(testInstance);

