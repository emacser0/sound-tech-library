// 카플러스-스트롱 현 합성: 잡음으로 채운 지연선을 평균 필터로 돌려 뜯은 현 소리를 만듦. 정수 지연(음정 틀림) vs 올패스 분수 지연
GTL.register({
  id: 'karplus-strong',
  title: '카플러스-스트롱 현 합성',
  summary: '잡음을 짧은 지연선에 넣고 평균을 내며 되돌리면 뜯은 현 소리가 남. 지연 길이를 정수로만 정하면 높은 음의 음정이 틀어지고, 올패스 필터로 분수 지연을 더하면 정확해짐.',
  views: { a: '정수 지연', b: '올패스 분수 지연' },
  controls: '파라미터 표에서 감쇠 시간, 스트레치 계수, 음역을 바꿈. "소리 켜기"를 누르면 뜯는 선율이 반복됨.',
  info: `
    <p><b>카플러스-스트롱(Karplus-Strong)</b>은 1983년에 나온 가장 단순한 물리 모델. 길이 N의 지연선을 잡음으로 채우고, 출력을 저역 통과 필터(이웃한 두 샘플의 평균)에 통과시켜 다시 넣음. 한 바퀴 도는 시간이 한 주기라서 음 높이가 생기고, 바퀴마다 높은 배음이 더 많이 줄어 실제 현처럼 밝게 시작해 둥글게 사라짐.</p>
    <ul>
      <li><b>음 높이</b>: f = sr / (N + 필터 지연). 평균 필터는 0.5 샘플을 지연시킴.</li>
      <li><b>정수 지연의 문제</b>: N은 정수라서 높은 음일수록 원하는 음과 어긋남. 48kHz에서 C7(2093Hz)은 22.9 샘플이 필요한데, 22.5나 23.5만 고를 수 있음.</li>
      <li><b>올패스 튜닝</b>: 1차 올패스 필터는 크기를 바꾸지 않고 지연만 0~1 샘플 더함. 이것으로 남은 분수 부분을 채움 (Jaffe와 Smith, 1983).</li>
      <li><b>스트레치 계수 S</b>: 루프 필터 <code>(1 - S) x[n] + S x[n-1]</code>. 0.5가 가장 어둡고 빨리 사라짐. 0에 가까우면 밝고 오래 울림.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="20" y="44" class="t-small">${L('잡음 (뜯기)', 'noise (pluck)')}</text>
    <line x1="80" y1="56" x2="118" y2="56" class="d-accent" marker-end="url(#arr)"/>
    <circle cx="130" cy="56" r="11" class="f-dim"/><text x="130" y="60" text-anchor="middle">+</text>
    <line x1="141" y1="56" x2="178" y2="56" class="d-accent" marker-end="url(#arr)"/>
    <rect x="180" y="38" width="140" height="36" rx="4" class="f-dim"/><text x="250" y="60" text-anchor="middle">${L('지연선 N 샘플', 'Delay line N samples')}</text>
    <line x1="320" y1="56" x2="500" y2="56" class="d-accent" marker-end="url(#arr)"/><text x="505" y="60" class="t-small">${L('출력', 'out')}</text>
    <rect x="330" y="96" width="90" height="34" rx="4" class="f-dim"/><text x="375" y="117" text-anchor="middle" class="t-small">${L('평균 (S)', 'average (S)')}</text>
    <rect x="200" y="96" width="100" height="34" rx="4" class="f-dim"/><text x="250" y="112" text-anchor="middle" class="t-small t-b">${L('올패스', 'allpass')}</text><text x="250" y="125" text-anchor="middle" class="t-small t-b">${L('분수 지연', 'fractional delay')}</text>
    <path d="M440,56 L440,113 L422,113" class="d-accent" marker-end="url(#arr)"/>
    <line x1="330" y1="113" x2="302" y2="113" class="d-accent" marker-end="url(#arr)"/>
    <path d="M200,113 L130,113 L130,69" class="d-accent" marker-end="url(#arr)"/>
    <text x="160" y="140" class="t-small t-dim">x ${L('감쇠 계수 rho', 'loss rho')}</text>
  </svg>`,
  look: [
    '위 막대그래프에서 A는 높은 음일수록 음정 오차(센트)가 크게 흔들리고, B는 모두 0 근처',
    '아래 스펙트럼에서 A의 봉우리는 초록 눈금(목표 배음)에서 비켜 있고, B는 눈금 위에 있음',
    '"소리 켜기"를 누르고 A를 들으면 선율의 일부 음이 틀린 음처럼 들림. 음역을 -24로 내리면 오차가 줄어 거의 맞게 들림.',
    '스트레치 계수 S를 0.05로 낮추면 소리가 밝고 오래 울림. 0.5로 올리면 둔하고 짧아짐.',
  ],
  refs: [
    { type: 'paper', title: 'Kevin Karplus, Alex Strong, "Digital Synthesis of Plucked-String and Drum Timbres", Computer Music Journal 7(2)', year: 1983, note: '원 논문' },
    { type: 'paper', title: 'David A. Jaffe, Julius O. Smith, "Extensions of the Karplus-Strong Plucked-String Algorithm", Computer Music Journal 7(2)', year: 1983, note: '올패스 튜닝, 스트레치 계수, 감쇠 조절' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '디지털 도파관과 카플러스-스트롱 해설' },
  ],
  params: [
    { key: 'tuning', label: '튜닝 방식', type: 'select', options: [{ value: 'int', label: '정수 지연' }, { value: 'allpass', label: '올패스 분수 지연' }], a: 'int', b: 'allpass', group: '현' },
    { key: 't60', label: '감쇠 시간 T60 (초)', type: 'range', min: 0.2, max: 8, step: 0.1, default: 2.5, shared: true, help: '기음이 -60dB가 될 때까지 걸리는 시간' },
    { key: 'stretch', label: '스트레치 계수 S', type: 'range', min: 0.01, max: 0.5, step: 0.01, default: 0.5, shared: true },
    { key: 'bright', label: '뜯기 밝기', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.8, shared: true, help: '처음 넣는 잡음의 고음 양' },
    { key: 'shift', label: '음역 (반음)', type: 'int', min: -24, max: 12, default: 12, shared: true, group: '선율' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Karplus-Strong Plucked String',
    summary: 'Put noise into a short delay line and feed it back through an averaging filter. You get a plucked string. If the delay length is only whole samples, high notes go out of tune. An allpass filter adds a fractional delay and fixes the pitch.',
    views: { a: 'Integer delay', b: 'Allpass fractional delay' },
    controls: 'Change decay time, stretch factor and register in the parameter table. Press "Sound on" to hear a plucked melody loop.',
    info: `
    <p><b>Karplus-Strong</b> (1983) is the simplest physical model. Fill a delay line of length N with noise, pass the output through a lowpass filter (the average of two neighbor samples), and feed it back. One trip around the loop is one period, so you hear a pitch. Each trip removes more high harmonics, so the note starts bright and fades round, like a real string.</p>
    <ul>
      <li><b>Pitch</b>: f = sr / (N + filter delay). The averaging filter adds a 0.5 sample delay.</li>
      <li><b>The integer delay problem</b>: N is a whole number, so high notes miss the target. At 48 kHz, C7 (2093 Hz) needs 22.9 samples, but you can only pick 22.5 or 23.5.</li>
      <li><b>Allpass tuning</b>: a 1st order allpass filter keeps the level and adds only 0 to 1 sample of delay. It fills the remaining fraction (Jaffe and Smith, 1983).</li>
      <li><b>Stretch factor S</b>: the loop filter <code>(1 - S) x[n] + S x[n-1]</code>. 0.5 is the darkest and fades fastest. Near 0 it is bright and rings longer.</li>
    </ul>`,
    look: [
      'In the bar chart at the top, A\'s pitch error (cents) swings more on higher notes. B stays near 0 for all notes.',
      'In the bottom spectrum, A\'s peaks sit off the green ticks (target harmonics). B\'s peaks sit on them.',
      'Press "Sound on" and listen to A. Some notes of the melody sound wrong. Set register to -24 and the error shrinks so it sounds almost right.',
      'Lower stretch S to 0.05. The sound gets bright and rings long. At 0.5 it gets dull and short.',
    ],
    refs: ['The original paper.', 'Allpass tuning, stretch factor and decay control.', 'Digital waveguides and Karplus-Strong explained.'],
    params: {
      tuning: { label: 'Tuning', group: 'String', options: { int: 'Integer delay', allpass: 'Allpass fractional delay' } },
      t60: { label: 'Decay time T60 (s)', help: 'Time for the fundamental to reach -60 dB' },
      stretch: 'Stretch factor S',
      bright: { label: 'Pluck brightness', help: 'High frequency content of the initial noise' },
      shift: { label: 'Register (semitones)', group: 'Melody' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const MEL = [84, 86, 88, 91, 93, 96, 91, 88], STEP = 0.32, LOOP = STEP * MEL.length;
    const noteOf = (i) => MEL[i % MEL.length] + P.shift - 12;
    const MASK = 8191;

    // 지연 길이 설계. 반환: { N, C(올패스 계수 또는 null), fReal }
    function design(f, sr) {
      const S = P.stretch, Dl = sr / f;
      if (P.tuning === 'int') { const N = Math.max(2, Math.round(Dl - S)); return { N, C: null, fReal: sr / (N + S) }; }
      let N = Math.floor(Dl - S - 0.1); N = Math.max(2, N);
      const frac = Dl - S - N, Cc = (1 - frac) / (1 + frac);
      return { N, C: Cc, fReal: f }; // 올패스 위상 지연은 저주파에서 frac과 같음
    }
    function makeString(f, sr, seed) {
      const d = design(f, sr), s = { buf: new Float32Array(MASK + 1), w: 0, prev: 0, ax: 0, ay: 0, d, rho: Math.pow(10, -3 / (P.t60 * f)) };
      const r = U.rng(seed), k = P.bright; let lp = 0;
      for (let i = 0; i < d.N; i++) { lp += k * (r.range(-1, 1) - lp); s.buf[i] = lp; }
      s.w = d.N;
      return s;
    }
    function tick(s) {
      const x = s.buf[(s.w - s.d.N) & MASK], S = P.stretch;
      let y = (1 - S) * x + S * s.prev; s.prev = x;
      if (s.d.C !== null) { const a = s.d.C * y + s.ax - s.d.C * s.ay; s.ax = y; s.ay = a; y = a; }
      y *= s.rho;
      s.buf[s.w & MASK] = y; s.w = (s.w + 1) & MASK;
      return x;
    }

    const live = { n: 0, voices: [null, null], last: -1 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) {
          const t = (live.n++ / sr) % LOOP, idx = Math.floor(t / STEP);
          if (idx !== live.last) { live.last = idx; live.voices[idx & 1] = makeString(A.mtof(noteOf(idx)), sr, 101 + idx); }
          let o = 0;
          for (const v of live.voices) if (v) o += tick(v);
          o *= 0.4; l[i] = o; r[i] = o;
        }
      },
    });

    // 현재 음을 오프라인으로 렌더 (파라미터나 음이 바뀔 때만)
    const SR = 48000, NR = Math.round(SR * 1.2), NF = 4096;
    let key = '', buf = null, mags = null;
    function analyze(idx) {
      const k = [idx, P.tuning, P.t60, P.stretch, P.bright, P.shift].join();
      if (k === key) return;
      key = k;
      const s = makeString(A.mtof(noteOf(idx)), SR, 101 + idx);
      buf = new Float32Array(NR);
      for (let i = 0; i < NR; i++) buf[i] = tick(s);
      mags = A.spectrum(buf, NF, { offset: 256, window: 'blackman' });
    }

    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const t = (snd.on ? live.n / (snd.sr || SR) : visT) % LOOP, idx = Math.floor(t / STEP);
        analyze(idx);
        // 1) 음정 오차 막대
        const h1 = (H - pad * 4) * 0.32, y1 = pad, bw = (W - pad * 2) / MEL.length, mid = y1 + h1 / 2;
        D.rect(g, pad, y1, W - pad * 2, h1, 'rgba(0,0,0,0.35)');
        D.line(g, pad, mid, W - pad, mid, C.grid, 1);
        let worst = 0;
        for (let i = 0; i < MEL.length; i++) {
          const f = A.mtof(noteOf(i)), c = A.cents(f, design(f, SR).fReal);
          worst = Math.max(worst, Math.abs(c));
          const bh = U.clamp(c / 50, -1, 1) * (h1 / 2 - 14), x = pad + i * bw;
          D.rect(g, x + bw * 0.2, Math.min(mid, mid - bh), bw * 0.6, Math.abs(bh) + 1, i === idx ? C.text : col);
          D.text(g, A.noteName(noteOf(i)), x + bw / 2, y1 + h1 - 12, { size: 9, color: C.dim, align: 'center' });
          D.text(g, (c >= 0 ? '+' : '') + c.toFixed(0), x + bw / 2, y1 + 14, { size: 9, color: C.dim, align: 'center' });
        }
        D.text(g, Lx('음정 오차 (센트, 48kHz)', 'Pitch error (cents, 48 kHz)'), pad + 4, y1 + 2, { size: 10, color: C.dim });
        // 2) 현재 음 파형 전체
        const y2 = y1 + h1 + pad, h2 = (H - pad * 4) * 0.28;
        A.drawWave(g, buf, pad, y2, W - pad * 2, h2, { color: col, amp: 1.4, lineWidth: 1, label: Lx('현재 음 (1.2초)', 'Current note (1.2 s)') });
        const ph = pad + Math.min(1, (t - idx * STEP) / 1.2) * (W - pad * 2);
        D.line(g, ph, y2, ph, y2 + h2, C.text, 1);
        // 3) 스펙트럼 (선형 0 ~ 8.5 f)
        const f = A.mtof(noteOf(idx)), y3 = y2 + h2 + pad, h3 = H - y3 - pad, fmax = Math.min(SR / 2, f * 8.5);
        A.drawSpectrum(g, mags, SR, pad, y3, W - pad * 2, h3, { color: col, fmin: 20, fmax, log: false, minDb: -80, maxDb: 0, grid: false, label: Lx('스펙트럼 (초록 = 목표 배음)', 'Spectrum (green = target harmonics)') });
        for (let h = 1; h * f < fmax; h++) { const px = pad + (h * f - 20) / (fmax - 20) * (W - pad * 2); D.line(g, px, y3, px, y3 + h3, 'rgba(102,209,122,0.5)', 1); }
        const d = design(f, SR);
        ctx.stat(Lx('현재 음', 'Current note'), `${A.noteName(noteOf(idx))} (${f.toFixed(1)} Hz)`);
        ctx.stat(Lx('지연 길이', 'Delay length'), d.C === null ? `${d.N} + ${P.stretch.toFixed(2)}` : `${d.N} + ${P.stretch.toFixed(2)} + ${(SR / f - P.stretch - d.N).toFixed(2)}`);
        ctx.stat(Lx('최대 음정 오차', 'Max pitch error'), worst.toFixed(1) + ' cents');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
