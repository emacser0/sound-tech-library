// 도플러 효과: 음 높이만 바꾸기 vs 물리 지연선(지연된 시각 계산)
GTL.register({
  id: 'doppler-moving-source',
  title: '도플러 효과 (지나가는 음원)',
  summary: '지나가는 차의 경적은 다가올 때 높고 멀어질 때 낮음. A는 지금 속도로 음 높이만 바꿔서, 차가 바로 앞을 지나는 순간 음이 떨어짐. B는 거리만큼 늦게 읽는 지연선이라 소리가 도착하는 시각에 맞춰 늦게 떨어지고 크기와 타이밍도 맞음.',
  views: { a: '음 높이만 (지연 없음)', b: '가변 지연선 (물리 모델)' },
  controls: '파라미터 표에서 속도, 최단 거리, 음 높이를 바꿈. 음원은 왼쪽에서 오른쪽으로 반복해서 지나감.',
  info: `
    <p><b>도플러 효과(Doppler Effect)</b>: 음원이 다가오면 파면 간격이 좁아져 높게, 멀어지면 넓어져 낮게 들림. 정지한 청취자가 듣는 주파수는 <code>f' = f c / (c - v_r)</code>. v_r는 청취자 쪽으로 다가오는 속도 성분.</p>
    <ul>
      <li><b>음 높이만 바꾸기</b>: 위 식에 현재 속도를 넣어 오실레이터나 재생 속도를 바꿈. 게임 엔진의 기본 도플러 방식과 같음. 싸고 단순하지만 소리가 이동하는 시간을 무시함.</li>
      <li><b>가변 지연선</b>: 음원 신호를 버퍼에 쓰고, 지금 들리는 소리가 출발한 시각 τ를 <code>t - τ = r(τ)/c</code>로 구해 그 위치를 읽음. 지연이 줄어들면 빨리 읽어서 높아지고, 늘어나면 낮아짐. 음 높이, 도착 시각, 거리 감쇠가 모두 한 번에 맞음.</li>
    </ul>
    <p>차이가 커지는 경우: 빠른 음원(비행기, 총알), 먼 거리. 100m 거리면 소리가 0.3초 늦게 도착하므로 A는 차가 앞을 지나는 그림과 음 변화가 맞지만 실제와는 다름.</p>
    <p>단점: 지연선 방식은 보간 품질에 따라 고음에서 잡음이 생기고, 음원이 음속에 가까우면 버퍼가 길어짐. 지연이 갑자기 바뀌면(텔레포트) 크게 튐.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <circle cx="150" cy="80" r="70" class="d-dim"/><circle cx="170" cy="80" r="50" class="d-dim"/><circle cx="190" cy="80" r="30" class="d-dim"/><circle cx="210" cy="80" r="10" class="d-dim"/>
    <circle cx="214" cy="80" r="5" class="f-b"/>
    <path d="M224,80 L262,80" class="d-accent" marker-end="url(#arr)"/>
    <text x="244" y="72" text-anchor="middle" class="t-small">v</text>
    <text x="270" y="60" class="t-small">${L('앞쪽: 파면이 촘촘함 (높은 음)', 'front: wavefronts close (higher)')}</text>
    <text x="10" y="164" class="t-small">${L('뒤쪽: 파면이 성김 (낮은 음)', 'back: wavefronts far apart (lower)')}</text>
    <text x="300" y="104" class="t-small t-b">${L('B: 들리는 소리는 τ에 출발한 소리', 'B: what you hear left at time τ')}</text>
    <text x="300" y="122" class="t-small t-b">${L('t - τ = r(τ) / c', 't - τ = r(τ) / c')}</text>
    <text x="300" y="146" class="t-small t-a">${L('A: 지금 위치의 속도만 사용', 'A: uses only the current velocity')}</text>
  </svg>`,
  look: [
    '속도를 80m/s로 올리고 그래프를 보면 B의 음 높이 곡선이 A보다 오른쪽(나중)으로 밀려 있음',
    'B 뷰에서 흐린 점(소리가 출발한 위치)이 실제 음원보다 뒤처져 있음. 음원이 멀수록 더 많이 뒤처짐.',
    '최단 거리를 50m로 늘리면 두 곡선의 시간 차이가 커지고, 음 변화도 더 완만해짐',
    '속도를 10m/s로 낮추면 두 뷰의 차이가 거의 사라짐 (사람 걸음이나 느린 차)',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing, Doppler Simulation (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '가변 지연선으로 도플러를 만드는 방법' },
    { type: 'article', title: 'Christian Doppler, "Über das farbige Licht der Doppelsterne und einiger anderer Gestirne des Himmels"', year: 1842, note: '도플러 효과의 원 논문' },
    { type: 'article', title: 'W3C, Web Audio API Specification (PannerNode, AudioListener)', url: 'https://www.w3.org/TR/webaudio/', note: '초기 명세의 dopplerFactor, setVelocity가 빠져서 도플러는 직접 구현해야 함' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects (2nd Edition), Wiley', year: 2011, note: '분수 지연선과 보간' },
  ],
  params: [
    { key: 'model', label: '방식', type: 'select', options: [{ value: 'pitch', label: '음 높이만 (지연 없음)' }, { value: 'delay', label: '가변 지연선' }], a: 'pitch', b: 'delay', group: '도플러' },
    { key: 'speed', label: '속도 (m/s)', type: 'range', min: 5, max: 150, step: 1, default: 50, shared: true, group: '장면', help: '30 m/s = 108 km/h' },
    { key: 'dmin', label: '최단 거리 (m)', type: 'range', min: 2, max: 60, step: 1, default: 15, shared: true },
    { key: 'freq', label: '음 높이 (Hz)', type: 'range', min: 110, max: 880, step: 1, default: 440, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Doppler Effect (Passing Source)',
    summary: 'A passing car horn sounds higher as it comes closer and lower as it moves away. A changes only the pitch from the current speed, so the pitch drops the moment the car passes in front. B is a delay line that reads later by the travel distance, so the drop comes later, when the sound actually arrives, and level and timing also match.',
    views: { a: 'Pitch only (no delay)', b: 'Variable delay line (physical)' },
    controls: 'Change speed, closest distance and pitch in the parameter table. The source passes from left to right again and again.',
    info: `
    <p><b>Doppler effect</b>: when a source comes closer, the wavefronts bunch up and it sounds higher. When it moves away, they spread out and it sounds lower. A listener standing still hears <code>f' = f c / (c - v_r)</code>, where v_r is the part of the velocity toward the listener.</p>
    <ul>
      <li><b>Pitch only</b>: put the current velocity into the formula above and change the oscillator or playback rate. This is how game engines usually do Doppler. Cheap and simple, but it ignores the time the sound takes to travel.</li>
      <li><b>Variable delay line</b>: write the source signal into a buffer. Find the time τ when the sound you hear now left the source from <code>t - τ = r(τ)/c</code>, and read that position. When the delay shrinks you read faster and it sounds higher, when it grows it sounds lower. Pitch, arrival time and distance loss all come out right at once.</li>
    </ul>
    <p>The difference grows with fast sources (planes, bullets) and long distances. At 100 m the sound arrives 0.3 s late, so A matches the picture of the car passing, but not reality.</p>
    <p>Downsides: a delay line adds noise at high frequencies depending on the interpolation quality, and it needs a long buffer if the source gets close to the speed of sound. Sudden delay changes (teleporting) cause big jumps.</p>`,
    look: [
      'Raise the speed to 80 m/s and look at the graph. B\'s pitch curve is shifted to the right (later) compared with A.',
      'In B the faded dot (where the sound left from) trails behind the real source. The farther the source, the more it trails.',
      'Increase the closest distance to 50 m. The time gap between the curves grows and the pitch change gets smoother.',
      'Lower the speed to 10 m/s. The two views look almost the same (walking person or a slow car).',
    ],
    refs: ['How to build Doppler with a variable delay line.', 'The original Doppler paper.', 'dopplerFactor and setVelocity were removed from the early spec, so you build Doppler yourself.', 'Fractional delay lines and interpolation.'],
    params: {
      model: { label: 'Method', group: 'Doppler', options: { pitch: 'Pitch only (no delay)', delay: 'Variable delay line' } },
      speed: { label: 'Speed (m/s)', group: 'Scene', help: '30 m/s = 108 km/h' },
      dmin: 'Closest distance (m)',
      freq: 'Pitch (Hz)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b, CS = 343;
    const half = () => U.clamp(P.speed * 4, 60, 250);      // 지나가는 경로의 절반 길이 (m)
    const period = () => 2 * half() / P.speed;
    const posX = (t) => { const T = period(); return P.speed * (((t % T) + T) % T - T / 2); };
    const dist = (t) => Math.hypot(posX(t), P.dmin);
    const vRad = (t) => -P.speed * posX(t) / dist(t);    // 다가오면 +
    const env = (t) => { const T = period(), u = ((t % T) + T) % T; return Math.min(1, u / 0.6, (T - u) / 0.6); };
    // 지금 들리는 소리가 출발한 시각 τ
    const emitTime = (t) => { let tau = t - dist(t) / CS; for (let k = 0; k < 4; k++) tau = t - dist(tau) / CS; return tau; };
    const recvFreq = (t) => (P.model === 'delay' ? P.freq * CS / (CS - vRad(emitTime(t))) : P.freq * CS / (CS - vRad(t)));

    let simT = 0;   // 화면과 소리가 같이 쓰는 시각
    // 소리
    const M = (1 << 16) - 1, buf = new Float32Array(M + 1);
    let w = 0, tS = 0, q1 = 0, q2 = 0, ph1 = 0, ph2 = 0, lp = 0, lpA = 0, started = false;
    const horn = (p1, p2) => (2 * p1 - 1) + (2 * p2 - 1) * 0.8;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!started) { tS = simT; started = true; }
        const a = A.onePoleCoef(2500, sr);
        for (let i = 0; i < n; i++) {
          const t = tS; tS += 1 / sr;
          // 음원 신호 (출발 시각 기준으로 버퍼에 씀), 크기 엔벨로프 포함
          ph1 += P.freq / sr; if (ph1 >= 1) ph1 -= 1;
          ph2 += P.freq * 1.26 / sr; if (ph2 >= 1) ph2 -= 1;
          lp += a * (horn(ph1, ph2) * env(t) - lp);
          buf[w] = lp;
          let y;
          if (P.model === 'delay') {
            const tau = emitTime(t), d = Math.min(M - 2, (t - tau) * sr);
            const p = w - d, i0 = Math.floor(p), fr = p - i0;
            y = (buf[i0 & M] * (1 - fr) + buf[(i0 + 1) & M] * fr) * P.dmin / dist(tau);
          } else {
            const f = P.freq * CS / (CS - vRad(t));
            q1 += f / sr; if (q1 >= 1) q1 -= 1;
            q2 += f * 1.26 / sr; if (q2 >= 1) q2 -= 1;
            lpA += a * (horn(q1, q2) * env(t) - lpA);
            y = lpA * P.dmin / dist(t);
          }
          w = (w + 1) & M;
          l[i] = y * 0.3; r[i] = y * 0.3;
        }
      },
      onStop() { started = false; },
    });

    // 음 높이 곡선 (파라미터가 바뀔 때만)
    let ck = '', curve = null;
    function curves() {
      const k = [P.speed, P.dmin, P.freq, P.model].join(',');
      if (k !== ck) {
        ck = k; curve = [];
        const T = period();
        for (let i = 0; i <= 300; i++) {
          const t = T * i / 300;
          const fa = P.freq * CS / (CS - vRad(t)), fb = P.freq * CS / (CS - vRad(emitTime(t)));
          curve.push({ t, fa, fb });
        }
      }
      return curve;
    }

    return {
      update(dt) {
        simT = snd.on ? tS : simT + dt;
        snd.update();
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, t = simT, T = period(), X = half();
        // 위: 위에서 본 도로
        const topH = Math.max(110, H * 0.5), sc = (W - pad * 2) / (2 * X + 20), cx = W / 2, ly = pad + topH - 22;
        const yRoad = ly - Math.min(topH - 40, P.dmin * sc);
        const Xp = (x) => cx + x * sc;
        D.rect(g, pad, pad, W - pad * 2, topH, 'rgba(0,0,0,0.35)');
        D.line(g, pad, yRoad, W - pad, yRoad, C.dim, 1);
        // 파면 (과거에 출발한 소리)
        g.save(); g.beginPath(); g.rect(pad, pad, W - pad * 2, topH); g.clip();
        const dtw = Math.max(0.02, X / CS / 6);
        for (let k = 1; k <= 14; k++) {
          const te = t - k * dtw;
          if (env(te) <= 0.01) continue;
          D.circle(g, Xp(posX(te)), yRoad, CS * k * dtw * sc, null, 'rgba(255,255,255,0.12)', 1);
        }
        g.restore();
        const sx = Xp(posX(t));
        if (P.model === 'delay') {
          const tau = emitTime(t), ex = Xp(posX(tau));
          D.circle(g, ex, yRoad, 6, null, col, 1.5);
          D.line(g, ex, yRoad, cx, ly, col, 1);
          D.text(g, Lg('소리가 출발한 위치', 'where the sound left'), ex, yRoad + 10, { size: 9, color: col, align: 'center' });
        } else D.line(g, sx, yRoad, cx, ly, col, 1);
        D.rect(g, sx - 9, yRoad - 5, 18, 10, col);
        D.arrow(g, sx + 10, yRoad, sx + 26, yRoad, col, 1.5, 5);
        D.circle(g, cx, ly, 8, '#2a2f38', C.dim, 1.5);
        D.text(g, Lg('청취자', 'Listener'), cx + 12, ly - 5, { size: 10, color: C.dim });
        D.text(g, Lg('위에서 본 도로 (흐린 원 = 파면)', 'Road from above (faint circles = wavefronts)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 아래: 들리는 주파수 vs 시간
        const gy = pad + topH + 8, gh = H - gy - pad;
        if (gh > 40) {
          const cv = curves(), gw = W - pad * 2;
          const fmax = P.freq * CS / (CS - P.speed), fmin = P.freq * CS / (CS + P.speed);
          const tX = (tt) => pad + gw * tt / T, fY = (f) => gy + 14 + (gh - 28) * (1 - (Math.log(f) - Math.log(fmin)) / Math.max(1e-6, Math.log(fmax) - Math.log(fmin)));
          D.rect(g, pad, gy, gw, gh, 'rgba(0,0,0,0.35)');
          D.line(g, pad, fY(P.freq), pad + gw, fY(P.freq), C.grid, 1);
          D.text(g, `${P.freq} Hz`, pad + 2, fY(P.freq) - 11, { size: 9, color: C.dim });
          D.line(g, tX(T / 2), gy, tX(T / 2), gy + gh, C.grid, 1);
          D.text(g, Lg('바로 앞을 지남', 'passes in front'), tX(T / 2) + 3, gy + gh - 12, { size: 9, color: C.dim });
          const line = (key, c2, lw, dash) => { g.beginPath(); cv.forEach((p, i) => (i ? g.lineTo(tX(p.t), fY(p[key])) : g.moveTo(tX(p.t), fY(p[key])))); g.strokeStyle = c2; g.lineWidth = lw; g.setLineDash(dash); g.stroke(); g.setLineDash([]); };
          const mine = P.model === 'delay' ? 'fb' : 'fa', other = mine === 'fa' ? 'fb' : 'fa';
          line(other, C.dim, 1, [4, 3]);
          line(mine, col, 2, []);
          const u = ((t % T) + T) % T;
          D.line(g, tX(u), gy, tX(u), gy + gh, C.text, 1);
          D.text(g, Lg('들리는 주파수 (점선 = 다른 방식)', 'Heard frequency (dashed = other method)'), pad + 4, gy + 3, { size: 10, color: C.dim });
        }
        const f = recvFreq(t);
        ctx.stat(Lg('들리는 주파수', 'Heard frequency'), `${f.toFixed(1)} Hz (${A.cents(P.freq, f) >= 0 ? '+' : ''}${A.cents(P.freq, f).toFixed(0)} cent)`);
        ctx.stat(Lg('다가오는 속도', 'Approach speed'), `${vRad(t).toFixed(1)} m/s`);
        ctx.stat(Lg('거리', 'Distance'), `${dist(t).toFixed(1)} m`);
        ctx.stat(Lg('전파 지연', 'Travel delay'), P.model === 'delay' ? `${((t - emitTime(t)) * 1000).toFixed(0)} ms` : Lg('0 (무시)', '0 (ignored)'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
