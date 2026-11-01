// 아르페지에이터: 누른 화음을 한꺼번에 vs 한 음씩 순서대로(위로, 아래로, 위아래, 무작위, 누른 순서) 펼침
GTL.register({
  id: 'arpeggiator',
  title: '아르페지에이터',
  summary: '누르고 있는 화음의 음을 정해진 순서와 빠르기로 하나씩 연주하는 아르페지에이터. 같은 4화음 진행이 덩어리 화음에서 움직이는 선율 패턴으로 바뀜.',
  views: { a: '화음 그대로', b: '아르페지오 (위로, 2옥타브)' },
  info: `
    <p><b>아르페지에이터(Arpeggiator)</b>는 건반에서 누르고 있는 음들을 한 음씩 차례로 연주해 주는 장치. 1970~80년대 신스(Roland Jupiter-8, Juno 등)부터 들어갔고, 지금은 거의 모든 신스와 DAW에 있음.</p>
    <ul>
      <li><b>모드</b>: 위로(낮은 음부터), 아래로, 위아래(양 끝 음은 한 번만), 무작위, 누른 순서</li>
      <li><b>옥타브 범위</b>: 한 바퀴를 돈 뒤 한 옥타브 위에서 반복. 2옥타브면 음 4개가 8개가 됨.</li>
      <li><b>빠르기</b>: 템포에 맞춘 음표 단위 (8분음표, 16분음표, 셋잇단)</li>
      <li><b>게이트(Gate)</b>: 한 칸 중 음이 울리는 비율. 짧으면 스타카토, 100%면 레가토.</li>
    </ul>
    <p>구현은 "누른 음 목록 → 정렬 → 옥타브 확장 → 모드 순서 → 칸마다 하나씩 꺼내기". 화음이 바뀔 때 순서 위치를 처음으로 돌릴지(retrigger) 이어갈지에 따라 느낌이 달라짐.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('누른 음 C E G B → 정렬 → 2옥타브 확장 → 칸마다 하나씩', 'Held C E G B → sort → extend to 2 octaves → one per step')}</text>
    ${[0, 1, 2, 3].map((i) => `<rect x="20" y="${126 - i * 22}" width="40" height="16" class="f-a"/>`).join('')}
    <text x="40" y="160" text-anchor="middle" class="t-small t-a">${L('화음', 'chord')}</text>
    <line x1="80" y1="30" x2="80" y2="150" class="d-dim"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${100 + i * 52}" y="${130 - i * 13}" width="46" height="12" class="f-b"/>`).join('')}
    <text x="310" y="160" text-anchor="middle" class="t-small t-b">${L('위로 모드: C E G B C E G B (한 옥타브 위)', 'Up mode: C E G B C E G B (one octave up)')}</text>
  </svg>`,
  look: [
    'A는 박마다 4음 화음이 한꺼번에 울림. B는 같은 화음이 16분음표 계단으로 펼쳐짐.',
    'B의 모드를 "위아래"로 바꾸면 피아노 롤이 산 모양이 됨. "무작위"는 같은 음 집합에서 순서만 흩어짐.',
    '"누른 순서"는 E C G B처럼 누른 순서를 그대로 따라 정렬된 모드와 다른 선율이 됨',
    '게이트를 20%로 내리면 음 막대가 짧아지고 소리가 통통 튐. 100%면 이어짐.',
    '빠르기를 셋잇단으로 바꾸면 한 박에 6음이 들어가 4음 화음과 어긋나며 강세 위치가 계속 바뀜',
  ],
  refs: [
    { type: 'engine', title: 'Roland Jupiter-8 Owner\'s Manual', year: 1981, note: '아르페지에이터 모드 (UP, DOWN, U&D, RANDOM)와 범위' },
    { type: 'engine', title: 'Ableton Live Reference Manual, "Arpeggiator" MIDI effect', url: 'https://www.ableton.com/en/live-manual/', note: '스타일, 게이트, 리트리거, 옥타브 전치(Transpose Steps)' },
    { type: 'book', title: 'Edward Aldwell, Carl Schachter, Harmony and Voice Leading', year: 2010, note: '7화음과 화음 진행' },
  ],
  params: [
    { key: 'mode', label: '모드', type: 'select', options: [{ value: 'off', label: '화음 그대로 (끔)' }, { value: 'up', label: '위로' }, { value: 'down', label: '아래로' }, { value: 'updown', label: '위아래' }, { value: 'random', label: '무작위' }, { value: 'order', label: '누른 순서' }], a: 'off', b: 'up', group: '아르페지에이터' },
    { key: 'oct', label: '옥타브 범위', type: 'int', min: 1, max: 3, a: 1, b: 2, default: 1 },
    { key: 'rate', label: '빠르기', type: 'select', options: [{ value: 2, label: '8분음표' }, { value: 3, label: '8분 셋잇단' }, { value: 4, label: '16분음표' }, { value: 6, label: '16분 셋잇단' }], default: 4 },
    { key: 'gate', label: '게이트 (%)', type: 'range', min: 10, max: 100, step: 1, default: 60 },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 160, default: 110, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Arpeggiator',
    summary: 'An arpeggiator plays the notes of a held chord one at a time in a set order and speed. The same four-chord progression turns from block chords into a moving melodic pattern.',
    views: { a: 'Block chords', b: 'Arpeggio (up, 2 octaves)' },
    info: `
    <p>An <b>arpeggiator</b> plays the keys you hold one at a time, in order. It appeared in 1970s and 80s synths (Roland Jupiter-8, Juno and others). Today almost every synth and DAW has one.</p>
    <ul>
      <li><b>Mode</b>: up (lowest first), down, up-down (end notes only once), random, as played.</li>
      <li><b>Octave range</b>: after one pass, repeat one octave higher. With 2 octaves, 4 notes become 8.</li>
      <li><b>Rate</b>: a note value synced to the tempo (8th, 16th, triplets).</li>
      <li><b>Gate</b>: the part of a step where the note sounds. Short is staccato, 100% is legato.</li>
    </ul>
    <p>The steps are "held notes → sort → extend octaves → order by mode → take one per step". Whether the order restarts when the chord changes (retrigger) or continues changes the feel.</p>`,
    look: [
      'A plays all 4 chord notes on each beat. B spreads the same chord into a staircase of 16th notes.',
      'Set B\'s mode to "Up-down". The piano roll turns into hills. "Random" keeps the same notes but scatters the order.',
      '"As played" follows the press order, like E C G B, and gives a different melody from the sorted modes.',
      'Lower the gate to 20%. The note bars get short and the sound bounces. At 100% the notes connect.',
      'Set the rate to triplets. 6 notes fit in one beat, so they drift against the 4-note chord and the accents keep moving.',
    ],
    refs: ['Arpeggiator modes (UP, DOWN, U&D, RANDOM) and range.', 'Style, gate, retrigger and octave transpose (Transpose Steps).', 'Seventh chords and chord progressions.'],
    params: {
      mode: { label: 'Mode', group: 'Arpeggiator', options: { off: 'Block chord (off)', up: 'Up', down: 'Down', updown: 'Up-down', random: 'Random', order: 'As played' } },
      oct: 'Octave range',
      rate: { label: 'Rate', options: { 2: '8th note', 3: '8th triplet', 4: '16th note', 6: '16th triplet' } },
      gate: 'Gate (%)',
      bpm: 'Tempo (BPM)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const L = (k, e) => GTL.L(k, e);
    const col = ctx.side === 'a' ? C.a : C.b;
    // ── 작은 드럼, 음 합성기 (이 카테고리 샘플마다 같은 코드를 둠). 시드 노이즈, 블록 안 샘플 위치에서 시작 ──
    function makeKit(seed) {
      let s = (seed >>> 0) || 1;
      const nz = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 2147483648 - 1; };
      const vs = [];
      const LEN = { kick: 0.6, snare: 0.35, hat: 0.12, ohat: 0.5, clap: 0.35, rim: 0.08, tom: 0.5, bell: 0.9 };
      return {
        vs,
        // kind: kick, snare, hat, ohat, clap, rim, tom, bell, tone, bass. at: 블록 안 시작 샘플. o: { vel, f, dur, pan, cut }
        trig(kind, at, o = {}) {
          if (vs.length > 48) vs.shift();
          vs.push({ kind, at: Math.max(0, at | 0), t: 0, vel: o.vel ?? 1, f: o.f || 220, dur: o.dur || 0.2, pan: o.pan || 0, cut: o.cut || 0, ph: 0, lp: 0, lp2: 0, x1: 0 });
        },
        render(Lb, Rb, n, sr) {
          Lb.fill(0); Rb.fill(0);
          const dt = 1 / sr, T = 6.283185307;
          for (let j = vs.length - 1; j >= 0; j--) {
            const v = vs[j];
            const end = v.kind === 'tone' || v.kind === 'bass' ? v.dur + 0.12 : LEN[v.kind] || 0.3;
            const gl = v.vel * (1 - Math.max(0, v.pan)), gr = v.vel * (1 + Math.min(0, v.pan));
            for (let i = v.at; i < n && v.t < end; i++) {
              const t = v.t; let y = 0;
              switch (v.kind) {
                case 'kick': { v.ph += (48 + 120 * Math.exp(-t * 28)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 6) * 0.9; break; }
                case 'tom': { v.ph += (v.f * 0.5 + v.f * 0.3 * Math.exp(-t * 20)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 8) * 0.6; break; }
                case 'snare': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.35 * Math.exp(-t * 18) + Math.sin(T * 185 * t) * 0.4 * Math.exp(-t * 25); break; }
                case 'hat': case 'ohat': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.16 * Math.exp(-t * (v.kind === 'hat' ? 50 : 9)); break; }
                case 'clap': {
                  const w = nz(), h = w - v.x1; v.x1 = w; let e = 0;
                  for (let k = 0; k < 3; k++) { const tk = t - k * 0.011; if (tk >= 0) e += Math.exp(-tk * 140); }
                  if (t > 0.022) e += Math.exp(-(t - 0.022) * 16) * 0.6;
                  y = h * 0.3 * e; break;
                }
                case 'rim': y = Math.sin(T * 1650 * t) * Math.exp(-t * 80) * 0.45; break;
                case 'bell': y = (Math.sin(T * v.f * t) + 0.4 * Math.sin(T * v.f * 2.76 * t)) * Math.exp(-t * 5) * 0.35 * Math.min(1, t / 0.002); break;
                default: { // tone, bass: 톱니파(+삼각파) + 2차 원폴 로우패스, 짧은 어택과 릴리스
                  v.ph += v.f * dt; v.ph -= Math.floor(v.ph);
                  const bass = v.kind === 'bass';
                  const raw = bass ? (2 * v.ph - 1) * 0.5 + (4 * Math.abs(v.ph - 0.5) - 1) * 0.6 : 2 * v.ph - 1;
                  const c = v.cut || (bass ? 0.05 : 0.12);
                  v.lp += c * (raw - v.lp); v.lp2 += c * (v.lp - v.lp2);
                  const env = Math.min(1, t / 0.004) * (t < v.dur ? 1 : Math.max(0, 1 - (t - v.dur) / 0.12)) * (bass ? Math.exp(-t * 1.2) : Math.exp(-t * 2.5));
                  y = v.lp2 * env * (bass ? 0.9 : 0.7);
                }
              }
              Lb[i] += y * gl; Rb[i] += y * gr;
              v.t += dt;
            }
            v.at = 0;
            if (v.t >= end) vs.splice(j, 1);
          }
          for (let i = 0; i < n; i++) { Lb[i] = Math.tanh(Lb[i] * 1.1) * 0.6; Rb[i] = Math.tanh(Rb[i] * 1.1) * 0.6; }
        },
      };
    }
    // 시드 해시 (0~1). 같은 i, salt면 같은 값. 화면과 소리가 같은 난수를 씀
    const hash = (i, salt = 0) => {
      let x = (Math.imul(i | 0, 2654435761) ^ Math.imul((salt | 0) + 1 + ctx.seed, 2246822519)) >>> 0;
      x ^= x >>> 15; x = Math.imul(x, 2246822519); x ^= x >>> 13; x = Math.imul(x, 3266489917); x ^= x >>> 16;
      return (x >>> 0) / 4294967296;
    };
    // 반복 이벤트 목록(evs: [{ t, ... }], 0 <= t < len) 중 [t0, t1)에 걸리는 것을 fn(e, 절대 시각)으로 넘김
    const loopEach = (evs, len, t0, t1, fn) => {
      if (!(len > 0)) return;
      for (let c = Math.floor(t0 / len); c * len < t1; c++) for (const e of evs) { const t = c * len + e.t; if (t >= t0 && t < t1) fn(e, t); }
    };
    // 재생 시계: 소리가 꺼져 있으면 update의 dt로, 켜져 있으면 오디오 블록으로 진행. 일시정지 중에는 소리를 멈춤
    const clock = { t: 0, seen: 0 };
    const kit = makeKit(ctx.seed * 7 + 3);
    const runAudio = (l, r, sr, n, schedule) => {
      if (ctx.now() - clock.seen > 400) { l.fill(0); r.fill(0); return; }
      const t0 = clock.t, t1 = t0 + n / sr;
      schedule(t0, t1, (kind, t, o) => kit.trig(kind, (t - t0) * sr, o));
      kit.render(l, r, n, sr);
      clock.t = t1;
    };
    const tick = (dt) => { clock.seen = ctx.now(); if (!snd.on) clock.t += dt; snd.update(); };
    // 뷰 왼쪽 위의 뷰 이름 표시와 겹치지 않게 그림 전체를 TOP만큼 내림
    const TOP = 26;
    // 화음 진행 (한 마디씩). held: 누른 순서
    const PROG = [
      { name: 'Cmaj7', held: [64, 60, 67, 71] },
      { name: 'Am7', held: [57, 64, 60, 67] },
      { name: 'Dm7', held: [62, 65, 69, 60] },
      { name: 'G7', held: [55, 59, 65, 62] },
    ];
    // 모드에 따른 음 순서
    function order(held, mode, oct) {
      const base = mode === 'order' ? held.slice() : held.slice().sort((a, b) => a - b);
      let seq = [];
      for (let o = 0; o < oct; o++) seq.push(...base.map((m) => m + 12 * o));
      if (mode === 'down') seq.reverse();
      if (mode === 'updown' && seq.length > 2) seq = seq.concat(seq.slice(1, -1).reverse());
      return seq;
    }
    let key = '', evs = [], loopLen = 1;
    function compute() {
      const k = [P.mode, P.oct, P.rate, P.gate, P.bpm].join(',');
      if (k === key) return evs;
      key = k; evs = [];
      const beat = 60 / P.bpm, bar = beat * 4, rate = Number(P.rate), sd = beat / rate;
      loopLen = bar * PROG.length;
      PROG.forEach((ch, bi) => {
        if (P.mode === 'off') {
          for (let b = 0; b < 4; b++) ch.held.forEach((m) => evs.push({ t: bi * bar + b * beat, m, dur: beat * P.gate / 100, vel: b === 0 ? 0.42 : 0.32 }));
          return;
        }
        const seq = order(ch.held, P.mode, P.oct), steps = 4 * rate;
        const r = U.rng(ctx.seed * 13 + bi * 101);
        for (let s = 0; s < steps; s++) {
          const m = P.mode === 'random' ? r.pick(seq) : seq[s % seq.length];
          evs.push({ t: bi * bar + s * sd, m, dur: sd * P.gate / 100, vel: s % rate === 0 ? 0.85 : 0.6 });
        }
      });
      return evs;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const e = compute();
          loopEach(e, loopLen, t0, t1, (ev, t) => trig('tone', t, { f: A.mtof(ev.m), dur: ev.dur, vel: ev.vel, cut: 0.18 }));
          const beat = 60 / P.bpm;
          for (let i = Math.ceil(t0 / beat - 1e-9); i * beat < t1; i++) if (i * beat >= t0 && i % 4 === 0) trig('bass', i * beat, { f: A.mtof(PROG[Math.floor(i / 4) % 4].held.slice().sort((a, b) => a - b)[0] - 12), dur: beat * 3.5, vel: 0.5 });
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const e = compute(), beat = 60 / P.bpm, bar = beat * 4;
        const now = clock.t % loopLen, curBar = Math.floor(now / bar);
        // 피아노 롤: 2마디 (지금 마디와 다음 마디)
        const lo = 53, hi = 71 + 12 * (P.mode === 'off' ? 0 : P.oct - 1) + 2;
        const rx = pad + 26, ry = pad + 18, rw = W - rx - pad, kh = Math.max(50, H - ry - 96);
        const span = bar * 2, start = curBar * bar;
        const X = (t) => rx + ((t - start) / span) * rw, Y = (m) => ry + kh - ((m - lo + 1) / (hi - lo + 1)) * kh;
        const rowH = kh / (hi - lo + 1);
        D.rect(g, rx, ry, rw, kh, 'rgba(0,0,0,0.3)');
        for (let m = lo; m <= hi; m++) if (A.isBlackKey(m)) D.rect(g, rx, Y(m), rw, rowH, 'rgba(255,255,255,0.03)');
        for (let b = 0; b <= 8; b++) D.line(g, rx + (b / 8) * rw, ry, rx + (b / 8) * rw, ry + kh, b % 4 === 0 ? 'rgba(255,255,255,0.3)' : C.grid, 1);
        for (let k = 0; k < 2; k++) D.text(g, PROG[(curBar + k) % 4].name, rx + k * rw / 2 + 4, pad + 2, { size: 11, color: C.text });
        for (const m of [60, 72, 84]) if (m >= lo && m <= hi) D.text(g, A.noteName(m), pad, Y(m) - 2, { size: 9, color: C.dim });
        const sounding = new Set();
        g.save(); g.beginPath(); g.rect(rx, ry, rw, kh); g.clip(); // 다음 바퀴 음이 오른쪽 밖으로 넘치지 않게
        for (const ev of e) {
          for (const off of [0, loopLen]) {
            const t = ev.t + off;
            if (t + ev.dur < start || t > start + span) continue;
            const on = off === 0 && now >= ev.t && now < ev.t + ev.dur;
            if (on) sounding.add(ev.m);
            D.rect(g, X(t), Y(ev.m), Math.max(2, (ev.dur / span) * rw - 1), Math.max(2, rowH - 1), on ? '#fff' : col);
          }
        }
        g.restore();
        D.line(g, X(now), ry, X(now), ry + kh, C.warn, 1.5);
        // 건반: 누른 음(흐림) + 지금 울리는 음
        const ky = ry + kh + 26, marks = {};
        PROG[curBar].held.forEach((m) => { marks[m] = 'rgba(255,203,107,0.55)'; });
        sounding.forEach((m) => { marks[m] = col; });
        D.text(g, L('건반: 노랑 = 누른 화음, 색 = 지금 울리는 음', 'Keys: yellow = held chord, color = sounding now'), pad, ky - 14, { size: 9, color: C.dim });
        A.drawKeyboard(g, pad, ky, W - pad * 2, Math.min(60, H - ky - 6), 48, 95, marks);
        const perBar = P.mode === 'off' ? 16 : 4 * Number(P.rate);
        const seqLen = P.mode === 'off' ? 4 : order(PROG[0].held, P.mode, P.oct).length;
        ctx.stat(L('마디당 음 수', 'Notes per bar'), perBar);
        ctx.stat(L('한 바퀴 길이', 'Pattern length'), seqLen + L('음', ' notes'));
        ctx.stat(L('음 길이', 'Note length'), ((P.mode === 'off' ? beat : beat / Number(P.rate)) * P.gate / 100 * 1000).toFixed(0) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
