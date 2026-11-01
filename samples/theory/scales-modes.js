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

  // 음계: s = 으뜸음에서 반음 수, gen = 글자 단계(표기용), ch = 특성음 인덱스
  const SC = {
    ionian: { ko: '이오니안 (장음계)', en: 'Ionian (major)', s: [0, 2, 4, 5, 7, 9, 11], ch: [] },
    dorian: { ko: '도리안', en: 'Dorian', s: [0, 2, 3, 5, 7, 9, 10], ch: [5] },
    phrygian: { ko: '프리지안', en: 'Phrygian', s: [0, 1, 3, 5, 7, 8, 10], ch: [1] },
    lydian: { ko: '리디안', en: 'Lydian', s: [0, 2, 4, 6, 7, 9, 11], ch: [3] },
    mixolydian: { ko: '믹솔리디안', en: 'Mixolydian', s: [0, 2, 4, 5, 7, 9, 10], ch: [6] },
    aeolian: { ko: '에올리안 (자연단음계)', en: 'Aeolian (natural minor)', s: [0, 2, 3, 5, 7, 8, 10], ch: [5] },
    locrian: { ko: '로크리안', en: 'Locrian', s: [0, 1, 3, 5, 6, 8, 10], ch: [1, 4] },
    harmonic: { ko: '화성단음계', en: 'Harmonic minor', s: [0, 2, 3, 5, 7, 8, 11], ch: [6] },
    melodic: { ko: '가락단음계 (상행)', en: 'Melodic minor (ascending)', s: [0, 2, 3, 5, 7, 9, 11], ch: [5, 6] },
    pentaMaj: { ko: '장조 5음 음계', en: 'Major pentatonic', s: [0, 2, 4, 7, 9], gen: [0, 1, 2, 4, 5], ch: [] },
    pentaMin: { ko: '단조 5음 음계', en: 'Minor pentatonic', s: [0, 3, 5, 7, 10], gen: [0, 2, 3, 4, 6], ch: [] },
    blues: { ko: '블루스 음계', en: 'Blues scale', s: [0, 3, 5, 6, 7, 10], gen: [0, 2, 3, 4, 4, 6], ch: [3] },
    whole: { ko: '온음 음계', en: 'Whole-tone scale', s: [0, 2, 4, 6, 8, 10], gen: [0, 1, 2, 3, 4, 5], ch: [] },
  };
  const MAJ = [0, 2, 4, 5, 7, 9, 11];
  const ROOTS = [['C', 0, 0], ['D♭', 1, -1], ['D', 1, 0], ['E♭', 2, -1], ['E', 2, 0], ['F', 3, 0], ['F♯', 3, 1], ['G', 4, 0], ['A♭', 5, -1], ['A', 5, 0], ['B♭', 6, -1], ['B', 6, 0]];
  const scOpts = (lang) => Object.entries(SC).map(([k, v]) => (lang === 'en' ? [k, v.en] : { value: k, label: v.ko }));

  GTL.register({
    id: 'scales-modes',
    title: '음계와 선법 (Scales, Modes)',
    summary: '같은 으뜸음에서 음계와 선법을 바꾸면 반음 위치가 달라지고 분위기가 바뀜. 장음계와 선법을 나란히 놓고 달라진 음(특성음)을 표시함.',
    views: { a: '이오니안 (장음계)', b: '도리안' },
    controls: '파라미터 표에서 뷰마다 음계를 고름. "소리 켜기"를 누르면 음계를 오르내린 뒤 으뜸화음을 들려줌.',
    info: `
      <p><b>음계(Scale)</b>는 한 옥타브 안에서 고른 음들을 높이 순서로 늘어놓은 것. 서양 음악의 기본은 7음 음계이고, 온음(W, 반음 2개)과 반음(H)의 배치로 성격이 정해짐.</p>
      <p><b>선법(Mode)</b>은 같은 흰 건반 7개를 어느 음에서 시작하느냐에 따라 생긴 7가지 음계. C에서 시작하면 이오니안, D에서 시작하면 도리안. 이 샘플은 같은 으뜸음에 맞춰 옮겨 비교함.</p>
      <ul>
        <li><b>특성음</b>: 가까운 장음계나 단음계와 다른 음. 도리안의 ♮6, 리디안의 ♯4, 믹솔리디안의 ♭7, 프리지안의 ♭2</li>
        <li><b>밝기</b>: 반음 수의 합이 클수록 밝게 들림. 리디안 &gt; 이오니안 &gt; 믹솔리디안 &gt; 도리안 &gt; 에올리안 &gt; 프리지안 &gt; 로크리안</li>
        <li><b>단음계 3종</b>: 자연단음계, 이끎음을 올린 화성단음계, 6음과 7음을 올린 가락단음계</li>
        <li><b>5음 음계</b>: 반음이 없어서 어떤 순서로 쳐도 크게 부딪히지 않음</li>
      </ul>`,
    diagram: (L) => {
      const pat = ['W', 'W', 'H', 'W', 'W', 'W', 'H', 'W', 'W', 'H', 'W', 'W', 'W'];
      const names = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
      let s = '';
      for (let i = 0; i < 14; i++) s += `<text x="${30 + i * 36}" y="44" text-anchor="middle" class="t-mono">${names[i]}</text>`;
      for (let i = 0; i < 13; i++) s += `<text x="${48 + i * 36}" y="66" text-anchor="middle" class="t-small ${pat[i] === 'H' ? 't-a' : 't-dim'}">${pat[i]}</text>`;
      return `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
        <text x="4" y="16" class="t-small t-dim">${L('흰 건반의 온음(W), 반음(H) 배치. 시작하는 음이 선법을 정함', 'Whole (W) and half (H) steps on the white keys. The starting note picks the mode')}</text>
        ${s}
        <rect x="16" y="80" width="280" height="16" class="f-a" opacity="0.5"/><text x="156" y="92" text-anchor="middle" class="t-small">${L('C 이오니안: W W H W W W H', 'C Ionian: W W H W W W H')}</text>
        <rect x="52" y="104" width="280" height="16" class="f-b" opacity="0.5"/><text x="192" y="116" text-anchor="middle" class="t-small">${L('D 도리안: W H W W W H W', 'D Dorian: W H W W W H W')}</text>
        <text x="4" y="142" class="t-small t-dim">${L('같은 음들이라도 반음(H)의 위치가 바뀌어 다른 분위기가 됨', 'Same notes, but the half steps fall in other places, so the mood changes')}</text>
      </svg>`;
    },
    look: [
      '기본 상태에서 B의 6번째 음이 강조됨. 도리안은 자연단음계에서 6음만 반음 올린 선법',
      'B를 리디안으로 바꾸면 ♯4 하나만 다르고, 밝기 값이 +1로 올라감',
      '"소리 켜기"를 누르고 소리 내는 뷰를 A와 B로 바꿔 들으면 마지막 으뜸화음의 장단도 바뀜',
      '5음 음계를 고르면 반음(H) 칸이 사라짐. 아무 음이나 쳐도 부딪힘이 적은 이유',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '장음계, 단음계 3종' },
      { type: 'book', title: 'Dmitri Tymoczko, A Geometry of Music', year: 2011, note: '음계와 선법의 구조, 밝기 순서' },
      { type: 'book', title: 'Mark Levine, The Jazz Theory Book', year: 1995, note: '재즈에서 쓰는 선법과 특성음' },
      { type: 'article', title: 'Open Music Theory, "Modes" (Gotham et al.)', url: 'https://viva.pressbooks.pub/openmusictheory/', note: '공개 음악 이론 교재' },
    ],
    params: [
      { key: 'scale', label: '음계', type: 'select', options: scOpts('ko'), a: 'ionian', b: 'dorian', group: '음계' },
      { key: 'root', label: '으뜸음', type: 'select', options: ROOTS.map((r, i) => ({ value: i, label: r[0] })), default: 0, shared: true, group: '음계' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 60, max: 240, default: 160, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Scales and Modes',
      summary: 'With the same tonic, changing the scale or mode moves the half steps and changes the mood. The major scale and a mode sit side by side, and the notes that differ (characteristic notes) are marked.',
      views: { a: 'Ionian (major)', b: 'Dorian' },
      controls: 'Pick a scale for each view in the parameter table. Press "Sound on" to hear the scale go up and down, then the tonic chord.',
      info: `
      <p>A <b>scale</b> is a set of notes within one octave, listed in pitch order. Western music is built on 7-note scales, and their character comes from where the whole steps (W, 2 semitones) and half steps (H) fall.</p>
      <p>A <b>mode</b> is one of the 7 scales you get by starting the same 7 white keys on a different note. Start on C and you get Ionian, start on D and you get Dorian. This sample moves every mode to the same tonic so you can compare them.</p>
      <ul>
        <li><b>Characteristic note</b>: the note that differs from the nearest major or minor scale. Dorian ♮6, Lydian ♯4, Mixolydian ♭7, Phrygian ♭2.</li>
        <li><b>Brightness</b>: the larger the sum of semitones, the brighter it sounds. Lydian &gt; Ionian &gt; Mixolydian &gt; Dorian &gt; Aeolian &gt; Phrygian &gt; Locrian.</li>
        <li><b>Three minor scales</b>: natural minor, harmonic minor (raised leading tone), and melodic minor (raised 6th and 7th).</li>
        <li><b>Pentatonic scales</b> have no half steps, so notes rarely clash in any order.</li>
      </ul>`,
      look: [
        'By default, B marks its 6th note. Dorian is natural minor with only the 6th raised by a semitone.',
        'Switch B to Lydian. Only ♯4 differs, and brightness goes up to +1.',
        'Press "Sound on" and switch the view that plays sound between A and B. The final tonic chord also changes between major and minor.',
        'Pick a pentatonic scale. The half-step (H) boxes disappear, which is why almost any note order sounds fine.',
      ],
      refs: ['Major scale and the three minor scales.', 'Structure of scales and modes, brightness order.', 'Modes and characteristic notes in jazz.', 'Free open music theory textbook.'],
      params: {
        scale: { label: 'Scale', group: 'Scale', options: Object.fromEntries(scOpts('en')) },
        root: { label: 'Tonic', group: 'Scale' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      const cur = () => {
        const sc = SC[P.scale] || SC.ionian, r = ROOTS[+P.root] || ROOTS[0];
        const root = { l: r[1], a: r[2], o: 4 };
        const gen = sc.gen || sc.s.map((_, i) => i);
        const notes = sc.s.map((s, i) => K.above(root, gen[i], s));
        notes.push(K.above(root, 7, 12));
        return { sc, root, notes, midi: notes.map(K.midi) };
      };
      const song = () => {
        const c = cur(), b = 60 / P.bpm / 2, ns = [];
        const up = c.midi, seq = up.concat(up.slice(0, -1).reverse());
        seq.forEach((m, i) => ns.push({ t: i * b, d: b * 0.9, m }));
        const t0 = seq.length * b + b;
        // 으뜸화음: 1, 3, 5번째 음 (7음 음계일 때). 아니면 1, 3번째 음과 옥타브
        const tri = c.sc.s.length === 7 ? [0, 2, 4] : [0, 2, 3];
        tri.forEach((i) => ns.push({ t: t0, d: b * 5, m: c.midi[i] }));
        ns.push({ t: t0, d: b * 5, m: c.midi[0] - 12 });
        return { key: `${P.scale}|${P.root}|${P.bpm}`, notes: ns, len: t0 + b * 7, poly: 4 };
      };
      const snd = K.synth(ctx, song, { decay: 1.4 });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          const g = ctx.g, W = ctx.width, H = ctx.height, c = cur(), s = song(), pad = 10;
          const on = s.notes.filter((n) => now >= n.t && now < n.t + n.d).map((n) => n.m);
          // 건반
          const kh = Math.max(34, H * 0.15), marks = {};
          c.midi.forEach((m, i) => { marks[m] = i === 0 || i === c.midi.length - 1 ? C.accent : c.sc.ch.includes(i) ? C.warn : col; });
          on.forEach((m) => { marks[m] = '#ffffff'; });
          const lo = c.midi[0] - (A.isBlackKey(c.midi[0]) ? 1 : 0);
          A.drawKeyboard(g, pad, 28, W - pad * 2, kh, Math.min(lo, 60), Math.max(c.midi[c.midi.length - 1] + 1, 84), marks);
          // 오선
          const sp = U.clamp(H * 0.022, 5, 10), sy = 28 + kh + sp * 3, sw = W - pad * 2;
          const yOf = K.staff(g, pad, sy, sw, sp, { bass: false });
          const x0 = pad + sp * 6, dx = (sw - sp * 8) / c.notes.length;
          c.notes.forEach((n, i) => {
            const x = x0 + dx * (i + 0.5);
            const hl = on.includes(c.midi[i]);
            K.head(g, x, n, yOf, sp, hl ? '#ffffff' : c.sc.ch.includes(i) ? C.warn : col);
            // 장음계 대비 도수 이름
            let lab = String((c.sc.gen || c.sc.s.map((_, k) => k))[i] % 7 + 1);
            if (i < c.sc.s.length) { const gi = (c.sc.gen || c.sc.s.map((_, k) => k))[i]; const d = c.sc.s[i] - MAJ[gi]; lab = (d > 0 ? '♯' : d < 0 ? '♭' : '') + (gi + 1); }
            else lab = '8';
            D.text(g, lab, x, sy + sp * 6.2, { size: 11, align: 'center', color: c.sc.ch.includes(i) ? C.warn : C.dim });
            D.text(g, K.name(n), x, sy + sp * 7.8, { size: 11, align: 'center', color: C.text });
          });
          // 온음, 반음 칸
          const ry = sy + sp * 7.8 + 22, rh = 18;
          for (let i = 0; i < c.notes.length - 1; i++) {
            const st = c.midi[i + 1] - c.midi[i], x = x0 + dx * (i + 0.5) + 4;
            const lab = st === 1 ? 'H' : st === 2 ? 'W' : `${st}H`;
            D.rect(g, x, ry, dx - 8, rh, st === 1 ? 'rgba(255,122,89,0.35)' : st === 2 ? 'rgba(79,195,247,0.25)' : 'rgba(199,146,234,0.35)');
            D.text(g, lab, x + (dx - 8) / 2, ry + 3, { size: 11, align: 'center', color: C.text });
          }
          // 음 높이 시계 (12개 음, 선법의 다각형)
          const cy = ry + rh + (H - ry - rh) / 2, R = Math.max(14, Math.min((H - ry - rh) / 2 - 16, W * 0.2));
          const cx = W - pad - R - 18;
          const pt = (k, rr) => [cx + rr * Math.sin(k / 12 * Math.PI * 2), cy - rr * Math.cos(k / 12 * Math.PI * 2)];
          D.circle(g, cx, cy, R, null, C.grid, 1);
          D.poly(g, c.sc.s.map((k) => { const [x, y] = pt(k, R); return { x, y }; }), 'rgba(255,255,255,0.06)', col, 1.5, true);
          for (let k = 0; k < 12; k++) {
            const [x, y] = pt(k, R), inS = c.sc.s.indexOf(k);
            D.circle(g, x, y, 4, inS >= 0 ? (inS === 0 ? C.accent : c.sc.ch.includes(inS) ? C.warn : col) : 'rgba(125,133,148,0.4)');
            const [lx, ly] = pt(k, R + 11);
            D.text(g, String(k), lx, ly - 5, { size: 9, align: 'center', color: C.dim });
          }
          // 설명 글자
          const bright = c.sc.s.length === 7 ? c.sc.s.reduce((a, b) => a + b, 0) - MAJ.reduce((a, b) => a + b, 0) : null;
          D.text(g, Lg(c.sc.ko, c.sc.en), pad, ry + rh + 12, { size: 14, color: col });
          D.text(g, Lg('주황 = 특성음, 보라 = 으뜸음', 'Orange-yellow = characteristic note, purple = tonic'), pad, ry + rh + 32, { size: 10, color: C.dim });
          ctx.stat(Lg('음 수', 'Notes'), c.sc.s.length);
          ctx.stat(Lg('간격 패턴', 'Step pattern'), c.midi.slice(1).map((m, i) => (m - c.midi[i] === 1 ? 'H' : m - c.midi[i] === 2 ? 'W' : (m - c.midi[i]) + 'H')).join(' '));
          ctx.stat(Lg('밝기 (장음계 대비)', 'Brightness (vs major)'), bright == null ? '-' : (bright > 0 ? '+' : '') + bright);
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
