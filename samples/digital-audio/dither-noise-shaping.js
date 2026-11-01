// 디더와 노이즈 셰이핑: 반올림만 하면 작은 신호가 왜곡됨. TPDF 디더는 왜곡을 고른 잡음으로 바꾸고, 노이즈 셰이핑은 그 잡음을 고음으로 밀어냄
GTL.register({
  id: 'dither-noise-shaping',
  title: '디더와 노이즈 셰이핑',
  summary: '아주 작은 사인파를 낮은 비트로 줄일 때 단순 반올림, TPDF 디더, 노이즈 셰이핑 디더를 비교. 디더는 배음 왜곡을 고른 잡음으로 바꾸고, 노이즈 셰이핑은 그 잡음을 귀가 둔한 고음 쪽으로 옮김.',
  views: { a: '단순 반올림', b: '노이즈 셰이핑 디더' },
  controls: '파라미터 표에서 방식, 비트 수, 신호 레벨을 바꿈',
  info: `
    <p>24비트 믹스를 16비트로 내보내는 것처럼 비트 수를 줄이면 양자화가 다시 일어남. 신호가 몇 LSB밖에 안 되면 반올림 오차가 신호와 같이 움직임. 그래서 오차가 잡음이 아니라 <b>배음 왜곡</b>이 되고, 1 LSB보다 작은 소리는 아예 사라짐.</p>
    <p><b>디더(Dither)</b>는 반올림 전에 작은 잡음을 더해 오차를 신호와 무관하게 만드는 방법. 잡음이 조금 늘지만 왜곡이 사라지고 LSB보다 작은 소리도 잡음 속에 남음.</p>
    <ul>
      <li><b>TPDF 디더</b>: 균등 난수 두 개를 더한 삼각 분포, 크기 ±1 LSB. 오차의 평균과 분산이 모두 신호와 무관해짐.</li>
      <li><b>노이즈 셰이핑(Noise Shaping)</b>: 이전 샘플의 오차를 되먹여 빼서 잡음 스펙트럼을 모양 지음. 여기서는 2차 오차 되먹임 <code>(1 - z⁻¹)²</code>. 저음, 중음의 잡음은 줄고 고음의 잡음은 늘어남.</li>
      <li>단점: 전체 잡음 에너지는 커짐. 셰이핑한 결과를 다시 처리(게인, EQ, 비트 축소)하면 효과가 깨짐. 그래서 맨 마지막 단계에서 한 번만 씀.</li>
    </ul>
    <p>여기서는 차이를 잘 들리게 하려고 신호를 수 LSB 크기로 두고 모니터 음량을 키움</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="20" y="54" class="t-small">x[n]</text>
    <circle cx="90" cy="50" r="10" class="d-line"/><text x="90" y="54" text-anchor="middle" class="t-small">+</text>
    <circle cx="170" cy="50" r="10" class="d-line"/><text x="170" y="54" text-anchor="middle" class="t-small">+</text>
    <rect x="230" y="34" width="70" height="32" class="f-dim"/><text x="265" y="54" text-anchor="middle" class="t-small">${L('반올림 Q', 'Round Q')}</text>
    <text x="470" y="54" class="t-small">y[n]</text>
    <path d="M45,50 H78" class="d-line" marker-end="url(#arr)"/>
    <path d="M100,50 H158" class="d-line" marker-end="url(#arr)"/>
    <path d="M180,50 H228" class="d-line" marker-end="url(#arr)"/>
    <path d="M300,50 H465" class="d-line" marker-end="url(#arr)"/>
    <text x="170" y="22" text-anchor="middle" class="t-small t-a">${L('TPDF 디더 ±1 LSB', 'TPDF dither ±1 LSB')}</text>
    <path d="M170,26 V38" class="d-a" marker-end="url(#arr)"/>
    <path d="M360,50 V110 H310" class="d-b" marker-end="url(#arr)"/>
    <rect x="200" y="96" width="110" height="28" class="f-dim"/><text x="255" y="114" text-anchor="middle" class="t-small t-mono">2e[n-1] - e[n-2]</text>
    <path d="M200,110 H90 V62" class="d-b" marker-end="url(#arr)"/>
    <text x="96" y="80" class="t-small t-b">${L('빼기', 'subtract')}</text>
    <text x="370" y="96" class="t-small t-b">${L('오차 e = y - (Q 입력)', 'error e = y - (Q input)')}</text>
    <text x="270" y="142" text-anchor="middle" class="t-small t-dim">${L('잡음 전달 함수 (1 - z⁻¹)²: 저음 잡음 감소, 고음 잡음 증가', 'Noise transfer (1 - z⁻¹)²: less noise low, more noise high')}</text>
  </svg>`,
  look: [
    'A의 스펙트럼에는 375 Hz의 홀수 배음 기둥이 늘어섬. B에는 배음이 없고 잡음이 오른쪽(고음)으로 갈수록 올라감.',
    'A를 "TPDF 디더"로 바꾸면 배음이 사라지고 평평한 잡음 바닥이 생김',
    '"자동 페이드"를 켜고 들으면 A는 음이 거친 사각파로 변하다가 뚝 끊김. 디더를 쓰면 음이 잡음 속으로 부드럽게 사라짐.',
    '"저음 잡음 (0~4 kHz)" 측정값을 비교하면 노이즈 셰이핑이 TPDF보다 10dB 이상 낮음',
  ],
  refs: [
    { type: 'paper', title: 'S. P. Lipshitz, R. A. Wannamaker, J. Vanderkooy, "Quantization and Dither: A Theoretical Survey", Journal of the Audio Engineering Society 40(5)', year: 1992, note: 'TPDF 디더가 오차의 1, 2차 모멘트를 신호와 무관하게 만드는 이유' },
    { type: 'paper', title: 'J. Vanderkooy, S. P. Lipshitz, "Resolution Below the Least Significant Bit in Digital Systems with Dither", Journal of the Audio Engineering Society 32(3)', year: 1984, note: 'LSB 아래 신호가 디더로 살아남는 원리' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '디더와 노이즈 셰이핑 구현' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science', note: '마스터링 마지막 단계의 디더 실무' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'round', label: '단순 반올림' }, { value: 'tpdf', label: 'TPDF 디더' }, { value: 'shaped', label: '노이즈 셰이핑 디더' }], a: 'round', b: 'shaped', default: 'round', group: '양자화' },
    { key: 'bits', label: '비트 수', type: 'int', min: 4, max: 16, default: 8, shared: true },
    { key: 'level', label: '신호 레벨 (LSB)', type: 'range', min: 0.25, max: 16, step: 0.25, default: 2, shared: true, help: '사인파 진폭을 LSB 단위로 지정' },
    { key: 'fade', label: '자동 페이드', type: 'bool', default: false, shared: true, help: '8초 주기로 진폭이 0.1 LSB까지 내려갔다 돌아옴' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Dither and Noise Shaping',
    summary: 'A very small sine wave is reduced to a low bit depth with plain rounding, TPDF dither, or noise-shaped dither. Dither turns harmonic distortion into even noise, and noise shaping moves that noise up to the highs where the ear is less sensitive.',
    views: { a: 'Plain rounding', b: 'Noise-shaped dither' },
    controls: 'Change the method, bit depth and signal level in the parameter table.',
    info: `
    <p>When you reduce the bit depth, for example when you export a 24 bit mix to 16 bit, quantization happens again. If the signal is only a few LSB tall, the rounding error moves with the signal. The error becomes <b>harmonic distortion</b> instead of noise, and sounds smaller than 1 LSB vanish.</p>
    <p><b>Dither</b> adds a little noise before rounding so that the error no longer depends on the signal. The noise goes up a bit, but the distortion goes away and sounds below 1 LSB stay audible inside the noise.</p>
    <ul>
      <li><b>TPDF dither</b>: the sum of two uniform random numbers (triangular distribution), ±1 LSB. Both the mean and the variance of the error become independent of the signal.</li>
      <li><b>Noise shaping</b>: feeds back and subtracts the error of earlier samples to shape the noise spectrum. Here: 2nd order error feedback <code>(1 - z⁻¹)²</code>. Noise in the lows and mids goes down, noise in the highs goes up.</li>
      <li>Drawbacks: total noise energy grows. Any later processing (gain, EQ, another bit reduction) breaks the shaping. So it is used once, as the very last step.</li>
    </ul>
    <p>To make the difference easy to hear, the signal here is only a few LSB tall and the monitor level is boosted.</p>`,
    look: [
      'A\'s spectrum has a row of odd harmonics of 375 Hz. B has no harmonics, and its noise rises toward the right (highs).',
      'Switch A to "TPDF dither". The harmonics disappear and a flat noise floor appears.',
      'Turn on "Auto fade" and listen. A turns into a rough square wave and then cuts off. With dither the tone fades smoothly into the noise.',
      'Compare the "Low noise (0 to 4 kHz)" stat. Noise shaping is more than 10 dB lower than TPDF.',
    ],
    refs: ['Why TPDF dither makes the first two error moments independent of the signal.', 'How dither keeps signals below 1 LSB.', 'Implementing dither and noise shaping.', 'Dither in the last mastering step.'],
    params: {
      method: { label: 'Method', group: 'Quantization', options: { round: 'Plain rounding', tpdf: 'TPDF dither', shaped: 'Noise-shaped dither' } },
      bits: 'Bit depth',
      level: { label: 'Signal level (LSB)', help: 'Sine amplitude in LSB units' },
      fade: { label: 'Auto fade', help: 'Amplitude drops to 0.1 LSB and comes back every 8 seconds' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 4096, F0 = 375, TAU = Math.PI * 2;
    let fadeT = 0;

    // 양자화기 상태: 이전 오차 2개. rnd: 0~1 난수 함수
    function makeQ(rnd) {
      const st = { e1: 0, e2: 0 };
      st.run = (x, method, lsb) => {
        let v = x;
        if (method === 'shaped') v = x - (2 * st.e1 - st.e2);
        const d = method === 'round' ? 0 : (rnd() - rnd()) * lsb; // TPDF ±1 LSB
        const y = Math.round((v + d) / lsb) * lsb;
        const e = y - v;
        st.e2 = st.e1; st.e1 = e;
        return y;
      };
      return st;
    }
    const ampLsb = () => (P.fade ? P.level * Math.pow(10, -Math.log10(P.level / 0.1) * (1 - Math.abs(1 - 2 * fadeT / 8))) : P.level);

    const live = U.rng(ctx.seed + 7), qLive = makeQ(live.next);
    let ph = 0, aSm = P.level;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const lsb = 1 / Math.pow(2, P.bits - 1), aT = ampLsb(), mon = 0.25 / Math.max(0.25, P.level); // 모니터 증폭: 페이드 전 사인 피크를 0.25로
        for (let i = 0; i < n; i++) {
          aSm += (aT - aSm) * 0.001;
          ph += F0 / sr; if (ph >= 1) ph -= 1;
          const y = qLive.run(Math.sin(TAU * ph) * aSm * lsb, P.method, lsb);
          const v = (y / lsb) * mon;
          l[i] = v; r[i] = v;
        }
      },
    });

    let key = '', wave = null, src = null, mags = null, h3 = 0, lowN = 0, totN = 0;
    function analyze() {
      const aL = Math.round(ampLsb() * 20) / 20;
      const k = P.method + '|' + P.bits + '|' + aL;
      if (k === key) return;
      key = k;
      const lsb = 1 / Math.pow(2, P.bits - 1), rng = U.rng(12345), q = makeQ(() => rng.range(0, 1));
      const K = 6, tot = N * K + 512;
      const y = new Float32Array(tot), x = new Float32Array(tot);
      for (let i = 0; i < tot; i++) { x[i] = Math.sin(TAU * F0 * i / SR) * aL * lsb; y[i] = q.run(x[i], P.method, lsb); }
      for (let i = 0; i < tot; i++) { x[i] /= lsb; y[i] /= lsb; } // LSB 단위
      // 평균 파워 스펙트럼 (LSB 기준 dB)
      const acc = new Float64Array(N / 2);
      for (let f = 0; f < K; f++) { const m = A.spectrum(y, N, { offset: 512 + f * N, window: 'blackman' }); for (let b = 0; b < N / 2; b++) acc[b] += Math.pow(10, m[b] / 10); }
      mags = new Float32Array(N / 2);
      for (let b = 0; b < N / 2; b++) mags[b] = 10 * Math.log10(acc[b] / K + 1e-30);
      const bin = (f) => Math.round(f * N / SR);
      h3 = Math.max(mags[bin(3 * F0) - 1], mags[bin(3 * F0)], mags[bin(3 * F0) + 1]);
      // 오차 파워: 신호 제외. 0~4 kHz와 전체 (LSB² 기준 dB)
      let lo = 0, all = 0;
      const e = new Float32Array(N * K);
      for (let i = 0; i < N * K; i++) e[i] = y[512 + i] - x[512 + i];
      for (let i = 0; i < e.length; i++) all += e[i] * e[i];
      totN = 10 * Math.log10(all / e.length + 1e-30);
      const lp = A.biquad('lowpass', 4000, 0.707, 0, SR), lp2 = A.biquad('lowpass', 4000, 0.707, 0, SR);
      for (let i = 0; i < e.length; i++) { const v = lp2.process(lp.process(e[i])); if (i > 512) lo += v * v; }
      lowN = 10 * Math.log10(lo / (e.length - 512) + 1e-30);
      wave = y; src = x;
    }

    return {
      update(dt) { snd.update(); fadeT = (fadeT + dt) % 8; },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const th = Math.max(50, H * 0.36);
        const cnt = Math.round(SR / F0 * 2), amp = 1 / (Math.max(1, P.level) + 2);
        A.drawWave(g, src, pad, pad, w, th, { from: 512, count: cnt, amp, color: 'rgba(216,221,230,0.4)', lineWidth: 1 });
        A.drawWave(g, wave, pad, pad, w, th, { from: 512, count: cnt, amp, color: col, background: false, axis: false, lineWidth: 1.4 });
        D.text(g, Lx('파형 2주기 (흐린 선 = 원래 신호, 세로 단위 LSB)', 'Waveform, 2 cycles (faint = original, vertical unit = LSB)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        const sy = pad * 2 + th, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, w, sh, { color: col, minDb: -80, maxDb: 10, dbStep: 20, label: Lx('평균 스펙트럼 (0dB = 1 LSB 사인)', 'Averaged spectrum (0 dB = 1 LSB sine)') });
        if (P.method === 'shaped') {
          // 잡음 전달 함수 |1 - z^-1|^2 모양 (점선)
          g.setLineDash([4, 3]);
          A.drawResponse(g, (f) => 20 * Math.log10(Math.max(1e-6, 4 * Math.pow(Math.sin(Math.PI * f / SR), 2))) - 50, pad, sy, w, sh, { minDb: -80, maxDb: 10, color: C.accent, background: false, grid: false, lineWidth: 1 });
          g.setLineDash([]);
        }
        ctx.stat(Lx('3차 배음 자리 (1125 Hz)', 'Level at 3rd harmonic (1125 Hz)'), h3.toFixed(1) + ' dB');
        ctx.stat(Lx('저음 잡음 (0~4 kHz)', 'Low noise (0 to 4 kHz)'), lowN.toFixed(1) + ' dB');
        ctx.stat(Lx('전체 오차 파워', 'Total error power'), totN.toFixed(1) + ' dB');
        ctx.stat(Lx('신호 진폭', 'Signal amplitude'), ampLsb().toFixed(2) + ' LSB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
