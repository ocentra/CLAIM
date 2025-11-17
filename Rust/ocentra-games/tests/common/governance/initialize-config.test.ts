/**
 * Test: Can initialize ConfigAccount
 * Category: GOVERNANCE
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { SystemProgram } from "@solana/web3.js";
import { getConfigAccountPDA } from '@/common';

class InitializeConfigTest extends BaseTest {
  constructor() {
    super({
      id: 'initialize-config',
      name: 'Can initialize ConfigAccount',
      description: 'Verifies that ConfigAccount can be initialized with treasury multisig',
      tags: {
        category: TestCategory.REGISTRY, // Using REGISTRY category for now
        cluster: ClusterRequirement.ANY,
        requiresSetup: true,
      },
    });
  }

  async run(): Promise<void> {
    const { program, authority } = await import('@/helpers');
    const [configPDA] = await getConfigAccountPDA();
    
    // Use authority as treasury multisig for testing (in real scenario, this would be a Squads multisig)
    const treasuryMultisig = authority.publicKey;
    
    // Initialize config account (skip if already initialized)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (program.methods as any)
        .initializeConfig(treasuryMultisig)
        .accounts({
          configAccount: configPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();
    } catch (err: unknown) {
      const error = err as { message?: string };
      // If account already exists, that's fine - just verify it's correct
      if (!error.message?.includes("already in use") && !error.message?.includes("0x0")) {
        throw err;
      }
      // Account already initialized, continue to verification
    }
    
    // Verify config was initialized
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = await program.account.configAccount.fetch(configPDA) as any;
    this.assertTruthy(config, 'Config should exist');
    this.assert(
      config.treasuryMultisig.equals(treasuryMultisig),
      `Treasury multisig should be ${treasuryMultisig.toString()}, got ${config.treasuryMultisig.toString()}`
    );
    this.assertEqual(config.isPaused, false, 'isPaused should be false');
    this.assertEqual(config.platformFeeBps, 500, 'platformFeeBps should be 500 (5%)');
    this.assertEqual(config.minEntryFee.toNumber(), 10000, 'minEntryFee should be 10000 lamports');
    this.assertEqual(config.maxEntryFee.toNumber(), 100_000_000_000, 'maxEntryFee should be 100 SOL');
  }
}

const testInstance = new InitializeConfigTest();
registerMochaTest(testInstance);

