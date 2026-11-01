// 라우드니스 (LUFS): 피크 정규화는 클립마다 들리는 크기가 다르고, 라우드니스 정규화는 크기가 고르게 맞음
GTL.register({
  id: 'loudness-lufs',
  title: '라우드니스 정규화 (LUFS, ITU-R BS.1770)',
  summary: '서로 다른 소리 4개를 이어 재생함. A는 피크를 똑같이 맞춰서(피크 정규화) 클립마다 들리는 크기가 10 dB 넘게 차이 남. B는 K 가중 라우드니스(LUFS)를 똑같이 맞춰서 크기가 고르게 들림.',
  views: { a: '피크 정규화 (-6 dBFS)', b: '라우드니스 정규화 (-23 LUFS)' },
  controls: '파라미터 표에서 정규화 방식과 목표값을 바꿈. "소리 켜기"를 누르면 클립 4개가 차례로 반복됨.',
  info: `
    <p>피크(최대 샘플 값)는 사람이 느끼는 크기와 잘 맞지 않음. 짧은 타격 하나로 피크가 정해지는 소리는 평균 에너지가 작고, 꽉 찬 화음은 같은 피크라도 훨씬 크게 들림. 귀는 2~5 kHz에 민감하고 저음에 둔감한 것도 이유.</p>
    <p><b>ITU-R BS.1770</b>은 방송과 스트리밍에서 쓰는 라우드니스 측정 표준. 단위는 <b>LUFS</b>(LKFS, 풀 스케일 기준 라우드니스 단위). 차이는 <b>LU</b>(1 LU = 1 dB).</p>
    <ul>
      <li><b>K 가중 필터</b>: 1.5 kHz 위를 약 +4 dB 올리는 셸빙 필터(머리의 음향 효과 모델) + 38 Hz 하이패스(저음 감도 저하 모델)</li>
      <li><b>평균 제곱</b>: 400 ms 블록을 75% 겹쳐 계산. 라우드니스 = -0.691 + 10 log10(평균 제곱).</li>
      <li><b>게이팅</b>: -70 LUFS 아래 블록(절대 게이트)과, 1차 평균보다 10 LU 낮은 블록(상대 게이트)을 빼고 평균을 다시 냄. 조용한 구간이 평균을 끌어내리지 않게 함.</li>
    </ul>
    <p>목표값의 예: EBU R128 방송 -23 LUFS, 미국 ATSC A/85 -24 LKFS, 스트리밍 서비스 대부분 -14~-16 LUFS. 이 샘플은 모노 신호 한 채널로 측정함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="6" y="20" width="60" height="28" class="f-dim"/><text x="36" y="38" text-anchor="middle" class="t-small">${L('입력', 'Input')}</text>
    <rect x="92" y="20" width="96" height="28" class="f-dim"/><text x="140" y="38" text-anchor="middle" class="t-small">${L('셸빙 +4 dB', 'Shelf +4 dB')}</text>
    <rect x="212" y="20" width="96" height="28" class="f-dim"/><text x="260" y="38" text-anchor="middle" class="t-small">${L('HPF 38 Hz', 'HPF 38 Hz')}</text>
    <rect x="332" y="20" width="96" height="28" class="f-dim"/><text x="380" y="38" text-anchor="middle" class="t-small">${L('400 ms 제곱 평균', '400 ms mean square')}</text>
    <rect x="452" y="20" width="84" height="28" class="f-dim"/><text x="494" y="38" text-anchor="middle" class="t-small">${L('게이팅', 'Gating')}</text>
    <path d="M66,34 L90,34" class="d-accent" marker-end="url(#arr)"/><path d="M188,34 L210,34" class="d-accent" marker-end="url(#arr)"/><path d="M308,34 L330,34" class="d-accent" marker-end="url(#arr)"/><path d="M428,34 L450,34" class="d-accent" marker-end="url(#arr)"/>
    <text x="140" y="66" text-anchor="middle" class="t-small t-dim">${L('K 가중', 'K-weighting')}</text>
    <line x1="92" y1="58" x2="308" y2="58" class="d-dim"/>
    <path d="M20,150 L120,150 L140,140 L170,120 L520,120" class="d-b"/>
    <path d="M20,175 L50,150" class="d-b"/>
    <text x="20" y="100" class="t-small">${L('K 가중 응답 (대략)', 'K-weighting response (approx.)')}</text>
    <text x="40" y="168" class="t-small t-dim">20 Hz</text><text x="160" y="168" class="t-small t-dim">1.5 kHz</text><text x="470" y="140" class="t-small t-b">+4 dB</text>
    <text x="300" y="168" class="t-small t-dim">${L('결과: 통합 라우드니스 (LUFS)', 'Result: integrated loudness (LUFS)')}</text>
  </svg>`,
  look: [
    '위 막대 그래프에서 A는 피크(흰 눈금)가 모두 같고 라우드니스 막대 높이가 제각각. B는 막대 높이가 같고 피크가 제각각.',
    '"클립 간 라우드니스 차이"가 A는 10 LU 넘게, B는 0 LU',
    '소리를 켜고 A를 들으면 하이햇 클립에서 작아지고 저음 사인, 꽉 찬 화음 클립에서 커짐',
    'B의 목표를 -14 LUFS로 올리면 하이햇 클립의 피크가 0 dBFS를 넘어 눈금이 빨갛게 바뀜. 라우드니스 정규화에도 피크 제한이 필요한 이유.',
  ],
  refs: [
    { type: 'article', title: 'ITU-R BS.1770-4, Algorithms to measure audio programme loudness and true-peak audio level', year: 2015, url: 'https://www.itu.int/rec/R-REC-BS.1770', note: 'K 가중 필터, 게이팅, LKFS 정의' },
    { type: 'article', title: 'EBU R 128, Loudness normalisation and permitted maximum level of audio signals', year: 2020, url: 'https://tech.ebu.ch/publications/r128', note: '방송 목표 -23 LUFS와 측정 방법' },
    { type: 'article', title: 'ATSC A/85, Techniques for Establishing and Maintaining Audio Loudness for Digital Television', year: 2013, note: '미국 방송 -24 LKFS' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '라우드니스 전쟁과 라우드니스 정규화' },
  ],
  params: [
    { key: 'mode', label: '정규화 방식', type: 'select', options: [{ value: 'peak', label: '피크' }, { value: 'loud', label: '라우드니스' }], default: 'loud', a: 'peak', b: 'loud', group: '정규화' },
    { key: 'peakT', label: '피크 목표 (dBFS)', type: 'range', min: -18, max: 0, step: 0.5, default: -6, when: (p) => p.mode === 'peak' },
    { key: 'loudT', label: '라우드니스 목표 (LUFS)', type: 'range', min: -36, max: -14, step: 0.5, default: -23, when: (p) => p.mode === 'loud' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Loudness Normalization (LUFS, ITU-R BS.1770)',
    summary: 'Four different sounds play one after another. A matches their peaks (peak normalization), so the perceived level of the clips differs by more than 10 dB. B matches their K-weighted loudness (LUFS), so they sound evenly loud.',
    views: { a: 'Peak normalization (-6 dBFS)', b: 'Loudness normalization (-23 LUFS)' },
    controls: 'Change the normalization method and target in the parameter table. Press "Sound on" to loop the four clips in order.',
    info: `
    <p>The peak (largest sample value) does not match perceived loudness well. A sound whose peak comes from one short hit has little average energy, while a dense chord sounds much louder at the same peak. The ear is also most sensitive at 2 to 5 kHz and less sensitive to lows.</p>
    <p><b>ITU-R BS.1770</b> is the loudness measurement standard used in broadcast and streaming. The unit is <b>LUFS</b> (LKFS, loudness units relative to full scale). Differences are in <b>LU</b> (1 LU = 1 dB).</p>
    <ul>
      <li><b>K-weighting filter</b>: a shelf that raises above 1.5 kHz by about +4 dB (models the acoustic effect of the head) plus a 38 Hz high pass (models lower bass sensitivity).</li>
      <li><b>Mean square</b>: computed on 400 ms blocks with 75% overlap. Loudness = -0.691 + 10 log10(mean square).</li>
      <li><b>Gating</b>: drop blocks below -70 LUFS (absolute gate) and blocks 10 LU below the first average (relative gate), then average again. Quiet parts do not pull the average down.</li>
    </ul>
    <p>Example targets: EBU R128 broadcast -23 LUFS, US ATSC A/85 -24 LKFS, most streaming services -14 to -16 LUFS. This sample measures a single mono channel.</p>`,
    look: [
      'In the bar chart at the top, A has equal peaks (white ticks) but bars of different height. B has equal bars and different peaks.',
      '"Loudness spread across clips" is more than 10 LU in A and 0 LU in B.',
      'Turn on sound and listen to A. The hi-hat clip gets quiet, and the sub bass and dense chord clips get loud.',
      'Raise B\'s target to -14 LUFS. The peak of the hi-hat clip goes over 0 dBFS and its tick turns red. This is why loudness normalization also needs a peak limit.',
    ],
    refs: ['K-weighting filter, gating, LKFS definition.', 'Broadcast target -23 LUFS and how to measure.', 'US broadcast -24 LKFS.', 'The loudness war and loudness normalization.'],
    params: {
      mode: { label: 'Normalization', group: 'Normalization', options: { peak: 'Peak', loud: 'Loudness' } },
      peakT: 'Peak target (dBFS)',
      loudT: 'Loudness target (LUFS)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 48000, CLIP = 2;
    const NAMES = () => [GTL.L('저음 사인', 'Sub bass'), GTL.L('하이햇', 'Hi-hat'), GTL.L('뜯는 음', 'Plucks'), GTL.L('꽉 찬 화음', 'Dense chord')];

    // 클립 4개. 각 피크는 대략 1로 만들어 둠 (정규화는 나중에 게인으로)
    function makeClips(sr) {
      const n = Math.round(CLIP * sr), nz = A.noiseBuffer(n, 77);
      const c0 = new Float32Array(n), c1 = new Float32Array(n), c2 = new Float32Array(n), c3 = new Float32Array(n);
      const hp = A.biquad('highpass', 6000, 0.7, 0, sr), lp = A.biquad('lowpass', 2500, 0.7, 0, sr), lp2 = A.biquad('lowpass', 3000, 0.7, 0, sr);
      for (let i = 0; i < n; i++) {
        const t = i / sr, env = Math.min(1, t / 0.02, (CLIP - t) / 0.05);
        c0[i] = (0.8 * Math.sin(2 * Math.PI * 40 * t) + 0.2 * Math.sin(2 * Math.PI * 80 * t)) * env;
        c1[i] = hp.process(nz[i]) * Math.exp(-(t % 0.25) * 70);
        const tp = t % 0.5, f = A.mtof([60, 67, 64, 72][Math.floor(t / 0.5) % 4]);
        let v = 0; for (let h = 1; h <= 4; h++) v += Math.sin(2 * Math.PI * f * h * t) / h;
        c2[i] = lp.process(v) * Math.exp(-tp * 14);
        let s = 0; for (const m of [48, 55, 60, 64, 67, 71]) { const ff = A.mtof(m); s += 2 * ((ff * t) % 1) - 1; s += 2 * ((ff * 1.003 * t + 0.3) % 1) - 1; }
        c3[i] = lp2.process(s) * env;
      }
      return [c0, c1, c2, c3].map((c) => { A.normalize(c, 1); return c; });
    }
    // BS.1770 K 가중 계수 (샘플레이트 일반식, libebur128 방식)
    function kFilters(sr) {
      let f0 = 1681.974450955533, G = 3.999843853973347, Q = 0.7071752369554196;
      let K = Math.tan(Math.PI * f0 / sr), Vh = Math.pow(10, G / 20), Vb = Math.pow(Vh, 0.4996667741545416);
      let a0 = 1 + K / Q + K * K;
      const s1 = { b0: (Vh + Vb * K / Q + K * K) / a0, b1: 2 * (K * K - Vh) / a0, b2: (Vh - Vb * K / Q + K * K) / a0, a1: 2 * (K * K - 1) / a0, a2: (1 - K / Q + K * K) / a0 };
      f0 = 38.13547087602444; Q = 0.5003270373238773; K = Math.tan(Math.PI * f0 / sr);
      a0 = 1 + K / Q + K * K;
      const s2 = { b0: 1, b1: -2, b2: 1, a1: 2 * (K * K - 1) / a0, a2: (1 - K / Q + K * K) / a0 };
      return [s1, s2];
    }
    function kWeight(x, sr) {
      let cur = x;
      for (const c of kFilters(sr)) {
        const out = new Float32Array(x.length);
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        for (let i = 0; i < x.length; i++) { const v = cur[i], y = c.b0 * v + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = y; out[i] = y; }
        cur = out;
      }
      return cur;
    }
    // 통합 라우드니스 (게이팅 포함)
    function integrated(kw, sr) {
      const blk = Math.round(0.4 * sr), hop = Math.round(0.1 * sr), zs = [];
      for (let s = 0; s + blk <= kw.length; s += hop) { let z = 0; for (let i = s; i < s + blk; i++) z += kw[i] * kw[i]; zs.push(z / blk); }
      const lk = (z) => -0.691 + 10 * Math.log10(Math.max(1e-20, z));
      const abs = zs.filter((z) => lk(z) > -70);
      if (!abs.length) return -70;
      const rel = lk(abs.reduce((a, b) => a + b, 0) / abs.length) - 10;
      const g2 = abs.filter((z) => lk(z) > rel);
      return lk(g2.reduce((a, b) => a + b, 0) / g2.length);
    }

    const clips = makeClips(SR);
    const info = clips.map((c) => {
      const kw = kWeight(c, SR);
      // 모멘터리 (400 ms 창, 100 ms 간격)
      const blk = Math.round(0.4 * SR), hop = Math.round(0.1 * SR), mom = [];
      for (let s = 0; s + hop <= c.length; s += hop) { let z = 0, cnt = 0; for (let i = Math.max(0, s + hop - blk); i < s + hop; i++) { z += kw[i] * kw[i]; cnt++; } mom.push(-0.691 + 10 * Math.log10(Math.max(1e-20, z / cnt))); }
      return { lufs: integrated(kw, SR), peak: A.linToDb(A.peak(c)), mom };
    });
    const gainsDb = () => info.map((c) => (P.mode === 'peak' ? P.peakT - c.peak : P.loudT - c.lufs));

    let live = null, liveSr = 0, pos = 0, gl = [1, 1, 1, 1];
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { live = makeClips(sr); liveSr = sr; pos = 0; }
        const gd = gainsDb(), len = live[0].length, tot = len * 4, k = 1 - Math.exp(-1 / (0.005 * sr));
        for (let i = 0; i < n; i++) {
          const c = Math.floor(pos / len), j = pos - c * len;
          gl[c] += (A.dbToLin(gd[c]) - gl[c]) * k;
          const y = live[c][j] * gl[c];
          l[i] = y; r[i] = y;
          pos = (pos + 1) % tot;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2, gd = gainsDb(), nm = NAMES();
        const head = snd.on && live ? pos / (live[0].length * 4) : (ctx.time / (CLIP * 4)) % 1, cur = Math.min(3, Math.floor(head * 4));
        // 클립별 막대: 라우드니스(막대)와 피크(흰 눈금)
        const h1 = (H - pad * 3) * 0.55, lo = -48, hi = 0, toY = (db) => pad + 16 + (h1 - 32) * (1 - U.clamp((db - lo) / (hi - lo), 0, 1));
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        for (let db = -42; db <= 0; db += 6) { D.line(g, pad, toY(db), pad + iw, toY(db), C.grid); D.text(g, String(db), pad + 2, toY(db) - 10, { size: 9, color: C.dim }); }
        const tgt = P.mode === 'peak' ? null : P.loudT;
        if (tgt != null) { D.line(g, pad, toY(tgt), pad + iw, toY(tgt), C.warn, 1); D.text(g, GTL.L('목표', 'Target'), pad + iw - 4, toY(tgt) - 11, { size: 9, color: C.warn, align: 'right' }); }
        const bw = iw / 4;
        info.forEach((c, k) => {
          const x = pad + bw * k + bw * 0.28, w = bw * 0.44, lu = c.lufs + gd[k], pk = c.peak + gd[k];
          D.rect(g, x, toY(lu), w, toY(lo) - toY(lu), col);
          if (k !== cur) D.rect(g, x, toY(lu), w, toY(lo) - toY(lu), 'rgba(20,22,26,0.45)');
          D.line(g, x - 4, toY(pk), x + w + 4, toY(pk), pk > -0.1 ? C.bad : C.text, 2);
          D.text(g, lu.toFixed(1), x + w / 2, toY(lu) + 2, { size: 9, align: 'center', color: C.bg });
          D.text(g, nm[k], x + w / 2, pad + h1 - 14, { size: 9, align: 'center', color: k === cur ? C.text : C.dim });
        });
        D.text(g, GTL.L('클립별 통합 라우드니스 (막대, LUFS)와 피크 (흰 눈금, dBFS)', 'Integrated loudness per clip (bar, LUFS) and peak (white tick, dBFS)'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 모멘터리 라우드니스 타임라인
        const y2 = pad * 2 + h1, h2 = H - y2 - pad, mlo = -50, mhi = 0, toY2 = (db) => y2 + h2 - U.clamp((db - mlo) / (mhi - mlo), 0, 1) * h2;
        D.rect(g, pad, y2, iw, h2, 'rgba(0,0,0,0.35)');
        for (let db = -40; db < 0; db += 10) D.line(g, pad, toY2(db), pad + iw, toY2(db), C.grid);
        g.beginPath();
        const total = info.reduce((a, c) => a + c.mom.length, 0);
        let idx = 0;
        info.forEach((c, k) => c.mom.forEach((m) => { const px = pad + iw * idx / (total - 1), py = toY2(m + gd[k]); idx ? g.lineTo(px, py) : g.moveTo(px, py); idx++; }));
        g.strokeStyle = col; g.lineWidth = 2; g.stroke();
        for (let k = 1; k < 4; k++) D.line(g, pad + iw * k / 4, y2, pad + iw * k / 4, y2 + h2, C.dim);
        if (tgt != null) D.line(g, pad, toY2(tgt), pad + iw, toY2(tgt), C.warn, 1);
        const px = pad + iw * head; D.line(g, px, y2, px, y2 + h2, C.text);
        D.text(g, GTL.L('모멘터리 라우드니스 (400 ms, -50 ~ 0 LUFS)', 'Momentary loudness (400 ms, -50 to 0 LUFS)'), pad + 4, y2 + 3, { size: 10, color: C.dim });

        const lus = info.map((c, k) => c.lufs + gd[k]);
        ctx.stat(GTL.L('클립 간 라우드니스 차이', 'Loudness spread across clips'), (Math.max(...lus) - Math.min(...lus)).toFixed(1) + ' LU');
        ctx.stat(GTL.L('지금 클립', 'Current clip'), `${nm[cur]}: ${lus[cur].toFixed(1)} LUFS, ${GTL.L('피크', 'peak')} ${(info[cur].peak + gd[cur]).toFixed(1)} dBFS`);
        ctx.stat(GTL.L('지금 클립에 건 게인', 'Gain on current clip'), (gd[cur] >= 0 ? '+' : '') + gd[cur].toFixed(1) + ' dB');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
