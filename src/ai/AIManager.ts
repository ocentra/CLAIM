import { type GameState, type PlayerAction, AIPersonality } from '@/types'
import { AIEngine, type AIConfig, type AIDecision } from './AIEngine'
import { ModelManager } from './ModelManager'
import { AIHelper } from './AIHelper'
import { GameModeFactory } from '@/gameMode/GameModeFactory'
import type { GameMode } from '@/gameMode/GameMode'
import { RequestModelGenerateEvent } from '@/lib/eventing/events/model'
import { EventBus } from '@/lib/eventing/EventBus'
import { logAI } from '@lib/logging'

const VALID_MODEL_ACTIONS: ReadonlyArray<AIDecision['action']> = [
  'pick_up',
  'decline',
  'declare_intent',
  'call_showdown',
  'rebuttal',
]

type ModelDecisionPayload = {
  action?: AIDecision['action']
  data?: Record<string, unknown>
  reasoning?: string
}

function isModelDecisionPayload(value: unknown): value is ModelDecisionPayload {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  if (candidate.action && typeof candidate.action !== 'string') {
    return false
  }
  if (candidate.data && typeof candidate.data !== 'object') {
    return false
  }
  if (candidate.reasoning && typeof candidate.reasoning !== 'string') {
    return false
  }
  return true
}

export class AIManager {
  private aiEngines: Map<string, AIEngine> = new Map()
  private modelManager: ModelManager
  private aiHelper: AIHelper
  private gameMode?: GameMode
  private gameModeId: string

  constructor(gameModeId: string = 'claim') {
    this.modelManager = ModelManager.getInstance()
    this.aiHelper = AIHelper.getInstance()
    this.gameModeId = gameModeId
  }

  /**
   * Initialize AI engines for all AI players in the game
   */
  async initializeAIEngines(gameState: GameState, modelId?: string): Promise<void> {
    logAI('Initializing AI engines for game state')
    
    // Load GameMode from asset manager if not already loaded
    if (!this.gameMode) {
      try {
        logAI('Loading GameMode asset:', this.gameModeId)
        this.gameMode = await GameModeFactory.getGameMode(this.gameModeId)
        logAI('GameMode loaded successfully')
      } catch (error) {
        logAI('Failed to load GameMode asset, falling back to sync load:', error)
        // Fallback for backward compatibility if asset loading fails
        this.gameMode = GameModeFactory.getGameModeSync(this.gameModeId)
      }
    }

    const aiPlayers = gameState.players.filter(player => player.isAI)
    logAI('Found AI players:', aiPlayers.length)
    
    // Load model if provided and not already loaded
    if (modelId && !this.modelManager.isModelLoaded()) {
      try {
        logAI('Loading model:', modelId)
        await this.modelManager.loadModel(modelId)
        logAI('Model loaded successfully')
      } catch (error) {
        logAI('Failed to load model, using rule-based fallback:', error)
      }
    }
    
    for (const player of aiPlayers) {
      logAI('Initializing AI engine for player:', player.name)
      const aiConfig: AIConfig = {
        personality: this.mapPersonality(player.aiPersonality || AIPersonality.ADAPTIVE),
        difficulty: 'medium',
        enableWebGPU: false
      }

      const aiEngine = new AIEngine(player.id, aiConfig)
      await aiEngine.initialize()
      this.aiEngines.set(player.id, aiEngine)
    }
    logAI('AI engines initialized successfully')
  }

  /**
   * Get AI decision for a specific player
   */
  async getAIDecision(playerId: string, gameState: GameState): Promise<AIDecision | null> {
    logAI('Getting AI decision for player:', playerId)
    const aiEngine = this.aiEngines.get(playerId)
    if (!aiEngine) {
      logAI(`No AI engine found for player ${playerId}`)
      console.warn(`No AI engine found for player ${playerId}`)
      return null
    }

    try {
      // If model is loaded, use AIHelper to get prompts and generate decision
      if (this.modelManager.isModelLoaded()) {
        return await this.getAIDecisionWithModel(playerId, gameState)
      } else {
        // Fallback to rule-based decision
        logAI('Model not loaded, using rule-based decision')
        const decision = await aiEngine.makeDecision(gameState)
        logAI('AI decision received for player:', playerId, decision)
        return decision
      }
    } catch (error) {
      logAI(`Error getting AI decision for player ${playerId}:`, error)
      console.error(`Error getting AI decision for player ${playerId}:`, error)
      // Fallback to rule-based
      return await aiEngine.makeDecision(gameState)
    }
  }

  /**
   * Get AI decision using model and AIHelper
   */
  private async getAIDecisionWithModel(playerId: string, gameState: GameState): Promise<AIDecision> {
    try {
      if (!this.gameMode) {
        throw new Error('GameMode not initialized')
      }

      // Get AI instructions from AIHelper
      const { systemMessage, userPrompt } = await this.aiHelper.GetAIInstructions(
        this.gameMode,
        playerId
      )

      // Generate response using ModelManager
      const generateEvent = new RequestModelGenerateEvent({
        systemMessage,
        userPrompt,
      })

      EventBus.instance.publish(generateEvent)
      const result = await generateEvent.deferred.promise

      if (!result.isSuccess || !result.value) {
        throw new Error(result.errorMessage ?? 'Model generation failed')
      }

      // Parse the JSON response
      let decisionData: ModelDecisionPayload
      try {
        // Try to extract JSON from response
        const jsonMatch = result.value.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as unknown
          if (!isModelDecisionPayload(parsed)) {
            throw new Error('Model response payload is not in the expected format')
          }
          decisionData = parsed
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        // If parsing fails, use rule-based fallback
        logAI('Failed to parse model response, using rule-based fallback')
        const aiEngine = this.aiEngines.get(playerId)
        if (aiEngine) {
          return await aiEngine.makeDecision(gameState)
        }
        throw parseError
      }

      // Convert to AIDecision format
      const action = VALID_MODEL_ACTIONS.includes(decisionData.action ?? 'decline')
        ? (decisionData.action as AIDecision['action'])
        : 'decline'

      const decision: AIDecision = {
        action,
        data: decisionData.data,
        confidence: 0.8, // Model decisions have higher confidence
      }

      logAI('Model decision received:', decision)
      return decision
    } catch (error) {
      logAI('Error in getAIDecisionWithModel, falling back to rule-based:', error)
      const aiEngine = this.aiEngines.get(playerId)
      if (aiEngine) {
        return await aiEngine.makeDecision(gameState)
      }
      throw error
    }
  }

  /**
   * Convert AI personality to AI config personality
   */
  private mapPersonality(personality: AIPersonality): AIConfig['personality'] {
    switch (personality) {
      case AIPersonality.AGGRESSIVE:
        return 'aggressive'
      case AIPersonality.CONSERVATIVE:
        return 'conservative'
      case AIPersonality.ADAPTIVE:
        return 'adaptive'
      case AIPersonality.UNPREDICTABLE:
        return 'adaptive'
      default:
        return 'adaptive'
    }
  }

  /**
   * Create PlayerAction from AIDecision
   */
  createPlayerActionFromDecision(playerId: string, decision: AIDecision): PlayerAction {
    return {
      type: decision.action,
      playerId,
      data: decision.data,
      timestamp: new Date()
    }
  }

  /**
   * Check if a player is an AI player
   */
  isAIPlayer(playerId: string): boolean {
    return this.aiEngines.has(playerId)
  }

  /**
   * Clean up AI engines
   */
  destroy(): void {
    this.aiEngines.clear()
  }
}
