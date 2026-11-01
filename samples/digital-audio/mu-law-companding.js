// μ-law 컴팬딩: 같은 8비트라도 작은 값 쪽에 단계를 촘촘히 두면 조용한 소리의 SNR이 크게 좋아짐
GTL.register({
  id: 'mu-law-companding',
  title: 'μ-law 컴팬딩',
  summary: '같은 8비트로 선형 양자화와 μ-law 양자화를 비교. μ-law는 작은 값 근처에 단계를 몰아 두어 조용한 소리에서 SNR이 크게 높고, 큰 소리와 작은 소리의 SNR이 비슷하게 유지됨.',
  views: { a: '8비트 선형', b: '8비트 μ-law' },
  controls: '파라미터 표에서 방식, 비트 수, 신호 레벨을 바꿈',
  info: `
    <p>선형 양자화는 단계 크기가 모두 같음. 그래서 잡음의 절대 크기가 일정하고, 조용한 소리일수록 SNR이 나빠짐. 8비트 선형이면 -30 dBFS 신호의 SNR은 20dB 정도.</p>
    <p><b>컴팬딩(Companding)</b> = 압축(Compress) + 확장(Expand). 양자화 전에 로그 비슷한 곡선으로 작은 값을 키우고, 복원할 때 반대 곡선으로 되돌림. 결과적으로 작은 값 근처의 단계는 촘촘하고 큰 값 근처는 성김. 잡음이 신호 크기에 비례하게 되어 SNR이 레벨에 덜 좌우됨.</p>
    <ul>
      <li>μ-law: <code>F(x) = sgn(x) ln(1 + μ|x|) / ln(1 + μ)</code>, μ = 255. 북미, 일본 전화망 (ITU-T G.711).</li>
      <li>A-law: 비슷한 곡선. 유럽 전화망. 8비트로 선형 약 13~14비트에 해당하는 음성 품질.</li>
      <li>큰 신호에서는 선형보다 단계가 성겨 SNR이 오히려 낮음. 대신 넓은 레벨 범위에서 고르게 약 38dB.</li>
      <li>게임기, 오래된 샘플러, WAV 포맷(형식 코드 7)에서도 씀</li>
    </ul>`,
  diagram: (L) => {
    const mu = 255, F = (x) => Math.log(1 + mu * x) / Math.log(1 + mu);
    let curve = '';
    for (let i = 0; i <= 50; i++) { const x = i / 50; curve += `${(40 + x * 200).toFixed(1)},${(150 - F(x) * 120).toFixed(1)} `; }
    const lin = Array.from({ length: 8 }, (_, i) => `<line x1="${300 + (i + 0.5) * 25}" y1="140" x2="${300 + (i + 0.5) * 25}" y2="150" class="d-a"/>`).join('');
    const ml = Array.from({ length: 8 }, (_, i) => { const y = (i + 0.5) / 8, x = (Math.pow(1 + mu, y) - 1) / mu; return `<line x1="${(300 + x * 200).toFixed(1)}" y1="100" x2="${(300 + x * 200).toFixed(1)}" y2="110" class="d-b"/>`; }).join('');
    return `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <line x1="40" y1="150" x2="240" y2="150" class="d-dim"/><line x1="40" y1="150" x2="40" y2="30" class="d-dim"/>
    <polyline points="${curve}" class="d-b"/>
    <line x1="40" y1="150" x2="240" y2="30" class="d-a" stroke-dasharray="4 3"/>
    <text x="140" y="172" text-anchor="middle" class="t-small">${L('입력 |x|', 'input |x|')}</text>
    <text x="46" y="26" class="t-small">F(x)</text>
    <text x="150" y="70" class="t-small t-b">μ = 255</text>
    <line x1="300" y1="150" x2="500" y2="150" class="d-dim"/><line x1="300" y1="110" x2="500" y2="110" class="d-dim"/>
    ${lin}${ml}
    <text x="400" y="132" text-anchor="middle" class="t-small t-a">${L('선형: 고른 간격', 'linear: even spacing')}</text>
    <text x="400" y="92" text-anchor="middle" class="t-small t-b">${L('μ-law: 0 근처가 촘촘함', 'μ-law: dense near 0')}</text>
    <text x="400" y="172" text-anchor="middle" class="t-small t-dim">${L('3비트 양자화 단계 (0~1)', '3 bit quantization steps (0 to 1)')}</text>
  </svg>`;
  },
  look: [
    'A의 파형은 거친 계단이고 측정 SNR이 약 20dB. B는 매끄럽고 약 37dB.',
    '"소리 켜기"로 A를 들으면 음이 작아지는 꼬리에서 지글거림이 커짐. B는 꼬리까지 비교적 깨끗함.',
    '신호 레벨을 0 dBFS로 올리면 A의 SNR이 B보다 높아짐 (가운데 그래프에서 두 곡선이 교차)',
    '아래 단계 눈금에서 B의 단계가 0 근처에 몰려 있음',
  ],
  refs: [
    { type: 'article', title: 'ITU-T Recommendation G.711, Pulse code modulation (PCM) of voice frequencies', year: 1972, url: 'https://www.itu.int/rec/T-REC-G.711', note: 'μ-law, A-law 표준' },
    { type: 'book', title: 'Ken C. Pohlmann, Principles of Digital Audio', note: '비선형 양자화와 컴팬딩' },
    { type: 'book', title: 'N. S. Jayant, P. Noll, Digital Coding of Waveforms', year: 1984, note: '로그 양자화의 SNR 분석' },
  ],
  params: [
    { key: 'codec', label: '양자화 방식', type: 'select', options: [{ value: 'linear', label: '선형' }, { value: 'mulaw', label: 'μ-law (μ = 255)' }], a: 'linear', b: 'mulaw', default: 'linear', group: '코덱' },
    { key: 'bits', label: '비트 수', type: 'int', min: 4, max: 12, default: 8, shared: true },
    { key: 'level', label: '신호 레벨 (dBFS)', type: 'range', min: -60, max: 0, step: 1, default: -30, shared: true, group: '신호' },
    { key: 'sig', label: '소리', type: 'select', options: [{ value: 'pluck', label: '줄어드는 음 (멜로디)' }, { value: 'sine', label: '사인파' }], default: 'pluck', shared: true, help: '그래프는 항상 사인파 기준' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'μ-law Companding',
    summary: 'Compares linear and μ-law quantization with the same 8 bits. μ-law puts more steps near zero, so quiet sounds get a much better SNR and loud and quiet sounds end up with a similar SNR.',
    views: { a: '8 bit linear', b: '8 bit μ-law' },
    controls: 'Change the method, bit depth and signal level in the parameter table.',
    info: `
    <p>Linear quantization uses steps of equal size. The noise has a fixed absolute size, so quieter sounds get a worse SNR. With 8 bit linear, a -30 dBFS signal has an SNR of about 20 dB.</p>
    <p><b>Companding</b> = compressing + expanding. Before quantizing, a log-like curve boosts small values. On decode the inverse curve brings them back. The steps end up dense near zero and sparse near full scale. Noise becomes proportional to the signal, so the SNR depends less on level.</p>
    <ul>
      <li>μ-law: <code>F(x) = sgn(x) ln(1 + μ|x|) / ln(1 + μ)</code>, μ = 255. Used in North American and Japanese telephone networks (ITU-T G.711).</li>
      <li>A-law: a similar curve, used in European telephone networks. 8 bits give voice quality close to 13 to 14 bit linear.</li>
      <li>For loud signals the steps are coarser than linear, so the SNR is lower. In return it stays around 38 dB over a wide range of levels.</li>
      <li>Also used in game consoles, old samplers and the WAV format (format code 7).</li>
    </ul>`,
    look: [
      'A\'s waveform is a coarse staircase with a measured SNR of about 20 dB. B is smooth at about 37 dB.',
      'Press "Sound on" and listen to A. The fizz grows as each note fades. B stays fairly clean to the end.',
      'Raise the signal level to 0 dBFS. A\'s SNR becomes higher than B\'s (the two curves cross in the middle graph).',
      'In the step ticks at the bottom, B\'s steps crowd near 0.',
    ],
    refs: ['The μ-law and A-law standard.', 'Nonlinear quantization and companding.', 'SNR analysis of log quantizers.'],
    params: {
      codec: { label: 'Quantizer', group: 'Codec', options: { linear: 'Linear' } },
      bits: 'Bit depth',
      level: { label: 'Signal level (dBFS)', group: 'Signal' },
      sig: { label: 'Sound', help: 'The graphs always use a sine', options: { pluck: 'Fading notes (melody)', sine: 'Sine' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, TAU = Math.PI * 2, MU = 255, LMU = Math.log(1 + MU);

    function codec(x, kind, bits) {
      const q = Math.pow(2, bits - 1);
      if (kind === 'linear') return U.clamp(Math.round(x * q), -q, q - 1) / q;
      const s = x < 0 ? -1 : 1, y = Math.log(1 + MU * Math.min(1, Math.abs(x))) / LMU;
      const yq = Math.min(q - 0.5, Math.floor(y * q) + 0.5) / q; // 중간값 복원 (mid-rise)
      return s * (Math.pow(1 + MU, yq) - 1) / MU;
    }
    function snrAt(db, kind, bits) {
      const a = A.dbToLin(db), n = 2048; let ps = 0, pe = 0;
      for (let i = 0; i < n; i++) { const x = a * Math.sin(TAU * 375 * i / SR + 0.1), y = codec(x, kind, bits); ps += x * x; pe += (y - x) * (y - x); }
      return 10 * Math.log10(ps / Math.max(1e-30, pe));
    }

    // 소리
    const mel = [64, 67, 71, 72, 71, 67, 64, 60];
    let n = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, cnt) {
        const a = A.dbToLin(P.level), mon = 0.4 / a;
        for (let i = 0; i < cnt; i++) {
          const t = n / sr; n++;
          let x;
          if (P.sig === 'sine') x = a * Math.sin(TAU * 375 * t);
          else { const k = Math.floor(t / 0.5), tt = t - k * 0.5, f = A.mtof(mel[k % mel.length]); x = a * Math.sin(TAU * f * tt) * Math.exp(-tt * 7) * Math.min(1, tt * 400); }
          const v = codec(x, P.codec, P.bits) * mon;
          l[i] = v; r[i] = v;
        }
      },
    });

    let curveKey = '', curves = null, key = '', wave = null, orig = null, snr = 0;
    const LEVELS = []; for (let d = -70; d <= 0; d += 2) LEVELS.push(d);
    function analyze() {
      if (curveKey !== String(P.bits)) {
        curveKey = String(P.bits);
        curves = { linear: LEVELS.map((d) => snrAt(d, 'linear', P.bits)), mulaw: LEVELS.map((d) => snrAt(d, 'mulaw', P.bits)) };
      }
      const k = P.codec + '|' + P.bits + '|' + P.level;
      if (k === key) return;
      key = k;
      const a = A.dbToLin(P.level), cnt = 256;
      wave = new Float32Array(cnt); orig = new Float32Array(cnt);
      for (let i = 0; i < cnt; i++) { orig[i] = a * Math.sin(TAU * 375 * i / SR + 0.1); wave[i] = codec(orig[i], P.codec, P.bits); }
      snr = snrAt(P.level, P.codec, P.bits);
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const th = Math.max(50, H * 0.34), ch = Math.max(60, H * 0.4);
        const amp = 0.9 / A.dbToLin(P.level);
        A.drawWave(g, orig, pad, pad, w, th, { amp, color: 'rgba(216,221,230,0.35)', lineWidth: 1 });
        A.drawWave(g, wave, pad, pad, w, th, { amp, color: col, background: false, axis: false, dots: false, lineWidth: 1.6 });
        D.text(g, Lx(`복원된 사인파 2주기 (${P.level} dBFS, 세로 확대)`, `Decoded sine, 2 cycles (${P.level} dBFS, zoomed)`), pad + 4, pad + 3, { size: 10, color: C.dim });
        // SNR vs 레벨 곡선
        const cy = pad * 2 + th;
        D.rect(g, pad, cy, w, ch, 'rgba(0,0,0,0.35)');
        const maxS = 6.02 * P.bits + 6, lx = (d) => pad + ((d + 70) / 70) * w, ly = (s) => cy + ch - 4 - U.clamp(s / maxS, 0, 1) * (ch - 20);
        for (let s = 0; s <= maxS; s += 10) { D.line(g, pad, ly(s), pad + w, ly(s), C.grid, 1); D.text(g, s + ' dB', pad + 2, ly(s) - 11, { size: 9, color: C.dim }); }
        for (const [kind, c] of [['linear', C.a], ['mulaw', C.b]]) {
          g.beginPath();
          curves[kind].forEach((s, i) => { const x = lx(LEVELS[i]), y = ly(s); i ? g.lineTo(x, y) : g.moveTo(x, y); });
          g.strokeStyle = c; g.lineWidth = kind === P.codec ? 2.5 : 1; g.globalAlpha = kind === P.codec ? 1 : 0.5; g.stroke(); g.globalAlpha = 1;
        }
        const mx = lx(P.level);
        g.setLineDash([3, 3]); D.line(g, mx, cy, mx, cy + ch, C.warn, 1); g.setLineDash([]);
        D.circle(g, mx, ly(snr), 4, col);
        D.text(g, Lx('SNR vs 입력 레벨 (-70~0 dBFS). 주황 = 선형, 파랑 = μ-law', 'SNR vs input level (-70 to 0 dBFS). Orange = linear, blue = μ-law'), pad + 4, cy + 3, { size: 10, color: C.dim });
        // 양자화 단계 눈금 (양수 쪽 0~1)
        const qy = cy + ch + pad, qh = H - qy - pad;
        if (qh > 16) {
          D.rect(g, pad, qy, w, qh, 'rgba(0,0,0,0.35)');
          const q = Math.pow(2, P.bits - 1), seen = new Set();
          const lim = Math.min(q, 256);
          for (let i = 0; i < lim; i++) {
            const v = P.codec === 'linear' ? i / q : (Math.pow(1 + MU, (i + 0.5) / q) - 1) / MU;
            const px = Math.round(pad + v * w);
            if (seen.has(px)) continue; seen.add(px);
            D.line(g, px, qy + qh * 0.45, px, qy + qh, col, 1);
          }
          D.text(g, Lx('복원 값 단계 (0~1, 양수 쪽)', 'Decoded value steps (0 to 1, positive side)'), pad + 4, qy + 2, { size: 10, color: C.dim });
        }
        ctx.stat(Lx('측정 SNR', 'Measured SNR'), snr.toFixed(1) + ' dB');
        ctx.stat(Lx('단계 수', 'Steps'), String(Math.pow(2, P.bits)));
        const smallest = P.codec === 'linear' ? 1 / Math.pow(2, P.bits - 1) : (Math.pow(1 + MU, 1 / Math.pow(2, P.bits - 1)) - 1) / MU;
        ctx.stat(Lx('가장 작은 단계', 'Smallest step'), A.linToDb(smallest).toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
