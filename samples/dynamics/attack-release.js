// 어택과 릴리스: 빠른 어택은 드럼의 타격감(트랜지언트)을 깎고, 짧은 릴리스는 펌핑과 일그러짐을 만듦
GTL.register({
  id: 'attack-release',
  title: '어택과 릴리스 (트랜지언트와 펌핑)',
  summary: '같은 스레숄드와 레이쇼라도 어택과 릴리스에 따라 소리가 크게 달라짐. A는 어택 0.3 ms, 릴리스 30 ms라 드럼의 첫 타격이 깎이고 소리가 출렁임. B는 어택 20 ms, 릴리스 250 ms라 타격이 살아 있음.',
  views: { a: '빠른 어택, 짧은 릴리스', b: '느린 어택, 긴 릴리스' },
  controls: '파라미터 표에서 어택과 릴리스를 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>어택(Attack)</b>은 신호가 스레숄드를 넘은 뒤 게인 리덕션이 목표값에 다가가는 시간. <b>릴리스(Release)</b>는 신호가 내려간 뒤 게인이 원래대로 돌아오는 시간.</p>
    <p>드럼 소리의 첫 몇 ms(트랜지언트)가 타격감을 만듦. 어택이 이보다 짧으면 컴프레서가 트랜지언트를 바로 눌러 소리가 뭉툭해짐. 어택을 10~30 ms로 늘리면 트랜지언트가 지나간 뒤에 압축이 걸려 오히려 타격이 강조됨.</p>
    <ul>
      <li><b>릴리스가 너무 짧음</b>: 게인이 파형 한 주기 안에서도 움직여 저음이 일그러짐. 박자마다 소리가 출렁이는 펌핑(Pumping)도 생김.</li>
      <li><b>릴리스가 너무 김</b>: 다음 타격까지 게인이 돌아오지 못해 계속 눌린 상태가 됨</li>
      <li>보통 릴리스를 곡의 박자에 맞춰 다음 타격 직전에 돌아오게 맞춤</li>
    </ul>
    <p>이 샘플의 시간 상수는 "목표의 63%에 도달하는 시간"(원폴 필터의 시정수). 제품마다 10%~90% 시간 등 정의가 달라 같은 숫자라도 동작이 다를 수 있음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('입력 레벨과 게인', 'Input level and gain')}</text>
    <path d="M40,150 L90,150 L92,40 L130,90 L200,120 L260,140 L300,150 L520,150" class="d-dim"/>
    <text x="100" y="38" class="t-small">${L('트랜지언트', 'transient')}</text>
    <line x1="40" y1="100" x2="520" y2="100" class="d-dim" stroke-dasharray="3 3"/>
    <text x="520" y="96" text-anchor="end" class="t-small t-dim">${L('스레숄드', 'threshold')}</text>
    <path d="M40,60 L90,60 L94,110 L160,112 L200,90 L240,70 L520,60" class="d-a"/>
    <path d="M40,60 L110,60 L150,92 L200,100 L300,90 L420,66 L520,60" class="d-b"/>
    <text x="96" y="128" class="t-small t-a">${L('A: 즉시 눌림 (타격 깎임)', 'A: clamps at once (hit is cut)')}</text>
    <text x="300" y="112" class="t-small t-b">${L('B: 타격을 지나 보내고 천천히 눌림', 'B: lets the hit through, then reduces')}</text>
    <text x="250" y="60" class="t-small t-a">${L('A: 빨리 돌아옴 (펌핑)', 'A: returns fast (pumping)')}</text>
    <text x="40" y="172" class="t-small">${L('위 = 게인 1 (줄이지 않음), 아래로 갈수록 많이 줄임', 'Top = gain 1 (no reduction). Lower = more reduction.')}</text>
  </svg>`,
  look: [
    '가운데 확대 파형에서 A는 킥의 첫 봉우리가 바로 잘려 작아짐. B는 첫 봉우리가 입력과 거의 같음.',
    '"펀치 (피크 - RMS)" 측정값을 비교하면 B가 A보다 몇 dB 큼',
    'A의 게인 리덕션 선은 타격마다 위아래로 크게 출렁임. 소리를 켜면 킥 저음이 거칠게 들림.',
    'B의 릴리스를 1000 ms로 늘리면 게인 리덕션이 다음 타격 전까지 돌아오지 못하고 계속 눌린 상태가 됨',
    'A의 어택을 20 ms로 올리면 첫 봉우리가 되살아남',
  ],
  refs: [
    { type: 'paper', title: 'Giannoulis, Massberg, Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '어택, 릴리스 검출기 구조(분기 방식)와 시정수 정의' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '레벨 검출과 게인 스무딩' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '어택과 릴리스가 트랜지언트와 펌핑에 주는 영향' },
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '믹싱에서 어택, 릴리스를 정하는 실전 방법' },
  ],
  params: [
    { key: 'attack', label: '어택 (ms)', type: 'range', min: 0.1, max: 60, step: 0.1, default: 20, a: 0.3, b: 20, group: '시간 상수' },
    { key: 'release', label: '릴리스 (ms)', type: 'range', min: 10, max: 1200, step: 5, default: 250, a: 30, b: 250 },
    { key: 'threshold', label: '스레숄드 (dB)', type: 'range', min: -40, max: 0, step: 1, default: -26, shared: true, group: '컴프레서' },
    { key: 'ratio', label: '레이쇼 (R:1)', type: 'range', min: 1, max: 20, step: 0.5, default: 6, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Attack and Release (Transients and Pumping)',
    summary: 'With the same threshold and ratio, attack and release change the sound a lot. A uses 0.3 ms attack and 30 ms release, so the first hit of each drum is cut and the sound wobbles. B uses 20 ms attack and 250 ms release, so the hits stay punchy.',
    views: { a: 'Fast attack, short release', b: 'Slow attack, long release' },
    controls: 'Change attack and release in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p><b>Attack</b> is how long gain reduction takes to reach its target after the signal goes over the threshold. <b>Release</b> is how long the gain takes to come back after the signal falls.</p>
    <p>The first few ms of a drum (the transient) give it punch. If the attack is shorter than that, the compressor clamps the transient and the drum sounds dull. With 10 to 30 ms attack, compression starts after the transient, so the hit is actually emphasized.</p>
    <ul>
      <li><b>Release too short</b>: the gain moves within a single cycle of the wave and distorts the low end. The level also wobbles on every beat (pumping).</li>
      <li><b>Release too long</b>: the gain does not recover before the next hit, so the signal stays pushed down.</li>
      <li>A common approach is to set release so the gain recovers just before the next hit.</li>
    </ul>
    <p>Time constants here are "time to reach 63% of the target" (one-pole time constant). Products define them differently (for example 10% to 90%), so the same number can behave differently.</p>`,
    look: [
      'In the zoomed waveform in the middle, A cuts the first peak of the kick right away. B keeps it almost equal to the input.',
      'Compare the "Punch (peak - RMS)" stat. B is several dB higher than A.',
      'A\'s gain reduction line swings up and down on every hit. With sound on, the kick\'s low end sounds rough.',
      'Raise B\'s release to 1000 ms. Gain reduction does not recover before the next hit and stays pushed down.',
      'Raise A\'s attack to 20 ms. The first peak comes back.',
    ],
    refs: ['Attack and release detector structure (branching) and time constant definition.', 'Level detection and gain smoothing.', 'How attack and release affect transients and pumping.', 'Practical ways to set attack and release in a mix.'],
    params: {
      attack: { label: 'Attack (ms)', group: 'Time constants' },
      release: 'Release (ms)',
      threshold: { label: 'Threshold (dB)', group: 'Compressor' },
      ratio: 'Ratio (R:1)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, BPM = 100;

    // 합성 드럼 루프 2마디 (킥, 스네어, 하이햇)
    function makeSource(sr) {
      const beat = 60 / BPM, n = Math.round(beat * 8 * sr), out = new Float32Array(n);
      const nz = A.noiseBuffer(sr, 5);
      const add = (t0, dur, fn) => { const i0 = Math.round(t0 * sr), m = Math.min(n - i0, Math.round(dur * sr)); for (let i = 0; i < m; i++) out[i0 + i] += fn(i / sr, i); };
      const kick = (tt) => 0.5 * Math.sin(2 * Math.PI * (48 * tt + 140 * (1 - Math.exp(-tt * 35)) / 35)) * Math.exp(-tt * 6);
      const snare = (tt, i) => 0.3 * nz[i % nz.length] * Math.exp(-tt * 16) + 0.25 * Math.sin(2 * Math.PI * 185 * tt) * Math.exp(-tt * 22);
      const hat = (tt, i) => 0.1 * (nz[(i * 3 + 17) % nz.length] - nz[(i * 3 + 16) % nz.length]) * Math.exp(-tt * 60);
      const pat = 'K.h.S.h.K.K.S.h.K.h.S.h.K.hKS.hh';
      for (let s = 0; s < 32; s++) {
        const t = s * beat / 4, c = pat[s];
        if (c === 'K') add(t, 0.5, kick);
        if (c === 'S') add(t, 0.35, snare);
        if (c === 'h' || s % 2 === 0) add(t, 0.07, hat);
      }
      return out;
    }
    const gc = (x, T, R) => (x > T ? T + (x - T) / R : x);
    function coefs(sr) { return { aC: Math.exp(-1 / (P.attack * 0.001 * sr)), rC: Math.exp(-1 / (P.release * 0.001 * sr)), T: P.threshold, R: P.ratio }; }
    function step(st, x, k) {
      const xd = A.linToDb(x), xl = xd - gc(xd, k.T, k.R);
      st.gr = xl > st.gr ? k.aC * st.gr + (1 - k.aC) * xl : k.rC * st.gr + (1 - k.rC) * xl;
      return x * A.dbToLin(-st.gr);
    }

    // 그리기 캐시
    const COLS = 480;
    function decim(arr) {
      const lo = new Float32Array(COLS), hi = new Float32Array(COLS), n = arr.length;
      for (let c = 0; c < COLS; c++) {
        let a = Infinity, b = -Infinity;
        for (let i = Math.floor(c * n / COLS), e = Math.floor((c + 1) * n / COLS); i < e; i++) { const v = arr[i]; if (v < a) a = v; if (v > b) b = v; }
        lo[c] = a; hi[c] = b;
      }
      return { lo, hi };
    }
    function drawBand(g, d, x, y, w, h, color, amp) {
      const mid = y + h / 2, cw = w / COLS;
      g.beginPath();
      for (let c = 0; c < COLS; c++) { const px = x + (c + 0.5) * cw; g.moveTo(px, mid - U.clamp(d.hi[c] * amp, -1, 1) * h / 2); g.lineTo(px, mid - U.clamp(d.lo[c] * amp, -1, 1) * h / 2 + 0.5); }
      g.strokeStyle = color; g.lineWidth = Math.max(1, cw); g.stroke();
    }
    function plotCols(g, vals, x, y, w, h, lo, hi, color, invert) {
      g.beginPath();
      for (let c = 0; c < vals.length; c++) {
        const v = U.clamp((vals[c] - lo) / (hi - lo), 0, 1), px = x + (c + 0.5) * w / vals.length, py = invert ? y + v * h : y + h - v * h;
        c ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.strokeStyle = color; g.lineWidth = 1.5; g.stroke();
    }

    const src = makeSource(SR), N = src.length, srcD = decim(src);
    // 확대 구간: 첫 킥 + 0.3초
    const Z0 = 0, ZN = Math.round(0.3 * SR);
    let key = '', out, grArr, outD, grD, st;
    function analyze() {
      const k = [P.attack, P.release, P.threshold, P.ratio].join();
      if (k === key) return;
      key = k;
      const s = { gr: 0 }, cf = coefs(SR);
      // 루프를 한 번 미리 돌려 정상 상태에서 시작
      for (let i = 0; i < N; i++) step(s, src[i], cf);
      out = new Float32Array(N); grArr = new Float32Array(N);
      for (let i = 0; i < N; i++) { out[i] = step(s, src[i], cf); grArr[i] = s.gr; }
      outD = decim(out); grD = decim(grArr).hi;
      const pk = A.linToDb(A.peak(out)), rm = A.linToDb(A.rms(out));
      let sum = 0; for (let i = 0; i < N; i++) sum += grArr[i];
      st = { punch: pk - rm, punchIn: A.linToDb(A.peak(src)) - A.linToDb(A.rms(src)), avgGr: sum / N, maxGr: A.peak(grArr), peak: pk };
    }

    let live = { gr: 0 }, liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = { gr: 0 }; }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc[pos], cf) * 1.3;
          pos = (pos + 1) % liveSrc.length;
          l[i] = y; r[i] = y;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = (H - pad * 4) * 0.42, h3 = H - pad * 4 - h1 - h2;
        // 전체 루프 파형
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        drawBand(g, srcD, pad, pad, iw, h1, 'rgba(160,170,190,0.35)', 1.6);
        drawBand(g, outD, pad, pad, iw, h1, col, 1.6);
        D.text(g, GTL.L('2마디 루프 (회색 = 입력, 색 = 출력)', '2 bar loop (gray = input, color = output)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        D.rect(g, pad, pad, iw * ZN / N, h1, null, C.dim);
        // 확대: 첫 킥 300 ms
        const y2 = pad * 2 + h1;
        A.drawWave(g, src, pad, y2, iw, h2, { from: Z0, count: ZN, color: 'rgba(160,170,190,0.5)', amp: 1.6 });
        A.drawWave(g, out, pad, y2, iw, h2, { from: Z0, count: ZN, color: col, amp: 1.6, background: false, axis: false });
        // 게인 곡선 겹쳐 그림 (위 = 0 dB)
        g.beginPath();
        for (let c = 0; c <= 200; c++) { const i = Z0 + Math.floor(c * (ZN - 1) / 200), py = y2 + U.clamp(grArr[i] / 24, 0, 1) * h2; c ? g.lineTo(pad + c * iw / 200, py) : g.moveTo(pad + c * iw / 200, py); }
        g.strokeStyle = C.warn; g.lineWidth = 1.5; g.stroke();
        D.text(g, GTL.L('확대: 첫 킥 300 ms (노란 선 = 게인, 위가 0 dB)', 'Zoom: first kick, 300 ms (yellow = gain, top is 0 dB)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 게인 리덕션 전체
        const y3 = y2 + h2 + pad;
        D.rect(g, pad, y3, iw, h3, 'rgba(0,0,0,0.35)');
        for (let db = 6; db < 24; db += 6) { const py = y3 + db / 24 * h3; D.line(g, pad, py, pad + iw, py, C.grid); D.text(g, '-' + db, pad + 2, py - 10, { size: 9, color: C.dim }); }
        plotCols(g, grD, pad, y3, iw, h3, 0, 24, col, true);
        D.text(g, GTL.L('게인 리덕션 (dB)', 'Gain reduction (dB)'), pad + 30, y3 + 3, { size: 10, color: C.dim });
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.length; D.line(g, px, pad, px, pad + h1, C.text); D.line(g, px, y3, px, y3 + h3, C.text); }

        ctx.stat(GTL.L('어택, 릴리스', 'Attack, release'), `${P.attack} ms, ${P.release} ms`);
        ctx.stat(GTL.L('펀치 (피크 - RMS)', 'Punch (peak - RMS)'), `${st.punchIn.toFixed(1)} → ${st.punch.toFixed(1)} dB`);
        ctx.stat(GTL.L('평균 게인 리덕션', 'Average gain reduction'), st.avgGr.toFixed(1) + ' dB');
        ctx.stat(GTL.L('최대 게인 리덕션', 'Max gain reduction'), st.maxGr.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
