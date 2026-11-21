// Pointer and keyboard input: a click on either picture is reported in that
// panel's own coordinates, and keys drive hint, pause and confirm.
import { PANEL_H, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_W, PANEL_Y } from './config.js';

/**
 * Wire the canvas and the document keys to the game's callbacks.
 * handlers: onPanelClick(panel, x, y), onHint(), onPause(), onConfirm().
 */
export function createInput(canvas, handlers) {
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return;
    if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL_W) {
      handlers.onPanelClick(0, x - PANEL_LEFT_X, y - PANEL_Y);
    } else if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL_W) {
      handlers.onPanelClick(1, x - PANEL_RIGHT_X, y - PANEL_Y);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'p' || key === 'escape') handlers.onPause();
    else if (key === ' ' || key === 'enter') handlers.onConfirm();
  });
}
