# AI Provider Abstraction Pattern

**Purpose:** How LLM providers (Azure OpenAI, OpenAI, Claude, local models) are abstracted. Shows the pattern of provider selection, initialization, and request handling.

**Important:** Unity uses its own provider abstraction system. Web uses a different provider abstraction (see `src/ai/`). The abstraction pattern is similar, but implementation details differ.

---

## Unity Pattern (Reference)

### Provider Discovery & Registration

**Source:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIModelManager.cs` (lines 33-48)

```csharp
public override async UniTask InitializeAsync()
{
    ScriptableObject[] services = Resources.LoadAll<ScriptableObject>("");

    foreach (ScriptableObject service in services)
    {
        if (service is ILLMService { Provider: not null } llmService)
        {
            Providers.TryAdd(llmService.Provider as LLMProvider, llmService);
            AllProviders.TryAdd(llmService.Provider.Name, service);
        }
    }
    // ...
}
```

**Pattern:**
- Scans `Resources/` folder for `ILLMService` implementations
- Registers providers in dictionary (Provider → Service)
- Uses Unity's `Resources.LoadAll<T>()` pattern

### Provider Selection & Initialization

**Source:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIModelManager.cs` (lines 70-99)

```csharp
public async UniTask SetLLMProvider(LLMProvider provider)
{
    if (ConfigManager == null)
    {
        UniTaskCompletionSource<IConfigManager> completionSource = 
            new UniTaskCompletionSource<IConfigManager>();
        await EventBus.Instance.PublishAsync(
            new RequestConfigManagerEvent<UnityServicesManager>(completionSource));
        ConfigManager = await completionSource.Task;
    }

    if (ConfigManager != null)
    {
        if (ConfigManager.TryGetConfigForProvider(provider, out ILLMConfig config))
        {
            if (Providers.TryGetValue(provider, out ILLMService llmService))
            {
                llmService.InitializeAsync(config); // Initialize provider
            }
        }
    }
}
```

**Pattern:**
1. Request config manager via event (if not available)
2. Get provider config from config manager
3. Get provider service from registry
4. Initialize provider with config

### Provider Request Handling

**Source:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIModelManager.cs` (lines 102-112)

```csharp
public async UniTask<string> GetLLMResponse(GameMode gameMode, ulong playerID)
{
    (string systemMessage, string userPrompt) = 
        AIHelper.Instance.GetAIInstructions(gameMode, playerID);
    
    if (CurrentLLMService == null)
    {
        Debug.LogError("LLM Service is not initialized!");
        return null;
    }

    return await CurrentLLMService.GetResponseAsync(systemMessage, userPrompt);
}
```

**Pattern:**
1. Get prompts from AIHelper
2. Check if provider is initialized
3. Forward request to current provider
4. Return response

### Base Provider Implementation

**Source:** `References/Scripts/OcentraAI/LLMGames/LLMServices/BaseLLMService.cs` (lines 30-82)

```csharp
public async UniTask<string> GetResponseAsync(string systemMessage, string userPrompt)
{
    try
    {
        object requestContent = GenerateRequestContent(systemMessage, userPrompt);
        string jsonData = JsonConvert.SerializeObject(requestContent);
        
        UnityWebRequest webRequest = new UnityWebRequest(
            LLMConfig.Endpoint + LLMConfig.ApiUrl, "POST")
        {
            uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(jsonData)),
            downloadHandler = new DownloadHandlerBuffer()
        };
        webRequest.SetRequestHeader("Content-Type", "application/json");
        webRequest.SetRequestHeader("Authorization", "Bearer " + LLMConfig.ApiKey);

        UnityWebRequestAsyncOperation operation = webRequest.SendWebRequest();

        while (!operation.isDone)
        {
            await Task.Yield();
        }

        if (webRequest.result == UnityWebRequest.Result.Success)
        {
            return ProcessResponse(webRequest.downloadHandler.text);
        }

        // Error handling...
    }
}
```

**Pattern:**
- Base class handles HTTP request/response
- Derived classes implement `GenerateRequestContent()` and `ProcessResponse()`
- Uses Unity's `UnityWebRequest` for HTTP

---

## Web Pattern (Current Implementation)

### Provider Abstraction

**Source:** `src/ai/` (see actual implementation)

**Note:** Web uses a different provider abstraction system. Check `src/ai/` for current implementation details.

**Pattern (likely similar):**
- Provider registry (map provider → service)
- Provider initialization (with config)
- Request forwarding (to current provider)
- Response parsing (from provider)

### Key Differences

**Unity:**
- Uses Unity's `Resources.LoadAll<T>()` for discovery
- Uses `ScriptableObject` for provider implementations
- Uses `UnityWebRequest` for HTTP
- Uses `UniTask` for async

**Web:**
- Uses different discovery mechanism (TBD - check `src/ai/`)
- Uses TypeScript classes/interfaces for provider implementations
- Uses `fetch` or similar for HTTP
- Uses `Promise` for async

---

## Universal Abstraction Pattern

**Regardless of implementation (Unity vs Web), the abstraction pattern is:**

### 1. Provider Registry
```typescript
Map<Provider, Service> // Provider → Service instance
```

### 2. Provider Initialization
```typescript
async initializeProvider(provider: Provider, config: Config) {
  const service = registry.get(provider)
  await service.initialize(config)
  currentProvider = service
}
```

### 3. Request Forwarding
```typescript
async getResponse(systemMessage: string, userPrompt: string) {
  if (!currentProvider) throw new Error("No provider initialized")
  return await currentProvider.getResponse(systemMessage, userPrompt)
}
```

**This pattern works for any provider system.**

---

## Related Docs

- [ai-prompt-construction.md](./ai-prompt-construction.md) - How prompts are built (before sending to provider)
- [ai-event-driven-pattern.md](./ai-event-driven-pattern.md) - How game state is queried (before building prompts)
- [../Phases/phase-08-ai-integration.md](../Phases/phase-08-ai-integration.md) - AI Integration phase

