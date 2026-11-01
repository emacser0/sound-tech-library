// 푸리에 급수: 사인파 N개로 사각파, 톱니파, 삼각파 만들기. 깁스 현상과 시그마 보정
GTL.register({
  id: 'fourier-series',
  title: '푸리에 급수와 깁스 현상',
  summary: '사인파를 몇 개 더하면 사각파, 톱니파가 되는지 확인. 항을 늘릴수록 모양이 가까워지지만, 급격히 뛰는 곳 옆의 약 9% 튀어나옴(깁스 현상)은 사라지지 않음.',
  views: { a: '3항', b: '25항' },
  controls: '파라미터 표에서 항 수와 목표 파형을 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 부분합이 들림.',
  info: `
    <p><b>푸리에 급수(Fourier Series)</b>: 주기 파형은 모두 기본 주파수의 정수배 사인파를 알맞은 크기로 더해 만들 수 있음. 이 항들을 앞에서부터 N개만 더한 것을 <b>부분합</b>이라고 부름.</p>
    <ul>
      <li><b>사각파</b>: 홀수 배음만, 크기 1/n</li>
      <li><b>톱니파</b>: 모든 배음, 크기 1/n (부호가 번갈아 바뀜)</li>
      <li><b>삼각파</b>: 홀수 배음만, 크기 1/n². 빨리 줄어들어 적은 항으로도 거의 같아짐.</li>
    </ul>
    <p>파형이 순간적으로 뛰는 곳(불연속점) 옆에서는 항을 아무리 늘려도 뛰는 높이의 약 9%만큼 튀어나온 뒤 출렁임. 이것이 <b>깁스 현상(Gibbs Phenomenon)</b>. 출렁임이 좁아질 뿐 높이는 줄지 않음.</p>
    <p>디지털 오디오에서는 나이퀴스트 주파수 위의 항을 넣을 수 없음. 그래서 대역 제한 파형은 항상 깁스 출렁임을 가짐. <b>란초스 시그마(Lanczos Sigma)</b> 보정은 높은 항을 조금씩 줄여 출렁임을 없애지만, 모서리가 무뎌짐.</p>`,
  diagram: (L) => {
    const x0 = 30, w = 300, y = 95, a = 55;
    const sq = (x) => (x < 0.5 ? 1 : -1);
    const ps = (x, N) => { let v = 0; for (let k = 1; k <= 2 * N - 1; k += 2) v += Math.sin(2 * Math.PI * k * x) / k; return (4 / Math.PI) * v; };
    const path = (fn) => { let d = ''; for (let i = 0; i <= 300; i++) { const x = i / 300; d += (i ? 'L' : 'M') + (x0 + x * w).toFixed(1) + ',' + (y - a * fn(x)).toFixed(1); } return d; };
    return `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="${x0}" y1="${y}" x2="${x0 + w}" y2="${y}" class="d-dim"/>
    <path d="M${x0},${y - a} L${x0 + w / 2},${y - a} L${x0 + w / 2},${y + a} L${x0 + w},${y + a}" class="d-dim" stroke-dasharray="4 3"/>
    <path d="${path((x) => ps(x, 1))}" class="d-a"/>
    <path d="${path((x) => ps(x, 12))}" class="d-b"/>
    <line x1="${x0 + 4}" y1="${y - a * 1.179}" x2="${x0 + 60}" y2="${y - a * 1.179}" class="d-accent"/>
    <text x="${x0 + 64}" y="${y - a * 1.179 - 2}" class="t-small">${L('약 9% 튀어나옴 (깁스)', 'about 9% overshoot (Gibbs)')}</text>
    <text x="350" y="40" class="t-small t-a">${L('1항: sin(x)', '1 term: sin(x)')}</text>
    <text x="350" y="60" class="t-small t-b">${L('12항: 홀수 배음 1/n', '12 terms: odd harmonics 1/n')}</text>
    <text x="350" y="80" class="t-small t-dim">${L('점선: 목표 사각파', 'dashed: target square wave')}</text>
    <text x="350" y="110" class="t-small t-mono">(4/π) Σ sin(nx)/n</text>
    <text x="350" y="128" class="t-small t-dim">${L('n = 1, 3, 5, ...', 'n = 1, 3, 5, ...')}</text>
    <text x="350" y="156" class="t-small t-dim">${L('항이 늘면 출렁임 폭만 좁아짐', 'More terms only narrow the ripple')}</text>
  </svg>`;
  },
  look: [
    'A의 항 수를 1에서 하나씩 올리면 파형이 사인파에서 사각파로 점점 바뀌고 소리가 밝아짐',
    'B의 항 수를 60까지 올려도 "깁스 오버슈트" 측정값이 약 9%에서 줄지 않음',
    '"란초스 시그마 보정"을 켜면 오버슈트가 1% 아래로 줄지만 모서리 기울기가 완만해짐',
    '목표 파형을 삼각파로 바꾸면 3항만으로도 오차가 작음. 배음이 1/n²로 빨리 줄기 때문.',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Mathematics of the Discrete Fourier Transform (DFT)', url: 'https://ccrma.stanford.edu/~jos/mdft/', note: '푸리에 급수와 사인파 분해' },
    { type: 'paper', title: 'J. Willard Gibbs, "Fourier\'s Series", Nature 59', year: 1899, note: '깁스 현상의 원래 지적' },
    { type: 'book', title: 'Cornelius Lanczos, Applied Analysis', year: 1956, note: '시그마 인자로 깁스 출렁임 줄이기' },
    { type: 'book', title: 'Miller Puckette, The Theory and Technique of Electronic Music', year: 2007, url: 'http://msp.ucsd.edu/techniques.htm', note: '푸리에 분석과 합성' },
  ],
  params: [
    { key: 'terms', label: '항 수 (0이 아닌 항)', type: 'int', min: 1, max: 60, a: 3, b: 25, default: 25, group: '부분합' },
    { key: 'sigma', label: '란초스 시그마 보정', type: 'bool', default: false, group: '부분합', help: '높은 항을 sinc 모양으로 줄여 깁스 출렁임을 없앰' },
    { key: 'shape', label: '목표 파형', type: 'select', options: [{ value: 'square', label: '사각파' }, { value: 'saw', label: '톱니파' }, { value: 'tri', label: '삼각파' }], default: 'square', shared: true },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 33, max: 72, default: 45, shared: true, help: '45 = A2 (110Hz)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Fourier Series and the Gibbs Phenomenon',
    summary: 'See how many sine waves it takes to build a square or saw wave. More terms bring the shape closer, but the roughly 9% overshoot next to each jump (the Gibbs phenomenon) never goes away.',
    views: { a: '3 terms', b: '25 terms' },
    controls: 'Change the number of terms and the target shape in the parameter table. Press "Sound on" to hear the partial sum of the selected view.',
    info: `
    <p><b>Fourier series</b>: any periodic wave can be built by adding sine waves at whole-number multiples of the fundamental, each at the right level. Adding only the first N terms gives a <b>partial sum</b>.</p>
    <ul>
      <li><b>Square</b>: odd harmonics only, level 1/n.</li>
      <li><b>Saw</b>: every harmonic, level 1/n (sign alternates).</li>
      <li><b>Triangle</b>: odd harmonics only, level 1/n². They shrink fast, so a few terms are almost enough.</li>
    </ul>
    <p>Next to a sudden jump (discontinuity), the partial sum overshoots by about 9% of the jump and then ripples, no matter how many terms you add. This is the <b>Gibbs phenomenon</b>. The ripple only gets narrower, not lower.</p>
    <p>Digital audio cannot hold terms above the Nyquist frequency. So every band-limited wave has Gibbs ripple. <b>Lanczos sigma</b> correction scales down the higher terms to remove the ripple, but the edges become less steep.</p>`,
    look: [
      'Raise A\'s term count from 1 one step at a time. The wave changes from a sine into a square, and the sound gets brighter.',
      'Raise B\'s term count up to 60. The "Gibbs overshoot" stat stays near 9%.',
      'Turn on "Lanczos sigma". The overshoot drops below 1%, but the edges get less steep.',
      'Set the target to triangle. Even 3 terms give a small error, because the harmonics fall off as 1/n².',
    ],
    refs: ['Fourier series and sine decomposition.', 'The original note on the Gibbs phenomenon.', 'Sigma factors that reduce Gibbs ripple.', 'Fourier analysis and synthesis.'],
    params: {
      terms: { label: 'Terms (non-zero)', group: 'Partial sum' },
      sigma: { label: 'Lanczos sigma', group: 'Partial sum', help: 'Scales down higher terms with a sinc shape to remove the Gibbs ripple' },
      shape: { label: 'Target shape', options: { square: 'Square', saw: 'Saw', tri: 'Triangle' } },
      note: { label: 'Pitch (MIDI)', help: '45 = A2 (110 Hz)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const RES = 1024;

    // 항 목록 [{ k: 배음 번호, c: 계수 }]
    function terms() {
      const out = [];
      for (let i = 0; i < P.terms; i++) {
        let k, c;
        if (P.shape === 'saw') { k = i + 1; c = (2 / Math.PI) * (k % 2 ? 1 : -1) / k; }
        else if (P.shape === 'tri') { k = 2 * i + 1; c = (8 / (Math.PI * Math.PI)) * (i % 2 ? -1 : 1) / (k * k); }
        else { k = 2 * i + 1; c = (4 / Math.PI) / k; }
        out.push({ k, c });
      }
      if (P.sigma) {
        const m = out[out.length - 1].k + 1;
        for (const t of out) { const x = Math.PI * t.k / m; t.c *= Math.sin(x) / x; }
      }
      return out;
    }
    // 목표 파형 (위상 x: 0~1)
    const target = (x) => {
      x -= Math.floor(x);
      if (P.shape === 'saw') return x < 0.5 ? 2 * x : 2 * x - 2;
      if (P.shape === 'tri') return x < 0.25 ? 4 * x : x < 0.75 ? 2 - 4 * x : 4 * x - 4;
      return x < 0.5 ? 1 : -1;
    };

    let key = '', T = [], sum = new Float32Array(RES), tgt = new Float32Array(RES), over = 0, rmsErr = 0, peak = 1;
    function analyze() {
      const k = P.terms + P.shape + P.sigma;
      if (k === key) return;
      key = k; T = terms();
      let mx = -Infinity, e2 = 0;
      for (let i = 0; i < RES; i++) {
        const x = i / RES; let v = 0;
        for (const t of T) v += t.c * Math.sin(U.TAU * t.k * x);
        sum[i] = v; tgt[i] = target(x);
        mx = Math.max(mx, Math.abs(v));
        const isEdge = P.shape !== 'tri' && (Math.abs(x - 0.5) < 1 / RES);
        if (!isEdge) e2 += (v - tgt[i]) ** 2;
      }
      peak = mx;
      over = P.shape === 'tri' ? 0 : ((mx - 1) / 2) * 100;
      rmsErr = Math.sqrt(e2 / RES);
    }

    const live = { ph: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        const f0 = A.mtof(P.note), g0 = 0.42 / Math.max(1, peak);
        for (let i = 0; i < n; i++) {
          live.ph += f0 / sr; if (live.ph >= 1) live.ph -= 1;
          let v = 0;
          for (const t of T) if (t.k * f0 < sr * 0.45) v += t.c * Math.sin(U.TAU * t.k * live.ph);
          v *= g0; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const mh = Math.max(80, H * 0.58), x0 = pad, w = W - pad * 2, mid = pad + mh / 2, amp = mh * 0.38;
        D.rect(g, x0, pad, w, mh, 'rgba(0,0,0,0.35)');
        D.line(g, x0, mid, x0 + w, mid, C.grid, 1);
        D.line(g, x0, mid - amp, x0 + w, mid - amp, C.grid, 1);
        D.line(g, x0, mid + amp, x0 + w, mid + amp, C.grid, 1);
        const plot = (fn, color, lw) => {
          g.beginPath();
          const N = Math.floor(w * 1.5);
          for (let i = 0; i <= N; i++) { const x = (i / N) * 2, px = x0 + (i / N) * w, py = mid - fn(x) * amp; i ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = color; g.lineWidth = lw; g.stroke();
        };
        // 개별 항 (적을 때만)
        if (T.length <= 6) for (const t of T) plot((x) => t.c * Math.sin(U.TAU * t.k * x), 'rgba(199,146,234,0.45)', 1);
        plot(target, 'rgba(255,255,255,0.35)', 1);
        plot((x) => sum[Math.floor((x - Math.floor(x)) * RES) % RES], col, 2);
        D.text(g, Lx('흰색: 목표 파형, 색: 부분합', 'White: target, color: partial sum') + (T.length <= 6 ? Lx(', 보라: 각 항', ', purple: each term') : ''), x0 + 4, pad + 3, { size: 10, color: C.dim });

        // 계수 막대
        const by = pad * 2 + mh, bh = H - by - pad;
        D.rect(g, x0, by, w, bh, 'rgba(0,0,0,0.35)');
        const maxK = 60, bw = w / maxK;
        for (const t of T) {
          if (t.k > maxK) break;
          const hgt = Math.min(1, Math.abs(t.c) / (4 / Math.PI)) * (bh - 18);
          D.rect(g, x0 + (t.k - 1) * bw + 0.5, by + bh - hgt, Math.max(1, bw - 1), hgt, t.c >= 0 ? col : C.accent);
        }
        D.text(g, Lx('배음 계수 |c_n| (n = 1~60, 보라 = 음수)', 'Harmonic coefficients |c_n| (n = 1 to 60, purple = negative)'), x0 + 4, by + 3, { size: 10, color: C.dim });

        const f0 = A.mtof(P.note), topK = T.length ? T[T.length - 1].k : 1;
        ctx.stat(Lx('가장 높은 배음', 'Highest harmonic'), `${topK} (${(topK * f0).toFixed(0)} Hz)`);
        ctx.stat(Lx('깁스 오버슈트', 'Gibbs overshoot'), P.shape === 'tri' ? Lx('불연속점 없음', 'No jump') : over.toFixed(2) + Lx('% (뛰는 높이 기준)', '% (of jump)'));
        ctx.stat(Lx('RMS 오차', 'RMS error'), rmsErr.toFixed(4));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
