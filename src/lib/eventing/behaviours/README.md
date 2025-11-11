# Event Behaviours

`EventBehaviour` lets you encapsulate event-driven logic that can be hosted inside React components. Below is a reference example you can adapt in your own feature code.

```tsx
import { useEventBehaviourState, EventBehaviourHost } from '@lib/eventing/behaviours'
import type { EventBehaviourContext } from '@lib/eventing/behaviours'
import { EventBehaviour } from '@lib/eventing/behaviours'
import { PlayerJoinedEvent, GetLocalPlayerEvent } from '@lib/eventing/events'
import { OperationResult, createOperationDeferred } from '@lib/eventing'

interface PlayerUIBehaviourState {
  player: PlayerProfile | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error?: string
}

class PlayerUIBehaviour extends EventBehaviour<EventBehaviourContext> {
  private state: PlayerUIBehaviourState = { player: null, status: 'idle' }

  get currentState(): PlayerUIBehaviourState {
    return this.state
  }

  protected awake(): void {
    this.eventRegistrar.subscribe(PlayerJoinedEvent, this.handlePlayerJoined)
    this.eventRegistrar.subscribeAsync(GetLocalPlayerEvent, this.handleGetLocalPlayer)
  }

  protected override onStart(): void {
    void this.requestLocalPlayer()
  }

  private handlePlayerJoined = (event: PlayerJoinedEvent) => {
    this.state = { player: event.player, status: 'ready' }
    this.notifyStateChanged()
  }

  private async handleGetLocalPlayer(event: GetLocalPlayerEvent) {
    if (this.state.player) {
      event.deferred.resolve(OperationResult.success(this.state.player))
      return
    }
    event.deferred.resolve(OperationResult.failure<PlayerProfile>('LOCAL_PLAYER_NOT_AVAILABLE'))
  }

  private async requestLocalPlayer(): Promise<void> {
    this.state = { ...this.state, status: 'loading', error: undefined }
    this.notifyStateChanged()

    const deferred = createOperationDeferred<PlayerProfile>()
    const publishResult = await this.eventBus.publishAsync(new GetLocalPlayerEvent(deferred))

    if (!publishResult.isSuccess || !publishResult.value) {
      this.state = {
        player: null,
        status: 'error',
        error: publishResult.errorMessage ?? 'PLAYER_REQUEST_DISPATCH_FAILED',
      }
      this.notifyStateChanged()
      return
    }

    try {
      const result = await deferred.promise
      if (result.isSuccess && result.value) {
        this.state = { player: result.value, status: 'ready' }
      } else {
        this.state = {
          player: null,
          status: 'error',
          error: result.errorMessage ?? 'UNKNOWN_PLAYER_ERROR',
        }
      }
    } catch (error) {
      this.state = {
        player: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'PLAYER_REQUEST_FAILED',
      }
    } finally {
      this.notifyStateChanged()
    }
  }
}

export const PlayerUIBehaviourComponent = () => {
  const state = useEventBehaviourState(
    context => new PlayerUIBehaviour(context),
    behaviour => behaviour.currentState
  )

  if (state.status === 'loading') return <div>Loading player…</div>
  if (state.status === 'error') return <div>Failed to load player: {state.error}</div>
  if (!state.player) return <div>No player joined yet.</div>

  return <div>Player ready: {state.player.displayName}</div>
}

export const PlayerUIBehaviourHost = () => (
  <EventBehaviourHost
    autoStart
    create={context => new PlayerUIBehaviour(context)}
    onReady={behaviour => {
      // Attach any bootstrapping logic here (e.g. seed data for local previews)
    }}
  />
)
```

For production code, place your own behaviour implementations inside your feature folders rather than under `@lib`. This keeps the library package lean while still conveying the intended usage pattern.

