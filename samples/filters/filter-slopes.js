// 필터 기울기: 1차(6dB/oct)부터 8차(48dB/oct)까지 버터워스 섹션을 이어 붙여 비교
GTL.register({
  id: 'filter-slopes',
  title: '필터 기울기 (6~48dB/oct)',
  summary: '필터 차수를 하나 올릴 때마다 컷오프 위의 감쇠가 옥타브당 6dB씩 가팔라짐. 고차 필터는 2차 섹션(바이쿼드)을 이어 붙여 만들고, 섹션마다 Q를 다르게 줘야 컷오프가 처지지 않음.',
  views: { a: '12dB/oct (2차)', b: '48dB/oct (8차)' },
  info: `
    <p><b>기울기(Slope)</b>는 컷오프 바깥에서 한 옥타브마다 몇 dB 줄어드는지. 1차 필터는 6dB/oct, 2차는 12dB/oct, n차는 6n dB/oct.</p>
    <p>고차 필터는 바이쿼드(2차)를 직렬로 이어 붙여 만듦. 홀수 차수면 1차 섹션을 하나 더함. 이때 모든 섹션에 Q 0.707을 주면 컷오프에서 감쇠가 겹쳐 -3dB가 아니라 -6dB, -12dB로 처짐.</p>
    <ul>
      <li><b>버터워스(Butterworth) 설계</b>: 섹션마다 <code>Q = 1 / (2 cos((2k-1)π / 2N))</code>. 통과 대역이 가장 평평하고 컷오프에서 정확히 -3dB.</li>
      <li><b>같은 Q 반복</b>: 계산은 쉽지만 컷오프 근처가 둥글게 처짐</li>
      <li>가파를수록 컷오프 근처의 위상 회전과 울림이 커짐. 믹싱에서는 12~24dB/oct를 많이 씀.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="18" class="t-small t-dim">${L('8차 버터워스 = 바이쿼드 4개 직렬', '8th order Butterworth = 4 biquads in series')}</text>
    <line x1="10" y1="50" x2="40" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="42" y="34" width="96" height="32" class="f-dim"/><text x="90" y="54" text-anchor="middle" class="t-small">Q 0.510</text>
    <line x1="138" y1="50" x2="160" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="162" y="34" width="96" height="32" class="f-dim"/><text x="210" y="54" text-anchor="middle" class="t-small">Q 0.601</text>
    <line x1="258" y1="50" x2="280" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="282" y="34" width="96" height="32" class="f-dim"/><text x="330" y="54" text-anchor="middle" class="t-small">Q 0.900</text>
    <line x1="378" y1="50" x2="400" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="402" y="34" width="96" height="32" class="f-dim"/><text x="450" y="54" text-anchor="middle" class="t-small">Q 2.563</text>
    <line x1="498" y1="50" x2="530" y2="50" class="d-line" marker-end="url(#arr)"/>
    <line x1="40" y1="150" x2="520" y2="150" class="d-dim"/>
    <line x1="270" y1="80" x2="270" y2="155" class="d-dim" stroke-dasharray="3 3"/>
    <text x="270" y="166" text-anchor="middle" class="t-small t-dim">${L('컷오프', 'cutoff')}</text>
    <path d="M40,90 L250,90 Q270,92 290,100 L520,140" class="d-dim"/>
    <path d="M40,90 L255,90 Q270,92 285,115 L330,150" class="d-a"/>
    <path d="M40,90 L262,90 Q272,94 280,130 L292,150" class="d-b"/>
    <text x="440" y="132" class="t-small t-dim">6dB/oct</text>
    <text x="336" y="140" class="t-small t-a">12dB/oct</text>
    <text x="296" y="122" class="t-small t-b">48dB/oct</text>
  </svg>`,
  look: [
    '"1옥타브 바깥" 측정값을 비교하면 A는 약 -12dB, B는 약 -48dB',
    '설계를 "같은 Q 반복"으로 바꾸면 B의 컷오프 지점이 -3dB가 아니라 -12dB까지 처짐',
    '"소리 켜기" 후 화이트 노이즈를 들으면 A는 높은 쉬익 소리가 조금 남고 B는 칼로 자른 듯 사라짐',
    '종류를 하이패스로 바꾸면 같은 기울기가 컷오프 아래쪽에 생김',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '직렬 연결과 버터워스 설계' },
    { type: 'book', title: 'Udo Zölzer, Digital Audio Signal Processing, 2nd ed.', year: 2008, note: '고차 IIR 필터를 2차 섹션으로 나누는 방법' },
    { type: 'article', title: 'Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients"', url: 'https://www.w3.org/TR/audio-eq-cookbook/', note: '각 2차 섹션의 계수' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '버터워스, 고차 필터 구현' },
  ],
  params: [
    { key: 'order', label: '기울기', type: 'select', group: '필터', options: [
      { value: 1, label: '6dB/oct (1차)' }, { value: 2, label: '12dB/oct (2차)' }, { value: 4, label: '24dB/oct (4차)' }, { value: 8, label: '48dB/oct (8차)' },
    ], a: 2, b: 8 },
    { key: 'design', label: '섹션 Q 설계', type: 'select', options: [{ value: 'butter', label: '버터워스' }, { value: 'same', label: '같은 Q 반복 (0.707)' }], default: 'butter', shared: true },
    { key: 'mode', label: '종류', type: 'select', options: [{ value: 'lowpass', label: '로우패스' }, { value: 'highpass', label: '하이패스' }], default: 'lowpass', shared: true },
    { key: 'freq', label: '컷오프 (Hz)', type: 'range', min: 60, max: 10000, step: 10, default: 700, shared: true },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'noise', label: '화이트 노이즈' }, { value: 'saw', label: '톱니파 프레이즈' }], default: 'saw', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Filter Slopes (6 to 48 dB/oct)',
    summary: 'Each extra filter order makes the drop past the cutoff 6 dB per octave steeper. High order filters chain 2nd order sections (biquads), and each section needs its own Q so the corner does not sag.',
    views: { a: '12 dB/oct (2nd order)', b: '48 dB/oct (8th order)' },
    info: `
    <p>The <b>slope</b> is how many dB the level drops per octave outside the cutoff. A 1st order filter gives 6 dB/oct, 2nd order 12 dB/oct, and order n gives 6n dB/oct.</p>
    <p>High order filters chain biquads (2nd order) in series. An odd order adds one 1st order section. If every section uses Q 0.707, the losses add up at the cutoff, so it sags to -6 dB or -12 dB instead of -3 dB.</p>
    <ul>
      <li><b>Butterworth design</b>: each section uses <code>Q = 1 / (2 cos((2k-1)π / 2N))</code>. The passband is as flat as possible and the cutoff is exactly -3 dB.</li>
      <li><b>Same Q repeated</b>: easy to compute, but the corner gets a rounded sag.</li>
      <li>Steeper slopes add more phase shift and ringing near the cutoff. Mixing engineers often use 12 to 24 dB/oct.</li>
    </ul>`,
    look: [
      'Compare the "1 octave outside" stat. A is about -12 dB and B is about -48 dB.',
      'Change the design to "Same Q repeated". B sags to -12 dB at the cutoff instead of -3 dB.',
      'Press "Sound on" and listen to white noise. A keeps a little high hiss, while B cuts it off like a knife.',
      'Switch the type to highpass. The same slopes appear below the cutoff.',
    ],
    refs: ['Series connection and Butterworth design.', 'Splitting high order IIR filters into 2nd order sections.', 'Coefficients for each 2nd order section.', 'Butterworth and high order filter code.'],
    params: {
      order: { label: 'Slope', group: 'Filter', options: { 1: '6 dB/oct (1st order)', 2: '12 dB/oct (2nd order)', 4: '24 dB/oct (4th order)', 8: '48 dB/oct (8th order)' } },
      design: { label: 'Section Q design', options: { butter: 'Butterworth', same: 'Same Q repeated (0.707)' } },
      mode: { label: 'Type', options: { lowpass: 'Lowpass', highpass: 'Highpass' } },
      freq: 'Cutoff (Hz)',
      src: { label: 'Source', group: 'Sound', options: { noise: 'White noise', saw: 'Saw phrase' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 8192;

    // 1차 섹션 (쌍선형 변환). 바이쿼드와 같은 계수 형식
    function onePole(mode, fc, sr) {
      const K = Math.tan(Math.PI * U.clamp(fc, 1, sr * 0.49) / sr), n = 1 / (1 + K);
      const c = mode === 'lowpass' ? { b0: K * n, b1: K * n } : { b0: n, b1: -n };
      return Object.assign(c, { b2: 0, a1: (K - 1) * n, a2: 0 });
    }
    // 차수 order의 섹션 목록
    function design(order, mode, fc, how, sr) {
      const secs = [];
      if (order % 2) secs.push(onePole(mode, fc, sr));
      for (let k = 1; k <= Math.floor(order / 2); k++) {
        const q = how === 'same' ? Math.SQRT1_2 : 1 / (2 * Math.cos((2 * k - 1) * Math.PI / (2 * order)));
        secs.push(A.biquad(mode, fc, q, 0, sr));
      }
      return secs.map((c) => ({ b0: c.b0, b1: c.b1, b2: c.b2, a1: c.a1, a2: c.a2, x1: 0, x2: 0, y1: 0, y2: 0 }));
    }
    const respDb = (secs, f, sr) => secs.reduce((s, c) => s + A.biquadResponse(c, f, sr).db, 0);
    function run(secs, x) {
      for (const c of secs) {
        const y = c.b0 * x + c.b1 * c.x1 + c.b2 * c.x2 - c.a1 * c.y1 - c.a2 * c.y2;
        c.x2 = c.x1; c.x1 = x; c.y2 = c.y1; c.y1 = y; x = y;
      }
      return x;
    }
    function makeSource(seed) {
      const r = U.rng(seed); let ph = 0, t = 0;
      const notes = [40, 47, 52, 55, 59, 55, 52, 47];
      return (sr) => {
        if (P.src === 'noise') return r.range(-1, 1) * 0.35;
        const pos = t * 4, step = Math.floor(pos), local = pos - step;
        const f = A.mtof(notes[step % notes.length]), dt = f / sr;
        const v = 2 * ph - 1 - A.polyBlep(ph, dt);
        ph += dt; if (ph >= 1) ph -= 1; t += 1 / sr;
        return v * Math.min(1, local * 80) * (1 - 0.5 * local) * 0.4;
      };
    }

    // 실시간: 설계가 바뀌면 섹션을 새로 만들고, 컷오프만 바뀌면 계수만 갈아 끼움
    const live = { src: makeSource(5), f: P.freq, key: '', secs: [] };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(30, sr / 64);
        for (let i = 0; i < n; i++) {
          if ((i & 63) === 0) {
            live.f += (P.freq - live.f) * k;
            const ks = P.order + P.mode + P.design;
            const ns = design(+P.order, P.mode, live.f, P.design, sr);
            if (ks !== live.key) { live.secs = ns; live.key = ks; }
            else ns.forEach((c, j) => Object.assign(live.secs[j], { b0: c.b0, b1: c.b1, b2: c.b2, a1: c.a1, a2: c.a2 }));
          }
          const y = run(live.secs, live.src(sr));
          l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', secs = null, all = null, inMag = null, outMag = null;
    function analyze() {
      const k = [P.order, P.design, P.mode, P.freq, P.src].join();
      if (k === key) return;
      key = k;
      secs = design(+P.order, P.mode, P.freq, P.design, SR);
      all = [1, 2, 4, 8].map((o) => design(o, P.mode, P.freq, P.design, SR));
      const src = makeSource(5), work = design(+P.order, P.mode, P.freq, P.design, SR);
      const x = new Float32Array(N), y = new Float32Array(N);
      for (let i = 0; i < N; i++) { x[i] = src(SR); y[i] = run(work, x[i]); }
      inMag = A.spectrum(x, N, { window: 'blackman' }); outMag = A.spectrum(y, N, { window: 'blackman' });
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, rw = W - pad * 2;
        const rh = Math.max(60, (H - pad * 3) * 0.58);
        const o = { minDb: -72, maxDb: 6, dbStep: 12 };
        A.drawResponse(g, () => -999, pad, pad, rw, rh, { ...o, color: 'transparent', label: L('크기 응답 (회색 = 다른 기울기)', 'Magnitude (gray = other slopes)') });
        all.forEach((s, i) => { if ([1, 2, 4, 8][i] !== +P.order) A.drawResponse(g, (f) => respDb(s, f, SR), pad, pad, rw, rh, { ...o, background: false, grid: false, color: 'rgba(200,200,200,0.25)', lineWidth: 1 }); });
        A.drawResponse(g, (f) => respDb(secs, f, SR), pad, pad, rw, rh, { ...o, background: false, grid: false, color: col });
        const fx = A.freqX(P.freq, pad, rw, 20, 20000);
        D.line(g, fx, pad, fx, pad + rh, C.warn, 1);
        const y3 = pad + rh * (1 - (-3 - o.minDb) / (o.maxDb - o.minDb));
        g.setLineDash([3, 3]); D.line(g, pad, y3, pad + rw, y3, C.dim, 1); g.setLineDash([]);
        D.text(g, '-3 dB', pad + rw - 34, y3 + 2, { size: 9, color: C.dim });
        const sy = pad * 2 + rh, sh = H - sy - pad;
        A.drawSpectrum(g, inMag, SR, pad, sy, rw, sh, { color: 'rgba(200,200,200,0.3)', minDb: -110, maxDb: 0, lineWidth: 1 });
        A.drawSpectrum(g, outMag, SR, pad, sy, rw, sh, { color: col, minDb: -110, maxDb: 0, background: false, grid: false, label: L('스펙트럼: 회색 = 원본, 색 = 출력', 'Spectrum: gray = source, color = output') });
        const far = (m) => (P.mode === 'lowpass' ? Math.min(23000, P.freq * m) : P.freq / m);
        ctx.stat(L('컷오프에서', 'At cutoff'), respDb(secs, P.freq, SR).toFixed(1) + ' dB');
        ctx.stat(L('1옥타브 바깥', '1 octave outside'), respDb(secs, far(2), SR).toFixed(1) + ' dB');
        ctx.stat(L('2옥타브 바깥', '2 octaves outside'), respDb(secs, far(4), SR).toFixed(1) + ' dB');
        ctx.stat(L('섹션 수', 'Sections'), secs.length);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
