// 무그 래더 필터: 선형 모델 vs tanh 비선형 모델. 강한 공진, 자기 발진, 입력 드라이브에서 차이
GTL.register({
  id: 'ladder-filter',
  title: '무그 래더 필터',
  summary: '원폴 필터 4개를 잇고 출력을 반전해 되먹이면 24dB/oct 공진 로우패스가 됨. 선형 모델은 공진을 올리면 발산하지만, 트랜지스터의 포화를 tanh로 넣은 모델은 진폭이 스스로 제한되어 안정적인 사인파로 자기 발진함.',
  views: { a: '선형 래더', b: 'tanh 비선형 래더' },
  info: `
    <p><b>무그 래더(Moog Ladder)</b>는 트랜지스터 쌍 4단을 사다리처럼 쌓은 아날로그 필터. 디지털로는 원폴 로우패스 4개를 직렬로 잇고, 마지막 출력에 공진 k를 곱해 입력에서 빼는 구조로 흉내 냄.</p>
    <ul>
      <li>각 단은 6dB/oct라 합쳐서 24dB/oct. 컷오프에서 4단의 위상 회전이 180도가 되어 되먹임이 그 주파수를 키움.</li>
      <li>k가 4에 가까우면 컷오프에서 루프 게인이 1이 되어 입력 없이도 사인파를 냄 (<b>자기 발진</b>)</li>
      <li><b>선형 모델</b>: k가 문턱을 넘으면 진폭이 끝없이 커짐(발산). 실제 회로는 그러지 않음.</li>
      <li><b>tanh 모델</b>(Huovilainen): 각 단 입력에 tanh 포화를 넣음. 큰 신호는 눌려서 루프 게인이 줄고, 진폭이 일정한 값에서 멈춤. 드라이브를 올리면 따뜻한 배음 왜곡도 생김.</li>
    </ul>
    <p>공진을 올리면 통과 대역(저음)이 줄어드는 것도 원래 회로의 특징. 되먹임에 단위 지연이 있어서 컷오프가 높을수록 발진 문턱이 4보다 높아짐. 2배 오버샘플링으로 이 오차를 줄임.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="54" class="t-small">x</text>
    <circle cx="44" cy="50" r="12" class="f-dim"/><text x="44" y="54" text-anchor="middle">-</text>
    <line x1="20" y1="50" x2="31" y2="50" class="d-line" marker-end="url(#arr)"/>
    <line x1="56" y1="50" x2="78" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="80" y="34" width="70" height="32" class="f-dim"/><text x="115" y="54" text-anchor="middle" class="t-small">tanh + LP1</text>
    <line x1="150" y1="50" x2="172" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="174" y="34" width="70" height="32" class="f-dim"/><text x="209" y="54" text-anchor="middle" class="t-small">tanh + LP1</text>
    <line x1="244" y1="50" x2="266" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="268" y="34" width="70" height="32" class="f-dim"/><text x="303" y="54" text-anchor="middle" class="t-small">tanh + LP1</text>
    <line x1="338" y1="50" x2="360" y2="50" class="d-line" marker-end="url(#arr)"/>
    <rect x="362" y="34" width="70" height="32" class="f-dim"/><text x="397" y="54" text-anchor="middle" class="t-small">tanh + LP1</text>
    <line x1="432" y1="50" x2="500" y2="50" class="d-line" marker-end="url(#arr)"/><text x="506" y="54" class="t-small">y</text>
    <path d="M470,50 L470,96 L44,96 L44,64" class="d-b" marker-end="url(#arr)"/>
    <text x="260" y="112" text-anchor="middle" class="t-small t-b">${L('공진 k x y (되먹임)', 'resonance k x y (feedback)')}</text>
    <text x="270" y="138" text-anchor="middle" class="t-small t-dim">${L('각 단 6dB/oct, 합쳐서 24dB/oct. tanh가 큰 신호를 눌러 발진 진폭을 제한', 'Each stage 6 dB/oct, 24 dB/oct in total. tanh squashes large signals and limits the oscillation level')}</text>
  </svg>`,
  look: [
    '기본값(공진 4.6)에서 A는 진폭이 폭발해 "발산" 측정값이 계속 늘어남. B는 일정한 크기의 사인파로 자기 발진함.',
    '원본 소리를 "무음"으로 바꾸면 B는 입력 없이 컷오프 주파수의 사인파를 냄. "발진 주파수" 측정값이 컷오프 근처.',
    '공진을 3 아래로 내리고 드라이브를 4로 올리면 A는 모양이 그대로 커지기만 하고, B는 파형이 둥글게 눌려 배음이 생김',
    '"소리 켜기" 후 컷오프를 움직이면 B는 휘파람 같은 공진음이 컷오프를 따라감',
  ],
  refs: [
    { type: 'paper', title: 'Antti Huovilainen, "Non-Linear Digital Implementation of the Moog Ladder Filter", DAFx', year: 2004, note: 'tanh 비선형 래더 모델' },
    { type: 'paper', title: 'Tim Stilson, Julius O. Smith, "Analyzing the Moog VCF with Considerations for Digital Implementation", ICMC', year: 1996, note: '디지털 래더의 공진 문턱과 단위 지연 문제' },
    { type: 'paper', title: 'Robert A. Moog, US Patent 3,475,623 "Electronic High-Pass and Low-Pass Filters Employing the Base to Emitter Diode Resistance of Bipolar Transistors"', year: 1969, note: '원래 래더 회로' },
    { type: 'book', title: 'Vadim Zavalishin, The Art of VA Filter Design', year: 2018, note: '래더 필터의 TPT 구현과 비선형' },
  ],
  params: [
    { key: 'model', label: '모델', type: 'select', group: '필터', options: [{ value: 'linear', label: '선형' }, { value: 'tanh', label: 'tanh 비선형' }], a: 'linear', b: 'tanh' },
    { key: 'fc', label: '컷오프 (Hz)', type: 'range', min: 60, max: 6000, step: 10, default: 700, shared: true },
    { key: 'k', label: '공진 k', type: 'range', min: 0, max: 5.5, step: 0.05, default: 4.6, shared: true, help: '약 4에서 자기 발진 시작. 컷오프가 높을수록 문턱이 조금 높아짐' },
    { key: 'drive', label: '드라이브', type: 'range', min: 0.2, max: 6, step: 0.1, default: 1.5, shared: true, help: '입력 크기. tanh 모델에서 포화 정도' },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'saw', label: '톱니파 베이스' }, { value: 'none', label: '무음 (자기 발진만)' }], default: 'saw', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Moog Ladder Filter',
    summary: 'Chain four one-pole filters and feed the inverted output back, and you get a 24 dB/oct resonant lowpass. The linear model blows up at high resonance, but a model that adds transistor saturation with tanh limits its own level and self oscillates as a stable sine.',
    views: { a: 'Linear ladder', b: 'tanh nonlinear ladder' },
    info: `
    <p>The <b>Moog ladder</b> is an analog filter built from 4 transistor pairs stacked like a ladder. In digital form it is 4 one-pole lowpass filters in series, with the last output multiplied by the resonance k and subtracted from the input.</p>
    <ul>
      <li>Each stage gives 6 dB/oct, so 24 dB/oct in total. At the cutoff the 4 stages turn the phase by 180 degrees, so the feedback boosts that frequency.</li>
      <li>When k gets close to 4, the loop gain at the cutoff reaches 1 and the filter makes a sine with no input (<b>self oscillation</b>).</li>
      <li><b>Linear model</b>: past the threshold the level grows without limit (diverges). The real circuit does not do this.</li>
      <li><b>tanh model</b> (Huovilainen): adds tanh saturation at the input of each stage. Large signals get squashed, the loop gain drops, and the level settles. More drive also adds warm harmonic distortion.</li>
    </ul>
    <p>Losing the passband (bass) as the resonance rises is also part of the original circuit. The feedback has a unit delay, so the higher the cutoff, the more the threshold rises above 4. This sample runs at 2x oversampling to reduce this error.</p>`,
    look: [
      'At the defaults (resonance 4.6), A\'s level explodes and the "Diverged" stat keeps growing. B self oscillates as a sine with a steady level.',
      'Set the source to "Silence". B makes a sine at the cutoff with no input. The "Oscillation frequency" stat is near the cutoff.',
      'Lower the resonance below 3 and raise the drive to 4. A only gets bigger with the same shape, while B gets rounded and gains harmonics.',
      'Press "Sound on" and move the cutoff. In B a whistling resonance follows the cutoff.',
    ],
    refs: ['The tanh nonlinear ladder model.', 'Resonance threshold and the unit delay problem in digital ladders.', 'The original ladder circuit.', 'TPT ladder and nonlinear versions.'],
    params: {
      model: { label: 'Model', group: 'Filter', options: { linear: 'Linear', tanh: 'tanh nonlinear' } },
      fc: 'Cutoff (Hz)',
      k: { label: 'Resonance k', help: 'Self oscillation starts near 4. The higher the cutoff, the higher the threshold' },
      drive: { label: 'Drive', help: 'Input level. How hard the tanh model saturates' },
      src: { label: 'Source', group: 'Sound', options: { saw: 'Saw bass', none: 'Silence (self oscillation only)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 8192, OS = 2, LIMIT = 50;

    // 래더 상태 하나. 2배 오버샘플링(입력은 같은 값을 두 번 넣는 단순 방식)
    function makeLadder() { return { s: [0, 0, 0, 0], blow: 0, kick: true }; }
    function ladder(st, x, sr) {
      const g = 1 - Math.exp(-U.TAU * Math.min(P.fc, sr * 0.45) / (sr * OS)), nl = P.model === 'tanh', s = st.s;
      if (st.kick) { x += 0.02; st.kick = false; } // 무음에서도 발진이 시작되도록 아주 작은 충격
      for (let o = 0; o < OS; o++) {
        const u = P.drive * x - P.k * s[3];
        if (nl) {
          let inp = Math.tanh(u);
          for (let j = 0; j < 4; j++) { const t = Math.tanh(s[j]); s[j] += g * (inp - t); inp = Math.tanh(s[j]); }
        } else {
          let inp = u;
          for (let j = 0; j < 4; j++) { s[j] += g * (inp - s[j]); inp = s[j]; }
        }
      }
      // 선형 모델의 발산 보호: 상한을 넘으면 상태를 지우고 횟수를 셈
      if (!(Math.abs(s[3]) < LIMIT)) { const y = Math.sign(s[3]) * LIMIT || 0; st.s = [0, 0, 0, 0]; st.blow++; st.kick = true; return y; }
      return s[3];
    }
    function makeSource() {
      let ph = 0, t = 0;
      const notes = [33, 33, 45, 33, 36, 31, 43, 33];
      return (sr) => {
        if (P.src === 'none') return 0;
        const pos = t * 5, step = Math.floor(pos), local = pos - step;
        const f = A.mtof(notes[step % notes.length]), dt = f / sr;
        const v = 2 * ph - 1 - A.polyBlep(ph, dt);
        ph += dt; if (ph >= 1) ph -= 1; t += 1 / sr;
        return v * Math.min(1, local * 100) * (1 - 0.3 * local) * 0.5;
      };
    }

    const live = { st: makeLadder(), src: makeSource(), model: P.model };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (live.model !== P.model) { live.st = makeLadder(); live.model = P.model; }
        for (let i = 0; i < n; i++) {
          const y = ladder(live.st, live.src(sr), sr);
          const v = U.clamp(y * (P.model === 'tanh' ? 0.8 : 0.45), -0.7, 0.7); // 선형 모델이 커져도 귀를 보호
          l[i] = v; r[i] = v;
        }
      },
    });

    let key = '', out = null, mags = null, blow = 0, peak = 0, oscF = 0;
    function analyze() {
      const k = [P.model, P.fc, P.k, P.drive, P.src].join();
      if (k === key) return;
      key = k;
      const st = makeLadder(), src = makeSource(), T = N * 2;
      const buf = new Float32Array(T);
      for (let i = 0; i < T; i++) buf[i] = ladder(st, src(SR), SR);
      out = buf.subarray(N);
      blow = st.blow; peak = A.peak(out);
      mags = A.spectrum(out, N, { window: 'blackman' });
      // 발진 주파수: 무음 입력일 때 영점 교차로 측정
      let zc = 0, first = -1, last = -1;
      for (let i = 1; i < N; i++) if (out[i - 1] < 0 && out[i] >= 0) { zc++; if (first < 0) first = i; last = i; }
      oscF = zc > 2 && peak > 1e-3 ? (zc - 1) * SR / (last - first) : 0;
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2;
        const h1 = (H - pad * 3) * 0.45, h2 = H - pad * 3 - h1;
        const cnt = Math.min(N, Math.round(SR * 0.04));
        A.drawWave(g, out, pad, pad, rw, h1, { count: cnt, color: col, amp: 0.9 / Math.max(0.05, Math.min(LIMIT, peak)), label: L('출력 파형 (40ms, 세로 자동 맞춤)', 'Output (40 ms, auto scaled)') });
        const y2 = pad * 2 + h1;
        A.drawSpectrum(g, mags, SR, pad, y2, rw, h2, { color: col, minDb: -100, maxDb: 30, dbStep: 20, label: L('스펙트럼', 'Spectrum') });
        const fx = A.freqX(P.fc, pad, rw, 20, 20000);
        D.line(g, fx, y2, fx, y2 + h2, C.warn, 1);
        D.text(g, L('컷오프', 'Cutoff'), fx + 3, y2 + 16, { size: 10, color: C.warn });
        ctx.stat(L('최대 출력', 'Max output'), peak >= LIMIT ? L('상한 도달', 'Hit the limit') : peak.toFixed(2));
        ctx.stat(L('발산 (0.34초 동안)', 'Diverged (in 0.34 s)'), blow + L('회', ' times'));
        ctx.stat(L('발진 주파수', 'Oscillation frequency'), P.src === 'none' && oscF ? Math.round(oscF) + ' Hz' : '-');
        ctx.stat(L('설정 컷오프', 'Set cutoff'), Math.round(P.fc) + ' Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
