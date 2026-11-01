// 벡터 기반 진폭 패닝(VBAP): 가장 가까운 스피커로 보내기 vs 두 스피커 벡터의 합으로 방향 만들기
GTL.register({
  id: 'vbap',
  title: '벡터 기반 진폭 패닝 (VBAP)',
  summary: '음원을 가장 가까운 스피커 하나로만 보내면 움직일 때 소리가 스피커 사이를 뚝뚝 건너뜀. VBAP은 이웃한 두 스피커의 방향 벡터를 더해 목표 방향을 만들고 전력을 일정하게 맞춰, 불규칙한 배치에서도 부드럽게 움직임.',
  views: { a: '가장 가까운 스피커', b: 'VBAP' },
  controls: '파라미터 표에서 음원 방향, 스피커 배치를 바꾸거나 자동 회전을 켬',
  info: `
    <p>여러 스피커로 소리 방향을 만드는 가장 흔한 방법은 진폭 패닝. 같은 신호를 두 스피커에 크기만 달리 보내면 그 사이에 가상 음원(Phantom Source)이 생김.</p>
    <p><b>VBAP(Vector Base Amplitude Panning)</b>: 목표 방향 벡터 <b>p</b>를 이웃한 두 스피커 방향 벡터의 합 <code>p = g₁l₁ + g₂l₂</code>로 나타냄</p>
    <ul>
      <li>게인: <code>[g₁ g₂] = pᵀ [l₁ l₂]⁻¹</code>. 두 게인이 모두 0 이상인 스피커 쌍을 고름.</li>
      <li>정규화: <code>g₁² + g₂² = 1</code>로 맞춰 방향과 상관없이 전력이 같음</li>
      <li>3D에서는 스피커 세 대(삼각형)로 같은 계산을 함</li>
    </ul>
    <p>스피커 간격이 달라도(ITU 5.0의 앞 30°, 뒤 110°) 그대로 동작. 그래서 극장, 돔, 설치 미술의 불규칙한 배치에 많이 씀.</p>
    <p>단점: 스피커 바로 위에서는 한 대만 울리고, 사이에서는 두 대가 울려서 상의 퍼짐이 방향마다 다름. 이를 줄이려고 MDAP(여러 방향으로 퍼뜨린 VBAP)을 씀. 스피커 간격이 넓으면(뒤쪽 140°) 가상 음원이 불안정함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <circle cx="150" cy="150" r="5" class="f-dim"/>
    <text x="150" y="168" text-anchor="middle" class="t-small">${L('청취자', 'listener')}</text>
    <path d="M150,150 L60,30" class="d-dim" stroke-dasharray="4 3"/><path d="M150,150 L250,30" class="d-dim" stroke-dasharray="4 3"/>
    <rect x="52" y="20" width="16" height="16" class="f-dim"/><rect x="242" y="20" width="16" height="16" class="f-dim"/>
    <text x="40" y="16" class="t-small">${L('스피커 1 (l₁)', 'speaker 1 (l₁)')}</text><text x="226" y="16" class="t-small">${L('스피커 2 (l₂)', 'speaker 2 (l₂)')}</text>
    <path d="M150,150 L114,102" class="d-b" marker-end="url(#arr)"/><text x="104" y="124" class="t-small t-b">g₁l₁</text>
    <path d="M114,102 L184,48" class="d-b" marker-end="url(#arr)"/><text x="160" y="84" class="t-small t-b">g₂l₂</text>
    <path d="M150,150 L184,48" class="d-accent" marker-end="url(#arr)"/>
    <text x="192" y="58" class="t-small">${L('목표 방향 p', 'target p')}</text>
    <text x="300" y="60" class="t-small">${L('1. 목표 방향을 감싸는 스피커 쌍을 찾음', '1. Find the speaker pair around the target')}</text>
    <text x="300" y="84" class="t-small">${L('2. 2x2 역행렬로 g₁, g₂를 구함', '2. Solve g₁, g₂ with a 2x2 inverse')}</text>
    <text x="300" y="108" class="t-small">${L('3. g₁² + g₂² = 1로 정규화', '3. Normalize so g₁² + g₂² = 1')}</text>
  </svg>`,
  look: [
    '자동 회전을 켜고 들으면 A는 소리가 스피커 위치로 뚝뚝 건너뜀. B는 부드럽게 돎.',
    '아래 왼쪽 "들리는 방향" 그래프에서 A는 계단, B는 대각선에 가까운 곡선',
    'B의 방식을 "선형 크로스페이드"로 바꾸면 아래 오른쪽 전력 그래프가 스피커 사이에서 3dB 가까이 꺼짐',
    '배치를 ITU 5.0으로 바꾸고 음원을 180°로 두면 뒤쪽 두 스피커 사이가 넓어서 B의 rV 크기가 작아짐(상이 흐려짐)',
  ],
  refs: [
    { type: 'paper', title: 'Ville Pulkki, "Virtual Sound Source Positioning Using Vector Base Amplitude Panning", Journal of the Audio Engineering Society 45(6)', year: 1997, note: 'VBAP 원 논문' },
    { type: 'paper', title: 'Ville Pulkki, "Uniform Spreading of Amplitude Panned Virtual Sources", IEEE WASPAA', year: 1999, note: 'MDAP: 퍼짐을 고르게 만드는 방법' },
    { type: 'article', title: 'ITU-R BS.775, Multichannel stereophonic sound system with and without accompanying picture', note: '5.1 스피커 배치 (0°, ±30°, ±110°)' },
    { type: 'book', title: 'Franz Zotter, Matthias Frank, Ambisonics, Springer', year: 2019, note: '진폭 패닝과 rV, rE 지표 비교 (2장)' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'nearest', label: '가장 가까운 스피커' }, { value: 'linear', label: '선형 크로스페이드' }, { value: 'vbap', label: 'VBAP' }], a: 'nearest', b: 'vbap', group: '패닝' },
    { key: 'layout', label: '스피커 배치', type: 'select', options: [{ value: 'quad', label: '쿼드 (±45°, ±135°)' }, { value: 'itu', label: 'ITU 5.0 (0°, ±30°, ±110°)' }, { value: 'ring6', label: '6대 원형' }, { value: 'ring8', label: '8대 원형' }], default: 'itu', shared: true },
    { key: 'az', label: '음원 방향 (°)', type: 'range', min: -180, max: 180, step: 1, default: 15, shared: true, group: '장면', help: '0 = 정면, + = 오른쪽' },
    { key: 'sweep', label: '자동 회전', type: 'bool', default: false, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Vector Base Amplitude Panning (VBAP)',
    summary: 'If you send a source only to the nearest speaker, a moving sound jumps from speaker to speaker. VBAP builds the target direction from the sum of two neighboring speaker vectors and keeps the power constant, so it moves smoothly even on irregular layouts.',
    views: { a: 'Nearest speaker', b: 'VBAP' },
    controls: 'Change the source direction or speaker layout in the parameter table, or turn on auto rotate.',
    info: `
    <p>The most common way to create direction with many speakers is amplitude panning. Send the same signal to two speakers at different levels and a virtual source (phantom source) appears between them.</p>
    <p><b>VBAP (Vector Base Amplitude Panning)</b>: write the target direction vector <b>p</b> as the sum of two neighboring speaker vectors, <code>p = g₁l₁ + g₂l₂</code>.</p>
    <ul>
      <li>Gains: <code>[g₁ g₂] = pᵀ [l₁ l₂]⁻¹</code>. Choose the speaker pair where both gains are 0 or more.</li>
      <li>Normalization: set <code>g₁² + g₂² = 1</code> so the power is the same in every direction.</li>
      <li>In 3D the same math uses three speakers (a triangle).</li>
    </ul>
    <p>It works even when the spacing differs (ITU 5.0 has 30 degrees in front and 110 degrees at the back). That is why it is common for cinemas, domes and installations with irregular layouts.</p>
    <p>Downsides: right on a speaker only one speaker plays, between speakers two play, so the image width changes with direction. MDAP (VBAP spread over several directions) reduces this. When speakers are far apart (140 degrees at the back), the phantom source is unstable.</p>`,
    look: [
      'Turn on auto rotate and listen. In A the sound jumps between speaker positions. In B it moves smoothly.',
      'In the "perceived direction" graph at bottom left, A is a staircase and B is close to the diagonal.',
      'Change B\'s method to "Linear crossfade". The power graph at bottom right dips almost 3 dB between speakers.',
      'Switch to ITU 5.0 and put the source at 180 degrees. The two rear speakers are far apart, so B\'s rV length gets small (blurry image).',
    ],
    refs: ['The original VBAP paper.', 'MDAP: a way to make the spread even.', 'The 5.1 speaker layout (0, ±30, ±110 degrees).', 'Amplitude panning compared with the rV and rE measures (chapter 2).'],
    params: {
      method: { label: 'Method', group: 'Panning', options: { nearest: 'Nearest speaker', linear: 'Linear crossfade' } },
      layout: { label: 'Speaker layout', options: { quad: 'Quad (±45°, ±135°)', itu: 'ITU 5.0 (0°, ±30°, ±110°)', ring6: '6-speaker ring', ring8: '8-speaker ring' } },
      az: { label: 'Source direction (°)', group: 'Scene', help: '0 = front, + = right' },
      sweep: 'Auto rotate',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const RAD = Math.PI / 180;
    const LAYOUTS = {
      quad: [-135, -45, 45, 135], itu: [-110, -30, 0, 30, 110],
      ring6: [-120, -60, 0, 60, 120, 180], ring8: [-135, -90, -45, 0, 45, 90, 135, 180],
    };
    let sweepT = 0;
    const azNow = () => (P.sweep ? ((sweepT * 30) % 360) - 180 : P.az);
    const norm360 = (a) => ((a % 360) + 360) % 360;

    // 패닝 게인. 반환: { g: [], pair: [i, j] }
    function pan(az, method = P.method) {
      const sp = LAYOUTS[P.layout], N = sp.length, g = new Array(N).fill(0);
      // 목표 방향을 감싸는 이웃 쌍 찾기 (정렬된 배열, 원형)
      let i0 = N - 1, i1 = 0;
      for (let i = 0; i < N; i++) {
        const a = sp[i], b = sp[(i + 1) % N], span = norm360(b - a) || 360, t = norm360(az - a);
        if (t <= span) { i0 = i; i1 = (i + 1) % N; break; }
      }
      const a1 = sp[i0], span = norm360(sp[i1] - a1) || 360, t = norm360(az - a1);
      if (method === 'nearest') {
        let best = 0, bd = 999;
        sp.forEach((s, i) => { const d = Math.abs(norm360(az - s + 180) - 180); if (d < bd) { bd = d; best = i; } });
        g[best] = 1;
        return { g, pair: [best, best] };
      }
      if (method === 'linear') {
        const f = t / span; g[i0] = 1 - f; g[i1] += f;
        return { g, pair: [i0, i1] };
      }
      // VBAP 2D: 두 단위 벡터의 역행렬
      const g1 = Math.sin((span - t) * RAD) / Math.sin(span * RAD), g2 = Math.sin(t * RAD) / Math.sin(span * RAD);
      const n = Math.hypot(g1, g2) || 1;
      g[i0] = Math.max(0, g1) / n; g[i1] += Math.max(0, g2) / n;
      return { g, pair: [i0, i1] };
    }
    function velocity(g) {
      const sp = LAYOUTS[P.layout];
      let x = 0, y = 0, s = 0, pw = 0;
      sp.forEach((d, i) => { x += g[i] * Math.cos(d * RAD); y += g[i] * Math.sin(d * RAD); s += g[i]; pw += g[i] * g[i]; });
      return { dir: Math.atan2(y, x) / RAD, len: Math.hypot(x, y) / Math.max(1e-9, s), power: pw };
    }

    // 소리: 가상 스피커를 간단한 머리 모델로 헤드폰에 합침
    const noise = A.noiseBuffer(1 << 16, 17);
    let tS = 0;
    function source(sr) {
      const t = tS; tS += 1 / sr;
      const tt = t % 0.25, acc = Math.floor(t / 0.25) % 4 === 0 ? 1 : 0.6;
      return noise[Math.floor(t * sr) & 0xffff] * Math.exp(-tt / 0.04) * Math.min(1, tt / 0.002) * acc * 0.8;
    }
    const earOf = (dDeg, sr) => {
      const th = dDeg * RAD, lat = Math.asin(Math.sin(th)), itd = 0.0875 / 343 * (Math.abs(lat) + Math.sin(Math.abs(lat))) * sr;
      const far = A.dbToLin(-6 * Math.abs(Math.sin(th))), right = Math.sin(th) >= 0;
      return { dl: Math.round(right ? itd : 0), dr: Math.round(right ? 0 : itd), gl: right ? far : 1, gr: right ? 1 : far };
    };
    const M = 1023, buf = new Float32Array(M + 1);
    let w = 0, sm = [];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const g = pan(azNow()).g, sp = LAYOUTS[P.layout];
        if (sm.length !== g.length) sm = g.slice();
        const ears = sp.map((d) => earOf(d, sr));
        for (let i = 0; i < n; i++) {
          buf[w] = source(sr);
          let sl = 0, sr2 = 0;
          for (let j = 0; j < g.length; j++) {
            sm[j] += (g[j] - sm[j]) * 0.004;
            const e = ears[j];
            sl += buf[(w - e.dl) & M] * e.gl * sm[j]; sr2 += buf[(w - e.dr) & M] * e.gr * sm[j];
          }
          l[i] = sl * 0.5; r[i] = sr2 * 0.5;
          w = (w + 1) & M;
        }
      },
    });

    let curveKey = '', curve = null;
    function curves() {
      const k = P.method + P.layout;
      if (k !== curveKey) {
        curveKey = k; curve = [];
        for (let a = -180; a <= 180; a += 1) { const v = velocity(pan(a).g); curve.push({ a, dir: v.dir, pw: 10 * Math.log10(Math.max(1e-9, v.power)) }); }
      }
      return curve;
    }

    return {
      update(dt) { if (P.sweep) sweepT += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const az = azNow(), pn = pan(az), v = velocity(pn.g), sp = LAYOUTS[P.layout];
        const topH = Math.max(140, H * 0.58), cx = W / 2, cy = pad + topH / 2 + 4, R = topH / 2 - 24;
        const P2 = (deg, rr) => ({ x: cx + Math.sin(deg * RAD) * rr, y: cy - Math.cos(deg * RAD) * rr });
        D.circle(g, cx, cy, R, null, C.grid, 1);
        D.circle(g, cx, cy, 10, '#2a2f38', C.dim, 1.5); D.line(g, cx, cy, cx, cy - 14, C.text, 1.5);
        // 벡터 합 (평행사변형)
        const [i0, i1] = pn.pair;
        if (i0 !== i1) {
          const a = P2(sp[i0], pn.g[i0] * R), b = P2(sp[i1], pn.g[i1] * R), tip = { x: a.x + b.x - cx, y: a.y + b.y - cy };
          D.line(g, cx, cy, a.x, a.y, col, 2); D.line(g, a.x, a.y, tip.x, tip.y, col, 1); D.line(g, cx, cy, b.x, b.y, col, 2); D.line(g, b.x, b.y, tip.x, tip.y, col, 1);
          D.circle(g, tip.x, tip.y, 3, col);
        }
        sp.forEach((d, i) => {
          const p = P2(d, R), on = pn.g[i] > 1e-3;
          D.rect(g, p.x - 8, p.y - 8, 16, 16, on ? col : '#2a2f38', C.dim, 1);
          D.text(g, pn.g[i].toFixed(2), p.x, p.y + 10, { size: 9, align: 'center', color: on ? C.text : C.dim });
        });
        const s = P2(az, R + 16);
        D.circle(g, s.x, s.y, 6, C.text);
        const vv = P2(v.dir, v.len * R);
        D.arrow(g, cx, cy, vv.x, vv.y, C.good, 2);
        D.text(g, Lg('흰 점 = 목표 방향, 초록 = 속도 벡터 rV (들리는 방향)', 'White dot = target, green = velocity vector rV (perceived direction)'), pad, pad, { size: 10, color: C.dim });
        // 아래 두 그래프
        const gy = pad + topH + 8, gh = H - gy - pad;
        if (gh > 40) {
          const cv = curves(), gw = (W - pad * 3) / 2;
          // 들리는 방향
          const x1 = pad, aX = (a) => x1 + gw * (a + 180) / 360, dY = (d) => gy + gh - 4 - (gh - 18) * (d + 180) / 360;
          D.rect(g, x1, gy, gw, gh, 'rgba(0,0,0,0.35)');
          D.line(g, aX(-180), dY(-180), aX(180), dY(180), C.grid, 1);
          g.beginPath(); let prev = null;
          for (const p of cv) { const y = dY(p.dir); if (prev !== null && Math.abs(p.dir - prev) > 180) g.moveTo(aX(p.a), y); else if (prev === null) g.moveTo(aX(p.a), y); else g.lineTo(aX(p.a), y); prev = p.dir; }
          g.strokeStyle = col; g.lineWidth = 2; g.stroke();
          D.circle(g, aX(az), dY(v.dir), 4, C.text);
          D.text(g, Lg('들리는 방향 (rV) vs 목표', 'Perceived (rV) vs target'), x1 + 4, gy + 3, { size: 10, color: C.dim });
          // 전력
          const x2 = pad * 2 + gw, bX = (a) => x2 + gw * (a + 180) / 360, pY = (db) => gy + 16 + (gh - 24) * U.clamp(-db / 6, 0, 1);
          D.rect(g, x2, gy, gw, gh, 'rgba(0,0,0,0.35)');
          for (const db of [0, -3, -6]) { D.line(g, x2, pY(db), x2 + gw, pY(db), C.grid, 1); D.text(g, db + 'dB', x2 + 2, pY(db) - 10, { size: 9, color: C.dim }); }
          g.beginPath(); cv.forEach((p, i) => (i ? g.lineTo(bX(p.a), pY(p.pw)) : g.moveTo(bX(p.a), pY(p.pw)))); g.strokeStyle = col; g.lineWidth = 2; g.stroke();
          D.line(g, bX(az), gy, bX(az), gy + gh, C.text, 1);
          D.text(g, Lg('전체 전력 (Σg²)', 'Total power (Σg²)'), x2 + 40, gy + 3, { size: 10, color: C.dim });
        }
        const err = Math.abs(((v.dir - az) % 360 + 540) % 360 - 180);
        ctx.stat(Lg('켜진 스피커', 'Active speakers'), pn.g.filter((x) => x > 1e-3).length);
        ctx.stat(Lg('rV 방향 오차', 'rV direction error'), `${err.toFixed(1)}°`);
        ctx.stat(Lg('rV 크기', 'rV length'), v.len.toFixed(3));
        ctx.stat(Lg('전체 전력', 'Total power'), `${(10 * Math.log10(Math.max(1e-9, v.power))).toFixed(2)} dB`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
