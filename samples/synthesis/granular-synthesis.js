// 그래뉼러 합성: 소리를 수십 ms 조각(그레인)으로 잘라 창을 씌우고 겹쳐 뿌림. 규칙적인 그레인 vs 흩뿌린(지터) 그레인
GTL.register({
  id: 'granular-synthesis',
  title: '그래뉼러 합성 (그레인 크기, 밀도, 지터)',
  summary: '원본 소리를 짧은 조각(그레인)으로 잘라 다시 뿌리는 그래뉼러 합성. 그레인을 일정한 간격으로 뿌리면 밀도 주파수의 윙윙거림이 생기고, 시간과 위치를 흩뜨리면 부드러운 구름 같은 소리가 됨.',
  views: { a: '규칙적 (지터 없음)', b: '흩뿌림 (지터)' },
  controls: '파라미터 표에서 그레인 크기, 밀도, 위치, 지터를 바꿈. "소리 켜기"를 누르면 그레인 구름이 들림.',
  info: `
    <p><b>그래뉼러 합성(Granular Synthesis)</b>은 Iannis Xenakis의 아이디어를 Curtis Roads가 컴퓨터로 구현한 방식. 소리를 1~100ms 정도의 <b>그레인(Grain)</b>으로 잘라 창 함수(여기서는 Hann)를 씌우고, 수십~수백 개를 겹쳐 재생함.</p>
    <ul>
      <li><b>크기</b>: 그레인 길이. 짧으면 원본 음색이 흐려지고 딸깍거림, 길면 원본이 그대로 들림.</li>
      <li><b>밀도</b>: 초당 그레인 수. 크기 x 밀도가 평균 겹침 수.</li>
      <li><b>위치</b>: 원본에서 읽는 지점. 고정하면 소리가 얼어붙은 듯 멈추고(프리즈), 천천히 움직이면 피치 변화 없이 시간이 늘어남(타임 스트레칭).</li>
      <li><b>지터</b>: 시작 시각, 읽는 위치, 좌우 위치를 무작위로 흩뜨림</li>
    </ul>
    <p>지터가 없으면 그레인이 정확히 1/밀도 간격으로 반복되어, 그 간격 자체가 새로운 주기(밀도 Hz의 버즈)로 들림. 지터는 이 주기성을 깨서 소리를 연속적인 질감으로 만듦. 단점은 그레인 수만큼 계산이 늘고, 위상이 엇갈려 원본보다 흐릿해짐.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-dim">${L('원본 소리에서 조각을 읽음', 'Read slices from the source')}</text>
    <rect x="20" y="24" width="500" height="30" class="f-dim"/>
    <path d="M150,54 q20,-30 40,0" class="d-accent"/><path d="M175,54 q20,-30 40,0" class="d-accent"/>
    <text x="195" y="68" text-anchor="middle" class="t-small">${L('위치', 'position')}</text>
    <text x="10" y="92" class="t-small t-a">${L('A: 같은 간격으로 겹침', 'A: same spacing')}</text>
    <path d="M30,120 q20,-28 40,0 M60,120 q20,-28 40,0 M90,120 q20,-28 40,0 M120,120 q20,-28 40,0 M150,120 q20,-28 40,0 M180,120 q20,-28 40,0 M210,120 q20,-28 40,0" class="d-a"/>
    <text x="290" y="92" class="t-small t-b">${L('B: 시간, 높이를 흩뜨림', 'B: scattered in time and height')}</text>
    <path d="M300,120 q20,-28 40,0 M322,112 q20,-28 40,0 M370,124 q20,-28 40,0 M384,116 q20,-28 40,0 M430,120 q20,-28 40,0 M447,110 q20,-28 40,0 M480,126 q20,-28 40,0" class="d-b"/>
    <line x1="30" y1="140" x2="60" y2="140" class="d-dim"/><text x="45" y="156" text-anchor="middle" class="t-small t-dim">1 / ${L('밀도', 'density')}</text>
  </svg>`,
  look: [
    '아래 타임라인에서 A의 그레인은 같은 간격으로 늘어서고, B는 시간과 높이가 흩어짐',
    '"소리 켜기"를 누르고 밀도를 40 근처에 두면 A에서 40Hz 버즈가 섞여 들리고, B는 부드러운 구름 소리',
    '크기를 10ms로 줄이면 원본 음 높이가 흐려지고 거친 질감만 남음. 200ms로 늘리면 원본 선율이 들림.',
    '"위치 자동 이동"을 켜면 원본보다 10배 느리게 같은 선율이 지나감 (피치는 그대로)',
    '피치 퍼짐을 7 반음으로 올리면 그레인마다 음 높이가 달라져 합창 같은 화음 구름이 됨',
  ],
  refs: [
    { type: 'book', title: 'Curtis Roads, Microsound', year: 2001, note: '그래뉼러 합성의 표준 교재' },
    { type: 'paper', title: 'Curtis Roads, "Automated Granular Synthesis of Sound", Computer Music Journal 2(2)', year: 1978, note: '컴퓨터 그래뉼러 합성의 초기 구현' },
    { type: 'book', title: 'Iannis Xenakis, Formalized Music', year: 1971, note: '소리 입자(그레인) 개념' },
    { type: 'paper', title: 'Barry Truax, "Real-Time Granular Synthesis with a Digital Signal Processor", Computer Music Journal 12(2)', year: 1988, note: '실시간 그래뉼러 합성' },
  ],
  params: [
    { key: 'jitter', label: '지터', type: 'range', min: 0, max: 1, step: 0.01, default: 0.6, a: 0, b: 0.6, group: '그레인', help: '시작 시각, 읽는 위치, 좌우 위치를 흩뜨리는 정도' },
    { key: 'size', label: '그레인 크기 (ms)', type: 'range', min: 5, max: 300, step: 1, default: 60, shared: true },
    { key: 'density', label: '밀도 (그레인/초)', type: 'range', min: 2, max: 150, step: 1, default: 40, shared: true },
    { key: 'pos', label: '읽는 위치', type: 'range', min: 0, max: 1, step: 0.001, default: 0.32, shared: true },
    { key: 'scan', label: '위치 자동 이동', type: 'bool', default: false, shared: true, help: '원본보다 10배 느리게 앞으로 이동' },
    { key: 'pitch', label: '피치 (반음)', type: 'range', min: -12, max: 12, step: 1, default: 0, shared: true },
    { key: 'spread', label: '피치 퍼짐 (반음)', type: 'range', min: 0, max: 12, step: 0.1, default: 0, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Granular Synthesis (Grain Size, Density, Jitter)',
    summary: 'Granular synthesis cuts a source sound into short pieces (grains) and scatters them again. Grains at a fixed spacing add a buzz at the density rate. Scattering their time and position gives a smooth, cloud-like sound.',
    views: { a: 'Regular (no jitter)', b: 'Scattered (jitter)' },
    controls: 'Change grain size, density, position and jitter in the parameter table. Press "Sound on" to hear the grain cloud.',
    info: `
    <p><b>Granular synthesis</b> comes from an idea by Iannis Xenakis, first built on computers by Curtis Roads. It cuts sound into <b>grains</b> of about 1 to 100 ms, applies a window (Hann here), and plays tens to hundreds of them overlapped.</p>
    <ul>
      <li><b>Size</b>: grain length. Short grains blur the source and click. Long grains let the source come through.</li>
      <li><b>Density</b>: grains per second. Size x density is the average overlap.</li>
      <li><b>Position</b>: where to read in the source. A fixed position freezes the sound. Moving slowly stretches time without changing pitch (time stretching).</li>
      <li><b>Jitter</b>: randomizes start time, read position and stereo position.</li>
    </ul>
    <p>Without jitter, grains repeat exactly every 1/density seconds, and that spacing becomes a new period you hear (a buzz at the density in Hz). Jitter breaks this period and turns the sound into a continuous texture. The downside: the cost grows with the grain count, and mixed phases make the result blurrier than the source.</p>`,
    look: [
      'In the bottom timeline, A\'s grains line up at equal spacing. B\'s grains are scattered in time and height.',
      'Press "Sound on" and keep density near 40. A has a 40 Hz buzz. B is a smooth cloud.',
      'Lower size to 10 ms. The source pitch blurs and only a rough texture remains. Raise it to 200 ms and you hear the source melody.',
      'Turn on "Auto scan". The same melody passes 10 times slower than the source (pitch stays the same).',
      'Raise pitch spread to 7 semitones. Each grain gets a different pitch and the result is a chorus-like chord cloud.',
    ],
    refs: ['The standard book on granular synthesis.', 'An early computer implementation of granular synthesis.', 'The concept of sound grains.', 'Real-time granular synthesis.'],
    params: {
      jitter: { label: 'Jitter', group: 'Grains', help: 'How much to scatter start time, read position and stereo position' },
      size: 'Grain size (ms)', density: 'Density (grains/s)', pos: 'Read position',
      scan: { label: 'Auto scan', help: 'Moves forward 10 times slower than the source' },
      pitch: 'Pitch (semitones)', spread: 'Pitch spread (semitones)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 원본: 짧은 선율 (톱니 계열 배음 8개, 뜯는 엔벨로프), 48kHz
    const SSR = 48000, MEL = [57, 60, 64, 67, 72, 69, 64, 62], ND = 0.3, SDUR = MEL.length * ND;
    const src = new Float32Array(Math.ceil(SDUR * SSR));
    for (let i = 0; i < src.length; i++) {
      const t = i / SSR, k = Math.floor(t / ND), tn = t - k * ND, f = A.mtof(MEL[k]);
      let s = 0; for (let h = 1; h <= 8; h++) s += Math.sin(TAU * f * h * t) / h;
      src[i] = s * 0.5 * Math.min(1, tn / 0.004) * (0.35 + 0.65 * Math.exp(-tn / 0.12));
    }
    const readSrc = (sec) => { const x = sec * SSR, i = Math.floor(x); if (i < 0 || i >= src.length - 1) return 0; return src[i] + (src[i + 1] - src[i]) * (x - i); };

    // 그레인 엔진. 시간은 초 단위. 소리가 꺼져 있으면 update에서 시각만 진행
    const eng = { t: 0, next: 0, grains: [], log: [], rng: U.rng(ctx.seed || 1) };
    const basePos = (t) => (P.scan ? ((t * 0.1) % SDUR) : P.pos * SDUR);
    function spawn() {
      const r = eng.rng, J = P.jitter, size = P.size / 1000;
      const r1 = r.next() * 2 - 1, r2 = r.next() * 2 - 1, r3 = r.next() * 2 - 1, r4 = r.next() * 2 - 1;
      const semis = P.pitch + r2 * P.spread, rate = Math.pow(2, semis / 12);
      const pos = U.clamp(basePos(eng.next) + r1 * J * 0.25, 0, Math.max(0, SDUR - size * rate));
      const gr = { t0: eng.next, len: size, src: pos, rate, semis, pan: r3 * J };
      eng.grains.push(gr); eng.log.push(gr);
      eng.next += (1 / P.density) * (1 + r4 * J * 0.9);
    }
    function prune() {
      eng.grains = eng.grains.filter((g) => eng.t < g.t0 + g.len);
      if (eng.log.length > 400 || (eng.log.length && eng.log[0].t0 < eng.t - 2)) eng.log = eng.log.filter((g) => g.t0 > eng.t - 2).slice(-400);
    }
    function advanceSilent(dt) {
      const end = eng.t + dt;
      if (eng.next < eng.t - 1) eng.next = eng.t;
      while (eng.next <= end) spawn();
      eng.t = end; prune();
    }

    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const ov = P.size / 1000 * P.density, gn = 1.7 / Math.sqrt(Math.max(1, ov * 0.5));
        if (eng.next < eng.t - 1) eng.next = eng.t;
        for (let i = 0; i < n; i++) {
          while (eng.next <= eng.t) spawn();
          let sl = 0, srr = 0;
          for (let j = 0; j < eng.grains.length; j++) {
            const g = eng.grains[j], k = (eng.t - g.t0) / g.len;
            if (k < 0 || k >= 1) continue;
            const v = readSrc(g.src + (eng.t - g.t0) * g.rate) * (0.5 - 0.5 * Math.cos(TAU * k));
            sl += v * (1 - g.pan) * 0.5; srr += v * (1 + g.pan) * 0.5;
          }
          eng.t += 1 / sr;
          l[i] = Math.tanh(sl * gn) * 0.55; r[i] = Math.tanh(srr * gn) * 0.55;
          if ((i & 255) === 255) prune();
        }
        prune();
      },
    });

    return {
      update(dt) { snd.update(); if (!snd.on) advanceSilent(dt); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 1) 원본과 최근 그레인의 읽기 구간
        const h1 = (H - pad * 3) * 0.45, sx = pad, sw = W - pad * 2;
        A.drawWave(g, src, sx, pad, sw, h1, { color: 'rgba(200,210,230,0.55)', amp: 1.6, lineWidth: 1, label: Lx('원본 소리 (위: 최근 0.5초 동안 읽은 그레인)', 'Source (top: grains read in the last 0.5 s)') });
        g.beginPath();
        for (const gr of eng.log) {
          const age = eng.t - gr.t0; if (age < 0 || age > 0.5) continue;
          const x1 = sx + gr.src / SDUR * sw, x2 = sx + (gr.src + gr.len * gr.rate) / SDUR * sw;
          g.moveTo(x1, pad + h1);
          g.quadraticCurveTo((x1 + x2) / 2, pad + h1 - h1 * 1.2 * (1 - age * 1.6), x2, pad + h1);
        }
        g.strokeStyle = col; g.lineWidth = 1; g.globalAlpha = 0.7; g.stroke(); g.globalAlpha = 1;
        const bp = sx + basePos(eng.t) / SDUR * sw;
        D.line(g, bp, pad, bp, pad + h1, C.text, 1);
        // 2) 출력 타임라인 (최근 1초, 세로 = 그레인 피치)
        const y2 = pad * 2 + h1, h2 = H - y2 - pad, span = 1;
        D.rect(g, sx, y2, sw, h2, 'rgba(0,0,0,0.35)');
        const range = Math.max(1, P.spread) + Math.abs(P.pitch) + 1;
        const ym = (s) => y2 + h2 / 2 - (s / range) * (h2 * 0.4);
        D.line(g, sx, ym(0), sx + sw, ym(0), C.grid, 1);
        let active = 0;
        g.beginPath();
        for (const gr of eng.log) {
          const x1 = sx + (gr.t0 - (eng.t - span)) / span * sw, x2 = x1 + gr.len / span * sw;
          if (x2 < sx || x1 > sx + sw) continue;
          if (eng.t >= gr.t0 && eng.t < gr.t0 + gr.len) active++;
          const yb = ym(gr.semis) + 12;
          g.moveTo(x1, yb); g.quadraticCurveTo((x1 + x2) / 2, yb - 40, x2, yb);
        }
        g.strokeStyle = col; g.lineWidth = 1.2; g.stroke();
        D.text(g, Lx('출력 타임라인 (최근 1초, 세로 = 그레인 피치)', 'Output timeline (last 1 s, vertical = grain pitch)'), sx + 4, y2 + 3, { size: 10, color: C.dim });
        ctx.stat(Lx('평균 겹침 수', 'Average overlap'), (P.size / 1000 * P.density).toFixed(1));
        ctx.stat(Lx('지금 울리는 그레인', 'Grains playing now'), active);
        ctx.stat(Lx('규칙적 반복 주파수', 'Regular repeat rate'), P.jitter < 0.02 ? P.density.toFixed(0) + ' Hz' : Lx('없음 (지터)', 'none (jitter)'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
