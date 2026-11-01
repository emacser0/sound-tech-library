// 마이크 지향성 패턴: 무지향 vs 카디오이드 등 1차 지향성 (A + B cos θ)
(function () {
  const PAT = { omni: 1, subcard: 0.7, card: 0.5, supercard: 0.37, hypercard: 0.25, fig8: 0 };
  // 도식용 작은 극좌표 모양 (선형 크기)
  const shape = (a, cx, cy, r) => {
    let d = '';
    for (let i = 0; i <= 72; i++) {
      const th = i * Math.PI * 2 / 72, v = Math.abs(a + (1 - a) * Math.cos(th));
      d += (i ? 'L' : 'M') + (cx + Math.sin(th) * v * r).toFixed(1) + ',' + (cy - Math.cos(th) * v * r).toFixed(1);
    }
    return d;
  };

  GTL.register({
    id: 'mic-polar-patterns',
    title: '마이크 지향성 패턴',
    summary: '무지향 마이크는 모든 방향을 같은 크기로 받음. 카디오이드는 뒤쪽 소리를 거의 받지 않아서, 뒤에서 나는 잡음을 말소리보다 훨씬 작게 담음. 모든 1차 패턴은 무지향과 8자 성분을 섞은 A + B cos θ.',
    views: { a: '무지향 (Omni)', b: '카디오이드 (Cardioid)' },
    controls: '파라미터 표에서 잡음 방향과 마이크 방향을 바꿈. 위쪽(0°)에 말하는 사람이 있음.',
    info: `
      <p>마이크의 <b>지향성 패턴(Polar Pattern)</b>은 방향별 감도. 1차 패턴은 모두 무지향(압력)과 8자(압력 경도) 성분의 합 <code>g(θ) = A + B cos θ</code> (A + B = 1).</p>
      <ul>
        <li><b>무지향(Omni)</b> A=1: 모든 방향 같음. 저음이 자연스럽고 근접 효과가 없음.</li>
        <li><b>카디오이드(Cardioid)</b> A=0.5: 뒤(180°)에서 0. 무대 보컬, 방송에서 가장 흔함.</li>
        <li><b>슈퍼카디오이드</b> A=0.37, <b>하이퍼카디오이드</b> A=0.25: 옆을 더 줄이고 뒤에 작은 역상 로브가 생김</li>
        <li><b>8자(Figure-8)</b> A=0: 앞뒤만 받고 옆(90°)은 0. 뒤쪽은 극성이 반대.</li>
      </ul>
      <p><b>지향 계수(DF, Directivity Factor)</b> <code>1 / (A² + B²/3)</code>: 정면 소리 대비 사방에서 오는 확산 잡음을 얼마나 덜 받는지. 카디오이드와 8자는 3(4.8dB), 하이퍼카디오이드는 4(6dB)로 가장 큼. 그래서 같은 잡음 비율을 얻는 거리가 무지향보다 √DF배 멀어짐(거리 계수).</p>
      <p>단점: 지향성 마이크는 가까이서 저음이 커지는 근접 효과(Proximity Effect)가 있고, 실제 패턴은 고음에서 좁아짐. 이 샘플은 주파수와 무관한 이상적인 패턴.</p>`,
    diagram: (L) => `<svg viewBox="0 0 540 150" xmlns="http://www.w3.org/2000/svg">
      ${[['omni', L('무지향', 'omni')], ['subcard', L('서브카디오이드', 'subcardioid')], ['card', L('카디오이드', 'cardioid')], ['supercard', L('슈퍼카디오이드', 'supercardioid')], ['hypercard', L('하이퍼카디오이드', 'hypercardioid')], ['fig8', L('8자', 'figure-8')]].map(([k, name], i) => {
        const cx = 45 + i * 90, cy = 62, a = PAT[k];
        return `<circle cx="${cx}" cy="${cy}" r="36" class="d-dim"/><path d="${shape(a, cx, cy, 36)}" class="${k === 'omni' ? 'd-a' : 'd-b'}"/><text x="${cx}" y="116" text-anchor="middle" class="t-small">${name}</text><text x="${cx}" y="130" text-anchor="middle" class="t-small t-mono t-dim">A=${a}</text>`;
      }).join('')}
      <text x="4" y="146" class="t-small t-dim">${L('위쪽이 마이크 정면. 모두 A + (1 - A) cos θ', 'Top is the mic front. All are A + (1 - A) cos θ')}</text>
    </svg>`,
    look: [
      '소리를 켜고 A와 B를 번갈아 들으면 B에서 뒤쪽(180°) 잡음이 거의 사라지고 말소리만 남음',
      '잡음 방향을 90°로 옮기면 B(카디오이드)는 잡음을 6dB만 줄임. 패턴을 8자로 바꾸면 잡음이 사라짐.',
      '잡음 방향을 110°로 두고 하이퍼카디오이드와 카디오이드를 비교하면 하이퍼카디오이드의 잡음이 더 작음. 180°에서는 반대.',
      '마이크 방향을 180°로 돌리면 B의 말소리가 크게 줄어듦. A는 그대로.',
    ],
    refs: [
      { type: 'book', title: 'John Eargle, The Microphone Book (2nd Edition), Focal Press', year: 2004, note: '1차 패턴, 지향 계수, 근접 효과' },
      { type: 'book', title: 'Harry F. Olson, Acoustical Engineering, Van Nostrand', year: 1957, note: '압력, 압력 경도 마이크의 원리' },
      { type: 'book', title: 'Bruce Bartlett, Jenny Bartlett, Practical Recording Techniques (7th Edition), Focal Press', year: 2016, note: '패턴 선택과 마이크 배치 실무' },
    ],
    params: [
      { key: 'pattern', label: '패턴', type: 'select', options: [{ value: 'omni', label: '무지향' }, { value: 'subcard', label: '서브카디오이드' }, { value: 'card', label: '카디오이드' }, { value: 'supercard', label: '슈퍼카디오이드' }, { value: 'hypercard', label: '하이퍼카디오이드' }, { value: 'fig8', label: '8자' }], a: 'omni', b: 'card', group: '마이크' },
      { key: 'aim', label: '마이크 방향 (°)', type: 'range', min: -180, max: 180, step: 1, default: 0, shared: true, help: '0 = 말하는 사람 쪽' },
      { key: 'noiseAz', label: '잡음 방향 (°)', type: 'range', min: -180, max: 180, step: 1, default: 180, shared: true, group: '장면' },
      { key: 'noiseDb', label: '잡음 레벨 (dB)', type: 'range', min: -24, max: 6, step: 1, default: 0, shared: true, help: '말소리 대비' },
      ...GTL.audio.params(),
    ],
    en: {
      title: 'Microphone Polar Patterns',
      summary: 'An omni microphone picks up every direction equally. A cardioid picks up almost nothing from the back, so noise behind it is recorded much quieter than the voice. Every first order pattern mixes an omni and a figure-8 component: A + B cos θ.',
      views: { a: 'Omni', b: 'Cardioid' },
      controls: 'Change the noise direction and mic direction in the parameter table. The talker is at the top (0 degrees).',
      info: `
      <p>A microphone's <b>polar pattern</b> is its sensitivity by direction. Every first order pattern is the sum of an omni (pressure) part and a figure-8 (pressure gradient) part: <code>g(θ) = A + B cos θ</code> (A + B = 1).</p>
      <ul>
        <li><b>Omni</b> A=1: the same in every direction. Natural bass and no proximity effect.</li>
        <li><b>Cardioid</b> A=0.5: zero at the back (180 degrees). The most common choice for stage vocals and broadcast.</li>
        <li><b>Supercardioid</b> A=0.37 and <b>hypercardioid</b> A=0.25: reject more from the sides, with a small reversed-polarity lobe at the back.</li>
        <li><b>Figure-8</b> A=0: picks up only front and back, zero at the sides (90 degrees). The back has reversed polarity.</li>
      </ul>
      <p><b>Directivity Factor (DF)</b> <code>1 / (A² + B²/3)</code>: how much less diffuse noise from all around is picked up, compared with sound from the front. Cardioid and figure-8 have 3 (4.8 dB) and hypercardioid has the highest, 4 (6 dB). So the same noise ratio is reached √DF times farther away than with an omni (distance factor).</p>
      <p>Downsides: directional mics have the proximity effect (more bass up close), and real patterns get narrower at high frequencies. This sample uses ideal patterns that do not change with frequency.</p>`,
      look: [
        'Turn on sound and switch between A and B. In B the noise from the back (180 degrees) almost disappears and only the voice remains.',
        'Move the noise to 90 degrees. B (cardioid) reduces it by only 6 dB. Switch the pattern to figure-8 and the noise disappears.',
        'Put the noise at 110 degrees and compare hypercardioid with cardioid. The hypercardioid picks up less noise. At 180 degrees it is the other way around.',
        'Turn the mic to 180 degrees. B\'s voice drops a lot. A stays the same.',
      ],
      refs: ['First order patterns, directivity factor and proximity effect.', 'How pressure and pressure gradient mics work.', 'Choosing patterns and placing mics in practice.'],
      params: {
        pattern: { label: 'Pattern', group: 'Microphone', options: { omni: 'Omni', subcard: 'Subcardioid', card: 'Cardioid', supercard: 'Supercardioid', hypercard: 'Hypercardioid', fig8: 'Figure-8' } },
        aim: { label: 'Mic direction (°)', help: '0 = toward the talker' },
        noiseAz: { label: 'Noise direction (°)', group: 'Scene' },
        noiseDb: { label: 'Noise level (dB)', help: 'Relative to the voice' },
        ...GTL.audio.enParams,
      },
    },

    setup(ctx) {
      const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lg = GTL.L;
      const col = ctx.side === 'a' ? C.a : C.b, RAD = Math.PI / 180;
      const gainAt = (deg) => { const a = PAT[P.pattern]; return a + (1 - a) * Math.cos((deg - P.aim) * RAD); };
      const df = () => { const a = PAT[P.pattern], b = 1 - a; return 1 / (a * a + b * b / 3); };

      // 소리: 말소리 비슷한 합성 모음 + 잡음원 (환풍기 같은 대역 잡음)
      const noise = A.noiseBuffer(1 << 17, 23);
      let f1 = null, f2 = null, f3 = null, nf = null, fsr = 0, tS = 0, glot = 0, sv = 1, sn = 1, lastSyl = -1;
      const VOW = [[730, 1090], [270, 2290], [530, 1840], [300, 870]];
      const snd = A.player(ctx, {
        process(l, r, sr, n) {
          if (fsr !== sr) { fsr = sr; f1 = A.biquad('bandpass', 700, 6, 0, sr); f2 = A.biquad('bandpass', 1200, 8, 0, sr); f3 = A.biquad('bandpass', 2600, 10, 0, sr); nf = A.biquad('bandpass', 900, 0.7, 0, sr); }
          const gvT = gainAt(0), gnT = gainAt(P.noiseAz) * A.dbToLin(P.noiseDb);
          for (let i = 0; i < n; i++) {
            const t = tS; tS += 1 / sr;
            // 음절마다 모음 바꿈
            const syl = Math.floor(t / 0.32), tt = t % 0.32, vw = VOW[syl % VOW.length];
            if (syl !== lastSyl) { lastSyl = syl; const c1 = A.biquad('bandpass', vw[0], 6, 0, sr), c2 = A.biquad('bandpass', vw[1], 8, 0, sr); Object.assign(f1, { b0: c1.b0, b1: c1.b1, b2: c1.b2, a1: c1.a1, a2: c1.a2 }); Object.assign(f2, { b0: c2.b0, b1: c2.b1, b2: c2.b2, a1: c2.a1, a2: c2.a2 }); }
            const pitch = 125 + 15 * Math.sin(t * 2.1);
            glot += pitch / sr; let p = 0; if (glot >= 1) { glot -= 1; p = 1; }
            const env = (syl % 5 === 4) ? 0 : Math.min(1, tt / 0.03, (0.3 - tt) / 0.04);
            const x = p * Math.max(0, env);
            const voice = (f1.process(x) * 4 + f2.process(x) * 3 + f3.process(x) * 1.5) * 1.6;
            const nz = nf.process(noise[Math.floor(t * sr) & 0x1ffff]) * 0.35;
            sv += (gvT - sv) * 0.002; sn += (gnT - sn) * 0.002;
            const v = voice * sv + nz * sn;
            l[i] = v * 0.9; r[i] = v * 0.9;
          }
        },
      });

      return {
        update() { snd.update(); },
        render() {
          const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
          const meterW = 90, R = Math.max(40, Math.min((W - meterW - pad * 3) / 2, (H - pad * 2) / 2) - 24), cx = pad + R + 24, cy = pad + R + 24;
          // dB 고리 (0, -6, -12, -18, -24)
          const rOf = (db) => R * U.clamp((db + 30) / 30, 0, 1);
          for (const db of [0, -6, -12, -18, -24]) { D.circle(g, cx, cy, rOf(db), null, C.grid, 1); D.text(g, db + '', cx + 2, cy - rOf(db) + 1, { size: 9, color: C.dim }); }
          for (let k = 0; k < 12; k++) { const a = k * 30 * RAD; D.line(g, cx, cy, cx + Math.sin(a) * R, cy - Math.cos(a) * R, C.grid, 1); }
          // 패턴 (dB 반지름). 음수 극성 구간은 빨강
          for (let i = 0; i <= 180; i++) {
            const d0 = (i - 1) * 2, d1 = i * 2; if (i === 0) continue;
            const v0 = gainAt(d0), v1 = gainAt(d1), neg = v1 < 0;
            const p0 = rOf(A.linToDb(v0)), p1 = rOf(A.linToDb(v1));
            D.line(g, cx + Math.sin(d0 * RAD) * p0, cy - Math.cos(d0 * RAD) * p0, cx + Math.sin(d1 * RAD) * p1, cy - Math.cos(d1 * RAD) * p1, neg ? C.bad : col, 2.2);
          }
          // 마이크 몸체
          const ma = P.aim * RAD;
          D.line(g, cx - Math.sin(ma) * 14, cy + Math.cos(ma) * 14, cx + Math.sin(ma) * 6, cy - Math.cos(ma) * 6, C.text, 5);
          // 말하는 사람과 잡음원
          D.circle(g, cx, cy - R - 12, 8, C.good);
          D.text(g, Lg('말소리', 'Voice'), cx + 12, cy - R - 18, { size: 10, color: C.good });
          const na = P.noiseAz * RAD, nx = cx + Math.sin(na) * (R + 12), ny = cy - Math.cos(na) * (R + 12);
          D.circle(g, nx, ny, 8, C.warn);
          D.text(g, Lg('잡음', 'Noise'), nx + 10, ny - 4, { size: 10, color: C.warn });
          // 오른쪽: 레벨 미터
          const vDb = A.linToDb(gainAt(0)), nDb = A.linToDb(gainAt(P.noiseAz)) + P.noiseDb;
          const mx = W - meterW - pad, mh = Math.min(H - pad * 2 - 40, 200);
          A.drawMeter(g, mx + 8, pad + 20, 22, mh, vDb, { minDb: -40, label: Lg('말소리', 'Voice'), color: C.good });
          A.drawMeter(g, mx + 52, pad + 20, 22, mh, nDb, { minDb: -40, label: Lg('잡음', 'Noise'), color: C.warn });
          D.text(g, Lg('받은 레벨', 'Picked up'), mx, pad + 3, { size: 10, color: C.dim });
          const snr = vDb - nDb;
          ctx.stat(Lg('말소리 감도', 'Voice sensitivity'), `${vDb.toFixed(1)} dB`);
          ctx.stat(Lg('잡음 감도', 'Noise sensitivity'), `${A.linToDb(gainAt(P.noiseAz)).toFixed(1)} dB` + (gainAt(P.noiseAz) < 0 ? Lg(' (역상)', ' (reversed)') : ''));
          ctx.stat(Lg('말소리 대 잡음', 'Voice to noise'), `${snr.toFixed(1)} dB`);
          ctx.stat(Lg('지향 계수 (DI)', 'Directivity (DI)'), `${df().toFixed(2)} (${(10 * Math.log10(df())).toFixed(1)} dB)`);
          snd.stat();
        },
        onAction(k) { if (k === 'sound') snd.toggle(); },
        dispose() { snd.stop(); },
      };
    },
  });
})();
