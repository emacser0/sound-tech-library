// 포먼트 필터: 밴드패스 1개 vs 병렬 밴드패스 3개(F1, F2, F3)로 톱니파에서 모음 만들기
GTL.register({
  id: 'formant-filter',
  title: '포먼트 필터 (모음 만들기)',
  summary: '모음은 성대 소리의 배음 중 몇몇 대역(포먼트)이 강조되어 구별됨. 밴드패스 하나로는 "와우" 같은 소리만 나지만, F1, F2, F3 세 개를 병렬로 걸면 "아, 에, 이, 오, 우"가 구별되어 들림.',
  views: { a: '밴드패스 1개 (F1만)', b: '포먼트 3개 (F1, F2, F3)' },
  info: `
    <p>사람 목소리는 성대가 만드는 배음 많은 소리(톱니파와 비슷)가 목, 입, 혀가 만든 관(성도)을 지나며 걸러진 소리. 성도의 공진 대역을 <b>포먼트(Formant)</b>라고 함. 낮은 쪽부터 F1, F2, F3.</p>
    <ul>
      <li>F1은 입을 벌린 정도(아: 높음, 이, 우: 낮음), F2는 혀의 앞뒤 위치(이: 높음, 우, 오: 낮음)와 관련</li>
      <li>모음은 F1, F2 조합으로 거의 구별됨. F3는 음색과 화자의 특징에 기여.</li>
      <li><b>포먼트 필터</b>: 밴드패스 여러 개를 병렬로 두고 모음마다 중심 주파수와 게인을 바꿈. 토크박스, 보코더 없는 "말하는 신스"의 기본.</li>
      <li>음 높이를 바꿔도 포먼트 위치는 그대로라 같은 모음으로 들림</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="10" y="44" class="t-small">${L('톱니파', 'Saw')}</text>
    <line x1="56" y1="40" x2="80" y2="40" class="d-line"/>
    <path d="M80,40 L80,16 L110,16 M80,40 L110,40 M80,40 L80,64 L110,64" class="d-line"/>
    <rect x="110" y="6" width="90" height="20" class="f-dim"/><text x="155" y="20" text-anchor="middle" class="t-small">BP F1</text>
    <rect x="110" y="30" width="90" height="20" class="f-dim"/><text x="155" y="44" text-anchor="middle" class="t-small">BP F2</text>
    <rect x="110" y="54" width="90" height="20" class="f-dim"/><text x="155" y="68" text-anchor="middle" class="t-small">BP F3</text>
    <path d="M200,16 L240,16 L240,30 M200,40 L231,40 M200,64 L240,64 L240,50" class="d-line"/>
    <circle cx="240" cy="40" r="9" class="f-dim"/><text x="240" y="44" text-anchor="middle">+</text>
    <line x1="249" y1="40" x2="280" y2="40" class="d-line" marker-end="url(#arr)"/><text x="286" y="44" class="t-small">${L('모음', 'vowel')}</text>
    <line x1="20" y1="150" x2="520" y2="150" class="d-dim"/>
    <path d="M20,140 Q80,138 110,95 Q125,135 160,140 Q200,138 230,110 Q250,138 300,142 Q350,140 380,120 Q400,144 520,148" class="d-b"/>
    <text x="110" y="88" text-anchor="middle" class="t-small t-b">F1</text><text x="230" y="103" text-anchor="middle" class="t-small t-b">F2</text><text x="380" y="113" text-anchor="middle" class="t-small t-b">F3</text>
    <text x="460" y="128" text-anchor="middle" class="t-small t-dim">${L('모음 "아"의 응답', 'response of vowel "a"')}</text>
  </svg>`,
  look: [
    '모음을 "이"로 바꾸면 B의 응답에서 F1이 낮아지고 F2가 2kHz 위로 멀리 떨어짐. A는 낮은 봉우리 하나뿐.',
    '"소리 켜기" 후 "모음 자동 변화"를 켜고 B를 들으면 "아, 에, 이, 오, 우"가 구별됨. A는 와우 소리처럼 들림.',
    '모음 지도(F1-F2 평면)에서 점이 모음마다 다른 위치로 이동함',
    '음 높이를 바꿔도 B의 응답 봉우리는 그대로라 같은 모음으로 들림. 배음 막대만 촘촘해지거나 성겨짐.',
  ],
  refs: [
    { type: 'paper', title: 'Gordon E. Peterson, Harold L. Barney, "Control Methods Used in a Study of the Vowels", JASA', year: 1952, note: '영어 모음의 F1, F2, F3 측정값 (이 샘플의 표 근사)' },
    { type: 'paper', title: 'Dennis H. Klatt, "Software for a Cascade/Parallel Formant Synthesizer", JASA', year: 1980, note: '병렬, 직렬 포먼트 합성기' },
    { type: 'book', title: 'Gunnar Fant, Acoustic Theory of Speech Production', year: 1960, note: '음원-필터 모델' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '포먼트 합성과 음성 합성' },
  ],
  params: [
    { key: 'bands', label: '필터 구성', type: 'select', group: '필터', options: [{ value: 1, label: '밴드패스 1개 (F1)' }, { value: 3, label: '포먼트 3개 (F1, F2, F3)' }], a: 1, b: 3 },
    { key: 'vowel', label: '모음', type: 'select', options: [{ value: 'a', label: '아 (a)' }, { value: 'e', label: '에 (e)' }, { value: 'i', label: '이 (i)' }, { value: 'o', label: '오 (o)' }, { value: 'u', label: '우 (u)' }], default: 'a', shared: true },
    { key: 'auto', label: '모음 자동 변화', type: 'bool', default: false, shared: true, help: '소리에서 0.6초마다 다음 모음으로' },
    { key: 'bw', label: '대역폭 배율', type: 'range', min: 0.5, max: 3, step: 0.1, default: 1, shared: true, help: '클수록 포먼트가 넓고 흐릿함' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 36, max: 72, default: 45, shared: true, group: '음원' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Formant Filter (Making Vowels)',
    summary: 'Vowels differ by which bands of the voice harmonics (formants) are boosted. One bandpass only gives a "wah" sound, but three parallel bands at F1, F2 and F3 make "a, e, i, o, u" clearly different.',
    views: { a: 'One bandpass (F1 only)', b: '3 formants (F1, F2, F3)' },
    info: `
    <p>A human voice is a buzz rich in harmonics from the vocal folds (similar to a saw), filtered by the tube of the throat, mouth and tongue (the vocal tract). The resonant bands of the vocal tract are called <b>formants</b>. From low to high: F1, F2, F3.</p>
    <ul>
      <li>F1 relates to how open the mouth is (a: high, i and u: low). F2 relates to how far forward the tongue is (i: high, u and o: low).</li>
      <li>F1 and F2 together mostly identify the vowel. F3 adds tone color and speaker character.</li>
      <li><b>Formant filter</b>: several bandpass filters in parallel, with center frequency and gain set per vowel. The basis of a "talking synth" without a talk box or vocoder.</li>
      <li>Changing the pitch does not move the formants, so you still hear the same vowel.</li>
    </ul>`,
    look: [
      'Change the vowel to "i". In B, F1 drops and F2 moves far up above 2 kHz. A has only one low peak.',
      'Press "Sound on", turn on "Auto vowel change" and listen to B. You can tell "a, e, i, o, u" apart. A sounds like a wah.',
      'In the vowel map (F1-F2 plane), the dot moves to a different place for each vowel.',
      'Change the pitch. B\'s peaks stay in place, so you hear the same vowel. Only the harmonic bars get denser or sparser.',
    ],
    refs: ['F1, F2, F3 measurements of English vowels (the table here is close to it).', 'Parallel and cascade formant synthesizer.', 'The source-filter model.', 'Formant synthesis and speech synthesis.'],
    params: {
      bands: { label: 'Filter setup', group: 'Filter', options: { 1: 'One bandpass (F1)', 3: '3 formants (F1, F2, F3)' } },
      vowel: { label: 'Vowel', options: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' } },
      auto: { label: 'Auto vowel change', help: 'In the sound, moves to the next vowel every 0.6 s' },
      bw: { label: 'Bandwidth scale', help: 'Larger means wider, blurrier formants' },
      note: { label: 'Pitch (MIDI)', group: 'Source' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, N = 8192;
    // 성인 남성 모음 포먼트 (Hz)와 대역폭, 게인(dB). Peterson & Barney 값을 반올림한 근사
    const VOW = { a: [730, 1090, 2440], e: [530, 1840, 2480], i: [270, 2290, 3010], o: [570, 840, 2410], u: [300, 870, 2240] };
    const ORDER = ['a', 'e', 'i', 'o', 'u'], BW = [80, 90, 120], GAIN = [0, -6, -12];
    const VNAME = { a: () => L('아', 'a'), e: () => L('에', 'e'), i: () => L('이', 'i'), o: () => L('오', 'o'), u: () => L('우', 'u') };
    const design = (fs, sr) => fs.slice(0, +P.bands).map((f, j) => ({ c: A.biquad('bandpass', f, f / (BW[j] * P.bw), 0, sr), g: A.dbToLin(GAIN[j]) }));
    const respDb = (bs, f) => { let re = 0, im = 0; for (const b of bs) { const r = A.biquadResponse(b.c, f, SR); re += b.g * r.mag * Math.cos(r.phase); im += b.g * r.mag * Math.sin(r.phase); } return A.linToDb(Math.hypot(re, im)); };

    const live = { fs: VOW[P.vowel].slice(), bs: null, st: [0, 1, 2].map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 })), ph: 0, t: 0, vib: 0, cur: P.vowel };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(12, sr / 32);
        for (let i = 0; i < n; i++) {
          if ((i & 31) === 0) {
            live.cur = P.auto ? ORDER[Math.floor(live.t / 0.6) % 5] : P.vowel;
            const tgt = VOW[live.cur];
            for (let j = 0; j < 3; j++) live.fs[j] += (tgt[j] - live.fs[j]) * k;
            live.bs = design(live.fs, sr);
          }
          // 비브라토 5Hz, 약 ±20센트
          live.vib += U.TAU * 5 / sr;
          const f0 = A.mtof(P.note) * Math.pow(2, Math.sin(live.vib) * 0.017), dt = f0 / sr;
          const x = 2 * live.ph - 1 - A.polyBlep(live.ph, dt);
          live.ph += dt; if (live.ph >= 1) live.ph -= 1; live.t += 1 / sr;
          let y = 0;
          live.bs.forEach((b, j) => { const s = live.st[j], c = b.c; const v = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2; s.x2 = s.x1; s.x1 = x; s.y2 = s.y1; s.y1 = v; y += v * b.g; });
          y *= 2.2; l[i] = y; r[i] = y;
        }
      },
    });

    let key = '', bs = null, mags = null;
    function analyze() {
      const k = [P.bands, P.vowel, P.bw, P.note].join();
      if (k === key) return;
      key = k;
      bs = design(VOW[P.vowel], SR);
      const run = design(VOW[P.vowel], SR), f0 = A.mtof(P.note), y = new Float32Array(N);
      let ph = 0;
      for (let i = 0; i < N; i++) {
        const x = 2 * ph - 1 - A.polyBlep(ph, f0 / SR); ph += f0 / SR; if (ph >= 1) ph -= 1;
        let s = 0; for (const b of run) s += b.c.process(x) * b.g; y[i] = s;
      }
      mags = A.spectrum(y, N, { window: 'blackman' });
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 8;
        const mapW = Math.min(170, W * 0.3), rw = W - pad * 3 - mapW, h1 = (H - pad * 3) * 0.5, h2 = H - pad * 3 - h1;
        const vow = snd.on ? live.cur : P.vowel;
        A.drawResponse(g, (f) => respDb(bs, f), pad, pad, rw, h1, { color: col, minDb: -48, maxDb: 6, fmin: 50, fmax: 8000, label: L('필터 응답', 'Filter response') });
        VOW[P.vowel].slice(0, +P.bands).forEach((f, j) => { const px = A.freqX(f, pad, rw, 50, 8000); D.text(g, 'F' + (j + 1), px, pad + 16, { size: 10, align: 'center', color: C.warn }); });
        const y2 = pad * 2 + h1;
        A.drawSpectrum(g, mags, SR, pad, y2, rw, h2, { color: col, minDb: -90, maxDb: 0, fmin: 50, fmax: 8000, label: L('출력 스펙트럼 (배음)', 'Output spectrum (harmonics)') });
        // 모음 지도: 가로 F2 (오른쪽이 높음), 세로 F1 (아래가 높음)
        const mx = pad * 2 + rw, my = pad, mh = H - pad * 2;
        D.rect(g, mx, my, mapW, mh, 'rgba(0,0,0,0.35)');
        D.text(g, L('모음 지도 (F2 vs F1)', 'Vowel map (F2 vs F1)'), mx + 4, my + 3, { size: 10, color: C.dim });
        const px = (f2) => mx + 10 + (mapW - 20) * (Math.log(f2 / 700) / Math.log(2500 / 700));
        const py = (f1) => my + 24 + (mh - 40) * ((f1 - 250) / (800 - 250));
        for (const v of ORDER) {
          const [f1, f2] = VOW[v], on = v === vow;
          D.circle(g, px(f2), py(f1), on ? 7 : 4, on ? col : C.dim);
          D.text(g, VNAME[v](), px(f2) + 9, py(f1) - 6, { size: 11, color: on ? C.text : C.dim });
        }
        D.text(g, 'F2 →', mx + mapW - 34, my + mh - 14, { size: 9, color: C.dim });
        D.text(g, 'F1 ↓', mx + 4, my + mh - 14, { size: 9, color: C.dim });
        const fs = snd.on ? live.fs.map(Math.round) : VOW[P.vowel];
        ctx.stat(L('모음', 'Vowel'), VNAME[vow]());
        ctx.stat('F1 / F2 / F3', fs.slice(0, 3).join(' / ') + ' Hz');
        ctx.stat(L('사용 밴드 수', 'Bands used'), P.bands);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
