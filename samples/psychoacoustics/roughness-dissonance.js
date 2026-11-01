// 거칠기와 감각적 불협화: Plomp-Levelt 곡선과 Sethares 모델. 음색이 협화 음정을 결정함
GTL.register({
  id: 'roughness-dissonance',
  title: '거칠기와 불협화 곡선 (Plomp-Levelt)',
  summary: '두 음의 불협화는 가까운 성분끼리 만드는 거칠기의 합으로 설명됨. 사인파(A)의 불협화 곡선은 반음 근처만 솟고 나머지는 평평하지만, 배음이 있는 음(B)은 5도, 4도, 3도처럼 정수비 음정에서 골이 생김.',
  views: { a: '사인파', b: '배음 6개' },
  controls: '파라미터 표에서 음정(센트)과 음색을 바꿈',
  info: `
    <p>두 사인파의 주파수가 아주 가까우면 맥놀이, 조금 더 멀어지면 <b>거칠기(Roughness)</b>가 들림. Plomp와 Levelt(1965)는 거칠기가 임계 대역폭의 약 25% 간격에서 가장 크고, 임계 대역을 넘으면 거의 사라짐을 보였음.</p>
    <p>실제 악기 음은 배음을 여러 개 가짐. 두 음의 모든 성분 쌍이 만드는 거칠기를 더하면 <b>감각적 불협화(Sensory dissonance)</b> 곡선이 나옴. Sethares 모델:</p>
    <ul>
      <li>쌍마다 <code>d = min(a1, a2) (e^(-3.5 s x) - e^(-5.75 s x))</code>, x = 주파수 차, s = 0.24 / (0.0207 f_min + 18.96)</li>
      <li>배음이 정수배이면 3:2, 4:3, 5:4에서 성분이 겹쳐 거칠기가 줄어 곡선에 골이 생김</li>
      <li>사인파는 겹칠 성분이 없어서 5도나 3도가 특별하지 않음</li>
    </ul>
    <p>즉 어떤 음정이 협화로 들리는지는 음색에 달림. "늘린 배음 (옥타브 2.1배)"을 고르면 골이 2:1이 아니라 2.1:1로 옮겨감. Sethares는 이를 이용해 음색에 맞는 음계를 설계함. 단점: 화성의 기능, 문화적 학습 같은 음악적 협화는 설명하지 못함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="140" x2="520" y2="140" class="d-line"/><line x1="30" y1="20" x2="30" y2="140" class="d-line"/>
    <text x="520" y="158" text-anchor="end" class="t-small t-dim">${L('두 사인파의 주파수 차 (임계 대역폭 기준)', 'Frequency gap of two sines (in critical bandwidths)')}</text>
    <text x="36" y="16" class="t-small t-dim">${L('거칠기', 'Roughness')}</text>
    <path d="M30,140 C50,40 80,30 110,40 C170,70 230,120 330,136 L520,139" class="d-a"/>
    <line x1="88" y1="140" x2="88" y2="32" class="d-dim" stroke-dasharray="3 3"/>
    <text x="92" y="30" class="t-small">${L('최대: 대역폭의 약 25%', 'Max: about 25% of bandwidth')}</text>
    <line x1="270" y1="140" x2="270" y2="60" class="d-dim" stroke-dasharray="3 3"/>
    <text x="276" y="74" class="t-small">${L('1 임계 대역: 거의 사라짐', '1 critical band: almost gone')}</text>
    <text x="40" y="132" class="t-small t-dim">${L('맥놀이', 'beats')}</text>
  </svg>`,
  look: [
    'B의 곡선에는 3:2(702센트), 4:3(498센트), 5:4(386센트), 2:1(1200센트)에 골이 있음. A는 100센트 근처 봉우리 뒤로 평평함.',
    '기본 음정(600센트, 삼전음)에서 B의 불협화 값은 A의 몇 배. "소리 켜기"로 B를 들으면 거칠게 들림.',
    '음정을 702센트로 두고 B를 들으면 매끈하고, 690센트로 옮기면 느린 맥놀이가 생김. 평균율 5도(700센트)도 아주 조금 맥놀이가 있음.',
    'B의 음색을 "늘린 배음"으로 바꾸면 옥타브의 골이 1200센트보다 오른쪽(약 1284센트)으로 옮겨감',
    '기준 음을 낮추면 곡선 전체가 오른쪽으로 넓어짐. 저음에서 3도 화음이 탁하게 들리는 이유.',
  ],
  refs: [
    { type: 'paper', title: 'Plomp, Levelt, "Tonal consonance and critical bandwidth", JASA 38(4)', year: 1965, note: '두 사인파의 협화도 측정과 임계 대역' },
    { type: 'paper', title: 'Sethares, "Local consonance and the relationship between timbre and scale", JASA 94(3)', year: 1993, note: '이 샘플의 불협화 식' },
    { type: 'book', title: 'William A. Sethares, Tuning, Timbre, Spectrum, Scale (2nd ed.)', year: 2005, note: '음색에 맞춘 음계 설계' },
    { type: 'book', title: 'Hermann von Helmholtz, On the Sensations of Tone', year: 1863, note: '맥놀이와 거칠기로 불협화를 설명한 고전' },
    { type: 'book', title: 'Zwicker, Fastl, Psychoacoustics: Facts and Models (3rd ed.)', year: 2007, note: '거칠기의 측정과 모델' },
  ],
  params: [
    { key: 'timbre', label: '음색', type: 'select', options: [{ value: 'sine', label: '사인파' }, { value: 'harm', label: '배음 (정수배)' }, { value: 'stretch', label: '늘린 배음 (옥타브 2.1배)' }], a: 'sine', b: 'harm', default: 'sine', group: '음색' },
    { key: 'nPart', label: '배음 수', type: 'int', min: 2, max: 10, default: 6, shared: true, when: (p) => p.timbre !== 'sine' },
    { key: 'roll', label: '배음 감쇠 (배음마다 곱함)', type: 'range', min: 0.5, max: 1, step: 0.01, default: 0.88, shared: true, when: (p) => p.timbre !== 'sine' },
    { key: 'cents', label: '음정 (센트)', type: 'range', min: 0, max: 1300, step: 1, default: 600, shared: true, group: '음정' },
    { key: 'base', label: '기준 음 (Hz)', type: 'range', min: 80, max: 800, step: 1, default: 262, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Roughness & Dissonance Curve (Plomp-Levelt)',
    summary: 'The dissonance of two tones can be explained as the sum of roughness between close partials. For sines (A) the curve only peaks near a semitone and is flat elsewhere. For tones with harmonics (B) dips appear at integer ratios like the fifth, fourth and third.',
    views: { a: 'Sine', b: '6 harmonics' },
    controls: 'Change the interval (cents) and the timbre in the parameter table.',
    info: `
    <p>When two sines are very close you hear beats. A bit further apart you hear <b>roughness</b>. Plomp and Levelt (1965) showed roughness is largest at about 25% of the critical bandwidth and almost gone beyond one critical band.</p>
    <p>Real instrument tones have many harmonics. Add up the roughness of every partial pair of the two tones and you get the <b>sensory dissonance</b> curve. The Sethares model:</p>
    <ul>
      <li>For each pair <code>d = min(a1, a2) (e^(-3.5 s x) - e^(-5.75 s x))</code>, x = frequency gap, s = 0.24 / (0.0207 f_min + 18.96).</li>
      <li>With integer harmonics, partials line up at 3:2, 4:3 and 5:4, roughness drops, and the curve dips.</li>
      <li>Sines have no partials to line up, so the fifth or third is not special.</li>
    </ul>
    <p>So which intervals sound consonant depends on the timbre. Pick "Stretched harmonics (octave 2.1)" and the dip moves from 2:1 to 2.1:1. Sethares used this to design scales that fit a timbre. Drawback: it does not explain musical consonance such as harmonic function or cultural learning.</p>`,
    look: [
      'B\'s curve has dips at 3:2 (702 cents), 4:3 (498), 5:4 (386) and 2:1 (1200). A peaks near 100 cents and is flat after that.',
      'At the default interval (600 cents, tritone) B\'s dissonance is several times A\'s. Press "Sound on" and B sounds rough.',
      'Set the interval to 702 cents and listen to B: smooth. Move to 690 cents and slow beats appear. Even the equal-tempered fifth (700) beats a little.',
      'Switch B\'s timbre to "Stretched harmonics". The octave dip moves right of 1200 cents (to about 1284).',
      'Lower the base note. The whole curve widens to the right. This is why thirds sound muddy in the bass.',
    ],
    refs: ['Consonance of two sines and the critical band.', 'The dissonance formula used here.', 'Designing scales that fit a timbre.', 'Classic explanation of dissonance by beats and roughness.', 'Measuring and modeling roughness.'],
    params: {
      timbre: { label: 'Timbre', group: 'Timbre', options: { sine: 'Sine', harm: 'Harmonics (integer)', stretch: 'Stretched harmonics (octave 2.1)' } },
      nPart: 'Number of harmonics',
      roll: 'Harmonic rolloff (per harmonic)',
      cents: { label: 'Interval (cents)', group: 'Interval' },
      base: 'Base note (Hz)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const STRETCH = Math.log2(2.1);
    // 음색: [{ r (기음 대비 비), a (진폭) }]
    function spectrum() {
      if (P.timbre === 'sine') return [{ r: 1, a: 1 }];
      const out = [];
      for (let k = 1; k <= P.nPart; k++) out.push({ r: P.timbre === 'stretch' ? Math.pow(k, STRETCH) : k, a: Math.pow(P.roll, k - 1) });
      return out;
    }
    const pair = (f1, a1, f2, a2) => { const fmin = Math.min(f1, f2), s = 0.24 / (0.0207 * fmin + 18.96), x = Math.abs(f2 - f1); return Math.min(a1, a2) * (Math.exp(-3.5 * s * x) - Math.exp(-5.75 * s * x)); };
    // 두 음 사이의 불협화 (두 음 사이의 쌍만. 각 음 내부 값은 음정과 무관한 상수)
    function diss(cents, sp) {
      const ratio = Math.pow(2, cents / 1200);
      let d = 0;
      for (const p of sp) for (const q of sp) d += pair(P.base * p.r, p.a, P.base * ratio * q.r, q.a);
      return d;
    }
    const CMAX = 1300, NPT = 651;
    let key = '', curve = null, cmax = 1, sp = null;
    function analyze() {
      const k = [P.timbre, P.nPart, P.roll, P.base].join('|');
      if (k === key) return;
      key = k;
      sp = spectrum();
      curve = new Float32Array(NPT);
      cmax = 1e-9;
      for (let i = 0; i < NPT; i++) { curve[i] = diss(i / (NPT - 1) * CMAX, sp); cmax = Math.max(cmax, curve[i]); }
    }
    const JUST = [[1, 1], [16, 15], [9, 8], [6, 5], [5, 4], [4, 3], [7, 5], [3, 2], [8, 5], [5, 3], [9, 5], [15, 8], [2, 1]];
    const nearestJust = (c) => { let best = null, bd = 1e9; for (const [a, b] of JUST) { const jc = 1200 * Math.log2(a / b), d = Math.abs(jc - c); if (d < bd) { bd = d; best = [a, b, jc]; } } return best; };

    const ph = new Float64Array(24), amps = new Float64Array(24);
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        const ratio = Math.pow(2, P.cents / 1200);
        let asum = 0; for (const p of sp) asum += p.a;
        const g0 = 0.22 / asum;
        for (let i = 0; i < n; i++) {
          let v = 0, j = 0;
          for (const tr of [1, ratio]) for (const p of sp) {
            amps[j] += (p.a - amps[j]) * 0.002;
            v += amps[j] * Math.sin(ph[j]);
            ph[j] += 2 * Math.PI * P.base * tr * p.r / sr; if (ph[j] > 6.283185307) ph[j] -= 6.283185307;
            j++;
          }
          for (; j < 24; j++) amps[j] *= 0.998;
          l[i] = v * g0; r[i] = v * g0;
        }
      },
    });

    let gx = 0, gy = 0, gw = 1, gh = 1;
    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        gx = pad; gy = pad + 14; gw = W - pad * 2; gh = Math.max(60, (H - 40) * 0.62);
        const xOf = (c) => gx + gw * c / CMAX, yOf = (d) => gy + gh - 8 - (gh - 24) * d / cmax;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        for (let c = 0; c <= 1200; c += 100) { D.line(g, xOf(c), gy, xOf(c), gy + gh, C.grid); }
        for (const [a, b, ] of JUST) { const jc = 1200 * Math.log2(a / b); D.line(g, xOf(jc), gy + gh - 6, xOf(jc), gy + gh, C.good, 1.5); if (a / b !== 7 / 5 && a / b !== 16 / 15 && a / b !== 9 / 5) D.text(g, a + ':' + b, xOf(jc), gy + 14, { size: 9, align: 'center', color: C.dim }); }
        D.text(g, L('불협화 곡선 (x: 음정 0~1300센트, 초록 = 순정 음정)', 'Dissonance curve (x: interval 0~1300 cents, green = just ratios)'), gx, pad, { size: 10, color: C.dim });
        g.beginPath();
        for (let i = 0; i < NPT; i++) { const x = xOf(i / (NPT - 1) * CMAX), y = yOf(curve[i]); i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        const dNow = diss(P.cents, sp);
        D.line(g, xOf(P.cents), gy, xOf(P.cents), gy + gh, C.text, 1);
        D.circle(g, xOf(P.cents), yOf(dNow), 5, C.text);
        // 아래: 두 음의 성분과 거친 쌍
        const by = gy + gh + 20, bh = H - by - 10;
        if (bh > 24) {
          const ratio = Math.pow(2, P.cents / 1200);
          const fmin = P.base * 0.8, fmax = P.base * ratio * 12;
          const xf = (f) => A.freqX(f, gx, gw, fmin, fmax);
          D.rect(g, gx, by, gw, bh, 'rgba(0,0,0,0.35)');
          D.text(g, L('성분 (위: 기준 음, 아래: 위의 음), 선 = 거친 쌍', 'Partials (top: base, bottom: upper note), lines = rough pairs'), gx + 4, by + 3, { size: 10, color: C.dim });
          const y1 = by + bh * 0.42, y2 = by + bh * 0.85;
          let worst = 0, wf = 0;
          for (const p of sp) for (const q of sp) {
            const f1 = P.base * p.r, f2 = P.base * ratio * q.r, d = pair(f1, p.a, f2, q.a);
            if (d > 0.02) { g.globalAlpha = Math.min(1, d * 3); D.line(g, xf(f1), y1, xf(f2), y2, C.bad, 2); g.globalAlpha = 1; }
            if (d > worst) { worst = d; wf = Math.abs(f2 - f1); }
          }
          for (const p of sp) { const x = xf(P.base * p.r); if (x <= gx + gw) D.line(g, x, y1, x, y1 - 14 * p.a - 4, C.text, 2); }
          for (const q of sp) { const x = xf(P.base * ratio * q.r); if (x <= gx + gw) D.line(g, x, y2, x, y2 - 14 * q.a - 4, col, 2); }
          ctx.stat(L('가장 거친 쌍의 맥놀이', 'Beat of roughest pair'), worst > 0.001 ? wf.toFixed(1) + ' Hz' : '-');
        }
        const nj = nearestJust(P.cents);
        ctx.stat(L('음정', 'Interval'), P.cents.toFixed(0) + L('센트', ' cents'));
        ctx.stat(L('가까운 순정 음정', 'Nearest just ratio'), `${nj[0]}:${nj[1]} (${(P.cents - nj[2] >= 0 ? '+' : '') + (P.cents - nj[2]).toFixed(1)}c)`);
        ctx.stat(L('불협화 (Sethares)', 'Dissonance (Sethares)'), dNow.toFixed(3));
        snd.stat();
      },

      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
