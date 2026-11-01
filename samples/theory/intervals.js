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

  // 음정 13개: 반음 수, 단계(도수 - 1), 이름, 순정 비율
  const IV = [
    { s: 0, gen: 0, ab: 'P1', ko: '완전1도', en: 'Perfect unison', p: 1, q: 1 },
    { s: 1, gen: 1, ab: 'm2', ko: '단2도', en: 'Minor 2nd', p: 16, q: 15 },
    { s: 2, gen: 1, ab: 'M2', ko: '장2도', en: 'Major 2nd', p: 9, q: 8 },
    { s: 3, gen: 2, ab: 'm3', ko: '단3도', en: 'Minor 3rd', p: 6, q: 5 },
    { s: 4, gen: 2, ab: 'M3', ko: '장3도', en: 'Major 3rd', p: 5, q: 4 },
    { s: 5, gen: 3, ab: 'P4', ko: '완전4도', en: 'Perfect 4th', p: 4, q: 3 },
    { s: 6, gen: 3, ab: 'A4', ko: '증4도 (트라이톤)', en: 'Augmented 4th (tritone)', p: 45, q: 32 },
    { s: 7, gen: 4, ab: 'P5', ko: '완전5도', en: 'Perfect 5th', p: 3, q: 2 },
    { s: 8, gen: 5, ab: 'm6', ko: '단6도', en: 'Minor 6th', p: 8, q: 5 },
    { s: 9, gen: 5, ab: 'M6', ko: '장6도', en: 'Major 6th', p: 5, q: 3 },
    { s: 10, gen: 6, ab: 'm7', ko: '단7도', en: 'Minor 7th', p: 16, q: 9 },
    { s: 11, gen: 6, ab: 'M7', ko: '장7도', en: 'Major 7th', p: 15, q: 8 },
    { s: 12, gen: 7, ab: 'P8', ko: '완전8도 (옥타브)', en: 'Octave', p: 2, q: 1 },
  ];
  const ROOTS = [['C', 0, 0], ['D', 1, 0], ['E♭', 2, -1], ['E', 2, 0], ['F', 3, 0], ['G', 4, 0], ['A', 5, 0], ['B♭', 6, -1]];
  const wavePath = (y, cyc) => Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${40 + i * 3},${(y - 22 * Math.sin(i / 120 * 2 * Math.PI * cyc)).toFixed(1)}`).join(' ');

  GTL.register({
    id: 'intervals',
    title: '음정 (Interval)',
    summary: '두 음 사이의 거리인 음정을 반음 수, 이름, 주파수 비로 함께 보여 줌. 비율이 단순할수록 두 파형이 짧은 주기로 다시 맞물리고 더 어울리게 들림.',
    single: true,
    controls: '파라미터 표에서 음정과 바닥음을 바꿈. "소리 켜기"를 누르면 두 음을 차례로, 그다음 함께 들려줌.',
    info: `
      <p><b>음정(Interval)</b>은 두 음의 높이 차이. 이름은 두 부분으로 됨.</p>
      <ul>
        <li><b>도수</b>: 악보에서 몇 칸 떨어졌는가. 같은 줄이면 1도, 바로 위 칸이면 2도</li>
        <li><b>성질</b>: 같은 도수라도 반음 수가 다름. 완전(P), 장(M), 단(m), 증(A), 감(d)으로 구분</li>
      </ul>
      <p>평균율(12-TET)에서 반음 하나는 주파수 비 2<sup>1/12</sup> ≈ 1.0595. 그래서 반음 수만 알면 음정의 비율이 나옴. 귀가 듣는 어울림은 정수 비와 관련 있음. 완전5도는 3:2, 장3도는 5:4에 가까움.</p>
      <p>비율 p:q가 단순하면 두 음의 배음이 많이 겹치고, 합친 파형이 짧은 주기로 반복됨. 그래서 1도, 8도, 5도, 4도가 가장 안정되게 들리고 2도, 7도, 트라이톤은 긴장감이 큼.</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" class="t-small t-dim">${L('완전5도 = 3:2. 아래 음 2주기 = 위 음 3주기', 'Perfect 5th = 3:2. Two cycles of the low note = three cycles of the high note')}</text>
      <path d="${wavePath(60, 2)}" class="d-a"/>
      <path d="${wavePath(118, 3)}" class="d-b"/>
      <line x1="40" y1="30" x2="40" y2="148" class="d-dim" stroke-dasharray="3 3"/><line x1="400" y1="30" x2="400" y2="148" class="d-dim" stroke-dasharray="3 3"/>
      <text x="412" y="64" class="t-small t-a">${L('아래 음: 2주기', 'Low note: 2 cycles')}</text>
      <text x="412" y="122" class="t-small t-b">${L('위 음: 3주기', 'High note: 3 cycles')}</text>
      <text x="220" y="164" text-anchor="middle" class="t-small">${L('점선 사이에서 두 파형이 다시 같은 위상으로 맞물림', 'Between the dashed lines both waves line up again in phase')}</text>
    </svg>`,
    look: [
      '음정을 완전5도에서 장7도로 바꾸면 아래 합성 파형의 반복 주기가 몇 배로 길어짐',
      '"소리 켜기"를 누르고 단2도와 완전8도를 번갈아 들으면 긴장감 차이가 바로 들림',
      '증4도(트라이톤)를 고르면 순정 비율이 45:32로 복잡해지고 어울림 막대가 가장 짧아짐',
      '바닥음을 바꿔도 반음 수와 비율은 그대로. 음정은 높이가 아니라 거리이기 때문',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '음정 이름과 성질 (1장)' },
      { type: 'book', title: 'Fletcher, Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '배음과 주파수 비' },
      { type: 'paper', title: 'Plomp, Levelt, "Tonal Consonance and Critical Bandwidth", Journal of the Acoustical Society of America 38', year: 1965, note: '어울림과 임계 대역' },
      { type: 'book', title: 'Gareth Loy, Musimathics Vol. 1', year: 2006, note: '음정, 비율, 센트 계산' },
    ],
    params: [
      { key: 'iv', label: '음정', type: 'select', options: IV.map((v, i) => ({ value: i, label: `${v.ab} ${v.ko}` })), default: 7, group: '음정' },
      { key: 'root', label: '바닥음', type: 'select', options: ROOTS.map((r, i) => ({ value: i, label: r[0] + '4' })), default: 0, group: '음정' },
      { key: 'mode', label: '들려주는 방식', type: 'select', options: [{ value: 'both', label: '차례로, 그다음 함께' }, { value: 'mel', label: '차례로 (선율 음정)' }, { value: 'harm', label: '함께 (화성 음정)' }], default: 'both', group: '음정' },
      ...GTL.audio.params({ single: true }),
    ],
    en: {
      title: 'Intervals',
      summary: 'Shows the distance between two notes as semitones, a name and a frequency ratio. The simpler the ratio, the sooner the two waves line up again, and the smoother the pair sounds.',
      controls: 'Change the interval and the lower note in the parameter table. Press "Sound on" to hear the two notes one after the other, then together.',
      info: `
      <p>An <b>interval</b> is the pitch distance between two notes. Its name has two parts.</p>
      <ul>
        <li><b>Number</b>: how many staff steps apart. Same line is a unison (1st), the next space up is a 2nd.</li>
        <li><b>Quality</b>: the same number can have different semitone counts. Perfect (P), major (M), minor (m), augmented (A), diminished (d).</li>
      </ul>
      <p>In equal temperament (12-TET) one semitone is the ratio 2<sup>1/12</sup> ≈ 1.0595, so the ratio follows from the semitone count. What the ear hears as smooth is linked to whole-number ratios. A perfect 5th is close to 3:2, a major 3rd close to 5:4.</p>
      <p>When the ratio p:q is simple, many harmonics of the two notes overlap and the combined wave repeats quickly. So unisons, octaves, 5ths and 4ths sound most stable, while 2nds, 7ths and the tritone sound tense.</p>`,
      look: [
        'Change the interval from a perfect 5th to a major 7th. The repeat period of the combined wave below gets several times longer.',
        'Press "Sound on" and switch between a minor 2nd and an octave. The difference in tension is clear right away.',
        'Pick the augmented 4th (tritone). The just ratio becomes 45:32 and its smoothness bar is the shortest.',
        'Change the lower note. Semitones and ratio stay the same, because an interval is a distance, not a pitch.',
      ],
      refs: ['Interval names and qualities (chapter 1).', 'Harmonics and frequency ratios.', 'Consonance and the critical band.', 'Intervals, ratios and cents.'],
      params: {
        iv: { label: 'Interval', group: 'Interval', options: Object.fromEntries(IV.map((v, i) => [i, `${v.ab} ${v.en}`])) },
        root: { label: 'Lower note', group: 'Interval' },
        mode: { label: 'Playback', group: 'Interval', options: { both: 'In turn, then together', mel: 'In turn (melodic)', harm: 'Together (harmonic)' } },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const cur = () => {
        const iv = IV[+P.iv] || IV[7], r = ROOTS[+P.root] || ROOTS[0];
        const lo = { l: r[1], a: r[2], o: 4 }, hi = K.above(lo, iv.gen, iv.s);
        return { iv, lo, hi, mLo: K.midi(lo), mHi: K.midi(hi) };
      };
      const song = () => {
        const c = cur(), key = `${P.iv}|${P.root}|${P.mode}`;
        const notes = [];
        if (P.mode !== 'harm') notes.push({ t: 0, d: 0.55, m: c.mLo }, { t: 0.7, d: 0.55, m: c.mHi });
        if (P.mode !== 'mel') { const t0 = P.mode === 'harm' ? 0 : 1.5; notes.push({ t: t0, d: 1.3, m: c.mLo }, { t: t0, d: 1.3, m: c.mHi }); }
        return { key, notes, len: P.mode === 'both' ? 3.4 : P.mode === 'mel' ? 1.8 : 2.0, poly: 2 };
      };
      const snd = K.synth(ctx, song, { decay: 0.6 });
      const clk = K.clock();
      let now = 0;
      // 비율 p:q의 복잡도 log2(p*q) (테니 높이). 낮을수록 단순
      const tenney = (v) => Math.log2(v.p * v.q);

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          const g = ctx.g, W = ctx.width, H = ctx.height, c = cur(), s = song();
          const pad = 10;
          // 건반
          const kh = Math.max(36, H * 0.16);
          const sounding = new Set(s.notes.filter((n) => now >= n.t && now < n.t + n.d).map((n) => n.m));
          const marks = { [c.mLo]: sounding.has(c.mLo) ? C.warn : C.a, [c.mHi]: sounding.has(c.mHi) ? C.warn : C.b };
          if (c.mLo === c.mHi) marks[c.mLo] = sounding.has(c.mLo) ? C.warn : C.accent;
          const kx = A.drawKeyboard(g, pad, pad, W - pad * 2, kh, 60, 84, marks);
          if (c.iv.s > 0) {
            const x0 = kx(c.mLo), x1 = kx(c.mHi), yy = pad + kh + 7;
            D.line(g, x0, yy, x1, yy, C.accent, 2); D.line(g, x0, yy - 4, x0, yy + 4, C.accent, 2); D.line(g, x1, yy - 4, x1, yy + 4, C.accent, 2);
            D.text(g, Lg(`반음 ${c.iv.s}개`, `${c.iv.s} semitones`), (x0 + x1) / 2, yy + 4, { size: 10, align: 'center', color: C.accent });
          }
          // 오선 (높은음자리표만)
          const top = pad + kh + 36, sp = Math.max(5, Math.min(12, H * 0.026)), sw = Math.min(240, W * 0.3);
          const yOf = K.staff(g, pad, top + sp * 1.5, sw, sp, { bass: false });
          K.chord(g, pad + sw * 0.62, [c.lo, c.hi], yOf, sp, (n, i) => (i === 0 ? C.a : C.b));
          D.text(g, `${K.name(c.lo, 1)} → ${K.name(c.hi, 1)}`, pad, top + sp * 7.5, { size: 12, color: C.text });
          // 수치 패널
          const tx = pad + sw + 16, et = Math.pow(2, c.iv.s / 12), ji = c.iv.p / c.iv.q, dc = A.cents(ji, et);
          const lines = [
            [Lg('이름', 'Name'), `${c.iv.ab}  ${Lg(c.iv.ko, c.iv.en)}`],
            [Lg('평균율 비', 'Equal-tempered'), `2^(${c.iv.s}/12) = ${et.toFixed(4)}`],
            [Lg('순정 비', 'Just ratio'), `${c.iv.p}:${c.iv.q} = ${ji.toFixed(4)}`],
            [Lg('차이', 'Difference'), `${dc >= 0 ? '+' : ''}${dc.toFixed(1)} cent`],
            [Lg('주파수', 'Frequency'), `${A.mtof(c.mLo).toFixed(1)} Hz, ${A.mtof(c.mHi).toFixed(1)} Hz`],
          ];
          const vx = tx + Math.min(110, (W - tx) * 0.36), lh = Math.max(14, Math.min(18, H * 0.04));
          lines.forEach(([k, v], i) => {
            D.text(g, k, tx, top - 14 + i * lh, { size: 10.5, color: C.dim });
            D.text(g, v, vx, top - 14 + i * lh, { size: 11.5, color: C.text });
          });
          // 어울림 막대 (13개 음정)
          const wy = Math.round(H * 0.74), by = top - 14 + 5 * lh + 14, bh = U.clamp(wy - by - 8, 24, 150), bw = (W - tx - pad) / IV.length;
          D.text(g, Lg('어울림 (비율이 단순할수록 높음)', 'Smoothness (higher = simpler ratio)'), tx, by - 12, { size: 9, color: C.dim });
          IV.forEach((v, i) => {
            const h = Math.max(2, (1 - tenney(v) / 11) * (bh - 12));
            D.rect(g, tx + i * bw + 1, by + bh - 12 - h, bw - 2, h, v === c.iv ? C.b : 'rgba(125,133,148,0.5)');
            D.text(g, v.ab, tx + i * bw + bw / 2, by + bh - 11, { size: 8, align: 'center', color: v === c.iv ? C.b : C.dim });
          });
          // 합성 파형 (사인 두 개). 순정 비율의 공통 주기를 표시
          const wh = H - wy - pad;
          const fLo = A.mtof(c.mLo), fHi = A.mtof(c.mHi), per = c.iv.q / fLo;
          const span = Math.min(0.06, Math.max(per * 2.2, 4 / fLo));
          const N = Math.max(64, Math.floor(W - pad * 2)), buf = new Float32Array(N);
          for (let i = 0; i < N; i++) { const t = span * i / N; buf[i] = 0.45 * (Math.sin(2 * Math.PI * fLo * t) + Math.sin(2 * Math.PI * fHi * t)); }
          A.drawWave(g, buf, pad, wy, W - pad * 2, wh, { color: C.accent, label: Lg('두 음을 더한 파형', 'Sum of both notes') });
          for (let k = 1; per * k <= span; k++) {
            const px = pad + (per * k / span) * (W - pad * 2);
            D.line(g, px, wy, px, wy + wh, C.good, 1);
          }
          if (per <= span) D.text(g, Lg('초록 선 = 순정 비율의 반복 주기', 'Green line = repeat period of the just ratio'), W - pad - 4, wy + 3, { size: 9, color: C.good, align: 'right' });
          ctx.stat(Lg('음정', 'Interval'), `${c.iv.ab} (${Lg(c.iv.ko, c.iv.en)})`);
          ctx.stat(Lg('반음 수', 'Semitones'), c.iv.s);
          ctx.stat(Lg('반복 주기', 'Repeat period'), (per * 1000).toFixed(1) + ' ms');
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
