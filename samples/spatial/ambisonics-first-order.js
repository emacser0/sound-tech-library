// 1차 앰비소닉스: B-format 인코딩, 회전, 스피커 디코딩 vs 쌍 패닝(VBAP)
GTL.register({
  id: 'ambisonics-first-order',
  title: '1차 앰비소닉스 (B-format 인코딩과 디코딩)',
  summary: '쌍 패닝은 가장 가까운 스피커 두 대만 씀. 앰비소닉스는 소리를 방향 성분(W, X, Y)으로 저장한 뒤 모든 스피커로 디코딩함. 방향과 상관없이 퍼짐이 일정하고, 장면 회전이 행렬 곱 하나로 끝남.',
  views: { a: '쌍 패닝 (VBAP)', b: '앰비소닉스 (max-rE 디코딩)' },
  controls: '파라미터 표에서 음원 방향과 청취자 회전을 바꿈. 헤드폰 재생은 가상 스피커를 간단한 머리 모델로 합친 소리.',
  info: `
    <p><b>앰비소닉스(Ambisonics)</b>는 스피커 신호 대신 음장(Sound Field)을 저장하는 형식. 1차 수평 앰비소닉스는 세 채널.</p>
    <ul>
      <li><b>W</b>: 무지향 성분 <code>s / √2</code> (FuMa 규약)</li>
      <li><b>X</b>: 앞뒤 8자 성분 <code>s cos φ</code></li>
      <li><b>Y</b>: 좌우 8자 성분 <code>s sin φ</code></li>
    </ul>
    <p><b>회전</b>: 청취자가 ψ만큼 돌면 <code>X' = X cos ψ + Y sin ψ</code>, <code>Y' = Y cos ψ - X sin ψ</code>. 음원이 몇 개든 채널 3개만 돌리면 됨. 360° 영상과 VR 오디오에서 머리 추적에 쓰는 이유.</p>
    <p><b>디코딩</b>: 정다각형 스피커 N대에서 i번째 게인은 <code>(1/N)(1 + 2a cos(φ - φᵢ))</code>. 스피커마다 가상 마이크를 그 방향으로 향한 것과 같음.</p>
    <ul>
      <li>basic (a=1): 속도 벡터 rV가 정확함. 반대편 스피커에 음(-) 게인이 생겨 넓은 자리에서 소리가 흐려짐.</li>
      <li>max-rE (a=0.707): 에너지 벡터 rE 크기를 최대로 만든 가중치. 1차에서 rE = 0.707로 방향과 무관하게 일정.</li>
      <li>in-phase (a=0.5): 음 게인 없음. 넓은 청취 영역용이지만 상이 가장 넓게 퍼짐.</li>
    </ul>
    <p>단점: 1차는 방향 해상도가 낮아 상이 넓게 퍼짐. 고차(HOA)로 갈수록 좁아지지만 채널 수가 (M+1)²로 늘어남.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="6" y="60" width="64" height="36" class="f-dim"/><text x="38" y="82" text-anchor="middle" class="t-small">${L('음원 s, φ', 'source s, φ')}</text>
    <path d="M70,78 L100,78" class="d-accent" marker-end="url(#arr)"/>
    <rect x="102" y="40" width="86" height="76" class="f-dim"/><text x="145" y="62" text-anchor="middle" class="t-small">${L('인코딩', 'encode')}</text>
    <text x="145" y="80" text-anchor="middle" class="t-small t-mono">W X Y</text>
    <path d="M188,78 L218,78" class="d-accent" marker-end="url(#arr)"/>
    <rect x="220" y="40" width="96" height="76" class="f-dim"/><text x="268" y="62" text-anchor="middle" class="t-small">${L('회전 ψ', 'rotate ψ')}</text>
    <text x="268" y="80" text-anchor="middle" class="t-small t-dim">${L('채널 3개만 계산', 'only 3 channels')}</text>
    <path d="M316,78 L346,78" class="d-accent" marker-end="url(#arr)"/>
    <rect x="348" y="40" width="86" height="76" class="f-dim"/><text x="391" y="62" text-anchor="middle" class="t-small">${L('디코딩', 'decode')}</text>
    <text x="391" y="80" text-anchor="middle" class="t-small t-dim">${L('스피커 N대', 'N speakers')}</text>
    <path d="M434,78 L464,78" class="d-accent" marker-end="url(#arr)"/>
    <circle cx="496" cy="78" r="26" class="d-dim"/>
    <rect x="492" y="48" width="8" height="8" class="f-b"/><rect x="518" y="74" width="8" height="8" class="f-b"/><rect x="492" y="100" width="8" height="8" class="f-b"/><rect x="466" y="74" width="8" height="8" class="f-b"/>
    <text x="10" y="146" class="t-small t-dim">${L('저장과 전송은 스피커 배치와 무관. 재생 장소의 스피커에 맞춰 마지막에 디코딩', 'Storage does not depend on the speaker layout. Decode at the end for the speakers you have')}</text>
  </svg>`,
  look: [
    '자동 회전을 켜고 아래 그래프를 보면 A의 rE 크기는 스피커 사이에서 출렁이고, B는 0.707로 평평함',
    '음원을 스피커 바로 위(0°)에 두면 A는 스피커 한 대만 켜짐. B는 여러 대가 함께 울림.',
    'B의 디코딩을 basic으로 바꾸면 반대편 스피커 막대가 빨간색(음 게인)으로 바뀜',
    '청취자 회전을 90°로 바꾸면 두 뷰 모두 음원이 왼쪽으로 돎. B는 W, X, Y만 돌려서 얻은 결과.',
  ],
  refs: [
    { type: 'paper', title: 'Michael A. Gerzon, "Periphony: With-Height Sound Reproduction", Journal of the Audio Engineering Society 21(1)', year: 1973, note: '앰비소닉스의 기초 논문' },
    { type: 'paper', title: 'Michael A. Gerzon, "General Metatheory of Auditory Localisation", AES 92nd Convention', year: 1992, note: '속도 벡터 rV와 에너지 벡터 rE' },
    { type: 'book', title: 'Franz Zotter, Matthias Frank, Ambisonics: A Practical 3D Audio Theory for Recording, Studio Production, Sound Reinforcement, and Virtual Reality, Springer', year: 2019, note: 'max-rE 가중치와 디코더 설계. 오픈 액세스 도서' },
    { type: 'paper', title: 'Ville Pulkki, "Virtual Sound Source Positioning Using Vector Base Amplitude Panning", Journal of the Audio Engineering Society 45(6)', year: 1997, note: 'A 뷰의 쌍 패닝' },
  ],
  params: [
    { key: 'method', label: '방식', type: 'select', options: [{ value: 'vbap', label: '쌍 패닝 (VBAP)' }, { value: 'basic', label: '앰비소닉스 basic' }, { value: 'maxre', label: '앰비소닉스 max-rE' }, { value: 'inphase', label: '앰비소닉스 in-phase' }], a: 'vbap', b: 'maxre', group: '패닝' },
    { key: 'nSpk', label: '스피커 수', type: 'int', min: 4, max: 12, default: 6, shared: true, help: '원 위에 같은 간격으로 놓음' },
    { key: 'az', label: '음원 방향 (°)', type: 'range', min: -180, max: 180, step: 1, default: 30, shared: true, group: '장면', help: '0 = 정면, + = 오른쪽' },
    { key: 'sweep', label: '자동 회전', type: 'bool', default: false, shared: true },
    { key: 'yaw', label: '청취자 회전 (°)', type: 'range', min: -180, max: 180, step: 1, default: 0, shared: true, help: '+ = 오른쪽으로 돎' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'First Order Ambisonics (B-format Encode and Decode)',
    summary: 'Pair panning uses only the two nearest speakers. Ambisonics stores the sound as directional components (W, X, Y) and then decodes them to all speakers. The spread is the same in every direction, and rotating the scene takes one matrix multiply.',
    views: { a: 'Pair panning (VBAP)', b: 'Ambisonics (max-rE decode)' },
    controls: 'Change the source direction and listener rotation in the parameter table. The headphone output mixes the virtual speakers through a simple head model.',
    info: `
    <p><b>Ambisonics</b> stores the sound field instead of speaker signals. First order horizontal ambisonics has three channels.</p>
    <ul>
      <li><b>W</b>: omni component <code>s / √2</code> (FuMa convention)</li>
      <li><b>X</b>: front/back figure-8 component <code>s cos φ</code></li>
      <li><b>Y</b>: left/right figure-8 component <code>s sin φ</code></li>
    </ul>
    <p><b>Rotation</b>: if the listener turns by ψ, <code>X' = X cos ψ + Y sin ψ</code> and <code>Y' = Y cos ψ - X sin ψ</code>. No matter how many sources there are, you rotate only three channels. This is why 360 video and VR audio use it for head tracking.</p>
    <p><b>Decoding</b>: with N speakers on a regular polygon, the gain of speaker i is <code>(1/N)(1 + 2a cos(φ - φᵢ))</code>. It is like pointing a virtual microphone toward each speaker.</p>
    <ul>
      <li>basic (a=1): the velocity vector rV is exact. Opposite speakers get negative gain, so the sound gets blurry away from the center seat.</li>
      <li>max-rE (a=0.707): weights that make the energy vector rE as long as possible. In first order rE = 0.707 in every direction.</li>
      <li>in-phase (a=0.5): no negative gains. Good for a large listening area, but the image spreads the most.</li>
    </ul>
    <p>Downside: first order has low directional resolution, so the image is wide. Higher orders (HOA) are sharper, but need (M+1)² channels.</p>`,
    look: [
      'Turn on auto rotate and watch the bottom graph. A\'s rE length ripples between speakers. B stays flat at 0.707.',
      'Put the source right on a speaker (0 degrees). A turns on only one speaker. B plays several together.',
      'Change B\'s decoder to basic. The bars of the opposite speakers turn red (negative gain).',
      'Set the listener rotation to 90 degrees. In both views the source moves to the left. B gets this by rotating only W, X and Y.',
    ],
    refs: ['The founding ambisonics paper.', 'The velocity vector rV and energy vector rE.', 'max-rE weights and decoder design. Open access book.', 'The pair panning in view A.'],
    params: {
      method: { label: 'Method', group: 'Panning', options: { vbap: 'Pair panning (VBAP)', basic: 'Ambisonics basic', maxre: 'Ambisonics max-rE', inphase: 'Ambisonics in-phase' } },
      nSpk: { label: 'Speakers', help: 'Placed at equal spacing on a circle' },
      az: { label: 'Source direction (°)', group: 'Scene', help: '0 = front, + = right' },
      sweep: 'Auto rotate',
      yaw: { label: 'Listener rotation (°)', help: '+ = turn right' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const RAD = Math.PI / 180;
    let sweepT = 0;
    const azNow = () => (P.sweep ? ((sweepT * 30) % 360) - 180 : P.az);
    const spkAz = () => Array.from({ length: P.nSpk }, (_, i) => (i * 360 / P.nSpk));
    const WEIGHT = { basic: 1, maxre: Math.SQRT1_2, inphase: 0.5 };

    // 스피커 게인. azRel: 청취자 기준 음원 방향 (도)
    function gains(azSrc, method = P.method) {
      const sp = spkAz(), N = sp.length, phi = azSrc * RAD, psi = P.yaw * RAD;
      if (method === 'vbap') {
        // 청취자 기준 방향에서 가장 가까운 두 스피커 사이를 VBAP
        const rel = ((azSrc - P.yaw) % 360 + 360) % 360, step = 360 / N, i0 = Math.floor(rel / step) % N, i1 = (i0 + 1) % N;
        const t = (rel - i0 * step) * RAD, span = step * RAD;
        // 2D VBAP: 두 단위 벡터의 조합으로 방향 벡터를 만듦
        const g1 = Math.sin(span - t) / Math.sin(span), g2 = Math.sin(t) / Math.sin(span), nrm = Math.hypot(g1, g2) || 1;
        const g = new Array(N).fill(0); g[i0] = g1 / nrm; g[i1] = g2 / nrm;
        return g;
      }
      // 인코딩
      const Wc = Math.SQRT1_2, X = Math.cos(phi), Y = Math.sin(phi);
      // 회전 (청취자가 psi만큼 돎)
      const Xr = X * Math.cos(psi) + Y * Math.sin(psi), Yr = Y * Math.cos(psi) - X * Math.sin(psi);
      const a = WEIGHT[method];
      return sp.map((d) => (Math.SQRT2 * Wc + 2 * a * (Xr * Math.cos(d * RAD) + Yr * Math.sin(d * RAD))) / N);
    }
    // 속도 벡터와 에너지 벡터 (청취자 기준)
    function vectors(g) {
      const sp = spkAz();
      let vx = 0, vy = 0, vs = 0, ex = 0, ey = 0, es = 0;
      sp.forEach((d, i) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); vx += g[i] * c; vy += g[i] * s; vs += g[i]; ex += g[i] * g[i] * c; ey += g[i] * g[i] * s; es += g[i] * g[i]; });
      return { rV: Math.hypot(vx, vy) / Math.max(1e-9, Math.abs(vs)), rE: Math.hypot(ex, ey) / Math.max(1e-9, es), dirE: Math.atan2(ey, ex) / RAD, power: es };
    }

    // 소리: 가상 스피커를 간단한 머리 모델(ITD + 약한 ILD)로 헤드폰에 합침
    const noise = A.noiseBuffer(1 << 16, 13);
    let tS = 0, ph = 0;
    function source(sr) {
      const t = tS; tS += 1 / sr;
      const tt = t % 0.5;
      const n = noise[Math.floor(t * sr) & 0xffff] * Math.exp(-tt / 0.06) * Math.min(1, tt / 0.002);
      ph += 196 / sr; if (ph >= 1) ph -= 1;
      return n * 0.5 + (2 * ph - 1) * Math.exp(-tt / 0.15) * 0.25;
    }
    const earOf = (dDeg, sr) => {
      const th = dDeg * RAD, lat = Math.asin(Math.sin(th)), itd = 0.0875 / 343 * (Math.abs(lat) + Math.sin(Math.abs(lat))) * sr;
      const far = A.dbToLin(-6 * Math.abs(Math.sin(th))), right = Math.sin(th) >= 0;
      return { dl: right ? itd : 0, dr: right ? 0 : itd, gl: right ? far : 1, gr: right ? 1 : far };
    };
    const M = 1023, buf = new Float32Array(M + 1);
    let w = 0, sm = [];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const g = gains(azNow()), sp = spkAz();
        if (sm.length !== g.length) sm = g.slice();
        const ears = sp.map((d) => earOf(d, sr));
        for (let i = 0; i < n; i++) {
          buf[w] = source(sr);
          let sl = 0, sr2 = 0;
          for (let j = 0; j < g.length; j++) {
            sm[j] += (g[j] - sm[j]) * 0.002;
            const e = ears[j];
            sl += buf[(w - Math.round(e.dl)) & M] * e.gl * sm[j];
            sr2 += buf[(w - Math.round(e.dr)) & M] * e.gr * sm[j];
          }
          l[i] = sl * 0.5; r[i] = sr2 * 0.5;
          w = (w + 1) & M;
        }
      },
    });

    // 방향별 rE 곡선 (파라미터가 바뀔 때만 계산)
    let curveKey = '', curve = null;
    function curves() {
      const k = P.method + P.nSpk + P.yaw;
      if (k === curveKey) return curve;
      curveKey = k;
      curve = [];
      for (let a = -180; a <= 180; a += 2) { const v = vectors(gains(a)); let err = Math.abs(((v.dirE - (a - P.yaw)) % 360 + 540) % 360 - 180); curve.push({ a, rE: v.rE, err }); }
      return curve;
    }

    return {
      update(dt) { if (P.sweep) sweepT += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const az = azNow(), gs = gains(az), v = vectors(gs), sp = spkAz();
        // 위: 스피커 원 (청취자 기준. 위 = 청취자 정면)
        const topH = Math.max(140, H * 0.6), cx = W / 2, cy = pad + topH / 2, R = topH / 2 - 22;
        D.circle(g, cx, cy, R, null, C.grid, 1);
        const P2 = (deg, rr) => ({ x: cx + Math.sin(deg * RAD) * rr, y: cy - Math.cos(deg * RAD) * rr });
        // 디코더 패턴 (가상 마이크) 또는 VBAP 게인 분포
        if (P.method !== 'vbap') {
          g.beginPath();
          const relSrc = az - P.yaw, a = WEIGHT[P.method];
          for (let i = 0; i <= 120; i++) { const d = i * 3, pv = (1 + 2 * a * Math.cos((d - relSrc) * RAD)) / (1 + 2 * a), p = P2(d, Math.abs(pv) * R * 0.8); i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y); }
          g.closePath(); g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1; g.stroke();
        }
        const gmax = Math.max(1e-6, ...gs.map(Math.abs));
        sp.forEach((d, i) => {
          const p = P2(d, R), gv = gs[i] / gmax;
          D.rect(g, p.x - 7, p.y - 7, 14, 14, '#2a2f38', C.dim, 1);
          const q = P2(d, R + 2), q2 = P2(d, R - 4 - Math.abs(gv) * R * 0.45);
          if (Math.abs(gv) > 0.01) D.line(g, q.x, q.y, q2.x, q2.y, gs[i] < 0 ? C.bad : col, 5);
        });
        // 청취자 머리 (회전 표시)
        D.circle(g, cx, cy, 11, '#2a2f38', C.dim, 1.5);
        D.line(g, cx, cy, cx, cy - 16, C.text, 1.5);
        // 음원 (청취자 기준 방향)
        const s = P2(az - P.yaw, R + 14);
        D.circle(g, s.x, s.y, 6, C.text);
        // rE 벡터
        const e = P2(v.dirE, v.rE * R);
        D.arrow(g, cx, cy, e.x, e.y, C.good, 2);
        D.text(g, Lg('초록 화살표 = 에너지 벡터 rE, 막대 = 스피커 게인 (빨강 = 음수)', 'Green arrow = energy vector rE, bars = speaker gain (red = negative)'), pad, pad, { size: 10, color: C.dim });
        // 아래: 방향별 rE 크기
        const gy = pad + topH + 6, gh = H - gy - pad, gx = pad, gw = W - pad * 2;
        if (gh > 40) {
          D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
          const cv = curves(), aX = (a) => gx + gw * (a + 180) / 360, rY = (v2) => gy + gh - 14 - (gh - 30) * v2;
          for (const t of [0.5, 0.707, 1]) { D.line(g, gx, rY(t), gx + gw, rY(t), C.grid, 1); D.text(g, String(t), gx + 2, rY(t) - 10, { size: 9, color: C.dim }); }
          g.beginPath(); cv.forEach((p, i) => (i ? g.lineTo(aX(p.a), rY(p.rE)) : g.moveTo(aX(p.a), rY(p.rE)))); g.strokeStyle = col; g.lineWidth = 2; g.stroke();
          for (const d of sp) { const a = ((d + P.yaw + 180) % 360 + 360) % 360 - 180; D.line(g, aX(a), gy + gh - 6, aX(a), gy + gh, C.dim, 2); }
          D.line(g, aX(((az + 180) % 360 + 360) % 360 - 180), gy, aX(((az + 180) % 360 + 360) % 360 - 180), gy + gh, C.text, 1);
          D.text(g, Lg('음원 방향에 따른 rE 크기 (아래 눈금 = 스피커)', 'rE length by source direction (ticks = speakers)'), gx + 30, gy + 3, { size: 10, color: C.dim });
        }
        const err = Math.abs(((v.dirE - (az - P.yaw)) % 360 + 540) % 360 - 180);
        ctx.stat(Lg('켜진 스피커', 'Active speakers'), gs.filter((x) => Math.abs(x) > 1e-3).length + ' / ' + gs.length);
        ctx.stat(Lg('rE 크기', 'rE length'), v.rE.toFixed(3));
        ctx.stat(Lg('rE 방향 오차', 'rE direction error'), `${err.toFixed(1)}°`);
        ctx.stat(Lg('rV 크기', 'rV length'), v.rV.toFixed(3));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
