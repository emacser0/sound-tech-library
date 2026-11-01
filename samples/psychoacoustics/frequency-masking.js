// 주파수 마스킹: 큰 소리(마스커)가 가까운 주파수의 작은 소리(프로브)를 가림. 확산 함수와 마스킹 임계값
GTL.register({
  id: 'frequency-masking',
  title: '주파수 마스킹과 확산 함수',
  summary: '큰 소리 바로 옆 주파수의 작은 소리는 들리지 않음. A는 마스커 없이 프로브가 또렷이 들리고, B는 1 kHz 마스커의 마스킹 임계값 아래로 같은 프로브가 묻힘.',
  views: { a: '마스커 없음', b: '마스커 있음' },
  controls: '파라미터 표에서 프로브의 주파수와 레벨을 바꿈. "소리 켜기"를 누르면 마스커는 계속, 프로브는 삐 삐 끊어서 울림.',
  info: `
    <p><b>마스킹(Masking)</b>은 한 소리(마스커) 때문에 다른 소리(프로브)가 들리지 않거나 작게 들리는 현상. 달팽이관의 기저막에서 주파수가 가까운 소리는 같은 자리를 흔들기 때문에 일어남.</p>
    <p>마스커가 만드는 <b>마스킹 임계값</b>은 바크(Bark) 축에서 삼각형에 가까운 모양. 이 모양을 <b>확산 함수(Spreading function)</b>라 부름.</p>
    <ul>
      <li>아래쪽(낮은 주파수)으로는 가파르게 떨어짐. 약 27 dB/Bark.</li>
      <li>위쪽(높은 주파수)으로는 완만하고, 마스커가 클수록 더 완만해짐. 이것이 "마스킹의 위쪽 확산(Upward spread of masking)".</li>
      <li>잡음 마스커는 같은 레벨의 사인파 마스커보다 더 많이 가림</li>
    </ul>
    <p>MP3, AAC 같은 지각 부호화기는 이 임계값 아래의 양자화 잡음을 들리지 않는다고 보고 비트를 아낌. 믹싱에서 "악기끼리 주파수가 겹치면 묻힌다"는 말도 같은 원리.</p>
    <p>이 샘플은 단순 모델. 임계값 오프셋은 부호화기에서 쓰는 보수적인 값(Johnston 1988)이라 실제 청취 실험보다 조금 높게 나옴.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="150" x2="520" y2="150" class="d-line"/>
    <text x="520" y="166" text-anchor="end" class="t-small t-dim">${L('주파수 (Bark)', 'Frequency (Bark)')}</text>
    <path d="M30,60 C80,120 140,140 200,140 C300,140 420,120 520,80" class="d-dim" stroke-dasharray="4 3"/>
    <text x="40" y="54" class="t-small t-dim">${L('가청 한계', 'Threshold in quiet')}</text>
    <line x1="220" y1="150" x2="220" y2="30" class="d-a"/>
    <text x="220" y="24" text-anchor="middle" class="t-small t-a">${L('마스커', 'Masker')}</text>
    <path d="M160,140 L220,52 L380,128 L420,138" class="d-b"/>
    <text x="330" y="78" class="t-small t-b">${L('마스킹 임계값', 'Masking threshold')}</text>
    <text x="150" y="96" text-anchor="end" class="t-small">${L('가파름 (27 dB/Bark)', 'steep (27 dB/Bark)')}</text>
    <text x="330" y="108" class="t-small">${L('완만함 (레벨이 클수록)', 'gentle (more at high level)')}</text>
    <line x1="270" y1="150" x2="270" y2="100" class="d-good"/><circle cx="270" cy="100" r="4" class="f-good"/>
    <text x="270" y="176" text-anchor="middle" class="t-small">${L('임계값 아래의 프로브 = 안 들림', 'Probe under the threshold = not heard')}</text>
  </svg>`,
  look: [
    '기본값에서 A의 프로브는 가청 한계보다 30dB 넘게 위라 "들림". B는 마스킹 임계값 아래라 "가려짐".',
    '프로브 주파수를 700 Hz로 내리면 B에서도 다시 들림. 마스커 아래쪽은 임계값이 가파르게 떨어짐.',
    '마스커 레벨을 85 dB로 올리면 B의 임계값 오른쪽 기울기가 완만해짐. 프로브를 1.5 kHz로 옮겨도 가려짐. 70 dB에서는 1.5 kHz가 들림.',
    '마스커 종류를 잡음으로 바꾸면 임계값이 약 17dB 올라감. 잡음이 사인파보다 잘 가림.',
    '"소리 켜기"를 누르고 B를 들으면 삐 소리가 마스커에 묻혀 거의 안 들림. 소리 내는 뷰를 A로 바꾸면 또렷함.',
  ],
  refs: [
    { type: 'paper', title: 'Schroeder, Atal, Hall, "Optimizing digital speech coders by exploiting masking properties of the human ear", JASA 66(6)', year: 1979, note: 'Bark 축 확산 함수' },
    { type: 'paper', title: 'Johnston, "Transform coding of audio signals using perceptual noise criteria", IEEE JSAC 6(2)', year: 1988, note: '사인파와 잡음 마스커의 임계값 오프셋' },
    { type: 'paper', title: 'Terhardt, "Calculating virtual pitch", Hearing Research 1', year: 1979, note: '가청 한계 근사식과 레벨에 따라 바뀌는 확산 기울기' },
    { type: 'paper', title: 'Painter, Spanias, "Perceptual coding of digital audio", Proceedings of the IEEE 88(4)', year: 2000, note: '지각 부호화에 쓰는 마스킹 모델 정리' },
    { type: 'book', title: 'Zwicker, Fastl, Psychoacoustics: Facts and Models (3rd ed.)', year: 2007, note: '마스킹 측정 결과와 임계 대역' },
  ],
  params: [
    { key: 'masker', label: '마스커', type: 'bool', a: false, b: true, group: '마스커' },
    { key: 'mType', label: '마스커 종류', type: 'select', options: [{ value: 'tone', label: '사인파' }, { value: 'noise', label: '좁은 대역 잡음' }], default: 'tone', shared: true },
    { key: 'mFreq', label: '마스커 주파수 (Hz)', type: 'range', min: 200, max: 4000, step: 10, default: 1000, shared: true },
    { key: 'mLevel', label: '마스커 레벨 (dB SPL)', type: 'range', min: 40, max: 85, step: 1, default: 70, shared: true },
    { key: 'pFreq', label: '프로브 주파수 (Hz)', type: 'range', min: 100, max: 8000, step: 10, default: 1100, shared: true, group: '프로브' },
    { key: 'pLevel', label: '프로브 레벨 (dB SPL)', type: 'range', min: 0, max: 70, step: 1, default: 35, shared: true },
    { key: 'spread', label: '확산 함수', type: 'select', options: [{ value: 'terhardt', label: '두 기울기 (Terhardt)' }, { value: 'schroeder', label: 'Schroeder' }], default: 'terhardt', shared: true, group: '모델' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Frequency Masking & Spreading Function',
    summary: 'A quiet sound right next to a loud one in frequency is not heard. In A there is no masker and the probe is clear. In B the same probe sits under the masking threshold of a 1 kHz masker and gets buried.',
    views: { a: 'No masker', b: 'With masker' },
    controls: 'Change the probe frequency and level in the parameter table. Press "Sound on": the masker plays all the time and the probe beeps on and off.',
    info: `
    <p><b>Masking</b> means one sound (the masker) makes another sound (the probe) inaudible or quieter. It happens because sounds close in frequency shake the same place on the basilar membrane in the cochlea.</p>
    <p>On the Bark axis the <b>masking threshold</b> of a masker looks close to a triangle. This shape is called the <b>spreading function</b>.</p>
    <ul>
      <li>Below the masker (lower frequencies) it falls steeply, about 27 dB/Bark.</li>
      <li>Above the masker it falls gently, and more gently when the masker is loud. This is the "upward spread of masking".</li>
      <li>A noise masker hides more than a sine masker at the same level.</li>
    </ul>
    <p>Perceptual coders like MP3 and AAC treat quantization noise under this threshold as inaudible and save bits. The mixing rule "instruments in the same range bury each other" is the same idea.</p>
    <p>This is a simple model. The threshold offsets are the conservative values used in coders (Johnston 1988), so they come out a little higher than listening tests.</p>`,
    look: [
      'With the defaults, A\'s probe is more than 30 dB above the threshold in quiet, so it is "audible". In B it is under the masking threshold, so it is "masked".',
      'Lower the probe frequency to 700 Hz. B hears it again, because the threshold falls steeply below the masker.',
      'Raise the masker level to 85 dB. The right slope of B\'s threshold gets gentle. Even a probe at 1.5 kHz is masked. At 70 dB a 1.5 kHz probe is audible.',
      'Switch the masker type to noise. The threshold rises by about 17 dB. Noise masks better than a sine.',
      'Press "Sound on" and listen to B. The beeps are almost lost in the masker. Switch the playing view to A and they are clear.',
    ],
    refs: ['Spreading function on the Bark axis.', 'Threshold offsets for tone and noise maskers.', 'Threshold in quiet formula and level-dependent slope.', 'Review of masking models used in perceptual coding.', 'Masking measurements and critical bands.'],
    params: {
      masker: { label: 'Masker', group: 'Masker' },
      mType: { label: 'Masker type', options: { tone: 'Sine', noise: 'Narrow-band noise' } },
      mFreq: 'Masker frequency (Hz)',
      mLevel: 'Masker level (dB SPL)',
      pFreq: { label: 'Probe frequency (Hz)', group: 'Probe' },
      pLevel: 'Probe level (dB SPL)',
      spread: { label: 'Spreading function', group: 'Model', options: { terhardt: 'Two slopes (Terhardt)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const FS_SPL = 80; // 진폭 1 사인파 = 80 dB SPL로 가정
    const bark = (f) => 13 * Math.atan(0.00076 * f) + 3.5 * Math.atan((f / 7500) * (f / 7500));
    const barkInv = (z) => { let lo = 1, hi = 24000; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (bark(m) < z) lo = m; else hi = m; } return (lo + hi) / 2; };
    const cbw = (f) => 25 + 75 * Math.pow(1 + 1.4 * (f / 1000) * (f / 1000), 0.69);
    // 가청 한계 (Terhardt 근사), f: Hz
    const ath = (f) => { const k = Math.max(0.02, f / 1000); return 3.64 * Math.pow(k, -0.8) - 6.5 * Math.exp(-0.6 * (k - 3.3) * (k - 3.3)) + 1e-3 * Math.pow(k, 4); };
    // 마스커 하나가 주파수 f에 만드는 마스킹 임계값 (dB SPL)
    function maskAt(f) {
      const zm = bark(P.mFreq), dz = bark(f) - zm, Lm = P.mLevel;
      const offset = P.mType === 'tone' ? 14.5 + zm : 5.5;
      let sf;
      if (P.spread === 'schroeder') sf = 15.81 + 7.5 * (dz + 0.474) - 17.5 * Math.sqrt(1 + (dz + 0.474) * (dz + 0.474));
      else sf = dz < 0 ? 27 * dz : -(24 + 230 / P.mFreq - 0.2 * Lm) * dz;
      return Lm + sf - offset;
    }
    const pSum = (a, b) => 10 * Math.log10(Math.pow(10, a / 10) + Math.pow(10, b / 10));
    const thrAt = (f) => (P.masker ? pSum(ath(f), maskAt(f)) : ath(f));

    // 소리
    const rng = U.rng(ctx.seed || 1);
    let bp = null, bpKey = '', noiseNorm = 1, phM = 0, phP = 0, t = 0, gM = 0, gP = 0;
    function prepNoise(sr) {
      const k = P.mFreq + '|' + sr;
      if (k === bpKey) return;
      bpKey = k;
      bp = A.biquad('bandpass', P.mFreq, P.mFreq / cbw(P.mFreq), 0, sr);
      // 1초 분량을 걸러 RMS를 재고, 같은 레벨의 사인파 RMS(1/√2)에 맞춤
      const r2 = U.rng(7), tmp = A.biquad('bandpass', P.mFreq, P.mFreq / cbw(P.mFreq), 0, sr);
      let s = 0;
      for (let i = 0; i < sr; i++) { const y = tmp.process(r2.range(-1, 1)); if (i > 2000) s += y * y; }
      noiseNorm = Math.SQRT1_2 / Math.sqrt(s / (sr - 2000));
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (P.mType === 'noise') prepNoise(sr);
        const ampM = P.masker ? A.dbToLin(P.mLevel - FS_SPL) : 0, ampP = A.dbToLin(P.pLevel - FS_SPL);
        for (let i = 0; i < n; i++) {
          gM += (ampM - gM) * 0.002;
          const on = (t % 0.5) < 0.25 ? 1 : 0;
          gP += (on * ampP - gP) * 0.004;
          const m = P.mType === 'noise' ? bp.process(rng.range(-1, 1)) * noiseNorm : Math.sin(phM);
          const v = gM * m + gP * Math.sin(phP);
          l[i] = v; r[i] = v;
          phM += 2 * Math.PI * P.mFreq / sr; if (phM > 6.283185307) phM -= 6.283185307;
          phP += 2 * Math.PI * P.pFreq / sr; if (phP > 6.283185307) phP -= 6.283185307;
          t += 1 / sr;
        }
      },
    });

    const ZMAX = 24, DBMIN = -10, DBMAX = 95;
    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const gx = pad + 26, gy = pad + 18, gw = W - gx - pad, gh = H - gy - 30;
        const xOfZ = (z) => gx + gw * U.clamp(z / ZMAX, 0, 1);
        const xOf = (f) => xOfZ(bark(f));
        const yOf = (db) => gy + gh - U.clamp((db - DBMIN) / (DBMAX - DBMIN), -0.02, 1.02) * gh;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        for (const f of [100, 200, 500, 1000, 2000, 5000, 10000]) { const x = xOf(f); D.line(g, x, gy, x, gy + gh, C.grid); D.text(g, f >= 1000 ? f / 1000 + 'k' : String(f), x + 2, gy + gh + 3, { size: 9, color: C.dim }); }
        for (let db = 0; db <= 90; db += 20) { D.line(g, gx, yOf(db), gx + gw, yOf(db), C.grid); D.text(g, String(db), gx - 4, yOf(db) - 5, { size: 9, color: C.dim, align: 'right' }); }
        D.text(g, L('x: Bark (눈금은 Hz), y: dB SPL', 'x: Bark (ticks in Hz), y: dB SPL'), gx, pad, { size: 10, color: C.dim });
        // 곡선
        const steps = Math.max(60, Math.floor(gw / 3));
        const curve = (fn, color, lw, dash, fill) => {
          g.beginPath();
          for (let i = 0; i <= steps; i++) { const z = 0.2 + (ZMAX - 0.2) * i / steps, f = barkInv(z), x = xOfZ(z), y = yOf(fn(f)); i ? g.lineTo(x, y) : g.moveTo(x, y); }
          if (fill) { g.lineTo(xOfZ(ZMAX), gy + gh); g.lineTo(xOfZ(0.2), gy + gh); g.closePath(); g.fillStyle = fill; g.fill(); return; }
          g.setLineDash(dash || []); g.strokeStyle = color; g.lineWidth = lw; g.stroke(); g.setLineDash([]);
        };
        curve(thrAt, null, 0, null, ctx.side === 'a' ? 'rgba(255,122,89,0.10)' : 'rgba(79,195,247,0.12)');
        curve(ath, C.dim, 1.2, [4, 3]);
        if (P.masker) curve(thrAt, col, 2);
        // 마스커
        if (P.masker) {
          const x = xOf(P.mFreq), y = yOf(P.mLevel);
          if (P.mType === 'noise') { const bw = cbw(P.mFreq); D.rect(g, xOf(P.mFreq - bw / 2), y, Math.max(2, xOf(P.mFreq + bw / 2) - xOf(P.mFreq - bw / 2)), gy + gh - y, 'rgba(199,146,234,0.45)'); }
          else D.line(g, x, gy + gh, x, y, C.accent, 3);
          D.text(g, L('마스커', 'Masker'), x, y - 13, { size: 10, align: 'center', color: C.accent });
        }
        // 프로브
        const thr = thrAt(P.pFreq), margin = P.pLevel - thr, heard = margin > 0;
        const px = xOf(P.pFreq), py = yOf(P.pLevel);
        D.line(g, px, gy + gh, px, py, heard ? C.good : C.bad, 2);
        D.circle(g, px, py, 5, heard ? C.good : C.bad);
        D.line(g, px - 8, yOf(thr), px + 8, yOf(thr), C.text, 1);
        D.text(g, heard ? L('들림', 'audible') : L('가려짐', 'masked'), px + 8, py - 6, { size: 11, color: heard ? C.good : C.bad });
        ctx.stat(L('프로브 위치의 임계값', 'Threshold at probe'), thr.toFixed(1) + ' dB SPL');
        ctx.stat(L('여유 (프로브 - 임계값)', 'Margin (probe - threshold)'), (margin >= 0 ? '+' : '') + margin.toFixed(1) + ' dB');
        ctx.stat(L('마스커와의 거리', 'Distance to masker'), (bark(P.pFreq) - bark(P.mFreq)).toFixed(2) + ' Bark');
        ctx.stat(L('판정', 'Verdict'), heard ? L('들림', 'audible') : L('가려짐', 'masked'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
