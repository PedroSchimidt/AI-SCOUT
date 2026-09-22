import type { Formation, Position } from "../types/game";

export const FORMATION_SLOTS: Record<Formation, Position[]> = {
  "4-3-3": ["GK", "RB", "CB", "CB", "LB", "CM", "CM", "CM", "RW", "ST", "LW"],
  "4-4-2": ["GK", "RB", "CB", "CB", "LB", "RM", "CM", "CM", "LM", "ST", "ST"].map(
    (p) => (p === "RM" ? "RW" : p === "LM" ? "LW" : p),
  ) as Position[],
  "4-2-3-1": ["GK", "RB", "CB", "CB", "LB", "DM", "DM", "RW", "AM", "LW", "ST"],
  "3-5-2": ["GK", "CB", "CB", "CB", "RM", "CM", "CM", "LM", "AM", "ST", "ST"].map(
    (p) => (p === "RM" ? "RW" : p === "LM" ? "LW" : p),
  ) as Position[],
};

/** Normalized pitch coordinates (0–100), y=0 is own goal line */
export const SLOT_COORDS: Record<Formation, { x: number; y: number }[]> = {
  "4-3-3": [
    { x: 50, y: 8 },
    { x: 82, y: 22 },
    { x: 62, y: 20 },
    { x: 38, y: 20 },
    { x: 18, y: 22 },
    { x: 70, y: 42 },
    { x: 50, y: 44 },
    { x: 30, y: 42 },
    { x: 78, y: 68 },
    { x: 50, y: 72 },
    { x: 22, y: 68 },
  ],
  "4-4-2": [
    { x: 50, y: 8 },
    { x: 82, y: 22 },
    { x: 62, y: 20 },
    { x: 38, y: 20 },
    { x: 18, y: 22 },
    { x: 78, y: 48 },
    { x: 58, y: 46 },
    { x: 42, y: 46 },
    { x: 22, y: 48 },
    { x: 58, y: 72 },
    { x: 42, y: 72 },
  ],
  "4-2-3-1": [
    { x: 50, y: 8 },
    { x: 82, y: 22 },
    { x: 62, y: 20 },
    { x: 38, y: 20 },
    { x: 18, y: 22 },
    { x: 58, y: 38 },
    { x: 42, y: 38 },
    { x: 78, y: 58 },
    { x: 50, y: 60 },
    { x: 22, y: 58 },
    { x: 50, y: 76 },
  ],
  "3-5-2": [
    { x: 50, y: 8 },
    { x: 72, y: 22 },
    { x: 50, y: 20 },
    { x: 28, y: 22 },
    { x: 82, y: 48 },
    { x: 58, y: 46 },
    { x: 50, y: 50 },
    { x: 42, y: 46 },
    { x: 18, y: 48 },
    { x: 58, y: 72 },
    { x: 42, y: 72 },
  ],
};

export const FORMATION_LABELS: Formation[] = ["4-3-3", "4-4-2", "4-2-3-1", "3-5-2"];
