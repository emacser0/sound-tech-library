// 라우드니스 (sone, phon): 같은 dB인데 대역이 넓으면 더 크게 들림. 임계 대역 단위로 크기를 더하는 Zwicker식 모델
GTL.register({
  id: 'loudness-sone-phon',
  title: '라우드니스 (sone, phon)와 대역폭',
  summary: '음압(dB)이 같아도 에너지가 여러 임계 대역에 퍼지면 더 크게 들림. 100 Hz 폭 잡음(A)과 3000 Hz 폭 잡음(B)은 dB 미터가 같지만, 임계 대역마다 크기를 더하는 라우드니스 모델은 B를 약 3배 크게 계산함.',
  views: { a: '좁은 대역 (100 Hz)', b: '넓은 대역 (3000 Hz)' },
  controls: '파라미터 표에서 대역폭과 레벨을 바꿈. 전체 음압은 대역폭과 상관없이 그대로 유지됨.',
  info: `
    <p>소리의 크기 감각(<b>라우드니스, Loudness</b>)은 dB와 비례하지 않음. 두 가지 단위를 씀.</p>
    <ul>
      <li><b>phon</b>: 같은 크기로 들리는 1 kHz 사인파의 dB SPL. 등청감 곡선의 단위.</li>
      <li><b>sone</b>: 크기 비율 단위. 1 kHz 40 dB = 1 sone. 약 10 phon 오를 때마다 2배 (<code>N = 2^((P - 40) / 10)</code>, Stevens의 거듭제곱 법칙).</li>
    </ul>
    <p>Zwicker 모델(ISO 532-1의 바탕)은 크기를 이렇게 계산함</p>
    <ul>
      <li>스펙트럼을 Bark 축으로 바꾸고, 마스킹처럼 옆으로 퍼진 <b>흥분 패턴(Excitation pattern)</b>을 구함</li>
      <li>Bark마다 흥분에 약 0.23제곱을 해서 <b>특정 라우드니스(Specific loudness, sone/Bark)</b>를 구함</li>
      <li>전체 넓이를 더하면 sone</li>
    </ul>
    <p>그래서 에너지가 한 임계 대역 안에 있으면 0.23제곱 때문에 크기가 조금만 늘고, 여러 대역에 퍼지면 넓이가 늘어 크게 들림. 대역폭이 임계 대역을 넘는 순간부터 크기가 오르는 것이 Zwicker, Flottorp, Stevens(1957)의 실험 결과. 방송 음량 규격(LUFS)이나 게임 믹스의 체감 음량이 dB 피크와 다른 이유도 같음.</p>
    <p>이 샘플은 단순화한 모델 (1/4 Bark 해상도, 두 기울기 확산, 1 kHz 40 dB 사인파 = 1 sone이 되게 보정). ISO 532-1의 정확한 값과는 다름.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="140" x2="520" y2="140" class="d-line"/>
    <text x="520" y="158" text-anchor="end" class="t-small t-dim">${L('Bark (임계 대역 번호)', 'Bark (critical band number)')}</text>
    <path d="M150,140 L200,40 L240,40 L300,140 Z" class="f-a" opacity="0.5"/>
    <text x="220" y="32" text-anchor="middle" class="t-small t-a">${L('좁은 대역: 높고 좁음', 'Narrow: tall and thin')}</text>
    <path d="M90,140 L130,90 L400,90 L450,140 Z" class="f-b" opacity="0.45"/>
    <text x="300" y="84" text-anchor="middle" class="t-small t-b">${L('넓은 대역: 낮지만 넓음', 'Wide: low but broad')}</text>
    <text x="270" y="122" text-anchor="middle" class="t-small">${L('같은 에너지. 넓이(sone)는 넓은 쪽이 큼', 'Same energy. The area (sone) is bigger for the wide one')}</text>
  </svg>`,
  look: [
    'A와 B의 "음압" 측정값은 같지만 "라우드니스"는 B가 약 3배. 아래 곡선에서 대역폭이 임계 대역(점선)을 넘는 지점부터 sone이 오름.',
    'B의 대역폭을 200 Hz 아래로 줄이면 A와 거의 같아짐 (한 임계 대역 안)',
    '레벨을 70 dB로 올리면 두 뷰 모두 sone이 약 2배가 됨 (10 dB = 크기 2배)',
    '"소리 켜기"를 누르고 소리 내는 뷰를 바꾸면 dB가 같은데도 B가 더 크게 들림',
  ],
  refs: [
    { type: 'paper', title: 'Zwicker, Flottorp, Stevens, "Critical band width in loudness summation", JASA 29(5)', year: 1957, note: '대역폭에 따른 크기 변화 실험' },
    { type: 'paper', title: 'Stevens, "On the psychophysical law", Psychological Review 64(3)', year: 1957, note: '크기의 거듭제곱 법칙과 sone' },
    { type: 'paper', title: 'ISO 532-1:2017, Acoustics: Methods for calculating loudness, Part 1: Zwicker method', year: 2017, note: 'Zwicker 라우드니스 계산 표준' },
    { type: 'book', title: 'Zwicker, Fastl, Psychoacoustics: Facts and Models (3rd ed.)', year: 2007, note: '흥분 패턴과 특정 라우드니스' },
    { type: 'paper', title: 'ITU-R BS.1770, Algorithms to measure audio programme loudness and true-peak audio level', note: '방송 음량(LUFS) 측정. 지각 크기를 단순 가중치로 근사' },
  ],
  params: [
    { key: 'bw', label: '잡음 대역폭 (Hz)', type: 'range', min: 10, max: 4000, step: 10, a: 100, b: 3000, default: 100, group: '잡음' },
    { key: 'fc', label: '중심 주파수 (Hz)', type: 'range', min: 500, max: 4000, step: 50, default: 2000, shared: true },
    { key: 'level', label: '전체 음압 (dB SPL)', type: 'range', min: 30, max: 75, step: 1, default: 60, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Loudness (Sone, Phon) & Bandwidth',
    summary: 'At the same level in dB, sound spread over several critical bands sounds louder. A 100 Hz wide noise (A) and a 3000 Hz wide noise (B) read the same on a dB meter. A loudness model that adds loudness per critical band rates B about 3 times as loud.',
    views: { a: 'Narrow band (100 Hz)', b: 'Wide band (3000 Hz)' },
    controls: 'Change the bandwidth and level in the parameter table. The total sound pressure level stays the same for any bandwidth.',
    info: `
    <p>How loud a sound feels (<b>loudness</b>) is not proportional to dB. Two units are used.</p>
    <ul>
      <li><b>phon</b>: the dB SPL of a 1 kHz sine that sounds equally loud. The unit of equal-loudness contours.</li>
      <li><b>sone</b>: a ratio unit. 1 kHz at 40 dB = 1 sone. It doubles for about every 10 phon (<code>N = 2^((P - 40) / 10)</code>, Stevens\' power law).</li>
    </ul>
    <p>The Zwicker model (the basis of ISO 532-1) computes loudness like this.</p>
    <ul>
      <li>Map the spectrum to the Bark axis and spread it sideways like masking, giving the <b>excitation pattern</b>.</li>
      <li>Raise the excitation in each Bark to about the power 0.23 to get the <b>specific loudness</b> (sone/Bark).</li>
      <li>The total area is the loudness in sone.</li>
    </ul>
    <p>So energy inside one critical band grows loudness only a little (because of the 0.23 power), while energy spread over many bands adds area and sounds louder. Loudness starts to rise once the bandwidth passes the critical band. This is the result of Zwicker, Flottorp and Stevens (1957). It is also why broadcast loudness (LUFS) and perceived loudness in a game mix differ from dB peaks.</p>
    <p>This is a simplified model (1/4 Bark resolution, two-slope spreading, calibrated so a 1 kHz 40 dB sine = 1 sone). It differs from the exact ISO 532-1 values.</p>`,
    look: [
      'A and B have the same "Level" stat, but B\'s "Loudness" is about 3 times higher. In the bottom curve, sone starts to rise where the bandwidth passes the critical band (dotted line).',
      'Narrow B\'s bandwidth below 200 Hz. It becomes almost the same as A (inside one critical band).',
      'Raise the level to 70 dB. Both views get about 2 times the sone (10 dB = twice as loud).',
      'Press "Sound on" and switch the playing view. B sounds louder even though the dB is the same.',
    ],
    refs: ['Experiment on loudness vs bandwidth.', 'The power law of loudness and the sone.', 'Standard for Zwicker loudness.', 'Excitation pattern and specific loudness.', 'Broadcast loudness (LUFS) measurement. It approximates perceived loudness with a simple weighting.'],
    params: {
      bw: { label: 'Noise bandwidth (Hz)', group: 'Noise' },
      fc: 'Center frequency (Hz)',
      level: 'Total level (dB SPL)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const FS_SPL = 80;
    const bark = (f) => 13 * Math.atan(0.00076 * f) + 3.5 * Math.atan((f / 7500) * (f / 7500));
    const barkInv = (z) => { let lo = 1, hi = 24000; for (let k = 0; k < 36; k++) { const m = (lo + hi) / 2; if (bark(m) < z) lo = m; else hi = m; } return (lo + hi) / 2; };
    const ath = (f) => { const k = Math.max(0.02, f / 1000); return 3.64 * Math.pow(k, -0.8) - 6.5 * Math.exp(-0.6 * (k - 3.3) * (k - 3.3)) + 1e-3 * Math.pow(k, 4); };
    const cbw = (f) => 25 + 75 * Math.pow(1 + 1.4 * (f / 1000) * (f / 1000), 0.69);
    const DZ = 0.25, NZ = 96; // 1/4 Bark 칸 96개 (0~24 Bark)
    const zc = Array.from({ length: NZ }, (_, i) => (i + 0.5) * DZ);
    const fz = zc.map(barkInv), edges = Array.from({ length: NZ + 1 }, (_, i) => barkInv(i * DZ));
    const athZ = fz.map(ath);
    // 칸마다 세기(선형 파워). lo~hi Hz에 고르게 퍼진 총 레벨 Ldb
    function bandPower(lo, hi, Ldb) {
      const p = new Float64Array(NZ), tot = Math.pow(10, Ldb / 10), w = hi - lo;
      for (let i = 0; i < NZ; i++) { const ov = Math.max(0, Math.min(hi, edges[i + 1]) - Math.max(lo, edges[i])); p[i] = tot * ov / w; }
      return p;
    }
    // 흥분 패턴 (dB). 두 기울기 확산
    function excitation(p) {
      const E = new Float64Array(NZ);
      for (let j = 0; j < NZ; j++) {
        if (p[j] <= 0) continue;
        const Lj = 10 * Math.log10(p[j]), up = 24 + 230 / fz[j] - 0.2 * Lj;
        for (let i = 0; i < NZ; i++) { const dz = zc[i] - zc[j]; const att = dz < 0 ? 27 * dz : -Math.max(5, up) * dz; E[i] += Math.pow(10, (Lj + att) / 10); }
      }
      return E;
    }
    // 특정 라우드니스 (Zwicker 식): 0.08 (E_TQ)^0.23 [(0.5 + 0.5 E/E_TQ)^0.23 - 1]
    function specific(E) {
      const Ns = new Float64Array(NZ);
      for (let i = 0; i < NZ; i++) { const etq = Math.pow(10, athZ[i] / 10); Ns[i] = Math.max(0, 0.08 * Math.pow(etq, 0.23) * (Math.pow(0.5 + 0.5 * E[i] / etq, 0.23) - 1)); }
      return Ns;
    }
    const total = (Ns) => { let s = 0; for (let i = 0; i < NZ; i++) s += Ns[i] * DZ; return s; };
    // 1 kHz 40 dB 사인파 = 1 sone이 되게 보정 (사인파는 1 kHz가 든 칸 하나에 모든 파워)
    const calib = (() => { const p = new Float64Array(NZ); let k = 0; while (k < NZ - 1 && edges[k + 1] < 1000) k++; p[k] = 1e4; return 1 / total(specific(excitation(p))); })();
    const band = (bw) => { const lo = Math.max(20, P.fc - bw / 2); return [lo, lo + bw]; };
    function loudness(bw) { const [lo, hi] = band(bw); const p = bandPower(lo, hi, P.level); const E = excitation(p); const Ns = specific(E); return { p, E, Ns, N: total(Ns) * calib }; }
    const phonOf = (N) => (N >= 1 ? 40 + 33.22 * Math.log10(N) : 40 * Math.pow(N + 0.0005, 0.35));

    let key = '', cur = null, ckey = '', sweep = null, sweepPeak = 1, sweepMax = 1;
    function analyze() {
      const k = P.bw + '|' + P.fc + '|' + P.level;
      if (k !== key) { key = k; cur = loudness(P.bw); }
      const k2 = P.fc + '|' + P.level;
      if (k2 !== ckey) {
        ckey = k2;
        sweep = Array.from({ length: 40 }, (_, i) => { const bw = 10 * Math.pow(400, i / 39); return { bw, N: loudness(bw).N }; });
        // 두 뷰가 같은 눈금을 쓰도록 공유 파라미터로만 정함
        let pk = 0; const nar = loudness(10); for (let i = 0; i < NZ; i++) pk = Math.max(pk, nar.Ns[i] * calib);
        sweepPeak = Math.max(0.2, pk); sweepMax = sweep.reduce((m, s) => Math.max(m, s.N), 0);
      }
    }

    // 소리: FFT로 만든 주기적 대역 잡음 (반복해도 이음매가 없음)
    const NB = 1 << 16;
    const rng = U.rng(11), phases = new Float64Array(NB / 2);
    for (let i = 0; i < NB / 2; i++) phases[i] = rng.range(0, Math.PI * 2);
    let nkey = '', nbuf = null, pos = 0;
    function buildNoise(sr) {
      const k = P.bw + '|' + P.fc + '|' + P.level + '|' + sr;
      if (k === nkey) return;
      nkey = k;
      const re = new Float64Array(NB), im = new Float64Array(NB), [lo, hi] = band(P.bw);
      let cnt = 0;
      for (let b = 1; b < NB / 2; b++) { const f = b * sr / NB; if (f >= lo && f <= hi) { re[b] = Math.cos(phases[b]); im[b] = Math.sin(phases[b]); re[NB - b] = re[b]; im[NB - b] = -im[b]; cnt++; } }
      A.fft(re, im, true);
      let s = 0;
      for (let i = 0; i < NB; i++) s += re[i] * re[i];
      const rms = Math.sqrt(s / NB), target = A.dbToLin(P.level - FS_SPL) * Math.SQRT1_2;
      nbuf = new Float32Array(NB);
      const gk = cnt ? target / Math.max(1e-12, rms) : 0;
      for (let i = 0; i < NB; i++) nbuf[i] = re[i] * gk;
    }
    let gsm = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        buildNoise(sr);
        for (let i = 0; i < n; i++) {
          gsm += (1 - gsm) * 0.001;
          const v = nbuf[pos] * gsm; pos = (pos + 1) % NB;
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const mw = 54, gx = pad, gw = W - pad * 3 - mw, gy = pad + 14, gh = Math.max(60, (H - 50) * 0.55);
        const zmax = 22, xZ = (z) => gx + gw * z / zmax;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        for (const f of [100, 200, 500, 1000, 2000, 5000, 10000]) { const x = xZ(bark(f)); D.line(g, x, gy, x, gy + gh, C.grid); D.text(g, f >= 1000 ? f / 1000 + 'k' : String(f), x + 2, gy + gh - 11, { size: 9, color: C.dim }); }
        D.text(g, L('특정 라우드니스 (sone/Bark, x: Bark). 넓이 = 전체 크기', 'Specific loudness (sone/Bark, x: Bark). Area = total loudness'), gx, pad, { size: 10, color: C.dim });
        // 특정 라우드니스 면적 (눈금 고정: 0 ~ 1.2 sone/Bark)
        const nmax = sweepPeak * 1.1, yN = (v) => gy + gh - 14 - (gh - 30) * Math.min(1, v / nmax);
        g.beginPath(); g.moveTo(xZ(0), yN(0));
        for (let i = 0; i < NZ; i++) if (zc[i] <= zmax) g.lineTo(xZ(zc[i]), yN(cur.Ns[i] * calib));
        g.lineTo(xZ(zmax), yN(0)); g.closePath();
        g.fillStyle = ctx.side === 'a' ? 'rgba(255,122,89,0.45)' : 'rgba(79,195,247,0.45)'; g.fill();
        // 입력 대역 표시
        const [lo, hi] = band(P.bw);
        D.rect(g, xZ(bark(lo)), gy + gh - 12, Math.max(2, xZ(bark(hi)) - xZ(bark(lo))), 6, C.warn);
        // 오른쪽: 미터 두 개
        const mx = gx + gw + pad, my = gy, mh = gh - 14;
        A.drawMeter(g, mx, my, 20, mh, P.level - 80, { minDb: -60, label: 'dB' });
        const sMax = sweepMax * 1.1, sv = U.clamp(cur.N / sMax, 0, 1);
        D.rect(g, mx + 28, my, 20, mh, 'rgba(0,0,0,0.4)');
        D.rect(g, mx + 28, my + mh * (1 - sv), 20, mh * sv, col);
        D.text(g, 'sone', mx + 38, my + mh + 4, { size: 10, align: 'center', color: C.dim });
        // 아래: 대역폭 대 sone 곡선
        const by = gy + gh + 26, bh = H - by - 18, bx = pad + 24, bw = W - bx - pad;
        if (bh > 30) {
          D.rect(g, bx, by, bw, bh, 'rgba(0,0,0,0.35)');
          D.text(g, L('대역폭 (로그, 10 ~ 4000 Hz) 대 라우드니스 (sone)', 'Bandwidth (log, 10 ~ 4000 Hz) vs loudness (sone)'), bx, by - 14, { size: 10, color: C.dim });
          let nmx = 0; for (const s of sweep) nmx = Math.max(nmx, s.N);
          nmx *= 1.15;
          const xb = (b) => bx + bw * Math.log(b / 10) / Math.log(400), ys = (N) => by + bh - bh * N / nmx;
          g.beginPath(); sweep.forEach((s, i) => (i ? g.lineTo(xb(s.bw), ys(s.N)) : g.moveTo(xb(s.bw), ys(s.N)))); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 1.5; g.stroke();
          const cb = cbw(P.fc);
          g.setLineDash([4, 3]); D.line(g, xb(cb), by, xb(cb), by + bh, C.good, 1); g.setLineDash([]);
          D.text(g, L('임계 대역', 'critical band'), xb(cb) + 3, by + 3, { size: 9, color: C.good });
          D.circle(g, xb(P.bw), ys(cur.N), 5, col, '#fff', 1.5);
          D.text(g, '0', bx - 4, by + bh - 10, { size: 9, align: 'right', color: C.dim });
          D.text(g, nmx.toFixed(1), bx - 4, by, { size: 9, align: 'right', color: C.dim });
        }
        ctx.stat(L('음압', 'Level'), P.level.toFixed(0) + ' dB SPL');
        ctx.stat(L('라우드니스', 'Loudness'), cur.N.toFixed(2) + ' sone');
        ctx.stat(L('라우드니스 레벨', 'Loudness level'), phonOf(cur.N).toFixed(1) + ' phon');
        ctx.stat(L('대역', 'Band'), `${lo.toFixed(0)} ~ ${hi.toFixed(0)} Hz (${(bark(hi) - bark(lo)).toFixed(2)} Bark)`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
