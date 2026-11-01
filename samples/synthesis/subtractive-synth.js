// 감산 합성 보이스: 톱니파 2개 → 레조넌트 로우패스(SVF) → 앰프. 필터 엔벨로프를 끄면 음색이 고정되고, 켜면 음마다 "와우" 하고 닫힘
GTL.register({
  id: 'subtractive-synth',
  title: '감산 합성 보이스 (필터 엔벨로프)',
  summary: '배음이 많은 톱니파를 필터로 깎아 음색을 만드는 감산 합성. 필터 컷오프를 엔벨로프로 움직이면 음마다 밝게 시작해 어두워지는 생동감이 생김.',
  views: { a: '필터 엔벨로프 끔', b: '필터 엔벨로프 켬' },
  controls: '파라미터 표에서 컷오프, 레조넌스, 엔벨로프 양을 바꿈. "소리 켜기"를 누르면 베이스 프레이즈가 반복됨.',
  info: `
    <p><b>감산 합성(Subtractive Synthesis)</b>은 배음이 풍부한 파형에서 필요 없는 배음을 필터로 깎아 내는 방식. Minimoog, Juno, TB-303 같은 아날로그 신시사이저가 모두 이 구조.</p>
    <ul>
      <li><b>오실레이터</b>: 톱니파 2개. 하나를 몇 센트 어긋나게 해서 두껍게 만듦.</li>
      <li><b>필터</b>: 레조넌트 로우패스. 컷오프 위의 배음을 줄이고, 레조넌스(Q)로 컷오프 근처를 강조.</li>
      <li><b>앰프</b>: 음량 엔벨로프</li>
      <li><b>필터 엔벨로프</b>: 음이 시작될 때 컷오프를 올렸다가 내림. 엔벨로프 양은 옥타브 단위.</li>
    </ul>
    <p>컷오프를 샘플마다 바꾸면 일반 바이쿼드는 계수가 튀어 잡음이 생기기 쉬움. 여기서는 변조에 강한 TPT 상태 변수 필터(SVF)를 씀. 이 필터의 응답은 아날로그 2차 로우패스를 쌍선형 변환한 것과 같음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="30" width="100" height="44" rx="5" class="f-dim"/><text x="60" y="50" text-anchor="middle">${L('톱니파 x2', 'Saw x2')}</text><text x="60" y="65" text-anchor="middle" class="t-small t-dim">${L('배음 풍부', 'rich harmonics')}</text>
    <rect x="170" y="30" width="120" height="44" rx="5" class="f-dim"/><text x="230" y="50" text-anchor="middle">${L('로우패스 필터', 'Lowpass filter')}</text><text x="230" y="65" text-anchor="middle" class="t-small t-dim">${L('컷오프, Q', 'cutoff, Q')}</text>
    <rect x="350" y="30" width="80" height="44" rx="5" class="f-dim"/><text x="390" y="56" text-anchor="middle">${L('앰프', 'Amp')}</text>
    <line x1="110" y1="52" x2="168" y2="52" class="d-accent" marker-end="url(#arr)"/><line x1="290" y1="52" x2="348" y2="52" class="d-accent" marker-end="url(#arr)"/><line x1="430" y1="52" x2="488" y2="52" class="d-accent" marker-end="url(#arr)"/>
    <text x="495" y="56" class="t-small">${L('출력', 'out')}</text>
    <rect x="170" y="100" width="120" height="34" rx="5" class="f-dim"/><text x="230" y="121" text-anchor="middle" class="t-b">${L('필터 엔벨로프', 'Filter envelope')}</text>
    <rect x="350" y="100" width="80" height="34" rx="5" class="f-dim"/><text x="390" y="121" text-anchor="middle" class="t-small">${L('앰프 엔벨로프', 'Amp envelope')}</text>
    <line x1="230" y1="100" x2="230" y2="76" class="d-b" marker-end="url(#arr)"/><line x1="390" y1="100" x2="390" y2="76" class="d-line" marker-end="url(#arr)"/>
  </svg>`,
  look: [
    '위 그래프에서 A의 컷오프는 평평한 선, B는 음마다 솟았다가 떨어지는 톱니 모양',
    '"소리 켜기"를 누르고 B를 들으면 음마다 "뷰" 하고 닫히는 베이스 소리가 남. A는 같은 음색이 이어짐.',
    '레조넌스를 12 근처로 올리면 아래 응답 곡선의 봉우리가 높아지고, B에서 컷오프가 움직이며 휘파람 같은 소리가 섞임',
    '필터 디케이를 0.05초로 줄이면 B의 소리가 짧게 튀는 "플럭" 소리로 바뀜',
  ],
  refs: [
    { type: 'book', title: 'Vadim Zavalishin, The Art of VA Filter Design', year: 2018, note: 'TPT(위상 지연 없는 쌍선형) 상태 변수 필터' },
    { type: 'article', title: 'Andrew Simper, "Linear Trapezoidal Integrated State Variable Filter" (Cytomic technical paper)', year: 2013, note: '여기서 쓴 SVF 계산식' },
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '가상 아날로그 신시사이저 구조' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '감산 합성 개요' },
  ],
  params: [
    { key: 'fenv', label: '필터 엔벨로프', type: 'bool', a: false, b: true, group: '필터' },
    { key: 'cutoff', label: '컷오프 (Hz)', type: 'range', min: 60, max: 4000, step: 1, default: 220, shared: true },
    { key: 'res', label: '레조넌스 (Q)', type: 'range', min: 0.5, max: 15, step: 0.1, default: 4, shared: true },
    { key: 'amount', label: '엔벨로프 양 (옥타브)', type: 'range', min: 0, max: 6, step: 0.1, default: 4, shared: true, when: (p) => p.fenv },
    { key: 'fdecay', label: '필터 디케이 (초)', type: 'range', min: 0.03, max: 1.5, step: 0.01, default: 0.25, shared: true, when: (p) => p.fenv },
    { key: 'detune', label: '오실레이터 2 디튠 (센트)', type: 'range', min: 0, max: 30, step: 0.5, default: 8, shared: true, group: '오실레이터' },
    { key: 'tempo', label: '템포 (BPM)', type: 'int', min: 60, max: 180, default: 116, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Subtractive Synth Voice (Filter Envelope)',
    summary: 'Subtractive synthesis starts from a saw wave with many harmonics and cuts them with a filter. When an envelope moves the filter cutoff, each note starts bright and turns dark, which makes the sound come alive.',
    views: { a: 'Filter envelope off', b: 'Filter envelope on' },
    controls: 'Change cutoff, resonance and envelope amount in the parameter table. Press "Sound on" to hear a bass phrase loop.',
    info: `
    <p><b>Subtractive synthesis</b> starts with a waveform full of harmonics and removes the ones you do not want with a filter. Analog synths such as the Minimoog, Juno and TB-303 all use this structure.</p>
    <ul>
      <li><b>Oscillators</b>: two saw waves. One is detuned by a few cents to make the sound thicker.</li>
      <li><b>Filter</b>: a resonant lowpass. It reduces harmonics above the cutoff, and resonance (Q) boosts the area near the cutoff.</li>
      <li><b>Amp</b>: the loudness envelope.</li>
      <li><b>Filter envelope</b>: raises the cutoff at the start of each note and then lowers it. The amount is in octaves.</li>
    </ul>
    <p>If you change the cutoff every sample, a normal biquad can jump and make noise. This sample uses a TPT state variable filter (SVF), which handles modulation well. Its response equals an analog 2nd order lowpass after the bilinear transform.</p>`,
    look: [
      'In the top graph, A\'s cutoff is a flat line. B\'s cutoff jumps up and falls on every note.',
      'Press "Sound on" and listen to B. Each note closes with a "yow" sound. A keeps the same tone.',
      'Raise resonance to about 12. The peak in the response curve grows, and B gets a whistling sweep.',
      'Lower filter decay to 0.05 s. B turns into a short plucky sound.',
    ],
    refs: ['TPT (zero-delay feedback) state variable filter.', 'The SVF equations used here.', 'Virtual analog synth structure.', 'Overview of subtractive synthesis.'],
    params: {
      fenv: { label: 'Filter envelope', group: 'Filter' },
      cutoff: 'Cutoff (Hz)', res: 'Resonance (Q)', amount: 'Envelope amount (octaves)', fdecay: 'Filter decay (s)',
      detune: { label: 'Osc 2 detune (cents)', group: 'Oscillator' },
      tempo: 'Tempo (BPM)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const NOTES = [33, 33, 45, 33, 36, 33, 40, 43, 33, 33, 45, 33, 31, 31, 43, 38];
    const step = () => 60 / P.tempo / 2;          // 8분음표
    const loopLen = () => step() * NOTES.length;

    // 시간 t(초)에서 노트, 엔벨로프, 컷오프. 소리와 그림이 같은 함수를 씀
    function voiceAt(t, sr) {
      const st = step(), i = Math.floor(t / st) % NOTES.length, tn = t - Math.floor(t / st) * st;
      const gate = st * 0.7;
      let amp = Math.min(1, tn / 0.003) * (0.65 + 0.35 * Math.exp(-tn / 0.08));
      if (tn > gate) amp *= Math.exp(-(tn - gate) / 0.015);
      const fe = P.fenv ? Math.min(1, tn / 0.002) * Math.exp(-tn * 6.9 / Math.max(0.01, P.fdecay)) : 0;
      const fc = U.clamp(P.cutoff * Math.pow(2, P.amount * fe), 20, sr * 0.45);
      return { note: NOTES[i], amp, fc };
    }

    // TPT SVF 로우패스 (Simper). s: { ic1, ic2 }
    function svf(s, x, fc, q, sr) {
      const g = Math.tan(Math.PI * fc / sr), k = 1 / q;
      const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
      const v3 = x - s.ic2, v1 = a1 * s.ic1 + a2 * v3, v2 = s.ic2 + a2 * s.ic1 + a3 * v3;
      s.ic1 = 2 * v1 - s.ic1; s.ic2 = 2 * v2 - s.ic2;
      return v2;
    }
    // 같은 필터의 크기 응답 (쌍선형 변환된 아날로그 원형)
    const svfDb = (f, fc, q, sr) => {
      const w = Math.tan(Math.PI * Math.min(f, sr * 0.499) / sr) / Math.tan(Math.PI * fc / sr);
      return -10 * Math.log10((1 - w * w) ** 2 + (w / q) ** 2);
    };

    const live = { n: 0, p1: 0, p2: 0, f: { ic1: 0, ic2: 0 } };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        for (let i = 0; i < n; i++) {
          const t = (live.n++ / sr) % loopLen();
          const v = voiceAt(t, sr), f = A.mtof(v.note);
          const d1 = f / sr, d2 = d1 * Math.pow(2, P.detune / 1200);
          const s1 = 2 * live.p1 - 1 - A.polyBlep(live.p1, d1), s2 = 2 * live.p2 - 1 - A.polyBlep(live.p2, d2);
          live.p1 = (live.p1 + d1) % 1; live.p2 = (live.p2 + d2) % 1;
          const y = svf(live.f, (s1 + s2) * 0.5, v.fc, P.res, sr) * v.amp;
          const o = Math.tanh(y * 0.9) * 0.5; l[i] = o; r[i] = o;
        }
      },
    });

    let visT = 0;
    const SR = 48000;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const len = loopLen(), tp = (snd.on ? live.n / (snd.sr || SR) : visT) % len;
        const sr = snd.sr || SR;
        // 1) 컷오프 궤적 (세로 로그 주파수)
        const x0 = pad + 34, w = W - x0 - pad, h1 = (H - pad * 3) * 0.45, y1 = pad;
        D.rect(g, x0, y1, w, h1, 'rgba(0,0,0,0.35)');
        const fy = (f) => y1 + h1 - Math.log(f / 40) / Math.log(10000 / 40) * h1;
        for (const f of [50, 100, 200, 500, 1000, 2000, 5000]) { D.line(g, x0, fy(f), x0 + w, fy(f), C.grid, 1); D.text(g, f >= 1000 ? f / 1000 + 'k' : '' + f, x0 - 4, fy(f) - 5, { size: 9, color: C.dim, align: 'right' }); }
        const st = step();
        for (let i = 0; i < NOTES.length; i++) { // 음의 기음
          const f = A.mtof(NOTES[i]), xa = x0 + (i * st / len) * w;
          D.line(g, xa, fy(f), xa + st * 0.7 / len * w, fy(f), C.good, 2);
        }
        g.beginPath();
        for (let px = 0; px <= w; px++) { const v = voiceAt(px / w * len, sr); const py = fy(U.clamp(v.fc, 40, 10000)); px ? g.lineTo(x0 + px, py) : g.moveTo(x0 + px, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.line(g, x0 + tp / len * w, y1, x0 + tp / len * w, y1 + h1, C.text, 1);
        D.text(g, Lx('컷오프 궤적 (초록 = 음의 기음)', 'Cutoff path (green = note fundamental)'), x0 + 4, y1 + 3, { size: 10, color: C.dim });
        // 2) 현재 순간의 필터 응답 + 필터를 지난 배음
        const v = voiceAt(tp, sr), f0 = A.mtof(v.note);
        const y2 = y1 + h1 + pad, h2 = H - y2 - pad;
        A.drawResponse(g, (f) => svfDb(f, v.fc, P.res, sr), pad, y2, W - pad * 2, h2, { color: C.dim, minDb: -60, maxDb: 24, fmin: 20, fmax: 20000, lineWidth: 1.5 });
        for (let k = 1; k * f0 < 20000; k++) {
          const db = 20 * Math.log10(1 / k) + svfDb(k * f0, v.fc, P.res, sr);
          const px = A.freqX(k * f0, pad, W - pad * 2, 20, 20000), py = y2 + h2 - U.clamp((db + 60) / 84, 0, 1) * h2;
          D.line(g, px, y2 + h2, px, py, col, 2);
        }
        D.text(g, Lx('필터 응답 (회색)과 필터를 지난 배음 (막대)', 'Filter response (gray) and harmonics after the filter (bars)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        ctx.stat(Lx('현재 음', 'Current note'), A.noteName(v.note) + ` (${f0.toFixed(1)} Hz)`);
        ctx.stat(Lx('현재 컷오프', 'Current cutoff'), v.fc.toFixed(0) + ' Hz');
        ctx.stat(Lx('컷오프 아래 배음 수', 'Harmonics below cutoff'), Math.floor(v.fc / f0));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
