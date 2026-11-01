// 셀룰러 오토마타 리듬: 마디마다 독립된 무작위 패턴 vs 1차원 기본 셀룰러 오토마타(규칙 90, 30 등)의 세대를 마디로 씀
GTL.register({
  id: 'cellular-automata-rhythm',
  title: '셀룰러 오토마타 리듬',
  summary: '16칸 패턴을 마디마다 새로 만드는 두 방법. 마디마다 무작위로 뽑으면 앞뒤 마디가 무관함. 기본 셀룰러 오토마타는 이웃 규칙으로 다음 마디를 만들어서 마디끼리 닮은 채 조금씩 변하는 패턴이 나옴.',
  views: { a: '마디마다 무작위', b: '셀룰러 오토마타 (규칙 90)' },
  info: `
    <p><b>기본 셀룰러 오토마타(Elementary Cellular Automaton)</b>는 0과 1로 된 칸 한 줄을 규칙에 따라 다음 줄로 바꾸는 모델. 각 칸의 다음 값은 자기와 왼쪽, 오른쪽 이웃(3칸, 8가지 경우)으로 정해짐. 8가지 경우의 결과를 8비트로 적은 것이 규칙 번호(0~255).</p>
    <ul>
      <li>한 줄 = 16칸 = 한 마디. 한 세대가 지날 때마다 다음 마디가 됨. 계산은 31칸 고리에서 하고 가운데 16칸만 연주.</li>
      <li><b>규칙 90</b>: 양 이웃의 XOR. 한 칸에서 시작하면 시에르핀스키 삼각형이 생기고 마디 패턴이 규칙적으로 넓어졌다 좁아짐.</li>
      <li><b>규칙 30</b>: 혼돈에 가까움. 그래도 앞 마디와 이어진 모양이 남음.</li>
      <li><b>규칙 184</b>: 교통 흐름 모델. 1이 오른쪽으로 한 칸씩 흘러 싱코페이션처럼 밀리는 리듬이 됨.</li>
    </ul>
    <p>규칙 하나로 긴 변화가 나오고 구조가 들린다는 점이 장점. 단점: 많은 규칙이 금방 전부 0이나 전부 1로 굳거나, 너무 빽빽해져 음악으로 쓰기 어려움. 그래서 칸을 악기와 음 높이로 나눠 대응시키는 설계가 중요함.</p>`,
  diagram: (L) => {
    const cases = ['111', '110', '101', '100', '011', '010', '001', '000'], r90 = [0, 1, 0, 1, 1, 0, 1, 0];
    return `<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('규칙 90 = 01011010 (2진수). 위 3칸 → 아래 1칸', 'Rule 90 = 01011010 in binary. Top 3 cells → bottom cell')}</text>
    ${cases.map((c, i) => {
      const x = 14 + i * 66;
      return [...c].map((b, j) => `<rect x="${x + j * 16}" y="30" width="14" height="14" class="${b === '1' ? 'f-b' : 'f-dim'}"/>`).join('') + `<rect x="${x + 16}" y="52" width="14" height="14" class="${r90[i] ? 'f-accent' : 'f-dim'}"/><text x="${x + 23}" y="84" text-anchor="middle" class="t-small t-mono">${r90[i]}</text>`;
    }).join('')}
    <text x="270" y="112" text-anchor="middle" class="t-small t-dim">${L('결과 줄을 차례로 이어 붙인 값이 규칙 번호. 새 줄 하나가 새 마디 하나.', 'The result row read as a binary number is the rule. Each new row is a new bar.')}</text>
  </svg>`;
  },
  look: [
    'A는 줄(마디)마다 무관한 점 무늬. B는 삼각형 모양이 이어지고 마디끼리 닮음.',
    '"이웃 마디 차이" 측정값이 A는 약 7~8칸, B는 그보다 작음. 앞 마디를 기억한다는 뜻.',
    'B의 규칙을 30으로 바꾸면 복잡하지만 이어진 무늬, 184로 바꾸면 비스듬히 흐르는 줄무늬가 됨',
    '규칙을 0이나 255로 두면 한 세대 만에 모두 꺼지거나 켜짐. 음악으로 쓸 만한 규칙이 많지 않은 이유.',
  ],
  refs: [
    { type: 'book', title: 'Stephen Wolfram, A New Kind of Science', year: 2002, note: '기본 셀룰러 오토마타 256규칙, 규칙 30, 90, 110' },
    { type: 'paper', title: 'Stephen Wolfram, "Statistical Mechanics of Cellular Automata", Reviews of Modern Physics 55(3)', year: 1983, note: '규칙 번호 체계의 원래 논문' },
    { type: 'book', title: 'Eduardo Reck Miranda, Composing Music with Computers', year: 2001, note: '셀룰러 오토마타를 쓴 작곡 (CAMUS)' },
    { type: 'book', title: 'Gerhard Nierhaus, Algorithmic Composition: Paradigms of Automated Music Generation', year: 2009, note: '셀룰러 오토마타 장' },
  ],
  params: [
    { key: 'source', label: '패턴 생성', type: 'select', options: [{ value: 'random', label: '마디마다 무작위' }, { value: 'ca', label: '셀룰러 오토마타' }], a: 'random', b: 'ca', group: '생성' },
    { key: 'rule', label: '규칙 번호', type: 'int', min: 0, max: 255, default: 90, help: '자주 쓰는 값: 30, 90, 110, 150, 184' },
    { key: 'init', label: '첫 줄', type: 'select', options: [{ value: 'one', label: '가운데 한 칸' }, { value: 'rand', label: '무작위 (밀도 35%)' }], default: 'one', shared: true },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 70, max: 160, default: 118, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Cellular Automata Rhythm',
    summary: 'Two ways to make a new 16-step pattern every bar. Random picks make bars unrelated to each other. An elementary cellular automaton makes the next bar from a neighbor rule, so bars stay alike while they slowly change.',
    views: { a: 'Random each bar', b: 'Cellular automaton (rule 90)' },
    info: `
    <p>An <b>elementary cellular automaton</b> turns one row of 0 and 1 cells into the next row with a rule. The next value of each cell depends on itself and its left and right neighbors (3 cells, 8 cases). Writing the 8 results as 8 bits gives the rule number (0~255).</p>
    <ul>
      <li>One row = 16 steps = one bar. Each generation becomes the next bar. The automaton runs on a 31-cell ring and only the middle 16 cells play.</li>
      <li><b>Rule 90</b>: XOR of the two neighbors. From one cell it draws a Sierpinski triangle, and the bar pattern grows and shrinks in a regular way.</li>
      <li><b>Rule 30</b>: close to chaos. Still, each bar keeps a shape linked to the one before.</li>
      <li><b>Rule 184</b>: a traffic flow model. Each 1 moves right by one step, which gives a pushed, syncopated rhythm.</li>
    </ul>
    <p>The upside: one rule gives long change with audible structure. The downside: many rules quickly freeze to all 0 or all 1, or get too dense to use as music. So the mapping from cells to instruments and pitches is an important design choice.</p>`,
    look: [
      'A shows unrelated dots on every row (bar). B continues a triangle shape and the bars look alike.',
      'The "Change between bars" stat is about 7~8 steps in A and smaller in B. B remembers the previous bar.',
      'Set B\'s rule to 30 for a complex but connected texture, or 184 for diagonal flowing stripes.',
      'Set the rule to 0 or 255. Everything turns off or on in one generation. This is why few rules are musically useful.',
    ],
    refs: ['The 256 elementary rules, rules 30, 90 and 110.', 'The original paper on the rule numbering.', 'Composition with cellular automata (CAMUS).', 'Chapter on cellular automata.'],
    params: {
      source: { label: 'Pattern source', group: 'Generation', options: { random: 'Random each bar', ca: 'Cellular automaton' } },
      rule: { label: 'Rule number', help: 'Common values: 30, 90, 110, 150, 184' },
      init: { label: 'First row', options: { one: 'One center cell', rand: 'Random (35% density)' } },
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
    const N = 16, NW = 31, OFF = 7; // 31칸 고리에서 계산하고 가운데 16칸만 연주 (16칸 고리는 규칙 90이 금방 모두 0이 됨)
    const PENTA = [0, 2, 4, 7, 9];
    // 칸 번호 → 음 높이 (장5음 음계, 왼쪽이 낮음)
    const pitchOf = (i) => 60 + 12 * Math.floor(i / 5) + PENTA[i % 5] - 12;
    let key = '', rows = [];
    function row(gen) {
      const k = [P.source, P.rule, P.init].join(',');
      if (k !== key) { key = k; rows = []; }
      while (rows.length <= gen) {
        const g = rows.length;
        let r;
        if (P.source === 'random' && g > 0) r = Array.from({ length: NW }, (_, i) => (hash(g * 64 + i, 5) < 0.4 ? 1 : 0));
        else if (g === 0) r = P.init === 'one' ? Array.from({ length: NW }, (_, i) => (i === OFF + N / 2 ? 1 : 0)) : Array.from({ length: NW }, (_, i) => (hash(i, 9) < 0.35 ? 1 : 0));
        else {
          const p = rows[g - 1];
          r = p.map((_, i) => { const c = (p[(i + NW - 1) % NW] << 2) | (p[i] << 1) | p[(i + 1) % NW]; return (P.rule >> c) & 1; });
        }
        rows.push(r);
      }
      return rows[gen].slice(OFF, OFF + N);
    }
    const sd = () => 60 / P.bpm / 4;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          const d = sd();
          for (let idx = Math.ceil(t0 / d - 1e-9); idx * d < t1; idx++) {
            const t = idx * d; if (t < t0) continue;
            const s = idx % N, gen = Math.floor(idx / N) % 64, rw = row(gen);
            if (rw[s]) trig('bell', t, { f: A.mtof(pitchOf(s) + 12), vel: 0.55 }), trig('rim', t, { vel: 0.25 });
            if (s % 4 === 0) trig('kick', t, { vel: s === 0 ? 0.9 : 0.6 });
            if (s % 8 === 4) trig('clap', t, { vel: 0.4 });
          }
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10, d = sd();
        const step = Math.floor(clock.t / d), gen = Math.floor(step / N) % 64, s = step % N;
        const show = Math.max(8, Math.min(24, Math.floor((H - 40) / 14)));
        const first = Math.max(0, gen - show + 1);
        const cw = (W - pad * 2 - 40) / N, ch = Math.min(cw, (H - 50) / show), gx = pad + 40, gy = pad + 16;
        D.text(g, L('한 줄 = 한 마디 (위에서 아래로 시간 순서)', 'One row = one bar (time goes down)'), pad, pad, { size: 10, color: C.dim });
        let diff = 0, dens = 0, cnt = 0;
        for (let k = 0; k < show; k++) {
          const gi = first + k, rw = row(gi), y = gy + k * ch;
          if (gi % 4 === 0) D.text(g, String(gi + 1), pad, y + ch / 2 - 5, { size: 9, color: C.dim });
          for (let i = 0; i < N; i++) {
            const on = rw[i], hot = gi === gen && i === s;
            D.rect(g, gx + i * cw + 0.5, y + 0.5, cw - 1, ch - 1, on ? (hot ? '#fff' : gi === gen ? col : col + '99') : (hot ? 'rgba(255,203,107,0.5)' : 'rgba(255,255,255,0.05)'));
          }
          if (gi === gen) D.rect(g, gx, y, cw * N, ch, null, C.warn, 1.5);
        }
        for (let gi = Math.max(1, gen - 15); gi <= gen; gi++) {
          const a = row(gi - 1), b = row(gi);
          for (let i = 0; i < N; i++) { diff += a[i] !== b[i] ? 1 : 0; dens += b[i]; }
          cnt++;
        }
        ctx.stat(L('규칙', 'Rule'), P.source === 'ca' ? `${P.rule} (${P.rule.toString(2).padStart(8, '0')})` : L('없음 (무작위)', 'None (random)'));
        ctx.stat(L('이웃 마디 차이', 'Change between bars'), cnt ? (diff / cnt).toFixed(1) + L(' 칸', ' steps') : '-');
        ctx.stat(L('밀도', 'Density'), cnt ? ((dens / cnt / N) * 100).toFixed(0) + '%' : '-');
        ctx.stat(L('세대 (마디)', 'Generation (bar)'), gen + 1);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
