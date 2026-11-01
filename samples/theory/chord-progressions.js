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

  // 진행: [단계, 반음, 성질, 로마 숫자] (C 장조 기준 단계)
  const R = (gen, semi, q, rn) => [gen, semi, q, rn];
  const PROG = {
    pop: { ko: 'I V vi IV (팝 진행)', en: 'I V vi IV (pop)', c: [R(0, 0, 'maj', 'I'), R(4, 7, 'maj', 'V'), R(5, 9, 'min', 'vi'), R(3, 5, 'maj', 'IV')] },
    fifties: { ko: 'I vi IV V (50년대 진행)', en: 'I vi IV V (50s)', c: [R(0, 0, 'maj', 'I'), R(5, 9, 'min', 'vi'), R(3, 5, 'maj', 'IV'), R(4, 7, 'maj', 'V')] },
    jazz: { ko: 'ii7 V7 Imaj7 (투 파이브 원)', en: 'ii7 V7 Imaj7 (two-five-one)', c: [R(1, 2, 'min7', 'ii7'), R(4, 7, 'dom7', 'V7'), R(0, 0, 'maj7', 'Imaj7'), R(0, 0, 'maj7', 'Imaj7')] },
    circle: { ko: 'vi ii V I (5도 순환)', en: 'vi ii V I (circle)', c: [R(5, 9, 'min7', 'vi7'), R(1, 2, 'min7', 'ii7'), R(4, 7, 'dom7', 'V7'), R(0, 0, 'maj7', 'Imaj7')] },
    royal: { ko: 'IVmaj7 V7 iii7 vi (왕도 진행)', en: 'IVmaj7 V7 iii7 vi (royal road)', c: [R(3, 5, 'maj7', 'IVmaj7'), R(4, 7, 'dom7', 'V7'), R(2, 4, 'min7', 'iii7'), R(5, 9, 'min', 'vi')] },
    canon: { ko: 'I V vi iii IV I IV V (캐논 진행)', en: 'I V vi iii IV I IV V (canon)', c: [R(0, 0, 'maj', 'I'), R(4, 7, 'maj', 'V'), R(5, 9, 'min', 'vi'), R(2, 4, 'min', 'iii'), R(3, 5, 'maj', 'IV'), R(0, 0, 'maj', 'I'), R(3, 5, 'maj', 'IV'), R(4, 7, 'maj', 'V')] },
    blues: { ko: '12마디 블루스', en: '12-bar blues', c: [R(0, 0, 'dom7', 'I7'), R(0, 0, 'dom7', 'I7'), R(0, 0, 'dom7', 'I7'), R(0, 0, 'dom7', 'I7'), R(3, 5, 'dom7', 'IV7'), R(3, 5, 'dom7', 'IV7'), R(0, 0, 'dom7', 'I7'), R(0, 0, 'dom7', 'I7'), R(4, 7, 'dom7', 'V7'), R(3, 5, 'dom7', 'IV7'), R(0, 0, 'dom7', 'I7'), R(4, 7, 'dom7', 'V7')] },
    andalusian: { ko: 'i VII VI V (안달루시아 진행, a 단조)', en: 'i VII VI V (Andalusian, A minor)', c: [R(5, 9, 'min', 'i'), R(4, 7, 'maj', 'VII'), R(3, 5, 'maj', 'VI'), R(2, 4, 'maj', 'V')] },
  };
  const KEYS = [['C', 0, 0], ['D', 1, 0], ['E♭', 2, -1], ['F', 3, 0], ['G', 4, 0], ['A', 5, 0], ['B♭', 6, -1]];
  // 근음 이동 분류 (반음 수 mod 12)
  const MOT = (d) => (d === 5 ? 'down5' : d === 7 ? 'up5' : [3, 4, 8, 9].includes(d) ? 'third' : [1, 2, 10, 11].includes(d) ? 'step' : d === 0 ? 'same' : 'tritone');
  const MOTL = { down5: ['5도 아래', 'down a 5th'], up5: ['5도 위', 'up a 5th'], third: ['3도', '3rd'], step: ['2도', 'step'], same: ['유지', 'same'], tritone: ['증4도', 'tritone'] };
  const MOTC = { down5: '#66d17a', up5: '#ffcb6b', third: '#c792ea', step: '#ff7a59', same: '#7d8594', tritone: '#ff5370' };

  GTL.register({
    id: 'chord-progressions',
    title: '자주 쓰는 화음 진행과 근음 이동',
    summary: '유명한 진행들을 근음이 어떻게 움직이는지로 비교함. 투 파이브 원과 5도 순환은 근음이 계속 5도 아래로 내려가서 앞으로 끌려가는 힘이 강하고, 팝 진행은 5도, 3도, 2도 이동을 섞어 순환하는 느낌을 만듦.',
    views: { a: 'I V vi IV (팝 진행)', b: 'ii7 V7 Imaj7' },
    controls: '파라미터 표에서 뷰마다 진행을 고름. "소리 켜기"를 누르면 진행을 반복함.',
    info: `
      <p><b>화음 진행(Chord progression)</b>은 화음이 이어지는 순서. 같은 진행이 수많은 곡에 되풀이되어 쓰여서, 로마 숫자로 외워 두면 어떤 조에서도 바로 쓸 수 있음.</p>
      <ul>
        <li><b>5도 아래(4도 위) 이동</b>: V → I처럼 가장 강한 진행. ii → V → I은 이 이동을 두 번 이어 붙임. 재즈 스탠더드의 뼈대.</li>
        <li><b>3도 이동</b>: I → vi처럼 공통음 2개를 공유. 색깔만 살짝 바뀜.</li>
        <li><b>2도 이동</b>: IV → V처럼 공통음이 없어서 성부가 반대 방향으로 움직여야 함. 신선하지만 끌림은 약함.</li>
        <li><b>5도 위 이동</b>: I → V. 진행이 거꾸로 가는 느낌이라 팝에서는 순환하는 분위기를 만듦.</li>
      </ul>
      <p>12마디 블루스는 I, IV, V의 7화음만 쓰고, 안달루시아 진행은 단조에서 베이스가 A G F E로 한 계단씩 내려감</p>`,
    diagram: (L) => {
      const order = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
      const pt = (i, r) => [140 + r * Math.sin(i / 12 * Math.PI * 2), 104 - r * Math.cos(i / 12 * Math.PI * 2)];
      const dots = order.map((n, i) => { const [x, y] = pt(i, 78); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" class="f-dim"/><text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" class="t-small">${n}</text>`; }).join('');
      const arc = (a, b) => { const [x1, y1] = pt(a, 62), [x2, y2] = pt(b, 62); return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} Q140,104 ${x2.toFixed(1)},${y2.toFixed(1)}" class="d-good" marker-end="url(#arr)"/>`; };
      return `<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg">
        <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
        ${dots}${arc(3, 2)}${arc(2, 1)}${arc(1, 0)}
        <text x="270" y="40" class="t-small">${L('5도권에서 반시계 방향 한 칸 = 근음이 5도 아래로', 'One step counterclockwise = root down a 5th')}</text>
        <text x="270" y="64" class="t-small t-dim">${L('ii7 V7 Imaj7 (C 장조): D → G → C', 'ii7 V7 Imaj7 (C major): D → G → C')}</text>
        <text x="270" y="88" class="t-small t-dim">${L('vi ii V I: A → D → G → C (세 번 연속)', 'vi ii V I: A → D → G → C (three in a row)')}</text>
        <text x="270" y="124" class="t-small">${L('근음 이동의 종류', 'Kinds of root motion')}</text>
        <text x="270" y="146" class="t-small t-dim">${L('5도 아래: 강함, 앞으로 끌림', 'Down a 5th: strong, pulls forward')}</text>
        <text x="270" y="166" class="t-small t-dim">${L('3도: 공통음 2개, 부드러움', '3rd: 2 common tones, soft')}</text>
        <text x="270" y="186" class="t-small t-dim">${L('2도: 공통음 없음, 신선함', 'Step: no common tones, fresh')}</text>
      </svg>`;
    },
    look: [
      '기본 상태에서 B의 오른쪽 원에는 초록 화살표(5도 아래)가 이어지고 처음으로 돌아가는 화살표만 다른 색. A는 여러 색이 섞임.',
      '"5도 아래 이동 비율" 측정값이 A는 0%, B는 67%. 처음으로 돌아가는 이동까지 셈.',
      'A를 12마디 블루스로 바꾸면 피아노 롤에 I7이 네 마디 이어지고 IV7, V7이 나옴. "소리 켜기"로 들으면 익숙한 블루스 형태.',
      'B를 안달루시아 진행으로 바꾸면 베이스가 한 계단씩 내려가는 2도 이동(주황)이 이어짐',
    ],
    refs: [
      { type: 'book', title: 'Walter Piston, Harmony (5th ed., rev. DeVoto)', year: 1987, note: '근음 이동에 따른 진행의 경향표' },
      { type: 'book', title: 'Mark Levine, The Jazz Theory Book', year: 1995, note: 'ii-V-I과 5도 순환' },
      { type: 'paper', title: 'Trevor de Clercq, David Temperley, "A corpus analysis of rock harmony", Popular Music 30(1)', year: 2011, note: '록, 팝 화음 진행의 통계' },
      { type: 'book', title: 'Dmitri Tymoczko, A Geometry of Music', year: 2011, note: '근음 이동과 성부 진행' },
    ],
    params: [
      { key: 'prog', label: '진행', type: 'select', options: Object.entries(PROG).map(([k, v]) => ({ value: k, label: v.ko })), a: 'pop', b: 'jazz', group: '진행' },
      { key: 'key', label: '조', type: 'select', options: KEYS.map((k, i) => ({ value: i, label: k[0] })), default: 0, shared: true, group: '진행' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 60, max: 180, default: 100, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Common Chord Progressions and Root Motion',
      summary: 'Compares well-known progressions by how their roots move. Two-five-one and the circle progression keep falling by 5ths and pull forward hard. The pop progression mixes 5th, 3rd and step motion and feels like a loop.',
      views: { a: 'I V vi IV (pop)', b: 'ii7 V7 Imaj7' },
      controls: 'Pick a progression for each view in the parameter table. Press "Sound on" to hear it loop.',
      info: `
      <p>A <b>chord progression</b> is the order in which chords follow each other. The same progressions appear in countless songs, so learning them as Roman numerals lets you use them in any key.</p>
      <ul>
        <li><b>Down a 5th (up a 4th)</b>: the strongest motion, like V → I. ii → V → I chains it twice. It is the backbone of jazz standards.</li>
        <li><b>By a 3rd</b>: like I → vi. Two common tones, so only the color changes a little.</li>
        <li><b>By a step</b>: like IV → V. No common tones, so voices must move in contrary motion. Fresh, but a weaker pull.</li>
        <li><b>Up a 5th</b>: I → V. It feels like moving backward, which gives pop songs a looping mood.</li>
      </ul>
      <p>The 12-bar blues uses only I, IV and V 7th chords. The Andalusian progression walks the bass down A G F E in minor.</p>`,
      look: [
        'By default, the circle on the right of B shows a chain of green arrows (down a 5th), and only the arrow back to the start has another color. A mixes several colors.',
        'The "Down-a-5th ratio" stat is 0% in A and 67% in B. The move back to the start is counted too.',
        'Switch A to the 12-bar blues. The piano roll shows four bars of I7, then IV7 and V7. With "Sound on" you hear the familiar blues form.',
        'Switch B to the Andalusian progression. The bass walks down step by step (orange).',
      ],
      refs: ['Table of progression tendencies by root motion.', 'ii-V-I and the circle of 5ths.', 'Statistics of rock and pop chord progressions.', 'Root motion and voice leading.'],
      params: {
        prog: { label: 'Progression', group: 'Progression', options: Object.fromEntries(Object.entries(PROG).map(([k, v]) => [k, v.en])) },
        key: { label: 'Key', group: 'Progression' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      let ck = '', pr = null, chs = [], vs = [], mots = [];
      function plan() {
        const k = `${P.prog}|${P.key}`;
        if (k === ck) return;
        ck = k;
        pr = PROG[P.prog] || PROG.pop;
        const kk = KEYS[+P.key] || KEYS[0], tonic = { l: kk[1], a: kk[2] };
        chs = pr.c.map(([gen, semi, q, rn]) => { const ch = HV.chord(tonic, gen, semi, q); ch.rn = rn; ch.rootPc = HV.tones(ch)[0].pc; return ch; });
        vs = HV.smooth(chs);
        mots = chs.map((c, i) => MOT(((chs[(i + 1) % chs.length].rootPc - c.rootPc) % 12 + 12) % 12));
      }
      const bar = () => 60 / P.bpm * 4;
      const song = () => {
        plan();
        const b = bar(), notes = [];
        vs.forEach((v, s) => {
          notes.push({ t: s * b, d: b * 0.45, m: v[0], v: 1 }, { t: s * b + b / 2, d: b * 0.45, m: v[0] + (v[0] + 7 <= 57 ? 7 : -5), v: 0.8 });
          for (let h = 0; h < 2; h++) v.slice(1).forEach((m) => notes.push({ t: s * b + h * b / 2 + b * 0.25 * (h ? 0 : 0), d: b * 0.4, m, v: 0.6 }));
        });
        return { key: ck + P.bpm, notes, len: vs.length * b, poly: 5 };
      };
      const snd = K.synth(ctx, song, { decay: 1.6, harm: [1, 0.4, 0.2, 0.1, 0.05] });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, n = vs.length;
          const hl = Math.min(n - 1, Math.floor(now / bar()));
          // 피아노 롤
          const rw = Math.max(200, W * 0.62), rx = pad + 26, ry = 72, rh = Math.max(80, H * 0.55);
          let lo = 127, hi = 0;
          vs.forEach((v) => v.forEach((m) => { lo = Math.min(lo, m); hi = Math.max(hi, m); }));
          lo -= 2; hi += 2;
          const ph = rh / (hi - lo + 1), cw = (rw - 26) / n;
          D.rect(g, rx, ry, rw - 26, rh, 'rgba(0,0,0,0.3)');
          for (let m = lo; m <= hi; m++) {
            const y = ry + (hi - m) * ph;
            if (A.isBlackKey(m)) D.rect(g, rx, y, rw - 26, ph, 'rgba(255,255,255,0.03)');
            if (m % 12 === 0) { D.line(g, rx, y + ph, rx + rw - 26, y + ph, C.grid, 1); D.text(g, A.noteName(m), pad, y + ph - 10, { size: 9, color: C.dim }); }
          }
          vs.forEach((v, s) => {
            const x = rx + s * cw;
            if (s === hl) D.rect(g, x, ry, cw, rh, 'rgba(255,255,255,0.06)');
            v.forEach((m, i) => D.rect(g, x + 2, ry + (hi - m) * ph + 1, cw - 4, Math.max(2, ph - 2), i === 0 ? C.accent : col));
            D.text(g, chs[s].rn, x + cw / 2, ry - 30, { size: Math.min(13, cw * 0.28), align: 'center', color: s === hl ? C.warn : C.text });
            D.text(g, chs[s].sym, x + cw / 2, ry - 15, { size: Math.min(10, cw * 0.22), align: 'center', color: C.dim });
            // 다음 화음으로의 근음 이동
            const mt = mots[s];
            D.rect(g, x + 3, ry + rh + 6, cw - 6, 14, MOTC[mt]);
            D.text(g, Lg(...MOTL[mt]), x + cw / 2, ry + rh + 8, { size: Math.min(9, cw * 0.18), align: 'center', color: '#111' });
          });
          D.text(g, Lg('아래 칸 = 다음 화음으로 가는 근음 이동 (마지막은 처음으로)', 'Boxes below = root motion to the next chord (last one wraps)'), rx, ry + rh + 26, { size: 9, color: C.dim });
          // 5도권 위의 근음 경로
          const cx0 = rx + rw - 26 + 16, R = Math.max(20, Math.min((W - cx0 - pad) / 2 - 14, rh / 2));
          if (R > 24) {
            const cx = cx0 + R + 12, cy = ry + rh / 2;
            const pt = (pc, r) => { const i = (pc * 7) % 12; return [cx + r * Math.sin(i / 12 * Math.PI * 2), cy - r * Math.cos(i / 12 * Math.PI * 2)]; };
            const NN = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
            for (let pc = 0; pc < 12; pc++) {
              const [x, y] = pt(pc, R), used = chs.some((c) => c.rootPc === pc);
              D.circle(g, x, y, 9, used ? (chs[hl].rootPc === pc ? C.warn : col) : 'rgba(60,66,78,0.9)');
              D.text(g, NN[pc], x, y - 5, { size: 9, align: 'center', color: used ? '#111' : C.dim });
            }
            chs.forEach((c, s) => {
              const nx = chs[(s + 1) % n];
              if (nx.rootPc === c.rootPc) return;
              const [x1, y1] = pt(c.rootPc, R - 12), [x2, y2] = pt(nx.rootPc, R - 12);
              D.arrow(g, x1, y1, x2, y2, MOTC[mots[s]], s === hl ? 2.5 : 1.3, 6);
            });
            D.text(g, Lg('5도권 위 근음 경로', 'Root path on the circle of 5ths'), cx, cy + R + 14, { size: 9, align: 'center', color: C.dim });
          }
          const cnt = {}; mots.forEach((m) => { cnt[m] = (cnt[m] || 0) + 1; });
          const moving = mots.filter((m) => m !== 'same').length || 1;
          ctx.stat(Lg('5도 아래 이동 비율', 'Down-a-5th ratio'), Math.round(100 * (cnt.down5 || 0) / moving) + '%');
          ctx.stat(Lg('근음 이동', 'Root motion'), Object.entries(cnt).map(([k, v]) => `${Lg(...MOTL[k])} ${v}`).join(', '));
          ctx.stat(Lg('지금 화음', 'Current chord'), `${chs[hl].rn} (${chs[hl].sym})`);
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
