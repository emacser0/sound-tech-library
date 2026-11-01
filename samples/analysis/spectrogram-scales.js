// 스펙트로그램 주파수 축: 선형 vs 로그(옥타브) vs 멜. 같은 STFT를 다른 축으로 그림
GTL.register({
  id: 'spectrogram-scales',
  title: '스펙트로그램 주파수 축 (선형, 멜, 로그)',
  summary: '같은 스펙트로그램도 주파수 축을 어떻게 그리느냐에 따라 보이는 것이 달라짐. 선형 축은 음악의 대부분이 아래 몇 줄에 몰리고, 로그 축은 옥타브마다 같은 높이를 줘서 귀가 듣는 음 높이 간격과 맞음.',
  views: { a: '선형 축', b: '로그 축 (옥타브)' },
  controls: '파라미터 표에서 축 종류를 바꿈. "소리 켜기"를 누르면 아르페지오와 스윕이 반복 재생됨.',
  info: `
    <p>FFT bin은 주파수를 <b>같은 Hz 간격</b>으로 나눔. 하지만 귀는 주파수의 <b>비율</b>로 음 높이를 느낌. 100Hz에서 200Hz, 1000Hz에서 2000Hz는 Hz 차이가 10배지만 둘 다 한 옥타브.</p>
    <ul>
      <li><b>선형 축</b>: bin을 그대로 쌓음. 고역 배음, 잡음 분석에 맞음. 음악의 기음은 아래쪽 몇 줄에 몰림.</li>
      <li><b>로그 축</b>: 옥타브마다 같은 높이. 피아노 건반처럼 음 높이를 읽을 수 있음. 저역은 bin이 적어 뭉개져 보임.</li>
      <li><b>멜(Mel) 축</b>: 사람의 음 높이 지각 실험에서 나온 척도. 1kHz 아래는 거의 선형, 위는 로그. MFCC와 음성 인식의 기본.</li>
    </ul>
    <p>축만 바꾸면 해상도는 그대로. 로그 축에서 저역이 흐린 이유는 그 구간의 bin이 몇 개뿐이기 때문. 저역 해상도가 필요하면 긴 창이나 상수 Q 변환을 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('같은 옥타브 5개 (110, 220, 440, 880, 1760, 3520Hz)', 'The same 5 octaves (110, 220, 440, 880, 1760, 3520 Hz)')}</text>
    <text x="4" y="48" class="t-small t-a">${L('선형', 'Linear')}</text>
    <line x1="60" y1="44" x2="530" y2="44" class="d-dim"/>
    <rect x="60" y="34" width="7" height="20" class="f-a" opacity="0.9"/><rect x="67" y="34" width="7" height="20" class="f-a" opacity="0.7"/><rect x="74" y="34" width="14" height="20" class="f-a" opacity="0.5"/>
    <rect x="88" y="34" width="27" height="20" class="f-a" opacity="0.35"/><rect x="115" y="34" width="55" height="20" class="f-a" opacity="0.25"/>
    <text x="350" y="48" class="t-small t-a">${L('위 옥타브일수록 폭이 2배', 'each octave up is twice as wide')}</text>
    <text x="4" y="98" class="t-small t-b">${L('로그', 'Log')}</text>
    <rect x="60" y="84" width="94" height="20" class="f-b" opacity="0.9"/><rect x="154" y="84" width="94" height="20" class="f-b" opacity="0.7"/><rect x="248" y="84" width="94" height="20" class="f-b" opacity="0.5"/>
    <rect x="342" y="84" width="94" height="20" class="f-b" opacity="0.35"/><rect x="436" y="84" width="94" height="20" class="f-b" opacity="0.25"/>
    <text x="295" y="130" text-anchor="middle" class="t-small t-b">${L('옥타브마다 같은 폭 (귀가 느끼는 음 높이 간격)', 'every octave has the same width (as the ear hears pitch)')}</text>
  </svg>`,
  look: [
    'A에서 아르페지오의 기음이 아래쪽 10% 안에 몰림. B에서는 계단 모양으로 고르게 올라감.',
    '스윕(마지막 1초)은 지수적으로 올라가는 소리. B에서는 직선, A에서는 위로 휘는 곡선.',
    'B의 아래쪽(100Hz 근처)은 가로 줄무늬처럼 뭉개짐. FFT 크기를 4096으로 늘리면 조금 나아짐.',
    '축을 멜로 바꾸면 1kHz 아래는 선형처럼, 위는 로그처럼 그려짐',
  ],
  refs: [
    { type: 'paper', title: 'S. S. Stevens, J. Volkmann, E. B. Newman, "A Scale for the Measurement of the Psychological Magnitude Pitch", JASA 8(3)', year: 1937, note: '멜 척도의 원 논문' },
    { type: 'book', title: 'D. O\'Shaughnessy, Speech Communication: Human and Machine', year: 1987, note: '자주 쓰는 멜 공식 2595 log10(1 + f/700)' },
    { type: 'book', title: 'Meinard Müller, Fundamentals of Music Processing, 2nd ed.', year: 2021, note: '로그 주파수 스펙트로그램과 피치 기반 표현' },
    { type: 'code', title: 'librosa.display.specshow (y_axis: linear, log, mel)', url: 'https://librosa.org/doc/latest/generated/librosa.display.specshow.html', note: '파이썬 음악 분석 라이브러리의 축 옵션' },
  ],
  params: [
    { key: 'scale', label: '주파수 축', type: 'select', options: [{ value: 'linear', label: '선형' }, { value: 'mel', label: '멜' }, { value: 'log', label: '로그 (옥타브)' }], a: 'linear', b: 'log', group: '표시' },
    { key: 'n', label: 'FFT 크기', type: 'select', options: [1024, 2048, 4096].map((v) => ({ value: v, label: String(v) })), default: 2048, shared: true },
    { key: 'range', label: '표시 범위 (dB)', type: 'range', min: 40, max: 120, step: 5, default: 80, shared: true },
    { key: 'notes', label: '음 이름 눈금', type: 'bool', default: true, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Spectrogram Frequency Axes (Linear, Mel, Log)',
    summary: 'The same spectrogram looks different depending on how you draw the frequency axis. On a linear axis most of the music sits in the bottom few rows. A log axis gives every octave the same height, which matches how the ear hears pitch steps.',
    views: { a: 'Linear axis', b: 'Log axis (octaves)' },
    controls: 'Change the axis type in the parameter table. Press "Sound on" to loop the arpeggio and sweep.',
    info: `
    <p>FFT bins split frequency into <b>equal Hz steps</b>. But the ear hears pitch by frequency <b>ratio</b>. From 100 Hz to 200 Hz and from 1000 Hz to 2000 Hz differ by 10 times in Hz, but both are one octave.</p>
    <ul>
      <li><b>Linear axis</b>: stacks bins as they are. Good for high harmonics and noise. Musical fundamentals crowd into the bottom rows.</li>
      <li><b>Log axis</b>: every octave has the same height. You can read pitch like a piano keyboard. Low notes look blurry because there are few bins there.</li>
      <li><b>Mel axis</b>: a scale from pitch perception experiments. Almost linear below 1 kHz, log above. The basis of MFCC and speech recognition.</li>
    </ul>
    <p>Changing the axis does not change resolution. The low end looks blurry on the log axis because only a few bins cover it. For better low-end resolution, use a longer window or the constant Q transform.</p>`,
    look: [
      'In A the arpeggio fundamentals crowd into the bottom 10%. In B they climb in even steps.',
      'The sweep (last second) rises exponentially. In B it is a straight line. In A it curves upward.',
      'The bottom of B (around 100 Hz) smears into horizontal stripes. Raising the FFT size to 4096 helps a little.',
      'Switch the axis to mel. Below 1 kHz it looks linear, above it looks logarithmic.',
    ],
    refs: ['The original mel scale paper.', 'The common mel formula 2595 log10(1 + f/700).', 'Log-frequency spectrograms and pitch-based features.', 'Axis options in the Python music analysis library.'],
    params: {
      scale: { label: 'Frequency axis', group: 'Display', options: { linear: 'Linear', mel: 'Mel', log: 'Log (octaves)' } },
      n: 'FFT size',
      range: 'Display range (dB)',
      notes: 'Note name ticks',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const SR = 22050, DUR = 4, LEN = SR * DUR, HOP = 256, TAU = Math.PI * 2, FMIN = 40, FMAX = SR / 2;
    const ARP = [36, 43, 48, 52, 55, 60, 64, 67, 72, 76, 79, 84];

    // 신호: 3초 아르페지오 (C2~C6, 배음 있는 음) + 1초 지수 스윕 60Hz~8kHz
    const sig = new Float32Array(LEN);
    ARP.forEach((m, j) => {
      const f0 = A.mtof(m), i0 = Math.round(j * 0.25 * SR), len = Math.round(0.25 * SR);
      for (let h = 1; h <= 24 && h * f0 < FMAX * 0.95; h++) {
        const amp = 0.25 / h, w = TAU * h * f0 / SR;
        for (let i = 0; i < len; i++) sig[i0 + i] += amp * Math.sin(w * i) * Math.exp(-i / SR * (3 + h * 0.6)) * Math.min(1, i / 60);
      }
    });
    {
      const i0 = 3 * SR, n = SR - 200, k = Math.log(8000 / 60);
      for (let i = 0; i < n; i++) { const t = i / SR; const ph = TAU * 60 * (Math.exp(k * t) - 1) / k; sig[i0 + i] = 0.3 * Math.sin(ph) * Math.min(1, i / 200, (n - i) / 200); }
    }
    A.normalize(sig, 0.45);

    const CMAP = [[0, 0, 4], [40, 11, 84], [101, 21, 110], [159, 42, 99], [212, 72, 66], [245, 125, 21], [250, 193, 39], [252, 255, 164]];
    function cmap(t, d, o) {
      const x = U.clamp(t, 0, 1) * 7, i = Math.min(6, Math.floor(x)), f = x - i, a = CMAP[i], b = CMAP[i + 1];
      d[o] = a[0] + (b[0] - a[0]) * f; d[o + 1] = a[1] + (b[1] - a[1]) * f; d[o + 2] = a[2] + (b[2] - a[2]) * f; d[o + 3] = 255;
    }
    const mel = (f) => 2595 * Math.log10(1 + f / 700), imel = (m) => 700 * (Math.pow(10, m / 2595) - 1);
    // 축 위치(0 = 아래, 1 = 위) ↔ 주파수
    const AX = {
      linear: { pos: (f) => f / FMAX, freq: (p) => p * FMAX },
      log: { pos: (f) => Math.log(Math.max(f, FMIN) / FMIN) / Math.log(FMAX / FMIN), freq: (p) => FMIN * Math.pow(FMAX / FMIN, p) },
      mel: { pos: (f) => mel(f) / mel(FMAX), freq: (p) => imel(p * mel(FMAX)) },
    };

    // STFT는 FFT 크기가 바뀔 때만, 이미지는 축이나 범위가 바뀔 때만 다시 만듦
    let sKey = '', S = null, nF = 0, nB = 0, maxDb = 0, iKey = '', img = null;
    function analyze() {
      if (sKey !== String(P.n)) {
        sKey = String(P.n);
        const n = +P.n, re = new Float64Array(n), im = new Float64Array(n), w = new Float64Array(n);
        let ws = 0;
        for (let i = 0; i < n; i++) { w[i] = 0.5 - 0.5 * Math.cos(TAU * i / n); ws += w[i]; }
        nF = Math.floor(LEN / HOP); nB = n / 2; S = new Float32Array(nF * nB); maxDb = -200;
        for (let f = 0; f < nF; f++) {
          re.fill(0); im.fill(0);
          for (let i = 0; i < n; i++) { const j = f * HOP - n / 2 + i; re[i] = j >= 0 && j < LEN ? sig[j] * w[i] : 0; }
          A.fft(re, im);
          for (let b = 0; b < nB; b++) { const db = 10 * Math.log10((re[b] * re[b] + im[b] * im[b]) * 4 / (ws * ws) + 1e-14); S[f * nB + b] = db; if (db > maxDb) maxDb = db; }
        }
        iKey = '';
      }
      const k = P.scale + P.range;
      if (k === iKey) return;
      iKey = k;
      const rows = 220, ax = AX[P.scale], n = +P.n;
      img = ctx.createCanvas(nF, rows);
      const ig = img.getContext('2d'), id = ig.createImageData(nF, rows), d = id.data;
      for (let r = 0; r < rows; r++) {
        const fr = ax.freq((rows - 1 - r) / (rows - 1)), bf = U.clamp(fr * n / SR, 0, nB - 1.001), b0 = Math.floor(bf), t = bf - b0;
        for (let f = 0; f < nF; f++) cmap((S[f * nB + b0] * (1 - t) + S[f * nB + b0 + 1] * t - maxDb + P.range) / P.range, d, (r * nF + f) * 4);
      }
      ig.putImageData(id, 0, 0);
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
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, lx = 44, tw = W - pad - lx, th = H - pad * 2 - 14;
        const ax = AX[P.scale], yOf = (f) => pad + th - ax.pos(f) * th;
        g.imageSmoothingEnabled = false;
        g.drawImage(img, lx, pad, tw, th);
        g.imageSmoothingEnabled = true;
        // Hz 눈금 (왼쪽)
        for (const f of [50, 100, 200, 500, 1000, 2000, 5000, 10000]) {
          const py = yOf(f);
          if (py < pad + 4 || py > pad + th - 2) continue;
          D.line(g, lx - 4, py, lx, py, C.dim); D.text(g, f >= 1000 ? f / 1000 + 'k' : String(f), lx - 6, py - 5, { size: 9, color: C.dim, align: 'right' });
        }
        // 음 이름 눈금 (C2~C8)
        if (P.notes) for (let m = 36; m <= 108; m += 12) {
          const py = yOf(A.mtof(m));
          D.line(g, lx, py, lx + tw, py, 'rgba(255,255,255,0.12)');
          D.text(g, A.noteName(m), lx + tw - 4, py - 11, { size: 9, color: '#fff', align: 'right' });
        }
        // 시간 눈금
        for (let t = 0; t <= DUR; t++) D.text(g, t + 's', lx + t / DUR * tw, pad + th + 2, { size: 9, color: C.dim, align: t === DUR ? 'right' : 'center' });
        if (snd.on) { const px = lx + live.pos / LEN * tw; D.line(g, px, pad, px, pad + th, '#fff', 1.5); }
        const share = (f1, f2) => ((ax.pos(f2) - ax.pos(f1)) * 100).toFixed(1) + '%';
        ctx.stat(Lg('C2~C3 옥타브 높이', 'C2 to C3 octave height'), share(A.mtof(36), A.mtof(48)));
        ctx.stat(Lg('C5~C6 옥타브 높이', 'C5 to C6 octave height'), share(A.mtof(72), A.mtof(84)));
        ctx.stat(Lg('5.5k~11kHz 높이', '5.5k to 11 kHz height'), share(5512, 11025));
        ctx.stat(Lg('C2~C3 안의 bin 수', 'Bins inside C2 to C3'), Math.round((A.mtof(48) - A.mtof(36)) * P.n / SR));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
