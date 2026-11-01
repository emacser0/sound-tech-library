// 거리 감쇠: 점 음원(-6dB/거리 2배) vs 선 음원(-3dB/거리 2배, 길이를 넘으면 -6dB)
GTL.register({
  id: 'inverse-square-law',
  title: '거리에 따른 감쇠 (점 음원 vs 선 음원)',
  summary: '점 음원의 소리는 거리가 2배가 되면 6dB 작아짐(역제곱 법칙). 도로, 라인 어레이 같은 긴 선 음원은 3dB만 작아지다가, 선 길이보다 멀어지면 점 음원처럼 6dB씩 작아짐.',
  views: { a: '점 음원', b: '선 음원 (20m)' },
  controls: '파라미터 표에서 거리와 음원 종류를 바꿈. "듣는 사람 이동"을 켜면 1m~64m를 오감. "소리 켜기"를 누르면 그 거리의 음량으로 노이즈가 들림.',
  info: `
    <p>소리의 에너지는 음원에서 퍼져 나가며 점점 넓은 면적에 나뉨. 작은 <b>점 음원</b>에서는 구 모양으로 퍼지고, 구의 넓이는 4πr². 거리가 2배면 넓이가 4배라서 세기(Intensity)는 1/4, 즉 -6dB. 이것이 <b>역제곱 법칙(Inverse Square Law)</b>.</p>
    <p>차가 이어지는 도로나 스피커를 세로로 쌓은 라인 어레이는 <b>선 음원</b>처럼 행동함. 원통 모양으로 퍼지고 넓이는 2πrH. 거리가 2배면 세기는 1/2, 즉 -3dB.</p>
    <ul>
      <li>길이 H인 선 음원은 가까이서는 -3dB/2배, 거리가 약 H/π를 넘으면 점 음원처럼 -6dB/2배</li>
      <li>공연장 라인 어레이가 먼 객석까지 고르게 들리는 이유</li>
      <li>실내에서는 반사음(잔향)이 더해져 멀리서도 레벨이 덜 떨어짐. 아주 먼 거리에서는 공기 흡수로 고음이 더 줄어듦. 이 샘플은 자유 음장(반사 없음)만 다룸.</li>
      <li>게임 오디오의 거리 감쇠 곡선(Inverse, Linear, Log)도 이 법칙을 기준으로 조정함</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="90" r="4" class="f-a"/>
    <circle cx="70" cy="90" r="25" class="d-a"/><circle cx="70" cy="90" r="50" class="d-a" stroke-dasharray="4 3"/>
    <text x="70" y="160" text-anchor="middle" class="t-small t-a">${L('구면: 넓이 4πr²', 'Sphere: area 4πr²')}</text>
    <text x="70" y="176" text-anchor="middle" class="t-small">${L('거리 2배 → -6dB', '2x distance → -6 dB')}</text>
    <line x1="230" y1="30" x2="230" y2="150" class="d-b" stroke-width="4"/>
    <rect x="205" y="30" width="50" height="120" class="d-b" fill="none" stroke-dasharray="4 3"/>
    <rect x="180" y="30" width="100" height="120" class="d-b" fill="none" stroke-dasharray="2 4"/>
    <text x="230" y="168" text-anchor="middle" class="t-small t-b">${L('원통면: 넓이 2πrH', 'Cylinder: area 2πrH')}</text>
    <text x="230" y="22" text-anchor="middle" class="t-small">${L('거리 2배 → -3dB', '2x distance → -3 dB')}</text>
    <line x1="320" y1="150" x2="530" y2="150" class="d-dim"/><line x1="320" y1="30" x2="320" y2="150" class="d-dim"/>
    <line x1="320" y1="40" x2="520" y2="140" class="d-a"/>
    <path d="M320,40 L420,70 L520,120" class="d-b"/>
    <line x1="420" y1="34" x2="420" y2="150" class="d-dim" stroke-dasharray="3 3"/>
    <text x="420" y="28" text-anchor="middle" class="t-small t-dim">≈ H/π</text>
    <text x="425" y="166" text-anchor="middle" class="t-small t-dim">${L('log 거리', 'log distance')}</text>
    <text x="330" y="100" class="t-small t-a">-6dB</text>
    <text x="350" y="46" class="t-small t-b">-3dB</text>
  </svg>`,
  look: [
    '거리를 2m에서 4m로 바꾸면 A의 레벨은 6dB, B는 약 3dB 줄어듦. "거리 2배당 감쇠" 측정값으로 확인.',
    '거리를 30m 넘게 늘리면 B의 감쇠도 6dB에 가까워짐. 곡선이 점 음원 기울기로 꺾임.',
    '"듣는 사람 이동"을 켜고 소리를 들으면 A는 멀어질 때 빨리 작아지고 B는 천천히 작아짐',
    'B의 선 길이를 5m로 줄이면 꺾이는 거리(H/π)가 가까워짐',
  ],
  refs: [
    { type: 'book', title: 'F. Alton Everest, Ken C. Pohlmann, Master Handbook of Acoustics', note: '자유 음장의 역제곱 법칙' },
    { type: 'book', title: 'Leo L. Beranek, Tim J. Mellow, Acoustics: Sound Fields and Transducers', year: 2012, note: '점 음원과 선 음원의 음장' },
    { type: 'article', title: 'ISO 9613-2: Acoustics, Attenuation of sound during propagation outdoors, Part 2', year: 1996, note: '기하 확산과 공기 흡수에 의한 실외 감쇠' },
    { type: 'book', title: 'Karen Collins, Game Sound: An Introduction to the History, Theory, and Practice of Video Game Music and Sound Design', year: 2008, note: '게임 오디오의 거리 감쇠' },
  ],
  params: [
    { key: 'kind', label: '음원 종류', type: 'select', options: [{ value: 'point', label: '점 음원' }, { value: 'line', label: '선 음원 (유한 길이)' }], a: 'point', b: 'line', default: 'point', group: '음원' },
    { key: 'len', label: '선 길이 H (m)', type: 'range', min: 2, max: 60, step: 1, default: 20, shared: true, group: '음원', when: (p) => p.kind === 'line' },
    { key: 'dist', label: '거리 (m)', type: 'range', min: 1, max: 64, step: 0.1, default: 8, shared: true, group: '듣는 사람' },
    { key: 'auto', label: '듣는 사람 이동', type: 'bool', default: false, shared: true, group: '듣는 사람', help: '1m~64m를 8초 동안 오감 (거리 파라미터 무시)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Distance Attenuation (Point Source vs Line Source)',
    summary: 'Sound from a point source drops by 6 dB each time the distance doubles (inverse square law). A long line source, like a road or a line array, drops only 3 dB, until you are farther than its length. Then it drops 6 dB like a point source.',
    views: { a: 'Point source', b: 'Line source (20 m)' },
    controls: 'Change the distance and source type in the parameter table. Turn on "Move listener" to travel between 1 m and 64 m. Press "Sound on" to hear noise at the level for that distance.',
    info: `
    <p>Sound energy spreads out from the source over a larger and larger area. A small <b>point source</b> spreads as a sphere with area 4πr². Double the distance and the area is 4 times larger, so the intensity is 1/4, or -6 dB. This is the <b>inverse square law</b>.</p>
    <p>A busy road or a tall stack of speakers (line array) acts like a <b>line source</b>. It spreads as a cylinder with area 2πrH. Double the distance and the intensity is 1/2, or -3 dB.</p>
    <ul>
      <li>A line source of length H drops 3 dB per doubling up close. Beyond about H/π it drops 6 dB per doubling, like a point source.</li>
      <li>This is why a concert line array sounds even all the way to the back seats.</li>
      <li>Indoors, reflections (reverb) add up and the level falls less with distance. Very far away, air absorption removes extra treble. This sample covers only the free field (no reflections).</li>
      <li>Game audio distance curves (inverse, linear, log) are tuned with this law as the reference.</li>
    </ul>`,
    look: [
      'Change the distance from 2 m to 4 m. A drops 6 dB and B about 3 dB. Check the "Drop per doubling" stat.',
      'Go past 30 m. B\'s drop also nears 6 dB. Its curve bends to the point source slope.',
      'Turn on "Move listener" and listen. A gets quiet fast as it moves away, B fades slowly.',
      'Shorten B\'s line to 5 m. The bend distance (H/π) moves closer.',
    ],
    refs: ['Inverse square law in the free field.', 'Sound fields of point and line sources.', 'Outdoor attenuation from geometric spreading and air absorption.', 'Distance attenuation in game audio.'],
    params: {
      kind: { label: 'Source type', group: 'Source', options: { point: 'Point source', line: 'Line source (finite length)' } },
      len: { label: 'Line length H (m)', group: 'Source' },
      dist: { label: 'Distance (m)', group: 'Listener' },
      auto: { label: 'Move listener', group: 'Listener', help: 'Travels between 1 m and 64 m over 8 seconds (ignores the distance parameter)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    let t = 0;

    // 축 위 거리 d에서의 세기 (선 음원은 가운데 수직 방향)
    const inten = (kind, d) => (kind === 'line' ? (2 / d) * Math.atan(P.len / (2 * d)) : 1 / (d * d));
    // 1m 기준 레벨 (dB)
    const level = (kind, d) => 10 * Math.log10(inten(kind, d) / inten(kind, 1));
    // 평면 위 (x, y)에서의 세기. 음원은 x = 0, 선은 y 방향
    const field = (x, y) => {
      if (P.kind === 'line') { const xx = Math.max(0.05, x), h = P.len / 2; return (Math.atan((h - y) / xx) + Math.atan((h + y) / xx)) / xx; }
      return 1 / Math.max(0.0025, x * x + y * y);
    };
    const distNow = (tt) => (P.auto ? Math.pow(2, 3 - 3 * Math.cos(U.TAU * tt / 8)) : P.dist);

    const rng = U.rng(ctx.seed || 1);
    const live = { b: [0, 0, 0, 0, 0, 0, 0], g: 0, time: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(20, sr);
        for (let i = 0; i < n; i++) {
          live.time += 1 / sr;
          const target = Math.pow(10, level(P.kind, distNow(P.auto ? live.time : t)) / 20);
          live.g += (target - live.g) * k;
          const w = rng.range(-1, 1), b = live.b;
          b[0] = 0.99886 * b[0] + w * 0.0555179; b[1] = 0.99332 * b[1] + w * 0.0750759; b[2] = 0.969 * b[2] + w * 0.153852;
          b[3] = 0.8665 * b[3] + w * 0.3104856; b[4] = 0.55 * b[4] + w * 0.5329522; b[5] = -0.7616 * b[5] - w * 0.016898;
          const x = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + w * 0.5362) * 0.11; b[6] = w * 0.115926;
          const v = x * live.g * 0.6; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) { t += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const d = distNow(snd.on && P.auto ? live.time : t);
        // 평면 음장 (0 ~ 범위 m)
        const fh = Math.max(60, H * 0.4), fw = W - pad * 2, range = 70;
        const GX = 70, GY = 28, cw = fw / GX, ch = fh / GY;
        const mPerPxX = range / fw, half = (fh / 2) * mPerPxX;
        const ref = field(1, 0);
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
          const x = (i + 0.5) * cw * mPerPxX, y = ((j + 0.5) / GY * 2 - 1) * half;
          const db = 10 * Math.log10(field(x, y) / ref);
          const v = U.clamp((db + 45) / 45, 0, 1);
          g.fillStyle = ctx.side === 'a' ? `rgba(255,122,89,${(v * 0.85).toFixed(3)})` : `rgba(79,195,247,${(v * 0.85).toFixed(3)})`;
          g.fillRect(pad + i * cw, pad + j * ch, cw + 0.5, ch + 0.5);
        }
        D.rect(g, pad, pad, fw, fh, null, C.grid, 1);
        const sy = pad + fh / 2;
        if (P.kind === 'line') { const hp = (P.len / 2) / mPerPxX; D.line(g, pad + 1, Math.max(pad, sy - hp), pad + 1, Math.min(pad + fh, sy + hp), '#fff', 3); }
        else D.circle(g, pad + 2, sy, 4, '#fff');
        const lxp = pad + d / mPerPxX;
        D.circle(g, lxp, sy, 5, C.warn, '#000', 1);
        for (let m = 10; m < range; m += 10) D.text(g, m + 'm', pad + m / mPerPxX, pad + fh - 11, { size: 9, color: C.dim, align: 'center' });
        D.text(g, Lx('위에서 본 음장 (진할수록 큼, 노란 점 = 듣는 사람)', 'Sound field from above (stronger = brighter, yellow dot = listener)'), pad + 4, pad + 3, { size: 10, color: C.dim });

        // 거리-레벨 그래프 (log2 거리 1 ~ 128m)
        const gy = pad * 2 + fh, gh = H - gy - pad, gx = pad, gw = W - pad * 2;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        const xOf = (dd) => gx + 30 + (Math.log2(dd) / 7) * (gw - 40);
        const dbTop = 0, dbBot = -45, yOf = (db) => gy + 16 + (dbTop - U.clamp(db, dbBot - 5, dbTop)) / (dbTop - dbBot) * (gh - 32);
        for (let k = 0; k <= 7; k++) { const x = xOf(2 ** k); D.line(g, x, gy + 14, x, gy + gh - 14, C.grid, 1); D.text(g, (2 ** k) + 'm', x, gy + gh - 12, { size: 9, color: C.dim, align: 'center' }); }
        for (let db = 0; db >= dbBot; db -= 6) { const y = yOf(db); D.line(g, gx + 30, y, gx + gw - 10, y, C.grid, 1); D.text(g, db + 'dB', gx + 2, y - 5, { size: 9, color: C.dim }); }
        const curve = (kind, color, lw) => {
          g.beginPath();
          for (let i = 0; i <= 200; i++) { const dd = 2 ** (7 * i / 200), x = xOf(dd), y = yOf(level(kind, dd)); i ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.strokeStyle = color; g.lineWidth = lw; g.stroke();
        };
        curve(P.kind === 'line' ? 'point' : 'line', 'rgba(255,255,255,0.25)', 1);
        curve(P.kind, col, 2.5);
        if (P.kind === 'line') { const x = xOf(Math.max(1, P.len / Math.PI)); g.setLineDash([3, 3]); D.line(g, x, gy + 14, x, gy + gh - 14, C.accent, 1); g.setLineDash([]); D.text(g, 'H/π', x + 3, gy + 16, { size: 9, color: C.accent }); }
        D.circle(g, xOf(d), yOf(level(P.kind, d)), 5, C.warn);
        D.text(g, Lx('거리에 따른 레벨 (1m = 0dB, 흐린 선 = 다른 음원 종류)', 'Level vs distance (1 m = 0 dB, faint line = other source type)'), gx + 4, gy + 3, { size: 10, color: C.dim });

        const lv = level(P.kind, d), drop = level(P.kind, d) - level(P.kind, 2 * d);
        ctx.stat(Lx('거리', 'Distance'), d.toFixed(1) + ' m');
        ctx.stat(Lx('레벨 (1m 기준)', 'Level (re 1 m)'), lv.toFixed(1) + ' dB');
        ctx.stat(Lx('거리 2배당 감쇠', 'Drop per doubling'), drop.toFixed(2) + ' dB');
        if (P.kind === 'line') ctx.stat(Lx('꺾이는 거리 H/π', 'Bend distance H/π'), (P.len / Math.PI).toFixed(1) + ' m');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') { live.time = 0; snd.toggle(); } },
      dispose() { snd.stop(); },
    };
  },
});
