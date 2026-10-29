import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* Live ambient soundscapes synthesised with the Web Audio API — no audio files needed. */

const MODES = {
  calm: 'Calm lake', rain: 'Soft rain', waves: 'Ocean waves', forest: 'Forest dawn', pool: 'Poolside',
  waterfall: 'Hill waterfall', cafe: 'Restaurant', party: 'Celebration',
};

function noiseBuffer(ctx, type) {
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (type === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
  }
  return buf;
}

function loopNoise(ctx, buf, out) {
  const s = ctx.createBufferSource();
  s.buffer = buf; s.loop = true; s.connect(out); s.start();
  return s;
}

function filter(ctx, type, freq, q = 0.7) {
  const f = ctx.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  return f;
}

function gain(ctx, v) { const g = ctx.createGain(); g.gain.value = v; return g; }

function buildRain(ctx, out, bufs) {
  const nodes = [], timers = [];
  // Light, soft drizzle — no thunder, no harsh highs
  const hp = filter(ctx, 'highpass', 900), lp = filter(ctx, 'lowpass', 3800), g = gain(ctx, 0.06);
  hp.connect(lp).connect(g).connect(out);
  nodes.push(loopNoise(ctx, bufs.white, hp));
  const rl = filter(ctx, 'lowpass', 300), rg = gain(ctx, 0.08);
  rl.connect(rg).connect(out);
  nodes.push(loopNoise(ctx, bufs.brown, rl));
  // Sparse, gentle drops on leaves
  const drop = () => {
    const t = ctx.currentTime;
    const s = ctx.createBufferSource(); s.buffer = bufs.white;
    const bp = filter(ctx, 'bandpass', 1500 + Math.random() * 2000, 8);
    const e = gain(ctx, 0);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.06 + Math.random() * 0.06, t + 0.006); e.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    s.connect(bp).connect(e).connect(out); s.start(t, Math.random() * 3); s.stop(t + 0.09);
    timers.push(setTimeout(drop, 120 + Math.random() * 380));
  };
  drop();
  return () => { nodes.forEach(n => n.stop()); timers.forEach(clearTimeout); };
}

/* Simple, clean ambience: still water, a soft breeze and slow wind-chime notes */
function buildCalm(ctx, out, bufs) {
  const nodes = [], timers = [];
  const lp = filter(ctx, 'lowpass', 380), g = gain(ctx, 0.07);
  lp.connect(g).connect(out); nodes.push(loopNoise(ctx, bufs.brown, lp));
  const lfo = ctx.createOscillator(), lg = gain(ctx, 0.03);
  lfo.frequency.value = 0.08; lfo.connect(lg).connect(g.gain); lfo.start(); nodes.push(lfo);
  const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; // C major pentatonic
  const chime = () => {
    const t = ctx.currentTime, f = notes[Math.floor(Math.random() * notes.length)];
    const o = ctx.createOscillator(), e = gain(ctx, 0);
    o.type = 'sine'; o.frequency.value = f;
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.022, t + 0.02); e.gain.exponentialRampToValueAtTime(0.0005, t + 4);
    o.connect(e).connect(out); o.start(t); o.stop(t + 4.1);
    timers.push(setTimeout(chime, 2200 + Math.random() * 3800));
  };
  timers.push(setTimeout(chime, 800));
  const bird = () => {
    const t = ctx.currentTime, base = 3000 + Math.random() * 1200;
    for (let k = 0; k < 2; k++) {
      const st = t + k * 0.14, o = ctx.createOscillator(), e = gain(ctx, 0);
      o.frequency.setValueAtTime(base, st); o.frequency.exponentialRampToValueAtTime(base * 1.25, st + 0.07);
      e.gain.setValueAtTime(0, st); e.gain.linearRampToValueAtTime(0.012, st + 0.015); e.gain.exponentialRampToValueAtTime(0.0005, st + 0.1);
      o.connect(e).connect(out); o.start(st); o.stop(st + 0.12);
    }
    timers.push(setTimeout(bird, 6000 + Math.random() * 8000));
  };
  timers.push(setTimeout(bird, 3000));
  return () => { nodes.forEach(n => n.stop()); timers.forEach(clearTimeout); };
}

