// FM 합성 (2 오퍼레이터 위상 변조). 비율이 정수면 배음, 정수가 아니면 종소리 같은 비배음. 인덱스가 사이드밴드 폭을 정함
GTL.register({
  id: 'fm-synthesis',
  title: 'FM 합성 (비율과 인덱스)',
  summary: '사인파의 위상을 다른 사인파로 흔들면 반송파 주위에 사이드밴드가 생김. 주파수 비율이 정수면 배음이 되어 베이스, 브라스가 되고, 정수가 아니면 종소리 같은 비배음이 됨.',
  views: { a: '베이스 (1:1)', b: '종 (1:1.41)' },
  controls: '파라미터 표에서 프리셋을 고름. "직접 설정"에서는 비율과 인덱스를 바꿈. "소리 켜기"를 누르면 같은 음이 반복됨.',
  info: `
    <p><b>FM 합성</b>은 John Chowning이 1973년에 발표하고 Yamaha DX7(1983)이 널리 퍼뜨린 방식. 사인파 두 개만으로 복잡한 음색을 만듦.</p>
    <ul>
      <li><b>반송파(Carrier)</b>: 귀에 들리는 사인파. 주파수 fc</li>
      <li><b>변조파(Modulator)</b>: 반송파의 위상을 흔드는 사인파. 주파수 fm = 비율 x fc</li>
      <li><b>인덱스(I)</b>: 흔드는 세기. 클수록 사이드밴드가 넓게 퍼져 밝아짐</li>
    </ul>
    <p>출력 <code>sin(2&pi;fc t + I sin(2&pi;fm t))</code>는 fc &plusmn; k fm 위치의 사이드밴드로 나뉘고, k번째 크기는 베셀 함수 J<sub>k</sub>(I). 음수 주파수로 넘어간 사이드밴드는 부호가 바뀌어 0 Hz 위로 접혀 올라옴. 대역폭은 카슨 규칙으로 약 2(I + 1)fm.</p>
    <p>인덱스를 엔벨로프로 줄이면 음이 밝게 시작해 순수해짐. 실제 악기처럼 시간에 따라 음색이 바뀌는 비결. 단점은 파라미터와 결과 음색의 관계가 직관적이지 않아 만들기 어렵다는 점.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="120" x2="520" y2="120" class="d-line"/>
    <line x1="270" y1="120" x2="270" y2="30" class="d-b"/>
    <line x1="210" y1="120" x2="210" y2="58" class="d-b"/><line x1="330" y1="120" x2="330" y2="58" class="d-b"/>
    <line x1="150" y1="120" x2="150" y2="85" class="d-b"/><line x1="390" y1="120" x2="390" y2="85" class="d-b"/>
    <line x1="90" y1="120" x2="90" y2="104" class="d-b"/><line x1="450" y1="120" x2="450" y2="104" class="d-b"/>
    <text x="270" y="22" text-anchor="middle" class="t-small">fc (J0)</text>
    <text x="330" y="52" text-anchor="middle" class="t-small">fc+fm (J1)</text><text x="210" y="52" text-anchor="middle" class="t-small">fc-fm</text>
    <text x="390" y="80" text-anchor="middle" class="t-small">fc+2fm</text><text x="150" y="80" text-anchor="middle" class="t-small">fc-2fm</text>
    <line x1="210" y1="136" x2="270" y2="136" class="d-dim"/><text x="240" y="150" text-anchor="middle" class="t-small t-dim">fm</text>
    <text x="520" y="36" text-anchor="end" class="t-small t-dim">${L('간격 = 변조 주파수', 'spacing = modulator frequency')}</text>
    <text x="520" y="52" text-anchor="end" class="t-small t-dim">${L('높이 = 베셀 함수 Jk(I)', 'height = Bessel function Jk(I)')}</text>
  </svg>`,
  look: [
    '스펙트럼의 초록 점선(기음의 배음 위치)을 보면 A의 막대는 점선 위에 있고, B의 막대는 점선 사이에 흩어짐',
    '"소리 켜기"를 누르고 두 뷰를 번갈아 들으면 A는 음 높이가 분명한 베이스, B는 음 높이가 모호한 종소리',
    '프리셋을 "직접 설정"으로 바꾸고 인덱스를 0에서 10까지 올리면 사이드밴드가 양쪽으로 퍼지고 반송파 막대가 줄었다가 다시 커짐 (J0의 진동)',
    '인덱스 엔벨로프가 있는 프리셋은 시간이 지나며 막대 수가 줄어듦. 소리도 밝게 시작해 순해짐.',
  ],
  refs: [
    { type: 'paper', title: 'John M. Chowning, "The Synthesis of Complex Audio Spectra by Means of Frequency Modulation", Journal of the Audio Engineering Society 21(7)', year: 1973, note: 'FM 합성 원 논문' },
    { type: 'book', title: 'John Chowning, David Bristow, FM Theory and Applications: By Musicians for Musicians', year: 1986, note: 'DX7 시대의 FM 음색 설계' },
    { type: 'book', title: 'Miller Puckette, The Theory and Technique of Electronic Music', year: 2007, url: 'http://msp.ucsd.edu/techniques.htm', note: '5장 변조, 위상 변조와 사이드밴드' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: 'FM 합성과 베셀 함수' },
  ],
  params: [
    { key: 'preset', label: '프리셋', type: 'select', options: [
      { value: 'bass', label: '베이스 (1:1)' }, { value: 'bell', label: '종 (1:1.41)' }, { value: 'brass', label: '브라스 (1:1)' },
      { value: 'clarinet', label: '클라리넷 (1:2)' }, { value: 'custom', label: '직접 설정' }], a: 'bass', b: 'bell', group: 'FM' },
    { key: 'ratio', label: '비율 (fm / fc)', type: 'range', min: 0.25, max: 8, step: 0.01, default: 1.41, when: (p) => p.preset === 'custom' },
    { key: 'index', label: '인덱스 (I)', type: 'range', min: 0, max: 12, step: 0.1, default: 3, when: (p) => p.preset === 'custom' },
    { key: 'ienv', label: '인덱스 엔벨로프', type: 'bool', default: true, when: (p) => p.preset === 'custom' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 33, max: 84, default: 52, shared: true, group: '음', help: '60 = C4 (가운데 도)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'FM Synthesis (Ratio and Index)',
    summary: 'When one sine wave shakes the phase of another, sidebands appear around the carrier. With a whole number ratio they line up as harmonics (bass, brass). With other ratios they become inharmonic, like a bell.',
    views: { a: 'Bass (1:1)', b: 'Bell (1:1.41)' },
    controls: 'Pick a preset in the parameter table. With "Custom" you can change the ratio and index. Press "Sound on" to hear the same note repeat.',
    info: `
    <p><b>FM synthesis</b> was published by John Chowning in 1973 and made popular by the Yamaha DX7 (1983). It makes complex tones from only two sine waves.</p>
    <ul>
      <li><b>Carrier</b>: the sine wave you hear, at frequency fc.</li>
      <li><b>Modulator</b>: the sine wave that shakes the carrier's phase, at fm = ratio x fc.</li>
      <li><b>Index (I)</b>: how strongly it shakes. A larger index spreads sidebands wider and makes the sound brighter.</li>
    </ul>
    <p>The output <code>sin(2&pi;fc t + I sin(2&pi;fm t))</code> splits into sidebands at fc &plusmn; k fm. The size of the k-th one is the Bessel function J<sub>k</sub>(I). Sidebands that go below 0 Hz flip sign and fold back up. Carson's rule gives a bandwidth of about 2(I + 1)fm.</p>
    <p>If an envelope lowers the index, the note starts bright and becomes pure. This is how FM makes the tone change over time like a real instrument. The downside: the link between parameters and the resulting tone is hard to predict.</p>`,
    look: [
      'Look at the green dotted lines (harmonics of the fundamental). A\'s bars sit on the lines. B\'s bars fall between them.',
      'Press "Sound on" and switch between views. A is a bass with a clear pitch. B is a bell with an unclear pitch.',
      'Set the preset to "Custom" and raise the index from 0 to 10. Sidebands spread out, and the carrier bar shrinks and grows again (J0 oscillates).',
      'Presets with an index envelope lose bars over time. The sound starts bright and turns soft.',
    ],
    refs: ['The original FM synthesis paper.', 'FM sound design in the DX7 era.', 'Chapter 5 on modulation, phase modulation and sidebands.', 'FM synthesis and Bessel functions.'],
    params: {
      preset: { label: 'Preset', group: 'FM', options: { bass: 'Bass (1:1)', bell: 'Bell (1:1.41)', brass: 'Brass (1:1)', clarinet: 'Clarinet (1:2)', custom: 'Custom' } },
      ratio: 'Ratio (fm / fc)', index: 'Index (I)', ienv: 'Index envelope',
      note: { label: 'Pitch (MIDI)', group: 'Note', help: '60 = C4 (middle C)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    // 프리셋: 비율, 최대 인덱스, 인덱스 감쇠 시간, 음량 감쇠 시간, 어택, 반복 주기, 인덱스가 음량을 따라가는지
    const PRESETS = {
      bass: { ratio: 1, index: 5, iTau: 0.12, aTau: 0.6, att: 0.003, len: 1.2 },
      bell: { ratio: Math.SQRT2, index: 6, iTau: 1.0, aTau: 1.6, att: 0.002, len: 3.0 },
      brass: { ratio: 1, index: 3.5, iTau: 0, aTau: 99, att: 0.09, len: 1.4, follow: true, gate: 0.9 },
      clarinet: { ratio: 2, index: 2, iTau: 0, aTau: 99, att: 0.05, len: 1.4, gate: 1.0 },
    };
    const preset = () => P.preset === 'custom'
      ? { ratio: P.ratio, index: P.index, iTau: P.ienv ? 0.5 : 0, aTau: 1.2, att: 0.004, len: 2.2 }
      : PRESETS[P.preset];

    // 노트 시작 후 t초의 음량과 인덱스
    function envAt(t) {
      const p = preset();
      let amp = Math.min(1, t / p.att) * (p.aTau < 50 ? Math.exp(-t / p.aTau) : 1);
      if (p.gate && t > p.gate) amp *= Math.exp(-(t - p.gate) / 0.08);
      const idx = p.follow ? p.index * amp : p.iTau ? p.index * Math.exp(-t / p.iTau) : p.index;
      return { amp, idx };
    }
    // 베셀 함수 Jn(x) (적분 표현, 수치 적분)
    function besselJ(n, x) {
      const M = 96; let s = 0;
      for (let i = 0; i <= M; i++) { const tau = Math.PI * i / M, w = i === 0 || i === M ? 0.5 : 1; s += w * Math.cos(n * tau - x * Math.sin(tau)); }
      return s / M;
    }
    // 이론 스펙트럼: 주파수 → 부호 있는 진폭. 음수 주파수는 부호를 바꿔 접음
    function lines(fc, fm, I) {
      const map = new Map(), K = Math.ceil(I + 6);
      for (let k = -K; k <= K; k++) {
        let f = fc + k * fm, a = besselJ(Math.abs(k), I) * (k < 0 && (k & 1) ? -1 : 1);
        if (f < 0) { f = -f; a = -a; }
        const key = Math.round(f * 100) / 100;
        map.set(key, (map.get(key) || 0) + a);
      }
      return [...map.entries()].filter(([, a]) => Math.abs(a) > 1e-4);
    }

    const live = { n: 0, pc: 0, pm: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const p = preset(), fc = A.mtof(P.note), fm = fc * p.ratio;
        for (let i = 0; i < n; i++) {
          const t = (live.n++ / sr) % p.len, e = envAt(t);
          if (t < 1 / sr) { live.pc = 0; live.pm = 0; }
          const o = Math.sin(TAU * live.pc + e.idx * Math.sin(TAU * live.pm)) * e.amp * 0.45;
          live.pc = (live.pc + fc / sr) % 1; live.pm = (live.pm + fm / sr) % 1;
          l[i] = o; r[i] = o;
        }
      },
    });

    let visT = 0, cacheKey = '', cache = null;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const p = preset(), fc = A.mtof(P.note), fm = fc * p.ratio;
        const t = (snd.on ? live.n / (snd.sr || 48000) : visT) % p.len, e = envAt(t);
        const I = Math.round(e.idx * 20) / 20;
        const k = [fc, fm, I].join();
        if (k !== cacheKey) { cacheKey = k; cache = lines(fc, fm, I); }
        // 1) 파형 (fc 3주기)
        const wh = Math.max(50, H * 0.28), N = 300, wave = new Float32Array(N), span = 3 / fc;
        for (let i = 0; i < N; i++) { const tt = i / (N - 1) * span; wave[i] = Math.sin(TAU * fc * tt + e.idx * Math.sin(TAU * fm * tt)); }
        A.drawWave(g, wave, pad, pad, W - pad * 2, wh, { color: col, amp: 0.85, label: Lx('파형 (반송파 3주기, 현재 인덱스)', 'Waveform (3 carrier cycles, current index)') });
        // 2) 이론 스펙트럼 (선형 주파수 축)
        const sy = pad * 2 + wh, sh = H - sy - pad - 14, sx = pad, sw = W - pad * 2;
        const fmax = Math.min(16000, Math.max(fc * 8, fc + (p.index + 3) * fm));
        D.rect(g, sx, sy, sw, sh, 'rgba(0,0,0,0.35)');
        const fx = (f) => sx + f / fmax * sw, dy = (a) => sy + sh - U.clamp((A.linToDb(a) + 60) / 60, 0, 1) * sh;
        for (let h = 1; h * fc < fmax; h++) { const px = fx(h * fc); g.setLineDash([3, 3]); D.line(g, px, sy, px, sy + sh, 'rgba(102,209,122,0.45)', 1); g.setLineDash([]); }
        for (let db = -12; db >= -48; db -= 12) D.line(g, sx, dy(Math.pow(10, db / 20)), sx + sw, dy(Math.pow(10, db / 20)), C.grid, 1);
        for (const [f, a] of cache) { if (f > fmax) continue; D.line(g, fx(f), sy + sh, fx(f), dy(Math.abs(a)), a >= 0 ? col : C.warn, 3); }
        D.line(g, fx(fc), sy + sh, fx(fc), sy + sh + 6, C.text, 2);
        D.text(g, 'fc', fx(fc), sy + sh + 4, { size: 9, color: C.dim, align: 'center' });
        D.text(g, Lx('사이드밴드 (베셀 함수, dB). 노랑 = 음의 부호', 'Sidebands (Bessel, dB). Yellow = negative sign'), sx + 4, sy + 3, { size: 10, color: C.dim });
        D.text(g, `0 Hz ~ ${fmax.toFixed(0)} Hz`, sx + sw - 4, sy + 3, { size: 9, color: C.dim, align: 'right' });
        // 화성 관계: 비율이 작은 분수 p/q면 기음 = fc/q
        let q = 0; for (let d = 1; d <= 4; d++) if (Math.abs(p.ratio * d - Math.round(p.ratio * d)) < 1e-3) { q = d; break; }
        ctx.stat(Lx('비율 fm/fc', 'Ratio fm/fc'), p.ratio.toFixed(2));
        ctx.stat(Lx('현재 인덱스', 'Current index'), e.idx.toFixed(2));
        ctx.stat(Lx('카슨 대역폭', 'Carson bandwidth'), (2 * (e.idx + 1) * fm).toFixed(0) + ' Hz');
        ctx.stat(Lx('배음 관계', 'Harmonic relation'), q ? Lx(`배음 (기음 ${(fc / q).toFixed(1)} Hz)`, `harmonic (fundamental ${(fc / q).toFixed(1)} Hz)`) : Lx('비배음', 'inharmonic'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
