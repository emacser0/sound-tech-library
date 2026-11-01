// 정상파: 열린 관(양쪽 열림) vs 닫힌 관(한쪽 막힘). 끝 조건이 배음렬을 결정함
GTL.register({
  id: 'standing-waves',
  title: '정상파와 관의 공명 (열린 관 vs 닫힌 관)',
  summary: '관이나 현 안에서 오가는 파가 겹치면 제자리에서 진동하는 정상파가 생김. 양쪽이 열린 관은 모든 정수배 배음을, 한쪽이 막힌 관은 홀수 배음만 가지며 한 옥타브 낮게 울림.',
  views: { a: '열린 관 (양쪽 열림)', b: '닫힌 관 (한쪽 막힘)' },
  controls: '파라미터 표에서 관 길이와 모드 번호를 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 공명음이 들림.',
  info: `
    <p>관이나 현의 끝에서 파가 반사되어 되돌아오면, 가는 파와 오는 파가 겹침. 특정 파장에서만 둘이 맞아떨어져 제자리에서 진동하는 <b>정상파(Standing Wave)</b>가 생김. 움직임이 없는 점이 <b>마디(Node)</b>, 가장 크게 움직이는 점이 <b>배(Antinode)</b>.</p>
    <ul>
      <li><b>열린 끝</b>: 바깥 공기와 이어져 압력이 늘 대기압. 압력 마디, 공기 움직임의 배.</li>
      <li><b>막힌 끝</b>: 공기가 움직일 수 없음. 공기 움직임의 마디, 압력의 배.</li>
      <li><b>열린 관</b> (플루트): 양 끝이 같은 조건. λ = 2L/n, f = n c / 2L. 모든 정수배 배음.</li>
      <li><b>닫힌 관</b> (클라리넷, 팬파이프): 끝 조건이 다름. λ = 4L/(2n-1), f = (2n-1) c / 4L. 홀수 배음만 있고 기본음이 한 옥타브 낮음.</li>
      <li><b>현</b> (양 끝 고정): 열린 관과 같은 배음렬. 여기서는 비교를 위해 공기와 같은 파동 속도를 가정.</li>
    </ul>
    <p>실제 관은 열린 끝에서 공기가 조금 더 진동해 관이 약 0.6 × 반지름만큼 길게 행동함(끝 보정). 이 샘플은 끝 보정을 무시함.</p>`,
  diagram: (L) => {
    const row = (y, closed, n) => {
      const x0 = 110, w = 260;
      let p1 = '', p2 = '';
      for (let i = 0; i <= 80; i++) {
        const x = i / 80, k = closed ? (2 * n - 1) * Math.PI / 2 : n * Math.PI;
        const u = closed ? Math.sin(k * x) : Math.cos(k * x);
        p1 += (i ? 'L' : 'M') + (x0 + x * w).toFixed(1) + ',' + (y - 16 * u).toFixed(1);
        p2 += (i ? 'L' : 'M') + (x0 + x * w).toFixed(1) + ',' + (y + 16 * u).toFixed(1);
      }
      return `<rect x="${x0}" y="${y - 24}" width="${w}" height="48" class="f-dim" fill-opacity="0.3"/>
        ${closed ? `<line x1="${x0}" y1="${y - 26}" x2="${x0}" y2="${y + 26}" class="d-line" stroke-width="5"/>` : ''}
        <path d="${p1}" class="${closed ? 'd-b' : 'd-a'}"/><path d="${p2}" class="${closed ? 'd-b' : 'd-a'}"/>`;
    };
    return `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    ${row(45, false, 1)}${row(125, true, 1)}
    <text x="100" y="40" text-anchor="end" class="t-small t-a">${L('열린 관', 'Open pipe')}</text>
    <text x="100" y="54" text-anchor="end" class="t-small t-dim">λ = 2L</text>
    <text x="100" y="120" text-anchor="end" class="t-small t-b">${L('닫힌 관', 'Closed pipe')}</text>
    <text x="100" y="134" text-anchor="end" class="t-small t-dim">λ = 4L</text>
    <text x="385" y="40" class="t-small">${L('배음: 1, 2, 3, 4, ...', 'harmonics: 1, 2, 3, 4, ...')}</text>
    <text x="385" y="56" class="t-small t-dim">f1 = c / 2L</text>
    <text x="385" y="120" class="t-small">${L('배음: 1, 3, 5, 7, ...', 'harmonics: 1, 3, 5, 7, ...')}</text>
    <text x="385" y="136" class="t-small t-dim">${L('f1 = c / 4L (한 옥타브 낮음)', 'f1 = c / 4L (one octave lower)')}</text>
    <text x="240" y="165" text-anchor="middle" class="t-small t-dim">${L('곡선: 공기 움직임의 크기 (막힌 끝 = 마디, 열린 끝 = 배)', 'Curves: air movement (closed end = node, open end = antinode)')}</text>
  </svg>`;
  },
  look: [
    '"소리 켜기"를 누르고 A와 B를 번갈아 들으면 같은 길이인데 B가 한 옥타브 낮고 속이 빈 소리로 들림',
    '아래 모드 막대에서 A는 1, 2, 3, 4...배, B는 1, 3, 5, 7...배에만 막대가 있음',
    '모드 번호를 3으로 올리면 관 안의 마디 수가 늘고, 막힌 끝은 늘 공기가 움직이지 않음',
    '관 길이를 절반으로 줄이면 모든 공명 주파수가 2배(한 옥타브 위)가 됨',
  ],
  refs: [
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '8장: 관 안의 공기 진동, 열린 관과 닫힌 관, 끝 보정' },
    { type: 'book', title: 'Thomas D. Rossing, F. Richard Moore, Paul A. Wheeler, The Science of Sound (3rd ed.)', year: 2002, note: '정상파와 관악기 공명' },
    { type: 'article', title: 'UNSW Music Acoustics, "Open vs closed pipes (Flutes vs clarinets)"', url: 'https://newt.phys.unsw.edu.au/jw/flutes.v.clarinets.html', note: '플루트와 클라리넷의 배음 비교' },
  ],
  params: [
    { key: 'sys', label: '진동계', type: 'select', options: [{ value: 'open', label: '열린 관 (양쪽 열림)' }, { value: 'closed', label: '닫힌 관 (한쪽 막힘)' }, { value: 'string', label: '현 (양 끝 고정)' }], a: 'open', b: 'closed', default: 'open', group: '공명체' },
    { key: 'len', label: '길이 L (m)', type: 'range', min: 0.15, max: 2, step: 0.01, default: 0.6, shared: true, group: '공명체' },
    { key: 'mode', label: '보는 모드 번호', type: 'int', min: 1, max: 6, default: 1, shared: true, group: '공명체', help: '닫힌 관의 n번 모드는 (2n-1)배음' },
    { key: 'play', label: '소리 내용', type: 'select', options: [{ value: 'all', label: '모든 모드 (악기 소리)' }, { value: 'one', label: '보는 모드만' }], default: 'all', shared: true, group: '소리' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Standing Waves and Pipe Resonance (Open vs Closed Pipe)',
    summary: 'Waves going back and forth in a pipe or on a string overlap into a standing wave that vibrates in place. A pipe open at both ends has every whole-number harmonic. A pipe closed at one end has only odd harmonics and sounds one octave lower.',
    views: { a: 'Open pipe (both ends open)', b: 'Closed pipe (one end closed)' },
    controls: 'Change the length and mode number in the parameter table. Press "Sound on" to hear the resonance of the selected view.',
    info: `
    <p>When a wave reflects at the end of a pipe or string, the outgoing and returning waves overlap. Only at certain wavelengths do they line up and make a wave that vibrates in place: a <b>standing wave</b>. Points that do not move are <b>nodes</b>. Points that move the most are <b>antinodes</b>.</p>
    <ul>
      <li><b>Open end</b>: connected to the outside air, so the pressure stays at room pressure. Pressure node, air movement antinode.</li>
      <li><b>Closed end</b>: the air cannot move. Air movement node, pressure antinode.</li>
      <li><b>Open pipe</b> (flute): both ends are the same. λ = 2L/n, f = n c / 2L. Every whole-number harmonic.</li>
      <li><b>Closed pipe</b> (clarinet, pan pipe): the ends differ. λ = 4L/(2n-1), f = (2n-1) c / 4L. Odd harmonics only, and the fundamental is one octave lower.</li>
      <li><b>String</b> (both ends fixed): the same series as the open pipe. Here it uses the same wave speed as air so you can compare.</li>
    </ul>
    <p>In a real pipe the air just outside the open end also moves, so the pipe acts about 0.6 × radius longer (end correction). This sample ignores the end correction.</p>`,
    look: [
      'Press "Sound on" and switch between A and B. With the same length, B is one octave lower and sounds hollow.',
      'In the mode bars at the bottom, A has bars at 1, 2, 3, 4... and B only at 1, 3, 5, 7...',
      'Raise the mode number to 3. The pipe has more nodes, and the air at the closed end never moves.',
      'Halve the length. Every resonance frequency doubles (one octave up).',
    ],
    refs: ['Chapter 8: air columns, open and closed pipes, end correction.', 'Standing waves and wind instrument resonance.', 'Comparing the harmonics of flutes and clarinets.'],
    params: {
      sys: { label: 'Vibrating system', group: 'Resonator', options: { open: 'Open pipe (both ends open)', closed: 'Closed pipe (one end closed)', string: 'String (both ends fixed)' } },
      len: { label: 'Length L (m)', group: 'Resonator' },
      mode: { label: 'Mode shown', group: 'Resonator', help: 'Mode n of a closed pipe is harmonic (2n-1)' },
      play: { label: 'Sound content', group: 'Sound', options: { all: 'All modes (instrument tone)', one: 'Shown mode only' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SPEED = 343, NM = 12;
    let t = 0;

    const harmNo = (n) => (P.sys === 'closed' ? 2 * n - 1 : n);          // n번째 모드의 배음 번호
    const f1 = () => (P.sys === 'closed' ? SPEED / (4 * P.len) : SPEED / (2 * P.len));
    const fMode = (n) => harmNo(n) * (P.sys === 'closed' ? SPEED / (4 * P.len) : SPEED / (2 * P.len));
    // 위치 x(0~1)에서 공기 움직임(또는 현 변위) 모양과 압력 모양. 닫힌 끝은 x = 0
    const shape = (n, x) => {
      if (P.sys === 'closed') { const k = (2 * n - 1) * Math.PI / 2; return { u: Math.sin(k * x), p: Math.cos(k * x) }; }
      if (P.sys === 'string') { const k = n * Math.PI; return { u: Math.sin(k * x), p: Math.cos(k * x) }; }
      const k = n * Math.PI; return { u: Math.cos(k * x), p: Math.sin(k * x) };
    };

    const live = { ph: new Float64Array(NM + 1), g: new Float64Array(NM + 1) };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(10, sr);
        for (let i = 0; i < n; i++) {
          let v = 0;
          for (let m = 1; m <= NM; m++) {
            const f = fMode(m), h = harmNo(m);
            const target = f < sr * 0.45 && (P.play === 'all' || m === P.mode) ? (P.play === 'all' ? 1 / h : 1) : 0;
            live.g[m] += (target - live.g[m]) * k;
            if (live.g[m] < 1e-5) continue;
            live.ph[m] += f / sr; if (live.ph[m] >= 1) live.ph[m] -= 1;
            v += live.g[m] * Math.sin(U.TAU * live.ph[m]);
          }
          v *= P.play === 'all' ? 0.25 : 0.4; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) { t += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, n = P.mode;
        // 관 그림 (슬로모션 1Hz)
        const th = Math.max(70, H * 0.42), tx = pad + 20, tw = W - pad * 2 - 40, ty = pad + 16, mid = ty + th / 2;
        const osc = Math.cos(U.TAU * 0.7 * t);
        D.text(g, P.sys === 'string' ? Lx('현의 변위 (슬로모션)', 'String displacement (slow motion)') : Lx('관 속 공기 입자 (슬로모션). 흰 곡선: 움직임 크기, 보라: 압력 크기', 'Air particles in the pipe (slow motion). White: movement, purple: pressure'), pad, pad, { size: 10, color: C.dim });
        if (P.sys === 'string') {
          D.line(g, tx, mid, tx + tw, mid, C.grid, 1);
          g.beginPath();
          for (let i = 0; i <= 200; i++) { const x = i / 200, y = mid - shape(n, x).u * osc * th * 0.4; i ? g.lineTo(tx + x * tw, y) : g.moveTo(tx + x * tw, y); }
          g.strokeStyle = col; g.lineWidth = 2.5; g.stroke();
          D.rect(g, tx - 6, mid - 20, 6, 40, C.text); D.rect(g, tx + tw, mid - 20, 6, 40, C.text);
        } else {
          D.rect(g, tx, ty, tw, th, 'rgba(255,255,255,0.04)');
          D.line(g, tx, ty, tx + tw, ty, C.text, 2); D.line(g, tx, ty + th, tx + tw, ty + th, C.text, 2);
          if (P.sys === 'closed') D.rect(g, tx - 6, ty - 2, 6, th + 4, C.text);
          // 입자: x 방향으로 u만큼 밀림
          const cols = 60, rows = 6, amp = (tw / cols) * 1.6;
          for (let i = 0; i <= cols; i++) {
            const x = i / cols, s = shape(n, x);
            const px = tx + x * tw + s.u * osc * amp;
            for (let j = 0; j < rows; j++) D.circle(g, px, ty + (j + 0.5) * th / rows, 1.8, col);
          }
          const curve = (fn, color) => {
            g.beginPath();
            for (let i = 0; i <= 120; i++) { const x = i / 120, y = mid - fn(x) * th * 0.42; i ? g.lineTo(tx + x * tw, y) : g.moveTo(tx + x * tw, y); }
            g.strokeStyle = color; g.lineWidth = 1.2; g.stroke();
          };
          curve((x) => Math.abs(shape(n, x).u), 'rgba(255,255,255,0.55)');
          curve((x) => -Math.abs(shape(n, x).p), 'rgba(199,146,234,0.7)');
        }
        // 마디 표시 (움직임 기준)
        const nodes = [];
        if (P.sys === 'open') for (let j = 0; j < n; j++) nodes.push((2 * j + 1) / (2 * n));
        else if (P.sys === 'closed') for (let j = 0; 2 * j <= 2 * n - 1; j++) nodes.push((2 * j) / (2 * n - 1));
        else for (let j = 0; j <= n; j++) nodes.push(j / n);
        for (const x of nodes) D.text(g, Lx('마디', 'node'), tx + x * tw, ty + th + 3, { size: 9, color: C.warn, align: 'center' });
        // 모드 막대 (선형 주파수 축)
        const by = ty + th + 18, bh = H - by - pad, bw = W - pad * 2;
        D.rect(g, pad, by, bw, bh, 'rgba(0,0,0,0.35)');
        const fOpen = SPEED / (2 * P.len), fmax = fOpen * 8.5;
        for (let h = 1; h <= 8; h++) {
          const x = pad + (h * fOpen / 2 / fmax) * bw * 2;
          D.line(g, x, by + 16, x, by + bh - 14, C.grid, 1);
        }
        for (let m = 1; m <= NM; m++) {
          const f = fMode(m);
          if (f > fmax) break;
          const x = pad + (f / fmax) * bw, hh = (bh - 34) / Math.sqrt(harmNo(m));
          D.rect(g, x - 3, by + bh - 14 - hh, 6, hh, m === n ? C.accent : col);
          D.text(g, String(harmNo(m)), x, by + bh - 12, { size: 9, color: C.dim, align: 'center' });
        }
        D.text(g, Lx('공명 주파수 (막대 아래 숫자 = 배음 번호, 보라 = 보는 모드)', 'Resonances (number under bar = harmonic number, purple = shown mode)'), pad + 4, by + 3, { size: 10, color: C.dim });

        const fm = fMode(n);
        ctx.stat(Lx('기본 주파수 f1', 'Fundamental f1'), `${f1().toFixed(1)} Hz (${A.noteName(A.ftom(f1()))})`);
        ctx.stat(Lx('보는 모드', 'Shown mode'), `${harmNo(n)}f1 = ${fm.toFixed(1)} Hz`);
        ctx.stat(Lx('보는 모드 파장', 'Mode wavelength'), (SPEED / fm).toFixed(3) + ' m');
        ctx.stat(Lx('배음 비', 'Harmonic ratios'), [1, 2, 3, 4].map(harmNo).join(' : '));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
