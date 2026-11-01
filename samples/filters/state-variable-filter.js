// 빠른 컷오프 변조: 직접형 바이쿼드 vs TPT 상태 변수 필터(SVF). 같은 정적 응답, 다른 시변 동작
GTL.register({
  id: 'state-variable-filter',
  title: '컷오프 변조와 상태 변수 필터 (SVF)',
  summary: '컷오프를 빠르게 움직이면 직접형 바이쿼드는 내부 상태가 새 계수와 맞지 않아 출력이 튀고 커짐. TPT 상태 변수 필터는 상태가 물리적인 의미(적분기)를 가져서 빠른 변조에도 안정적.',
  views: { a: '직접형 II 바이쿼드', b: 'TPT SVF' },
  info: `
    <p>계수가 고정이면 바이쿼드와 상태 변수 필터(SVF)는 같은 응답을 냄. 차이는 <b>계수가 매 샘플 바뀔 때</b> 나타남. 신스의 필터 엔벨로프, LFO, 오디오 속도 변조가 그런 경우.</p>
    <ul>
      <li><b>직접형 II(Direct Form II)</b>: 상태 변수가 신호를 계수로 한 번 거른 중간값. 계수가 바뀌면 이 중간값이 갑자기 다른 의미가 되어 에너지가 생겨남. 출력이 원래보다 수십 배 커질 수 있음.</li>
      <li><b>직접형 I, 전치 직접형 II</b>: 직접형 II보다 낫지만 빠른 변조에서 여전히 튐</li>
      <li><b>TPT SVF</b>: 아날로그 SVF 회로의 적분기 두 개를 사다리꼴 적분(TPT, Topology-Preserving Transform)으로 옮긴 구조. 상태가 적분기의 값이라 컷오프가 바뀌어도 연속. Zavalishin, Simper의 설계로 널리 쓰임.</li>
    </ul>
    <p>SVF는 같은 상태에서 로우패스, 밴드패스, 하이패스 출력을 동시에 얻는 장점도 있음</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="18" class="t-small t-dim">${L('TPT SVF: 적분기 2개 + 되먹임', 'TPT SVF: 2 integrators + feedback')}</text>
    <text x="14" y="64" class="t-small">x</text>
    <circle cx="50" cy="60" r="12" class="f-dim"/><text x="50" y="64" text-anchor="middle">+</text>
    <line x1="22" y1="60" x2="37" y2="60" class="d-line" marker-end="url(#arr)"/>
    <line x1="62" y1="60" x2="110" y2="60" class="d-line" marker-end="url(#arr)"/>
    <text x="86" y="52" text-anchor="middle" class="t-small t-dim">HP</text>
    <rect x="112" y="44" width="80" height="32" class="f-dim"/><text x="152" y="64" text-anchor="middle" class="t-small">${L('적분기 g', 'integrator g')}</text>
    <line x1="192" y1="60" x2="260" y2="60" class="d-line" marker-end="url(#arr)"/>
    <text x="226" y="52" text-anchor="middle" class="t-small t-dim">BP</text>
    <rect x="262" y="44" width="80" height="32" class="f-dim"/><text x="302" y="64" text-anchor="middle" class="t-small">${L('적분기 g', 'integrator g')}</text>
    <line x1="342" y1="60" x2="420" y2="60" class="d-line" marker-end="url(#arr)"/>
    <text x="430" y="64" class="t-small">LP</text>
    <path d="M226,60 L226,100 L50,100 L50,74" class="d-b" marker-end="url(#arr)"/>
    <path d="M380,60 L380,120 L44,120 L44,73" class="d-b" marker-end="url(#arr)"/>
    <text x="140" y="96" class="t-small t-b">-k BP</text><text x="200" y="116" class="t-small t-b">-LP</text>
    <text x="270" y="146" text-anchor="middle" class="t-small t-dim">${L('상태 = 적분기 값. 컷오프(g)가 바뀌어도 값이 그대로 이어짐', 'State = integrator values. They stay continuous when the cutoff (g) changes')}</text>
  </svg>`,
  look: [
    '기본값에서 "최대 출력" 측정값을 비교하면 A는 정적 상태의 10배 이상, B는 거의 그대로',
    '변조 속도를 1Hz로 낮추면 두 뷰의 파형이 거의 같아짐 (느린 변조에서는 구조 차이가 작음)',
    '구조를 직접형 I, 전치 직접형 II로 바꿔 보면 직접형 II보다는 낫지만 SVF보다 튐',
    '"소리 켜기" 후 A를 들으면 변조 주기마다 터지는 잡음과 찌그러짐이 들림. B는 깨끗한 와우 소리.',
  ],
  refs: [
    { type: 'book', title: 'Vadim Zavalishin, The Art of VA Filter Design', year: 2018, note: 'TPT(사다리꼴 적분)와 SVF 설계' },
    { type: 'article', title: 'Andrew Simper, "Linear Trapezoidal Integrated SVF" (Cytomic technical paper)', url: 'https://cytomic.com/technical-papers/', note: '이 샘플의 SVF 계수식' },
    { type: 'book', title: 'Hal Chamberlin, Musical Applications of Microprocessors, 2nd ed.', year: 1985, note: '디지털 상태 변수 필터의 고전 구현' },
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '직접형 I, II와 전치형 구조' },
  ],
  params: [
    { key: 'form', label: '구조', type: 'select', group: '필터', options: [
      { value: 'df1', label: '직접형 I' }, { value: 'df2', label: '직접형 II' }, { value: 'tdf2', label: '전치 직접형 II' }, { value: 'svf', label: 'TPT SVF' },
    ], a: 'df2', b: 'svf' },
    { key: 'q', label: 'Q', type: 'range', min: 0.5, max: 20, step: 0.1, default: 8, shared: true },
    { key: 'base', label: '최저 컷오프 (Hz)', type: 'range', min: 50, max: 2000, step: 10, default: 200, shared: true },
    { key: 'depth', label: '변조 폭 (옥타브)', type: 'range', min: 0, max: 7, step: 0.1, default: 6, shared: true, group: '변조' },
    { key: 'rate', label: '변조 속도 (Hz)', type: 'range', min: 0.2, max: 1000, step: 0.1, default: 300, shared: true, help: '수백 Hz면 오디오 속도 변조' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Cutoff Modulation and the State Variable Filter (SVF)',
    summary: 'When the cutoff moves fast, a direct form biquad\'s internal state no longer matches the new coefficients, so the output jumps and grows. A TPT state variable filter keeps a physical meaning in its state (integrators), so it stays stable under fast modulation.',
    views: { a: 'Direct form II biquad', b: 'TPT SVF' },
    info: `
    <p>With fixed coefficients, a biquad and a state variable filter (SVF) give the same response. The difference shows up <b>when the coefficients change every sample</b>: synth filter envelopes, LFOs and audio rate modulation.</p>
    <ul>
      <li><b>Direct form II</b>: its state holds the signal already filtered by the coefficients. When the coefficients change, that value suddenly means something else and energy appears from nowhere. The output can grow tens of times larger.</li>
      <li><b>Direct form I, transposed direct form II</b>: better than direct form II, but they still jump under fast modulation.</li>
      <li><b>TPT SVF</b>: the two integrators of the analog SVF circuit, mapped with trapezoidal integration (TPT, topology-preserving transform). The state is the integrator value, so it stays continuous when the cutoff changes. Widely used after the designs of Zavalishin and Simper.</li>
    </ul>
    <p>An SVF also gives lowpass, bandpass and highpass outputs from the same state at once.</p>`,
    look: [
      'Compare the "Max output" stat at the defaults. A is more than 10 times the static level, B stays about the same.',
      'Lower the modulation rate to 1 Hz. The two waveforms become almost the same (with slow modulation the structure matters little).',
      'Switch the structure to direct form I or transposed direct form II. They are better than direct form II but still jump more than the SVF.',
      'Press "Sound on" and listen to A. You hear bursts and distortion on every modulation cycle. B gives a clean "wah".',
    ],
    refs: ['TPT (trapezoidal integration) and SVF design.', 'The SVF coefficient formulas used here.', 'Classic digital state variable filter.', 'Direct form I, II and transposed structures.'],
    params: {
      form: { label: 'Structure', group: 'Filter', options: { df1: 'Direct form I', df2: 'Direct form II', tdf2: 'Transposed direct form II', svf: 'TPT SVF' } },
      q: 'Q',
      base: 'Lowest cutoff (Hz)',
      depth: { label: 'Modulation depth (octaves)', group: 'Modulation' },
      rate: { label: 'Modulation rate (Hz)', help: 'Hundreds of Hz means audio rate modulation' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 12000; // 250ms

    // 한 샘플 처리. st: 필터 상태, f: 이번 샘플의 컷오프
    const cf = { b0: 0, b1: 0, b2: 0, a1: 0, a2: 0 };
    function makeState() { return { x1: 0, x2: 0, y1: 0, y2: 0, w1: 0, w2: 0, s1: 0, s2: 0, ic1: 0, ic2: 0, blowups: 0 }; }
    function step(st, x, f, q, sr, form) {
      let y;
      if (form === 'svf') {
        const g = Math.tan(Math.PI * Math.min(f, sr * 0.49) / sr), k = 1 / q;
        const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
        const v3 = x - st.ic2, v1 = a1 * st.ic1 + a2 * v3, v2 = st.ic2 + a2 * st.ic1 + a3 * v3;
        st.ic1 = 2 * v1 - st.ic1; st.ic2 = 2 * v2 - st.ic2;
        y = v2;
      } else {
        // RBJ 로우패스 계수를 그 자리에서 계산 (매 샘플 객체를 만들지 않음)
        const w0 = U.TAU * U.clamp(f, 1, sr * 0.49) / sr, cw = Math.cos(w0), al = Math.sin(w0) / (2 * q), ia = 1 / (1 + al);
        const c = cf; c.b0 = (1 - cw) / 2 * ia; c.b1 = (1 - cw) * ia; c.b2 = c.b0; c.a1 = -2 * cw * ia; c.a2 = (1 - al) * ia;
        if (form === 'df1') { y = c.b0 * x + c.b1 * st.x1 + c.b2 * st.x2 - c.a1 * st.y1 - c.a2 * st.y2; st.x2 = st.x1; st.x1 = x; st.y2 = st.y1; st.y1 = y; }
        else if (form === 'df2') { const w = x - c.a1 * st.w1 - c.a2 * st.w2; y = c.b0 * w + c.b1 * st.w1 + c.b2 * st.w2; st.w2 = st.w1; st.w1 = w; }
        else { y = c.b0 * x + st.s1; st.s1 = c.b1 * x - c.a1 * y + st.s2; st.s2 = c.b2 * x - c.a2 * y; }
      }
      if (!(Math.abs(y) < 1e6)) { Object.assign(st, makeState(), { blowups: st.blowups + 1 }); y = 0; } // 발산 보호
      return y;
    }
    const cutoff = (ph) => P.base * Math.pow(2, P.depth * (0.5 + 0.5 * Math.sin(ph)));

    const live = { st: makeState(), ph: 0, lfo: 0, form: P.form };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (live.form !== P.form) { live.st = makeState(); live.form = P.form; }
        for (let i = 0; i < n; i++) {
          const dt = 110 / sr, x = (2 * live.ph - 1 - A.polyBlep(live.ph, dt)) * 0.5;
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          live.lfo += U.TAU * P.rate / sr; if (live.lfo > U.TAU) live.lfo -= U.TAU;
          const y = step(live.st, x, cutoff(live.lfo), P.q, sr, P.form);
          const v = Math.tanh(y * 0.6) * 0.6; // 큰 출력에서 귀 보호
          l[i] = v; r[i] = v;
        }
      },
    });

    let key = '', out = null, fc = null, peak = 0, staticPeak = 0, blow = 0;
    function render1(form, mod) {
      const st = makeState(), y = new Float32Array(N), f = new Float32Array(N);
      let ph = 0, lfo = 0;
      for (let i = 0; i < N; i++) {
        const dt = 110 / SR, x = (2 * ph - 1 - A.polyBlep(ph, dt)) * 0.5;
        ph += dt; if (ph >= 1) ph -= 1;
        lfo += U.TAU * P.rate / SR;
        f[i] = mod ? cutoff(lfo) : cutoff(Math.PI / 2);
        y[i] = step(st, x, f[i], P.q, SR, form);
      }
      y.blowups = st.blowups;
      return { y, f };
    }
    function analyze() {
      const k = [P.form, P.q, P.base, P.depth, P.rate].join();
      if (k === key) return;
      key = k;
      const r = render1(P.form, true);
      out = r.y; fc = r.f; blow = r.y.blowups;
      peak = A.peak(out.subarray(2400));
      // 기준: 같은 구조로 컷오프를 고정했을 때 (변조 범위 안에서 가장 높은 공진 봉우리)
      let sp = 0;
      for (const p of [-Math.PI / 2, 0, Math.PI / 2]) {
        const st = makeState(); let ph = 0;
        for (let i = 0; i < 6000; i++) { const dt = 110 / SR, x = (2 * ph - 1 - A.polyBlep(ph, dt)) * 0.5; ph += dt; if (ph >= 1) ph -= 1; const y = step(st, x, cutoff(p), P.q, SR, 'svf'); if (i > 2400) sp = Math.max(sp, Math.abs(y)); }
      }
      staticPeak = sp;
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2;
        const h1 = (H - pad * 3) * 0.7, h2 = H - pad * 3 - h1;
        const scale = Math.max(peak, staticPeak * 1.2, 1e-3);
        A.drawWave(g, out, pad, pad, rw, h1, { color: col, amp: 1 / scale, label: L('출력 파형 (250ms, 세로 = 최대값 기준)', 'Output (250 ms, height scaled to max)') });
        // 정적 상태의 최대값을 점선으로
        const yS = pad + h1 / 2 - staticPeak / scale * h1 / 2;
        g.setLineDash([4, 3]); D.line(g, pad, yS, pad + rw, yS, C.good, 1); D.line(g, pad, pad + h1 - (yS - pad), pad + rw, pad + h1 - (yS - pad), C.good, 1); g.setLineDash([]);
        D.text(g, L('점선 = 컷오프 고정 시 최대값', 'Dashed = max with a fixed cutoff'), pad + 4, pad + 16, { size: 10, color: C.good });
        // 컷오프 궤적 (로그)
        const y2 = pad * 2 + h1, lo = Math.log(20), hi = Math.log(24000);
        D.rect(g, pad, y2, rw, h2, 'rgba(0,0,0,0.35)');
        g.beginPath();
        const cols = Math.floor(rw);
        for (let c = 0; c <= cols; c++) {
          const i = Math.min(N - 1, Math.floor(c / cols * (N - 1))), py = y2 + h2 - (Math.log(fc[i]) - lo) / (hi - lo) * h2;
          c ? g.lineTo(pad + c, py) : g.moveTo(pad + c, py);
        }
        g.strokeStyle = C.warn; g.lineWidth = 1; g.stroke();
        D.text(g, L('컷오프 (로그, 20Hz~24kHz)', 'Cutoff (log, 20 Hz to 24 kHz)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        ctx.stat(L('최대 출력', 'Max output'), `${peak.toFixed(2)} (${(peak / Math.max(1e-6, staticPeak)).toFixed(1)}x)`);
        ctx.stat(L('컷오프 고정 시 최대', 'Max with fixed cutoff'), staticPeak.toFixed(2));
        if (blow) ctx.stat(L('발산 (상태 초기화)', 'Diverged (state reset)'), blow);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
