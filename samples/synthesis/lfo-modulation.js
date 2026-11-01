// LFO 변조: 느린 오실레이터의 모양(사인, 삼각, 사각, 톱니, 샘플 앤 홀드)과 목적지(피치, 음량, 컷오프, 팬)
GTL.register({
  id: 'lfo-modulation',
  title: 'LFO 모양과 목적지',
  summary: '귀에 들리지 않을 만큼 느린 오실레이터(LFO)로 다른 파라미터를 흔들면 소리에 움직임이 생김. 같은 LFO라도 피치에 걸면 비브라토, 음량이면 트레몰로, 컷오프면 와우, 모양이 샘플 앤 홀드면 무작위 계단 소리가 됨.',
  views: { a: '삼각파 → 피치', b: '샘플 앤 홀드 → 컷오프' },
  controls: '파라미터 표에서 LFO 모양, 목적지, 속도, 깊이를 바꿈. "소리 켜기"를 누르면 같은 음이 계속 울림.',
  info: `
    <p><b>LFO(Low Frequency Oscillator)</b>는 0.1~20Hz 정도의 느린 오실레이터. 직접 듣지 않고 다른 파라미터를 주기적으로 움직이는 데(변조) 씀.</p>
    <ul>
      <li><b>피치</b>: 비브라토. 사람 목소리와 현악기는 5~6Hz, &plusmn;20~50센트 정도.</li>
      <li><b>음량</b>: 트레몰로. 기타 앰프의 트레몰로 효과.</li>
      <li><b>컷오프</b>: 와우, 덥스텝의 "워블" 베이스. 옥타브 단위로 흔들어야 고르게 들림.</li>
      <li><b>팬</b>: 오토 팬. 소리가 좌우로 오감.</li>
    </ul>
    <p>모양에 따라 성격이 바뀜. 사인과 삼각은 부드럽고, 사각은 두 값을 오가고(트릴), 톱니는 한 방향으로 쓸고 되돌아감. <b>샘플 앤 홀드(S&amp;H)</b>는 주기마다 무작위 값을 하나 뽑아 유지해 계단 모양이 되고, <b>부드러운 무작위</b>는 그 값 사이를 이어 자연스러운 흔들림을 만듦. 계단 모양은 값이 순간적으로 뛰므로 실제 구현에서는 짧게(수 ms) 다듬어 딸깍 소리를 막음.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
    <text x="60" y="18" text-anchor="middle" class="t-small">${L('사인', 'Sine')}</text><path d="M20,60 q10,-32 20,0 t20,0 t20,0 t20,0" class="d-line"/>
    <text x="160" y="18" text-anchor="middle" class="t-small">${L('삼각', 'Triangle')}</text><polyline points="120,60 130,30 150,90 170,30 190,90 200,60" class="d-a"/>
    <text x="260" y="18" text-anchor="middle" class="t-small">${L('사각', 'Square')}</text><polyline points="220,30 240,30 240,90 260,90 260,30 280,30 280,90 300,90" class="d-line"/>
    <text x="360" y="18" text-anchor="middle" class="t-small">${L('톱니', 'Saw')}</text><polyline points="320,90 340,30 340,90 360,30 360,90 380,30 380,90 400,30" class="d-line"/>
    <text x="470" y="18" text-anchor="middle" class="t-small">S&amp;H</text><polyline points="420,50 440,50 440,82 460,82 460,36 480,36 480,70 500,70 500,44 520,44" class="d-b"/>
    <text x="270" y="120" text-anchor="middle" class="t-small t-dim">${L('목적지: 피치 (비브라토), 음량 (트레몰로), 컷오프 (와우), 팬 (오토 팬)', 'Destinations: pitch (vibrato), level (tremolo), cutoff (wah), pan (auto-pan)')}</text>
  </svg>`,
  look: [
    '위 그래프에서 A의 LFO는 부드러운 삼각파, B는 주기마다 높이가 무작위로 바뀌는 계단',
    '"소리 켜기"를 누르고 A를 들으면 음 높이가 오르내리는 비브라토, B는 음색이 무작위로 바뀌는 "삐뽀삐" 소리',
    'B의 목적지를 피치로 바꾸면 무작위 음이 이어지는 옛날 컴퓨터 소리가 됨',
    '속도를 0.3Hz로 내리고 목적지를 팬으로 바꾸면 소리가 천천히 좌우로 오감. 가운데 그래프에서 L, R 위치를 확인 가능.',
  ],
  refs: [
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: 'LFO와 변조 매트릭스' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '비브라토, 트레몰로, 변조' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '비브라토, 트레몰로, 오토 팬, 와우' },
  ],
  params: [
    { key: 'shape', label: 'LFO 모양', type: 'select', options: [
      { value: 'sine', label: '사인' }, { value: 'tri', label: '삼각' }, { value: 'square', label: '사각' }, { value: 'saw', label: '톱니' },
      { value: 'sh', label: '샘플 앤 홀드' }, { value: 'smooth', label: '부드러운 무작위' }], default: 'tri', a: 'tri', b: 'sh', group: 'LFO' },
    { key: 'dest', label: '목적지', type: 'select', options: [{ value: 'pitch', label: '피치' }, { value: 'amp', label: '음량' }, { value: 'cutoff', label: '컷오프' }, { value: 'pan', label: '팬' }], default: 'pitch', a: 'pitch', b: 'cutoff' },
    { key: 'rate', label: '속도 (Hz)', type: 'range', min: 0.1, max: 20, step: 0.1, default: 5, shared: true },
    { key: 'depth', label: '깊이', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5, shared: true, help: '피치 ±100센트, 음량 0~100%, 컷오프 ±3옥타브, 팬 좌우 끝까지' },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 36, max: 72, default: 48, shared: true, group: '음', help: '60 = C4 (가운데 도)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'LFO Shapes and Destinations',
    summary: 'A low frequency oscillator (LFO), too slow to hear, adds motion when it moves other parameters. On pitch it is vibrato, on level it is tremolo, on cutoff it is wah, and a sample and hold shape gives random steps.',
    views: { a: 'Triangle → pitch', b: 'Sample and hold → cutoff' },
    controls: 'Change LFO shape, destination, rate and depth in the parameter table. Press "Sound on" to hear a held note.',
    info: `
    <p>An <b>LFO (low frequency oscillator)</b> runs at about 0.1 to 20 Hz. You do not hear it directly. It moves other parameters periodically (modulation).</p>
    <ul>
      <li><b>Pitch</b>: vibrato. Voices and string players use about 5 to 6 Hz and &plusmn;20 to 50 cents.</li>
      <li><b>Level</b>: tremolo, like the tremolo effect on a guitar amp.</li>
      <li><b>Cutoff</b>: wah, or the "wobble" bass of dubstep. Move it in octaves so it sounds even.</li>
      <li><b>Pan</b>: auto-pan. The sound moves left and right.</li>
    </ul>
    <p>The shape changes the character. Sine and triangle are smooth, square jumps between two values (trill), and saw sweeps one way and jumps back. <b>Sample and hold (S&amp;H)</b> picks a random value each cycle and holds it, which makes steps. <b>Smooth random</b> connects those values for a natural wander. Steps jump instantly, so real implementations smooth them over a few ms to avoid clicks.</p>`,
    look: [
      'In the top graph, A\'s LFO is a smooth triangle. B is a staircase whose height changes randomly each cycle.',
      'Press "Sound on" and listen to A. The pitch goes up and down (vibrato). B\'s tone changes randomly, like a "bleep bloop".',
      'Set B\'s destination to pitch. You get random notes in a row, like an old computer.',
      'Lower the rate to 0.3 Hz and set the destination to pan. The sound slowly moves left and right. Check the L, R position in the middle graph.',
    ],
    refs: ['LFOs and the modulation matrix.', 'Vibrato, tremolo and modulation.', 'Vibrato, tremolo, auto-pan and wah.'],
    params: {
      shape: { label: 'LFO shape', group: 'LFO', options: { sine: 'Sine', tri: 'Triangle', square: 'Square', saw: 'Saw', sh: 'Sample and hold', smooth: 'Smooth random' } },
      dest: { label: 'Destination', options: { pitch: 'Pitch', amp: 'Level', cutoff: 'Cutoff', pan: 'Pan' } },
      rate: 'Rate (Hz)',
      depth: { label: 'Depth', help: 'Pitch ±100 cents, level 0 to 100%, cutoff ±3 octaves, pan full left to right' },
      note: { label: 'Pitch (MIDI)', group: 'Note', help: '60 = C4 (middle C)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    const seed = (ctx.seed || 1) * 7919;
    // 정수 k에 대한 결정적 무작위 값 (-1~1). 소리와 그림이 같은 값을 씀
    const hash = (k) => { let x = Math.imul((k + seed) | 0, 0x9e3779b1); x ^= x >>> 15; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return ((x >>> 0) / 4294967295) * 2 - 1; };
    // LFO 값 (-1~1). 위상 p = 시간 x 속도 (누적)
    function lfo(p) {
      const k = Math.floor(p), f = p - k;
      switch (P.shape) {
        case 'sine': return Math.sin(TAU * p);
        case 'tri': return 1 - 4 * Math.abs(((p + 0.25) % 1) - 0.5);
        case 'square': return f < 0.5 ? 1 : -1;
        case 'saw': return 2 * f - 1;
        case 'sh': return hash(k);
        default: { const a = hash(k), b = hash(k + 1), s = (1 - Math.cos(Math.PI * f)) / 2; return a + (b - a) * s; }
      }
    }
    // 목적지 값
    const pitchCents = (v) => (P.dest === 'pitch' ? v * 100 * P.depth : 0);
    const ampGain = (v) => (P.dest === 'amp' ? 1 - P.depth * (1 - v) / 2 : 1);
    const cutoffHz = (v) => 900 * Math.pow(2, P.dest === 'cutoff' ? v * 3 * P.depth : 0);
    const panPos = (v) => (P.dest === 'pan' ? v * P.depth : 0);

    // TPT SVF 로우패스
    function svf(s, x, fc, sr) {
      const g = Math.tan(Math.PI * Math.min(fc, sr * 0.45) / sr), k = 1 / 3;
      const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
      const v3 = x - s.ic2, v1 = a1 * s.ic1 + a2 * v3, v2 = s.ic2 + a2 * s.ic1 + a3 * v3;
      s.ic1 = 2 * v1 - s.ic1; s.ic2 = 2 * v2 - s.ic2;
      return v2;
    }

    const live = { lp: 0, ph: 0, f: { ic1: 0, ic2: 0 }, sm: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f0 = A.mtof(P.note), k = A.onePoleCoef(300, sr); // 계단을 약 0.5ms로 다듬음
        for (let i = 0; i < n; i++) {
          live.lp += P.rate / sr;
          live.sm += k * (lfo(live.lp) - live.sm);
          const v = live.sm, f = f0 * Math.pow(2, pitchCents(v) / 1200), dt = f / sr;
          let x = 2 * live.ph - 1 - A.polyBlep(live.ph, dt);
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          x = svf(live.f, x, cutoffHz(v), sr) * ampGain(v) * 0.25;
          const pn = panPos(v);
          l[i] = x * Math.cos((pn + 1) * Math.PI / 4) * Math.SQRT2; r[i] = x * Math.sin((pn + 1) * Math.PI / 4) * Math.SQRT2;
        }
      },
    });

    let visP = 0;
    const SPAN = 3; // 초
    return {
      update(dt) { snd.update(); if (!snd.on) visP += dt * P.rate; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const pNow = snd.on ? live.lp : visP, v = lfo(pNow);
        // 1) LFO 파형 (최근 3초)
        const h1 = (H - pad * 3) * 0.42, sw = W - pad * 2;
        D.rect(g, pad, pad, sw, h1, 'rgba(0,0,0,0.35)');
        D.line(g, pad, pad + h1 / 2, pad + sw, pad + h1 / 2, C.grid, 1);
        g.beginPath();
        const steps = Math.max(200, Math.floor(sw));
        for (let i = 0; i <= steps; i++) { const p = pNow - (1 - i / steps) * SPAN * P.rate; const px = pad + i / steps * sw, py = pad + h1 / 2 - lfo(p) * h1 * 0.42; i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.circle(g, pad + sw, pad + h1 / 2 - v * h1 * 0.42, 5, col);
        D.text(g, Lx('LFO (최근 3초)', 'LFO (last 3 s)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 2) 목적지 표시
        const y2 = pad * 2 + h1, h2 = H - y2 - pad;
        D.rect(g, pad, y2, sw, h2, 'rgba(0,0,0,0.35)');
        let label = '', valueText = '';
        if (P.dest === 'cutoff') {
          const fc = cutoffHz(v), f0 = A.mtof(P.note);
          A.drawResponse(g, (f) => { const w = Math.tan(Math.PI * Math.min(f, 23900) / 48000) / Math.tan(Math.PI * fc / 48000); return -10 * Math.log10((1 - w * w) ** 2 + (w / 3) ** 2); }, pad, y2, sw, h2, { color: col, minDb: -48, maxDb: 12, background: false });
          for (let h = 1; h * f0 < 20000; h++) { const px = A.freqX(h * f0, pad, sw, 20, 20000); D.line(g, px, y2 + h2 - 5, px, y2 + h2, C.good, 2); }
          label = Lx('필터 응답 (초록 = 배음)', 'Filter response (green = harmonics)'); valueText = fc.toFixed(0) + ' Hz';
        } else if (P.dest === 'pitch') {
          const cents = pitchCents(v), cx = pad + sw / 2, sc = sw * 0.45 / 100;
          for (let c = -100; c <= 100; c += 25) { D.line(g, cx + c * sc, y2 + h2 * 0.3, cx + c * sc, y2 + h2 * 0.7, C.grid, 1); D.text(g, (c > 0 ? '+' : '') + c, cx + c * sc, y2 + h2 * 0.72, { size: 9, color: C.dim, align: 'center' }); }
          D.rect(g, cx + Math.min(0, cents * sc), y2 + h2 * 0.4, Math.abs(cents * sc) + 2, h2 * 0.2, col);
          label = Lx('피치 변화 (센트)', 'Pitch change (cents)'); valueText = (cents >= 0 ? '+' : '') + cents.toFixed(1) + ' cents';
        } else if (P.dest === 'amp') {
          const gn = ampGain(v);
          D.rect(g, pad + 20, y2 + h2 * 0.4, (sw - 40) * gn, h2 * 0.2, col);
          D.rect(g, pad + 20, y2 + h2 * 0.4, sw - 40, h2 * 0.2, null, C.dim);
          label = Lx('음량 (선형)', 'Level (linear)'); valueText = A.linToDb(gn).toFixed(1) + ' dB';
        } else {
          const pn = panPos(v), cx = pad + sw / 2;
          D.line(g, pad + 20, y2 + h2 / 2, pad + sw - 20, y2 + h2 / 2, C.dim, 1);
          D.text(g, 'L', pad + 8, y2 + h2 / 2 - 6, { size: 11, color: C.dim }); D.text(g, 'R', pad + sw - 16, y2 + h2 / 2 - 6, { size: 11, color: C.dim });
          D.circle(g, cx + pn * (sw / 2 - 20), y2 + h2 / 2, 9, col);
          label = Lx('팬 위치', 'Pan position'); valueText = (pn * 100).toFixed(0) + '%';
        }
        D.text(g, label, pad + 4, y2 + 3, { size: 10, color: C.dim });
        ctx.stat(Lx('LFO 값', 'LFO value'), v.toFixed(2));
        ctx.stat(Lx('목적지 값', 'Destination value'), valueText);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
