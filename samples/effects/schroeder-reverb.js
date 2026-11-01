// 알고리즘 리버브: Schroeder(콤 4 + 올패스 2), Freeverb(LP 콤 8 + 올패스 4), FDN(지연선 8 + 하다마드 행렬). 에코 밀도와 감쇠 곡선 비교
GTL.register({
  id: 'schroeder-reverb',
  title: '알고리즘 리버브 (Schroeder, Freeverb, FDN)',
  summary: '알고리즘 리버브는 지연선과 피드백으로 수천 개의 메아리를 만들어 방의 잔향을 흉내 냄. Schroeder 구조는 메아리가 듬성듬성해 금속성 울림이 남고, FDN은 지연선끼리 섞어서 메아리 밀도가 빠르게 올라가 매끈하게 들림.',
  views: { a: 'Schroeder (1962)', b: 'FDN 8선' },
  controls: '파라미터 표에서 알고리즘, 잔향 시간, 고음 감쇠를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p>실제 방의 잔향은 벽에 부딪힌 반사음이 시간이 갈수록 기하급수적으로 늘어나며 생김. 알고리즘 리버브는 이를 지연선 몇 개로 흉내 냄. 목표는 두 가지: <b>메아리 밀도</b>가 빨리 높아질 것, 감쇠가 <b>RT60</b>(-60dB까지 걸리는 시간)대로 매끈할 것.</p>
    <ul>
      <li><b>Schroeder (1962)</b>: 피드백 콤 필터 4개를 병렬로, 올패스 2개를 직렬로 연결. 콤 이득 g = 10<sup>-3D/RT60</sup>으로 감쇠를 맞춤. 메아리가 콤 길이마다 규칙적으로 반복되어 플러터(떨림), 금속성 울림이 남음.</li>
      <li><b>Freeverb (Jezar, 2000)</b>: 피드백 안에 로우패스가 있는 콤 8개 + 올패스 4개. 고음이 먼저 사라져 자연스러움. 공개 코드라 많이 쓰임.</li>
      <li><b>FDN (Feedback Delay Network)</b>: 지연선 N개의 출력을 직교 행렬(여기서는 하다마드)로 섞어 모든 입력에 되돌림. 메아리가 매 바퀴 N배로 늘어나 밀도가 빠르게 올라감. Jot(1991)가 정리한 구조로 현대 리버브 대부분의 바탕.</li>
    </ul>
    <p>에코 밀도는 Abel과 Huang의 정규화 에코 밀도(NED)로 잼. 20ms 창에서 표준편차보다 큰 샘플의 비율을 가우스 잡음의 값(0.317)으로 나눈 값. 1에 가까우면 잡음처럼 빽빽한 잔향.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="6" y="14" class="t-small t-a">Schroeder</text>
    <rect x="30" y="22" width="60" height="16" class="f-dim"/><rect x="30" y="42" width="60" height="16" class="f-dim"/><rect x="30" y="62" width="60" height="16" class="f-dim"/><rect x="30" y="82" width="60" height="16" class="f-dim"/>
    <text x="60" y="34" text-anchor="middle" class="t-small">${L('콤', 'comb')}</text><text x="60" y="54" text-anchor="middle" class="t-small">${L('콤', 'comb')}</text><text x="60" y="74" text-anchor="middle" class="t-small">${L('콤', 'comb')}</text><text x="60" y="94" text-anchor="middle" class="t-small">${L('콤', 'comb')}</text>
    <line x1="90" y1="60" x2="118" y2="60" class="d-a" marker-end="url(#arr)"/>
    <rect x="120" y="50" width="44" height="20" class="f-dim"/><text x="142" y="64" text-anchor="middle" class="t-small">AP</text>
    <line x1="164" y1="60" x2="178" y2="60" class="d-a" marker-end="url(#arr)"/>
    <rect x="180" y="50" width="44" height="20" class="f-dim"/><text x="202" y="64" text-anchor="middle" class="t-small">AP</text>
    <text x="30" y="118" class="t-small t-dim">${L('각 콤은 자기 출력만 되먹임', 'Each comb feeds back only itself')}</text>
    <text x="290" y="14" class="t-small t-b">FDN</text>
    <rect x="290" y="22" width="70" height="16" class="f-dim"/><rect x="290" y="42" width="70" height="16" class="f-dim"/><rect x="290" y="62" width="70" height="16" class="f-dim"/><rect x="290" y="82" width="70" height="16" class="f-dim"/>
    <text x="325" y="34" text-anchor="middle" class="t-small">z^-m1</text><text x="325" y="54" text-anchor="middle" class="t-small">z^-m2</text><text x="325" y="74" text-anchor="middle" class="t-small">z^-m3</text><text x="325" y="94" text-anchor="middle" class="t-small">z^-m4</text>
    <rect x="400" y="22" width="60" height="76" class="f-dim"/><text x="430" y="58" text-anchor="middle" class="t-small">${L('행렬 A', 'Matrix A')}</text><text x="430" y="72" text-anchor="middle" class="t-small t-dim">${L('(직교)', '(orthogonal)')}</text>
    <line x1="360" y1="60" x2="398" y2="60" class="d-b" marker-end="url(#arr)"/>
    <path d="M460,60 L490,60 L490,140 L270,140 L270,60 L288,60" class="d-b" marker-end="url(#arr)"/>
    <text x="300" y="156" class="t-small t-b">${L('모든 지연선 출력이 모든 입력으로 섞여 돌아감', 'Every line output mixes into every input')}</text>
    <text x="10" y="184" class="t-small">${L('지연선 이득 g = 10^(-3 × 지연 / RT60) → 한 바퀴마다 같은 dB/초로 감쇠', 'Line gain g = 10^(-3 × delay / RT60) → same dB per second on every loop')}</text>
  </svg>`,
  look: [
    '위쪽 임펄스 응답을 비교하면 A는 처음 100ms에 듬성한 메아리 기둥이 보이고 B는 금방 빽빽해짐',
    '에코 밀도(NED) 곡선이 B에서 훨씬 빨리 1 근처로 올라감',
    '스네어 음원으로 소리를 들으면 A는 "찌잉" 하는 금속성 떨림이 남고 B는 부드럽게 퍼짐',
    '잔향 시간을 바꾸면 아래 감쇠 곡선(EDC)의 기울기와 "측정 RT60"이 함께 바뀜',
    '고음 감쇠를 올리면 잔향 꼬리가 어두워짐. 실제 방에서 공기와 벽이 고음을 더 많이 흡수하는 효과.',
  ],
  refs: [
    { type: 'paper', title: 'Manfred R. Schroeder, "Natural Sounding Artificial Reverberation", Journal of the Audio Engineering Society 10(3)', year: 1962, note: '콤 + 올패스 리버브' },
    { type: 'paper', title: 'Jean-Marc Jot, Antoine Chaigne, "Digital Delay Networks for Designing Artificial Reverberators", 90th AES Convention', year: 1991, note: 'FDN 리버브' },
    { type: 'paper', title: 'Jonathan S. Abel, Patty Huang, "A Simple, Robust Measure of Reverberation Echo Density", 121st AES Convention', year: 2006, note: '정규화 에코 밀도(NED)' },
    { type: 'book', title: 'Julius O. Smith III, Physical Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/pasp/', note: 'Schroeder 리버브, Freeverb, FDN 해설' },
    { type: 'paper', title: 'Vesa Välimäki, Julian Parker, Lauri Savioja, Julius O. Smith, Jonathan Abel, "Fifty Years of Artificial Reverberation", IEEE Transactions on Audio, Speech, and Language Processing 20(5)', year: 2012, note: '인공 잔향 기법 총정리' },
  ],
  params: [
    { key: 'algo', label: '알고리즘', type: 'select', options: [{ value: 'schroeder', label: 'Schroeder' }, { value: 'freeverb', label: 'Freeverb' }, { value: 'fdn', label: 'FDN 8선' }], a: 'schroeder', b: 'fdn', group: '리버브' },
    { key: 'rt60', label: '잔향 시간 RT60 (초)', type: 'range', min: 0.3, max: 6, step: 0.1, default: 2, shared: true },
    { key: 'damp', label: '고음 감쇠', type: 'range', min: 0, max: 0.9, step: 0.01, default: 0.3, shared: true, when: (p) => p.algo !== 'schroeder', help: 'Schroeder 원형에는 없음' },
    { key: 'mix', label: '잔향 음량 (wet)', type: 'range', min: 0, max: 1, step: 0.01, default: 0.4, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'snare', label: '스네어' }, { value: 'pluck', label: '플럭' }, { value: 'click', label: '클릭 (임펄스)' }], default: 'snare', shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Algorithmic Reverb (Schroeder, Freeverb, FDN)',
    summary: 'An algorithmic reverb uses delay lines and feedback to make thousands of echoes that imitate a room. The Schroeder design has sparse echoes and a metallic ring. An FDN mixes its delay lines together, so echo density rises fast and the tail sounds smooth.',
    views: { a: 'Schroeder (1962)', b: 'FDN 8 lines' },
    controls: 'Change the algorithm, reverb time and high damping in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>In a real room, reflections off the walls multiply exponentially over time. An algorithmic reverb imitates this with a few delay lines. It has two goals: <b>echo density</b> must rise fast, and the decay must be smooth and follow <b>RT60</b> (the time to fall by 60 dB).</p>
    <ul>
      <li><b>Schroeder (1962)</b>: 4 feedback comb filters in parallel, then 2 allpass filters in series. Comb gain g = 10<sup>-3D/RT60</sup> sets the decay. Echoes repeat regularly at each comb length, which leaves flutter and a metallic ring.</li>
      <li><b>Freeverb (Jezar, 2000)</b>: 8 combs with a lowpass inside the feedback, plus 4 allpasses. Highs die first, which sounds natural. The code is public, so it is widely used.</li>
      <li><b>FDN (feedback delay network)</b>: the outputs of N delay lines are mixed by an orthogonal matrix (here Hadamard) and fed back to every input. Echoes multiply N times per loop, so density rises fast. Jot (1991) described this structure, and most modern reverbs build on it.</li>
    </ul>
    <p>Echo density is measured with the normalized echo density (NED) of Abel and Huang. In a 20 ms window, it is the share of samples larger than the standard deviation, divided by the Gaussian noise value (0.317). Near 1 means a dense, noise-like tail.</p>`,
    look: [
      'Compare the impulse responses at the top. A shows sparse echo spikes in the first 100 ms. B becomes dense quickly.',
      'The echo density (NED) curve rises to about 1 much sooner in B.',
      'Listen with the snare source. A leaves a metallic "zing" flutter. B spreads smoothly.',
      'Change the reverb time. The slope of the decay curve (EDC) and "Measured RT60" change together.',
      'Raise high damping. The tail gets darker, like a real room where air and walls absorb more highs.',
    ],
    refs: ['Comb + allpass reverb.', 'FDN reverb.', 'Normalized echo density (NED).', 'Schroeder reverb, Freeverb and FDN explained.', 'Survey of artificial reverberation.'],
    params: {
      algo: { label: 'Algorithm', group: 'Reverb', options: { fdn: 'FDN 8 lines' } },
      rt60: 'Reverb time RT60 (s)',
      damp: { label: 'High damping', help: 'Not in the original Schroeder design' },
      mix: 'Reverb level (wet)',
      src: { label: 'Source', group: 'Source', options: { snare: 'Snare', pluck: 'Pluck', click: 'Click (impulse)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 24000;

    function makeSource(sr) {
      const noise = A.noiseBuffer(sr, 21), notes = [60, 67, 64, 72];
      let n = 0, ph = 0;
      return () => {
        const per = Math.round(sr * 1.25), i = n % per, t = i / sr, k = Math.floor(n / per) % 4;
        n++;
        if (P.src === 'click') return i === 0 ? 0.9 : 0;
        if (P.src === 'snare') return t < 0.25 ? (noise[i % sr] * 0.7 + Math.sin(TAU * 185 * t) * 0.4) * Math.exp(-t * 25) * 0.7 : 0;
        if (t > 0.6) return 0;
        ph = (ph + A.mtof(notes[k]) / sr) % 1;
        return (0.6 * A.wave.saw(ph) + 0.4 * Math.sin(TAU * ph)) * Math.exp(-t * 8) * 0.4;
      };
    }

    // 지연선 하나 (링 버퍼)
    const line = (len) => ({ buf: new Float32Array(Math.max(1, len)), i: 0, len: Math.max(1, len), lp: 0 });
    const gainFor = (len, sr) => Math.pow(10, -3 * len / sr / P.rt60);

    function makeReverb(sr) {
      const algo = P.algo, s = sr / 44100, o = { l: 0, r: 0, algo };
      if (algo === 'schroeder') {
        const combs = [29.7, 37.1, 41.1, 43.7].map((ms) => line(Math.round(ms * sr / 1000)));
        const aps = [[5.0, 0.7], [1.7, 0.7]].map(([ms, g]) => Object.assign(line(Math.round(ms * sr / 1000)), { g }));
        o.step = (x) => {
          let sum = 0;
          for (const c of combs) { const y = c.buf[c.i]; c.buf[c.i] = x + gainFor(c.len, sr) * y; c.i = (c.i + 1) % c.len; sum += y; }
          let v = sum * 0.25;
          for (const a of aps) { const d = a.buf[a.i], y = -a.g * v + d; a.buf[a.i] = v + a.g * y; a.i = (a.i + 1) % a.len; v = y; }
          o.l = v; o.r = v;
          return o;
        };
      } else if (algo === 'freeverb') {
        const ct = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], at = [556, 441, 341, 225];
        const mk = (sp) => ({ combs: ct.map((d) => line(Math.round((d + sp) * s))), aps: at.map((d) => line(Math.round((d + sp) * s))) });
        const ch = [mk(0), mk(23)];
        const run = (c, x) => {
          let sum = 0;
          for (const cb of c.combs) { const y = cb.buf[cb.i]; cb.lp = y * (1 - P.damp) + cb.lp * P.damp; cb.buf[cb.i] = x + gainFor(cb.len, sr) * cb.lp; cb.i = (cb.i + 1) % cb.len; sum += y; }
          let v = sum * 0.125;
          for (const a of c.aps) { const b = a.buf[a.i], y = -v + b; a.buf[a.i] = v + b * 0.5; a.i = (a.i + 1) % a.len; v = y; }
          return v;
        };
        o.step = (x) => { o.l = run(ch[0], x); o.r = run(ch[1], x); return o; };
      } else {
        const ms = [29.3, 33.7, 38.9, 43.1, 47.9, 53.3, 59.1, 66.7];
        const lines = ms.map((m) => line(Math.round(m * sr / 1000)));
        const sv = new Float64Array(8);
        o.step = (x) => {
          for (let k = 0; k < 8; k++) { const ln = lines[k], y = ln.buf[ln.i]; ln.lp = y * (1 - P.damp) + ln.lp * P.damp; sv[k] = ln.lp; }
          // 하다마드 8x8 (빠른 버터플라이), 1/√8로 정규화
          for (let h = 1; h < 8; h <<= 1) for (let i = 0; i < 8; i += h << 1) for (let j = i; j < i + h; j++) { const a = sv[j], b = sv[j + h]; sv[j] = a + b; sv[j + h] = a - b; }
          let l = 0, r = 0;
          for (let k = 0; k < 8; k++) {
            const ln = lines[k], y = ln.buf[ln.i];
            if (k % 2) r += y; else l += y;
            ln.buf[ln.i] = x + gainFor(ln.len, sr) * sv[k] * 0.35355339;
            ln.i = (ln.i + 1) % ln.len;
          }
          o.l = l * 0.25; o.r = r * 0.25;
          return o;
        };
      }
      return o;
    }

    // 임펄스 응답 분석
    let key = '', ir = null, ned = null, edc = null, rtMeas = 0, norm = { schroeder: 1, freeverb: 1, fdn: 1 }, nedT = 0;
    function analyze() {
      const k = [P.algo, P.rt60, P.damp].join();
      if (k === key) return;
      key = k;
      const T = Math.min(7, P.rt60 * 1.3 + 0.3), n = Math.floor(T * SRV), fx = makeReverb(SRV);
      ir = new Float32Array(n);
      for (let i = 0; i < n; i++) ir[i] = fx.step(i === 0 ? 1 : 0).l;
      // EDC (Schroeder 역적분)
      edc = new Float32Array(n);
      let acc = 0;
      for (let i = n - 1; i >= 0; i--) { acc += ir[i] * ir[i]; edc[i] = acc; }
      const e0 = edc[0] || 1e-20;
      for (let i = 0; i < n; i++) edc[i] = 10 * Math.log10(Math.max(1e-12, edc[i] / e0));
      norm[P.algo] = 0.5 / Math.sqrt(e0);
      // T30: -5dB ~ -35dB 구간 기울기 × 2
      let i5 = -1, i35 = -1;
      for (let i = 0; i < n; i++) { if (i5 < 0 && edc[i] <= -5) i5 = i; if (i35 < 0 && edc[i] <= -35) { i35 = i; break; } }
      rtMeas = i5 >= 0 && i35 > i5 ? 2 * (i35 - i5) / SRV : 0;
      // NED: 20ms 창, 0~300ms
      const win = Math.round(0.02 * SRV), steps = 60;
      ned = new Float32Array(steps);
      nedT = 0;
      for (let s = 0; s < steps; s++) {
        const c = Math.round(s * 0.005 * SRV), a0 = Math.max(0, c - win / 2), a1 = Math.min(n, a0 + win);
        let ss = 0;
        for (let i = a0; i < a1; i++) ss += ir[i] * ir[i];
        const sd = Math.sqrt(ss / Math.max(1, a1 - a0));
        let cnt = 0;
        for (let i = a0; i < a1; i++) if (Math.abs(ir[i]) > sd) cnt++;
        ned[s] = cnt / Math.max(1, a1 - a0) / 0.3173;
        if (!nedT && s > 1 && ned[s] > 0.9) nedT = s * 5;
      }
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr || live.fx.algo !== P.algo) live = { sr, src: live && live.sr === sr ? live.src : makeSource(sr), fx: makeReverb(sr) };
        const g = norm[P.algo] * P.mix * 0.5;
        for (let i = 0; i < n; i++) { const x = live.src(), o = live.fx.step(x); l[i] = x * (1 - P.mix * 0.5) + o.l * g * 4; r[i] = x * (1 - P.mix * 0.5) + o.r * g * 4; }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const h1 = (H - pad * 4) * 0.36, h2 = (H - pad * 4) * 0.28, h3 = H - pad * 4 - h1 - h2;
        // IR 처음 200ms
        let pk = 1e-9;
        for (let i = 0; i < 0.2 * SRV; i++) pk = Math.max(pk, Math.abs(ir[i]));
        A.drawWave(g, ir, pad, pad, w, h1, { count: Math.round(0.2 * SRV), color: col, amp: 0.95 / pk, label: GTL.L('임펄스 응답, 처음 200ms', 'Impulse response, first 200 ms') });
        // NED
        const y2 = pad * 2 + h1;
        D.rect(g, pad, y2, w, h2, 'rgba(0,0,0,0.35)');
        const oneY = y2 + h2 - (1 / 1.3) * h2;
        g.setLineDash([3, 3]); D.line(g, pad, oneY, pad + w, oneY, 'rgba(255,255,255,0.3)', 1); g.setLineDash([]);
        g.beginPath();
        for (let s = 0; s < ned.length; s++) { const px = pad + w * s / (ned.length - 1), py = y2 + h2 - U.clamp(ned[s] / 1.3, 0, 1) * h2; s ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, GTL.L('에코 밀도 NED, 0~300ms (점선 = 1, 가우스 잡음 수준)', 'Echo density NED, 0 to 300 ms (dashed = 1, Gaussian noise level)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // EDC
        const y3 = pad * 3 + h1 + h2, T = ir.length / SRV;
        D.rect(g, pad, y3, w, h3, 'rgba(0,0,0,0.35)');
        for (let db = -20; db >= -60; db -= 20) { const yy = y3 + h3 * (-db / 70); D.line(g, pad, yy, pad + w, yy, C.grid, 1); D.text(g, db + 'dB', pad + 2, yy - 10, { size: 8, color: C.dim }); }
        g.beginPath();
        for (let c = 0; c <= w; c += 2) { const i = Math.min(edc.length - 1, Math.floor(c / w * edc.length)), py = y3 + h3 * U.clamp(-edc[i] / 70, 0, 1); c ? g.lineTo(pad + c, py) : g.moveTo(pad + c, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        const rx = pad + w * Math.min(1, P.rt60 / T);
        D.line(g, rx, y3, rx, y3 + h3, C.warn, 1);
        D.text(g, GTL.L(`감쇠 곡선 EDC, 0~${T.toFixed(1)}초 (노란 선 = 설정 RT60)`, `Decay curve EDC, 0 to ${T.toFixed(1)} s (yellow = set RT60)`), pad + 4, y3 + 3, { size: 10, color: C.dim });
        ctx.stat(GTL.L('측정 RT60 (T30)', 'Measured RT60 (T30)'), rtMeas ? rtMeas.toFixed(2) + ' s' : '-');
        ctx.stat(GTL.L('NED 0.9 도달', 'NED reaches 0.9'), nedT ? nedT + ' ms' : GTL.L('300ms 안에 못 미침', 'Not within 300 ms'));
        ctx.stat(GTL.L('지연선 수', 'Delay lines'), P.algo === 'schroeder' ? '4 + 2' : P.algo === 'freeverb' ? '(8 + 4) × 2' : '8');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
