import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type {
  ButtonReference,
  LobbyDetails,
  LobbyOptions,
  LobbyPlayer,
  LobbySummary,
} from '@types/lobby'
import type { AuthPlayerData } from '@types/auth'

export class ShowSubTabEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/ShowSubTab'

  readonly show: boolean
  readonly tabName: string

  constructor(show: boolean, tabName: string) {
    super()
    this.show = show
    this.tabName = tabName
  }
}

export class InfoSubTabStateChangedEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/InfoSubStateChanged'

  readonly infoSubEnabled: boolean

  constructor(infoSubEnabled: boolean) {
    super()
    this.infoSubEnabled = infoSubEnabled
  }
}

export class ArcadeInfoEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/ArcadeInfo'

  readonly info: string

  constructor(info: string) {
    super()
    this.info = info
  }
}

export class ShowArcadeSideEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/ShowArcadeSide'

  readonly show: boolean

  constructor(show: boolean) {
    super()
    this.show = show
  }
}

export class Button3DSimpleClickEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/Button3DClick'

  readonly button: ButtonReference

  constructor(button: ButtonReference) {
    super()
    this.button = button
  }
}

export class LobbyInfoEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/Info'

  readonly button: ButtonReference

  constructor(button: ButtonReference) {
    super()
    this.button = button
  }
}

export class LobbyPlayerUpdateEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/PlayerUpdate'

  readonly button: ButtonReference
  readonly type: 'add' | 'remove'

  constructor(button: ButtonReference, type: 'add' | 'remove') {
    super()
    this.button = button
    this.type = type
  }
}

export class UpdateLobbyEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/Update'

  readonly searchLobbyName: string
  readonly abortController: AbortController

  constructor(abortController: AbortController, searchLobbyName: string) {
    super()
    this.abortController = abortController
    this.searchLobbyName = searchLobbyName
  }
}

export class CreateProfileEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/CreateProfile'

  readonly authPlayerData: AuthPlayerData

  constructor(authPlayerData: AuthPlayerData) {
    super()
    this.authPlayerData = authPlayerData
  }
}

export class UpdatePlayerListEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/UpdatePlayerList'

  readonly players: LobbyPlayer[]

  constructor(players: LobbyPlayer[]) {
    super()
    this.players = players
  }
}

export class StartLobbyAsHostEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/StartAsHost'

  readonly lobbyId: string

  constructor(lobbyId: string) {
    super()
    this.lobbyId = lobbyId
  }
}

export class PlayerLeftLobbyEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/PlayerLeft'

  readonly playerId: string
  readonly deferred: OperationDeferred<boolean>

  constructor(
    playerId: string,
    deferred: OperationDeferred<boolean> = createOperationDeferred<boolean>()
  ) {
    super()
    this.playerId = playerId
    this.deferred = deferred
  }
}

export class ShowScreenEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/ShowScreen'

  readonly screen: string

  constructor(screen: string) {
    super()
    this.screen = screen
  }
}

export class UpdateLobbyListEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/UpdateLobbyList'

  readonly lobbies: LobbySummary[]

  constructor(lobbies: LobbySummary[]) {
    super()
    this.lobbies = lobbies
  }
}

export class UpdateLobbyPlayerListEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/UpdateLobbyPlayerList'

  readonly lobby: LobbyDetails
  readonly isHost: boolean

  constructor(lobby: LobbyDetails, isHost: boolean) {
    super()
    this.lobby = lobby
    this.isHost = isHost
  }
}

export class ProfileCreatedEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/ProfileCreated'

  readonly player: LobbyPlayer

  constructor(player: LobbyPlayer) {
    super()
    this.player = player
  }
}

export class CreateLobbyEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/CreateLobby'

  readonly options: LobbyOptions

  constructor(options: LobbyOptions) {
    super()
    this.options = options
  }
}

export class InputLobbyPasswordEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/InputLobbyPassword'

  readonly deferred: OperationDeferred<string>

  constructor(deferred: OperationDeferred<string> = createOperationDeferred<string>()) {
    super()
    this.deferred = deferred
  }
}

export class JoinedLobbyEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/Joined'

  readonly hasJoined: boolean

  constructor(hasJoined = true) {
    super()
    this.hasJoined = hasJoined
  }
}

export class JoinLobbyEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/JoinLobby'

  readonly lobbyId: string
  readonly isProtectedLobby: boolean

  constructor(lobbyId: string, isProtectedLobby = false) {
    super()
    this.lobbyId = lobbyId
    this.isProtectedLobby = isProtectedLobby
  }
}

declare module '@lib/eventing/EventTypes' {
  interface EventTypeMap {
    'Lobby/ShowSubTab': ShowSubTabEvent
    'Lobby/InfoSubStateChanged': InfoSubTabStateChangedEvent
    'Lobby/ArcadeInfo': ArcadeInfoEvent
    'Lobby/ShowArcadeSide': ShowArcadeSideEvent
    'Lobby/Button3DClick': Button3DSimpleClickEvent
    'Lobby/Info': LobbyInfoEvent
    'Lobby/PlayerUpdate': LobbyPlayerUpdateEvent
    'Lobby/Update': UpdateLobbyEvent
    'Lobby/CreateProfile': CreateProfileEvent
    'Lobby/UpdatePlayerList': UpdatePlayerListEvent
    'Lobby/StartAsHost': StartLobbyAsHostEvent
    'Lobby/PlayerLeft': PlayerLeftLobbyEvent
    'Lobby/ShowScreen': ShowScreenEvent
    'Lobby/UpdateLobbyList': UpdateLobbyListEvent
    'Lobby/UpdateLobbyPlayerList': UpdateLobbyPlayerListEvent
    'Lobby/ProfileCreated': ProfileCreatedEvent
    'Lobby/CreateLobby': CreateLobbyEvent
    'Lobby/InputLobbyPassword': InputLobbyPasswordEvent
    'Lobby/Joined': JoinedLobbyEvent
    'Lobby/JoinLobby': JoinLobbyEvent
  }
}

