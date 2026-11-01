// 거리 단서: 레벨만 줄이기 vs 레벨 + 공기 흡수 + 직접음/잔향 비율
GTL.register({
  id: 'distance-cues',
  title: '거리감 단서 (레벨, 공기 흡수, 직접음 대 잔향)',
  summary: '멀리 있는 소리를 볼륨만 줄여서 만들면 "작은 소리"로 들릴 뿐 멀게 들리지 않음. 공기의 고음 흡수와 직접음 대 잔향 비율을 함께 바꾸면 거리감이 생김.',
  views: { a: '레벨만 (1/r)', b: '레벨 + 공기 흡수 + 잔향 비율' },
  controls: '파라미터 표에서 거리를 바꾸거나 자동 이동을 켬',
  info: `
    <p>사람이 거리를 판단하는 단서는 여러 가지. 하나만 쓰면 거리감이 약함.</p>
    <ul>
      <li><b>레벨</b>: 점음원의 직접음은 거리가 두 배가 될 때마다 6dB 작아짐(역제곱 법칙). 원래 크기를 아는 소리일 때만 쓸모 있음.</li>
      <li><b>공기 흡수</b>: 공기는 고음을 더 많이 흡수함. 20°C, 습도 70%에서 1kHz는 약 3.7dB/km, 8kHz는 약 117dB/km. 100m만 떨어져도 8kHz가 12dB 가까이 줄어듦.</li>
      <li><b>직접음 대 잔향 비율(D/R Ratio)</b>: 방이나 숲의 잔향(확산음)은 어디서나 비슷한 크기. 직접음만 줄어드니 멀수록 잔향 비중이 커짐. 둘이 같아지는 거리가 <b>임계 거리(Critical Distance)</b>.</li>
    </ul>
    <p>게임 엔진은 거리 감쇠 곡선, 거리별 로우패스, 거리별 리버브 센드를 함께 둠(Wwise Attenuation, FMOD Spatializer와 리버브 센드 등)</p>
    <p>이 샘플의 공기 흡수 필터는 표값 곡선을 원폴 로우패스 두 개로 근사. 실제 흡수는 주파수의 제곱에 가깝게 늘어서 더 가파름.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('레벨 (dB) vs 거리 (로그 축)', 'Level (dB) vs distance (log axis)')}</text>
    <line x1="40" y1="150" x2="520" y2="150" class="d-line"/><line x1="40" y1="20" x2="40" y2="150" class="d-line"/>
    <path d="M40,30 L520,140" class="d-b"/>
    <text x="120" y="40" class="t-small t-b">${L('직접음 (-6dB / 거리 2배)', 'direct (-6 dB per doubling)')}</text>
    <line x1="40" y1="90" x2="520" y2="90" class="d-accent" stroke-dasharray="6 3"/>
    <text x="470" y="84" text-anchor="end" class="t-small">${L('잔향 (거리와 무관)', 'reverb (same everywhere)')}</text>
    <line x1="302" y1="20" x2="302" y2="150" class="d-dim" stroke-dasharray="3 3"/>
    <text x="306" y="164" class="t-small">${L('임계 거리', 'critical distance')}</text>
    <text x="170" y="120" text-anchor="middle" class="t-small t-dim">${L('직접음이 큼: 가깝게 들림', 'direct wins: sounds close')}</text>
    <text x="420" y="120" text-anchor="middle" class="t-small t-dim">${L('잔향이 큼: 멀게 들림', 'reverb wins: sounds far')}</text>
  </svg>`,
  look: [
    '거리를 60m로 두고 A와 B를 번갈아 들으면 A는 가까운 작은 소리, B는 멀리서 울리는 소리로 들림',
    '"직접음 레벨 고정"을 켜면 A는 거리를 바꿔도 소리가 그대로임. B는 여전히 멀어짐.',
    '아래 응답 그래프에서 거리를 늘리면 B의 고음 곡선이 내려감. A는 평평함.',
    '잔향 레벨을 -30dB로 낮추면 임계 거리가 멀어지고 B의 거리감이 약해짐',
  ],
  refs: [
    { type: 'paper', title: 'P. Zahorik, D. S. Brungart, A. W. Bronkhorst, "Auditory Distance Perception in Humans: A Summary of Past and Present Research", Acta Acustica united with Acustica 91', year: 2005, note: '레벨, D/R 비율, 스펙트럼 단서 정리' },
    { type: 'paper', title: 'D. H. Mershon, L. E. King, "Intensity and reverberation as factors in the auditory perception of egocentric distance", Perception & Psychophysics 18', year: 1975, note: '잔향이 거리감을 만든다는 실험' },
    { type: 'article', title: 'ISO 9613-1:1993, Acoustics: Attenuation of sound during propagation outdoors, Part 1: Calculation of the absorption of sound by the atmosphere', year: 1993, note: '공기 흡수 계수 계산 표준' },
    { type: 'article', title: 'W3C, Web Audio API: PannerNode distance models', url: 'https://www.w3.org/TR/webaudio/', note: 'linear, inverse, exponential 거리 감쇠식' },
    { type: 'engine', title: 'Audiokinetic Wwise, Attenuation (Volume, Auxiliary Send, Low-pass filter curves)', note: '거리별 볼륨, 리버브 센드, 로우패스 곡선을 함께 지정' },
  ],
  params: [
    { key: 'model', label: '거리 모델', type: 'select', options: [{ value: 'level', label: '레벨만 (1/r)' }, { value: 'full', label: '레벨 + 공기 흡수 + 잔향' }], a: 'level', b: 'full', group: '모델' },
    { key: 'norm', label: '직접음 레벨 고정', type: 'bool', default: false, shared: true, help: '켜면 직접음 크기를 바꾸지 않음. 다른 단서만 남음' },
    { key: 'dist', label: '거리 (m)', type: 'range', min: 1, max: 100, step: 0.5, default: 30, shared: true, group: '장면' },
    { key: 'move', label: '자동 이동', type: 'bool', default: false, shared: true },
    { key: 'revDb', label: '잔향 레벨 (dB)', type: 'range', min: -36, max: -6, step: 1, default: -20, shared: true, help: '1m 직접음 대비 확산 잔향 레벨' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'pluck', label: '뜯는 음 (아르페지오)' }, { value: 'clap', label: '박수' }], default: 'pluck', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Distance Cues (Level, Air Absorption, Direct-to-Reverb)',
    summary: 'If you make a far sound by only lowering the volume, it sounds like a quiet sound, not a far one. Changing high frequency air absorption and the direct-to-reverb ratio as well creates a sense of distance.',
    views: { a: 'Level only (1/r)', b: 'Level + air absorption + reverb ratio' },
    controls: 'Change the distance in the parameter table or turn on auto move.',
    info: `
    <p>We judge distance with several cues. One cue alone gives a weak sense of distance.</p>
    <ul>
      <li><b>Level</b>: the direct sound of a point source drops 6 dB every time the distance doubles (inverse square law). It helps only if you know how loud the sound really is.</li>
      <li><b>Air absorption</b>: air absorbs high frequencies more. At 20°C and 70% humidity, 1 kHz loses about 3.7 dB/km and 8 kHz about 117 dB/km. At only 100 m, 8 kHz drops by almost 12 dB.</li>
      <li><b>Direct-to-reverb ratio (D/R)</b>: the reverb (diffuse sound) of a room or forest is about the same level everywhere. Only the direct sound gets quieter, so far sounds have more reverb in them. The distance where the two are equal is the <b>critical distance</b>.</li>
    </ul>
    <p>Game engines combine a distance attenuation curve, a low-pass filter by distance and a reverb send by distance (Wwise Attenuation, FMOD Spatializer with reverb sends, and so on).</p>
    <p>The air absorption filter here approximates the table curve with two one-pole low-pass filters. Real absorption grows close to the square of frequency, so it is steeper.</p>`,
    look: [
      'Set the distance to 60 m and switch between A and B. A sounds like a quiet sound nearby. B sounds like a sound ringing far away.',
      'Turn on "Fix direct level". In A the sound no longer changes with distance. B still moves away.',
      'Increase the distance and watch the response graph. B\'s high frequency curve goes down. A stays flat.',
      'Lower the reverb level to -30 dB. The critical distance moves away and B\'s sense of distance gets weaker.',
    ],
    refs: ['Summary of level, D/R ratio and spectral cues.', 'Experiment showing that reverb creates distance.', 'Standard for computing air absorption.', 'The linear, inverse and exponential distance formulas.', 'Volume, reverb send and low-pass curves set together per distance.'],
    params: {
      model: { label: 'Distance model', group: 'Model', options: { level: 'Level only (1/r)', full: 'Level + air absorption + reverb' } },
      norm: { label: 'Fix direct level', help: 'When on, the direct sound level does not change. Only the other cues remain' },
      dist: { label: 'Distance (m)', group: 'Scene' },
      move: 'Auto move',
      revDb: { label: 'Reverb level (dB)', help: 'Diffuse reverb level relative to the direct sound at 1 m' },
      src: { label: 'Source', options: { pluck: 'Plucked notes (arpeggio)', clap: 'Clap' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 공기 흡수 계수 (dB/km), 20°C, 상대습도 70% 대표값
    const AIR_F = [63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    const AIR_DB = [0.1, 0.3, 1.0, 1.9, 3.7, 9.7, 32.8, 117, 400]; // 16k는 외삽
    const airDbPerM = (f) => {
      if (f <= AIR_F[0]) return AIR_DB[0] / 1000 * (f / AIR_F[0]) ** 2;
      for (let i = 1; i < AIR_F.length; i++) if (f <= AIR_F[i]) {
        const t = Math.log(f / AIR_F[i - 1]) / Math.log(AIR_F[i] / AIR_F[i - 1]);
        return Math.exp(Math.log(AIR_DB[i - 1]) + t * (Math.log(AIR_DB[i]) - Math.log(AIR_DB[i - 1]))) / 1000;
      }
      return AIR_DB[AIR_DB.length - 1] / 1000 * (f / 16000) ** 2;
    };
    // 거리 d에서 흡수가 3dB가 되는 주파수
    const f3At = (d) => { let lo = 20, hi = 40000; for (let i = 0; i < 40; i++) { const m = Math.sqrt(lo * hi); if (airDbPerM(m) * d > 3) hi = m; else lo = m; } return Math.sqrt(lo * hi); };
    const POLE = 1 / Math.sqrt(Math.SQRT2 - 1); // 원폴 2단으로 f3에서 -3dB가 되게 하는 배율
    let moveT = 0;
    const distNow = () => (P.move ? Math.pow(10, 2 * (1 - Math.cos(moveT * 0.25)) / 2) : P.dist);
    function cues(d) {
      const full = P.model === 'full';
      const direct = P.norm ? 0 : -20 * Math.log10(Math.max(1, d));
      const f3 = full ? Math.min(20000, f3At(d)) : 24000;
      const rev = full ? P.revDb : -200;
      return { direct, f3, rev, dr: direct - P.revDb, crit: Math.pow(10, -P.revDb / 20) };
    }

    // 음원
    const noise = A.noiseBuffer(1 << 16, 9);
    const NOTES = [57, 64, 69, 72, 76, 72, 69, 64];
    let tS = 0, ph = 0;
    function source(sr) {
      const t = tS; tS += 1 / sr;
      if (P.src === 'clap') { const tt = t % 0.7; return noise[Math.floor(t * sr) & 0xffff] * Math.exp(-tt / 0.018) * (tt < 0.0008 ? tt / 0.0008 : 1) * 0.9; }
      const step = 0.3, idx = Math.floor(t / step) % NOTES.length, tt = t % step;
      const f = A.mtof(NOTES[idx]); ph += f / sr; if (ph >= 1) ph -= 1;
      const env = Math.min(1, tt / 0.002) * Math.exp(-tt / 0.12);
      return ((2 * ph - 1) * 0.8 + (tt < 0.004 ? noise[Math.floor(t * sr) & 0xffff] * 0.6 : 0)) * env * 0.7;
    }
    // 4선 FDN 잔향 (RT 약 1.8초, 고음은 더 빨리 줄어듦)
    let fdn = null;
    function makeFdn(sr) {
      const lens = [1557, 1617, 1491, 1422].map((v) => Math.round(v * sr / 44100) | 0);
      const RT = 1.8;
      return { sr, lens, bufs: lens.map((n) => new Float32Array(n)), idx: [0, 0, 0, 0], lp: [0, 0, 0, 0], g: lens.map((n) => Math.pow(10, -3 * n / (sr * RT))) };
    }
    const st = { g: 1, a: 0.5, rg: 0, z1: 0, z2: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!fdn || fdn.sr !== sr) fdn = makeFdn(sr);
        const c = cues(distNow());
        const gT = A.dbToLin(c.direct), aT = Math.min(1, A.onePoleCoef(c.f3 * POLE, sr)), rT = A.dbToLin(c.rev) * 2.2;
        const k = 0.0015, F = fdn;
        for (let i = 0; i < n; i++) {
          const x = source(sr);
          st.g += (gT - st.g) * k; st.a += (aT - st.a) * k; st.rg += (rT - st.rg) * k;
          st.z1 += st.a * (x - st.z1); st.z2 += st.a * (st.z1 - st.z2);
          const dry = (P.model === 'full' ? st.z2 : x) * st.g;
          // FDN: 4x4 하다마드 행렬
          const o0 = F.bufs[0][F.idx[0]], o1 = F.bufs[1][F.idx[1]], o2 = F.bufs[2][F.idx[2]], o3 = F.bufs[3][F.idx[3]];
          const h0 = (o0 + o1 + o2 + o3) * 0.5, h1 = (o0 - o1 + o2 - o3) * 0.5, h2 = (o0 + o1 - o2 - o3) * 0.5, h3 = (o0 - o1 - o2 + o3) * 0.5;
          const hs = [h0, h1, h2, h3];
          const inR = x * st.rg * 0.25;
          for (let j = 0; j < 4; j++) {
            F.lp[j] += 0.45 * (hs[j] - F.lp[j]);
            F.bufs[j][F.idx[j]] = F.lp[j] * F.g[j] + inR;
            F.idx[j] = (F.idx[j] + 1) % F.lens[j];
          }
          l[i] = (dry + (o0 + o2) * 0.5) * 0.5; r[i] = (dry + (o1 + o3) * 0.5) * 0.5;
        }
      },
    });

    return {
      update(dt) { if (P.move) moveT += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const d = distNow(), c = cues(d), full = P.model === 'full';
        // 위: 거리 축과 음원
        const sh = 54, ax = pad + 30, aw = W - pad * 2 - 44, dX = (m) => ax + aw * Math.log10(m) / 2;
        D.rect(g, pad, pad, W - pad * 2, sh, 'rgba(0,0,0,0.35)');
        const yy = pad + sh / 2 + 4;
        D.line(g, ax, yy, ax + aw, yy, C.dim, 1);
        for (const m of [1, 2, 5, 10, 20, 50, 100]) { D.line(g, dX(m), yy - 3, dX(m), yy + 3, C.dim, 1); D.text(g, m + 'm', dX(m), yy + 6, { size: 9, color: C.dim, align: 'center' }); }
        D.circle(g, pad + 14, yy, 8, '#2a2f38', C.dim, 1.5);
        D.text(g, Lg('청취자에서 음원까지 거리 (로그 축)', 'Distance from listener to source (log axis)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        if (full && c.crit <= 100) { D.line(g, dX(c.crit), pad + 14, dX(c.crit), pad + sh - 2, C.accent, 1); D.text(g, Lg('임계 거리', 'critical dist.'), dX(c.crit) + 3, pad + 14, { size: 9, color: C.accent }); }
        D.circle(g, dX(d), yy, 7, col);
        // 가운데: 레벨 vs 거리
        const gy = pad + sh + 8, gh = Math.max(60, (H - gy - pad) * 0.45);
        D.rect(g, ax - 30, gy, aw + 44, gh, 'rgba(0,0,0,0.35)');
        const dbY = (db) => gy + 14 + (gh - 26) * U.clamp(-db / 48, 0, 1);
        for (let db = 0; db >= -48; db -= 12) { D.line(g, ax, dbY(db), ax + aw, dbY(db), C.grid, 1); D.text(g, db + 'dB', ax - 28, dbY(db) - 5, { size: 9, color: C.dim }); }
        g.beginPath();
        for (let i = 0; i <= 100; i++) { const m = Math.pow(10, 2 * i / 100), y = dbY(P.norm ? 0 : -20 * Math.log10(m)); i ? g.lineTo(dX(m), y) : g.moveTo(dX(m), y); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        if (full) D.line(g, ax, dbY(P.revDb), ax + aw, dbY(P.revDb), C.accent, 1.5);
        D.circle(g, dX(d), dbY(c.direct), 5, col);
        D.text(g, full ? Lg('직접음 레벨 (선)과 잔향 레벨 (보라)', 'Direct level (line) and reverb level (purple)') : Lg('직접음 레벨', 'Direct level'), ax - 26, gy + 2, { size: 10, color: C.dim });
        // 아래: 직접음 주파수 응답 (공기 흡수)
        const ry = gy + gh + 8, rh = H - ry - pad;
        if (rh > 40) {
          const real = (f) => -airDbPerM(f) * d;
          const approx = (f) => { if (!full) return 0; const fc = c.f3 * POLE; return -10 * Math.log10(1 + (f / fc) ** 2) * 2; };
          A.drawResponse(g, approx, pad, ry, W - pad * 2, rh, { fmin: 100, fmax: 20000, minDb: -30, maxDb: 6, dbStep: 6, color: col, label: Lg('직접음 응답 (점선 = 실제 공기 흡수)', 'Direct sound response (dashed = real air absorption)') });
          g.setLineDash([4, 3]);
          A.drawResponse(g, real, pad, ry, W - pad * 2, rh, { fmin: 100, fmax: 20000, minDb: -30, maxDb: 6, color: C.dim, lineWidth: 1, background: false, grid: false });
          g.setLineDash([]);
        }
        ctx.stat(Lg('거리', 'Distance'), `${d.toFixed(1)} m`);
        ctx.stat(Lg('직접음 레벨', 'Direct level'), `${c.direct.toFixed(1)} dB`);
        ctx.stat(Lg('직접음 대 잔향', 'Direct to reverb'), full ? `${c.dr.toFixed(1)} dB` : Lg('잔향 없음', 'No reverb'));
        ctx.stat(Lg('8kHz 공기 흡수', 'Air absorption at 8 kHz'), full ? `${(-airDbPerM(8000) * d).toFixed(1)} dB` : Lg('사용 안 함', 'Not used'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
