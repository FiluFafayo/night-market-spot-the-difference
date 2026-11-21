// Shared constants for Lantern Lane: canvas geometry, level setup and scoring.
export const CANVAS_W = 1280;
export const CANVAS_H = 700;
export const PANEL_W = 600;
export const PANEL_H = 620;
export const PANEL_Y = 56;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 660;
export const DIFF_COUNT = 7;
export const FOUND_POINTS = 100;
export const WRONG_PENALTY_SECONDS = 3;
export const HINT_SECONDS = 2.5;
export const BEST_KEY = 'lantern-lane-best';

export const LEVELS = [
  { name: 'Night Market', sub: 'Level 1 of 3', time: 120, hints: 3 },
  { name: 'Garden Pond', sub: 'Level 2 of 3', time: 105, hints: 3 },
  { name: "Clockmaker's Workshop", sub: 'Level 3 of 3', time: 90, hints: 3 },
];
