// The three scenes of Lantern Lane, drawn entirely with canvas primitives: no
// image, font or sound file is ever loaded. Each scene is drawn twice, once per
// panel; `side` 0 is the left picture, 1 the right picture, and the seven
// differences of the level are the places where the two sides disagree.
// Every difference is listed with its panel coordinates and hit radius so the
// game can test clicks against it and the screenshots can mark it.
import { createRandom, range } from './random.js';

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function roundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function text(ctx, value, x, y, size, color, align = 'center', font = 'Georgia, serif') {
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

// ---------------------------------------------------------------------------
// Level 1 — Night Market
// ---------------------------------------------------------------------------
const MARKET_DIFFS = [
  { x: 480, y: 88, r: 42, name: 'moon phase' },
  { x: 300, y: 148, r: 24, name: 'string-light colour' },
  { x: 397, y: 220, r: 30, name: 'awning stripe' },
  { x: 250, y: 392, r: 30, name: 'sweets in the middle jar' },
  { x: 470, y: 332, r: 26, name: 'lantern tassel' },
  { x: 115, y: 505, r: 34, name: 'cat on the crate' },
  { x: 495, y: 505, r: 30, name: 'apples in the crate' },
];

function drawMarket(ctx, side) {
  const random = createRandom(1101);
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#241640');
  sky.addColorStop(1, '#5b2a68');
  rect(ctx, 0, 0, 600, 420, sky);
  rect(ctx, 0, 420, 600, 200, '#2e2118');
  // Cobbles on the ground.
  for (let i = 0; i < 26; i += 1) {
    ellipse(ctx, range(random, 10, 590), range(random, 440, 610), range(random, 8, 18), range(random, 4, 7), '#3a2c1e');
  }
  // Stars.
  for (let i = 0; i < 36; i += 1) {
    circle(ctx, range(random, 8, 592), range(random, 8, 150), range(random, 1, 2.4), 'rgba(255, 244, 200, 0.9)');
  }
  // Moon: full on the left, a crescent on the right.
  circle(ctx, 480, 88, 40, '#ffe9a8');
  if (side === 1) circle(ctx, 496, 78, 36, '#3a2560');
  // String of lights across the top.
  ctx.strokeStyle = '#1c1420';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 120);
  ctx.quadraticCurveTo(300, 175, 580, 120);
  ctx.stroke();
  const bulbColors = ['#ff5a5a', '#ffd24d', '#7ddc8a', '#5aa8ff', '#ff5a5a', '#ffd24d', '#7ddc8a', '#5aa8ff'];
  for (let i = 0; i < 8; i += 1) {
    const t = 0.06 + (i * 0.88) / 7;
    const bx = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 300 + t * t * 580;
    const by = (1 - t) * (1 - t) * 120 + 2 * (1 - t) * t * 175 + t * t * 120;
    let color = bulbColors[i];
    if (i === 4) color = side === 0 ? '#ff5a5a' : '#5aa8ff';
    circle(ctx, bx, by + 12, 8, color);
    circle(ctx, bx, by + 12, 3.5, 'rgba(255,255,255,0.85)');
  }
  // Striped awning over the stall.
  const stripes = ['#d94f3d', '#f6e3c5', '#d94f3d', '#f6e3c5', '#d94f3d', '#f6e3c5', '#d94f3d', '#f6e3c5'];
  for (let i = 0; i < 8; i += 1) {
    let color = stripes[i];
    if (i === 5) color = side === 0 ? '#f6e3c5' : '#3fae9c';
    rect(ctx, 40 + i * 65, 190, 65, 60, color);
  }
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = stripes[i] === '#d94f3d' ? '#d94f3d' : (i === 5 && side === 1 ? '#3fae9c' : '#f6e3c5');
    ctx.beginPath();
    ctx.arc(40 + i * 65 + 32.5, 250, 32.5, 0, Math.PI);
    ctx.fill();
  }
  line(ctx, 40, 190, 560, 190, '#7a2e22', 4);
  // Hanging sign.
  roundRect(ctx, 230, 262, 140, 44, 8, '#ffe9a8');
  line(ctx, 300, 250, 300, 262, '#7a2e22', 3);
  text(ctx, 'TEA · SWEETS', 300, 285, 19, '#2b1d4e');
  // Paper lanterns.
  line(ctx, 140, 250, 140, 272, '#7a2e22', 3);
  ellipse(ctx, 140, 298, 26, 30, '#e8442e');
  line(ctx, 140, 268, 140, 328, '#e8442e', 2);
  line(ctx, 470, 250, 470, 272, '#7a2e22', 3);
  ellipse(ctx, 470, 298, 26, 30, '#f07f2e');
  if (side === 0) {
    line(ctx, 466, 328, 466, 348, '#ffd24d', 3);
    line(ctx, 474, 328, 474, 348, '#ffd24d', 3);
  }
  // Stall counter and jars.
  rect(ctx, 60, 430, 480, 130, '#8a5a33');
  rect(ctx, 56, 420, 488, 14, '#a06a3c');
  for (let x = 70; x < 540; x += 46) line(ctx, x, 434, x, 556, '#6e4525', 2);
  const jarXs = [130, 250, 370];
  const jarFill = ['#e85d75', '#7ddc8a', '#f2a541'];
  for (let j = 0; j < 3; j += 1) {
    const jx = jarXs[j];
    roundRect(ctx, jx - 32, 360, 64, 62, 10, 'rgba(207, 232, 216, 0.55)');
    roundRect(ctx, jx - 26, 350, 52, 12, 5, '#5a3a22');
    const candies = j === 1 ? (side === 0 ? 5 : 3) : 4;
    for (let c = 0; c < candies; c += 1) {
      circle(ctx, jx - 18 + (c % 3) * 18, 388 + Math.floor(c / 3) * 18, 7, jarFill[j]);
    }
  }
  // Crate with the cat (left) and crate with apples (right).
  rect(ctx, 70, 520, 90, 70, '#7a5230');
  line(ctx, 70, 545, 160, 545, '#5a3a22', 3);
  if (side === 0) {
    ellipse(ctx, 115, 512, 26, 20, '#1c1420');
    circle(ctx, 115, 482, 15, '#1c1420');
    poly(ctx, [[102, 472], [108, 456], [114, 470]], '#1c1420');
    poly(ctx, [[116, 470], [122, 456], [128, 472]], '#1c1420');
    ctx.strokeStyle = '#1c1420';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(140, 520, 16, Math.PI * 0.9, Math.PI * 1.9);
    ctx.stroke();
  }
  rect(ctx, 440, 520, 110, 70, '#7a5230');
  line(ctx, 440, 545, 550, 545, '#5a3a22', 3);
  const apples = side === 0 ? 3 : 2;
  for (let a = 0; a < apples; a += 1) {
    circle(ctx, 465 + a * 30, 508, 12, '#e8442e');
    line(ctx, 465 + a * 30, 496, 465 + a * 30 + 5, 488, '#3e8e5a', 2);
  }
}

