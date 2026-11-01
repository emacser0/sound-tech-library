// 비트크러셔: 비트 깊이 줄이기(양자화 잡음) vs 샘플레이트 줄이기(계단 + 에일리어싱)
GTL.register({
  id: 'bitcrusher',
  title: '비트크러셔 (비트 깊이 vs 샘플레이트 줄이기)',
  summary: '비트크러셔는 디지털 오디오의 두 해상도를 일부러 낮추는 이펙트. 비트 깊이를 줄이면 세로 방향 계단이 생겨 잡음과 거친 왜곡이 늘고, 샘플레이트를 줄이면 가로 방향 계단이 생겨 고음이 접혀 금속성 소리가 남.',
  views: { a: '비트 깊이 5비트', b: '샘플레이트 4kHz' },
  controls: '파라미터 표에서 비트 수와 샘플레이트를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p>디지털 오디오의 해상도는 두 가지. 세로는 <b>비트 깊이</b>(값을 몇 단계로 나누는가), 가로는 <b>샘플레이트</b>(1초에 몇 번 재는가). 비트크러셔는 둘을 일부러 낮춰 옛 게임기, 초기 샘플러 소리를 냄.</p>
    <ul>
      <li><b>비트 깊이 줄이기</b>: <code>y = round(x / q) × q</code>, q = 2 / 2<sup>N</sup>. 반올림 오차가 잡음이 됨. 1비트마다 신호 대 잡음비(SNR)가 약 6dB 줄어듦(이론값 6.02N + 1.76dB). 작은 소리에서는 오차가 신호를 따라 움직여 잡음이 아니라 거친 왜곡으로 들림.</li>
      <li><b>디더(Dither)</b>: 반올림 전에 작은 노이즈를 더함. 왜곡이 고른 잡음으로 바뀌어 덜 거슬림.</li>
      <li><b>샘플레이트 줄이기</b>: 새 샘플레이트 간격마다 값을 하나 잡아 그대로 유지(샘플 앤 홀드). 앞에 로우패스 필터가 없으므로 새 나이퀴스트 위의 성분이 그대로 접혀 들어옴. 계단 모양 자체도 원래 샘플레이트에서 높은 배음을 만듦.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,80 C50,20 90,20 120,80 C150,140 190,140 220,80" class="d-dim"/>
    <path d="M20,80 L20,68 L30,68 L30,44 L44,44 L44,32 L96,32 L96,44 L110,44 L110,68 L120,68 L120,92 L130,92 L130,116 L144,116 L144,128 L196,128 L196,116 L210,116 L210,92 L220,92" class="d-a"/>
    <text x="120" y="156" text-anchor="middle" class="t-small t-a">${L('비트 깊이: 세로 계단 (값을 반올림)', 'Bit depth: vertical steps (round values)')}</text>
    <path d="M300,80 C330,20 370,20 400,80 C430,140 470,140 500,80" class="d-dim"/>
    <path d="M300,80 L330,80 L330,30 L360,30 L360,35 L390,35 L390,64 L420,64 L420,124 L450,124 L450,130 L480,130 L480,100 L500,100" class="d-b"/>
    <text x="400" y="156" text-anchor="middle" class="t-small t-b">${L('샘플레이트: 가로 계단 (값을 유지)', 'Sample rate: horizontal steps (hold values)')}</text>
  </svg>`,
  look: [
    '확대 파형을 비교하면 A는 세로 계단이 촘촘하고 B는 가로 계단이 넓음',
    'A의 비트 수를 1씩 내리면 "측정 SNR"이 약 6dB씩 떨어짐',
    'B의 스펙트럼에서 음 높이를 올리면 새 나이퀴스트에서 접힌 선이 반대 방향으로 움직임',
    'A에서 디더를 켜면 배음 모양 잡음이 사라지고 평평한 잡음 바닥으로 바뀜. 소리는 쉬익 소리가 됨.',
  ],
  refs: [
    { type: 'book', title: 'Ken C. Pohlmann, Principles of Digital Audio, 6th ed., McGraw-Hill', year: 2011, note: '양자화, 디더, 샘플링' },
    { type: 'book', title: 'Udo Zölzer, Digital Audio Signal Processing, 2nd ed., Wiley', year: 2008, note: '양자화 잡음과 디더' },
    { type: 'paper', title: 'Stanley P. Lipshitz, Robert A. Wannamaker, John Vanderkooy, "Quantization and Dither: A Theoretical Survey", Journal of the Audio Engineering Society 40(5)', year: 1992, note: 'TPDF 디더 이론' },
    { type: 'book', title: 'Karen Collins, Game Sound, MIT Press', year: 2008, note: '초기 게임기 사운드 칩의 해상도 한계' },
  ],
  params: [
    { key: 'bits', label: '비트 깊이', type: 'int', min: 1, max: 16, a: 5, b: 16, group: '크러셔' },
    { key: 'rate', label: '샘플레이트 (Hz)', type: 'range', min: 500, max: 48000, step: 100, a: 48000, b: 4000 },
    { key: 'dither', label: '디더 (TPDF)', type: 'bool', default: false },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'sine', label: '사인파' }, { value: 'melody', label: '멜로디' }, { value: 'drums', label: '드럼' }], default: 'melody', shared: true, group: '음원' },
    { key: 'note', label: '사인파 음 높이 (MIDI)', type: 'int', min: 48, max: 100, default: 76, shared: true, when: (p) => p.src === 'sine' },
    { key: 'level', label: '입력 크기 (dB)', type: 'range', min: -40, max: 0, step: 1, default: -6, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Bitcrusher (Bit Depth vs Sample Rate Reduction)',
    summary: 'A bitcrusher lowers the two resolutions of digital audio on purpose. Fewer bits make vertical steps that add noise and harsh distortion. A lower sample rate makes horizontal steps that fold high frequencies back and sound metallic.',
    views: { a: 'Bit depth 5 bits', b: 'Sample rate 4 kHz' },
    controls: 'Change bit count and sample rate in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>Digital audio has two resolutions. Vertical is <b>bit depth</b> (how many steps a value has). Horizontal is <b>sample rate</b> (how many times per second it is measured). A bitcrusher lowers both on purpose to sound like old game consoles and early samplers.</p>
    <ul>
      <li><b>Bit reduction</b>: <code>y = round(x / q) × q</code>, q = 2 / 2<sup>N</sup>. The rounding error becomes noise. Each bit removed lowers the signal to noise ratio (SNR) by about 6 dB (theory: 6.02N + 1.76 dB). On quiet sounds the error follows the signal, so it sounds like harsh distortion, not noise.</li>
      <li><b>Dither</b>: adds a little noise before rounding. The distortion turns into even noise, which is less annoying.</li>
      <li><b>Sample rate reduction</b>: takes one value per new sample period and holds it (sample and hold). There is no lowpass filter first, so content above the new Nyquist folds straight back. The step shape itself also adds high harmonics at the original rate.</li>
    </ul>`,
    look: [
      'Compare the zoomed waveforms. A has fine vertical steps. B has wide horizontal steps.',
      'Lower the bit count of A one at a time. "Measured SNR" drops by about 6 dB each step.',
      'Raise the pitch while watching B\'s spectrum. Lines folded at the new Nyquist move the opposite way.',
      'Turn on dither in A. The harmonic-shaped error becomes a flat noise floor. It sounds like hiss.',
    ],
    refs: ['Quantization, dither and sampling.', 'Quantization noise and dither.', 'TPDF dither theory.', 'Resolution limits of early game console sound chips.'],
    params: {
      bits: { label: 'Bit depth', group: 'Crusher' },
      rate: 'Sample rate (Hz)',
      dither: 'Dither (TPDF)',
      src: { label: 'Source', group: 'Source', options: { sine: 'Sine', melody: 'Melody', drums: 'Drums' } },
      note: 'Sine pitch (MIDI)',
      level: 'Input level (dB)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SR = 48000, N = 4096;

    // 음원 (진폭 1 기준, level로 줄임)
    function makeSource(sr) {
      const noise = A.noiseBuffer(sr, 3), mel = [64, 67, 69, 71, 74, 71, 69, 67];
      let n = 0, ph = 0;
      return () => {
        n++;
        if (P.src === 'sine') { ph = (ph + A.mtof(P.note) / sr) % 1; return Math.sin(TAU * ph); }
        const step = Math.round(sr * 0.18), k = Math.floor(n / step) % 8, t = (n % step) / sr;
        if (P.src === 'melody') { ph = (ph + A.mtof(mel[k]) / sr) % 1; return (0.7 * Math.sin(TAU * ph) + 0.3 * A.wave.triangle(ph)) * Math.min(1, t * 200) * Math.exp(-t * 3); }
        const nz = noise[n % sr];
        if (k % 4 === 0) { ph = (ph + (50 + 120 * Math.exp(-t * 30)) / sr) % 1; return Math.sin(TAU * ph) * Math.exp(-t * 7); }
        if (k % 4 === 2) return nz * Math.exp(-t * 18) * 0.8;
        return nz * Math.exp(-t * 60) * 0.3;
      };
    }
    function makeCrusher(sr, seed) {
      const rng = U.rng(seed);
      let hold = 0, acc = 1;
      return (x) => {
        acc += P.rate / sr;
        if (acc >= 1) {
          acc -= Math.floor(acc);
          let v = x;
          if (P.bits < 16 || P.dither) {
            const q = 2 / Math.pow(2, P.bits);
            if (P.dither) v += (rng.next() - rng.next()) * q;
            v = Math.round(v / q) * q;
          }
          hold = v;
        }
        return hold;
      };
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeCrusher(sr, 5) };
        const gl = A.dbToLin(P.level);
        for (let i = 0; i < n; i++) { const v = live.fx(live.src() * gl) * 0.5; l[i] = v; r[i] = v; }
      },
    });

    let key = '', clean = null, out = null, mags = null, snr = 0;
    function analyze() {
      const k = [P.bits, P.rate, P.dither, P.src, P.note, P.level].join();
      if (k === key) return;
      key = k;
      const src = makeSource(SR), fx = makeCrusher(SR, 5), gl = A.dbToLin(P.level), M = N + SR / 2;
      clean = new Float32Array(M); out = new Float32Array(M);
      let se = 0, ss = 0;
      for (let i = 0; i < M; i++) { const x = src() * gl; clean[i] = x; out[i] = fx(x); ss += x * x; se += (out[i] - x) ** 2; }
      snr = 10 * Math.log10(Math.max(1e-20, ss) / Math.max(1e-20, se));
      mags = A.spectrum(out, N, { offset: M - N, window: 'blackman' });
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const wh = Math.max(60, H * 0.45);
        // 확대 파형: 2.5ms (120 샘플 @48k)
        const from = out.length - N, cnt = 120;
        let pk = 1e-6;
        for (let i = from; i < from + cnt; i++) pk = Math.max(pk, Math.abs(clean[i]));
        const amp = 0.9 / pk;
        A.drawWave(g, clean, pad, pad, w, wh, { from, count: cnt, color: 'rgba(255,255,255,0.3)', amp, lineWidth: 1 });
        // 계단 그리기
        g.beginPath();
        for (let i = 0; i < cnt; i++) {
          const x0 = pad + (i / (cnt - 1)) * w, x1 = pad + ((i + 1) / (cnt - 1)) * w, y = pad + wh / 2 - U.clamp(out[from + i] * amp, -1.05, 1.05) * wh / 2;
          i ? g.lineTo(x0, y) : g.moveTo(x0, y);
          if (i < cnt - 1) g.lineTo(x1, y);
        }
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        D.text(g, GTL.L('확대 파형 2.5ms (회색 = 원음, 크기 맞춤)', 'Zoomed waveform 2.5 ms (gray = original, scaled)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        const sy = pad * 2 + wh, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, w, sh, { color: col, minDb: -120, maxDb: 0, label: GTL.L('스펙트럼', 'Spectrum') });
        if (P.rate < SR) { const nx = A.freqX(P.rate / 2, pad, w, 20, 20000); D.line(g, nx, sy, nx, sy + sh, C.warn, 1); D.text(g, GTL.L('새 나이퀴스트', 'New Nyquist'), nx + 3, sy + 16, { size: 9, color: C.warn }); }
        ctx.stat(GTL.L('양자화 단계 수', 'Quantization steps'), P.bits >= 16 && !P.dither ? '65536' : String(Math.pow(2, P.bits)));
        ctx.stat(GTL.L('이론 SNR (풀스케일 사인)', 'Theory SNR (full-scale sine)'), (6.02 * P.bits + 1.76).toFixed(1) + ' dB');
        ctx.stat(GTL.L('측정 SNR', 'Measured SNR'), snr.toFixed(1) + ' dB');
        ctx.stat(GTL.L('새 나이퀴스트', 'New Nyquist'), (P.rate / 2).toFixed(0) + ' Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
