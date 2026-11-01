// 룩어헤드 리미터: 미리 보지 않는 리미터는 피크가 실링을 넘고, 룩어헤드 리미터는 넘지 않음
GTL.register({
  id: 'lookahead-limiter',
  title: '룩어헤드 리미터 (오버슈트 없는 브릭월)',
  summary: '리미터는 출력이 실링(최대 레벨)을 넘지 않게 막는 장치. A는 소리를 들은 뒤에 반응해서 킥과 스네어의 첫 피크가 실링을 넘음. B는 신호를 3 ms 늦추고 미리 본 피크에 맞춰 게인을 내려서 한 샘플도 넘지 않음.',
  views: { a: '룩어헤드 없음', b: '룩어헤드 3 ms' },
  controls: '파라미터 표에서 드라이브(입력 게인)와 실링을 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>리미터(Limiter)</b>는 레이쇼가 무한대에 가까운 컴프레서. 마스터 출력이나 방송 송출에서 디지털 클리핑을 막으려고 맨 끝에 둠.</p>
    <p>보통 컴프레서는 피크를 보고 나서 게인을 내림. 어택이 아무리 짧아도 이미 지나간 샘플은 줄일 수 없어서 트랜지언트 앞부분이 실링을 넘음(오버슈트). 어택을 0으로 하면 넘지는 않지만 게인이 파형 모양대로 꺾여 일그러짐이 커짐.</p>
    <p><b>룩어헤드(Lookahead)</b>는 오디오를 몇 ms 지연시키고, 지연 전의 신호로 앞으로 올 피크를 미리 봄. 이 샘플의 B는 다음 순서로 동작함.</p>
    <ul>
      <li>샘플마다 필요한 게인 = min(1, 실링 / |x|)</li>
      <li>룩어헤드 길이 동안의 최소값을 유지(슬라이딩 최소)</li>
      <li>릴리스로 천천히 회복시킨 뒤, 같은 길이의 이동 평균으로 매끄럽게 내림</li>
      <li>이동 평균이 끝나는 시점에 피크가 도착하도록 오디오를 지연</li>
    </ul>
    <p>단점: 룩어헤드만큼 지연(레이턴시)이 생김. 실시간 연주 모니터링, 게임 효과음처럼 지연이 문제가 되는 곳에서는 짧게 씀.</p>`,
  diagram: (L) => `<svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" class="m-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
    <rect x="10" y="20" width="80" height="30" class="f-dim"/><text x="50" y="40" text-anchor="middle" class="t-small">${L('입력', 'Input')}</text>
    <rect x="150" y="20" width="110" height="30" class="f-dim"/><text x="205" y="40" text-anchor="middle" class="t-small">${L('지연 (룩어헤드)', 'Delay (lookahead)')}</text>
    <circle cx="330" cy="35" r="12" class="f-dim"/><text x="330" y="39" text-anchor="middle">×</text>
    <rect x="410" y="20" width="110" height="30" class="f-dim"/><text x="465" y="40" text-anchor="middle" class="t-small">${L('출력', 'Output')}</text>
    <path d="M90,35 L148,35" class="d-accent" marker-end="url(#arr)"/><path d="M260,35 L316,35" class="d-accent" marker-end="url(#arr)"/><path d="M342,35 L408,35" class="d-accent" marker-end="url(#arr)"/>
    <path d="M120,35 L120,110 L148,110" class="d-accent" marker-end="url(#arr)"/>
    <rect x="150" y="95" width="110" height="30" class="f-dim"/><text x="205" y="114" text-anchor="middle" class="t-small">${L('필요 게인, 최소 유지', 'Needed gain, hold min')}</text>
    <path d="M260,110 L278,110" class="d-accent" marker-end="url(#arr)"/>
    <rect x="280" y="95" width="100" height="30" class="f-dim"/><text x="330" y="114" text-anchor="middle" class="t-small">${L('이동 평균', 'Moving average')}</text>
    <path d="M330,95 L330,49" class="d-accent" marker-end="url(#arr)"/>
    <text x="10" y="150" class="t-small t-b">${L('게인은 피크가 도착하기 전에 미리 다 내려가 있음', 'The gain is already down before the peak arrives')}</text>
    <text x="10" y="170" class="t-small t-a">${L('룩어헤드가 없으면 피크를 본 뒤에야 내리기 시작해 첫 부분이 넘침', 'Without lookahead, the gain starts to fall only after the peak, so the start overshoots')}</text>
  </svg>`,
  look: [
    '가운데 확대 그림에서 A의 출력은 킥의 첫 봉우리가 빨간 실링 선을 넘음. B는 실링 아래에 머묾.',
    '"실링 초과 샘플" 측정값이 A는 수백 개, B는 0개',
    'A의 어택을 0.01 ms로 줄이면 초과는 거의 사라지지만 게인 선이 파형을 따라 톱니처럼 꺾임',
    'B의 룩어헤드를 0.2 ms로 줄이면 게인이 급하게 꺾이고, 5 ms로 늘리면 레이턴시 값이 그만큼 커짐',
    '드라이브를 18 dB로 올리면 두 뷰 모두 게인 리덕션이 커지고 A의 초과량도 커짐',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Chapter 4', year: 2011, note: '룩어헤드를 쓰는 리미터 구조' },
    { type: 'paper', title: 'Giannoulis, Massberg, Reiss, "Digital Dynamic Range Compressor Design: A Tutorial and Analysis", JAES 60(6)', year: 2012, note: '리미터를 레이쇼 무한대의 컴프레서로 보는 관점' },
    { type: 'book', title: 'Bob Katz, Mastering Audio: The Art and the Science, 3rd ed.', year: 2015, note: '마스터링 리미터, 오버, 트루 피크' },
    { type: 'article', title: 'ITU-R BS.1770-4, Algorithms to measure audio programme loudness and true-peak audio level', year: 2015, url: 'https://www.itu.int/rec/R-REC-BS.1770', note: '샘플 피크와 트루 피크 측정' },
  ],
  params: [
    { key: 'mode', label: '방식', type: 'select', options: [{ value: 'none', label: '룩어헤드 없음' }, { value: 'look', label: '룩어헤드' }], default: 'look', a: 'none', b: 'look', group: '리미터' },
    { key: 'attack', label: '어택 (ms)', type: 'range', min: 0.01, max: 5, step: 0.01, default: 1, when: (p) => p.mode === 'none' },
    { key: 'look', label: '룩어헤드 (ms)', type: 'range', min: 0.2, max: 10, step: 0.1, default: 3, when: (p) => p.mode === 'look' },
    { key: 'release', label: '릴리스 (ms)', type: 'range', min: 10, max: 500, step: 5, default: 80 },
    { key: 'ceiling', label: '실링 (dBFS)', type: 'range', min: -12, max: 0, step: 0.5, default: -6, shared: true, group: '레벨' },
    { key: 'drive', label: '드라이브 (dB)', type: 'range', min: 0, max: 18, step: 0.5, default: 9, shared: true },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Lookahead Limiter (Brickwall Without Overshoot)',
    summary: 'A limiter keeps the output from going over the ceiling (maximum level). A reacts after it hears the sound, so the first peak of kicks and snares goes over the ceiling. B delays the signal by 3 ms and lowers the gain for peaks it sees ahead, so not a single sample goes over.',
    views: { a: 'No lookahead', b: 'Lookahead 3 ms' },
    controls: 'Change drive (input gain) and ceiling in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>A <b>limiter</b> is a compressor with a ratio close to infinity. It sits at the very end of a master or broadcast chain to prevent digital clipping.</p>
    <p>A normal compressor lowers the gain after it sees a peak. Even with a very short attack, it cannot reduce samples that have already passed, so the start of a transient goes over the ceiling (overshoot). With zero attack it does not overshoot, but the gain bends with the waveform and adds distortion.</p>
    <p><b>Lookahead</b> delays the audio by a few ms and uses the undelayed signal to see peaks before they arrive. B in this sample works like this:</p>
    <ul>
      <li>Needed gain per sample = min(1, ceiling / |x|).</li>
      <li>Hold the minimum over the lookahead length (sliding minimum).</li>
      <li>Recover slowly with release, then smooth the drop with a moving average of the same length.</li>
      <li>Delay the audio so the peak arrives when the moving average reaches its lowest value.</li>
    </ul>
    <p>Downside: lookahead adds delay (latency). Where delay matters, such as live monitoring or game sound effects, keep it short.</p>`,
    look: [
      'In the zoom in the middle, A\'s output goes over the red ceiling line at the first peak of the kick. B stays below it.',
      'The "Samples over ceiling" stat is in the hundreds for A and 0 for B.',
      'Lower A\'s attack to 0.01 ms. Overs almost disappear, but the gain line bends like a saw tooth along the waveform.',
      'Lower B\'s lookahead to 0.2 ms and the gain drops sharply. Raise it to 5 ms and the latency grows by the same amount.',
      'Raise drive to 18 dB. Gain reduction grows in both views, and A\'s overshoot grows too.',
    ],
    refs: ['Limiter structure with lookahead.', 'A limiter seen as a compressor with infinite ratio.', 'Mastering limiters, overs and true peak.', 'Measuring sample peak and true peak.'],
    params: {
      mode: { label: 'Method', group: 'Limiter', options: { none: 'No lookahead', look: 'Lookahead' } },
      attack: 'Attack (ms)',
      look: 'Lookahead (ms)',
      release: 'Release (ms)',
      ceiling: { label: 'Ceiling (dBFS)', group: 'Level' },
      drive: 'Drive (dB)',
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, BPM = 120;

    function makeSource(sr) {
      const beat = 60 / BPM, n = Math.round(beat * 4 * sr), out = new Float32Array(n), nz = A.noiseBuffer(sr, 9);
      const add = (t0, dur, fn) => { const i0 = Math.round(t0 * sr), m = Math.min(n - i0, Math.round(dur * sr)); for (let i = 0; i < m; i++) out[i0 + i] += fn(i / sr, i); };
      for (let q = 0; q < 4; q++) {
        if (q % 2 === 0) add(q * beat, 0.45, (t) => 0.5 * Math.sin(2 * Math.PI * (50 * t + 160 * (1 - Math.exp(-t * 40)) / 40)) * Math.exp(-t * 7));
        else add(q * beat, 0.3, (t, i) => 0.35 * nz[i % nz.length] * Math.exp(-t * 18) + 0.2 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 25));
      }
      const f = A.mtof(36);
      add(0, n / sr, (t) => 0.12 * Math.sin(2 * Math.PI * f * t) * (0.6 + 0.4 * Math.sin(2 * Math.PI * t / (beat * 4))));
      return out;
    }

    // 리미터 상태. 룩어헤드 L 샘플 (L = 0이면 일반 피크 리미터)
    function newLim(sr) {
      const L = Math.max(1, Math.round(P.look * 0.001 * sr)), cap = L + 2;
      return { sr, L, mode: P.mode, g: 1, env: 1, delay: new Float32Array(Math.max(1, L - 1)), dp: 0, qv: new Float32Array(cap), qi: new Int32Array(cap), qh: 0, qn: 0, cap, box: new Float32Array(L), bp: 0, bsum: L, n: 0 };
    }
    function step(s, x, k) {
      const req = Math.min(1, k.ceil / Math.max(1e-9, Math.abs(x)));
      if (s.mode === 'none') {
        s.g += (req - s.g) * (req < s.g ? k.aK : k.rK);
        return x * s.g;
      }
      // 슬라이딩 최소 (단조 덱)
      const { qv, qi, cap } = s;
      while (s.qn > 0 && qv[(s.qh + s.qn - 1) % cap] >= req) s.qn--;
      qv[(s.qh + s.qn) % cap] = req; qi[(s.qh + s.qn) % cap] = s.n; s.qn++;
      while (qi[s.qh] <= s.n - s.L - 1) { s.qh = (s.qh + 1) % cap; s.qn--; }
      const hold = qv[s.qh];
      s.env = hold < s.env ? hold : s.env + (hold - s.env) * k.rK;
      // 이동 평균
      s.bsum += s.env - s.box[s.bp]; s.box[s.bp] = s.env; s.bp = (s.bp + 1) % s.L;
      s.g = s.bsum / s.L;
      // L-1 샘플 지연. 이동 평균이 가장 낮아지는 순간에 피크가 도착함
      let y = x;
      if (s.L > 1) { y = s.delay[s.dp]; s.delay[s.dp] = x; s.dp = (s.dp + 1) % (s.L - 1); }
      s.n++;
      return y * s.g;
    }
    function coefs(sr) {
      return { ceil: A.dbToLin(P.ceiling), drive: A.dbToLin(P.drive), aK: 1 - Math.exp(-1 / (P.attack * 0.001 * sr)), rK: 1 - Math.exp(-1 / (P.release * 0.001 * sr)) };
    }
    function initLim(s) { s.box.fill(1); s.bsum = s.L; }

    const src = makeSource(SR), N = src.length;
    const ZN = Math.round(0.03 * SR);
    let key = '', out, gain, stats, inD;
    function analyze() {
      const k = [P.mode, P.attack, P.look, P.release, P.ceiling, P.drive].join();
      if (k === key) return;
      key = k;
      const s = newLim(SR), cf = coefs(SR); initLim(s);
      const lat = s.mode === 'look' ? s.L - 1 : 0;
      for (let i = 0; i < N; i++) step(s, src[i] * cf.drive, cf); // 한 바퀴 예열
      out = new Float32Array(N); gain = new Float32Array(N); inD = new Float32Array(N);
      const tmp = new Float32Array(N), tg = new Float32Array(N);
      for (let i = 0; i < N; i++) { tmp[i] = step(s, src[i] * cf.drive, cf); tg[i] = s.g; }
      // 지연 보정해서 입력과 시간축을 맞춤 (루프라서 앞뒤가 이어짐)
      for (let i = 0; i < N; i++) { out[i] = tmp[(i + lat) % N]; gain[i] = tg[(i + lat) % N]; inD[i] = src[i] * cf.drive; }
      let over = 0, pk = 0; for (let i = 0; i < N; i++) { const v = Math.abs(out[i]); if (v > cf.ceil * 1.0001) over++; if (v > pk) pk = v; }
      let gmin = 1; for (let i = 0; i < N; i++) gmin = Math.min(gmin, gain[i]);
      stats = { over, pk: A.linToDb(pk), lat: lat / SR * 1000, gr: -A.linToDb(gmin) };
    }

    let live = null, liveSrc = null, liveSr = 0, pos = 0, liveKey = '';
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; }
        const lk = P.mode + P.look;
        if (!live || lk !== liveKey) { live = newLim(sr); initLim(live); liveKey = lk; }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc[pos] * cf.drive, cf);
          pos = (pos + 1) % liveSrc.length;
          l[i] = y; r[i] = y;
        }
      },
    });

    return {
      update() { snd.update(); },
      render() {
        analyze();
        const g = ctx.g, W = ctx.width, H = ctx.height, pad = 10, iw = W - pad * 2;
        const h1 = (H - pad * 3) * 0.38, h2 = H - pad * 3 - h1;
        const ceil = A.dbToLin(P.ceiling);
        // 1마디 전체
        A.drawWave(g, out, pad, pad, iw, h1, { color: col, amp: 1, label: GTL.L('1마디 출력 (빨간 선 = 실링)', '1 bar output (red line = ceiling)') });
        for (const sg of [1, -1]) D.line(g, pad, pad + h1 / 2 - sg * ceil * h1 / 2, pad + iw, pad + h1 / 2 - sg * ceil * h1 / 2, C.bad, 1);
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.length; D.line(g, px, pad, px, pad + h1, C.text); }
        // 확대: 첫 킥 30 ms
        const y2 = pad * 2 + h1, amp = 0.8 / Math.max(ceil, 0.05);
        A.drawWave(g, inD, pad, y2, iw, h2, { count: ZN, color: 'rgba(160,170,190,0.45)', amp: amp * 0.5 });
        A.drawWave(g, out, pad, y2, iw, h2, { count: ZN, color: col, amp: amp * 0.5, background: false, axis: false });
        for (const sg of [1, -1]) D.line(g, pad, y2 + h2 / 2 - sg * ceil * amp * 0.5 * h2 / 2, pad + iw, y2 + h2 / 2 - sg * ceil * amp * 0.5 * h2 / 2, C.bad, 1);
        // 초과 지점
        for (let i = 0; i < ZN; i++) if (Math.abs(out[i]) > ceil * 1.0001) { const px = pad + i / (ZN - 1) * iw; D.circle(g, px, y2 + h2 / 2 - U.clamp(out[i] * amp * 0.5, -1, 1) * h2 / 2, 2.5, C.bad); }
        g.beginPath();
        for (let i = 0; i < ZN; i++) { const px = pad + i / (ZN - 1) * iw, py = y2 + (1 - gain[i]) * h2; i ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.strokeStyle = C.warn; g.lineWidth = 1.5; g.stroke();
        D.text(g, GTL.L('확대: 첫 킥 30 ms (회색 = 드라이브 후 입력, 노란 선 = 게인, 빨간 점 = 초과)', 'Zoom: first kick, 30 ms (gray = driven input, yellow = gain, red dots = over)'), pad + 4, y2 + 3, { size: 10, color: C.dim });

        ctx.stat(GTL.L('실링 초과 샘플', 'Samples over ceiling'), stats.over);
        ctx.stat(GTL.L('출력 피크', 'Output peak'), `${stats.pk.toFixed(2)} dBFS (${GTL.L('실링', 'ceiling')} ${P.ceiling})`);
        ctx.stat(GTL.L('최대 게인 리덕션', 'Max gain reduction'), stats.gr.toFixed(1) + ' dB');
        ctx.stat(GTL.L('레이턴시', 'Latency'), stats.lat.toFixed(2) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
