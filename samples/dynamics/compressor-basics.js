// 컴프레서 기초: 스레숄드, 레이쇼, 니(knee)가 만드는 전달 곡선과 실제 파형 변화
GTL.register({
  id: 'compressor-basics',
  title: '컴프레서 기초 (스레숄드, 레이쇼, 니)',
  summary: '컴프레서는 스레숄드를 넘은 부분만 레이쇼만큼 줄여 큰 소리와 작은 소리의 차이를 좁힘. A는 압축 없음(1:1), B는 4:1 압축이라 큰 마디와 작은 마디의 차이가 줄어듦.',
  views: { a: '압축 없음 (1:1)', b: '4:1 압축' },
  controls: '파라미터 표에서 스레숄드, 레이쇼, 니를 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>컴프레서(Compressor)</b>는 신호가 정해진 레벨(스레숄드)을 넘으면 넘은 양을 비율(레이쇼)만큼 줄이는 장치. 큰 소리를 눌러 전체 다이내믹 레인지를 좁힘.</p>
    <p>좁아진 만큼 메이크업 게인으로 전체를 올리면 작은 소리가 커진 효과가 남. 그래서 보컬, 베이스처럼 세기가 들쭉날쭉한 소리를 고르게 할 때 씀.</p>
    <ul>
      <li><b>스레숄드(Threshold)</b>: 압축이 시작되는 입력 레벨 (dBFS)</li>
      <li><b>레이쇼(Ratio)</b>: 스레숄드 위에서 입력이 R dB 늘 때 출력은 1 dB만 늘어남. 4:1이면 8 dB 넘은 소리가 2 dB만 넘음.</li>
      <li><b>니(Knee)</b>: 스레숄드 근처에서 1:1과 R:1을 이어 주는 폭. 넓으면(소프트 니) 압축이 서서히 걸려 티가 덜 남.</li>
      <li><b>게인 리덕션(GR)</b>: 입력과 출력의 dB 차이. 미터로 보며 조절하는 핵심 값.</li>
    </ul>
    <p>이 샘플의 게인 계산은 Giannoulis, Massberg, Reiss(2012)의 dB 영역 방식. 레벨 검출은 피크 검출기에 어택 5 ms, 릴리스 120 ms를 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
    <line x1="60" y1="180" x2="250" y2="180" class="d-line"/><line x1="60" y1="180" x2="60" y2="10" class="d-line"/>
    <text x="155" y="196" text-anchor="middle" class="t-small">${L('입력 (dB)', 'Input (dB)')}</text>
    <text x="8" y="100" class="t-small">${L('출력', 'Output')}</text>
    <line x1="60" y1="180" x2="240" y2="20" class="d-a" stroke-dasharray="5 3"/>
    <path d="M60,180 L150,100 L240,80" class="d-b"/>
    <line x1="150" y1="100" x2="150" y2="180" class="d-dim" stroke-dasharray="3 3"/>
    <text x="150" y="172" text-anchor="middle" class="t-small t-dim">${L('스레숄드', 'threshold')}</text>
    <text x="200" y="40" class="t-small t-a">1:1</text>
    <text x="200" y="104" class="t-small t-b">4:1</text>
    <text x="300" y="30">${L('스레숄드 T, 레이쇼 R일 때', 'With threshold T and ratio R')}</text>
    <text x="300" y="56" class="t-mono t-small">${L('x ≤ T: y = x', 'x ≤ T: y = x')}</text>
    <text x="300" y="76" class="t-mono t-small">${L('x > T: y = T + (x - T) / R', 'x > T: y = T + (x - T) / R')}</text>
    <text x="300" y="96" class="t-mono t-small">GR = x - y</text>
    <text x="300" y="130" class="t-small">${L('예: T = -20, R = 4, 입력 -8 dB', 'Example: T = -20, R = 4, input -8 dB')}</text>
    <text x="300" y="150" class="t-small">${L('출력 = -20 + 12 / 4 = -17 dB', 'Output = -20 + 12 / 4 = -17 dB')}</text>
    <text x="300" y="170" class="t-small t-b">${L('GR = 9 dB', 'GR = 9 dB')}</text>
  </svg>`,
  look: [
    '위쪽 파형을 비교하면 A는 큰 마디와 작은 마디의 높이 차이가 크고, B는 차이가 줄어듦',
    'B의 레이쇼를 20:1로 올리면 전달 곡선이 스레숄드 위에서 거의 수평이 되고 리미터처럼 동작함',
    'B의 니를 0 dB로 줄이면 전달 곡선이 스레숄드에서 꺾임. 12 dB로 넓히면 둥글게 이어짐.',
    '"다이내믹 레인지" 측정값을 비교하면 B가 A보다 몇 dB 작음',
    'B의 메이크업 게인을 올리면 작은 마디가 A보다 크게 들림',
  ],
  refs: [
    { type: 'paper', title: 'Giannoulis, Massberg, Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '소프트 니 게인 계산식과 dB 영역 검출기' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Chapter 4 Nonlinear Processing', year: 2011, note: '다이내믹 레인지 제어의 기본 구조' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '컴프레서, 리미터, 게이트 플러그인 구현' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '마스터링에서 압축을 쓰는 기준' },
  ],
  params: [
    { key: 'threshold', label: '스레숄드 (dB)', type: 'range', min: -48, max: 0, step: 1, default: -28, group: '컴프레서' },
    { key: 'ratio', label: '레이쇼 (R:1)', type: 'range', min: 1, max: 20, step: 0.5, default: 4, a: 1, b: 4 },
    { key: 'knee', label: '니 폭 (dB)', type: 'range', min: 0, max: 18, step: 1, default: 6 },
    { key: 'makeup', label: '메이크업 게인 (dB)', type: 'range', min: 0, max: 18, step: 0.5, default: 0, a: 0, b: 6 },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Compressor Basics (Threshold, Ratio, Knee)',
    summary: 'A compressor reduces only the part above the threshold, by the ratio. This narrows the gap between loud and quiet sounds. A has no compression (1:1). B uses 4:1, so loud and quiet bars get closer in level.',
    views: { a: 'No compression (1:1)', b: '4:1 compression' },
    controls: 'Change threshold, ratio and knee in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>A <b>compressor</b> reduces the signal when it goes above a set level (the threshold). It divides the overshoot by a ratio. Loud sounds go down, so the dynamic range gets smaller.</p>
    <p>If you then raise everything with makeup gain, quiet sounds end up louder. This is why compressors even out vocals, bass and other sources with uneven levels.</p>
    <ul>
      <li><b>Threshold</b>: the input level (dBFS) where compression starts.</li>
      <li><b>Ratio</b>: above the threshold, R dB more input gives only 1 dB more output. At 4:1, a sound 8 dB over the threshold comes out only 2 dB over.</li>
      <li><b>Knee</b>: the width that joins 1:1 and R:1 near the threshold. A wide (soft) knee starts compression gradually, so it is less audible.</li>
      <li><b>Gain reduction (GR)</b>: the dB difference between input and output. This is the main value you watch while setting a compressor.</li>
    </ul>
    <p>The gain computer here follows Giannoulis, Massberg and Reiss (2012), working in dB. The level detector is a peak detector with 5 ms attack and 120 ms release.</p>`,
    look: [
      'Compare the top waveforms. In A, loud and quiet bars differ a lot in height. In B, the gap is smaller.',
      'Raise B\'s ratio to 20:1. The transfer curve becomes almost flat above the threshold and acts like a limiter.',
      'Set B\'s knee to 0 dB. The curve bends sharply at the threshold. At 12 dB it joins smoothly.',
      'Compare the "Dynamic range" stat. B is several dB smaller than A.',
      'Raise B\'s makeup gain. The quiet bars sound louder than in A.',
    ],
    refs: ['Soft knee gain computer and dB domain detectors.', 'Basic structure of dynamic range control.', 'Compressor, limiter and gate plugin code.', 'When to use compression in mastering.'],
    params: {
      threshold: { label: 'Threshold (dB)', group: 'Compressor' },
      ratio: 'Ratio (R:1)',
      knee: 'Knee width (dB)',
      makeup: 'Makeup gain (dB)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, BPM = 110;

    // 소스: 드럼 + 베이스. 마디마다 세기가 다름 (작게, 크게, 중간, 아주 크게)
    function makeSource(sr) {
      const beat = 60 / BPM, bar = beat * 4, n = Math.round(bar * 4 * sr), out = new Float32Array(n);
      const vel = [0.25, 1, 0.5, 0.9];
      const nz = A.noiseBuffer(sr, 11);
      const add = (t0, dur, fn) => { const i0 = Math.round(t0 * sr), m = Math.min(n - i0, Math.round(dur * sr)); for (let i = 0; i < m; i++) out[i0 + i] += fn(i / sr, i); };
      const bassNotes = [33, 33, 36, 31];
      for (let b = 0; b < 4; b++) {
        const v = vel[b];
        for (let q = 0; q < 4; q++) {
          const t = b * bar + q * beat;
          if (q % 2 === 0) add(t, 0.4, (tt) => v * 0.55 * Math.sin(2 * Math.PI * (45 * tt + 110 * (1 - Math.exp(-tt * 30)) / 30)) * Math.exp(-tt * 7));
          else add(t, 0.25, (tt, i) => v * (0.3 * nz[i % nz.length] * Math.exp(-tt * 20) + 0.25 * Math.sin(2 * Math.PI * 190 * tt) * Math.exp(-tt * 25)));
          for (let e = 0; e < 2; e++) add(t + e * beat / 2, 0.06, (tt, i) => v * 0.12 * (nz[(i * 7 + 99) % nz.length] - nz[(i * 7 + 98) % nz.length]) * Math.exp(-tt * 70));
        }
        const f = A.mtof(bassNotes[b]);
        add(b * bar, bar, (tt) => { const ph = (f * tt) % 1; return v * 0.14 * (2 * ph - 1) * Math.min(1, tt * 50) * Math.min(1, (bar - tt) * 50); });
      }
      for (let i = 0; i < n; i++) out[i] *= 0.7;
      return out;
    }

    // 소프트 니 게인 계산 (Giannoulis 2012). 입력 dB → 출력 dB
    function gainComputer(x, T, R, W) {
      if (2 * (x - T) < -W) return x;
      if (W > 0 && 2 * Math.abs(x - T) <= W) { const d = x - T + W / 2; return x + (1 / R - 1) * d * d / (2 * W); }
      return T + (x - T) / R;
    }
    function newState() { return { gr: 0 }; }
    function coefs(sr) { return { aC: Math.exp(-1 / (0.005 * sr)), rC: Math.exp(-1 / (0.12 * sr)), T: P.threshold, R: P.ratio, W: P.knee, M: P.makeup }; }
    // 한 샘플 처리. 반환: 출력. st.gr: 현재 게인 리덕션(dB, 양수)
    function step(st, x, k) {
      const xd = A.linToDb(x), xl = xd - gainComputer(xd, k.T, k.R, k.W);
      st.gr = xl > st.gr ? k.aC * st.gr + (1 - k.aC) * xl : k.rC * st.gr + (1 - k.rC) * xl;
      return x * A.dbToLin(k.M - st.gr);
    }

    const src = makeSource(SR), N = src.length;
    let key = '', out = null, grArr = null, stats = null;
    function analyze() {
      const k = [P.threshold, P.ratio, P.knee, P.makeup].join();
      if (k === key) return;
      key = k;
      const st = newState(), cf = coefs(SR);
      out = new Float32Array(N); grArr = new Float32Array(N);
      for (let i = 0; i < N; i++) { out[i] = step(st, src[i], cf); grArr[i] = st.gr; }
      // 마디별 RMS로 다이내믹 레인지(가장 큰 마디 - 가장 작은 마디)
      const bars = 4, len = N / bars;
      const barDb = (buf) => Array.from({ length: bars }, (_, b) => A.linToDb(A.rms(buf, Math.round(b * len), Math.round((b + 1) * len))));
      const bi = barDb(src), bo = barDb(out);
      outD = decim(out); grD = decim(grArr).hi;
      stats = { dr: Math.max(...bo) - Math.min(...bo), drIn: Math.max(...bi) - Math.min(...bi), peak: A.linToDb(A.peak(out)), maxGr: A.peak(grArr), barDb: bo };
    }

    let live = newState(), liveSrc = null, liveSr = 0, pos = 0, curGr = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = newState(); }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc[pos], cf);
          pos = (pos + 1) % liveSrc.length;
          l[i] = y; r[i] = y;
        }
        curGr = live.gr;
      },
    });

    // 긴 배열을 COLS개 열의 최소, 최대로 줄인 그리기 캐시
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
    const srcD = decim(src);
    let outD = null, grD = null;

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const head = snd.on && liveSrc ? pos / liveSrc.length : (ctx.time / (N / SR)) % 1;
        // 전달 곡선
        const cs = Math.min(H - 2 * pad - 14, W * 0.36), cx = pad, cy = pad;
        D.rect(g, cx, cy, cs, cs, 'rgba(0,0,0,0.35)');
        const lo = -60, toX = (db) => cx + (db - lo) / -lo * cs, toY = (db) => cy + cs - (db - lo) / -lo * cs;
        for (let db = -48; db < 0; db += 12) { D.line(g, toX(db), cy, toX(db), cy + cs, C.grid); D.line(g, cx, toY(db), cx + cs, toY(db), C.grid); }
        D.line(g, toX(lo), toY(lo), toX(0), toY(0), C.dim, 1);
        if (P.knee > 0) D.rect(g, toX(P.threshold - P.knee / 2), cy, toX(P.threshold + P.knee / 2) - toX(P.threshold - P.knee / 2), cs, 'rgba(255,255,255,0.05)');
        D.line(g, toX(P.threshold), cy, toX(P.threshold), cy + cs, C.warn, 1);
        g.save(); g.beginPath(); g.rect(cx, cy, cs, cs); g.clip();
        g.beginPath();
        for (let i = 0; i <= 120; i++) { const x = lo + (-lo) * i / 120, y = gainComputer(x, P.threshold, P.ratio, P.knee) + P.makeup; i ? g.lineTo(toX(x), toY(y)) : g.moveTo(toX(x), toY(y)); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        // 현재 입력 레벨 점 (짧은 구간 피크)
        const hi = Math.floor(head * N), seg = Math.round(SR * 0.03);
        let pk = 0; for (let i = Math.max(0, hi - seg); i < hi; i++) pk = Math.max(pk, Math.abs(src[i]));
        const xin = U.clamp(A.linToDb(pk), lo, 0), gr = snd.on ? curGr : grArr[Math.max(0, hi - 1)];
        D.circle(g, toX(xin), toY(xin - gr + P.makeup), 4, C.text);
        g.restore();
        D.text(g, GTL.L('전달 곡선 (입력 → 출력 dB)', 'Transfer curve (in → out dB)'), cx + 4, cy + 4, { size: 10, color: C.dim });
        D.text(g, '-60', cx, cy + cs + 2, { size: 9, color: C.dim }); D.text(g, '0 dB', cx + cs, cy + cs + 2, { size: 9, color: C.dim, align: 'right' });

        // 파형과 게인 리덕션
        const wx = cx + cs + pad, ww = W - wx - pad, wh = (H - 3 * pad) * 0.62;
        D.rect(g, wx, pad, ww, wh, 'rgba(0,0,0,0.35)');
        drawBand(g, srcD, wx, pad, ww, wh, 'rgba(160,170,190,0.35)', 1.4);
        drawBand(g, outD, wx, pad, ww, wh, col, 1.4);
        D.text(g, GTL.L('파형 (회색 = 입력, 색 = 출력)', 'Waveform (gray = input, color = output)'), wx + 4, pad + 3, { size: 10, color: C.dim });
        for (let b = 1; b < 4; b++) D.line(g, wx + ww * b / 4, pad, wx + ww * b / 4, pad + wh, C.grid);
        for (let b = 0; b < 4; b++) D.text(g, stats.barDb[b].toFixed(1) + ' dB', wx + ww * (b + 0.5) / 4, pad + wh - 14, { size: 9, color: C.dim, align: 'center' });
        const gy = pad * 2 + wh, gh = H - gy - pad;
        D.rect(g, wx, gy, ww, gh, 'rgba(0,0,0,0.35)');
        for (let db = 6; db < 24; db += 6) { const py = gy + db / 24 * gh; D.line(g, wx, py, wx + ww, py, C.grid); D.text(g, '-' + db, wx + 2, py - 10, { size: 9, color: C.dim }); }
        plotCols(g, grD, wx, gy, ww, gh, 0, 24, col, true);
        D.text(g, GTL.L('게인 리덕션 (아래로 갈수록 많이 줄임)', 'Gain reduction (lower = more)'), wx + 4, gy + 3, { size: 10, color: C.dim });
        const px = wx + head * ww; D.line(g, px, pad, px, H - pad, C.text, 1);

        ctx.stat(GTL.L('설정', 'Settings'), `T ${P.threshold} dB, ${P.ratio}:1, ${GTL.L('니', 'knee')} ${P.knee} dB`);
        ctx.stat(GTL.L('다이내믹 레인지 (마디 RMS 차)', 'Dynamic range (bar RMS spread)'), `${stats.drIn.toFixed(1)} → ${stats.dr.toFixed(1)} dB`);
        ctx.stat(GTL.L('최대 게인 리덕션', 'Max gain reduction'), stats.maxGr.toFixed(1) + ' dB');
        ctx.stat(GTL.L('출력 피크', 'Output peak'), stats.peak.toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
