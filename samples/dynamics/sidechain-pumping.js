// 사이드체인 컴프레션: 킥이 칠 때마다 패드와 베이스를 눌러 자리를 비켜 줌 (EDM 펌핑)
GTL.register({
  id: 'sidechain-pumping',
  title: '사이드체인 펌핑 (킥 덕킹)',
  summary: '사이드체인 컴프레서는 다른 트랙(킥)의 레벨을 보고 이 트랙(패드, 베이스)을 줄임. A는 킥과 패드가 같은 순간에 겹쳐 킥이 묻힘. B는 킥이 칠 때마다 패드가 순간 내려갔다 올라와 킥이 또렷하고 박자에 맞춰 출렁이는 펌핑이 생김.',
  views: { a: '사이드체인 없음', b: '킥 사이드체인' },
  controls: '파라미터 표에서 깊이, 릴리스, 템포를 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p>일반 컴프레서는 자기 입력의 레벨을 보고 자기를 줄임. <b>사이드체인(Sidechain)</b> 컴프레서는 검출기 입력을 다른 신호로 바꿈. 킥을 검출기에 넣고 패드, 베이스 버스를 압축하면 킥이 칠 때만 음악이 내려감.</p>
    <p>킥과 베이스는 같은 저음 대역(40~120 Hz)을 차지해서 서로를 가림(마스킹). 사이드체인으로 킥 순간만 비켜 주면 전체 음량을 줄이지 않고도 킥이 또렷해짐.</p>
    <ul>
      <li><b>릴리스</b>를 박자 길이에 맞추면 패드가 "후웁" 하고 부풀어 오르는 리듬이 생김. 하우스, EDM의 대표 소리.</li>
      <li>릴리스가 박자보다 길면 다음 킥 전에 회복하지 못해 패드가 계속 작아짐</li>
      <li>요즘은 컴프레서 대신 박자에 맞춘 볼륨 곡선(LFO, 엔벨로프)으로 같은 효과를 내기도 함. 킥 소리가 바뀌어도 모양이 일정함.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="20" width="90" height="28" class="f-dim"/><text x="55" y="38" text-anchor="middle" class="t-small">${L('패드, 베이스', 'Pad, bass')}</text>
    <rect x="200" y="20" width="110" height="28" class="f-dim"/><text x="255" y="38" text-anchor="middle" class="t-small">${L('컴프레서', 'Compressor')}</text>
    <rect x="420" y="20" width="100" height="28" class="f-dim"/><text x="470" y="38" text-anchor="middle" class="t-small">${L('믹스', 'Mix')}</text>
    <rect x="10" y="74" width="90" height="28" class="f-dim"/><text x="55" y="92" text-anchor="middle" class="t-small">${L('킥', 'Kick')}</text>
    <path d="M100,34 L198,34" class="d-accent" marker-end="url(#arr)"/><path d="M310,34 L418,34" class="d-accent" marker-end="url(#arr)"/>
    <path d="M100,88 L255,88 L255,50" class="d-accent" marker-end="url(#arr)"/><text x="262" y="78" class="t-small">${L('사이드체인 (검출기 입력)', 'Sidechain (detector input)')}</text>
    <path d="M100,88 L470,88 L470,50" class="d-accent" marker-end="url(#arr)"/>
    <path d="M20,165 L40,165 L42,128 L120,128 L122,165 L140,165 L142,128 L220,128" class="d-dim"/>
    <text x="230" y="134" class="t-small t-dim">${L('킥', 'kick')}</text>
    <path d="M280,130 L300,130 L302,165 Q330,130 380,130 L400,130 L402,165 Q430,130 480,130" class="d-b"/>
    <text x="488" y="134" class="t-small t-b">${L('패드 게인', 'pad gain')}</text>
  </svg>`,
  look: [
    '가운데 그래프에서 B의 패드 게인은 킥마다 아래로 꺾였다가 다음 킥 전에 돌아옴. A는 평평함.',
    '"킥 순간의 킥 대 음악 비율"을 비교하면 B가 A보다 몇 dB 큼',
    'B의 릴리스를 600 ms로 늘리면 다음 킥 전에 회복하지 못해 펌핑이 약해지고 패드가 계속 작아짐',
    '소리를 켜고 B를 들으면 패드가 박자마다 "후웁" 하고 부풀어 오름',
  ],
  refs: [
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '사이드체인으로 킥과 베이스를 나누는 방법' },
    { type: 'paper', title: 'Giannoulis, Massberg, Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '검출기와 게인 계산 구조 (사이드체인은 검출기 입력만 바꿈)' },
    { type: 'book', title: 'Rick Snoman, Dance Music Manual, 3rd ed.', year: 2014, note: '댄스 음악의 사이드체인 펌핑' },
    { type: 'engine', title: 'MDN - DynamicsCompressorNode', url: 'https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode', note: 'Web Audio 컴프레서 (사이드체인 입력은 없음)' },
  ],
  params: [
    { key: 'sc', label: '사이드체인', type: 'bool', default: true, a: false, b: true, group: '사이드체인' },
    { key: 'depth', label: '최대 깊이 (dB)', type: 'range', min: 0, max: 30, step: 1, default: 14, when: (p) => p.sc },
    { key: 'release', label: '릴리스 (ms)', type: 'range', min: 20, max: 800, step: 5, default: 180, when: (p) => p.sc },
    { key: 'bpm', label: '템포 (BPM)', type: 'range', min: 90, max: 150, step: 1, default: 124, shared: true, group: '장면' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Sidechain Pumping (Kick Ducking)',
    summary: 'A sidechain compressor reduces this track (pad, bass) based on the level of another track (the kick). In A the kick and pad overlap at the same moment and the kick gets lost. In B the pad dips on every kick and comes back, so the kick is clear and the music pumps with the beat.',
    views: { a: 'No sidechain', b: 'Kick sidechain' },
    controls: 'Change depth, release and tempo in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>A normal compressor reduces itself based on its own input level. A <b>sidechain</b> compressor uses a different signal for its detector. Put the kick into the detector and compress the pad and bass bus, and the music goes down only when the kick hits.</p>
    <p>Kick and bass share the same low range (40 to 120 Hz) and hide each other (masking). If the music steps aside only at the kick, the kick gets clear without lowering the overall level.</p>
    <ul>
      <li>Match the <b>release</b> to the beat and the pad swells back in a rhythmic "whoomp". This is the classic house and EDM sound.</li>
      <li>If the release is longer than a beat, the pad cannot recover before the next kick and stays quieter.</li>
      <li>Today many producers use a volume curve synced to the tempo (LFO, envelope) instead of a compressor. The shape stays the same even if the kick sound changes.</li>
    </ul>`,
    look: [
      'In the middle graph, B\'s pad gain dips on every kick and comes back before the next one. A stays flat.',
      'Compare "Kick to music ratio at the kick". B is several dB higher than A.',
      'Raise B\'s release to 600 ms. It cannot recover before the next kick, so the pumping weakens and the pad stays quieter.',
      'Turn on sound and listen to B. The pad swells back on every beat.',
    ],
    refs: ['Separating kick and bass with sidechain.', 'Detector and gain computer structure (a sidechain only changes the detector input).', 'Sidechain pumping in dance music.', 'Web Audio compressor (it has no sidechain input).'],
    params: {
      sc: { label: 'Sidechain', group: 'Sidechain' },
      depth: 'Max depth (dB)',
      release: 'Release (ms)',
      bpm: { label: 'Tempo (BPM)', group: 'Scene' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 12000;

    // 킥과 음악(패드 화음 + 베이스)을 따로 만듦. 2마디
    function makeSource(sr, bpm) {
      const beat = 60 / bpm, n = Math.round(beat * 8 * sr), kick = new Float32Array(n), mus = new Float32Array(n);
      for (let q = 0; q < 8; q++) {
        const i0 = Math.round(q * beat * sr);
        for (let i = 0; i < 0.35 * sr && i0 + i < n; i++) { const t = i / sr; kick[i0 + i] += 0.55 * Math.sin(2 * Math.PI * (50 * t + 150 * (1 - Math.exp(-t * 35)) / 35)) * Math.exp(-t * 8); }
      }
      const chord = [[57, 60, 64, 67], [53, 57, 60, 64]], bass = [33, 29];
      const lp = A.biquad('lowpass', 2200, 0.7, 0, sr);
      for (let i = 0; i < n; i++) {
        const t = i / sr, bar = Math.min(1, Math.floor(t / (beat * 4)));
        let v = 0;
        for (const m of chord[bar]) for (const d of [-0.1, 0.1]) { const f = A.mtof(m + d); v += 2 * ((f * t) % 1) - 1; }
        const fb = A.mtof(bass[bar]);
        mus[i] = lp.process(v * 0.035) + 0.18 * Math.sin(2 * Math.PI * fb * t);
      }
      return { kick, mus, n, beat };
    }
    // 사이드체인: 킥의 피크 레벨 → 하드 니 컴프레서 (스레숄드 -30 dB, 레이쇼 8), 최대 깊이 제한
    function coefs(sr) { return { on: P.sc, depth: P.depth, aC: Math.exp(-1 / (0.002 * sr)), rC: Math.exp(-1 / (P.release * 0.001 * sr)) }; }
    function step(st, kx, k) {
      if (!k.on) { st.gr = 0; return 1; }
      const lev = A.linToDb(kx), want = Math.min(k.depth, lev > -30 ? (lev + 30) * (1 - 1 / 8) : 0);
      st.gr = want > st.gr ? k.aC * st.gr + (1 - k.aC) * want : k.rC * st.gr + (1 - k.rC) * want;
      return A.dbToLin(-st.gr);
    }

    let S = null, sKey = -1;
    function source() { if (sKey !== P.bpm) { S = makeSource(SR, P.bpm); sKey = P.bpm; } return S; }
    const COLS = 400;
    let key = '', gArr, kD, mD, stats;
    function analyze() {
      const s = source(), k = [P.sc, P.depth, P.release, P.bpm].join();
      if (k === key) return;
      key = k;
      const st = { gr: 0 }, cf = coefs(SR), N = s.n;
      for (let i = 0; i < N; i++) step(st, s.kick[i], cf);
      gArr = new Float32Array(COLS).fill(1); kD = new Float32Array(COLS); mD = new Float32Array(COLS);
      let rk = 0, rm = 0, cnt = 0;
      for (let i = 0; i < N; i++) {
        const gn = step(st, s.kick[i], cf), m = s.mus[i] * gn, c = Math.floor(i * COLS / N);
        gArr[c] = Math.min(gArr[c], gn); kD[c] = Math.max(kD[c], Math.abs(s.kick[i])); mD[c] = Math.max(mD[c], Math.abs(m));
        // 킥 시작 후 80 ms 안에서 킥과 음악의 에너지 비율
        if ((i / SR) % s.beat < 0.08) { rk += s.kick[i] * s.kick[i]; rm += m * m; cnt++; }
      }
      let gmin = 1; for (let c = 0; c < COLS; c++) gmin = Math.min(gmin, gArr[c]);
      stats = { ratio: 10 * Math.log10(rk / Math.max(1e-12, rm)), depth: -A.linToDb(gmin), recover: -A.linToDb(gArr[Math.floor(COLS / 8) - 2]) };
    }

    let live = { gr: 0 }, liveSrc = null, liveSr = 0, liveBpm = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr || liveBpm !== P.bpm) { liveSrc = makeSource(sr, P.bpm); liveSr = sr; liveBpm = P.bpm; pos = 0; }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const gn = step(live, liveSrc.kick[pos], cf), y = liveSrc.kick[pos] + liveSrc.mus[pos] * gn;
          pos = (pos + 1) % liveSrc.n;
          l[i] = y; r[i] = y;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2, cw = iw / COLS;
        const h1 = (H - pad * 4) * 0.36, h2 = (H - pad * 4) * 0.34, h3 = H - pad * 4 - h1 - h2;
        // 킥(회색)과 음악(색) 크기
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        const mid = pad + h1 / 2;
        for (let c = 0; c < COLS; c++) {
          const px = pad + c * cw;
          D.rect(g, px, mid - mD[c] * h1 * 0.8, Math.max(1, cw), mD[c] * h1 * 1.6, col);
          D.rect(g, px, mid - kD[c] * h1 * 0.8, Math.max(1, cw), kD[c] * h1 * 1.6, 'rgba(230,230,240,0.35)');
        }
        D.text(g, GTL.L('흰색 = 킥, 색 = 패드와 베이스 (2마디)', 'White = kick, color = pad and bass (2 bars)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 게인 곡선
        const y2 = pad * 2 + h1;
        D.rect(g, pad, y2, iw, h2, 'rgba(0,0,0,0.35)');
        for (let db = 6; db < 30; db += 6) { const py = y2 + db / 30 * h2; D.line(g, pad, py, pad + iw, py, C.grid); D.text(g, '-' + db, pad + 2, py - 10, { size: 9, color: C.dim }); }
        g.beginPath();
        for (let c = 0; c < COLS; c++) { const py = y2 + U.clamp(-A.linToDb(gArr[c]) / 30, 0, 1) * h2; c ? g.lineTo(pad + c * cw, py) : g.moveTo(pad + c * cw, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, GTL.L('패드, 베이스에 걸린 게인 (dB)', 'Gain on pad and bass (dB)'), pad + 30, y2 + 3, { size: 10, color: C.dim });
        // 박자 눈금
        const s = source();
        for (let q = 0; q <= 8; q++) { const px = pad + iw * q / 8; D.line(g, px, pad, px, y2 + h2, q % 4 === 0 ? C.dim : C.grid); }
        // 한 박 확대: 게인 모양과 릴리스
        const y3 = y2 + h2 + pad;
        D.rect(g, pad, y3, iw, h3, 'rgba(0,0,0,0.35)');
        const per = Math.floor(COLS / 8);
        g.beginPath();
        for (let c = 0; c < per; c++) { const px = pad + iw * c / (per - 1), py = y3 + U.clamp(-A.linToDb(gArr[per + c]) / 30, 0, 1) * h3; c ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, GTL.L(`한 박 확대 (${(s.beat * 1000).toFixed(0)} ms)`, `One beat zoom (${(s.beat * 1000).toFixed(0)} ms)`), pad + 4, y3 + 3, { size: 10, color: C.dim });
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.n; D.line(g, px, pad, px, y2 + h2, C.text); }

        ctx.stat(GTL.L('킥 순간의 킥 대 음악 비율', 'Kick to music ratio at the kick'), stats.ratio.toFixed(1) + ' dB');
        ctx.stat(GTL.L('최대 덕킹 깊이', 'Max ducking depth'), stats.depth.toFixed(1) + ' dB');
        ctx.stat(GTL.L('다음 킥 직전 남은 감소량', 'Reduction left before next kick'), stats.recover.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
