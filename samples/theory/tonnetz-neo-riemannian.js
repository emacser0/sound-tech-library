(() => {
  // ── 공용 음악 도구 (이 파일 전용 사본. 다른 샘플과 이름이 겹치지 않게 함수 안에 둠) ──
  const LET = 'CDEFGAB', NAT = [0, 2, 4, 5, 7, 9, 11];
  const K = {
    LET, NAT,
    // 음 표기 { l: 글자 0~6 (C~B), a: 변화표 (-2~2), o: 옥타브 }. 60 = C4
    acc: (a) => (a > 0 ? '♯'.repeat(a) : '♭'.repeat(-a)),
    name: (n, oct) => LET[n.l] + K.acc(n.a) + (oct ? n.o : ''),
    midi: (n) => 12 * (n.o + 1) + NAT[n.l] + n.a,
    step: (n) => n.o * 7 + n.l,
    // n 위로 gen 단계(2 = 3도), semi 반음인 음. 글자는 단계로, 변화표는 반음 수로 정함
    above(n, gen, semi) {
      const t = n.l + gen, l = ((t % 7) + 7) % 7, o = n.o + Math.floor(t / 7);
      return { l, a: K.midi(n) + semi - (12 * (o + 1) + NAT[l]), o };
    },
    // MIDI 번호의 단순 표기 (flat이면 내림표 우선)
    fromMidi(m, flat) {
      const pc = ((m % 12) + 12) % 12, o = Math.floor(m / 12) - 1;
      const sharp = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0]];
      const flt = [[0, 0], [1, -1], [1, 0], [2, -1], [2, 0], [3, 0], [4, -1], [4, 0], [5, -1], [5, 0], [6, -1], [6, 0]];
      const [l, a] = (flat ? flt : sharp)[pc];
      return { l, a, o };
    },
    // 큰보표. y: 높은음자리표 맨 윗줄(F5), sp: 줄 간격. 반환: 단계 → y. 높이는 10 * sp
    staff(g, x, y, w, sp, o = {}) {
      const D = GTL.util.draw, C = GTL.util.colors;
      const yOf = (s) => y + (38 - s) * sp / 2;
      for (let i = 0; i < 5; i++) {
        D.line(g, x, y + i * sp, x + w, y + i * sp, 'rgba(216,221,230,0.45)', 1);
        if (o.treble !== false && o.bass !== false) D.line(g, x, y + (6 + i) * sp, x + w, y + (6 + i) * sp, 'rgba(216,221,230,0.45)', 1);
      }
      D.line(g, x, y, x, y + (o.treble !== false && o.bass !== false ? 10 : 4) * sp, 'rgba(216,221,230,0.45)', 1);
      D.text(g, '𝄞', x + 2, y - sp * 0.9, { size: sp * 5.2, color: C.dim });
      if (o.bass !== false) D.text(g, '𝄢', x + 3, y + 5.6 * sp, { size: sp * 3.4, color: C.dim });
      return yOf;
    },
    // 음표 머리 하나. 덧줄과 변화표 포함
    head(g, x, n, yOf, sp, color, o = {}) {
      const D = GTL.util.draw, s = K.step(n), yy = yOf(s);
      const led = (st) => D.line(g, x - sp * 1.05, yOf(st), x + sp * 1.05, yOf(st), 'rgba(216,221,230,0.6)', 1);
      for (let st = 40; st <= s; st += 2) led(st);
      for (let st = 16; st >= s; st -= 2) led(st);
      if (s === 28 && o.midC !== false) led(28);
      g.save(); g.translate(x, yy); g.rotate(-0.35);
      g.beginPath(); g.ellipse(0, 0, sp * 0.62, sp * 0.42, 0, 0, Math.PI * 2);
      if (o.hollow) { g.strokeStyle = color; g.lineWidth = 1.6; g.stroke(); } else { g.fillStyle = color; g.fill(); }
      g.restore();
      if (n.a && o.acc !== false) D.text(g, K.acc(n.a), x - sp * 1.0 - (o.accShift || 0), yy - sp * 0.95, { size: sp * 1.7, color, align: 'right' });
    },
    // 화음 머리들. 2도로 붙은 음은 옆으로 비킴. 변화표는 겹치지 않게 엇갈림
    chord(g, x, notes, yOf, sp, colorOf, o = {}) {
      const ns = notes.slice().sort((p, q) => K.step(p) - K.step(q));
      let prev = -99, shifted = false, k = 0;
      ns.forEach((n, i) => {
        const s = K.step(n);
        shifted = s - prev === 1 && !shifted;
        prev = s;
        const accShift = n.a ? (k++ % 2) * sp * 1.0 : 0;
        K.head(g, x + (shifted ? sp * 1.15 : 0), n, yOf, sp, colorOf ? colorOf(n, i) : '#d8dde6', { ...o, accShift });
      });
    },
    // 하모닉 몇 개를 더한 부드러운 음색으로 음표 목록을 반복 재생
    // getSong() → { key, len(초), notes: [{ t, d, m 또는 f, v }], poly(동시 음 수) }. key가 바뀌면 처음부터
    synth(ctx, getSong, o = {}) {
      const A = GTL.audio;
      const harm = o.harm || [1, 0.45, 0.25, 0.14, 0.08, 0.05];
      const hs = harm.reduce((s, v) => s + v, 0);
      const st = { t: 0, key: null };
      const snd = A.player(ctx, {
        process(l, r, sr, n) {
          const s = getSong();
          if (s.key !== st.key) { st.key = s.key; st.t = 0; }
          l.fill(0);
          const len = s.len, dt = 1 / sr, rel = o.release || 0.12, dec = o.decay ?? 0.9;
          const g0 = 0.5 / (hs * Math.max(2, s.poly || 4));
          for (const nt of s.notes) {
            const f = nt.f || A.mtof(nt.m), amp = g0 * (nt.v ?? 1), end = nt.d + rel * 7;
            const nh = Math.min(harm.length, Math.floor(sr * 0.45 / f));
            for (let i = 0; i < n; i++) {
              let tt = ((st.t + i * dt) % len) - nt.t;
              if (tt < 0) tt += len;
              if (tt > end) continue;
              let e = Math.min(1, tt / 0.012) * Math.exp(-tt * dec);
              if (tt > nt.d) e *= Math.exp(-(tt - nt.d) / rel);
              let v = 0;
              const w = 2 * Math.PI * f * tt;
              for (let h = 0; h < nh; h++) v += harm[h] * Math.sin(w * (h + 1));
              l[i] += v * e * amp;
            }
          }
          r.set(l);
          st.t = (st.t + n * dt) % len;
        },
      });
      snd.pos = () => st.t;
      return snd;
    },
  };
  // 소리를 끈 상태에서도 재생 위치를 보여 주는 시계. key가 바뀌면 0부터
  K.clock = () => {
    let t = 0, key = null;
    return { tick(dt, len, k) { if (k !== key) { key = k; t = 0; } t = (t + dt) % len; return t; }, get t() { return t; } };
  };

  const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  // 3화음 { r: 근음 pc, M: 장3화음이면 true }
  const OPS = {
    P: (c) => ({ r: c.r, M: !c.M }),
    R: (c) => (c.M ? { r: (c.r + 9) % 12, M: false } : { r: (c.r + 3) % 12, M: true }),
    L: (c) => (c.M ? { r: (c.r + 4) % 12, M: false } : { r: (c.r + 8) % 12, M: true }),
  };
  const SEQ = {
    PL: { ko: 'P L 반복 (6화음 순환)', en: 'P L repeated (6-chord cycle)' },
    PR: { ko: 'P R 반복 (8화음 순환)', en: 'P R repeated (8-chord cycle)' },
    LR: { ko: 'L R 반복 (24화음 모두)', en: 'L R repeated (all 24 chords)' },
    PLR: { ko: 'P L R 반복 (한 음을 둘러싼 육각형)', en: 'P L R repeated (hexagon around one note)' },
    RL: { ko: 'R L 반복', en: 'R L repeated' },
  };
  const tri = (c) => (c.M ? [c.r, (c.r + 4) % 12, (c.r + 7) % 12] : [c.r, (c.r + 3) % 12, (c.r + 7) % 12]);
  const cname = (c) => NN[c.r] + (c.M ? '' : 'm');

  GTL.register({
    id: 'tonnetz-neo-riemannian',
    title: '톤네츠와 신리만 변환 (P, L, R)',
    summary: '음을 5도와 3도 격자(톤네츠)에 놓으면 3화음은 삼각형이 되고, 음 하나만 움직이는 P, L, R 변환은 이웃 삼각형으로 뒤집기가 됨. 변환 순서에 따라 6개, 8개, 24개 화음을 도는 다른 순환이 생김.',
    views: { a: 'P L 반복', b: 'L R 반복' },
    controls: '파라미터 표에서 뷰마다 변환 순서를 고름. "소리 켜기"를 누르면 변환을 한 박마다 적용하며 화음을 들려줌.',
    info: `
      <p><b>톤네츠(Tonnetz)</b>는 오일러(1739)가 처음 그린 음 관계 격자. 가로는 완전5도, 대각선은 장3도와 단3도. 이 격자에서 장3화음과 단3화음은 각각 위, 아래를 향한 삼각형이 됨.</p>
      <p><b>신리만 이론(Neo-Riemannian theory)</b>은 두 음을 공유하고 한 음만 움직이는 세 변환으로 화음 관계를 설명함</p>
      <ul>
        <li><b>P (Parallel)</b>: C ↔ Cm. 3음이 반음 움직임</li>
        <li><b>R (Relative)</b>: C ↔ Am. 5음이 온음 움직임 (나란한조 관계)</li>
        <li><b>L (Leading-tone exchange)</b>: C ↔ Em. 근음이 반음 내려감</li>
      </ul>
      <p>모든 변환이 삼각형 하나를 변 하나를 축으로 뒤집는 것이라, 성부 진행이 아주 짧음. 기능 화성으로 설명하기 어려운 후기 낭만 음악과 영화 음악의 화음 흐름(예: C → A♭ → Fm, 장조 3도 관계)을 이 변환으로 설명함.</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" class="t-small t-dim">${L('톤네츠: 가로 = 5도, 오른쪽 위 = 장3도, 왼쪽 위 = 단3도', 'Tonnetz: across = 5th, up-right = major 3rd, up-left = minor 3rd')}</text>
      <polygon points="140,150 240,150 190,70" class="f-b" opacity="0.45"/>
      <polygon points="240,150 190,70 290,70" class="f-a" opacity="0.45"/>
      <polygon points="140,150 190,70 90,70" class="f-accent" opacity="0.35"/>
      <polygon points="140,150 240,150 190,230" class="f-good" opacity="0.3"/>
      ${[[140, 150, 'C'], [240, 150, 'G'], [340, 150, 'D'], [40, 150, 'F'], [190, 70, 'E'], [290, 70, 'B'], [90, 70, 'A'], [390, 70, 'F♯']].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="13" class="f-dim"/><text x="${x}" y="${y + 4}" text-anchor="middle">${n}</text>`).join('')}
      <text x="190" y="128" text-anchor="middle" class="t-small">C</text>
      <text x="240" y="98" text-anchor="middle" class="t-small">Em (L)</text>
      <text x="140" y="98" text-anchor="middle" class="t-small">Am (R)</text>
      <text x="190" y="178" text-anchor="middle" class="t-small">${L('Cm (P, 아래로 뒤집기)', 'Cm (P, flip down)')}</text>
      <text x="420" y="130" class="t-small t-dim">${L('변 하나를 공유 = 두 음 공유', 'Shared edge = two common tones')}</text>
    </svg>`,
    look: [
      'A는 장3도 방향으로 놓인 삼각형 6개의 띠를 지나 처음으로 돌아옴. B는 5도 방향(가로)으로 길게 걸어가며 24개 화음을 모두 지남.',
      '"소리 켜기"를 누르고 들으면 매 박마다 음 하나만 움직임. 성부 움직임 측정값이 P, L은 1반음, R은 2반음.',
      'B를 P R 반복으로 바꾸면 C, Cm, E♭, E♭m, ... 처럼 단3도씩 내려가는 8화음 순환이 됨',
      'A를 P L R 반복으로 바꾸면 6개 삼각형이 C 한 음을 둘러싼 육각형이 됨. 모든 화음이 C를 포함.',
    ],
    refs: [
      { type: 'paper', title: 'Richard Cohn, "Neo-Riemannian Operations, Parsimonious Trichords, and Their Tonnetz Representations", Journal of Music Theory 41(1)', year: 1997, note: 'P, L, R과 톤네츠 표현' },
      { type: 'book', title: 'Richard Cohn, Audacious Euphony: Chromaticism and the Triad\'s Second Nature', year: 2012, note: '육각 순환(hexatonic)과 팔각 순환(octatonic)' },
      { type: 'book', title: 'David Lewin, Generalized Musical Intervals and Transformations', year: 1987, note: '변환 이론의 원전' },
      { type: 'book', title: 'Leonhard Euler, Tentamen novae theoriae musicae', year: 1739, note: '톤네츠의 원형' },
    ],
    params: [
      { key: 'seq', label: '변환 순서', type: 'select', options: Object.entries(SEQ).map(([k, v]) => ({ value: k, label: v.ko })), a: 'PL', b: 'LR', group: '변환' },
      { key: 'root', label: '시작 화음 (장3화음)', type: 'select', options: NN.map((n, i) => ({ value: i, label: n })), default: 0, shared: true, group: '변환' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 30, max: 200, default: 72, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Tonnetz and Neo-Riemannian Transforms (P, L, R)',
      summary: 'Place notes on a grid of 5ths and 3rds (the Tonnetz) and each triad becomes a triangle. The P, L and R transforms move just one note, which flips the triangle to a neighbor. Different orders of transforms make cycles of 6, 8 or 24 chords.',
      views: { a: 'P L repeated', b: 'L R repeated' },
      controls: 'Pick an order of transforms for each view in the parameter table. Press "Sound on" to hear one transform applied on every beat.',
      info: `
      <p>The <b>Tonnetz</b> is a grid of note relations first drawn by Euler (1739). Across is a perfect 5th, the diagonals are major and minor 3rds. On this grid, major and minor triads are up and down triangles.</p>
      <p><b>Neo-Riemannian theory</b> explains chord relations with three transforms that keep two notes and move one.</p>
      <ul>
        <li><b>P (Parallel)</b>: C ↔ Cm. The 3rd moves a semitone.</li>
        <li><b>R (Relative)</b>: C ↔ Am. The 5th moves a whole tone (relative key relation).</li>
        <li><b>L (Leading-tone exchange)</b>: C ↔ Em. The root moves down a semitone.</li>
      </ul>
      <p>Every transform flips a triangle over one of its edges, so the voice leading is very short. It explains chord moves in late Romantic and film music that functional harmony struggles with (for example C → A♭ → Fm, major chords a 3rd apart).</p>`,
      look: [
        'A walks a strip of 6 triangles along the major-3rd direction and returns to the start. B walks a long way along the 5th direction (across) and passes all 24 chords.',
        'Press "Sound on". Only one note moves on each beat. The voice motion stat is 1 semitone for P and L, 2 for R.',
        'Switch B to P R repeated. You get an 8-chord cycle that falls by minor 3rds: C, Cm, E♭, E♭m, ...',
        'Switch A to P L R repeated. The 6 triangles form a hexagon around the single note C. Every chord contains C.',
      ],
      refs: ['P, L, R and their Tonnetz representation.', 'Hexatonic and octatonic cycles.', 'The original source of transformational theory.', 'The earliest form of the Tonnetz.'],
      params: {
        seq: { label: 'Transform order', group: 'Transforms', options: Object.fromEntries(Object.entries(SEQ).map(([k, v]) => [k, v.en])) },
        root: { label: 'Start chord (major)', group: 'Transforms' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      let ck = '', chain = [], ops = [], voices = [], moves = [], path = [], pathKey = '';
      // 순환이 닫힐 때까지 변환을 적용. 성부는 바뀌는 음 하나만 가장 가까운 음으로 옮김
      function plan() {
        const k = `${P.seq}|${P.root}`;
        if (k === ck) return;
        ck = k;
        const seq = P.seq.split('');
        let c = { r: +P.root, M: true };
        chain = [c]; ops = [];
        for (let i = 0; i < 48; i++) {
          const op = seq[i % seq.length];
          c = OPS[op](c); ops.push(op);
          if (c.r === chain[0].r && c.M === chain[0].M && (i + 1) % seq.length === 0) break;
          chain.push(c);
        }
        const r0 = 60 + chain[0].r - (chain[0].r > 6 ? 12 : 0);
        let v = [r0, r0 + 4, r0 + 7];
        voices = [v.slice()]; moves = [];
        for (let i = 1; i <= chain.length; i++) {
          const t = tri(chain[i % chain.length]), have = v.map((m) => m % 12);
          const out = v.findIndex((m) => !t.includes(m % 12)), add = t.find((p) => !have.includes(p));
          let mv = 0;
          if (out >= 0 && add != null) {
            let best = v[out], bd = 99;
            for (let m = v[out] - 6; m <= v[out] + 6; m++) if (m % 12 === add && Math.abs(m - v[out]) < bd) { bd = Math.abs(m - v[out]); best = m; }
            mv = Math.abs(best - v[out]); v[out] = best;
            // 너무 멀어지면 옥타브로 되돌림
            const avg = (v[0] + v[1] + v[2]) / 3;
            if (avg > 72) v = v.map((m) => m - 12); else if (avg < 55) v = v.map((m) => m + 12);
          }
          moves.push(mv);
          if (i < chain.length) voices.push(v.slice());
        }
      }
      const beat = () => 60 / P.bpm;
      const song = () => {
        plan();
        const b = beat(), notes = [];
        voices.forEach((v, i) => {
          v.forEach((m) => notes.push({ t: i * b, d: b * 0.96, m, v: 0.8 }));
          notes.push({ t: i * b, d: b * 0.96, m: 36 + chain[i].r + (chain[i].r < 4 ? 12 : 0), v: 0.6 });
        });
        return { key: ck + P.bpm, notes, len: voices.length * b, poly: 4 };
      };
      const snd = K.synth(ctx, song, { decay: 0.4, release: 0.2, harm: [1, 0.5, 0.25, 0.12, 0.06] });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
          const idx = Math.min(chain.length - 1, Math.floor(now / beat()));
          // 격자 (가로 = 5도, 오른쪽 위 = 장3도)
          const gw = W - pad * 2, gh = H - 110, dx = U.clamp(Math.min(gw / 13, gh / 6.2), 18, 64), dy = dx * 0.866;
          const cols = Math.ceil(gw / dx) + 4, rows = Math.max(3, Math.floor(gh / dy));
          const ox = pad + dx * 0.5, oy = 40 + rows * dy - dy * 0.3;
          const pos = (i, j) => [ox + i * dx + j * dx / 2 - Math.floor(j / 2) * dx, oy - j * dy];
          const pcAt = (i, j) => (((7 * (i - Math.floor(j / 2)) + 4 * j) % 12) + 12) % 12;
          // 삼각형 인스턴스: 장3화음 = (i,j),(i+1,j),(i,j+1) 형태. 좌표로 직접 찾음
          const nodes = [];
          for (let j = 0; j <= rows; j++) for (let i = -1; i < cols; i++) {
            const [x, y] = pos(i, j);
            if (x < pad - dx || x > W - pad + dx) continue;
            nodes.push({ i, j, x, y, pc: pcAt(i, j) });
          }
          const at = (x, y) => nodes.find((nd) => Math.abs(nd.x - x) < 1 && Math.abs(nd.y - y) < 1);
          const tris = [];
          nodes.forEach((a) => {
            const b = at(a.x + dx, a.y), c = at(a.x + dx / 2, a.y - dy), d = at(a.x + dx / 2, a.y + dy);
            if (b && c) tris.push({ pts: [a, b, c], M: (c.pc - a.pc + 12) % 12 === 4, root: (c.pc - a.pc + 12) % 12 === 4 ? a.pc : c.pc });
            if (b && d) tris.push({ pts: [a, b, d], M: (a.pc - d.pc + 12) % 12 === 4, root: (a.pc - d.pc + 12) % 12 === 4 ? d.pc : a.pc });
          });
          tris.forEach((t) => { t.cx = (t.pts[0].x + t.pts[1].x + t.pts[2].x) / 3; t.cy = (t.pts[0].y + t.pts[1].y + t.pts[2].y) / 3; t.pcs = t.pts.map((p) => p.pc); });
          const match = (c) => { const ps = tri(c); return tris.filter((t) => ps.every((p) => t.pcs.includes(p))); };
          // 경로: 앞 삼각형과 가장 가까운 인스턴스
          // 시작 인스턴스마다 경로를 만들어 보고 도약이 가장 적은 경로를 고름 (크기와 진행이 바뀔 때만)
          const pk = ck + '|' + W + '|' + H;
          if (pk !== pathKey) {
            pathKey = pk;
            const cm = chain.map(match);
            let bestCost = Infinity;
            path = [];
            for (const s0 of cm[0]) {
              const p = [s0];
              let cost = (s0.cx - W / 2) ** 2 * 1e-4;
              for (let i = 1; i < chain.length; i++) {
                let best = null, bd = Infinity;
                cm[i].forEach((t) => { const d = (t.cx - p[i - 1].cx) ** 2 + (t.cy - p[i - 1].cy) ** 2; if (d < bd) { bd = d; best = t; } });
                if (!best) break;
                p.push(best); cost += Math.sqrt(bd) > dx * 0.8 ? 1000 : 0;
              }
              if (p.length === chain.length && cost < bestCost) { bestCost = cost; path = p; }
            }
          }
          tris.forEach((t) => D.poly(g, t.pts, t.M ? 'rgba(79,195,247,0.04)' : 'rgba(255,122,89,0.04)', 'rgba(255,255,255,0.06)', 1, true));
          path.forEach((t, i) => { if (t) D.poly(g, t.pts, i === idx ? (t.M ? 'rgba(102,209,122,0.65)' : 'rgba(102,209,122,0.45)') : i < idx ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)', null); });
          g.beginPath();
          path.forEach((t, i) => { if (t) i ? g.lineTo(t.cx, t.cy) : g.moveTo(t.cx, t.cy); });
          g.strokeStyle = col; g.lineWidth = 2; g.stroke();
          path.forEach((t, i) => { if (t) { D.circle(g, t.cx, t.cy, i === idx ? 5 : 3, i === idx ? C.warn : col); if (i < chain.length && dx > 30) D.text(g, cname(chain[i]), t.cx, t.cy + 5, { size: 9, align: 'center', color: C.text }); } });
          nodes.forEach((nd) => {
            const inCur = tri(chain[idx]).includes(nd.pc);
            D.circle(g, nd.x, nd.y, Math.max(8, dx * 0.2), inCur ? C.warn : 'rgba(40,44,52,0.95)', 'rgba(255,255,255,0.2)', 1);
            D.text(g, NN[nd.pc], nd.x, nd.y - 5, { size: Math.min(11, dx * 0.22), align: 'center', color: inCur ? '#111' : C.text });
          });
          // 아래: 화음 순서와 변환
          const ly = H - 58, cw = Math.min(54, (W - pad * 2) / Math.min(chain.length, 24));
          const start = Math.max(0, Math.min(idx - 4, chain.length - Math.floor((W - pad * 2) / cw)));
          D.rect(g, 0, ly - 6, W, 64, 'rgba(20,22,26,0.85)');
          for (let i = start; i < chain.length; i++) {
            const x = pad + (i - start) * cw;
            if (x + cw > W - pad) break;
            D.rect(g, x + 1, ly, cw - 2, 22, i === idx ? C.warn : 'rgba(255,255,255,0.07)');
            D.text(g, cname(chain[i]), x + cw / 2, ly + 5, { size: 10, align: 'center', color: i === idx ? '#111' : C.text });
            D.text(g, ops[i] || '', x + cw, ly + 26, { size: 10, align: 'center', color: col });
          }
          ctx.stat(Lg('순환 길이', 'Cycle length'), Lg(`화음 ${chain.length}개`, `${chain.length} chords`));
          ctx.stat(Lg('지금 화음', 'Current chord'), cname(chain[idx]) + (ops[idx] ? ` → ${ops[idx]} → ${cname(chain[(idx + 1) % chain.length])}` : ''));
          ctx.stat(Lg('성부 움직임 (이번 변환)', 'Voice motion (this step)'), (moves[idx] || 0) + Lg('반음', ' st'));
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
