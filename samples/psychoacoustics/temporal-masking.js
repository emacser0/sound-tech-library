// 시간 마스킹: 큰 소리의 앞(사전 마스킹)과 뒤(사후 마스킹)에 있는 작은 소리가 가려짐
GTL.register({
  id: 'temporal-masking',
  title: '시간 마스킹 (사전, 사후)',
  summary: '큰 소리가 끝난 직후의 작은 소리는 들리지 않음. 마스커가 끝나고 150 ms 뒤에 오는 A의 프로브는 들리고, 10 ms 뒤에 오는 B의 같은 프로브는 사후 마스킹에 묻힘.',
  views: { a: '프로브가 늦게 옴', b: '프로브가 바로 뒤' },
  controls: '파라미터 표에서 프로브 위치와 레벨을 바꿈. "소리 켜기"를 누르면 잡음(마스커)과 짧은 삐 소리(프로브)가 반복됨.',
  info: `
    <p>마스킹은 같은 시각에만 일어나지 않음. 큰 소리 <b>뒤</b>로 약 100~200 ms 동안 귀의 감도가 서서히 돌아오는 것을 <b>사후 마스킹(Post-masking, forward masking)</b>이라 부름.</p>
    <p>큰 소리 <b>앞</b>의 약 20 ms에서도 마스킹이 일어남. 이것이 <b>사전 마스킹(Pre-masking, backward masking)</b>. 큰 소리가 신경에 더 빨리 전달되어 앞선 작은 소리의 처리를 덮는 것으로 설명함.</p>
    <ul>
      <li>사후 마스킹은 로그 시간에 대해 거의 직선으로 줄어듦. 5 ms 뒤에도 꽤 크고, 200 ms쯤 사라짐.</li>
      <li>사전 마스킹은 짧고 가파름</li>
      <li>MP3, AAC는 사전 마스킹이 짧아서 변환 블록 앞에 퍼지는 양자화 잡음(프리 에코, Pre-echo)이 들림. 그래서 타악기 앞에서 짧은 블록으로 바꿔 씀(블록 전환).</li>
      <li>컴프레서와 게이트의 릴리스, 믹스에서 큰 타격음 뒤의 작은 소리가 묻히는 현상도 같은 원리</li>
    </ul>
    <p>이 샘플의 곡선은 Zwicker, Fastl의 측정 모양을 흉내 낸 단순 모델 (사후: 로그 시간에 선형, 사전: 20 ms 선형). 실제 값은 마스커 길이, 주파수, 사람에 따라 다름.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="150" x2="520" y2="150" class="d-line"/>
    <text x="520" y="168" text-anchor="end" class="t-small t-dim">${L('시간', 'Time')}</text>
    <rect x="160" y="40" width="160" height="110" class="f-dim"/>
    <text x="240" y="100" text-anchor="middle">${L('마스커 (200 ms)', 'Masker (200 ms)')}</text>
    <path d="M110,148 L160,52" class="d-b"/>
    <path d="M320,52 C340,80 380,110 470,146" class="d-b"/>
    <text x="100" y="40" text-anchor="middle" class="t-small t-b">${L('사전 마스킹 (~20 ms)', 'Pre-masking (~20 ms)')}</text>
    <text x="420" y="80" text-anchor="middle" class="t-small t-b">${L('사후 마스킹 (~200 ms)', 'Post-masking (~200 ms)')}</text>
    <circle cx="335" cy="100" r="5" class="f-bad"/><text x="335" y="122" text-anchor="middle" class="t-small">${L('가려짐', 'masked')}</text>
    <circle cx="490" cy="120" r="5" class="f-good"/><text x="490" y="140" text-anchor="middle" class="t-small">${L('들림', 'heard')}</text>
  </svg>`,
  look: [
    '기본값에서 A의 프로브는 임계값 위라 "들림", B는 같은 레벨인데 사후 마스킹 곡선 아래라 "가려짐"',
    'B의 프로브 위치를 250 ms (마스커 끝 50 ms 뒤)로 옮기면 임계값이 낮아져 다시 들림',
    '프로브 위치를 -5 ms(마스커 시작 5 ms 전)로 옮기면 사전 마스킹 때문에 가려짐. -40 ms면 들림.',
    '"소리 켜기"를 누르고 두 뷰를 번갈아 들으면 A에서만 잡음 뒤의 삐 소리가 들림',
  ],
  refs: [
    { type: 'book', title: 'Zwicker, Fastl, Psychoacoustics: Facts and Models (3rd ed.)', year: 2007, note: '사전, 사후 마스킹 측정 곡선' },
    { type: 'book', title: 'Brian C. J. Moore, An Introduction to the Psychology of Hearing (6th ed.)', year: 2012, note: '전방, 후방 마스킹의 원인' },
    { type: 'paper', title: 'Painter, Spanias, "Perceptual coding of digital audio", Proceedings of the IEEE 88(4)', year: 2000, note: '시간 마스킹과 프리 에코, 블록 전환' },
    { type: 'paper', title: 'Brandenburg, Stoll, "ISO-MPEG-1 Audio: A generic standard for coding of high-quality digital audio", JAES 42(10)', year: 1994, note: 'MPEG-1 오디오의 심리음향 모델과 블록 전환' },
  ],
  params: [
    { key: 'pos', label: '프로브 위치 (ms)', type: 'range', min: -100, max: 480, step: 1, a: 350, b: 210, default: 350, help: '마스커 시작이 0 ms, 끝이 200 ms', group: '프로브' },
    { key: 'pLevel', label: '프로브 레벨 (dB SPL)', type: 'range', min: 0, max: 70, step: 1, default: 35, shared: true },
    { key: 'pFreq', label: '프로브 주파수 (Hz)', type: 'select', options: [{ value: 1000, label: '1 kHz' }, { value: 2000, label: '2 kHz' }, { value: 4000, label: '4 kHz' }], default: 2000, shared: true },
    { key: 'mLevel', label: '마스커 레벨 (dB SPL)', type: 'range', min: 40, max: 80, step: 1, default: 70, shared: true, group: '마스커 (백색 잡음)' },
    { key: 'masker', label: '마스커', type: 'bool', default: true, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Temporal Masking (Pre & Post)',
    summary: 'A quiet sound right after a loud sound ends is not heard. A\'s probe comes 150 ms after the masker ends and is heard. B\'s same probe comes 10 ms after and is lost in post-masking.',
    views: { a: 'Probe comes late', b: 'Probe right after' },
    controls: 'Change the probe position and level in the parameter table. Press "Sound on" to hear the noise (masker) and a short beep (probe) repeat.',
    info: `
    <p>Masking does not happen only at the same moment. After a loud sound, the ear\'s sensitivity comes back slowly over about 100~200 ms. This is <b>post-masking (forward masking)</b>.</p>
    <p>Masking also happens about 20 ms <b>before</b> a loud sound. This is <b>pre-masking (backward masking)</b>. One explanation: the loud sound reaches the brain faster and covers the processing of the earlier quiet sound.</p>
    <ul>
      <li>Post-masking falls almost linearly on a log time axis. It is still strong after 5 ms and is gone at about 200 ms.</li>
      <li>Pre-masking is short and steep.</li>
      <li>In MP3 and AAC, pre-masking is short, so quantization noise that spreads before a transient (pre-echo) is heard. Coders switch to short blocks before drums (block switching).</li>
      <li>Compressor and gate release, and quiet sounds getting lost after a big hit in a mix, follow the same idea.</li>
    </ul>
    <p>The curve here is a simple model that copies the shape of Zwicker and Fastl\'s measurements (post: linear in log time, pre: linear over 20 ms). Real values depend on masker length, frequency and the listener.</p>`,
    look: [
      'With the defaults, A\'s probe is above the threshold ("audible"). B has the same level but sits under the post-masking curve ("masked").',
      'Move B\'s probe to 250 ms (50 ms after the masker ends). The threshold is lower and the probe is heard again.',
      'Move the probe to -5 ms (5 ms before the masker starts). Pre-masking hides it. At -40 ms it is heard.',
      'Press "Sound on" and switch between the views. Only in A do you hear the beep after the noise.',
    ],
    refs: ['Measured pre- and post-masking curves.', 'Causes of forward and backward masking.', 'Temporal masking, pre-echo and block switching.', 'Psychoacoustic model and block switching in MPEG-1 audio.'],
    params: {
      pos: { label: 'Probe position (ms)', help: 'The masker starts at 0 ms and ends at 200 ms', group: 'Probe' },
      pLevel: 'Probe level (dB SPL)',
      pFreq: 'Probe frequency (Hz)',
      mLevel: { label: 'Masker level (dB SPL)', group: 'Masker (white noise)' },
      masker: 'Masker',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const FS_SPL = 80, DUR = 200, QUIET = 10; // 짧은 톤 버스트의 조용한 곳 임계값(근사)
    // 시각 t(ms, 마스커 시작 = 0)의 마스킹 임계값 (dB SPL)
    function thrAt(t) {
      if (!P.masker) return QUIET;
      const top = P.mLevel - 5;
      let m = -Infinity;
      if (t >= 0 && t <= DUR) m = top;
      else if (t > DUR) { const d = t - DUR; m = top - (top - QUIET) * Math.min(1, Math.log10(1 + d / 5) / Math.log10(1 + 200 / 5)); }
      else { const d = -t; m = d < 20 ? (top - 15) - (top - 15 - QUIET) * (d / 20) : QUIET; }
      return Math.max(QUIET, m);
    }

    const rng = U.rng(ctx.seed || 1);
    const LOOP = 0.9, T0 = -0.2; // 반복 주기(초), 주기 시작 시각(초, 마스커 시작 기준)
    let t = 0, gM = 0, ph = 0, lp1 = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const ampM = P.masker ? A.dbToLin(P.mLevel - FS_SPL) * Math.sqrt(3) * Math.SQRT1_2 : 0; // 균등 잡음 RMS를 같은 레벨 사인파 RMS에 맞춤
        const ampP = A.dbToLin(P.pLevel - FS_SPL), pc = P.pos / 1000, pw = 0.012;
        for (let i = 0; i < n; i++) {
          const tm = T0 + (t % LOOP);
          const on = tm >= 0 && tm < DUR / 1000 ? 1 : 0;
          gM += (on * ampM - gM) * 0.02;
          lp1 += (rng.range(-1, 1) - lp1) * 0.7;
          const dp = tm - (pc - pw / 2);
          const env = dp >= 0 && dp < pw ? 0.5 - 0.5 * Math.cos(2 * Math.PI * dp / pw) : 0;
          const v = gM * lp1 * 1.3 + ampP * env * Math.sin(ph);
          l[i] = v; r[i] = v;
          ph += 2 * Math.PI * Number(P.pFreq) / sr; if (ph > 6.283185307) ph -= 6.283185307;
          t += 1 / sr;
        }
      },
    });

    const TMIN = -100, TMAX = 500, DBMIN = 0, DBMAX = 85;
    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const gx = pad + 26, gy = pad + 18, gw = W - gx - pad, gh = H - gy - 30;
        const xOf = (ms) => gx + gw * (ms - TMIN) / (TMAX - TMIN);
        const yOf = (db) => gy + gh - U.clamp((db - DBMIN) / (DBMAX - DBMIN), -0.02, 1.02) * gh;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        for (let ms = -100; ms <= 500; ms += 100) { D.line(g, xOf(ms), gy, xOf(ms), gy + gh, C.grid); D.text(g, ms + ' ms', xOf(ms) + 2, gy + gh + 3, { size: 9, color: C.dim }); }
        for (let db = 0; db <= 80; db += 20) { D.line(g, gx, yOf(db), gx + gw, yOf(db), C.grid); D.text(g, String(db), gx - 4, yOf(db) - 5, { size: 9, color: C.dim, align: 'right' }); }
        D.text(g, L('x: 시간 (마스커 시작 = 0), y: dB SPL', 'x: time (masker start = 0), y: dB SPL'), gx, pad, { size: 10, color: C.dim });
        if (P.masker) {
          D.rect(g, xOf(0), yOf(P.mLevel), xOf(DUR) - xOf(0), gy + gh - yOf(P.mLevel), 'rgba(199,146,234,0.35)');
          D.text(g, L('마스커', 'Masker'), xOf(DUR / 2), yOf(P.mLevel) + 4, { size: 10, align: 'center', color: C.accent });
        }
        // 임계값 곡선과 가려지는 영역
        g.beginPath();
        const steps = Math.max(100, Math.floor(gw / 2));
        for (let i = 0; i <= steps; i++) { const ms = TMIN + (TMAX - TMIN) * i / steps, x = xOf(ms), y = yOf(thrAt(ms)); i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        g.lineTo(xOf(TMAX), gy + gh); g.lineTo(xOf(TMIN), gy + gh); g.closePath();
        g.fillStyle = ctx.side === 'a' ? 'rgba(255,122,89,0.10)' : 'rgba(79,195,247,0.12)'; g.fill();
        D.text(g, L('마스킹 임계값', 'Masking threshold'), xOf(DUR) + 8, yOf(thrAt(DUR + 15)) - 14, { size: 10, color: col });
        // 프로브
        const thr = thrAt(P.pos), margin = P.pLevel - thr, heard = margin > 0;
        const px = xOf(P.pos), py = yOf(P.pLevel);
        D.line(g, px, gy + gh, px, py, heard ? C.good : C.bad, 3);
        D.circle(g, px, py, 5, heard ? C.good : C.bad);
        D.text(g, heard ? L('들림', 'audible') : L('가려짐', 'masked'), px + 7, py - 14, { size: 11, color: heard ? C.good : C.bad });
        // 재생 위치
        if (snd.on && snd.audible) { const tm = (T0 + (t % LOOP)) * 1000; if (tm <= TMAX) D.line(g, xOf(tm), gy, xOf(tm), gy + gh, 'rgba(255,255,255,0.4)', 1); }
        const rel = P.pos > DUR ? L(`마스커 끝 ${(P.pos - DUR).toFixed(0)} ms 뒤`, `${(P.pos - DUR).toFixed(0)} ms after masker end`)
          : P.pos < 0 ? L(`마스커 시작 ${(-P.pos).toFixed(0)} ms 전`, `${(-P.pos).toFixed(0)} ms before masker start`) : L('마스커와 동시', 'during masker');
        ctx.stat(L('프로브 시각', 'Probe time'), rel);
        ctx.stat(L('임계값', 'Threshold'), thr.toFixed(1) + ' dB SPL');
        ctx.stat(L('여유', 'Margin'), (margin >= 0 ? '+' : '') + margin.toFixed(1) + ' dB');
        ctx.stat(L('판정', 'Verdict'), heard ? L('들림', 'audible') : L('가려짐', 'masked'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
