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

  // 음률: C를 기준으로 12개 음의 센트 값
  const JUST = [1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8];
  const chain = (fifth) => { const c = new Array(12); for (let k = -3; k <= 8; k++) c[((7 * k) % 12 + 12) % 12] = ((k * fifth) % 1200 + 1200) % 1200; return c; };
  const SYS = {
    et: { ko: '12평균율', en: '12-tone equal', c: Array.from({ length: 12 }, (_, i) => i * 100) },
    just: { ko: '순정률 (C 기준)', en: 'Just intonation (on C)', c: JUST.map((r) => 1200 * Math.log2(r)) },
    pyth: { ko: '피타고라스 음률', en: 'Pythagorean', c: chain(1200 * Math.log2(1.5)) },
    mean: { ko: '1/4 쉼표 가온음률', en: 'Quarter-comma meantone', c: chain(1200 * Math.log2(5) / 4) },
  };
  // 화음 (MIDI). C 장조 안팎의 화음
  const CH = {
    I: { ko: 'I (C E G)', en: 'I (C E G)', m: [48, 60, 64, 67] },
    IV: { ko: 'IV (F A C)', en: 'IV (F A C)', m: [53, 65, 69, 72] },
    V: { ko: 'V (G B D)', en: 'V (G B D)', m: [43, 55, 59, 62] },
    ii: { ko: 'ii (D F A)', en: 'ii (D F A)', m: [50, 62, 65, 69] },
    vi: { ko: 'vi (A C E)', en: 'vi (A C E)', m: [45, 57, 60, 64] },
    V7: { ko: 'V7 (G B D F)', en: 'V7 (G B D F)', m: [43, 59, 62, 65] },
    E: { ko: 'E 장3화음 (E G♯ B)', en: 'E major (E G♯ B)', m: [52, 64, 68, 71] },
    Ab: { ko: 'A♭ 장3화음 (A♭ C E♭)', en: 'A♭ major (A♭ C E♭)', m: [44, 56, 60, 63] },
    P5: { ko: '완전5도 (C G)', en: 'Perfect 5th (C G)', m: [60, 67] },
    M3: { ko: '장3도 (C E)', en: 'Major 3rd (C E)', m: [60, 64] },
  };
  const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
  const PURE = { 3: 315.64, 4: 386.31, 5: 498.04, 7: 701.96, 8: 813.69, 9: 884.36, 10: 968.83 };
  const HARM = [1, 0.5, 0.33, 0.25, 0.2, 0.16];

  GTL.register({
    id: 'tuning-systems',
    title: '음률 (평균율, 순정률, 피타고라스, 가온음률)',
    summary: '같은 화음도 음률에 따라 음 높이가 몇 센트씩 달라짐. 평균율의 장3도는 배음끼리 초당 십여 번 맥놀이가 생기고, 순정률은 맥놀이가 없지만 다른 조의 화음에서 크게 틀어짐.',
    views: { a: '12평균율', b: '순정률' },
    controls: '파라미터 표에서 뷰마다 음률을 고르고, 화음을 바꿈. "소리 켜기"를 누르면 화음이 길게 울림.',
    info: `
      <p><b>음률(Tuning system)</b>은 옥타브 안의 12개 음을 어떤 주파수에 둘지 정하는 규칙. 순수한 정수 비를 모든 음정에 동시에 맞출 수는 없어서, 어딘가에 오차를 몰거나 고르게 나눔.</p>
      <ul>
        <li><b>12평균율</b>: 옥타브를 12개 같은 비율로 나눔. 모든 조가 똑같이 쓸 만함. 장3도가 순정보다 14센트 넓어서 맥놀이가 들림.</li>
        <li><b>순정률</b>: 5:4, 3:2 같은 정수 비. 기준 조(C)의 I, IV, V는 맥놀이가 없음. ii(D F A)의 5도는 680센트로 22센트나 좁음.</li>
        <li><b>피타고라스 음률</b>: 순정 5도(3:2)만 쌓음. 5도는 깨끗하지만 장3도가 408센트로 아주 넓음.</li>
        <li><b>1/4 쉼표 가온음률</b>: 5도를 조금 좁혀 장3도를 순정으로 맞춤. 르네상스, 바로크 건반 음률. G♯과 E♭ 사이에 쓸 수 없는 늑대 5도가 남음.</li>
      </ul>
      <p><b>맥놀이(Beat)</b>: 주파수가 조금 다른 두 성분이 겹치면 소리 크기가 차이 주파수만큼 오르내림. 두 음의 배음 중 가까운 것끼리 맥놀이를 만들어서 음정이 순정에서 벗어난 정도가 귀에 들림.</p>`,
    diagram: (L) => {
      const N = 240, p1 = [], p2 = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N, v = Math.sin(2 * Math.PI * 20 * t) + Math.sin(2 * Math.PI * 22 * t);
        p1.push(`${i ? 'L' : 'M'}${(30 + t * 480).toFixed(1)},${(70 - v * 22).toFixed(1)}`);
        p2.push(`${i ? 'L' : 'M'}${(30 + t * 480).toFixed(1)},${(70 - 44 * Math.abs(Math.cos(Math.PI * 2 * t))).toFixed(1)}`);
      }
      return `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
        <text x="4" y="16" class="t-small t-dim">${L('주파수가 조금 다른 두 성분을 더하면 크기가 오르내림 (맥놀이)', 'Adding two slightly different frequencies makes the level rise and fall (beats)')}</text>
        <path d="${p1.join(' ')}" class="d-b"/>
        <path d="${p2.join(' ')}" class="d-a" stroke-dasharray="4 3"/>
        <text x="270" y="130" text-anchor="middle" class="t-small t-a">${L('맥놀이 횟수 = |f1 - f2| (예: 5:4에서 14센트 벗어난 장3도 → 배음끼리 초당 약 10회)', 'Beat rate = |f1 - f2| (e.g. a major 3rd 14 cents off 5:4 → about 10 beats per second between harmonics)')}</text>
      </svg>`;
    },
    look: [
      '기본 화음 I에서 A의 아래쪽 크기 곡선은 초당 여러 번 출렁이고, B는 거의 평평함',
      '화음을 ii (D F A)로 바꾸면 이번에는 B(순정률)의 5도가 680센트로 틀어져 맥놀이가 더 심해짐',
      'B를 피타고라스 음률로 바꾸면 5도는 깨끗해지고 장3도가 408센트로 넓어짐',
      'B를 가온음률로 두고 A♭ 장3화음을 고르면 늑대 5도 때문에 크기 곡선이 빠르게 떨림',
    ],
    refs: [
      { type: 'book', title: 'Ross W. Duffin, How Equal Temperament Ruined Harmony (and Why You Should Care)', year: 2007, note: '음률의 역사와 맥놀이 비교' },
      { type: 'book', title: 'J. Murray Barbour, Tuning and Temperament: A Historical Survey', year: 1951, note: '피타고라스, 가온음률, 평균율 수치' },
      { type: 'book', title: 'William A. Sethares, Tuning, Timbre, Spectrum, Scale (2nd ed.)', year: 2005, note: '배음, 맥놀이, 어울림' },
      { type: 'book', title: 'Fletcher, Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '맥놀이의 물리' },
    ],
    params: [
      { key: 'sys', label: '음률', type: 'select', options: Object.entries(SYS).map(([k, v]) => ({ value: k, label: v.ko })), a: 'et', b: 'just', group: '음률' },
      { key: 'chord', label: '화음', type: 'select', options: Object.entries(CH).map(([k, v]) => ({ value: k, label: v.ko })), default: 'I', shared: true, group: '음률' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Tuning Systems (Equal, Just, Pythagorean, Meantone)',
      summary: 'The same chord changes by a few cents depending on the tuning system. In equal temperament the harmonics of a major 3rd beat about ten times a second. Just intonation has no beats, but chords in other keys go badly out of tune.',
      views: { a: '12-tone equal', b: 'Just intonation' },
      controls: 'Pick a tuning system for each view and change the chord in the parameter table. Press "Sound on" to hear the chord ring.',
      info: `
      <p>A <b>tuning system</b> decides the frequency of each of the 12 notes in the octave. You cannot make every interval a pure whole-number ratio at once, so the error is either moved into some intervals or spread evenly.</p>
      <ul>
        <li><b>12-tone equal temperament</b>: splits the octave into 12 equal ratios. Every key is equally usable. The major 3rd is 14 cents wider than pure, so it beats.</li>
        <li><b>Just intonation</b>: whole-number ratios like 5:4 and 3:2. I, IV and V in the home key (C) do not beat. But the 5th of ii (D F A) is 680 cents, 22 cents too narrow.</li>
        <li><b>Pythagorean</b>: stacks only pure 5ths (3:2). The 5ths are clean, but the major 3rd is a very wide 408 cents.</li>
        <li><b>Quarter-comma meantone</b>: narrows the 5th a little so the major 3rd becomes pure. Used on Renaissance and Baroque keyboards. An unusable "wolf" 5th remains between G♯ and E♭.</li>
      </ul>
      <p><b>Beats</b>: when two components with slightly different frequencies overlap, the level rises and falls at the difference frequency. Nearby harmonics of two notes beat like this, so you can hear how far an interval is from pure.</p>`,
      look: [
        'With the default chord I, the level curve at the bottom of A wobbles several times a second. B is almost flat.',
        'Change the chord to ii (D F A). Now B (just) has a 680-cent 5th and beats even more.',
        'Switch B to Pythagorean. The 5th is clean and the major 3rd widens to 408 cents.',
        'Set B to meantone and pick A♭ major. The wolf 5th makes the level curve shake fast.',
      ],
      refs: ['History of tuning and beat comparisons.', 'Values for Pythagorean, meantone and equal temperament.', 'Harmonics, beats and consonance.', 'Physics of beats.'],
      params: {
        sys: { label: 'Tuning system', group: 'Tuning', options: Object.fromEntries(Object.entries(SYS).map(([k, v]) => [k, v.en])) },
        chord: { label: 'Chord', group: 'Tuning', options: Object.fromEntries(Object.entries(CH).map(([k, v]) => [k, v.en])) },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      const C4 = A.mtof(60);
      const freqOf = (m, sys) => { const pc = ((m % 12) + 12) % 12, oct = Math.floor(m / 12) - 5; return C4 * Math.pow(2, oct + sys.c[pc] / 1200); };
      const cur = () => { const sys = SYS[P.sys] || SYS.et, ch = CH[P.chord] || CH.I; return { sys, ch, f: ch.m.map((m) => freqOf(m, sys)) }; };
      const song = () => {
        const c = cur();
        return { key: P.sys + P.chord, len: 3.2, poly: 4, notes: c.f.map((f, i) => ({ t: 0, d: 2.8, f, v: i === 0 && c.f.length > 2 ? 0.7 : 1 })) };
      };
      const snd = K.synth(ctx, song, { harm: HARM, decay: 0.05, release: 0.15 });

      // 분석: 맥놀이 목록과 크기 곡선. 파라미터가 바뀔 때만 계산
      let key = '', beats = [], env = null, ivs = [];
      function analyze() {
        const k = P.sys + P.chord;
        if (k === key) return;
        key = k;
        const c = cur();
        beats = [];
        for (let i = 0; i < c.f.length; i++) for (let j = i + 1; j < c.f.length; j++)
          for (let h = 1; h <= HARM.length; h++) for (let q = 1; q <= HARM.length; q++) {
            const d = Math.abs(c.f[i] * h - c.f[j] * q);
            if (d > 0.05 && d < 40) beats.push({ i, j, h, q, hz: d, s: Math.min(HARM[h - 1], HARM[q - 1]) });
          }
        beats.sort((p, q) => q.s - p.s || p.hz - q.hz);
        // 화음 안 음정 (맨 아래 음은 옥타브 아래 겹친 음이라 위 음들끼리만)
        const ms = c.ch.m.length > 2 ? c.ch.m.slice(1) : c.ch.m, fs = c.ch.m.length > 2 ? c.f.slice(1) : c.f;
        ivs = [];
        for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) {
          const st = ms[j] - ms[i], cents = 1200 * Math.log2(fs[j] / fs[i]);
          ivs.push({ a: ms[i], b: ms[j], st, cents, pure: PURE[st] });
        }
        // 크기 곡선: 2초를 8kHz로 렌더하고 10ms마다 RMS
        const SR = 8000, N = SR * 2, buf = new Float32Array(N);
        for (let n = 0; n < c.f.length; n++) for (let h = 0; h < HARM.length; h++) {
          const w = 2 * Math.PI * c.f[n] * (h + 1) / SR;
          if (c.f[n] * (h + 1) > SR * 0.45) break;
          for (let i = 0; i < N; i++) buf[i] += HARM[h] * Math.sin(w * i);
        }
        // 60ms 한 창으로 제곱 평균. 화음 자체의 주기(수십 Hz)는 거르고 맥놀이(수 Hz)만 남김
        const hop = 40, WL = 480, win = new Float32Array(WL);
        let ws = 0;
        for (let i = 0; i < WL; i++) { win[i] = A.windows.hann(i, WL); ws += win[i]; }
        env = new Float32Array(Math.floor((N - WL) / hop));
        let mx = 1e-9;
        for (let b = 0; b < env.length; b++) { let e = 0; for (let i = 0; i < WL; i++) { const v = buf[b * hop + i]; e += v * v * win[i]; } env[b] = Math.sqrt(e / ws); mx = Math.max(mx, env[b]); }
        for (let b = 0; b < env.length; b++) env[b] /= mx;
      }

      return {
        update() { snd.update(); },
        render() {
          analyze();
          const g = ctx.g, W = ctx.width, H = ctx.height, c = cur(), pad = 10;
          D.text(g, `${Lg(c.sys.ko, c.sys.en)}, ${Lg(c.ch.ko, c.ch.en)}`, pad, 31, { size: 12, color: col });
          // 12개 음의 평균율 대비 센트 차이
          const by = 52, bh = Math.max(50, H * 0.24), bw = (W - pad * 2) / 12, mid = by + bh / 2, sc = bh / 2 / 30;
          D.rect(g, pad, by, W - pad * 2, bh, 'rgba(0,0,0,0.3)');
          D.line(g, pad, mid, W - pad, mid, C.grid, 1);
          [-20, -10, 10, 20].forEach((v) => { D.line(g, pad, mid - v * sc, W - pad, mid - v * sc, 'rgba(255,255,255,0.04)', 1); });
          D.text(g, '+20c', pad + 2, mid - 20 * sc - 6, { size: 9, color: C.dim }); D.text(g, '-20c', pad + 2, mid + 20 * sc - 6, { size: 9, color: C.dim });
          const pcs = new Set(c.ch.m.map((m) => m % 12));
          for (let k = 0; k < 12; k++) {
            const dev = c.sys.c[k] - k * 100, x = pad + k * bw + bw * 0.2, h = U.clamp(dev, -30, 30) * sc;
            D.rect(g, x, Math.min(mid, mid - h), bw * 0.6, Math.max(1, Math.abs(h)), pcs.has(k) ? col : 'rgba(125,133,148,0.45)');
            D.text(g, NN[k], x + bw * 0.3, by + bh + 3, { size: 10, align: 'center', color: pcs.has(k) ? C.text : C.dim });
            if (pcs.has(k)) D.text(g, (dev >= 0 ? '+' : '') + dev.toFixed(1), x + bw * 0.3, dev >= 0 ? mid + 4 : mid - 16, { size: 9, align: 'center', color: C.text });
          }
          D.text(g, Lg('평균율 대비 센트 차이 (12개 음)', 'Cents from equal temperament (12 notes)'), pad + 40, by + 3, { size: 10, color: C.dim });
          // 화음 안 음정 표
          let ty = by + bh + 22;
          D.text(g, Lg('화음 안 음정: 실제 크기 / 순정 / 오차', 'Intervals in the chord: actual / pure / error'), pad, ty, { size: 10, color: C.dim });
          ty += 15;
          ivs.forEach((v) => {
            const err = v.pure != null ? v.cents - v.pure : null;
            const bad = err != null && Math.abs(err) > 12;
            D.text(g, `${NN[v.a % 12]}-${NN[v.b % 12]}`, pad, ty, { size: 11, color: C.text });
            D.text(g, `${v.cents.toFixed(1)}c / ${v.pure != null ? v.pure.toFixed(1) + 'c' : '-'} / ${err != null ? (err >= 0 ? '+' : '') + err.toFixed(1) + 'c' : '-'}`, pad + 70, ty, { size: 11, color: bad ? C.bad : Math.abs(err || 0) < 2 ? C.good : C.text });
            ty += 15;
          });
          // 맥놀이 목록 (오른쪽)
          const bx = W * 0.55;
          let yy = by + bh + 22;
          D.text(g, Lg('센 맥놀이 (배음 쌍)', 'Strongest beats (harmonic pairs)'), bx, yy, { size: 10, color: C.dim });
          yy += 15;
          beats.slice(0, 5).forEach((b) => {
            D.text(g, `${NN[c.ch.m[b.i] % 12]}×${b.h} vs ${NN[c.ch.m[b.j] % 12]}×${b.q}: ${b.hz.toFixed(2)} Hz`, bx, yy, { size: 11, color: b.hz > 1 ? C.warn : C.text });
            yy += 15;
          });
          if (!beats.length) D.text(g, Lg('맥놀이 없음', 'No beats'), bx, yy, { size: 11, color: C.good });
          // 크기 곡선
          const ey = Math.max(ty, yy) + 8, eh = H - ey - pad;
          if (eh > 20) {
            D.rect(g, pad, ey, W - pad * 2, eh, 'rgba(0,0,0,0.35)');
            g.beginPath();
            // 평균 대비 비율을 확대해서 그림 (가운데 선 = 평균, 위아래 끝 = ±15%)
            let mean = 0; for (let i = 0; i < env.length; i++) mean += env[i] / env.length;
            const cy = ey + 10 + (eh - 10) / 2;
            D.line(g, pad, cy, W - pad, cy, C.grid, 1);
            for (let i = 0; i < env.length; i++) { const x = pad + (W - pad * 2) * i / (env.length - 1), y = cy - U.clamp(env[i] / mean - 1, -0.17, 0.17) / 0.15 * (eh - 14) / 2; i ? g.lineTo(x, y) : g.moveTo(x, y); }
            g.strokeStyle = col; g.lineWidth = 1.6; g.stroke();
            D.text(g, Lg('화음의 소리 크기 (2초, 평균 대비 ±15% 확대). 출렁임 = 맥놀이', 'Chord level over 2 s (zoomed to ±15% of the mean). Wobble = beats'), pad + 4, ey + 3, { size: 10, color: C.dim });
          }
          let dmin = 1, dmax = 0;
          for (let i = 0; i < env.length; i++) { dmin = Math.min(dmin, env[i]); dmax = Math.max(dmax, env[i]); }
          const worst = ivs.reduce((m, v) => (v.pure != null ? Math.max(m, Math.abs(v.cents - v.pure)) : m), 0);
          ctx.stat(Lg('최대 음정 오차', 'Largest interval error'), worst.toFixed(1) + ' cent');
          ctx.stat(Lg('가장 센 맥놀이', 'Strongest beat'), beats.length ? beats[0].hz.toFixed(2) + ' Hz' : '-');
          ctx.stat(Lg('크기 출렁임', 'Level wobble'), (20 * Math.log10(dmax / Math.max(1e-4, dmin))).toFixed(1) + ' dB');
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
