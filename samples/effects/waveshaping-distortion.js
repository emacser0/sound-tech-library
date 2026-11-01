// 웨이브셰이핑 디스토션: 전달 곡선 모양이 배음을 정함. 하드 클립(홀수 배음) vs 비대칭(짝수 배음 추가)
GTL.register({
  id: 'waveshaping-distortion',
  title: '웨이브셰이핑 디스토션 (전달 곡선과 배음)',
  summary: '디스토션은 샘플 값을 곡선 하나에 통과시켜 파형을 찌그러뜨림. 곡선이 위아래 대칭이면 홀수 배음만 생기고, 비대칭이면 짝수 배음도 생겨 진공관 같은 따뜻한 소리가 됨.',
  views: { a: '하드 클립', b: '비대칭 (tanh + 바이어스)' },
  controls: '파라미터 표에서 곡선과 드라이브를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>웨이브셰이퍼(Waveshaper)</b>는 메모리가 없는 함수 y = f(x). 입력 샘플 하나가 출력 샘플 하나를 정함. 드라이브(입력 이득)를 올리면 곡선의 휜 부분을 더 많이 쓰게 되어 왜곡이 커짐.</p>
    <ul>
      <li><b>하드 클립</b>: ±1에서 잘라냄. 모서리가 날카로워 높은 배음이 천천히 줄어듦. 거친 퍼즈 소리.</li>
      <li><b>tanh, 3차 소프트 클립</b>: 부드럽게 휘어서 높은 배음이 빨리 줄어듦. 오버드라이브 소리.</li>
      <li><b>비대칭</b>: 위와 아래가 다르게 휨. f(-x) ≠ -f(x)라서 짝수 배음이 생김. 진공관 싱글엔디드 앰프, 테이프의 특징. 평균값(DC)도 생기므로 뒤에 DC 차단 필터가 필요함.</li>
      <li><b>폴드백</b>: 한계를 넘은 부분을 반대로 접음. 드라이브를 올릴수록 배음이 복잡하게 늘어나 신스의 웨이브폴더 소리가 남.</li>
    </ul>
    <p>대칭 함수는 홀수 함수(f(-x) = -f(x))라서 푸리에 급수에 홀수 차 항만 남음. 단점: 웨이브셰이핑은 나이퀴스트 위의 배음도 만들어 에일리어싱이 생김("오버샘플링 디스토션" 샘플 참고).</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="85" x2="170" y2="85" class="d-dim"/><line x1="95" y1="20" x2="95" y2="150" class="d-dim"/>
    <path d="M20,40 L65,40 L125,130 L170,130" class="d-a" transform="matrix(1,0,0,-1,0,170)"/>
    <path d="M20,52 C70,52 80,60 95,85 C110,118 125,138 170,140" class="d-b" transform="matrix(1,0,0,-1,0,170)"/>
    <text x="20" y="166" class="t-small">${L('입력 x', 'Input x')}</text><text x="100" y="18" class="t-small">${L('출력 y = f(x)', 'Output y = f(x)')}</text>
    <path d="M200,85 q15,-50 30,0 t30,0 q15,-50 30,0 t30,0" class="d-dim"/>
    <text x="235" y="150" class="t-small t-dim">${L('사인 입력', 'Sine input')}</text>
    <path d="M330,85 L336,50 L354,50 L360,85 L366,120 L384,120 L390,85 L396,50 L414,50 L420,85" class="d-a"/>
    <text x="345" y="150" class="t-small t-a">${L('대칭: 홀수 배음', 'Symmetric: odd')}</text>
    <path d="M440,85 C446,40 466,40 472,80 C476,100 490,104 500,85 C506,40 526,40 532,80" class="d-b"/>
    <text x="436" y="150" class="t-small t-b">${L('비대칭: 짝수 추가', 'Asym: adds even')}</text>
  </svg>`,
  look: [
    '배음 막대를 비교하면 A는 홀수 배음(3, 5, 7...)만 있고 B는 2, 4번 배음이 높게 솟음',
    '드라이브를 0dB로 내리면 A는 배음이 사라지지만 B는 바이어스 때문에 짝수 배음이 조금 남음',
    'A의 곡선을 tanh로 바꾸면 높은 배음이 하드 클립보다 빨리 줄어듦. "THD" 값도 낮아짐.',
    '곡선을 폴드백으로 바꾸고 드라이브를 올리면 배음 모양이 불규칙하게 바뀌며 소리가 금속성으로 변함',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '4장 비선형 처리 (오버드라이브, 디스토션, 퍼즈)' },
    { type: 'paper', title: 'Marc Le Brun, "Digital Waveshaping Synthesis", Journal of the Audio Engineering Society 27(4)', year: 1979, note: '웨이브셰이핑과 체비셰프 다항식' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed., Routledge', year: 2019, note: '웨이브셰이퍼와 진공관 모델링' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial, MIT Press', year: 1996, note: '웨이브셰이핑 합성' },
  ],
  params: [
    { key: 'curve', label: '전달 곡선', type: 'select', options: [{ value: 'hard', label: '하드 클립' }, { value: 'tanh', label: 'tanh' }, { value: 'cubic', label: '3차 소프트 클립' }, { value: 'asym', label: '비대칭' }, { value: 'fold', label: '폴드백' }], a: 'hard', b: 'asym', group: '디스토션' },
    { key: 'drive', label: '드라이브 (dB)', type: 'range', min: 0, max: 36, step: 0.5, default: 14, shared: true },
    { key: 'bias', label: '바이어스 (비대칭)', type: 'range', min: 0, max: 0.8, step: 0.01, default: 0.4, shared: true, when: (p) => p.curve === 'asym' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 33, max: 72, default: 45, shared: true, group: '음원' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'sine', label: '사인파' }, { value: 'power', label: '파워 코드 (근음 + 5도)' }], default: 'sine', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Waveshaping Distortion (Transfer Curve and Harmonics)',
    summary: 'Distortion bends the waveform by passing each sample value through a curve. A curve that is symmetric top to bottom adds only odd harmonics. An asymmetric curve also adds even harmonics, which sounds warm like a tube.',
    views: { a: 'Hard clip', b: 'Asymmetric (tanh + bias)' },
    controls: 'Change the curve and drive in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>A <b>waveshaper</b> is a memoryless function y = f(x). One input sample sets one output sample. Raising drive (input gain) uses more of the bent part of the curve, so the distortion grows.</p>
    <ul>
      <li><b>Hard clip</b>: cuts at ±1. The sharp corners make high harmonics fall off slowly. A harsh fuzz sound.</li>
      <li><b>tanh, cubic soft clip</b>: bend smoothly, so high harmonics fall off fast. An overdrive sound.</li>
      <li><b>Asymmetric</b>: the top and bottom bend differently. f(-x) ≠ -f(x), so even harmonics appear. Typical of single-ended tube amps and tape. It also creates an average value (DC), so a DC blocking filter must follow.</li>
      <li><b>Foldback</b>: folds the part above the limit back down. More drive adds more complex harmonics, like a synth wavefolder.</li>
    </ul>
    <p>A symmetric curve is an odd function (f(-x) = -f(x)), so its Fourier series keeps only odd terms. Downside: waveshaping also creates harmonics above Nyquist, which alias (see the "Oversampled Distortion" sample).</p>`,
    look: [
      'Compare the harmonic bars. A has only odd harmonics (3, 5, 7...). B has tall 2nd and 4th harmonics.',
      'Lower drive to 0 dB. A loses its harmonics, but B keeps a few even harmonics because of the bias.',
      'Switch A to tanh. High harmonics fall faster than with hard clip. The "THD" value also drops.',
      'Choose foldback and raise drive. The harmonic pattern changes irregularly and the sound turns metallic.',
    ],
    refs: ['Ch. 4 nonlinear processing (overdrive, distortion, fuzz).', 'Waveshaping and Chebyshev polynomials.', 'Waveshapers and tube modeling.', 'Waveshaping synthesis.'],
    params: {
      curve: { label: 'Transfer curve', group: 'Distortion', options: { hard: 'Hard clip', cubic: 'Cubic soft clip', asym: 'Asymmetric', fold: 'Foldback' } },
      drive: 'Drive (dB)',
      bias: 'Bias (asymmetric)',
      note: { label: 'Pitch (MIDI)', group: 'Source' },
      src: { label: 'Source', options: { sine: 'Sine', power: 'Power chord (root + 5th)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;

    // 전달 곡선 (드라이브 적용 전 입력 v)
    function shape(v) {
      switch (P.curve) {
        case 'hard': return U.clamp(v, -1, 1);
        case 'tanh': return Math.tanh(v);
        case 'cubic': { const c = U.clamp(v, -1, 1); return 1.5 * c - 0.5 * c * c * c; }
        case 'asym': return (Math.tanh(v + P.bias) - Math.tanh(P.bias)) / (1 - Math.tanh(P.bias) * 0.5);
        default: return Math.sin(Math.PI / 2 * v);
      }
    }
    const gainIn = () => A.dbToLin(P.drive);

    // 한 주기를 정확히 4096점으로 계산해 배음을 구함 (에일리어싱 없는 이론값)
    const NC = 4096, H = 20;
    let key = '', harm = null, cyc = null, thd = 0, evenOdd = 0, dc = 0, peak = 1;
    function analyze() {
      const k = [P.curve, P.drive, P.bias].join();
      if (k === key) return;
      key = k;
      const gi = gainIn();
      cyc = new Float32Array(NC);
      for (let i = 0; i < NC; i++) cyc[i] = shape(gi * 0.5 * Math.sin(TAU * i / NC));
      harm = new Float32Array(H + 1);
      for (let h = 0; h <= H; h++) {
        let re = 0, im = 0;
        for (let i = 0; i < NC; i++) { const a = TAU * h * i / NC; re += cyc[i] * Math.cos(a); im -= cyc[i] * Math.sin(a); }
        harm[h] = Math.hypot(re, im) / NC * (h ? 2 : 1);
      }
      dc = harm[0];
      let sh = 0, se = 0, so = 0;
      for (let h = 2; h <= H; h++) { sh += harm[h] ** 2; if (h % 2) so += harm[h] ** 2; else se += harm[h] ** 2; }
      thd = Math.sqrt(sh) / Math.max(1e-9, harm[1]) * 100;
      evenOdd = A.linToDb(Math.sqrt(se) / Math.max(1e-9, Math.sqrt(so)));
      peak = 0;
      for (let i = 0; i < NC; i++) peak = Math.max(peak, Math.abs(cyc[i] - dc));
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, ph: 0, ph5: 0, x1: 0, y1: 0 };
        analyze();
        const gi = gainIn(), f = A.mtof(P.note), mk = 0.45 / Math.max(0.05, peak), R = 1 - TAU * 10 / sr;
        for (let i = 0; i < n; i++) {
          live.ph = (live.ph + f / sr) % 1; live.ph5 = (live.ph5 + f * 1.4983 / sr) % 1;
          const x = P.src === 'sine' ? 0.5 * Math.sin(TAU * live.ph) : 0.3 * Math.sin(TAU * live.ph) + 0.2 * Math.sin(TAU * live.ph5);
          const y = shape(gi * x);
          const o = y - live.x1 + R * live.y1; live.x1 = y; live.y1 = o; // DC 차단
          l[i] = o * mk; r[i] = l[i];
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, Hh = ctx.height, pad = 10;
        const cs = Math.min(Hh * 0.5, W * 0.4) - pad, gi = gainIn();
        // 전달 곡선
        D.rect(g, pad, pad, cs, cs, 'rgba(0,0,0,0.35)');
        D.line(g, pad, pad + cs / 2, pad + cs, pad + cs / 2, C.grid, 1); D.line(g, pad + cs / 2, pad, pad + cs / 2, pad + cs, C.grid, 1);
        const xr = 1.5;
        g.beginPath();
        for (let i = 0; i <= 100; i++) {
          const x = -xr + 2 * xr * i / 100, y = shape(gi * x);
          const px = pad + cs * i / 100, py = pad + cs / 2 - U.clamp(y, -1.2, 1.2) / 1.2 * cs / 2;
          i ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        const ax = 0.5 / xr * cs / 2; // 사인 입력 범위 (±0.5)
        g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(pad + cs / 2 - ax, pad, ax * 2, cs);
        D.text(g, GTL.L('전달 곡선 (흰 띠 = 사인 입력 범위)', 'Transfer curve (white band = sine input range)'), pad + 4, pad + 3, { size: 9, color: C.dim });
        // 파형 (입력, 출력 2주기)
        const wx = pad * 2 + cs, ww = W - wx - pad;
        const two = new Float32Array(400);
        for (let i = 0; i < 400; i++) two[i] = (cyc[Math.floor(i / 200 * NC) % NC] - dc) / Math.max(0.05, peak) * 0.9;
        const inp = new Float32Array(400);
        for (let i = 0; i < 400; i++) inp[i] = 0.9 * Math.sin(TAU * i / 200);
        A.drawWave(g, inp, wx, pad, ww, cs, { color: 'rgba(255,255,255,0.25)', lineWidth: 1 });
        A.drawWave(g, two, wx, pad, ww, cs, { color: col, background: false, axis: false, label: GTL.L('파형 2주기 (회색 = 입력, DC 제거, 크기 맞춤)', '2 cycles (gray = input, DC removed, level matched)') });
        // 배음 막대
        const by = pad * 2 + cs, bh = Hh - by - pad - 12, bw = W - pad * 2;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.35)');
        const step = bw / H;
        for (let h = 1; h <= H; h++) {
          const db = A.linToDb(harm[h] / Math.max(1e-9, harm[1])), v = U.clamp((db + 80) / 80, 0, 1);
          D.rect(g, pad + (h - 1) * step + 2, by + bh * (1 - v), step - 4, bh * v, h === 1 ? C.text : h % 2 ? col : C.good);
          D.text(g, String(h), pad + (h - 0.5) * step, by + bh + 2, { size: 9, align: 'center', color: C.dim });
        }
        for (let db = -20; db > -80; db -= 20) { const yy = by + bh * (-db / 80); D.line(g, pad, yy, pad + bw, yy, C.grid, 1); D.text(g, db + 'dB', pad + 2, yy - 10, { size: 8, color: C.dim }); }
        D.text(g, GTL.L('배음 크기 (기음 대비, 초록 = 짝수 배음)', 'Harmonic levels (vs fundamental, green = even)'), pad + 4, by + 3, { size: 10, color: C.dim });
        ctx.stat('THD', thd.toFixed(1) + ' %');
        ctx.stat(GTL.L('짝수/홀수 배음 비', 'Even/odd ratio'), evenOdd < -100 ? GTL.L('짝수 없음', 'No even') : evenOdd.toFixed(1) + ' dB');
        ctx.stat(GTL.L('DC 성분', 'DC offset'), dc.toFixed(3));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
