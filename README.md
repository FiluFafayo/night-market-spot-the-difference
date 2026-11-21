[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/FiluFafayo/night-market-spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/FiluFafayo/night-market-spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Lantern Lane — Spot the Difference

A spot-the-difference hunt in three hand-drawn scenes, built for the
[make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
best spot the difference game bounty.

Two pictures hang side by side and seven small things changed between them.
Click every difference before the lanterns burn down: a wrong click costs
3 seconds, and a hint rings one change you have not found yet.

## The hunt

1. **Night Market** — a lantern-lit stall at dusk (120 seconds)
2. **Garden Pond** — a frog, a butterfly and a dragonfly at dawn (105 seconds)
3. **Clockmaker's Workshop** — gears, clocks and a cuckoo that may or may not
   be out (90 seconds)

Each level hides 7 differences. Finding one earns 100 points plus a time
bonus when the level is cleared; the clock is the real opponent.

## How to play

Open `game/index.html` in a desktop browser (or serve `game/` with any
static server). No build step, no network request: every scene is drawn
with canvas primitives, and every sound is a Web Audio beep.

- **Click / tap** a difference on either picture to mark it.
- **H** (or the Hint button) rings one unfound difference — 3 hints a level.
- **P** pauses. **Space / Enter** starts.

## Layout

- `game/index.html` — page, heads-up display and overlays
- `game/src/main.js` — boot, the one loop, screens
- `game/src/config.js` — canvas geometry, levels, scoring
- `game/src/scenes.js` — the three scenes and their differences
- `game/src/state.js` — screens, timer, hints, score
- `game/src/render.js` — panels, markers, HUD
- `game/src/input.js` — pointer and keyboard input
- `game/src/audio.js` — Web Audio sound effects
- `game/src/shots.js` — staged scenes for the screenshots
- `game/src/random.js` — seeded random details
- `main.ts` — hands the game in: copies `game/` and `screenshots/` to
  `/output` and writes `/output/dossier.json`
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged
- `screenshots/` — 3–4 renders of the game itself (the first is the cover)
