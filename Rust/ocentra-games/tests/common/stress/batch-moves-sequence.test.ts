/**
 * Test: Can submit multiple batch moves in sequence
 * Category: STRESS
 */

import { BaseTest } from '@/core';
import { TestCategory, ClusterRequirement } from '@/core';
import { registerMochaTest } from '@/core';
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

class BatchMovesSequenceTest extends BaseTest {
  constructor() {
    super({
      id: 'batch-moves-sequence',
      name: 'Can submit multiple batch moves in sequence',
      description: 'Verifies that multiple batch moves can be submitted in sequence (stress test)',
      tags: {
        category: TestCategory.STRESS,
        cluster: ClusterRequirement.DEVNET_ALLOWED,
        expensive: true,
        requiresSetup: true,
        requiresRegistry: true,
      },
    });
  }

  async run(): Promise<void> {
    const {
      program,
      player1,
      generateUniqueMatchId,
      getTestUserId,
      getBatchMovePDA,
      createStartedMatch,
    } = await import('@/helpers');

    const matchId = generateUniqueMatchId("batch-stress");
    const [matchPDA, registryPDA] = await createStartedMatch(matchId, 2);

    // Import CLAIM-specific helpers
    const { revealFloorCard, generateMockFloorCardHash, CLAIM_ACTIONS, submitClaimBatchMovesManual } = await import("@/claim");

    // Submit 5 batch moves in sequence (each with 5 moves = 25 total moves)
    for (let batchNum = 0; batchNum < 5; batchNum++) {
      const userId = getTestUserId(0);
      const baseNonce = Date.now() + (batchNum * 1000);
      
      // Create moves for this batch FIRST to determine what we need
      const floorCardHash = generateMockFloorCardHash(batchNum);
      const moves = Array.from({ length: 5 }, (_, i) => {
        // First move in first batch: declare_intent, rest: pick_up/decline
        if (batchNum === 0 && i === 0) {
          return {
            actionType: CLAIM_ACTIONS.DECLARE_INTENT,
            payload: Buffer.from([0]), // spades
            nonce: new anchor.BN(baseNonce + i),
          };
        } else {
          // Use pick_up (0) and decline (1) alternately
          const actionType = i % 2 === 0 ? CLAIM_ACTIONS.PICK_UP : CLAIM_ACTIONS.DECLINE;
          const payload = actionType === CLAIM_ACTIONS.PICK_UP 
            ? floorCardHash
            : Buffer.alloc(0);
          return {
            actionType,
            payload,
            nonce: new anchor.BN(baseNonce + i),
          };
        }
      });
      
      // Check if this batch needs a floor card (has pick_up or decline actions)
      const hasPickUp = moves.some(m => m.actionType === CLAIM_ACTIONS.PICK_UP);
      const hasDecline = moves.some(m => m.actionType === CLAIM_ACTIONS.DECLINE);
      
      // Reveal floor card if needed BEFORE submitting batch
      // Note: pick_up clears floor card, so each batch that needs a floor card must reveal it
      if (hasPickUp || hasDecline) {
        // Refresh match account to get latest state (previous batch may have cleared floor card)
        const matchAccount = await program.account.match.fetch(matchPDA);
        const isFloorCardRevealed = (matchAccount.flags & 0x01) !== 0;
        
        if (!isFloorCardRevealed) {
          // Verify match is in playing phase (required for reveal_floor_card)
          if (matchAccount.phase !== 1) {
            throw new Error(`Cannot reveal floor card: match is in phase ${matchAccount.phase}, expected phase 1 (playing)`);
          }
          
          // Reveal floor card before this batch
          const revealNonce = new anchor.BN(baseNonce - 10000 - batchNum);
          console.log(`[Batch ${batchNum}] Revealing floor card, nonce: ${revealNonce.toString()}`);
          let revealTx: string | undefined;
          try {
            revealTx = await revealFloorCard(
              matchId,
              userId,
              matchPDA,
              registryPDA,
              floorCardHash,
              revealNonce,
              player1
            );
            console.log(`[Batch ${batchNum}] Floor card reveal tx: ${revealTx}`);
            
            // Check if revealFloorCard returned "skipped" (already revealed)
            if (revealTx === 'skipped') {
              console.log(`[Batch ${batchNum}] Floor card already revealed, skipping reveal`);
              // Verify floor card is actually revealed
              const matchAccountCheck = await program.account.match.fetch(matchPDA);
              const isRevealed = (matchAccountCheck.flags & 0x01) !== 0;
              if (!isRevealed) {
                throw new Error(`Floor card marked as skipped but not actually revealed`);
              }
            } else {
              // Wait for transaction to fully confirm and state to update
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Verify floor card was actually revealed
              const matchAccountAfter = await program.account.match.fetch(matchPDA);
              const isRevealedAfter = (matchAccountAfter.flags & 0x01) !== 0;
              console.log(`[Batch ${batchNum}] Floor card revealed check: ${isRevealedAfter}, flags: ${matchAccountAfter.flags.toString(16)}`);
              if (!isRevealedAfter) {
                throw new Error(`Floor card reveal failed - transaction: ${revealTx}, floor card still not revealed after revealFloorCard call`);
              }
              console.log(`[Batch ${batchNum}] ✓ Floor card revealed successfully`);
            }
          } catch (err) {
            console.error(`[Batch ${batchNum}] Floor card reveal error:`, err);
            // Check if error is InvalidPhase from floor card validation
            if (this.isAnchorError(err) && this.getErrorCode(err) === 'InvalidPhase') {
              // If floor card already revealed, that's fine - continue with batch
              const matchAccountCheck = await program.account.match.fetch(matchPDA);
              const isAlreadyRevealed = (matchAccountCheck.flags & 0x01) !== 0;
              if (isAlreadyRevealed) {
                console.log(`[Batch ${batchNum}] Floor card already revealed (from previous transaction), continuing`);
              } else {
                // InvalidPhase error but floor card not revealed - this is unexpected
                // May be a race condition or validation logic issue
                console.log(`[Batch ${batchNum}] InvalidPhase error but floor card not revealed - may be race condition, checking again...`);
                await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
                const matchAccountCheck2 = await program.account.match.fetch(matchPDA);
                const isRevealedNow = (matchAccountCheck2.flags & 0x01) !== 0;
                if (isRevealedNow) {
                  console.log(`[Batch ${batchNum}] Floor card revealed after delay, continuing`);
                } else {
                  throw new Error(`Failed to reveal floor card before batch ${batchNum}: InvalidPhase error but floor card still not revealed`);
                }
              }
            } else {
              // Check if revealFloorCard returned "skipped" (already revealed)
              const errorMsg = err instanceof Error ? err.message : String(err);
              if (errorMsg === 'skipped') {
                console.log(`[Batch ${batchNum}] Floor card already revealed, skipping`);
              } else {
                throw new Error(`Failed to reveal floor card before batch ${batchNum}: ${errorMsg}`);
              }
            }
          }
        } else {
          console.log(`[Batch ${batchNum}] Floor card already revealed, skipping reveal`);
        }
      }
      
      // Get PDAs using correct indices (0-4) as Rust expects
      // Rust uses hardcoded indices 0-4 in the Anchor account constraints for each batch
      // Each batch reuses the same 5 PDAs (indices 0-4), but the move_index stored in the account is sequential
      const movePDAs = await Promise.all(
        Array.from({ length: 5 }, (_, i) => getBatchMovePDA(matchId, player1.publicKey, i))
      );

      // Extract PDAs and ensure we have exactly 5 (required tuple type)
      const moveAccountPDAs: [PublicKey, PublicKey, PublicKey, PublicKey, PublicKey] = [
        movePDAs[0][0],
        movePDAs[1][0],
        movePDAs[2][0],
        movePDAs[3][0],
        movePDAs[4][0],
      ];

      await submitClaimBatchMovesManual(
        matchId,
        userId,
        moves,
        matchPDA,
        registryPDA,
        moveAccountPDAs,
        player1
      );
    }

    const matchAccount = await program.account.match.fetch(matchPDA);
    this.assertEqual(matchAccount.moveCount, 25);
  }
}

const testInstance = new BatchMovesSequenceTest();
registerMochaTest(testInstance);

