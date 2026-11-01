// 배음렬과 음색: 순수 사인파 vs 배음이 많은 소리. 배음의 음 높이를 건반과 센트 오차로 표시
GTL.register({
  id: 'harmonic-series',
  title: '배음렬과 음색',
  summary: '악기 소리는 기본음의 정수배 주파수(배음)가 겹친 것. 배음이 없는 사인파와 배음이 많은 소리를 비교하고, 배음이 건반의 어느 음에 해당하는지 확인.',
  views: { a: '사인파 (배음 1개)', b: '배음 16개' },
  controls: '파라미터 표에서 기본음, 배음 수, 배음 크기 규칙을 바꿈. "소리 켜기"를 누르면 소리 내는 뷰의 음이 들림.',
  info: `
    <p>현이나 관 같은 악기는 한 주파수로만 떨지 않음. 기본 주파수 f와 함께 2f, 3f, 4f... 처럼 정수배 주파수로도 동시에 떨림. 이 주파수 묶음을 <b>배음렬(Harmonic Series)</b>이라고 부름.</p>
    <p>귀는 배음 묶음 전체를 음 하나로 듣고, 음 높이는 기본 주파수로 느낌. 배음의 개수와 크기 비율은 <b>음색(Timbre)</b>으로 들림. 같은 음이라도 플루트와 바이올린이 다르게 들리는 이유.</p>
    <ul>
      <li>2배음은 한 옥타브 위, 3배음은 옥타브 + 완전5도, 4배음은 두 옥타브 위</li>
      <li>5배음은 평균율 장3도보다 약 14센트 낮고, 7배음은 단7도보다 약 31센트 낮음</li>
      <li>배음이 많고 크면 밝고 날카롭게, 적으면 둥글고 부드럽게 들림</li>
      <li>홀수 배음만 있으면 클라리넷처럼 속이 빈 소리가 됨</li>
    </ul>`,
  diagram: (L) => {
    const rows = [1, 2, 3, 4], x0 = 120, w = 220;
    let s = '';
    rows.forEach((n, i) => {
      const y = 28 + i * 40;
      let d = '';
      for (let k = 0; k <= 60; k++) { const x = x0 + (k / 60) * w, yy = y - 12 * Math.sin(n * Math.PI * k / 60); d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + yy.toFixed(1); }
      let d2 = '';
      for (let k = 0; k <= 60; k++) { const x = x0 + (k / 60) * w, yy = y + 12 * Math.sin(n * Math.PI * k / 60); d2 += (k ? 'L' : 'M') + x.toFixed(1) + ',' + yy.toFixed(1); }
      s += `<path d="${d}" class="d-b"/><path d="${d2}" class="d-dim"/>`;
      s += `<circle cx="${x0}" cy="${y}" r="2.5" class="f-accent"/><circle cx="${x0 + w}" cy="${y}" r="2.5" class="f-accent"/>`;
      s += `<text x="${x0 - 10}" y="${y + 4}" text-anchor="end" class="t-small">${n === 1 ? L('기본음', 'fundamental') : L(n + '배음', 'harmonic ' + n)}</text>`;
      s += `<text x="${x0 + w + 14}" y="${y + 4}" class="t-small t-mono">${n}f</text>`;
    });
    const iv = [L('옥타브 (2:1)', 'octave (2:1)'), L('완전5도 (3:2)', 'perfect fifth (3:2)'), L('완전4도 (4:3)', 'perfect fourth (4:3)')];
    iv.forEach((t, i) => { s += `<text x="${x0 + w + 50}" y="${28 + i * 40 + 24}" class="t-small t-dim">${t}</text>`; });
    return `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  },
  look: [
    '"소리 켜기"를 누르고 소리 내는 뷰를 A와 B로 바꾸면 같은 음 높이인데 B가 훨씬 밝게 들림',
    'B의 배음 크기 규칙을 "홀수만"으로 바꾸면 짝수 막대가 사라지고 파형이 사각파에 가까워짐',
    '건반에서 7배음과 11배음 표시를 보면 센트 오차가 크게 나옴. 평균율 음과 맞지 않는 배음.',
    'A의 배음 수를 하나씩 올리면 소리가 점점 밝아지고 스펙트럼 중심 측정값이 올라감',
  ],
  refs: [
    { type: 'book', title: 'Neville H. Fletcher, Thomas D. Rossing, The Physics of Musical Instruments (2nd ed.)', year: 1998, note: '현과 관의 진동 모드와 배음' },
    { type: 'book', title: 'Hermann von Helmholtz, On the Sensations of Tone (translated by A. J. Ellis)', year: 1885, note: '배음과 음색의 고전 연구' },
    { type: 'book', title: 'William A. Sethares, Tuning, Timbre, Spectrum, Scale (2nd ed.)', year: 2005, note: '배음 구조와 음률의 관계' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '가산 합성(Additive Synthesis)' },
  ],
  params: [
    { key: 'count', label: '배음 수', type: 'int', min: 1, max: 32, a: 1, b: 16, default: 16, group: '음색' },
    { key: 'roll', label: '배음 크기 규칙', type: 'select', options: [{ value: 'saw', label: '1/n (톱니파)' }, { value: 'odd', label: '홀수만 1/n (사각파)' }, { value: 'sq', label: '1/n² (부드러움)' }, { value: 'flat', label: '모두 같음 (날카로움)' }], default: 'saw', group: '음색' },
    { key: 'note', label: '기본음 (MIDI)', type: 'int', min: 33, max: 69, default: 45, shared: true, help: '45 = A2 (110Hz)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Harmonic Series and Timbre',
    summary: 'An instrument tone is a stack of frequencies at whole-number multiples of the fundamental (harmonics). Compare a sine wave with no harmonics to a tone with many harmonics, and see which keys the harmonics land on.',
    views: { a: 'Sine (1 harmonic)', b: '16 harmonics' },
    controls: 'Change the fundamental, the number of harmonics and the harmonic level rule in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>Strings and pipes do not vibrate at only one frequency. Along with the fundamental f, they also vibrate at 2f, 3f, 4f and so on. This set of frequencies is the <b>harmonic series</b>.</p>
    <p>The ear hears the whole set as one note, and the pitch comes from the fundamental. The number and balance of harmonics is heard as <b>timbre</b>. This is why a flute and a violin sound different on the same note.</p>
    <ul>
      <li>Harmonic 2 is one octave up, harmonic 3 is an octave plus a perfect fifth, harmonic 4 is two octaves up.</li>
      <li>Harmonic 5 is about 14 cents below the equal-tempered major third. Harmonic 7 is about 31 cents below the minor seventh.</li>
      <li>Many strong harmonics sound bright and sharp. Few harmonics sound round and soft.</li>
      <li>Odd harmonics only give a hollow sound, like a clarinet.</li>
    </ul>`,
    look: [
      'Press "Sound on" and switch the playing view between A and B. Both have the same pitch, but B sounds much brighter.',
      'Set B\'s harmonic level rule to "Odd only". The even bars disappear and the wave looks like a square wave.',
      'Look at harmonics 7 and 11 on the keyboard. Their cent error is large. They do not match equal-tempered notes.',
      'Raise A\'s harmonic count one by one. The sound gets brighter and the spectral centroid stat goes up.',
    ],
    refs: ['Vibration modes and harmonics of strings and pipes.', 'The classic study of harmonics and timbre (English translation by A. J. Ellis).', 'How harmonic structure relates to tuning.', 'Additive synthesis.'],
    params: {
      count: { label: 'Harmonics', group: 'Timbre' },
      roll: { label: 'Harmonic level rule', group: 'Timbre', options: { saw: '1/n (saw)', odd: 'Odd only 1/n (square)', sq: '1/n² (soft)', flat: 'All equal (sharp)' } },
      note: { label: 'Fundamental (MIDI)', help: '45 = A2 (110 Hz)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const MAXH = 32;

    // n번째 배음의 진폭 (현재 규칙)
    const ampOf = (n) => {
      if (n > P.count) return 0;
      switch (P.roll) {
        case 'odd': return n % 2 ? 1 / n : 0;
        case 'sq': return 1 / (n * n);
        case 'flat': return 1;
        default: return 1 / n;
      }
    };

    // 분석: 한 주기 파형, 정규화 게인, 스펙트럼 중심 (파라미터가 바뀔 때만)
    let key = '', amps = new Float64Array(MAXH + 1), cyc = new Float32Array(512), norm = 1, centroid = 0;
    function analyze() {
      const k = P.count + P.roll + P.note;
      if (k === key) return;
      key = k;
      const f0 = A.mtof(P.note);
      for (let n = 1; n <= MAXH; n++) amps[n] = n * f0 < 20000 ? ampOf(n) : 0;
      let pk = 0;
      for (let i = 0; i < cyc.length; i++) {
        let v = 0; const ph = (i / cyc.length) * U.TAU;
        for (let n = 1; n <= MAXH; n++) if (amps[n]) v += amps[n] * Math.sin(n * ph);
        cyc[i] = v; pk = Math.max(pk, Math.abs(v));
      }
      norm = pk > 0 ? 1 / pk : 1;
      for (let i = 0; i < cyc.length; i++) cyc[i] *= norm;
      let num = 0, den = 0;
      for (let n = 1; n <= MAXH; n++) { const e = amps[n] * amps[n]; num += e * n * f0; den += e; }
      centroid = den ? num / den : f0;
    }

    const live = { ph: new Float64Array(MAXH + 1), g: new Float64Array(MAXH + 1) };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        analyze();
        const f0 = A.mtof(P.note), k = A.onePoleCoef(20, sr);
        for (let i = 0; i < n; i++) {
          let v = 0;
          for (let h = 1; h <= MAXH; h++) {
            const target = h * f0 < sr * 0.45 ? amps[h] * norm : 0;
            live.g[h] += (target - live.g[h]) * k;
            if (live.g[h] < 1e-5 && target === 0) continue;
            live.ph[h] += h * f0 / sr; if (live.ph[h] >= 1) live.ph[h] -= 1;
            v += live.g[h] * Math.sin(U.TAU * live.ph[h]);
          }
          v *= 0.45; l[i] = v; r[i] = v;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, f0 = A.mtof(P.note);
        const wh = Math.max(40, H * 0.22);
        // 파형 2주기
        const two = new Float32Array(256);
        for (let i = 0; i < 256; i++) two[i] = cyc[Math.floor((i / 256) * 2 * cyc.length) % cyc.length];
        A.drawWave(g, two, pad, pad, W - pad * 2, wh, { color: col, amp: 0.9, label: Lx('파형 (2주기)', 'Waveform (2 cycles)') });

        // 배음 막대
        const by = pad * 2 + wh, bh = Math.max(50, H * 0.36);
        D.rect(g, pad, by, W - pad * 2, bh, 'rgba(0,0,0,0.35)');
        const bw = (W - pad * 2) / MAXH;
        const showN = Math.min(MAXH, 16);
        for (let n = 1; n <= MAXH; n++) {
          const a = amps[n], x = pad + (n - 1) * bw;
          const hgt = a * (bh - 34);
          D.rect(g, x + 1, by + bh - 16 - hgt, Math.max(1, bw - 2), hgt, a ? col : null);
          if (n <= showN || n % 4 === 0) D.text(g, String(n), x + bw / 2, by + bh - 13, { size: 9, color: C.dim, align: 'center' });
        }
        D.text(g, Lx('배음 진폭 (n = 배음 번호)', 'Harmonic amplitude (n = harmonic number)'), pad + 4, by + 3, { size: 10, color: C.dim });

        // 건반: 배음 위치
        const ky = by + bh + pad, kh = Math.max(30, H - ky - 30);
        const lo = P.note - (A.isBlackKey(P.note) ? 1 : 0), hi = Math.min(127, lo + 60);
        const marks = {};
        const list = [];
        for (let n = 1; n <= 16; n++) {
          if (!amps[n]) continue;
          const m = A.ftom(n * f0), mr = Math.round(m);
          if (mr > hi) break;
          marks[mr] = n === 1 ? C.good : col;
          list.push({ n, mr, cents: (m - mr) * 100 });
        }
        const kx = A.drawKeyboard(g, pad, ky, W - pad * 2, kh, lo, hi, marks, { labels: true });
        for (const it of list) {
          const x = kx(it.mr);
          if (x == null) continue;
          const bad = Math.abs(it.cents) > 10;
          D.text(g, String(it.n), x, ky + kh + 3, { size: 9, align: 'center', color: bad ? C.warn : C.text });
        }
        D.text(g, Lx('건반: 배음이 가장 가까운 음 (노란 번호 = 평균율과 10센트 이상 차이)', 'Keys: nearest note of each harmonic (yellow number = over 10 cents from equal temperament)'), pad, ky + kh + 15, { size: 9, color: C.dim });

        const audible = amps.reduce((s, a) => s + (a > 0 ? 1 : 0), 0);
        ctx.stat(Lx('기본음', 'Fundamental'), `${A.noteName(P.note)} (${f0.toFixed(1)} Hz)`);
        ctx.stat(Lx('들리는 배음 수', 'Harmonics present'), audible);
        ctx.stat(Lx('스펙트럼 중심 (밝기)', 'Spectral centroid (brightness)'), centroid.toFixed(0) + ' Hz');
        const c7 = list.find((x) => x.n === 7);
        if (c7) ctx.stat(Lx('7배음 오차', 'Harmonic 7 error'), `${A.noteName(c7.mr)} ${c7.cents >= 0 ? '+' : ''}${c7.cents.toFixed(0)}c`);
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
