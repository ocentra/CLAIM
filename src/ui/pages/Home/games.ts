export interface GameInfo {
  gameId: number;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  enabled: boolean;
  description?: string;
  tags?: string[];
  comingSoon?: boolean;
}

// Game data - aligned with Solana registry.json
// Registry: game_id 0=CLAIM, 1=ThreeCardBrag, 2=Poker, 3=Bridge, 4=Rummy, 5=Scrabble, 6=WordSearch, 7=Crosswords
export const GAMES: GameInfo[] = [
  {
    gameId: 0,
    name: 'CLAIM',
    minPlayers: 2,
    maxPlayers: 4,
    enabled: true,
    description: 'Imagine a game so simple, you can learn it in three minutes. But a game so brutal, it can end in thirty seconds. A game where a single card can be a triumph or a trap, and hesitation is the deadliest sin of all.',
    tags: ['Card Game', 'Strategy', 'Multiplayer'],
    comingSoon: false,
  },
  {
    gameId: 1,
    name: 'ThreeCard Brag',
    minPlayers: 2,
    maxPlayers: 6,
    enabled: true,
    description: 'A fast-paced poker variant with three cards. Master the art of bluffing and strategy.',
    tags: ['Card Game', 'Poker', 'Multiplayer'],
    comingSoon: false,
  },
  {
    gameId: 2,
    name: 'Poker',
    minPlayers: 2,
    maxPlayers: 10,
    enabled: true,
    description: 'Classic Texas Hold\'em poker with AI opponents. Test your skills against intelligent opponents.',
    tags: ['Card Game', 'Poker', 'Multiplayer'],
    comingSoon: true,
  },
  {
    gameId: 3,
    name: 'Bridge',
    minPlayers: 4,
    maxPlayers: 4,
    enabled: true,
    description: 'Classic partnership card game requiring strategy and communication. Play with a partner.',
    tags: ['Card Game', 'Strategy', 'Partnership'],
    comingSoon: true,
  },
  {
    gameId: 4,
    name: 'Rummy',
    minPlayers: 2,
    maxPlayers: 6,
    enabled: true,
    description: 'Match sets and runs in this classic card game. Form melds and go out first.',
    tags: ['Card Game', 'Strategy', 'Multiplayer'],
    comingSoon: true,
  },
  {
    gameId: 5,
    name: 'Scrabble',
    minPlayers: 2,
    maxPlayers: 4,
    enabled: true,
    description: 'Create words on a crossword-style board using letter tiles. Score points with strategic word placement.',
    tags: ['Word Game', 'Strategy', 'Multiplayer'],
    comingSoon: true,
  },
  {
    gameId: 6,
    name: 'Word Search',
    minPlayers: 1,
    maxPlayers: 10,
    enabled: true,
    description: 'Find hidden words in a grid puzzle. Challenge yourself or compete with friends.',
    tags: ['Word Game', 'Puzzle', 'Single Player'],
    comingSoon: true,
  },
  {
    gameId: 7,
    name: 'Riddle 2 Crossword',
    minPlayers: 1,
    maxPlayers: 10,
    enabled: true,
    description: 'Solve crossword puzzles with clues and word intersections. Test your vocabulary and knowledge.',
    tags: ['Word Game', 'Puzzle', 'Single Player'],
    comingSoon: true,
  },
];

