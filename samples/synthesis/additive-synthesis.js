// 가산 합성: 사인파(부분음)를 더해 음을 만듦. 모든 부분음이 같은 엔벨로프 vs 부분음마다 다른 엔벨로프
GTL.register({
  id: 'additive-synthesis',
  title: '가산 합성 (부분음별 엔벨로프)',
  summary: '사인파 여러 개(부분음)를 더해 음을 만드는 가산 합성. 모든 부분음이 같이 줄어들면 오르간처럼 정적이고, 높은 부분음이 먼저 사라지면 현을 뜯은 것처럼 살아 있는 소리가 됨.',
  views: { a: '공통 엔벨로프', b: '부분음별 엔벨로프' },
  controls: '파라미터 표에서 부분음 수, 스펙트럼 모양, 감쇠 시간을 바꿈. "소리 켜기"를 누르면 같은 음이 반복됨.',
  info: `
    <p>푸리에 정리에 따르면 주기적인 소리는 사인파의 합. <b>가산 합성(Additive Synthesis)</b>은 이 사인파(부분음, Partial)를 하나씩 직접 만들어 더함. 부분음마다 주파수, 크기, 엔벨로프를 따로 정할 수 있어 가장 자유로운 합성 방식.</p>
    <p>실제 악기의 부분음은 서로 다르게 움직임. 기타, 피아노는 높은 부분음이 빨리 사라져 음이 점점 어두워짐. 모든 부분음에 같은 엔벨로프를 쓰면 음색이 시간에 따라 변하지 않아 전자음처럼 들림.</p>
    <ul>
      <li><b>비배음성(Inharmonicity)</b>: 피아노 현처럼 단단한 현은 n번째 부분음이 n f0보다 조금 높음. <code>fn = n f0 &radic;(1 + B n&sup2;)</code></li>
      <li><b>단점</b>: 부분음마다 오실레이터와 엔벨로프가 필요해 계산량과 조절할 값이 많음. 그래서 분석 데이터(재합성)나 드로바 오르간처럼 규칙으로 묶어 씀.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" class="t-small t-dim">${L('부분음', 'Partials')}</text>
    <path d="M20,40 q10,-14 20,0 t20,0 t20,0 t20,0 t20,0" class="d-line"/>
    <path d="M20,75 q5,-10 10,0 t10,0 t10,0 t10,0 t10,0 t10,0 t10,0 t10,0 t10,0 t10,0" class="d-line"/>
    <path d="M20,110 q3.3,-7 6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0 t6.7,0" class="d-line"/>
    <text x="130" y="44" class="t-small">f0</text><text x="130" y="79" class="t-small">2 f0</text><text x="130" y="114" class="t-small">3 f0</text>
    <text x="170" y="80" class="t-small">x ${L('엔벨로프', 'envelope')}</text>
    <path d="M240,48 l4,-14 l60,6" class="d-a"/><path d="M240,83 l4,-12 l60,6" class="d-a"/><path d="M240,118 l4,-10 l60,6" class="d-a"/>
    <path d="M330,48 l4,-14 q30,8 60,12" class="d-b"/><path d="M330,83 l4,-12 q15,10 30,12" class="d-b"/><path d="M330,118 l4,-10 q8,8 14,10" class="d-b"/>
    <text x="272" y="140" text-anchor="middle" class="t-small t-a">${L('A: 모두 같음', 'A: all the same')}</text>
    <text x="370" y="140" text-anchor="middle" class="t-small t-b">${L('B: 높을수록 빨리', 'B: higher decays faster')}</text>
    <text x="440" y="84" class="t-small">${L('→ 모두 더함', '→ sum all')}</text>
  </svg>`,
  look: [
    '위 그림(시간 x 부분음)에서 A는 모든 줄이 같이 흐려지고, B는 위쪽 줄(높은 부분음)이 먼저 사라짐',
    '"소리 켜기"를 누르고 B를 들으면 밝게 시작해 점점 둥글어지는 현 소리. A는 음량만 줄어드는 오르간 같은 소리.',
    '"스펙트럼 무게중심" 측정값을 보면 B는 시간이 지나며 1 근처로 내려가고, A는 그대로',
    '비배음성을 0.001 이상으로 올리면 높은 부분음이 초록 배음 눈금보다 오른쪽으로 밀리고, 소리가 피아노 저음처럼 금속성을 띰',
  ],
  refs: [
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '가산 합성과 분석 재합성' },
    { type: 'paper', title: 'Jean-Claude Risset, Max V. Mathews, "Analysis of Musical-Instrument Tones", Physics Today 22(2)', year: 1969, note: '트럼펫 음의 부분음별 엔벨로프 분석' },
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments', year: 1998, note: '현의 비배음성 fn = n f0 sqrt(1 + B n^2)' },
    { type: 'book', title: 'Julius O. Smith III, Spectral Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/sasp/', note: '사인파 모델링과 가산 재합성' },
  ],
  params: [
    { key: 'envMode', label: '엔벨로프', type: 'select', options: [{ value: 'common', label: '공통' }, { value: 'partial', label: '부분음별' }], a: 'common', b: 'partial', group: '부분음' },
    { key: 'count', label: '부분음 수', type: 'int', min: 1, max: 40, default: 24, shared: true },
    { key: 'shape', label: '스펙트럼 모양', type: 'select', options: [{ value: 'saw', label: '톱니파 (1/n)' }, { value: 'square', label: '사각파 (홀수, 1/n)' }, { value: 'soft', label: '부드러움 (1/n^2)' }], default: 'saw', shared: true },
    { key: 'decay', label: '기음 감쇠 시간 (초)', type: 'range', min: 0.3, max: 6, step: 0.1, default: 3, shared: true },
    { key: 'tilt', label: '높은 부분음 감쇠 배율', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.35, shared: true, help: '부분음 번호가 1 늘 때마다 감쇠 속도가 늘어나는 비율', when: (p) => p.envMode === 'partial' },
    { key: 'inharm', label: '비배음성 B', type: 'range', min: 0, max: 0.003, step: 0.0001, default: 0, shared: true },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 33, max: 72, default: 48, shared: true, group: '음', help: '60 = C4 (가운데 도)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Additive Synthesis (Per-Partial Envelopes)',
    summary: 'Additive synthesis builds a tone by adding many sine waves (partials). If all partials fade together, the tone is static like an organ. If high partials fade first, it sounds alive like a plucked string.',
    views: { a: 'Shared envelope', b: 'Per-partial envelopes' },
    controls: 'Change the partial count, spectrum shape and decay time in the parameter table. Press "Sound on" to hear the same note repeat.',
    info: `
    <p>Fourier's theorem says a periodic sound is a sum of sine waves. <b>Additive synthesis</b> makes each of these sine waves (partials) directly and adds them. Each partial can have its own frequency, level and envelope, so this is the most flexible synthesis method.</p>
    <p>In real instruments, partials move differently. On a guitar or piano, high partials fade fast, so the note gets darker over time. If every partial uses the same envelope, the tone does not change over time and sounds electronic.</p>
    <ul>
      <li><b>Inharmonicity</b>: a stiff string, like a piano string, has its n-th partial a bit above n f0: <code>fn = n f0 &radic;(1 + B n&sup2;)</code>.</li>
      <li><b>Downside</b>: each partial needs an oscillator and an envelope, so it costs a lot of CPU and has many controls. In practice you group them with rules (analysis data for resynthesis, or drawbars on an organ).</li>
    </ul>`,
    look: [
      'In the top image (time x partial), all rows in A fade together. In B the upper rows (high partials) fade first.',
      'Press "Sound on" and listen to B. It starts bright and gets rounder like a string. A only gets quieter, like an organ.',
      'Watch the "Spectral centroid" stat. In B it falls toward 1 over time. In A it stays the same.',
      'Raise inharmonicity above 0.001. High partials move to the right of the green harmonic ticks, and the sound gets metallic like a low piano note.',
    ],
    refs: ['Additive synthesis and analysis/resynthesis.', 'Per-partial envelope analysis of trumpet tones.', 'String inharmonicity fn = n f0 sqrt(1 + B n^2).', 'Sinusoidal modeling and additive resynthesis.'],
    params: {
      envMode: { label: 'Envelope', group: 'Partials', options: { common: 'Shared', partial: 'Per partial' } },
      count: 'Partial count',
      shape: { label: 'Spectrum shape', options: { saw: 'Saw (1/n)', square: 'Square (odd, 1/n)', soft: 'Soft (1/n^2)' } },
      decay: 'Fundamental decay (s)',
      tilt: { label: 'High partial decay factor', help: 'How much faster each next partial decays' },
      inharm: 'Inharmonicity B',
      note: { label: 'Pitch (MIDI)', group: 'Note', help: '60 = C4 (middle C)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    const loopLen = () => P.decay * 1.4 + 0.4;

    // 부분음 n(1부터)의 주파수 배율, 크기, 감쇠 시간
    const ratio = (n) => n * Math.sqrt(1 + P.inharm * n * n);
    const weight = (n) => (P.shape === 'saw' ? 1 / n : P.shape === 'square' ? (n & 1 ? 1 / n : 0) : 1 / (n * n));
    const tau = (n) => (P.envMode === 'common' ? P.decay : P.decay / (1 + P.tilt * (n - 1))) / 6.9; // decay = -60dB 시간
    const envAt = (n, t) => Math.min(1, t / 0.004) * Math.exp(-t / tau(n));

    // 피크 정규화 (한 주기 렌더해서 최대값)
    let normKey = '', norm = 1;
    function gain() {
      const k = P.count + P.shape + P.inharm;
      if (k !== normKey) {
        normKey = k;
        let pk = 1e-6;
        for (let i = 0; i < 512; i++) { let s = 0; const ph = i / 512; for (let n = 1; n <= P.count; n++) s += weight(n) * Math.sin(TAU * ph * n); pk = Math.max(pk, Math.abs(s)); }
        norm = 0.42 / pk;
      }
      return norm;
    }

    const live = { n: 0, ph: new Float64Array(41) };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f0 = A.mtof(P.note), gn = gain(), N = P.count, len = loopLen();
        const inc = [], w = [];
        for (let p = 1; p <= N; p++) { const f = f0 * ratio(p); inc[p] = f / sr; w[p] = f < sr * 0.45 ? weight(p) : 0; }
        for (let i = 0; i < n; i++) {
          const t = (live.n++ / sr) % len;
          let s = 0;
          for (let p = 1; p <= N; p++) {
            if (!w[p]) continue;
            s += w[p] * envAt(p, t) * Math.sin(TAU * live.ph[p]);
            live.ph[p] += inc[p]; if (live.ph[p] >= 1) live.ph[p] -= 1;
          }
          const o = s * gn; l[i] = o; r[i] = o;
        }
      },
    });

    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, N = P.count, len = loopLen();
        const tp = (snd.on ? live.n / (snd.sr || 48000) : visT) % len;
        // 1) 시간 x 부분음 지도 (밝기 = dB)
        const h1 = (H - pad * 3) * 0.5, y1 = pad, x0 = pad + 22, w = W - x0 - pad;
        D.rect(g, x0, y1, w, h1, 'rgba(0,0,0,0.35)');
        const cols = Math.min(160, Math.floor(w / 3)), rh = h1 / N, cw = w / cols;
        const base = ctx.side === 'a' ? [255, 122, 89] : [79, 195, 247];
        for (let p = 1; p <= N; p++) {
          const wv = weight(p);
          if (!wv) continue;
          for (let c = 0; c < cols; c++) {
            const db = A.linToDb(wv * envAt(p, (c + 0.5) / cols * len));
            const a = U.clamp((db + 60) / 60, 0, 1);
            if (a <= 0.01) continue;
            g.fillStyle = `rgba(${base[0]},${base[1]},${base[2]},${a.toFixed(3)})`;
            g.fillRect(x0 + c * cw, y1 + h1 - p * rh, cw + 0.5, rh - (rh > 4 ? 1 : 0));
          }
        }
        for (const p of [1, 5, 10, 20, 30, 40]) if (p <= N) D.text(g, '' + p, x0 - 4, y1 + h1 - p * rh + rh / 2 - 5, { size: 9, color: C.dim, align: 'right' });
        D.line(g, x0 + tp / len * w, y1, x0 + tp / len * w, y1 + h1, C.text, 1);
        D.text(g, Lx('시간 → (세로: 부분음 번호, 밝기: 크기)', 'Time → (vertical: partial number, brightness: level)'), x0 + 4, y1 + 3, { size: 10, color: C.text });
        // 2) 현재 순간의 스펙트럼 (막대, 로그 주파수)
        const y2 = y1 + h1 + pad, h2 = H - y2 - pad, f0 = A.mtof(P.note);
        D.rect(g, pad, y2, W - pad * 2, h2, 'rgba(0,0,0,0.35)');
        A.drawFreqGrid(g, pad, y2, W - pad * 2, h2, { fmin: 20, fmax: 20000, minDb: -60, maxDb: 0, dbStep: 20 });
        let sw = 0, swn = 0;
        for (let p = 1; p <= N; p++) {
          const e = weight(p) * envAt(p, tp), f = f0 * ratio(p);
          const hx = A.freqX(f0 * p, pad, W - pad * 2, 20, 20000);
          D.line(g, hx, y2 + h2 - 5, hx, y2 + h2, C.good, 2);
          if (f > 20000 || e <= 0) continue;
          sw += e * p; swn += e;
          const px = A.freqX(f, pad, W - pad * 2, 20, 20000), py = y2 + h2 - U.clamp((A.linToDb(e) + 60) / 60, 0, 1) * h2;
          D.line(g, px, y2 + h2, px, py, col, 2.5);
        }
        D.text(g, Lx('현재 스펙트럼 (초록 눈금 = 정확한 배음 위치)', 'Current spectrum (green ticks = exact harmonic positions)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        ctx.stat(Lx('부분음 수', 'Partials'), N);
        ctx.stat(Lx('스펙트럼 무게중심 (배음 번호)', 'Spectral centroid (harmonic number)'), swn > 0 ? (sw / swn).toFixed(2) : '-');
        ctx.stat(Lx(`${N}번 부분음 감쇠 시간`, `Partial ${N} decay time`), (tau(N) * 6.9).toFixed(2) + ' s');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
