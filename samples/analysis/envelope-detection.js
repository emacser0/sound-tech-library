// 엔벨로프 검출: 정류 + 로우패스(리플과 지연의 타협) vs 힐버트 변환 해석 신호의 크기
GTL.register({
  id: 'envelope-detection',
  title: '엔벨로프 검출 (정류 + 로우패스 vs 힐버트)',
  summary: '소리의 크기 윤곽(엔벨로프)을 구하는 가장 흔한 방법은 절대값을 취하고 로우패스로 매끄럽게 하는 것. 컷오프가 높으면 파형의 떨림(리플)이 남고, 낮으면 어택이 늦게 따라감. 힐버트 변환으로 만든 해석 신호의 크기는 리플도 지연도 거의 없음.',
  views: { a: '정류 + 로우패스', b: '힐버트 (해석 신호)' },
  controls: '파라미터 표에서 방식과 컷오프를 바꿈. "소리 켜기"를 누르면 검출한 엔벨로프로 잡음의 크기를 움직인 소리가 들림 (엔벨로프 팔로워).',
  info: `
    <p><b>엔벨로프(Envelope)</b>는 빠르게 진동하는 파형을 감싸는 느린 크기 곡선. 컴프레서, 노이즈 게이트, 사이드체인, 오토 와우, 보코더, 레벨 미터, 온셋 검출이 모두 엔벨로프로 움직임.</p>
    <ul>
      <li><b>정류 + 로우패스</b>: |x|를 원폴 로우패스로 거름. 가장 싸고 실시간. |sin|은 2f로 떨려서, 컷오프가 높으면 이 떨림이 남고(리플), 낮으면 어택에 늦게 반응(지연). 저음일수록 타협이 어려움.</li>
      <li><b>피크 팔로워</b>: 커질 때는 바로 따라가고 작아질 때만 천천히 내려감(어택, 릴리스). 컴프레서의 기본 방식. 릴리스 동안 톱니 모양 리플이 남음.</li>
      <li><b>힐버트 변환</b>: 신호를 90도 밀린 짝과 묶은 해석 신호 x + jH{x}의 크기 √(x² + H{x}²). 사인파라면 sin² + cos² = 1이라 떨림 없이 바로 크기가 나옴.</li>
    </ul>
    <p>단점: 이상적인 힐버트 변환은 미래 샘플이 필요함. 이 샘플은 FFT로 전체 신호를 한 번에 처리함. 실시간에서는 올패스 필터 쌍(위상차 90도 근사)이나 FIR 힐버트 필터를 쓰고 그만큼 지연이 생김.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('|sin|은 2f로 떨림', '|sin| ripples at 2f')}</text>
    <line x1="10" y1="120" x2="250" y2="120" class="d-dim"/>
    <path d="M10,120 Q25,40 40,120 Q55,40 70,120 Q85,40 100,120 Q115,40 130,120 Q145,40 160,120 Q175,40 190,120 Q205,40 220,120 Q235,40 250,120" class="d-line"/>
    <path d="M10,120 C30,90 50,78 70,74 S120,70 250,72" class="d-a"/>
    <text x="130" y="140" text-anchor="middle" class="t-small t-a">${L('로우패스: 늦게 올라오고 리플이 남음', 'lowpass: slow rise and leftover ripple')}</text>
    <line x1="290" y1="120" x2="530" y2="120" class="d-dim"/>
    <path d="M290,120 Q305,40 320,120 T350,120 T380,120 T410,120 T440,120 T470,120 T500,120 T530,120" class="d-line" opacity="0.5"/>
    <path d="M290,120 Q305,200 320,120 T350,120 T380,120 T410,120 T440,120 T470,120 T500,120 T530,120" class="d-dim" stroke-dasharray="3 2"/>
    <line x1="290" y1="40" x2="530" y2="40" class="d-b"/>
    <text x="410" y="30" text-anchor="middle" class="t-small t-b">√(x² + H{x}²)</text>
    <text x="410" y="140" text-anchor="middle" class="t-small t-b">${L('사인 + 90도 밀린 짝 = 일정한 크기', 'sine + 90° partner = constant size')}</text>
    <text x="410" y="155" text-anchor="middle" class="t-small t-dim">${L('점선 = 힐버트 짝 (코사인)', 'dashed = Hilbert partner (cosine)')}</text>
  </svg>`,
  look: [
    'A의 색 선은 흰 점선(실제 엔벨로프)보다 늦게 올라가고 위에 잔물결이 남음. B는 거의 겹침.',
    'A의 컷오프를 80Hz로 올리면 지연은 1ms로 줄지만 리플이 3배로 커짐. 5Hz로 내리면 리플은 줄지만 지연이 19ms로 늘고 음과 음 사이가 뭉개짐.',
    '"소리 켜기" 후 A를 들으면 잡음에 220Hz 웅웅거림(리플)이 섞이고 어택이 뭉툭함. B는 깨끗하게 끊어짐.',
    '방식을 피크 팔로워로 바꾸면 어택은 빠르지만 릴리스 동안 톱니 리플이 남음',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '레벨 측정, 엔벨로프 팔로워, 힐버트 필터' },
    { type: 'book', title: 'Julius O. Smith III, Mathematics of the Discrete Fourier Transform (DFT) (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/mdft/', note: '해석 신호와 힐버트 변환' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '컴프레서의 엔벨로프 검출기 (피크, RMS, 어택, 릴리스)' },
    { type: 'paper', title: 'D. Giannoulis, M. Massberg, J. D. Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '피크 검출기 설계와 리플, 지연 비교' },
  ],
  params: [
    { key: 'method', label: '검출 방식', type: 'select', options: [{ value: 'rect', label: '정류 + 로우패스' }, { value: 'peak', label: '피크 팔로워' }, { value: 'hilbert', label: '힐버트 (해석 신호)' }], a: 'rect', b: 'hilbert', group: '검출' },
    { key: 'fc', label: '로우패스 컷오프 (Hz)', type: 'range', min: 2, max: 200, step: 1, default: 20, when: (p) => p.method === 'rect' },
    { key: 'rel', label: '릴리스 (ms)', type: 'range', min: 5, max: 300, step: 1, default: 60, when: (p) => p.method === 'peak' },
    { key: 'carrier', label: '음 높이 (Hz)', type: 'range', min: 40, max: 880, step: 1, default: 110, shared: true, group: '신호', help: '낮을수록 리플과 지연의 타협이 어려움' },
    { key: 'monitor', label: '들을 소리', type: 'select', options: [{ value: 'follow', label: '엔벨로프로 움직인 잡음' }, { value: 'orig', label: '원래 신호' }], default: 'follow', shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Envelope Detection (Rectify + Lowpass vs Hilbert)',
    summary: 'The most common way to get the level outline (envelope) of a sound is to take the absolute value and smooth it with a lowpass. A high cutoff leaves waveform ripple, and a low cutoff makes the attack lag behind. The magnitude of the analytic signal from the Hilbert transform has almost no ripple and no lag.',
    views: { a: 'Rectify + lowpass', b: 'Hilbert (analytic signal)' },
    controls: 'Change the method and cutoff in the parameter table. Press "Sound on" to hear noise whose level follows the detected envelope (an envelope follower).',
    info: `
    <p>An <b>envelope</b> is the slow level curve that wraps a fast oscillating waveform. Compressors, noise gates, sidechains, auto-wah, vocoders, level meters and onset detection all run on envelopes.</p>
    <ul>
      <li><b>Rectify + lowpass</b>: filter |x| with a one-pole lowpass. The cheapest, and real-time. |sin| ripples at 2f, so a high cutoff leaves this ripple and a low cutoff reacts late to attacks (lag). Low notes make the trade-off harder.</li>
      <li><b>Peak follower</b>: follows instantly when the level rises and falls slowly only when it drops (attack, release). The basic compressor detector. A sawtooth ripple remains during release.</li>
      <li><b>Hilbert transform</b>: the magnitude √(x² + H{x}²) of the analytic signal x + jH{x}, which pairs the signal with a copy shifted by 90 degrees. For a sine, sin² + cos² = 1, so the level comes out right away with no ripple.</li>
    </ul>
    <p>Weak spot: an ideal Hilbert transform needs future samples. This sample processes the whole signal at once with an FFT. In real time you use an allpass filter pair (approximate 90 degree difference) or an FIR Hilbert filter, which adds latency.</p>`,
    look: [
      'A\'s colored line rises later than the white dashed line (real envelope) and has small ripples on top. B almost overlaps it.',
      'Raise the cutoff of A to 80 Hz. The lag drops to 1 ms, but the ripple grows 3 times. Lower it to 5 Hz. The ripple shrinks, but the lag grows to 19 ms and the notes blur together.',
      'Press "Sound on" and listen to A. The noise gets a 220 Hz buzz (ripple) and blunt attacks. B cuts cleanly.',
      'Switch to the peak follower. Attacks are fast, but a sawtooth ripple remains during release.',
    ],
    refs: ['Level measurement, envelope followers, Hilbert filters.', 'The analytic signal and the Hilbert transform.', 'Compressor envelope detectors (peak, RMS, attack, release).', 'Peak detector design, comparing ripple and lag.'],
    params: {
      method: { label: 'Method', group: 'Detection', options: { rect: 'Rectify + lowpass', peak: 'Peak follower', hilbert: 'Hilbert (analytic signal)' } },
      fc: 'Lowpass cutoff (Hz)',
      rel: 'Release (ms)',
      carrier: { label: 'Pitch (Hz)', group: 'Signal', help: 'The lower it is, the harder the ripple and lag trade-off.' },
      monitor: { label: 'What to hear', group: 'Sound', options: { follow: 'Noise driven by the envelope', orig: 'Original signal' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 22050, LEN = 32768, DUR = LEN / SR, TAU = Math.PI * 2;
    // 실제 엔벨로프: 짧은 어택 + 지수 감쇠 음 6개
    const HITS = [[0.05, 1.0], [0.3, 0.6], [0.55, 0.9], [0.7, 0.4], [1.0, 1.0], [1.2, 0.7]];
    const truth = new Float32Array(LEN);
    for (let i = 0; i < LEN; i++) {
      const t = i / SR; let v = 0;
      for (const [t0, a] of HITS) if (t >= t0) { const tt = t - t0; v = Math.max(v, a * Math.min(1, tt / 0.003) * Math.exp(-tt / 0.12)); }
      truth[i] = v;
    }
    const noise = A.noiseBuffer(LEN, 31);

    let sKey = '', sig = null, key = '', est = null, lag = 0, ripple = 0, err = 0;
    function analyze() {
      if (sKey !== String(P.carrier)) {
        sKey = String(P.carrier);
        sig = new Float32Array(LEN);
        for (let i = 0; i < LEN; i++) sig[i] = truth[i] * Math.sin(TAU * P.carrier * i / SR);
        key = '';
      }
      const k = P.method + P.fc + P.rel;
      if (k === key) return;
      key = k;
      est = new Float32Array(LEN);
      if (P.method === 'rect') {
        const a = A.onePoleCoef(P.fc, SR);
        let y = 0;
        for (let i = 0; i < LEN; i++) { y += a * (Math.abs(sig[i]) * Math.PI / 2 - y); est[i] = y; }
      } else if (P.method === 'peak') {
        const at = 1 - Math.exp(-1 / (0.0005 * SR)), rl = Math.exp(-1 / (P.rel / 1000 * SR));
        let y = 0;
        for (let i = 0; i < LEN; i++) { const x = Math.abs(sig[i]); y = x > y ? y + at * (x - y) : y * rl; est[i] = y; }
      } else {
        // 해석 신호: FFT → 음의 주파수 0, 양의 주파수 2배 → 역 FFT → 크기
        const re = Float64Array.from(sig), im = new Float64Array(LEN);
        A.fft(re, im);
        for (let b = 1; b < LEN / 2; b++) { re[b] *= 2; im[b] *= 2; }
        for (let b = LEN / 2 + 1; b < LEN; b++) { re[b] = 0; im[b] = 0; }
        A.fft(re, im, true);
        for (let i = 0; i < LEN; i++) est[i] = Math.hypot(re[i], im[i]);
      }
      // 지연: 교차상관이 가장 큰 지연 (0~60ms)
      let best = -Infinity; lag = 0;
      for (let d = 0; d <= Math.round(0.06 * SR); d += 4) { let s = 0; for (let i = 0; i + d < LEN; i += 2) s += truth[i] * est[i + d]; if (s > best) { best = s; lag = d; } }
      // 리플: 오차(검출 - 실제)에서 5ms 이동 평균을 뺀 빠른 성분의 RMS. 오차: 실제 엔벨로프와의 RMS 차이 (최대값 대비 %)
      const W = Math.round(0.005 * SR);
      let acc = 0, r2 = 0, e2 = 0;
      for (let i = 0; i < LEN; i++) {
        acc += est[i] - truth[i]; if (i >= W) acc -= est[i - W] - truth[i - W];
        if (i >= W) { const j = i - (W >> 1), d = est[j] - truth[j] - acc / W; r2 += d * d; }
        const e = est[i] - truth[i]; e2 += e * e;
      }
      ripple = Math.sqrt(r2 / LEN) * 100; err = Math.sqrt(e2 / LEN) * 100;
    }
    analyze();

    const live = { pos: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr;
        for (let i = 0; i < n; i++) {
          const i0 = Math.floor(live.pos);
          const v = P.monitor === 'orig' ? sig[i0] * 0.5 : est[i0] * noise[i0] * 0.4;
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= LEN) live.pos -= LEN;
        }
      },
    });

    function drawEnv(g, x, y, w, h, i0, i1, wave) {
      D.rect(g, x, y, w, h, 'rgba(0,0,0,0.35)');
      const mid = wave ? y + h / 2 : y + h - 4, sc = wave ? h / 2 * 0.9 : (h - 18);
      const px = (i) => x + (i - i0) / (i1 - i0) * w;
      if (wave) A.drawWave(g, sig, x, y, w, h, { from: i0, count: i1 - i0, color: 'rgba(216,221,230,0.35)', amp: 0.9, background: false, lineWidth: 1 });
      const line = (arr, color, lw, dash) => {
        g.beginPath();
        const stp = Math.max(1, Math.floor((i1 - i0) / (w * 2)));
        for (let i = i0; i < i1; i += stp) { const yy = mid - U.clamp(arr[i], 0, 1.2) * sc; i === i0 ? g.moveTo(px(i), yy) : g.lineTo(px(i), yy); }
        g.strokeStyle = color; g.lineWidth = lw; if (dash) g.setLineDash(dash); g.stroke(); g.setLineDash([]);
      };
      line(truth, '#fff', 1.2, [4, 3]);
      line(est, col, 1.8);
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        const h1 = Math.max(80, H * 0.52);
        const z0 = Math.round(0.25 * SR), z1 = Math.round(0.65 * SR);
        drawEnv(g, pad, pad, tw, h1, z0, z1, true);
        D.text(g, Lg('확대 (0.25~0.65초): 파형, 실제 엔벨로프 (흰 점선), 검출 (색)', 'Zoom (0.25 to 0.65 s): waveform, real envelope (white dashed), detected (color)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        const y2 = pad * 2 + h1, h2 = H - y2 - pad;
        drawEnv(g, pad, y2, tw, h2, 0, LEN, false);
        D.rect(g, pad + z0 / LEN * tw, y2, (z1 - z0) / LEN * tw, h2, 'rgba(255,255,255,0.05)');
        if (snd.on) { const px = pad + live.pos / LEN * tw; D.line(g, px, y2, px, y2 + h2, '#fff', 1); }
        D.text(g, Lg(`전체 ${DUR.toFixed(1)}초`, `Whole ${DUR.toFixed(1)} s`), pad + 4, y2 + 3, { size: 10, color: C.dim });
        ctx.stat(Lg('지연', 'Lag'), (lag / SR * 1000).toFixed(1) + ' ms');
        ctx.stat(Lg('리플 (빠른 떨림)', 'Ripple (fast wobble)'), ripple.toFixed(2) + '%');
        ctx.stat(Lg('실제 엔벨로프와의 오차 (RMS)', 'Error vs real envelope (RMS)'), err.toFixed(2) + '%');
        ctx.stat(Lg('리플 주파수 (2f)', 'Ripple frequency (2f)'), (2 * P.carrier).toFixed(0) + ' Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
