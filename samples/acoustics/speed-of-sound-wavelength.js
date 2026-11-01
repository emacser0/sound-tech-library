// 음속과 파장: λ = c / f. 20Hz는 17m, 20kHz는 1.7cm. 온도와 매질에 따른 음속
GTL.register({
  id: 'speed-of-sound-wavelength',
  title: '음속과 파장',
  summary: '소리는 공기 중에서 약 343m/s로 퍼짐. 파장은 음속을 주파수로 나눈 값이라서, 가장 낮은 저음(20Hz)은 17m, 가장 높은 고음(20kHz)은 1.7cm. 이 1000배 차이가 음향의 많은 현상을 설명함.',
  single: true,
  controls: '파라미터 표에서 주파수, 온도, 매질을 바꿈. "소리 켜기"를 누르면 그 주파수의 사인파가 들림.',
  info: `
    <p>소리는 공기 분자가 서로 밀고 당기며 전해지는 압력의 파동. 빽빽한 곳(압축)과 성긴 곳(팽창)이 번갈아 이동함. 한 번 압축에서 다음 압축까지의 거리가 <b>파장(λ)</b>.</p>
    <p><b>λ = c / f</b>. 공기 중 음속은 온도에 따라 c ≈ 331.3 √(1 + T/273.15) m/s. 20°C에서 약 343m/s. 습도의 영향은 작음.</p>
    <ul>
      <li><b>물체보다 파장이 길면</b> 소리가 물체를 돌아서 감(회절). 저음은 벽 모서리를 돌아 들리고, 흡음재로 막기 어려움.</li>
      <li><b>물체보다 파장이 짧으면</b> 물체가 그림자를 만듦. 머리(약 18cm)보다 짧은 고음은 반대쪽 귀에 작게 들려 방향 판단 단서가 됨.</li>
      <li>방 크기와 비슷한 저음 파장은 정상파(룸 모드)를 만듦</li>
      <li>1ms에 약 34cm 이동. 마이크 사이 거리, 스피커 정렬, 딜레이 보정의 기준.</li>
    </ul>
    <p>물 속에서는 약 1480m/s, 강철에서는 약 5900m/s(종파). 매질이 단단할수록 빠름.</p>`,
  diagram: (L) => {
    let d = '';
    for (let i = 0; i <= 200; i++) { const x = 30 + i * 2.4, y = 70 - 30 * Math.sin((i / 200) * 2.5 * 2 * Math.PI); d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
    let dots = '';
    for (let i = 0; i < 60; i++) { const x0 = 30 + i * 8; const x = x0 + 5 * Math.cos((x0 - 30) / 480 * 2.5 * 2 * Math.PI); dots += `<circle cx="${x.toFixed(1)}" cy="140" r="2" class="f-b"/><circle cx="${x.toFixed(1)}" cy="152" r="2" class="f-b"/>`; }
    return `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <line x1="30" y1="70" x2="510" y2="70" class="d-dim"/>
    <path d="${d}" class="d-b"/>
    <line x1="${30 + 480 / 2.5 * 0.25}" y1="26" x2="${30 + 480 / 2.5 * 1.25}" y2="26" class="d-accent" marker-start="url(#arr)" marker-end="url(#arr)"/>
    <text x="${30 + 480 / 2.5 * 0.75}" y="18" text-anchor="middle" class="t-small">${L('파장 λ = c / f', 'Wavelength λ = c / f')}</text>
    <text x="510" y="112" text-anchor="end" class="t-small t-dim">${L('위: 압력, 아래: 공기 입자 (빽빽 = 압축)', 'Top: pressure, bottom: air particles (dense = compression)')}</text>
    ${dots}
    <text x="30" y="180" class="t-small t-mono">20 Hz → 17 m</text>
    <text x="210" y="180" class="t-small t-mono">1 kHz → 34 cm</text>
    <text x="400" y="180" class="t-small t-mono">20 kHz → 1.7 cm</text>
  </svg>`;
  },
  look: [
    '주파수를 낮추면 위쪽 그림의 압축 간격이 넓어지고 파장 측정값이 길어짐',
    '아래 막대에서 파장 표시가 "머리 폭"보다 왼쪽(짧음)이면 머리가 소리 그림자를 만드는 주파수',
    '온도를 -20°C로 낮추면 음속이 약 319m/s로 느려지고 같은 주파수의 파장이 짧아짐',
    '매질을 물로 바꾸면 파장이 약 4.3배 길어짐',
  ],
  refs: [
    { type: 'book', title: 'Thomas D. Rossing, F. Richard Moore, Paul A. Wheeler, The Science of Sound (3rd ed.)', year: 2002, note: '음파, 음속, 파장' },
    { type: 'book', title: 'F. Alton Everest, Ken C. Pohlmann, Master Handbook of Acoustics', note: '파장과 회절, 온도에 따른 음속' },
    { type: 'book', title: 'Lawrence E. Kinsler, Austin R. Frey, Alan B. Coppens, James V. Sanders, Fundamentals of Acoustics (4th ed.)', year: 2000, note: '기체, 액체, 고체의 음속' },
  ],
  params: [
    { key: 'note', label: '주파수 (MIDI 노트)', type: 'int', min: 16, max: 135, default: 69, group: '소리', help: '16 = 20.6Hz, 69 = 440Hz, 135 = 19.9kHz' },
    { key: 'temp', label: '공기 온도 (°C)', type: 'range', min: -20, max: 40, step: 1, default: 20, group: '매질', when: (p) => p.medium === 'air' },
    { key: 'medium', label: '매질', type: 'select', options: [{ value: 'air', label: '공기' }, { value: 'water', label: '물 (약 1481m/s)' }, { value: 'steel', label: '강철 (약 5960m/s)' }], default: 'air', group: '매질' },
    ...GTL.audio.params({ single: true }),
  ],
  en: {
    title: 'Speed of Sound and Wavelength',
    summary: 'Sound travels through air at about 343 m/s. Wavelength is the speed divided by the frequency, so the lowest bass (20 Hz) is 17 m long and the highest treble (20 kHz) is 1.7 cm. This 1000x range explains many acoustic effects.',
    controls: 'Change the frequency, temperature and medium in the parameter table. Press "Sound on" to hear a sine wave at that frequency.',
    info: `
    <p>Sound is a pressure wave that air molecules pass along by pushing and pulling each other. Dense areas (compression) and thin areas (rarefaction) move along in turn. The distance from one compression to the next is the <b>wavelength (λ)</b>.</p>
    <p><b>λ = c / f</b>. The speed of sound in air depends on temperature: c ≈ 331.3 √(1 + T/273.15) m/s. At 20°C it is about 343 m/s. Humidity has only a small effect.</p>
    <ul>
      <li><b>If the wavelength is longer than an object</b>, sound bends around it (diffraction). Bass goes around wall corners and is hard to block with absorbers.</li>
      <li><b>If the wavelength is shorter than an object</b>, the object casts a shadow. Treble shorter than the head (about 18 cm) is quieter at the far ear, which is a cue for direction.</li>
      <li>Bass wavelengths about the size of a room create standing waves (room modes).</li>
      <li>Sound moves about 34 cm in 1 ms. This is the basis for mic spacing, speaker alignment and delay compensation.</li>
    </ul>
    <p>In water it is about 1480 m/s, in steel about 5900 m/s (longitudinal waves). Stiffer media are faster.</p>`,
    look: [
      'Lower the frequency. The compressions in the top picture spread apart and the wavelength stat gets longer.',
      'In the bottom bar, if the wavelength mark is left of (shorter than) "Head width", the head casts a sound shadow at that frequency.',
      'Lower the temperature to -20°C. The speed drops to about 319 m/s and the wavelength gets shorter.',
      'Switch the medium to water. The wavelength becomes about 4.3 times longer.',
    ],
    refs: ['Sound waves, speed of sound and wavelength.', 'Wavelength, diffraction and speed vs temperature.', 'Speed of sound in gases, liquids and solids.'],
    params: {
      note: { label: 'Frequency (MIDI note)', group: 'Sound', help: '16 = 20.6 Hz, 69 = 440 Hz, 135 = 19.9 kHz' },
      temp: { label: 'Air temperature (°C)', group: 'Medium' },
      medium: { label: 'Medium', group: 'Medium', options: { air: 'Air', water: 'Water (about 1481 m/s)', steel: 'Steel (about 5960 m/s)' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    let t = 0;
    const speed = () => (P.medium === 'water' ? 1481 : P.medium === 'steel' ? 5960 : 331.3 * Math.sqrt(1 + P.temp / 273.15));
    const fmtLen = (m) => (m >= 1 ? m.toFixed(2) + ' m' : m >= 0.01 ? (m * 100).toFixed(1) + ' cm' : (m * 1000).toFixed(1) + ' mm');

    const live = { ph: 0, f: A.mtof(P.note) };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(30, sr), ft = Math.min(A.mtof(P.note), sr * 0.45);
        for (let i = 0; i < n; i++) {
          live.f += (ft - live.f) * k;
          live.ph += live.f / sr; if (live.ph >= 1) live.ph -= 1;
          const v = Math.sin(U.TAU * live.ph) * 0.3; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update(dt) { t += dt; snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const f = A.mtof(P.note), c = speed(), lam = c / f;
        // 1) 진행파 (화면 폭 = 파장 3개)
        const th = Math.max(80, H * 0.48), tw = W - pad * 2, span = lam * 3;
        D.rect(g, pad, pad, tw, th, 'rgba(0,0,0,0.35)');
        const phase = (t * 0.5) % 1;               // 슬로모션: 2초에 한 파장
        const pm = pad + th * 0.3, pa = th * 0.18;
        g.beginPath();
        for (let i = 0; i <= 300; i++) { const x = i / 300, y = pm - Math.cos(U.TAU * (x * 3 - phase)) * pa; i ? g.lineTo(pad + x * tw, y) : g.moveTo(pad + x * tw, y); }
        g.strokeStyle = C.b; g.lineWidth = 2; g.stroke();
        D.line(g, pad, pm, pad + tw, pm, C.grid, 1);
        // 입자
        const cols = 90, rows = 5, dy = (th * 0.36) / rows, y0 = pad + th * 0.55;
        for (let i = 0; i < cols; i++) {
          const x0 = (i + 0.5) / cols;
          const dx = -Math.sin(U.TAU * (x0 * 3 - phase)) * (0.35 / cols);
          for (let j = 0; j < rows; j++) D.circle(g, pad + (x0 + dx) * tw, y0 + (j + 0.5) * dy, 1.8, C.b);
        }
        // 파장 자
        const lx0 = pad + (phase / 3) * tw, lx1 = lx0 + tw / 3, ly = pad + th - 12;
        D.line(g, lx0, ly, lx1, ly, C.accent, 2);
        D.line(g, lx0, ly - 5, lx0, ly + 5, C.accent, 2); D.line(g, lx1, ly - 5, lx1, ly + 5, C.accent, 2);
        D.text(g, 'λ = ' + fmtLen(lam), (lx0 + lx1) / 2, ly - 16, { size: 11, color: C.accent, align: 'center' });
        D.text(g, Lx(`화면 폭 = ${fmtLen(span)} (파장 3개), 슬로모션`, `View width = ${fmtLen(span)} (3 wavelengths), slow motion`), pad + 4, pad + 3, { size: 10, color: C.dim });

        // 2) 로그 자: 1cm ~ 30m (+ 물, 강철은 더 김)
        const ry = pad * 2 + th, rh = H - ry - pad;
        D.rect(g, pad, ry, tw, rh, 'rgba(0,0,0,0.35)');
        const LMIN = 0.005, LMAX = 100;
        const xOf = (m) => pad + 10 + (Math.log(m / LMIN) / Math.log(LMAX / LMIN)) * (tw - 20);
        const axisY = ry + rh * 0.62;
        D.line(g, xOf(LMIN), axisY, xOf(LMAX), axisY, C.text, 1);
        for (const m of [0.01, 0.1, 1, 10, 100]) { D.line(g, xOf(m), axisY - 4, xOf(m), axisY + 4, C.text, 1); D.text(g, fmtLen(m), xOf(m), axisY + 6, { size: 9, color: C.dim, align: 'center' }); }
        const refsL = [
          [0.18, Lx('머리 폭', 'Head width')],
          [0.3, Lx('우퍼 콘', 'Woofer cone')],
          [1.7, Lx('사람 키', 'Person')],
          [5, Lx('방 길이', 'Room length')],
          [17, Lx('20Hz 파장', '20 Hz wave')],
        ];
        refsL.forEach(([m, name], i) => {
          const x = xOf(m), yy = ry + 16 + (i % 2) * 14;
          D.line(g, x, yy + 12, x, axisY, 'rgba(255,255,255,0.25)', 1);
          D.text(g, name, x, yy, { size: 9, color: C.dim, align: 'center' });
        });
        const xl = xOf(U.clamp(lam, LMIN, LMAX));
        D.line(g, xl, ry + 12, xl, axisY + 18, C.warn, 2);
        D.circle(g, xl, axisY, 5, C.warn);
        D.text(g, Lx('파장 비교 (로그 축)', 'Wavelength compared (log axis)'), pad + 4, ry + 3, { size: 10, color: C.dim });

        ctx.stat(Lx('주파수', 'Frequency'), (f >= 1000 ? (f / 1000).toFixed(2) + ' kHz' : f.toFixed(1) + ' Hz') + ` (${A.noteName(P.note)})`);
        ctx.stat(Lx('음속', 'Speed of sound'), c.toFixed(1) + ' m/s');
        ctx.stat(Lx('파장', 'Wavelength'), fmtLen(lam));
        ctx.stat(Lx('1ms 동안 이동 거리', 'Distance in 1 ms'), fmtLen(c / 1000));
        ctx.stat(Lx('1m 이동 시간', 'Time to travel 1 m'), (1000 / c).toFixed(3) + ' ms');
        ctx.stat(Lx('머리보다', 'Compared to the head'), lam < 0.18 ? Lx('짧음 (그림자 생김)', 'shorter (casts a shadow)') : Lx('김 (돌아서 감)', 'longer (bends around)'));
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
