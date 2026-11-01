// 바이쿼드 필터 종류: RBJ Cookbook의 8가지 응답을 같은 소리에 걸어 비교 (응답 곡선 + 위상 + 출력 스펙트럼)
GTL.register({
  id: 'biquad-types',
  title: '바이쿼드 필터 종류',
  summary: '같은 2차 필터(바이쿼드) 구조에 계수만 바꾸면 로우패스, 하이패스, 밴드패스, 노치, 셸프, 피킹이 됨. 두 뷰에 다른 종류를 걸고 응답 곡선과 소리를 비교.',
  views: { a: '로우패스', b: '하이패스' },
  controls: '파라미터 표에서 필터 종류, 주파수, Q, 게인을 바꿈. "소리 켜기"로 소리 내는 뷰의 출력을 들음.',
  info: `
    <p><b>바이쿼드(Biquad)</b>는 입력 샘플 3개와 출력 샘플 2개를 섞는 2차 IIR 필터. 계수 5개만 바꾸면 응답 모양이 완전히 달라짐. 그래서 EQ, 신스 필터, 크로스오버의 기본 부품으로 쓰임.</p>
    <ul>
      <li><b>로우패스, 하이패스</b>: 기준 주파수 위(아래)를 12dB/oct로 깎음</li>
      <li><b>밴드패스, 노치</b>: 기준 주파수 근처만 남기거나 근처만 지움</li>
      <li><b>올패스</b>: 크기는 그대로, 위상만 돌림</li>
      <li><b>피킹, 로우셸프, 하이셸프</b>: 게인(dB)만큼 올리거나 내림. EQ의 기본 부품</li>
    </ul>
    <p>계수는 Robert Bristow-Johnson의 Audio EQ Cookbook 공식을 씀. 아날로그 원형을 쌍선형 변환(Bilinear Transform)으로 옮긴 식이라 나이퀴스트 근처에서 응답이 조금 눌림.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="20" class="t-small t-dim">${L('Direct Form I: y[n] = b0 x[n] + b1 x[n-1] + b2 x[n-2] - a1 y[n-1] - a2 y[n-2]', 'Direct Form I: y[n] = b0 x[n] + b1 x[n-1] + b2 x[n-2] - a1 y[n-1] - a2 y[n-2]')}</text>
    <text x="20" y="74" class="t-small">x[n]</text>
    <line x1="50" y1="70" x2="250" y2="70" class="d-line" marker-end="url(#arr)"/>
    <rect x="80" y="90" width="44" height="22" class="f-dim"/><text x="102" y="105" text-anchor="middle" class="t-small t-mono">z⁻¹</text>
    <rect x="150" y="90" width="44" height="22" class="f-dim"/><text x="172" y="105" text-anchor="middle" class="t-small t-mono">z⁻¹</text>
    <text x="102" y="64" text-anchor="middle" class="t-small t-a">b0, b1, b2</text>
    <circle cx="265" cy="70" r="13" class="f-dim"/><text x="265" y="74" text-anchor="middle">+</text>
    <line x1="278" y1="70" x2="470" y2="70" class="d-line" marker-end="url(#arr)"/><text x="478" y="74" class="t-small">y[n]</text>
    <rect x="320" y="90" width="44" height="22" class="f-dim"/><text x="342" y="105" text-anchor="middle" class="t-small t-mono">z⁻¹</text>
    <rect x="390" y="90" width="44" height="22" class="f-dim"/><text x="412" y="105" text-anchor="middle" class="t-small t-mono">z⁻¹</text>
    <path d="M65,70 V101 H80 M124,101 H150 M194,101 H232 L255,80" class="d-a" marker-end="url(#arr)"/>
    <path d="M450,70 V101 H434 M390,101 H364 M320,101 H298 L275,80" class="d-b" marker-end="url(#arr)"/>
    <text x="378" y="64" text-anchor="middle" class="t-small t-b">-a1, -a2 (${L('되먹임', 'feedback')})</text>
    <text x="270" y="140" text-anchor="middle" class="t-small t-dim">${L('계수 5개만 바꾸면: 로우패스, 하이패스, 밴드패스, 노치, 올패스, 피킹, 셸프', 'Change only the 5 coefficients: lowpass, highpass, bandpass, notch, allpass, peaking, shelf')}</text>
    <text x="270" y="158" text-anchor="middle" class="t-small t-dim">${L('되먹임(a1, a2)이 있어서 짧은 계산으로 가파른 응답을 얻음 (IIR)', 'Feedback (a1, a2) gives a sharp response with little work (IIR)')}</text>
  </svg>`,
  look: [
    '필터 종류를 피킹으로 바꾸고 게인을 +12dB로 올리면 기준 주파수만 솟음. 로우패스, 하이패스에서는 게인이 아무 일도 하지 않음.',
    'Q를 10 이상으로 올리면 로우패스, 하이패스의 기준 주파수에서 공진 봉우리가 생김',
    '올패스를 고르면 크기 곡선은 0dB로 평평하고 점선(위상)만 360도 돌아감',
    '"소리 켜기" 후 소리 내는 뷰를 A와 B로 바꾸면 같은 원본이 먹먹한 소리 vs 가는 소리로 들림',
  ],
  refs: [
    { type: 'article', title: 'Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients"', url: 'https://www.w3.org/TR/audio-eq-cookbook/', note: '이 샘플의 계수 공식 (W3C 문서로 공개)' },
    { type: 'book', title: 'Julius O. Smith III, Introduction to Digital Filters with Audio Applications', url: 'https://ccrma.stanford.edu/~jos/filters/', note: '바이쿼드, 직접형 구조, 주파수 응답 계산' },
    { type: 'engine', title: 'MDN - BiquadFilterNode', url: 'https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode', note: 'Web Audio API의 같은 8가지 필터 종류' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '필터 장: 셸빙, 피킹 필터 설계' },
  ],
  params: [
    { key: 'type', label: '필터 종류', type: 'select', group: '필터', options: [
      { value: 'lowpass', label: '로우패스' }, { value: 'highpass', label: '하이패스' }, { value: 'bandpass', label: '밴드패스' }, { value: 'notch', label: '노치' },
      { value: 'allpass', label: '올패스' }, { value: 'peaking', label: '피킹' }, { value: 'lowshelf', label: '로우셸프' }, { value: 'highshelf', label: '하이셸프' },
    ], a: 'lowpass', b: 'highpass' },
    { key: 'freq', label: '기준 주파수 (Hz)', type: 'range', min: 40, max: 12000, step: 10, default: 1000, help: '숫자 칸에 직접 입력 가능' },
    { key: 'q', label: 'Q', type: 'range', min: 0.3, max: 20, step: 0.1, default: 0.7, help: '높을수록 기준 주파수 근처가 좁고 뾰족함' },
    { key: 'gain', label: '게인 (dB)', type: 'range', min: -18, max: 18, step: 0.5, default: 9, when: (p) => ['peaking', 'lowshelf', 'highshelf'].includes(p.type), help: '피킹, 셸프에서만 쓰임' },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'saw', label: '톱니파 프레이즈' }, { value: 'noise', label: '화이트 노이즈' }], default: 'saw', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Biquad Filter Types',
    summary: 'The same 2nd order filter (biquad) becomes a lowpass, highpass, bandpass, notch, shelf or peaking filter when you change only its coefficients. Put a different type in each view and compare the curve and the sound.',
    views: { a: 'Lowpass', b: 'Highpass' },
    controls: 'Change the filter type, frequency, Q and gain in the parameter table. Press "Sound on" to hear the output of the view that plays sound.',
    info: `
    <p>A <b>biquad</b> is a 2nd order IIR filter that mixes 3 input samples and 2 output samples. If you change its 5 coefficients, the response shape changes completely. So it is the basic part of EQs, synth filters and crossovers.</p>
    <ul>
      <li><b>Lowpass, highpass</b>: cut above (below) the corner frequency at 12 dB/oct.</li>
      <li><b>Bandpass, notch</b>: keep only the area near the frequency, or remove only that area.</li>
      <li><b>Allpass</b>: keeps the level and only turns the phase.</li>
      <li><b>Peaking, low shelf, high shelf</b>: boost or cut by the gain (dB). The basic parts of an EQ.</li>
    </ul>
    <p>The coefficients come from Robert Bristow-Johnson's Audio EQ Cookbook. It maps analog prototypes with the bilinear transform, so the response is squeezed a little near Nyquist.</p>`,
    look: [
      'Set the type to peaking and the gain to +12 dB. Only the area around the frequency rises. In lowpass and highpass the gain does nothing.',
      'Raise Q above 10. Lowpass and highpass get a resonant peak at the corner frequency.',
      'Pick allpass. The level curve stays flat at 0 dB and only the dashed phase line turns through 360 degrees.',
      'Press "Sound on" and switch the view that plays sound between A and B. The same source sounds dull vs thin.',
    ],
    refs: ['Coefficient formulas used here (published as a W3C note).', 'Biquads, direct form structures and frequency response.', 'The same 8 filter types in the Web Audio API.', 'Filter chapter: shelving and peaking filter design.'],
    params: {
      type: { label: 'Filter type', group: 'Filter', options: { lowpass: 'Lowpass', highpass: 'Highpass', bandpass: 'Bandpass', notch: 'Notch', allpass: 'Allpass', peaking: 'Peaking', lowshelf: 'Low shelf', highshelf: 'High shelf' } },
      freq: { label: 'Frequency (Hz)', help: 'You can type a value in the number box' },
      q: { label: 'Q', help: 'Higher means a narrower, sharper area around the frequency' },
      gain: { label: 'Gain (dB)', help: 'Used only by peaking and shelf types' },
      src: { label: 'Source', group: 'Sound', options: { saw: 'Saw phrase', noise: 'White noise' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 8192;
    const usesGain = () => ['peaking', 'lowshelf', 'highshelf'].includes(P.type);

    // 원본 소리. 시각화와 소리가 같은 함수를 씀
    function makeSource(seed) {
      const r = U.rng(seed); let ph = 0, t = 0;
      const notes = [45, 52, 57, 60, 64, 60, 57, 52];
      return (sr) => {
        if (P.src === 'noise') return r.range(-1, 1) * 0.35;
        const pos = t * 4, step = Math.floor(pos), local = pos - step;
        const f = A.mtof(notes[step % notes.length]), dt = f / sr;
        const v = 2 * ph - 1 - A.polyBlep(ph, dt);
        ph += dt; if (ph >= 1) ph -= 1; t += 1 / sr;
        return v * Math.min(1, local * 80) * (1 - 0.5 * local) * 0.4;
      };
    }

    // 실시간: 기준 주파수를 부드럽게 따라가며 32샘플마다 계수 갱신
    const live = { src: makeSource(11), f: P.freq, q: P.q, g: P.gain, flt: A.biquad(P.type, P.freq, P.q, P.gain, SR), type: P.type };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(30, sr / 32);
        for (let i = 0; i < n; i++) {
          if ((i & 31) === 0) {
            live.f += (P.freq - live.f) * k; live.q += (P.q - live.q) * k; live.g += (P.gain - live.g) * k;
            const nc = A.biquad(P.type, live.f, live.q, live.g, sr);
            const c = live.flt;
            if (live.type !== P.type) { c.reset(); live.type = P.type; }
            c.b0 = nc.b0; c.b1 = nc.b1; c.b2 = nc.b2; c.a1 = nc.a1; c.a2 = nc.a2;
          }
          const y = live.flt.process(live.src(sr));
          l[i] = y; r[i] = y;
        }
      },
    });

    // 분석: 파라미터가 바뀔 때만 원본과 출력의 스펙트럼을 다시 계산
    let key = '', inMag = null, outMag = null, coef = null, outRms = 0, inRms = 0;
    function analyze() {
      const k = [P.type, P.freq, P.q, P.gain, P.src].join();
      if (k === key) return;
      key = k;
      coef = A.biquad(P.type, P.freq, P.q, P.gain, SR);
      const src = makeSource(11), x = new Float32Array(N), y = new Float32Array(N);
      for (let i = 0; i < N; i++) { x[i] = src(SR); y[i] = coef.process(x[i]); }
      coef.reset();
      inMag = A.spectrum(x, N, { window: 'blackman' }); outMag = A.spectrum(y, N, { window: 'blackman' });
      inRms = A.rms(x, 2048); outRms = A.rms(y, 2048);
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const rw = W - pad * 2, rh = Math.max(60, (H - pad * 3) * 0.55);
        const minDb = -48, maxDb = 24;
        A.drawResponse(g, (f) => coef.response(f).db, pad, pad, rw, rh, { color: col, minDb, maxDb, label: L('크기 응답 (실선), 위상 (점선)', 'Magnitude (solid), phase (dashed)') });
        // 위상: -180~180도를 같은 높이에 겹쳐 그림
        g.setLineDash([4, 3]);
        A.drawResponse(g, (f) => minDb + (coef.response(f).phase / Math.PI + 1) / 2 * (maxDb - minDb), pad, pad, rw, rh, { color: C.accent, minDb, maxDb, background: false, grid: false, lineWidth: 1 });
        g.setLineDash([]);
        const fx = A.freqX(P.freq, pad, rw, 20, 20000);
        D.line(g, fx, pad, fx, pad + rh, C.warn, 1);
        D.text(g, `${Math.round(P.freq)} Hz`, fx + 3, pad + 16, { size: 10, color: C.warn });
        const sy = pad * 2 + rh, sh = H - sy - pad;
        A.drawSpectrum(g, inMag, SR, pad, sy, rw, sh, { color: 'rgba(200,200,200,0.35)', minDb: -100, maxDb: 0, lineWidth: 1 });
        A.drawSpectrum(g, outMag, SR, pad, sy, rw, sh, { color: col, minDb: -100, maxDb: 0, background: false, grid: false, label: L('스펙트럼: 회색 = 원본, 색 = 필터 출력', 'Spectrum: gray = source, color = filter output') });
        const r0 = coef.response(P.freq).db, rLo = coef.response(P.freq / 4).db, rHi = coef.response(Math.min(20000, P.freq * 4)).db;
        ctx.stat(L('기준 주파수에서', 'At frequency'), r0.toFixed(1) + ' dB');
        ctx.stat(L('2옥타브 아래 / 위', '2 octaves below / above'), `${rLo.toFixed(1)} / ${rHi.toFixed(1)} dB`);
        ctx.stat(L('출력 레벨 변화', 'Output level change'), A.linToDb(outRms / Math.max(1e-9, inRms)).toFixed(1) + ' dB');
        ctx.stat(L('게인 사용', 'Gain used'), usesGain() ? L('예', 'Yes') : L('아니오', 'No'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
