/// <reference lib="dom" />
import { LoadingStatusTypes } from './LoadingStatusTypes'
import { type EnhancedProgressCallback, type Dtype, type Device } from './PipelineTypes'
import { TextToSpeechConfig } from './PipelineConfigs'
import { BasePipeline } from './BasePipeline'
import { KokoroTokenizer, createKokoroTokenizer } from '@/lib/services/KokoroTokenizer'

/**
 * TextToSpeechPipeline.ts
 * 
 * Pipeline for text-to-speech synthesis (Kokoro-82M models).
 * Uses transformers.js with ONNX models for browser-based TTS.
 * 
 * Note: Kokoro-82M uses ONNX format and may require special handling.
 * Model: onnx-community/Kokoro-82M-v1.0-ONNX
 */

const prefix = '[TextToSpeechPipeline]'
const LOG_CONFIG_CHANGE = false
const LOG_LOADING = false

/**
 * TextToSpeechPipeline - For text-to-speech synthesis
 * Supports Kokoro-82M and other TTS models via transformers.js
 */
type ModelLoadOptions = {
  dtype?: Dtype
  device?: Device
  use_external_data_format?: boolean
  progress_callback?: (data: { status?: string; progress?: number; file?: string; loaded?: number; total?: number }) => void
}

export class TextToSpeechPipeline extends BasePipeline<TextToSpeechConfig> {
  private vocoder: unknown = null
  private kokoroTokenizer: KokoroTokenizer | null = null

  async load(
    config: TextToSpeechConfig,
    progressCallback?: EnhancedProgressCallback,
    loadId?: string
  ): Promise<void> {
    const needsReload = this.needsReload(config)

    if (needsReload) {
      if (this.currentConfig !== null) {
        if (LOG_CONFIG_CHANGE) {
          console.log(prefix, 'Config changed, resetting pipeline')
        }
        this.reset()
      }

      this.currentConfig = config

      if (LOG_LOADING) {
        console.log(prefix, 'Loading model:', config.toObject())
      }
    }

    // Send initiate progress
    progressCallback?.({
      status: LoadingStatusTypes.INITIATE,
      file: JSON.stringify(config.dtype),
      progress: 0,
      loadId,
      message: 'Starting text-to-speech model load...',
    })

    // Lazy load tokenizer
    if (!this.tokenizer) {
      progressCallback?.({
        status: LoadingStatusTypes.PROGRESS,
        file: 'tokenizer',
        progress: 10,
        loadId,
        message: 'Loading tokenizer...',
      })

      const { AutoTokenizer } = await import('@huggingface/transformers')
      this.tokenizer = await AutoTokenizer.from_pretrained(config.modelId, {
        progress_callback: this.wrapProgressCallback(progressCallback, loadId, 'tokenizer', [10, 30]),
      })
    }

    // Lazy load TTS model
    // For Kokoro, we may need to use AutoModelForTextToSpeech or similar
    // Check if modelId contains 'kokoro' to use appropriate model class
    if (!this.model) {
      progressCallback?.({
        status: LoadingStatusTypes.PROGRESS,
        file: 'model',
        progress: 30,
        loadId,
        message: 'Loading TTS model...',
      })

      const lowerModelId = config.modelId.toLowerCase()
      
      // Try SpeechT5ForTextToSpeech first (for SpeechT5 models)
      // For Kokoro, transformers.js may need AutoModelForTextToSpeech or custom handling
      if (lowerModelId.includes('kokoro')) {
        // Initialize Kokoro-specific tokenizer
        // For Kokoro, transformers.js should handle tokenization automatically
        // The AutoTokenizer we loaded above should work if Kokoro includes tokenizer config
        if (!this.kokoroTokenizer) {
          // Create tokenizer wrapper - transformers.js tokenizer should already be loaded
          this.kokoroTokenizer = createKokoroTokenizer({
            useBackend: false, // Set to true if you want to use backend misaki instead
            backendUrl: undefined,
          })
          
          // Use the transformers.js tokenizer we already loaded
          // ✅ Kokoro includes tokenizer.json and tokenizer_config.json - transformers.js loads them automatically
          if (this.tokenizer) {
            this.kokoroTokenizer.setTokenizer(this.tokenizer)
            if (LOG_LOADING) {
              console.log(
                prefix,
                '✅ Using transformers.js tokenizer for Kokoro (tokenizer.json loaded automatically)'
              )
            }
          } else {
            console.warn(
              prefix,
              'No tokenizer loaded. This should not happen - Kokoro includes tokenizer files.'
            )
          }
        }

        // Kokoro uses ONNX - leverage kokoro-js helper which wraps the model + vocoder
        const { KokoroTTS } = await import('kokoro-js')

        const supportedKokoroDtypes: Array<'fp32' | 'fp16' | 'q8' | 'q4' | 'q4f16'> = ['fp32', 'fp16', 'q8', 'q4', 'q4f16']
        let dtypeOption: 'fp32' | 'fp16' | 'q8' | 'q4' | 'q4f16' = 'fp32'
        if (typeof config.dtype === 'string' && supportedKokoroDtypes.includes(config.dtype as 'fp32' | 'fp16' | 'q8' | 'q4' | 'q4f16')) {
          dtypeOption = config.dtype as 'fp32' | 'fp16' | 'q8' | 'q4' | 'q4f16'
        }

        progressCallback?.({
          status: LoadingStatusTypes.PROGRESS,
          file: 'model',
          progress: 60,
          loadId,
          message: 'Initializing Kokoro TTS…',
        })

        this.model = await KokoroTTS.from_pretrained(config.modelId, {
          dtype: dtypeOption,
        })
      } else {
        // For SpeechT5 models
        const { SpeechT5ForTextToSpeech } = await import('@huggingface/transformers')
        const modelOptions = this.createModelOptions(config, progressCallback, loadId, [30, 70])
        this.model = await SpeechT5ForTextToSpeech.from_pretrained(config.modelId, modelOptions)

        // Load vocoder for SpeechT5 models
        if (!this.vocoder) {
          progressCallback?.({
            status: LoadingStatusTypes.PROGRESS,
            file: 'vocoder',
            progress: 70,
            loadId,
            message: 'Loading vocoder...',
          })

          const vocoderId = config.vocoderId || 'Xenova/speecht5_hifigan'
          const { SpeechT5HifiGan } = await import('@huggingface/transformers')
          this.vocoder = await SpeechT5HifiGan.from_pretrained(vocoderId, {
            dtype: 'fp32', // Vocoder needs fp32 for quality
            progress_callback: this.wrapProgressCallback(progressCallback, loadId, 'vocoder', [70, 95]),
          })
        }
      }
    }

    // Send completion message
    progressCallback?.({
      status: LoadingStatusTypes.DONE,
      file: 'model',
      progress: 100,
      loadId,
      message: 'Text-to-speech model ready!',
    })
  }

