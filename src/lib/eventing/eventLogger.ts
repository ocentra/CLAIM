import { createModuleLogger, type ModuleLogger, type LogModule } from '@lib/logging'

const DEFAULT_PREFIX = '[EventBus]'
const DEFAULT_MODULE: LogModule = 'GAME_ENGINE'

export const createEventLogger = (
  module: LogModule = DEFAULT_MODULE,
  prefix: string = DEFAULT_PREFIX
): ModuleLogger => createModuleLogger(module, { prefix })

export const defaultEventLogger: ModuleLogger = createEventLogger()

