// 바이노럴 비트: 두 귀에 조금 다른 주파수를 따로 들려주면 소리에는 없는 맥놀이가 뇌에서 생김
GTL.register({
  id: 'binaural-beats',
  title: '모노 맥놀이와 바이노럴 비트',
  summary: '두 주파수를 섞어 양쪽 귀에 보내면(A) 공기 중에서 진폭이 출렁이는 실제 맥놀이가 생김. 왼쪽, 오른쪽 귀에 따로 보내면(B) 각 귀의 파형은 평평한데도 뇌가 두 귀의 위상 차를 비교해 맥놀이를 느낌.',
  views: { a: '모노 맥놀이', b: '바이노럴 비트' },
  controls: '헤드폰으로 들어야 함. 파라미터 표에서 기준 주파수와 맥놀이 주파수를 바꿈.',
  info: `
    <p><b>모노 맥놀이(Monaural beat)</b>: 주파수가 조금 다른 두 사인파를 더하면 <code>sin a + sin b = 2 cos((a-b)/2) sin((a+b)/2)</code>라서 진폭이 차이 주파수로 출렁임. 귀에 들어가기 전에 이미 소리에 있는 물리 현상.</p>
    <p><b>바이노럴 비트(Binaural beat)</b>: 한 주파수는 왼쪽 귀에만, 다른 주파수는 오른쪽 귀에만 보내면 각 귀의 소리는 진폭이 일정함. 그런데 뇌간의 상올리브핵이 두 귀의 위상 차를 비교하고, 이 차가 계속 돌기 때문에 맥놀이 같은 출렁임이나 소리가 머리 안에서 도는 느낌이 생김.</p>
    <ul>
      <li>기준 주파수가 약 1000~1500 Hz를 넘으면 잘 안 느껴짐. 귀가 높은 주파수의 위상을 따라가지 못하기 때문.</li>
      <li>차이가 약 30 Hz를 넘으면 맥놀이보다 두 음으로 들림</li>
      <li>모노 맥놀이보다 훨씬 약하게 느껴짐</li>
      <li>스피커로 들으면 두 소리가 공기 중에서 섞여 모노 맥놀이가 되어 버림. 헤드폰 필수.</li>
    </ul>
    <p>"뇌파를 동조시켜 집중력이나 수면을 돕는다"는 주장은 연구 결과가 엇갈려 근거가 약함. 이 샘플은 지각 현상만 보여 줌.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-a">${L('A 모노: 섞은 뒤 두 귀로', 'A mono: mix, then both ears')}</text>
    <rect x="10" y="30" width="60" height="22" class="f-dim"/><text x="40" y="45" text-anchor="middle" class="t-small">400 Hz</text>
    <rect x="10" y="62" width="60" height="22" class="f-dim"/><text x="40" y="77" text-anchor="middle" class="t-small">404 Hz</text>
    <circle cx="110" cy="57" r="12" class="d-a"/><text x="110" y="61" text-anchor="middle">+</text>
    <line x1="70" y1="41" x2="98" y2="52" class="d-dim"/><line x1="70" y1="73" x2="98" y2="62" class="d-dim"/>
    <path d="M125,57 L150,40 M125,57 L150,74" class="d-dim"/>
    <text x="158" y="44" class="t-small">${L('왼쪽 귀: 출렁임', 'Left: swells')}</text><text x="158" y="78" class="t-small">${L('오른쪽 귀: 출렁임', 'Right: swells')}</text>
    <text x="290" y="16" class="t-small t-b">${L('B 바이노럴: 귀마다 따로', 'B binaural: one per ear')}</text>
    <rect x="290" y="30" width="60" height="22" class="f-dim"/><text x="320" y="45" text-anchor="middle" class="t-small">400 Hz</text>
    <rect x="290" y="62" width="60" height="22" class="f-dim"/><text x="320" y="77" text-anchor="middle" class="t-small">404 Hz</text>
    <line x1="350" y1="41" x2="380" y2="41" class="d-dim"/><line x1="350" y1="73" x2="380" y2="73" class="d-dim"/>
    <text x="386" y="44" class="t-small">${L('왼쪽 귀: 평평함', 'Left: flat')}</text><text x="386" y="78" class="t-small">${L('오른쪽 귀: 평평함', 'Right: flat')}</text>
    <path d="M460,48 Q500,57 460,68" class="d-b"/>
    <text x="400" y="110" text-anchor="middle" class="t-small t-b">${L('뇌간이 위상 차를 비교 → 4 Hz 출렁임을 느낌', 'Brainstem compares phase → feels a 4 Hz beat')}</text>
    <text x="270" y="150" text-anchor="middle" class="t-small t-dim">${L('A의 맥놀이는 소리 자체에 있고, B의 맥놀이는 지각에서만 생김', "A's beat is in the sound. B's beat exists only in perception")}</text>
  </svg>`,
  look: [
    'A의 왼쪽, 오른쪽 파형은 1초에 4번 부풀었다 줄어듦. B는 두 파형 모두 진폭이 평평함.',
    'B의 위상 차 원은 바늘이 1초에 4바퀴 돎. 이 회전이 바이노럴 비트의 원인.',
    '헤드폰을 끼고 "소리 켜기"를 누르면 A는 뚜렷한 "웅웅웅", B는 약하게 출렁이거나 머리 안에서 소리가 도는 느낌',
    'B의 기준 주파수를 1500 Hz로 올리면 출렁임 느낌이 거의 사라짐 (위상 추적 한계)',
  ],
  refs: [
    { type: 'paper', title: 'Oster, "Auditory beats in the brain", Scientific American 229(4)', year: 1973, note: '바이노럴 비트를 널리 알린 글' },
    { type: 'paper', title: 'Licklider, Webster, Hedlun, "On the frequency limits of binaural beats", JASA 22(4)', year: 1950, note: '바이노럴 비트가 느껴지는 주파수 범위' },
    { type: 'book', title: 'Brian C. J. Moore, An Introduction to the Psychology of Hearing (6th ed.)', year: 2012, note: '두 귀 위상 차와 위상 고정의 한계' },
    { type: 'book', title: 'Fletcher, Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '맥놀이의 물리' },
  ],
  params: [
    { key: 'mode', label: '전달 방식', type: 'select', options: [{ value: 'mono', label: '모노 (섞어서 두 귀로)' }, { value: 'bin', label: '바이노럴 (귀마다 따로)' }], a: 'mono', b: 'bin', default: 'mono', group: '신호' },
    { key: 'carrier', label: '기준 주파수 (Hz)', type: 'range', min: 100, max: 1500, step: 10, default: 400, shared: true },
    { key: 'beat', label: '맥놀이 주파수 (Hz)', type: 'range', min: 0.5, max: 40, step: 0.5, default: 4, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Monaural Beats vs Binaural Beats',
    summary: 'Mix two frequencies and send the mix to both ears (A): the amplitude swells in the air, a real beat. Send one to the left ear and one to the right (B): each ear\'s waveform is flat, yet the brain compares the phase between the ears and feels a beat.',
    views: { a: 'Monaural beat', b: 'Binaural beat' },
    controls: 'Use headphones. Change the carrier and beat frequency in the parameter table.',
    info: `
    <p><b>Monaural beat</b>: add two sines with slightly different frequencies. Since <code>sin a + sin b = 2 cos((a-b)/2) sin((a+b)/2)</code>, the amplitude swells at the difference frequency. It is physics: the beat is in the sound before it reaches the ear.</p>
    <p><b>Binaural beat</b>: send one frequency only to the left ear and the other only to the right. Each ear gets a steady amplitude. But the superior olive in the brainstem compares the phase of the two ears. The phase difference keeps rotating, so you feel a beat-like swell or a sound circling inside your head.</p>
    <ul>
      <li>Above a carrier of about 1000~1500 Hz it is hard to feel, because the ear cannot follow the phase of high frequencies.</li>
      <li>With a difference above about 30 Hz you hear two tones instead of a beat.</li>
      <li>It feels much weaker than a monaural beat.</li>
      <li>On speakers the two sounds mix in the air and become a monaural beat. Headphones are required.</li>
    </ul>
    <p>Claims that it "entrains brain waves to help focus or sleep" have mixed research results and weak evidence. This sample only shows the perception effect.</p>`,
    look: [
      'In A, the left and right waveforms swell and shrink 4 times per second. In B both waveforms have a flat amplitude.',
      'B\'s phase difference circle turns 4 times per second. This rotation causes the binaural beat.',
      'Put on headphones and press "Sound on". A gives a clear "wow-wow-wow". B swells faintly, or the sound seems to circle inside your head.',
      'Raise B\'s carrier to 1500 Hz. The swell almost disappears (limit of phase tracking).',
    ],
    refs: ['The article that made binaural beats widely known.', 'Frequency range where binaural beats are felt.', 'Interaural phase and the limits of phase locking.', 'The physics of beats.'],
    params: {
      mode: { label: 'Delivery', group: 'Signal', options: { mono: 'Mono (mixed to both ears)', bin: 'Binaural (one per ear)' } },
      carrier: 'Carrier frequency (Hz)',
      beat: 'Beat frequency (Hz)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 8000, N = SR; // 그림용 1초 (저해상도로 충분)
    let key = '', bl = null, br = null, depthL = 0, depthR = 0;
    function analyze() {
      const k = P.mode + '|' + P.carrier + '|' + P.beat;
      if (k === key) return;
      key = k;
      bl = new Float32Array(N); br = new Float32Array(N);
      const f1 = P.carrier, f2 = P.carrier + P.beat;
      for (let i = 0; i < N; i++) {
        const t = i / SR, s1 = Math.sin(2 * Math.PI * f1 * t), s2 = Math.sin(2 * Math.PI * f2 * t);
        if (P.mode === 'mono') { bl[i] = 0.5 * (s1 + s2); br[i] = bl[i]; } else { bl[i] = s1; br[i] = s2; }
      }
      // 엔벨로프 변조 깊이 (해석적으로): 모노는 100%, 바이노럴은 0%
      depthL = depthR = P.mode === 'mono' ? 100 : 0;
    }

    let p1 = 0, p2 = 0, tt = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f1 = P.carrier, f2 = P.carrier + P.beat;
        for (let i = 0; i < n; i++) {
          const s1 = Math.sin(p1), s2 = Math.sin(p2);
          if (P.mode === 'mono') { const v = 0.22 * (s1 + s2); l[i] = v; r[i] = v; } else { l[i] = 0.3 * s1; r[i] = 0.3 * s2; }
          p1 += 2 * Math.PI * f1 / sr; if (p1 > 6.283185307) p1 -= 6.283185307;
          p2 += 2 * Math.PI * f2 / sr; if (p2 > 6.283185307) p2 -= 6.283185307;
          tt += 1 / sr;
        }
      },
    });
    let vt = 0;

    return {
      update(dt) { snd.update(); vt += dt; },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const ww = W - pad * 3 - Math.min(140, W * 0.3), wh = (H - pad * 3) / 2;
        A.drawWave(g, bl, pad, pad, ww, wh, { color: col, amp: 0.95, label: L('왼쪽 귀 (1초)', 'Left ear (1 s)') });
        A.drawWave(g, br, pad, pad * 2 + wh, ww, wh, { color: col, amp: 0.95, label: L('오른쪽 귀 (1초)', 'Right ear (1 s)') });
        // 위상 차 원
        const now = snd.on ? tt : vt;
        const cx = pad * 2 + ww + (W - pad * 3 - ww) / 2, cy = H / 2, rad = Math.max(12, Math.min((W - pad * 3 - ww) / 2 - 6, H / 4));
        D.circle(g, cx, cy, rad, 'rgba(0,0,0,0.35)', C.dim, 1);
        D.text(g, L('두 귀 위상 차', 'Interaural phase'), cx, cy - rad - 16, { size: 10, align: 'center', color: C.dim });
        if (P.mode === 'bin') {
          const a = -Math.PI / 2 + 2 * Math.PI * P.beat * now;
          D.line(g, cx, cy, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, col, 2.5);
          D.circle(g, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 4, col);
          D.text(g, L(`초당 ${P.beat}바퀴`, `${P.beat} turns/s`), cx, cy + rad + 6, { size: 10, align: 'center', color: col });
        } else {
          D.line(g, cx, cy, cx, cy - rad, col, 2.5);
          D.text(g, L('항상 0 (같은 소리)', 'Always 0 (same sound)'), cx, cy + rad + 6, { size: 10, align: 'center', color: col });
        }
        ctx.stat(L('두 주파수', 'Frequencies'), `${P.carrier} Hz, ${(P.carrier + P.beat).toFixed(1)} Hz`);
        ctx.stat(L('맥놀이 주파수', 'Beat rate'), P.beat + ' Hz');
        ctx.stat(L('귀마다 진폭 변조 깊이', 'Amplitude modulation per ear'), `L ${depthL}%, R ${depthR}%`);
        ctx.stat(L('맥놀이가 있는 곳', 'Where the beat is'), P.mode === 'mono' ? L('소리 자체 (물리)', 'in the sound (physics)') : L('뇌 (지각)', 'in the brain (perception)'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
