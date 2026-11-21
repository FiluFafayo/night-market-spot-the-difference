// Boot and the one loop: input is read as it comes, the clock advances while a
// level is being played, and the renderer paints what is there. The game moves
// between six screens: title, play, paused, level clear, game over and win.
//
// ?seed=N fixes the decorative random details. ?shot=title|cover|level2|win
// (with &seed=N) stages that scene instead of running the loop, paints it
// twice and sets window.__shotReady for a screenshot.
import { BEST_KEY, CANVAS_H, CANVAS_W, LEVELS } from './config.js';
import { sfx } from './audio.js';
import { createInput } from './input.js';
import { drawGame, syncHud } from './render.js';
import { stageShot } from './shots.js';
import {
  SCREEN_GAME_OVER, SCREEN_LEVEL_CLEAR, SCREEN_PAUSED, SCREEN_PLAY,
  SCREEN_TITLE, SCREEN_WIN, clickPanel, createGame, startGame, startLevel,
  tick, useHint,
} from './state.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlay-card');
const hintButton = document.getElementById('hint-button');
const status = document.getElementById('status');

const game = createGame();
try {
  game.best = Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
} catch {
  game.best = 0;
}

function saveBest() {
  try {
    window.localStorage.setItem(BEST_KEY, String(game.best));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function announce(message) {
  status.textContent = message;
}

function showOverlay(html) {
  overlayCard.innerHTML = html;
  overlay.hidden = false;
}

function hideOverlay() {
  overlay.hidden = true;
}

function titleCard() {
  return `<h1>Lantern Lane</h1>
    <p class="tag">A spot-the-difference hunt in three hand-drawn scenes.</p>
    <p>Two pictures hang side by side. Seven small things changed between them.
    Click every difference before the lanterns burn down — a wrong click costs
    3 seconds, and a hint will ring one change you have not found yet.</p>
    <p class="rules">3 levels · 7 differences each · H hint · P pause</p>
    <p class="best">Best score: ${game.best}</p>
    <button id="start-button" class="big">Start hunting</button>`;
}

function levelClearCard() {
  return `<h1>Level clear!</h1>
    <p>You found all 7 differences in ${LEVELS[game.levelIndex].name}.</p>
    <p class="big-score">Time bonus +${game.levelBonus} · Score ${game.score}</p>
    <button id="next-button" class="big">Next level</button>`;
}

function gameOverCard() {
  return `<h1>Time's up!</h1>
    <p>The lanterns burned down with ${7 - game.found.size} differences still hidden
    in ${LEVELS[game.levelIndex].name}.</p>
    <p class="big-score">Score ${game.score}</p>
    <button id="retry-button" class="big">Try this level again</button>`;
}

function winCard() {
  return `<h1>You found them all!</h1>
    <p>All 21 differences across the market, the pond and the workshop.</p>
    <p class="big-score">Final score ${game.score}</p>
    <button id="again-button" class="big">Play again</button>`;
}

function pausedCard() {
  return `<h1>Paused</h1>
    <p>Take a breath — the lanterns are waiting.</p>
    <button id="resume-button" class="big">Resume</button>`;
}

function showScreen() {
  if (game.screen === SCREEN_TITLE) showOverlay(titleCard());
  else if (game.screen === SCREEN_LEVEL_CLEAR) showOverlay(levelClearCard());
  else if (game.screen === SCREEN_GAME_OVER) showOverlay(gameOverCard());
  else if (game.screen === SCREEN_WIN) showOverlay(winCard());
  else if (game.screen === SCREEN_PAUSED) showOverlay(pausedCard());
  else hideOverlay();
  syncHud(game);
}

function bindOverlayButtons() {
  overlayCard.addEventListener('click', (event) => {
    const id = event.target.id;
    if (id === 'start-button') {
      sfx.unlock();
      sfx.click();
      startGame(game);
      announce('Playing. Find 7 differences.');
      showScreen();
    } else if (id === 'next-button') {
      sfx.click();
      startLevel(game, game.levelIndex + 1);
      announce(`Playing ${LEVELS[game.levelIndex].name}. Find 7 differences.`);
      showScreen();
    } else if (id === 'retry-button') {
      sfx.click();
      startLevel(game, game.levelIndex);
      announce(`Playing ${LEVELS[game.levelIndex].name}. Find 7 differences.`);
      showScreen();
    } else if (id === 'again-button') {
      sfx.click();
      startGame(game);
      announce('Playing. Find 7 differences.');
      showScreen();
    } else if (id === 'resume-button') {
      sfx.click();
      game.screen = SCREEN_PLAY;
      announce('Playing.');
      showScreen();
    }
  });
}

function runShot(name) {
  stageShot(name, game);
  showScreen();
  let painted = 0;
  function paint() {
    drawGame(ctx, game);
    syncHud(game);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, {
    onPanelClick(_panel, x, y) {
      if (game.screen !== SCREEN_PLAY) return;
      sfx.unlock();
      const result = clickPanel(game, x, y);
      if (result === 'found') {
        sfx.found();
        announce(`Found one! ${game.found.size} of 7.`);
        if (game.screen === SCREEN_LEVEL_CLEAR) {
          sfx.levelClear();
          announce(`Level clear! Score ${game.score}.`);
        } else if (game.screen === SCREEN_WIN) {
          sfx.win();
          if (game.score > game.best) {
            game.best = game.score;
            saveBest();
          }
          announce(`You found them all! Final score ${game.score}.`);
        }
      } else if (result === 'wrong') {
        sfx.wrong();
        announce('Not a difference — 3 seconds lost.');
      }
      showScreen();
    },
    onHint() {
      if (game.screen !== SCREEN_PLAY) return;
      sfx.unlock();
      if (useHint(game)) {
        sfx.hint();
        announce('Hint: one change is ringing in gold.');
        showScreen();
      }
    },
    onPause() {
      if (game.screen === SCREEN_PLAY) {
        game.screen = SCREEN_PAUSED;
        announce('Paused.');
        showScreen();
      } else if (game.screen === SCREEN_PAUSED) {
        game.screen = SCREEN_PLAY;
        announce('Playing.');
        showScreen();
      }
    },
    onConfirm() {
      if (game.screen === SCREEN_TITLE || game.screen === SCREEN_GAME_OVER || game.screen === SCREEN_WIN) {
        const button = overlayCard.querySelector('button');
        if (button) button.click();
      }
    },
  });
  void input;

  hintButton.addEventListener('click', () => {
    if (game.screen !== SCREEN_PLAY) return;
    sfx.unlock();
    if (useHint(game)) {
      sfx.hint();
      announce('Hint: one change is ringing in gold.');
      showScreen();
    }
  });

  bindOverlayButtons();
  showScreen();
  announce('Lantern Lane. Press Space or click Start to play.');
  let last = performance.now();
  let lowTimeWarned = false;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    if (tick(game, dt)) {
      sfx.wrong();
      announce("Time's up!");
      showScreen();
    }
    if (game.screen === SCREEN_PLAY && game.timeLeft <= 10 && !lowTimeWarned) {
      lowTimeWarned = true;
      sfx.tick();
    }
    if (game.screen !== SCREEN_PLAY) lowTimeWarned = false;
    drawGame(ctx, game);
    syncHud(game);
  }
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
