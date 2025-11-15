import { expect } from "chai";
import { SystemProgram } from "@solana/web3.js";
import {
  program,
  authority,
  unauthorizedPlayer,
  getRegistryPDA,
  setupGameRegistry,
  initializeTestAccounts,
  conditionalDescribe,
  type AnchorError,
} from "./helpers";

conditionalDescribe("Game Registry", function() {
  before(async function() {
    await initializeTestAccounts();
    await setupGameRegistry();
  });

  it("Can register a new game", async () => {
    const [registryPDA] = await getRegistryPDA();
    
    // Find an available game_id (start from 100 to avoid conflicts with test data games 0-7)
    let gameId = 100;
    let registry = await program.account.gameRegistry.fetch(registryPDA);
    
    // Find first available game_id
    while (gameId < 120) {
      const existing = registry.games.find((g: { gameId: number }) => g.gameId === gameId);
      if (!existing || existing.gameId === 0) {
        break; // Found available slot
      }
      gameId++;
    }
    
    if (gameId >= 120) {
      throw new Error("Registry is full (20 games max)");
    }
    
    // Register new game with available game_id
    await program.methods
      .registerGame(
        gameId,
        "TestGame",
        2,
        4,
        "https://rules.example.com/test",
        1
      )
      .accounts({
        registry: registryPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();

    registry = await program.account.gameRegistry.fetch(registryPDA);
    expect(registry.gameCount).to.be.greaterThan(0);
  });

  it("Fails to register game with invalid authority", async () => {
    const [registryPDA] = await getRegistryPDA();
    
    try {
      await program.methods
        .registerGame(
          2,
          "TestGame",
          2,
          4,
          "https://rules.example.com/test",
          1
        )
        .accounts({
          registry: registryPDA,
          authority: unauthorizedPlayer.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .signers([unauthorizedPlayer])
        .rpc();
      
      expect.fail("Should have thrown Unauthorized error");
    } catch (err: unknown) {
      const error = err as AnchorError;
      expect(error.error?.errorCode?.code).to.equal("Unauthorized");
    }
  });

  it("Fails to register game with invalid parameters", async () => {
    const [registryPDA] = await getRegistryPDA();
    
    // Test: min_players > max_players
    try {
      await program.methods
        .registerGame(
          3,
          "InvalidGame",
          5, // min_players
          2, // max_players (less than min)
          "https://rules.example.com/invalid",
          1
        )
        .accounts({
          registry: registryPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        } as never)
        .rpc();
      
      expect.fail("Should have thrown InvalidPayload error");
    } catch (err: unknown) {
      const error = err as AnchorError;
      expect(error.error?.errorCode?.code).to.equal("InvalidPayload");
    }
  });

  it("Can update an existing game", async () => {
    const [registryPDA] = await getRegistryPDA();
    
    // Find an available game_id (start from 100 to avoid conflicts)
    let gameId = 100;
    let registry = await program.account.gameRegistry.fetch(registryPDA);
    
    // Find first available game_id
    while (gameId < 120) {
      const existing = registry.games.find((g: { gameId: number }) => g.gameId === gameId);
      if (!existing || existing.gameId === 0) {
        break; // Found available slot
      }
      gameId++;
    }
    
    if (gameId >= 120) {
      throw new Error("Registry is full (20 games max)");
    }
    
    // First register a game with available game_id
    await program.methods
      .registerGame(
        gameId,
        "TestGame",
        2,
        4,
        "https://rules.example.com/test",
        1
      )
      .accounts({
        registry: registryPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();

    // Update the game
    await program.methods
      .updateGame(
        gameId,
        "UpdatedGame", // new name
        null, // min_players (unchanged)
        null, // max_players (unchanged)
        null, // rule_engine_url (unchanged)
        2, // new version
        null // enabled (unchanged)
      )
      .accounts({
        registry: registryPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as never)
      .rpc();

    // Re-fetch registry to verify update
    registry = await program.account.gameRegistry.fetch(registryPDA);
    const game = registry.games.find((g: { gameId: number }) => g.gameId === gameId);
    void expect(game).to.exist;
    if (game) {
      void expect(game.version).to.equal(2);
      // Verify name was updated
      const gameName = Array.from(game.name).map(b => String.fromCharCode(b)).join('').replace(/\0/g, '');
      void expect(gameName).to.equal("UpdatedGame");
    }
  });
});

