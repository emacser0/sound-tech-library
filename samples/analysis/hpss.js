// 화성음/타악음 분리(HPSS): 스펙트로그램에서 가로로 긴 성분(지속음)과 세로로 긴 성분(타격)을 중앙값 필터로 나눔
GTL.register({
  id: 'hpss',
  title: '화성음, 타악음 분리 (HPSS 중앙값 필터)',
  summary: '스펙트로그램에서 지속음은 가로줄, 타악기는 세로줄로 나타남. 시간 방향 중앙값 필터는 가로줄만, 주파수 방향 중앙값 필터는 세로줄만 남김. 두 결과로 마스크를 만들어 한 곡을 화성 성분과 타악 성분으로 나눔.',
  views: { a: '화성 성분', b: '타악 성분' },
  controls: '파라미터 표에서 뷰마다 들을 성분과 마스크 방식, 필터 길이를 바꿈. "소리 켜기"를 누르면 고른 뷰의 분리 결과가 반복 재생됨.',
  info: `
    <p><b>HPSS(Harmonic-Percussive Source Separation)</b>는 음악을 지속음 성분(화음, 베이스, 보컬의 모음)과 타격 성분(드럼, 자음, 어택)으로 나누는 방법. 비트 추적 전처리, 코드 인식 전처리, 리믹스, 드럼만 키우기에 씀.</p>
    <ol>
      <li>STFT로 크기 스펙트로그램 |X(t, f)|를 구함</li>
      <li><b>시간 방향 중앙값</b> (가로 17칸): 지속음은 살아남고, 한두 프레임짜리 타격은 이상치로 지워짐 → H</li>
      <li><b>주파수 방향 중앙값</b> (세로 17칸): 넓은 대역에 퍼진 타격은 살아남고, 좁은 배음 줄은 지워짐 → P</li>
      <li><b>마스크</b>: 이진 마스크는 H &gt; P인 칸을 화성으로 몰아줌. 소프트(위너) 마스크는 H²/(H² + P²) 비율로 나눔.</li>
      <li>마스크를 원래 복소 스펙트럼에 곱하고 역 STFT로 소리를 되돌림</li>
    </ol>
    <p>평균 대신 <b>중앙값</b>을 쓰는 이유: 평균은 튀는 값에 끌려가지만 중앙값은 무시함. 단점: 피아노 어택처럼 둘의 성질을 다 가진 소리는 반씩 갈라지고, 이진 마스크는 "물방울" 같은 잡음(뮤지컬 노이즈)을 남김.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="14" class="t-small t-dim">${L('스펙트로그램', 'Spectrogram')}</text>
    <rect x="10" y="22" width="150" height="120" class="f-dim"/>
    <line x1="10" y1="50" x2="160" y2="50" class="d-a"/><line x1="10" y1="75" x2="160" y2="75" class="d-a"/><line x1="10" y1="100" x2="160" y2="100" class="d-a"/>
    <line x1="45" y1="22" x2="45" y2="142" class="d-b"/><line x1="95" y1="22" x2="95" y2="142" class="d-b"/><line x1="140" y1="22" x2="140" y2="142" class="d-b"/>
    <text x="6" y="160" class="t-small">${L('가로 = 지속음, 세로 = 타격', 'horizontal = held, vertical = hits')}</text>
    <rect x="200" y="30" width="60" height="16" class="f-a" opacity="0.6"/><text x="270" y="42" class="t-small">${L('시간 방향 중앙값 → 가로줄만 남음 (H)', 'time median: horizontal lines remain (H)')}</text>
    <rect x="222" y="66" width="16" height="60" class="f-b" opacity="0.6"/><text x="270" y="100" class="t-small">${L('주파수 방향 중앙값 → 세로줄만 남음 (P)', 'frequency median: vertical lines remain (P)')}</text>
    <text x="270" y="140" class="t-small t-mono">M_H = H² / (H² + P²)</text>
    <text x="270" y="158" class="t-small t-dim">${L('소프트 마스크를 원래 스펙트럼에 곱해 되돌림', 'apply the soft mask to the original and invert')}</text>
  </svg>`,
  look: [
    'A의 스펙트로그램에는 가로줄(화음)만, B에는 세로줄(드럼)만 남음',
    '"소리 켜기" 후 A와 B를 번갈아 들으면 같은 곡에서 화음만, 드럼만 들림',
    '마스크를 "이진"으로 바꾸면 스펙트로그램의 경계가 칼같이 끊기고, 소리에 물방울 같은 잡음(뮤지컬 노이즈)이 섞임',
    '필터 길이를 5로 줄이면 분리가 약해지고, 41로 늘리면 짧은 화음 변화까지 타악으로 새어 나감',
  ],
  refs: [
    { type: 'paper', title: 'D. FitzGerald, "Harmonic/Percussive Separation using Median Filtering", DAFx', year: 2010, note: '중앙값 필터 HPSS의 원 논문' },
    { type: 'paper', title: 'N. Ono, K. Miyamoto, J. Le Roux, H. Kameoka, S. Sagayama, "Separation of a Monaural Audio Signal into Harmonic/Percussive Components by Complementary Diffusion on Spectrogram", EUSIPCO', year: 2008, note: '스펙트로그램의 가로, 세로 매끄러움을 이용한 초기 HPSS' },
    { type: 'paper', title: 'J. Driedger, M. Müller, S. Disch, "Extending Harmonic-Percussive Separation of Audio Signals", ISMIR', year: 2014, note: '분리 계수와 잔여 성분(residual)을 더한 확장' },
    { type: 'code', title: 'librosa.decompose.hpss', url: 'https://librosa.org/doc/latest/generated/librosa.decompose.hpss.html', note: '파이썬 구현 (kernel_size, power, margin)' },
  ],
  params: [
    { key: 'out', label: '들을 성분', type: 'select', options: [{ value: 'mix', label: '원래 곡' }, { value: 'harm', label: '화성 성분' }, { value: 'perc', label: '타악 성분' }], a: 'harm', b: 'perc', group: '출력' },
    { key: 'mask', label: '마스크', type: 'select', options: [{ value: 'soft', label: '소프트 (위너)' }, { value: 'binary', label: '이진' }], default: 'soft', shared: true, group: '분리' },
    { key: 'kh', label: '시간 방향 필터 길이', type: 'int', min: 5, max: 41, step: 2, default: 17, shared: true, help: '프레임 수 (1프레임 = 11.6ms)' },
    { key: 'kp', label: '주파수 방향 필터 길이', type: 'int', min: 5, max: 41, step: 2, default: 17, shared: true, help: 'bin 수 (1bin = 21.5Hz)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Harmonic-Percussive Separation (HPSS Median Filter)',
    summary: 'In a spectrogram, held notes are horizontal lines and drums are vertical lines. A median filter along time keeps only the horizontal lines, and one along frequency keeps only the vertical lines. Masks built from the two results split a song into a harmonic part and a percussive part.',
    views: { a: 'Harmonic part', b: 'Percussive part' },
    controls: 'Choose the part to hear in each view, the mask type and filter lengths in the parameter table. Press "Sound on" to loop the separated result of the selected view.',
    info: `
    <p><b>HPSS (Harmonic-Percussive Source Separation)</b> splits music into a held part (chords, bass, sung vowels) and a hit part (drums, consonants, attacks). It is used before beat tracking or chord recognition, for remixing, and to boost only the drums.</p>
    <ol>
      <li>Take the magnitude spectrogram |X(t, f)| with an STFT.</li>
      <li><b>Median along time</b> (17 cells wide): held notes survive, and hits that last one or two frames are removed as outliers → H.</li>
      <li><b>Median along frequency</b> (17 cells tall): hits spread over a wide band survive, and narrow harmonic lines are removed → P.</li>
      <li><b>Mask</b>: a binary mask gives every cell with H &gt; P to the harmonic part. A soft (Wiener) mask splits by the ratio H²/(H² + P²).</li>
      <li>Multiply the mask with the original complex spectrum and return to sound with an inverse STFT.</li>
    </ol>
    <p>Why the <b>median</b> instead of the mean: the mean is pulled by outliers, the median ignores them. Weak spots: sounds with both natures, like a piano attack, are split in half, and a binary mask leaves "bubbly" noise (musical noise).</p>`,
    look: [
      'A\'s spectrogram keeps only the horizontal lines (chords). B keeps only the vertical lines (drums).',
      'Press "Sound on" and switch between A and B. From the same song you hear only the chords, then only the drums.',
      'Switch the mask to "Binary". Edges in the spectrogram cut sharply, and you hear bubbly noise (musical noise).',
      'Lower the filter lengths to 5 and the separation weakens. Raise them to 41 and short chord changes leak into the percussive part.',
    ],
    refs: ['The original median filter HPSS paper.', 'Early HPSS using horizontal and vertical smoothness of the spectrogram.', 'Extension with a separation factor and a residual part.', 'Python implementation (kernel_size, power, margin).'],
    params: {
      out: { label: 'Part to hear', group: 'Output', options: { mix: 'Original song', harm: 'Harmonic part', perc: 'Percussive part' } },
      mask: { label: 'Mask', group: 'Separation', options: { soft: 'Soft (Wiener)', binary: 'Binary' } },
      kh: { label: 'Filter length along time', help: 'In frames (1 frame = 11.6 ms).' },
      kp: { label: 'Filter length along frequency', help: 'In bins (1 bin = 21.5 Hz).' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 22050, LEN = SR * 4, N = 1024, HOP = 256, NB = N / 2 + 1, TAU = Math.PI * 2;

    // ── 원래 곡: 화음 패드 + 드럼 (정답 비교를 위해 따로 만듦) ──
    const harm = new Float32Array(LEN), perc = new Float32Array(LEN);
    {
      const chords = [[48, 60, 64, 67], [53, 57, 60, 65], [55, 59, 62, 67], [48, 60, 64, 67]];
      chords.forEach((ch, j) => {
        const i0 = j * SR, n = SR;
        for (const m of ch) {
          const f = A.mtof(m);
          for (let h = 1; h <= 6 && f * h < SR / 2; h++) {
            // 회전 페이저로 사인 생성 (Math.sin 호출을 줄임)
            const a = 0.07 / h, w = TAU * f * h / SR, cw = Math.cos(w), sw = Math.sin(w);
            let c = Math.cos(w * i0), sn = Math.sin(w * i0);
            for (let i = 0; i < n; i++) { harm[i0 + i] += a * sn * Math.min(1, i / 400, (n - i) / 400); const c2 = c * cw - sn * sw; sn = sn * cw + c * sw; c = c2; }
          }
        }
      });
      const rng = U.rng(12);
      const hit = (t0, kind, amp) => {
        const i0 = Math.round(t0 * SR); let ph = 0;
        for (let i = 0; i < SR * 0.3 && i0 + i < LEN; i++) {
          const t = i / SR;
          if (kind === 'k') { ph += TAU * (45 + 110 * Math.exp(-t * 40)) / SR; perc[i0 + i] += amp * Math.sin(ph) * Math.exp(-t * 25); }
          else if (kind === 's') perc[i0 + i] += amp * rng.range(-1, 1) * Math.exp(-t * 22);
          else perc[i0 + i] += amp * rng.range(-1, 1) * Math.exp(-t * 80);
        }
      };
      for (let b = 0; b < 16; b++) {
        const t = b * 0.25;
        if (b % 4 === 0 || b % 8 === 6) hit(t, 'k', 0.5);
        if (b % 4 === 2) hit(t, 's', 0.35);
        hit(t + 0.125, 'h', 0.15); hit(t, 'h', 0.12);
      }
    }
    const mix = new Float32Array(LEN);
    for (let i = 0; i < LEN; i++) mix[i] = harm[i] + perc[i];

    // ── STFT (한 번) ──
    const nF = Math.floor(LEN / HOP) + 1;
    const win = new Float64Array(N);
    for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(TAU * i / N);
    const XR = new Float32Array(nF * NB), XI = new Float32Array(nF * NB), MAG = new Float32Array(nF * NB);
    {
      const re = new Float64Array(N), im = new Float64Array(N);
      for (let f = 0; f < nF; f++) {
        re.fill(0); im.fill(0);
        for (let i = 0; i < N; i++) { const j = f * HOP - N / 2 + i; re[i] = j >= 0 && j < LEN ? mix[j] * win[i] : 0; }
        A.fft(re, im);
        for (let b = 0; b < NB; b++) { const k = f * NB + b; XR[k] = re[b]; XI[k] = im[b]; MAG[k] = Math.hypot(re[b], im[b]); }
      }
    }
    // 역 STFT 정규화 (창 제곱의 겹침 합)
    const wsum = new Float32Array(LEN);
    for (let f = 0; f < nF; f++) for (let i = 0; i < N; i++) { const j = f * HOP - N / 2 + i; if (j >= 0 && j < LEN) wsum[j] += win[i] * win[i]; }

    const median = (arr, n, tmp) => { for (let i = 1; i < n; i++) { const v = arr[i]; let j = i - 1; while (j >= 0 && arr[j] > v) { arr[j + 1] = arr[j]; j--; } arr[j + 1] = v; } return arr[n >> 1]; };
    let fKey = '', H = null, Pm = null, oKey = '', out = { harm: null, perc: null }, snr = { harm: 0, perc: 0 }, share = 0, img = null, iKey = '';
    function analyze() {
      const fk = P.kh + ',' + P.kp;
      if (fk !== fKey) {
        fKey = fk; oKey = '';
        H = new Float32Array(nF * NB); Pm = new Float32Array(nF * NB);
        const tmp = new Float32Array(64), kh = P.kh, kp = P.kp, hh = kh >> 1, hp = kp >> 1;
        for (let b = 0; b < NB; b++) for (let f = 0; f < nF; f++) {
          let n = 0; for (let j = f - hh; j <= f + hh; j++) tmp[n++] = j >= 0 && j < nF ? MAG[j * NB + b] : 0;
          H[f * NB + b] = median(tmp, n);
        }
        for (let f = 0; f < nF; f++) for (let b = 0; b < NB; b++) {
          let n = 0; for (let j = b - hp; j <= b + hp; j++) tmp[n++] = j >= 0 && j < NB ? MAG[f * NB + j] : 0;
          Pm[f * NB + b] = median(tmp, n);
        }
      }
      const ok = fk + P.mask;
      if (ok !== oKey) {
        oKey = ok; iKey = '';
        // 마스크 → 역 STFT
        const re = new Float64Array(N), im = new Float64Array(N);
        const yH = new Float32Array(LEN), yP = new Float32Array(LEN);
        for (let f = 0; f < nF; f++) {
          for (const [dst, isH] of [[yH, true], [yP, false]]) {
            for (let b = 0; b < NB; b++) {
              const k = f * NB + b, h2 = H[k] * H[k], p2 = Pm[k] * Pm[k];
              let m = P.mask === 'binary' ? (H[k] > Pm[k] ? 1 : 0) : h2 / (h2 + p2 + 1e-20);
              if (!isH) m = 1 - m;
              re[b] = XR[k] * m; im[b] = XI[k] * m;
              if (b > 0 && b < N / 2) { re[N - b] = re[b]; im[N - b] = -im[b]; }
            }
            A.fft(re, im, true);
            for (let i = 0; i < N; i++) { const j = f * HOP - N / 2 + i; if (j >= 0 && j < LEN) dst[j] += re[i] * win[i]; }
          }
        }
        let eH = 0, eM = 0;
        for (let i = 0; i < LEN; i++) { const w = wsum[i] > 1e-6 ? wsum[i] : 1; yH[i] /= w; yP[i] /= w; eH += yH[i] * yH[i]; eM += yP[i] * yP[i]; }
        out = { harm: yH, perc: yP };
        share = eH / (eH + eM + 1e-12) * 100;
        // 분리 품질: 정답 성분과의 SNR
        const snrOf = (est, ref) => { let s = 0, e = 0; for (let i = 0; i < LEN; i++) { s += ref[i] * ref[i]; const d = est[i] - ref[i]; e += d * d; } return 10 * Math.log10(s / (e + 1e-12)); };
        snr = { harm: snrOf(yH, harm), perc: snrOf(yP, perc) };
      }
      // 고른 성분의 스펙트로그램 이미지
      const ik = oKey + P.out;
      if (ik !== iKey) {
        iKey = ik;
        const rows = 160, CM = [[0, 0, 4], [40, 11, 84], [101, 21, 110], [159, 42, 99], [212, 72, 66], [245, 125, 21], [250, 193, 39], [252, 255, 164]];
        img = ctx.createCanvas(nF, rows);
        const ig = img.getContext('2d'), id = ig.createImageData(nF, rows), d = id.data;
        let mx = 1e-9; for (let k = 0; k < MAG.length; k++) mx = Math.max(mx, MAG[k]);
        for (let r = 0; r < rows; r++) {
          const fr = 60 * Math.pow(8000 / 60, (rows - 1 - r) / (rows - 1)), b = Math.min(NB - 1, Math.round(fr * N / SR));
          for (let f = 0; f < nF; f++) {
            const k = f * NB + b, h2 = H[k] * H[k], p2 = Pm[k] * Pm[k];
            const mh = P.mask === 'binary' ? (H[k] > Pm[k] ? 1 : 0) : h2 / (h2 + p2 + 1e-20);
            const m = P.out === 'mix' ? 1 : P.out === 'harm' ? mh : 1 - mh;
            const t = U.clamp((20 * Math.log10(MAG[k] * m / mx + 1e-9) + 70) / 70, 0, 1) * 7, i = Math.min(6, Math.floor(t)), q = t - i, a = CM[i], c = CM[i + 1], o = (r * nF + f) * 4;
            d[o] = a[0] + (c[0] - a[0]) * q; d[o + 1] = a[1] + (c[1] - a[1]) * q; d[o + 2] = a[2] + (c[2] - a[2]) * q; d[o + 3] = 255;
          }
        }
        ig.putImageData(id, 0, 0);
      }
    }
    analyze();

    // 긴 버퍼를 열마다 최대, 최소 쌍으로 줄여 둠 (매 프레임 수만 샘플을 훑지 않게)
    const decimate = (b, cols = 1024) => { const o = new Float32Array(cols * 2), s = b.length / cols; for (let c = 0; c < cols; c++) { let lo = Infinity, hi = -Infinity; for (let i = Math.floor(c * s); i < Math.floor((c + 1) * s); i++) { const v = b[i]; if (v < lo) lo = v; if (v > hi) hi = v; } o[2 * c] = hi; o[2 * c + 1] = lo; } return o; };
    const decs = new Map();
    const decOf = (b) => { let d = decs.get(b); if (!d) { if (decs.size > 8) decs.clear(); d = decimate(b); decs.set(b, d); } return d; };
    const cur = () => (P.out === 'mix' ? mix : out[P.out]);
    const live = { pos: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr, b = cur();
        for (let i = 0; i < n; i++) {
          const i0 = Math.floor(live.pos), v = b[i0] * 0.8;
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= LEN) live.pos -= LEN;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H2 = ctx.height, pad = 10, tw = W - pad * 2;
        const sh = Math.max(80, H2 * 0.6);
        g.imageSmoothingEnabled = false; g.drawImage(img, pad, pad, tw, sh); g.imageSmoothingEnabled = true;
        const name = { mix: Lg('원래 곡', 'Original song'), harm: Lg('화성 성분', 'Harmonic part'), perc: Lg('타악 성분', 'Percussive part') }[P.out];
        D.text(g, Lg(`스펙트로그램: ${name} (60Hz~8kHz, 로그 축)`, `Spectrogram: ${name} (60 Hz to 8 kHz, log axis)`), pad + 4, pad + 3, { size: 10, color: '#fff' });
        const wy = pad * 2 + sh, wh = H2 - wy - pad;
        const ref = P.out === 'harm' ? harm : P.out === 'perc' ? perc : null;
        A.drawWave(g, decOf(cur()), pad, wy, tw, wh, { color: col, amp: 1.6, lineWidth: 1, label: ref ? Lg('분리 결과 파형 (흐린 선 = 정답)', 'Separated waveform (faint = truth)') : Lg('원래 곡 파형', 'Original waveform') });
        if (ref) A.drawWave(g, decOf(ref), pad, wy, tw, wh, { color: 'rgba(255,255,255,0.25)', amp: 1.6, lineWidth: 1, background: false, axis: false });
        if (snd.on) { const px = pad + live.pos / LEN * tw; D.line(g, px, pad, px, H2 - pad, '#fff', 1); }
        ctx.stat(Lg('분리 품질 (화성, SNR)', 'Separation quality (harmonic, SNR)'), snr.harm.toFixed(1) + ' dB');
        ctx.stat(Lg('분리 품질 (타악, SNR)', 'Separation quality (percussive, SNR)'), snr.perc.toFixed(1) + ' dB');
        ctx.stat(Lg('화성 성분 에너지 비율', 'Harmonic energy share'), share.toFixed(1) + '%');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
