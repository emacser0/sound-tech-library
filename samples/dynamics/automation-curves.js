// 페이드와 크로스페이드 곡선: 선형(등게인) 크로스페이드는 서로 다른 소리를 섞을 때 가운데가 3 dB 꺼짐
GTL.register({
  id: 'automation-curves',
  title: '크로스페이드 곡선 (등게인 vs 등전력)',
  summary: '두 소리를 겹쳐 바꾸는 크로스페이드는 곡선 모양에 따라 중간 크기가 달라짐. A의 선형(등게인) 곡선은 서로 다른 소리를 섞을 때 가운데에서 3 dB 꺼짐. B의 등전력 곡선은 크기가 일정함. 같은 소리를 섞을 때는 반대로 등게인이 맞음.',
  views: { a: '선형 (등게인)', b: '등전력 (사인/코사인)' },
  controls: '파라미터 표에서 곡선 모양, 페이드 길이, 두 소리의 상관 여부를 바꿈. "소리 켜기"로 두 화음이 번갈아 바뀌는 소리를 들음.',
  info: `
    <p><b>크로스페이드(Crossfade)</b>는 소리 X를 줄이면서 동시에 소리 Y를 키우는 전환. 음악 편집, DJ 믹스, 게임 배경 음악 전환, 오디오 클립 이어 붙이기에 씀.</p>
    <ul>
      <li><b>등게인 (선형)</b>: X = 1 - t, Y = t. 두 게인의 합이 1. 같은 소리(상관 신호)는 진폭이 더해지므로 크기가 일정. 서로 다른 소리는 전력이 더해지므로 가운데에서 0.25 + 0.25 = 0.5 (-3 dB).</li>
      <li><b>등전력</b>: X = cos(tπ/2), Y = sin(tπ/2). 게인 제곱의 합이 1. 서로 다른 소리에서 크기가 일정. 같은 소리에 쓰면 가운데가 +3 dB 솟음.</li>
      <li><b>dB 선형 (지수)</b>: 게인을 dB로 일정하게 바꿈(-60 dB까지). 페이드 아웃 하나만 볼 때 귀에 고르게 줄어드는 느낌. 크로스페이드에서는 가운데가 크게 꺼짐.</li>
    </ul>
    <p>볼륨 오토메이션도 같은 원리. 진폭을 직선으로 줄이면 처음에는 거의 안 줄어든 것처럼 들리다가 끝에서 급히 사라짐. 귀가 크기를 로그(dB)로 느끼기 때문.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="150" x2="250" y2="150" class="d-line"/><line x1="30" y1="150" x2="30" y2="20" class="d-line"/>
    <line x1="30" y1="30" x2="250" y2="150" class="d-a"/><line x1="30" y1="150" x2="250" y2="30" class="d-a"/>
    <text x="140" y="170" text-anchor="middle" class="t-small t-a">${L('등게인: 가운데 0.5 + 0.5', 'Equal gain: 0.5 + 0.5 at center')}</text>
    <line x1="290" y1="150" x2="510" y2="150" class="d-line"/><line x1="290" y1="150" x2="290" y2="20" class="d-line"/>
    <path d="M290,30 Q400,30 510,150" class="d-b"/><path d="M290,150 Q400,30 510,30" class="d-b"/>
    <text x="400" y="170" text-anchor="middle" class="t-small t-b">${L('등전력: 가운데 0.707 + 0.707', 'Equal power: 0.707 + 0.707 at center')}</text>
    <text x="36" y="22" class="t-small">X</text><text x="244" y="22" class="t-small">Y</text>
    <text x="296" y="22" class="t-small">X</text><text x="504" y="22" class="t-small">Y</text>
    <circle cx="140" cy="90" r="3" class="f-a"/><circle cx="400" cy="65" r="3" class="f-b"/>
  </svg>`,
  look: [
    '위 그래프의 흰 점선(합친 크기)이 A에서는 크로스페이드 가운데에서 -3 dB까지 꺼짐. B는 0 dB로 평평함.',
    '"상관된 두 소리"를 켜면 반대가 됨. A가 평평하고 B는 가운데가 +3 dB 솟음.',
    '곡선을 dB 선형으로 바꾸면 가운데가 -27 dB 안팎까지 꺼짐',
    '소리를 켜고 A를 들으면 화음이 바뀌는 순간마다 소리가 살짝 움푹 꺼짐',
  ],
  refs: [
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '엔벨로프, 진폭 곡선과 데시벨' },
    { type: 'engine', title: 'MDN - AudioParam (linearRampToValueAtTime, exponentialRampToValueAtTime, setValueCurveAtTime)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioParam', note: 'Web Audio의 선형, 지수 페이드' },
    { type: 'engine', title: 'Audiokinetic Wwise Help - Music Switch Container transitions', note: '음악 전환의 페이드 인, 페이드 아웃 곡선 설정' },
    { type: 'book', title: 'Karen Collins, Game Sound', year: 2008, note: '게임 음악 전환과 크로스페이드' },
  ],
  params: [
    { key: 'curve', label: '곡선', type: 'select', options: [{ value: 'linear', label: '선형 (등게인)' }, { value: 'power', label: '등전력' }, { value: 'db', label: 'dB 선형' }], default: 'power', a: 'linear', b: 'power', group: '크로스페이드' },
    { key: 'fade', label: '페이드 길이 (초)', type: 'range', min: 0.2, max: 4, step: 0.1, default: 2, shared: true },
    { key: 'corr', label: '상관된 두 소리', type: 'bool', default: false, shared: true, help: '켜면 X와 Y가 같은 소리 (예: 같은 녹음의 두 테이크 이어 붙이기)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Crossfade Curves (Equal Gain vs Equal Power)',
    summary: 'A crossfade overlaps two sounds to switch between them, and the curve shape changes the level in the middle. The linear (equal gain) curve in A dips 3 dB in the middle when mixing different sounds. The equal power curve in B keeps the level constant. When mixing the same sound, equal gain is the right one instead.',
    views: { a: 'Linear (equal gain)', b: 'Equal power (sine/cosine)' },
    controls: 'Change the curve, fade length and whether the two sounds are correlated in the parameter table. Press "Sound on" to hear two chords swap back and forth.',
    info: `
    <p>A <b>crossfade</b> lowers sound X while raising sound Y at the same time. It is used in music editing, DJ mixes, game music transitions and joining audio clips.</p>
    <ul>
      <li><b>Equal gain (linear)</b>: X = 1 - t, Y = t. The gains sum to 1. The same sound (correlated) adds as amplitude, so the level stays constant. Different sounds add as power, so the middle is 0.25 + 0.25 = 0.5 (-3 dB).</li>
      <li><b>Equal power</b>: X = cos(tπ/2), Y = sin(tπ/2). The squared gains sum to 1. The level stays constant for different sounds. Used on the same sound, the middle jumps +3 dB.</li>
      <li><b>dB linear (exponential)</b>: the gain changes evenly in dB (down to -60 dB). For a single fade out it sounds like an even fade to the ear. In a crossfade the middle dips a lot.</li>
    </ul>
    <p>Volume automation works the same way. A straight line in amplitude sounds like almost nothing happens at first, then the sound vanishes quickly at the end. This is because the ear hears level on a log (dB) scale.</p>`,
    look: [
      'In the top graph, the white dashed line (combined level) dips to -3 dB in the middle of the crossfade in A. B stays flat at 0 dB.',
      'Turn on "Correlated sounds". Now it is the other way around: A is flat and B jumps +3 dB in the middle.',
      'Change the curve to dB linear. The middle dips to about -27 dB.',
      'Turn on sound and listen to A. The sound dips slightly every time the chord changes.',
    ],
    refs: ['Envelopes, amplitude curves and decibels.', 'Linear and exponential fades in Web Audio.', 'Fade in and fade out curve settings for music transitions.', 'Game music transitions and crossfades.'],
    params: {
      curve: { label: 'Curve', group: 'Crossfade', options: { linear: 'Linear (equal gain)', power: 'Equal power', db: 'dB linear' } },
      fade: 'Fade length (s)',
      corr: { label: 'Correlated sounds', help: 'When on, X and Y are the same sound (for example, joining two takes of the same recording)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const HOLD = 1;
    // 크로스페이드 진행도 t(0~1) → [gX, gY]
    function gains(curve, t) {
      t = U.clamp(t, 0, 1);
      if (curve === 'linear') return [1 - t, t];
      if (curve === 'db') { const f = (u) => (u <= 0 ? 0 : A.dbToLin(-60 * (1 - u))); return [f(1 - t), f(t)]; }
      return [Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)];
    }
    // 합친 크기 (dB): 상관이면 진폭 합, 무상관이면 전력 합
    const sumDb = (g, corr) => (corr ? A.linToDb(g[0] + g[1]) : 10 * Math.log10(Math.max(1e-12, g[0] * g[0] + g[1] * g[1])));
    // 한 주기: X 유지 → X에서 Y로 → Y 유지 → Y에서 X로. 반환: Y의 비중 t
    function mixAt(time) {
      const per = 2 * (HOLD + P.fade), u = ((time % per) + per) % per;
      if (u < HOLD) return 0;
      if (u < HOLD + P.fade) return (u - HOLD) / P.fade;
      if (u < 2 * HOLD + P.fade) return 1;
      return 1 - (u - 2 * HOLD - P.fade) / P.fade;
    }

    // 소리: X = C장조 화음, Y = A단조 화음 (무상관). corr이면 Y = X
    let st = null, t = 0;
    function newSynth(sr) { return { sr, ph: new Float64Array(12), lp: A.biquad('lowpass', 1500, 0.7, 0, sr), lp2: A.biquad('lowpass', 1500, 0.7, 0, sr) }; }
    const CH_X = [48, 55, 60, 64], CH_Y = [45, 52, 57, 60];
    function voice(s, chord, off, sr) {
      let v = 0;
      chord.forEach((m, j) => { const f = A.mtof(m) * (1 + (j - 1.5) * 0.002); s.ph[off + j] = (s.ph[off + j] + f / sr) % 1; v += 2 * s.ph[off + j] - 1; });
      return v * 0.09;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!st || st.sr !== sr) st = newSynth(sr);
        for (let i = 0; i < n; i++) {
          const x = st.lp.process(voice(st, CH_X, 0, sr));
          const y = P.corr ? x : st.lp2.process(voice(st, CH_Y, 4, sr));
          const g = gains(P.curve, mixAt(t));
          const v = x * g[0] + y * g[1];
          l[i] = v; r[i] = v;
          t += 1 / sr;
        }
      },
    });

    let cKey = '', cv = null;
    function curveData() {
      const k = P.curve + P.corr;
      if (k === cKey) return cv;
      cKey = k;
      const M = 121, gx = new Float32Array(M), gy = new Float32Array(M), sd = new Float32Array(M);
      let mn = 99, mx = -99;
      for (let i = 0; i < M; i++) { const g = gains(P.curve, i / (M - 1)); gx[i] = g[0]; gy[i] = g[1]; sd[i] = sumDb(g, P.corr); mn = Math.min(mn, sd[i]); mx = Math.max(mx, sd[i]); }
      cv = { M, gx, gy, sd, mn, mx, mid: sumDb(gains(P.curve, 0.5), P.corr) };
      return cv;
    }

    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2, c = curveData();
        const now = snd.on ? t : ctx.time, m = mixAt(now), gn = gains(P.curve, m);
        // 곡선 (크로스페이드 0 → 1)
        const h1 = (H - pad * 3) * 0.6, toY = (v) => pad + 14 + (h1 - 28) * (1 - v / 1.2), toYdb = (db) => pad + 14 + (h1 - 28) * (1 - (U.clamp(db, -36, 6) + 36) / 42);
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        for (const v of [0.5, 0.707, 1]) { D.line(g, pad, toY(v), pad + iw, toY(v), C.grid); D.text(g, String(v), pad + 2, toY(v) - 10, { size: 9, color: C.dim }); }
        const plot = (arr, f, color, dash) => { g.beginPath(); for (let i = 0; i < c.M; i++) { const px = pad + iw * i / (c.M - 1), py = f(arr[i]); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.setLineDash(dash || []); g.strokeStyle = color; g.lineWidth = 2; g.stroke(); g.setLineDash([]); };
        plot(c.gx, toY, C.series[0]); plot(c.gy, toY, C.series[1]); plot(c.sd, toYdb, C.text, [5, 4]);
        for (const db of [-6, -3, 0, 3]) D.text(g, (db > 0 ? '+' : '') + db + ' dB', pad + iw - 4, toYdb(db) - 5, { size: 9, color: C.dim, align: 'right' });
        const px = pad + iw * m;
        D.line(g, px, pad, px, pad + h1, col, 1);
        D.circle(g, px, toY(gn[0]), 4, C.series[0]); D.circle(g, px, toY(gn[1]), 4, C.series[1]); D.circle(g, px, toYdb(sumDb(gn, P.corr)), 4, C.text);
        D.text(g, GTL.L('게인 X, Y (선)와 합친 크기 (흰 점선, dB)', 'Gain X, Y (lines) and combined level (white dashed, dB)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        D.text(g, GTL.L('X만', 'X only'), pad + 2, pad + h1 - 12, { size: 9, color: C.dim }); D.text(g, GTL.L('Y만', 'Y only'), pad + iw - 2, pad + h1 - 12, { size: 9, color: C.dim, align: 'right' });
        // 타임라인: 합친 크기
        const y2 = pad * 2 + h1, h2 = H - y2 - pad, per = 2 * (HOLD + P.fade), steps = 200;
        D.rect(g, pad, y2, iw, h2, 'rgba(0,0,0,0.35)');
        const toY2 = (db) => y2 + 8 + (h2 - 16) * (1 - (U.clamp(db, -12, 6) + 12) / 18);
        D.line(g, pad, toY2(0), pad + iw, toY2(0), C.grid);
        g.beginPath();
        for (let i = 0; i <= steps; i++) { const tt = per * i / steps, v = sumDb(gains(P.curve, mixAt(tt)), P.corr), x = pad + iw * i / steps; i ? g.lineTo(x, toY2(v)) : g.moveTo(x, toY2(v)); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        const hx = pad + iw * (((now % per) + per) % per) / per; D.line(g, hx, y2, hx, y2 + h2, C.text);
        D.text(g, GTL.L('시간에 따른 합친 크기 (X → Y → X, -12 ~ +6 dB)', 'Combined level over time (X → Y → X, -12 to +6 dB)'), pad + 4, y2 + 3, { size: 10, color: C.dim });

        ctx.stat(GTL.L('가운데 합친 크기', 'Combined level at center'), (c.mid >= 0 ? '+' : '') + c.mid.toFixed(1) + ' dB');
        ctx.stat(GTL.L('크로스페이드 중 변화 폭', 'Level change during fade'), (c.mx - c.mn).toFixed(1) + ' dB');
        ctx.stat(GTL.L('지금 게인 X, Y', 'Gain X, Y now'), `${gn[0].toFixed(2)}, ${gn[1].toFixed(2)}`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
