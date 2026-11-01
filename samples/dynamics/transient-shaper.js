// 트랜지언트 셰이퍼: 빠른 엔벨로프와 느린 엔벨로프의 차이로 타격과 잔향을 따로 키우거나 줄임
GTL.register({
  id: 'transient-shaper',
  title: '트랜지언트 셰이퍼 (어택과 서스테인)',
  summary: '트랜지언트 셰이퍼는 스레숄드 없이 소리의 시작(어택)과 꼬리(서스테인)를 따로 키우거나 줄임. A는 처리 없음. B는 어택을 키우고 서스테인을 줄여 드럼이 단단하고 방 울림이 짧아짐.',
  views: { a: '처리 없음', b: '어택 +, 서스테인 -' },
  controls: '파라미터 표에서 어택과 서스테인 양을 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>트랜지언트 셰이퍼(Transient Shaper)</b>는 레벨 크기가 아니라 레벨의 <b>변화</b>에 반응함. 같은 신호를 반응 속도가 다른 엔벨로프 팔로워 두 개로 따라감.</p>
    <ul>
      <li><b>어택</b>: 빠른 팔로워(어택 0.5 ms)와 느린 팔로워(어택 25 ms)의 dB 차이. 소리가 막 시작될 때만 커짐.</li>
      <li><b>서스테인</b>: 느리게 떨어지는 팔로워(릴리스 400 ms)와 빠르게 떨어지는 팔로워(릴리스 40 ms)의 dB 차이. 소리가 줄어드는 꼬리에서만 커짐.</li>
      <li>게인(dB) = 어택 양 × 어택 차이 + 서스테인 양 × 서스테인 차이</li>
    </ul>
    <p>두 팔로워의 <b>차이</b>만 쓰므로 스레숄드가 없음. 크게 친 음과 작게 친 음에 같은 모양으로 걸림. SPL Transient Designer가 이 방식을 널리 알림.</p>
    <p>단점: 어택을 너무 키우면 피크가 커져 클리핑 위험이 생김. 서스테인을 줄이면 잔향과 함께 음의 몸통도 짧아짐.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="16" class="t-small t-dim">${L('엔벨로프 팔로워 두 개', 'Two envelope followers')}</text>
    <path d="M40,150 L50,30 L120,80 L200,110 L300,130 L500,145" class="d-a"/>
    <text x="54" y="28" class="t-small t-a">${L('빠른 팔로워', 'fast follower')}</text>
    <path d="M40,150 Q70,60 110,62 L200,100 L300,126 L500,144" class="d-b"/>
    <text x="120" y="56" class="t-small t-b">${L('느린 팔로워', 'slow follower')}</text>
    <rect x="48" y="32" width="24" height="70" class="f-accent" opacity="0.25"/>
    <text x="80" y="128" class="t-small">${L('차이 = 어택 구간', 'difference = attack part')}</text>
    <text x="300" y="60" class="t-small">${L('어택 + : 이 구간만 게인 올림', 'Attack + : raise gain only here')}</text>
    <text x="300" y="80" class="t-small">${L('서스테인 - : 꼬리 구간 게인 내림', 'Sustain - : lower gain on the tail')}</text>
    <text x="40" y="172" class="t-small t-dim">${L('스레숄드가 없어서 큰 음, 작은 음에 같은 모양으로 걸림', 'No threshold, so loud and quiet hits get the same shape')}</text>
  </svg>`,
  look: [
    '가운데 확대 그림에서 B는 스네어의 첫 부분이 입력보다 높고 꼬리는 빨리 줄어듦',
    'B의 "큰 타격 최대 게인"과 "작은 타격 최대 게인"은 몇 dB 차이뿐. 입력 크기는 14 dB 차이라서 레벨과 거의 무관하게 동작함.',
    'B의 서스테인을 +80%로 올리면 방 울림이 길게 늘어남',
    'B의 어택을 -80%로 내리면 타격이 부드러워지고 피크가 낮아짐',
  ],
  refs: [
    { type: 'engine', title: 'SPL Transient Designer, User Manual', note: '차동 엔벨로프 방식(Differential Envelope Technology)의 어택, 서스테인 조절' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '엔벨로프 팔로워와 레벨 검출' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '엔벨로프 검출기 구현' },
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '드럼 믹스에서 트랜지언트 처리' },
  ],
  params: [
    { key: 'attack', label: '어택 (%)', type: 'range', min: -100, max: 100, step: 1, default: 70, a: 0, b: 70, group: '셰이퍼' },
    { key: 'sustain', label: '서스테인 (%)', type: 'range', min: -100, max: 100, step: 1, default: -60, a: 0, b: -60 },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Transient Shaper (Attack and Sustain)',
    summary: 'A transient shaper raises or lowers the start (attack) and the tail (sustain) of a sound separately, with no threshold. A has no processing. B raises the attack and lowers the sustain, so the drums get tighter and the room sound gets shorter.',
    views: { a: 'No processing', b: 'Attack +, sustain -' },
    controls: 'Change the attack and sustain amounts in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>A <b>transient shaper</b> reacts to the <b>change</b> in level, not the level itself. It follows the same signal with two envelope followers of different speed.</p>
    <ul>
      <li><b>Attack</b>: the dB difference between a fast follower (0.5 ms attack) and a slow follower (25 ms attack). It is large only when a sound just starts.</li>
      <li><b>Sustain</b>: the dB difference between a slowly falling follower (400 ms release) and a quickly falling follower (40 ms release). It is large only on the decaying tail.</li>
      <li>Gain (dB) = attack amount × attack difference + sustain amount × sustain difference.</li>
    </ul>
    <p>Only the <b>difference</b> between followers is used, so there is no threshold. Loud and soft hits get the same shape. The SPL Transient Designer made this approach popular.</p>
    <p>Downsides: too much attack raises the peaks and risks clipping. Lowering sustain shortens the body of the note along with the room sound.</p>`,
    look: [
      'In the zoom in the middle, B makes the start of the snare higher than the input, and the tail falls faster.',
      'In B, "Max gain on loud hit" and "Max gain on soft hit" differ by only a few dB. The inputs differ by 14 dB, so it works almost regardless of level.',
      'Raise B\'s sustain to +80%. The room sound gets much longer.',
      'Lower B\'s attack to -80%. The hits get softer and the peaks get lower.',
    ],
    refs: ['Attack and sustain control with the differential envelope method.', 'Envelope followers and level detection.', 'Envelope detector code.', 'Transient processing in drum mixing.'],
    params: {
      attack: { label: 'Attack (%)', group: 'Shaper' },
      sustain: 'Sustain (%)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, BPM = 100;

    // 킥, 큰 스네어, 작은 스네어(-14 dB). 각 타격에 방 울림(저역 통과 잡음 꼬리)을 더함
    function makeSource(sr) {
      const beat = 60 / BPM, n = Math.round(beat * 4 * sr), out = new Float32Array(n), nz = A.noiseBuffer(sr, 12);
      const room = A.biquad('lowpass', 3000, 0.7, 0, sr);
      const tail = new Float32Array(n);
      const add = (t0, dur, fn) => { const i0 = Math.round(t0 * sr), m = Math.min(n - i0, Math.round(dur * sr)); for (let i = 0; i < m; i++) { const v = fn(i / sr, i); out[i0 + i] += v; tail[i0 + i] += Math.abs(v); } };
      const kick = (t) => 0.4 * Math.sin(2 * Math.PI * (50 * t + 140 * (1 - Math.exp(-t * 35)) / 35)) * Math.exp(-t * 9);
      const snare = (v) => (t, i) => v * (0.3 * nz[i % nz.length] * Math.exp(-t * 25) + 0.22 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 30));
      add(0, 0.4, kick); add(beat, 0.25, snare(1)); add(2 * beat, 0.4, kick); add(3 * beat, 0.25, snare(A.dbToLin(-14)));
      // 방 울림: 타격 크기를 시정수 150 ms로 감쇠시키며 잡음에 곱함
      let e = 0;
      const k = Math.exp(-1 / (0.15 * sr));
      for (let i = 0; i < n; i++) { e = Math.max(tail[i], e * k); out[i] += room.process(nz[(i * 7 + 3) % nz.length]) * e * 0.35; }
      for (let i = 0; i < n; i++) out[i] *= 0.6;
      return { buf: out, loudAt: Math.round(beat * sr), softAt: Math.round(3 * beat * sr), span: Math.round(0.08 * sr) };
    }
    const fol = (e, x, a, r) => e + (x - e) * (x > e ? a : r);
    function coefs(sr) {
      const c = (ms) => 1 - Math.exp(-1 / (ms * 0.001 * sr));
      return { fa: c(0.5), sa: c(25), r60: c(60), r40: c(40), r400: c(400), sm: c(1), at: P.attack / 100, su: P.sustain / 100 };
    }
    function step(st, x, k) {
      const a = Math.abs(x) + 1e-6;
      st.f = fol(st.f, a, k.fa, k.r60); st.s = fol(st.s, a, k.sa, k.r60);
      st.rf = fol(st.rf, a, k.fa, k.r40); st.rs = fol(st.rs, a, k.fa, k.r400);
      const att = Math.max(0, A.linToDb(st.f) - A.linToDb(st.s)), sus = Math.max(0, A.linToDb(st.rs) - A.linToDb(st.rf));
      const want = U.clamp(k.at * att * 0.5 + k.su * sus * 0.8, -24, 12);
      st.gdb += (want - st.gdb) * k.sm;
      return x * A.dbToLin(st.gdb);
    }
    const newSt = () => ({ f: 0, s: 0, rf: 0, rs: 0, gdb: 0 });

    const S = makeSource(SR), N = S.buf.length, COLS = 480;
    let key = '', out, gdb, outD, inD, stats;
    function decim(arr) {
      const lo = new Float32Array(COLS), hi = new Float32Array(COLS);
      for (let c = 0; c < COLS; c++) { let a = 0, b = 0; for (let i = Math.floor(c * N / COLS); i < Math.floor((c + 1) * N / COLS); i++) { a = Math.min(a, arr[i]); b = Math.max(b, arr[i]); } lo[c] = a; hi[c] = b; }
      return { lo, hi };
    }
    function drawBand(g, d, x, y, w, h, color) {
      const mid = y + h / 2, cw = w / COLS;
      g.beginPath();
      for (let c = 0; c < COLS; c++) { const px = x + (c + 0.5) * cw; g.moveTo(px, mid - U.clamp(d.hi[c] * 1.6, -1, 1) * h / 2); g.lineTo(px, mid - U.clamp(d.lo[c] * 1.6, -1, 1) * h / 2 + 0.5); }
      g.strokeStyle = color; g.lineWidth = Math.max(1, cw); g.stroke();
    }
    inD = decim(S.buf);
    function analyze() {
      const k = P.attack + ',' + P.sustain;
      if (k === key) return;
      key = k;
      const st = newSt(), cf = coefs(SR);
      for (let i = 0; i < N; i++) step(st, S.buf[i], cf);
      out = new Float32Array(N); gdb = new Float32Array(N);
      for (let i = 0; i < N; i++) { out[i] = step(st, S.buf[i], cf); gdb[i] = st.gdb; }
      outD = decim(out);
      const maxG = (from) => { let m = -99; for (let i = from; i < from + S.span; i++) m = Math.max(m, gdb[i]); return m; };
      // 꼬리: 큰 스네어 150~500 ms 구간의 RMS 변화
      const t0 = S.loudAt + Math.round(0.15 * SR), t1 = S.loudAt + Math.round(0.5 * SR);
      stats = { loud: maxG(S.loudAt), soft: maxG(S.softAt), tail: A.linToDb(A.rms(out, t0, t1)) - A.linToDb(A.rms(S.buf, t0, t1)), peak: A.linToDb(A.peak(out)) };
    }

    let live = newSt(), liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr).buf; liveSr = sr; pos = 0; live = newSt(); }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc[pos], cf);
          pos = (pos + 1) % liveSrc.length;
          l[i] = y; r[i] = y;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.3, h2 = (H - pad * 4) * 0.45, h3 = H - pad * 4 - h1 - h2;
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        drawBand(g, inD, pad, pad, iw, h1, 'rgba(160,170,190,0.4)');
        drawBand(g, outD, pad, pad, iw, h1, col);
        D.text(g, GTL.L('1마디 (킥, 큰 스네어, 킥, 작은 스네어)', '1 bar (kick, loud snare, kick, soft snare)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 확대: 큰 스네어 400 ms
        const y2 = pad * 2 + h1, zc = Math.round(0.4 * SR);
        A.drawWave(g, S.buf, pad, y2, iw, h2, { from: S.loudAt, count: zc, color: 'rgba(160,170,190,0.5)', amp: 1.5 });
        A.drawWave(g, out, pad, y2, iw, h2, { from: S.loudAt, count: zc, color: col, amp: 1.5, background: false, axis: false });
        D.text(g, GTL.L('확대: 큰 스네어 400 ms (회색 = 입력)', 'Zoom: loud snare, 400 ms (gray = input)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 게인 (dB)
        const y3 = y2 + h2 + pad, gmid = y3 + h3 / 2;
        D.rect(g, pad, y3, iw, h3, 'rgba(0,0,0,0.35)');
        D.line(g, pad, gmid, pad + iw, gmid, C.grid);
        g.beginPath();
        for (let c = 0; c <= 240; c++) { const i = S.loudAt + Math.floor(c * (zc - 1) / 240), py = gmid - U.clamp(gdb[i] / 15, -1, 1) * h3 / 2; c ? g.lineTo(pad + c * iw / 240, py) : g.moveTo(pad + c * iw / 240, py); }
        g.strokeStyle = C.warn; g.lineWidth = 1.5; g.stroke();
        D.text(g, GTL.L('게인 (가운데 = 0 dB, ±15 dB)', 'Gain (middle = 0 dB, ±15 dB)'), pad + 4, y3 + 3, { size: 10, color: C.dim });
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.length; D.line(g, px, pad, px, pad + h1, C.text); }

        ctx.stat(GTL.L('큰 타격 최대 게인', 'Max gain on loud hit'), stats.loud.toFixed(1) + ' dB');
        ctx.stat(GTL.L('작은 타격 최대 게인', 'Max gain on soft hit'), stats.soft.toFixed(1) + ' dB');
        ctx.stat(GTL.L('꼬리 레벨 변화', 'Tail level change'), stats.tail.toFixed(1) + ' dB');
        ctx.stat(GTL.L('출력 피크', 'Output peak'), stats.peak.toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
