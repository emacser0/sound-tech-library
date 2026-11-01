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

  // 화음: s = 근음에서 반음 수, gen = 글자 단계 (2 = 3도, 4 = 5도 ...), sym = 코드 기호
  const Q = {
    maj: { sym: '', ko: '장3화음', en: 'Major triad', s: [0, 4, 7], gen: [0, 2, 4] },
    min: { sym: 'm', ko: '단3화음', en: 'Minor triad', s: [0, 3, 7], gen: [0, 2, 4] },
    dim: { sym: '°', ko: '감3화음', en: 'Diminished triad', s: [0, 3, 6], gen: [0, 2, 4] },
    aug: { sym: '+', ko: '증3화음', en: 'Augmented triad', s: [0, 4, 8], gen: [0, 2, 4] },
    sus2: { sym: 'sus2', ko: 'sus2 (3음 대신 2음)', en: 'sus2 (2nd instead of 3rd)', s: [0, 2, 7], gen: [0, 1, 4] },
    sus4: { sym: 'sus4', ko: 'sus4 (3음 대신 4음)', en: 'sus4 (4th instead of 3rd)', s: [0, 5, 7], gen: [0, 3, 4] },
    six: { sym: '6', ko: '부가6화음', en: 'Added 6th', s: [0, 4, 7, 9], gen: [0, 2, 4, 5] },
    maj7: { sym: 'maj7', ko: '장7화음', en: 'Major 7th', s: [0, 4, 7, 11], gen: [0, 2, 4, 6] },
    dom7: { sym: '7', ko: '딸림7화음', en: 'Dominant 7th', s: [0, 4, 7, 10], gen: [0, 2, 4, 6] },
    min7: { sym: 'm7', ko: '단7화음', en: 'Minor 7th', s: [0, 3, 7, 10], gen: [0, 2, 4, 6] },
    hdim7: { sym: 'm7♭5', ko: '반감7화음', en: 'Half-diminished 7th', s: [0, 3, 6, 10], gen: [0, 2, 4, 6] },
    dim7: { sym: '°7', ko: '감7화음', en: 'Diminished 7th', s: [0, 3, 6, 9], gen: [0, 2, 4, 6] },
    mmaj7: { sym: 'm(maj7)', ko: '단장7화음', en: 'Minor-major 7th', s: [0, 3, 7, 11], gen: [0, 2, 4, 6] },
    add9: { sym: 'add9', ko: '부가9화음', en: 'Added 9th', s: [0, 4, 7, 14], gen: [0, 2, 4, 8] },
    dom9: { sym: '9', ko: '딸림9화음', en: 'Dominant 9th', s: [0, 4, 7, 10, 14], gen: [0, 2, 4, 6, 8] },
    maj9: { sym: 'maj9', ko: '장9화음', en: 'Major 9th', s: [0, 4, 7, 11, 14], gen: [0, 2, 4, 6, 8] },
    min9: { sym: 'm9', ko: '단9화음', en: 'Minor 9th', s: [0, 3, 7, 10, 14], gen: [0, 2, 4, 6, 8] },
    dom7b9: { sym: '7♭9', ko: '7♭9 (변화 텐션)', en: '7♭9 (altered tension)', s: [0, 4, 7, 10, 13], gen: [0, 2, 4, 6, 8] },
    dom11: { sym: '11', ko: '11화음 (3음 생략)', en: '11th (3rd omitted)', s: [0, 7, 10, 14, 17], gen: [0, 4, 6, 8, 10] },
    dom13: { sym: '13', ko: '13화음 (11음 생략)', en: '13th (11th omitted)', s: [0, 4, 7, 10, 14, 21], gen: [0, 2, 4, 6, 8, 12] },
  };
  const ROOTS = [['C', 0, 0], ['D♭', 1, -1], ['D', 1, 0], ['E♭', 2, -1], ['E', 2, 0], ['F', 3, 0], ['F♯', 3, 1], ['G', 4, 0], ['A♭', 5, -1], ['A', 5, 0], ['B♭', 6, -1], ['B', 6, 0]];
  const IVN = { 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3', 5: 'P4', 6: 'TT', 7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7', 12: 'P8' };
  const FIG3 = ['5/3', '6', '6/4'], FIG7 = ['7', '6/5', '4/3', '4/2'];
  const INV_KO = ['기본 자리', '첫째 자리바꿈', '둘째 자리바꿈', '셋째 자리바꿈'], INV_EN = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'];

  GTL.register({
    id: 'chord-construction',
    title: '화음 쌓기 (3화음, 7화음, 텐션, 자리바꿈)',
    summary: '근음 위에 3도를 쌓아 3화음, 7화음, 9, 11, 13화음을 만듦. 3도가 장인지 단인지로 화음의 성질이 정해지고, 맨 아래 음을 바꾸는 자리바꿈으로 같은 화음의 다른 모양을 만듦.',
    single: true,
    controls: '파라미터 표에서 근음, 화음 종류, 자리바꿈을 고름. "소리 켜기"를 누르면 한 음씩 펼친 뒤 함께 울림.',
    info: `
      <p><b>화음(Chord)</b>은 높이가 다른 음 3개 이상을 함께 울린 것. 서양 화성의 기본은 근음 위에 3도를 쌓는 방식(3도 쌓기).</p>
      <ul>
        <li><b>3화음</b>: 근음, 3음, 5음. 장3도+단3도 = 장3화음, 단3도+장3도 = 단3화음, 단+단 = 감3화음, 장+장 = 증3화음</li>
        <li><b>7화음</b>: 3도를 하나 더 쌓음. 장3화음 + 단7도 = 딸림7화음(C7). 으뜸음으로 끌려가는 긴장이 큼.</li>
        <li><b>텐션(Tension)</b>: 9음, 11음, 13음. 한 옥타브 위의 2음, 4음, 6음. 재즈와 팝에서 색채를 더함.</li>
        <li><b>자리바꿈(Inversion)</b>: 맨 아래(베이스) 음을 3음, 5음, 7음으로 바꾼 것. 구성음은 같고 베이스 선율이 부드러워짐. 표기는 C/E처럼 슬래시나 숫자 저음(6, 6/4, 6/5)으로 씀.</li>
      </ul>`,
    diagram: (L) => `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" class="t-small t-dim">${L('3도 쌓기: 아래 3도와 위 3도의 조합이 성질을 정함', 'Stacked 3rds: the lower and upper 3rd decide the quality')}</text>
      ${[['C E G', 'M3 + m3', L('장3화음', 'Major'), 'f-b'], ['C E♭ G', 'm3 + M3', L('단3화음', 'Minor'), 'f-a'], ['C E♭ G♭', 'm3 + m3', L('감3화음', 'Diminished'), 'f-dim'], ['C E G♯', 'M3 + M3', L('증3화음', 'Augmented'), 'f-accent']].map(([n, iv, name, cls], i) => `
        <rect x="${20 + i * 130}" y="34" width="110" height="26" rx="4" class="${cls}" opacity="0.6"/>
        <text x="${75 + i * 130}" y="51" text-anchor="middle" class="t-mono">${n}</text>
        <text x="${75 + i * 130}" y="78" text-anchor="middle" class="t-small">${iv}</text>
        <text x="${75 + i * 130}" y="96" text-anchor="middle" class="t-small t-dim">${name}</text>`).join('')}
      <text x="4" y="126" class="t-small t-dim">${L('자리바꿈: 맨 아래 음을 한 옥타브 올림', 'Inversion: move the lowest note up an octave')}</text>
      <text x="20" y="150" class="t-mono">C E G</text><text x="100" y="150" class="t-mono">→</text><text x="130" y="150" class="t-mono">E G C</text><text x="210" y="150" class="t-mono">→</text><text x="240" y="150" class="t-mono">G C E</text>
      <text x="20" y="170" class="t-small t-dim">${L('기본 자리', 'root position')}</text><text x="130" y="170" class="t-small t-dim">C/E (6)</text><text x="240" y="170" class="t-small t-dim">C/G (6/4)</text>
    </svg>`,
    look: [
      '화음을 장3화음에서 단3화음으로 바꾸면 3음 하나만 반음 내려가고, 아래 3도 칸이 M3에서 m3로 바뀜',
      '딸림7화음을 고르고 "소리 켜기"를 누르면 장7화음보다 해결하고 싶은 긴장이 큼',
      '자리바꿈을 1로 올리면 베이스가 3음으로 바뀌고 이름이 C/E, 숫자 저음이 6으로 바뀜',
      '감7화음을 고르면 모든 칸이 m3. 옥타브를 똑같이 4등분해서 근음이 어디인지 모호함.',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '3화음, 7화음, 자리바꿈, 숫자 저음' },
      { type: 'book', title: 'Mark Levine, The Jazz Theory Book', year: 1995, note: '텐션과 코드 기호' },
      { type: 'book', title: 'Walter Piston, Harmony (5th ed., rev. DeVoto)', year: 1987, note: '화음의 구성과 성질' },
    ],
    params: [
      { key: 'root', label: '근음', type: 'select', options: ROOTS.map((r, i) => ({ value: i, label: r[0] })), default: 0, group: '화음' },
      { key: 'q', label: '화음 종류', type: 'select', options: Object.entries(Q).map(([k, v]) => ({ value: k, label: `${v.sym || 'M'}  ${v.ko}` })), default: 'dom7', group: '화음' },
      { key: 'inv', label: '자리바꿈', type: 'int', min: 0, max: 3, default: 0, group: '화음', help: '0 = 기본 자리. 3화음은 2까지' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 60, max: 200, default: 120, group: '재생' },
      ...GTL.audio.params({ single: true }),
    ],
    en: {
      title: 'Building Chords (Triads, Sevenths, Tensions, Inversions)',
      summary: 'Stack 3rds on a root to get triads, 7th chords, and 9th, 11th and 13th chords. Whether each 3rd is major or minor sets the chord quality. An inversion puts another chord tone in the bass and gives the same chord a new shape.',
      controls: 'Pick the root, chord type and inversion in the parameter table. Press "Sound on" to hear the notes one by one, then together.',
      info: `
      <p>A <b>chord</b> is three or more different pitches sounding together. Western harmony builds chords by stacking 3rds on a root.</p>
      <ul>
        <li><b>Triad</b>: root, 3rd and 5th. Major 3rd + minor 3rd = major, minor + major = minor, minor + minor = diminished, major + major = augmented.</li>
        <li><b>7th chord</b>: stack one more 3rd. Major triad + minor 7th = dominant 7th (C7). It pulls strongly toward the tonic.</li>
        <li><b>Tensions</b>: the 9th, 11th and 13th are the 2nd, 4th and 6th an octave up. They add color in jazz and pop.</li>
        <li><b>Inversion</b>: the bass note is the 3rd, 5th or 7th instead of the root. Same notes, smoother bass line. Written as a slash chord (C/E) or with figured bass (6, 6/4, 6/5).</li>
      </ul>`,
      look: [
        'Change the chord from major to minor. Only the 3rd drops a semitone, and the lower 3rd box changes from M3 to m3.',
        'Pick the dominant 7th and press "Sound on". It wants to resolve much more than the major 7th.',
        'Raise inversion to 1. The bass becomes the 3rd, the name becomes C/E, and the figure becomes 6.',
        'Pick the diminished 7th. Every box is m3. It splits the octave into four equal parts, so the root is ambiguous.',
      ],
      refs: ['Triads, 7th chords, inversions, figured bass.', 'Tensions and chord symbols.', 'Chord structure and quality.'],
      params: {
        root: { label: 'Root', group: 'Chord' },
        q: { label: 'Chord type', group: 'Chord', options: Object.fromEntries(Object.entries(Q).map(([k, v]) => [k, `${v.sym || 'M'}  ${v.en}`])) },
        inv: { label: 'Inversion', group: 'Chord', help: '0 = root position. Triads go up to 2.' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const FN = ['1', '♭9', '9', '♯9', '3', '11', '♯11', '5', '♭13', '13', '7', 'M7'];
      const cur = () => {
        const q = Q[P.q] || Q.maj, r = ROOTS[+P.root] || ROOTS[0];
        const root = { l: r[1], a: r[2], o: 3 };
        const tones = q.s.map((s, i) => ({ n: K.above(root, q.gen[i], s), s, gen: q.gen[i], role: i }));
        const inv = Math.min(+P.inv, Math.min(3, tones.length - 1));
        // 자리바꿈: 아래 음 inv개를 한 옥타브 올림
        const voiced = tones.map((t, i) => (i < inv ? { ...t, n: { ...t.n, o: t.n.o + 1 }, up: true } : t));
        voiced.forEach((t) => { t.m = K.midi(t.n); });
        voiced.sort((p, q2) => p.m - q2.m);
        const name = K.name(root) + q.sym, bass = voiced[0];
        const slash = inv ? `${name}/${K.name(bass.n)}` : name;
        const fig = q.s.length === 3 ? FIG3[inv] : q.s.length === 4 ? FIG7[inv] : '-';
        return { q, root, tones, voiced, inv, name, slash, fig };
      };
      const roleName = (t) => {
        const deg = t.gen + 1, s = t.s % 12;
        if (deg === 1) return Lg('근음', 'Root');
        if (deg >= 8) return String(deg);
        if (deg === 3) return Lg('3음', '3rd'); if (deg === 5) return Lg('5음', '5th'); if (deg === 7) return Lg('7음', '7th');
        if (deg === 2) return Lg('2음', '2nd'); if (deg === 4) return Lg('4음', '4th'); if (deg === 6) return Lg('6음', '6th');
        return FN[s];
      };
      const song = () => {
        const c = cur(), b = 60 / P.bpm / 2, ns = [];
        c.voiced.forEach((t, i) => ns.push({ t: i * b, d: b * 0.95, m: t.m }));
        const t0 = c.voiced.length * b + b * 0.5;
        c.voiced.forEach((t) => ns.push({ t: t0, d: b * 6, m: t.m }));
        return { key: `${P.root}|${P.q}|${P.inv}|${P.bpm}`, notes: ns, len: t0 + b * 8, poly: c.voiced.length };
      };
      const snd = K.synth(ctx, song, { decay: 0.8 });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, c = cur(), s = song();
          const on = new Set(s.notes.filter((n) => now >= n.t && now < n.t + n.d).map((n) => n.m));
          // 건반
          const kh = Math.max(34, H * 0.15), marks = {};
          c.voiced.forEach((t) => { marks[t.m] = on.has(t.m) ? C.warn : t.role === 0 ? C.accent : C.b; });
          A.drawKeyboard(g, pad, pad, W - pad * 2, kh, 48, 84, marks);
          // 3도 쌓기 사다리 (기본 자리 기준)
          const top = pad + kh + 16, lh = Math.min(44, (H - top - pad - 14) / c.tones.length), lx = pad, lw = Math.min(200, W * 0.24);
          D.text(g, Lg('쌓은 순서 (근음부터)', 'Stack (from the root)'), lx, top, { size: 10, color: C.dim });
          c.tones.forEach((t, i) => {
            const y = top + 14 + (c.tones.length - 1 - i) * lh;
            D.rect(g, lx, y, lw * 0.62, lh - 4, t.role === 0 ? 'rgba(199,146,234,0.55)' : 'rgba(79,195,247,0.35)');
            D.text(g, `${K.name(t.n)}  ${roleName(t)}`, lx + 6, y + (lh - 4) / 2 - 6, { size: 11, color: C.text });
            if (i > 0) {
              const d = t.s - c.tones[i - 1].s;
              D.text(g, IVN[d] || `${d}`, lx + lw * 0.66, y + lh - 10, { size: 10, color: d === 3 ? C.a : d === 4 ? C.b : C.warn });
            }
          });
          // 큰보표
          const sx = lx + lw + 16, sp = U.clamp((H - top) / 13, 5, 15), sw = Math.min(sp * 26, W * 0.3);
          const yOf = K.staff(g, sx, top + sp * 2, sw, sp);
          K.chord(g, sx + sw * 0.6, c.voiced.map((t) => t.n), yOf, sp, (n) => (on.has(K.midi(n)) ? C.warn : K.midi(n) === c.voiced[0].m ? C.a : C.b));
          // 정보
          const ix = sx + sw + 20, vx = ix + Math.min(110, (W - ix) * 0.4);
          const rows = [
            [Lg('코드 기호', 'Chord symbol'), c.slash],
            [Lg('종류', 'Type'), Lg(c.q.ko, c.q.en)],
            [Lg('구성음', 'Notes'), c.tones.map((t) => K.name(t.n)).join(' ')],
            [Lg('근음에서 음정', 'From root'), c.tones.map((t) => IVN[t.s % 12 || 12] && t.s ? (t.s > 12 ? (t.gen + 1) : IVN[t.s]) : 'R').join(' ')],
            [Lg('자리', 'Position'), Lg(INV_KO[c.inv], INV_EN[c.inv])],
            [Lg('숫자 저음', 'Figured bass'), c.fig],
            [Lg('베이스', 'Bass'), K.name(c.voiced[0].n, 1)],
          ];
          rows.forEach(([k, v], i) => {
            D.text(g, k, ix, top + i * 24, { size: 11, color: C.dim });
            D.text(g, v, vx, top + i * 24, { size: i === 0 ? 16 : 13, color: i === 0 ? C.b : C.text });
          });
          ctx.stat(Lg('코드', 'Chord'), c.slash);
          ctx.stat(Lg('음 수', 'Notes'), c.tones.length);
          ctx.stat(Lg('자리바꿈', 'Inversion'), Lg(INV_KO[c.inv], INV_EN[c.inv]));
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
