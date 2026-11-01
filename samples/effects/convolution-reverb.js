// 컨볼루션 리버브: 직접 컨볼루션 vs 균일 분할 FFT 컨볼루션(UPOLS). 결과는 같고 비용이 수백 배 다름
GTL.register({
  id: 'convolution-reverb',
  title: '컨볼루션 리버브 (직접 계산 vs 분할 FFT)',
  summary: '컨볼루션 리버브는 공간의 임펄스 응답(IR)을 소리에 그대로 곱해 더함. 직접 계산하면 IR 샘플 수만큼 샘플마다 곱해야 해서 실시간이 불가능함. IR을 블록으로 나눠 FFT로 계산하면 같은 결과를 수백 분의 1 비용으로 얻음.',
  views: { a: '직접 컨볼루션', b: '분할 FFT 컨볼루션' },
  controls: '파라미터 표에서 IR 종류, 길이, 블록 크기를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>컨볼루션(Convolution)</b> <code>y[n] = Σ h[k] x[n-k]</code>는 선형 시불변 시스템의 출력을 정확히 계산함. 실제 공간에서 녹음한 IR을 쓰면 그 공간의 잔향을 그대로 재현함. 이 샘플의 IR은 코드로 만든 합성 IR.</p>
    <ul>
      <li><b>직접 계산</b>: 출력 샘플마다 IR 길이 N번 곱함. 2초 IR(48kHz, 96000탭)이면 1초에 약 46억 번. 짧은 IR(수백 탭)에는 지연이 없어 좋음.</li>
      <li><b>FFT 컨볼루션</b>: 시간 영역의 컨볼루션은 주파수 영역의 곱셈. 하지만 IR 전체를 한 번에 FFT하면 IR 길이만큼 지연이 생김.</li>
      <li><b>균일 분할(UPOLS)</b>: IR을 B샘플 블록 P개로 나눠 각각 FFT해 둠. 입력 블록 B개가 들어올 때마다 FFT 1번, 스펙트럼 곱셈 P번, 역FFT 1번. 지연은 B샘플.</li>
    </ul>
    <p>블록이 작을수록 지연은 줄지만 블록당 FFT 비용과 곱셈이 늘어남. 상용 리버브는 앞부분은 작은 블록, 뒷부분은 큰 블록을 쓰는 불균일 분할(Gardner 1995)로 둘을 함께 잡음. 이 샘플의 소리는 두 뷰 모두 분할 FFT 엔진으로 재생함. 직접 방식은 실시간으로 돌리면 브라우저가 멈추기 때문. 결과가 같다는 것은 "두 방식의 출력 차이" 값으로 확인함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 196" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="6" y="16" class="t-small">${L('IR을 B샘플 블록으로 나눔', 'Split the IR into blocks of B samples')}</text>
    <rect x="10" y="24" width="60" height="22" class="f-b" opacity="0.9"/><rect x="72" y="24" width="60" height="22" class="f-b" opacity="0.7"/><rect x="134" y="24" width="60" height="22" class="f-b" opacity="0.5"/><rect x="196" y="24" width="60" height="22" class="f-b" opacity="0.35"/><rect x="258" y="24" width="60" height="22" class="f-b" opacity="0.2"/>
    <text x="40" y="39" text-anchor="middle" class="t-small">H0</text><text x="102" y="39" text-anchor="middle" class="t-small">H1</text><text x="164" y="39" text-anchor="middle" class="t-small">H2</text><text x="226" y="39" text-anchor="middle" class="t-small">H3</text><text x="288" y="39" text-anchor="middle" class="t-small">H4</text>
    <text x="330" y="39" class="t-small t-dim">${L('각 블록을 미리 FFT', 'FFT each block once')}</text>
    <text x="6" y="74" class="t-small">${L('입력 스펙트럼 지연선 (최근 블록이 왼쪽)', 'Input spectrum delay line (newest left)')}</text>
    <rect x="10" y="82" width="60" height="22" class="f-dim"/><rect x="72" y="82" width="60" height="22" class="f-dim"/><rect x="134" y="82" width="60" height="22" class="f-dim"/><rect x="196" y="82" width="60" height="22" class="f-dim"/><rect x="258" y="82" width="60" height="22" class="f-dim"/>
    <text x="40" y="97" text-anchor="middle" class="t-small">X(k)</text><text x="102" y="97" text-anchor="middle" class="t-small">X(k-1)</text><text x="164" y="97" text-anchor="middle" class="t-small">X(k-2)</text><text x="226" y="97" text-anchor="middle" class="t-small">X(k-3)</text><text x="288" y="97" text-anchor="middle" class="t-small">X(k-4)</text>
    <line x1="40" y1="46" x2="40" y2="80" class="d-dim"/><line x1="102" y1="46" x2="102" y2="80" class="d-dim"/><line x1="164" y1="46" x2="164" y2="80" class="d-dim"/><line x1="226" y1="46" x2="226" y2="80" class="d-dim"/><line x1="288" y1="46" x2="288" y2="80" class="d-dim"/>
    <text x="330" y="66" class="t-small t-dim">${L('같은 열끼리 곱함', 'Multiply column by column')}</text>
    <path d="M164,104 L164,130 L330,130" class="d-b" marker-end="url(#arr)"/>
    <text x="336" y="134" class="t-small t-b">${L('Y = Σ Hp × X(k-p) → 역FFT → 출력 B개', 'Y = Σ Hp × X(k-p) → IFFT → B outputs')}</text>
    <text x="6" y="164" class="t-small t-a">${L('직접 계산: 출력 1개 = 곱셈 N번', 'Direct: 1 output = N multiplies')}</text>
    <text x="6" y="182" class="t-small t-b">${L('분할 FFT: 출력 1개 ≈ 곱셈 4(P + 2 log2 2B)번', 'Partitioned FFT: 1 output ≈ 4(P + 2 log2 2B) multiplies')}</text>
  </svg>`,
  look: [
    '"샘플당 곱셈 수" 막대를 비교하면 A가 B보다 수백 배 김. 막대는 로그 눈금.',
    '"두 방식의 출력 차이"가 0에 가까움. 계산 방법만 다르고 결과는 같음.',
    'B에서 블록 크기를 128로 낮추면 지연은 줄고 곱셈 수는 늘어남. 2048로 올리면 반대.',
    'IR 길이를 늘리면 A의 비용은 길이에 비례해 늘지만 B는 훨씬 천천히 늘어남',
    'IR 종류를 "역재생"으로 바꾸고 소리를 들으면 잔향이 소리보다 먼저 커지는 효과가 남',
  ],
  refs: [
    { type: 'paper', title: 'William G. Gardner, "Efficient Convolution without Input-Output Delay", Journal of the Audio Engineering Society 43(3)', year: 1995, note: '불균일 분할 컨볼루션' },
    { type: 'paper', title: 'Frank Wefers, Partitioned Convolution Algorithms for Real-Time Auralization (PhD thesis, RWTH Aachen)', year: 2015, note: 'UPOLS 등 분할 방식 정리' },
    { type: 'book', title: 'Julius O. Smith III, Mathematics of the Discrete Fourier Transform (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/mdft/', note: '컨볼루션 정리' },
    { type: 'article', title: 'MDN Web Docs, ConvolverNode', url: 'https://developer.mozilla.org/en-US/docs/Web/API/ConvolverNode', note: '브라우저 내장 컨볼루션 리버브' },
  ],
  params: [
    { key: 'method', label: '계산 방식', type: 'select', options: [{ value: 'direct', label: '직접 컨볼루션' }, { value: 'fft', label: '분할 FFT (UPOLS)' }], a: 'direct', b: 'fft', group: '컨볼루션' },
    { key: 'block', label: '블록 크기 B (샘플)', type: 'select', options: [128, 256, 512, 1024, 2048].map((v) => ({ value: v, label: String(v) })), default: 512, when: (p) => p.method === 'fft' },
    { key: 'ir', label: 'IR 종류', type: 'select', options: [{ value: 'room', label: '작은 방' }, { value: 'hall', label: '홀' }, { value: 'plate', label: '플레이트' }, { value: 'reverse', label: '역재생 홀' }], default: 'hall', shared: true, group: 'IR' },
    { key: 'len', label: 'IR 길이 (초)', type: 'range', min: 0.2, max: 3, step: 0.1, default: 1.5, shared: true },
    { key: 'mix', label: '잔향 음량 (wet)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'pluck', label: '플럭' }, { value: 'snare', label: '스네어' }], default: 'pluck', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Convolution Reverb (Direct vs Partitioned FFT)',
    summary: 'A convolution reverb applies the impulse response (IR) of a space directly to the sound. Done directly, every sample needs as many multiplies as the IR has samples, which is too slow for real time. Splitting the IR into blocks and using FFTs gives the same result at a few hundredths of the cost or less.',
    views: { a: 'Direct convolution', b: 'Partitioned FFT convolution' },
    controls: 'Change IR type, length and block size in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p><b>Convolution</b> <code>y[n] = Σ h[k] x[n-k]</code> computes the exact output of a linear time-invariant system. With an IR recorded in a real space, it reproduces that space's reverb. The IRs in this sample are synthetic, made in code.</p>
    <ul>
      <li><b>Direct</b>: each output sample needs N multiplies (IR length). A 2 s IR (48 kHz, 96000 taps) needs about 4.6 billion per second. For short IRs (a few hundred taps) it is good because it has no latency.</li>
      <li><b>FFT convolution</b>: convolution in time is multiplication in frequency. But one FFT over the whole IR adds latency as long as the IR.</li>
      <li><b>Uniform partitioning (UPOLS)</b>: split the IR into P blocks of B samples and FFT each once. For every B input samples: 1 FFT, P spectrum multiplies, 1 inverse FFT. Latency is B samples.</li>
    </ul>
    <p>Smaller blocks lower latency but raise FFT cost and multiplies per block. Commercial reverbs use non-uniform partitioning (Gardner 1995): small blocks at the start and large blocks later, to get both. Both views here play sound through the partitioned FFT engine, because running direct convolution in real time would freeze the browser. The "Output difference" stat shows that the results are the same.</p>`,
    look: [
      'Compare the "Multiplies per sample" bars. A is hundreds of times longer than B. The bars use a log scale.',
      '"Output difference between methods" is close to 0. Only the method differs. The result is the same.',
      'Lower the block size in B to 128. Latency drops and multiplies rise. At 2048 it is the opposite.',
      'Make the IR longer. A\'s cost grows in proportion to the length, but B grows much more slowly.',
      'Set the IR type to "Reverse hall" and listen. The reverb swells up before the sound.',
    ],
    refs: ['Non-uniform partitioned convolution.', 'Overview of partitioned methods including UPOLS.', 'The convolution theorem.', 'The browser\'s built-in convolution reverb.'],
    params: {
      method: { label: 'Method', group: 'Convolution', options: { direct: 'Direct convolution', fft: 'Partitioned FFT (UPOLS)' } },
      block: 'Block size B (samples)',
      ir: { label: 'IR type', group: 'IR', options: { room: 'Small room', hall: 'Hall', plate: 'Plate', reverse: 'Reverse hall' } },
      len: 'IR length (s)',
      mix: 'Reverb level (wet)',
      src: { label: 'Source', group: 'Source', options: { pluck: 'Pluck', snare: 'Snare' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 24000;

    // 합성 IR. 같은 시드라 샘플레이트가 달라도 모양이 같음. 에너지 1로 정규화
    function genIR(sr) {
      const n = Math.max(16, Math.floor(P.len * sr)), h = new Float32Array(n), rng = U.rng(77);
      const type = P.ir === 'reverse' ? 'hall' : P.ir;
      const rt = P.len * (type === 'room' ? 0.6 : 0.95);
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / sr, env = Math.pow(10, -3 * t / rt), w = rng.range(-1, 1);
        // 시간이 갈수록 어두워지는 로우패스 (플레이트는 밝게 유지)
        const a = type === 'plate' ? 0.9 : Math.max(0.05, 0.8 * Math.exp(-t * 2.5));
        lp += a * (w - lp);
        const onset = type === 'room' ? 1 : Math.min(1, t / 0.03);
        h[i] = lp * env * onset;
      }
      if (type !== 'plate') { // 초기 반사음
        const er = U.rng(5);
        for (let k = 0; k < 10; k++) { const i = Math.floor(er.range(0.004, type === 'room' ? 0.03 : 0.08) * sr); if (i < n) h[i] += er.range(-1, 1) * 0.8 * (1 - k / 12); }
      }
      if (P.ir === 'reverse') h.reverse();
      let e = 0;
      for (let i = 0; i < n; i++) e += h[i] * h[i];
      const s = 1 / Math.sqrt(e || 1);
      for (let i = 0; i < n; i++) h[i] *= s;
      return h;
    }

    // 균일 분할 overlap-save 컨볼루션 엔진
    function makeUPOLS(h, B) {
      const F = 2 * B, Pn = Math.ceil(h.length / B);
      const Hr = [], Hi = [];
      for (let p = 0; p < Pn; p++) {
        const re = new Float64Array(F), im = new Float64Array(F);
        for (let i = 0; i < B && p * B + i < h.length; i++) re[i] = h[p * B + i];
        A.fft(re, im); Hr.push(re); Hi.push(im);
      }
      const Xr = Array.from({ length: Pn }, () => new Float64Array(F)), Xi = Array.from({ length: Pn }, () => new Float64Array(F));
      const inBuf = new Float64Array(F), yr = new Float64Array(F), yi = new Float64Array(F);
      const outQ = new Float32Array(B);
      let head = 0, fill = 0, outPos = 0;
      const block = () => {
        head = (head + Pn - 1) % Pn;
        const xr = Xr[head], xi = Xi[head];
        xr.set(inBuf); xi.fill(0);
        A.fft(xr, xi);
        yr.fill(0); yi.fill(0);
        for (let p = 0; p < Pn; p++) {
          const q = (head + p) % Pn, ar = Xr[q], ai = Xi[q], br = Hr[p], bi = Hi[p];
          for (let k = 0; k <= B; k++) { yr[k] += ar[k] * br[k] - ai[k] * bi[k]; yi[k] += ar[k] * bi[k] + ai[k] * br[k]; }
        }
        // 실수 신호라 스펙트럼이 켤레 대칭. 절반만 계산하고 나머지는 복사
        for (let k = B + 1; k < F; k++) { yr[k] = yr[F - k]; yi[k] = -yi[F - k]; }
        A.fft(yr, yi, true);
        for (let i = 0; i < B; i++) outQ[i] = yr[B + i];
        inBuf.copyWithin(0, B);
      };
      // 샘플 하나 넣고 하나 꺼냄 (지연 B)
      return {
        B, Pn,
        step(x) {
          inBuf[B + fill] = x; fill++;
          const y = outQ[outPos]; outPos++;
          if (fill === B) { block(); fill = 0; outPos = 0; }
          return y;
        },
      };
    }

    function makeSource(sr) {
      const noise = A.noiseBuffer(sr, 21), notes = [60, 67, 64, 72, 69, 65];
      let n = 0, ph = 0;
      return () => {
        const per = Math.round(sr * 0.9), i = n % per, t = i / sr, k = Math.floor(n / per) % 6;
        n++;
        if (P.src === 'snare') return t < 0.25 ? (noise[i % sr] * 0.7 + Math.sin(TAU * 185 * t) * 0.4) * Math.exp(-t * 25) * 0.6 : 0;
        if (t > 0.5) return 0;
        ph = (ph + A.mtof(notes[k]) / sr) % 1;
        return (0.6 * A.wave.saw(ph) + 0.4 * Math.sin(TAU * ph)) * Math.exp(-t * 9) * 0.4;
      };
    }

    // 분석: 같은 입력에 두 방식을 돌려 차이와 비용을 잼
    let key = '', irV = null, irDisp = null, irPeak = 1, diff = 0, msDirect = 0, msFft = 0, opsD = 0, opsF = 0, latency = 0;
    function analyze() {
      const k = [P.ir, P.len, P.block, P.method].join();
      if (k === key) return;
      key = k;
      irV = genIR(SRV);
      // 그리기용: 1024칸의 최소, 최대
      irPeak = Math.max(1e-6, A.peak(irV));
      irDisp = new Float32Array(2048);
      for (let c = 0; c < 1024; c++) {
        const i0 = Math.floor(c * irV.length / 1024), i1 = Math.max(i0 + 1, Math.floor((c + 1) * irV.length / 1024));
        let lo = 0, hi = 0;
        for (let i = i0; i < i1; i++) { const v = irV[i] || 0; if (v < lo) lo = v; if (v > hi) hi = v; }
        irDisp[2 * c] = hi; irDisp[2 * c + 1] = lo;
      }
      const N = irV.length, B = +P.block;
      const T = 2048, x = new Float32Array(T + B), rng = U.rng(3);
      for (let i = 0; i < 1500; i++) x[i] = rng.range(-1, 1) * Math.exp(-i / 300);
      // 직접
      const yd = new Float32Array(T);
      for (let n = 0; n < T; n++) { let s = 0; for (let j = 0, m = Math.min(n, N - 1); j <= m; j++) s += irV[j] * x[n - j]; yd[n] = s; }
      // 분할 FFT (지연 B만큼 밀림)
      const eng = makeUPOLS(irV, B), yf = new Float32Array(T + B);
      for (let n = 0; n < T + B; n++) yf[n] = eng.step(x[n]);
      diff = 0;
      for (let n = 0; n < T; n++) diff = Math.max(diff, Math.abs(yd[n] - yf[n + B]));
      // 비용 측정: 정상 상태 출력 64개
      const big = new Float32Array(N + 64);
      for (let i = 0; i < big.length; i++) big[i] = rng.range(-1, 1);
      let t0 = ctx.now(), acc = 0;
      for (let n = N; n < N + 64; n++) { let s = 0; for (let j = 0; j < N; j++) s += irV[j] * big[n - j]; acc += s; }
      msDirect = (ctx.now() - t0) / 64 * SRV;
      const eng2 = makeUPOLS(irV, B), cnt = Math.max(B * 4, 4096);
      t0 = ctx.now();
      for (let n = 0; n < cnt; n++) acc += eng2.step(big[n % big.length]);
      msFft = (ctx.now() - t0) / cnt * SRV;
      if (acc === 12345) diff++; // 최적화로 계산이 사라지지 않게 함
      opsD = N;
      opsF = 4 * (eng.Pn + 2 * Math.log2(2 * B)); // 스펙트럼 곱 (B+1)점 × P, FFT 2번 (2B점), B샘플당
      latency = B;
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const B = P.method === 'fft' ? +P.block : 512, k = [P.ir, P.len, B, sr].join();
        if (!live || live.k !== k) live = { k, sr, src: live && live.sr === sr ? live.src : makeSource(sr), eng: makeUPOLS(genIR(sr), B), delay: new Float32Array(B), di: 0 };
        for (let i = 0; i < n; i++) {
          const x = live.src(), w = live.eng.step(x);
          // 원음도 B만큼 늦춰 잔향과 맞춤
          const d = live.delay[live.di]; live.delay[live.di] = x; live.di = (live.di + 1) % live.delay.length;
          const v = d * (1 - P.mix * 0.5) + w * P.mix * 0.35;
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const ih = Math.max(50, H * 0.42);
        A.drawWave(g, irDisp, pad, pad, w, ih, { color: col, amp: 1 / irPeak * 0.95, label: GTL.L(`임펄스 응답 (${P.len.toFixed(1)}초, ${Math.round(P.len * 48000)}탭 @48k)`, `Impulse response (${P.len.toFixed(1)} s, ${Math.round(P.len * 48000)} taps @48k)`) });
        if (P.method === 'fft') {
          const B = +P.block, n48 = Math.round(P.len * 48000), parts = Math.ceil(n48 / B), every = Math.max(1, Math.ceil(parts * 3 / w));
          for (let p = every; p < parts; p += every) { const px = pad + w * p * B / n48; D.line(g, px, pad + ih - 6, px, pad + ih, 'rgba(255,255,255,0.35)', 1); }
          D.text(g, GTL.L(`블록 ${parts}개 (@48k)`, `${parts} blocks (@48k)`), pad + w - 110, pad + ih - 20, { size: 9, color: C.dim });
        }
        // 비용 막대 (로그)
        const by = pad * 2 + ih, bh = H - by - pad;
        D.rect(g, pad, by, w, bh, 'rgba(0,0,0,0.35)');
        D.text(g, GTL.L('샘플당 곱셈 수 (로그 눈금, @24k 기준)', 'Multiplies per sample (log scale, @24k)'), pad + 4, by + 3, { size: 10, color: C.dim });
        const lmax = 6, bar = (y, v, c, name) => {
          const len = U.clamp(Math.log10(Math.max(1, v)) / lmax, 0, 1) * (w - 120);
          D.rect(g, pad + 110, y, len, Math.min(22, bh / 4), c);
          D.text(g, name, pad + 6, y + 4, { size: 10, color: C.text });
          D.text(g, Math.round(v).toLocaleString('en-US'), pad + 116 + len, y + 4, { size: 10, color: C.dim });
        };
        bar(by + bh * 0.3, opsD, P.method === 'direct' ? C.a : 'rgba(255,170,90,0.35)', GTL.L('직접', 'Direct'));
        bar(by + bh * 0.62, opsF, P.method === 'fft' ? C.b : 'rgba(90,190,255,0.35)', GTL.L(`분할 FFT B=${P.block}`, `Partitioned B=${P.block}`));
        ctx.stat(GTL.L('두 방식의 출력 차이 (최대)', 'Output difference between methods (max)'), diff.toExponential(1));
        ctx.stat(GTL.L('1초 처리 시간 (직접, 측정, 24kHz)', 'Time per 1 s audio (direct, measured, 24 kHz)'), msDirect.toFixed(0) + ' ms');
        ctx.stat(GTL.L('1초 처리 시간 (분할 FFT, 측정, 24kHz)', 'Time per 1 s audio (FFT, measured, 24 kHz)'), msFft.toFixed(1) + ' ms');
        ctx.stat(GTL.L('지연 (레이턴시)', 'Latency'), P.method === 'fft' ? `${latency} ${GTL.L('샘플', 'samples')} (${(latency / 48).toFixed(1)} ms @48k)` : '0');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
