// KokoroTokenizer.ts
// Tokenization helper for Kokoro-82M TTS models
// Converts text to phonemes (IPA) and then to token IDs

/**
 * KokoroTokenizer - Handles text-to-phoneme conversion for Kokoro models
 * 
 * Note: Kokoro uses misaki G2P library (Python) for phoneme conversion.
 * In browser, we have options:
 * 1. Use Kokoro's built-in tokenizer if available via transformers.js
 * 2. Use a simplified phoneme mapping for common words
 * 3. Call a backend service that runs misaki
 * 4. Use a JavaScript G2P library (if available)
 * 
 * For now, this provides a basic structure that can be extended.
 */

const prefix = '[KokoroTokenizer]'
const LOG_TOKENIZATION = false

type TokenizerCallableResult = {
  input_ids?: unknown
} | number[]

type TransformersTokenizer = {
  (text: string, options?: Record<string, unknown>): Promise<TokenizerCallableResult> | TokenizerCallableResult
  tokenize?: (text: string) => Promise<TokenizerCallableResult> | TokenizerCallableResult
  encode?: (text: string) => Promise<TokenizerCallableResult> | TokenizerCallableResult
}

export interface KokoroTokenizationResult {
  phonemes: string[] // IPA phoneme symbols
  tokenIds: number[] // Token IDs for the model
  text: string // Original text
}

/**
 * Basic phoneme mapping for common English words
 * This is a simplified fallback - full misaki would be more accurate
 */
const BASIC_PHONEME_MAP: Record<string, string[]> = {
  hello: ['h', 'ə', 'l', 'oʊ'],
  world: ['w', 'ɜː', 'l', 'd'],
  kokoro: ['k', 'oʊ', 'k', 'oʊ', 'ɹ', 'oʊ'],
  // Add more common words as needed
}

/**
 * Convert IPA phonemes to Kokoro token IDs
 * This mapping needs to match Kokoro's vocabulary
 * 
 * Note: The actual token IDs depend on Kokoro's tokenizer configuration.
 * You may need to:
 * 1. Extract the vocab.json from the Kokoro model
 * 2. Map phonemes to token IDs based on that vocab
 * 3. Or use transformers.js tokenizer if Kokoro provides one
 */
function phonemesToTokenIds(phonemes: string[]): number[] {
  // Placeholder implementation
  // In reality, you'd need Kokoro's vocab mapping
  const tokenIds: number[] = []
  
  for (const phoneme of phonemes) {
    // Map phoneme to token ID (this is simplified - actual mapping needed)
    // Token IDs typically start from 0 or some base value
    const tokenId = phoneme.charCodeAt(0) % 1000 // Placeholder
    tokenIds.push(tokenId)
  }
  
  return tokenIds
}

/**
 * Simple text-to-phoneme conversion (fallback)
 * For production, use misaki via backend or a JS port
 */
function textToPhonemesSimple(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/)
  const phonemes: string[] = []
  
  for (const word of words) {
    // Check if we have a mapping
    if (BASIC_PHONEME_MAP[word]) {
      phonemes.push(...BASIC_PHONEME_MAP[word])
    } else {
      // Fallback: simple character-based approximation
      // This is NOT accurate - just a placeholder
      for (const char of word) {
        if (/[aeiou]/.test(char)) {
          phonemes.push('ə') // Schwa as placeholder
        } else if (/[bcdfghjklmnpqrstvwxyz]/.test(char)) {
          phonemes.push(char)
        }
      }
    }
    phonemes.push(' ') // Word separator
  }
  
  return phonemes.filter((p) => p !== '')
}

/**
 * KokoroTokenizer class
 * Handles tokenization for Kokoro TTS models
 */
export class KokoroTokenizer {
  private tokenizer: TransformersTokenizer | null = null
  private useBackend: boolean = false
  private backendUrl?: string

  constructor(options?: { useBackend?: boolean; backendUrl?: string }) {
    this.useBackend = options?.useBackend ?? false
    this.backendUrl = options?.backendUrl
  }

  /**
   * Initialize tokenizer from transformers.js (if Kokoro provides one)
   * Note: This is usually not needed - the pipeline loads the tokenizer automatically
   * Use setTokenizer() instead if you already have a tokenizer instance
   */
  async initializeFromTransformers(modelId: string): Promise<void> {
    try {
      const { AutoTokenizer } = await import('@huggingface/transformers')
      const maybeTokenizer = await AutoTokenizer.from_pretrained(modelId)
      if (this.isTransformersTokenizer(maybeTokenizer)) {
        this.tokenizer = maybeTokenizer
        if (LOG_TOKENIZATION) {
          console.log(prefix, 'Initialized tokenizer from transformers.js')
        }
      } else {
        console.warn(prefix, 'Loaded tokenizer does not match expected signature.')
        this.tokenizer = null
      }
    } catch (error) {
      console.warn(prefix, 'Failed to load tokenizer from transformers.js:', error)
      this.tokenizer = null
    }
  }

