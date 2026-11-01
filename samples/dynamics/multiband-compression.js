// 멀티밴드 컴프레션: 저음이 걸어 놓은 게인 리덕션이 하이햇까지 끌어내리는 문제를 대역을 나눠 해결
GTL.register({
  id: 'multiband-compression',
  title: '멀티밴드 컴프레션 (싱글 vs 3밴드)',
  summary: '컴프레서 하나로 믹스 전체를 누르면 큰 킥과 베이스가 걸어 놓은 게인 리덕션이 하이햇과 리드까지 함께 끌어내림. A는 싱글 밴드라 하이햇이 킥마다 출렁임. B는 3밴드로 나눠 저음만 누르고 중고음은 그대로 둠.',
  views: { a: '싱글 밴드', b: '3밴드' },
  controls: '파라미터 표에서 크로스오버 주파수와 스레숄드를 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>멀티밴드 컴프레서</b>는 신호를 크로스오버 필터로 저음, 중음, 고음 대역으로 나누고, 대역마다 따로 압축한 뒤 다시 합침</p>
    <p>믹스 에너지의 대부분은 저음에 있음. 싱글 밴드 컴프레서는 레벨 검출을 저음이 좌우하므로 킥이 칠 때마다 하이햇, 보컬도 같이 내려감. 이런 의도하지 않은 펌핑을 멀티밴드가 막음.</p>
    <ul>
      <li><b>크로스오버</b>: 이 샘플은 Linkwitz-Riley 4차(LR4) 필터를 씀. 로우패스와 하이패스의 합이 크기 평탄(올패스)이라서 압축이 없으면 원래 소리와 크기가 같음.</li>
      <li>저역 대역에는 위 크로스오버와 같은 올패스를 걸어 세 대역의 위상을 맞춤</li>
      <li>단점: 대역 경계에서 압축량이 달라 음색이 바뀔 수 있음. 파라미터가 많아 맞추기 어려움.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="66" width="60" height="28" class="f-dim"/><text x="40" y="84" text-anchor="middle" class="t-small">${L('입력', 'Input')}</text>
    <rect x="110" y="66" width="90" height="28" class="f-dim"/><text x="155" y="84" text-anchor="middle" class="t-small">${L('LR4 분할', 'LR4 split')}</text>
    <path d="M70,80 L108,80" class="d-accent" marker-end="url(#arr)"/>
    <rect x="250" y="16" width="120" height="28" class="f-dim"/><text x="310" y="34" text-anchor="middle" class="t-small">${L('저음 컴프레서', 'Low compressor')}</text>
    <rect x="250" y="66" width="120" height="28" class="f-dim"/><text x="310" y="84" text-anchor="middle" class="t-small">${L('중음 컴프레서', 'Mid compressor')}</text>
    <rect x="250" y="116" width="120" height="28" class="f-dim"/><text x="310" y="134" text-anchor="middle" class="t-small">${L('고음 컴프레서', 'High compressor')}</text>
    <path d="M200,80 L225,80 L225,30 L248,30" class="d-accent" marker-end="url(#arr)"/><path d="M200,80 L248,80" class="d-accent" marker-end="url(#arr)"/><path d="M225,80 L225,130 L248,130" class="d-accent" marker-end="url(#arr)"/>
    <circle cx="430" cy="80" r="13" class="f-dim"/><text x="430" y="85" text-anchor="middle">+</text>
    <path d="M370,30 L430,30 L430,65" class="d-accent" marker-end="url(#arr)"/><path d="M370,80 L415,80" class="d-accent" marker-end="url(#arr)"/><path d="M370,130 L430,130 L430,95" class="d-accent" marker-end="url(#arr)"/>
    <path d="M443,80 L478,80" class="d-accent" marker-end="url(#arr)"/><text x="482" y="84" class="t-small">${L('출력', 'Output')}</text>
    <text x="10" y="164" class="t-small t-dim">${L('대역마다 검출과 게인이 따로라서 킥은 저음 대역만 누름', 'Each band has its own detector and gain, so the kick only pushes down the low band')}</text>
  </svg>`,
  look: [
    '가운데 그래프에서 A는 게인 리덕션 선 하나가 킥마다 크게 내려감. B는 저음(빨강)만 내려가고 고음(파랑)은 거의 0.',
    '아래 그래프의 하이햇 레벨은 A에서 킥마다 움푹 꺼짐. B는 고르게 유지됨.',
    '"고음 대역 최대 GR"이 A는 12 dB 안팎, B는 1 dB 아래',
    '방식을 3밴드로 두고 스레숄드를 -40 dB로 내리면 B도 중음과 고음이 압축되기 시작함',
  ],
  refs: [
    { type: 'paper', title: 'Linkwitz, "Active Crossover Networks for Noncoincident Drivers", JAES 24(1)', year: 1976, note: 'Linkwitz-Riley 크로스오버' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '필터 뱅크와 다이내믹 처리' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '마스터링에서 멀티밴드 컴프레서 쓰임과 주의점' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: 'LR 크로스오버와 멀티밴드 다이내믹 구현' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'single', label: '싱글 밴드' }, { value: 'multi', label: '3밴드' }], default: 'multi', a: 'single', b: 'multi', group: '컴프레서' },
    { key: 'threshold', label: '스레숄드 (dB)', type: 'range', min: -48, max: 0, step: 1, default: -20, shared: true },
    { key: 'ratio', label: '레이쇼 (R:1)', type: 'range', min: 1, max: 20, step: 0.5, default: 6, shared: true },
    { key: 'xLow', label: '저음/중음 경계 (Hz)', type: 'range', min: 80, max: 500, step: 5, default: 200, shared: true, group: '크로스오버' },
    { key: 'xHigh', label: '중음/고음 경계 (Hz)', type: 'range', min: 1000, max: 8000, step: 50, default: 3000, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Multiband Compression (Single vs 3 Band)',
    summary: 'If one compressor handles the whole mix, the gain reduction caused by a big kick and bass also pulls down the hi-hats and lead. A is single band, so the hi-hats wobble on every kick. B splits into 3 bands, compresses only the lows, and leaves mids and highs alone.',
    views: { a: 'Single band', b: '3 band' },
    controls: 'Change the crossover frequencies and threshold in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>A <b>multiband compressor</b> splits the signal into low, mid and high bands with crossover filters. It compresses each band on its own, then sums them back.</p>
    <p>Most of the energy in a mix is in the lows. In a single band compressor the lows control the detector, so hi-hats and vocals go down on every kick. Multiband prevents this unwanted pumping.</p>
    <ul>
      <li><b>Crossover</b>: this sample uses 4th order Linkwitz-Riley (LR4) filters. The low pass and high pass sum to a flat magnitude (an allpass), so with no compression the level matches the original.</li>
      <li>The low band also goes through the allpass of the upper crossover, so all three bands stay in phase.</li>
      <li>Downsides: different amounts of compression near band edges can change the tone. There are many parameters to set.</li>
    </ul>`,
    look: [
      'In the middle graph, A has one gain reduction line that dips a lot on every kick. In B only the low band (red) dips and the high band (blue) stays near 0.',
      'In the bottom graph, the hi-hat level in A dips on every kick. In B it stays even.',
      '"Max GR on high band" is about 12 dB in A and below 1 dB in B.',
      'Keep 3 band mode and lower the threshold to -40 dB. B starts to compress the mids and highs too.',
    ],
    refs: ['Linkwitz-Riley crossover.', 'Filter banks and dynamics processing.', 'Using multiband compressors in mastering, and pitfalls.', 'LR crossover and multiband dynamics code.'],
    params: {
      mode: { label: 'Method', group: 'Compressor', options: { single: 'Single band', multi: '3 band' } },
      threshold: 'Threshold (dB)',
      ratio: 'Ratio (R:1)',
      xLow: { label: 'Low/mid edge (Hz)', group: 'Crossover' },
      xHigh: 'Mid/high edge (Hz)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, BPM = 120, Q = Math.SQRT1_2;
    const bandCol = ['#ff6b6b', '#ffd166', '#4fc3f7'];

    // 킥 + 베이스(저음), 리드(중음), 하이햇 16분음표(고음). 1마디
    function makeSource(sr) {
      const beat = 60 / BPM, n = Math.round(beat * 4 * sr), out = new Float32Array(n), nz = A.noiseBuffer(sr, 4);
      const hp = A.biquad('highpass', 7000, 0.7, 0, sr);
      for (let i = 0; i < n; i++) {
        const t = i / sr, tb = t % beat, t16 = t % (beat / 4);
        let v = 0.6 * Math.sin(2 * Math.PI * (45 * tb + 150 * (1 - Math.exp(-tb * 30)) / 30)) * Math.exp(-tb * 6);
        v += 0.15 * Math.sin(2 * Math.PI * 55 * t);
        const fl = A.mtof(69 + (Math.floor(t / beat) % 2) * 3);
        v += 0.05 * (2 * ((fl * t) % 1) - 1) * (0.8 + 0.2 * Math.sin(2 * Math.PI * 5 * t));
        v += 0.2 * hp.process(nz[i % nz.length]) * Math.exp(-t16 * 50);
        out[i] = v;
      }
      return out;
    }
    // LR4 = 2차 버터워스 두 번
    function lr4(type, f, sr) { const a = A.biquad(type, f, Q, 0, sr), b = A.biquad(type, f, Q, 0, sr); return { p: (x) => b.process(a.process(x)), a, b }; }
    function newSt(sr) {
      return { sr, f1: P.xLow, f2: P.xHigh, lp1: lr4('lowpass', P.xLow, sr), hp1: lr4('highpass', P.xLow, sr), lp2: lr4('lowpass', P.xHigh, sr), hp2: lr4('highpass', P.xHigh, sr), ap: A.biquad('allpass', P.xHigh, Q, 0, sr), gr: [0, 0, 0], grS: 0 };
    }
    function coefs(sr) { return { aC: Math.exp(-1 / (0.003 * sr)), rC: Math.exp(-1 / (0.15 * sr)), T: P.threshold, R: P.ratio, multi: P.mode === 'multi' }; }
    const gcGr = (x, T, R) => (x > T ? (x - T) * (1 - 1 / R) : 0);
    const smooth = (g, want, k) => (want > g ? k.aC * g + (1 - k.aC) * want : k.rC * g + (1 - k.rC) * want);
    // 반환: 출력. st.band: 처리 전 대역 값, st.gains: 대역 게인
    function step(st, x, k) {
      const lo = st.ap.process(st.lp1.p(x)), rest = st.hp1.p(x), mi = st.lp2.p(rest), hi = st.hp2.p(rest);
      st.band = [lo, mi, hi];
      if (k.multi) {
        let y = 0;
        for (let b = 0; b < 3; b++) { st.gr[b] = smooth(st.gr[b], gcGr(A.linToDb(st.band[b]), k.T, k.R), k); y += st.band[b] * A.dbToLin(-st.gr[b]); }
        return y;
      }
      st.grS = smooth(st.grS, gcGr(A.linToDb(x), k.T, k.R), k);
      st.gr[0] = st.gr[1] = st.gr[2] = st.grS;
      return (lo + mi + hi) * A.dbToLin(-st.grS);
    }

    const src = makeSource(SR), N = src.length, COLS = 400;
    let key = '', grD, hatD, stats;
    function analyze() {
      const k = [P.mode, P.threshold, P.ratio, P.xLow, P.xHigh].join();
      if (k === key) return;
      key = k;
      const st = newSt(SR), cf = coefs(SR);
      for (let i = 0; i < N; i++) step(st, src[i], cf);
      grD = [0, 1, 2].map(() => new Float32Array(COLS)); hatD = new Float32Array(COLS);
      for (let i = 0; i < N; i++) {
        step(st, src[i], cf);
        const c = Math.floor(i * COLS / N);
        for (let b = 0; b < 3; b++) grD[b][c] = Math.max(grD[b][c], st.gr[b]);
        hatD[c] = Math.max(hatD[c], Math.abs(st.band[2] * A.dbToLin(-st.gr[2])));
      }
      const mx = (arr) => { let m = 0; for (const v of arr) m = Math.max(m, v); return m; };
      stats = { gr: [mx(grD[0]), mx(grD[1]), mx(grD[2])] };
    }

    let live = null, liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = null; }
        if (!live || live.f1 !== P.xLow || live.f2 !== P.xHigh) live = newSt(sr);
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc[pos], cf) * 0.8;
          pos = (pos + 1) % liveSrc.length;
          l[i] = y; r[i] = y;
        }
      },
    });

    // 크로스오버 응답 (그리기용 필터, 파라미터가 바뀔 때만 다시 만듦)
    let rKey = '', rf = null;
    function respFilters() {
      const k = P.xLow + ',' + P.xHigh;
      if (k !== rKey) { rKey = k; rf = { lp1: A.biquad('lowpass', P.xLow, Q, 0, SR), hp1: A.biquad('highpass', P.xLow, Q, 0, SR), lp2: A.biquad('lowpass', P.xHigh, Q, 0, SR), hp2: A.biquad('highpass', P.xHigh, Q, 0, SR) }; }
      return rf;
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = (H - pad * 4) * 0.38, h3 = H - pad * 4 - h1 - h2;
        // 크로스오버 응답
        const f = respFilters(), m2 = (c, fr) => { const r = c.response(fr); return r.mag * r.mag; };
        const bands = [(fr) => m2(f.lp1, fr), (fr) => m2(f.hp1, fr) * m2(f.lp2, fr), (fr) => m2(f.hp1, fr) * m2(f.hp2, fr)];
        A.drawResponse(g, (fr) => A.linToDb(bands[0](fr)), pad, pad, iw, h1, { color: bandCol[0], minDb: -36, maxDb: 6, fmax: 12000 });
        A.drawResponse(g, (fr) => A.linToDb(bands[1](fr)), pad, pad, iw, h1, { color: bandCol[1], minDb: -36, maxDb: 6, fmax: 12000, background: false, grid: false });
        A.drawResponse(g, (fr) => A.linToDb(bands[2](fr)), pad, pad, iw, h1, { color: bandCol[2], minDb: -36, maxDb: 6, fmax: 12000, background: false, grid: false });
        D.text(g, GTL.L('크로스오버 (빨강 = 저음, 노랑 = 중음, 파랑 = 고음)', 'Crossover (red = low, yellow = mid, blue = high)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 대역별 게인 리덕션
        const y2 = pad * 2 + h1, cw = iw / COLS;
        D.rect(g, pad, y2, iw, h2, 'rgba(0,0,0,0.35)');
        for (let db = 6; db < 24; db += 6) { const py = y2 + db / 24 * h2; D.line(g, pad, py, pad + iw, py, C.grid); D.text(g, '-' + db, pad + 2, py - 10, { size: 9, color: C.dim }); }
        const lines = P.mode === 'multi' ? [0, 1, 2] : [0];
        for (const b of lines) {
          g.beginPath();
          for (let c = 0; c < COLS; c++) { const py = y2 + U.clamp(grD[b][c] / 24, 0, 1) * h2; c ? g.lineTo(pad + c * cw, py) : g.moveTo(pad + c * cw, py); }
          g.strokeStyle = P.mode === 'multi' ? bandCol[b] : col; g.lineWidth = 2; g.stroke();
        }
        D.text(g, P.mode === 'multi' ? GTL.L('대역별 게인 리덕션 (dB)', 'Gain reduction per band (dB)') : GTL.L('게인 리덕션 (전체 대역 하나)', 'Gain reduction (one for all bands)'), pad + 30, y2 + 3, { size: 10, color: C.dim });
        // 하이햇 레벨
        const y3 = y2 + h2 + pad;
        D.rect(g, pad, y3, iw, h3, 'rgba(0,0,0,0.35)');
        for (let c = 0; c < COLS; c++) { const v = U.clamp((A.linToDb(hatD[c]) + 40) / 40, 0, 1); D.rect(g, pad + c * cw, y3 + h3 * (1 - v), Math.max(1, cw), h3 * v, col); }
        D.text(g, GTL.L('출력의 고음 대역 (하이햇) 레벨', 'High band (hi-hat) level in the output'), pad + 4, y3 + 3, { size: 10, color: C.dim });
        for (let q = 1; q < 4; q++) D.line(g, pad + iw * q / 4, y2, pad + iw * q / 4, y3 + h3, C.dim);
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.length; D.line(g, px, y2, px, y3 + h3, C.text); }

        ctx.stat(GTL.L('최대 GR (저, 중, 고)', 'Max GR (low, mid, high)'), stats.gr.map((v) => v.toFixed(1)).join(', ') + ' dB');
        ctx.stat(GTL.L('고음 대역 최대 GR', 'Max GR on high band'), stats.gr[2].toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
