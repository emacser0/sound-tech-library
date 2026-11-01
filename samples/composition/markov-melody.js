// 마르코프 멜로디: 같은 음 집합에서 무작위로 고르기 vs 저작권이 끝난 동요, 민요로 학습한 전이 확률로 고르기
GTL.register({
  id: 'markov-melody',
  title: '마르코프 체인 멜로디',
  summary: '같은 음 7개로 멜로디를 만듦. 무작위로 고르면 큰 도약이 많고 맥락이 없음. 짧은 곡 4개에서 "이 음 다음에 어떤 음이 왔는가"를 세어 만든 마르코프 체인은 계단식 움직임과 반복이 있는 그럴듯한 선율을 만듦.',
  views: { a: '무작위 음', b: '1차 마르코프 체인' },
  info: `
    <p><b>마르코프 체인(Markov Chain)</b>은 "다음 상태는 지금 상태(또는 최근 몇 개)에만 달려 있다"고 보는 확률 모델. 작곡에서는 상태를 음 높이로 두고, 학습 곡에서 음과 음 사이의 전이 횟수를 세어 확률표를 만듦.</p>
    <ul>
      <li><b>1차</b>: 바로 앞 음 하나로 다음 음을 고름. 표 크기는 음 수의 제곱.</li>
      <li><b>2차</b>: 앞 음 두 개로 고름. 학습 곡과 더 비슷해지지만 표가 희소해지고, 학습 곡을 통째로 베끼는 구간이 길어짐.</li>
      <li>학습 재료: 환희의 송가(베토벤), 반짝반짝 작은 별, 프레르 자크, 메리의 어린 양. 모두 저작권이 끝난 곡.</li>
    </ul>
    <p>1950년대 Hiller와 Isaacson의 일리악 모음곡(Illiac Suite), Xenakis의 확률 음악부터 쓰인 고전 기법. 단점: 짧은 맥락만 보므로 프레이즈, 반복 구조, 화성 진행 같은 큰 형식은 만들지 못함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('학습: E 다음에 온 음을 셈 → 확률', 'Training: count what follows E → probabilities')}</text>
    <circle cx="80" cy="90" r="22" class="f-dim"/><text x="80" y="94" text-anchor="middle">E</text>
    ${[['D', 50, 0.4], ['E', 90, 0.25], ['F', 130, 0.2], ['G', 170, 0.15]].map(([n, y, p]) => `<circle cx="320" cy="${y - 10}" r="16" class="f-dim"/><text x="320" y="${y - 6}" text-anchor="middle">${n}</text>
    <line x1="102" y1="90" x2="302" y2="${y - 10}" class="d-b" stroke-width="${1 + p * 10}"/><text x="350" y="${y - 6}" class="t-small t-b">${Math.round(p * 100)}%</text>`).join('')}
    <text x="380" y="70" class="t-small t-dim">${L('선 굵기 = 전이 확률', 'Width = probability')}</text>
    <text x="380" y="88" class="t-small t-dim">${L('주사위로 다음 음 선택', 'Roll a die for next note')}</text>
    <text x="4" y="164" class="t-small t-dim">${L('무작위 방식은 모든 선 굵기가 같음 (각 1/7)', 'Random picks with equal widths (1/7 each)')}</text>
  </svg>`,
  look: [
    'A의 피아노 롤은 위아래로 크게 튐. B는 이웃한 음으로 걷는 움직임이 대부분.',
    '전이 확률표에서 A는 모든 칸이 같은 밝기. B는 대각선 근처(같은 음, 2도 이동)가 밝음.',
    '"말뭉치에 없는 전이" 비율이 A는 높고 B는 항상 0%. B는 학습한 연결만 씀.',
    'B를 2차로 바꾸면 "가장 긴 복사 구간"이 길어짐. 학습 곡의 한 대목을 그대로 베끼기 시작함.',
    '"다시 만들기"를 누르면 두 뷰 모두 새 멜로디. B는 매번 다르지만 늘 비슷한 말투.',
  ],
  refs: [
    { type: 'book', title: 'Lejaren Hiller, Leonard Isaacson, Experimental Music: Composition with an Electronic Computer', year: 1959, note: '일리악 모음곡, 마르코프 체인 작곡' },
    { type: 'book', title: 'Iannis Xenakis, Formalized Music: Thought and Mathematics in Composition', year: 1971, note: '마르코프 체인을 쓴 확률 음악 (Analogique A, B)' },
    { type: 'paper', title: 'Charles Ames, "The Markov Process as a Compositional Model: A Survey and Tutorial", Leonardo 22(2)', year: 1989, note: '차수, 희소성, 학습 곡 베끼기 문제' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '알고리즘 작곡 장, 확률 모델' },
  ],
  params: [
    { key: 'method', label: '생성 방법', type: 'select', options: [{ value: 'random', label: '무작위 (균등)' }, { value: 'm1', label: '1차 마르코프' }, { value: 'm2', label: '2차 마르코프' }], a: 'random', b: 'm1', group: '멜로디' },
    { key: 'regen', label: '멜로디', type: 'button', buttonLabel: '다시 만들기' },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 180, default: 120, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Markov Chain Melody',
    summary: 'Both views make a melody from the same 7 notes. Random picks give many big leaps and no context. A Markov chain counts "which note came after this one" in 4 short songs. It makes believable lines with stepwise motion and repetition.',
    views: { a: 'Random notes', b: '1st order Markov chain' },
    info: `
    <p>A <b>Markov chain</b> is a probability model where the next state depends only on the current state (or the last few). In composition the state is the pitch. You count note-to-note transitions in training songs and build a probability table.</p>
    <ul>
      <li><b>1st order</b>: picks the next note from the one note before. The table size is the number of notes squared.</li>
      <li><b>2nd order</b>: picks from the two notes before. It sounds closer to the training songs, but the table gets sparse and it copies longer pieces of them.</li>
      <li>Training songs: Ode to Joy (Beethoven), Twinkle Twinkle Little Star, Frère Jacques, Mary Had a Little Lamb. All are in the public domain.</li>
    </ul>
    <p>It is a classic method, used since Hiller and Isaacson's Illiac Suite in the 1950s and Xenakis's stochastic music. Downside: it only sees a short context, so it cannot make large forms like phrases, repeats or chord progressions.</p>`,
    look: [
      'A\'s piano roll jumps up and down. B mostly walks to neighbor notes.',
      'In the transition table, every cell of A has the same brightness. In B the cells near the diagonal (same note, step) are bright.',
      'The "Transitions not in corpus" ratio is high in A and always 0% in B. B only uses links it learned.',
      'Switch B to 2nd order. "Longest copied run" gets longer. It starts copying whole lines of a training song.',
      'Press "Regenerate". Both views get a new melody. B differs each time but keeps the same style.',
    ],
    refs: ['Illiac Suite, composition with Markov chains.', 'Stochastic music with Markov chains (Analogique A, B).', 'Order, sparsity and the copying problem.', 'Algorithmic composition chapter, probability models.'],
    params: {
      method: { label: 'Method', group: 'Melody', options: { random: 'Random (uniform)', m1: '1st order Markov', m2: '2nd order Markov' } },
      regen: { label: 'Melody', buttonLabel: 'Regenerate' },
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
    // 학습 곡 (C장조, MIDI). 모두 저작권이 끝난 곡
    const E4 = 64, F4 = 65, G4 = 67, A4 = 69, D4 = 62, C4 = 60, G3 = 55;
    const CORPUS = [
      [E4, E4, F4, G4, G4, F4, E4, D4, C4, C4, D4, E4, E4, D4, D4, E4, E4, F4, G4, G4, F4, E4, D4, C4, C4, D4, E4, D4, C4, C4], // 환희의 송가
      [C4, C4, G4, G4, A4, A4, G4, F4, F4, E4, E4, D4, D4, C4, G4, G4, F4, F4, E4, E4, D4, G4, G4, F4, F4, E4, E4, D4, C4, C4, G4, G4, A4, A4, G4, F4, F4, E4, E4, D4, D4, C4], // 반짝반짝 작은 별
      [C4, D4, E4, C4, C4, D4, E4, C4, E4, F4, G4, E4, F4, G4, G4, A4, G4, F4, E4, C4, G4, A4, G4, F4, E4, C4, C4, G3, C4, C4, G3, C4], // 프레르 자크
      [E4, D4, C4, D4, E4, E4, E4, D4, D4, D4, E4, G4, G4, E4, D4, C4, D4, E4, E4, E4, E4, D4, D4, E4, D4, C4], // 메리의 어린 양
    ];
    const NOTES = [G3, C4, D4, E4, F4, G4, A4];
    const idx = (m) => NOTES.indexOf(m);
    const T1 = NOTES.map(() => NOTES.map(() => 0)), T2 = {};
    const bigrams = new Set();
    for (const song of CORPUS) for (let i = 1; i < song.length; i++) {
      T1[idx(song[i - 1])][idx(song[i])]++;
      bigrams.add(song[i - 1] + ',' + song[i]);
      if (i >= 2) { const k = song[i - 2] + ',' + song[i - 1]; (T2[k] = T2[k] || NOTES.map(() => 0))[idx(song[i])]++; }
    }
    const pickW = (r, w) => { const s = w.reduce((a, b) => a + b, 0); let x = r.next() * s; for (let i = 0; i < w.length; i++) { x -= w[i]; if (x < 0) return i; } return w.length - 1; };
    // 리듬: 2마디(8박)에 음 7개 [1,1,1,1,1,1,2] 를 4번
    const RHY = [1, 1, 1, 1, 1, 1, 2];
    let gen = 0, key = '', mel = [];
    function compute() {
      const k = P.method + ',' + gen;
      if (k === key) return mel;
      key = k;
      const r = U.rng(ctx.seed * 7919 + gen * 104729 + 1);
      const ps = [C4];
      while (ps.length < RHY.length * 4) {
        const a = ps[ps.length - 1], b = ps[ps.length - 2];
        let w;
        if (P.method === 'random') w = NOTES.map(() => 1);
        else if (P.method === 'm2' && b != null && T2[b + ',' + a]) w = T2[b + ',' + a];
        else w = T1[idx(a)];
        if (w.every((x) => !x)) w = NOTES.map(() => 1);
        ps.push(NOTES[pickW(r, w)]);
      }
      let t = 0;
      mel = ps.map((m, i) => { const d = RHY[i % RHY.length]; const e = { m, t, d }; t += d; return e; });
      return mel;
    }
    // 학습 곡과 같은 음이 이어지는 가장 긴 구간
    function longestCopy(ps) {
      let best = 0;
      for (let i = 0; i < ps.length; i++) for (const song of CORPUS) for (let j = 0; j < song.length; j++) {
        let k = 0; while (i + k < ps.length && j + k < song.length && ps[i + k] === song[j + k]) k++;
        if (k > best) best = k;
      }
      return best;
    }
    let statKey = '', st = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const beat = 60 / P.bpm, m = compute(), len = 32 * beat;
          for (let c = Math.floor(t0 / len); c * len < t1; c++) for (const e of m) {
            const t = c * len + e.t * beat;
            if (t >= t0 && t < t1) trig('tone', t, { f: A.mtof(e.m + 12), dur: e.d * beat * 0.8, vel: 0.8, cut: 0.15 });
          }
          for (let i = Math.ceil(t0 / beat - 1e-9); i * beat < t1; i++) if (i * beat >= t0 && i % 4 === 0) trig('bass', i * beat, { f: A.mtof(i % 8 === 0 ? 36 : 43), dur: beat * 3, vel: 0.35 });
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const m = compute(), beat = 60 / P.bpm, pos = (clock.t / beat) % 32;
        if (statKey !== key) {
          statKey = key;
          const ps = m.map((e) => e.m);
          let sumI = 0, leaps = 0, unseen = 0;
          for (let i = 1; i < ps.length; i++) { const d = Math.abs(ps[i] - ps[i - 1]); sumI += d; if (d >= 5) leaps++; if (!bigrams.has(ps[i - 1] + ',' + ps[i])) unseen++; }
          st = { meanI: sumI / (ps.length - 1), leaps: leaps / (ps.length - 1), unseen: unseen / (ps.length - 1), copy: longestCopy(ps) };
        }
        // 피아노 롤
        const rx = pad + 26, ry = pad + 14, rw = W - rx - pad, rh = Math.max(60, (H - 40) * 0.5);
        const rowH = rh / NOTES.length, Y = (mm) => ry + rh - (idx(mm) + 1) * rowH;
        D.rect(g, rx, ry, rw, rh, 'rgba(0,0,0,0.3)');
        NOTES.forEach((mm, i) => D.text(g, A.noteName(mm), pad, Y(mm) + rowH / 2 - 5, { size: 9, color: C.dim }));
        for (let b = 0; b <= 8; b++) D.line(g, rx + (b / 8) * rw, ry, rx + (b / 8) * rw, ry + rh, b % 2 === 0 ? 'rgba(255,255,255,0.2)' : C.grid, 1);
        let curI = -1;
        m.forEach((e, i) => {
          const on = pos >= e.t && pos < e.t + e.d; if (on) curI = i;
          D.rect(g, rx + (e.t / 32) * rw + 1, Y(e.m) + 1, (e.d / 32) * rw - 2, rowH - 2, on ? '#fff' : col);
        });
        g.beginPath();
        m.forEach((e, i) => { const x = rx + ((e.t + 0.5) / 32) * rw, y = Y(e.m) + rowH / 2; i ? g.lineTo(x, y) : g.moveTo(x, y); });
        g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1; g.stroke();
        D.line(g, rx + (pos / 32) * rw, ry, rx + (pos / 32) * rw, ry + rh, C.warn, 1.5);
        // 전이 확률표 (지금 쓰는 표)
        const ty = ry + rh + 30, ts = Math.max(8, Math.min((H - ty - 10) / NOTES.length, 26)), tx = pad + 26;
        D.text(g, L('전이 확률표 (행 = 지금 음, 열 = 다음 음)', 'Transition table (row = now, column = next)'), pad, ty - 16, { size: 10, color: C.dim });
        const prev = curI > 0 ? m[curI - 1].m : null, cur = curI >= 0 ? m[curI].m : null;
        NOTES.forEach((a, i) => {
          const w = P.method === 'random' ? NOTES.map(() => 1) : T1[i];
          const s = w.reduce((x, y) => x + y, 0) || 1;
          D.text(g, A.noteName(a), pad, ty + i * ts + ts / 2 - 5, { size: 9, color: C.dim });
          w.forEach((v, j) => {
            const p = v / s;
            D.rect(g, tx + j * ts, ty + i * ts, ts - 1, ts - 1, `rgba(${ctx.side === 'a' ? '255,122,89' : '79,195,247'},${(0.06 + p * 1.6).toFixed(3)})`);
            if (prev === a && cur === NOTES[j]) D.rect(g, tx + j * ts, ty + i * ts, ts - 1, ts - 1, null, '#fff', 2);
          });
        });
        if (P.method === 'm2') D.text(g, L('2차는 앞 두 음을 함께 봄 (표는 1차 요약)', '2nd order looks at two notes (table shows 1st order summary)'), tx + NOTES.length * ts + 8, ty, { size: 9, color: C.dim });
        ctx.stat(L('평균 음정 이동', 'Mean interval'), st.meanI.toFixed(2) + L(' 반음', ' semitones'));
        ctx.stat(L('도약 비율 (4도 이상)', 'Leap ratio (4th or more)'), (st.leaps * 100).toFixed(0) + '%');
        ctx.stat(L('말뭉치에 없는 전이', 'Transitions not in corpus'), (st.unseen * 100).toFixed(0) + '%');
        ctx.stat(L('가장 긴 복사 구간', 'Longest copied run'), st.copy + L('음', ' notes'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); if (k === 'regen') gen++; },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
