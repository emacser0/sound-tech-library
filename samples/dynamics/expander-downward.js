// 다운워드 익스팬더 vs 게이트: 스레숄드 아래를 비율로 서서히 줄이면 음의 꼬리가 자연스럽게 남음
GTL.register({
  id: 'expander-downward',
  title: '다운워드 익스팬더 vs 게이트',
  summary: '다운워드 익스팬더는 스레숄드 아래로 내려간 신호를 비율만큼 더 작게 만듦. A는 비율 1:20이라 게이트처럼 음의 꼬리가 툭 잘림. B는 1:2라 바탕 잡음은 줄이면서 꼬리는 서서히 사라짐.',
  views: { a: '1:20 (게이트에 가까움)', b: '1:2 익스팬더' },
  controls: '파라미터 표에서 스레숄드와 비율을 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>다운워드 익스팬더(Downward Expander)</b>는 컴프레서의 반대. 스레숄드 <b>아래</b>에서 입력이 1 dB 줄면 출력은 R dB 줄어듦. 조용한 부분을 더 조용하게 만들어 다이내믹 레인지를 넓힘.</p>
    <p>비율을 아주 크게 하면 게이트가 됨. 게이트는 열림, 닫힘 두 상태라서 꼬리가 잘리는 순간이 귀에 띔. 익스팬더는 레벨에 비례해 줄이므로 꼬리가 원래 감쇠보다 조금 빨리 사라질 뿐 끊기지 않음.</p>
    <ul>
      <li>쓰임새: 보컬 녹음의 숨소리와 방 잡음 줄이기, 드럼 마이크의 번짐(Bleed) 줄이기, 오래된 녹음의 히스 줄이기</li>
      <li>레인지(최대 감소량)를 두어 아주 작은 소리가 0까지 떨어지지 않게 함</li>
      <li>업워드 익스팬더는 스레숄드 <b>위</b>를 키우는 반대 방향 장치. 이 샘플은 다운워드만 다룸.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
    <line x1="60" y1="180" x2="260" y2="180" class="d-line"/><line x1="60" y1="180" x2="60" y2="10" class="d-line"/>
    <text x="160" y="196" text-anchor="middle" class="t-small">${L('입력 (dB)', 'Input (dB)')}</text>
    <text x="8" y="100" class="t-small">${L('출력', 'Output')}</text>
    <line x1="60" y1="180" x2="250" y2="20" class="d-dim" stroke-dasharray="4 3"/>
    <path d="M250,20 L160,96 L155,180" class="d-a"/>
    <path d="M250,20 L160,96 L110,180" class="d-b"/>
    <line x1="160" y1="96" x2="160" y2="180" class="d-dim" stroke-dasharray="3 3"/>
    <text x="164" y="176" class="t-small t-dim">${L('스레숄드', 'threshold')}</text>
    <text x="106" y="140" class="t-small t-b">1:2</text><text x="128" y="118" class="t-small t-a">1:20</text>
    <text x="290" y="34">${L('스레숄드 T 아래에서', 'Below threshold T')}</text>
    <text x="290" y="58" class="t-mono t-small">y = T + (x - T) × R</text>
    <text x="290" y="88" class="t-small">${L('예: T = -40, 입력 -50 dB', 'Example: T = -40, input -50 dB')}</text>
    <text x="290" y="108" class="t-small t-b">${L('R = 2: 출력 -60 dB (10 dB 더 줄임)', 'R = 2: output -60 dB (10 dB more cut)')}</text>
    <text x="290" y="128" class="t-small t-a">${L('R = 20: 출력 -240 dB (사실상 무음)', 'R = 20: output -240 dB (silent)')}</text>
    <text x="290" y="160" class="t-small t-dim">${L('스레숄드 위는 1:1 그대로', 'Above the threshold: 1:1')}</text>
  </svg>`,
  look: [
    '파형에서 A는 음마다 꼬리가 중간에 뚝 끊김. B는 꼬리가 짧아지지만 매끄럽게 줄어듦.',
    '"잡음 구간 감소량"은 두 뷰 모두 크지만, "꼬리 구간 평균 감소량"은 A가 B보다 훨씬 큼',
    'B의 비율을 1:4로 올리면 꼬리가 더 빨리 사라지고 A에 가까워짐',
    '스레숄드를 -60 dB로 내리면 잡음 바닥 근처라서 두 뷰 모두 잡음이 거의 줄지 않음',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Chapter 4', year: 2011, note: '익스팬더, 게이트의 정적 특성 곡선' },
    { type: 'paper', title: 'Giannoulis, Massberg, Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '소프트 니 게인 계산 (익스팬더에도 같은 방식 적용)' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '다운워드 익스팬더 구현' },
    { type: 'book', title: 'Bobby Owsinski, The Mixing Engineer\'s Handbook', note: '게이트 대신 익스팬더를 쓰는 경우' },
  ],
  params: [
    { key: 'threshold', label: '스레숄드 (dB)', type: 'range', min: -70, max: -10, step: 1, default: -36, shared: true, group: '익스팬더' },
    { key: 'ratio', label: '비율 (1:R)', type: 'range', min: 1, max: 20, step: 0.5, default: 2, a: 20, b: 2 },
    { key: 'knee', label: '니 폭 (dB)', type: 'range', min: 0, max: 12, step: 1, default: 4, shared: true },
    { key: 'range', label: '레인지 (dB)', type: 'range', min: -80, max: -6, step: 1, default: -60, shared: true },
    { key: 'noise', label: '바탕 잡음 (dB)', type: 'range', min: -70, max: -30, step: 1, default: -52, shared: true, group: '장면' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Downward Expander vs Gate',
    summary: 'A downward expander makes signals below the threshold even quieter, by a ratio. A uses 1:20, so it acts like a gate and cuts note tails abruptly. B uses 1:2, so it lowers the background noise while tails fade out smoothly.',
    views: { a: '1:20 (gate-like)', b: '1:2 expander' },
    controls: 'Change threshold and ratio in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>A <b>downward expander</b> is the opposite of a compressor. <b>Below</b> the threshold, 1 dB less input gives R dB less output. Quiet parts get quieter, so the dynamic range gets wider.</p>
    <p>With a very large ratio, it becomes a gate. A gate has only two states, open and closed, so the moment a tail is cut is easy to hear. An expander reduces in proportion to the level, so tails only fade a bit faster than before. They do not stop suddenly.</p>
    <ul>
      <li>Uses: reducing breaths and room noise on vocals, bleed on drum mics, hiss on old recordings.</li>
      <li>A range (maximum reduction) keeps very quiet sounds from dropping to zero.</li>
      <li>An upward expander raises the part <b>above</b> the threshold. This sample covers only downward expansion.</li>
    </ul>`,
    look: [
      'In the waveform, A cuts every note tail in the middle. B makes tails shorter, but they fade smoothly.',
      '"Noise reduction" is large in both views, but "Average tail reduction" is much larger in A than in B.',
      'Raise B\'s ratio to 1:4. Tails fade faster and B gets closer to A.',
      'Lower the threshold to -60 dB. It is near the noise floor, so neither view reduces the noise much.',
    ],
    refs: ['Static curves of expanders and gates.', 'Soft knee gain computer (same method works for expanders).', 'Downward expander code.', 'When to use an expander instead of a gate.'],
    params: {
      threshold: { label: 'Threshold (dB)', group: 'Expander' },
      ratio: 'Ratio (1:R)',
      knee: 'Knee width (dB)',
      range: 'Range (dB)',
      noise: { label: 'Background noise (dB)', group: 'Scene' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, NOTE = 0.8;

    // 뜯는 음 4개(배음 몇 개 + 지수 감쇠)와 잡음. 마지막 0.4초는 잡음만 있음
    function makeSource(sr) {
      const n = Math.round((NOTE * 4 + 0.4) * sr), tone = new Float32Array(n), noise = A.noiseBuffer(n, 31, 'pink');
      const notes = [57, 60, 64, 62];
      notes.forEach((m, k) => {
        const f = A.mtof(m), i0 = Math.round(k * NOTE * sr);
        for (let i = 0; i < NOTE * sr * 1.5 && i0 + i < n; i++) {
          const t = i / sr;
          let v = 0; for (let h = 1; h <= 5; h++) v += Math.sin(2 * Math.PI * f * h * t) * Math.exp(-t * (6 + h * 2)) / h;
          tone[i0 + i] += 0.35 * v * Math.min(1, t * 400);
        }
      });
      for (let i = 0; i < n; i++) noise[i] *= 2.5;
      return { tone, noise, n, quiet: Math.round(NOTE * 4 * sr) };
    }
    // 다운워드 익스팬더 게인 계산 (dB). 반환: 게인 리덕션(양수)
    function grOf(x, T, R, W, range) {
      let y;
      if (2 * (x - T) > W) y = x;
      else if (W > 0 && 2 * Math.abs(x - T) <= W) { const d = x - T - W / 2; y = x - (R - 1) * d * d / (2 * W); }
      else y = T + (x - T) * R;
      return Math.min(-range, x - y);
    }
    function coefs(sr) {
      return { nz: A.dbToLin(P.noise), T: P.threshold, R: P.ratio, W: P.knee, range: P.range, eA: 1 - Math.exp(-1 / (0.001 * sr)), eR: 1 - Math.exp(-1 / (0.03 * sr)), aC: Math.exp(-1 / (0.001 * sr)), rC: Math.exp(-1 / (0.06 * sr)) };
    }
    function step(st, x, k) {
      const a = Math.abs(x);
      st.env += (a - st.env) * (a > st.env ? k.eA : k.eR);
      const want = grOf(A.linToDb(st.env), k.T, k.R, k.W, k.range);
      // 더 줄일 때(닫힘)는 릴리스, 덜 줄일 때(열림)는 어택
      st.gr = want > st.gr ? k.rC * st.gr + (1 - k.rC) * want : k.aC * st.gr + (1 - k.aC) * want;
      return x * A.dbToLin(-st.gr);
    }
    const newSt = () => ({ env: 0, gr: 0 });

    const S = makeSource(SR), N = S.n, COLS = 480;
    let key = '', outD, inD, stats;
    function decim(arr) {
      const lo = new Float32Array(COLS), hi = new Float32Array(COLS);
      for (let c = 0; c < COLS; c++) { let a = 0, b = 0; for (let i = Math.floor(c * N / COLS); i < Math.floor((c + 1) * N / COLS); i++) { a = Math.min(a, arr[i]); b = Math.max(b, arr[i]); } lo[c] = a; hi[c] = b; }
      return { lo, hi };
    }
    function drawDb(g, d, x, y, w, h, color) {
      // 데시벨 크기 (아래 = -80 dB, 위 = 0 dB)로 그림. 작은 꼬리가 잘 보이게 함
      g.beginPath();
      for (let c = 0; c < COLS; c++) {
        const v = Math.max(Math.abs(d.lo[c]), Math.abs(d.hi[c])), db = U.clamp(A.linToDb(v), -80, 0), px = x + (c + 0.5) * w / COLS, py = y + h - (db + 80) / 80 * h;
        c ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.strokeStyle = color; g.lineWidth = 1.5; g.stroke();
    }
    function analyze() {
      const k = [P.threshold, P.ratio, P.knee, P.range, P.noise].join();
      if (k === key) return;
      key = k;
      const s = newSt(), cf = coefs(SR);
      const inp = new Float32Array(N), out = new Float32Array(N);
      let tailGr = 0, tailN = 0;
      for (let i = 0; i < N; i++) {
        inp[i] = S.tone[i] + S.noise[i] * cf.nz;
        out[i] = step(s, inp[i], cf);
        // 꼬리: 음 시작 0.25초 뒤부터, 음이 잡음보다 뚜렷이 큰 동안의 평균 게인 리덕션
        const t = (i / SR) % NOTE;
        if (i < S.quiet && t > 0.25 && s.env > cf.nz * 2) { tailGr += s.gr; tailN++; }
      }
      inD = decim(inp); outD = decim(out);
      stats = {
        noiseRed: A.linToDb(A.rms(inp, S.quiet + 2400, N)) - A.linToDb(A.rms(out, S.quiet + 2400, N)),
        tailRed: tailGr / Math.max(1, tailN),
      };
    }

    let live = newSt(), liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = newSt(); }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc.tone[pos] + liveSrc.noise[pos] * cf.nz, cf);
          pos = (pos + 1) % liveSrc.n;
          l[i] = y; r[i] = y;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 정적 곡선
        const cs = Math.min(H - 2 * pad - 14, W * 0.32), cx = pad, cy = pad, lo = -80;
        const toX = (db) => cx + (db - lo) / -lo * cs, toY = (db) => cy + cs - U.clamp((db - lo) / -lo, 0, 1) * cs;
        D.rect(g, cx, cy, cs, cs, 'rgba(0,0,0,0.35)');
        for (let db = -60; db < 0; db += 20) { D.line(g, toX(db), cy, toX(db), cy + cs, C.grid); D.line(g, cx, toY(db), cx + cs, toY(db), C.grid); }
        D.line(g, toX(lo), toY(lo), toX(0), toY(0), C.dim, 1);
        D.line(g, toX(P.threshold), cy, toX(P.threshold), cy + cs, C.warn, 1);
        D.line(g, cx, toY(P.noise), cx + cs, toY(P.noise), C.grid, 1);
        g.beginPath();
        for (let i = 0; i <= 160; i++) { const x = lo + -lo * i / 160, y = x - grOf(x, P.threshold, P.ratio, P.knee, P.range); i ? g.lineTo(toX(x), toY(y)) : g.moveTo(toX(x), toY(y)); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, GTL.L('정적 곡선 (입력 → 출력 dB)', 'Static curve (in → out dB)'), cx + 4, cy + 4, { size: 10, color: C.dim });
        D.text(g, '-80', cx, cy + cs + 2, { size: 9, color: C.dim }); D.text(g, '0 dB', cx + cs, cy + cs + 2, { size: 9, color: C.dim, align: 'right' });
        // 레벨 (dB) 시간 그래프
        const wx = cx + cs + pad, ww = W - wx - pad, wh = H - 2 * pad;
        D.rect(g, wx, pad, ww, wh, 'rgba(0,0,0,0.35)');
        for (let db = -20; db > -80; db -= 20) { const py = pad + wh - (db + 80) / 80 * wh; D.line(g, wx, py, wx + ww, py, C.grid); D.text(g, db + ' dB', wx + 2, py - 10, { size: 9, color: C.dim }); }
        const ty = pad + wh - (P.threshold + 80) / 80 * wh; D.line(g, wx, ty, wx + ww, ty, C.warn, 1);
        drawDb(g, inD, wx, pad, ww, wh, 'rgba(160,170,190,0.45)');
        drawDb(g, outD, wx, pad, ww, wh, col);
        D.text(g, GTL.L('레벨 (dB). 회색 = 입력, 색 = 출력, 노란 선 = 스레숄드', 'Level (dB). Gray = input, color = output, yellow = threshold'), wx + 4, pad + 3, { size: 10, color: C.dim });
        D.text(g, GTL.L('잡음만', 'Noise only'), wx + ww * S.quiet / N + 4, pad + 16, { size: 9, color: C.dim });
        if (snd.on && liveSrc) { const px = wx + ww * pos / liveSrc.n; D.line(g, px, pad, px, pad + wh, C.text); }

        ctx.stat(GTL.L('비율', 'Ratio'), '1:' + P.ratio);
        ctx.stat(GTL.L('잡음 구간 감소량', 'Noise reduction'), stats.noiseRed.toFixed(1) + ' dB');
        ctx.stat(GTL.L('꼬리 구간 평균 감소량', 'Average tail reduction'), stats.tailRed.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
