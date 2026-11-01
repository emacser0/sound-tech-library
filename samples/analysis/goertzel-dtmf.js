// 괴르첼 알고리즘으로 DTMF(전화 버튼음) 검출: FFT 전체 계산 vs 필요한 8개 주파수만 계산
GTL.register({
  id: 'goertzel-dtmf',
  title: '괴르첼 알고리즘과 DTMF 검출',
  summary: '전화 버튼음(DTMF)은 저역 4개, 고역 4개 중 한 음씩을 섞은 소리. 8개 주파수만 알면 되므로 FFT로 모든 bin을 계산할 필요가 없음. 괴르첼 알고리즘은 원하는 주파수 하나를 샘플마다 곱셈 한 번으로 구하고, bin 격자에 묶이지 않아 정확한 주파수에서 잼.',
  views: { a: 'FFT (256점)', b: '괴르첼 (8개 주파수)' },
  controls: '파라미터 표에서 버튼과 잡음을 바꿈. "자동 다이얼"을 켜면 버튼이 차례로 눌림. "소리 켜기"를 누르면 버튼음이 들림.',
  info: `
    <p><b>DTMF(Dual-Tone Multi-Frequency)</b>: 전화 키패드의 각 버튼은 행 주파수(697, 770, 852, 941Hz) 하나와 열 주파수(1209, 1336, 1477, 1633Hz) 하나를 섞은 소리. ITU-T Q.23 표준.</p>
    <p>검출은 8개 주파수의 세기만 알면 됨. N점 FFT는 N/2개 bin을 모두 계산하고, bin 간격(sr/N)에 맞지 않는 주파수는 세기가 깎임(스캘럽 손실).</p>
    <p><b>괴르첼(Goertzel) 알고리즘</b>: 주파수 하나에 공진하는 2차 IIR 필터. 샘플마다 <code>s = x + 2cos(ω)s₁ - s₂</code> 한 줄을 돌리고 끝에서 크기를 구함.</p>
    <ul>
      <li>주파수 하나에 샘플당 곱셈 1번. 주파수가 몇 개뿐이면 FFT보다 쌈.</li>
      <li>샘플이 들어오는 대로 계산해서 버퍼가 필요 없음. 작은 마이크로컨트롤러, 모뎀, 전화 교환기에서 씀.</li>
      <li>ω를 원하는 주파수로 바로 정할 수 있어 bin 격자에 묶이지 않음</li>
    </ul>
    <p>8kHz에서 205샘플(25.6ms)이 고전적인 프레임 길이. 주파수가 많아지면(대략 log₂N개 이상) FFT가 더 쌈.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    ${['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D'].map((k, i) => `<rect x="${70 + (i % 4) * 34}" y="${30 + Math.floor(i / 4) * 30}" width="30" height="26" class="${k === '5' ? 'f-b' : 'f-dim'}"/><text x="${85 + (i % 4) * 34}" y="${47 + Math.floor(i / 4) * 30}" text-anchor="middle" class="t-small">${k}</text>`).join('')}
    ${[697, 770, 852, 941].map((f, i) => `<text x="64" y="${47 + i * 30}" text-anchor="end" class="t-small t-mono">${f}</text>`).join('')}
    ${[1209, 1336, 1477, 1633].map((f, i) => `<text x="${85 + i * 34}" y="22" text-anchor="middle" class="t-small t-mono">${f}</text>`).join('')}
    <text x="125" y="162" text-anchor="middle" class="t-small t-b">${L('5 = 770Hz + 1336Hz', '5 = 770 Hz + 1336 Hz')}</text>
    <rect x="270" y="50" width="70" height="30" class="f-dim"/><text x="305" y="69" text-anchor="middle" class="t-small t-mono">x[n]</text>
    <rect x="370" y="50" width="160" height="30" class="f-b" opacity="0.5"/><text x="450" y="69" text-anchor="middle" class="t-small t-mono">s = x + 2cos(ω)s1 - s2</text>
    <path d="M342,65 L368,65" class="d-accent" marker-end="url(#arr)"/>
    <path d="M450,82 L450,110" class="d-accent" marker-end="url(#arr)"/>
    <text x="450" y="126" text-anchor="middle" class="t-small t-mono">|X(ω)|² = s1² + s2² - 2cos(ω)s1s2</text>
    <text x="400" y="150" text-anchor="middle" class="t-small t-dim">${L('주파수마다 샘플당 곱셈 1번, 끝에서 한 번 계산', 'one multiply per sample per frequency')}</text>
  </svg>`,
  look: [
    '"스캘럽 손실" 측정값에서 A는 최대 1.3dB 깎임. DTMF 주파수가 FFT bin 사이에 떨어지기 때문. B는 정확한 주파수에서 재서 0dB.',
    '위 스펙트럼의 점(FFT bin)과 노란 선(DTMF 주파수)이 어긋난 정도를 보면 손실 이유가 보임',
    '"곱셈 수" 측정값에서 B가 A의 절반 이하. 버퍼 없이 샘플마다 계산할 수 있다는 점도 장점.',
    '잡음을 +3dB 이상으로 올리면 검출률이 떨어지기 시작함. 깎임이 있는 A가 조금 먼저 떨어짐.',
  ],
  refs: [
    { type: 'paper', title: 'G. Goertzel, "An Algorithm for the Evaluation of Finite Trigonometric Series", American Mathematical Monthly 65(1)', year: 1958, note: '괴르첼 알고리즘의 원 논문' },
    { type: 'article', title: 'ITU-T Recommendation Q.23, Technical features of push-button telephone sets', note: 'DTMF 주파수 표준' },
    { type: 'article', title: 'Texas Instruments, "Modified Goertzel Algorithm in DTMF Detection Using the TMS320C80", Application Report SPRA066', year: 1996, note: 'N = 205와 DSP 구현' },
    { type: 'book', title: 'Richard G. Lyons, Understanding Digital Signal Processing, 3rd ed.', year: 2010, note: '괴르첼 알고리즘과 FFT 비용 비교' },
  ],
  params: [
    { key: 'method', label: '검출 방식', type: 'select', options: [{ value: 'fft', label: 'FFT (256점)' }, { value: 'goertzel', label: '괴르첼' }], a: 'fft', b: 'goertzel', group: '검출' },
    { key: 'digit', label: '버튼', type: 'select', options: ['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D'].map((v) => ({ value: v, label: v })), default: '5', shared: true, group: '신호' },
    { key: 'auto', label: '자동 다이얼', type: 'bool', default: true, shared: true, help: '0.8초마다 다음 버튼' },
    { key: 'noise', label: '잡음 (dB)', type: 'range', min: -40, max: 10, step: 1, default: -15, shared: true, help: '버튼음 한 성분 대비' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Goertzel Algorithm and DTMF Detection',
    summary: 'A phone button tone (DTMF) mixes one of 4 low and one of 4 high tones. Only 8 frequencies matter, so there is no need to compute every FFT bin. The Goertzel algorithm computes one chosen frequency with one multiply per sample, and it is not tied to the bin grid, so it measures at the exact frequency.',
    views: { a: 'FFT (256 points)', b: 'Goertzel (8 frequencies)' },
    controls: 'Change the button and noise in the parameter table. Turn on "Auto dial" to press buttons in turn. Press "Sound on" to hear the tones.',
    info: `
    <p><b>DTMF (Dual-Tone Multi-Frequency)</b>: each button on a phone keypad mixes one row frequency (697, 770, 852, 941 Hz) with one column frequency (1209, 1336, 1477, 1633 Hz). Standard ITU-T Q.23.</p>
    <p>Detection only needs the strength of 8 frequencies. An N-point FFT computes all N/2 bins, and frequencies that do not fit the bin spacing (sr/N) lose strength (scalloping loss).</p>
    <p><b>The Goertzel algorithm</b>: a 2nd order IIR filter that resonates at one frequency. Run one line, <code>s = x + 2cos(ω)s₁ - s₂</code>, for each sample, then compute the magnitude at the end.</p>
    <ul>
      <li>One multiply per sample per frequency. With only a few frequencies it is cheaper than the FFT.</li>
      <li>It runs as samples arrive, so it needs no buffer. Used in small microcontrollers, modems and phone exchanges.</li>
      <li>You can set ω to any frequency, so it is not tied to the bin grid.</li>
    </ul>
    <p>205 samples at 8 kHz (25.6 ms) is the classic frame length. With many frequencies (roughly more than log₂N) the FFT becomes cheaper.</p>`,
    look: [
      'In the "Scalloping loss" stat, A loses up to 1.3 dB because DTMF frequencies fall between FFT bins. B measures at the exact frequency and loses 0 dB.',
      'In the top spectrum, compare the dots (FFT bins) with the yellow lines (DTMF frequencies). The mismatch explains the loss.',
      'The "Multiplies" stat for B is less than half of A. Being able to compute per sample with no buffer is another plus.',
      'Raise the noise above +3 dB. Detection rates start to drop. A, with its loss, drops a little earlier.',
    ],
    refs: ['The original Goertzel paper.', 'The DTMF frequency standard.', 'N = 205 and a DSP implementation.', 'Goertzel algorithm and FFT cost comparison.'],
    params: {
      method: { label: 'Method', group: 'Detection', options: { fft: 'FFT (256 points)', goertzel: 'Goertzel' } },
      digit: { label: 'Button', group: 'Signal' },
      auto: { label: 'Auto dial', help: 'Next button every 0.8 s.' },
      noise: { label: 'Noise (dB)', help: 'Relative to one tone of the pair.' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 8000, N = 205, NF = 256, TAU = Math.PI * 2;
    const LOW = [697, 770, 852, 941], HIGH = [1209, 1336, 1477, 1633], FREQS = [...LOW, ...HIGH];
    const KEYS = ['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D'];
    const AUTO = ['1', '5', '9', '#', '0', '3', '7', 'D', '2', '8'];

    // 프레임 하나: 버튼음 + 잡음 (시드로 재현)
    function makeFrame(key, seed) {
      const i = KEYS.indexOf(key), fl = LOW[i >> 2], fh = HIGH[i & 3], rng = U.rng(seed), x = new Float64Array(N);
      const nl = A.dbToLin(P.noise) * 0.5 * Math.sqrt(3), p1 = rng.range(0, TAU), p2 = rng.range(0, TAU);
      for (let n = 0; n < N; n++) x[n] = 0.5 * Math.sin(TAU * fl * n / SR + p1) + 0.5 * Math.sin(TAU * fh * n / SR + p2) + nl * rng.range(-1, 1);
      return x;
    }
    // 괴르첼: 주파수 f의 크기 (진폭 단위로 정규화)
    function goertzel(x, f) {
      const w = TAU * f / SR, c = 2 * Math.cos(w);
      let s1 = 0, s2 = 0;
      for (let n = 0; n < N; n++) { const s = x[n] + c * s1 - s2; s2 = s1; s1 = s; }
      return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2)) * 2 / N;
    }
    // FFT: 205샘플 + 0으로 256점. DTMF 주파수에 가장 가까운 bin의 크기
    function fftMags(x) {
      const re = new Float64Array(NF), im = new Float64Array(NF);
      for (let n = 0; n < N; n++) re[n] = x[n];
      A.fft(re, im);
      const mags = new Float64Array(NF / 2);
      for (let k = 0; k < NF / 2; k++) mags[k] = Math.hypot(re[k], im[k]) * 2 / N;
      return mags;
    }
    function detect(x) {
      let m, spec = null;
      if (P.method === 'fft') { spec = fftMags(x); m = FREQS.map((f) => spec[Math.round(f * NF / SR)]); }
      else m = FREQS.map((f) => goertzel(x, f));
      // 판정: 각 묶음에서 가장 큰 값이 문턱값 위이고 둘째보다 6dB 이상 큼
      const pick = (arr) => { const s = arr.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]); return s[0][0] > 0.2 && s[0][0] > 2 * s[1][0] ? s[0][1] : -1; };
      const lo = pick(m.slice(0, 4)), hi = pick(m.slice(4));
      return { mags: m, spec, key: lo >= 0 && hi >= 0 ? KEYS[lo * 4 + hi] : null };
    }

    // 잡음 없는 단일 사인파로 잰 8개 주파수의 최대 손실
    const scallop = (() => {
      const re = new Float64Array(NF), im = new Float64Array(NF);
      let worst = 0;
      for (const f of FREQS) {
        re.fill(0); im.fill(0);
        for (let n = 0; n < N; n++) re[n] = Math.sin(TAU * f * n / SR);
        A.fft(re, im);
        const k = Math.round(f * NF / SR);
        worst = Math.min(worst, A.linToDb(Math.hypot(re[k], im[k]) * 2 / N));
      }
      return worst;
    })();
    const st = { t: 0, idx: 0, slot: 0 };
    const curKey = () => (P.auto ? AUTO[st.idx % AUTO.length] : P.digit);
    let cur = null, curKeyStr = '', rate = 0, rKey = '';
    function refresh() {
      const k = curKey() + P.method + P.noise + st.slot;
      if (k === curKeyStr) return;
      curKeyStr = k;
      cur = detect(makeFrame(curKey(), 100 + st.slot));
      // 검출률: 16개 버튼 × 시드 12개
      const rk = P.method + P.noise;
      if (rk !== rKey) {
        rKey = rk; let ok = 0;
        for (let s = 0; s < 12; s++) for (const key of KEYS) if (detect(makeFrame(key, 1000 + s)).key === key) ok++;
        rate = ok / (12 * KEYS.length) * 100;
      }
    }
    refresh();

    const live = { n: 0, p1: 0, p2: 0, g: 0 };
    const nb = A.noiseBuffer(SR, 23);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const i = KEYS.indexOf(curKey()), fl = LOW[i >> 2], fh = HIGH[i & 3], on = !P.auto || (st.t % 0.8) < 0.5, nl = A.dbToLin(P.noise) * 0.5 * Math.sqrt(3);
        for (let j = 0; j < n; j++) {
          live.g += ((on ? 1 : 0) - live.g) * 0.01;
          live.p1 = (live.p1 + TAU * fl / sr) % TAU; live.p2 = (live.p2 + TAU * fh / sr) % TAU;
          const v = live.g * 0.22 / Math.max(1, nl * 1.2) * (Math.sin(live.p1) + Math.sin(live.p2) + nl * 2 * nb[live.n]);
          live.n = (live.n + 1) % nb.length;
          l[j] = v; r[j] = v;
        }
      },
    });

    return {
      update(dt) {
        snd.update();
        st.t += dt;
        st.idx = Math.floor(st.t / 0.8);
        st.slot = Math.floor(st.t / 0.2);
        refresh();
      },
      render() {
        refresh();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        const key = curKey(), ki = KEYS.indexOf(key);
        // 위: 0~2000Hz 스펙트럼 (FFT 점) 또는 8개 괴르첼 값
        const sh = Math.max(70, H * 0.36), FM = 2000;
        D.rect(g, pad, pad, tw, sh, 'rgba(0,0,0,0.35)');
        const fx = (f) => pad + (f - 500) / (FM - 500) * tw, my = (v) => pad + sh - U.clamp((A.linToDb(v) + 50) / 50, 0, 1) * (sh - 16);
        for (const f of FREQS) D.line(g, fx(f), pad + 14, fx(f), pad + sh, 'rgba(255,203,107,0.5)');
        const spec = cur.spec;
        if (spec) {
          g.beginPath(); let s = false;
          for (let k = 0; k < NF / 2; k++) { const f = k * SR / NF; if (f < 500 || f > FM) continue; const px = fx(f), py = my(spec[k]); s ? g.lineTo(px, py) : g.moveTo(px, py); s = true; }
          g.strokeStyle = col; g.lineWidth = 1; g.stroke();
          for (let k = 0; k < NF / 2; k++) { const f = k * SR / NF; if (f >= 500 && f <= FM) D.circle(g, fx(f), my(spec[k]), 2.2, col); }
        } else {
          FREQS.forEach((f, i) => { D.line(g, fx(f), pad + sh, fx(f), my(cur.mags[i]), col, 3); D.circle(g, fx(f), my(cur.mags[i]), 4, col); });
        }
        D.text(g, P.method === 'fft' ? Lg('FFT 256점 (점 = bin, 노란 선 = DTMF 주파수)', 'FFT 256 points (dots = bins, yellow lines = DTMF frequencies)') : Lg('괴르첼: DTMF 주파수 8개에서만 계산', 'Goertzel: computed only at the 8 DTMF frequencies'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 가운데: 8개 크기 막대
        const by = pad * 2 + sh, bh = Math.max(50, H * 0.24), bw = tw / 8;
        D.rect(g, pad, by, tw, bh, 'rgba(0,0,0,0.35)');
        cur.mags.forEach((v, i) => {
          const h = U.clamp(v / 0.55, 0, 1) * (bh - 30), isT = i === (ki >> 2) || i === 4 + (ki & 3);
          D.rect(g, pad + i * bw + 6, by + bh - 14 - h, bw - 12, h, isT ? col : 'rgba(216,221,230,0.35)');
          D.text(g, String(FREQS[i]), pad + i * bw + bw / 2, by + bh - 12, { size: 9, color: C.dim, align: 'center' });
        });
        D.line(g, pad + tw / 2, by, pad + tw / 2, by + bh, C.grid);
        D.text(g, Lg('8개 주파수의 크기 (색 = 눌린 버튼의 두 음)', 'Magnitude at 8 frequencies (colored = the 2 tones of the pressed button)'), pad + 4, by + 3, { size: 10, color: C.dim });
        // 아래: 키패드
        const ky = by + bh + pad, kh = H - ky - pad, cs = Math.min(kh / 4, 46), kx = pad + tw / 2 - cs * 2;
        KEYS.forEach((k, i) => {
          const x0 = kx + (i & 3) * cs, y0 = ky + (i >> 2) * cs, det = cur.key === k;
          D.rect(g, x0 + 2, y0 + 2, cs - 4, cs - 4, det ? col : 'rgba(255,255,255,0.08)', k === key ? '#fff' : null, 2);
          D.text(g, k, x0 + cs / 2, y0 + cs / 2 - 7, { size: 13, color: det ? '#111' : C.text, align: 'center' });
        });
        D.text(g, Lg('흰 테두리 = 눌린 버튼, 색 = 검출', 'White border = pressed, colored = detected'), pad, ky + 4, { size: 10, color: C.dim });
        const mults = P.method === 'fft' ? (NF / 2) * Math.log2(NF) * 4 : FREQS.length * (N + 3);
        ctx.stat(Lg('검출', 'Detected'), cur.key ? cur.key + (cur.key === key ? Lg(' (맞음)', ' (correct)') : Lg(' (틀림)', ' (wrong)')) : Lg('없음', 'None'));
        ctx.stat(Lg('검출률 (16버튼 × 12회)', 'Detection rate (16 buttons × 12)'), rate.toFixed(1) + '%');
        ctx.stat(Lg('곱셈 수 (프레임당)', 'Multiplies (per frame)'), mults.toFixed(0));
        ctx.stat(Lg('스캘럽 손실 (최대)', 'Scalloping loss (max)'), (P.method === 'fft' ? scallop : 0).toFixed(2) + ' dB');
        ctx.stat(Lg('두 음 크기 차', 'Level gap of the 2 tones'), Math.abs(A.linToDb(cur.mags[ki >> 2]) - A.linToDb(cur.mags[4 + (ki & 3)])).toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
