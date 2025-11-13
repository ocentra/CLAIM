/// <reference lib="dom" />
import { PipelineTypeEnum, type Dtype, type Device } from './PipelineTypes';
import { BasePipeline } from './BasePipeline';
import { BaseModelConfig } from './PipelineConfigs';
import { TextGenerationPipeline } from './TextGenerationPipeline';
import { WhisperPipeline } from './WhisperPipeline';
import { TextToSpeechPipeline } from './TextToSpeechPipeline';
import {
  TextGenerationConfig,
  SpeechRecognitionConfig,
  TextToSpeechConfig,
} from './PipelineConfigs';

/**
 * PipelineFactory.ts
 * 
 * Factory pattern for creating appropriate pipeline instances.
 * Supports both task-based and model-specific routing.
 */

const prefix = '[PipelineFactory]';
const LOG_GENERAL = false;
const LOG_MODEL_LOADING = false;

/**
 * PipelineFactory - Factory pattern for creating appropriate pipeline instances
 * Pure factory with no dependencies on DB or external services
 */
export class PipelineFactory {
  /**
   * Create appropriate pipeline based on task type and optional modelId
   * Defaults to TextGenerationPipeline if task is unknown or not provided
   * 
   * @param task - Pipeline task type (e.g., 'text-generation', 'feature-extraction')
   * @param modelId - Optional model ID for specialized routing
   * @returns Concrete pipeline instance
   */
  static createPipeline(task?: string, modelId?: string): BasePipeline {
    // Default to text generation if no task specified
    const pipelineTask = task || PipelineTypeEnum.TEXT_GENERATION;
    
    if (LOG_GENERAL) {
      console.log(prefix, `Creating pipeline for task: ${pipelineTask}, modelId: ${modelId || 'none'}`);
    }
    
    // Model-specific routing for specialized models
    if (modelId) {
      const lowerModelId = modelId.toLowerCase();

      // Whisper detection
      if (lowerModelId.includes('whisper') || lowerModelId.includes('moonshine')) {
        if (LOG_GENERAL) {
          console.log(prefix, 'Detected Whisper-like model, using WhisperPipeline');
        }
        return new WhisperPipeline();
      }

      // Kokoro TTS detection
      if (lowerModelId.includes('kokoro')) {
        if (LOG_GENERAL) {
          console.log(prefix, 'Detected Kokoro TTS model, using TextToSpeechPipeline');
        }
        return new TextToSpeechPipeline();
      }

      // SpeechT5 TTS detection
      if (lowerModelId.includes('speecht5') || lowerModelId.includes('tts')) {
        if (LOG_GENERAL) {
          console.log(prefix, 'Detected SpeechT5 TTS model, using TextToSpeechPipeline');
        }
        return new TextToSpeechPipeline();
      }
    }

    // Task-based routing (standard pipeline selection)
    switch (pipelineTask) {
      case PipelineTypeEnum.TEXT_GENERATION:
        return new TextGenerationPipeline();

      case PipelineTypeEnum.AUTOMATIC_SPEECH_RECOGNITION:
        return new WhisperPipeline();

      case PipelineTypeEnum.TEXT_TO_SPEECH:
        return new TextToSpeechPipeline();

      default:
        // Fallback to text generation for unknown tasks
        console.warn(prefix, `Unknown task "${pipelineTask}", defaulting to text-generation`);
        return new TextGenerationPipeline();
    }
  }

  /**
   * Create pipeline and its corresponding config in one call
   * Automatically matches the correct config type to the pipeline type
   */
  static async createPipelineWithConfig(
    task: string | undefined,
    modelId: string,
    options: {
      dtype?: Dtype;
      device?: Device;
      useExternalData?: boolean;
    }
  ): Promise<{
    pipeline: BasePipeline;
    config: BaseModelConfig;
  }> {
    if (LOG_MODEL_LOADING) {
      console.log(prefix, `[createPipelineWithConfig] Inputs:
        task: ${task}
        modelId: ${modelId}
        options.dtype: ${JSON.stringify(options?.dtype)}
        options.device: ${JSON.stringify(options?.device)}
        options.useExternalData: ${options?.useExternalData}`);
    }
    
    // Create pipeline instance
    const pipeline = this.createPipeline(task, modelId);
    
    // Create appropriate config based on pipeline type
    let config: BaseModelConfig;

    if (pipeline instanceof TextGenerationPipeline) {
      config = await TextGenerationConfig.createWithAutoDetect(modelId, options);
    } else if (pipeline instanceof WhisperPipeline) {
      config = await SpeechRecognitionConfig.createWithAutoDetect(modelId, options);
    } else if (pipeline instanceof TextToSpeechPipeline) {
      config = await TextToSpeechConfig.createWithAutoDetect(modelId, options);
    } else {
      // Fallback to TextGenerationConfig for unknown pipeline types
      config = await TextGenerationConfig.createWithAutoDetect(modelId, options);
    }

    return { pipeline, config };
  }
}

