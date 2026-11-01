// 음원 지향성 (사운드 콘): 모든 방향 같은 크기 vs 콘 각도에 따라 줄이고 고음을 깎기
GTL.register({
  id: 'sound-cones-directivity',
  title: '음원 지향성 (사운드 콘)',
  summary: '확성기, 말하는 사람, 총구는 앞쪽으로 소리를 더 크게 냄. 사운드 콘은 안쪽 각도, 바깥 각도, 바깥 게인 세 값으로 이 지향성을 흉내 냄. A는 무지향이라 음원이 돌아도 그대로, B는 등을 돌리면 작고 먹먹해짐.',
  views: { a: '무지향 (콘 없음)', b: '사운드 콘 + 바깥 로우패스' },
  controls: '뷰에서 클릭하거나 끌어서 청취자(사각형)를 옮김. 음원은 자동으로 회전함.',
  info: `
    <p>게임 오디오 엔진은 음원 지향성을 <b>사운드 콘(Sound Cone)</b>으로 단순화함. Web Audio의 PannerNode, FMOD, Wwise, Unity가 모두 같은 개념을 씀.</p>
    <ul>
      <li><b>안쪽 각도(Inner Angle)</b>: 이 콘 안에서는 게인 1 (0dB)</li>
      <li><b>바깥 각도(Outer Angle)</b>: 이 콘 밖에서는 바깥 게인(Outer Gain)</li>
      <li>그 사이: 각도에 따라 선형 보간. Web Audio 명세는 <code>(1 - x) + outerGain × x</code>, x는 두 경계 사이의 비율.</li>
      <li><b>바깥 로우패스</b>: 실제 음원은 뒤쪽에서 고음이 더 많이 줄어듦. Wwise는 콘 밖의 LPF 값을 따로 둠. 이 샘플도 바깥으로 갈수록 차단 주파수를 낮춤.</li>
    </ul>
    <p>쓰임: NPC 대사를 등 뒤에서 들으면 작게, 스피커 정면 앞에서는 크게, 총소리를 쏜 방향 앞쪽에서 더 크게</p>
    <p>단점: 실제 지향성은 주파수마다 다른 부드러운 패턴. 콘은 각도 두 개로 끊어서 경계에서 기울기가 급하게 바뀜. 콘 각도가 너무 좁으면 음원이 조금만 돌아도 소리가 확 줄어 부자연스러움.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <path d="M150,100 L150,10 A90,90 0 0 1 228,55 Z" class="f-b" opacity="0.45"/>
    <path d="M150,100 L150,10 A90,90 0 0 0 72,55 Z" class="f-b" opacity="0.45"/>
    <path d="M150,100 L228,55 A90,90 0 0 1 240,100 Z" class="f-dim"/>
    <path d="M150,100 L72,55 A90,90 0 0 0 60,100 Z" class="f-dim"/>
    <circle cx="150" cy="100" r="7" class="f-accent"/>
    <text x="150" y="122" text-anchor="middle" class="t-small">${L('음원 (위를 봄)', 'source (facing up)')}</text>
    <text x="150" y="40" text-anchor="middle" class="t-small">${L('안쪽 콘: 0dB', 'inner cone: 0 dB')}</text>
    <text x="246" y="82" class="t-small">${L('사이: 보간', 'between: blend')}</text>
    <text x="150" y="150" text-anchor="middle" class="t-small t-dim">${L('바깥: 바깥 게인 + 로우패스', 'outside: outer gain + low-pass')}</text>
    <line x1="320" y1="140" x2="530" y2="140" class="d-line"/><line x1="320" y1="20" x2="320" y2="140" class="d-line"/>
    <path d="M320,30 L370,30 L450,110 L530,110" class="d-b"/>
    <path d="M320,30 L530,30" class="d-a" stroke-dasharray="5 3"/>
    <text x="370" y="156" text-anchor="middle" class="t-small">${L('안쪽/2', 'inner/2')}</text>
    <text x="450" y="156" text-anchor="middle" class="t-small">${L('바깥/2', 'outer/2')}</text>
    <text x="526" y="24" text-anchor="end" class="t-small t-a">${L('A 무지향', 'A omni')}</text>
    <text x="526" y="104" text-anchor="end" class="t-small t-b">${L('B 콘', 'B cone')}</text>
  </svg>`,
  look: [
    '소리를 켜고 들으면 A는 음원이 돌아도 크기가 같음. B는 음원이 등을 돌릴 때마다 작고 먹먹해짐.',
    'B의 안쪽 각도를 300°로 넓히면 거의 무지향처럼 들림',
    'B의 바깥 로우패스를 20000Hz로 올리면 크기만 줄고 음색은 그대로라서 덜 자연스러움',
    '아래 그래프에서 B의 게인 곡선은 안쪽, 바깥 경계에서 꺾임. 이 꺾임이 콘 방식의 한계.',
  ],
  refs: [
    { type: 'article', title: 'W3C, Web Audio API: PannerNode cone gain (coneInnerAngle, coneOuterAngle, coneOuterGain)', url: 'https://www.w3.org/TR/webaudio/', note: '콘 게인 계산 절차' },
    { type: 'article', title: 'MDN, PannerNode.coneOuterGain', url: 'https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/coneOuterGain', note: '속성 설명과 예제' },
    { type: 'engine', title: 'FMOD Core API, ChannelControl::set3DConeSettings', note: 'insideconeangle, outsideconeangle, outsidevolume' },
    { type: 'engine', title: 'Audiokinetic Wwise, Attenuation Editor: Cone Attenuation', note: '콘 밖 볼륨과 LPF, HPF 값' },
    { type: 'book', title: 'Karen Collins, Game Sound: An Introduction to the History, Theory, and Practice of Video Game Music and Sound Design, MIT Press', year: 2008, note: '게임 오디오의 3D 음향 개념' },
  ],
  params: [
    { key: 'cone', label: '사운드 콘', type: 'bool', a: false, b: true, group: '콘' },
    { key: 'inner', label: '안쪽 각도 (°)', type: 'range', min: 0, max: 360, step: 5, default: 90, when: (p) => p.cone },
    { key: 'outer', label: '바깥 각도 (°)', type: 'range', min: 0, max: 360, step: 5, default: 220, when: (p) => p.cone },
    { key: 'outerDb', label: '바깥 게인 (dB)', type: 'range', min: -40, max: 0, step: 1, default: -15, when: (p) => p.cone },
    { key: 'outerLpf', label: '바깥 로우패스 (Hz)', type: 'range', min: 300, max: 20000, step: 50, default: 1200, when: (p) => p.cone },
    { key: 'spin', label: '음원 회전 속도 (°/s)', type: 'range', min: 0, max: 120, step: 1, default: 40, shared: true, group: '장면' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Source Directivity (Sound Cones)',
    summary: 'Loudspeakers, talkers and gun muzzles are louder toward the front. A sound cone imitates this with three values: inner angle, outer angle and outer gain. A is omnidirectional, so nothing changes when the source turns. In B the sound gets quiet and dull when the source turns its back.',
    views: { a: 'Omni (no cone)', b: 'Sound cone + outer low-pass' },
    controls: 'Click or drag in the view to move the listener (square). The source turns on its own.',
    info: `
    <p>Game audio engines simplify source directivity into a <b>sound cone</b>. Web Audio PannerNode, FMOD, Wwise and Unity all use the same idea.</p>
    <ul>
      <li><b>Inner angle</b>: inside this cone the gain is 1 (0 dB).</li>
      <li><b>Outer angle</b>: outside this cone the gain is the outer gain.</li>
      <li>In between: linear blend by angle. The Web Audio spec uses <code>(1 - x) + outerGain × x</code>, where x is the position between the two edges.</li>
      <li><b>Outer low-pass</b>: real sources lose more treble toward the back. Wwise has a separate LPF value outside the cone. This sample also lowers the cutoff toward the outside.</li>
    </ul>
    <p>Uses: NPC dialogue sounds quieter from behind, a speaker is loud right in front, a gunshot is louder in the direction it was fired.</p>
    <p>Downsides: real directivity is a smooth pattern that changes with frequency. A cone cuts it with two angles, so the slope changes sharply at the edges. If the cone is too narrow, the sound drops suddenly when the source turns a little, which feels unnatural.</p>`,
    look: [
      'Turn on sound. In A the level stays the same while the source turns. In B the sound gets quiet and dull each time the source turns its back.',
      'Widen B\'s inner angle to 300 degrees. It sounds almost omnidirectional.',
      'Raise B\'s outer low-pass to 20000 Hz. Only the level drops and the tone stays, which sounds less natural.',
      'In the graph at the bottom, B\'s gain curve bends at the inner and outer edges. These bends are the limit of the cone method.',
    ],
    refs: ['The cone gain algorithm.', 'Property description and example.', 'insideconeangle, outsideconeangle, outsidevolume.', 'Volume, LPF and HPF values outside the cone.', '3D sound concepts in game audio.'],
    params: {
      cone: { label: 'Sound cone', group: 'Cone' },
      inner: 'Inner angle (°)',
      outer: 'Outer angle (°)',
      outerDb: 'Outer gain (dB)',
      outerLpf: 'Outer low-pass (Hz)',
      spin: { label: 'Source spin speed (°/s)', group: 'Scene' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b, RAD = Math.PI / 180;
    const S = { face: 0, lx: 0.5, ly: 0.82 }; // 음원 방향(도), 청취자 위치(뷰 비율)
    // Web Audio 명세의 콘 게인. ang: 음원 정면과 청취자 방향 사이 각 (0~180)
    function coneGain(ang) {
      if (!P.cone) return 1;
      const inner = Math.abs(P.inner) / 2, outer = Math.max(inner, Math.abs(P.outer) / 2), og = A.dbToLin(P.outerDb);
      if (ang <= inner) return 1;
      if (ang >= outer) return og;
      const x = (ang - inner) / Math.max(1e-6, outer - inner);
      return (1 - x) + og * x;
    }
    // 로우패스 차단 주파수: 안쪽 20kHz에서 바깥 값까지 로그 보간
    function coneLpf(ang) {
      if (!P.cone) return 20000;
      const inner = P.inner / 2, outer = Math.max(inner, P.outer / 2);
      const x = ang <= inner ? 0 : ang >= outer ? 1 : (ang - inner) / Math.max(1e-6, outer - inner);
      return Math.exp(Math.log(20000) + x * (Math.log(P.outerLpf) - Math.log(20000)));
    }
    function geom() {
      const W = ctx.width, H = ctx.height, sh = H * 0.6, cx = W / 2, cy = 10 + sh * 0.45;
      const lx = S.lx * W, ly = 10 + S.ly * sh;
      const dir = Math.atan2(lx - cx, -(ly - cy)) / RAD; // 위 = 0, 오른쪽 = +
      let ang = Math.abs(((dir - S.face) % 360 + 540) % 360 - 180);
      return { cx, cy, lx, ly, sh, ang, dir };
    }

    const noise = A.noiseBuffer(1 << 16, 51);
    const PROG = [[57, 61, 64], [54, 57, 61], [50, 54, 57], [52, 56, 59]];
    const phs = new Float64Array(3);
    let tS = 0, z1 = 0, z2 = 0, sg = 1, sa = 1, cur = { ang: 0, pan: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const gT = coneGain(cur.ang), aT = Math.min(1, A.onePoleCoef(coneLpf(cur.ang) * 1.55, sr));
        const pa = (cur.pan + 1) * Math.PI / 4, gl = Math.cos(pa), gr = Math.sin(pa);
        for (let i = 0; i < n; i++) {
          const t = tS; tS += 1 / sr;
          const ch = PROG[Math.floor(t / 1.2) % PROG.length], beat = t % 0.3;
          let x = 0;
          for (let j = 0; j < 3; j++) { phs[j] += A.mtof(ch[j]) / sr; if (phs[j] >= 1) phs[j] -= 1; x += (2 * phs[j] - 1); }
          x = x * 0.15 + noise[Math.floor(t * sr) & 0xffff] * Math.exp(-beat / 0.03) * 0.35;
          sg += (gT - sg) * 0.002; sa += (aT - sa) * 0.002;
          z1 += sa * (x - z1); z2 += sa * (z1 - z2);
          const y = z2 * sg;
          l[i] = y * gl * 0.95; r[i] = y * gr * 0.95;
        }
      },
    });

    return {
      update(dt) {
        S.face = (S.face + P.spin * dt) % 360;
        const m = ctx.input.mouse;
        if (m.down && m.inside && m.y < ctx.height * 0.6 + 10) { S.lx = U.clamp(m.x / ctx.width, 0.03, 0.97); S.ly = U.clamp((m.y - 10) / (ctx.height * 0.6), 0.03, 0.97); }
        const gm = geom();
        // 청취자 기준 좌우: 청취자는 위를 봄. 음원이 청취자의 오른쪽이면 +
        cur = { ang: gm.ang, pan: U.clamp((gm.cx - gm.lx) / Math.max(1, Math.hypot(gm.cx - gm.lx, gm.cy - gm.ly)), -1, 1) };
        snd.update();
      },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, gm = geom();
        const R = Math.min(W * 0.4, gm.sh * 0.42);
        D.rect(g, pad, pad, W - pad * 2, gm.sh, 'rgba(0,0,0,0.35)');
        // 콘 영역
        const f0 = (S.face - 90) * RAD;
        if (P.cone) {
          const wedge = (a0, a1, fill) => { g.beginPath(); g.moveTo(gm.cx, gm.cy); g.arc(gm.cx, gm.cy, R, f0 + a0 * RAD, f0 + a1 * RAD); g.closePath(); g.fillStyle = fill; g.fill(); };
          wedge(-P.outer / 2, P.outer / 2, 'rgba(79,195,247,0.10)');
          wedge(-P.inner / 2, P.inner / 2, 'rgba(79,195,247,0.25)');
        }
        // 방향별 게인 (dB 반지름)
        g.beginPath();
        for (let i = 0; i <= 120; i++) {
          const a = i * 3, off = Math.abs(((a) % 360 + 540) % 360 - 180), db = A.linToDb(coneGain(off)), rr = R * U.clamp((db + 40) / 40, 0.02, 1);
          const th = f0 + a * RAD, px = gm.cx + Math.cos(th) * rr, py = gm.cy + Math.sin(th) * rr;
          i ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.closePath(); g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        // 음원
        D.circle(g, gm.cx, gm.cy, 9, '#2a2f38', C.text, 1.5);
        D.arrow(g, gm.cx, gm.cy, gm.cx + Math.cos(f0) * 22, gm.cy + Math.sin(f0) * 22, C.text, 2, 6);
        // 청취자
        D.line(g, gm.cx, gm.cy, gm.lx, gm.ly, C.dim, 1);
        D.rect(g, gm.lx - 7, gm.ly - 7, 14, 14, C.accent);
        D.text(g, Lg('선 = 방향별 게인 (바깥 원 = 0dB, 중심 = -40dB)', 'Line = gain by direction (outer ring = 0 dB, center = -40 dB)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 아래: 각도별 게인과 차단 주파수
        const gy = pad + gm.sh + 8, gh = H - gy - pad;
        if (gh > 40) {
          const gw = W - pad * 2, aX = (a) => pad + 30 + (gw - 40) * a / 180, dY = (db) => gy + 14 + (gh - 28) * U.clamp(-db / 40, 0, 1);
          D.rect(g, pad, gy, gw, gh, 'rgba(0,0,0,0.35)');
          for (const db of [0, -20, -40]) { D.line(g, pad + 30, dY(db), pad + gw - 10, dY(db), C.grid, 1); D.text(g, db + 'dB', pad + 2, dY(db) - 5, { size: 9, color: C.dim }); }
          for (const a of [0, 45, 90, 135, 180]) D.text(g, a + '°', aX(a), gy + gh - 12, { size: 9, color: C.dim, align: 'center' });
          g.beginPath(); for (let a = 0; a <= 180; a++) { const y = dY(A.linToDb(coneGain(a))); a ? g.lineTo(aX(a), y) : g.moveTo(aX(a), y); } g.strokeStyle = col; g.lineWidth = 2; g.stroke();
          // 차단 주파수 (오른쪽 축: 300Hz~20kHz 로그)
          const fY = (f) => gy + 14 + (gh - 28) * (1 - Math.log(f / 300) / Math.log(20000 / 300));
          g.beginPath(); for (let a = 0; a <= 180; a++) { const y = fY(coneLpf(a)); a ? g.lineTo(aX(a), y) : g.moveTo(aX(a), y); } g.strokeStyle = C.warn; g.lineWidth = 1; g.setLineDash([4, 3]); g.stroke(); g.setLineDash([]);
          D.line(g, aX(gm.ang), gy, aX(gm.ang), gy + gh, C.text, 1);
          D.text(g, Lg('정면에서 벗어난 각도별 게인 (노랑 점선 = 로우패스 차단 주파수)', 'Gain by angle off axis (yellow dashed = low-pass cutoff)'), pad + 34, gy + 3, { size: 10, color: C.dim });
        }
        ctx.stat(Lg('정면에서 벗어난 각도', 'Angle off axis'), `${gm.ang.toFixed(0)}°`);
        ctx.stat(Lg('콘 게인', 'Cone gain'), `${A.linToDb(coneGain(gm.ang)).toFixed(1)} dB`);
        ctx.stat(Lg('로우패스 차단', 'Low-pass cutoff'), P.cone ? `${coneLpf(gm.ang).toFixed(0)} Hz` : Lg('사용 안 함', 'Not used'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
