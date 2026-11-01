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

  const PROG = {
    basic: { ko: 'I IV V I', en: 'I IV V I', c: [[0, 0, 'maj'], [3, 5, 'maj'], [4, 7, 'maj'], [0, 0, 'maj']] },
    pop: { ko: 'I vi IV V I', en: 'I vi IV V I', c: [[0, 0, 'maj'], [5, 9, 'min'], [3, 5, 'maj'], [4, 7, 'maj'], [0, 0, 'maj']] },
    canon: { ko: 'I V vi iii IV I IV V (캐논 진행)', en: 'I V vi iii IV I IV V (canon pattern)', c: [[0, 0, 'maj'], [4, 7, 'maj'], [5, 9, 'min'], [2, 4, 'min'], [3, 5, 'maj'], [0, 0, 'maj'], [3, 5, 'maj'], [4, 7, 'maj']] },
    circle: { ko: 'I IV vii° iii vi ii V I (5도 순환)', en: 'I IV vii° iii vi ii V I (circle of 5ths)', c: [[0, 0, 'maj'], [3, 5, 'maj'], [6, 11, 'dim'], [2, 4, 'min'], [5, 9, 'min'], [1, 2, 'min'], [4, 7, 'maj'], [0, 0, 'maj']] },
    jazz: { ko: 'ii7 V7 Imaj7 vi7 (7화음)', en: 'ii7 V7 Imaj7 vi7 (7th chords)', c: [[1, 2, 'min7'], [4, 7, 'dom7'], [0, 0, 'maj7'], [5, 9, 'min7']] },
  };
  const KEYS = [['C', 0, 0], ['D', 1, 0], ['E♭', 2, -1], ['F', 3, 0], ['G', 4, 0], ['A', 5, 0], ['B♭', 6, -1]];

  GTL.register({
    id: 'voice-leading',
    title: '성부 진행 (덩어리 화음 vs 부드러운 연결)',
    summary: '화음을 모두 같은 모양(근음 위치 밀집)으로 옮기면 모든 성부가 함께 뛰고 평행 5도, 8도가 생김. 공통음은 붙잡고 나머지는 가장 가까운 음으로 옮기면 움직임이 몇 분의 1로 줄고 선율이 이어짐.',
    views: { a: '덩어리 화음 (같은 모양으로 이동)', b: '부드러운 성부 진행 (최소 이동)' },
    controls: '파라미터 표에서 진행과 조를 고름. "소리 켜기"를 누르면 진행이 반복됨.',
    info: `
      <p><b>성부 진행(Voice leading)</b>은 화음을 이어 갈 때 각 성부(소프라노, 알토, 테너, 베이스)가 어떻게 움직이는지를 다룸. 화음 기호가 같아도 배치에 따라 소리의 매끄러움이 크게 달라짐.</p>
      <ul>
        <li><b>덩어리 화음(A)</b>: 손 모양을 고정하고 통째로 옮기는 방식. 초보 반주에서 흔함. 모든 성부가 같은 방향으로 크게 뛰고, 5도와 8도 관계가 그대로 평행 이동함.</li>
        <li><b>부드러운 연결(B)</b>: 공통음은 같은 성부에 두고, 나머지는 2도나 3도로 가까운 음에 감. 이 샘플은 모든 배치 후보를 만들고 동적 계획법으로 "움직임 합 + 평행 벌점"이 최소인 경로를 찾음.</li>
        <li><b>평행 5도, 8도</b>: 두 성부가 완전5도나 8도를 유지한 채 같은 방향으로 움직이는 것. 두 성부가 하나로 녹아 독립성이 사라져서 고전 화성에서 피함.</li>
      </ul>
      <p>같은 원리가 패드 보이싱, 현악 편곡, 자동 반주 생성, 게임의 적응형 음악 전환에도 쓰임</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" class="t-small t-dim">${L('C → F: 공통음 C는 그대로, 나머지는 가까운 음으로', 'C → F: keep the common tone C, move the others to the nearest note')}</text>
      <text x="60" y="40" class="t-a">${L('A 덩어리', 'A block')}</text>
      <text x="60" y="64" class="t-mono">G</text><text x="60" y="88" class="t-mono">E</text><text x="60" y="112" class="t-mono">C</text>
      <text x="200" y="40" class="t-mono">C</text><text x="200" y="64" class="t-mono">A</text><text x="200" y="88" class="t-mono">F</text>
      <path d="M74,60 L194,36" class="d-a"/><path d="M74,84 L194,60" class="d-a"/><path d="M74,108 L194,84" class="d-a"/>
      <text x="100" y="140" class="t-small t-a">${L('모두 위로 4~5반음', 'all up 4~5 semitones')}</text>
      <text x="320" y="40" class="t-b">${L('B 부드럽게', 'B smooth')}</text>
      <text x="320" y="64" class="t-mono">G</text><text x="320" y="88" class="t-mono">E</text><text x="320" y="112" class="t-mono">C</text>
      <text x="460" y="64" class="t-mono">A</text><text x="460" y="88" class="t-mono">F</text><text x="460" y="112" class="t-mono">C</text>
      <path d="M334,60 L454,60" class="d-b"/><path d="M334,84 L454,84" class="d-b"/><path d="M334,108 L454,108" class="d-good"/>
      <text x="340" y="140" class="t-small t-b">${L('G→A +2, E→F +1, C 유지', 'G→A +2, E→F +1, C held')}</text>
      <text x="270" y="170" text-anchor="middle" class="t-small t-dim">${L('움직임 합: A 14반음 vs B 3반음 (위 3성부)', 'Total motion: A 14 semitones vs B 3 semitones (upper 3 voices)')}</text>
    </svg>`,
    look: [
      '기본 진행 I IV V I에서 A의 IV → V 사이에 빨간 선과 "P5 P8" 표시가 생김. B에는 없음.',
      '"움직임 합" 측정값이 A가 B의 몇 배인지 비교. 5도 순환 진행에서 차이가 가장 큼.',
      '"소리 켜기"를 누르고 소리 내는 뷰를 바꾸면 A는 화음이 덜컥거리며 뛰고, B는 소프라노가 선율처럼 이어짐',
      '7화음 진행(ii7 V7 Imaj7)을 고르면 B에서 7음이 반음 아래로 내려가며 다음 화음의 3음이 됨',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '4성부 진행 규칙, 평행 5도와 8도' },
      { type: 'book', title: 'Dmitri Tymoczko, A Geometry of Music', year: 2011, note: '최소 이동 성부 진행과 화음 공간' },
      { type: 'book', title: 'Johann Joseph Fux, Gradus ad Parnassum', year: 1725, note: '평행 완전음정 금지의 고전 근거' },
      { type: 'paper', title: 'David Huron, "Tone and Voice: A Derivation of the Rules of Voice-Leading from Perceptual Principles", Music Perception 19(1)', year: 2001, note: '성부 진행 규칙의 지각적 근거' },
    ],
    params: [
      { key: 'method', label: '배치 방식', type: 'select', options: [{ value: 'block', label: '덩어리 화음' }, { value: 'smooth', label: '최소 이동 (동적 계획법)' }], a: 'block', b: 'smooth', group: '성부 진행' },
      { key: 'prog', label: '진행', type: 'select', options: Object.entries(PROG).map(([k, v]) => ({ value: k, label: v.ko })), default: 'basic', shared: true, group: '성부 진행' },
      { key: 'key', label: '조', type: 'select', options: KEYS.map((k, i) => ({ value: i, label: k[0] })), default: 0, shared: true, group: '성부 진행' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 40, max: 160, default: 80, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Voice Leading (Block Chords vs Smooth Connection)',
      summary: 'Moving every chord in the same shape (close root position) makes all voices jump together and creates parallel 5ths and octaves. Holding common tones and moving the rest to the nearest notes cuts the motion several times and keeps the lines connected.',
      views: { a: 'Block chords (same shape)', b: 'Smooth voice leading (least motion)' },
      controls: 'Pick a progression and a key in the parameter table. Press "Sound on" to hear the progression loop.',
      info: `
      <p><b>Voice leading</b> is how each voice (soprano, alto, tenor, bass) moves from one chord to the next. The same chord symbols can sound smooth or clumsy depending on the voicing.</p>
      <ul>
        <li><b>Block chords (A)</b>: keep the hand shape and move it as a whole. Common in beginner accompaniment. All voices leap in the same direction, and 5ths and octaves move in parallel.</li>
        <li><b>Smooth connection (B)</b>: keep common tones in the same voice and move the others by a 2nd or 3rd. This sample builds every voicing candidate and uses dynamic programming to find the path with the least "total motion + parallel penalty".</li>
        <li><b>Parallel 5ths and octaves</b>: two voices keep a perfect 5th or octave while moving in the same direction. The two voices blend into one and lose independence, so classical harmony avoids them.</li>
      </ul>
      <p>The same idea is used for pad voicings, string arranging, automatic accompaniment and adaptive game music transitions.</p>`,
      look: [
        'In the default I IV V I, A shows red lines and "P5 P8" between IV and V. B has none.',
        'Compare the "Total motion" stat. A is several times larger than B. The gap is largest in the circle of 5ths progression.',
        'Press "Sound on" and switch the view that plays sound. A lurches from chord to chord. In B the soprano flows like a melody.',
        'Pick the 7th chord progression (ii7 V7 Imaj7). In B the 7th steps down a semitone and becomes the 3rd of the next chord.',
      ],
      refs: ['Four-part voice-leading rules, parallel 5ths and octaves.', 'Minimal voice leading and chord spaces.', 'Classic source for avoiding parallel perfect intervals.', 'Perceptual basis of voice-leading rules.'],
      params: {
        method: { label: 'Voicing method', group: 'Voice leading', options: { block: 'Block chords', smooth: 'Least motion (dynamic programming)' } },
        prog: { label: 'Progression', group: 'Voice leading', options: Object.fromEntries(Object.entries(PROG).map(([k, v]) => [k, v.en])) },
        key: { label: 'Key', group: 'Voice leading' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      let ck = '', chs = [], vs = [], stats = null;
      function plan() {
        const k = `${P.method}|${P.prog}|${P.key}`;
        if (k === ck) return;
        ck = k;
        const pr = PROG[P.prog] || PROG.basic, kk = KEYS[+P.key] || KEYS[0], tonic = { l: kk[1], a: kk[2] };
        chs = pr.c.map(([gen, semi, q]) => HV.chord(tonic, gen, semi, q));
        vs = P.method === 'smooth' ? HV.smooth(chs) : chs.map(HV.block);
        let mv = 0, par = 0, hold = 0, leaps = 0;
        for (let s = 1; s < vs.length; s++) {
          for (let v = 1; v < 4; v++) { const d = Math.abs(vs[s][v] - vs[s - 1][v]); mv += d; if (d === 0) hold++; if (d > 4) leaps++; }
          par += HV.parallels(vs[s - 1], vs[s]).length;
        }
        stats = { mv, par, hold, leaps };
      }
      const song = () => {
        plan();
        const b = 60 / P.bpm * 2, notes = [];
        vs.forEach((v, s) => v.forEach((m, i) => notes.push({ t: s * b, d: b * 0.95, m, v: i === 0 ? 0.9 : 0.75 })));
        return { key: ck + P.bpm, notes, len: vs.length * b + b * 0.6, poly: 4 };
      };
      const snd = K.synth(ctx, song, { decay: 0.5, harm: [1, 0.35, 0.2, 0.1, 0.05] });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
          const b = 60 / P.bpm * 2, hl = Math.min(vs.length - 1, Math.floor(now / b));
          const sp = U.clamp((H - 130) / 15, 4, 13), sy = 56 + sp * 3;
          const xs = HV.drawProgression(g, pad, sy, W - pad * 2, sp, chs, vs, { hl, p5: Lg('평행 5도', 'par. 5th'), p8: Lg('평행 8도', 'par. 8ve') });
          // 화음 기호와 성부별 움직임
          const ly = sy + sp * 10 + 10;
          chs.forEach((c, s) => {
            D.text(g, c.sym, xs[s], ly, { size: 12, align: 'center', color: s === hl ? C.warn : C.text });
            if (s > 0) {
              const d = vs[s].slice(1).reduce((a, m, i) => a + Math.abs(m - vs[s - 1][i + 1]), 0);
              D.text(g, `+${d}`, (xs[s - 1] + xs[s]) / 2, ly + 18, { size: 10, align: 'center', color: d > 9 ? C.a : C.good });
            }
          });
          D.text(g, Lg('위 3성부가 움직인 반음 수', 'Semitones moved by the upper 3 voices'), pad, ly + 36, { size: 10, color: C.dim });
          // 성부 범례
          const names = [Lg('베이스', 'Bass'), Lg('테너', 'Tenor'), Lg('알토', 'Alto'), Lg('소프라노', 'Soprano')], vc = ['#ff7a59', '#66d17a', '#ffcb6b', '#4fc3f7'];
          names.forEach((n, i) => { D.rect(g, pad + i * 84, 36, 10, 10, vc[i]); D.text(g, n, pad + 14 + i * 84, 35, { size: 10, color: C.dim }); });
          // 움직임 막대
          const by = ly + 54, bw = Math.min(W - pad * 2, 300);
          if (by + 30 < H) {
            D.rect(g, pad, by, bw, 12, 'rgba(255,255,255,0.06)');
            D.rect(g, pad, by, Math.min(bw, bw * stats.mv / 60), 12, col);
            D.text(g, Lg(`움직임 합 ${stats.mv}반음`, `Total motion ${stats.mv} semitones`), pad + bw + 8, by - 1, { size: 11, color: col });
          }
          ctx.stat(Lg('움직임 합 (위 3성부)', 'Total motion (upper 3)'), stats.mv + Lg('반음', ' st'));
          ctx.stat(Lg('평행 5도, 8도', 'Parallel 5ths, octaves'), stats.par);
          ctx.stat(Lg('붙잡은 공통음', 'Common tones held'), stats.hold);
          ctx.stat(Lg('도약 (4반음 초과)', 'Leaps (over 4 st)'), stats.leaps);
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
