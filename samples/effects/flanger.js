// 플랜저: 아주 짧은 변조 지연(0.1~10ms)이 만드는 콤 필터. 피드백 없음 vs 피드백, through-zero 옵션
GTL.register({
  id: 'flanger',
  title: '플랜저 (콤 필터 스윕, 피드백, through-zero)',
  summary: '원음에 1~10ms 늦은 복사본을 더하면 일정 간격으로 파인 콤 필터가 생김. 지연을 LFO로 흔들면 골이 위아래로 쓸려 제트기 같은 소리가 남. 피드백은 골 사이의 봉우리를 날카롭게 만듦.',
  views: { a: '피드백 0', b: '피드백 0.75' },
  controls: '파라미터 표에서 피드백, 깊이, 속도를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>플랜저(Flanger)</b>는 코러스와 같은 변조 지연 구조지만 지연이 훨씬 짧음(0.1~10ms). 귀가 메아리로 듣지 못하고 음색 변화로 들음.</p>
    <p>x(t) + x(t - D)는 주파수 응답이 <b>콤 필터(Comb filter)</b>: f = (k + 1/2) / D 에서 위상이 반대가 되어 소리가 사라지고, f = k / D 에서 두 배가 됨. D가 변하면 골의 간격이 바뀌며 스펙트럼을 쓸고 지나감.</p>
    <ul>
      <li><b>피드백</b>: 지연 출력을 다시 지연 입력에 더함. 응답이 1 / (1 - g e<sup>-jωD</sup>) 모양이 되어 봉우리가 날카롭고 높아짐. 음수 g는 봉우리와 골의 위치를 반 칸 옮김.</li>
      <li><b>Through-zero</b>: 원음도 고정 지연을 거치게 해서 상대 지연이 0을 지나가게 함. 테이프 두 대로 하던 원래 플랜징처럼 0에서 소리가 완전히 겹쳤다가 다시 벌어짐.</li>
      <li>지연이 1샘플보다 짧은 범위를 다루므로 소수 지연 보간(선형 이상)이 꼭 필요함</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-dim">${L('|H(f)|, 지연 D일 때', '|H(f)| for delay D')}</text>
    <line x1="20" y1="140" x2="520" y2="140" class="d-line"/>
    <path d="M20,60 Q45,60 70,138 Q95,60 120,60 Q145,60 170,138 Q195,60 220,60 Q245,60 270,138 Q295,60 320,60 Q345,60 370,138 Q395,60 420,60 Q445,60 470,138 Q495,60 520,60" class="d-a"/>
    <path d="M20,30 Q30,110 45,118 L70,124 L95,118 Q110,110 120,30 Q130,110 145,118 L170,124 L195,118 Q210,110 220,30 Q230,110 245,118 L270,124 L295,118 Q310,110 320,30 Q330,110 345,118 L370,124 L395,118 Q410,110 420,30 Q430,110 445,118 L470,124 L495,118 Q510,110 520,30" class="d-b"/>
    <text x="70" y="156" text-anchor="middle" class="t-small">1/2D</text><text x="120" y="156" text-anchor="middle" class="t-small">1/D</text><text x="170" y="156" text-anchor="middle" class="t-small">3/2D</text><text x="220" y="156" text-anchor="middle" class="t-small">2/D</text>
    <text x="330" y="166" class="t-small t-a">${L('피드백 0: 둥근 봉우리, 깊은 골', 'Feedback 0: round peaks, deep notches')}</text>
    <text x="300" y="22" class="t-small t-b">${L('피드백 0.75: 날카로운 봉우리', 'Feedback 0.75: sharp peaks')}</text>
    <text x="10" y="166" class="t-small t-dim">${L('주파수 (선형)', 'Frequency (linear)')}</text>
  </svg>`,
  look: [
    'A와 B의 응답 곡선을 비교하면 B는 봉우리가 가늘고 높게 솟음. 소리로는 금속성 울림이 강함.',
    '피드백을 -0.75로 바꾸면 봉우리 자리에 골이 생김. 음색이 속이 빈 소리로 바뀜.',
    'through-zero를 켜면 지연이 0을 지날 때 곡선이 평평해졌다가 다시 콤으로 벌어짐',
    '음원을 노이즈로 바꾸면 쓸리는 소리가 가장 잘 들림',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '3장 플랜저, 콤 필터' },
    { type: 'paper', title: 'Jon Dattorro, "Effect Design, Part 2: Delay-Line Modulation and Chorus", Journal of the Audio Engineering Society 45(10)', year: 1997, note: '플랜저와 보간 지연선' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: 'Feedforward, feedback 콤 필터와 플랜저' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed., Routledge', year: 2019, note: '플랜저 구현' },
  ],
  params: [
    { key: 'fb', label: '피드백 g', type: 'range', min: -0.95, max: 0.95, step: 0.01, a: 0, b: 0.75, group: '플랜저' },
    { key: 'tz', label: 'Through-zero', type: 'bool', default: false },
    { key: 'base', label: '최소 지연 (ms)', type: 'range', min: 0.1, max: 5, step: 0.05, default: 0.3, shared: true, when: (p) => !p.tz },
    { key: 'depth', label: '깊이 (ms)', type: 'range', min: 0.1, max: 8, step: 0.05, default: 3, shared: true },
    { key: 'rate', label: '속도 (Hz)', type: 'range', min: 0.02, max: 2, step: 0.01, default: 0.15, shared: true },
    { key: 'mix', label: '복사본 음량 (wet)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.9, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'noise', label: '핑크 노이즈' }, { value: 'pad', label: '톱니 화음' }, { value: 'drums', label: '드럼' }], default: 'pad', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Flanger (Comb Sweep, Feedback, Through-Zero)',
    summary: 'Adding a copy 1 to 10 ms late to the dry sound makes a comb filter with evenly spaced notches. Moving the delay with an LFO sweeps the notches up and down, which gives a jet-plane sound. Feedback makes the peaks between notches sharp.',
    views: { a: 'Feedback 0', b: 'Feedback 0.75' },
    controls: 'Change feedback, depth and rate in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>A <b>flanger</b> uses the same modulated delay as a chorus, but the delay is much shorter (0.1 to 10 ms). The ear does not hear an echo. It hears a change in tone.</p>
    <p>x(t) + x(t - D) has a <b>comb filter</b> response. At f = (k + 1/2) / D the two signals are out of phase and cancel. At f = k / D they double. When D changes, the notch spacing changes and the notches sweep across the spectrum.</p>
    <ul>
      <li><b>Feedback</b>: the delay output is added back to the delay input. The response becomes 1 / (1 - g e<sup>-jωD</sup>), so the peaks get sharp and tall. A negative g moves peaks and notches by half a step.</li>
      <li><b>Through-zero</b>: the dry signal also goes through a fixed delay, so the relative delay passes through 0. Like the original two-tape flanging, the signals line up fully at 0 and then spread again.</li>
      <li>The delay goes below one sample, so fractional delay interpolation (linear or better) is required.</li>
    </ul>`,
    look: [
      'Compare the response curves of A and B. B has thin, tall peaks. It sounds more metallic.',
      'Set feedback to -0.75. Notches appear where the peaks were. The tone gets hollow.',
      'Turn on through-zero. When the delay passes 0 the curve goes flat, then opens into a comb again.',
      'Switch the source to noise. The sweep is easiest to hear.',
    ],
    refs: ['Ch. 3 flanger and comb filters.', 'Flanger and interpolated delay lines.', 'Feedforward and feedback comb filters, flanger.', 'Flanger code.'],
    params: {
      fb: { label: 'Feedback g', group: 'Flanger' },
      tz: 'Through-zero',
      base: 'Minimum delay (ms)',
      depth: 'Depth (ms)',
      rate: 'Rate (Hz)',
      mix: 'Copy level (wet)',
      src: { label: 'Source', group: 'Source', options: { noise: 'Pink noise', pad: 'Saw chord', drums: 'Drums' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;

    function makeSource(sr) {
      const pink = A.noiseBuffer(sr * 2, 5, 'pink'), white = A.noiseBuffer(sr, 9);
      const chord = [43, 50, 55, 59], ph = [0, 0, 0, 0];
      let n = 0, kp = 0;
      return () => {
        n++;
        if (P.src === 'noise') return pink[n % pink.length] * 0.35;
        if (P.src === 'pad') {
          let v = 0;
          for (let i = 0; i < 4; i++) { ph[i] += A.mtof(chord[i]) / sr; ph[i] -= Math.floor(ph[i]); v += A.wave.saw(ph[i]); }
          return v * 0.08;
        }
        const step = Math.round(sr * 0.25), k = Math.floor(n / step) % 8, t = (n % step) / sr, nz = white[n % sr];
        if (k === 0 || k === 3) { kp += (50 + 100 * Math.exp(-t * 30)) / sr; return Math.sin(TAU * kp) * Math.exp(-t * 8) * 0.45; }
        if (k === 2 || k === 6) return nz * Math.exp(-t * 20) * 0.35;
        return nz * Math.exp(-t * 50) * 0.15;
      };
    }
    // 현재 지연(초). through-zero면 원음 고정 지연 Dc = depth를 기준으로 상대 지연이 -depth ~ +depth
    const lfo = (t) => Math.sin(TAU * P.rate * t);
    const wetDelay = (t) => (P.tz ? (P.depth * (1 + lfo(t))) : (P.base + P.depth * 0.5 * (1 + lfo(t)))) / 1000;
    const dryDelay = () => (P.tz ? P.depth / 1000 : 0);

    function makeFlanger(sr) {
      const size = Math.ceil(sr * 0.03) + 4, buf = new Float32Array(size), dbuf = new Float32Array(size);
      let w = 0, n = 0, last = 0;
      const read = (b, d) => { let p = w - d; while (p < 0) p += size; const i0 = Math.floor(p), fr = p - i0; return b[i0] + (b[(i0 + 1) % size] - b[i0]) * fr; };
      const fn = (x) => {
        const t = n / sr; n++;
        dbuf[w] = x;
        buf[w] = x + P.fb * last;
        const y = read(buf, Math.max(0, wetDelay(t) * sr));
        last = y;
        const dry = P.tz ? read(dbuf, dryDelay() * sr) : x;
        w = (w + 1) % size;
        return (dry + P.mix * y) * 0.5 * (1 - Math.abs(P.fb) * 0.5);
      };
      fn.time = () => n / sr;
      return fn;
    }
    // 이론 응답: dry e^{-jωDc} + mix e^{-jωD} / (1 - g e^{-jωD}), 같은 출력 이득
    function resp(f, Dw, Dc) {
      const w1 = TAU * f * Dw, w0 = TAU * f * Dc;
      const er = Math.cos(w1), ei = -Math.sin(w1);
      const den_r = 1 - P.fb * er, den_i = -P.fb * ei, dd = den_r * den_r + den_i * den_i;
      const qr = (er * den_r + ei * den_i) / dd, qi = (ei * den_r - er * den_i) / dd;
      const hr = Math.cos(w0) + P.mix * qr, hi = -Math.sin(w0) + P.mix * qi;
      return A.linToDb(Math.hypot(hr, hi) * 0.5 * (1 - Math.abs(P.fb) * 0.5));
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeFlanger(sr) };
        for (let i = 0; i < n; i++) { const v = live.fx(live.src()); l[i] = v; r[i] = v; }
      },
    });
    let tShow = 0;

    return {
      update(dt) { snd.update(); tShow += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const t = live && snd.on ? live.fx.time() : tShow, Dw = wetDelay(t), Dc = dryDelay();
        const rh = Math.max(80, H * 0.62);
        let mx = -200, mn = 200;
        A.drawResponse(g, (f) => { const v = resp(f, Dw, Dc); if (v > mx) mx = v; if (v < mn) mn = v; return v; }, pad, pad, w, rh, { color: col, minDb: -40, maxDb: 20, dbStep: 10, label: GTL.L('주파수 응답 (지금 LFO 위치)', 'Frequency response (current LFO position)') });
        // 지연 시간 궤적
        const ty = pad * 2 + rh, th = H - ty - pad;
        if (th > 24) {
          D.rect(g, pad, ty, w, th, 'rgba(0,0,0,0.35)');
          const span = Math.min(20, 2 / P.rate), maxMs = P.tz ? P.depth * 2 : P.base + P.depth;
          const rel = (tt) => (wetDelay(tt) - Dc) * 1000;
          const lo = P.tz ? -P.depth : 0, hi = P.tz ? P.depth : maxMs;
          g.beginPath();
          for (let i = 0; i <= 160; i++) {
            const tt = t - span + span * i / 160, px = pad + w * i / 160, py = ty + th - 4 - (rel(tt) - lo) / Math.max(1e-6, hi - lo) * (th - 8);
            i ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
          if (P.tz) { const zy = ty + th - 4 - (0 - lo) / (hi - lo) * (th - 8); D.line(g, pad, zy, pad + w, zy, C.warn, 1); }
          D.text(g, GTL.L(`상대 지연 (ms, 최근 ${span.toFixed(1)}초)`, `Relative delay (ms, last ${span.toFixed(1)} s)`), pad + 4, ty + 3, { size: 10, color: C.dim });
        }
        const rd = (Dw - Dc) * 1000;
        ctx.stat(GTL.L('상대 지연', 'Relative delay'), rd.toFixed(2) + ' ms');
        ctx.stat(GTL.L('첫 골 주파수', 'First notch'), Math.abs(rd) > 0.02 ? (P.fb >= 0 ? 500 / Math.abs(rd) : 1000 / Math.abs(rd)).toFixed(0) + ' Hz' : GTL.L('없음 (지연 0)', 'None (delay 0)'));
        ctx.stat(GTL.L('봉우리 - 골 차이', 'Peak to notch'), (mx - Math.max(mn, -60)).toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
