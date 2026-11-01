// 음 높이 척도: 선형 Hz vs 멜(mel) vs 로그(반음). 같은 간격의 계단이 귀에는 어떻게 들리는가
GTL.register({
  id: 'mel-scale',
  title: '음 높이 척도 (Hz, 멜, 반음)',
  summary: '귀는 주파수를 선형이 아니라 로그에 가깝게 느낌. Hz로 같은 간격인 계단(A)은 아래쪽 간격이 크고 위쪽은 거의 같은 음으로 들리지만, 멜 척도로 같은 간격인 계단(B)은 고르게 올라감.',
  views: { a: '선형 Hz 간격', b: '멜 간격' },
  controls: '파라미터 표에서 척도, 범위, 계단 수를 바꿈. "소리 켜기"를 누르면 계단을 아래에서 위로 반복 재생함.',
  info: `
    <p>100 Hz에서 200 Hz로 가는 것과 3000 Hz에서 3100 Hz로 가는 것은 똑같이 100 Hz 차이지만 앞은 한 옥타브, 뒤는 반음의 3분의 1 정도. 귀의 음 높이 감각은 주파수의 <b>비율</b>을 따름.</p>
    <ul>
      <li><b>반음(로그) 척도</b>: <code>12 log2(f / f0)</code>. 음악의 음 높이. 비율이 같으면 간격이 같음.</li>
      <li><b>멜(Mel) 척도</b>: Stevens, Volkmann, Newman(1937)이 "두 배 높게 들리는 음"을 실험으로 찾아 만든 척도. 흔히 쓰는 식은 <code>2595 log10(1 + f/700)</code>. 약 500 Hz 아래는 선형에 가깝고 위는 로그에 가까움.</li>
      <li><b>Bark, ERB</b>: 임계 대역 폭을 단위로 한 척도. 멜과 모양이 비슷함.</li>
    </ul>
    <p>쓰임: 음성 인식과 음악 분석의 <b>MFCC</b>, 멜 스펙트로그램(음성 합성, 음악 AI의 입력), 이퀄라이저와 스펙트럼 분석기의 로그 주파수 축</p>
    <p>주의: 멜 척도는 측정 방법과 식이 여러 개(O'Shaughnessy 식, Slaney 식 등). 음악의 음 높이(옥타브 동치)와도 같지 않음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="34" class="t-small t-dim">Hz</text><line x1="50" y1="30" x2="520" y2="30" class="d-line"/>
    <text x="4" y="114" class="t-small t-dim">mel</text><line x1="50" y1="110" x2="520" y2="110" class="d-line"/>
    <circle cx="60" cy="30" r="4" class="f-a"/><circle cx="170" cy="30" r="4" class="f-a"/><circle cx="280" cy="30" r="4" class="f-a"/><circle cx="390" cy="30" r="4" class="f-a"/><circle cx="500" cy="30" r="4" class="f-a"/>
    <line x1="60" y1="30" x2="60" y2="110" class="d-dim"/><line x1="170" y1="30" x2="250" y2="110" class="d-dim"/><line x1="280" y1="30" x2="365" y2="110" class="d-dim"/><line x1="390" y1="30" x2="440" y2="110" class="d-dim"/><line x1="500" y1="30" x2="500" y2="110" class="d-dim"/>
    <circle cx="60" cy="110" r="4" class="f-a"/><circle cx="250" cy="110" r="4" class="f-a"/><circle cx="365" cy="110" r="4" class="f-a"/><circle cx="440" cy="110" r="4" class="f-a"/><circle cx="500" cy="110" r="4" class="f-a"/>
    <text x="280" y="20" text-anchor="middle" class="t-small t-a">${L('Hz로 같은 간격', 'Equal steps in Hz')}</text>
    <text x="280" y="134" text-anchor="middle" class="t-small t-a">${L('귀에는 아래쪽이 넓고 위쪽이 좁게 들림', 'The ear hears wide steps at the bottom, narrow at the top')}</text>
  </svg>`,
  look: [
    'A의 가운데 멜 눈금에서 점 간격이 왼쪽은 넓고 오른쪽으로 갈수록 좁아짐. B는 멜 눈금에서 고르게 놓임.',
    '"소리 켜기"를 누르고 A를 들으면 처음 몇 계단은 크게 뛰고 위쪽 계단은 거의 같은 음처럼 들림',
    'B의 척도를 "반음 (로그)"로 바꾸면 반음 눈금에서 고르게 놓이고, 멜보다 아래쪽 계단이 조금 더 넓음',
    '아래의 삼각 필터 묶음은 MFCC에서 쓰는 모양. A는 필터 폭이 모두 같아 고음에 필터가 많이 배정되고, B는 저음에 촘촘하고 고음으로 갈수록 넓어짐.',
  ],
  refs: [
    { type: 'paper', title: 'Stevens, Volkmann, Newman, "A scale for the measurement of the psychological magnitude pitch", JASA 8(3)', year: 1937, note: '멜 척도의 원 실험' },
    { type: 'book', title: 'Douglas O\'Shaughnessy, Speech Communication: Human and Machine', year: 1987, note: '2595 log10(1 + f/700) 식' },
    { type: 'paper', title: 'Davis, Mermelstein, "Comparison of parametric representations for monosyllabic word recognition in continuously spoken sentences", IEEE Trans. ASSP 28(4)', year: 1980, note: 'MFCC와 멜 필터 뱅크' },
    { type: 'code', title: 'librosa, librosa.filters.mel', url: 'https://librosa.org/doc/latest/generated/librosa.filters.mel.html', note: 'Slaney 식과 HTK 식 멜 필터 뱅크 구현' },
  ],
  params: [
    { key: 'scale', label: '계단을 고르게 놓는 척도', type: 'select', options: [{ value: 'hz', label: '선형 Hz' }, { value: 'mel', label: '멜' }, { value: 'st', label: '반음 (로그)' }], a: 'hz', b: 'mel', default: 'hz', group: '계단' },
    { key: 'steps', label: '계단 수', type: 'int', min: 3, max: 16, default: 10, shared: true },
    { key: 'fLo', label: '시작 주파수 (Hz)', type: 'range', min: 50, max: 1000, step: 10, default: 100, shared: true },
    { key: 'fHi', label: '끝 주파수 (Hz)', type: 'range', min: 1000, max: 8000, step: 50, default: 4000, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Pitch Scales (Hz, Mel, Semitones)',
    summary: 'The ear hears frequency closer to a log scale than a linear one. A staircase with equal Hz steps (A) has big steps at the bottom and almost no change at the top. A staircase with equal mel steps (B) rises evenly.',
    views: { a: 'Equal Hz steps', b: 'Equal mel steps' },
    controls: 'Change the scale, range and number of steps in the parameter table. Press "Sound on" to play the staircase from bottom to top in a loop.',
    info: `
    <p>Going from 100 Hz to 200 Hz and from 3000 Hz to 3100 Hz are both 100 Hz steps. But the first is an octave and the second is about a third of a semitone. Our sense of pitch follows the <b>ratio</b> of frequencies.</p>
    <ul>
      <li><b>Semitone (log) scale</b>: <code>12 log2(f / f0)</code>. Musical pitch. Equal ratios give equal steps.</li>
      <li><b>Mel scale</b>: Stevens, Volkmann and Newman (1937) built it by asking people for "a tone that sounds twice as high". A common formula is <code>2595 log10(1 + f/700)</code>. Below about 500 Hz it is close to linear, above it is close to log.</li>
      <li><b>Bark, ERB</b>: scales that use the critical bandwidth as the unit. Their shape is similar to mel.</li>
    </ul>
    <p>Uses: <b>MFCC</b> in speech recognition and music analysis, mel spectrograms (input for speech synthesis and music AI), and the log frequency axis of equalizers and spectrum analyzers.</p>
    <p>Note: there are several mel formulas and measurements (O\'Shaughnessy, Slaney and others). Mel is also not the same as musical pitch (octave equivalence).</p>`,
    look: [
      'On A\'s middle mel ruler, the dots are far apart on the left and get closer to the right. B\'s dots are even on the mel ruler.',
      'Press "Sound on" and listen to A. The first few steps jump a lot and the top steps sound almost the same.',
      'Switch B\'s scale to "Semitones (log)". The dots are even on the semitone ruler, and the bottom steps are a bit wider than with mel.',
      'The triangle filter bank at the bottom is the shape used in MFCC. In A every filter has the same width, so most filters go to the treble. In B they are dense in the bass and get wider toward the treble.',
    ],
    refs: ['Original experiment for the mel scale.', 'The 2595 log10(1 + f/700) formula.', 'MFCC and the mel filter bank.', 'Mel filter bank code with the Slaney and HTK formulas.'],
    params: {
      scale: { label: 'Scale for even steps', group: 'Staircase', options: { hz: 'Linear Hz', mel: 'Mel', st: 'Semitones (log)' } },
      steps: 'Number of steps',
      fLo: 'Start frequency (Hz)',
      fHi: 'End frequency (Hz)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const mel = (f) => 2595 * Math.log10(1 + f / 700), melInv = (m) => 700 * (Math.pow(10, m / 2595) - 1);
    const st = (f) => 12 * Math.log2(f / 440) + 69, stInv = (s) => 440 * Math.pow(2, (s - 69) / 12);
    const SC = { hz: [(f) => f, (f) => f], mel: [mel, melInv], st: [st, stInv] };
    function ladder() {
      const [fw, inv] = SC[P.scale], a = fw(P.fLo), b = fw(P.fHi), n = P.steps;
      return Array.from({ length: n }, (_, i) => inv(a + (b - a) * i / (n - 1)));
    }

    const STEP = 0.3;
    let t = 0, ph = 0, env = 0, cur = -1;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const lad = ladder(), cyc = STEP * (lad.length + 2);
        for (let i = 0; i < n; i++) {
          const tc = t % cyc, idx = Math.floor(tc / STEP), local = tc - idx * STEP;
          const on = idx < lad.length && local < STEP - 0.05 ? 1 : 0;
          env += (on - env) * 0.004;
          const f = lad[Math.min(idx, lad.length - 1)];
          const v = 0.3 * env * Math.sin(ph);
          l[i] = v; r[i] = v;
          ph += 2 * Math.PI * f / sr; if (ph > 6.283185307) ph -= 6.283185307;
          t += 1 / sr;
        }
        cur = Math.floor((t % cyc) / STEP);
      },
    });

    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const lad = ladder();
        const rx = pad + 46, rw = W - rx - pad - 4;
        const rulers = [
          { name: L('선형 Hz', 'Linear Hz'), fw: (f) => f, ticks: [P.fLo, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000].filter((f) => f >= P.fLo && f <= P.fHi), fmt: (f) => f >= 1000 ? f / 1000 + 'k' : String(Math.round(f)) },
          { name: L('멜', 'Mel'), fw: mel, ticks: [100, 200, 500, 1000, 2000, 4000, 8000].filter((f) => f >= P.fLo && f <= P.fHi), fmt: (f) => f >= 1000 ? f / 1000 + 'k' : String(f) },
          { name: L('반음', 'Semitone'), fw: st, ticks: [55, 110, 220, 440, 880, 1760, 3520, 7040].filter((f) => f >= P.fLo && f <= P.fHi), fmt: (f) => A.noteName(st(f)) },
        ];
        const rh = Math.max(36, (H - 30) * 0.5 / 3);
        const ys = rulers.map((_, k) => pad + 22 + k * rh);
        D.text(g, L('같은 계단을 세 가지 척도에 놓은 위치', 'The same steps placed on three scales'), pad, pad, { size: 10, color: C.dim });
        const xOn = (rl, f) => rx + rw * (rl.fw(f) - rl.fw(P.fLo)) / (rl.fw(P.fHi) - rl.fw(P.fLo));
        rulers.forEach((rl, k) => {
          const y = ys[k];
          const active = (P.scale === 'hz' && k === 0) || (P.scale === 'mel' && k === 1) || (P.scale === 'st' && k === 2);
          D.text(g, rl.name, pad, y - 6, { size: 10, color: active ? col : C.dim });
          D.line(g, rx, y, rx + rw, y, active ? col : C.dim, active ? 2 : 1);
          for (const f of rl.ticks) { const x = xOn(rl, f); D.line(g, x, y, x, y + 5, C.dim); D.text(g, rl.fmt(f), x, y + 6, { size: 8, align: 'center', color: C.dim }); }
        });
        // 점과 연결선
        lad.forEach((f, i) => {
          const playing = snd.audible && cur === i;
          for (let k = 0; k < 3; k++) {
            const x = xOn(rulers[k], f), y = ys[k];
            if (k < 2) D.line(g, x, y, xOn(rulers[k + 1], f), ys[k + 1], 'rgba(255,255,255,0.12)');
            D.circle(g, x, y, playing ? 5.5 : 3.5, playing ? '#fff' : col);
          }
        });
        // 아래: 삼각 필터 묶음 (Hz 선형 축)
        const fy = ys[2] + 34, fh = H - fy - 12;
        if (fh > 24) {
          D.rect(g, rx, fy, rw, fh, 'rgba(0,0,0,0.35)');
          D.text(g, L('삼각 필터 묶음 (x: 선형 Hz)', 'Triangle filter bank (x: linear Hz)'), rx + 4, fy + 3, { size: 10, color: C.dim });
          const [fw, inv] = SC[P.scale], nb = 16, a = fw(P.fLo), b = fw(P.fHi);
          const edges = Array.from({ length: nb + 2 }, (_, i) => inv(a + (b - a) * i / (nb + 1)));
          const xh = (f) => rx + rw * (f - P.fLo) / (P.fHi - P.fLo);
          for (let i = 0; i < nb; i++) {
            const x0 = xh(edges[i]), x1 = xh(edges[i + 1]), x2 = xh(edges[i + 2]);
            D.poly(g, [{ x: x0, y: fy + fh }, { x: x1, y: fy + 16 }, { x: x2, y: fy + fh }], null, i % 2 ? col : 'rgba(255,255,255,0.45)', 1.2, false);
          }
        }
        const d0 = lad[1] - lad[0], d1 = lad[lad.length - 1] - lad[lad.length - 2];
        const s0 = st(lad[1]) - st(lad[0]), s1 = st(lad[lad.length - 1]) - st(lad[lad.length - 2]);
        ctx.stat(L('첫 계단', 'First step'), `${d0.toFixed(0)} Hz, ${(mel(lad[1]) - mel(lad[0])).toFixed(0)} mel, ${s0.toFixed(1)} ${L('반음', 'st')}`);
        ctx.stat(L('마지막 계단', 'Last step'), `${d1.toFixed(0)} Hz, ${(mel(lad[lad.length - 1]) - mel(lad[lad.length - 2])).toFixed(0)} mel, ${s1.toFixed(1)} ${L('반음', 'st')}`);
        ctx.stat(L('반음 간격 비 (첫/마지막)', 'Semitone step ratio (first/last)'), (s0 / Math.max(1e-6, s1)).toFixed(1) + 'x');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
