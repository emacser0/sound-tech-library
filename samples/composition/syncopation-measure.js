// 싱코페이션 측정: Longuet-Higgins & Lee 방식으로 리듬의 "엇박 정도"를 숫자로 계산
GTL.register({
  id: 'syncopation-measure',
  title: '싱코페이션 측정 (Longuet-Higgins & Lee)',
  summary: '리듬이 박자의 강한 자리를 얼마나 비켜 가는지 숫자로 계산. 마디를 강약 단계로 나눠 각 칸에 무게를 주고, 음이 약한 자리에서 시작해 강한 자리를 쉼으로 건너뛸 때마다 무게 차이를 더함.',
  views: { a: '4분음표 (정박)', b: '손 클라베 3-2' },
  controls: '아래 칸 줄을 클릭하면 음을 넣거나 뺌. "편집 지우기"로 원래 리듬으로 돌아감.',
  info: `
    <p><b>싱코페이션(Syncopation)</b>은 강박에서 기대한 음이 오지 않고 그 앞의 약한 자리에서 먼저 나오는 현상. 펑크, 라틴, 재즈의 추진력이 여기서 나옴.</p>
    <p>Longuet-Higgins와 Lee(1984)의 모델은 이것을 숫자로 바꿈</p>
    <ul>
      <li><b>박 무게</b>: 4/4 마디를 반씩 나누며 무게를 줌. 1박 = 0, 3박 = -1, 2박과 4박 = -2, 8분음표 뒷박 = -3, 16분음표 자리 = -4.</li>
      <li>음 N 다음에 오는 쉼(다음 음까지 빈 칸) 중 가장 무거운 자리 R의 무게가 N보다 크면 싱코페이션</li>
      <li>그 크기 = 무게(R) - 무게(N). 마디 안의 모든 싱코페이션을 더한 값이 점수.</li>
    </ul>
    <p>점수가 높을수록 사람들도 더 엇박으로 느낀다는 실험 결과(Fitch와 Rosenfeld 2007 등)가 있음. 단점: 악센트, 음 길이, 여러 성부의 상호작용은 반영하지 못함. 그래서 여러 변형 측정법이 나왔음.</p>`,
  diagram: (L) => {
    const W = [0, -4, -3, -4, -2, -4, -3, -4, -1, -4, -3, -4, -2, -4, -3, -4];
    return `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('16칸의 박 무게 (막대가 높을수록 강한 자리)', 'Metric weight of 16 steps (taller = stronger)')}</text>
    ${W.map((w, i) => `<rect x="${30 + i * 30}" y="${110 - (w + 5) * 16}" width="22" height="${(w + 5) * 16}" class="f-dim"/><text x="${41 + i * 30}" y="124" text-anchor="middle" class="t-small t-mono">${w}</text>`).join('')}
    <circle cx="131" cy="140" r="6" class="f-b"/><text x="131" y="160" text-anchor="middle" class="t-small t-b">${L('음 (-4)', 'note (-4)')}</text>
    <path d="M131,134 Q140,60 161,30" class="d-accent" fill="none"/>
    <text x="170" y="40" class="t-small">${L('다음 칸 (-2)이 쉼 → 싱코페이션 +2', 'next step (-2) is a rest → syncopation +2')}</text>
  </svg>`;
  },
  look: [
    'A는 음이 모두 강한 자리에 있어 점수 0. B(손 클라베)는 화살표가 여러 개 생기고 점수가 커짐.',
    'B의 프리셋을 "백비트"로 바꾸면 2, 4박만 쳐도 1, 3박을 쉬므로 점수가 생김',
    '아래 칸을 클릭해 1박 음을 빼면 다음 마디의 1박(무게 0)이 쉼이 되어 싱코페이션이 하나 늘어남',
    '"소리 켜기"를 누르면 낮은 킥이 박을 알려 주고 그 위에서 클랩이 리듬을 침. 점수가 클수록 클랩이 킥을 피해 다님.',
  ],
  refs: [
    { type: 'paper', title: 'H. C. Longuet-Higgins, C. S. Lee, "The Rhythmic Interpretation of Monophonic Music", Music Perception 1(4)', year: 1984, note: '박 무게와 싱코페이션 정의' },
    { type: 'paper', title: 'W. Tecumseh Fitch, Andrew J. Rosenfeld, "Perception and Production of Syncopated Rhythms", Music Perception 25(1)', year: 2007, note: 'LHL 점수와 사람의 지각, 재현 정확도 비교' },
    { type: 'paper', title: 'Leigh M. Smith, Henkjan Honing, "Evaluating and Extending Computational Models of Rhythmic Syncopation in Music", ICMC', year: 2006, note: 'LHL 모델의 평가와 확장' },
    { type: 'paper', title: 'Francisco Gómez, Andrew Melvin, David Rappaport, Godfried Toussaint, "Mathematical Measures of Syncopation", BRIDGES', year: 2005, note: '여러 싱코페이션 측정법 비교' },
  ],
  params: [
    { key: 'preset', label: '리듬', type: 'select', options: [
      { value: 'quarters', label: '4분음표' }, { value: 'eighths', label: '8분음표' }, { value: 'backbeat', label: '백비트 (2, 4박)' },
      { value: 'offbeat', label: '8분 뒷박' }, { value: 'tresillo', label: '트레시요 (3+3+2)' }, { value: 'son32', label: '손 클라베 3-2' },
      { value: 'rumba32', label: '룸바 클라베 3-2' }, { value: 'bossa', label: '보사노바 클라베' }, { value: 'charleston', label: '찰스턴' }], a: 'quarters', b: 'son32', group: '리듬' },
    { key: 'clear', label: '클릭 편집', type: 'button', buttonLabel: '편집 지우기' },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 160, default: 100, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Syncopation Measure (Longuet-Higgins & Lee)',
    summary: 'Turns how much a rhythm avoids the strong positions of the meter into a number. Each step gets a weight from the meter levels. Each time a note starts on a weak position and skips a stronger one with a rest, the weight difference is added.',
    views: { a: 'Quarter notes (on beat)', b: 'Son clave 3-2' },
    controls: 'Click the step row below to add or remove a note. "Clear edits" restores the original rhythm.',
    info: `
    <p><b>Syncopation</b> happens when the note you expect on a strong beat does not come, and a note comes earlier on a weak position instead. It drives funk, Latin music and jazz.</p>
    <p>The Longuet-Higgins and Lee (1984) model turns this into a number.</p>
    <ul>
      <li><b>Metric weight</b>: split the 4/4 bar in halves again and again. Beat 1 = 0, beat 3 = -1, beats 2 and 4 = -2, 8th off-beats = -3, 16th positions = -4.</li>
      <li>Take the rest after note N (the empty steps until the next note). If its heaviest position R weighs more than N, it is a syncopation.</li>
      <li>Its size = weight(R) - weight(N). The sum over the bar is the score.</li>
    </ul>
    <p>Studies (Fitch and Rosenfeld 2007 and others) show that people feel higher scores as more syncopated. Downside: it ignores accents, note lengths and how several voices interact. Many variant measures followed for this reason.</p>`,
    look: [
      'All of A\'s notes sit on strong positions, so the score is 0. B (son clave) gets several arrows and a higher score.',
      'Set B\'s preset to "Backbeat". Hitting only beats 2 and 4 rests on beats 1 and 3, so it scores.',
      'Click the lower row to remove the note on beat 1. The next bar\'s beat 1 (weight 0) becomes a rest and adds one more syncopation.',
      'Press "Sound on". A low kick marks the beat and a clap plays the rhythm on top. The higher the score, the more the clap avoids the kick.',
    ],
    refs: ['Metric weights and the definition of syncopation.', 'LHL scores compared with human perception and reproduction accuracy.', 'Evaluation and extension of the LHL model.', 'Comparison of several syncopation measures.'],
    params: {
      preset: { label: 'Rhythm', group: 'Rhythm', options: { quarters: 'Quarter notes', eighths: '8th notes', backbeat: 'Backbeat (beats 2, 4)', offbeat: '8th off-beats', tresillo: 'Tresillo (3+3+2)', son32: 'Son clave 3-2', rumba32: 'Rumba clave 3-2', bossa: 'Bossa nova clave', charleston: 'Charleston' } },
      clear: { label: 'Click edits', buttonLabel: 'Clear edits' },
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
    const N = 16;
    const WT = [0, -4, -3, -4, -2, -4, -3, -4, -1, -4, -3, -4, -2, -4, -3, -4];
    const PRE = {
      quarters: 'x...x...x...x...', eighths: 'x.x.x.x.x.x.x.x.', backbeat: '....x.......x...', offbeat: '..x...x...x...x.',
      tresillo: 'x..x..x.x..x..x.', son32: 'x..x..x...x.x...', rumba32: 'x..x...x..x.x...', bossa: 'x..x..x...x..x..', charleston: 'x..x............',
    };
    let edits = {}; // 프리셋별 클릭 편집 결과
    const pattern = () => edits[P.preset] || PRE[P.preset].split('').map((c) => (c === 'x' ? 1 : 0));
    // LHL: 음마다 다음 음까지의 쉼 중 가장 무거운 자리를 찾음 (다음 마디로 이어짐)
    function lhl(p) {
      const on = []; p.forEach((v, i) => { if (v) on.push(i); });
      const out = [];
      if (!on.length) return { total: 0, list: out };
      on.forEach((n, k) => {
        const m = k + 1 < on.length ? on[k + 1] : on[0] + N;
        let best = -99, bpos = -1;
        for (let r = n + 1; r < m; r++) { const w = WT[r % N]; if (w > best) { best = w; bpos = r; } }
        if (bpos >= 0 && best > WT[n]) out.push({ n, r: bpos, v: best - WT[n] });
      });
      return { total: out.reduce((s, x) => s + x.v, 0), list: out };
    }
    const sd = () => 60 / P.bpm / 4;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const d = sd(), p = pattern();
          for (let idx = Math.ceil(t0 / d - 1e-9); idx * d < t1; idx++) {
            const t = idx * d; if (t < t0) continue;
            const s = idx % N;
            if (p[s]) trig('clap', t, { vel: 0.8 }), trig('rim', t, { vel: 0.4 });
            if (s % 4 === 0) trig('kick', t, { vel: s === 0 ? 0.75 : 0.5 });
            if (s % 2 === 0) trig('hat', t, { vel: 0.18 });
          }
        });
      },
    });

    let lay = null;
    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const p = pattern(), res = lhl(p), d = sd(), cur = Math.floor(clock.t / d) % N;
        const gx = pad + 4, cw = (W - pad * 2 - 8) / (N + 1), base = pad + 20 + Math.min(150, H * 0.4);
        const unit = (base - pad - 34) / 5;
        D.text(g, L('박 무게 (막대) 와 싱코페이션 (화살표)', 'Metric weight (bars) and syncopations (arrows)'), pad, pad, { size: 10, color: C.dim });
        for (let i = 0; i <= N; i++) {
          const w = WT[i % N], h = (w + 5) * unit, x = gx + i * cw;
          D.rect(g, x + 2, base - h, cw - 4, h, i === N ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)');
          D.text(g, String(w), x + cw / 2, base + 3, { size: 9, color: C.dim, align: 'center' });
        }
        D.text(g, L('다음 마디', 'next bar'), gx + N * cw + cw / 2, base + 15, { size: 8, color: C.dim, align: 'center' });
        // 화살표: 음 → 쉼 자리
        for (const s of res.list) {
          const x1 = gx + s.n * cw + cw / 2, x2 = gx + s.r * cw + cw / 2;
          const y1 = base - (WT[s.n] + 5) * unit - 4, y2 = base - (WT[s.r % N] + 5) * unit - 4;
          const top = Math.min(y1, y2) - 18;
          g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo((x1 + x2) / 2, top, x2, y2);
          g.strokeStyle = C.accent; g.lineWidth = 2; g.stroke();
          D.circle(g, x2, y2, 3, C.accent);
          D.text(g, '+' + s.v, (x1 + x2) / 2, top - 4, { size: 11, color: C.accent, align: 'center' });
        }
        // 칸 줄 (클릭으로 편집)
        const ry = base + 30, rh = Math.min(30, cw * 1.2);
        lay = { gx, cw, ry, rh };
        for (let i = 0; i < N; i++) D.rect(g, gx + i * cw + 1, ry, cw - 2, rh, p[i] ? (i === cur ? '#fff' : col) : (i % 4 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'));
        D.rect(g, gx + cur * cw, ry - 2, cw, rh + 4, null, C.warn, 1.5);
        D.text(g, L('점수', 'Score'), pad, ry + rh + 14, { size: 12, color: C.dim });
        D.text(g, String(res.total), pad + 50, ry + rh + 8, { size: 26, color: col });
        ctx.stat(L('LHL 싱코페이션 점수', 'LHL syncopation score'), res.total);
        ctx.stat(L('싱코페이션 개수', 'Syncopations'), res.list.length);
        ctx.stat(L('음 수', 'Onsets'), p.reduce((a, b) => a + b, 0));
        snd.stat();
      },
      onPointer(type, m) {
        if (type !== 'down' || !lay) return;
        const i = Math.floor((m.x - lay.gx) / lay.cw);
        const my = m.y - TOP;
        if (i < 0 || i >= N || my < lay.ry || my > lay.ry + lay.rh) return;
        const p = (edits[P.preset] = pattern().slice());
        p[i] = p[i] ? 0 : 1;
      },
      onAction(k) { if (k === 'sound') snd.toggle(); if (k === 'clear') edits = {}; },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
