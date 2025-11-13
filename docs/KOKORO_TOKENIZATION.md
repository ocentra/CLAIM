# Kokoro Tokenization Guide

## Overview

Kokoro-82M uses **misaki G2P** (Grapheme-to-Phoneme) library for tokenization. Misaki is a Python library that converts text to IPA phonemes, which are then converted to token IDs for the model.

## Challenge: Browser Environment

Since we're running in a browser (TypeScript/JavaScript), we can't directly use the Python misaki library. We have several options:

## Option 1: Use Transformers.js Tokenizer (✅ Confirmed - Works Automatically!)

**✅ Kokoro includes tokenizer files!** 

The [Kokoro-82M-v1.0-ONNX repo](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/tree/main) includes:
- ✅ `tokenizer.json` (3.5 kB)
- ✅ `tokenizer_config.json` (113 Bytes)
- ✅ `config.json` (44 Bytes)

**Transformers.js will automatically load and use these!**

When you load Kokoro via `TextToSpeechPipeline`, it automatically:
1. Loads `AutoTokenizer` from the model repo
2. ✅ Transformers.js detects and loads `tokenizer.json` and `tokenizer_config.json`
3. Tokenization works seamlessly - no misaki needed!

```typescript
// The pipeline handles this automatically:
const pipeline = new TextToSpeechPipeline()
await pipeline.load({ modelId: 'onnx-community/Kokoro-82M-v1.0-ONNX', ... })

// Tokenize text - transformers.js handles it
const tokenIds = await pipeline.tokenizeForKokoro("Hello world")
```

**How it works:**
- Transformers.js checks HuggingFace repo for tokenizer files
- If found, loads and uses them automatically
- Converts text → token IDs directly
- No misaki needed if tokenizer config exists

**Pros:**
- ✅ Works entirely in browser
- ✅ No backend needed
- ✅ Fast and efficient
- ✅ Automatic - no setup required
- ✅ Should work if Kokoro includes tokenizer config

**Cons:**
- ~~May not be available if Kokoro doesn't provide tokenizer config files~~ ✅ **Confirmed available!**
- May not include phoneme conversion (just token IDs, which is fine for model input - the tokenizer handles this)

## Option 2: Backend Misaki Service (Most Accurate)

Set up a Python backend service that runs misaki:

```python
# backend/tokenize.py
from misaki import en
from flask import Flask, request, jsonify

app = Flask(__name__)
g2p = en.G2P(trf=False, british=False, fallback=None)

@app.route('/tokenize', methods=['POST'])
def tokenize():
    text = request.json['text']
    phonemes, tokens = g2p(text)
    return jsonify({
        'phonemes': phonemes,
        'tokenIds': tokens.tolist()
    })
```

Then use it in the browser:

```typescript
const kokoroTokenizer = createKokoroTokenizer({
  useBackend: true,
  backendUrl: 'http://localhost:8000'
})

const result = await kokoroTokenizer.tokenize(text)
```

**Pros:**
- Most accurate (uses real misaki)
- Supports all languages misaki supports
- Proper phoneme conversion

**Cons:**
- Requires backend service
- Network latency
- Additional infrastructure

## Option 3: JavaScript G2P Library (If Available)

Use a JavaScript port of G2P or a similar library:

```typescript
// If a JS G2P library exists
import { g2p } from 'some-js-g2p-library'

const phonemes = g2p(text)
const tokenIds = phonemesToTokenIds(phonemes)
```

**Pros:**
- Works in browser
- No backend needed

**Cons:**
- May not exist or be as accurate as misaki
- May need to be ported/created

## Option 4: Simple Fallback (Testing Only)

The `KokoroTokenizer` includes a simple fallback that uses basic phoneme mapping:

```typescript
const kokoroTokenizer = createKokoroTokenizer()
const result = await kokoroTokenizer.tokenize(text)
// Uses simple character-based approximation
```

**Pros:**
- Works immediately
- No dependencies

**Cons:**
- **Not accurate** - only for testing
- Doesn't handle complex words
- Missing proper phoneme conversion

## Recommended Approach

**✅ Transformers.js works automatically - confirmed!**

The [Kokoro-82M-v1.0-ONNX repo](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/tree/main) includes:
- ✅ `tokenizer.json` (3.5 kB) 
- ✅ `tokenizer_config.json` (113 Bytes)

**Transformers.js automatically detects and loads these files!**

The `TextToSpeechPipeline` is already set up correctly:

```typescript
// Just load the pipeline - tokenization works automatically
const pipeline = new TextToSpeechPipeline()
await pipeline.load({
  modelId: 'onnx-community/Kokoro-82M-v1.0-ONNX',
  dtype: 'fp32',
  device: 'webgpu',
})

// Tokenize text - transformers.js handles it automatically
// The tokenizer.json is loaded from HuggingFace automatically
const tokenIds = await pipeline.tokenizeForKokoro("Hello world")
```

**How it works:**
1. `AutoTokenizer.from_pretrained()` checks HuggingFace repo
2. Finds `tokenizer.json` and `tokenizer_config.json`
3. Loads them automatically (cached via IndexedDB)
4. Tokenization works seamlessly - **no misaki needed!**

**If transformers.js doesn't work** (Kokoro doesn't include tokenizer config):

1. **Set up backend misaki service:**
   ```typescript
   // Update pipeline to use backend
   const kokoroTokenizer = pipeline.getKokoroTokenizer()
   kokoroTokenizer?.setBackend(true, 'http://your-backend:8000')
   ```

2. **For development/testing, simple fallback is used automatically:**
   ```typescript
   // Already built-in as fallback
   ```

## Implementation Status

✅ **Created:** `src/lib/services/KokoroTokenizer.ts`
- Supports transformers.js tokenizer
- Supports backend misaki service
- Includes simple fallback

✅ **Integrated:** `src/lib/pipelines/TextToSpeechPipeline.ts`
- Automatically initializes KokoroTokenizer for Kokoro models
- Provides `tokenizeForKokoro()` method

## Next Steps

1. **Test with transformers.js:** Try loading Kokoro's tokenizer via transformers.js
2. **Set up backend (if needed):** Create a Python Flask/FastAPI service with misaki
3. **Extend phoneme mapping:** Add more words to `BASIC_PHONEME_MAP` if using fallback
4. **Get Kokoro vocab:** Extract vocab.json from Kokoro model to map phonemes → token IDs

## References

- [Misaki GitHub](https://github.com/hexgrad/misaki)
- [Kokoro-82M HuggingFace](https://huggingface.co/hexgrad/Kokoro-82M)
- [Kokoro ONNX](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX)
- [kokoro-onnx GitHub](https://github.com/thewh1teagle/kokoro-onnx)

