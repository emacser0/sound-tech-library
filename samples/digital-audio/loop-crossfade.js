// 루프 지점과 크로스페이드: 샘플을 반복 재생할 때 끝과 시작이 맞지 않으면 매 반복마다 클릭이 남
GTL.register({
  id: 'loop-crossfade',
  title: '샘플 루프 지점과 크로스페이드',
  summary: '지속음 샘플의 일부를 반복 재생할 때 루프 지점을 그냥 자른 경우와 크로스페이드로 이은 경우를 비교. 끝과 시작의 값이 다르면 반복마다 클릭이 나고, 크로스페이드는 이음매를 매끄럽게 만듦.',
  views: { a: '그냥 자르기', b: '크로스페이드 루프' },
  controls: '파라미터 표에서 루프 시작, 길이, 방식을 바꿈',
  info: `
    <p>샘플러와 게임 엔진은 지속음(현악 패드, 엔진음, 바람)을 짧은 구간의 <b>루프</b>로 길게 늘림. 재생 위치가 루프 끝에 닿으면 루프 시작으로 돌아감.</p>
    <p>끝 샘플과 시작 샘플의 값이 다르면 그 자리에서 파형이 뚝 끊겨 <b>클릭</b>이 남. 루프가 짧으면 클릭이 일정한 박자로 반복되어 버즈처럼 들림.</p>
    <ul>
      <li><b>영점 교차(Zero crossing)</b>: 루프 끝과 시작을 둘 다 값이 0이고 위로 올라가는 지점으로 옮김. 값은 맞지만 기울기와 파형 모양은 다를 수 있음. 여러 음이 섞인 소리에서는 효과가 작음.</li>
      <li><b>크로스페이드 루프</b>: 루프 끝 부분을 루프 시작 직전 구간과 섞어서, 끝에 닿을 때 이미 시작 직전 소리가 되게 만듦. 상관이 낮은 소리(노이즈, 합창)는 등전력(sin, cos) 곡선, 거의 같은 파형은 선형 곡선이 적합.</li>
      <li>단점: 크로스페이드 구간에서 위상이 다른 성분이 섞여 잠깐 소리가 얇아질(콤 필터) 수 있음. 길이는 수십 ms가 흔함.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="20" y="40" width="500" height="50" class="f-dim"/>
    <rect x="160" y="40" width="260" height="50" class="f-b" opacity="0.25"/>
    <line x1="160" y1="30" x2="160" y2="100" class="d-line"/><line x1="420" y1="30" x2="420" y2="100" class="d-line"/>
    <text x="160" y="24" text-anchor="middle" class="t-small">${L('루프 시작', 'loop start')}</text>
    <text x="420" y="24" text-anchor="middle" class="t-small">${L('루프 끝', 'loop end')}</text>
    <rect x="100" y="98" width="60" height="14" class="f-accent"/>
    <rect x="360" y="98" width="60" height="14" class="f-b"/>
    <path d="M130,118 Q260,160 388,118" class="d-accent" marker-end="url(#arr)"/>
    <text x="260" y="162" text-anchor="middle" class="t-small t-dim">${L('시작 직전 구간(보라)을 끝 구간(파랑)에 점점 섞음', 'Blend the part before the start (purple) into the end (blue) gradually')}</text>
    <path d="M415,60 Q470,0 168,52" class="d-dim" stroke-dasharray="3 3" marker-end="url(#arr)"/>
    <text x="470" y="34" class="t-small t-dim">${L('반복', 'repeat')}</text>
  </svg>`,
  look: [
    'A의 이음매 확대 파형에서 세로 점선 자리의 파형이 뚝 끊김. 아래 고역 성분에 큰 튐이 보임. B는 이어짐.',
    '"소리 켜기"로 A를 들으면 루프마다 똑, 똑 클릭이 들림',
    'A를 "영점 교차"로 바꾸면 값의 계단과 클릭이 크게 줄어듦. 하지만 루프 길이가 영점 위치에 묶여 원하는 길이로 맞출 수 없음.',
    '루프 길이를 50 ms로 줄이면 A의 클릭이 20 Hz 버즈가 됨',
  ],
  refs: [
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', note: '샘플링 신시사이저의 루프와 크로스페이드' },
    { type: 'book', title: 'Martin Russ, Sound Synthesis and Sampling, 3rd ed.', year: 2008, note: '루프 지점 찾기' },
    { type: 'article', title: 'MDN, AudioBufferSourceNode.loopStart / loopEnd', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/loopStart', note: '웹 오디오의 루프 구간 재생' },
    { type: 'article', title: 'Audiokinetic, Wwise Help: Looping and crossfading in the Source Editor', note: '게임 오디오 미들웨어의 루프 편집' },
  ],
  params: [
    { key: 'mode', label: '루프 방식', type: 'select', options: [{ value: 'raw', label: '그냥 자르기' }, { value: 'zero', label: '영점 교차로 맞춤' }, { value: 'xfade', label: '크로스페이드' }], a: 'raw', b: 'xfade', default: 'raw', group: '루프' },
    { key: 'xf', label: '크로스페이드 길이 (ms)', type: 'range', min: 5, max: 200, step: 1, default: 60, shared: true, when: (p) => p.mode === 'xfade' },
    { key: 'start', label: '루프 시작 (ms)', type: 'range', min: 250, max: 1200, step: 1, default: 523, shared: true, group: '루프 구간' },
    { key: 'len', label: '루프 길이 (ms)', type: 'range', min: 20, max: 700, step: 1, default: 417, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Sample Loop Points and Crossfade',
    summary: 'Compares repeating part of a sustained sample with a plain cut and with a crossfade loop. If the end and start values differ, every repeat clicks. A crossfade makes the seam smooth.',
    views: { a: 'Plain cut', b: 'Crossfade loop' },
    controls: 'Change the loop start, length and method in the parameter table.',
    info: `
    <p>Samplers and game engines stretch sustained sounds (string pads, engine hum, wind) by repeating a short <b>loop</b>. When playback reaches the loop end it jumps back to the loop start.</p>
    <p>If the end and start sample values differ, the waveform breaks there and you hear a <b>click</b>. With a short loop the clicks repeat at a steady rate and sound like a buzz.</p>
    <ul>
      <li><b>Zero crossing</b>: moves both loop points to places where the value is 0 and rising. The values match, but the slope and waveform shape can still differ. It helps little with sounds that mix many tones.</li>
      <li><b>Crossfade loop</b>: blends the end of the loop with the part just before the loop start, so the end already sounds like the start when you get there. Use an equal-power (sin, cos) curve for uncorrelated sounds (noise, choir) and a linear curve for nearly identical waveforms.</li>
      <li>Drawback: parts with different phase mix inside the crossfade and the sound may thin out briefly (comb filtering). Lengths of tens of ms are common.</li>
    </ul>`,
    look: [
      'In A\'s seam zoom the waveform breaks at the dashed line, and the highs below show a big spike. B continues smoothly.',
      'Press "Sound on" and listen to A. Each loop clicks.',
      'Switch A to "Zero crossing". The value step and the click shrink a lot. But the loop length is now tied to zero positions and cannot be set freely.',
      'Shorten the loop to 50 ms. A\'s clicks become a 20 Hz buzz.',
    ],
    refs: ['Loops and crossfades in sampling synthesizers.', 'Finding loop points.', 'Loop region playback in Web Audio.', 'Loop editing in game audio middleware.'],
    params: {
      mode: { label: 'Loop method', group: 'Loop', options: { raw: 'Plain cut', zero: 'Snap to zero crossing', xfade: 'Crossfade' } },
      xf: 'Crossfade length (ms)',
      start: { label: 'Loop start (ms)', group: 'Loop region' },
      len: 'Loop length (ms)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, LEN = SR * 2, TAU = Math.PI * 2;

    // 원본: 2초 패드 (디튠 톱니파 화음 + 숨소리 노이즈, 천천히 변하는 음색). 두 뷰가 같음
    const src = new Float32Array(LEN);
    {
      const rng = U.rng(ctx.seed + 3), voices = [];
      for (const m of [57, 64, 69]) for (const d of [-7, 0, 6]) voices.push({ f: A.mtof(m + d / 100), ph: rng.next() });
      const lp = A.biquad('lowpass', 1800, 0.7, 0, SR), bp = A.biquad('bandpass', 2500, 1.2, 0, SR);
      for (let i = 0; i < LEN; i++) {
        let s = 0;
        for (const v of voices) { const dt = v.f / SR; v.ph += dt; if (v.ph >= 1) v.ph -= 1; s += 2 * v.ph - 1 - A.polyBlep(v.ph, dt); }
        const t = i / SR;
        s = lp.process(s * 0.09) * (0.85 + 0.15 * Math.sin(TAU * 0.7 * t));
        s += bp.process(rng.range(-1, 1)) * 0.05;
        src[i] = s * Math.min(1, t / 0.15);
      }
      A.normalize(src, 0.3);
    }
    const zeroNear = (i) => { // 가장 가까운 상승 영점 교차
      for (let d = 0; d < 2400; d++) for (const j of [i + d, i - d]) if (j > 0 && j < LEN && src[j - 1] < 0 && src[j] >= 0) return j;
      return i;
    };

    let key = '', loop = null, s0 = 0, e0 = 0, X = 0, jump = 0, clickDb = 0, hp = null;
    function analyze() {
      const k = [P.mode, P.xf, P.start, P.len].join('|');
      if (k === key) return;
      key = k;
      s0 = Math.round(P.start * SR / 1000); e0 = Math.min(LEN - 1, s0 + Math.round(P.len * SR / 1000));
      if (P.mode === 'zero') { s0 = zeroNear(s0); e0 = zeroNear(e0); if (e0 <= s0 + 100) e0 = s0 + 100; }
      const Ln = e0 - s0;
      X = P.mode === 'xfade' ? Math.min(Math.round(P.xf * SR / 1000), Ln - 1, s0) : 0;
      loop = new Float32Array(Ln);
      for (let i = 0; i < Ln; i++) {
        let v = src[s0 + i];
        if (X > 0 && i >= Ln - X) { const j = i - (Ln - X), f = (j + 1) / X; v = v * Math.cos(f * Math.PI / 2) + src[s0 - X + j] * Math.sin(f * Math.PI / 2); }
        loop[i] = v;
      }
      jump = Math.abs(loop[0] - loop[Ln - 1]);
      // 클릭 크기: 이음매 주변 2차 차분(고역)의 최대 / 루프 전체 2차 차분의 RMS
      const d2 = (i) => { const a = loop[(i - 1 + Ln) % Ln], b = loop[i % Ln], c = loop[(i + 1) % Ln]; return a - 2 * b + c; };
      let rms = 0; for (let i = 0; i < Ln; i++) rms += d2(i) ** 2; rms = Math.sqrt(rms / Ln);
      let mx = 0; for (let i = -3; i <= 3; i++) mx = Math.max(mx, Math.abs(d2((Ln + i) % Ln)));
      clickDb = 20 * Math.log10(mx / Math.max(1e-9, rms));
      hp = d2;
    }

    let pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        const Ln = loop.length, step = SR / sr;
        for (let i = 0; i < n; i++) {
          if (pos >= Ln) pos %= Ln;
          const i0 = Math.floor(pos), fr = pos - i0, v = (loop[i0] * (1 - fr) + loop[(i0 + 1) % Ln] * fr) * 1.6;
          pos += step;
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, w = W - pad * 2;
        const oh = Math.max(40, H * 0.22), zh = Math.max(60, H * 0.38);
        // 전체 개요와 루프 구간
        A.drawWave(g, src, pad, pad, w, oh, { color: 'rgba(216,221,230,0.5)', amp: 2.5, lineWidth: 1 });
        const ox = (i) => pad + (i / LEN) * w;
        D.rect(g, ox(s0), pad, ox(e0) - ox(s0), oh, ctx.side === 'a' ? 'rgba(255,122,89,0.18)' : 'rgba(79,195,247,0.18)');
        if (X > 0) D.rect(g, ox(s0 - X), pad + oh - 6, ox(s0) - ox(s0 - X), 6, C.accent);
        D.line(g, ox(s0), pad, ox(s0), pad + oh, col, 2); D.line(g, ox(e0), pad, ox(e0), pad + oh, col, 2);
        if (snd.on) { const px = ox(s0 + (pos % loop.length)); D.line(g, px, pad, px, pad + oh, C.warn, 1); }
        D.text(g, Lx('원본 2초와 루프 구간', 'Source (2 s) and loop region'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 이음매 확대: 루프 끝 6 ms + 시작 6 ms (재생되는 순서)
        const Ln = loop.length, HALF = Math.min(288, Math.floor(Ln / 2)), seam = new Float32Array(HALF * 2), hseam = new Float32Array(HALF * 2);
        for (let i = 0; i < HALF * 2; i++) { const j = (Ln - HALF + i) % Ln; seam[i] = loop[j]; hseam[i] = hp(j); }
        let pk = 1e-6; for (let i = 0; i < seam.length; i++) pk = Math.max(pk, Math.abs(seam[i]));
        const zy = pad * 2 + oh;
        A.drawWave(g, seam, pad, zy, w, zh, { color: col, amp: 0.9 / pk, label: Lx('이음매 확대 (끝 6 ms → 시작 6 ms)', 'Seam zoom (last 6 ms → first 6 ms)') });
        g.setLineDash([4, 3]); D.line(g, pad + w / 2, zy, pad + w / 2, zy + zh, C.warn, 1); g.setLineDash([]);
        // 고역 성분 (2차 차분)
        const hy = zy + zh + pad, hh = H - hy - pad;
        let hpk = 1e-6; for (let i = 0; i < hseam.length; i++) hpk = Math.max(hpk, Math.abs(hseam[i]));
        A.drawWave(g, hseam, pad, hy, w, hh, { color: C.warn, amp: 0.9 / Math.max(hpk, pk * 0.05), label: Lx('고역 성분 (2차 차분): 튀는 곳 = 클릭', 'High-frequency part (2nd difference): spike = click') });

        ctx.stat(Lx('이음매 값 차이', 'Value step at seam'), jump.toFixed(4));
        ctx.stat(Lx('클릭 크기 (평소 대비)', 'Click size (vs normal)'), clickDb.toFixed(1) + ' dB');
        ctx.stat(Lx('루프 반복 주기', 'Loop rate'), (SR / Ln).toFixed(2) + ' Hz');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
