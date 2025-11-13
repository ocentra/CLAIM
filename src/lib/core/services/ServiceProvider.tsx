import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import {
  ServiceContainer,
  globalServiceContainer,
  type ServiceKey,
} from './ServiceContainer'

const ServiceContainerContext = createContext<ServiceContainer>(globalServiceContainer)

interface ServiceContainerProviderProps {
  value?: ServiceContainer
  /**
   * Optional hook to configure overrides on a child container.
   * When provided, a new child container is created from the parent and passed to the configurator.
   */
  configure?: (container: ServiceContainer) => void
}

export const ServiceContainerProvider = ({
  value,
  configure,
  children,
}: PropsWithChildren<ServiceContainerProviderProps>) => {
  const parent = value ?? useContext(ServiceContainerContext)

  const container = useMemo(() => {
    if (!configure) {
      return parent
    }
    const child = parent.createChild()
    configure(child)
    return child
  }, [parent, configure])

  return (
    <ServiceContainerContext.Provider value={container}>
      {children}
    </ServiceContainerContext.Provider>
  )
}

export const useServiceContainer = (): ServiceContainer => useContext(ServiceContainerContext)

export const useService = <T,>(key: ServiceKey<T>): T => {
  const container = useServiceContainer()
  return container.resolve(key)
}

