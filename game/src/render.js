// Painting: the two panels, the found markers, the hint pulse, the wrong-click
// marks and the heads-up display in the page. The scenes themselves live in
// scenes.js; this file only frames them.
import {
  CANVAS_H, CANVAS_W, LEVELS, PANEL_H, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_W, PANEL_Y,
} from './config.js';
import { drawScene, levelDiffs } from './scenes.js';
import { SCREEN_PAUSED, SCREEN_PLAY } from './state.js';

const hudLevel = document.getElementById('hud-level');
const hudFound = document.getElementById('hud-found');
const hudScore = document.getElementById('hud-score');
const hudHints = document.getElementById('hud-hints');
const hudTimerFill = document.getElementById('hud-timer-fill');
const hudTimerText = document.getElementById('hud-timer-text');

function drawPanelFrame(ctx, x) {
  ctx.strokeStyle = '#d9a441';
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 2, PANEL_Y + 2, PANEL_W - 4, PANEL_H - 4);
}

/** A green ring with a tick: the mark a found difference wears on both panels. */
function drawFoundMark(ctx, x, y, r) {
  ctx.strokeStyle = '#37d67a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#37d67a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.35);
  ctx.lineTo(x + r * 0.5, y - r * 0.35);
  ctx.stroke();
}

function drawWrongMark(ctx, x, y) {
  ctx.strokeStyle = '#ff5a5a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
}

function drawPanelLabel(ctx, x, label) {
  ctx.fillStyle = '#f6ead2';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + PANEL_W / 2, 30);
}

export function drawGame(ctx, game) {
  ctx.fillStyle = '#14101d';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawPanelLabel(ctx, PANEL_LEFT_X, 'LEFT  ·  the original');
  drawPanelLabel(ctx, PANEL_RIGHT_X, 'RIGHT  ·  find the changes');
  for (const [side, panelX] of [[0, PANEL_LEFT_X], [1, PANEL_RIGHT_X]]) {
    ctx.save();
    ctx.translate(panelX, PANEL_Y);
    drawScene(ctx, game.levelIndex, side);
    ctx.restore();
  }
  drawPanelFrame(ctx, PANEL_LEFT_X);
  drawPanelFrame(ctx, PANEL_RIGHT_X);
  const diffs = levelDiffs(game.levelIndex);
  for (const [side, panelX] of [[0, PANEL_LEFT_X], [1, PANEL_RIGHT_X]]) {
    for (const index of game.found) {
      const diff = diffs[index];
      drawFoundMark(ctx, panelX + diff.x, PANEL_Y + diff.y, diff.r);
    }
  }
  if (game.hintTarget >= 0 && game.now < game.hintUntil) {
    const diff = diffs[game.hintTarget];
    const pulse = 1 + 0.12 * Math.sin(game.now * 10);
    for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
      ctx.strokeStyle = '#ffd24d';
      ctx.setLineDash([10, 8]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(panelX + diff.x, PANEL_Y + diff.y, (diff.r + 10) * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  for (const mark of game.wrongMarks) {
    drawWrongMark(ctx, PANEL_LEFT_X + mark.x, PANEL_Y + mark.y);
    drawWrongMark(ctx, PANEL_RIGHT_X + mark.x, PANEL_Y + mark.y);
  }
  ctx.fillStyle = '#b8a88f';
  ctx.font = '15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Click a difference on either picture  ·  H for a hint  ·  P to pause', CANVAS_W / 2, CANVAS_H - 10);
}

/** Mirror the game state into the page's heads-up display. */
export function syncHud(game) {
  const level = LEVELS[game.levelIndex];
  hudLevel.textContent = `${level.name} — ${level.sub}`;
  hudFound.textContent = `Found ${game.found.size} / 7`;
  hudScore.textContent = `Score ${game.score}`;
  hudHints.textContent = `Hints ${game.hintsLeft}`;
  const total = level.time;
  const fraction = Math.max(0, game.timeLeft / total);
  hudTimerFill.style.width = `${fraction * 100}%`;
  hudTimerFill.style.background = fraction > 0.5 ? '#37d67a' : fraction > 0.25 ? '#ffd24d' : '#ff5a5a';
  hudTimerText.textContent = `${Math.ceil(game.timeLeft)}s`;
  document.body.classList.toggle('playing', game.screen === SCREEN_PLAY || game.screen === SCREEN_PAUSED);
}
