// 셰퍼드 톤과 리세 글리산도: 끝없이 올라가는 것처럼 들리는 착각
GTL.register({
  id: 'shepard-tone',
  title: '셰퍼드 톤 (끝없는 상승)',
  summary: '옥타브 간격의 사인파 묶음을 종 모양 세기로 감싸면 계속 올라가는데도 제자리로 돌아오는 소리가 됨. A의 단순 글리산도는 한 옥타브마다 뚝 떨어지고, B의 리세 글리산도는 끊김 없이 영원히 올라가는 것처럼 들림.',
  views: { a: '단순 글리산도', b: '리세 글리산도' },
  controls: '파라미터 표에서 방식, 속도, 방향을 바꿈. "소리 켜기"를 누르면 계속 재생됨.',
  info: `
    <p><b>셰퍼드 톤(Shepard tone)</b>은 한 옥타브씩 떨어진 사인파 여러 개를 동시에 울리는 소리. 각 성분의 세기는 로그 주파수 축에서 고정된 종 모양 곡선(엔벨로프)을 따름.</p>
    <ul>
      <li>모든 성분을 함께 반음씩 올리면 맨 위 성분은 엔벨로프 끝에서 조용히 사라지고, 맨 아래에 새 성분이 조용히 생김</li>
      <li>12반음을 올리면 처음과 완전히 같은 소리. 그런데 매 단계는 분명히 "올라감"으로 들림.</li>
      <li>귀는 음 높이를 <b>음 높이 부류(Chroma, 도레미 중 무엇)</b>와 <b>높낮이(Height)</b> 두 성분으로 느낌. 셰퍼드 톤은 높낮이 단서를 지우고 음 높이 부류만 남김.</li>
    </ul>
    <p>계단식이 Shepard(1964), 연속으로 미끄러지는 것이 <b>리세 글리산도(Risset glissando)</b>. 게임과 영화에서 긴장이 계속 쌓이는 효과음, 마리오 64의 끝없는 계단, 영화 덩케르크의 음악에 쓰임.</p>
    <p>엔벨로프가 평평하면 성분이 나타나고 사라지는 순간이 들려 착각이 깨짐. "평평한 옥타브 묶음"으로 확인 가능.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="140" x2="520" y2="140" class="d-line"/>
    <text x="520" y="158" text-anchor="end" class="t-small t-dim">${L('로그 주파수 (옥타브)', 'Log frequency (octaves)')}</text>
    <path d="M40,138 C140,136 200,30 275,30 C350,30 410,136 510,138" class="d-accent"/>
    <text x="275" y="22" text-anchor="middle" class="t-small">${L('고정된 종 모양 엔벨로프', 'Fixed bell envelope')}</text>
    <line x1="70" y1="140" x2="70" y2="134" class="d-b"/><line x1="130" y1="140" x2="130" y2="112" class="d-b"/><line x1="190" y1="140" x2="190" y2="62" class="d-b"/>
    <line x1="250" y1="140" x2="250" y2="33" class="d-b"/><line x1="310" y1="140" x2="310" y2="36" class="d-b"/><line x1="370" y1="140" x2="370" y2="72" class="d-b"/>
    <line x1="430" y1="140" x2="430" y2="120" class="d-b"/><line x1="490" y1="140" x2="490" y2="137" class="d-b"/>
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <path d="M200,90 L235,90" class="d-accent" marker-end="url(#arr)"/><path d="M380,100 L415,100" class="d-accent" marker-end="url(#arr)"/>
    <text x="70" y="174" text-anchor="middle" class="t-small t-b">${L('새 성분이 조용히 생김', 'New partial fades in')}</text>
    <text x="470" y="174" text-anchor="middle" class="t-small t-b">${L('위 성분이 조용히 사라짐', 'Top partial fades out')}</text>
  </svg>`,
  look: [
    'A의 위 그래프는 선 하나가 올라가다 한 옥타브 아래로 뚝 떨어짐. B는 여러 선이 모두 올라가지만 밝기가 가운데에서만 밝음.',
    '"소리 켜기"를 누르고 B를 1분쯤 들으면 계속 올라가는데 음역은 그대로인 느낌. A는 6초마다 떨어지는 순간이 들림.',
    'B의 방식을 "평평한 옥타브 묶음"으로 바꾸면 성분이 생기고 사라질 때 툭 끊기는 소리가 나서 착각이 깨짐',
    '"스펙트럼 무게중심" 측정값은 A에서 크게 오르내리고, B에서는 거의 그대로',
    '방향을 "내려감"으로 바꾸면 끝없이 내려가는 소리가 됨',
  ],
  refs: [
    { type: 'paper', title: 'Shepard, "Circularity in judgments of relative pitch", JASA 36(12)', year: 1964, note: '셰퍼드 톤의 원 논문' },
    { type: 'paper', title: 'Risset, "Pitch control and pitch paradoxes demonstrated with computer-synthesized sounds", JASA 46'
, year: 1969, note: '연속 글리산도 버전 (리세 글리산도)' },
    { type: 'paper', title: 'Deutsch, "A musical paradox", Music Perception 3(3)', year: 1986, note: '셰퍼드 톤으로 만든 다른 착각 (삼전음 역설)' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '가산 합성과 음 높이 착각' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'single', label: '단순 글리산도 (사인파 하나)' }, { value: 'flat', label: '평평한 옥타브 묶음' }, { value: 'step', label: '셰퍼드 계단 (반음씩)' }, { value: 'risset', label: '리세 글리산도 (연속)' }], a: 'single', b: 'risset', default: 'single', group: '소리 구성' },
    { key: 'speed', label: '속도 (반음/초)', type: 'range', min: 0.5, max: 8, step: 0.1, default: 2, shared: true },
    { key: 'dir', label: '방향', type: 'select', options: [{ value: 1, label: '올라감' }, { value: -1, label: '내려감' }], default: 1, shared: true },
    { key: 'octs', label: '옥타브 수 (성분 수)', type: 'int', min: 4, max: 10, default: 8, shared: true },
    { key: 'width', label: '엔벨로프 폭 (옥타브)', type: 'range', min: 0.6, max: 3, step: 0.05, default: 1.4, shared: true, help: '종 모양 곡선의 표준편차' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Shepard Tone (Endless Rise)',
    summary: 'Wrap a stack of octave-spaced sines in a bell-shaped level curve and the sound keeps rising while returning to where it started. A\'s plain glissando drops down every octave. B\'s Risset glissando seems to rise forever without a break.',
    views: { a: 'Plain glissando', b: 'Risset glissando' },
    controls: 'Change the method, speed and direction in the parameter table. Press "Sound on" to play continuously.',
    info: `
    <p>A <b>Shepard tone</b> plays several sines one octave apart at the same time. The level of each partial follows a fixed bell-shaped curve (envelope) on a log frequency axis.</p>
    <ul>
      <li>Raise all partials by a semitone together. The top partial fades out quietly at the edge of the envelope, and a new partial fades in quietly at the bottom.</li>
      <li>After 12 semitones the sound is exactly the same as at the start. Yet each step clearly sounds "higher".</li>
      <li>The ear hears pitch as two parts: <b>chroma</b> (which note name) and <b>height</b>. A Shepard tone removes the height cue and keeps only chroma.</li>
    </ul>
    <p>The stepped version is Shepard (1964). The continuously sliding version is the <b>Risset glissando</b>. Games and films use it for sounds where tension keeps building: the endless stairs in Mario 64, the score of the film Dunkirk.</p>
    <p>With a flat envelope you can hear partials appear and vanish, and the illusion breaks. Try "Flat octave stack".</p>`,
    look: [
      'In A\'s top plot one line rises, then drops an octave. In B many lines all rise, but they are bright only in the middle.',
      'Press "Sound on" and listen to B for about a minute. It keeps rising but stays in the same range. A has an audible drop every 6 seconds.',
      'Switch B to "Flat octave stack". You hear a bump when partials appear and vanish, and the illusion breaks.',
      'The "Spectral centroid" stat swings up and down in A and stays almost still in B.',
      'Set the direction to "Down" for an endless fall.',
    ],
    refs: ['Original Shepard tone paper.', 'The continuous glissando version (Risset glissando).', 'Another illusion built from Shepard tones (the tritone paradox).', 'Additive synthesis and pitch illusions.'],
    params: {
      mode: { label: 'Method', group: 'Sound design', options: { single: 'Plain glissando (one sine)', flat: 'Flat octave stack', step: 'Shepard steps (semitones)', risset: 'Risset glissando (continuous)' } },
      speed: 'Speed (semitones/s)',
      dir: { label: 'Direction', options: { 1: 'Up', '-1': 'Down' } },
      octs: 'Octaves (partials)',
      width: { label: 'Envelope width (octaves)', help: 'Standard deviation of the bell curve' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const FMIN = 27.5, MAXK = 10;
    let pos = 0; // 올라간 양 (옥타브, 누적)
    // 위치 p(옥타브)에서 성분 목록: { oct (FMIN 기준 옥타브), w (세기) }
    function partials(p) {
      const K = P.octs, center = K / 2;
      let x = p - Math.floor(p);
      if (P.mode === 'step') x = Math.floor(x * 12) / 12;
      const out = [];
      if (P.mode === 'single') { out.push({ oct: center - 0.5 + x, w: 1, k: 0 }); return out; }
      for (let k = 0; k < K; k++) {
        const oct = k + x;
        const w = P.mode === 'flat' ? 1 : Math.exp(-0.5 * Math.pow((oct - center) / P.width, 2));
        out.push({ oct, w, k });
      }
      return out;
    }
    const ph = new Float64Array(MAXK + 1), amp = new Float64Array(MAXK + 1);
    let lastWrap = 0, lastStep = 0, stepEnv = 1;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const dpos = Number(P.dir) * P.speed / 12 / sr;
        for (let i = 0; i < n; i++) {
          pos += dpos;
          const wrap = Math.floor(pos);
          if (wrap !== lastWrap) { // 한 옥타브를 넘으면 성분 번호를 한 칸씩 옮겨 위상을 이어 붙임
            if (P.mode !== 'single') {
              if (wrap > lastWrap) { for (let k = MAXK; k > 0; k--) { ph[k] = ph[k - 1]; amp[k] = amp[k - 1]; } ph[0] = 0; amp[0] = 0; }
              else { for (let k = 0; k < MAXK; k++) { ph[k] = ph[k + 1]; amp[k] = amp[k + 1]; } ph[MAXK] = 0; amp[MAXK] = 0; }
            }
            lastWrap = wrap;
          }
          let x = pos - wrap;
          if (P.mode === 'step') {
            const st = Math.floor(x * 12);
            if (st !== lastStep) { lastStep = st; stepEnv = 0; }
            stepEnv = Math.min(1, stepEnv + 1 / (0.01 * sr));
            x = st / 12;
          } else stepEnv = 1;
          const K = P.mode === 'single' ? 1 : P.octs, center = P.octs / 2;
          let v = 0, wsum = 0;
          for (let k = 0; k < K; k++) {
            const oct = P.mode === 'single' ? center - 0.5 + x : k + x;
            const w = P.mode === 'risset' || P.mode === 'step' ? Math.exp(-0.5 * Math.pow((oct - center) / P.width, 2)) : 1;
            amp[k] += (w - amp[k]) * 0.002;
            wsum += amp[k] * amp[k];
            v += amp[k] * Math.sin(ph[k]);
            ph[k] += 2 * Math.PI * FMIN * Math.pow(2, oct) / sr;
            if (ph[k] > 6.283185307) ph[k] -= 6.283185307;
          }
          const out = v * 0.3 / Math.sqrt(Math.max(0.5, wsum)) * stepEnv;
          l[i] = out; r[i] = out;
        }
      },
    });

    const HIST = 12; // 그래프에 보이는 시간 (초)
    return {
      update(dt) { snd.update(); if (!snd.on) pos += Number(P.dir) * P.speed / 12 * dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const K = P.octs;
        // 위: 시간-주파수 그래프 (계산식으로 그림)
        const gx = pad, gy = pad + 14, gw = W - pad * 2, gh = Math.max(60, (H - 40) * 0.6);
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        const yOfOct = (o) => gy + gh - (o + 0.5) / (K + 0.5) * gh;
        for (let o = 0; o <= K; o++) { D.line(g, gx, yOfOct(o), gx + gw, yOfOct(o), C.grid); D.text(g, 'A' + o, gx + 2, yOfOct(o) - 11, { size: 9, color: C.dim }); }
        D.text(g, L(`음 높이 변화 (최근 ${HIST}초, 밝기 = 세기)`, `Pitch over time (last ${HIST} s, brightness = level)`), gx, pad, { size: 10, color: C.dim });
        const cols = Math.min(200, Math.floor(gw / 2)), rate = Number(P.dir) * P.speed / 12;
        const [cr, cg, cb] = U.hexToRgb(col);
        for (let c = 0; c < cols; c++) {
          const p = pos - rate * HIST * (1 - c / cols), x = gx + c / cols * gw;
          for (const pt of partials(p)) {
            if (pt.w < 0.02) continue;
            g.fillStyle = `rgba(${cr},${cg},${cb},${pt.w.toFixed(3)})`;
            g.fillRect(x, yOfOct(pt.oct) - 1.5, gw / cols + 0.5, 3);
          }
        }
        // 아래 왼쪽: 현재 스펙트럼과 엔벨로프
        const by = gy + gh + pad, bh = H - by - pad, bw = (W - pad * 3) * 0.62;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.35)');
        const xOfOct = (o) => pad + 6 + (bw - 12) * (o + 0.5) / (K + 0.5);
        if (P.mode !== 'single') {
          g.beginPath();
          for (let i = 0; i <= 60; i++) { const o = -0.5 + (K + 0.5) * i / 60, w = P.mode === 'flat' ? 1 : Math.exp(-0.5 * Math.pow((o - K / 2) / P.width, 2)); const x = xOfOct(o), y = by + bh - 6 - w * (bh - 20); i ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.strokeStyle = C.accent; g.lineWidth = 1.5; g.stroke();
        }
        let cnum = 0, cden = 0;
        for (const pt of partials(pos)) {
          const x = xOfOct(pt.oct);
          D.line(g, x, by + bh - 6, x, by + bh - 6 - pt.w * (bh - 20), col, 3);
          cnum += pt.w * pt.w * pt.oct; cden += pt.w * pt.w;
        }
        D.text(g, L('현재 스펙트럼 (로그 주파수)', 'Current spectrum (log frequency)'), pad + 4, by + 3, { size: 10, color: C.dim });
        // 아래 오른쪽: 음 높이 부류 원
        const cx = pad * 2 + bw + (W - pad * 3 - bw) / 2, cy = by + bh / 2, rad = Math.max(10, Math.min((W - pad * 3 - bw) / 2, bh / 2) - 14);
        D.circle(g, cx, cy, rad, null, C.dim, 1);
        const names = A.NOTE_NAMES;
        for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i / 12 * Math.PI * 2; D.text(g, names[(i + 9) % 12], cx + Math.cos(a) * (rad + 8), cy + Math.sin(a) * (rad + 8) - 5, { size: 8, align: 'center', color: C.dim }); }
        let x = pos - Math.floor(pos);
        if (P.mode === 'step') x = Math.floor(x * 12) / 12;
        const a = -Math.PI / 2 + x * Math.PI * 2;
        D.line(g, cx, cy, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, col, 2);
        D.circle(g, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 4, col);
        const centroid = cden ? cnum / cden : 0;
        ctx.stat(L('음 높이 부류', 'Pitch class'), names[(Math.floor(x * 12 + 0.5) + 9) % 12]);
        ctx.stat(L('스펙트럼 무게중심', 'Spectral centroid'), (FMIN * Math.pow(2, centroid)).toFixed(0) + ' Hz');
        ctx.stat(L('한 바퀴 시간', 'Cycle time'), (12 / P.speed).toFixed(1) + ' s');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
