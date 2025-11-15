/**
 * Shared test data loaders for TypeScript/Cloudflare tests.
 * Loads canonical test data that flows through the entire system.
 * 
 * This is the SAME data used in Rust/Anchor tests, ensuring E2E consistency.
 */

import type { MatchRecord } from '../lib/match-recording/types';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DATA_DIR = path.resolve(__dirname, '../../test-data');

/**
 * Load a canonical match record from test-data/matches/
 */
export function loadMatchRecord(name: string = 'claim-4player-complete'): MatchRecord {
  const filePath = path.join(TEST_DATA_DIR, 'matches', `${name}.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as MatchRecord;
}

/**
 * Load leaderboard entries from test-data/leaderboard/
 * Generates full 100 entries from base data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadLeaderboardEntries(_gameType: number = 0, count: number = 100): any[] {
  // _gameType is reserved for future use (filtering by game type)
  void _gameType;
  const filePath = path.join(TEST_DATA_DIR, 'leaderboard', `claim-top100.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const baseEntries = data.entries || [];
  
  // Use base entries and generate remaining
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: any[] = [];
  entries.push(...baseEntries);
  
  // Generate remaining to reach count
  for (let i = baseEntries.length; i < count; i++) {
    const baseEntry = baseEntries[i % baseEntries.length];
    entries.push({
      user_id: `user-${i.toString().padStart(3, '0')}`,
      score: baseEntry.score - ((i - baseEntries.length) * 50),
      wins: Math.floor(Math.random() * 100),
      games_played: Math.floor(Math.random() * 500) + 10,
      timestamp: baseEntry.timestamp - Math.floor(Math.random() * 86400 * 30),
    });
  }
  
  // Sort by score descending
  entries.sort((a, b) => b.score - a.score);
  return entries.slice(0, count);
}

/**
 * Load user data from test-data/users/
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadUserData(userId: string): any {
  const filePath = path.join(TEST_DATA_DIR, 'users', 'sample-users.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.users.find((u: any) => u.user_id === userId);
}

/**
 * Load all users from test-data/users/
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadAllUsers(): any[] {
  const filePath = path.join(TEST_DATA_DIR, 'users', 'sample-users.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  return data.users || [];
}

/**
 * Load game registry from test-data/games/
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadGameRegistry(): any[] {
  const filePath = path.join(TEST_DATA_DIR, 'games', 'registry.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  return data.games || [];
}

/**
 * Load dispute data from test-data/disputes/
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadDisputeData(name: string = 'sample-dispute'): any {
  const filePath = path.join(TEST_DATA_DIR, 'disputes', `${name}.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

