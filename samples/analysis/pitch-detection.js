// 피치 검출: 영교차율(ZCR) vs 자기상관(ACF) vs YIN. 기음이 약하고 잡음이 섞인 노래 같은 신호에서 비교
GTL.register({
  id: 'pitch-detection',
  title: '피치 검출 (영교차, 자기상관, YIN)',
  summary: '파형이 0을 지나는 횟수로 음 높이를 세면 배음과 잡음에 쉽게 속음. 자기상관과 YIN은 파형이 자기 자신과 다시 닮는 주기를 찾아서 기음이 약해도 맞는 음 높이를 찾음.',
  views: { a: '영교차율 (ZCR)', b: 'YIN' },
  controls: '위 그래프를 클릭하거나 끌면 그 시각의 프레임을 아래에 자세히 보여 줌. "소리 켜기"를 누르면 원래 신호와 검출된 음 높이의 사인파가 함께 들림.',
  info: `
    <p><b>피치 검출(Pitch Detection)</b>은 소리의 기본 주파수(f0)를 찾는 일. 튜너, 오토튠, 음성 분석, 노래 채점, MIDI 변환의 첫 단계.</p>
    <ul>
      <li><b>영교차율(ZCR)</b>: 파형이 0을 지나는 횟수 ÷ 2 ÷ 시간. 순수한 사인파에서만 맞음. 2배음이 강하면 0을 더 자주 지나 한 옥타브 높게, 잡음이 있으면 엉뚱하게 높게 나옴.</li>
      <li><b>자기상관(ACF)</b>: 신호를 τ만큼 밀어 원래 신호와 곱해 더함. 주기만큼 밀었을 때 가장 크게 닮음. 배음에 강하지만 주기의 2배, 3배에서도 봉우리가 생겨 옥타브 오류가 남.</li>
      <li><b>YIN</b> (de Cheveigné, Kawahara 2002): 차이 함수 d(τ) = Σ(x[i] - x[i+τ])²를 누적 평균으로 정규화하고, 문턱값 아래로 처음 내려가는 τ를 고름. 가장 짧은 주기를 먼저 고르므로 옥타브 오류가 적음. 포물선 보간으로 샘플 사이 주기까지 추정.</li>
    </ul>
    <p>실시간 튜너는 프레임 길이(지연)와 가장 낮은 음(가장 긴 주기 2개 이상이 창에 들어가야 함) 사이에서 타협함</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" class="m-accent"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="4" y="14" class="t-small t-dim">${L('기음 + 강한 2배음', 'Fundamental + strong 2nd harmonic')}</text>
    <line x1="10" y1="60" x2="260" y2="60" class="d-dim"/>
    <path d="M10,60 C20,20 30,20 40,55 C45,70 50,40 60,45 C70,55 75,95 85,95 C95,95 100,70 110,62 C120,20 130,20 140,55 C145,70 150,40 160,45 C170,55 175,95 185,95 C195,95 200,70 210,62" class="d-line"/>
    <circle cx="10" cy="60" r="3" class="f-a"/><circle cx="41" cy="60" r="3" class="f-a"/><circle cx="52" cy="60" r="3" class="f-a"/><circle cx="66" cy="60" r="3" class="f-a"/><circle cx="110" cy="60" r="3" class="f-a"/><circle cx="141" cy="60" r="3" class="f-a"/><circle cx="152" cy="60" r="3" class="f-a"/><circle cx="166" cy="60" r="3" class="f-a"/><circle cx="210" cy="60" r="3" class="f-a"/>
    <text x="135" y="118" text-anchor="middle" class="t-small t-a">${L('ZCR: 한 주기에 0을 4번 지남 → 2배로 착각', 'ZCR: 4 zero crossings per cycle, read as 2x')}</text>
    <path d="M10,140 L110,140" class="d-accent" marker-end="url(#arr)"/>
    <text x="6" y="160" class="t-small">${L('주기 T0만큼 밀면 겹침', 'shift by T0 and it matches')}</text>
    <text x="300" y="30" class="t-small t-b">${L('YIN 차이 함수', 'YIN difference function')}</text>
    <line x1="300" y1="150" x2="530" y2="150" class="d-line"/><line x1="300" y1="150" x2="300" y2="40" class="d-line"/>
    <line x1="300" y1="125" x2="530" y2="125" class="d-dim" stroke-dasharray="4 3"/>
    <text x="528" y="120" text-anchor="end" class="t-small t-dim">${L('문턱값', 'threshold')}</text>
    <path d="M300,50 Q320,40 340,90 Q355,110 370,80 Q390,60 400,140 Q410,80 440,75 Q470,70 490,138 Q505,80 530,75" class="d-b"/>
    <circle cx="400" cy="140" r="4" class="f-b"/>
    <text x="400" y="168" text-anchor="middle" class="t-small t-b">${L('처음 내려간 골 = T0', 'first dip below = T0')}</text>
    <text x="490" y="168" text-anchor="middle" class="t-small t-dim">2T0</text>
  </svg>`,
  look: [
    'A의 빨간 점은 실제보다 한 옥타브 이상 높게 잡힌 프레임. 2배음이 강하고 잡음이 있어서 ZCR이 대부분 틀림.',
    'B는 거의 모든 점이 흰 정답 선 위에 있음. 아래 오른쪽 그래프에서 문턱값 아래 첫 골이 주기.',
    '"잡음"을 0으로, "기음 크기"를 3 이상으로 올리면 ZCR도 80% 넘게 맞음. 기음이 배음보다 훨씬 클 때만 쓸 수 있는 방법.',
    '"기음 크기"를 0, "잡음"을 0.3 이상으로 두면 B(YIN)도 옥타브 오류가 생김. 같은 조건에서 ACF는 더 안정적. 방법마다 약점이 다름.',
    '"소리 켜기" 후 A를 들으면 검출된 사인파가 원래 노래와 어긋나 엉뚱한 음을 냄',
  ],
  refs: [
    { type: 'paper', title: 'A. de Cheveigné, H. Kawahara, "YIN, a fundamental frequency estimator for speech and music", JASA 111(4)', year: 2002, note: 'YIN의 원 논문. 차이 함수, 누적 평균 정규화, 절대 문턱값' },
    { type: 'paper', title: 'L. R. Rabiner, "On the use of autocorrelation analysis for pitch detection", IEEE Trans. ASSP 25(1)', year: 1977, note: '자기상관 피치 검출' },
    { type: 'paper', title: 'P. McLeod, G. Wyvill, "A Smarter Way to Find Pitch", ICMC', year: 2005, note: 'MPM (NSDF). 실시간 튜너에 많이 쓰임' },
    { type: 'paper', title: 'M. Mauch, S. Dixon, "pYIN: A fundamental frequency estimator using probabilistic threshold distributions", ICASSP', year: 2014, note: 'YIN에 확률 모델과 HMM 추적을 더한 방법' },
  ],
  params: [
    { key: 'method', label: '검출 방식', type: 'select', options: [{ value: 'zcr', label: '영교차율 (ZCR)' }, { value: 'acf', label: '자기상관 (ACF)' }, { value: 'yin', label: 'YIN' }], a: 'zcr', b: 'yin', group: '검출' },
    { key: 'thr', label: 'YIN 문턱값', type: 'range', min: 0.02, max: 0.5, step: 0.01, default: 0.15, when: (p) => p.method === 'yin' },
    { key: 'fund', label: '기음 크기', type: 'range', min: 0, max: 4, step: 0.05, default: 0.25, shared: true, group: '신호', help: '1이면 기음이 2배음과 같은 크기' },
    { key: 'noise', label: '잡음', type: 'range', min: 0, max: 0.5, step: 0.01, default: 0.08, shared: true },
    { key: 'mix', label: '검출 음 크기', type: 'range', min: 0, max: 1, step: 0.05, default: 0.5, shared: true, group: '소리', help: '검출된 음 높이로 낸 사인파의 크기' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Pitch Detection (Zero Crossing, Autocorrelation, YIN)',
    summary: 'Counting how often the waveform crosses 0 is easily fooled by harmonics and noise. Autocorrelation and YIN look for the period after which the waveform looks like itself again, so they find the right pitch even with a weak fundamental.',
    views: { a: 'Zero crossing rate (ZCR)', b: 'YIN' },
    controls: 'Click or drag on the top graph to inspect that frame below. Press "Sound on" to hear the original signal with a sine wave at the detected pitch.',
    info: `
    <p><b>Pitch detection</b> finds the fundamental frequency (f0) of a sound. It is the first step of tuners, pitch correction, voice analysis, singing scores and audio to MIDI.</p>
    <ul>
      <li><b>Zero crossing rate (ZCR)</b>: number of zero crossings / 2 / time. Only correct for a pure sine. A strong 2nd harmonic adds crossings and gives an octave too high. Noise gives random high values.</li>
      <li><b>Autocorrelation (ACF)</b>: shift the signal by τ, multiply with the original and sum. It is most similar when shifted by one period. Robust to harmonics, but peaks also appear at 2 and 3 periods, which causes octave errors.</li>
      <li><b>YIN</b> (de Cheveigné, Kawahara 2002): normalizes the difference function d(τ) = Σ(x[i] - x[i+τ])² by its running mean and picks the first τ below a threshold. It prefers the shortest period, so octave errors are rare. Parabolic interpolation estimates periods between samples.</li>
    </ul>
    <p>A real-time tuner trades frame length (latency) against the lowest note (at least 2 of the longest periods must fit in the window).</p>`,
    look: [
      'Red dots in A are frames detected an octave or more too high. With a strong 2nd harmonic and noise, ZCR is mostly wrong.',
      'In B almost every dot sits on the white truth line. In the lower right graph, the first dip below the threshold is the period.',
      'Set "Noise" to 0 and "Fundamental level" to 3 or more. ZCR is now right on over 80% of frames. It only works when the fundamental is much louder than the harmonics.',
      'Set "Fundamental level" to 0 and "Noise" to 0.3 or more. B (YIN) now makes octave errors too. ACF is more stable in this case. Each method has its own weak spot.',
      'Press "Sound on" and listen to A. The detected sine wanders away from the melody and plays wrong notes.',
    ],
    refs: ['The original YIN paper: difference function, cumulative mean normalization, absolute threshold.', 'Autocorrelation pitch detection.', 'MPM (NSDF), common in real-time tuners.', 'YIN with a probabilistic model and HMM tracking.'],
    params: {
      method: { label: 'Method', group: 'Detection', options: { zcr: 'Zero crossing rate (ZCR)', acf: 'Autocorrelation (ACF)' } },
      thr: 'YIN threshold',
      fund: { label: 'Fundamental level', group: 'Signal', help: '1 means the fundamental is as loud as the 2nd harmonic.' },
      noise: 'Noise',
      mix: { label: 'Detected tone level', group: 'Sound', help: 'Level of the sine wave at the detected pitch.' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 22050, NOTE = 0.4, MEL = [57, 60, 64, 62, 59, 55, 57, 52], DUR = NOTE * MEL.length, LEN = Math.round(SR * DUR);
    const N = 1024, W = 512, HOP = 256, TMIN = Math.floor(SR / 1000), TMAX = Math.ceil(SR / 70), TAU = Math.PI * 2;
    const HARM = [0, 1, 0.8, 0.5, 0.4, 0.3, 0.2, 0.15, 0.12, 0.1];   // 2배음부터 크기. 1번(기음)은 파라미터

    // 정답 f0와 엔벨로프 (비브라토 5.5Hz, ±20센트)
    const f0True = new Float32Array(LEN), env = new Float32Array(LEN);
    for (let i = 0; i < LEN; i++) {
      const t = i / SR, j = Math.min(MEL.length - 1, Math.floor(t / NOTE)), tt = t - j * NOTE;
      f0True[i] = A.mtof(MEL[j] + 0.2 * Math.sin(TAU * 5.5 * t));
      env[i] = Math.min(1, tt / 0.02, Math.max(0, (NOTE - 0.03 - tt) / 0.03));
    }
    const noiseBuf = A.noiseBuffer(LEN, 11);

    let key = '', sig = null, det = null, truth = null, voiced = null, fnCache = new Map(), acc = 0, oct = 0, medErr = 0, msPerFrame = 0;
    let cursorT = 1.0;
    const nF = Math.floor((LEN - N) / HOP);

    // 프레임 하나의 피치. 반환 { f, fn: 검출 함수(그리기용) }
    function detect(x0, keepFn) {
      const x = sig;
      if (P.method === 'zcr') {
        let z = 0;
        for (let i = 1; i < N; i++) if ((x[x0 + i - 1] < 0) !== (x[x0 + i] < 0)) z++;
        return { f: z / 2 * SR / N, fn: null };
      }
      const fn = new Float32Array(TMAX + 2);
      let tau = -1;
      if (P.method === 'acf') {
        let r0 = 0;
        for (let i = 0; i < N; i++) r0 += x[x0 + i] * x[x0 + i];
        for (let t = 0; t <= TMAX + 1; t++) { let s = 0; for (let i = 0; i < N - t; i++) s += x[x0 + i] * x[x0 + i + t]; fn[t] = s / (r0 + 1e-12); }
        let best = -Infinity;
        for (let t = TMIN; t <= TMAX; t++) if (fn[t] > fn[t - 1] && fn[t] >= fn[t + 1] && fn[t] > best) { best = fn[t]; tau = t; }
      } else {
        // YIN: 차이 함수 → 누적 평균 정규화 → 절대 문턱값
        fn[0] = 1;
        let run = 0;
        for (let t = 1; t <= TMAX + 1; t++) {
          let s = 0; for (let i = 0; i < W; i++) { const d = x[x0 + i] - x[x0 + i + t]; s += d * d; }
          run += s; fn[t] = s * t / (run + 1e-12);
        }
        for (let t = TMIN; t <= TMAX; t++) if (fn[t] < P.thr) { while (t < TMAX && fn[t + 1] < fn[t]) t++; tau = t; break; }
        if (tau < 0) { let m = Infinity; for (let t = TMIN; t <= TMAX; t++) if (fn[t] < m) { m = fn[t]; tau = t; } }
      }
      if (tau < 0) return { f: 0, fn };
      // 포물선 보간
      const a = fn[tau - 1], b = fn[tau], c = fn[tau + 1], den = a - 2 * b + c, sh = Math.abs(den) > 1e-12 ? U.clamp(0.5 * (a - c) / den, -0.5, 0.5) : 0;
      return { f: SR / (tau + sh), fn: keepFn ? fn : null, tau: tau + sh };
    }

    function analyze() {
      const sk = P.fund + ',' + P.noise;
      const k = sk + '|' + P.method + P.thr;
      if (k === key) return;
      if (!sig || key.split('|')[0] !== sk) {
        sig = new Float32Array(LEN + N);
        let ph = 0;
        for (let i = 0; i < LEN; i++) {
          ph += TAU * f0True[i] / SR; if (ph > TAU * 1000) ph -= TAU * 1000;
          let v = P.fund * Math.sin(ph);
          for (let h = 2; h <= HARM.length; h++) v += HARM[h - 1] * Math.sin(h * ph);
          sig[i] = 0.13 * env[i] * v + P.noise * 0.5 * noiseBuf[i];
        }
      }
      key = k;
      fnCache = new Map();
      det = new Float32Array(nF); truth = new Float32Array(nF); voiced = new Uint8Array(nF);
      const t0 = ctx.now ? ctx.now() : 0;
      let ok = 0, oc = 0, cnt = 0;
      const errs = [];
      for (let f = 0; f < nF; f++) {
        const x0 = f * HOP, c = x0 + N / 2;
        det[f] = detect(x0, false).f;
        truth[f] = f0True[c];
        voiced[f] = env[x0] > 0.9 && env[x0 + N - 1] > 0.9 ? 1 : 0;
        if (!voiced[f]) continue;
        cnt++;
        const ce = det[f] > 0 ? 1200 * Math.log2(det[f] / truth[f]) : 9999;
        if (Math.abs(ce) < 50) { ok++; errs.push(Math.abs(ce)); } else if (Math.abs(Math.abs(ce) - 1200) < 100) oc++;
      }
      msPerFrame = ctx.now ? (ctx.now() - t0) / nF : 0;
      acc = cnt ? ok / cnt * 100 : 0; oct = cnt ? oc / cnt * 100 : 0;
      errs.sort((a, b) => a - b); medErr = errs.length ? errs[errs.length >> 1] : 0;
    }
    analyze();

    const live = { pos: 0, ph: 0, f: 200, g: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const step = SR / sr;
        for (let i = 0; i < n; i++) {
          const p = live.pos, i0 = Math.floor(p), fr = Math.min(nF - 1, Math.max(0, Math.floor((p - N / 2) / HOP)));
          const tf = det[fr] > 0 && voiced[fr] ? det[fr] : 0;
          if (tf > 0) live.f += (tf - live.f) * 0.01;
          live.g += ((tf > 0 ? 1 : 0) - live.g) * 0.003;
          live.ph = (live.ph + TAU * live.f / sr) % TAU;
          const v = sig[i0] * 0.9 + 0.25 * P.mix * live.g * Math.sin(live.ph);
          l[i] = v; r[i] = v;
          live.pos += step; if (live.pos >= LEN) live.pos -= LEN;
        }
      },
    });

    const MLO = 45, MHI = 84;
    let layout = null;
    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, Wd = ctx.width, H = ctx.height, pad = 10, lx = 34, tw = Wd - lx - pad;
        const th = Math.max(90, H * 0.52), ty = pad;
        layout = { lx, tw, ty, th };
        D.rect(g, lx, ty, tw, th, 'rgba(0,0,0,0.35)');
        const my = (m) => ty + th - (U.clamp(m, MLO - 1, MHI + 1) - MLO) / (MHI - MLO) * th, fx = (f) => lx + (f * HOP + N / 2) / LEN * tw;
        for (let m = 48; m <= MHI; m += 12) { D.line(g, lx, my(m), lx + tw, my(m), C.grid); D.text(g, A.noteName(m), lx - 4, my(m) - 5, { size: 9, color: C.dim, align: 'right' }); }
        // 정답 선
        g.beginPath();
        for (let f = 0; f < nF; f++) { const px = fx(f), py = my(A.ftom(truth[f])); f ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 1.5; g.stroke();
        for (let f = 0; f < nF; f++) {
          if (!voiced[f] || det[f] <= 0) continue;
          const ce = 1200 * Math.log2(det[f] / truth[f]);
          D.circle(g, fx(f), my(A.ftom(det[f])), 2, Math.abs(ce) < 50 ? col : C.bad);
        }
        D.text(g, Lg('음 높이 추적 (흰 선 = 정답, 빨강 = 50센트 넘게 틀림)', 'Pitch track (white = truth, red = off by more than 50 cents)'), lx + 4, ty + 3, { size: 10, color: C.dim });
        const cf = U.clamp(Math.round((cursorT * SR - N / 2) / HOP), 0, nF - 1);
        D.line(g, fx(cf), ty, fx(cf), ty + th, C.warn, 1);
        if (snd.on) D.line(g, lx + live.pos / LEN * tw, ty, lx + live.pos / LEN * tw, ty + th, '#fff', 1);
        // 아래: 커서 프레임
        const by = ty + th + pad, bh = H - by - pad;
        const x0 = cf * HOP, T0 = SR / truth[cf];
        const half = P.method === 'zcr' ? tw : (tw - pad) / 2;
        D.rect(g, lx, by, half, bh, 'rgba(0,0,0,0.35)');
        const showN = P.method === 'zcr' ? N : Math.min(N, Math.round(T0 * 4));
        let pk = 1e-6; for (let i = 0; i < showN; i++) pk = Math.max(pk, Math.abs(sig[x0 + i]));
        A.drawWave(g, sig, lx, by, half, bh, { from: x0, count: showN, color: col, amp: 0.9 / pk, background: false, lineWidth: 1.2 });
        if (P.method === 'zcr') {
          let z = 0;
          for (let i = 1; i < showN; i++) if ((sig[x0 + i - 1] < 0) !== (sig[x0 + i] < 0)) { z++; D.line(g, lx + i / showN * half, by + bh / 2 - 4, lx + i / showN * half, by + bh / 2 + 4, C.warn); }
          D.text(g, Lg(`프레임 ${N}샘플: 영교차 ${z}번 → ${(z / 2 * SR / N).toFixed(0)}Hz (정답 ${truth[cf].toFixed(0)}Hz)`, `Frame of ${N} samples: ${z} zero crossings → ${(z / 2 * SR / N).toFixed(0)} Hz (truth ${truth[cf].toFixed(0)} Hz)`), lx + 4, by + 3, { size: 10, color: C.text });
        } else {
          D.text(g, Lg('프레임 파형 (주기 4개)', 'Frame waveform (4 periods)'), lx + 4, by + 3, { size: 10, color: C.dim });
          let fd = fnCache.get(cf);
          if (!fd) { fd = detect(x0, true); fnCache.set(cf, fd); }
          const rx = lx + half + pad;
          D.rect(g, rx, by, half, bh, 'rgba(0,0,0,0.35)');
          const fnv = fd.fn, isY = P.method === 'yin', lo = isY ? 0 : -1, hi = isY ? 1.5 : 1;
          const vy = (v) => by + bh - U.clamp((v - lo) / (hi - lo), 0, 1) * bh, tx = (t) => rx + t / TMAX * half;
          if (isY) D.line(g, rx, vy(P.thr), rx + half, vy(P.thr), C.warn);
          else D.line(g, rx, vy(0), rx + half, vy(0), C.grid);
          g.beginPath();
          for (let t = 0; t <= TMAX; t++) { const px = tx(t), py = vy(fnv[t]); t ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = col; g.lineWidth = 1.5; g.stroke();
          for (let k = 1; k * T0 <= TMAX; k++) D.line(g, tx(k * T0), by + bh - 8, tx(k * T0), by + bh, 'rgba(255,255,255,0.7)', 2);
          if (fd.tau) D.circle(g, tx(fd.tau), vy(fnv[Math.round(fd.tau)]), 4, null, '#fff', 2);
          D.text(g, isY ? Lg('YIN 정규화 차이 함수 (가로 = 지연 τ)', 'YIN normalized difference (x = lag τ)') : Lg('자기상관 (가로 = 지연 τ)', 'Autocorrelation (x = lag τ)'), rx + 4, by + 3, { size: 10, color: C.dim });
          D.text(g, Lg('흰 눈금 = 실제 주기의 배수, 원 = 고른 τ', 'White ticks = multiples of the real period, circle = chosen τ'), rx + 4, by + 16, { size: 9, color: C.dim });
        }
        ctx.stat(Lg('정확도 (±50센트)', 'Accuracy (±50 cents)'), acc.toFixed(1) + '%');
        ctx.stat(Lg('옥타브 오류', 'Octave errors'), oct.toFixed(1) + '%');
        ctx.stat(Lg('맞은 프레임 오차 (중앙값)', 'Error on correct frames (median)'), medErr.toFixed(1) + Lg('센트', ' cents'));
        ctx.stat(Lg('프레임당 계산', 'Compute per frame'), msPerFrame.toFixed(3) + ' ms');
        snd.stat();
      },
      onPointer(type, m) {
        if (!layout || !(type === 'down' || (type === 'move' && m.down))) return;
        if (m.y > layout.ty + layout.th || m.x < layout.lx) return;
        cursorT = U.clamp((m.x - layout.lx) / layout.tw, 0, 1) * DUR;
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
