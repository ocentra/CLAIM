import type { IOperationResult } from '@lib/eventing/interfaces/IOperationResult';
import { defaultEventLogger } from './eventLogger';
import { assertImplements } from '@lib/contracts';
import { IOperationResultContract } from '@lib/eventing/contracts/specs';

export class OperationResult<T> implements IOperationResult<T> {
  public readonly isSuccess: boolean;
  public readonly value: T | undefined;
  public readonly attempts: number;
  public readonly errorMessage?: string;

  private constructor(
    isSuccess: boolean,
    value: T | undefined,
    attempts = 0,
    errorMessage?: string
  ) {
    this.isSuccess = isSuccess;
    this.value = value;
    this.attempts = attempts;
    this.errorMessage = errorMessage;

    assertImplements(this, 'IOperationResult', IOperationResultContract);
  }

  static success<T>(value: T, attempts = 0): OperationResult<T> {
    return new OperationResult<T>(true, value, attempts);
  }

  static failure<T>(errorMessage: string, attempts = 0): OperationResult<T> {
    defaultEventLogger.logError(errorMessage);
    return new OperationResult<T>(false, undefined, attempts, errorMessage);
  }
}

