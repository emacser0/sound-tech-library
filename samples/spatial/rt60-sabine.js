// 잔향 시간 RT60: 방 크기와 흡음재로 계산 (Sabine, Eyring), 계산값으로 FDN 잔향을 울림
(function () {
  // 옥타브 대역(125~4k Hz) 흡음률. 교과서 표의 대표값 (제품마다 다름)
  const MATERIALS = {
    concrete: { ko: '콘크리트 (맨면)', en: 'Concrete (bare)', a: [0.01, 0.01, 0.015, 0.02, 0.02, 0.02] },
    plaster: { ko: '회벽 (벽돌 위)', en: 'Plaster (on brick)', a: [0.013, 0.015, 0.02, 0.03, 0.04, 0.05] },
    glass: { ko: '유리창', en: 'Window glass', a: [0.35, 0.25, 0.18, 0.12, 0.07, 0.04] },
    plywood: { ko: '얇은 합판 (공기층)', en: 'Thin plywood (air gap)', a: [0.28, 0.22, 0.17, 0.09, 0.1, 0.11] },
    carpet: { ko: '두꺼운 카펫', en: 'Heavy carpet', a: [0.02, 0.06, 0.14, 0.37, 0.6, 0.65] },
    curtain: { ko: '두꺼운 커튼 (주름)', en: 'Heavy curtain (pleated)', a: [0.14, 0.35, 0.55, 0.72, 0.7, 0.65] },
    panel: { ko: '흡음 패널 (광물면 50mm)', en: 'Absorbing panel (50 mm mineral wool)', a: [0.25, 0.65, 0.95, 0.95, 0.95, 0.9] },
  };
  const MOPTS = Object.keys(MATERIALS).map((k) => ({ value: k, label: MATERIALS[k].ko }));
  const MOPTS_EN = Object.fromEntries(Object.keys(MATERIALS).map((k) => [k, MATERIALS[k].en]));

GTL.register({
  id: 'rt60-sabine',
  title: '잔향 시간 계산 (Sabine, Eyring)',
  summary: '잔향 시간(RT60)은 소리가 60dB 줄어드는 데 걸리는 시간. 방 부피와 표면의 흡음량으로 계산함. A는 맨 콘크리트와 회벽 방, B는 바닥에 카펫, 천장에 흡음 패널을 둔 같은 방.',
  views: { a: '단단한 표면만', b: '카펫 + 흡음 천장' },
  controls: '파라미터 표에서 방 크기와 표면 재질을 바꿈. 소리를 켜면 계산된 잔향 시간으로 박수가 울림.',
  info: `
    <p><b>RT60</b>: 소리를 끈 뒤 에너지가 60dB(백만 분의 일) 줄어드는 시간. 말소리 강의실은 0.6~0.8초, 콘서트홀은 1.8~2.2초 정도가 알맞다고 봄.</p>
    <ul>
      <li><b>Sabine 공식</b>: <code>T = 0.161 V / A</code>. V는 부피(m³), A는 흡음력 <code>Σ Sᵢαᵢ</code>(m²). αᵢ는 표면 재질의 흡음률(0~1).</li>
      <li><b>Eyring 공식</b>: <code>T = 0.161 V / (-S ln(1 - ᾱ))</code>. ᾱ는 평균 흡음률. 흡음이 많은 방(ᾱ > 0.2)에서 Sabine보다 정확함.</li>
    </ul>
    <p>흡음률은 주파수마다 다름. 카펫과 커튼은 고음을, 얇은 합판은 저음을 주로 흡수함. 그래서 옥타브 대역마다 RT60이 다르고, 방의 음색이 정해짐.</p>
    <p>소리는 8선 FDN(Feedback Delay Network)으로 만듦. 각 지연선의 감쇠를 <code>10^(-3 m / (sr T))</code>로 정하고, 저음(250Hz)과 고음(4kHz)의 RT60이 다르게 원폴 흡음 필터를 넣음(Jot 방식).</p>
    <p>한계: 두 공식 모두 소리가 고르게 퍼진 확산 음장을 가정함. 긴 복도, 한쪽에만 흡음재를 몰아 둔 방, 아주 작은 방의 저음(룸 모드)에서는 잘 맞지 않음. 큰 방의 고음에서 생기는 공기 흡수는 뺐음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('소리를 끈 뒤 레벨 (dB)', 'Level after the sound stops (dB)')}</text>
    <line x1="40" y1="30" x2="40" y2="140" class="d-line"/><line x1="40" y1="140" x2="520" y2="140" class="d-line"/>
    <text x="34" y="34" text-anchor="end" class="t-small t-mono">0</text><text x="34" y="128" text-anchor="end" class="t-small t-mono">-60</text>
    <line x1="40" y1="124" x2="520" y2="124" class="d-dim" stroke-dasharray="3 3"/>
    <path d="M40,32 L470,124" class="d-a"/><path d="M40,32 L200,124" class="d-b"/>
    <line x1="200" y1="124" x2="200" y2="150" class="d-b"/><line x1="470" y1="124" x2="470" y2="150" class="d-a"/>
    <text x="200" y="162" text-anchor="middle" class="t-small t-b">${L('B의 RT60', 'RT60 of B')}</text>
    <text x="470" y="162" text-anchor="middle" class="t-small t-a">${L('A의 RT60', 'RT60 of A')}</text>
    <text x="300" y="60" class="t-small">${L('T = 0.161 V / A', 'T = 0.161 V / A')}</text>
    <text x="300" y="76" class="t-small t-dim">${L('흡음력 A가 클수록 빨리 줄어듦', 'More absorption A means faster decay')}</text>
  </svg>`,
  look: [
    '소리를 켜고 A와 B를 번갈아 들으면 A는 목욕탕처럼 길게 울리고 B는 짧고 건조하게 끝남',
    'B의 RT60 막대는 고음 쪽이 훨씬 짧음. 카펫과 흡음 패널이 고음을 더 많이 흡수함.',
    'A의 벽을 "얇은 합판"으로 바꾸면 125Hz 막대만 크게 줄어듦',
    'B에서 Sabine과 Eyring 측정값을 비교하면 Eyring이 더 짧음. 흡음이 적은 A에서는 둘이 거의 같음.',
  ],
  refs: [
    { type: 'book', title: 'Wallace Clement Sabine, Collected Papers on Acoustics, Harvard University Press', year: 1922, note: 'Sabine 공식의 원전' },
    { type: 'paper', title: 'Carl F. Eyring, "Reverberation Time in \'Dead\' Rooms", Journal of the Acoustical Society of America 1(2)', year: 1930, note: '흡음이 많은 방을 위한 Eyring 공식' },
    { type: 'book', title: 'F. Alton Everest, Ken C. Pohlmann, Master Handbook of Acoustics (6th Edition), McGraw-Hill', year: 2015, note: '재질별 흡음률 표와 RT60 계산 예' },
    { type: 'paper', title: 'Jean-Marc Jot, Antoine Chaigne, "Digital Delay Networks for Designing Artificial Reverberators", AES 90th Convention', year: 1991, note: 'FDN과 주파수별 감쇠 필터' },
    { type: 'book', title: 'Heinrich Kuttruff, Room Acoustics (5th Edition), Spon Press', year: 2009, note: '확산 음장 가정과 공식의 한계' },
  ],
  params: [
    { key: 'walls', label: '벽', type: 'select', options: MOPTS, default: 'plaster', a: 'plaster', b: 'plaster', group: '표면 재질' },
    { key: 'floor', label: '바닥', type: 'select', options: MOPTS, default: 'plaster', a: 'concrete', b: 'carpet' },
    { key: 'ceiling', label: '천장', type: 'select', options: MOPTS, default: 'plaster', a: 'plaster', b: 'panel' },
    { key: 'formula', label: '공식', type: 'select', options: [{ value: 'sabine', label: 'Sabine' }, { value: 'eyring', label: 'Eyring' }], default: 'sabine', shared: true, group: '방' },
    { key: 'rl', label: '길이 (m)', type: 'range', min: 3, max: 40, step: 0.5, default: 9, shared: true },
    { key: 'rw', label: '폭 (m)', type: 'range', min: 3, max: 30, step: 0.5, default: 7, shared: true },
    { key: 'rh', label: '높이 (m)', type: 'range', min: 2.2, max: 15, step: 0.1, default: 3.2, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Reverberation Time (Sabine, Eyring)',
    summary: 'Reverberation time (RT60) is how long a sound takes to drop by 60 dB. It is computed from the room volume and how much the surfaces absorb. A is a room with bare concrete and plaster. B is the same room with carpet on the floor and absorbing panels on the ceiling.',
    views: { a: 'Hard surfaces only', b: 'Carpet + absorbing ceiling' },
    controls: 'Change the room size and surface materials in the parameter table. Turn on sound to hear a clap ring with the computed reverberation time.',
    info: `
    <p><b>RT60</b>: the time for the energy to drop by 60 dB (one millionth) after the sound stops. Lecture rooms for speech usually aim for 0.6~0.8 s, concert halls for about 1.8~2.2 s.</p>
    <ul>
      <li><b>Sabine formula</b>: <code>T = 0.161 V / A</code>. V is the volume (m³) and A is the absorption <code>Σ Sᵢαᵢ</code> (m²). αᵢ is the absorption coefficient of a surface material (0~1).</li>
      <li><b>Eyring formula</b>: <code>T = 0.161 V / (-S ln(1 - ᾱ))</code>. ᾱ is the average absorption coefficient. It is more accurate than Sabine in rooms with a lot of absorption (ᾱ > 0.2).</li>
    </ul>
    <p>Absorption depends on frequency. Carpet and curtains absorb mostly high frequencies, thin plywood mostly low frequencies. So each octave band has its own RT60, and that sets the tone of the room.</p>
    <p>The sound comes from an 8-line FDN (Feedback Delay Network). The loss of each delay line is <code>10^(-3 m / (sr T))</code>, and a one-pole absorption filter gives different RT60 for low (250 Hz) and high (4 kHz) frequencies (the Jot method).</p>
    <p>Limits: both formulas assume a diffuse field where sound spreads evenly. They fit poorly in long corridors, rooms with all absorption on one side, and the bass of very small rooms (room modes). Air absorption at high frequencies in large rooms is left out.</p>`,
    look: [
      'Turn on sound and switch between A and B. A rings long like a bathroom. B ends short and dry.',
      'B\'s RT60 bars are much shorter at high frequencies. Carpet and panels absorb more high frequencies.',
      'Change A\'s walls to "Thin plywood". Only the 125 Hz bar drops a lot.',
      'In B, compare the Sabine and Eyring stats. Eyring is shorter. In A, with little absorption, they are almost the same.',
    ],
    refs: ['The original source of the Sabine formula.', 'The Eyring formula for highly absorbing rooms.', 'Absorption tables per material and RT60 examples.', 'FDNs and frequency-dependent decay filters.', 'The diffuse field assumption and limits of the formulas.'],
    params: {
      walls: { label: 'Walls', group: 'Surface materials', options: MOPTS_EN },
      floor: { label: 'Floor', options: MOPTS_EN },
      ceiling: { label: 'Ceiling', options: MOPTS_EN },
      formula: { label: 'Formula', group: 'Room' },
      rl: 'Length (m)',
      rw: 'Width (m)',
      rh: 'Height (m)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const BANDS = [125, 250, 500, 1000, 2000, 4000];
    const MAT = MATERIALS;
    // 표면별 면적
    function surfaces() {
      const Lr = P.rl, Wr = P.rw, Hr = P.rh;
      return [{ k: 'walls', S: 2 * (Lr + Wr) * Hr }, { k: 'floor', S: Lr * Wr }, { k: 'ceiling', S: Lr * Wr }];
    }
    // 대역별 RT60 (두 공식)
    function rt() {
      const V = P.rl * P.rw * P.rh, sf = surfaces(), S = sf.reduce((s, x) => s + x.S, 0);
      return BANDS.map((f, b) => {
        let Aa = 0; for (const x of sf) Aa += x.S * MAT[P[x.k]].a[b];
        const am = Math.min(0.99, Aa / S);
        return { f, A: Aa, am, sab: 0.161 * V / Aa, eyr: 0.161 * V / (-S * Math.log(1 - am)) };
      });
    }
    const pick = (r) => (P.formula === 'eyring' ? r.eyr : r.sab);

    // FDN (8선, Householder 행렬, 원폴 흡음 필터)
    const LENS = [1031, 1327, 1523, 1801, 2063, 2339, 2693, 3001];
    let fdn = null;
    function makeFdn(sr) {
      const lens = LENS.map((v) => Math.round(v * sr / 48000));
      return { sr, lens, bufs: lens.map((n) => new Float32Array(n)), idx: new Int32Array(8), z: new Float64Array(8), g0: new Float64Array(8), b: new Float64Array(8) };
    }
    const noise = A.noiseBuffer(1 << 16, 41);
    let tS = 0;
    const tmp = new Float64Array(8);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!fdn || fdn.sr !== sr) fdn = makeFdn(sr);
        const F = fdn, rr = rt(), tLo = Math.max(0.05, pick(rr[1])), tHi = Math.max(0.05, pick(rr[5]));
        for (let j = 0; j < 8; j++) {
          const gd = Math.pow(10, -3 * F.lens[j] / (sr * tLo)), gn = Math.pow(10, -3 * F.lens[j] / (sr * tHi));
          F.g0[j] = gd; F.b[j] = (gd - gn) / (gd + gn);
        }
        const tMid = Math.max(0.1, (pick(rr[2]) + pick(rr[3])) / 2), wet = 0.22 / Math.sqrt(Math.max(1, tMid));
        for (let i = 0; i < n; i++) {
          const t = tS; tS += 1 / sr;
          const tt = t % 2.5, x = tt < 0.05 ? noise[Math.floor(t * sr) & 0xffff] * Math.exp(-tt / 0.01) : 0;
          let sum = 0;
          for (let j = 0; j < 8; j++) { tmp[j] = F.bufs[j][F.idx[j]]; sum += tmp[j]; }
          const h = sum * 2 / 8;
          let ol = 0, orr = 0;
          for (let j = 0; j < 8; j++) {
            const v = tmp[j] - h;
            F.z[j] = F.g0[j] * (1 - F.b[j]) * v + F.b[j] * F.z[j];
            F.bufs[j][F.idx[j]] = F.z[j] + x * 0.5;
            F.idx[j] = (F.idx[j] + 1) % F.lens[j];
            if (j & 1) orr += tmp[j]; else ol += tmp[j];
          }
          l[i] = x * 0.5 + ol * wet; r[i] = x * 0.5 + orr * wet;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const rr = rt(), V = P.rl * P.rw * P.rh, sf = surfaces(), S = sf.reduce((s, x) => s + x.S, 0);
        const tmax = Math.max(1, ...rr.map((x) => Math.max(x.sab, x.eyr)));
        const tScale = tmax > 6 ? 12 : tmax > 3 ? 6 : tmax > 1.5 ? 3 : 1.5;
        // 위: 대역별 RT60 막대
        const bh = Math.max(90, H * 0.45), bx = pad, bw = W - pad * 2;
        D.rect(g, bx, pad, bw, bh, 'rgba(0,0,0,0.35)');
        const slot = (bw - 40) / BANDS.length, yT = (t) => pad + bh - 16 - (bh - 36) * Math.min(1, t / tScale);
        for (let k = 0; k <= 4; k++) { const t = tScale * k / 4; D.line(g, bx + 34, yT(t), bx + bw, yT(t), C.grid, 1); D.text(g, t.toFixed(1) + 's', bx + 2, yT(t) - 5, { size: 9, color: C.dim }); }
        rr.forEach((x, i) => {
          const x0 = bx + 40 + i * slot + slot * 0.2, w0 = slot * 0.6, v = pick(x), other = P.formula === 'eyring' ? x.sab : x.eyr;
          D.rect(g, x0, yT(v), w0, yT(0) - yT(v), col);
          D.rect(g, x0, yT(other), w0, 1.5, C.text);
          D.text(g, x.f >= 1000 ? x.f / 1000 + 'k' : String(x.f), x0 + w0 / 2, pad + bh - 13, { size: 9, color: C.dim, align: 'center' });
          D.text(g, v.toFixed(2), x0 + w0 / 2, yT(v) - 12, { size: 9, color: C.text, align: 'center' });
        });
        D.text(g, Lg(`옥타브 대역별 RT60 (${P.formula === 'eyring' ? 'Eyring' : 'Sabine'}), 흰 선 = 다른 공식`, `RT60 per octave band (${P.formula === 'eyring' ? 'Eyring' : 'Sabine'}), white line = other formula`), bx + 40, pad + 3, { size: 10, color: C.dim });
        // 아래: 감쇠 곡선 (dB vs 시간)
        const dy = pad + bh + 8, dh = H - dy - pad;
        if (dh > 40) {
          D.rect(g, bx, dy, bw, dh, 'rgba(0,0,0,0.35)');
          const tX = (t) => bx + 34 + (bw - 44) * t / tScale, dbY = (db) => dy + 14 + (dh - 28) * Math.min(1, -db / 70);
          for (const db of [0, -20, -40, -60]) { D.line(g, bx + 34, dbY(db), bx + bw - 10, dbY(db), db === -60 ? C.dim : C.grid, 1); D.text(g, db + '', bx + 4, dbY(db) - 5, { size: 9, color: C.dim }); }
          rr.forEach((x, i) => {
            const T = pick(x), c2 = C.series[i % C.series.length];
            D.line(g, tX(0), dbY(0), tX(Math.min(tScale, T * 70 / 60)), dbY(-Math.min(70, 60 * tScale / T)), c2, i === 2 ? 2.5 : 1.2);
          });
          D.text(g, Lg('감쇠 직선 (색 = 대역, 굵은 선 = 500Hz)', 'Decay lines (color = band, thick = 500 Hz)'), bx + 40, dy + 3, { size: 10, color: C.dim });
          D.text(g, `${tScale}s`, bx + bw - 12, dy + dh - 12, { size: 9, color: C.dim, align: 'right' });
        }
        const r5 = rr[2];
        ctx.stat(Lg('부피, 표면적', 'Volume, surface'), `${V.toFixed(0)} m³, ${S.toFixed(0)} m²`);
        ctx.stat(Lg('평균 흡음률 (500Hz)', 'Avg. absorption (500 Hz)'), r5.am.toFixed(3));
        ctx.stat(Lg('RT60 500Hz Sabine', 'RT60 500 Hz Sabine'), `${r5.sab.toFixed(2)} s`);
        ctx.stat(Lg('RT60 500Hz Eyring', 'RT60 500 Hz Eyring'), `${r5.eyr.toFixed(2)} s`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
})();
