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

  // 화음: [단계, 반음, 성질, 로마 숫자, 소프라노 고정(으뜸음에서 반음, 선택)]
  const I = [0, 0, 'maj', 'I'], vi = [5, 9, 'min', 'vi'], ii = [1, 2, 'min', 'ii'], IV = [3, 5, 'maj', 'IV'], V = [4, 7, 'maj', 'V'], V7 = [4, 7, 'dom7', 'V7'];
  const CAD = {
    pac: { ko: '정격 종지 (완전)', en: 'Perfect authentic cadence', c: [I, vi, ii, V7, [...I, 0]], end: 'V → I' },
    iac: { ko: '정격 종지 (불완전)', en: 'Imperfect authentic cadence', c: [I, vi, ii, V, [...I, 4]], end: 'V → I' },
    half: { ko: '반종지', en: 'Half cadence', c: [I, vi, IV, ii, V], end: '… → V' },
    plagal: { ko: '변격 종지 (아멘 종지)', en: 'Plagal cadence ("Amen")', c: [I, V, I, IV, [...I, 0]], end: 'IV → I' },
    deceptive: { ko: '거짓 종지', en: 'Deceptive cadence', c: [I, vi, ii, V7, vi], end: 'V → vi' },
  };
  const KEYS = [['C', 0, 0], ['D', 1, 0], ['E♭', 2, -1], ['F', 3, 0], ['G', 4, 0], ['A', 5, 0], ['B♭', 6, -1]];

  GTL.register({
    id: 'cadences',
    title: '종지 (정격, 반, 변격, 거짓 종지)',
    summary: '악구 끝의 화음 두 개가 끝맺음의 강도를 정함. V → I는 문장을 마침표로 닫고, V에서 멈추면 쉼표, V → vi는 마침표를 기대하게 한 뒤 비켜 감.',
    views: { a: '정격 종지 (완전)', b: '거짓 종지' },
    controls: '파라미터 표에서 뷰마다 종지를 고름. "소리 켜기"를 누르면 같은 악구를 다른 종지로 끝냄.',
    info: `
      <p><b>종지(Cadence)</b>는 악구(Phrase)를 끝맺는 화음 진행. 문장의 문장부호처럼 음악의 구조를 만듦.</p>
      <ul>
        <li><b>정격 종지(Authentic)</b>: V(또는 V7) → I. 베이스가 5 → 1로 가고 소프라노가 으뜸음에 닿으면 완전 정격 종지(PAC). 가장 강한 끝맺음.</li>
        <li><b>불완전 정격 종지(IAC)</b>: V → I이지만 소프라노가 3음이나 5음에서 끝남. 끝났지만 덜 단단함.</li>
        <li><b>반종지(Half)</b>: V에서 멈춤. 질문처럼 다음 악구를 기다리게 함.</li>
        <li><b>변격 종지(Plagal)</b>: IV → I. 찬송가 끝의 "아멘". 정격 종지 뒤에 덧붙이는 경우가 많음.</li>
        <li><b>거짓 종지(Deceptive)</b>: V → vi. I을 기대하게 한 뒤 비켜 가서 악구를 늘림.</li>
      </ul>
      <p>게임과 영상 음악에서는 장면 전환 시점에 맞춰 반종지로 긴장을 남기거나, 정격 종지로 확실히 닫는 식으로 씀</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" class="t-small t-dim">${L('끝맺음의 강도 (문장부호에 비유)', 'Strength of the ending (like punctuation)')}</text>
      <line x1="30" y1="70" x2="510" y2="70" class="d-dim"/>
      <circle cx="60" cy="70" r="7" class="f-dim"/><text x="60" y="50" text-anchor="middle" class="t-small">${L('반종지', 'Half')}</text><text x="60" y="96" text-anchor="middle" class="t-mono t-small">? → V</text><text x="60" y="114" text-anchor="middle" class="t-small t-dim">${L('쉼표, 물음표', 'comma, question')}</text>
      <circle cx="180" cy="70" r="7" class="f-b"/><text x="180" y="50" text-anchor="middle" class="t-small t-b">${L('거짓 종지', 'Deceptive')}</text><text x="180" y="96" text-anchor="middle" class="t-mono t-small">V → vi</text><text x="180" y="114" text-anchor="middle" class="t-small t-dim">${L('말을 돌림', 'a twist')}</text>
      <circle cx="300" cy="70" r="7" class="f-accent"/><text x="300" y="50" text-anchor="middle" class="t-small">${L('변격', 'Plagal')}</text><text x="300" y="96" text-anchor="middle" class="t-mono t-small">IV → I</text><text x="300" y="114" text-anchor="middle" class="t-small t-dim">${L('덧붙인 맺음', 'an added close')}</text>
      <circle cx="400" cy="70" r="7" class="f-good"/><text x="400" y="50" text-anchor="middle" class="t-small">IAC</text><text x="400" y="96" text-anchor="middle" class="t-mono t-small">V → I</text>
      <circle cx="490" cy="70" r="7" class="f-a"/><text x="490" y="50" text-anchor="middle" class="t-small t-a">PAC</text><text x="490" y="96" text-anchor="middle" class="t-mono t-small">V → I</text><text x="490" y="114" text-anchor="middle" class="t-small t-dim">${L('마침표', 'full stop')}</text>
      <text x="270" y="148" text-anchor="middle" class="t-small t-dim">${L('왼쪽일수록 열린 끝, 오른쪽일수록 닫힌 끝', 'Further left = more open, further right = more closed')}</text>
    </svg>`,
    look: [
      '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 마지막 화음에서만 차이가 남. B는 끝나지 않은 느낌.',
      '오른쪽 점검표에서 A는 네 항목이 모두 맞고, B는 "마지막 화음 = I"이 틀림',
      'B를 불완전 정격 종지로 바꾸면 소프라노가 으뜸음이 아닌 3음(E)에서 끝남',
      'B를 반종지로 바꾸면 마지막 화음이 V. 다음 악구가 이어져야 할 것처럼 들림.',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '종지의 종류와 성부 진행' },
      { type: 'book', title: 'William E. Caplin, Classical Form', year: 1998, note: '고전 형식에서 종지의 역할' },
      { type: 'book', title: 'Stefan Kostka, Dorothy Payne, Tonal Harmony', note: 'PAC, IAC, 반종지, 거짓 종지 정의' },
      { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '게임 음악의 전환과 끝맺음' },
    ],
    params: [
      { key: 'cad', label: '종지', type: 'select', options: Object.entries(CAD).map(([k, v]) => ({ value: k, label: v.ko })), a: 'pac', b: 'deceptive', group: '종지' },
      { key: 'key', label: '조', type: 'select', options: KEYS.map((k, i) => ({ value: i, label: k[0] })), default: 0, shared: true, group: '종지' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 40, max: 160, default: 84, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Cadences (Authentic, Half, Plagal, Deceptive)',
      summary: 'The last two chords of a phrase set how strongly it ends. V → I closes with a full stop, stopping on V is a comma, and V → vi sets up a full stop and then sidesteps it.',
      views: { a: 'Perfect authentic', b: 'Deceptive' },
      controls: 'Pick a cadence for each view in the parameter table. Press "Sound on" to hear the same phrase end in different ways.',
      info: `
      <p>A <b>cadence</b> is the chord progression that ends a phrase. Like punctuation in a sentence, it builds the structure of the music.</p>
      <ul>
        <li><b>Authentic</b>: V (or V7) → I. If the bass goes 5 → 1 and the soprano lands on the tonic, it is a perfect authentic cadence (PAC), the strongest ending.</li>
        <li><b>Imperfect authentic (IAC)</b>: V → I, but the soprano ends on the 3rd or 5th. It ends, but less firmly.</li>
        <li><b>Half</b>: stops on V. Like a question, it waits for the next phrase.</li>
        <li><b>Plagal</b>: IV → I. The "Amen" at the end of hymns. Often added after an authentic cadence.</li>
        <li><b>Deceptive</b>: V → vi. It sets up I and then sidesteps it, which extends the phrase.</li>
      </ul>
      <p>In game and film music, a half cadence can leave tension at a scene change, and an authentic cadence closes it for sure.</p>`,
      look: [
        'Press "Sound on" and switch between A and B. Only the last chord differs. B does not feel finished.',
        'In the checklist on the right, A passes all four items. B fails "Last chord = I".',
        'Switch B to imperfect authentic. The soprano ends on the 3rd (E), not the tonic.',
        'Switch B to half cadence. The last chord is V, and it sounds like another phrase must follow.',
      ],
      refs: ['Types of cadences and their voice leading.', 'The role of cadences in classical form.', 'Definitions of PAC, IAC, half and deceptive cadences.', 'Transitions and endings in game music.'],
      params: {
        cad: { label: 'Cadence', group: 'Cadence', options: Object.fromEntries(Object.entries(CAD).map(([k, v]) => [k, v.en])) },
        key: { label: 'Key', group: 'Cadence' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      let ck = '', cd = null, chs = [], vs = [], tonicPc = 0;
      function plan() {
        const k = `${P.cad}|${P.key}`;
        if (k === ck) return;
        ck = k;
        cd = CAD[P.cad] || CAD.pac;
        const kk = KEYS[+P.key] || KEYS[0], tonic = { l: kk[1], a: kk[2] };
        tonicPc = ((K.midi({ l: kk[1], a: kk[2], o: 4 }) % 12) + 12) % 12;
        chs = cd.c.map(([gen, semi, q, rn, sop]) => { const ch = HV.chord(tonic, gen, semi, q); ch.rn = rn; if (sop != null) ch.sop = (tonicPc + sop) % 12; return ch; });
        vs = HV.smooth(chs);
      }
      const song = () => {
        plan();
        const b = 60 / P.bpm * 2, notes = [];
        vs.forEach((v, s) => { const d = s === vs.length - 1 ? b * 2 : b * 0.95; v.forEach((m, i) => notes.push({ t: s * b, d, m, v: i === 0 ? 0.9 : 0.75 })); });
        return { key: ck + P.bpm, notes, len: (vs.length + 2.6) * b, poly: 4 };
      };
      const snd = K.synth(ctx, song, { decay: 0.45, harm: [1, 0.4, 0.22, 0.12, 0.06] });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
          const b = 60 / P.bpm * 2, hl = Math.min(vs.length - 1, Math.floor(now / b));
          const sw = Math.max(200, W * 0.66), sp = U.clamp((H - 120) / 15, 4, 12), sy = 46 + sp * 3;
          const xs = HV.drawProgression(g, pad, sy, sw, sp, chs, vs, { hl, p5: Lg('평행 5도', 'par. 5th'), p8: Lg('평행 8도', 'par. 8ve') });
          const ly = sy + sp * 10 + 10;
          chs.forEach((c, s) => {
            D.text(g, c.rn, xs[s], ly, { size: 14, align: 'center', color: s === hl ? C.warn : C.text });
            D.text(g, c.sym, xs[s], ly + 18, { size: 10, align: 'center', color: C.dim });
          });
          // 종지 괄호 (마지막 두 화음)
          const n = xs.length, bx0 = xs[n - 2] - 14, bx1 = xs[n - 1] + 14, by = ly + 36;
          D.line(g, bx0, by, bx1, by, col, 2); D.line(g, bx0, by - 6, bx0, by, col, 2); D.line(g, bx1, by - 6, bx1, by, col, 2);
          D.text(g, Lg(cd.ko, cd.en), (bx0 + bx1) / 2, by + 6, { size: 12, align: 'center', color: col });
          // 점검표
          const last = vs[n - 1], prev = vs[n - 2], lastRoot = HV.tones(chs[n - 1])[0].pc, prevRoot = HV.tones(chs[n - 2])[0].pc;
          const checks = [
            [Lg('마지막 화음 = I', 'Last chord = I'), lastRoot === tonicPc],
            [Lg('그 앞 화음 = V', 'Chord before = V'), prevRoot === (tonicPc + 7) % 12],
            [Lg('베이스 5 → 1', 'Bass 5 → 1'), prev[0] % 12 === (tonicPc + 7) % 12 && last[0] % 12 === tonicPc],
            [Lg('소프라노 = 으뜸음', 'Soprano = tonic'), last[3] % 12 === tonicPc],
          ];
          const cx = pad + sw + 18;
          if (W - cx > 90) {
            D.text(g, Lg('끝맺음 점검', 'Ending checklist'), cx, sy - sp, { size: 11, color: C.dim });
            checks.forEach(([t, ok], i) => {
              D.text(g, ok ? '✓' : '✗', cx, sy + sp + i * 22, { size: 14, color: ok ? C.good : C.bad });
              D.text(g, t, cx + 18, sy + sp + 2 + i * 22, { size: 11, color: C.text });
            });
            const score = checks.filter((c) => c[1]).length;
            D.text(g, Lg(`닫힌 정도 ${score} / 4`, `Closure ${score} / 4`), cx, sy + sp + 4 * 22 + 8, { size: 13, color: col });
          }
          ctx.stat(Lg('종지', 'Cadence'), `${Lg(cd.ko, cd.en)} (${cd.end})`);
          ctx.stat(Lg('마지막 소프라노', 'Final soprano'), K.name(HV.spell(chs[n - 1], last[3]), 1));
          ctx.stat(Lg('점검 통과', 'Checks passed'), `${checks.filter((c) => c[1]).length} / 4`);
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
