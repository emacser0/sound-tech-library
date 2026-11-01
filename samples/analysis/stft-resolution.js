// STFT 창 크기: 짧은 창(시간 해상도) vs 긴 창(주파수 해상도). 가까운 두 음과 빠른 클릭을 동시에 나눌 수 없음
GTL.register({
  id: 'stft-resolution',
  title: 'STFT 창 크기와 시간-주파수 해상도',
  summary: '스펙트로그램은 짧은 창을 밀며 FFT를 반복한 결과. 창이 짧으면 빠른 클릭은 나뉘지만 가까운 두 음이 합쳐지고, 창이 길면 그 반대. 두 해상도를 동시에 높일 수 없음.',
  views: { a: '짧은 창 (256)', b: '긴 창 (2048)' },
  controls: '파라미터 표에서 창 크기를 바꿈. "소리 켜기"를 누르면 신호가 반복 재생되고 흰 선이 재생 위치를 표시.',
  info: `
    <p><b>STFT(Short-Time Fourier Transform)</b>는 신호를 짧은 구간(창)으로 잘라 구간마다 FFT를 하는 방법. 결과를 시간 순서로 늘어놓은 그림이 <b>스펙트로그램</b>.</p>
    <p>창 길이 T와 주파수 간격 Δf는 반비례(Δf = 1/T). 창이 길면 주파수가 촘촘하지만 창 안의 사건이 한데 섞임. 창이 짧으면 사건 시각은 정확하지만 주파수가 뭉개짐. 이것이 시간-주파수 불확정성(Gabor 한계).</p>
    <ul>
      <li><b>짧은 창 (128~512)</b>: 타악기 어택, 온셋 검출에 유리</li>
      <li><b>긴 창 (2048~8192)</b>: 화음, 음 높이, 조성 분석에 유리</li>
      <li>홉(Hop): 창을 밀어 가는 간격. 시간 축의 점 간격만 바꾸고 해상도 자체는 바꾸지 않음.</li>
      <li>해결책: 여러 창 크기를 함께 쓰거나, 낮은 주파수에 긴 창을 쓰는 상수 Q 변환(CQT)</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('시간-주파수 칸 하나의 넓이는 일정', 'Each time-frequency cell has a fixed area')}</text>
    <line x1="30" y1="150" x2="250" y2="150" class="d-line"/><line x1="30" y1="150" x2="30" y2="25" class="d-line"/>
    <text x="140" y="166" text-anchor="middle" class="t-small">${L('시간', 'time')}</text>
    <text x="2" y="90" class="t-small">${L('주파수', 'freq')}</text>
    <rect x="40" y="30" width="22" height="115" class="f-a" opacity="0.35"/><rect x="66" y="30" width="22" height="115" class="f-a" opacity="0.35"/><rect x="92" y="30" width="22" height="115" class="f-a" opacity="0.35"/>
    <text x="78" y="22" text-anchor="middle" class="t-small t-a">${L('짧은 창', 'short window')}</text>
    <rect x="140" y="30" width="100" height="22" class="f-b" opacity="0.35"/><rect x="140" y="56" width="100" height="22" class="f-b" opacity="0.35"/><rect x="140" y="82" width="100" height="22" class="f-b" opacity="0.35"/>
    <text x="190" y="122" text-anchor="middle" class="t-small t-b">${L('긴 창', 'long window')}</text>
    <text x="290" y="40" class="t-small t-a">${L('짧은 창: 클릭 시각이 정확, 주파수는 넓게 번짐', 'Short: click times are exact, frequency smears')}</text>
    <text x="290" y="70" class="t-small t-b">${L('긴 창: 두 음이 갈라짐, 클릭이 한데 뭉침', 'Long: two tones split, clicks blur together')}</text>
    <text x="290" y="110" class="t-small t-mono">Δf = sr / N</text>
    <text x="290" y="128" class="t-small t-mono">Δt ≈ N / sr</text>
    <text x="290" y="150" class="t-small t-dim">${L('Δf × Δt는 줄일 수 없음', 'Δf × Δt cannot shrink')}</text>
  </svg>`,
  look: [
    '아래 왼쪽 그래프에서 B는 600Hz, 640Hz 두 봉우리가 갈라짐. A는 봉우리 하나로 합쳐짐.',
    '아래 오른쪽 그래프에서 A는 30ms 간격 클릭 4개가 따로 보임. B는 하나의 덩어리.',
    '창 크기를 하나씩 바꿔 봄. 두 음이 갈라지는 크기(2048 이상)에서는 클릭이 뭉치고, 클릭이 나뉘는 크기(1024 이하)에서는 두 음이 합쳐짐.',
    '"소리 켜기" 후 들어 보면 귀는 두 음의 맥놀이(초당 40번 떨림)와 클릭 4번을 모두 구분함',
  ],
  refs: [
    { type: 'book', title: 'Julius O. Smith III, Spectral Audio Signal Processing (CCRMA online book)', url: 'https://ccrma.stanford.edu/~jos/sasp/', note: 'STFT, 창 길이와 해상도' },
    { type: 'paper', title: 'D. Gabor, "Theory of Communication", Journal of the IEE 93', year: 1946, note: '시간-주파수 불확정성' },
    { type: 'book', title: 'Meinard Müller, Fundamentals of Music Processing, 2nd ed.', year: 2021, note: '2장 푸리에 분석과 STFT' },
    { type: 'paper', title: 'J. C. Brown, "Calculation of a constant Q spectral transform", JASA 89(1)', year: 1991, note: '주파수마다 창 길이를 바꾸는 상수 Q 변환' },
  ],
  params: [
    { key: 'n', label: '창 크기 (샘플)', type: 'select', options: [128, 256, 512, 1024, 2048, 4096].map((v) => ({ value: v, label: String(v) })), a: 256, b: 2048, group: '분석' },
    { key: 'win', label: '창 함수', type: 'select', options: [{ value: 'hann', label: 'Hann' }, { value: 'rect', label: '사각' }, { value: 'blackman', label: 'Blackman' }], default: 'hann', shared: true },
    { key: 'range', label: '표시 범위 (dB)', type: 'range', min: 40, max: 120, step: 5, default: 80, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'STFT Window Size and Time-Frequency Resolution',
    summary: 'A spectrogram repeats the FFT on a short sliding window. A short window separates fast clicks but merges two close tones. A long window does the opposite. You cannot raise both resolutions at once.',
    views: { a: 'Short window (256)', b: 'Long window (2048)' },
    controls: 'Change the window size in the parameter table. Press "Sound on" to loop the signal. A white line shows the play position.',
    info: `
    <p>The <b>STFT (Short-Time Fourier Transform)</b> cuts the signal into short pieces (windows) and takes an FFT of each. Placing the results side by side in time gives a <b>spectrogram</b>.</p>
    <p>Window length T and frequency spacing Δf are inversely related (Δf = 1/T). A long window gives fine frequency steps, but events inside the window mix together. A short window gives exact event times, but frequencies smear. This is time-frequency uncertainty (the Gabor limit).</p>
    <ul>
      <li><b>Short window (128 to 512)</b>: good for drum attacks and onset detection.</li>
      <li><b>Long window (2048 to 8192)</b>: good for chords, pitch and key analysis.</li>
      <li>Hop: the step between windows. It only changes the spacing of time points, not the resolution itself.</li>
      <li>Fixes: combine several window sizes, or use the constant Q transform (CQT), which uses long windows for low frequencies.</li>
    </ul>`,
    look: [
      'In the lower left graph, B splits the 600 Hz and 640 Hz peaks. A merges them into one peak.',
      'In the lower right graph, A shows the 4 clicks 30 ms apart separately. B shows one blob.',
      'Try each window size. Sizes that split the tones (2048 and up) blur the clicks. Sizes that separate the clicks (1024 and below) merge the tones.',
      'Press "Sound on" and listen. Your ear hears both the beating of the two tones (40 times per second) and the 4 clicks.',
    ],
    refs: ['STFT, window length and resolution.', 'Time-frequency uncertainty.', 'Chapter 2: Fourier analysis and the STFT.', 'Constant Q transform: a different window length for each frequency.'],
    params: {
      n: { label: 'Window size (samples)', group: 'Analysis' },
      win: { label: 'Window', options: { rect: 'Rectangular' } },
      range: 'Display range (dB)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 22050, DUR = 3, LEN = SR * DUR, HOP = 128, TAU = Math.PI * 2;
    const T_SLICE = 0.7, CLICKS = [1.7, 1.73, 1.76, 1.79];

    // 테스트 신호: 600Hz + 640Hz (0.1~1.4초), 1500Hz + 30ms 간격 클릭 4개 (1.5~2.9초)
    const sig = new Float32Array(LEN);
    {
      const rng = U.rng(ctx.seed || 1);
      for (let i = 0; i < LEN; i++) {
        const t = i / SR;
        let v = 0;
        if (t > 0.1 && t < 1.4) v += 0.22 * (Math.sin(TAU * 600 * t) + Math.sin(TAU * 640 * t)) * Math.min(1, (t - 0.1) * 50, (1.4 - t) * 50);
        if (t > 1.5 && t < 2.9) v += 0.12 * Math.sin(TAU * 1500 * t) * Math.min(1, (t - 1.5) * 50, (2.9 - t) * 50);
        sig[i] = v;
      }
      for (const c of CLICKS) { const i0 = Math.round(c * SR); for (let k = 0; k < 40; k++) sig[i0 + k] += 0.6 * rng.range(-1, 1) * Math.exp(-k / 8); }
    }

    // ── 공용: 창 함수, STFT, 컬러맵 ──
    const WIN = { rect: () => 1, hann: (i, n) => 0.5 - 0.5 * Math.cos(TAU * i / n), blackman: (i, n) => 0.42 - 0.5 * Math.cos(TAU * i / n) + 0.08 * Math.cos(2 * TAU * i / n) };
    const CMAP = [[0, 0, 4], [40, 11, 84], [101, 21, 110], [159, 42, 99], [212, 72, 66], [245, 125, 21], [250, 193, 39], [252, 255, 164]];
    function cmap(t, d, o) {
      const x = U.clamp(t, 0, 1) * 7, i = Math.min(6, Math.floor(x)), f = x - i, a = CMAP[i], b = CMAP[i + 1];
      d[o] = a[0] + (b[0] - a[0]) * f; d[o + 1] = a[1] + (b[1] - a[1]) * f; d[o + 2] = a[2] + (b[2] - a[2]) * f; d[o + 3] = 255;
    }
    // 창 중심이 c(샘플)인 프레임의 파워 스펙트럼. nfft >= n (나머지는 0으로 채움)
    function framePow(c, n, nfft, w, re, im) {
      re.fill(0); im.fill(0);
      for (let i = 0; i < n; i++) { const j = c - n / 2 + i; re[i] = (j >= 0 && j < LEN ? sig[j] : 0) * w[i]; }
      A.fft(re, im);
    }

    let key = '', img = null, nF = 0, slice = null, sliceF0 = 0, sliceDf = 0, prof = null, tonesSplit = false, clickCount = 0, maxDb = 0;
    function analyze() {
      const k = P.n + P.win + P.range;
      if (k === key) return;
      key = k;
      const n = +P.n, w = new Float64Array(n), re = new Float64Array(n), im = new Float64Array(n);
      let ws = 0;
      for (let i = 0; i < n; i++) { w[i] = WIN[P.win](i, n); ws += w[i]; }
      const norm = 4 / (ws * ws);
      nF = Math.floor(LEN / HOP);
      const nB = n / 2, S = new Float32Array(nF * nB), hiBin = Math.ceil(3000 * n / SR);
      prof = new Float32Array(nF);
      maxDb = -200;
      for (let f = 0; f < nF; f++) {
        framePow(f * HOP, n, n, w, re, im);
        let hp = 0;
        for (let b = 0; b < nB; b++) {
          const p = (re[b] * re[b] + im[b] * im[b]) * norm, db = 10 * Math.log10(p + 1e-14);
          S[f * nB + b] = db; if (db > maxDb) maxDb = db;
          if (b >= hiBin) hp += p;
        }
        prof[f] = 10 * Math.log10(hp + 1e-14);
      }
      // 스펙트로그램 이미지 (로그 주파수 50~8000Hz)
      const rows = 180, fmin = 50, fmax = 8000;
      img = ctx.createCanvas(nF, rows);
      const ig = img.getContext('2d'), id = ig.createImageData(nF, rows), d = id.data;
      for (let r = 0; r < rows; r++) {
        const fr = fmin * Math.pow(fmax / fmin, (rows - 1 - r) / (rows - 1)), bf = fr * n / SR, b0 = Math.min(nB - 2, Math.floor(bf)), t = bf - b0;
        for (let f = 0; f < nF; f++) {
          const v = S[f * nB + b0] * (1 - t) + S[f * nB + b0 + 1] * t;
          cmap((v - maxDb + P.range) / P.range, d, (r * nF + f) * 4);
        }
      }
      ig.putImageData(id, 0, 0);
      // 0.7초 프레임의 주파수 단면. 곡선을 매끄럽게 그리려고 제로 패딩 (해상도는 그대로)
      const nfft = Math.max(8192, n * 4), re2 = new Float64Array(nfft), im2 = new Float64Array(nfft);
      framePow(Math.round(T_SLICE * SR), n, nfft, w, re2, im2);
      sliceDf = SR / nfft; sliceF0 = 480;
      const b0 = Math.floor(480 / sliceDf), b1 = Math.ceil(760 / sliceDf);
      slice = new Float32Array(b1 - b0);
      for (let b = b0; b < b1; b++) slice[b - b0] = 10 * Math.log10((re2[b] * re2[b] + im2[b] * im2[b]) * norm + 1e-14);
      sliceF0 = b0 * sliceDf;
      // 두 음이 갈라졌는지: 600Hz와 640Hz 사이 골이 양쪽 봉우리보다 3dB 이상 낮음
      const at = (f) => slice[U.clamp(Math.round((f - sliceF0) / sliceDf), 0, slice.length - 1)];
      let pk1 = -999, pk2 = -999, dip = 999;
      for (let f = 585; f <= 615; f += 1) pk1 = Math.max(pk1, at(f));
      for (let f = 625; f <= 655; f += 1) pk2 = Math.max(pk2, at(f));
      for (let f = 612; f <= 628; f += 1) dip = Math.min(dip, at(f));
      tonesSplit = Math.min(pk1, pk2) - dip > 3;
      // 클릭 개수: 1.6~1.9초 고역 에너지의 봉우리 (주변보다 3dB 이상 솟은 것)
      const f0 = Math.floor(1.6 * SR / HOP), f1 = Math.ceil(1.9 * SR / HOP);
      clickCount = 0;
      let pmax = -999;
      for (let f = f0; f <= f1; f++) pmax = Math.max(pmax, prof[f]);
      const mx = [];
      for (let f = f0 + 1; f < f1; f++) if (prof[f] > prof[f - 1] && prof[f] >= prof[f + 1]) mx.push(f);
      for (let i = 0; i < mx.length; i++) {
        // 봉우리 돌출도(prominence): 더 높은 지점을 만나기 전까지 양쪽의 최소값 중 큰 쪽과의 차이
        const v = prof[mx[i]];
        let dl = v, dr = v;
        for (let f = mx[i] - 1; f >= f0 && prof[f] <= v; f--) dl = Math.min(dl, prof[f]);
        for (let f = mx[i] + 1; f <= f1 && prof[f] <= v; f++) dr = Math.min(dr, prof[f]);
        if (v > pmax - 20 && v - Math.max(dl, dr) > 3) clickCount++;
      }
    }
    analyze();

    const live = { pos: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr;
        for (let i = 0; i < n; i++) {
          const p = live.pos, i0 = Math.floor(p), f = p - i0, v = sig[i0] * (1 - f) + sig[(i0 + 1) % LEN] * f;
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= LEN) live.pos -= LEN;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, tw = W - pad * 2;
        const sh = Math.max(80, H * 0.5);
        g.imageSmoothingEnabled = false;
        g.drawImage(img, pad, pad, tw, sh);
        g.imageSmoothingEnabled = true;
        for (const f of [100, 200, 500, 1000, 2000, 5000]) {
          const py = pad + sh - Math.log(f / 50) / Math.log(8000 / 50) * sh;
          D.line(g, pad, py, pad + 6, py, C.text); D.text(g, f >= 1000 ? f / 1000 + 'k' : String(f), pad + 8, py - 5, { size: 9, color: C.text });
        }
        const tx = (t) => pad + t / DUR * tw;
        D.rect(g, tx(T_SLICE) - 1, pad, 2, sh, 'rgba(255,255,255,0.35)');
        D.rect(g, tx(1.6), pad + sh - 4, tx(1.9) - tx(1.6), 4, C.good);
        if (snd.on) D.line(g, tx(live.pos / SR), pad, tx(live.pos / SR), pad + sh, '#fff', 1.5);
        D.text(g, Lg(`스펙트로그램 (창 ${P.n}, 로그 주파수)`, `Spectrogram (window ${P.n}, log frequency)`), pad + 40, pad + 4, { size: 10, color: C.text });
        // 아래 왼쪽: 0.7초의 주파수 단면
        const by = pad * 2 + sh, bh = H - by - pad - 12, bw = (tw - pad) / 2;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.35)');
        const top = maxDb + 3, bot = maxDb - 50;
        const sx = (f) => pad + (f - 480) / 280 * bw, sy = (db) => by + bh - U.clamp((db - bot) / (top - bot), 0, 1) * bh;
        for (const f of [600, 640]) { D.line(g, sx(f), by, sx(f), by + bh, C.grid); D.text(g, f + '', sx(f), by + bh + 1, { size: 9, color: C.dim, align: 'center' }); }
        g.beginPath();
        for (let i = 0; i < slice.length; i++) { const px = sx(sliceF0 + i * sliceDf), py = sy(slice[i]); i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 1.8; g.stroke();
        D.text(g, Lg('0.7초 단면 (480~760Hz)', 'Slice at 0.7 s (480 to 760 Hz)'), pad + 4, by + 3, { size: 10, color: C.dim });
        D.text(g, tonesSplit ? Lg('두 음 갈라짐', 'Two tones split') : Lg('한 봉우리로 합쳐짐', 'Merged into one peak'), pad + 4, by + 16, { size: 11, color: tonesSplit ? C.good : C.bad });
        // 아래 오른쪽: 고역 에너지 (클릭)
        const rx = pad * 2 + bw;
        D.rect(g, rx, by, bw, bh, 'rgba(0,0,0,0.35)');
        const f0 = Math.floor(1.6 * SR / HOP), f1 = Math.ceil(1.9 * SR / HOP);
        let pmax = -200; for (let f = f0; f <= f1; f++) pmax = Math.max(pmax, prof[f]);
        g.beginPath();
        for (let f = f0; f <= f1; f++) { const px = rx + (f - f0) / (f1 - f0) * bw, py = by + bh - U.clamp((prof[f] - pmax + 40) / 43, 0, 1) * bh; f === f0 ? g.moveTo(px, py) : g.lineTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 1.8; g.stroke();
        for (const c of CLICKS) { const px = rx + (c * SR / HOP - f0) / (f1 - f0) * bw; D.line(g, px, by + bh - 6, px, by + bh, C.warn, 2); }
        D.text(g, Lg('3kHz 위 에너지 (1.6~1.9초)', 'Energy above 3 kHz (1.6 to 1.9 s)'), rx + 4, by + 3, { size: 10, color: C.dim });
        D.text(g, Lg(`클릭 ${clickCount}개로 보임 (실제 4개)`, `${clickCount} clicks visible (4 real)`), rx + 4, by + 16, { size: 11, color: clickCount === 4 ? C.good : C.bad });
        const n = +P.n;
        ctx.stat(Lg('창 길이', 'Window length'), (n / SR * 1000).toFixed(1) + ' ms');
        ctx.stat(Lg('bin 간격', 'Bin spacing'), (SR / n).toFixed(1) + ' Hz');
        ctx.stat(Lg('두 음 (40Hz 차이)', 'Two tones (40 Hz apart)'), tonesSplit ? Lg('분리', 'Separated') : Lg('합쳐짐', 'Merged'));
        ctx.stat(Lg('클릭 (30ms 간격)', 'Clicks (30 ms apart)'), `${clickCount} / 4`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
