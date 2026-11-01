// 웨이브테이블 합성: 한 주기 파형 여러 장(프레임)을 모아 두고 위치를 움직여 음색을 바꿈. 단순 읽기 vs 보간 + 밉맵
GTL.register({
  id: 'wavetable-synthesis',
  title: '웨이브테이블 합성 (보간과 밉맵)',
  summary: '한 주기 파형을 여러 장 저장해 두고 읽는 위치를 옮겨 음색을 바꾸는 웨이브테이블 합성. 그냥 읽으면 높은 음에서 에일리어싱과 계단 잡음이 생기고, 보간과 음역별 테이블(밉맵)을 쓰면 깨끗해짐.',
  views: { a: '단순 읽기', b: '보간 + 밉맵' },
  controls: '파라미터 표에서 테이블 위치와 음 높이를 바꿈. "위치 자동 이동"을 켜면 프레임 사이를 천천히 오감.',
  info: `
    <p><b>웨이브테이블(Wavetable)</b>은 한 주기 파형을 배열에 저장해 두고 위상에 맞춰 읽는 오실레이터. PPG Wave, Waldorf, Serum 같은 신시사이저는 프레임 여러 장을 쌓아 두고 <b>위치(Position)</b>를 움직여 음색을 서서히 바꿈(모핑).</p>
    <ul>
      <li><b>보간 없음</b>: 위상에 가장 가까운 칸을 그대로 씀. 파형이 계단이 되어 잡음이 생기고, 프레임도 뚝뚝 바뀜.</li>
      <li><b>선형 보간</b>: 이웃한 두 칸 사이를 직선으로 이음. 프레임 사이도 섞어서 부드럽게 모핑.</li>
      <li><b>밉맵(Mipmap)</b>: 옥타브마다 배음 수를 줄인 테이블을 따로 만들어 둠. 높은 음은 배음이 적은 테이블을 읽어서 나이퀴스트를 넘는 배음이 없음.</li>
    </ul>
    <p>이 샘플은 테이블 크기 256, 프레임 8장, 밉맵 8단계. 메모리는 프레임 x 단계만큼 늘지만 재생 비용은 거의 같음. 단계가 바뀌는 순간 음색이 살짝 튀므로 실제 제품은 두 단계를 섞거나 오버샘플링을 함께 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="16" class="t-small t-dim">${L('밉맵: 음이 높을수록 배음이 적은 테이블', 'Mipmap: higher notes read tables with fewer harmonics')}</text>
    <rect x="20" y="30" width="150" height="34" class="f-dim"/><text x="95" y="51" text-anchor="middle" class="t-small">${L('단계 0: 배음 127개', 'Level 0: 127 harmonics')}</text>
    <rect x="20" y="72" width="110" height="30" class="f-dim"/><text x="75" y="91" text-anchor="middle" class="t-small">${L('단계 1: 64개', 'Level 1: 64')}</text>
    <rect x="20" y="110" width="80" height="26" class="f-dim"/><text x="60" y="127" text-anchor="middle" class="t-small">${L('단계 2: 32개', 'Level 2: 32')}</text>
    <text x="60" y="152" text-anchor="middle" class="t-small t-dim">...</text>
    <line x1="200" y1="40" x2="200" y2="140" class="d-dim"/><text x="210" y="44" class="t-small">${L('낮은 음', 'low notes')}</text><text x="210" y="140" class="t-small">${L('높은 음', 'high notes')}</text>
    <text x="310" y="30" class="t-small t-dim">${L('위상 사이 읽기', 'Reading between samples')}</text>
    <polyline points="310,120 340,120 340,90 370,90 370,70 400,70 400,60 430,60" class="d-a"/>
    <polyline points="310,125 340,95 370,72 400,62 430,58" class="d-b"/>
    <text x="436" y="66" class="t-small t-a">${L('계단 (보간 없음)', 'steps (no interp)')}</text>
    <text x="436" y="84" class="t-small t-b">${L('선형 보간', 'linear interp')}</text>
  </svg>`,
  look: [
    '기본 음(C6)에서 A의 스펙트럼은 배음 사이에 잡음이 가득하고, B는 초록 눈금 위의 배음만 남음',
    '"에일리어싱 잡음" 측정값을 비교하면 B가 수십 dB 낮음',
    '"위치 자동 이동"을 켜면 A는 위쪽 3D 프레임 강조가 한 장씩 뚝뚝 넘어가고, B는 프레임 사이 파형이 부드럽게 바뀜',
    '음 높이를 C3 근처로 내리면 A의 잡음이 줄지만, 계단 잡음 때문에 바닥 잡음은 B보다 여전히 높음',
  ],
  refs: [
    { type: 'book', title: 'Will Pirkle, Designing Software Synthesizer Plugins in C++', year: 2021, note: '웨이브테이블 오실레이터와 밉맵 테이블' },
    { type: 'article', title: 'Nigel Redmon, "Wavetable oscillators" series (EarLevel Engineering)', url: 'https://www.earlevel.com/main/category/digital-audio/oscillators/wavetable-oscillators/', note: '옥타브별 대역 제한 테이블 구현' },
    { type: 'book', title: 'Curtis Roads, The Computer Music Tutorial', year: 1996, note: '테이블 조회 오실레이터와 보간 잡음' },
    { type: 'paper', title: 'Vesa Välimäki, Antti Huovilainen, "Antialiasing Oscillators in Subtractive Synthesis", IEEE Signal Processing Magazine', year: 2007, note: '대역 제한 오실레이터 정리' },
  ],
  params: [
    { key: 'method', label: '읽기 방식', type: 'select', options: [{ value: 'naive', label: '단순 (보간 없음)' }, { value: 'interp', label: '선형 보간' }, { value: 'mip', label: '보간 + 밉맵' }], a: 'naive', b: 'mip', group: '웨이브테이블' },
    { key: 'pos', label: '테이블 위치', type: 'range', min: 0, max: 1, step: 0.001, default: 0.33, shared: true, help: '0 사인파 → 삼각파 → 톱니파 → 사각파 → 펄스 → 포먼트 → 밝은 파형' },
    { key: 'sweep', label: '위치 자동 이동', type: 'bool', default: false, shared: true },
    { key: 'note', label: '음 높이 (MIDI)', type: 'int', min: 36, max: 100, default: 84, shared: true, group: '음', help: '60 = C4 (가운데 도)' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Wavetable Synthesis (Interpolation and Mipmaps)',
    summary: 'Wavetable synthesis stores several single-cycle waveforms and moves the read position to change the tone. Plain reading adds aliasing and step noise on high notes. Interpolation plus per-octave tables (mipmaps) keep it clean.',
    views: { a: 'Naive read', b: 'Interp + mipmap' },
    controls: 'Change the table position and pitch in the parameter table. Turn on "Auto sweep" to move slowly between frames.',
    info: `
    <p>A <b>wavetable</b> oscillator stores one cycle of a waveform in an array and reads it by phase. Synths such as PPG Wave, Waldorf and Serum stack many frames and move the <b>position</b> to change the tone smoothly (morphing).</p>
    <ul>
      <li><b>No interpolation</b>: uses the nearest sample. The waveform becomes steps and adds noise, and frames switch abruptly.</li>
      <li><b>Linear interpolation</b>: draws a straight line between two neighbor samples. It also blends frames for smooth morphing.</li>
      <li><b>Mipmap</b>: stores extra tables with fewer harmonics for each octave. High notes read a table with fewer harmonics, so nothing goes above Nyquist.</li>
    </ul>
    <p>This sample uses a table size of 256, 8 frames and 8 mipmap levels. Memory grows with frames x levels, but playback cost stays almost the same. The tone jumps a little when the level changes, so real products blend two levels or add oversampling.</p>`,
    look: [
      'At the default pitch (C6), A\'s spectrum is full of noise between harmonics. B keeps only the harmonics on the green ticks.',
      'Compare the "Aliasing noise" stat. B is tens of dB lower.',
      'Turn on "Auto sweep". In A the highlighted 3D frame jumps one at a time. In B the waveform changes smoothly between frames.',
      'Lower the pitch to around C3. A gets less noise, but its noise floor stays above B because of step noise.',
    ],
    refs: ['Wavetable oscillators and mipmapped tables.', 'Per-octave band-limited table implementation.', 'Table lookup oscillators and interpolation noise.', 'Overview of band-limited oscillators.'],
    params: {
      method: { label: 'Read method', group: 'Wavetable', options: { naive: 'Naive (no interp)', interp: 'Linear interp', mip: 'Interp + mipmap' } },
      pos: { label: 'Table position', help: '0 sine → triangle → saw → square → pulse → formant → bright' },
      sweep: 'Auto sweep',
      note: { label: 'Pitch (MIDI)', group: 'Note', help: '60 = C4 (middle C)' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params, Lx = GTL.L, TAU = Math.PI * 2;
    const col = ctx.side === 'a' ? C.a : C.b;
    const TS = 256, K = 8, LV = 8;
    const maxH = (l) => (l === 0 ? TS / 2 - 1 : (TS / 2) >> l);
    // 프레임 j의 h번째 배음 크기 (사인 계수)
    const SHAPES = [
      (h) => (h === 1 ? 1 : 0),
      (h) => (h & 1 ? (((h - 1) / 2) & 1 ? -1 : 1) / (h * h) : 0),
      (h) => 1 / h,
      (h) => (h & 1 ? 1 / h : 0),
      (h) => Math.sin(Math.PI * h * 0.25) / h,
      (h) => Math.exp(-(((h - 6) / 2) ** 2)) + 0.3 / h,
      (h) => Math.exp(-(((h - 14) / 3) ** 2)) + 0.3 / h,
      (h) => 1 / Math.sqrt(h),
    ];
    // tables[j][l]: Float32Array(TS)
    const tables = [];
    const sinT = new Float32Array(TS); for (let i = 0; i < TS; i++) sinT[i] = Math.sin(TAU * i / TS);
    for (let j = 0; j < K; j++) {
      tables.push([]);
      let norm = 1;
      for (let l = 0; l < LV; l++) {
        const t = new Float32Array(TS);
        for (let h = 1; h <= maxH(l); h++) { const a = SHAPES[j](h); if (!a) continue; for (let i = 0; i < TS; i++) t[i] += a * sinT[(i * h) % TS]; }
        if (l === 0) norm = 1 / Math.max(1e-6, A.peak(t));
        for (let i = 0; i < TS; i++) t[i] *= norm;
        tables[j].push(t);
      }
    }
    const levelFor = (f, sr) => { const allowed = Math.floor(sr * 0.5 / f); for (let l = 0; l < LV; l++) if (maxH(l) <= allowed) return l; return LV - 1; };
    const read = (t, ph) => { const x = ph * TS, i0 = Math.floor(x) & (TS - 1), fr = x - Math.floor(x); return t[i0] + (t[(i0 + 1) & (TS - 1)] - t[i0]) * fr; };
    // 한 샘플. posF: 0~K-1
    function sample(ph, posF, lvl) {
      if (P.method === 'naive') return tables[Math.round(posF)][0][Math.floor(ph * TS) & (TS - 1)];
      const l = P.method === 'mip' ? lvl : 0, j0 = Math.floor(posF), j1 = Math.min(K - 1, j0 + 1), fx = posF - j0;
      return read(tables[j0][l], ph) * (1 - fx) + read(tables[j1][l], ph) * fx;
    }
    const posAt = (t) => U.clamp(P.sweep ? 0.5 - 0.5 * Math.cos(TAU * t / 8) : P.pos, 0, 1) * (K - 1);

    const live = { n: 0, ph: 0 };
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const f = A.mtof(P.note), dt = f / sr, lvl = levelFor(f, sr);
        for (let i = 0; i < n; i++) {
          const o = sample(live.ph, posAt(live.n++ / sr), lvl) * 0.35;
          live.ph += dt; if (live.ph >= 1) live.ph -= 1;
          l[i] = o; r[i] = o;
        }
      },
    });

    const SR = 48000, N = 4096;
    let key = '', mags = null, alias = 0;
    function analyze(posF) {
      const k = P.method + P.note + '|' + posF.toFixed(2);
      if (k === key) return;
      key = k;
      const f = A.mtof(P.note), lvl = levelFor(f, SR), st = { ph: 0 };
      const buf = A.render(N, SR, () => { const v = sample(st.ph, posF, lvl); st.ph = (st.ph + f / SR) % 1; return v; });
      mags = A.spectrum(buf, N, { window: 'blackman' });
      const binHz = SR / N; alias = -200;
      for (let b = 2; b < N / 2; b++) { const h = b * binHz / f; if (Math.abs(h - Math.round(h)) * f >= 3 * binHz && mags[b] > alias) alias = mags[b]; }
    }

    let visT = 0;
    return {
      update(dt) { snd.update(); visT += dt; },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const t = snd.on ? live.n / (snd.sr || SR) : visT, posF = posAt(t), f = A.mtof(P.note);
        analyze(posF);
        const lvl = P.method === 'mip' ? levelFor(f, SR) : 0;
        // 1) 프레임 3D 쌓기
        const h1 = Math.max(80, (H - pad * 3) * 0.45), fw = (W - pad * 2) * 0.62, fh = h1 * 0.38;
        const dx = ((W - pad * 2) - fw) / (K - 1), dy = (h1 - fh) / (K - 1);
        D.rect(g, pad, pad, W - pad * 2, h1, 'rgba(0,0,0,0.35)');
        const cur = P.method === 'naive' ? Math.round(posF) : posF;
        for (let j = K - 1; j >= 0; j--) {
          const ox = pad + j * dx, oy = pad + h1 - fh - j * dy, mid = oy + fh / 2;
          const near = Math.abs(j - cur) < 1 ? 1 - Math.abs(j - cur) : 0;
          g.beginPath();
          for (let i = 0; i <= 64; i++) { const v = tables[j][lvl][Math.floor(i / 64 * (TS - 1))]; const px = ox + i / 64 * fw, py = mid - v * fh * 0.45; i ? g.lineTo(px, py) : g.moveTo(px, py); }
          g.strokeStyle = near > 0 ? col : 'rgba(200,210,230,0.35)'; g.globalAlpha = 0.35 + 0.65 * near; g.lineWidth = near > 0.5 ? 2 : 1; g.stroke(); g.globalAlpha = 1;
        }
        D.text(g, Lx(`프레임 8장 (밉맵 단계 ${lvl})`, `8 frames (mipmap level ${lvl})`), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 2) 스펙트럼
        const sy = pad * 2 + h1, sh = H - sy - pad;
        A.drawSpectrum(g, mags, SR, pad, sy, W - pad * 2, sh, { color: col, minDb: -110, maxDb: 0, label: Lx('출력 스펙트럼', 'Output spectrum') });
        for (let h = 1; h * f < SR / 2 && h <= 60; h++) { const px = A.freqX(h * f, pad, W - pad * 2, 20, 20000); D.line(g, px, sy + sh - 4, px, sy + sh, C.good, 2); }
        ctx.stat(Lx('테이블 위치 (프레임)', 'Table position (frame)'), (P.method === 'naive' ? Math.round(posF) : posF).toFixed(2));
        ctx.stat(Lx('읽는 테이블의 배음 수', 'Harmonics in the table read'), maxH(lvl));
        ctx.stat(Lx('에일리어싱 잡음 (최대)', 'Aliasing noise (max)'), alias.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