function buildWaves(ctx, out, bufs) {
  const nodes = [], timers = [];
  // Body of the sea, swelling and receding
  const lp = filter(ctx, 'lowpass', 600), g = gain(ctx, 0.15);
  lp.connect(g).connect(out);
  nodes.push(loopNoise(ctx, bufs.brown, lp));
  // Foam / wash layer
  const hp = filter(ctx, 'bandpass', 2500, 0.5), fg = gain(ctx, 0.0);
  hp.connect(fg).connect(out);
  nodes.push(loopNoise(ctx, bufs.white, hp));
  const wave = () => {
    const t = ctx.currentTime, dur = 7 + Math.random() * 4, peak = t + dur * 0.42;
    g.gain.cancelScheduledValues(t); fg.gain.cancelScheduledValues(t); lp.frequency.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0.9, peak); g.gain.linearRampToValueAtTime(0.15, t + dur);
    lp.frequency.setValueAtTime(lp.frequency.value, t); lp.frequency.linearRampToValueAtTime(1600, peak); lp.frequency.linearRampToValueAtTime(500, t + dur);
    fg.gain.setValueAtTime(0, t); fg.gain.linearRampToValueAtTime(0.01, peak - 0.6); fg.gain.linearRampToValueAtTime(0.16, peak + 0.4); fg.gain.linearRampToValueAtTime(0, t + dur);
    timers.push(setTimeout(wave, dur * 1000 - 400));
  };
  wave();
  // Occasional gull
  const gull = () => {
    const t = ctx.currentTime;
    for (let k = 0; k < 2 + Math.floor(Math.random() * 2); k++) {
      const o = ctx.createOscillator(), e = gain(ctx, 0), st = t + k * 0.35;
      o.type = 'triangle'; o.frequency.setValueAtTime(1300, st); o.frequency.exponentialRampToValueAtTime(2300, st + 0.08); o.frequency.exponentialRampToValueAtTime(900, st + 0.3);
      e.gain.setValueAtTime(0, st); e.gain.linearRampToValueAtTime(0.025, st + 0.05); e.gain.exponentialRampToValueAtTime(0.001, st + 0.3);
      o.connect(e).connect(out); o.start(st); o.stop(st + 0.32);
    }
    timers.push(setTimeout(gull, 12000 + Math.random() * 15000));
  };
  timers.push(setTimeout(gull, 5000));
  return () => { nodes.forEach(n => n.stop()); timers.forEach(clearTimeout); };
}

function buildForest(ctx, out, bufs) {
  const nodes = [], timers = [];
  // Wind through leaves
  const lp = filter(ctx, 'bandpass', 700, 0.4), g = gain(ctx, 0.25);
  lp.connect(g).connect(out);
  nodes.push(loopNoise(ctx, bufs.brown, lp));
  const lfo = ctx.createOscillator(), lg = gain(ctx, 300);
  lfo.frequency.value = 0.07; lfo.connect(lg).connect(lp.frequency); lfo.start(); nodes.push(lfo);
  // Songbirds
  const bird = () => {
    const t = ctx.currentTime, base = 2600 + Math.random() * 2200, notes = 2 + Math.floor(Math.random() * 5);
    for (let k = 0; k < notes; k++) {
      const st = t + k * (0.09 + Math.random() * 0.07);
      const o = ctx.createOscillator(), e = gain(ctx, 0);
      o.type = 'sine';
      o.frequency.setValueAtTime(base * (0.9 + Math.random() * 0.2), st);
      o.frequency.exponentialRampToValueAtTime(base * (1.15 + Math.random() * 0.35), st + 0.06);
      e.gain.setValueAtTime(0, st); e.gain.linearRampToValueAtTime(0.035, st + 0.015); e.gain.exponentialRampToValueAtTime(0.001, st + 0.09);
      o.connect(e).connect(out); o.start(st); o.stop(st + 0.1);
    }
    timers.push(setTimeout(bird, 900 + Math.random() * 3200));
  };
  bird();
  // Gentle stream
  const sb = filter(ctx, 'bandpass', 1200, 1.2), sg = gain(ctx, 0.05);
  sb.connect(sg).connect(out); nodes.push(loopNoise(ctx, bufs.white, sb));
  return () => { nodes.forEach(n => n.stop()); timers.forEach(clearTimeout); };
}

