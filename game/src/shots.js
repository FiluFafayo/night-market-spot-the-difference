// Staged scenes for the screenshots (?shot=name&seed=1). Each one plays the
// real rules forward from a fresh level and marks the differences a player
// would have found by that point, so every frame is what a real game looks
// like and the same seed always gives the same frame.
import { LEVELS } from './config.js';
import { startLevel, SCREEN_LEVEL_CLEAR, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './state.js';

/**
 * Set `game` to the named scene and return the screen to show over it.
 * Scenes: title, cover (level 1 mid-game, 3 found), level2 (2 found), win.
 */
export function stageShot(name, game) {
  if (name === 'cover') {
    startLevel(game, 0);
    game.found = new Set([0, 2, 4]);
    game.score = 300;
    game.timeLeft = 78;
    game.screen = SCREEN_PLAY;
    return SCREEN_PLAY;
  }
  if (name === 'level2') {
    game.score = 500;
    startLevel(game, 1);
    game.score = 500;
    game.found = new Set([1, 5]);
    game.timeLeft = 64;
    game.screen = SCREEN_PLAY;
    return SCREEN_PLAY;
  }
  if (name === 'win') {
    game.score = 2100;
    startLevel(game, 2);
    game.score = 2100;
    game.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    game.levelBonus = 320;
    game.screen = SCREEN_WIN;
    return SCREEN_WIN;
  }
  if (name === 'levelclear') {
    game.score = 900;
    startLevel(game, 0);
    game.score = 900;
    game.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    game.levelBonus = 390;
    game.screen = SCREEN_LEVEL_CLEAR;
    return SCREEN_LEVEL_CLEAR;
  }
  game.screen = SCREEN_TITLE;
  game.levelIndex = 0;
  game.timeLeft = LEVELS[0].time;
  return SCREEN_TITLE;
}
