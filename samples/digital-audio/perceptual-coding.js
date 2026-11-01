// 지각 부호화의 원리: MDCT 대역마다 비트를 똑같이 나누는 것과 마스킹 임계값에 맞춰 나누는 것을 비교 (MP3, AAC의 핵심 아이디어를 단순화)
GTL.register({
  id: 'perceptual-coding',
  title: '지각 부호화: MDCT와 비트 배분',
  summary: '같은 비트 예산으로 MDCT 계수를 양자화할 때, 모든 대역에 비트를 똑같이 나누는 방식과 마스킹 임계값을 넘는 대역에 먼저 주는 방식을 비교. 지각 배분은 들리는 잡음을 크게 줄임.',
  views: { a: '균등 배분', b: '지각 배분 (마스킹 모델)' },
  controls: '파라미터 표에서 비트레이트와 배분 방식을 바꿈',
  info: `
    <p>MP3, AAC, Opus 같은 손실 코덱은 "들리지 않는 잡음은 얼마든지 허용"하는 방식으로 데이터를 줄임. 이 샘플은 그 뼈대를 단순화해 실시간으로 돌림.</p>
    <ol>
      <li><b>MDCT</b>: 1024 샘플 창(사인 창)을 512 샘플씩 겹쳐 512개 주파수 계수로 바꿈. 50% 겹침인데도 계수 수가 샘플 수와 같고, 겹친 부분의 에일리어싱이 서로 지워져 완전 복원됨(TDAC).</li>
      <li><b>대역</b>: 계수를 귀의 임계 대역(Bark)과 비슷한 25개 대역으로 묶음. 대역마다 최대값을 스케일 팩터로 씀.</li>
      <li><b>마스킹 모델</b>: 큰 대역 에너지는 주변 대역의 작은 소리를 가림. 대역 에너지를 아래로 약 25 dB/대역, 위로 약 10 dB/대역씩 퍼뜨리고 16dB 낮춘 값과 절대 가청 한계(ATH) 중 큰 값을 임계값으로 씀.</li>
      <li><b>비트 배분</b>: 잡음 대 마스크 비(NMR)가 가장 큰 대역에 비트를 하나씩 줌. 모든 대역의 잡음이 임계값 아래가 되면 멈춤.</li>
    </ol>
    <p>단순화: 엔트로피 부호화(허프만), 부가 정보 비트, 창 길이 전환(프리 에코 대책), 스테레오 처리는 생략. 실제 코덱보다 거침.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="160" x2="520" y2="160" class="d-dim"/>
    <text x="420" y="182" text-anchor="middle" class="t-small t-dim">${L('주파수 (대역)', 'frequency (bands)')}</text>
    <line x1="160" y1="160" x2="160" y2="30" class="d-line"/>
    <text x="160" y="22" text-anchor="middle" class="t-small">${L('큰 소리 (마스커)', 'loud tone (masker)')}</text>
    <path d="M40,150 L110,120 L160,70 L230,95 L330,125 L440,140 L515,145" class="d-accent"/>
    <text x="340" y="112" class="t-small t-dim">${L('마스킹 임계값', 'masking threshold')}</text>
    <line x1="250" y1="160" x2="250" y2="118" class="d-dim" stroke-width="3"/>
    <text x="250" y="76" text-anchor="middle" class="t-small t-dim">${L('가려짐: 비트 0', 'masked: 0 bits')}</text>
    <line x1="250" y1="82" x2="250" y2="112" class="d-dim" stroke-dasharray="2 2"/>
    <rect x="140" y="140" width="40" height="20" class="f-b" opacity="0.5"/>
    <text x="30" y="182" class="t-small t-b">${L('잡음을 임계값 아래로', 'noise kept below threshold')}</text>
    <rect x="420" y="125" width="40" height="35" class="f-a" opacity="0.5"/>
    <text x="440" y="118" text-anchor="middle" class="t-small t-a">${L('균등 배분: 들리는 잡음', 'uniform: audible noise')}</text>
  </svg>`,
  look: [
    'A의 그래프에서 주황 잡음 막대가 여러 대역에서 보라색 임계값 위로 솟음. B는 대부분 임계값 아래.',
    '"소리 켜기"로 번갈아 들으면 A는 지글거리는 잡음과 금속성 소리가 섞임. B는 고음이 조금 흐리지만 깨끗함.',
    '비트레이트를 3 비트/샘플로 올리면 A도 깨끗해짐. B는 그보다 훨씬 낮은 비트에서 같은 품질을 냄.',
    '"임계값을 넘는 대역" 측정값을 비교하면 같은 비트에서 B가 훨씬 적음',
  ],
  refs: [
    { type: 'paper', title: 'J. P. Princen, A. W. Johnson, A. B. Bradley, "Subband/Transform Coding Using Filter Bank Designs Based on Time Domain Aliasing Cancellation", ICASSP', year: 1987, note: 'MDCT와 TDAC' },
    { type: 'paper', title: 'J. D. Johnston, "Transform Coding of Audio Signals Using Perceptual Noise Criteria", IEEE Journal on Selected Areas in Communications 6(2)', year: 1988, note: '지각 엔트로피와 마스킹 기반 부호화' },
    { type: 'paper', title: 'K. Brandenburg, G. Stoll, "ISO/MPEG-1 Audio: A Generic Standard for Coding of High-Quality Digital Audio", Journal of the Audio Engineering Society 42(10)', year: 1994, note: 'MPEG-1 오디오(MP3 포함)의 구조' },
    { type: 'book', title: 'Marina Bosi, Richard E. Goldberg, Introduction to Digital Audio Coding and Standards', year: 2003, note: '비트 배분과 심리음향 모델' },
    { type: 'paper', title: 'E. Terhardt, "Calculating Virtual Pitch", Hearing Research 1', year: 1979, note: '절대 가청 한계 근사식' },
  ],
  params: [
    { key: 'alloc', label: '비트 배분', type: 'select', options: [{ value: 'uniform', label: '균등 배분' }, { value: 'percept', label: '지각 배분 (마스킹)' }], a: 'uniform', b: 'percept', default: 'uniform', group: '부호기' },
    { key: 'rate', label: '비트레이트 (비트/샘플)', type: 'range', min: 0.5, max: 4, step: 0.25, default: 1.25, shared: true, help: '1 비트/샘플 = 48 kbps (모노 48 kHz). 부가 정보 제외.' },
    { key: 'showMask', label: '임계값 표시', type: 'bool', default: true, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Perceptual Coding: MDCT and Bit Allocation',
    summary: 'With the same bit budget, MDCT coefficients are quantized in two ways: bits split evenly across all bands, or given first to bands whose noise would rise above the masking threshold. Perceptual allocation greatly reduces audible noise.',
    views: { a: 'Uniform allocation', b: 'Perceptual allocation (masking model)' },
    controls: 'Change the bitrate and allocation method in the parameter table.',
    info: `
    <p>Lossy codecs such as MP3, AAC and Opus reduce data by allowing any amount of noise you cannot hear. This sample runs a simplified skeleton of that idea in real time.</p>
    <ol>
      <li><b>MDCT</b>: 1024 sample windows (sine window) overlap by 512 samples and become 512 frequency coefficients. Despite the 50% overlap, there are as many coefficients as samples, and the aliasing in the overlap cancels out for perfect rebuild (TDAC).</li>
      <li><b>Bands</b>: coefficients are grouped into 25 bands close to the ear's critical bands (Bark). Each band uses its largest value as a scale factor.</li>
      <li><b>Masking model</b>: a loud band hides quieter sounds in nearby bands. Band energy is spread by about 25 dB per band downward and 10 dB per band upward and lowered by 16 dB. The threshold is the larger of this and the absolute threshold of hearing (ATH).</li>
      <li><b>Bit allocation</b>: give one bit at a time to the band with the highest noise-to-mask ratio (NMR). Stop when the noise in every band is below its threshold.</li>
    </ol>
    <p>Simplified: no entropy coding (Huffman), no side-info bits, no window switching (pre-echo control), no stereo tools. It is rougher than a real codec.</p>`,
    look: [
      'In A\'s graph the orange noise bars rise above the purple threshold in many bands. In B most stay below it.',
      'Press "Sound on" and switch between views. A has fizzy noise and a metallic tone. B has slightly dull highs but sounds clean.',
      'Raise the bitrate to 3 bits per sample. A becomes clean too. B reaches the same quality at a much lower rate.',
      'Compare the "Bands above threshold" stat. At the same rate B has far fewer.',
    ],
    refs: ['MDCT and TDAC.', 'Perceptual entropy and masking-based coding.', 'Structure of MPEG-1 Audio (including MP3).', 'Bit allocation and psychoacoustic models.', 'Approximation of the absolute threshold of hearing.'],
    params: {
      alloc: { label: 'Bit allocation', group: 'Encoder', options: { uniform: 'Uniform', percept: 'Perceptual (masking)' } },
      rate: { label: 'Bitrate (bits per sample)', help: '1 bit per sample = 48 kbps (mono 48 kHz). Side info not counted.' },
      showMask: 'Show threshold',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 512, M = 2 * N, TAU = Math.PI * 2, N0 = 0.5 + N / 2;
    const EREF = N * N / 8; // 최대 크기 사인파 계수 에너지 기준 (대략 0 dBFS)
    const EDGES_HZ = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 24000];

    // ── 음악 생성기 (120 BPM, 2마디 반복): 베이스, 화음, 멜로디, 하이햇 ──
    function music(seed) {
      const rng = U.rng(seed), st = { n: 0, bph: 0, mph: 0, cph: [0, 0, 0], lp: A.biquad('lowpass', 600, 0.8, 0, SR), hp: A.biquad('highpass', 7000, 0.7, 0, SR) };
      const bass = [33, 33, 40, 38, 36, 36, 43, 41], mel = [69, 72, 76, 74, 72, 76, 79, 77, 76, 72, 74, 71, 72, 69, 67, 69];
      const chords = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]];
      st.next = (sr) => {
        const t = st.n / sr; st.n++;
        const beat = t * 2, bi = Math.floor(beat), e8 = Math.floor(beat * 2), te8 = (beat * 2 - e8) / 4;
        // 베이스 (톱니파, 로우패스)
        const bf = A.mtof(bass[bi % 8]), bdt = bf / sr; st.bph += bdt; if (st.bph >= 1) st.bph -= 1;
        let v = st.lp.process(2 * st.bph - 1 - A.polyBlep(st.bph, bdt)) * 0.22;
        // 화음 (2마디에 4개, 배음 3개짜리 오르간)
        const ch = chords[Math.floor(t / 2) % 4];
        for (let i = 0; i < 3; i++) { st.cph[i] += A.mtof(ch[i]) / sr; if (st.cph[i] >= 1) st.cph[i] -= 1; const p = TAU * st.cph[i]; v += (Math.sin(p) + 0.4 * Math.sin(2 * p) + 0.2 * Math.sin(3 * p)) * 0.045; }
        // 멜로디 (8분음표, 밝은 플럭)
        const mf = A.mtof(mel[e8 % 16]); st.mph += mf / sr; if (st.mph >= 1) st.mph -= 1;
        const env = Math.exp(-te8 * 10) * Math.min(1, te8 * 300), p = TAU * st.mph;
        v += (Math.sin(p) + 0.5 * Math.sin(2 * p) + 0.3 * Math.sin(3 * p) + 0.2 * Math.sin(5 * p)) * 0.11 * env;
        // 하이햇 (8분음표 노이즈)
        v += st.hp.process(rng.range(-1, 1)) * Math.exp(-te8 * 40) * 0.25;
        return v;
      };
      return st;
    }

    // ── MDCT 코덱 ──
    const win = new Float64Array(M); for (let n = 0; n < M; n++) win[n] = Math.sin(Math.PI * (n + 0.5) / M);
    const preC = new Float64Array(M), preS = new Float64Array(M), postC = new Float64Array(N), postS = new Float64Array(N);
    const iC = new Float64Array(N), iS = new Float64Array(N), oC = new Float64Array(M), oS = new Float64Array(M);
    for (let n = 0; n < M; n++) { preC[n] = Math.cos(-Math.PI * n / M); preS[n] = Math.sin(-Math.PI * n / M); oC[n] = Math.cos(Math.PI * (n + N0) / M); oS[n] = Math.sin(Math.PI * (n + N0) / M); }
    for (let k = 0; k < N; k++) { const a = -Math.PI * N0 * (k + 0.5) / N; postC[k] = Math.cos(a); postS[k] = Math.sin(a); const b = Math.PI * N0 * k / N; iC[k] = Math.cos(b); iS[k] = Math.sin(b); }
    const re = new Float64Array(M), im = new Float64Array(M);
    function mdct(z, X) {
      for (let n = 0; n < M; n++) { const v = z[n] * win[n]; re[n] = v * preC[n]; im[n] = v * preS[n]; }
      A.fft(re, im);
      for (let k = 0; k < N; k++) X[k] = re[k] * postC[k] - im[k] * postS[k];
    }
    function imdct(X, y) {
      for (let k = 0; k < M; k++) { if (k < N) { re[k] = X[k] * iC[k]; im[k] = X[k] * iS[k]; } else { re[k] = 0; im[k] = 0; } }
      A.fft(re, im, true);
      for (let n = 0; n < M; n++) y[n] = (re[n] * oC[n] - im[n] * oS[n]) * M * win[n] * (2 / N);
    }

    // 대역 (계수 번호)
    const binHz = SR / 2 / N, bands = [];
    for (let b = 0; b < EDGES_HZ.length - 1; b++) {
      const lo = Math.round(EDGES_HZ[b] / binHz), hi = Math.max(lo + 1, Math.round(EDGES_HZ[b + 1] / binHz));
      const fc = (EDGES_HZ[b] + EDGES_HZ[b + 1]) / 2, fk = Math.max(0.03, fc / 1000);
      const ath = 3.64 * Math.pow(fk, -0.8) - 6.5 * Math.exp(-0.6 * (fk - 3.3) ** 2) + 1e-3 * fk ** 4 - 90; // 0 dBFS 사인 = 90 dB SPL로 가정
      bands.push({ lo, hi: Math.min(N, hi), w: Math.min(N, hi) - lo, ath });
    }
    const NB = bands.length;

    // 한 프레임 부호화+복호화. info에 분석 결과를 담음
    function codeFrame(X, Y, info) {
      const budget = Math.round(P.rate * N), lvl = new Float64Array(NB), sc = new Float64Array(NB), thr = new Float64Array(NB), bits = new Int32Array(NB);
      for (let b = 0; b < NB; b++) {
        const B = bands[b]; let e = 0, mx = 0;
        for (let k = B.lo; k < B.hi; k++) { e += X[k] * X[k]; mx = Math.max(mx, Math.abs(X[k])); }
        lvl[b] = 10 * Math.log10(e / B.w / EREF + 1e-30); sc[b] = mx;
      }
      for (let b = 0; b < NB; b++) { // 확산 마스킹 + ATH
        let p = 0;
        for (let j = 0; j < NB; j++) { const d = b - j, s = d >= 0 ? 10 * d : 25 * -d; p += Math.pow(10, (lvl[j] - 16 - s) / 10); }
        thr[b] = Math.max(10 * Math.log10(p + 1e-30), bands[b].ath);
      }
      let used = 0;
      if (P.alloc === 'uniform') {
        const r = Math.floor(budget / N);
        for (let b = 0; b < NB; b++) bits[b] = r;
        used = r * N;
        let left = budget - used; // 남은 비트는 낮은 대역부터 1비트씩
        for (let b = 0; b < NB && left >= bands[b].w; b++) { bits[b]++; left -= bands[b].w; used += bands[b].w; }
      } else {
        // 실제로 양자화해 본 잡음으로 NMR을 계산 (추정식은 비트가 적을 때 크게 틀림)
        const nOf = (b, r) => { const B = bands[b], s = sc[b], Q = Math.pow(2, r - 1); let pe = 0;
          for (let k = B.lo; k < B.hi; k++) { const q = r > 0 && s > 0 ? Math.round(X[k] / s * Q) / Q * s : 0; pe += (X[k] - q) ** 2; }
          return 10 * Math.log10(pe / B.w / EREF + 1e-30); };
        const cur = new Float64Array(NB);
        for (let b = 0; b < NB; b++) cur[b] = lvl[b] - thr[b];
        for (;;) {
          let best = -1, bv = 0;
          for (let b = 0; b < NB; b++) if (bits[b] < 15 && used + bands[b].w <= budget && sc[b] > 0 && cur[b] > bv) { bv = cur[b]; best = b; }
          if (best < 0) break;
          bits[best]++; used += bands[best].w;
          cur[best] = nOf(best, bits[best]) - thr[best];
        }
      }
      // 양자화 (중앙 0 포함, 한쪽 2^(r-1) 단계)
      let nAbove = 0, nmrSum = 0, nmrCnt = 0;
      const noise = new Float64Array(NB);
      for (let b = 0; b < NB; b++) {
        const B = bands[b], r = bits[b], s = sc[b];
        let pe = 0;
        for (let k = B.lo; k < B.hi; k++) {
          let q = 0;
          if (r > 0 && s > 0) { const Q = Math.pow(2, r - 1); q = Math.round(X[k] / s * Q) / Q * s; }
          Y[k] = q; pe += (X[k] - q) ** 2;
        }
        noise[b] = 10 * Math.log10(pe / B.w / EREF + 1e-30);
        if (lvl[b] > bands[b].ath) { const d = noise[b] - thr[b]; nmrSum += d; nmrCnt++; if (d > 0) nAbove++; }
      }
      if (info) Object.assign(info, { lvl, thr, bits, noise, used, nAbove, nmr: nmrCnt ? nmrSum / nmrCnt : 0, X: Float64Array.from(X), Y: Float64Array.from(Y) });
      return used;
    }

    // 스트리밍 코덱: N 샘플마다 한 프레임
    function streamCodec() {
      const st = { prev: new Float64Array(N), cur: new Float64Array(N), fill: 0, tail: new Float64Array(N), out: new Float64Array(N), oi: 0, z: new Float64Array(M), X: new Float64Array(N), Y: new Float64Array(N), y: new Float64Array(M) };
      st.push = (x) => {
        st.cur[st.fill++] = x;
        const o = st.out[st.oi++];
        if (st.fill === N) {
          st.z.set(st.prev, 0); st.z.set(st.cur, N);
          mdct(st.z, st.X); codeFrame(st.X, st.Y, null); imdct(st.Y, st.y);
          for (let n = 0; n < N; n++) { st.out[n] = st.tail[n] + st.y[n]; st.tail[n] = st.y[N + n]; }
          const t = st.prev; st.prev = st.cur; st.cur = t; st.fill = 0; st.oi = 0;
        }
        return o;
      };
      return st;
    }

    let gen = music(ctx.seed), codec = streamCodec();
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) { const v = codec.push(gen.next(sr)); l[i] = v; r[i] = v; }
      },
    });

    // 분석: 처음 64 프레임을 부호화해 평균 통계, 그중 한 프레임을 그림
    const FR = 64, SHOW = 41;
    let key = '', shown = null, avgAbove = 0, avgNmr = 0, snr = 0, usedAvg = 0;
    function analyze() {
      const k = P.alloc + '|' + P.rate;
      if (k === key) return;
      key = k;
      const g2 = music(ctx.seed), len = (FR + 1) * N, x = new Float64Array(len);
      for (let i = 0; i < len; i++) x[i] = g2.next(SR);
      const X = new Float64Array(N), Y = new Float64Array(N), y = new Float64Array(M), out = new Float64Array(len + M);
      let sa = 0, sn = 0, su = 0;
      for (let f = 0; f < FR; f++) {
        mdct(x.subarray(f * N, f * N + M), X);
        const info = {};
        codeFrame(X, Y, info);
        if (f === SHOW) shown = info;
        sa += info.nAbove; sn += info.nmr; su += info.used;
        imdct(Y, y);
        for (let n = 0; n < M; n++) out[f * N + n] += y[n];
      }
      avgAbove = sa / FR; avgNmr = sn / FR; usedAvg = su / FR;
      let ps = 0, pe = 0;
      for (let i = N; i < FR * N; i++) { ps += x[i] * x[i]; pe += (x[i] - out[i]) ** 2; }
      snr = 10 * Math.log10(ps / Math.max(1e-30, pe));
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const gh = Math.max(80, H * 0.62);
        const fmin = 40, fmax = 20000, minDb = -110, maxDb = 0;
        const fx = (f) => A.freqX(f, pad, w, fmin, fmax), dy = (db) => pad + gh - U.clamp((db - minDb) / (maxDb - minDb), 0, 1) * gh;
        D.rect(g, pad, pad, w, gh, 'rgba(0,0,0,0.35)');
        A.drawFreqGrid(g, pad, pad, w, gh, { fmin, fmax, minDb, maxDb, dbStep: 20 });
        // 원래 계수 (dB)
        g.beginPath();
        for (let k = 1; k < N; k++) { const f = (k + 0.5) * binHz; if (f < fmin || f > fmax) continue; const v = 10 * Math.log10(shown.X[k] ** 2 / EREF + 1e-30); const px = fx(f); k > 1 ? g.lineTo(px, dy(v)) : g.moveTo(px, dy(v)); }
        g.strokeStyle = 'rgba(216,221,230,0.45)'; g.lineWidth = 1; g.stroke();
        // 대역별 잡음 막대와 임계값
        for (let b = 0; b < NB; b++) {
          const B = bands[b], f0 = Math.max(fmin, B.lo * binHz), f1 = Math.min(fmax, B.hi * binHz);
          if (f1 <= fmin) continue;
          const x0 = fx(f0), x1 = fx(f1);
          const nz = shown.noise[b], above = nz > shown.thr[b];
          D.rect(g, x0 + 1, dy(nz), Math.max(1, x1 - x0 - 2), pad + gh - dy(nz), above ? 'rgba(255,122,89,0.55)' : 'rgba(79,195,247,0.35)');
          if (P.showMask) D.line(g, x0, dy(shown.thr[b]), x1, dy(shown.thr[b]), C.accent, 2);
        }
        D.text(g, Lx('흐린 선 = 원래 계수, 막대 = 대역 양자화 잡음 (주황 = 임계값 위, 들림), 보라 = 마스킹 임계값', 'Faint = original coefficients, bars = band noise (orange = above threshold, audible), purple = masking threshold'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 대역별 비트
        const by = pad * 2 + gh, bh = H - by - pad;
        D.rect(g, pad, by, w, bh, 'rgba(0,0,0,0.35)');
        let mb = 1; for (let b = 0; b < NB; b++) mb = Math.max(mb, shown.bits[b]);
        for (let b = 0; b < NB; b++) {
          const B = bands[b], f0 = Math.max(fmin, B.lo * binHz), f1 = Math.min(fmax, B.hi * binHz);
          if (f1 <= fmin) continue;
          const x0 = fx(f0), x1 = fx(f1), hh = (shown.bits[b] / Math.max(4, mb)) * (bh - 18);
          D.rect(g, x0 + 1, by + bh - hh, Math.max(1, x1 - x0 - 2), hh, col);
          if (x1 - x0 > 12) D.text(g, String(shown.bits[b]), (x0 + x1) / 2, by + bh - hh - 12, { size: 9, align: 'center', color: C.dim });
        }
        D.text(g, Lx('대역별 계수당 비트', 'Bits per coefficient in each band'), pad + 4, by + 3, { size: 10, color: C.dim });

        ctx.stat(Lx('임계값을 넘는 대역 (평균)', 'Bands above threshold (avg)'), avgAbove.toFixed(1) + ' / ' + NB);
        ctx.stat(Lx('평균 NMR', 'Average NMR'), avgNmr.toFixed(1) + ' dB');
        ctx.stat(Lx('SNR', 'SNR'), snr.toFixed(1) + ' dB');
        ctx.stat(Lx('쓴 비트 (프레임당)', 'Bits used (per frame)'), `${Math.round(usedAvg)} / ${Math.round(P.rate * N)}`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
