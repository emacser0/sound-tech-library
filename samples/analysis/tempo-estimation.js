// 템포 추정: 온셋 세기의 자기상관. 가장 큰 봉우리만 고르면 2배, 1/2배 템포(옥타브 오류)가 잦음. 템포 사전 분포와 배수 합으로 보완
GTL.register({
  id: 'tempo-estimation',
  title: '템포 추정 (온셋 자기상관)',
  summary: '온셋 세기 곡선의 자기상관은 박자 간격에서 봉우리를 만듦. 하지만 8분음표, 2박 간격에서도 봉우리가 생겨 가장 큰 봉우리만 고르면 2배나 절반 템포가 나옴. 사람이 선호하는 템포 범위(사전 분포)와 배수 간격의 합을 더하면 옥타브 오류가 줄어듦.',
  views: { a: '자기상관 최대값', b: '배수 합 + 템포 사전 분포' },
  controls: '파라미터 표에서 실제 템포와 리듬 패턴을 바꿈. "소리 켜기"를 누르면 드럼 루프와 함께 추정 템포의 메트로놈(높은 삑 소리)이 들림.',
  info: `
    <p><b>템포 추정(Tempo Estimation)</b>은 음악의 BPM을 찾는 일. DJ 소프트웨어의 싱크, 리듬 게임 채보, 음악 추천, 비트에 맞춘 연출의 기초.</p>
    <ol>
      <li><b>온셋 세기(Onset Strength)</b>: 스펙트럼 플럭스로 매 순간 새 음이 시작되는 정도를 구함</li>
      <li><b>자기상관(ACF)</b>: 온셋 세기를 τ만큼 밀어 원래와 곱해 더함. 박자 간격만큼 밀면 북소리끼리 겹쳐서 값이 큼.</li>
      <li><b>봉우리 고르기</b>: 30~240 BPM 범위에서 가장 큰 봉우리의 τ를 BPM으로 바꿈 (60 / τ)</li>
    </ol>
    <p>문제는 <b>옥타브 오류</b>. 하이햇이 8분음표로 치면 반 박 간격의 봉우리가 박자 간격만큼 크고, 짧은 τ일수록 겹치는 구간이 길어 값이 더 큼. 그래서 2배 템포가 나옴.</p>
    <ul>
      <li><b>배수 합(Comb)</b>: τ, 2τ, 3τ, 4τ의 ACF를 더함. 진짜 박자 간격은 배수에서도 봉우리가 있음.</li>
      <li><b>템포 사전 분포</b>: 120 BPM 근처를 선호하는 로그 정규 가중치 (Ellis 2007). 사람이 발로 박자를 맞추는 템포 분포를 반영.</li>
    </ul>
    <p>그래도 반 박, 2박 중 어느 쪽이 "정답"인지는 사람마다 다를 수 있음. 평가 지표도 2배, 1/2배를 맞힌 것으로 쳐 주는 기준(Accuracy 2)이 따로 있음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('온셋 세기의 자기상관 (가로 = 지연 τ)', 'Autocorrelation of onset strength (x = lag τ)')}</text>
    <line x1="20" y1="130" x2="520" y2="130" class="d-line"/>
    <line x1="120" y1="130" x2="120" y2="40" class="d-a"/><line x1="220" y1="130" x2="220" y2="50" class="d-b"/>
    <line x1="320" y1="130" x2="320" y2="90" class="d-dim"/><line x1="420" y1="130" x2="420" y2="70" class="d-dim"/>
    <text x="120" y="146" text-anchor="middle" class="t-small t-a">${L('반 박', 'half beat')}</text>
    <text x="220" y="146" text-anchor="middle" class="t-small t-b">${L('1박', '1 beat')}</text>
    <text x="320" y="146" text-anchor="middle" class="t-small t-dim">${L('1.5박', '1.5 beats')}</text>
    <text x="420" y="146" text-anchor="middle" class="t-small t-dim">${L('2박', '2 beats')}</text>
    <text x="120" y="34" text-anchor="middle" class="t-small t-a">${L('A: 가장 큼 → 2배 템포', 'A: largest, so 2x tempo')}</text>
    <path d="M20,120 Q120,40 220,55 Q320,70 520,125" class="d-accent" stroke-dasharray="5 4"/>
    <text x="340" y="56" class="t-small">${L('120 BPM 근처를 선호하는 가중치', 'weight that prefers about 120 BPM')}</text>
    <text x="270" y="164" text-anchor="middle" class="t-small t-b">${L('B: 가중치와 2τ, 3τ, 4τ의 합까지 보면 1박이 이김', 'B: with the weight and the sum at 2τ, 3τ, 4τ, 1 beat wins')}</text>
  </svg>`,
  look: [
    '기본 상태(100 BPM, 8비트)에서 A는 약 200 BPM(2배)을 고름. B는 100 BPM을 고름.',
    '"소리 켜기" 후 A를 들으면 메트로놈이 북소리보다 2배 빠르게 울림',
    '템포를 160으로 올리면 A는 절반인 약 80을 고름. A의 오류 방향은 템포마다 들쭉날쭉.',
    '템포를 80으로 낮추면 B도 160(2배)을 고름. 사전 분포가 120 근처를 선호해서 느린 곡을 2배로 끌어올림.',
    '패턴을 "16비트"로, 템포를 70으로 두면 두 방식 모두 약 140(2배)을 고름. 느린 16비트는 사람도 2배로 느끼기 쉬움.',
  ],
  refs: [
    { type: 'paper', title: 'D. P. W. Ellis, "Beat Tracking by Dynamic Programming", Journal of New Music Research 36(1)', year: 2007, note: '온셋 세기 자기상관과 로그 정규 템포 가중치' },
    { type: 'paper', title: 'E. D. Scheirer, "Tempo and beat analysis of acoustic musical signals", JASA 103(1)', year: 1998, note: '콤 필터 공명기로 템포 찾기' },
    { type: 'paper', title: 'F. Gouyon, A. Klapuri, S. Dixon, M. Alonso, G. Tzanetakis, C. Uhle, P. Cano, "An experimental comparison of audio tempo induction algorithms", IEEE Trans. ASLP 14(5)', year: 2006, note: '템포 알고리즘 비교와 Accuracy 1, 2 지표' },
    { type: 'book', title: 'Meinard Müller, Fundamentals of Music Processing, 2nd ed.', year: 2021, note: '6장 템포그램과 비트 추적' },
  ],
  params: [
    { key: 'method', label: '고르는 방식', type: 'select', options: [{ value: 'acf', label: '자기상관 최대값' }, { value: 'prior', label: '자기상관 + 사전 분포' }, { value: 'comb', label: '배수 합 + 사전 분포' }], a: 'acf', b: 'comb', group: '추정' },
    { key: 'bpm', label: '실제 템포 (BPM)', type: 'int', min: 60, max: 180, default: 100, shared: true, group: '드럼 루프' },
    { key: 'pattern', label: '리듬 패턴', type: 'select', options: [{ value: 'rock', label: '8비트' }, { value: 'sixteen', label: '16비트' }, { value: 'half', label: '하프타임' }], default: 'rock', shared: true },
    { key: 'metro', label: '메트로놈 크기', type: 'range', min: 0, max: 1, step: 0.05, default: 0.5, shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Tempo Estimation (Onset Autocorrelation)',
    summary: 'The autocorrelation of an onset strength curve has peaks at the beat interval. But peaks also appear at eighth notes and at 2 beats, so picking only the largest peak often gives double or half tempo. Adding a preferred tempo range (a prior) and the sum over multiples of the lag reduces these octave errors.',
    views: { a: 'Autocorrelation maximum', b: 'Comb sum + tempo prior' },
    controls: 'Change the real tempo and rhythm pattern in the parameter table. Press "Sound on" to hear the drum loop with a metronome (high beep) at the estimated tempo.',
    info: `
    <p><b>Tempo estimation</b> finds the BPM of music. It is the basis of DJ sync, rhythm game charting, music recommendation and beat-synced effects.</p>
    <ol>
      <li><b>Onset strength</b>: spectral flux measures how much new sound starts at each moment.</li>
      <li><b>Autocorrelation (ACF)</b>: shift the onset strength by τ, multiply with the original and sum. When shifted by the beat interval, drum hits line up and the value is large.</li>
      <li><b>Peak picking</b>: take the lag τ of the largest peak in the 30 to 240 BPM range and convert to BPM (60 / τ).</li>
    </ol>
    <p>The problem is <b>octave errors</b>. If the hi-hat plays eighth notes, the half-beat peak is as large as the beat peak. Shorter lags also overlap over a longer span, so their value is larger. The result is double tempo.</p>
    <ul>
      <li><b>Comb sum</b>: add the ACF at τ, 2τ, 3τ and 4τ. The real beat interval also has peaks at its multiples.</li>
      <li><b>Tempo prior</b>: a log-normal weight that prefers about 120 BPM (Ellis 2007). It reflects the tempos people tap their feet to.</li>
    </ul>
    <p>Even so, people may disagree whether the half beat or the double beat is "right". Evaluation also has a metric (Accuracy 2) that counts 2x and 1/2x as correct.</p>`,
    look: [
      'In the default state (100 BPM, 8-beat), A picks about 200 BPM (double). B picks 100 BPM.',
      'Press "Sound on" and listen to A. The metronome ticks twice as fast as the drums.',
      'Raise the tempo to 160. A picks about 80, half the tempo. The direction of the error in A changes from tempo to tempo.',
      'Lower the tempo to 80. B also picks 160 (double). The prior prefers about 120, so it pulls slow songs up to double.',
      'Set the pattern to "16-beat" and the tempo to 70. Both methods pick about 140 (double). People also often feel slow 16-beat at double tempo.',
    ],
    refs: ['Onset strength autocorrelation and a log-normal tempo weight.', 'Finding tempo with comb filter resonators.', 'Comparison of tempo algorithms and the Accuracy 1 and 2 metrics.', 'Chapter 6: tempograms and beat tracking.'],
    params: {
      method: { label: 'Picking method', group: 'Estimation', options: { acf: 'Autocorrelation maximum', prior: 'Autocorrelation + prior', comb: 'Comb sum + prior' } },
      bpm: { label: 'Real tempo (BPM)', group: 'Drum loop' },
      pattern: { label: 'Rhythm pattern', options: { rock: '8-beat', sixteen: '16-beat', half: 'Half-time' } },
      metro: { label: 'Metronome level', group: 'Sound' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 11025, N = 512, HOP = 128, FPS = SR / HOP, TAU = Math.PI * 2;
    const BMIN = 30, BMAX = 240;
    // 16분음표 칸 16개 (1마디). k = 킥, s = 스네어, h = 하이햇, H = 강한 하이햇
    const PAT = {
      rock: { k: [0, 8, 10], s: [4, 12], h: [0, 2, 4, 6, 8, 10, 12, 14] },
      sixteen: { k: [0, 6, 8], s: [4, 12], h: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
      half: { k: [0, 10], s: [8], h: [0, 2, 4, 6, 8, 10, 12, 14] },
    };

    let sKey = '', sig = null, LEN = 0, ons = null, nF = 0, aKey = '', acf = null, score = null, est = 0, phase = 0, metro = null;
    function synth() {
      const k = P.bpm + P.pattern;
      if (k === sKey) return false;
      sKey = k;
      const beat = 60 / P.bpm, bars = 4, step = beat / 4;
      LEN = Math.round(bars * 4 * beat * SR);
      sig = new Float32Array(LEN);
      const rng = U.rng(9), pat = PAT[P.pattern];
      const hit = (t0, kind, amp) => {
        const i0 = Math.round(t0 * SR);
        let ph = 0, lp = 0;
        for (let i = 0; i < SR * 0.3; i++) {
          const t = i / SR, j = (i0 + i) % LEN;
          if (kind === 'k') { ph += TAU * (45 + 100 * Math.exp(-t * 35)) / SR; sig[j] += amp * Math.sin(ph) * Math.exp(-t * 10); }
          else if (kind === 's') { const nz = rng.range(-1, 1); sig[j] += amp * (nz * 0.6 * Math.exp(-t * 18) + 0.4 * Math.sin(TAU * 185 * t) * Math.exp(-t * 22)); }
          else { if (i > SR * 0.06) break; const nz = rng.range(-1, 1); lp += 0.5 * (nz - lp); sig[j] += amp * (nz - lp) * Math.exp(-t * 70); }
        }
      };
      for (let b = 0; b < bars; b++) for (let s = 0; s < 16; s++) {
        const t = (b * 16 + s) * step + rng.range(-0.004, 0.004);
        if (pat.k.includes(s)) hit(t, 'k', 0.55);
        if (pat.s.includes(s)) hit(t, 's', 0.4);
        if (pat.h.includes(s)) hit(t, 'h', s % 4 === 0 ? 0.22 : 0.14);
      }
      A.normalize(sig, 0.5);
      // 온셋 세기: 로그 압축 스펙트럼 플럭스, 평균을 빼고 반파 정류 (루프를 두 번 이어 붙여 경계 문제 없앰)
      nF = Math.floor(LEN / HOP);
      const re = new Float64Array(N), im = new Float64Array(N), w = new Float64Array(N);
      for (let i = 0; i < N; i++) w[i] = 0.5 - 0.5 * Math.cos(TAU * i / N);
      let prev = new Float32Array(N / 2), cur = new Float32Array(N / 2);
      ons = new Float32Array(nF);
      for (let f = -1; f < nF; f++) {
        re.fill(0); im.fill(0);
        for (let i = 0; i < N; i++) re[i] = sig[(((f * HOP + i - N / 2) % LEN) + LEN) % LEN] * w[i];
        A.fft(re, im);
        let s = 0;
        for (let b = 1; b < N / 2; b++) { cur[b] = Math.log(1 + 100 * Math.hypot(re[b], im[b])); const d = cur[b] - prev[b]; if (f >= 0 && d > 0) s += d; }
        if (f >= 0) ons[f] = s;
        const t = prev; prev = cur; cur = t;
      }
      let m = 0; for (let f = 0; f < nF; f++) m += ons[f]; m /= nF;
      let mx = 1e-9; for (let f = 0; f < nF; f++) { ons[f] = Math.max(0, ons[f] - m); mx = Math.max(mx, ons[f]); }
      for (let f = 0; f < nF; f++) ons[f] /= mx;
      return true;
    }

    const prior = (bpm) => Math.exp(-0.5 * Math.pow(Math.log2(bpm / 120) / 1.0, 2));
    function analyze() {
      const changed = synth();
      const k = sKey + P.method;
      if (!changed && k === aKey) return;
      aKey = k;
      // 선형 자기상관. 짧은 τ일수록 겹치는 구간이 길어 값이 커짐
      const maxLag = Math.min(nF - 1, Math.ceil(FPS * 60 / BMIN) * 4 + 2);
      acf = new Float32Array(maxLag + 1);
      for (let L = 0; L <= maxLag; L++) { let s = 0; for (let f = 0; f + L < nF; f++) s += ons[f] * ons[f + L]; acf[L] = s; }
      const a0 = acf[0] || 1;
      for (let L = 0; L <= maxLag; L++) acf[L] /= a0;
      const at = (lag) => { const i = Math.floor(lag), t = lag - i; return i + 1 <= maxLag ? acf[i] * (1 - t) + acf[i + 1] * t : 0; };
      // BPM 격자에서 점수 계산 (0.5 BPM 간격)
      score = [];
      let best = -1, bestBpm = 120;
      for (let bpm = BMIN; bpm <= BMAX; bpm += 0.5) {
        const lag = FPS * 60 / bpm;
        let v;
        if (P.method === 'comb') { v = 0; for (let m = 1; m <= 4; m++) v += at(lag * m) / m; v *= prior(bpm); }
        else if (P.method === 'prior') v = at(lag) * prior(bpm);
        else v = at(lag);
        score.push([bpm, v]);
      }
      // 극대점 중 최대
      for (let i = 1; i < score.length - 1; i++) if (score[i][1] >= score[i - 1][1] && score[i][1] >= score[i + 1][1] && score[i][1] > best) { best = score[i][1]; bestBpm = score[i][0]; }
      est = bestBpm;
      // 박자 위상: 추정 간격의 격자에 온셋 세기가 가장 많이 걸리는 시작점
      const per = FPS * 60 / est;
      let bp = -1; phase = 0;
      for (let ph = 0; ph < per; ph += 0.5) { let s = 0; for (let x = ph; x < nF; x += per) s += ons[Math.round(x) % nF]; if (s > bp) { bp = s; phase = ph; } }
      // 메트로놈 트랙
      metro = new Float32Array(LEN);
      for (let x = phase; x < nF; x += per) { const i0 = Math.round(x * HOP); for (let i = 0; i < 500 && i0 + i < LEN; i++) metro[i0 + i] += Math.sin(TAU * 1760 * i / SR) * Math.exp(-i / 120); }
    }
    analyze();

    const live = { pos: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr, s = sig, m = metro, len = s.length;
        for (let i = 0; i < n; i++) {
          if (live.pos >= len) live.pos %= len;
          const i0 = Math.floor(live.pos), v = s[i0] * 0.8 + m[i0] * 0.35 * P.metro;
          l[i] = v; r[i] = v;
          live.pos += step;
        }
      },
    });

    const ratioName = (r) => {
      const c = [[1, Lg('정확', 'Correct')], [2, Lg('2배 (옥타브 오류)', '2x (octave error)')], [0.5, Lg('1/2배 (옥타브 오류)', '1/2x (octave error)')], [4, Lg('4배', '4x')], [0.25, Lg('1/4배', '1/4x')], [1.5, Lg('3/2배', '3/2x')], [2 / 3, Lg('2/3배', '2/3x')], [3, Lg('3배', '3x')], [1 / 3, Lg('1/3배', '1/3x')]];
      for (const [v, s] of c) if (Math.abs(r / v - 1) < 0.04) return s;
      return Lg('틀림', 'Wrong');
    };

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        // 위: 온셋 세기 (앞 2마디) + 추정 박자 격자 + 실제 박자
        const th = Math.max(60, H * 0.38), show = Math.min(nF, Math.round(nF / 2));
        D.rect(g, pad, pad, tw, th, 'rgba(0,0,0,0.35)');
        const fx = (f) => pad + f / show * tw;
        const per = FPS * 60 / est, beat = FPS * 60 / P.bpm;
        for (let x = phase; x < show; x += per) D.line(g, fx(x), pad, fx(x), pad + th, col, 1.5);
        for (let x = 0; x < show; x += beat) D.line(g, fx(x), pad + th - 8, fx(x), pad + th, '#fff', 2);
        g.beginPath(); for (let f = 0; f < show; f++) { const px = fx(f), py = pad + th - ons[f] * (th - 16); f ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = 'rgba(216,221,230,0.85)'; g.lineWidth = 1; g.stroke();
        D.text(g, Lg('온셋 세기 (2마디). 색 선 = 추정 박자, 흰 눈금 = 실제 박자', 'Onset strength (2 bars). Colored lines = estimated beats, white ticks = real beats'), pad + 4, pad + 3, { size: 10, color: C.dim });
        if (snd.on) { const px = fx((live.pos / HOP) % nF); if (px <= pad + tw) D.line(g, px, pad, px, pad + th, C.warn, 1); }
        // 아래: BPM 축 점수
        const by = pad * 2 + th, bh = H - by - pad - 12;
        D.rect(g, pad, by, tw, bh, 'rgba(0,0,0,0.35)');
        const bx = (b) => pad + Math.log(b / BMIN) / Math.log(BMAX / BMIN) * tw;
        for (const b of [30, 40, 60, 80, 120, 160, 240]) { D.line(g, bx(b), by, bx(b), by + bh, C.grid); D.text(g, String(b), bx(b), by + bh + 1, { size: 9, color: C.dim, align: b === 30 ? 'left' : b === 240 ? 'right' : 'center' }); }
        let smax = 1e-9; for (const [, v] of score) smax = Math.max(smax, v);
        if (P.method !== 'acf') {
          g.beginPath(); score.forEach(([b], i) => { const px = bx(b), py = by + bh - prior(b) * (bh - 16); i ? g.lineTo(px, py) : g.moveTo(px, py); });
          g.strokeStyle = C.accent; g.setLineDash([5, 4]); g.lineWidth = 1; g.stroke(); g.setLineDash([]);
        }
        g.beginPath(); score.forEach(([b, v], i) => { const px = bx(b), py = by + bh - Math.max(0, v) / smax * (bh - 16); i ? g.lineTo(px, py) : g.moveTo(px, py); });
        g.strokeStyle = col; g.lineWidth = 1.8; g.stroke();
        D.line(g, bx(P.bpm), by + bh - 10, bx(P.bpm), by + bh, '#fff', 3);
        D.circle(g, bx(est), by + 16, 4, col);
        D.text(g, Lg('BPM별 점수 (로그 축). 흰 눈금 = 실제, 원 = 고른 템포', 'Score per BPM (log axis). White tick = real, circle = chosen tempo'), pad + 4, by + 3, { size: 10, color: C.dim });
        if (P.method !== 'acf') D.text(g, Lg('점선 = 템포 사전 분포', 'Dashed = tempo prior'), pad + 4, by + 16, { size: 10, color: C.accent });
        ctx.stat(Lg('추정 템포', 'Estimated tempo'), est.toFixed(1) + ' BPM');
        ctx.stat(Lg('실제 템포', 'Real tempo'), P.bpm + ' BPM');
        ctx.stat(Lg('결과', 'Result'), ratioName(est / P.bpm));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
