/// <reference lib="dom" />

const prefix = '[PipelineStateManager]';

// Logging flags
const LOG_GENERAL = false;
const LOG_ERROR = true;

/**
 * State persistence interface
 */
export interface PersistentState {
  lastLoadedModel?: {
    repoId: string;
    quantPath: string;
    loadedAt: number;
  };
  lastChatSessionId?: string;
}

/**
 * PipelineStateManager - Manages persistent state for pipelines
 * Handles saving/loading model state and chat sessions
 * Adapted for Claim to use localStorage instead of browser.storage
 */
export class PipelineStateManager {
  private static readonly STATE_STORAGE_KEY = 'claim_ai_pipeline_state';
  private static state: PersistentState = {};

  /**
   * Load persistent state from localStorage
   */
  static async loadState(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.STATE_STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
        if (LOG_GENERAL) {
          console.log(prefix, '📂 Loaded persistent state:', {
            lastLoadedModel: this.state.lastLoadedModel,
            lastChatSessionId: this.state.lastChatSessionId
          });
        }
      } else {
        this.state = {};
        if (LOG_GENERAL) {
          console.log(prefix, '📂 No persistent state found, starting fresh');
        }
      }
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, '❌ Error loading persistent state:', error);
      }
      this.state = {};
    }
  }

  /**
   * Save persistent state to localStorage
   */
  static saveState(): void {
    try {
      if (LOG_GENERAL) {
        console.log(prefix, '💾 Saving persistent state:', {
          lastLoadedModel: this.state.lastLoadedModel,
          lastChatSessionId: this.state.lastChatSessionId
        });
      }

      localStorage.setItem(this.STATE_STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, '❌ Error saving persistent state:', error);
      }
    }
  }

  /**
   * Update last loaded model
   */
  static updateLastLoadedModel(repoId: string, quantPath: string): void {
    this.state.lastLoadedModel = {
      repoId,
      quantPath,
      loadedAt: Date.now()
    };
    this.saveState();
  }

  /**
   * Get last loaded model
   */
  static getLastLoadedModel(): { repoId: string; quantPath: string } | null {
    return this.state.lastLoadedModel || null;
  }

  /**
   * Update last chat session
   */
  static updateLastChatSession(sessionId: string): void {
    this.state.lastChatSessionId = sessionId;
    this.saveState();
  }

  /**
   * Get last chat session
   */
  static getLastChatSession(): string | null {
    return this.state.lastChatSessionId || null;
  }

  /**
   * Get entire state (read-only copy)
   */
  static getState(): PersistentState {
    return { ...this.state };
  }

  /**
   * Clear all persistent state
   */
  static clearState(): void {
    this.state = {};
    try {
      localStorage.removeItem(this.STATE_STORAGE_KEY);
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, '❌ Failed to clear persistent state:', error);
      }
    }
  }

  /**
   * Initialize state manager (loads state from storage)
   */
  static async initialize(): Promise<void> {
    await this.loadState();
    if (LOG_GENERAL) {
      console.log(prefix, '📂 State manager initialized');
    }
  }
}

