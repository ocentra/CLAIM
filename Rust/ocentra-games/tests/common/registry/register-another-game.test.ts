/**
 * Test: Can register another game
 * Category: REGISTRY
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { SystemProgram } from "@solana/web3.js";

class RegisterAnotherGameTest extends BaseTest {
  constructor() {
    super({
      id: 'register-another-game',
      name: 'Can register another game',
      description: 'Verifies that multiple games can be registered in the registry',
      tags: {
        category: TestCategory.REGISTRY,
        cluster: ClusterRequirement.ANY,
        requiresSetup: true,
      },
    });
  }

  async run(): Promise<void> {
    const { program, authority, getRegistryPDA } = await import('@/helpers');
    const [registryPDA] = await getRegistryPDA();
    
    const registryBefore = await program.account.gameRegistry.fetch(registryPDA);
    const countBefore = registryBefore.gameCount;
    
    const gameId = 98; // Different game_id
    const gameName = "TestGame2";
    
    await program.methods
      .registerGame(gameId, gameName, 2, 6, "https://rules.example.com/test2", 1)
      .accounts({
        registry: registryPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();
    
    const registryAfter = await program.account.gameRegistry.fetch(registryPDA);
    this.assertEqual(registryAfter.gameCount, countBefore + 1, 
      `Game count should increase from ${countBefore} to ${countBefore + 1}, got ${registryAfter.gameCount}`);
  }
}

const testInstance = new RegisterAnotherGameTest();
registerMochaTest(testInstance);

