// 양이 시간차(ITD)와 양이 레벨차(ILD): 두 단서를 따로 떼어 들어 봄
GTL.register({
  id: 'itd-ild',
  title: '양이 시간차와 레벨차 (ITD, ILD)',
  summary: '소리가 옆에서 오면 먼 귀에 늦게(ITD), 작게(ILD) 도착함. A는 레벨 차이만, B는 시간 차이만 넣어서 두 단서가 각각 방향감을 만드는 모습을 비교.',
  views: { a: '레벨 차이만 (ILD)', b: '시간 차이만 (ITD)' },
  controls: '파라미터 표에서 방향을 바꿈. 헤드폰으로 들어야 차이가 분명함.',
  info: `
    <p>사람은 두 귀에 들어온 소리를 비교해서 좌우 방향을 알아냄. 단서는 두 가지.</p>
    <ul>
      <li><b>양이 시간차(ITD, Interaural Time Difference)</b>: 먼 귀까지 경로가 길어서 늦게 도착함. 머리 반지름 8.75cm면 옆(90°)에서 최대 약 0.66ms.</li>
      <li><b>양이 레벨차(ILD, Interaural Level Difference)</b>: 머리가 그림자를 만들어 먼 귀에 작게 도착함. 파장이 머리보다 짧은 고음에서 커짐 (4kHz 이상에서 10~20dB).</li>
    </ul>
    <p>레일리의 이중 이론(Duplex Theory): 저음은 주로 ITD, 고음은 주로 ILD로 방향을 판단. 주기가 ITD의 두 배보다 짧아지면(약 750Hz 이상) 위상 차이가 한 바퀴를 넘어 어느 쪽이 먼저인지 모호해짐.</p>
    <p>이 샘플의 ITD는 Woodworth 구형 머리 공식 <code>(a/c)(θ + sin θ)</code>. ILD는 설명용 단순 모델 <code>최대 ILD × sin θ</code>(모든 주파수에 같은 값).</p>
    <p>한계: 두 단서 모두 앞과 뒤에서 같은 값이 나옴(혼동 원뿔, Cone of Confusion). 앞뒤 구분은 귓바퀴(Pinna)의 스펙트럼 단서와 머리 움직임이 담당.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <circle cx="130" cy="100" r="40" class="f-dim"/>
    <polygon points="122,62 130,48 138,62" class="f-dim"/>
    <rect x="84" y="92" width="6" height="16" class="f-dim"/><rect x="170" y="92" width="6" height="16" class="f-dim"/>
    <circle cx="250" cy="40" r="7" class="f-accent"/>
    <text x="262" y="36" class="t-small">${L('음원', 'source')}</text>
    <line x1="245" y1="44" x2="176" y2="98" class="d-b"/>
    <path d="M245,44 L150,70 Q110,60 88,96" class="d-a"/>
    <text x="196" y="88" class="t-small t-b">${L('가까운 귀', 'near ear')}</text>
    <text x="20" y="80" class="t-small t-a">${L('먼 귀: 경로가 길고', 'far ear: longer path')}</text>
    <text x="20" y="94" class="t-small t-a">${L('머리 그림자 안', 'inside head shadow')}</text>
    <line x1="300" y1="140" x2="530" y2="140" class="d-dim"/>
    <text x="300" y="24" class="t-small t-dim">${L('귀에 도착한 클릭', 'Click at each ear')}</text>
    <line x1="330" y1="140" x2="330" y2="60" class="d-b"/><text x="330" y="54" text-anchor="middle" class="t-small t-b">${L('가까운 귀', 'near')}</text>
    <line x1="420" y1="140" x2="420" y2="100" class="d-a"/><text x="420" y="94" text-anchor="middle" class="t-small t-a">${L('먼 귀', 'far')}</text>
    <line x1="330" y1="156" x2="420" y2="156" class="d-line"/>
    <text x="375" y="172" text-anchor="middle" class="t-small">ITD</text>
    <line x1="438" y1="60" x2="438" y2="100" class="d-line"/>
    <text x="446" y="84" class="t-small">ILD</text>
  </svg>`,
  look: [
    '방향을 90°로 두고 A와 B를 번갈아 들으면 둘 다 오른쪽으로 치우침. 단서가 달라도 방향감이 생김.',
    '음원을 "4kHz 톤"으로 바꾸면 B(ITD만)는 방향이 흐릿해짐. 고음에서는 위상 차이가 모호해짐.',
    '음원을 "500Hz 톤"으로 바꾸고 B를 들으면 방향이 또렷함. 저음에서는 ITD가 잘 작동함.',
    '방향을 30°와 150°로 바꿔 보면 ITD, ILD 측정값이 똑같음. 앞뒤를 구분할 단서가 없음.',
  ],
  refs: [
    { type: 'paper', title: 'Lord Rayleigh, "On our perception of sound direction", Philosophical Magazine 13', year: 1907, note: '이중 이론(Duplex Theory)의 출발점' },
    { type: 'book', title: 'Jens Blauert, Spatial Hearing: The Psychophysics of Human Sound Localization (Revised Edition), MIT Press', year: 1997, note: 'ITD, ILD, 혼동 원뿔 정리' },
    { type: 'book', title: 'R. S. Woodworth, H. Schlosberg, Experimental Psychology', year: 1954, note: '구형 머리 ITD 근사식' },
    { type: 'book', title: 'Durand R. Begault, 3-D Sound for Virtual Reality and Multimedia, Academic Press', year: 1994, note: '공간 음향 합성 입문서' },
  ],
  params: [
    { key: 'cue', label: '단서', type: 'select', options: [{ value: 'ild', label: '레벨 차이만 (ILD)' }, { value: 'itd', label: '시간 차이만 (ITD)' }, { value: 'both', label: '둘 다' }], a: 'ild', b: 'itd', group: '단서' },
    { key: 'az', label: '방향 (°)', type: 'range', min: -180, max: 180, step: 1, default: 60, shared: true, group: '장면', help: '0 = 정면, + = 오른쪽, 180 = 뒤' },
    { key: 'sweep', label: '자동 회전', type: 'bool', default: false, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'click', label: '클릭' }, { value: 'noise', label: '노이즈 버스트' }, { value: 'low', label: '500Hz 톤' }, { value: 'high', label: '4kHz 톤' }], default: 'click', shared: true },
    { key: 'radius', label: '머리 반지름 (cm)', type: 'range', min: 5, max: 12, step: 0.25, default: 8.75, shared: true },
    { key: 'ildMax', label: '최대 ILD (dB)', type: 'range', min: 0, max: 20, step: 0.5, default: 10, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Interaural Time and Level Difference (ITD, ILD)',
    summary: 'A sound from the side reaches the far ear later (ITD) and quieter (ILD). A uses only the level difference and B only the time difference, so you can hear how each cue alone creates direction.',
    views: { a: 'Level difference only (ILD)', b: 'Time difference only (ITD)' },
    controls: 'Change the direction in the parameter table. Use headphones to hear the difference clearly.',
    info: `
    <p>We find left and right by comparing the sound at our two ears. There are two cues.</p>
    <ul>
      <li><b>Interaural Time Difference (ITD)</b>: the path to the far ear is longer, so the sound arrives later. With a head radius of 8.75 cm the maximum is about 0.66 ms (source at 90 degrees).</li>
      <li><b>Interaural Level Difference (ILD)</b>: the head casts a shadow, so the far ear gets a quieter sound. It grows at high frequencies where the wavelength is shorter than the head (10~20 dB above 4 kHz).</li>
    </ul>
    <p>Rayleigh's Duplex Theory: we judge direction mostly by ITD at low frequencies and by ILD at high frequencies. When the period is shorter than twice the ITD (above about 750 Hz), the phase difference wraps past a full cycle and it becomes unclear which ear was first.</p>
    <p>The ITD here uses the Woodworth spherical head formula <code>(a/c)(θ + sin θ)</code>. The ILD is a simple teaching model <code>max ILD × sin θ</code> (same at all frequencies).</p>
    <p>Limit: both cues give the same value for front and back (the Cone of Confusion). Front and back are told apart by spectral cues of the outer ear (pinna) and by head movement.</p>`,
    look: [
      'Set the direction to 90 degrees and switch between A and B. Both move to the right. Different cues still create direction.',
      'Change the source to "4 kHz tone". B (ITD only) loses its direction. At high frequencies the phase difference is ambiguous.',
      'Change the source to "500 Hz tone" and listen to B. The direction is clear. ITD works well at low frequencies.',
      'Try 30 and 150 degrees. The ITD and ILD stats are exactly the same. There is no cue to tell front from back.',
    ],
    refs: ['The origin of the Duplex Theory.', 'Covers ITD, ILD and the cone of confusion.', 'The spherical head ITD formula.', 'An introduction to spatial sound synthesis.'],
    params: {
      cue: { label: 'Cue', group: 'Cue', options: { ild: 'Level difference only (ILD)', itd: 'Time difference only (ITD)', both: 'Both' } },
      az: { label: 'Direction (°)', group: 'Scene', help: '0 = front, + = right, 180 = back' },
      sweep: 'Auto rotate',
      src: { label: 'Source', options: { click: 'Click', noise: 'Noise burst', low: '500 Hz tone', high: '4 kHz tone' } },
      radius: 'Head radius (cm)',
      ildMax: 'Max ILD (dB)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const CS = 343, colL = C.warn, colR = C.accent;
    const noise = A.noiseBuffer(1 << 16, 11);
    let sweepT = 0;

    const azNow = () => (P.sweep ? 170 * Math.sin(sweepT * 0.35) : P.az);
    // 현재 방향의 단서. az: 도 단위
    function cues(az) {
      const th = az * Math.PI / 180, lat = Math.asin(Math.sin(th)); // 측면각 (앞뒤 대칭)
      const a = P.radius / 100;
      const itd = (a / CS) * (Math.abs(lat) + Math.sin(Math.abs(lat)));  // 초
      const ild = P.ildMax * Math.abs(Math.sin(th));                       // dB
      const useT = P.cue !== 'ild', useL = P.cue !== 'itd';
      const right = Math.sin(th) >= 0;
      return { itd, ild, right, dT: useT ? itd : 0, dL: useL ? ild : 0, lat };
    }

    // 음원 한 샘플. t: 초
    const srcState = { ph: 0 };
    function source(t, sr) {
      const k = P.src;
      if (k === 'click') { const tt = t % 0.25; return tt < 0.0003 ? Math.sin(Math.PI * tt / 0.0003) * 0.9 : 0; }
      if (k === 'noise') { const tt = t % 0.5; if (tt > 0.15) return 0; const env = Math.min(1, tt / 0.002) * Math.exp(-tt / 0.05); return noise[Math.floor(t * sr) & 0xffff] * env * 0.7; }
      const f = k === 'low' ? 500 : 4000, tt = t % 0.5;
      const env = tt > 0.35 ? 0 : Math.min(1, tt / 0.01, (0.35 - tt) / 0.01);
      srcState.ph += f / sr; if (srcState.ph > 1) srcState.ph -= 1;
      return Math.sin(2 * Math.PI * srcState.ph) * env * 0.6;
    }

    // 지연선 (선형 보간)
    const M = 4095, bufL = new Float32Array(M + 1);
    let w = 0, tS = 0, sDl = 0, sDr = 0, sGl = 1, sGr = 1;
    const readD = (d) => { const p = w - 1 - d, i0 = Math.floor(p), fr = p - i0; return bufL[i0 & M] * (1 - fr) + bufL[(i0 + 1) & M] * fr; };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const c = cues(azNow());
        const dlT = c.right ? c.dT * sr : 0, drT = c.right ? 0 : c.dT * sr;
        const half = c.dL / 2, glT = A.dbToLin(c.right ? -half : half), grT = A.dbToLin(c.right ? half : -half);
        const k = 0.002;
        for (let i = 0; i < n; i++) {
          bufL[w] = source(tS, sr); w = (w + 1) & M; tS += 1 / sr;
          sDl += (dlT - sDl) * k; sDr += (drT - sDr) * k; sGl += (glT - sGl) * k; sGr += (grT - sGr) * k;
          l[i] = readD(sDl) * sGl * 0.38; r[i] = readD(sDr) * sGr * 0.38;
        }
      },
    });

    function drawHead(g, cx, cy, R) {
      D.circle(g, cx, cy, R, '#2a2f38', C.dim, 1.5);
      D.poly(g, [{ x: cx - 6, y: cy - R + 2 }, { x: cx, y: cy - R - 10 }, { x: cx + 6, y: cy - R + 2 }], '#2a2f38', C.dim, 1.5);
      D.rect(g, cx - R - 5, cy - 8, 6, 16, colL); D.rect(g, cx + R - 1, cy - 8, 6, 16, colR);
    }

    return {
      update(dt) { if (P.sweep) sweepT += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const az = azNow(), c = cues(az), th = az * Math.PI / 180;
        // 위: 머리와 음원
        const topH = Math.max(120, H * 0.42), cx = Math.min(W * 0.25, topH * 0.6), cy = pad + topH / 2, R = Math.min(30, topH * 0.18), orb = Math.min(cx - 14, topH / 2 - 12);
        D.circle(g, cx, cy, orb, null, C.grid, 1);
        drawHead(g, cx, cy, R);
        const sx = cx + Math.sin(th) * orb, sy = cy - Math.cos(th) * orb;
        D.line(g, sx, sy, cx + R + 2, cy, colR, 1); D.line(g, sx, sy, cx - R - 2, cy, colL, 1);
        D.circle(g, sx, sy, 7, col);
        // 혼동 원뿔: 앞뒤 대칭 위치
        const mx = cx + Math.sin(Math.PI - th) * orb, my = cy - Math.cos(Math.PI - th) * orb;
        D.circle(g, mx, my, 6, null, C.dim, 1);
        D.text(g, Lg('같은 단서', 'same cues'), mx + 8, my - 5, { size: 9, color: C.dim });
        // 오른쪽 위: 귀 신호 확대
        const wx = cx + orb + 20, ww = W - wx - pad, wy = pad, wh = topH;
        D.rect(g, wx, wy, ww, wh, 'rgba(0,0,0,0.35)');
        D.text(g, Lg('귀에 도착한 신호 (확대)', 'Signal at each ear (zoomed)'), wx + 4, wy + 3, { size: 10, color: C.dim });
        const tone = P.src === 'low' || P.src === 'high', f = P.src === 'low' ? 500 : 4000;
        const span = tone ? Math.max(3 / f, 0.0016) : 0.0016, t0 = -0.0002;
        const gl = A.dbToLin(c.right ? -c.dL / 2 : c.dL / 2), gr = A.dbToLin(c.right ? c.dL / 2 : -c.dL / 2);
        const dl = c.right ? c.dT : 0, dr = c.right ? 0 : c.dT;
        const sig = (t) => (tone ? Math.sin(2 * Math.PI * f * t) : (t >= 0 && t < 0.0003 ? Math.sin(Math.PI * t / 0.0003) : 0));
        for (const [gain, dd, cl, yy] of [[gl, dl, colL, wy + wh * 0.33], [gr, dr, colR, wy + wh * 0.75]]) {
          D.line(g, wx, yy, wx + ww, yy, C.grid, 1);
          g.beginPath();
          for (let i = 0; i <= 200; i++) { const t = t0 + span * i / 200, v = sig(t - dd) * gain; const px = wx + ww * i / 200, py = yy - v * wh * 0.17; i ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = cl; g.lineWidth = 1.6; g.stroke();
        }
        D.text(g, Lg('왼쪽 귀', 'Left ear'), wx + 4, wy + wh * 0.33 - wh * 0.17 - 2, { size: 9, color: colL });
        D.text(g, Lg('오른쪽 귀', 'Right ear'), wx + 4, wy + wh * 0.75 - wh * 0.17 - 2, { size: 9, color: colR });
        D.text(g, `${(span * 1000).toFixed(2)} ms`, wx + ww - 4, wy + wh - 14, { size: 9, color: C.dim, align: 'right' });
        // 아래: 방향에 따른 ITD, ILD 곡선
        const gy = wy + wh + 14, gh = H - gy - pad, gx = pad, gw = W - pad * 2;
        D.rect(g, gx, gy, gw, gh, 'rgba(0,0,0,0.35)');
        const azX = (a) => gx + gw * (a + 180) / 360;
        for (const a of [-180, -90, 0, 90, 180]) { D.line(g, azX(a), gy, azX(a), gy + gh, C.grid, 1); D.text(g, a + '°', azX(a) + 2, gy + gh - 12, { size: 9, color: C.dim }); }
        const plot = (fn, maxV, cl, on) => {
          g.beginPath();
          for (let i = 0; i <= 180; i++) { const a = -180 + i * 2, v = fn(a) / maxV; const px = azX(a), py = gy + gh - 16 - v * (gh - 34); i ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = cl; g.lineWidth = on ? 2 : 1; g.setLineDash(on ? [] : [4, 3]); g.stroke(); g.setLineDash([]);
        };
        const itdOf = (a) => { const ct = cues(a); return ct.itd; };
        const ildOf = (a) => P.ildMax * Math.abs(Math.sin(a * Math.PI / 180));
        const itdMax = (P.radius / 100 / CS) * (Math.PI / 2 + 1);
        plot(itdOf, itdMax, C.good, P.cue !== 'ild');
        plot(ildOf, Math.max(1, P.ildMax), C.warn, P.cue !== 'itd');
        D.line(g, azX(az), gy, azX(az), gy + gh, col, 1.5);
        D.text(g, Lg('초록 = |ITD|, 노랑 = |ILD| (실선 = 이 뷰에서 사용)', 'Green = |ITD|, yellow = |ILD| (solid = used in this view)'), gx + 4, gy + 3, { size: 10, color: C.dim });
        ctx.stat(Lg('방향', 'Direction'), `${az.toFixed(0)}°`);
        ctx.stat('ITD', `${(c.itd * 1e6).toFixed(0)} µs` + (P.cue === 'ild' ? Lg(' (사용 안 함)', ' (not used)') : ''));
        ctx.stat('ILD', `${c.ild.toFixed(1)} dB` + (P.cue === 'itd' ? Lg(' (사용 안 함)', ' (not used)') : ''));
        if (tone) {
          const deg = c.itd * f * 360;
          ctx.stat(Lg('톤의 위상 차이', 'Tone phase difference'), `${deg.toFixed(0)}°` + (deg > 180 ? Lg(' (모호함)', ' (ambiguous)') : ''));
        }
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
