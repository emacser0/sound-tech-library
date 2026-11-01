// 필터 키트래킹: 컷오프 고정 vs 연주하는 음 높이를 따라 컷오프 이동. 음역에 따른 음색 차이
GTL.register({
  id: 'filter-keytracking',
  title: '필터 키트래킹',
  summary: '컷오프를 고정하면 낮은 음은 배음이 많이 통과해 밝고, 높은 음은 기음만 남아 먹먹해짐. 키트래킹은 음 높이만큼 컷오프를 같이 올려서 모든 음역에서 같은 수의 배음이 통과하게 함.',
  views: { a: '키트래킹 0% (고정)', b: '키트래킹 100%' },
  info: `
    <p>감산 신스의 필터는 보통 컷오프가 Hz로 고정. 그런데 음이 한 옥타브 오르면 모든 배음의 주파수가 2배가 됨. 컷오프 아래에 남는 배음 수가 절반으로 줄어서, 높은 음일수록 어둡고 작게 들림.</p>
    <p><b>키트래킹(Key Tracking, Keyboard Follow)</b>은 연주하는 음 높이를 컷오프에 더함</p>
    <ul>
      <li>100%: 한 옥타브 오르면 컷오프도 한 옥타브(2배). 컷오프 아래 배음 수가 항상 같아서 음색이 일정.</li>
      <li>50%: 한 옥타브에 반 옥타브만 올림. 높은 음이 조금 어두워지는 자연스러운 악기 느낌.</li>
      <li>계산: <code>fc = 기준 컷오프 x 2^((음 - 60) / 12 x 트래킹)</code>. 60(C4)에서 기준 컷오프와 같음.</li>
    </ul>
    <p>공진이 높은 필터에서 100% 키트래킹을 쓰면 공진 봉우리가 늘 같은 배음에 있어서 음정감이 있는 소리가 남</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="18" class="t-small t-a">${L('고정 컷오프', 'Fixed cutoff')}</text>
    <line x1="20" y1="120" x2="250" y2="120" class="d-dim"/>
    <line x1="150" y1="28" x2="150" y2="125" class="d-a" stroke-dasharray="4 3"/>
    <line x1="40" y1="120" x2="40" y2="50" class="d-line"/><line x1="70" y1="120" x2="70" y2="70" class="d-line"/><line x1="100" y1="120" x2="100" y2="80" class="d-line"/><line x1="130" y1="120" x2="130" y2="86" class="d-line"/>
    <text x="85" y="140" text-anchor="middle" class="t-small t-dim">${L('낮은 음: 배음 4개 통과', 'low note: 4 harmonics pass')}</text>
    <line x1="110" y1="120" x2="110" y2="60" class="d-line"/><line x1="200" y1="120" x2="200" y2="100" class="d-dim"/>
    <text x="180" y="156" text-anchor="middle" class="t-small t-a">${L('높은 음: 기음 1개만 통과', 'high note: only the fundamental passes')}</text>
    <text x="290" y="18" class="t-small t-b">${L('키트래킹 100%', 'Key tracking 100%')}</text>
    <line x1="290" y1="120" x2="520" y2="120" class="d-dim"/>
    <line x1="380" y1="28" x2="380" y2="125" class="d-b" stroke-dasharray="4 3"/>
    <line x1="470" y1="28" x2="470" y2="125" class="d-b" stroke-dasharray="4 3"/>
    <path d="M384,40 L466,40" class="d-b"/><text x="425" y="34" text-anchor="middle" class="t-small t-b">${L('음과 같이 이동', 'moves with the note')}</text>
    <text x="405" y="146" text-anchor="middle" class="t-small t-dim">${L('어느 음이든 통과하는 배음 수가 같음', 'the same number of harmonics passes for any note')}</text>
  </svg>`,
  look: [
    '"통과 배음 수" 막대를 비교하면 A는 낮은 음에서 길고 높은 음에서 1~2개로 줄어듦. B는 모든 음에서 같음.',
    '"음역별 음량 차이" 측정값을 비교하면 A는 약 3dB, B는 0dB (음량은 작은 차이, 음색은 큰 차이)',
    '"소리 켜기" 후 A를 들으면 높은 음이 플루트처럼 둥글고 낮은 음은 날카로움. B는 모든 음이 같은 음색.',
    '키트래킹을 50%로 두면 두 극단의 중간. 실제 악기처럼 높은 음이 조금 어두워짐.',
  ],
  refs: [
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '감산 합성과 필터 제어' },
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '신스 필터의 키트래킹 구현' },
    { type: 'book', title: 'Vadim Zavalishin, The Art of VA Filter Design', year: 2018, note: '이 샘플의 TPT SVF 로우패스' },
    { type: 'article', title: 'Gordon Reid, "Synth Secrets" series, Sound On Sound', year: 1999, note: '필터, 키보드 트래킹의 쓰임' },
  ],
  params: [
    { key: 'track', label: '키트래킹 (%)', type: 'range', min: 0, max: 150, step: 5, a: 0, b: 100, group: '필터' },
    { key: 'fc', label: '기준 컷오프 (C4에서, Hz)', type: 'range', min: 200, max: 6000, step: 10, default: 900, shared: true },
    { key: 'q', label: 'Q', type: 'range', min: 0.5, max: 10, step: 0.1, default: 1.5, shared: true },
    { key: 'tempo', label: '템포 (BPM)', type: 'range', min: 60, max: 200, step: 1, default: 110, shared: true, group: '프레이즈' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Filter Key Tracking',
    summary: 'With a fixed cutoff, low notes pass many harmonics and sound bright, while high notes keep only the fundamental and sound dull. Key tracking raises the cutoff with the pitch, so the same number of harmonics passes in every range.',
    views: { a: 'Key tracking 0% (fixed)', b: 'Key tracking 100%' },
    info: `
    <p>A subtractive synth filter usually has its cutoff fixed in Hz. But when a note goes up one octave, every harmonic doubles in frequency. Half as many harmonics stay below the cutoff, so higher notes sound darker and quieter.</p>
    <p><b>Key tracking</b> (keyboard follow) adds the played pitch to the cutoff.</p>
    <ul>
      <li>100%: one octave up moves the cutoff one octave (2x). The same number of harmonics stays below the cutoff, so the tone is even.</li>
      <li>50%: half an octave per octave. Higher notes get a little darker, like a natural instrument.</li>
      <li>Math: <code>fc = base cutoff x 2^((note - 60) / 12 x tracking)</code>. At 60 (C4) it equals the base cutoff.</li>
    </ul>
    <p>With a high resonance and 100% tracking, the resonant peak always sits on the same harmonic, which gives a pitched sound.</p>`,
    look: [
      'Compare the "Harmonics passed" bars. A is long on low notes and drops to 1 or 2 on high notes. B is the same on every note.',
      'Compare the "Level change across range" stat. A is about 3 dB and B is 0 dB (a small level change, but a big tone change).',
      'Press "Sound on" and listen to A. High notes sound round like a flute and low notes sound sharp. In B every note has the same tone.',
      'Set key tracking to 50%. It lands between the two. High notes get a little darker, like a real instrument.',
    ],
    refs: ['Subtractive synthesis and filter control.', 'Key tracking in synth filters.', 'The TPT SVF lowpass used here.', 'How filters and keyboard tracking are used.'],
    params: {
      track: { label: 'Key tracking (%)', group: 'Filter' },
      fc: 'Base cutoff (at C4, Hz)',
      q: 'Q',
      tempo: { label: 'Tempo (BPM)', group: 'Phrase' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000;
    // 3옥타브 넘게 오르내리는 아르페지오 (C 마이너)
    const SEQ = [36, 43, 48, 51, 55, 60, 63, 67, 72, 75, 79, 84, 79, 72, 63, 48];
    const cutoffFor = (m) => U.clamp(P.fc * Math.pow(2, (m - 60) / 12 * P.track / 100), 20, 20000);
    // TPT SVF 로우패스 크기 응답 = 같은 Q의 아날로그 2차 로우패스 (주파수 워핑 무시 근사)
    const svfMag = (f, fc) => { const x = f / fc; return 1 / Math.sqrt((1 - x * x) ** 2 + (x / P.q) ** 2); };
    // 톱니파 배음(1/h)이 필터를 지난 뒤의 정보
    function noteInfo(m) {
      const f0 = A.mtof(m), fc = cutoffFor(m);
      let pass = 0, e = 0;
      for (let h = 1; h * f0 < SR / 2; h++) { const mg = svfMag(h * f0, fc); if (mg > Math.SQRT1_2) pass++; e += (mg / h) ** 2; }
      return { pass, db: 10 * Math.log10(e) };
    }

    const live = { ph: 0, n: 0, ic1: 0, ic2: 0, step: 0, fc: cutoffFor(SEQ[0]) };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const stepLen = Math.round(sr * 60 / P.tempo / 2), k = A.onePoleCoef(200, sr);
        for (let i = 0; i < n; i++) {
          const s = Math.floor(live.n / stepLen), pos = (live.n % stepLen) / stepLen, m = SEQ[s % SEQ.length];
          live.step = s % SEQ.length; live.n++;
          live.fc += (cutoffFor(m) - live.fc) * k;
          const dt = A.mtof(m) / sr, x = 2 * live.ph - 1 - A.polyBlep(live.ph, dt);
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          const g = Math.tan(Math.PI * Math.min(live.fc, sr * 0.45) / sr), kq = 1 / P.q;
          const a1 = 1 / (1 + g * (g + kq)), a2 = g * a1, a3 = g * a2;
          const v3 = x - live.ic2, v1 = a1 * live.ic1 + a2 * v3, v2 = live.ic2 + a2 * live.ic1 + a3 * v3;
          live.ic1 = 2 * v1 - live.ic1; live.ic2 = 2 * v2 - live.ic2;
          const env = Math.min(1, pos * 60) * Math.max(0, 1 - pos * 0.9);
          const y = v2 * env * 0.4;
          l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', infos = null, spread = 0;
    function analyze() {
      const k = [P.track, P.fc, P.q].join();
      if (k === key) return;
      key = k;
      infos = SEQ.map(noteInfo);
      let lo = Infinity, hi = -Infinity;
      for (const s of infos) { lo = Math.min(lo, s.db); hi = Math.max(hi, s.db); }
      spread = hi - lo;
    }
    let curStep = 0;

    return {
      update() {
        snd.update();
        curStep = snd.on ? live.step : Math.floor(ctx.time * P.tempo / 30) % SEQ.length;
      },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8, rw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.42, h2 = (H - pad * 4) * 0.36, h3 = H - pad * 4 - h1 - h2;
        const m = SEQ[curStep], f0 = A.mtof(m), fc = cutoffFor(m);
        // 응답 + 현재 음의 배음
        A.drawResponse(g, (f) => A.linToDb(svfMag(f, fc)), pad, pad, rw, h1, { color: col, minDb: -48, maxDb: 18, label: L('필터 응답과 현재 음의 배음 (막대)', 'Filter response and harmonics of the current note (bars)') });
        for (let h = 1; h * f0 < 20000 && h < 200; h++) {
          const db = A.linToDb(svfMag(h * f0, fc) / h), px = A.freqX(h * f0, pad, rw, 20, 20000);
          const top = pad + h1 * (1 - U.clamp((db + 48) / 66, 0, 1));
          D.line(g, px, pad + h1, px, top, svfMag(h * f0, fc) > Math.SQRT1_2 ? C.good : 'rgba(200,200,200,0.35)', 2);
        }
        // 음마다 통과 배음 수 막대
        const y2 = pad * 2 + h1, bw = rw / SEQ.length, maxPass = Math.max(4, ...infos.map((s) => s.pass));
        D.rect(g, pad, y2, rw, h2, 'rgba(0,0,0,0.35)');
        infos.forEach((s, i) => {
          const hh = (h2 - 18) * s.pass / maxPass;
          D.rect(g, pad + i * bw + 2, y2 + h2 - hh, bw - 4, hh, i === curStep ? C.warn : col);
          D.text(g, String(s.pass), pad + i * bw + bw / 2, y2 + h2 - hh - 11, { size: 9, align: 'center', color: C.dim });
        });
        D.text(g, L('통과 배음 수 (컷오프 -3dB 안쪽)', 'Harmonics passed (inside -3 dB)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 건반
        const y3 = y2 + h2 + pad;
        A.drawKeyboard(g, pad, y3, rw, h3, 36, 84, { [m]: col });
        ctx.stat(L('현재 음', 'Current note'), `${A.noteName(m)} (${f0.toFixed(0)} Hz)`);
        ctx.stat(L('컷오프', 'Cutoff'), Math.round(fc) + ' Hz');
        ctx.stat(L('음역별 음량 차이', 'Level change across range'), spread.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
