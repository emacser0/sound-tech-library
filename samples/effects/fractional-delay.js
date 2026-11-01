// 소수 지연 보간: 지연 시간을 흔들 때 정수로 반올림(지퍼 잡음) vs 선형 vs 1차 올패스(Thiran) vs 3차 에르미트
GTL.register({
  id: 'fractional-delay',
  title: '소수 지연 보간 (변조 지연선의 기초)',
  summary: '코러스, 플랜저, 비브라토, 피치 시프터는 모두 샘플 사이 위치를 읽어야 함. 정수로 반올림하면 지연이 계단처럼 바뀌어 지글거리는 잡음이 나고, 선형 보간은 고음이 흔들리며 줄어듦. 올패스와 3차 보간은 더 깨끗하지만 각자 단점이 있음.',
  views: { a: '보간 없음 (반올림)', b: '선형 보간' },
  controls: '파라미터 표에서 보간 방식, 시험음 주파수, 변조 깊이를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p>지연선은 샘플 단위로 저장되지만 변조 이펙트는 2.37샘플 같은 <b>소수 지연</b>을 읽어야 함. 읽는 방법에 따라 소리가 크게 달라짐.</p>
    <ul>
      <li><b>반올림</b>: 가장 가까운 샘플을 읽음. 지연이 1샘플씩 튀므로 위상이 계단처럼 바뀌어 "지글지글" 잡음(지퍼 잡음)이 생김.</li>
      <li><b>선형 보간</b>: 이웃 두 샘플을 비율대로 섞음. 곱셈 1번. 소수부가 0.5일 때 나이퀴스트에서 응답이 0이 되는 로우패스라서, 지연이 흔들리면 고음 크기도 함께 흔들림.</li>
      <li><b>1차 올패스 (Thiran)</b>: <code>y = η(x[n-M] - y[n-1]) + x[n-M-1]</code>, η = (1 - Δ)/(1 + Δ). 크기는 모든 주파수에서 1. 이전 출력을 기억하는 IIR이라 지연을 빠르게 바꾸면 순간 잡음이 생김. 물리 모델링처럼 지연이 거의 고정인 곳에 좋음.</li>
      <li><b>3차 에르미트 (Catmull-Rom)</b>: 이웃 4개 샘플로 3차 곡선을 맞춤. 곱셈 약 10번. 고음 손실이 선형보다 훨씬 작고 변조에도 안정적.</li>
    </ul>
    <p>시험음 sin(2πf(t - D(t)))은 정답을 수식으로 계산할 수 있어서, 보간 결과와의 차이를 잡음으로 보고 SNR을 잼</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="120" x2="520" y2="120" class="d-dim"/>
    <line x1="60" y1="120" x2="60" y2="70" class="d-line"/><line x1="160" y1="120" x2="160" y2="40" class="d-line"/><line x1="260" y1="120" x2="260" y2="50" class="d-line"/><line x1="360" y1="120" x2="360" y2="90" class="d-line"/>
    <circle cx="60" cy="70" r="3" class="f-accent"/><circle cx="160" cy="40" r="3" class="f-accent"/><circle cx="260" cy="50" r="3" class="f-accent"/><circle cx="360" cy="90" r="3" class="f-accent"/>
    <text x="60" y="136" text-anchor="middle" class="t-small">n-1</text><text x="160" y="136" text-anchor="middle" class="t-small">n</text><text x="260" y="136" text-anchor="middle" class="t-small">n+1</text><text x="360" y="136" text-anchor="middle" class="t-small">n+2</text>
    <line x1="200" y1="20" x2="200" y2="120" class="d-dim" stroke-dasharray="3 3"/><text x="200" y="152" text-anchor="middle" class="t-small">${L('읽을 위치 n + 0.4', 'Read position n + 0.4')}</text>
    <circle cx="160" cy="40" r="6" class="d-a"/><text x="96" y="30" class="t-small t-a">${L('반올림: n을 읽음', 'Round: reads n')}</text>
    <line x1="160" y1="40" x2="260" y2="50" class="d-b"/><circle cx="200" cy="44" r="5" class="d-b"/><text x="270" y="40" class="t-small t-b">${L('선형: 직선 위', 'Linear: on the line')}</text>
    <path d="M60,70 C110,40 140,34 160,40 C190,46 230,38 260,50 C300,64 330,80 360,90" class="d-accent" opacity="0.7"/>
    <text x="380" y="80" class="t-small">${L('3차: 이웃 4개로 곡선', 'Cubic: curve via 4 points')}</text>
  </svg>`,
  look: [
    '출력 스펙트럼을 비교하면 A는 시험음 주변에 잡음이 넓게 깔리고, B는 잡음 바닥이 훨씬 낮음',
    'B의 응답 곡선에서 소수부 0.5 곡선이 고음으로 갈수록 떨어짐. 변조할 때 고음 크기가 이 범위에서 흔들림.',
    '방식을 올패스나 3차로 바꾸면 "SNR"이 더 올라감. 올패스는 응답 곡선이 모두 0dB로 겹침.',
    '시험음을 1kHz로 내리면 모든 방식의 차이가 줄어듦. 고음일수록 보간 오차가 큼.',
    '변조 속도를 5Hz로 올리면 올패스의 SNR이 떨어짐. IIR 상태가 빠른 변화를 따라가지 못함.',
  ],
  refs: [
    { type: 'paper', title: 'Timo I. Laakso, Vesa Välimäki, Matti Karjalainen, Unto K. Laine, "Splitting the Unit Delay: Tools for Fractional Delay Filter Design", IEEE Signal Processing Magazine 13(1)', year: 1996, note: '소수 지연 필터 총정리 (선형, 라그랑주, Thiran 올패스)' },
    { type: 'paper', title: 'Jon Dattorro, "Effect Design, Part 2: Delay-Line Modulation and Chorus", Journal of the Audio Engineering Society 45(10)', year: 1997, note: '변조 지연선의 보간 선택' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '지연선 보간, Thiran 올패스' },
  ],
  params: [
    { key: 'interp', label: '보간 방식', type: 'select', options: [{ value: 'none', label: '없음 (반올림)' }, { value: 'linear', label: '선형' }, { value: 'allpass', label: '1차 올패스 (Thiran)' }, { value: 'cubic', label: '3차 에르미트' }], a: 'none', b: 'linear', group: '보간' },
    { key: 'freq', label: '시험음 주파수 (Hz)', type: 'range', min: 200, max: 15000, step: 50, default: 6000, shared: true, group: '시험 조건' },
    { key: 'depth', label: '변조 깊이 (샘플)', type: 'range', min: 0.5, max: 30, step: 0.5, default: 8, shared: true },
    { key: 'rate', label: '변조 속도 (Hz)', type: 'range', min: 0.1, max: 6, step: 0.1, default: 0.8, shared: true },
    { key: 'src', label: '소리 음원', type: 'select', options: [{ value: 'tone', label: '시험음' }, { value: 'noise', label: '하이햇 노이즈' }], default: 'tone', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Fractional Delay Interpolation (Basis of Modulated Delays)',
    summary: 'Chorus, flanger, vibrato and pitch shifters all read positions between samples. Rounding to whole samples makes the delay jump in steps and adds a sizzling noise. Linear interpolation makes the highs wobble and drop. Allpass and cubic interpolation are cleaner, but each has its own downside.',
    views: { a: 'No interpolation (round)', b: 'Linear interpolation' },
    controls: 'Change the interpolation, test tone frequency and modulation depth in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>A delay line stores whole samples, but modulation effects must read a <b>fractional delay</b> such as 2.37 samples. How you read it changes the sound a lot.</p>
    <ul>
      <li><b>Round</b>: reads the nearest sample. The delay jumps by 1 sample, so the phase changes in steps and makes a sizzling (zipper) noise.</li>
      <li><b>Linear</b>: mixes two neighbors by ratio. 1 multiply. With a fraction of 0.5 it is a lowpass with zero response at Nyquist, so when the delay moves, the level of the highs moves too.</li>
      <li><b>First order allpass (Thiran)</b>: <code>y = η(x[n-M] - y[n-1]) + x[n-M-1]</code>, η = (1 - Δ)/(1 + Δ). Level is 1 at every frequency. It is an IIR that remembers its last output, so fast delay changes cause short glitches. Good where the delay is almost fixed, as in physical modeling.</li>
      <li><b>Cubic Hermite (Catmull-Rom)</b>: fits a cubic through 4 neighbors. About 10 multiplies. Much less high loss than linear, and stable under modulation.</li>
    </ul>
    <p>The exact answer for the test tone sin(2πf(t - D(t))) can be computed from the formula, so the difference from the interpolated result is treated as noise to measure SNR.</p>`,
    look: [
      'Compare the output spectra. A has noise spread widely around the test tone. B has a much lower noise floor.',
      'In B\'s response curves, the fraction 0.5 curve falls toward the highs. When modulating, the level of the highs wobbles within this range.',
      'Switch to allpass or cubic. "SNR" rises further. For allpass all response curves sit on 0 dB.',
      'Lower the test tone to 1 kHz. The differences between methods shrink. Interpolation error grows with frequency.',
      'Raise modulation rate to 5 Hz. Allpass SNR drops, because the IIR state cannot follow fast changes.',
    ],
    refs: ['Survey of fractional delay filters (linear, Lagrange, Thiran allpass).', 'Choosing interpolation for modulated delay lines.', 'Delay line interpolation and Thiran allpass.'],
    params: {
      interp: { label: 'Interpolation', group: 'Interpolation', options: { none: 'None (round)', linear: 'Linear', allpass: 'First order allpass (Thiran)', cubic: 'Cubic Hermite' } },
      freq: { label: 'Test tone frequency (Hz)', group: 'Test setup' },
      depth: 'Modulation depth (samples)',
      rate: 'Modulation rate (Hz)',
      src: { label: 'Sound source', options: { tone: 'Test tone', noise: 'Hi-hat noise' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SR = 48000, N = 8192;

    // 지연 (샘플). 기본 지연 D0 + depth sin
    const D0 = 40;
    const delayAt = (t) => D0 + P.depth * Math.sin(TAU * P.rate * t);
    const herm = (t) => [((-0.5 * t + 1) * t - 0.5) * t, (1.5 * t - 2.5) * t * t + 1, ((-1.5 * t + 2) * t + 0.5) * t, (0.5 * t - 0.5) * t * t];

    function makeLine(sr) {
      const size = 256, buf = new Float32Array(size);
      let w = 0, n = 0, apY = 0, apM = -1;
      return (x) => {
        buf[w] = x;
        const d = delayAt(n / sr) * sr / SR; n++;
        const at = (k) => buf[((w - k) % size + size) % size];
        let y;
        switch (P.interp) {
          case 'none': y = at(Math.round(d)); break;
          case 'linear': { const M = Math.floor(d), fr = d - M; y = at(M) + (at(M + 1) - at(M)) * fr; break; }
          case 'allpass': {
            // Δ를 [0.5, 1.5)로 두어 η가 극단으로 가지 않게 함
            let M = Math.floor(d - 0.5), dl = d - M;
            if (M !== apM) apM = M; // 정수부가 바뀌면 상태는 그대로 둠 (순간 잡음의 원인)
            const eta = (1 - dl) / (1 + dl);
            y = eta * (at(M) - apY) + at(M + 1); apY = y;
            break;
          }
          default: {
            // 위치 p = w - d. 버퍼 인덱스가 클수록 새 샘플
            const M = Math.floor(d), fr = d - M, c = herm(1 - fr);
            y = c[0] * at(M + 2) + c[1] * at(M + 1) + c[2] * at(M) + c[3] * at(M - 1);
          }
        }
        w = (w + 1) % size;
        return y;
      };
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, ph: 0, fx: makeLine(sr), noise: A.noiseBuffer(sr, 4), n: 0 };
        for (let i = 0; i < n; i++) {
          live.n++;
          let x;
          if (P.src === 'tone') { live.ph = (live.ph + P.freq / sr) % 1; x = Math.sin(TAU * live.ph) * 0.35; }
          else { const t = (live.n % Math.round(sr * 0.25)) / sr, v = live.noise[live.n % sr]; x = (v - live.noise[(live.n + 1) % sr]) * Math.exp(-t * 12) * 0.4; }
          const v = live.fx(x);
          l[i] = v; r[i] = v;
        }
      },
    });

    let key = '', out = null, ideal = null, mags = null, snr = 0;
    function analyze() {
      const k = [P.interp, P.freq, P.depth, P.rate].join();
      if (k === key) return;
      key = k;
      const fx = makeLine(SR), warm = 2000, M = warm + N, f = P.freq;
      out = new Float32Array(M); ideal = new Float32Array(M);
      let se = 0, ss = 0;
      for (let i = 0; i < M; i++) {
        const t = i / SR;
        out[i] = fx(Math.sin(TAU * f * t));
        ideal[i] = Math.sin(TAU * f * (t - delayAt(t) / SR));
        if (i >= warm) { se += (out[i] - ideal[i]) ** 2; ss += ideal[i] ** 2; }
      }
      snr = 10 * Math.log10(ss / Math.max(1e-20, se));
      mags = A.spectrum(out, N, { offset: warm, window: 'blackman' });
    }
    // 보간기 크기 응답 (소수부 fr)
    function mag(f, fr) {
      const w = TAU * f / SR;
      if (P.interp === 'none' || P.interp === 'allpass') return 0;
      let re = 0, im = 0;
      const cs = P.interp === 'linear' ? [[0, 1 - fr], [1, fr]] : (() => { const c = herm(1 - fr); return [[-1, c[3]], [0, c[2]], [1, c[1]], [2, c[0]]]; })();
      for (const [k, c] of cs) { re += c * Math.cos(w * k); im -= c * Math.sin(w * k); }
      return A.linToDb(Math.hypot(re, im));
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = (H - pad * 4) * 0.28, h3 = H - pad * 4 - h1 - h2;
        // 응답 곡선 (소수부 0, 0.25, 0.5)
        A.drawResponse(g, () => -100, pad, pad, w, h1, { fmin: 100, fmax: 24000, minDb: -24, maxDb: 3, dbStep: 6, color: 'rgba(0,0,0,0)', label: GTL.L('보간기 크기 응답 (소수부 0, 0.25, 0.5)', 'Interpolator magnitude (fraction 0, 0.25, 0.5)') });
        [0, 0.25, 0.5].forEach((fr, i) => A.drawResponse(g, (f) => mag(f, fr), pad, pad, w, h1, { fmin: 100, fmax: 24000, minDb: -24, maxDb: 3, background: false, grid: false, color: col, lineWidth: 2 - i * 0.5 }));
        const fx = A.freqX(P.freq, pad, w, 100, 24000);
        D.line(g, fx, pad, fx, pad + h1, C.warn, 1);
        // 확대 파형: 정답(회색) vs 출력
        const y2 = pad * 2 + h1, cnt = Math.max(24, Math.round(SR / P.freq * 6)), from = 3000;
        A.drawWave(g, ideal, pad, y2, w, h2, { from, count: cnt, color: 'rgba(255,255,255,0.3)', lineWidth: 1 });
        A.drawWave(g, out, pad, y2, w, h2, { from, count: cnt, color: col, background: false, axis: false, dots: cnt < 80, label: GTL.L('출력 6주기 (회색 = 정답)', 'Output, 6 cycles (gray = exact)') });
        // 스펙트럼
        const y3 = pad * 3 + h1 + h2;
        A.drawSpectrum(g, mags, SR, pad, y3, w, h3, { color: col, fmin: 100, fmax: 24000, minDb: -130, maxDb: 0, label: GTL.L('출력 스펙트럼', 'Output spectrum') });
        const mults = { none: 0, linear: 1, allpass: 2, cubic: 10 }[P.interp];
        ctx.stat('SNR', snr.toFixed(1) + ' dB');
        ctx.stat(GTL.L('시험음에서 최대 손실 (소수부 0.5)', 'Max loss at test tone (fraction 0.5)'), (P.interp === 'linear' || P.interp === 'cubic' ? mag(P.freq, 0.5).toFixed(2) : '0.00') + ' dB');
        ctx.stat(GTL.L('샘플당 곱셈', 'Multiplies per sample'), mults);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
