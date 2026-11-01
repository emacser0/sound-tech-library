// 펄스 폭 변조: 펄스파의 폭에 따라 빠지는 배음이 정해짐. 폭을 LFO로 움직이면 코러스처럼 넓어짐
GTL.register({
  id: 'pulse-width-modulation',
  title: '펄스 폭 변조 (PWM)',
  summary: '펄스파는 폭(듀티비)에 따라 특정 배음이 사라져 음색이 바뀜. 폭을 LFO로 천천히 움직이면(PWM) 빠지는 배음이 계속 이동해 오실레이터 여러 개를 겹친 것처럼 두꺼운 소리가 됨.',
  views: { a: '고정 폭', b: 'PWM (LFO로 폭 변조)' },
  controls: '파라미터 표에서 폭, PWM 깊이, 속도를 바꿈. "소리 켜기"를 누르면 같은 음이 계속 울림.',
  info: `
    <p><b>펄스파(Pulse Wave)</b>는 한 주기 중 w(폭) 동안 높고 나머지는 낮은 파형. w = 50%가 사각파. n번째 배음의 크기는 <code>|sin(&pi; n w)| / n</code>이라서, n w가 정수인 배음이 0이 됨.</p>
    <ul>
      <li>w = 50%: 짝수 배음이 모두 빠짐 (클라리넷처럼 속이 빈 소리)</li>
      <li>w = 25%: 4, 8, 12번째 배음이 빠짐</li>
      <li>w = 10%: 10번째마다 빠지고 얇고 코맹맹이 소리</li>
    </ul>
    <p><b>PWM</b>은 폭을 LFO로 흔듦. 빠지는 배음 위치가 계속 움직여 스펙트럼에 빗살 무늬가 흐르고, 이것이 코러스와 비슷한 움직임으로 들림. Juno-106 같은 아날로그 신시사이저의 패드 소리가 대표 예시.</p>
    <p>여기서는 대역 제한 톱니파(PolyBLEP) 두 개를 w만큼 어긋나게 해서 빼는 방식으로 펄스파를 만듦. 이 방식은 DC가 생기지 않고 에일리어싱도 적음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20,40 20,30 60,30 60,110 180,110 180,30 220,30 220,110 340,110" class="d-a"/>
    <text x="40" y="22" text-anchor="middle" class="t-small">w</text>
    <text x="180" y="132" text-anchor="middle" class="t-small t-dim">${L('주기 T', 'period T')}</text>
    <line x1="20" y1="122" x2="180" y2="122" class="d-dim"/>
    <text x="360" y="40" class="t-small">${L('배음 크기 = |sin(pi n w)| / n', 'harmonic level = |sin(pi n w)| / n')}</text>
    <line x1="370" y1="120" x2="520" y2="120" class="d-line"/>
    <line x1="380" y1="120" x2="380" y2="62" class="d-b"/><line x1="400" y1="120" x2="400" y2="82" class="d-b"/><line x1="420" y1="120" x2="420" y2="98" class="d-b"/>
    <line x1="440" y1="120" x2="440" y2="118" class="d-dim"/><line x1="460" y1="120" x2="460" y2="106" class="d-b"/><line x1="480" y1="120" x2="480" y2="108" class="d-b"/><line x1="500" y1="120" x2="500" y2="112" class="d-b"/>
    <text x="440" y="136" text-anchor="middle" class="t-small t-a">${L('4번째 = 0 (w = 25%)', '4th = 0 (w = 25%)')}</text>
  </svg>`,
  look: [
    '스펙트럼에서 A는 빨간 점(빠지는 배음)이 고정되어 있고, B는 빨간 점이 좌우로 계속 움직임',
    '"소리 켜기"를 누르고 B를 들으면 소리가 천천히 넘실거리며 두꺼워짐. A는 정지된 소리.',
    '폭을 50%로 맞추면 짝수 배음이 모두 사라지고 속이 빈 사각파 소리가 남',
    'PWM 속도를 6Hz 이상으로 올리면 넘실거림이 빨라져 비브라토처럼 떨리는 소리가 됨',
  ],
  refs: [
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '펄스파와 PWM, 톱니파 두 개로 펄스파 만들기' },
    { type: 'paper', title: 'Vesa Välimäki, Antti Huovilainen, "Antialiasing Oscillators in Subtractive Synthesis", IEEE Signal Processing Magazine', year: 2007, note: '대역 제한 펄스파' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '펄스파 스펙트럼' },
  ],
  params: [
    { key: 'pwm', label: 'PWM (LFO)', type: 'bool', a: false, b: true, group: '펄스' },
    { key: 'width', label: '폭 (%)', type: 'range', min: 5, max: 50, step: 0.5, default: 25, shared: true, help: 'PWM이 켜져 있으면 가운데 값' },
    { key: 'depth', label: 'PWM 깊이 (%)', type: 'range', min: 0, max: 40, step: 0.5, default: 18, shared: true, when: (p) => p.pwm },
    { key: 'rate', label: 'PWM 속도 (Hz)', type: 'range', min: 0.05, max: 10, step: 0.05, default: 0.6, shared: true, when: (p) => p.pwm },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 33, max: 84, default: 45, shared: true, group: '음', help: '60 = C4 (가운데 도)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Pulse Width Modulation (PWM)',
    summary: 'A pulse wave loses certain harmonics depending on its width (duty cycle), which changes its tone. Moving the width slowly with an LFO (PWM) keeps moving the missing harmonics, so it sounds thick, like several oscillators stacked.',
    views: { a: 'Fixed width', b: 'PWM (LFO on width)' },
    controls: 'Change width, PWM depth and rate in the parameter table. Press "Sound on" to hear a held note.',
    info: `
    <p>A <b>pulse wave</b> is high for a fraction w (the width) of each cycle and low for the rest. w = 50% is a square wave. The n-th harmonic has level <code>|sin(&pi; n w)| / n</code>, so harmonics where n w is a whole number become 0.</p>
    <ul>
      <li>w = 50%: all even harmonics are missing (a hollow sound like a clarinet).</li>
      <li>w = 25%: harmonics 4, 8, 12 are missing.</li>
      <li>w = 10%: every 10th is missing, and the sound is thin and nasal.</li>
    </ul>
    <p><b>PWM</b> moves the width with an LFO. The missing harmonics keep moving, a comb pattern flows through the spectrum, and you hear a motion similar to chorus. Pad sounds on analog synths such as the Juno-106 are the classic example.</p>
    <p>Here the pulse wave is made by subtracting two band-limited saw waves (PolyBLEP) offset by w. This has no DC offset and little aliasing.</p>`,
    look: [
      'In the spectrum, A\'s red dots (missing harmonics) stay still. In B they keep moving left and right.',
      'Press "Sound on" and listen to B. The sound slowly swirls and gets thicker. A is static.',
      'Set width to 50%. All even harmonics disappear and you hear a hollow square wave.',
      'Raise the PWM rate above 6 Hz. The swirl gets fast and sounds like vibrato.',
    ],
    refs: ['Pulse waves, PWM, and building a pulse from two saws.', 'Band-limited pulse waves.', 'Pulse wave spectrum.'],
    params: {
      pwm: { label: 'PWM (LFO)', group: 'Pulse' },
      width: { label: 'Width (%)', help: 'Center value when PWM is on' },
      depth: 'PWM depth (%)', rate: 'PWM rate (Hz)',
      note: { label: 'Pitch (MIDI)', group: 'Note', help: '60 = C4 (middle C)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    const widthAt = (t) => U.clamp((P.width + (P.pwm ? P.depth * Math.sin(TAU * P.rate * t) : 0)) / 100, 0.02, 0.98);

    const live = { n: 0, ph: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f = A.mtof(P.note), dt = f / sr;
        for (let i = 0; i < n; i++) {
          const w = widthAt(live.n++ / sr), p2 = (live.ph + w) % 1;
          const s1 = 2 * live.ph - 1 - A.polyBlep(live.ph, dt), s2 = 2 * p2 - 1 - A.polyBlep(p2, dt);
          const o = (s1 - s2) * 0.25;
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          l[i] = o; r[i] = o;
        }
      },
    });

    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const t = snd.on ? live.n / (snd.sr || 48000) : visT, w = widthAt(t);
        // 1) 파형 2주기
        const h1 = Math.max(50, (H - pad * 4) * 0.3), N = 400, wave = new Float32Array(N);
        for (let i = 0; i < N; i++) { const p = (i / N * 2) % 1; wave[i] = p < w ? 0.8 : -0.8; }
        A.drawWave(g, wave, pad, pad, W - pad * 2, h1, { color: col, label: Lx(`파형 2주기 (폭 ${(w * 100).toFixed(1)}%)`, `Waveform, 2 cycles (width ${(w * 100).toFixed(1)}%)`) });
        // 2) 배음 스펙트럼 (이론값, 1~40번)
        const y2 = pad * 2 + h1, h2 = (H - pad * 4) * 0.45, NH = 40, bw = (W - pad * 2) / NH;
        D.rect(g, pad, y2, W - pad * 2, h2, 'rgba(0,0,0,0.35)');
        const missing = [];
        for (let n = 1; n <= NH; n++) {
          const a = Math.abs(Math.sin(Math.PI * n * w)) / n * 2 / Math.PI * 2, db = A.linToDb(a);
          const bh = U.clamp((db + 50) / 50, 0, 1) * (h2 - 16), x = pad + (n - 0.5) * bw;
          D.line(g, x, y2 + h2, x, y2 + h2 - bh, col, Math.max(1.5, bw * 0.5));
          if (db < -30) { D.circle(g, x, y2 + h2 - 4, 3, C.bad); missing.push(n); }
        }
        D.text(g, Lx('배음 1~40 (dB). 빨간 점 = 거의 빠진 배음', 'Harmonics 1 to 40 (dB). Red dot = nearly missing'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 3) 폭의 시간 변화 (최근 4초)
        const y3 = y2 + h2 + pad, h3 = H - y3 - pad;
        D.rect(g, pad, y3, W - pad * 2, h3, 'rgba(0,0,0,0.35)');
        g.beginPath();
        for (let i = 0; i <= 200; i++) { const tt = t - 4 + i / 200 * 4, ww = widthAt(tt); const px = pad + i / 200 * (W - pad * 2), py = y3 + h3 - ww / 0.5 * (h3 - 4); i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, Lx('폭의 변화 (최근 4초, 위 = 50%)', 'Width over time (last 4 s, top = 50%)'), pad + 4, y3 + 3, { size: 10, color: C.dim });
        ctx.stat(Lx('현재 폭', 'Current width'), (w * 100).toFixed(1) + '%');
        ctx.stat(Lx('빠진 배음', 'Missing harmonics'), missing.length ? missing.slice(0, 5).join(', ') + (missing.length > 5 ? ' ...' : '') : '-');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
