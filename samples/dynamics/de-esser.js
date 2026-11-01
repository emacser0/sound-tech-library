// 디에서: 고음 대역만 보는 사이드체인으로 "스" 소리(치찰음)가 클 때만 고음을 줄임
GTL.register({
  id: 'de-esser',
  title: '디에서 (치찰음 줄이기)',
  summary: '보컬의 "스", "시" 같은 치찰음은 5~9 kHz에 에너지가 몰려 귀를 찌름. A는 처리 없음. B의 디에서는 고음 대역 레벨이 스레숄드를 넘을 때만 그 대역을 줄여서 모음은 그대로 두고 치찰음만 낮춤.',
  views: { a: '처리 없음', b: '디에서' },
  controls: '파라미터 표에서 스레숄드, 검출 주파수, 최대 감소량을 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>치찰음(Sibilance)</b>은 "s", "sh", "ch" 같은 마찰음. 좁은 틈으로 공기가 빠지며 나는 잡음이라 4~10 kHz에 에너지가 몰림. 마이크, 컴프레서, 고음 EQ를 거치면 더 두드러져 귀에 거슬림.</p>
    <p>고음 EQ로 늘 깎으면 모음의 밝기와 공기감까지 사라짐. <b>디에서(De-esser)</b>는 치찰음이 나올 때만 동작하는 컴프레서.</p>
    <ul>
      <li><b>사이드체인 필터</b>: 검출기에는 고역 통과 필터를 거친 신호만 넣음. 그래서 모음이 커도 반응하지 않음.</li>
      <li><b>분할 대역(Split-band)</b> 방식: 고음 대역만 줄임. 이 샘플의 방식. Linkwitz-Riley 크로스오버로 나눈 뒤 출력 = 저음 대역 + 게인 × 고음 대역.</li>
      <li><b>전 대역(Wideband)</b> 방식: 치찰음 순간에 전체 게인을 줄임. 구조는 단순하지만 그 순간 목소리 전체가 작아짐.</li>
    </ul>
    <p>단점: 감소량이 너무 크면 "스"가 "프"처럼 들리는 혀 짧은 소리(lisp)가 됨</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="20" width="70" height="28" class="f-dim"/><text x="45" y="38" text-anchor="middle" class="t-small">${L('보컬', 'Vocal')}</text>
    <rect x="130" y="20" width="110" height="28" class="f-dim"/><text x="185" y="38" text-anchor="middle" class="t-small">${L('고음 대역 분리', 'Split high band')}</text>
    <rect x="290" y="20" width="90" height="28" class="f-dim"/><text x="335" y="38" text-anchor="middle" class="t-small">${L('게인 × 고음', 'Gain × high')}</text>
    <circle cx="440" cy="34" r="12" class="f-dim"/><text x="440" y="39" text-anchor="middle">+</text>
    <text x="470" y="38" class="t-small">${L('출력', 'Output')}</text>
    <path d="M80,34 L128,34" class="d-accent" marker-end="url(#arr)"/><path d="M240,34 L288,34" class="d-accent" marker-end="url(#arr)"/><path d="M380,34 L426,34" class="d-accent" marker-end="url(#arr)"/>
    <path d="M185,48 L185,70 L440,70 L440,48" class="d-accent" marker-end="url(#arr)"/><text x="250" y="84" class="t-small">${L('저음 대역 (그대로)', 'Low band (unchanged)')}</text>
    <path d="M100,34 L100,120 L128,120" class="d-accent" marker-end="url(#arr)"/>
    <rect x="130" y="106" width="110" height="28" class="f-dim"/><text x="185" y="124" text-anchor="middle" class="t-small">${L('사이드체인 HPF', 'Sidechain HPF')}</text>
    <rect x="270" y="106" width="110" height="28" class="f-dim"/><text x="325" y="124" text-anchor="middle" class="t-small">${L('검출, 게인 계산', 'Detect, gain')}</text>
    <path d="M240,120 L268,120" class="d-accent" marker-end="url(#arr)"/><path d="M335,106 L335,50" class="d-accent" marker-end="url(#arr)"/>
    <text x="10" y="160" class="t-small t-dim">${L('모음은 고음 대역 레벨이 낮아서 검출기가 반응하지 않음', 'Vowels have little high band energy, so the detector ignores them')}</text>
  </svg>`,
  look: [
    '위 스펙트럼에서 B의 5 kHz 위 치찰음 봉우리가 A보다 낮음. 1 kHz 근처 모음 대역은 같음.',
    '"치찰음 피크 감소"는 B가 몇 dB, "모음 레벨 변화"는 거의 0',
    'B의 스레숄드를 -45 dB로 내리면 감소량이 커지고 "스"가 뭉개져 들림',
    'B의 검출 주파수를 2 kHz로 내리면 모음에도 반응해서 모음 레벨 변화가 커짐',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Chapter 4', year: 2011, note: '디에서 구조 (사이드체인 필터)' },
    { type: 'book', title: 'Bobby Owsinski, The Mixing Engineer\'s Handbook', note: '보컬 디에싱 실무' },
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '분할 대역과 전 대역 디에서 비교' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '사이드체인 필터를 쓰는 다이내믹 처리' },
  ],
  params: [
    { key: 'on', label: '디에서', type: 'bool', default: true, a: false, b: true, group: '디에서' },
    { key: 'threshold', label: '스레숄드 (dB)', type: 'range', min: -50, max: 0, step: 1, default: -30, when: (p) => p.on },
    { key: 'freq', label: '검출 주파수 (Hz)', type: 'range', min: 2000, max: 10000, step: 100, default: 5000, when: (p) => p.on },
    { key: 'range', label: '최대 감소량 (dB)', type: 'range', min: 0, max: 24, step: 1, default: 12, when: (p) => p.on },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'De-esser (Taming Sibilance)',
    summary: 'Sibilants like "s" and "sh" in vocals pile up energy at 5 to 9 kHz and sound harsh. A has no processing. The de-esser in B lowers the high band only when its level goes over the threshold, so vowels stay the same and only sibilants go down.',
    views: { a: 'No processing', b: 'De-esser' },
    controls: 'Change the threshold, detection frequency and max reduction in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p><b>Sibilance</b> comes from fricatives like "s", "sh" and "ch". Air rushes through a narrow gap and makes noise, with its energy at 4 to 10 kHz. Microphones, compressors and high EQ make it stand out even more, and it gets harsh.</p>
    <p>Cutting the highs with a static EQ also removes the brightness and air of the vowels. A <b>de-esser</b> is a compressor that works only when sibilants appear.</p>
    <ul>
      <li><b>Sidechain filter</b>: the detector gets only the high passed signal. Loud vowels do not trigger it.</li>
      <li><b>Split-band</b>: reduces only the high band. This sample uses it. After a Linkwitz-Riley crossover split, output = low band + gain × high band.</li>
      <li><b>Wideband</b>: lowers the whole gain during sibilants. Simpler, but the whole voice drops for that moment.</li>
    </ul>
    <p>Downside: too much reduction turns "s" into a lisp.</p>`,
    look: [
      'In the top spectrum, B\'s sibilance peak above 5 kHz is lower than A\'s. The vowel range around 1 kHz is the same.',
      '"Sibilance peak reduction" is several dB in B, while "Vowel level change" is almost 0.',
      'Lower B\'s threshold to -45 dB. Reduction grows and the "s" sounds dull.',
      'Lower B\'s detection frequency to 2 kHz. It reacts to vowels too, and the vowel level change grows.',
    ],
    refs: ['De-esser structure (sidechain filter).', 'De-essing vocals in practice.', 'Split-band and wideband de-essers compared.', 'Dynamics processing with sidechain filters.'],
    params: {
      on: { label: 'De-esser', group: 'De-esser' },
      threshold: 'Threshold (dB)',
      freq: 'Detection frequency (Hz)',
      range: 'Max reduction (dB)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 32000;

    // 합성 목소리: "sa, si, so". 성대 펄스(톱니) + 포먼트 대역 통과 3개, 치찰음은 대역 통과 잡음
    const SYL = [{ v: [730, 1090, 2440] }, { v: [270, 2290, 3010] }, { v: [570, 840, 2410] }];
    const S_LEN = 0.16, V_LEN = 0.42, GAP = 0.1, SYL_LEN = S_LEN + V_LEN + GAP;
    function makeSource(sr) {
      const n = Math.round(SYL_LEN * 3 * sr), out = new Float32Array(n), nz = A.noiseBuffer(n, 41);
      const sib = [A.biquad('bandpass', 6500, 1.2, 0, sr), A.biquad('highpass', 4000, 0.7, 0, sr)];
      let ph = 0;
      SYL.forEach((s, k) => {
        const i0 = Math.round(k * SYL_LEN * sr), sN = Math.round(S_LEN * sr), vN = Math.round(V_LEN * sr);
        for (let i = 0; i < sN; i++) { const t = i / sN, env = Math.sin(Math.PI * t) ** 1.5; out[i0 + i] += sib[1].process(sib[0].process(nz[i0 + i])) * env * 0.4; }
        const fs = s.v.map((f, j) => A.biquad('bandpass', f, 8 + j * 4, 0, sr)), gains = [1, 0.6, 0.35];
        for (let i = 0; i < vN; i++) {
          const t = i / sr, f0 = 135 - 15 * i / vN;
          ph += f0 / sr; if (ph >= 1) ph -= 1;
          const src = 2 * ph - 1, env = Math.min(1, t / 0.02, (vN - i) / sr / 0.04);
          let v = 0; for (let j = 0; j < 3; j++) v += fs[j].process(src) * gains[j];
          out[i0 + sN + i] += v * env * 1.8;
        }
      });
      return { buf: out, n, sibAt: Math.round(S_LEN * 0.5 * sr), vowAt: Math.round((S_LEN + V_LEN * 0.5) * sr) };
    }
    function newSt(sr) {
      const bq = (t) => A.biquad(t, P.freq, 0.7071, 0, sr);
      // 사이드체인 HPF와 LR4 크로스오버(저음 + 고음 = 올패스, 크기 평탄)
      return { sr, f: P.freq, sc1: bq('highpass'), sc2: bq('highpass'), hb1: bq('highpass'), hb2: bq('highpass'), lb1: bq('lowpass'), lb2: bq('lowpass'), env: 0, gr: 0, lev: -120 };
    }
    function coefs(sr) { return { on: P.on, T: P.threshold, range: P.range, eR: Math.exp(-1 / (0.03 * sr)), aC: Math.exp(-1 / (0.001 * sr)), rC: Math.exp(-1 / (0.06 * sr)) }; }
    function step(st, x, k) {
      const sc = st.sc2.process(st.sc1.process(x)), hb = st.hb2.process(st.hb1.process(x)), lb = st.lb2.process(st.lb1.process(x));
      const a = Math.abs(sc);
      st.env = a > st.env ? a : st.env * k.eR;
      st.lev = A.linToDb(st.env);
      const want = k.on ? Math.min(k.range, Math.max(0, st.lev - k.T) * 0.75) : 0;
      st.gr = want > st.gr ? k.aC * st.gr + (1 - k.aC) * want : k.rC * st.gr + (1 - k.rC) * want;
      return k.on ? lb + hb * A.dbToLin(-st.gr) : x;
    }

    const S = makeSource(SR), N = S.n, COLS = 420, FN = 2048;
    const specIn = A.spectrum(S.buf, FN, { offset: Math.max(0, S.sibAt - FN / 2) });
    let key = '', specOut, levD, grD, outD, stats;
    function analyze() {
      const k = [P.on, P.threshold, P.freq, P.range].join();
      if (k === key) return;
      key = k;
      const st = newSt(SR), cf = coefs(SR), out = new Float32Array(N);
      levD = new Float32Array(COLS).fill(-120); grD = new Float32Array(COLS);
      const lo = new Float32Array(COLS), hi = new Float32Array(COLS);
      for (let i = 0; i < N; i++) {
        out[i] = step(st, S.buf[i], cf);
        const c = Math.floor(i * COLS / N);
        levD[c] = Math.max(levD[c], st.lev); grD[c] = Math.max(grD[c], st.gr);
        lo[c] = Math.min(lo[c], out[i]); hi[c] = Math.max(hi[c], out[i]);
      }
      outD = { lo, hi };
      specOut = A.spectrum(out, FN, { offset: Math.max(0, S.sibAt - FN / 2) });
      // 치찰음: 4 kHz 위 대역의 피크 / 모음: 모음 구간 RMS
      const hp = [A.biquad('highpass', 4000, 0.7, 0, SR), A.biquad('highpass', 4000, 0.7, 0, SR)];
      const hp2 = [A.biquad('highpass', 4000, 0.7, 0, SR), A.biquad('highpass', 4000, 0.7, 0, SR)];
      let pi = 0, po = 0;
      for (let i = 0; i < N; i++) { pi = Math.max(pi, Math.abs(hp[1].process(hp[0].process(S.buf[i])))); po = Math.max(po, Math.abs(hp2[1].process(hp2[0].process(out[i])))); }
      let vi = 0, vo = 0, vn = 0;
      for (let k2 = 0; k2 < 3; k2++) {
        const a = Math.round((k2 * SYL_LEN + S_LEN + 0.05) * SR), b = Math.round((k2 * SYL_LEN + S_LEN + V_LEN - 0.05) * SR);
        for (let i = a; i < b; i++) { vi += S.buf[i] * S.buf[i]; vo += out[i] * out[i]; vn++; }
      }
      stats = { sib: A.linToDb(pi) - A.linToDb(po), vow: 10 * Math.log10(vo / vi), maxGr: A.peak(grD) };
    }

    let live = null, liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = null; }
        if (!live || live.f !== P.freq) live = newSt(sr);
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc.buf[pos], cf);
          pos = (pos + 1) % liveSrc.n;
          l[i] = y; r[i] = y;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2;
        const h1 = (H - pad * 4) * 0.42, h2 = (H - pad * 4) * 0.33, h3 = H - pad * 4 - h1 - h2;
        // 치찰음 순간의 스펙트럼
        A.drawSpectrum(g, specIn, SR, pad, pad, iw, h1, { color: 'rgba(160,170,190,0.6)', minDb: -90, maxDb: 0, fmin: 100, fmax: 16000 });
        A.drawSpectrum(g, specOut, SR, pad, pad, iw, h1, { color: col, minDb: -90, maxDb: 0, fmin: 100, fmax: 16000, background: false, grid: false });
        if (P.on) { const fx = A.freqX(P.freq, pad, iw, 100, 16000); D.rect(g, fx, pad, pad + iw - fx, h1, 'rgba(255,209,102,0.07)'); D.line(g, fx, pad, fx, pad + h1, C.warn, 1); }
        D.text(g, GTL.L('"s" 순간의 스펙트럼 (회색 = 입력, 노란 영역 = 검출 대역)', 'Spectrum at the "s" (gray = input, yellow area = detection band)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 파형과 음절
        const y2 = pad * 2 + h1, cw = iw / COLS;
        D.rect(g, pad, y2, iw, h2, 'rgba(0,0,0,0.35)');
        g.beginPath();
        for (let c = 0; c < COLS; c++) { const px = pad + (c + 0.5) * cw; g.moveTo(px, y2 + h2 / 2 - U.clamp(outD.hi[c], -1, 1) * h2 / 2); g.lineTo(px, y2 + h2 / 2 - U.clamp(outD.lo[c], -1, 1) * h2 / 2 + 0.5); }
        g.strokeStyle = col; g.lineWidth = Math.max(1, cw); g.stroke();
        ['sa', 'si', 'so'].forEach((t, k) => D.text(g, t, pad + iw * (k + 0.1) / 3, y2 + 3, { size: 10, color: C.dim }));
        // 고음 대역 레벨과 게인 리덕션
        const y3 = y2 + h2 + pad, lo = -60, hi = 0, toY = (db) => y3 + h3 - U.clamp((db - lo) / (hi - lo), 0, 1) * h3;
        D.rect(g, pad, y3, iw, h3, 'rgba(0,0,0,0.35)');
        g.beginPath(); for (let c = 0; c < COLS; c++) { const px = pad + (c + 0.5) * cw; c ? g.lineTo(px, toY(levD[c])) : g.moveTo(px, toY(levD[c])); } g.strokeStyle = C.text; g.lineWidth = 1; g.stroke();
        if (P.on) D.line(g, pad, toY(P.threshold), pad + iw, toY(P.threshold), C.warn, 1);
        g.beginPath(); for (let c = 0; c < COLS; c++) { const px = pad + (c + 0.5) * cw, py = y3 + U.clamp(grD[c] / 24, 0, 1) * h3; c ? g.lineTo(px, py) : g.moveTo(px, py); } g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        D.text(g, GTL.L('흰 선 = 검출 대역 레벨, 색 = 게인 리덕션', 'White = detection band level, color = gain reduction'), pad + 4, y3 + 3, { size: 10, color: C.dim });
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.n; D.line(g, px, y2, px, y3 + h3, C.text); }

        ctx.stat(GTL.L('치찰음 피크 감소 (4 kHz 위)', 'Sibilance peak reduction (above 4 kHz)'), stats.sib.toFixed(1) + ' dB');
        ctx.stat(GTL.L('모음 레벨 변화', 'Vowel level change'), (Math.abs(stats.vow) < 0.005 ? 0 : stats.vow).toFixed(2) + ' dB');
        ctx.stat(GTL.L('최대 게인 리덕션', 'Max gain reduction'), stats.maxGr.toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
