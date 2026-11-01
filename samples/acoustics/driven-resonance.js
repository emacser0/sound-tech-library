// 강제 진동과 공진: 질량-스프링-감쇠기를 주기적으로 밀 때 Q에 따른 응답 크기, 위상, 울림
GTL.register({
  id: 'driven-resonance',
  title: '강제 진동과 공진 (질량-스프링)',
  summary: '물체는 저마다 잘 흔들리는 고유 주파수를 가짐. 그 주파수로 밀면 작은 힘으로도 크게 흔들림(공진). 감쇠가 작을수록(Q가 높을수록) 봉우리가 높고 좁으며, 밀기를 멈춰도 오래 울림.',
  views: { a: 'Q = 1 (감쇠 큼)', b: 'Q = 15 (감쇠 작음)' },
  controls: '파라미터 표에서 Q, 미는 주파수 비율, 미는 방식을 바꿈. "소리 켜기"를 누르면 같은 진동계를 오디오 주파수로 옮긴 소리가 들림. 지속음은 공진 봉우리 높이로 정규화함.',
  info: `
    <p>질량 m이 스프링(강성 k)에 매달려 있으면 고유 주파수 f0 = (1/2π)√(k/m)로 흔들림. 기타 몸통, 스피커 콘, 방, 종, 건물도 모두 이런 진동계의 묶음.</p>
    <p>바깥에서 주파수 f로 계속 밀면(강제 진동) 처음에는 들쭉날쭉하다가 곧 f로 일정하게 흔들림. 흔들림의 크기는 f/f0 비율에 따라 크게 달라짐.</p>
    <ul>
      <li><b>f ≪ f0</b>: 스프링이 힘을 그대로 따라감. 크기 1, 위상 0도.</li>
      <li><b>f = f0</b>: 공진. 크기가 Q배, 위상은 힘보다 90도 늦음.</li>
      <li><b>f ≫ f0</b>: 질량이 따라오지 못함. 크기가 1/r²로 줄고 위상은 180도 가까이 늦음.</li>
    </ul>
    <p><b>Q(Quality Factor)</b>는 감쇠의 반대 개념. 봉우리의 -3dB 폭은 f0/Q. 한 번 치면 진폭이 1/e로 줄어드는 시간은 Q/(πf0). Q가 높으면 고르는 힘(선택도)이 좋지만 길게 울려 소리가 번짐.</p>`,
  diagram: (L) => {
    const x0 = 250, w = 270, y0 = 20, h = 130;
    const xr = (r) => x0 + (Math.log(r / 0.25) / Math.log(16)) * w;
    const yDb = (db) => y0 + (24 - Math.max(-24, Math.min(24, db))) / 48 * h;
    const path = (Q) => { let d = ''; for (let i = 0; i <= 120; i++) { const r = 0.25 * Math.pow(16, i / 120); const db = -10 * Math.log10((1 - r * r) ** 2 + (r / Q) ** 2); d += (i ? 'L' : 'M') + xr(r).toFixed(1) + ',' + yDb(db).toFixed(1); } return d; };
    return `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="16" width="70" height="8" class="f-dim"/>
    <path d="M75,24 L75,34 L60,40 L90,48 L60,56 L90,64 L60,72 L90,80 L75,86 L75,96" class="d-line"/>
    <rect x="55" y="96" width="40" height="30" class="f-a"/>
    <text x="75" y="116" text-anchor="middle" class="t-small">m</text>
    <text x="100" y="62" class="t-small">${L('스프링 k', 'spring k')}</text>
    <text x="100" y="142" class="t-small">${L('감쇠 c', 'damping c')}</text>
    <path d="M140,110 L170,110" class="d-accent"/><text x="174" y="114" class="t-small">${L('미는 힘 F sin(2πft)', 'force F sin(2πft)')}</text>
    <line x1="${x0}" y1="${yDb(0)}" x2="${x0 + w}" y2="${yDb(0)}" class="d-dim"/>
    <line x1="${xr(1)}" y1="${y0}" x2="${xr(1)}" y2="${y0 + h}" class="d-dim" stroke-dasharray="3 3"/>
    <path d="${path(1)}" class="d-a"/><path d="${path(15)}" class="d-b"/>
    <text x="${xr(1) + 6}" y="${y0 + 12}" class="t-small t-b">${L('Q = 15: 높고 좁은 봉우리', 'Q = 15: tall, narrow peak')}</text>
    <text x="${xr(0.3)}" y="${yDb(0) - 8}" class="t-small t-a">Q = 1</text>
    <text x="${xr(1)}" y="${y0 + h + 16}" text-anchor="middle" class="t-small">f = f0</text>
    <text x="${x0 + w}" y="${y0 + h + 16}" text-anchor="end" class="t-small t-dim">f / f0 (log)</text>
  </svg>`;
  },
  look: [
    '미는 주파수 비율 1.0에서 A의 질량은 조금, B의 질량은 크게 흔들림. 응답 곡선의 봉우리 높이가 Q배.',
    '비율을 0.7로 바꾸면 B의 흔들림이 크게 줄어듦. B는 좁은 범위의 주파수에만 반응함.',
    '미는 방식을 "한 번씩 치기"로 바꾸면 A는 금방 멈추고 B는 오래 울림. 소리로 들으면 B는 "띵" 하는 음 높이가 들림.',
    '비율을 2 이상으로 올리면 질량이 힘과 반대 방향으로 움직임(위상 180도 근처)',
  ],
  refs: [
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '1장: 감쇠 진동자, 강제 진동, Q' },
    { type: 'book', title: 'Thomas D. Rossing, F. Richard Moore, Paul A. Wheeler, The Science of Sound (3rd ed.)', year: 2002, note: '공진과 공명체' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '질량-스프링 진동계와 2차 공진 필터의 대응' },
  ],
  params: [
    { key: 'Q', label: 'Q (감쇠의 역수)', type: 'range', min: 0.5, max: 50, step: 0.1, a: 1, b: 15, default: 15, group: '진동계' },
    { key: 'ratio', label: '미는 주파수 / 고유 주파수', type: 'range', min: 0.2, max: 4, step: 0.01, default: 1, shared: true, group: '미는 힘' },
    { key: 'drive', label: '미는 방식', type: 'select', options: [{ value: 'sine', label: '계속 밀기 (사인파)' }, { value: 'pulse', label: '한 번씩 치기 (임펄스)' }, { value: 'sweep', label: '주파수 훑기 (0.3~3배)' }], default: 'sine', shared: true, group: '미는 힘' },
    { key: 'f0', label: '소리의 고유 주파수 (Hz)', type: 'range', min: 80, max: 1000, step: 1, default: 220, shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Driven Oscillation and Resonance (Mass and Spring)',
    summary: 'Every object has a natural frequency it likes to swing at. Push it at that frequency and even a small force makes it swing hard (resonance). With less damping (higher Q), the peak is taller and narrower, and it keeps ringing after you stop pushing.',
    views: { a: 'Q = 1 (high damping)', b: 'Q = 15 (low damping)' },
    controls: 'Change Q, the drive frequency ratio and the drive type in the parameter table. Press "Sound on" to hear the same system moved to audio frequencies. Steady tones are normalized to the resonance peak height.',
    info: `
    <p>A mass m on a spring (stiffness k) swings at its natural frequency f0 = (1/2π)√(k/m). Guitar bodies, speaker cones, rooms, bells and buildings are all sets of such systems.</p>
    <p>If you keep pushing at frequency f (driven oscillation), the motion is uneven at first and then settles to a steady swing at f. The size of the swing depends strongly on the ratio f/f0.</p>
    <ul>
      <li><b>f ≪ f0</b>: the spring follows the force. Size 1, phase 0 degrees.</li>
      <li><b>f = f0</b>: resonance. The size is Q times larger, and the motion lags the force by 90 degrees.</li>
      <li><b>f ≫ f0</b>: the mass cannot keep up. The size falls as 1/r², and the lag nears 180 degrees.</li>
    </ul>
    <p><b>Q (quality factor)</b> is the opposite of damping. The -3 dB width of the peak is f0/Q. After one hit, the amplitude falls to 1/e in Q/(πf0) seconds. High Q picks frequencies sharply, but it rings long and smears the sound.</p>`,
    look: [
      'At a drive ratio of 1.0, A\'s mass moves a little and B\'s mass swings hard. The response peak is Q times higher.',
      'Change the ratio to 0.7. B\'s swing drops a lot. B reacts only to a narrow range of frequencies.',
      'Set the drive to "Single hits". A stops quickly and B keeps ringing. In sound, B has a clear "ting" pitch.',
      'Raise the ratio above 2. The mass moves against the force (phase near 180 degrees).',
    ],
    refs: ['Chapter 1: damped oscillators, driven oscillation and Q.', 'Resonance and resonators.', 'Mass-spring systems and their match to 2nd order resonant filters.'],
    params: {
      Q: { label: 'Q (inverse of damping)', group: 'System' },
      ratio: { label: 'Drive frequency / natural frequency', group: 'Driving force' },
      drive: { label: 'Drive type', group: 'Driving force', options: { sine: 'Steady push (sine)', pulse: 'Single hits (impulse)', sweep: 'Frequency sweep (0.3 to 3x)' } },
      f0: { label: 'Natural frequency for sound (Hz)', group: 'Sound' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const FV = 0.6;          // 화면용 고유 주파수 (슬로모션)
    const HIST = 480;
    const hist = new Float32Array(HIST), force = new Float32Array(HIST);
    let hi = 0, t = 0, accum = 0;
    const sim = { x: 0, v: 0, ph: 0 };

    const gainDb = (r, Q) => -10 * Math.log10((1 - r * r) ** 2 + (r / Q) ** 2);
    const phaseDeg = (r, Q) => (-Math.atan2(r / Q, 1 - r * r) * 180) / Math.PI;
    const peakGain = (Q) => (Q > 0.7072 ? Q / Math.sqrt(1 - 1 / (4 * Q * Q)) : 1);
    const ratioNow = (tt) => (P.drive === 'sweep' ? 0.3 * Math.pow(10, (tt / 12) % 1) : P.ratio);

    // 화면 시뮬레이션: x'' + (w0/Q) x' + w0² x = w0² F
    function step(dt) {
      const w0 = U.TAU * FV, sub = 8, h = dt / sub;
      for (let s = 0; s < sub; s++) {
        t += h;
        const r = ratioNow(t);
        let F = 0;
        if (P.drive === 'pulse') {
          const prev = Math.floor((t - h) / 4), cur = Math.floor(t / 4);
          if (cur !== prev) sim.v += w0 * 0.8; // 4초마다 한 번 침
        } else { sim.ph += r * FV * h; F = Math.sin(U.TAU * sim.ph); }
        const a = w0 * w0 * (F - sim.x) - (w0 / P.Q) * sim.v;
        sim.v += a * h; sim.x += sim.v * h;
        if (!isFinite(sim.x)) { sim.x = 0; sim.v = 0; }
      }
    }

    // 소리: 같은 2차 공진계 (RBJ 로우패스와 같은 꼴)
    let bq = A.biquad('lowpass', P.f0, P.Q, 0, 48000), bqKey = '';
    const live = { ph: 0, time: 0, next: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = P.f0 + ':' + P.Q + ':' + sr;
        if (k !== bqKey) { const o = bq; bq = A.biquad('lowpass', P.f0, P.Q, 0, sr); bq.x1 = o.x1; bq.x2 = o.x2; bq.y1 = o.y1; bq.y2 = o.y2; bqKey = k; }
        const norm = P.drive === 'pulse' ? 0.45 : 0.4 / peakGain(P.Q);
        for (let i = 0; i < n; i++) {
          live.time += 1 / sr;
          let x = 0;
          if (P.drive === 'pulse') {
            if (live.time >= live.next) { x = sr / (U.TAU * P.f0); live.next = live.time + 0.6; }
          } else {
            live.ph += ratioNow(live.time) * P.f0 / sr; if (live.ph >= 1) live.ph -= 1;
            x = Math.sin(U.TAU * live.ph);
          }
          let y = bq.process(x);
          if (!isFinite(y)) { bq.reset(); y = 0; }
          const v = y * norm; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) {
        step(dt);
        accum += dt;
        while (accum > 1 / 60) { accum -= 1 / 60; hist[hi] = sim.x; force[hi] = P.drive === 'pulse' ? 0 : Math.sin(U.TAU * sim.ph); hi = (hi + 1) % HIST; }
        snd.update();
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const topH = Math.max(80, H * 0.48);
        // 질량-스프링
        const mx = pad + 40, ceil = pad + 14, restY = pad + topH * 0.5;
        const scale = topH * 0.06;
        const my = restY + U.clamp(sim.x, -8, 8) * scale;
        D.rect(g, mx - 30, ceil - 6, 60, 6, '#666');
        g.beginPath(); g.moveTo(mx, ceil);
        const coils = 10;
        for (let i = 1; i <= coils; i++) g.lineTo(mx + (i % 2 ? -12 : 12), ceil + (my - 18 - ceil) * i / (coils + 1));
        g.lineTo(mx, my - 18); g.strokeStyle = C.text; g.lineWidth = 1.5; g.stroke();
        D.rect(g, mx - 18, my - 18, 36, 36, col);
        D.line(g, mx - 30, restY, mx + 30, restY, C.grid, 1);
        D.text(g, Lx('질량 (슬로모션)', 'Mass (slow motion)'), mx, pad + topH - 12, { size: 9, color: C.dim, align: 'center' });
        // 변위 기록
        const hx = mx + 50, hw = W - hx - pad, hy = pad, hh = topH;
        D.rect(g, hx, hy, hw, hh, 'rgba(0,0,0,0.35)');
        const hm = hy + hh / 2;
        D.line(g, hx, hm, hx + hw, hm, C.grid, 1);
        const plot = (arr, color, sc, lw) => {
          g.beginPath();
          for (let i = 0; i < HIST; i++) { const v = arr[(hi + i) % HIST], x = hx + (i / (HIST - 1)) * hw, y = hm + U.clamp(v * sc, -hh / 2, hh / 2); i ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.strokeStyle = color; g.lineWidth = lw; g.stroke();
        };
        plot(force, 'rgba(199,146,234,0.6)', scale, 1);
        plot(hist, col, scale, 2);
        D.text(g, Lx('변위 (색) vs 미는 힘 (보라), 최근 8초', 'Displacement (color) vs force (purple), last 8 s'), hx + 4, hy + 3, { size: 10, color: C.dim });

        // 응답 곡선
        const ry = pad * 2 + topH, rh = H - ry - pad, rx = pad, rw = W - pad * 2;
        D.rect(g, rx, ry, rw, rh, 'rgba(0,0,0,0.35)');
        const xr = (r) => rx + (Math.log(r / 0.2) / Math.log(25)) * rw;
        const yDb = (db) => ry + 14 + (36 - U.clamp(db, -30, 36)) / 66 * (rh - 28);
        const yPh = (ph) => ry + 14 + (-ph / 180) * (rh - 28);
        for (const r of [0.25, 0.5, 1, 2, 4]) { D.line(g, xr(r), ry + 12, xr(r), ry + rh - 12, C.grid, 1); D.text(g, r + '×', xr(r) + 2, ry + rh - 12, { size: 9, color: C.dim }); }
        for (const db of [-24, -12, 0, 12, 24, 36]) { D.line(g, rx, yDb(db), rx + rw, yDb(db), C.grid, 1); D.text(g, db + 'dB', rx + 2, yDb(db) - 10, { size: 9, color: C.dim }); }
        const curve = (fn, color, lw) => { g.beginPath(); for (let i = 0; i <= 200; i++) { const r = 0.2 * Math.pow(25, i / 200), y = fn(r); i ? g.lineTo(xr(r), y) : g.moveTo(xr(r), y); } g.strokeStyle = color; g.lineWidth = lw; g.stroke(); };
        curve((r) => yPh(phaseDeg(r, P.Q)), 'rgba(199,146,234,0.55)', 1);
        curve((r) => yDb(gainDb(r, P.Q)), col, 2.5);
        const rNow = ratioNow(t);
        D.circle(g, xr(rNow), yDb(gainDb(rNow, P.Q)), 5, C.warn);
        D.text(g, Lx('응답 크기 (색), 위상 지연 0~180도 (보라). 노란 점 = 지금 미는 주파수', 'Response size (color), phase lag 0 to 180° (purple). Yellow dot = current drive'), rx + 4, ry + 3, { size: 10, color: C.dim });

        const f0 = P.f0;
        ctx.stat(Lx('미는 주파수 비율', 'Drive ratio'), rNow.toFixed(2) + '×');
        ctx.stat(Lx('응답 크기', 'Response size'), gainDb(rNow, P.Q).toFixed(1) + ' dB');
        ctx.stat(Lx('위상 지연', 'Phase lag'), (-phaseDeg(rNow, P.Q)).toFixed(0) + '°');
        ctx.stat(Lx('봉우리 폭 (소리 기준)', 'Peak width (for sound)'), (f0 / P.Q).toFixed(1) + ' Hz');
        ctx.stat(Lx('울림 시간 (-60dB)', 'Ring time (-60 dB)'), (6.91 * P.Q / (Math.PI * f0) * 1000).toFixed(0) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
