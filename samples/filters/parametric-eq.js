// 파라메트릭 EQ: 피킹 밴드 4개를 끌어서 조절. 고정 Q vs 비례 Q(게인이 클수록 좁아짐) 비교
GTL.register({
  id: 'parametric-eq',
  title: '파라메트릭 EQ',
  summary: '피킹 필터 4개를 직렬로 이어 원하는 주파수만 올리고 내림. 고정 Q는 게인과 상관없이 폭이 같고, 비례 Q는 작은 보정은 넓게, 큰 보정은 좁게 걸림.',
  views: { a: '고정 Q', b: '비례 Q' },
  controls: '응답 그래프의 점을 끌기: 좌우 = 주파수, 위아래 = 게인. 점 위에서 휠 = Q. 입력 동기화가 켜져 있으면 두 뷰가 같이 움직임.',
  info: `
    <p><b>파라메트릭 EQ</b>는 밴드마다 주파수, 게인, Q(폭)를 모두 바꿀 수 있는 이퀄라이저. 밴드 하나는 피킹(Peaking) 바이쿼드 하나. 밴드를 직렬로 이으면 전체 응답은 각 밴드 응답(dB)의 합.</p>
    <p>같은 Q 값이라도 게인에 따라 폭을 어떻게 다룰지는 제품마다 다름</p>
    <ul>
      <li><b>고정 Q(Constant Q)</b>: 게인과 상관없이 Q가 같음. 예측하기 쉬움.</li>
      <li><b>비례 Q(Proportional Q)</b>: 게인이 작으면 넓게, 크면 좁게. 작은 보정은 자연스럽고 큰 보정은 정밀함. 여러 아날로그 콘솔 EQ가 이렇게 동작.</li>
      <li>밴드가 가까우면 응답이 겹쳐 더해짐. 실제 곡선은 노드 위치보다 높거나 낮을 수 있음.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="90" x2="250" y2="90" class="d-dim"/>
    <path d="M20,90 L80,90 Q115,90 125,75 Q135,90 170,90 L250,90" class="d-a"/>
    <path d="M20,90 L60,89 Q115,82 125,75 Q135,82 190,89 L250,90" class="d-b"/>
    <text x="135" y="24" text-anchor="middle" class="t-small">${L('게인 +3dB', 'Gain +3 dB')}</text>
    <text x="40" y="115" class="t-small t-a">${L('고정 Q: 좁음', 'Constant Q: narrow')}</text>
    <text x="40" y="132" class="t-small t-b">${L('비례 Q: 넓음', 'Proportional Q: wide')}</text>
    <line x1="290" y1="110" x2="520" y2="110" class="d-dim"/>
    <path d="M290,110 L360,110 Q395,110 405,40 Q415,110 450,110 L520,110" class="d-a"/>
    <path d="M290,110 L370,110 Q398,108 405,40 Q412,108 440,110 L520,110" class="d-b"/>
    <text x="405" y="24" text-anchor="middle" class="t-small">${L('게인 +15dB', 'Gain +15 dB')}</text>
    <text x="300" y="132" class="t-small t-dim">${L('큰 게인에서는 비례 Q가 더 좁음', 'At large gain, proportional Q is narrower')}</text>
  </svg>`,
  look: [
    '2번 밴드(-6dB)를 위아래로 끌어 게인을 0dB 쪽으로 줄이면 B의 곡선만 넓게 퍼짐',
    '밴드 게인을 +15dB까지 올리면 B의 봉우리가 A보다 좁아짐 ("실효 Q" 측정값 비교)',
    '두 밴드를 가까이 끌어 놓으면 전체 곡선(굵은 선)이 두 노드보다 높이 솟음',
    '"소리 켜기" 후 핑크 노이즈를 고르고 밴드를 움직이면 어느 주파수 대역이 바뀌는지 바로 들림',
  ],
  refs: [
    { type: 'article', title: 'Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients"', url: 'https://www.w3.org/TR/audio-eq-cookbook/', note: '피킹 필터 계수' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2014, note: 'EQ 종류와 사용법, 비례 Q 설명' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '파라메트릭 피킹 필터 설계' },
    { type: 'paper', title: 'Regalia, Mitra, "Tunable Digital Frequency Response Equalization Filters", IEEE Trans. ASSP', year: 1987, note: '디지털 파라메트릭 EQ의 고전 논문' },
  ],
  params: [
    { key: 'qmode', label: 'Q 방식', type: 'select', group: 'EQ', options: [{ value: 'constant', label: '고정 Q' }, { value: 'prop', label: '비례 Q' }], a: 'constant', b: 'prop' },
    { key: 'bypass', label: 'EQ 끄기 (바이패스)', type: 'bool', default: false, help: '원본과 비교할 때 사용' },
    { key: 'reset', label: '밴드 초기화', type: 'button', buttonLabel: '밴드 초기화' },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'pink', label: '핑크 노이즈' }, { value: 'saw', label: '톱니파 화음' }], default: 'saw', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Parametric EQ',
    summary: 'Four peaking filters in series boost or cut only the frequencies you want. Constant Q keeps the same width at any gain. Proportional Q is wide for small changes and narrow for large ones.',
    views: { a: 'Constant Q', b: 'Proportional Q' },
    controls: 'Drag a dot on the response graph: left and right = frequency, up and down = gain. Mouse wheel over a dot = Q. With input sync on, both views move together.',
    info: `
    <p>A <b>parametric EQ</b> lets you set frequency, gain and Q (width) for every band. Each band is one peaking biquad. In series, the total response is the sum of the band responses in dB.</p>
    <p>Even with the same Q value, products handle the width differently as the gain changes.</p>
    <ul>
      <li><b>Constant Q</b>: Q stays the same at any gain. Easy to predict.</li>
      <li><b>Proportional Q</b>: wide at small gain, narrow at large gain. Small changes sound natural and large ones are precise. Many analog console EQs work this way.</li>
      <li>Bands close to each other overlap and add up. The real curve can be higher or lower than the dots.</li>
    </ul>`,
    look: [
      'Drag band 2 (-6 dB) toward 0 dB. Only B\'s curve spreads wide.',
      'Raise a band to +15 dB. B\'s peak becomes narrower than A\'s (compare the "Effective Q" stat).',
      'Drag two bands close together. The total curve (thick line) rises above both dots.',
      'Press "Sound on", pick pink noise and move a band. You hear right away which frequency range changes.',
    ],
    refs: ['Peaking filter coefficients.', 'EQ types and how to use them, including proportional Q.', 'Parametric peaking filter design.', 'Classic paper on digital parametric EQ.'],
    params: {
      qmode: { label: 'Q mode', group: 'EQ', options: { constant: 'Constant Q', prop: 'Proportional Q' } },
      bypass: { label: 'EQ off (bypass)', help: 'Use it to compare with the source' },
      reset: { label: 'Reset bands', buttonLabel: 'Reset bands' },
      src: { label: 'Source', group: 'Sound', options: { pink: 'Pink noise', saw: 'Saw chord' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, FMIN = 20, FMAX = 20000, MIN_DB = -18, MAX_DB = 18;
    const BAND_COLS = [C.series[2], C.series[3], C.series[4], C.series[6]];
    const INIT = [{ f: 110, g: 4, q: 1 }, { f: 480, g: -6, q: 1 }, { f: 2400, g: 5, q: 1.2 }, { f: 9000, g: 3, q: 0.8 }];
    let bands = INIT.map((b) => ({ ...b }));

    // 비례 Q: 게인 9dB에서 설정한 Q와 같고, 작은 게인일수록 넓어짐
    const effQ = (b) => (P.qmode === 'prop' ? b.q * U.clamp(Math.abs(b.g) / 9, 0.25, 2.5) : b.q);
    const coefs = (sr) => bands.map((b) => A.biquad('peaking', b.f, effQ(b), b.g, sr));
    const total = (cs, f) => (P.bypass ? 0 : cs.reduce((s, c) => s + A.biquadResponse(c, f, SR).db, 0));

    // 실시간: 4밴드 직렬. 64샘플마다 계수 갱신. 밴드 값은 원폴로 부드럽게 따라감
    const live = { sm: INIT.map((b) => ({ ...b })), st: INIT.map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 })), cs: null, ph: [0, 0, 0, 0], r: U.rng(9), pk: [0, 0, 0, 0, 0, 0, 0], t: 0 };
    const chord = [43, 50, 55, 59];
    function source(sr) {
      if (P.src === 'pink') {
        const w = live.r.range(-1, 1), b = live.pk; // Paul Kellet 핑크 노이즈
        b[0] = 0.99886 * b[0] + w * 0.0555179; b[1] = 0.99332 * b[1] + w * 0.0750759; b[2] = 0.969 * b[2] + w * 0.153852;
        b[3] = 0.8665 * b[3] + w * 0.3104856; b[4] = 0.55 * b[4] + w * 0.5329522; b[5] = -0.7616 * b[5] - w * 0.016898;
        const v = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + w * 0.5362) * 0.04; b[6] = w * 0.115926;
        return v;
      }
      let s = 0;
      for (let j = 0; j < 4; j++) {
        const dt = A.mtof(chord[j]) / sr * (1 + (j - 1.5) * 0.002);
        s += 2 * live.ph[j] - 1 - A.polyBlep(live.ph[j], dt);
        live.ph[j] += dt; if (live.ph[j] >= 1) live.ph[j] -= 1;
      }
      return s * 0.09;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(25, sr / 64);
        for (let i = 0; i < n; i++) {
          if ((i & 63) === 0) {
            live.sm.forEach((s, j) => { const b = bands[j]; s.f *= Math.pow(b.f / s.f, k); s.g += (b.g - s.g) * k; s.q += (b.q - s.q) * k; });
            live.cs = live.sm.map((s) => A.biquad('peaking', s.f, effQ(s), P.bypass ? 0 : s.g, sr));
          }
          let x = source(sr);
          for (let j = 0; j < 4; j++) {
            const c = live.cs[j], s = live.st[j];
            const y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
            s.x2 = s.x1; s.x1 = x; s.y2 = s.y1; s.y1 = y; x = y;
          }
          l[i] = x; r[i] = x;
        }
      },
    });

    // 끌기 상태
    let area = { x: 10, y: 10, w: 100, h: 100 }, drag = -1, hover = -1, sel = 1;
    const nodeXY = (b) => ({ x: A.freqX(b.f, area.x, area.w, FMIN, FMAX), y: area.y + area.h * (1 - (b.g - MIN_DB) / (MAX_DB - MIN_DB)) });
    function pick(m) {
      let best = -1, bd = 16;
      bands.forEach((b, j) => { const p = nodeXY(b), d = Math.hypot(p.x - m.x, p.y - m.y); if (d < bd) { bd = d; best = j; } });
      return best;
    }

    return {
      update() {
        snd.update();
        const m = ctx.input.mouse;
        hover = m.inside ? pick(m) : -1;
        if (m.pressed) { drag = hover; if (drag >= 0) sel = drag; }
        if (!m.down) drag = -1;
        if (drag >= 0) {
          const b = bands[drag];
          b.f = U.clamp(A.xFreq(m.x, area.x, area.w, FMIN, FMAX), 25, 18000);
          b.g = Math.round(U.clamp(MIN_DB + (1 - (m.y - area.y) / area.h) * (MAX_DB - MIN_DB), -15, 15) * 2) / 2;
        }
        if (m.wheel && hover >= 0) { const b = bands[hover]; b.q = U.clamp(b.q * Math.pow(1.15, -Math.sign(m.wheel)), 0.3, 10); sel = hover; }
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        area = { x: pad, y: pad, w: W - pad * 2, h: H - pad * 2 - 18 };
        const cs = coefs(SR), o = { minDb: MIN_DB, maxDb: MAX_DB, dbStep: 6 };
        A.drawResponse(g, () => -99, area.x, area.y, area.w, area.h, { ...o, color: 'transparent', label: L('EQ 응답 (가는 선 = 밴드별, 굵은 선 = 합)', 'EQ response (thin = each band, thick = sum)') });
        if (!P.bypass) cs.forEach((c, j) => A.drawResponse(g, (f) => A.biquadResponse(c, f, SR).db, area.x, area.y, area.w, area.h, { ...o, background: false, grid: false, color: BAND_COLS[j], lineWidth: 1 }));
        A.drawResponse(g, (f) => total(cs, f), area.x, area.y, area.w, area.h, { ...o, background: false, grid: false, color: col, lineWidth: 3 });
        bands.forEach((b, j) => {
          const p = nodeXY(b);
          D.circle(g, p.x, p.y, j === hover || j === drag ? 9 : 7, BAND_COLS[j], j === sel ? '#fff' : null, 2);
          D.text(g, String(j + 1), p.x, p.y - 5, { size: 10, align: 'center', color: '#000' });
        });
        D.text(g, L('점 끌기 = 주파수, 게인. 휠 = Q', 'Drag a dot = frequency, gain. Wheel = Q'), pad, H - pad - 12, { size: 10, color: C.dim });
        const b = bands[sel];
        let mx = -99, mn = 99;
        for (let i = 0; i <= 200; i++) { const d = total(cs, 20 * Math.pow(1000, i / 200)); mx = Math.max(mx, d); mn = Math.min(mn, d); }
        ctx.stat(L('선택 밴드', 'Selected band'), `${sel + 1}: ${Math.round(b.f)} Hz, ${b.g >= 0 ? '+' : ''}${b.g} dB`);
        ctx.stat(L('설정 Q / 실효 Q', 'Set Q / Effective Q'), `${b.q.toFixed(2)} / ${effQ(b).toFixed(2)}`);
        ctx.stat(L('전체 최대 / 최소', 'Total max / min'), `${mx.toFixed(1)} / ${mn.toFixed(1)} dB`);
        snd.stat();
      },
      onAction(k) {
        if (k === 'sound') snd.toggle();
        if (k === 'reset') bands = INIT.map((x) => ({ ...x }));
      },
      dispose() { snd.stop(); },
    };
  },
});