// ---------------------------------------------------------------------------
// Level 2 — Garden Pond
// ---------------------------------------------------------------------------
const POND_DIFFS = [
  { x: 100, y: 90, r: 44, name: 'sun rays' },
  { x: 330, y: 495, r: 32, name: 'frog on the lily pad' },
  { x: 470, y: 200, r: 26, name: 'butterfly colour' },
  { x: 250, y: 540, r: 28, name: 'fourth lily pad' },
  { x: 300, y: 598, r: 24, name: 'sixth tulip' },
  { x: 150, y: 250, r: 28, name: 'dragonfly' },
  { x: 550, y: 400, r: 26, name: 'cattail on the reeds' },
];

function drawPond(ctx, side) {
  const random = createRandom(2202);
  const sky = ctx.createLinearGradient(0, 0, 0, 620);
  sky.addColorStop(0, '#ffd9a0');
  sky.addColorStop(0.55, '#cfe8c2');
  sky.addColorStop(1, '#9ed0a8');
  rect(ctx, 0, 0, 600, 620, sky);
  // Sun: rays on the left, a bare disc on the right.
  circle(ctx, 100, 90, 38, '#ffcf4d');
  if (side === 0) {
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      line(ctx, 100 + Math.cos(a) * 46, 90 + Math.sin(a) * 46, 100 + Math.cos(a) * 62, 90 + Math.sin(a) * 62, '#ffcf4d', 5);
    }
  }
  // Clouds.
  ellipse(ctx, 420, 70, 60, 20, 'rgba(255,255,255,0.85)');
  ellipse(ctx, 460, 82, 44, 16, 'rgba(255,255,255,0.85)');
  ellipse(ctx, 500, 110, 40, 14, 'rgba(255,255,255,0.7)');
  // Dragonfly: present on the left only.
  if (side === 0) {
    ellipse(ctx, 138, 244, 14, 6, 'rgba(255,255,255,0.75)');
    ellipse(ctx, 162, 244, 14, 6, 'rgba(255,255,255,0.75)');
    ellipse(ctx, 150, 252, 5, 16, '#3a6fd8');
    circle(ctx, 150, 238, 5, '#2b4f9e');
  }
  // Butterfly: orange on the left, blue on the right.
  const wing = side === 0 ? '#ff8c42' : '#5aa8ff';
  ellipse(ctx, 458, 192, 14, 18, wing);
  ellipse(ctx, 482, 192, 14, 18, wing);
  ellipse(ctx, 458, 212, 11, 12, wing);
  ellipse(ctx, 482, 212, 11, 12, wing);
  ellipse(ctx, 470, 202, 4, 14, '#2b1d4e');
  // Pond.
  ellipse(ctx, 300, 470, 265, 122, '#5fb8a6');
  ellipse(ctx, 300, 470, 265, 122, 'rgba(255,255,255,0.12)');
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  for (const [rx, ry] of [[120, 430], [420, 500], [300, 540]]) {
    ctx.beginPath();
    ctx.ellipse(rx, ry, 34, 7, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  // Lily pads: three always, a fourth only on the right.
  const pads = [[180, 450, 34], [330, 500, 40], [450, 440, 30]];
  if (side === 1) pads.push([250, 540, 26]);
  for (const [px, py, pr] of pads) {
    ctx.fillStyle = '#3e8e5a';
    ctx.beginPath();
    ctx.arc(px, py, pr, 0.3, Math.PI * 2 - 0.3);
    ctx.lineTo(px, py);
    ctx.fill();
    circle(ctx, px - 8, py - 6, 4, '#7ddc8a');
  }
  // Frog on the middle pad: left only.
  if (side === 0) {
    ellipse(ctx, 330, 492, 24, 16, '#58b368');
    circle(ctx, 318, 476, 8, '#58b368');
    circle(ctx, 342, 476, 8, '#58b368');
    circle(ctx, 318, 476, 3.5, '#1c2b1c');
    circle(ctx, 342, 476, 3.5, '#1c2b1c');
    ctx.strokeStyle = '#1c2b1c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(330, 494, 10, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  // Reeds with cattails on the right edge.
  for (const rx of [520, 550, 578]) {
    line(ctx, rx, 470, rx + (rx === 550 ? 6 : -4), 380, '#3e7d4a', 4);
  }
  ellipse(ctx, 516, 372, 7, 16, '#8a5a33');
  ellipse(ctx, 584, 368, 7, 16, '#8a5a33');
  if (side === 0) ellipse(ctx, 556, 366, 7, 16, '#8a5a33');
  // Tulips along the bottom: five always, a sixth only on the right.
  const tulips = [[60, '#ff6b9d'], [140, '#ffd24d'], [220, '#b678e8'], [420, '#ff6b9d'], [540, '#ffd24d']];
  if (side === 1) tulips.push([300, '#b678e8']);
  for (const [tx, color] of tulips) {
    line(ctx, tx, 620, tx, 592, '#3e7d4a', 4);
    ellipse(ctx, tx, 584, 9, 13, color);
    poly(ctx, [[tx - 9, 580], [tx, 568], [tx + 9, 580]], color);
  }
  // Pebbles.
  for (let i = 0; i < 14; i += 1) {
    circle(ctx, range(random, 10, 590), range(random, 596, 616), range(random, 2, 5), '#8a7a66');
  }
}

// ---------------------------------------------------------------------------
// Level 3 — Clockmaker's Workshop
// ---------------------------------------------------------------------------
const WORKSHOP_DIFFS = [
  { x: 460, y: 88, r: 24, name: 'cuckoo bird' },
  { x: 120, y: 288, r: 22, name: 'missing gear tooth' },
  { x: 455, y: 395, r: 30, name: 'lamp glow' },
  { x: 140, y: 140, r: 42, name: 'round clock hands' },
  { x: 250, y: 500, r: 28, name: 'hammer on the bench' },
  { x: 530, y: 250, r: 22, name: 'star in the window' },
  { x: 110, y: 520, r: 28, name: 'pendulum swing' },
];

function drawGear(ctx, cx, cy, r, teeth, color, missingTooth) {
  ctx.fillStyle = color;
  for (let i = 0; i < teeth; i += 1) {
    if (missingTooth && i === 0) continue;
    const a = (i * Math.PI * 2) / teeth;
    const tx = cx + Math.cos(a) * (r + 8);
    const ty = cy + Math.sin(a) * (r + 8);
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(a);
    ctx.fillRect(-6, -7, 12, 14);
    ctx.restore();
  }
  circle(ctx, cx, cy, r, color);
  circle(ctx, cx, cy, r * 0.45, '#5a3a22');
  circle(ctx, cx, cy, 6, '#2b1d4e');
}

function drawWorkshop(ctx, side) {
  const wall = ctx.createLinearGradient(0, 0, 0, 620);
  wall.addColorStop(0, '#7a5230');
  wall.addColorStop(1, '#5a3a22');
  rect(ctx, 0, 0, 600, 620, wall);
  rect(ctx, 0, 520, 600, 100, '#4a2f1d');
  // Window with the night sky (top right).
  rect(ctx, 460, 210, 100, 110, '#2b1d4e');
  rect(ctx, 468, 218, 84, 94, '#1c2b4a');
  circle(ctx, 492, 244, 14, '#ffe9a8');
  star(ctx, 530, 250, 7, '#fff6c9');
  star(ctx, 542, 292, 5, '#fff6c9');
  if (side === 0) star(ctx, 516, 292, 5, '#fff6c9');
  line(ctx, 510, 210, 510, 320, '#7a5230', 6);
  line(ctx, 460, 265, 560, 265, '#7a5230', 6);
  // Shelf and clocks.
  rect(ctx, 60, 180, 480, 16, '#8a5a33');
  // Round clock: 3 o'clock on the left, 4 o'clock on the right.
  circle(ctx, 140, 140, 42, '#f6ead2');
  ctx.strokeStyle = '#2b1d4e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(140, 140, 42, 0, Math.PI * 2);
  ctx.stroke();
  line(ctx, 140, 140, 140, 112, '#2b1d4e', 3);
  if (side === 0) line(ctx, 140, 140, 164, 140, '#2b1d4e', 4);
  else line(ctx, 140, 140, 157, 157, '#2b1d4e', 4);
  circle(ctx, 140, 140, 4, '#2b1d4e');
  // Square clock.
  roundRect(ctx, 265, 105, 70, 70, 8, '#f6ead2');
  ctx.strokeStyle = '#2b1d4e';
  ctx.lineWidth = 3;
  ctx.strokeRect(265, 105, 70, 70);
  line(ctx, 300, 140, 300, 118, '#2b1d4e', 3);
  line(ctx, 300, 140, 318, 140, '#2b1d4e', 4);
  // Cuckoo clock with a bird that only comes out on the left.
  poly(ctx, [[430, 108], [460, 82], [490, 108]], '#6e4525');
  rect(ctx, 430, 108, 60, 66, '#8a5a33');
  circle(ctx, 460, 140, 18, '#f6ead2');
  line(ctx, 460, 158, 460, 140, '#2b1d4e', 2);
  if (side === 0) {
    ellipse(ctx, 460, 84, 12, 9, '#3a6fd8');
    circle(ctx, 470, 78, 6, '#3a6fd8');
    poly(ctx, [[476, 78], [484, 80], [476, 82]], '#f2a541');
  } else {
    rect(ctx, 448, 76, 24, 14, '#5a3a22');
  }
  // Gears on the wall: the big one's top tooth is missing on the right.
  drawGear(ctx, 120, 330, 44, 8, '#b08a4a', side === 1);
  drawGear(ctx, 208, 358, 28, 7, '#8a6a35', false);
  // Pendulum clock standing on the floor (left).
  rect(ctx, 30, 350, 100, 250, '#6e4525');
  rect(ctx, 22, 340, 116, 16, '#8a5a33');
  circle(ctx, 80, 400, 26, '#f6ead2');
  line(ctx, 80, 400, 80, 380, '#2b1d4e', 3);
  line(ctx, 80, 400, 94, 400, '#2b1d4e', 3);
  line(ctx, 80, 440, 80, 510, '#2b1d4e', 3);
  if (side === 0) circle(ctx, 62, 520, 12, '#d9a441');
  else circle(ctx, 98, 520, 12, '#d9a441');
  // Workbench and tools.
  rect(ctx, 160, 470, 400, 90, '#8a5a33');
  rect(ctx, 156, 460, 408, 12, '#a06a3c');
  if (side === 0) {
    line(ctx, 250, 500, 250, 478, '#6e4525', 6);
    rect(ctx, 232, 470, 36, 14, '#8a8f96');
  }
  line(ctx, 340, 505, 340, 482, '#8a8f96', 5);
  circle(ctx, 340, 478, 8, '#8a8f96');
  line(ctx, 420, 505, 420, 484, '#3a6fd8', 5);
  circle(ctx, 420, 480, 6, '#f2a541');
  // Desk lamp: lit on the left, dark on the right.
  if (side === 0) {
    const glow = ctx.createRadialGradient(455, 395, 8, 455, 395, 90);
    glow.addColorStop(0, 'rgba(255, 220, 130, 0.5)');
    glow.addColorStop(1, 'rgba(255, 220, 130, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(455, 395, 90, 0, Math.PI * 2);
    ctx.fill();
  }
  line(ctx, 500, 470, 470, 410, '#2b1d4e', 5);
  poly(ctx, [[438, 402], [472, 402], [462, 372], [448, 372]], side === 0 ? '#ffd24d' : '#8a7a66');
  ellipse(ctx, 500, 470, 22, 8, '#2b1d4e');
}

// ---------------------------------------------------------------------------
export const SCENES = [
  { diffs: MARKET_DIFFS, draw: drawMarket },
  { diffs: POND_DIFFS, draw: drawPond },
  { diffs: WORKSHOP_DIFFS, draw: drawWorkshop },
];

export function drawScene(ctx, levelIndex, side) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 620);
  ctx.clip();
  SCENES[levelIndex].draw(ctx, side);
  ctx.restore();
}

export function levelDiffs(levelIndex) {
  return SCENES[levelIndex].diffs;
}