  /**
   * Get vocoder instance (for SpeechT5 models)
   */
  getVocoder(): unknown {
    return this.vocoder
  }

  /**
   * Get Kokoro tokenizer instance
   */
  getKokoroTokenizer(): KokoroTokenizer | null {
    return this.kokoroTokenizer
  }

  /**
   * Tokenize text for Kokoro models
   * Returns token IDs ready for model input
   */
  async tokenizeForKokoro(text: string): Promise<number[]> {
    if (!this.kokoroTokenizer) {
      throw new Error('Kokoro tokenizer not initialized. Load Kokoro model first.')
    }

    const result = await this.kokoroTokenizer.tokenize(text)
    return result.tokenIds
  }

  override reset(): void {
    super.reset()
    this.vocoder = null
    this.kokoroTokenizer = null
  }

  private createModelOptions(
    config: TextToSpeechConfig,
    progressCallback: EnhancedProgressCallback | undefined,
    loadId: string | undefined,
    progressRange: [number, number]
  ): ModelLoadOptions {
    return {
      dtype: config.dtype,
      device: config.device,
      use_external_data_format: config.useExternalData,
      progress_callback: this.wrapProgressCallback(progressCallback, loadId, 'model', progressRange),
    }
  }

  override isLoaded(): boolean {
    // For Kokoro, vocoder may not be needed
    // For SpeechT5, vocoder is required
    const lowerModelId = this.currentConfig?.modelId.toLowerCase() || ''
    if (lowerModelId.includes('kokoro')) {
      return this.tokenizer !== null && this.model !== null
    }
    return this.tokenizer !== null && this.model !== null && this.vocoder !== null
  }
}

