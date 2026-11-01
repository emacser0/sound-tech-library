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

  // Krumhansl-Kessler 조성 프로파일 (장조, 단조)
  const KK_MAJ = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
  const KK_MIN = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
  const MAJ = [0, 2, 4, 5, 7, 9, 11], TRI = [['maj', 'I'], ['min', 'ii'], ['min', 'iii'], ['maj', 'IV'], ['maj', 'V'], ['min', 'vi'], ['dim', 'vii°']];
  const TARGETS = [['G', 4, 0, 7], ['D', 1, 0, 2], ['F', 3, 0, 5], ['B♭', 6, -1, 10]];
  const NN = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

  GTL.register({
    id: 'modulation',
    title: '조바꿈 (직접 전조 vs 축 화음 전조)',
    summary: '다른 조로 옮길 때 바로 새 조의 I을 치면 갑자기 장면이 바뀐 느낌이 들고, 두 조에 모두 속한 화음(축 화음)을 거치면 자연스럽게 넘어감. 아래 그래프는 조 찾기 알고리즘이 매 화음마다 판단한 조를 보여 줌.',
    views: { a: '직접 전조', b: '축 화음 전조' },
    controls: '파라미터 표에서 뷰마다 방식을 고르고, 새 조를 바꿈. "소리 켜기"를 누르면 C 장조에서 새 조로 넘어가는 악구를 반복함.',
    info: `
      <p><b>조바꿈(전조, Modulation)</b>은 곡의 으뜸음을 다른 음으로 옮기는 것. 새 조의 딸림화음 → 으뜸화음(V7 → I)이 나와야 새 조가 확정됨.</p>
      <ul>
        <li><b>직접 전조(Direct)</b>: 악구 경계에서 준비 없이 새 조로 바로 감. 팝의 마지막 후렴을 반음, 온음 올리는 "트럭 기사 전조"가 대표적. 효과는 크지만 이음매가 들림.</li>
        <li><b>축 화음 전조(Pivot chord)</b>: 두 조에 모두 있는 화음을 다리로 씀. 예: C → G에서 Am은 C의 vi이자 G의 ii. 귀는 그 화음을 옛 조로 듣다가 다음 V7 → I에서 새 조로 다시 해석함.</li>
        <li><b>가까운 조</b>: 5도권에서 이웃한 조(G, F)는 공통 화음이 많아 축 화음을 찾기 쉬움</li>
      </ul>
      <p><b>조 찾기(Krumhansl-Schmuckler)</b>: 최근 화음들의 음 높이 분포를 24개 조의 프로파일과 상관계수로 비교해 가장 비슷한 조를 고름. 게임의 적응형 음악이나 자동 반주에서 현재 조를 추정할 때 씀.</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" class="t-small t-dim">${L('축 화음: 두 조에서 서로 다른 로마 숫자를 가진 같은 화음', 'Pivot chord: the same chord with a different Roman numeral in each key')}</text>
      <text x="10" y="56" class="t-a">C:</text><text x="10" y="106" class="t-b">G:</text>
      ${['I', 'IV', 'V', 'I', 'vi'].map((r, i) => `<text x="${60 + i * 70}" y="56" text-anchor="middle" class="t-mono">${r}</text>`).join('')}
      ${['ii', 'V7', 'I'].map((r, i) => `<text x="${340 + i * 70}" y="106" text-anchor="middle" class="t-mono">${r}</text>`).join('')}
      <rect x="315" y="36" width="50" height="80" rx="6" class="f-accent" opacity="0.25"/>
      <text x="340" y="132" text-anchor="middle" class="t-small">Am</text>
      <text x="340" y="152" text-anchor="middle" class="t-small t-dim">${L('축 화음', 'pivot')}</text>
      <text x="480" y="132" text-anchor="middle" class="t-small t-dim">${L('V7 → I로 새 조 확정', 'V7 → I confirms the new key')}</text>
    </svg>`,
    look: [
      '그래프 아래 1위 조 글자를 보면 A는 6번째 화음부터 C와 G 사이를 오락가락하고, B는 V7에서 G로 바뀐 뒤 그대로 유지됨',
      '"소리 켜기"를 누르고 A를 들으면 6번째 화음에서 장면이 갑자기 바뀌는 느낌. B는 바뀐 순간을 짚기 어려움.',
      '새 조를 D로 바꾸면 축 화음이 Em(C의 iii = D의 ii)으로 바뀜',
      '새 조를 B♭으로 바꾸면 축 화음이 Dm(C의 ii = B♭의 iii)이 됨. 조 찾기 기억(감쇠)을 올리면 곡선이 새 조를 더 천천히 따라감.',
    ],
    refs: [
      { type: 'book', title: 'Carol L. Krumhansl, Cognitive Foundations of Musical Pitch', year: 1990, note: '조성 프로파일과 조 찾기 알고리즘' },
      { type: 'book', title: 'David Temperley, The Cognition of Basic Musical Structures', year: 2001, note: '조 찾기 알고리즘의 개선과 평가' },
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '축 화음 전조' },
      { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '게임 음악의 전환 기법' },
    ],
    params: [
      { key: 'method', label: '방식', type: 'select', options: [{ value: 'direct', label: '직접 전조' }, { value: 'pivot', label: '축 화음 전조' }], a: 'direct', b: 'pivot', group: '조바꿈' },
      { key: 'target', label: '새 조', type: 'select', options: TARGETS.map((t, i) => ({ value: i, label: t[0] + ' 장조' })), default: 0, shared: true, group: '조바꿈' },
      { key: 'decay', label: '조 찾기 기억 (감쇠)', type: 'range', min: 0.2, max: 0.9, step: 0.05, default: 0.6, shared: true, group: '조 찾기', help: '이전 화음을 얼마나 오래 기억하는지. 클수록 판단이 느리게 바뀜' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 40, max: 160, default: 88, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Modulation (Direct vs Pivot Chord)',
      summary: 'Jumping straight to the new key\'s I feels like a sudden scene change. Passing through a chord that belongs to both keys (a pivot chord) moves over smoothly. The graph below shows the key a key-finding algorithm picks at each chord.',
      views: { a: 'Direct modulation', b: 'Pivot chord modulation' },
      controls: 'Pick a method for each view and change the new key in the parameter table. Press "Sound on" to hear a phrase move from C major to the new key.',
      info: `
      <p><b>Modulation</b> moves the tonic of a piece to another note. The new key is confirmed when its dominant resolves to its tonic (V7 → I).</p>
      <ul>
        <li><b>Direct modulation</b>: jumps into the new key at a phrase boundary with no preparation. The pop "truck driver" key change that lifts the last chorus by a semitone or tone is a famous example. Strong effect, but you hear the seam.</li>
        <li><b>Pivot chord modulation</b>: uses a chord found in both keys as a bridge. From C to G, Am is vi in C and ii in G. The ear hears it in the old key, then reinterprets it when V7 → I arrives in the new key.</li>
        <li><b>Close keys</b>: neighbors on the circle of fifths (G, F) share many chords, so a pivot is easy to find.</li>
      </ul>
      <p><b>Key finding (Krumhansl-Schmuckler)</b>: compares the pitch distribution of recent chords with the profiles of all 24 keys using correlation, and picks the closest. Adaptive game music and automatic accompaniment use this to estimate the current key.</p>`,
      look: [
        'Look at the top-key letters under the graph. From chord 6, A flips back and forth between C and G. B switches to G at V7 and stays there.',
        'Press "Sound on" and listen to A. At chord 6 the scene changes suddenly. In B it is hard to point to the moment of change.',
        'Change the new key to D. The pivot becomes Em (iii in C = ii in D).',
        'Change the new key to B♭. The pivot becomes Dm (ii in C = iii in B♭). Raise the key-finder memory and the curves follow the new key more slowly.',
      ],
      refs: ['Key profiles and the key-finding algorithm.', 'Improvements and evaluation of key finding.', 'Pivot chord modulation.', 'Transition techniques in game music.'],
      params: {
        method: { label: 'Method', group: 'Modulation', options: { direct: 'Direct modulation', pivot: 'Pivot chord modulation' } },
        target: { label: 'New key', group: 'Modulation', options: Object.fromEntries(TARGETS.map((t, i) => [i, t[0] + ' major'])) },
        decay: { label: 'Key-finder memory (decay)', group: 'Key finding', help: 'How long earlier chords are remembered. Larger values change the decision more slowly.' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      const home = { l: 0, a: 0 };
      const rnIn = (ch, keyPc) => {
        const tones = HV.tones(ch), d = ((tones[0].pc - keyPc) % 12 + 12) % 12, i = MAJ.indexOf(d);
        if (i < 0 || TRI[i][0] !== (ch.qual === 'dom7' ? 'maj' : ch.qual)) return null;
        return ch.qual === 'dom7' ? (i === 4 ? 'V7' : null) : TRI[i][1];
      };
      let ck = '', chs = [], vs = [], corr = [], best = [], tPc = 7, pivotIdx = -1;
      function plan() {
        const k = `${P.method}|${P.target}|${P.decay}`;
        if (k === ck) return;
        ck = k;
        const t = TARGETS[+P.target] || TARGETS[0], tk = { l: t[1], a: t[2] };
        tPc = t[3];
        const hc = (gen, q) => HV.chord(home, gen, MAJ[gen], q), tc = (gen, q) => HV.chord(tk, gen, MAJ[gen], q);
        const first = [hc(0, 'maj'), hc(5, 'min'), hc(3, 'maj'), hc(4, 'maj'), hc(0, 'maj')];
        pivotIdx = -1;
        if (P.method === 'direct') chs = [...first, tc(0, 'maj'), tc(3, 'maj'), tc(4, 'dom7'), tc(0, 'maj')];
        else {
          // 축 화음: 두 조에 모두 있는 3화음. 새 조의 ii, IV, vi 순으로 고름
          let piv = null;
          for (const gen of [1, 3, 5, 2]) { const c = tc(gen, TRI[gen][0]); if (rnIn(c, 0)) { piv = c; break; } }
          if (!piv) piv = tc(3, 'maj');
          chs = [...first, piv, tc(4, 'dom7'), tc(0, 'maj'), tc(0, 'maj')];
          pivotIdx = 5;
        }
        vs = HV.smooth(chs);
        // 조 찾기: 감쇠 누적 음 분포와 24개 조 프로파일의 상관계수
        const prof = [];
        for (let r = 0; r < 12; r++) { prof.push({ pc: r, min: false, p: KK_MAJ.map((_, i) => KK_MAJ[(i - r + 12) % 12]) }); prof.push({ pc: r, min: true, p: KK_MIN.map((_, i) => KK_MIN[(i - r + 12) % 12]) }); }
        const pear = (x, y) => { let mx = 0, my = 0; for (let i = 0; i < 12; i++) { mx += x[i] / 12; my += y[i] / 12; } let sxy = 0, sx = 0, sy = 0; for (let i = 0; i < 12; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sx += a * a; sy += b * b; } return sxy / Math.sqrt(Math.max(1e-9, sx * sy)); };
        const h = new Array(12).fill(0);
        corr = []; best = [];
        vs.forEach((v) => {
          for (let i = 0; i < 12; i++) h[i] *= P.decay;
          v.forEach((m, i) => { h[m % 12] += i === 0 ? 1.5 : 1; });
          corr.push({ home: pear(h, prof[0].p), tgt: pear(h, prof[tPc * 2].p) });
          let bi = 0, bv = -2;
          prof.forEach((p, i) => { const c = pear(h, p.p); if (c > bv) { bv = c; bi = i; } });
          best.push(prof[bi]);
        });
      }
      const song = () => {
        plan();
        const b = 60 / P.bpm * 2, notes = [];
        vs.forEach((v, s) => { const d = s === vs.length - 1 ? b * 1.6 : b * 0.95; v.forEach((m, i) => notes.push({ t: s * b, d, m, v: i === 0 ? 0.9 : 0.75 })); });
        return { key: `${P.method}|${P.target}|${P.bpm}`, notes, len: (vs.length + 2) * b, poly: 4 };
      };
      const snd = K.synth(ctx, song, { decay: 0.45, harm: [1, 0.4, 0.22, 0.12, 0.06] });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, n = vs.length;
          const b = 60 / P.bpm * 2, hl = Math.min(n - 1, Math.floor(now / b));
          const sp = U.clamp((H - 220) / 12, 3.5, 9), sy = 40 + sp * 3;
          const xs = HV.drawProgression(g, pad, sy, W - pad * 2, sp, chs, vs, { hl, p5: Lg('평행 5도', 'par. 5th'), p8: Lg('평행 8도', 'par. 8ve') });
          // 두 조의 로마 숫자 줄
          const ly = sy + sp * 10 + 8;
          D.text(g, 'C:', pad, ly, { size: 11, color: C.a });
          D.text(g, NN[tPc] + ':', pad, ly + 16, { size: 11, color: C.b });
          chs.forEach((c, s) => {
            const r1 = rnIn(c, 0), r2 = rnIn(c, tPc);
            const inHome = P.method === 'direct' ? s < 5 : s <= pivotIdx, inT = P.method === 'direct' ? s >= 5 : s >= pivotIdx;
            if (s === pivotIdx) D.rect(g, xs[s] - 22, ly - 3, 44, 34, 'rgba(199,146,234,0.25)');
            if (inHome && r1) D.text(g, r1, xs[s], ly, { size: 11, align: 'center', color: s === hl ? C.warn : C.text });
            if (inT && r2) D.text(g, r2, xs[s], ly + 16, { size: 11, align: 'center', color: s === hl ? C.warn : C.text });
            D.text(g, c.sym, xs[s], ly + 32, { size: 9, align: 'center', color: C.dim });
          });
          // 조 찾기 그래프
          const gy = ly + 50, gh = H - gy - pad - 14;
          if (gh > 40) {
            D.rect(g, pad, gy, W - pad * 2, gh, 'rgba(0,0,0,0.3)');
            const yv = (c) => gy + gh - U.clamp((c + 0.2) / 1.2, 0, 1) * gh;
            [0, 0.5, 1].forEach((v) => { D.line(g, pad, yv(v), W - pad, yv(v), C.grid, 1); D.text(g, v.toFixed(1), pad + 2, yv(v) - 10, { size: 9, color: C.dim }); });
            const line = (key, color) => { g.beginPath(); corr.forEach((c, s) => { const x = xs[s], y = yv(c[key]); s ? g.lineTo(x, y) : g.moveTo(x, y); }); g.strokeStyle = color; g.lineWidth = 2; g.stroke(); corr.forEach((c, s) => D.circle(g, xs[s], yv(c[key]), 3, color)); };
            line('home', C.a); line('tgt', C.b);
            D.line(g, xs[hl], gy, xs[hl], gy + gh, 'rgba(255,203,107,0.5)', 1);
            best.forEach((p, s) => D.text(g, NN[p.pc] + (p.min ? 'm' : ''), xs[s], gy + gh + 2, { size: 10, align: 'center', color: p.pc === tPc && !p.min ? C.b : p.pc === 0 && !p.min ? C.a : C.warn }));
            D.text(g, Lg(`조 찾기 상관계수: 주황 = C 장조, 파랑 = ${NN[tPc]} 장조. 아래 글자 = 1위 조`, `Key-finding correlation: orange = C major, blue = ${NN[tPc]} major. Letters below = top key`), pad + 30, gy + 3, { size: 9, color: C.dim });
          }
          // 측정값: 새 조가 1위가 된 첫 화음, 두 조 차이가 작은 화음 수
          const first = best.findIndex((p, s) => s >= 5 && p.pc === tPc && !p.min);
          let flips = 0;
          for (let s = 5; s < best.length; s++) if (best[s] !== best[s - 1]) flips++;
          ctx.stat(Lg('새 조로 판단된 화음', 'First chord judged new key'), first >= 0 ? `#${first + 1}` : '-');
          ctx.stat(Lg('전조 뒤 1위 조가 바뀐 횟수', 'Top-key changes after the switch'), flips);
          ctx.stat(Lg('축 화음', 'Pivot chord'), pivotIdx >= 0 ? `${chs[pivotIdx].sym} (C: ${rnIn(chs[pivotIdx], 0)}, ${NN[tPc]}: ${rnIn(chs[pivotIdx], tPc)})` : Lg('없음', 'None'));
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
