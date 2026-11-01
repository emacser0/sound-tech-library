// 엔진 소리: 루프 하나를 RPM에 맞춰 피치만 바꿈 vs RPM별로 녹음한 레이어를 크로스페이드
GTL.register({
  id: 'engine-sound-rpm',
  title: '엔진 소리 RPM 레이어',
  summary: '엔진 루프 하나를 RPM에 맞춰 빠르게, 느리게 재생하면 배기관, 차체의 울림(공명)까지 함께 움직여 낮은 RPM은 느린 화면처럼, 높은 RPM은 장난감처럼 들림. 여러 RPM에서 만든 루프를 가까운 두 개만 섞으면 피치 변화가 작아 공명이 제자리에 있음.',
  views: { a: '루프 하나 + 피치 변경', b: 'RPM 레이어 크로스페이드' },
  controls: '"자동 스로틀"을 끄면 "RPM"을 직접 움직일 수 있음',
  info: `
    <p>레이싱 게임의 엔진 소리는 실제 차를 여러 RPM에서 일정하게 돌리며 녹음한 루프로 만듦. 게임 RPM에 맞추려면 루프의 재생 속도(피치)를 바꿔야 함.</p>
    <p>엔진 소리는 두 부분으로 나뉨</p>
    <ul>
      <li><b>점화 펄스</b>: 4기통 4행정이면 1초에 RPM / 60 × 2번. RPM을 따라 움직여야 함.</li>
      <li><b>공명(포먼트)</b>: 배기관, 흡기, 차체가 울리는 주파수. RPM과 상관없이 거의 고정.</li>
    </ul>
    <p>재생 속도를 바꾸면 두 부분이 같이 움직임. 3600 RPM 루프로 1000 RPM을 내면 공명도 1/3.6로 내려가 먹먹하고 느린 소리가 되고, 7000 RPM에서는 공명이 2배로 올라 작고 가벼운 소리가 됨.</p>
    <p><b>RPM 레이어</b>: 여러 RPM 루프를 두고, 지금 RPM에 가까운 두 개만 등전력 곡선으로 섞음. 각 레이어의 피치 변화가 작아서(보통 ±수 반음) 공명이 거의 제자리. 단점은 녹음과 메모리가 늘고, 레이어 사이에서 두 루프가 겹쳐 위상 간섭(코러스 느낌)이 생길 수 있음. 가속(on-load)과 감속(off-load)을 따로 녹음하고, 그래뉼러 합성으로 이음매를 줄이기도 함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('가로: RPM (로그), 세로: 레이어 게인', 'x: RPM (log), y: layer gain')}</text>
    <line x1="30" y1="150" x2="520" y2="150" class="d-line"/>
    ${[[30, 1000], [140, 2200], [250, 3600], [375, 5200], [520, 7000]].map(([x, r]) => `<text x="${x}" y="166" text-anchor="middle" class="t-small">${r}</text>`).join('')}
    <path d="M30,40 Q85,55 140,150" class="d-b"/><path d="M30,150 Q85,55 140,40 Q195,55 250,150" class="d-b"/>
    <path d="M140,150 Q195,55 250,40 Q312,55 375,150" class="d-b"/><path d="M250,150 Q312,55 375,40 Q447,55 520,150" class="d-b"/><path d="M375,150 Q447,55 520,40" class="d-b"/>
    <path d="M30,40 L520,40" class="d-a" stroke-dasharray="6 4" opacity="0.6"/>
    <text x="250" y="32" text-anchor="middle" class="t-small t-a">${L('A: 3600 RPM 루프 하나를 0.22~1.9배로 재생', 'A: one 3600 RPM loop played at 0.22~1.9x')}</text>
    <text x="250" y="178" text-anchor="middle" class="t-small t-b">${L('B: 가까운 두 레이어만 섞음 (피치 변화 ±7반음 이내)', 'B: only the two nearest layers mix (pitch change within ±7 semitones)')}</text>
  </svg>`,
  look: [
    '스펙트럼의 초록 점선은 실제 차의 고정된 공명 위치. RPM이 1000 근처일 때 A의 봉우리는 점선보다 훨씬 왼쪽에, B는 점선 근처에 있음.',
    '"소리 켜기"를 누르고 A를 들으면 낮은 RPM에서 느린 화면처럼 둔하고, 높은 RPM에서 장난감 차처럼 가벼움',
    '"최대 피치 변화" 측정값이 A는 26반음 넘게, B는 7반음 이내',
    'RPM을 2900 근처(두 레이어 사이)에 두면 아래 레이어 그래프에서 B가 두 루프를 반씩 섞는 것이 보임',
  ],
  refs: [
    { type: 'book', title: 'Andy Farnell, Designing Sound', year: 2010, note: '절차적 엔진 소리 (점화 펄스와 배기관 공명 모델)' },
    { type: 'book', title: 'Richard Stevens, Dave Raybould, The Game Audio Tutorial', year: 2011, note: '차량 엔진 소리를 RPM 루프 크로스페이드로 만드는 실습' },
    { type: 'engine', title: 'Audiokinetic Wwise Help - Blend Container', url: 'https://www.audiokinetic.com/library/edge/?source=Help&id=understanding_blend_containers', note: 'RTPC(RPM)로 여러 레이어를 크로스페이드하는 컨테이너' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '재생 속도 변경이 포먼트를 함께 옮기는 이유, 그래뉼러 합성' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'single', label: '루프 하나 (3600 RPM) + 피치' }, { value: 'layers', label: 'RPM 레이어 5개 크로스페이드' }], a: 'single', b: 'layers', group: '엔진' },
    { key: 'auto', label: '자동 스로틀', type: 'bool', default: true, shared: true, group: '게임', help: '공회전에서 레드존까지 가속, 감속을 반복' },
    { key: 'rpm', label: 'RPM', type: 'range', min: 800, max: 7000, step: 10, default: 1000, shared: true, when: (p) => !p.auto },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Engine Sound RPM Layers',
    summary: 'If one engine loop is played faster or slower to match the RPM, the resonances of the exhaust and body move too. Low RPM sounds like slow motion, high RPM like a toy. Mixing only the two nearest of several loops recorded at different RPMs keeps the pitch change small, so the resonances stay in place.',
    views: { a: 'One loop + pitch change', b: 'RPM layer crossfade' },
    controls: 'Turn off "Auto throttle" to move "RPM" by hand.',
    info: `
    <p>Racing game engine sounds are made from loops recorded while a real car holds steady RPMs. To match the game RPM, the loop playback speed (pitch) must change.</p>
    <p>An engine sound has two parts.</p>
    <ul>
      <li><b>Firing pulses</b>: a 4-cylinder 4-stroke engine fires RPM / 60 × 2 times per second. This must follow the RPM.</li>
      <li><b>Resonances (formants)</b>: frequencies where the exhaust, intake and body ring. They are almost fixed, whatever the RPM.</li>
    </ul>
    <p>Changing playback speed moves both parts together. Making 1000 RPM from a 3600 RPM loop lowers the resonances to 1/3.6, so it sounds dull and slow. At 7000 RPM the resonances double and it sounds small and light.</p>
    <p><b>RPM layers</b>: keep several RPM loops and mix only the two nearest to the current RPM with equal-power curves. Each layer changes pitch only a little (usually a few semitones), so the resonances stay almost in place. Downsides: more recording and memory, and two overlapping loops between layers can cause phase interference (a chorus feel). Games often record on-load (accelerating) and off-load (decelerating) sets separately, and some use granular synthesis to hide the seams.</p>`,
    look: [
      'The green dashed lines on the spectrum are the fixed resonances of the real car. Near 1000 RPM, A\'s peaks are far left of the lines. B\'s are near them.',
      'Press "Sound on" and listen to A. Low RPM sounds dull like slow motion, high RPM sounds light like a toy car.',
      'The "Max pitch change" stat is over 26 semitones in A and within 7 in B.',
      'Set the RPM to about 2900 (between two layers). The layer graph below shows B mixing two loops half and half.',
    ],
    refs: ['Procedural engine sound (firing pulses and exhaust resonance model).', 'Hands-on vehicle engine sound built from crossfaded RPM loops.', 'A container that crossfades layers by an RTPC (RPM).', 'Why changing playback speed also moves formants, and granular synthesis.'],
    params: {
      mode: { label: 'Method', group: 'Engine', options: { single: 'One loop (3600 RPM) + pitch', layers: 'Crossfade 5 RPM layers' } },
      auto: { label: 'Auto throttle', group: 'Game', help: 'Accelerates from idle to the red zone and back, repeatedly' },
      rpm: 'RPM',
      ...GTL.audio.enParams,
    },
  },
  _cache: {},

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;

    const LAYERS = [1000, 2200, 3600, 5200, 7000], SINGLE = 2;
    const RES = [[150, 3, 1], [480, 5, 0.7], [1350, 6, 0.35]];     // 고정 공명: 주파수, Q, 게인
    // RPM 하나에서 일정하게 도는 엔진 "녹음" (끊김 없는 루프)
    function record(rpm, sr, seed) {
      const cycle = 120 / rpm, cycles = Math.max(2, Math.round(0.5 / cycle)), len = Math.round(cycles * cycle * sr);
      const rng = U.rng(seed), filt = RES.map(([f, q]) => A.biquad('bandpass', f, q, 0, sr));
      const imb = [1, 0.78, 0.93, 0.72], out = new Float32Array(len);
      const fire = 4 * cycles, per = len / fire;
      const amp = Array.from({ length: fire }, (_, k) => imb[k % 4] * (0.9 + 0.2 * rng.next()));
      let lp = 0;
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < len; i++) {
          const k = Math.floor(i / per), ph = (i - k * per) / sr;
          const x = amp[k] * Math.exp(-ph * 900) * (1 - Math.exp(-ph * 9000)) + 0.04 * rng.range(-1, 1);
          lp += 0.05 * (x - lp);
          let y = lp * 0.6;
          for (let j = 0; j < 3; j++) y += filt[j].process(x) * RES[j][2];
          if (pass) out[i] = y;   // 두 번째 바퀴만 씀 (필터 상태가 이어져 이음매가 없음)
        }
      }
      return A.normalize(out, 0.5);
    }
    const cache = ctx.def._cache;
    const layers = (sr) => cache[sr] || (cache[sr] = LAYERS.map((r, i) => record(r, sr, 100 + i)));

    // 현재 RPM에서 쓰는 레이어와 게인, 재생 속도
    function mix(rpm) {
      if (P.mode === 'single') return [{ i: SINGLE, g: 1, rate: rpm / LAYERS[SINGLE] }];
      const lr = Math.log(rpm);
      if (rpm <= LAYERS[0]) return [{ i: 0, g: 1, rate: rpm / LAYERS[0] }];
      if (rpm >= LAYERS[4]) return [{ i: 4, g: 1, rate: rpm / LAYERS[4] }];
      let k = 0;
      while (LAYERS[k + 1] < rpm) k++;
      const w = (lr - Math.log(LAYERS[k])) / (Math.log(LAYERS[k + 1]) - Math.log(LAYERS[k]));
      return [{ i: k, g: Math.cos(w * Math.PI / 2), rate: rpm / LAYERS[k] }, { i: k + 1, g: Math.sin(w * Math.PI / 2), rate: rpm / LAYERS[k + 1] }];
    }
    const st = { t: 0, rpm: 1000, pos: [0, 0, 0, 0, 0], g: [0, 0, 0, 0, 0], hist: [] };
    function targetRpm(t) {
      if (!P.auto) return P.rpm;
      const u = (t % 9) / 9;   // 공회전 → 가속 → 유지 → 감속
      if (u < 0.15) return 900;
      if (u < 0.6) return 900 + 6100 * Math.pow((u - 0.15) / 0.45, 0.8);
      if (u < 0.7) return 7000;
      return 7000 - 6100 * (u - 0.7) / 0.3;
    }
    function render1(L1, R1, sr, n, s, fixed) {
      const lay = layers(sr);
      const k = 1 - Math.exp(-1 / (0.06 * sr));
      const tgt = fixed != null ? fixed : targetRpm(s.t);
      for (let i = 0; i < n; i++) {
        s.rpm += (tgt - s.rpm) * k;
        if ((i & 63) === 0) { s.m = mix(s.rpm); for (let j = 0; j < 5; j++) s.tg[j] = 0; for (const e of s.m) s.tg[e.i] = e.g; }
        let y = 0;
        for (let j = 0; j < 5; j++) {
          s.g[j] += (s.tg[j] - s.g[j]) * 0.01;
          if (s.g[j] < 1e-4 && s.tg[j] === 0) continue;
          const buf = lay[j], len = buf.length, p = s.pos[j], i0 = Math.floor(p), fr = p - i0;
          y += (buf[i0 % len] * (1 - fr) + buf[(i0 + 1) % len] * fr) * s.g[j];
          s.pos[j] = (p + s.rpm / LAYERS[j]) % len;
        }
        y *= 0.8;
        L1[i] = y; R1[i] = y;
        s.t += 1 / sr;
      }
    }
    st.tg = [0, 0, 0, 0, 0];
    function step(l, r, sr, n) {
      render1(l, r, sr, n, st);
      st.hist.push(st.rpm);
      if (st.hist.length > 200) st.hist.shift();
    }
    const snd = A.player(ctx, { process: step });
    const bufL = new Float32Array(4800), bufR = new Float32Array(4800);

    // 스펙트럼 (RPM 50 단위와 방식이 바뀔 때만)
    let key = '', mags = null;
    const tmpL = new Float32Array(8192), tmpR = new Float32Array(8192);
    function analyze() {
      const rq = Math.round(st.rpm / 50) * 50, k = rq + P.mode;
      if (k === key) return;
      key = k;
      const s = { t: 0, rpm: rq, pos: [0, 0, 0, 0, 0], g: [0, 0, 0, 0, 0], tg: [0, 0, 0, 0, 0] };
      const m = mix(rq);
      for (const e of m) s.g[e.i] = e.g;
      render1(tmpL, tmpR, 48000, 8192, s, rq);
      mags = A.spectrum(tmpL, 8192, { window: 'hann' });
    }

    return {
      update(dt) {
        snd.update();
        if (!snd.on) step(bufL, bufR, 48000, Math.min(4800, Math.round(dt * 48000)));
      },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        const sh = Math.max(80, H * 0.5);
        A.drawSpectrum(g, mags, 48000, pad, pad, tw, sh, { fmin: 30, fmax: 5000, minDb: -80, maxDb: -10, color: col, label: L('스펙트럼', 'Spectrum') });
        g.setLineDash([4, 3]);
        for (const [f] of RES) { const x = A.freqX(f, pad, tw, 30, 5000); D.line(g, x, pad, x, pad + sh, C.good, 1.5); }
        g.setLineDash([]);
        const m = mix(st.rpm);
        // 실제 재생에서 공명이 옮겨 간 자리
        for (const e of m) if (e.g > 0.2) for (const [f] of RES) {
          const x = A.freqX(f * e.rate, pad, tw, 30, 5000);
          D.poly(g, [{ x: x - 5, y: pad + sh }, { x: x + 5, y: pad + sh }, { x, y: pad + sh - 9 }], col);
        }
        D.text(g, L('초록 점선 = 실제 공명, ▲ = 재생 중인 공명 위치', 'Green dashed = real resonances, ▲ = where they are now'), pad + 4, pad + 16, { size: 10, color: C.dim });
        // 레이어 게인 그래프
        const gy = pad * 2 + sh + 6, gh = H - gy - 30, LX = (rpm) => pad + Math.log(rpm / 800) / Math.log(7000 / 800) * tw;
        if (gh > 30) {
          D.rect(g, pad, gy, tw, gh, 'rgba(0,0,0,0.35)');
          LAYERS.forEach((r, i) => {
            const x = LX(r);
            const on = P.mode === 'layers' || i === SINGLE;
            D.line(g, x, gy, x, gy + gh, on ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', 1);
            D.text(g, String(r), x, gy + gh + 2, { size: 9, color: on ? C.dim : 'rgba(125,133,148,0.4)', align: 'center' });
            const gv = st.g[i];
            D.rect(g, x - 8, gy + gh - gv * (gh - 14), 16, gv * (gh - 14), col);
          });
          const x = LX(st.rpm);
          D.line(g, x, gy, x, gy + gh, C.warn, 2);
          D.text(g, L('레이어 게인 (녹음 RPM 위치)', 'Layer gain (at recorded RPM)'), pad + 4, gy + 3, { size: 10, color: C.dim });
        }
        const semis = Math.max(0, ...m.filter((e) => e.g > 0.3).map((e) => Math.abs(12 * Math.log2(e.rate))));
        const maxSemi = P.mode === 'single' ? Math.max(Math.abs(12 * Math.log2(800 / 3600)), 12 * Math.log2(7000 / 3600)) : 12 * Math.log2(2200 / 1000) / 2;
        ctx.stat('RPM', Math.round(st.rpm));
        ctx.stat(L('점화 주파수', 'Firing frequency'), (st.rpm / 30).toFixed(1) + ' Hz');
        ctx.stat(L('지금 피치 변화', 'Current pitch change'), semis.toFixed(1) + L(' 반음', ' semitones'));
        ctx.stat(L('최대 피치 변화 (800~7000)', 'Max pitch change (800~7000)'), '±' + maxSemi.toFixed(1) + L(' 반음', ' semitones'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
