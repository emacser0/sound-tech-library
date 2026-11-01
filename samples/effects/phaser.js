// 페이저: 1차 올패스 필터 N단을 원음에 더해 N/2개의 골을 만듦. 2단 vs 8단
GTL.register({
  id: 'phaser',
  title: '페이저 (올패스 단 수와 골)',
  summary: '페이저는 위상만 바꾸는 올패스 필터 여러 단을 거친 소리를 원음에 더함. 위상이 반대가 되는 곳마다 골이 생기고, LFO로 올패스 주파수를 움직이면 골이 쓸려 다님. 단 수가 많을수록 골이 많아짐.',
  views: { a: '올패스 2단 (골 1개)', b: '올패스 8단 (골 4개)' },
  controls: '파라미터 표에서 단 수, 피드백, 속도를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>올패스 필터(Allpass filter)</b>는 모든 주파수의 크기를 그대로 두고 위상만 늦춤. 1차 올패스는 꺾임 주파수 fc에서 위상이 -90°, 아주 높은 주파수에서 -180°까지 늦어짐.</p>
    <p><b>페이저(Phaser)</b>는 1차 올패스 N단을 거친 신호를 원음에 더함. 전체 위상이 -180°, -540°, ...인 주파수에서 두 신호가 상쇄되어 골이 생김. N단이면 위상이 최대 -N×180°까지 가므로 골은 N/2개.</p>
    <ul>
      <li><b>플랜저와 차이</b>: 플랜저의 골은 일정한 간격(콤)으로 수십 개. 페이저의 골은 몇 개뿐이고 간격이 고르지 않아 더 부드러움.</li>
      <li><b>피드백</b>: 체인 출력을 체인 입력에 더하면 골 사이 봉우리가 솟아 공명이 생김</li>
      <li>아날로그 페이저(MXR Phase 90은 4단, Uni-Vibe는 4단)는 JFET나 광소자로 fc를 바꿈. 디지털에서는 매 샘플 계수를 다시 계산함.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="64" class="t-small">${L('입력', 'In')}</text>
    <line x1="40" y1="60" x2="78" y2="60" class="d-line" marker-end="url(#arr)"/>
    <rect x="80" y="44" width="56" height="32" class="f-dim"/><text x="108" y="64" text-anchor="middle" class="t-small">AP1</text>
    <line x1="136" y1="60" x2="156" y2="60" class="d-line" marker-end="url(#arr)"/>
    <rect x="158" y="44" width="56" height="32" class="f-dim"/><text x="186" y="64" text-anchor="middle" class="t-small">AP2</text>
    <text x="236" y="64" text-anchor="middle">…</text>
    <rect x="258" y="44" width="56" height="32" class="f-dim"/><text x="286" y="64" text-anchor="middle" class="t-small">APn</text>
    <line x1="314" y1="60" x2="400" y2="60" class="d-line" marker-end="url(#arr)"/>
    <circle cx="412" cy="60" r="11" class="d-line"/><text x="412" y="64" text-anchor="middle">+</text>
    <line x1="423" y1="60" x2="470" y2="60" class="d-line" marker-end="url(#arr)"/><text x="476" y="64" class="t-small">${L('출력', 'Out')}</text>
    <path d="M60,60 L60,112 L412,112 L412,74" class="d-dim" marker-end="url(#arr)"/>
    <text x="200" y="126" class="t-small t-dim">${L('원음 (위상 그대로)', 'Dry (phase unchanged)')}</text>
    <path d="M340,60 L340,22 L68,22 L68,56" class="d-b" marker-end="url(#arr)"/>
    <text x="150" y="16" class="t-small t-b">${L('피드백', 'Feedback')}</text>
    <text x="120" y="96" class="t-small t-dim">${L('각 단: 크기 1, 위상 0° ~ -180°', 'Each stage: gain 1, phase 0° to -180°')}</text>
    <text x="300" y="144" class="t-small">${L('위상 합이 -180°(2k+1)인 곳 = 골', 'Total phase = -180°(2k+1) gives a notch')}</text>
  </svg>`,
  look: [
    'A와 B의 응답 곡선을 비교하면 A는 골 1개, B는 골 4개가 함께 움직임',
    '아래 위상 그래프에서 곡선이 -180° 점선을 지나는 곳마다 위의 골이 생김',
    '피드백을 0.7 이상으로 올리면 골 사이 봉우리가 솟고 소리가 공명함',
    '단 수를 홀수로 하면 마지막 골이 생기지 않고 반쯤 파인 고음 영역만 남음',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '2장 올패스 필터와 페이저' },
    { type: 'paper', title: 'Julius O. Smith III, "An Allpass Approach to Digital Phasing and Flanging", ICMC', year: 1984, note: '올패스 기반 페이저 설계' },
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '올패스 필터의 위상 응답' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed., Routledge', year: 2019, note: '페이저 구현' },
  ],
  params: [
    { key: 'stages', label: '올패스 단 수', type: 'int', min: 1, max: 12, a: 2, b: 8, group: '페이저' },
    { key: 'fb', label: '피드백', type: 'range', min: 0, max: 0.9, step: 0.01, default: 0.3, shared: true },
    { key: 'fmin', label: '최저 주파수 (Hz)', type: 'range', min: 50, max: 1000, step: 10, default: 150, shared: true },
    { key: 'fmax', label: '최고 주파수 (Hz)', type: 'range', min: 500, max: 8000, step: 50, default: 2500, shared: true },
    { key: 'rate', label: '속도 (Hz)', type: 'range', min: 0.02, max: 3, step: 0.01, default: 0.25, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'pad', label: '톱니 화음' }, { value: 'noise', label: '핑크 노이즈' }], default: 'pad', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Phaser (Allpass Stages and Notches)',
    summary: 'A phaser adds the dry sound to a copy that went through several allpass filters, which only change phase. A notch appears wherever the phases are opposite, and an LFO moves the allpass frequency so the notches sweep. More stages give more notches.',
    views: { a: '2 allpass stages (1 notch)', b: '8 allpass stages (4 notches)' },
    controls: 'Change stage count, feedback and rate in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>An <b>allpass filter</b> keeps the level of every frequency and only delays the phase. A first order allpass has -90° phase at its corner frequency fc and goes toward -180° at very high frequencies.</p>
    <p>A <b>phaser</b> adds the output of N first order allpass stages to the dry sound. Where the total phase is -180°, -540°, ..., the two signals cancel and make a notch. With N stages the phase reaches -N×180°, so there are N/2 notches.</p>
    <ul>
      <li><b>Compared to a flanger</b>: a flanger has dozens of evenly spaced notches (a comb). A phaser has only a few, unevenly spaced, so it sounds softer.</li>
      <li><b>Feedback</b>: adding the chain output to the chain input raises peaks between the notches and makes a resonance.</li>
      <li>Analog phasers (MXR Phase 90 has 4 stages, Uni-Vibe has 4) change fc with JFETs or light-dependent resistors. Digital phasers recompute the coefficient every sample.</li>
    </ul>`,
    look: [
      'Compare the response curves of A and B. A has 1 notch. B has 4 notches moving together.',
      'In the phase graph below, each place the curve crosses a -180° dashed line makes a notch above.',
      'Raise feedback above 0.7. Peaks rise between the notches and the sound resonates.',
      'Use an odd stage count. The last notch does not form, and only a half-cut high range remains.',
    ],
    refs: ['Ch. 2 allpass filters and phasers.', 'Allpass-based phaser design.', 'Phase response of allpass filters.', 'Phaser code.'],
    params: {
      stages: { label: 'Allpass stages', group: 'Phaser' },
      fb: 'Feedback',
      fmin: 'Lowest frequency (Hz)',
      fmax: 'Highest frequency (Hz)',
      rate: 'Rate (Hz)',
      src: { label: 'Source', group: 'Source', options: { pad: 'Saw chord', noise: 'Pink noise' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;

    function makeSource(sr) {
      const pink = A.noiseBuffer(sr * 2, 5, 'pink'), chord = [45, 52, 57, 60, 64], ph = [0, 0, 0, 0, 0];
      let n = 0;
      return () => {
        n++;
        if (P.src === 'noise') return pink[n % pink.length] * 0.35;
        let v = 0;
        for (let i = 0; i < 5; i++) { ph[i] += A.mtof(chord[i]) / sr; ph[i] -= Math.floor(ph[i]); v += A.wave.saw(ph[i]); }
        return v * 0.07;
      };
    }
    // LFO → 올패스 꺾임 주파수 (지수 스윕)
    const fcAt = (t) => P.fmin * Math.pow(Math.max(1, P.fmax / P.fmin), 0.5 + 0.5 * Math.sin(TAU * P.rate * t));
    const coef = (fc, sr) => { const k = Math.tan(Math.PI * Math.min(fc, sr * 0.45) / sr); return (k - 1) / (k + 1); };

    function makePhaser(sr) {
      const x1 = new Float64Array(12), y1 = new Float64Array(12);
      let n = 0, last = 0;
      const fn = (x) => {
        const a = coef(fcAt(n / sr), sr); n++;
        let u = x + P.fb * last;
        for (let s = 0; s < P.stages; s++) { const y = a * u + x1[s] - a * y1[s]; x1[s] = u; y1[s] = y; u = y; }
        last = u;
        return (x + u) * 0.5 * (1 - P.fb * 0.5);
      };
      fn.time = () => n / sr;
      return fn;
    }
    // 이론 응답. 체인 G = AP^N, H = (1 + G / (1 - fb G)) / 2
    const SRR = 48000;
    function chain(f, fc) {
      const a = coef(fc, SRR), w = TAU * f / SRR, er = Math.cos(w), ei = -Math.sin(w);
      const nr = a + er, ni = ei, dr = 1 + a * er, di = a * ei, dd = dr * dr + di * di;
      const sr1 = (nr * dr + ni * di) / dd, si1 = (ni * dr - nr * di) / dd;
      // 단 하나의 위상과 N제곱
      const ph = Math.atan2(si1, sr1) * P.stages;
      return { re: Math.cos(ph), im: Math.sin(ph), phase: ph };
    }
    function resp(f, fc) {
      const G = chain(f, fc);
      const dr = 1 - P.fb * G.re, di = -P.fb * G.im, dd = dr * dr + di * di;
      const qr = (G.re * dr + G.im * di) / dd, qi = (G.im * dr - G.re * di) / dd;
      return A.linToDb(Math.hypot(1 + qr, qi) * 0.5 * (1 - P.fb * 0.5));
    }
    // 단일 올패스의 위상은 0 ~ -π 범위라 atan2로 충분 (펼칠 필요 없음)
    function phaseOne(f, fc) { const k = Math.tan(Math.PI * f / SRR), kc = Math.tan(Math.PI * Math.min(fc, SRR * 0.45) / SRR); return -2 * Math.atan(k / kc); }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makePhaser(sr) };
        for (let i = 0; i < n; i++) { const v = live.fx(live.src()); l[i] = v; r[i] = v; }
      },
    });
    let tShow = 0;

    return {
      update(dt) { snd.update(); tShow += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const t = live && snd.on ? live.fx.time() : tShow, fc = fcAt(t);
        const rh = Math.max(70, (H - pad * 3) * 0.58);
        A.drawResponse(g, (f) => resp(f, fc), pad, pad, w, rh, { color: col, minDb: -40, maxDb: 12, dbStep: 12, label: GTL.L('주파수 응답 (지금 LFO 위치)', 'Frequency response (current LFO position)') });
        const fx = A.freqX(fc, pad, w, 20, 20000);
        D.line(g, fx, pad, fx, pad + rh, C.warn, 1);
        D.text(g, 'fc', fx + 3, pad + 16, { size: 9, color: C.warn });
        // 위상 그래프
        const py = pad * 2 + rh, ph = H - py - pad;
        const minPh = -12 * 180;
        D.rect(g, pad, py, w, ph, 'rgba(0,0,0,0.35)');
        for (let k = 1; k <= 12; k += 2) {
          const yy = py + (k * 180 / -minPh) * ph;
          g.setLineDash([3, 3]); D.line(g, pad, yy, pad + w, yy, k <= P.stages ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)', 1); g.setLineDash([]);
          if (k <= P.stages) D.text(g, `-${k * 180}°`, pad + w - 44, yy - 11, { size: 9, color: C.dim });
        }
        g.beginPath();
        const notches = [];
        let prev = 0;
        for (let i = 0; i <= w; i++) {
          const f = A.xFreq(pad + i, pad, w, 20, 20000), deg = phaseOne(f, fc) * P.stages * 180 / Math.PI;
          const yy = py + (-deg / -minPh) * ph;
          i ? g.lineTo(pad + i, yy) : g.moveTo(pad + i, yy);
          // -180(2k+1) 교차 = 골
          const kk = Math.floor((-deg + 180) / 360);
          if (i && kk > prev) notches.push(f);
          prev = kk;
        }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, GTL.L('올패스 체인 전체 위상', 'Total phase of the allpass chain'), pad + 4, py + 3, { size: 10, color: C.dim });
        ctx.stat(GTL.L('올패스 주파수 fc', 'Allpass frequency fc'), fc.toFixed(0) + ' Hz');
        ctx.stat(GTL.L('골 개수', 'Notch count'), notches.length);
        ctx.stat(GTL.L('골 주파수', 'Notch frequencies'), notches.length ? notches.slice(0, 6).map((f) => (f >= 1000 ? (f / 1000).toFixed(1) + 'k' : f.toFixed(0))).join(', ') : '-');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
