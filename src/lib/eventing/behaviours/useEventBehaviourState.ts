import { useEventBus } from '@lib/eventing/hooks';
import { useBehaviourState } from '@lib/react-behaviours';
import type { EventBehaviour, EventBehaviourContext } from '@lib/eventing/behaviours';

interface UseEventBehaviourStateOptions {
  autoStart?: boolean;
}

export const useEventBehaviourState = <
  T extends EventBehaviour,
  S
>(
  factory: (context: EventBehaviourContext) => T,
  selector: (behaviour: T) => S,
  options?: UseEventBehaviourStateOptions
): S => {
  const eventBus = useEventBus();
  return useBehaviourState<T, S, EventBehaviourContext>(
    context => factory(context ?? { eventBus }),
    selector,
    { eventBus },
    options
  );
};

