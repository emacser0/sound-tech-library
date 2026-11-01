// 테이프 시뮬레이션: 깨끗한 디지털 vs 와우, 플러터(속도 흔들림) + 포화 + 고음 손실 + 히스
GTL.register({
  id: 'tape-wow-flutter',
  title: '테이프 와우, 플러터, 포화',
  summary: '아날로그 테이프는 모터와 롤러가 고르게 돌지 않아 음 높이가 느리게(와우) 또는 빠르게(플러터) 흔들리고, 자성체가 포화되어 부드럽게 찌그러짐. 변조 지연, 소프트 클립, 필터, 노이즈를 합치면 이 질감을 흉내 낼 수 있음.',
  views: { a: '깨끗한 디지털', b: '테이프 시뮬레이션' },
  controls: '파라미터 표에서 와우, 플러터, 포화, 히스를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p>테이프 녹음기의 소리 특징은 대부분 기계와 자성체의 불완전함에서 옴. 로파이(Lo-fi) 음악과 빈티지 질감을 위해 일부러 넣음.</p>
    <ul>
      <li><b>와우(Wow)</b>: 0.5~4Hz의 느린 속도 변화. 릴이 찌그러지거나 모터가 흔들려 생김. 음 높이가 "우-웅" 하고 출렁임.</li>
      <li><b>플러터(Flutter)</b>: 4~20Hz 이상의 빠른 속도 변화. 캡스턴, 롤러의 진동. 소리가 떨리고 흐릿해짐.</li>
      <li>둘 다 변조 지연으로 만듦. 지연 D(t)가 변하면 피치가 1 - dD/dt배가 됨(도플러). 실제 테이프처럼 사인파에 느린 무작위 흔들림을 섞음.</li>
      <li><b>포화(Saturation)</b>: 자성체가 일정 이상 자화되지 않아 큰 신호가 부드럽게 눌림. 주로 3차 배음이 생김. 여기서는 tanh로 근사.</li>
      <li><b>헤드 손실과 히스</b>: 재생 헤드의 틈 때문에 고음이 줄고, 자성 입자의 무작위성이 "쉬익" 하는 히스 잡음이 됨</li>
    </ul>
    <p>측정 규격(IEC 60386)은 3150Hz 시험음을 녹음하고 재생해서 주파수 편차를 % 로 잼. 좋은 녹음기는 0.05% 이하, 카세트는 0.1~0.3% 정도.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="6" y="54" class="t-small">${L('입력', 'In')}</text>
    <line x1="32" y1="50" x2="58" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="60" y="34" width="86" height="32" class="f-dim"/><text x="103" y="48" text-anchor="middle" class="t-small">${L('포화', 'Saturation')}</text><text x="103" y="61" text-anchor="middle" class="t-small t-dim">tanh</text>
    <line x1="146" y1="50" x2="168" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="170" y="34" width="110" height="32" class="f-dim"/><text x="225" y="48" text-anchor="middle" class="t-small">${L('변조 지연', 'Modulated delay')}</text><text x="225" y="61" text-anchor="middle" class="t-small t-dim">${L('와우 + 플러터', 'wow + flutter')}</text>
    <line x1="280" y1="50" x2="302" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="304" y="34" width="100" height="32" class="f-dim"/><text x="354" y="48" text-anchor="middle" class="t-small">${L('헤드 손실', 'Head loss')}</text><text x="354" y="61" text-anchor="middle" class="t-small t-dim">${L('로우패스', 'lowpass')}</text>
    <line x1="404" y1="50" x2="430" y2="50" class="d-line" marker-end="url(#arr)"/>
    <circle cx="442" cy="50" r="11" class="d-line"/><text x="442" y="54" text-anchor="middle">+</text>
    <line x1="442" y1="90" x2="442" y2="63" class="d-line" marker-end="url(#arr)"/><text x="442" y="104" text-anchor="middle" class="t-small">${L('히스', 'Hiss')}</text>
    <line x1="453" y1="50" x2="490" y2="50" class="d-line" marker-end="url(#arr)"/><text x="494" y="54" class="t-small">${L('출력', 'Out')}</text>
    <path d="M170,130 C200,110 230,110 260,130 C290,150 320,150 350,130" class="d-b"/>
    <path d="M170,130 l4,-4 l4,6 l4,-6 l4,6 l4,-6 l4,6 l4,-6 l4,6 l4,-6 l4,6" class="d-b" opacity="0.6"/>
    <text x="360" y="134" class="t-small t-b">${L('느린 와우 + 빠른 플러터', 'Slow wow + fast flutter')}</text>
  </svg>`,
  look: [
    '3150Hz 확대 스펙트럼을 비교하면 A는 가는 선 하나, B는 양옆으로 퍼진 치마 모양',
    '음 높이 편차 그래프에서 와우를 올리면 느린 큰 물결, 플러터를 올리면 빠른 잔물결이 커짐',
    '포화를 올리면 전체 스펙트럼에서 9450Hz(3차 배음) 선이 솟음',
    '히스를 올리고 소리를 들으면 조용한 부분에서 "쉬익" 소리가 들림. 스펙트럼 바닥이 올라감.',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '테이프 에뮬레이션, 변조 지연' },
    { type: 'paper', title: 'Jatin Chowdhury, "Real-Time Physical Modelling for Analog Tape Machines", DAFx-19', year: 2019, note: '테이프 포화(히스테리시스), 헤드 손실, 와우와 플러터 모델' },
    { type: 'article', title: 'IEC 60386, Method of measurement of speed fluctuations in sound recording and reproducing equipment', year: 1972, note: '와우, 플러터 측정 규격 (3150Hz 시험음)' },
    { type: 'book', title: 'John Eargle, Handbook of Recording Engineering, 4th ed., Springer', year: 2003, note: '아날로그 테이프 녹음의 특성' },
  ],
  params: [
    { key: 'tape', label: '테이프 시뮬레이션', type: 'bool', a: false, b: true, group: '테이프' },
    { key: 'wow', label: '와우 깊이 (%)', type: 'range', min: 0, max: 2, step: 0.01, default: 0.4, shared: true },
    { key: 'wowRate', label: '와우 속도 (Hz)', type: 'range', min: 0.2, max: 4, step: 0.05, default: 0.7, shared: true },
    { key: 'flutter', label: '플러터 깊이 (%)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.15, shared: true },
    { key: 'flutRate', label: '플러터 속도 (Hz)', type: 'range', min: 4, max: 25, step: 0.5, default: 9, shared: true },
    { key: 'drive', label: '포화 드라이브 (dB)', type: 'range', min: 0, max: 24, step: 0.5, default: 9, shared: true },
    { key: 'hf', label: '고음 한계 (Hz)', type: 'range', min: 3000, max: 20000, step: 100, default: 9000, shared: true },
    { key: 'hiss', label: '히스 (dB)', type: 'range', min: -90, max: -30, step: 1, default: -52, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'chord', label: '지속 화음' }, { value: 'tone', label: '시험음 3150Hz' }], default: 'chord', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Tape Wow, Flutter and Saturation',
    summary: 'Analog tape motors and rollers do not turn perfectly evenly, so the pitch wobbles slowly (wow) or quickly (flutter), and the magnetic coating saturates and distorts softly. A modulated delay, soft clipping, a filter and noise together imitate this texture.',
    views: { a: 'Clean digital', b: 'Tape simulation' },
    controls: 'Change wow, flutter, saturation and hiss in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>Most of the sound of a tape recorder comes from flaws in the machine and the magnetic coating. Lo-fi music and vintage textures add them on purpose.</p>
    <ul>
      <li><b>Wow</b>: slow speed changes of 0.5 to 4 Hz, from warped reels or motor wobble. The pitch sways like "woo-oong".</li>
      <li><b>Flutter</b>: fast speed changes of 4 to 20 Hz or more, from capstan and roller vibration. The sound trembles and blurs.</li>
      <li>Both are made with a modulated delay. When delay D(t) changes, the pitch becomes 1 - dD/dt times (Doppler). Like real tape, slow random drift is mixed into the sines.</li>
      <li><b>Saturation</b>: the coating cannot be magnetized past a limit, so large signals are pressed down softly. It adds mostly 3rd harmonics. Here tanh approximates it.</li>
      <li><b>Head loss and hiss</b>: the gap of the playback head reduces highs, and random magnetic particles make a hissing noise.</li>
    </ul>
    <p>The measurement standard (IEC 60386) records and plays a 3150 Hz test tone and measures the frequency deviation in %. Good machines are below 0.05%. Cassettes are around 0.1 to 0.3%.</p>`,
    look: [
      'Compare the zoomed 3150 Hz spectra. A is one thin line. B is a skirt spread to both sides.',
      'Raise wow in the pitch deviation graph to get slow large waves. Raise flutter to get fast ripples.',
      'Raise saturation. The 9450 Hz line (3rd harmonic) rises in the full spectrum.',
      'Raise hiss and listen. You hear a "shhh" in quiet parts. The floor of the spectrum rises.',
    ],
    refs: ['Tape emulation and modulated delay.', 'Tape saturation (hysteresis), head loss, wow and flutter models.', 'Standard for measuring wow and flutter (3150 Hz test tone).', 'Characteristics of analog tape recording.'],
    params: {
      tape: { label: 'Tape simulation', group: 'Tape' },
      wow: 'Wow depth (%)',
      wowRate: 'Wow rate (Hz)',
      flutter: 'Flutter depth (%)',
      flutRate: 'Flutter rate (Hz)',
      drive: 'Saturation drive (dB)',
      hf: 'High limit (Hz)',
      hiss: 'Hiss (dB)',
      src: { label: 'Source', group: 'Source', options: { chord: 'Sustained chord', tone: 'Test tone 3150 Hz' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 24000, N = 16384;

    function makeSource(sr, kind) {
      const notes = [57, 61, 64, 69], ph = [0, 0, 0, 0];
      let n = 0, pt = 0;
      return () => {
        n++;
        if ((kind || P.src) === 'tone') { pt = (pt + 3150 / sr) % 1; return Math.sin(TAU * pt) * 0.4; }
        let v = 0;
        for (let i = 0; i < 4; i++) { ph[i] = (ph[i] + A.mtof(notes[i]) / sr) % 1; v += Math.sin(TAU * ph[i]) + 0.3 * Math.sin(2 * TAU * ph[i]) + 0.15 * Math.sin(3 * TAU * ph[i]); }
        return v * 0.1;
      };
    }
    // 속도 편차 (비율, 0.01 = 1%). 사인 + 느린 무작위 흔들림 (시드 고정, 같은 함수로 분석과 소리)
    const drift = (() => { const r = U.rng(31), k = []; for (let i = 0; i < 64; i++) k.push(r.range(-1, 1)); return (t) => { const x = t * 0.9, i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return k[i & 63] * (1 - s) + k[(i + 1) & 63] * s; }; })();
    const speedDev = (t) => (P.wow / 100) * (0.75 * Math.sin(TAU * P.wowRate * t) + 0.25 * drift(t)) + (P.flutter / 100) * (0.8 * Math.sin(TAU * P.flutRate * t) + 0.2 * Math.sin(TAU * P.flutRate * 1.37 * t + 1));

    function makeTape(sr, seed) {
      const size = Math.ceil(sr * 0.2), buf = new Float32Array(size), hiss = A.noiseBuffer(sr * 2, seed, 'pink');
      const lp1 = A.biquad('lowpass', P.hf, 0.707, 0, sr), lp2 = A.biquad('lowpass', P.hf, 0.707, 0, sr);
      let w = 0, n = 0, dl = 0.05 * sr, lastHf = P.hf;
      return (x) => {
        if (!P.tape) return x;
        n++;
        const gd = A.dbToLin(P.drive), s = Math.tanh(x * gd) / Math.tanh(gd * 0.5) * 0.5;
        buf[w] = s;
        // 피치 비율 = 1 + dev → 지연 변화 dD = -dev (샘플)
        dl = U.clamp(dl - speedDev(n / sr) + (0.05 * sr - dl) * 2e-5, 2, size - 4); // 아주 약하게 가운데로 당겨 지연이 한쪽으로 쌓이지 않게 함
        let p = w - dl; while (p < 0) p += size;
        const i0 = Math.floor(p), fr = p - i0, y = buf[i0] + (buf[(i0 + 1) % size] - buf[i0]) * fr;
        w = (w + 1) % size;
        if (lastHf !== P.hf && n % 64 === 0) { lastHf = P.hf; for (const f of [lp1, lp2]) { const q = A.biquad('lowpass', P.hf, 0.707, 0, sr); f.b0 = q.b0; f.b1 = q.b1; f.b2 = q.b2; f.a1 = q.a1; f.a2 = q.a2; } }
        return lp2.process(lp1.process(y)) + hiss[n % hiss.length] * A.dbToLin(P.hiss) * 3;
      };
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeTape(sr, 3) };
        for (let i = 0; i < n; i++) { const v = live.fx(live.src()); l[i] = v; r[i] = v; }
      },
    });

    let key = '', mags = null, wf = 0, h3 = 0;
    function analyze() {
      const k = [P.tape, P.wow, P.wowRate, P.flutter, P.flutRate, P.drive, P.hf, P.hiss].join();
      if (k === key) return;
      key = k;
      const src = makeSource(SRV, 'tone'), fx = makeTape(SRV, 3), warm = 6000, buf = new Float32Array(warm + N);
      for (let i = 0; i < buf.length; i++) buf[i] = fx(src());
      mags = A.spectrum(buf, N, { offset: warm, window: 'blackman' });
      wf = 0;
      if (P.tape) for (let i = 0; i < 2000; i++) wf = Math.max(wf, Math.abs(speedDev(i / 500)) * 100);
      const bin = SRV / N, b1 = Math.round(3150 / bin), b3 = Math.round(9450 / bin);
      let m1 = -200, m3 = -200;
      for (let b = b1 - 40; b <= b1 + 40; b++) m1 = Math.max(m1, mags[b]);
      for (let b = b3 - 40; b <= b3 + 40; b++) m3 = Math.max(m3, mags[b]);
      h3 = m3 - m1;
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = (H - pad * 4) * 0.33, hh3 = H - pad * 4 - h1 - h2;
        // 속도 편차 4초
        D.rect(g, pad, pad, w, h1, 'rgba(0,0,0,0.35)');
        const mid = pad + h1 / 2, rng = 2.5;
        D.line(g, pad, mid, pad + w, mid, C.grid, 1);
        g.beginPath();
        for (let i = 0; i <= w; i++) { const t = 4 * i / w, v = P.tape ? speedDev(t) * 100 : 0, py = mid - U.clamp(v / rng, -1, 1) * (h1 / 2 - 4); i ? g.lineTo(pad + i, py) : g.moveTo(pad + i, py); }
        g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
        D.text(g, GTL.L('음 높이(속도) 편차, 4초, ±2.5%', 'Pitch (speed) deviation, 4 s, ±2.5%'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 3150Hz 확대 (선형 ±200Hz)
        const y2 = pad * 2 + h1, bin = SRV / N, c = Math.round(3150 / bin), span = Math.round(200 / bin);
        D.rect(g, pad, y2, w, h2, 'rgba(0,0,0,0.35)');
        let mx = -200;
        for (let b = c - span; b <= c + span; b++) mx = Math.max(mx, mags[b]);
        for (let b = c - span; b <= c + span; b++) {
          const v = U.clamp((mags[b] - mx + 70) / 70, 0, 1), px = pad + (b - c + span) / (2 * span) * w;
          D.rect(g, px, y2 + h2 * (1 - v), Math.max(1, w / (2 * span)), h2 * v, col);
        }
        D.text(g, GTL.L('시험음 3150Hz 확대 (±200Hz, 위 70dB)', 'Test tone 3150 Hz zoom (±200 Hz, top 70 dB)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 전체 스펙트럼
        const y3 = pad * 3 + h1 + h2;
        A.drawSpectrum(g, mags, SRV, pad, y3, w, hh3, { color: col, fmin: 50, fmax: 12000, minDb: -110, maxDb: 0, label: GTL.L('시험음 출력 전체 스펙트럼', 'Full spectrum of the test tone output') });
        ctx.stat(GTL.L('최대 속도 편차', 'Peak speed deviation'), wf.toFixed(2) + ' %');
        ctx.stat(GTL.L('3차 배음 (시험음 대비)', '3rd harmonic (vs test tone)'), h3 < -100 ? GTL.L('없음', 'None') : h3.toFixed(1) + ' dB');
        ctx.stat(GTL.L('히스', 'Hiss'), P.tape ? P.hiss + ' dB' : GTL.L('없음', 'None'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
