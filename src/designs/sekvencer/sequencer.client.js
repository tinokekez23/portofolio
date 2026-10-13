// 16-step drum machine. Sounds are synthesised with Web Audio (no sample files), and
// nothing makes a sound until the visitor presses play.
(() => {
  "use strict";
  const root = document.querySelector("[data-seq]");
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!root || !AC) return;

  const tracks = [...root.querySelectorAll("[data-track]")].map((row) => [...row.querySelectorAll(".step")]);
  const leds = [...root.querySelectorAll("[data-led]")];
  const playBtn = root.querySelector("[data-play]");
  const playText = root.querySelector("[data-play-text]");
  const tempo = root.querySelector("[data-tempo]");
  const bpmOut = root.querySelector("[data-bpm]");

  tracks.flat().forEach((b) => {
    b.disabled = false;
    b.addEventListener("click", () => b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")));
  });
  playBtn.hidden = false;
  root.querySelector("[data-tempo-wrap]").hidden = false;

  let ctx, noise, timer, step = 0, nextTime = 0, bpm = Number(tempo.value);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  tempo.addEventListener("input", () => {
    bpm = Number(tempo.value);
    bpmOut.value = bpm;
    tempo.setAttribute("aria-valuetext", `${bpm} BPM`);
  });

  function setup() {
    ctx = new AC();
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function env(t, peak, decay) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + decay);
    g.connect(ctx.destination);
    return g;
  }
  function noiseHit(t, freq, peak, decay) {
    const src = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter();
    src.buffer = noise;
    hp.type = "highpass";
    hp.frequency.value = freq;
    src.connect(hp).connect(env(t, peak, decay));
    src.start(t);
    src.stop(t + decay + 0.02);
  }
  const voices = [
    (t) => { // kick: falling sine
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
      o.connect(env(t, 0.9, 0.4));
      o.start(t); o.stop(t + 0.42);
    },
    (t) => { // snare: noise plus a short body tone
      noiseHit(t, 1400, 0.45, 0.18);
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(190, t);
      o.connect(env(t, 0.35, 0.09));
      o.start(t); o.stop(t + 0.1);
    },
    (t) => noiseHit(t, 7500, 0.18, 0.045) // closed hat
  ];

  function show(i) {
    leds.forEach((l, k) => l.classList.toggle("on", k === i));
    if (reduced) return;
    tracks.forEach((row) => {
      const b = row[i];
      if (b.getAttribute("aria-pressed") === "true") {
        b.classList.add("hit");
        setTimeout(() => b.classList.remove("hit"), 90);
      }
    });
  }

  function schedule() {
    const sixteenth = 60 / bpm / 4;
    while (nextTime < ctx.currentTime + 0.12) {
      const i = step;
      tracks.forEach((row, r) => { if (row[i].getAttribute("aria-pressed") === "true") voices[r](nextTime); });
      setTimeout(() => show(i), Math.max(0, (nextTime - ctx.currentTime) * 1000));
      nextTime += sixteenth;
      step = (step + 1) % 16;
    }
  }

  function start() {
    if (!ctx) setup();
    ctx.resume();
    step = 0;
    nextTime = ctx.currentTime + 0.05;
    timer = setInterval(schedule, 25);
    schedule();
    playBtn.setAttribute("aria-pressed", "true");
    playText.textContent = playBtn.dataset.labelStop;
  }
  function stop() {
    clearInterval(timer);
    timer = null;
    leds.forEach((l) => l.classList.remove("on"));
    playBtn.setAttribute("aria-pressed", "false");
    playText.textContent = playBtn.dataset.labelPlay;
  }

  playBtn.addEventListener("click", () => (timer ? stop() : start()));
  document.addEventListener("visibilitychange", () => { if (document.hidden && timer) stop(); });
})();
