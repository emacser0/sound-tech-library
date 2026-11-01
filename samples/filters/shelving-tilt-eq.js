// 셸빙 EQ와 틸트 EQ: 고음만 올리는 하이셸프 vs 저음을 내리고 고음을 올리는 틸트 (음량 변화 비교)
GTL.register({
  id: 'shelving-tilt-eq',
  title: '셸빙 EQ와 틸트 EQ',
  summary: '하이셸프로 고음만 올리면 소리가 밝아지면서 전체 음량도 커짐. 틸트 EQ는 기준점을 중심으로 저음을 내리고 고음을 올려서, 음량은 거의 그대로 두고 음색만 기울임.',
  views: { a: '하이셸프만', b: '틸트 EQ' },
  info: `
    <p><b>셸빙(Shelving) 필터</b>는 기준 주파수 위(하이셸프) 또는 아래(로우셸프)를 선반처럼 통째로 올리거나 내림. 오디오 기기의 베이스, 트레블 노브가 셸빙 필터.</p>
    <p><b>틸트(Tilt) EQ</b>는 노브 하나로 스펙트럼 전체를 시소처럼 기울임. 로우셸프와 하이셸프를 같은 기준점(피벗)에 두고 게인을 반대로 줌.</p>
    <ul>
      <li>고음만 올리면 음량이 커져서 "더 좋게" 들리는 착각이 생김. 사람 귀는 큰 소리를 더 좋다고 느끼기 쉬움.</li>
      <li>틸트는 음량 변화가 작아서 음색만 공정하게 비교할 수 있음</li>
      <li>셸프 기울기(S)를 1보다 크게 하면 기준점 근처에 작은 봉우리와 골이 생김</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 160" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="90" x2="250" y2="90" class="d-dim"/>
    <path d="M20,90 L110,90 Q140,90 150,70 Q160,50 190,50 L250,50" class="d-a"/>
    <text x="135" y="24" text-anchor="middle" class="t-small t-a">${L('하이셸프: 고음만 +6dB', 'High shelf: highs only +6 dB')}</text>
    <text x="40" y="112" class="t-small t-dim">${L('저음 그대로', 'lows unchanged')}</text>
    <text x="40" y="140" class="t-small t-a">${L('전체 음량 증가', 'total level goes up')}</text>
    <line x1="290" y1="90" x2="520" y2="90" class="d-dim"/>
    <path d="M290,110 L370,110 Q395,110 405,90 Q415,70 440,70 L520,70" class="d-b"/>
    <circle cx="405" cy="90" r="4" class="f-accent"/>
    <text x="405" y="24" text-anchor="middle" class="t-small t-b">${L('틸트: 저음 -3dB, 고음 +3dB', 'Tilt: lows -3 dB, highs +3 dB')}</text>
    <text x="405" y="40" text-anchor="middle" class="t-small t-dim">${L('피벗을 중심으로 시소처럼', 'like a seesaw around the pivot')}</text>
    <text x="300" y="140" class="t-small t-b">${L('전체 음량 거의 그대로', 'total level stays about the same')}</text>
  </svg>`,
  look: [
    '"핑크 노이즈 음량 변화" 측정값을 비교하면 A는 약 +3.4dB, B는 약 +0.4dB',
    '틸트 양을 음수로 바꾸면 B는 저음이 올라가고 고음이 내려감. A는 고음만 내려감.',
    '셸프 기울기 S를 2로 올리면 기준점 근처에 봉우리와 골이 생김',
    '"소리 켜기" 후 소리 내는 뷰를 바꿔 들으면 A가 더 크고 밝게, B는 밝기만 바뀐 소리로 들림',
  ],
  refs: [
    { type: 'article', title: 'Robert Bristow-Johnson, "Cookbook formulae for audio EQ biquad filter coefficients"', url: 'https://www.w3.org/TR/audio-eq-cookbook/', note: '셸빙 필터와 기울기 S' },
    { type: 'paper', title: 'P. J. Baxandall, "Negative-Feedback Tone Control", Wireless World', year: 1952, note: '베이스, 트레블 셸빙 톤 컨트롤의 고전 회로' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2014, note: '음량을 맞춘 비교(Loudness Matching)의 중요성' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '셸빙 필터 설계' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', group: 'EQ', options: [{ value: 'shelf', label: '하이셸프만' }, { value: 'tilt', label: '틸트 (로우셸프 + 하이셸프)' }], a: 'shelf', b: 'tilt' },
    { key: 'amount', label: '밝기 변화 (dB)', type: 'range', min: -12, max: 12, step: 0.5, default: 6, shared: true, help: '하이셸프는 고음에 이만큼, 틸트는 양 끝 차이가 이만큼' },
    { key: 'pivot', label: '기준 주파수 (Hz)', type: 'range', min: 200, max: 5000, step: 10, default: 1000, shared: true },
    { key: 'slope', label: '셸프 기울기 S', type: 'range', min: 0.3, max: 2, step: 0.05, default: 0.7, shared: true, help: '1 = 봉우리 없는 가장 가파른 셸프' },
    { key: 'src', label: '원본 소리', type: 'select', group: '소리', options: [{ value: 'pink', label: '핑크 노이즈' }, { value: 'saw', label: '톱니파 화음' }], default: 'saw', shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Shelving EQ and Tilt EQ',
    summary: 'Boosting only the highs with a high shelf makes the sound brighter and also louder. A tilt EQ lowers the lows and raises the highs around a pivot, so the level stays about the same and only the tone tilts.',
    views: { a: 'High shelf only', b: 'Tilt EQ' },
    info: `
    <p>A <b>shelving filter</b> raises or lowers everything above (high shelf) or below (low shelf) a frequency, like a shelf. The bass and treble knobs on audio gear are shelving filters.</p>
    <p>A <b>tilt EQ</b> tilts the whole spectrum like a seesaw with one knob. It puts a low shelf and a high shelf at the same pivot with opposite gains.</p>
    <ul>
      <li>Boosting only the highs makes the sound louder, which can fool you into hearing it as "better". People tend to prefer the louder sound.</li>
      <li>A tilt changes the level only a little, so you can compare just the tone fairly.</li>
      <li>A shelf slope (S) above 1 adds a small bump and dip near the pivot.</li>
    </ul>`,
    look: [
      'Compare the "Pink noise level change" stat. A is about +3.4 dB and B is about +0.4 dB.',
      'Make the amount negative. B raises the lows and lowers the highs. A only lowers the highs.',
      'Raise the shelf slope S to 2. A bump and a dip appear near the pivot.',
      'Press "Sound on" and switch the view that plays sound. A sounds louder and brighter, B only changes brightness.',
    ],
    refs: ['Shelving filters and the slope S.', 'The classic bass and treble shelving tone control circuit.', 'Why loudness matched comparison matters.', 'Shelving filter design.'],
    params: {
      mode: { label: 'Mode', group: 'EQ', options: { shelf: 'High shelf only', tilt: 'Tilt (low shelf + high shelf)' } },
      amount: { label: 'Brightness change (dB)', help: 'High shelf: this much on the highs. Tilt: this much difference between the two ends.' },
      pivot: 'Pivot frequency (Hz)',
      slope: { label: 'Shelf slope S', help: '1 = steepest shelf with no bump' },
      src: { label: 'Source', group: 'Sound', options: { pink: 'Pink noise', saw: 'Saw chord' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, L = GTL.L;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000;

    // RBJ 셸프의 기울기 S를 Q로 바꿈
    const shelfQ = (gainDb, S) => { const a = Math.pow(10, gainDb / 40); return 1 / Math.sqrt(Math.max(1e-4, (a + 1 / a) * (1 / S - 1) + 2)); };
    function design(mode, amt, pivot, S, sr) {
      if (mode === 'shelf') return [A.biquad('highshelf', pivot, shelfQ(amt, S), amt, sr)];
      return [A.biquad('lowshelf', pivot, shelfQ(-amt / 2, S), -amt / 2, sr), A.biquad('highshelf', pivot, shelfQ(amt / 2, S), amt / 2, sr)];
    }
    const resp = (cs, f) => cs.reduce((s, c) => s + A.biquadResponse(c, f, SR).db, 0);

    const live = { st: [{ x1: 0, x2: 0, y1: 0, y2: 0 }, { x1: 0, x2: 0, y1: 0, y2: 0 }], amt: P.amount, pv: P.pivot, cs: null, r: U.rng(4), pk: [0, 0, 0, 0, 0, 0, 0], ph: [0, 0, 0] };
    const chord = [45, 52, 61];
    function source(sr) {
      if (P.src === 'pink') {
        const w = live.r.range(-1, 1), b = live.pk;
        b[0] = 0.99886 * b[0] + w * 0.0555179; b[1] = 0.99332 * b[1] + w * 0.0750759; b[2] = 0.969 * b[2] + w * 0.153852;
        b[3] = 0.8665 * b[3] + w * 0.3104856; b[4] = 0.55 * b[4] + w * 0.5329522; b[5] = -0.7616 * b[5] - w * 0.016898;
        const v = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + w * 0.5362) * 0.04; b[6] = w * 0.115926;
        return v;
      }
      let s = 0;
      for (let j = 0; j < 3; j++) {
        const dt = A.mtof(chord[j]) / sr;
        s += 2 * live.ph[j] - 1 - A.polyBlep(live.ph[j], dt);
        live.ph[j] += dt; if (live.ph[j] >= 1) live.ph[j] -= 1;
      }
      return s * 0.1;
    }
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = A.onePoleCoef(25, sr / 64);
        for (let i = 0; i < n; i++) {
          if ((i & 63) === 0) {
            live.amt += (P.amount - live.amt) * k; live.pv += (P.pivot - live.pv) * k;
            live.cs = design(P.mode, live.amt, live.pv, P.slope, sr);
          }
          let x = source(sr);
          live.cs.forEach((c, j) => {
            const s = live.st[j];
            const y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
            s.x2 = s.x1; s.x1 = x; s.y2 = s.y1; s.y1 = y; x = y;
          });
          l[i] = x; r[i] = x;
        }
      },
    });

    // 핑크 노이즈(옥타브마다 같은 에너지)의 음량 변화 = 로그 주파수 축에서 파워 평균
    let key = '', cs = null, pinkDb = 0;
    function analyze() {
      const k = [P.mode, P.amount, P.pivot, P.slope].join();
      if (k === key) return;
      key = k;
      cs = design(P.mode, P.amount, P.pivot, P.slope, SR);
      let s = 0; const M = 300;
      for (let i = 0; i < M; i++) s += Math.pow(10, resp(cs, 20 * Math.pow(1000, (i + 0.5) / M)) / 10);
      pinkDb = 10 * Math.log10(s / M);
    }

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, rw = W - pad * 2;
        const rh = Math.max(60, (H - pad * 3) * 0.66), o = { minDb: -15, maxDb: 15, dbStep: 5 };
        A.drawResponse(g, (f) => resp(cs, f), pad, pad, rw, rh, { ...o, color: col, lineWidth: 3, label: L('EQ 응답', 'EQ response') });
        if (P.mode === 'tilt') cs.forEach((c, j) => A.drawResponse(g, (f) => A.biquadResponse(c, f, SR).db, pad, pad, rw, rh, { ...o, background: false, grid: false, color: j ? C.series[3] : C.series[2], lineWidth: 1 }));
        const fx = A.freqX(P.pivot, pad, rw, 20, 20000), y0 = pad + rh / 2;
        D.line(g, fx, pad, fx, pad + rh, C.warn, 1);
        D.circle(g, fx, y0 - resp(cs, P.pivot) / 30 * rh, 4, C.accent);
        // 대역별 변화 막대
        const by = pad * 2 + rh, bh = H - by - pad;
        D.rect(g, pad, by, rw, bh, 'rgba(0,0,0,0.35)');
        const bandsF = [[60, L('저음 60Hz', 'Low 60 Hz')], [P.pivot, L('기준점', 'Pivot')], [10000, L('고음 10kHz', 'High 10 kHz')], [0, L('핑크 노이즈 음량', 'Pink noise level')]];
        const bw = rw / bandsF.length, mid = by + bh / 2 + 6;
        D.line(g, pad, mid, pad + rw, mid, C.dim, 1);
        bandsF.forEach(([f, name], j) => {
          const v = f ? resp(cs, f) : pinkDb, hh = U.clamp(v / 12, -1, 1) * (bh / 2 - 16);
          D.rect(g, pad + j * bw + bw * 0.3, Math.min(mid, mid - hh), bw * 0.4, Math.abs(hh), j === 3 ? C.accent : col);
          D.text(g, name, pad + j * bw + bw / 2, by + 3, { size: 10, align: 'center', color: C.dim });
          D.text(g, (v >= 0 ? '+' : '') + v.toFixed(1), pad + j * bw + bw / 2, by + bh - 13, { size: 10, align: 'center', color: C.text });
        });
        ctx.stat(L('저음 (60Hz)', 'Lows (60 Hz)'), resp(cs, 60).toFixed(1) + ' dB');
        ctx.stat(L('고음 (10kHz)', 'Highs (10 kHz)'), resp(cs, 10000).toFixed(1) + ' dB');
        ctx.stat(L('핑크 노이즈 음량 변화', 'Pink noise level change'), (pinkDb >= 0 ? '+' : '') + pinkDb.toFixed(2) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
