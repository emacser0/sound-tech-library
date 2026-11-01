// 워킹 베이스: 근음만 길게 vs 4분음표로 화음음, 경과음, 반음 접근음을 이어 다음 화음 근음으로 걸어감
GTL.register({
  id: 'walking-bassline',
  title: '워킹 베이스라인 생성',
  summary: '같은 화음 진행(Cmaj7, A7, Dm7, G7)에 베이스를 붙이는 두 방법. 근음만 치면 화음은 분명하지만 멈춰 있음. 워킹 베이스는 매 박 움직이며 마지막 박의 접근음으로 다음 화음의 근음을 끌어당김.',
  views: { a: '근음만 (2분음표)', b: '워킹 베이스' },
  info: `
    <p><b>워킹 베이스(Walking Bass)</b>는 재즈 베이스의 기본 주법. 4분음표를 쉬지 않고 이어 가며 화음을 알려 주고 동시에 다음 화음으로 이끔.</p>
    <ul>
      <li><b>1박</b>: 화음의 근음. 듣는 사람이 화음이 바뀐 것을 알 수 있음.</li>
      <li><b>2~3박</b>: 화음음(3음, 5음)이나 음계를 따라 다음 근음 쪽으로 걸어감</li>
      <li><b>4박</b>: 접근음(approach note). 다음 근음의 반음 아래나 위, 또는 다음 화음의 5음. 다음 1박으로 강하게 끌림.</li>
    </ul>
    <p>규칙 기반 생성은 "1박 고정, 4박 고정, 사이를 채움" 순서로 하면 단순해짐. 음역을 벗어나지 않게 옥타브를 고르고, 같은 음 반복과 큰 도약을 피하는 것이 경계 처리의 대부분. 실제 연주자는 여기에 리듬 변형(셋잇단 꾸밈, 고스트 노트)과 긴 선율 윤곽을 더함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('한 마디 (Dm7) → 다음 마디 (G7)', 'One bar (Dm7) → next bar (G7)')}</text>
    ${[['D', 1, 'f-accent', L('근음', 'root')], ['F', 2, 'f-b', L('3음', '3rd')], ['A', 3, 'f-b', L('5음', '5th')], ['Ab', 4, 'f-a', L('반음 위 접근', 'approach from above')], ['G', 5, 'f-accent', L('다음 근음', 'next root')]].map(([n, i, c, t], k) => {
      const ys = [120, 96, 72, 80, 88];
      return `<rect x="${20 + (i - 1) * 104}" y="${ys[k]}" width="70" height="16" class="${c}"/><text x="${55 + (i - 1) * 104}" y="${ys[k] - 6}" text-anchor="middle" class="t-small">${n}</text><text x="${55 + (i - 1) * 104}" y="150" text-anchor="middle" class="t-small t-dim">${t}</text>`;
    }).join('')}
    <line x1="436" y1="30" x2="436" y2="160" class="d-dim" stroke-dasharray="3 3"/>
    <path d="M400,84 Q420,72 440,90" class="d-accent" fill="none"/>
    <text x="400" y="40" class="t-small t-a">${L('반음 차이로 끌어당김', 'pulls in by a semitone')}</text>
  </svg>`,
  look: [
    'A는 마디마다 근음 두 개만 있어 피아노 롤이 계단 몇 개. B는 매 박 움직이며 다음 마디 첫 음에 거의 붙어서 도착.',
    'B의 노란 막대가 접근음. 바로 다음 막대(다음 근음)와 반음 또는 5도 차이.',
    '접근 방식을 "반음 아래"로 고정하면 4박이 늘 다음 근음 바로 아래에서 올라옴',
    '"강박의 화음음 비율"은 두 뷰 모두 높음. B는 약박에서 경과음과 접근음으로 움직임을 만듦.',
    '반복할 때마다 B의 2~3박 선택이 조금씩 바뀜. 같은 진행이라도 지루하지 않음.',
  ],
  refs: [
    { type: 'book', title: 'Ed Friedland, Building Walking Bass Lines', year: 1995, note: '근음, 화음음, 접근음으로 라인 만들기' },
    { type: 'book', title: 'Mark Levine, The Jazz Theory Book', year: 1995, note: '재즈 화성, ii-V-I, 2차 속화음' },
    { type: 'book', title: 'Paul F. Berliner, Thinking in Jazz: The Infinite Art of Improvisation', year: 1994, note: '베이스 연주자가 워킹 라인을 만드는 방법 (인터뷰와 악보 분석)' },
  ],
  params: [
    { key: 'mode', label: '베이스 방식', type: 'select', options: [{ value: 'root', label: '근음만 (2분음표)' }, { value: 'r5', label: '근음과 5음 (2비트)' }, { value: 'walk', label: '워킹 (4분음표)' }], a: 'root', b: 'walk', group: '베이스' },
    { key: 'approach', label: '접근음', type: 'select', options: [{ value: 'mix', label: '섞기' }, { value: 'below', label: '반음 아래' }, { value: 'above', label: '반음 위' }, { value: 'dom', label: '다음 화음의 5음' }], default: 'mix', when: (p) => p.mode === 'walk' },
    { key: 'comp', label: '피아노 반주', type: 'bool', default: true, shared: true },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 80, max: 220, default: 132, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Walking Bass Line Generation',
    summary: 'Two ways to add a bass to the same progression (Cmaj7, A7, Dm7, G7). Roots only make the chords clear but static. A walking bass moves on every beat, and the approach note on the last beat pulls into the next root.',
    views: { a: 'Roots only (half notes)', b: 'Walking bass' },
    info: `
    <p>A <b>walking bass</b> is the basic jazz bass style. It plays steady quarter notes that state the chord and lead to the next one at the same time.</p>
    <ul>
      <li><b>Beat 1</b>: the chord root. The listener hears that the chord changed.</li>
      <li><b>Beats 2~3</b>: chord tones (3rd, 5th) or scale steps that walk toward the next root.</li>
      <li><b>Beat 4</b>: the approach note. A semitone below or above the next root, or the 5th of the next chord. It pulls strongly into the next beat 1.</li>
    </ul>
    <p>Rule-based generation gets simple in this order: "fix beat 1, fix beat 4, fill between". Most edge cases are picking octaves that stay in range and avoiding repeated notes and big leaps. Real players add rhythm variations (triplet figures, ghost notes) and long melodic shapes.</p>`,
    look: [
      'A has only two roots per bar, so the piano roll is a few stairs. B moves on every beat and lands right next to the first note of the next bar.',
      'B\'s yellow bars are approach notes. They sit a semitone or a 5th away from the next bar (the next root).',
      'Set the approach to "Semitone below". Beat 4 always rises into the next root from just below.',
      '"Chord tones on strong beats" is high in both views. B makes motion with passing and approach notes on weak beats.',
      'B changes its beat 2~3 choices a little on each repeat. The same progression does not get boring.',
    ],
    refs: ['Building lines from roots, chord tones and approach notes.', 'Jazz harmony, ii-V-I, secondary dominants.', 'How bassists build walking lines (interviews and transcriptions).'],
    params: {
      mode: { label: 'Bass style', group: 'Bass', options: { root: 'Roots only (half notes)', r5: 'Root and 5th (two-beat)', walk: 'Walking (quarter notes)' } },
      approach: { label: 'Approach note', options: { mix: 'Mix', below: 'Semitone below', above: 'Semitone above', dom: '5th of next chord' } },
      comp: 'Piano comping',
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
    // 화음: 근음 음높이류, 화음음, 음계
    const CH = [
      { name: 'Cmaj7', root: 0, tones: [0, 4, 7, 11], scale: [0, 2, 4, 5, 7, 9, 11], voicing: [52, 55, 59, 64] },
      { name: 'A7', root: 9, tones: [9, 1, 4, 7], scale: [9, 10, 1, 2, 4, 5, 7], voicing: [55, 61, 64, 69] },
      { name: 'Dm7', root: 2, tones: [2, 5, 9, 0], scale: [2, 4, 5, 7, 9, 11, 0], voicing: [53, 57, 60, 65] },
      { name: 'G7', root: 7, tones: [7, 11, 2, 5], scale: [7, 9, 11, 0, 2, 4, 5], voicing: [53, 59, 62, 65] },
    ];
    const LO = 31, HI = 50; // G1 ~ D3
    const pc = (m) => ((m % 12) + 12) % 12;
    const nearest = (p, ref) => { let best = null; for (let m = LO; m <= HI; m++) if (pc(m) === pc(p) && (best == null || Math.abs(m - ref) < Math.abs(best - ref))) best = m; return best; };
    // 한 바퀴(4마디) 생성. loopIdx마다 다른 선택
    let key = '', cache = {};
    function lineFor(loopIdx) {
      const k = [P.mode, P.approach].join(',');
      if (k !== key) { key = k; cache = {}; }
      if (cache[loopIdx]) return cache[loopIdx];
      const r = U.rng(ctx.seed * 919 + loopIdx * 31 + 7);
      const out = []; // { b: 박 위치, m, d: 길이(박), kind }
      let prev = 40, planned = null;
      for (let bi = 0; bi < 4; bi++) {
        const ch = CH[bi], nx = CH[(bi + 1) % 4];
        const root = planned != null ? planned : nearest(ch.root, prev);
        planned = null;
        if (P.mode === 'root') { out.push({ b: bi * 4, m: root, d: 2, kind: 'root' }, { b: bi * 4 + 2, m: root, d: 2, kind: 'root' }); prev = root; continue; }
        if (P.mode === 'r5') { const f = nearest(ch.tones[2], root); out.push({ b: bi * 4, m: root, d: 2, kind: 'root' }, { b: bi * 4 + 2, m: f, d: 2, kind: 'chord' }); prev = f; continue; }
        const nextRoot = bi === 3 ? nearest(CH[0].root, 40) : nearest(nx.root, root); // 마지막 마디는 다음 바퀴의 첫 근음
        // 4박: 접근음
        const ap = P.approach === 'mix' ? r.pick(['below', 'above', 'below', 'dom']) : P.approach;
        let a4 = ap === 'below' ? nextRoot - 1 : ap === 'above' ? nextRoot + 1 : (nextRoot - 5 >= LO ? nextRoot - 5 : nextRoot + 7);
        if (a4 < LO || a4 > HI) a4 = nextRoot - 1 >= LO ? nextRoot - 1 : nextRoot + 1;
        // 2~3박: 근음에서 접근음까지 1/3, 2/3 지점에 가까운 음. 거리가 짧으면 올라갔다 돌아오는 아치
        const span = a4 - root;
        let ideal2, ideal3;
        if (Math.abs(span) < 4) { const up = root + 7 <= HI ? 1 : -1; ideal2 = root + up * 4; ideal3 = root + up * 6; }
        else { ideal2 = root + span / 3; ideal3 = root + (2 * span) / 3; }
        const pickNear = (ideal, ok, avoid) => {
          let best = null, bd = 1e9;
          for (let m = LO; m <= HI; m++) { if (!ok(pc(m)) || avoid.includes(m)) continue; const d = Math.abs(m - ideal) + r.next() * 1.5; if (d < bd) { bd = d; best = m; } }
          return best ?? root;
        };
        const b2 = pickNear(ideal2, (p) => ch.scale.includes(p), [root, a4]); // 2박: 음계 음
        const b3 = pickNear(ideal3, (p) => ch.tones.includes(p), [b2, a4]);   // 3박(강박): 화음음
        const kindOf = (m) => (pc(m) === ch.root ? 'root' : ch.tones.includes(pc(m)) ? 'chord' : ch.scale.includes(pc(m)) ? 'scale' : 'approach');
        out.push({ b: bi * 4, m: root, d: 1, kind: 'root' }, { b: bi * 4 + 1, m: b2, d: 1, kind: kindOf(b2) }, { b: bi * 4 + 2, m: b3, d: 1, kind: kindOf(b3) }, { b: bi * 4 + 3, m: a4, d: 1, kind: 'approach' });
        prev = a4; planned = nextRoot;
      }
      cache[loopIdx] = out;
      return out;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const beat = 60 / P.bpm, len = beat * 16;
          for (let c = Math.floor(t0 / len); c * len < t1; c++) {
            for (const e of lineFor(c)) { const t = c * len + e.b * beat; if (t >= t0 && t < t1) trig('bass', t, { f: A.mtof(e.m), dur: e.d * beat * 0.9, vel: e.b % 4 === 0 ? 1 : 0.85 }); }
            // 라이드 (셋잇단 스윙): 1, 2, 2+, 3, 4, 4+
            for (let b = 0; b < 16; b++) {
              const ts = [c * len + b * beat];
              if (b % 2 === 1) ts.push(c * len + (b + 2 / 3) * beat);
              ts.forEach((t, j) => { if (t >= t0 && t < t1) trig('hat', t, { vel: j ? 0.35 : 0.55 }); });
              // 반주: 1박과 2박 뒷박 (찰스턴 리듬)
              if (P.comp) for (const off of [0, 1 + 2 / 3]) { const t = c * len + (Math.floor(b / 4) * 4 + off) * beat; if (b % 4 === 0 && t >= t0 && t < t1) CH[Math.floor(b / 4)].voicing.forEach((m) => trig('tone', t, { f: A.mtof(m), dur: beat * 0.35, vel: 0.22, cut: 0.1 })); }
            }
          }
        });
      },
    });

    const KC = { root: C.accent, chord: C.good, scale: C.dim, approach: C.warn };
    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const beat = 60 / P.bpm, len = beat * 16, loopIdx = Math.floor(clock.t / len), pos = (clock.t % len) / beat;
        const line = lineFor(loopIdx), nextFirst = lineFor(loopIdx + 1)[0];
        const rx = pad + 28, ry = pad + 18, rw = W - rx - pad, rh = Math.max(80, H - ry - 60);
        const lo = LO - 1, hi = HI + 1, rowH = rh / (hi - lo + 1);
        const X = (b) => rx + (b / 17) * rw, Y = (m) => ry + rh - (m - lo + 1) * rowH;
        D.rect(g, rx, ry, rw, rh, 'rgba(0,0,0,0.3)');
        for (let m = lo; m <= hi; m++) { if (A.isBlackKey(m)) D.rect(g, rx, Y(m), rw, rowH, 'rgba(255,255,255,0.03)'); if (pc(m) === 0) D.text(g, A.noteName(m), pad, Y(m) + rowH / 2 - 5, { size: 9, color: C.dim }); }
        for (let b = 0; b <= 17; b++) D.line(g, X(b), ry, X(b), ry + rh, b % 4 === 0 ? 'rgba(255,255,255,0.25)' : C.grid, 1);
        CH.forEach((ch, i) => D.text(g, ch.name, X(i * 4) + 3, pad + 2, { size: 11 }));
        D.text(g, CH[0].name, X(16) + 3, pad + 2, { size: 11, color: C.dim });
        for (const e of line) {
          const on = pos >= e.b && pos < e.b + e.d;
          D.rect(g, X(e.b) + 1, Y(e.m) + 1, (e.d / 17) * rw - 2, rowH - 1, on ? '#fff' : P.mode === 'walk' ? KC[e.kind] : col);
        }
        D.rect(g, X(16) + 1, Y(nextFirst.m) + 1, (1 / 17) * rw - 2, rowH - 1, null, C.accent, 1);
        g.beginPath(); line.forEach((e, i) => { const x = X(e.b + e.d / 2), y = Y(e.m) + rowH / 2; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.lineTo(X(16.5), Y(nextFirst.m) + rowH / 2);
        g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 1; g.stroke();
        D.line(g, X(pos), ry, X(pos), ry + rh, C.warn, 1.5);
        const ly = ry + rh + 10;
        [['root', L('근음', 'Root')], ['chord', L('화음음', 'Chord tone')], ['scale', L('음계 경과음', 'Scale passing')], ['approach', L('접근음', 'Approach')]].forEach(([k, t], i) => { D.rect(g, pad + i * 110, ly, 10, 10, KC[k]); D.text(g, t, pad + i * 110 + 14, ly - 1, { size: 10, color: C.dim }); });
        // 통계
        let strong = 0, strongCT = 0, iv = 0, ap = 0;
        const seq = line.concat([nextFirst]);
        line.forEach((e, i) => {
          const ch = CH[Math.floor(e.b / 4)];
          if (e.b % 2 === 0) { strong++; if (ch.tones.includes(pc(e.m))) strongCT++; }
          iv += Math.abs(seq[i + 1].m - e.m);
          if (e.kind === 'approach' && Math.abs(seq[i + 1].m - e.m) <= 1) ap++;
        });
        ctx.stat(L('강박의 화음음 비율', 'Chord tones on strong beats'), ((strongCT / strong) * 100).toFixed(0) + '%');
        ctx.stat(L('평균 이동', 'Mean motion'), (iv / line.length).toFixed(1) + L(' 반음', ' semitones'));
        ctx.stat(L('반음 접근', 'Semitone approaches'), ap);
        ctx.stat(L('마디당 음 수', 'Notes per bar'), line.length / 4);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
