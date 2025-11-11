import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import {
  createOperationDeferred,
  type OperationDeferred,
  type OperationResult,
} from '@lib/eventing'
import type {
  AdditionalUserInfo,
  AuthCredentials,
  AuthPlayerData,
  AuthResult,
  ConfigManager,
  ManagerReference,
  UserCredentials,
} from '@types/auth'

/**
 * Authentication event base class helpers.
 * These classes mirror the Unity events under OcentraAI.LLMGames.Events.AuthenticationEvents.
 */

export class SignInAsGuestEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/SignInAsGuest'

  readonly deferred: OperationDeferred<TAuthResult>

  constructor(deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()) {
    super()
    this.deferred = deferred
  }
}

export class CreateAccountEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/CreateAccount'

  readonly credentials: AuthCredentials
  readonly deferred: OperationDeferred<TAuthResult>

  constructor(
    credentials: AuthCredentials,
    deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()
  ) {
    super()
    this.credentials = credentials
    this.deferred = deferred
  }
}

export class SignInWithUnityEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/SignInWithUnity'

  readonly deferred: OperationDeferred<TAuthResult>

  constructor(deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()) {
    super()
    this.deferred = deferred
  }
}

export class SignInWithSteamEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/SignInWithSteam'

  readonly deferred: OperationDeferred<TAuthResult>

  constructor(deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()) {
    super()
    this.deferred = deferred
  }
}

export class SignInWithUserPasswordEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/SignInWithUserPassword'

  readonly credentials: AuthCredentials
  readonly deferred: OperationDeferred<TAuthResult>

  constructor(
    credentials: AuthCredentials,
    deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()
  ) {
    super()
    this.credentials = credentials
    this.deferred = deferred
  }
}

export class SignInWithGoogleEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/SignInWithGoogle'

  readonly deferred: OperationDeferred<TAuthResult>

  constructor(deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()) {
    super()
    this.deferred = deferred
  }
}

export class SignInWithFacebookEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/SignInWithFacebook'

  readonly deferred: OperationDeferred<TAuthResult>

  constructor(deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()) {
    super()
    this.deferred = deferred
  }
}

export class SignInCachedUserEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/SignInCachedUser'

  readonly deferred: OperationDeferred<TAuthResult>

  constructor(deferred: OperationDeferred<TAuthResult> = createOperationDeferred<TAuthResult>()) {
    super()
    this.deferred = deferred
  }
}

export class AuthenticationStatusEvent<TAuthResult = AuthResult> extends EventArgsBase {
  static readonly eventType = 'Authentication/Status'

  readonly result: OperationResult<TAuthResult>

  constructor(result: OperationResult<TAuthResult>) {
    super()
    this.result = result
  }
}

export class AuthenticationCompletedEvent<TPlayerData = AuthPlayerData> extends EventArgsBase {
  static readonly eventType = 'Authentication/Completed'

  readonly playerData: TPlayerData

  constructor(playerData: TPlayerData) {
    super()
    this.playerData = playerData
  }
}

export class RequestUserCredentialsEvent extends EventArgsBase {
  static readonly eventType = 'Authentication/RequestUserCredentials'

  readonly deferred: OperationDeferred<UserCredentials>

  constructor(deferred: OperationDeferred<UserCredentials> = createOperationDeferred<UserCredentials>()) {
    super()
    this.deferred = deferred
  }
}

export class RequestAdditionalUserInfoEvent extends EventArgsBase {
  static readonly eventType = 'Authentication/RequestAdditionalUserInfo'

  readonly isGuest: boolean
  readonly deferred: OperationDeferred<AdditionalUserInfo>

  constructor(
    isGuest: boolean,
    deferred: OperationDeferred<AdditionalUserInfo> = createOperationDeferred<AdditionalUserInfo>()
  ) {
    super()
    this.isGuest = isGuest
    this.deferred = deferred
  }
}

export class RequestConfigManagerEvent<TManager = ConfigManager> extends EventArgsBase {
  static readonly eventType = 'Authentication/RequestConfigManager'

  readonly manager: ManagerReference | null
  readonly deferred: OperationDeferred<TManager>

  constructor(
    manager: ManagerReference | null = null,
    deferred: OperationDeferred<TManager> = createOperationDeferred<TManager>()
  ) {
    super()
    this.manager = manager
    this.deferred = deferred
  }
}

export class UpdateUIInteractabilityEvent extends EventArgsBase {
  static readonly eventType = 'Authentication/UpdateUIInteractability'

  readonly isInteractable: boolean

  constructor(isInteractable: boolean) {
    super()
    this.isInteractable = isInteractable
  }
}

declare module '@lib/eventing/EventTypes' {
  interface EventTypeMap {
    'Authentication/SignInAsGuest': SignInAsGuestEvent
    'Authentication/CreateAccount': CreateAccountEvent
    'Authentication/SignInWithUnity': SignInWithUnityEvent
    'Authentication/SignInWithSteam': SignInWithSteamEvent
    'Authentication/SignInWithUserPassword': SignInWithUserPasswordEvent
    'Authentication/SignInWithGoogle': SignInWithGoogleEvent
    'Authentication/SignInWithFacebook': SignInWithFacebookEvent
    'Authentication/SignInCachedUser': SignInCachedUserEvent
    'Authentication/Status': AuthenticationStatusEvent
    'Authentication/Completed': AuthenticationCompletedEvent
    'Authentication/RequestUserCredentials': RequestUserCredentialsEvent
    'Authentication/RequestAdditionalUserInfo': RequestAdditionalUserInfoEvent
    'Authentication/RequestConfigManager': RequestConfigManagerEvent
    'Authentication/UpdateUIInteractability': UpdateUIInteractabilityEvent
  }
}

