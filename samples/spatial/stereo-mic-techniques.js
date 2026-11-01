// 스테레오 마이킹: XY(레벨 차이만) vs AB(시간 차이만) vs ORTF(둘 다)
GTL.register({
  id: 'stereo-mic-techniques',
  title: '스테레오 마이킹 기법 (XY, AB, ORTF)',
  summary: '마이크 두 대로 스테레오를 녹음하는 방식에 따라 좌우 정보가 다름. XY는 같은 점에서 각도만 벌려 레벨 차이만, AB는 간격을 벌려 시간 차이만 만듦. ORTF는 둘을 섞음.',
  views: { a: 'XY (카디오이드 ±45°)', b: 'AB (무지향 60cm)' },
  controls: '파라미터 표에서 음원 각도를 바꾸거나 자동 이동을 켬. 스피커나 헤드폰으로 들음.',
  info: `
    <p>스테레오 녹음은 두 채널 사이의 <b>레벨 차이(ICLD)</b>와 <b>시간 차이(ICTD)</b>로 소리의 좌우 위치를 담음. 스피커로 틀면 이 차이가 두 스피커 사이의 상 위치가 됨.</p>
    <ul>
      <li><b>XY (동축, Coincident)</b>: 카디오이드 두 대를 한 점에 겹쳐 ±45° 정도로 벌림. 시간 차이가 0이라 모노로 합쳐도 깨끗함. 넓이감은 약함.</li>
      <li><b>블럼라인(Blumlein)</b>: 8자 두 대를 ±45°로 겹침. 레벨 차이가 크고 방 반사도 많이 담음.</li>
      <li><b>AB (간격, Spaced)</b>: 무지향 두 대를 수십 cm~수 m 떨어뜨림. 시간 차이만 있음. 공간감이 크지만 상이 흐리고 모노 합에 콤 필터가 생김.</li>
      <li><b>ORTF (준동축, Near-coincident)</b>: 카디오이드 두 대를 17cm 간격, ±55°로 둠. 사람 귀와 비슷하게 레벨과 시간 차이를 함께 씀.</li>
    </ul>
    <p>평면파 근사에서 시간 차이는 <code>Δt = d sin θ / c</code>, 레벨 차이는 두 마이크 패턴 감도의 비. <b>녹음 각도(SRA, Stereo Recording Angle)</b>는 상이 스피커 끝에 닿는 음원 각도의 두 배.</p>
    <p>이 샘플의 "상 위치"는 약 18dB 또는 약 1.1ms에서 스피커 끝에 닿는다고 보고 두 단서를 더한 설명용 근사. 실무에서는 Williams 곡선 같은 측정 기반 표를 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <text x="90" y="16" text-anchor="middle" class="t-a">XY</text>
    <path d="M90,100 L60,60" class="d-a"/><path d="M90,100 L120,60" class="d-a"/>
    <circle cx="90" cy="100" r="5" class="f-a"/>
    <text x="90" y="128" text-anchor="middle" class="t-small">${L('같은 점, 각도 ±45°', 'same point, ±45°')}</text>
    <text x="90" y="144" text-anchor="middle" class="t-small t-dim">${L('레벨 차이만', 'level difference only')}</text>
    <text x="270" y="16" text-anchor="middle" class="t-b">AB</text>
    <circle cx="220" cy="80" r="6" class="f-b"/><circle cx="320" cy="80" r="6" class="f-b"/>
    <line x1="220" y1="96" x2="320" y2="96" class="d-line"/><text x="270" y="110" text-anchor="middle" class="t-small">d</text>
    <text x="270" y="128" text-anchor="middle" class="t-small">${L('무지향, 간격 d', 'omnis, spacing d')}</text>
    <text x="270" y="144" text-anchor="middle" class="t-small t-dim">${L('시간 차이만', 'time difference only')}</text>
    <text x="450" y="16" text-anchor="middle">ORTF</text>
    <path d="M432,100 L400,64" class="d-accent"/><path d="M468,100 L500,64" class="d-accent"/>
    <circle cx="432" cy="100" r="5" class="f-accent"/><circle cx="468" cy="100" r="5" class="f-accent"/>
    <text x="450" y="128" text-anchor="middle" class="t-small">${L('17cm, ±55°', '17 cm, ±55°')}</text>
    <text x="450" y="144" text-anchor="middle" class="t-small t-dim">${L('레벨 + 시간 차이', 'level + time difference')}</text>
  </svg>`,
  look: [
    '음원 각도를 40°로 두면 A는 ICTD가 0이고 ICLD만 있음. B는 ICLD가 0이고 ICTD만 있음.',
    '자동 이동을 켜고 들으면 A는 상이 또렷하게 움직임. B는 넓게 퍼지며 움직임.',
    'B의 간격을 2m로 늘리면 ICTD 곡선이 금방 1.1ms를 넘어 상이 가운데에서 바로 양 끝으로 벌어짐(가운데 구멍)',
    '기법을 ORTF로 바꾸면 두 곡선이 모두 움직이고 녹음 각도가 XY보다 좁아짐',
  ],
  refs: [
    { type: 'book', title: 'Bruce Bartlett, Stereo Microphone Techniques, Focal Press', year: 1991, note: 'XY, AB, ORTF, 블럼라인 비교' },
    { type: 'paper', title: 'Michael Williams, "Unified Theory of Microphone Systems for Stereophonic Sound Recording", AES 82nd Convention, preprint 2466', year: 1987, note: '간격과 각도에 따른 녹음 각도 곡선 (Williams 곡선)' },
    { type: 'article', title: 'A. D. Blumlein, British Patent 394,325, "Improvements in and relating to Sound-transmission, Sound-recording and Sound-reproducing Systems"', year: 1931, note: '동축 스테레오 마이킹의 출발점' },
    { type: 'book', title: 'John Eargle, The Microphone Book (2nd Edition), Focal Press', year: 2004, note: '스테레오 마이크 기법 장' },
  ],
  params: [
    { key: 'tech', label: '기법', type: 'select', options: [{ value: 'xy', label: 'XY (카디오이드 ±45°)' }, { value: 'blumlein', label: '블럼라인 (8자 ±45°)' }, { value: 'ab', label: 'AB (무지향 간격)' }, { value: 'ortf', label: 'ORTF (카디오이드 17cm ±55°)' }], a: 'xy', b: 'ab', group: '마이크' },
    { key: 'spacing', label: 'AB 간격 (m)', type: 'range', min: 0.1, max: 3, step: 0.05, default: 0.6, when: (p) => p.tech === 'ab' },
    { key: 'az', label: '음원 각도 (°)', type: 'range', min: -90, max: 90, step: 1, default: 40, shared: true, group: '장면', help: '0 = 정면, + = 오른쪽' },
    { key: 'sweep', label: '자동 이동', type: 'bool', default: false, shared: true },
    { key: 'src', label: '음원', type: 'select', options: [{ value: 'click', label: '캐스터네츠풍 클릭' }, { value: 'pluck', label: '뜯는 음' }], default: 'click', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Stereo Microphone Techniques (XY, AB, ORTF)',
    summary: 'How you set up two microphones decides what left/right information you record. XY angles two mics at the same point and records only level differences. AB spaces them apart and records only time differences. ORTF mixes both.',
    views: { a: 'XY (cardioids ±45°)', b: 'AB (omnis 60 cm)' },
    controls: 'Change the source angle in the parameter table or turn on auto move. Use speakers or headphones.',
    info: `
    <p>A stereo recording stores left/right position as the <b>level difference (ICLD)</b> and <b>time difference (ICTD)</b> between the two channels. Played on speakers, these differences become the image position between the speakers.</p>
    <ul>
      <li><b>XY (coincident)</b>: two cardioids at one point, angled about ±45 degrees. No time difference, so the mono sum is clean. The sense of width is weaker.</li>
      <li><b>Blumlein</b>: two figure-8 mics at ±45 degrees at one point. Large level differences, and it records a lot of room sound.</li>
      <li><b>AB (spaced)</b>: two omnis tens of cm to a few m apart. Only time differences. Big sense of space, but a blurry image and a comb filter in the mono sum.</li>
      <li><b>ORTF (near-coincident)</b>: two cardioids 17 cm apart at ±55 degrees. Like human ears, it uses both level and time differences.</li>
    </ul>
    <p>With a plane wave, the time difference is <code>Δt = d sin θ / c</code> and the level difference is the ratio of the two pattern sensitivities. The <b>Stereo Recording Angle (SRA)</b> is twice the source angle at which the image reaches the speaker.</p>
    <p>The "image position" here is a teaching model that adds the two cues, assuming the image reaches the speaker at about 18 dB or about 1.1 ms. In practice people use measured tables such as the Williams curves.</p>`,
    look: [
      'Set the source to 40 degrees. A has ICTD 0 and only ICLD. B has ICLD 0 and only ICTD.',
      'Turn on auto move and listen. A\'s image moves sharply. B moves but feels wide and spread.',
      'Increase B\'s spacing to 2 m. The ICTD curve passes 1.1 ms quickly and the image jumps from the middle to the sides (hole in the middle).',
      'Switch the technique to ORTF. Both curves move, and the recording angle gets narrower than XY.',
    ],
    refs: ['Compares XY, AB, ORTF and Blumlein.', 'Recording angle curves by spacing and angle (Williams curves).', 'The origin of coincident stereo miking.', 'Chapter on stereo microphone techniques.'],
    params: {
      tech: { label: 'Technique', group: 'Microphones', options: { xy: 'XY (cardioids ±45°)', blumlein: 'Blumlein (figure-8 ±45°)', ab: 'AB (spaced omnis)', ortf: 'ORTF (cardioids 17 cm ±55°)' } },
      spacing: 'AB spacing (m)',
      az: { label: 'Source angle (°)', group: 'Scene', help: '0 = front, + = right' },
      sweep: 'Auto move',
      src: { label: 'Source', options: { click: 'Castanet-like click', pluck: 'Plucked note' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b, RAD = Math.PI / 180, CS = 343;
    const TECH = {
      xy: { pat: 0.5, ang: 45, d: 0 }, blumlein: { pat: 0, ang: 45, d: 0 },
      ab: { pat: 1, ang: 0, d: null }, ortf: { pat: 0.5, ang: 55, d: 0.17 },
    };
    let sweepT = 0;
    const azNow = () => (P.sweep ? 85 * Math.sin(sweepT * 0.5) : P.az);
    // 음원 각도 → { gl, gr, icld(dB), ictd(초, + = 오른쪽이 먼저), tl, tr }
    function capture(az) {
      const T = TECH[P.tech], d = T.d === null ? P.spacing : T.d, a = T.pat;
      const gl = a + (1 - a) * Math.cos((az + T.ang) * RAD), gr = a + (1 - a) * Math.cos((az - T.ang) * RAD);
      const dt = d * Math.sin(az * RAD) / CS; // 왼쪽 마이크가 늦는 시간
      const tl = Math.max(0, dt), tr = Math.max(0, -dt);
      return { gl, gr, icld: A.linToDb(gr) - A.linToDb(gl), ictd: dt, tl, tr };
    }
    // 설명용 상 위치 (-1 왼쪽 ~ 1 오른쪽)
    const image = (c) => U.clamp(U.clamp(c.icld, -40, 40) / 18 + c.ictd / 0.0011, -1, 1);
    // 녹음 각도: 상이 처음 끝에 닿는 음원 각도 x 2
    function sra() { for (let a = 0; a <= 90; a += 0.5) if (Math.abs(image(capture(a))) >= 0.999) return 2 * a; return null; }

    const noise = A.noiseBuffer(1 << 16, 31);
    let tS = 0, ph = 0;
    function source(sr) {
      const t = tS; tS += 1 / sr;
      if (P.src === 'click') { const tt = t % 0.18, k = Math.floor(t / 0.18) % 6; if (k === 3) return 0; return noise[Math.floor(t * sr) & 0xffff] * Math.exp(-tt / 0.006) * 0.9; }
      const tt = t % 0.5, f = 247; ph += f / sr; if (ph >= 1) ph -= 1;
      return ((2 * ph - 1) * 0.6 + A.wave.sine(ph * 2) * 0.4) * Math.exp(-tt / 0.15) * Math.min(1, tt / 0.002) * 0.7;
    }
    const M = 1023, buf = new Float32Array(M + 1);
    let w = 0;
    const st = { gl: 0.7, gr: 0.7, tl: 0, tr: 0 };
    const readD = (d) => { const p = w - 1 - d, i0 = Math.floor(p), fr = p - i0; return buf[i0 & M] * (1 - fr) + buf[(i0 + 1) & M] * fr; };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const c = capture(azNow()), k = 0.002;
        for (let i = 0; i < n; i++) {
          buf[w] = source(sr); w = (w + 1) & M;
          st.gl += (c.gl - st.gl) * k; st.gr += (c.gr - st.gr) * k; st.tl += (c.tl * sr - st.tl) * k; st.tr += (c.tr * sr - st.tr) * k;
          l[i] = readD(st.tl) * st.gl * 0.5; r[i] = readD(st.tr) * st.gr * 0.5;
        }
      },
    });

    let ck = '', cv = null;
    function curves() {
      const k = P.tech + P.spacing;
      if (k !== ck) { ck = k; cv = []; for (let a = -90; a <= 90; a += 1) { const c = capture(a); cv.push({ a, icld: c.icld, ictd: c.ictd, img: image(c) }); } }
      return cv;
    }

    return {
      update(dt) { if (P.sweep) sweepT += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const az = azNow(), c = capture(az), T = TECH[P.tech], d = T.d === null ? P.spacing : T.d;
        // 위: 마이크 배치와 음원 (위에서 봄)
        const topH = Math.max(110, H * 0.38), cx = W / 2, cy = pad + topH - 20, R = topH - 40;
        D.rect(g, pad, pad, W - pad * 2, topH, 'rgba(0,0,0,0.35)');
        g.beginPath(); g.arc(cx, cy, R, Math.PI, 2 * Math.PI); g.strokeStyle = C.grid; g.lineWidth = 1; g.stroke();
        const sep = Math.min(W * 0.3, d * 90 + (d > 0 ? 6 : 0));
        const mics = [[-1, cx - sep / 2, -T.ang], [1, cx + sep / 2, T.ang]];
        for (const [sgn, mx, ang] of mics) {
          // 패턴 모양
          g.beginPath();
          for (let i = 0; i <= 72; i++) { const th = i * 5 * RAD, v = Math.abs(T.pat + (1 - T.pat) * Math.cos(th)) * 26; const px = mx + Math.sin(th + ang * RAD) * v, py = cy - Math.cos(th + ang * RAD) * v; i ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = sgn < 0 ? C.warn : C.accent; g.lineWidth = 1.2; g.stroke();
          D.circle(g, mx, cy, 4, sgn < 0 ? C.warn : C.accent);
        }
        const sx = cx + Math.sin(az * RAD) * R, sy = cy - Math.cos(az * RAD) * R;
        D.circle(g, sx, sy, 7, col);
        D.text(g, Lg('노랑 = L 마이크, 보라 = R 마이크', 'Yellow = L mic, purple = R mic'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 스피커 사이 상 위치 막대
        const im = image(c), by = pad + topH + 8, bw = W - pad * 2;
        D.rect(g, pad, by, bw, 16, 'rgba(0,0,0,0.35)');
        D.text(g, 'L', pad + 4, by + 2, { size: 10, color: C.warn }); D.text(g, 'R', pad + bw - 12, by + 2, { size: 10, color: C.accent });
        D.circle(g, pad + bw / 2 + im * (bw / 2 - 20), by + 8, 6, col);
        // 아래: ICLD, ICTD, 상 위치 곡선
        const gy = by + 24, gh = H - gy - pad;
        if (gh > 50) {
          const cvs = curves(), gw = W - pad * 2, aX = (a) => pad + gw * (a + 90) / 180, mid = gy + gh / 2, sc = (gh - 24) / 2;
          D.rect(g, pad, gy, gw, gh, 'rgba(0,0,0,0.35)');
          D.line(g, pad, mid, pad + gw, mid, C.grid, 1);
          for (const a of [-90, -45, 0, 45, 90]) { D.line(g, aX(a), gy, aX(a), gy + gh, C.grid, 1); D.text(g, a + '°', aX(a) + 2, gy + gh - 12, { size: 9, color: C.dim }); }
          const plot = (fn, colr, lw) => { g.beginPath(); cvs.forEach((p, i) => { const y = mid - U.clamp(fn(p), -1.1, 1.1) * sc; i ? g.lineTo(aX(p.a), y) : g.moveTo(aX(p.a), y); }); g.strokeStyle = colr; g.lineWidth = lw; g.stroke(); };
          plot((p) => p.icld / 18, C.warn, 1.5);
          plot((p) => p.ictd / 0.0011, C.good, 1.5);
          plot((p) => p.img, col, 2.5);
          D.line(g, aX(az), gy, aX(az), gy + gh, C.text, 1);
          D.text(g, Lg('노랑 = ICLD (±18dB), 초록 = ICTD (±1.1ms), 굵은 선 = 상 위치', 'Yellow = ICLD (±18 dB), green = ICTD (±1.1 ms), thick = image'), pad + 4, gy + 3, { size: 10, color: C.dim });
        }
        const s = sra();
        ctx.stat('ICLD', `${c.icld.toFixed(1)} dB`);
        ctx.stat('ICTD', `${(c.ictd * 1000).toFixed(2)} ms`);
        ctx.stat(Lg('상 위치', 'Image position'), `${(im * 100).toFixed(0)}%`);
        ctx.stat(Lg('녹음 각도 (근사)', 'Recording angle (approx)'), s === null ? Lg('180° 초과', 'over 180°') : `${s.toFixed(0)}°`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
