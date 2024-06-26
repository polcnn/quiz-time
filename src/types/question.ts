import type { ITriviaQuestion } from "./trivia";

export interface IFormEnterName {
  name?: string | undefined;
}

export interface IPlayerQuestion {
  name: string;
  list: ITriviaQuestion[];
  score: {
    max: number;
    current: number;
  };
}

export interface IPlayer {
  id: number;
  name: string;
  questions: IPlayerQuestion[];
}

export interface IPlayerLeaderboard extends IPlayerQuestion {
  playerId: number;
  playerName: string;
}
