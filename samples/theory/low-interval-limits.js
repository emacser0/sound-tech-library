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

  const CHORDS = {
    maj: { ko: '장3화음', en: 'Major triad', q: [0, 4, 7], sym: '' },
    min: { ko: '단3화음', en: 'Minor triad', q: [0, 3, 7], sym: 'm' },
    maj7: { ko: '장7화음', en: 'Major 7th', q: [0, 4, 7, 11], sym: 'maj7' },
    dom7: { ko: '딸림7화음', en: 'Dominant 7th', q: [0, 4, 7, 10], sym: '7' },
    min7: { ko: '단7화음', en: 'Minor 7th', q: [0, 3, 7, 10], sym: 'm7' },
  };
  // 배치: 근음 위 반음 수 (chord.q 기준으로 계산)
  const VOICE = {
    close: { ko: '밀집 배치 (근음 위로 3도 쌓기)', en: 'Close (stacked 3rds on the root)', f: (q) => q.slice() },
    open: { ko: '개리 배치 (근음, 5도, 10도, 14도)', en: 'Open (root, 5th, 10th, 14th)', f: (q) => (q.length > 3 ? [0, 7, q[1] + 12, q[3] + 12] : [0, 7, q[1] + 12]) },
    shell: { ko: '셸 보이싱 (근음, 7도, 10도)', en: 'Shell (root, 7th, 10th)', f: (q) => (q.length > 3 ? [0, q[3], q[1] + 12] : [0, 12, q[1] + 12]) },
  };
  // 편곡에서 흔히 쓰는 음정별 최저 음 기준 (아래 음 MIDI). 이보다 낮으면 탁해지기 쉬움
  const LIL = { 1: 52, 2: 51, 3: 48, 4: 46, 5: 46, 6: 47, 7: 34, 8: 41, 9: 41, 10: 41, 11: 41, 13: 40, 14: 39 };
  const IVN = { 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3', 5: 'P4', 6: 'TT', 7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7', 12: 'P8', 13: 'm9', 14: 'M9', 15: 'm10', 16: 'M10', 17: 'P11', 19: 'P12' };
  const HARM = [1, 0.6, 0.45, 0.35, 0.28, 0.22, 0.18, 0.15];

  GTL.register({
    id: 'low-interval-limits',
    title: '낮은 음역의 화음 배치 (목안 기준과 거칠기)',
    summary: '같은 화음도 낮은 음역에서 3도로 촘촘히 쌓으면 배음끼리 부딪혀 탁하고 거칠게 들림. 아래쪽은 5도, 8도로 넓히고 3도는 위로 올리는 개리 배치가 거칠기를 크게 줄임.',
    views: { a: '밀집 배치', b: '개리 배치' },
    controls: '파라미터 표에서 화음과 근음 높이를 바꿈. "소리 켜기"를 누르면 화음을 2초마다 다시 침.',
    info: `
      <p>두 음의 주파수 차이가 귀의 <b>임계 대역(Critical band)</b>보다 좁으면 두 음이 따로 들리지 않고 서로 간섭해 거칠게(Roughness) 들림. 임계 대역은 낮은 음역에서 반음 수로 따지면 훨씬 넓음. 그래서 가운데 C 위에서 깨끗한 장3도가 C2 근처에서는 탁해짐.</p>
      <ul>
        <li><b>목안 기준(Low interval limits)</b>: 편곡에서 흔히 쓰는 경험 규칙. 음정마다 "아래 음이 이보다 낮으면 탁해짐"을 정함. 예: 단3도는 C3, 장3도는 B♭2, 완전5도는 B♭1</li>
        <li><b>개리 배치</b>: 베이스 근처는 8도와 5도만 두고, 3도와 7도는 한 옥타브 위(10도, 14도)로 올림. 피아노 왼손, 현악 편곡, 패드 신스 보이싱의 기본.</li>
        <li><b>거칠기 계산</b>: 이 샘플은 각 음의 배음 8개를 모두 짝지어 Plomp, Levelt 곡선의 Sethares 근사로 거칠기를 더함</li>
      </ul>`,
    diagram: (L) => {
      const pts = [];
      for (let i = 0; i <= 100; i++) { const x = i / 100 * 1.2, d = Math.exp(-3.5 * x * 4) - Math.exp(-5.75 * x * 4); pts.push(`${i ? 'L' : 'M'}${(40 + i * 4.6).toFixed(1)},${(150 - d * 520).toFixed(1)}`); }
      return `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
        <text x="4" y="16" class="t-small t-dim">${L('두 사인파의 거칠기 (Plomp, Levelt). 임계 대역의 약 1/4에서 최대', 'Roughness of two sine tones (Plomp, Levelt). Peaks at about 1/4 of the critical band')}</text>
        <line x1="40" y1="150" x2="510" y2="150" class="d-line"/><line x1="40" y1="150" x2="40" y2="30" class="d-line"/>
        <path d="${pts.join(' ')}" class="d-a"/>
        <text x="500" y="168" text-anchor="end" class="t-small">${L('주파수 차이 / 임계 대역', 'Frequency gap / critical band')}</text>
        <text x="46" y="40" class="t-small">${L('거칠기', 'Roughness')}</text>
        <text x="280" y="90" class="t-small t-dim">${L('같은 장3도라도', 'The same major 3rd')}</text>
        <text x="280" y="106" class="t-small t-b">${L('C4-E4: 차이 68Hz, 임계 대역 밖 → 깨끗함', 'C4-E4: 68 Hz apart, outside the band → clean')}</text>
        <text x="280" y="122" class="t-small t-a">${L('C2-E2: 차이 17Hz, 최대 근처 → 탁함', 'C2-E2: 17 Hz apart, near the peak → muddy')}</text>
      </svg>`;
    },
    look: [
      '기본 상태(C2)에서 A의 빨간 음정 칸이 2개, B는 0개. 거칠기 값도 A가 1.5배 넘게 큼.',
      '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 A는 웅웅거리고, B는 베이스가 또렷함',
      '근음 높이를 C4(60)로 올리면 A도 빨간 칸이 사라지고 거칠기 차이가 줄어듦',
      '오른쪽 아래 곡선은 같은 배치를 낮은 음에서 높은 음으로 옮길 때의 거칠기. 왼쪽(낮은 음)으로 갈수록 A가 급하게 올라감.',
    ],
    refs: [
      { type: 'paper', title: 'Plomp, Levelt, "Tonal Consonance and Critical Bandwidth", Journal of the Acoustical Society of America 38', year: 1965, note: '거칠기와 임계 대역' },
      { type: 'paper', title: 'William A. Sethares, "Local consonance and the relationship between timbre and scale", Journal of the Acoustical Society of America 94(3)', year: 1993, note: '이 샘플의 거칠기 계산식' },
      { type: 'book', title: 'William A. Sethares, Tuning, Timbre, Spectrum, Scale (2nd ed.)', year: 2005, note: '배음이 있는 음의 거칠기 곡선' },
      { type: 'book', title: 'Juan G. Roederer, The Physics and Psychophysics of Music (4th ed.)', year: 2008, note: '임계 대역과 음역별 차이' },
    ],
    params: [
      { key: 'voicing', label: '배치', type: 'select', options: Object.entries(VOICE).map(([k, v]) => ({ value: k, label: v.ko })), a: 'close', b: 'open', group: '화음' },
      { key: 'chord', label: '화음', type: 'select', options: Object.entries(CHORDS).map(([k, v]) => ({ value: k, label: v.ko })), default: 'maj', shared: true, group: '화음' },
      { key: 'root', label: '근음 높이 (MIDI)', type: 'int', min: 28, max: 64, default: 36, shared: true, group: '화음', help: '36 = C2, 48 = C3, 60 = C4' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Voicing in the Low Register (Low Interval Limits and Roughness)',
      summary: 'Stacking a chord in close 3rds in the low register makes the harmonics clash, so it sounds muddy and rough. An open voicing keeps 5ths and octaves at the bottom and moves the 3rd up, which cuts roughness a lot.',
      views: { a: 'Close voicing', b: 'Open voicing' },
      controls: 'Change the chord and the root pitch in the parameter table. Press "Sound on" to hear the chord struck every 2 seconds.',
      info: `
      <p>When two notes are closer than the ear's <b>critical band</b>, they are not heard separately. They interfere and sound rough. In semitones, the critical band is much wider in the low register. So a major 3rd that is clean above middle C gets muddy near C2.</p>
      <ul>
        <li><b>Low interval limits</b>: a common arranging rule of thumb. For each interval it gives the lowest bottom note before it gets muddy. For example, minor 3rd C3, major 3rd B♭2, perfect 5th B♭1.</li>
        <li><b>Open voicing</b>: keep only octaves and 5ths near the bass, and move 3rds and 7ths up an octave (10ths, 14ths). The basis of piano left hand, string writing and synth pad voicing.</li>
        <li><b>Roughness</b>: this sample pairs all 8 harmonics of every note and adds their roughness using Sethares' approximation of the Plomp and Levelt curve.</li>
      </ul>`,
      look: [
        'At the default (C2), A has 2 red interval boxes and B has none. A\'s roughness is several times larger.',
        'Press "Sound on" and switch between A and B. A rumbles, while B keeps a clear bass.',
        'Raise the root to C4 (60). The red boxes in A disappear and the roughness gap shrinks.',
        'The curve at the bottom right shows roughness as the same voicing moves from low to high. Toward the left (low notes), A rises steeply.',
      ],
      refs: ['Roughness and the critical band.', 'The roughness formula used in this sample.', 'Roughness curves for tones with harmonics.', 'The critical band and how it changes with register.'],
      params: {
        voicing: { label: 'Voicing', group: 'Chord', options: Object.fromEntries(Object.entries(VOICE).map(([k, v]) => [k, v.en])) },
        chord: { label: 'Chord', group: 'Chord', options: Object.fromEntries(Object.entries(CHORDS).map(([k, v]) => [k, v.en])) },
        root: { label: 'Root pitch (MIDI)', group: 'Chord', help: '36 = C2, 48 = C3, 60 = C4' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      // Sethares의 거칠기 (배음 쌍마다 더함)
      const rough = (ms) => {
        const parts = [];
        ms.forEach((m) => { const f = A.mtof(m); HARM.forEach((a, h) => parts.push([f * (h + 1), a])); });
        let d = 0;
        for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
          const [f1, a1] = parts[i][0] < parts[j][0] ? parts[i] : parts[j], [f2, a2] = parts[i][0] < parts[j][0] ? parts[j] : parts[i];
          const s = 0.24 / (0.0207 * f1 + 18.96), x = f2 - f1;
          d += Math.min(a1, a2) * (Math.exp(-3.51 * s * x) - Math.exp(-5.75 * s * x));
        }
        return d;
      };
      const voiced = (root) => { const ch = CHORDS[P.chord] || CHORDS.maj, v = VOICE[P.voicing] || VOICE.close; return v.f(ch.q).map((s) => root + s); };
      let ck = '', ms = [], r = 0, curve = [], checks = [];
      function plan() {
        const k = `${P.voicing}|${P.chord}|${P.root}`;
        if (k === ck) return;
        ck = k;
        ms = voiced(+P.root);
        r = rough(ms);
        curve = [];
        for (let m = 28; m <= 64; m++) curve.push(rough(voiced(m)));
        checks = [];
        for (let i = 1; i < ms.length; i++) {
          const iv = ms[i] - ms[i - 1], lim = LIL[iv];
          checks.push({ lo: ms[i - 1], hi: ms[i], iv, lim, bad: lim != null && ms[i - 1] < lim });
        }
      }
      const song = () => { plan(); return { key: ck, len: 2, poly: ms.length, notes: ms.map((m) => ({ t: 0, d: 1.6, m })) }; };
      const snd = K.synth(ctx, song, { harm: HARM, decay: 0.6, release: 0.2 });

      return {
        update() { snd.update(); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
          const kh = Math.max(34, H * 0.14), marks = {};
          ms.forEach((m) => { marks[m] = col; });
          const kx = A.drawKeyboard(g, pad, 30, W - pad * 2, kh, 24, 84, marks);
          // 큰보표
          const sp = U.clamp((H - kh - 150) / 15, 4, 10), sy = 30 + kh + sp * 4;
          const sw = Math.min(W * 0.36, sp * 22);
          const yOf = K.staff(g, pad, sy, sw, sp);
          K.chord(g, pad + sw * 0.62, ms.map((m) => K.fromMidi(m, true)), yOf, sp, () => col);
          // 음정 칸 (아래에서 위로)
          const tx = pad + sw + 18, rowH = 20;
          D.text(g, Lg('이웃한 음 사이 음정 (아래 음 / 기준)', 'Adjacent intervals (bottom note / limit)'), tx, sy - sp * 2, { size: 10, color: C.dim });
          checks.slice().reverse().forEach((c, i) => {
            const y = sy - sp * 2 + 16 + i * rowH;
            D.rect(g, tx, y, Math.min(260, W - tx - pad), rowH - 3, c.bad ? 'rgba(255,83,112,0.45)' : 'rgba(102,209,122,0.2)');
            D.text(g, `${IVN[c.iv] || c.iv + 'st'}  ${A.noteName(c.lo, true)} / ${c.lim != null ? A.noteName(c.lim, true) : '-'}`, tx + 6, y + 3, { size: 11, color: C.text });
          });
          // 거칠기 막대와 음역 곡선
          const cy = sy + sp * 14, ch = H - cy - pad;
          if (ch > 50) {
            const mx = Math.max(...curve) * 1.05;
            const bx = tx, bw = Math.min(260, W - tx - pad);
            D.text(g, Lg(`거칠기 ${r.toFixed(2)}`, `Roughness ${r.toFixed(2)}`), pad, cy, { size: 14, color: col });
            D.rect(g, pad, cy + 20, Math.min(sw, 200), 10, 'rgba(255,255,255,0.06)');
            D.rect(g, pad, cy + 20, Math.min(sw, 200) * U.clamp(r / mx, 0, 1), 10, col);
            D.rect(g, bx, cy, bw, ch, 'rgba(0,0,0,0.3)');
            g.beginPath();
            curve.forEach((v, i) => { const x = bx + bw * i / (curve.length - 1), y = cy + ch - 4 - (ch - 18) * v / mx; i ? g.lineTo(x, y) : g.moveTo(x, y); });
            g.strokeStyle = col; g.lineWidth = 1.8; g.stroke();
            const ci = +P.root - 28, x = bx + bw * ci / (curve.length - 1), y = cy + ch - 4 - (ch - 18) * curve[ci] / mx;
            D.circle(g, x, y, 4, C.warn);
            D.text(g, Lg('근음 높이별 거칠기 (E1~E4)', 'Roughness by root pitch (E1~E4)'), bx + 4, cy + 3, { size: 9, color: C.dim });
            D.text(g, 'E1', bx + 2, cy + ch - 12, { size: 9, color: C.dim }); D.text(g, 'E4', bx + bw - 14, cy + ch - 12, { size: 9, color: C.dim });
          }
          ctx.stat(Lg('거칠기', 'Roughness'), r.toFixed(2));
          ctx.stat(Lg('목안 기준 위반', 'Low-limit violations'), checks.filter((c) => c.bad).length);
          ctx.stat(Lg('음', 'Notes'), ms.map((m) => A.noteName(m, true)).join(' '));
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
