// 병렬 컴프레션 (뉴욕 컴프레션): 세게 누른 신호를 원음과 섞어 작은 소리만 끌어올림
GTL.register({
  id: 'parallel-compression',
  title: '병렬 컴프레션 (뉴욕 컴프레션)',
  summary: '세게 압축한 신호만 쓰면 작은 소리는 커지지만 드럼의 타격감이 납작해짐. A는 100% 압축 신호, B는 압축 신호 50%를 원음과 섞음. B는 고스트 노트 같은 작은 소리를 끌어올리면서 큰 타격의 모양은 지킴.',
  views: { a: '직렬 (압축 100%)', b: '병렬 (압축 50%)' },
  controls: '파라미터 표에서 믹스 비율과 스레숄드를 바꿈. 두 뷰는 출력 피크를 -6 dBFS로 맞춰 비교함.',
  info: `
    <p><b>병렬 컴프레션(Parallel Compression)</b>은 신호를 둘로 나눠 한쪽은 그대로, 다른 쪽은 아주 세게 압축한 뒤 다시 섞는 방법. 뉴욕의 믹싱 엔지니어들이 드럼에 많이 써서 "뉴욕 컴프레션"이라고도 부름.</p>
    <p>큰 소리에서는 원음이 압도해서 트랜지언트가 남음. 작은 소리에서는 압축 신호(메이크업으로 크게 올린 것)가 더해져 커짐. 결과는 작은 소리를 위로 끌어올리는 <b>업워드 컴프레션</b>에 가까움.</p>
    <ul>
      <li>왼쪽 정적 곡선의 파란 계열 선이 이 효과를 보여 줌. 스레숄드 아래가 1:1보다 위로 떠 있음.</li>
      <li>DAW에서는 센드로 보낸 버스에 컴프레서를 걸거나, 플러그인의 Mix(Dry/Wet) 노브로 같은 일을 함</li>
      <li>주의: 압축 경로에 지연(룩어헤드, 선형 위상 EQ)이 있으면 원음과 섞을 때 콤 필터가 생김. 지연 보정이 필요함.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="56" width="70" height="28" class="f-dim"/><text x="45" y="74" text-anchor="middle" class="t-small">${L('입력', 'Input')}</text>
    <path d="M80,70 L120,70 L120,30 L218,30" class="d-accent" marker-end="url(#arr)"/>
    <path d="M120,70 L120,110 L158,110" class="d-accent" marker-end="url(#arr)"/>
    <text x="150" y="24" class="t-small">${L('원음 (드라이)', 'Dry')}</text>
    <rect x="160" y="96" width="150" height="28" class="f-dim"/><text x="235" y="114" text-anchor="middle" class="t-small">${L('강한 압축 + 메이크업', 'Heavy comp + makeup')}</text>
    <path d="M310,110 L360,110 L360,82" class="d-accent" marker-end="url(#arr)"/>
    <path d="M220,30 L360,30 L360,57" class="d-accent" marker-end="url(#arr)"/>
    <circle cx="360" cy="70" r="12" class="f-dim"/><text x="360" y="75" text-anchor="middle">+</text>
    <path d="M372,70 L420,70" class="d-accent" marker-end="url(#arr)"/><text x="426" y="74" class="t-small">${L('출력', 'Output')}</text>
    <text x="380" y="104" class="t-small t-b">${L('큰 소리: 원음이 지배', 'Loud: dry dominates')}</text>
    <text x="380" y="122" class="t-small t-b">${L('작은 소리: 압축 신호가 더해짐', 'Quiet: compressed adds up')}</text>
    <text x="10" y="144" class="t-small t-dim">${L('믹스 비율 = 압축 신호의 비중', 'Mix = share of the compressed signal')}</text>
  </svg>`,
  look: [
    '오른쪽 파형에서 A는 큰 타격과 작은 고스트 노트의 높이가 거의 같음. B는 큰 타격이 뾰족하게 남고 고스트 노트도 잘 보임.',
    '"펀치 (피크 - RMS)"는 A가 가장 작음. 믹스를 0%로 두면 가장 큼.',
    '"메인 타격 대 고스트 노트"는 믹스 0%일 때 약 17 dB이고, B에서는 그보다 작아짐 (고스트 노트가 올라옴)',
    '왼쪽 정적 곡선에서 B의 선은 스레숄드 아래에서 1:1 선보다 위에 있음 (업워드 컴프레션)',
  ],
  refs: [
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '병렬 압축과 업워드 컴프레션' },
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '드럼 버스 병렬 압축 실전' },
    { type: 'book', title: 'Bobby Owsinski, The Mixing Engineer\'s Handbook', note: '뉴욕 컴프레션 기법 소개' },
    { type: 'paper', title: 'Giannoulis, Massberg, Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '압축 경로의 컴프레서 구조' },
  ],
  params: [
    { key: 'mix', label: '믹스 (압축 신호 %)', type: 'range', min: 0, max: 100, step: 1, default: 50, a: 100, b: 50, group: '병렬' },
    { key: 'threshold', label: '스레숄드 (dB)', type: 'range', min: -60, max: -10, step: 1, default: -42, shared: true, group: '압축 경로' },
    { key: 'ratio', label: '레이쇼 (R:1)', type: 'range', min: 2, max: 20, step: 0.5, default: 10, shared: true },
    { key: 'makeup', label: '메이크업 (dB)', type: 'range', min: 0, max: 30, step: 1, default: 18, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Parallel Compression (New York Compression)',
    summary: 'Using only a heavily compressed signal makes quiet sounds louder, but flattens the punch of drums. A is 100% compressed signal. B blends 50% compressed signal with the dry signal. B lifts quiet sounds like ghost notes while keeping the shape of big hits.',
    views: { a: 'Serial (100% compressed)', b: 'Parallel (50% compressed)' },
    controls: 'Change the mix and threshold in the parameter table. Both views are matched to a -6 dBFS output peak.',
    info: `
    <p><b>Parallel compression</b> splits the signal in two. One path stays dry, the other is compressed very hard, and then they are mixed back. New York mix engineers used it a lot on drums, so it is also called "New York compression".</p>
    <p>On loud parts the dry signal dominates, so transients survive. On quiet parts the compressed signal (raised a lot by makeup gain) adds up and makes them louder. The result is close to <b>upward compression</b>, which lifts quiet sounds.</p>
    <ul>
      <li>The blue line on the static curve at the left shows this. Below the threshold it sits above the 1:1 line.</li>
      <li>In a DAW you send to a bus with a compressor, or use the Mix (dry/wet) knob of a plugin.</li>
      <li>Caution: if the compressed path has delay (lookahead, linear phase EQ), mixing with the dry signal makes a comb filter. Delay compensation is needed.</li>
    </ul>`,
    look: [
      'In the waveform on the right, A\'s big hits and quiet ghost notes are almost the same height. In B the big hits stay sharp and the ghost notes are clearly visible.',
      '"Punch (peak - RMS)" is smallest in A. With mix at 0% it is largest.',
      '"Main hit vs ghost note" is about 17 dB at 0% mix. In B it is smaller (ghost notes come up).',
      'On the static curve at the left, B\'s line sits above the 1:1 line below the threshold (upward compression).',
    ],
    refs: ['Parallel compression and upward compression.', 'Parallel compression on a drum bus in practice.', 'The New York compression technique.', 'Compressor structure for the compressed path.'],
    params: {
      mix: { label: 'Mix (compressed %)', group: 'Parallel' },
      threshold: { label: 'Threshold (dB)', group: 'Compressed path' },
      ratio: 'Ratio (R:1)',
      makeup: 'Makeup (dB)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, BPM = 96;

    // 1마디: 킥, 스네어 메인 타격, 작은 고스트 노트(-18 dB), 하이햇
    function makeSource(sr) {
      const beat = 60 / BPM, n = Math.round(beat * 4 * sr), out = new Float32Array(n), nz = A.noiseBuffer(sr, 8);
      const add = (t0, dur, fn) => { const i0 = Math.round(t0 * sr), m = Math.min(n - i0, Math.round(dur * sr)); for (let i = 0; i < m; i++) out[i0 + i] += fn(i / sr, i); };
      const snare = (v) => (t, i) => v * (0.3 * nz[i % nz.length] * Math.exp(-t * 20) + 0.25 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 28));
      const kick = (t) => 0.45 * Math.sin(2 * Math.PI * (48 * t + 140 * (1 - Math.exp(-t * 35)) / 35)) * Math.exp(-t * 7);
      const s16 = beat / 4, ghost = A.dbToLin(-18);
      add(0, 0.5, kick); add(2 * beat, 0.5, kick); add(2.5 * beat, 0.5, kick);
      add(beat, 0.3, snare(1)); add(3 * beat, 0.3, snare(1));
      for (const s of [3, 6, 7, 10, 13, 15]) add(s * s16, 0.15, snare(ghost));
      for (let s = 0; s < 8; s++) add(s * beat / 2, 0.05, (t, i) => 0.06 * (nz[(i * 3 + 5) % nz.length] - nz[(i * 3 + 4) % nz.length]) * Math.exp(-t * 80));
      return { buf: out, mainAt: Math.round(beat * sr), ghostAt: Math.round(3 * s16 * sr), len: Math.round(0.1 * sr) };
    }
    const gc = (x, T, R) => (x > T ? T + (x - T) / R : x);
    function coefs(sr) { return { aC: 0, rC: Math.exp(-1 / (0.1 * sr)), T: P.threshold, R: P.ratio, mk: A.dbToLin(P.makeup), m: P.mix / 100 }; }
    function step(st, x, k) {
      const xd = A.linToDb(x), xl = xd - gc(xd, k.T, k.R);
      st.gr = xl > st.gr ? k.aC * st.gr + (1 - k.aC) * xl : k.rC * st.gr + (1 - k.rC) * xl;
      const wet = x * A.dbToLin(-st.gr) * k.mk;
      return (1 - k.m) * x + k.m * wet;
    }
    // 정적 곡선 (dB): 원음과 압축 신호를 선형으로 더함
    const staticOut = (x, m) => A.linToDb((1 - m) * A.dbToLin(x) + m * A.dbToLin(gc(x, P.threshold, P.ratio) + P.makeup));

    const S = makeSource(SR), N = S.buf.length, COLS = 480;
    let key = '', norm = 1, outD, inD, stats;
    function decim(arr, scale) {
      const lo = new Float32Array(COLS), hi = new Float32Array(COLS);
      for (let c = 0; c < COLS; c++) { let a = 0, b = 0; for (let i = Math.floor(c * N / COLS); i < Math.floor((c + 1) * N / COLS); i++) { a = Math.min(a, arr[i]); b = Math.max(b, arr[i]); } lo[c] = a * scale; hi[c] = b * scale; }
      return { lo, hi };
    }
    function analyze() {
      const k = [P.mix, P.threshold, P.ratio, P.makeup].join();
      if (k === key) return;
      key = k;
      const st = { gr: 0 }, cf = coefs(SR), out = new Float32Array(N);
      for (let i = 0; i < N; i++) step(st, S.buf[i], cf);
      for (let i = 0; i < N; i++) out[i] = step(st, S.buf[i], cf);
      norm = 0.5 / Math.max(1e-6, A.peak(out));
      outD = decim(out, norm); inD = decim(S.buf, 0.5 / A.peak(S.buf));
      const pk = (from) => { let m = 0; for (let i = from; i < from + S.len; i++) m = Math.max(m, Math.abs(out[i])); return m; };
      stats = { punch: A.linToDb(A.peak(out)) - A.linToDb(A.rms(out)), ghost: A.linToDb(pk(S.mainAt)) - A.linToDb(pk(S.ghostAt)), rms: A.linToDb(A.rms(out) * norm) };
    }

    let live = { gr: 0 }, liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr).buf; liveSr = sr; pos = 0; live = { gr: 0 }; }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc[pos], cf) * norm;
          pos = (pos + 1) % liveSrc.length;
          l[i] = y; r[i] = y;
        }
      },
    });
    function drawBand(g, d, x, y, w, h, color) {
      const mid = y + h / 2, cw = w / COLS;
      g.beginPath();
      for (let c = 0; c < COLS; c++) { const px = x + (c + 0.5) * cw; g.moveTo(px, mid - U.clamp(d.hi[c] * 1.8, -1, 1) * h / 2); g.lineTo(px, mid - U.clamp(d.lo[c] * 1.8, -1, 1) * h / 2 + 0.5); }
      g.strokeStyle = color; g.lineWidth = Math.max(1, cw); g.stroke();
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const cs = Math.min(H - 2 * pad - 14, W * 0.36), cx = pad, cy = pad, lo = -70, hi = 10;
        const toX = (db) => cx + (db - lo) / (hi - lo) * cs, toY = (db) => cy + cs - U.clamp((db - lo) / (hi - lo), 0, 1) * cs;
        D.rect(g, cx, cy, cs, cs, 'rgba(0,0,0,0.35)');
        for (let db = -60; db <= 0; db += 20) { D.line(g, toX(db), cy, toX(db), cy + cs, C.grid); D.line(g, cx, toY(db), cx + cs, toY(db), C.grid); }
        D.line(g, toX(lo), toY(lo), toX(hi), toY(hi), C.dim, 1);
        D.line(g, toX(P.threshold), cy, toX(P.threshold), cy + cs, C.warn, 1);
        const curve = (m, color, lw) => { g.beginPath(); for (let i = 0; i <= 100; i++) { const x = lo + (-lo) * i / 100, y = staticOut(x, m); i ? g.lineTo(toX(x), toY(y)) : g.moveTo(toX(x), toY(y)); } g.strokeStyle = color; g.lineWidth = lw; g.stroke(); };
        curve(1, 'rgba(255,255,255,0.25)', 1);
        curve(P.mix / 100, col, 2);
        D.text(g, GTL.L('정적 곡선 (회색 = 압축 신호만)', 'Static curve (gray = compressed only)'), cx + 4, cy + 4, { size: 10, color: C.dim });
        D.text(g, '-70', cx, cy + cs + 2, { size: 9, color: C.dim }); D.text(g, '+10 dB', cx + cs, cy + cs + 2, { size: 9, color: C.dim, align: 'right' });
        // 파형 (피크 -6 dBFS로 맞춤)
        const wx = cx + cs + pad, ww = W - wx - pad, wh = H - 2 * pad, hh = (wh - pad) / 2;
        D.rect(g, wx, pad, ww, hh, 'rgba(0,0,0,0.35)');
        drawBand(g, inD, wx, pad, ww, hh, 'rgba(160,170,190,0.6)');
        D.text(g, GTL.L('원음 (피크 맞춤)', 'Dry (peak matched)'), wx + 4, pad + 3, { size: 10, color: C.dim });
        const y2 = pad * 2 + hh;
        D.rect(g, wx, y2, ww, hh, 'rgba(0,0,0,0.35)');
        drawBand(g, outD, wx, y2, ww, hh, col);
        D.text(g, GTL.L('출력 (피크 맞춤)', 'Output (peak matched)'), wx + 4, y2 + 3, { size: 10, color: C.dim });
        const gx = wx + ww * S.ghostAt / N; D.text(g, GTL.L('고스트', 'ghost'), gx, y2 + hh - 14, { size: 9, color: C.dim });
        if (snd.on && liveSrc) { const px = wx + ww * pos / liveSrc.length; D.line(g, px, pad, px, H - pad, C.text); }

        ctx.stat(GTL.L('펀치 (피크 - RMS)', 'Punch (peak - RMS)'), stats.punch.toFixed(1) + ' dB');
        ctx.stat(GTL.L('메인 타격 대 고스트 노트', 'Main hit vs ghost note'), stats.ghost.toFixed(1) + ' dB');
        ctx.stat(GTL.L('출력 RMS (피크 -6 dBFS 기준)', 'Output RMS (at -6 dBFS peak)'), stats.rms.toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
