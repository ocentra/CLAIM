#!/usr/bin/env node
/**
 * Deployment Verification Script
 *
 * Run from Windows: node scripts/verify-deployment.js
 *
 * This script verifies:
 * 1. Program is deployed on localhost
 * 2. IDL matches deployed program
 * 3. PDA derivation works correctly
 * 4. Can create a test transaction (without sending)
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { AnchorProvider, Program, Wallet, BN } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

const PROGRAM_ID = '7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696';
const RPC_URL = process.env.SOLANA_RPC_URL || 'http://localhost:8899';

async function main() {
  console.log('=== Deployment Verification ===\n');
  console.log(`RPC URL: ${RPC_URL}`);
  console.log(`Expected Program ID: ${PROGRAM_ID}\n`);

  const connection = new Connection(RPC_URL, 'confirmed');
  let allPassed = true;

  // 1. Check RPC connectivity
  console.log('1. Checking RPC connectivity...');
  try {
    const version = await connection.getVersion();
    console.log(`   ✅ Connected to Solana ${version['solana-core']}`);
  } catch (e) {
    console.log(`   ❌ Cannot connect to RPC: ${e.message}`);
    console.log('\n   Make sure solana-test-validator is running in WSL');
    process.exit(1);
  }

  // 2. Check program deployment
  console.log('\n2. Checking program deployment...');
  const programId = new PublicKey(PROGRAM_ID);
  try {
    const programInfo = await connection.getAccountInfo(programId);
    if (!programInfo) {
      console.log(`   ❌ Program not found at ${PROGRAM_ID}`);
      console.log('   Run: anchor deploy (in WSL)');
      allPassed = false;
    } else if (!programInfo.executable) {
      console.log(`   ❌ Account exists but is not executable`);
      allPassed = false;
    } else {
      console.log(`   ✅ Program deployed and executable`);
      console.log(`   Owner: ${programInfo.owner.toString()}`);

      // Get program data size
      if (programInfo.owner.toString() === 'BPFLoaderUpgradeab1e11111111111111111111111') {
        const programDataAddress = new PublicKey(programInfo.data.slice(4));
        const programData = await connection.getAccountInfo(programDataAddress);
        if (programData) {
          console.log(`   Program size: ${(programData.data.length / 1024).toFixed(2)} KB`);
        }
      }
    }
  } catch (e) {
    console.log(`   ❌ Error checking program: ${e.message}`);
    allPassed = false;
  }

  // 3. Check IDL
  console.log('\n3. Checking IDL...');
  const idlPath = path.join(process.cwd(), 'Rust', 'ocentra-games', 'target', 'idl', 'ocentra_games.json');
  let idl;
  try {
    if (!fs.existsSync(idlPath)) {
      console.log(`   ❌ IDL not found at: ${idlPath}`);
      console.log('   Run: anchor build (in WSL)');
      allPassed = false;
    } else {
      idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));
      console.log(`   ✅ IDL loaded from ${idlPath}`);
      console.log(`   IDL address: ${idl.address}`);
      console.log(`   Instructions: ${idl.instructions?.length || 0}`);

      if (idl.address !== PROGRAM_ID) {
        console.log(`   ⚠️  IDL address doesn't match expected program ID!`);
        console.log(`   Expected: ${PROGRAM_ID}`);
        console.log(`   Got: ${idl.address}`);
        allPassed = false;
      } else {
        console.log(`   ✅ IDL address matches program ID`);
      }
    }
  } catch (e) {
    console.log(`   ❌ Error loading IDL: ${e.message}`);
    allPassed = false;
  }

  // 4. Test PDA derivation
  console.log('\n4. Testing PDA derivation...');
  const testMatchId = 'test-match-' + Date.now().toString(36);
  const matchIdBytes = Buffer.from(testMatchId, 'utf-8');
  const truncated = matchIdBytes.slice(0, Math.min(31, matchIdBytes.length));

  try {
    const [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('m'), truncated],
      programId
    );
    console.log(`   ✅ PDA derivation works`);
    console.log(`   Test matchId: ${testMatchId}`);
    console.log(`   PDA: ${pda.toString()}`);
    console.log(`   Bump: ${bump}`);
  } catch (e) {
    console.log(`   ❌ PDA derivation failed: ${e.message}`);
    allPassed = false;
  }

  // 5. Test Anchor Program creation
  console.log('\n5. Testing Anchor Program creation...');
  if (idl) {
    try {
      const keypair = Keypair.generate();
      const wallet = new Wallet(keypair);
      const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
      const program = new Program(idl, provider);

      console.log(`   ✅ Anchor Program created successfully`);
      console.log(`   Program ID from Anchor: ${program.programId.toString()}`);

      if (program.programId.toString() !== PROGRAM_ID) {
        console.log(`   ⚠️  Program ID mismatch!`);
        allPassed = false;
      }
    } catch (e) {
      console.log(`   ❌ Failed to create Program: ${e.message}`);
      allPassed = false;
    }
  }

  // 6. Check GameRegistry PDA (required for createMatch)
  console.log('\n6. Checking GameRegistry account...');
  try {
    const [registryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('game_registry')],
      programId
    );
    const registryInfo = await connection.getAccountInfo(registryPda);
    if (registryInfo) {
      console.log(`   ✅ GameRegistry exists at ${registryPda.toString()}`);
      console.log(`   Data size: ${registryInfo.data.length} bytes`);
    } else {
      console.log(`   ⚠️  GameRegistry not initialized at ${registryPda.toString()}`);
      console.log('   You may need to run: anchor test (to initialize)');
    }
  } catch (e) {
    console.log(`   ❌ Error checking GameRegistry: ${e.message}`);
  }

  // Summary
  console.log('\n=== Summary ===');
  if (allPassed) {
    console.log('✅ All checks passed! Deployment is ready.');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
  }

  return allPassed;
}

main()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(e => {
    console.error('Script error:', e);
    process.exit(1);
  });
