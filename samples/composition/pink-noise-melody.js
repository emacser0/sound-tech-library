// 1/f 멜로디: 백색 잡음(서로 무관) vs 갈색 잡음(누적 걸음) vs 분홍(1/f, Voss 주사위) 음 높이 수열
GTL.register({
  id: 'pink-noise-melody',
  title: '1/f 잡음 멜로디 (Voss 알고리즘)',
  summary: '잡음의 종류로 음 높이를 고르는 멜로디 비교. 백색 잡음은 매번 무관하게 튀고, 갈색 잡음은 지루하게 떠돎. 1/f(분홍) 잡음은 그 중간으로, Voss와 Clarke가 실제 음악에서 측정한 통계와 비슷함.',
  views: { a: '백색 잡음 (1/f⁰)', b: '분홍 잡음 (1/f, Voss)' },
  info: `
    <p>Voss와 Clarke(1975)는 라디오 음악과 말소리의 음 높이, 음량 변화를 분석해서 그 스펙트럼이 대략 <b>1/f</b>을 따른다는 결과를 냈음. 느린 변화와 빠른 변화가 고르게 섞인 상태.</p>
    <ul>
      <li><b>백색 잡음 (1/f⁰)</b>: 모든 음이 서로 독립. 기억이 없어 매번 놀랍지만 금방 지루해짐.</li>
      <li><b>갈색 잡음 (1/f²)</b>: 앞 음에서 조금씩 걸어감 (랜덤 워크). 예측하기 쉬워 방향 없이 떠도는 느낌.</li>
      <li><b>분홍 잡음 (1/f)</b>: 둘 사이. 짧게는 변하고 길게는 기억함.</li>
    </ul>
    <p><b>Voss 알고리즘</b> (Gardner 1978 소개): 주사위 여러 개를 더한 값을 씀. 매 음마다 카운터를 1 늘리고, 이진수에서 바뀐 자리의 주사위만 다시 던짐. 1번 주사위는 매번, 2번은 2음마다, 3번은 4음마다 바뀌므로 여러 시간 규모의 변화가 합쳐져 1/f에 가까워짐.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('Voss: 카운터의 이진수에서 바뀐 자리의 주사위만 다시 던짐', 'Voss: reroll only the dice whose counter bit changed')}</text>
    ${[0, 1, 2].map((d) => {
      const per = 1 << d, y = 40 + d * 34;
      return `<text x="4" y="${y + 14}" class="t-small">${L('주사위', 'Die')} ${d + 1}</text>` + Array.from({ length: 16 / per }, (_, i) => `<rect x="${80 + i * per * 26}" y="${y}" width="${per * 26 - 3}" height="20" class="${(i + d) % 2 ? 'f-b' : 'f-dim'}"/>`).join('');
    }).join('')}
    <text x="4" y="158" class="t-small">${L('합 = 음 높이', 'Sum = pitch')}</text>
    <path d="M80,160 L132,152 L184,148 L236,156 L288,140 L340,144 L392,150 L444,136 L496,142" class="d-b"/>
    <text x="510" y="56" class="t-small t-dim">${L('매번', 'every')}</text>
    <text x="510" y="90" class="t-small t-dim">2</text>
    <text x="510" y="124" class="t-small t-dim">4</text>
  </svg>`,
  look: [
    'A의 음 높이 선은 위아래로 마구 튐. B는 작은 변화 위에 큰 오르내림이 겹친 모양.',
    '왼쪽 아래 스펙트럼의 기울기 측정값: 백색 ≈ 0, 분홍 ≈ -1, 갈색 ≈ -2',
    '잡음 종류를 갈색으로 바꾸면 음정 이동 히스토그램이 0과 ±1에 몰리고 선율이 오래 한 영역에 머묾',
    '"소리 켜기"를 누르고 세 종류를 번갈아 들어 보면 분홍이 가장 "노래 같은" 느낌',
  ],
  refs: [
    { type: 'paper', title: 'Richard F. Voss, John Clarke, "1/f noise in music and speech", Nature 258', year: 1975, note: '음악의 음 높이, 음량 변동이 1/f 스펙트럼을 따름' },
    { type: 'article', title: 'Martin Gardner, "Mathematical Games: White and brown music, fractal curves and one-over-f fluctuations", Scientific American', year: 1978, note: 'Voss 주사위 알고리즘 소개' },
    { type: 'article', title: 'Robin Whittle, "DSP generation of Pink (1/f) Noise"', url: 'http://www.firstpr.com.au/dsp/pink-noise/', note: 'Voss-McCartney 변형과 필터 방식 정리' },
    { type: 'book', title: 'Charles Dodge, Thomas A. Jerse, Computer Music: Synthesis, Composition, and Performance', year: 1997, note: '1/f 잡음을 쓴 알고리즘 작곡 예제' },
  ],
  params: [
    { key: 'noise', label: '잡음 종류', type: 'select', options: [{ value: 'white', label: '백색 (1/f⁰)' }, { value: 'pink', label: '분홍 (1/f, Voss)' }, { value: 'brown', label: '갈색 (1/f², 랜덤 워크)' }], a: 'white', b: 'pink', group: '멜로디' },
    { key: 'scale', label: '음계', type: 'select', options: [{ value: 'penta', label: '장5음 음계' }, { value: 'major', label: '장음계' }, { value: 'chrom', label: '반음계' }], default: 'penta', shared: true },
    { key: 'regen', label: '멜로디', type: 'button', buttonLabel: '다시 만들기' },
    { key: 'bpm', label: '템포 (BPM)', type: 'int', min: 60, max: 160, default: 100, shared: true, help: '한 음 = 8분음표' },
    ...GTL.audio.params(),
  ],
  en: {
    title: '1/f Noise Melody (Voss Algorithm)',
    summary: 'Melodies whose pitches come from different kinds of noise. White noise jumps with no relation, and brown noise wanders dully. 1/f (pink) noise sits between them and resembles the statistics Voss and Clarke measured in real music.',
    views: { a: 'White noise (1/f⁰)', b: 'Pink noise (1/f, Voss)' },
    info: `
    <p>Voss and Clarke (1975) analyzed pitch and loudness changes in radio music and speech. They found spectra close to <b>1/f</b>: slow and fast changes are mixed evenly.</p>
    <ul>
      <li><b>White noise (1/f⁰)</b>: each note is independent. No memory, so every note surprises, but it gets boring fast.</li>
      <li><b>Brown noise (1/f²)</b>: walks a little from the last note (random walk). Easy to predict, it drifts with no direction.</li>
      <li><b>Pink noise (1/f)</b>: in between. It changes in the short term and remembers in the long term.</li>
    </ul>
    <p><b>Voss algorithm</b> (made known by Gardner in 1978): add several dice. Increase a counter on each note and reroll only the dice whose binary digit changed. Die 1 changes every note, die 2 every 2 notes, die 3 every 4 notes. Changes on many time scales add up to roughly 1/f.</p>`,
    look: [
      'A\'s pitch line jumps wildly. B shows big rises and falls with small changes on top.',
      'Spectrum slope stat (lower left): white ≈ 0, pink ≈ -1, brown ≈ -2.',
      'Switch to brown noise. The interval histogram piles up at 0 and ±1, and the melody stays in one area for a long time.',
      'Press "Sound on" and switch between the three. Pink sounds the most like a song.',
    ],
    refs: ['Pitch and loudness fluctuations in music follow a 1/f spectrum.', 'Introduces the Voss dice algorithm.', 'Voss-McCartney variant and filter methods.', 'Algorithmic composition examples with 1/f noise.'],
    params: {
      noise: { label: 'Noise type', group: 'Melody', options: { white: 'White (1/f⁰)', pink: 'Pink (1/f, Voss)', brown: 'Brown (1/f², random walk)' } },
      scale: { label: 'Scale', options: { penta: 'Major pentatonic', major: 'Major', chrom: 'Chromatic' } },
      regen: { label: 'Melody', buttonLabel: 'Regenerate' },
      bpm: { label: 'Tempo (BPM)', help: 'One note = an 8th note' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const L = (k, e) => GTL.L(k, e);
    const col = ctx.side === 'a' ? C.a : C.b;
    // ── 작은 드럼, 음 합성기 (이 카테고리 샘플마다 같은 코드를 둠). 시드 노이즈, 블록 안 샘플 위치에서 시작 ──
    function makeKit(seed) {
      let s = (seed >>> 0) || 1;
      const nz = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 2147483648 - 1; };
      const vs = [];
      const LEN = { kick: 0.6, snare: 0.35, hat: 0.12, ohat: 0.5, clap: 0.35, rim: 0.08, tom: 0.5, bell: 0.9 };
      return {
        vs,
        // kind: kick, snare, hat, ohat, clap, rim, tom, bell, tone, bass. at: 블록 안 시작 샘플. o: { vel, f, dur, pan, cut }
        trig(kind, at, o = {}) {
          if (vs.length > 48) vs.shift();
          vs.push({ kind, at: Math.max(0, at | 0), t: 0, vel: o.vel ?? 1, f: o.f || 220, dur: o.dur || 0.2, pan: o.pan || 0, cut: o.cut || 0, ph: 0, lp: 0, lp2: 0, x1: 0 });
        },
        render(Lb, Rb, n, sr) {
          Lb.fill(0); Rb.fill(0);
          const dt = 1 / sr, T = 6.283185307;
          for (let j = vs.length - 1; j >= 0; j--) {
            const v = vs[j];
            const end = v.kind === 'tone' || v.kind === 'bass' ? v.dur + 0.12 : LEN[v.kind] || 0.3;
            const gl = v.vel * (1 - Math.max(0, v.pan)), gr = v.vel * (1 + Math.min(0, v.pan));
            for (let i = v.at; i < n && v.t < end; i++) {
              const t = v.t; let y = 0;
              switch (v.kind) {
                case 'kick': { v.ph += (48 + 120 * Math.exp(-t * 28)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 6) * 0.9; break; }
                case 'tom': { v.ph += (v.f * 0.5 + v.f * 0.3 * Math.exp(-t * 20)) * dt; y = Math.sin(T * v.ph) * Math.exp(-t * 8) * 0.6; break; }
                case 'snare': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.35 * Math.exp(-t * 18) + Math.sin(T * 185 * t) * 0.4 * Math.exp(-t * 25); break; }
                case 'hat': case 'ohat': { const w = nz(), h = w - v.x1; v.x1 = w; y = h * 0.16 * Math.exp(-t * (v.kind === 'hat' ? 50 : 9)); break; }
                case 'clap': {
                  const w = nz(), h = w - v.x1; v.x1 = w; let e = 0;
                  for (let k = 0; k < 3; k++) { const tk = t - k * 0.011; if (tk >= 0) e += Math.exp(-tk * 140); }
                  if (t > 0.022) e += Math.exp(-(t - 0.022) * 16) * 0.6;
                  y = h * 0.3 * e; break;
                }
                case 'rim': y = Math.sin(T * 1650 * t) * Math.exp(-t * 80) * 0.45; break;
                case 'bell': y = (Math.sin(T * v.f * t) + 0.4 * Math.sin(T * v.f * 2.76 * t)) * Math.exp(-t * 5) * 0.35 * Math.min(1, t / 0.002); break;
                default: { // tone, bass: 톱니파(+삼각파) + 2차 원폴 로우패스, 짧은 어택과 릴리스
                  v.ph += v.f * dt; v.ph -= Math.floor(v.ph);
                  const bass = v.kind === 'bass';
                  const raw = bass ? (2 * v.ph - 1) * 0.5 + (4 * Math.abs(v.ph - 0.5) - 1) * 0.6 : 2 * v.ph - 1;
                  const c = v.cut || (bass ? 0.05 : 0.12);
                  v.lp += c * (raw - v.lp); v.lp2 += c * (v.lp - v.lp2);
                  const env = Math.min(1, t / 0.004) * (t < v.dur ? 1 : Math.max(0, 1 - (t - v.dur) / 0.12)) * (bass ? Math.exp(-t * 1.2) : Math.exp(-t * 2.5));
                  y = v.lp2 * env * (bass ? 0.9 : 0.7);
                }
              }
              Lb[i] += y * gl; Rb[i] += y * gr;
              v.t += dt;
            }
            v.at = 0;
            if (v.t >= end) vs.splice(j, 1);
          }
          for (let i = 0; i < n; i++) { Lb[i] = Math.tanh(Lb[i] * 1.1) * 0.6; Rb[i] = Math.tanh(Rb[i] * 1.1) * 0.6; }
        },
      };
    }
    // 시드 해시 (0~1). 같은 i, salt면 같은 값. 화면과 소리가 같은 난수를 씀
    const hash = (i, salt = 0) => {
      let x = (Math.imul(i | 0, 2654435761) ^ Math.imul((salt | 0) + 1 + ctx.seed, 2246822519)) >>> 0;
      x ^= x >>> 15; x = Math.imul(x, 2246822519); x ^= x >>> 13; x = Math.imul(x, 3266489917); x ^= x >>> 16;
      return (x >>> 0) / 4294967296;
    };
    // 반복 이벤트 목록(evs: [{ t, ... }], 0 <= t < len) 중 [t0, t1)에 걸리는 것을 fn(e, 절대 시각)으로 넘김
    const loopEach = (evs, len, t0, t1, fn) => {
      if (!(len > 0)) return;
      for (let c = Math.floor(t0 / len); c * len < t1; c++) for (const e of evs) { const t = c * len + e.t; if (t >= t0 && t < t1) fn(e, t); }
    };
    // 재생 시계: 소리가 꺼져 있으면 update의 dt로, 켜져 있으면 오디오 블록으로 진행. 일시정지 중에는 소리를 멈춤
    const clock = { t: 0, seen: 0 };
    const kit = makeKit(ctx.seed * 7 + 3);
    const runAudio = (l, r, sr, n, schedule) => {
      if (ctx.now() - clock.seen > 400) { l.fill(0); r.fill(0); return; }
      const t0 = clock.t, t1 = t0 + n / sr;
      schedule(t0, t1, (kind, t, o) => kit.trig(kind, (t - t0) * sr, o));
      kit.render(l, r, n, sr);
      clock.t = t1;
    };
    const tick = (dt) => { clock.seen = ctx.now(); if (!snd.on) clock.t += dt; snd.update(); };
    // 뷰 왼쪽 위의 뷰 이름 표시와 겹치지 않게 그림 전체를 TOP만큼 내림
    const TOP = 26;
    const SCALES = { penta: [0, 2, 4, 7, 9], major: [0, 2, 4, 5, 7, 9, 11], chrom: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };
    // 0~1 수열 생성
    function series(kind, n, seed) {
      const r = U.rng(seed), out = new Float64Array(n);
      if (kind === 'white') for (let i = 0; i < n; i++) out[i] = r.next();
      else if (kind === 'brown') {
        let x = 0.5;
        for (let i = 0; i < n; i++) { x += r.gauss() * 0.06; if (x < 0) x = -x; if (x > 1) x = 2 - x; out[i] = x; }
      } else {
        const ND = 6, dice = Array.from({ length: ND }, () => r.next());
        for (let i = 0; i < n; i++) {
          const changed = i ^ (i + 1); // 이번에 바뀐 비트들
          for (let d = 0; d < ND; d++) if (changed & (1 << d)) dice[d] = r.next();
          // 주사위 합 (평균 0.5). 범위를 넓혀 음역을 고르게 씀
          out[i] = U.clamp(0.5 + (dice.reduce((a, b) => a + b, 0) / ND - 0.5) * 2.2, 0, 1);
        }
      }
      return out;
    }
    let gen = 0, key = '', mel = null, spec = null, slope = 0, hist = null, ac1 = 0;
    const NOTES = 48;
    function compute() {
      const k = [P.noise, P.scale, gen].join(',');
      if (k === key) return;
      key = k;
      const sc = SCALES[P.scale], K = sc.length * 2 + 1;
      const seed = ctx.seed * 31 + gen * 7777 + 3;
      const s = series(P.noise, NOTES, seed);
      mel = Array.from(s, (v) => { const j = Math.min(K - 1, Math.floor(v * K)); return 60 + 12 * Math.floor(j / sc.length) + sc[j % sc.length]; });
      // 긴 수열로 스펙트럼 평균 (128점 구간 16개)
      const long = series(P.noise, 2048, seed + 99), N = 128, segs = 16;
      const acc = new Float64Array(N / 2);
      for (let sg = 0; sg < segs; sg++) {
        const re = new Float64Array(N), im = new Float64Array(N);
        let m = 0; for (let i = 0; i < N; i++) m += long[sg * N + i]; m /= N;
        for (let i = 0; i < N; i++) re[i] = (long[sg * N + i] - m) * A.windows.hann(i, N);
        A.fft(re, im);
        for (let b = 1; b < N / 2; b++) acc[b] += (re[b] * re[b] + im[b] * im[b]) / segs;
      }
      spec = [];
      let sx = 0, sy = 0, sxx = 0, sxy = 0, c = 0;
      for (let b = 1; b < N / 2; b++) {
        const x = Math.log10(b / N), y = Math.log10(acc[b] + 1e-12);
        spec.push({ x, y });
        if (b >= 2) { sx += x; sy += y; sxx += x * x; sxy += x * y; c++; }
      }
      slope = (c * sxy - sx * sy) / (c * sxx - sx * sx);
      hist = new Array(13).fill(0);
      let a0 = 0, a1 = 0, mm = 0;
      for (let i = 0; i < long.length; i++) mm += long[i]; mm /= long.length;
      for (let i = 0; i < long.length; i++) { const d = long[i] - mm; a0 += d * d; if (i) a1 += d * (long[i - 1] - mm); }
      ac1 = a1 / a0;
      for (let i = 1; i < mel.length; i++) hist[U.clamp(mel[i] - mel[i - 1], -6, 6) + 6]++;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        runAudio(l, r, sr, n, (t0, t1, trig) => {
          compute();
          const e8 = 30 / P.bpm, len = NOTES * e8;
          for (let c = Math.floor(t0 / len); c * len < t1; c++) for (let i = 0; i < NOTES; i++) {
            const t = c * len + i * e8;
            if (t >= t0 && t < t1) trig('tone', t, { f: A.mtof(mel[i]), dur: e8 * 0.7, vel: i % 2 ? 0.6 : 0.8, cut: 0.14 });
          }
          for (let i = Math.ceil(t0 / (e8 * 8) - 1e-9); i * e8 * 8 < t1; i++) if (i * e8 * 8 >= t0) trig('bass', i * e8 * 8, { f: A.mtof(36), dur: e8 * 7, vel: 0.3 });
        });
      },
    });

    const inst = {
      update(dt) { tick(dt); },
      render() { ctx.g.save(); ctx.g.translate(0, TOP); try { inst.drawView(); } finally { ctx.g.restore(); } },
      drawView() {
        compute();
        const g = ctx.g, W = ctx.width, H = ctx.height - TOP, pad = 10;
        const e8 = 30 / P.bpm, pos = (clock.t / e8) % NOTES, cur = Math.floor(pos);
        // 음 높이 선
        const rx = pad + 24, ry = pad + 14, rw = W - rx - pad, rh = Math.max(60, H * 0.45);
        const lo = 59, hi = 85, Y = (m) => ry + rh - ((m - lo) / (hi - lo)) * rh;
        D.rect(g, rx, ry, rw, rh, 'rgba(0,0,0,0.3)');
        D.text(g, L(`음 높이 (${NOTES}음)`, `Pitch (${NOTES} notes)`), pad, pad, { size: 10, color: C.dim });
        for (const m of [60, 72, 84]) { D.line(g, rx, Y(m), rx + rw, Y(m), C.grid, 1); D.text(g, A.noteName(m), pad, Y(m) - 5, { size: 9, color: C.dim }); }
        const cw = rw / NOTES;
        g.beginPath();
        mel.forEach((m, i) => { const x = rx + i * cw, y = Y(m); i ? g.lineTo(x, y) : g.moveTo(x, y); g.lineTo(x + cw, y); });
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.rect(g, rx + cur * cw, Y(mel[cur]) - 3, cw, 6, '#fff');
        // 스펙트럼 (log-log)
        const by = ry + rh + 28, bh = Math.max(50, H - by - 12), bw = (W - pad * 3) * 0.55;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.3)');
        D.text(g, L('스펙트럼 (log-log, 긴 수열 평균)', 'Spectrum (log-log, long-run average)'), pad, by - 14, { size: 10, color: C.dim });
        const xs = spec.map((p) => p.x), ys = spec.map((p) => p.y);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), yMax = Math.max(...ys) + 0.4, yMin = yMax - 4.4;
        const SX = (x) => pad + ((x - x0) / (x1 - x0)) * bw, SY = (y) => by + bh - U.clamp((y - yMin) / (yMax - yMin), 0, 1) * bh;
        // 기준 기울기 0, -1, -2 (가운데 점을 지나게)
        const mx = (x0 + x1) / 2, myv = ys[Math.floor(ys.length / 2)];
        [[0, C.dim], [-1, C.dim], [-2, C.dim]].forEach(([s, c]) => { D.line(g, SX(x0), SY(myv + s * (x0 - mx)), SX(x1), SY(myv + s * (x1 - mx)), 'rgba(255,255,255,0.15)', 1); D.text(g, String(s), SX(x1) - 14, SY(myv + s * (x1 - mx)) - 12, { size: 9, color: c }); });
        g.beginPath(); spec.forEach((p, i) => (i ? g.lineTo(SX(p.x), SY(p.y)) : g.moveTo(SX(p.x), SY(p.y)))); g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        // 음정 이동 히스토그램
        const hx = pad * 2 + bw, hw = W - hx - pad, hm = Math.max(...hist, 1);
        D.rect(g, hx, by, hw, bh, 'rgba(0,0,0,0.3)');
        D.text(g, L('음정 이동 (반음)', 'Interval (semitones)'), hx, by - 14, { size: 10, color: C.dim });
        hist.forEach((v, i) => { const w = hw / 13, h = (v / hm) * (bh - 16); D.rect(g, hx + i * w + 1, by + bh - 12 - h, w - 2, h, i === 6 ? C.dim : col); });
        D.text(g, '≤-6', hx + 2, by + bh - 11, { size: 9, color: C.dim }); D.text(g, '≥+6', hx + hw - 22, by + bh - 11, { size: 9, color: C.dim });
        let mi = 0; for (let i = 1; i < mel.length; i++) mi += Math.abs(mel[i] - mel[i - 1]);
        ctx.stat(L('스펙트럼 기울기', 'Spectrum slope'), slope.toFixed(2));
        ctx.stat(L('평균 음정 이동', 'Mean interval'), (mi / (mel.length - 1)).toFixed(2) + L(' 반음', ' semitones'));
        ctx.stat(L('이웃 음 상관 (lag 1)', 'Neighbor correlation (lag 1)'), ac1.toFixed(2));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); if (k === 'regen') gen++; },
      dispose() { snd.stop(); },
    };
    return inst;
  },
});
