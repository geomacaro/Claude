
export interface Fighter {
  name: string;
  record: string;
  age?: number;
  height?: string;
  reach?: string;
  stance?: string;
  style?: string;
}

export interface Fight {
  id: string;
  event: string;
  date: string;
  weightClass: string;
  fighterA: Fighter;
  fighterB: Fighter;
  oddsA?: string;
  oddsB?: string;
}

export interface Prediction {
  fightId: string;
  winner: string;
  confidence: number;
  method: string;
  round?: string;
  reasoning: string;
  sources?: { title: string; uri: string }[];
}

export enum AppState {
  LOADING = 'LOADING',
  IDLE = 'IDLE',
  ERROR = 'ERROR'
}
