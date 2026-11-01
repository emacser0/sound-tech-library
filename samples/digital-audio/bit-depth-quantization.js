// 비트 깊이와 양자화 잡음: 비트 수가 적을수록 계단이 커지고 잡음과 왜곡이 늘어남
GTL.register({
  id: 'bit-depth-quantization',
  title: '비트 깊이와 양자화 잡음',
  summary: '같은 사인파를 4비트와 16비트로 양자화. 비트가 하나 줄 때마다 신호 대 잡음비(SNR)가 약 6dB 나빠지고, 작은 신호일수록 잡음이 더 크게 들림.',
  views: { a: '4비트', b: '16비트' },
  controls: '파라미터 표에서 비트 수와 신호 레벨을 바꿈',
  info: `
    <p><b>양자화(Quantization)</b>는 샘플 값을 정해진 단계 중 가장 가까운 값으로 반올림하는 일. N비트는 2^N개의 단계를 씀. 한 단계의 크기가 <b>LSB</b>(최하위 비트).</p>
    <p>반올림 오차는 최대 LSB의 절반. 신호가 크고 복잡하면 이 오차는 고르게 퍼진 잡음처럼 행동함. 그래서 최대 크기 사인파의 SNR은 약 <code>6.02 N + 1.76 dB</code>.</p>
    <ul>
      <li>16비트(CD): 약 98dB. 24비트: 약 146dB (실제 장비의 아날로그 잡음이 먼저 한계가 됨).</li>
      <li>신호 레벨이 낮으면 쓰는 단계가 줄어 SNR도 같은 만큼 떨어짐. 조용한 꼬리, 페이드 아웃에서 잡음이 드러남.</li>
      <li>단계가 아주 적으면 오차가 신호와 같이 움직여 잡음이 아니라 배음 왜곡으로 들림. 해결책은 디더(Dither).</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('3비트 = 8단계', '3 bits = 8 steps')}</text>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="30" y1="${30 + i * 14}" x2="290" y2="${30 + i * 14}" class="d-dim" stroke-dasharray="2 3"/>`).join('')}
    <path d="M30,79 C60,25 100,25 130,79 S200,133 230,79 S270,40 290,40" class="d-dim"/>
    <path d="M30,86 H45 V58 H60 V44 H80 V30 H105 V44 H120 V72 H135 V86 H150 V114 H165 V128 H195 V114 H215 V86 H235 V58 H255 V44 H290" class="d-a"/>
    <text x="160" y="150" text-anchor="middle" class="t-small">${L('가장 가까운 단계로 반올림', 'Round to the nearest step')}</text>
    <line x1="330" y1="110" x2="520" y2="110" class="d-line"/>
    <rect x="345" y="52" width="40" height="58" class="f-a"/>
    <rect x="405" y="70" width="40" height="40" class="f-b"/>
    <rect x="465" y="88" width="40" height="22" class="f-dim"/>
    <text x="365" y="46" text-anchor="middle" class="t-small">98 dB</text>
    <text x="425" y="64" text-anchor="middle" class="t-small">50 dB</text>
    <text x="485" y="82" text-anchor="middle" class="t-small">26 dB</text>
    <text x="365" y="126" text-anchor="middle" class="t-small t-dim">16 bit</text>
    <text x="425" y="126" text-anchor="middle" class="t-small t-dim">8 bit</text>
    <text x="485" y="126" text-anchor="middle" class="t-small t-dim">4 bit</text>
    <text x="425" y="150" text-anchor="middle" class="t-small">${L('최대 사인파 SNR = 6.02N + 1.76', 'Full-scale sine SNR = 6.02N + 1.76')}</text>
  </svg>`,
  look: [
    'A의 파형이 굵은 계단이고 스펙트럼에 배음 기둥이 늘어섬. B는 매끄럽고 배음 기둥 없이 낮은 잡음 바닥만 보임.',
    '신호 레벨을 -40dB로 내리면 A의 사인파가 거의 사각파가 되고 소리가 거칠어짐',
    '"자동 페이드"를 켜고 A를 들으면 음이 작아질수록 지글거리는 잡음이 커지다가 마지막에 끊김',
    '비트 수를 하나씩 올리면 "측정 SNR"이 약 6dB씩 좋아짐',
  ],
  refs: [
    { type: 'paper', title: 'W. R. Bennett, "Spectra of Quantized Signals", Bell System Technical Journal', year: 1948, note: '양자화 잡음의 고전 분석' },
    { type: 'book', title: 'Ken C. Pohlmann, Principles of Digital Audio', note: '양자화, 비트 깊이, SNR' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '양자화와 디더' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science', note: '워드 길이와 실무 레벨' },
  ],
  params: [
    { key: 'bits', label: '비트 수', type: 'int', min: 2, max: 24, a: 4, b: 16, default: 16, group: '양자화' },
    { key: 'level', label: '신호 레벨 (dBFS)', type: 'range', min: -60, max: 0, step: 1, default: -6, shared: true, group: '입력 사인파' },
    { key: 'fade', label: '자동 페이드', type: 'bool', default: false, shared: true, help: '8초 주기로 레벨이 60dB 내려갔다 돌아옴' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Bit Depth and Quantization Noise',
    summary: 'The same sine wave is quantized to 4 bits and 16 bits. Each bit you remove makes the signal-to-noise ratio (SNR) about 6 dB worse, and quiet signals suffer the most.',
    views: { a: '4 bit', b: '16 bit' },
    controls: 'Change the bit depth and signal level in the parameter table.',
    info: `
    <p><b>Quantization</b> rounds each sample to the nearest of a fixed set of steps. N bits give 2^N steps. One step is the <b>LSB</b> (least significant bit).</p>
    <p>The rounding error is at most half an LSB. With a large, busy signal this error acts like evenly spread noise. So a full-scale sine has an SNR of about <code>6.02 N + 1.76 dB</code>.</p>
    <ul>
      <li>16 bit (CD): about 98 dB. 24 bit: about 146 dB (the analog noise of real gear sets the limit first).</li>
      <li>A quieter signal uses fewer steps, so the SNR drops by the same amount. Noise shows up in quiet tails and fade-outs.</li>
      <li>With very few steps the error moves with the signal, so you hear harmonic distortion instead of noise. The fix is dither.</li>
    </ul>`,
    look: [
      'A\'s waveform is a coarse staircase and its spectrum has a row of harmonic peaks. B is smooth and shows only a low noise floor without peaks.',
      'Lower the signal level to -40 dB. A\'s sine turns almost into a square wave and sounds rough.',
      'Turn on "Auto fade" and listen to A. As the tone gets quieter the fizzy noise grows, then the tone cuts out.',
      'Raise the bit depth one step at a time. "Measured SNR" improves by about 6 dB each time.',
    ],
    refs: ['Classic analysis of quantization noise.', 'Quantization, bit depth and SNR.', 'Quantization and dither.', 'Word length and practical levels.'],
    params: {
      bits: { label: 'Bit depth', group: 'Quantization' },
      level: { label: 'Signal level (dBFS)', group: 'Input sine' },
      fade: { label: 'Auto fade', help: 'Level drops 60 dB and comes back every 8 seconds' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 8192, F0 = 375; // 375 Hz = FFT bin 정수 배 (N/SR*F0 = 64)
    const TAU = Math.PI * 2;
    let fadeT = 0;

    function quant(x, bits) {
      const q = Math.pow(2, bits - 1);
      return U.clamp(Math.round(x * q), -q, q - 1) / q;
    }
    const effLevel = () => (P.fade ? P.level - 60 * (1 - Math.abs(1 - 2 * (fadeT / 8))) : P.level);

    let ph = 0, gSm = A.dbToLin(P.level);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const gT = A.dbToLin(effLevel()), bits = P.bits;
        for (let i = 0; i < n; i++) {
          gSm += (gT - gSm) * 0.001;
          ph += F0 / sr; if (ph >= 1) ph -= 1;
          const v = quant(Math.sin(TAU * ph) * gSm, bits) * 0.5;
          l[i] = v; r[i] = v;
        }
      },
    });

    let key = '', x = null, y = null, mags = null, snr = 0, lv = 0;
    function analyze() {
      lv = Math.round(effLevel() * 2) / 2;
      const k = P.bits + '|' + lv;
      if (k === key) return;
      key = k;
      const g0 = A.dbToLin(lv);
      x = new Float32Array(N); y = new Float32Array(N);
      let ps = 0, pe = 0;
      for (let i = 0; i < N; i++) {
        x[i] = Math.sin(TAU * F0 * i / SR + 0.3) * g0; y[i] = quant(x[i], P.bits);
        ps += x[i] * x[i]; const e = y[i] - x[i]; pe += e * e;
      }
      snr = 10 * Math.log10(ps / Math.max(1e-30, pe));
      mags = A.spectrum(y, N, { window: 'blackman' });
    }

    return {
      update(dt) { snd.update(); fadeT = (fadeT + dt) % 8; },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const bits = P.bits, lsb = 1 / Math.pow(2, bits - 1);
        const g0 = A.dbToLin(lv);
        const th = Math.max(50, H * 0.32), eh = Math.max(30, H * 0.14);
        // 파형 (2주기). 진폭을 화면에 맞게 키움
        const per = SR / F0, cnt = Math.round(per * 2), amp = 0.9 / g0;
        D.rect(g, pad, pad, w, th, 'rgba(0,0,0,0.35)');
        if (bits <= 6) { // 양자화 단계 선
          const q = Math.pow(2, bits - 1);
          for (let s = -q; s < q; s++) { const yy = pad + th / 2 - (s / q) * amp * th / 2; if (yy > pad && yy < pad + th) D.line(g, pad, yy, pad + w, yy, C.grid, 1); }
        }
        A.drawWave(g, x, pad, pad, w, th, { count: cnt, amp, color: 'rgba(216,221,230,0.35)', background: false, lineWidth: 1 });
        g.beginPath();
        for (let i = 0; i < cnt; i++) {
          const px0 = pad + (i / (cnt - 1)) * w, px1 = pad + ((i + 1) / (cnt - 1)) * w;
          const py = pad + th / 2 - U.clamp(y[i] * amp, -1.05, 1.05) * th / 2;
          i ? g.lineTo(px0, py) : g.moveTo(px0, py); g.lineTo(Math.min(px1, pad + w), py);
        }
        g.strokeStyle = col; g.lineWidth = 1.8; g.stroke();
        D.text(g, Lx(`파형 2주기 (${lv.toFixed(1)} dBFS, 세로 확대)`, `Waveform, 2 cycles (${lv.toFixed(1)} dBFS, zoomed)`), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 오차 (LSB 단위)
        const ey = pad * 2 + th, err = new Float32Array(cnt);
        for (let i = 0; i < cnt; i++) err[i] = (y[i] - x[i]) / lsb;
        A.drawWave(g, err, pad, ey, w, eh, { count: cnt, amp: 1.6, color: C.warn, lineWidth: 1, label: Lx('양자화 오차 (±0.5 LSB)', 'Quantization error (±0.5 LSB)') });
        // 스펙트럼
        const sy = ey + eh + pad, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, w, sh, { color: col, minDb: -160, maxDb: 0, dbStep: 24, label: Lx('스펙트럼', 'Spectrum') });

        ctx.stat(Lx('이론 SNR (최대 사인파)', 'Theory SNR (full-scale sine)'), (6.02 * bits + 1.76).toFixed(1) + ' dB');
        ctx.stat(Lx('측정 SNR', 'Measured SNR'), snr.toFixed(1) + ' dB');
        ctx.stat(Lx('단계 수', 'Steps'), String(Math.pow(2, bits)));
        ctx.stat(Lx('LSB 크기', 'LSB size'), A.linToDb(lsb).toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
