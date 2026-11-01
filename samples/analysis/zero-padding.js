// 제로 패딩: FFT 점을 촘촘하게 보간할 뿐, 가까운 두 음을 나누는 해상도는 늘리지 않음
GTL.register({
  id: 'zero-padding',
  title: '제로 패딩은 해상도를 늘리지 않음',
  summary: '프레임 뒤에 0을 붙여 FFT를 키우면 스펙트럼 점이 촘촘해져 곡선이 매끄러워짐. 하지만 가까운 두 음을 나누는 힘은 창 길이로만 정해짐. 제로 패딩은 같은 곡선을 더 촘촘히 찍을 뿐.',
  views: { a: '패딩 없음', b: '8배 제로 패딩' },
  controls: '파라미터 표에서 패딩 배수, 창 길이, 두 음의 간격을 바꿈. "소리 켜기"를 누르면 두 음이 들림.',
  info: `
    <p>길이 N인 프레임의 FFT는 연속 스펙트럼(DTFT)을 N개 점에서 찍은 값. 점 간격은 sr/N.</p>
    <p><b>제로 패딩(Zero Padding)</b>은 프레임 뒤에 0을 붙여 FFT 크기를 M(&gt; N)으로 키우는 방법. 0은 정보를 더하지 않으므로 연속 스펙트럼 곡선은 그대로이고, 그 곡선을 M개 점으로 더 촘촘히 찍게 됨.</p>
    <ul>
      <li><b>쓸모 있는 곳</b>: 봉우리의 정확한 주파수 읽기, 매끄러운 그래프, FFT 크기를 2의 거듭제곱으로 맞추기, 빠른 컨볼루션</li>
      <li><b>못 하는 것</b>: 창 주엽보다 가까운 두 음 나누기. 곡선 자체가 봉우리 하나라서 점을 늘려도 봉우리 하나.</li>
      <li><b>해상도를 늘리는 방법</b>: 실제 신호를 더 길게 담은 창 (N 증가)</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="30" width="120" height="30" class="f-dim"/><text x="70" y="50" text-anchor="middle" class="t-small">${L('신호 N개', 'N signal samples')}</text>
    <rect x="130" y="30" width="240" height="30" class="f-dim" stroke-dasharray="4 3"/><text x="250" y="50" text-anchor="middle" class="t-small t-dim">${L('0 (정보 없음)', 'zeros (no information)')}</text>
    <text x="10" y="20" class="t-small t-dim">${L('FFT 입력 M개', 'FFT input of M samples')}</text>
    <path d="M30,135 Q120,40 210,135" class="d-dim" stroke-dasharray="4 3"/>
    <circle cx="30" cy="135" r="3" class="f-a"/><circle cx="120" cy="88" r="3" class="f-a"/><circle cx="210" cy="135" r="3" class="f-a"/>
    <circle cx="52" cy="112" r="2" class="f-b"/><circle cx="75" cy="96" r="2" class="f-b"/><circle cx="97" cy="89" r="2" class="f-b"/><circle cx="142" cy="89" r="2" class="f-b"/><circle cx="165" cy="96" r="2" class="f-b"/><circle cx="187" cy="112" r="2" class="f-b"/>
    <text x="120" y="80" text-anchor="middle" class="t-small">${L('같은 곡선', 'same curve')}</text>
    <text x="400" y="95" class="t-small t-a">${L('A: 점 3개', 'A: 3 points')}</text>
    <text x="400" y="112" class="t-small t-b">${L('B: 점이 촘촘', 'B: dense points')}</text>
    <text x="400" y="132" class="t-small t-dim">${L('봉우리 수는 같음', 'same number of peaks')}</text>
  </svg>`,
  look: [
    'A는 점 몇 개를 이은 각진 선. B는 매끄러운 곡선. 두 뷰 모두 봉우리는 하나(노랑, 초록 눈금 = 실제 두 음).',
    'B의 패딩을 16배로 올려도 봉우리는 하나로 남음',
    '"창 길이"를 256으로 늘리면 두 뷰 모두 봉우리가 둘로 갈라짐. 해상도는 창 길이로 정해짐.',
    '"두 음 간격"을 0으로 줄이고 큰 음만 보면 B의 봉우리 주파수가 실제 주파수에 더 가까움',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Mathematics of the Discrete Fourier Transform (DFT) (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/mdft/', note: '제로 패딩 정리: 시간 영역 제로 패딩 = 주파수 영역 보간' },
    { type: 'book', title: 'Julius O. Smith III, Spectral Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/sasp/', note: '해상도와 제로 패딩의 차이' },
    { type: 'book', title: 'Richard G. Lyons, Understanding Digital Signal Processing, 3rd ed.', year: 2010, note: 'DFT 해상도와 제로 패딩 설명' },
  ],
  params: [
    { key: 'pad', label: '패딩 배수', type: 'select', options: [1, 2, 4, 8, 16].map((v) => ({ value: v, label: v + 'x' })), a: 1, b: 8, group: '분석' },
    { key: 'n', label: '창 길이 N (샘플)', type: 'int', min: 16, max: 256, step: 16, default: 64, shared: true, help: '샘플레이트 8kHz' },
    { key: 'gap', label: '두 음 간격 (Hz)', type: 'range', min: 0, max: 500, step: 10, default: 160, shared: true, group: '신호' },
    { key: 'trueCurve', label: '연속 스펙트럼 표시', type: 'bool', default: true, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Zero Padding Does Not Add Resolution',
    summary: 'Appending zeros to a frame makes a bigger FFT, so the spectrum points get denser and the curve looks smooth. But the power to separate two close tones depends only on the window length. Zero padding just samples the same curve more densely.',
    views: { a: 'No padding', b: '8x zero padding' },
    controls: 'Change the padding factor, window length and tone spacing in the parameter table. Press "Sound on" to hear the two tones.',
    info: `
    <p>The FFT of a frame of length N samples the continuous spectrum (DTFT) at N points. The point spacing is sr/N.</p>
    <p><b>Zero padding</b> appends zeros after the frame to grow the FFT size to M (&gt; N). Zeros add no information, so the continuous spectrum stays the same. The FFT now samples that curve at M denser points.</p>
    <ul>
      <li><b>Useful for</b>: reading the exact peak frequency, smooth plots, rounding the FFT size up to a power of 2, fast convolution.</li>
      <li><b>Cannot</b>: separate two tones closer than the main lobe. The curve itself has one peak, so more points still show one peak.</li>
      <li><b>To raise resolution</b>: use a window that holds more real signal (larger N).</li>
    </ul>`,
    look: [
      'A is a jagged line through a few points. B is a smooth curve. Both show one peak (yellow and green ticks = the two real tones).',
      'Raise B\'s padding to 16x. There is still one peak.',
      'Increase "Window length" to 256. Both views split into two peaks. Window length sets the resolution.',
      'Set "Tone spacing" to 0 and look at the single tone. B\'s peak frequency is closer to the real frequency.',
    ],
    refs: ['Zero padding theorem: zero padding in time = interpolation in frequency.', 'The difference between resolution and zero padding.', 'DFT resolution and zero padding.'],
    params: {
      pad: { label: 'Padding factor', group: 'Analysis' },
      n: { label: 'Window length N (samples)', help: 'Sample rate 8 kHz.' },
      gap: { label: 'Tone spacing (Hz)', group: 'Signal' },
      trueCurve: 'Show continuous spectrum',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 8000, F1 = 1030, A2 = 0.7, TAU = Math.PI * 2, FLO = 500, FHI = 1700;

    // 창 N개 + 0으로 M개를 채운 FFT의 dB 스펙트럼 (0dB = 진폭 1 사인파)
    function spec(n, m) {
      const re = new Float64Array(m), im = new Float64Array(m);
      let ws = 0;
      for (let i = 0; i < n; i++) {
        const w = 0.5 - 0.5 * Math.cos(TAU * (i + 0.5) / n); ws += w;
        re[i] = w * (Math.sin(TAU * F1 * i / SR) + A2 * Math.sin(TAU * (F1 + P.gap) * i / SR + 0.7));
      }
      A.fft(re, im);
      const out = new Float32Array(m / 2);
      for (let k = 0; k < m / 2; k++) out[k] = A.linToDb(2 * Math.hypot(re[k], im[k]) / ws);
      return out;
    }
    const pow2 = (v) => { let p = 1; while (p < v) p <<= 1; return p; };

    let key = '', pts = null, M = 0, ref = null, RM = 0, peaks = [], peakF = 0;
    function analyze() {
      const k = [P.pad, P.n, P.gap].join();
      if (k === key) return;
      key = k;
      const n = P.n;
      M = n * P.pad; pts = spec(n, M);
      RM = pow2(n * 64); ref = spec(n, RM);
      // 봉우리: 표시 범위 안에서 양옆보다 크고 최대값 -20dB 위
      peaks = [];
      let mx = -999, mxK = 0;
      for (let kk = 1; kk < M / 2 - 1; kk++) { const f = kk * SR / M; if (f < FLO || f > FHI) continue; if (pts[kk] > mx) { mx = pts[kk]; mxK = kk; } }
      for (let kk = 1; kk < M / 2 - 1; kk++) {
        const f = kk * SR / M; if (f < FLO || f > FHI) continue;
        if (pts[kk] > pts[kk - 1] && pts[kk] >= pts[kk + 1] && pts[kk] > mx - 20) peaks.push(f);
      }
      peakF = mxK * SR / M;
    }
    analyze();

    const live = { p1: 0, p2: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) {
          const v = 0.3 * (Math.sin(live.p1) + A2 * Math.sin(live.p2));
          live.p1 = (live.p1 + TAU * F1 / sr) % TAU; live.p2 = (live.p2 + TAU * (F1 + P.gap) / sr) % TAU;
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2, n = P.n;
        // 위: FFT 입력 (신호 N개 + 0)
        const th = Math.max(46, H * 0.22);
        D.rect(g, pad, pad, tw, th, 'rgba(0,0,0,0.35)');
        const mid = pad + th / 2, total = n * 16;
        for (let i = 0; i < M; i++) {
          const x = pad + (i + 0.5) / total * tw;
          let v = 0;
          if (i < n) { const w = 0.5 - 0.5 * Math.cos(TAU * (i + 0.5) / n); v = w * (Math.sin(TAU * F1 * i / SR) + A2 * Math.sin(TAU * (F1 + P.gap) * i / SR + 0.7)) / (1 + A2); }
          D.line(g, x, mid, x, mid - v * th * 0.45, i < n ? col : C.dim, Math.max(1, tw / total * 0.6));
        }
        D.line(g, pad + M / total * tw, pad, pad + M / total * tw, pad + th, C.warn);
        D.text(g, Lg(`FFT 입력: 신호 ${n}개 + 0 ${M - n}개`, `FFT input: ${n} signal samples + ${M - n} zeros`), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 아래: 스펙트럼
        const sy = pad * 2 + th, sh = H - sy - pad - 14, minDb = -60, maxDb = 3;
        D.rect(g, pad, sy, tw, sh, 'rgba(0,0,0,0.35)');
        const fx = (f) => pad + (f - FLO) / (FHI - FLO) * tw, dy = (db) => sy + sh - U.clamp((db - minDb) / (maxDb - minDb), 0, 1) * sh;
        for (let f = 600; f <= 1600; f += 200) { D.line(g, fx(f), sy, fx(f), sy + sh, C.grid); D.text(g, f + '', fx(f), sy + sh + 2, { size: 9, color: C.dim, align: 'center' }); }
        for (let db = -60; db <= 0; db += 20) D.text(g, db + 'dB', pad + 2, dy(db) - 10, { size: 9, color: C.dim });
        if (P.trueCurve) {
          g.beginPath(); let st = false;
          for (let k = 0; k < RM / 2; k++) { const f = k * SR / RM; if (f < FLO || f > FHI) continue; const px = fx(f), py = dy(ref[k]); st ? g.lineTo(px, py) : g.moveTo(px, py); st = true; }
          g.strokeStyle = 'rgba(255,255,255,0.3)'; g.setLineDash([4, 3]); g.lineWidth = 1; g.stroke(); g.setLineDash([]);
        }
        g.beginPath(); let st = false;
        for (let k = 0; k < M / 2; k++) { const f = k * SR / M; if (f < FLO - SR / M || f > FHI + SR / M) continue; const px = fx(U.clamp(f, FLO, FHI)), py = dy(pts[k]); st ? g.lineTo(px, py) : g.moveTo(px, py); st = true; }
        g.strokeStyle = col; g.lineWidth = 1.8; g.stroke();
        for (let k = 0; k < M / 2; k++) { const f = k * SR / M; if (f >= FLO && f <= FHI && M / 2 * (FHI - FLO) / (SR / 2) < 200) D.circle(g, fx(f), dy(pts[k]), 2.5, col); }
        D.line(g, fx(F1), sy + sh - 8, fx(F1), sy + sh, C.warn, 3);
        if (P.gap > 0) D.line(g, fx(F1 + P.gap), sy + sh - 8, fx(F1 + P.gap), sy + sh, C.good, 3);
        for (const f of peaks) D.arrow(g, fx(f), sy + 22, fx(f), sy + 34, '#fff', 1.5, 5);
        D.text(g, Lg('스펙트럼 (Hann 창). 점선 = 연속 스펙트럼, 흰 화살표 = 찾은 봉우리', 'Spectrum (Hann). Dashed = continuous spectrum, white arrows = peaks found'), pad + 4, sy + 3, { size: 10, color: C.dim });
        ctx.stat(Lg('점 간격 (sr/M)', 'Point spacing (sr/M)'), (SR / M).toFixed(1) + ' Hz');
        ctx.stat(Lg('실제 해상도 (Hann 약 2sr/N)', 'Real resolution (Hann about 2sr/N)'), (2 * SR / n).toFixed(0) + ' Hz');
        ctx.stat(Lg('찾은 봉우리 수', 'Peaks found'), `${peaks.length} (${Lg('실제', 'real')} ${P.gap > 0 ? 2 : 1})`);
        ctx.stat(Lg('가장 큰 봉우리', 'Highest peak'), `${peakF.toFixed(1)} Hz (${Lg('오차', 'error')} ${(peakF - F1).toFixed(1)} Hz)`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
