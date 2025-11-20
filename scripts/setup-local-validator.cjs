#!/usr/bin/env node
/**
 * Setup Local Validator Script
 *
 * This script initializes the GameRegistry and registers the CLAIM game
 * so that your E2E tests can run properly.
 *
 * Run from Windows: node scripts/setup-local-validator.cjs
 *
 * Prerequisites:
 * 1. solana-test-validator running in WSL
 * 2. anchor deploy completed
 */

const { Connection, PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const { AnchorProvider, Program, Wallet } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

const PROGRAM_ID = '7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696';
const RPC_URL = process.env.SOLANA_RPC_URL || 'http://localhost:8899';

async function main() {
  console.log('=== Local Validator Setup ===\n');
  console.log(`RPC URL: ${RPC_URL}`);
  console.log(`Program ID: ${PROGRAM_ID}\n`);

  const connection = new Connection(RPC_URL, 'confirmed');

  // 1. Check connectivity
  console.log('1. Checking connectivity...');
  try {
    const version = await connection.getVersion();
    console.log(`   ✅ Connected to Solana ${version['solana-core']}`);
  } catch (e) {
    console.log(`   ❌ Cannot connect: ${e.message}`);
    console.log('\n   Start solana-test-validator in WSL first.');
    process.exit(1);
  }

  // 2. Load IDL
  console.log('\n2. Loading IDL...');
  const idlPath = path.join(process.cwd(), 'Rust', 'ocentra-games', 'target', 'idl', 'ocentra_games.json');
  let idl;
  try {
    idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));
    console.log(`   ✅ IDL loaded (${idl.instructions?.length || 0} instructions)`);
  } catch (e) {
    console.log(`   ❌ Cannot load IDL: ${e.message}`);
    console.log('   Run: anchor build (in WSL)');
    process.exit(1);
  }

  // 3. Create/load authority keypair
  console.log('\n3. Setting up authority...');
  let authorityKeypair;
  const keypairPath = path.join(process.cwd(), '.local-authority.json');

  if (fs.existsSync(keypairPath)) {
    const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
    authorityKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
    console.log(`   ✅ Loaded existing authority: ${authorityKeypair.publicKey.toString()}`);
  } else {
    authorityKeypair = Keypair.generate();
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(authorityKeypair.secretKey)));
    console.log(`   ✅ Created new authority: ${authorityKeypair.publicKey.toString()}`);
    console.log(`   Saved to: ${keypairPath}`);
  }

  // 4. Airdrop SOL to authority
  console.log('\n4. Funding authority...');
  const balance = await connection.getBalance(authorityKeypair.publicKey);
  if (balance < 1e9) {
    console.log('   Requesting airdrop...');
    const sig = await connection.requestAirdrop(authorityKeypair.publicKey, 2e9);
    await connection.confirmTransaction(sig, 'confirmed');
    const newBalance = await connection.getBalance(authorityKeypair.publicKey);
    console.log(`   ✅ Balance: ${newBalance / 1e9} SOL`);
  } else {
    console.log(`   ✅ Balance: ${balance / 1e9} SOL (sufficient)`);
  }

  // 5. Create Anchor program
  console.log('\n5. Creating Anchor program...');
  const wallet = new Wallet(authorityKeypair);
  const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
  const program = new Program(idl, provider);
  console.log(`   ✅ Program ready: ${program.programId.toString()}`);

  // 6. Check if GameRegistry already exists
  console.log('\n6. Checking GameRegistry...');
  const programId = new PublicKey(PROGRAM_ID);
  const [registryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('game_registry')],
    programId
  );

  const registryInfo = await connection.getAccountInfo(registryPda);

  if (registryInfo) {
    console.log(`   ✅ GameRegistry already exists at ${registryPda.toString()}`);
    console.log(`   Data size: ${registryInfo.data.length} bytes`);

    // Try to read the registry to check game count
    try {
      const registry = await program.account.gameRegistry.fetch(registryPda);
      console.log(`   Authority: ${registry.authority.toString()}`);
      console.log(`   Game count: ${registry.gameCount}`);

      if (registry.gameCount > 0) {
        console.log('\n   Games registered:');
        for (let i = 0; i < registry.gameCount; i++) {
          const game = registry.games[i];
          const name = Buffer.from(game.name).toString('utf-8').replace(/\0/g, '');
          console.log(`   - [${game.gameId}] ${name} (${game.minPlayers}-${game.maxPlayers} players)`);
        }
      }
    } catch (e) {
      console.log(`   ⚠️  Cannot read registry details: ${e.message}`);
    }
  } else {
    // Initialize GameRegistry
    console.log(`   GameRegistry not found, initializing...`);

    try {
      const tx = await program.methods
        .initializeRegistry()
        .accounts({
          registry: registryPda,
          authority: authorityKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authorityKeypair])
        .rpc();

      console.log(`   ✅ GameRegistry initialized!`);
      console.log(`   Transaction: ${tx}`);
      console.log(`   Registry PDA: ${registryPda.toString()}`);
    } catch (e) {
      console.log(`   ❌ Failed to initialize: ${e.message}`);
      if (e.logs) {
        console.log('   Logs:', e.logs.slice(-5).join('\n   '));
      }
      process.exit(1);
    }
  }

  // 7. Register CLAIM game if not already registered
  console.log('\n7. Checking CLAIM game registration...');

  try {
    const registry = await program.account.gameRegistry.fetch(registryPda);

    // Check if CLAIM game (id=0) is registered
    let claimRegistered = false;
    for (let i = 0; i < registry.gameCount; i++) {
      if (registry.games[i].gameId === 0) {
        claimRegistered = true;
        break;
      }
    }

    if (claimRegistered) {
      console.log('   ✅ CLAIM game already registered');
    } else {
      console.log('   Registering CLAIM game...');

      // Check if current authority matches registry authority
      if (registry.authority.toString() !== authorityKeypair.publicKey.toString()) {
        console.log(`   ⚠️  Authority mismatch!`);
        console.log(`   Registry authority: ${registry.authority.toString()}`);
        console.log(`   Your authority: ${authorityKeypair.publicKey.toString()}`);
        console.log('   You need to use the same keypair that initialized the registry.');
        process.exit(1);
      }

      const tx = await program.methods
        .registerGame(
          0,                    // game_id (CLAIM = 0)
          'CLAIM',              // name
          2,                    // min_players
          10,                   // max_players
          'https://ocentra.io', // rule_engine_url
          1                     // version
        )
        .accounts({
          registry: registryPda,
          authority: authorityKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authorityKeypair])
        .rpc();

      console.log(`   ✅ CLAIM game registered!`);
      console.log(`   Transaction: ${tx}`);
    }
  } catch (e) {
    console.log(`   ❌ Failed: ${e.message}`);
    if (e.logs) {
      console.log('   Logs:', e.logs.slice(-5).join('\n   '));
    }
    process.exit(1);
  }

  // 8. Final verification
  console.log('\n8. Final verification...');
  try {
    const registry = await program.account.gameRegistry.fetch(registryPda);
    console.log(`   ✅ GameRegistry: ${registryPda.toString()}`);
    console.log(`   ✅ Authority: ${registry.authority.toString()}`);
    console.log(`   ✅ Games registered: ${registry.gameCount}`);

    if (registry.gameCount > 0) {
      for (let i = 0; i < registry.gameCount; i++) {
        const game = registry.games[i];
        const name = Buffer.from(game.name).toString('utf-8').replace(/\0/g, '');
        console.log(`      [${game.gameId}] ${name}`);
      }
    }
  } catch (e) {
    console.log(`   ❌ Verification failed: ${e.message}`);
  }

  console.log('\n=== Setup Complete ===');
  console.log('You can now run your E2E tests!');
  console.log('\nTo run tests:');
  console.log('  npx vitest run src/services/__tests__/e2e/full-match-lifecycle.test.ts');
}

main().catch(e => {
  console.error('Setup failed:', e);
  process.exit(1);
});
