// 크로마그램과 템플릿 코드 인식: 프레임마다 따로 고르기 vs HMM(비터비)으로 시간 흐름까지 보고 고르기
GTL.register({
  id: 'chromagram-chords',
  title: '크로마그램과 코드 인식',
  summary: '스펙트럼을 12개 음 이름(C, C#, ..., B)으로 접은 크로마그램에 장3화음, 단3화음 템플릿을 맞춰 코드를 찾음. 프레임마다 따로 고르면 멜로디의 경과음 때문에 코드가 깜빡이고, 비터비로 "코드는 잘 안 바뀜"을 반영하면 안정됨.',
  views: { a: '프레임마다 고르기', b: 'HMM 비터비' },
  controls: '파라미터 표에서 인식 방식과 멜로디 크기를 바꿈. "소리 켜기"를 누르면 원곡과 함께 인식된 코드를 사인파 화음으로 들려 줌.',
  info: `
    <p><b>크로마(Chroma)</b>는 옥타브를 무시하고 12개 음 이름별 에너지만 남긴 특징. C3, C4, C5의 에너지는 모두 C 칸에 더해짐. 시간에 따라 늘어놓으면 <b>크로마그램</b>.</p>
    <p><b>템플릿 매칭</b>: 24개 코드(장3화음 12개, 단3화음 12개)마다 구성음 칸이 1인 템플릿을 만들고, 크로마와의 코사인 유사도가 가장 큰 코드를 고름</p>
    <ul>
      <li><b>프레임마다 고르기</b>: 가장 단순. 멜로디의 경과음, 배음(3배음 = 완전5도 위, 5배음 = 장3도 위) 때문에 순간적으로 다른 코드가 이김.</li>
      <li><b>시간 평균</b>: 크로마를 앞뒤로 평균한 뒤 고름. 깜빡임은 줄지만 코드가 바뀌는 경계가 흐려짐.</li>
      <li><b>HMM 비터비</b>: "직전 코드가 유지될 확률이 높음"을 전이 확률로 넣고 전체 경로 중 가장 그럴듯한 것을 고름. 경계는 지키면서 깜빡임을 없앰.</li>
    </ul>
    <p>실제 시스템은 7화음, 전위, 베이스 음, 조성 정보를 더 쓰고, 요즘은 신경망으로 크로마를 대신하기도 함</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('스펙트럼을 음 이름으로 접기', 'Fold the spectrum into note names')}</text>
    <rect x="10" y="26" width="110" height="24" class="f-dim"/><text x="65" y="42" text-anchor="middle" class="t-small">C3 + C4 + C5</text>
    <path d="M122,38 L152,38" class="d-accent" marker-end="url(#arr)"/>
    <rect x="156" y="26" width="30" height="24" class="f-b"/><text x="171" y="42" text-anchor="middle" class="t-small">C</text>
    ${['C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((n, i) => `<rect x="${188 + i * 30}" y="26" width="28" height="24" class="${n === 'E' || n === 'G' ? 'f-b' : 'f-dim'}" opacity="${n === 'E' || n === 'G' ? 0.7 : 1}"/><text x="${202 + i * 30}" y="42" text-anchor="middle" class="t-small">${n}</text>`).join('')}
    <text x="4" y="80" class="t-small t-dim">${L('템플릿 (C 장3화음)', 'Template (C major)')}</text>
    ${Array.from({ length: 12 }, (_, i) => `<rect x="${156 + i * 30}" y="66" width="28" height="12" class="${[0, 4, 7].includes(i) ? 'f-accent' : 'f-dim'}"/>`).join('')}
    <text x="4" y="112" class="t-small t-dim">${L('시간 축', 'Time axis')}</text>
    <text x="80" y="134" class="t-small t-a">A</text>
    ${['C', 'C', 'Em', 'C', 'C', 'Am', 'Am', 'F', 'Am', 'Am'].map((c, i) => `<rect x="${100 + i * 40}" y="122" width="38" height="18" class="${(i === 2 || i === 7) ? 'f-a' : 'f-dim'}"/><text x="${119 + i * 40}" y="135" text-anchor="middle" class="t-small">${c}</text>`).join('')}
    <text x="80" y="160" class="t-small t-b">B</text>
    ${['C', 'C', 'C', 'C', 'C', 'Am', 'Am', 'Am', 'Am', 'Am'].map((c, i) => `<rect x="${100 + i * 40}" y="148" width="38" height="18" class="f-dim"/><text x="${119 + i * 40}" y="161" text-anchor="middle" class="t-small t-b">${c}</text>`).join('')}
  </svg>`,
  look: [
    '아래 줄의 빨간 칸은 정답과 다른 코드. A는 코드 중간에 빨간 칸이 섞여 깜빡임. B는 거의 없음.',
    '"멜로디 크기"를 0으로 내리면 A도 정확도가 올라감. 깜빡임의 큰 원인은 멜로디의 경과음.',
    '방식을 "시간 평균"으로 바꾸면 깜빡임은 줄지만 코드가 바뀌는 경계 근처가 틀림',
    '"소리 켜기" 후 A를 들으면 인식된 화음이 원곡과 순간순간 어긋나 불협화음이 들림',
  ],
  refs: [
    { type: 'paper', title: 'T. Fujishima, "Realtime Chord Recognition of Musical Sound: a System Using Common Lisp Music", ICMC', year: 1999, note: 'PCP(크로마)와 템플릿 매칭 코드 인식' },
    { type: 'paper', title: 'M. A. Bartsch, G. H. Wakefield, "To Catch a Chorus: Using Chroma-Based Representations for Audio Thumbnailing", WASPAA', year: 2001, note: '크로마 특징' },
    { type: 'paper', title: 'A. Sheh, D. P. W. Ellis, "Chord Segmentation and Recognition using EM-Trained Hidden Markov Models", ISMIR', year: 2003, note: 'HMM 코드 인식' },
    { type: 'book', title: 'Meinard Müller, Fundamentals of Music Processing, 2nd ed.', year: 2021, note: '5장 코드 인식: 템플릿, HMM, 비터비' },
  ],
  params: [
    { key: 'method', label: '인식 방식', type: 'select', options: [{ value: 'frame', label: '프레임마다 고르기' }, { value: 'smooth', label: '시간 평균' }, { value: 'hmm', label: 'HMM 비터비' }], a: 'frame', b: 'hmm', group: '인식' },
    { key: 'stay', label: '코드 유지 확률', type: 'range', min: 0.5, max: 0.995, step: 0.005, default: 0.95, when: (p) => p.method === 'hmm', help: 'HMM 전이 확률. 클수록 코드가 덜 바뀜' },
    { key: 'melody', label: '멜로디 크기', type: 'range', min: 0, max: 2, step: 0.05, default: 1.4, shared: true, group: '음악', help: '경과음이 섞인 멜로디의 크기' },
    { key: 'drums', label: '드럼 크기', type: 'range', min: 0, max: 1.5, step: 0.05, default: 0.8, shared: true, help: '하이햇과 스네어. 잡음이라 크로마를 흐림' },
    { key: 'pad', label: '인식 화음 크기', type: 'range', min: 0, max: 1, step: 0.05, default: 0.4, shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Chromagram and Chord Recognition',
    summary: 'A chromagram folds the spectrum into 12 note names (C, C#, ..., B). Matching it to major and minor triad templates finds the chord. Choosing each frame on its own makes the chord flicker because of passing tones in the melody. Viterbi decoding adds "chords rarely change" and keeps the result stable.',
    views: { a: 'Choose per frame', b: 'HMM Viterbi' },
    controls: 'Change the method and melody level in the parameter table. Press "Sound on" to hear the music with the recognized chords played as sine chords.',
    info: `
    <p><b>Chroma</b> keeps only the energy of each of the 12 note names and ignores the octave. Energy of C3, C4 and C5 all goes into the C bin. Laid out over time, it forms a <b>chromagram</b>.</p>
    <p><b>Template matching</b>: build a template for each of 24 chords (12 major, 12 minor triads) with 1 in the chord tone bins. Pick the chord with the highest cosine similarity to the chroma.</p>
    <ul>
      <li><b>Choose per frame</b>: the simplest. Passing tones in the melody and harmonics (3rd harmonic = a fifth up, 5th harmonic = a major third up) make another chord win for a moment.</li>
      <li><b>Time average</b>: average the chroma over nearby frames, then choose. Less flicker, but chord boundaries blur.</li>
      <li><b>HMM Viterbi</b>: adds "the previous chord probably stays" as a transition probability and picks the most likely path overall. Keeps the boundaries and removes flicker.</li>
    </ul>
    <p>Real systems also use seventh chords, inversions, the bass note and key information. Today neural networks often replace chroma.</p>`,
    look: [
      'Red cells in the bottom row are wrong chords. In A, red cells appear inside chords and flicker. B has almost none.',
      'Lower "Melody level" to 0. A\'s accuracy goes up too. Passing tones in the melody are the main cause of flicker.',
      'Switch to "Time average". Flicker drops, but frames near chord changes are wrong.',
      'Press "Sound on" and listen to A. The recognized chords clash with the music from moment to moment.',
    ],
    refs: ['Chord recognition with PCP (chroma) and template matching.', 'Chroma features.', 'HMM chord recognition.', 'Chapter 5, chord recognition: templates, HMM, Viterbi.'],
    params: {
      method: { label: 'Method', group: 'Recognition', options: { frame: 'Choose per frame', smooth: 'Time average', hmm: 'HMM Viterbi' } },
      stay: { label: 'Chord stay probability', help: 'HMM transition probability. Larger means chords change less.' },
      melody: { label: 'Melody level', group: 'Music', help: 'Level of the melody with passing tones.' },
      drums: { label: 'Drum level', help: 'Hi-hat and snare. They are noise, so they blur the chroma.' },
      pad: { label: 'Recognized chord level', group: 'Sound' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 11025, N = 1024, HOP = 256, TAU = Math.PI * 2, BAR = 1.0;
    // 진행 (근음 음이름, 장/단). 각 1초
    const PROG = [[0, 'maj'], [9, 'min'], [5, 'maj'], [7, 'maj'], [4, 'min'], [9, 'min'], [2, 'min'], [7, 'maj']];
    const DUR = PROG.length * BAR, LEN = Math.round(DUR * SR);
    // 멜로디: 코드마다 16분음표 8개 (MIDI). 코드 구성음과 그 위의 이웃음(경과음)이 번갈아 나옴
    const SCALE = [0, 2, 4, 5, 7, 9, 11], up = (m) => { do m++; while (!SCALE.includes(m % 12)); return m; };
    const MEL = PROG.map(([r, q]) => {
      const ct = [0, q === 'min' ? 3 : 4, 7].map((iv) => { let m = 72 + r + iv; while (m > 84) m -= 12; return m; }).sort((a, b) => a - b);
      return [ct[0], up(ct[0]), ct[1], up(ct[1]), ct[2], up(ct[2]), ct[1], up(ct[1])];
    });
    const NAMES = A.NOTE_NAMES;
    const chordName = (i) => NAMES[i % 12] + (i >= 12 ? 'm' : '');
    const truthIdx = PROG.map(([r, q]) => r + (q === 'min' ? 12 : 0));

    const note = (buf, t0, m, dur, amp, dk = 1) => {
      const f = A.mtof(m), i0 = Math.round(t0 * SR), n = Math.round(dur * SR);
      for (let h = 1; h <= 8 && f * h < SR / 2; h++) {
        const a = amp / Math.pow(h, 1.2), w = TAU * f * h / SR, dec = Math.exp(-(1.5 + h * 0.5) * dk / SR);
        let e = 1;
        for (let i = 0; i < n && i0 + i < LEN; i++) { buf[i0 + i] += a * e * Math.sin(w * i) * Math.min(1, i / 30, (n - i) / 200); e *= dec; }
      }
    };
    // 반주(코드 + 베이스)와 멜로디는 따로 만들어 두고 섞음 (멜로디 크기를 바로 바꾸려고)
    const acc = new Float32Array(LEN), mel = new Float32Array(LEN), drm = new Float32Array(LEN);
    const rng = U.rng(3);
    PROG.forEach(([r, q], j) => {
      const t0 = j * BAR, third = q === 'min' ? 3 : 4;
      note(acc, t0, 36 + r, BAR, 0.2, 0.3);
      for (const iv of [0, third, 7]) note(acc, t0, 60 + r + iv, BAR, 0.12, 0.3);
      MEL[j].forEach((m, k) => note(mel, t0 + k * BAR / MEL[j].length, m, BAR / MEL[j].length, 0.12));
      // 드럼: 8분음표 하이햇, 2박과 4박 스네어 (잡음이라 모든 음이름 칸에 에너지를 뿌림)
      for (let e = 0; e < 8; e++) {
        const i0 = Math.round((t0 + e * BAR / 8) * SR), sn = e === 2 || e === 6;
        for (let i = 0; i < SR * 0.15 && i0 + i < LEN; i++) drm[i0 + i] += rng.range(-1, 1) * (sn ? 0.35 * Math.exp(-i / SR * 14) : 0.12 * Math.exp(-i / SR * 40));
      }
    });

    const nF = Math.floor(LEN / HOP);
    // 반주와 멜로디의 복소 스펙트럼을 따로 저장. FFT는 선형이라 멜로디 크기를 바꿀 때 복소수 합으로 바로 섞을 수 있음
    const nB = N / 2, RE_A = new Float32Array(nF * nB), IM_A = new Float32Array(nF * nB), RE_M = new Float32Array(nF * nB), IM_M = new Float32Array(nF * nB), RE_D = new Float32Array(nF * nB), IM_D = new Float32Array(nF * nB);
    {
      const re = new Float64Array(N), im = new Float64Array(N), w = new Float64Array(N);
      for (let i = 0; i < N; i++) w[i] = 0.5 - 0.5 * Math.cos(TAU * i / N);
      for (const [src, R, I] of [[acc, RE_A, IM_A], [mel, RE_M, IM_M], [drm, RE_D, IM_D]]) for (let f = 0; f < nF; f++) {
        re.fill(0); im.fill(0);
        for (let i = 0; i < N; i++) { const j = f * HOP - N / 2 + i; re[i] = j >= 0 && j < LEN ? src[j] * w[i] : 0; }
        A.fft(re, im);
        for (let b = 0; b < nB; b++) { R[f * nB + b] = re[b]; I[f * nB + b] = im[b]; }
      }
    }
    // bin → 음이름 (60Hz~2kHz만)
    const binPc = new Int8Array(nB).fill(-1);
    for (let b = 1; b < nB; b++) { const f = b * SR / N; if (f >= 80 && f <= 2000) binPc[b] = A.pitchClass(A.ftom(f)); }
    const TPL = [];
    for (let i = 0; i < 24; i++) { const t = new Float32Array(12), r = i % 12, th = i >= 12 ? 3 : 4; t[r] = t[(r + th) % 12] = t[(r + 7) % 12] = 1 / Math.sqrt(3); TPL.push(t); }

    let key = '', chroma = null, out = null, truth = null, accPct = 0, changes = 0, padBuf = null, sig = new Float32Array(LEN);
    let cKey = '';
    function analyze() {
      if (cKey !== P.melody + ',' + P.drums) {
        cKey = P.melody + ',' + P.drums;
        const g = P.melody, gd = P.drums;
        chroma = new Float32Array(nF * 12);
        for (let f = 0; f < nF; f++) {
          const c = chroma.subarray(f * 12, f * 12 + 12);
          for (let b = 1; b < nB; b++) { if (binPc[b] < 0) continue; const k = f * nB + b, re = RE_A[k] + g * RE_M[k] + gd * RE_D[k], im = IM_A[k] + g * IM_M[k] + gd * IM_D[k]; c[binPc[b]] += Math.hypot(re, im); }
          let nrm = 1e-9; for (let p = 0; p < 12; p++) nrm += c[p] * c[p];
          nrm = Math.sqrt(nrm); for (let p = 0; p < 12; p++) c[p] /= nrm;
        }
        for (let i = 0; i < LEN; i++) sig[i] = acc[i] + g * mel[i] + gd * drm[i];
        A.normalize(sig, 0.5);
        key = '';
      }
      const k = P.method + P.stay;
      if (k === key) return;
      key = k;
      // 유사도
      let ch = chroma;
      if (P.method === 'smooth') {
        ch = new Float32Array(nF * 12);
        const K = 12;
        for (let f = 0; f < nF; f++) for (let p = 0; p < 12; p++) { let s = 0, c = 0; for (let j = Math.max(0, f - K); j <= Math.min(nF - 1, f + K); j++) { s += chroma[j * 12 + p]; c++; } ch[f * 12 + p] = s / c; }
      }
      const sim = new Float32Array(nF * 24);
      for (let f = 0; f < nF; f++) for (let i = 0; i < 24; i++) { let s = 0; for (let p = 0; p < 12; p++) s += ch[f * 12 + p] * TPL[i][p]; sim[f * 24 + i] = s; }
      out = new Int8Array(nF);
      if (P.method === 'hmm') {
        // 비터비: 관측 점수 = κ × 유사도, 전이 = 유지 stay, 나머지는 균등
        const kap = 25, ls = Math.log(P.stay), lc = Math.log((1 - P.stay) / 23);
        let dp = new Float64Array(24), nd = new Float64Array(24);
        const back = new Int8Array(nF * 24);
        for (let i = 0; i < 24; i++) dp[i] = kap * sim[i];
        for (let f = 1; f < nF; f++) {
          let bi = 0; for (let i = 1; i < 24; i++) if (dp[i] > dp[bi]) bi = i;
          for (let i = 0; i < 24; i++) {
            const st = dp[i] + ls, sw = dp[bi] + lc;
            if (st >= sw || bi === i) { nd[i] = st; back[f * 24 + i] = i; } else { nd[i] = sw; back[f * 24 + i] = bi; }
            nd[i] += kap * sim[f * 24 + i];
          }
          const t = dp; dp = nd; nd = t;
        }
        let s = 0; for (let i = 1; i < 24; i++) if (dp[i] > dp[s]) s = i;
        for (let f = nF - 1; f >= 0; f--) { out[f] = s; s = back[f * 24 + s]; }
      } else {
        for (let f = 0; f < nF; f++) { let bi = 0; for (let i = 1; i < 24; i++) if (sim[f * 24 + i] > sim[f * 24 + bi]) bi = i; out[f] = bi; }
      }
      truth = new Int8Array(nF);
      let ok = 0; changes = 0;
      for (let f = 0; f < nF; f++) {
        truth[f] = truthIdx[Math.min(PROG.length - 1, Math.floor(f * HOP / SR / BAR))];
        if (out[f] === truth[f]) ok++;
        if (f && out[f] !== out[f - 1]) changes++;
      }
      accPct = ok / nF * 100;
      // 인식 화음 패드 (사인파 3음, 바뀔 때 짧게 페이드)
      padBuf = new Float32Array(LEN);
      for (let f = 0; f < nF; f++) {
        const c = out[f], r = c % 12, th = c >= 12 ? 3 : 4, i0 = f * HOP;
        for (const iv of [0, th, 7]) {
          const fr = A.mtof(48 + r + iv), w = TAU * fr / SR;
          for (let i = 0; i < HOP && i0 + i < LEN; i++) {
            const fade = (f > 0 && out[f - 1] !== c) ? Math.min(1, i / 64) : 1;
            padBuf[i0 + i] += 0.06 * fade * Math.sin(w * (i0 + i));
          }
        }
      }
    }
    analyze();

    const live = { pos: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr;
        for (let i = 0; i < n; i++) {
          const i0 = Math.floor(live.pos), v = sig[i0] * 0.9 + padBuf[i0] * P.pad;
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= LEN) live.pos -= LEN;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, lx = 30, tw = W - lx - pad;
        const ch = Math.max(80, H - pad * 2 - 64), rowH = ch / 12;
        const fx = (f) => lx + f / nF * tw, fw = tw / nF + 0.5;
        for (let f = 0; f < nF; f++) for (let p = 0; p < 12; p++) {
          const v = chroma[f * 12 + p];
          D.rect(g, fx(f), pad + ch - (p + 1) * rowH, fw, rowH, U.hsl(210 - v * 180, 70, 8 + v * 62));
        }
        for (let p = 0; p < 12; p++) D.text(g, NAMES[p], lx - 4, pad + ch - (p + 1) * rowH + rowH / 2 - 5, { size: 9, color: C.dim, align: 'right' });
        for (let j = 1; j < PROG.length; j++) D.line(g, fx(j * BAR * SR / HOP), pad, fx(j * BAR * SR / HOP), pad + ch + 50, 'rgba(255,255,255,0.25)');
        // 정답 줄과 인식 줄
        const y1 = pad + ch + 8, y2 = y1 + 24;
        D.text(g, Lg('정답', 'Truth'), lx - 4, y1 + 4, { size: 9, color: C.dim, align: 'right' });
        D.text(g, Lg('인식', 'Result'), lx - 4, y2 + 4, { size: 9, color: C.dim, align: 'right' });
        PROG.forEach((_, j) => { const x = fx(j * BAR * SR / HOP); D.rect(g, x + 1, y1, tw / PROG.length - 2, 18, 'rgba(255,255,255,0.08)'); D.text(g, chordName(truthIdx[j]), x + 4, y1 + 3, { size: 11, color: C.text }); });
        let segStart = 0;
        for (let f = 0; f <= nF; f++) {
          if (f < nF && f > 0 && out[f] === out[f - 1]) continue;
          if (f > 0) {
            const s = segStart, e = f, okAll = truth.slice(s, e).every((t) => t === out[s]);
            const x = fx(s), w = fx(e) - x;
            D.rect(g, x, y2, Math.max(1, w - 1), 18, okAll ? col : C.bad);
            if (w > 22) D.text(g, chordName(out[s]), x + 3, y2 + 3, { size: 11, color: '#111' });
          }
          segStart = f;
        }
        if (snd.on) { const px = fx(live.pos / HOP); D.line(g, px, pad, px, y2 + 18, '#fff', 1.5); }
        D.text(g, Lg('크로마그램 (밝을수록 큼)', 'Chromagram (brighter = larger)'), lx + 4, pad + 3, { size: 10, color: '#fff' });
        ctx.stat(Lg('프레임 정확도', 'Frame accuracy'), accPct.toFixed(1) + '%');
        ctx.stat(Lg('코드 바뀐 횟수 (정답 7)', 'Chord changes (truth 7)'), changes);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
