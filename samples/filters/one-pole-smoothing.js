// 원폴 필터 vs 이동 평균: 가장 단순한 두 로우패스의 계단 응답과 주파수 응답 (오디오 필터, 파라미터 스무딩)
GTL.register({
  id: 'one-pole-smoothing',
  title: '원폴 필터와 이동 평균',
  summary: '최근 N개 샘플의 평균(이동 평균)과 y += a(x - y) 한 줄짜리 원폴 필터는 둘 다 가장 단순한 로우패스. 이동 평균은 주파수 응답에 골과 되살아나는 고음이 있고, 원폴은 매끄럽게 줄어듦.',
  views: { a: '이동 평균', b: '원폴 필터' },
  info: `
    <p>값을 부드럽게 만드는 가장 단순한 필터 두 가지. 오디오 신호를 먹먹하게 할 때도, 노브 값이 튀어 생기는 지퍼 잡음(Zipper Noise)을 없앨 때도 씀.</p>
    <ul>
      <li><b>이동 평균(Moving Average)</b>: 최근 N개 샘플의 평균. 누적 합을 쓰면 샘플당 덧셈 2번. 계단 입력에 정확히 N 샘플 뒤 도착하는 직선 램프로 반응. 주파수 응답은 sinc 모양이라 골(완전히 지워지는 주파수)이 있고 그 사이의 고음이 다시 살아남.</li>
      <li><b>원폴(One-pole) 필터</b>: <code>y += a (x - y)</code>. 상태 하나, 곱셈 하나. 계단 입력에 지수 곡선으로 다가감. 주파수 응답은 6dB/oct로 매끄럽게 줄어듦.</li>
    </ul>
    <p>계수 <code>a = 1 - exp(-2π fc / sr)</code>로 정하면 샘플레이트가 바뀌어도 같은 시간 상수가 유지됨. 원폴은 끝값에 정확히 도착하지 않고 계속 다가가기만 함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" class="t-small t-dim">${L('계단 입력에 대한 응답', 'Response to a step input')}</text>
    <path d="M20,120 L80,120 L80,40 L250,40" class="d-dim" stroke-dasharray="3 3"/>
    <path d="M20,120 L80,120 L160,40 L250,40" class="d-a"/>
    <path d="M20,120 L80,120 Q100,60 160,46 Q200,41 250,40.5" class="d-b"/>
    <text x="165" y="70" class="t-small t-a">${L('직선 램프 (N 샘플 뒤 도착)', 'Straight ramp (arrives after N samples)')}</text>
    <text x="90" y="34" class="t-small t-b">${L('지수 곡선', 'Exponential curve')}</text>
    <text x="290" y="18" class="t-small t-dim">${L('주파수 응답', 'Frequency response')}</text>
    <line x1="290" y1="130" x2="530" y2="130" class="d-dim"/>
    <path d="M290,40 L340,42 Q380,60 400,128 Q412,90 425,92 Q438,96 445,128 Q455,105 465,107 Q475,110 482,128 Q490,115 500,116 L530,128" class="d-a"/>
    <path d="M290,40 L340,42 Q380,58 420,85 L530,118" class="d-b"/>
    <text x="400" y="145" text-anchor="middle" class="t-small t-a">${L('골', 'nulls')}</text>
  </svg>`,
  look: [
    '계단 응답 그래프에서 A는 직선으로 올라 정해진 시점에 멈추고, B는 빠르게 출발해 천천히 다가감',
    '주파수 응답에서 A만 바닥까지 꺼지는 골이 반복되고, 골 사이 고음이 -13dB 근처까지 되살아남',
    '원본 소리를 "계단 음량"으로 두고 "소리 켜기"를 누른 뒤 스무딩을 끄면 딱딱 소리가 남. 켜면 두 방식 모두 부드러워짐.',
    '컷오프를 5Hz로 내리면 A의 "평균 길이" 측정값이 4000 샘플을 넘음. B는 여전히 상태 하나.',
  ],
  refs: [
    { type: 'book', title: 'Steven W. Smith, The Scientist and Engineer\'s Guide to Digital Signal Processing, Ch. 15 Moving Average Filters, Ch. 19 Recursive Filters', url: 'https://www.dspguide.com/', note: '이동 평균과 단극 재귀 필터 비교' },
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '원폴 필터와 시간 상수' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '파라미터 스무딩' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', group: '필터', options: [{ value: 'ma', label: '이동 평균' }, { value: 'op', label: '원폴' }], a: 'ma', b: 'op' },
    { key: 'fc', label: '컷오프 (-3dB, Hz)', type: 'range', min: 5, max: 3000, step: 1, default: 800, shared: true, help: '두 방식의 -3dB 지점을 같게 맞춤' },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'noise', label: '화이트 노이즈 (오디오에 필터)' }, { value: 'zipper', label: '계단 음량 (음량에 필터)' }], default: 'noise', shared: true },
    { key: 'on', label: '스무딩 켜기', type: 'bool', default: true, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'One-Pole Filter and Moving Average',
    summary: 'The average of the last N samples (moving average) and the one line one-pole filter y += a(x - y) are the two simplest lowpass filters. The moving average has nulls and highs that come back, while the one-pole falls off smoothly.',
    views: { a: 'Moving average', b: 'One-pole filter' },
    info: `
    <p>These are the two simplest smoothing filters. You use them to make audio duller, and to remove zipper noise when a knob value jumps.</p>
    <ul>
      <li><b>Moving average</b>: the average of the last N samples. With a running sum it costs 2 additions per sample. A step input becomes a straight ramp that arrives exactly N samples later. Its frequency response is a sinc shape, so it has nulls (frequencies removed completely) and the highs come back between them.</li>
      <li><b>One-pole filter</b>: <code>y += a (x - y)</code>. One state, one multiply. A step input approaches the target along an exponential curve. Its response falls off smoothly at 6 dB/oct.</li>
    </ul>
    <p>With <code>a = 1 - exp(-2π fc / sr)</code>, the time constant stays the same at any sample rate. A one-pole never quite reaches the target. It only keeps getting closer.</p>`,
    look: [
      'In the step response, A rises in a straight line and stops at a fixed time. B starts fast and then creeps closer.',
      'In the frequency response, only A has repeated nulls that drop to the floor, and the highs between them come back to about -13 dB.',
      'Set the source to "Stepped volume", press "Sound on" and turn smoothing off. You hear clicks. Turn it on and both methods get smooth.',
      'Lower the cutoff to 5 Hz. A\'s "Average length" stat goes above 4000 samples. B still has one state.',
    ],
    refs: ['Compares moving average and single pole recursive filters.', 'One-pole filters and time constants.', 'Parameter smoothing.'],
    params: {
      method: { label: 'Method', group: 'Filter', options: { ma: 'Moving average', op: 'One-pole' } },
      fc: { label: 'Cutoff (-3 dB, Hz)', help: 'Both methods use the same -3 dB point' },
      src: { label: 'Source', group: 'Sound', options: { noise: 'White noise (filter on audio)', zipper: 'Stepped volume (filter on volume)' } },
      on: 'Smoothing on',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000;
    // 이동 평균의 -3dB 지점은 약 0.443 sr / N
    const maLen = (fc, sr) => Math.max(1, Math.round(0.443 * sr / fc));
    const opCoef = (fc, sr) => A.onePoleCoef(fc, sr);
    function respDb(f, sr) {
      const w = U.TAU * f / sr;
      if (P.method === 'ma') {
        const N = maLen(P.fc, sr), den = N * Math.sin(w / 2);
        return A.linToDb(Math.abs(den) < 1e-12 ? 1 : Math.sin(N * w / 2) / den);
      }
      const a = opCoef(P.fc, sr), b = 1 - a;
      return A.linToDb(a / Math.sqrt(1 + b * b - 2 * b * Math.cos(w)));
    }
    // 상태를 가진 필터. 시각화와 소리가 같은 함수를 씀
    function makeFilter(sr) {
      const st = { buf: new Float64Array(16384), idx: 0, sum: 0, n: 0, y: 0, method: '' };
      return (x) => {
        if (P.method !== st.method) { st.buf.fill(0); st.sum = 0; st.y = x; st.method = P.method; st.n = 0; }
        if (P.method === 'op') { st.y += opCoef(P.fc, sr) * (x - st.y); return st.y; }
        const N = maLen(P.fc, sr);
        if (N !== st.n) { // 길이가 바뀌면 현재 값으로 채워 다시 시작
          for (let i = 0; i < N; i++) st.buf[i] = x;
          st.sum = x * N; st.idx = 0; st.n = N;
        }
        st.sum += x - st.buf[st.idx]; st.buf[st.idx] = x; st.idx = (st.idx + 1) % N;
        return st.sum / N;
      };
    }

    const live = { flt: makeFilter(SR), r: U.rng(3), t: 0, sr: SR };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (live.sr !== sr) { live.flt = makeFilter(sr); live.sr = sr; }
        for (let i = 0; i < n; i++) {
          let y;
          if (P.src === 'noise') { const x = live.r.range(-1, 1) * 0.35; y = P.on ? live.flt(x) * Math.min(4, Math.sqrt(sr / 2 / P.fc) * 0.5 + 0.5) : x * 0.5; }
          else {
            // 60ms마다 음량이 계단처럼 바뀌는 440Hz 사인파
            const step = Math.floor(live.t / 0.06), gTarget = [0.1, 0.9, 0.3, 0.7, 0.05, 1, 0.5, 0.2][step % 8];
            const gNow = P.on ? live.flt(gTarget) : gTarget;
            y = Math.sin(U.TAU * 440 * live.t) * gNow * 0.45;
          }
          live.t += 1 / sr;
          l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', step = null;
    const STEPN = 600;
    function analyze() {
      const k = P.method + P.fc;
      if (k === key) return;
      key = k;
      // 계단 응답: 표시 폭은 두 방식이 모두 도착하는 시간의 1.5배
      const len = Math.max(maLen(P.fc, SR) * 1.6, 3 / (U.TAU * P.fc / SR)), f = makeFilter(SR);
      step = new Float32Array(STEPN);
      f(0);
      const per = len / STEPN;
      let tIn = 0;
      for (let i = 0; i < STEPN; i++) {
        const target = (i + 1) * per;
        let v = 0;
        while (tIn < target) { v = f(tIn < len * 0.1 ? 0 : 1); tIn++; }
        step[i] = v * 2 - 1;
      }
      step.lenMs = len / SR * 1000;
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, rw = W - pad * 2;
        const h1 = Math.max(50, (H - pad * 3) * 0.45);
        A.drawWave(g, step, pad, pad, rw, h1, { color: col, amp: 0.85, label: L(`계단 응답 (가로 ${step.lenMs.toFixed(1)}ms)`, `Step response (width ${step.lenMs.toFixed(1)} ms)`) });
        const ry = pad * 2 + h1, rh = H - ry - pad;
        A.drawResponse(g, (f) => respDb(f, SR), pad, ry, rw, rh, { color: col, minDb: -60, maxDb: 6, label: L('주파수 응답', 'Frequency response') });
        const fx = A.freqX(P.fc, pad, rw, 20, 20000);
        D.line(g, fx, ry, fx, ry + rh, C.warn, 1);
        // 계단 응답에서 90%에 도달하는 시간
        let t90 = 0; for (let i = 0; i < STEPN; i++) if (step[i] < 0.8) t90 = i;
        const t90ms = (t90 + 1) / STEPN * step.lenMs - step.lenMs * 0.1;
        ctx.stat(L('90% 도달 시간', 'Time to 90%'), t90ms.toFixed(2) + ' ms');
        ctx.stat(L('평균 길이 / 상태 수', 'Average length / states'), P.method === 'ma' ? maLen(P.fc, SR) + L(' 샘플', ' samples') : L('상태 1개', '1 state'));
        ctx.stat(L('4 x 컷오프에서', 'At 4 x cutoff'), respDb(Math.min(23999, P.fc * 4), SR).toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
