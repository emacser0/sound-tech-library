// FFT 창 함수와 스펙트럼 누설: 사각 창 vs Hann, Blackman 창. 큰 음 옆의 작은 음이 보이는지 비교
GTL.register({
  id: 'fft-window-leakage',
  title: 'FFT 창 함수와 스펙트럼 누설',
  summary: '신호를 잘라 FFT하면 잘린 경계 때문에 에너지가 주변 bin으로 새어 나감(누설). 사각 창은 누설이 커서 큰 음 옆의 작은 음을 덮고, Blackman 같은 창은 누설을 줄여 작은 음을 드러냄.',
  views: { a: '사각 창 (자르기만 함)', b: 'Blackman 창' },
  controls: '파라미터 표에서 창 함수, 작은 음의 크기와 거리를 바꿈. "소리 켜기"를 누르면 두 음이 섞인 신호가 들림.',
  info: `
    <p>FFT는 N개 샘플이 끝없이 반복된다고 가정함. 신호의 주기가 N에 딱 맞지 않으면 이어 붙인 경계에서 파형이 끊기고, 이 끊김이 넓은 주파수에 퍼진 성분으로 나타남. 이것이 <b>스펙트럼 누설(Spectral Leakage)</b>.</p>
    <p><b>창 함수(Window)</b>는 프레임 양 끝을 0으로 부드럽게 줄여 끊김을 없앰. 대가로 주엽(Main Lobe)이 넓어져 가까운 두 음을 구분하는 능력은 떨어짐.</p>
    <ul>
      <li><b>사각 창</b>: 주엽 폭 2 bin, 가장 큰 부엽 -13dB. 부엽이 천천히 줄어 멀리까지 누설.</li>
      <li><b>Hann</b>: 주엽 4 bin, 부엽 -31dB. 음악 분석의 기본값.</li>
      <li><b>Hamming</b>: 주엽 4 bin, 부엽 -43dB. 먼 곳의 부엽은 Hann보다 덜 줄어듦.</li>
      <li><b>Blackman</b>: 주엽 6 bin, 부엽 -58dB</li>
      <li><b>Blackman-Harris (4항)</b>: 주엽 8 bin, 부엽 -92dB. 큰 동적 범위 측정용.</li>
    </ul>
    <p>고르는 기준: 가까운 음을 나눠야 하면 주엽이 좁은 창, 크기 차이가 큰 음을 찾아야 하면 부엽이 낮은 창</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('잘린 프레임을 반복하면', 'Repeating the cut frame')}</text>
    <path d="M10,60 Q30,25 50,60 T90,60 T130,60 T150,45" class="d-a"/>
    <path d="M150,45 L150,75" class="d-bad"/>
    <path d="M150,75 Q165,25 190,60 T230,60 T270,60 T290,45" class="d-a" stroke-dasharray="4 3"/>
    <text x="150" y="92" text-anchor="middle" class="t-small t-a">${L('경계의 끊김', 'jump at the edge')}</text>
    <path d="M10,140 Q80,100 150,140" class="d-b"/>
    <path d="M10,140 Q30,110 50,140 T90,140 T130,140 T150,140" class="d-b" stroke-dasharray="3 2" opacity="0.6"/>
    <text x="80" y="160" text-anchor="middle" class="t-small t-b">${L('창을 곱하면 양 끝이 0', 'window makes both ends 0')}</text>
    <line x1="320" y1="150" x2="530" y2="150" class="d-line"/>
    <text x="320" y="14" class="t-small t-dim">${L('주파수 응답 (dB)', 'Frequency response (dB)')}</text>
    <path d="M330,128 L345,110 L360,124 L375,98 L390,118 L405,30 L420,118 L435,98 L450,124 L465,110 L480,128 L495,116 L510,130" class="d-a"/>
    <path d="M370,148 L385,90 L405,30 L425,90 L440,148" class="d-b"/>
    <text x="500" y="105" text-anchor="middle" class="t-small t-a">${L('높은 부엽', 'high side lobes')}</text>
    <text x="405" y="22" text-anchor="middle" class="t-small">${L('주엽', 'main lobe')}</text>
    <text x="405" y="166" text-anchor="middle" class="t-small t-b">${L('넓은 주엽, 낮은 부엽', 'wider main lobe, low side lobes')}</text>
  </svg>`,
  look: [
    '기본 상태에서 A는 작은 음(초록 눈금)이 큰 음의 누설에 묻힘. B는 작은 음의 봉우리가 따로 보임.',
    '"큰 음 위치"를 0으로 두면 A의 점(bin)에서도 누설이 사라짐. 연속 곡선의 부엽 사이 0점에 bin이 놓이기 때문.',
    '"작은 음 거리"를 3 bin으로 줄이면 B의 넓은 주엽이 작은 음을 덮음. 이때는 Hann이 더 나음.',
    '창 함수를 Blackman-Harris로 바꾸고 작은 음을 -80dB로 낮춰도 봉우리가 보임',
  ],
  refs: [
    { type: 'paper', title: 'F. J. Harris, "On the Use of Windows for Harmonic Analysis with the Discrete Fourier Transform", Proceedings of the IEEE 66(1)', year: 1978, note: '창 함수의 주엽 폭, 부엽 높이 비교의 고전' },
    { type: 'book', title: 'Julius O. Smith III, Spectral Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/sasp/', note: '창 함수와 누설, 주엽과 부엽' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '시간-주파수 처리 장의 창 함수 설명' },
    { type: 'book', title: 'Alan V. Oppenheim, Ronald W. Schafer, Discrete-Time Signal Processing, 3rd ed.', year: 2009, note: 'DFT와 창 함수의 수학적 배경' },
  ],
  params: [
    { key: 'win', label: '창 함수', type: 'select', options: [
      { value: 'rect', label: '사각 (Rectangular)' }, { value: 'hann', label: 'Hann' }, { value: 'hamming', label: 'Hamming' },
      { value: 'blackman', label: 'Blackman' }, { value: 'bh4', label: 'Blackman-Harris (4항)' }], a: 'rect', b: 'blackman', group: '분석' },
    { key: 'n', label: 'FFT 크기 (N)', type: 'select', options: [{ value: 256, label: '256' }, { value: 1024, label: '1024' }, { value: 4096, label: '4096' }], default: 1024, shared: true },
    { key: 'offset', label: '큰 음 위치 (bin 소수부)', type: 'range', min: 0, max: 0.5, step: 0.01, default: 0.4, shared: true, group: '신호', help: '0이면 큰 음의 주기가 프레임에 딱 맞음. 0.5가 최악' },
    { key: 'weakDb', label: '작은 음 크기 (dB)', type: 'range', min: -90, max: -10, step: 1, default: -60, shared: true },
    { key: 'dist', label: '작은 음 거리 (bin)', type: 'range', min: 2, max: 30, step: 0.5, default: 12, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'FFT Windows and Spectral Leakage',
    summary: 'When you cut a signal and take its FFT, the cut edges spread energy into nearby bins (leakage). A rectangular window leaks a lot and hides a quiet tone next to a loud one. Windows like Blackman reduce leakage and reveal the quiet tone.',
    views: { a: 'Rectangular (just cut)', b: 'Blackman window' },
    controls: 'Change the window, the quiet tone level and its distance in the parameter table. Press "Sound on" to hear the two-tone signal.',
    info: `
    <p>The FFT assumes the N samples repeat forever. If the signal period does not fit N exactly, the waveform jumps where the copies meet. This jump shows up as energy spread over many frequencies. This is <b>spectral leakage</b>.</p>
    <p>A <b>window</b> fades both ends of the frame smoothly to 0 and removes the jump. The cost is a wider main lobe, so two close tones are harder to separate.</p>
    <ul>
      <li><b>Rectangular</b>: main lobe 2 bins, highest side lobe -13 dB. Side lobes fall slowly and leak far away.</li>
      <li><b>Hann</b>: main lobe 4 bins, side lobe -31 dB. The default for music analysis.</li>
      <li><b>Hamming</b>: main lobe 4 bins, side lobe -43 dB. Far side lobes fall less than Hann.</li>
      <li><b>Blackman</b>: main lobe 6 bins, side lobe -58 dB.</li>
      <li><b>Blackman-Harris (4 term)</b>: main lobe 8 bins, side lobe -92 dB. For high dynamic range measurement.</li>
    </ul>
    <p>How to choose: to separate close tones, use a narrow main lobe. To find tones with large level differences, use low side lobes.</p>`,
    look: [
      'In the default state, the quiet tone (green tick) is buried in A\'s leakage. In B the quiet tone has its own peak.',
      'Set "Loud tone position" to 0. A\'s leakage also disappears (when the period fits the frame, there is no jump).',
      'Reduce "Quiet tone distance" to 3 bins. B\'s wide main lobe covers the quiet tone. Hann works better here.',
      'Switch to Blackman-Harris and lower the quiet tone to -80 dB. The peak is still visible.',
    ],
    refs: ['The classic comparison of window main lobe widths and side lobe levels.', 'Windows, leakage, main and side lobes.', 'Window functions in the time-frequency processing chapter.', 'Math background of the DFT and windows.'],
    params: {
      win: { label: 'Window', group: 'Analysis', options: { rect: 'Rectangular', bh4: 'Blackman-Harris (4 term)' } },
      n: 'FFT size (N)',
      offset: { label: 'Loud tone position (bin fraction)', group: 'Signal', help: '0 means the period fits the frame exactly. 0.5 is the worst case.' },
      weakDb: 'Quiet tone level (dB)',
      dist: 'Quiet tone distance (bins)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, K0 = 20, PAD = 8;
    const TAU = Math.PI * 2;
    const WIN = {
      rect: () => 1,
      hann: (i, n) => 0.5 - 0.5 * Math.cos(TAU * i / n),
      hamming: (i, n) => 0.54 - 0.46 * Math.cos(TAU * i / n),
      blackman: (i, n) => 0.42 - 0.5 * Math.cos(TAU * i / n) + 0.08 * Math.cos(2 * TAU * i / n),
      bh4: (i, n) => 0.35875 - 0.48829 * Math.cos(TAU * i / n) + 0.14128 * Math.cos(2 * TAU * i / n) - 0.01168 * Math.cos(3 * TAU * i / n),
    };
    const LOBE = { rect: [2, -13], hann: [4, -31], hamming: [4, -43], blackman: [6, -58], bh4: [8, -92] };

    const freqs = () => { const n = +P.n, bin = SR / n, f1 = (K0 + P.offset) * bin; return { n, bin, f1, f2: f1 + P.dist * bin, a2: A.dbToLin(P.weakDb) }; };

    // 창을 곱한 프레임의 dB 스펙트럼. 진폭 1 사인파의 봉우리 = 0dB (코히어런트 이득 보정)
    function spec(withWeak, pad) {
      const { n, f1, f2, a2 } = freqs(), M = n * pad, w = WIN[P.win];
      const re = new Float64Array(M), im = new Float64Array(M);
      let ws = 0;
      for (let i = 0; i < n; i++) {
        const wi = w(i, n); ws += wi;
        re[i] = wi * (Math.sin(TAU * f1 * i / SR) + (withWeak ? a2 * Math.sin(TAU * f2 * i / SR + 1) : 0));
      }
      A.fft(re, im);
      const out = new Float32Array(M / 2);
      for (let k = 0; k < M / 2; k++) out[k] = A.linToDb(2 * Math.hypot(re[k], im[k]) / ws);
      return out;
    }

    let key = '', mix = null, fine = null, mainOnly = null, frame = null, seen = false, leakAt = 0, peakSide = 0;
    function analyze() {
      const k = [P.win, P.n, P.offset, P.weakDb, P.dist].join();
      if (k === key) return;
      key = k;
      const { n, f1, f2, a2 } = freqs(), w = WIN[P.win];
      mix = spec(true, 1); fine = spec(true, PAD); mainOnly = spec(false, PAD);
      frame = new Float32Array(n);
      for (let i = 0; i < n; i++) frame[i] = w(i, n) * (Math.sin(TAU * f1 * i / SR) + a2 * Math.sin(TAU * f2 * i / SR + 1));
      // 작은 음 위치에서 큰 음의 누설 크기와, 작은 음이 누설 위로 드러나는지
      const kw = Math.round((K0 + P.offset + P.dist) * PAD);
      leakAt = mainOnly[kw];
      let jm = kw;
      for (let j = kw - PAD / 2; j <= kw + PAD / 2; j++) if (fine[j] > fine[jm]) jm = j;
      const localMax = fine[jm] >= fine[jm - 1] && fine[jm] >= fine[jm + 1] && jm > kw - PAD / 2 && jm < kw + PAD / 2;
      seen = localMax && fine[jm] - leakAt > 3;
      // 측정된 가장 큰 부엽: 주엽 밖(주엽 반폭 + 1 bin)에서 큰 음만의 최대값
      const half = LOBE[P.win][0] / 2 + 0.6, c = (K0 + P.offset) * PAD;
      peakSide = -300;
      for (let j = 0; j < mainOnly.length; j++) if (Math.abs(j - c) > half * PAD && mainOnly[j] > peakSide) peakSide = mainOnly[j];
    }
    analyze();

    const live = { p1: 0, p2: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const { f1, f2, a2 } = freqs();
        for (let i = 0; i < n; i++) {
          const v = 0.4 * (Math.sin(live.p1) + a2 * Math.sin(live.p2));
          live.p1 += TAU * f1 / sr; live.p2 += TAU * f2 / sr;
          if (live.p1 > TAU) live.p1 -= TAU; if (live.p2 > TAU) live.p2 -= TAU;
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const { n, bin, f1, f2 } = freqs(), w = WIN[P.win];
        // 위: 창을 곱한 프레임과 창 모양
        const th = Math.max(50, H * 0.26), tw = W - pad * 2;
        A.drawWave(g, frame, pad, pad, tw, th, { color: col, amp: 0.9, label: Lg('창을 곱한 프레임 (N 샘플)', 'Windowed frame (N samples)') });
        g.beginPath();
        for (let x = 0; x <= tw; x += 2) { const v = w(Math.round(x / tw * (n - 1)), n); const py = pad + th / 2 - v * 0.9 * th / 2; x ? g.lineTo(pad + x, py) : g.moveTo(pad + x, py); }
        g.strokeStyle = C.warn; g.lineWidth = 1; g.setLineDash([4, 3]); g.stroke(); g.setLineDash([]);
        // 아래: bin 축 스펙트럼
        const sy = pad * 2 + th, sh = H - sy - pad - 14, kLo = K0 - 14, kHi = K0 + 34, minDb = -140, maxDb = 5;
        D.rect(g, pad, sy, tw, sh, 'rgba(0,0,0,0.35)');
        const bx = (k) => pad + (k - kLo) / (kHi - kLo) * tw, dy = (db) => sy + sh - U.clamp((db - minDb) / (maxDb - minDb), 0, 1) * sh;
        for (let db = -120; db <= 0; db += 20) { D.line(g, pad, dy(db), pad + tw, dy(db), C.grid); D.text(g, db + 'dB', pad + 2, dy(db) - 10, { size: 9, color: C.dim }); }
        for (let k = kLo; k <= kHi; k += 4) D.text(g, String(k), bx(k), sy + sh + 2, { size: 9, color: C.dim, align: 'center' });
        // 큰 음만의 누설 (흐린 선)
        g.beginPath();
        for (let j = kLo * PAD; j <= kHi * PAD; j++) { const px = bx(j / PAD), py = dy(mainOnly[j]); j === kLo * PAD ? g.moveTo(px, py) : g.lineTo(px, py); }
        g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1; g.stroke();
        // 섞인 신호의 연속 응답 (제로 패딩) + 실제 bin 점
        g.beginPath();
        for (let j = kLo * PAD; j <= kHi * PAD; j++) { const px = bx(j / PAD), py = dy(fine[j]); j === kLo * PAD ? g.moveTo(px, py) : g.lineTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        for (let k = kLo; k <= kHi; k++) { D.line(g, bx(k), sy + sh, bx(k), dy(mix[k]), 'rgba(255,255,255,0.15)'); D.circle(g, bx(k), dy(mix[k]), 2.2, col); }
        // 실제 음 위치
        const k1 = K0 + P.offset, k2 = k1 + P.dist;
        D.line(g, bx(k1), sy + sh - 8, bx(k1), sy + sh, C.warn, 3);
        D.line(g, bx(k2), sy + sh - 8, bx(k2), sy + sh, C.good, 3);
        D.line(g, bx(k2), dy(P.weakDb), bx(k2) + 10, dy(P.weakDb), C.good, 1);
        D.text(g, Lg('스펙트럼 (가로축 = bin, 점 = FFT 결과, 흐린 선 = 큰 음만의 누설)', 'Spectrum (x = bin, dots = FFT output, faint line = loud tone leakage only)'), pad + 4, sy + 3, { size: 10, color: C.dim });
        D.text(g, Lg('노랑 = 큰 음, 초록 = 작은 음', 'Yellow = loud tone, green = quiet tone'), pad + 4, sy + 16, { size: 10, color: C.dim });
        ctx.stat(Lg('두 음', 'Two tones'), `${f1.toFixed(1)} Hz, ${f2.toFixed(1)} Hz`);
        ctx.stat(Lg('bin 간격', 'Bin spacing'), bin.toFixed(2) + ' Hz');
        ctx.stat(Lg('주엽 폭 (이론)', 'Main lobe width (theory)'), LOBE[P.win][0] + ' bin');
        ctx.stat(Lg('가장 큰 부엽 (측정)', 'Highest side lobe (measured)'), peakSide.toFixed(1) + ' dB');
        ctx.stat(Lg('작은 음 위치의 누설', 'Leakage at quiet tone'), leakAt.toFixed(1) + ' dB');
        ctx.stat(Lg('작은 음 검출', 'Quiet tone found'), seen ? Lg('보임', 'Visible') : Lg('묻힘', 'Buried'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
