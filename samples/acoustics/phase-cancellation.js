// 위상 상쇄: 같은 신호 두 개를 위상차, 극성 반전, 시간 지연을 두고 더할 때의 레벨 변화
GTL.register({
  id: 'phase-cancellation',
  title: '위상 상쇄와 극성',
  summary: '같은 소리 두 개를 더할 때 위상이 같으면 +6dB, 180도 어긋나면 소리가 사라짐. 극성 반전과 시간 지연은 비슷해 보여도 배음마다 결과가 다름.',
  views: { a: '위상차 0도', b: '위상차 180도' },
  controls: '파라미터 표에서 위상차, 극성, 어긋나게 하는 방식을 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 합이 들림.',
  info: `
    <p>같은 주파수의 사인파 두 개를 더하면 결과도 같은 주파수의 사인파. 크기는 두 파의 위상차 φ에 따라 2|cos(φ/2)|배가 됨. 위상이 같으면 2배(+6dB), 180도 어긋나면 0(완전 상쇄).</p>
    <ul>
      <li><b>극성 반전(Polarity Inversion)</b>: 신호에 -1을 곱함. 모든 주파수가 180도 뒤집혀서, 같은 신호와 더하면 모든 배음이 사라짐.</li>
      <li><b>위상 이동(Phase Shift)</b>: 모든 배음을 같은 각도만큼 돌림. 올패스 필터나 힐베르트 변환으로 만듦.</li>
      <li><b>시간 지연(Delay)</b>: 시간을 τ만큼 늦춤. 배음 k의 위상은 k배로 돌아감. 기본음 반 주기만큼 늦추면 홀수 배음은 지워지고 짝수 배음은 오히려 커짐.</li>
    </ul>
    <p>실제 녹음에서 흔한 경우: 스네어 위와 아래 마이크(극성이 반대), 킥 안과 밖 마이크(시간 차이), 스테레오 신호를 모노로 합칠 때. "극성"과 "위상"을 섞어 부르지만 시간 지연과는 결과가 다름.</p>`,
  diagram: (L) => {
    const cx = 90, cy = 95, r = 45;
    const ph = (deg) => ({ x: cx + r * Math.cos(deg * Math.PI / 180), y: cy - r * Math.sin(deg * Math.PI / 180) });
    const p2 = { x: cx + r + r * Math.cos(120 * Math.PI / 180), y: cy - r * Math.sin(120 * Math.PI / 180) };
    return `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="${cx}" y="18" text-anchor="middle" class="t-small t-dim">${L('위상차 φ인 두 페이저의 합', 'Sum of two phasors with phase difference φ')}</text>
    <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" class="d-line" marker-end="url(#arr)"/>
    <line x1="${cx + r}" y1="${cy}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" class="d-accent" marker-end="url(#arr)"/>
    <line x1="${cx}" y1="${cy}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" class="d-b" marker-end="url(#arr)"/>
    <text x="${cx + r + 6}" y="${cy + 14}" class="t-small">φ</text>
    <text x="${cx - 10}" y="${cy + 30}" class="t-small t-b">${L('합의 크기 = 2|cos(φ/2)|', 'sum size = 2|cos(φ/2)|')}</text>
    <text x="230" y="40" class="t-small">${L('극성 반전 (-1 곱하기)', 'Polarity flip (multiply by -1)')}</text>
    <text x="230" y="58" class="t-small t-dim">${L('배음 1, 2, 3, 4 모두 180도', 'harmonics 1, 2, 3, 4 all 180°')}</text>
    <text x="230" y="76" class="t-small t-a">${L('같은 신호와 더하면: 전부 사라짐', 'added to the original: all cancel')}</text>
    <text x="230" y="112" class="t-small">${L('반 주기 시간 지연 (T/2)', 'Half-period delay (T/2)')}</text>
    <text x="230" y="130" class="t-small t-dim">${L('배음 k의 위상 = k × 180도', 'phase of harmonic k = k × 180°')}</text>
    <text x="230" y="148" class="t-small t-b">${L('홀수 배음은 사라지고 짝수 배음은 +6dB', 'odd harmonics cancel, even harmonics +6 dB')}</text>
  </svg>`;
  },
  look: [
    '"소리 켜기"를 누르고 B를 들으면 아무 소리도 나지 않음. A는 한 신호보다 6dB 큼.',
    'B의 위상차를 180에서 120으로 줄이면 합의 크기가 원래 신호 하나와 같아짐 (0dB)',
    '음원을 "배음 있는 음"으로 바꾸고 방식을 "시간 지연"으로 바꾸면 B에서 홀수 배음만 사라지고 한 옥타브 높게 들림',
    'A에서 "극성 반전"만 켜면 위상차 180도와 같은 결과. 방식을 "시간 지연"으로 바꿔도 극성 반전은 모든 배음을 지움.',
  ],
  refs: [
    { type: 'book', title: 'Bobby Owsinski, The Recording Engineer\'s Handbook', note: '멀티 마이크의 위상과 극성 문제' },
    { type: 'book', title: 'F. Alton Everest, Ken C. Pohlmann, Master Handbook of Acoustics', note: '파의 중첩, 보강 간섭과 상쇄 간섭' },
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '시간 지연의 선형 위상과 올패스 필터의 위상 이동' },
  ],
  params: [
    { key: 'phase', label: '위상차 (도)', type: 'range', min: 0, max: 360, step: 1, a: 0, b: 180, default: 180, group: '두 번째 신호' },
    { key: 'invert', label: '극성 반전', type: 'bool', default: false, group: '두 번째 신호', help: '두 번째 신호에 -1을 곱함' },
    { key: 'mode', label: '어긋나게 하는 방식', type: 'select', options: [{ value: 'phase', label: '위상 이동 (모든 배음 같은 각도)' }, { value: 'delay', label: '시간 지연 (배음마다 다른 각도)' }], default: 'phase', shared: true, group: '두 번째 신호' },
    { key: 'g2', label: '두 번째 신호 크기', type: 'range', min: 0, max: 1, step: 0.01, default: 1, shared: true, group: '두 번째 신호' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'sine', label: '사인파' }, { value: 'tone', label: '배음 있는 음 (배음 8개)' }], default: 'sine', shared: true, group: '음원' },
    { key: 'freq', label: '기본 주파수 (Hz)', type: 'range', min: 50, max: 1000, step: 1, default: 220, shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Phase Cancellation and Polarity',
    summary: 'Add two copies of the same sound. In phase they are 6 dB louder. 180 degrees apart they disappear. Polarity flip and time delay look alike, but they act differently on each harmonic.',
    views: { a: '0° phase difference', b: '180° phase difference' },
    controls: 'Change the phase difference, polarity and shift method in the parameter table. Press "Sound on" to hear the sum in the selected view.',
    info: `
    <p>Adding two sine waves of the same frequency gives another sine wave of that frequency. Its size is 2|cos(φ/2)| times one wave, where φ is the phase difference. In phase it is 2x (+6 dB). At 180 degrees it is 0 (full cancellation).</p>
    <ul>
      <li><b>Polarity inversion</b>: multiply the signal by -1. Every frequency flips by 180 degrees, so adding it to the original removes every harmonic.</li>
      <li><b>Phase shift</b>: rotate every harmonic by the same angle. Made with an allpass filter or a Hilbert transform.</li>
      <li><b>Time delay</b>: shift the signal later by τ. Harmonic k rotates k times as far. A delay of half the fundamental period cancels the odd harmonics and boosts the even ones.</li>
    </ul>
    <p>Common cases in recording: top and bottom snare mics (opposite polarity), inside and outside kick mics (time difference), and folding a stereo mix to mono. People often call polarity "phase", but a time delay gives a different result.</p>`,
    look: [
      'Press "Sound on" and listen to B. There is no sound at all. A is 6 dB louder than one signal.',
      'Lower B\'s phase difference from 180 to 120. The sum becomes as loud as one signal (0 dB).',
      'Set the source to "Tone with harmonics" and the method to "Time delay". In B only the odd harmonics vanish, and it sounds one octave higher.',
      'In A, turn on only "Polarity flip". It matches a 180° phase difference. Even in "Time delay" mode, the polarity flip removes every harmonic.',
    ],
    refs: ['Phase and polarity problems with multiple mics.', 'Superposition, constructive and destructive interference.', 'Linear phase of a time delay, and the phase shift of allpass filters.'],
    params: {
      phase: { label: 'Phase difference (degrees)', group: 'Second signal' },
      invert: { label: 'Polarity flip', group: 'Second signal', help: 'Multiplies the second signal by -1' },
      mode: { label: 'Shift method', group: 'Second signal', options: { phase: 'Phase shift (same angle for every harmonic)', delay: 'Time delay (different angle per harmonic)' } },
      g2: { label: 'Second signal level', group: 'Second signal' },
      src: { label: 'Source', group: 'Source', options: { sine: 'Sine', tone: 'Tone with harmonics (8)' } },
      freq: { label: 'Fundamental (Hz)', group: 'Source' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const K = 8;
    const harm = () => (P.src === 'tone' ? K : 1);
    const ak = (k) => 1 / k;
    // 배음 k에서 두 번째 신호의 위상 오프셋(rad)과 부호
    const offs = (k, phDeg) => (P.mode === 'delay' ? k : 1) * phDeg * Math.PI / 180;
    const sgn = () => (P.invert ? -1 : 1);
    // 배음 k의 합 크기 (첫 신호 대비 배율)
    const sumMag = (k) => Math.hypot(1 + sgn() * P.g2 * Math.cos(offs(k, P.phase)), sgn() * P.g2 * Math.sin(offs(k, P.phase)));

    const s1 = (x) => { let v = 0; for (let k = 1; k <= harm(); k++) v += ak(k) * Math.sin(k * x); return v; };
    const s2 = (x) => { let v = 0; for (let k = 1; k <= harm(); k++) v += ak(k) * Math.sin(k * x + offs(k, P.phase)); return sgn() * P.g2 * v; };
    const norm = () => (P.src === 'tone' ? 1 / 1.85 : 1);

    const live = { ph: 0, phase: P.phase, pol: sgn(), g2: P.g2 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const kk = A.onePoleCoef(15, sr), H = harm(), nm = norm();
        for (let i = 0; i < n; i++) {
          live.phase += (P.phase - live.phase) * kk; live.pol += (sgn() - live.pol) * kk; live.g2 += (P.g2 - live.g2) * kk;
          live.ph += P.freq / sr; if (live.ph >= 1) live.ph -= 1;
          const x = U.TAU * live.ph;
          let v = 0;
          for (let k = 1; k <= H; k++) {
            if (k * P.freq > sr * 0.45) break;
            const o = (P.mode === 'delay' ? k : 1) * live.phase * Math.PI / 180;
            v += ak(k) * (Math.sin(k * x) + live.pol * live.g2 * Math.sin(k * x + o));
          }
          v *= 0.22 * nm; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, nm = norm();
        const wh = Math.max(70, H * 0.5), ww = W - pad * 2;
        D.rect(g, pad, pad, ww, wh, 'rgba(0,0,0,0.35)');
        const rows = [pad + wh * 0.2, pad + wh * 0.42, pad + wh * 0.75];
        for (const y of rows) D.line(g, pad, y, pad + ww, y, C.grid, 1);
        const amp = wh * 0.09;
        const plot = (fn, y0, color, lw, sc) => {
          g.beginPath();
          const N = Math.floor(ww);
          for (let i = 0; i <= N; i++) { const x = (i / N) * 2 * U.TAU, py = y0 - fn(x) * sc * nm; i ? g.lineTo(pad + i, py) : g.moveTo(pad + i, py); }
          g.strokeStyle = color; g.lineWidth = lw; g.stroke();
        };
        plot(s1, rows[0], 'rgba(255,255,255,0.75)', 1.5, amp);
        plot(s2, rows[1], C.accent, 1.5, amp);
        plot((x) => s1(x) + s2(x), rows[2], col, 2.5, amp);
        D.text(g, Lx('신호 1', 'Signal 1'), pad + 4, rows[0] - amp - 12, { size: 10, color: C.dim });
        D.text(g, Lx('신호 2', 'Signal 2'), pad + 4, rows[1] - amp - 4, { size: 10, color: C.dim });
        D.text(g, Lx('합 (2주기)', 'Sum (2 cycles)'), pad + 4, rows[2] - amp * 2 - 6, { size: 10, color: C.dim });

        // 배음별 합 레벨
        const by = pad * 2 + wh, bh = H - by - pad, bw = W - pad * 2;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.35)');
        const Hn = harm(), cw = Math.min(60, bw / (Hn + 1));
        const dbTop = 6, dbBot = -40, yOf = (db) => by + 16 + (dbTop - U.clamp(db, dbBot, dbTop)) / (dbTop - dbBot) * (bh - 32);
        D.line(g, pad, yOf(0), pad + bw, yOf(0), 'rgba(255,255,255,0.25)', 1);
        D.text(g, '0dB', pad + bw - 30, yOf(0) - 11, { size: 9, color: C.dim });
        D.text(g, '+6dB', pad + bw - 34, yOf(6), { size: 9, color: C.dim });
        for (let k = 1; k <= Hn; k++) {
          const m = sumMag(k), db = A.linToDb(m), x = pad + 20 + (k - 1) * cw;
          const y = yOf(db);
          D.rect(g, x, Math.min(y, yOf(0)), cw * 0.6, Math.abs(yOf(0) - y), db < -20 ? C.bad : col);
          D.text(g, String(k), x + cw * 0.3, by + bh - 13, { size: 9, color: C.dim, align: 'center' });
        }
        D.text(g, Lx('배음별 합 크기 (신호 1 대비 dB)', 'Sum level per harmonic (dB vs signal 1)'), pad + 4, by + 3, { size: 10, color: C.dim });

        // 측정값: RMS 비율
        let e1 = 0, es = 0;
        for (let i = 0; i < 512; i++) { const x = (i / 512) * U.TAU, a = s1(x), b = a + s2(x); e1 += a * a; es += b * b; }
        const rel = es > 1e-12 ? 10 * Math.log10(es / e1) : -Infinity;
        ctx.stat(Lx('합의 레벨 (신호 1 대비)', 'Sum level (vs signal 1)'), rel === -Infinity || rel < -120 ? '-∞ dB' : (rel >= 0 ? '+' : '') + rel.toFixed(1) + ' dB');
        ctx.stat(Lx('기본음 위상차', 'Fundamental phase difference'), (((P.phase + (P.invert ? 180 : 0)) % 360)).toFixed(0) + '°');
        ctx.stat(Lx('같은 효과의 지연', 'Equivalent delay'), ((P.phase / 360) * 1000 / P.freq).toFixed(3) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
