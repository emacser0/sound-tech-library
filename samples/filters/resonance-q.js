// 공진과 Q: 같은 로우패스에서 Q만 바꿔 봉우리, 울림(링잉), 극점 위치를 비교
GTL.register({
  id: 'resonance-q',
  title: '공진과 Q',
  summary: 'Q를 올리면 컷오프 근처에 봉우리(공진)가 솟고, 필터가 그 주파수로 오래 울림. 극점이 단위원에 가까워질수록 봉우리는 높고 울림은 길어짐.',
  views: { a: 'Q 0.707 (버터워스)', b: 'Q 8 (강한 공진)' },
  controls: '컷오프 스윕을 켜면 컷오프가 천천히 오르내림. "소리 켜기"로 신스 필터 특유의 "와우" 소리를 들음.',
  info: `
    <p><b>Q(Quality factor)</b>는 공진의 날카로움. 로우패스에서 Q = 0.707이면 봉우리 없이 가장 평평한 버터워스(Butterworth) 응답이 됨. Q를 올리면 컷오프 바로 앞이 솟고, 컷오프 위는 더 가파르게 떨어짐.</p>
    <p>높은 Q는 시간 영역에서 <b>울림(Ringing)</b>으로 나타남. 클릭 하나를 넣으면 필터가 컷오프 주파수의 사인파처럼 한동안 진동. 감쇠 시간은 대략 <code>τ = 2Q / ω0</code>라 Q에 비례.</p>
    <ul>
      <li>z 평면에서 극점(Pole)이 단위원에 가까울수록 봉우리가 높고 울림이 김</li>
      <li>극점이 단위원 위에 오면 필터 혼자 계속 진동 (자기 발진)</li>
      <li>감산 신스는 높은 Q로 컷오프를 움직여 특유의 "와우" 소리를 만듦</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" class="t-small t-dim">${L('크기 응답', 'Magnitude')}</text>
    <line x1="20" y1="150" x2="250" y2="150" class="d-dim"/>
    <path d="M20,90 L140,90 Q170,90 190,110 L250,160" class="d-a"/>
    <path d="M20,90 L120,88 Q150,80 160,40 Q168,60 180,110 L250,170" class="d-b"/>
    <text x="160" y="34" text-anchor="middle" class="t-small t-b">${L('공진 봉우리', 'resonant peak')}</text>
    <text x="60" y="84" class="t-small t-a">Q 0.707</text>
    <text x="180" y="170" text-anchor="middle" class="t-small t-dim">${L('컷오프', 'cutoff')}</text>
    <text x="290" y="18" class="t-small t-dim">${L('클릭을 넣었을 때 출력 (임펄스 응답)', 'Output for one click (impulse response)')}</text>
    <line x1="290" y1="70" x2="530" y2="70" class="d-dim"/>
    <path d="M290,70 L296,40 L304,72 L312,70 L530,70" class="d-a"/>
    <line x1="290" y1="135" x2="530" y2="135" class="d-dim"/>
    <path d="M290,135 L296,100 L304,165 L312,108 L320,160 L328,113 L336,155 L344,118 L352,150 L360,122 L368,146 L376,126 L384,142 L392,129 L400,140 L408,131 L416,138 L424,133 L432,137 L440,134 L460,135" class="d-b"/>
    <text x="470" y="128" class="t-small t-b">${L('긴 울림', 'long ringing')}</text>
    <text x="350" y="62" class="t-small t-a">${L('바로 멈춤', 'stops quickly')}</text>
  </svg>`,
  look: [
    'A와 B의 크기 응답을 비교하면 B만 컷오프에서 약 +18dB 솟음 ("최대 게인" 측정값)',
    '임펄스 응답 그래프에서 B는 수십 번 진동한 뒤에야 멈춤. A는 거의 바로 멈춤.',
    'Q를 올리면 극점 그래프의 점이 바깥 원(단위원)에 다가감. 울림 시간 측정값이 같이 늘어남.',
    '"소리 켜기"와 컷오프 스윕을 켜고 B를 들으면 공진이 배음을 하나씩 훑는 "와우" 소리가 남',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '극점 반지름, 공진 대역폭, 감쇠 시간의 관계' },
    { type: 'article', title: 'Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients"', url: 'https://www.w3.org/TR/audio-eq-cookbook/', note: 'Q를 쓰는 로우패스 계수' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '감산 합성과 공진 필터' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '공진 필터 설계와 Q' },
  ],
  params: [
    { key: 'q', label: 'Q', type: 'range', min: 0.5, max: 30, step: 0.1, a: 0.707, b: 8, group: '필터', help: '0.707 = 봉우리 없는 버터워스' },
    { key: 'freq', label: '컷오프 (Hz)', type: 'range', min: 80, max: 8000, step: 10, default: 800, shared: true },
    { key: 'sweep', label: '컷오프 스윕', type: 'bool', default: true, shared: true, help: '소리에서 컷오프를 0.25Hz로 2옥타브 오르내림' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Resonance and Q',
    summary: 'Raising Q makes a peak (resonance) near the cutoff, and the filter rings at that frequency for a long time. The closer the poles get to the unit circle, the higher the peak and the longer the ringing.',
    views: { a: 'Q 0.707 (Butterworth)', b: 'Q 8 (strong resonance)' },
    controls: 'Turn on the cutoff sweep to move the cutoff slowly up and down. Press "Sound on" to hear the typical synth filter "wah".',
    info: `
    <p><b>Q (quality factor)</b> is how sharp the resonance is. For a lowpass, Q = 0.707 gives the flattest response with no peak (Butterworth). A higher Q raises the area just below the cutoff and makes the drop above it steeper.</p>
    <p>In time, a high Q shows up as <b>ringing</b>. Put in one click and the filter keeps vibrating like a sine at the cutoff for a while. The decay time is about <code>τ = 2Q / ω0</code>, so it grows with Q.</p>
    <ul>
      <li>In the z plane, poles closer to the unit circle mean a higher peak and longer ringing.</li>
      <li>Poles on the unit circle make the filter oscillate by itself (self oscillation).</li>
      <li>Subtractive synths move a high Q cutoff to make the typical "wah" sound.</li>
    </ul>`,
    look: [
      'Compare the curves. Only B rises about +18 dB at the cutoff (the "Max gain" stat).',
      'In the impulse response, B swings dozens of times before it stops. A stops almost at once.',
      'Raise Q. The dots in the pole plot move toward the outer (unit) circle, and the ringing time stat grows with them.',
      'Turn on "Sound on" and the cutoff sweep, then listen to B. The resonance sweeps through the harmonics one by one with a "wah" sound.',
    ],
    refs: ['How pole radius, resonance bandwidth and decay time relate.', 'Lowpass coefficients that use Q.', 'Subtractive synthesis and resonant filters.', 'Resonant filter design and Q.'],
    params: {
      q: { label: 'Q', group: 'Filter', help: '0.707 = Butterworth, no peak' },
      freq: 'Cutoff (Hz)',
      sweep: { label: 'Cutoff sweep', help: 'In the sound, the cutoff moves 2 octaves up and down at 0.25 Hz' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, IRN = 2400; // 50ms

    // 실시간: 톱니파 프레이즈 + 로우패스. 스윕 위치를 화면에도 표시
    const live = { ph: 0, t: 0, lfo: 0, f: P.freq, q: P.q, flt: A.biquad('lowpass', P.freq, P.q, 0, SR), cur: P.freq };
    const notes = [33, 33, 45, 33, 36, 33, 43, 31];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(20, sr / 32);
        for (let i = 0; i < n; i++) {
          if ((i & 31) === 0) {
            live.f += (P.freq - live.f) * k; live.q += (P.q - live.q) * k;
            live.cur = P.sweep ? live.f * Math.pow(2, 2 * Math.sin(live.lfo) - 1) : live.f;
            const c = A.biquad('lowpass', live.cur, live.q, 0, sr), fl = live.flt;
            fl.b0 = c.b0; fl.b1 = c.b1; fl.b2 = c.b2; fl.a1 = c.a1; fl.a2 = c.a2;
          }
          live.lfo += U.TAU * 0.25 / sr;
          const pos = live.t * 6, step = Math.floor(pos), local = pos - step;
          const f = A.mtof(notes[step % notes.length]), dt = f / sr;
          const x = (2 * live.ph - 1 - A.polyBlep(live.ph, dt)) * Math.min(1, local * 100) * (1 - 0.6 * local);
          live.ph += dt; if (live.ph >= 1) live.ph -= 1; live.t += 1 / sr;
          // 높은 Q의 봉우리만큼 줄여서 출력 레벨을 맞춤
          const y = live.flt.process(x) * 0.35 / Math.max(1, Math.sqrt(live.q));
          l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', coef = null, ir = null, peakDb = 0, peakF = 0, ringMs = 0, poles = null;
    function analyze() {
      const k = P.q + ',' + P.freq;
      if (k === key) return;
      key = k;
      coef = A.biquad('lowpass', P.freq, P.q, 0, SR);
      ir = new Float32Array(IRN);
      for (let i = 0; i < IRN; i++) ir[i] = coef.process(i === 0 ? 1 : 0);
      coef.reset();
      let mx = 0; for (let i = 0; i < IRN; i++) mx = Math.max(mx, Math.abs(ir[i]));
      // 울림 시간: 마지막으로 최대값의 -40dB(1%)를 넘은 시점
      let last = 0; for (let i = 0; i < IRN; i++) if (Math.abs(ir[i]) > mx * 0.01) last = i;
      ringMs = last / SR * 1000;
      peakDb = -200;
      for (let i = 0; i <= 400; i++) { const f = 20 * Math.pow(1000, i / 400), d = coef.response(f).db; if (d > peakDb) { peakDb = d; peakF = f; } }
      const disc = coef.a1 * coef.a1 - 4 * coef.a2;
      if (disc < 0) { const re = -coef.a1 / 2, im = Math.sqrt(-disc) / 2; poles = [[re, im], [re, -im]]; }
      else { const s = Math.sqrt(disc); poles = [[(-coef.a1 + s) / 2, 0], [(-coef.a1 - s) / 2, 0]]; }
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const rh = Math.max(60, (H - pad * 3) * 0.55), rw = W - pad * 2;
        A.drawResponse(g, (f) => coef.response(f).db, pad, pad, rw, rh, { color: col, minDb: -36, maxDb: 30, label: L('로우패스 크기 응답', 'Lowpass magnitude') });
        D.line(g, pad, pad + rh * (30 / 66), pad + rw, pad + rh * (30 / 66), 'rgba(255,255,255,0.25)', 1);
        if (snd.on) {
          const fx = A.freqX(live.cur, pad, rw, 20, 20000);
          D.line(g, fx, pad, fx, pad + rh, C.warn, 1);
          D.text(g, L('현재 컷오프', 'Current cutoff'), fx + 3, pad + 16, { size: 10, color: C.warn });
        }
        // 임펄스 응답
        const by = pad * 2 + rh, bh = H - by - pad, pw = Math.min(bh, rw * 0.3), iw = rw - pw - pad;
        const amp = 0.9 / Math.max(1e-6, U.clamp(A.peak(ir), 0.05, 10));
        A.drawWave(g, ir, pad, by, iw, bh, { color: col, amp, label: L('임펄스 응답 (50ms)', 'Impulse response (50 ms)') });
        // 극점 그래프 (z 평면)
        const cx = pad + iw + pad + pw / 2, cy = by + bh / 2, rad = pw / 2 - 12;
        D.rect(g, pad + iw + pad, by, pw, bh, 'rgba(0,0,0,0.35)');
        D.circle(g, cx, cy, rad, null, C.dim, 1);
        D.line(g, cx - rad - 4, cy, cx + rad + 4, cy, C.grid, 1); D.line(g, cx, cy - rad - 4, cx, cy + rad + 4, C.grid, 1);
        for (const [re, im] of poles) {
          const px = cx + re * rad, py = cy - im * rad;
          D.line(g, px - 4, py - 4, px + 4, py + 4, col, 2); D.line(g, px - 4, py + 4, px + 4, py - 4, col, 2);
        }
        D.circle(g, cx - rad, cy, 3, C.dim); // 영점 (z = -1, 이중)
        D.text(g, L('극점 (z 평면)', 'Poles (z plane)'), pad + iw + pad + 4, by + 3, { size: 10, color: C.dim });
        const pr = Math.hypot(poles[0][0], poles[0][1]);
        ctx.stat(L('최대 게인', 'Max gain'), `${peakDb.toFixed(1)} dB @ ${Math.round(peakF)} Hz`);
        ctx.stat(L('울림 시간 (-40dB)', 'Ringing time (-40 dB)'), ringMs >= (IRN - 2) / SR * 1000 ? '> 50 ms' : ringMs.toFixed(1) + ' ms');
        ctx.stat(L('극점 반지름', 'Pole radius'), pr.toFixed(4));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
