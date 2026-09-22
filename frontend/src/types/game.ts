export type Position =
  | "GK"
  | "RB"
  | "CB"
  | "LB"
  | "DM"
  | "CM"
  | "AM"
  | "RW"
  | "LW"
  | "ST";

export type PlayerStatus = "available" | "contracted" | "released";

export type Formation = "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2";

export type Mentality = "defensive" | "balanced" | "attacking";

export type Pressing = "low" | "medium" | "high";

export type MatchStatus = "scheduled" | "live" | "finished";

export type EventType =
  | "tick"
  | "chance"
  | "goal"
  | "save"
  | "miss"
  | "foul"
  | "yellow"
  | "red"
  | "penalty"
  | "injury"
  | "halftime"
  | "fulltime";

export type ChatRole = "user" | "assistant";

export interface Player {
  id: number;
  careerId: number;
  name: string;
  age: number;
  nationality: string;
  position: Position;
  biography: string;
  personality: { traits?: string[] };
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  goalkeeping: number;
  potential: number;
  overall: number;
  status: PlayerStatus;
  transferFee: number;
  wage: number;
  discoveredRound: number;
  fitness: number;
  morale: number;
  matchesPlayed: number;
  goals: number;
  assists: number;
  scoutReport?: string;
}

export interface Career {
  id: number;
  clubName: string;
  managerName: string;
  budget: number;
  reputation: number;
  currentRound: number;
  marketReadyForRound: number | null;
}

export interface LineupSlot {
  position: Position;
  playerId: number | null;
}

export interface Lineup {
  formation: Formation;
  mentality: Mentality;
  pressing: Pressing;
  slots: LineupSlot[];
}

export interface MatchEvent {
  id: number;
  minute: number;
  type: EventType;
  commentary: string | null;
  payload: Record<string, unknown>;
}

export interface Match {
  id: number;
  roundNumber: number;
  status: MatchStatus;
  opponentName: string;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
}

export interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface OutfieldStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}
