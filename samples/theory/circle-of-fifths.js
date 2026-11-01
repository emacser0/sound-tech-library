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

  const KEYS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const MINOR = ['c', 'c♯', 'd', 'e♭', 'e', 'f', 'f♯', 'g', 'g♯', 'a', 'b♭', 'b'];
  const MAJ = [0, 2, 4, 5, 7, 9, 11];
  // 조표: 5도권 위치 k(0~11). 1~6 = 올림표 k개, 7~11 = 내림표 12-k개
  const SHARP_STEPS = [38, 35, 39, 36, 33, 37, 34];  // F5 C5 G5 D5 A4 E5 B4 (온음계 단계)
  const FLAT_STEPS = [34, 37, 33, 36, 32, 35, 31];   // B4 E5 A4 D5 G4 C5 F4
  const fifthPos = (pc) => (pc * 7) % 12;

  GTL.register({
    id: 'circle-of-fifths',
    title: '5도권 (Circle of Fifths)',
    summary: '12개 음을 반음 순서로 놓으면 한 조의 음이 흩어지지만, 완전5도 순서로 놓으면 7개가 한 덩어리로 모임. 이웃한 조는 음 6개를 공유해서 조옮김과 화음 진행의 지도가 됨.',
    views: { a: '반음 순서 원', b: '5도권' },
    controls: '파라미터 표에서 조를 고름. "원 따라 걷기"를 켜면 원을 한 칸씩 돌며 장3화음을 들려줌.',
    info: `
      <p><b>5도권(Circle of Fifths)</b>은 C에서 시작해 완전5도(반음 7개)씩 올라가며 12개 음을 원 위에 놓은 그림. C, G, D, A, E, B, F♯ 다음 D♭, A♭, E♭, B♭, F를 거쳐 다시 C로 돌아옴. 7과 12가 서로소라서 12개 음을 모두 한 번씩 지남.</p>
      <ul>
        <li><b>조표</b>: 시계 방향으로 한 칸 갈 때마다 올림표가 하나 늘고, 반대 방향은 내림표가 하나 늘어남</li>
        <li><b>가까운 조</b>: 이웃한 두 조는 7개 음 중 6개를 공유. 조옮김이 자연스러운 이유</li>
        <li><b>화음 진행</b>: 근음이 5도 아래로 가는 진행(V → I, ii → V)은 원에서 반시계 방향 한 칸</li>
        <li><b>나란한조</b>: 안쪽의 소문자는 같은 조표를 쓰는 단조 (C 장조와 a 단조)</li>
      </ul>
      <p>반음 순서 원에서는 한 조의 7개 음이 흩어져서 이런 관계가 보이지 않음. 두 원은 같은 12개 음을 다른 순서로 놓은 것뿐.</p>`,
    diagram: (L) => {
      const pt = (i, r, cx) => [cx + r * Math.sin(i / 12 * Math.PI * 2), 100 - r * Math.cos(i / 12 * Math.PI * 2)];
      const ring = (cx, order, cls) => order.map((n, i) => { const [x, y] = pt(i, 62, cx), inS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(n); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" class="${inS ? cls : 'f-dim'}"/><text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle" class="t-small">${n}</text>`; }).join('');
      return `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
        ${ring(130, ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'], 'f-a')}
        ${ring(410, ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'], 'f-b')}
        <text x="130" y="104" text-anchor="middle" class="t-small t-a">${L('반음 순서', 'Semitone order')}</text>
        <text x="410" y="104" text-anchor="middle" class="t-small t-b">${L('5도 순서', 'Fifths order')}</text>
        <text x="270" y="196" text-anchor="middle" class="t-small t-dim">${L('색칠한 원 = C 장조의 7개 음. 5도 순서에서는 한쪽에 모임', 'Filled = the 7 notes of C major. In fifths order they sit together')}</text>
      </svg>`;
    },
    look: [
      '기본 상태에서 A의 C 장조 음은 원 둘레에 흩어지고, B는 원의 한쪽 7칸에 모여 있음',
      '조를 G로 바꾸면 B에서는 모인 덩어리가 한 칸만 돌아감. A에서는 다각형 모양이 크게 바뀜.',
      '"소리 켜기"를 누르고 B를 들으면 5도씩 내려가는 화음이 계속 이어지는 느낌. A는 반음씩 미끄러짐.',
      '"이웃 조와 공통음" 측정값은 B에서 6개, A에서 2개',
    ],
    refs: [
      { type: 'book', title: 'Aldwell, Schachter, Cadwallader, Harmony and Voice Leading (5th ed.)', year: 2018, note: '조표와 5도권' },
      { type: 'book', title: 'Johann David Heinichen, Der General-Bass in der Composition', year: 1728, note: '조의 원(musicalischer Circul)의 초기 형태' },
      { type: 'book', title: 'Dmitri Tymoczko, A Geometry of Music', year: 2011, note: '음계 사이의 거리와 5도권' },
      { type: 'article', title: 'Open Music Theory, "Key signatures" (Gotham et al.)', url: 'https://viva.pressbooks.pub/openmusictheory/', note: '공개 음악 이론 교재' },
    ],
    params: [
      { key: 'order', label: '원의 순서', type: 'select', options: [{ value: 'chrom', label: '반음 순서' }, { value: 'fifths', label: '5도 순서' }], a: 'chrom', b: 'fifths', group: '원' },
      { key: 'key', label: '조 (장조)', type: 'select', options: KEYS.map((k, i) => ({ value: i, label: k })), default: 0, shared: true, group: '원' },
      { key: 'walk', label: '원 따라 걷기', type: 'bool', default: true, shared: true, group: '원', help: '켜면 원을 한 칸씩 돌며 조를 바꿈. 끄면 고른 조의 I IV V I' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 50, max: 180, default: 100, shared: true, group: '원' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Circle of Fifths',
      summary: 'Placing the 12 notes in semitone order scatters the notes of a key. Placing them in perfect 5ths puts all 7 together. Neighboring keys share 6 notes, so the circle is a map for modulation and chord progressions.',
      views: { a: 'Semitone circle', b: 'Circle of fifths' },
      controls: 'Pick a key in the parameter table. Turn on "Walk the circle" to step around the circle one position at a time and hear a major triad on each.',
      info: `
      <p>The <b>circle of fifths</b> starts at C and goes up a perfect 5th (7 semitones) at a time: C, G, D, A, E, B, F♯, then D♭, A♭, E♭, B♭, F and back to C. Because 7 and 12 share no factor, it visits all 12 notes once.</p>
      <ul>
        <li><b>Key signatures</b>: each step clockwise adds one sharp, each step counterclockwise adds one flat.</li>
        <li><b>Close keys</b>: two neighboring keys share 6 of their 7 notes. This is why modulating to them sounds natural.</li>
        <li><b>Chord progressions</b>: a root falling a 5th (V → I, ii → V) is one step counterclockwise.</li>
        <li><b>Relative minor</b>: the lowercase names inside are the minor keys with the same signature (C major and A minor).</li>
      </ul>
      <p>In the semitone circle the 7 notes of a key are scattered, so these links are hidden. Both circles hold the same 12 notes in a different order.</p>`,
      look: [
        'By default, the notes of C major are spread around A\'s circle. In B they fill 7 neighboring positions.',
        'Change the key to G. In B the group rotates by only one position. In A the polygon changes shape a lot.',
        'Press "Sound on" and listen to B. Chords falling by 5ths lead into each other. A slides by semitones.',
        'The "Common notes with neighbor key" stat is 6 in B and 2 in A.',
      ],
      refs: ['Key signatures and the circle of fifths.', 'An early form of the circle of keys (musicalischer Circul).', 'Distances between scales and the circle of fifths.', 'Free open music theory textbook.'],
      params: {
        order: { label: 'Circle order', group: 'Circle', options: { chrom: 'Semitone order', fifths: 'Fifths order' } },
        key: { label: 'Key (major)', group: 'Circle' },
        walk: { label: 'Walk the circle', group: 'Circle', help: 'On: step around the circle and change key. Off: I IV V I in the chosen key.' },
        bpm: { label: 'Tempo (BPM)', group: 'Circle' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      const posOf = (pc) => (P.order === 'fifths' ? fifthPos(pc) : pc);
      const pcAt = (i) => (P.order === 'fifths' ? (i * 7) % 12 : i);
      const triad = (pc, maj = true) => { const r = 55 + ((pc - 7 + 12) % 12); return [r - 12, r, r + (maj ? 4 : 3), r + 7]; };
      const beat = () => 60 / P.bpm;
      // 걷기: 지금 조에서 원을 따라 12칸. 아니면 I IV V I
      const steps = () => {
        const t = +P.key, out = [];
        if (P.walk) { const p0 = posOf(t); for (let i = 0; i < 12; i++) out.push({ key: pcAt((p0 + i) % 12), root: pcAt((p0 + i) % 12) }); }
        else [0, 5, 7, 0].forEach((iv) => out.push({ key: t, root: (t + iv) % 12 }));
        return out;
      };
      const song = () => {
        const b = beat() * 2, st = steps(), notes = [];
        st.forEach((s, i) => triad(s.root).forEach((m) => notes.push({ t: i * b, d: b * 0.9, m })));
        return { key: `${P.order}|${P.key}|${P.walk}|${P.bpm}`, notes, len: st.length * b + (P.walk ? 0 : b), poly: 4 };
      };
      const snd = K.synth(ctx, song, { decay: 1.0 });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
          const st = steps(), idx = U.clamp(Math.floor(now / (beat() * 2)), 0, st.length - 1), curS = st[idx];
          const key = curS.key, scale = MAJ.map((s) => (key + s) % 12);
          // 원
          const R = Math.max(30, Math.min(W * 0.25, (H - 40) / 2 - 24)), cx = pad + R + 26, cy = 34 + R + 14;
          const pt = (i, r) => [cx + r * Math.sin(i / 12 * Math.PI * 2), cy - r * Math.cos(i / 12 * Math.PI * 2)];
          D.circle(g, cx, cy, R, null, C.grid, 1);
          D.poly(g, scale.slice().sort((p, q) => posOf(p) - posOf(q)).map((pc) => { const [x, y] = pt(posOf(pc), R); return { x, y }; }), 'rgba(255,255,255,0.05)', col, 1.5, true);
          const chord = [curS.root, (curS.root + 4) % 12, (curS.root + 7) % 12];
          for (let pc = 0; pc < 12; pc++) {
            const p = posOf(pc), [x, y] = pt(p, R), inS = scale.includes(pc);
            const rr = Math.max(9, R * 0.13);
            D.circle(g, x, y, rr, chord.includes(pc) ? C.warn : inS ? col : 'rgba(60,66,78,0.9)', pc === key ? '#ffffff' : null, 2);
            D.text(g, KEYS[pc], x, y - 6, { size: Math.min(13, rr), align: 'center', color: inS || chord.includes(pc) ? '#111' : C.text });
            const [ix, iy] = pt(p, R * 0.66);
            D.text(g, MINOR[(pc + 9) % 12], ix, iy - 5, { size: 10, align: 'center', color: C.dim });
          }
          // 가운데: 지금 조와 화음
          D.text(g, Lg(`${KEYS[key]} 장조`, `${KEYS[key]} major`), cx, cy - 18, { size: 13, align: 'center', color: C.text });
          D.text(g, Lg(`화음: ${KEYS[curS.root]}`, `Chord: ${KEYS[curS.root]}`), cx, cy + 2, { size: 11, align: 'center', color: C.warn });
          // 오른쪽: 조표와 정보
          const rx = cx + R + 34, rw = W - rx - pad;
          const kpos = fifthPos(key), nSharp = kpos <= 6 ? kpos : 0, nFlat = kpos > 6 ? 12 - kpos : 0;
          if (rw > 60) {
            const sp = U.clamp(H * 0.02, 5, 9), sy = 44;
            const yOf = K.staff(g, rx, sy, Math.min(rw, sp * 16), sp, { bass: false });
            for (let i = 0; i < nSharp; i++) D.text(g, '♯', rx + sp * 4.6 + i * sp * 1.2, yOf(SHARP_STEPS[i]) - sp * 0.95, { size: sp * 1.8, color: col });
            for (let i = 0; i < nFlat; i++) D.text(g, '♭', rx + sp * 4.6 + i * sp * 1.2, yOf(FLAT_STEPS[i]) - sp * 1.25, { size: sp * 1.8, color: col });
            const ty = sy + sp * 6.5;
            const sig = nSharp ? Lg(`올림표 ${nSharp}개`, `${nSharp} sharp${nSharp > 1 ? 's' : ''}`) : nFlat ? Lg(`내림표 ${nFlat}개`, `${nFlat} flat${nFlat > 1 ? 's' : ''}`) : Lg('조표 없음', 'No sharps or flats');
            const info = [
              [Lg('조표', 'Signature'), sig],
              [Lg('나란한조', 'Relative minor'), Lg(`${MINOR[(key + 9) % 12]} 단조`, `${MINOR[(key + 9) % 12].toUpperCase()} minor`)],
              [Lg('딸림조 (V)', 'Dominant key (V)'), KEYS[(key + 7) % 12]],
              [Lg('버금딸림조 (IV)', 'Subdominant key (IV)'), KEYS[(key + 5) % 12]],
              [Lg('음계', 'Scale'), scale.map((p) => KEYS[p]).join(' ')],
            ];
            info.forEach(([k, v], i) => {
              D.text(g, k, rx, ty + i * 17, { size: 10, color: C.dim });
              D.text(g, v, rx + Math.min(118, rw * 0.45), ty + i * 17, { size: 11, color: C.text });
            });
            // 걷기 순서
            const wy = ty + 5 * 17 + 10;
            D.text(g, Lg('재생 순서 (지금 = 노란색)', 'Play order (now = yellow)'), rx, wy, { size: 10, color: C.dim });
            const cw = Math.max(16, Math.min(30, rw / st.length));
            st.forEach((s, i) => {
              D.rect(g, rx + i * cw, wy + 14, cw - 2, 18, i === idx ? C.warn : 'rgba(255,255,255,0.07)');
              D.text(g, KEYS[s.root], rx + i * cw + (cw - 2) / 2, wy + 17, { size: Math.min(10, cw * 0.45), align: 'center', color: i === idx ? '#111' : C.text });
            });
          }
          // 이웃(원에서 다음 칸) 조와 공통음
          const nb = pcAt((posOf(key) + 1) % 12), nbScale = MAJ.map((s) => (nb + s) % 12);
          const common = scale.filter((p) => nbScale.includes(p)).length;
          ctx.stat(Lg('이웃 조와 공통음', 'Common notes with neighbor key'), `${common} / 7 (${KEYS[key]} → ${KEYS[nb]})`);
          ctx.stat(Lg('음계 다각형 둘레 칸 수', 'Scale arc span'), (() => { const ps = scale.map(posOf).sort((p, q) => p - q); let gap = 0; for (let i = 0; i < 7; i++) gap = Math.max(gap, (ps[(i + 1) % 7] - ps[i] + 12) % 12); return 12 - gap; })());
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
