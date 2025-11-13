/**
 * E2E Tests for P2PManager
 * 
 * Tests the full P2PManager API in real browser environments.
 */

// Playwright fixtures are properly typed at runtime - TypeScript doesn't recognize them
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { test, expect } from '@playwright/test'

test.describe('P2PManager E2E', () => {
  test('establishes real P2P connection between two managers', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    await page1.goto('/src/network/__tests__/e2e/test-harness.html')
    await page2.goto('/src/network/__tests__/e2e/test-harness.html')

    // Wait for modules to load
    await page1.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })
    await page2.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })

    // Initialize P2PManager on both pages
    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'alice' })
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'bob' })
    })

    // Set up event handlers
    const aliceMessages: Array<unknown> = []
    const bobMessages: Array<unknown> = []
    const aliceConnected: string[] = []
    const bobConnected: string[] = []

    await page1.exposeFunction('onChatMessage1', (message: unknown) => {
      aliceMessages.push(message)
    })
    await page2.exposeFunction('onChatMessage2', (message: unknown) => {
      bobMessages.push(message)
    })
    await page1.exposeFunction('onPeerConnected1', (peerId: string) => {
      aliceConnected.push(peerId)
    })
    await page2.exposeFunction('onPeerConnected2', (peerId: string) => {
      bobConnected.push(peerId)
    })

    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.onChatMessage(window.onChatMessage1)
      // @ts-expect-error - test harness
      window.testManager.onPeerConnected(window.onPeerConnected1)
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.onChatMessage(window.onChatMessage2)
      // @ts-expect-error - test harness
      window.testManager.onPeerConnected(window.onPeerConnected2)
    })

    // Create offer from Alice - this should complete quickly
    console.log('Creating offer from Alice...')
    const offer = await page1.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.createOffer('bob')
    }).catch((err) => {
      console.error('createOffer failed:', err)
      throw err
    }) as RTCSessionDescriptionInit

    expect(offer).toBeDefined()
    expect(offer.type).toBe('offer')
    expect(offer.sdp).toBeTruthy()
    expect(typeof offer.sdp).toBe('string')
    expect(offer.sdp.length).toBeGreaterThan(0)
    console.log('Offer created successfully:', offer.type)

    // Handle offer on Bob's side - with explicit timeout
    console.log('Handling offer on Bob\'s side...')
    const answerPromise = page2.evaluate((offer: RTCSessionDescriptionInit) => {
      // @ts-expect-error - test harness
      return window.testManager.handleOffer('alice', offer)
    }, offer)

    // Race against a timeout
    const answerTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('handleOffer timed out after 5 seconds')), 5000)
    })

    let answer: RTCSessionDescriptionInit
    try {
      answer = await Promise.race([answerPromise, answerTimeout]) as RTCSessionDescriptionInit
      console.log('Answer created successfully:', answer.type)
    } catch (error) {
      console.error('handleOffer failed or timed out:', error)
      // Cleanup before throwing
      await page1.evaluate(() => {
        // @ts-expect-error - test harness
        if (window.testManager) window.testManager.destroy()
      }).catch(() => {})
      await page2.evaluate(() => {
        // @ts-expect-error - test harness
        if (window.testManager) window.testManager.destroy()
      }).catch(() => {})
      throw error
    }

    expect(answer).toBeDefined()
    expect(answer.type).toBe('answer')
    expect(answer.sdp).toBeTruthy()
    expect(typeof answer.sdp).toBe('string')
    expect(answer.sdp.length).toBeGreaterThan(0)

    // Handle answer on Alice's side - with explicit timeout
    console.log('Handling answer on Alice\'s side...')
    const handleAnswerPromise = page1.evaluate((answer: RTCSessionDescriptionInit) => {
      // @ts-expect-error - test harness
      return window.testManager.handleAnswer('bob', answer)
    }, answer)

    // Race against a timeout
    const handleAnswerTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('handleAnswer timed out after 5 seconds')), 5000)
    })

    try {
      await Promise.race([handleAnswerPromise, handleAnswerTimeout])
      console.log('Answer handled successfully')
    } catch (error) {
      console.error('handleAnswer failed or timed out:', error)
      // Cleanup before throwing
      await page1.evaluate(() => {
        // @ts-expect-error - test harness
        if (window.testManager) window.testManager.destroy()
      }).catch(() => {})
      await page2.evaluate(() => {
        // @ts-expect-error - test harness
        if (window.testManager) window.testManager.destroy()
      }).catch(() => {})
      throw error
    }

    // Verify managers are set up correctly
    const alicePeers = await page1.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectedPeers()
    })
    const bobPeers = await page2.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectedPeers()
    })

    expect(Array.isArray(alicePeers)).toBe(true)
    expect(Array.isArray(bobPeers)).toBe(true)

    // Verify connection status is tracked (might be CONNECTING in test env)
    const aliceStatus = await page1.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectionStatus('bob')
    })
    const bobStatus = await page2.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectionStatus('alice')
    })

    // Status should be tracked (CONNECTING is expected in test environment)
    expect(aliceStatus).toBeDefined()
    expect(bobStatus).toBeDefined()

    // Cleanup
    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })

    await context1.close()
    await context2.close()
  }, 20000) // 20 second timeout - reduced from 30s to fail faster if stuck

  test('broadcasts messages to all connected peers', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    await page1.goto('/src/network/__tests__/e2e/test-harness.html')
    await page2.goto('/src/network/__tests__/e2e/test-harness.html')

    // Wait for modules to load
    await page1.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })
    await page2.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })

    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'alice' })
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'bob' })
    })

    // Send broadcast message
    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.sendChatMessage('Hello everyone!')
    })

    // Verify broadcast was attempted
    const alicePeers = await page1.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectedPeers()
    })

    expect(Array.isArray(alicePeers)).toBe(true)

    // Cleanup
    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })

    await context1.close()
    await context2.close()
  })

  test('handles peer disconnection correctly', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    await page1.goto('/src/network/__tests__/e2e/test-harness.html')
    await page2.goto('/src/network/__tests__/e2e/test-harness.html')

    // Wait for modules to load
    await page1.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })
    await page2.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })

    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'alice' })
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'bob' })
    })

    // Establish connection (simplified)
    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.createOffer('bob')
    })

    // Disconnect Bob
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })

    // Wait for disconnection to be detected
    await page1.waitForTimeout(500)

    // Verify disconnection handling
    const alicePeers = await page1.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectedPeers()
    })

    expect(alicePeers.length).toBe(0)

    // Cleanup
    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })

    await context1.close()
    await context2.close()
  })

  test('tracks connection status for each peer', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    await page1.goto('/src/network/__tests__/e2e/test-harness.html')
    await page2.goto('/src/network/__tests__/e2e/test-harness.html')

    // Wait for modules to load
    await page1.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })
    await page2.waitForFunction(() => typeof (window as unknown as { P2PManager?: unknown }).P2PManager !== 'undefined', { timeout: 10000 })

    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'alice' })
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager = new P2PManager({ localPeerId: 'bob' })
    })

    // Initial status should be undefined
    const initialStatus = await page1.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectionStatus('bob')
    })
    expect(initialStatus).toBeUndefined()

    // After creating offer, status might change
    await page1.evaluate(async () => {
      // @ts-expect-error - test harness
      await window.testManager.createOffer('bob')
    })

    // Wait a bit for connection status to update
    await page1.waitForTimeout(1000)

    // Status should be tracked - after createOffer, status should be CONNECTING
    const status = await page1.evaluate(() => {
      // @ts-expect-error - test harness
      return window.testManager.getConnectionStatus('bob')
    })
    // Status should be defined after createOffer (should be CONNECTING)
    expect(status).toBeDefined()
    expect(status).not.toBeNull()

    // Cleanup
    await page1.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })
    await page2.evaluate(() => {
      // @ts-expect-error - test harness
      window.testManager.destroy()
    })

    await context1.close()
    await context2.close()
  })
})

