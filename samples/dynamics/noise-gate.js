// 노이즈 게이트: 히스테리시스와 홀드가 없으면 잔향 꼬리에서 게이트가 빠르게 열고 닫힘 (채터링)
GTL.register({
  id: 'noise-gate',
  title: '노이즈 게이트 (히스테리시스와 홀드)',
  summary: '노이즈 게이트는 소리가 작을 때 신호를 막아 바탕 잡음을 없앰. A는 문턱 하나로만 열고 닫아서 톰의 꼬리가 문턱 근처를 지날 때 게이트가 떨듯이 여닫힘(채터링). B는 닫는 문턱을 6 dB 낮추고 홀드를 둬서 한 번만 깔끔하게 닫힘.',
  views: { a: '문턱 하나', b: '히스테리시스 + 홀드' },
  controls: '파라미터 표에서 문턱, 히스테리시스, 홀드, 릴리스를 바꿈. "소리 켜기"로 소리 내는 뷰를 들음.',
  info: `
    <p><b>노이즈 게이트(Noise Gate)</b>는 입력 레벨이 문턱(스레숄드)보다 작으면 출력을 크게 줄이는 장치. 드럼 마이크에 섞인 다른 악기 소리, 기타 앰프의 험, 테이프 히스를 연주가 없는 구간에서 지움.</p>
    <p>문제는 소리가 줄어드는 꼬리 부분. 레벨 검출값은 파형과 잡음 때문에 조금씩 흔들림. 문턱이 하나뿐이면 흔들릴 때마다 열림과 닫힘이 반복되어 "드르륵" 하는 채터링(Chattering)이 들림.</p>
    <ul>
      <li><b>히스테리시스(Hysteresis)</b>: 여는 문턱보다 닫는 문턱을 낮게 둠. 한 번 열리면 레벨이 꽤 내려갈 때까지 닫히지 않음.</li>
      <li><b>홀드(Hold)</b>: 닫힐 조건이 되어도 정해진 시간만큼 열린 상태를 유지</li>
      <li><b>어택, 릴리스</b>: 열고 닫을 때 게인을 서서히 바꿔 딸깍 소리를 막음</li>
      <li><b>레인지(Range)</b>: 닫혔을 때 줄이는 양. 완전히 막지 않고 -20 dB 정도만 줄이면 더 자연스러움.</li>
    </ul>`,
  diagram: (L) => `<svg viewBox="0 0 540 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M30,150 L40,30 L80,60 L120,80 L150,92 Q160,86 168,98 Q176,90 184,102 Q192,94 200,106 L240,124 L300,140 L520,148" class="d-line"/>
    <line x1="20" y1="96" x2="520" y2="96" class="d-a" stroke-dasharray="5 3"/>
    <text x="520" y="90" text-anchor="end" class="t-small t-a">${L('A: 열고 닫는 문턱 하나', 'A: one open/close threshold')}</text>
    <line x1="20" y1="120" x2="520" y2="120" class="d-b" stroke-dasharray="5 3"/>
    <text x="520" y="134" text-anchor="end" class="t-small t-b">${L('B: 닫는 문턱 (6 dB 아래)', 'B: close threshold (6 dB lower)')}</text>
    <text x="40" y="22" class="t-small">${L('검출 레벨', 'Detected level')}</text>
    <rect x="34" y="166" width="118" height="10" class="f-a"/><rect x="160" y="166" width="10" height="10" class="f-a"/><rect x="178" y="166" width="8" height="10" class="f-a"/>
    <rect x="34" y="182" width="250" height="10" class="f-b"/>
    <text x="196" y="175" class="t-small t-a">${L('A: 열림, 닫힘 반복', 'A: open, close, open...')}</text>
    <text x="292" y="191" class="t-small t-b">${L('B: 한 번 열리고 홀드 뒤 닫힘', 'B: opens once, closes after hold')}</text>
  </svg>`,
  look: [
    '아래 게이트 상태 띠에서 A는 톰 꼬리마다 짧은 조각으로 끊겨 있음. B는 타격마다 한 덩어리.',
    '"게이트 여닫힘 횟수"를 비교하면 A가 B보다 몇 배 많음',
    'B의 히스테리시스를 0 dB, 홀드를 0 ms로 바꾸면 B도 채터링이 생김',
    '소리를 켜고 A를 들으면 톰 꼬리에서 "드르륵" 끊기는 소리가 남',
    '레인지를 -12 dB로 올리면 닫혔을 때도 잡음이 약간 남지만 채터링이 덜 거슬림',
  ],
  refs: [
    { type: 'book', title: 'Udo Zölzer (ed.), DAFX: Digital Audio Effects, 2nd ed., Chapter 4', year: 2011, note: '노이즈 게이트와 히스테리시스, 홀드' },
    { type: 'book', title: 'Will Pirkle, Designing Audio Effect Plugins in C++, 2nd ed.', year: 2019, note: '게이트, 익스팬더 구현' },
    { type: 'book', title: 'Mike Senior, Mixing Secrets for the Small Studio', year: 2011, note: '드럼 마이크 게이팅 실전' },
    { type: 'book', title: 'Bobby Owsinski, The Mixing Engineer\'s Handbook', note: '게이트 설정(문턱, 홀드, 레인지) 실무' },
  ],
  params: [
    { key: 'threshold', label: '여는 문턱 (dB)', type: 'range', min: -60, max: -10, step: 1, default: -30, shared: true, group: '게이트' },
    { key: 'hyst', label: '히스테리시스 (dB)', type: 'range', min: 0, max: 12, step: 0.5, default: 6, a: 0, b: 6, help: '닫는 문턱 = 여는 문턱 - 이 값' },
    { key: 'hold', label: '홀드 (ms)', type: 'range', min: 0, max: 200, step: 1, default: 60, a: 0, b: 60 },
    { key: 'release', label: '릴리스 (ms)', type: 'range', min: 1, max: 300, step: 1, default: 60, a: 4, b: 60 },
    { key: 'range', label: '레인지 (dB)', type: 'range', min: -80, max: -6, step: 1, default: -60, shared: true },
    { key: 'noise', label: '바탕 잡음 (dB)', type: 'range', min: -60, max: -20, step: 1, default: -48, shared: true, group: '장면' },
    ...GTL.audio.params(),
  ],
  en: {
    title: 'Noise Gate (Hysteresis and Hold)',
    summary: 'A noise gate blocks the signal when it is quiet, so background noise disappears. A opens and closes with one threshold, so the gate flutters as the tom tail passes the threshold (chattering). B closes 6 dB lower and adds a hold time, so it closes once, cleanly.',
    views: { a: 'One threshold', b: 'Hysteresis + hold' },
    controls: 'Change threshold, hysteresis, hold and release in the parameter table. Press "Sound on" to hear the selected view.',
    info: `
    <p>A <b>noise gate</b> strongly reduces the output when the input is below a threshold. It removes bleed from other drums, guitar amp hum and tape hiss in parts where nothing plays.</p>
    <p>The problem is the decaying tail. The detected level wobbles a little because of the waveform and the noise. With a single threshold, every wobble opens and closes the gate again, and you hear a rattling sound (chattering).</p>
    <ul>
      <li><b>Hysteresis</b>: the close threshold is lower than the open threshold. Once open, the gate stays open until the level falls well down.</li>
      <li><b>Hold</b>: the gate stays open for a set time even after the close condition is met.</li>
      <li><b>Attack, release</b>: change the gain gradually when opening and closing, to avoid clicks.</li>
      <li><b>Range</b>: how much to reduce when closed. Reducing only about 20 dB instead of fully muting sounds more natural.</li>
    </ul>`,
    look: [
      'In the gate state strip at the bottom, A breaks into short pieces on every tom tail. B is one block per hit.',
      'Compare "Gate open/close count". A is several times higher than B.',
      'Set B\'s hysteresis to 0 dB and hold to 0 ms. B starts chattering too.',
      'Turn on sound and listen to A. The tom tails rattle as they cut in and out.',
      'Raise range to -12 dB. Some noise stays when closed, but the chattering is less annoying.',
    ],
    refs: ['Noise gate with hysteresis and hold.', 'Gate and expander code.', 'Gating drum mics in practice.', 'Practical gate settings (threshold, hold, range).'],
    params: {
      threshold: { label: 'Open threshold (dB)', group: 'Gate' },
      hyst: { label: 'Hysteresis (dB)', help: 'Close threshold = open threshold - this value' },
      hold: 'Hold (ms)',
      release: 'Release (ms)',
      range: 'Range (dB)',
      noise: { label: 'Background noise (dB)', group: 'Scene' },
      ...GTL.audio.enParams,
    },
  },

  setup(ctx) {
    const U = GTL.util, D = U.draw, C = U.colors, A = GTL.audio, P = ctx.params;
    const col = ctx.side === 'a' ? C.a : C.b;
    const SR = 24000, BEAT = 0.6;

    // 톰 타격(세기가 다른 4번) + 바탕 잡음 (히스 + 험). 잡음은 따로 두어 레벨을 실시간으로 바꿈
    function makeSource(sr) {
      const n = Math.round(BEAT * 4 * sr), tom = new Float32Array(n), hiss = A.noiseBuffer(n, 21, 'pink');
      const vel = [0.6, 0.35, 0.5, 0.25];
      for (let k = 0; k < 4; k++) {
        const i0 = Math.round(k * BEAT * sr);
        for (let i = 0; i < BEAT * sr && i0 + i < n; i++) {
          const t = i / sr;
          tom[i0 + i] += vel[k] * Math.sin(2 * Math.PI * (95 * t + 40 * (1 - Math.exp(-t * 20)) / 20)) * Math.exp(-t * 7) + vel[k] * 0.2 * hiss[(i * 5) % n] * Math.exp(-t * 40);
        }
      }
      const noise = new Float32Array(n);
      for (let i = 0; i < n; i++) noise[i] = hiss[i] * 0.7 + 0.3 * Math.sin(2 * Math.PI * 60 * i / sr) + 0.15 * Math.sin(2 * Math.PI * 180 * i / sr);
      return { tom, noise, n };
    }
    function coefs(sr) {
      return {
        nz: A.dbToLin(P.noise), open: P.threshold, close: P.threshold - P.hyst, holdN: Math.round(P.hold * 0.001 * sr),
        dR: Math.exp(-1 / (0.01 * sr)), aK: 1 - Math.exp(-1 / (0.0005 * sr)), rK: 1 - Math.exp(-1 / (P.release * 0.001 * sr)), floor: A.dbToLin(P.range),
      };
    }
    // 피크 엔벨로프(릴리스 10 ms) → 상태 기계 → 게인 스무딩
    function step(st, x, k) {
      const a = Math.abs(x);
      st.env = a > st.env ? a : st.env * k.dR;
      const lev = A.linToDb(st.env);
      if (!st.open && lev > k.open) { st.open = true; st.flips++; st.hc = 0; }
      else if (st.open) {
        if (lev < k.close) { if (st.hc >= k.holdN) { st.open = false; st.flips++; } else st.hc++; }
        else st.hc = 0;
      }
      const target = st.open ? 1 : k.floor;
      st.g += (target - st.g) * (target > st.g ? k.aK : k.rK);
      return x * st.g;
    }
    const newSt = () => ({ env: 0, open: false, hc: 0, g: 0, flips: 0 });

    const S = makeSource(SR), N = S.n;
    const COLS = 480;
    let key = '', lev, open, outD, stats;
    function analyze() {
      const k = [P.threshold, P.hyst, P.hold, P.release, P.range, P.noise].join();
      if (k === key) return;
      key = k;
      const s = newSt(), cf = coefs(SR);
      lev = new Float32Array(COLS).fill(-120); open = new Uint8Array(COLS * 4);
      const out = new Float32Array(N);
      let openN = 0;
      for (let i = 0; i < N; i++) {
        const x = S.tom[i] + S.noise[i] * cf.nz;
        out[i] = step(s, x, cf);
        if (s.open) openN++;
        const c = Math.floor(i * COLS / N); lev[c] = Math.max(lev[c], A.linToDb(s.env));
        open[Math.floor(i * COLS * 4 / N)] |= s.open ? 1 : 0;
      }
      const lo = new Float32Array(COLS), hi = new Float32Array(COLS);
      for (let c = 0; c < COLS; c++) { let a = 0, b = 0; for (let i = Math.floor(c * N / COLS); i < Math.floor((c + 1) * N / COLS); i++) { a = Math.min(a, out[i]); b = Math.max(b, out[i]); } lo[c] = a; hi[c] = b; }
      outD = { lo, hi };
      stats = { flips: s.flips, avgOpen: openN / SR * 1000 / Math.max(1, Math.ceil(s.flips / 2)) };
    }

    let live = newSt(), liveSrc = null, liveSr = 0, pos = 0;
    const snd = A.player(ctx, {
      process(l, r, sr, n) {
        if (sr !== liveSr) { liveSrc = makeSource(sr); liveSr = sr; pos = 0; live = newSt(); }
        const cf = coefs(sr);
        for (let i = 0; i < n; i++) {
          const y = step(live, liveSrc.tom[pos] + liveSrc.noise[pos] * cf.nz, cf) * 0.8;
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
        const h1 = (H - pad * 4) * 0.36, h2 = (H - pad * 4) * 0.44, h3 = H - pad * 4 - h1 - h2;
        // 출력 파형
        D.rect(g, pad, pad, iw, h1, 'rgba(0,0,0,0.35)');
        g.beginPath();
        for (let c = 0; c < COLS; c++) { const px = pad + (c + 0.5) * iw / COLS; g.moveTo(px, pad + h1 / 2 - U.clamp(outD.hi[c] * 1.4, -1, 1) * h1 / 2); g.lineTo(px, pad + h1 / 2 - U.clamp(outD.lo[c] * 1.4, -1, 1) * h1 / 2 + 0.5); }
        g.strokeStyle = col; g.lineWidth = Math.max(1, iw / COLS); g.stroke();
        D.text(g, GTL.L('게이트 출력', 'Gate output'), pad + 4, pad + 3, { size: 10, color: C.dim });
        // 검출 레벨과 문턱
        const y2 = pad * 2 + h1, lo = -66, hi = 0, toY = (db) => y2 + h2 - U.clamp((db - lo) / (hi - lo), 0, 1) * h2;
        D.rect(g, pad, y2, iw, h2, 'rgba(0,0,0,0.35)');
        g.beginPath();
        for (let c = 0; c < COLS; c++) { const px = pad + (c + 0.5) * iw / COLS; c ? g.lineTo(px, toY(lev[c])) : g.moveTo(px, toY(lev[c])); }
        g.strokeStyle = C.text; g.lineWidth = 1; g.stroke();
        D.line(g, pad, toY(P.threshold), pad + iw, toY(P.threshold), C.warn, 1.5);
        D.text(g, GTL.L('여는 문턱', 'Open threshold'), pad + iw - 4, toY(P.threshold) - 12, { size: 9, color: C.warn, align: 'right' });
        if (P.hyst > 0) {
          D.line(g, pad, toY(P.threshold - P.hyst), pad + iw, toY(P.threshold - P.hyst), col, 1.5);
          D.text(g, GTL.L('닫는 문턱', 'Close threshold'), pad + iw - 4, toY(P.threshold - P.hyst) + 2, { size: 9, color: col, align: 'right' });
        }
        D.line(g, pad, toY(P.noise), pad + iw, toY(P.noise), C.grid, 1);
        D.text(g, GTL.L('검출 레벨 (dB, 피크 엔벨로프)', 'Detected level (dB, peak envelope)'), pad + 4, y2 + 3, { size: 10, color: C.dim });
        // 게이트 상태 띠
        const y3 = y2 + h2 + pad, cw = iw / (COLS * 4);
        D.rect(g, pad, y3, iw, h3, 'rgba(0,0,0,0.35)');
        for (let c = 0; c < COLS * 4; c++) if (open[c]) D.rect(g, pad + c * cw, y3 + 2, cw + 0.3, h3 - 4, col);
        D.text(g, GTL.L('게이트 열림', 'Gate open'), pad + 4, y3 + 2, { size: 9, color: C.text });
        if (snd.on && liveSrc) { const px = pad + iw * pos / liveSrc.n; D.line(g, px, pad, px, H - pad, C.text); }

        ctx.stat(GTL.L('게이트 여닫힘 횟수 (4타)', 'Gate open/close count (4 hits)'), stats.flips);
        ctx.stat(GTL.L('닫는 문턱', 'Close threshold'), (P.threshold - P.hyst).toFixed(1) + ' dB');
        ctx.stat(GTL.L('한 번 열린 평균 길이', 'Average open length'), stats.avgOpen.toFixed(0) + ' ms');
        snd.stat();
      },
      onAction(k) { if (k === 'sound') snd.toggle(); },
      dispose() { snd.stop(); },
    };
  },
});
