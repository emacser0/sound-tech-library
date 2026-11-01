// 팬 법칙: 선형 팬은 가운데에서 소리가 작아지고, 등전력(-3 dB) 팬은 어디서나 크기가 같음
GTL.register({
  id: 'panning-laws',
  title: '팬 법칙 (선형 vs 등전력 -3 dB)',
  summary: '모노 소리를 좌우로 보낼 때 두 채널 게인을 정하는 규칙을 팬 법칙이라고 함. A의 선형 팬은 가운데에서 채널마다 -6 dB라 전체 크기가 3 dB 꺼짐. B의 등전력 팬은 가운데에서 -3 dB라 어느 위치에서도 크기가 같음.',
  views: { a: '선형 (-6 dB)', b: '등전력 (-3 dB)' },
  controls: '자동 팬을 켜면 소리가 좌우로 오감. 끄면 "팬 위치"로 직접 옮김. 소리는 헤드폰으로 들으면 차이가 잘 들림.',
  info: `
    <p><b>팬(Pan)</b>은 모노 소리를 왼쪽(L), 오른쪽(R) 스피커에 나눠 보내 좌우 위치를 만듦. 팬 위치 θ(0 = 왼쪽 끝, 1 = 오른쪽 끝)에서 두 채널 게인을 정하는 공식이 <b>팬 법칙(Pan Law)</b>.</p>
    <ul>
      <li><b>선형 (-6 dB)</b>: L = 1 - θ, R = θ. 진폭의 합이 1로 일정. 가운데에서 채널마다 0.5(-6 dB)라서 음향 전력의 합은 0.5(-3 dB)로 줄어듦.</li>
      <li><b>등전력 (-3 dB)</b>: L = cos(θπ/2), R = sin(θπ/2). L² + R² = 1이라 전력이 일정. 서로 상관없는 두 스피커 소리는 전력으로 더해지므로 위치를 옮겨도 크기가 같게 들림.</li>
      <li><b>-4.5 dB</b>: 두 방식의 기하 평균. 일부 DAW와 콘솔이 고를 수 있게 제공함.</li>
      <li><b>밸런스 (0 dB)</b>: 가운데에서 두 채널 모두 1. 스테레오 트랙의 밸런스 노브 동작. 모노 소리에 쓰면 가운데가 3 dB 커짐.</li>
    </ul>
    <p>주의: 선형 팬은 모노로 합칠 때(L + R)는 크기가 일정함. 그래서 모노 호환이 중요한 방송에서는 -6 dB 법칙을 쓰기도 함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="160" x2="300" y2="160" class="d-line"/><line x1="40" y1="160" x2="40" y2="20" class="d-line"/>
    <text x="40" y="176" class="t-small">L</text><text x="300" y="176" text-anchor="end" class="t-small">R</text><text x="170" y="176" text-anchor="middle" class="t-small">${L('가운데', 'center')}</text>
    <line x1="40" y1="30" x2="300" y2="160" class="d-a" stroke-dasharray="5 3"/><line x1="40" y1="160" x2="300" y2="30" class="d-a" stroke-dasharray="5 3"/>
    <path d="M40,30 Q150,30 300,160" class="d-b"/><path d="M40,160 Q190,30 300,30" class="d-b"/>
    <line x1="170" y1="20" x2="170" y2="160" class="d-dim" stroke-dasharray="3 3"/>
    <circle cx="170" cy="95" r="3" class="f-a"/><circle cx="170" cy="68" r="3" class="f-b"/>
    <text x="176" y="106" class="t-small t-a">0.5 (-6 dB)</text><text x="176" y="62" class="t-small t-b">0.707 (-3 dB)</text>
    <text x="320" y="40">${L('가운데에서 전력 합 L² + R²', 'Power sum L² + R² at center')}</text>
    <text x="320" y="66" class="t-small t-a">${L('선형: 0.25 + 0.25 = 0.5 (-3 dB)', 'Linear: 0.25 + 0.25 = 0.5 (-3 dB)')}</text>
    <text x="320" y="88" class="t-small t-b">${L('등전력: 0.5 + 0.5 = 1 (0 dB)', 'Constant power: 0.5 + 0.5 = 1 (0 dB)')}</text>
    <text x="320" y="120" class="t-small t-dim">${L('끝에서는 둘 다 1 + 0 = 1', 'At the edges both give 1 + 0 = 1')}</text>
  </svg>`,
  look: [
    '왼쪽 그래프의 흰 점선(전력 합)이 A에서는 가운데로 갈수록 3 dB 꺼짐. B는 평평함.',
    '"위치에 따른 크기 변화"가 A는 3 dB, B는 0 dB',
    '소리를 켜고 A를 들으면 소리가 가운데를 지날 때마다 살짝 작아짐',
    'B의 팬 법칙을 밸런스(0 dB)로 바꾸면 반대로 가운데가 3 dB 커짐',
  ],
  refs: [
    { type: 'paper', title: 'Pulkki, "Virtual Sound Source Positioning Using Vector Base Amplitude Panning", JAES 45(6)', year: 1997, note: '진폭 팬과 게인 정규화(전력 보존)' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '공간화와 팬 공식' },
    { type: 'book', title: 'David Miles Huber, Robert E. Runstein, Modern Recording Techniques', note: '콘솔 팬 법칙과 모노 호환' },
    { type: 'engine', title: 'MDN - StereoPannerNode', url: 'https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode', note: 'Web Audio 표준의 등전력 팬 공식' },
  ],
  params: [
    { key: 'law', label: '팬 법칙', type: 'select', options: [{ value: 'linear', label: '선형 (-6 dB)' }, { value: 'p45', label: '-4.5 dB' }, { value: 'power', label: '등전력 (-3 dB)' }, { value: 'balance', label: '밸런스 (0 dB)' }], default: 'power', a: 'linear', b: 'power', group: '팬' },
    { key: 'auto', label: '자동 팬', type: 'bool', default: true, shared: true },
    { key: 'pan', label: '팬 위치', type: 'range', min: -1, max: 1, step: 0.01, default: 0, shared: true, when: (p) => !p.auto, help: '-1 = 왼쪽 끝, 1 = 오른쪽 끝' },
    { key: 'speed', label: '자동 팬 속도 (Hz)', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.2, shared: true, when: (p) => p.auto },
    { key: 'src', label: '소리', type: 'select', options: [{ value: 'noise', label: '분홍 잡음' }, { value: 'pluck', label: '뜯는 음' }], default: 'noise', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Panning Laws (Linear vs Constant Power -3 dB)',
    summary: 'A pan law is the rule that sets the two channel gains when you place a mono sound left or right. The linear pan in A gives -6 dB per channel at the center, so the total level dips by 3 dB. The constant power pan in B gives -3 dB at the center, so the level is the same at every position.',
    views: { a: 'Linear (-6 dB)', b: 'Constant power (-3 dB)' },
    controls: 'With auto pan on, the sound moves left and right. Turn it off to move it with "Pan position". Headphones make the difference easier to hear.',
    info: `
    <p><b>Panning</b> sends a mono sound to the left (L) and right (R) speakers to create a left-right position. The formula that sets the two gains at pan position θ (0 = hard left, 1 = hard right) is the <b>pan law</b>.</p>
    <ul>
      <li><b>Linear (-6 dB)</b>: L = 1 - θ, R = θ. The sum of amplitudes stays 1. At the center each channel is 0.5 (-6 dB), so the total acoustic power drops to 0.5 (-3 dB).</li>
      <li><b>Constant power (-3 dB)</b>: L = cos(θπ/2), R = sin(θπ/2). L² + R² = 1, so power is constant. Sounds from two speakers that are not correlated add as power, so the level sounds the same at any position.</li>
      <li><b>-4.5 dB</b>: the geometric mean of the two. Some DAWs and consoles offer it as an option.</li>
      <li><b>Balance (0 dB)</b>: both channels are 1 at the center. This is how the balance knob of a stereo track works. On a mono sound, the center gets 3 dB louder.</li>
    </ul>
    <p>Note: a linear pan keeps the level constant when summed to mono (L + R). So broadcast work, where mono compatibility matters, sometimes uses the -6 dB law.</p>`,
    look: [
      'In the left graph, the white dashed line (power sum) dips 3 dB toward the center in A. In B it is flat.',
      '"Level change across positions" is 3 dB for A and 0 dB for B.',
      'Turn on sound and listen to A. The sound gets a little quieter every time it passes the center.',
      'Change B\'s pan law to balance (0 dB). Now the center gets 3 dB louder instead.',
    ],
    refs: ['Amplitude panning and gain normalization (power preserving).', 'Spatialization and pan formulas.', 'Console pan laws and mono compatibility.', 'The constant power pan formula in the Web Audio standard.'],
    params: {
      law: { label: 'Pan law', group: 'Pan', options: { linear: 'Linear (-6 dB)', power: 'Constant power (-3 dB)', balance: 'Balance (0 dB)' } },
      auto: 'Auto pan',
      pan: { label: 'Pan position', help: '-1 = hard left, 1 = hard right' },
      speed: 'Auto pan speed (Hz)',
      src: { label: 'Sound', options: { noise: 'Pink noise', pluck: 'Plucked notes' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 팬 위치 p(-1~1) → [gL, gR]
    function gains(law, p) {
      const th = (U.clamp(p, -1, 1) + 1) / 2, c = Math.cos(th * Math.PI / 2), s = Math.sin(th * Math.PI / 2);
      if (law === 'linear') return [1 - th, th];
      if (law === 'p45') return [Math.sqrt((1 - th) * c), Math.sqrt(th * s)];
      if (law === 'balance') return [Math.min(1, 2 * (1 - th)), Math.min(1, 2 * th)];
      return [c, s];
    }
    const powDb = (g) => 10 * Math.log10(Math.max(1e-12, g[0] * g[0] + g[1] * g[1]));
    const panAt = (t) => (P.auto ? Math.sin(2 * Math.PI * P.speed * t) : P.pan);

    // 소리: 분홍 잡음 또는 뜯는 음. 실시간 합성
    let noise = null, nSr = 0, ni = 0, t = 0, lp = null, ph = 0, gS = [0.707, 0.707];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== nSr) { noise = A.noiseBuffer(sr * 2, 3, 'pink'); nSr = sr; lp = A.biquad('lowpass', 1800, 0.8, 0, sr); }
        const k = 1 - Math.exp(-1 / (0.01 * sr));
        for (let i = 0; i < n; i++) {
          let x;
          if (P.src === 'noise') { x = noise[ni] * 0.5; ni = (ni + 1) % noise.length; }
          else {
            const tn = t % 0.25, m = [57, 60, 64, 67, 64, 60, 62, 59][Math.floor(t / 0.25) % 8], f = A.mtof(m);
            ph += f / sr; if (ph >= 1) ph -= 1;
            x = lp.process((2 * ph - 1) * Math.exp(-tn * 10)) * 0.6;
          }
          const g = gains(P.law, panAt(t));
          gS[0] += (g[0] - gS[0]) * k; gS[1] += (g[1] - gS[1]) * k;
          l[i] = x * gS[0]; r[i] = x * gS[1];
          t += 1 / sr;
        }
      },
    });

    let curve = null, cKey = '';
    function curves() {
      if (cKey === P.law) return curve;
      cKey = P.law;
      const M = 101, gl = new Float32Array(M), gr = new Float32Array(M), pw = new Float32Array(M);
      let mn = 99, mx = -99;
      for (let i = 0; i < M; i++) { const g = gains(P.law, -1 + 2 * i / (M - 1)); gl[i] = g[0]; gr[i] = g[1]; pw[i] = powDb(g); mn = Math.min(mn, pw[i]); mx = Math.max(mx, pw[i]); }
      curve = { gl, gr, pw, M, range: mx - mn };
      return curve;
    }

    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, cv = curves();
        const p = snd.on ? panAt(t) : panAt(ctx.time), gn = gains(P.law, p);
        // 게인 곡선
        const gw = Math.min(W * 0.58, W - 150), gh = H - 2 * pad - 16, gx = pad, gy = pad;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        const toX = (i) => gx + gw * i / (cv.M - 1), toY = (v) => gy + gh - v / 1.5 * gh, toYdb = (db) => gy + gh - (db + 12) / 18 * gh;
        for (const v of [0.5, 0.707, 1]) { D.line(g, gx, toY(v), gx + gw, toY(v), C.grid); D.text(g, v.toString(), gx + 2, toY(v) - 10, { size: 9, color: C.dim }); }
        const plot = (arr, color, f, dash) => { g.beginPath(); for (let i = 0; i < cv.M; i++) { const y = f(arr[i]); i ? g.lineTo(toX(i), y) : g.moveTo(toX(i), y); } g.setLineDash(dash || []); g.strokeStyle = color; g.lineWidth = 2; g.stroke(); g.setLineDash([]); };
        plot(cv.gl, C.series ? C.series[0] : col, toY); plot(cv.gr, C.series ? C.series[1] : col, toY);
        plot(cv.pw, C.text, toYdb, [5, 4]);
        const px = gx + gw * (p + 1) / 2;
        D.line(g, px, gy, px, gy + gh, col, 1);
        D.circle(g, px, toY(gn[0]), 4, C.series[0]); D.circle(g, px, toY(gn[1]), 4, C.series[1]); D.circle(g, px, toYdb(powDb(gn)), 4, C.text);
        D.text(g, GTL.L('게인 L, R (선)과 전력 합 (흰 점선, 오른쪽 dB 눈금)', 'Gain L, R (lines) and power sum (white dashed, dB on right)'), gx + 4, gy + 4, { size: 10, color: C.dim });
        for (const db of [-6, -3, 0, 3]) D.text(g, (db > 0 ? '+' : '') + db + ' dB', gx + gw - 4, toYdb(db) - 5, { size: 9, color: C.dim, align: 'right' });
        D.text(g, 'L', gx, gy + gh + 3, { size: 10, color: C.dim }); D.text(g, 'R', gx + gw, gy + gh + 3, { size: 10, color: C.dim, align: 'right' });
        // 미터와 위치
        const mx = gx + gw + 20, mw = W - mx - pad;
        const bw = Math.min(26, mw / 5);
        A.drawMeter(g, mx, gy + 20, bw, gh - 40, A.linToDb(gn[0]) - 6, { minDb: -36, label: 'L', color: C.series[0] });
        A.drawMeter(g, mx + bw * 1.5, gy + 20, bw, gh - 40, A.linToDb(gn[1]) - 6, { minDb: -36, label: 'R', color: C.series[1] });
        A.drawMeter(g, mx + bw * 3, gy + 20, bw, gh - 40, powDb(gn) - 6, { minDb: -36, label: GTL.L('전력', 'Pow'), color: col });
        D.text(g, GTL.L('미터 (-36~0 dB)', 'Meters (-36 to 0 dB)'), mx, gy + 4, { size: 10, color: C.dim });

        ctx.stat(GTL.L('팬 위치', 'Pan position'), p.toFixed(2));
        ctx.stat(GTL.L('게인 L, R', 'Gain L, R'), `${A.linToDb(gn[0]).toFixed(1)}, ${A.linToDb(gn[1]).toFixed(1)} dB`);
        ctx.stat(GTL.L('전력 합', 'Power sum'), powDb(gn).toFixed(2) + ' dB');
        ctx.stat(GTL.L('위치에 따른 크기 변화', 'Level change across positions'), cv.range.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
