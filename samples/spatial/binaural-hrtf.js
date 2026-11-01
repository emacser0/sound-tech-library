// 바이노럴 머리 모델: 단순 스테레오 팬 vs 구형 머리 모델(Brown-Duda, ITD + 머리 그림자 필터)
GTL.register({
  id: 'binaural-hrtf',
  title: '바이노럴 머리 모델 (구형 머리 HRTF)',
  summary: '헤드폰에서 스테레오 팬은 소리를 머리 안 좌우로만 옮김. 구형 머리 모델은 먼 귀에 시간 지연과 고음 감쇠(머리 그림자)를 넣어 소리가 머리 밖 옆쪽에서 들리게 함.',
  views: { a: '스테레오 팬 (등전력)', b: '구형 머리 모델' },
  controls: '파라미터 표에서 방향을 바꾸거나 자동 회전을 켬. 헤드폰으로 들음.',
  info: `
    <p><b>머리 전달 함수(HRTF, Head-Related Transfer Function)</b>: 한 방향의 소리가 고막에 닿기까지 머리, 귓바퀴, 어깨가 바꾸는 주파수 응답. 왼쪽과 오른쪽 귀의 HRTF를 소리에 적용하면 헤드폰으로도 방향이 들림(바이노럴 렌더링).</p>
    <p>실측 HRTF는 방향마다 수백 탭짜리 필터라 무겁고 사람마다 다름. Brown과 Duda의 <b>구형 머리 모델</b>은 머리를 공으로 보고 두 부분만 흉내 냄.</p>
    <ul>
      <li><b>ITD</b>: 귀마다 경로 길이에 맞춘 지연. 정면 쪽 귀는 <code>-(a/c)cos θ</code>, 뒤쪽으로 돌아가는 귀는 <code>(a/c)(θ - π/2)</code>.</li>
      <li><b>머리 그림자</b>: 1극 1영점 하이 셸프 <code>(1 + jαω/2ω₀)/(1 + jω/2ω₀)</code>, ω₀ = c/a. 소리를 마주 보는 귀는 α=2(고음 +6dB), 가려진 귀는 α=0.1(고음 -20dB).</li>
    </ul>
    <p>스테레오 팬은 좌우 레벨만 바꿈. 헤드폰에서는 상이 머리 안(Inside-the-head)에 맺히고, 90°도 귀 바로 옆처럼 들림.</p>
    <p>한계: 귓바퀴 반사가 없어서 앞뒤와 높낮이 구분이 약함. 실제 제품(Steam Audio, Resonance, Wwise, Unity)은 측정 HRTF 데이터를 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="60" width="70" height="40" class="f-dim"/><text x="45" y="84" text-anchor="middle" class="t-small">${L('모노 음원', 'mono source')}</text>
    <path d="M80,80 L120,40" class="d-accent" marker-end="url(#arr)"/><path d="M80,80 L120,120" class="d-accent" marker-end="url(#arr)"/>
    <rect x="122" y="22" width="110" height="36" class="f-dim"/><text x="177" y="44" text-anchor="middle" class="t-small">${L('지연 T_L(θ)', 'delay T_L(θ)')}</text>
    <rect x="122" y="102" width="110" height="36" class="f-dim"/><text x="177" y="124" text-anchor="middle" class="t-small">${L('지연 T_R(θ)', 'delay T_R(θ)')}</text>
    <path d="M232,40 L262,40" class="d-accent" marker-end="url(#arr)"/><path d="M232,120 L262,120" class="d-accent" marker-end="url(#arr)"/>
    <rect x="264" y="22" width="130" height="36" class="f-dim"/><text x="329" y="44" text-anchor="middle" class="t-small">${L('머리 그림자 α_L(θ)', 'head shadow α_L(θ)')}</text>
    <rect x="264" y="102" width="130" height="36" class="f-dim"/><text x="329" y="124" text-anchor="middle" class="t-small">${L('머리 그림자 α_R(θ)', 'head shadow α_R(θ)')}</text>
    <path d="M394,40 L424,40" class="d-accent" marker-end="url(#arr)"/><path d="M394,120 L424,120" class="d-accent" marker-end="url(#arr)"/>
    <text x="430" y="44" class="t-b">${L('왼쪽 귀', 'left ear')}</text><text x="430" y="124" class="t-b">${L('오른쪽 귀', 'right ear')}</text>
    <text x="10" y="162" class="t-small t-dim">${L('θ: 음원 방향과 각 귀 방향 사이 각. 0이면 소리를 마주 봄, 180이면 반대편', 'θ: angle between the source and each ear axis. 0 faces the sound, 180 is the far side')}</text>
  </svg>`,
  look: [
    '헤드폰을 끼고 방향 90°에서 A와 B를 번갈아 들으면 A는 귀 안쪽, B는 머리 밖 오른쪽에서 들림',
    '아래 응답 그래프에서 B의 왼쪽 귀(먼 귀) 곡선은 고음으로 갈수록 내려감. A는 두 곡선 모두 평평함.',
    '자동 회전을 켜면 B는 소리가 머리 둘레를 도는 느낌이 남. A는 좌우로만 왕복함.',
    '방향을 30°와 150°로 바꿔 비교하면 B도 차이가 작음. 귓바퀴 단서가 없는 모델의 한계.',
  ],
  refs: [
    { type: 'paper', title: 'C. P. Brown, R. O. Duda, "A Structural Model for Binaural Sound Synthesis", IEEE Transactions on Speech and Audio Processing 6(5)', year: 1998, note: '이 샘플의 머리 그림자 필터와 지연식' },
    { type: 'paper', title: 'V. R. Algazi, R. O. Duda, D. M. Thompson, C. Avendano, "The CIPIC HRTF Database", IEEE WASPAA', year: 2001, note: '공개 측정 HRTF 데이터베이스' },
    { type: 'book', title: 'Jens Blauert, Spatial Hearing (Revised Edition), MIT Press', year: 1997, note: '머리 밖 정위와 HRTF' },
    { type: 'book', title: 'Durand R. Begault, 3-D Sound for Virtual Reality and Multimedia, Academic Press', year: 1994, note: '바이노럴 렌더링 실무' },
  ],
  params: [
    { key: 'model', label: '렌더링', type: 'select', options: [{ value: 'pan', label: '스테레오 팬 (등전력)' }, { value: 'head', label: '구형 머리 모델' }], a: 'pan', b: 'head', group: '렌더링' },
    { key: 'az', label: '방향 (°)', type: 'range', min: -180, max: 180, step: 1, default: 90, shared: true, group: '장면', help: '0 = 정면, + = 오른쪽' },
    { key: 'sweep', label: '자동 회전', type: 'bool', default: false, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'noise', label: '노이즈 버스트' }, { value: 'shaker', label: '셰이커 리듬' }, { value: 'tone', label: '밝은 톱니파 음' }], default: 'noise', shared: true },
    { key: 'radius', label: '머리 반지름 (cm)', type: 'range', min: 6, max: 12, step: 0.25, default: 8.75, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Binaural Head Model (Spherical Head HRTF)',
    summary: 'On headphones, a stereo pan only moves the sound left and right inside the head. A spherical head model adds a delay and high frequency loss (head shadow) at the far ear, so the sound comes from outside the head.',
    views: { a: 'Stereo pan (equal power)', b: 'Spherical head model' },
    controls: 'Change the direction in the parameter table or turn on auto rotate. Use headphones.',
    info: `
    <p><b>Head-Related Transfer Function (HRTF)</b>: the frequency response that the head, outer ear and shoulders apply to a sound from one direction before it reaches the eardrum. If you apply the left and right ear HRTFs to a sound, you hear direction even on headphones (binaural rendering).</p>
    <p>Measured HRTFs are filters with hundreds of taps per direction. They are heavy and differ for each person. The <b>spherical head model</b> by Brown and Duda treats the head as a ball and imitates only two parts.</p>
    <ul>
      <li><b>ITD</b>: a delay per ear that matches the path length. The ear facing the sound uses <code>-(a/c)cos θ</code>, the ear around the back uses <code>(a/c)(θ - π/2)</code>.</li>
      <li><b>Head shadow</b>: a one-pole, one-zero high shelf <code>(1 + jαω/2ω₀)/(1 + jω/2ω₀)</code>, ω₀ = c/a. The ear facing the sound gets α=2 (+6 dB treble), the hidden ear gets α=0.1 (-20 dB treble).</li>
    </ul>
    <p>A stereo pan changes only the left and right levels. On headphones the image sits inside the head, and 90 degrees sounds like it is right at the ear.</p>
    <p>Limit: there are no outer ear reflections, so front/back and up/down are weak. Real products (Steam Audio, Resonance, Wwise, Unity) use measured HRTF data.</p>`,
    look: [
      'Wear headphones, set the direction to 90 degrees and switch between A and B. A sounds inside your ear, B sounds outside the head on the right.',
      'In the response graph, B\'s left ear (far ear) curve drops toward high frequencies. In A both curves are flat.',
      'Turn on auto rotate. B feels like the sound moves around your head. A only moves left and right.',
      'Compare 30 and 150 degrees. Even B shows little difference. This is the limit of a model without outer ear cues.',
    ],
    refs: ['The head shadow filter and delay formulas used here.', 'A public database of measured HRTFs.', 'Externalization and HRTFs.', 'Practical binaural rendering.'],
    params: {
      model: { label: 'Rendering', group: 'Rendering', options: { pan: 'Stereo pan (equal power)', head: 'Spherical head model' } },
      az: { label: 'Direction (°)', group: 'Scene', help: '0 = front, + = right' },
      sweep: 'Auto rotate',
      src: { label: 'Source', options: { noise: 'Noise burst', shaker: 'Shaker rhythm', tone: 'Bright saw note' } },
      radius: 'Head radius (cm)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const CS = 343, AMIN = 0.1, TMIN = 150 * Math.PI / 180, colL = C.warn, colR = C.accent;
    const noise = A.noiseBuffer(1 << 16, 3);
    let sweepT = 0;
    const azNow = () => (P.sweep ? ((sweepT * 40) % 360) - 180 : P.az);

    // 각 귀의 각도 θ (0 = 소리를 마주 봄)
    const earAngle = (azDeg, earDeg) => { let d = Math.abs(((azDeg - earDeg) % 360 + 540) % 360 - 180); return d * Math.PI / 180; };
    const alphaOf = (th) => (1 + AMIN / 2) + (1 - AMIN / 2) * Math.cos(th / TMIN * Math.PI);
    const delayOf = (th, a) => (th < Math.PI / 2 ? -(a / CS) * Math.cos(th) : (a / CS) * (th - Math.PI / 2)) + a / CS;
    // 한 방향에서 두 귀의 설정
    function ears(az) {
      const a = P.radius / 100;
      if (P.model === 'pan') {
        const p = Math.sin(az * Math.PI / 180), ang = (p + 1) * Math.PI / 4;
        return { L: { g: Math.cos(ang), alpha: 1, d: 0 }, R: { g: Math.sin(ang), alpha: 1, d: 0 } };
      }
      const tl = earAngle(az, -90), tr = earAngle(az, 90);
      return { L: { g: 1, alpha: alphaOf(tl), d: delayOf(tl, a) }, R: { g: 1, alpha: alphaOf(tr), d: delayOf(tr, a) } };
    }
    const shadowDb = (alpha, f) => { const wt = 2 * Math.PI * f * (P.radius / 100) / (2 * CS); return 10 * Math.log10((1 + (alpha * wt) ** 2) / (1 + wt * wt)); };

    // 음원
    let ph = 0, tS = 0;
    function source(sr) {
      const t = tS; tS += 1 / sr;
      if (P.src === 'noise') { const tt = t % 0.45; return tt > 0.25 ? 0 : noise[Math.floor(t * sr) & 0xffff] * Math.min(1, tt / 0.003, (0.25 - tt) / 0.02) * 0.6; }
      if (P.src === 'shaker') { const tt = t % 0.125, acc = Math.floor(t / 0.125) % 4 === 0 ? 1 : 0.55; return noise[Math.floor(t * sr * 1.3) & 0xffff] * Math.exp(-tt / 0.025) * acc * 0.7; }
      ph += 220 / sr; if (ph >= 1) ph -= 1;
      const tt = t % 0.6, env = tt > 0.45 ? 0 : Math.min(1, tt / 0.01, (0.45 - tt) / 0.03);
      return (2 * ph - 1) * env * 0.4;
    }

    const M = 2047, buf = new Float32Array(M + 1);
    let w = 0;
    const readD = (d) => { const p = w - 1 - d, i0 = Math.floor(p), fr = p - i0; return buf[i0 & M] * (1 - fr) + buf[(i0 + 1) & M] * fr; };
    // 귀마다 상태: 지연, α, 게인 (부드럽게), 필터 상태
    const st = { L: { d: 0, a: 1, g: 0.7, x1: 0, y1: 0 }, R: { d: 0, a: 1, g: 0.7, x1: 0, y1: 0 } };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const e = ears(azNow()), tauK = (P.radius / 100) / (2 * CS) * 2 * sr, k = 0.002;
        for (let i = 0; i < n; i++) {
          buf[w] = source(sr); w = (w + 1) & M;
          for (const side of ['L', 'R']) {
            const s = st[side], tgt = e[side];
            s.d += (tgt.d * sr - s.d) * k; s.a += (tgt.alpha - s.a) * k; s.g += (tgt.g - s.g) * k;
            const x = readD(s.d), n0 = 1 + tauK;
            const b0 = (1 + s.a * tauK) / n0, b1 = (1 - s.a * tauK) / n0, a1 = (1 - tauK) / n0;
            const y = b0 * x + b1 * s.x1 - a1 * s.y1; s.x1 = x; s.y1 = y;
            (side === 'L' ? l : r)[i] = y * s.g * 0.4;
          }
        }
      },
    });

    return {
      update(dt) { if (P.sweep) sweepT += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const az = azNow(), e = ears(az), th = az * Math.PI / 180;
        // 위: 머리와 음원
        const topH = Math.max(110, H * 0.42), cx = W / 2, cy = pad + topH / 2, orb = topH / 2 - 10, R = Math.min(28, orb * 0.4);
        D.circle(g, cx, cy, orb, null, C.grid, 1);
        D.circle(g, cx, cy, R, '#2a2f38', C.dim, 1.5);
        D.poly(g, [{ x: cx - 6, y: cy - R + 2 }, { x: cx, y: cy - R - 10 }, { x: cx + 6, y: cy - R + 2 }], '#2a2f38', C.dim, 1.5);
        const sx = cx + Math.sin(th) * orb, sy = cy - Math.cos(th) * orb;
        // 그림자 영역 표시 (B): 소리 반대쪽 반구
        if (P.model === 'head') {
          g.beginPath(); g.arc(cx, cy, R + 3, th, th + Math.PI); g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 5; g.stroke();
        }
        const earL = { x: cx - R, y: cy }, earR = { x: cx + R, y: cy };
        D.rect(g, earL.x - 5, cy - 8, 6, 16, colL); D.rect(g, earR.x - 1, cy - 8, 6, 16, colR);
        D.line(g, sx, sy, earL.x, earL.y, colL, 1); D.line(g, sx, sy, earR.x, earR.y, colR, 1);
        D.circle(g, sx, sy, 7, col);
        // 들리는 상 (A: 머리 안 좌우 선 위, B: 머리 밖 원 위)
        if (P.model === 'pan') {
          const p = Math.sin(th);
          D.line(g, cx - R + 4, cy, cx + R - 4, cy, C.dim, 1);
          D.circle(g, cx + p * (R - 6), cy, 4, col);
          D.text(g, Lg('상: 머리 안', 'Image: inside the head'), cx, cy + R + 14, { size: 10, align: 'center', color: col });
        } else D.text(g, Lg('상: 머리 밖', 'Image: outside the head'), cx, cy + R + 14, { size: 10, align: 'center', color: col });
        // 아래: 귀별 응답
        const gy = pad + topH + 10, gh = H - gy - pad, gx = pad, gw = W - pad * 2;
        const respL = (f) => A.linToDb(e.L.g) + (P.model === 'head' ? shadowDb(e.L.alpha, f) : 0);
        const respR = (f) => A.linToDb(e.R.g) + (P.model === 'head' ? shadowDb(e.R.alpha, f) : 0);
        A.drawResponse(g, respL, gx, gy, gw, gh, { fmin: 50, fmax: 20000, minDb: -24, maxDb: 12, dbStep: 6, color: colL, label: Lg('귀별 주파수 응답 (노랑 = 왼쪽, 보라 = 오른쪽)', 'Response per ear (yellow = left, purple = right)') });
        A.drawResponse(g, respR, gx, gy, gw, gh, { fmin: 50, fmax: 20000, minDb: -24, maxDb: 12, color: colR, background: false, grid: false });
        const itd = (e.L.d - e.R.d) * 1e6;
        ctx.stat(Lg('방향', 'Direction'), `${az.toFixed(0)}°`);
        ctx.stat('ITD', `${Math.abs(itd).toFixed(0)} µs`);
        ctx.stat(Lg('ILD 500Hz', 'ILD 500 Hz'), `${(respR(500) - respL(500)).toFixed(1)} dB`);
        ctx.stat(Lg('ILD 6kHz', 'ILD 6 kHz'), `${(respR(6000) - respL(6000)).toFixed(1)} dB`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
