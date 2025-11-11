import { useEventBus } from '@lib/eventing/hooks';
import { useBehaviour } from '@lib/react-behaviours';
import type { EventBehaviour, EventBehaviourContext } from '@lib/eventing/behaviours';
import type { UseBehaviourOptions } from '@lib/react-behaviours';

export const useEventBehaviour = <
  T extends EventBehaviour
>(
  factory: (context: EventBehaviourContext) => T,
  options?: UseBehaviourOptions
): T => {
  const eventBus = useEventBus();
  return useBehaviour<T, EventBehaviourContext>(
    context => factory(context ?? { eventBus }),
    { eventBus },
    options
  );
};

