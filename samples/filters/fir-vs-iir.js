// FIR vs IIR: 같은 컷오프의 버터워스 IIR과 윈도 싱크 FIR을 크기, 위상, 군지연, 임펄스 응답으로 비교
GTL.register({
  id: 'fir-vs-iir',
  title: 'FIR 필터와 IIR 필터',
  summary: 'IIR은 되먹임 덕분에 계산 몇 번으로 가파른 응답을 얻지만 주파수마다 지연이 다름. 대칭 FIR은 모든 주파수를 똑같이 늦춰 파형 모양을 지키지만 탭이 많이 필요하고 지연이 큼.',
  views: { a: 'IIR (버터워스 4차)', b: 'FIR (윈도 싱크)' },
  info: `
    <p><b>IIR(Infinite Impulse Response)</b> 필터는 출력을 다시 입력에 섞는 되먹임이 있어서 임펄스 응답이 끝없이 이어짐. 바이쿼드 2개(곱셈 약 10번)로 24dB/oct를 얻음. 대신 위상이 주파수마다 다르게 돌아서 컷오프 근처 성분이 더 늦게 나옴.</p>
    <p><b>FIR(Finite Impulse Response)</b> 필터는 최근 N개 입력에 계수(탭)를 곱해 더함. 되먹임이 없어 항상 안정. 계수를 좌우 대칭으로 만들면 <b>선형 위상</b>: 모든 주파수가 정확히 (N-1)/2 샘플 늦게 나와서 파형 모양이 그대로 유지됨.</p>
    <ul>
      <li><b>군지연(Group Delay)</b>: 주파수별로 소리가 얼마나 늦게 나오는지. IIR은 컷오프에서 봉우리, FIR은 평평.</li>
      <li>윈도 싱크 FIR: 이상적인 로우패스의 임펄스 응답(sinc)을 N개로 자르고 창 함수(Blackman)로 끝을 부드럽게 줄임</li>
      <li>FIR을 가파르게 만들려면 탭 수와 지연이 같이 늘어남. 실시간 연주에는 IIR, 마스터링과 크로스오버에는 FIR을 많이 씀.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" class="t-small t-a">${L('IIR: 비대칭, 끝없이 줄어듦', 'IIR: asymmetric, decays forever')}</text>
    <line x1="20" y1="90" x2="250" y2="90" class="d-dim"/>
    <path d="M20,90 L30,90 L36,40 L46,70 L56,104 L68,96 L80,86 L95,92 L110,89 L130,90.5 L250,90" class="d-a"/>
    <text x="290" y="18" class="t-small t-b">${L('FIR: 좌우 대칭, N 샘플에서 끝남', 'FIR: symmetric, ends after N samples')}</text>
    <line x1="290" y1="90" x2="520" y2="90" class="d-dim"/>
    <path d="M300,90 L330,91 L350,88 L370,96 L385,80 L395,40 L405,30 L415,40 L425,80 L440,96 L460,88 L480,91 L510,90" class="d-b"/>
    <line x1="405" y1="25" x2="405" y2="125" class="d-dim" stroke-dasharray="3 3"/>
    <text x="405" y="140" text-anchor="middle" class="t-small t-dim">${L('중심 = 지연 (N-1)/2 샘플', 'center = delay of (N-1)/2 samples')}</text>
    <text x="135" y="140" text-anchor="middle" class="t-small t-dim">${L('주파수마다 지연이 다름', 'delay differs by frequency')}</text>
  </svg>`,
  look: [
    '군지연 그래프에서 A는 컷오프 근처에 봉우리가 솟고, B는 모든 주파수에서 평평한 선',
    'FIR 탭 수를 31로 줄이면 B의 크기 응답이 완만해지고 저지 대역 바닥이 올라옴',
    '"곱셈 수 (샘플당)" 측정값을 비교하면 A는 10, B는 탭 수만큼 필요함',
    '임펄스 응답에서 A는 클릭 직후 바로 반응하고 꼬리가 한쪽으로 길게 남음. B는 좌우 대칭으로 뒤늦게 봉우리가 옴.',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications', url: 'https://ccrma.stanford.edu/~jos/filters/', note: 'FIR, IIR, 위상 응답, 군지연' },
    { type: 'book', title: 'Steven W. Smith, The Scientist and Engineer\'s Guide to Digital Signal Processing, Ch. 16 Windowed-Sinc Filters', url: 'https://www.dspguide.com/', note: '윈도 싱크 FIR 설계' },
    { type: 'book', title: 'Alan V. Oppenheim, Ronald W. Schafer, Discrete-Time Signal Processing, 3rd ed.', year: 2009, note: '선형 위상 FIR과 IIR 설계 이론' },
    { type: 'book', title: 'Richard G. Lyons, Understanding Digital Signal Processing, 3rd ed.', year: 2010, note: 'FIR과 IIR의 장단점 비교' },
  ],
  params: [
    { key: 'method', label: '필터', type: 'select', group: '필터', options: [{ value: 'iir', label: 'IIR (버터워스 4차)' }, { value: 'fir', label: 'FIR (윈도 싱크)' }], a: 'iir', b: 'fir' },
    { key: 'fc', label: '컷오프 (Hz)', type: 'range', min: 200, max: 8000, step: 10, default: 1500, shared: true },
    { key: 'taps', label: 'FIR 탭 수', type: 'int', min: 15, max: 255, step: 2, default: 127, shared: true, when: (p) => p.method === 'fir', help: '홀수. 많을수록 가파르고 지연이 큼' },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'saw', label: '톱니파 프레이즈' }, { value: 'click', label: '클릭 반복' }], default: 'saw', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'FIR and IIR Filters',
    summary: 'An IIR filter uses feedback to get a steep response with a few operations, but each frequency is delayed differently. A symmetric FIR filter delays every frequency by the same amount and keeps the waveform shape, but it needs many taps and adds more delay.',
    views: { a: 'IIR (Butterworth 4th order)', b: 'FIR (windowed sinc)' },
    info: `
    <p>An <b>IIR (infinite impulse response)</b> filter feeds its output back into its input, so its impulse response goes on forever. Two biquads (about 10 multiplies) give 24 dB/oct. But the phase turns differently for each frequency, so parts near the cutoff come out later.</p>
    <p>An <b>FIR (finite impulse response)</b> filter multiplies the last N inputs by coefficients (taps) and adds them. It has no feedback, so it is always stable. If the taps are symmetric, the phase is <b>linear</b>: every frequency comes out exactly (N-1)/2 samples late, so the waveform shape is kept.</p>
    <ul>
      <li><b>Group delay</b>: how late each frequency comes out. IIR has a peak at the cutoff, FIR is flat.</li>
      <li>Windowed sinc FIR: cut the impulse response of an ideal lowpass (sinc) to N samples and fade its ends with a window (Blackman).</li>
      <li>A steeper FIR needs more taps and more delay. Live playing often uses IIR, while mastering and crossovers often use FIR.</li>
    </ul>`,
    look: [
      'In the group delay graph, A has a peak near the cutoff. B is a flat line at every frequency.',
      'Lower the FIR taps to 31. B\'s magnitude gets gentler and the stopband floor rises.',
      'Compare the "Multiplies (per sample)" stat. A needs 10, B needs as many as the taps.',
      'In the impulse response, A reacts right after the click and leaves a long tail on one side. B is symmetric and its peak comes late.',
    ],
    refs: ['FIR, IIR, phase response and group delay.', 'Windowed sinc FIR design.', 'Theory of linear phase FIR and IIR design.', 'Pros and cons of FIR vs IIR.'],
    params: {
      method: { label: 'Filter', group: 'Filter', options: { iir: 'IIR (Butterworth 4th order)', fir: 'FIR (windowed sinc)' } },
      fc: 'Cutoff (Hz)',
      taps: { label: 'FIR taps', help: 'Odd number. More taps are steeper and add more delay' },
      src: { label: 'Source', group: 'Sound', options: { saw: 'Saw phrase', click: 'Repeated clicks' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, M = 240;

    function firTaps(fc, n, sr) {
      const h = new Float64Array(n), m = (n - 1) / 2, wc = 2 * fc / sr;
      let s = 0;
      for (let i = 0; i < n; i++) {
        const x = i - m, sinc = x === 0 ? wc : Math.sin(Math.PI * wc * x) / (Math.PI * x);
        h[i] = sinc * A.windows.blackman(i, n); s += h[i];
      }
      for (let i = 0; i < n; i++) h[i] /= s; // DC 게인 1
      return h;
    }
    const iirSecs = (fc, sr) => [0.5412, 1.3066].map((q) => A.biquad('lowpass', fc, q, 0, sr));
    // 복소 응답 (re, im)
    function cresp(f, d) {
      const w = U.TAU * f / SR;
      if (d.fir) {
        let re = 0, im = 0;
        for (let i = 0; i < d.fir.length; i++) { re += d.fir[i] * Math.cos(w * i); im -= d.fir[i] * Math.sin(w * i); }
        return [re, im];
      }
      let re = 1, im = 0;
      for (const c of d.secs) {
        const r = A.biquadResponse(c, f, SR), mr = r.mag * Math.cos(r.phase), mi = r.mag * Math.sin(r.phase);
        const nr = re * mr - im * mi; im = re * mi + im * mr; re = nr;
      }
      return [re, im];
    }

    function makeFilter(sr) {
      const st = { key: '', fir: null, buf: new Float64Array(256), idx: 0, secs: null, s: [{}, {}] };
      return (x) => {
        const k = P.method + P.fc + ',' + P.taps;
        if (k !== st.key) {
          st.key = k;
          if (P.method === 'fir') st.fir = firTaps(P.fc, P.taps | 1, sr);
          else { const ns = iirSecs(P.fc, sr); st.secs = ns.map((c, j) => Object.assign(c, st.secs && st.secs[j] ? { x1: st.secs[j].x1, x2: st.secs[j].x2, y1: st.secs[j].y1, y2: st.secs[j].y2 } : {})); }
        }
        st.buf[st.idx] = x;
        let y;
        if (P.method === 'fir') {
          const h = st.fir, n = h.length; y = 0;
          for (let i = 0; i < n; i++) y += h[i] * st.buf[(st.idx - i + 256) & 255];
        } else { y = st.secs[1].process(st.secs[0].process(x)); }
        st.idx = (st.idx + 1) & 255;
        return y;
      };
    }
    function makeSource() {
      let ph = 0, t = 0, c = 0;
      const notes = [57, 64, 69, 72, 76, 72, 69, 64];
      return (sr) => {
        const pos = t * 4, step = Math.floor(pos), local = pos - step;
        t += 1 / sr;
        if (P.src === 'click') return c++ % Math.round(sr / 4) === 0 ? 0.9 : 0;
        const f = A.mtof(notes[step % notes.length]), dt = f / sr;
        const v = 2 * ph - 1 - A.polyBlep(ph, dt);
        ph += dt; if (ph >= 1) ph -= 1;
        return v * Math.min(1, local * 80) * (1 - 0.5 * local) * 0.4;
      };
    }

    const live = { flt: makeFilter(SR), src: makeSource() };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) { const y = live.flt(live.src(sr)); l[i] = y; r[i] = y; }
      },
    });

    let key = '', mag = null, gd = null, ir = null, freqs = null, delay = 0;
    function analyze() {
      const k = P.method + P.fc + ',' + P.taps;
      if (k === key) return;
      key = k;
      const d = P.method === 'fir' ? { fir: firTaps(P.fc, P.taps | 1, SR) } : { secs: iirSecs(P.fc, SR) };
      freqs = new Float32Array(M); mag = new Float32Array(M); gd = new Float32Array(M);
      for (let i = 0; i < M; i++) {
        const f = 20 * Math.pow(1000, i / (M - 1)), df = f * 0.002;
        const [r0, i0] = cresp(f, d), [r1, i1] = cresp(f + df, d);
        freqs[i] = f; mag[i] = A.linToDb(Math.hypot(r0, i0));
        let dp = Math.atan2(i1, r1) - Math.atan2(i0, r0);
        dp = Math.atan2(Math.sin(dp), Math.cos(dp));
        gd[i] = -dp / (U.TAU * df / SR); // 샘플 단위
      }
      ir = new Float32Array(400);
      const f = makeFilter(SR);
      for (let i = 0; i < 400; i++) ir[i] = f(i === 40 ? 1 : 0);
      delay = gd[Math.round((M - 1) * Math.log(100 / 20) / Math.log(1000))];
    }
    const interp = (arr, f) => { const p = U.clamp(Math.log(f / 20) / Math.log(1000) * (M - 1), 0, M - 1), i = Math.floor(p), t = p - i; return arr[i] * (1 - t) + arr[Math.min(M - 1, i + 1)] * t; };

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2;
        const h3 = (H - pad * 4) / 3;
        A.drawResponse(g, (f) => interp(mag, f), pad, pad, rw, h3, { color: col, minDb: -100, maxDb: 6, dbStep: 24, label: L('크기 응답', 'Magnitude') });
        // 군지연 (ms)
        const y2 = pad * 2 + h3, maxMs = 4;
        A.drawResponse(g, (f) => interp(gd, f) / SR * 1000, pad, y2, rw, h3, { color: col, minDb: 0, maxDb: maxMs, dbStep: 1, grid: false, label: L('군지연 (0~4ms)', 'Group delay (0 to 4 ms)') });
        A.drawFreqGrid(g, pad, y2, rw, h3, {});
        const fx = A.freqX(P.fc, pad, rw, 20, 20000);
        D.line(g, fx, pad, fx, y2 + h3, C.warn, 1);
        const y3 = pad * 3 + h3 * 2;
        A.drawWave(g, ir, pad, y3, rw, h3, { color: col, amp: 0.9 / Math.max(0.05, A.peak(ir)), label: L('임펄스 응답 (점선 = 클릭 시점, 400 샘플)', 'Impulse response (dashed = click time, 400 samples)') });
        const cx = pad + rw * 40 / 399;
        g.setLineDash([3, 3]); D.line(g, cx, y3, cx, y3 + h3, C.dim, 1); g.setLineDash([]);
        const gdFc = interp(gd, P.fc);
        ctx.stat(L('지연 (100Hz)', 'Delay (100 Hz)'), (delay / SR * 1000).toFixed(2) + ' ms');
        ctx.stat(L('지연 (컷오프)', 'Delay (cutoff)'), (gdFc / SR * 1000).toFixed(2) + ' ms');
        ctx.stat(L('곱셈 수 (샘플당)', 'Multiplies (per sample)'), P.method === 'fir' ? (P.taps | 1) : 10);
        ctx.stat(L('2 x 컷오프에서', 'At 2 x cutoff'), interp(mag, Math.min(20000, P.fc * 2)).toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
