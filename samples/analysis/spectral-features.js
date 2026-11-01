// 스펙트럼 특징: 중심(밝기), 롤오프, 평탄도, 영교차율로 음색을 숫자 몇 개로 요약
GTL.register({
  id: 'spectral-features',
  title: '스펙트럼 특징 (중심, 롤오프, 평탄도)',
  summary: '음색을 숫자 몇 개로 요약하는 기본 특징. 스펙트럼 중심은 "밝기", 롤오프는 에너지 대부분이 들어가는 상한, 평탄도는 "음인지 잡음인지"를 나타냄. 두 음색을 나란히 놓고 값을 비교함.',
  views: { a: '플루트 같은 소리', b: '금관 같은 소리' },
  controls: '파라미터 표에서 두 뷰의 음색을 고르고, 로우패스와 잡음 섞기로 특징값이 어떻게 움직이는지 봄. "소리 켜기"를 누르면 고른 뷰의 음색이 들림.',
  info: `
    <p>음향 분류, 음악 검색, 게임 오디오의 자동 태깅에서는 스펙트럼 전체 대신 요약값 몇 개를 씀. 계산이 싸고 의미가 분명함.</p>
    <ul>
      <li><b>스펙트럼 중심(Spectral Centroid)</b>: 크기로 가중한 주파수 평균. Σ f|X(f)| / Σ |X(f)|. 클수록 밝게 들림. 음색 지각 실험에서 "밝기"와 가장 잘 맞는 값.</li>
      <li><b>스펙트럼 퍼짐(Spread)</b>: 중심 주변의 표준편차. 소리가 좁은 대역에 몰렸는지 넓게 퍼졌는지.</li>
      <li><b>롤오프(Rolloff)</b>: 아래부터 에너지를 더해 85%가 되는 주파수. 고역이 얼마나 길게 이어지는지.</li>
      <li><b>평탄도(Spectral Flatness)</b>: 파워의 기하평균 ÷ 산술평균. 0에 가까우면 배음이 뚜렷한 음, 1에 가까우면 백색 잡음.</li>
      <li><b>영교차율(ZCR)</b>: 1초에 0을 지나는 횟수. 시간 영역에서 싸게 구하는 밝기, 잡음 지표.</li>
    </ul>
    <p>단점: 요약값이라 서로 다른 소리가 같은 값을 가질 수 있음. 여러 특징을 함께 쓰거나 MFCC, 로그 멜 스펙트럼과 섞어 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('스펙트럼 위의 세 지표', 'Three measures on a spectrum')}</text>
    <line x1="20" y1="130" x2="520" y2="130" class="d-line"/>
    <path d="M20,128 L40,40 L50,126 L80,60 L90,126 L120,75 L130,126 L160,90 L170,126 L200,100 L210,126 L240,108 L250,127 L300,115 L310,128 L360,120 L370,129 L520,129" class="d-b"/>
    <line x1="120" y1="30" x2="120" y2="135" class="d-accent" stroke-dasharray="5 3"/>
    <text x="120" y="26" text-anchor="middle" class="t-small">${L('중심 (무게 중심)', 'centroid (balance point)')}</text>
    <line x1="300" y1="50" x2="300" y2="135" class="d-dim" stroke-dasharray="5 3"/>
    <text x="300" y="46" text-anchor="middle" class="t-small">${L('롤오프 (85%)', 'rolloff (85%)')}</text>
    <rect x="20" y="136" width="280" height="6" class="f-b" opacity="0.5"/>
    <text x="160" y="156" text-anchor="middle" class="t-small t-b">${L('에너지의 85%', '85% of energy')}</text>
    <text x="420" y="80" text-anchor="middle" class="t-small">${L('평탄도 = 기하평균 / 산술평균', 'flatness = geo mean / arith mean')}</text>
    <text x="420" y="98" text-anchor="middle" class="t-small t-dim">${L('뾰족한 배음: 0에 가까움', 'sharp harmonics: near 0')}</text>
    <text x="420" y="114" text-anchor="middle" class="t-small t-dim">${L('평평한 잡음: 1에 가까움', 'flat noise: near 1')}</text>
  </svg>`,
  look: [
    '기본 상태에서 B(금관)의 스펙트럼 중심과 롤오프가 A(플루트)보다 몇 배 높음. 금관이 더 밝게 들리는 이유.',
    '두 뷰 모두 "로우패스"를 1000Hz로 내리면 중심과 롤오프가 함께 내려가고 두 뷰의 차이도 줄어듦',
    '"잡음 섞기"를 올리면 평탄도가 크게 오름. 음색을 "백색 잡음"으로 바꾸면 약 0.56까지 오름. 한 프레임 스펙트럼의 무작위 변동 때문에 1이 되지는 않음.',
    '음색을 "스네어"로 바꾸면 아래 시간 그래프에서 타격 순간마다 중심이 치솟았다가 내려옴',
  ],
  refs: [
    { type: 'paper', title: 'G. Peeters, "A large set of audio features for sound description (similarity and classification) in the CUIDADO project", IRCAM technical report', year: 2004, note: '스펙트럼 특징의 정의 모음' },
    { type: 'paper', title: 'G. Tzanetakis, P. Cook, "Musical genre classification of audio signals", IEEE Trans. Speech and Audio Processing 10(5)', year: 2002, note: '중심, 롤오프, 플럭스, ZCR로 장르 분류' },
    { type: 'paper', title: 'J. D. Johnston, "Transform coding of audio signals using perceptual noise criteria", IEEE JSAC 6(2)', year: 1988, note: '스펙트럼 평탄도로 음 성분과 잡음 성분을 구분' },
    { type: 'paper', title: 'J. M. Grey, "Multidimensional perceptual scaling of musical timbres", JASA 61(5)', year: 1977, note: '음색 공간의 한 축이 스펙트럼 에너지 분포(밝기)임을 보인 연구' },
  ],
  params: [
    { key: 'src', label: '음색', type: 'select', options: [{ value: 'flute', label: '플루트 같은 소리' }, { value: 'clarinet', label: '클라리넷 같은 소리' }, { value: 'brass', label: '금관 같은 소리' }, { value: 'snare', label: '스네어' }, { value: 'noise', label: '백색 잡음' }], a: 'flute', b: 'brass', group: '소리' },
    { key: 'lp', label: '로우패스 (Hz)', type: 'range', min: 200, max: 11000, step: 50, default: 11000, group: '가공' },
    { key: 'nz', label: '잡음 섞기', type: 'range', min: 0, max: 1, step: 0.01, default: 0 },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Spectral Features (Centroid, Rolloff, Flatness)',
    summary: 'Basic features that sum up timbre in a few numbers. The spectral centroid shows "brightness", the rolloff is the upper limit that holds most of the energy, and flatness shows "tone or noise". Two timbres are compared side by side.',
    views: { a: 'Flute-like', b: 'Brass-like' },
    controls: 'Choose a timbre for each view in the parameter table. Use the lowpass and noise mix to see how the features move. Press "Sound on" to hear the selected view.',
    info: `
    <p>Sound classification, music search and automatic tagging in game audio often use a few summary values instead of the whole spectrum. They are cheap and their meaning is clear.</p>
    <ul>
      <li><b>Spectral centroid</b>: the magnitude-weighted mean frequency, Σ f|X(f)| / Σ |X(f)|. Higher sounds brighter. It matches "brightness" in timbre perception studies best.</li>
      <li><b>Spectral spread</b>: the standard deviation around the centroid. Whether the sound sits in a narrow band or spreads wide.</li>
      <li><b>Rolloff</b>: the frequency below which 85% of the energy lies. How far the high end reaches.</li>
      <li><b>Spectral flatness</b>: geometric mean / arithmetic mean of power. Near 0 for clear harmonic tones, near 1 for white noise.</li>
      <li><b>Zero crossing rate (ZCR)</b>: zero crossings per second. A cheap time-domain measure of brightness and noisiness.</li>
    </ul>
    <p>Weak spot: these are summaries, so different sounds can share the same values. Use several features together, or combine them with MFCC or log mel spectra.</p>`,
    look: [
      'In the default state, B (brass) has a centroid and rolloff several times higher than A (flute). That is why brass sounds brighter.',
      'Lower "Lowpass" to 1000 Hz in both views. Centroid and rolloff drop together, and the gap between the views shrinks.',
      'Raise "Noise mix". Flatness rises a lot. Switch the timbre to "White noise" and it reaches about 0.56. Random variation in a single frame spectrum keeps it below 1.',
      'Switch the timbre to "Snare". In the time graph below, the centroid jumps at every hit and then falls.',
    ],
    refs: ['A collection of spectral feature definitions.', 'Genre classification with centroid, rolloff, flux and ZCR.', 'Spectral flatness to tell tonal parts from noise.', 'Showed that one axis of timbre space is the spectral energy distribution (brightness).'],
    params: {
      src: { label: 'Timbre', group: 'Sound', options: { flute: 'Flute-like', clarinet: 'Clarinet-like', brass: 'Brass-like', snare: 'Snare', noise: 'White noise' } },
      lp: { label: 'Lowpass (Hz)', group: 'Processing' },
      nz: 'Noise mix',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 22050, DUR = 2, LEN = SR * DUR, N = 2048, HOP = 512, TAU = Math.PI * 2;
    const NOTES = [57, 60, 64, 62];
    const noise = A.noiseBuffer(LEN, 21);

    // 음색별 원본 (0.5초 음 4개)
    function source(kind) {
      const out = new Float32Array(LEN), rng = U.rng(8);
      NOTES.forEach((m, j) => {
        const f = A.mtof(m), i0 = j * LEN / 4, n = LEN / 4;
        for (let i = 0; i < n; i++) {
          const t = i / SR, e = Math.min(1, t / 0.03, (n - i) / (SR * 0.05));
          let v = 0;
          if (kind === 'flute') { v = Math.sin(TAU * f * t) + 0.12 * Math.sin(2 * TAU * f * t) + 0.05 * Math.sin(3 * TAU * f * t) + 0.01 * noise[i0 + i]; }
          else if (kind === 'clarinet') { for (let h = 1; h < 20; h += 2) v += Math.sin(TAU * f * h * t) / h; }
          else if (kind === 'brass') { for (let h = 1; h * f < SR / 2 && h < 40; h++) v += Math.sin(TAU * f * h * t) * Math.min(1, h / 4) / Math.pow(h, 0.7); v *= 0.4; }
          else if (kind === 'snare') { const tt = t % 0.25; v = (rng.range(-1, 1) * Math.exp(-tt * 18) + 0.6 * Math.sin(TAU * 190 * tt) * Math.exp(-tt * 30)) * 2; }
          else v = rng.range(-1, 1) * 0.6;
          out[i0 + i] = v * (kind === 'snare' ? 1 : e);
        }
      });
      return A.normalize(out, 0.5);
    }

    let key = '', buf = null, avg = null, series = null, feat = null;
    function analyze() {
      const k = [P.src, P.lp, P.nz].join();
      if (k === key) return;
      key = k;
      // 원본 + 잡음 → 로우패스 (바이쿼드 2개 직렬 = 4차)
      const src = source(P.src);
      const f1 = A.biquad('lowpass', P.lp, 0.707, 0, SR), f2 = A.biquad('lowpass', P.lp, 0.707, 0, SR);
      buf = new Float32Array(LEN);
      const useLp = P.lp < 10500;   // 끝 값이면 필터를 끔
      for (let i = 0; i < LEN; i++) { const x = src[i] + P.nz * 0.4 * noise[i]; buf[i] = useLp ? f2.process(f1.process(x)) : x; }
      A.normalize(buf, 0.5);
      // 프레임별 특징
      const re = new Float64Array(N), im = new Float64Array(N), w = new Float64Array(N), nB = N / 2;
      for (let i = 0; i < N; i++) w[i] = 0.5 - 0.5 * Math.cos(TAU * i / N);
      avg = new Float64Array(nB);
      series = [];
      const nF = Math.floor((LEN - N) / HOP);
      let sum = { c: 0, s: 0, r: 0, fl: 0, z: 0, n: 0 };
      let emax = 0;
      const frames = [];
      for (let f = 0; f < nF; f++) {
        re.fill(0); im.fill(0);
        let e = 0;
        for (let i = 0; i < N; i++) { const v = buf[f * HOP + i]; re[i] = v * w[i]; e += v * v; }
        A.fft(re, im);
        const pw = new Float64Array(nB);
        for (let b = 0; b < nB; b++) { pw[b] = re[b] * re[b] + im[b] * im[b]; avg[b] += pw[b]; }
        let z = 0; for (let i = 1; i < N; i++) if ((buf[f * HOP + i - 1] < 0) !== (buf[f * HOP + i] < 0)) z++;
        frames.push({ pw, e, z: z * SR / N });
        emax = Math.max(emax, e);
      }
      for (const fr of frames) {
        let sm = 0, sf = 0, sp = 0, lg = 0, ar = 0, nfl = 0;
        for (let b = 1; b < nB; b++) {
          const m = Math.sqrt(fr.pw[b]), fq = b * SR / N; sm += m; sf += m * fq; sp += fr.pw[b];
          if (fq >= 50 && fq <= 10000) { lg += Math.log(fr.pw[b] + 1e-20); ar += fr.pw[b]; nfl++; }   // 평탄도는 50Hz~10kHz에서
        }
        const c = sf / (sm + 1e-12);
        let sd = 0; for (let b = 1; b < nB; b++) sd += Math.sqrt(fr.pw[b]) * Math.pow(b * SR / N - c, 2);
        let acc = 0, ro = 0; for (let b = 1; b < nB; b++) { acc += fr.pw[b]; if (acc >= 0.85 * sp) { ro = b * SR / N; break; } }
        const flat = Math.exp(lg / nfl) / (ar / nfl + 1e-20);
        const loud = fr.e > emax * 1e-3;
        series.push(loud ? c : 0);
        if (!loud) continue;
        sum.c += c; sum.s += Math.sqrt(sd / (sm + 1e-12)); sum.r += ro; sum.fl += flat; sum.z += fr.z; sum.n++;
      }
      const n = Math.max(1, sum.n);
      feat = { c: sum.c / n, s: sum.s / n, r: sum.r / n, fl: sum.fl / n, z: sum.z / n };
      for (let b = 0; b < nB; b++) avg[b] = 10 * Math.log10(avg[b] / nF + 1e-20);
    }
    analyze();

    const live = { pos: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr, b = buf;
        for (let i = 0; i < n; i++) {
          const i0 = Math.floor(live.pos), fr = live.pos - i0, v = b[i0] * (1 - fr) + b[(i0 + 1) % LEN] * fr;
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= LEN) live.pos -= LEN;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        // 평균 스펙트럼 + 중심, 롤오프
        const sh = Math.max(90, H * 0.42), fmin = 50, fmax = SR / 2;
        let top = -999; for (let b = 1; b < avg.length; b++) top = Math.max(top, avg[b]);
        const mags = Float32Array.from(avg, (v) => v - top);
        A.drawSpectrum(g, mags, SR, pad, pad, tw, sh, { fmin, fmax, minDb: -90, maxDb: 3, color: col, label: Lg('평균 스펙트럼', 'Average spectrum') });
        const fx = (f) => A.freqX(f, pad, tw, fmin, fmax);
        D.line(g, fx(feat.c), pad, fx(feat.c), pad + sh, C.accent, 2);
        D.text(g, Lg('중심', 'centroid'), fx(feat.c) + 3, pad + 16, { size: 10, color: C.accent });
        D.line(g, fx(feat.r), pad, fx(feat.r), pad + sh, C.warn, 2);
        D.text(g, Lg('롤오프', 'rolloff'), fx(feat.r) + 3, pad + 30, { size: 10, color: C.warn });
        // 시간에 따른 중심
        const ty = pad * 2 + sh, th = Math.max(40, H * 0.2);
        D.rect(g, pad, ty, tw, th, 'rgba(0,0,0,0.35)');
        const cy = (c) => ty + th - U.clamp(Math.log(Math.max(c, 100) / 100) / Math.log(fmax / 100), 0, 1) * th;
        g.beginPath(); series.forEach((c, i) => { const px = pad + i / (series.length - 1) * tw, py = c > 0 ? cy(c) : ty + th; i ? g.lineTo(px, py) : g.moveTo(px, py); });
        g.strokeStyle = C.accent; g.lineWidth = 1.5; g.stroke();
        if (snd.on) { const px = pad + live.pos / LEN * tw; D.line(g, px, ty, px, ty + th, '#fff', 1); }
        D.text(g, Lg('시간에 따른 스펙트럼 중심 (로그 축)', 'Spectral centroid over time (log axis)'), pad + 4, ty + 3, { size: 10, color: C.dim });
        // 특징 막대
        const by = ty + th + pad, bh = H - by - pad, rows = [
          [Lg('중심', 'Centroid'), Math.log(Math.max(feat.c, 100) / 100) / Math.log(fmax / 100), feat.c.toFixed(0) + ' Hz'],
          [Lg('롤오프 85%', 'Rolloff 85%'), Math.log(Math.max(feat.r, 100) / 100) / Math.log(fmax / 100), feat.r.toFixed(0) + ' Hz'],
          [Lg('평탄도', 'Flatness'), U.clamp(1 + Math.log10(feat.fl + 1e-9) / 6, 0, 1), feat.fl.toPrecision(2)],
          [Lg('영교차율', 'ZCR'), U.clamp(feat.z / 11025, 0, 1), feat.z.toFixed(0) + ' /s'],
        ];
        const rh = bh / rows.length, lw = 90;
        rows.forEach(([name, v, txt], i) => {
          const y = by + i * rh;
          D.text(g, name, pad, y + rh / 2 - 6, { size: 11, color: C.text });
          D.rect(g, pad + lw, y + 3, tw - lw - 90, rh - 6, 'rgba(0,0,0,0.35)');
          D.rect(g, pad + lw, y + 3, (tw - lw - 90) * U.clamp(v, 0, 1), rh - 6, col);
          D.text(g, txt, pad + tw, y + rh / 2 - 6, { size: 11, color: C.text, align: 'right' });
        });
        ctx.stat(Lg('스펙트럼 중심', 'Spectral centroid'), feat.c.toFixed(0) + ' Hz');
        ctx.stat(Lg('스펙트럼 퍼짐', 'Spectral spread'), feat.s.toFixed(0) + ' Hz');
        ctx.stat(Lg('롤오프 (85%)', 'Rolloff (85%)'), feat.r.toFixed(0) + ' Hz');
        ctx.stat(Lg('평탄도', 'Flatness'), `${feat.fl.toPrecision(2)} (${(10 * Math.log10(feat.fl + 1e-12)).toFixed(1)} dB)`);
        ctx.stat(Lg('영교차율', 'Zero crossing rate'), feat.z.toFixed(0) + ' /s');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
