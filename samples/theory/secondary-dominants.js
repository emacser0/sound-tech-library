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
  // ── 4성부 화음 배치 도구 (이 파일 전용 사본) ──
  // 화음 { root: {l, a}, q: [반음], gen: [단계], inv: 베이스로 쓸 구성음 번호 }
  const QS = {
    maj: [[0, 4, 7], [0, 2, 4], ''], min: [[0, 3, 7], [0, 2, 4], 'm'], dim: [[0, 3, 6], [0, 2, 4], '°'], aug: [[0, 4, 8], [0, 2, 4], '+'],
    dom7: [[0, 4, 7, 10], [0, 2, 4, 6], '7'], maj7: [[0, 4, 7, 11], [0, 2, 4, 6], 'maj7'], min7: [[0, 3, 7, 10], [0, 2, 4, 6], 'm7'],
    hdim7: [[0, 3, 6, 10], [0, 2, 4, 6], 'm7♭5'], dim7: [[0, 3, 6, 9], [0, 2, 4, 6], '°7'],
  };
  const HV = {
    // 조의 으뜸음 tonic({l, a}) 위 gen 단계, semi 반음에 근음을 둔 화음
    chord(tonic, gen, semi, qual, inv = 0) {
      const r = K.above({ l: tonic.l, a: tonic.a, o: 4 }, gen, semi), q = QS[qual];
      return { root: { l: r.l, a: r.a }, q: q[0], gen: q[1], inv, qual, sym: K.name(r) + q[2] };
    },
    tones(ch) {
      return ch.q.map((s, i) => { const n = K.above({ l: ch.root.l, a: ch.root.a, o: 4 }, ch.gen[i], s); return { l: n.l, a: n.a, pc: ((K.midi(n) % 12) + 12) % 12 }; });
    },
    // MIDI 번호를 화음 구성음 표기로 (구성음이 아니면 단순 표기)
    spell(ch, m) {
      const pc = ((m % 12) + 12) % 12, t = HV.tones(ch).find((x) => x.pc === pc);
      if (!t) return K.fromMidi(m);
      return { l: t.l, a: t.a, o: Math.round((m - K.NAT[t.l] - t.a) / 12) - 1 };
    },
    // 단순 배치: 베이스 = 근음, 위 3성부 = 근음 위치의 밀집 화음 (근음이 G3~F♯4)
    block(ch) {
      const pcs = HV.tones(ch).map((t) => t.pc), pc = pcs[0], bpc = pcs[ch.inv || 0];
      const bass = 40 + ((bpc - 4 + 12) % 12), r = 55 + ((pc - 7 + 12) % 12);
      const up = pcs.length > 3 ? [r + ch.q[1], r + ch.q[2], r + ch.q[3]] : [r, r + ch.q[1], r + ch.q[2]];
      return [bass, ...up];
    },
    // 후보 배치: [베이스, 테너, 알토, 소프라노]
    cands(ch) {
      const t = HV.tones(ch), pcs = t.map((x) => x.pc), bpc = pcs[ch.inv || 0], need = pcs.length > 3 ? [pcs[0], pcs[1], pcs[3]] : pcs;
      const opts = [];
      for (let m = 52; m <= 79; m++) if (pcs.includes(m % 12)) opts.push(m);
      const out = [];
      for (let b = 38; b <= 57; b++) {
        if (b % 12 !== bpc) continue;
        for (let i = 0; i < opts.length; i++) for (let j = i + 1; j < opts.length; j++) for (let k = j + 1; k < opts.length; k++) {
          const v = [b, opts[i], opts[j], opts[k]];
          if (v[1] <= b || v[2] - v[1] > 12 || v[3] - v[2] > 12 || v[1] - b > 19) continue;
          const have = new Set(v.map((m) => m % 12));
          if (!need.every((p) => have.has(p))) continue;
          // 3음 겹침은 피함 (장, 단3화음)
          const third = pcs[1];
          if (v.filter((m) => m % 12 === third).length > 1) continue;
          if (ch.sop != null && v[3] % 12 !== ch.sop) continue;
          out.push(v);
        }
      }
      return out;
    },
    // 두 배치 사이의 평행 5도, 8도 목록 [{ i, j, kind: 5 | 8 }]
    parallels(a, b) {
      const out = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
        const i1 = ((a[j] - a[i]) % 12 + 12) % 12, i2 = ((b[j] - b[i]) % 12 + 12) % 12;
        const di = b[i] - a[i], dj = b[j] - a[j];
        if (i1 === i2 && (i1 === 7 || i1 === 0) && di !== 0 && Math.sign(di) === Math.sign(dj)) out.push({ i, j, kind: i1 === 7 ? 5 : 8 });
      }
      return out;
    },
    move(a, b) { let s = 0; for (let i = 0; i < 4; i++) s += Math.abs(b[i] - a[i]); return s; },
    // 전체 진행을 동적 계획법으로 배치. 움직임 합 + 평행 벌점이 최소
    smooth(chs) {
      const C = chs.map(HV.cands);
      const cost = C.map((cs) => new Float64Array(cs.length)), from = C.map((cs) => new Int32Array(cs.length));
      C[0].forEach((v, i) => { cost[0][i] = Math.abs(v[3] - 72) * 0.6 + Math.abs(v[0] - 48) * 0.2 + (v[3] - v[1]) * 0.05; });
      for (let s = 1; s < C.length; s++) {
        C[s].forEach((v, i) => {
          let best = Infinity, bi = 0;
          C[s - 1].forEach((u, k) => {
            let c = cost[s - 1][k] + Math.abs(v[1] - u[1]) + Math.abs(v[2] - u[2]) + Math.abs(v[3] - u[3]) + Math.abs(v[0] - u[0]) * 0.3;
            if (c >= best) return;
            c += HV.parallels(u, v).length * 30;
            if (c < best) { best = c; bi = k; }
          });
          cost[s][i] = best + (v[3] > 77 ? 4 : 0); from[s][i] = bi;
        });
      }
      const last = C.length - 1;
      let bi = 0;
      cost[last].forEach((c, i) => { if (c < cost[last][bi]) bi = i; });
      const res = new Array(C.length);
      for (let s = last; s >= 0; s--) { res[s] = C[s][bi]; bi = from[s][bi]; }
      return res;
    },
    // 큰보표에 4성부 진행을 그림. vs: 배치 배열, chs: 화음, 선으로 성부를 이음
    drawProgression(g, x, y, w, sp, chs, vs, o = {}) {
      const U = GTL.util, D = U.draw, C = U.colors;
      const yOf = K.staff(g, x, y, w, sp);
      const x0 = x + sp * 6, cw = (w - sp * 7) / Math.max(1, vs.length), xs = vs.map((_, i) => x0 + cw * (i + 0.5));
      const vcol = o.voiceColors || ['#ff7a59', '#66d17a', '#ffcb6b', '#4fc3f7'];
      // 성부 선
      for (let s = 1; s < vs.length; s++) {
        const par = HV.parallels(vs[s - 1], vs[s]);
        for (let v = 0; v < 4; v++) {
          const bad = par.some((p) => p.i === v || p.j === v);
          const n0 = HV.spell(chs[s - 1], vs[s - 1][v]), n1 = HV.spell(chs[s], vs[s][v]);
          D.line(g, xs[s - 1] + sp, yOf(K.step(n0)), xs[s] - sp, yOf(K.step(n1)), bad ? C.bad : vcol[v] + '88', bad ? 2.5 : 1.2);
        }
        if (par.length) D.text(g, par.map((p) => (p.kind === 5 ? o.p5 || 'P5' : o.p8 || 'P8')).join(' '), (xs[s - 1] + xs[s]) / 2, y - sp * 3.2, { size: 10, align: 'center', color: C.bad });
      }
      vs.forEach((v, s) => {
        if (o.hl === s) D.rect(g, xs[s] - cw / 2 + 2, y - sp * 2, cw - 4, sp * 14, 'rgba(255,255,255,0.07)');
        const ns = v.map((m) => HV.spell(chs[s], m));
        K.chord(g, xs[s], ns, yOf, sp, (n) => (o.noteColor && o.noteColor(n, s)) || vcol[v.findIndex((m) => m === K.midi(n))] || C.text);
      });
      return xs;
    },
  };

  // [단계, 반음, 성질, 로마 숫자, 해결 대상 칸(부속 딸림화음일 때)]
  const VER = {
    diatonic: { ko: '음계 안의 화음만', en: 'Diatonic chords only', c: [[0, 0, 'maj', 'I'], [2, 4, 'min', 'iii'], [5, 9, 'min', 'vi'], [5, 9, 'min7', 'vi7'], [1, 2, 'min', 'ii'], [1, 2, 'min7', 'ii7'], [4, 7, 'dom7', 'V7'], [0, 0, 'maj', 'I']] },
    secondary: { ko: '부속 딸림화음 (V7/x)', en: 'Secondary dominants (V7/x)', c: [[0, 0, 'maj', 'I'], [2, 4, 'dom7', 'V7/vi', 2], [5, 9, 'min', 'vi'], [5, 9, 'dom7', 'V7/ii', 4], [1, 2, 'min', 'ii'], [1, 2, 'dom7', 'V7/V', 6], [4, 7, 'dom7', 'V7'], [0, 0, 'maj', 'I']] },
    borrowed: { ko: '빌린 화음 (같은 으뜸음 단조)', en: 'Borrowed chords (parallel minor)', c: [[0, 0, 'maj', 'I'], [2, 3, 'maj', '♭III'], [5, 8, 'maj', '♭VI'], [3, 5, 'min', 'iv'], [1, 2, 'hdim7', 'iiø7'], [6, 10, 'maj', '♭VII'], [4, 7, 'dom7', 'V7'], [0, 0, 'maj', 'I']] },
  };
  const KEYS = [['C', 0, 0], ['D', 1, 0], ['E♭', 2, -1], ['F', 3, 0], ['G', 4, 0], ['A', 5, 0], ['B♭', 6, -1]];
  const MAJ = [0, 2, 4, 5, 7, 9, 11];
  const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

  GTL.register({
    id: 'secondary-dominants',
    title: '부속 딸림화음과 빌린 화음',
    summary: '음계 밖의 음을 하나만 바꿔도 화음 진행의 색이 달라짐. 부속 딸림화음은 다음 화음을 잠깐 으뜸음처럼 만들어 앞으로 당기고, 빌린 화음은 같은 으뜸음의 단조에서 화음을 가져와 어두운 색을 섞음.',
    views: { a: '음계 안의 화음만', b: '부속 딸림화음' },
    controls: '파라미터 표에서 뷰마다 버전을 고름. "소리 켜기"를 누르면 진행을 반복함.',
    info: `
      <p>장조의 7개 화음만 쓰면 진행이 안정적이지만 단조로울 수 있음. 음계 밖의 음(반음계 음)을 섞는 대표적인 방법이 두 가지 있음.</p>
      <ul>
        <li><b>부속 딸림화음(Secondary dominant)</b>: I이 아닌 화음 X 앞에 "X의 V7"을 둠. 예: ii(Dm) 앞의 A7 = V7/ii. A7의 3음 C♯이 D로 반음 올라가는 이끎음 역할을 해서 Dm이 잠깐 으뜸화음처럼 들림.</li>
        <li><b>빌린 화음(Borrowed chord, 조성 혼합)</b>: 같은 으뜸음의 단조에서 화음을 빌림. C 장조에서 iv(Fm), ♭VI(A♭), ♭VII(B♭), ♭III(E♭). 영화 음악과 록에서 극적인 색으로 자주 씀.</li>
      </ul>
      <p>기호 V7/x는 "x의 딸림7화음"이라는 뜻. 근음이 x보다 완전5도 위이고, 3음이 x로 반음 올라가며 해결함.</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
      <text x="4" y="16" class="t-small t-dim">${L('A7 = Dm의 V7 (V7/ii). 음 하나(C♯)만 음계 밖', 'A7 = V7 of Dm (V7/ii). Only one note (C♯) is outside the scale')}</text>
      <rect x="40" y="34" width="120" height="96" rx="6" class="f-dim"/>
      <text x="100" y="54" text-anchor="middle" class="t-b">A7 (V7/ii)</text>
      <text x="100" y="76" text-anchor="middle" class="t-mono">G</text><text x="100" y="94" text-anchor="middle" class="t-mono">E</text>
      <text x="100" y="112" text-anchor="middle" class="t-mono t-a">C♯</text><text x="100" y="126" text-anchor="middle" class="t-mono">A</text>
      <rect x="320" y="34" width="120" height="96" rx="6" class="f-dim"/>
      <text x="380" y="54" text-anchor="middle">Dm (ii)</text>
      <text x="380" y="76" text-anchor="middle" class="t-mono">F</text><text x="380" y="94" text-anchor="middle" class="t-mono">F</text>
      <text x="380" y="112" text-anchor="middle" class="t-mono">D</text><text x="380" y="126" text-anchor="middle" class="t-mono">D</text>
      <path d="M118,108 L362,108" class="d-accent" marker-end="url(#arr)"/>
      <text x="240" y="102" text-anchor="middle" class="t-small">${L('C♯ → D 반음 위로 (이끎음)', 'C♯ → D, up a semitone (leading tone)')}</text>
      <path d="M118,72 L362,72" class="d-dim" marker-end="url(#arr)"/>
      <text x="240" y="66" text-anchor="middle" class="t-small t-dim">${L('7음 G → F 반음 아래로', '7th G → F, down a semitone')}</text>
      <text x="270" y="158" text-anchor="middle" class="t-small t-dim">${L('근음 A → D는 5도 아래. V → I과 같은 관계를 ii 위에 만듦', 'Root A → D falls a 5th. It recreates V → I on top of ii')}</text>
    </svg>`,
    look: [
      'B의 2, 4, 6번째 화음에 음계 밖의 음(빨강)이 하나씩 생기고, 다음 화음으로 화살표가 이어짐',
      '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 B가 다음 화음으로 더 세게 끌려감',
      'B를 빌린 화음으로 바꾸면 E♭, A♭, B♭이 섞여 같은 C 장조인데도 어둡고 극적으로 들림',
      '"쓴 음 종류" 측정값이 A는 7개, B는 10개로 늘어남',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '부속 딸림화음(applied dominants)과 조성 혼합' },
      { type: 'book', title: 'Stefan Kostka, Dorothy Payne, Tonal Harmony', note: 'V7/x 표기와 해결' },
      { type: 'book', title: 'Walter Piston, Harmony (5th ed., rev. DeVoto)', year: 1987, note: '부속 화음과 조성 혼합' },
      { type: 'article', title: 'Open Music Theory, "Applied chords" and "Modal mixture" (Gotham et al.)', url: 'https://viva.pressbooks.pub/openmusictheory/', note: '공개 음악 이론 교재' },
    ],
    params: [
      { key: 'ver', label: '버전', type: 'select', options: Object.entries(VER).map(([k, v]) => ({ value: k, label: v.ko })), a: 'diatonic', b: 'secondary', group: '진행' },
      { key: 'key', label: '조 (장조)', type: 'select', options: KEYS.map((k, i) => ({ value: i, label: k[0] })), default: 0, shared: true, group: '진행' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 40, max: 160, default: 84, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Secondary Dominants and Borrowed Chords',
      summary: 'Changing even one note to a note outside the scale changes the color of a progression. A secondary dominant briefly turns the next chord into a tonic and pulls forward. A borrowed chord takes chords from the minor key on the same tonic and mixes in a darker color.',
      views: { a: 'Diatonic chords only', b: 'Secondary dominants' },
      controls: 'Pick a version for each view in the parameter table. Press "Sound on" to hear the progression loop.',
      info: `
      <p>Using only the 7 chords of a major key sounds stable but can get plain. Two common ways bring in notes outside the scale (chromatic notes).</p>
      <ul>
        <li><b>Secondary dominant</b>: put "the V7 of X" before a chord X that is not I. For example, A7 before ii (Dm) is V7/ii. The 3rd of A7, C♯, acts as a leading tone up to D, so Dm sounds like a tonic for a moment.</li>
        <li><b>Borrowed chord (modal mixture)</b>: borrow chords from the minor key on the same tonic. In C major: iv (Fm), ♭VI (A♭), ♭VII (B♭), ♭III (E♭). Film music and rock use them for dramatic color.</li>
      </ul>
      <p>V7/x means "the dominant 7th of x". Its root is a perfect 5th above x, and its 3rd resolves up a semitone to x.</p>`,
      look: [
        'In B, chords 2, 4 and 6 each get one note outside the scale (red), with an arrow to the next chord.',
        'Press "Sound on" and switch between A and B. B pulls harder into each next chord.',
        'Switch B to borrowed chords. E♭, A♭ and B♭ appear, and it sounds dark and dramatic while still in C major.',
        'The "Pitch classes used" stat grows from 7 in A to 10 in B.',
      ],
      refs: ['Applied (secondary) dominants and modal mixture.', 'V7/x notation and resolution.', 'Secondary chords and mixture.', 'Free open music theory textbook.'],
      params: {
        ver: { label: 'Version', group: 'Progression', options: Object.fromEntries(Object.entries(VER).map(([k, v]) => [k, v.en])) },
        key: { label: 'Key (major)', group: 'Progression' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      let ck = '', ver = null, chs = [], vs = [], diat = new Set(), tonicPc = 0;
      function plan() {
        const k = `${P.ver}|${P.key}`;
        if (k === ck) return;
        ck = k;
        ver = VER[P.ver] || VER.diatonic;
        const kk = KEYS[+P.key] || KEYS[0], tonic = { l: kk[1], a: kk[2] };
        tonicPc = ((K.midi({ l: kk[1], a: kk[2], o: 4 }) % 12) + 12) % 12;
        diat = new Set(MAJ.map((s) => (tonicPc + s) % 12));
        chs = ver.c.map(([gen, semi, q, rn, tgt]) => { const ch = HV.chord(tonic, gen, semi, q); ch.rn = rn; ch.tgt = tgt; return ch; });
        vs = HV.smooth(chs);
      }
      const song = () => {
        plan();
        const b = 60 / P.bpm * 2, notes = [];
        vs.forEach((v, s) => v.forEach((m, i) => notes.push({ t: s * b, d: b * 0.95, m, v: i === 0 ? 0.9 : 0.75 })));
        return { key: ck + P.bpm, notes, len: vs.length * b + b * 0.5, poly: 4 };
      };
      const snd = K.synth(ctx, song, { decay: 0.5, harm: [1, 0.4, 0.22, 0.12, 0.06] });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, n = vs.length;
          const b = 60 / P.bpm * 2, hl = Math.min(n - 1, Math.floor(now / b));
          const sp = U.clamp((H - 150) / 15, 4, 12), sy = 52 + sp * 3;
          const chrom = (nn) => !diat.has(((K.midi(nn) % 12) + 12) % 12);
          const xs = HV.drawProgression(g, pad, sy, W - pad * 2, sp, chs, vs, { hl, noteColor: (nn) => (chrom(nn) ? C.bad : null), p5: Lg('평행 5도', 'par. 5th'), p8: Lg('평행 8도', 'par. 8ve') });
          const ly = sy + sp * 10 + 10;
          chs.forEach((c, s) => {
            const nonD = HV.tones(c).some((t) => !diat.has(t.pc));
            D.text(g, c.rn, xs[s], ly, { size: 13, align: 'center', color: s === hl ? C.warn : nonD ? col : C.text });
            D.text(g, c.sym, xs[s], ly + 17, { size: 10, align: 'center', color: C.dim });
            if (c.tgt != null) {
              const y = ly + 36;
              D.arrow(g, xs[s] + 4, y, xs[c.tgt] - 6, y, col, 1.6, 6);
              D.text(g, Lg('해결', 'resolves'), (xs[s] + xs[c.tgt]) / 2, y + 3, { size: 9, align: 'center', color: col });
            }
          });
          // 12개 음 띠: 음계 안(회색) vs 이 진행에서 쓴 음계 밖 음(빨강)
          const used = new Set(), nm = {};
          chs.forEach((c) => HV.tones(c).forEach((t) => { used.add(t.pc); if (!nm[t.pc]) nm[t.pc] = K.name(t); }));
          const by = ly + 58, bw = Math.min(28, (W - pad * 2) / 12);
          if (by + 30 < H) {
            D.text(g, Lg('쓴 음 (빨강 = 음계 밖)', 'Notes used (red = outside the scale)'), pad, by - 14, { size: 10, color: C.dim });
            for (let k = 0; k < 12; k++) {
              const pc = (tonicPc + k) % 12, u = used.has(pc), d = diat.has(pc);
              D.rect(g, pad + k * bw, by, bw - 2, 20, u ? (d ? 'rgba(216,221,230,0.5)' : C.bad) : 'rgba(255,255,255,0.05)');
              D.text(g, nm[pc] || NN[pc], pad + k * bw + (bw - 2) / 2, by + 4, { size: 9, align: 'center', color: u ? '#111' : C.dim });
            }
          }
          let chromN = 0;
          vs.forEach((v, s) => v.forEach((m) => { if (!diat.has(m % 12)) chromN++; }));
          ctx.stat(Lg('쓴 음 종류', 'Pitch classes used'), used.size);
          ctx.stat(Lg('음계 밖 음 (전체 음표)', 'Chromatic notes (all notes)'), chromN);
          ctx.stat(Lg('지금 화음', 'Current chord'), `${chs[hl].rn} (${chs[hl].sym})`);
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