function buildPool(ctx, out, bufs) {
  const nodes = [], timers = [];
  // Water lapping against the pool edge
  const lp = filter(ctx, 'lowpass', 900), g = gain(ctx, 0.12);
  lp.connect(g).connect(out); nodes.push(loopNoise(ctx, bufs.brown, lp));
  const lfo = ctx.createOscillator(), lg = gain(ctx, 0.08);
  lfo.frequency.value = 0.6; lfo.connect(lg).connect(g.gain); lfo.start(); nodes.push(lfo);
  // Splashes
  const splash = () => {
    const t = ctx.currentTime, s = ctx.createBufferSource(); s.buffer = bufs.white;
    const bp = filter(ctx, 'bandpass', 900 + Math.random() * 1500, 0.8), e = gain(ctx, 0);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.35, t + 0.03); e.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    s.connect(bp).connect(e).connect(out); s.start(t, Math.random() * 3); s.stop(t + 0.75);
    timers.push(setTimeout(splash, 2500 + Math.random() * 5000));
  };
  timers.push(setTimeout(splash, 1200));
  // Water droplets
  const drip = () => {
    const t = ctx.currentTime, o = ctx.createOscillator(), e = gain(ctx, 0);
    o.frequency.setValueAtTime(700 + Math.random() * 600, t); o.frequency.exponentialRampToValueAtTime(1800, t + 0.05);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.05, t + 0.005); e.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(e).connect(out); o.start(t); o.stop(t + 0.1);
    timers.push(setTimeout(drip, 400 + Math.random() * 1800));
  };
  drip();
  return () => { nodes.forEach(n => n.stop()); timers.forEach(clearTimeout); };
}

function buildWaterfall(ctx, out, bufs) {
  const nodes = [];
  const a = filter(ctx, 'bandpass', 1100, 0.35), ga = gain(ctx, 0.28);
  a.connect(ga).connect(out); nodes.push(loopNoise(ctx, bufs.white, a));
  const b = filter(ctx, 'lowpass', 220), gb = gain(ctx, 0.5);
  b.connect(gb).connect(out); nodes.push(loopNoise(ctx, bufs.brown, b));
  const lfo = ctx.createOscillator(), lg = gain(ctx, 250);
  lfo.frequency.value = 0.15; lfo.connect(lg).connect(a.frequency); lfo.start(); nodes.push(lfo);
  return () => nodes.forEach(n => n.stop());
}

function buildCafe(ctx, out, bufs) {
  const nodes = [], timers = [];
  // Room murmur — band-limited noise with slow, voice-like modulation
  const bp = filter(ctx, 'bandpass', 450, 1.1), g = gain(ctx, 0.3);
  bp.connect(g).connect(out); nodes.push(loopNoise(ctx, bufs.brown, bp));
  const lfo = ctx.createOscillator(), lg = gain(ctx, 160);
  lfo.frequency.value = 2.3; lfo.connect(lg).connect(bp.frequency); lfo.start(); nodes.push(lfo);
  // Cutlery and glass clinks
  const clink = () => {
    const t = ctx.currentTime, f = 2400 + Math.random() * 3200;
    [1, 2.76].forEach((m, i) => {
      const o = ctx.createOscillator(), e = gain(ctx, 0);
      o.frequency.value = f * m;
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(i ? 0.012 : 0.03, t + 0.003); e.gain.exponentialRampToValueAtTime(0.0005, t + 0.5);
      o.connect(e).connect(out); o.start(t); o.stop(t + 0.55);
    });
    timers.push(setTimeout(clink, 600 + Math.random() * 2600));
  };
  clink();
  // Soft sizzle from the open kitchen
  const sz = filter(ctx, 'highpass', 5000), sg = gain(ctx, 0.025);
  sz.connect(sg).connect(out); nodes.push(loopNoise(ctx, bufs.white, sz));
  return () => { nodes.forEach(n => n.stop()); timers.forEach(clearTimeout); };
}

