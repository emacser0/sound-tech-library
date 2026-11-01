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

  const SETS = {
    major: { ko: '장3화음 C E G', en: 'Major triad C E G', p: [0, 4, 7] },
    minor: { ko: '단3화음 C E♭ G', en: 'Minor triad C E♭ G', p: [0, 3, 7] },
    dom7: { ko: '딸림7화음 G B D F', en: 'Dominant 7th G B D F', p: [7, 11, 2, 5] },
    tristan: { ko: '트리스탄 화음 F B D♯ G♯', en: 'Tristan chord F B D♯ G♯', p: [5, 11, 3, 8] },
    dim7: { ko: '감7화음', en: 'Diminished 7th', p: [0, 3, 6, 9] },
    aug: { ko: '증3화음', en: 'Augmented triad', p: [0, 4, 8] },
    vienna: { ko: '빈 3화음 C F♯ B (016)', en: 'Viennese trichord C F♯ B (016)', p: [0, 6, 11] },
    allint: { ko: '모든 음정 4음 집합 (0146)', en: 'All-interval tetrachord (0146)', p: [0, 1, 4, 6] },
    penta: { ko: '5음 음계', en: 'Pentatonic scale', p: [0, 2, 4, 7, 9] },
    diatonic: { ko: '장음계', en: 'Major scale', p: [0, 2, 4, 5, 7, 9, 11] },
    whole: { ko: '온음 음계', en: 'Whole-tone scale', p: [0, 2, 4, 6, 8, 10] },
    octa: { ko: '8음 음계 (온음-반음)', en: 'Octatonic scale', p: [0, 1, 3, 4, 6, 7, 9, 10] },
  };
  // 잘 알려진 포르테 번호 (프라임 형태 → 이름)
  const FORTE = { '047': '3-11', '037': '3-11', '048': '3-12', '016': '3-5', '012': '3-1', '0258': '4-27', '0369': '4-28', '0146': '4-Z15', '02479': '5-35', '013568A': '7-35', '02468A': '6-35', '0134679A': '8-28' };
  const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const HX = (a) => a.map((x) => (x === 10 ? 'A' : x === 11 ? 'B' : String(x))).join('');
  const mod = (x) => ((x % 12) + 12) % 12;
  // 라안(Rahn) 방식: 끝 음까지 간격, 그다음 끝에서 두 번째 음까지 간격 순으로 작은 쪽이 더 촘촘함
  const packed = (a, b) => { for (let k = a.length - 1; k >= 1; k--) { const da = mod(a[k] - a[0]), db = mod(b[k] - b[0]); if (da !== db) return da - db; } return a[0] - b[0]; };
  const normal = (pcs) => {
    const s = [...new Set(pcs.map(mod))].sort((x, y) => x - y);
    let best = null;
    for (let r = 0; r < s.length; r++) { const rot = s.slice(r).concat(s.slice(0, r)); if (!best || packed(rot, best) < 0) best = rot; }
    return best;
  };
  const zero = (a) => a.map((x) => mod(x - a[0]));
  const prime = (pcs) => { const a = zero(normal(pcs)), b = zero(normal(pcs.map((x) => -x))); return packed(a, b) <= 0 ? a : b; };
  const ivec = (pcs) => { const s = [...new Set(pcs.map(mod))], v = [0, 0, 0, 0, 0, 0]; for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) { const d = mod(s[j] - s[i]), ic = Math.min(d, 12 - d); v[ic - 1]++; } return v; };

  GTL.register({
    id: 'pitch-class-sets',
    title: '음 높이 집합 (이조, 자리바꿈, 프라임 형태)',
    summary: '옥타브와 순서를 무시하고 화음과 음계를 0~11의 집합으로 다루는 방법. 이조(Tn)와 자리바꿈(TnI)을 해도 프라임 형태와 음정 벡터는 그대로라서, 겉모양이 다른 화음이 같은 종류인지 알아낼 수 있음.',
    views: { a: '원래 집합', b: '변환한 집합 (T4I)' },
    controls: '파라미터 표에서 집합을 고르고, 뷰마다 변환과 n을 바꿈. "소리 켜기"를 누르면 집합의 음을 펼친 뒤 함께 울림.',
    info: `
      <p><b>음 높이 집합(Pitch-class set)</b> 이론은 무조 음악 분석을 위해 포르테(Allen Forte)가 정리한 방법. C를 0으로 두고 12개 음을 0~11의 숫자(음 높이 류)로 씀. 옥타브와 순서는 무시함.</p>
      <ul>
        <li><b>이조 Tn</b>: 모든 음에 n을 더함 (mod 12). 시계판에서 회전</li>
        <li><b>자리바꿈 TnI</b>: 모든 음을 x → n - x로 바꿈. 시계판에서 거울 반사. 장3화음의 자리바꿈은 단3화음</li>
        <li><b>정규 형태(Normal form)</b>: 가장 좁은 범위에 들어가게 돌린 순서</li>
        <li><b>프라임 형태(Prime form)</b>: 정규 형태와 그 자리바꿈 중 더 왼쪽으로 촘촘한 것을 0에서 시작하게 옮긴 것. 같은 집합 류(Set class)의 대표 이름</li>
        <li><b>음정 벡터(Interval vector)</b>: 집합 안 모든 두 음 사이의 음정 류(1~6) 개수. 소리의 성격을 요약함</li>
      </ul>
      <p>코드로 다루기 쉬워서 화음 인식, 자동 작곡, 음악 검색의 특징값으로도 씀</p>`,
    diagram: (L) => {
      const pt = (k, r, cx) => [cx + r * Math.sin(k / 12 * Math.PI * 2), 100 - r * Math.cos(k / 12 * Math.PI * 2)];
      const face = (cx, set, cls) => {
        let s = `<circle cx="${cx}" cy="100" r="60" class="d-dim"/>`;
        for (let k = 0; k < 12; k++) { const [x, y] = pt(k, 74, cx); s += `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" class="t-small t-dim">${k}</text>`; }
        s += `<polygon points="${set.map((k) => pt(k, 60, cx).map((v) => v.toFixed(1)).join(',')).join(' ')}" class="${cls}" opacity="0.5"/>`;
        return s;
      };
      return `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
        ${face(110, [0, 4, 7], 'f-a')}${face(400, [0, 3, 7], 'f-b')}
        <line x1="400" y1="30" x2="400" y2="170" class="d-accent" stroke-dasharray="4 3"/>
        <text x="110" y="196" text-anchor="middle" class="t-small t-a">${L('C 장3화음 {0, 4, 7}', 'C major {0, 4, 7}')}</text>
        <text x="400" y="196" text-anchor="middle" class="t-small t-b">${L('T7I → {0, 3, 7} = C 단3화음', 'T7I → {0, 3, 7} = C minor')}</text>
        <text x="255" y="96" text-anchor="middle" class="t-small">${L('거울 반사', 'mirror')}</text>
        <text x="255" y="112" text-anchor="middle" class="t-small t-dim">x → 7 - x</text>
      </svg>`;
    },
    look: [
      '기본 상태에서 B는 A를 거울에 비친 모양. 두 뷰의 프라임 형태와 음정 벡터가 같음.',
      '집합을 장3화음으로 바꾸면 B는 단3화음이 됨. 둘 다 프라임 형태 (037), 같은 집합 류 3-11.',
      '딸림7화음과 트리스탄 화음을 차례로 고르면 둘 다 (0258). 소리는 달라도 같은 집합 류.',
      '감7화음을 고르고 B의 n을 바꿔 보면 T3, T6, T9에서 집합이 그대로. 대칭 집합이라 이조해도 같은 음이 나옴.',
    ],
    refs: [
      { type: 'book', title: 'Allen Forte, The Structure of Atonal Music', year: 1973, note: '집합 류, 정규 형태, 포르테 번호' },
      { type: 'book', title: 'Joseph N. Straus, Introduction to Post-Tonal Theory (4th ed.)', year: 2016, note: '이조, 자리바꿈, 프라임 형태 계산법' },
      { type: 'book', title: 'John Rahn, Basic Atonal Theory', year: 1980, note: '정규 형태의 라안 방식' },
    ],
    params: [
      { key: 'set', label: '집합', type: 'select', options: Object.entries(SETS).map(([k, v]) => ({ value: k, label: v.ko })), default: 'dom7', shared: true, group: '집합' },
      { key: 'op', label: '변환', type: 'select', options: [{ value: 'T', label: 'Tn (이조)' }, { value: 'TI', label: 'TnI (자리바꿈 후 이조)' }], a: 'T', b: 'TI', group: '집합' },
      { key: 'n', label: 'n (반음)', type: 'int', min: 0, max: 11, a: 0, b: 4, default: 0, group: '집합' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 60, max: 220, default: 140, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Pitch-Class Sets (Transposition, Inversion, Prime Form)',
      summary: 'Treats chords and scales as sets of numbers 0 to 11, ignoring octave and order. Transposition (Tn) and inversion (TnI) keep the prime form and interval vector, so you can tell when chords that look different belong to the same kind.',
      views: { a: 'Original set', b: 'Transformed set (T4I)' },
      controls: 'Pick a set in the parameter table, and change the transform and n for each view. Press "Sound on" to hear the notes one by one, then together.',
      info: `
      <p><b>Pitch-class set</b> theory was organized by Allen Forte to analyze atonal music. C is 0, and the 12 notes become numbers 0 to 11 (pitch classes). Octave and order are ignored.</p>
      <ul>
        <li><b>Transposition Tn</b>: add n to every note (mod 12). A rotation on the clock face.</li>
        <li><b>Inversion TnI</b>: map every note x → n - x. A mirror on the clock face. A major triad inverts to a minor triad.</li>
        <li><b>Normal form</b>: the rotation that fits in the smallest span.</li>
        <li><b>Prime form</b>: of the normal form and its inversion, the one packed more to the left, moved to start at 0. It names the set class.</li>
        <li><b>Interval vector</b>: counts of interval classes (1 to 6) between every pair of notes. It sums up the sound.</li>
      </ul>
      <p>It is easy to handle in code, so it is also used as a feature for chord recognition, algorithmic composition and music search.</p>`,
      look: [
        'By default, B is the mirror image of A. Both views show the same prime form and interval vector.',
        'Switch the set to the major triad. B becomes a minor triad. Both have prime form (037), set class 3-11.',
        'Pick the dominant 7th, then the Tristan chord. Both are (0258). They sound different but belong to the same set class.',
        'Pick the diminished 7th and change B\'s n. At T3, T6 and T9 the set stays the same. It is symmetric, so transposing gives back the same notes.',
      ],
      refs: ['Set classes, normal form, Forte numbers.', 'Transposition, inversion and prime form computation.', 'Rahn\'s normal form method.'],
      params: {
        set: { label: 'Set', group: 'Set', options: Object.fromEntries(Object.entries(SETS).map(([k, v]) => [k, v.en])) },
        op: { label: 'Transform', group: 'Set', options: { T: 'Tn (transpose)', TI: 'TnI (invert, then transpose)' } },
        n: { label: 'n (semitones)', group: 'Set' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;
      let ck = '', src = [], out = [], nf = [], pf = [], iv = [];
      function plan() {
        const k = `${P.set}|${P.op}|${P.n}`;
        if (k === ck) return;
        ck = k;
        src = (SETS[P.set] || SETS.major).p;
        out = src.map((x) => (P.op === 'TI' ? mod(+P.n - x) : mod(x + +P.n)));
        nf = normal(out); pf = prime(out); iv = ivec(out);
      }
      const song = () => {
        plan();
        const b = 60 / P.bpm, base = 60, ms = nf.map((p, i) => { let m = base + p; if (i && m <= base + nf[i - 1] + (i > 0 ? 0 : 0)) m += 12; return m; });
        // 정규 형태 순서로 올라가게 배치
        for (let i = 1; i < ms.length; i++) while (ms[i] <= ms[i - 1]) ms[i] += 12;
        const notes = ms.map((m, i) => ({ t: i * b, d: b * 0.9, m }));
        const t0 = ms.length * b + b * 0.5;
        ms.forEach((m) => notes.push({ t: t0, d: b * 5, m }));
        return { key: ck + P.bpm, notes, len: t0 + b * 7, poly: Math.max(3, ms.length) };
      };
      const snd = K.synth(ctx, song, { decay: 0.7 });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
          const R = Math.max(30, Math.min(W * 0.24, (H - 70) / 2 - 20)), cx = pad + R + 24, cy = 40 + R + 16;
          const pt = (k, r) => ({ x: cx + r * Math.sin(k / 12 * Math.PI * 2), y: cy - r * Math.cos(k / 12 * Math.PI * 2) });
          D.circle(g, cx, cy, R, null, C.grid, 1);
          // 원래 집합(흐리게)과 변환한 집합
          const sortP = (a) => [...new Set(a)].sort((x, y) => x - y);
          if (ctx.side === 'b' || +P.n || P.op === 'TI') D.poly(g, sortP(src).map((k) => pt(k, R)), 'rgba(255,255,255,0.04)', 'rgba(216,221,230,0.35)', 1, true);
          D.poly(g, sortP(out).map((k) => pt(k, R)), col + '44', col, 2, true);
          if (P.op === 'TI') {
            // 대칭축: x → n - x는 n/2와 n/2 + 6을 잇는 선에 대한 반사
            const a = pt(+P.n / 2, R + 10), b2 = pt(+P.n / 2 + 6, R + 10);
            g.setLineDash([4, 3]); D.line(g, a.x, a.y, b2.x, b2.y, C.accent, 1.2); g.setLineDash([]);
          }
          for (let k = 0; k < 12; k++) {
            const p = pt(k, R), on = out.includes(k);
            D.circle(g, p.x, p.y, Math.max(8, R * 0.1), on ? col : 'rgba(60,66,78,0.9)');
            D.text(g, String(k), p.x, p.y - 6, { size: Math.min(11, R * 0.1), align: 'center', color: on ? '#111' : C.dim });
            const q = pt(k, R + 22);
            D.text(g, NN[k], q.x, q.y - 5, { size: 9, align: 'center', color: C.dim });
          }
          // 오른쪽: 수치
          const tx = cx + R + 40, vx = tx + Math.min(120, (W - tx) * 0.42);
          const opName = P.op === 'TI' ? `T${P.n}I` : `T${P.n}`;
          const rows = [
            [Lg('변환', 'Transform'), opName],
            [Lg('결과 음', 'Notes'), sortP(out).map((p) => NN[p]).join(' ')],
            [Lg('정규 형태', 'Normal form'), `[${nf.map((x) => HX([x])).join(',')}]`],
            [Lg('프라임 형태', 'Prime form'), `(${HX(pf)})`],
            [Lg('포르테 번호', 'Forte number'), FORTE[HX(pf)] || '-'],
            [Lg('음정 벡터', 'Interval vector'), `<${iv.join('')}>`],
          ];
          if (W - tx > 120) {
            rows.forEach(([k, v], i) => {
              D.text(g, k, tx, 44 + i * 22, { size: 11, color: C.dim });
              D.text(g, v, vx, 44 + i * 22, { size: i === 3 ? 15 : 12, color: i === 3 ? col : C.text });
            });
            // 음정 벡터 막대
            const by = 44 + rows.length * 22 + 14, bh = Math.min(80, H - by - 40), bw = Math.min(30, (W - tx - pad) / 6);
            if (bh > 20) {
              const mx = Math.max(1, ...iv);
              iv.forEach((c, i) => {
                const h = (bh - 14) * c / mx;
                D.rect(g, tx + i * bw + 2, by + bh - 14 - h, bw - 4, h, col);
                D.text(g, String(c), tx + i * bw + bw / 2, by + bh - 28 - h, { size: 10, align: 'center', color: C.text });
                D.text(g, `ic${i + 1}`, tx + i * bw + bw / 2, by + bh - 12, { size: 9, align: 'center', color: C.dim });
              });
            }
          }
          // 같은 집합인지 (대칭 집합)
          const same = sortP(out).join() === sortP(src).join();
          ctx.stat(Lg('프라임 형태', 'Prime form'), `(${HX(pf)}) ${FORTE[HX(pf)] || ''}`);
          ctx.stat(Lg('음정 벡터', 'Interval vector'), `<${iv.join('')}>`);
          ctx.stat(Lg('원래 집합과 같은 음', 'Same notes as original'), same ? (P.op === 'T' && +P.n === 0 ? Lg('변환 없음 (T0)', 'No change (T0)') : Lg('예 (대칭)', 'Yes (symmetric)')) : Lg('아니오', 'No'));
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
