// MFCC 단계별 보기: 스펙트럼 → 멜 필터뱅크 → 로그 → DCT. 음 높이와 상관없는 음색(포먼트) 요약을 만드는 과정
GTL.register({
  id: 'mfcc',
  title: 'MFCC (멜 주파수 켑스트럼 계수)',
  summary: '스펙트럼을 멜 간격 삼각 필터로 묶고 로그를 취한 뒤 DCT로 압축하면 MFCC가 됨. 앞쪽 계수 13개 정도가 스펙트럼의 큰 윤곽(포먼트)만 담아서, 음 높이가 바뀌어도 같은 모음은 비슷한 값을 냄.',
  single: true,
  controls: '파라미터 표에서 모음, 음 높이, 계수 개수를 바꿈. "소리 켜기"를 누르면 합성한 모음이 들림.',
  info: `
    <p><b>MFCC(Mel-Frequency Cepstral Coefficients)</b>는 음성 인식, 화자 인식, 음향 이벤트 분류, 악기 분류에 오래 쓰인 음색 특징</p>
    <ol>
      <li><b>STFT</b>: 짧은 프레임(20~40ms)의 파워 스펙트럼</li>
      <li><b>멜 필터뱅크</b>: 멜 척도에서 같은 간격인 삼각 필터 20~40개로 에너지를 묶음. 저역은 촘촘하고 고역은 넓음.</li>
      <li><b>로그</b>: 귀의 크기 지각에 맞추고, 곱셈(음원 × 성도 필터)을 덧셈으로 바꿈</li>
      <li><b>DCT</b>: 로그 멜 에너지를 코사인 성분으로 분해. 앞쪽 계수 = 완만한 윤곽, 뒤쪽 계수 = 촘촘한 굴곡(배음 줄무늬).</li>
      <li>앞쪽 12~13개만 남김. c0은 전체 크기라서 빼기도 함.</li>
    </ol>
    <p>뒤쪽 계수를 버리면 음 높이가 만드는 배음 줄무늬가 사라지고 포먼트 윤곽만 남음. 그래서 같은 모음은 음 높이가 달라도 비슷한 MFCC가 됨.</p>
    <p>단점: 위상과 음 높이 정보를 버리고, 잡음에 약함. 요즘 딥러닝은 DCT 전 단계인 로그 멜 스펙트로그램을 바로 쓰는 경우가 많음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="6" y="40" width="80" height="34" class="f-dim"/><text x="46" y="61" text-anchor="middle" class="t-small">${L('파워 스펙트럼', 'power spectrum')}</text>
    <rect x="114" y="40" width="96" height="34" class="f-dim"/><text x="162" y="61" text-anchor="middle" class="t-small">${L('멜 필터뱅크', 'mel filterbank')}</text>
    <rect x="238" y="40" width="60" height="34" class="f-dim"/><text x="268" y="61" text-anchor="middle" class="t-small">log</text>
    <rect x="326" y="40" width="60" height="34" class="f-dim"/><text x="356" y="61" text-anchor="middle" class="t-small">DCT</text>
    <rect x="414" y="40" width="120" height="34" class="f-b"/><text x="474" y="61" text-anchor="middle" class="t-small">${L('앞 13개 = MFCC', 'first 13 = MFCC')}</text>
    <path d="M88,57 L112,57" class="d-accent" marker-end="url(#arr)"/><path d="M212,57 L236,57" class="d-accent" marker-end="url(#arr)"/>
    <path d="M300,57 L324,57" class="d-accent" marker-end="url(#arr)"/><path d="M388,57 L412,57" class="d-accent" marker-end="url(#arr)"/>
    <path d="M114,30 L124,10 L134,30 M126,30 L138,10 L150,30 M142,30 L160,10 L178,30 M168,30 L192,10 L216,30" class="d-dim"/>
    <text x="162" y="96" text-anchor="middle" class="t-small t-dim">${L('저역은 좁게, 고역은 넓게', 'narrow low, wide high')}</text>
    <text x="356" y="96" text-anchor="middle" class="t-small t-dim">${L('윤곽과 굴곡을 분리', 'splits outline from ripple')}</text>
    <text x="474" y="96" text-anchor="middle" class="t-small t-dim">${L('배음 줄무늬는 버려짐', 'harmonic ripple dropped')}</text>
  </svg>`,
  look: [
    '위 그래프의 하늘색 선(MFCC 복원)은 배음 봉우리를 따라가지 않고 흰 점선(실제 포먼트)과 비슷한 윤곽을 그림',
    '"계수 개수"를 26으로 올리면 복원선이 배음 줄무늬까지 따라감. 4로 내리면 포먼트도 뭉개짐.',
    '모음을 바꾸면 MFCC 막대 모양이 크게 바뀜. 음 높이를 120Hz에서 200Hz로 바꾸면 막대 모양은 비슷하게 유지됨.',
    '모음을 "오"로 두고 음 높이를 250Hz 이상으로 올리면 배음 사이가 멀어져 포먼트를 제대로 못 그리고, 인식이 "아"로 틀림',
  ],
  refs: [
    { type: 'paper', title: 'S. B. Davis, P. Mermelstein, "Comparison of parametric representations for monosyllabic word recognition in continuously spoken sentences", IEEE Trans. ASSP 28(4)', year: 1980, note: 'MFCC를 소개한 논문' },
    { type: 'paper', title: 'B. Logan, "Mel Frequency Cepstral Coefficients for Music Modeling", ISMIR', year: 2000, note: '음악에 MFCC 적용' },
    { type: 'paper', title: 'G. E. Peterson, H. L. Barney, "Control Methods Used in a Study of the Vowels", JASA 24(2)', year: 1952, note: '모음 포먼트 측정. 이 샘플의 포먼트 값은 이 자료를 바탕으로 한 근사값' },
    { type: 'book', title: 'Lawrence Rabiner, Biing-Hwang Juang, Fundamentals of Speech Recognition', year: 1993, note: '켑스트럼과 음성 특징' },
  ],
  params: [
    { key: 'vowel', label: '모음', type: 'select', options: [{ value: 'a', label: '아 (a)' }, { value: 'e', label: '에 (e)' }, { value: 'i', label: '이 (i)' }, { value: 'o', label: '오 (o)' }, { value: 'u', label: '우 (u)' }], default: 'a', group: '소리 합성' },
    { key: 'f0', label: '음 높이 (Hz)', type: 'range', min: 80, max: 400, step: 1, default: 120 },
    { key: 'nFilt', label: '멜 필터 개수', type: 'int', min: 10, max: 40, default: 26, group: 'MFCC' },
    { key: 'nCoef', label: '계수 개수', type: 'int', min: 2, max: 40, default: 13, help: 'DCT 앞쪽에서 남길 개수 (필터 개수를 넘지 않음)' },
    ...GTL.audio.params({ single: true }),
  ],
  en: {
    title: 'MFCC (Mel-Frequency Cepstral Coefficients)',
    summary: 'Group the spectrum with triangle filters spaced on the mel scale, take the log, and compress with a DCT: that gives MFCC. The first 13 or so coefficients keep only the broad outline (formants), so the same vowel gives similar values even at a different pitch.',
    controls: 'Change the vowel, pitch and number of coefficients in the parameter table. Press "Sound on" to hear the synthesized vowel.',
    info: `
    <p><b>MFCC (Mel-Frequency Cepstral Coefficients)</b> are a timbre feature long used for speech recognition, speaker recognition, sound event classification and instrument classification.</p>
    <ol>
      <li><b>STFT</b>: power spectrum of a short frame (20 to 40 ms).</li>
      <li><b>Mel filterbank</b>: group energy with 20 to 40 triangle filters spaced evenly on the mel scale. Dense at low frequencies, wide at high ones.</li>
      <li><b>Log</b>: matches loudness perception and turns a product (source × vocal tract filter) into a sum.</li>
      <li><b>DCT</b>: splits the log mel energies into cosine parts. Early coefficients = smooth outline, later ones = fine ripple (harmonic stripes).</li>
      <li>Keep only the first 12 or 13. c0 is the overall level, so it is sometimes dropped.</li>
    </ol>
    <p>Dropping the later coefficients removes the harmonic stripes caused by pitch and keeps only the formant outline. That is why the same vowel gives similar MFCC at different pitches.</p>
    <p>Weak spots: phase and pitch are thrown away, and MFCC is sensitive to noise. Today deep learning often uses the log mel spectrogram before the DCT step directly.</p>`,
    look: [
      'The light blue line in the top graph (MFCC reconstruction) does not follow the harmonic peaks. It draws an outline close to the white dashed line (real formants).',
      'Raise "Coefficients" to 26. The reconstruction now follows the harmonic stripes too. Lower it to 4 and even the formants blur.',
      'Change the vowel and the MFCC bars change shape a lot. Change the pitch from 120 Hz to 200 Hz and the bars keep a similar shape.',
      'Set the vowel to "o" and raise the pitch above 250 Hz. Harmonics are so far apart that the formants are poorly drawn, and it is recognized as "a".',
    ],
    refs: ['The paper that introduced MFCC.', 'MFCC applied to music.', 'Vowel formant measurements. The formant values here are approximations based on this data.', 'Cepstrum and speech features.'],
    params: {
      vowel: { label: 'Vowel', group: 'Synthesis', options: { a: 'a (as in father)', e: 'e (as in bed)', i: 'i (as in see)', o: 'o (as in law)', u: 'u (as in boot)' } },
      f0: 'Pitch (Hz)',
      nFilt: { label: 'Mel filters', group: 'MFCC' },
      nCoef: { label: 'Coefficients', help: 'How many DCT coefficients to keep (at most the number of filters).' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const SR = 16000, N = 1024, TAU = Math.PI * 2, FMAX = 5000, TL = 2048;
    // 포먼트 [주파수, 대역폭] (남성 평균 근사)
    const VOW = {
      a: [[730, 90], [1090, 110], [2440, 160]], e: [[530, 70], [1840, 100], [2480, 160]], i: [[270, 60], [2290, 100], [3010, 160]],
      o: [[570, 80], [840, 90], [2410, 160]], u: [[300, 60], [870, 90], [2240, 160]],
    };
    const VNAME = (v) => ({ a: Lg('아', 'a'), e: Lg('에', 'e'), i: Lg('이', 'i'), o: Lg('오', 'o'), u: Lg('우', 'u') })[v];
    // 성도 필터 크기 (2차 공진기 곱) × 음원 기울기 (-6dB/옥타브)
    const env = (v, f) => { let m = 1; for (const [F, B] of VOW[v]) m *= F * F / Math.sqrt(Math.pow(F * F - f * f, 2) + Math.pow(B * f, 2)); return m; };
    // 모음 한 프레임 (배음 덧셈 합성)
    function frame(v, f0) {
      const x = new Float64Array(N), rng = U.rng(4);
      for (let h = 1; h * f0 < SR / 2; h++) { const a = env(v, h * f0) / h, ph = rng.range(0, TAU), w = TAU * h * f0 / SR; for (let i = 0; i < N; i++) x[i] += a * Math.sin(w * i + ph); }
      return x;
    }
    const mel = (f) => 2595 * Math.log10(1 + f / 700), imel = (m) => 700 * (Math.pow(10, m / 2595) - 1);
    // 파워 스펙트럼, 멜 에너지(dB), MFCC
    function analyzeFrame(x, nFilt, nCoef) {
      const re = new Float64Array(N), im = new Float64Array(N);
      let ws = 0;
      for (let i = 0; i < N; i++) { const w = 0.5 - 0.5 * Math.cos(TAU * i / N); ws += w; re[i] = x[i] * w; }
      A.fft(re, im);
      const pw = new Float64Array(N / 2);
      for (let k = 0; k < N / 2; k++) pw[k] = (re[k] * re[k] + im[k] * im[k]) * 4 / (ws * ws);
      // 삼각 필터 (면적 1로 정규화해서 결과가 평균 파워가 되게 함)
      const m0 = mel(0), m1 = mel(SR / 2), edges = [];
      for (let j = 0; j < nFilt + 2; j++) edges.push(imel(m0 + (m1 - m0) * j / (nFilt + 1)));
      const melDb = new Float64Array(nFilt), filt = [];
      for (let j = 0; j < nFilt; j++) {
        const lo = edges[j], c = edges[j + 1], hi = edges[j + 2];
        let s = 0, ws2 = 0;
        for (let k = 0; k < N / 2; k++) {
          const f = k * SR / N, w = f <= lo || f >= hi ? 0 : f <= c ? (f - lo) / (c - lo) : (hi - f) / (hi - c);
          s += w * pw[k]; ws2 += w;
        }
        if (ws2 < 1e-9) { const k = Math.round(c * N / SR); s = pw[k]; ws2 = 1; }  // 필터가 bin보다 좁을 때
        melDb[j] = 10 * Math.log10(s / ws2 + 1e-12);
        filt.push([lo, c, hi]);
      }
      // DCT-II (직교 정규화)
      const K = Math.min(nCoef, nFilt), cc = new Float64Array(K);
      for (let n = 0; n < K; n++) { let s = 0; for (let m = 0; m < nFilt; m++) s += melDb[m] * Math.cos(Math.PI * n * (m + 0.5) / nFilt); cc[n] = s * Math.sqrt((n ? 2 : 1) / nFilt); }
      // 남긴 계수로 로그 멜 에너지 복원 (역 DCT)
      const rec = new Float64Array(nFilt);
      for (let m = 0; m < nFilt; m++) { let s = 0; for (let n = 0; n < K; n++) s += cc[n] * Math.sqrt((n ? 2 : 1) / nFilt) * Math.cos(Math.PI * n * (m + 0.5) / nFilt); rec[m] = s; }
      return { pw, melDb, cc, rec, filt };
    }

    let key = '', cur = null, tKey = '', templates = null, dists = null, guess = 'a';
    function analyze() {
      const tk = P.nFilt + ',' + P.nCoef;
      if (tk !== tKey) {
        tKey = tk; templates = {};
        for (const v of Object.keys(VOW)) templates[v] = analyzeFrame(frame(v, 120), P.nFilt, P.nCoef).cc;
        key = '';
      }
      const k = P.vowel + P.f0 + tk;
      if (k === key) return;
      key = k;
      cur = analyzeFrame(frame(P.vowel, P.f0), P.nFilt, P.nCoef);
      // 120Hz로 만든 모음 템플릿과의 거리 (c0 제외, 계수 1부터)
      dists = {};
      guess = 'a';
      for (const v of Object.keys(VOW)) {
        let s = 0; for (let n = 1; n < cur.cc.length; n++) s += Math.pow(cur.cc[n] - templates[v][n], 2);
        dists[v] = Math.sqrt(s);
        if (dists[v] < dists[guess]) guess = v;
      }
      buildTable();
    }
    // 재생용 한 주기 웨이브테이블
    let table = new Float32Array(TL);
    function buildTable() {
      const t = new Float32Array(TL), f0 = P.f0;
      for (let h = 1; h * f0 < Math.min(8000, SR / 2); h++) { const a = env(P.vowel, h * f0) / h; for (let i = 0; i < TL; i++) t[i] += a * Math.sin(TAU * h * i / TL); }
      A.normalize(t, 0.45);
      table = t;
    }
    analyze();

    const live = { ph: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const tb = table, inc = P.f0 / sr * TL;
        for (let i = 0; i < n; i++) {
          const p = live.ph, i0 = Math.floor(p), fr = p - i0, v = tb[i0] * (1 - fr) + tb[(i0 + 1) % TL] * fr;
          l[i] = v; r[i] = v;
          live.ph += inc; if (live.ph >= TL) live.ph -= TL;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        // 위: 스펙트럼 + 포먼트 + MFCC 복원 + 필터
        const sh = Math.max(90, H * 0.5), minDb = -80, maxDb = 10;
        D.rect(g, pad, pad, tw, sh, 'rgba(0,0,0,0.35)');
        const fx = (f) => pad + f / FMAX * tw, dy = (db) => pad + sh - U.clamp((db - minDb) / (maxDb - minDb), 0, 1) * sh;
        let top = -999; for (let k = 0; k < N / 2; k++) top = Math.max(top, 10 * Math.log10(cur.pw[k] + 1e-12));
        const off = -top;   // 가장 큰 배음 = 0dB
        for (let f = 1000; f < FMAX; f += 1000) { D.line(g, fx(f), pad, fx(f), pad + sh, C.grid); D.text(g, f / 1000 + 'k', fx(f) + 2, pad + sh - 11, { size: 9, color: C.dim }); }
        // 필터 삼각형
        g.strokeStyle = 'rgba(199,146,234,0.35)'; g.lineWidth = 1;
        for (const [lo, c, hi] of cur.filt) { if (lo > FMAX) break; g.beginPath(); g.moveTo(fx(lo), pad + sh); g.lineTo(fx(c), pad + sh - 18); g.lineTo(fx(Math.min(hi, FMAX)), pad + sh); g.stroke(); }
        // 스펙트럼
        g.beginPath(); let st = false;
        for (let k = 1; k < N / 2; k++) { const f = k * SR / N; if (f > FMAX) break; const px = fx(f), py = dy(10 * Math.log10(cur.pw[k] + 1e-12) + off); st ? g.lineTo(px, py) : g.moveTo(px, py); st = true; }
        g.strokeStyle = 'rgba(216,221,230,0.6)'; g.lineWidth = 1; g.stroke();
        // 실제 포먼트 윤곽 (음원 기울기 포함)
        let eTop = -999; for (let h = 1; h * P.f0 < SR / 2; h++) eTop = Math.max(eTop, 20 * Math.log10(env(P.vowel, h * P.f0) / h));
        g.beginPath();
        for (let px = 0; px <= tw; px += 2) { const f = Math.max(P.f0, px / tw * FMAX), py = dy(20 * Math.log10(env(P.vowel, f) / (f / P.f0)) - eTop); px ? g.lineTo(pad + px, py) : g.moveTo(pad + px, py); }
        g.strokeStyle = '#fff'; g.setLineDash([4, 3]); g.lineWidth = 1.2; g.stroke(); g.setLineDash([]);
        // MFCC 복원선 (필터 중심 주파수에)
        let rTop = -999; cur.filt.forEach(([, c], j) => { if (c <= FMAX) rTop = Math.max(rTop, cur.rec[j]); });
        g.beginPath(); st = false;
        cur.filt.forEach(([, c], j) => { if (c > FMAX) return; const px = fx(c), py = dy(cur.rec[j] - rTop); st ? g.lineTo(px, py) : g.moveTo(px, py); st = true; });
        g.strokeStyle = C.b; g.lineWidth = 2.2; g.stroke();
        D.text(g, Lg('스펙트럼 (회색), 실제 포먼트 (흰 점선), MFCC로 복원한 윤곽 (하늘색), 멜 필터 (보라)', 'Spectrum (gray), real formants (white dashed), outline rebuilt from MFCC (light blue), mel filters (purple)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 아래 왼쪽: 로그 멜 에너지, 오른쪽: MFCC
        const by = pad * 2 + sh, bh = H - by - pad - 12, bw = (tw - pad) / 2;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.35)');
        const nf = cur.melDb.length, cw = bw / nf;
        let mlo = Infinity, mhi = -Infinity; for (const v of cur.melDb) { mlo = Math.min(mlo, v); mhi = Math.max(mhi, v); }
        for (let j = 0; j < nf; j++) { const v = (cur.melDb[j] - mlo) / (mhi - mlo + 1e-9), h = v * (bh - 20); D.rect(g, pad + j * cw + 1, by + bh - h, Math.max(1, cw - 2), h, C.accent); }
        D.text(g, Lg(`로그 멜 에너지 (필터 ${nf}개)`, `Log mel energy (${nf} filters)`), pad + 4, by + 3, { size: 10, color: C.dim });
        const rx = pad * 2 + bw, K = cur.cc.length, kw = bw / K;
        D.rect(g, rx, by, bw, bh, 'rgba(0,0,0,0.35)');
        let cm = 1e-9; for (let n = 1; n < K; n++) cm = Math.max(cm, Math.abs(cur.cc[n]));
        const mid = by + bh / 2 + 6;
        D.line(g, rx, mid, rx + bw, mid, C.grid);
        for (let n = 0; n < K; n++) {
          const v = n ? cur.cc[n] / cm : 0, h = v * (bh / 2 - 14);
          D.rect(g, rx + n * kw + 1, Math.min(mid, mid - h), Math.max(1, kw - 2), Math.abs(h), n ? C.b : C.dim);
          const tv = templates[guess][n] / cm * (bh / 2 - 14);
          if (n) D.line(g, rx + n * kw + 1, mid - tv, rx + (n + 1) * kw - 1, mid - tv, '#fff', 1.5);
        }
        D.text(g, Lg(`MFCC c1~c${K - 1} (흰 선 = 인식된 모음의 120Hz 템플릿)`, `MFCC c1 to c${K - 1} (white = 120 Hz template of the recognized vowel)`), rx + 4, by + 3, { size: 10, color: C.dim });
        ctx.stat(Lg('인식된 모음', 'Recognized vowel'), VNAME(guess) + (guess === P.vowel ? Lg(' (맞음)', ' (correct)') : Lg(' (틀림)', ' (wrong)')));
        ctx.stat(Lg('템플릿 거리', 'Template distance'), Object.keys(VOW).map((v) => VNAME(v) + ' ' + dists[v].toFixed(1)).join(', '));
        ctx.stat(Lg('배음 간격', 'Harmonic spacing'), P.f0.toFixed(0) + ' Hz');
        ctx.stat(Lg('계수 / 필터', 'Coefficients / filters'), `${K} / ${nf}`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
