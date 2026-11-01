// 보간과 리샘플링: 버퍼를 다른 속도로 읽을 때 샘플 사이 값을 어떻게 추정하느냐에 따라 잡음이 달라짐
GTL.register({
  id: 'interpolation-resampling',
  title: '보간과 리샘플링',
  summary: '버퍼를 다른 속도로 읽어 음높이를 바꿀 때 샘플 사이 값을 추정하는 방법을 비교. 최근접 샘플은 이미지 잡음이 크고, 윈도 싱크는 거의 깨끗함.',
  views: { a: '최근접 샘플', b: '윈도 싱크 (32탭)' },
  controls: '파라미터 표에서 재생 속도, 보간 방식, 원본 소리를 바꿈',
  info: `
    <p>샘플러, 피치 시프트, 샘플레이트 변환은 모두 버퍼를 원래와 다른 속도로 읽음. 그러면 읽는 위치가 샘플 사이(예: 102.37번째)에 떨어짐. 이 사이 값을 추정하는 일이 <b>보간(Interpolation)</b>.</p>
    <p>이상적인 답은 싱크(sinc) 함수로 모든 샘플을 더하는 것(샘플링 정리의 복원식). 실제로는 비용 때문에 근사함. 근사가 거칠수록 원래 스펙트럼의 복제본(이미지)이 덜 지워져 음과 무관한 잡음 기둥이 남음.</p>
    <ul>
      <li><b>최근접 샘플(Drop-sample)</b>: 가장 가까운 샘플을 그대로 씀. 1탭. 이미지 잡음이 큼.</li>
      <li><b>선형</b>: 이웃 두 샘플을 직선으로 이음. 2탭. 고음이 약간 깎이고 잡음이 남음.</li>
      <li><b>3차 에르미트(Catmull-Rom)</b>: 4탭. 게임, 샘플러에서 흔한 절충.</li>
      <li><b>윈도 싱크</b>: 블랙먼 창을 씌운 싱크 32탭. 속도가 1보다 빠르면 차단 주파수를 낮춰 에일리어싱도 막음.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="100" x2="520" y2="100" class="d-dim"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${60 + i * 80}" y1="100" x2="${60 + i * 80}" y2="${[60, 40, 55, 85, 70, 50][i]}" class="d-dim"/><circle cx="${60 + i * 80}" cy="${[60, 40, 55, 85, 70, 50][i]}" r="4" class="f-accent"/>`).join('')}
    <line x1="250" y1="20" x2="250" y2="112" class="d-line" stroke-dasharray="3 3"/>
    <text x="250" y="126" text-anchor="middle" class="t-small">${L('읽는 위치 2.37', 'read position 2.37')}</text>
    <path d="M220,55 H260" class="d-a"/><text x="200" y="30" class="t-small t-a">${L('최근접 (1탭)', 'nearest (1 tap)')}</text>
    <path d="M220,55 L300,85" class="d-b" stroke-dasharray="4 2"/>
    <path d="M60,100 C120,100 150,20 250,20 C350,20 380,100 440,100" class="d-b"/>
    <text x="300" y="24" class="t-small t-b">${L('싱크 핵: 이웃 여러 샘플의 가중 합', 'sinc: weighted sum of neighbors')}</text>
    <text x="270" y="146" text-anchor="middle" class="t-small t-dim">${L('탭이 많을수록 이상적인 복원(무한 싱크)에 가까워짐', 'More taps get closer to ideal reconstruction (infinite sinc)')}</text>
  </svg>`,
  look: [
    'A의 스펙트럼에는 목표 주파수(초록 눈금) 말고도 잡음 기둥이 여러 개 섬. B는 목표 하나만 뚜렷함.',
    'A를 선형, 3차로 차례로 바꾸면 "가짜 성분 (최대)"가 점점 내려감',
    '원본을 "배음이 많은 음"으로 바꾸고 재생 속도를 1.8로 올리면, 싱크가 아닌 방식에서 고음 배음이 접혀 쇳소리가 남',
    '재생 속도를 1.00으로 맞추면 모든 방식이 원본과 같아짐 (보간할 필요가 없음)',
  ],
  refs: [
    { type: 'article', title: 'Julius O. Smith III, "Digital Audio Resampling Home Page"', url: 'https://ccrma.stanford.edu/~jos/resample/', note: '윈도 싱크 대역 제한 보간' },
    { type: 'article', title: 'Olli Niemitalo, "Polynomial Interpolators for High-Quality Resampling of Oversampled Audio"', year: 2001, note: '선형, 에르미트 등 다항식 보간기 비교' },
    { type: 'paper', title: 'R. E. Crochiere, L. R. Rabiner, "Interpolation and Decimation of Digital Signals: A Tutorial Review", Proceedings of the IEEE 69(3)', year: 1981, note: '리샘플링 이론' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', note: '샘플러의 피치 시프트와 보간' },
  ],
  params: [
    { key: 'method', label: '보간 방식', type: 'select', options: [{ value: 'nearest', label: '최근접 샘플' }, { value: 'linear', label: '선형' }, { value: 'cubic', label: '3차 에르미트' }, { value: 'sinc', label: '윈도 싱크' }], a: 'nearest', b: 'sinc', default: 'nearest', group: '리샘플러' },
    { key: 'rate', label: '재생 속도', type: 'range', min: 0.5, max: 2, step: 0.01, default: 1.37, shared: true, help: '1보다 크면 음이 높아짐' },
    { key: 'src', label: '원본 소리', type: 'select', options: [{ value: 'sine', label: '사인파' }, { value: 'tone', label: '배음이 많은 음 (220 Hz)' }], default: 'sine', shared: true, group: '원본 버퍼' },
    { key: 'f0', label: '사인파 주파수 (Hz)', type: 'int', min: 100, max: 10000, step: 50, default: 3000, shared: true, when: (p) => p.src === 'sine' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Interpolation and Resampling',
    summary: 'Compares ways to estimate values between samples when a buffer is read at another speed to change pitch. Nearest sample leaves strong image noise, windowed sinc is almost clean.',
    views: { a: 'Nearest sample', b: 'Windowed sinc (32 taps)' },
    controls: 'Change playback rate, interpolation method and source sound in the parameter table.',
    info: `
    <p>Samplers, pitch shifters and sample rate converters all read a buffer at a different speed. The read position then falls between samples (for example at sample 102.37). Estimating the value in between is <b>interpolation</b>.</p>
    <p>The ideal answer sums every sample with a sinc function (the rebuild formula of the sampling theorem). In practice we approximate it to save cost. A rougher approximation removes less of the spectrum copies (images), so noise peaks that have nothing to do with the note remain.</p>
    <ul>
      <li><b>Nearest sample (drop-sample)</b>: uses the closest sample as is. 1 tap. Strong image noise.</li>
      <li><b>Linear</b>: draws a straight line between two neighbors. 2 taps. Slightly dull highs, some noise left.</li>
      <li><b>Cubic Hermite (Catmull-Rom)</b>: 4 taps. A common compromise in games and samplers.</li>
      <li><b>Windowed sinc</b>: 32 tap sinc with a Blackman window. When the rate is above 1 it lowers the cutoff to also stop aliasing.</li>
    </ul>`,
    look: [
      'A\'s spectrum has several noise peaks besides the target frequency (green tick). B shows only the target.',
      'Switch A to linear, then cubic. "Spurious (max)" goes down step by step.',
      'Set the source to "Harmonic tone" and raise the rate to 1.8. Every method except sinc folds high harmonics back and sounds metallic.',
      'Set the rate to 1.00. Every method matches the source (no interpolation needed).',
    ],
    refs: ['Band-limited interpolation with windowed sinc.', 'Comparison of polynomial interpolators such as linear and Hermite.', 'Resampling theory.', 'Pitch shifting and interpolation in samplers.'],
    params: {
      method: { label: 'Interpolation', group: 'Resampler', options: { nearest: 'Nearest sample', linear: 'Linear', cubic: 'Cubic Hermite', sinc: 'Windowed sinc' } },
      rate: { label: 'Playback rate', help: 'Above 1 raises the pitch' },
      src: { label: 'Source sound', group: 'Source buffer', options: { sine: 'Sine', tone: 'Harmonic tone (220 Hz)' } },
      f0: 'Sine frequency (Hz)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, LEN = SR, N = 8192, TAU = Math.PI * 2;
    const HW = 16, PH = 512; // 싱크 반폭(탭 32), 분수 위상 수

    // 원본 버퍼: 1초. 정수 Hz라 끊김 없이 반복됨
    let tab = null, tabKey = '';
    function buildSource() {
      const k = P.src + '|' + (P.src === 'sine' ? P.f0 : '');
      if (k === tabKey) return;
      tabKey = k; tab = new Float32Array(LEN);
      if (P.src === 'sine') for (let i = 0; i < LEN; i++) tab[i] = Math.sin(TAU * P.f0 * i / SR) * 0.8;
      else {
        const f = 220, K = Math.floor(20000 / f);
        for (let h = 1; h <= K; h++) { const a = 0.5 / h, w = TAU * f * h / SR; let c = Math.cos(w), s0 = 0, s1 = Math.sin(w); // 사인 점화식
          for (let i = 1; i < LEN; i++) { tab[i] += a * s1; const s2 = 2 * c * s1 - s0; s0 = s1; s1 = s2; } }
      }
    }
    // 싱크 표: fc(나이퀴스트 대비)마다 PH x 2HW
    let kern = null, kernFc = -1;
    function buildKernel(fc) {
      if (Math.abs(fc - kernFc) < 1e-4) return;
      kernFc = fc; kern = new Float32Array((PH + 1) * HW * 2);
      for (let p = 0; p <= PH; p++) {
        const frac = p / PH;
        for (let j = 0; j < HW * 2; j++) {
          const t = j - (HW - 1) - frac; // 탭 위치 - 읽는 위치
          const x = t * fc, s = Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
          const wn = (t + HW) / (2 * HW), win = wn <= 0 || wn >= 1 ? 0 : 0.42 - 0.5 * Math.cos(TAU * wn) + 0.08 * Math.cos(2 * TAU * wn);
          kern[p * HW * 2 + j] = fc * s * win;
        }
      }
    }
    const at = (i) => tab[((i % LEN) + LEN) % LEN];
    function read(pos, method) {
      const i = Math.floor(pos), fr = pos - i;
      switch (method) {
        case 'nearest': return at(Math.round(pos));
        case 'linear': return at(i) + (at(i + 1) - at(i)) * fr;
        case 'cubic': {
          const y0 = at(i - 1), y1 = at(i), y2 = at(i + 1), y3 = at(i + 2);
          const c1 = 0.5 * (y2 - y0), c2 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3, c3 = 0.5 * (y3 - y0) + 1.5 * (y1 - y2);
          return ((c3 * fr + c2) * fr + c1) * fr + y1;
        }
        default: {
          const p = Math.round(fr * PH), base = p * HW * 2;
          let s = 0;
          for (let j = 0; j < HW * 2; j++) s += kern[base + j] * at(i - HW + 1 + j);
          return s;
        }
      }
    }
    const fcOf = () => Math.min(1, 1 / P.rate) * 0.97;

    let pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        buildSource(); buildKernel(fcOf());
        const step = P.rate * SR / sr, m = P.method;
        for (let i = 0; i < n; i++) {
          const v = read(pos, m) * 0.55;
          pos += step; if (pos >= LEN) pos -= LEN;
          l[i] = v; r[i] = v;
        }
      },
    });

    let key = '', out = null, mags = null, spur = 0, targets = [];
    function analyze() {
      buildSource(); buildKernel(fcOf());
      const k = tabKey + '|' + P.method + '|' + P.rate;
      if (k === key) return;
      key = k;
      out = new Float32Array(N);
      for (let i = 0; i < N; i++) out[i] = read(1000 + i * P.rate, P.method);
      mags = A.spectrum(out, N, { window: 'blackman' });
      targets = P.src === 'sine' ? [P.f0 * P.rate] : [];
      if (P.src === 'tone') for (let h = 1; 220 * h * P.rate < SR / 2 && 220 * h <= 20000; h++) targets.push(220 * h * P.rate);
      const binHz = SR / N;
      spur = -200;
      for (let b = 3; b < N / 2; b++) {
        const fr = b * binHz;
        if (targets.some((t) => Math.abs(t - fr) < 4 * binHz)) continue;
        if (mags[b] > spur) spur = mags[b];
      }
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const th = Math.max(50, H * 0.34);
        // 출력 파형 확대: 출력 샘플 40개
        const cnt = 40;
        A.drawWave(g, out, pad, pad, w, th, { count: cnt, color: col, dots: true, amp: 1.1, label: Lx('출력 샘플 40개', '40 output samples') });
        const sy = pad * 2 + th, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, w, sh, { color: col, minDb: -140, maxDb: 0, dbStep: 20, label: Lx('출력 스펙트럼 (초록 눈금 = 목표 주파수)', 'Output spectrum (green ticks = target frequencies)') });
        for (const t of targets.slice(0, 60)) { const px = A.freqX(t, pad, w, 20, 20000); D.line(g, px, sy + sh - 5, px, sy + sh, C.good, 2); }
        const taps = { nearest: 1, linear: 2, cubic: 4, sinc: HW * 2 }[P.method];
        ctx.stat(Lx('가짜 성분 (최대)', 'Spurious (max)'), spur.toFixed(1) + ' dB');
        ctx.stat(Lx('출력 샘플당 탭 수', 'Taps per output sample'), String(taps));
        ctx.stat(Lx('음높이 변화', 'Pitch change'), (12 * Math.log2(P.rate)).toFixed(2) + Lx(' 반음', ' semitones'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