function buildParty(ctx, out, bufs) {
  const timers = [], nodes = [];
  const bpm = 104, beat = 60 / bpm;
  const chords = [[220, 277.2, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 311.1]];
  let step = 0, next = ctx.currentTime + 0.1;
  const kick = t => {
    const o = ctx.createOscillator(), e = gain(ctx, 0);
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
    e.gain.setValueAtTime(0.5, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(e).connect(out); o.start(t); o.stop(t + 0.32);
  };
  const hat = t => {
    const s = ctx.createBufferSource(); s.buffer = bufs.white;
    const hp = filter(ctx, 'highpass', 7000), e = gain(ctx, 0);
    e.gain.setValueAtTime(0.06, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s.connect(hp).connect(e).connect(out); s.start(t, Math.random()); s.stop(t + 0.06);
  };
  const pad = (t, notes) => notes.forEach(f => {
    const o = ctx.createOscillator(), lp = filter(ctx, 'lowpass', 1200), e = gain(ctx, 0);
    o.type = 'sawtooth'; o.frequency.value = f;
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.025, t + 0.4); e.gain.linearRampToValueAtTime(0, t + beat * 4);
    o.connect(lp).connect(e).connect(out); o.start(t); o.stop(t + beat * 4 + 0.05);
  });
  // Lookahead scheduler for tight timing
  const tick = () => {
    while (next < ctx.currentTime + 0.25) {
      if (step % 2 === 0) kick(next);
      hat(next + beat / 2);
      if (step % 4 === 0) pad(next, chords[(step / 4) % chords.length]);
      next += beat; step++;
    }
    timers.push(setTimeout(tick, 60));
  };
  tick();
  // Crowd chatter underneath
  const bp = filter(ctx, 'bandpass', 500, 0.9), g = gain(ctx, 0.12);
  bp.connect(g).connect(out); nodes.push(loopNoise(ctx, bufs.brown, bp));
  return () => { nodes.forEach(n => n.stop()); timers.forEach(clearTimeout); };
}

const BUILDERS = { calm: buildCalm, rain: buildRain, waves: buildWaves, forest: buildForest, pool: buildPool, waterfall: buildWaterfall, cafe: buildCafe, party: buildParty };

// Each page has its own mood
const PAGE_SOUND = {
  '/': 'calm', '/g-arena': 'forest', '/le-comfort': 'waves', '/destinations': 'waves', '/dining': 'cafe',
  '/celebrations': 'party', '/packages': 'pool', '/booking': 'calm', '/gallery': 'forest', '/our-story': 'forest',
  '/contact': 'calm', '/legal': 'calm',
};
const LOCATION_SOUND = {
  suryapet: 'pool', kamareddy: 'pool', palamaneru: 'forest', nagari: 'waterfall', dvsatram: 'forest',
  kuppam: 'rain', mypadu: 'waves', revupolavaram: 'waves',
};

function modeFor(path) {
  const id = path.split('/')[2];
  if (path.startsWith('/destinations/') && LOCATION_SOUND[id]) return LOCATION_SOUND[id];
  return PAGE_SOUND[path] || 'calm';
}

export default function Soundscape() {
  const { pathname } = useLocation();
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState(() => modeFor(pathname));
  const [hint, setHint] = useState(false);
  const ctxRef = useRef(), masterRef = useRef(), stopRef = useRef(), bufs = useRef();

  // Invite the visitor to turn sound on shortly after landing
  useEffect(() => {
    const t = setTimeout(() => setHint(true), 3500);
    const t2 = setTimeout(() => setHint(false), 14000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Every page change crossfades to that page's sound (a manual pick lasts until the next page)
  useEffect(() => { setMode(modeFor(pathname)); }, [pathname]);

  useEffect(() => {
    if (!on) return;
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain(); master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);
      ctxRef.current = ctx; masterRef.current = master;
      bufs.current = { white: noiseBuffer(ctx, 'white'), brown: noiseBuffer(ctx, 'brown') };
    }
    const ctx = ctxRef.current, master = masterRef.current;
    ctx.resume();
    const bus = ctx.createGain(); bus.gain.value = 0; bus.connect(master);
    const stop = BUILDERS[mode](ctx, bus, bufs.current);
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0.4, t + 2.5);
    bus.gain.linearRampToValueAtTime(1, t + 2);
    stopRef.current = () => {
      const n = ctx.currentTime;
      bus.gain.cancelScheduledValues(n); bus.gain.setValueAtTime(bus.gain.value, n); bus.gain.linearRampToValueAtTime(0, n + 1.2);
      setTimeout(() => { stop(); bus.disconnect(); }, 1300);
    };
    return () => stopRef.current?.();
  }, [on, mode]);

  // Pause when the tab is hidden
  useEffect(() => {
    const v = () => { const c = ctxRef.current; if (!c) return; document.hidden ? c.suspend() : on && c.resume(); };
    document.addEventListener('visibilitychange', v);
    return () => document.removeEventListener('visibilitychange', v);
  }, [on]);

  const pick = m => { setMode(m); setOn(true); setHint(false); };

  return (
    <div className={`soundscape ${on ? 'playing' : ''}`}>
      {hint && !on && (
        <div className="sound-hint">
          <b>Best experienced with sound</b>
          <span>Hear the {MODES[mode].toLowerCase()} of our destinations.</span>
        </div>
      )}
      <button className="sound-main" onClick={() => { setOn(!on); setHint(false); }} aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'} data-cursor={on ? 'Mute' : 'Listen'}>
        <span className="eq"><i /><i /><i /><i /><i /></span>
        <span className="sound-label">{on ? MODES[mode] : 'Sound off'}</span>
      </button>
      <div className="sound-modes">
        {Object.entries(MODES).map(([k, t]) => (
          <button key={k} className={on && mode === k ? 'on' : ''} onClick={() => pick(k)}>{t}</button>
        ))}
      </div>
    </div>
  );
}
