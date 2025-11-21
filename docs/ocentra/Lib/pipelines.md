# ML Pipelines Library

**Purpose:** ML model pipeline system for text generation, text-to-speech, and Whisper (speech-to-text).

**Location:** `src/lib/pipelines/`

---

## What It Provides

### Base Pipeline

**Location:** `src/lib/pipelines/BasePipeline.ts`

Abstract base class for all pipelines:
- Config management
- Model loading/unloading
- Progress tracking
- Error handling

### Specific Pipelines

1. **TextGenerationPipeline** - Text generation models
2. **TextToSpeechPipeline** - Text-to-speech models
3. **WhisperPipeline** - Speech-to-text models

---

## Quick Start

### Using a Pipeline

```typescript
import { TextGenerationPipeline } from '@lib/pipelines'

const pipeline = new TextGenerationPipeline()

// Load model
await pipeline.load(config, (progress) => {
  console.log(`Loading: ${progress.progress}%`)
})

// Generate text
const result = await pipeline.generate('Prompt text')

// Unload when done
await pipeline.unload()
```

---

## Key Features

### 1. Config Management

```typescript
interface PipelineConfig {
  modelId: string
  task: string
  // ... other config options
}

// Check if reload needed
if (pipeline.needsReload(newConfig)) {
  await pipeline.unload()
  await pipeline.load(newConfig)
}
```

### 2. Progress Tracking

```typescript
await pipeline.load(config, (progress) => {
  console.log(`Component: ${progress.component}`)
  console.log(`Progress: ${progress.progress}%`)
  console.log(`Status: ${progress.status}`)
})
```

### 3. Error Handling

```typescript
try {
  await pipeline.load(config)
} catch (error) {
  console.error('Failed to load pipeline', error)
  // Handle error
}
```

---

## API Reference

### BasePipeline

| Method | Purpose |
|--------|---------|
| `load(config, progressCallback?)` | Load model |
| `unload()` | Unload model |
| `needsReload(config)` | Check if reload needed |
| `isLoaded()` | Check if loaded |

### Pipeline Types

| Pipeline | Purpose |
|----------|---------|
| `TextGenerationPipeline` | Text generation |
| `TextToSpeechPipeline` | Text-to-speech |
| `WhisperPipeline` | Speech-to-text |

---

## When to Use

✅ **Use Pipelines when:**
- Need ML model pipelines (text generation, TTS, STT)
- Need progress tracking for model loading
- Need config management for models

❌ **Don't use Pipelines when:**
- Direct model access needed (use transformers.js directly)
- No ML models needed

---

## Related Docs

- [../AILogic/ai-provider-abstraction.md](../AILogic/ai-provider-abstraction.md) - AI provider abstraction (may use pipelines)

---

**Last Updated:** 2025-01-20  
**Location:** `src/lib/pipelines/`

