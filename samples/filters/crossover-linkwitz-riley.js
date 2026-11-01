// 크로스오버: 버터워스 vs 링크위츠-라일리. 저역과 고역으로 나눈 뒤 다시 더했을 때 평평한가
GTL.register({
  id: 'crossover-linkwitz-riley',
  title: '크로스오버 (버터워스 vs 링크위츠-라일리)',
  summary: '스피커, 멀티밴드 컴프레서는 소리를 저역과 고역으로 나눈 뒤 다시 합침. 버터워스로 나누면 크로스오버 지점에서 +3dB 혹이나 골이 생김. 링크위츠-라일리 4차는 두 대역의 합이 평평함.',
  views: { a: '버터워스 2차', b: '링크위츠-라일리 4차' },
  info: `
    <p><b>크로스오버(Crossover)</b>는 로우패스와 하이패스를 같은 주파수에 걸어 대역을 나누는 필터 쌍. 우퍼와 트위터, 멀티밴드 컴프레서, 대역별 왜곡에 씀. 아무 처리를 하지 않으면 두 대역의 합이 원본과 같아야 함.</p>
    <ul>
      <li><b>버터워스 2차</b>: 각 대역이 크로스오버에서 -3dB. 두 대역의 위상 차이가 180도라 그냥 더하면 깊은 골, 하이패스 극성을 뒤집으면 +3dB 혹이 생김.</li>
      <li><b>링크위츠-라일리 4차(LR4)</b>: 버터워스 2차를 두 번 이은 필터. 각 대역이 크로스오버에서 -6dB이고 위상이 같아서 합의 크기가 모든 주파수에서 0dB. 합은 올패스(위상만 돔).</li>
      <li><b>링크위츠-라일리 2차(LR2)</b>: Q 0.5 필터. 하이패스 극성을 뒤집으면 합이 평평함. 기울기가 12dB/oct로 완만함.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="44" class="t-small">${L('입력', 'In')}</text>
    <line x1="40" y1="40" x2="70" y2="40" class="d-line"/>
    <path d="M70,40 L70,20 L100,20 M70,40 L70,60 L100,60" class="d-line"/>
    <rect x="100" y="8" width="80" height="24" class="f-dim"/><text x="140" y="24" text-anchor="middle" class="t-small">LP</text>
    <rect x="100" y="48" width="80" height="24" class="f-dim"/><text x="140" y="64" text-anchor="middle" class="t-small">HP</text>
    <path d="M180,20 L230,20 L230,32 M180,60 L230,60 L230,48" class="d-line"/>
    <circle cx="230" cy="40" r="9" class="f-dim"/><text x="230" y="44" text-anchor="middle">+</text>
    <line x1="239" y1="40" x2="270" y2="40" class="d-line" marker-end="url(#arr)"/><text x="276" y="44" class="t-small">${L('합', 'Sum')}</text>
    <line x1="20" y1="140" x2="250" y2="140" class="d-dim"/><line x1="20" y1="110" x2="250" y2="110" class="d-dim" stroke-dasharray="2 3"/>
    <path d="M20,110 L100,110 Q135,92 170,110 L250,110" class="d-a"/>
    <text x="135" y="88" text-anchor="middle" class="t-small t-a">${L('버터워스: +3dB 혹', 'Butterworth: +3 dB bump')}</text>
    <line x1="290" y1="140" x2="520" y2="140" class="d-dim"/><line x1="290" y1="110" x2="520" y2="110" class="d-dim" stroke-dasharray="2 3"/>
    <path d="M290,110 L520,110" class="d-b"/>
    <path d="M290,110 L370,111 Q400,122 430,140 M520,110 L440,111 Q410,122 380,140" class="d-dim"/>
    <text x="405" y="98" text-anchor="middle" class="t-small t-b">${L('LR4: 합이 평평 (각 대역 -6dB에서 교차)', 'LR4: flat sum (bands cross at -6 dB)')}</text>
    <text x="135" y="160" text-anchor="middle" class="t-small t-dim">${L('합의 크기 응답', 'Magnitude of the sum')}</text>
    <text x="405" y="160" text-anchor="middle" class="t-small t-dim">${L('합의 크기 응답', 'Magnitude of the sum')}</text>
  </svg>`,
  look: [
    '"합 (크로스오버에서)" 측정값을 비교하면 A는 +3dB, B는 0dB',
    'A의 방식을 "버터워스 2차 (극성 그대로)"로 바꾸면 합에 깊은 골이 생김',
    '듣는 대역을 "합"으로 두고 핑크 노이즈를 들으면 A는 크로스오버 근처가 살짝 부풀어 들림. B는 원본과 같음.',
    '듣는 대역을 저역, 고역으로 바꾸면 B는 대역 경계가 더 가파르게 나뉨 (24dB/oct)',
  ],
  refs: [
    { type: 'paper', title: 'Siegfried H. Linkwitz, "Active Crossover Networks for Noncoincident Drivers", Journal of the AES', year: 1976, note: 'LR 크로스오버의 원 논문' },
    { type: 'article', title: 'Linkwitz Lab, Crossovers', url: 'https://www.linkwitzlab.com/crossovers.htm', note: '크로스오버 종류별 합 응답 설명' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: 'LR 크로스오버와 멀티밴드 처리 구현' },
    { type: 'article', title: 'Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients"', url: 'https://www.w3.org/TR/audio-eq-cookbook/', note: '각 섹션의 로우패스, 하이패스 계수' },
  ],
  params: [
    { key: 'type', label: '방식', type: 'select', group: '크로스오버', options: [
      { value: 'bw2', label: '버터워스 2차 (HP 극성 반전)' }, { value: 'bw2n', label: '버터워스 2차 (극성 그대로)' }, { value: 'lr2', label: '링크위츠-라일리 2차 (HP 극성 반전)' }, { value: 'lr4', label: '링크위츠-라일리 4차' },
    ], a: 'bw2', b: 'lr4' },
    { key: 'fc', label: '크로스오버 주파수 (Hz)', type: 'range', min: 80, max: 8000, step: 10, default: 800, shared: true },
    { key: 'band', label: '듣는 대역', type: 'select', group: '소리', options: [{ value: 'sum', label: '합' }, { value: 'low', label: '저역' }, { value: 'high', label: '고역' }], default: 'sum', shared: true },
    { key: 'src', label: '원본 소리', type: 'select', options: [{ value: 'pink', label: '핑크 노이즈' }, { value: 'saw', label: '톱니파 화음' }], default: 'pink', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Crossover (Butterworth vs Linkwitz-Riley)',
    summary: 'Speakers and multiband compressors split the sound into low and high bands and then add them back. A Butterworth split leaves a +3 dB bump or a notch at the crossover point. With 4th order Linkwitz-Riley, the sum of the two bands is flat.',
    views: { a: 'Butterworth 2nd order', b: 'Linkwitz-Riley 4th order' },
    info: `
    <p>A <b>crossover</b> is a lowpass and a highpass at the same frequency that split the signal into bands. It is used for woofers and tweeters, multiband compressors and per band distortion. With no processing in between, the bands should add back to the original.</p>
    <ul>
      <li><b>Butterworth 2nd order</b>: each band is -3 dB at the crossover. The bands are 180 degrees apart, so a plain sum has a deep notch. Flipping the highpass polarity gives a +3 dB bump instead.</li>
      <li><b>Linkwitz-Riley 4th order (LR4)</b>: two Butterworth 2nd order filters in series. Each band is -6 dB at the crossover and the phases match, so the sum is 0 dB at every frequency. The sum is an allpass (only the phase turns).</li>
      <li><b>Linkwitz-Riley 2nd order (LR2)</b>: a Q 0.5 filter. With the highpass polarity flipped, the sum is flat. The slope is a gentle 12 dB/oct.</li>
    </ul>`,
    look: [
      'Compare the "Sum (at crossover)" stat. A is +3 dB and B is 0 dB.',
      'Change A to "Butterworth 2nd order (same polarity)". The sum gets a deep notch.',
      'Set the band to "Sum" and listen to pink noise. A sounds a little swollen near the crossover. B sounds like the original.',
      'Switch the band to low or high. B splits the bands more sharply (24 dB/oct).',
    ],
    refs: ['The original LR crossover paper.', 'Sum responses of different crossover types.', 'LR crossover and multiband processing code.', 'Lowpass and highpass coefficients for each section.'],
    params: {
      type: { label: 'Type', group: 'Crossover', options: { bw2: 'Butterworth 2nd order (HP polarity flipped)', bw2n: 'Butterworth 2nd order (same polarity)', lr2: 'Linkwitz-Riley 2nd order (HP polarity flipped)', lr4: 'Linkwitz-Riley 4th order' } },
      fc: 'Crossover frequency (Hz)',
      band: { label: 'Band to hear', group: 'Sound', options: { sum: 'Sum', low: 'Low band', high: 'High band' } },
      src: { label: 'Source', options: { pink: 'Pink noise', saw: 'Saw chord' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000;

    // 방식별 섹션 목록과 하이패스 부호
    function design(type, fc, sr) {
      const q = type === 'lr2' ? 0.5 : Math.SQRT1_2, n = type === 'lr4' ? 2 : 1;
      const lp = [], hp = [];
      for (let i = 0; i < n; i++) { lp.push(A.biquad('lowpass', fc, q, 0, sr)); hp.push(A.biquad('highpass', fc, q, 0, sr)); }
      return { lp, hp, sign: type === 'bw2' || type === 'lr2' ? -1 : 1 };
    }
    // 복소 응답의 곱
    function cplx(secs, f) {
      let re = 1, im = 0;
      for (const c of secs) { const r = A.biquadResponse(c, f, SR), mr = r.mag * Math.cos(r.phase), mi = r.mag * Math.sin(r.phase); const t = re * mr - im * mi; im = re * mi + im * mr; re = t; }
      return [re, im];
    }
    function sumDb(d, f) { const a = cplx(d.lp, f), b = cplx(d.hp, f); return A.linToDb(Math.hypot(a[0] + d.sign * b[0], a[1] + d.sign * b[1])); }
    const bandDb = (secs, f) => secs.reduce((s, c) => s + A.biquadResponse(c, f, SR).db, 0);

    const run = (secs, x) => { for (const c of secs) x = c.process(x); return x; };
    const live = { d: design(P.type, P.fc, SR), key: '', r: U.rng(8), pk: [0, 0, 0, 0, 0, 0, 0], ph: [0, 0, 0, 0], f: P.fc };
    const chord = [36, 48, 55, 64];
    function source(sr) {
      if (P.src === 'pink') {
        const w = live.r.range(-1, 1), b = live.pk;
        b[0] = 0.99886 * b[0] + w * 0.0555179; b[1] = 0.99332 * b[1] + w * 0.0750759; b[2] = 0.969 * b[2] + w * 0.153852;
        b[3] = 0.8665 * b[3] + w * 0.3104856; b[4] = 0.55 * b[4] + w * 0.5329522; b[5] = -0.7616 * b[5] - w * 0.016898;
        const v = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + w * 0.5362) * 0.05; b[6] = w * 0.115926;
        return v;
      }
      let s = 0;
      for (let j = 0; j < 4; j++) { const dt = A.mtof(chord[j]) / sr; s += 2 * live.ph[j] - 1 - A.polyBlep(live.ph[j], dt); live.ph[j] += dt; if (live.ph[j] >= 1) live.ph[j] -= 1; }
      return s * 0.1;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(20, sr / 64);
        for (let i = 0; i < n; i++) {
          if ((i & 63) === 0) {
            live.f += (P.fc - live.f) * k;
            const nd = design(P.type, live.f, sr);
            if (live.key !== P.type) { live.d = nd; live.key = P.type; }
            else { const cp = (a, b) => a.forEach((c, j) => { c.b0 = b[j].b0; c.b1 = b[j].b1; c.b2 = b[j].b2; c.a1 = b[j].a1; c.a2 = b[j].a2; }); cp(live.d.lp, nd.lp); cp(live.d.hp, nd.hp); }
          }
          const x = source(sr), lo = run(live.d.lp, x), hi = run(live.d.hp, x) * live.d.sign;
          const y = P.band === 'low' ? lo : P.band === 'high' ? hi : lo + hi;
          l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', d = null, atFc = 0, dev = 0;
    function analyze() {
      const k = P.type + P.fc;
      if (k === key) return;
      key = k;
      d = design(P.type, P.fc, SR);
      atFc = sumDb(d, P.fc);
      dev = atFc;
      for (let i = 0; i <= 300; i++) { const v = sumDb(d, 20 * Math.pow(1000, i / 300)); if (Math.abs(v) > Math.abs(dev)) dev = v; }
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2, rh = H - pad * 2;
        const o = { minDb: -36, maxDb: 9, dbStep: 6 };
        A.drawResponse(g, (f) => bandDb(d.lp, f), pad, pad, rw, rh, { ...o, color: C.series[2], lineWidth: 1.5, label: L('초록 = 저역, 노랑 = 고역, 굵은 선 = 합', 'Green = low band, yellow = high band, thick = sum') });
        A.drawResponse(g, (f) => bandDb(d.hp, f), pad, pad, rw, rh, { ...o, background: false, grid: false, color: C.series[3], lineWidth: 1.5 });
        A.drawResponse(g, (f) => sumDb(d, f), pad, pad, rw, rh, { ...o, background: false, grid: false, color: col, lineWidth: 3 });
        const fx = A.freqX(P.fc, pad, rw, 20, 20000);
        g.setLineDash([3, 3]); D.line(g, fx, pad, fx, pad + rh, C.dim, 1); g.setLineDash([]);
        const fmt = (v) => (v < -60 ? '< -60 dB' : (v >= 0 ? '+' : '') + v.toFixed(2) + ' dB');
        ctx.stat(L('합 (크로스오버에서)', 'Sum (at crossover)'), fmt(atFc));
        ctx.stat(L('합의 최대 오차', 'Max error of sum'), fmt(dev));
        ctx.stat(L('각 대역 (크로스오버에서)', 'Each band (at crossover)'), bandDb(d.lp, P.fc).toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
