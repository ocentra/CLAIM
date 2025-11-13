/// <reference lib="dom" />
import {
  type PipelineType,
  type DtypeSimple,
  type Dtype,
  type Device,
  type DeviceSimple,
  type IBaseModelConfig,
  type ITextGenerationConfig,
  type ISpeechRecognitionConfig,
  type ITextToSpeechConfig,
} from './PipelineTypes';

/**
 * PipelineConfigs.ts
 * 
 * Configuration classes for different pipeline types.
 * Includes DeviceCapabilities utility for GPU detection.
 */

const prefix = '[PipelineConfigs]';
const LOG_GENERAL = false;
const LOG_MODEL_LOADING = false;

// =============================================================================
// DEVICE CAPABILITIES
// =============================================================================

/**
 * DeviceCapabilities - Utility class for GPU detection and capabilities
 * Shared across all pipelines to avoid redundant checks
 */
export class DeviceCapabilities {
  private static _hasWebGPU: boolean | null = null;
  private static _hasFP16: boolean | null = null;
  private static _checkPromise: Promise<void> | null = null;

  /**
   * Initialize and detect GPU capabilities
   */
  static async initialize(): Promise<void> {
    if (this._checkPromise) {
      return this._checkPromise;
    }

    this._checkPromise = (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isNavigatorGpuAvailable = typeof navigator !== 'undefined' && !!(navigator as any).gpu;
        
        if (!isNavigatorGpuAvailable) {
          this._hasWebGPU = false;
          this._hasFP16 = false;
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (!adapter) {
          this._hasWebGPU = false;
          this._hasFP16 = false;
          return;
        }

        this._hasWebGPU = true;
        this._hasFP16 = adapter.features.has('shader-f16');
        
        if (LOG_GENERAL) {
          console.log(prefix, `[DeviceCapabilities] WebGPU: ${this._hasWebGPU}, FP16: ${this._hasFP16}`);
        }
      } catch (error) {
        this._hasWebGPU = false;
        this._hasFP16 = false;
        if (LOG_GENERAL) {
          console.error(prefix, '[DeviceCapabilities] Detection failed:', error);
        }
      }
    })();

    return this._checkPromise;
  }

  /**
   * Check if WebGPU is available
   */
  static async hasWebGPU(): Promise<boolean> {
    await this.initialize();
    return this._hasWebGPU ?? false;
  }

  /**
   * Check if FP16 is supported
   */
  static async hasFP16(): Promise<boolean> {
    await this.initialize();
    return this._hasFP16 ?? false;
  }

  /**
   * Get best available device
   */
  static async getBestDevice(): Promise<DeviceSimple> {
    const hasGPU = await this.hasWebGPU();
    return hasGPU ? 'webgpu' : 'cpu';
  }

  /**
   * Get recommended dtype based on device capabilities (generic)
   */
  static async getRecommendedDtype(preferredDtype?: DtypeSimple): Promise<DtypeSimple> {
    if (preferredDtype) return preferredDtype;
    
    const hasFP16 = await this.hasFP16();
    return hasFP16 ? 'q4f16' : 'q4';
  }

  /**
   * Get optimized dtype for a specific model
   * Uses model-specific presets when available
   * 
   * @param modelId - HuggingFace model ID (e.g., 'openai/whisper-tiny')
   * @param preferredDtype - Override with specific dtype if provided
   * @returns Optimized dtype configuration
   */
  static async getOptimizedDtype(modelId: string, preferredDtype?: Dtype): Promise<Dtype> {
    if (LOG_MODEL_LOADING) {
      console.log(prefix, `[getOptimizedDtype] Input:
        modelId: ${modelId}
        preferredDtype: ${JSON.stringify(preferredDtype)}`);
    }
    
    if (preferredDtype) {
      if (LOG_MODEL_LOADING) {
        console.log(prefix, `[getOptimizedDtype] Using preferredDtype: ${JSON.stringify(preferredDtype)}`);
      }
      return preferredDtype;
    }
    
    const hasGPU = await this.hasWebGPU();
    const hasFP16Support = await this.hasFP16();
    
    // Simple dtype selection - prefer q4f16 if FP16 supported, otherwise q4
    const dtype = hasFP16Support ? 'q4f16' : 'q4';
    
    if (LOG_MODEL_LOADING) {
      console.log(prefix, `[getOptimizedDtype] Auto-selected dtype: ${JSON.stringify(dtype)} (hasGPU=${hasGPU}, hasFP16=${hasFP16Support})`);
    }
    
    return dtype;
  }

  /**
   * Get optimized device for a specific model
   * 
   * @param modelId - HuggingFace model ID
   * @param preferredDevice - Override with specific device if provided
   * @returns Optimized device configuration
   */
  static async getOptimizedDevice(modelId: string, preferredDevice?: Device): Promise<Device> {
    if (LOG_MODEL_LOADING) {
      console.log(prefix, `[getOptimizedDevice] Input:
        modelId: ${modelId}
        preferredDevice: ${JSON.stringify(preferredDevice)}`);
    }
    
    if (preferredDevice) {
      if (LOG_MODEL_LOADING) {
        console.log(prefix, `[getOptimizedDevice] Using preferredDevice: ${JSON.stringify(preferredDevice)}`);
      }
      return preferredDevice;
    }
    
    const hasGPU = await this.hasWebGPU();
    const device = hasGPU ? 'webgpu' : 'cpu';
    
    if (LOG_MODEL_LOADING) {
      console.log(prefix, `[getOptimizedDevice] Auto-selected device: ${JSON.stringify(device)} (hasGPU=${hasGPU})`);
    }
    
    return device;
  }

  /**
   * Reset cached values (for testing)
   */
  static reset(): void {
    this._hasWebGPU = null;
    this._hasFP16 = null;
    this._checkPromise = null;
  }
}

