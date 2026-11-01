// 바닥 반사와 콤 필터: 직접음 + 늦게 도착한 반사음 = 일정 간격의 골(노치). 마이크를 바닥에 붙이면(바운더리 마이크) 사라짐
GTL.register({
  id: 'reflection-comb-filter',
  title: '바닥 반사와 콤 필터 (마이크 높이)',
  summary: '마이크에는 직접음과 바닥에서 반사된 소리가 조금 늦게 함께 도착함. 두 소리가 더해지면 일정 간격으로 골이 파인 빗살 모양 응답(콤 필터)이 생김. 마이크를 바닥에 붙이면 지연이 0에 가까워져 골이 사라짐.',
  views: { a: '마이크 높이 1m', b: '바닥에 붙인 마이크 (1cm)' },
  controls: '파라미터 표에서 마이크 높이, 반사율을 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 마이크 소리가 들림.',
  info: `
    <p>스피커나 악기의 소리는 마이크로 바로 오는 길(직접음)과 바닥, 벽, 책상에 반사되어 오는 길(반사음)로 나뉨. 반사음은 길이 길어서 조금 늦게 도착함.</p>
    <p>시간 차이 τ인 두 신호를 더하면 주파수마다 위상차가 2πfτ로 달라짐. 위상이 반대가 되는 주파수 f = (2k+1) / (2τ)마다 골(노치)이 생기고, 그 사이에서는 최대 +6dB 커짐. 응답 모양이 빗살 같아서 <b>콤 필터(Comb Filter)</b>라고 부름.</p>
    <ul>
      <li>경로 차이 34cm면 지연 1ms, 첫 골 500Hz, 골 간격 1kHz</li>
      <li>소리가 "통 속에서 나는" 것처럼 비어 들림. 마이크나 연주자가 움직이면 골이 움직여 "슈욱" 하는 플랜저 소리가 남.</li>
      <li><b>해결</b>: 마이크를 반사면에 붙이기(바운더리 마이크, PZM), 흡음재로 반사율 낮추기, 반사면에서 멀리 떨어뜨려 반사음을 작게 하기</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="150" x2="300" y2="150" class="d-line"/>
    <text x="160" y="168" text-anchor="middle" class="t-small t-dim">${L('바닥 (반사면)', 'Floor (reflecting surface)')}</text>
    <rect x="30" y="56" width="16" height="24" class="f-dim"/>
    <text x="38" y="48" text-anchor="middle" class="t-small">${L('음원', 'Source')}</text>
    <circle cx="270" cy="96" r="6" class="f-a"/>
    <text x="270" y="84" text-anchor="middle" class="t-small t-a">${L('마이크', 'Mic')}</text>
    <line x1="46" y1="68" x2="264" y2="96" class="d-line"/>
    <path d="M46,72 L170,150 L266,100" class="d-a" stroke-dasharray="5 3"/>
    <text x="150" y="70" class="t-small">${L('직접음', 'Direct')}</text>
    <text x="196" y="138" class="t-small t-a">${L('반사음 (더 김, 늦음)', 'Reflection (longer, later)')}</text>
    <line x1="330" y1="40" x2="520" y2="40" class="d-dim"/>
    <path d="M330,40 Q345,25 360,40 Q362,80 365,40 Q380,25 395,40 Q397,80 400,40 Q415,25 430,40 Q432,80 435,40 Q450,25 465,40 Q467,80 470,40 Q485,25 500,40 Q502,80 505,40" class="d-a"/>
    <text x="425" y="104" text-anchor="middle" class="t-small">${L('골 위치: f = (2k+1) / 2τ', 'Notches at f = (2k+1) / 2τ')}</text>
    <text x="425" y="122" text-anchor="middle" class="t-small t-dim">${L('τ = (반사 경로 - 직접 경로) / c', 'τ = (reflected path - direct path) / c')}</text>
    <line x1="330" y1="146" x2="520" y2="146" class="d-b"/>
    <text x="425" y="166" text-anchor="middle" class="t-small t-b">${L('바닥에 붙이면 τ ≈ 0: 평탄하게 +6dB', 'On the floor τ ≈ 0: flat +6 dB')}</text>
  </svg>`,
  look: [
    'A의 응답 곡선에서 골이 일정 간격으로 파인 빗살 모양이 보임. B는 들리는 대역에서 거의 평탄함.',
    '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 A의 노이즈가 비어 있고 음색이 있는 소리로 들림',
    '"마이크 흔들기"를 켜면 골이 좌우로 움직이며 "슈욱" 하는 플랜저 소리가 남',
    '반사율을 0.2로 낮추면(흡음재) 골이 얕아지고 "최대 골 깊이" 측정값이 작아짐',
  ],
  refs: [
    { type: 'book', title: 'F. Alton Everest, Ken C. Pohlmann, Master Handbook of Acoustics', note: '콤 필터와 반사면 근처의 마이크' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects (2nd ed.)', year: 2011, note: '콤 필터와 플랜저의 지연선 구조' },
    { type: 'article', title: 'Crown International, The Crown Boundary Microphone Application Guide', note: 'PZM 바운더리 마이크의 원리' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '피드포워드 콤 필터' },
  ],
  params: [
    { key: 'hm', label: '마이크 높이 (m)', type: 'range', min: 0.01, max: 2, step: 0.01, a: 1, b: 0.01, default: 1, group: '배치' },
    { key: 'refl', label: '반사율', type: 'range', min: 0, max: 1, step: 0.01, default: 0.9, shared: true, group: '배치', help: '1 = 단단한 바닥, 0 = 완전 흡음' },
    { key: 'hs', label: '음원 높이 (m)', type: 'range', min: 0.2, max: 2, step: 0.01, default: 1.2, shared: true, group: '배치' },
    { key: 'dist', label: '수평 거리 (m)', type: 'range', min: 0.5, max: 6, step: 0.1, default: 2, shared: true, group: '배치' },
    { key: 'wobble', label: '마이크 흔들기', type: 'bool', default: false, shared: true, group: '배치', help: '마이크 높이를 천천히 ±20% 바꿈' },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'pink', label: '핑크 노이즈' }, { value: 'buzz', label: '톱니파 110Hz' }], default: 'pink', shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Floor Reflection and Comb Filtering (Mic Height)',
    summary: 'A mic picks up the direct sound and, a little later, the sound reflected from the floor. Adding the two gives a response with evenly spaced dips, shaped like a comb (a comb filter). Put the mic on the floor and the delay drops to almost zero, so the dips disappear.',
    views: { a: 'Mic at 1 m', b: 'Mic on the floor (1 cm)' },
    controls: 'Change the mic height and reflection coefficient in the parameter table. Press "Sound on" to hear the mic in the selected view.',
    info: `
    <p>Sound from a speaker or instrument reaches the mic by a direct path and by paths that bounce off the floor, walls or a desk. The reflected path is longer, so it arrives a little later.</p>
    <p>When you add two signals that are τ apart, the phase difference at each frequency is 2πfτ. Where the phases are opposite, at f = (2k+1) / (2τ), you get a dip (notch). Between the dips the level rises by up to 6 dB. The response looks like the teeth of a comb, so this is called a <b>comb filter</b>.</p>
    <ul>
      <li>A 34 cm path difference gives a 1 ms delay, a first notch at 500 Hz and a notch spacing of 1 kHz.</li>
      <li>The sound becomes hollow, like it comes from inside a tube. When the mic or player moves, the notches move and you hear a "whoosh" like a flanger.</li>
      <li><b>Fixes</b>: put the mic right on the surface (boundary mic, PZM), absorb the reflection, or move away from the surface so the reflection is weaker.</li>
    </ul>`,
    look: [
      'A\'s response shows evenly spaced dips, like a comb. B is almost flat in the audible range.',
      'Press "Sound on" and switch between A and B. A\'s noise sounds hollow and slightly pitched.',
      'Turn on "Wobble mic". The dips slide left and right, and you hear a flanger whoosh.',
      'Lower the reflection coefficient to 0.2 (absorber). The dips get shallow, and the "Deepest dip" stat gets smaller.',
    ],
    refs: ['Comb filtering and mics near reflecting surfaces.', 'Delay-line structure of comb filters and flangers.', 'How PZM boundary mics work.', 'Feedforward comb filters.'],
    params: {
      hm: { label: 'Mic height (m)', group: 'Placement' },
      refl: { label: 'Reflection coefficient', group: 'Placement', help: '1 = hard floor, 0 = full absorption' },
      hs: { label: 'Source height (m)', group: 'Placement' },
      dist: { label: 'Horizontal distance (m)', group: 'Placement' },
      wobble: { label: 'Wobble mic', group: 'Placement', help: 'Slowly moves the mic height by ±20%' },
      src: { label: 'Source', group: 'Sound', options: { pink: 'Pink noise', buzz: 'Saw 110 Hz' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SPEED = 343;
    let t = 0;

    const micH = (tt) => (P.wobble ? Math.max(0.005, P.hm * (1 + 0.2 * Math.sin(U.TAU * 0.15 * tt))) : P.hm);
    // 경로 길이, 지연, 반사 게인
    function geom(hm) {
      const dd = Math.hypot(P.dist, P.hs - hm), dr = Math.hypot(P.dist, P.hs + hm);
      return { dd, dr, tau: (dr - dd) / SPEED, g: P.refl * dd / dr };
    }
    const respDb = (f, gm) => A.linToDb(Math.hypot(1 + gm.g * Math.cos(U.TAU * f * gm.tau), gm.g * Math.sin(U.TAU * f * gm.tau)));

    // 소리: 직접음 + 분수 지연된 반사음
    const BUF = 8192;
    const line = new Float32Array(BUF);
    const rng = GTL.util.rng(ctx.seed || 1);
    const live = { w: 0, delay: 0, g: 0, b: [0, 0, 0, 0, 0, 0, 0], ph: 0, time: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(8, sr);
        for (let i = 0; i < n; i++) {
          live.time += 1 / sr;
          const gm = geom(micH(live.time));
          live.delay += (gm.tau * sr - live.delay) * k;
          live.g += (gm.g - live.g) * k;
          let x;
          if (P.src === 'buzz') { live.ph += 110 / sr; if (live.ph >= 1) live.ph -= 1; x = (2 * live.ph - 1 - A.polyBlep(live.ph, 110 / sr)) * 0.5; }
          else { // 핑크 노이즈 (Paul Kellet)
            const w = rng.range(-1, 1), b = live.b;
            b[0] = 0.99886 * b[0] + w * 0.0555179; b[1] = 0.99332 * b[1] + w * 0.0750759; b[2] = 0.969 * b[2] + w * 0.153852;
            b[3] = 0.8665 * b[3] + w * 0.3104856; b[4] = 0.55 * b[4] + w * 0.5329522; b[5] = -0.7616 * b[5] - w * 0.016898;
            x = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + w * 0.5362) * 0.11; b[6] = w * 0.115926;
          }
          line[live.w] = x;
          const d = U.clamp(live.delay, 0, BUF - 2), di = Math.floor(d), fr = d - di;
          const i0 = (live.w - di + BUF) % BUF, i1 = (i0 - 1 + BUF) % BUF;
          const y = x + live.g * (line[i0] * (1 - fr) + line[i1] * fr);
          live.w = (live.w + 1) % BUF;
          const v = y * 0.45; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) { t += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const hm = micH(t), gm = geom(hm);
        // 배치 그림
        const gh = Math.max(70, H * 0.36), gx = pad, gw = W - pad * 2;
        D.rect(g, gx, pad, gw, gh, 'rgba(0,0,0,0.35)');
        const floorY = pad + gh - 14, sc = Math.min((gh - 30) / 2.1, (gw - 60) / P.dist);
        const sx = gx + 30, mx = sx + P.dist * sc;
        const sy = floorY - P.hs * sc, my = floorY - hm * sc;
        D.line(g, gx, floorY, gx + gw, floorY, C.text, 2);
        const rx = sx + (mx - sx) * P.hs / (P.hs + hm);
        D.line(g, sx, sy, mx, my, 'rgba(255,255,255,0.8)', 1.5);
        g.setLineDash([5, 3]);
        D.line(g, sx, sy, rx, floorY, col, 1.5); D.line(g, rx, floorY, mx, my, col, 1.5);
        g.setLineDash([]);
        D.rect(g, sx - 8, sy - 10, 12, 20, '#555', C.text);
        D.circle(g, mx, my, 5, col);
        D.text(g, Lx('음원', 'Source'), sx - 2, sy - 24, { size: 10, color: C.text, align: 'center' });
        D.text(g, Lx('마이크', 'Mic') + ` ${(hm * 100).toFixed(0)}cm`, Math.min(mx, gx + gw - 50), my - 18, { size: 10, color: col, align: 'center' });
        D.text(g, Lx('흰 선: 직접음, 점선: 바닥 반사음', 'White: direct, dashed: floor reflection'), gx + 4, pad + 3, { size: 10, color: C.dim });

        // 주파수 응답
        const ry = pad * 2 + gh, rh = H - ry - pad;
        A.drawResponse(g, (f) => respDb(f, gm), pad, ry, W - pad * 2, rh, { fmin: 20, fmax: 20000, minDb: -30, maxDb: 12, dbStep: 6, color: col, label: Lx('마이크에서의 주파수 응답', 'Frequency response at the mic') });
        // 골 위치 표시
        if (gm.tau > 1e-6) for (let k = 0; k < 6; k++) {
          const f = (2 * k + 1) / (2 * gm.tau);
          if (f > 20000) break;
          const px = A.freqX(f, pad, W - pad * 2, 20, 20000);
          D.line(g, px, ry + rh - 6, px, ry + rh, C.accent, 2);
        }

        const notch = gm.tau > 0 ? 1 / (2 * gm.tau) : Infinity;
        ctx.stat(Lx('경로 차이', 'Path difference'), ((gm.dr - gm.dd) * 100).toFixed(1) + ' cm');
        ctx.stat(Lx('반사음 지연', 'Reflection delay'), (gm.tau * 1000).toFixed(3) + ' ms');
        ctx.stat(Lx('첫 골 주파수', 'First notch'), notch > 1e6 ? '-' : (notch >= 1000 ? (notch / 1000).toFixed(2) + ' kHz' : notch.toFixed(0) + ' Hz'));
        ctx.stat(Lx('최대 골 깊이', 'Deepest dip'), (gm.g >= 0.999 ? '-∞' : A.linToDb(1 - gm.g).toFixed(1)) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
