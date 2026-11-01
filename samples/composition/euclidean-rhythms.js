// 유클리드 리듬: 무작위로 고른 k개 위치 vs Bjorklund 알고리즘으로 가장 고르게 나눈 k개 위치
GTL.register({
  id: 'euclidean-rhythms',
  title: '유클리드 리듬 (Bjorklund)',
  summary: 'n칸에 k개의 타격을 놓는 방법 비교. 무작위로 놓으면 뭉치고 비는 곳이 생김. Bjorklund 알고리즘은 가장 고르게 퍼뜨리고, 그 결과가 세계 여러 전통 리듬과 겹침.',
  views: { a: '무작위 배치', b: '유클리드 배치' },
  info: `
    <p><b>유클리드 리듬(Euclidean Rhythm)</b> E(k, n)은 n칸에 k개의 타격을 "가능한 한 고르게" 놓은 패턴. n이 k로 나누어떨어지지 않으면 간격이 두 종류(예: 3과 2)로 섞임.</p>
    <p>Toussaint(2005)는 이 패턴이 쿠바 트레시요 E(3,8), 신킬로 E(5,8), 서아프리카 벨 패턴 E(7,12) 같은 전통 리듬과 같다는 점을 보였음. 원래는 Bjorklund가 중성자 가속기의 타이밍 신호를 고르게 배치하려고 만든 알고리즘.</p>
    <ul>
      <li><b>Bjorklund 알고리즘</b>: [1] k개와 [0] (n-k)개를 두 무리로 두고, 뒤 무리를 앞 무리에 하나씩 붙이기를 남은 무리가 1개 이하가 될 때까지 반복. 유클리드 최대공약수 계산과 같은 구조.</li>
      <li>더 짧은 구현: i번째 칸은 <code>floor(i k / n)</code>이 바뀌는 곳에 타격 (브레젠험 직선과 같음). 결과는 회전만 다름.</li>
      <li><b>회전</b>: 시작 칸을 옮기면 같은 간격 묶음에서 다른 느낌의 리듬이 나옴</li>
    </ul>
    <p>단점: 고르게 퍼진 패턴만 만듦. 일부러 뭉친 필인이나 강약 같은 표현은 따로 넣어야 함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('E(3, 8): [1] 3개, [0] 5개에서 시작', 'E(3, 8): start with three [1] and five [0]')}</text>
    <text x="10" y="44" class="t-mono">[1] [1] [1]  |  [0] [0] [0] [0] [0]</text>
    <text x="10" y="80" class="t-mono">[1 0] [1 0] [1 0]  |  [0] [0]</text>
    <text x="10" y="116" class="t-mono">[1 0 0] [1 0 0]  |  [1 0]</text>
    <text x="300" y="44" class="t-small t-dim">${L('뒤 무리를 앞 무리에 하나씩 붙임', 'Append one back group to each front group')}</text>
    <text x="300" y="80" class="t-small t-dim">${L('남은 [0] 2개를 다시 붙임', 'Append the two leftover [0] again')}</text>
    <text x="300" y="116" class="t-small t-dim">${L('뒤 무리가 1개면 멈춤', 'Stop when one back group remains')}</text>
    ${[1, 0, 0, 1, 0, 0, 1, 0].map((v, i) => `<rect x="${10 + i * 30}" y="132" width="26" height="26" class="${v ? 'f-b' : 'f-dim'}"/>`).join('')}
    <text x="260" y="150" class="t-b">x . . x . . x .  = ${L('트레시요 (간격 3-3-2)', 'tresillo (gaps 3-3-2)')}</text>
    <text x="10" y="176" class="t-small t-dim">${L('최대공약수를 구하는 유클리드 호제법과 같은 나머지 처리', 'Same remainder steps as Euclid\'s GCD algorithm')}</text>
  </svg>`,
  look: [
    '기본값 E(5, 16)에서 A는 타격이 몰린 곳과 빈 곳이 생김. B는 간격이 3과 4만 나옴.',
    '"간격 표준편차"를 비교하면 B가 항상 가장 작음. 유클리드 배치가 가능한 가장 고른 배치.',
    '타격 수 3, 칸 수 8로 바꾸면 B가 쿠바 트레시요가 됨. 5, 8이면 신킬로.',
    'B에서 회전을 바꾸면 같은 간격 묶음이 다른 칸에서 시작해 강세 느낌이 달라짐',
    '"다시 뽑기"를 누르면 A만 바뀜. B는 k와 n만으로 결정됨.',
  ],
  refs: [
    { type: 'paper', title: 'Godfried Toussaint, "The Euclidean Algorithm Generates Traditional Musical Rhythms", Proceedings of BRIDGES', year: 2005, url: 'http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf', note: '유클리드 리듬과 전통 리듬 목록' },
    { type: 'paper', title: 'E. Bjorklund, "The Theory of Rep-Rate Pattern Generation in the SNS Timing System", SNS-NOTE-CNTRL-99', year: 2003, note: 'Bjorklund 알고리즘의 원래 용도 (가속기 타이밍)' },
    { type: 'book', title: 'Godfried Toussaint, The Geometry of Musical Rhythm', year: 2013, note: '리듬의 고른 정도, 회전, 목걸이 표현' },
  ],
  params: [
    { key: 'method', label: '배치 방법', type: 'select', options: [{ value: 'random', label: '무작위' }, { value: 'euclid', label: '유클리드 (Bjorklund)' }], a: 'random', b: 'euclid', group: '리듬' },
    { key: 'k', label: '타격 수 (k)', type: 'int', min: 1, max: 16, default: 5, shared: true },
    { key: 'n', label: '칸 수 (n)', type: 'int', min: 2, max: 24, default: 16, shared: true },
    { key: 'rot', label: '회전', type: 'int', min: 0, max: 23, default: 0, help: '시작 칸을 옮김' },
    { key: 'reroll', label: '무작위 배치', type: 'button', buttonLabel: '다시 뽑기' },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 160, default: 100, shared: true, help: '한 칸 = 16분음표' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Euclidean Rhythms (Bjorklund)',
    summary: 'Two ways to place k hits on n steps. Random placement makes clumps and holes. The Bjorklund algorithm spreads the hits as evenly as possible, and the results match many traditional rhythms around the world.',
    views: { a: 'Random', b: 'Euclidean' },
    info: `
    <p>A <b>Euclidean rhythm</b> E(k, n) puts k hits on n steps as evenly as possible. If n is not a multiple of k, two gap sizes mix (for example 3 and 2).</p>
    <p>Toussaint (2005) showed that these patterns match traditional rhythms such as the Cuban tresillo E(3,8), the cinquillo E(5,8) and the West African bell pattern E(7,12). Bjorklund first made the algorithm to spread timing pulses evenly in a neutron accelerator.</p>
    <ul>
      <li><b>Bjorklund algorithm</b>: keep k groups [1] and (n-k) groups [0]. Append one back group to each front group. Repeat until one or zero back groups remain. It has the same structure as Euclid's GCD algorithm.</li>
      <li>Shorter version: step i has a hit where <code>floor(i k / n)</code> changes (like a Bresenham line). The result differs only by rotation.</li>
      <li><b>Rotation</b>: moving the start step gives a rhythm with a different feel from the same gaps.</li>
    </ul>
    <p>Downside: it only makes evenly spread patterns. Clumped fills and accents must be added separately.</p>`,
    look: [
      'With the default E(5, 16), A has clumps and holes. B only has gaps of 3 and 4.',
      'Compare "Gap std dev". B is always the smallest. Euclidean placement is the most even one possible.',
      'Set hits to 3 and steps to 8. B becomes the Cuban tresillo. 5 and 8 gives the cinquillo.',
      'Change the rotation in B. The same gaps start on a different step and the accents feel different.',
      'Press "Reroll". Only A changes. B depends only on k and n.',
    ],
    refs: ['Euclidean rhythms and a list of traditional rhythms.', 'Original use of the Bjorklund algorithm (accelerator timing).', 'Evenness, rotation and necklace views of rhythm.'],
    params: {
      method: { label: 'Placement', group: 'Rhythm', options: { random: 'Random', euclid: 'Euclidean (Bjorklund)' } },
      k: 'Hits (k)',
      n: 'Steps (n)',
      rot: { label: 'Rotation', help: 'Moves the start step' },
      reroll: { label: 'Random placement', buttonLabel: 'Reroll' },
      bpm: { label: 'Tempo (BPM)', help: 'One step = a 16th note' },
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
    let rolls = 0;
    // Bjorklund: 앞 무리 a, 뒤 무리 b를 짝지어 붙이기를 반복
    function bjorklund(k, n) {
      if (k <= 0) return new Array(n).fill(0);
      if (k >= n) return new Array(n).fill(1);
      let a = Array.from({ length: k }, () => [1]), b = Array.from({ length: n - k }, () => [0]);
      while (b.length > 1) {
        const m = Math.min(a.length, b.length), na = [];
        for (let i = 0; i < m; i++) na.push(a[i].concat(b[i]));
        const rest = a.length > m ? a.slice(m) : b.slice(m);
        a = na; b = rest;
      }
      return a.concat(b).flat();
    }
    const NAMES = { '3,8': ['쿠바 트레시요', 'Cuban tresillo'], '5,8': ['쿠바 신킬로', 'Cuban cinquillo'], '7,12': ['서아프리카 벨 패턴', 'West African bell pattern'], '5,16': ['보사노바 계열', 'Bossa nova family'], '2,5': ['페르시아 리듬 (khafif-e-ramal)', 'Persian rhythm (khafif-e-ramal)'], '4,12': ['균등 4박 (12/8)', 'Even 4 beats (12/8)'], '4,16': ['포 온 더 플로어', 'Four on the floor'] };
    let key = '', pat = [];
    function pattern() {
      const n = P.n, k = Math.min(P.k, n);
      const kk = `${P.method},${k},${n},${P.rot},${rolls}`;
      if (kk === key) return pat;
      key = kk;
      let p;
      if (P.method === 'euclid') p = bjorklund(k, n);
      else {
        const r = U.rng(ctx.seed * 131 + rolls * 977 + n * 7 + k);
        const idx = r.shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, k);
        p = new Array(n).fill(0); idx.forEach((i) => { p[i] = 1; });
      }
      const rot = P.rot % n;
      pat = p.map((_, i) => p[(i + rot) % n]);
      return pat;
    }
    const stepDur = () => 60 / P.bpm / 4;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const p = pattern(), sd = stepDur();
          for (let idx = Math.floor(t0 / sd); idx * sd < t1; idx++) {
            const t = idx * sd; if (t < t0) continue;
            const s = idx % p.length;
            if (p[s]) trig('rim', t, { vel: s === 0 ? 1 : 0.8 }), trig('tom', t, { f: 330, vel: 0.5 });
            if (s === 0) trig('kick', t, { vel: 0.8 });
            trig('hat', t, { vel: 0.25 });
          }
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const p = pattern(), n = p.length, sd = stepDur();
        const cur = Math.floor(clock.t / sd) % n;
        // 원 (목걸이)
        const R = Math.max(30, Math.min(W * 0.5, H - 90) * 0.4), cx = W / 2, cy = pad + 16 + R + 8;
        D.circle(g, cx, cy, R, null, C.grid, 1);
        const pts = [];
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + (i / n) * Math.PI * 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          if (p[i]) pts.push({ x, y });
          D.circle(g, x, y, p[i] ? 7 : 3, p[i] ? (i === cur ? '#fff' : col) : C.dim);
        }
        if (pts.length > 1) D.poly(g, pts, col + '22', col, 1.5, true);
        const ha = -Math.PI / 2 + ((clock.t / sd) % n / n) * Math.PI * 2;
        D.line(g, cx, cy, cx + Math.cos(ha) * (R - 10), cy + Math.sin(ha) * (R - 10), C.warn, 2);
        // 칸 줄
        const ry = cy + R + 22, cw = (W - pad * 2) / n, rh = Math.min(26, cw * 1.4);
        for (let i = 0; i < n; i++) D.rect(g, pad + i * cw + 1, ry, cw - 2, rh, p[i] ? (i === cur ? '#fff' : col) : 'rgba(255,255,255,0.08)');
        D.rect(g, pad + cur * cw, ry - 2, cw, rh + 4, null, C.warn, 1.5);
        // 간격
        const on = []; p.forEach((v, i) => { if (v) on.push(i); });
        const gaps = on.map((v, i) => (on[(i + 1) % on.length] - v + n) % n || n);
        const mean = gaps.length ? n / gaps.length : 0;
        const sdv = gaps.length ? Math.sqrt(gaps.reduce((s, x) => s + (x - mean) * (x - mean), 0) / gaps.length) : 0;
        D.text(g, L('간격: ', 'Gaps: ') + gaps.join('-'), pad, ry + rh + 8, { size: 12, color: C.text });
        const nm = P.method === 'euclid' ? NAMES[`${Math.min(P.k, P.n)},${P.n}`] : null;
        if (nm) D.text(g, L(nm[0], nm[1]), pad, ry + rh + 26, { size: 11, color: C.good });
        ctx.stat(L('패턴', 'Pattern'), `E(${Math.min(P.k, P.n)}, ${P.n})`);
        ctx.stat(L('간격 표준편차', 'Gap std dev'), sdv.toFixed(2) + L(' 칸', ' steps'));
        ctx.stat(L('가장 긴 빈 구간', 'Longest gap'), (gaps.length ? Math.max(...gaps) : 0) + L(' 칸', ' steps'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); if (k === 'reroll') rolls++; },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
