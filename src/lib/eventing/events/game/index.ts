export * from './AuthenticationErrorUIEvent'
export * from './AuthenticationSignOutEvent'
export * from './DecisionTakenEvent'
export * from './DetermineWinnerEvent'
export * from './GetLocalPlayerEvent'
export * from './GetTrumpCardEvent'
export * from './HideScreenEvent'
export * from './InitializeUIPlayersEvent'
export * from './NewGameEvent'
export * from './NewRoundEvent'
export * from './NewRoundStartedEvent'
export * from './OfferContinuationEvent'
export * from './OfferNewGameEvent'
export * from './PlayerActionNewRoundEvent'
export * from './PlayerActionRaiseBetEvent'
export * from './PlayerActionStartNewGameEvent'
export * from './ProcessDecisionEvent'
export * from './PurchaseCoinsEvent'
export * from './RegisterHumanPlayerEvent'
export * from './RegisterLocalPlayerEvent'
export * from './RegisterPlayerListEvent'
export * from './RequestActivePlayersEvent'
export * from './RequestAllPlayersDataEvent'
export * from './RequestComputerPlayersDataEvent'
export * from './RequestFloorCardsDetailEvent'
export * from './RequestHumanPlayersDataEvent'
export * from './RequestLobbyPlayerDataEvent'
export * from './RequestPlayerDataFromCloudEvent'
export * from './RequestPlayerHandDetailEvent'
export * from './RequestRemainingCardsCountEvent'
export * from './RequestScoreManagerDetailsEvent'
export * from './SavePlayerDataToCloudEvent'
export * from './SetFloorCardEvent'
export * from './SetTrumpCardEvent'
export * from './ShowAllFloorCardEvent'
export * from './StartMainGameEvent'
export * from './StartTurnManagerEvent'
export * from './TimerStartEvent'
export * from './TimerStopEvent'
export * from './TurnCompletedEvent'
export * from './UIMessageEvent'
export * from './UnregisterPlayerEvent'
export * from './UpdateFloorCardEvent'
export * from './UpdateFloorCardListEvent'
export * from './UpdateGameStateEvent'
export * from './UpdateNetworkPlayerUIEvent'
export * from './UpdatePlayerHandDisplayEvent'
export * from './UpdateRoundDisplayEvent'
export * from './UpdateScoreDataEvent'
export * from './UpdateTurnStateEvent'
export * from './UpdateWildCardsEvent'
export * from './UpdateWildCardsHighlightEvent'
export * from './ValidateMaxPlayersEvent'
export * from './playerDecision'

