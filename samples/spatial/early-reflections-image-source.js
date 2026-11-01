// 이미지 소스 방식의 초기 반사음: 직접음만 vs 벽 반사(거울상 음원)까지
GTL.register({
  id: 'early-reflections-image-source',
  title: '초기 반사음 (이미지 소스 방식)',
  summary: '직사각형 방의 벽 반사는 벽 너머 거울 위치에 가짜 음원(이미지 소스)을 두면 정확히 계산됨. A는 직접음만, B는 2차 반사까지 넣어 방의 크기와 벽 위치가 들리게 함.',
  views: { a: '직접음만 (0차)', b: '2차 반사까지' },
  controls: '방 그림에서 클릭하거나 끌어서 음원(동그라미)을 옮김',
  info: `
    <p><b>초기 반사음(Early Reflections)</b>: 직접음 뒤 약 5~80ms 안에 도착하는 첫 몇 개의 벽 반사. 방의 크기, 모양, 음원과 벽의 거리를 알려 주는 단서. 뒤따르는 촘촘한 꼬리는 후기 잔향(Late Reverb).</p>
    <p><b>이미지 소스 방식(Image Source Method)</b>: 벽을 거울로 보고 음원을 벽 너머로 뒤집은 위치에 가상 음원을 둠. 청취자와 가상 음원을 잇는 직선 길이가 반사 경로 길이와 같음.</p>
    <ul>
      <li>지연: <code>거리 / 343m/s</code></li>
      <li>크기: <code>반사 계수^반사 횟수 / 거리</code></li>
      <li>방향: 청취자에서 가상 음원 쪽. 이 샘플은 좌우 팬으로만 반영.</li>
      <li>차수를 높이면 가상 음원이 2D에서 대략 2N²개, 3D에서 4N³/3개로 늘어남</li>
    </ul>
    <p>단점: 직육면체 방에서만 단순함. 모양이 복잡하면 가시성 검사가 필요하고, 높은 차수는 비용이 커져서 보통 2~3차까지만 계산하고 나머지는 잔향 알고리즘에 맡김. 이 샘플은 위에서 본 2D 방(바닥과 천장 생략).</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <rect x="160" y="30" width="200" height="120" class="f-dim"/>
    <rect x="360" y="30" width="200" height="120" class="d-dim" stroke-dasharray="4 3"/>
    <text x="260" y="22" text-anchor="middle" class="t-small">${L('실제 방', 'real room')}</text>
    <text x="450" y="22" text-anchor="middle" class="t-small t-dim">${L('거울에 비친 방', 'mirrored room')}</text>
    <circle cx="300" cy="70" r="6" class="f-b"/><text x="300" y="60" text-anchor="middle" class="t-small t-b">${L('음원', 'source')}</text>
    <circle cx="420" cy="70" r="6" class="f-a"/><text x="420" y="60" text-anchor="middle" class="t-small t-a">${L('이미지 소스', 'image source')}</text>
    <rect x="194" y="114" width="12" height="12" class="f-accent"/><text x="200" y="142" text-anchor="middle" class="t-small">${L('청취자', 'listener')}</text>
    <line x1="206" y1="116" x2="420" y2="70" class="d-a" stroke-dasharray="5 3"/>
    <path d="M206,116 L360,83 L300,70" class="d-line"/>
    <line x1="206" y1="118" x2="294" y2="72" class="d-b"/>
    <line x1="360" y1="30" x2="360" y2="150" class="d-accent"/>
    <text x="364" y="160" class="t-small">${L('벽 = 거울', 'wall = mirror')}</text>
    <text x="10" y="70" class="t-small">${L('반사 경로 길이', 'reflected path length')}</text>
    <text x="10" y="84" class="t-small">${L('= 이미지 소스까지 직선', '= straight line to the image')}</text>
  </svg>`,
  look: [
    '박수 소리로 A와 B를 번갈아 들으면 A는 건조한 바깥 소리, B는 방 안에서 친 박수처럼 들림',
    '음원을 벽 가까이 끌면 아래 반사음 그래프에서 첫 반사가 직접음 바로 뒤로 붙음',
    '방 크기를 30m로 키우면 반사 사이 간격이 벌어져 B에서 메아리처럼 들림',
    '반사 계수를 0.3으로 낮추면 B의 반사 막대가 낮아지고 소리가 A에 가까워짐',
  ],
  refs: [
    { type: 'paper', title: 'J. B. Allen, D. A. Berkley, "Image method for efficiently simulating small-room acoustics", Journal of the Acoustical Society of America 65(4)', year: 1979, note: '이미지 소스 방식의 고전 논문' },
    { type: 'book', title: 'Heinrich Kuttruff, Room Acoustics (5th Edition), Spon Press', year: 2009, note: '반사, 초기음과 후기 잔향' },
    { type: 'book', title: 'Michael Vorländer, Auralization: Fundamentals of Acoustics, Modelling, Simulation, Algorithms and Acoustic Virtual Reality, Springer', year: 2008, note: '이미지 소스와 가시성 검사' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects (2nd Edition), Wiley', year: 2011, note: '공간 효과 장' },
  ],
  params: [
    { key: 'order', label: '반사 차수', type: 'int', min: 0, max: 4, a: 0, b: 2, group: '반사', help: '0 = 직접음만' },
    { key: 'refl', label: '반사 계수', type: 'range', min: 0, max: 0.95, step: 0.01, default: 0.75, shared: true, help: '벽에서 반사될 때 남는 진폭 비율' },
    { key: 'roomW', label: '방 가로 (m)', type: 'range', min: 3, max: 30, step: 0.5, default: 10, shared: true, group: '방' },
    { key: 'roomD', label: '방 세로 (m)', type: 'range', min: 3, max: 30, step: 0.5, default: 7, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'clap', label: '박수' }, { value: 'pluck', label: '뜯는 음' }], default: 'clap', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Early Reflections (Image Source Method)',
    summary: 'In a rectangular room, wall reflections can be computed exactly by placing fake sources (image sources) at mirror positions behind the walls. A has only the direct sound. B adds reflections up to 2nd order, so you hear the room size and wall positions.',
    views: { a: 'Direct only (order 0)', b: 'Up to 2nd order' },
    controls: 'Click or drag in the room to move the source (circle).',
    info: `
    <p><b>Early reflections</b>: the first few wall reflections that arrive about 5~80 ms after the direct sound. They tell you the size and shape of the room and how far the source is from the walls. The dense tail that follows is the late reverb.</p>
    <p><b>Image Source Method</b>: treat each wall as a mirror and place a virtual source where the real source would appear behind it. The straight line from the listener to the virtual source has the same length as the reflected path.</p>
    <ul>
      <li>Delay: <code>distance / 343 m/s</code></li>
      <li>Level: <code>reflection coefficient^bounces / distance</code></li>
      <li>Direction: from the listener toward the virtual source. This sample uses only a left/right pan.</li>
      <li>Raising the order gives about 2N² virtual sources in 2D and 4N³/3 in 3D.</li>
    </ul>
    <p>Downsides: it is simple only for box-shaped rooms. Complex shapes need visibility checks, and high orders get expensive. Usually only 2nd or 3rd order is computed and a reverb algorithm handles the rest. This sample is a 2D room seen from above (no floor or ceiling).</p>`,
    look: [
      'Use the clap and switch between A and B. A sounds dry like outdoors. B sounds like a clap inside a room.',
      'Drag the source close to a wall. In the reflection graph the first reflection moves right behind the direct sound.',
      'Make the room 30 m wide. The gaps between reflections grow and B starts to sound like echoes.',
      'Lower the reflection coefficient to 0.3. B\'s reflection bars get shorter and it sounds closer to A.',
    ],
    refs: ['The classic image source paper.', 'Reflections, early sound and late reverb.', 'Image sources and visibility checks.', 'The chapter on spatial effects.'],
    params: {
      order: { label: 'Reflection order', group: 'Reflections', help: '0 = direct sound only' },
      refl: { label: 'Reflection coefficient', help: 'Share of amplitude left after a wall bounce' },
      roomW: { label: 'Room width (m)', group: 'Room' },
      roomD: 'Room depth (m)',
      src: { label: 'Source', options: { clap: 'Clap', pluck: 'Plucked note' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const CS = 343;
    // 위치는 방 크기에 대한 비율로 저장
    const S = { sx: 0.7, sy: 0.3, lx: 0.3, ly: 0.75 };
    const ORDER_COL = [C.text, C.b, C.good, C.warn, C.accent];

    // 이미지 소스 목록
    let key = '', imgs = [];
    function build() {
      const Lx = P.roomW, Ly = P.roomD, sx = S.sx * Lx, sy = S.sy * Ly, lx = S.lx * Lx, ly = S.ly * Ly;
      const k = [Lx, Ly, sx, sy, lx, ly, P.order, P.refl].join(',');
      if (k === key) return;
      key = k;
      const out = [], N = P.order;
      const axis = (s, Lw, m) => [{ p: 2 * m * Lw + s, n: Math.abs(2 * m) }, { p: 2 * m * Lw - s, n: Math.abs(2 * m - 1) }];
      for (let mx = -N; mx <= N + 1; mx++) for (const ix of axis(sx, Lx, mx)) {
        if (ix.n > N) continue;
        for (let my = -N; my <= N + 1; my++) for (const iy of axis(sy, Ly, my)) {
          const ord = ix.n + iy.n;
          if (ord > N) continue;
          const dx = ix.p - lx, dy = iy.p - ly, dist = Math.max(0.3, Math.hypot(dx, dy));
          const amp = Math.pow(P.refl, ord) / Math.max(1, dist);
          const pan = dx / dist; // -1 왼쪽 ~ 1 오른쪽 (청취자는 위쪽을 봄)
          out.push({ x: ix.p, y: iy.p, ord, dist, t: dist / CS, amp, pan });
        }
      }
      out.sort((a, b) => a.t - b.t);
      imgs = out;
    }

    // 음원과 탭 지연선
    const noise = A.noiseBuffer(1 << 16, 21);
    let tS = 0, ph = 0;
    function source(sr) {
      const t = tS; tS += 1 / sr;
      if (P.src === 'clap') { const tt = t % 0.9; return noise[Math.floor(t * sr) & 0xffff] * Math.exp(-tt / 0.012) * (tt < 0.0006 ? tt / 0.0006 : 1); }
      const tt = t % 0.9, f = 330; ph += f / sr; if (ph >= 1) ph -= 1;
      return (2 * ph - 1) * Math.exp(-tt / 0.08) * Math.min(1, tt / 0.002) * 0.8;
    }
    const M = (1 << 15) - 1, buf = new Float32Array(M + 1);
    let w = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const taps = imgs, direct = taps.length ? taps[0].amp : 1;
        const norm = 0.45 / Math.max(0.05, direct);
        const list = taps.map((q) => { const a = (q.pan + 1) * Math.PI / 4; return { d: Math.min(M - 1, Math.round(q.t * sr)), gl: q.amp * Math.cos(a) * norm, gr: q.amp * Math.sin(a) * norm }; });
        for (let i = 0; i < n; i++) {
          buf[w] = source(sr);
          let sl = 0, sr2 = 0;
          for (let j = 0; j < list.length; j++) { const q = list[j], v = buf[(w - q.d) & M]; sl += v * q.gl; sr2 += v * q.gr; }
          l[i] = sl * 0.7; r[i] = sr2 * 0.7;
          w = (w + 1) & M;
        }
      },
    });

    // 방 그림 배치 (매 프레임 계산)
    function layout() {
      const W = ctx.width, H = ctx.height, pad = 10, top = H * 0.62 - pad;
      const vx0 = -P.roomW * 0.6, vx1 = P.roomW * 1.6, vy0 = -P.roomD * 0.6, vy1 = P.roomD * 1.6;
      const s = Math.min((W - pad * 2) / (vx1 - vx0), (top - pad) / (vy1 - vy0));
      const ox = pad + ((W - pad * 2) - (vx1 - vx0) * s) / 2 - vx0 * s, oy = pad + ((top - pad) - (vy1 - vy0) * s) / 2 - vy0 * s;
      return { s, ox, oy, top };
    }

    return {
      update() {
        const m = ctx.input.mouse;
        if (m.down && m.inside) {
          const lay = layout(), x = (m.x - lay.ox) / lay.s / P.roomW, y = (m.y - lay.oy) / lay.s / P.roomD;
          if (x > 0 && x < 1 && y > 0 && y < 1) { S.sx = U.clamp(x, 0.03, 0.97); S.sy = U.clamp(y, 0.03, 0.97); }
        }
        build();
        snd.update();
      },
      render() {
        build();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, lay = layout(), s = lay.s;
        const X = (x) => lay.ox + x * s, Y = (y) => lay.oy + y * s;
        const Lx = P.roomW, Ly = P.roomD, lx = S.lx * Lx, ly = S.ly * Ly;
        g.save(); g.beginPath(); g.rect(pad, pad, W - pad * 2, lay.top - pad); g.clip();
        // 거울 방 격자
        for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) D.rect(g, X(i * Lx), Y(j * Ly), Lx * s, Ly * s, null, 'rgba(255,255,255,0.07)', 1);
        D.rect(g, X(0), Y(0), Lx * s, Ly * s, 'rgba(255,255,255,0.04)', C.dim, 2);
        // 반사 경로 (접어서 방 안에 그림), 2차까지
        const fold = (v, Lw) => { const m2 = ((v % (2 * Lw)) + 2 * Lw) % (2 * Lw); return m2 < Lw ? m2 : 2 * Lw - m2; };
        for (const q of imgs) {
          if (q.ord === 0 || q.ord > 2) continue;
          const c2 = ORDER_COL[q.ord];
          g.beginPath();
          for (let i = 0; i <= 80; i++) { const t = i / 80, x = fold(lx + (q.x - lx) * t, Lx), y = fold(ly + (q.y - ly) * t, Ly); i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y)); }
          g.strokeStyle = c2; g.globalAlpha = 0.45; g.lineWidth = 1; g.stroke(); g.globalAlpha = 1;
        }
        for (const q of imgs) if (q.ord > 0) D.circle(g, X(q.x), Y(q.y), 2 + 6 * Math.sqrt(q.amp / Math.max(1e-6, imgs[0].amp)), ORDER_COL[q.ord]);
        D.line(g, X(lx), Y(ly), X(S.sx * Lx), Y(S.sy * Ly), C.text, 1.5);
        D.circle(g, X(S.sx * Lx), Y(S.sy * Ly), 7, col);
        D.rect(g, X(lx) - 6, Y(ly) - 6, 12, 12, C.accent);
        g.restore();
        D.text(g, Lg('색 = 반사 차수 (파랑 1차, 초록 2차, 노랑 3차, 보라 4차)', 'Color = order (blue 1st, green 2nd, yellow 3rd, purple 4th)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 아래: 반사음 도착 그래프 (에코그램)
        const ey = lay.top + 8, eh = H - ey - pad, ex = pad, ew = W - pad * 2;
        D.rect(g, ex, ey, ew, eh, 'rgba(0,0,0,0.35)');
        const tmax = Math.max(0.06, Math.min(0.3, (Math.hypot(Lx, Ly) * 2.5) / CS));
        const tX = (t) => ex + 30 + (ew - 40) * t / tmax, dbY = (db) => ey + 16 + (eh - 30) * U.clamp(-db / 36, 0, 1);
        for (let db = 0; db >= -36; db -= 12) { D.line(g, ex + 30, dbY(db), ex + ew - 10, dbY(db), C.grid, 1); D.text(g, db + '', ex + 4, dbY(db) - 5, { size: 9, color: C.dim }); }
        const stepMs = tmax > 0.15 ? 50 : 20;
        for (let ms = 0; ms <= tmax * 1000; ms += stepMs) D.text(g, ms + 'ms', tX(ms / 1000), ey + eh - 12, { size: 9, color: C.dim });
        const ref = imgs.length ? imgs[0].amp : 1;
        for (const q of imgs) {
          if (q.t > tmax) continue;
          const db = A.linToDb(q.amp / ref);
          D.line(g, tX(q.t), dbY(-36), tX(q.t), dbY(db), ORDER_COL[q.ord], q.ord ? 2 : 3);
        }
        D.text(g, Lg('도착 시각과 레벨 (직접음 기준 dB)', 'Arrival time and level (dB vs direct)'), ex + 34, ey + 3, { size: 10, color: C.dim });
        const refl = imgs.filter((q) => q.ord > 0);
        let eRef = 0; for (const q of refl) eRef += (q.amp / ref) ** 2;
        ctx.stat(Lg('반사음 수', 'Reflections'), refl.length);
        ctx.stat(Lg('첫 반사 간격', 'First reflection gap'), refl.length ? `${((refl[0].t - imgs[0].t) * 1000).toFixed(1)} ms` : '-');
        ctx.stat(Lg('반사 에너지 / 직접음', 'Reflection energy / direct'), refl.length ? `${(10 * Math.log10(eRef)).toFixed(1)} dB` : '-');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
