// 데시벨 더하기: 상관된 신호(같은 신호)는 +6dB, 상관 없는 신호(독립 노이즈)는 +3dB
GTL.register({
  id: 'decibel-addition',
  title: '데시벨 더하기 (+6dB vs +3dB)',
  summary: '같은 크기의 소리 두 개를 더하면 몇 dB가 될까. 똑같은 신호(상관됨)는 진폭이 더해져 +6dB, 서로 무관한 신호(상관 없음)는 에너지가 더해져 +3dB.',
  views: { a: '같은 신호 (상관됨)', b: '독립 신호 (상관 없음)' },
  controls: '파라미터 표에서 음원 수와 상관 여부를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 합이 들림.',
  info: `
    <p>데시벨은 로그 단위라서 그냥 더할 수 없음. 60dB + 60dB는 120dB가 아님. 결과는 두 신호가 얼마나 닮았는지(상관)에 따라 달라짐.</p>
    <ul>
      <li><b>상관된 신호</b> (같은 신호, 같은 위상): 매 순간 값이 같아서 진폭이 더해짐. N개면 진폭 N배, <b>20 log10 N</b> dB. 2개면 +6dB.</li>
      <li><b>상관 없는 신호</b> (독립 노이즈, 다른 악기, 다른 주파수): 서로 더해지기도 하고 지워지기도 해서 평균으로는 에너지(제곱)만 더해짐. N개면 <b>10 log10 N</b> dB. 2개면 +3dB.</li>
      <li>레벨이 다른 상관 없는 두 소리: L = 10 log10(10^(L1/10) + 10^(L2/10)). 10dB 차이면 큰 쪽보다 0.4dB만 커짐.</li>
    </ul>
    <p>실전 예: 같은 바이올린 파트를 10명이 연주하면 한 명보다 약 10dB 큼(+20dB가 아님). 스테레오 믹스를 모노로 합칠 때 가운데(L, R에 같은 신호)는 +6dB, 넓게 퍼진 소리는 +3dB 커짐. 팬 법칙(-3dB, -6dB)도 이 차이에서 나옴.</p>`,
  diagram: (L) => {
    const bar = (x, h, cls) => `<rect x="${x}" y="${150 - h}" width="28" height="${h}" class="${cls}"/>`;
    return `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="20" y="20" class="t-small">${L('진폭 더하기 (상관됨)', 'Add amplitudes (correlated)')}</text>
    ${bar(30, 40, 'f-dim')}<text x="70" y="135" class="t-small">+</text>${bar(85, 40, 'f-dim')}<text x="125" y="135" class="t-small">=</text>${bar(140, 80, 'f-a')}
    <text x="154" y="62" text-anchor="middle" class="t-small t-a">2× ${L('진폭', 'amplitude')}</text>
    <text x="100" y="170" text-anchor="middle" class="t-small t-a">20 log10 2 = +6.0 dB</text>
    <text x="290" y="20" class="t-small">${L('에너지 더하기 (상관 없음)', 'Add energy (uncorrelated)')}</text>
    ${bar(300, 40, 'f-dim')}<text x="340" y="135" class="t-small">+</text>${bar(355, 40, 'f-dim')}<text x="395" y="135" class="t-small">=</text>${bar(410, 56.6, 'f-b')}
    <text x="424" y="86" text-anchor="middle" class="t-small t-b">√2× ${L('진폭 (RMS)', 'amplitude (RMS)')}</text>
    <text x="370" y="170" text-anchor="middle" class="t-small t-b">10 log10 2 = +3.0 dB</text>
    <line x1="260" y1="30" x2="260" y2="170" class="d-dim"/>
  </svg>`;
  },
  look: [
    '음원 수 2에서 "측정한 합 레벨"이 A는 +6.0dB, B는 약 +3.0dB',
    '음원 수를 8로 올리면 A는 +18dB, B는 +9dB. "소리 켜기"로 들으면 A가 훨씬 큼.',
    '"나머지 음원 레벨"을 -10dB로 낮추고 음원 수를 2로 두면 B의 합은 약 +0.4dB만 커짐',
    '음원을 "사인파"로 바꾸면 B는 서로 다른 음 높이의 화음이 되어도 에너지 합 규칙(+3dB)을 따름',
  ],
  refs: [
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science (3rd ed.)', year: 2015, note: '데시벨 단위와 레벨 합산' },
    { type: 'book', title: 'F. Alton Everest, Ken C. Pohlmann, Master Handbook of Acoustics', note: '데시벨 더하기, 상관된 신호와 상관 없는 신호' },
    { type: 'book', title: 'David Miles Huber, Robert E. Runstein, Modern Recording Techniques', note: '팬 법칙과 모노 합산' },
  ],
  params: [
    { key: 'corr', label: '신호 관계', type: 'select', options: [{ value: 'same', label: '같은 신호 (상관됨)' }, { value: 'indep', label: '독립 신호 (상관 없음)' }], a: 'same', b: 'indep', default: 'same', group: '음원' },
    { key: 'count', label: '음원 수', type: 'int', min: 1, max: 8, default: 2, shared: true, group: '음원' },
    { key: 'off', label: '나머지 음원 레벨 (dB)', type: 'range', min: -20, max: 0, step: 0.5, default: 0, shared: true, group: '음원', help: '첫째 음원 대비. 2번째부터 적용' },
    { key: 'src', label: '음원 종류', type: 'select', options: [{ value: 'noise', label: '핑크 노이즈' }, { value: 'sine', label: '사인파' }], default: 'noise', shared: true, group: '음원', help: '사인파의 독립 신호는 서로 다른 음 높이 (A장조 화음)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Adding Decibels (+6 dB vs +3 dB)',
    summary: 'Add two sounds of the same level. How many dB do you get? Identical signals (correlated) add their amplitudes for +6 dB. Unrelated signals (uncorrelated) add their energy for +3 dB.',
    views: { a: 'Same signal (correlated)', b: 'Independent signals (uncorrelated)' },
    controls: 'Change the number of sources and how they relate in the parameter table. Press "Sound on" to hear the sum in the selected view.',
    info: `
    <p>Decibels are a log unit, so you cannot add them directly. 60 dB + 60 dB is not 120 dB. The result depends on how alike the two signals are (correlation).</p>
    <ul>
      <li><b>Correlated signals</b> (same signal, same phase): the values match at every moment, so the amplitudes add. N copies give N times the amplitude, <b>20 log10 N</b> dB. Two copies give +6 dB.</li>
      <li><b>Uncorrelated signals</b> (independent noise, different instruments, different frequencies): they sometimes add and sometimes cancel, so on average only the energy (squares) adds. N signals give <b>10 log10 N</b> dB. Two give +3 dB.</li>
      <li>Two uncorrelated sounds at different levels: L = 10 log10(10^(L1/10) + 10^(L2/10)). With a 10 dB difference the sum is only 0.4 dB above the louder one.</li>
    </ul>
    <p>In practice: 10 violinists on the same part are about 10 dB louder than one (not +20 dB). When a stereo mix folds to mono, the center (same signal in L and R) gains 6 dB while wide sounds gain 3 dB. Pan laws (-3 dB, -6 dB) come from this difference.</p>`,
    look: [
      'With 2 sources, the "Measured sum level" is +6.0 dB in A and about +3.0 dB in B.',
      'Raise the source count to 8. A is +18 dB and B is +9 dB. With "Sound on", A is much louder.',
      'Set "Other sources level" to -10 dB with 2 sources. B\'s sum rises only about 0.4 dB.',
      'Set the source type to "Sine". B becomes a chord of different pitches but still follows the energy rule (+3 dB).',
    ],
    refs: ['Decibel units and summing levels.', 'Adding decibels, correlated and uncorrelated signals.', 'Pan laws and mono summing.'],
    params: {
      corr: { label: 'Signal relation', group: 'Sources', options: { same: 'Same signal (correlated)', indep: 'Independent signals (uncorrelated)' } },
      count: { label: 'Number of sources', group: 'Sources' },
      off: { label: 'Other sources level (dB)', group: 'Sources', help: 'Relative to source 1. Applies from source 2 on' },
      src: { label: 'Source type', group: 'Sources', options: { noise: 'Pink noise', sine: 'Sine' }, help: 'Independent sines use different pitches (A major chord)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const MAXN = 8, NB = 16384, SR = 48000;
    const FREQS = [220, 277.18, 329.63, 440, 554.37, 659.26, 880, 1108.73];
    const gainOf = (k) => (k === 0 ? 1 : Math.pow(10, P.off / 20));

    // 분석용 버퍼: 음원 k의 신호 (상관됨이면 모두 음원 0과 같음)
    const pinkBufs = [];
    for (let k = 0; k < MAXN; k++) pinkBufs.push(A.noiseBuffer(NB, 101 + k * 7, 'pink'));
    const sineBufs = FREQS.map((f) => A.render(NB, SR, (i) => Math.sin(U.TAU * f * i / SR) * 0.5));
    const srcBuf = (k) => {
      const kk = P.corr === 'same' ? 0 : k;
      return P.src === 'noise' ? pinkBufs[kk] : sineBufs[kk];
    };
    let key = '', sum = null, one = null, measured = 0, predicted = 0;
    function analyze() {
      const k = [P.corr, P.count, P.off, P.src].join();
      if (k === key) return;
      key = k;
      sum = new Float32Array(NB); one = srcBuf(0);
      for (let s = 0; s < P.count; s++) { const b = srcBuf(s), gk = gainOf(s); for (let i = 0; i < NB; i++) sum[i] += b[i] * gk; }
      measured = 20 * Math.log10(A.rms(sum) / A.rms(one));
      let lin = 0, pw = 0;
      for (let s = 0; s < P.count; s++) { lin += gainOf(s); pw += gainOf(s) ** 2; }
      predicted = P.corr === 'same' ? 20 * Math.log10(lin) : 10 * Math.log10(pw);
    }

    // 실시간 소리
    const rngs = [], pinks = [], phs = new Float64Array(MAXN);
    for (let k = 0; k < MAXN; k++) { rngs.push(U.rng(1001 + k * 31)); pinks.push([0, 0, 0, 0, 0, 0, 0]); }
    const pinkNext = (k) => {
      const w = rngs[k].range(-1, 1), b = pinks[k];
      b[0] = 0.99886 * b[0] + w * 0.0555179; b[1] = 0.99332 * b[1] + w * 0.0750759; b[2] = 0.969 * b[2] + w * 0.153852;
      b[3] = 0.8665 * b[3] + w * 0.3104856; b[4] = 0.55 * b[4] + w * 0.5329522; b[5] = -0.7616 * b[5] - w * 0.016898;
      const v = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + w * 0.5362) * 0.11; b[6] = w * 0.115926;
      return v;
    };
    const gl = new Float64Array(MAXN);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const kk = A.onePoleCoef(20, sr);
        for (let i = 0; i < n; i++) {
          let v = 0;
          const shared = P.src === 'noise' ? pinkNext(0) : 0;
          if (P.src === 'sine') for (let s = 0; s < MAXN; s++) { phs[s] += (P.corr === 'same' ? FREQS[0] : FREQS[s]) / sr; if (phs[s] >= 1) phs[s] -= 1; }
          for (let s = 0; s < MAXN; s++) {
            const target = s < P.count ? gainOf(s) : 0;
            gl[s] += (target - gl[s]) * kk;
            if (P.src === 'noise') {
              const x = P.corr === 'same' ? shared : (s === 0 ? shared : pinkNext(s));
              v += x * gl[s];
            } else v += Math.sin(U.TAU * (P.corr === 'same' ? phs[0] : phs[s])) * 0.5 * gl[s];
          }
          v *= 0.13; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const topH = Math.max(90, H * 0.52), lw = W - pad * 3 - 90;
        // 음원 파형 + 합
        D.rect(g, pad, pad, lw, topH, 'rgba(0,0,0,0.35)');
        const VIEW = P.src === 'noise' ? 600 : 1200;
        const rows = P.count + 1, rh = (topH - 16) / (rows + 1.5);
        for (let s = 0; s < P.count; s++) {
          const b = srcBuf(s), y = pad + 14 + s * rh;
          A.drawWave(g, b, pad, y, lw, rh, { count: VIEW, amp: 1.4 * gainOf(s), color: 'rgba(255,255,255,0.55)', background: false, axis: false, lineWidth: 1 });
        }
        const ys = pad + 14 + P.count * rh;
        A.drawWave(g, sum, pad, ys, lw, rh * 2.5, { count: VIEW, amp: 1.4 / 2.5, color: col, background: false, lineWidth: 1.5 });
        D.text(g, Lx(`음원 ${P.count}개 (흰색)와 합 (색, 같은 배율)`, `${P.count} sources (white) and their sum (color, same scale)`), pad + 4, pad + 2, { size: 10, color: C.dim });

        // 미터
        const mx = pad * 2 + lw, mh = topH - 20;
        const r1 = A.linToDb(A.rms(one)), rs = A.linToDb(A.rms(sum));
        const base = r1 + 6;
        A.drawMeter(g, mx + 6, pad, 30, mh, r1 - base - 18, { minDb: -48, label: Lx('1개', 'One') });
        A.drawMeter(g, mx + 50, pad, 30, mh, rs - base - 18, { minDb: -48, label: Lx('합', 'Sum'), color: col });

        // 음원 수에 따른 합 레벨 그래프
        const gy = pad * 2 + topH, gh = H - gy - pad, gw = W - pad * 2;
        D.rect(g, pad, gy, gw, gh, 'rgba(0,0,0,0.35)');
        const xN = (nn) => pad + 40 + ((nn - 1) / 7) * (gw - 60), yDb = (db) => gy + gh - 16 - (db / 20) * (gh - 34);
        for (let db = 0; db <= 18; db += 6) { D.line(g, pad + 36, yDb(db), pad + gw - 10, yDb(db), C.grid, 1); D.text(g, '+' + db + 'dB', pad + 2, yDb(db) - 6, { size: 9, color: C.dim }); }
        for (let nn = 1; nn <= 8; nn++) D.text(g, String(nn), xN(nn), gy + gh - 13, { size: 9, color: C.dim, align: 'center' });
        const line = (fn, color, lw2) => { g.beginPath(); for (let i = 0; i <= 70; i++) { const nn = 1 + 7 * i / 70, x = xN(nn), y = yDb(fn(nn)); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.strokeStyle = color; g.lineWidth = lw2; g.stroke(); };
        line((nn) => 20 * Math.log10(nn), P.corr === 'same' ? col : 'rgba(255,255,255,0.3)', P.corr === 'same' ? 2.5 : 1);
        line((nn) => 10 * Math.log10(nn), P.corr === 'indep' ? col : 'rgba(255,255,255,0.3)', P.corr === 'indep' ? 2.5 : 1);
        D.text(g, '20 log N', xN(8) - 50, yDb(18) - 14, { size: 9, color: C.dim });
        D.text(g, '10 log N', xN(8) - 50, yDb(9) + 4, { size: 9, color: C.dim });
        D.circle(g, xN(P.count), yDb(measured), 5, C.warn);
        D.text(g, Lx('음원 수(N)에 따른 합 레벨, 노란 점 = 측정값', 'Sum level vs number of sources (N), yellow dot = measured'), pad + 4, gy + 3, { size: 10, color: C.dim });

        ctx.stat(Lx('측정한 합 레벨 (1개 대비)', 'Measured sum level (vs one)'), (measured >= 0 ? '+' : '') + measured.toFixed(2) + ' dB');
        ctx.stat(Lx('이론값', 'Theory'), (predicted >= 0 ? '+' : '') + predicted.toFixed(2) + ' dB (' + (P.corr === 'same' ? Lx('진폭 합', 'amplitude sum') : Lx('에너지 합', 'energy sum')) + ')');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
