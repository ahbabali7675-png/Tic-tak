export type Player = 'X' | 'O';
export type BoardState = (Player | null)[];

export enum GameMode {
  PvP = 'PvP',
  PvAI = 'PvAI'
}

export interface WinResult {
  winner: Player | 'Draw';
  line: number[];
}

export interface AiMoveResponse {
  move: number;
  comment: string;
}