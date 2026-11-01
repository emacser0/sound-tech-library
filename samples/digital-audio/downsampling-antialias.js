// 다운샘플링과 안티에일리어싱 필터: 샘플을 솎아 내기 전에 새 나이퀴스트 위를 지우지 않으면 고음이 접혀 들어옴
GTL.register({
  id: 'downsampling-antialias',
  title: '다운샘플링과 안티에일리어싱 필터',
  summary: '48 kHz 신호를 M개마다 하나씩 남겨 샘플레이트를 낮춤. 그냥 솎아 내면 새 나이퀴스트 위의 성분이 접혀 들어오고, 먼저 로우패스로 지우면 깨끗함.',
  views: { a: '그냥 솎아 내기', b: '로우패스 후 솎아 내기' },
  controls: '파라미터 표에서 솎아 내는 비율과 원본 소리를 바꿈',
  info: `
    <p><b>다운샘플링(Decimation)</b>은 M개 샘플 중 하나만 남겨 샘플레이트를 1/M로 줄이는 일. 저장 공간과 계산량을 줄이거나, 오버샘플링한 처리를 원래 레이트로 돌릴 때 씀.</p>
    <p>샘플레이트가 줄면 나이퀴스트 주파수도 1/M로 내려감. 원래 신호에 그 위의 성분이 있으면 솎아 낸 결과에서 아래로 접힘(에일리어싱). 한번 접힌 성분은 원래 성분과 섞여 나중에 지울 수 없음.</p>
    <ul>
      <li>해결: 솎아 내기 전에 새 나이퀴스트 아래로 차단하는 로우패스(<b>안티에일리어싱 필터</b>)를 거침</li>
      <li>여기서는 블랙먼 창 윈도 싱크 FIR 101탭, 차단 주파수는 새 나이퀴스트의 80%</li>
      <li>남길 샘플에서만 필터를 계산하면 비용이 1/M로 줆 (폴리페이즈 구조의 핵심)</li>
      <li>단점: 필터 길이만큼 지연이 생기고, 차단 주파수 근처 고음이 조금 깎임</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="20" y="34" class="t-small">${L('48 kHz 입력', '48 kHz input')}</text>
    <path d="M100,30 H150" class="d-line" marker-end="url(#arr)"/>
    <rect x="152" y="14" width="120" height="32" class="f-dim"/><text x="212" y="34" text-anchor="middle" class="t-small t-b">${L('로우패스 (fs/2M)', 'Lowpass (fs/2M)')}</text>
    <path d="M272,30 H320" class="d-line" marker-end="url(#arr)"/>
    <rect x="322" y="14" width="80" height="32" class="f-dim"/><text x="362" y="34" text-anchor="middle" class="t-small">↓M</text>
    <path d="M402,30 H440" class="d-line" marker-end="url(#arr)"/>
    <text x="444" y="34" class="t-small">${L('48/M kHz', '48/M kHz')}</text>
    <path d="M100,40 C130,70 300,70 330,46" class="d-a" stroke-dasharray="4 3" marker-end="url(#arr)"/>
    <text x="215" y="76" text-anchor="middle" class="t-small t-a">${L('A: 필터를 건너뜀', 'A: skips the filter')}</text>
    <line x1="40" y1="128" x2="500" y2="128" class="d-line"/>
    <line x1="160" y1="96" x2="160" y2="136" class="d-dim" stroke-dasharray="4 3"/>
    <text x="160" y="92" text-anchor="middle" class="t-small">${L('새 나이퀴스트', 'new Nyquist')}</text>
    <line x1="230" y1="128" x2="230" y2="104" class="d-a"/>
    <line x1="90" y1="128" x2="90" y2="104" class="d-a" stroke-dasharray="3 2"/>
    <path d="M226,106 Q160,84 94,106" class="d-accent" marker-end="url(#arr)"/>
    <text x="290" y="118" class="t-small t-dim">${L('위의 성분이 거울처럼 접힘', 'Content above folds back like a mirror')}</text>
  </svg>`,
  look: [
    'A의 스펙트로그램에서 훑기 선이 위쪽 끝에 닿은 뒤 다시 아래로 꺾여 내려옴. B는 위쪽 끝에서 선이 사라짐.',
    '"소리 켜기"로 A를 들으면 올라가던 음이 중간부터 내려가고 다시 올라가기를 반복',
    '솎아 내는 비율을 8로 올리면 A의 접힌 선이 더 많아지고 "에일리어싱 성분" 측정값이 커짐',
    '원본을 "배음이 많은 음"으로 바꾸면 A에는 음과 무관한 가로줄이 여러 개 생김',
  ],
  refs: [
    { type: 'paper', title: 'R. E. Crochiere, L. R. Rabiner, "Interpolation and Decimation of Digital Signals: A Tutorial Review", Proceedings of the IEEE 69(3)', year: 1981, note: '다운샘플링, 폴리페이즈 필터' },
    { type: 'book', title: 'Julius O. Smith III, Spectral Audio Signal Processing', url: 'https://ccrma.stanford.edu/~jos/sasp/', note: '윈도 방식 FIR 설계' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '샘플레이트 변환' },
    { type: 'article', title: 'MDN, AudioBuffer', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer', note: '낮은 샘플레이트 버퍼를 브라우저가 재생할 때 리샘플링함' },
  ],
  params: [
    { key: 'filter', label: '안티에일리어싱 필터', type: 'bool', a: false, b: true, default: false, group: '다운샘플러' },
    { key: 'M', label: '솎아 내는 비율 M', type: 'select', options: [2, 3, 4, 6, 8].map((v) => ({ value: v, label: String(v) })), default: 4, shared: true, help: '출력 샘플레이트 = 48 kHz / M' },
    { key: 'src', label: '원본 소리', type: 'select', options: [{ value: 'sweep', label: '주파수 훑기 (50 Hz~20 kHz)' }, { value: 'tone', label: '배음이 많은 음 (330 Hz)' }], default: 'sweep', shared: true, reset: true, group: '원본' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Downsampling and the Anti-Aliasing Filter',
    summary: 'A 48 kHz signal keeps only one of every M samples to lower the sample rate. Plain dropping folds everything above the new Nyquist back down. A lowpass first removes it and the result stays clean.',
    views: { a: 'Plain dropping', b: 'Lowpass, then drop' },
    controls: 'Change the decimation factor and source sound in the parameter table.',
    info: `
    <p><b>Downsampling (decimation)</b> keeps one sample out of every M and lowers the sample rate to 1/M. It saves storage and CPU, and it brings oversampled processing back to the original rate.</p>
    <p>A lower sample rate also lowers the Nyquist frequency to 1/M. Any content above it folds down in the result (aliasing). Once folded, it mixes with the real content and cannot be removed later.</p>
    <ul>
      <li>Fix: before dropping samples, run a lowpass that cuts below the new Nyquist (<b>anti-aliasing filter</b>).</li>
      <li>Here: a 101 tap windowed-sinc FIR with a Blackman window. The cutoff is 80% of the new Nyquist.</li>
      <li>Computing the filter only at the samples you keep cuts the cost to 1/M (the core of the polyphase structure).</li>
      <li>Drawbacks: the filter adds delay, and highs near the cutoff get slightly dull.</li>
    </ul>`,
    look: [
      'In A\'s spectrogram the sweep line hits the top edge and bends back down. In B the line disappears at the top edge.',
      'Press "Sound on" and listen to A. The rising tone turns down halfway, then goes up again, over and over.',
      'Raise the decimation factor to 8. A gets more folded lines and the "Aliased content" stat grows.',
      'Set the source to "Harmonic tone". A gets several horizontal lines that have nothing to do with the note.',
    ],
    refs: ['Decimation and polyphase filters.', 'Window-method FIR design.', 'Sample rate conversion.', 'The browser resamples low sample rate buffers on playback.'],
    params: {
      filter: { label: 'Anti-aliasing filter', group: 'Downsampler' },
      M: { label: 'Decimation factor M', help: 'Output rate = 48 kHz / M' },
      src: { label: 'Source sound', group: 'Source', options: { sweep: 'Frequency sweep (50 Hz to 20 kHz)', tone: 'Harmonic tone (330 Hz)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, DUR = 4, LEN = SR * DUR, TAU = Math.PI * 2, TAPS = 101;
    const F0 = 50, F1 = 20000;

    // 원본 4초 (두 뷰가 같음)
    const src = new Float32Array(LEN);
    if (P.src === 'sweep') {
      let ph = 0;
      for (let i = 0; i < LEN; i++) {
        const f = F0 * Math.pow(F1 / F0, i / LEN);
        ph += f / SR; if (ph >= 1) ph -= 1;
        const env = Math.min(1, i / 2000, (LEN - i) / 2000);
        src[i] = Math.sin(TAU * ph) * 0.5 * env;
      }
    } else {
      const f = 330, K = Math.floor(20000 / f);
      for (let h = 1; h <= K; h++) {
        const a = 0.3 / h, w = TAU * f * h / SR, c = Math.cos(w);
        let s0 = 0, s1 = Math.sin(w);
        for (let i = 1; i < LEN; i++) { src[i] += a * s1; const s2 = 2 * c * s1 - s0; s0 = s1; s1 = s2; }
      }
    }

    function design(M) {
      const fc = 0.8 / M, h = new Float32Array(TAPS), mid = (TAPS - 1) / 2;
      for (let j = 0; j < TAPS; j++) {
        const t = j - mid, s = t === 0 ? 1 : Math.sin(Math.PI * fc * t) / (Math.PI * fc * t);
        const w = 0.42 - 0.5 * Math.cos(TAU * j / (TAPS - 1)) + 0.08 * Math.cos(2 * TAU * j / (TAPS - 1));
        h[j] = fc * s * w;
      }
      return h;
    }
    const fir = (h, i) => { let s = 0; const mid = (TAPS - 1) / 2; for (let j = 0; j < TAPS; j++) { const k = i - mid + j; if (k >= 0 && k < LEN) s += h[j] * src[k]; } return s; };

    const resp = new Float32Array(201);
    let key = '', out = null, h = null, img = null, aliasDb = 0, srOut = 12000;
    const SPW = 160, NF = 256, SPH = NF / 2;
    const spec = ctx.createCanvas(SPW, SPH), sg = spec.getContext('2d');
    function analyze() {
      const M = +P.M, k = M + '|' + P.filter;
      if (k === key) return;
      key = k; srOut = SR / M;
      h = design(M);
      for (let i = 0; i <= 200; i++) { // 필터 응답 (dB), 0~24 kHz 201점
        let re = 0, im = 0; const wv = TAU * (i / 200) * 24000 / SR;
        for (let j = 0; j < TAPS; j++) { re += h[j] * Math.cos(wv * j); im -= h[j] * Math.sin(wv * j); }
        resp[i] = A.linToDb(Math.hypot(re, im));
      }
      const L2 = Math.floor(LEN / M);
      out = new Float32Array(L2);
      for (let n = 0; n < L2; n++) out[n] = P.filter ? fir(h, n * M) : src[n * M];
      // 접힐 성분: 솎아 내기 전 신호에서 새 나이퀴스트 위의 파워 / 전체 파워
      const hp = [0, 1, 2, 3].map(() => A.biquad('highpass', srOut / 2, 0.707, 0, SR));
      let pa = 0, pt = 0;
      for (let i = 0; i < LEN; i++) {
        const x = P.filter ? fir(h, i) : src[i];
        let v = x; for (const b of hp) v = b.process(v);
        pa += v * v; pt += x * x;
      }
      aliasDb = 10 * Math.log10(pa / Math.max(1e-30, pt) + 1e-12);
      // 스펙트로그램
      img = sg.createImageData(SPW, SPH);
      const re = new Float64Array(NF), im = new Float64Array(NF), hop = (L2 - NF) / (SPW - 1);
      for (let c = 0; c < SPW; c++) {
        const off = Math.floor(c * hop);
        for (let i = 0; i < NF; i++) { re[i] = (out[off + i] || 0) * (0.5 - 0.5 * Math.cos(TAU * i / (NF - 1))); im[i] = 0; }
        A.fft(re, im);
        for (let b = 0; b < SPH; b++) {
          const db = A.linToDb(Math.hypot(re[b], im[b]) * 4 / NF);
          const v = U.clamp((db + 90) / 90, 0, 1), p = ((SPH - 1 - b) * SPW + c) * 4;
          img.data[p] = 255 * Math.pow(v, 1.5); img.data[p + 1] = 255 * Math.pow(v, 2.5) * 0.9; img.data[p + 2] = 80 + 175 * v * (1 - v) * 2; img.data[p + 3] = 255;
        }
      }
      sg.putImageData(img, 0, 0);
      if (snd.on) snd.playBuffer(out, srOut, { loop: true, gain: 1 });
    }

    const snd = A.player(ctx, { onStart: (s) => { key = ''; analyze(); } });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const th = Math.max(60, H * 0.58);
        D.rect(g, pad, pad, w, th, '#000');
        g.imageSmoothingEnabled = false;
        g.drawImage(spec, pad, pad, w, th);
        g.imageSmoothingEnabled = true;
        const nyq = srOut / 2;
        if (P.src === 'sweep') { // 입력 주파수(점선), 화면 위로 나가면 끊김
          g.setLineDash([3, 4]); g.beginPath();
          let started = false;
          for (let i = 0; i <= 100; i++) {
            const f = F0 * Math.pow(F1 / F0, i / 100);
            if (f > nyq) break;
            const px = pad + (i / 100) * w, py = pad + th - (f / nyq) * th;
            started ? g.lineTo(px, py) : g.moveTo(px, py); started = true;
          }
          g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 1; g.stroke(); g.setLineDash([]);
        }
        D.text(g, Lx(`출력 스펙트로그램 (세로 0~${(nyq / 1000).toFixed(1)} kHz, 가로 4초)`, `Output spectrogram (vertical 0 to ${(nyq / 1000).toFixed(1)} kHz, horizontal 4 s)`), pad + 4, pad + 3, { size: 10, color: C.text });
        // 필터 응답 (선형 축 0~24 kHz)
        const ry = pad * 2 + th, rh = H - ry - pad;
        D.rect(g, pad, ry, w, rh, 'rgba(0,0,0,0.35)');
        const nx = pad + (nyq / 24000) * w;
        D.rect(g, nx, ry, pad + w - nx, rh, 'rgba(255,83,112,0.1)');
        g.setLineDash([4, 3]); D.line(g, nx, ry, nx, ry + rh, C.warn, 1); g.setLineDash([]);
        D.text(g, Lx('새 나이퀴스트', 'New Nyquist'), nx + 3, ry + 16, { size: 9, color: C.warn });
        const dbY = (db) => ry + 14 + U.clamp(-db / 100, 0, 1) * (rh - 18);
        g.beginPath();
        for (let i = 0; i <= 200; i++) {
          const db = P.filter ? resp[i] : 0;
          const px = pad + (i / 200) * w;
          i ? g.lineTo(px, dbY(db)) : g.moveTo(px, dbY(db));
        }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, Lx(P.filter ? '필터 응답 (0 ~ -100 dB, 0~24 kHz)' : '필터 없음: 모든 주파수 통과', P.filter ? 'Filter response (0 to -100 dB, 0 to 24 kHz)' : 'No filter: every frequency passes'), pad + 4, ry + 3, { size: 10, color: C.dim });

        ctx.stat(Lx('출력 샘플레이트', 'Output sample rate'), srOut.toFixed(0) + ' Hz');
        ctx.stat(Lx('에일리어싱 성분', 'Aliased content'), aliasDb.toFixed(1) + ' dB');
        ctx.stat(Lx('필터 비용', 'Filter cost'), P.filter ? Lx(`출력 샘플당 ${TAPS}탭`, `${TAPS} taps per output sample`) : '0');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
