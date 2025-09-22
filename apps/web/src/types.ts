export type Page = 'home' | 'games' | 'coach' | 'leaderboard' | 'learning';

export interface Game {
  id: string;
  title: string;
  scenario: string;
  objective: string;
  focus: string[];
}