// =============================================================================
// BASE MODEL CONFIGURATION CLASS
// =============================================================================

export abstract class BaseModelConfig {
  modelId: string;
  pipelineType: PipelineType;

  constructor(config: IBaseModelConfig) {
    this.modelId = config.modelId;
    this.pipelineType = config.pipelineType;
    this.validate();
  }

  protected validate(): void {
    if (!this.modelId || this.modelId.trim().length === 0) {
      throw new Error('ModelConfig: modelId is required');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract equals(other: any): boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract clone(): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract toObject(): any;
}

// =============================================================================
// TEXT GENERATION CONFIG
// =============================================================================

export class TextGenerationConfig extends BaseModelConfig implements ITextGenerationConfig {
  dtype: Dtype;
  device: Device;
  useExternalData: boolean;
  pipelineType = 'text-generation' as const;

  constructor(config: ITextGenerationConfig) {
    super(config);
    this.dtype = config.dtype;
    this.device = config.device;
    this.useExternalData = config.useExternalData;
  }

  /**
   * Create config with auto-detected device and dtype
   * Uses model-specific optimized presets
   */
  static async createWithAutoDetect(
    modelId: string, 
    options?: { 
      dtype?: Dtype; 
      device?: Device; 
      useExternalData?: boolean;
    }
  ): Promise<TextGenerationConfig> {
    if (LOG_MODEL_LOADING) {
      console.log(prefix, `[TextGenerationConfig.createWithAutoDetect] Input:
        modelId: ${modelId}
        options.dtype: ${JSON.stringify(options?.dtype)}
        options.device: ${JSON.stringify(options?.device)}
        options.useExternalData: ${options?.useExternalData}`);
    }
    
    const device = await DeviceCapabilities.getOptimizedDevice(modelId, options?.device);
    const dtype = await DeviceCapabilities.getOptimizedDtype(modelId, options?.dtype);
    
    if (LOG_MODEL_LOADING) {
      console.log(prefix, `[TextGenerationConfig.createWithAutoDetect] Final config:
        modelId: ${modelId}
        dtype: ${JSON.stringify(dtype)}
        device: ${JSON.stringify(device)}
        useExternalData: ${options?.useExternalData ?? false}`);
    }
    
    return new TextGenerationConfig({
      modelId,
      dtype,
      device,
      useExternalData: options?.useExternalData ?? false,
      pipelineType: 'text-generation'
    });
  }

  equals(other: TextGenerationConfig | null): boolean {
    if (other === null) return false;
    return this.modelId === other.modelId &&
           JSON.stringify(this.dtype) === JSON.stringify(other.dtype) &&
           JSON.stringify(this.device) === JSON.stringify(other.device) &&
           this.useExternalData === other.useExternalData &&
           this.pipelineType === other.pipelineType;
  }

  clone(): TextGenerationConfig {
    return new TextGenerationConfig({
      modelId: this.modelId,
      dtype: this.dtype,
      device: this.device,
      useExternalData: this.useExternalData,
      pipelineType: this.pipelineType
    });
  }

  toObject(): ITextGenerationConfig {
    return {
      modelId: this.modelId,
      dtype: this.dtype,
      device: this.device,
      useExternalData: this.useExternalData,
      pipelineType: this.pipelineType
    };
  }
}

// =============================================================================
// SPEECH RECOGNITION CONFIG (WHISPER)
// =============================================================================

export class SpeechRecognitionConfig extends BaseModelConfig implements ISpeechRecognitionConfig {
  dtype: Dtype;
  device: Device;
  useExternalData: boolean;
  pipelineType = 'automatic-speech-recognition' as const;
  audioOptions?: { language?: string; task?: 'transcribe' | 'translate'; maxNewTokens?: number };

  constructor(config: ISpeechRecognitionConfig) {
    super(config);
    this.dtype = config.dtype;
    this.device = config.device;
    this.useExternalData = config.useExternalData;
    this.audioOptions = config.audioOptions;
  }

  static async createWithAutoDetect(
    modelId: string,
    options?: {
      dtype?: Dtype;
      device?: Device;
      useExternalData?: boolean;
      audioOptions?: { language?: string; task?: 'transcribe' | 'translate'; maxNewTokens?: number };
    }
  ): Promise<SpeechRecognitionConfig> {
    const device = await DeviceCapabilities.getOptimizedDevice(modelId, options?.device);
    const dtype = await DeviceCapabilities.getOptimizedDtype(modelId, options?.dtype);

    return new SpeechRecognitionConfig({
      modelId,
      dtype,
      device,
      useExternalData: options?.useExternalData ?? false,
      pipelineType: 'automatic-speech-recognition',
      audioOptions: options?.audioOptions,
    });
  }

  equals(other: SpeechRecognitionConfig | null): boolean {
    if (other === null) return false;
    return (
      this.modelId === other.modelId &&
      JSON.stringify(this.dtype) === JSON.stringify(other.dtype) &&
      JSON.stringify(this.device) === JSON.stringify(other.device) &&
      this.useExternalData === other.useExternalData &&
      this.pipelineType === other.pipelineType &&
      JSON.stringify(this.audioOptions) === JSON.stringify(other.audioOptions)
    );
  }

  clone(): SpeechRecognitionConfig {
    return new SpeechRecognitionConfig({
      modelId: this.modelId,
      dtype: this.dtype,
      device: this.device,
      useExternalData: this.useExternalData,
      pipelineType: this.pipelineType,
      audioOptions: this.audioOptions,
    });
  }

  toObject(): ISpeechRecognitionConfig {
    return {
      modelId: this.modelId,
      dtype: this.dtype,
      device: this.device,
      useExternalData: this.useExternalData,
      pipelineType: this.pipelineType,
      audioOptions: this.audioOptions,
    };
  }
}

// =============================================================================
// TEXT-TO-SPEECH CONFIG (KOKORO / SPEECHT5)
// =============================================================================

export class TextToSpeechConfig extends BaseModelConfig implements ITextToSpeechConfig {
  dtype: Dtype;
  device: Device;
  useExternalData: boolean;
  pipelineType = 'text-to-speech' as const;
  vocoderId?: string;
  speakerEmbeddingsUrl?: string;

  constructor(config: ITextToSpeechConfig) {
    super(config);
    this.dtype = config.dtype;
    this.device = config.device;
    this.useExternalData = config.useExternalData;
    this.vocoderId = config.vocoderId;
    this.speakerEmbeddingsUrl = config.speakerEmbeddingsUrl;
  }

  static async createWithAutoDetect(
    modelId: string,
    options?: {
      dtype?: Dtype;
      device?: Device;
      useExternalData?: boolean;
      vocoderId?: string;
      speakerEmbeddingsUrl?: string;
    }
  ): Promise<TextToSpeechConfig> {
    const device = await DeviceCapabilities.getOptimizedDevice(modelId, options?.device);
    // TTS typically uses fp32 for quality, but can use quantized for Kokoro
    const dtype = options?.dtype ?? (modelId.toLowerCase().includes('kokoro') ? 'fp32' : 'fp32');

    return new TextToSpeechConfig({
      modelId,
      dtype,
      device,
      useExternalData: options?.useExternalData ?? false,
      pipelineType: 'text-to-speech',
      vocoderId: options?.vocoderId,
      speakerEmbeddingsUrl: options?.speakerEmbeddingsUrl,
    });
  }

  equals(other: TextToSpeechConfig | null): boolean {
    if (other === null) return false;
    return (
      this.modelId === other.modelId &&
      JSON.stringify(this.dtype) === JSON.stringify(other.dtype) &&
      JSON.stringify(this.device) === JSON.stringify(other.device) &&
      this.useExternalData === other.useExternalData &&
      this.pipelineType === other.pipelineType &&
      this.vocoderId === other.vocoderId &&
      this.speakerEmbeddingsUrl === other.speakerEmbeddingsUrl
    );
  }

  clone(): TextToSpeechConfig {
    return new TextToSpeechConfig({
      modelId: this.modelId,
      dtype: this.dtype,
      device: this.device,
      useExternalData: this.useExternalData,
      pipelineType: this.pipelineType,
      vocoderId: this.vocoderId,
      speakerEmbeddingsUrl: this.speakerEmbeddingsUrl,
    });
  }

  toObject(): ITextToSpeechConfig {
    return {
      modelId: this.modelId,
      dtype: this.dtype,
      device: this.device,
      useExternalData: this.useExternalData,
      pipelineType: this.pipelineType,
      vocoderId: this.vocoderId,
      speakerEmbeddingsUrl: this.speakerEmbeddingsUrl,
    };
  }
}

