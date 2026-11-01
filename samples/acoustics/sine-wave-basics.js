// 사인파의 세 요소: 주파수, 진폭, 위상. 회전하는 페이저를 세로로 투영해 사인파를 그림 (single)
GTL.register({
  id: 'sine-wave-basics',
  title: '사인파의 세 요소 (주파수, 진폭, 위상)',
  summary: '모든 소리의 기본 단위인 사인파를 주파수, 진폭, 위상 세 값으로 조절. 회전하는 화살표(페이저)를 세로로 투영하면 사인파가 그려지는 과정을 봄.',
  single: true,
  controls: '파라미터 표에서 주파수, 진폭, 위상을 바꿈. "소리 켜기"를 누르면 사인파가 들림.',
  info: `
    <p><b>사인파(Sine Wave)</b>는 주파수 하나만 가진 가장 단순한 소리. 소리굽쇠, 휘파람에 가까운 맑은 음. 푸리에 이론에 따르면 모든 주기적인 소리는 사인파 여러 개의 합으로 나타낼 수 있음.</p>
    <ul>
      <li><b>주파수(Frequency)</b>: 1초에 반복하는 횟수(Hz). 귀에는 음 높이로 들림. 주기 T = 1/f.</li>
      <li><b>진폭(Amplitude)</b>: 흔들림의 크기. 귀에는 음량으로 들림. 데시벨로는 20 log10(A).</li>
      <li><b>위상(Phase)</b>: 파형이 한 주기 안의 어디에서 시작하는지(0~360도). 사인파 하나만 들을 때는 위상 차이를 듣지 못함.</li>
    </ul>
    <p>사인파는 원 위를 일정한 속도로 도는 점의 높이와 같음. 이 회전하는 화살표를 <b>페이저(Phasor)</b>라고 부름. 회전 속도가 주파수, 길이가 진폭, 시작 각도가 위상.</p>
    <p>위상은 다른 신호와 더할 때 중요해짐. 같은 주파수라도 위상이 반대면 서로 지워짐("위상 상쇄" 샘플 참고).</p>`,
  diagram: (L) => {
    const cx = 80, cy = 90, r = 50, x0 = 170, per = 170;
    let d = '';
    for (let i = 0; i <= 120; i++) { const x = x0 + (i / 120) * per * 2, y = cy - r * Math.sin(Math.PI / 4 + (i / 120) * 4 * Math.PI); d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
    const tx = cx + r * Math.cos(Math.PI / 4), ty = cy - r * Math.sin(Math.PI / 4);
    return `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" class="d-dim"/>
    <line x1="${cx - r - 8}" y1="${cy}" x2="${x0 + per * 2}" y2="${cy}" class="d-dim"/>
    <line x1="${cx}" y1="${cy}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" class="d-b" marker-end="url(#arr)"/>
    <path d="M${cx + 18},${cy} A18,18 0 0 0 ${(cx + 18 * Math.cos(Math.PI / 4)).toFixed(1)},${(cy - 18 * Math.sin(Math.PI / 4)).toFixed(1)}" class="d-accent"/>
    <text x="${cx + 22}" y="${cy - 4}" class="t-small">φ</text>
    <line x1="${tx.toFixed(1)}" y1="${ty.toFixed(1)}" x2="${x0}" y2="${ty.toFixed(1)}" class="d-dim" stroke-dasharray="3 3"/>
    <path d="${d}" class="d-b"/>
    <line x1="${x0 + per * 0.25 - per / 8}" y1="${cy - r}" x2="${x0 + per * 0.25 - per / 8}" y2="${cy}" class="d-accent" marker-end="url(#arr)"/>
    <text x="${x0 + per * 0.25 - per / 8 + 6}" y="${cy - r + 10}" class="t-small">${L('진폭 A (음량)', 'Amplitude A (loudness)')}</text>
    <line x1="${x0 + per * 0.125}" y1="${cy + r + 14}" x2="${x0 + per * 1.125}" y2="${cy + r + 14}" class="d-accent" marker-start="url(#arr)" marker-end="url(#arr)"/>
    <text x="${x0 + per * 0.625}" y="${cy + r + 30}" text-anchor="middle" class="t-small">${L('주기 T = 1/f (음 높이)', 'Period T = 1/f (pitch)')}</text>
    <text x="${cx}" y="16" text-anchor="middle" class="t-small t-dim">${L('페이저 (회전)', 'Phasor (rotating)')}</text>
    <text x="${x0 + per}" y="16" text-anchor="middle" class="t-small t-dim">${L('높이를 시간 축에 펼친 사인파', 'Height spread over time = sine wave')}</text>
  </svg>`;
  },
  look: [
    '주파수를 올리면 같은 20ms 구간에 더 많은 주기가 들어가고 소리가 높아짐',
    '진폭을 0.5로 내리면 파형 높이가 절반이 되고 측정값이 약 -6dB로 바뀜',
    '소리를 켠 채 위상을 바꾸면 파형은 옆으로 밀리지만 소리는 그대로 들림',
    '주파수를 100Hz로 맞추면 파장 측정값이 약 3.4m가 됨. 저음은 방 크기와 비슷한 길이.',
  ],
  refs: [
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '1장: 진동계와 단순 조화 운동' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '사인파, 주파수, 진폭, 위상의 기초' },
    { type: 'book', title: 'Julius O. Smith III, Mathematics of the Discrete Fourier Transform (DFT)', url: 'https://ccrma.stanford.edu/~jos/mdft/', note: '사인파와 페이저(복소 지수) 설명' },
  ],
  params: [
    { key: 'freq', label: '주파수 (Hz)', type: 'range', min: 20, max: 2000, step: 1, default: 220, group: '사인파' },
    { key: 'amp', label: '진폭', type: 'range', min: 0, max: 1, step: 0.01, default: 0.8, group: '사인파' },
    { key: 'phase', label: '위상 (도)', type: 'range', min: 0, max: 360, step: 1, default: 0, group: '사인파' },
    { key: 'showRef', label: '기준 파형 표시', type: 'bool', default: true, help: '주파수는 같고 진폭 1, 위상 0인 파형을 흐리게 그림', group: '표시' },
    ...GTL.audio.params({ single: true }),
  ],
  en: {
    title: 'Three Parts of a Sine Wave (Frequency, Amplitude, Phase)',
    summary: 'The sine wave is the basic unit of every sound. You control it with three values: frequency, amplitude and phase. Watch a rotating arrow (phasor) draw the sine wave as it is projected onto the vertical axis.',
    controls: 'Change frequency, amplitude and phase in the parameter table. Press "Sound on" to hear the sine wave.',
    info: `
    <p>A <b>sine wave</b> is the simplest sound. It has only one frequency. It sounds pure, close to a tuning fork or a whistle. Fourier theory says every periodic sound is a sum of sine waves.</p>
    <ul>
      <li><b>Frequency</b>: how many times per second the wave repeats (Hz). You hear it as pitch. Period T = 1/f.</li>
      <li><b>Amplitude</b>: how large the swing is. You hear it as loudness. In decibels it is 20 log10(A).</li>
      <li><b>Phase</b>: where in the cycle the wave starts (0 to 360 degrees). With a single sine wave you cannot hear phase.</li>
    </ul>
    <p>A sine wave is the height of a point that moves around a circle at constant speed. This rotating arrow is called a <b>phasor</b>. Its speed is the frequency, its length is the amplitude, and its start angle is the phase.</p>
    <p>Phase matters when you add the wave to another signal. Two waves with the same frequency and opposite phase cancel out (see the "Phase cancellation" sample).</p>`,
    look: [
      'Raise the frequency. More cycles fit in the same 20 ms window, and the sound gets higher.',
      'Lower the amplitude to 0.5. The wave becomes half as tall, and the stat shows about -6 dB.',
      'Turn on the sound and change the phase. The wave slides sideways, but the sound stays the same.',
      'Set the frequency to 100 Hz. The wavelength stat shows about 3.4 m. Bass waves are as long as a room.',
    ],
    refs: ['Chapter 1: vibrating systems and simple harmonic motion.', 'Basics of sine waves, frequency, amplitude and phase.', 'Sine waves and phasors (complex exponentials).'],
    params: {
      freq: { label: 'Frequency (Hz)', group: 'Sine wave' },
      amp: { label: 'Amplitude', group: 'Sine wave' },
      phase: { label: 'Phase (degrees)', group: 'Sine wave' },
      showRef: { label: 'Show reference wave', help: 'Draws a faint wave with the same frequency, amplitude 1 and phase 0', group: 'Display' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const WIN = 0.02;      // 보기 구간 20ms
    const SWEEP = 4;       // 커서가 구간을 지나는 시간(초). 슬로모션
    let t = 0;

    const live = { ph: 0, f: P.freq, a: P.amp };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(30, sr);
        for (let i = 0; i < n; i++) {
          live.f += (P.freq - live.f) * k; live.a += (P.amp - live.a) * k;
          live.ph += live.f / sr; if (live.ph >= 1) live.ph -= 1;
          const v = Math.sin(U.TAU * live.ph + P.phase * Math.PI / 180) * live.a * 0.5;
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) { t += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height;
        const f = P.freq, amp = P.amp, phi = P.phase * Math.PI / 180;
        const pad = 12, R = Math.max(30, Math.min(H * 0.3, W * 0.16));
        const cx = pad + R + 8, cy = pad + 22 + R;
        const wx = cx + R + 30, ww = W - wx - pad, wy = cy - R, wh = R * 2;
        const tc = ((t % SWEEP) / SWEEP) * WIN;
        const ang = U.TAU * f * tc + phi;

        // 페이저
        D.text(g, Lx('페이저', 'Phasor'), cx, pad, { size: 11, color: C.dim, align: 'center' });
        D.circle(g, cx, cy, R, null, C.grid, 1);
        D.circle(g, cx, cy, R * amp, null, 'rgba(79,195,247,0.25)', 1);
        D.line(g, cx - R - 6, cy, cx + R + 6, cy, C.grid, 1);
        D.line(g, cx, cy - R - 6, cx, cy + R + 6, C.grid, 1);
        const px = cx + Math.cos(ang) * R * amp, py = cy - Math.sin(ang) * R * amp;
        // 시작 위상 표시
        D.line(g, cx, cy, cx + Math.cos(phi) * R, cy - Math.sin(phi) * R, C.accent, 1);
        D.arrow(g, cx, cy, px, py, C.b, 2.5);
        D.circle(g, px, py, 4, C.b);

        // 파형
        D.rect(g, wx, wy, ww, wh, 'rgba(0,0,0,0.35)'); D.line(g, wx, cy, wx + ww, cy, C.grid, 1);
        const N = Math.max(200, Math.floor(ww * 1.5));
        if (P.showRef) {
          g.beginPath();
          for (let i = 0; i <= N; i++) { const tt = (i / N) * WIN, x = wx + (i / N) * ww, y = cy - Math.sin(U.TAU * f * tt) * R; i ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 1; g.stroke();
        }
        g.beginPath();
        for (let i = 0; i <= N; i++) { const tt = (i / N) * WIN, x = wx + (i / N) * ww, y = cy - Math.sin(U.TAU * f * tt + phi) * R * amp; i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.strokeStyle = C.b; g.lineWidth = 2; g.stroke();
        const cxp = wx + (tc / WIN) * ww, cyp = cy - Math.sin(ang) * R * amp;
        D.line(g, px, py, cxp, cyp, 'rgba(255,255,255,0.35)', 1);
        D.line(g, cxp, wy, cxp, wy + wh, 'rgba(199,146,234,0.5)', 1);
        D.circle(g, cxp, cyp, 4, C.accent);
        // 시간 눈금 (ms)
        for (let ms = 0; ms <= 20; ms += 5) { const x = wx + (ms / 20) * ww; D.line(g, x, wy + wh, x, wy + wh + 4, C.dim, 1); D.text(g, ms + 'ms', x, wy + wh + 6, { size: 9, color: C.dim, align: 'center' }); }
        D.text(g, Lx('파형 (20ms 구간, 슬로모션 커서)', 'Waveform (20 ms window, slow-motion cursor)'), wx + 4, wy + 3, { size: 10, color: C.dim });
        // 한 주기 표시
        const T = 1 / f;
        if (T < WIN) {
          const x0 = wx, x1 = wx + (T / WIN) * ww, yb = wy + wh + 22;
          D.line(g, x0, yb, x1, yb, C.accent, 2);
          D.text(g, Lx('주기 T', 'Period T') + ` = ${(T * 1000).toFixed(2)}ms`, x1 + 6, yb - 6, { size: 10, color: C.accent });
        }

        // 아래쪽: 요약 막대 (dB)
        const by = Math.min(H - 40, wy + wh + 44);
        const db = A.linToDb(amp);
        D.text(g, Lx('진폭', 'Amplitude') + ` ${amp.toFixed(2)} = ${amp > 0 ? db.toFixed(1) : '-∞'} dBFS`, pad, by, { size: 11, color: C.text });
        D.rect(g, pad, by + 16, W - pad * 2, 8, 'rgba(0,0,0,0.4)');
        D.rect(g, pad, by + 16, (W - pad * 2) * U.clamp((db + 48) / 48, 0, 1), 8, C.b);

        ctx.stat(Lx('주파수', 'Frequency'), `${f.toFixed(0)} Hz (${A.noteName(A.ftom(f))}, ${A.cents(A.mtof(Math.round(A.ftom(f))), f).toFixed(0)}c)`);
        ctx.stat(Lx('주기', 'Period'), (T * 1000).toFixed(2) + ' ms');
        ctx.stat(Lx('공기 중 파장 (343m/s)', 'Wavelength in air (343 m/s)'), (343 / f >= 1 ? (343 / f).toFixed(2) + ' m' : (34300 / f).toFixed(1) + ' cm'));
        ctx.stat(Lx('위상 오프셋', 'Phase offset'), `${P.phase.toFixed(0)}° = ${((P.phase / 360) * T * 1000).toFixed(2)} ms`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
