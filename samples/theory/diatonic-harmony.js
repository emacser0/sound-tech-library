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

  const MODES = {
    major: { ko: '장조', en: 'Major', s: [0, 2, 4, 5, 7, 9, 11], fn: ['T', 'S', 'T', 'S', 'D', 'T', 'D'] },
    natural: { ko: '단조 (자연단음계)', en: 'Minor (natural)', s: [0, 2, 3, 5, 7, 8, 10], fn: ['T', 'S', 'T', 'S', 'D', 'T', 'D'] },
    harmonic: { ko: '단조 (화성단음계)', en: 'Minor (harmonic)', s: [0, 2, 3, 5, 7, 8, 11], fn: ['T', 'S', 'T', 'S', 'D', 'T', 'D'] },
  };
  const ROOTS = [['C', 0, 0], ['D', 1, 0], ['E♭', 2, -1], ['E', 2, 0], ['F', 3, 0], ['G', 4, 0], ['A', 5, 0], ['B♭', 6, -1]];
  const RN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  // 3도, 5도, 7도 반음 수 → 성질
  const QUAL = {
    '4,7': ['', 'maj', 'M'], '3,7': ['m', 'min', 'm'], '3,6': ['°', 'dim', 'd'], '4,8': ['+', 'aug', 'A'],
    '4,7,11': ['maj7', 'maj7', 'M'], '4,7,10': ['7', 'dom7', 'M'], '3,7,10': ['m7', 'min7', 'm'], '3,6,10': ['m7♭5', 'hdim7', 'd'],
    '3,6,9': ['°7', 'dim7', 'd'], '3,7,11': ['m(maj7)', 'mmaj7', 'm'], '4,8,11': ['+maj7', 'augmaj7', 'A'],
  };
  const FNC = { T: '#66d17a', S: '#ffcb6b', D: '#ff5370' };

  GTL.register({
    id: 'diatonic-harmony',
    title: '음계 안의 화음과 기능 (로마 숫자, T S D)',
    summary: '음계의 각 음 위에 그 음계의 음만으로 3도를 쌓으면 7개 화음이 생김. 장조와 단조는 같은 자리의 화음 성질이 달라서, 로마 숫자와 으뜸(T), 버금딸림(S), 딸림(D) 기능으로 비교함.',
    views: { a: '장조', b: '단조 (화성단음계)' },
    controls: '파라미터 표에서 뷰마다 장단조를 고름. "소리 켜기"를 누르면 I부터 vii까지 차례로 울리고 I로 돌아옴.',
    info: `
      <p><b>음계 안의 화음(Diatonic chord)</b>은 음계의 음만 써서 각 음 위에 3도를 쌓은 화음. 7음 음계라면 화음도 7개.</p>
      <ul>
        <li><b>로마 숫자</b>: 근음이 음계의 몇 번째 음인지. 대문자 = 장3화음, 소문자 = 단3화음, ° = 감3화음, + = 증3화음. 조가 바뀌어도 같은 진행을 같은 이름으로 부를 수 있음.</li>
        <li><b>기능(Function)</b>: 으뜸(T, 안정), 버금딸림(S, 출발), 딸림(D, 긴장). 진행은 대개 T → S → D → T로 흐름.</li>
        <li><b>딸림화음의 이끎음</b>: V의 3음은 으뜸음 반음 아래의 이끎음. 자연단음계에서는 이 음이 온음 아래라 v가 단3화음이 되고 끌어당김이 약함. 그래서 화성단음계로 7음을 올려 V를 장3화음으로 만듦.</li>
      </ul>`,
    diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
      <text x="4" y="16" class="t-small t-dim">${L('화성 기능의 흐름 (장조)', 'Flow of harmonic function (major)')}</text>
      <rect x="30" y="40" width="130" height="56" rx="6" class="f-good" opacity="0.35"/><text x="95" y="62" text-anchor="middle">${L('으뜸 T', 'Tonic T')}</text><text x="95" y="82" text-anchor="middle" class="t-mono t-small">I  vi  (iii)</text>
      <rect x="205" y="40" width="130" height="56" rx="6" class="f-accent" opacity="0.35"/><text x="270" y="62" text-anchor="middle">${L('버금딸림 S', 'Subdominant S')}</text><text x="270" y="82" text-anchor="middle" class="t-mono t-small">IV  ii</text>
      <rect x="380" y="40" width="130" height="56" rx="6" class="f-bad" opacity="0.35"/><text x="445" y="62" text-anchor="middle">${L('딸림 D', 'Dominant D')}</text><text x="445" y="82" text-anchor="middle" class="t-mono t-small">V  vii°</text>
      <path d="M162,68 L203,68" class="d-accent" marker-end="url(#arr)"/><path d="M337,68 L378,68" class="d-accent" marker-end="url(#arr)"/>
      <path d="M445,98 Q445,140 270,140 Q95,140 95,100" class="d-accent" marker-end="url(#arr)"/>
      <text x="270" y="158" text-anchor="middle" class="t-small t-dim">${L('D → T가 가장 강한 해결. T에서 D로 바로 가도 됨', 'D → T is the strongest resolution. T can also go straight to D')}</text>
    </svg>`,
    look: [
      '기본 상태에서 A의 V는 장3화음이고 B의 V도 장3화음. B의 III은 증3화음(+)으로 바뀜.',
      'B를 자연단음계로 바꾸면 V가 소문자 v로 바뀌고, "소리 켜기"로 들으면 마지막 i로 끌리는 힘이 약해짐',
      '"7화음"을 켜면 A의 V7만 딸림7화음, B에서는 vii°7이 감7화음이 됨',
      '조를 바꿔도 로마 숫자와 기능 색은 그대로. 바뀌는 것은 코드 기호뿐.',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '음계 안의 화음과 단조의 이끎음' },
      { type: 'book', title: 'Hugo Riemann, Vereinfachte Harmonielehre', year: 1893, note: '으뜸, 버금딸림, 딸림 기능 이론의 원전' },
      { type: 'book', title: 'Walter Piston, Harmony (5th ed., rev. DeVoto)', year: 1987, note: '로마 숫자 분석과 화음 진행 경향' },
      { type: 'book', title: 'Stefan Kostka, Dorothy Payne, Tonal Harmony', note: '로마 숫자 표기 관례' },
    ],
    params: [
      { key: 'mode', label: '조성', type: 'select', options: Object.entries(MODES).map(([k, v]) => ({ value: k, label: v.ko })), a: 'major', b: 'harmonic', group: '조' },
      { key: 'key', label: '으뜸음', type: 'select', options: ROOTS.map((r, i) => ({ value: i, label: r[0] })), default: 0, shared: true, group: '조' },
      { key: 'sev', label: '7화음', type: 'bool', default: false, shared: true, group: '조', help: '3도를 하나 더 쌓아 7화음으로 만듦' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 50, max: 180, default: 96, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Diatonic Chords and Function (Roman Numerals, T S D)',
      summary: 'Stack 3rds on each note of a scale using only scale notes, and you get 7 chords. Major and minor keys give different qualities in the same positions, so they are compared with Roman numerals and tonic (T), subdominant (S) and dominant (D) functions.',
      views: { a: 'Major', b: 'Minor (harmonic)' },
      controls: 'Pick major or minor for each view in the parameter table. Press "Sound on" to hear I through vii, then I again.',
      info: `
      <p>A <b>diatonic chord</b> uses only the notes of the scale, stacked in 3rds on each scale note. A 7-note scale gives 7 chords.</p>
      <ul>
        <li><b>Roman numerals</b> tell which scale degree is the root. Uppercase = major triad, lowercase = minor, ° = diminished, + = augmented. The same progression keeps the same name in any key.</li>
        <li><b>Function</b>: tonic (T, at rest), subdominant (S, moving away), dominant (D, tension). Progressions usually flow T → S → D → T.</li>
        <li><b>Leading tone of the dominant</b>: the 3rd of V is the leading tone, a semitone below the tonic. In natural minor it is a whole step below, so v is minor and pulls weakly. Harmonic minor raises the 7th to make V major.</li>
      </ul>`,
      look: [
        'By default, V is major in both A and B. In B, III becomes augmented (+).',
        'Switch B to natural minor. V becomes lowercase v. With "Sound on" the pull back to i is weaker.',
        'Turn on "7th chords". In A only V7 is a dominant 7th. In B, vii°7 becomes a diminished 7th.',
        'Change the key. Roman numerals and function colors stay the same. Only the chord symbols change.',
      ],
      refs: ['Diatonic chords and the leading tone in minor.', 'Original source of the tonic, subdominant and dominant function theory.', 'Roman numeral analysis and progression tendencies.', 'Roman numeral conventions.'],
      params: {
        mode: { label: 'Mode', group: 'Key', options: Object.fromEntries(Object.entries(MODES).map(([k, v]) => [k, v.en])) },
        key: { label: 'Tonic', group: 'Key' },
        sev: { label: '7th chords', group: 'Key', help: 'Stack one more 3rd to make 7th chords' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      const chords = () => {
        const md = MODES[P.mode] || MODES.major, r = ROOTS[+P.key] || ROOTS[0];
        const tonic = { l: r[1], a: r[2], o: 3 };
        const sc = [];
        for (let i = 0; i < 14; i++) sc.push(K.above(tonic, i, md.s[i % 7] + 12 * Math.floor(i / 7)));
        const out = [];
        for (let d = 0; d < 7; d++) {
          const idx = P.sev ? [d, d + 2, d + 4, d + 6] : [d, d + 2, d + 4];
          const ns = idx.map((i) => sc[i]);
          const ms = ns.map(K.midi);
          const key = ms.slice(1).map((m) => m - ms[0]).join(',');
          const q = QUAL[key] || ['?', '?', 'M'];
          let rn = q[2] === 'M' || q[2] === 'A' ? RN[d] : RN[d].toLowerCase();
          // 단조에서 반음 내린 음 위의 화음은 ♭을 붙이지 않음 (단조 기준 로마 숫자)
          if (q[1] === 'dim') rn += '°'; else if (q[1] === 'aug') rn += '+';
          else if (q[1] === 'hdim7') rn += 'ø7'; else if (q[1] === 'dim7') rn += '°7';
          else if (q[1] === 'dom7' || q[1] === 'min7') rn += '7'; else if (q[1] === 'maj7') rn += 'maj7';
          else if (q[1] === 'mmaj7') rn += '(maj7)'; else if (q[1] === 'augmaj7') rn += '+maj7';
          out.push({ d, ns, ms, q, rn, sym: K.name(ns[0]) + q[0], fn: md.fn[d] });
        }
        return { md, out };
      };
      const order = [0, 1, 2, 3, 4, 5, 6, 0];
      const song = () => {
        const { out } = chords(), b = 60 / P.bpm * 2, notes = [];
        order.forEach((d, i) => {
          const c = out[d];
          notes.push({ t: i * b, d: b * 0.92, m: c.ms[0] - 12 + (c.ms[0] < 48 ? 12 : 0), v: 0.8 });
          c.ms.forEach((m) => notes.push({ t: i * b, d: b * 0.92, m: m + 12 }));
        });
        return { key: `${P.mode}|${P.key}|${P.sev}|${P.bpm}`, notes, len: order.length * b + b * 0.5, poly: 5 };
      };
      const snd = K.synth(ctx, song, { decay: 1.0 });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, { md, out } = chords();
          const b = 60 / P.bpm * 2, pi = Math.min(order.length - 1, Math.floor(now / b)), cd = order[pi];
          // 건반 (지금 화음)
          const kh = Math.max(30, H * 0.12), marks = {};
          out[cd].ms.forEach((m, i) => { marks[m + 12] = i === 0 ? C.accent : col; });
          A.drawKeyboard(g, pad, 30, W - pad * 2, kh, 60, 96, marks);
          // 큰보표 + 화음 8개
          const sp = U.clamp(H * 0.03, 4, 12), sy = 30 + kh + sp * 3, sw = W - pad * 2;
          const yOf = K.staff(g, pad, sy, sw, sp);
          const x0 = pad + sp * 7, cw = (sw - sp * 8) / order.length;
          order.forEach((d, i) => {
            const c = out[d], x = x0 + cw * (i + 0.5);
            if (i === pi) D.rect(g, x - cw / 2 + 2, sy - sp * 2, cw - 4, sp * 14, 'rgba(255,255,255,0.06)');
            const up = c.ns.map((n) => ({ ...n, o: n.o + 1 }));
            K.chord(g, x, up, yOf, sp, () => (i === pi ? C.warn : col));
            // 베이스 (근음, 낮은음자리표)
            K.head(g, x, { ...c.ns[0], o: c.ns[0].o - (K.midi(c.ns[0]) >= 48 ? 0 : -1) }, yOf, sp, i === pi ? C.warn : col);
          });
          // 로마 숫자, 코드 기호, 기능
          const ly = sy + sp * 10 + 8;
          order.forEach((d, i) => {
            const c = out[d], x = x0 + cw * (i + 0.5);
            D.text(g, c.rn, x, ly, { size: Math.min(16, cw * 0.32), align: 'center', color: i === pi ? C.warn : C.text });
            D.text(g, c.sym, x, ly + 20, { size: Math.min(11, cw * 0.22), align: 'center', color: C.dim });
            D.rect(g, x - cw * 0.35, ly + 36, cw * 0.7, 16, FNC[c.fn]);
            D.text(g, c.fn, x, ly + 38, { size: 10, align: 'center', color: '#111' });
          });
          const fy = ly + 62;
          D.text(g, Lg('T = 으뜸, S = 버금딸림, D = 딸림', 'T = tonic, S = subdominant, D = dominant'), pad, fy, { size: 10, color: C.dim });
          const counts = { M: 0, m: 0, d: 0, A: 0 };
          out.forEach((c) => { counts[c.q[2]]++; });
          const lead = out[4].ms[1] % 12 === (out[0].ms[0] + 11) % 12;
          ctx.stat(Lg('장, 단, 감, 증', 'Major, minor, dim, aug'), `${counts.M}, ${counts.m}, ${counts.d}, ${counts.A}`);
          ctx.stat(Lg('V의 3음이 이끎음', 'V has a leading tone'), lead ? Lg('예', 'Yes') : Lg('아니오 (온음 아래)', 'No (whole step below)'));
          ctx.stat(Lg('지금 화음', 'Current chord'), `${out[cd].rn} (${out[cd].sym})`);
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