  /**
   * Tokenize text using backend misaki service
   */
  async tokenizeViaBackend(text: string): Promise<KokoroTokenizationResult> {
    if (!this.backendUrl) {
      throw new Error('Backend URL not configured for misaki tokenization')
    }

    try {
      const response = await fetch(`${this.backendUrl}/tokenize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Backend tokenization failed: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        phonemes: result.phonemes || [],
        tokenIds: result.tokenIds || [],
        text,
      }
    } catch (error) {
      console.error(prefix, 'Backend tokenization error:', error)
      throw error
    }
  }

  /**
   * Tokenize text using transformers.js tokenizer (if available)
   */
  async tokenizeViaTransformers(text: string): Promise<KokoroTokenizationResult> {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not initialized. Call initializeFromTransformers first.')
    }

    try {
      const tokenizer = this.tokenizer
      const encoded = await this.callTokenizer(tokenizer, text)
      const tokenIds = this.extractInputIds(encoded)

      return {
        phonemes: [], // transformers.js doesn't provide phonemes
        tokenIds,
        text,
      }
    } catch (error) {
      console.error(prefix, 'Transformers tokenization error:', error)
      throw error
    }
  }

  /**
   * Main tokenization method
   * Tries different approaches in order of preference:
   * 1. transformers.js tokenizer (preferred - works automatically if Kokoro includes tokenizer config)
   * 2. Backend misaki service (most accurate phoneme conversion)
   * 3. Simple fallback (testing only - not accurate)
   */
  async tokenize(text: string): Promise<KokoroTokenizationResult> {
    // Option 1: Use transformers.js tokenizer (preferred - works automatically)
    // This should work if Kokoro's HuggingFace repo includes tokenizer files
    if (this.tokenizer) {
      try {
        return await this.tokenizeViaTransformers(text)
      } catch (error) {
        console.warn(prefix, 'Transformers tokenization failed, trying fallback:', error)
        // Continue to next option
      }
    }

    // Option 2: Use backend misaki service (most accurate phoneme conversion)
    if (this.useBackend && this.backendUrl) {
      try {
        return await this.tokenizeViaBackend(text)
      } catch (error) {
        console.warn(prefix, 'Backend tokenization failed, falling back:', error)
      }
    }

    // Option 3: Simple fallback (not accurate, just for testing)
    if (LOG_TOKENIZATION) {
      console.warn(
        prefix,
        'Using simple phoneme mapping (not accurate). ' +
          'Transformers.js tokenizer should work automatically if Kokoro includes tokenizer config.'
      )
    }

    const phonemes = textToPhonemesSimple(text)
    const tokenIds = phonemesToTokenIds(phonemes)

    return {
      phonemes,
      tokenIds,
      text,
    }
  }

  /**
   * Set tokenizer instance (from transformers.js)
   */
  setTokenizer(tokenizer: unknown): void {
    if (this.isTransformersTokenizer(tokenizer)) {
      this.tokenizer = tokenizer
    } else {
      throw new Error('Provided tokenizer does not match expected signature')
    }
  }

  /**
   * Get current tokenizer instance
   */
  getTokenizer(): TransformersTokenizer | null {
    return this.tokenizer
  }

  private isTransformersTokenizer(value: unknown): value is TransformersTokenizer {
    return typeof value === 'function'
  }

  private async callTokenizer(tokenizer: TransformersTokenizer, text: string): Promise<TokenizerCallableResult> {
    const primary = await Promise.resolve(
      tokenizer(text, {
        return_tensors: 'pt',
      }),
    )

    if (this.hasInputIds(primary) || Array.isArray(primary)) {
      return primary
    }

    if (tokenizer.encode) {
      const encoded = await Promise.resolve(tokenizer.encode(text))
      if (this.hasInputIds(encoded) || Array.isArray(encoded)) {
        return encoded
      }
    }

    if (tokenizer.tokenize) {
      const tokenized = await Promise.resolve(tokenizer.tokenize(text))
      if (this.hasInputIds(tokenized) || Array.isArray(tokenized)) {
        return tokenized
      }
    }

    throw new Error('Tokenizer did not return input_ids or token array')
  }

  private hasInputIds(value: unknown): value is { input_ids?: unknown } {
    return typeof value === 'object' && value !== null && 'input_ids' in value
  }

  private extractInputIds(result: TokenizerCallableResult): number[] {
    if (Array.isArray(result)) {
      return result.map((item) => this.toNumber(item))
    }

    const maybeIds = result.input_ids
    if (Array.isArray(maybeIds)) {
      const first = maybeIds[0]
      if (Array.isArray(first)) {
        return first.map((item) => this.toNumber(item))
      }
      return maybeIds.map((item) => this.toNumber(item))
    }

    throw new Error('Tokenization result did not contain input_ids')
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'bigint') {
      return Number(value)
    }
    throw new Error(`Unexpected token id value: ${String(value)}`)
  }
}

/**
 * Create a KokoroTokenizer instance
 */
export function createKokoroTokenizer(options?: {
  useBackend?: boolean
  backendUrl?: string
}): KokoroTokenizer {
  return new KokoroTokenizer(options)
}

