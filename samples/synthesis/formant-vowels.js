// 포먼트 모음 합성 (소스-필터 모델): 성대 소리(톱니파) → 성도 공명(포먼트 공진기 직렬) → 모음
GTL.register({
  id: 'formant-vowels',
  title: '포먼트 모음 합성 (소스-필터)',
  summary: '사람 목소리는 성대가 만든 버즈(소스)를 입과 목의 공명(필터)이 다듬은 것. 공명 봉우리인 포먼트 F1, F2의 위치만 바꿔도 "아, 에, 이, 오, 우"가 구별됨.',
  views: { a: '소스만 (필터 없음)', b: '소스 + 포먼트 필터' },
  controls: '파라미터 표에서 모음과 음 높이를 바꿈. "모음 자동 순환"을 켜면 아, 에, 이, 오, 우를 부드럽게 오감.',
  info: `
    <p><b>소스-필터 모델(Source-Filter Model)</b>은 음성을 두 부분으로 나눔. 성대 진동(소스)은 배음이 많은 버즈 소리이고, 성도(목, 입, 혀)는 몇 개의 주파수를 키우는 공명 필터. 공명 봉우리를 <b>포먼트(Formant)</b>라고 부름.</p>
    <ul>
      <li><b>F1</b> (300~800Hz): 입을 벌릴수록 높아짐. "아"가 가장 높고 "이", "우"가 낮음.</li>
      <li><b>F2</b> (800~2300Hz): 혀가 앞으로 갈수록 높아짐. "이"가 가장 높고 "우", "오"가 낮음.</li>
      <li><b>F3, F4</b>: 목소리의 개성과 밝기에 영향</li>
    </ul>
    <p>여기서는 Klatt 합성기처럼 2차 공진기를 직렬로 이어 F1~F4를 만듦. 포먼트 값은 Peterson과 Barney(1952)의 성인 남성 평균. 음 높이(소스)를 바꿔도 포먼트(필터)는 그대로라서 같은 모음으로 들림. 음 높이가 아주 높으면 배음 간격이 포먼트보다 넓어져 모음 구별이 어려워짐 (소프라노 고음에서 가사가 잘 안 들리는 이유).</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="80" y="18" text-anchor="middle" class="t-small t-a">${L('소스 (성대)', 'Source (vocal folds)')}</text>
    <line x1="20" y1="120" x2="150" y2="120" class="d-line"/>
    <g class="d-a"><line x1="30" y1="120" x2="30" y2="40"/><line x1="45" y1="120" x2="45" y2="60"/><line x1="60" y1="120" x2="60" y2="72"/><line x1="75" y1="120" x2="75" y2="80"/><line x1="90" y1="120" x2="90" y2="86"/><line x1="105" y1="120" x2="105" y2="90"/><line x1="120" y1="120" x2="120" y2="94"/><line x1="135" y1="120" x2="135" y2="97"/></g>
    <text x="200" y="84" text-anchor="middle">x</text>
    <text x="300" y="18" text-anchor="middle" class="t-small">${L('필터 (성도)', 'Filter (vocal tract)')}</text>
    <line x1="240" y1="120" x2="370" y2="120" class="d-line"/>
    <path d="M240,100 C255,100 258,40 266,40 C274,40 278,95 290,92 C305,88 310,55 318,55 C326,55 330,98 345,98 C355,98 358,75 362,75 C366,75 368,105 370,108" class="d-accent"/>
    <text x="266" y="34" text-anchor="middle" class="t-small">F1</text><text x="318" y="49" text-anchor="middle" class="t-small">F2</text><text x="362" y="69" text-anchor="middle" class="t-small">F3</text>
    <line x1="380" y1="84" x2="408" y2="84" class="d-accent" marker-end="url(#arr)"/>
    <text x="465" y="18" text-anchor="middle" class="t-small t-b">${L('모음', 'Vowel')}</text>
    <line x1="410" y1="120" x2="530" y2="120" class="d-line"/>
    <g class="d-b"><line x1="418" y1="120" x2="418" y2="70"/><line x1="429" y1="120" x2="429" y2="44"/><line x1="440" y1="120" x2="440" y2="80"/><line x1="451" y1="120" x2="451" y2="94"/><line x1="462" y1="120" x2="462" y2="72"/><line x1="473" y1="120" x2="473" y2="78"/><line x1="484" y1="120" x2="484" y2="102"/><line x1="495" y1="120" x2="495" y2="96"/><line x1="506" y1="120" x2="506" y2="108"/></g>
    <text x="270" y="148" text-anchor="middle" class="t-small t-dim">${L('배음 간격 = 음 높이, 봉우리 위치 = 모음', 'harmonic spacing = pitch, peak positions = vowel')}</text>
  </svg>`,
  look: [
    '스펙트럼에서 A의 배음은 고르게 줄어들고, B의 배음은 회색 포먼트 곡선을 따라 봉우리 두세 개가 생김',
    '"소리 켜기"를 누르고 A를 들으면 모음이 없는 버즈, B는 분명한 "아" 소리',
    '"모음 자동 순환"을 켜면 오른쪽 모음 지도에서 점이 아, 에, 이, 오, 우를 돌고, 소리도 그대로 따라 바뀜',
    '음 높이를 C5 이상으로 올리면 배음 간격이 넓어져 포먼트 봉우리 사이에 배음이 거의 없음. 모음이 흐려짐.',
  ],
  refs: [
    { type: 'paper', title: 'Gordon E. Peterson, Harold L. Barney, "Control Methods Used in a Study of the Vowels", Journal of the Acoustical Society of America 24(2)', year: 1952, note: '모음별 포먼트 주파수 측정값' },
    { type: 'paper', title: 'Dennis H. Klatt, "Software for a Cascade/Parallel Formant Synthesizer", Journal of the Acoustical Society of America 67(3)', year: 1980, note: '직렬 포먼트 공진기 식' },
    { type: 'book', title: 'Gunnar Fant, Acoustic Theory of Speech Production', year: 1960, note: '소스-필터 이론' },
    { type: 'book', title: 'Johan Sundberg, The Science of the Singing Voice', year: 1987, note: '노래하는 목소리와 높은 음의 모음 명료도' },
  ],
  params: [
    { key: 'filter', label: '포먼트 필터', type: 'bool', a: false, b: true, default: true, group: '목소리' },
    { key: 'vowel', label: '모음', type: 'select', options: [{ value: 'a', label: '아 (a)' }, { value: 'e', label: '에 (e)' }, { value: 'i', label: '이 (i)' }, { value: 'o', label: '오 (o)' }, { value: 'u', label: '우 (u)' }], default: 'a', shared: true },
    { key: 'cycle', label: '모음 자동 순환', type: 'bool', default: false, shared: true },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 36, max: 84, default: 45, shared: true, help: '45 = A2 (110Hz, 남성 말소리 근처)' },
    { key: 'vib', label: '비브라토', type: 'bool', default: true, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Formant Vowel Synthesis (Source-Filter)',
    summary: 'A voice is a buzz from the vocal folds (source) shaped by resonances of the throat and mouth (filter). Moving only the resonance peaks F1 and F2 (formants) is enough to tell "a, e, i, o, u" apart.',
    views: { a: 'Source only (no filter)', b: 'Source + formant filter' },
    controls: 'Change the vowel and pitch in the parameter table. Turn on "Cycle vowels" to glide through a, e, i, o, u.',
    info: `
    <p>The <b>source-filter model</b> splits a voice into two parts. The vocal folds (source) make a buzz with many harmonics. The vocal tract (throat, mouth, tongue) is a resonant filter that boosts a few frequencies. These resonance peaks are called <b>formants</b>.</p>
    <ul>
      <li><b>F1</b> (300 to 800 Hz): rises as the mouth opens. "a" is highest, "i" and "u" are low.</li>
      <li><b>F2</b> (800 to 2300 Hz): rises as the tongue moves forward. "i" is highest, "u" and "o" are low.</li>
      <li><b>F3, F4</b>: affect the character and brightness of the voice.</li>
    </ul>
    <p>Here 2nd order resonators are chained in series for F1 to F4, as in the Klatt synthesizer. Formant values are adult male averages from Peterson and Barney (1952). Changing the pitch (source) leaves the formants (filter) alone, so you hear the same vowel. At very high pitch the harmonic spacing gets wider than the formants, and vowels become hard to tell apart (this is why sopranos are hard to understand on high notes).</p>`,
    look: [
      'In the spectrum, A\'s harmonics fall off evenly. B\'s harmonics follow the gray formant curve and form two or three peaks.',
      'Press "Sound on" and listen to A. It is a buzz without a vowel. B is a clear "a".',
      'Turn on "Cycle vowels". The dot in the vowel map on the right moves through a, e, i, o, u, and the sound follows.',
      'Raise the pitch above C5. Harmonics spread apart and few fall inside the formant peaks. The vowel blurs.',
    ],
    refs: ['Measured formant frequencies for each vowel.', 'Cascade formant resonator equations.', 'Source-filter theory.', 'The singing voice and vowel clarity on high notes.'],
    params: {
      filter: { label: 'Formant filter', group: 'Voice' },
      vowel: { label: 'Vowel', options: { a: 'a (father)', e: 'e (bed)', i: 'i (beet)', o: 'o (bought)', u: 'u (boot)' } },
      cycle: 'Cycle vowels',
      note: { label: 'Pitch (MIDI)', help: '45 = A2 (110 Hz, near a male speaking voice)' },
      vib: 'Vibrato',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    // Peterson & Barney (1952) 성인 남성 평균 F1, F2, F3 (Hz)
    const VOW = { a: [730, 1090, 2440], e: [530, 1840, 2480], i: [270, 2290, 3010], o: [570, 840, 2410], u: [300, 870, 2240] };
    const ORDER = ['a', 'e', 'i', 'o', 'u'], NAME = { a: ['아', 'a'], e: ['에', 'e'], i: ['이', 'i'], o: ['오', 'o'], u: ['우', 'u'] };
    const BW = [80, 100, 140, 250], F4 = 3400;
    function formantsAt(t) {
      if (!P.cycle) return [...VOW[P.vowel], F4];
      const x = (t / 1.2) % ORDER.length, i = Math.floor(x), k = U.smoothstep(0.55, 1, x - i);
      const a = VOW[ORDER[i]], b = VOW[ORDER[(i + 1) % ORDER.length]];
      return [U.lerp(a[0], b[0], k), U.lerp(a[1], b[1], k), U.lerp(a[2], b[2], k), F4];
    }
    // Klatt 공진기 계수 (DC 이득 1)
    function reso(f, bw, sr) { const r = Math.exp(-Math.PI * bw / sr), B = 2 * r * Math.cos(TAU * f / sr), Cc = -r * r; return { A: 1 - B - Cc, B, C: Cc }; }
    const resoMag = (c, f, sr) => { const w = TAU * f / sr; const re = 1 - c.B * Math.cos(w) - c.C * Math.cos(2 * w), im = c.B * Math.sin(w) + c.C * Math.sin(2 * w); return c.A / Math.hypot(re, im); };
    const filterDb = (fs, f, sr) => { let m = 1; for (let k = 0; k < 4; k++) m *= resoMag(reso(fs[k], BW[k], sr), f, sr); return A.linToDb(m); };

    const live = { n: 0, ph: 0, st: [[0, 0], [0, 0], [0, 0], [0, 0]], vph: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f0 = A.mtof(P.note);
        let fs = formantsAt(live.n / sr), cs = fs.map((f, k) => reso(f, BW[k], sr));
        for (let i = 0; i < n; i++) {
          if ((i & 63) === 0 && P.cycle) { fs = formantsAt(live.n / sr); cs = fs.map((f, k) => reso(f, BW[k], sr)); }
          live.n++;
          live.vph = (live.vph + 5.2 / sr) % 1;
          const f = f0 * (P.vib ? Math.pow(2, 0.25 / 12 * Math.sin(TAU * live.vph)) : 1), dt = f / sr;
          let x = 2 * live.ph - 1 - A.polyBlep(live.ph, dt);
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          if (P.filter) {
            for (let k = 0; k < 4; k++) { const s = live.st[k], c = cs[k]; const y = c.A * x + c.B * s[0] + c.C * s[1]; s[1] = s[0]; s[0] = y; x = y; }
            x *= 0.2;
          } else x *= 0.9;
          const o = Math.tanh(x) * 0.6; l[i] = o; r[i] = o;
        }
      },
    });

    let visT = 0;
    const SR = 48000;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const t = snd.on ? live.n / (snd.sr || SR) : visT, fs = formantsAt(t), f0 = A.mtof(P.note);
        // 1) 스펙트럼 (선형 0~4kHz): 소스 배음 x 필터
        const mapW = Math.min(W * 0.36, H * 0.75), sw = W - pad * 3 - mapW, sh = H - pad * 2, fmax = 4000;
        D.rect(g, pad, pad, sw, sh, 'rgba(0,0,0,0.35)');
        const fx = (f) => pad + f / fmax * sw, dy = (db) => pad + sh - U.clamp((db + 60) / 66, 0, 1) * sh;
        for (const f of [1000, 2000, 3000]) { D.line(g, fx(f), pad, fx(f), pad + sh, C.grid, 1); D.text(g, f / 1000 + 'k', fx(f) + 2, pad + sh - 12, { size: 9, color: C.dim }); }
        // 포먼트 응답 (정규화: 최대 0dB)
        let mx = -999; const resp = [];
        for (let i = 0; i <= 200; i++) { const d = filterDb(fs, Math.max(20, i / 200 * fmax), SR); resp.push(d); mx = Math.max(mx, d); }
        g.beginPath();
        resp.forEach((d, i) => { const px = pad + i / 200 * sw, py = dy(d - mx); i ? g.lineTo(px, py) : g.moveTo(px, py); });
        g.strokeStyle = P.filter ? 'rgba(200,210,230,0.6)' : 'rgba(200,210,230,0.2)'; g.lineWidth = 1.5; g.stroke();
        for (let h = 1; h * f0 < fmax; h++) {
          const f = h * f0, db = 20 * Math.log10(1 / h) + (P.filter ? filterDb(fs, f, SR) - mx : 0);
          D.line(g, fx(f), pad + sh, fx(f), dy(db), col, Math.max(1, Math.min(3, sw / (fmax / f0) * 0.4)));
        }
        fs.slice(0, 3).forEach((f, k) => D.text(g, 'F' + (k + 1), fx(f), pad + 16, { size: 10, color: P.filter ? C.text : C.dim, align: 'center' }));
        D.text(g, Lx('스펙트럼 0~4kHz (회색 = 포먼트 필터 응답)', 'Spectrum 0 to 4 kHz (gray = formant filter response)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 2) 모음 지도 (가로 F2 반대 방향, 세로 F1)
        const mx0 = pad * 2 + sw, my0 = pad, mw = mapW, mh = sh;
        D.rect(g, mx0, my0, mw, mh, 'rgba(0,0,0,0.35)');
        const vx = (f2) => mx0 + mw - (f2 - 700) / (2500 - 700) * (mw - 20) - 10, vy = (f1) => my0 + 22 + (f1 - 200) / (800 - 200) * (mh - 40);
        for (const v of ORDER) { const [f1, f2] = VOW[v]; D.circle(g, vx(f2), vy(f1), 4, null, C.dim, 1.5); D.text(g, Lx(NAME[v][0], NAME[v][1]), vx(f2) + 7, vy(f1) - 6, { size: 11, color: C.dim }); }
        D.circle(g, vx(fs[1]), vy(fs[0]), 6, P.filter ? col : 'rgba(200,210,230,0.25)');
        D.text(g, Lx('모음 지도 (F2 ←, F1 ↓)', 'Vowel map (F2 ←, F1 ↓)'), mx0 + 4, my0 + 3, { size: 10, color: C.dim });
        ctx.stat('F1, F2, F3', fs.slice(0, 3).map((f) => f.toFixed(0)).join(', ') + ' Hz');
        ctx.stat(Lx('기본 주파수', 'Fundamental'), f0.toFixed(1) + ' Hz');
        ctx.stat(Lx('F1 대역 안 배음 수', 'Harmonics inside F1 band'), Math.max(0, Math.floor((fs[0] + 150) / f0) - Math.ceil((fs[0] - 150) / f0) + 1));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
