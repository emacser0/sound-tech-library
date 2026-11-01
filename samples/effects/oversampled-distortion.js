// 오버샘플링 디스토션: 원래 샘플레이트에서 바로 찌그러뜨림(1x) vs 4배로 올려 처리한 뒤 걸러서 내림(4x). 에일리어싱 비교
GTL.register({
  id: 'oversampled-distortion',
  title: '오버샘플링 디스토션 (에일리어싱 줄이기)',
  summary: '디스토션이 만든 높은 배음은 나이퀴스트를 넘으면 아래로 접혀 음과 상관없는 잡음이 됨. 샘플레이트를 몇 배로 올려서 찌그러뜨리고, 로우패스로 거른 뒤 내리면 접히는 배음이 크게 줄어듦.',
  views: { a: '오버샘플링 없음 (1x)', b: '4배 오버샘플링' },
  controls: '파라미터 표에서 배율, 음 높이, 드라이브를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p>하드 클립 같은 비선형 처리는 입력에 없던 높은 배음을 만듦. 48kHz에서 3kHz 사인을 찌그러뜨리면 27kHz, 33kHz 같은 배음이 생기고, 이것이 나이퀴스트(24kHz) 아래 21kHz, 15kHz로 접혀 들어옴. 이 <b>에일리어싱</b>은 음 높이와 맞지 않아 거칠고 차가운 소리를 냄.</p>
    <p><b>오버샘플링(Oversampling)</b> 순서:</p>
    <ul>
      <li><b>올리기</b>: 샘플 사이에 0을 L-1개 넣고 로우패스로 걸러 L배 샘플레이트 신호를 만듦</li>
      <li><b>처리</b>: 높은 샘플레이트에서 비선형 함수를 적용. 나이퀴스트가 L배 높아져 배음이 접히기 전에 더 많이 줄어듦.</li>
      <li><b>내리기</b>: 원래 나이퀴스트 위를 로우패스로 지운 뒤 L개마다 하나씩 남김</li>
    </ul>
    <p>여기서는 위상당 32탭 블랙먼 창 sinc 필터를 폴리페이즈(Polyphase) 구조로 씀. 비용: 배율 L이면 샘플당 곱셈이 약 2 × 32 × L번, 지연(레이턴시)이 생김. 실제 플러그인은 2x~16x를 쓰고, 하프밴드 IIR 필터로 비용을 줄이기도 함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="6" y="24" class="t-small t-a">1x</text>
    <rect x="40" y="10" width="90" height="24" class="f-dim"/><text x="85" y="26" text-anchor="middle" class="t-small">f(x)</text>
    <line x1="130" y1="22" x2="170" y2="22" class="d-a" marker-end="url(#arr)"/>
    <text x="176" y="26" class="t-small t-a">${L('넘친 배음이 그대로 접힘', 'Overflowing harmonics fold back')}</text>
    <text x="6" y="84" class="t-small t-b">4x</text>
    <rect x="40" y="70" width="90" height="24" class="f-dim"/><text x="85" y="86" text-anchor="middle" class="t-small">${L('↑4 + 로우패스', '↑4 + lowpass')}</text>
    <line x1="130" y1="82" x2="160" y2="82" class="d-line" marker-end="url(#arr)"/>
    <rect x="162" y="70" width="80" height="24" class="f-dim"/><text x="202" y="86" text-anchor="middle" class="t-small">${L('f(x) @ 4sr', 'f(x) @ 4sr')}</text>
    <line x1="242" y1="82" x2="272" y2="82" class="d-line" marker-end="url(#arr)"/>
    <rect x="274" y="70" width="100" height="24" class="f-dim"/><text x="324" y="86" text-anchor="middle" class="t-small">${L('로우패스 + ↓4', 'lowpass + ↓4')}</text>
    <line x1="374" y1="82" x2="404" y2="82" class="d-b" marker-end="url(#arr)"/>
    <text x="410" y="86" class="t-small t-b">${L('접힘 크게 감소', 'Much less folding')}</text>
    <line x1="40" y1="130" x2="520" y2="130" class="d-dim"/>
    <line x1="160" y1="124" x2="160" y2="136" class="d-line"/><text x="160" y="146" text-anchor="middle" class="t-small">sr/2</text>
    <line x1="520" y1="124" x2="520" y2="136" class="d-line"/><text x="505" y="146" text-anchor="middle" class="t-small">4sr/2</text>
    <text x="300" y="124" text-anchor="middle" class="t-small t-dim">${L('배음이 여기서 먼저 작아진 뒤 지워짐', 'Harmonics shrink here, then get removed')}</text>
  </svg>`,
  look: [
    'A와 B의 스펙트럼을 비교하면 A는 초록 눈금(배음) 사이에 잡음 기둥이 많고 B는 거의 없음',
    '"에일리어싱 잡음" 측정값이 B에서 20dB 이상 낮음. 배율을 8x로 올리면 더 낮아짐.',
    '음 높이를 C5 아래로 내리면 두 뷰의 차이가 줄어듦 (넘치는 배음이 작음)',
    '곡선을 tanh로 바꾸면 A의 에일리어싱도 줄어듦. 부드러운 곡선은 높은 배음이 작음.',
    '"샘플당 곱셈 수"를 보면 배율에 비례해 비용이 늘어남',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '4장 비선형 처리와 오버샘플링' },
    { type: 'book', title: 'Julius O. Smith III, Spectral Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/sasp/', note: '창 함수 FIR 설계, 리샘플링' },
    { type: 'book', title: 'P. P. Vaidyanathan, Multirate Systems and Filter Banks, Prentice Hall', year: 1993, note: '폴리페이즈 보간과 데시메이션' },
    { type: 'paper', title: 'Julian Parker, Vadim Zavalishin, Efflam Le Bivic, "Reducing the Aliasing of Nonlinear Waveshaping Using Continuous-Time Convolution", DAFx-16', year: 2016, note: '오버샘플링 대신 쓰는 ADAA 방식' },
  ],
  params: [
    { key: 'os', label: '오버샘플링 배율', type: 'select', options: [{ value: 1, label: '1x (없음)' }, { value: 2, label: '2x' }, { value: 4, label: '4x' }, { value: 8, label: '8x' }], a: 1, b: 4, group: '디스토션' },
    { key: 'curve', label: '전달 곡선', type: 'select', options: [{ value: 'hard', label: '하드 클립' }, { value: 'tanh', label: 'tanh' }], default: 'hard', shared: true },
    { key: 'drive', label: '드라이브 (dB)', type: 'range', min: 0, max: 30, step: 0.5, default: 18, shared: true },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 48, max: 108, default: 98, shared: true, group: '음원', help: '98 = D7 (2349Hz)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Oversampled Distortion (Reducing Aliasing)',
    summary: 'High harmonics created by distortion fold back below Nyquist and become noise unrelated to the note. Raising the sample rate several times, distorting, then filtering and lowering the rate removes most of the folded harmonics.',
    views: { a: 'No oversampling (1x)', b: '4x oversampling' },
    controls: 'Change the factor, pitch and drive in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>Nonlinear processing such as hard clipping creates high harmonics that were not in the input. Distorting a 3 kHz sine at 48 kHz creates harmonics at 27 kHz and 33 kHz, which fold back below Nyquist (24 kHz) to 21 kHz and 15 kHz. This <b>aliasing</b> does not match the pitch and sounds harsh and cold.</p>
    <p><b>Oversampling</b> steps:</p>
    <ul>
      <li><b>Up</b>: insert L-1 zeros between samples and lowpass filter to get a signal at L times the sample rate.</li>
      <li><b>Process</b>: apply the nonlinear function at the high rate. Nyquist is L times higher, so harmonics get smaller before they fold.</li>
      <li><b>Down</b>: remove everything above the original Nyquist with a lowpass, then keep one sample in every L.</li>
    </ul>
    <p>This sample uses a Blackman-windowed sinc filter with 32 taps per phase in a polyphase structure. Cost: with factor L there are about 2 × 32 × L multiplies per sample, plus latency. Real plugins use 2x to 16x and sometimes half-band IIR filters to save cost.</p>`,
    look: [
      'Compare the spectra. A has many noise peaks between the green ticks (harmonics). B has almost none.',
      'The "Aliasing noise" stat is more than 20 dB lower in B. Setting the factor to 8x lowers it further.',
      'Lower the pitch below C5. The difference shrinks (the overflowing harmonics are small).',
      'Switch the curve to tanh. Aliasing in A also drops. A smooth curve has smaller high harmonics.',
      'Watch "Multiplies per sample". The cost grows with the factor.',
    ],
    refs: ['Ch. 4 nonlinear processing and oversampling.', 'Windowed FIR design and resampling.', 'Polyphase interpolation and decimation.', 'ADAA, an alternative to oversampling.'],
    params: {
      os: { label: 'Oversampling factor', group: 'Distortion', options: { 1: '1x (none)' } },
      curve: { label: 'Transfer curve', options: { hard: 'Hard clip' } },
      drive: 'Drive (dB)',
      note: { label: 'Pitch (MIDI)', group: 'Source', help: '98 = D7 (2349 Hz)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const K = 32, SR = 48000, N = 8192;

    const shape = (v) => (P.curve === 'hard' ? U.clamp(v, -1, 1) : Math.tanh(v));
    // 배율 L용 블랙먼 창 sinc 로우패스 (길이 K*L, 고속 샘플레이트 기준 차단 0.5/L)
    const firCache = {};
    function fir(Lf) {
      if (firCache[Lf]) return firCache[Lf];
      const M = K * Lf, h = new Float64Array(M), fc = 0.5 / Lf, c = (M - 1) / 2;
      let s = 0;
      for (let i = 0; i < M; i++) {
        const x = i - c, sinc = x === 0 ? 2 * fc : Math.sin(TAU * fc * x) / (Math.PI * x);
        h[i] = sinc * A.windows.blackman(i, M); s += h[i];
      }
      for (let i = 0; i < M; i++) h[i] /= s;
      return (firCache[Lf] = h);
    }
    // 오버샘플링 처리기. 시각화와 소리가 같은 함수를 씀
    function makeOS() {
      let Lf = 0, h, xin, xi = 0, hi, hiPos = 0;
      return (x) => {
        const want = +P.os;
        if (want !== Lf) { Lf = want; h = fir(Lf); xin = new Float64Array(K); hi = new Float64Array(K * Lf); xi = 0; hiPos = 0; }
        const gi = A.dbToLin(P.drive);
        if (Lf === 1) return shape(gi * x);
        xin[xi] = x;
        const M = K * Lf;
        for (let p = 0; p < Lf; p++) {
          let acc = 0;
          for (let k = 0; k < K; k++) acc += h[k * Lf + p] * xin[(xi - k + K) % K];
          hi[hiPos] = shape(gi * acc * Lf);
          hiPos = (hiPos + 1) % M;
        }
        xi = (xi + 1) % K;
        let y = 0;
        for (let j = 0; j < M; j++) y += h[j] * hi[(hiPos - 1 - j + 2 * M) % M];
        return y;
      };
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, ph: 0, fx: makeOS() };
        const f = A.mtof(P.note);
        for (let i = 0; i < n; i++) {
          live.ph = (live.ph + f / sr) % 1;
          const v = live.fx(0.5 * Math.sin(TAU * live.ph)) * 0.4;
          l[i] = v; r[i] = v;
        }
      },
    });

    let key = '', buf = null, mags = null, alias = 0, cost = 0;
    function analyze() {
      const k = [P.os, P.curve, P.drive, P.note].join();
      if (k === key) return;
      key = k;
      const fx = makeOS(), f = A.mtof(P.note), warm = 600;
      buf = new Float32Array(N + warm);
      let ph = 0;
      const t0 = ctx.now();
      for (let i = 0; i < buf.length; i++) { ph = (ph + f / SR) % 1; buf[i] = fx(0.5 * Math.sin(TAU * ph)); }
      cost = (ctx.now() - t0) / (buf.length / SR) / 10; // 실시간 1초당 ms → %
      mags = A.spectrum(buf, N, { offset: warm, window: 'blackman' });
      const binHz = SR / N;
      alias = -200;
      for (let b = 2; b < N / 2; b++) {
        const fr = b * binHz, hh = fr / f, near = Math.abs(hh - Math.round(hh)) * f < 4 * binHz;
        if (!near && mags[b] > alias) alias = mags[b];
      }
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2, f = A.mtof(P.note);
        const wh = Math.max(40, H * 0.25);
        const per = SR / f, cnt = Math.max(16, Math.round(per * 4));
        A.drawWave(g, buf, pad, pad, w, wh, { from: 600, count: cnt, color: col, dots: cnt < 90, label: GTL.L('출력 파형 (4주기, 48kHz 샘플)', 'Output waveform (4 cycles, 48 kHz samples)') });
        const sy = pad * 2 + wh, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, w, sh, { color: col, minDb: -120, maxDb: 0, label: GTL.L('스펙트럼', 'Spectrum') });
        for (let h = 1; h * f < SR / 2 && h <= 60; h++) {
          const px = A.freqX(h * f, pad, w, 20, 20000);
          D.line(g, px, sy + sh - 4, px, sy + sh, C.good, 2);
        }
        D.text(g, GTL.L('초록 눈금 = 배음. 그 사이의 기둥 = 접혀 들어온 에일리어싱', 'Green ticks = harmonics. Peaks between them = folded aliasing'), pad + 4, sy + 16, { size: 10, color: C.dim });
        const Lf = +P.os;
        ctx.stat(GTL.L('에일리어싱 잡음 (최대)', 'Aliasing noise (max)'), alias.toFixed(1) + ' dB');
        ctx.stat(GTL.L('샘플당 곱셈 수', 'Multiplies per sample'), Lf === 1 ? 0 : 2 * K * Lf);
        ctx.stat(GTL.L('필터 지연', 'Filter latency'), Lf === 1 ? '0' : ((K * Lf - 1) / Lf).toFixed(1) + GTL.L(' 샘플', ' samples'));
        ctx.stat(GTL.L('CPU (실시간 대비, 이 PC)', 'CPU (vs real time, this PC)'), cost.toFixed(2) + ' %');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
