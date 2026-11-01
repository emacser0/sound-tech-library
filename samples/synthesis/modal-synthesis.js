// 모달 합성: 물체의 진동 모드를 감쇠 공진기 여러 개로 흉내 냄. 배음 모드(현) vs 비배음 모드(막대, 막, 종)
GTL.register({
  id: 'modal-synthesis',
  title: '모달 합성 (배음 vs 비배음 모드)',
  summary: '두드린 물체는 고유한 주파수(모드)로 진동하다 사라짐. 모드마다 감쇠 공진기를 하나씩 두면 그 물체 소리가 남. 모드가 배음 관계면 음 높이가 분명하고, 아니면 막대, 북, 종처럼 들림.',
  views: { a: '현 (배음 모드)', b: '막대 (비배음 모드)' },
  controls: '파라미터 표에서 물체 종류, 감쇠, 말렛 경도를 바꿈. "소리 켜기"를 누르면 두드리는 선율이 반복됨.',
  info: `
    <p>물체를 두드리면 모양과 재질이 정하는 몇 개의 <b>진동 모드(Mode)</b>로 울림. 모드마다 주파수, 크기, 감쇠 시간이 있음. <b>모달 합성(Modal Synthesis)</b>은 모드 하나를 감쇠하는 2차 공진기 하나로 만들고, 공진기들을 충격(임펄스)으로 함께 울림.</p>
    <ul>
      <li><b>현, 관</b>: 모드가 1, 2, 3, 4배. 배음 관계라 음 높이가 분명함.</li>
      <li><b>양끝이 자유로운 막대</b>: 1, 2.76, 5.40, 8.93배. 마림바는 막대 아래를 깎아 2번 모드를 4배(두 옥타브)로, 실로폰은 3배로 맞춤.</li>
      <li><b>원형 막(북)</b>: 1, 1.59, 2.14, 2.30, 2.65배. 음 높이가 흐림.</li>
      <li><b>교회 종</b>: 0.5, 1, 1.2, 1.5, 2배 등. 1.2배(단3도) 모드 때문에 종 특유의 슬픈 소리가 남.</li>
    </ul>
    <p>공진기 식: <code>y[n] = 2r cos(&omega;) y[n-1] - r&sup2; y[n-2] + x[n]</code>. r은 감쇠 시간에서, &omega;는 모드 주파수에서 계산함. 높은 모드일수록 빨리 사라지게 하면 실제 물체와 비슷해짐. 말렛이 단단하면 높은 모드를 세게 울림.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-dim">${L('모드 주파수 (기본 모드 = 1)', 'Mode frequencies (first mode = 1)')}</text>
    <line x1="60" y1="60" x2="520" y2="60" class="d-line"/><line x1="60" y1="130" x2="520" y2="130" class="d-line"/>
    <text x="10" y="64" class="t-small t-a">${L('현', 'String')}</text><text x="10" y="134" class="t-small t-b">${L('막대', 'Bar')}</text>
    <g class="d-a"><line x1="100" y1="60" x2="100" y2="30"/><line x1="140" y1="60" x2="140" y2="38"/><line x1="180" y1="60" x2="180" y2="44"/><line x1="220" y1="60" x2="220" y2="48"/><line x1="260" y1="60" x2="260" y2="51"/><line x1="300" y1="60" x2="300" y2="53"/><line x1="340" y1="60" x2="340" y2="55"/><line x1="380" y1="60" x2="380" y2="56"/></g>
    <g class="d-b"><line x1="100" y1="130" x2="100" y2="96"/><line x1="170" y1="130" x2="170" y2="104"/><line x1="276" y1="130" x2="276" y2="112"/><line x1="417" y1="130" x2="417" y2="118"/></g>
    <g class="d-dim" stroke-dasharray="2 3"><line x1="140" y1="70" x2="140" y2="130"/><line x1="180" y1="70" x2="180" y2="130"/><line x1="220" y1="70" x2="220" y2="130"/><line x1="260" y1="70" x2="260" y2="130"/><line x1="300" y1="70" x2="300" y2="130"/><line x1="340" y1="70" x2="340" y2="130"/><line x1="380" y1="70" x2="380" y2="130"/><line x1="420" y1="70" x2="420" y2="130"/></g>
    <text x="100" y="148" text-anchor="middle" class="t-small">1</text><text x="170" y="148" text-anchor="middle" class="t-small">2.76</text><text x="276" y="148" text-anchor="middle" class="t-small">5.40</text><text x="417" y="148" text-anchor="middle" class="t-small">8.93</text>
    <text x="520" y="90" text-anchor="end" class="t-small t-dim">${L('점선 = 배음 위치', 'dotted = harmonic positions')}</text>
  </svg>`,
  look: [
    '위 그래프에서 A의 모드는 모두 초록 점선(배음 위치) 위에 있고, B의 모드는 점선 사이에 있음',
    '"소리 켜기"를 누르고 두 뷰를 번갈아 들으면 A는 하프 같은 음, B는 조율하지 않은 막대를 두드린 금속성 소리',
    '물체를 "교회 종"으로 바꾸면 기본 모드 아래에 0.5배 모드(험 톤)가 생기고 길게 남음',
    '고음 감쇠를 0으로 내리면 모든 모드가 같은 시간 동안 울려 금속처럼 쨍한 소리가 남. 아래 감쇠 곡선이 모두 겹침.',
    '말렛 경도를 낮추면 높은 모드 막대가 낮아지고 소리가 부드러워짐',
  ],
  refs: [
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments', year: 1998, note: '막대, 막, 종의 모드 주파수 비율' },
    { type: 'paper', title: 'Jean-Marie Adrien, "The Missing Link: Modal Synthesis", in Representations of Musical Signals (MIT Press)', year: 1991, note: '모달 합성 정리' },
    { type: 'book', title: 'Perry R. Cook, Real Sound Synthesis for Interactive Applications', year: 2002, note: '모달 공진기로 두드리는 소리 만들기' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: '2차 공진기와 모드 합성' },
  ],
  params: [
    { key: 'object', label: '물체', type: 'select', options: [
      { value: 'string', label: '현 (배음)' }, { value: 'freebar', label: '막대 (깎지 않음)' }, { value: 'bar', label: '마림바 막대 (조율)' },
      { value: 'membrane', label: '원형 막 (북)' }, { value: 'bell', label: '교회 종' }], default: 'freebar', a: 'string', b: 'freebar', group: '물체' },
    { key: 't60', label: '감쇠 시간 T60 (초)', type: 'range', min: 0.1, max: 6, step: 0.05, default: 1.6, shared: true, help: '기본 모드가 -60dB가 될 때까지' },
    { key: 'damp', label: '고음 감쇠', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5, shared: true, help: '높은 모드가 더 빨리 사라지는 정도' },
    { key: 'hard', label: '말렛 경도', type: 'range', min: 0, max: 1, step: 0.01, default: 0.6, shared: true },
    { key: 'shift', label: '음역 (반음)', type: 'int', min: -12, max: 12, default: 0, shared: true, group: '선율' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Modal Synthesis (Harmonic vs Inharmonic Modes)',
    summary: 'A struck object rings at its own frequencies (modes) and then fades. One decaying resonator per mode recreates that object. Harmonic modes give a clear pitch. Other mode patterns sound like bars, drums or bells.',
    views: { a: 'String (harmonic modes)', b: 'Bar (inharmonic modes)' },
    controls: 'Change the object, decay and mallet hardness in the parameter table. Press "Sound on" to hear a struck melody loop.',
    info: `
    <p>A struck object rings in a few <b>vibration modes</b> set by its shape and material. Each mode has a frequency, a level and a decay time. <b>Modal synthesis</b> builds each mode from one decaying 2nd order resonator and rings them all with an impulse.</p>
    <ul>
      <li><b>Strings, tubes</b>: modes at 1, 2, 3, 4 times. They are harmonic, so the pitch is clear.</li>
      <li><b>Bar with free ends</b>: 1, 2.76, 5.40, 8.93 times. A marimba bar is carved underneath to tune mode 2 to 4 times (two octaves). A xylophone tunes it to 3 times.</li>
      <li><b>Circular membrane (drum)</b>: 1, 1.59, 2.14, 2.30, 2.65 times. The pitch is vague.</li>
      <li><b>Church bell</b>: 0.5, 1, 1.2, 1.5, 2 times and more. The 1.2 mode (a minor third) gives bells their sad color.</li>
    </ul>
    <p>Resonator: <code>y[n] = 2r cos(&omega;) y[n-1] - r&sup2; y[n-2] + x[n]</code>. r comes from the decay time and &omega; from the mode frequency. Real objects sound closer when higher modes fade faster. A hard mallet excites higher modes more strongly.</p>`,
    look: [
      'In the top graph, all of A\'s modes sit on the green dotted lines (harmonic positions). B\'s modes fall between them.',
      'Press "Sound on" and switch views. A sounds like a harp. B sounds like a struck untuned bar, a bit metallic.',
      'Set the object to "Church bell". A 0.5 times mode (the hum tone) appears below the first mode and rings long.',
      'Lower high damping to 0. All modes ring for the same time and the sound turns bright and metallic. The decay curves below all overlap.',
      'Lower mallet hardness. The high mode bars drop and the sound gets softer.',
    ],
    refs: ['Mode frequency ratios of bars, membranes and bells.', 'An overview of modal synthesis.', 'Struck sounds with modal resonators.', 'Two-pole resonators and modal synthesis.'],
    params: {
      object: { label: 'Object', group: 'Object', options: { string: 'String (harmonic)', freebar: 'Bar (not carved)', bar: 'Marimba bar (tuned)', membrane: 'Circular membrane (drum)', bell: 'Church bell' } },
      t60: { label: 'Decay time T60 (s)', help: 'Time for the first mode to reach -60 dB' },
      damp: { label: 'High damping', help: 'How much faster higher modes fade' },
      hard: 'Mallet hardness',
      shift: { label: 'Register (semitones)', group: 'Melody' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 모드 비율과 기본 크기
    const OBJ = {
      string: { r: [1, 2, 3, 4, 5, 6, 7, 8], a: [1, 0.5, 0.33, 0.25, 0.2, 0.17, 0.14, 0.12] },
      bar: { r: [1, 3.98, 9.9], a: [1, 0.45, 0.2] },                      // 마림바: 2번 모드를 약 4배로 조율
      freebar: { r: [1, 2.756, 5.404, 8.933, 13.344, 18.637], a: [1, 0.6, 0.35, 0.2, 0.12, 0.08] },
      membrane: { r: [1, 1.594, 2.136, 2.296, 2.653, 2.918, 3.156, 3.501], a: [1, 0.8, 0.6, 0.5, 0.4, 0.35, 0.3, 0.25] },
      bell: { r: [0.5, 1, 1.2, 1.5, 2, 2.5, 3, 4], a: [0.7, 1, 0.8, 0.5, 0.6, 0.35, 0.25, 0.15] },
    };
    const MEL = [72, 76, 79, 84, 79, 76, 74, 71], STEP = 0.45, LOOP = STEP * MEL.length;
    const noteOf = (i) => MEL[i % MEL.length] + P.shift;
    // 모드 목록: { f, amp, t60 }
    function modes(f0, sr) {
      const o = OBJ[P.object], out = [];
      for (let k = 0; k < o.r.length; k++) {
        const f = f0 * o.r[k];
        if (f > sr * 0.45) continue;
        const amp = o.a[k] * Math.pow(o.r[k], -(1 - P.hard) * 1.5);
        out.push({ f, ratio: o.r[k], amp, t60: P.t60 / (1 + P.damp * 2 * (o.r[k] - 1)) * (o.r[k] < 1 ? 1.5 : 1) });
      }
      return out;
    }
    function bank(f0, sr) {
      return modes(f0, sr).map((m) => {
        const w = TAU * m.f / sr, r = Math.pow(10, -3 / (m.t60 * sr));
        return { c1: 2 * r * Math.cos(w), c2: -r * r, g: m.amp * Math.sin(w), y1: 0, y2: 0 };
      });
    }
    const tickBank = (b, x) => { let s = 0; for (const m of b) { const y = m.c1 * m.y1 + m.c2 * m.y2 + m.g * x; m.y2 = m.y1; m.y1 = y; s += y; } return s; };

    const live = { n: 0, voices: [null, null, null], last: -1 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) {
          const t = (live.n++ / sr) % LOOP, idx = Math.floor(t / STEP);
          let x = 0;
          if (idx !== live.last) { live.last = idx; live.voices[idx % 3] = bank(A.mtof(noteOf(idx)), sr); x = 1; }
          let o = 0;
          for (let v = 0; v < 3; v++) if (live.voices[v]) o += tickBank(live.voices[v], v === idx % 3 ? x : 0);
          o *= 0.3; l[i] = o; r[i] = o;
        }
      },
    });

    const SR = 48000;
    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const t = (snd.on ? live.n / (snd.sr || SR) : visT) % LOOP, idx = Math.floor(t / STEP), tn = t - idx * STEP;
        const f0 = A.mtof(noteOf(idx)), ms = modes(f0, SR);
        // 1) 모드 막대 (선형 축, 기본 모드 비율 0 ~ 최대)
        const h1 = (H - pad * 3) * 0.45, sw = W - pad * 2, rmax = Math.max(9, ...ms.map((m) => m.ratio)) * 1.08;
        D.rect(g, pad, pad, sw, h1, 'rgba(0,0,0,0.35)');
        const rx = (r) => pad + r / rmax * sw;
        g.setLineDash([3, 3]);
        for (let h = 1; h < rmax; h++) D.line(g, rx(h), pad, rx(h), pad + h1, 'rgba(102,209,122,0.45)', 1);
        g.setLineDash([]);
        const amax = Math.max(...ms.map((m) => m.amp), 1e-6);
        ms.forEach((m) => {
          const now = m.amp * Math.pow(10, -3 * tn / m.t60);
          D.line(g, rx(m.ratio), pad + h1, rx(m.ratio), pad + h1 - m.amp / amax * (h1 - 22), 'rgba(200,210,230,0.3)', 5);
          D.line(g, rx(m.ratio), pad + h1, rx(m.ratio), pad + h1 - now / amax * (h1 - 22), col, 5);
          D.text(g, m.ratio.toFixed(2), rx(m.ratio), pad + h1 - m.amp / amax * (h1 - 22) - 12, { size: 9, color: C.dim, align: 'center' });
        });
        D.text(g, Lx('모드 (주파수 / 기본 주파수). 회색 = 처음 크기, 색 = 지금', 'Modes (frequency / fundamental). Gray = initial, color = now'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 2) 모드별 감쇠 곡선 (dB, 0 ~ 최대 T60)
        const y2 = pad * 2 + h1, h2 = H - y2 - pad, tmax = Math.max(0.5, P.t60 * 1.5);
        D.rect(g, pad, y2, sw, h2, 'rgba(0,0,0,0.35)');
        ms.forEach((m, k) => {
          g.beginPath();
          for (let i = 0; i <= 80; i++) {
            const tt = i / 80 * tmax, db = A.linToDb(m.amp / amax) - 60 * tt / m.t60;
            const px = pad + i / 80 * sw, py = y2 + h2 - U.clamp((db + 70) / 70, 0, 1) * h2;
            i ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.strokeStyle = C.series[k % C.series.length]; g.lineWidth = 1.5; g.stroke();
        });
        const px = pad + Math.min(1, tn / tmax) * sw;
        D.line(g, px, y2, px, y2 + h2, C.text, 1);
        D.text(g, Lx(`모드별 감쇠 (dB, 0 ~ ${tmax.toFixed(1)}초)`, `Decay per mode (dB, 0 to ${tmax.toFixed(1)} s)`), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 배음에서 벗어난 정도: 각 모드와 가장 가까운 배음(기본 모드 기준) 사이 센트의 평균
        let dev = 0; ms.forEach((m) => { const h = Math.max(1, Math.round(m.ratio)); dev += Math.abs(1200 * Math.log2(m.ratio / h)); });
        ctx.stat(Lx('현재 음', 'Current note'), `${A.noteName(noteOf(idx))} (${f0.toFixed(1)} Hz)`);
        ctx.stat(Lx('모드 수', 'Modes'), ms.length);
        ctx.stat(Lx('배음에서 벗어난 정도 (평균)', 'Distance from harmonics (mean)'), (dev / Math.max(1, ms.length)).toFixed(0) + ' cents');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
