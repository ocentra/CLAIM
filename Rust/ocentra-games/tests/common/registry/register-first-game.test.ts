/**
 * Test: Can register first game (creates registry)
 * Category: REGISTRY
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { SystemProgram } from "@solana/web3.js";

class RegisterFirstGameTest extends BaseTest {
  constructor() {
    super({
      id: 'register-first-game',
      name: 'Can register first game (creates registry)',
      description: 'Verifies that registering the first game auto-creates the registry',
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
    
    const gameId = 99; // Use high number to avoid conflicts
    const gameName = "TestGame";
    const minPlayers = 2;
    const maxPlayers = 4;
    const ruleUrl = "https://rules.example.com/test";
    const version = 1;
    
    await program.methods
      .registerGame(gameId, gameName, minPlayers, maxPlayers, ruleUrl, version)
      .accounts({
        registry: registryPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();
    
    // Verify registry was created
    const registry = await program.account.gameRegistry.fetch(registryPDA);
    this.assert(registry.gameCount > 0, `Registry should have games, got ${registry.gameCount}`);
  }
}

const testInstance = new RegisterFirstGameTest();
registerMochaTest(testInstance);

