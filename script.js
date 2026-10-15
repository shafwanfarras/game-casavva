   (() => {
     'use strict';
     const cv = document.getElementById('game'),
       ctx = cv.getContext('2d');
     const W = cv.width,
       H = cv.height,
       LANES = 3,
       LANE_W = W / LANES;
     const laneX = (i) => LANE_W * i + LANE_W / 2;
     const FONT = '"Trebuchet MS","Segoe UI",Arial,sans-serif';
     const $ = (id) => document.getElementById(id);

     /* ==========================================================
BAGIAN VISUAL — ganti fungsi di sini dengan sprite bila perlu.
Semua menggambar di titik tengah (x, y).
========================================================== */
     const Visuals = {
       // Maskot singkong: umbi lonjong runcing di kedua ujung, kulit cokelat tua,
       // garis tekstur HORIZONTAL (tanpa pola silang), daun menjari 5 helai.
       cassava(x, y, t) {
         const sw = Math.sin(t * 0.3) * 4;
         ctx.save();
         ctx.translate(x, y);
         ctx.lineCap = 'round';
         // kaki & tangan (stik)
         ctx.strokeStyle = '#4a2709';
         ctx.lineWidth = 5;
         ctx.beginPath();
         ctx.moveTo(-6, 38);
         ctx.lineTo(-10, 52 + sw);
         ctx.lineTo(-17, 52 + sw);
         ctx.moveTo(6, 38);
         ctx.lineTo(10, 52 - sw);
         ctx.lineTo(17, 52 - sw);
         ctx.moveTo(-19, -2);
         ctx.lineTo(-32, 10 - sw);
         ctx.moveTo(19, -2);
         ctx.lineTo(32, 10 + sw);
         ctx.stroke();
         // daun menjari: tangkai + 5 anak daun lanset
         const sx = 0,
           sy = -40;
         ctx.strokeStyle = '#3b8a2e';
         ctx.lineWidth = 3;
         ctx.beginPath();
         ctx.moveTo(0, -36);
         ctx.lineTo(sx, sy - 8);
         ctx.stroke();
         const leaf = (ang, len) => {
           ctx.save();
           ctx.translate(sx, sy - 8);
           ctx.rotate(ang + Math.sin(t * 0.15 + ang) * 0.05);
           ctx.fillStyle = '#43a047';
           ctx.beginPath();
           ctx.moveTo(0, 0);
           ctx.quadraticCurveTo(7, -len * 0.5, 0, -len);
           ctx.quadraticCurveTo(-7, -len * 0.5, 0, 0);
           ctx.fill();
           ctx.strokeStyle = '#1b5e20';
           ctx.lineWidth = 1;
           ctx.beginPath();
           ctx.moveTo(0, -2);
           ctx.lineTo(0, -len + 3);
           ctx.stroke();
           ctx.restore();
         };
         leaf(-1.15, 26);
         leaf(-0.58, 33);
         leaf(0, 37);
         leaf(0.58, 33);
         leaf(1.15, 26);
         // badan: tapered, kedua ujung agak runcing
         const body = () => {
           ctx.beginPath();
           ctx.moveTo(0, -38);
           ctx.bezierCurveTo(22, -30, 25, 18, 4, 46);
           ctx.quadraticCurveTo(0, 50, -4, 46);
           ctx.bezierCurveTo(-25, 18, -22, -30, 0, -38);
           ctx.closePath();
         };
         body();
         ctx.fillStyle = '#7a4012';
         ctx.fill();
         ctx.save();
         body();
         ctx.clip();
         // sorotan tipis di sisi kiri
         ctx.fillStyle = 'rgba(255,200,140,.14)';
         ctx.fillRect(-26, -40, 14, 90);
         // tekstur kulit kayu: garis halus horizontal acak (tetap, bukan acak tiap frame)
         ctx.strokeStyle = '#4a2709';
         ctx.lineWidth = 1.5;
         for (const [ly, a, b] of [
           [-26, -12, -2],
           [-20, 4, 15],
           [-12, -17, -8],
           [-4, 8, 19],
           [6, -18, -9],
           [14, 3, 13],
           [22, -14, -5],
           [30, 2, 10],
           [38, -8, -2],
         ]) {
           ctx.beginPath();
           ctx.moveTo(a, ly);
           ctx.quadraticCurveTo((a + b) / 2, ly + 1.5, b, ly);
           ctx.stroke();
         }
         ctx.restore();
         body();
         ctx.strokeStyle = '#4a2709';
         ctx.lineWidth = 2.5;
         ctx.stroke();
         // wajah: mata kartun berkilau + senyum + pipi
         for (const ex of [-8, 8]) {
           ctx.fillStyle = '#fff';
           ctx.beginPath();
           ctx.ellipse(ex, -10, 6, 7, 0, 0, 7);
           ctx.fill();
           ctx.fillStyle = '#1b1008';
           ctx.beginPath();
           ctx.arc(ex, -9, 3.6, 0, 7);
           ctx.fill();
           ctx.fillStyle = '#fff';
           ctx.beginPath();
           ctx.arc(ex + 1.2, -10.5, 1.3, 0, 7);
           ctx.fill();
         }
         ctx.strokeStyle = '#1b1008';
         ctx.lineWidth = 2.5;
         ctx.beginPath();
         ctx.arc(0, 2, 8, 0.15 * Math.PI, 0.85 * Math.PI);
         ctx.stroke();
         ctx.fillStyle = 'rgba(255,130,120,.55)';
         ctx.beginPath();
         ctx.arc(-15, 3, 3.5, 0, 7);
         ctx.arc(15, 3, 3.5, 0, 7);
         ctx.fill();
         ctx.restore();
       },
       fiber(x, y) {
         ctx.save();
         ctx.translate(x, y);
         ctx.fillStyle = '#6cc04a';
         for (let i = -2; i <= 2; i++) {
           ctx.beginPath();
           ctx.roundRect(i * 8 - 4, -30, 8, 60, 4);
           ctx.fill();
         }
         ctx.fillStyle = '#2e7d32';
         ctx.fillRect(-24, -6, 48, 12);
         ctx.fillStyle = '#fff';
         ctx.font = `bold 11px ${FONT}`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText('4.72%', 0, 0);
         ctx.restore();
       },
       lowGI(x, y) {
         ctx.save();
         ctx.translate(x, y);
         ctx.fillStyle = '#2fb344';
         ctx.strokeStyle = '#fff';
         ctx.lineWidth = 3;
         ctx.beginPath();
         ctx.arc(0, 0, 26, 0, 7);
         ctx.fill();
         ctx.stroke();
         ctx.fillStyle = '#fff';
         ctx.font = `bold 17px ${FONT}`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText('GI 56', 0, 1);
         ctx.restore();
       },
       mocaf(x, y) {
         ctx.save();
         ctx.translate(x, y);
         ctx.fillStyle = '#f8f5ee';
         ctx.strokeStyle = '#b9b2a0';
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(-20, -24);
         ctx.lineTo(20, -24);
         ctx.lineTo(24, 26);
         ctx.lineTo(-24, 26);
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
         ctx.fillStyle = '#d8d2c0';
         ctx.fillRect(-20, -28, 40, 8);
         ctx.fillStyle = '#c98f55';
         ctx.fillRect(-20, -4, 40, 16);
         ctx.fillStyle = '#fff';
         ctx.font = `bold 11px ${FONT}`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText('MOCAF', 0, 4);
         ctx.restore();
       },
       sugar(x, y) {
         ctx.save();
         ctx.translate(x, y);
         const cube = (cx, cy, s) => {
           ctx.fillStyle = '#fff6c9';
           ctx.strokeStyle = '#d9c36a';
           ctx.lineWidth = 2;
           ctx.fillRect(cx, cy, s, s);
           ctx.strokeRect(cx, cy, s, s);
           ctx.fillStyle = 'rgba(255,255,255,.9)';
           ctx.fillRect(cx + 3, cy + 3, s / 3, s / 3);
         };
         cube(-26, 2, 24);
         cube(2, 2, 24);
         cube(-12, -22, 24);
         ctx.restore();
       },
       highGI(x, y) {
         ctx.save();
         ctx.translate(x, y);
         ctx.fillStyle = '#e53935';
         ctx.strokeStyle = '#7f0000';
         ctx.lineWidth = 3;
         ctx.beginPath();
         ctx.arc(0, 0, 26, 0, 7);
         ctx.fill();
         ctx.stroke();
         ctx.fillStyle = '#fff';
         ctx.font = `bold 15px ${FONT}`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText('GI 90+', 0, 1);
         ctx.restore();
       },
       heart(x, y, full) {
         ctx.save();
         ctx.translate(x, y);
         ctx.scale(1.1, 1.1);
         ctx.beginPath();
         ctx.moveTo(0, 6);
         ctx.bezierCurveTo(-14, -4, -8, -15, 0, -7);
         ctx.bezierCurveTo(8, -15, 14, -4, 0, 6);
         ctx.fillStyle = full ? '#ff3b5c' : 'rgba(255,255,255,.55)';
         ctx.fill();
         ctx.strokeStyle = '#fff';
         ctx.lineWidth = 2;
         ctx.stroke();
         ctx.restore();
       },
       cloud(x, y, s) {
         ctx.fillStyle = 'rgba(255,255,255,.85)';
         ctx.beginPath();
         ctx.arc(x, y, 18 * s, 0, 7);
         ctx.arc(x + 20 * s, y + 4 * s, 14 * s, 0, 7);
         ctx.arc(x - 20 * s, y + 4 * s, 13 * s, 0, 7);
         ctx.fill();
       },
     };

     /* Definisi item: skor, radius tabrakan, efek */
     const ITEM_TYPES = {
       fiber: { good: true, score: 10, r: 28, draw: Visuals.fiber },
       lowGI: { good: true, score: 20, r: 26, draw: Visuals.lowGI },
       mocaf: { good: true, score: 15, r: 26, draw: Visuals.mocaf },
       sugar: { good: false, r: 26, draw: Visuals.sugar },
       highGI: { good: false, r: 26, draw: Visuals.highGI },
     };
     const GOOD = ['fiber', 'lowGI', 'mocaf'],
       BAD = ['sugar', 'highGI'];

     class Player {
       constructor() {
         this.x = W / 2;
         this.tx = W / 2;
         this.y = H * 0.78;
         this.r = 30;
         this.hit = 0;
         this.lean = 0;
       }
       setTarget(v) {
         this.tx = Math.max(36, Math.min(W - 36, v));
       }
       nudge(d) {
         this.setTarget(this.tx + d);
       }
       update() {
         const dx = this.tx - this.x;
         this.x += dx * 0.35;
         this.lean = Math.max(-0.25, Math.min(0.25, dx * 0.012));
         if (this.hit > 0) this.hit--;
       }
       draw(t) {
         ctx.fillStyle = 'rgba(30,80,40,.28)';
         ctx.beginPath();
         ctx.ellipse(this.x, this.y + 55, 26, 7, 0, 0, 7);
         ctx.fill();
         if (this.hit > 0 && Math.floor(this.hit / 4) % 2) return;
         ctx.save();
         ctx.translate(this.x, this.y);
         ctx.rotate(this.lean);
         ctx.translate(-this.x, -this.y);
         Visuals.cassava(this.x, this.y, t);
         ctx.restore();
       }
     }
     class Item {
       constructor(key, lane) {
         this.key = key;
         this.type = ITEM_TYPES[key];
         this.x = laneX(lane);
         this.y = -40;
         this.dead = false;
       }
       update(s) {
         this.y += s;
         if (this.y > H + 50) this.dead = true;
       }
       draw() {
         const g = ctx.createRadialGradient(this.x, this.y, 6, this.x, this.y, 42),
           c = this.type.good ? '255,236,120' : '255,90,90';
         g.addColorStop(0, `rgba(${c},.55)`);
         g.addColorStop(1, `rgba(${c},0)`);
         ctx.fillStyle = g;
         ctx.beginPath();
         ctx.arc(this.x, this.y, 42, 0, 7);
         ctx.fill();
         ctx.save();
         ctx.translate(this.x, this.y);
         ctx.rotate(Math.sin(this.y * 0.035) * 0.12);
         ctx.translate(-this.x, -this.y);
         this.type.draw(this.x, this.y);
         ctx.restore();
       }
       hits(p) {
         const dx = this.x - p.x,
           dy = this.y - p.y,
           rr = this.type.r + p.r * 0.75;
         return dx * dx + dy * dy < rr * rr;
       }
     }

     /* ===================== SUARA (Web Audio API, tanpa file audio) ===================== */
     const Snd = (() => {
       let ac = null,
         master,
         mus,
         sfxBus,
         noiseBuf,
         muted = false,
         rainSrc = null,
         rainGain = null,
         boost = 0;
       try {
         muted = localStorage.getItem('cq_muted') === '1';
       } catch (e) {}
       const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

       // Browser mewajibkan AudioContext dibuat/di-resume setelah sentuhan pertama pemain
       function init() {
         if (!ac) {
           try {
             ac = new (window.AudioContext || window.webkitAudioContext)();
             master = ac.createGain();
             master.gain.value = muted ? 0 : 0.8;
             master.connect(ac.destination);
             mus = ac.createGain();
             mus.gain.value = 0.32;
             mus.connect(master);
             sfxBus = ac.createGain();
             sfxBus.gain.value = 0.9;
             sfxBus.connect(master);
             noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
             const d = noiseBuf.getChannelData(0);
             for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
           } catch (e) {
             ac = null;
           }
         }
         if (ac && ac.state === 'suspended') ac.resume();
         return !!ac;
       }
       function tone(f, dur, o = {}) {
         if (!ac) return;
         const t0 = ac.currentTime + (o.at || 0),
           osc = ac.createOscillator(),
           g = ac.createGain(),
           v = o.vol == null ? 0.3 : o.vol;
         osc.type = o.type || 'sine';
         osc.frequency.setValueAtTime(f, t0);
         if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
         g.gain.setValueAtTime(0.0001, t0);
         g.gain.exponentialRampToValueAtTime(v, t0 + (o.atk || 0.01));
         g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
         osc.connect(g);
         g.connect(o.bus || sfxBus);
         osc.start(t0);
         osc.stop(t0 + dur + 0.05);
       }
       function noise(dur, o = {}) {
         if (!ac) return;
         const t0 = ac.currentTime + (o.at || 0),
           src = ac.createBufferSource(),
           f = ac.createBiquadFilter(),
           g = ac.createGain(),
           v = o.vol == null ? 0.3 : o.vol;
         src.buffer = noiseBuf;
         f.type = o.filter || 'lowpass';
         f.frequency.setValueAtTime(o.freq || 1000, t0);
         if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
         g.gain.setValueAtTime(0.0001, t0);
         g.gain.exponentialRampToValueAtTime(v, t0 + (o.atk || 0.01));
         g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
         src.connect(f);
         f.connect(g);
         g.connect(o.bus || sfxBus);
         src.start(t0, Math.random());
         src.stop(t0 + dur + 0.05);
       }

       /* ---- Efek suara ---- */
       const sfx = {
         click() {
           tone(520, 0.09, { type: 'square', vol: 0.12, to: 880 });
         },
         good(k) {
           const f = { fiber: 660, mocaf: 784, lowGI: 988 }[k] || 700; // tiap item nada berbeda
           tone(f, 0.12, { type: 'triangle', vol: 0.35 });
           tone(f * 1.5, 0.2, { type: 'triangle', vol: 0.3, at: 0.07 });
           tone(f * 2, 0.25, { vol: 0.12, at: 0.07 });
         },
         bad() {
           tone(200, 0.3, { type: 'sawtooth', vol: 0.3, to: 70 });
           noise(0.25, { freq: 900, to: 150, vol: 0.35 });
         },
         death() {
           [440, 370, 311, 247].forEach((f, i) => tone(f, 0.28, { type: 'sawtooth', vol: 0.25, to: f * 0.85, at: i * 0.16 }));
           tone(110, 0.7, { vol: 0.5, to: 40, at: 0.1 });
           noise(0.5, { freq: 1200, to: 80, vol: 0.4 });
         },
         levelUp() {
           [523, 659, 784].forEach((f, i) => tone(f, i < 2 ? 0.1 : 0.18, { type: 'square', vol: 0.14, at: i * 0.09 }));
         },
         fanfare() {
           [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => {
             tone(f, 0.25, { type: 'triangle', vol: 0.35, at: i * 0.1 });
             tone(f * 2, 0.2, { vol: 0.1, at: i * 0.1 });
           });
           [523, 659, 784, 1047].forEach((f) => tone(f, 0.9, { type: 'triangle', vol: 0.2, at: 0.75 }));
         },
         win() {
           [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, { type: 'triangle', vol: 0.3, at: i * 0.12 }));
         },
         lose() {
           [392, 349, 311, 262].forEach((f, i) => tone(f, 0.4, { type: 'triangle', vol: 0.3, at: i * 0.22 }));
         },
         // --- cutscene ---
         rumble() {
           noise(0.9, { freq: 140, to: 60, vol: 0.7, atk: 0.4 });
           tone(48, 0.9, { vol: 0.5, atk: 0.4 });
         },
         pop() {
           tone(120, 0.35, { vol: 0.7, to: 640 });
           noise(0.3, { filter: 'bandpass', freq: 600, to: 3000, vol: 0.4 });
           tone(300, 0.3, { type: 'triangle', vol: 0.3, to: 900, at: 0.05 });
         },
         thud() {
           tone(150, 0.25, { vol: 0.8, to: 45 });
           noise(0.18, { freq: 500, vol: 0.4 });
         },
         voice(f) {
           tone(f, 0.07, { type: 'square', vol: 0.12 });
           tone(f * 1.25, 0.07, { type: 'square', vol: 0.12, at: 0.08 });
         },
         sting() {
           tone(110, 1, { type: 'sawtooth', vol: 0.25, to: 100 });
           tone(116.5, 1, { type: 'sawtooth', vol: 0.25, to: 105 });
           tone(55, 1.2, { vol: 0.5 });
           noise(0.6, { freq: 2500, to: 200, vol: 0.3 });
         },
         whoosh(up) {
           noise(0.5, { filter: 'bandpass', freq: up ? 300 : 3000, to: up ? 4000 : 300, vol: 0.35, atk: 0.15 });
         },
         poof() {
           noise(0.3, { filter: 'bandpass', freq: 1500, to: 500, vol: 0.4 });
           tone(400, 0.2, { vol: 0.2, to: 100 });
         },
         sparkle() {
           for (let i = 0; i < 7; i++) tone(1047 * Math.pow(1.122, i % 5) * (i > 4 ? 2 : 1), 0.25, { vol: 0.14, at: i * 0.06 });
         },
       };
       function rainOn() {
         if (!ac || rainSrc) return;
         rainSrc = ac.createBufferSource();
         rainSrc.buffer = noiseBuf;
         rainSrc.loop = true;
         const f = ac.createBiquadFilter();
         f.type = 'highpass';
         f.frequency.value = 2500;
         rainGain = ac.createGain();
         rainGain.gain.setValueAtTime(0.0001, ac.currentTime);
         rainGain.gain.linearRampToValueAtTime(0.18, ac.currentTime + 0.6);
         rainSrc.connect(f);
         f.connect(rainGain);
         rainGain.connect(sfxBus);
         rainSrc.start();
       }
       function rainOff() {
         if (!rainSrc) return;
         const src = rainSrc,
           g = rainGain;
         rainSrc = null;
         try {
           g.gain.cancelScheduledValues(ac.currentTime);
           g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), ac.currentTime);
           g.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.5);
           src.stop(ac.currentTime + 0.55);
         } catch (e) {}
       }

       /* ---- Musik latar (sequencer sederhana: melodi + bass + drum) ---- */
       const TRACKS = {
         lobby: { bpm: 112, wave: 'triangle', mv: 0.2, bwave: 'sine', mel: [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 76, 72], bass: [48, 0, 55, 0, 53, 0, 60, 0, 55, 0, 62, 0, 48, 0, 55, 0] },
         game: { bpm: 140, wave: 'square', mv: 0.08, bwave: 'triangle', drums: true, mel: [76, 0, 79, 76, 74, 0, 72, 0, 79, 0, 83, 79, 76, 0, 72, 74], bass: [48, 48, 0, 48, 53, 53, 0, 53, 55, 55, 0, 55, 52, 52, 0, 52] },
         cut_calm: { bpm: 72, wave: 'triangle', mv: 0.17, len: 3, bwave: 'sine', mel: [60, 64, 67, 72, 60, 64, 67, 72, 57, 60, 64, 69, 57, 60, 64, 69], bass: [36, 0, 0, 0, 0, 0, 0, 0, 33, 0, 0, 0, 0, 0, 0, 0] },
         cut_dark: { bpm: 84, wave: 'sawtooth', mv: 0.07, len: 2, bwave: 'sine', mel: [57, 0, 60, 0, 63, 0, 60, 0, 56, 0, 59, 0, 62, 0, 59, 0], bass: [33, 0, 0, 0, 33, 0, 0, 0, 32, 0, 0, 0, 32, 0, 0, 0] },
       };
       let cur = null,
         step = 0,
         nextT = 0,
         timer = null;
       function schedule() {
         if (!ac || !cur) return;
         const tr = TRACKS[cur],
           spb = 60 / (tr.bpm + boost) / 2;
         while (nextT < ac.currentTime + 0.25) {
           const i = step % 16,
             at = Math.max(0, nextT - ac.currentTime);
           if (tr.mel[i]) tone(mtof(tr.mel[i]), spb * (tr.len || 1.6), { type: tr.wave, vol: tr.mv, at, bus: mus });
           if (tr.bass[i]) tone(mtof(tr.bass[i]), spb * 1.8, { type: tr.bwave, vol: 0.3, at, bus: mus });
           if (tr.drums) {
             if (i % 4 === 0) tone(150, 0.12, { vol: 0.5, to: 45, at, bus: mus });
             if (i % 2) noise(0.04, { filter: 'highpass', freq: 7000, vol: 0.1, at, bus: mus });
           }
           nextT += spb;
           step++;
         }
       }
       const music = {
         play(name) {
           if (!ac || cur === name) return;
           cur = name;
           step = 0;
           nextT = ac.currentTime + 0.05;
           if (!timer) timer = setInterval(schedule, 60);
           schedule();
         },
         stop() {
           cur = null;
         },
       };
       function setMuted(m) {
         muted = m;
         try {
           localStorage.setItem('cq_muted', m ? '1' : '0');
         } catch (e) {}
         if (ac) master.gain.setTargetAtTime(m ? 0 : 0.8, ac.currentTime, 0.02);
       }
       if (typeof document.addEventListener === 'function')
         // jeda suara saat tab disembunyikan
         document.addEventListener('visibilitychange', () => {
           if (!ac) return;
           document.hidden ? ac.suspend() : ac.resume();
         });
       return {
         init,
         sfx,
         music,
         rainOn,
         rainOff,
         boost: (v) => {
           boost = v;
         },
         toggle() {
           setMuted(!muted);
         },
         get muted() {
           return muted;
         },
       };
     })();

     function syncMusic() {
       // pilih musik sesuai layar saat ini
       if (state === 'menu' || (state === 'cutscene' && cutT >= 556)) Snd.music.play('lobby');
       else if (state === 'cutscene') Snd.music.play(cutT >= 452 ? 'cut_dark' : 'cut_calm');
       else if (state === 'play') Snd.music.play('game');
     }
     function unlockAudio() {
       if (Snd.init()) syncMusic();
     }
     function drawMute() {
       // tombol suara (pojok kanan bawah)
       ctx.fillStyle = 'rgba(0,0,0,.38)';
       ctx.beginPath();
       ctx.arc(W - 28, H - 28, 18, 0, 7);
       ctx.fill();
       ctx.strokeStyle = 'rgba(255,255,255,.85)';
       ctx.lineWidth = 2;
       ctx.stroke();
       text(Snd.muted ? '🔇' : '🔊', W - 28, H - 27, 17);
     }

     /* ===================== STATE ===================== */
     const BASE_SPEED = 2.2,
       GOAL = 1000,
       DEATH_FRAMES = 36;
     let state = 'menu'; // 'menu' (lobby) | 'cutscene' | 'play' | 'dying' | 'over'
     let player, items, particles, popups, score, dispScore, lives, speed, spawnT, lastTier, dyingT, goalReached, bannerT;
     let shake = 0,
       flash = 0,
       tick = 0,
       bgY = 0,
       buttons = [];
     const clouds = Array.from({ length: 5 }, (_, i) => ({ x: Math.random() * W, y: i * 130, s: 0.7 + Math.random() * 0.7 }));
     const decor = [];
     for (let i = 0; i < 7; i++) {
       decor.push({ side: 0, y: i * 100 + Math.random() * 40, k: i % 2 });
       decor.push({ side: 1, y: i * 100 + 50 + Math.random() * 40, k: (i + 1) % 2 });
     }
     const flowers = Array.from({ length: 16 }, (_, i) => ({ x: 12 + i * 22 + Math.random() * 8, y: 22 + Math.random() * 50, c: ['#ff6f91', '#ffd54f', '#fff', '#ba68c8'][i % 4] }));

     function reset() {
       player = new Player();
       items = [];
       particles = [];
       popups = [];
       score = 0;
       dispScore = 0;
       lives = 3;
       speed = BASE_SPEED;
       shake = 0;
       flash = 0;
       dyingT = 0;
       spawnT = 40;
       lastTier = 0;
       goalReached = false;
       bannerT = 0;
     }
     function startGame() {
       reset();
       state = 'play';
       Snd.rainOff();
       Snd.boost(0);
       Snd.music.play('game');
     }
     function toLobby() {
       reset();
       state = 'menu';
       Snd.music.play('lobby');
     }
     function burst(x, y, c, n = 10) {
       for (let i = 0; i < n; i++) particles.push({ x, y, vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.5) * 7, life: 26, c });
     }
     function popup(x, y, s, c) {
       popups.push({ x, y, s, c, life: 40 });
     }

     function update() {
       tick++;
       bgY += 1 + speed * 0.4;
       if (shake > 0) shake--; // efek getar/flash berkurang di SEMUA state
       if (flash > 0) flash--;
       if (fadeIn > 0) fadeIn--;
       dispScore += (score - dispScore) * 0.2;
       particles.forEach((p) => {
         p.x += p.vx;
         p.y += p.vy;
         p.life--;
       });
       particles = particles.filter((p) => p.life > 0);
       popups.forEach((p) => {
         p.y -= 1.2;
         p.life--;
       });
       popups = popups.filter((p) => p.life > 0);
       decor.forEach((d) => {
         d.y += 1 + speed * 0.9;
         if (d.y > H + 30) d.y = -30;
       });

       if (state === 'cutscene') {
         cutT++;
         if (cutT >= 300 && cutT < 330 && cutT % 5 === 0) burst(W / 2 + (Math.random() - 0.5) * 40, GY, '#8d5524', 3); // tanah bergetar
         if (cutT === 330) {
           burst(W / 2, GY, '#8d5524', 24);
           burst(W / 2, GY, '#66bb6a', 16);
           burst(W / 2, GY, '#c8a165', 12);
         } // meloncat keluar!
         if (cutT === 400) burst(W / 2, GY, '#c8a165', 14); // mendarat
         if (cutT === 560) {
           burst(W / 2, GY - 150, '#ffd54f', 20);
           burst(W / 2, GY - 100, '#fff59d', 14);
         } // item sehat tiba
         const ev = {
           162: () => Snd.rainOn(),
           296: () => Snd.sfx.rumble(),
           300: () => Snd.rainOff(),
           330: () => Snd.sfx.pop(),
           400: () => Snd.sfx.thud(),
           408: () => Snd.sfx.voice(520),
           416: () => Snd.sfx.voice(640),
           424: () => Snd.sfx.voice(560),
           452: () => {
             Snd.music.play('cut_dark');
             Snd.sfx.sting();
           },
           458: () => Snd.sfx.whoosh(false),
           548: () => Snd.sfx.poof(),
           556: () => Snd.music.play('lobby'),
           560: () => Snd.sfx.sparkle(),
           616: () => Snd.sfx.whoosh(true),
         };
         if (ev[cutT]) ev[cutT]();
         if (cutT >= CUT_LEN) endCut();
         return;
       }

       if (state === 'dying') {
         if (--dyingT <= 0) {
           state = 'over';
           shake = 0;
           flash = 0;
           goalReached ? Snd.sfx.win() : Snd.sfx.lose();
         }
         return;
       }
       if (state !== 'play') return;

       const tier = Math.floor(score / 100);
       if (tier > lastTier) {
         lastTier = tier;
         speed += 0.35;
         Snd.sfx.levelUp();
         Snd.boost(Math.min(30, tier * 3));
       }
       player.update();
       if (bannerT > 0) bannerT--;
       if (--spawnT <= 0) {
         const pool = Math.random() < 0.38 ? BAD : GOOD;
         items.push(new Item(pool[Math.floor(Math.random() * pool.length)], Math.floor(Math.random() * LANES)));
         spawnT = Math.max(22, 62 - speed * 6) + Math.random() * 14;
       }
       for (const it of items) {
         it.update(speed);
         if (!it.dead && it.hits(player)) {
           it.dead = true;
           if (it.type.good) {
             score += it.type.score;
             burst(it.x, it.y, '#ffe04a');
             Snd.sfx.good(it.key);
             popup(it.x, it.y - 20, '+' + it.type.score, '#2e7d32');
             if (!goalReached && score >= GOAL) {
               goalReached = true;
               bannerT = 300;
               Snd.sfx.fanfare();
               for (let i = 0; i < 5; i++) burst(W / 2, H * 0.3, ['#ffd54f', '#ff7043', '#66bb6a', '#42a5f5', '#ec407a'][i], 14);
             }
           } else {
             lives--;
             player.hit = 40;
             Snd.sfx.bad();
             burst(it.x, it.y, '#ff5252');
             popup(it.x, it.y - 20, '-1 ❤', '#c62828');
             if (lives <= 0) {
               state = 'dying';
               dyingT = DEATH_FRAMES;
               shake = 24;
               flash = 20;
               Snd.music.stop();
               Snd.sfx.death();
             }
           }
         }
       }
       items = items.filter((i) => !i.dead);
     }

     /* ===================== HELPER GAMBAR ===================== */
     function text(s, x, y, size, color, align = 'center', weight = 'bold') {
       ctx.fillStyle = color;
       ctx.font = `${weight} ${size}px ${FONT}`;
       ctx.textAlign = align;
       ctx.textBaseline = 'middle';
       ctx.fillText(s, x, y);
     }
     function stext(s, x, y, size, color, align = 'center') {
       text(s, x, y + 2, size, 'rgba(0,0,0,.28)', align);
       text(s, x, y, size, color, align);
     }
     function panel(x, y, w, h, r, fill, stroke, lw) {
       ctx.beginPath();
       ctx.roundRect(x, y, w, h, r);
       ctx.fillStyle = fill;
       ctx.fill();
       if (stroke) {
         ctx.strokeStyle = stroke;
         ctx.lineWidth = lw || 3;
         ctx.stroke();
       }
     }
     function icon(fn, x, y, s) {
       ctx.save();
       ctx.translate(x, y);
       ctx.scale(s, s);
       fn(0, 0);
       ctx.restore();
     }
     function star(x, y, r, c) {
       ctx.fillStyle = c;
       ctx.beginPath();
       for (let i = 0; i < 10; i++) {
         const a = -Math.PI / 2 + (i * Math.PI) / 5,
           rr = i % 2 ? r * 0.45 : r;
         ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
       }
       ctx.closePath();
       ctx.fill();
     }
     function title(s, x, y, size) {
       ctx.save();
       ctx.font = `900 ${size}px ${FONT}`;
       ctx.textAlign = 'center';
       ctx.textBaseline = 'middle';
       ctx.lineJoin = 'round';
       ctx.lineWidth = size * 0.26;
       ctx.strokeStyle = 'rgba(0,0,0,.25)';
       ctx.strokeText(s, x, y + 5);
       ctx.strokeStyle = '#1b5e20';
       ctx.strokeText(s, x, y);
       const g = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
       g.addColorStop(0, '#fffde7');
       g.addColorStop(1, '#ffca28');
       ctx.fillStyle = g;
       ctx.fillText(s, x, y);
       ctx.restore();
     }
     function button(label, x, y, w, h, c1, c2, action, pulse) {
       const k = pulse ? 1 + Math.sin(tick * 0.08) * 0.03 : 1;
       ctx.save();
       ctx.translate(x, y);
       ctx.scale(k, k);
       panel(-w / 2, -h / 2 + 5, w, h, h / 2.4, 'rgba(0,0,0,.25)');
       const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
       g.addColorStop(0, c1);
       g.addColorStop(1, c2);
       panel(-w / 2, -h / 2, w, h, h / 2.4, g, 'rgba(255,255,255,.85)', 3);
       panel(-w / 2 + 8, -h / 2 + 5, w - 16, h * 0.32, h / 6, 'rgba(255,255,255,.28)');
       stext(label, 0, 1, Math.min(22, h * 0.4), '#fff');
       ctx.restore();
       buttons.push({ x: x - w / 2, y: y - h / 2, w, h, action });
     }

     /* ===================== LATAR BELAKANG ===================== */
     function bush(x, y) {
       ctx.fillStyle = '#43a047';
       ctx.beginPath();
       ctx.arc(x, y, 12, 0, 7);
       ctx.arc(x + 11, y + 4, 9, 0, 7);
       ctx.arc(x - 10, y + 5, 9, 0, 7);
       ctx.fill();
       ctx.fillStyle = '#66bb6a';
       ctx.beginPath();
       ctx.arc(x - 2, y - 4, 6, 0, 7);
       ctx.fill();
     }
     function flower(x, y, c) {
       ctx.fillStyle = c;
       for (let i = 0; i < 5; i++) {
         const a = i * 1.2566;
         ctx.beginPath();
         ctx.arc(x + Math.cos(a) * 4, y + Math.sin(a) * 4, 3, 0, 7);
         ctx.fill();
       }
       ctx.fillStyle = '#ffb300';
       ctx.beginPath();
       ctx.arc(x, y, 2.5, 0, 7);
       ctx.fill();
     }

     function drawBg() {
       const g = ctx.createLinearGradient(0, 0, 0, H);
       g.addColorStop(0, '#4fb8ff');
       g.addColorStop(0.55, '#aee3ff');
       g.addColorStop(1, '#f3fbff');
       ctx.fillStyle = g;
       ctx.fillRect(0, 0, W, H);
       // matahari berputar
       ctx.save();
       ctx.translate(W - 50, 118);
       ctx.rotate(tick * 0.004);
       ctx.fillStyle = 'rgba(255,240,150,.28)';
       for (let i = 0; i < 12; i++) {
         ctx.rotate(Math.PI / 6);
         ctx.beginPath();
         ctx.moveTo(0, 0);
         ctx.lineTo(-9, -62);
         ctx.lineTo(9, -62);
         ctx.fill();
       }
       ctx.restore();
       const sg = ctx.createRadialGradient(W - 50, 118, 4, W - 50, 118, 26);
       sg.addColorStop(0, '#fffde7');
       sg.addColorStop(1, '#ffca28');
       ctx.fillStyle = sg;
       ctx.beginPath();
       ctx.arc(W - 50, 118, 26, 0, 7);
       ctx.fill();
       for (const c of clouds) {
         c.y += 0.5 + (state === 'play' ? speed * 0.25 : 0);
         if (c.y > H + 40) {
           c.y = -40;
           c.x = Math.random() * W;
         }
         Visuals.cloud(c.x, c.y, c.s);
       }
       // jalur
       ctx.fillStyle = 'rgba(255,255,255,.3)';
       ctx.fillRect(0, 0, W, H);
       ctx.strokeStyle = 'rgba(255,255,255,.85)';
       ctx.lineWidth = 4;
       ctx.lineCap = 'butt';
       ctx.setLineDash([24, 20]);
       ctx.lineDashOffset = -bgY;
       for (let i = 1; i < LANES; i++) {
         ctx.beginPath();
         ctx.moveTo(LANE_W * i, 0);
         ctx.lineTo(LANE_W * i, H);
         ctx.stroke();
       }
       ctx.setLineDash([]);
       for (const d of decor) {
         const x = d.side ? W - 12 : 12;
         d.k ? bush(x, d.y) : flower(x, d.y, d.side ? '#ff6f91' : '#ffd54f');
       }
       // padang rumput
       const gy = H * 0.78 + 58,
         gg = ctx.createLinearGradient(0, gy, 0, H);
       gg.addColorStop(0, '#8fe07a');
       gg.addColorStop(1, '#3f9f45');
       ctx.fillStyle = gg;
       ctx.beginPath();
       ctx.moveTo(0, H);
       for (let x = 0; x <= W; x += 15) ctx.lineTo(x, gy + Math.sin(x * 0.06 + tick * 0.03) * 3);
       ctx.lineTo(W, H);
       ctx.closePath();
       ctx.fill();
       flowers.forEach((f) => flower(f.x, gy + f.y, f.c));
     }

     /* ===================== HUD & BANNER ===================== */
     function drawHud() {
       panel(10, 10, 138, 40, 20, 'rgba(255,255,255,.88)', '#ffb300', 3);
       star(34, 30, 13, '#ffc107');
       text(String(Math.round(dispScore)), 54, 31, 22, '#4a2709', 'left');
       panel(W - 118, 10, 108, 40, 20, 'rgba(255,255,255,.88)', '#ef5350', 3);
       for (let i = 0; i < 3; i++) Visuals.heart(W - 92 + i * 30, 31, i < lives);
       if (goalReached) {
         panel(W / 2 - 80, 58, 160, 28, 14, '#ffd54f', '#f57f17', 2);
         text('🎁 Prize earned!', W / 2, 73, 14, '#d84315');
       } else {
         panel(10, 58, W - 20, 18, 9, 'rgba(255,255,255,.7)', 'rgba(0,0,0,.15)', 2);
         const w = Math.max(14, (W - 24) * Math.min(1, score / GOAL)),
           pg = ctx.createLinearGradient(0, 60, 0, 74);
         pg.addColorStop(0, '#ffe082');
         pg.addColorStop(1, '#ff9800');
         panel(12, 60, w, 14, 7, pg);
         text(score + ' / ' + GOAL, W / 2, 68, 11, '#4a2709');
         text('🎁', W - 24, 68, 15);
       }
     }
     function drawBanner() {
       const k = Math.min(1, (300 - bannerT) / 14),
         a = Math.min(1, bannerT / 30),
         pulse = 1 + Math.sin(tick * 0.2) * 0.02;
       ctx.save();
       ctx.globalAlpha = a;
       ctx.translate(W / 2, H * 0.32);
       const sc = (0.6 + 0.4 * k) * pulse;
       ctx.scale(sc, sc);
       panel(-150, -56, 300, 128, 24, 'rgba(0,0,0,.25)');
       const g = ctx.createLinearGradient(0, -62, 0, 62);
       g.addColorStop(0, '#fff176');
       g.addColorStop(1, '#ffa000');
       panel(-150, -62, 300, 124, 24, g, '#fff', 4);
       text('🏆 ACHIEVEMENT', 0, -38, 15, '#7a4a00');
       stext('Congratulations!', 0, -8, 26, '#fff');
       stext('You won a prize! 🎁', 0, 24, 21, '#fff');
       ctx.restore();
     }

     /* ===================== CINEMATIC CUTSCENE ===================== */
     const CUT_LEN = 650; // ~10,8 detik (60 fps)
     let cutT = 0,
       fadeIn = 0;
     function startCutscene() {
       reset();
       cutT = 0;
       state = 'cutscene';
       Snd.music.play('cut_calm');
     }
     function endCut() {
       startGame();
       fadeIn = 30;
     }

     const GY = 395,
       TOP = 64,
       BOT = 576; // garis tanah & batas area gambar (letterbox 64px)
     const ez = (x) => {
       x = Math.max(0, Math.min(1, x));
       return x * x * (3 - 2 * x);
     };
     const lerp = (a, b, k) => a + (b - a) * k;
     const mixa = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
     const rgb = (a) => `rgb(${a.map(Math.round).join(',')})`;
     const DAWN_T = [255, 150, 110],
       DAWN_B = [255, 224, 170],
       DAY_T = [79, 184, 255],
       DAY_B = [205, 238, 255],
       OM_T = [105, 60, 125],
       OM_B = [235, 110, 105];
     const BARK = [
       [-26, -12, -2],
       [-20, 4, 15],
       [-12, -17, -8],
       [-4, 8, 19],
       [6, -18, -9],
       [14, 3, 13],
       [22, -14, -5],
       [30, 2, 10],
       [38, -8, -2],
     ];
     // Teks narasi: [mulai, selesai, teks] ('|' = baris baru)
     const CAPS = [
       [14, 150, 'In a lush green field...'],
       [158, 325, 'Under sun and rain, the cassava grows|and its root swells beneath the soil!'],
       [332, 398, 'Suddenly... POP! 💥'],
       [404, 456, 'The root hero, rich in fiber!'],
       [462, 550, 'But beware! Sugar & high GI lurk nearby...'],
       [560, 636, 'Help me collect healthy nutrients|and reach 1000 points! 🎁'],
     ];

     function fingerLeaf(x, y, sc, rot) {
       ctx.save();
       ctx.translate(x, y);
       ctx.rotate(rot);
       ctx.scale(sc, sc);
       for (const [a, len] of [
         [-1.15, 26],
         [-0.58, 33],
         [0, 37],
         [0.58, 33],
         [1.15, 26],
       ]) {
         ctx.save();
         ctx.rotate(a);
         ctx.fillStyle = '#43a047';
         ctx.beginPath();
         ctx.moveTo(0, 0);
         ctx.quadraticCurveTo(7, -len * 0.5, 0, -len);
         ctx.quadraticCurveTo(-7, -len * 0.5, 0, 0);
         ctx.fill();
         ctx.strokeStyle = '#1b5e20';
         ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.moveTo(0, -2);
         ctx.lineTo(0, -len + 3);
         ctx.stroke();
         ctx.restore();
       }
       ctx.restore();
     }
     function plant(x, t) {
       // batang singkong tumbuh dari tanah
       const g = ez(t / 300),
         h = 14 + 150 * g,
         lg = ez((g - 0.1) / 0.9);
       ctx.save();
       ctx.translate(x, GY);
       ctx.rotate(Math.sin(t * 0.05) * 0.04);
       ctx.strokeStyle = '#8d6e3f';
       ctx.lineWidth = 5;
       ctx.lineCap = 'round';
       ctx.beginPath();
       ctx.moveTo(0, 2);
       ctx.lineTo(0, -h);
       ctx.stroke();
       fingerLeaf(0, -h, 0.25 + 0.95 * lg, 0);
       fingerLeaf(0, -h * 0.62, 0.9 * lg, -1.05);
       fingerLeaf(0, -h * 0.38, 0.8 * lg, 1.05);
       ctx.restore();
     }
     function tuber(x, topY, s) {
       // umbi singkong tumbuh ke bawah di dalam tanah
       ctx.save();
       ctx.translate(x, topY + 38 * s);
       ctx.scale(s, s);
       ctx.strokeStyle = '#e0c9a0';
       ctx.lineWidth = 1.4;
       for (const [a, b] of [
         [-14, 8],
         [14, 22],
         [-8, 36],
         [6, 44],
       ]) {
         ctx.beginPath();
         ctx.moveTo(a * 0.9, b - 20);
         ctx.lineTo(a * 1.9, b - 12);
         ctx.stroke();
       }
       const body = () => {
         ctx.beginPath();
         ctx.moveTo(0, -38);
         ctx.bezierCurveTo(22, -30, 25, 18, 4, 46);
         ctx.quadraticCurveTo(0, 50, -4, 46);
         ctx.bezierCurveTo(-25, 18, -22, -30, 0, -38);
         ctx.closePath();
       };
       body();
       ctx.fillStyle = '#7a4012';
       ctx.fill();
       ctx.save();
       body();
       ctx.clip();
       ctx.fillStyle = 'rgba(255,200,140,.14)';
       ctx.fillRect(-26, -40, 14, 90);
       ctx.strokeStyle = '#4a2709';
       ctx.lineWidth = 1.5;
       for (const [ly, a, b] of BARK) {
         ctx.beginPath();
         ctx.moveTo(a, ly);
         ctx.quadraticCurveTo((a + b) / 2, ly + 1.5, b, ly);
         ctx.stroke();
       }
       ctx.restore();
       body();
       ctx.strokeStyle = '#4a2709';
       ctx.lineWidth = 2.5;
       ctx.stroke();
       ctx.restore();
     }
     function villain(fn, x, y, s) {
       // item buruk dengan mata marah
       ctx.save();
       ctx.translate(x, y);
       ctx.scale(s, s);
       fn(0, 0);
       for (const ex of [-9, 9]) {
         ctx.fillStyle = '#fff';
         ctx.beginPath();
         ctx.arc(ex, -11, 6, 0, 7);
         ctx.fill();
         ctx.fillStyle = '#000';
         ctx.beginPath();
         ctx.arc(ex + (ex > 0 ? -1.5 : 1.5), -9, 2.6, 0, 7);
         ctx.fill();
       }
       ctx.strokeStyle = '#000';
       ctx.lineWidth = 3;
       ctx.beginPath();
       ctx.moveTo(-16, -23);
       ctx.lineTo(-3, -17);
       ctx.moveTo(16, -23);
       ctx.lineTo(3, -17);
       ctx.stroke();
       ctx.restore();
     }
     function drawCaption(t) {
       const c = CAPS.find((c) => t >= c[0] && t < c[1]);
       if (!c) return;
       const a = Math.min(1, (t - c[0]) / 8, (c[1] - t) / 10),
         lines = c[2].split('|');
       let n = Math.floor((t - c[0]) * 1.3);
       ctx.globalAlpha = Math.max(0, a);
       lines.forEach((ln, i) => {
         const chars = Array.from(ln);
         ctx.font = `bold 14px ${FONT}`;
         const w = ctx.measureText(ln).width;
         text(chars.slice(0, Math.max(0, n)).join(''), (W - w) / 2, BOT + (lines.length > 1 ? 22 : 32) + i * 20, 14, '#fff', 'left');
         n -= chars.length;
       });
       ctx.globalAlpha = 1;
     }

     function drawCutscene() {
       const t = cutT;
       ctx.save();
       ctx.beginPath();
       ctx.rect(0, TOP, W, BOT - TOP);
       ctx.clip();
       // kamera: zoom perlahan + getar kecil saat tanah bergetar / karakter mendarat
       const amp = (t >= 300 && t < 332 ? 2.5 : 0) + (t >= 398 && t < 412 ? 4 * (1 - (t - 398) / 14) : 0);
       const z = 1 + 0.07 * Math.sin(Math.PI * Math.min(1, t / CUT_LEN));
       ctx.translate(W / 2 + Math.sin(t * 2.7) * amp, 320 + Math.cos(t * 3.1) * amp);
       ctx.scale(z, z);
       ctx.translate(-W / 2, -320);

       // langit (fajar → siang → mencekam → cerah lagi)
       const o = ez((t - 452) / 28) * (1 - ez((t - 556) / 30)),
         k1 = ez(t / 150);
       const sg = ctx.createLinearGradient(0, TOP - 40, 0, GY);
       sg.addColorStop(0, rgb(mixa(mixa(DAWN_T, DAY_T, k1), OM_T, o)));
       sg.addColorStop(1, rgb(mixa(mixa(DAWN_B, DAY_B, k1), OM_B, o)));
       ctx.fillStyle = sg;
       ctx.fillRect(-20, TOP - 40, W + 40, BOT - TOP + 100);
       // matahari bergerak melintasi langit
       const sp = Math.min(1, t / 560),
         sx = lerp(50, W - 50, sp),
         sy = GY - 10 - Math.sin(Math.PI * sp) * (GY - TOP - 70);
       ctx.save();
       ctx.translate(sx, sy);
       ctx.rotate(t * 0.006);
       ctx.fillStyle = 'rgba(255,240,150,.3)';
       for (let i = 0; i < 12; i++) {
         ctx.rotate(Math.PI / 6);
         ctx.beginPath();
         ctx.moveTo(0, 0);
         ctx.lineTo(-10, -70);
         ctx.lineTo(10, -70);
         ctx.fill();
       }
       ctx.restore();
       const sgl = ctx.createRadialGradient(sx, sy, 4, sx, sy, 30);
       sgl.addColorStop(0, '#fffde7');
       sgl.addColorStop(1, '#ffca28');
       ctx.fillStyle = sgl;
       ctx.beginPath();
       ctx.arc(sx, sy, 30, 0, 7);
       ctx.fill();
       [
         [40, 120, 1],
         [200, 190, 1.2],
         [310, 150, 0.8],
       ].forEach(([x, y, s], i) => Visuals.cloud(((x + t * (0.25 + i * 0.1)) % (W + 120)) - 40, y, s));
       // bukit
       [
         [GY - 28, 18, 0.02, [165, 214, 167]],
         [GY - 10, 12, 0.035, [124, 200, 118]],
       ].forEach(([b, am, fr, c]) => {
         ctx.fillStyle = rgb(mixa(c, [95, 75, 120], o));
         ctx.beginPath();
         ctx.moveTo(-20, GY + 5);
         for (let x = -20; x <= W + 20; x += 10) ctx.lineTo(x, b - Math.sin(x * fr + 1) * am);
         ctx.lineTo(W + 20, GY + 5);
         ctx.fill();
       });
       // hujan
       const ra = ez((t - 162) / 20) * (1 - ez((t - 300) / 20));
       if (ra > 0) {
         ctx.globalAlpha = ra;
         Visuals.cloud(W / 2 - 50, TOP + 50, 1.7);
         Visuals.cloud(W / 2 + 50, TOP + 62, 1.5);
         ctx.globalAlpha = 1;
         ctx.strokeStyle = `rgba(110,170,255,${0.85 * ra})`;
         ctx.lineWidth = 2;
         ctx.beginPath();
         for (let i = 0; i < 46; i++) {
           const x = (i * 61) % W,
             y = TOP + 90 + ((t * 11 + i * 83) % (GY - TOP - 90));
           ctx.moveTo(x, y);
           ctx.lineTo(x - 3, y + 12);
         }
         ctx.stroke();
       }
       // tanaman (tercabut ke atas saat umbi meloncat keluar)
       if (t < 360) {
         ctx.save();
         ctx.translate(0, -ez((t - 330) / 22) * 420);
         plant(W / 2, t);
         ctx.restore();
       }

       // tanah + rumput + lubang
       const sgd = ctx.createLinearGradient(0, GY, 0, BOT + 60);
       sgd.addColorStop(0, '#9a6232');
       sgd.addColorStop(1, '#4e2c12');
       ctx.fillStyle = sgd;
       ctx.fillRect(-20, GY + 4, W + 40, BOT - GY + 80);
       ctx.fillStyle = 'rgba(0,0,0,.16)';
       for (let i = 0; i < 34; i++) {
         ctx.beginPath();
         ctx.arc((i * 97) % W, GY + 26 + ((i * 53) % 150), 1.5 + (i % 3), 0, 7);
         ctx.fill();
       }
       ctx.fillStyle = 'rgba(255,224,178,.2)';
       for (let i = 0; i < 6; i++) {
         ctx.beginPath();
         ctx.ellipse((i * 131 + 30) % W, GY + 60 + ((i * 41) % 110), 7, 4, 0, 0, 7);
         ctx.fill();
       }
       ctx.fillStyle = '#5cb85c';
       ctx.fillRect(-20, GY, W + 40, 12);
       ctx.fillStyle = '#86dc74';
       ctx.fillRect(-20, GY, W + 40, 4);
       if (t >= 330) {
         ctx.fillStyle = '#a1673a';
         ctx.beginPath();
         ctx.ellipse(W / 2, GY + 3, 42, 9, 0, 0, 7);
         ctx.fill();
         ctx.fillStyle = '#3e2410';
         ctx.beginPath();
         ctx.ellipse(W / 2, GY + 5, 30, 7, 0, 0, 7);
         ctx.fill();
       }
       // stek batang + umbi yang membesar di dalam tanah
       if (t < 332) {
         ctx.save();
         ctx.translate(W / 2, GY + 14);
         ctx.rotate(-0.12);
         panel(-30, -4, 60, 9, 4, '#b9854f', '#6d4a24', 1.5);
         ctx.restore();
         const wig = t > 296 ? Math.sin(t * 1.8) * 2.5 : 0,
           ts = 0.06 + 1.06 * ez((t - 150) / 170);
         if (t >= 150) tuber(W / 2 + wig, GY + 12, ts);
         if (t > 300) star(W / 2 + Math.sin(t * 0.3) * 34, GY + 60 + Math.cos(t * 0.4) * 22, 5, '#fff59d');
       }

       // penjahat: gula & GI tinggi (mata marah)
       if (t >= 452 && t < 560) {
         [
           [Visuals.sugar, W / 2, 175, 0],
           [Visuals.highGI, 72, 250, 1],
           [Visuals.sugar, W - 72, 262, 2],
         ].forEach(([fn, x, y, i]) => {
           const e = ez((t - 452 - i * 4) / 22),
             sc = e * (1 - ez((t - 548) / 10)) * 1.15;
           if (sc < 0.02) return;
           villain(fn, x, y + Math.sin(t * 0.1 + i) * 6 - (1 - e) * 220, sc);
         });
       }
       // karakter: meloncat dari tanah, mendarat (squash), melompat riang, cemas saat ada penjahat
       if (t >= 330) {
         let cx = W / 2,
           cy = GY - 52,
           sx2 = 1,
           sy2 = 1,
           rot = 0;
         if (t < 400) {
           const u = (t - 330) / 70;
           cy = lerp(GY + 34, GY - 52, u) - Math.sin(Math.PI * u) * 170;
           sy2 = 1 + 0.12 * Math.sin(Math.PI * u);
           sx2 = 1 - 0.06 * Math.sin(Math.PI * u);
           rot = Math.sin(u * Math.PI * 2) * 0.2;
         }
         const sq = t >= 398 && t < 416 ? Math.sin((Math.PI * (t - 398)) / 18) * 0.18 : 0;
         sx2 += sq;
         sy2 -= sq;
         if ((t >= 416 && t < 456) || t >= 575) cy -= Math.abs(Math.sin(t * 0.16)) * 14;
         if (t >= 462 && t < 550) cx += Math.sin(t * 1.2) * 1.6;
         ctx.save();
         if (t < 345) {
           ctx.beginPath();
           ctx.rect(-20, TOP - 40, W + 40, GY + 4 - (TOP - 40));
           ctx.clip();
         }
         ctx.translate(cx, cy + 52);
         ctx.scale(sx2, sy2);
         ctx.rotate(rot);
         ctx.translate(-cx, -(cy + 52));
         Visuals.cassava(cx, cy, t);
         ctx.restore();
         if (t >= 462 && t < 550) text('❗', cx, cy - 98 + Math.sin(t * 0.3) * 3, 26 * (1 + Math.sin(t * 0.3) * 0.1));
       }
       // item sehat datang menolong
       if (t >= 560) {
         [
           [Visuals.lowGI, 78, 236, 0],
           [Visuals.fiber, W - 78, 226, 2],
           [Visuals.mocaf, W / 2, 160, 4],
         ].forEach(([fn, x, y, p], i) => {
           const e = ez((t - 560 - i * 6) / 18);
           if (e <= 0) return;
           const yy = y + Math.sin(t * 0.07 + p) * 7;
           icon(fn, x, yy, e * 0.95);
           if (e >= 1) star(x + Math.cos(t * 0.1 + i) * 32, yy + Math.sin(t * 0.1 + i) * 32, 5, '#ffeb3b');
         });
       }
       particles.forEach((p) => {
         ctx.globalAlpha = p.life / 26;
         ctx.fillStyle = p.c;
         ctx.beginPath();
         ctx.arc(p.x, p.y, 3.5, 0, 7);
         ctx.fill();
       });
       ctx.globalAlpha = 1;
       // balon ucapan
       if (t >= 404 && t < 460) {
         const b = ez((t - 404) / 10) * (1 - ez((t - 450) / 10));
         ctx.save();
         ctx.translate(W / 2, GY - 190);
         ctx.scale(b, b);
         panel(-98, -24, 196, 44, 16, '#fff', '#4a2709', 3);
         ctx.beginPath();
         ctx.moveTo(-9, 19);
         ctx.lineTo(0, 34);
         ctx.lineTo(9, 19);
         ctx.fillStyle = '#fff';
         ctx.fill();
         text("Hi! I'm Cassava! 👋", 0, -2, 14, '#4a2709');
         ctx.restore();
       }
       if (o > 0) {
         ctx.fillStyle = `rgba(60,0,40,${0.2 * o})`;
         ctx.fillRect(-20, TOP - 40, W + 40, BOT - TOP + 100);
       }
       ctx.restore();

       // letterbox sinematik + judul + tombol lewati + narasi
       ctx.fillStyle = '#000';
       ctx.fillRect(0, 0, W, TOP);
       ctx.fillRect(0, BOT, W, H - BOT);
       text('🎬 CASSAVA STORY', 14, TOP / 2, 12, '#ffe082', 'left');
       panel(W - 100, 17, 88, 30, 15, 'rgba(255,255,255,.16)', 'rgba(255,255,255,.7)', 2);
       text('Skip ▶', W - 56, 32, 13, '#fff');
       buttons.push({ x: W - 106, y: 8, w: 100, h: 48, action: endCut });
       drawCaption(t);
       const bl = 1 - ez(t / 30),
         wh = ez((t - (CUT_LEN - 34)) / 30);
       if (bl > 0) {
         ctx.fillStyle = `rgba(0,0,0,${bl})`;
         ctx.fillRect(0, 0, W, H);
       }
       if (wh > 0) {
         ctx.fillStyle = `rgba(255,255,255,${wh})`;
         ctx.fillRect(0, 0, W, H);
       }
     }

     /* ===================== RENDER ===================== */
     const EDU = ['Great job! You kept your blood sugar stable!', 'Cassava MOCAF is rich in fiber and has a lower GI. Try again!', 'Choose low-GI foods so your energy lasts longer.'];
     function wrap(s, x, y, maxW, lh, size, color) {
       ctx.font = `bold ${size}px ${FONT}`;
       let line = '',
         n = 0;
       for (const w of s.split(' ')) {
         const t = line + w + ' ';
         if (ctx.measureText(t).width > maxW && line) {
           text(line.trim(), x, y + n++ * lh, size, color);
           line = w + ' ';
         } else line = t;
       }
       text(line.trim(), x, y + n * lh, size, color);
     }

     function drawLobby() {
       title('CASSAVA QUEST', W / 2, 58, 36);
       const rg = ctx.createLinearGradient(0, 90, 0, 120);
       rg.addColorStop(0, '#ff9800');
       rg.addColorStop(1, '#e65100');
       panel(W / 2 - 80, 92, 160, 32, 16, rg, '#fff', 3);
       stext('Watch Your GI!', W / 2, 108, 18, '#fff');
       // sorotan di belakang maskot
       const gl = ctx.createRadialGradient(W / 2, 215, 10, W / 2, 215, 120);
       gl.addColorStop(0, 'rgba(255,255,255,.95)');
       gl.addColorStop(1, 'rgba(255,255,255,0)');
       ctx.fillStyle = gl;
       ctx.beginPath();
       ctx.arc(W / 2, 215, 120, 0, 7);
       ctx.fill();
       // item melayang
       icon(Visuals.lowGI, 52, 175 + Math.sin(tick * 0.05) * 7, 0.85);
       icon(Visuals.fiber, W - 52, 160 + Math.sin(tick * 0.05 + 2) * 7, 0.85);
       icon(Visuals.mocaf, 58, 262 + Math.sin(tick * 0.05 + 4) * 7, 0.8);
       icon(Visuals.highGI, W - 58, 255 + Math.sin(tick * 0.05 + 1) * 7, 0.8);
       ctx.save();
       ctx.translate(W / 2, 205 + Math.sin(tick * 0.06) * 5);
       ctx.scale(1.45, 1.45);
       Visuals.cassava(0, 0, tick);
       ctx.restore();
       // kartu misi
       panel(24, 340 + 5, W - 48, 122, 22, 'rgba(0,0,0,.18)');
       panel(24, 340, W - 48, 122, 22, 'rgba(255,255,255,.94)', '#66bb6a', 3);
       icon(Visuals.lowGI, 56, 372, 0.5);
       text('Collect fiber, GI 56 & MOCAF', 84, 372, 14, '#2e7d32', 'left');
       icon(Visuals.highGI, 56, 404, 0.5);
       text('Avoid sugar & GI 90+', 84, 404, 14, '#c62828', 'left');
       text('🎁', 56, 436, 20);
       text('Reach ' + GOAL + ' points = a PRIZE!', 84, 436, 14, '#e65100', 'left');
       text('👆 Slide your finger left / right to move', W / 2, 486, 13, '#1b5e20');
       text('⌨️ Desktop: ← → keys', W / 2, 506, 12, '#2e7d32', 'center', 'normal');
       button('▶  START GAME', W / 2, 565, 250, 64, '#5ee06f', '#1e9e35', startCutscene, true);
     }

     function drawOver() {
       ctx.fillStyle = 'rgba(10,35,20,.78)';
       ctx.fillRect(0, 0, W, H);
       panel(24, 45, W - 48, 560, 28, 'rgba(0,0,0,.3)');
       panel(24, 38, W - 48, 560, 28, '#fffdf5', '#fff', 4);
       const hg = ctx.createLinearGradient(0, 38, 0, 98);
       hg.addColorStop(0, '#ff7043');
       hg.addColorStop(1, '#d84315');
       ctx.save();
       ctx.beginPath();
       ctx.roundRect(24, 38, W - 48, 62, [28, 28, 0, 0]);
       ctx.fillStyle = hg;
       ctx.fill();
       ctx.restore();
       stext('GAME OVER!', W / 2, 70, 22, '#fff');
       text('Final Score', W / 2, 126, 15, '#6d4c41', 'center', 'normal');
       star(W / 2 - 74, 172, 20, '#ffc107');
       stext(String(score), W / 2 + 8, 172, 54, '#ff8f00');
       panel(48, 216, W - 96, 14, 7, '#eee', '#e0e0e0', 2);
       const pg = ctx.createLinearGradient(0, 216, 0, 230);
       pg.addColorStop(0, '#ffe082');
       pg.addColorStop(1, '#ff9800');
       panel(48, 216, Math.max(14, (W - 96) * Math.min(1, score / GOAL)), 14, 7, pg);
       if (goalReached) {
         const g = ctx.createLinearGradient(0, 246, 0, 322);
         g.addColorStop(0, '#fff176');
         g.addColorStop(1, '#ffa000');
         panel(44, 246, W - 88, 78, 20, g, '#fff', 3);
         text('🏆 ACHIEVEMENT', W / 2, 268, 13, '#7a4a00');
         stext('Congratulations! You won a prize! 🎁', W / 2, 300, 15, '#fff');
       } else {
         panel(44, 246, W - 88, 78, 20, '#fff3e0', '#ffb74d', 2);
         text('🎁 A prize awaits you!', W / 2, 272, 15, '#e65100');
         text(GOAL - score + ' points to go', W / 2, 300, 16, '#bf360c');
       }
       panel(44, 340, W - 88, 84, 18, '#e8f5e9');
       wrap(EDU[Math.floor(score / 100) % EDU.length], W / 2, 365, W - 120, 22, 14, '#1b5e20');
       button('↻  Play Again', W / 2, 475, 240, 56, '#5ee06f', '#1e9e35', startGame, true);
       button('🏠  Lobby', W / 2, 545, 240, 56, '#4fc3f7', '#1e88e5', toLobby);
     }

     function render() {
       ctx.save();
       if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
       buttons = [];
       if (state === 'cutscene') {
         drawCutscene();
         drawMute();
         ctx.restore();
         return;
       }
       drawBg();
       if (state === 'menu') drawLobby();
       else {
         items.forEach((i) => i.draw());
         player.draw(tick);
         particles.forEach((p) => {
           ctx.globalAlpha = p.life / 26;
           ctx.fillStyle = p.c;
           ctx.beginPath();
           ctx.arc(p.x, p.y, 3.5, 0, 7);
           ctx.fill();
         });
         ctx.globalAlpha = 1;
         popups.forEach((p) => {
           ctx.globalAlpha = Math.min(1, p.life / 15);
           stext(p.s, p.x, p.y, 20, p.c);
         });
         ctx.globalAlpha = 1;
         drawHud();
         if (state === 'play' && bannerT > 0) drawBanner();
         if (flash > 0) {
           ctx.fillStyle = `rgba(255,0,0,${flash / 40})`;
           ctx.fillRect(0, 0, W, H);
         }
       }
       if (state === 'over') drawOver();
       if (fadeIn > 0) {
         ctx.fillStyle = `rgba(255,255,255,${fadeIn / 30})`;
         ctx.fillRect(0, 0, W, H);
       }
       drawMute();
       ctx.restore();
     }

     /* ===================== INPUT: GESER (SLIDE) ===================== */
     const keys = { l: false, r: false };
     let drag = null;
     addEventListener('keydown', (e) => {
       unlockAudio();
       if (e.key === 'm' || e.key === 'M') Snd.toggle();
       if (e.key === 'ArrowLeft') keys.l = true;
       if (e.key === 'ArrowRight') keys.r = true;
       if (state === 'menu' && e.key === 'Enter') startCutscene();
       else if (state === 'over' && e.key === 'Enter') startGame();
       else if (state === 'over' && e.key === 'Escape') toLobby();
       else if (state === 'cutscene' && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) endCut();
     });
     addEventListener('keyup', (e) => {
       if (e.key === 'ArrowLeft') keys.l = false;
       if (e.key === 'ArrowRight') keys.r = false;
     });
     const pos = (e) => {
       const r = cv.getBoundingClientRect();
       return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
     };
     cv.addEventListener('pointerdown', (e) => {
       e.preventDefault();
       try {
         cv.setPointerCapture(e.pointerId);
       } catch (_) {}
       unlockAudio();
       const p = pos(e);
       if (p.x > W - 52 && p.y > H - 52) {
         Snd.toggle();
         return;
       } // tombol suara
       if (state === 'menu' || state === 'over' || state === 'cutscene') {
         for (const b of buttons)
           if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) {
             Snd.sfx.click();
             b.action();
             return;
           }
         return;
       }
       if (state === 'play') drag = { px: p.x, tx: player.tx }; // titik awal geser
     });
     cv.addEventListener('pointermove', (e) => {
       if (!drag || state !== 'play') return;
       e.preventDefault();
       player.setTarget(drag.tx + (pos(e).x - drag.px) * 1.15); // karakter mengikuti geseran jari
     });
     const endDrag = () => {
       drag = null;
     };
     cv.addEventListener('pointerup', endDrag);
     cv.addEventListener('pointercancel', endDrag);

     /* ===================== LOOP ===================== */
     reset();
     let last = 0,
       acc = 0;
     function loop(ts) {
       acc += Math.min(ts - last, 100);
       last = ts;
       while (acc >= 1000 / 60) {
         if (state === 'play') {
           if (keys.l) player.nudge(-7);
           if (keys.r) player.nudge(7);
         }
         update();
         acc -= 1000 / 60;
       }
       render();
       requestAnimationFrame(loop);
     }
     requestAnimationFrame(loop);
   })();
