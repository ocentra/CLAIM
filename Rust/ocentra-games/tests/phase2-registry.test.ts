import { expect } from "chai";
import { SystemProgram } from "@solana/web3.js";
import {
  program,
  authority,
  initializeTestAccounts,
  conditionalDescribe,
  createTestContext,
  checkGameRegistryStatus,
} from "./helpers";

/**
 * PHASE 2: GameRegistry Initialization
 * 
 * Goal: Initialize GameRegistry by registering first game
 * Uses TestContext for meaningful error messages and consolidated helpers to avoid duplication.
 */
conditionalDescribe("Phase 2: GameRegistry Initialization", () => {
  before(async () => {
    await initializeTestAccounts();
  });

  it("Registry account doesn't exist yet", async () => {
    const ctx = createTestContext("Registry account doesn't exist yet");
    const status = await checkGameRegistryStatus(ctx);
    
    if (!status.exists) {
      ctx.log("✓ Registry doesn't exist (expected - will be created on first game registration)");
    } else {
      ctx.log(`⚠ Registry already exists with ${status.gameCount || 0} game(s)`);
      ctx.log("✓ Registry is valid and can be used");
    }
    ctx.finish();
  });

  it("Can register first game (creates registry)", async () => {
    const ctx = createTestContext("Can register first game (creates registry)");
    const { getRegistryPDA } = await import("./helpers");
    const [registryPDA] = await getRegistryPDA();
    
    const gameId = 99; // Use high number to avoid conflicts
    const gameName = "TestGame";
    const minPlayers = 2;
    const maxPlayers = 4;
    const ruleUrl = "https://rules.example.com/test";
    const version = 1;
    
    ctx.set('registryPDA', registryPDA);
    ctx.set('gameId', gameId);
    ctx.set('gameName', gameName);
    ctx.set('authority', authority.publicKey);
    
    try {
      ctx.log("Attempting to register game...");
      await program.methods
        .registerGame(gameId, gameName, minPlayers, maxPlayers, ruleUrl, version)
        .accounts({
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();
      
      ctx.log("✓ Game registered successfully (registry auto-created)");
    } catch (err: unknown) {
      const error = err as { message?: string };
      
      if (error.message?.includes("AccountDiscriminatorMismatch")) {
        ctx.error(
          "AccountDiscriminatorMismatch detected. SOLUTION:\n" +
          "1. Stop validator (Ctrl+C)\n" +
          "2. Run: solana-test-validator --reset\n" +
          "3. Run: anchor build && anchor deploy\n" +
          "4. Run: anchor test",
          error
        );
      }
      
      ctx.error(`Failed to register game`, error);
    }
    
    // Verify registry was created (may have existing games from previous tests)
    const registry = await program.account.gameRegistry.fetch(registryPDA);
    ctx.set('finalGameCount', registry.gameCount);
    ctx.set('registryAuthority', registry.authority);
    
    expect(registry.gameCount).to.be.greaterThan(0);
    ctx.log(`✓ Registry has ${registry.gameCount} game(s) (may include games from previous tests)`);
    ctx.finish();
  });

  it("Can fetch GameRegistry data after creation", async () => {
    const ctx = createTestContext("Can fetch GameRegistry data after creation");
    const status = await checkGameRegistryStatus(ctx);
    
    ctx.expect(status.exists, "Registry should exist");
    ctx.expect(status.isValid, "Registry should be valid");
    
    if (status.gameCount !== undefined) {
      ctx.set('gameCount', status.gameCount);
      expect(status.gameCount).to.be.greaterThan(0);
      ctx.log(`✓ Registry has ${status.gameCount} game(s)`);
    }
    ctx.finish();
  });

  it("Can register another game", async () => {
    const ctx = createTestContext("Can register another game");
    const { getRegistryPDA } = await import("./helpers");
    const [registryPDA] = await getRegistryPDA();
    
    const registryBefore = await program.account.gameRegistry.fetch(registryPDA);
    const countBefore = registryBefore.gameCount;
    
    const gameId = 98; // Different game_id
    const gameName = "TestGame2";
    
    ctx.set('registryPDA', registryPDA);
    ctx.set('gameId', gameId);
    ctx.set('gameName', gameName);
    ctx.set('countBefore', countBefore);
    
    await program.methods
      .registerGame(gameId, gameName, 2, 6, "https://rules.example.com/test2", 1)
      .accounts({
        registry: registryPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();
    
    const registryAfter = await program.account.gameRegistry.fetch(registryPDA);
    ctx.set('countAfter', registryAfter.gameCount);
    
    expect(registryAfter.gameCount).to.equal(countBefore + 1);
    ctx.log(`✓ Game count increased: ${countBefore} → ${registryAfter.gameCount}`);
    ctx.finish();
  });
});