declare module '@lib/eventing/EventTypes' {
  interface EventTypeMap {
    'Game/AuthenticationErrorUI': import('./AuthenticationErrorUIEvent').AuthenticationErrorUIEvent
    'Game/AuthenticationSignOut': import('./AuthenticationSignOutEvent').AuthenticationSignOutEvent
    'Game/DecisionTaken': import('./DecisionTakenEvent').DecisionTakenEvent
    'Game/DetermineWinner': import('./DetermineWinnerEvent').DetermineWinnerEvent
    'Game/GetLocalPlayer': import('./GetLocalPlayerEvent').GetLocalPlayerEvent
    'Game/GetTrumpCard': import('./GetTrumpCardEvent').GetTrumpCardEvent
    'Game/HideScreen': import('./HideScreenEvent').HideScreenEvent
    'Game/InitializeUIPlayers': import('./InitializeUIPlayersEvent').InitializeUIPlayersEvent
    'Game/NewGame': import('./NewGameEvent').NewGameEvent
    'Game/NewRound': import('./NewRoundEvent').NewRoundEvent
    'Game/NewRoundStarted': import('./NewRoundStartedEvent').NewRoundStartedEvent
    'Game/OfferContinuation': import('./OfferContinuationEvent').OfferContinuationEvent
    'Game/OfferNewGame': import('./OfferNewGameEvent').OfferNewGameEvent
    'Game/PlayerActionNewRound': import('./PlayerActionNewRoundEvent').PlayerActionNewRoundEvent
    'Game/PlayerActionRaiseBet': import('./PlayerActionRaiseBetEvent').PlayerActionRaiseBetEvent
    'Game/PlayerActionStartNewGame': import('./PlayerActionStartNewGameEvent').PlayerActionStartNewGameEvent
    'Game/ProcessDecision': import('./ProcessDecisionEvent').ProcessDecisionEvent
    'Game/PurchaseCoins': import('./PurchaseCoinsEvent').PurchaseCoinsEvent
    'Game/RegisterHumanPlayer': import('./RegisterHumanPlayerEvent').RegisterHumanPlayerEvent
    'Game/RegisterLocalPlayer': import('./RegisterLocalPlayerEvent').RegisterLocalPlayerEvent
    'Game/RegisterPlayerList': import('./RegisterPlayerListEvent').RegisterPlayerListEvent
    'Game/RequestActivePlayers': import('./RequestActivePlayersEvent').RequestActivePlayersEvent
    'Game/RequestAllPlayersData': import('./RequestAllPlayersDataEvent').RequestAllPlayersDataEvent
    'Game/RequestComputerPlayersData': import('./RequestComputerPlayersDataEvent').RequestComputerPlayersDataEvent
    'Game/RequestFloorCardsDetail': import('./RequestFloorCardsDetailEvent').RequestFloorCardsDetailEvent
    'Game/RequestHumanPlayersData': import('./RequestHumanPlayersDataEvent').RequestHumanPlayersDataEvent
    'Game/RequestLobbyPlayerData': import('./RequestLobbyPlayerDataEvent').RequestLobbyPlayerDataEvent
    'Game/RequestPlayerDataFromCloud': import('./RequestPlayerDataFromCloudEvent').RequestPlayerDataFromCloudEvent
    'Game/RequestPlayerHandDetail': import('./RequestPlayerHandDetailEvent').RequestPlayerHandDetailEvent
    'Game/RequestRemainingCardsCount': import('./RequestRemainingCardsCountEvent').RequestRemainingCardsCountEvent
    'Game/RequestScoreManagerDetails': import('./RequestScoreManagerDetailsEvent').RequestScoreManagerDetailsEvent
    'Game/SavePlayerDataToCloud': import('./SavePlayerDataToCloudEvent').SavePlayerDataToCloudEvent
    'Game/SetFloorCard': import('./SetFloorCardEvent').SetFloorCardEvent
    'Game/SetTrumpCard': import('./SetTrumpCardEvent').SetTrumpCardEvent
    'Game/ShowAllFloorCard': import('./ShowAllFloorCardEvent').ShowAllFloorCardEvent
    'Game/StartMainGame': import('./StartMainGameEvent').StartMainGameEvent
    'Game/StartTurnManager': import('./StartTurnManagerEvent').StartTurnManagerEvent
    'Game/TimerStart': import('./TimerStartEvent').TimerStartEvent
    'Game/TimerStop': import('./TimerStopEvent').TimerStopEvent
    'Game/TurnCompleted': import('./TurnCompletedEvent').TurnCompletedEvent
    'Game/UIMessage': import('./UIMessageEvent').UIMessageEvent
    'Game/UnregisterPlayer': import('./UnregisterPlayerEvent').UnregisterPlayerEvent
    'Game/UpdateFloorCard': import('./UpdateFloorCardEvent').UpdateFloorCardEvent
    'Game/UpdateFloorCardList': import('./UpdateFloorCardListEvent').UpdateFloorCardListEvent
    'Game/UpdateGameState': import('./UpdateGameStateEvent').UpdateGameStateEvent
    'Game/UpdateNetworkPlayerUI': import('./UpdateNetworkPlayerUIEvent').UpdateNetworkPlayerUIEvent
    'Game/UpdatePlayerHandDisplay': import('./UpdatePlayerHandDisplayEvent').UpdatePlayerHandDisplayEvent
    'Game/UpdateRoundDisplay': import('./UpdateRoundDisplayEvent').UpdateRoundDisplayEvent
    'Game/UpdateScoreData': import('./UpdateScoreDataEvent').UpdateScoreDataEvent
    'Game/UpdateTurnState': import('./UpdateTurnStateEvent').UpdateTurnStateEvent
    'Game/UpdateWildCards': import('./UpdateWildCardsEvent').UpdateWildCardsEvent
    'Game/UpdateWildCardsHighlight': import('./UpdateWildCardsHighlightEvent').UpdateWildCardsHighlightEvent
    'Game/ValidateMaxPlayers': import('./ValidateMaxPlayersEvent').ValidateMaxPlayersEvent
    'Game/PlayerDecision': import('./playerDecision/PlayerDecisionEvent').PlayerDecisionEvent
    'Game/PlayerDecision/Betting': import('./playerDecision/PlayerDecisionBettingEvent').PlayerDecisionBettingEvent
    'Game/PlayerDecision/RaiseBet': import('./playerDecision/PlayerDecisionRaiseBetEvent').PlayerDecisionRaiseBetEvent
    'Game/PlayerDecision/Wildcard': import('./playerDecision/PlayerDecisionWildcardEvent').PlayerDecisionWildcardEvent
    'Game/PlayerDecision/UI': import('./playerDecision/PlayerDecisionUIEvent').PlayerDecisionUIEvent
    'Game/PlayerDecision/PickAndSwap': import('./playerDecision/PlayerDecisionPickAndSwapEvent').PlayerDecisionPickAndSwapEvent
    'Game/PlayerDecision/ComputerPlayerTurn': import('./playerDecision/ComputerPlayerTurnEvent').ComputerPlayerTurnEvent
  }
}

