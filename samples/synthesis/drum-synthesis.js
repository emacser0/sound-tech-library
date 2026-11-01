// 드럼 합성: 킥(피치 엔벨로프), 스네어(톤 + 잡음), 하이햇(잡음 vs 금속성 사각파 6개). 단순한 방식 vs 설계한 방식
GTL.register({
  id: 'drum-synthesis',
  title: '드럼 합성 (킥, 스네어, 하이햇)',
  summary: '아날로그 드럼 머신은 오실레이터와 잡음만으로 드럼을 만듦. 킥은 음 높이가 빠르게 떨어져야 펀치가 생기고, 스네어는 톤에 잡음을 섞어야 울림선 소리가 나고, 하이햇은 사각파 여러 개를 겹치면 금속성이 생김.',
  views: { a: '단순 (사인, 톤, 잡음)', b: '설계 (피치 엔벨로프, 잡음, 금속성)' },
  controls: '파라미터 표에서 악기별 설정을 바꿈. "소리 켜기"를 누르면 16스텝 비트가 반복됨.',
  info: `
    <p>Roland TR-808, TR-909 같은 드럼 머신은 샘플 없이 회로로 드럼 소리를 만들었음. 지금도 일렉트로닉 음악의 기본 재료.</p>
    <ul>
      <li><b>킥</b>: 사인파의 음 높이를 수백 Hz에서 50Hz 근처로 수십 ms 만에 떨어뜨림(피치 엔벨로프). 시작 부분의 빠른 하강이 "퍽" 하는 타격감이 되고, 남은 낮은 사인이 "웅" 하는 몸통이 됨. 피치 엔벨로프가 없으면 둔한 "부웅" 소리.</li>
      <li><b>스네어</b>: 짧은 톤 두 개(몸통) + 대역 통과 잡음(스네어 울림선). 잡음이 없으면 탐탐처럼 들림.</li>
      <li><b>하이햇</b>: 하이패스한 백색 잡음은 "츠" 하는 바람 소리. TR-808은 서로 배음 관계가 아닌 사각파 6개를 섞어 금속성 소리를 만듦.</li>
    </ul>
    <p>모든 악기는 짧은 지수 감쇠 엔벨로프를 씀. 소리를 미리 버퍼로 만들어 두고 스텝마다 재생하므로 재생 비용이 거의 없음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-dim">${L('킥의 음 높이 (시간에 따라)', 'Kick pitch over time')}</text>
    <line x1="40" y1="130" x2="300" y2="130" class="d-line"/><line x1="40" y1="30" x2="40" y2="130" class="d-line"/>
    <path d="M40,40 C60,100 80,112 300,115" class="d-b"/>
    <line x1="40" y1="115" x2="300" y2="115" class="d-a" stroke-dasharray="5 3"/>
    <text x="48" y="36" class="t-small t-b">${L('180Hz에서 시작', 'starts at 180 Hz')}</text>
    <text x="300" y="108" text-anchor="end" class="t-small">50Hz</text>
    <text x="170" y="148" text-anchor="middle" class="t-small t-dim">${L('시간 (0 ~ 300ms)', 'time (0 to 300 ms)')}</text>
    <text x="320" y="40" class="t-small t-a">${L('A: 고정 음 높이', 'A: fixed pitch')}</text>
    <text x="320" y="58" class="t-small t-b">${L('B: 빠르게 떨어짐', 'B: drops fast')}</text>
    <text x="320" y="90" class="t-small t-dim">${L('하강 구간 = 타격감 (펀치)', 'drop = punch')}</text>
    <text x="320" y="108" class="t-small t-dim">${L('남은 사인 = 몸통 (붐)', 'tail sine = body (boom)')}</text>
  </svg>`,
  look: [
    '킥 줄에서 B의 파형은 처음 몇 주기가 촘촘하다가 넓어짐. 노란 피치 곡선이 떨어지는 모습. A는 간격이 일정함.',
    '"소리 켜기"를 누르고 두 뷰를 번갈아 들으면 A의 킥은 둔하고, B는 또렷하게 때리는 소리',
    '하이햇 줄의 스펙트럼에서 A는 평평한 잡음, B는 6~10kHz에 금속성 봉우리가 있음',
    '스네어 잡음을 끄면 B의 스네어가 탐탐처럼 바뀜',
  ],
  refs: [
    { type: 'article', title: 'Gordon Reid, "Synth Secrets" series (Sound On Sound), "Practical Bass Drum Synthesis" and related parts', year: 2002, note: '킥, 스네어, 하이햇 아날로그 합성' },
    { type: 'engine', title: 'Roland TR-808 Rhythm Composer Service Notes', note: 'TR-808 회로 (하이햇의 사각파 6개 포함)' },
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '엔벨로프와 잡음 소스' },
  ],
  params: [
    { key: 'kickEnv', label: '킥 피치 엔벨로프', type: 'bool', default: true, a: false, b: true, group: '킥' },
    { key: 'kickStart', label: '시작 음 높이 (Hz)', type: 'range', min: 80, max: 400, step: 1, default: 180, shared: true, when: (p) => p.kickEnv },
    { key: 'kickEnd', label: '끝 음 높이 (Hz)', type: 'range', min: 35, max: 90, step: 1, default: 50, shared: true },
    { key: 'kickDecay', label: '킥 길이 (초)', type: 'range', min: 0.1, max: 1, step: 0.01, default: 0.45, shared: true },
    { key: 'snareNoise', label: '스네어 잡음', type: 'bool', default: true, a: false, b: true, group: '스네어' },
    { key: 'snareTone', label: '스네어 톤 (Hz)', type: 'range', min: 120, max: 300, step: 1, default: 185, shared: true },
    { key: 'hatMetal', label: '하이햇 금속성 (사각파 6개)', type: 'bool', default: true, a: false, b: true, group: '하이햇' },
    { key: 'tempo', label: '템포 (BPM)', type: 'int', min: 70, max: 160, default: 112, shared: true, group: '패턴' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Drum Synthesis (Kick, Snare, Hi-Hat)',
    summary: 'Analog drum machines make drums from only oscillators and noise. A kick needs a fast pitch drop for punch, a snare needs noise mixed with its tone for the snare wires, and a hi-hat gets its metallic edge from several square waves.',
    views: { a: 'Simple (sine, tone, noise)', b: 'Designed (pitch env, noise, metallic)' },
    controls: 'Change per-drum settings in the parameter table. Press "Sound on" to hear a 16-step beat loop.',
    info: `
    <p>Drum machines such as the Roland TR-808 and TR-909 made drum sounds with circuits, not samples. They are still basic material in electronic music.</p>
    <ul>
      <li><b>Kick</b>: drop the pitch of a sine from a few hundred Hz to about 50 Hz within tens of ms (pitch envelope). The fast drop gives the "punch", and the low sine that remains gives the "boom". Without the pitch envelope you get a dull "boooom".</li>
      <li><b>Snare</b>: two short tones (body) plus band-passed noise (snare wires). Without the noise it sounds like a tom.</li>
      <li><b>Hi-hat</b>: high-passed white noise sounds like a "tss" of air. The TR-808 mixes six square waves with no harmonic relation to get a metallic sound.</li>
    </ul>
    <p>Every drum uses a short exponential decay envelope. The sounds are rendered to buffers in advance and played on each step, so playback costs almost nothing.</p>`,
    look: [
      'In the kick row, B\'s waveform has tight cycles at first and then wider ones, following the yellow pitch curve. A has even spacing.',
      'Press "Sound on" and switch views. A\'s kick is dull. B\'s kick hits clearly.',
      'In the hi-hat row spectrum, A is flat noise. B has metallic peaks at 6 to 10 kHz.',
      'Turn off snare noise. B\'s snare turns into a tom.',
    ],
    refs: ['Analog synthesis of kick, snare and hi-hat.', 'TR-808 circuits (including the six square waves of the hi-hat).', 'Envelopes and noise sources.'],
    params: {
      kickEnv: { label: 'Kick pitch envelope', group: 'Kick' },
      kickStart: 'Start pitch (Hz)', kickEnd: 'End pitch (Hz)', kickDecay: 'Kick length (s)',
      snareNoise: { label: 'Snare noise', group: 'Snare' },
      snareTone: 'Snare tone (Hz)',
      hatMetal: { label: 'Hi-hat metallic (6 squares)', group: 'Hi-hat' },
      tempo: { label: 'Tempo (BPM)', group: 'Pattern' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    //           1 . . . 2 . . . 3 . . . 4 . . .
    const PAT = {
      kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      hat: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    };
    const kickPitch = (t) => (P.kickEnv ? P.kickEnd + (P.kickStart - P.kickEnd) * Math.exp(-t / 0.03) : P.kickEnd);
    const HAT_F = [205.3, 304.4, 369.6, 522.7, 540, 800]; // TR-808 하이햇 오실레이터

    function render(sr) {
      const noise = A.noiseBuffer(Math.ceil(sr * 0.5), (ctx.seed || 1) + 7);
      // 킥
      const kn = Math.ceil(sr * P.kickDecay * 1.3), kick = new Float32Array(kn);
      let ph = 0;
      for (let i = 0; i < kn; i++) { const t = i / sr; ph += kickPitch(t) / sr; kick[i] = Math.sin(TAU * ph) * Math.exp(-t * 5 / P.kickDecay) * Math.min(1, t / 0.0015); }
      // 스네어: 톤 2개 + 대역 통과 잡음
      const sn = Math.ceil(sr * 0.35), snare = new Float32Array(sn), bp = A.biquad('bandpass', 3500, 0.6, 0, sr), hp1 = A.biquad('highpass', 900, 0.7, 0, sr);
      for (let i = 0; i < sn; i++) {
        const t = i / sr;
        const tone = (Math.sin(TAU * P.snareTone * t) + 0.6 * Math.sin(TAU * P.snareTone * 1.78 * t)) * Math.exp(-t / 0.06) * 0.6;
        const nz = P.snareNoise ? hp1.process(bp.process(noise[i])) * Math.exp(-t / 0.09) * 1.6 : 0;
        snare[i] = (tone + nz) * Math.min(1, t / 0.001);
      }
      // 하이햇: 잡음 또는 사각파 6개 → 하이패스
      const hn = Math.ceil(sr * 0.2), hat = new Float32Array(hn), hbp = A.biquad('bandpass', 10000, 1.2, 0, sr), hhp = A.biquad('highpass', 7000, 0.7, 0, sr);
      for (let i = 0; i < hn; i++) {
        const t = i / sr;
        let x;
        if (P.hatMetal) { x = 0; for (const f of HAT_F) x += (((f * t) % 1) < 0.5 ? 1 : -1); x = hbp.process(x / 6) * 2.5; }
        else x = noise[i];
        hat[i] = hhp.process(x) * Math.exp(-t / 0.035) * 0.8;
      }
      for (const b of [kick, snare, hat]) A.normalize(b, 0.9);
      return { kick, snare, hat, sr };
    }

    let bufs = null, bufKey = '';
    function getBufs(sr) {
      const k = [sr, P.kickEnv, P.kickStart, P.kickEnd, P.kickDecay, P.snareNoise, P.snareTone, P.hatMetal].join();
      if (k !== bufKey) { bufKey = k; bufs = render(sr); }
      return bufs;
    }
    const stepLen = () => 60 / P.tempo / 4;
    const GAIN = { kick: 0.42, snare: 0.3, hat: 0.14 };

    const live = { n: 0, hits: [] };
    let audioBufs = null, audioKey = '';
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = [sr, P.kickEnv, P.kickStart, P.kickEnd, P.kickDecay, P.snareNoise, P.snareTone, P.hatMetal].join();
        if (k !== audioKey) { audioKey = k; audioBufs = render(sr); }
        const sl = Math.round(stepLen() * sr);
        for (let i = 0; i < n; i++) {
          if (live.n % sl === 0) {
            const s = Math.floor(live.n / sl) % 16;
            for (const name of ['kick', 'snare', 'hat']) if (PAT[name][s]) live.hits.push({ name, pos: 0 });
          }
          live.n++;
          let o = 0;
          for (const h of live.hits) { const b = audioBufs[h.name]; if (h.pos < b.length) o += b[h.pos++] * GAIN[h.name]; }
          l[i] = o; r[i] = o;
        }
        live.hits = live.hits.filter((h) => h.pos < audioBufs[h.name].length);
      },
    });

    const SR = 48000;
    let visT = 0, hatKey = '', hatMags = null;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8;
        const b = getBufs(SR);
        const t = snd.on ? live.n / (snd.sr || SR) : visT, step = Math.floor(t / stepLen()) % 16;
        // 0) 스텝 격자
        const gy = pad, gh = 12 * 3 + 4, lx = pad + 52, gw = W - lx - pad, cw = gw / 16;
        ['kick', 'snare', 'hat'].forEach((name, row) => {
          D.text(g, Lx({ kick: '킥', snare: '스네어', hat: '하이햇' }[name], { kick: 'Kick', snare: 'Snare', hat: 'Hi-hat' }[name]), pad, gy + row * 13, { size: 10, color: C.dim });
          for (let s = 0; s < 16; s++) D.rect(g, lx + s * cw + 1, gy + row * 13, cw - 2, 11, PAT[name][s] ? (s === step ? C.text : col) : (s === step ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'));
        });
        const rh = (H - gy - gh - pad * 4) / 3;
        // 1) 킥 파형 + 피치 곡선
        const y1 = gy + gh + pad, kc = Math.min(b.kick.length, Math.round(SR * 0.25));
        A.drawWave(g, b.kick, pad, y1, W - pad * 2, rh, { count: kc, color: col, lineWidth: 1.2, label: Lx('킥 파형 (0~250ms), 노랑 = 음 높이', 'Kick waveform (0 to 250 ms), yellow = pitch') });
        g.beginPath();
        for (let i = 0; i <= 100; i++) { const tt = i / 100 * 0.25, f = kickPitch(tt); const px = pad + i / 100 * (W - pad * 2), py = y1 + rh - (f - 30) / 400 * rh; i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = C.warn; g.lineWidth = 1.5; g.stroke();
        // 2) 스네어 파형
        const y2 = y1 + rh + pad;
        A.drawWave(g, b.snare, pad, y2, W - pad * 2, rh, { count: Math.round(SR * 0.25), color: col, lineWidth: 1, label: Lx('스네어 파형 (0~250ms)', 'Snare waveform (0 to 250 ms)') });
        // 3) 하이햇 스펙트럼
        const y3 = y2 + rh + pad;
        if (bufKey !== hatKey) { hatKey = bufKey; hatMags = A.spectrum(b.hat, 2048, { window: 'hann' }); }
        A.drawSpectrum(g, hatMags, SR, pad, y3, W - pad * 2, rh, { color: col, fmin: 1000, fmax: 20000, minDb: -90, maxDb: -10, label: Lx('하이햇 스펙트럼 (1~20kHz)', 'Hi-hat spectrum (1 to 20 kHz)') });
        // 킥 타격감: 처음 20ms의 평균 주파수
        let ph0 = 0; for (let i = 0; i < 20; i++) ph0 += kickPitch(i / 1000);
        ctx.stat(Lx('킥 처음 20ms 평균 음 높이', 'Kick mean pitch, first 20 ms'), (ph0 / 20).toFixed(0) + ' Hz');
        ctx.stat(Lx('스텝', 'Step'), `${step + 1} / 16`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
