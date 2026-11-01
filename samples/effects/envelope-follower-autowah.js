// 오토와: LFO로 필터를 흔듦(연주와 무관) vs 엔벨로프 팔로워로 필터를 움직임(세게 칠수록 밝아짐)
GTL.register({
  id: 'envelope-follower-autowah',
  title: '엔벨로프 팔로워와 오토와',
  summary: '엔벨로프 팔로워는 소리의 음량 변화를 따라가는 신호를 만듦. 이 신호로 공명 필터의 컷오프를 움직이면 세게 친 음은 "와" 하고 열리고 약한 음은 닫히는 오토와가 됨. LFO로 움직이면 연주와 상관없이 일정하게 흔들림.',
  views: { a: 'LFO 와 (연주와 무관)', b: '엔벨로프 와 (음량을 따라감)' },
  controls: '파라미터 표에서 방식, 감도, 어택, 릴리스를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰가 들림.',
  info: `
    <p><b>엔벨로프 팔로워(Envelope follower)</b>는 오디오의 순간 음량을 부드러운 제어 신호로 바꿈. 정류(절댓값)한 뒤 로우패스로 거름. 올라갈 때와 내려갈 때 계수를 다르게 하면(어택, 릴리스) 빠르게 반응하고 천천히 떨어지게 만들 수 있음.</p>
    <p><b>오토와(Auto-wah, Envelope filter)</b>는 팔로워 값으로 공명이 강한 필터의 컷오프를 움직임. Mu-Tron III(1972)가 유명하고, 펑크 베이스와 기타에서 많이 씀.</p>
    <ul>
      <li><b>LFO 와</b>: 일정한 속도로 열고 닫음. 박자와 맞지 않으면 연주와 따로 노는 느낌.</li>
      <li><b>엔벨로프 와</b>: 음을 칠 때마다 열렸다가 음이 줄면 닫힘. 세기(벨로시티)가 음색에 바로 반영되어 연주에 반응하는 소리.</li>
      <li>컷오프는 지수로 매핑함: <code>fc = fmin × (fmax / fmin)^e</code>. 귀는 주파수를 로그로 듣기 때문.</li>
      <li>어택이 너무 느리면 음 앞부분을 놓치고, 릴리스가 너무 빠르면 필터가 떨림(리플)</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <text x="6" y="44" class="t-small">${L('입력', 'In')}</text>
    <line x1="34" y1="40" x2="300" y2="40" class="d-line" marker-end="url(#arr)"/>
    <rect x="302" y="24" width="110" height="32" class="f-dim"/><text x="357" y="44" text-anchor="middle" class="t-small">${L('공명 필터', 'Resonant filter')}</text>
    <line x1="412" y1="40" x2="460" y2="40" class="d-line" marker-end="url(#arr)"/><text x="466" y="44" class="t-small">${L('출력', 'Out')}</text>
    <line x1="60" y1="40" x2="60" y2="100" class="d-b"/>
    <rect x="70" y="86" width="60" height="28" class="f-dim"/><text x="100" y="104" text-anchor="middle" class="t-small">|x|</text>
    <rect x="140" y="86" width="90" height="28" class="f-dim"/><text x="185" y="104" text-anchor="middle" class="t-small">${L('어택/릴리스', 'Attack/release')}</text>
    <rect x="240" y="86" width="90" height="28" class="f-dim"/><text x="285" y="104" text-anchor="middle" class="t-small">${L('지수 매핑', 'Exp mapping')}</text>
    <path d="M60,100 L68,100 M130,100 L138,100 M230,100 L238,100" class="d-b"/>
    <path d="M330,100 L357,100 L357,58" class="d-b" marker-end="url(#arr)"/>
    <text x="366" y="90" class="t-small t-b">${L('컷오프', 'Cutoff')}</text>
    <path d="M70,140 L90,124 L130,134 L150,122 L200,138 L230,130" class="d-b"/>
    <text x="240" y="144" class="t-small t-dim">${L('팔로워 출력 = 음량 곡선', 'Follower output = level curve')}</text>
  </svg>`,
  look: [
    '위 그래프에서 B는 컷오프 곡선(파랑)이 음량 곡선(회색)의 봉우리마다 함께 솟음. A는 음과 상관없이 사인 모양.',
    '"음량-컷오프 상관도"가 B는 1 근처, A는 0 근처',
    'B에서 릴리스를 20ms로 줄이면 컷오프 곡선이 톱니처럼 떨리고 소리에 잡음 같은 떨림이 생김',
    '감도를 올리면 약한 음도 필터가 많이 열려 모든 음이 밝아짐',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Wiley', year: 2011, note: '와와, 엔벨로프 필터, 음량 측정' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed., Routledge', year: 2019, note: '엔벨로프 팔로워와 오토와 구현' },
    { type: 'article', title: 'Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients" (Audio EQ Cookbook)', url: 'https://www.w3.org/TR/audio-eq-cookbook/', note: '공명 로우패스 계수' },
  ],
  params: [
    { key: 'mode', label: '제어 방식', type: 'select', options: [{ value: 'lfo', label: 'LFO' }, { value: 'env', label: '엔벨로프 팔로워' }], a: 'lfo', b: 'env', group: '와' },
    { key: 'sens', label: '감도', type: 'range', min: 0.5, max: 8, step: 0.1, default: 3, shared: true, when: (p) => p.mode === 'env' },
    { key: 'atk', label: '어택 (ms)', type: 'range', min: 0.5, max: 50, step: 0.5, default: 3, shared: true, when: (p) => p.mode === 'env' },
    { key: 'rel', label: '릴리스 (ms)', type: 'range', min: 10, max: 500, step: 5, default: 120, shared: true, when: (p) => p.mode === 'env' },
    { key: 'rate', label: 'LFO 속도 (Hz)', type: 'range', min: 0.2, max: 8, step: 0.1, default: 1.3, shared: true, when: (p) => p.mode === 'lfo' },
    { key: 'fmin', label: '최저 컷오프 (Hz)', type: 'range', min: 100, max: 800, step: 10, default: 250, shared: true, group: '필터' },
    { key: 'fmax', label: '최고 컷오프 (Hz)', type: 'range', min: 1000, max: 6000, step: 50, default: 3000, shared: true },
    { key: 'q', label: '공명 Q', type: 'range', min: 0.7, max: 12, step: 0.1, default: 5, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Envelope Follower and Auto-Wah',
    summary: 'An envelope follower makes a signal that tracks the level of a sound. Driving the cutoff of a resonant filter with it gives an auto-wah: hard notes open with a "wah" and soft notes stay closed. An LFO moves the filter steadily, no matter how you play.',
    views: { a: 'LFO wah (ignores playing)', b: 'Envelope wah (follows level)' },
    controls: 'Change mode, sensitivity, attack and release in the parameter table. Press "Sound on" to hear the view that plays sound.',
    info: `
    <p>An <b>envelope follower</b> turns the instant level of audio into a smooth control signal. It rectifies (absolute value) and then lowpass filters. Different coefficients for rising and falling (attack, release) let it react fast and fall slowly.</p>
    <p>An <b>auto-wah (envelope filter)</b> moves the cutoff of a strongly resonant filter with the follower value. The Mu-Tron III (1972) is the famous one, used a lot on funk bass and guitar.</p>
    <ul>
      <li><b>LFO wah</b>: opens and closes at a fixed rate. If it does not match the beat, it feels separate from the playing.</li>
      <li><b>Envelope wah</b>: opens on every note and closes as the note fades. Note strength (velocity) changes the tone directly, so it responds to the player.</li>
      <li>The cutoff uses an exponential mapping: <code>fc = fmin × (fmax / fmin)^e</code>, because the ear hears frequency on a log scale.</li>
      <li>Too slow an attack misses the start of a note. Too fast a release makes the filter flutter (ripple).</li>
    </ul>`,
    look: [
      'In the top graph, B\'s cutoff curve (blue) rises with every peak of the level curve (gray). A is a sine shape that ignores the notes.',
      '"Level to cutoff correlation" is near 1 in B and near 0 in A.',
      'Lower release to 20 ms in B. The cutoff curve shakes like a saw, and the sound gets a noisy flutter.',
      'Raise sensitivity. The filter opens wide even on soft notes, so every note gets bright.',
    ],
    refs: ['Wah-wah, envelope filters and level detection.', 'Envelope follower and auto-wah code.', 'Resonant lowpass coefficients.'],
    params: {
      mode: { label: 'Control', group: 'Wah', options: { env: 'Envelope follower' } },
      sens: 'Sensitivity',
      atk: 'Attack (ms)',
      rel: 'Release (ms)',
      rate: 'LFO rate (Hz)',
      fmin: { label: 'Lowest cutoff (Hz)', group: 'Filter' },
      fmax: 'Highest cutoff (Hz)',
      q: 'Resonance Q',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b, TAU = Math.PI * 2;
    const SRV = 16000, BPM = 100, LOOP = 60 / BPM * 4; // 1마디 16분음표
    // 펑크 베이스: 16칸, [음, 세기] (0 = 쉼)
    const PAT = [[40, 1], [0, 0], [40, 0.35], [52, 0.6], [0, 0], [40, 0.9], [0, 0], [43, 0.4], [45, 1], [0, 0], [45, 0.3], [0, 0], [47, 0.8], [0, 0], [38, 0.5], [40, 0.7]];

    function makeSource(sr) {
      const step = LOOP / 16;
      let n = 0, ph = 0;
      return () => {
        const t = (n % Math.round(LOOP * sr)) / sr, k = Math.floor(t / step), tt = t - k * step, [m, v] = PAT[k];
        n++;
        if (!m) return 0;
        ph = (ph + A.mtof(m) / sr) % 1;
        return A.wave.saw(ph) * v * Math.min(1, tt * 400) * Math.exp(-tt * 6) * Math.min(1, (step - tt) * 200) * 0.5;
      };
    }
    // 와 처리기. o.e: 팔로워 값, o.fc: 컷오프
    function makeWah(sr) {
      const f = A.biquad('lowpass', 500, P.q, 0, sr);
      let n = 0;
      const o = { e: 0, fc: P.fmin };
      o.step = (x) => {
        const ax = Math.abs(x), ca = 1 - Math.exp(-1 / (P.atk / 1000 * sr)), cr = 1 - Math.exp(-1 / (P.rel / 1000 * sr));
        o.e += (ax > o.e ? ca : cr) * (ax - o.e);
        if (n % 16 === 0) {
          const k = P.mode === 'env' ? U.clamp(o.e * P.sens, 0, 1) : 0.5 + 0.5 * Math.sin(TAU * P.rate * n / sr);
          o.fc = P.fmin * Math.pow(P.fmax / P.fmin, k);
          const q = A.biquad('lowpass', o.fc, P.q, 0, sr);
          f.b0 = q.b0; f.b1 = q.b1; f.b2 = q.b2; f.a1 = q.a1; f.a2 = q.a2;
        }
        n++;
        return f.process(x) * 0.8 / Math.sqrt(P.q);
      };
      return o;
    }

    let live = null;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (!live || live.sr !== sr) live = { sr, src: makeSource(sr), fx: makeWah(sr), n: 0 };
        for (let i = 0; i < n; i++) { const v = live.fx.step(live.src()); l[i] = v; r[i] = v; }
        live.n += n;
      },
    });

    // 1마디 오프라인: 음량 곡선, 컷오프 곡선
    let key = '', envC = null, fcC = null, corr = 0;
    function analyze() {
      const k = [P.mode, P.sens, P.atk, P.rel, P.rate, P.fmin, P.fmax, P.q].join();
      if (k === key) return;
      key = k;
      const n = Math.round(LOOP * SRV) * 2, src = makeSource(SRV), fx = makeWah(SRV), hop = 40, half = n / 2;
      envC = new Float32Array(Math.floor(half / hop)); fcC = new Float32Array(envC.length);
      // 레벨 측정용 별도 팔로워 (어택 1ms, 릴리스 60ms 고정)
      let lv = 0;
      const la = 1 - Math.exp(-1 / (0.001 * SRV)), lr = 1 - Math.exp(-1 / (0.06 * SRV));
      for (let i = 0; i < n; i++) {
        const x = src(); fx.step(x);
        const ax = Math.abs(x); lv += (ax > lv ? la : lr) * (ax - lv);
        if (i >= half && (i - half) % hop === 0) { const j = (i - half) / hop; if (j < envC.length) { envC[j] = lv; fcC[j] = Math.log(fx.fc / P.fmin) / Math.log(P.fmax / P.fmin); } }
      }
      // 상관도
      const m1 = envC.reduce((a, b) => a + b, 0) / envC.length, m2 = fcC.reduce((a, b) => a + b, 0) / fcC.length;
      let s = 0, s1 = 0, s2 = 0;
      for (let j = 0; j < envC.length; j++) { const a = envC[j] - m1, b = fcC[j] - m2; s += a * b; s1 += a * a; s2 += b * b; }
      corr = s / Math.sqrt(Math.max(1e-12, s1 * s2));
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const h1 = Math.max(60, (H - pad * 3) * 0.55);
        D.rect(g, pad, pad, w, h1, 'rgba(0,0,0,0.35)');
        // 16분음표 격자
        for (let k = 0; k <= 16; k++) { const px = pad + w * k / 16; D.line(g, px, pad, px, pad + h1, k % 4 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.18)', 1); }
        let em = 1e-6;
        for (const v of envC) em = Math.max(em, v);
        const plot = (arr, scale, c, lw) => {
          g.beginPath();
          for (let j = 0; j < arr.length; j++) { const px = pad + w * j / (arr.length - 1), py = pad + h1 - 6 - U.clamp(arr[j] * scale, 0, 1) * (h1 - 22); j ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = c; g.lineWidth = lw; g.stroke();
        };
        plot(envC, 1 / em, 'rgba(255,255,255,0.45)', 1.5);
        plot(fcC, 1, col, 2);
        D.text(g, GTL.L('1마디: 회색 = 입력 음량, 색 = 컷오프 (로그, fmin~fmax)', '1 bar: gray = input level, color = cutoff (log, fmin to fmax)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 재생 위치
        if (live && snd.on) { const px = pad + w * ((live.n / live.sr) % LOOP) / LOOP; D.line(g, px, pad, px, pad + h1, C.warn, 1); }
        // 지금 필터 응답
        const y2 = pad * 2 + h1, h2 = H - y2 - pad;
        const fcNow = live && snd.on ? live.fx.fc : P.fmin * Math.pow(P.fmax / P.fmin, fcC[Math.floor(((ctx.time % LOOP) / LOOP) * fcC.length) % fcC.length]);
        const cf = A.biquad('lowpass', fcNow, P.q, 0, 48000);
        A.drawResponse(g, (f) => cf.response(f).db - A.linToDb(Math.sqrt(P.q)), pad, y2, w, h2, { color: col, minDb: -36, maxDb: 18, dbStep: 12, label: GTL.L('지금 필터 응답', 'Current filter response') });
        ctx.stat(GTL.L('지금 컷오프', 'Cutoff now'), fcNow.toFixed(0) + ' Hz');
        ctx.stat(GTL.L('음량-컷오프 상관도', 'Level to cutoff correlation'), corr.toFixed(2));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
