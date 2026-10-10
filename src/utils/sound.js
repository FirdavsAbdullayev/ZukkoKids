/**
 * Web Audio API asosidagi ovoz effektlari.
 * Foydalanuvchi biror tugmani birinchi marta bosganda ovoz "unlock" bo'ladi.
 * O'chirish: Sound.setEnabled(false)
 */
let ctx = null;
let enabled = localStorage.getItem('zukkokids_sound') !== 'off';

function ensureCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

export function unlockAudio() {
  const c = ensureCtx();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}

function tone({ freq = 440, start = 0, dur = 0.1, type = 'sine', vol = 0.2 }) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function chord(times, freqPairs) {
  const c = ensureCtx();
  if (!c || !enabled) return;
  const t0 = c.currentTime;
  for (let i = 0; i < times.length; i += 1) {
    for (const f of freqPairs[i]) {
      tone({ freq: f, start: times[i], dur: 0.28, type: 'sine', vol: 0.16 });
    }
  }
}

export const Sound = {
  click() {
    unlockAudio();
    tone({ freq: 500, dur: 0.06, type: 'triangle', vol: 0.12 });
  },

  select() {
    tone({ freq: 660, dur: 0.09, type: 'triangle', vol: 0.15 });
  },

  answer(correct) {
    if (correct) {
      tone({ freq: 523, dur: 0.09, type: 'triangle', vol: 0.2 });
      tone({ freq: 784, dur: 0.14, start: 0.08, type: 'triangle', vol: 0.2 });
    } else {
      tone({ freq: 240, dur: 0.16, type: 'sawtooth', vol: 0.12 });
      tone({ freq: 180, dur: 0.2, start: 0.08, type: 'sawtooth', vol: 0.1 });
    }
  },

  coin() {
    tone({ freq: 1320, dur: 0.09, type: 'square', vol: 0.08 });
    tone({ freq: 1760, dur: 0.16, start: 0.09, type: 'square', vol: 0.08 });
    tone({ freq: 2340, dur: 0.2, start: 0.2, type: 'square', vol: 0.06 });
  },

  success() {
    chord([0, 0.12, 0.24],
      [
        [523, 659],
        [784, 880],
        [1047, 1319],
      ]);
  },

  fanfare() {
    chord([0, 0.18, 0.36, 0.55],
      [
        [392, 523],
        [523, 659],
        [659, 784],
        [1047, 1319, 1568],
      ]);
  },

  error() {
    tone({ freq: 200, dur: 0.15, type: 'sawtooth', vol: 0.12 });
    tone({ freq: 150, dur: 0.25, start: 0.12, type: 'sawtooth', vol: 0.12 });
  },

  pop() {
    tone({ freq: 980, dur: 0.07, type: 'sine', vol: 0.2 });
    tone({ freq: 1400, dur: 0.06, start: 0.05, type: 'sine', vol: 0.12 });
  },

  isEnabled() {
    return enabled;
  },

  setEnabled(value) {
    enabled = !!value;
    localStorage.setItem('zukkokids_sound', enabled ? 'on' : 'off');
  },
};

export default Sound;