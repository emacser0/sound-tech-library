// 크레스트 팩터: 피크와 RMS의 비. 리미터로 피크를 깎으면 같은 피크에서 평균 레벨이 올라가고 다이내믹이 줄어듦
GTL.register({
  id: 'crest-factor-dynamic-range',
  title: '크레스트 팩터와 다이내믹 레인지',
  summary: '크레스트 팩터는 피크와 RMS(평균 크기)의 차이. 두 뷰 모두 피크를 -6 dBFS로 맞췄음. A는 원래 드럼 루프라 크레스트가 크고 평균 레벨이 낮음. B는 리미터로 피크를 12 dB 깎은 뒤 다시 올려서 평균 레벨이 크게 오르지만 타격의 높낮이가 사라짐.',
  views: { a: '원본', b: '리미터 12 dB' },
  controls: '파라미터 표에서 소리 종류와 리미팅 양을 바꿈. 두 뷰의 출력 피크는 항상 -6 dBFS.',
  info: `
    <p><b>크레스트 팩터(Crest Factor)</b> = 피크 / RMS. dB로는 피크 dB - RMS dB. 파형이 얼마나 뾰족한지를 나타냄.</p>
    <ul>
      <li>사각파 0 dB, 사인파 3.01 dB, 백색 잡음 10~13 dB 안팎, 손대지 않은 드럼 녹음 15~20 dB 이상</li>
      <li>디지털 시스템은 피크가 0 dBFS를 넘을 수 없음. 그래서 크레스트가 큰 소리는 평균 레벨(= 들리는 크기)이 작음.</li>
      <li>리미터, 클리퍼로 피크만 깎으면 크레스트가 줄어 같은 피크에서 평균 레벨을 올릴 수 있음. 2000년대 "라우드니스 전쟁"이 이 방법으로 음반을 점점 크게 만듦.</li>
    </ul>
    <p>대가는 다이내믹의 손실. 큰 타격과 작은 타격의 차이, 트랜지언트의 날카로움이 줄어 오래 들으면 피곤함. 요즘 스트리밍은 라우드니스 정규화로 크기를 맞추므로, 크게 만든 곡은 다시 작게 재생되고 손실만 남음. 이 차이를 PLR(피크 대 라우드니스 비)로 보기도 함.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="30" x2="250" y2="30" class="d-dim" stroke-dasharray="4 3"/><text x="250" y="24" text-anchor="end" class="t-small t-dim">${L('피크 (같음)', 'Peak (same)')}</text>
    <path d="M30,140 L34,30 L40,120 L60,135 L80,140 L84,50 L90,125 L110,138 L130,140 L134,32 L140,122 L160,136 L180,140 L184,60 L190,128 L230,140" class="d-a"/>
    <line x1="20" y1="118" x2="250" y2="118" class="d-a" stroke-dasharray="2 2"/><text x="24" y="160" class="t-small t-a">${L('A: RMS 낮음, 크레스트 큼', 'A: low RMS, large crest')}</text>
    <line x1="290" y1="30" x2="520" y2="30" class="d-dim" stroke-dasharray="4 3"/>
    <path d="M300,140 L304,30 L310,40 L330,60 L350,140 L354,30 L360,42 L380,62 L400,140 L404,30 L410,40 L430,60 L450,140 L454,32 L460,44 L500,140" class="d-b"/>
    <line x1="290" y1="70" x2="520" y2="70" class="d-b" stroke-dasharray="2 2"/><text x="294" y="160" class="t-small t-b">${L('B: RMS 높음, 크레스트 작음', 'B: high RMS, small crest')}</text>
    <text x="256" y="100" text-anchor="middle" class="t-small">${L('점선 = RMS', 'dotted = RMS')}</text>
  </svg>`,
  look: [
    '"크레스트 팩터"가 A는 15 dB 안팎, B는 약 5 dB 작음. 두 뷰의 피크는 같은데 B의 RMS가 높음.',
    '오른쪽 레벨 분포에서 B는 샘플이 0 dB(피크) 근처에 몰려 있음',
    '소리 종류를 사인파로 바꾸면 두 뷰 모두 크레스트가 3.0 dB. 리미터가 고르게 줄일 뿐 모양은 그대로.',
    '소리 종류를 사각파로 바꾸면 크레스트가 0 dB. 더 이상 줄일 수 없음.',
    '소리를 켜고 들으면 B가 더 크게 들리지만 킥과 스네어의 타격감이 약함',
  ],
  refs: [
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '크레스트 팩터, 라우드니스 전쟁, K-System' },
    { type: 'paper', title: 'Vickers, "The Loudness War: Background, Speculation, and Recommendations", AES Convention 129, paper 8175', year: 2010, note: '라우드니스 전쟁의 원인과 영향' },
    { type: 'article', title: 'ITU-R BS.1770-4, Algorithms to measure audio programme loudness and true-peak audio level', year: 2015, url: 'https://www.itu.int/rec/R-REC-BS.1770', note: '라우드니스 측정 (PLR 계산의 기준)' },
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed.', year: 2011, note: '피크, RMS 측정과 리미터' },
  ],
  params: [
    { key: 'limit', label: '리미팅 양 (dB)', type: 'range', min: 0, max: 18, step: 0.5, default: 12, a: 0, b: 12, group: '리미터', help: '이만큼 키운 뒤 리미터로 피크를 막음' },
    { key: 'src', label: '소리 종류', type: 'select', options: [{ value: 'drums', label: '드럼 루프' }, { value: 'noise', label: '백색 잡음' }, { value: 'sine', label: '사인파' }, { value: 'square', label: '사각파' }], default: 'drums', shared: true, group: '소스' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Crest Factor and Dynamic Range',
    summary: 'Crest factor is the difference between peak and RMS (average level). Both views are matched to a -6 dBFS peak. A is the original drum loop, so the crest is large and the average level is low. B shaves 12 dB off the peaks with a limiter and turns it back up, so the average level rises a lot, but the ups and downs of the hits disappear.',
    views: { a: 'Original', b: 'Limiter 12 dB' },
    controls: 'Change the sound type and limiting amount in the parameter table. The output peak is always -6 dBFS in both views.',
    info: `
    <p><b>Crest factor</b> = peak / RMS. In dB, peak dB - RMS dB. It shows how spiky a waveform is.</p>
    <ul>
      <li>Square wave 0 dB, sine 3.01 dB, white noise around 10 to 13 dB, untouched drum recordings 15 to 20 dB or more.</li>
      <li>A digital system cannot go above 0 dBFS. So sounds with a large crest have a low average level (= how loud they sound).</li>
      <li>Shaving only the peaks with a limiter or clipper lowers the crest, so you can raise the average level at the same peak. In the 2000s the "loudness war" made records louder and louder this way.</li>
    </ul>
    <p>The cost is lost dynamics. The difference between strong and weak hits and the sharpness of transients shrink, and long listening gets tiring. Streaming services now normalize loudness, so a track made loud is played back quieter and only the loss remains. Some people look at this with PLR (peak to loudness ratio).</p>`,
    look: [
      '"Crest factor" is about 15 dB in A and about 5 dB smaller in B. The peaks are the same, but B\'s RMS is higher.',
      'In the level distribution on the right, B\'s samples pile up near 0 dB (the peak).',
      'Change the sound to sine. Both views show a 3.0 dB crest. The limiter only lowers the level evenly; the shape stays.',
      'Change the sound to square. The crest is 0 dB and cannot go lower.',
      'Turn on sound and listen. B sounds louder, but the kick and snare have less punch.',
    ],
    refs: ['Crest factor, loudness war, K-System.', 'Causes and effects of the loudness war.', 'Loudness measurement (the basis for PLR).', 'Peak and RMS measurement, and limiters.'],
    params: {
      limit: { label: 'Limiting amount (dB)', group: 'Limiter', help: 'Raise by this much, then stop the peaks with a limiter' },
      src: { label: 'Sound type', group: 'Source', options: { drums: 'Drum loop', noise: 'White noise', sine: 'Sine', square: 'Square' } },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, LEN = 2;

    function makeSource(kind, sr) {
      const n = Math.round(LEN * sr), out = new Float32Array(n);
      if (kind === 'sine') for (let i = 0; i < n; i++) out[i] = Math.sin(2 * Math.PI * 110 * i / sr);
      else if (kind === 'square') for (let i = 0; i < n; i++) out[i] = ((110 * i / sr) % 1) < 0.5 ? 1 : -1;
      else if (kind === 'noise') out.set(A.noiseBuffer(n, 13));
      else {
        const beat = LEN / 4, nz = A.noiseBuffer(sr, 2);
        const add = (t0, dur, fn) => { const i0 = Math.round(t0 * sr), m = Math.min(n - i0, Math.round(dur * sr)); for (let i = 0; i < m; i++) out[i0 + i] += fn(i / sr, i); };
        for (let q = 0; q < 4; q++) {
          if (q % 2 === 0) add(q * beat, 0.45, (t) => 0.8 * Math.sin(2 * Math.PI * (48 * t + 140 * (1 - Math.exp(-t * 35)) / 35)) * Math.exp(-t * 7));
          else add(q * beat, 0.3, (t, i) => 0.45 * nz[i % nz.length] * Math.exp(-t * 18) + 0.3 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 25));
          for (let e = 0; e < 4; e++) add(q * beat + e * beat / 4, 0.05, (t, i) => (e % 2 ? 0.05 : 0.1) * (nz[(i * 3 + 7) % nz.length] - nz[(i * 3 + 6) % nz.length]) * Math.exp(-t * 70));
        }
      }
      return A.normalize(out, 1);
    }
    // 룩어헤드 리미터 (실링 1). 슬라이딩 최소 → 릴리스 → 이동 평균, 오디오는 L-1 샘플 지연
    function limitBuf(x, sr, driveDb) {
      const drive = A.dbToLin(driveDb), Lh = Math.round(0.002 * sr), rK = 1 - Math.exp(-1 / (0.06 * sr)), n = x.length;
      const out = new Float32Array(n), qv = new Float32Array(Lh + 2), qi = new Int32Array(Lh + 2), cap = Lh + 2, box = new Float32Array(Lh).fill(1);
      let qh = 0, qn = 0, env = 1, bsum = Lh, bp = 0;
      // 루프이므로 두 바퀴 돌려서 두 번째 결과를 씀
      for (let pass = 0; pass < 2; pass++) {
        for (let j = 0; j < n; j++) {
          const idx = pass * n + j, v = x[j] * drive, req = Math.min(1, 1 / Math.max(1e-9, Math.abs(v)));
          while (qn > 0 && qv[(qh + qn - 1) % cap] >= req) qn--;
          qv[(qh + qn) % cap] = req; qi[(qh + qn) % cap] = idx; qn++;
          while (qi[qh] <= idx - Lh - 1) { qh = (qh + 1) % cap; qn--; }
          const hold = qv[qh];
          env = hold < env ? hold : env + (hold - env) * rK;
          bsum += env - box[bp]; box[bp] = env; bp = (bp + 1) % Lh;
          if (pass === 1) { const k = (j - (Lh - 1) + n) % n; out[k] = x[k] * drive * (bsum / Lh); }
        }
      }
      return out;
    }

    let srcKey = '', src = null;
    let key = '', out, hist, outD, stats;
    function analyze() {
      if (srcKey !== P.src) { src = makeSource(P.src, SR); srcKey = P.src; }
      const k = P.src + ',' + P.limit;
      if (k === key) return;
      key = k;
      out = P.limit > 0 ? limitBuf(src, SR, P.limit) : Float32Array.from(src);
      A.normalize(out, 0.5);
      const N = out.length, COLS = 480, lo = new Float32Array(COLS), hi = new Float32Array(COLS);
      for (let c = 0; c < COLS; c++) { let a = 0, b = 0; for (let i = Math.floor(c * N / COLS); i < Math.floor((c + 1) * N / COLS); i++) { a = Math.min(a, out[i]); b = Math.max(b, out[i]); } lo[c] = a; hi[c] = b; }
      outD = { lo, hi };
      // 피크 기준 레벨 분포 (-48 ~ 0 dB, 2 dB 간격)
      hist = new Float32Array(24);
      for (let i = 0; i < N; i++) { const d = A.linToDb(out[i] / 0.5); if (d > -48) hist[Math.min(23, Math.floor((d + 48) / 2))]++; }
      let hm = 0; for (const v of hist) hm = Math.max(hm, v); for (let i = 0; i < 24; i++) hist[i] /= hm || 1;
      const pk = A.linToDb(A.peak(out)), rm = A.linToDb(A.rms(out));
      stats = { pk, rm, crest: pk - rm };
    }

    let liveBuf = null, liveKey = '', pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        const k = P.src + ',' + P.limit + ',' + sr;
        if (k !== liveKey) {
          const s = makeSource(P.src, sr), o = P.limit > 0 ? limitBuf(s, sr, P.limit) : s;
          liveBuf = A.normalize(o, 0.5); liveKey = k; pos = pos % liveBuf.length;
        }
        const gain = P.src === 'drums' ? 1 : 0.5;
        for (let i = 0; i < n; i++) { const y = liveBuf[pos] * gain; l[i] = y; r[i] = y; pos = (pos + 1) % liveBuf.length; }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10;
        const ww = Math.max(120, W * 0.62), wh = H - pad * 2, N = out.length;
        // 파형 (진폭 1 = 0 dBFS). 피크와 RMS 선
        D.rect(g, pad, pad, ww, wh, 'rgba(0,0,0,0.35)');
        const mid = pad + wh / 2, cols = outD.lo.length, cw = ww / cols;
        const zoom = P.src === 'sine' || P.src === 'square';
        if (zoom) A.drawWave(g, out, pad, pad, ww, wh, { count: Math.round(SR / 110 * 4), color: col, background: false, axis: false });
        else {
          g.beginPath();
          for (let c = 0; c < cols; c++) { const px = pad + (c + 0.5) * cw; g.moveTo(px, mid - outD.hi[c] * wh / 2); g.lineTo(px, mid - outD.lo[c] * wh / 2 + 0.5); }
          g.strokeStyle = col; g.lineWidth = Math.max(1, cw); g.stroke();
        }
        const pkA = A.dbToLin(stats.pk), rmA = A.dbToLin(stats.rm);
        for (const s of [1, -1]) { D.line(g, pad, mid - s * pkA * wh / 2, pad + ww, mid - s * pkA * wh / 2, C.text, 1); D.line(g, pad, mid - s * rmA * wh / 2, pad + ww, mid - s * rmA * wh / 2, C.warn, 1.5); }
        D.text(g, GTL.L('흰 선 = 피크, 노란 선 = RMS', 'White = peak, yellow = RMS'), pad + 4, pad + 3, { size: 10, color: C.dim });
        if (snd.on && liveBuf && !zoom) { const px = pad + ww * pos / liveBuf.length; D.line(g, px, pad, px, pad + wh, C.text); }
        // 레벨 분포
        const hx = pad * 2 + ww, hw = W - hx - pad;
        if (hw > 40) {
          D.rect(g, hx, pad, hw, wh, 'rgba(0,0,0,0.35)');
          const bh = (wh - 30) / 24;
          for (let i = 0; i < 24; i++) { const y = pad + 16 + (23 - i) * bh; D.rect(g, hx + 2, y, (hw - 4) * hist[i], bh - 1, col); }
          D.text(g, GTL.L('레벨 분포', 'Level histogram'), hx + 4, pad + 3, { size: 10, color: C.dim });
          D.text(g, GTL.L('0 dB (피크)', '0 dB (peak)'), hx + hw - 4, pad + 16, { size: 9, color: C.dim, align: 'right' });
          D.text(g, '-48 dB', hx + hw - 4, pad + wh - 14, { size: 9, color: C.dim, align: 'right' });
        }

        ctx.stat(GTL.L('크레스트 팩터', 'Crest factor'), stats.crest.toFixed(1) + ' dB');
        ctx.stat(GTL.L('피크', 'Peak'), stats.pk.toFixed(1) + ' dBFS');
        ctx.stat('RMS', stats.rm.toFixed(1) + ' dBFS');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
