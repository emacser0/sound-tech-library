// 대역 제한 오실레이터: 단순 톱니파 vs PolyBLEP 톱니파. 소리 샘플의 참조 구현 (실시간 합성 + 파형 + 스펙트럼)
GTL.register({
  id: 'polyblep-oscillator',
  title: '대역 제한 오실레이터 (PolyBLEP)',
  summary: '톱니파를 그대로 계산하면 나이퀴스트 위의 배음이 아래로 접혀 들어와 음과 상관없는 잡음이 생김. PolyBLEP은 불연속점 근처만 다듬어 이 에일리어싱을 크게 줄임.',
  views: { a: '단순 톱니파', b: 'PolyBLEP 톱니파' },
  controls: '파라미터 표에서 음 높이를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 음이 들림.',
  info: `
    <p><b>톱니파</b>는 배음을 모두 가진 밝은 파형이라 감산 합성의 기본 재료. 하지만 수식대로 계산하면 순간적으로 뛰는 부분(불연속점) 때문에 배음이 끝없이 이어짐.</p>
    <p>디지털 오디오는 샘플레이트의 절반(나이퀴스트 주파수)보다 높은 주파수를 표현하지 못함. 넘친 배음은 거울에 비친 것처럼 아래로 접혀 들어옴. 이것이 <b>에일리어싱(Aliasing)</b>. 음 높이와 맞지 않는 주파수라 높은 음에서 쇳소리, 휘파람 같은 잡음으로 들림.</p>
    <ul>
      <li><b>단순 방식</b>: <code>2(p - 0.5)</code>. 계산은 가장 싸지만 높은 음에서 에일리어싱이 심함.</li>
      <li><b>PolyBLEP</b>: 불연속점 앞뒤 한 샘플씩만 2차 다항식으로 보정. 계산이 싸고 대부분의 에일리어싱을 없앰.</li>
      <li>더 좋은 방법: BLIT, minBLEP, 웨이브테이블 밉맵, 오버샘플링. 비용이 더 큼.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('주파수 축', 'Frequency axis')}</text>
    <line x1="20" y1="120" x2="520" y2="120" class="d-line"/>
    <line x1="340" y1="30" x2="340" y2="130" class="d-dim" stroke-dasharray="4 3"/>
    <text x="340" y="146" text-anchor="middle" class="t-small">${L('나이퀴스트 (sr/2)', 'Nyquist (sr/2)')}</text>
    <line x1="80" y1="120" x2="80" y2="40" class="d-b"/><line x1="160" y1="120" x2="160" y2="70" class="d-b"/>
    <line x1="240" y1="120" x2="240" y2="88" class="d-b"/><line x1="320" y1="120" x2="320" y2="98" class="d-b"/>
    <line x1="400" y1="120" x2="400" y2="104" class="d-a" stroke-dasharray="3 2"/><line x1="480" y1="120" x2="480" y2="108" class="d-a" stroke-dasharray="3 2"/>
    <line x1="280" y1="120" x2="280" y2="104" class="d-a"/><line x1="200" y1="120" x2="200" y2="108" class="d-a"/>
    <path d="M400,100 Q340,60 282,100" class="d-a" fill="none"/><path d="M480,104 Q340,40 202,104" class="d-a" fill="none"/>
    <text x="80" y="34" text-anchor="middle" class="t-small t-b">${L('기음', 'fundamental')}</text>
    <text x="440" y="96" text-anchor="middle" class="t-small t-a">${L('넘친 배음', 'too-high harmonics')}</text>
    <text x="240" y="162" text-anchor="middle" class="t-small t-a">${L('접혀 들어온 잡음 (음과 무관한 주파수)', 'folded noise (unrelated to the pitch)')}</text>
  </svg>`,
  look: [
    '음 높이를 C7 근처로 올리면 A의 스펙트럼에서 배음 사이에 잡음 기둥이 많이 생김. B는 거의 없음.',
    '"소리 켜기"를 누르고 음 높이를 천천히 올리면 A에서 음과 반대로 내려가는 휘파람 소리가 들림',
    '"에일리어싱 잡음" 측정값을 비교하면 높은 음에서 B가 20dB 이상 낮음',
    '음 높이를 C2 근처로 내리면 두 뷰의 차이가 거의 사라짐 (배음이 나이퀴스트 전에 충분히 작아짐)',
  ],
  refs: [
    { type: 'paper', title: 'Välimäki, Huovilainen, "Antialiasing Oscillators in Subtractive Synthesis", IEEE Signal Processing Magazine', year: 2007, note: 'PolyBLEP을 포함한 대역 제한 오실레이터 정리' },
    { type: 'paper', title: 'Stilson, Smith, "Alias-Free Digital Synthesis of Classic Analog Waveforms", ICMC', year: 1996, url: 'https://ccrma.stanford.edu/~stilti/papers/blit.pdf', note: 'BLIT 방식' },
    { type: 'article', title: 'Martin Finke, "Making Audio Plugins Part 18: PolyBLEP Oscillator"', url: 'https://www.martin-finke.de/articles/audio-plugins-018-polyblep-oscillator/', note: 'PolyBLEP 코드 설명' },
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '오실레이터 에일리어싱과 대처법' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'naive', label: '단순' }, { value: 'blep', label: 'PolyBLEP' }], a: 'naive', b: 'blep', group: '오실레이터' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 36, max: 108, default: 96, shared: true, help: '60 = C4 (가운데 도)' },
    { key: 'shape', label: '파형', type: 'select', options: [{ value: 'saw', label: '톱니파' }, { value: 'square', label: '사각파' }], default: 'saw', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Band-Limited Oscillator (PolyBLEP)',
    summary: 'A saw wave computed straight from the formula has harmonics above Nyquist. They fold back down and add noise that has nothing to do with the note. PolyBLEP smooths only the samples near the jump and removes most of this aliasing.',
    views: { a: 'Naive saw', b: 'PolyBLEP saw' },
    controls: 'Change the pitch in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>A <b>saw wave</b> has every harmonic, so it is the basic material of subtractive synthesis. But if you compute it straight from the formula, the sudden jump (discontinuity) makes the harmonics go on forever.</p>
    <p>Digital audio cannot hold frequencies above half the sample rate (the Nyquist frequency). Harmonics above it fold back down like a mirror image. This is <b>aliasing</b>. These frequencies do not match the pitch, so high notes get a metallic, whistling noise.</p>
    <ul>
      <li><b>Naive</b>: <code>2(p - 0.5)</code>. Cheapest, but strong aliasing on high notes.</li>
      <li><b>PolyBLEP</b>: corrects only one sample on each side of the jump with a 2nd order polynomial. Cheap, and removes most aliasing.</li>
      <li>Better methods: BLIT, minBLEP, wavetable mipmaps, oversampling. They cost more.</li>
    </ul>`,
    look: [
      'Raise the pitch to around C7. A\'s spectrum gets many noise peaks between the harmonics. B has almost none.',
      'Press "Sound on" and slowly raise the pitch. In A you hear whistles that move down while the note moves up.',
      'Compare the "Aliasing noise" stat. On high notes B is more than 20 dB lower.',
      'Lower the pitch to around C2. The two views look almost the same (harmonics are already small before Nyquist).',
    ],
    refs: ['Overview of band-limited oscillators, including PolyBLEP.', 'The BLIT method.', 'PolyBLEP code walkthrough.', 'Oscillator aliasing and fixes.'],
    params: {
      method: { label: 'Method', group: 'Oscillator', options: { naive: 'Naive' } },
      note: { label: 'Pitch (MIDI)', help: '60 = C4 (middle C)' },
      shape: { label: 'Waveform', options: { saw: 'Saw', square: 'Square' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 4096;

    // 한 샘플 생성. st: { ph }
    function osc(st, f, sr) {
      const dt = f / sr;
      let v;
      if (P.shape === 'saw') {
        v = 2 * st.ph - 1;
        if (P.method === 'blep') v -= A.polyBlep(st.ph, dt);
      } else {
        v = st.ph < 0.5 ? 1 : -1;
        if (P.method === 'blep') { v += A.polyBlep(st.ph, dt); v -= A.polyBlep((st.ph + 0.5) % 1, dt); }
      }
      st.ph += dt; if (st.ph >= 1) st.ph -= 1;
      return v;
    }

    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f = A.mtof(P.note);
        for (let i = 0; i < n; i++) { const v = osc(live, f, sr) * 0.3; l[i] = v; r[i] = v; }
      },
    });
    const live = { ph: 0 };

    // 분석용 버퍼와 스펙트럼 (파라미터가 바뀔 때만 다시 계산)
    let key = '', buf = null, mags = null, alias = 0;
    function analyze() {
      const k = P.method + P.shape + P.note;
      if (k === key) return;
      key = k;
      const st = { ph: 0 }, f = A.mtof(P.note);
      buf = A.render(N, SR, () => osc(st, f, SR));
      mags = A.spectrum(buf, N, { window: 'blackman' });
      // 배음 위치(±3 bin)를 뺀 나머지 bin의 최대값 = 에일리어싱 잡음
      const binHz = SR / N;
      alias = -200;
      for (let b = 2; b < N / 2; b++) {
        const fr = b * binHz, h = fr / f, near = Math.abs(h - Math.round(h)) * f < 3 * binHz;
        if (!near && mags[b] > alias) alias = mags[b];
      }
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, f = A.mtof(P.note);
        const pad = 10, wh = Math.max(50, H * 0.3);
        // 파형: 4주기
        const per = SR / f, cnt = Math.min(N, Math.max(16, Math.round(per * 4)));
        A.drawWave(g, buf, pad, pad, W - pad * 2, wh, { count: cnt, color: col, dots: cnt < 80, amp: 0.85, label: GTL.L('파형 (4주기)', 'Waveform (4 cycles)') });
        // 스펙트럼
        const sy = pad * 2 + wh, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, W - pad * 2, sh, { color: col, minDb: -100, maxDb: 0, label: GTL.L('스펙트럼', 'Spectrum') });
        // 배음 위치 표시
        for (let h = 1; h * f < SR / 2 && h <= 40; h++) {
          const px = A.freqX(h * f, pad, W - pad * 2, 20, 20000);
          D.line(g, px, sy + sh - 4, px, sy + sh, C.good, 2);
        }
        D.text(g, GTL.L('초록 눈금 = 배음 위치. 그 사이의 기둥 = 에일리어싱', 'Green ticks = harmonic positions. Peaks between them = aliasing'), pad + 4, sy + 16, { size: 10, color: C.dim });
        ctx.stat(GTL.L('음', 'Note'), `${A.noteName(P.note)} (${f.toFixed(1)} Hz)`);
        ctx.stat(GTL.L('나이퀴스트 아래 배음 수', 'Harmonics below Nyquist'), Math.floor(SR / 2 / f));
        ctx.stat(GTL.L('에일리어싱 잡음 (최대)', 'Aliasing noise (max)'), alias.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
