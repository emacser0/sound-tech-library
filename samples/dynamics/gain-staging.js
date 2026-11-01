// 게인 스테이징: 체인 중간에서 레벨이 너무 크면, 마지막에 페이더를 내려도 이미 생긴 일그러짐은 남음
GTL.register({
  id: 'gain-staging',
  title: '게인 스테이징 (체인 중간의 클리핑)',
  summary: '처리 체인의 각 단계에 알맞은 레벨을 주는 일을 게인 스테이징이라고 함. A는 입력을 그대로 넣고 EQ로 키운 뒤 마스터에서 9 dB 내림. 출력 크기는 B와 거의 같지만 중간의 플러그인에서 이미 일그러져 배음이 가득함. B는 입력에서 먼저 12 dB 내려 깨끗함.',
  views: { a: '마스터에서 내림', b: '입력에서 내림' },
  controls: '파라미터 표에서 입력 트림과 마스터 페이더를 바꿈. 두 뷰의 최종 출력 크기는 거의 같음.',
  info: `
    <p><b>게인 스테이징(Gain Staging)</b>은 소스, 프리앰프, 플러그인, 버스, 마스터로 이어지는 체인의 각 지점에서 레벨을 알맞게 맞추는 일</p>
    <p>DAW 내부의 32비트 부동 소수점 계산은 0 dBFS를 넘어도 잘리지 않음. 하지만 다음 지점에서는 넘친 레벨이 그대로 일그러짐이 됨.</p>
    <ul>
      <li>아날로그를 모델링한 플러그인(새추레이터, 테이프, 콘솔 에뮬레이션). 보통 -18 dBFS를 0 VU로 보고 설계되어 입력이 크면 포화됨.</li>
      <li>고정 소수점 처리, 16/24비트 파일로 내보내기, 오디오 인터페이스 출력(DAC)</li>
      <li>사람의 판단: 큰 소리가 더 좋게 들리는 착각 때문에 비교가 틀어짐</li>
    </ul>
    <p>일그러짐은 생긴 뒤에는 페이더로 줄여도 없어지지 않음. 그래서 레벨은 앞단에서 먼저 맞춤. 이 샘플의 체인: 소스 → 입력 트림 → 저음 셸빙 EQ (+9 dB) → 아날로그 모델 플러그인 (-6 dBFS 위에서 포화) → 마스터 페이더 → 출력 (±1에서 잘림).</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="6" y="20" width="76" height="28" class="f-dim"/><text x="44" y="38" text-anchor="middle" class="t-small">${L('소스', 'Source')}</text>
    <rect x="112" y="20" width="76" height="28" class="f-dim"/><text x="150" y="38" text-anchor="middle" class="t-small">${L('트림', 'Trim')}</text>
    <rect x="218" y="20" width="76" height="28" class="f-dim"/><text x="256" y="38" text-anchor="middle" class="t-small">EQ +9 dB</text>
    <rect x="324" y="20" width="96" height="28" class="f-dim"/><text x="372" y="38" text-anchor="middle" class="t-small">${L('포화 플러그인', 'Saturating plugin')}</text>
    <rect x="450" y="20" width="84" height="28" class="f-dim"/><text x="492" y="38" text-anchor="middle" class="t-small">${L('마스터', 'Master')}</text>
    <path d="M82,34 L110,34" class="d-accent" marker-end="url(#arr)"/><path d="M188,34 L216,34" class="d-accent" marker-end="url(#arr)"/><path d="M294,34 L322,34" class="d-accent" marker-end="url(#arr)"/><path d="M420,34 L448,34" class="d-accent" marker-end="url(#arr)"/>
    <text x="6" y="80" class="t-small t-a">${L('A: -6 dBFS', 'A: -6 dBFS')}</text><text x="112" y="80" class="t-small t-a">0 dB</text><text x="218" y="80" class="t-small t-a">${L('+2 dBFS (넘침)', '+2 dBFS (over)')}</text>
    <text x="324" y="80" class="t-small t-a">${L('일그러짐 생김', 'distortion added')}</text><text x="450" y="80" class="t-small t-a">-9 dB</text>
    <text x="6" y="110" class="t-small t-b">${L('B: -6 dBFS', 'B: -6 dBFS')}</text><text x="112" y="110" class="t-small t-b">-12 dB</text><text x="218" y="110" class="t-small t-b">-10 dBFS</text>
    <text x="324" y="110" class="t-small t-b">${L('거의 선형', 'almost linear')}</text><text x="450" y="110" class="t-small t-b">0 dB</text>
    <text x="6" y="150" class="t-small t-dim">${L('최종 레벨은 같아도, 일그러짐은 중간 단계의 레벨이 정함', 'The final level is the same, but the level in the middle decides the distortion')}</text>
  </svg>`,
  look: [
    '위 미터에서 A는 EQ 뒤 레벨이 빨간색(0 dBFS 넘음)이고 B는 초록 범위',
    '확대 파형에서 A는 봉우리가 둥글게 눌려 있음. B는 깨끗한 사인파.',
    '아래 스펙트럼에서 A는 기음 오른쪽에 배음 기둥이 여러 개 생김. "THD" 측정값이 A는 수 %, B는 0.1% 아래.',
    'A의 마스터를 +6 dB로 올리면 출력이 ±1에서 한 번 더 잘려 THD가 더 커짐',
  ],
  refs: [
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '레벨 기준, 헤드룸, K-System' },
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '믹스 체인의 레벨 관리' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Chapter 4', year: 2011, note: '포화, 클리핑 같은 비선형 처리와 배음' },
    { type: 'book', title: 'Ken C. Pohlmann, Principles of Digital Audio, 6th ed.', year: 2010, note: '디지털 레벨, 클리핑, 고정 소수점과 부동 소수점' },
  ],
  params: [
    { key: 'trim', label: '입력 트림 (dB)', type: 'range', min: -24, max: 6, step: 0.5, default: -12, a: 0, b: -12, group: '레벨' },
    { key: 'master', label: '마스터 페이더 (dB)', type: 'range', min: -24, max: 6, step: 0.5, default: 0, a: -9, b: 0 },
    { key: 'eq', label: '저음 EQ 부스트 (dB)', type: 'range', min: 0, max: 15, step: 0.5, default: 9, shared: true, group: '체인' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Gain Staging (Clipping Inside the Chain)',
    summary: 'Gain staging means giving each step of the processing chain a suitable level. A feeds the input as is, boosts it with EQ, then pulls the master down by 9 dB. The output level is almost the same as B, but the plugin in the middle has already distorted it, adding many harmonics. B lowers the input by 12 dB first and stays clean.',
    views: { a: 'Lower at master', b: 'Lower at input' },
    controls: 'Change the input trim and master fader in the parameter table. The final output level is almost the same in both views.',
    info: `
    <p><b>Gain staging</b> is setting a suitable level at each point of the chain: source, preamp, plugins, buses and master.</p>
    <p>32-bit floating point math inside a DAW does not clip above 0 dBFS. But at the following points, the extra level turns into distortion:</p>
    <ul>
      <li>Plugins that model analog gear (saturators, tape, console emulation). They are often designed with -18 dBFS as 0 VU, and saturate when the input is hot.</li>
      <li>Fixed point processing, export to 16 or 24-bit files, and the audio interface output (DAC).</li>
      <li>Human judgment: louder sounds better, so comparisons get biased.</li>
    </ul>
    <p>Once distortion is added, lowering a fader does not remove it. So set levels early in the chain. The chain in this sample: source → input trim → low shelf EQ (+9 dB) → analog modeled plugin (saturates above -6 dBFS) → master fader → output (clipped at ±1).</p>`,
    look: [
      'In the meters at the top, A\'s level after the EQ is red (over 0 dBFS). B stays in the green range.',
      'In the zoomed waveform, A\'s peaks are rounded and squashed. B is a clean sine.',
      'In the bottom spectrum, A has several harmonic peaks to the right of the fundamental. The "THD" stat is several % for A and below 0.1% for B.',
      'Raise A\'s master to +6 dB. The output also clips at ±1, and THD grows more.',
    ],
    refs: ['Level standards, headroom, K-System.', 'Managing levels in a mix chain.', 'Nonlinear processing such as saturation and clipping, and harmonics.', 'Digital levels, clipping, fixed point and floating point.'],
    params: {
      trim: { label: 'Input trim (dB)', group: 'Levels' },
      master: 'Master fader (dB)',
      eq: { label: 'Low EQ boost (dB)', group: 'Chain' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, FN = 4096;
    // 음 4개. 주파수를 FFT bin에 맞춰(SR / FN의 정수배) 배음 측정이 깨끗하게 함
    const BINS = [17, 19, 15, 23], NOTE = 0.5;
    const freqOf = (k) => BINS[k] * SR / FN;

    function newSt(sr) { return { sr, eqDb: P.eq, shelf: A.biquad('lowshelf', 200, 0.7, P.eq, sr), ph: 0, n: 0, peaks: [0, 0, 0, 0, 0] }; }
    // 한 샘플: 체인 전체. 단계별 값을 st.stage에 남김
    function step(st, k, note) {
      const t = st.n / st.sr, f = note != null ? freqOf(note) : freqOf(Math.floor(t / NOTE) % 4);
      st.ph += f / st.sr; if (st.ph >= 1) st.ph -= 1;
      const env = note != null ? 1 : Math.min(1, (t % NOTE) / 0.01, (NOTE - (t % NOTE)) / 0.01);
      const s0 = 0.5 * Math.sin(2 * Math.PI * st.ph) * env;
      const s1 = s0 * k.trim, s2 = st.shelf.process(s1), s3 = sat(s2), s4 = s3 * k.master, s5 = U.clamp(s4, -1, 1);
      const pk = st.peaks; pk[0] = Math.max(pk[0], Math.abs(s0)); pk[1] = Math.max(pk[1], Math.abs(s1)); pk[2] = Math.max(pk[2], Math.abs(s2)); pk[3] = Math.max(pk[3], Math.abs(s3)); pk[4] = Math.max(pk[4], Math.abs(s4));
      st.n++;
      return s5;
    }
    // 아날로그 모델 플러그인: -6 dBFS(0.5)까지는 선형, 그 위는 tanh로 부드럽게 포화해 1에 다가감
    const sat = (x) => { const a = Math.abs(x); return a <= 0.5 ? x : Math.sign(x) * (0.5 + 0.5 * Math.tanh((a - 0.5) / 0.5)); };
    const coefs = () => ({ trim: A.dbToLin(P.trim), master: A.dbToLin(P.master) });

    let key = '', wave, spec, stats;
    function analyze() {
      const k = [P.trim, P.master, P.eq].join();
      if (k === key) return;
      key = k;
      const st = newSt(SR), cf = coefs();
      for (let i = 0; i < SR * 0.2; i++) step(st, cf, 0);
      st.peaks.fill(0);
      wave = new Float32Array(FN);
      for (let i = 0; i < FN; i++) wave[i] = step(st, cf, 0);
      spec = A.spectrum(wave, FN, { window: 'hann' });
      // THD: 2~10배음의 전력 합 / 기음
      const p = (b) => { let m = -200; for (let j = b - 2; j <= b + 2; j++) m = Math.max(m, spec[j] || -200); return Math.pow(10, m / 10); };
      let hs = 0; for (let h = 2; h <= 10; h++) hs += p(BINS[0] * h);
      stats = { thd: 100 * Math.sqrt(hs / p(BINS[0])), peaks: st.peaks.map((v) => A.linToDb(v)), out: A.linToDb(A.peak(wave)) };
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr || live.eqDb !== P.eq) live = newSt(sr);
        const cf = coefs();
        for (let i = 0; i < n; i++) { const y = step(live, cf); l[i] = y; r[i] = y; }
      },
    });

    const names = () => [GTL.L('소스', 'Source'), GTL.L('트림 후', 'After trim'), GTL.L('EQ 후', 'After EQ'), GTL.L('플러그인 후', 'After plugin'), GTL.L('마스터 후', 'After master')];
    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.34, h2 = (H - pad * 4) * 0.28, h3 = H - pad * 4 - h1 - h2;
        // 단계별 피크 미터 (-36 ~ +6 dBFS)
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        const lo = -36, hi = 6, my = pad + 16, mh = h1 - 34, toY = (db) => my + mh - U.clamp((db - lo) / (hi - lo), 0, 1) * mh;
        D.rect(g, pad, toY(-6), iw, toY(-18) - toY(-6), 'rgba(102,187,106,0.08)');
        D.line(g, pad, toY(0), pad + iw, toY(0), C.bad, 1);
        D.text(g, '0 dBFS', pad + 2, toY(0) - 11, { size: 9, color: C.bad });
        D.text(g, GTL.L('-18 ~ -6 dBFS 권장 범위', '-18 to -6 dBFS sweet spot'), pad + 2, toY(-18) - 11, { size: 9, color: C.good });
        const nm = names(), bw = iw / 5;
        stats.peaks.forEach((db, i) => {
          const x = pad + bw * i + bw * 0.3, w = bw * 0.4, y = toY(db);
          D.rect(g, x, y, w, my + mh - y, db > 0 ? C.bad : db > -6 ? C.warn : C.good);
          D.text(g, db.toFixed(1), x + w / 2, y - 12, { size: 9, align: 'center', color: C.text });
          D.text(g, nm[i], x + w / 2, pad + h1 - 14, { size: 9, align: 'center', color: C.dim });
        });
        D.text(g, GTL.L('단계별 피크 레벨 (dBFS)', 'Peak level per stage (dBFS)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 출력 파형 확대 (3주기)
        const y2 = pad * 2 + h1, per = SR / freqOf(0);
        A.drawWave(g, wave, pad, y2, iw, h2, { count: Math.round(per * 3), color: col, amp: 1.6, label: GTL.L('최종 출력 (3주기)', 'Final output (3 cycles)') });
        // 스펙트럼
        const y3 = y2 + h2 + pad;
        A.drawSpectrum(g, spec, SR, pad, y3, iw, h3, { color: col, minDb: -100, maxDb: 0, fmin: 50, fmax: 2000, label: GTL.L('출력 스펙트럼 (기음 오른쪽 기둥 = 일그러짐 배음)', 'Output spectrum (peaks right of the fundamental = distortion harmonics)') });

        ctx.stat('THD', stats.thd < 0.01 ? '< 0.01 %' : stats.thd.toFixed(2) + ' %');
        ctx.stat(GTL.L('플러그인 입력 피크', 'Plugin input peak'), stats.peaks[2].toFixed(1) + ' dBFS');
        ctx.stat(GTL.L('최종 출력 피크', 'Final output peak'), stats.out.toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
