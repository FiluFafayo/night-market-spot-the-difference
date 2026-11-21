// The game's state machine: screens, levels, found differences, the timer,
// hints and the score. Nothing here touches the canvas; render.js paints it.
import { DIFF_COUNT, FOUND_POINTS, HINT_SECONDS, LEVELS, WRONG_PENALTY_SECONDS } from './config.js';
import { levelDiffs } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_CLEAR = 'levelclear';
export const SCREEN_GAME_OVER = 'gameover';
export const SCREEN_WIN = 'win';

export function createGame() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    score: 0,
    best: 0,
    timeLeft: LEVELS[0].time,
    hintsLeft: LEVELS[0].hints,
    hintTarget: -1,
    hintUntil: 0,
    wrongMarks: [],
    levelBonus: 0,
    now: 0,
  };
}

export function startLevel(game, index) {
  game.levelIndex = index;
  game.found = new Set();
  game.timeLeft = LEVELS[index].time;
  game.hintsLeft = LEVELS[index].hints;
  game.hintTarget = -1;
  game.wrongMarks = [];
  game.screen = SCREEN_PLAY;
}

export function startGame(game) {
  game.score = 0;
  startLevel(game, 0);
}

/** The difference at panel coordinates (x, y), or -1 when there is none nearby. */
export function diffAt(game, x, y) {
  const diffs = levelDiffs(game.levelIndex);
  for (let i = 0; i < diffs.length; i += 1) {
    const dx = x - diffs[i].x;
    const dy = y - diffs[i].y;
    if (dx * dx + dy * dy <= diffs[i].r * diffs[i].r) return i;
  }
  return -1;
}

/** A click on a panel. Returns 'found', 'already' or 'wrong'. */
export function clickPanel(game, x, y) {
  if (game.screen !== SCREEN_PLAY) return 'ignored';
  const index = diffAt(game, x, y);
  if (index >= 0) {
    if (game.found.has(index)) return 'already';
    game.found.add(index);
    game.score += FOUND_POINTS;
    if (game.found.size === DIFF_COUNT) {
      game.levelBonus = Math.round(game.timeLeft) * 5;
      game.score += game.levelBonus;
      game.screen = game.levelIndex === LEVELS.length - 1 ? SCREEN_WIN : SCREEN_LEVEL_CLEAR;
    }
    return 'found';
  }
  game.wrongMarks.push({ x, y, until: game.now + 0.6 });
  game.timeLeft = Math.max(0, game.timeLeft - WRONG_PENALTY_SECONDS);
  return 'wrong';
}

/** Spend a hint: briefly ring one difference that is still unfound. */
export function useHint(game) {
  if (game.screen !== SCREEN_PLAY || game.hintsLeft <= 0) return false;
  const remaining = levelDiffs(game.levelIndex)
    .map((diff, i) => i)
    .filter((i) => !game.found.has(i));
  if (remaining.length === 0) return false;
  game.hintsLeft -= 1;
  game.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintUntil = game.now + HINT_SECONDS;
  return true;
}

/** Advance the clock by dt seconds; returns true when time just ran out. */
export function tick(game, dt) {
  game.now += dt;
  game.wrongMarks = game.wrongMarks.filter((mark) => mark.until > game.now);
  if (game.screen !== SCREEN_PLAY) return false;
  game.timeLeft -= dt;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = SCREEN_GAME_OVER;
    return true;
  }
  return false;
}
