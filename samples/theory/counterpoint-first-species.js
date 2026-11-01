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

  // 정선율 (이 샘플을 위해 새로 지은 선율. 흰 건반만 씀)
  const CFS = {
    c1: { ko: 'C 이오니안 (9음)', en: 'C Ionian (9 notes)', m: [60, 62, 65, 64, 67, 65, 64, 62, 60] },
    c2: { ko: 'C 이오니안 (11음)', en: 'C Ionian (11 notes)', m: [60, 64, 62, 65, 64, 69, 67, 65, 64, 62, 60] },
    d1: { ko: 'D 도리안 (11음)', en: 'D Dorian (11 notes)', m: [62, 65, 64, 62, 67, 65, 69, 67, 65, 64, 62] },
  };
  const WH = [0, 2, 4, 5, 7, 9, 11];
  const isWhite = (m) => WH.includes(((m % 12) + 12) % 12);
  const dIdx = (m) => Math.floor(m / 12) * 7 + WH.indexOf(((m % 12) + 12) % 12);
  const fromIdx = (i) => Math.floor(i / 7) * 12 + WH[((i % 7) + 7) % 7];
  const CONS = new Set([3, 4, 7, 8, 9, 0]);   // 반음 mod 12: 3도, 5도, 6도, 8도(0)
  const PERF = (iv) => iv % 12 === 7 || iv % 12 === 0;
  const IVLAB = { 0: '1', 1: 'm2', 2: 'M2', 3: '3', 4: '3', 5: '4', 6: 'TT', 7: '5', 8: '6', 9: '6', 10: 'm7', 11: 'M7' };
  // 규칙 목록 (이름은 화면 표시용)
  const RULES = {
    dis: ['불협화 음정 (4도, 2도, 7도, 트라이톤)', 'Dissonant interval (4th, 2nd, 7th, tritone)'],
    start: ['시작은 1도, 5도, 8도', 'Start on a unison, 5th or octave'],
    end: ['끝은 8도나 1도', 'End on an octave or unison'],
    par: ['평행 5도, 8도', 'Parallel 5ths or octaves'],
    direct: ['비슷한 방향으로 완전음정 진입 (숨은 5도, 8도)', 'Similar motion into a perfect interval (hidden 5th, 8ve)'],
    unison: ['중간의 1도', 'Unison in the middle'],
    leap: ['금지 도약 (6도 넘음, 7도, 트라이톤)', 'Forbidden leap (over a 6th, 7th, tritone)'],
    recover: ['큰 도약 뒤 반대 방향 순차 진행 없음', 'No step back after a large leap'],
    imperf: ['3도, 6도 평행이 4번 이상', '4 or more parallel 3rds or 6ths in a row'],
    cad: ['끝 앞은 장6도 → 8도 (이끎음)', 'Penultimate must be a major 6th → octave (leading tone)'],
    rep: ['같은 음 반복', 'Repeated note'],
    range: ['두 성부 간격이 10도 초과', 'Voices more than a 10th apart'],
    climax: ['최고음이 두 번 이상', 'Highest note appears more than once'],
  };

  GTL.register({
    id: 'counterpoint-first-species',
    title: '대위법 1류 (규칙 검사기와 자동 작성)',
    summary: '정선율 위에 음표 대 음표로 선율을 붙이는 1류 대위법. 3도로 따라가기만 하면 듣기에는 괜찮아도 규칙을 여럿 어기고, 규칙을 제약 조건으로 둔 백트래킹 탐색은 위반 0개인 선율을 찾음.',
    views: { a: '3도로 따라가기', b: '규칙 기반 탐색' },
    controls: '파라미터 표에서 정선율과 작성 방식을 고름. "탐색 시드"를 바꾸면 탐색 결과가 바뀜.',
    info: `
      <p><b>대위법(Counterpoint)</b>은 독립된 선율 여러 개를 동시에 어울리게 짜는 기술. 푹스(Fux)의 「파르나소스 산으로 오르는 계단」(1725)이 정리한 <b>종(Species)</b> 단계가 지금도 교육의 기본.</p>
      <p><b>1류(First species)</b>는 주어진 선율(정선율, Cantus firmus)의 음 하나에 새 음 하나를 붙임. 주요 규칙:</p>
      <ul>
        <li>세로 음정은 모두 협화음(3도, 5도, 6도, 8도). 4도는 불협화로 봄.</li>
        <li>시작은 완전음정, 끝은 8도나 1도. 끝 바로 앞은 장6도 → 8도(위 성부가 이끎음에서 으뜸음으로).</li>
        <li>평행 5도, 8도와, 같은 방향으로 완전음정에 들어가는 것을 피함</li>
        <li>선율은 순차 진행 위주. 큰 도약 뒤에는 반대 방향으로 한 걸음. 3도, 6도 평행은 3번까지.</li>
      </ul>
      <p>B는 규칙을 제약으로 두고 깊이 우선 탐색(백트래킹)으로 음을 하나씩 고름. 반진행(반대 방향)을 우선하고, 막히면 앞 음으로 돌아가 다른 후보를 시도함. 규칙 기반 작곡 시스템의 가장 단순한 형태.</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" class="t-small t-dim">${L('두 성부의 움직임 4가지. 완전음정으로 들어갈 때는 반진행이나 사진행만 허용', 'Four kinds of two-voice motion. Enter perfect intervals only by contrary or oblique motion')}</text>
      ${[[L('반진행', 'Contrary'), 'M20,90 L80,50', 'M20,110 L80,140', 'd-good'], [L('사진행', 'Oblique'), 'M150,60 L210,60', 'M150,130 L210,100', 'd-good'], [L('비슷한 진행', 'Similar'), 'M280,100 L340,50', 'M280,140 L340,110', 'd-accent'], [L('평행', 'Parallel'), 'M410,100 L470,60', 'M410,140 L470,100', 'd-bad']].map(([t, p1, p2, cls], i) => `
        <path d="${p1}" class="${cls}"/><path d="${p2}" class="${cls}"/>
        <text x="${50 + i * 130}" y="162" text-anchor="middle" class="t-small">${t}</text>`).join('')}
      <text x="440" y="40" class="t-small t-dim">5 → 5</text>
    </svg>`,
    look: [
      'A의 오른쪽 위반 목록에 "시작은 1도, 5도, 8도", "끝은 8도나 1도", "3도, 6도 평행이 4번 이상"이 나옴. B는 위반 0개.',
      '"소리 켜기"를 누르고 A를 들으면 듣기 좋지만 두 선율이 한 덩어리로 움직임. B는 서로 다른 방향으로 움직여 두 선율이 따로 들림.',
      'A를 5도로 따라가기로 바꾸면 거의 모든 칸에 빨간 평행 5도 표시가 생김',
      '탐색 시드를 바꾸면 B가 규칙을 지키는 다른 선율을 찾음. "반진행 비율" 측정값이 높을수록 성부가 독립적.',
    ],
    refs: [
      { type: 'book', title: 'Johann Joseph Fux, Gradus ad Parnassum (English: The Study of Counterpoint, tr. Alfred Mann)', year: 1725, note: '종 대위법의 원전' },
      { type: 'book', title: 'Knud Jeppesen, Counterpoint: The Polyphonic Vocal Style of the Sixteenth Century', year: 1939, note: '규칙의 세부와 근거' },
      { type: 'book', title: 'Felix Salzer, Carl Schachter, Counterpoint in Composition', year: 1969, note: '1류 대위법 규칙과 정선율 작성' },
      { type: 'paper', title: 'Bill Schottstaedt, "Automatic Species Counterpoint", Stanford CCRMA Report STAN-M-19', year: 1984, note: '규칙 기반 대위법 자동 작성' },
    ],
    params: [
      { key: 'method', label: '작성 방식', type: 'select', options: [{ value: 'thirds', label: '3도로 따라가기' }, { value: 'fifths', label: '5도로 따라가기' }, { value: 'search', label: '규칙 기반 탐색' }], a: 'thirds', b: 'search', group: '대위법' },
      { key: 'cf', label: '정선율', type: 'select', options: Object.entries(CFS).map(([k, v]) => ({ value: k, label: v.ko })), default: 'c2', shared: true, group: '대위법' },
      { key: 'seed', label: '탐색 시드', type: 'int', min: 1, max: 30, default: 3, shared: true, group: '대위법', help: '같은 정선율에서 다른 해를 찾음' },
      { key: 'bpm', label: '빠르기 (BPM)', type: 'int', min: 40, max: 160, default: 90, shared: true, group: '재생' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'First Species Counterpoint (Rule Checker and Generator)',
      summary: 'First species counterpoint adds one note against each note of a given melody. Simply following it in 3rds sounds fine but breaks several rules. A backtracking search that treats the rules as constraints finds a line with zero violations.',
      views: { a: 'Follow in 3rds', b: 'Rule-based search' },
      controls: 'Pick the cantus firmus and the method in the parameter table. Change the search seed to get a different result.',
      info: `
      <p><b>Counterpoint</b> is the craft of combining independent melodies so they sound good together. The <b>species</b> steps set out in Fux's Gradus ad Parnassum (1725) are still the basis of teaching.</p>
      <p><b>First species</b> puts one new note against each note of a given melody (the cantus firmus). Main rules:</p>
      <ul>
        <li>Every vertical interval is consonant (3rd, 5th, 6th, octave). The 4th counts as dissonant.</li>
        <li>Start on a perfect interval and end on an octave or unison. Just before the end: major 6th → octave (the upper voice goes from leading tone to tonic).</li>
        <li>Avoid parallel 5ths and octaves, and avoid entering a perfect interval in similar motion.</li>
        <li>Lines move mostly by step. After a large leap, step back the other way. At most 3 parallel 3rds or 6ths in a row.</li>
      </ul>
      <p>B treats the rules as constraints and picks notes one at a time with depth-first search (backtracking). It prefers contrary motion, and when stuck it goes back and tries another candidate. This is the simplest form of a rule-based composition system.</p>`,
      look: [
        'A\'s violation list on the right shows "Start on a unison, 5th or octave", "End on an octave or unison" and "4 or more parallel 3rds". B has zero violations.',
        'Press "Sound on" and listen to A. It sounds pleasant, but the two lines move as one block. In B they move in different directions and you hear two separate lines.',
        'Switch A to "Follow in 5ths". Almost every step gets a red parallel 5th mark.',
        'Change the search seed. B finds another line that keeps the rules. A higher "Contrary motion" stat means more independent voices.',
      ],
      refs: ['The original source of species counterpoint.', 'Details and reasons behind the rules.', 'First species rules and writing a cantus firmus.', 'Automatic rule-based species counterpoint.'],
      params: {
        method: { label: 'Method', group: 'Counterpoint', options: { thirds: 'Follow in 3rds', fifths: 'Follow in 5ths', search: 'Rule-based search' } },
        cf: { label: 'Cantus firmus', group: 'Counterpoint', options: Object.fromEntries(Object.entries(CFS).map(([k, v]) => [k, v.en])) },
        seed: { label: 'Search seed', group: 'Counterpoint', help: 'Finds a different solution for the same cantus firmus' },
        bpm: { label: 'Tempo (BPM)', group: 'Playback' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b;

      // 규칙 검사. 반환: [{ i (위치), r (규칙 키) }]
      function check(cf, cp) {
        const v = [], n = cf.length, iv = cf.map((c, i) => cp[i] - c);
        for (let i = 0; i < n; i++) {
          const x = iv[i];
          if (x < 0 || !CONS.has(x % 12)) v.push({ i, r: 'dis' });
          if (x > 16) v.push({ i, r: 'range' });
          if (x === 0 && i > 0 && i < n - 1) v.push({ i, r: 'unison' });
        }
        if (!(iv[0] === 0 || iv[0] === 7 || iv[0] === 12 || iv[0] === 19 || iv[0] === 24)) v.push({ i: 0, r: 'start' });
        if (!(iv[n - 1] % 12 === 0)) v.push({ i: n - 1, r: 'end' });
        if (!(iv[n - 2] % 12 === 9 && cp[n - 1] - cp[n - 2] === 1)) v.push({ i: n - 2, r: 'cad' });
        let run = 0;
        for (let i = 1; i < n; i++) {
          const a = cf[i] - cf[i - 1], b = cp[i] - cp[i - 1];
          if (PERF(iv[i]) && PERF(iv[i - 1]) && iv[i] % 12 === iv[i - 1] % 12 && b !== 0) v.push({ i, r: 'par' });
          else if (PERF(iv[i]) && a !== 0 && b !== 0 && Math.sign(a) === Math.sign(b)) v.push({ i, r: 'direct' });
          const L2 = Math.abs(b);
          if (L2 === 6 || (L2 >= 9 && L2 !== 12) || b === -8) v.push({ i, r: 'leap' });
          if (b === 0) v.push({ i, r: 'rep' });
          if (i >= 2) { const p = cp[i - 1] - cp[i - 2]; if (Math.abs(p) >= 5 && !(Math.abs(b) <= 2 && b !== 0 && Math.sign(b) !== Math.sign(p))) v.push({ i, r: 'recover' }); }
          const imp = [3, 4, 8, 9].includes(iv[i] % 12) && [3, 4, 8, 9].includes(iv[i - 1] % 12) && Math.sign(a) === Math.sign(b) && a !== 0;
          run = imp ? run + 1 : 0;
          if (run === 3) v.push({ i, r: 'imperf' });
        }
        const top = Math.max(...cp);
        if (cp.filter((m) => m === top).length > 1) v.push({ i: cp.indexOf(top), r: 'climax' });
        return v;
      }

      // 3도, 5도로 따라가기 (흰 건반 기준 단계)
      const follow = (cf, steps) => cf.map((m) => fromIdx(dIdx(m) + steps));

      // 규칙 기반 탐색 (깊이 우선 + 되돌아가기)
      function search(cf, seed) {
        const rng = U.rng(seed * 7919 + 13), n = cf.length, fin = cf[n - 1], cp = [];
        const lo = Math.min(...cf), hi = Math.max(...cf) + 16;
        let iters = 0;
        const okPartial = (k) => check(cf.slice(0, k + 1).concat(), cp.slice(0, k + 1)).filter((x) => x.i <= k && x.r !== 'end' && x.r !== 'cad' && x.r !== 'climax');
        function rec(k) {
          if (++iters > 40000) return false;
          if (k === n) { const v = check(cf, cp); return v.length === 0; }
          let cands = [];
          for (let m = lo; m <= hi; m++) {
            const leadTone = k === n - 2 && m % 12 === (fin + 11) % 12;
            if (!isWhite(m) && !leadTone) continue;
            if (m < cf[k]) continue;
            cands.push(m);
          }
          if (k === 0) cands = cands.filter((m) => [7, 12, 19].includes(m - cf[0]));
          if (k === n - 1) cands = cands.filter((m) => (m - fin) % 12 === 0 && m - cp[k - 1] === 1);
          if (k === n - 2) cands = cands.filter((m) => (m - cf[k]) % 12 === 9 && (m % 12) === (fin + 11) % 12);
          // 반진행과 순차 진행을 우선, 나머지는 시드 난수로 섞음
          const sc = cands.map((m) => {
            let s = rng.range(0, 1.5);
            if (k > 0) { const a = cf[k] - cf[k - 1], b = m - cp[k - 1]; if (Math.sign(a) === -Math.sign(b) && b !== 0) s -= 1.2; if (Math.abs(b) <= 2) s -= 0.8; if (Math.abs(b) > 5) s += 1; }
            return { m, s };
          }).sort((p, q) => p.s - q.s);
          for (const { m } of sc) {
            cp[k] = m;
            if (okPartial(k).length === 0 && rec(k + 1)) return true;
          }
          cp.length = k;
          return false;
        }
        const ok = rec(0);
        return { cp: ok ? cp.slice() : follow(cf, 4), ok, iters };
      }

      let ck = '', cf = [], cp = [], viol = [], info = null;
      function plan() {
        const k = `${P.method}|${P.cf}|${P.seed}`;
        if (k === ck) return;
        ck = k;
        cf = (CFS[P.cf] || CFS.c2).m;
        info = null;
        if (P.method === 'thirds') cp = follow(cf, 2);
        else if (P.method === 'fifths') cp = follow(cf, 4);
        else { info = search(cf, P.seed); cp = info.cp; }
        viol = check(cf, cp);
      }
      const song = () => {
        plan();
        const b = 60 / P.bpm, notes = [];
        cf.forEach((m, i) => { notes.push({ t: i * b, d: b * 0.92, m, v: 0.85 }); notes.push({ t: i * b, d: b * 0.92, m: cp[i] }); });
        return { key: ck + P.bpm, notes, len: (cf.length + 1.5) * b, poly: 2 };
      };
      const snd = K.synth(ctx, song, { decay: 0.3, release: 0.08, harm: [1, 0.3, 0.12, 0.06] });
      const clk = K.clock();
      let now = 0;

      return {
        update(dt) { snd.update(); const s = song(); now = snd.on ? snd.pos() : clk.tick(dt, s.len, s.key); },
        render() {
          plan();
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, n = cf.length;
          const hl = Math.min(n - 1, Math.floor(now / (60 / P.bpm)));
          const sw = Math.max(240, W * 0.66), sp = U.clamp((H - 160) / 12, 4, 12), sy = 50 + sp * 2;
          const yOf = K.staff(g, pad, sy, sw, sp);
          const x0 = pad + sp * 6, cw = (sw - sp * 7) / n, xs = cf.map((_, i) => x0 + cw * (i + 0.5));
          const bad = new Set(viol.map((v) => v.i));
          // 성부 선
          for (let i = 1; i < n; i++) {
            const nb = HV_LINE(cf[i - 1]), na = HV_LINE(cf[i]);
            D.line(g, xs[i - 1], yOf(nb), xs[i], yOf(na), 'rgba(125,133,148,0.5)', 1);
            const pb = HV_LINE(cp[i - 1]), pa = HV_LINE(cp[i]);
            const par = viol.some((v) => v.i === i && (v.r === 'par' || v.r === 'direct'));
            D.line(g, xs[i - 1], yOf(pb), xs[i], yOf(pa), par ? C.bad : col, par ? 2.5 : 1.3);
          }
          function HV_LINE(m) { return K.step(K.fromMidi(m)); }
          cf.forEach((m, i) => {
            if (i === hl) D.rect(g, xs[i] - cw / 2 + 1, sy - sp * 2, cw - 2, sp * 14, 'rgba(255,255,255,0.07)');
            K.head(g, xs[i], K.fromMidi(m), yOf, sp, '#d8dde6', { hollow: true });
            K.head(g, xs[i], K.fromMidi(cp[i]), yOf, sp, bad.has(i) ? C.bad : col, { hollow: true });
            const iv = cp[i] - m;
            const gnum = K.step(K.fromMidi(cp[i])) - K.step(K.fromMidi(m)) + 1;
            D.text(g, CONS.has(((iv % 12) + 12) % 12) && iv >= 0 ? String(gnum) : IVLAB[((iv % 12) + 12) % 12], xs[i], sy + sp * 10 + 6, { size: 11, align: 'center', color: CONS.has(((iv % 12) + 12) % 12) && iv >= 0 ? (PERF(iv) ? C.warn : C.text) : C.bad });
          });
          // 움직임 종류
          let contrary = 0;
          for (let i = 1; i < n; i++) {
            const a = cf[i] - cf[i - 1], b = cp[i] - cp[i - 1];
            const t = a === 0 || b === 0 ? (a === b ? '=' : 'O') : Math.sign(a) !== Math.sign(b) ? 'C' : (cp[i] - cf[i]) === (cp[i - 1] - cf[i - 1]) ? 'P' : 'S';
            if (t === 'C') contrary++;
            D.text(g, t, (xs[i - 1] + xs[i]) / 2, sy + sp * 10 + 24, { size: 10, align: 'center', color: t === 'C' ? C.good : t === 'P' ? C.bad : C.dim });
          }
          D.text(g, Lg('숫자 = 세로 음정 (노랑 = 완전음정), C 반진행, S 비슷한 진행, P 평행, O 사진행', 'Numbers = vertical interval (yellow = perfect), C contrary, S similar, P parallel, O oblique'), pad, sy + sp * 10 + 42, { size: 9, color: C.dim });
          D.text(g, Lg('흰 머리 = 정선율, 색 머리 = 대선율', 'White heads = cantus firmus, colored = counterpoint'), pad, 34, { size: 10, color: C.dim });
          // 위반 목록
          const lx = pad + sw + 14;
          if (W - lx > 100) {
            D.text(g, Lg(`위반 ${viol.length}개`, `${viol.length} violations`), lx, sy - sp, { size: 13, color: viol.length ? C.bad : C.good });
            const seen = {};
            viol.forEach((v) => { seen[v.r] = (seen[v.r] || 0) + 1; });
            Object.entries(seen).slice(0, 9).forEach(([r, c], i) => {
              D.text(g, `✗ ${Lg(...RULES[r])} ×${c}`, lx, sy + sp + i * 17, { size: 10, color: C.text });
            });
            if (!viol.length) D.text(g, Lg('✓ 모든 규칙 통과', '✓ All rules pass'), lx, sy + sp, { size: 11, color: C.good });
          }
          ctx.stat(Lg('규칙 위반', 'Rule violations'), viol.length);
          ctx.stat(Lg('반진행 비율', 'Contrary motion'), Math.round(100 * contrary / (n - 1)) + '%');
          if (info) ctx.stat(Lg('탐색 단계 수', 'Search steps'), info.ok ? info.iters : Lg(`${info.iters} (해 없음)`, `${info.iters} (no solution)`));
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
