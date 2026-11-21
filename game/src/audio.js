// Sound effects from the Web Audio API only: no audio files are shipped, so the
// game loads nothing over the network and no asset is ever fetched.
let context = null;

function ensureContext() {
  if (context === null) {
    const AudioContext = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

/** One short oscillator note. */
function tone(freq, startIn, length, type, volume) {
  const audio = ensureContext();
  if (audio === null) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, audio.currentTime + startIn);
  gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + startIn + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + startIn + length);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(audio.currentTime + startIn);
  oscillator.stop(audio.currentTime + startIn + length + 0.05);
}

export const sfx = {
  unlock() { ensureContext(); },
  click() { tone(520, 0, 0.06, 'triangle', 0.12); },
  found() { tone(660, 0, 0.12, 'sine', 0.22); tone(880, 0.09, 0.18, 'sine', 0.22); },
  wrong() { tone(160, 0, 0.18, 'sawtooth', 0.1); },
  hint() { tone(440, 0, 0.1, 'sine', 0.14); tone(587, 0.08, 0.12, 'sine', 0.14); },
  levelClear() { tone(523, 0, 0.14, 'triangle', 0.2); tone(659, 0.12, 0.14, 'triangle', 0.2); tone(784, 0.24, 0.22, 'triangle', 0.2); },
  win() { tone(523, 0, 0.15, 'triangle', 0.2); tone(659, 0.13, 0.15, 'triangle', 0.2); tone(784, 0.26, 0.15, 'triangle', 0.2); tone(1047, 0.39, 0.3, 'triangle', 0.22); },
  tick() { tone(980, 0, 0.05, 'square', 0.05); },
};
