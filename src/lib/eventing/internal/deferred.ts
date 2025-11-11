import { OperationResult } from '../OperationResult'

export interface Deferred<T> {
  promise: Promise<T>
  resolve(value: T): void
  reject(reason?: unknown): void
}

export interface OperationDeferred<T> {
  promise: Promise<OperationResult<T>>
  resolve(result: OperationResult<T>): void
  reject(reason?: unknown): void
}

export const createDeferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve(value: T) {
      resolve(value)
    },
    reject(reason?: unknown) {
      reject(reason)
    },
  }
}

export const createOperationDeferred = <T>(): OperationDeferred<T> => {
  let resolve!: (value: OperationResult<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<OperationResult<T>>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve(result: OperationResult<T>) {
      resolve(result)
    },
    reject(reason?: unknown) {
      reject(reason)
    },
  }
}

