// 올패스 필터: 크기는 그대로, 위상만 바꿈. 파형 모양은 바뀌지만 소리는 거의 같음. 원본과 섞으면 페이저
GTL.register({
  id: 'allpass-phase',
  title: '올패스 필터와 위상',
  summary: '올패스 필터는 모든 주파수를 같은 크기로 통과시키고 위상(시간 지연)만 주파수마다 다르게 바꿈. 파형 모양과 최대값은 크게 달라지지만 귀에는 거의 같게 들림. 원본과 섞으면 골이 생겨 페이저가 됨.',
  views: { a: '원본 (올패스 없음)', b: '1차 올패스 4단' },
  info: `
    <p><b>올패스(Allpass) 필터</b>의 크기 응답은 모든 주파수에서 0dB. 하는 일은 위상 회전뿐. 1차 올패스는 기준 주파수에서 90도, 나이퀴스트에서 180도까지 위상을 돌림.</p>
    <ul>
      <li>배음의 위상 관계가 바뀌어서 파형 모양과 최대값(크레스트 팩터)이 달라짐. 그래도 정상 상태의 음색은 거의 그대로 들림. 귀는 크기 스펙트럼에 훨씬 민감.</li>
      <li><b>페이저(Phaser)</b>: 올패스 출력을 원본과 1:1로 섞으면 위상이 180도인 주파수에서 상쇄되어 골(노치)이 생김. 1차 올패스 2단마다 골 하나. 기준 주파수를 LFO로 움직이면 "슈웅" 소리.</li>
      <li>쓰임새: 페이저, 크로스오버 위상 맞춤, 리버브의 확산(Diffusion), 최대값을 낮춘 신호 만들기</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" class="t-small t-dim">${L('같은 배음, 다른 위상', 'Same harmonics, different phase')}</text>
    <path d="M20,50 L60,90 L60,10 L100,50 L100,50" class="d-a"/>
    <path d="M20,50 Q30,10 45,40 Q55,70 60,55 Q65,40 75,70 Q90,95 100,50" class="d-b"/>
    <text x="60" y="114" text-anchor="middle" class="t-small t-a">${L('톱니파', 'saw')}</text>
    <text x="60" y="128" text-anchor="middle" class="t-small t-b">${L('올패스 후', 'after allpass')}</text>
    <text x="64" y="150" text-anchor="middle" class="t-small t-dim">${L('크기 스펙트럼은 같음', 'same magnitude spectrum')}</text>
    <text x="300" y="18" class="t-small t-dim">${L('페이저 = 원본 + 올패스', 'Phaser = dry + allpass')}</text>
    <line x1="170" y1="70" x2="530" y2="70" class="d-dim"/>
    <path d="M170,70 L250,70 Q270,70 285,130 Q300,70 330,70 L380,70 Q400,70 412,130 Q424,70 450,70 L530,70" class="d-b"/>
    <text x="285" y="148" text-anchor="middle" class="t-small t-b">${L('위상 180도 = 상쇄', 'phase 180 deg = cancel')}</text>
    <text x="412" y="148" text-anchor="middle" class="t-small t-b">${L('540도', '540 deg')}</text>
  </svg>`,
  look: [
    '크기 응답은 두 뷰 모두 0dB로 평평함. 위상 그래프에서는 B만 0도에서 -720도까지 내려감.',
    '파형 그래프에서 B의 톱니파는 모양이 크게 바뀌고 "최대값" 측정값도 달라짐. "RMS"는 그대로.',
    '"소리 켜기" 후 소리 내는 뷰를 A와 B로 번갈아 들으면 거의 구별되지 않음',
    '"원본과 섞기"를 켜면 B의 크기 응답에 골 2개가 생김. "LFO"까지 켜면 페이저 소리가 남.',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications (Allpass Filters)', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '올패스의 정의와 1차, 2차 구조' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '올패스 기반 페이저' },
    { type: 'paper', title: 'Julius O. Smith, "An Allpass Approach to Digital Phasing and Flanging", ICMC', year: 1984, note: '올패스 페이저의 고전 논문' },
    { type: 'book', title: 'Brian C. J. Moore, An Introduction to the Psychology of Hearing, 6th ed.', year: 2012, note: '위상 변화에 대한 청각의 둔감함' },
  ],
  params: [
    { key: 'stages', label: '올패스 단 수', type: 'int', min: 0, max: 8, step: 1, a: 0, b: 4, group: '올패스', help: '0 = 원본 그대로' },
    { key: 'freq', label: '기준 주파수 (Hz)', type: 'range', min: 50, max: 8000, step: 10, default: 600, shared: true, help: '1차 올패스의 위상이 90도가 되는 주파수' },
    { key: 'mix', label: '원본과 섞기 (페이저)', type: 'bool', default: false, shared: true },
    { key: 'lfo', label: 'LFO로 기준 주파수 움직이기', type: 'bool', default: false, shared: true, help: '소리에서만 0.3Hz로 움직임' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Allpass Filters and Phase',
    summary: 'An allpass filter passes every frequency at the same level and changes only the phase (time delay) per frequency. The waveform shape and peak change a lot, but it sounds almost the same. Mix it with the dry signal and notches appear: a phaser.',
    views: { a: 'Dry (no allpass)', b: '4 first order allpass stages' },
    info: `
    <p>The magnitude of an <b>allpass filter</b> is 0 dB at every frequency. All it does is turn the phase. A 1st order allpass turns the phase by 90 degrees at its frequency and up to 180 degrees at Nyquist.</p>
    <ul>
      <li>The phase relation between harmonics changes, so the waveform shape and the peak (crest factor) change. The steady tone still sounds almost the same, because our ears are much more sensitive to the magnitude spectrum.</li>
      <li><b>Phaser</b>: mix the allpass output 1:1 with the dry signal. Frequencies where the phase is 180 degrees cancel and make notches. Every 2 first order stages give one notch. Move the frequency with an LFO for the "whoosh".</li>
      <li>Uses: phasers, phase alignment in crossovers, diffusion in reverbs, signals with a lower peak.</li>
    </ul>`,
    look: [
      'The magnitude is flat at 0 dB in both views. In the phase graph only B goes down from 0 to -720 degrees.',
      'In the waveform graph, B\'s saw changes shape a lot and the "Peak" stat changes too. "RMS" stays the same.',
      'Press "Sound on" and switch the view that plays sound between A and B. You can hardly tell them apart.',
      'Turn on "Mix with dry". B\'s magnitude gets 2 notches. Also turn on "LFO" to hear a phaser.',
    ],
    refs: ['Definition of allpass filters, 1st and 2nd order forms.', 'Allpass based phasers.', 'Classic paper on allpass phasers.', 'Why hearing is not very sensitive to phase changes.'],
    params: {
      stages: { label: 'Allpass stages', group: 'Allpass', help: '0 = dry signal' },
      freq: { label: 'Frequency (Hz)', help: 'Where a 1st order allpass turns the phase by 90 degrees' },
      mix: 'Mix with dry (phaser)',
      lfo: { label: 'Move the frequency with an LFO', help: 'Moves at 0.3 Hz, in the sound only' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, F0 = 110;

    // 1차 올패스 계수: H(z) = (a + z^-1) / (1 + a z^-1)
    const apCoef = (f, sr) => { const t = Math.tan(Math.PI * U.clamp(f, 10, sr * 0.45) / sr); return (t - 1) / (t + 1); };
    // 한 단의 위상 (-π~0)
    function stagePhase(a, f, sr) {
      const w = U.TAU * f / sr, nr = a + Math.cos(w), ni = -Math.sin(w), dr = 1 + a * Math.cos(w), di = -a * Math.sin(w);
      let p = Math.atan2(ni, nr) - Math.atan2(di, dr);
      while (p > 1e-9) p -= U.TAU; while (p <= -U.TAU) p += U.TAU;
      return Math.max(-Math.PI, p);
    }
    const phaseDeg = (f) => P.stages * stagePhase(apCoef(P.freq, SR), f, SR) * 180 / Math.PI;
    function magDb(f) {
      if (!P.mix || !P.stages) return 0;
      const ph = P.stages * stagePhase(apCoef(P.freq, SR), f, SR);
      return A.linToDb(Math.hypot(1 + Math.cos(ph), Math.sin(ph)) / 2);
    }
    function makeChain() { return { x: new Float64Array(8), y: new Float64Array(8) }; }
    function chain(st, x, a) {
      let v = x;
      for (let j = 0; j < P.stages; j++) { const y = a * v + st.x[j] - a * st.y[j]; st.x[j] = v; st.y[j] = y; v = y; }
      return P.mix && P.stages ? (x + v) * 0.5 : v;
    }

    const live = { st: makeChain(), ph: 0, lfo: 0, f: P.freq };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(20, sr / 32);
        let a = 0;
        for (let i = 0; i < n; i++) {
          if ((i & 31) === 0) {
            live.f += (P.freq - live.f) * k;
            const f = P.lfo ? live.f * Math.pow(2, 1.5 * Math.sin(live.lfo)) : live.f;
            a = apCoef(f, sr);
          }
          live.lfo += U.TAU * 0.3 / sr;
          const dt = F0 / sr, x = (2 * live.ph - 1 - A.polyBlep(live.ph, dt)) * 0.3;
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          const y = chain(live.st, x, a);
          l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', wave = null, dry = null, pk = 0, rms = 0, dpk = 0;
    const N = 8192, PER = Math.round(SR / F0);
    function analyze() {
      const k = [P.stages, P.freq, P.mix].join();
      if (k === key) return;
      key = k;
      const st = makeChain(), a = apCoef(P.freq, SR), out = new Float32Array(N), x0 = new Float32Array(N);
      let ph = 0;
      for (let i = 0; i < N; i++) {
        const dt = F0 / SR, x = 2 * ph - 1 - A.polyBlep(ph, dt);
        ph += dt; if (ph >= 1) ph -= 1;
        x0[i] = x; out[i] = chain(st, x, a);
      }
      wave = out; dry = x0;
      const from = N - PER * 4;
      pk = A.peak(out.subarray(from)); rms = A.rms(out, from); dpk = A.peak(x0.subarray(from));
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = h1, h3 = H - pad * 4 - h1 - h2;
        A.drawResponse(g, magDb, pad, pad, rw, h1, { color: col, minDb: -30, maxDb: 6, dbStep: 12, label: L('크기 응답', 'Magnitude') });
        const y2 = pad * 2 + h1, minP = -1440;
        A.drawResponse(g, (f) => phaseDeg(f), pad, y2, rw, h2, { color: col, minDb: minP, maxDb: 0, grid: false, label: L('위상 (0 ~ -1440도)', 'Phase (0 to -1440 deg)') });
        A.drawFreqGrid(g, pad, y2, rw, h2, {});
        for (let d = -360; d >= minP; d -= 360) { const py = y2 + h2 * (d / minP); D.line(g, pad, py, pad + rw, py, C.grid, 1); D.text(g, d + '°', pad + 2, py - 10, { size: 9, color: C.dim }); }
        const fx = A.freqX(P.freq, pad, rw, 20, 20000);
        D.line(g, fx, pad, fx, y2 + h2, C.warn, 1);
        const y3 = y2 + h2 + pad, from = N - PER * 3;
        A.drawWave(g, dry, pad, y3, rw, h3, { from, count: PER * 3, color: 'rgba(200,200,200,0.3)', amp: 0.45, lineWidth: 1 });
        A.drawWave(g, wave, pad, y3, rw, h3, { from, count: PER * 3, color: col, amp: 0.45, background: false, label: L('파형 3주기 (회색 = 원본 톱니파)', '3 cycles (gray = dry saw)') });
        ctx.stat(L('최대값', 'Peak'), `${pk.toFixed(2)} (${L('원본', 'dry')} ${dpk.toFixed(2)})`);
        ctx.stat('RMS', rms.toFixed(3));
        ctx.stat(L('기준 주파수에서 위상', 'Phase at frequency'), Math.round(phaseDeg(P.freq)) + '°');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
