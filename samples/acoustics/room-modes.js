// 방의 모드(룸 모드): 직육면체 방의 저음 공명. 듣는 위치에 따라 음마다 쿵쿵 울리거나 사라짐
GTL.register({
  id: 'room-modes',
  title: '룸 모드와 듣는 위치',
  summary: '방은 벽 사이의 정상파 때문에 특정 저음에서 크게 울리고, 위치에 따라 어떤 음은 거의 사라짐. 방 한가운데와 벽에서 38% 떨어진 지점의 저음 응답을 비교.',
  views: { a: '방 한가운데 (50%, 50%)', b: '벽에서 38% 지점 (38%, 38%)' },
  controls: '파라미터 표에서 방 크기, 듣는 위치, 잔향 시간을 바꿈. "소리 켜기"를 누르면 저음 반음계가 그 위치에서 들리는 크기로 재생됨.',
  info: `
    <p>방의 마주 보는 벽 사이에서도 관처럼 정상파가 생김. 길이 L인 방향의 모드 주파수는 f = n c / 2L. 세 방향(가로, 세로, 높이)을 모두 합치면 f = (c/2) √((nx/Lx)² + (ny/Ly)² + (nz/Lz)²).</p>
    <ul>
      <li><b>축 모드(Axial)</b>: 벽 한 쌍 사이. 가장 강함.</li>
      <li><b>접선 모드(Tangential)</b>: 벽 두 쌍(네 면) 사이</li>
      <li><b>사선 모드(Oblique)</b>: 여섯 면 모두. 가장 약함.</li>
    </ul>
    <p>모드마다 방 안에 압력이 큰 곳(배)과 거의 0인 곳(마디)이 있음. 마디에 앉으면 그 음이 사라지고, 벽과 모서리 근처에서는 모든 모드의 배가 겹쳐 저음이 부풀어 오름. 방 한가운데는 홀수 모드의 마디가 모여 있어 저음이 고르지 않음.</p>
    <p>모드는 저음에서 듬성듬성해서 문제가 됨. 주파수가 오르면 모드가 촘촘해져 섞이고, 그 경계를 <b>슈뢰더 주파수</b> f ≈ 2000 √(RT60 / V)로 어림함. 대책은 듣는 위치 옮기기(38% 규칙), 베이스 트랩, 서브우퍼 여러 대, 룸 보정 EQ.</p>
    <p>이 샘플은 단단한 벽의 모드 합 모델을 씀. 음원은 바닥 모서리, 귀 높이는 1.2m로 고정. 각 모드의 대역폭은 2.2 / RT60 (Hz).</p>`,
  diagram: (L) => {
    const x0 = 30, w = 220, y0 = 30, h = 120;
    let p1 = '', p2 = '';
    for (let i = 0; i <= 60; i++) {
      const x = i / 60;
      p1 += (i ? 'L' : 'M') + (x0 + x * w).toFixed(1) + ',' + (y0 + h / 2 - 40 * Math.cos(Math.PI * x)).toFixed(1);
      p2 += (i ? 'L' : 'M') + (x0 + x * w).toFixed(1) + ',' + (y0 + h / 2 - 40 * Math.cos(2 * Math.PI * x)).toFixed(1);
    }
    return `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <rect x="${x0}" y="${y0}" width="${w}" height="${h}" class="f-dim" fill-opacity="0.25"/>
    <path d="${p1}" class="d-accent"/><path d="${p2}" class="d-dim"/>
    <line x1="${x0 + w / 2}" y1="${y0}" x2="${x0 + w / 2}" y2="${y0 + h}" class="d-a" stroke-dasharray="3 3"/>
    <line x1="${x0 + 0.38 * w}" y1="${y0}" x2="${x0 + 0.38 * w}" y2="${y0 + h}" class="d-b" stroke-dasharray="3 3"/>
    <text x="${x0 + w / 2 + 4}" y="${y0 + h + 16}" class="t-small t-a">50%</text>
    <text x="${x0 + 0.38 * w - 4}" y="${y0 + h + 16}" text-anchor="end" class="t-small t-b">38%</text>
    <text x="${x0}" y="${y0 - 8}" class="t-small t-dim">${L('앞벽', 'front wall')}</text>
    <text x="${x0 + w}" y="${y0 - 8}" text-anchor="end" class="t-small t-dim">${L('뒷벽', 'back wall')}</text>
    <text x="280" y="44" class="t-small">${L('보라: 1번 축 모드 (c / 2L)', 'purple: axial mode 1 (c / 2L)')}</text>
    <text x="280" y="62" class="t-small t-dim">${L('회색: 2번 축 모드 (c / L)', 'gray: axial mode 2 (c / L)')}</text>
    <text x="280" y="90" class="t-small t-a">${L('한가운데: 1번 모드의 마디. 그 음이 사라짐', 'center: node of mode 1, that note vanishes')}</text>
    <text x="280" y="108" class="t-small t-b">${L('38%: 낮은 모드 여러 개의 마디를 피함', '38%: avoids the nodes of several low modes')}</text>
    <text x="280" y="136" class="t-small">${L('벽 근처: 모든 모드의 배. 저음이 부풂', 'near walls: antinode of every mode, bass builds up')}</text>
  </svg>`;
  },
  look: [
    'A의 응답 곡선은 30~150Hz에서 봉우리와 골이 더 큼. "저음 편차" 측정값이 B보다 큼.',
    '"소리 켜기"를 누르고 A를 들으면 반음계 저음 중 어떤 음은 쿵 울리고 어떤 음은 거의 들리지 않음',
    'B의 듣는 위치 가로를 0.05(뒷벽에 붙음)로 옮기면 곡선 전체가 올라가고 저음이 부풀어 들림',
    '"보기 주파수"를 모드 주파수에 맞추면 평면도에 마디(어두운 줄)와 배(밝은 곳)가 뚜렷하게 보임',
    'RT60을 1.2초로 올리면 봉우리가 뾰족해지고, 0.2초로 낮추면(흡음) 곡선이 매끄러워짐',
  ],
  refs: [
    { type: 'book', title: 'F. Alton Everest, Ken C. Pohlmann, Master Handbook of Acoustics', note: '룸 모드 계산, 축, 접선, 사선 모드' },
    { type: 'book', title: 'Heinrich Kuttruff, Room Acoustics (5th ed.)', year: 2009, note: '직육면체 방의 고유 모드와 모드 합 모델' },
    { type: 'paper', title: 'M. R. Schroeder, K. H. Kuttruff, "On Frequency Response Curves in Rooms", JASA 34', year: 1962, note: '슈뢰더 주파수' },
    { type: 'book', title: 'Floyd E. Toole, Sound Reproduction: The Acoustics and Psychoacoustics of Loudspeakers and Rooms (3rd ed.)', year: 2017, note: '듣는 위치와 저음, 서브우퍼 배치' },
  ],
  params: [
    { key: 'lx', label: '듣는 위치 가로 (앞벽부터 비율)', type: 'range', min: 0.02, max: 0.98, step: 0.01, a: 0.5, b: 0.38, default: 0.5, group: '듣는 위치' },
    { key: 'ly', label: '듣는 위치 세로 (옆벽부터 비율)', type: 'range', min: 0.02, max: 0.98, step: 0.01, a: 0.5, b: 0.38, default: 0.5, group: '듣는 위치' },
    { key: 'rx', label: '방 길이 (m)', type: 'range', min: 3, max: 9, step: 0.1, default: 5.6, shared: true, group: '방' },
    { key: 'ry', label: '방 너비 (m)', type: 'range', min: 2.5, max: 7, step: 0.1, default: 4.2, shared: true, group: '방' },
    { key: 'rz', label: '천장 높이 (m)', type: 'range', min: 2.2, max: 4, step: 0.1, default: 2.7, shared: true, group: '방' },
    { key: 'rt', label: 'RT60 (초)', type: 'range', min: 0.2, max: 1.5, step: 0.05, default: 0.5, shared: true, group: '방', help: '잔향 시간. 길수록 모드 봉우리가 뾰족함' },
    { key: 'types', label: '모드 종류', type: 'select', options: [{ value: 'axial', label: '축 모드만' }, { value: 'all', label: '모두 (축, 접선, 사선)' }], default: 'all', shared: true, group: '방' },
    { key: 'viewF', label: '보기 주파수 (Hz)', type: 'range', min: 20, max: 200, step: 0.5, default: 30.5, shared: true, group: '표시', help: '평면도에 이 주파수의 압력 분포를 그림' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Room Modes and Listening Position',
    summary: 'Standing waves between the walls make a room boom at some bass notes, and at some positions certain notes almost vanish. Compare the bass response at the room center and at a spot 38% from the walls.',
    views: { a: 'Room center (50%, 50%)', b: '38% from the walls (38%, 38%)' },
    controls: 'Change the room size, listening position and reverb time in the parameter table. Press "Sound on" to play a chromatic bass scale at the level heard at that position.',
    info: `
    <p>Standing waves also form between facing walls, just like in a pipe. Along a length L the mode frequencies are f = n c / 2L. With all three directions (length, width, height): f = (c/2) √((nx/Lx)² + (ny/Ly)² + (nz/Lz)²).</p>
    <ul>
      <li><b>Axial</b>: between one pair of walls. The strongest.</li>
      <li><b>Tangential</b>: between two pairs of walls (four surfaces).</li>
      <li><b>Oblique</b>: all six surfaces. The weakest.</li>
    </ul>
    <p>Each mode has spots with high pressure (antinodes) and spots with almost none (nodes). Sit on a node and that note disappears. Near walls and corners the antinodes of every mode stack up and the bass swells. The room center collects the nodes of odd modes, so its bass is uneven.</p>
    <p>Modes are a problem because they are sparse in the bass. As frequency rises they get dense and blend. That boundary is estimated by the <b>Schroeder frequency</b> f ≈ 2000 √(RT60 / V). Fixes: move the listening spot (the 38% rule), bass traps, multiple subwoofers, room correction EQ.</p>
    <p>This sample uses a modal sum for a room with rigid walls. The source is in a floor corner and the ear height is fixed at 1.2 m. Each mode has a bandwidth of 2.2 / RT60 (Hz).</p>`,
    look: [
      'A\'s response has bigger peaks and dips between 30 and 150 Hz. Its "Bass spread" stat is larger than B\'s.',
      'Press "Sound on" and listen to A. In the chromatic bass scale some notes boom and some are almost silent.',
      'Move B\'s listening position (length) to 0.05 (against the back wall). The whole curve rises and the bass sounds bloated.',
      'Set "View frequency" to a mode frequency. The floor plan shows clear nodes (dark lines) and antinodes (bright areas).',
      'Raise RT60 to 1.2 s. The peaks get sharper. Lower it to 0.2 s (absorption) and the curve gets smoother.',
    ],
    refs: ['Room mode calculation: axial, tangential and oblique modes.', 'Eigenmodes of rectangular rooms and the modal sum model.', 'The Schroeder frequency.', 'Listening position, bass and subwoofer placement.'],
    params: {
      lx: { label: 'Listening position, length (fraction from front wall)', group: 'Listening position' },
      ly: { label: 'Listening position, width (fraction from side wall)', group: 'Listening position' },
      rx: { label: 'Room length (m)', group: 'Room' },
      ry: { label: 'Room width (m)', group: 'Room' },
      rz: { label: 'Ceiling height (m)', group: 'Room' },
      rt: { label: 'RT60 (s)', group: 'Room', help: 'Reverb time. Longer makes the mode peaks sharper' },
      types: { label: 'Mode types', group: 'Room', options: { axial: 'Axial only', all: 'All (axial, tangential, oblique)' } },
      viewF: { label: 'View frequency (Hz)', group: 'Display', help: 'The floor plan shows the pressure at this frequency' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SPEED = 343, FMAX = 300, EAR = 1.2, FLO = 20, FHI = 300;

    // 모드 목록 (방 크기, 종류, RT60이 바뀔 때만)
    let mkey = '', modes = [];
    function buildModes() {
      const k = [P.rx, P.ry, P.rz, P.types].join();
      if (k === mkey) return false;
      mkey = k; modes = [];
      const mx = Math.floor(2 * P.rx * FMAX / SPEED), my = Math.floor(2 * P.ry * FMAX / SPEED), mz = Math.floor(2 * P.rz * FMAX / SPEED);
      for (let a = 0; a <= mx; a++) for (let b = 0; b <= my; b++) for (let c = 0; c <= mz; c++) {
        const nz = (a > 0) + (b > 0) + (c > 0);
        if (P.types === 'axial' && nz > 1) continue;
        const f = (SPEED / 2) * Math.hypot(a / P.rx, b / P.ry, c / P.rz);
        if (f > FMAX) continue;
        // 정규화 인자: 0차 방향은 1, 그 외 2 (모드 형상의 평균 제곱 보정)
        const eps = (a ? 2 : 1) * (b ? 2 : 1) * (c ? 2 : 1);
        modes.push({ a, b, c, f, kind: nz, eps });
      }
      modes.sort((m1, m2) => m1.f - m2.f);
      return true;
    }
    // 위치 (x, y, z m)에서 주파수 f의 복소 압력 (음원은 모서리 (0,0,0))
    function press(f, x, y, z) {
      let re = 0, im = 0;
      const B = 2.2 / P.rt;
      for (const m of modes) {
        const psi = Math.cos(m.a * Math.PI * x / P.rx) * Math.cos(m.b * Math.PI * y / P.ry) * Math.cos(m.c * Math.PI * z / P.rz);
        const w = m.eps * psi;
        // 1 / (fn² - f² + j f B)
        const dr = m.f * m.f - f * f, di = f * B, den = dr * dr + di * di;
        re += w * dr / den; im -= w * di / den;
      }
      return Math.hypot(re, im) * f; // 체적 속도 음원: 압력 ∝ jω × 합
    }

    // 응답 곡선과 평면도 캐시
    const NR = 360, resp = new Float32Array(NR), GX = 56, GY = 42;
    let rkey = '', hkey = '', ref = 1, heat = null, spread = 0;
    const respF = (i) => FLO * Math.pow(FHI / FLO, i / (NR - 1));
    function analyze() {
      const changed = buildModes();
      const k = [mkey, P.rt, P.lx, P.ly].join();
      if (k !== rkey || changed) {
        rkey = k;
        // 기준 레벨: 방 여러 지점, 30~200Hz 평균 에너지 (A, B가 같은 기준을 쓰도록 위치와 무관)
        let e = 0, cnt = 0;
        for (let i = 0; i < 40; i++) {
          const f = 30 * Math.pow(200 / 30, i / 39);
          for (const [u, v] of [[0.3, 0.3], [0.6, 0.45], [0.45, 0.7], [0.75, 0.6]]) { const p = press(f, u * P.rx, v * P.ry, EAR); e += p * p; cnt++; }
        }
        ref = Math.sqrt(e / cnt);
        let s1 = 0, s2 = 0, cnt2 = 0;
        for (let i = 0; i < NR; i++) {
          const f = respF(i), db = A.linToDb(press(f, P.lx * P.rx, P.ly * P.ry, EAR) / ref);
          resp[i] = db;
          if (f >= 30 && f <= 150) { s1 += db; s2 += db * db; cnt2++; }
        }
        spread = Math.sqrt(Math.max(0, s2 / cnt2 - (s1 / cnt2) ** 2));
      }
      const hk = [mkey, P.rt, P.viewF].join();
      if (hk !== hkey || changed) {
        hkey = hk;
        heat = new Float32Array(GX * GY);
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) heat[j * GX + i] = press(P.viewF, ((i + 0.5) / GX) * P.rx, ((j + 0.5) / GY) * P.ry, EAR);
        let mx = 0; for (const v of heat) mx = Math.max(mx, v);
        for (let i = 0; i < heat.length; i++) heat[i] = mx > 0 ? heat[i] / mx : 0;
      }
    }
    const respAt = (f) => {
      const x = Math.log(f / FLO) / Math.log(FHI / FLO) * (NR - 1);
      const i = U.clamp(Math.floor(x), 0, NR - 2), fr = U.clamp(x - i, 0, 1);
      return resp[i] * (1 - fr) + resp[i + 1] * fr;
    };

    // 소리: 저음 반음계 (A1 ~ A3), 음마다 그 위치의 응답 크기로 재생
    const NOTE_LEN = 0.42, LO = 33, HI = 57;
    const live = { time: 0, ph1: 0, ph2: 0, g: 0, note: LO };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        const k = A.onePoleCoef(40, sr), steps = HI - LO + 1;
        for (let i = 0; i < n; i++) {
          live.time += 1 / sr;
          const idx = Math.floor(live.time / NOTE_LEN) % steps, tin = live.time % NOTE_LEN;
          live.note = LO + idx;
          const f = A.mtof(live.note);
          const env = Math.min(1, tin / 0.01) * Math.min(1, (NOTE_LEN - tin) / 0.04);
          const g1 = Math.pow(10, U.clamp(respAt(f), -40, 15) / 20), g2 = Math.pow(10, U.clamp(respAt(2 * f), -40, 15) / 20);
          live.g += (env - live.g) * k;
          live.ph1 += f / sr; if (live.ph1 >= 1) live.ph1 -= 1;
          live.ph2 += 2 * f / sr; if (live.ph2 >= 1) live.ph2 -= 1;
          const v = live.g * 0.11 * (g1 * Math.sin(U.TAU * live.ph1) + 0.35 * g2 * Math.sin(U.TAU * live.ph2));
          l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        // 평면도
        const ph = Math.max(60, H * 0.42), maxW = W - pad * 2;
        const sc = Math.min(maxW / P.rx, (ph - 16) / P.ry);
        const pw = P.rx * sc, phh = P.ry * sc, px0 = pad, py0 = pad + 14;
        const cw = pw / GX, chh = phh / GY;
        for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
          const v = heat[j * GX + i];
          g.fillStyle = `hsl(${(220 - v * 200).toFixed(0)},70%,${(8 + v * 52).toFixed(0)}%)`;
          g.fillRect(px0 + i * cw, py0 + j * chh, cw + 0.6, chh + 0.6);
        }
        D.rect(g, px0, py0, pw, phh, null, C.text, 1.5);
        D.circle(g, px0 + 4, py0 + 4, 4, C.good);
        const lx = px0 + P.lx * pw, ly = py0 + P.ly * phh;
        D.circle(g, lx, ly, 6, col, '#fff', 2);
        D.text(g, Lx(`평면도: ${P.viewF.toFixed(1)}Hz 압력 크기 (밝을수록 큼). 초록 = 음원, 원 = 듣는 위치`, `Floor plan: pressure at ${P.viewF.toFixed(1)} Hz (brighter = louder). Green = source, circle = listener`), pad, pad, { size: 10, color: C.dim });
        // 응답
        const ry = py0 + phh + pad, rh = H - ry - pad;
        A.drawResponse(g, (f) => respAt(f), pad, ry, W - pad * 2, rh, { fmin: FLO, fmax: FHI, minDb: -30, maxDb: 18, dbStep: 6, color: col, label: Lx('듣는 위치의 저음 응답 (방 평균 = 0dB)', 'Bass response at listener (room average = 0 dB)') });
        for (const m of modes) {
          if (m.f < FLO) continue;
          const x = A.freqX(m.f, pad, W - pad * 2, FLO, FHI);
          D.line(g, x, ry + rh - (m.kind === 1 ? 10 : 5), x, ry + rh, m.kind === 1 ? C.accent : 'rgba(255,255,255,0.3)', m.kind === 1 ? 2 : 1);
        }
        const vx = A.freqX(P.viewF, pad, W - pad * 2, FLO, FHI);
        D.line(g, vx, ry, vx, ry + rh, 'rgba(102,209,122,0.5)', 1);
        if (snd.on) {
          const nx = A.freqX(A.mtof(live.note), pad, W - pad * 2, FLO, FHI);
          D.circle(g, nx, ry + rh - U.clamp((respAt(A.mtof(live.note)) + 30) / 48, 0, 1) * rh, 5, C.warn);
        }

        const V = P.rx * P.ry * P.rz, fs = 2000 * Math.sqrt(P.rt / V);
        ctx.stat(Lx('저음 편차 (30~150Hz 표준편차)', 'Bass spread (30 to 150 Hz, std dev)'), spread.toFixed(1) + ' dB');
        ctx.stat(Lx('300Hz 아래 모드 수', 'Modes below 300 Hz'), modes.length);
        ctx.stat(Lx('첫 축 모드', 'First axial mode'), (SPEED / (2 * Math.max(P.rx, P.ry, P.rz))).toFixed(1) + ' Hz');
        ctx.stat(Lx('슈뢰더 주파수', 'Schroeder frequency'), fs.toFixed(0) + ' Hz');
        ctx.stat(Lx('듣는 위치', 'Listener'), `${(P.lx * P.rx).toFixed(2)} m, ${(P.ly * P.ry).toFixed(2)} m`);
        if (snd.on) ctx.stat(Lx('재생 중인 음', 'Playing note'), `${A.noteName(live.note)} (${A.mtof(live.note).toFixed(1)} Hz) ${respAt(A.mtof(live.note)).toFixed(1)} dB`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
