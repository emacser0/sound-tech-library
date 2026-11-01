// 맥놀이: 주파수가 조금 다른 두 사인파를 더하면 음량이 |f1 - f2| 빠르기로 커졌다 작아짐
GTL.register({
  id: 'beats-interference',
  title: '맥놀이 (두 주파수의 간섭)',
  summary: '주파수가 조금 다른 두 사인파를 더하면 두 파가 같은 방향일 때와 반대 방향일 때가 번갈아 와서 음량이 출렁임. 출렁이는 빠르기는 두 주파수의 차이와 같음.',
  views: { a: '같은 주파수 (차이 0Hz)', b: '3Hz 차이' },
  controls: '파라미터 표에서 주파수 차이를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 합이 들림.',
  info: `
    <p>주파수가 f1, f2인 두 사인파를 더하면 두 파의 위상 차이가 1초에 |f1 - f2|번 한 바퀴 돔. 위상이 같을 때는 더해져 커지고(보강 간섭), 반대일 때는 지워져 작아짐(상쇄 간섭). 이 음량 출렁임이 <b>맥놀이(Beats)</b>.</p>
    <p>수식으로는 sin(2πf1t) + sin(2πf2t) = 2 cos(πΔf t) sin(2π f̄ t). 귀에는 평균 주파수 f̄의 음이 Δf 빠르기로 커졌다 작아지는 소리로 들림.</p>
    <ul>
      <li><b>조율</b>: 기타, 피아노 조율사는 맥놀이가 느려지다 멈출 때까지 줄을 조임</li>
      <li><b>코러스, 디튠</b>: 신스 오실레이터 두 개를 몇 센트 어긋나게 하면 맥놀이로 두꺼운 소리가 남</li>
      <li>차이가 약 15Hz를 넘으면 출렁임 대신 거친 느낌(Roughness)으로 들리고, 임계 대역을 넘으면 두 음으로 따로 들림</li>
    </ul>`,
  diagram: (L) => {
    const x0 = 20, w = 330, y = 100, a = 30;
    let d = '', e1 = '', e2 = '';
    for (let i = 0; i <= 600; i++) {
      const t = i / 600, px = (x0 + t * w).toFixed(1);
      const v = 0.5 * (Math.sin(2 * Math.PI * 30 * t) + Math.sin(2 * Math.PI * 32 * t));
      d += (i ? 'L' : 'M') + px + ',' + (y - a * v).toFixed(1);
      const env = Math.abs(Math.cos(Math.PI * 2 * t));
      e1 += (i ? 'L' : 'M') + px + ',' + (y - a * env).toFixed(1);
      e2 += (i ? 'L' : 'M') + px + ',' + (y + a * env).toFixed(1);
    }
    return `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <path d="${d}" class="d-dim"/>
    <path d="${e1}" class="d-b"/><path d="${e2}" class="d-b"/>
    <line x1="${x0}" y1="${y + a + 18}" x2="${x0 + w / 2}" y2="${y + a + 18}" class="d-accent" marker-start="url(#arr)" marker-end="url(#arr)"/>
    <text x="${x0 + w / 4}" y="${y + a + 34}" text-anchor="middle" class="t-small">${L('맥놀이 주기 = 1 / |f1 - f2|', 'Beat period = 1 / |f1 - f2|')}</text>
    <text x="${x0 + w / 4}" y="${y - a - 10}" text-anchor="middle" class="t-small t-b">${L('같은 방향: 커짐', 'In phase: louder')}</text>
    <text x="${x0 + w / 2}" y="${y - a - 26}" text-anchor="middle" class="t-small t-dim">${L('반대 방향: 지워짐', 'Opposite: cancel')}</text>
    <line x1="${x0 + w / 2}" y1="${y - a - 20}" x2="${x0 + w / 2}" y2="${y - 4}" class="d-dim" stroke-dasharray="2 2"/>
    <text x="370" y="60" class="t-small t-mono">sin(2πf1t) + sin(2πf2t)</text>
    <text x="370" y="80" class="t-small t-mono">= 2cos(πΔf t) sin(2πf̄ t)</text>
    <text x="370" y="104" class="t-small t-b">${L('파랑: 음량 (포락선)', 'blue: loudness (envelope)')}</text>
    <text x="370" y="122" class="t-small t-dim">${L('회색: 실제 파형 (평균 주파수)', 'gray: actual wave (mean frequency)')}</text>
  </svg>`;
  },
  look: [
    '"소리 켜기"를 누르고 B를 들으면 1초에 3번 "우웅우웅" 출렁이는 소리가 들림. A는 일정함.',
    'B의 주파수 차이를 0.5Hz로 내리면 출렁임이 느려지고, 0으로 맞추면 조율이 맞은 것처럼 멈춤',
    '주파수 차이를 20Hz 이상으로 올리면 출렁임이 거친 소리로 바뀌고 "들리는 느낌" 측정값이 바뀜',
    '두 번째 음 크기를 0.3으로 낮추면 포락선의 골이 얕아지고 "출렁임 깊이" 측정값이 작아짐',
  ],
  refs: [
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '진동의 중첩과 맥놀이' },
    { type: 'book', title: 'Juan G. Roederer, The Physics and Psychophysics of Music (4th ed.)', year: 2008, note: '맥놀이, 거칠기, 임계 대역' },
    { type: 'paper', title: 'R. Plomp, W. J. M. Levelt, "Tonal Consonance and Critical Bandwidth", JASA 38', year: 1965, note: '주파수 차이에 따른 거칠기 곡선' },
    { type: 'book', title: 'Hugo Fastl, Eberhard Zwicker, Psychoacoustics: Facts and Models (3rd ed.)', year: 2007, note: '임계 대역폭 근사식' },
  ],
  params: [
    { key: 'df', label: '주파수 차이 Δf (Hz)', type: 'range', min: 0, max: 40, step: 0.1, a: 0, b: 3, default: 3, group: '두 음' },
    { key: 'f1', label: '첫째 음 f1 (Hz)', type: 'range', min: 100, max: 1000, step: 1, default: 440, shared: true, group: '두 음' },
    { key: 'a2', label: '둘째 음 크기', type: 'range', min: 0, max: 1, step: 0.01, default: 1, shared: true, group: '두 음', help: '첫째 음 크기는 1' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Beats (Interference of Two Frequencies)',
    summary: 'Add two sine waves with slightly different frequencies. They line up and then oppose each other in turn, so the loudness swells and fades. The swell rate equals the difference of the two frequencies.',
    views: { a: 'Same frequency (0 Hz apart)', b: '3 Hz apart' },
    controls: 'Change the frequency difference in the parameter table. Press "Sound on" to hear the sum in the selected view.',
    info: `
    <p>When you add two sine waves at f1 and f2, their phase difference goes around the circle |f1 - f2| times per second. When the phases match, the waves add up (constructive interference). When they are opposite, they cancel (destructive interference). This loudness swell is called <b>beats</b>.</p>
    <p>As a formula: sin(2πf1t) + sin(2πf2t) = 2 cos(πΔf t) sin(2π f̄ t). You hear a tone at the mean frequency f̄ that swells at the rate Δf.</p>
    <ul>
      <li><b>Tuning</b>: guitar and piano tuners turn the peg until the beats slow down and stop.</li>
      <li><b>Chorus and detune</b>: two synth oscillators a few cents apart beat against each other and sound thicker.</li>
      <li>Above about 15 Hz the swell turns into a rough sound (roughness). Past the critical band you hear two separate tones.</li>
    </ul>`,
    look: [
      'Press "Sound on" and listen to B. The sound swells 3 times per second. A stays steady.',
      'Lower B\'s frequency difference to 0.5 Hz. The swell slows down. At 0 it stops, like a tuned string.',
      'Raise the difference above 20 Hz. The swell turns into a rough sound, and the "Perception" stat changes.',
      'Lower the second tone level to 0.3. The dips in the envelope get shallower and the "Swell depth" stat gets smaller.',
    ],
    refs: ['Superposition of vibrations and beats.', 'Beats, roughness and critical bands.', 'Roughness as a function of frequency difference.', 'Approximation formula for critical bandwidth.'],
    params: {
      df: { label: 'Frequency difference Δf (Hz)', group: 'Two tones' },
      f1: { label: 'First tone f1 (Hz)', group: 'Two tones' },
      a2: { label: 'Second tone level', group: 'Two tones', help: 'The first tone has level 1' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SPAN = 2;   // 포락선 보기 구간 (초)
    let t = 0;

    const live = { p1: 0, p2: 0, f2: P.f1 + P.df, a2: P.a2 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(20, sr);
        for (let i = 0; i < n; i++) {
          live.f2 += (P.f1 + P.df - live.f2) * k; live.a2 += (P.a2 - live.a2) * k;
          live.p1 += P.f1 / sr; if (live.p1 >= 1) live.p1 -= 1;
          live.p2 += live.f2 / sr; if (live.p2 >= 1) live.p2 -= 1;
          const v = (Math.sin(U.TAU * live.p1) + live.a2 * Math.sin(U.TAU * live.p2)) * 0.25;
          l[i] = v; r[i] = v;
        }
      },
    });

    // 포락선: |1 + a2 e^{j 2π Δf t}|
    const env = (tt) => Math.hypot(1 + P.a2 * Math.cos(U.TAU * P.df * tt), P.a2 * Math.sin(U.TAU * P.df * tt));
    const cbw = (f) => 25 + 75 * Math.pow(1 + 1.4 * Math.pow(f / 1000, 2), 0.69); // Zwicker 임계 대역폭 근사

    return {
      update(dt) { t += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const f1 = P.f1, f2 = P.f1 + P.df, a2 = P.a2;
        // 1) 확대: 현재 시각 근처 10ms의 두 사인파와 합
        const zh = Math.max(60, H * 0.3), zw = W - pad * 3 - zh;
        D.rect(g, pad, pad, zw, zh, 'rgba(0,0,0,0.35)');
        const zmid = pad + zh / 2, za = zh * 0.2;
        const ZW = 0.01;
        const draw = (fn, y0, color, lw, sc) => {
          g.beginPath();
          for (let i = 0; i <= 300; i++) { const tt = t + (i / 300) * ZW, px = pad + (i / 300) * zw, py = y0 - fn(tt) * sc; i ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = color; g.lineWidth = lw; g.stroke();
        };
        draw((tt) => Math.sin(U.TAU * f1 * tt), pad + zh * 0.22, 'rgba(255,255,255,0.5)', 1, za * 0.7);
        draw((tt) => a2 * Math.sin(U.TAU * f2 * tt), pad + zh * 0.22, C.accent, 1, za * 0.7);
        draw((tt) => Math.sin(U.TAU * f1 * tt) + a2 * Math.sin(U.TAU * f2 * tt), pad + zh * 0.68, col, 2, za * 0.6);
        D.text(g, Lx('확대 10ms: 흰색 f1, 보라 f2, 아래는 합', 'Zoom 10 ms: white f1, purple f2, below: sum'), pad + 4, pad + 3, { size: 10, color: C.dim });

        // 2) 페이저 합
        const pcx = pad * 2 + zw + zh / 2, pcy = pad + zh / 2, R = zh * 0.22;
        D.circle(g, pcx, pcy, R * 2, null, C.grid, 1);
        const rel = U.TAU * P.df * t;
        D.arrow(g, pcx, pcy, pcx + R, pcy, 'rgba(255,255,255,0.7)', 2);
        D.arrow(g, pcx + R, pcy, pcx + R + R * a2 * Math.cos(rel), pcy - R * a2 * Math.sin(rel), C.accent, 2);
        D.arrow(g, pcx, pcy, pcx + R + R * a2 * Math.cos(rel), pcy - R * a2 * Math.sin(rel), col, 2.5);
        D.text(g, Lx('페이저 합', 'Phasor sum'), pcx, pad + zh - 12, { size: 9, color: C.dim, align: 'center' });

        // 3) 포락선 2초
        const ey = pad * 2 + zh, eh = H - ey - pad - 4, emid = ey + eh / 2, ea = eh * 0.45 / 2;
        D.rect(g, pad, ey, W - pad * 2, eh, 'rgba(0,0,0,0.35)');
        D.line(g, pad, emid, W - pad, emid, C.grid, 1);
        const ew = W - pad * 2, t0 = Math.floor(t / SPAN) * SPAN;
        g.beginPath();
        const N = Math.floor(ew);
        for (let i = 0; i <= N; i++) { const px = pad + i, e = env(t0 + (i / N) * SPAN); i ? g.lineTo(px, emid - e * ea) : g.moveTo(px, emid - e * ea); }
        for (let i = N; i >= 0; i--) { const px = pad + i, e = env(t0 + (i / N) * SPAN); g.lineTo(px, emid + e * ea); }
        g.closePath(); g.fillStyle = ctx.side === 'a' ? 'rgba(255,122,89,0.25)' : 'rgba(79,195,247,0.25)'; g.fill();
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        const phx = pad + ((t - t0) / SPAN) * ew;
        D.line(g, phx, ey, phx, ey + eh, C.accent, 1.5);
        for (let s = 0; s <= SPAN; s += 0.5) { const x = pad + (s / SPAN) * ew; D.text(g, s.toFixed(1) + 's', Math.min(x, W - pad - 20), ey + eh - 11, { size: 9, color: C.dim }); }
        D.text(g, Lx('음량 포락선 (2초)', 'Loudness envelope (2 s)'), pad + 4, ey + 3, { size: 10, color: C.dim });

        const df = Math.abs(P.df), cb = cbw((f1 + f2) / 2);
        const depth = a2 >= 0.999 ? Infinity : 20 * Math.log10((1 + a2) / (1 - a2));
        let feel;
        if (df < 0.05) feel = Lx('일정한 음 하나', 'One steady tone');
        else if (df < 15) feel = Lx('출렁임 (맥놀이)', 'Swelling (beats)');
        else if (df < cb) feel = Lx('거칠게 들림', 'Rough');
        else feel = Lx('두 음으로 들림', 'Two tones');
        ctx.stat(Lx('맥놀이 빠르기', 'Beat rate'), df.toFixed(2) + ' Hz' + (df > 0.05 ? ` (${(1 / df).toFixed(2)} s)` : ''));
        ctx.stat(Lx('들리는 음 높이 (평균)', 'Heard pitch (mean)'), ((f1 + f2) / 2).toFixed(1) + ' Hz');
        ctx.stat(Lx('출렁임 깊이', 'Swell depth'), depth === Infinity ? '∞ dB' : depth.toFixed(1) + ' dB');
        ctx.stat(Lx('들리는 느낌', 'Perception'), feel + Lx(` (임계 대역 ${cb.toFixed(0)}Hz)`, ` (critical band ${cb.toFixed(0)} Hz)`));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
