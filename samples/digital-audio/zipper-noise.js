// 지퍼 노이즈와 파라미터 스무딩: 게인이나 컷오프를 블록마다 계단처럼 바꾸면 지글거리는 잡음이 생김
GTL.register({
  id: 'zipper-noise',
  title: '지퍼 노이즈와 파라미터 스무딩',
  summary: '자동화로 움직이는 게인, 필터 컷오프를 오디오 블록마다 한 번씩 바꿀 때와 샘플마다 부드럽게 바꿀 때를 비교. 계단식 변화는 지퍼를 여닫는 듯한 지글거림을 만듦.',
  views: { a: '블록마다 계단', b: '원폴 스무딩' },
  controls: '파라미터 표에서 스무딩 방식, 블록 크기, 자동화 속도를 바꿈',
  info: `
    <p>플러그인과 게임 오디오 엔진은 보통 오디오를 블록(예: 512 샘플) 단위로 처리함. UI, MIDI, 자동화에서 오는 파라미터 값도 블록마다 한 번 읽음. 이 값을 그대로 쓰면 파라미터가 블록 경계에서 계단처럼 뜀.</p>
    <p>계단 하나하나가 파형에 작은 꺾임을 만들고, 블록 주기(예: 48 kHz / 512 = 94 Hz)로 반복되어 <b>지퍼 노이즈(Zipper noise)</b>로 들림. MIDI CC처럼 값이 128단계뿐이면 더 심해짐.</p>
    <ul>
      <li><b>선형 램프</b>: 블록 안에서 이전 값에서 새 값까지 직선으로 이동. 꺾임은 남지만 계단은 사라짐.</li>
      <li><b>원폴 스무딩</b>: 매 샘플 <code>v += (목표 - v) * a</code>. 싸고 흔한 방법. 대신 값이 목표를 늦게 따라감.</li>
      <li>필터 컷오프는 계수가 바뀌는 순간 내부 상태와 어긋나 게인보다 더 크게 튈 수 있음. 계수를 샘플마다 다시 계산하거나 SVF처럼 변조에 강한 구조를 씀.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 140" xmlns="http://www.w3.org/2000/svg">
    <text x="20" y="18" class="t-small t-a">${L('블록마다 계단', 'Step per block')}</text>
    <path d="M20,110 H70 V95 H120 V80 H170 V65 H220 V50 H260" class="d-a"/>
    ${[70, 120, 170, 220].map((x) => `<line x1="${x}" y1="120" x2="${x}" y2="128" class="d-dim"/>`).join('')}
    <text x="140" y="138" text-anchor="middle" class="t-small t-dim">${L('블록 경계', 'block boundaries')}</text>
    <text x="300" y="18" class="t-small t-b">${L('원폴 스무딩', 'One-pole smoothing')}</text>
    <path d="M300,110 H350 V95 H400 V80 H450 V65 H500 V50 H520" class="d-dim" stroke-dasharray="3 3"/>
    <path d="M300,110 H350 C365,98 380,96 400,95.5 C415,84 430,81 450,80.5 C465,69 480,66 500,65.5 C508,57 514,53 520,52" class="d-b"/>
    <text x="410" y="138" text-anchor="middle" class="t-small t-dim">${L('점선 = 목표 값, 실선 = 실제 적용 값', 'dashed = target, solid = applied value')}</text>
  </svg>`,
  look: [
    'A의 제어 곡선은 계단이고, 스펙트럼의 배음 사이에 잔디 같은 잡음이 깔림. B는 배음만 깨끗하게 보임.',
    '"소리 켜기"로 A를 들으면 음량이 변하는 동안 지글거리는 잡음이 섞임',
    '블록 크기를 4096으로 키우면 A의 계단이 커지고 잡음이 낮은 주파수 쪽으로 모임',
    '대상을 "필터 컷오프"로 바꾸면 A에서 더 거친 잡음이 들림',
  ],
  refs: [
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '파라미터 스무딩' },
    { type: 'article', title: 'JUCE, SmoothedValue Class Reference', url: 'https://docs.juce.com/master/classSmoothedValue.html', note: '실무 프레임워크의 선형, 지수 스무딩' },
    { type: 'article', title: 'W3C, Web Audio API: AudioParam', url: 'https://www.w3.org/TR/webaudio/#AudioParam', note: 'a-rate, k-rate 파라미터와 setTargetAtTime' },
    { type: 'article', title: 'Andrew Simper, "Linear Trapezoidal Integrated SVF" (Cytomic technical paper)', year: 2013, note: '변조에 강한 상태 변수 필터' },
  ],
  params: [
    { key: 'mode', label: '스무딩 방식', type: 'select', options: [{ value: 'step', label: '없음 (블록마다 계단)' }, { value: 'ramp', label: '선형 램프' }, { value: 'onepole', label: '원폴 스무딩' }], a: 'step', b: 'onepole', default: 'step', group: '파라미터 처리' },
    { key: 'smoothMs', label: '스무딩 시간 (ms)', type: 'range', min: 1, max: 100, step: 1, default: 20, shared: true, when: (p) => p.mode === 'onepole' },
    { key: 'block', label: '블록 크기 (샘플)', type: 'select', options: [64, 256, 1024, 4096].map((v) => ({ value: v, label: String(v) })), default: 1024, shared: true },
    { key: 'midi7', label: '7비트 값 (MIDI CC)', type: 'bool', default: false, shared: true, help: '목표 값을 128단계로 양자화' },
    { key: 'target', label: '대상', type: 'select', options: [{ value: 'gain', label: '게인 (-40~0 dB)' }, { value: 'cutoff', label: '필터 컷오프 (100 Hz~8 kHz)' }], default: 'gain', shared: true, group: '자동화' },
    { key: 'rate', label: '자동화 속도 (Hz)', type: 'range', min: 0.1, max: 4, step: 0.05, default: 0.5, shared: true, help: '삼각파 LFO가 값을 움직이는 빠르기' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Zipper Noise and Parameter Smoothing',
    summary: 'Compares an automated gain or filter cutoff that changes once per audio block with one that changes smoothly every sample. Stepped changes make a buzzing noise like a zipper.',
    views: { a: 'Step per block', b: 'One-pole smoothing' },
    controls: 'Change the smoothing method, block size and automation speed in the parameter table.',
    info: `
    <p>Plugins and game audio engines usually process audio in blocks (for example 512 samples). They read parameter values from the UI, MIDI or automation once per block. Used as is, the parameter jumps like a staircase at block boundaries.</p>
    <p>Each step puts a small kink in the waveform, and it repeats at the block rate (for example 48 kHz / 512 = 94 Hz). You hear it as <b>zipper noise</b>. It gets worse when the value has only 128 steps, as with MIDI CC.</p>
    <ul>
      <li><b>Linear ramp</b>: moves in a straight line from the old value to the new one inside the block. The kinks remain but the steps are gone.</li>
      <li><b>One-pole smoothing</b>: every sample <code>v += (target - v) * a</code>. Cheap and common. The value lags behind the target.</li>
      <li>A filter cutoff can jump harder than gain, because new coefficients no longer match the filter's internal state. Recompute coefficients every sample, or use a structure that handles modulation well, such as an SVF.</li>
    </ul>`,
    look: [
      'A\'s control curve is a staircase, and grass-like noise fills the spectrum between harmonics. B shows only clean harmonics.',
      'Press "Sound on" and listen to A. A buzzing noise mixes in while the volume moves.',
      'Raise the block size to 4096. A\'s steps get bigger and the noise gathers closer to the harmonics.',
      'Switch the target to "Filter cutoff". A sounds even rougher.',
    ],
    refs: ['Parameter smoothing.', 'Linear and exponential smoothing in a production framework.', 'a-rate and k-rate parameters, and setTargetAtTime.', 'A state variable filter that handles modulation well.'],
    params: {
      mode: { label: 'Smoothing', group: 'Parameter handling', options: { step: 'None (step per block)', ramp: 'Linear ramp', onepole: 'One-pole smoothing' } },
      smoothMs: 'Smoothing time (ms)',
      block: 'Block size (samples)',
      midi7: { label: '7 bit values (MIDI CC)', help: 'Quantizes the target to 128 steps' },
      target: { label: 'Target', group: 'Automation', options: { gain: 'Gain (-40 to 0 dB)', cutoff: 'Filter cutoff (100 Hz to 8 kHz)' } },
      rate: { label: 'Automation speed (Hz)', help: 'How fast a triangle LFO moves the value' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, TAU = Math.PI * 2;

    const lfo = (t) => { const p = (t * P.rate) % 1; return 1 - Math.abs(1 - 2 * p); }; // 0~1 삼각파
    const q7 = (v) => (P.midi7 ? Math.round(v * 127) / 127 : v);
    // 상태를 가진 신호 경로. step(sr)이 출력 샘플 1개
    function voice() {
      const st = { n: 0, ph: 0, cur: 0, prev: 0, tgt: 0, x1: 0, x2: 0, y1: 0, y2: 0, c: 0 };
      st.step = (sr) => {
        const t = st.n / sr, B = +P.block;
        {
          if (st.n % B === 0) { st.prev = st.tgt; st.tgt = q7(lfo(t)); if (st.n === 0) st.prev = st.cur = st.tgt; }
          if (P.mode === 'step') st.c = st.tgt;
          else if (P.mode === 'ramp') st.c = st.prev + (st.tgt - st.prev) * ((st.n % B) + 1) / B;
          else { st.cur += (st.tgt - st.cur) * (1 - Math.exp(-1 / (P.smoothMs * 0.001 * sr))); st.c = st.cur; }
        }
        st.n++;
        let y;
        if (P.target === 'gain') {
          st.ph += 220 / sr; if (st.ph >= 1) st.ph -= 1;
          y = Math.sin(TAU * st.ph) * 0.5 * A.dbToLin(-40 + 40 * st.c);
        } else {
          const dt = 110 / sr; st.ph += dt; if (st.ph >= 1) st.ph -= 1;
          const x = (2 * st.ph - 1 - A.polyBlep(st.ph, dt)) * 0.3;
          // RBJ 로우패스 계수를 매 샘플 계산 (Q = 2)
          const fc = 100 * Math.pow(80, st.c), w0 = TAU * fc / sr, cw = Math.cos(w0), al = Math.sin(w0) / 4, a0 = 1 + al;
          const b0 = (1 - cw) / 2 / a0, b1 = (1 - cw) / a0, a1 = -2 * cw / a0, a2 = (1 - al) / a0;
          y = b0 * x + b1 * st.x1 + b0 * st.x2 - a1 * st.y1 - a2 * st.y2;
          st.x2 = st.x1; st.x1 = x; st.y2 = st.y1; st.y1 = y;
        }
        return y;
      };
      return st;
    }

    let live = voice(false);
    const snd = A.player(ctx, { process(l, r, sr, n) { for (let i = 0; i < n; i++) { const v = live.step(sr); l[i] = v; r[i] = v; } } });

    const WIN = 8192;
    let key = '', out = null, ctrl = null, mags = null, zipDb = 0, maxJump = 0;
    function analyze() {
      const k = [P.mode, P.smoothMs, P.block, P.midi7, P.target, P.rate].join('|');
      if (k === key) return;
      key = k;
      const v = voice(false);
      const start = Math.round(SR * 0.15 / P.rate); // 값이 올라가는 구간
      for (let i = 0; i < start; i++) v.step(SR);
      out = new Float32Array(WIN); ctrl = new Float32Array(WIN);
      maxJump = 0; let lastC = null;
      for (let i = 0; i < WIN; i++) {
        out[i] = v.step(SR); ctrl[i] = v.c;
        if (lastC !== null) maxJump = Math.max(maxJump, Math.abs(v.c - lastC));
        lastC = v.c;
      }
      mags = A.spectrum(out, WIN, { window: 'blackman' });
      // 지퍼 잡음: 배음(±20 Hz) 밖의 파워 / 전체 파워
      const F = P.target === 'gain' ? 220 : 110, binHz = SR / WIN;
      let pz = 0, pt = 0;
      for (let b = 1; b < WIN / 2; b++) {
        const f = b * binHz, p = Math.pow(10, mags[b] / 10), h = Math.round(f / F);
        pt += p; if (h < 1 || Math.abs(f - h * F) > 20) pz += p;
      }
      zipDb = 10 * Math.log10(pz / Math.max(1e-30, pt) + 1e-15);
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const ch = Math.max(40, H * 0.22), oh = Math.max(50, H * 0.3);
        // 제어 곡선
        D.rect(g, pad, pad, w, ch, 'rgba(0,0,0,0.35)');
        let lo = Infinity, hi = -Infinity; for (let i = 0; i < WIN; i++) { lo = Math.min(lo, ctrl[i]); hi = Math.max(hi, ctrl[i]); }
        if (hi - lo < 1e-6) hi = lo + 1e-3;
        g.beginPath();
        const cols = Math.floor(w);
        for (let c = 0; c <= cols; c++) { const i = Math.min(WIN - 1, Math.floor(c / cols * WIN)), y = pad + ch - 6 - ((ctrl[i] - lo) / (hi - lo)) * (ch - 20); c ? g.lineTo(pad + c, y) : g.moveTo(pad + c, y); }
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        D.text(g, Lx('적용된 파라미터 값 (0.17초, 세로 확대)', 'Applied parameter value (0.17 s, zoomed)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 출력 파형
        const oy = pad * 2 + ch;
        A.drawWave(g, out, pad, oy, w, oh, { color: col, amp: 1.6, label: Lx('출력 파형', 'Output waveform') });
        // 스펙트럼
        const sy = oy + oh + pad, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, w, sh, { fmin: 50, fmax: 5000, minDb: -120, maxDb: 0, dbStep: 20, color: col, label: Lx('스펙트럼 (배음 사이의 잔디 = 지퍼 잡음)', 'Spectrum (grass between harmonics = zipper noise)') });

        ctx.stat(Lx('지퍼 잡음 (배음 사이)', 'Zipper noise (between harmonics)'), zipDb.toFixed(1) + ' dB');
        ctx.stat(Lx('제어 값 최대 점프 (샘플당)', 'Largest control jump (per sample)'), (maxJump * 100).toFixed(2) + '%');
        ctx.stat(Lx('블록 주기', 'Block rate'), (SR / +P.block).toFixed(1) + ' Hz');
        snd.stat();
      },
      onParam(k) { if (k === 'block' || k === 'target') live = voice(false); },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
