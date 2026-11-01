// 온셋 검출: 에너지 증가 vs 스펙트럼 플럭스. 음량 변화 없이 음 높이만 바뀌는 시작을 찾을 수 있는지 비교
GTL.register({
  id: 'onset-detection',
  title: '온셋 검출 (에너지 vs 스펙트럼 플럭스)',
  summary: '음의 시작(온셋)을 찾을 때 소리 크기의 증가만 보면 음량 변화 없이 음 높이만 바뀌는 레가토와 큰 소리 위의 작은 음을 놓침. 스펙트럼 플럭스는 주파수마다 새로 생긴 에너지를 더해서 이런 온셋도 찾음.',
  views: { a: '에너지 증가', b: '스펙트럼 플럭스' },
  controls: '파라미터 표에서 방식과 문턱값을 바꿈. "소리 켜기"를 누르면 신호와 함께 검출된 온셋마다 딸깍 소리가 남.',
  info: `
    <p><b>온셋(Onset)</b>은 음이 시작되는 순간. 리듬 게임 채보, 비트 추적, 자동 채보, 드럼 교체, 오디오 슬라이스의 첫 단계.</p>
    <p>순서: 신호 → <b>새로움 함수(Novelty Function)</b> 계산 → 봉우리 고르기(Peak Picking)</p>
    <ul>
      <li><b>에너지 증가</b>: 프레임 에너지의 로그가 커진 만큼. 타악기처럼 조용하다가 갑자기 커지는 소리에 잘 맞음. 음량이 그대로인 음 변화는 못 찾음.</li>
      <li><b>스펙트럼 플럭스(Spectral Flux)</b>: 주파수 bin마다 크기가 커진 만큼만 더함(반파 정류). 새 음이 새 배음을 만들기 때문에 음량이 그대로여도 값이 튐. 로그 압축으로 작은 성분도 반영.</li>
      <li><b>봉우리 고르기</b>: 새로움 함수에서 주변 평균보다 문턱값 이상 높은 극대점. 너무 가까운 봉우리는 하나만 남김.</li>
    </ul>
    <p>단점: 비브라토, 트레몰로가 강한 소리는 플럭스도 거짓 온셋을 냄. 이럴 때는 위상 정보(복소 영역 방식)나 신경망 방식을 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('레가토: 음량은 그대로, 음 높이만 바뀜', 'Legato: same level, only the pitch changes')}</text>
    <rect x="20" y="30" width="110" height="10" class="f-dim"/><rect x="130" y="50" width="110" height="10" class="f-dim"/>
    <rect x="20" y="60" width="110" height="10" class="f-dim"/><rect x="130" y="80" width="110" height="10" class="f-dim"/>
    <text x="75" y="100" text-anchor="middle" class="t-small">${L('음 1의 배음', 'note 1 harmonics')}</text>
    <text x="185" y="110" text-anchor="middle" class="t-small">${L('음 2의 배음', 'note 2 harmonics')}</text>
    <line x1="130" y1="22" x2="130" y2="118" class="d-dim" stroke-dasharray="3 3"/>
    <path d="M20,140 L240,140" class="d-a"/>
    <text x="250" y="144" class="t-small t-a">${L('에너지: 변화 없음', 'Energy: no change')}</text>
    <path d="M20,160 L126,160 L130,128 L134,160 L240,160" class="d-b"/>
    <text x="250" y="164" class="t-small t-b">${L('플럭스: 새 bin이 켜져서 튐', 'Flux: new bins switch on, spike')}</text>
    <rect x="330" y="30" width="80" height="26" class="f-dim"/><text x="370" y="47" text-anchor="middle" class="t-small">STFT</text>
    <rect x="440" y="30" width="90" height="26" class="f-dim"/><text x="485" y="47" text-anchor="middle" class="t-small">${L('새로움 함수', 'novelty')}</text>
    <rect x="385" y="90" width="90" height="26" class="f-dim"/><text x="430" y="107" text-anchor="middle" class="t-small">${L('봉우리 고르기', 'peak picking')}</text>
    <path d="M410,43 L438,43" class="d-accent" marker-end="url(#arr)"/><path d="M485,58 L450,88" class="d-accent" marker-end="url(#arr)"/>
  </svg>`,
  look: [
    'A는 0.6, 1.1, 1.6초의 레가토 음 변화(흰 눈금)를 모두 놓침. B는 새로움 함수가 튀어서 찾음.',
    '0.85초, 1.35초의 작은 고음은 큰 지속음 위에 얹힘. A는 놓치고 B는 찾음.',
    '두 방식 모두 2초 뒤의 드럼과 피킹 음은 잘 찾음. 조용하다가 커지는 온셋은 쉬움.',
    '문턱값을 0.02로 낮춰도 A는 레가토 음 변화를 찾지 못함. 에너지 곡선에 봉우리 자체가 없기 때문.',
    '"소리 켜기" 후 A를 들으면 앞쪽 2초 동안 딸깍 소리가 거의 없음',
  ],
  refs: [
    { type: 'paper', title: 'J. P. Bello, L. Daudet, S. Abdallah, C. Duxbury, M. Davies, M. Sandler, "A Tutorial on Onset Detection in Music Signals", IEEE Trans. Speech and Audio Processing 13(5)', year: 2005, note: '에너지, 스펙트럼, 위상 기반 온셋 검출의 정리' },
    { type: 'paper', title: 'S. Dixon, "Onset Detection Revisited", DAFx', year: 2006, note: '스펙트럼 플럭스와 봉우리 고르기 비교' },
    { type: 'book', title: 'Meinard Müller, Fundamentals of Music Processing, 2nd ed.', year: 2021, note: '6장 템포와 비트 추적: 새로움 함수, 로그 압축' },
    { type: 'paper', title: 'S. Böck, G. Widmer, "Maximum Filter Vibrato Suppression for Onset Detection", DAFx', year: 2013, note: '비브라토의 거짓 온셋을 줄이는 SuperFlux' },
  ],
  params: [
    { key: 'method', label: '새로움 함수', type: 'select', options: [{ value: 'energy', label: '에너지 증가' }, { value: 'flux', label: '스펙트럼 플럭스' }], a: 'energy', b: 'flux', group: '검출' },
    { key: 'thr', label: '문턱값', type: 'range', min: 0.01, max: 0.5, step: 0.01, default: 0.08, shared: true, help: '주변 평균보다 이만큼 높아야 온셋' },
    { key: 'gamma', label: '로그 압축 γ', type: 'range', min: 1, max: 1000, step: 1, default: 100, shared: true, help: 'log(1 + γ|X|). 클수록 작은 성분이 강조됨' },
    { key: 'click', label: '딸깍 소리 크기', type: 'range', min: 0, max: 1, step: 0.05, default: 0.5, shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Onset Detection (Energy vs Spectral Flux)',
    summary: 'If you look only at rising loudness to find note starts (onsets), you miss legato pitch changes with no level change and quiet notes on top of loud ones. Spectral flux sums the new energy in each frequency bin, so it finds these onsets too.',
    views: { a: 'Energy rise', b: 'Spectral flux' },
    controls: 'Change the method and threshold in the parameter table. Press "Sound on" to hear the signal with a click at every detected onset.',
    info: `
    <p>An <b>onset</b> is the moment a note starts. It is the first step of rhythm game charting, beat tracking, transcription, drum replacement and audio slicing.</p>
    <p>Steps: signal → <b>novelty function</b> → peak picking.</p>
    <ul>
      <li><b>Energy rise</b>: how much the log frame energy grows. Works well for sounds that jump from quiet to loud, like drums. Cannot find note changes at the same level.</li>
      <li><b>Spectral flux</b>: sums only the increase in each frequency bin (half-wave rectified). A new note brings new harmonics, so the value jumps even when the level stays the same. Log compression lets small parts count too.</li>
      <li><b>Peak picking</b>: local maxima that rise above the local mean by at least the threshold. Peaks that are too close keep only one.</li>
    </ul>
    <p>Weak spot: strong vibrato or tremolo creates false onsets even with flux. Then use phase information (complex domain) or neural network methods.</p>`,
    look: [
      'A misses all the legato note changes at 0.6, 1.1 and 1.6 s (white ticks). B\'s novelty spikes and finds them.',
      'The quiet high notes at 0.85 s and 1.35 s sit on top of a loud held note. A misses them and B finds them.',
      'Both methods find the drums and plucked notes after 2 s. Onsets that rise from quiet are easy.',
      'Lower the threshold to 0.02. A still cannot find the legato changes, because the energy curve has no peak there at all.',
      'Press "Sound on" and listen to A. There are almost no clicks in the first 2 seconds.',
    ],
    refs: ['Overview of energy, spectral and phase based onset detection.', 'Comparison of spectral flux and peak picking.', 'Chapter 6, tempo and beat tracking: novelty functions and log compression.', 'SuperFlux: fewer false onsets from vibrato.'],
    params: {
      method: { label: 'Novelty function', group: 'Detection', options: { energy: 'Energy rise', flux: 'Spectral flux' } },
      thr: { label: 'Threshold', help: 'How far above the local mean a peak must be.' },
      gamma: { label: 'Log compression γ', help: 'log(1 + γ|X|). Larger values boost small parts.' },
      click: { label: 'Click level', group: 'Sound' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 22050, DUR = 4, LEN = SR * DUR, N = 1024, HOP = 256, TAU = Math.PI * 2;
    const TRUTH = [0.1, 0.6, 0.85, 1.1, 1.35, 1.6, 2.1, 2.35, 2.6, 2.85, 3.1, 3.35, 3.6];

    // ── 신호 합성 ──
    const sig = new Float32Array(LEN);
    {
      // 레가토 지속음: 음량은 일정, 음 높이만 바뀜
      const legato = [[0.1, 60], [0.6, 64], [1.1, 62], [1.6, 67]];
      let ph = 0;
      for (let i = Math.round(0.1 * SR); i < Math.round(1.95 * SR); i++) {
        const t = i / SR;
        let m = 60; for (const [s, mm] of legato) if (t >= s) m = mm;
        ph += TAU * A.mtof(m) / SR;
        let v = 0; for (let h = 1; h <= 6; h++) v += Math.sin(h * ph) / h;
        sig[i] += 0.2 * v * Math.min(1, (t - 0.1) / 0.01, (1.95 - t) / 0.05);
      }
      const pluck = (t0, m, amp, dec) => {
        const f = A.mtof(m), i0 = Math.round(t0 * SR);
        for (let i = 0; i < SR * 1.2 && i0 + i < LEN; i++) {
          const t = i / SR; let v = 0;
          for (let h = 1; h <= 8; h++) v += Math.sin(TAU * f * h * t) * Math.exp(-t * dec * (1 + h * 0.4)) / h;
          sig[i0 + i] += amp * v * Math.min(1, i / 20);
        }
      };
      pluck(0.85, 79, 0.08, 4); pluck(1.35, 76, 0.08, 4);
      const rng = U.rng(5);
      const drum = (t0, amp, kind) => {
        const i0 = Math.round(t0 * SR);
        let ph2 = 0;
        for (let i = 0; i < SR * 0.4 && i0 + i < LEN; i++) {
          const t = i / SR;
          if (kind === 'kick') { ph2 += TAU * (50 + 90 * Math.exp(-t * 30)) / SR; sig[i0 + i] += amp * Math.sin(ph2) * Math.exp(-t * 9); }
          else if (kind === 'snare') sig[i0 + i] += amp * (rng.range(-1, 1) * 0.7 * Math.exp(-t * 20) + Math.sin(TAU * 190 * t) * 0.5 * Math.exp(-t * 25));
          else sig[i0 + i] += amp * rng.range(-1, 1) * Math.exp(-t * 60);
        }
      };
      drum(2.1, 0.5, 'kick'); drum(2.35, 0.35, 'snare'); drum(2.6, 0.5, 'kick'); drum(2.85, 0.12, 'hat');
      pluck(3.1, 57, 0.25, 2); pluck(3.35, 60, 0.25, 2); pluck(3.6, 64, 0.25, 2);
      A.normalize(sig, 0.5);
    }

    // 긴 버퍼를 열마다 최대, 최소 쌍으로 줄여 둠 (매 프레임 수만 샘플을 훑지 않게)
    const decimate = (b, cols = 1024) => { const o = new Float32Array(cols * 2), s = b.length / cols; for (let c = 0; c < cols; c++) { let lo = Infinity, hi = -Infinity; for (let i = Math.floor(c * s); i < Math.floor((c + 1) * s); i++) { const v = b[i]; if (v < lo) lo = v; if (v > hi) hi = v; } o[2 * c] = hi; o[2 * c + 1] = lo; } return o; };
    const sigDec = decimate(sig);
    // ── STFT 크기 (한 번만) ──
    const nF = Math.floor(LEN / HOP), nB = N / 2, MAG = new Float32Array(nF * nB), EN = new Float32Array(nF);
    {
      const re = new Float64Array(N), im = new Float64Array(N), w = new Float64Array(N);
      for (let i = 0; i < N; i++) w[i] = 0.5 - 0.5 * Math.cos(TAU * i / N);
      for (let f = 0; f < nF; f++) {
        re.fill(0); im.fill(0);
        let e = 0;
        for (let i = 0; i < N; i++) { const j = f * HOP - N / 2 + i; const v = j >= 0 && j < LEN ? sig[j] * w[i] : 0; re[i] = v; e += v * v; }
        EN[f] = e;
        A.fft(re, im);
        for (let b = 0; b < nB; b++) MAG[f * nB + b] = Math.hypot(re[b], im[b]) / (N / 4);
      }
    }
    // 스펙트로그램 이미지 (로그 주파수)
    const CMAP = [[0, 0, 4], [40, 11, 84], [101, 21, 110], [159, 42, 99], [212, 72, 66], [245, 125, 21], [250, 193, 39], [252, 255, 164]];
    const img = ctx.createCanvas(nF, 100);
    {
      const ig = img.getContext('2d'), id = ig.createImageData(nF, 100), d = id.data;
      for (let r = 0; r < 100; r++) {
        const fr = 80 * Math.pow(6000 / 80, (99 - r) / 99), b = Math.min(nB - 1, Math.round(fr * N / SR));
        for (let f = 0; f < nF; f++) {
          const t = U.clamp((20 * Math.log10(MAG[f * nB + b] + 1e-9) + 70) / 70, 0, 1) * 7, i = Math.min(6, Math.floor(t)), fr2 = t - i, a = CMAP[i], c = CMAP[i + 1], o = (r * nF + f) * 4;
          d[o] = a[0] + (c[0] - a[0]) * fr2; d[o + 1] = a[1] + (c[1] - a[1]) * fr2; d[o + 2] = a[2] + (c[2] - a[2]) * fr2; d[o + 3] = 255;
        }
      }
      ig.putImageData(id, 0, 0);
    }

    let key = '', nov = null, thrCurve = null, onsets = [], tp = 0, fp = 0, fn = 0, clicks = null;
    function analyze() {
      const k = [P.method, P.thr, P.gamma].join();
      if (k === key) return;
      key = k;
      nov = new Float32Array(nF);
      const gm = P.gamma;
      for (let f = 1; f < nF; f++) {
        if (P.method === 'energy') nov[f] = Math.max(0, Math.log(1 + gm * EN[f]) - Math.log(1 + gm * EN[f - 1]));
        else { let s = 0; for (let b = 1; b < nB; b++) { const d = Math.log(1 + gm * MAG[f * nB + b]) - Math.log(1 + gm * MAG[(f - 1) * nB + b]); if (d > 0) s += d; } nov[f] = s; }
      }
      let mx = 1e-9; for (let f = 0; f < nF; f++) mx = Math.max(mx, nov[f]);
      for (let f = 0; f < nF; f++) nov[f] /= mx;
      // 적응형 문턱값: 주변 ±10프레임 평균 + thr. 극대점(±3프레임)이면서 문턱값 위
      thrCurve = new Float32Array(nF);
      onsets = [];
      for (let f = 0; f < nF; f++) {
        let s = 0, c = 0;
        for (let j = Math.max(0, f - 10); j <= Math.min(nF - 1, f + 10); j++) { s += nov[j]; c++; }
        thrCurve[f] = s / c + P.thr;
      }
      for (let f = 1; f < nF - 1; f++) {
        if (nov[f] <= thrCurve[f]) continue;
        let isMax = true;
        for (let j = Math.max(0, f - 3); j <= Math.min(nF - 1, f + 3); j++) if (nov[j] > nov[f]) isMax = false;
        const t = f * HOP / SR;
        if (isMax && (!onsets.length || t - onsets[onsets.length - 1] > 0.05)) onsets.push(t);
      }
      // 평가: 정답 ±50ms 안에 하나씩 짝지음
      const used = new Set();
      tp = 0;
      for (const t of TRUTH) {
        let best = -1, bd = 0.05;
        onsets.forEach((o, i) => { if (!used.has(i) && Math.abs(o - t) <= bd) { bd = Math.abs(o - t); best = i; } });
        if (best >= 0) { used.add(best); tp++; }
      }
      fp = onsets.length - tp; fn = TRUTH.length - tp;
      // 딸깍 트랙
      clicks = new Float32Array(LEN);
      for (const t of onsets) { const i0 = Math.round(t * SR); for (let i = 0; i < 400 && i0 + i < LEN; i++) clicks[i0 + i] += Math.sin(TAU * 2000 * i / SR) * Math.exp(-i / 80); }
    }
    analyze();

    const live = { pos: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr;
        for (let i = 0; i < n; i++) {
          const i0 = Math.floor(live.pos), v = sig[i0] * 0.8 + clicks[i0] * 0.4 * P.click;
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= LEN) live.pos -= LEN;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, tw = W - pad * 2;
        const tx = (t) => pad + t / DUR * tw;
        const h1 = Math.max(40, H * 0.22), h2 = Math.max(40, H * 0.26), y2 = pad + h1 + 4, y3 = y2 + h2 + 4, h3 = H - y3 - pad - 12;
        A.drawWave(g, sigDec, pad, pad, tw, h1, { color: 'rgba(216,221,230,0.7)', amp: 1.6, label: Lg('파형', 'Waveform'), lineWidth: 1 });
        g.imageSmoothingEnabled = false; g.drawImage(img, pad, y2, tw, h2); g.imageSmoothingEnabled = true;
        D.text(g, Lg('스펙트로그램 (80Hz~6kHz)', 'Spectrogram (80 Hz to 6 kHz)'), pad + 4, y2 + 3, { size: 10, color: '#fff' });
        // 새로움 함수와 문턱값
        D.rect(g, pad, y3, tw, h3, 'rgba(0,0,0,0.35)');
        const ny = (v) => y3 + h3 - U.clamp(v, 0, 1.05) * (h3 - 14);
        g.beginPath(); for (let f = 0; f < nF; f++) { const px = tx(f * HOP / SR), py = ny(nov[f]); f ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        g.beginPath(); for (let f = 0; f < nF; f++) { const px = tx(f * HOP / SR), py = ny(thrCurve[f]); f ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = C.warn; g.lineWidth = 1; g.setLineDash([4, 3]); g.stroke(); g.setLineDash([]);
        D.text(g, Lg('새로움 함수 (점선 = 문턱값)', 'Novelty function (dashed = threshold)'), pad + 4, y3 + 3, { size: 10, color: C.dim });
        // 정답(흰 눈금)과 검출(색 선)
        for (const t of TRUTH) D.line(g, tx(t), pad, tx(t), pad + 8, '#fff', 2);
        for (const t of onsets) {
          const hit = TRUTH.some((u) => Math.abs(u - t) <= 0.05);
          D.line(g, tx(t), pad + 10, tx(t), y3 + h3, hit ? col : C.bad, 1.2);
        }
        for (let t = 0; t <= DUR; t++) D.text(g, t + 's', tx(t), y3 + h3 + 1, { size: 9, color: C.dim, align: t === DUR ? 'right' : t ? 'center' : 'left' });
        if (snd.on) D.line(g, tx(live.pos / SR), pad, tx(live.pos / SR), y3 + h3, '#fff', 1);
        ctx.stat(Lg('찾은 온셋 (정답 13개)', 'Onsets found (13 real)'), `${tp}`);
        ctx.stat(Lg('놓침', 'Missed'), fn);
        ctx.stat(Lg('거짓 온셋', 'False onsets'), fp);
        ctx.stat(Lg('F 점수', 'F-measure'), (2 * tp / Math.max(1, 2 * tp + fp + fn)).toFixed(2));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
