// GTL.audio: 소리 샘플 공용 헬퍼. 소리 켜기/끄기, 실시간 합성(스트림), 버퍼 재생, DSP, 그리기.
// 샘플은 이 파일의 함수를 자유롭게 씀. 새 함수를 넣을 때는 docs/AUTHORING.md의 "GTL.audio" 표도 갱신.
(function (root) {
  const GTL = root.GTL;
  const U = GTL.util;
  const L = (ko, en) => GTL.L(ko, en);
  const A = (GTL.audio = {});
  const TAU = Math.PI * 2;

  A.supported = () => typeof AudioContext !== 'undefined';

  // ───────────────────────── 단위 변환 ─────────────────────────
  A.dbToLin = (db) => Math.pow(10, db / 20);
  A.linToDb = (v) => 20 * Math.log10(Math.max(1e-9, Math.abs(v)));
  A.mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);                 // MIDI 노트 번호 → Hz
  A.ftom = (f) => 69 + 12 * Math.log2(Math.max(1e-9, f) / 440);     // Hz → MIDI 노트 번호 (실수)
  A.cents = (f1, f2) => 1200 * Math.log2(f2 / f1);                   // f1에서 f2까지 센트
  A.NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  A.NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  A.noteName = (m, flat = false) => { const r = Math.round(m); return (flat ? A.NOTE_NAMES_FLAT : A.NOTE_NAMES)[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1); }; // 60 → C4
  A.pitchClass = (m) => ((Math.round(m) % 12) + 12) % 12;
  A.isBlackKey = (m) => [1, 3, 6, 8, 10].includes(A.pitchClass(m));

  // ───────────────────────── 소리 파라미터 ─────────────────────────
  // 소리가 있는 샘플의 params 배열 끝에 펼쳐 넣음: params: [..., ...GTL.audio.params()]
  // single 샘플은 GTL.audio.params({ single: true }) (소리 내는 뷰 선택 없음)
  A.params = (o = {}) => {
    const ps = [{ key: 'sound', label: '소리 켜기', type: 'button', buttonLabel: '소리 켜기/끄기', group: '소리' }];
    if (!o.single) ps.push({ key: 'listen', label: '소리 내는 뷰', type: 'select', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], default: o.listen || 'b', shared: true });
    ps.push({ key: 'vol', label: '음량', type: 'range', min: 0, max: 1, step: 0.01, default: o.vol ?? 0.35, shared: true });
    return ps;
  };
  // en.params에 펼쳐 넣음: params: { ..., ...GTL.audio.enParams }
  A.enParams = {
    sound: { label: 'Sound on', buttonLabel: 'Sound on/off', group: 'Sound' },
    listen: 'View that plays sound',
    vol: 'Volume',
  };

  // ───────────────────────── 플레이어 ─────────────────────────
  // const snd = GTL.audio.player(ctx, {
  //   process(L, R, sr, n) {},   // 선택. 실시간 합성. L, R(Float32Array, 길이 n)을 채움. 오디오 스레드가 아닌 메인 스레드에서 호출
  //   build(ac, out) {},         // 선택. Web Audio 노드 그래프를 만들어 out(GainNode)에 연결
  // });
  // update()에서 snd.update(), onAction에서 snd.toggle(), dispose()에서 snd.stop(), render()에서 snd.stat()
  // 소리는 "소리 켜기"를 누른 뒤에만 만들어짐 (자동 재생 금지). 소리가 없는 환경에서는 아무 일도 하지 않음.
  A.player = (ctx, opts = {}) => {
    const P = ctx.params;
    const snd = {
      ac: null, out: null, node: null, sr: 48000, graph: null, sources: [],
      get on() { return !!snd.ac; },
      get audible() { return !!snd.ac && (P.listen === undefined || P.listen === ctx.side); },
      start() {
        if (snd.ac || !A.supported()) return;
        const ac = new AudioContext();
        snd.ac = ac; snd.sr = ac.sampleRate;
        snd.out = ac.createGain(); snd.out.gain.value = 0; snd.out.connect(ac.destination);
        if (opts.process) {
          const BS = opts.bufferSize || 2048;
          const sp = ac.createScriptProcessor(BS, 0, 2);
          sp.onaudioprocess = (e) => {
            const l = e.outputBuffer.getChannelData(0), r = e.outputBuffer.getChannelData(1);
            try { opts.process(l, r, ac.sampleRate, l.length); } catch (err) { l.fill(0); r.fill(0); console.error(err); }
            for (let i = 0; i < l.length; i++) { // 보호용 하드 클립. NaN이 스피커로 가지 않게 함
              const a = l[i], b = r[i];
              l[i] = a !== a ? 0 : a > 1 ? 1 : a < -1 ? -1 : a;
              r[i] = b !== b ? 0 : b > 1 ? 1 : b < -1 ? -1 : b;
            }
          };
          sp.connect(snd.out);
          snd.node = sp;
        }
        if (opts.build) snd.graph = opts.build(ac, snd.out) || null;
        if (A.testHook) A.testHook(snd, opts);  // tools/smoke.js 전용
        if (ac.resume) { const pr = ac.resume(); if (pr && pr.catch) pr.catch(() => { /* 바로 닫힌 경우 */ }); }
        snd.update();
        if (opts.onStart) opts.onStart(snd);
      },
      stop() {
        if (!snd.ac) return;
        if (snd.node) snd.node.onaudioprocess = null;
        try { const pr = snd.ac.close(); if (pr && pr.catch) pr.catch(() => { /* 이미 닫힘 */ }); } catch (e) { /* 이미 닫힘 */ }
        snd.ac = null; snd.out = null; snd.node = null; snd.graph = null; snd.sources = [];
        if (opts.onStop) opts.onStop(snd);
      },
      toggle() { snd.ac ? snd.stop() : snd.start(); },
      // 음량과 소리 내는 뷰를 반영. 매 프레임 호출
      update() {
        if (!snd.ac) return;
        const vol = P.vol ?? 0.35;
        snd.out.gain.setTargetAtTime(snd.audible ? vol : 0, snd.ac.currentTime, 0.03);
      },
      // Float32Array(모노) 또는 [L, R]를 재생. loop면 반복. 이전에 재생하던 버퍼는 멈춤(stopOthers)
      playBuffer(data, sr, o = {}) {
        if (!snd.ac) return null;
        const chans = Array.isArray(data) ? data : [data];
        const len = chans[0].length;
        if (!len) return null;
        const buf = snd.ac.createBuffer(chans.length, len, sr || snd.sr);
        chans.forEach((c, i) => buf.getChannelData(i).set(c));
        const src = snd.ac.createBufferSource();
        src.buffer = buf; src.loop = !!o.loop;
        if (o.rate) src.playbackRate.value = o.rate;
        const g = snd.ac.createGain(); g.gain.value = o.gain ?? 1;
        src.connect(g); g.connect(o.dest || snd.out);
        if (o.stopOthers !== false) snd.stopBuffers();
        src.start(o.when ?? 0);
        snd.sources.push(src);
        src.onended = () => { snd.sources = snd.sources.filter((s) => s !== src); };
        return src;
      },
      stopBuffers() { for (const s of snd.sources) { try { s.stop(); } catch (e) { /* 이미 멈춤 */ } } snd.sources = []; },
      statusText() {
        if (!A.supported()) return L('미지원', 'Not supported');
        if (!snd.ac) return L('꺼짐 ("소리 켜기" 누르기)', 'Off (press "Sound on")');
        return snd.audible ? L('재생 중', 'Playing') : L('음소거 (다른 뷰 선택)', 'Muted (other view selected)');
      },
      stat() { ctx.stat(L('소리', 'Sound'), snd.statusText()); },
    };
    return snd;
  };

  // ───────────────────────── 오실레이터, 노이즈 ─────────────────────────
  // 위상 ph는 0~1. 단순(naive) 파형. 에일리어싱이 있음
  A.wave = {
    sine: (ph) => Math.sin(TAU * ph),
    saw: (ph) => 2 * (ph - Math.floor(ph + 0.5)),
    square: (ph) => ((ph - Math.floor(ph)) < 0.5 ? 1 : -1),
    triangle: (ph) => { const p = ph - Math.floor(ph); return 4 * Math.abs(p - 0.5) - 1; },
  };
  // PolyBLEP 보정값. t: 위상(0~1), dt: 위상 증가량 (f/sr)
  A.polyBlep = (t, dt) => {
    if (t < dt) { t /= dt; return t + t - t * t - 1; }
    if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
    return 0;
  };
  // 시드 노이즈 버퍼
  A.noiseBuffer = (n, seed = 1, kind = 'white') => {
    const r = U.rng(seed), out = new Float32Array(n);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, brown = 0;
    for (let i = 0; i < n; i++) {
      const w = r.range(-1, 1);
      if (kind === 'pink') { // Paul Kellet 근사
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      } else if (kind === 'brown') { brown = (brown + 0.02 * w) / 1.02; out[i] = brown * 3.5; }
      else out[i] = w;
    }
    return out;
  };

  // ───────────────────────── 엔벨로프 ─────────────────────────
  // ADSR 값 (선형). t: 노트 시작 후 시간, rel: 노트 끝 시각(없으면 Infinity)
  A.adsr = (t, a, d, s, r, rel = Infinity) => {
    const on = (tt) => (tt < a ? tt / Math.max(1e-6, a) : tt < a + d ? 1 - (1 - s) * ((tt - a) / Math.max(1e-6, d)) : s);
    if (t < rel) return on(t);
    const v0 = on(rel), k = (t - rel) / Math.max(1e-6, r);
    return k >= 1 ? 0 : v0 * (1 - k);
  };

  // ───────────────────────── 바이쿼드 필터 (RBJ Audio EQ Cookbook) ─────────────────────────
  // type: lowpass, highpass, bandpass, notch, allpass, peaking, lowshelf, highshelf
  A.biquad = (type, f0, Q, gainDb, sr) => {
    const w0 = TAU * U.clamp(f0, 1, sr * 0.499) / sr, cw = Math.cos(w0), sw = Math.sin(w0);
    const alpha = sw / (2 * Math.max(1e-4, Q)), Ag = Math.pow(10, (gainDb || 0) / 40);
    let b0, b1, b2, a0, a1, a2;
    switch (type) {
      case 'lowpass': b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = b0; a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha; break;
      case 'highpass': b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = b0; a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha; break;
      case 'bandpass': b0 = alpha; b1 = 0; b2 = -alpha; a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha; break;
      case 'notch': b0 = 1; b1 = -2 * cw; b2 = 1; a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha; break;
      case 'allpass': b0 = 1 - alpha; b1 = -2 * cw; b2 = 1 + alpha; a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha; break;
      case 'peaking': b0 = 1 + alpha * Ag; b1 = -2 * cw; b2 = 1 - alpha * Ag; a0 = 1 + alpha / Ag; a1 = -2 * cw; a2 = 1 - alpha / Ag; break;
      case 'lowshelf': { const s = 2 * Math.sqrt(Ag) * alpha;
        b0 = Ag * ((Ag + 1) - (Ag - 1) * cw + s); b1 = 2 * Ag * ((Ag - 1) - (Ag + 1) * cw); b2 = Ag * ((Ag + 1) - (Ag - 1) * cw - s);
        a0 = (Ag + 1) + (Ag - 1) * cw + s; a1 = -2 * ((Ag - 1) + (Ag + 1) * cw); a2 = (Ag + 1) + (Ag - 1) * cw - s; break; }
      case 'highshelf': { const s = 2 * Math.sqrt(Ag) * alpha;
        b0 = Ag * ((Ag + 1) + (Ag - 1) * cw + s); b1 = -2 * Ag * ((Ag - 1) + (Ag + 1) * cw); b2 = Ag * ((Ag + 1) + (Ag - 1) * cw - s);
        a0 = (Ag + 1) - (Ag - 1) * cw + s; a1 = 2 * ((Ag - 1) - (Ag + 1) * cw); a2 = (Ag + 1) - (Ag - 1) * cw - s; break; }
      default: b0 = 1; b1 = 0; b2 = 0; a0 = 1; a1 = 0; a2 = 0;
    }
    const c = { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0, x1: 0, x2: 0, y1: 0, y2: 0 };
    // 상태를 가진 처리 함수 (Direct Form I)
    c.process = (x) => {
      const y = c.b0 * x + c.b1 * c.x1 + c.b2 * c.x2 - c.a1 * c.y1 - c.a2 * c.y2;
      c.x2 = c.x1; c.x1 = x; c.y2 = c.y1; c.y1 = y;
      return y;
    };
    c.reset = () => { c.x1 = c.x2 = c.y1 = c.y2 = 0; };
    c.response = (f) => A.biquadResponse(c, f, sr);
    return c;
  };
  // 계수의 주파수 f에서 크기(dB)와 위상(rad)
  A.biquadResponse = (c, f, sr) => {
    const w = TAU * f / sr, c1 = Math.cos(w), s1 = Math.sin(w), c2 = Math.cos(2 * w), s2 = Math.sin(2 * w);
    const nr = c.b0 + c.b1 * c1 + c.b2 * c2, ni = -(c.b1 * s1 + c.b2 * s2);
    const dr = 1 + c.a1 * c1 + c.a2 * c2, di = -(c.a1 * s1 + c.a2 * s2);
    const mag = Math.sqrt((nr * nr + ni * ni) / Math.max(1e-30, dr * dr + di * di));
    return { db: A.linToDb(mag), mag, phase: Math.atan2(ni, nr) - Math.atan2(di, dr) };
  };
  // 1차 원폴 로우패스 계수 (y += a(x - y))
  A.onePoleCoef = (fc, sr) => 1 - Math.exp(-TAU * fc / sr);

  // ───────────────────────── FFT, 스펙트럼 ─────────────────────────
  // 제자리 radix-2 FFT. re, im 길이는 2의 거듭제곱
  A.fft = (re, im, inverse = false) => {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = (inverse ? TAU : -TAU) / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const a = i + k, b = a + len / 2;
          const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
          re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
          const ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
        }
      }
    }
    if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  };
  A.windows = {
    rect: () => 1,
    hann: (i, n) => 0.5 - 0.5 * Math.cos(TAU * i / (n - 1)),
    hamming: (i, n) => 0.54 - 0.46 * Math.cos(TAU * i / (n - 1)),
    blackman: (i, n) => 0.42 - 0.5 * Math.cos(TAU * i / (n - 1)) + 0.08 * Math.cos(2 * TAU * i / (n - 1)),
  };
  // 크기 스펙트럼(dB). data에서 offset부터 n개(2의 거듭제곱). 결과 길이 n/2. 0dB = 진폭 1 사인파
  A.spectrum = (data, n = 2048, o = {}) => {
    const off = o.offset || 0, win = A.windows[o.window || 'hann'];
    const re = new Float64Array(n), im = new Float64Array(n);
    let wsum = 0;
    for (let i = 0; i < n; i++) { const w = win(i, n); wsum += w; re[i] = (data[off + i] || 0) * w; }
    A.fft(re, im);
    const out = new Float32Array(n / 2), norm = 2 / wsum;
    for (let k = 0; k < n / 2; k++) out[k] = A.linToDb(Math.hypot(re[k], im[k]) * norm);
    return out;
  };

  // ───────────────────────── 오프라인 렌더 ─────────────────────────
  // fn(i, t)가 샘플 값을 반환. n개 샘플 Float32Array
  A.render = (n, sr, fn) => { const out = new Float32Array(n); for (let i = 0; i < n; i++) out[i] = fn(i, i / sr); return out; };
  A.peak = (buf) => { let p = 0; for (let i = 0; i < buf.length; i++) { const v = Math.abs(buf[i]); if (v > p) p = v; } return p; };
  A.rms = (buf, from = 0, to = buf.length) => { let s = 0; for (let i = from; i < to; i++) s += buf[i] * buf[i]; return Math.sqrt(s / Math.max(1, to - from)); };
  A.normalize = (buf, target = 0.9) => { const p = A.peak(buf); if (p > 1e-9) for (let i = 0; i < buf.length; i++) buf[i] *= target / p; return buf; };

  // ───────────────────────── 그리기 ─────────────────────────
  const D = U.draw, C = U.colors;
  // 파형. data의 from부터 count개를 (x,y,w,h)에 그림. 화면 폭보다 많으면 열마다 최소~최대를 칠함
  A.drawWave = (g, data, x, y, w, h, o = {}) => {
    const from = o.from || 0, count = Math.max(2, Math.min(o.count || data.length, data.length - from));
    const amp = o.amp || 1, mid = y + h / 2, col = o.color || C.b;
    if (o.background !== false) D.rect(g, x, y, w, h, o.background || 'rgba(0,0,0,0.35)');
    if (o.axis !== false) D.line(g, x, mid, x + w, mid, C.grid, 1);
    g.beginPath();
    if (count > w * 2) {
      const cols = Math.max(1, Math.floor(w));
      for (let c = 0; c < cols; c++) {
        const i0 = from + Math.floor(c * count / cols), i1 = from + Math.floor((c + 1) * count / cols);
        let lo = Infinity, hi = -Infinity;
        for (let i = i0; i < Math.max(i1, i0 + 1); i++) { const v = data[i] || 0; if (v < lo) lo = v; if (v > hi) hi = v; }
        const px = x + c + 0.5;
        g.moveTo(px, mid - U.clamp(hi * amp, -1, 1) * h / 2); g.lineTo(px, mid - U.clamp(lo * amp, -1, 1) * h / 2 + 0.5);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const px = x + (i / (count - 1)) * w, py = mid - U.clamp((data[from + i] || 0) * amp, -1.05, 1.05) * h / 2;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
    }
    g.strokeStyle = col; g.lineWidth = o.lineWidth || 1.5; g.stroke();
    if (o.dots) for (let i = 0; i < count; i++) D.circle(g, x + (i / (count - 1)) * w, mid - (data[from + i] || 0) * amp * h / 2, 2, col);
    if (o.label) D.text(g, o.label, x + 4, y + 3, { size: 10, color: C.dim });
  };
  // 주파수 → x (로그 또는 선형)
  A.freqX = (f, x, w, fmin, fmax, log = true) => (log ? x + w * Math.log(Math.max(f, fmin) / fmin) / Math.log(fmax / fmin) : x + w * (f - fmin) / (fmax - fmin));
  A.xFreq = (px, x, w, fmin, fmax, log = true) => (log ? fmin * Math.pow(fmax / fmin, (px - x) / w) : fmin + (fmax - fmin) * (px - x) / w);
  // 주파수 격자와 라벨
  A.drawFreqGrid = (g, x, y, w, h, o = {}) => {
    const fmin = o.fmin || 20, fmax = o.fmax || 20000, log = o.log !== false;
    const marks = log ? [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000] : null;
    const list = marks ? marks.filter((f) => f >= fmin && f <= fmax) : Array.from({ length: 6 }, (_, i) => fmin + (fmax - fmin) * i / 5);
    for (const f of list) {
      const px = A.freqX(f, x, w, fmin, fmax, log);
      D.line(g, px, y, px, y + h, C.grid, 1);
      D.text(g, f >= 1000 ? (f / 1000) + 'k' : String(Math.round(f)), px + 2, y + h - 11, { size: 9, color: C.dim });
    }
    if (o.minDb != null) {
      const step = o.dbStep || 12;
      for (let db = Math.ceil(o.minDb / step) * step; db <= o.maxDb; db += step) {
        const py = y + h - (db - o.minDb) / (o.maxDb - o.minDb) * h;
        D.line(g, x, py, x + w, py, C.grid, 1);
        D.text(g, db + 'dB', x + 2, py - 10, { size: 9, color: C.dim });
      }
    }
  };
  // 스펙트럼(dB 배열, A.spectrum 결과)을 그림
  A.drawSpectrum = (g, mags, sr, x, y, w, h, o = {}) => {
    const fmin = o.fmin || 20, fmax = Math.min(o.fmax || 20000, sr / 2), minDb = o.minDb ?? -90, maxDb = o.maxDb ?? 0, log = o.log !== false;
    if (o.background !== false) D.rect(g, x, y, w, h, o.background || 'rgba(0,0,0,0.35)');
    if (o.grid !== false) A.drawFreqGrid(g, x, y, w, h, { fmin, fmax, log, minDb, maxDb, dbStep: o.dbStep });
    const n = mags.length, binHz = sr / (2 * n);
    g.beginPath();
    let started = false;
    let lastPx = -1, colMax = -Infinity;
    for (let k = 1; k < n; k++) {
      const f = k * binHz;
      if (f < fmin || f > fmax) continue;
      const px = Math.round(A.freqX(f, x, w, fmin, fmax, log));
      colMax = Math.max(colMax, mags[k]);
      if (px === lastPx && k < n - 1) continue;
      const py = y + h - U.clamp((colMax - minDb) / (maxDb - minDb), 0, 1) * h;
      started ? g.lineTo(px, py) : g.moveTo(px, py);
      started = true; lastPx = px; colMax = -Infinity;
    }
    g.strokeStyle = o.color || C.b; g.lineWidth = o.lineWidth || 1.5; g.stroke();
    if (o.label) D.text(g, o.label, x + 4, y + 3, { size: 10, color: C.dim });
  };
  // 주파수 응답 곡선. fn(f) → dB
  A.drawResponse = (g, fn, x, y, w, h, o = {}) => {
    const fmin = o.fmin || 20, fmax = o.fmax || 20000, minDb = o.minDb ?? -36, maxDb = o.maxDb ?? 24, log = o.log !== false;
    if (o.background !== false) D.rect(g, x, y, w, h, o.background || 'rgba(0,0,0,0.35)');
    if (o.grid !== false) A.drawFreqGrid(g, x, y, w, h, { fmin, fmax, log, minDb, maxDb, dbStep: o.dbStep || 12 });
    g.beginPath();
    const steps = Math.max(32, Math.floor(w));
    for (let i = 0; i <= steps; i++) {
      const px = x + w * i / steps, f = A.xFreq(px, x, w, fmin, fmax, log);
      const py = y + h - U.clamp((fn(f) - minDb) / (maxDb - minDb), -0.05, 1.05) * h;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.strokeStyle = o.color || C.b; g.lineWidth = o.lineWidth || 2; g.stroke();
    if (o.label) D.text(g, o.label, x + 4, y + 3, { size: 10, color: C.dim });
  };
  // 피아노 건반. lo~hi MIDI 노트. marks: { [midi]: color } 또는 Set. 반환: 노트 → x 중심 함수
  A.drawKeyboard = (g, x, y, w, h, lo, hi, marks = {}, o = {}) => {
    const whites = [];
    for (let m = lo; m <= hi; m++) if (!A.isBlackKey(m)) whites.push(m);
    const ww = w / whites.length;
    const colorOf = (m) => (marks instanceof Set ? (marks.has(m) ? (o.color || C.b) : null) : marks[m]);
    const pos = {};
    whites.forEach((m, i) => {
      const c = colorOf(m);
      D.rect(g, x + i * ww, y, ww - 1, h, c || '#e8e8e8');
      pos[m] = x + i * ww + ww / 2;
      if (o.labels !== false && A.pitchClass(m) === 0) D.text(g, A.noteName(m), x + i * ww + ww / 2, y + h - 12, { size: Math.min(10, ww * 0.6), align: 'center', color: '#333' });
    });
    whites.forEach((m, i) => {
      const b = m + 1;
      if (b <= hi && A.isBlackKey(b)) {
        const c = colorOf(b);
        D.rect(g, x + (i + 1) * ww - ww * 0.32, y, ww * 0.64, h * 0.62, c || '#222');
        pos[b] = x + (i + 1) * ww;
      }
    });
    return (m) => pos[m];
  };
  // 세로 레벨 미터. db: 현재 값, 범위 minDb~0
  A.drawMeter = (g, x, y, w, h, db, o = {}) => {
    const minDb = o.minDb ?? -48, v = U.clamp((db - minDb) / (0 - minDb), 0, 1);
    D.rect(g, x, y, w, h, 'rgba(0,0,0,0.4)');
    D.rect(g, x, y + h * (1 - v), w, h * v, db > -0.1 ? C.bad : db > -6 ? C.warn : (o.color || C.good));
    if (o.label) D.text(g, o.label, x + w / 2, y + h + 4, { size: 10, align: 'center', color: C.dim });
  };
})(typeof window !== 'undefined' ? window : globalThis);
