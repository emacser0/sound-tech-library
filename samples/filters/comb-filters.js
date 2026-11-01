// 콤 필터: 피드포워드(지연된 입력을 더함) vs 피드백(지연된 출력을 되먹임). 빗살 모양 응답과 에코 열
GTL.register({
  id: 'comb-filters',
  title: '피드포워드 콤 필터와 피드백 콤 필터',
  summary: '신호에 지연된 자신을 더하면 주파수 응답이 빗살처럼 일정 간격으로 오르내림. 지연된 입력을 한 번 더하는 피드포워드 콤은 깊은 골이, 지연된 출력을 되먹이는 피드백 콤은 날카로운 봉우리와 긴 울림이 생김.',
  views: { a: '피드포워드 콤', b: '피드백 콤' },
  info: `
    <p><b>콤 필터(Comb Filter)</b>는 지연 D 샘플과 덧셈만으로 만드는 필터. 응답이 <code>sr / D</code> 간격으로 반복되어 빗(comb) 모양이 됨.</p>
    <ul>
      <li><b>피드포워드(FIR)</b>: <code>y[n] = x[n] + g x[n-D]</code>. 에코 한 번. 지연과 반대 위상인 주파수에서 골(노치). g = 1이면 골이 완전히 0. 플랜저, 반사음 간섭과 같은 원리.</li>
      <li><b>피드백(IIR)</b>: <code>y[n] = x[n] + g y[n-D]</code>. 에코가 g배씩 줄며 끝없이 반복. <code>sr / D</code>의 배수에서 봉우리가 솟아 그 음 높이로 울림. 카플러스-스트롱 현 합성, 슈뢰더 리버브의 부품.</li>
      <li>g가 음수면 봉우리와 골의 위치가 반 칸 밀림 (홀수 배음만 남음)</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="18" class="t-small t-a">${L('피드포워드', 'Feedforward')}</text>
    <line x1="20" y1="50" x2="196" y2="50" class="d-line" marker-end="url(#arr)"/><text x="10" y="54" class="t-small">x</text>
    <circle cx="210" cy="50" r="12" class="f-dim"/><text x="210" y="54" text-anchor="middle">+</text>
    <line x1="222" y1="50" x2="250" y2="50" class="d-line" marker-end="url(#arr)"/><text x="254" y="54" class="t-small">y</text>
    <path d="M50,50 L50,90 L90,90" class="d-a"/><rect x="90" y="78" width="60" height="24" class="f-dim"/><text x="120" y="94" text-anchor="middle" class="t-small">z⁻ᴰ, g</text>
    <path d="M150,90 L210,90 L210,64" class="d-a" marker-end="url(#arr)"/>
    <text x="300" y="18" class="t-small t-b">${L('피드백', 'Feedback')}</text>
    <line x1="300" y1="50" x2="356" y2="50" class="d-line" marker-end="url(#arr)"/><text x="290" y="54" class="t-small">x</text>
    <circle cx="370" cy="50" r="12" class="f-dim"/><text x="370" y="54" text-anchor="middle">+</text>
    <line x1="382" y1="50" x2="520" y2="50" class="d-line" marker-end="url(#arr)"/><text x="524" y="54" class="t-small">y</text>
    <path d="M480,50 L480,90 L460,90" class="d-b"/><rect x="400" y="78" width="60" height="24" class="f-dim"/><text x="430" y="94" text-anchor="middle" class="t-small">z⁻ᴰ, g</text>
    <path d="M400,90 L370,90 L370,64" class="d-b" marker-end="url(#arr)"/>
    <text x="135" y="130" text-anchor="middle" class="t-small t-a">${L('에코 1번, 깊은 골', 'one echo, deep notches')}</text>
    <text x="410" y="130" text-anchor="middle" class="t-small t-b">${L('에코가 계속, 날카로운 봉우리', 'echoes repeat, sharp peaks')}</text>
  </svg>`,
  look: [
    'A의 응답에는 아래로 깊은 골이, B의 응답에는 위로 날카로운 봉우리가 같은 간격으로 반복됨',
    '임펄스 응답에서 A는 에코가 한 번, B는 g배씩 줄어드는 에코가 계속 이어짐',
    'g를 0.98로 올리고 "소리 켜기" 후 노이즈를 들으면 B에서 "1 / 지연" 주파수의 음이 들림 (지연 5ms면 200Hz)',
    'g를 음수로 바꾸면 봉우리 위치가 반 칸 밀리고 B의 음이 한 옥타브 내려간 속이 빈 소리가 됨',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing (Comb Filters)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '피드포워드, 피드백 콤 필터의 응답' },
    { type: 'paper', title: 'M. R. Schroeder, "Natural Sounding Artificial Reverberation", Journal of the AES', year: 1962, note: '피드백 콤과 올패스로 만든 인공 잔향' },
    { type: 'paper', title: 'Kevin Karplus, Alex Strong, "Digital Synthesis of Plucked-String and Drum Timbres", Computer Music Journal', year: 1983, note: '피드백 콤으로 만든 현 소리' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '콤 필터, 플랜저, 딜레이 효과' },
  ],
  params: [
    { key: 'kind', label: '구조', type: 'select', group: '콤 필터', options: [{ value: 'ff', label: '피드포워드' }, { value: 'fb', label: '피드백' }], a: 'ff', b: 'fb' },
    { key: 'ms', label: '지연 (ms)', type: 'range', min: 0.5, max: 20, step: 0.1, default: 5, shared: true, help: '봉우리, 골 간격 = 1000 / 지연(ms) Hz' },
    { key: 'g', label: '게인 g', type: 'range', min: -0.98, max: 0.98, step: 0.01, default: 0.9, shared: true },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'noise', label: '화이트 노이즈' }, { value: 'click', label: '클릭 반복' }, { value: 'saw', label: '톱니파' }], default: 'noise', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Feedforward and Feedback Comb Filters',
    summary: 'Add a delayed copy of a signal to itself and the frequency response goes up and down at even steps, like a comb. A feedforward comb adds the delayed input once and makes deep notches. A feedback comb feeds back the delayed output and makes sharp peaks and long ringing.',
    views: { a: 'Feedforward comb', b: 'Feedback comb' },
    info: `
    <p>A <b>comb filter</b> needs only a delay of D samples and an addition. Its response repeats every <code>sr / D</code> Hz, so it looks like a comb.</p>
    <ul>
      <li><b>Feedforward (FIR)</b>: <code>y[n] = x[n] + g x[n-D]</code>. One echo. Frequencies where the delay flips the phase become notches. With g = 1 the notches go fully to zero. Same idea as a flanger or interference from a reflection.</li>
      <li><b>Feedback (IIR)</b>: <code>y[n] = x[n] + g y[n-D]</code>. The echo repeats forever, g times smaller each time. Peaks rise at multiples of <code>sr / D</code>, so it rings at that pitch. A building block of Karplus-Strong string synthesis and Schroeder reverb.</li>
      <li>A negative g moves the peaks and notches by half a step (only odd harmonics remain).</li>
    </ul>`,
    look: [
      'A\'s response has deep notches pointing down, B\'s has sharp peaks pointing up, repeating at the same spacing.',
      'In the impulse response, A has one echo while B keeps echoing, g times smaller each time.',
      'Raise g to 0.98, press "Sound on" and listen to noise. B rings at "1 / delay" (5 ms gives 200 Hz).',
      'Make g negative. The peaks move by half a step and B gets a hollow tone one octave lower.',
    ],
    refs: ['Responses of feedforward and feedback comb filters.', 'Artificial reverb from feedback combs and allpasses.', 'String sounds from a feedback comb.', 'Comb filters, flangers and delay effects.'],
    params: {
      kind: { label: 'Structure', group: 'Comb filter', options: { ff: 'Feedforward', fb: 'Feedback' } },
      ms: { label: 'Delay (ms)', help: 'Peak and notch spacing = 1000 / delay (ms) Hz' },
      g: 'Gain g',
      src: { label: 'Source', group: 'Sound', options: { noise: 'White noise', click: 'Repeated clicks', saw: 'Saw' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, BUF = 4096;
    const delayN = (sr) => Math.max(1, Math.round(P.ms * sr / 1000));
    function respDb(f) {
      const w = U.TAU * f / SR * delayN(SR), re = Math.cos(w), im = -Math.sin(w);
      return P.kind === 'ff' ? A.linToDb(Math.hypot(1 + P.g * re, P.g * im)) : -A.linToDb(Math.hypot(1 - P.g * re, -P.g * im));
    }
    // 시각화와 소리가 같은 처리 함수. 피드백은 봉우리 높이만큼 줄여 레벨을 맞춤
    function makeComb() { return { buf: new Float64Array(BUF), idx: 0 }; }
    function comb(st, x, sr) {
      const d = Math.min(BUF - 1, delayN(sr)), old = st.buf[(st.idx - d + BUF) & (BUF - 1)];
      const y = x + P.g * old; // 저장하는 값만 다름: 입력(피드포워드) vs 출력(피드백)
      st.buf[st.idx] = P.kind === 'ff' ? x : y;
      st.idx = (st.idx + 1) & (BUF - 1);
      return y;
    }
    const norm = () => (P.kind === 'ff' ? 1 / (1 + Math.abs(P.g)) : 1 - Math.abs(P.g));

    const live = { st: makeComb(), r: U.rng(6), n: 0, ph: 0, kind: P.kind };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (live.kind !== P.kind) { live.st = makeComb(); live.kind = P.kind; }
        for (let i = 0; i < n; i++) {
          let x;
          if (P.src === 'noise') x = live.r.range(-1, 1) * 0.4;
          else if (P.src === 'click') x = live.n % Math.round(sr / 2) === 0 ? 1 : 0;
          else { const dt = 110 / sr; x = (2 * live.ph - 1 - A.polyBlep(live.ph, dt)) * 0.4; live.ph += dt; if (live.ph >= 1) live.ph -= 1; }
          live.n++;
          const y = comb(live.st, x, sr) * norm() * (P.src === 'click' ? 2 : 1);
          l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', ir = null;
    const IRN = 2400;
    function analyze() {
      const k = P.kind + P.ms + ',' + P.g;
      if (k === key) return;
      key = k;
      const st = makeComb();
      ir = new Float32Array(IRN);
      for (let i = 0; i < IRN; i++) ir[i] = comb(st, i === 0 ? 1 : 0, SR);
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2;
        const h1 = (H - pad * 3) * 0.6, h2 = H - pad * 3 - h1;
        A.drawResponse(g, respDb, pad, pad, rw, h1, { color: col, minDb: -40, maxDb: 36, dbStep: 12, log: false, fmin: 0, fmax: 2000, label: L('크기 응답 (선형 주파수 축, 0~2kHz)', 'Magnitude (linear frequency axis, 0 to 2 kHz)') });
        const sp = 1000 / (delayN(SR) / SR * 1000);
        for (let m = 1; m * sp <= 2000 && m <= 40; m++) { const px = pad + rw * m * sp / 2000; D.line(g, px, pad + h1 - 5, px, pad + h1, C.good, 2); }
        const y2 = pad * 2 + h1;
        A.drawWave(g, ir, pad, y2, rw, h2, { color: col, amp: 0.9, label: L('임펄스 응답 (50ms)', 'Impulse response (50 ms)') });
        const dN = delayN(SR), gAbs = Math.abs(P.g);
        ctx.stat(L('지연', 'Delay'), `${dN} ${L('샘플', 'samples')}`);
        ctx.stat(L('봉우리 간격', 'Peak spacing'), (SR / dN).toFixed(1) + ' Hz');
        ctx.stat(L('봉우리 / 골', 'Peak / notch'), P.kind === 'ff'
          ? `${A.linToDb(1 + gAbs).toFixed(1)} / ${A.linToDb(1 - gAbs).toFixed(1)} dB`
          : `${(-A.linToDb(1 - gAbs)).toFixed(1)} / ${(-A.linToDb(1 + gAbs)).toFixed(1)} dB`);
        ctx.stat(L('울림 시간 (-60dB)', 'Ring time (-60 dB)'), P.kind === 'ff' ? L('에코 1번', 'one echo') : (gAbs < 1e-3 ? '0' : (dN / SR * 1000 * 60 / -A.linToDb(gAbs)).toFixed(0) + ' ms'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
