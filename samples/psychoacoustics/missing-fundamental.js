// 사라진 기음 (가상 음고): 기음이 없어도 배음 간격으로 같은 음 높이가 들림
GTL.register({
  id: 'missing-fundamental',
  title: '사라진 기음 (가상 음고)',
  summary: '배음 3~8번만 있고 기음이 없어도 귀는 기음 높이의 음을 들음. A는 기음부터 있는 소리, B는 기음과 2배음을 뺀 소리인데 파형의 반복 주기와 음 높이가 같음.',
  views: { a: '기음 포함 (1~8배음)', b: '기음 없음 (3~8배음)' },
  controls: '파라미터 표에서 가장 낮은 배음 번호와 기음 주파수를 바꿈. "소리 켜기"를 누르면 짧은 선율이 반복됨.',
  info: `
    <p>배음이 f0, 2f0, 3f0... 로 늘어선 소리에서 기음 f0을 지워도 들리는 음 높이는 그대로 f0. 이것을 <b>사라진 기음(Missing fundamental)</b>, 또는 <b>가상 음고(Virtual pitch)</b>, <b>잔여 음고(Residue pitch)</b>라 부름.</p>
    <p>이유: 배음들의 주파수 간격이 모두 f0이라 파형은 여전히 1/f0마다 반복됨. 뇌는 이 반복 주기(또는 배음들의 공약수)로 음 높이를 정함. 오른쪽 아래의 <b>자기상관(Autocorrelation)</b>이 1/f0에서 가장 큰 봉우리를 보여 줌.</p>
    <ul>
      <li>작은 스피커와 전화기는 100 Hz 아래를 거의 못 내지만 남자 목소리와 베이스의 음 높이는 그대로 들림</li>
      <li>"서브 하모닉 합성"류 플러그인(MaxxBass, Waves의 Renaissance Bass 등)은 이 현상을 이용해 낮은 기음 대신 배음을 더해 저음이 있는 것처럼 들리게 함</li>
      <li>피치 검출 알고리즘(자기상관, YIN)이 스펙트럼의 가장 낮은 봉우리가 아니라 주기를 찾는 이유</li>
    </ul>
    <p>"저음 잡음으로 가리기"를 켜면 가장 낮은 배음 아래를 잡음으로 덮음. 귀 안의 비선형 왜곡이 만든 차음(f2 - f1)이 원인이 아님을 확인하는 고전 실험 방법.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="130" x2="520" y2="130" class="d-line"/>
    <text x="520" y="148" text-anchor="end" class="t-small t-dim">${L('주파수', 'Frequency')}</text>
    <line x1="80" y1="130" x2="80" y2="50" class="d-dim" stroke-dasharray="4 3"/>
    <text x="80" y="42" text-anchor="middle" class="t-small t-dim">${L('f0 (없음)', 'f0 (missing)')}</text>
    <line x1="130" y1="130" x2="130" y2="50" class="d-dim" stroke-dasharray="4 3"/>
    <line x1="180" y1="130" x2="180" y2="60" class="d-b"/><line x1="230" y1="130" x2="230" y2="60" class="d-b"/><line x1="280" y1="130" x2="280" y2="60" class="d-b"/>
    <line x1="330" y1="130" x2="330" y2="60" class="d-b"/><line x1="380" y1="130" x2="380" y2="60" class="d-b"/><line x1="430" y1="130" x2="430" y2="60" class="d-b"/>
    <text x="305" y="50" text-anchor="middle" class="t-small t-b">${L('3f0 ~ 8f0', '3f0 ~ 8f0')}</text>
    <path d="M180,90 L230,90" class="d-accent"/><path d="M230,90 L280,90" class="d-accent"/>
    <text x="230" y="84" text-anchor="middle" class="t-small">${L('간격 = f0', 'gap = f0')}</text>
    <text x="270" y="164" text-anchor="middle" class="t-small">${L('간격이 모두 f0이라 파형은 1/f0마다 반복되고, 귀는 f0 높이를 들음', 'Every gap is f0, so the wave repeats every 1/f0 and the ear hears f0')}</text>
  </svg>`,
  look: [
    'A와 B의 파형 모양은 다르지만 반복 주기(세로 점선 간격)는 같음. 자기상관의 첫 봉우리도 같은 자리.',
    '"소리 켜기"를 누르고 소리 내는 뷰를 바꿔 가며 들으면 음색은 B가 가늘지만 선율의 음 높이는 같음',
    'B의 가장 낮은 배음을 6으로 올려도 음 높이 추정값은 그대로. 배음이 적어질수록 음 높이 느낌은 약해짐.',
    '"저음 잡음으로 가리기"를 켜도 B의 선율이 같은 높이로 들림. 귀 안의 차음 때문이 아니라는 증거.',
  ],
  refs: [
    { type: 'paper', title: 'Schouten, "The residue and the mechanism of hearing", Proc. Koninklijke Nederlandse Akademie van Wetenschappen 43', year: 1940, note: '잔여 음고(residue pitch) 개념' },
    { type: 'paper', title: 'Licklider, "A duplex theory of pitch perception", Experientia 7', year: 1951, note: '자기상관으로 음 높이를 설명하는 모델' },
    { type: 'paper', title: 'Terhardt, "Calculating virtual pitch", Hearing Research 1', year: 1979, note: '가상 음고 계산 모델' },
    { type: 'paper', title: 'de Cheveigné, Kawahara, "YIN, a fundamental frequency estimator for speech and music", JASA 111(4)', year: 2002, note: '주기 기반 피치 검출' },
    { type: 'book', title: 'Brian C. J. Moore, An Introduction to the Psychology of Hearing (6th ed.)', year: 2012, note: '음 높이 지각 이론 정리' },
  ],
  params: [
    { key: 'lowH', label: '가장 낮은 배음 번호', type: 'int', min: 1, max: 8, a: 1, b: 3, default: 1, group: '배음' },
    { key: 'highH', label: '가장 높은 배음 번호', type: 'int', min: 4, max: 16, default: 8, shared: true },
    { key: 'f0', label: '기음 f0 (Hz)', type: 'range', min: 60, max: 400, step: 1, default: 150, shared: true },
    { key: 'melody', label: '선율 재생', type: 'bool', default: true, shared: true, group: '소리' },
    { key: 'mask', label: '저음 잡음으로 가리기', type: 'bool', default: false, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Missing Fundamental (Virtual Pitch)',
    summary: 'With only harmonics 3~8 and no fundamental, the ear still hears the pitch of the fundamental. A has the fundamental. B drops the fundamental and the 2nd harmonic, yet the waveform repeats at the same period and the pitch is the same.',
    views: { a: 'With fundamental (1~8)', b: 'No fundamental (3~8)' },
    controls: 'Change the lowest harmonic number and the fundamental in the parameter table. Press "Sound on" to hear a short melody repeat.',
    info: `
    <p>Take a sound with harmonics at f0, 2f0, 3f0... and remove f0. The pitch you hear is still f0. This is the <b>missing fundamental</b>, also called <b>virtual pitch</b> or <b>residue pitch</b>.</p>
    <p>Why: every harmonic is f0 apart, so the waveform still repeats every 1/f0. The brain picks the pitch from this period (or the common divisor of the harmonics). The <b>autocorrelation</b> at the bottom right shows its biggest peak at 1/f0.</p>
    <ul>
      <li>Small speakers and phones can hardly play below 100 Hz, yet male voices and bass lines keep their pitch.</li>
      <li>"Psychoacoustic bass" plugins (MaxxBass, Waves Renaissance Bass and others) add harmonics instead of the low fundamental, so bass seems to be there.</li>
      <li>This is why pitch detectors (autocorrelation, YIN) look for the period, not the lowest spectral peak.</li>
    </ul>
    <p>"Mask bass with noise" covers everything below the lowest harmonic with noise. This classic test shows the pitch does not come from a difference tone (f2 - f1) made by distortion in the ear.</p>`,
    look: [
      'A and B have different wave shapes but the same period (gap between the dotted lines). The first autocorrelation peak is in the same place.',
      'Press "Sound on" and switch the playing view. B sounds thinner, but the melody has the same pitch.',
      'Raise B\'s lowest harmonic to 6. The pitch estimate stays the same. With fewer harmonics the pitch feels weaker.',
      'Turn on "Mask bass with noise". B\'s melody keeps the same pitch. This shows it is not a difference tone in the ear.',
    ],
    refs: ['The residue pitch idea.', 'Autocorrelation model of pitch.', 'A model to compute virtual pitch.', 'Period-based pitch detection.', 'Overview of pitch perception theories.'],
    params: {
      lowH: { label: 'Lowest harmonic number', group: 'Harmonics' },
      highH: 'Highest harmonic number',
      f0: 'Fundamental f0 (Hz)',
      melody: { label: 'Play melody', group: 'Sound' },
      mask: 'Mask bass with noise',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 2048;
    const range = () => { const lo = Math.min(P.lowH, P.highH), hi = Math.max(P.lowH, P.highH); return [lo, hi]; };
    // 배음 합 (사인 위상). ph: 기음 위상(0~1)
    const tone = (ph, lo, hi) => { let v = 0; for (let h = lo; h <= hi; h++) v += Math.sin(2 * Math.PI * h * ph); return v; };

    let key = '', buf = null, acf = null, est = 0, norm = 0.3, peakLag = 0;
    function analyze() {
      const [lo, hi] = range();
      const k = lo + '|' + hi + '|' + P.f0;
      if (k === key) return;
      key = k;
      buf = new Float32Array(N);
      for (let i = 0; i < N; i++) buf[i] = tone(i * P.f0 / SR, lo, hi);
      let pk = 0;
      for (let i = 0; i < 2000; i++) pk = Math.max(pk, Math.abs(tone(i / 2000, lo, hi)));
      norm = 0.45 / Math.max(1e-6, pk);
      // 정규화 자기상관 (지연 0 ~ N/2)
      const M = N / 2;
      acf = new Float32Array(M);
      let e0 = 0;
      for (let i = 0; i < M; i++) e0 += buf[i] * buf[i];
      for (let lag = 0; lag < M; lag++) { let s = 0; for (let i = 0; i < M; i++) s += buf[i] * buf[i + lag]; acf[lag] = s / Math.max(1e-9, e0); }
      // 1 ms 이후 최대값의 90%를 넘는 첫 봉우리 = 주기
      let best = -1, bl = 0;
      const l0 = Math.floor(SR / 1000);
      for (let lag = l0; lag < M; lag++) if (acf[lag] > best) best = acf[lag];
      for (let lag = l0; lag < M - 1; lag++) if (acf[lag] >= best * 0.9 && acf[lag] >= acf[lag - 1] && acf[lag] >= acf[lag + 1]) { bl = lag; break; }

      if (!bl) bl = Math.round(SR / P.f0);
      peakLag = bl; est = SR / bl;
    }

    const MEL = [0, 2, 4, 5, 7, 5, 4, 2, 0, -5];
    const rng = U.rng(ctx.seed || 3);
    let ph = 0, t = 0, env = 0, nlp = 0, nlp2 = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        const [lo, hi] = range();
        const step = 0.32;
        for (let i = 0; i < n; i++) {
          const idx = Math.floor(t / step), local = t - idx * step;
          const semi = P.melody ? MEL[idx % MEL.length] : 0;
          const f = P.f0 * Math.pow(2, semi / 12);
          const target = P.melody ? (local < step - 0.04 ? 1 : 0) : 1;
          env += (target - env) * 0.003;
          let v = tone(ph, lo, hi) * norm * env;
          if (P.mask) { // 가장 낮은 배음 아래를 덮는 2차 로우패스 잡음
            const a = A.onePoleCoef(lo * f * 0.8, sr);
            nlp += (rng.range(-1, 1) - nlp) * a; nlp2 += (nlp - nlp2) * a;
            v += nlp2 * 0.5;
          }
          l[i] = v; r[i] = v;
          ph += f / sr; if (ph >= 1) ph -= 1;
          t += 1 / sr;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const [lo, hi] = range();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const topH = Math.max(60, (H - pad * 3) * 0.48);
        // 위: 스펙트럼 막대 (선형 주파수)
        const sx = pad, sy = pad, sw = W - pad * 2, sh = topH;
        D.rect(g, sx, sy, sw, sh, 'rgba(0,0,0,0.35)');
        const fmax = P.f0 * 17;
        const xOf = (f) => sx + 8 + (sw - 16) * f / fmax;
        for (let h = 1; h <= 16; h++) {
          const x = xOf(h * P.f0), on = h >= lo && h <= hi;
          if (on) D.line(g, x, sy + sh - 14, x, sy + 26, col, 3);
          else D.line(g, x, sy + sh - 14, x, sy + sh - 20, C.dim, 1);
          if (h <= 8 || h % 2 === 0) D.text(g, String(h), x, sy + sh - 12, { size: 9, align: 'center', color: on ? C.text : C.dim });
        }
        if (P.mask) D.rect(g, xOf(0), sy + sh - 40, xOf(lo * P.f0 * 0.8) - xOf(0), 26, 'rgba(199,146,234,0.35)');
        g.setLineDash([4, 3]); D.line(g, xOf(P.f0), sy + 18, xOf(P.f0), sy + sh - 14, C.good, 1.5); g.setLineDash([]);
        D.text(g, L('들리는 음 높이', 'Heard pitch'), xOf(P.f0) + 4, sy + 16, { size: 10, color: C.good });
        D.text(g, L('스펙트럼 (배음 번호)', 'Spectrum (harmonic number)'), sx + 4, sy + 3, { size: 10, color: C.dim });
        // 아래 왼쪽: 파형, 아래 오른쪽: 자기상관
        const by = sy + sh + pad, bh = H - by - pad, hw = (W - pad * 3) / 2;
        const per = SR / P.f0, cnt = Math.min(N, Math.round(per * 3));
        A.drawWave(g, buf, pad, by, hw, bh, { count: cnt, color: col, amp: 0.9 / Math.max(1, A.peak(buf.subarray(0, cnt))), label: L('파형 (3주기)', 'Waveform (3 periods)') });
        for (let k = 1; k < 3; k++) { const x = pad + hw * (k * per) / (cnt - 1); g.setLineDash([3, 3]); D.line(g, x, by, x, by + bh, C.good, 1); g.setLineDash([]); }
        const ax = pad * 2 + hw, M = acf.length;
        D.rect(g, ax, by, hw, bh, 'rgba(0,0,0,0.35)');
        D.line(g, ax, by + bh / 2, ax + hw, by + bh / 2, C.grid);
        g.beginPath();
        const cols = Math.floor(hw);
        for (let c = 0; c < cols; c++) { const lag = Math.floor(c / cols * M), y = by + bh / 2 - acf[lag] * bh * 0.45; c ? g.lineTo(ax + c, y) : g.moveTo(ax + c, y); }
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        const pxl = ax + hw * peakLag / M;
        D.line(g, pxl, by, pxl, by + bh, C.good, 1.5);
        D.text(g, L('자기상관 (지연 0 ~ 21 ms)', 'Autocorrelation (lag 0 ~ 21 ms)'), ax + 4, by + 3, { size: 10, color: C.dim });
        D.text(g, (1000 / est).toFixed(2) + ' ms', pxl + 3, by + bh - 14, { size: 9, color: C.good });
        ctx.stat(L('가장 낮은 성분', 'Lowest component'), (lo * P.f0).toFixed(0) + ' Hz');
        ctx.stat(L('기음 f0', 'Fundamental f0'), P.f0.toFixed(0) + ' Hz (' + A.noteName(A.ftom(P.f0)) + ')');
        ctx.stat(L('자기상관 음 높이 추정', 'Autocorrelation pitch'), est.toFixed(1) + ' Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
