// 켑스트럼 피치 검출: 스펙트럼에서 가장 큰 봉우리 고르기 vs 켑스트럼(로그 스펙트럼의 스펙트럼)에서 배음 간격 찾기
GTL.register({
  id: 'cepstrum',
  title: '켑스트럼 피치 검출',
  summary: '스펙트럼에서 가장 큰 봉우리를 음 높이로 고르면 포먼트가 키운 배음을 잡아 몇 배 높게 틀림. 켑스트럼은 로그 스펙트럼의 규칙적인 배음 간격을 하나의 봉우리로 바꿔서 기음이 없어도 음 높이를 찾음.',
  views: { a: '스펙트럼 최대 봉우리', b: '켑스트럼' },
  controls: '파라미터 표에서 음 높이, 기음 제거, 잡음을 바꿈. "소리 켜기"를 누르면 원래 소리와 검출된 음 높이의 사인파가 함께 들림.',
  info: `
    <p>목소리와 악기의 스펙트럼 = 음원(일정 간격 배음) × 필터(포먼트 윤곽). 가장 큰 배음은 기음이 아니라 포먼트 근처의 배음인 경우가 많음. 전화기처럼 저역이 잘린 소리는 기음 자체가 없음(사라진 기음). 그래도 귀는 원래 음 높이를 들음.</p>
    <p><b>켑스트럼(Cepstrum)</b>: 로그 크기 스펙트럼을 다시 푸리에 변환(역변환)한 것. 이름은 spectrum의 앞 네 글자를 뒤집은 말장난.</p>
    <ul>
      <li>로그를 취하면 곱(음원 × 필터)이 합으로 바뀜</li>
      <li>포먼트 윤곽은 천천히 변하는 성분이라 켑스트럼의 앞쪽(짧은 큐프렌시)에 모임</li>
      <li>배음 줄무늬는 f0 간격으로 반복되는 성분이라 큐프렌시 1/f0(주기) 자리에 봉우리를 만듦</li>
    </ul>
    <p>그래서 켑스트럼에서 2.5~12.5ms(400~80Hz) 범위의 가장 큰 봉우리가 주기. 비슷한 아이디어인 <b>배음 곱 스펙트럼(HPS)</b>은 스펙트럼을 2, 3, 4배로 줄여 곱해서 기음 자리에 배음을 모음.</p>
    <p>단점: 잡음이 많거나 음 높이가 높아 배음이 몇 개뿐이면 봉우리가 약해짐. 프레임이 주기를 여러 개 담을 만큼 길어야 함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('로그 스펙트럼', 'Log spectrum')}</text>
    <line x1="10" y1="120" x2="250" y2="120" class="d-line"/>
    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((h) => { const x = 10 + h * 22, a = 50 - 30 * Math.exp(-Math.pow((h - 5) / 1.6, 2)); return `<line x1="${x}" y1="120" x2="${x}" y2="${a + 30}" class="${h === 5 ? 'd-a' : 'd-dim'}"/>`; }).join('')}
    <path d="M20,100 Q120,20 250,110" class="d-accent" stroke-dasharray="4 3"/>
    <text x="120" y="22" text-anchor="middle" class="t-small t-a">${L('가장 큰 배음 = 5배음', 'largest = 5th harmonic')}</text>
    <text x="130" y="140" text-anchor="middle" class="t-small">${L('간격 f0의 줄무늬', 'ripple with spacing f0')}</text>
    <path d="M262,80 L298,80" class="d-accent" marker-end="url(#arr)"/>
    <text x="280" y="70" text-anchor="middle" class="t-small">IFFT</text>
    <text x="310" y="14" class="t-small t-dim">${L('켑스트럼 (가로 = 큐프렌시)', 'Cepstrum (x = quefrency)')}</text>
    <line x1="310" y1="120" x2="530" y2="120" class="d-line"/>
    <path d="M312,40 Q320,110 340,115 L530,117" class="d-dim"/>
    <line x1="430" y1="120" x2="430" y2="50" class="d-b"/>
    <text x="350" y="60" text-anchor="middle" class="t-small t-dim">${L('포먼트 윤곽', 'formant outline')}</text>
    <text x="430" y="42" text-anchor="middle" class="t-small t-b">${L('1/f0 = 주기', '1/f0 = period')}</text>
    <text x="420" y="150" text-anchor="middle" class="t-small t-dim">${L('천천히 변하는 윤곽과 빠른 줄무늬가 갈라짐', 'slow outline and fast ripple separate')}</text>
  </svg>`,
  look: [
    'A는 포먼트 근처의 강한 배음을 골라 실제보다 몇 배 높은 음을 냄. B의 켑스트럼 봉우리는 정확히 주기(흰 눈금) 자리.',
    '"기음 제거"를 켜도 B는 같은 음 높이를 찾음. 사라진 기음을 귀처럼 복원함.',
    '방식을 HPS로 바꿔도 맞는 음 높이를 찾음. 다만 오차가 몇 센트로 켑스트럼보다 조금 큼.',
    '음 높이를 100Hz로 내리면 A는 7배, 380Hz로 올리면 2배를 고름. 포먼트 근처에 어떤 배음이 놓이느냐에 따라 A의 답이 달라짐.',
  ],
  refs: [
    { type: 'paper', title: 'A. M. Noll, "Cepstrum Pitch Determination", JASA 41(2)', year: 1967, note: '켑스트럼 피치 검출의 원 논문' },
    { type: 'paper', title: 'B. P. Bogert, M. J. R. Healy, J. W. Tukey, "The Quefrency Alanysis of Time Series for Echoes: Cepstrum, Pseudo-Autocovariance, Cross-Cepstrum and Saphe Cracking"', year: 1963, note: '켑스트럼이라는 이름과 개념의 시작' },
    { type: 'paper', title: 'M. R. Schroeder, "Period Histogram and Product Spectrum: New Methods for Fundamental-Frequency Measurement", JASA 43(4)', year: 1968, note: '배음 곱 스펙트럼(HPS)' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '소스 필터 처리 장의 켑스트럼' },
  ],
  params: [
    { key: 'method', label: '검출 방식', type: 'select', options: [{ value: 'peak', label: '스펙트럼 최대 봉우리' }, { value: 'hps', label: '배음 곱 스펙트럼 (HPS)' }, { value: 'cep', label: '켑스트럼' }], a: 'peak', b: 'cep', group: '검출' },
    { key: 'f0', label: '음 높이 (Hz)', type: 'range', min: 80, max: 400, step: 1, default: 140, shared: true, group: '신호' },
    { key: 'missing', label: '기음 제거', type: 'bool', default: false, shared: true, help: '1, 2배음을 지움 (전화기 대역처럼)' },
    { key: 'noise', label: '잡음 (dB)', type: 'range', min: -80, max: -10, step: 1, default: -50, shared: true },
    { key: 'mix', label: '검출 음 크기', type: 'range', min: 0, max: 1, step: 0.05, default: 0.5, shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Cepstrum Pitch Detection',
    summary: 'Picking the largest spectral peak as the pitch grabs a harmonic boosted by a formant and lands several times too high. The cepstrum turns the regular harmonic spacing of the log spectrum into a single peak, so it finds the pitch even without a fundamental.',
    views: { a: 'Largest spectral peak', b: 'Cepstrum' },
    controls: 'Change the pitch, missing fundamental and noise in the parameter table. Press "Sound on" to hear the original sound with a sine wave at the detected pitch.',
    info: `
    <p>The spectrum of a voice or instrument = source (evenly spaced harmonics) × filter (formant outline). The largest harmonic is often not the fundamental but one near a formant. A sound with the lows cut, like a phone line, has no fundamental at all (the missing fundamental). The ear still hears the original pitch.</p>
    <p><b>Cepstrum</b>: the Fourier transform (inverse) of the log magnitude spectrum. The name is a pun that reverses the first four letters of spectrum.</p>
    <ul>
      <li>The log turns the product (source × filter) into a sum.</li>
      <li>The formant outline changes slowly, so it gathers at the start of the cepstrum (short quefrency).</li>
      <li>The harmonic ripple repeats every f0, so it makes a peak at quefrency 1/f0 (the period).</li>
    </ul>
    <p>So the largest cepstrum peak in 2.5 to 12.5 ms (400 to 80 Hz) is the period. A similar idea, the <b>harmonic product spectrum (HPS)</b>, shrinks the spectrum by 2, 3 and 4 and multiplies them, which piles the harmonics onto the fundamental.</p>
    <p>Weak spots: with a lot of noise, or a high pitch with only a few harmonics, the peak gets weak. The frame must be long enough to hold several periods.</p>`,
    look: [
      'A picks a strong harmonic near a formant and plays a note several times too high. B\'s cepstrum peak sits exactly at the period (white tick).',
      'Turn on "Missing fundamental". B still finds the same pitch. It restores the missing fundamental like the ear does.',
      'Switch to HPS. It also finds the right pitch, but its error is a few cents, a bit larger than the cepstrum.',
      'Lower the pitch to 100 Hz and A picks 7x. Raise it to 380 Hz and A picks 2x. The answer of A depends on which harmonic lands near the formant.',
    ],
    refs: ['The original cepstrum pitch detection paper.', 'Where the name and idea of the cepstrum began.', 'The harmonic product spectrum (HPS).', 'Cepstrum in the source-filter processing chapter.'],
    params: {
      method: { label: 'Method', group: 'Detection', options: { peak: 'Largest spectral peak', hps: 'Harmonic product spectrum (HPS)', cep: 'Cepstrum' } },
      f0: { label: 'Pitch (Hz)', group: 'Signal' },
      missing: { label: 'Missing fundamental', help: 'Removes the 1st and 2nd harmonics (like a phone band).' },
      noise: 'Noise (dB)',
      mix: { label: 'Detected tone level', group: 'Sound' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 16000, N = 2048, TAU = Math.PI * 2, TL = 4096;
    const FORM = [[700, 80], [1200, 100], [2600, 150]];
    const env = (f) => { let m = 1; for (const [F, B] of FORM) m *= F * F / Math.sqrt(Math.pow(F * F - f * f, 2) + Math.pow(B * f, 2)); return m; };
    const amp = (h, f0) => (P.missing && h <= 2 ? 0 : env(h * f0) / Math.sqrt(h));
    const noise = A.noiseBuffer(N, 13);
    const QMIN = Math.floor(SR / 400), QMAX = Math.ceil(SR / 80);

    let key = '', spec = null, cep = null, hps = null, det = 0, table = new Float32Array(TL), tKey = '';
    function analyze() {
      const k = [P.method, P.f0, P.missing, P.noise].join();
      if (k === key) return;
      key = k;
      const f0 = P.f0, rng = U.rng(2);
      // 프레임 합성 (최대 배음 = 1)
      const x = new Float64Array(N);
      let amax = 0; for (let h = 1; h * f0 < SR / 2; h++) amax = Math.max(amax, amp(h, f0));
      for (let h = 1; h * f0 < SR / 2; h++) { const a = amp(h, f0) / amax, ph = rng.range(0, TAU), w = TAU * h * f0 / SR; if (a > 0) for (let i = 0; i < N; i++) x[i] += a * Math.sin(w * i + ph); }
      const nl = A.dbToLin(P.noise) * 1.7;
      for (let i = 0; i < N; i++) x[i] += nl * noise[i];
      // 로그 스펙트럼
      const re = new Float64Array(N), im = new Float64Array(N);
      let ws = 0;
      for (let i = 0; i < N; i++) { const w = 0.5 - 0.5 * Math.cos(TAU * i / N); ws += w; re[i] = x[i] * w; }
      A.fft(re, im);
      spec = new Float64Array(N / 2);
      for (let b = 0; b < N / 2; b++) spec[b] = 20 * Math.log10(2 * Math.hypot(re[b], im[b]) / ws + 1e-9);
      // 켑스트럼: 로그 크기(자연로그)의 역 FFT
      const cr = new Float64Array(N), ci = new Float64Array(N);
      for (let b = 0; b < N; b++) { const bb = b <= N / 2 ? b : N - b; cr[b] = Math.log(Math.hypot(re[bb] || 0, im[bb] || 0) + 1e-9); }
      A.fft(cr, ci, true);
      cep = cr;
      // HPS (5배까지)
      const lin = Float64Array.from(spec, (d) => Math.pow(10, d / 20));
      hps = new Float64Array(N / 10);
      for (let b = 1; b < hps.length; b++) { let p = 1; for (let r = 1; r <= 5; r++) p *= lin[b * r] + 1e-6; hps[b] = Math.log10(p); }
      // 검출
      const parab = (arr, i) => { const a = arr[i - 1], b = arr[i], c = arr[i + 1], d = a - 2 * b + c; return Math.abs(d) > 1e-12 ? i + U.clamp(0.5 * (a - c) / d, -0.5, 0.5) : i; };
      if (P.method === 'peak') {
        let bi = 2; for (let b = 2; b < N / 2 - 1; b++) if (spec[b] > spec[bi]) bi = b;
        det = parab(spec, bi) * SR / N;
      } else if (P.method === 'hps') {
        const lo = Math.floor(70 * N / SR), hi = Math.min(hps.length - 2, Math.ceil(420 * N / SR));
        let bi = lo; for (let b = lo; b <= hi; b++) if (hps[b] > hps[bi]) bi = b;
        det = parab(hps, bi) * SR / N;
      } else {
        let qi = QMIN; for (let q = QMIN; q <= QMAX; q++) if (cep[q] > cep[qi]) qi = q;
        det = SR / parab(cep, qi);
      }
      // 재생용 웨이브테이블 (음 높이나 기음 제거가 바뀔 때만)
      const tk = P.f0 + ',' + P.missing;
      if (tk !== tKey) {
        tKey = tk;
        const t = new Float32Array(TL);
        for (let h = 1; h * f0 < SR / 2; h++) { const a = amp(h, f0) / amax; if (a > 0) for (let i = 0; i < TL; i++) t[i] += a * Math.sin(TAU * h * i / TL); }
        A.normalize(t, 0.4);
        table = t;
      }
    }
    analyze();

    const live = { ph: 0, ph2: 0, nz: 0, f: 140 };
    const nbuf = A.noiseBuffer(48000, 17);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const inc = P.f0 / sr * TL, nl = A.dbToLin(P.noise) * 0.7;
        for (let i = 0; i < n; i++) {
          live.f += (det - live.f) * 0.002;
          const p = live.ph, i0 = Math.floor(p), fr = p - i0, v = table[i0] * (1 - fr) + table[(i0 + 1) % TL] * fr;
          live.ph2 = (live.ph2 + TAU * live.f / sr) % TAU;
          const o = v + nl * nbuf[live.nz] + 0.15 * P.mix * Math.sin(live.ph2);
          l[i] = o; r[i] = o;
          live.ph += inc; if (live.ph >= TL) live.ph -= TL;
          live.nz = (live.nz + 1) % nbuf.length;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2, f0 = P.f0;
        // 위: 로그 스펙트럼 (0~4kHz)
        const sh = Math.max(80, H * 0.46), FM = 4000, minDb = -90, maxDb = 5;
        D.rect(g, pad, pad, tw, sh, 'rgba(0,0,0,0.35)');
        const fx = (f) => pad + f / FM * tw, dy = (db) => pad + sh - U.clamp((db - minDb) / (maxDb - minDb), 0, 1) * sh;
        for (let h = 1; h * f0 < FM; h++) D.line(g, fx(h * f0), pad + sh - 6, fx(h * f0), pad + sh, 'rgba(255,255,255,0.5)');
        for (let f = 1000; f < FM; f += 1000) D.text(g, f / 1000 + 'k', fx(f), pad + sh - 18, { size: 9, color: C.dim, align: 'center' });
        g.beginPath();
        for (let b = 0; b < N / 2; b++) { const f = b * SR / N; if (f > FM) break; const px = fx(f), py = dy(spec[b]); b ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = 'rgba(216,221,230,0.75)'; g.lineWidth = 1; g.stroke();
        if (P.method === 'hps') {
          let hm = -Infinity, hl = Infinity; for (let b = 1; b < hps.length; b++) { hm = Math.max(hm, hps[b]); hl = Math.min(hl, hps[b]); }
          g.beginPath();
          for (let b = 1; b < hps.length; b++) { const px = fx(b * SR / N), py = pad + sh - (hps[b] - hl) / (hm - hl + 1e-9) * sh * 0.8; b > 1 ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        }
        D.line(g, fx(det), pad, fx(det), pad + sh, col, 2);
        D.text(g, Lg('로그 스펙트럼 (흰 눈금 = 배음 위치, 색 선 = 검출)', 'Log spectrum (white ticks = harmonics, colored line = detected)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        if (P.method === 'hps') D.text(g, Lg('색 곡선 = HPS', 'Colored curve = HPS'), pad + 4, pad + 16, { size: 10, color: col });
        // 아래: 켑스트럼 (0~15ms)
        const cy = pad * 2 + sh, ch = H - cy - pad - 12, QM = Math.round(SR * 0.015);
        D.rect(g, pad, cy, tw, ch, 'rgba(0,0,0,0.35)');
        const qx = (q) => pad + q / QM * tw;
        D.rect(g, qx(QMIN), cy, qx(QMAX) - qx(QMIN), ch, 'rgba(255,255,255,0.04)');
        let cm = 1e-9; for (let q = QMIN; q <= QM; q++) cm = Math.max(cm, Math.abs(cep[q]));
        const vy = (v) => cy + ch * 0.75 - U.clamp(v / cm, -0.4, 1.2) * ch * 0.6;
        D.line(g, pad, vy(0), pad + tw, vy(0), C.grid);
        g.beginPath();
        for (let q = 1; q <= QM; q++) { const px = qx(q), py = vy(cep[q]); q > 1 ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = P.method === 'cep' ? col : 'rgba(216,221,230,0.5)'; g.lineWidth = 1.5; g.stroke();
        D.line(g, qx(SR / f0), cy + ch - 10, qx(SR / f0), cy + ch, '#fff', 3);
        if (P.method === 'cep') D.circle(g, qx(SR / det), vy(cep[Math.round(SR / det)]), 4, null, '#fff', 2);
        for (let ms = 0; ms <= 15; ms += 5) D.text(g, ms + 'ms', qx(ms * SR / 1000), cy + ch + 1, { size: 9, color: C.dim, align: ms ? 'center' : 'left' });
        D.text(g, Lg('켑스트럼 (가로 = 큐프렌시, 밝은 구간 = 80~400Hz 탐색 범위, 흰 눈금 = 실제 주기)', 'Cepstrum (x = quefrency, light band = 80 to 400 Hz search, white tick = real period)'), pad + 4, cy + 3, { size: 10, color: C.dim });
        const cents = 1200 * Math.log2(det / f0), ratio = det / f0;
        ctx.stat(Lg('실제 음 높이', 'Real pitch'), f0.toFixed(1) + ' Hz');
        ctx.stat(Lg('검출', 'Detected'), det.toFixed(1) + ' Hz');
        ctx.stat(Lg('오차', 'Error'), Math.abs(cents) < 50 ? cents.toFixed(1) + Lg('센트', ' cents') : Lg(`${ratio.toFixed(2)}배 (틀림)`, `${ratio.toFixed(2)}x (wrong)`));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
