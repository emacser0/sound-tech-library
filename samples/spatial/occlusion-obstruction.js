// 가림 (오클루전, 옵스트럭션): 광선 하나로 켜고 끄기 vs 여러 광선의 가려진 비율로 부드럽게
GTL.register({
  id: 'occlusion-obstruction',
  title: '벽에 가린 소리 (오클루전, 옵스트럭션)',
  summary: '벽 뒤의 소리는 작고 먹먹해야 함. 음원과 청취자 사이에 광선 하나만 쏘면 벽 모서리를 지나는 순간 소리가 뚝 바뀜. 음원 폭에 걸쳐 광선 여러 개를 쏘고 가려진 비율을 쓰면 모서리에서 부드럽게 바뀜.',
  views: { a: '광선 1개 (켜기/끄기)', b: '광선 9개 (가려진 비율)' },
  controls: '자동 이동을 끄고 뷰에서 클릭하거나 끌어서 청취자(사각형)를 옮김',
  info: `
    <p>게임 엔진은 벽에 가린 소리를 두 가지로 나눔 (Wwise 용어 기준)</p>
    <ul>
      <li><b>옵스트럭션(Obstruction)</b>: 같은 방 안에서 기둥이나 상자가 직접음만 가림. 직접음은 작고 먹먹해지지만 방 잔향은 그대로.</li>
      <li><b>오클루전(Occlusion)</b>: 벽 너머 다른 방의 소리. 직접음과 잔향이 모두 벽을 통과해야 해서 전부 작고 먹먹해짐.</li>
    </ul>
    <p>가림 정도는 보통 레이캐스트로 구함. 광선 하나는 싸지만 결과가 0 아니면 1이라, 청취자가 모서리를 지날 때 소리가 갑자기 바뀜. 실제로는 회절 때문에 모서리 근처에서 서서히 바뀜.</p>
    <p>개선: 음원 폭에 걸쳐 광선 여러 개를 쏴서 가려진 비율(0~1)을 쓰고, 값을 시간에 따라 부드럽게 바꿈. 가림 값은 볼륨(dB)과 로우패스 차단 주파수에 연결함.</p>
    <p>단점: 광선 수만큼 비용이 듦. 문틈이나 돌아가는 경로(포털, 회절 경로)는 따로 처리해야 함(Wwise Spatial Audio의 포털과 회절, Steam Audio의 경로 탐색 등).</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <rect x="200" y="70" width="140" height="10" class="f-dim"/>
    <text x="270" y="64" text-anchor="middle" class="t-small">${L('벽', 'wall')}</text>
    <circle cx="300" cy="20" r="7" class="f-accent"/><text x="312" y="24" class="t-small">${L('음원', 'source')}</text>
    <rect x="114" y="134" width="12" height="12" class="f-b"/><text x="120" y="158" text-anchor="middle" class="t-small">${L('청취자', 'listener')}</text>
    <line x1="292" y1="22" x2="120" y2="140" class="d-good"/><line x1="296" y1="22" x2="120" y2="140" class="d-good"/>
    <line x1="300" y1="22" x2="120" y2="140" class="d-bad"/><line x1="304" y1="22" x2="120" y2="140" class="d-bad"/><line x1="308" y1="22" x2="120" y2="140" class="d-bad"/>
    <text x="340" y="100" class="t-small t-b">${L('9개 중 5개 가림 → 가림 0.56', '5 of 9 blocked → occlusion 0.56')}</text>
    <text x="340" y="118" class="t-small t-a">${L('광선 1개면 0 또는 1뿐', 'one ray gives only 0 or 1')}</text>
    <text x="340" y="136" class="t-small t-dim">${L('가림 → 볼륨 감소 + 로우패스', 'occlusion → lower volume + low-pass')}</text>
  </svg>`,
  look: [
    '소리를 켜고 들으면 A는 청취자가 벽 모서리를 지날 때 소리가 뚝 끊기듯 바뀜. B는 서서히 먹먹해짐.',
    '아래 "가림 값" 그래프에서 A는 계단, B는 경사로 바뀜',
    '가림 종류를 "오클루전"으로 바꾸면 벽 뒤에서 잔향도 같이 먹먹해짐. "옵스트럭션"에서는 잔향이 그대로 들림.',
    'B의 음원 폭을 0에 가깝게 줄이면 A와 같은 계단으로 돌아감',
  ],
  refs: [
    { type: 'engine', title: 'Audiokinetic Wwise, Obstruction and Occlusion (Project Settings, Spatial Audio)', note: '옵스트럭션은 직접음만, 오클루전은 직접음과 잔향을 함께 줄임' },
    { type: 'engine', title: 'Valve, Steam Audio Documentation: Occlusion and Transmission', url: 'https://valvesoftware.github.io/steam-audio/', note: '레이캐스트 가림과 부피 기반(볼류메트릭) 가림' },
    { type: 'book', title: 'Guy Somberg (ed.), Game Audio Programming: Principles and Practices, CRC Press', year: 2016, note: '게임 엔진의 오디오 레이캐스트와 가림 구현' },
    { type: 'book', title: 'Karen Collins, Game Sound, MIT Press', year: 2008, note: '게임 3D 음향의 개념' },
  ],
  params: [
    { key: 'rays', label: '광선 수', type: 'select', options: [{ value: 0, label: '가림 없음' }, { value: 1, label: '1개' }, { value: 9, label: '9개' }], a: 1, b: 9, group: '가림 계산' },
    { key: 'width', label: '음원 폭', type: 'range', min: 0.01, max: 0.3, step: 0.01, default: 0.12, when: (p) => p.rays > 1, help: '광선을 퍼뜨리는 폭 (장면 크기 대비)' },
    { key: 'kind', label: '가림 종류', type: 'select', options: [{ value: 'obstruction', label: '옵스트럭션 (직접음만)' }, { value: 'occlusion', label: '오클루전 (직접음 + 잔향)' }], default: 'obstruction', shared: true },
    { key: 'occDb', label: '최대 감쇠 (dB)', type: 'range', min: -40, max: 0, step: 1, default: -15, shared: true, group: '가림 효과' },
    { key: 'occLpf', label: '최대 가림 로우패스 (Hz)', type: 'range', min: 200, max: 8000, step: 50, default: 700, shared: true },
    { key: 'move', label: '자동 이동', type: 'bool', default: true, shared: true, group: '장면' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Sound Behind Walls (Occlusion, Obstruction)',
    summary: 'A sound behind a wall should be quiet and muffled. With a single ray between source and listener, the sound changes suddenly when you pass the wall edge. Casting several rays across the source width and using the blocked ratio makes the change smooth at the edge.',
    views: { a: '1 ray (on/off)', b: '9 rays (blocked ratio)' },
    controls: 'Turn off auto move and click or drag in the view to move the listener (square).',
    info: `
    <p>Game engines split blocked sound into two cases (using Wwise terms).</p>
    <ul>
      <li><b>Obstruction</b>: a pillar or box in the same room blocks only the direct sound. The direct sound gets quieter and duller, but the room reverb stays.</li>
      <li><b>Occlusion</b>: sound from another room behind a wall. Both direct sound and reverb must pass through the wall, so everything gets quieter and duller.</li>
    </ul>
    <p>The amount of blocking is usually found with raycasts. One ray is cheap, but the result is only 0 or 1, so the sound changes suddenly when the listener passes a corner. In reality, diffraction makes it change gradually near the edge.</p>
    <p>Improvement: cast several rays across the source width, use the blocked ratio (0~1), and smooth the value over time. Connect the occlusion value to volume (dB) and low-pass cutoff.</p>
    <p>Downsides: the cost grows with the number of rays. Door gaps and paths around corners (portals, diffraction paths) need separate handling (portals and diffraction in Wwise Spatial Audio, path finding in Steam Audio, and so on).</p>`,
    look: [
      'Turn on sound. In A the sound changes abruptly when the listener passes the wall edge. In B it gets muffled gradually.',
      'In the "occlusion value" graph at the bottom, A is a staircase and B is a slope.',
      'Change the type to "Occlusion". Behind the wall the reverb also gets muffled. With "Obstruction" the reverb stays.',
      'Shrink B\'s source width close to 0. It goes back to the same staircase as A.',
    ],
    refs: ['Obstruction lowers only the direct sound, occlusion lowers direct sound and reverb.', 'Raycast occlusion and volumetric occlusion.', 'Audio raycasts and occlusion in game engines.', 'Concepts of 3D sound in games.'],
    params: {
      rays: { label: 'Rays', group: 'Occlusion test', options: { 0: 'No occlusion', 1: '1 ray', 9: '9 rays' } },
      width: { label: 'Source width', help: 'Spread of the rays (relative to scene size)' },
      kind: { label: 'Type', options: { obstruction: 'Obstruction (direct only)', occlusion: 'Occlusion (direct + reverb)' } },
      occDb: { label: 'Max attenuation (dB)', group: 'Occlusion effect' },
      occLpf: 'Max occlusion low-pass (Hz)',
      move: { label: 'Auto move', group: 'Scene' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 장면 (0~1 좌표)
    const WALLS = [[0.42, 0.45, 0.72, 0.45], [0.72, 0.45, 0.72, 0.6], [0.12, 0.3, 0.2, 0.3]];
    const SRC = { x: 0.55, y: 0.2 };
    const S = { lx: 0.2, ly: 0.8, t: 0, occ: 0, hist: new Float32Array(240), hi: 0, hits: [] };
    const segHit = (ax, ay, bx, by, cx, cy, dx, dy) => {
      const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
      if (Math.abs(d) < 1e-12) return false;
      const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d, u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d;
      return t > 0 && t < 1 && u >= 0 && u <= 1;
    };
    // 가림 값 (0~1)과 광선 목록
    function cast() {
      const n = +P.rays, rays = [];
      if (n === 0) return { occ: 0, rays };
      const dx = S.lx - SRC.x, dy = S.ly - SRC.y, len = Math.hypot(dx, dy) || 1, px = -dy / len, py = dx / len;
      let blocked = 0;
      for (let i = 0; i < n; i++) {
        const o = n === 1 ? 0 : (i / (n - 1) - 0.5) * P.width;
        const sx = SRC.x + px * o, sy = SRC.y + py * o;
        const hit = WALLS.some((w) => segHit(sx, sy, S.lx, S.ly, w[0], w[1], w[2], w[3]));
        if (hit) blocked++;
        rays.push({ sx, sy, hit });
      }
      return { occ: blocked / n, rays };
    }

    // 소리: 음원 (코드 + 하이햇), 직접음 경로와 잔향 경로
    const noise = A.noiseBuffer(1 << 16, 61);
    const PROG = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]];
    const phs = new Float64Array(3);
    let tS = 0, d1 = 0, d2 = 0, w1 = 0, w2 = 0, sg = 1, sa = 1, sw = 1, swa = 1, fdn = null;
    function makeFdn(sr) { const lens = [1423, 1777, 2131, 2557].map((v) => Math.round(v * sr / 48000)); return { sr, lens, bufs: lens.map((x) => new Float32Array(x)), idx: [0, 0, 0, 0], lp: [0, 0, 0, 0], g: lens.map((x) => Math.pow(10, -3 * x / (sr * 1.4))) }; }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!fdn || fdn.sr !== sr) fdn = makeFdn(sr);
        const o = S.occ, gT = A.dbToLin(P.occDb * o), fc = Math.exp(Math.log(18000) + o * (Math.log(P.occLpf) - Math.log(18000)));
        const aT = Math.min(1, A.onePoleCoef(fc * 1.55, sr)), occl = P.kind === 'occlusion';
        const wgT = occl ? gT : 1, waT = occl ? aT : 1, F = fdn;
        for (let i = 0; i < n; i++) {
          const t = tS; tS += 1 / sr;
          const ch = PROG[Math.floor(t / 1.6) % PROG.length], hat = t % 0.2;
          let x = 0;
          for (let j = 0; j < 3; j++) { phs[j] += A.mtof(ch[j]) / sr; if (phs[j] >= 1) phs[j] -= 1; x += 2 * phs[j] - 1; }
          x = x * 0.12 + noise[Math.floor(t * sr) & 0xffff] * Math.exp(-hat / 0.015) * 0.3;
          sg += (gT - sg) * 0.003; sa += (aT - sa) * 0.003; sw += (wgT - sw) * 0.003; swa += (waT - swa) * 0.003;
          d1 += sa * (x - d1); d2 += sa * (d1 - d2);
          // 잔향 (4선 FDN)
          const o0 = F.bufs[0][F.idx[0]], o1 = F.bufs[1][F.idx[1]], o2 = F.bufs[2][F.idx[2]], o3 = F.bufs[3][F.idx[3]];
          const hs = [(o0 + o1 + o2 + o3) * 0.5, (o0 - o1 + o2 - o3) * 0.5, (o0 + o1 - o2 - o3) * 0.5, (o0 - o1 - o2 + o3) * 0.5];
          for (let j = 0; j < 4; j++) { F.lp[j] += 0.5 * (hs[j] - F.lp[j]); F.bufs[j][F.idx[j]] = F.lp[j] * F.g[j] + x * 0.15; F.idx[j] = (F.idx[j] + 1) % F.lens[j]; }
          const wl = (o0 + o2) * 0.5, wr = (o1 + o3) * 0.5;
          w1 += swa * ((wl + wr) * 0.5 - w1); w2 += swa * (w1 - w2);
          const wetL = (wl * 0.5 + w2 * 0.5) * sw, wetR = (wr * 0.5 + w2 * 0.5) * sw;
          const dry = d2 * sg;
          l[i] = (dry + wetL * 0.6) * 0.8; r[i] = (dry + wetR * 0.6) * 0.8;
        }
      },
    });

    function area() { const W = ctx.width, H = ctx.height, pad = 10, h = H * 0.64 - pad, s = Math.min(W - pad * 2, h); return { x: (W - s) / 2, y: pad, s }; }

    return {
      update(dt) {
        if (P.move) { S.t += dt; S.lx = 0.5 + 0.42 * Math.sin(S.t * 0.35); S.ly = 0.82; }
        const m = ctx.input.mouse, ar = area();
        if (!P.move && m.down && m.inside) { S.lx = U.clamp((m.x - ar.x) / ar.s, 0.02, 0.98); S.ly = U.clamp((m.y - ar.y) / ar.s, 0.02, 0.98); }
        const c = cast();
        // 값이 튀지 않게 시간 평활 (B는 광선 비율, A는 0/1 그대로)
        S.occ = +P.rays > 1 ? S.occ + (c.occ - S.occ) * Math.min(1, dt * 12) : c.occ;
        S.hits = c.rays;
        S.hist[S.hi] = S.occ; S.hi = (S.hi + 1) % S.hist.length;
        snd.update();
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, ar = area();
        const X = (x) => ar.x + x * ar.s, Y = (y) => ar.y + y * ar.s;
        D.rect(g, ar.x, ar.y, ar.s, ar.s, 'rgba(0,0,0,0.35)');
        for (const w of WALLS) D.line(g, X(w[0]), Y(w[1]), X(w[2]), Y(w[3]), C.text, 5);
        for (const r of S.hits) D.line(g, X(r.sx), Y(r.sy), X(S.lx), Y(S.ly), r.hit ? 'rgba(255,83,112,0.7)' : 'rgba(102,209,122,0.7)', 1);
        D.circle(g, X(SRC.x), Y(SRC.y), 8, C.warn);
        D.rect(g, X(S.lx) - 7, Y(S.ly) - 7, 14, 14, col);
        D.text(g, Lg('초록 = 열린 광선, 빨강 = 막힌 광선', 'Green = clear ray, red = blocked ray'), ar.x + 4, ar.y + 3, { size: 10, color: C.dim });
        // 아래: 가림 값 기록
        const gy = ar.y + ar.s + 8, gh = H - gy - pad;
        if (gh > 30) {
          const gw = W - pad * 2, N = S.hist.length;
          D.rect(g, pad, gy, gw, gh, 'rgba(0,0,0,0.35)');
          const yv = (v) => gy + gh - 6 - (gh - 22) * v;
          D.line(g, pad, yv(0), pad + gw, yv(0), C.grid, 1); D.line(g, pad, yv(1), pad + gw, yv(1), C.grid, 1);
          g.beginPath();
          for (let i = 0; i < N; i++) { const v = S.hist[(S.hi + i) % N], px = pad + gw * i / (N - 1); i ? g.lineTo(px, yv(v)) : g.moveTo(px, yv(v)); }
          g.strokeStyle = col; g.lineWidth = 2; g.stroke();
          D.text(g, Lg('가림 값 기록 (위 = 완전히 가림)', 'Occlusion value history (top = fully blocked)'), pad + 4, gy + 3, { size: 10, color: C.dim });
        }
        const fc = Math.exp(Math.log(18000) + S.occ * (Math.log(P.occLpf) - Math.log(18000)));
        ctx.stat(Lg('막힌 광선', 'Blocked rays'), `${S.hits.filter((r) => r.hit).length} / ${S.hits.length}`);
        ctx.stat(Lg('가림 값', 'Occlusion value'), S.occ.toFixed(2));
        ctx.stat(Lg('직접음 감쇠', 'Direct attenuation'), `${(P.occDb * S.occ).toFixed(1)} dB`);
        ctx.stat(Lg('로우패스 차단', 'Low-pass cutoff'), `${fc.toFixed(0)} Hz`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
