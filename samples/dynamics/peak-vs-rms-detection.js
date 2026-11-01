// 피크 검출 vs RMS 검출: 컴프레서가 "레벨"을 무엇으로 재느냐에 따라 눌리는 소리가 달라짐
GTL.register({
  id: 'peak-vs-rms-detection',
  title: '피크 검출 vs RMS 검출',
  summary: '컴프레서는 레벨을 순간 최대값(피크)으로 잴 수도, 평균 에너지(RMS)로 잴 수도 있음. A의 피크 검출은 짧고 날카로운 스네어를 가장 많이 누름. B의 RMS 검출은 스네어를 거의 그대로 두고 오래 지속되는 패드를 주로 누름.',
  views: { a: '피크 검출', b: 'RMS 검출 (50 ms)' },
  controls: '파라미터 표에서 검출 방식과 RMS 창 길이를 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p>컴프레서의 <b>레벨 검출기(Detector)</b>는 입력 신호를 "지금 얼마나 큰가"라는 숫자 하나로 바꿈. 게인 계산은 이 숫자를 보고 줄일 양을 정함.</p>
    <ul>
      <li><b>피크(Peak)</b>: 샘플의 절대값을 그대로 씀. 짧은 트랜지언트에도 바로 반응. 넘치면 안 되는 리미터, 드럼 제어에 맞음.</li>
      <li><b>RMS</b>: 일정 시간 창(보통 10~300 ms)의 제곱 평균의 제곱근. 사람이 느끼는 크기에 더 가까움. 보컬, 버스를 자연스럽게 고르게 할 때 맞음.</li>
    </ul>
    <p>같은 피크라도 짧은 스네어는 RMS가 낮고, 오래 지속되는 패드는 RMS가 높음. 그래서 검출 방식만 바꿔도 어떤 소리가 눌리는지 달라짐.</p>
    <p>단점: RMS 검출은 트랜지언트를 놓쳐 피크가 스레숄드보다 크게 넘침. 사인파의 RMS는 피크보다 3 dB 낮아서 같은 스레숄드라도 압축이 덜 걸림.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="140" x2="520" y2="140" class="d-dim"/>
    <path d="M40,140 L42,30 L50,110 L60,130 L80,140" class="d-line"/>
    <text x="40" y="22" class="t-small">${L('스네어 (짧고 높음)', 'Snare (short, high)')}</text>
    <path d="M200,140 L210,70 L440,70 L460,140" class="d-line"/>
    <text x="300" y="62" class="t-small">${L('패드 (길고 낮음)', 'Pad (long, lower)')}</text>
    <line x1="20" y1="80" x2="520" y2="80" class="d-dim" stroke-dasharray="4 3"/>
    <text x="520" y="94" text-anchor="end" class="t-small t-dim">${L('스레숄드', 'threshold')}</text>
    <path d="M40,140 L42,32 L70,90 L120,128 L200,140 L210,72 L440,72 L470,135" class="d-a" stroke-dasharray="5 3"/>
    <path d="M40,140 L60,112 L90,130 L200,140 L240,88 L440,88 L480,138" class="d-b" stroke-dasharray="5 3"/>
    <text x="90" y="80" class="t-small t-a">${L('피크: 스네어가 크게 넘음', 'Peak: snare goes far over')}</text>
    <text x="250" y="106" class="t-small t-b">${L('RMS: 스네어는 낮고, 패드가 오래 넘음', 'RMS: snare stays low, pad stays over')}</text>
    <text x="20" y="162" class="t-small t-dim">${L('점선 = 검출기가 보는 레벨', 'Dashed = level the detector sees')}</text>
  </svg>`,
  look: [
    '가운데 그래프에서 A의 검출 레벨은 스네어마다 높게 솟고, B는 스네어에서 낮고 패드 구간에서 평평하게 높음',
    '"스네어 구간 GR"과 "패드 구간 GR"을 비교하면 A는 스네어 쪽이 크고 B는 패드 쪽이 큼',
    'B의 RMS 창을 5 ms로 줄이면 피크 검출과 비슷해지고, 300 ms로 늘리면 스네어에 거의 반응하지 않음',
    'B의 출력 파형에서 스네어 피크가 A보다 높게 남음. 소리를 켜면 B의 스네어가 더 또렷하게 들림.',
  ],
  refs: [
    { type: 'paper', title: 'Giannoulis, Massberg, Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '피크 검출기와 RMS 검출기 비교' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '피크와 RMS 레벨 측정 구조' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '검출기 모드(피크, MS, RMS) 구현' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '피크 레벨과 평균 레벨의 차이' },
  ],
  params: [
    { key: 'det', label: '검출 방식', type: 'select', options: [{ value: 'peak', label: '피크' }, { value: 'rms', label: 'RMS' }], default: 'rms', a: 'peak', b: 'rms', group: '검출기' },
    { key: 'win', label: 'RMS 창 (ms)', type: 'range', min: 5, max: 300, step: 1, default: 50, when: (p) => p.det === 'rms' },
    { key: 'threshold', label: '스레숄드 (dB)', type: 'range', min: -40, max: 0, step: 1, default: -20, shared: true, group: '컴프레서' },
    { key: 'ratio', label: '레이쇼 (R:1)', type: 'range', min: 1, max: 20, step: 0.5, default: 6, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Peak vs RMS Detection',
    summary: 'A compressor can measure level as the instant maximum (peak) or as average energy (RMS). Peak detection in A pushes down the short, sharp snare the most. RMS detection in B leaves the snare almost untouched and mainly pushes down the long pad.',
    views: { a: 'Peak detection', b: 'RMS detection (50 ms)' },
    controls: 'Change the detection mode and RMS window in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>The <b>level detector</b> of a compressor turns the input into one number: "how loud is it now". The gain computer uses this number to decide how much to reduce.</p>
    <ul>
      <li><b>Peak</b>: uses the absolute sample value. It reacts to short transients at once. Good for limiters that must not overshoot, and for controlling drums.</li>
      <li><b>RMS</b>: the square root of the mean square over a time window (usually 10 to 300 ms). Closer to how loud we hear it. Good for evening out vocals and buses naturally.</li>
    </ul>
    <p>With the same peak, a short snare has low RMS and a long pad has high RMS. So changing only the detector changes which sound gets pushed down.</p>
    <p>Downsides: RMS detection misses transients, so peaks go well above the threshold. A sine's RMS is 3 dB below its peak, so the same threshold compresses less.</p>`,
    look: [
      'In the middle graph, A\'s detected level spikes on every snare. B stays low on the snare and is flat and high during the pad.',
      'Compare "GR on snare" and "GR on pad". A is larger on the snare, B is larger on the pad.',
      'Set B\'s RMS window to 5 ms and it acts like peak detection. At 300 ms it hardly reacts to the snare.',
      'In B\'s output, snare peaks stay higher than in A. With sound on, B\'s snare is clearer.',
    ],
    refs: ['Peak and RMS detectors compared.', 'Peak and RMS level measurement.', 'Detector modes (peak, MS, RMS) in code.', 'Peak level vs average level.'],
    params: {
      det: { label: 'Detection mode', group: 'Detector', options: { peak: 'Peak' } },
      win: 'RMS window (ms)',
      threshold: { label: 'Threshold (dB)', group: 'Compressor' },
      ratio: 'Ratio (R:1)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000;
    const SEG = 3.2; // 스네어 4번 (0~1.6 s), 패드 (1.6~3.2 s)

    function makeSource(sr) {
      const n = Math.round(SEG * sr), out = new Float32Array(n), nz = A.noiseBuffer(sr, 3);
      for (let k = 0; k < 4; k++) {
        const i0 = Math.round(k * 0.4 * sr);
        for (let i = 0; i < 0.3 * sr; i++) { const t = i / sr; out[i0 + i] += 0.55 * nz[i] * Math.exp(-t * 90) + 0.35 * Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 90); }
      }
      // 패드: 사인파 두 음 (5도). 피크와 RMS 차이가 작은 긴 소리
      const i0 = Math.round(1.6 * sr), m = n - i0;
      for (let i = 0; i < m; i++) {
        const t = i / sr, env = Math.min(1, t / 0.05, (m - i) / sr / 0.1);
        out[i0 + i] += (0.22 * Math.sin(2 * Math.PI * 220 * t) + 0.09 * Math.sin(2 * Math.PI * 330 * t)) * env;
      }
      return out;
    }
    const gc = (x, T, R) => (x > T ? T + (x - T) / R : x);
    function coefs(sr) { return { aC: Math.exp(-1 / (0.0005 * sr)), rC: Math.exp(-1 / (0.1 * sr)), wC: Math.exp(-1 / (P.win * 0.001 * sr)), T: P.threshold, R: P.ratio, rms: P.det === 'rms' }; }
    function step(st, x, k) {
      let lev;
      if (k.rms) { st.ms = k.wC * st.ms + (1 - k.wC) * x * x; lev = A.linToDb(Math.sqrt(st.ms)); }
      else lev = A.linToDb(x);
      // 표시용 검출 레벨 (피크는 릴리스를 건 엔벨로프)
      st.det = k.rms ? lev : Math.max(lev, st.det - 0.002 * 48000 / k.sr);
      const xl = lev - gc(lev, k.T, k.R);
      st.gr = xl > st.gr ? k.aC * st.gr + (1 - k.aC) * xl : k.rC * st.gr + (1 - k.rC) * xl;
      return x * A.dbToLin(-st.gr);
    }
    const newSt = () => ({ gr: 0, ms: 0, det: -120 });

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
    let key = '', outD, grD, detD, st;
    function analyze() {
      const k = [P.det, P.win, P.threshold, P.ratio].join();
      if (k === key) return;
      key = k;
      const s = newSt(), cf = coefs(SR); cf.sr = SR;
      const out = new Float32Array(N), gr = new Float32Array(N), det = new Float32Array(N);
      for (let i = 0; i < N; i++) { out[i] = step(s, src[i], cf); gr[i] = s.gr; det[i] = s.det; }
      outD = decim(out); grD = decim(gr).hi; detD = decim(det).hi;
      const half = N / 2;
      let a = 0, b = 0; for (let i = 0; i < half; i++) a = Math.max(a, gr[i]); for (let i = half; i < N; i++) b += gr[i];
      st = { grSn: a, grPad: b / half, pkSn: A.linToDb(A.peak(out.subarray(0, half))), pkPad: A.linToDb(A.peak(out.subarray(half))) };
    }

    let live = newSt(), liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = newSt(); }
        const cf = coefs(sr); cf.sr = sr;
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc[pos], cf) * 1.2;
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
        const h1 = (H - pad * 4) * 0.34, h2 = (H - pad * 4) * 0.36, h3 = H - pad * 4 - h1 - h2;
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        drawBand(g, srcD, pad, pad, iw, h1, 'rgba(160,170,190,0.35)', 1.5);
        drawBand(g, outD, pad, pad, iw, h1, col, 1.5);
        D.line(g, pad + iw / 2, pad, pad + iw / 2, H - pad, C.grid);
        D.text(g, GTL.L('스네어 4번', '4 snare hits'), pad + 4, pad + 3, { size: 10, color: C.dim });
        D.text(g, GTL.L('패드 화음', 'Pad chord'), pad + iw / 2 + 4, pad + 3, { size: 10, color: C.dim });
        // 검출 레벨 (dB)
        const y2 = pad * 2 + h1, lo = -48, hi = 0;
        D.rect(g, pad, y2, iw, h2, 'rgba(0,0,0,0.35)');
        const ty = y2 + h2 - (P.threshold - lo) / (hi - lo) * h2;
        D.line(g, pad, ty, pad + iw, ty, C.warn, 1);
        D.text(g, GTL.L('스레숄드', 'Threshold'), pad + iw - 4, ty - 12, { size: 9, color: C.warn, align: 'right' });
        plotCols(g, detD, pad, y2, iw, h2, lo, hi, col, false);
        D.text(g, GTL.L('검출기가 보는 레벨 (dB)', 'Level the detector sees (dB)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 게인 리덕션
        const y3 = y2 + h2 + pad;
        D.rect(g, pad, y3, iw, h3, 'rgba(0,0,0,0.35)');
        plotCols(g, grD, pad, y3, iw, h3, 0, 18, col, true);
        D.text(g, GTL.L('게인 리덕션 (0~18 dB)', 'Gain reduction (0 to 18 dB)'), pad + 4, y3 + 3, { size: 10, color: C.dim });
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.length; D.line(g, px, pad, px, H - pad, C.text); }

        ctx.stat(GTL.L('검출 방식', 'Detection'), P.det === 'rms' ? `RMS ${P.win} ms` : GTL.L('피크', 'Peak'));
        ctx.stat(GTL.L('스네어 구간 GR (최대)', 'GR on snare (max)'), st.grSn.toFixed(1) + ' dB');
        ctx.stat(GTL.L('패드 구간 GR (평균)', 'GR on pad (average)'), st.grPad.toFixed(1) + ' dB');
        ctx.stat(GTL.L('출력 피크 (스네어, 패드)', 'Output peak (snare, pad)'), `${st.pkSn.toFixed(1)}, ${st.pkPad.toFixed(1)} dBFS`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
