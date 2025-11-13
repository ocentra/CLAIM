/// <reference lib="dom" />
import { LoadingStatusTypes } from './LoadingStatusTypes';
import { type PipelineProgressInfo, type EnhancedProgressCallback } from './PipelineTypes';
import { BaseModelConfig } from './PipelineConfigs';

/**
 * BasePipeline.ts
 * 
 * Abstract base class for all pipeline implementations.
 * Provides shared functionality and enforces consistent API.
 */

const prefix = '[BasePipeline]';
const LOG_GENERAL = false;

/**
 * Abstract base class for all pipelines
 * Provides shared functionality and enforces consistent API
 */
export abstract class BasePipeline<TConfig extends BaseModelConfig = BaseModelConfig> {
  // Transformers.js instances - types vary by pipeline (AutoTokenizer, AutoModelForCausalLM, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected tokenizer: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected model: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected processor: any = null; // For vision/audio pipelines
  protected currentConfig: TConfig | null = null;

  /**
   * Check if config has changed and needs reload
   * Shared implementation available to all pipelines
   */
  protected needsReload(newConfig: TConfig): boolean {
    if (this.currentConfig === null) return true;
    return !this.currentConfig.equals(newConfig);
  }

  /**
   * Create a wrapped progress callback for transformers.js
   * Converts transformers.js progress format to our PipelineProgressInfo format
   * 
   * @param progressCallback - Our enhanced callback
   * @param loadId - Load ID for tracking
   * @param component - Component name ('tokenizer', 'model', 'processor')
   * @param progressRange - [min, max] percentage range to remap to (e.g., [10, 40])
   * @returns Wrapped callback compatible with transformers.js
   */
  protected wrapProgressCallback(
    progressCallback: EnhancedProgressCallback | undefined,
    loadId: string | undefined,
    component: string,
    progressRange: [number, number]
  ): ((data: { status?: string; progress?: number; file?: string; loaded?: number; total?: number }) => void) | undefined {
    if (!progressCallback) return undefined;

    const [minProgress, maxProgress] = progressRange;
    const progressSpan = maxProgress - minProgress;

    return (data: { status?: string; progress?: number; file?: string; loaded?: number; total?: number }) => {
      let progress = minProgress;
      let status: PipelineProgressInfo['status'] = LoadingStatusTypes.PROGRESS;
      let message = `Loading ${component} from cache...`;

      if (data.status === 'progress') {
        progress = minProgress + ((data.progress ?? 0) * progressSpan);
        status = LoadingStatusTypes.PROGRESS;
        message = `Loading ${component} from cache... ${Math.round(progress)}%`;
      } else if (data.status === 'ready' || data.status === 'done') {
        progress = maxProgress;
        status = LoadingStatusTypes.DONE;
        message = `${component.charAt(0).toUpperCase() + component.slice(1)} ready`;
      }

      progressCallback({
        status,
        file: data.file || component,
        progress,
        loadId,
        loaded: data.loaded,
        total: data.total,
        message
      });
    };
  }

  /**
   * Load the model and required components
   * Must be implemented by each pipeline type
   */
  abstract load(config: TConfig, progressCallback?: EnhancedProgressCallback, loadId?: string): Promise<void>;

  /**
   * Reset the pipeline (clears loaded components)
   * Default implementation - can be overridden if needed
   */
  reset(): void {
    this.tokenizer = null;
    this.model = null;
    this.processor = null;
    this.currentConfig = null;
    if (LOG_GENERAL) {
      console.log(prefix, 'Pipeline reset');
    }
  }

  /**
   * Check if pipeline is loaded
   * Default implementation - can be overridden if needed
   */
  isLoaded(): boolean {
    return this.model !== null;
  }

  /**
   * Get current configuration
   * Default implementation - can be overridden if needed
   */
  getConfig(): TConfig | null {
    return this.currentConfig;
  }

  /**
   * Get tokenizer instance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTokenizer(): any {
    return this.tokenizer;
  }

  /**
   * Get model instance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getModel(): any {
    return this.model;
  }

  /**
   * Get processor instance (for vision/audio pipelines)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getProcessor(): any {
    return this.processor;
  }
}

