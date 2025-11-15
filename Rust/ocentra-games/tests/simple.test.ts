import { expect } from "chai";
import {
  program,
  authority,
  player1,
  player2,
  initializeTestAccounts,
  isLocalnet,
  createTestContext,
  checkGameRegistryStatus,
} from "./helpers";
import { PublicKey } from "@solana/web3.js";

/**
 * SIMPLE TESTS - Phase 1
 * 
 * These tests verify basic program functionality without complex setup.
 * Uses TestContext for meaningful error messages with IDs and context.
 */

describe("Simple Tests (Phase 1)", () => {
  before(async () => {
    // Only initialize accounts with SOL - no registry setup yet
    await initializeTestAccounts();
  });

  it("Program is loaded and accessible", () => {
    const ctx = createTestContext("Program is loaded and accessible");
    const expectedProgramId = "7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696";
    const actualProgramId = program.programId.toString();
    
    ctx.set('expectedProgramId', expectedProgramId);
    ctx.set('actualProgramId', actualProgramId);
    
    expect(actualProgramId).to.equal(expectedProgramId);
    ctx.log(`✓ Program loaded: ${actualProgramId}`);
    ctx.finish();
  });

  it("Can derive GameRegistry PDA", async () => {
    const ctx = createTestContext("Can derive GameRegistry PDA");
    const { getRegistryPDA } = await import("./helpers");
    const [registryPDA, bump] = await getRegistryPDA();
    
    ctx.set('registryPDA', registryPDA);
    ctx.set('bump', bump);
    
    expect(registryPDA).to.be.instanceOf(PublicKey);
    expect(bump).to.be.a("number");
    expect(bump).to.be.at.least(0).and.at.most(255);
    ctx.log(`✓ Registry PDA derived: ${registryPDA.toString()}, bump: ${bump}`);
    ctx.finish();
  });

  it("Authority account has SOL", async () => {
    const ctx = createTestContext("Authority account has SOL");
    const balance = await program.provider.connection.getBalance(authority.publicKey);
    
    ctx.set('authority', authority.publicKey);
    ctx.set('balance', balance);
    ctx.set('balanceSOL', balance / 1e9);
    
    expect(balance).to.be.greaterThan(0);
    ctx.log(`✓ Authority has ${balance / 1e9} SOL`);
    ctx.finish();
  });

  it("Test player accounts have SOL", async () => {
    const ctx = createTestContext("Test player accounts have SOL");
    const balance1 = await program.provider.connection.getBalance(player1.publicKey);
    const balance2 = await program.provider.connection.getBalance(player2.publicKey);
    
    ctx.set('player1', player1.publicKey);
    ctx.set('player1Balance', balance1);
    ctx.set('player2', player2.publicKey);
    ctx.set('player2Balance', balance2);
    
    expect(balance1).to.be.greaterThan(0);
    expect(balance2).to.be.greaterThan(0);
    ctx.log(`✓ Player1: ${balance1 / 1e9} SOL, Player2: ${balance2 / 1e9} SOL`);
    ctx.finish();
  });

  it("Can check if GameRegistry account exists", async () => {
    const ctx = createTestContext("Can check if GameRegistry account exists");
    const status = await checkGameRegistryStatus(ctx);
    
    if (!status.exists) {
      ctx.log("⚠ GameRegistry does not exist (expected for Phase 1)");
      void expect(status.exists).to.be.false;
    } else {
      ctx.log(`✓ GameRegistry exists with ${status.gameCount || 0} game(s)`);
      // Verify owner is correct
      const accountInfo = await program.provider.connection.getAccountInfo(status.registryPDA);
      if (accountInfo) {
        expect(accountInfo.owner.toString()).to.equal(program.programId.toString());
        ctx.set('accountSize', accountInfo.data.length);
        ctx.set('owner', accountInfo.owner.toString());
      }
    }
    ctx.finish();
  });

  // Skip on devnet to avoid rate limits
  it.skip("Can derive Match PDA for test match ID", async () => {
    if (!isLocalnet()) {
      console.log("⏭ Skipping on devnet");
      return;
    }

    const { getMatchPDA } = await import("./helpers");
    const testMatchId = "00000000-0000-0000-0000-000000000001";
    const [matchPDA, bump] = await getMatchPDA(testMatchId);
    
    expect(matchPDA).to.be.instanceOf(PublicKey);
    expect(bump).to.be.a("number");
    console.log("✓ Match PDA:", matchPDA.toString());
    console.log("✓ Bump:", bump);
  });
});

